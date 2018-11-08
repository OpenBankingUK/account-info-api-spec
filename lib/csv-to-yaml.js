const fs = require('fs');
const flatten = require('flatten');
const { YAML } = require('swagger-parser'); // eslint-disable-line
const { setSchemaFilename, parseGefegCsv } = require('../lib/util');

let isoDescription = 'ISO date time description.';
const emdeddedDescriptions = [
  'OBCashAccount1',
  'OBBranchAndFinancialInstitutionIdentification2',
  'OBCreditDebitCode',
  'OBCashAccount2',
];

const commonTypes = [ // eslint-disable-line
  'OBRisk2',
  'Links',
  'ISODateTime',
  'Meta',
];

const embedDescription = klass =>
  emdeddedDescriptions.includes(klass);

const assign = (schema, obj) => {
  if (obj) {
    Object.assign(schema, obj);
  }
  return schema;
};

const classFor = (property) => {
  const type = property.Class;
  const name = property.Name;

  if (type && type.endsWith('Text')) {
    return name;
  } else if (type && (
    type === 'ISODateTime'
  )) {
    return `${name}_${type}`;
  } else if (
    type === 'xs:boolean' ||
    type === 'xs:string' ||
    type === 'xs:ID'
  ) {
    return name;
  }
  const path = property.XPath.split('/');
  const parent = path[path.length - 2];

  if ([
    'ActiveOrHistoricCurrencyCode',
    'CurrencyCode',
  ].includes(type)) { // # aka rule 3
    return `${parent}_${type}`;
  } else if ([
    'ActiveOrHistoricCurrencyAndAmount',
    'PhoneNumber',
  ].includes(type)) { // # aka rule 4
    return `${parent}_${name}_${type}`;
  }
  return type;
};

const isArray = p => p.Occurrence && p.Occurrence.match(/\.\.(n|[2-9]+)$/);

/**
 * @description This function returns the type appropriate to the Class of the property
 * @param {*} property The property to evaluate
 */
const typeFor = (property) => {
  const type = property.Class;
  if (type && (
    [
      'xs:anyURI',
      'ISODateTime',
      'xs:string',
      'xs:ID',
      'PhoneNumber',
      'OBActiveCurrencyAndAmount_SimpleType',
    ].includes(type) ||
    type.endsWith('Text') ||
    type.match(/Code([0-9]+$|$)/)
  )) {
    return 'string';
  } else if (type === 'xs:boolean') {
    return 'boolean';
  } else if (
    ['Number', 'BaseOneRate', 'DecimalNumber'].includes(type)
  ) {
    if (property.FractionDigits === '0') return 'integer';
    return 'number';
  }
  return 'object';
};

const enumFor = (property) => {
  if (property.Codes) {
    const values = property.Codes.trim().split('\n');

    if (values[0] && values[0].match(/^.*OBIE.*$/)) {
      return { example: values };
    }

    return { enum: values };
  }
  return null;
};

const setMinProperties = (property) => {
  if (property.Occurrence === '1..n') {
    return 1;
  }
  if (property.Occurrence === '0..n') {
    return 0;
  }
  return null;
};

const formatFor = (property) => {
  if (property.Class === 'ISODateTime') {
    return { format: 'date-time' };
  } else if (property.Class === 'Number' && property.FractionDigits === '0') {
    return { format: 'int32' };
  }
  return null;
};

const descriptionFor = (property) => {
  if (property.EnhancedDefinition) {
    let description = property.EnhancedDefinition.replace(/\n{2,}/g, '\n');
    if (property.Class === 'ISODateTime') {
      // Relying on global here given this is a script rather than a runtime application
      // Pragmatic approach aids readability of the code
      description = `${description}\n${isoDescription}`;
    }
    return { description };
  }
  return null;
};

const useSeparateDefinition = (klass, name) => {
  // TODO: Look at refactoring this to work out a mechanism that can fit across all APIs
  // without the need to list property names
  const separateDefinitions = ['AccountId', 'TransactionInformation'];

  return (
    klass.startsWith('OB') &&
      (!klass.startsWith('OBReadData') ||
        ['OBReadData1', 'OBReadDataResponse1'].includes(klass))
  ) ||
    (separateDefinitions.includes(name));
};

const topLevelFilter = row => row.XPath.split('/').length === 2;

const nextLevelPattern = p => new RegExp(`^${p.XPath}/[^/]+$`);

const nextLevelFilter = p => row => row.XPath.match(nextLevelPattern(p));

const refPlusDescription = (ref, property, rows) => {
  const obj = {
    allOf: [
      ref,
      descriptionFor(property),
    ],
  };
  if (embedDescription(property.Class)) {
    const list = rows.filter(nextLevelFilter(property));
    const ids = list.filter(p => p.Name === 'Identification');
    const names = list.filter(p => p.Name === 'Name');
    const ids2 = list.filter(p => p.Name === 'SecondaryIdentification');
    if (ids.length > 0 || names.length > 0 || ids2.length > 0) {
      const properties = {};
      if (ids.length > 0) { properties.Identification = descriptionFor(ids[0]); }
      if (names.length > 0) { properties.Name = descriptionFor(names[0]); }
      if (ids2.length > 0) { properties.SecondaryIdentification = descriptionFor(ids2[0]); }
      obj.allOf.push({ properties });
    }
  }
  return obj;
};

const arrayProperty = (ref, p, klass, rows) => {
  const setArrayConstraints = (constraints) => {
    const minItems = constraints.match(/^[0-9]+/);
    const maxItems = constraints.match(/(n|[0-9]+)$/);

    if (minItems) {
      const min = parseInt(minItems[0]);
      const max = maxItems ? maxItems[0] : null;

      // Only set min/maxItems for bounded arrays i.e. not 0..n and 0..1
      if (min > 0 || (max !== 'n' && parseInt(max) > 1)) {
        const arrayConstraints = { minItems: parseInt(min) };

        if (max !== 'n') {
          arrayConstraints.maxItems = parseInt(maxItems[0]);
        }

        return arrayConstraints;
      }
    }

    return {};
  };
  const obj = {};
  const items = embedDescription(klass) ? refPlusDescription(ref, p, rows) : Object.assign({}, ref);
  const description = descriptionFor(p);

  // Reduce noise by deleting the items description if it matches array description
  // Could just check if it's an object and if not delete, but still...
  if (description && description.description === items.description) {
    delete items.description;
  }

  assign(obj, { items });
  assign(obj, { type: 'array' });
  if (description) {
    assign(obj, { description: description.description });
  }
  assign(obj, setArrayConstraints(p.Occurrence));

  return obj;
};

const propertyRef = (klass, p, rows) => {
  const ref = { $ref: `#/definitions/${klass}` };

  if (isArray(p)) return arrayProperty(ref, p, klass, rows);
  if (embedDescription(klass)) return refPlusDescription(ref, p, rows);

  return ref;
};

const propertyDef = (p, childSchemas, rows) => {
  const klass = classFor(p);
  if (useSeparateDefinition(p.Class, p.Name) || !childSchemas) {
    return propertyRef(klass, p, rows);
  }
  const schemaObj = childSchemas.filter(s => Object.keys(s)[0] === klass)[0];
  const schema = Object.values(schemaObj)[0];
  if (isArray(p)) {
    const arraySchema = arrayProperty(schema, p, klass, rows);
    return arraySchema;
  }
  return schema;
};

const missingAmount = key =>
  key && (
    key.endsWith('ActiveOrHistoricCurrencyAndAmount') ||
    key.endsWith('CurrencyAndAmount')
  );

// TODO: Revisit naming conventions to/continue discussion on whether this fits in Gefeg
const addMetaLinks = key =>
  (key.match(/OB.*Response[0-9]+$/) || key.match(/^OBRead(?!(Data|Request|Consent1))/));

const propertiesObj = (list, key, childSchemas, rows) => {
  const obj = {};
  list.forEach((p) => {
    const schema = propertyDef(p, childSchemas, rows);
    if (embedDescription(key)) {
      delete schema.description;
    }
    obj[p.Name] = schema;
  });
  if (obj.Data && addMetaLinks(key)) {
    obj.Links = { $ref: '#/definitions/Links' };
    obj.Meta = { $ref: '#/definitions/Meta' };
  }
  if (missingAmount(key) && !obj.Amount) {
    const newObj = assign({ Amount: { $ref: '#/definitions/Amount' } }, obj);
    return newObj;
  }
  return obj;
};

const requiredProp = (list, key) => {
  const required = list.filter(p => !p.Occurrence.startsWith('0'));
  const requiredList = required.map(p => p.Name);
  if (requiredList.indexOf('Data') !== -1 && addMetaLinks(key)) {
    requiredList.push('Links');
    requiredList.push('Meta');
  }
  if (missingAmount(key) && !requiredList.includes('Amount')) {
    return ['Amount'].concat(requiredList);
  }

  if (requiredList.length > 0) {
    return { required: requiredList };
  }

  return {};
};

const maxLengthFor = (property) => {
  const maxPattern = /Max(\d+)\D/;
  const maxMatch = maxPattern.exec(property.Class) ||
    (
      // Add maxLength if there is a value and its either a codeset or not an enum
      property.MaxLength && property.MaxLength !== '' && (property.Codes.match(/\.OBIE\./) || property.Codes.trim() === '') ?
        ['', parseInt(property.MaxLength)] :
        null
    );
  if (maxMatch) {
    return { maxLength: parseInt(maxMatch[1]) };
  }
  return null;
};

const minPattern = /Min(\d+)\D/;

const minLengthFor = (property) => {
  const minMatch = minPattern.exec(property.Class);
  if (maxLengthFor(property)) {
    if (minMatch) {
      return { minLength: parseInt(minMatch[1], 10) };
    }
    return { minLength: 1 };
  }
  return null;
};

const patternFor = (property) => {
  const pattern = property.Pattern;
  if (pattern &&
    pattern.length > 0 &&
    pattern.indexOf('TotalDigits') === -1) {
    return { pattern: property.Pattern };
  }
  return null;
};

const detailPermissionProperties = (permissions, property, properties) => {
  const list = (permissions && permissions.filter(p => p.XPath.startsWith(property.XPath))) || [];
  const detailXPaths = list.map(p => p.XPath);
  const detailProperties = properties.filter(p => detailXPaths.includes(p.XPath));
  return detailProperties;
};

const mandatoryProperties = (detailProperties, permissions) => {
  const requiredXpaths = permissions
    .filter(p => p.Occurrence.startsWith('1..'))
    .map(p => p.XPath);
  return detailProperties
    .filter(p => requiredXpaths.includes(p.XPath))
    .map(p => p.Name);
};

const extendBasicPropertiesObj = (key, detailProperties, rows) => ({ // eslint-disable-line
  allOf: [
    { $ref: `#/definitions/${key}Basic` },
    {
      properties:
        propertiesObj(detailProperties, key, null, rows),
    },
  ],
});

const makeDetailSchema = (key, detailProperties, permissions) => {
  const required = mandatoryProperties(detailProperties, permissions);
  const label = `${key}Detail`;

  return {
    [label]: {
      allOf: [
        { $ref: `#/definitions/${key}` },
      ].concat(required.length > 0 ? [{ required }] : []),
    },
  };
};

const cacheProperty = (property, key, cache) => {
  if (cache) {
    cache.push({
      xpath: property.XPath, key, description: property.EnhancedDefinition,
    });
  }
};

const makeSchema = (property, rows, propertyFilter, permissions, propertiesCache = {}) => {
  const obj = {};
  const properties = rows.filter(propertyFilter || nextLevelFilter(property));
  const detailProperties = detailPermissionProperties(permissions, property, properties);
  const schema = {};
  const key = classFor(property);
  cacheProperty(property, key, propertiesCache.all);

  if (useSeparateDefinition(property.Class, property.Name) && !embedDescription(key)) {
    cacheProperty(property, key, propertiesCache.defined);
  }
  const type = typeFor(property);

  const childSchemas = flatten(properties.map(p =>
    makeSchema(p, rows, null, permissions, propertiesCache))); // eslint-disable-line

  if (descriptionFor(property) && !embedDescription(key)) {
    assign(schema, descriptionFor(property));
  }

  assign(schema, { type });

  if (type === 'object') {
    if (detailProperties.length > 0) {
      assign(schema, extendBasicPropertiesObj(key, detailProperties, rows)); // eslint-disable-line
    } else {
      const childProperties = propertiesObj(properties, key, childSchemas, rows); // eslint-disable-line

      if (Object.keys(childProperties).length === 0 &&
        !property.Class.startsWith('OBRisk') &&
        !property.Class.startsWith('OBPCAData') &&
        !property.Class.startsWith('OBBCAData') &&
        !property.Class.startsWith('OBSupplementaryData')
      ) {
        throw new Error(`Invalid "object" as no properties: ${JSON.stringify(property)}`);
      }
      assign(schema, { properties: childProperties });
      assign(schema, requiredProp(properties, key));
      assign(schema, { additionalProperties: false });
    }
  }

  if (property.Codes && property.Codes.length > 0) {
    assign(schema, enumFor(property));
  }

  if (setMinProperties(property) && type === 'object') {
    assign(schema, { minProperties: setMinProperties(property) });
  }

  assign(schema, minLengthFor(property));
  assign(schema, maxLengthFor(property));
  assign(schema, formatFor(property));
  assign(schema, patternFor(property));
  obj[key] = schema;
  const schemas = [];
  if (schema.allOf) {
    const base = makeSchema(property, rows, null, []);
    const baseSchema = Object.values(base[0])[0];
    const detailKeys = Object.keys(schema.allOf[1].properties);
    detailKeys.forEach((k) => { delete baseSchema.properties[k]; });
    cacheProperty(property, `${key}Basic`, propertiesCache.defined);
    schemas.push({ [`${key}Basic`]: baseSchema });
    delete obj[key].type; // type is on base schema
    delete obj[key].description; // description is on base schema
    schemas.push(obj);
    cacheProperty(property, `${key}Detail`, propertiesCache.defined);
    schemas.push(makeDetailSchema(key, detailProperties, permissions));
  } else {
    obj.property = property;
    schemas.push(obj);
  }
  schemas.push(childSchemas);
  if (missingAmount(key)) {
    schemas.push({
      Amount: {
        type: 'string',
        pattern: '^\\d{1,13}\\.\\d{1,5}$',
      },
    });
  }
  return schemas;
};

const convertRows = (rows, permissions, propertiesCache = {}) => {
  const schemas = flatten(makeSchema(rows[0], rows, topLevelFilter, permissions, propertiesCache));
  const filtered = schemas.filter((s) => {
    const key = Object.keys(s)[0];
    const { property } = s;
    if (property) {
      return useSeparateDefinition(property.Class, property.Name);
    }
    return useSeparateDefinition(key, key);
  });
  return filtered;
};

const convertCSV = (file, outdir, permissions, propertiesCache) => { // eslint-disable-line
  console.log(`\n=== ${file} ===\n`); // eslint-disable-line
  const contents = parseGefegCsv(file);

  // Pack the contents into their constituent objects and then convert to schema
  contents.reduce((objects, line) => {
    const numberObjects = objects.length;

    // A new object starts whenever their is an XPath with only the root node
    if (line.XPath.split('/').length === 1) {
      objects.push([line]);
    } else {
      objects[numberObjects - 1].push(line);
    }
    return objects;
  }, []).forEach((lines) => {
    const schemas = convertRows(lines, permissions, propertiesCache);

    schemas.forEach((schema) => {
      const key = Object.keys(schema)[0];
      if (!commonTypes.includes(key)) {
        const outFile = setSchemaFilename(key, `${outdir}/definitions`);
        if (schema.property) {
          delete schema.property; // eslint-disable-line
        }

        console.log(`Definition file: ${outFile}`);
        fs.writeFileSync(outFile, YAML.stringify(schema));
      }
    });
  });
};

const readYaml = file => YAML.parse(fs.readFileSync(file));

const convertCSVs = (inputDir, outputDir, permissions = []) => {
  const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.csv')
    && f !== 'Enumerations.csv'
    && f !== 'Permissions.csv');

  const propertiesCache = {
    all: [],
    defined: [],
  };

  // Override global value of isoDescription with correct value for version. Fail if not found
  try {
    isoDescription = readYaml(`${outputDir}/readwrite/definitions/ISODateTime.yaml`).ISODateTime.description;
    if (!isoDescription) throw new Error('Could not get ISODateTime description from read/write definitions');
  } catch (e) {
    throw e;
  }

  // OK so this is an out-and-out hack but needs must for the minute
  // The behaviours of this package and the metadata for Account Info and Payment Init conflict each other
  // Need to look for a different approach...
  if (inputDir.match(/payment-init/)) emdeddedDescriptions.push('OBActiveOrHistoricCurrencyAndAmount');

  files.forEach(file => convertCSV(`${inputDir}/${file}`, outputDir, permissions, propertiesCache));
  // deleteWhenDescriptionErrors2(propertiesCache, outputDir);
};

exports.makeSchema = makeSchema;
exports.convertCSV = convertCSV;
exports.convertCSVs = convertCSVs;
exports.convertRows = convertRows;
exports.classFor = classFor;
exports.typeFor = typeFor;
exports.formatFor = formatFor;

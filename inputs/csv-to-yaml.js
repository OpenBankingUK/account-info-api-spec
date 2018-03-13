const parse = require('csv-parse/lib/sync'); // eslint-disable-line
const fs = require('fs');
const flatten = require('flatten');
const { YAML } = require('swagger-parser'); // eslint-disable-line
const uniq = require('lodash/array/uniq'); // eslint-disable-line

const commonTypes = [ // eslint-disable-line
  'OBRisk2',
  'Links',
  'ISODateTime',
  'Meta',
];

const embedDescription = klass =>
  [
    'OBCashAccount1',
    'OBBranchAndFinancialInstitutionIdentification2',
    'OBCreditDebitCode',
    'OBCashAccount2',
  ].includes(klass);

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

const typeFor = (property) => {
  const type = property.Class;
  if (type && (
    [
      'ISODateTime',
      'xs:string',
      'xs:ID',
      'PhoneNumber',
    ].includes(type) ||
    type.endsWith('Text') ||
    type.endsWith('Code')
  )) {
    return 'string';
  } else if (type === 'xs:boolean') {
    return 'boolean';
  } else if (type === 'Number') {
    if (property.FractionDigits === '0') {
      return 'integer';
    }
    return 'number';
  }
  return 'object';
};

const enumFor = (property) => {
  if (property.Codes) {
    return { enum: property.Codes.split('\n') };
  }
  return null;
};

const minOccurrenceFor = (property) => {
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
    return 'int32';
  }
  return null;
};

const descriptionFor = (property, isoDescription) => {
  if (property.EnhancedDefinition) {
    let description = property.EnhancedDefinition.replace(/\n{2,}/g, '\n');
    if (property.Class === 'ISODateTime') {
      description = `${description}\n${isoDescription}`;
    }
    return { description };
  }
  return null;
};

const itemsFor = (property, isoDescription) => ({
  items: Object.assign(
    descriptionFor(property, isoDescription),
    { type: 'string' },
    enumFor(property),
  ),
});

const useSeparateDefinition = (klass, name, separateDefinitions = []) =>
  (
    klass.startsWith('OB') &&
    (
      !klass.startsWith('OBReadData')
      || ['OBReadData1', 'OBReadDataResponse1'].includes(klass)
    )
  ) ||
  (
    separateDefinitions.includes(name) &&
    klass !== 'ActiveOrHistoricCurrencyAndAmount'
  );

const isArray = p => p.Occurrence && p.Occurrence.endsWith('..n');

const arrayProperty = (ref, p, isoDescription) => {
  const obj = {
    items: ref,
    type: 'array',
  };
  assign(obj, descriptionFor(p, isoDescription));
  if (minOccurrenceFor(p)) {
    assign(obj, { minItems: minOccurrenceFor(p) });
  }
  return obj;
};

const topLevelFilter = row => row.XPath.split('/').length === 2;

const nextLevelPattern = p => new RegExp(`^${p.XPath}/[^/]+$`);

const nextLevelFilter = p => row => row.XPath.match(nextLevelPattern(p));

const refPlusDescription = (ref, property, isoDescription, rows) => {
  const obj = {
    allOf: [
      ref,
      descriptionFor(property, isoDescription),
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

const propertyRef = (klass, p, isoDescription, rows) => {
  const ref = { $ref: `#/definitions/${klass}` };
  if (isArray(p)) {
    return arrayProperty(ref, p);
  } else if (embedDescription(klass)) {
    return refPlusDescription(ref, p, isoDescription, rows);
  }
  return ref;
};

const propertyDef = (p, childSchemas, separateDefinitions, isoDescription, rows) => {
  const klass = classFor(p);
  if (useSeparateDefinition(p.Class, p.Name, separateDefinitions) || !childSchemas) {
    return propertyRef(klass, p, isoDescription, rows);
  }
  const schemaObj = childSchemas.filter(s => Object.keys(s)[0] === klass)[0];
  const schema = Object.values(schemaObj)[0];
  return schema;
};

const propertiesObj = (list, key, childSchemas, separateDefinitions = [], isoDescription, rows) => {
  const obj = {};
  list.forEach((p) => {
    const schema = propertyDef(p, childSchemas, separateDefinitions, isoDescription, rows);
    if (embedDescription(key)) {
      delete schema.description;
    }
    obj[p.Name] = schema;
  });
  if (key && key.endsWith('ActiveOrHistoricCurrencyAndAmount') && !obj.Amount) {
    const newObj = assign({ Amount: { $ref: '#/definitions/Amount' } }, obj);
    return newObj;
  }
  return obj;
};

const requiredProp = (list, key) => {
  const required = list.filter(p => !p.Occurrence.startsWith('0'));
  const requiredList = required.map(p => p.Name);
  if (key.endsWith('ActiveOrHistoricCurrencyAndAmount') &&
    !requiredList.includes('Amount')) {
    return ['Amount'].concat(requiredList);
  }
  return requiredList;
};

const maxPattern = /Max(\d+)\D/;

const maxLengthFor = (property) => {
  const maxMatch = maxPattern.exec(property.Class);
  if (maxMatch) {
    return { maxLength: parseInt(maxMatch[1], 10) };
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

const mandatoryForKey = (key) => {
  if (key === 'OBAccount1') {
    return ['Account'];
  }
  return [];
};

const extendBasicPropertiesObj = (key, detailProperties, separateDefinitions, isoDescription, rows) => ({ // eslint-disable-line
  allOf: [
    { $ref: `#/definitions/${key}Basic` },
    {
      properties:
        propertiesObj(detailProperties, key, null, separateDefinitions, isoDescription, rows),
    },
  ],
});

const makeDetailSchema = (key) => {
  const required = mandatoryForKey(key);
  const label = `${key}Detail`;
  const detail = {
    [label]: {
      allOf: [
        { $ref: `#/definitions/${key}` },
      ],
    },
  };
  if (required.length > 0) {
    detail[label].allOf.push({ required });
  }
  return detail;
};

const cacheProperty = (property, key, cache) => {
  if (cache) {
    cache.push({
      xpath: property.XPath, key, description: property.EnhancedDefinition,
    });
  }
};

const makeSchema = (
  property, rows, propertyFilter, permissions,
  separateDefinitions, isoDescription, propertiesCache = {},
) => {
  const obj = {};
  const properties = rows.filter(propertyFilter || nextLevelFilter(property));
  const detailProperties = detailPermissionProperties(permissions, property, properties);
  const schema = {};
  const key = classFor(property);
  cacheProperty(property, key, propertiesCache.all);

  if (useSeparateDefinition(property.Class, property.Name, separateDefinitions)
    && !embedDescription(key)) {
    cacheProperty(property, key, propertiesCache.defined);
  }
  const type = typeFor(property);

  const childSchemas = flatten(properties.map(p =>
    makeSchema(p, rows, null, permissions, separateDefinitions, isoDescription, propertiesCache))); // eslint-disable-line

  if (descriptionFor(property) && !embedDescription(key)) {
    assign(schema, descriptionFor(property, isoDescription));
  }
  assign(schema, { type });
  if (type === 'object') {
    if (detailProperties.length > 0) {
      assign(schema, extendBasicPropertiesObj(key, detailProperties, separateDefinitions, isoDescription, rows)); // eslint-disable-line
    } else {
      const childProperties = propertiesObj(properties, key, childSchemas, separateDefinitions, isoDescription, rows); // eslint-disable-line
      if (Object.keys(childProperties).length === 0 &&
        !property.Class.startsWith('OBRisk') &&
        !property.Class.startsWith('OBPCAData') &&
        !property.Class.startsWith('OBBCAData')
      ) {
        throw new Error(`Invalid "object" as no properties: ${JSON.stringify(property)}`);
      }
      assign(schema, { properties: childProperties });
      if (requiredProp(properties, key).length > 0) {
        assign(schema, { required: requiredProp(properties, key) });
      }
      assign(schema, { additionalProperties: false });
    }
  }
  if (type === 'array') {
    assign(schema, itemsFor(property, isoDescription));
  } else if (property.Codes && property.Codes.length > 0) {
    assign(schema, enumFor(property));
  }
  if (minOccurrenceFor(property) && type === 'object') {
    assign(schema, {
      minProperties: minOccurrenceFor(property),
    });
  }
  assign(schema, minLengthFor(property));
  assign(schema, maxLengthFor(property));
  assign(schema, formatFor(property));
  assign(schema, patternFor(property));
  obj[key] = schema;
  const schemas = [];
  if (schema.allOf) {
    const base = makeSchema(property, rows, null, [], separateDefinitions, isoDescription);
    const baseSchema = Object.values(base[0])[0];
    const detailKeys = Object.keys(schema.allOf[1].properties);
    detailKeys.forEach((k) => { delete baseSchema.properties[k]; });
    cacheProperty(property, `${key}Basic`, propertiesCache.defined);
    schemas.push({ [`${key}Basic`]: baseSchema });
    delete obj[key].type; // type is on base schema
    delete obj[key].description; // description is on base schema
    schemas.push(obj);
    cacheProperty(property, `${key}Detail`, propertiesCache.defined);
    schemas.push(makeDetailSchema(key));
  } else {
    obj.property = property;
    schemas.push(obj);
  }
  schemas.push(childSchemas);
  if (key.endsWith('ActiveOrHistoricCurrencyAndAmount')) {
    schemas.push({
      Amount: {
        type: 'string',
        pattern: '^\\d{1,13}\\.\\d{1,5}$',
      },
    });
  }
  return schemas;
};

const convertRows = (rows, permissions, separateDefinitions = [], isoDescription, propertiesCache = {}) => { // eslint-disable-line
  const schemas = flatten(makeSchema(
    rows[0], rows, topLevelFilter, permissions,
    separateDefinitions, isoDescription, propertiesCache,
  ));
  const filtered = schemas.filter((s) => {
    const key = Object.keys(s)[0];
    const { property } = s;
    if (property) {
      return useSeparateDefinition(property.Class, property.Name, separateDefinitions);
    }
    return useSeparateDefinition(key, key, separateDefinitions);
  });
  return filtered;
};

const normalizeHeaders = text => Buffer.from(text, 'utf-8')
  .toString('utf-8')
  .replace(/"Composition or Attribute\//g, '"')
  .replace(/"Notes\//g, '"')
  .replace(/"Class, data type of a composition or attribute\/Name/g, '"Class')
  .replace(/"Class, data type of a composition or attribute\//g, '"');

const parseCsv = (file) => {
  const text = fs.readFileSync(file);
  const lines = parse(normalizeHeaders(text), { columns: true, delimiter: ';' });
  return lines;
};

const schemaFile = (key, outdir) => {
  const defDir = `${outdir}/accounts/definitions`;
  if (!fs.existsSync(defDir)) {
    fs.mkdirSync(defDir);
  }
  const outFile = `${defDir}/${key}.yaml`;
  console.log(outFile);
  return outFile;
};

const convertCSV = (dir, file, outdir, permissions, separateDefinitions, isoDescription, propertiesCache) => { // eslint-disable-line
  console.log('==='); // eslint-disable-line
  console.log(file); // eslint-disable-line
  console.log('---'); // eslint-disable-line
  const lines = parseCsv(file);
  // console.log(JSON.stringify(lines, null, 2)); // eslint-disable-line
  const schemas = convertRows(lines, permissions, separateDefinitions, isoDescription, propertiesCache); // eslint-disable-line
  schemas.forEach((schema) => {
    const key = Object.keys(schema)[0];
    if (!commonTypes.includes(key)) {
      const outFile = schemaFile(key, outdir);
      if (schema.property) {
        delete schema.property; // eslint-disable-line
      }
      fs.writeFileSync(outFile, YAML.stringify(schema));
    }
  });
};

const readYaml = file => YAML.parse(fs.readFileSync(file));

const deleteWhenDescriptionErrors = (propertiesCache, outdir) => {
  const definedProperties = propertiesCache.defined;
  console.log(YAML.stringify(definedProperties)); // eslint-disable-line
  const keyToDescription = [];
  definedProperties.forEach(x =>  // eslint-disable-line
    keyToDescription[x.key] = (keyToDescription[x.key] || new Set()).add(x.description));

  const descriptions = Object.keys(keyToDescription).map(key => ({
    key,
    descriptions: Array.from(keyToDescription[key]),
  }));
  const dups = descriptions.filter(x => x.descriptions.length > 1);
  if (dups.length > 0) {
    console.log(JSON.stringify(dups, null, 2));
    console.log(`dup keys count:${dups.length}`);
    dups.forEach((dup) => {
      try {
        const file = schemaFile(dup.key, outdir);
        console.log(`delete: ${file}`);
        fs.unlinkSync(file);
      } catch (e) {
        console.log(e.message);
      }
    });
  }
};

const normalizeText = text => text.replace(/\r?\n|\r/g, ' ').replace(/ +/g, ' ');

const deleteWhenDescriptionErrors2 = (propertiesCache, outdir) => {
  deleteWhenDescriptionErrors(propertiesCache, outdir);
  const outfiles = propertiesCache.defined
    .map(p => p.key)
    .filter(k => !commonTypes.includes(k))
    .map(k => schemaFile(k, outdir));
  const schemas = uniq(outfiles).map(file =>
    normalizeText(Buffer.from(fs.readFileSync(file, 'utf8')).toString()));

  propertiesCache.all.forEach((p) => {
    const description = normalizeText(p.description);
    const matches = schemas.filter(s => s.indexOf(description) !== -1);
    if (matches.length === 0 && p.key !== 'OBRisk2') {
      throw new Error(`no match for: \n${description}\n ${JSON.stringify(p)}`);
    }
  });
  console.log(schemas[0]);
};

const convertCSVs = (dir, outdir, separateDefinitions) => {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.csv')
    && f !== 'Enumerations.csv'
    && f !== 'Permissions.csv');
  const permissionsFile = `${dir}/Permissions.csv`;
  const permissions = parseCsv(permissionsFile);
  const propertiesCache = {
    all: [],
    defined: [],
  };
  const isoDescription = readYaml(`${outdir}/readwrite/definitions/ISODateTime.yaml`).ISODateTime.description;
  files.forEach(file =>
    convertCSV(dir, `${dir}/${file}`, outdir, permissions, separateDefinitions, isoDescription, propertiesCache));
  deleteWhenDescriptionErrors2(propertiesCache, outdir);
};

exports.makeSchema = makeSchema;
exports.convertCSV = convertCSV;
exports.convertCSVs = convertCSVs;
exports.convertRows = convertRows;
exports.classFor = classFor;
exports.typeFor = typeFor;
exports.formatFor = formatFor;

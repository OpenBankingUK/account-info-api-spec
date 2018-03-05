const parse = require('csv-parse/lib/sync'); // eslint-disable-line
const fs = require('fs');
const flatten = require('flatten');
const { YAML } = require('swagger-parser'); // eslint-disable-line

const commonTypes = [ // eslint-disable-line
  'OBExternalRequestStatus1Code',
  'CreationDateTime_ISODateTime',
  'OBRisk2',
  'Links',
  'ISODateTime',
  'Meta',
  'OBExternalAccountIdentification2Code',
  'Identification_Max34Text',
  'Identification_Max35Text',
  'SecondaryIdentification_Max34Text',
];

const classFor = (property) => {
  const type = property.Class;

  if (type && type.endsWith('Text')) {
    return property.Name;
  } else if (type && (
    type === 'ISODateTime'
  )) {
    return `${property.Name}_${type}`;
  } else if (
    type === 'xs:boolean' ||
    type === 'xs:string'
  ) {
    return property.Name;
  } else if (
    type === 'ActiveOrHistoricCurrencyAndAmount' ||
    type === 'ActiveOrHistoricCurrencyCode'
  ) { // # aka rule 3
    const path = property.XPath.split('/');
    const parent = path[path.length - 2];
    return `${parent}_${type}`;
  } else if (type === 'ActiveOrHistoricCurrencyAndAmount') { // # aka rule 4
    const path = property.XPath.split('/');
    const parent = path[path.length - 2];
    return `${parent}_${property.Name}_${type}`;
  }
  return type;
};

const typeFor = (property) => {
  const type = property.Class;
  if (property.Occurrence === '1..n') {
    return 'array';
  } else if (type && (
    type === 'ISODateTime' ||
    type === 'xs:string' ||
    type.endsWith('Text') ||
    type.endsWith('Code')
  )) {
    return 'string';
  } else if (type === 'xs:boolean') {
    return 'boolean';
  }
  return 'object';
};

const enumFor = (property) => {
  if (property.Codes) {
    return { enum: property.Codes.split('\n') };
  }
  return null;
};

const minPropertiesFor = (property) => {
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
  }
  return null;
};

const descriptionFor = (property) => {
  if (property.EnhancedDefinition) {
    return { description: property.EnhancedDefinition };
  }
  return null;
};

const itemsFor = property => ({
  items: Object.assign(
    descriptionFor(property),
    { type: 'string' },
    enumFor(property),
  ),
});

const propertiesObj = (list, key, childSchemas, separateDefinitions = []) => {
  const obj = {};
  list.forEach((p) => {
    if (p.Class.startsWith('OB') || !childSchemas || separateDefinitions.includes(p.Name)) {
      const ref = { $ref: `#/definitions/${classFor(p)}` };
      if (p.Occurrence && p.Occurrence.endsWith('..n')) {
        obj[p.Name] = {
          items: ref,
          type: 'array',
        };
      } else {
        obj[p.Name] = ref;
      }
    } else {
      const schema = childSchemas.filter(s => Object.keys(s)[0] === classFor(p))[0];
      obj[p.Name] = Object.values(schema)[0]; // eslint-disable-line
    }
  });
  if (key && key.endsWith('ActiveOrHistoricCurrencyAndAmount') && !obj.Amount) {
    return Object.assign({ Amount: { $ref: '#/defintions/Amount' } }, obj);
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
    return parseInt(maxMatch[1], 10);
  }
  return null;
};

const minPattern = /Min(\d+)\D/;

const minLengthFor = (property) => {
  const minMatch = minPattern.exec(property.Class);
  if (minMatch) {
    return parseInt(minMatch[1], 10);
  }
  return 1;
};

const patternFor = (property) => {
  if (property.Pattern && property.Pattern.length > 0) {
    return { pattern: property.Pattern };
  }
  return null;
};

const topLevelFilter = row => row.XPath.split('/').length === 2;

const nextLevelPattern = p => new RegExp(`^${p.XPath}/[^/]+$`);

const nextLevelFilter = p => row => row.XPath.match(nextLevelPattern(p));

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

const extendBasicPropertiesObj = (key, detailProperties, separateDefinitions) => ({
  allOf: [
    { $ref: `#/definitions/${key}Basic` },
    {
      properties: propertiesObj(detailProperties, key, null, separateDefinitions),
    },
  ],
});

const makeDetailSchema = key => ({
  [`${key}Detail`]: {
    type: 'object',
    allOf: [
      { $ref: `#/definitions/${key}` },
      { required: mandatoryForKey(key) },
    ],
  },
});

const makeSchema = (
  property, rows, propertyFilter, permissions,
  separateDefinitions, allProperties = [],
) => {
  const obj = {};
  const properties = rows.filter(propertyFilter || nextLevelFilter(property));
  const detailProperties = detailPermissionProperties(permissions, property, properties);
  const schema = {};
  const key = classFor(property);
  allProperties.push({
    xpath: property.XPath, key, description: property.EnhancedDefinition,
  }); // eslint-disable-line
  const type = typeFor(property);

  const childSchemas = flatten(properties.map(p => makeSchema(p, rows, null, permissions, separateDefinitions, allProperties))); // eslint-disable-line

  if (descriptionFor(property)) {
    Object.assign(schema, descriptionFor(property));
  }
  Object.assign(schema, { type });
  if (type === 'object') {
    if (detailProperties.length > 0) {
      Object.assign(schema, extendBasicPropertiesObj(key, detailProperties, separateDefinitions));
    } else {
      const childProperties = propertiesObj(properties, key, childSchemas, separateDefinitions);
      Object.assign(schema, { properties: childProperties });
      // Object.assign(schema, { additionalProperties: false });
      if (requiredProp(properties, key).length > 0) {
        Object.assign(schema, { required: requiredProp(properties, key) });
      }
    }
  }
  if (type === 'array') {
    Object.assign(schema, itemsFor(property));
  } else if (property.Codes && property.Codes.length > 0) {
    Object.assign(schema, enumFor(property));
  }
  if (minPropertiesFor(property)) {
    Object.assign(schema, {
      minProperties: minPropertiesFor(property),
      // additionalProperties: false,
    });
  }
  if (maxLengthFor(property)) {
    Object.assign(schema, {
      minLength: minLengthFor(property),
      maxLength: maxLengthFor(property),
    });
  }
  if (formatFor(property)) {
    Object.assign(schema, formatFor(property));
  }
  if (patternFor(property)) {
    Object.assign(schema, patternFor(property));
  }
  obj[key] = schema;
  const schemas = [];
  if (schema.allOf) {
    const base = makeSchema(property, rows, null, [], separateDefinitions);
    const baseSchema = Object.values(base[0])[0];
    const detailKeys = Object.keys(schema.allOf[1].properties);
    detailKeys.forEach((k) => { delete baseSchema.properties[k]; });
    schemas.push({ [`${key}Basic`]: baseSchema });
    schemas.push(obj);
    schemas.push(makeDetailSchema(key));
  } else {
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

const convertRows = (rows, permissions, separateDefinitions = [], allProperties = []) => {
  const schemas = flatten(makeSchema(
    rows[0], rows, topLevelFilter, permissions,
    separateDefinitions, allProperties,
  ));
  console.log(JSON.stringify(schemas, null, 2)); // eslint-disable-line
  return schemas;
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

const convertCSV = (dir, file, outdir, permissions, allProperties) => {
  console.log('==='); // eslint-disable-line
  console.log(file); // eslint-disable-line
  console.log('---'); // eslint-disable-line
  const lines = parseCsv(file);
  console.log(JSON.stringify(lines, null, 2)); // eslint-disable-line
  const separateDefinitions = ['AccountId'];
  const schemas = convertRows(lines, permissions, separateDefinitions, allProperties);
  schemas.forEach((schema) => {
    const key = Object.keys(schema)[0];
    const path = commonTypes.includes(key) ? 'readwrite' : 'accounts';
    const defDir = `${outdir}/${path}/definitions`;
    if (!fs.existsSync(defDir)) {
      fs.mkdirSync(defDir);
    }
    const outFile = `${defDir}/${Object.keys(schema)[0]}.yaml`;
    fs.writeFileSync(outFile, YAML.stringify(schema));
  });
};

const convertCSVs = (dir = './data_definition/v1.1', outdir) => {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.csv')
    && f !== 'Enumerations.csv'
    && f !== 'Permissions.csv');
  const permissionsFile = `${dir}/Permissions.csv`;
  const permissions = parseCsv(permissionsFile);
  const allProperties = [];
  files.forEach(file => convertCSV(dir, `${dir}/${file}`, outdir, permissions, allProperties));
  console.log(YAML.stringify(allProperties)); // eslint-disable-line
  const keyToDescription = [];
  allProperties.forEach((x) => {
    const { key, description } = x;
    keyToDescription[key] = (keyToDescription[key] || new Set()).add(description);
  });
  const descriptions = Object.keys(keyToDescription).map(key => ({
    key,
    d: Array.from(keyToDescription[key]),
  }));
  const dups = descriptions.filter(x => x.d.length > 1);
  console.log(JSON.stringify(dups, null, 2)); // eslint-disable-line
  console.log('dup keys count:' + dups.length); // eslint-disable-line
};

exports.makeSchema = makeSchema;
exports.convertCSV = convertCSV;
exports.convertCSVs = convertCSVs;
exports.convertRows = convertRows;
exports.classFor = classFor;
exports.typeFor = typeFor;

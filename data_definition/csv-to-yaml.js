const parse = require('csv-parse/lib/sync'); // eslint-disable-line
const fs = require('fs');
const flatten = require('flatten');
const { YAML } = require('swagger-parser'); // eslint-disable-line

const commonTypes = [ // eslint-disable-line
  'OBExternalRequestStatus1Code',
  'CreationDateTime_ISODateTime',
  'OBRisk2',
  'Amount',
  'Links',
  'ISODateTime',
  'Meta',
  'x-fapi-financial-id-Param',
  'x-fapi-customer-ip-address-Param',
  'x-fapi-interaction-id-Param',
  'x-fapi-customer-last-logged-time-Param',
  'AuthorizationParam',
  'x-jws-signature-Param',
  '400ErrorResponse',
  '401ErrorResponse',
  '403ErrorResponse',
  '405ErrorResponse',
  '406ErrorResponse',
  '429ErrorResponse',
  '500ErrorResponse',
  'PSU_OAuth2Security',
  'TPP_OAuth2Security',
];

const classFor = (property) => {
  const type = property.Class;
  if (type && (
    type === 'ISODateTime' ||
    type.endsWith('Text')
  )) {
    return `${property.Name}_${type}`;
  } else if (
    type === 'xs:boolean' ||
    type === 'xs:string'
  ) {
    return property.Name;
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

const propertiesObj = (list, key) => {
  const obj = {};
  list.forEach((p) => {
    obj[p.Name] = { $ref: `#/definitions/${classFor(p)}` };
  });
  if (key === 'ActiveOrHistoricCurrencyAndAmount' && !obj.Amount) {
    return Object.assign({ Amount: { $ref: '#/defintions/Amount' } }, obj);
  }
  return obj;
};

const requiredProp = (list, key) => {
  const required = list.filter(p => !p.Occurrence.startsWith('0'));
  const requiredList = required.map(p => p.Name);
  if (key === 'ActiveOrHistoricCurrencyAndAmount' &&
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

const nextLevelFilter = p => row => row.XPath.startsWith(`${p.XPath}/`);

const makeSchema = (property, rows, propertyFilter) => {
  const obj = {};
  const properties = rows.filter(propertyFilter || nextLevelFilter(property));
  const schema = {};
  const key = classFor(property);
  const type = typeFor(property);
  if (descriptionFor(property)) {
    Object.assign(schema, descriptionFor(property));
  }
  Object.assign(schema, { type });
  if (type === 'object') {
    Object.assign(schema, {
      properties: propertiesObj(properties, key),
    });
    Object.assign(schema, {
      additionalProperties: false,
    });
    if (requiredProp(properties, key).length > 0) {
      Object.assign(schema, { required: requiredProp(properties, key) });
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
      additionalProperties: false,
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
  const childSchemas = properties.map(p => makeSchema(p, rows));
  let schemas = [obj].concat(childSchemas);
  if (key === 'ActiveOrHistoricCurrencyAndAmount') {
    schemas = schemas.concat({
      Amount: {
        type: 'string',
        pattern: '^\\d{1,13}\\.\\d{1,5}$',
      },
    });
  }
  return schemas;
};

const convertRows = (rows) => {
  const schemas = flatten(makeSchema(rows[0], rows, topLevelFilter));
  console.log(JSON.stringify(schemas, null, 2)); // eslint-disable-line
  return schemas;
};

const convertCSV = (dir, file) => {
  console.log('==='); // eslint-disable-line
  console.log(file); // eslint-disable-line
  console.log('---'); // eslint-disable-line
  const text = fs.readFileSync(file);
  const lines = parse(text, { columns: true, delimiter: ';' });
  console.log(JSON.stringify(lines, null, 2)); // eslint-disable-line
  const schemas = convertRows(lines);
  schemas.forEach((schema) => {
    const key = Object.keys(schema)[0];
    const defDir = `${dir}/definitions`;
    const subdir = `${defDir}/${commonTypes.includes(key) ? 'common' : 'accounts'}`;
    if (!fs.existsSync(defDir)) {
      fs.mkdirSync(defDir);
    }
    if (!fs.existsSync(subdir)) {
      fs.mkdirSync(subdir);
    }
    const outFile = `${subdir}/${Object.keys(schema)[0]}.yaml`;
    fs.writeFileSync(outFile, YAML.stringify(schema));
  });
};

const convertCSVs = (dir = './data_definition/v1.1') => {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.csv')
    && f !== 'Enumerations.csv'
    && f !== 'Permissions.csv');
  files.forEach(file => convertCSV(dir, `${dir}/${file}`));
};

exports.makeSchema = makeSchema;
exports.convertCSV = convertCSV;
exports.convertCSVs = convertCSVs;
exports.convertRows = convertRows;
exports.classFor = classFor;
exports.typeFor = typeFor;

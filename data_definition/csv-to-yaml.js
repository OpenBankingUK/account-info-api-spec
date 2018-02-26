const parse = require('csv-parse/lib/sync'); // eslint-disable-line
const fs = require('fs');
const flatten = require('flatten');

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

const propertiesObj = (list) => {
  const obj = {};
  list.forEach((p) => {
    obj[p.Name] = { $ref: `#/definitions/${classFor(p)}` };
  });
  return obj;
};

const requiredProp = (list) => {
  const required = list.filter(p => !p.Occurrence.startsWith('0'));
  return required.map(p => p.Name);
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

const topLevelFilter = row => row.XPath.split('/').length === 2;

const nextLevelFilter = p => row => row.XPath.startsWith(`${p.XPath}/`);

const makeSchema = (property, rows, propertyFilter) => {
  const obj = {};
  const properties = rows.filter(propertyFilter || nextLevelFilter(property));
  const schema = {};
  const type = typeFor(property);
  if (descriptionFor(property)) {
    Object.assign(schema, descriptionFor(property));
  }
  Object.assign(schema, { type });
  if (type === 'object') {
    Object.assign(schema, {
      properties: propertiesObj(properties),
    });
    Object.assign(schema, {
      additionalProperties: false,
    });
    if (requiredProp(properties).length > 0) {
      Object.assign(schema, { required: requiredProp(properties) });
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
  obj[classFor(property)] = schema;
  const childSchemas = properties.map(p => makeSchema(p, rows));
  const schemas = [obj].concat(childSchemas);
  return schemas;
};

const convertRows = (rows) => {
  const schemas = flatten(makeSchema(rows[0], rows, topLevelFilter));
  console.log(JSON.stringify(schemas, null, 2)); // eslint-disable-line
  return schemas;
};

const convertCSV = (file) => {
  const text = fs.readFileSync(file);
  const lines = parse(text, { columns: true, delimiter: ';' });
  console.log(JSON.stringify(lines, null, 2)); // eslint-disable-line
  convertRows(lines);
};

exports.makeSchema = makeSchema;
exports.convertCSV = convertCSV;
exports.convertRows = convertRows;
exports.classFor = classFor;
exports.typeFor = typeFor;

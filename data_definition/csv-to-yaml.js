const parse = require('csv-parse/lib/sync'); // eslint-disable-line
const fs = require('fs');
const flatten = require('flatten');

const classFor = (property) => {
  if (property.Class === 'ISODateTime') {
    return `${property.Name}_${property.Class}`;
  }
  return property.Class;
};

const typeFor = (property) => {
  if (property.Class === 'ISODateTime') {
    return 'string';
  }
  if (property.Occurrence === '1..n') {
    return 'array';
  }
  return 'object';
};

const itemsFor = property => ({
  items: {
    description: property.EnhancedDefinition,
    enum: property.Codes.split('\n'),
    type: 'string',
  },
});

const minPropertiesFor = (property) => {
  if (property.Occurrence === '1..n') {
    return '1';
  }
  if (property.Occurrence === '0..n') {
    return '0';
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

const topLevelFilter = row => row.XPath.split('/').length === 2;

const nextLevelFilter = p => row => row.XPath.startsWith(`${p.XPath}/`);

const makeSchema = (property, rows, propertyFilter) => {
  const obj = {};
  const properties = rows.filter(propertyFilter);
  const schema = {};
  const type = typeFor(property);
  if (type === 'object') {
    Object.assign(schema, {
      additionalProperties: false,
      properties: propertiesObj(properties),
    });
    if (requiredProp(properties).length > 0) {
      Object.assign(schema, { required: requiredProp(properties) });
    }
  }
  if (descriptionFor(property)) {
    Object.assign(schema, descriptionFor(property));
  }
  if (minPropertiesFor(property)) {
    Object.assign(schema, {
      additionalProperties: false,
      minProperties: minPropertiesFor(property),
    });
  }
  if (formatFor(property)) {
    Object.assign(schema, formatFor(property));
  }
  if (type === 'array') {
    Object.assign(schema, itemsFor(property));
  }
  Object.assign(schema, { type });
  obj[classFor(property)] = schema;
  const childSchemas = properties.map(p =>
    makeSchema(p, rows, nextLevelFilter(p)));
  return [obj].concat(childSchemas);
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

exports.convertCSV = convertCSV;
exports.convertRows = convertRows;

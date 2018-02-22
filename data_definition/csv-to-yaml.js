const parse = require('csv-parse/lib/sync'); // eslint-disable-line
const fs = require('fs');

const classFor = (property) => {
  if (property.Class === 'ISODateTime') {
    return `${property.Name}_${property.Class}`;
  }
  return property.Class;
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
  obj[property.Class] = {
    additionalProperties: false,
    properties: propertiesObj(properties),
    required: requiredProp(properties),
    type: 'object',
  };
  return obj;
};

const convertRows = (rows) => {
  const topLevel = makeSchema(rows[0], rows, topLevelFilter);
  const properties = rows.filter(topLevelFilter);
  const secondLevel = properties.map(property =>
    makeSchema(property, rows, nextLevelFilter(property)));
  return [topLevel].concat(secondLevel);
};

const convertCSV = (file) => {
  const text = fs.readFileSync(file);
  const lines = parse(text, { columns: true, delimiter: ';' });
  console.log(JSON.stringify(lines, null, 2)); // eslint-disable-line
  convertRows(lines);
};

exports.convertCSV = convertCSV;
exports.convertRows = convertRows;

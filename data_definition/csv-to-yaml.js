const parse = require('csv-parse/lib/sync'); // eslint-disable-line
const fs = require('fs');

const propertiesObj = (list) => {
  const obj = {};
  list.forEach((p) => {
    obj[p.Name] = { $ref: `#/definitions/${p.Class}` };
  });
  return obj;
};

const requiredProp = (list) => {
  const required = list.filter(p => !p.Occurrence.startsWith('0'));
  return required.map(p => p.Name);
};

const convertRows = (rows) => {
  const topLevel = {};
  const topProperties = rows.filter(row => row.XPath.split('/').length === 2);
  topLevel[rows[0].Name] = {
    additionalProperties: false,
    properties: propertiesObj(topProperties),
    required: requiredProp(topProperties),
    type: 'object',
  };
  return [topLevel];
};

const convertCSV = (file) => {
  const text = fs.readFileSync(file);
  const lines = parse(text, { columns: true, delimiter: ';' });
  console.log(JSON.stringify(lines, null, 2));
  convertRows(lines);
};

exports.convertCSV = convertCSV;
exports.convertRows = convertRows;

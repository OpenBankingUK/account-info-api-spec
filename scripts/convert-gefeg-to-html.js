const fs = require('fs');
const argv = require('yargs') // eslint-disable-line
  .argv;
const { CsvToHtmlTable } = require('../lib/gefeg-export');
let data = '';

argv._.forEach((file) => {
  const table = CsvToHtmlTable(file);
  data += `<h2>${table.name}</h2>${table.body}`;
});

console.log(data);

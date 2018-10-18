const fs = require('fs');
const argv = require('yargs') // eslint-disable-line
  .argv;
const { CsvToMarkdownTable } = require('../lib/gefeg-export');

argv._.forEach((file) => {
  const table = CsvToMarkdownTable(file);
  table.rows.forEach(row => console.log(row));
});

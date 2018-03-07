const { convertCSVs } = require('./csv-to-yaml'); // eslint-disable-line
const fs = require('fs');

const separateDefinitions = [
  'AccountId',
  'Amount',
  'CurrencyAndAmount',
  'TransactionInformation',
];

const versions = fs.readdirSync('./data_definition').filter(d => d.startsWith('v'));

versions.forEach(version =>
  convertCSVs(`./data_definition/${version}`, `./inputs/${version}`, separateDefinitions));

const { convertCSVs } = require('./csv-to-yaml'); // eslint-disable-line
const fs = require('fs');

const separateDefinitions = [
  'AccountId',
  'Amount',
  'CurrencyAndAmount',
  'TransactionInformation',
];

const versions = fs.readdirSync('./inputs').filter(d => d.startsWith('v'));

versions.filter(v => v.startsWith('v2')).forEach(version =>
  convertCSVs(`./inputs/${version}/data_definition`, `./inputs/${version}`, separateDefinitions));

const { convertCSVs } = require('./csv-to-yaml'); // eslint-disable-line

const separateDefinitions = [
  'AccountId',
  'Amount',
  'CurrencyAndAmount',
  'TransactionInformation',
];

convertCSVs('./data_definition/v1.1', './inputs/v1.1', separateDefinitions);
convertCSVs('./data_definition/v2.0', './inputs/v2.0', separateDefinitions);

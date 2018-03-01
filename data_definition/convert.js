const { convertCSVs } = require('./csv-to-yaml'); // eslint-disable-line

convertCSVs('./data_definition/v1.1', './inputs/v1.1');
convertCSVs('./data_definition/v2.0', './inputs/v2.0');

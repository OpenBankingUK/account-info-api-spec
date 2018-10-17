const { convertCSVs } = require('../lib/csv-to-yaml'); // eslint-disable-line
const { parseGefegCsv } = require('../lib/util');

const argv = require('yargs') // eslint-disable-line
  .describe('input', 'Input directory where data definitions are found')
  .describe('output', 'Root directory where the API definition where the definition sub-directory can be found')
  .describe('permissions', 'CSV file containing permissions data (nominally for Account Information API)')
  .demandOption(['input', 'output'])
  .argv;

// Convert the CSV files found in the target directory
convertCSVs(argv.input, argv.output, argv.permissions ? parseGefegCsv(argv.permissions) : []);

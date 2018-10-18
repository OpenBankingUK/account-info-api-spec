const fs = require('fs');
const argv = require('yargs') // eslint-disable-line
  .describe('referenceDir', 'The directory where existing types can be read from')
  .describe('mergeDescriptions', 'Comma-delimited list of definitions whose description should be merged into Gefeg')
  .demandOption(['referenceDir'])
  .argv;
const { YAML } = require('swagger-parser'); // eslint-disable-line

const { Definitions, CsvToSwagger } = require('../lib/gefeg-export');

const externalReferences = {};

// Grab all references defined outside of Gefeg
fs.readdirSync(argv.referenceDir)
  .filter(file => file.endsWith('.yaml'))
  .forEach((filename) => {
    const typeDefinition = YAML.parse(fs.readFileSync(`${argv.referenceDir}/${filename}`, 'utf-8'));
    // Expect to find only one definition in each file
    const typeName = Object.keys(typeDefinition)[0];
    externalReferences[typeName] = typeDefinition[typeName];
  });

const swaggerDefinitions = Definitions();
const mergeDescriptions = argv.mergeDescriptions ? argv.mergeDescriptions.split(',') : [];

// Convert all the files, collecting up the object references throughout the document
argv._.forEach((file) => {
  // Convert the CSV file to a JSON object and hoover up all placeholder references to classes
  const definition = CsvToSwagger(file, externalReferences, mergeDescriptions);
  swaggerDefinitions.addDefinition(definition);
});

console.log('\n=== Finding common definitions ===\n');

fs.writeFileSync('test-file.yaml', YAML.stringify(swaggerDefinitions.render(), null, 2));

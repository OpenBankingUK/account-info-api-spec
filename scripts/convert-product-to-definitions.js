const fs = require('fs');
const { YAML } = require('swagger-parser');

const { setSchemaFilename } = require('../lib/util');

const argv = require('yargs') // eslint-disable-line
  .usage('Usage: $0 --output [Output directory] [List of product schema files]')
  .describe('output', 'Directory where objects will be written')
  .demandCommand(2)
  .demandOption(['output'])
  .argv;

/**
 * @description Write the schema file
 * @param {*} key Name of the source object
 * @param {*} type The target object name
 * @param {*} schemas The source schemas
 * @param {*} outdir the directory to write the output to
 */
const writeSchema = (key, type, schemas, outdir) => {
  const outFile = setSchemaFilename(type, outdir);
  const definition = { [type]: schemas[key] };

  fs.writeFileSync(outFile, YAML.stringify(definition));
  console.log(`Created file: ${outFile}`);
};
const schemas = {};

// Read all positional parameters
argv._.forEach((file) => {
  const schema = JSON.parse(fs.readFileSync(`${file}`));
  Object.assign(schemas, schema);
});

// Ensure that both PCA and BCA schemas are present
if (!schemas.BCA || !schemas.PCA) {
  throw new Error('Missing required open data schema files: (BCA|PCA)');
}

// Write the output files
writeSchema('PCA', 'OBPCAData1', schemas, argv.output);
writeSchema('BCA', 'OBBCAData1', schemas, argv.output);

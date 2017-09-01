const refParser = require('json-schema-ref-parser');
const version = process.env.VERSION;
const jsonPath = process.argv[2] || './schemas/' + version;
const distPath = process.argv[3] || './dist';
const glob = require('glob');
const YAML = require('json2yaml');
const utils = require('./utils');
const Ajv = require('ajv');
const ajv = new Ajv();
const fs = require('fs');
const fWrite = utils.writeToFile;  // Convenient method name shortening

// Example usage:
// node flatten-json.js ../opendata-api-spec/schemas/v1.1/ ./dist
// jsonPath: ../opendata-api-spec/schemas/v1.1/  location where all jsonSchemas are, which require flattening
// distPath: location/path to write the flattened schemas to

glob('*/*.json', {
  cwd: jsonPath
}, (err, filenames) => {
  if (err) {
    console.log(err);
    throw err;
  }
  var promises = [];
  filenames.forEach(filename => {
    promises.push(processFile(filename));
  });
  Promise.all(promises)
    .then((res) => {
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
});


function processFile(filename) {
  return new Promise((resolve, reject) => {
    if (filename.slice(-12) === 'example.json') {
      fs.readFile(jsonPath + '/' + filename, 'utf8', function (err, data) {
        const schema = JSON.parse(data);
        const yamlSchema = YAML.stringify(schema);
        const destination = distPath + '/' + filename;
        const destinationYaml = distPath + '/' + filename.replace('.json', '.yaml');
        return Promise.all([
          fWrite(utils.beautifySchema(schema), destination),
          fWrite(yamlSchema, destinationYaml)
        ]);
      })
    }
    else {
      refParser
        .dereference(jsonPath + '/' + filename)
        .then((flattenedSchema) => {
          const valid = ajv.validateSchema(flattenedSchema);
          if (!valid) {
            console.log(ajv.errors);
            throw ajv.errors;
          }
          const beautifiedSchema = utils.beautifySchema(flattenedSchema);
          const yamlSchema = YAML.stringify(flattenedSchema);
          const destination = distPath + '/' + filename;
          const destinationYaml = distPath + '/' + filename.replace('.json', '.yaml');
          return Promise.all([
            fWrite(beautifiedSchema, destination),
            fWrite(yamlSchema, destinationYaml)
          ]);
        })
        .then(() => {
          console.log('Correctly flattened ', filename);
          resolve();
        })
        .catch(err => {
          console.log('Failed while flattening ', filename);
          console.log(err);
          reject(err);
        });
    }
  })
}

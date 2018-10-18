const fs = require('fs');
const argv = require('yargs') // eslint-disable-line
  .describe('input', 'Source Swagger document')
  .describe('output', 'Target OpenAPI document')
  .describe('addPermissionGroups', 'Group permissions in oneOf objects, identified by Basic|Detail')
  .demandOption(['input', 'output'])
  .default('addPermissionGroups', true)
  .argv;

const OpenAPIDocument = require('../lib/swagger-to-openapi').create;

const swagger = fs.readFileSync(argv.input, 'utf-8');
OpenAPIDocument(swagger).render(argv.addPermissionGroups)
  .then(document => fs.writeFileSync(argv.output, document))
  .catch(err => console.error(`Conversion failed with message: ${err.message}`));


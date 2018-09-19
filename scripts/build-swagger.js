const { YAML } = require('swagger-parser'); // eslint-disable-line
const yaml = require('js-yaml'); // eslint-disable-line
const SwaggerParser = require('swagger-parser'); // eslint-disable-line
const fs = require('fs');
const find = require('find');

const { typeFor, collapseAllOf } = require('../lib/util');
const { mergeAllOf } = require('../lib/standards/conventions');

// Using yargs to parameterise the inputs/outputs to this script
// so it doesn't rely on a specific directory structyre
const argv = require('yargs') // eslint-disable-line
  .describe('input', 'Input directory where files to generate Swagger can be found')
  .describe('apiversion', 'The version of the API to be generated e.g. v2.0.0')
  .describe('output', 'Directory where Swagger specifications will be written')
  .describe('permissionVariants', 'Optional, set --permissionVariants to generate basic/detail permission variants')
  .demandOption(['input', 'apiversion', 'output'])
  .argv;

const readYaml = file => YAML.parse(fs.readFileSync(file));

const fileListToObject = (items, dir) => {
  const obj = {};
  items.forEach(file => Object.assign(obj, readYaml(`${dir}/${file.$ref}`)));
  return obj;
};

const importSection = (api, dir, section) => {
  console.log(`section: ${section}`);
  const items = api[section];
  console.log(`${YAML.stringify(items)}`);
  const obj = fileListToObject(items, dir);
  api[section] = obj; // eslint-disable-line
};

const importPaths = (api, dir) => {
  for (const path in api.paths) { // eslint-disable-line
    const items = api.paths[path];
    console.log(`path: ${path}`);
    console.log(`${YAML.stringify(items)}`);
    const obj = fileListToObject(items, dir);
    api.paths[path] = obj; // eslint-disable-line
  }
};

const writePermissionSpecificOutput = (outFile, api, permissionType) => {
  console.log(permissionType);
  const permissionTypePattern = new RegExp(`${permissionType}$`);
  const definitions = Object.keys(api.definitions).filter(k => k.endsWith(permissionType));

  let swagger = JSON.stringify(api, null, 2);
  definitions.forEach((permissionSpecificSchema) => {
    const genericSchema = permissionSpecificSchema.replace(permissionTypePattern, '');
    swagger = swagger.replace(`definitions/${genericSchema}"`, `definitions/${permissionSpecificSchema}"`);
  });
  fs.writeFileSync(`${outFile}-${permissionType.toLowerCase()}.json`, swagger);
};

const writeOutput = (outFile, api, permissionVariants) => {
  const path = outFile.split('/');
  path.pop();
  const outDir = path.join('/');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }

  if (permissionVariants) {
    writePermissionSpecificOutput(outFile, api, 'Basic');
    writePermissionSpecificOutput(outFile, api, 'Detail');
  }

  fs.writeFileSync(`${outFile}.yaml`, yaml.safeDump(api, { noRefs: true }));
  fs.writeFileSync(`${outFile}.json`, JSON.stringify(api, null, 2));
};

const writeDereferenced = (outFile, api) => {
  const out = JSON.parse(JSON.stringify(api));
  fs.writeFileSync(`${outFile}.yaml`, YAML.stringify(out));
};

const logE = (e) => {
  console.log(e.message); // eslint-disable-line
  console.log(Object.keys(e)); // eslint-disable-line
  console.log(e); // eslint-disable-line
};

const deduplicateRequestResponse = (api, req, res) => {
  if (api.definitions[req] && api.definitions[res]) {
    const request = api.definitions[req];
    const response = api.definitions[res];
    Object.keys(request.properties).forEach((p) => {
      const match = request.properties[p].description === response.properties[p].description;
      if (match) {
        delete response.properties[p];
      }
    });
    request.required.forEach((r) => {
      const index = response.required.indexOf(r);
      if (index !== -1) {
        response.required.splice(index, 1);
      }
    });
    const newSchema = { // eslint-disable-line
      allOf: [
        { $ref: `#/definitions/${req}` },
        { properties: response.properties },
        { required: response.required },
      ],
    };
    api.definitions[res] = newSchema; // eslint-disable-line
  }
};

const sortKeys = (obj) => {
  collapseAllOf(obj);
  Object.keys(obj).sort().forEach((key) => {
    const value = obj[key];
    delete obj[key]; // eslint-disable-line
    obj[key] = value; // eslint-disable-line
    const type = typeFor(value);
    if (type === 'object') {
      sortKeys(value);
    } else if (type === 'array') {
      const itemType = typeFor(value[0]);
      if (itemType === 'string') {
        value.sort();
      } else if (itemType === 'object' && value[0].name) {
        value.sort((a, b) => a.name.localeCompare(b.name));
      }
      value.forEach((item) => {
        if (typeFor(item) === 'object') { sortKeys(item); }
      });
    }
  });
  return obj;
};

const cloneApi = api => JSON.parse(JSON.stringify(api));

/**
 * @description Process the inputs from a given directory
 * @param {*} file The index.yaml File acts as a marker for API definition files
 * @param {*} version The version ascribed to the Swagger document
 */
const process = async (file, version, outputDir, permissionVariants) => {
  try {
    // Grab the name of the directory index.yaml was found in and use for the filename
    const inputDir = file.replace('/index.yaml', '');
    const apiName = inputDir.split('/').pop();

    console.log(`\n=== Starting: ${apiName} ===\n`);

    const api = readYaml(file);
    importPaths(api, inputDir);
    importSection(api, inputDir, 'definitions');
    importSection(api, inputDir, 'parameters');
    importSection(api, inputDir, 'responses');
    importSection(api, inputDir, 'securityDefinitions');
    deduplicateRequestResponse(api, 'OBReadData1', 'OBReadDataResponse1');

    // Pass in version so it can be set in output document rather than retained from template
    // const { version } = api.info;
    api.info.version = version;

    console.log('Validating Swagger document...\n');
    const valid = await SwaggerParser.validate(cloneApi(api));

    console.log('API name: %s, Version: %s', valid.info.title, version);
    writeOutput(`${outputDir}/${apiName}-swagger-with-allof`, api);

    console.log('Applying OBIE conventions...\n');
    const withoutAllOf = await mergeAllOf(api);
    writeOutput(`${outputDir}/${apiName}-swagger`, withoutAllOf, permissionVariants);

    const deref = await SwaggerParser.dereference(cloneApi(api));
    delete deref.definitions;
    delete deref.parameters;
    const successes = Object.keys(deref.responses).filter(k => k.startsWith('20'));
    successes.forEach(k => delete deref.responses[k]);
    writeDereferenced(`${outputDir}/${apiName}-swagger-dereferenced`, sortKeys(deref));

    const old = await SwaggerParser.dereference(readYaml(`${outputDir}/${apiName}-swagger.yaml`));
    writeDereferenced(`${outputDir}/${apiName}-swagger-dereferenced`, sortKeys(old));

    console.log(`\n=== Completed: ${apiName} ===\n`);
  } catch (e) {
    throw e;
  }
};

try {
  // Loop through each version and index.yaml file found and build the Swagger
  find.eachfile('index.yaml', argv.input, (file) => {
    process(file, argv.apiversion, argv.output, argv.permissionVariants);
  });
} catch (e) {
  logE(e); // eslint-disable-line
  throw e;
}

const YAML = require('js-yaml');
const SwaggerParser = require('swagger-parser');
const utils = require('./utils');
const path = require('path');
const compiled = path.resolve('../compiled');
const version = process.env.VERSION;
const dist = path.resolve('../dist');
const distV = path.resolve('../dist/' + version);
const swaggerIndex = path.resolve('../apis/' + version + '/swagger/index.yaml');
const debuglogfile = path.resolve('../debug/log.json');

// Convenient method name shortenings
const fWrite = utils.writeToFile;
const beaut = utils.beautifySchema;

// Debug Shizzle
const sDebug = process.env.SWAGGER_DEBUG === 'true';
const APPEND = true;
function jsonWrapper(title, string) {
  return '"' + title + '": ' + "\n" + string + ",\n";
}

function jsonLogger(title, obj) {
  fWrite(jsonWrapper(title, beaut(obj)), debuglogfile, APPEND);
}
if (sDebug) fWrite("{ \n", debuglogfile); // Start Debug LogFile
// End Debug Shizzle


// https://github.com/BigstickCarpet/swagger-parser/blob/releases/4.0.0/docs/options.md
const SwaggerParserOptions = {
  validate: {
    spec: true,
    schema: true
  }
};


SwaggerParser.dereference(swaggerIndex, SwaggerParserOptions,
  (err, api /* , metadata */) => {
    if (err) {
      console.error(err);
      throw err
    }

    let apiFixed = flatten_parameters(api);  // Mitigate the Array of Arrays Prohblem

    if (sDebug) {
      setTimeout(() => {
        jsonLogger('FIXED API Code ', apiFixed);
        fWrite("\n" + '"end": "end"}', debuglogfile, APPEND);
      }, 0);
    }

    fWrite(YAML.safeDump(api, {lineWidth: 200}), compiled + '/swagger/account-info-swagger.yaml');
    fWrite(JSON.stringify(api, null, 2), compiled + '/swagger/account-info-swagger.json');
    // temporary....
    fWrite(YAML.safeDump(api, {lineWidth: 200}), dist + '/account-info-swagger.yaml');
    fWrite(JSON.stringify(api, null, 2), dist + '/account-info-swagger.json');

    fWrite(YAML.safeDump(api, {lineWidth: 200}), distV + '/account-info-swagger.json');
  }
);


function flatten(arr) {
  return Array.prototype.concat(...arr);
}

function flatten_parameters(api) {

  let apiFlatter = {};
  Object.assign(apiFlatter, api);
  const paths = Object.keys(api.paths); // e.g. /account, /balances

  if (sDebug) jsonLogger('OLD_JSON', apiFlatter); // Show "broken" version

  paths.map((path) => {

    let pathPartial = api.paths[path];

    if (sDebug) {
      let pp = '** outer path = ' + path + ' ** pathPartial ';
      jsonLogger(pp, pathPartial);
    }

    if (typeof pathPartial.length === 'number') {
      // Fix for yaml parsing error where objects become under a 1 element array [{}]
      pathPartial = pathPartial[0];
      apiFlatter.paths[path] = pathPartial;
    }

    let methods = Object.keys(pathPartial); // e.g. get, post, delete

    methods.map((method) => {
      let methodPartial = pathPartial[method];
      if (methodPartial.parameters) {
        // Fix for parameters becoming an array of arrays [[{}],[{},{}]] => [{},{},{}]
        let flatParams = flatten(methodPartial.parameters);
        if (sDebug) {
          let pmf = '**** path = ' + path + ' ** method = ' + method + ' PARAMETERS FLATTENED  = ';
          jsonLogger(pmf, flatParams);
        }
        apiFlatter.paths[path][method].parameters = flatParams;
      }
    })
  });
  return apiFlatter;
}

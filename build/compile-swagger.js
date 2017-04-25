const YAML = require('js-yaml');
const SwaggerParser = require('swagger-parser');
const utils = require('./utils');
const path = require('path');
const swaggerDir = './compiled/swagger';
const compiled = path.resolve('../compiled');
const dist = path.resolve('../dist');

var swaggerIndex = path.resolve('../apis/v0/swagger/index.yaml');

//https://github.com/BigstickCarpet/swagger-parser/blob/releases/4.0.0/docs/options.md
const SwaggerParserOptions = {
  validate: {
    spec: true,
    schema: true
  }
};
SwaggerParser.dereference(swaggerIndex, SwaggerParserOptions,
  (err, api, metadata) => {
    if (err) {
      console.error(err);
      throw err
    }
    utils.writeToFile(YAML.safeDump(api, { lineWidth: 200 }), compiled + '/swagger/account-info-swagger.yaml')
    utils.writeToFile(JSON.stringify(api, null, 2), compiled + '/swagger/account-info-swagger.json')
    // temporary....
    utils.writeToFile(YAML.safeDump(api, { lineWidth: 200 }), dist + '/account-info-swagger.yaml')
    utils.writeToFile(JSON.stringify(api, null, 2), dist + '/account-info-swagger.json')
});

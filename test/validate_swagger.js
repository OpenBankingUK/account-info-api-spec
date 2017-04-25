'use strict';

var SwaggerParser = require('swagger-parser');
var YAML = require('js-yaml');
var fs = require('fs');
var path = require('path');
var swaggerFilePath = path.resolve('./compiled/swagger/account-info-swagger.yaml');

const spec = YAML.load(fs.readFileSync(swaggerFilePath).toString());

describe('Swagger Spec Test', function() {

    it('It should be a valid v2.0 Yaml Swagger specification', function(done) {
      SwaggerParser.validate(spec)
      .then(function(api) {
        done();
      })
      .catch(done)
    });

});

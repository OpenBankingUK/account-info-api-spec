const { YAML } = require('swagger-parser');
const SwaggerParser = require('swagger-parser');

function OpenAPIDocument(swagger) {
  // SwaggerTools.validate(swagger);

  this.swagger = JSON.parse(swagger);
  this.openapi = {
    openapi: '3.0.1',
    info: {},
    paths: {},
    components: {
      parameters: {},
      requestBodies: {},
      responses: {},
      schemas: {},
      securitySchemes: {},
    },
  };

  return this;
}

function RewriteDocument(obj, regex, replacement) {
  // Quick and dirty - but it'll do the job
  return JSON.parse(JSON.stringify(obj).replace(regex, replacement));
}

function RewriteDefinitions(obj) {
  return RewriteDocument(obj, new RegExp(/#\/definitions\//g), '#/components/schemas/');
}

function CreateContentObject(mimeType, schema) {
  const content = {};
  content[mimeType] = { schema };

  return content;
}

OpenAPIDocument.prototype.convertInfo = function convertInfo() {
  this.openapi.info = this.swagger.info;
};

OpenAPIDocument.prototype.convertPaths = function convertPaths() {
  const paths = RewriteDocument(this.swagger.paths, new RegExp(/#\/responses\//g), '#/components/responses/');

  // Rewrite paths, adding requestBody property and setting up correct content types
  Object.keys(paths).forEach((path) => {
    Object.keys(paths[path]).forEach((method) => {
      paths[path][method].parameters = paths[path][method].parameters
        .reduce((parameters, parameter) => {
          const parameterName = parameter.$ref.match(/[a-zA-Z-]+$/);
          const parameterReference = this.openapi.components.parameters[parameterName[0]];

          if (!parameterReference) {
            paths[path][method].requestBody = { $ref: parameter.$ref.replace('parameters', 'components/requestBodies') };
          } else {
            parameters.push({ $ref: parameter.$ref.replace('parameters', 'components/parameters') });
          }

          return parameters;
        }, []);

      if (paths[path][method].consumes) {
        paths[path][method].consumes.forEach((mimeType) => {
          paths[path][method].parameters.forEach((parameter) => {
            if (parameter.$ref.match('requestBodies')) {
              const requestBodyName = parameter.$ref.match(/[a-zA-Z0-9-]+$/);

              if (!this.openapi.components.requestBodies[requestBodyName].content[mimeType]) {
                this.openapi.components.requestBodies[requestBodyName].content[mimeType] =
                  this.openapi.components.requestBodies[requestBodyName].content['application/json'];

                if (paths[path][method].consumes.indexOf('application/json') === -1) {
                  delete this.openapi.components.requestBodies[requestBodyName].content['application/json'];
                }
              }
            }
          });
        });

        delete paths[path][method].consumes;
      }

      if (paths[path][method].produces) {
        paths[path][method].produces.forEach((mimeType) => {
          const response = paths[path][method].responses['200'] ||
            paths[path][method].responses['201'] ||
            paths[path][method].responses['202'];
          const responseObjectName = response.$ref.match(/[[0-9a-zA-Z-]+$/);

          if (!this.openapi.components.responses[responseObjectName].content[mimeType]) {
            throw new Error('Could not map content type in responses');
          }
        });

        delete paths[path][method].produces;
      }
    });
  });

  this.openapi.paths = paths;
};

OpenAPIDocument.prototype.convertParameters = function convertParameters() {
  if (this.swagger.parameters) {
    const parameters = RewriteDefinitions(this.swagger.parameters);

    Object.keys(parameters)
      .filter(key => parameters[key].in !== 'body')
      .forEach((key) => {
        this.openapi.components.parameters[key] = parameters[key];
        const schema = {};

        ['type', 'pattern', 'format', 'maxLength'].forEach((property) => {
          if (this.openapi.components.parameters[key][property]) {
            schema[property] = parameters[key][property];
            delete this.openapi.components.parameters[key][property];
          }
        });
        this.openapi.components.parameters[key].schema = schema;
      });

    return this.openapi.components.parameters;
  }

  return null;
};

OpenAPIDocument.prototype.convertRequestBodies = function convertRequestBodies() {
  if (this.swagger.parameters) {
    const parameters = RewriteDefinitions(this.swagger.parameters);

    Object.keys(parameters)
      .filter(key => parameters[key].in === 'body')
      .forEach((key) => {
        // TODO: Sort out assumptions i.e. required, mime type
        this.openapi.components.requestBodies[key] = {
          description: parameters[key].description,
          content: CreateContentObject('application/json', parameters[key].schema),
          required: true,
        };
      });

    return this.openapi.components.requestBodies;
  }

  return null;
};

OpenAPIDocument.prototype.convertResponses = function convertResponses() {
  if (this.swagger.responses) {
    const responses = RewriteDefinitions(this.swagger.responses);

    Object.keys(responses)
      .forEach((key) => {
        const responseBody = responses[key];

        if (responseBody.headers) {
          Object.keys(responseBody.headers)
            .forEach((header) => {
              if (responseBody.headers[header].type) {
                responseBody.headers[header].schema = { type: responseBody.headers[header].type };
                delete responseBody.headers[header].type;
              }
            });
        }
        if (responseBody.schema) {
          // If this is a Swagger 2.0 style file type kill it
          responseBody.content = responseBody.schema.type === 'file'
            ? CreateContentObject('*/*', { type: 'string', format: 'binary' })
            : CreateContentObject('application/json', responseBody.schema);
          delete responseBody.schema;
        }
        this.openapi.components.responses[key] = responseBody;
      });

    return this.openapi.components.responses;
  }

  return null;
};

OpenAPIDocument.prototype.convertSchemas = function convertSchemas() {
  this.openapi.components.schemas = RewriteDefinitions(this.swagger.definitions);
  return this.openapi.components.schemas;
};

OpenAPIDocument.prototype.convertSecuritySchemes = function convertSecuritySchemes() {
  if (this.swagger.securityDefinitions) {
    this.openapi.components.securitySchemes = this.swagger.securityDefinitions;

    // Only evaluate OAuth 2 flows - other security definitions should copy across as-is
    Object.keys(this.openapi.components.securitySchemes)
      .filter(key => this.openapi.components.securitySchemes[key].type === 'oauth2')
      .forEach((key) => {
        const definition = this.swagger.securityDefinitions[key];
        const flow = {
          accessCode: {
            authorizationCode: {
              authorizationUrl: definition.authorizationUrl,
              tokenUrl: definition.tokenUrl,
              scopes: definition.scopes,
            },
          },
          application: {
            clientCredentials: { tokenUrl: definition.tokenUrl, scopes: definition.scopes },
          },
        }[definition.flow];

        if (!flow) {
          throw new Error(`Unsupported OAuth flow: ${definition[key].flow}`);
        }

        this.openapi.components.securitySchemes[key] = {
          type: 'oauth2',
          description: this.swagger.securityDefinitions[key].description || 'OAuth flow',
          flows: flow,
        };
      });

    return this.openapi.components.securitySchemes;
  }

  return null;
};

OpenAPIDocument.prototype.addPermissionGroups = function addPermissionGroups() {
  const groupings = Object.keys(this.openapi.components.schemas)
    .filter(schemaName => schemaName.match(/(Basic|Detail)$/))
    .reduce((typeMap, schemaObjectName) => {
      const rootTypeName = schemaObjectName.replace(/(Basic|Detail)$/, '');
      const schemaReference = { $ref: `#/components/schemas/${schemaObjectName}` };

      if (typeMap[rootTypeName]) {
        typeMap[rootTypeName].push(schemaReference);
      } else {
        typeMap[rootTypeName] = [schemaReference]; //eslint-disable-line
      }

      return typeMap;
    }, []);

  Object.keys(groupings).forEach((schemaObjectName) => {
    this.openapi.components.schemas[schemaObjectName] = {
      oneOf: groupings[schemaObjectName],
    };
  });
};

OpenAPIDocument.prototype.render = async function render(addPermissionGroups, format = 'YAML') {
  this.convertInfo();
  this.convertSchemas();
  this.convertParameters();
  this.convertRequestBodies();
  this.convertResponses();
  this.convertSecuritySchemes();
  this.convertPaths();

  if (addPermissionGroups) {
    this.addPermissionGroups();
  }

  await SwaggerParser.validate(JSON.parse(JSON.stringify(this.openapi)));

  return format === 'YAML' ? YAML.stringify(this.openapi, null, 2) : JSON.stringify(this.openapi, null, 2);
};

function create(swagger) {
  return new OpenAPIDocument(swagger);
}

module.exports = {
  create,
};


const SwaggerParser = require('swagger-parser'); // eslint-disable-line
const { collapseAllOf } = require('./utils');

const cloneApi = api => JSON.parse(JSON.stringify(api));

const containsAllOf = obj =>
  JSON.stringify(obj).indexOf('allOf') !== -1;

const removeAllOfFrom = (obj) => {
  if (obj && containsAllOf(obj)) {
    Object
      .keys(obj)
      .forEach((key) => {
        const prop = { [key]: obj[key] };
        collapseAllOf(prop);
        Object.assign(obj, prop);
      });
  }
};

const customTransactionBasicFix = (api, dereferencedApi) => {
  ['OBTransaction1Basic', 'OBTransaction2Basic'].forEach((name) => {
    if (api.definitions[name]) {
      const indicator = {
        CreditDebitIndicator: dereferencedApi.definitions[name].properties.CreditDebitIndicator,
      };
      collapseAllOf(indicator);
      Object.assign(api.definitions[name].properties, indicator);
    }
  });
};

const removeAllOf = async (apiObj) => {
  const api = cloneApi(apiObj);
  const dereferencedApi = await SwaggerParser.validate(cloneApi(api));

  const { definitions } = api;
  Object
    .entries(definitions)
    .filter(def => !def[0].endsWith('Basic') && !def[0].endsWith('Detail'))
    .filter(def => containsAllOf(def[1]))
    .forEach((def) => {
      const name = def[0];
      console.log(`remove allOf: ${name}`);
      const definition = { [name]: dereferencedApi.definitions[name] };
      collapseAllOf(definition);
      removeAllOfFrom(definition[name].properties);
      Object.assign(definitions, definition);
    });

  customTransactionBasicFix(api, dereferencedApi);

  if (api.definitions.OBAccount2) {
    const items = collapseAllOf({ items: api.definitions.OBAccount2.properties.Account.items });
    Object.assign(api.definitions.OBAccount2.properties.Account, items);
  }
  return api;
};

exports.removeAllOf = removeAllOf;

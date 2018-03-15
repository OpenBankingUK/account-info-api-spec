const { YAML } = require('swagger-parser'); // eslint-disable-line
const SwaggerParser = require('swagger-parser'); // eslint-disable-line

const typeFor = (obj) => {
  const type = typeof (obj);
  if (type === 'object' && obj.length) {
    return 'array';
  }
  return type;
};

const mergeNestedObjects = (firstObject, secondObject) => {
  const finalObject = {};

  if (firstObject) {
    Object.keys(firstObject).forEach((propertyKey) => {
      const propertyValue = firstObject[propertyKey];
      if (typeof (propertyValue) === 'object' && secondObject) {
        finalObject[propertyKey] =
          mergeNestedObjects(firstObject[propertyKey], secondObject[propertyKey]);
      } else if (!secondObject || secondObject[propertyKey] === undefined) {
        finalObject[propertyKey] = firstObject[propertyKey];
      } else {
        finalObject[propertyKey] = secondObject[propertyKey];
      }
    });
  }

  if (secondObject) {
    Object.keys(secondObject).forEach((propertyKey) => {
      const propertyValue = secondObject[propertyKey];
      if (typeof (propertyValue) === 'object' && firstObject) {
        finalObject[propertyKey] =
          mergeNestedObjects(firstObject[propertyKey], secondObject[propertyKey]);
      } else if (secondObject[propertyKey] === undefined) {
        finalObject[propertyKey] = firstObject[propertyKey];
      } else {
        finalObject[propertyKey] = secondObject[propertyKey];
      }
    });
  }
  return finalObject;
};

const collapseAllOf = (obj) => {
  Object.keys(obj).forEach((key) => {
    const child = obj[key];
    if (child.allOf) {
      const list = child.allOf;
      delete child.allOf;
      list.forEach((item) => {
        Object.keys(item).forEach((section) => {
          const value = item[section];
          const type = typeFor(value);
          if (type === 'string'
            || type === 'boolean'
            || type === 'number') {
            child[section] = value;
          } else if (type === 'array') {
            if (!child[section]) {
              child[section] = [];
            }
            value.forEach(v => child[section].push(v));
          } else if (type === 'object') {
            if (!child[section]) {
              child[section] = {};
            }
            child[section] = mergeNestedObjects(child[section], item[section]);
          }
        });
      });
    }
  });
  return obj;
};

exports.collapseAllOf = collapseAllOf;
exports.typeFor = typeFor;

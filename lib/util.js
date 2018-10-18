const fs = require('fs');
const parse = require('csv-parse/lib/sync'); // eslint-disable-line


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

module.exports = {
  collapseAllOf,
  typeFor,
  /**
   * @description Creates a skeleton object based on an array of properties
   * @param {Object} parent The parent object that will contain the properties
   * @param {Array} paths The list of nested properties to add
   * @return {Object} The parent object
   */
  createSkeletonObject: (parent, paths) => {
    for (let i = 0; i < paths.length; i += 1) {
      parent = parent[paths[i]] = ( // eslint-disable-line
        parent[paths[i]] ||
              (paths[i] === 'required' ? [] : {})
      );
    }

    return parent;
  },
  setSchemaFilename: (key, outdir) => {
    if (!fs.existsSync(outdir)) fs.mkdirSync(outdir);

    return `${outdir}/${key}.yaml`;
  },
  parseGefegCsv: (file) => {
    const normalizeHeaders = text => text
      .replace(/"(Composition or Attribute|Notes)\//g, '"')
      .replace(/"Class, data type of a composition or attribute\/Name/g, '"Class')
      .replace(/"Class, data type of a composition or attribute\//g, '"');

    const text = fs.readFileSync(file, 'utf-8').replace(/\r\n/g, '\n');
    const lines = parse(normalizeHeaders(text), { columns: true, delimiter: ';' });
    return lines;
  },
};

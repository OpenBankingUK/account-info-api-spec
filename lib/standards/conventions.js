const jsonpath = require('jsonpath');
const Util = require('../util');

/**
 * @description Find the allOf specified objects in a given schema
 * @param {*} document The target Swagger document
 */
const findAllOfObjects = (document) => {
  // Collect up all allOf references from Swagger document
  // Merge jsonpath result arrays into flat array
  const allOfDefinitions = jsonpath.paths(document, '$..allOf')
    .reduce((dependencies, path) => {
      const parent = path[2];
      const definition = path.join('.');

      if (dependencies[parent]) {
        dependencies[parent].push(definition);
      } else {
        dependencies[parent] = [definition]; // eslint-disable-line
      }

      return dependencies;
    }, {});

  // Grab all the target Definitions ordered by the path, deepest to shallowest
  // Force anything to do with Detail to the end
  // as these will always be dependent on something else
  // This provides a rough-and-ready way to ensure the nested objects are completed first
  // It won't be perfect - the ideal method is to walk the dependencies - but it's good enough
  if (Object.keys(allOfDefinitions).length > 0) {
    return Object.keys(allOfDefinitions)
      .map(key => allOfDefinitions[key])
      .reduce((all, current) => all.concat(current))
      .sort((path1, path2) => {
        // console.log(path2, path1, ((path2.length - path1.length) > 0 ? 1 : -1));
        const diff = path2.length - path1.length;

        if (path1.match(/Detail\.allOf/)) return 1;
        if (path2.match(/Detail\.allOf/)) return -1;
        if (diff > 0) return 1;
        if (diff < 0) return -1;
        return 0;
      });
  }

  return [];
};

module.exports = {
  /**
     * @description merge allOf objects into a single object definition
     * @param {*} document The target Swagger document
     */
  mergeAllOf: (document) => {
    findAllOfObjects(document)
      .forEach((path) => {
        const mergedObject = {};
        const valueJsonPaths = [];

        console.log(`Removed allOf: ${path}`);

        // Collect up the objects and their properties that constitute the merged Definition
        const objectProperties = jsonpath.query(document, path)
          .reduce((properties, current) => properties.concat(current))
          .map(prop =>
            (Object.prototype.hasOwnProperty.call(prop, '$ref') ?
              document.definitions[prop.$ref.split('/').pop()] :
              prop));

        objectProperties.forEach((prop) => {
          const valuePaths = [];

          // Create a skeleton object based on each path
          // that is the superset of the allOf references
          // Collect up the JSON paths required to populate the skeleton
          jsonpath.paths(prop, '$..*')
            .forEach((fullPath) => {
              const targetPath = fullPath.filter(o => !o.toString().match(/\$|[0-9]+/)); // Remove $ and array references from JSON path
              const valueJsonPath = `$.${targetPath.join('.')}`;

              Util.createSkeletonObject(mergedObject, targetPath);

              if (valuePaths.indexOf(valueJsonPath) === -1) {
                if (targetPath.length === 1) {
                  valuePaths.push(valueJsonPath);
                } else {
                  const position = valuePaths
                    .indexOf(`$.${targetPath.slice(0, targetPath.length - 1).join('.')}`);

                  if (position !== -1) valuePaths[position] = valueJsonPath;
                  else valuePaths.push(valueJsonPath);
                }
              } // Otherwise don't do anything
            });
          valueJsonPaths.push(valuePaths);
        });

        // Copy the original values from objectProperties to the new object in the correct order
        for (let i = 0; i < valueJsonPaths.length; i += 1) {
          valueJsonPaths[i].forEach(query =>
            jsonpath.apply(mergedObject, query, (value) => { // eslint-disable-line
              if (query.match(/\.required$/)) { // If it's the required list then merge the values
                return jsonpath.query(mergedObject, query).pop()
                  .concat(jsonpath.query(objectProperties[i], query).pop());
              }

              return jsonpath.query(objectProperties[i], query).pop();
            }));
        }

        // Write the object back to main Swagger document
        // Removes the allOf structure from the target property
        jsonpath.apply(document, path.replace(/\.allOf$/, ''), value => mergedObject); //eslint-disable-line
      });

    return document;
  },
};

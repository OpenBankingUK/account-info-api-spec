const jsonpath = require('jsonpath');
const objectHash = require('object-hash');

function Definitions() {
  this.rawDefinitions = {};
  this.Definitions = {};

  return this;
}

Definitions.prototype.addDefinition =
  function addDefinition(definition) {
    // Merge in raw definition for update on output
    this.Definitions = Object.assign(
      this.Definitions,
      definition,
    );

    jsonpath.nodes(definition, '$..ref').forEach((node) => {
      const queryPath = node.path.slice(0, node.path.length - 1).join('.');
      const obj = jsonpath.query(definition, queryPath).pop();
      let definitionName = node.value;

      if (node.value.match(/Max[0-9]+Text|xs:(string|ID)|ISODateTime/g)) {
        // If there is a description the native ISO 20022 type cannot be reused
        // Use the name of the object instead
        // TODO: Evaluate this on OB types as well - might need to impose the same rule...
        // Although might be better to do it retrospectively...
        definitionName = obj.description ? node.path.slice(-2)[0] : node.value;
        obj.ref = definitionName;
      }

      const resolvedObject = {
        path: queryPath,
        hash: objectHash(obj), // Hash the object as a convenient means of identifying unicity
        object: obj,
      };

      // Collect up definitions by name i.e. arrays of objects
      if (this.rawDefinitions[definitionName]) {
        this.rawDefinitions[definitionName].push(resolvedObject);
      } else {
        this.rawDefinitions[definitionName] = [resolvedObject];
      }
    });
  };

/**
 * @description Group the objects by the object hash. Return each unique object
 *  and the paths where they can be found
 */
Definitions.prototype.getUniqueDefinitions = function getUniqueDefinitions() {
  this.uniqueDefinitions = {};

  Object.keys(this.rawDefinitions).forEach((key) => {
    this.uniqueDefinitions[key] = {};

    this.rawDefinitions[key].forEach((definition) => {
      if (this.uniqueDefinitions[key][definition.hash]) {
        this.uniqueDefinitions[key][definition.hash].count += 1;
        this.uniqueDefinitions[key][definition.hash].paths.push(definition.path);
      } else {
        this.uniqueDefinitions[key][definition.hash] = {
          count: 1, paths: [definition.path], object: definition.object,
        };
      }
    });
  });

  return this.uniqueDefinitions;
};

/**
 * @description Evaluate the definitions captured and return those that can be reused
 */
Definitions.prototype.getDefinitionsForReuse = function getDefinitionsForReuse() {
  this.getUniqueDefinitions();
  this.reusableDefinitions = [];

  // Loop through the unique objects identified by getUniqueDefinitions
  // Return those where a given type definition is used more than once
  this.reusableDefinitions = Object.keys(this.uniqueDefinitions)
    .sort()
    .map((key) => {
      const uniqueObjects = Object.keys(this.uniqueDefinitions[key])
        .map((hash) => { // eslint-disable-line
          return {
            hash,
            count: this.uniqueDefinitions[key][hash].count,
            paths: this.uniqueDefinitions[key][hash].paths,
            object: this.uniqueDefinitions[key][hash].object,
          };
        })
        .filter(uniqueObject => uniqueObject.count > 1);

      return {
        name: key,
        uniqueObjects: uniqueObjects
          .map((hashedObject, index) => {
            const objectWithName = hashedObject;

            objectWithName.objectName = uniqueObjects.length > 1 ? `${key}_${index}` : key;
            return hashedObject;
          }),
      };
    })
    .filter(definition => definition.uniqueObjects.length > 0);

  return this.reusableDefinitions;
};

Definitions.prototype.getReuseDefinitionsByPath = function getReuseDefinitionsByPath() {
  this.getDefinitionsForReuse();

  const reuseDefinitions = {};
  const definitionsByPath = [];

  this.reusableDefinitions.forEach((obj) => {
    obj.uniqueObjects.forEach((uniqueObject) => {
      reuseDefinitions[uniqueObject.objectName] = uniqueObject.object;

      uniqueObject.paths.forEach(path => definitionsByPath
        .push({ path, objectName: uniqueObject.objectName }));
    });
  });
  Object.assign(reuseDefinitions, this.Definitions);
  this.Definitions = reuseDefinitions;

  return definitionsByPath.sort((path1, path2) =>
    path2.path.length - path1.path.length);
};

Definitions.prototype.render = function render() {
  // Loop through the reuse opportunities and rewrite the objects
  this.getReuseDefinitionsByPath().forEach((reference) => {
    jsonpath.apply(this.Definitions, reference.path, () => { // eslint-disable-line
      return { $ref: `#/definitions/${reference.objectName}` };
    });
  });

  // Clear out all the ref placeholders
  jsonpath.nodes(this.Definitions, '$..ref').forEach((node) => {
    const queryPath = node.path.slice(0, node.path.length - 1).join('.');
    const parentDefinition = jsonpath.query(this.Definitions, queryPath).pop();

    jsonpath.apply(this.Definitions, queryPath, (value) => { // eslint-disable-line
      delete parentDefinition.ref;
      return parentDefinition;
    });
  });

  return { definitions: this.Definitions };
};

const create = () =>
  new Definitions();

module.exports = {
  create,
};

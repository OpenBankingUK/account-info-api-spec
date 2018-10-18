/**
 * @description Constructor for Definition object
 * @param {String} child Name of the child property - can be null for primitives
 * @param {*} properties Gefeg properties object
 * @param {*} children Child properties from Gefeg, used to set required keyword
 * @param {Array} externalReferences External references that wont be resolved in Gefeg
 * @returns {object} Itself
 */
function SwaggerDefinition(type, properties, externalReferences, mergeDescriptions = []) {
  this.properties = properties;
  this.externalReferences = externalReferences;
  this.mergeDescriptions = mergeDescriptions;

  this.definition = {};
  this.definition.type = type || '';

  return this;
}

SwaggerDefinition.prototype.setComplexType = function setComplexType() {
  const children = this.properties.children
    .filter(child => child.Occurrence.match('^[1-9]+..'))
    .map(child => child.Name);

  this.definition.ref = this.properties.attributes.Class;

  switch (this.definition.type) {
    case 'object':
      if (children.length > 0) {
        this.definition.required = children;
      }
      break;
    case 'array':
      if (children.length > 0) {
        this.definition.items = { type: 'object', required: children };
      }
      break;
    default:
      throw new Error(`Unknown complex type definition: ${this.definition.type}`);
  }
};

SwaggerDefinition.prototype.setPrimitiveType = function setPrimitiveType() {
  // Add a reference - this can potentially be used for consolidation once reconciled
  // Note this is only the class name - the path will be added later
  this.definition.ref = this.properties.attributes.Class;

  // Look for ISO standard strings
  if (this.properties.attributes.Pattern && this.properties.attributes.Pattern !== '') {
    this.definition.type = 'string';
    this.definition.pattern = this.properties.attributes.Pattern;

    return;
  } else if (this.properties.attributes.Codes && this.properties.attributes.Codes !== '') {
    this.definition.type = 'string';
    this.definition.enum = this.properties.attributes.Codes.split('\n');

    return;
  } else if (this.properties.attributes.Class.match(/Max[0-9]+Text/)) {
    this.definition.type = 'string';
    this.definition.minLength = 1;
    this.definition.maxLength = parseInt(this.properties.attributes.Class.match(/[0-9]+/));

    return;
  } else if (this.properties.attributes.Class.match(/xs:(string|ID)/) ||
      ['Code', 'SubCode'].includes(this.properties.attributes.Name)) {
    this.definition.type = 'string';
    delete this.definition.$ref;

    return;
  } else if (this.properties.attributes.TotalDigits && this.properties.attributes.TotalDigits > 0) {
    if (this.properties.attributes.FractionDigits &&
      this.properties.attributes.FractionDigits > 0) {
      this.definition.type = 'number';
    } else {
      this.definition.type = 'integer';
    }

    return;
  } else if (this.properties.attributes.Class === 'xs:boolean') {
    this.definition.type = 'boolean';
    delete this.definition.$ref;

    return;
  } else if (this.externalReferences[this.properties.attributes.Class]) {
    // Force the type definition into from the external reference in
    // Then assign this.definition across external reference
    this.definition.type = this.externalReferences[this.properties.attributes.Class].type;
    this.definition = Object.assign(
      JSON.parse(JSON.stringify(this.externalReferences[this.properties.attributes.Class])),
      this.definition,
    );

    return;
  }

  throw new Error(`Cannot interpret type for property: ${this.properties.attributes.Name}`);
};

SwaggerDefinition.prototype.setDescription = function setDescription() {
  const externalReference = this.externalReferences[this.properties.attributes.Class];

  if (this.properties && this.properties.attributes.EnhancedDefinition) {
    const description = this.properties.attributes.EnhancedDefinition.replace(/\n{2,}/g, '\n');

    this.definition.description =
      this.mergeDescriptions.indexOf(this.properties.attributes.Class) !== -1 &&
      externalReference && externalReference.description ?
        `${description}${externalReference.description}` :
        this.definition.description = description;
  }
};

SwaggerDefinition.prototype.setArrayConstraints = function setArrayConstraints() {
  if (this.definition.type === 'array' && this.properties.attributes.Occurrence) {
    const minItems = this.properties.attributes.Occurrence.match(/^[0-9]+/);
    const maxItems = this.properties.attributes.Occurrence.match(/(n|[0-9]+)$/);

    if (minItems) {
      const min = parseInt(minItems[0]);
      const max = maxItems ? maxItems[0] : null;

      // Only set min/maxItems for bounded arrays i.e. not 0..n and 0..1
      if (min > 0 || (max !== 'n' && parseInt(max) > 1)) {
        this.definition.minItems = min;

        if (max !== 'n') {
          this.definition.maxItems = parseInt(maxItems[0]);
        }
      }
    }
  }
};

SwaggerDefinition.prototype.render = function render() {
  // Deal with attributes for a complex Definition object - object, array...
  if (this.properties) {
    if (!this.properties.attributes || !this.properties.children ||
    !this.properties.attributes.Name || !this.properties.attributes.Class) {
      throw new Error('this.properties is missing required properties');
    }

    if (['object', 'array'].includes(this.definition.type)) {
      this.setDescription();
      this.setComplexType();
      this.setArrayConstraints();

      return this.definition;
    }
    // A primitive type - string, number, etc.
    this.setDescription();
    this.setPrimitiveType();

    return this.definition;
  }

  return {};
};

const create = (type, properties, externalReferences, mergeDescriptions) =>
  new SwaggerDefinition(type, properties, externalReferences, mergeDescriptions);

module.exports = {
  create,
};

/**
 * @description A wrapper for Gefeg export properties
 * @param {*} properties A line of Gefeg export with a given set of properties
 */
function GefegDefinition(properties) {
  this.expectedProperties = [
    'Name', 'Occurrence', 'XPath', 'EnhancedDefinition', 'Class', 'Codes', 'Pattern', 'TotalDigits', 'FractionDigits',
  ];

  this.properties = {};

  this.expectedProperties.forEach((propertyName) => {
    if (typeof properties[propertyName] === 'undefined') {
      throw new Error(`Missing property: ${propertyName}`);
    } else {
      this.properties[propertyName] = properties[propertyName];
    }
  });

  return this;
}

GefegDefinition.prototype.getPropertyNames = function getPropertyNames() {
  return Object.keys(this.properties);
};

GefegDefinition.prototype.getPropertiesAsArray = function listProperties() {
  return this.expectedProperties.map(property => this.properties[property]);
};

const create = properties =>
  new GefegDefinition(properties);

module.exports = {
  create,
};

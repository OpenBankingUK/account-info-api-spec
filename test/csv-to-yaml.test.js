const assert = require('assert');

const { convertRows } = require('../data_definition/csv-to-yaml.js');

const input = [
  {
    Name: 'OBReadRequest1',
    XPath: 'OBReadRequest1',
    Class: 'OBReadRequest1',
  },
  {
    Name: 'Data',
    Occurrence: '1..1',
    XPath: 'OBReadRequest1/Data',
    Class: 'OBReadData1',
  },
  {
    Name: 'Permissions',
    Occurrence: '1..n',
    XPath: 'OBReadRequest1/Data/Permissions',
    EnhancedDefinition: 'Specifies the Open Banking account request types. This is a list of the data clusters being consented by the PSU, and requested for authorisation with the ASPSP.',
    Class: 'OBExternalPermissions1Code',
    Codes: 'ReadAccountsBasic\nReadAccountsDetail\nReadBalances\nReadBeneficiariesBasic\nReadBeneficiariesDetail\nReadDirectDebits\nReadProducts\nReadStandingOrdersBasic\nReadStandingOrdersDetail\nReadTransactionsBasic\nReadTransactionsCredits\nReadTransactionsDebits\nReadTransactionsDetail',
  },
  {
    Name: 'ExpirationDateTime',
    Occurrence: '0..1',
    XPath: 'OBReadRequest1/Data/ExpirationDateTime',
    EnhancedDefinition: 'Specified date and time the permissions will expire.\nIf this is not populated, the permissions will be open ended.',
    Class: 'ISODateTime',
  },
  {
    Name: 'TransactionFromDateTime',
    Occurrence: '0..1',
    XPath: 'OBReadRequest1/Data/TransactionFromDateTime',
    EnhancedDefinition: 'Specified start date and time for the transaction query period.\nIf this is not populated, the start date will be open ended, and data will be returned from the earliest available transaction.',
    Class: 'ISODateTime',
  },
  {
    Name: 'TransactionToDateTime',
    Occurrence: '0..1',
    XPath: 'OBReadRequest1/Data/TransactionToDateTime',
    EnhancedDefinition: 'Specified end date and time for the transaction query period.\nIf this is not populated, the end date will be open ended, and data will be returned to the latest available transaction.',
    Class: 'ISODateTime',
  },
  {
    Name: 'Risk',
    Occurrence: '1..1',
    XPath: 'OBReadRequest1/Risk',
    EnhancedDefinition: 'The Risk section is sent by the initiating party to the ASPSP. It is used to specify additional details for risk scoring for Account Info.',
    Class: 'OBRisk2',
  },
];

const topLevelSchema = {
  OBReadRequest1: {
    type: 'object',
    properties: {
      Data:
        { $ref: '#/definitions/OBReadData1' },
      Risk:
        { $ref: '#/definitions/OBRisk2' },
    },
    additionalProperties: false,
    required: [
      'Data',
      'Risk',
    ],
  },
};

describe('convertRows', () => {
  const schemas = convertRows(input);

  describe('creates top level schema', () => {
    const schemaObject = schemas[0];
    const schema = Object.values(schemaObject)[0];
    const { properties } = topLevelSchema.OBReadRequest1;
    const { required } = topLevelSchema.OBReadRequest1;

    it('with key matching first row name', () =>
      assert.equal(Object.keys(schemaObject)[0], input[0].Name));

    it('with type "object"', () =>
      assert.equal(schema.type, 'object'));

    it('with correct top level properties', () =>
      assert.deepEqual(schema.properties, properties));

    it('with correct required properties', () =>
      assert.deepEqual(schema.required, required));

    it('with additionalProperties false', () =>
      assert.equal(schema.additionalProperties, false));
  });
});

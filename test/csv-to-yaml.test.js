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

const secondLevelSchema = {
  OBReadData1: {
    type: 'object',
    properties: {
      Permissions:
        { $ref: '#/definitions/OBExternalPermissions1Code' },
      ExpirationDateTime:
        { $ref: '#/definitions/ExpirationDateTime_ISODateTime' },
      TransactionFromDateTime:
        { $ref: '#/definitions/TransactionFromDateTime_ISODateTime' },
      TransactionToDateTime:
        { $ref: '#/definitions/TransactionToDateTime_ISODateTime' },
    },
    additionalProperties: false,
    required: ['Permissions'],
  },
};

const leafSchema = {
  ExpirationDateTime_ISODateTime: {
    description: 'Specified date and time the permissions will expire.\nIf this is not populated, the permissions will be open ended.',
    type: 'string',
    format: 'date-time',
  },
};

const arraySchema = {
  OBExternalPermissions1Code: {
    description: 'Specifies the Open Banking account request types. This is a list of the data clusters being consented by the PSU, and requested for authorisation with the ASPSP.',
    type: 'array',
    items: {
      description: 'Specifies the Open Banking account request types. This is a list of the data clusters being consented by the PSU, and requested for authorisation with the ASPSP.',
      type: 'string',
      enum: [
        'ReadAccountsBasic',
        'ReadAccountsDetail',
        'ReadBalances',
        'ReadBeneficiariesBasic',
        'ReadBeneficiariesDetail',
        'ReadDirectDebits',
        'ReadProducts',
        'ReadStandingOrdersBasic',
        'ReadStandingOrdersDetail',
        'ReadTransactionsBasic',
        'ReadTransactionsCredits',
        'ReadTransactionsDebits',
        'ReadTransactionsDetail',
      ],
    },
    minProperties: 1,
    additionalProperties: false,
  },
};

describe('convertRows', () => {
  const schemas = convertRows(input);

  describe('creates top level schema', () => {
    const schemaObject = schemas[0];
    const schema = Object.values(schemaObject)[0];
    const { properties } = topLevelSchema.OBReadRequest1;
    const { required } = topLevelSchema.OBReadRequest1;

    it('with key matching first row Class', () =>
      assert.equal(Object.keys(schemaObject)[0], input[0].Class));

    it('with type "object"', () =>
      assert.equal(schema.type, 'object'));

    it('with correct top level properties', () =>
      assert.deepEqual(schema.properties, properties));

    it('with correct required properties', () =>
      assert.deepEqual(schema.required, required));

    it('with additionalProperties false', () =>
      assert.equal(schema.additionalProperties, false));
  });

  describe('creates 1st second level schema from rows', () => {
    const schemaObject = schemas[1];
    const schema = Object.values(schemaObject)[0];
    const { properties } = secondLevelSchema.OBReadData1;
    const { required } = secondLevelSchema.OBReadData1;

    it('with key matching row Class', () =>
      assert.equal(Object.keys(schemaObject)[0], input[1].Class));

    it('with type "object"', () =>
      assert.equal(schema.type, 'object'));

    it('with correct top level properties', () =>
      assert.deepEqual(schema.properties, properties));

    it('with correct required properties', () =>
      assert.deepEqual(schema.required, required));

    it('with additionalProperties false', () =>
      assert.equal(schema.additionalProperties, false));
  });

  describe('creates array schema from rows', () => {
    const schemaObject = schemas[2];
    const schema = Object.values(schemaObject)[0];
    const {
      description, items, type, minProperties, additionalProperties,
    } = arraySchema.OBExternalPermissions1Code;

    it('with key matching row Class', () =>
      assert.equal(Object.keys(schemaObject)[0], 'OBExternalPermissions1Code'));

    it('with correct type', () =>
      assert.equal(schema.type, type));

    it('with correct description', () =>
      assert.equal(schema.description, description));

    it('with additionalProperties false', () =>
      assert.equal(schema.additionalProperties, additionalProperties));

    it('with minProperties false', () =>
      assert.equal(schema.minProperties, minProperties));

    it('with items', () =>
      assert.deepEqual(schema.items, items));
  });

  describe('creates leaf schema from rows', () => {
    const schemaObject = schemas[3];
    const schema = Object.values(schemaObject)[0];
    const { description, type, format } = leafSchema.ExpirationDateTime_ISODateTime;

    it('with key matching row Class', () =>
      assert.equal(Object.keys(schemaObject)[0], 'ExpirationDateTime_ISODateTime'));

    it('with correct type', () =>
      assert.equal(schema.type, type));

    it('with correct format', () =>
      assert.equal(schema.format, format));

    it('with correct description', () =>
      assert.equal(schema.description, description));
  });
});

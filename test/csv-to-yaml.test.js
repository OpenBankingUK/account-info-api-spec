const assert = require('assert');
const { YAML } = require('swagger-parser'); // eslint-disable-line
const { checkSchema } = require('./def-to-swagger.test');
const {
  convertRows, makeSchema, classFor, typeFor, formatFor,
} = require('../lib/csv-to-yaml.js');

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

const topLevelSchema = YAML.parse(`
  OBReadRequest1:
    type: object
    properties:
      Data:
        $ref: '#/definitions/OBReadData1'
      Risk:
        $ref: '#/definitions/OBRisk2'
    required:
      - Data
      - Risk
    additionalProperties: false
`);

const secondLevelSchema = YAML.parse(`
  OBReadData1:
    type: object
    properties:
      Permissions:
        description: Specifies the Open Banking account request types. This is a list of the data clusters being consented by the PSU, and requested for authorisation with the ASPSP.
        items:
          $ref: '#/definitions/OBExternalPermissions1Code'
        type: array
        minItems: 1
      ExpirationDateTime:
        description: "Specified date and time the permissions will expire.\\nIf this is not populated, the permissions will be open ended.\\nISO date time description."
        format: date-time
        type: string
      TransactionFromDateTime:
        description: "Specified start date and time for the transaction query period.\\nIf this is not populated, the start date will be open ended, and data will be returned from the earliest available transaction.\\nISO date time description."
        format: date-time
        type: string
      TransactionToDateTime:
        description: "Specified end date and time for the transaction query period.\\nIf this is not populated, the end date will be open ended, and data will be returned to the latest available transaction.\\nISO date time description."
        format: date-time
        type: string
    required:
      - Permissions
    additionalProperties: false
`);

const arrayItemSchema = {
  OBExternalPermissions1Code: {
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
};

describe('convertRows', () => {
  const schemas = convertRows(input, [], []);

  describe('creates top level schema', checkSchema({
    index: 0,
    expectedSchema: topLevelSchema,
    expectedKey: input[0].Class,
    schemas,
  }));

  describe('creates 1st second level schema from rows', checkSchema({
    index: 1,
    expectedSchema: secondLevelSchema,
    expectedKey: input[1].Class,
    schemas,
  }));

  describe('creates array item schema from rows', checkSchema({
    index: 2,
    expectedSchema: arrayItemSchema,
    expectedKey: 'OBExternalPermissions1Code',
    schemas,
  }));
});

describe('given property with Class xs:boolean', () => {
  const property = { Class: 'xs:boolean', Name: 'Included' };

  it('classFor returns property Name', () =>
    assert.equal(classFor(property), 'Included'));

  it('typeFor returns boolean', () =>
    assert.equal(typeFor(property), 'boolean'));
});

describe('given property with Class xs:string', () => {
  const property = { Class: 'xs:string', Name: 'ProductIdentifier' };

  it('classFor returns property Name', () =>
    assert.equal(classFor(property), 'ProductIdentifier'));

  it('typeFor returns string', () =>
    assert.equal(typeFor(property), 'string'));
});

describe('given property with Class PhoneNumber and Pattern', () => {
  const property = { Name: 'Phone', Class: 'PhoneNumber', Pattern: '\\+[0-9]{1,3}-[0-9()+\\-]{1,30}' };

  it('typeFor returns string', () =>
    assert.equal(typeFor(property), 'string'));
});

describe('given property with Class Number and FractionDigits 0', () => {
  const property = { Name: 'Value', Class: 'Number', FractionDigits: '0' };

  it('typeFor returns integer', () =>
    assert.equal(typeFor(property), 'integer'));

  it('formatFor returns int32', () =>
    assert.equal(formatFor(property).format, 'int32'));
});

describe('given property with Class Number and FractionDigits 2', () => {
  const property = { Name: 'Value', Class: 'Number', FractionDigits: '2' };

  it('typeFor returns number', () =>
    assert.equal(typeFor(property), 'number'));
});

describe('makeSchema creates codes schema', () => {
  const codesInput = [
    {
      Name: 'Status',
      Occurrence: '0..1',
      XPath: 'OBReadResponse1/Data/Status',
      EnhancedDefinition: 'Specifies the status of the account request resource.',
      Class: 'OBExternalRequestStatus1Code',
      Codes: 'Authorised\nAwaitingAuthorisation\nRejected\nRevoked',
    },
  ];
  const property = codesInput[0];
  const rows = codesInput;
  const result = makeSchema(property, rows);
  const schemaObject = result[0];
  const schema = Object.values(schemaObject)[0];

  it('with key matching row Class', () =>
    assert.equal(Object.keys(schemaObject)[0], codesInput[0].Class));

  it('with correct type', () =>
    assert.equal(schema.type, 'string'));

  it('without additionalProperties', () =>
    assert.equal(schema.additionalProperties, null));

  it('with description', () =>
    assert.equal(schema.description, codesInput[0].EnhancedDefinition));

  it('with enum', () =>
    assert.deepEqual(
      schema.enum,
      ['Authorised', 'AwaitingAuthorisation', 'Rejected', 'Revoked'],
    ));
});

describe('makeSchema creates text schema', () => {
  const textInput = [
    {
      Name: 'AccountRequestId',
      Occurrence: '1..1',
      XPath: 'OBReadResponse1/Data/AccountRequestId',
      EnhancedDefinition: 'Unique identification as assigned to identify the account request resource.',
      Class: 'Max128Text',
    },
  ];
  const property = textInput[0];
  const rows = textInput;
  const result = makeSchema(property, rows);
  const schemaObject = result[0];
  const schema = Object.values(schemaObject)[0];

  it('with key matching row Name and Class', () =>
    assert.equal(Object.keys(schemaObject)[0], 'AccountRequestId'));

  it('with correct type', () =>
    assert.equal(schema.type, 'string'));

  it('without additionalProperties', () =>
    assert.equal(schema.additionalProperties, null));

  it('with description', () =>
    assert.equal(schema.description, textInput[0].EnhancedDefinition));

  it('with minLength', () =>
    assert.equal(schema.minLength, 1));

  it('with maxLength', () =>
    assert.equal(schema.maxLength, 128));
});

const amountInput = [
  {
    Name: 'Amount',
    Occurrence: '1..1',
    XPath: 'OBReadBalance1/Data/Balance/Amount',
    EnhancedDefinition: 'Amount of money of the cash balance.',
    Class: 'ActiveOrHistoricCurrencyAndAmount',
    Codes: '',
    Pattern: 'TotalDigits: 18\nFractionDigits: 5',
    TotalDigits: '18',
    FractionDigits: '5',
  },
  {
    Name: 'Currency',
    Occurrence: '1..1',
    XPath: 'OBReadBalance1/Data/Balance/Amount/Currency',
    EnhancedDefinition: 'A code allocated to a currency by a Maintenance Agency under an international identification scheme, as described in the latest edition of the international standard ISO 4217 "Codes for the representation of currencies and funds".',
    Class: 'ActiveOrHistoricCurrencyCode',
    Codes: '',
    Pattern: '^[A-Z]{3,3}$',
    TotalDigits: '',
    FractionDigits: '',
  },
];

describe('makeSchema with "patterned" property', () => {
  const property = amountInput[1];
  const rows = amountInput;
  const result = makeSchema(property, rows);
  const schemaObject = result[0];
  const schema = Object.values(schemaObject)[0];

  it('with key matching row Class', () =>
    assert.equal(Object.keys(schemaObject)[0], 'Amount_ActiveOrHistoricCurrencyCode'));

  it('with correct type', () =>
    assert.equal(schema.type, 'string'));

  it('with description', () =>
    assert.equal(schema.description, amountInput[1].EnhancedDefinition));

  it('with pattern', () =>
    assert.deepEqual(schema.pattern, amountInput[1].Pattern));
});

describe('makeSchema adds Amount to ActiveOrHistoricCurrencyAndAmount', () => {
  const property = amountInput[0];
  const rows = amountInput;
  const result = makeSchema(property, rows);
  const schemaObject = result[0];
  const schema = Object.values(schemaObject)[0];

  it('with key prefixed by XPath Amount parent', () =>
    assert.equal(Object.keys(schemaObject)[0], `Balance_Amount_${amountInput[0].Class}`));

  it('with correct type', () =>
    assert.equal(schema.type, 'object'));

  it('with description', () =>
    assert.equal(schema.description, amountInput[0].EnhancedDefinition));

  it('with Amount added to properties', () =>
    assert.deepEqual(Object.keys(schema.properties), ['Amount', 'Currency']));

  it('with Amount added to required properties', () =>
    assert.deepEqual(schema.required, ['Amount', 'Currency']));

  it('adds Amount schema', () => {
    const amountSchema = result[2];
    assert.deepEqual(amountSchema, {
      Amount: {
        type: 'string',
        pattern: '^\\d{1,13}\\.\\d{1,5}$',
      },
    });
  });
});

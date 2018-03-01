const assert = require('assert');
const { YAML } = require('swagger-parser'); // eslint-disable-line

const {
  convertRows, makeSchema, classFor, typeFor,
} = require('../data_definition/csv-to-yaml.js');

// ./data_definition/v1.1/Permissions.csv
const permissions = [
  {
    'Permission (Detail)': 'ReadAccountsDetail',
    Name: 'Account',
    Occurrence: '0..1',
    XPath: 'OBReadAccount1/Data/Account/Account',
  },
  {
    'Permission (Detail)': 'ReadAccountsDetail',
    Name: 'Servicer',
    Occurrence: '0..1',
    XPath: 'OBReadAccount1/Data/Account/Servicer',
  },
];

// ./data_definition/v1.1/OBACCOUNT.csv
const dataDef = [
  {
    Name: 'OBReadAccount1',
    XPath: 'OBReadAccount1',
    Class: 'OBReadAccount1',
  },
  {
    Name: 'Data',
    Occurrence: '1..1',
    XPath: 'OBReadAccount1/Data',
    Class: 'OBReadDataAccount1',
  },
  {
    Name: 'Account',
    Occurrence: '0..n',
    XPath: 'OBReadAccount1/Data/Account',
    EnhancedDefinition: 'Unambiguous identification of the account to which credit and debit entries are made.',
    Class: 'OBAccount1',
  },
  {
    Name: 'AccountId',
    Occurrence: '1..1',
    XPath: 'OBReadAccount1/Data/Account/AccountId',
    EnhancedDefinition: 'A unique and immutable identifier used to identify the account resource. This identifier has no meaning to the account owner.',
    Class: 'Max40Text',
  },
  {
    Name: 'Currency',
    Occurrence: '1..1',
    XPath: 'OBReadAccount1/Data/Account/Currency',
    EnhancedDefinition: 'Identification of the currency in which the account is held. \n\nUsage: Currency should only be used in case one and the same account number covers several currencies\nand the initiating party needs to identify which currency needs to be used for settlement on the account.',
    Class: 'ActiveOrHistoricCurrencyCode',
    Pattern: '^[A-Z]{3,3}$',
  },
  {
    Name: 'Nickname',
    Occurrence: '0..1',
    XPath: 'OBReadAccount1/Data/Account/Nickname',
    EnhancedDefinition: 'The nickname of the account, assigned by the account owner in order to provide an additional means of identification of the account.',
    Class: 'Max70Text',
  },
  {
    Name: 'Account',
    Occurrence: '0..1',
    XPath: 'OBReadAccount1/Data/Account/Account',
    EnhancedDefinition: 'Provides the details to identify an account.',
    Class: 'OBCashAccount1',
  },
  {
    Name: 'SchemeName',
    Occurrence: '1..1',
    XPath: 'OBReadAccount1/Data/Account/Account/SchemeName',
    EnhancedDefinition: 'Name of the identification scheme, in a coded form as published in an external list.',
    Class: 'OBExternalAccountIdentification2Code',
    Codes: 'IBAN\nSortCodeAccountNumber',
  },
  {
    Name: 'Identification',
    Occurrence: '1..1',
    XPath: 'OBReadAccount1/Data/Account/Account/Identification',
    EnhancedDefinition: 'Identification assigned by an institution to identify an account. This identification is known by the account owner.',
    Class: 'Max34Text',
  },
  {
    Name: 'Name',
    Occurrence: '0..1',
    XPath: 'OBReadAccount1/Data/Account/Account/Name',
    EnhancedDefinition: "Name of the account, as assigned by the account servicing institution, in agreement with the account owner in order to provide an additional means of identification of the account.\n\nUsage: The account name is different from the account owner name. The account name is used in certain user communities to provide a means of identifying the account, in addition to the account owner's identity and the account number.",
    Class: 'Max70Text',
  },
  {
    Name: 'SecondaryIdentification',
    Occurrence: '0..1',
    XPath: 'OBReadAccount1/Data/Account/Account/SecondaryIdentification',
    EnhancedDefinition: 'This is secondary identification of the account, as assigned by the account servicing institution. \nThis can be used by building societies to additionally identify accounts with a roll number (in addition to a sort code and account number combination).',
    Class: 'Max34Text',
  },
  {
    Name: 'Servicer',
    Occurrence: '0..1',
    XPath: 'OBReadAccount1/Data/Account/Servicer',
    EnhancedDefinition: 'Party that manages the account on behalf of the account owner, that is manages the registration and booking of entries on the account, calculates balances on the account and provides information about the account.',
    Class: 'OBBranchAndFinancialInstitutionIdentification2',
  },
  {
    Name: 'SchemeName',
    Occurrence: '1..1',
    XPath: 'OBReadAccount1/Data/Account/Servicer/SchemeName',
    EnhancedDefinition: 'Name of the identification scheme, in a coded form as published in an external list.',
    Class: 'OBExternalFinancialInstitutionIdentification2Code',
    Codes: 'BICFI',
  },
  {
    Name: 'Identification',
    Occurrence: '1..1',
    XPath: 'OBReadAccount1/Data/Account/Servicer/Identification',
    EnhancedDefinition: 'Unique and unambiguous identification of the servicing institution.',
    Class: 'Max35Text',
  },
];

const payloadSchema = YAML.parse(`
  OBReadAccount1:
    type: object
    properties:
      Data:
        $ref: '#/definitions/OBReadDataAccount1'
    required:
      - Data
`);

const dataSchema = YAML.parse(`
  OBReadDataAccount1:
    type: object
    properties:
      Account:
        type: array
        items:
          $ref: '#/definitions/OBAccount1'
`);

const accountSchema = YAML.parse(`
  OBAccount1:
    type: object
    allOf:
      - $ref: '#/definitions/OBAccount1Basic'
      - properties:
          Account:
            $ref: '#/definitions/OBCashAccount1'
          Servicer:
            $ref: '#/definitions/OBBranchAndFinancialInstitutionIdentification2'
`);

const cashAccountSchema = YAML.parse(`
  OBCashAccount1:
    type: object
    properties:
      SchemeName:
        $ref: '#/definitions/OBExternalFinancialInstitutionIdentification2Code'
      Identification:
        $ref: '#/definitions/Identification_Max35Text'
      Name:
        $ref: '#/definitions/Name_Max70Text'
      SecondaryIdentification:
        $ref: '#/definitions/SecondaryIdentification_Max34Text'
    required:
      - SchemeName
      - Identification
`);

const accountBasicSchema = YAML.parse(`
  OBAccount1Basic:
    type: object
    properties:
      AccountId:
        $ref: '#/definitions/AccountId_Max40Text'
      Currency:
        $ref: '#/definitions/ActiveOrHistoricCurrencyCode'
      Nickname:
        $ref: '#/definitions/Nickname_Max70Text'
    additionalProperties: false
    required:
      - AccountId
      - Currency
`);

const accountDetailSchema = YAML.parse(`
  OBAccount1Detail:
    type: object
    allOf:
      - $ref: '#/definitions/OBAccount1'
      - required:
          - Account
`);

describe('convertRows', () => {
  const schemas = convertRows(dataDef, permissions);

  it('print YAML', () => {
    // console.log(YAML.stringify(payloadSchema)); // eslint-disable-line
    // console.log(YAML.stringify(dataSchema)); // eslint-disable-line
    console.log(YAML.stringify(accountSchema)); // eslint-disable-line
    // console.log(YAML.stringify(accountBasicSchema)); // eslint-disable-line
    // console.log(YAML.stringify(accountDetailSchema)); // eslint-disable-line
    // console.log(YAML.stringify(cashAccountSchema)); // eslint-disable-line
  });

  const setup = (index, expectedSchema) => {
    const root = Object.keys(expectedSchema)[0];
    const { allOf, properties, required } = expectedSchema[root];
    const schemaObject = schemas[index];
    return {
      schemaKey: Object.keys(schemaObject)[0],
      schema: Object.values(schemaObject)[0],
      allOf,
      properties,
      required,
    };
  };

  const checkSchema = ({
    index, expectedSchema, type, expectedKey,
  }) => () => {
    const {
      schemaKey, schema, allOf, properties, required,
    } = setup(index, expectedSchema);

    it('with schema key correct', () =>
      assert.equal(schemaKey, expectedKey));

    it('with type "object"', () =>
      assert.equal(schema.type, type));

    if (properties) {
      it('with top level properties', () => {
        assert.deepEqual(schema.properties, properties);
      });
    }

    if (required) {
      it('with required properties', () => {
        assert.deepEqual(schema.required, required);
      });
    }

    if (allOf) {
      it('with correct allOf', () => {
        assert.ok(schema.allOf, `should be present:\nallOf: ${JSON.stringify(allOf, null, 2)}`);
        assert.deepEqual(schema.allOf, allOf);
      });
    }

    xit('with additionalProperties false', () =>
      assert.equal(schema.additionalProperties, false));
  };

  describe('creates payload schema', checkSchema({
    index: 0,
    expectedSchema: payloadSchema,
    type: 'object',
    expectedKey: dataDef[0].Class,
  }));

  describe('creates data schema', checkSchema({
    index: 1,
    expectedSchema: dataSchema,
    type: 'object',
    expectedKey: dataDef[1].Class,
  }));

  describe('creates basic account schema', checkSchema({
    index: 2,
    expectedSchema: accountBasicSchema,
    type: 'object',
    expectedKey: `${dataDef[2].Class}Basic`,
  }));

  describe('creates account schema', checkSchema({
    index: 3,
    expectedSchema: accountSchema,
    type: 'object',
    expectedKey: dataDef[2].Class,
  }));

  describe('creates detail account schema', checkSchema({
    index: 4,
    expectedSchema: accountDetailSchema,
    type: 'object',
    expectedKey: `${dataDef[2].Class}Detail`,
  }));
});

const assert = require('assert');
const { YAML } = require('swagger-parser'); // eslint-disable-line

const { convertRows } = require('../inputs/csv-to-yaml.js');

// ./inputs/v1.1.1/data_definition/Permissions.csv
const permissions = [
  {
    'Permission (Detail)': 'ReadAccountsDetail',
    Name: 'Account',
    Occurrence: '1..1',
    XPath: 'OBReadAccount1/Data/Account/Account',
  },
  {
    'Permission (Detail)': 'ReadAccountsDetail',
    Name: 'Servicer',
    Occurrence: '0..1',
    XPath: 'OBReadAccount1/Data/Account/Servicer',
  },
];

// ./inputs/v1.1.1/data_definition/OBACCOUNT.csv
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
    EnhancedDefinition: 'Identification of the currency in which the account is held. \nUsage: Currency should only be used in case one and the same account number covers several currencies\nand the initiating party needs to identify which currency needs to be used for settlement on the account.',
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
        type: object
        properties:
          Account:
            description: Unambiguous identification of the account to which credit and debit entries are made.
            type: array
            items:
              $ref: '#/definitions/OBAccount1'
        additionalProperties: false
    required:
      - Data
    additionalProperties: false
`);

const accountSchema = YAML.parse(`
  OBAccount1:
    allOf:
      - $ref: '#/definitions/OBAccount1Basic'
      - properties:
          Account:
            allOf:
              - $ref: '#/definitions/OBCashAccount1'
              - description: Provides the details to identify an account.
              - properties:
                  Identification:
                    description: "Identification assigned by an institution to identify an account. This identification is known by the account owner."
                  Name:
                    description: "Name of the account, as assigned by the account servicing institution, in agreement with the account owner in order to provide an additional means of identification of the account.\\nUsage: The account name is different from the account owner name. The account name is used in certain user communities to provide a means of identifying the account, in addition to the account owner's identity and the account number."
                  SecondaryIdentification:
                    description: "This is secondary identification of the account, as assigned by the account servicing institution. \\nThis can be used by building societies to additionally identify accounts with a roll number (in addition to a sort code and account number combination)."
          Servicer:
            allOf:
              - $ref: '#/definitions/OBBranchAndFinancialInstitutionIdentification2'
              - description: Party that manages the account on behalf of the account owner, that is manages the registration and booking of entries on the account, calculates balances on the account and provides information about the account.
              - properties:
                  Identification:
                    description: Unique and unambiguous identification of the servicing institution.
`);

const cashAccountSchema = YAML.parse(`
  OBCashAccount1:
    type: object
    properties:
      SchemeName:
        $ref: '#/definitions/OBExternalAccountIdentification2Code'
      Identification:
        description: "Identification assigned by an institution to identify an account. This identification is known by the account owner."
        maxLength: 34
        minLength: 1
        type: string
      Name:
        description: "Name of the account, as assigned by the account servicing institution, in agreement with the account owner in order to provide an additional means of identification of the account.\\nUsage: The account name is different from the account owner name. The account name is used in certain user communities to provide a means of identifying the account, in addition to the account owner's identity and the account number."
        maxLength: 70
        minLength: 1
        type: string
      SecondaryIdentification:
        description: "This is secondary identification of the account, as assigned by the account servicing institution. \\nThis can be used by building societies to additionally identify accounts with a roll number (in addition to a sort code and account number combination)."
        maxLength: 34
        minLength: 1
        type: string
    required:
      - SchemeName
      - Identification
    additionalProperties: false
`);

const accountBasicSchema = YAML.parse(`
  OBAccount1Basic:
    type: object
    description: Unambiguous identification of the account to which credit and debit entries are made.
    properties:
      AccountId:
        $ref: '#/definitions/AccountId'
      Currency:
        description: "Identification of the currency in which the account is held. \\nUsage: Currency should only be used in case one and the same account number covers several currencies\\nand the initiating party needs to identify which currency needs to be used for settlement on the account."
        pattern: "^[A-Z]{3,3}$"
        type: string
      Nickname:
        description: "The nickname of the account, assigned by the account owner in order to provide an additional means of identification of the account."
        maxLength: 70
        minLength: 1
        type: string
    required:
      - AccountId
      - Currency
    additionalProperties: false
`);

const accountDetailSchema = YAML.parse(`
  OBAccount1Detail:
    allOf:
      - $ref: '#/definitions/OBAccount1'
      - required:
          - Account
`);

const checkSchema = ({
  index, expectedSchema, expectedKey, schemas,
}) => () => {
  const setup = (i, schema) => {
    const root = Object.keys(schema)[0];
    const {
      type, allOf, properties, required, minItems,
      description, minProperties, items, format,
    } = expectedSchema[root];
    const schemaObject = schemas[index];
    return {
      schemaKey: Object.keys(schemaObject)[0],
      schema: Object.values(schemaObject)[0],
      allOf,
      properties,
      required,
      description,
      minProperties,
      minItems,
      items,
      format,
      type,
    };
  };

  const notPresentMessage = (key, schema) => `${key} should not be present\nactual: ${YAML.stringify(schema)}`;

  const {
    schemaKey, schema, allOf, properties, required, minItems,
    description, minProperties, items, format, type,
  } = setup(index, expectedSchema);

  it('with schema key correct', () =>
    assert.equal(schemaKey, expectedKey));

  if (type) {
    it(`with type "${type}"`, () =>
      assert.equal(schema.type, type));
  } else {
    it('without type', () =>
      assert.equal(schema.type, null, notPresentMessage('type', schema)));
  }

  if (properties) {
    it('with properties', () =>
      assert.deepEqual(schema.properties, properties));
  }

  if (description) {
    it('with description', () =>
      assert.equal(schema.description, description));
  } else {
    it('without description', () =>
      assert.equal(schema.description, null, notPresentMessage('description', schema)));
  }

  if (required) {
    it('with required properties', () =>
      assert.deepEqual(schema.required, required));
  }

  if (minProperties) {
    it('with minProperties', () =>
      assert.equal(schema.minProperties, minProperties));
  }

  if (minItems) {
    it('with minItems', () =>
      assert.equal(schema.minItems, minItems));
  }

  if (items) {
    it('with items', () =>
      assert.deepEqual(schema.items, items));
  } else {
    it('without items', () =>
      assert.equal(schema.items, null, notPresentMessage('items', schema)));
  }

  if (format) {
    it('with correct format', () =>
      assert.equal(schema.format, format));
  }

  if (allOf) {
    it('with correct allOf', () => {
      assert.ok(schema.allOf, `should be present:\nallOf: ${JSON.stringify(allOf, null, 2)}`);
      assert.deepEqual(schema.allOf, allOf);
    });
  }

  if (type === 'object') {
    it('with additionalProperties false', () =>
      assert.equal(schema.additionalProperties, false));
  } else {
    it('without additionalProperties', () =>
      assert.equal(schema.additionalProperties, null, notPresentMessage('additionalProperties', schema)));
  }
};

describe('convertRows', () => {
  const separateDefinitions = ['AccountId'];
  const schemas = convertRows(
    dataDef, permissions, separateDefinitions,
    'ISO date time description.',
  );

  describe('creates payload schema', checkSchema({
    index: 0,
    expectedSchema: payloadSchema,
    expectedKey: dataDef[0].Class,
    schemas,
  }));

  describe('creates basic account schema', checkSchema({
    index: 1,
    expectedSchema: accountBasicSchema,
    expectedKey: `${dataDef[2].Class}Basic`,
    schemas,
  }));

  describe('creates account schema', checkSchema({
    index: 2,
    expectedSchema: accountSchema,
    expectedKey: dataDef[2].Class,
    schemas,
  }));

  describe('creates detail account schema', checkSchema({
    index: 3,
    expectedSchema: accountDetailSchema,
    expectedKey: `${dataDef[2].Class}Detail`,
    schemas,
  }));

  describe('creates cash account schema', checkSchema({
    index: 5,
    expectedSchema: cashAccountSchema,
    expectedKey: dataDef[6].Class,
    schemas,
  }));
});

exports.checkSchema = checkSchema;

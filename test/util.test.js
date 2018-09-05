const { expect } = require('chai');
const assert = require('assert');
const { YAML } = require('swagger-parser'); // eslint-disable-line
const {
  collapseAllOf,
  createSkeletonObject
} = require('../lib/util.js');

describe('collapseAllOf', () => {
  const schema = YAML.parse(`Account:
    allOf:
      - additionalProperties: false
        properties:
          Identification:
            maxLength: 34
            minLength: 1
            type: string
        required:
          - Identification
        type: object
      - description: Provides the details to identify an account.
      - properties:
          Identification:
            description: >-
              Identification assigned by an
              institution to identify an account. This
              identification is known by the account
              owner.
  `);

  const expected = YAML.parse(`Account:
    additionalProperties: false
    properties:
      Identification:
        description: >-
          Identification assigned by an
          institution to identify an account. This
          identification is known by the account
          owner.
        maxLength: 34
        minLength: 1
        type: string
    required:
      - Identification
    type: object
    description: Provides the details to identify an account.
  `);

  it('works', () => {
    const result = collapseAllOf(schema);
    assert.deepEqual(result, expected);
  });
});

describe('createSkeletonObject', () => {
  it('Array of nested objects constructed as expected', () => {
    const parent = {};
    const paths = ['one', 'two', 'three'];
    const expectedResult = { one: { two: { three: {} } } };

    createSkeletonObject(parent, paths);
    expect(parent).to.deep.equal(expectedResult);
  });
  it('Array of nested objects with an array created when the work "required" found', () => {
    const parent = {};
    const paths = ['one', 'two', 'three', 'required'];
    const expectedResult = { one: { two: { three: { required: [] } } } };

    createSkeletonObject(parent, paths);
    expect(parent).to.deep.equal(expectedResult);
  });
});

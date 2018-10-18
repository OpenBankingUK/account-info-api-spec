const { expect } = require('chai'); // eslint-disable-line
const Definition = require('../../../lib/gefeg-export/definition/swagger').create;
const Definitions = require('../../../lib/gefeg-export/definitions').create;

describe('Add definition objects', () => {
  it('Add a simple ISO text string definition without a description', () => {
    const definition = Definition(
      null,
      { children: [], attributes: { Name: 'Test', Class: 'Max35Text' } },
      {},
    ).render();
    const definitions = Definitions();
    definitions.addDefinition({ Test: definition });

    expect(definitions.Definitions).to.deep.equal({
      Test: {
        type: 'string', ref: 'Max35Text', minLength: 1, maxLength: 35,
      },
    });
    expect(definitions.rawDefinitions).to.deep.equal({
      Max35Text: [{
        hash: '066b8e6e7eaf0dd2dac5a67e992d3ad2cb7b7c28',
        object: {
          maxLength: 35, minLength: 1, ref: 'Max35Text', type: 'string'
        },
        path: '$.Test',
      }],
    });
  });
  it('Add a simple ISO text string definition with a description', () => {
    const expectedDescription = 'This is a unit test description';
    const definition = Definition(
      null,
      { children: [], attributes: { Name: 'Test', Class: 'Max35Text', EnhancedDefinition: expectedDescription } },
      {},
    ).render();
    const definitions = Definitions();
    definitions.addDefinition({ Test: definition });

    expect(definitions.Definitions).to.deep.equal({
      Test: {
        description: expectedDescription, type: 'string', ref: 'Test', minLength: 1, maxLength: 35,
      },
    });
    expect(definitions.rawDefinitions).to.deep.equal({
      Test: [{
        hash: '891f08d36b4d8fd85bc2279da09d7204153f0ea8',
        object: {
          maxLength: 35, minLength: 1, ref: 'Test', type: 'string', description: expectedDescription,
        },
        path: '$.Test',
      }],
    });
  });
  it('Add a string definition with a pattern', () => {
    const pattern = '^[0-9]{8}$';
    const definition = Definition(
      null,
      { children: [], attributes: { Name: 'Test', Class: 'Simpleton', Pattern: pattern } },
      {},
    ).render();
    const definitions = Definitions();
    definitions.addDefinition({ Test: definition });

    expect(definitions.Definitions).to.deep.equal({
      Test: {
        type: 'string', ref: 'Simpleton', pattern,
      },
    });
    expect(definitions.rawDefinitions).to.deep.equal({
      Simpleton: [{
        hash: 'f3906d27455e8031e1cb56d20e7f0ef5c1761307',
        object: { ref: 'Simpleton', type: 'string', pattern },
        path: '$.Test',
      }],
    });
  });
  it('Add two identical definitions', () => {
    const definitions = Definitions();

    definitions.addDefinition({
      Test: Definition(
        null,
        { children: [], attributes: { Name: 'Test', Class: 'Max35Text' } },
        {},
      ).render(),
    });
    definitions.addDefinition({
      Test: Definition(
        null,
        { children: [], attributes: { Name: 'Test', Class: 'Max35Text' } },
        {},
      ).render(),
    });

    expect(definitions.rawDefinitions).to.deep.equal({
      Max35Text: [{
        hash: '066b8e6e7eaf0dd2dac5a67e992d3ad2cb7b7c28',
        object: {
          maxLength: 35, minLength: 1, ref: 'Max35Text', type: 'string',
        },
        path: '$.Test',
      },
      {
        hash: '066b8e6e7eaf0dd2dac5a67e992d3ad2cb7b7c28',
        object: {
          maxLength: 35, minLength: 1, ref: 'Max35Text', type: 'string',
        },
        path: '$.Test',
      }],
    });
  });

  it('Add two different definitions with the same name', () => {
    const definitions = Definitions();
    definitions.addDefinition({
      Test: Definition(
        null,
        { children: [], attributes: { Name: 'Test', Class: 'Max35Text' } },
        {},
      ).render(),
    });
    definitions.addDefinition({
      Test: Definition(
        null,
        { children: [], attributes: { Name: 'Test', Class: 'Max35Text', EnhancedDefinition: 'This is a unit test description' } },
        {},
      ).render(),
    });

    expect(definitions.rawDefinitions).to.deep.equal({
      Max35Text: [{
        hash: '066b8e6e7eaf0dd2dac5a67e992d3ad2cb7b7c28',
        object: {
          maxLength: 35, minLength: 1, ref: 'Max35Text', type: 'string',
        },
        path: '$.Test',
      }],
      Test: [{
        hash: '891f08d36b4d8fd85bc2279da09d7204153f0ea8',
        object: {
          maxLength: 35, minLength: 1, ref: 'Test', type: 'string', description: 'This is a unit test description',
        },
        path: '$.Test',
      }],
    });
  });
});

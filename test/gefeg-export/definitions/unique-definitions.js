const { expect } = require('chai'); // eslint-disable-line
const Definition = require('../../../lib/gefeg-export/definition/swagger').create;
const Definitions = require('../../../lib/gefeg-export/definitions').create;

describe('Unique definitions', () => {
  it('Get unique definitions for the same two objects', () => {
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

    expect(definitions.getUniqueDefinitions()).to.deep.equal({
      Max35Text: {
        '066b8e6e7eaf0dd2dac5a67e992d3ad2cb7b7c28': {
          count: 2,
          object: {
            maxLength: 35, minLength: 1, ref: 'Max35Text', type: 'string',
          },
          paths: ['$.Test', '$.Test'],
        },
      },
    });
  });
  it('Get unique definitions for two different objects', () => {
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

    expect(definitions.getUniqueDefinitions()).to.deep.equal({
      Max35Text: {
        '066b8e6e7eaf0dd2dac5a67e992d3ad2cb7b7c28': {
          count: 1,
          object: {
            maxLength: 35, minLength: 1, ref: 'Max35Text', type: 'string',
          },
          paths: ['$.Test'],
        },
      },
      Test: {
        '891f08d36b4d8fd85bc2279da09d7204153f0ea8': {
          count: 1,
          object: {
            maxLength: 35, minLength: 1, ref: 'Test', type: 'string', description: 'This is a unit test description',
          },
          paths: ['$.Test'],
        },
      },
    });
  });
});

describe('Reusable definitions', () => {
  it('Return zero definitions when two different objects added', () => {
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

    expect(definitions.getDefinitionsForReuse()).to.deep.equal([]);
  });
  it('Return one definition when the same object added twice', () => {
    const definitions = Definitions();
    definitions.addDefinition({
      TestA: Definition(
        null,
        { children: [], attributes: { Name: 'Test', Class: 'Max35Text' } },
        {},
      ).render(),
    });
    definitions.addDefinition({
      TestB: Definition(
        null,
        { children: [], attributes: { Name: 'Test', Class: 'Max35Text' } },
        {},
      ).render(),
    });
    const definitionsForReuse = definitions.getDefinitionsForReuse();

    expect(definitionsForReuse[0].name).to.equal('Max35Text');
    expect(definitionsForReuse[0].uniqueObjects[0].count).to.equal(2);
  });
  it('Return two definitions when the four objects of the same Class are added but with different definitions', () => {
    const definitions = Definitions();
    const TestA = {
      TestA: Definition(
        null,
        {
          children: [],
          attributes: {
            Name: 'Test', Class: 'TestA', Pattern: '^[0-9]$', EnhancedDefinition: 'Test description A',
          },
        },
        {},
      ).render(),
    };
    const TestB = {
      TestB: Definition(
        null,
        {
          children: [],
          attributes: {
            Name: 'Test', Class: 'TestA', Pattern: '^[0-9]$', EnhancedDefinition: 'Test description B',
          },
        },
        {},
      ).render(),
    };
    definitions.addDefinition(TestA);
    definitions.addDefinition(TestA);
    definitions.addDefinition(TestB);
    definitions.addDefinition(TestB);

    const definitionsForReuse = definitions.getDefinitionsForReuse();

    expect(definitionsForReuse[0].uniqueObjects.length).to.equal(2);
    expect(definitionsForReuse[0].uniqueObjects[0].objectName).to.equal('TestA_0');
    expect(definitionsForReuse[0].uniqueObjects[1].objectName).to.equal('TestA_1');
  });
  it('Get reusable definitions across 4 objects that considate into 2 objects', () => {
    const definitions = Definitions();
    const TestA = {
      TestA: Definition(
        null,
        {
          children: [],
          attributes: {
            Name: 'Test', Class: 'TestA', Pattern: '^[0-9]$', EnhancedDefinition: 'Test description A',
          },
        },
        {},
      ).render(),
    };
    const TestB = {
      TestB: Definition(
        null,
        {
          children: [],
          attributes: {
            Name: 'Test', Class: 'TestA', Pattern: '^[0-9]$', EnhancedDefinition: 'Test description B',
          },
        },
        {},
      ).render(),
    };
    definitions.addDefinition(TestA);
    definitions.addDefinition(TestA);
    definitions.addDefinition(TestB);
    definitions.addDefinition(TestB);
    const reusableDefinitionsByPath = definitions.getReuseDefinitionsByPath();

    expect(reusableDefinitionsByPath).to.deep.equal([
      { objectName: 'TestA_0', path: '$.TestA' },
      { objectName: 'TestA_0', path: '$.TestA' },
      { objectName: 'TestA_1', path: '$.TestB' },
      { objectName: 'TestA_1', path: '$.TestB' },
    ]);
  });
});

const { expect } = require('chai'); // eslint-disable-line
const Definition = require('../../../lib/gefeg-export/definition/swagger').create;
const Definitions = require('../../../lib/gefeg-export/definitions').create;

describe('Return the definitions', () => {
  it('Get reusable definitions across 4 objects that considate into 2 objects', () => {
    const definitions = Definitions();
    const TestA = {
      TestAProperty: Definition(
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
    const TestC = {
      TestC: Definition(
        null,
        {
          children: [],
          attributes: {
            Name: 'Test', Class: 'TestB', Pattern: '^[0-9]$', EnhancedDefinition: 'Test description B',
          },
        },
        {},
      ).render(),
    };
    definitions.addDefinition(TestA);
    definitions.addDefinition(TestA);
    definitions.addDefinition(TestB);
    definitions.addDefinition(TestC);

    expect(definitions.render()).to.deep.equal({
      definitions: {
        TestA: {
          description: 'Test description A',
          pattern: '^[0-9]$',
          type: 'string',
        },
        TestAProperty: {
          $ref: '#/definitions/TestA',
        },
        TestC: {
          description: 'Test description B',
          pattern: '^[0-9]$',
          type: 'string',
        },
        TestB: {
          description: 'Test description B',
          pattern: '^[0-9]$',
          type: 'string',
        },
      },
    });
  });
});

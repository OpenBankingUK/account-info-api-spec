const { expect } = require('chai'); // eslint-disable-line
const Definition = require('../../../lib/gefeg-export/definition/swagger').create;

describe('Definition description', () => {
  it('No description keyword is added if none exists in Gefeg', () => {
    const complexDefinition = Definition(
      'object',
      { children: [], attributes: { Name: 'Test', Class: 'Unit Test' } },
      {},
    );
    complexDefinition.setComplexType();
    complexDefinition.setDescription();
    expect(complexDefinition.definition.description).to.be.undefined; //eslint-disable-line
  });
  it('Description keyword is added if Gefeg export has property called EnhancedDefinition', () => {
    const description = 'This is important information';
    const complexDefinition = Definition(
      'object',
      { children: [], attributes: { Name: 'Test', Class: 'Unit Test', EnhancedDefinition: description } },
      {},
    );
    complexDefinition.setComplexType();
    complexDefinition.setDescription();
    expect(complexDefinition.definition.description).to.be.equal(description); //eslint-disable-line
  });
  it('Merge an external reference description with a Gefeg description', () => {
    const externalReferences = {
      ISODateTime: { description: 'ISO date and time to be merged with Gefeg', type: 'string', format: 'date-time' },
    };
    const mergeDefinitionDescriptions = ['ISODateTime'];
    const primitiveDefinition = Definition(
      null,
      {
        children: [],
        attributes: { Name: 'DateTimeField', Class: 'ISODateTime', EnhancedDefinition: 'This date and time is used in unit testing\n' },
      },
      externalReferences,
      mergeDefinitionDescriptions,
    );
    primitiveDefinition.setDescription();

    expect(primitiveDefinition.definition.description).to.equal('This date and time is used in unit testing\nISO date and time to be merged with Gefeg');
  });
});

describe('Complex type definition', () => {
  it('An object is created when the immediate child in the path is called properties', () => {
    const complexDefinition = Definition(
      'object',
      { children: [], attributes: { Name: 'Test', Class: 'Unit Test' } },
      {},
    );
    complexDefinition.setComplexType();
    expect(complexDefinition.definition.type).to.equal('object');
  });
  it('An array is created when the immediate child in the path is called items', () => {
    const complexDefinition = Definition(
      'array',
      { children: [], attributes: { Name: 'Test', Class: 'Unit Test' } },
      {},
    );
    complexDefinition.setComplexType();
    expect(complexDefinition.definition.type).to.equal('array');
  });
  it('An error is thrown when any other value is passed', () => {
    const complexDefinition = Definition(
      'test',
      { children: [], attributes: { Name: 'Test', Class: 'Unit Test' } },
      {},
    );
    expect(complexDefinition.setComplexType.bind(complexDefinition)).to.throw('Unknown complex type definition: test');
  });
  it('The correct values are added to the required property of an object when mandatory child properties are passed', () => {
    const complexDefinition = Definition(
      'object',
      {
        children: [
          { Name: 'RequiredField', Occurrence: '1..1' },
          { Name: 'OptionalField', Occurrence: '0..1' },
        ],
        attributes: { Name: 'Test', Class: 'Unit Test' },
      },
      {},
    );
    complexDefinition.setComplexType();
    expect(complexDefinition.definition.required).to.deep.equal(['RequiredField']);
  });
  it('The correct values are added to the required property of an array when mandatory child properties are passed', () => {
    const complexDefinition = Definition(
      'array',
      {
        children: [
          { Name: 'RequiredField', Occurrence: '1..1' },
          { Name: 'OptionalField', Occurrence: '0..1' },
        ],
        attributes: { Name: 'Test', Class: 'Unit Test' },
      },
      {},
    );
    complexDefinition.setComplexType();
    expect(complexDefinition.definition.items.required).to.deep.equal(['RequiredField']);
  });
});

describe('Primitive type definition', () => {
  it('Create a string definition based on a pattern', () => {
    const expectedPattern = '^[0-9]{6}$';
    const primitiveDefinition = Definition(
      null,
      {
        children: [],
        attributes: { Name: 'Test', Class: 'Unit Test', Pattern: expectedPattern },
      },
      {},
    );

    primitiveDefinition.setPrimitiveType();

    expect(primitiveDefinition.definition.type).to.equal('string');
    expect(primitiveDefinition.definition.pattern).to.equal(expectedPattern);
  });
  it('Create a string definition based on a enumeration', () => {
    const enumeration = 'Code1\nCode2\nCode3';
    const primitiveDefinition = Definition(
      null,
      {
        children: [],
        attributes: { Name: 'Test', Class: 'Unit Test', Codes: enumeration },
      },
      {},
    );

    primitiveDefinition.setPrimitiveType();

    expect(primitiveDefinition.definition.type).to.equal('string');
    expect(primitiveDefinition.definition.enum).to.deep.equal(enumeration.split('\n'));
  });
  it('Create a string definition based on a derivative of an ISO text definition', () => {
    const primitiveDefinition = Definition(
      null,
      {
        children: [],
        attributes: { Name: 'Test', Class: 'Max35Text' },
      },
      {},
    );

    primitiveDefinition.setPrimitiveType();

    expect(primitiveDefinition.definition.type).to.equal('string');
    expect(primitiveDefinition.definition.minLength).to.equal(1);
    expect(primitiveDefinition.definition.maxLength).to.equal(35);
  });
  it('Create a string definition based on an XML Schema String', () => {
    const primitiveDefinition = Definition(
      null,
      {
        children: [],
        attributes: { Name: 'Test', Class: 'xs:string' },
      },
      {},
    );

    primitiveDefinition.setPrimitiveType();

    expect(primitiveDefinition.definition.type).to.equal('string');
  });
  it('Create a string definition based on a definition named Code', () => {
    const primitiveDefinition = Definition(
      null,
      {
        children: [],
        attributes: { Name: 'Code', Class: 'Unit Test' },
      },
      {},
    );

    primitiveDefinition.setPrimitiveType();

    expect(primitiveDefinition.definition.type).to.equal('string');
  });
  it('Create an integer definition', () => {
    const primitiveDefinition = Definition(
      null,
      {
        children: [],
        attributes: { Name: 'IntegerField', Class: 'Unit Test', TotalDigits: 10 },
      },
      {},
    );

    primitiveDefinition.setPrimitiveType();

    expect(primitiveDefinition.definition.type).to.equal('integer');
  });
  it('Create a number definition', () => {
    const primitiveDefinition = Definition(
      null,
      {
        children: [],
        attributes: {
          Name: 'IntegerField',
          Class: 'Unit Test',
          TotalDigits: 10,
          FractionDigits: 2,
        },
      },
      {},
    );

    primitiveDefinition.setPrimitiveType();

    expect(primitiveDefinition.definition.type).to.equal('number');
  });
  it('Create a boolean field based on XML Schema boolean type', () => {
    const primitiveDefinition = Definition(
      null,
      {
        children: [],
        attributes: { Name: 'IntegerField', Class: 'xs:boolean' },
      },
      {},
    );
    primitiveDefinition.setPrimitiveType();

    expect(primitiveDefinition.definition.type).to.equal('boolean');
  });
  it('Copy in an external reference', () => {
    const externalReferences = {
      ISODateTime: { description: 'ISO date and time', type: 'string', format: 'date-time' },
    };
    const primitiveDefinition = Definition(
      null,
      {
        children: [],
        attributes: { Name: 'DateTimeField', Class: 'ISODateTime' },
      },
      externalReferences,
    );
    primitiveDefinition.setPrimitiveType();

    // Description not here point so dont test or expect differences
    expect(primitiveDefinition.definition).to.deep.equal(Object.assign({ ref: 'ISODateTime' }, externalReferences.ISODateTime));
  });
  it('Throw an error when properties cannot be interpreted successfully', () => {
    const primitiveDefinition = Definition(
      null,
      {
        children: [],
        attributes: { Name: 'UnknownField', Class: 'UnknownType' },
      },
      {},
    );
    expect(primitiveDefinition.setPrimitiveType.bind(primitiveDefinition)).to.throw('Cannot interpret type for property: UnknownField');
  });
});

describe('Array constraints', () => {
  it('Do nothing if this is not an array', () => {
    const complexDefinition = Definition(
      'object',
      { children: [], attributes: { Name: 'Test', Class: 'Unit Test' } },
      {},
    );
    complexDefinition.setComplexType();
    complexDefinition.setArrayConstraints();

    expect(complexDefinition.definition.minItems).to.be.undefined; // eslint-disable-line
    expect(complexDefinition.definition.maxItems).to.be.undefined; // eslint-disable-line
  });
  it('Do nothing if constraints are not defined in Gefeg', () => {
    const complexDefinition = Definition(
      'array',
      { children: [], attributes: { Name: 'Test', Class: 'Unit Test' } },
      {},
    );
    complexDefinition.setComplexType();
    complexDefinition.setArrayConstraints();

    expect(complexDefinition.definition.minItems).to.be.undefined; // eslint-disable-line
    expect(complexDefinition.definition.maxItems).to.be.undefined; // eslint-disable-line
  });
  it('Do nothing if array is unbounded in Gefeg', () => {
    const complexDefinition = Definition(
      'array',
      { children: [], attributes: { Name: 'Test', Class: 'Unit Test', Occurrence: '0..n' } },
      {},
    );
    complexDefinition.setComplexType();
    complexDefinition.setArrayConstraints();

    expect(complexDefinition.definition.minItems).to.be.undefined; // eslint-disable-line
    expect(complexDefinition.definition.maxItems).to.be.undefined; // eslint-disable-line
  });
  it('Set minItems if lower constraint is greater than 0 and higher constraint is unbounded', () => {
    const complexDefinition = Definition(
      'array',
      { children: [], attributes: { Name: 'Test', Class: 'Unit Test', Occurrence: '1..n' } },
      {},
    );
    complexDefinition.setComplexType();
    complexDefinition.setArrayConstraints();

    expect(complexDefinition.definition.minItems).to.equal(1); // eslint-disable-line
    expect(complexDefinition.definition.maxItems).to.be.undefined; // eslint-disable-line
  });
  it('Set minItems and maxItems if higher constraint is set to an integer', () => {
    const lowerConstraint = 1;
    const higherConstraint = 7;
    const complexDefinition = Definition(
      'array',
      { children: [], attributes: { Name: 'Test', Class: 'Unit Test', Occurrence: `${lowerConstraint}..${higherConstraint}` } },
      {},
    );
    complexDefinition.setComplexType();
    complexDefinition.setArrayConstraints();

    expect(complexDefinition.definition.minItems).to.equal(lowerConstraint); // eslint-disable-line
    expect(complexDefinition.definition.maxItems).to.equal(higherConstraint); // eslint-disable-line
  });
  it('Check for invalid values in lower constraint', () => {
    const complexDefinition = Definition(
      'array',
      { children: [], attributes: { Name: 'Test', Class: 'Unit Test', Occurrence: 'Undefined..n' } },
      {},
    );
    complexDefinition.setComplexType();
    complexDefinition.setArrayConstraints();

    expect(complexDefinition.definition.minItems).to.be.undefined; // eslint-disable-line
    expect(complexDefinition.definition.maxItems).to.be.undefined; // eslint-disable-line
  });
  it('Check for invalid values in higher constraint', () => {
    const complexDefinition = Definition(
      'array',
      { children: [], attributes: { Name: 'Test', Class: 'Unit Test', Occurrence: '0..Undefined' } },
      {},
    );
    complexDefinition.setComplexType();
    complexDefinition.setArrayConstraints();

    expect(complexDefinition.definition.minItems).to.be.undefined; // eslint-disable-line
    expect(complexDefinition.definition.maxItems).to.be.undefined; // eslint-disable-line
  });
});

describe('Return the type definition', () => {
  it('Render a complex type', () => {
    const complexDefinition = Definition(
      'array',
      {
        children: [
          { Name: 'RequiredField', Occurrence: '1..1' },
          { Name: 'OptionalField', Occurrence: '0..1' },
        ],
        attributes: { Name: 'Test', Class: 'Unit Test' },
      },
      {},
    );
    const definition = complexDefinition.render();
    expect(definition).to.deep.equal({
      items: { required: ['RequiredField'], type: 'object' },
      ref: 'Unit Test',
      type: 'array',
    });
  });
  it('Render a primitive type', () => {
    const primitiveDefinition = Definition(
      null,
      {
        children: [],
        attributes: { Name: 'Test', Class: 'Max35Text' },
      },
      {},
    );
    const definition = primitiveDefinition.render();
    expect(definition).to.deep.equal({
      type: 'string',
      ref: 'Max35Text',
      minLength: 1,
      maxLength: 35,
    });
  });
  it('Return an empty object if there are not properties', () => {
    expect(Definition(null, null, {}).render()).to.deep.equal({});
  });
  it('Throw an error if there are properties but there is a missing attribute', () => {
    const definition = Definition(null, {}, {});
    expect(definition.render.bind(definition)).to.throw('this.properties is missing required properties');
  });
});

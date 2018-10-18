const { expect } = require('chai');
const Definition = require('../../lib/swagger/definition').create;


describe('Rendering tests', () => {
  it('Renders an object correctly', () => {
    const newObject = Definition('properties', {});

    expect(newObject.render()).to.deep.equal({ type: 'object' });
  });
  it('Renders an array correctly', () => {
    const newObject = Definition('items', {});

    expect(newObject.render()).to.deep.equal({ type: 'array' });
  });
});

const { expect } = require('chai');
const jsonpath = require('jsonpath');

const fs = require('fs');
const { mergeAllOf } = require('../../lib/standards/conventions');

describe('Scenario: Remove any `allOf` keywords and replace with new, merged objects', () => {
  describe('Given the need to publish a new API specification', () => {
    let swaggerObject = null;
    let mergedDocument = null;

    before('When a Definition object is declared using the `allOf` keyword', () => {
      swaggerObject = JSON.parse(fs.readFileSync(`${__dirname}/../data/account-info-transaction-endpoints-with-allof.json`, 'utf-8'));
    });
    it('Then the objects referenced by the Definition object are merged into a new Definition object', () => {
      mergedDocument = mergeAllOf(swaggerObject);

      // Write the document out for easy debugging...
      fs.writeFileSync(`${__dirname}/../data/all-of-removed.json`, JSON.stringify(mergedDocument, null, 2));

      // Check output document matches a copy with allOf already removed (completed manually)
      expect(mergedDocument).to.deep.equal(JSON.parse(fs.readFileSync(`${__dirname}/../data/account-info-transaction-endpoints-allof-merged.json`, 'utf-8')));
    });
    it('And any dependent objects use the new Definition object and not allOf references', () => {
      expect(jsonpath.paths(mergedDocument, '$..allOf').length).to.equal(0);
    });
  });
});

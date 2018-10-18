const { expect } = require('chai'); // eslint-disable-line
const Definition = require('../../../lib/gefeg-export/definition/gefeg').create;

describe('Initialisation', () => {
  const exportProperties = {
    Name: 'Name',
    Occurrence: '0..1',
    XPath: 'OBReadTransaction3/Data/Transaction/CreditorAccount/Name',
    EnhancedDefinition: 'Name of the account, as assigned by the account servicing institution.\n\nUsage: The account name is the name or names of the account owner(s) represented at an account level. The account name is not the product name or the nickname of the account.',
    Class: 'Max70Text',
    Codes: '',
    Pattern: '',
    TotalDigits: '',
    FractionDigits: '',
  };

  it('Successful initialisation', () => {
    expect(Definition(exportProperties).properties).to.deep.equal(exportProperties);
  });
  it('Throw an error when property not present', () => {
    delete exportProperties.Name;
    try {
      Definition(exportProperties);
      throw new Error('Expected error not throw');
    } catch (err) {
      expect(err.message).to.equal('Missing property: Name');
    }
  });
});

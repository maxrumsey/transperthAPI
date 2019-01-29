const { expect } = require('chai');
const ts = require('../')
module.exports = function() {
  it('Should throw if non-object is passed.', function() {
    expect(function() { new ts('String') }).to.throw('The options specified is not an object.')
  })
}

const { expect } = require('chai');
const ts = require('../')
const Transperth = new ts();
module.exports = function() {
  it('Should throw if non-object is passed.', function() {
    expect(function() { new ts('String') }).to.throw('The options specified is not an object.')
  })
  it('Should contain a bus stop status function.', function() {
    expect(Transperth.busStopTimes).to.be.a('function')
  })
  it('Should contain a SmartRider info function.', function() {
    expect(Transperth.smartRiderInfo).to.be.a('function')
  })
}

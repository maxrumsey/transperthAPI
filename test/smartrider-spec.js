const { expect } = require('chai');
const ts = require('../')
const Transperth = new ts();

let smartrider_number
try {
  smartrider_number = require('./auth.json').smartrider_number;
} catch (e) {
  smartrider_number = process.env.SMARTRIDER_NUMBER;
}
module.exports = function() {
  describe('Initialisation', function() {
    it('Should throw if smartrider number not present.', function() {
      expect(Transperth.smartRiderInfo).to.throw();
    })
    it('Should throw if smartrider number not 9 characters long.', function() {
      expect(() => {Transperth.smartRiderInfo('13321')}).to.throw('SmartRider not a valid 9 digit number.');
    })
    it('Should return a promise.', function() {
      const object = Transperth.smartRiderInfo(smartrider_number);
      expect(object).to.be.instanceOf(Promise)
    })
  })
}

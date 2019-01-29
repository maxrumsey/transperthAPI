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
      expect(() => {Transperth.smartRiderInfo('SR 1234')}).to.throw('SmartRider not a valid 9 digit number.');
    })
    it('Should return a promise.', function() {
      expect(Transperth.smartRiderInfo(smartrider_number)).to.be.a('promise')
    })
  })
  describe('Delivery', function() {
    describe('Success', function() {
      it('Should return the endpoint on success.', function(done) {
        Transperth.smartRiderInfo(smartrider_number).then(res => {
          expect(res.meta.endpoint).to.equal(`${Transperth.options.endpoint}${Transperth.options.smartRiderEndpoint}?SRN=${cleanSmartRiderNumber(smartrider_number)}`)
          done()
        })
        .catch(e => {
        })
      })
      it('Should return info on success.', function(done) {
        Transperth.smartRiderInfo(smartrider_number).then(res => {
          expect(res.balance).to.be.a('number')
          done()
        })
        .catch(e => {
          done()
        })
      })
    })
    describe('Failure', function() {
      it('Should reject with error if it fails.', function(done) {
        const newTransperth = new ts();
        newTransperth.options.endpoint = 'eqwew'
        newTransperth.smartRiderInfo(smartrider_number).then(() => {
          done()
        })
        .catch(e => {
          expect(e).to.be.an('error')
          done()
        })
      })
    })
  })
}
function cleanSmartRiderNumber(number) {
  const string = number.toString()
  let cleaned = string.replace('SR', '');
  cleaned = cleaned.replace(/ /g, '');
  return cleaned;
}

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
      it('Should reject with error if it fails due to a network error.', function(done) {
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
      it('Should return null object if it fails due to a user input error.', function(done) {
        const newTransperth = new ts();
        newTransperth.smartRiderInfo('123456789').then(res => {
          expect(res.balance).to.be.a('null')
          done()
        })
        .catch(e => {
          done()
        })
      })
      it('Response should contain error message if it fails due to a user input error.', function(done) {
        const newTransperth = new ts();
        newTransperth.smartRiderInfo('123456789').then(res => {
          expect(res.meta.error).to.contain('Cannot read property')
          done()
        })
        .catch(e => {
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

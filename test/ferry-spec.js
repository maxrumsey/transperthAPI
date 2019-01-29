const { expect } = require('chai');
const ts = require('../')
const Transperth = new ts();

let ferrystop
try {
  ferrystop = require('./auth.json').ferrystop;
} catch (e) {
  ferrystop = process.env.ferrystop;
}
module.exports = function() {
  describe('Initialisation', function() {
    it('Should throw if Stop Number not present.', function() {
      expect(Transperth.ferryTimes).to.throw()
    })
    it('Should return a promise', function() {
      expect(Transperth.ferryTimes(ferrystop)).to.be.a('promise')
    })
  })
  describe('Delivery', function() {
    describe('Failure', function() {
      it('Should reject with error if it fails.', function (done) {
        const newTransperth = new ts();
        newTransperth.options.endpoint = 'eqwew'
        newTransperth.ferryTimes(ferrystop).then(() => {
          done()
        })
        .catch(e => {
          expect(e).to.be.an('error')
          done()
        })
      })
    })
    describe('Success', function() {
      it('Should contain an array of ferries.', function (done) {
        Transperth.ferryTimes(ferrystop).then(res => {
          expect(res.ferries).to.be.an('array')
          done()
        })
        .catch(e => {
          done()
        })
      })
    })
  })
}

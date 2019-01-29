const { expect } = require('chai');
const ts = require('../')
const Transperth = new ts();

let busstop
try {
  busstop = require('./auth.json').busstop;
} catch (e) {
  busstop = process.env.busstop;
}
module.exports = function() {
  describe('Initialisation', function() {
    it('Should throw if Stop Number not present.', function() {
      expect(Transperth.busStopTimes).to.throw()
    })
    it('Should return a promise', function() {
      expect(Transperth.busStopTimes(busstop)).to.be.a('promise')
    })
  })
  describe('Delivery', function() {
    describe('Failure', function() {
      it('Should reject with error if it fails.', function (done) {
        const newTransperth = new ts();
        newTransperth.options.endpoint = 'eqwew'
        newTransperth.busStopTimes(busstop).then(() => {
          done()
        })
        .catch(e => {
          expect(e).to.be.an('error')
          done()
        })
      })
    })
    describe('Success', function() {
      it('Should contain an array of busses.', function (done) {
        Transperth.busStopTimes(busstop).then(res => {
          expect(res.buses).to.be.an('array')
          done()
        })
        .catch(e => {
          done()
        })
      })
    })
  })
}

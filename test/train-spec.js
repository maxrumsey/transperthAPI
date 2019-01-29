const { expect } = require('chai');
const ts = require('../')
const Transperth = new ts();

let train
try {
  train = require('./auth.json').train;
} catch (e) {
  train = process.env.train;
}
module.exports = function() {
  describe('Initialisation', function() {
    it('Should throw if direction not present.', function() {
      expect(function() {Transperth.trainTimes({
        station: train.station,
        trainline: train.trainline
      })}).to.throw()
    })
    it('Should throw if station not present.', function() {
      expect(function() {Transperth.trainTimes({
        direction: train.direction,
        trainline: train.trainline
      })}).to.throw()
    })
    it('Should throw if trainline not present.', function() {
      expect(function() {Transperth.trainTimes({
        direction: train.direction,
        station: train.station
      })}).to.throw()
    })
    it('Should return a promise', function() {
      expect(Transperth.trainTimes(train)).to.be.a('promise')
    })
  })
  describe('Delivery', function() {
    describe('Failure', function() {
      it('Should reject with error if it fails.', function (done) {
        const newTransperth = new ts();
        newTransperth.options.endpoint = 'eqwew'
        newTransperth.trainTimes(train).then(() => {
          done()
        })
        .catch(e => {
          expect(e).to.be.an('error')
          done()
        })
      })
    })
    describe('Success', function() {
      it('Should contain an array of trains.', function (done) {
        Transperth.trainTimes(train).then(res => {
          expect(res.trains).to.be.an('array')
          done()
        })
        .catch(e => {
          done()
        })
      })
    })
  })
}

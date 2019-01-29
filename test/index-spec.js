const chai = require('chai');

describe('TransPerth API', function() {
  describe('SmartRider Info', require('./smartrider-spec.js'));
  describe('Constructor', require('./constructor-spec.js'));
  describe('Bus Stop Status', require('./busstop-spec.js'));
  describe('Ferry Status', require('./ferry-spec.js'));
  describe('Train Status', require('./train-spec.js'));
});

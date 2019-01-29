const chai = require('chai');

describe('TransPerth API', function() {
  describe('SmartRider Info', require('./smartrider-spec.js'));
  describe('Constructor', require('./constructor-spec.js'));
});

'use strict';

var assert = require('chai').assert;
var isBuiltIn = require('./index.js');

describe('isbuiltin tests', function() {

  it('fs should be builtin', function() {
    assert.isTrue(isBuiltIn('fs'));
  });

  it('woosh should be builtin', function() {
    assert.isFalse(isBuiltIn('woosh'));
  });

});

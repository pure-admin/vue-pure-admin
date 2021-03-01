'use strict';

var builtinModules = require('builtin-modules');


module.exports = function(moduleName) {
  if(typeof moduleName !== 'string') {
    throw new TypeError('ModuleName must be a string');
  }

  return builtinModules.indexOf(moduleName) !== -1;
};

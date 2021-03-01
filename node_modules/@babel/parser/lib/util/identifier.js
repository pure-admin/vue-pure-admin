"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isIteratorStart = isIteratorStart;
Object.defineProperty(exports, "isIdentifierStart", {
  enumerable: true,
  get: function () {
    return _helperValidatorIdentifier.isIdentifierStart;
  }
});
Object.defineProperty(exports, "isIdentifierChar", {
  enumerable: true,
  get: function () {
    return _helperValidatorIdentifier.isIdentifierChar;
  }
});
Object.defineProperty(exports, "isReservedWord", {
  enumerable: true,
  get: function () {
    return _helperValidatorIdentifier.isReservedWord;
  }
});
Object.defineProperty(exports, "isStrictBindOnlyReservedWord", {
  enumerable: true,
  get: function () {
    return _helperValidatorIdentifier.isStrictBindOnlyReservedWord;
  }
});
Object.defineProperty(exports, "isStrictBindReservedWord", {
  enumerable: true,
  get: function () {
    return _helperValidatorIdentifier.isStrictBindReservedWord;
  }
});
Object.defineProperty(exports, "isStrictReservedWord", {
  enumerable: true,
  get: function () {
    return _helperValidatorIdentifier.isStrictReservedWord;
  }
});
Object.defineProperty(exports, "isKeyword", {
  enumerable: true,
  get: function () {
    return _helperValidatorIdentifier.isKeyword;
  }
});
exports.keywordRelationalOperator = void 0;

var _helperValidatorIdentifier = require("@babel/helper-validator-identifier");

const keywordRelationalOperator = /^in(stanceof)?$/;
exports.keywordRelationalOperator = keywordRelationalOperator;

function isIteratorStart(current, next) {
  return current === 64 && next === 64;
}
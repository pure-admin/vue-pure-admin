"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLineInfo = getLineInfo;
exports.SourceLocation = exports.Position = void 0;

var _whitespace = require("./whitespace");

class Position {
  constructor(line, col) {
    this.line = void 0;
    this.column = void 0;
    this.line = line;
    this.column = col;
  }

}

exports.Position = Position;

class SourceLocation {
  constructor(start, end) {
    this.start = void 0;
    this.end = void 0;
    this.filename = void 0;
    this.identifierName = void 0;
    this.start = start;
    this.end = end;
  }

}

exports.SourceLocation = SourceLocation;

function getLineInfo(input, offset) {
  let line = 1;
  let lineStart = 0;
  let match;
  _whitespace.lineBreakG.lastIndex = 0;

  while ((match = _whitespace.lineBreakG.exec(input)) && match.index < offset) {
    line++;
    lineStart = _whitespace.lineBreakG.lastIndex;
  }

  return new Position(line, offset - lineStart);
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Errors", {
  enumerable: true,
  get: function () {
    return _errorMessage.ErrorMessages;
  }
});
exports.default = void 0;

var _location = require("../util/location");

var _comments = _interopRequireDefault(require("./comments"));

var _errorMessage = require("./error-message.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ParserError extends _comments.default {
  getLocationForPosition(pos) {
    let loc;
    if (pos === this.state.start) loc = this.state.startLoc;else if (pos === this.state.lastTokStart) loc = this.state.lastTokStartLoc;else if (pos === this.state.end) loc = this.state.endLoc;else if (pos === this.state.lastTokEnd) loc = this.state.lastTokEndLoc;else loc = (0, _location.getLineInfo)(this.input, pos);
    return loc;
  }

  raise(pos, errorTemplate, ...params) {
    return this.raiseWithData(pos, undefined, errorTemplate, ...params);
  }

  raiseWithData(pos, data, errorTemplate, ...params) {
    const loc = this.getLocationForPosition(pos);
    const message = errorTemplate.replace(/%(\d+)/g, (_, i) => params[i]) + ` (${loc.line}:${loc.column})`;
    return this._raise(Object.assign({
      loc,
      pos
    }, data), message);
  }

  _raise(errorContext, message) {
    const err = new SyntaxError(message);
    Object.assign(err, errorContext);

    if (this.options.errorRecovery) {
      if (!this.isLookahead) this.state.errors.push(err);
      return err;
    } else {
      throw err;
    }
  }

}

exports.default = ParserError;
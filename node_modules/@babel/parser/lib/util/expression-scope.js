"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newParameterDeclarationScope = newParameterDeclarationScope;
exports.newArrowHeadScope = newArrowHeadScope;
exports.newAsyncArrowScope = newAsyncArrowScope;
exports.newExpressionScope = newExpressionScope;
exports.default = void 0;
const kExpression = 0,
      kMaybeArrowParameterDeclaration = 1,
      kMaybeAsyncArrowParameterDeclaration = 2,
      kParameterDeclaration = 3;

class ExpressionScope {
  constructor(type = kExpression) {
    this.type = void 0;
    this.type = type;
  }

  canBeArrowParameterDeclaration() {
    return this.type === kMaybeAsyncArrowParameterDeclaration || this.type === kMaybeArrowParameterDeclaration;
  }

  isCertainlyParameterDeclaration() {
    return this.type === kParameterDeclaration;
  }

}

class ArrowHeadParsingScope extends ExpressionScope {
  constructor(type) {
    super(type);
    this.errors = new Map();
  }

  recordDeclarationError(pos, message) {
    this.errors.set(pos, message);
  }

  clearDeclarationError(pos) {
    this.errors.delete(pos);
  }

  iterateErrors(iterator) {
    this.errors.forEach(iterator);
  }

}

class ExpressionScopeHandler {
  constructor(raise) {
    this.stack = [new ExpressionScope()];
    this.raise = raise;
  }

  enter(scope) {
    this.stack.push(scope);
  }

  exit() {
    this.stack.pop();
  }

  recordParameterInitializerError(pos, message) {
    const {
      stack
    } = this;
    let i = stack.length - 1;
    let scope = stack[i];

    while (!scope.isCertainlyParameterDeclaration()) {
      if (scope.canBeArrowParameterDeclaration()) {
        scope.recordDeclarationError(pos, message);
      } else {
        return;
      }

      scope = stack[--i];
    }

    this.raise(pos, message);
  }

  recordAsyncArrowParametersError(pos, message) {
    const {
      stack
    } = this;
    let i = stack.length - 1;
    let scope = stack[i];

    while (scope.canBeArrowParameterDeclaration()) {
      if (scope.type === kMaybeAsyncArrowParameterDeclaration) {
        scope.recordDeclarationError(pos, message);
      }

      scope = stack[--i];
    }
  }

  validateAsPattern() {
    const {
      stack
    } = this;
    const currentScope = stack[stack.length - 1];
    if (!currentScope.canBeArrowParameterDeclaration()) return;
    currentScope.iterateErrors((message, pos) => {
      this.raise(pos, message);
      let i = stack.length - 2;
      let scope = stack[i];

      while (scope.canBeArrowParameterDeclaration()) {
        scope.clearDeclarationError(pos);
        scope = stack[--i];
      }
    });
  }

}

exports.default = ExpressionScopeHandler;

function newParameterDeclarationScope() {
  return new ExpressionScope(kParameterDeclaration);
}

function newArrowHeadScope() {
  return new ArrowHeadParsingScope(kMaybeArrowParameterDeclaration);
}

function newAsyncArrowScope() {
  return new ArrowHeadParsingScope(kMaybeAsyncArrowParameterDeclaration);
}

function newExpressionScope() {
  return new ExpressionScope();
}
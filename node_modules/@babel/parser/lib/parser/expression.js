"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _types = require("../tokenizer/types");

var _context = require("../tokenizer/context");

var N = _interopRequireWildcard(require("../types"));

var _lval = _interopRequireDefault(require("./lval"));

var _identifier = require("../util/identifier");

var _scopeflags = require("../util/scopeflags");

var _util = require("./util");

var _productionParameter = require("../util/production-parameter");

var _expressionScope = require("../util/expression-scope.js");

var _error = require("./error");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class ExpressionParser extends _lval.default {
  checkProto(prop, isRecord, protoRef, refExpressionErrors) {
    if (prop.type === "SpreadElement" || prop.type === "ObjectMethod" || prop.computed || prop.shorthand) {
      return;
    }

    const key = prop.key;
    const name = key.type === "Identifier" ? key.name : key.value;

    if (name === "__proto__") {
      if (isRecord) {
        this.raise(key.start, _error.Errors.RecordNoProto);
        return;
      }

      if (protoRef.used) {
        if (refExpressionErrors) {
          if (refExpressionErrors.doubleProto === -1) {
            refExpressionErrors.doubleProto = key.start;
          }
        } else {
          this.raise(key.start, _error.Errors.DuplicateProto);
        }
      }

      protoRef.used = true;
    }
  }

  shouldExitDescending(expr, potentialArrowAt) {
    return expr.type === "ArrowFunctionExpression" && expr.start === potentialArrowAt;
  }

  getExpression() {
    let paramFlags = _productionParameter.PARAM;

    if (this.hasPlugin("topLevelAwait") && this.inModule) {
      paramFlags |= _productionParameter.PARAM_AWAIT;
    }

    this.scope.enter(_scopeflags.SCOPE_PROGRAM);
    this.prodParam.enter(paramFlags);
    this.nextToken();
    const expr = this.parseExpression();

    if (!this.match(_types.types.eof)) {
      this.unexpected();
    }

    expr.comments = this.state.comments;
    expr.errors = this.state.errors;
    return expr;
  }

  parseExpression(disallowIn, refExpressionErrors) {
    if (disallowIn) {
      return this.disallowInAnd(() => this.parseExpressionBase(refExpressionErrors));
    }

    return this.allowInAnd(() => this.parseExpressionBase(refExpressionErrors));
  }

  parseExpressionBase(refExpressionErrors) {
    const startPos = this.state.start;
    const startLoc = this.state.startLoc;
    const expr = this.parseMaybeAssign(refExpressionErrors);

    if (this.match(_types.types.comma)) {
      const node = this.startNodeAt(startPos, startLoc);
      node.expressions = [expr];

      while (this.eat(_types.types.comma)) {
        node.expressions.push(this.parseMaybeAssign(refExpressionErrors));
      }

      this.toReferencedList(node.expressions);
      return this.finishNode(node, "SequenceExpression");
    }

    return expr;
  }

  parseMaybeAssignDisallowIn(refExpressionErrors, afterLeftParse, refNeedsArrowPos) {
    return this.disallowInAnd(() => this.parseMaybeAssign(refExpressionErrors, afterLeftParse, refNeedsArrowPos));
  }

  parseMaybeAssignAllowIn(refExpressionErrors, afterLeftParse, refNeedsArrowPos) {
    return this.allowInAnd(() => this.parseMaybeAssign(refExpressionErrors, afterLeftParse, refNeedsArrowPos));
  }

  parseMaybeAssign(refExpressionErrors, afterLeftParse, refNeedsArrowPos) {
    const startPos = this.state.start;
    const startLoc = this.state.startLoc;

    if (this.isContextual("yield")) {
      if (this.prodParam.hasYield) {
        this.state.exprAllowed = true;
        let left = this.parseYield();

        if (afterLeftParse) {
          left = afterLeftParse.call(this, left, startPos, startLoc);
        }

        return left;
      }
    }

    let ownExpressionErrors;

    if (refExpressionErrors) {
      ownExpressionErrors = false;
    } else {
      refExpressionErrors = new _util.ExpressionErrors();
      ownExpressionErrors = true;
    }

    if (this.match(_types.types.parenL) || this.match(_types.types.name)) {
      this.state.potentialArrowAt = this.state.start;
    }

    let left = this.parseMaybeConditional(refExpressionErrors, refNeedsArrowPos);

    if (afterLeftParse) {
      left = afterLeftParse.call(this, left, startPos, startLoc);
    }

    if (this.state.type.isAssign) {
      const node = this.startNodeAt(startPos, startLoc);
      const operator = this.state.value;
      node.operator = operator;

      if (this.match(_types.types.eq)) {
        node.left = this.toAssignable(left);
        refExpressionErrors.doubleProto = -1;
      } else {
        node.left = left;
      }

      if (refExpressionErrors.shorthandAssign >= node.left.start) {
        refExpressionErrors.shorthandAssign = -1;
      }

      this.checkLVal(left, undefined, undefined, "assignment expression");
      this.next();
      node.right = this.parseMaybeAssign();
      return this.finishNode(node, "AssignmentExpression");
    } else if (ownExpressionErrors) {
      this.checkExpressionErrors(refExpressionErrors, true);
    }

    return left;
  }

  parseMaybeConditional(refExpressionErrors, refNeedsArrowPos) {
    const startPos = this.state.start;
    const startLoc = this.state.startLoc;
    const potentialArrowAt = this.state.potentialArrowAt;
    const expr = this.parseExprOps(refExpressionErrors);

    if (this.shouldExitDescending(expr, potentialArrowAt)) {
      return expr;
    }

    return this.parseConditional(expr, startPos, startLoc, refNeedsArrowPos);
  }

  parseConditional(expr, startPos, startLoc, refNeedsArrowPos) {
    if (this.eat(_types.types.question)) {
      const node = this.startNodeAt(startPos, startLoc);
      node.test = expr;
      node.consequent = this.parseMaybeAssignAllowIn();
      this.expect(_types.types.colon);
      node.alternate = this.parseMaybeAssign();
      return this.finishNode(node, "ConditionalExpression");
    }

    return expr;
  }

  parseExprOps(refExpressionErrors) {
    const startPos = this.state.start;
    const startLoc = this.state.startLoc;
    const potentialArrowAt = this.state.potentialArrowAt;
    const expr = this.parseMaybeUnary(refExpressionErrors);

    if (this.shouldExitDescending(expr, potentialArrowAt)) {
      return expr;
    }

    return this.parseExprOp(expr, startPos, startLoc, -1);
  }

  parseExprOp(left, leftStartPos, leftStartLoc, minPrec) {
    let prec = this.state.type.binop;

    if (prec != null && (this.prodParam.hasIn || !this.match(_types.types._in))) {
      if (prec > minPrec) {
        const op = this.state.type;

        if (op === _types.types.pipeline) {
          this.expectPlugin("pipelineOperator");

          if (this.state.inFSharpPipelineDirectBody) {
            return left;
          }

          this.state.inPipeline = true;
          this.checkPipelineAtInfixOperator(left, leftStartPos);
        }

        const node = this.startNodeAt(leftStartPos, leftStartLoc);
        node.left = left;
        node.operator = this.state.value;

        if (op === _types.types.exponent && left.type === "UnaryExpression" && (this.options.createParenthesizedExpressions || !(left.extra && left.extra.parenthesized))) {
          this.raise(left.argument.start, _error.Errors.UnexpectedTokenUnaryExponentiation);
        }

        const logical = op === _types.types.logicalOR || op === _types.types.logicalAND;
        const coalesce = op === _types.types.nullishCoalescing;

        if (coalesce) {
          prec = _types.types.logicalAND.binop;
        }

        this.next();

        if (op === _types.types.pipeline && this.getPluginOption("pipelineOperator", "proposal") === "minimal") {
          if (this.match(_types.types.name) && this.state.value === "await" && this.prodParam.hasAwait) {
            throw this.raise(this.state.start, _error.Errors.UnexpectedAwaitAfterPipelineBody);
          }
        }

        node.right = this.parseExprOpRightExpr(op, prec);
        this.finishNode(node, logical || coalesce ? "LogicalExpression" : "BinaryExpression");
        const nextOp = this.state.type;

        if (coalesce && (nextOp === _types.types.logicalOR || nextOp === _types.types.logicalAND) || logical && nextOp === _types.types.nullishCoalescing) {
          throw this.raise(this.state.start, _error.Errors.MixingCoalesceWithLogical);
        }

        return this.parseExprOp(node, leftStartPos, leftStartLoc, minPrec);
      }
    }

    return left;
  }

  parseExprOpRightExpr(op, prec) {
    const startPos = this.state.start;
    const startLoc = this.state.startLoc;

    switch (op) {
      case _types.types.pipeline:
        switch (this.getPluginOption("pipelineOperator", "proposal")) {
          case "smart":
            return this.withTopicPermittingContext(() => {
              return this.parseSmartPipelineBody(this.parseExprOpBaseRightExpr(op, prec), startPos, startLoc);
            });

          case "fsharp":
            return this.withSoloAwaitPermittingContext(() => {
              return this.parseFSharpPipelineBody(prec);
            });
        }

      default:
        return this.parseExprOpBaseRightExpr(op, prec);
    }
  }

  parseExprOpBaseRightExpr(op, prec) {
    const startPos = this.state.start;
    const startLoc = this.state.startLoc;
    return this.parseExprOp(this.parseMaybeUnary(), startPos, startLoc, op.rightAssociative ? prec - 1 : prec);
  }

  parseMaybeUnary(refExpressionErrors) {
    if (this.isContextual("await") && this.isAwaitAllowed()) {
      return this.parseAwait();
    }

    const update = this.match(_types.types.incDec);
    const node = this.startNode();

    if (this.state.type.prefix) {
      node.operator = this.state.value;
      node.prefix = true;

      if (this.match(_types.types._throw)) {
        this.expectPlugin("throwExpressions");
      }

      const isDelete = this.match(_types.types._delete);
      this.next();
      node.argument = this.parseMaybeUnary();
      this.checkExpressionErrors(refExpressionErrors, true);

      if (this.state.strict && isDelete) {
        const arg = node.argument;

        if (arg.type === "Identifier") {
          this.raise(node.start, _error.Errors.StrictDelete);
        } else if ((arg.type === "MemberExpression" || arg.type === "OptionalMemberExpression") && arg.property.type === "PrivateName") {
          this.raise(node.start, _error.Errors.DeletePrivateField);
        }
      }

      if (!update) {
        return this.finishNode(node, "UnaryExpression");
      }
    }

    return this.parseUpdate(node, update, refExpressionErrors);
  }

  parseUpdate(node, update, refExpressionErrors) {
    if (update) {
      this.checkLVal(node.argument, undefined, undefined, "prefix operation");
      return this.finishNode(node, "UpdateExpression");
    }

    const startPos = this.state.start;
    const startLoc = this.state.startLoc;
    let expr = this.parseExprSubscripts(refExpressionErrors);
    if (this.checkExpressionErrors(refExpressionErrors, false)) return expr;

    while (this.state.type.postfix && !this.canInsertSemicolon()) {
      const node = this.startNodeAt(startPos, startLoc);
      node.operator = this.state.value;
      node.prefix = false;
      node.argument = expr;
      this.checkLVal(expr, undefined, undefined, "postfix operation");
      this.next();
      expr = this.finishNode(node, "UpdateExpression");
    }

    return expr;
  }

  parseExprSubscripts(refExpressionErrors) {
    const startPos = this.state.start;
    const startLoc = this.state.startLoc;
    const potentialArrowAt = this.state.potentialArrowAt;
    const expr = this.parseExprAtom(refExpressionErrors);

    if (this.shouldExitDescending(expr, potentialArrowAt)) {
      return expr;
    }

    return this.parseSubscripts(expr, startPos, startLoc);
  }

  parseSubscripts(base, startPos, startLoc, noCalls) {
    const state = {
      optionalChainMember: false,
      maybeAsyncArrow: this.atPossibleAsyncArrow(base),
      stop: false
    };

    do {
      base = this.parseSubscript(base, startPos, startLoc, noCalls, state);
      state.maybeAsyncArrow = false;
    } while (!state.stop);

    return base;
  }

  parseSubscript(base, startPos, startLoc, noCalls, state) {
    if (!noCalls && this.eat(_types.types.doubleColon)) {
      return this.parseBind(base, startPos, startLoc, noCalls, state);
    } else if (this.match(_types.types.backQuote)) {
      return this.parseTaggedTemplateExpression(base, startPos, startLoc, state);
    }

    let optional = false;

    if (this.match(_types.types.questionDot)) {
      state.optionalChainMember = optional = true;

      if (noCalls && this.lookaheadCharCode() === 40) {
        state.stop = true;
        return base;
      }

      this.next();
    }

    if (!noCalls && this.match(_types.types.parenL)) {
      return this.parseCoverCallAndAsyncArrowHead(base, startPos, startLoc, state, optional);
    } else if (optional || this.match(_types.types.bracketL) || this.eat(_types.types.dot)) {
      return this.parseMember(base, startPos, startLoc, state, optional);
    } else {
      state.stop = true;
      return base;
    }
  }

  parseMember(base, startPos, startLoc, state, optional) {
    const node = this.startNodeAt(startPos, startLoc);
    const computed = this.eat(_types.types.bracketL);
    node.object = base;
    node.computed = computed;
    const property = computed ? this.parseExpression() : this.parseMaybePrivateName(true);

    if (property.type === "PrivateName") {
      if (node.object.type === "Super") {
        this.raise(startPos, _error.Errors.SuperPrivateField);
      }

      this.classScope.usePrivateName(property.id.name, property.start);
    }

    node.property = property;

    if (computed) {
      this.expect(_types.types.bracketR);
    }

    if (state.optionalChainMember) {
      node.optional = optional;
      return this.finishNode(node, "OptionalMemberExpression");
    } else {
      return this.finishNode(node, "MemberExpression");
    }
  }

  parseBind(base, startPos, startLoc, noCalls, state) {
    const node = this.startNodeAt(startPos, startLoc);
    node.object = base;
    node.callee = this.parseNoCallExpr();
    state.stop = true;
    return this.parseSubscripts(this.finishNode(node, "BindExpression"), startPos, startLoc, noCalls);
  }

  parseCoverCallAndAsyncArrowHead(base, startPos, startLoc, state, optional) {
    const oldMaybeInArrowParameters = this.state.maybeInArrowParameters;
    this.state.maybeInArrowParameters = true;
    this.next();
    let node = this.startNodeAt(startPos, startLoc);
    node.callee = base;

    if (state.maybeAsyncArrow) {
      this.expressionScope.enter((0, _expressionScope.newAsyncArrowScope)());
    }

    if (state.optionalChainMember) {
      node.optional = optional;
    }

    if (optional) {
      node.arguments = this.parseCallExpressionArguments(_types.types.parenR, false);
    } else {
      node.arguments = this.parseCallExpressionArguments(_types.types.parenR, state.maybeAsyncArrow, base.type === "Import", base.type !== "Super", node);
    }

    this.finishCallExpression(node, state.optionalChainMember);

    if (state.maybeAsyncArrow && this.shouldParseAsyncArrow() && !optional) {
      state.stop = true;
      this.expressionScope.validateAsPattern();
      this.expressionScope.exit();
      node = this.parseAsyncArrowFromCallExpression(this.startNodeAt(startPos, startLoc), node);
    } else {
      if (state.maybeAsyncArrow) {
        this.expressionScope.exit();
      }

      this.toReferencedArguments(node);
    }

    this.state.maybeInArrowParameters = oldMaybeInArrowParameters;
    return node;
  }

  toReferencedArguments(node, isParenthesizedExpr) {
    this.toReferencedListDeep(node.arguments, isParenthesizedExpr);
  }

  parseTaggedTemplateExpression(base, startPos, startLoc, state) {
    const node = this.startNodeAt(startPos, startLoc);
    node.tag = base;
    node.quasi = this.parseTemplate(true);

    if (state.optionalChainMember) {
      this.raise(startPos, _error.Errors.OptionalChainingNoTemplate);
    }

    return this.finishNode(node, "TaggedTemplateExpression");
  }

  atPossibleAsyncArrow(base) {
    return base.type === "Identifier" && base.name === "async" && this.state.lastTokEnd === base.end && !this.canInsertSemicolon() && base.end - base.start === 5 && base.start === this.state.potentialArrowAt;
  }

  finishCallExpression(node, optional) {
    if (node.callee.type === "Import") {
      if (node.arguments.length === 2) {
        if (!this.hasPlugin("moduleAttributes")) {
          this.expectPlugin("importAssertions");
        }
      }

      if (node.arguments.length === 0 || node.arguments.length > 2) {
        this.raise(node.start, _error.Errors.ImportCallArity, this.hasPlugin("importAssertions") || this.hasPlugin("moduleAttributes") ? "one or two arguments" : "one argument");
      } else {
        for (let _i = 0, _node$arguments = node.arguments; _i < _node$arguments.length; _i++) {
          const arg = _node$arguments[_i];

          if (arg.type === "SpreadElement") {
            this.raise(arg.start, _error.Errors.ImportCallSpreadArgument);
          }
        }
      }
    }

    return this.finishNode(node, optional ? "OptionalCallExpression" : "CallExpression");
  }

  parseCallExpressionArguments(close, possibleAsyncArrow, dynamicImport, allowPlaceholder, nodeForExtra) {
    const elts = [];
    let innerParenStart;
    let first = true;
    const oldInFSharpPipelineDirectBody = this.state.inFSharpPipelineDirectBody;
    this.state.inFSharpPipelineDirectBody = false;

    while (!this.eat(close)) {
      if (first) {
        first = false;
      } else {
        this.expect(_types.types.comma);

        if (this.match(close)) {
          if (dynamicImport && !this.hasPlugin("importAssertions") && !this.hasPlugin("moduleAttributes")) {
            this.raise(this.state.lastTokStart, _error.Errors.ImportCallArgumentTrailingComma);
          }

          if (nodeForExtra) {
            this.addExtra(nodeForExtra, "trailingComma", this.state.lastTokStart);
          }

          this.next();
          break;
        }
      }

      if (this.match(_types.types.parenL) && !innerParenStart) {
        innerParenStart = this.state.start;
      }

      elts.push(this.parseExprListItem(false, possibleAsyncArrow ? new _util.ExpressionErrors() : undefined, possibleAsyncArrow ? {
        start: 0
      } : undefined, allowPlaceholder));
    }

    if (possibleAsyncArrow && innerParenStart && this.shouldParseAsyncArrow()) {
      this.unexpected();
    }

    this.state.inFSharpPipelineDirectBody = oldInFSharpPipelineDirectBody;
    return elts;
  }

  shouldParseAsyncArrow() {
    return this.match(_types.types.arrow) && !this.canInsertSemicolon();
  }

  parseAsyncArrowFromCallExpression(node, call) {
    this.expect(_types.types.arrow);
    this.parseArrowExpression(node, call.arguments, true, call.extra?.trailingComma);
    return node;
  }

  parseNoCallExpr() {
    const startPos = this.state.start;
    const startLoc = this.state.startLoc;
    return this.parseSubscripts(this.parseExprAtom(), startPos, startLoc, true);
  }

  parseExprAtom(refExpressionErrors) {
    if (this.state.type === _types.types.slash) this.readRegexp();
    const canBeArrow = this.state.potentialArrowAt === this.state.start;
    let node;

    switch (this.state.type) {
      case _types.types._super:
        return this.parseSuper();

      case _types.types._import:
        node = this.startNode();
        this.next();

        if (this.match(_types.types.dot)) {
          return this.parseImportMetaProperty(node);
        }

        if (!this.match(_types.types.parenL)) {
          this.raise(this.state.lastTokStart, _error.Errors.UnsupportedImport);
        }

        return this.finishNode(node, "Import");

      case _types.types._this:
        node = this.startNode();
        this.next();
        return this.finishNode(node, "ThisExpression");

      case _types.types.name:
        {
          const containsEsc = this.state.containsEsc;
          const id = this.parseIdentifier();

          if (!containsEsc && id.name === "async" && !this.canInsertSemicolon()) {
            if (this.match(_types.types._function)) {
              const last = this.state.context.length - 1;

              if (this.state.context[last] !== _context.types.functionStatement) {
                throw new Error("Internal error");
              }

              this.state.context[last] = _context.types.functionExpression;
              this.next();
              return this.parseFunction(this.startNodeAtNode(id), undefined, true);
            } else if (this.match(_types.types.name)) {
              return this.parseAsyncArrowUnaryFunction(id);
            }
          }

          if (canBeArrow && this.match(_types.types.arrow) && !this.canInsertSemicolon()) {
            this.next();
            return this.parseArrowExpression(this.startNodeAtNode(id), [id], false);
          }

          return id;
        }

      case _types.types._do:
        {
          return this.parseDo();
        }

      case _types.types.regexp:
        {
          const value = this.state.value;
          node = this.parseLiteral(value.value, "RegExpLiteral");
          node.pattern = value.pattern;
          node.flags = value.flags;
          return node;
        }

      case _types.types.num:
        return this.parseLiteral(this.state.value, "NumericLiteral");

      case _types.types.bigint:
        return this.parseLiteral(this.state.value, "BigIntLiteral");

      case _types.types.decimal:
        return this.parseLiteral(this.state.value, "DecimalLiteral");

      case _types.types.string:
        return this.parseLiteral(this.state.value, "StringLiteral");

      case _types.types._null:
        node = this.startNode();
        this.next();
        return this.finishNode(node, "NullLiteral");

      case _types.types._true:
      case _types.types._false:
        return this.parseBooleanLiteral();

      case _types.types.parenL:
        return this.parseParenAndDistinguishExpression(canBeArrow);

      case _types.types.bracketBarL:
      case _types.types.bracketHashL:
        {
          return this.parseArrayLike(this.state.type === _types.types.bracketBarL ? _types.types.bracketBarR : _types.types.bracketR, false, true, refExpressionErrors);
        }

      case _types.types.bracketL:
        {
          return this.parseArrayLike(_types.types.bracketR, true, false, refExpressionErrors);
        }

      case _types.types.braceBarL:
      case _types.types.braceHashL:
        {
          return this.parseObjectLike(this.state.type === _types.types.braceBarL ? _types.types.braceBarR : _types.types.braceR, false, true, refExpressionErrors);
        }

      case _types.types.braceL:
        {
          return this.parseObjectLike(_types.types.braceR, false, false, refExpressionErrors);
        }

      case _types.types._function:
        return this.parseFunctionOrFunctionSent();

      case _types.types.at:
        this.parseDecorators();

      case _types.types._class:
        node = this.startNode();
        this.takeDecorators(node);
        return this.parseClass(node, false);

      case _types.types._new:
        return this.parseNewOrNewTarget();

      case _types.types.backQuote:
        return this.parseTemplate(false);

      case _types.types.doubleColon:
        {
          node = this.startNode();
          this.next();
          node.object = null;
          const callee = node.callee = this.parseNoCallExpr();

          if (callee.type === "MemberExpression") {
            return this.finishNode(node, "BindExpression");
          } else {
            throw this.raise(callee.start, _error.Errors.UnsupportedBind);
          }
        }

      case _types.types.hash:
        {
          if (this.state.inPipeline) {
            node = this.startNode();

            if (this.getPluginOption("pipelineOperator", "proposal") !== "smart") {
              this.raise(node.start, _error.Errors.PrimaryTopicRequiresSmartPipeline);
            }

            this.next();

            if (!this.primaryTopicReferenceIsAllowedInCurrentTopicContext()) {
              this.raise(node.start, _error.Errors.PrimaryTopicNotAllowed);
            }

            this.registerTopicReference();
            return this.finishNode(node, "PipelinePrimaryTopicReference");
          }

          const nextCh = this.input.codePointAt(this.state.end);

          if ((0, _identifier.isIdentifierStart)(nextCh) || nextCh === 92) {
            const start = this.state.start;
            node = this.parseMaybePrivateName(true);

            if (this.match(_types.types._in)) {
              this.expectPlugin("privateIn");
              this.classScope.usePrivateName(node.id.name, node.start);
            } else if (this.hasPlugin("privateIn")) {
              this.raise(this.state.start, _error.Errors.PrivateInExpectedIn, node.id.name);
            } else {
              throw this.unexpected(start);
            }

            return node;
          }
        }

      case _types.types.relational:
        {
          if (this.state.value === "<") {
            const lookaheadCh = this.input.codePointAt(this.nextTokenStart());

            if ((0, _identifier.isIdentifierStart)(lookaheadCh) || lookaheadCh === 62) {
                this.expectOnePlugin(["jsx", "flow", "typescript"]);
              }
          }
        }

      default:
        throw this.unexpected();
    }
  }

  parseAsyncArrowUnaryFunction(id) {
    const node = this.startNodeAtNode(id);
    this.prodParam.enter((0, _productionParameter.functionFlags)(true, this.prodParam.hasYield));
    const params = [this.parseIdentifier()];
    this.prodParam.exit();

    if (this.hasPrecedingLineBreak()) {
      this.raise(this.state.pos, _error.Errors.LineTerminatorBeforeArrow);
    }

    this.expect(_types.types.arrow);
    this.parseArrowExpression(node, params, true);
    return node;
  }

  parseDo() {
    this.expectPlugin("doExpressions");
    const node = this.startNode();
    this.next();
    const oldLabels = this.state.labels;
    this.state.labels = [];
    node.body = this.parseBlock();
    this.state.labels = oldLabels;
    return this.finishNode(node, "DoExpression");
  }

  parseSuper() {
    const node = this.startNode();
    this.next();

    if (this.match(_types.types.parenL) && !this.scope.allowDirectSuper && !this.options.allowSuperOutsideMethod) {
      this.raise(node.start, _error.Errors.SuperNotAllowed);
    } else if (!this.scope.allowSuper && !this.options.allowSuperOutsideMethod) {
      this.raise(node.start, _error.Errors.UnexpectedSuper);
    }

    if (!this.match(_types.types.parenL) && !this.match(_types.types.bracketL) && !this.match(_types.types.dot)) {
      this.raise(node.start, _error.Errors.UnsupportedSuper);
    }

    return this.finishNode(node, "Super");
  }

  parseBooleanLiteral() {
    const node = this.startNode();
    node.value = this.match(_types.types._true);
    this.next();
    return this.finishNode(node, "BooleanLiteral");
  }

  parseMaybePrivateName(isPrivateNameAllowed) {
    const isPrivate = this.match(_types.types.hash);

    if (isPrivate) {
      this.expectOnePlugin(["classPrivateProperties", "classPrivateMethods"]);

      if (!isPrivateNameAllowed) {
        this.raise(this.state.pos, _error.Errors.UnexpectedPrivateField);
      }

      const node = this.startNode();
      this.next();
      this.assertNoSpace("Unexpected space between # and identifier");
      node.id = this.parseIdentifier(true);
      return this.finishNode(node, "PrivateName");
    } else {
      return this.parseIdentifier(true);
    }
  }

  parseFunctionOrFunctionSent() {
    const node = this.startNode();
    this.next();

    if (this.prodParam.hasYield && this.match(_types.types.dot)) {
      const meta = this.createIdentifier(this.startNodeAtNode(node), "function");
      this.next();
      return this.parseMetaProperty(node, meta, "sent");
    }

    return this.parseFunction(node);
  }

  parseMetaProperty(node, meta, propertyName) {
    node.meta = meta;

    if (meta.name === "function" && propertyName === "sent") {
      if (this.isContextual(propertyName)) {
        this.expectPlugin("functionSent");
      } else if (!this.hasPlugin("functionSent")) {
        this.unexpected();
      }
    }

    const containsEsc = this.state.containsEsc;
    node.property = this.parseIdentifier(true);

    if (node.property.name !== propertyName || containsEsc) {
      this.raise(node.property.start, _error.Errors.UnsupportedMetaProperty, meta.name, propertyName);
    }

    return this.finishNode(node, "MetaProperty");
  }

  parseImportMetaProperty(node) {
    const id = this.createIdentifier(this.startNodeAtNode(node), "import");
    this.next();

    if (this.isContextual("meta")) {
      if (!this.inModule) {
        this.raiseWithData(id.start, {
          code: "BABEL_PARSER_SOURCETYPE_MODULE_REQUIRED"
        }, _error.Errors.ImportMetaOutsideModule);
      }

      this.sawUnambiguousESM = true;
    }

    return this.parseMetaProperty(node, id, "meta");
  }

  parseLiteral(value, type, startPos, startLoc) {
    startPos = startPos || this.state.start;
    startLoc = startLoc || this.state.startLoc;
    const node = this.startNodeAt(startPos, startLoc);
    this.addExtra(node, "rawValue", value);
    this.addExtra(node, "raw", this.input.slice(startPos, this.state.end));
    node.value = value;
    this.next();
    return this.finishNode(node, type);
  }

  parseParenAndDistinguishExpression(canBeArrow) {
    const startPos = this.state.start;
    const startLoc = this.state.startLoc;
    let val;
    this.next();
    this.expressionScope.enter((0, _expressionScope.newArrowHeadScope)());
    const oldMaybeInArrowParameters = this.state.maybeInArrowParameters;
    const oldInFSharpPipelineDirectBody = this.state.inFSharpPipelineDirectBody;
    this.state.maybeInArrowParameters = true;
    this.state.inFSharpPipelineDirectBody = false;
    const innerStartPos = this.state.start;
    const innerStartLoc = this.state.startLoc;
    const exprList = [];
    const refExpressionErrors = new _util.ExpressionErrors();
    const refNeedsArrowPos = {
      start: 0
    };
    let first = true;
    let spreadStart;
    let optionalCommaStart;

    while (!this.match(_types.types.parenR)) {
      if (first) {
        first = false;
      } else {
        this.expect(_types.types.comma, refNeedsArrowPos.start || null);

        if (this.match(_types.types.parenR)) {
          optionalCommaStart = this.state.start;
          break;
        }
      }

      if (this.match(_types.types.ellipsis)) {
        const spreadNodeStartPos = this.state.start;
        const spreadNodeStartLoc = this.state.startLoc;
        spreadStart = this.state.start;
        exprList.push(this.parseParenItem(this.parseRestBinding(), spreadNodeStartPos, spreadNodeStartLoc));
        this.checkCommaAfterRest(41);
        break;
      } else {
        exprList.push(this.parseMaybeAssignAllowIn(refExpressionErrors, this.parseParenItem, refNeedsArrowPos));
      }
    }

    const innerEndPos = this.state.lastTokEnd;
    const innerEndLoc = this.state.lastTokEndLoc;
    this.expect(_types.types.parenR);
    this.state.maybeInArrowParameters = oldMaybeInArrowParameters;
    this.state.inFSharpPipelineDirectBody = oldInFSharpPipelineDirectBody;
    let arrowNode = this.startNodeAt(startPos, startLoc);

    if (canBeArrow && this.shouldParseArrow() && (arrowNode = this.parseArrow(arrowNode))) {
      this.expressionScope.validateAsPattern();
      this.expressionScope.exit();

      for (let _i2 = 0; _i2 < exprList.length; _i2++) {
        const param = exprList[_i2];

        if (param.extra && param.extra.parenthesized) {
          this.unexpected(param.extra.parenStart);
        }
      }

      this.parseArrowExpression(arrowNode, exprList, false);
      return arrowNode;
    }

    this.expressionScope.exit();

    if (!exprList.length) {
      this.unexpected(this.state.lastTokStart);
    }

    if (optionalCommaStart) this.unexpected(optionalCommaStart);
    if (spreadStart) this.unexpected(spreadStart);
    this.checkExpressionErrors(refExpressionErrors, true);
    if (refNeedsArrowPos.start) this.unexpected(refNeedsArrowPos.start);
    this.toReferencedListDeep(exprList, true);

    if (exprList.length > 1) {
      val = this.startNodeAt(innerStartPos, innerStartLoc);
      val.expressions = exprList;
      this.finishNodeAt(val, "SequenceExpression", innerEndPos, innerEndLoc);
    } else {
      val = exprList[0];
    }

    if (!this.options.createParenthesizedExpressions) {
      this.addExtra(val, "parenthesized", true);
      this.addExtra(val, "parenStart", startPos);
      return val;
    }

    const parenExpression = this.startNodeAt(startPos, startLoc);
    parenExpression.expression = val;
    this.finishNode(parenExpression, "ParenthesizedExpression");
    return parenExpression;
  }

  shouldParseArrow() {
    return !this.canInsertSemicolon();
  }

  parseArrow(node) {
    if (this.eat(_types.types.arrow)) {
      return node;
    }
  }

  parseParenItem(node, startPos, startLoc) {
    return node;
  }

  parseNewOrNewTarget() {
    const node = this.startNode();
    this.next();

    if (this.match(_types.types.dot)) {
      const meta = this.createIdentifier(this.startNodeAtNode(node), "new");
      this.next();
      const metaProp = this.parseMetaProperty(node, meta, "target");

      if (!this.scope.inNonArrowFunction && !this.scope.inClass) {
        let error = _error.Errors.UnexpectedNewTarget;

        if (this.hasPlugin("classProperties")) {
          error += " or class properties";
        }

        this.raise(metaProp.start, error);
      }

      return metaProp;
    }

    return this.parseNew(node);
  }

  parseNew(node) {
    node.callee = this.parseNoCallExpr();

    if (node.callee.type === "Import") {
      this.raise(node.callee.start, _error.Errors.ImportCallNotNewExpression);
    } else if (node.callee.type === "OptionalMemberExpression" || node.callee.type === "OptionalCallExpression") {
      this.raise(this.state.lastTokEnd, _error.Errors.OptionalChainingNoNew);
    } else if (this.eat(_types.types.questionDot)) {
      this.raise(this.state.start, _error.Errors.OptionalChainingNoNew);
    }

    this.parseNewArguments(node);
    return this.finishNode(node, "NewExpression");
  }

  parseNewArguments(node) {
    if (this.eat(_types.types.parenL)) {
      const args = this.parseExprList(_types.types.parenR);
      this.toReferencedList(args);
      node.arguments = args;
    } else {
      node.arguments = [];
    }
  }

  parseTemplateElement(isTagged) {
    const elem = this.startNode();

    if (this.state.value === null) {
      if (!isTagged) {
        this.raise(this.state.start + 1, _error.Errors.InvalidEscapeSequenceTemplate);
      }
    }

    elem.value = {
      raw: this.input.slice(this.state.start, this.state.end).replace(/\r\n?/g, "\n"),
      cooked: this.state.value
    };
    this.next();
    elem.tail = this.match(_types.types.backQuote);
    return this.finishNode(elem, "TemplateElement");
  }

  parseTemplate(isTagged) {
    const node = this.startNode();
    this.next();
    node.expressions = [];
    let curElt = this.parseTemplateElement(isTagged);
    node.quasis = [curElt];

    while (!curElt.tail) {
      this.expect(_types.types.dollarBraceL);
      node.expressions.push(this.parseTemplateSubstitution());
      this.expect(_types.types.braceR);
      node.quasis.push(curElt = this.parseTemplateElement(isTagged));
    }

    this.next();
    return this.finishNode(node, "TemplateLiteral");
  }

  parseTemplateSubstitution() {
    return this.parseExpression();
  }

  parseObjectLike(close, isPattern, isRecord, refExpressionErrors) {
    if (isRecord) {
      this.expectPlugin("recordAndTuple");
    }

    const oldInFSharpPipelineDirectBody = this.state.inFSharpPipelineDirectBody;
    this.state.inFSharpPipelineDirectBody = false;
    const propHash = Object.create(null);
    let first = true;
    const node = this.startNode();
    node.properties = [];
    this.next();

    while (!this.match(close)) {
      if (first) {
        first = false;
      } else {
        this.expect(_types.types.comma);

        if (this.match(close)) {
          this.addExtra(node, "trailingComma", this.state.lastTokStart);
          break;
        }
      }

      const prop = this.parsePropertyDefinition(isPattern, refExpressionErrors);

      if (!isPattern) {
        this.checkProto(prop, isRecord, propHash, refExpressionErrors);
      }

      if (isRecord && prop.type !== "ObjectProperty" && prop.type !== "SpreadElement") {
        this.raise(prop.start, _error.Errors.InvalidRecordProperty);
      }

      if (prop.shorthand) {
        this.addExtra(prop, "shorthand", true);
      }

      node.properties.push(prop);
    }

    this.state.exprAllowed = false;
    this.next();
    this.state.inFSharpPipelineDirectBody = oldInFSharpPipelineDirectBody;
    let type = "ObjectExpression";

    if (isPattern) {
      type = "ObjectPattern";
    } else if (isRecord) {
      type = "RecordExpression";
    }

    return this.finishNode(node, type);
  }

  maybeAsyncOrAccessorProp(prop) {
    return !prop.computed && prop.key.type === "Identifier" && (this.isLiteralPropertyName() || this.match(_types.types.bracketL) || this.match(_types.types.star));
  }

  parsePropertyDefinition(isPattern, refExpressionErrors) {
    let decorators = [];

    if (this.match(_types.types.at)) {
      if (this.hasPlugin("decorators")) {
        this.raise(this.state.start, _error.Errors.UnsupportedPropertyDecorator);
      }

      while (this.match(_types.types.at)) {
        decorators.push(this.parseDecorator());
      }
    }

    const prop = this.startNode();
    let isGenerator = false;
    let isAsync = false;
    let isAccessor = false;
    let startPos;
    let startLoc;

    if (this.match(_types.types.ellipsis)) {
      if (decorators.length) this.unexpected();

      if (isPattern) {
        this.next();
        prop.argument = this.parseIdentifier();
        this.checkCommaAfterRest(125);
        return this.finishNode(prop, "RestElement");
      }

      return this.parseSpread();
    }

    if (decorators.length) {
      prop.decorators = decorators;
      decorators = [];
    }

    prop.method = false;

    if (isPattern || refExpressionErrors) {
      startPos = this.state.start;
      startLoc = this.state.startLoc;
    }

    if (!isPattern) {
      isGenerator = this.eat(_types.types.star);
    }

    const containsEsc = this.state.containsEsc;
    const key = this.parsePropertyName(prop, false);

    if (!isPattern && !isGenerator && !containsEsc && this.maybeAsyncOrAccessorProp(prop)) {
      const keyName = key.name;

      if (keyName === "async" && !this.hasPrecedingLineBreak()) {
        isAsync = true;
        isGenerator = this.eat(_types.types.star);
        this.parsePropertyName(prop, false);
      }

      if (keyName === "get" || keyName === "set") {
        isAccessor = true;
        prop.kind = keyName;

        if (this.match(_types.types.star)) {
          isGenerator = true;
          this.raise(this.state.pos, _error.Errors.AccessorIsGenerator, keyName);
          this.next();
        }

        this.parsePropertyName(prop, false);
      }
    }

    this.parseObjPropValue(prop, startPos, startLoc, isGenerator, isAsync, isPattern, isAccessor, refExpressionErrors);
    return prop;
  }

  getGetterSetterExpectedParamCount(method) {
    return method.kind === "get" ? 0 : 1;
  }

  getObjectOrClassMethodParams(method) {
    return method.params;
  }

  checkGetterSetterParams(method) {
    const paramCount = this.getGetterSetterExpectedParamCount(method);
    const params = this.getObjectOrClassMethodParams(method);
    const start = method.start;

    if (params.length !== paramCount) {
      if (method.kind === "get") {
        this.raise(start, _error.Errors.BadGetterArity);
      } else {
        this.raise(start, _error.Errors.BadSetterArity);
      }
    }

    if (method.kind === "set" && params[params.length - 1]?.type === "RestElement") {
      this.raise(start, _error.Errors.BadSetterRestParameter);
    }
  }

  parseObjectMethod(prop, isGenerator, isAsync, isPattern, isAccessor) {
    if (isAccessor) {
      this.parseMethod(prop, isGenerator, false, false, false, "ObjectMethod");
      this.checkGetterSetterParams(prop);
      return prop;
    }

    if (isAsync || isGenerator || this.match(_types.types.parenL)) {
      if (isPattern) this.unexpected();
      prop.kind = "method";
      prop.method = true;
      return this.parseMethod(prop, isGenerator, isAsync, false, false, "ObjectMethod");
    }
  }

  parseObjectProperty(prop, startPos, startLoc, isPattern, refExpressionErrors) {
    prop.shorthand = false;

    if (this.eat(_types.types.colon)) {
      prop.value = isPattern ? this.parseMaybeDefault(this.state.start, this.state.startLoc) : this.parseMaybeAssignAllowIn(refExpressionErrors);
      return this.finishNode(prop, "ObjectProperty");
    }

    if (!prop.computed && prop.key.type === "Identifier") {
      this.checkReservedWord(prop.key.name, prop.key.start, true, false);

      if (isPattern) {
        prop.value = this.parseMaybeDefault(startPos, startLoc, prop.key.__clone());
      } else if (this.match(_types.types.eq) && refExpressionErrors) {
        if (refExpressionErrors.shorthandAssign === -1) {
          refExpressionErrors.shorthandAssign = this.state.start;
        }

        prop.value = this.parseMaybeDefault(startPos, startLoc, prop.key.__clone());
      } else {
        prop.value = prop.key.__clone();
      }

      prop.shorthand = true;
      return this.finishNode(prop, "ObjectProperty");
    }
  }

  parseObjPropValue(prop, startPos, startLoc, isGenerator, isAsync, isPattern, isAccessor, refExpressionErrors) {
    const node = this.parseObjectMethod(prop, isGenerator, isAsync, isPattern, isAccessor) || this.parseObjectProperty(prop, startPos, startLoc, isPattern, refExpressionErrors);
    if (!node) this.unexpected();
    return node;
  }

  parsePropertyName(prop, isPrivateNameAllowed) {
    if (this.eat(_types.types.bracketL)) {
      prop.computed = true;
      prop.key = this.parseMaybeAssignAllowIn();
      this.expect(_types.types.bracketR);
    } else {
      const oldInPropertyName = this.state.inPropertyName;
      this.state.inPropertyName = true;
      prop.key = this.match(_types.types.num) || this.match(_types.types.string) || this.match(_types.types.bigint) || this.match(_types.types.decimal) ? this.parseExprAtom() : this.parseMaybePrivateName(isPrivateNameAllowed);

      if (prop.key.type !== "PrivateName") {
        prop.computed = false;
      }

      this.state.inPropertyName = oldInPropertyName;
    }

    return prop.key;
  }

  initFunction(node, isAsync) {
    node.id = null;
    node.generator = false;
    node.async = !!isAsync;
  }

  parseMethod(node, isGenerator, isAsync, isConstructor, allowDirectSuper, type, inClassScope = false) {
    this.initFunction(node, isAsync);
    node.generator = !!isGenerator;
    const allowModifiers = isConstructor;
    this.scope.enter(_scopeflags.SCOPE_FUNCTION | _scopeflags.SCOPE_SUPER | (inClassScope ? _scopeflags.SCOPE_CLASS : 0) | (allowDirectSuper ? _scopeflags.SCOPE_DIRECT_SUPER : 0));
    this.prodParam.enter((0, _productionParameter.functionFlags)(isAsync, node.generator));
    this.parseFunctionParams(node, allowModifiers);
    this.parseFunctionBodyAndFinish(node, type, true);
    this.prodParam.exit();
    this.scope.exit();
    return node;
  }

  parseArrayLike(close, canBePattern, isTuple, refExpressionErrors) {
    if (isTuple) {
      this.expectPlugin("recordAndTuple");
    }

    const oldInFSharpPipelineDirectBody = this.state.inFSharpPipelineDirectBody;
    this.state.inFSharpPipelineDirectBody = false;
    const node = this.startNode();
    this.next();
    node.elements = this.parseExprList(close, !isTuple, refExpressionErrors, node);
    this.state.inFSharpPipelineDirectBody = oldInFSharpPipelineDirectBody;
    return this.finishNode(node, isTuple ? "TupleExpression" : "ArrayExpression");
  }

  parseArrowExpression(node, params, isAsync, trailingCommaPos) {
    this.scope.enter(_scopeflags.SCOPE_FUNCTION | _scopeflags.SCOPE_ARROW);
    let flags = (0, _productionParameter.functionFlags)(isAsync, false);

    if (!this.match(_types.types.bracketL) && this.prodParam.hasIn) {
      flags |= _productionParameter.PARAM_IN;
    }

    this.prodParam.enter(flags);
    this.initFunction(node, isAsync);
    const oldMaybeInArrowParameters = this.state.maybeInArrowParameters;

    if (params) {
      this.state.maybeInArrowParameters = true;
      this.setArrowFunctionParameters(node, params, trailingCommaPos);
    }

    this.state.maybeInArrowParameters = false;
    this.parseFunctionBody(node, true);
    this.prodParam.exit();
    this.scope.exit();
    this.state.maybeInArrowParameters = oldMaybeInArrowParameters;
    return this.finishNode(node, "ArrowFunctionExpression");
  }

  setArrowFunctionParameters(node, params, trailingCommaPos) {
    node.params = this.toAssignableList(params, trailingCommaPos);
  }

  parseFunctionBodyAndFinish(node, type, isMethod = false) {
    this.parseFunctionBody(node, false, isMethod);
    this.finishNode(node, type);
  }

  parseFunctionBody(node, allowExpression, isMethod = false) {
    const isExpression = allowExpression && !this.match(_types.types.braceL);
    this.expressionScope.enter((0, _expressionScope.newExpressionScope)());

    if (isExpression) {
      node.body = this.parseMaybeAssign();
      this.checkParams(node, false, allowExpression, false);
    } else {
      const oldStrict = this.state.strict;
      const oldLabels = this.state.labels;
      this.state.labels = [];
      this.prodParam.enter(this.prodParam.currentFlags() | _productionParameter.PARAM_RETURN);
      node.body = this.parseBlock(true, false, hasStrictModeDirective => {
        const nonSimple = !this.isSimpleParamList(node.params);

        if (hasStrictModeDirective && nonSimple) {
          const errorPos = (node.kind === "method" || node.kind === "constructor") && !!node.key ? node.key.end : node.start;
          this.raise(errorPos, _error.Errors.IllegalLanguageModeDirective);
        }

        const strictModeChanged = !oldStrict && this.state.strict;
        this.checkParams(node, !this.state.strict && !allowExpression && !isMethod && !nonSimple, allowExpression, strictModeChanged);

        if (this.state.strict && node.id) {
          this.checkLVal(node.id, _scopeflags.BIND_OUTSIDE, undefined, "function name", undefined, strictModeChanged);
        }
      });
      this.prodParam.exit();
      this.expressionScope.exit();
      this.state.labels = oldLabels;
    }
  }

  isSimpleParamList(params) {
    for (let i = 0, len = params.length; i < len; i++) {
      if (params[i].type !== "Identifier") return false;
    }

    return true;
  }

  checkParams(node, allowDuplicates, isArrowFunction, strictModeChanged = true) {
    const nameHash = Object.create(null);

    for (let i = 0; i < node.params.length; i++) {
      this.checkLVal(node.params[i], _scopeflags.BIND_VAR, allowDuplicates ? null : nameHash, "function parameter list", undefined, strictModeChanged);
    }
  }

  parseExprList(close, allowEmpty, refExpressionErrors, nodeForExtra) {
    const elts = [];
    let first = true;

    while (!this.eat(close)) {
      if (first) {
        first = false;
      } else {
        this.expect(_types.types.comma);

        if (this.match(close)) {
          if (nodeForExtra) {
            this.addExtra(nodeForExtra, "trailingComma", this.state.lastTokStart);
          }

          this.next();
          break;
        }
      }

      elts.push(this.parseExprListItem(allowEmpty, refExpressionErrors));
    }

    return elts;
  }

  parseExprListItem(allowEmpty, refExpressionErrors, refNeedsArrowPos, allowPlaceholder) {
    let elt;

    if (this.match(_types.types.comma)) {
      if (!allowEmpty) {
        this.raise(this.state.pos, _error.Errors.UnexpectedToken, ",");
      }

      elt = null;
    } else if (this.match(_types.types.ellipsis)) {
      const spreadNodeStartPos = this.state.start;
      const spreadNodeStartLoc = this.state.startLoc;
      elt = this.parseParenItem(this.parseSpread(refExpressionErrors, refNeedsArrowPos), spreadNodeStartPos, spreadNodeStartLoc);
    } else if (this.match(_types.types.question)) {
      this.expectPlugin("partialApplication");

      if (!allowPlaceholder) {
        this.raise(this.state.start, _error.Errors.UnexpectedArgumentPlaceholder);
      }

      const node = this.startNode();
      this.next();
      elt = this.finishNode(node, "ArgumentPlaceholder");
    } else {
      elt = this.parseMaybeAssignAllowIn(refExpressionErrors, this.parseParenItem, refNeedsArrowPos);
    }

    return elt;
  }

  parseIdentifier(liberal) {
    const node = this.startNode();
    const name = this.parseIdentifierName(node.start, liberal);
    return this.createIdentifier(node, name);
  }

  createIdentifier(node, name) {
    node.name = name;
    node.loc.identifierName = name;
    return this.finishNode(node, "Identifier");
  }

  parseIdentifierName(pos, liberal) {
    let name;
    const {
      start,
      type
    } = this.state;

    if (type === _types.types.name) {
      name = this.state.value;
    } else if (type.keyword) {
      name = type.keyword;
      const curContext = this.curContext();

      if ((type === _types.types._class || type === _types.types._function) && (curContext === _context.types.functionStatement || curContext === _context.types.functionExpression)) {
        this.state.context.pop();
      }
    } else {
      throw this.unexpected();
    }

    if (liberal) {
      this.state.type = _types.types.name;
    } else {
      this.checkReservedWord(name, start, !!type.keyword, false);
    }

    this.next();
    return name;
  }

  checkReservedWord(word, startLoc, checkKeywords, isBinding) {
    if (this.prodParam.hasYield && word === "yield") {
      this.raise(startLoc, _error.Errors.YieldBindingIdentifier);
      return;
    }

    if (word === "await") {
      if (this.prodParam.hasAwait) {
        this.raise(startLoc, _error.Errors.AwaitBindingIdentifier);
        return;
      } else {
        this.expressionScope.recordAsyncArrowParametersError(startLoc, _error.Errors.AwaitBindingIdentifier);
      }
    }

    if (this.scope.inClass && !this.scope.inNonArrowFunction && word === "arguments") {
      this.raise(startLoc, _error.Errors.ArgumentsInClass);
      return;
    }

    if (checkKeywords && (0, _identifier.isKeyword)(word)) {
      this.raise(startLoc, _error.Errors.UnexpectedKeyword, word);
      return;
    }

    const reservedTest = !this.state.strict ? _identifier.isReservedWord : isBinding ? _identifier.isStrictBindReservedWord : _identifier.isStrictReservedWord;

    if (reservedTest(word, this.inModule)) {
      if (!this.prodParam.hasAwait && word === "await") {
        this.raise(startLoc, this.hasPlugin("topLevelAwait") ? _error.Errors.AwaitNotInAsyncContext : _error.Errors.AwaitNotInAsyncFunction);
      } else {
        this.raise(startLoc, _error.Errors.UnexpectedReservedWord, word);
      }
    }
  }

  isAwaitAllowed() {
    if (this.scope.inFunction) return this.prodParam.hasAwait;
    if (this.options.allowAwaitOutsideFunction) return true;

    if (this.hasPlugin("topLevelAwait")) {
      return this.inModule && this.prodParam.hasAwait;
    }

    return false;
  }

  parseAwait() {
    const node = this.startNode();
    this.next();
    this.expressionScope.recordParameterInitializerError(node.start, _error.Errors.AwaitExpressionFormalParameter);

    if (this.eat(_types.types.star)) {
      this.raise(node.start, _error.Errors.ObsoleteAwaitStar);
    }

    if (!this.scope.inFunction && !this.options.allowAwaitOutsideFunction) {
      if (this.hasPrecedingLineBreak() || this.match(_types.types.plusMin) || this.match(_types.types.parenL) || this.match(_types.types.bracketL) || this.match(_types.types.backQuote) || this.match(_types.types.regexp) || this.match(_types.types.slash) || this.hasPlugin("v8intrinsic") && this.match(_types.types.modulo)) {
        this.ambiguousScriptDifferentAst = true;
      } else {
        this.sawUnambiguousESM = true;
      }
    }

    if (!this.state.soloAwait) {
      node.argument = this.parseMaybeUnary();
    }

    return this.finishNode(node, "AwaitExpression");
  }

  parseYield() {
    const node = this.startNode();
    this.expressionScope.recordParameterInitializerError(node.start, _error.Errors.YieldInParameter);
    this.next();

    if (this.match(_types.types.semi) || !this.match(_types.types.star) && !this.state.type.startsExpr || this.hasPrecedingLineBreak()) {
      node.delegate = false;
      node.argument = null;
    } else {
      node.delegate = this.eat(_types.types.star);
      node.argument = this.parseMaybeAssign();
    }

    return this.finishNode(node, "YieldExpression");
  }

  checkPipelineAtInfixOperator(left, leftStartPos) {
    if (this.getPluginOption("pipelineOperator", "proposal") === "smart") {
      if (left.type === "SequenceExpression") {
        this.raise(leftStartPos, _error.Errors.PipelineHeadSequenceExpression);
      }
    }
  }

  parseSmartPipelineBody(childExpression, startPos, startLoc) {
    this.checkSmartPipelineBodyEarlyErrors(childExpression, startPos);
    return this.parseSmartPipelineBodyInStyle(childExpression, startPos, startLoc);
  }

  checkSmartPipelineBodyEarlyErrors(childExpression, startPos) {
    if (this.match(_types.types.arrow)) {
      throw this.raise(this.state.start, _error.Errors.PipelineBodyNoArrow);
    } else if (childExpression.type === "SequenceExpression") {
      this.raise(startPos, _error.Errors.PipelineBodySequenceExpression);
    }
  }

  parseSmartPipelineBodyInStyle(childExpression, startPos, startLoc) {
    const bodyNode = this.startNodeAt(startPos, startLoc);
    const isSimpleReference = this.isSimpleReference(childExpression);

    if (isSimpleReference) {
      bodyNode.callee = childExpression;
    } else {
      if (!this.topicReferenceWasUsedInCurrentTopicContext()) {
        this.raise(startPos, _error.Errors.PipelineTopicUnused);
      }

      bodyNode.expression = childExpression;
    }

    return this.finishNode(bodyNode, isSimpleReference ? "PipelineBareFunction" : "PipelineTopicExpression");
  }

  isSimpleReference(expression) {
    switch (expression.type) {
      case "MemberExpression":
        return !expression.computed && this.isSimpleReference(expression.object);

      case "Identifier":
        return true;

      default:
        return false;
    }
  }

  withTopicPermittingContext(callback) {
    const outerContextTopicState = this.state.topicContext;
    this.state.topicContext = {
      maxNumOfResolvableTopics: 1,
      maxTopicIndex: null
    };

    try {
      return callback();
    } finally {
      this.state.topicContext = outerContextTopicState;
    }
  }

  withTopicForbiddingContext(callback) {
    const outerContextTopicState = this.state.topicContext;
    this.state.topicContext = {
      maxNumOfResolvableTopics: 0,
      maxTopicIndex: null
    };

    try {
      return callback();
    } finally {
      this.state.topicContext = outerContextTopicState;
    }
  }

  withSoloAwaitPermittingContext(callback) {
    const outerContextSoloAwaitState = this.state.soloAwait;
    this.state.soloAwait = true;

    try {
      return callback();
    } finally {
      this.state.soloAwait = outerContextSoloAwaitState;
    }
  }

  allowInAnd(callback) {
    const flags = this.prodParam.currentFlags();
    const prodParamToSet = _productionParameter.PARAM_IN & ~flags;

    if (prodParamToSet) {
      this.prodParam.enter(flags | _productionParameter.PARAM_IN);

      try {
        return callback();
      } finally {
        this.prodParam.exit();
      }
    }

    return callback();
  }

  disallowInAnd(callback) {
    const flags = this.prodParam.currentFlags();
    const prodParamToClear = _productionParameter.PARAM_IN & flags;

    if (prodParamToClear) {
      this.prodParam.enter(flags & ~_productionParameter.PARAM_IN);

      try {
        return callback();
      } finally {
        this.prodParam.exit();
      }
    }

    return callback();
  }

  registerTopicReference() {
    this.state.topicContext.maxTopicIndex = 0;
  }

  primaryTopicReferenceIsAllowedInCurrentTopicContext() {
    return this.state.topicContext.maxNumOfResolvableTopics >= 1;
  }

  topicReferenceWasUsedInCurrentTopicContext() {
    return this.state.topicContext.maxTopicIndex != null && this.state.topicContext.maxTopicIndex >= 0;
  }

  parseFSharpPipelineBody(prec) {
    const startPos = this.state.start;
    const startLoc = this.state.startLoc;
    this.state.potentialArrowAt = this.state.start;
    const oldInFSharpPipelineDirectBody = this.state.inFSharpPipelineDirectBody;
    this.state.inFSharpPipelineDirectBody = true;
    const ret = this.parseExprOp(this.parseMaybeUnary(), startPos, startLoc, prec);
    this.state.inFSharpPipelineDirectBody = oldInFSharpPipelineDirectBody;
    return ret;
  }

}

exports.default = ExpressionParser;
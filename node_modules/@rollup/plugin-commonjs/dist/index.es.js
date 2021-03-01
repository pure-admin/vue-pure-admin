import { basename, extname, dirname, sep, resolve, join } from 'path';
import { makeLegalIdentifier, attachScopes, extractAssignedNames, createFilter } from '@rollup/pluginutils';
import getCommonDir from 'commondir';
import { existsSync, readFileSync, statSync } from 'fs';
import { walk } from 'estree-walker';
import MagicString from 'magic-string';
import { sync } from 'resolve';
import isReference from 'is-reference';
import glob from 'glob';

var peerDependencies = {
	rollup: "^2.22.0"
};

const PROXY_SUFFIX = '?commonjs-proxy';
const getProxyId = (id) => `\0${id}${PROXY_SUFFIX}`;
const getIdFromProxyId = (proxyId) => proxyId.slice(1, -PROXY_SUFFIX.length);

const EXTERNAL_SUFFIX = '?commonjs-external';
const getExternalProxyId = (id) => `\0${id}${EXTERNAL_SUFFIX}`;
const getIdFromExternalProxyId = (proxyId) => proxyId.slice(1, -EXTERNAL_SUFFIX.length);

const VIRTUAL_PATH_BASE = '/$$rollup_base$$';
const getVirtualPathForDynamicRequirePath = (path, commonDir) => {
  if (path.startsWith(commonDir)) return VIRTUAL_PATH_BASE + path.slice(commonDir.length);
  return path;
};

const DYNAMIC_REGISTER_PREFIX = '\0commonjs-dynamic-register:';
const DYNAMIC_JSON_PREFIX = '\0commonjs-dynamic-json:';
const DYNAMIC_PACKAGES_ID = '\0commonjs-dynamic-packages';

const HELPERS_ID = '\0commonjsHelpers.js';

// `x['default']` is used instead of `x.default` for backward compatibility with ES3 browsers.
// Minifiers like uglify will usually transpile it back if compatibility with ES3 is not enabled.
// This will no longer be necessary once Rollup switches to ES6 output, likely
// in Rollup 3

// The "hasOwnProperty" call in "getDefaultExportFromCjs" is technically not
// needed, but for consumers that use Rollup's old interop pattern, it will fix
// rollup/rollup-plugin-commonjs#224
// We should remove it once Rollup core and this plugin are updated to not use
// this pattern any more
const HELPERS = `
export var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

export function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

export function createCommonjsModule(fn, basedir, module) {
	return module = {
		path: basedir,
		exports: {},
		require: function (path, base) {
			return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
		}
	}, fn(module, module.exports), module.exports;
}

export function getDefaultExportFromNamespaceIfPresent (n) {
	return n && Object.prototype.hasOwnProperty.call(n, 'default') ? n['default'] : n;
}

export function getDefaultExportFromNamespaceIfNotNamed (n) {
	return n && Object.prototype.hasOwnProperty.call(n, 'default') && Object.keys(n).length === 1 ? n['default'] : n;
}

export function getAugmentedNamespace(n) {
	if (n.__esModule) return n;
	var a = Object.defineProperty({}, '__esModule', {value: true});
	Object.keys(n).forEach(function (k) {
		var d = Object.getOwnPropertyDescriptor(n, k);
		Object.defineProperty(a, k, d.get ? d : {
			enumerable: true,
			get: function () {
				return n[k];
			}
		});
	});
	return a;
}
`;

const HELPER_NON_DYNAMIC = `
export function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}
`;

const HELPERS_DYNAMIC = `
export function commonjsRegister (path, loader) {
	DYNAMIC_REQUIRE_LOADERS[path] = loader;
}

const DYNAMIC_REQUIRE_LOADERS = Object.create(null);
const DYNAMIC_REQUIRE_CACHE = Object.create(null);
const DEFAULT_PARENT_MODULE = {
	id: '<' + 'rollup>', exports: {}, parent: undefined, filename: null, loaded: false, children: [], paths: []
};
const CHECKED_EXTENSIONS = ['', '.js', '.json'];

function normalize (path) {
	path = path.replace(/\\\\/g, '/');
	const parts = path.split('/');
	const slashed = parts[0] === '';
	for (let i = 1; i < parts.length; i++) {
		if (parts[i] === '.' || parts[i] === '') {
			parts.splice(i--, 1);
		}
	}
	for (let i = 1; i < parts.length; i++) {
		if (parts[i] !== '..') continue;
		if (i > 0 && parts[i - 1] !== '..' && parts[i - 1] !== '.') {
			parts.splice(--i, 2);
			i--;
		}
	}
	path = parts.join('/');
	if (slashed && path[0] !== '/')
	  path = '/' + path;
	else if (path.length === 0)
	  path = '.';
	return path;
}

function join () {
	if (arguments.length === 0)
	  return '.';
	let joined;
	for (let i = 0; i < arguments.length; ++i) {
	  let arg = arguments[i];
	  if (arg.length > 0) {
		if (joined === undefined)
		  joined = arg;
		else
		  joined += '/' + arg;
	  }
	}
	if (joined === undefined)
	  return '.';

	return joined;
}

function isPossibleNodeModulesPath (modulePath) {
	let c0 = modulePath[0];
	if (c0 === '/' || c0 === '\\\\') return false;
	let c1 = modulePath[1], c2 = modulePath[2];
	if ((c0 === '.' && (!c1 || c1 === '/' || c1 === '\\\\')) ||
		(c0 === '.' && c1 === '.' && (!c2 || c2 === '/' || c2 === '\\\\'))) return false;
	if (c1 === ':' && (c2 === '/' || c2 === '\\\\'))
		return false;
	return true;
}

function dirname (path) {
  if (path.length === 0)
    return '.';

  let i = path.length - 1;
  while (i > 0) {
    const c = path.charCodeAt(i);
    if ((c === 47 || c === 92) && i !== path.length - 1)
      break;
    i--;
  }

  if (i > 0)
    return path.substr(0, i);

  if (path.chartCodeAt(0) === 47 || path.chartCodeAt(0) === 92)
    return path.charAt(0);

  return '.';
}

export function commonjsRequire (path, originalModuleDir) {
	const shouldTryNodeModules = isPossibleNodeModulesPath(path);
	path = normalize(path);
	let relPath;
	while (true) {
		if (!shouldTryNodeModules) {
			relPath = originalModuleDir ? normalize(originalModuleDir + '/' + path) : path;
		} else if (originalModuleDir) {
			relPath = normalize(originalModuleDir + '/node_modules/' + path);
		} else {
			relPath = normalize(join('node_modules', path));
		}
		for (let extensionIndex = 0; extensionIndex < CHECKED_EXTENSIONS.length; extensionIndex++) {
			const resolvedPath = relPath + CHECKED_EXTENSIONS[extensionIndex];
			let cachedModule = DYNAMIC_REQUIRE_CACHE[resolvedPath];
			if (cachedModule) return cachedModule.exports;
			const loader = DYNAMIC_REQUIRE_LOADERS[resolvedPath];
			if (loader) {
				DYNAMIC_REQUIRE_CACHE[resolvedPath] = cachedModule = {
					id: resolvedPath,
					filename: resolvedPath,
					path: dirname(resolvedPath),
					exports: {},
					parent: DEFAULT_PARENT_MODULE,
					loaded: false,
					children: [],
					paths: [],
					require: function (path, base) {
					  return commonjsRequire(path, (base === undefined || base === null) ? cachedModule.path : base);
					}
				};
				try {
					loader.call(commonjsGlobal, cachedModule, cachedModule.exports);
				} catch (error) {
					delete DYNAMIC_REQUIRE_CACHE[resolvedPath];
					throw error;
				}
				cachedModule.loaded = true;
				return cachedModule.exports;
			};
		}
		if (!shouldTryNodeModules) break;
		const nextDir = normalize(originalModuleDir + '/..');
		if (nextDir === originalModuleDir) break;
		originalModuleDir = nextDir;
	}
	return require(path);
}

commonjsRequire.cache = DYNAMIC_REQUIRE_CACHE;
`;

function getHelpersModule(isDynamicRequireModulesEnabled) {
  return `${HELPERS}${isDynamicRequireModulesEnabled ? HELPERS_DYNAMIC : HELPER_NON_DYNAMIC}`;
}

/* eslint-disable no-undefined */

const operators = {
  '==': (x) => equals(x.left, x.right, false),

  '!=': (x) => not(operators['=='](x)),

  '===': (x) => equals(x.left, x.right, true),

  '!==': (x) => not(operators['==='](x)),

  '!': (x) => isFalsy(x.argument),

  '&&': (x) => isTruthy(x.left) && isTruthy(x.right),

  '||': (x) => isTruthy(x.left) || isTruthy(x.right)
};

function flatten(node) {
  const parts = [];

  while (node.type === 'MemberExpression') {
    if (node.computed) return null;

    parts.unshift(node.property.name);
    // eslint-disable-next-line no-param-reassign
    node = node.object;
  }

  if (node.type !== 'Identifier') return null;

  const { name } = node;
  parts.unshift(name);

  return { name, keypath: parts.join('.') };
}

function isTruthy(node) {
  if (node.type === 'Literal') return !!node.value;
  if (node.type === 'ParenthesizedExpression') return isTruthy(node.expression);
  if (node.operator in operators) return operators[node.operator](node);
  return undefined;
}

function isFalsy(node) {
  return not(isTruthy(node));
}

function not(value) {
  return value === undefined ? value : !value;
}

function equals(a, b, strict) {
  if (a.type !== b.type) return undefined;
  // eslint-disable-next-line eqeqeq
  if (a.type === 'Literal') return strict ? a.value === b.value : a.value == b.value;
  return undefined;
}

/* eslint-disable import/prefer-default-export */

function getName(id) {
  const name = makeLegalIdentifier(basename(id, extname(id)));
  if (name !== 'index') {
    return name;
  }
  const segments = dirname(id).split(sep);
  return makeLegalIdentifier(segments[segments.length - 1]);
}

/* eslint-disable no-param-reassign, no-shadow, no-underscore-dangle, no-continue */

const reserved = 'process location abstract arguments boolean break byte case catch char class const continue debugger default delete do double else enum eval export extends false final finally float for from function goto if implements import in instanceof int interface let long native new null package private protected public return short static super switch synchronized this throw throws transient true try typeof var void volatile while with yield'.split(
  ' '
);
const blacklist = { __esModule: true };
reserved.forEach((word) => (blacklist[word] = true));

const exportsPattern = /^(?:module\.)?exports(?:\.([a-zA-Z_$][a-zA-Z_$0-9]*))?$/;

const firstpassGlobal = /\b(?:require|module|exports|global)\b/;
const firstpassNoGlobal = /\b(?:require|module|exports)\b/;
const functionType = /^(?:FunctionDeclaration|FunctionExpression|ArrowFunctionExpression)$/;

function deconflict(scope, globals, identifier) {
  let i = 1;
  let deconflicted = makeLegalIdentifier(identifier);

  while (scope.contains(deconflicted) || globals.has(deconflicted) || deconflicted in blacklist) {
    deconflicted = `${identifier}_${i}`;
    i += 1;
  }
  scope.declarations[deconflicted] = true;

  return deconflicted;
}

function tryParse(parse, code, id) {
  try {
    return parse(code, { allowReturnOutsideFunction: true });
  } catch (err) {
    err.message += ` in ${id}`;
    throw err;
  }
}

function normalizePathSlashes(path) {
  return path.replace(/\\/g, '/');
}

function hasCjsKeywords(code, ignoreGlobal) {
  const firstpass = ignoreGlobal ? firstpassNoGlobal : firstpassGlobal;
  return firstpass.test(code);
}

function checkEsModule(parse, code, id) {
  const ast = tryParse(parse, code, id);

  let isEsModule = false;
  let hasDefaultExport = false;
  let hasNamedExports = false;
  for (const node of ast.body) {
    if (node.type === 'ExportDefaultDeclaration') {
      isEsModule = true;
      hasDefaultExport = true;
    } else if (node.type === 'ExportNamedDeclaration') {
      isEsModule = true;
      if (node.declaration) {
        hasNamedExports = true;
      } else {
        for (const specifier of node.specifiers) {
          if (specifier.exported.name === 'default') {
            hasDefaultExport = true;
          } else {
            hasNamedExports = true;
          }
        }
      }
    } else if (node.type === 'ExportAllDeclaration') {
      isEsModule = true;
      if (node.exported && node.exported.name === 'default') {
        hasDefaultExport = true;
      } else {
        hasNamedExports = true;
      }
    } else if (node.type === 'ImportDeclaration') {
      isEsModule = true;
    }
  }

  return { isEsModule, hasDefaultExport, hasNamedExports, ast };
}

function getDefinePropertyCallName(node, targetName) {
  if (node.type !== 'CallExpression') return;

  const {
    callee: { object, property }
  } = node;

  if (!object || object.type !== 'Identifier' || object.name !== 'Object') return;

  if (!property || property.type !== 'Identifier' || property.name !== 'defineProperty') return;

  if (node.arguments.length !== 3) return;

  const [target, val] = node.arguments;
  if (target.type !== 'Identifier' || target.name !== targetName) return;
  // eslint-disable-next-line consistent-return
  return val.value;
}

function transformCommonjs(
  parse,
  code,
  id,
  isEsModule,
  ignoreGlobal,
  ignoreRequire,
  sourceMap,
  isDynamicRequireModulesEnabled,
  dynamicRequireModuleSet,
  commonDir,
  astCache
) {
  const ast = astCache || tryParse(parse, code, id);

  const magicString = new MagicString(code);

  const required = {};
  // Because objects have no guaranteed ordering, yet we need it,
  // we need to keep track of the order in a array
  const sources = [];

  let uid = 0;

  let scope = attachScopes(ast, 'scope');
  const uses = { module: false, exports: false, global: false, require: false };

  let lexicalDepth = 0;
  let programDepth = 0;

  const globals = new Set();

  // TODO technically wrong since globals isn't populated yet, but ¯\_(ツ)_/¯
  const HELPERS_NAME = deconflict(scope, globals, 'commonjsHelpers');

  const namedExports = {};

  // TODO handle transpiled modules
  let shouldWrap = /__esModule/.test(code);
  let usesCommonjsHelpers = false;

  function isRequireStatement(node) {
    if (!node) return false;
    if (node.type !== 'CallExpression') return false;

    // Weird case of `require()` or `module.require()` without arguments
    if (node.arguments.length === 0) return false;

    return isRequireIdentifier(node.callee);
  }

  function isRequireIdentifier(node) {
    if (!node) return false;

    if (node.type === 'Identifier' && node.name === 'require' /* `require` */) {
      // `require` is hidden by a variable in local scope
      if (scope.contains('require')) return false;

      return true;
    } else if (node.type === 'MemberExpression' /* `[something].[something]` */) {
      // `module.[something]`
      if (node.object.type !== 'Identifier' || node.object.name !== 'module') return false;

      // `module` is hidden by a variable in local scope
      if (scope.contains('module')) return false;

      // `module.require(...)`
      if (node.property.type !== 'Identifier' || node.property.name !== 'require') return false;

      return true;
    }

    return false;
  }

  function hasDynamicArguments(node) {
    return (
      node.arguments.length > 1 ||
      (node.arguments[0].type !== 'Literal' &&
        (node.arguments[0].type !== 'TemplateLiteral' || node.arguments[0].expressions.length > 0))
    );
  }

  function isStaticRequireStatement(node) {
    if (!isRequireStatement(node)) return false;
    return !hasDynamicArguments(node);
  }

  function isNodeRequireStatement(parent) {
    const reservedMethod = ['resolve', 'cache', 'main'];
    return !!(parent && parent.property && reservedMethod.indexOf(parent.property.name) > -1);
  }

  function isIgnoredRequireStatement(requiredNode) {
    return ignoreRequire(requiredNode.arguments[0].value);
  }

  function getRequireStringArg(node) {
    return node.arguments[0].type === 'Literal'
      ? node.arguments[0].value
      : node.arguments[0].quasis[0].value.cooked;
  }

  function getRequired(node, name) {
    let sourceId = getRequireStringArg(node);
    const isDynamicRegister = sourceId.startsWith(DYNAMIC_REGISTER_PREFIX);
    if (isDynamicRegister) {
      sourceId = sourceId.substr(DYNAMIC_REGISTER_PREFIX.length);
    }

    const existing = required[sourceId];
    // eslint-disable-next-line no-undefined
    if (existing === undefined) {
      const isDynamic = hasDynamicModuleForPath(sourceId);

      if (!name) {
        do {
          name = `require$$${uid}`;
          uid += 1;
        } while (scope.contains(name));
      }

      if (isDynamicRegister && sourceId.endsWith('.json')) {
        sourceId = DYNAMIC_JSON_PREFIX + sourceId;
      }

      if (isDynamicRegister || !isDynamic || sourceId.endsWith('.json')) {
        sources.push([sourceId, !isDynamicRegister]);
      }

      required[sourceId] = { source: sourceId, name, importsDefault: false, isDynamic };
    }

    return required[sourceId];
  }

  function hasDynamicModuleForPath(source) {
    if (!/[/\\]/.test(source)) {
      try {
        const resolvedPath = normalizePathSlashes(
          sync(source, { basedir: dirname(id) })
        );
        if (dynamicRequireModuleSet.has(resolvedPath)) {
          return true;
        }
      } catch (ex) {
        // Probably a node.js internal module
        return false;
      }

      return false;
    }

    for (const attemptExt of ['', '.js', '.json']) {
      const resolvedPath = normalizePathSlashes(resolve(dirname(id), source + attemptExt));
      if (dynamicRequireModuleSet.has(resolvedPath)) {
        return true;
      }
    }

    return false;
  }

  function shouldUseSimulatedRequire(required) {
    return (
      hasDynamicModuleForPath(required.source) &&
      // We only do `commonjsRequire` for json if it's the `commonjsRegister` call.
      (required.source.startsWith(DYNAMIC_REGISTER_PREFIX) || !required.source.endsWith('.json'))
    );
  }

  // do a first pass, see which names are assigned to. This is necessary to prevent
  // illegally replacing `var foo = require('foo')` with `import foo from 'foo'`,
  // where `foo` is later reassigned. (This happens in the wild. CommonJS, sigh)
  const assignedTo = new Set();
  walk(ast, {
    enter(node) {
      if (node.type !== 'AssignmentExpression') return;
      if (node.left.type === 'MemberExpression') return;

      extractAssignedNames(node.left).forEach((name) => {
        assignedTo.add(name);
      });
    }
  });

  walk(ast, {
    enter(node, parent) {
      if (sourceMap) {
        magicString.addSourcemapLocation(node.start);
        magicString.addSourcemapLocation(node.end);
      }

      // skip dead branches
      if (parent && (parent.type === 'IfStatement' || parent.type === 'ConditionalExpression')) {
        if (node === parent.consequent && isFalsy(parent.test)) {
          this.skip();
          return;
        }
        if (node === parent.alternate && isTruthy(parent.test)) {
          this.skip();
          return;
        }
      }

      if (node._skip) {
        this.skip();
        return;
      }

      programDepth += 1;

      if (node.scope) ({ scope } = node);
      if (functionType.test(node.type)) lexicalDepth += 1;

      // if toplevel return, we need to wrap it
      if (node.type === 'ReturnStatement' && lexicalDepth === 0) {
        shouldWrap = true;
      }

      // rewrite `this` as `commonjsHelpers.commonjsGlobal`
      if (node.type === 'ThisExpression' && lexicalDepth === 0) {
        uses.global = true;
        if (!ignoreGlobal) {
          magicString.overwrite(node.start, node.end, `${HELPERS_NAME}.commonjsGlobal`, {
            storeName: true
          });
          usesCommonjsHelpers = true;
        }
        return;
      }

      // rewrite `typeof module`, `typeof module.exports` and `typeof exports` (https://github.com/rollup/rollup-plugin-commonjs/issues/151)
      if (node.type === 'UnaryExpression' && node.operator === 'typeof') {
        const flattened = flatten(node.argument);
        if (!flattened) return;

        if (scope.contains(flattened.name)) return;

        if (
          flattened.keypath === 'module.exports' ||
          flattened.keypath === 'module' ||
          flattened.keypath === 'exports'
        ) {
          magicString.overwrite(node.start, node.end, `'object'`, { storeName: false });
        }
      }

      // rewrite `require` (if not already handled) `global` and `define`, and handle free references to
      // `module` and `exports` as these mean we need to wrap the module in commonjsHelpers.createCommonjsModule
      if (node.type === 'Identifier') {
        if (isReference(node, parent) && !scope.contains(node.name)) {
          if (node.name in uses) {
            if (isRequireIdentifier(node)) {
              if (isNodeRequireStatement(parent)) {
                return;
              }

              if (!isDynamicRequireModulesEnabled && isStaticRequireStatement(parent)) {
                return;
              }

              if (isDynamicRequireModulesEnabled && isRequireStatement(parent)) {
                magicString.appendLeft(
                  parent.end - 1,
                  `,${JSON.stringify(
                    dirname(id) === '.'
                      ? null /* default behavior */
                      : getVirtualPathForDynamicRequirePath(
                          normalizePathSlashes(dirname(id)),
                          commonDir
                        )
                  )}`
                );
              }

              magicString.overwrite(node.start, node.end, `${HELPERS_NAME}.commonjsRequire`, {
                storeName: true
              });
              usesCommonjsHelpers = true;
            }

            uses[node.name] = true;
            if (node.name === 'global' && !ignoreGlobal) {
              magicString.overwrite(node.start, node.end, `${HELPERS_NAME}.commonjsGlobal`, {
                storeName: true
              });
              usesCommonjsHelpers = true;
            }

            // if module or exports are used outside the context of an assignment
            // expression, we need to wrap the module
            if (node.name === 'module' || node.name === 'exports') {
              shouldWrap = true;
            }
          }

          if (node.name === 'define') {
            magicString.overwrite(node.start, node.end, 'undefined', { storeName: true });
          }

          globals.add(node.name);
        }

        return;
      }

      // Is this an assignment to exports or module.exports?
      if (node.type === 'AssignmentExpression') {
        if (node.left.type !== 'MemberExpression') return;

        const flattened = flatten(node.left);
        if (!flattened) return;

        if (scope.contains(flattened.name)) return;

        const match = exportsPattern.exec(flattened.keypath);
        if (!match || flattened.keypath === 'exports') return;

        uses[flattened.name] = true;

        // we're dealing with `module.exports = ...` or `[module.]exports.foo = ...` –
        // if this isn't top-level, we'll need to wrap the module
        if (programDepth > 3) shouldWrap = true;

        node.left._skip = true;

        if (flattened.keypath === 'module.exports' && node.right.type === 'ObjectExpression') {
          node.right.properties.forEach((prop) => {
            if (prop.computed || !('key' in prop) || prop.key.type !== 'Identifier') return;
            const { name } = prop.key;
            if (name === makeLegalIdentifier(name)) namedExports[name] = true;
          });
          return;
        }

        if (match[1]) namedExports[match[1]] = true;
        return;
      }

      const name = getDefinePropertyCallName(node, 'exports');
      if (name && name === makeLegalIdentifier(name)) namedExports[name] = true;

      // if this is `var x = require('x')`, we can do `import x from 'x'`
      if (
        node.type === 'VariableDeclarator' &&
        node.id.type === 'Identifier' &&
        isStaticRequireStatement(node.init) &&
        !isIgnoredRequireStatement(node.init)
      ) {
        // for now, only do this for top-level requires. maybe fix this in future
        if (scope.parent) return;

        // edge case — CJS allows you to assign to imports. ES doesn't
        if (assignedTo.has(node.id.name)) return;

        const required = getRequired(node.init, node.id.name);
        required.importsDefault = true;

        if (required.name === node.id.name && !required.isDynamic) {
          node._shouldRemove = true;
        }
      }

      if (!isStaticRequireStatement(node) || isIgnoredRequireStatement(node)) {
        return;
      }

      const required = getRequired(node);

      if (parent.type === 'ExpressionStatement') {
        // is a bare import, e.g. `require('foo');`
        magicString.remove(parent.start, parent.end);
      } else {
        required.importsDefault = true;

        if (shouldUseSimulatedRequire(required)) {
          magicString.overwrite(
            node.start,
            node.end,
            `${HELPERS_NAME}.commonjsRequire(${JSON.stringify(
              getVirtualPathForDynamicRequirePath(normalizePathSlashes(required.source), commonDir)
            )}, ${JSON.stringify(
              dirname(id) === '.'
                ? null /* default behavior */
                : getVirtualPathForDynamicRequirePath(normalizePathSlashes(dirname(id)), commonDir)
            )})`
          );
          usesCommonjsHelpers = true;
        } else {
          magicString.overwrite(node.start, node.end, required.name);
        }
      }

      node.callee._skip = true;
    },

    leave(node) {
      programDepth -= 1;
      if (node.scope) scope = scope.parent;
      if (functionType.test(node.type)) lexicalDepth -= 1;

      if (node.type === 'VariableDeclaration') {
        let keepDeclaration = false;
        let c = node.declarations[0].start;

        for (let i = 0; i < node.declarations.length; i += 1) {
          const declarator = node.declarations[i];

          if (declarator._shouldRemove) {
            magicString.remove(c, declarator.end);
          } else {
            if (!keepDeclaration) {
              magicString.remove(c, declarator.start);
              keepDeclaration = true;
            }

            c = declarator.end;
          }
        }

        if (!keepDeclaration) {
          magicString.remove(node.start, node.end);
        }
      }
    }
  });

  if (
    !sources.length &&
    !uses.module &&
    !uses.exports &&
    !uses.require &&
    (ignoreGlobal || !uses.global)
  ) {
    // not a CommonJS module
    return null;
  }

  // If `isEsModule` is on, it means it has ES6 import/export statements,
  //   which just can't be wrapped in a function.
  if (isEsModule) shouldWrap = false;

  usesCommonjsHelpers = usesCommonjsHelpers || shouldWrap;

  const importBlock = `${(usesCommonjsHelpers
    ? [`import * as ${HELPERS_NAME} from '${HELPERS_ID}';`]
    : []
  )
    .concat(
      sources.map(
        ([source]) =>
          // import the actual module before the proxy, so that we know
          // what kind of proxy to build
          `import '${source}';`
      ),
      sources
        .filter(([, importProxy]) => importProxy)
        .map(([source]) => {
          const { name, importsDefault } = required[source];
          return `import ${importsDefault ? `${name} from ` : ``}'${
            source.startsWith('\0') ? source : getProxyId(source)
          }';`;
        })
    )
    .join('\n')}\n\n`;

  const namedExportDeclarations = [];
  let wrapperStart = '';
  let wrapperEnd = '';

  const moduleName = deconflict(scope, globals, getName(id));
  if (!isEsModule) {
    const exportModuleExports = {
      str: `export { ${moduleName} as __moduleExports };`,
      name: '__moduleExports'
    };

    namedExportDeclarations.push(exportModuleExports);
  }

  const defaultExportPropertyAssignments = [];
  let hasDefaultExport = false;

  if (shouldWrap) {
    const args = `module${uses.exports ? ', exports' : ''}`;

    wrapperStart = `var ${moduleName} = ${HELPERS_NAME}.createCommonjsModule(function (${args}) {\n`;

    wrapperEnd = `\n}`;
    if (isDynamicRequireModulesEnabled) {
      wrapperEnd += `, ${JSON.stringify(
        getVirtualPathForDynamicRequirePath(normalizePathSlashes(dirname(id)), commonDir)
      )}`;
    }

    wrapperEnd += `);`;
  } else {
    const names = [];

    for (const node of ast.body) {
      if (node.type === 'ExpressionStatement' && node.expression.type === 'AssignmentExpression') {
        const { left } = node.expression;
        const flattened = flatten(left);

        if (!flattened) {
          continue;
        }

        const match = exportsPattern.exec(flattened.keypath);
        if (!match) {
          continue;
        }

        if (flattened.keypath === 'module.exports') {
          hasDefaultExport = true;
          magicString.overwrite(left.start, left.end, `var ${moduleName}`);
        } else {
          const [, name] = match;
          const deconflicted = deconflict(scope, globals, name);

          names.push({ name, deconflicted });

          magicString.overwrite(node.start, left.end, `var ${deconflicted}`);

          const declaration =
            name === deconflicted
              ? `export { ${name} };`
              : `export { ${deconflicted} as ${name} };`;

          if (name !== 'default') {
            namedExportDeclarations.push({
              str: declaration,
              name
            });
          }

          defaultExportPropertyAssignments.push(`${moduleName}.${name} = ${deconflicted};`);
        }
      }
    }

    if (!(isEsModule || hasDefaultExport)) {
      wrapperEnd = `\n\nvar ${moduleName} = {\n${names
        .map(({ name, deconflicted }) => `\t${name}: ${deconflicted}`)
        .join(',\n')}\n};`;
    }
  }

  magicString
    .trim()
    .prepend(importBlock + wrapperStart)
    .trim()
    .append(wrapperEnd);

  const defaultExport =
    code.indexOf('__esModule') >= 0
      ? `export default /*@__PURE__*/${HELPERS_NAME}.getDefaultExportFromCjs(${moduleName});`
      : `export default ${moduleName};`;

  const named = namedExportDeclarations
    .filter((x) => x.name !== 'default' || !hasDefaultExport)
    .map((x) => x.str);

  magicString.append(
    `\n\n${(isEsModule ? [] : [defaultExport])
      .concat(named)
      .concat(hasDefaultExport ? defaultExportPropertyAssignments : [])
      .join('\n')}`
  );

  code = magicString.toString();
  const map = sourceMap ? magicString.generateMap() : null;

  return { code, map, syntheticNamedExports: isEsModule ? false : '__moduleExports' };
}

function getDynamicPackagesModule(dynamicRequireModuleDirPaths, commonDir) {
  let code = `const commonjsRegister = require('${HELPERS_ID}?commonjsRegister');`;
  for (const dir of dynamicRequireModuleDirPaths) {
    let entryPoint = 'index.js';

    try {
      if (existsSync(join(dir, 'package.json'))) {
        entryPoint =
          JSON.parse(readFileSync(join(dir, 'package.json'), { encoding: 'utf8' })).main ||
          entryPoint;
      }
    } catch (ignored) {
      // ignored
    }

    code += `\ncommonjsRegister(${JSON.stringify(
      getVirtualPathForDynamicRequirePath(dir, commonDir)
    )}, function (module, exports) {
  module.exports = require(${JSON.stringify(normalizePathSlashes(join(dir, entryPoint)))});
});`;
  }
  return code;
}

function getDynamicPackagesEntryIntro(
  id,
  dynamicRequireModuleDirPaths,
  dynamicRequireModuleSet
) {
  try {
    const code = readFileSync(id, { encoding: 'utf8' });
    let dynamicImports = Array.from(
      dynamicRequireModuleSet,
      (dynamicId) => `require(${JSON.stringify(DYNAMIC_REGISTER_PREFIX + dynamicId)});`
    ).join('\n');

    if (dynamicRequireModuleDirPaths.length) {
      dynamicImports += `require(${JSON.stringify(
        DYNAMIC_REGISTER_PREFIX + DYNAMIC_PACKAGES_ID
      )});`;
    }

    return `${dynamicImports}\n${code}`;
  } catch (ex) {
    this.warn(`Failed to read file ${id}, dynamic modules might not work correctly`);
    return null;
  }
}

function getDynamicRequirePaths(patterns) {
  const dynamicRequireModuleSet = new Set();
  for (const pattern of !patterns || Array.isArray(patterns) ? patterns || [] : [patterns]) {
    const isNegated = pattern.startsWith('!');
    const modifySet = Set.prototype[isNegated ? 'delete' : 'add'].bind(dynamicRequireModuleSet);
    for (const path of glob.sync(isNegated ? pattern.substr(1) : pattern)) {
      modifySet(normalizePathSlashes(resolve(path)));
    }
  }
  const dynamicRequireModuleDirPaths = Array.from(dynamicRequireModuleSet.values()).filter(
    (path) => {
      try {
        if (statSync(path).isDirectory()) return true;
      } catch (ignored) {
        // Nothing to do here
      }
      return false;
    }
  );
  return { dynamicRequireModuleSet, dynamicRequireModuleDirPaths };
}

/* eslint-disable no-undefined */
const isCjsPromises = new Map();

function getIsCjsPromise(id) {
  let isCjsPromise = isCjsPromises.get(id);
  if (isCjsPromise) return isCjsPromise.promise;

  const promise = new Promise((resolve) => {
    isCjsPromise = {
      resolve,
      promise: undefined
    };
    isCjsPromises.set(id, isCjsPromise);
  });
  isCjsPromise.promise = promise;

  return promise;
}

function setIsCjsPromise(id, resolution) {
  const isCjsPromise = isCjsPromises.get(id);
  if (isCjsPromise) {
    if (isCjsPromise.resolve) {
      isCjsPromise.resolve(resolution);
      isCjsPromise.resolve = undefined;
    }
  } else {
    isCjsPromises.set(id, { promise: Promise.resolve(resolution), resolve: undefined });
  }
}

// e.g. id === "commonjsHelpers?commonjsRegister"
function getSpecificHelperProxy(id) {
  return `export {${id.split('?')[1]} as default} from '${HELPERS_ID}';`;
}

function getUnknownRequireProxy(id, requireReturnsDefault) {
  if (requireReturnsDefault === true || id.endsWith('.json')) {
    return `export {default} from ${JSON.stringify(id)};`;
  }
  const name = getName(id);
  const exported =
    requireReturnsDefault === 'auto'
      ? `import {getDefaultExportFromNamespaceIfNotNamed} from "${HELPERS_ID}"; export default /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(${name});`
      : requireReturnsDefault === 'preferred'
      ? `import {getDefaultExportFromNamespaceIfPresent} from "${HELPERS_ID}"; export default /*@__PURE__*/getDefaultExportFromNamespaceIfPresent(${name});`
      : !requireReturnsDefault
      ? `import {getAugmentedNamespace} from "${HELPERS_ID}"; export default /*@__PURE__*/getAugmentedNamespace(${name});`
      : `export default ${name};`;
  return `import * as ${name} from ${JSON.stringify(id)}; ${exported}`;
}

function getDynamicJsonProxy(id, commonDir) {
  const normalizedPath = normalizePathSlashes(id.slice(DYNAMIC_JSON_PREFIX.length));
  return `const commonjsRegister = require('${HELPERS_ID}?commonjsRegister');\ncommonjsRegister(${JSON.stringify(
    getVirtualPathForDynamicRequirePath(normalizedPath, commonDir)
  )}, function (module, exports) {
  module.exports = require(${JSON.stringify(normalizedPath)});
});`;
}

function getDynamicRequireProxy(normalizedPath, commonDir) {
  return `const commonjsRegister = require('${HELPERS_ID}?commonjsRegister');\ncommonjsRegister(${JSON.stringify(
    getVirtualPathForDynamicRequirePath(normalizedPath, commonDir)
  )}, function (module, exports) {
  ${readFileSync(normalizedPath, { encoding: 'utf8' })}
});`;
}

async function getStaticRequireProxy(
  id,
  requireReturnsDefault,
  esModulesWithDefaultExport,
  esModulesWithNamedExports
) {
  const name = getName(id);
  const isCjs = await getIsCjsPromise(id);
  if (isCjs) {
    return `import { __moduleExports } from ${JSON.stringify(id)}; export default __moduleExports;`;
  } else if (isCjs === null) {
    return getUnknownRequireProxy(id, requireReturnsDefault);
  } else if (!requireReturnsDefault) {
    return `import {getAugmentedNamespace} from "${HELPERS_ID}"; import * as ${name} from ${JSON.stringify(
      id
    )}; export default /*@__PURE__*/getAugmentedNamespace(${name});`;
  } else if (
    requireReturnsDefault !== true &&
    (requireReturnsDefault === 'namespace' ||
      !esModulesWithDefaultExport.has(id) ||
      (requireReturnsDefault === 'auto' && esModulesWithNamedExports.has(id)))
  ) {
    return `import * as ${name} from ${JSON.stringify(id)}; export default ${name};`;
  }
  return `export {default} from ${JSON.stringify(id)};`;
}

/* eslint-disable no-param-reassign, no-undefined */

function getCandidatesForExtension(resolved, extension) {
  return [resolved + extension, `${resolved}${sep}index${extension}`];
}

function getCandidates(resolved, extensions) {
  return extensions.reduce(
    (paths, extension) => paths.concat(getCandidatesForExtension(resolved, extension)),
    [resolved]
  );
}

function getResolveId(extensions) {
  function resolveExtensions(importee, importer) {
    // not our problem
    if (importee[0] !== '.' || !importer) return undefined;

    const resolved = resolve(dirname(importer), importee);
    const candidates = getCandidates(resolved, extensions);

    for (let i = 0; i < candidates.length; i += 1) {
      try {
        const stats = statSync(candidates[i]);
        if (stats.isFile()) return { id: candidates[i] };
      } catch (err) {
        /* noop */
      }
    }

    return undefined;
  }

  function resolveId(importee, importer) {
    const isProxyModule = importee.endsWith(PROXY_SUFFIX);
    if (isProxyModule) {
      importee = getIdFromProxyId(importee);
    }
    if (importee.startsWith('\0')) {
      if (
        importee.startsWith(HELPERS_ID) ||
        importee === DYNAMIC_PACKAGES_ID ||
        importee.startsWith(DYNAMIC_JSON_PREFIX)
      ) {
        return importee;
      }
      if (!isProxyModule) {
        return null;
      }
    }

    if (importer && importer.endsWith(PROXY_SUFFIX)) {
      importer = getIdFromProxyId(importer);
    }

    return this.resolve(importee, importer, { skipSelf: true }).then((resolved) => {
      if (!resolved) {
        resolved = resolveExtensions(importee, importer);
      }
      if (isProxyModule) {
        if (!resolved) {
          return { id: getExternalProxyId(importee), external: false };
        }
        resolved.id = (resolved.external ? getExternalProxyId : getProxyId)(resolved.id);
        resolved.external = false;
        return resolved;
      }
      return resolved;
    });
  }

  return resolveId;
}

function commonjs(options = {}) {
  const extensions = options.extensions || ['.js'];
  const filter = createFilter(options.include, options.exclude);
  const {
    ignoreGlobal,
    requireReturnsDefault: requireReturnsDefaultOption,
    esmExternals
  } = options;
  const getRequireReturnsDefault =
    typeof requireReturnsDefaultOption === 'function'
      ? requireReturnsDefaultOption
      : () => requireReturnsDefaultOption;
  let esmExternalIds;
  const isEsmExternal =
    typeof esmExternals === 'function'
      ? esmExternals
      : Array.isArray(esmExternals)
      ? ((esmExternalIds = new Set(esmExternals)), (id) => esmExternalIds.has(id))
      : () => esmExternals;

  const { dynamicRequireModuleSet, dynamicRequireModuleDirPaths } = getDynamicRequirePaths(
    options.dynamicRequireTargets
  );
  const isDynamicRequireModulesEnabled = dynamicRequireModuleSet.size > 0;
  const commonDir = isDynamicRequireModulesEnabled
    ? getCommonDir(null, Array.from(dynamicRequireModuleSet).concat(process.cwd()))
    : null;

  const esModulesWithDefaultExport = new Set();
  const esModulesWithNamedExports = new Set();

  const ignoreRequire =
    typeof options.ignore === 'function'
      ? options.ignore
      : Array.isArray(options.ignore)
      ? (id) => options.ignore.includes(id)
      : () => false;

  const resolveId = getResolveId(extensions);

  const sourceMap = options.sourceMap !== false;

  function transformAndCheckExports(code, id) {
    const { isEsModule, hasDefaultExport, hasNamedExports, ast } = checkEsModule(
      this.parse,
      code,
      id
    );
    if (hasDefaultExport) {
      esModulesWithDefaultExport.add(id);
    }
    if (hasNamedExports) {
      esModulesWithNamedExports.add(id);
    }

    if (
      !dynamicRequireModuleSet.has(normalizePathSlashes(id)) &&
      (!hasCjsKeywords(code, ignoreGlobal) || (isEsModule && !options.transformMixedEsModules))
    ) {
      setIsCjsPromise(id, false);
      return null;
    }

    const transformed = transformCommonjs(
      this.parse,
      code,
      id,
      isEsModule,
      ignoreGlobal || isEsModule,
      ignoreRequire,
      sourceMap,
      isDynamicRequireModulesEnabled,
      dynamicRequireModuleSet,
      commonDir,
      ast
    );

    setIsCjsPromise(id, isEsModule ? false : Boolean(transformed));
    return transformed;
  }

  return {
    name: 'commonjs',

    buildStart() {
      if (options.namedExports != null) {
        this.warn(
          'The namedExports option from "@rollup/plugin-commonjs" is deprecated. Named exports are now handled automatically.'
        );
      }

      const [major, minor] = this.meta.rollupVersion.split('.').map(Number);
      const minVersion = peerDependencies.rollup.slice(2);
      const [minMajor, minMinor] = minVersion.split('.').map(Number);
      if (major < minMajor || (major === minMajor && minor < minMinor)) {
        this.error(
          `Insufficient Rollup version: "@rollup/plugin-commonjs" requires at least rollup@${minVersion} but found rollup@${this.meta.rollupVersion}.`
        );
      }
    },

    resolveId,

    load(id) {
      if (id === HELPERS_ID) {
        return getHelpersModule(isDynamicRequireModulesEnabled);
      }

      if (id.startsWith(HELPERS_ID)) {
        return getSpecificHelperProxy(id);
      }

      if (id.endsWith(EXTERNAL_SUFFIX)) {
        const actualId = getIdFromExternalProxyId(id);
        return getUnknownRequireProxy(
          actualId,
          isEsmExternal(actualId) ? getRequireReturnsDefault(actualId) : true
        );
      }

      if (id === DYNAMIC_PACKAGES_ID) {
        return getDynamicPackagesModule(dynamicRequireModuleDirPaths, commonDir);
      }

      if (id.startsWith(DYNAMIC_JSON_PREFIX)) {
        return getDynamicJsonProxy(id, commonDir);
      }

      const normalizedPath = normalizePathSlashes(id);
      if (dynamicRequireModuleSet.has(normalizedPath) && !normalizedPath.endsWith('.json')) {
        return getDynamicRequireProxy(normalizedPath, commonDir);
      }

      if (id.endsWith(PROXY_SUFFIX)) {
        const actualId = getIdFromProxyId(id);
        return getStaticRequireProxy(
          actualId,
          getRequireReturnsDefault(actualId),
          esModulesWithDefaultExport,
          esModulesWithNamedExports
        );
      }

      if (isDynamicRequireModulesEnabled && this.getModuleInfo(id).isEntry) {
        return getDynamicPackagesEntryIntro(
          id,
          dynamicRequireModuleDirPaths,
          dynamicRequireModuleSet
        );
      }

      return null;
    },

    transform(code, id) {
      const extName = extname(id);
      if (
        extName !== '.cjs' &&
        id !== DYNAMIC_PACKAGES_ID &&
        !id.startsWith(DYNAMIC_JSON_PREFIX) &&
        (!filter(id) || !extensions.includes(extName))
      ) {
        setIsCjsPromise(id, null);
        return null;
      }

      let transformed;
      try {
        transformed = transformAndCheckExports.call(this, code, id);
      } catch (err) {
        transformed = null;
        setIsCjsPromise(id, false);
        this.error(err, err.loc);
      }

      return transformed;
    }
  };
}

export default commonjs;
//# sourceMappingURL=index.es.js.map

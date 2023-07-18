(function webpackUniversalModuleDefinition(root, factory) {
  if (typeof exports === "object" && typeof module === "object")
    module.exports = factory();
  else if (typeof define === "function" && define.amd) define([], factory);
  else if (typeof exports === "object") exports["cheetahCapture"] = factory();
  else root["cheetahCapture"] = factory();
})(self, function () {
  return /******/ (function () {
    // webpackBootstrap
    /******/ var __webpack_modules__ = {
      /***/ 3099: /***/ function (module) {
        module.exports = function (it) {
          if (typeof it != "function") {
            throw TypeError(String(it) + " is not a function");
          }
          return it;
        };

        /***/
      },

      /***/ 6077: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var isObject = __webpack_require__(111);

        module.exports = function (it) {
          if (!isObject(it) && it !== null) {
            throw TypeError("Can't set " + String(it) + " as a prototype");
          }
          return it;
        };

        /***/
      },

      /***/ 1223: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var wellKnownSymbol = __webpack_require__(5112);
        var create = __webpack_require__(30);
        var definePropertyModule = __webpack_require__(3070);

        var UNSCOPABLES = wellKnownSymbol("unscopables");
        var ArrayPrototype = Array.prototype;

        // Array.prototype[@@unscopables]
        // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
        if (ArrayPrototype[UNSCOPABLES] == undefined) {
          definePropertyModule.f(ArrayPrototype, UNSCOPABLES, {
            configurable: true,
            value: create(null)
          });
        }

        // add a key to Array.prototype[@@unscopables]
        module.exports = function (key) {
          ArrayPrototype[UNSCOPABLES][key] = true;
        };

        /***/
      },

      /***/ 5787: /***/ function (module) {
        module.exports = function (it, Constructor, name) {
          if (!(it instanceof Constructor)) {
            throw TypeError(
              "Incorrect " + (name ? name + " " : "") + "invocation"
            );
          }
          return it;
        };

        /***/
      },

      /***/ 9670: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var isObject = __webpack_require__(111);

        module.exports = function (it) {
          if (!isObject(it)) {
            throw TypeError(String(it) + " is not an object");
          }
          return it;
        };

        /***/
      },

      /***/ 8533: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        "use strict";

        var $forEach = __webpack_require__(2092).forEach;
        var arrayMethodIsStrict = __webpack_require__(9341);
        var arrayMethodUsesToLength = __webpack_require__(9207);

        var STRICT_METHOD = arrayMethodIsStrict("forEach");
        var USES_TO_LENGTH = arrayMethodUsesToLength("forEach");

        // `Array.prototype.forEach` method implementation
        // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
        module.exports =
          !STRICT_METHOD || !USES_TO_LENGTH
            ? function forEach(callbackfn /* , thisArg */) {
                return $forEach(
                  this,
                  callbackfn,
                  arguments.length > 1 ? arguments[1] : undefined
                );
              }
            : [].forEach;

        /***/
      },

      /***/ 1318: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var toIndexedObject = __webpack_require__(5656);
        var toLength = __webpack_require__(7466);
        var toAbsoluteIndex = __webpack_require__(1400);

        // `Array.prototype.{ indexOf, includes }` methods implementation
        var createMethod = function (IS_INCLUDES) {
          return function ($this, el, fromIndex) {
            var O = toIndexedObject($this);
            var length = toLength(O.length);
            var index = toAbsoluteIndex(fromIndex, length);
            var value;
            // Array#includes uses SameValueZero equality algorithm
            // eslint-disable-next-line no-self-compare
            if (IS_INCLUDES && el != el)
              while (length > index) {
                value = O[index++];
                // eslint-disable-next-line no-self-compare
                if (value != value) return true;
                // Array#indexOf ignores holes, Array#includes - not
              }
            else
              for (; length > index; index++) {
                if ((IS_INCLUDES || index in O) && O[index] === el)
                  return IS_INCLUDES || index || 0;
              }
            return !IS_INCLUDES && -1;
          };
        };

        module.exports = {
          // `Array.prototype.includes` method
          // https://tc39.github.io/ecma262/#sec-array.prototype.includes
          includes: createMethod(true),
          // `Array.prototype.indexOf` method
          // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
          indexOf: createMethod(false)
        };

        /***/
      },

      /***/ 2092: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var bind = __webpack_require__(9974);
        var IndexedObject = __webpack_require__(8361);
        var toObject = __webpack_require__(7908);
        var toLength = __webpack_require__(7466);
        var arraySpeciesCreate = __webpack_require__(5417);

        var push = [].push;

        // `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation
        var createMethod = function (TYPE) {
          var IS_MAP = TYPE == 1;
          var IS_FILTER = TYPE == 2;
          var IS_SOME = TYPE == 3;
          var IS_EVERY = TYPE == 4;
          var IS_FIND_INDEX = TYPE == 6;
          var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
          return function ($this, callbackfn, that, specificCreate) {
            var O = toObject($this);
            var self = IndexedObject(O);
            var boundFunction = bind(callbackfn, that, 3);
            var length = toLength(self.length);
            var index = 0;
            var create = specificCreate || arraySpeciesCreate;
            var target = IS_MAP
              ? create($this, length)
              : IS_FILTER
              ? create($this, 0)
              : undefined;
            var value, result;
            for (; length > index; index++)
              if (NO_HOLES || index in self) {
                value = self[index];
                result = boundFunction(value, index, O);
                if (TYPE) {
                  if (IS_MAP) target[index] = result; // map
                  else if (result)
                    switch (TYPE) {
                      case 3:
                        return true; // some
                      case 5:
                        return value; // find
                      case 6:
                        return index; // findIndex
                      case 2:
                        push.call(target, value); // filter
                    }
                  else if (IS_EVERY) return false; // every
                }
              }
            return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
          };
        };

        module.exports = {
          // `Array.prototype.forEach` method
          // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
          forEach: createMethod(0),
          // `Array.prototype.map` method
          // https://tc39.github.io/ecma262/#sec-array.prototype.map
          map: createMethod(1),
          // `Array.prototype.filter` method
          // https://tc39.github.io/ecma262/#sec-array.prototype.filter
          filter: createMethod(2),
          // `Array.prototype.some` method
          // https://tc39.github.io/ecma262/#sec-array.prototype.some
          some: createMethod(3),
          // `Array.prototype.every` method
          // https://tc39.github.io/ecma262/#sec-array.prototype.every
          every: createMethod(4),
          // `Array.prototype.find` method
          // https://tc39.github.io/ecma262/#sec-array.prototype.find
          find: createMethod(5),
          // `Array.prototype.findIndex` method
          // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
          findIndex: createMethod(6)
        };

        /***/
      },

      /***/ 1194: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var fails = __webpack_require__(7293);
        var wellKnownSymbol = __webpack_require__(5112);
        var V8_VERSION = __webpack_require__(7392);

        var SPECIES = wellKnownSymbol("species");

        module.exports = function (METHOD_NAME) {
          // We can't use this feature detection in V8 since it causes
          // deoptimization and serious performance degradation
          // https://github.com/zloirock/core-js/issues/677
          return (
            V8_VERSION >= 51 ||
            !fails(function () {
              var array = [];
              var constructor = (array.constructor = {});
              constructor[SPECIES] = function () {
                return { foo: 1 };
              };
              return array[METHOD_NAME](Boolean).foo !== 1;
            })
          );
        };

        /***/
      },

      /***/ 9341: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        "use strict";

        var fails = __webpack_require__(7293);

        module.exports = function (METHOD_NAME, argument) {
          var method = [][METHOD_NAME];
          return (
            !!method &&
            fails(function () {
              // eslint-disable-next-line no-useless-call,no-throw-literal
              method.call(
                null,
                argument ||
                  function () {
                    throw 1;
                  },
                1
              );
            })
          );
        };

        /***/
      },

      /***/ 9207: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var DESCRIPTORS = __webpack_require__(9781);
        var fails = __webpack_require__(7293);
        var has = __webpack_require__(6656);

        var defineProperty = Object.defineProperty;
        var cache = {};

        var thrower = function (it) {
          throw it;
        };

        module.exports = function (METHOD_NAME, options) {
          if (has(cache, METHOD_NAME)) return cache[METHOD_NAME];
          if (!options) options = {};
          var method = [][METHOD_NAME];
          var ACCESSORS = has(options, "ACCESSORS") ? options.ACCESSORS : false;
          var argument0 = has(options, 0) ? options[0] : thrower;
          var argument1 = has(options, 1) ? options[1] : undefined;

          return (cache[METHOD_NAME] =
            !!method &&
            !fails(function () {
              if (ACCESSORS && !DESCRIPTORS) return true;
              var O = { length: -1 };

              if (ACCESSORS)
                defineProperty(O, 1, { enumerable: true, get: thrower });
              else O[1] = 1;

              method.call(O, argument0, argument1);
            }));
        };

        /***/
      },

      /***/ 5417: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var isObject = __webpack_require__(111);
        var isArray = __webpack_require__(3157);
        var wellKnownSymbol = __webpack_require__(5112);

        var SPECIES = wellKnownSymbol("species");

        // `ArraySpeciesCreate` abstract operation
        // https://tc39.github.io/ecma262/#sec-arrayspeciescreate
        module.exports = function (originalArray, length) {
          var C;
          if (isArray(originalArray)) {
            C = originalArray.constructor;
            // cross-realm fallback
            if (typeof C == "function" && (C === Array || isArray(C.prototype)))
              C = undefined;
            else if (isObject(C)) {
              C = C[SPECIES];
              if (C === null) C = undefined;
            }
          }
          return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
        };

        /***/
      },

      /***/ 3411: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var anObject = __webpack_require__(9670);

        // call something on iterator step with safe closing on error
        module.exports = function (iterator, fn, value, ENTRIES) {
          try {
            return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
            // 7.4.6 IteratorClose(iterator, completion)
          } catch (error) {
            var returnMethod = iterator["return"];
            if (returnMethod !== undefined)
              anObject(returnMethod.call(iterator));
            throw error;
          }
        };

        /***/
      },

      /***/ 7072: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var wellKnownSymbol = __webpack_require__(5112);

        var ITERATOR = wellKnownSymbol("iterator");
        var SAFE_CLOSING = false;

        try {
          var called = 0;
          var iteratorWithReturn = {
            next: function () {
              return { done: !!called++ };
            },
            return: function () {
              SAFE_CLOSING = true;
            }
          };
          iteratorWithReturn[ITERATOR] = function () {
            return this;
          };
          // eslint-disable-next-line no-throw-literal
          Array.from(iteratorWithReturn, function () {
            throw 2;
          });
        } catch (error) {
          /* empty */
        }

        module.exports = function (exec, SKIP_CLOSING) {
          if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
          var ITERATION_SUPPORT = false;
          try {
            var object = {};
            object[ITERATOR] = function () {
              return {
                next: function () {
                  return { done: (ITERATION_SUPPORT = true) };
                }
              };
            };
            exec(object);
          } catch (error) {
            /* empty */
          }
          return ITERATION_SUPPORT;
        };

        /***/
      },

      /***/ 4326: /***/ function (module) {
        var toString = {}.toString;

        module.exports = function (it) {
          return toString.call(it).slice(8, -1);
        };

        /***/
      },

      /***/ 648: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var TO_STRING_TAG_SUPPORT = __webpack_require__(1694);
        var classofRaw = __webpack_require__(4326);
        var wellKnownSymbol = __webpack_require__(5112);

        var TO_STRING_TAG = wellKnownSymbol("toStringTag");
        // ES3 wrong here
        var CORRECT_ARGUMENTS =
          classofRaw(
            (function () {
              return arguments;
            })()
          ) == "Arguments";

        // fallback for IE11 Script Access Denied error
        var tryGet = function (it, key) {
          try {
            return it[key];
          } catch (error) {
            /* empty */
          }
        };

        // getting tag from ES6+ `Object.prototype.toString`
        module.exports = TO_STRING_TAG_SUPPORT
          ? classofRaw
          : function (it) {
              var O, tag, result;
              return it === undefined
                ? "Undefined"
                : it === null
                ? "Null"
                : // @@toStringTag case
                typeof (tag = tryGet((O = Object(it)), TO_STRING_TAG)) ==
                  "string"
                ? tag
                : // builtinTag case
                CORRECT_ARGUMENTS
                ? classofRaw(O)
                : // ES3 arguments fallback
                (result = classofRaw(O)) == "Object" &&
                  typeof O.callee == "function"
                ? "Arguments"
                : result;
            };

        /***/
      },

      /***/ 5631: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        "use strict";

        var defineProperty = __webpack_require__(3070).f;
        var create = __webpack_require__(30);
        var redefineAll = __webpack_require__(2248);
        var bind = __webpack_require__(9974);
        var anInstance = __webpack_require__(5787);
        var iterate = __webpack_require__(612);
        var defineIterator = __webpack_require__(654);
        var setSpecies = __webpack_require__(6340);
        var DESCRIPTORS = __webpack_require__(9781);
        var fastKey = __webpack_require__(2423).fastKey;
        var InternalStateModule = __webpack_require__(9909);

        var setInternalState = InternalStateModule.set;
        var internalStateGetterFor = InternalStateModule.getterFor;

        module.exports = {
          getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
            var C = wrapper(function (that, iterable) {
              anInstance(that, C, CONSTRUCTOR_NAME);
              setInternalState(that, {
                type: CONSTRUCTOR_NAME,
                index: create(null),
                first: undefined,
                last: undefined,
                size: 0
              });
              if (!DESCRIPTORS) that.size = 0;
              if (iterable != undefined)
                iterate(iterable, that[ADDER], that, IS_MAP);
            });

            var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

            var define = function (that, key, value) {
              var state = getInternalState(that);
              var entry = getEntry(that, key);
              var previous, index;
              // change existing entry
              if (entry) {
                entry.value = value;
                // create new entry
              } else {
                state.last = entry = {
                  index: (index = fastKey(key, true)),
                  key: key,
                  value: value,
                  previous: (previous = state.last),
                  next: undefined,
                  removed: false
                };
                if (!state.first) state.first = entry;
                if (previous) previous.next = entry;
                if (DESCRIPTORS) state.size++;
                else that.size++;
                // add to index
                if (index !== "F") state.index[index] = entry;
              }
              return that;
            };

            var getEntry = function (that, key) {
              var state = getInternalState(that);
              // fast case
              var index = fastKey(key);
              var entry;
              if (index !== "F") return state.index[index];
              // frozen object case
              for (entry = state.first; entry; entry = entry.next) {
                if (entry.key == key) return entry;
              }
            };

            redefineAll(C.prototype, {
              // 23.1.3.1 Map.prototype.clear()
              // 23.2.3.2 Set.prototype.clear()
              clear: function clear() {
                var that = this;
                var state = getInternalState(that);
                var data = state.index;
                var entry = state.first;
                while (entry) {
                  entry.removed = true;
                  if (entry.previous)
                    entry.previous = entry.previous.next = undefined;
                  delete data[entry.index];
                  entry = entry.next;
                }
                state.first = state.last = undefined;
                if (DESCRIPTORS) state.size = 0;
                else that.size = 0;
              },
              // 23.1.3.3 Map.prototype.delete(key)
              // 23.2.3.4 Set.prototype.delete(value)
              delete: function (key) {
                var that = this;
                var state = getInternalState(that);
                var entry = getEntry(that, key);
                if (entry) {
                  var next = entry.next;
                  var prev = entry.previous;
                  delete state.index[entry.index];
                  entry.removed = true;
                  if (prev) prev.next = next;
                  if (next) next.previous = prev;
                  if (state.first == entry) state.first = next;
                  if (state.last == entry) state.last = prev;
                  if (DESCRIPTORS) state.size--;
                  else that.size--;
                }
                return !!entry;
              },
              // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
              // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
              forEach: function forEach(callbackfn /* , that = undefined */) {
                var state = getInternalState(this);
                var boundFunction = bind(
                  callbackfn,
                  arguments.length > 1 ? arguments[1] : undefined,
                  3
                );
                var entry;
                while ((entry = entry ? entry.next : state.first)) {
                  boundFunction(entry.value, entry.key, this);
                  // revert to the last existing entry
                  while (entry && entry.removed) entry = entry.previous;
                }
              },
              // 23.1.3.7 Map.prototype.has(key)
              // 23.2.3.7 Set.prototype.has(value)
              has: function has(key) {
                return !!getEntry(this, key);
              }
            });

            redefineAll(
              C.prototype,
              IS_MAP
                ? {
                    // 23.1.3.6 Map.prototype.get(key)
                    get: function get(key) {
                      var entry = getEntry(this, key);
                      return entry && entry.value;
                    },
                    // 23.1.3.9 Map.prototype.set(key, value)
                    set: function set(key, value) {
                      return define(this, key === 0 ? 0 : key, value);
                    }
                  }
                : {
                    // 23.2.3.1 Set.prototype.add(value)
                    add: function add(value) {
                      return define(
                        this,
                        (value = value === 0 ? 0 : value),
                        value
                      );
                    }
                  }
            );
            if (DESCRIPTORS)
              defineProperty(C.prototype, "size", {
                get: function () {
                  return getInternalState(this).size;
                }
              });
            return C;
          },
          setStrong: function (C, CONSTRUCTOR_NAME, IS_MAP) {
            var ITERATOR_NAME = CONSTRUCTOR_NAME + " Iterator";
            var getInternalCollectionState =
              internalStateGetterFor(CONSTRUCTOR_NAME);
            var getInternalIteratorState =
              internalStateGetterFor(ITERATOR_NAME);
            // add .keys, .values, .entries, [@@iterator]
            // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
            defineIterator(
              C,
              CONSTRUCTOR_NAME,
              function (iterated, kind) {
                setInternalState(this, {
                  type: ITERATOR_NAME,
                  target: iterated,
                  state: getInternalCollectionState(iterated),
                  kind: kind,
                  last: undefined
                });
              },
              function () {
                var state = getInternalIteratorState(this);
                var kind = state.kind;
                var entry = state.last;
                // revert to the last existing entry
                while (entry && entry.removed) entry = entry.previous;
                // get next entry
                if (
                  !state.target ||
                  !(state.last = entry = entry ? entry.next : state.state.first)
                ) {
                  // or finish the iteration
                  state.target = undefined;
                  return { value: undefined, done: true };
                }
                // return step by kind
                if (kind == "keys") return { value: entry.key, done: false };
                if (kind == "values")
                  return { value: entry.value, done: false };
                return { value: [entry.key, entry.value], done: false };
              },
              IS_MAP ? "entries" : "values",
              !IS_MAP,
              true
            );

            // add [@@species], 23.1.2.2, 23.2.2.2
            setSpecies(CONSTRUCTOR_NAME);
          }
        };

        /***/
      },

      /***/ 7710: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        "use strict";

        var $ = __webpack_require__(2109);
        var global = __webpack_require__(7854);
        var isForced = __webpack_require__(4705);
        var redefine = __webpack_require__(1320);
        var InternalMetadataModule = __webpack_require__(2423);
        var iterate = __webpack_require__(612);
        var anInstance = __webpack_require__(5787);
        var isObject = __webpack_require__(111);
        var fails = __webpack_require__(7293);
        var checkCorrectnessOfIteration = __webpack_require__(7072);
        var setToStringTag = __webpack_require__(8003);
        var inheritIfRequired = __webpack_require__(9587);

        module.exports = function (CONSTRUCTOR_NAME, wrapper, common) {
          var IS_MAP = CONSTRUCTOR_NAME.indexOf("Map") !== -1;
          var IS_WEAK = CONSTRUCTOR_NAME.indexOf("Weak") !== -1;
          var ADDER = IS_MAP ? "set" : "add";
          var NativeConstructor = global[CONSTRUCTOR_NAME];
          var NativePrototype =
            NativeConstructor && NativeConstructor.prototype;
          var Constructor = NativeConstructor;
          var exported = {};

          var fixMethod = function (KEY) {
            var nativeMethod = NativePrototype[KEY];
            redefine(
              NativePrototype,
              KEY,
              KEY == "add"
                ? function add(value) {
                    nativeMethod.call(this, value === 0 ? 0 : value);
                    return this;
                  }
                : KEY == "delete"
                ? function (key) {
                    return IS_WEAK && !isObject(key)
                      ? false
                      : nativeMethod.call(this, key === 0 ? 0 : key);
                  }
                : KEY == "get"
                ? function get(key) {
                    return IS_WEAK && !isObject(key)
                      ? undefined
                      : nativeMethod.call(this, key === 0 ? 0 : key);
                  }
                : KEY == "has"
                ? function has(key) {
                    return IS_WEAK && !isObject(key)
                      ? false
                      : nativeMethod.call(this, key === 0 ? 0 : key);
                  }
                : function set(key, value) {
                    nativeMethod.call(this, key === 0 ? 0 : key, value);
                    return this;
                  }
            );
          };

          // eslint-disable-next-line max-len
          if (
            isForced(
              CONSTRUCTOR_NAME,
              typeof NativeConstructor != "function" ||
                !(
                  IS_WEAK ||
                  (NativePrototype.forEach &&
                    !fails(function () {
                      new NativeConstructor().entries().next();
                    }))
                )
            )
          ) {
            // create collection constructor
            Constructor = common.getConstructor(
              wrapper,
              CONSTRUCTOR_NAME,
              IS_MAP,
              ADDER
            );
            InternalMetadataModule.REQUIRED = true;
          } else if (isForced(CONSTRUCTOR_NAME, true)) {
            var instance = new Constructor();
            // early implementations not supports chaining
            var HASNT_CHAINING =
              instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
            // V8 ~ Chromium 40- weak-collections throws on primitives, but should return false
            var THROWS_ON_PRIMITIVES = fails(function () {
              instance.has(1);
            });
            // most early implementations doesn't supports iterables, most modern - not close it correctly
            // eslint-disable-next-line no-new
            var ACCEPT_ITERABLES = checkCorrectnessOfIteration(function (
              iterable
            ) {
              new NativeConstructor(iterable);
            });
            // for early implementations -0 and +0 not the same
            var BUGGY_ZERO =
              !IS_WEAK &&
              fails(function () {
                // V8 ~ Chromium 42- fails only with 5+ elements
                var $instance = new NativeConstructor();
                var index = 5;
                while (index--) $instance[ADDER](index, index);
                return !$instance.has(-0);
              });

            if (!ACCEPT_ITERABLES) {
              Constructor = wrapper(function (dummy, iterable) {
                anInstance(dummy, Constructor, CONSTRUCTOR_NAME);
                var that = inheritIfRequired(
                  new NativeConstructor(),
                  dummy,
                  Constructor
                );
                if (iterable != undefined)
                  iterate(iterable, that[ADDER], that, IS_MAP);
                return that;
              });
              Constructor.prototype = NativePrototype;
              NativePrototype.constructor = Constructor;
            }

            if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
              fixMethod("delete");
              fixMethod("has");
              IS_MAP && fixMethod("get");
            }

            if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);

            // weak collections should not contains .clear method
            if (IS_WEAK && NativePrototype.clear) delete NativePrototype.clear;
          }

          exported[CONSTRUCTOR_NAME] = Constructor;
          $(
            { global: true, forced: Constructor != NativeConstructor },
            exported
          );

          setToStringTag(Constructor, CONSTRUCTOR_NAME);

          if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

          return Constructor;
        };

        /***/
      },

      /***/ 9920: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var has = __webpack_require__(6656);
        var ownKeys = __webpack_require__(3887);
        var getOwnPropertyDescriptorModule = __webpack_require__(1236);
        var definePropertyModule = __webpack_require__(3070);

        module.exports = function (target, source) {
          var keys = ownKeys(source);
          var defineProperty = definePropertyModule.f;
          var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
          for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (!has(target, key))
              defineProperty(
                target,
                key,
                getOwnPropertyDescriptor(source, key)
              );
          }
        };

        /***/
      },

      /***/ 8544: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var fails = __webpack_require__(7293);

        module.exports = !fails(function () {
          function F() {
            /* empty */
          }
          F.prototype.constructor = null;
          return Object.getPrototypeOf(new F()) !== F.prototype;
        });

        /***/
      },

      /***/ 4994: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        "use strict";

        var IteratorPrototype = __webpack_require__(3383).IteratorPrototype;
        var create = __webpack_require__(30);
        var createPropertyDescriptor = __webpack_require__(9114);
        var setToStringTag = __webpack_require__(8003);
        var Iterators = __webpack_require__(7497);

        var returnThis = function () {
          return this;
        };

        module.exports = function (IteratorConstructor, NAME, next) {
          var TO_STRING_TAG = NAME + " Iterator";
          IteratorConstructor.prototype = create(IteratorPrototype, {
            next: createPropertyDescriptor(1, next)
          });
          setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
          Iterators[TO_STRING_TAG] = returnThis;
          return IteratorConstructor;
        };

        /***/
      },

      /***/ 8880: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var DESCRIPTORS = __webpack_require__(9781);
        var definePropertyModule = __webpack_require__(3070);
        var createPropertyDescriptor = __webpack_require__(9114);

        module.exports = DESCRIPTORS
          ? function (object, key, value) {
              return definePropertyModule.f(
                object,
                key,
                createPropertyDescriptor(1, value)
              );
            }
          : function (object, key, value) {
              object[key] = value;
              return object;
            };

        /***/
      },

      /***/ 9114: /***/ function (module) {
        module.exports = function (bitmap, value) {
          return {
            enumerable: !(bitmap & 1),
            configurable: !(bitmap & 2),
            writable: !(bitmap & 4),
            value: value
          };
        };

        /***/
      },

      /***/ 6135: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        "use strict";

        var toPrimitive = __webpack_require__(7593);
        var definePropertyModule = __webpack_require__(3070);
        var createPropertyDescriptor = __webpack_require__(9114);

        module.exports = function (object, key, value) {
          var propertyKey = toPrimitive(key);
          if (propertyKey in object)
            definePropertyModule.f(
              object,
              propertyKey,
              createPropertyDescriptor(0, value)
            );
          else object[propertyKey] = value;
        };

        /***/
      },

      /***/ 654: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        "use strict";

        var $ = __webpack_require__(2109);
        var createIteratorConstructor = __webpack_require__(4994);
        var getPrototypeOf = __webpack_require__(9518);
        var setPrototypeOf = __webpack_require__(7674);
        var setToStringTag = __webpack_require__(8003);
        var createNonEnumerableProperty = __webpack_require__(8880);
        var redefine = __webpack_require__(1320);
        var wellKnownSymbol = __webpack_require__(5112);
        var IS_PURE = __webpack_require__(1913);
        var Iterators = __webpack_require__(7497);
        var IteratorsCore = __webpack_require__(3383);

        var IteratorPrototype = IteratorsCore.IteratorPrototype;
        var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
        var ITERATOR = wellKnownSymbol("iterator");
        var KEYS = "keys";
        var VALUES = "values";
        var ENTRIES = "entries";

        var returnThis = function () {
          return this;
        };

        module.exports = function (
          Iterable,
          NAME,
          IteratorConstructor,
          next,
          DEFAULT,
          IS_SET,
          FORCED
        ) {
          createIteratorConstructor(IteratorConstructor, NAME, next);

          var getIterationMethod = function (KIND) {
            if (KIND === DEFAULT && defaultIterator) return defaultIterator;
            if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype)
              return IterablePrototype[KIND];
            switch (KIND) {
              case KEYS:
                return function keys() {
                  return new IteratorConstructor(this, KIND);
                };
              case VALUES:
                return function values() {
                  return new IteratorConstructor(this, KIND);
                };
              case ENTRIES:
                return function entries() {
                  return new IteratorConstructor(this, KIND);
                };
            }
            return function () {
              return new IteratorConstructor(this);
            };
          };

          var TO_STRING_TAG = NAME + " Iterator";
          var INCORRECT_VALUES_NAME = false;
          var IterablePrototype = Iterable.prototype;
          var nativeIterator =
            IterablePrototype[ITERATOR] ||
            IterablePrototype["@@iterator"] ||
            (DEFAULT && IterablePrototype[DEFAULT]);
          var defaultIterator =
            (!BUGGY_SAFARI_ITERATORS && nativeIterator) ||
            getIterationMethod(DEFAULT);
          var anyNativeIterator =
            NAME == "Array"
              ? IterablePrototype.entries || nativeIterator
              : nativeIterator;
          var CurrentIteratorPrototype, methods, KEY;

          // fix native
          if (anyNativeIterator) {
            CurrentIteratorPrototype = getPrototypeOf(
              anyNativeIterator.call(new Iterable())
            );
            if (
              IteratorPrototype !== Object.prototype &&
              CurrentIteratorPrototype.next
            ) {
              if (
                !IS_PURE &&
                getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype
              ) {
                if (setPrototypeOf) {
                  setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
                } else if (
                  typeof CurrentIteratorPrototype[ITERATOR] != "function"
                ) {
                  createNonEnumerableProperty(
                    CurrentIteratorPrototype,
                    ITERATOR,
                    returnThis
                  );
                }
              }
              // Set @@toStringTag to native iterators
              setToStringTag(
                CurrentIteratorPrototype,
                TO_STRING_TAG,
                true,
                true
              );
              if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;
            }
          }

          // fix Array#{values, @@iterator}.name in V8 / FF
          if (
            DEFAULT == VALUES &&
            nativeIterator &&
            nativeIterator.name !== VALUES
          ) {
            INCORRECT_VALUES_NAME = true;
            defaultIterator = function values() {
              return nativeIterator.call(this);
            };
          }

          // define iterator
          if (
            (!IS_PURE || FORCED) &&
            IterablePrototype[ITERATOR] !== defaultIterator
          ) {
            createNonEnumerableProperty(
              IterablePrototype,
              ITERATOR,
              defaultIterator
            );
          }
          Iterators[NAME] = defaultIterator;

          // export additional methods
          if (DEFAULT) {
            methods = {
              values: getIterationMethod(VALUES),
              keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
              entries: getIterationMethod(ENTRIES)
            };
            if (FORCED)
              for (KEY in methods) {
                if (
                  BUGGY_SAFARI_ITERATORS ||
                  INCORRECT_VALUES_NAME ||
                  !(KEY in IterablePrototype)
                ) {
                  redefine(IterablePrototype, KEY, methods[KEY]);
                }
              }
            else
              $(
                {
                  target: NAME,
                  proto: true,
                  forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME
                },
                methods
              );
          }

          return methods;
        };

        /***/
      },

      /***/ 7235: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var path = __webpack_require__(857);
        var has = __webpack_require__(6656);
        var wrappedWellKnownSymbolModule = __webpack_require__(6061);
        var defineProperty = __webpack_require__(3070).f;

        module.exports = function (NAME) {
          var Symbol = path.Symbol || (path.Symbol = {});
          if (!has(Symbol, NAME))
            defineProperty(Symbol, NAME, {
              value: wrappedWellKnownSymbolModule.f(NAME)
            });
        };

        /***/
      },

      /***/ 9781: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var fails = __webpack_require__(7293);

        // Thank's IE8 for his funny defineProperty
        module.exports = !fails(function () {
          return (
            Object.defineProperty({}, 1, {
              get: function () {
                return 7;
              }
            })[1] != 7
          );
        });

        /***/
      },

      /***/ 317: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var global = __webpack_require__(7854);
        var isObject = __webpack_require__(111);

        var document = global.document;
        // typeof document.createElement is 'object' in old IE
        var EXISTS = isObject(document) && isObject(document.createElement);

        module.exports = function (it) {
          return EXISTS ? document.createElement(it) : {};
        };

        /***/
      },

      /***/ 8324: /***/ function (module) {
        // iterable DOM collections
        // flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
        module.exports = {
          CSSRuleList: 0,
          CSSStyleDeclaration: 0,
          CSSValueList: 0,
          ClientRectList: 0,
          DOMRectList: 0,
          DOMStringList: 0,
          DOMTokenList: 1,
          DataTransferItemList: 0,
          FileList: 0,
          HTMLAllCollection: 0,
          HTMLCollection: 0,
          HTMLFormElement: 0,
          HTMLSelectElement: 0,
          MediaList: 0,
          MimeTypeArray: 0,
          NamedNodeMap: 0,
          NodeList: 1,
          PaintRequestList: 0,
          Plugin: 0,
          PluginArray: 0,
          SVGLengthList: 0,
          SVGNumberList: 0,
          SVGPathSegList: 0,
          SVGPointList: 0,
          SVGStringList: 0,
          SVGTransformList: 0,
          SourceBufferList: 0,
          StyleSheetList: 0,
          TextTrackCueList: 0,
          TextTrackList: 0,
          TouchList: 0
        };

        /***/
      },

      /***/ 6833: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var userAgent = __webpack_require__(8113);

        module.exports = /(iphone|ipod|ipad).*applewebkit/i.test(userAgent);

        /***/
      },

      /***/ 8113: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var getBuiltIn = __webpack_require__(5005);

        module.exports = getBuiltIn("navigator", "userAgent") || "";

        /***/
      },

      /***/ 7392: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var global = __webpack_require__(7854);
        var userAgent = __webpack_require__(8113);

        var process = global.process;
        var versions = process && process.versions;
        var v8 = versions && versions.v8;
        var match, version;

        if (v8) {
          match = v8.split(".");
          version = match[0] + match[1];
        } else if (userAgent) {
          match = userAgent.match(/Edge\/(\d+)/);
          if (!match || match[1] >= 74) {
            match = userAgent.match(/Chrome\/(\d+)/);
            if (match) version = match[1];
          }
        }

        module.exports = version && +version;

        /***/
      },

      /***/ 748: /***/ function (module) {
        // IE8- don't enum bug keys
        module.exports = [
          "constructor",
          "hasOwnProperty",
          "isPrototypeOf",
          "propertyIsEnumerable",
          "toLocaleString",
          "toString",
          "valueOf"
        ];

        /***/
      },

      /***/ 2109: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var global = __webpack_require__(7854);
        var getOwnPropertyDescriptor = __webpack_require__(1236).f;
        var createNonEnumerableProperty = __webpack_require__(8880);
        var redefine = __webpack_require__(1320);
        var setGlobal = __webpack_require__(3505);
        var copyConstructorProperties = __webpack_require__(9920);
        var isForced = __webpack_require__(4705);

        /*
  options.target      - name of the target object
  options.global      - target is the global object
  options.stat        - export as static methods of target
  options.proto       - export as prototype methods of target
  options.real        - real prototype method for the `pure` version
  options.forced      - export even if the native feature is available
  options.bind        - bind methods to the target, required for the `pure` version
  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
  options.sham        - add a flag to not completely full polyfills
  options.enumerable  - export as enumerable property
  options.noTargetGet - prevent calling a getter on target
*/
        module.exports = function (options, source) {
          var TARGET = options.target;
          var GLOBAL = options.global;
          var STATIC = options.stat;
          var FORCED, target, key, targetProperty, sourceProperty, descriptor;
          if (GLOBAL) {
            target = global;
          } else if (STATIC) {
            target = global[TARGET] || setGlobal(TARGET, {});
          } else {
            target = (global[TARGET] || {}).prototype;
          }
          if (target)
            for (key in source) {
              sourceProperty = source[key];
              if (options.noTargetGet) {
                descriptor = getOwnPropertyDescriptor(target, key);
                targetProperty = descriptor && descriptor.value;
              } else targetProperty = target[key];
              FORCED = isForced(
                GLOBAL ? key : TARGET + (STATIC ? "." : "#") + key,
                options.forced
              );
              // contained in target
              if (!FORCED && targetProperty !== undefined) {
                if (typeof sourceProperty === typeof targetProperty) continue;
                copyConstructorProperties(sourceProperty, targetProperty);
              }
              // add a flag to not completely full polyfills
              if (options.sham || (targetProperty && targetProperty.sham)) {
                createNonEnumerableProperty(sourceProperty, "sham", true);
              }
              // extend global
              redefine(target, key, sourceProperty, options);
            }
        };

        /***/
      },

      /***/ 7293: /***/ function (module) {
        module.exports = function (exec) {
          try {
            return !!exec();
          } catch (error) {
            return true;
          }
        };

        /***/
      },

      /***/ 6677: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var fails = __webpack_require__(7293);

        module.exports = !fails(function () {
          return Object.isExtensible(Object.preventExtensions({}));
        });

        /***/
      },

      /***/ 9974: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var aFunction = __webpack_require__(3099);

        // optional / simple context binding
        module.exports = function (fn, that, length) {
          aFunction(fn);
          if (that === undefined) return fn;
          switch (length) {
            case 0:
              return function () {
                return fn.call(that);
              };
            case 1:
              return function (a) {
                return fn.call(that, a);
              };
            case 2:
              return function (a, b) {
                return fn.call(that, a, b);
              };
            case 3:
              return function (a, b, c) {
                return fn.call(that, a, b, c);
              };
          }
          return function (/* ...args */) {
            return fn.apply(that, arguments);
          };
        };

        /***/
      },

      /***/ 5005: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var path = __webpack_require__(857);
        var global = __webpack_require__(7854);

        var aFunction = function (variable) {
          return typeof variable == "function" ? variable : undefined;
        };

        module.exports = function (namespace, method) {
          return arguments.length < 2
            ? aFunction(path[namespace]) || aFunction(global[namespace])
            : (path[namespace] && path[namespace][method]) ||
                (global[namespace] && global[namespace][method]);
        };

        /***/
      },

      /***/ 1246: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var classof = __webpack_require__(648);
        var Iterators = __webpack_require__(7497);
        var wellKnownSymbol = __webpack_require__(5112);

        var ITERATOR = wellKnownSymbol("iterator");

        module.exports = function (it) {
          if (it != undefined)
            return it[ITERATOR] || it["@@iterator"] || Iterators[classof(it)];
        };

        /***/
      },

      /***/ 7854: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var check = function (it) {
          return it && it.Math == Math && it;
        };

        // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
        module.exports =
          // eslint-disable-next-line no-undef
          check(typeof globalThis == "object" && globalThis) ||
          check(typeof window == "object" && window) ||
          check(typeof self == "object" && self) ||
          check(
            typeof __webpack_require__.g == "object" && __webpack_require__.g
          ) ||
          // eslint-disable-next-line no-new-func
          Function("return this")();

        /***/
      },

      /***/ 6656: /***/ function (module) {
        var hasOwnProperty = {}.hasOwnProperty;

        module.exports = function (it, key) {
          return hasOwnProperty.call(it, key);
        };

        /***/
      },

      /***/ 3501: /***/ function (module) {
        module.exports = {};

        /***/
      },

      /***/ 842: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var global = __webpack_require__(7854);

        module.exports = function (a, b) {
          var console = global.console;
          if (console && console.error) {
            arguments.length === 1 ? console.error(a) : console.error(a, b);
          }
        };

        /***/
      },

      /***/ 490: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var getBuiltIn = __webpack_require__(5005);

        module.exports = getBuiltIn("document", "documentElement");

        /***/
      },

      /***/ 4664: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var DESCRIPTORS = __webpack_require__(9781);
        var fails = __webpack_require__(7293);
        var createElement = __webpack_require__(317);

        // Thank's IE8 for his funny defineProperty
        module.exports =
          !DESCRIPTORS &&
          !fails(function () {
            return (
              Object.defineProperty(createElement("div"), "a", {
                get: function () {
                  return 7;
                }
              }).a != 7
            );
          });

        /***/
      },

      /***/ 8361: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var fails = __webpack_require__(7293);
        var classof = __webpack_require__(4326);

        var split = "".split;

        // fallback for non-array-like ES3 and non-enumerable old V8 strings
        module.exports = fails(function () {
          // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
          // eslint-disable-next-line no-prototype-builtins
          return !Object("z").propertyIsEnumerable(0);
        })
          ? function (it) {
              return classof(it) == "String" ? split.call(it, "") : Object(it);
            }
          : Object;

        /***/
      },

      /***/ 9587: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var isObject = __webpack_require__(111);
        var setPrototypeOf = __webpack_require__(7674);

        // makes subclassing work correct for wrapped built-ins
        module.exports = function ($this, dummy, Wrapper) {
          var NewTarget, NewTargetPrototype;
          if (
            // it can work only with native `setPrototypeOf`
            setPrototypeOf &&
            // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
            typeof (NewTarget = dummy.constructor) == "function" &&
            NewTarget !== Wrapper &&
            isObject((NewTargetPrototype = NewTarget.prototype)) &&
            NewTargetPrototype !== Wrapper.prototype
          )
            setPrototypeOf($this, NewTargetPrototype);
          return $this;
        };

        /***/
      },

      /***/ 2788: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var store = __webpack_require__(5465);

        var functionToString = Function.toString;

        // this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
        if (typeof store.inspectSource != "function") {
          store.inspectSource = function (it) {
            return functionToString.call(it);
          };
        }

        module.exports = store.inspectSource;

        /***/
      },

      /***/ 2423: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var hiddenKeys = __webpack_require__(3501);
        var isObject = __webpack_require__(111);
        var has = __webpack_require__(6656);
        var defineProperty = __webpack_require__(3070).f;
        var uid = __webpack_require__(9711);
        var FREEZING = __webpack_require__(6677);

        var METADATA = uid("meta");
        var id = 0;

        var isExtensible =
          Object.isExtensible ||
          function () {
            return true;
          };

        var setMetadata = function (it) {
          defineProperty(it, METADATA, {
            value: {
              objectID: "O" + ++id, // object ID
              weakData: {} // weak collections IDs
            }
          });
        };

        var fastKey = function (it, create) {
          // return a primitive with prefix
          if (!isObject(it))
            return typeof it == "symbol"
              ? it
              : (typeof it == "string" ? "S" : "P") + it;
          if (!has(it, METADATA)) {
            // can't set metadata to uncaught frozen object
            if (!isExtensible(it)) return "F";
            // not necessary to add metadata
            if (!create) return "E";
            // add missing metadata
            setMetadata(it);
            // return object ID
          }
          return it[METADATA].objectID;
        };

        var getWeakData = function (it, create) {
          if (!has(it, METADATA)) {
            // can't set metadata to uncaught frozen object
            if (!isExtensible(it)) return true;
            // not necessary to add metadata
            if (!create) return false;
            // add missing metadata
            setMetadata(it);
            // return the store of weak collections IDs
          }
          return it[METADATA].weakData;
        };

        // add metadata on freeze-family methods calling
        var onFreeze = function (it) {
          if (
            FREEZING &&
            meta.REQUIRED &&
            isExtensible(it) &&
            !has(it, METADATA)
          )
            setMetadata(it);
          return it;
        };

        var meta = (module.exports = {
          REQUIRED: false,
          fastKey: fastKey,
          getWeakData: getWeakData,
          onFreeze: onFreeze
        });

        hiddenKeys[METADATA] = true;

        /***/
      },

      /***/ 9909: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var NATIVE_WEAK_MAP = __webpack_require__(8536);
        var global = __webpack_require__(7854);
        var isObject = __webpack_require__(111);
        var createNonEnumerableProperty = __webpack_require__(8880);
        var objectHas = __webpack_require__(6656);
        var sharedKey = __webpack_require__(6200);
        var hiddenKeys = __webpack_require__(3501);

        var WeakMap = global.WeakMap;
        var set, get, has;

        var enforce = function (it) {
          return has(it) ? get(it) : set(it, {});
        };

        var getterFor = function (TYPE) {
          return function (it) {
            var state;
            if (!isObject(it) || (state = get(it)).type !== TYPE) {
              throw TypeError("Incompatible receiver, " + TYPE + " required");
            }
            return state;
          };
        };

        if (NATIVE_WEAK_MAP) {
          var store = new WeakMap();
          var wmget = store.get;
          var wmhas = store.has;
          var wmset = store.set;
          set = function (it, metadata) {
            wmset.call(store, it, metadata);
            return metadata;
          };
          get = function (it) {
            return wmget.call(store, it) || {};
          };
          has = function (it) {
            return wmhas.call(store, it);
          };
        } else {
          var STATE = sharedKey("state");
          hiddenKeys[STATE] = true;
          set = function (it, metadata) {
            createNonEnumerableProperty(it, STATE, metadata);
            return metadata;
          };
          get = function (it) {
            return objectHas(it, STATE) ? it[STATE] : {};
          };
          has = function (it) {
            return objectHas(it, STATE);
          };
        }

        module.exports = {
          set: set,
          get: get,
          has: has,
          enforce: enforce,
          getterFor: getterFor
        };

        /***/
      },

      /***/ 7659: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var wellKnownSymbol = __webpack_require__(5112);
        var Iterators = __webpack_require__(7497);

        var ITERATOR = wellKnownSymbol("iterator");
        var ArrayPrototype = Array.prototype;

        // check on default Array iterator
        module.exports = function (it) {
          return (
            it !== undefined &&
            (Iterators.Array === it || ArrayPrototype[ITERATOR] === it)
          );
        };

        /***/
      },

      /***/ 3157: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var classof = __webpack_require__(4326);

        // `IsArray` abstract operation
        // https://tc39.github.io/ecma262/#sec-isarray
        module.exports =
          Array.isArray ||
          function isArray(arg) {
            return classof(arg) == "Array";
          };

        /***/
      },

      /***/ 4705: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var fails = __webpack_require__(7293);

        var replacement = /#|\.prototype\./;

        var isForced = function (feature, detection) {
          var value = data[normalize(feature)];
          return value == POLYFILL
            ? true
            : value == NATIVE
            ? false
            : typeof detection == "function"
            ? fails(detection)
            : !!detection;
        };

        var normalize = (isForced.normalize = function (string) {
          return String(string).replace(replacement, ".").toLowerCase();
        });

        var data = (isForced.data = {});
        var NATIVE = (isForced.NATIVE = "N");
        var POLYFILL = (isForced.POLYFILL = "P");

        module.exports = isForced;

        /***/
      },

      /***/ 111: /***/ function (module) {
        module.exports = function (it) {
          return typeof it === "object"
            ? it !== null
            : typeof it === "function";
        };

        /***/
      },

      /***/ 1913: /***/ function (module) {
        module.exports = false;

        /***/
      },

      /***/ 612: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var anObject = __webpack_require__(9670);
        var isArrayIteratorMethod = __webpack_require__(7659);
        var toLength = __webpack_require__(7466);
        var bind = __webpack_require__(9974);
        var getIteratorMethod = __webpack_require__(1246);
        var callWithSafeIterationClosing = __webpack_require__(3411);

        var Result = function (stopped, result) {
          this.stopped = stopped;
          this.result = result;
        };

        var iterate = (module.exports = function (
          iterable,
          fn,
          that,
          AS_ENTRIES,
          IS_ITERATOR
        ) {
          var boundFunction = bind(fn, that, AS_ENTRIES ? 2 : 1);
          var iterator, iterFn, index, length, result, next, step;

          if (IS_ITERATOR) {
            iterator = iterable;
          } else {
            iterFn = getIteratorMethod(iterable);
            if (typeof iterFn != "function")
              throw TypeError("Target is not iterable");
            // optimisation for array iterators
            if (isArrayIteratorMethod(iterFn)) {
              for (
                index = 0, length = toLength(iterable.length);
                length > index;
                index++
              ) {
                result = AS_ENTRIES
                  ? boundFunction(
                      anObject((step = iterable[index]))[0],
                      step[1]
                    )
                  : boundFunction(iterable[index]);
                if (result && result instanceof Result) return result;
              }
              return new Result(false);
            }
            iterator = iterFn.call(iterable);
          }

          next = iterator.next;
          while (!(step = next.call(iterator)).done) {
            result = callWithSafeIterationClosing(
              iterator,
              boundFunction,
              step.value,
              AS_ENTRIES
            );
            if (typeof result == "object" && result && result instanceof Result)
              return result;
          }
          return new Result(false);
        });

        iterate.stop = function (result) {
          return new Result(true, result);
        };

        /***/
      },

      /***/ 3383: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        "use strict";

        var getPrototypeOf = __webpack_require__(9518);
        var createNonEnumerableProperty = __webpack_require__(8880);
        var has = __webpack_require__(6656);
        var wellKnownSymbol = __webpack_require__(5112);
        var IS_PURE = __webpack_require__(1913);

        var ITERATOR = wellKnownSymbol("iterator");
        var BUGGY_SAFARI_ITERATORS = false;

        var returnThis = function () {
          return this;
        };

        // `%IteratorPrototype%` object
        // https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object
        var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

        if ([].keys) {
          arrayIterator = [].keys();
          // Safari 8 has buggy iterators w/o `next`
          if (!("next" in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
          else {
            PrototypeOfArrayIteratorPrototype = getPrototypeOf(
              getPrototypeOf(arrayIterator)
            );
            if (PrototypeOfArrayIteratorPrototype !== Object.prototype)
              IteratorPrototype = PrototypeOfArrayIteratorPrototype;
          }
        }

        if (IteratorPrototype == undefined) IteratorPrototype = {};

        // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
        if (!IS_PURE && !has(IteratorPrototype, ITERATOR)) {
          createNonEnumerableProperty(IteratorPrototype, ITERATOR, returnThis);
        }

        module.exports = {
          IteratorPrototype: IteratorPrototype,
          BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
        };

        /***/
      },

      /***/ 7497: /***/ function (module) {
        module.exports = {};

        /***/
      },

      /***/ 5948: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var global = __webpack_require__(7854);
        var getOwnPropertyDescriptor = __webpack_require__(1236).f;
        var classof = __webpack_require__(4326);
        var macrotask = __webpack_require__(261).set;
        var IS_IOS = __webpack_require__(6833);

        var MutationObserver =
          global.MutationObserver || global.WebKitMutationObserver;
        var process = global.process;
        var Promise = global.Promise;
        var IS_NODE = classof(process) == "process";
        // Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
        var queueMicrotaskDescriptor = getOwnPropertyDescriptor(
          global,
          "queueMicrotask"
        );
        var queueMicrotask =
          queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

        var flush, head, last, notify, toggle, node, promise, then;

        // modern engines have queueMicrotask method
        if (!queueMicrotask) {
          flush = function () {
            var parent, fn;
            if (IS_NODE && (parent = process.domain)) parent.exit();
            while (head) {
              fn = head.fn;
              head = head.next;
              try {
                fn();
              } catch (error) {
                if (head) notify();
                else last = undefined;
                throw error;
              }
            }
            last = undefined;
            if (parent) parent.enter();
          };

          // Node.js
          if (IS_NODE) {
            notify = function () {
              process.nextTick(flush);
            };
            // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
          } else if (MutationObserver && !IS_IOS) {
            toggle = true;
            node = document.createTextNode("");
            new MutationObserver(flush).observe(node, { characterData: true });
            notify = function () {
              node.data = toggle = !toggle;
            };
            // environments with maybe non-completely correct, but existent Promise
          } else if (Promise && Promise.resolve) {
            // Promise.resolve without an argument throws an error in LG WebOS 2
            promise = Promise.resolve(undefined);
            then = promise.then;
            notify = function () {
              then.call(promise, flush);
            };
            // for other environments - macrotask based on:
            // - setImmediate
            // - MessageChannel
            // - window.postMessag
            // - onreadystatechange
            // - setTimeout
          } else {
            notify = function () {
              // strange IE + webpack dev server bug - use .call(global)
              macrotask.call(global, flush);
            };
          }
        }

        module.exports =
          queueMicrotask ||
          function (fn) {
            var task = { fn: fn, next: undefined };
            if (last) last.next = task;
            if (!head) {
              head = task;
              notify();
            }
            last = task;
          };

        /***/
      },

      /***/ 3366: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var global = __webpack_require__(7854);

        module.exports = global.Promise;

        /***/
      },

      /***/ 133: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var fails = __webpack_require__(7293);

        module.exports =
          !!Object.getOwnPropertySymbols &&
          !fails(function () {
            // Chrome 38 Symbol has incorrect toString conversion
            // eslint-disable-next-line no-undef
            return !String(Symbol());
          });

        /***/
      },

      /***/ 8536: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var global = __webpack_require__(7854);
        var inspectSource = __webpack_require__(2788);

        var WeakMap = global.WeakMap;

        module.exports =
          typeof WeakMap === "function" &&
          /native code/.test(inspectSource(WeakMap));

        /***/
      },

      /***/ 8523: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        "use strict";

        var aFunction = __webpack_require__(3099);

        var PromiseCapability = function (C) {
          var resolve, reject;
          this.promise = new C(function ($$resolve, $$reject) {
            if (resolve !== undefined || reject !== undefined)
              throw TypeError("Bad Promise constructor");
            resolve = $$resolve;
            reject = $$reject;
          });
          this.resolve = aFunction(resolve);
          this.reject = aFunction(reject);
        };

        // 25.4.1.5 NewPromiseCapability(C)
        module.exports.f = function (C) {
          return new PromiseCapability(C);
        };

        /***/
      },

      /***/ 30: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var anObject = __webpack_require__(9670);
        var defineProperties = __webpack_require__(6048);
        var enumBugKeys = __webpack_require__(748);
        var hiddenKeys = __webpack_require__(3501);
        var html = __webpack_require__(490);
        var documentCreateElement = __webpack_require__(317);
        var sharedKey = __webpack_require__(6200);

        var GT = ">";
        var LT = "<";
        var PROTOTYPE = "prototype";
        var SCRIPT = "script";
        var IE_PROTO = sharedKey("IE_PROTO");

        var EmptyConstructor = function () {
          /* empty */
        };

        var scriptTag = function (content) {
          return LT + SCRIPT + GT + content + LT + "/" + SCRIPT + GT;
        };

        // Create object with fake `null` prototype: use ActiveX Object with cleared prototype
        var NullProtoObjectViaActiveX = function (activeXDocument) {
          activeXDocument.write(scriptTag(""));
          activeXDocument.close();
          var temp = activeXDocument.parentWindow.Object;
          activeXDocument = null; // avoid memory leak
          return temp;
        };

        // Create object with fake `null` prototype: use iframe Object with cleared prototype
        var NullProtoObjectViaIFrame = function () {
          // Thrash, waste and sodomy: IE GC bug
          var iframe = documentCreateElement("iframe");
          var JS = "java" + SCRIPT + ":";
          var iframeDocument;
          iframe.style.display = "none";
          html.appendChild(iframe);
          // https://github.com/zloirock/core-js/issues/475
          iframe.src = String(JS);
          iframeDocument = iframe.contentWindow.document;
          iframeDocument.open();
          iframeDocument.write(scriptTag("document.F=Object"));
          iframeDocument.close();
          return iframeDocument.F;
        };

        // Check for document.domain and active x support
        // No need to use active x approach when document.domain is not set
        // see https://github.com/es-shims/es5-shim/issues/150
        // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
        // avoid IE GC bug
        var activeXDocument;
        var NullProtoObject = function () {
          try {
            /* global ActiveXObject */
            activeXDocument = document.domain && new ActiveXObject("htmlfile");
          } catch (error) {
            /* ignore */
          }
          NullProtoObject = activeXDocument
            ? NullProtoObjectViaActiveX(activeXDocument)
            : NullProtoObjectViaIFrame();
          var length = enumBugKeys.length;
          while (length--)
            delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
          return NullProtoObject();
        };

        hiddenKeys[IE_PROTO] = true;

        // `Object.create` method
        // https://tc39.github.io/ecma262/#sec-object.create
        module.exports =
          Object.create ||
          function create(O, Properties) {
            var result;
            if (O !== null) {
              EmptyConstructor[PROTOTYPE] = anObject(O);
              result = new EmptyConstructor();
              EmptyConstructor[PROTOTYPE] = null;
              // add "__proto__" for Object.getPrototypeOf polyfill
              result[IE_PROTO] = O;
            } else result = NullProtoObject();
            return Properties === undefined
              ? result
              : defineProperties(result, Properties);
          };

        /***/
      },

      /***/ 6048: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var DESCRIPTORS = __webpack_require__(9781);
        var definePropertyModule = __webpack_require__(3070);
        var anObject = __webpack_require__(9670);
        var objectKeys = __webpack_require__(1956);

        // `Object.defineProperties` method
        // https://tc39.github.io/ecma262/#sec-object.defineproperties
        module.exports = DESCRIPTORS
          ? Object.defineProperties
          : function defineProperties(O, Properties) {
              anObject(O);
              var keys = objectKeys(Properties);
              var length = keys.length;
              var index = 0;
              var key;
              while (length > index)
                definePropertyModule.f(
                  O,
                  (key = keys[index++]),
                  Properties[key]
                );
              return O;
            };

        /***/
      },

      /***/ 3070: /***/ function (
        __unused_webpack_module,
        exports,
        __webpack_require__
      ) {
        var DESCRIPTORS = __webpack_require__(9781);
        var IE8_DOM_DEFINE = __webpack_require__(4664);
        var anObject = __webpack_require__(9670);
        var toPrimitive = __webpack_require__(7593);

        var nativeDefineProperty = Object.defineProperty;

        // `Object.defineProperty` method
        // https://tc39.github.io/ecma262/#sec-object.defineproperty
        exports.f = DESCRIPTORS
          ? nativeDefineProperty
          : function defineProperty(O, P, Attributes) {
              anObject(O);
              P = toPrimitive(P, true);
              anObject(Attributes);
              if (IE8_DOM_DEFINE)
                try {
                  return nativeDefineProperty(O, P, Attributes);
                } catch (error) {
                  /* empty */
                }
              if ("get" in Attributes || "set" in Attributes)
                throw TypeError("Accessors not supported");
              if ("value" in Attributes) O[P] = Attributes.value;
              return O;
            };

        /***/
      },

      /***/ 1236: /***/ function (
        __unused_webpack_module,
        exports,
        __webpack_require__
      ) {
        var DESCRIPTORS = __webpack_require__(9781);
        var propertyIsEnumerableModule = __webpack_require__(5296);
        var createPropertyDescriptor = __webpack_require__(9114);
        var toIndexedObject = __webpack_require__(5656);
        var toPrimitive = __webpack_require__(7593);
        var has = __webpack_require__(6656);
        var IE8_DOM_DEFINE = __webpack_require__(4664);

        var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

        // `Object.getOwnPropertyDescriptor` method
        // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
        exports.f = DESCRIPTORS
          ? nativeGetOwnPropertyDescriptor
          : function getOwnPropertyDescriptor(O, P) {
              O = toIndexedObject(O);
              P = toPrimitive(P, true);
              if (IE8_DOM_DEFINE)
                try {
                  return nativeGetOwnPropertyDescriptor(O, P);
                } catch (error) {
                  /* empty */
                }
              if (has(O, P))
                return createPropertyDescriptor(
                  !propertyIsEnumerableModule.f.call(O, P),
                  O[P]
                );
            };

        /***/
      },

      /***/ 8006: /***/ function (
        __unused_webpack_module,
        exports,
        __webpack_require__
      ) {
        var internalObjectKeys = __webpack_require__(6324);
        var enumBugKeys = __webpack_require__(748);

        var hiddenKeys = enumBugKeys.concat("length", "prototype");

        // `Object.getOwnPropertyNames` method
        // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
        exports.f =
          Object.getOwnPropertyNames ||
          function getOwnPropertyNames(O) {
            return internalObjectKeys(O, hiddenKeys);
          };

        /***/
      },

      /***/ 5181: /***/ function (__unused_webpack_module, exports) {
        exports.f = Object.getOwnPropertySymbols;

        /***/
      },

      /***/ 9518: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var has = __webpack_require__(6656);
        var toObject = __webpack_require__(7908);
        var sharedKey = __webpack_require__(6200);
        var CORRECT_PROTOTYPE_GETTER = __webpack_require__(8544);

        var IE_PROTO = sharedKey("IE_PROTO");
        var ObjectPrototype = Object.prototype;

        // `Object.getPrototypeOf` method
        // https://tc39.github.io/ecma262/#sec-object.getprototypeof
        module.exports = CORRECT_PROTOTYPE_GETTER
          ? Object.getPrototypeOf
          : function (O) {
              O = toObject(O);
              if (has(O, IE_PROTO)) return O[IE_PROTO];
              if (
                typeof O.constructor == "function" &&
                O instanceof O.constructor
              ) {
                return O.constructor.prototype;
              }
              return O instanceof Object ? ObjectPrototype : null;
            };

        /***/
      },

      /***/ 6324: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var has = __webpack_require__(6656);
        var toIndexedObject = __webpack_require__(5656);
        var indexOf = __webpack_require__(1318).indexOf;
        var hiddenKeys = __webpack_require__(3501);

        module.exports = function (object, names) {
          var O = toIndexedObject(object);
          var i = 0;
          var result = [];
          var key;
          for (key in O)
            !has(hiddenKeys, key) && has(O, key) && result.push(key);
          // Don't enum bug & hidden keys
          while (names.length > i)
            if (has(O, (key = names[i++]))) {
              ~indexOf(result, key) || result.push(key);
            }
          return result;
        };

        /***/
      },

      /***/ 1956: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var internalObjectKeys = __webpack_require__(6324);
        var enumBugKeys = __webpack_require__(748);

        // `Object.keys` method
        // https://tc39.github.io/ecma262/#sec-object.keys
        module.exports =
          Object.keys ||
          function keys(O) {
            return internalObjectKeys(O, enumBugKeys);
          };

        /***/
      },

      /***/ 5296: /***/ function (__unused_webpack_module, exports) {
        "use strict";

        var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
        var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

        // Nashorn ~ JDK8 bug
        var NASHORN_BUG =
          getOwnPropertyDescriptor &&
          !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

        // `Object.prototype.propertyIsEnumerable` method implementation
        // https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
        exports.f = NASHORN_BUG
          ? function propertyIsEnumerable(V) {
              var descriptor = getOwnPropertyDescriptor(this, V);
              return !!descriptor && descriptor.enumerable;
            }
          : nativePropertyIsEnumerable;

        /***/
      },

      /***/ 7674: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var anObject = __webpack_require__(9670);
        var aPossiblePrototype = __webpack_require__(6077);

        // `Object.setPrototypeOf` method
        // https://tc39.github.io/ecma262/#sec-object.setprototypeof
        // Works with __proto__ only. Old v8 can't work with null proto objects.
        /* eslint-disable no-proto */
        module.exports =
          Object.setPrototypeOf ||
          ("__proto__" in {}
            ? (function () {
                var CORRECT_SETTER = false;
                var test = {};
                var setter;
                try {
                  setter = Object.getOwnPropertyDescriptor(
                    Object.prototype,
                    "__proto__"
                  ).set;
                  setter.call(test, []);
                  CORRECT_SETTER = test instanceof Array;
                } catch (error) {
                  /* empty */
                }
                return function setPrototypeOf(O, proto) {
                  anObject(O);
                  aPossiblePrototype(proto);
                  if (CORRECT_SETTER) setter.call(O, proto);
                  else O.__proto__ = proto;
                  return O;
                };
              })()
            : undefined);

        /***/
      },

      /***/ 3887: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var getBuiltIn = __webpack_require__(5005);
        var getOwnPropertyNamesModule = __webpack_require__(8006);
        var getOwnPropertySymbolsModule = __webpack_require__(5181);
        var anObject = __webpack_require__(9670);

        // all object keys, includes non-enumerable and symbols
        module.exports =
          getBuiltIn("Reflect", "ownKeys") ||
          function ownKeys(it) {
            var keys = getOwnPropertyNamesModule.f(anObject(it));
            var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
            return getOwnPropertySymbols
              ? keys.concat(getOwnPropertySymbols(it))
              : keys;
          };

        /***/
      },

      /***/ 857: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var global = __webpack_require__(7854);

        module.exports = global;

        /***/
      },

      /***/ 2534: /***/ function (module) {
        module.exports = function (exec) {
          try {
            return { error: false, value: exec() };
          } catch (error) {
            return { error: true, value: error };
          }
        };

        /***/
      },

      /***/ 9478: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var anObject = __webpack_require__(9670);
        var isObject = __webpack_require__(111);
        var newPromiseCapability = __webpack_require__(8523);

        module.exports = function (C, x) {
          anObject(C);
          if (isObject(x) && x.constructor === C) return x;
          var promiseCapability = newPromiseCapability.f(C);
          var resolve = promiseCapability.resolve;
          resolve(x);
          return promiseCapability.promise;
        };

        /***/
      },

      /***/ 2248: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var redefine = __webpack_require__(1320);

        module.exports = function (target, src, options) {
          for (var key in src) redefine(target, key, src[key], options);
          return target;
        };

        /***/
      },

      /***/ 1320: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var global = __webpack_require__(7854);
        var createNonEnumerableProperty = __webpack_require__(8880);
        var has = __webpack_require__(6656);
        var setGlobal = __webpack_require__(3505);
        var inspectSource = __webpack_require__(2788);
        var InternalStateModule = __webpack_require__(9909);

        var getInternalState = InternalStateModule.get;
        var enforceInternalState = InternalStateModule.enforce;
        var TEMPLATE = String(String).split("String");

        (module.exports = function (O, key, value, options) {
          var unsafe = options ? !!options.unsafe : false;
          var simple = options ? !!options.enumerable : false;
          var noTargetGet = options ? !!options.noTargetGet : false;
          if (typeof value == "function") {
            if (typeof key == "string" && !has(value, "name"))
              createNonEnumerableProperty(value, "name", key);
            enforceInternalState(value).source = TEMPLATE.join(
              typeof key == "string" ? key : ""
            );
          }
          if (O === global) {
            if (simple) O[key] = value;
            else setGlobal(key, value);
            return;
          } else if (!unsafe) {
            delete O[key];
          } else if (!noTargetGet && O[key]) {
            simple = true;
          }
          if (simple) O[key] = value;
          else createNonEnumerableProperty(O, key, value);
          // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
        })(Function.prototype, "toString", function toString() {
          return (
            (typeof this == "function" && getInternalState(this).source) ||
            inspectSource(this)
          );
        });

        /***/
      },

      /***/ 7066: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        "use strict";

        var anObject = __webpack_require__(9670);

        // `RegExp.prototype.flags` getter implementation
        // https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
        module.exports = function () {
          var that = anObject(this);
          var result = "";
          if (that.global) result += "g";
          if (that.ignoreCase) result += "i";
          if (that.multiline) result += "m";
          if (that.dotAll) result += "s";
          if (that.unicode) result += "u";
          if (that.sticky) result += "y";
          return result;
        };

        /***/
      },

      /***/ 4488: /***/ function (module) {
        // `RequireObjectCoercible` abstract operation
        // https://tc39.github.io/ecma262/#sec-requireobjectcoercible
        module.exports = function (it) {
          if (it == undefined) throw TypeError("Can't call method on " + it);
          return it;
        };

        /***/
      },

      /***/ 3505: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var global = __webpack_require__(7854);
        var createNonEnumerableProperty = __webpack_require__(8880);

        module.exports = function (key, value) {
          try {
            createNonEnumerableProperty(global, key, value);
          } catch (error) {
            global[key] = value;
          }
          return value;
        };

        /***/
      },

      /***/ 6340: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        "use strict";

        var getBuiltIn = __webpack_require__(5005);
        var definePropertyModule = __webpack_require__(3070);
        var wellKnownSymbol = __webpack_require__(5112);
        var DESCRIPTORS = __webpack_require__(9781);

        var SPECIES = wellKnownSymbol("species");

        module.exports = function (CONSTRUCTOR_NAME) {
          var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
          var defineProperty = definePropertyModule.f;

          if (DESCRIPTORS && Constructor && !Constructor[SPECIES]) {
            defineProperty(Constructor, SPECIES, {
              configurable: true,
              get: function () {
                return this;
              }
            });
          }
        };

        /***/
      },

      /***/ 8003: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var defineProperty = __webpack_require__(3070).f;
        var has = __webpack_require__(6656);
        var wellKnownSymbol = __webpack_require__(5112);

        var TO_STRING_TAG = wellKnownSymbol("toStringTag");

        module.exports = function (it, TAG, STATIC) {
          if (it && !has((it = STATIC ? it : it.prototype), TO_STRING_TAG)) {
            defineProperty(it, TO_STRING_TAG, {
              configurable: true,
              value: TAG
            });
          }
        };

        /***/
      },

      /***/ 6200: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var shared = __webpack_require__(2309);
        var uid = __webpack_require__(9711);

        var keys = shared("keys");

        module.exports = function (key) {
          return keys[key] || (keys[key] = uid(key));
        };

        /***/
      },

      /***/ 5465: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var global = __webpack_require__(7854);
        var setGlobal = __webpack_require__(3505);

        var SHARED = "__core-js_shared__";
        var store = global[SHARED] || setGlobal(SHARED, {});

        module.exports = store;

        /***/
      },

      /***/ 2309: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var IS_PURE = __webpack_require__(1913);
        var store = __webpack_require__(5465);

        (module.exports = function (key, value) {
          return store[key] || (store[key] = value !== undefined ? value : {});
        })("versions", []).push({
          version: "3.6.5",
          mode: IS_PURE ? "pure" : "global",
          copyright: "© 2020 Denis Pushkarev (zloirock.ru)"
        });

        /***/
      },

      /***/ 6707: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var anObject = __webpack_require__(9670);
        var aFunction = __webpack_require__(3099);
        var wellKnownSymbol = __webpack_require__(5112);

        var SPECIES = wellKnownSymbol("species");

        // `SpeciesConstructor` abstract operation
        // https://tc39.github.io/ecma262/#sec-speciesconstructor
        module.exports = function (O, defaultConstructor) {
          var C = anObject(O).constructor;
          var S;
          return C === undefined || (S = anObject(C)[SPECIES]) == undefined
            ? defaultConstructor
            : aFunction(S);
        };

        /***/
      },

      /***/ 261: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var global = __webpack_require__(7854);
        var fails = __webpack_require__(7293);
        var classof = __webpack_require__(4326);
        var bind = __webpack_require__(9974);
        var html = __webpack_require__(490);
        var createElement = __webpack_require__(317);
        var IS_IOS = __webpack_require__(6833);

        var location = global.location;
        var set = global.setImmediate;
        var clear = global.clearImmediate;
        var process = global.process;
        var MessageChannel = global.MessageChannel;
        var Dispatch = global.Dispatch;
        var counter = 0;
        var queue = {};
        var ONREADYSTATECHANGE = "onreadystatechange";
        var defer, channel, port;

        var run = function (id) {
          // eslint-disable-next-line no-prototype-builtins
          if (queue.hasOwnProperty(id)) {
            var fn = queue[id];
            delete queue[id];
            fn();
          }
        };

        var runner = function (id) {
          return function () {
            run(id);
          };
        };

        var listener = function (event) {
          run(event.data);
        };

        var post = function (id) {
          // old engines have not location.origin
          global.postMessage(id + "", location.protocol + "//" + location.host);
        };

        // Node.js 0.9+ & IE10+ has setImmediate, otherwise:
        if (!set || !clear) {
          set = function setImmediate(fn) {
            var args = [];
            var i = 1;
            while (arguments.length > i) args.push(arguments[i++]);
            queue[++counter] = function () {
              // eslint-disable-next-line no-new-func
              (typeof fn == "function" ? fn : Function(fn)).apply(
                undefined,
                args
              );
            };
            defer(counter);
            return counter;
          };
          clear = function clearImmediate(id) {
            delete queue[id];
          };
          // Node.js 0.8-
          if (classof(process) == "process") {
            defer = function (id) {
              process.nextTick(runner(id));
            };
            // Sphere (JS game engine) Dispatch API
          } else if (Dispatch && Dispatch.now) {
            defer = function (id) {
              Dispatch.now(runner(id));
            };
            // Browsers with MessageChannel, includes WebWorkers
            // except iOS - https://github.com/zloirock/core-js/issues/624
          } else if (MessageChannel && !IS_IOS) {
            channel = new MessageChannel();
            port = channel.port2;
            channel.port1.onmessage = listener;
            defer = bind(port.postMessage, port, 1);
            // Browsers with postMessage, skip WebWorkers
            // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
          } else if (
            global.addEventListener &&
            typeof postMessage == "function" &&
            !global.importScripts &&
            !fails(post) &&
            location.protocol !== "file:"
          ) {
            defer = post;
            global.addEventListener("message", listener, false);
            // IE8-
          } else if (ONREADYSTATECHANGE in createElement("script")) {
            defer = function (id) {
              html.appendChild(createElement("script"))[ONREADYSTATECHANGE] =
                function () {
                  html.removeChild(this);
                  run(id);
                };
            };
            // Rest old browsers
          } else {
            defer = function (id) {
              setTimeout(runner(id), 0);
            };
          }
        }

        module.exports = {
          set: set,
          clear: clear
        };

        /***/
      },

      /***/ 1400: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var toInteger = __webpack_require__(9958);

        var max = Math.max;
        var min = Math.min;

        // Helper for a popular repeating case of the spec:
        // Let integer be ? ToInteger(index).
        // If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
        module.exports = function (index, length) {
          var integer = toInteger(index);
          return integer < 0 ? max(integer + length, 0) : min(integer, length);
        };

        /***/
      },

      /***/ 5656: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        // toObject with fallback for non-array-like ES3 strings
        var IndexedObject = __webpack_require__(8361);
        var requireObjectCoercible = __webpack_require__(4488);

        module.exports = function (it) {
          return IndexedObject(requireObjectCoercible(it));
        };

        /***/
      },

      /***/ 9958: /***/ function (module) {
        var ceil = Math.ceil;
        var floor = Math.floor;

        // `ToInteger` abstract operation
        // https://tc39.github.io/ecma262/#sec-tointeger
        module.exports = function (argument) {
          return isNaN((argument = +argument))
            ? 0
            : (argument > 0 ? floor : ceil)(argument);
        };

        /***/
      },

      /***/ 7466: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var toInteger = __webpack_require__(9958);

        var min = Math.min;

        // `ToLength` abstract operation
        // https://tc39.github.io/ecma262/#sec-tolength
        module.exports = function (argument) {
          return argument > 0 ? min(toInteger(argument), 0x1fffffffffffff) : 0; // 2 ** 53 - 1 == 9007199254740991
        };

        /***/
      },

      /***/ 7908: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var requireObjectCoercible = __webpack_require__(4488);

        // `ToObject` abstract operation
        // https://tc39.github.io/ecma262/#sec-toobject
        module.exports = function (argument) {
          return Object(requireObjectCoercible(argument));
        };

        /***/
      },

      /***/ 7593: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var isObject = __webpack_require__(111);

        // `ToPrimitive` abstract operation
        // https://tc39.github.io/ecma262/#sec-toprimitive
        // instead of the ES6 spec version, we didn't implement @@toPrimitive case
        // and the second argument - flag - preferred type is a string
        module.exports = function (input, PREFERRED_STRING) {
          if (!isObject(input)) return input;
          var fn, val;
          if (
            PREFERRED_STRING &&
            typeof (fn = input.toString) == "function" &&
            !isObject((val = fn.call(input)))
          )
            return val;
          if (
            typeof (fn = input.valueOf) == "function" &&
            !isObject((val = fn.call(input)))
          )
            return val;
          if (
            !PREFERRED_STRING &&
            typeof (fn = input.toString) == "function" &&
            !isObject((val = fn.call(input)))
          )
            return val;
          throw TypeError("Can't convert object to primitive value");
        };

        /***/
      },

      /***/ 1694: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var wellKnownSymbol = __webpack_require__(5112);

        var TO_STRING_TAG = wellKnownSymbol("toStringTag");
        var test = {};

        test[TO_STRING_TAG] = "z";

        module.exports = String(test) === "[object z]";

        /***/
      },

      /***/ 9711: /***/ function (module) {
        var id = 0;
        var postfix = Math.random();

        module.exports = function (key) {
          return (
            "Symbol(" +
            String(key === undefined ? "" : key) +
            ")_" +
            (++id + postfix).toString(36)
          );
        };

        /***/
      },

      /***/ 3307: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var NATIVE_SYMBOL = __webpack_require__(133);

        module.exports =
          NATIVE_SYMBOL &&
          // eslint-disable-next-line no-undef
          !Symbol.sham &&
          // eslint-disable-next-line no-undef
          typeof Symbol.iterator == "symbol";

        /***/
      },

      /***/ 6061: /***/ function (
        __unused_webpack_module,
        exports,
        __webpack_require__
      ) {
        var wellKnownSymbol = __webpack_require__(5112);

        exports.f = wellKnownSymbol;

        /***/
      },

      /***/ 5112: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var global = __webpack_require__(7854);
        var shared = __webpack_require__(2309);
        var has = __webpack_require__(6656);
        var uid = __webpack_require__(9711);
        var NATIVE_SYMBOL = __webpack_require__(133);
        var USE_SYMBOL_AS_UID = __webpack_require__(3307);

        var WellKnownSymbolsStore = shared("wks");
        var Symbol = global.Symbol;
        var createWellKnownSymbol = USE_SYMBOL_AS_UID
          ? Symbol
          : (Symbol && Symbol.withoutSetter) || uid;

        module.exports = function (name) {
          if (!has(WellKnownSymbolsStore, name)) {
            if (NATIVE_SYMBOL && has(Symbol, name))
              WellKnownSymbolsStore[name] = Symbol[name];
            else
              WellKnownSymbolsStore[name] = createWellKnownSymbol(
                "Symbol." + name
              );
          }
          return WellKnownSymbolsStore[name];
        };

        /***/
      },

      /***/ 7327: /***/ function (
        __unused_webpack_module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        "use strict";

        var $ = __webpack_require__(2109);
        var $filter = __webpack_require__(2092).filter;
        var arrayMethodHasSpeciesSupport = __webpack_require__(1194);
        var arrayMethodUsesToLength = __webpack_require__(9207);

        var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport("filter");
        // Edge 14- issue
        var USES_TO_LENGTH = arrayMethodUsesToLength("filter");

        // `Array.prototype.filter` method
        // https://tc39.github.io/ecma262/#sec-array.prototype.filter
        // with adding support of @@species
        $(
          {
            target: "Array",
            proto: true,
            forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH
          },
          {
            filter: function filter(callbackfn /* , thisArg */) {
              return $filter(
                this,
                callbackfn,
                arguments.length > 1 ? arguments[1] : undefined
              );
            }
          }
        );

        /***/
      },

      /***/ 2772: /***/ function (
        __unused_webpack_module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        "use strict";

        var $ = __webpack_require__(2109);
        var $indexOf = __webpack_require__(1318).indexOf;
        var arrayMethodIsStrict = __webpack_require__(9341);
        var arrayMethodUsesToLength = __webpack_require__(9207);

        var nativeIndexOf = [].indexOf;

        var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
        var STRICT_METHOD = arrayMethodIsStrict("indexOf");
        var USES_TO_LENGTH = arrayMethodUsesToLength("indexOf", {
          ACCESSORS: true,
          1: 0
        });

        // `Array.prototype.indexOf` method
        // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
        $(
          {
            target: "Array",
            proto: true,
            forced: NEGATIVE_ZERO || !STRICT_METHOD || !USES_TO_LENGTH
          },
          {
            indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
              return NEGATIVE_ZERO
                ? // convert -0 to +0
                  nativeIndexOf.apply(this, arguments) || 0
                : $indexOf(
                    this,
                    searchElement,
                    arguments.length > 1 ? arguments[1] : undefined
                  );
            }
          }
        );

        /***/
      },

      /***/ 6992: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        "use strict";

        var toIndexedObject = __webpack_require__(5656);
        var addToUnscopables = __webpack_require__(1223);
        var Iterators = __webpack_require__(7497);
        var InternalStateModule = __webpack_require__(9909);
        var defineIterator = __webpack_require__(654);

        var ARRAY_ITERATOR = "Array Iterator";
        var setInternalState = InternalStateModule.set;
        var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);

        // `Array.prototype.entries` method
        // https://tc39.github.io/ecma262/#sec-array.prototype.entries
        // `Array.prototype.keys` method
        // https://tc39.github.io/ecma262/#sec-array.prototype.keys
        // `Array.prototype.values` method
        // https://tc39.github.io/ecma262/#sec-array.prototype.values
        // `Array.prototype[@@iterator]` method
        // https://tc39.github.io/ecma262/#sec-array.prototype-@@iterator
        // `CreateArrayIterator` internal method
        // https://tc39.github.io/ecma262/#sec-createarrayiterator
        module.exports = defineIterator(
          Array,
          "Array",
          function (iterated, kind) {
            setInternalState(this, {
              type: ARRAY_ITERATOR,
              target: toIndexedObject(iterated), // target
              index: 0, // next index
              kind: kind // kind
            });
            // `%ArrayIteratorPrototype%.next` method
            // https://tc39.github.io/ecma262/#sec-%arrayiteratorprototype%.next
          },
          function () {
            var state = getInternalState(this);
            var target = state.target;
            var kind = state.kind;
            var index = state.index++;
            if (!target || index >= target.length) {
              state.target = undefined;
              return { value: undefined, done: true };
            }
            if (kind == "keys") return { value: index, done: false };
            if (kind == "values") return { value: target[index], done: false };
            return { value: [index, target[index]], done: false };
          },
          "values"
        );

        // argumentsList[@@iterator] is %ArrayProto_values%
        // https://tc39.github.io/ecma262/#sec-createunmappedargumentsobject
        // https://tc39.github.io/ecma262/#sec-createmappedargumentsobject
        Iterators.Arguments = Iterators.Array;

        // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
        addToUnscopables("keys");
        addToUnscopables("values");
        addToUnscopables("entries");

        /***/
      },

      /***/ 7042: /***/ function (
        __unused_webpack_module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        "use strict";

        var $ = __webpack_require__(2109);
        var isObject = __webpack_require__(111);
        var isArray = __webpack_require__(3157);
        var toAbsoluteIndex = __webpack_require__(1400);
        var toLength = __webpack_require__(7466);
        var toIndexedObject = __webpack_require__(5656);
        var createProperty = __webpack_require__(6135);
        var wellKnownSymbol = __webpack_require__(5112);
        var arrayMethodHasSpeciesSupport = __webpack_require__(1194);
        var arrayMethodUsesToLength = __webpack_require__(9207);

        var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport("slice");
        var USES_TO_LENGTH = arrayMethodUsesToLength("slice", {
          ACCESSORS: true,
          0: 0,
          1: 2
        });

        var SPECIES = wellKnownSymbol("species");
        var nativeSlice = [].slice;
        var max = Math.max;

        // `Array.prototype.slice` method
        // https://tc39.github.io/ecma262/#sec-array.prototype.slice
        // fallback for not array-like ES3 strings and DOM objects
        $(
          {
            target: "Array",
            proto: true,
            forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH
          },
          {
            slice: function slice(start, end) {
              var O = toIndexedObject(this);
              var length = toLength(O.length);
              var k = toAbsoluteIndex(start, length);
              var fin = toAbsoluteIndex(
                end === undefined ? length : end,
                length
              );
              // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
              var Constructor, result, n;
              if (isArray(O)) {
                Constructor = O.constructor;
                // cross-realm fallback
                if (
                  typeof Constructor == "function" &&
                  (Constructor === Array || isArray(Constructor.prototype))
                ) {
                  Constructor = undefined;
                } else if (isObject(Constructor)) {
                  Constructor = Constructor[SPECIES];
                  if (Constructor === null) Constructor = undefined;
                }
                if (Constructor === Array || Constructor === undefined) {
                  return nativeSlice.call(O, k, fin);
                }
              }
              result = new (Constructor === undefined ? Array : Constructor)(
                max(fin - k, 0)
              );
              for (n = 0; k < fin; k++, n++)
                if (k in O) createProperty(result, n, O[k]);
              result.length = n;
              return result;
            }
          }
        );

        /***/
      },

      /***/ 3706: /***/ function (
        __unused_webpack_module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var global = __webpack_require__(7854);
        var setToStringTag = __webpack_require__(8003);

        // JSON[@@toStringTag] property
        // https://tc39.github.io/ecma262/#sec-json-@@tostringtag
        setToStringTag(global.JSON, "JSON", true);

        /***/
      },

      /***/ 1532: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        "use strict";

        var collection = __webpack_require__(7710);
        var collectionStrong = __webpack_require__(5631);

        // `Map` constructor
        // https://tc39.github.io/ecma262/#sec-map-objects
        module.exports = collection(
          "Map",
          function (init) {
            return function Map() {
              return init(this, arguments.length ? arguments[0] : undefined);
            };
          },
          collectionStrong
        );

        /***/
      },

      /***/ 408: /***/ function (
        __unused_webpack_module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var setToStringTag = __webpack_require__(8003);

        // Math[@@toStringTag] property
        // https://tc39.github.io/ecma262/#sec-math-@@tostringtag
        setToStringTag(Math, "Math", true);

        /***/
      },

      /***/ 9337: /***/ function (
        __unused_webpack_module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var $ = __webpack_require__(2109);
        var DESCRIPTORS = __webpack_require__(9781);
        var ownKeys = __webpack_require__(3887);
        var toIndexedObject = __webpack_require__(5656);
        var getOwnPropertyDescriptorModule = __webpack_require__(1236);
        var createProperty = __webpack_require__(6135);

        // `Object.getOwnPropertyDescriptors` method
        // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
        $(
          { target: "Object", stat: true, sham: !DESCRIPTORS },
          {
            getOwnPropertyDescriptors: function getOwnPropertyDescriptors(
              object
            ) {
              var O = toIndexedObject(object);
              var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
              var keys = ownKeys(O);
              var result = {};
              var index = 0;
              var key, descriptor;
              while (keys.length > index) {
                descriptor = getOwnPropertyDescriptor(O, (key = keys[index++]));
                if (descriptor !== undefined)
                  createProperty(result, key, descriptor);
              }
              return result;
            }
          }
        );

        /***/
      },

      /***/ 8674: /***/ function (
        __unused_webpack_module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        "use strict";

        var $ = __webpack_require__(2109);
        var IS_PURE = __webpack_require__(1913);
        var global = __webpack_require__(7854);
        var getBuiltIn = __webpack_require__(5005);
        var NativePromise = __webpack_require__(3366);
        var redefine = __webpack_require__(1320);
        var redefineAll = __webpack_require__(2248);
        var setToStringTag = __webpack_require__(8003);
        var setSpecies = __webpack_require__(6340);
        var isObject = __webpack_require__(111);
        var aFunction = __webpack_require__(3099);
        var anInstance = __webpack_require__(5787);
        var classof = __webpack_require__(4326);
        var inspectSource = __webpack_require__(2788);
        var iterate = __webpack_require__(612);
        var checkCorrectnessOfIteration = __webpack_require__(7072);
        var speciesConstructor = __webpack_require__(6707);
        var task = __webpack_require__(261).set;
        var microtask = __webpack_require__(5948);
        var promiseResolve = __webpack_require__(9478);
        var hostReportErrors = __webpack_require__(842);
        var newPromiseCapabilityModule = __webpack_require__(8523);
        var perform = __webpack_require__(2534);
        var InternalStateModule = __webpack_require__(9909);
        var isForced = __webpack_require__(4705);
        var wellKnownSymbol = __webpack_require__(5112);
        var V8_VERSION = __webpack_require__(7392);

        var SPECIES = wellKnownSymbol("species");
        var PROMISE = "Promise";
        var getInternalState = InternalStateModule.get;
        var setInternalState = InternalStateModule.set;
        var getInternalPromiseState = InternalStateModule.getterFor(PROMISE);
        var PromiseConstructor = NativePromise;
        var TypeError = global.TypeError;
        var document = global.document;
        var process = global.process;
        var $fetch = getBuiltIn("fetch");
        var newPromiseCapability = newPromiseCapabilityModule.f;
        var newGenericPromiseCapability = newPromiseCapability;
        var IS_NODE = classof(process) == "process";
        var DISPATCH_EVENT = !!(
          document &&
          document.createEvent &&
          global.dispatchEvent
        );
        var UNHANDLED_REJECTION = "unhandledrejection";
        var REJECTION_HANDLED = "rejectionhandled";
        var PENDING = 0;
        var FULFILLED = 1;
        var REJECTED = 2;
        var HANDLED = 1;
        var UNHANDLED = 2;
        var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

        var FORCED = isForced(PROMISE, function () {
          var GLOBAL_CORE_JS_PROMISE =
            inspectSource(PromiseConstructor) !== String(PromiseConstructor);
          if (!GLOBAL_CORE_JS_PROMISE) {
            // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
            // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
            // We can't detect it synchronously, so just check versions
            if (V8_VERSION === 66) return true;
            // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
            if (!IS_NODE && typeof PromiseRejectionEvent != "function")
              return true;
          }
          // We need Promise#finally in the pure version for preventing prototype pollution
          if (IS_PURE && !PromiseConstructor.prototype["finally"]) return true;
          // We can't use @@species feature detection in V8 since it causes
          // deoptimization and performance degradation
          // https://github.com/zloirock/core-js/issues/679
          if (V8_VERSION >= 51 && /native code/.test(PromiseConstructor))
            return false;
          // Detect correctness of subclassing with @@species support
          var promise = PromiseConstructor.resolve(1);
          var FakePromise = function (exec) {
            exec(
              function () {
                /* empty */
              },
              function () {
                /* empty */
              }
            );
          };
          var constructor = (promise.constructor = {});
          constructor[SPECIES] = FakePromise;
          return !(
            promise.then(function () {
              /* empty */
            }) instanceof FakePromise
          );
        });

        var INCORRECT_ITERATION =
          FORCED ||
          !checkCorrectnessOfIteration(function (iterable) {
            PromiseConstructor.all(iterable)["catch"](function () {
              /* empty */
            });
          });

        // helpers
        var isThenable = function (it) {
          var then;
          return isObject(it) && typeof (then = it.then) == "function"
            ? then
            : false;
        };

        var notify = function (promise, state, isReject) {
          if (state.notified) return;
          state.notified = true;
          var chain = state.reactions;
          microtask(function () {
            var value = state.value;
            var ok = state.state == FULFILLED;
            var index = 0;
            // variable length - can't use forEach
            while (chain.length > index) {
              var reaction = chain[index++];
              var handler = ok ? reaction.ok : reaction.fail;
              var resolve = reaction.resolve;
              var reject = reaction.reject;
              var domain = reaction.domain;
              var result, then, exited;
              try {
                if (handler) {
                  if (!ok) {
                    if (state.rejection === UNHANDLED)
                      onHandleUnhandled(promise, state);
                    state.rejection = HANDLED;
                  }
                  if (handler === true) result = value;
                  else {
                    if (domain) domain.enter();
                    result = handler(value); // can throw
                    if (domain) {
                      domain.exit();
                      exited = true;
                    }
                  }
                  if (result === reaction.promise) {
                    reject(TypeError("Promise-chain cycle"));
                  } else if ((then = isThenable(result))) {
                    then.call(result, resolve, reject);
                  } else resolve(result);
                } else reject(value);
              } catch (error) {
                if (domain && !exited) domain.exit();
                reject(error);
              }
            }
            state.reactions = [];
            state.notified = false;
            if (isReject && !state.rejection) onUnhandled(promise, state);
          });
        };

        var dispatchEvent = function (name, promise, reason) {
          var event, handler;
          if (DISPATCH_EVENT) {
            event = document.createEvent("Event");
            event.promise = promise;
            event.reason = reason;
            event.initEvent(name, false, true);
            global.dispatchEvent(event);
          } else event = { promise: promise, reason: reason };
          if ((handler = global["on" + name])) handler(event);
          else if (name === UNHANDLED_REJECTION)
            hostReportErrors("Unhandled promise rejection", reason);
        };

        var onUnhandled = function (promise, state) {
          task.call(global, function () {
            var value = state.value;
            var IS_UNHANDLED = isUnhandled(state);
            var result;
            if (IS_UNHANDLED) {
              result = perform(function () {
                if (IS_NODE) {
                  process.emit("unhandledRejection", value, promise);
                } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
              });
              // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
              state.rejection =
                IS_NODE || isUnhandled(state) ? UNHANDLED : HANDLED;
              if (result.error) throw result.value;
            }
          });
        };

        var isUnhandled = function (state) {
          return state.rejection !== HANDLED && !state.parent;
        };

        var onHandleUnhandled = function (promise, state) {
          task.call(global, function () {
            if (IS_NODE) {
              process.emit("rejectionHandled", promise);
            } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
          });
        };

        var bind = function (fn, promise, state, unwrap) {
          return function (value) {
            fn(promise, state, value, unwrap);
          };
        };

        var internalReject = function (promise, state, value, unwrap) {
          if (state.done) return;
          state.done = true;
          if (unwrap) state = unwrap;
          state.value = value;
          state.state = REJECTED;
          notify(promise, state, true);
        };

        var internalResolve = function (promise, state, value, unwrap) {
          if (state.done) return;
          state.done = true;
          if (unwrap) state = unwrap;
          try {
            if (promise === value)
              throw TypeError("Promise can't be resolved itself");
            var then = isThenable(value);
            if (then) {
              microtask(function () {
                var wrapper = { done: false };
                try {
                  then.call(
                    value,
                    bind(internalResolve, promise, wrapper, state),
                    bind(internalReject, promise, wrapper, state)
                  );
                } catch (error) {
                  internalReject(promise, wrapper, error, state);
                }
              });
            } else {
              state.value = value;
              state.state = FULFILLED;
              notify(promise, state, false);
            }
          } catch (error) {
            internalReject(promise, { done: false }, error, state);
          }
        };

        // constructor polyfill
        if (FORCED) {
          // 25.4.3.1 Promise(executor)
          PromiseConstructor = function Promise(executor) {
            anInstance(this, PromiseConstructor, PROMISE);
            aFunction(executor);
            Internal.call(this);
            var state = getInternalState(this);
            try {
              executor(
                bind(internalResolve, this, state),
                bind(internalReject, this, state)
              );
            } catch (error) {
              internalReject(this, state, error);
            }
          };
          // eslint-disable-next-line no-unused-vars
          Internal = function Promise(executor) {
            setInternalState(this, {
              type: PROMISE,
              done: false,
              notified: false,
              parent: false,
              reactions: [],
              rejection: false,
              state: PENDING,
              value: undefined
            });
          };
          Internal.prototype = redefineAll(PromiseConstructor.prototype, {
            // `Promise.prototype.then` method
            // https://tc39.github.io/ecma262/#sec-promise.prototype.then
            then: function then(onFulfilled, onRejected) {
              var state = getInternalPromiseState(this);
              var reaction = newPromiseCapability(
                speciesConstructor(this, PromiseConstructor)
              );
              reaction.ok =
                typeof onFulfilled == "function" ? onFulfilled : true;
              reaction.fail = typeof onRejected == "function" && onRejected;
              reaction.domain = IS_NODE ? process.domain : undefined;
              state.parent = true;
              state.reactions.push(reaction);
              if (state.state != PENDING) notify(this, state, false);
              return reaction.promise;
            },
            // `Promise.prototype.catch` method
            // https://tc39.github.io/ecma262/#sec-promise.prototype.catch
            catch: function (onRejected) {
              return this.then(undefined, onRejected);
            }
          });
          OwnPromiseCapability = function () {
            var promise = new Internal();
            var state = getInternalState(promise);
            this.promise = promise;
            this.resolve = bind(internalResolve, promise, state);
            this.reject = bind(internalReject, promise, state);
          };
          newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
            return C === PromiseConstructor || C === PromiseWrapper
              ? new OwnPromiseCapability(C)
              : newGenericPromiseCapability(C);
          };

          if (!IS_PURE && typeof NativePromise == "function") {
            nativeThen = NativePromise.prototype.then;

            // wrap native Promise#then for native async functions
            redefine(
              NativePromise.prototype,
              "then",
              function then(onFulfilled, onRejected) {
                var that = this;
                return new PromiseConstructor(function (resolve, reject) {
                  nativeThen.call(that, resolve, reject);
                }).then(onFulfilled, onRejected);
                // https://github.com/zloirock/core-js/issues/640
              },
              { unsafe: true }
            );

            // wrap fetch result
            if (typeof $fetch == "function")
              $(
                { global: true, enumerable: true, forced: true },
                {
                  // eslint-disable-next-line no-unused-vars
                  fetch: function fetch(input /* , init */) {
                    return promiseResolve(
                      PromiseConstructor,
                      $fetch.apply(global, arguments)
                    );
                  }
                }
              );
          }
        }

        $(
          { global: true, wrap: true, forced: FORCED },
          {
            Promise: PromiseConstructor
          }
        );

        setToStringTag(PromiseConstructor, PROMISE, false, true);
        setSpecies(PROMISE);

        PromiseWrapper = getBuiltIn(PROMISE);

        // statics
        $(
          { target: PROMISE, stat: true, forced: FORCED },
          {
            // `Promise.reject` method
            // https://tc39.github.io/ecma262/#sec-promise.reject
            reject: function reject(r) {
              var capability = newPromiseCapability(this);
              capability.reject.call(undefined, r);
              return capability.promise;
            }
          }
        );

        $(
          { target: PROMISE, stat: true, forced: IS_PURE || FORCED },
          {
            // `Promise.resolve` method
            // https://tc39.github.io/ecma262/#sec-promise.resolve
            resolve: function resolve(x) {
              return promiseResolve(
                IS_PURE && this === PromiseWrapper ? PromiseConstructor : this,
                x
              );
            }
          }
        );

        $(
          { target: PROMISE, stat: true, forced: INCORRECT_ITERATION },
          {
            // `Promise.all` method
            // https://tc39.github.io/ecma262/#sec-promise.all
            all: function all(iterable) {
              var C = this;
              var capability = newPromiseCapability(C);
              var resolve = capability.resolve;
              var reject = capability.reject;
              var result = perform(function () {
                var $promiseResolve = aFunction(C.resolve);
                var values = [];
                var counter = 0;
                var remaining = 1;
                iterate(iterable, function (promise) {
                  var index = counter++;
                  var alreadyCalled = false;
                  values.push(undefined);
                  remaining++;
                  $promiseResolve.call(C, promise).then(function (value) {
                    if (alreadyCalled) return;
                    alreadyCalled = true;
                    values[index] = value;
                    --remaining || resolve(values);
                  }, reject);
                });
                --remaining || resolve(values);
              });
              if (result.error) reject(result.value);
              return capability.promise;
            },
            // `Promise.race` method
            // https://tc39.github.io/ecma262/#sec-promise.race
            race: function race(iterable) {
              var C = this;
              var capability = newPromiseCapability(C);
              var reject = capability.reject;
              var result = perform(function () {
                var $promiseResolve = aFunction(C.resolve);
                iterate(iterable, function (promise) {
                  $promiseResolve
                    .call(C, promise)
                    .then(capability.resolve, reject);
                });
              });
              if (result.error) reject(result.value);
              return capability.promise;
            }
          }
        );

        /***/
      },

      /***/ 9714: /***/ function (
        __unused_webpack_module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        "use strict";

        var redefine = __webpack_require__(1320);
        var anObject = __webpack_require__(9670);
        var fails = __webpack_require__(7293);
        var flags = __webpack_require__(7066);

        var TO_STRING = "toString";
        var RegExpPrototype = RegExp.prototype;
        var nativeToString = RegExpPrototype[TO_STRING];

        var NOT_GENERIC = fails(function () {
          return nativeToString.call({ source: "a", flags: "b" }) != "/a/b";
        });
        // FF44- RegExp#toString has a wrong name
        var INCORRECT_NAME = nativeToString.name != TO_STRING;

        // `RegExp.prototype.toString` method
        // https://tc39.github.io/ecma262/#sec-regexp.prototype.tostring
        if (NOT_GENERIC || INCORRECT_NAME) {
          redefine(
            RegExp.prototype,
            TO_STRING,
            function toString() {
              var R = anObject(this);
              var p = String(R.source);
              var rf = R.flags;
              var f = String(
                rf === undefined &&
                  R instanceof RegExp &&
                  !("flags" in RegExpPrototype)
                  ? flags.call(R)
                  : rf
              );
              return "/" + p + "/" + f;
            },
            { unsafe: true }
          );
        }

        /***/
      },

      /***/ 2443: /***/ function (
        __unused_webpack_module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var defineWellKnownSymbol = __webpack_require__(7235);

        // `Symbol.asyncIterator` well-known symbol
        // https://tc39.github.io/ecma262/#sec-symbol.asynciterator
        defineWellKnownSymbol("asyncIterator");

        /***/
      },

      /***/ 1817: /***/ function (
        __unused_webpack_module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        "use strict";
        // `Symbol.prototype.description` getter
        // https://tc39.github.io/ecma262/#sec-symbol.prototype.description

        var $ = __webpack_require__(2109);
        var DESCRIPTORS = __webpack_require__(9781);
        var global = __webpack_require__(7854);
        var has = __webpack_require__(6656);
        var isObject = __webpack_require__(111);
        var defineProperty = __webpack_require__(3070).f;
        var copyConstructorProperties = __webpack_require__(9920);

        var NativeSymbol = global.Symbol;

        if (
          DESCRIPTORS &&
          typeof NativeSymbol == "function" &&
          (!("description" in NativeSymbol.prototype) ||
            // Safari 12 bug
            NativeSymbol().description !== undefined)
        ) {
          var EmptyStringDescriptionStore = {};
          // wrap Symbol constructor for correct work with undefined description
          var SymbolWrapper = function Symbol() {
            var description =
              arguments.length < 1 || arguments[0] === undefined
                ? undefined
                : String(arguments[0]);
            var result =
              this instanceof SymbolWrapper
                ? new NativeSymbol(description)
                : // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
                description === undefined
                ? NativeSymbol()
                : NativeSymbol(description);
            if (description === "") EmptyStringDescriptionStore[result] = true;
            return result;
          };
          copyConstructorProperties(SymbolWrapper, NativeSymbol);
          var symbolPrototype = (SymbolWrapper.prototype =
            NativeSymbol.prototype);
          symbolPrototype.constructor = SymbolWrapper;

          var symbolToString = symbolPrototype.toString;
          var native = String(NativeSymbol("test")) == "Symbol(test)";
          var regexp = /^Symbol\((.*)\)[^)]+$/;
          defineProperty(symbolPrototype, "description", {
            configurable: true,
            get: function description() {
              var symbol = isObject(this) ? this.valueOf() : this;
              var string = symbolToString.call(symbol);
              if (has(EmptyStringDescriptionStore, symbol)) return "";
              var desc = native
                ? string.slice(7, -1)
                : string.replace(regexp, "$1");
              return desc === "" ? undefined : desc;
            }
          });

          $(
            { global: true, forced: true },
            {
              Symbol: SymbolWrapper
            }
          );
        }

        /***/
      },

      /***/ 4747: /***/ function (
        __unused_webpack_module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var global = __webpack_require__(7854);
        var DOMIterables = __webpack_require__(8324);
        var forEach = __webpack_require__(8533);
        var createNonEnumerableProperty = __webpack_require__(8880);

        for (var COLLECTION_NAME in DOMIterables) {
          var Collection = global[COLLECTION_NAME];
          var CollectionPrototype = Collection && Collection.prototype;
          // some Chrome versions have non-configurable methods on DOMTokenList
          if (CollectionPrototype && CollectionPrototype.forEach !== forEach)
            try {
              createNonEnumerableProperty(
                CollectionPrototype,
                "forEach",
                forEach
              );
            } catch (error) {
              CollectionPrototype.forEach = forEach;
            }
        }

        /***/
      },

      /***/ 3948: /***/ function (
        __unused_webpack_module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var global = __webpack_require__(7854);
        var DOMIterables = __webpack_require__(8324);
        var ArrayIteratorMethods = __webpack_require__(6992);
        var createNonEnumerableProperty = __webpack_require__(8880);
        var wellKnownSymbol = __webpack_require__(5112);

        var ITERATOR = wellKnownSymbol("iterator");
        var TO_STRING_TAG = wellKnownSymbol("toStringTag");
        var ArrayValues = ArrayIteratorMethods.values;

        for (var COLLECTION_NAME in DOMIterables) {
          var Collection = global[COLLECTION_NAME];
          var CollectionPrototype = Collection && Collection.prototype;
          if (CollectionPrototype) {
            // some Chrome versions have non-configurable methods on DOMTokenList
            if (CollectionPrototype[ITERATOR] !== ArrayValues)
              try {
                createNonEnumerableProperty(
                  CollectionPrototype,
                  ITERATOR,
                  ArrayValues
                );
              } catch (error) {
                CollectionPrototype[ITERATOR] = ArrayValues;
              }
            if (!CollectionPrototype[TO_STRING_TAG]) {
              createNonEnumerableProperty(
                CollectionPrototype,
                TO_STRING_TAG,
                COLLECTION_NAME
              );
            }
            if (DOMIterables[COLLECTION_NAME])
              for (var METHOD_NAME in ArrayIteratorMethods) {
                // some Chrome versions have non-configurable methods on DOMTokenList
                if (
                  CollectionPrototype[METHOD_NAME] !==
                  ArrayIteratorMethods[METHOD_NAME]
                )
                  try {
                    createNonEnumerableProperty(
                      CollectionPrototype,
                      METHOD_NAME,
                      ArrayIteratorMethods[METHOD_NAME]
                    );
                  } catch (error) {
                    CollectionPrototype[METHOD_NAME] =
                      ArrayIteratorMethods[METHOD_NAME];
                  }
              }
          }
        }

        /***/
      }

      /******/
    };
    /************************************************************************/
    /******/ // The module cache
    /******/ var __webpack_module_cache__ = {};
    /******/
    /******/ // The require function
    /******/ function __webpack_require__(moduleId) {
      /******/ // Check if module is in cache
      /******/ var cachedModule = __webpack_module_cache__[moduleId];
      /******/ if (cachedModule !== undefined) {
        /******/ return cachedModule.exports;
        /******/
      }
      /******/ // Create a new module (and put it into the cache)
      /******/ var module = (__webpack_module_cache__[moduleId] = {
        /******/ // no module.id needed
        /******/ // no module.loaded needed
        /******/ exports: {}
        /******/
      });
      /******/
      /******/ // Execute the module function
      /******/ __webpack_modules__[moduleId](
        module,
        module.exports,
        __webpack_require__
      );
      /******/
      /******/ // Return the exports of the module
      /******/ return module.exports;
      /******/
    }
    /******/
    /************************************************************************/
    /******/ /* webpack/runtime/define property getters */ /******/ !(function () {
      /******/ // define getter functions for harmony exports
      /******/ __webpack_require__.d = function (exports, definition) {
        /******/ for (var key in definition) {
          /******/ if (
            __webpack_require__.o(definition, key) &&
            !__webpack_require__.o(exports, key)
          ) {
            /******/ Object.defineProperty(exports, key, {
              enumerable: true,
              get: definition[key]
            });
            /******/
          }
          /******/
        }
        /******/
      };
      /******/
    })();
    /******/
    /******/ /* webpack/runtime/global */ /******/ !(function () {
      /******/ __webpack_require__.g = (function () {
        /******/ if (typeof globalThis === "object") return globalThis;
        /******/ try {
          /******/ return this || new Function("return this")();
          /******/
        } catch (e) {
          /******/ if (typeof window === "object") return window;
          /******/
        }
        /******/
      })();
      /******/
    })();
    /******/
    /******/ /* webpack/runtime/hasOwnProperty shorthand */ /******/ !(function () {
      /******/ __webpack_require__.o = function (obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
      };
      /******/
    })();
    /******/
    /******/ /* webpack/runtime/make namespace object */ /******/ !(function () {
      /******/ // define __esModule on exports
      /******/ __webpack_require__.r = function (exports) {
        /******/ if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
          /******/ Object.defineProperty(exports, Symbol.toStringTag, {
            value: "Module"
          });
          /******/
        }
        /******/ Object.defineProperty(exports, "__esModule", { value: true });
        /******/
      };
      /******/
    })();
    /******/
    /************************************************************************/
    var __webpack_exports__ = {};
    // This entry need to be wrapped in an IIFE because it need to be in strict mode.
    !(function () {
      "use strict";
      // ESM COMPAT FLAG
      __webpack_require__.r(__webpack_exports__);

      // EXPORTS
      __webpack_require__.d(__webpack_exports__, {
        default: function () {
          return /* binding */ src;
        },
        initCapture: function () {
          return /* binding */ initCapture;
        }
      });

      // EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.filter.js
      var es_array_filter = __webpack_require__(7327);
      // EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom-collections.for-each.js
      var web_dom_collections_for_each = __webpack_require__(4747);
      // EXTERNAL MODULE: ./node_modules/core-js/modules/es.object.get-own-property-descriptors.js
      var es_object_get_own_property_descriptors = __webpack_require__(9337);
      // EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.index-of.js
      var es_array_index_of = __webpack_require__(2772);
      // EXTERNAL MODULE: ./node_modules/core-js/modules/es.symbol.description.js
      var es_symbol_description = __webpack_require__(1817);
      // EXTERNAL MODULE: ./node_modules/core-js/modules/es.symbol.async-iterator.js
      var es_symbol_async_iterator = __webpack_require__(2443);
      // EXTERNAL MODULE: ./node_modules/core-js/modules/es.json.to-string-tag.js
      var es_json_to_string_tag = __webpack_require__(3706);
      // EXTERNAL MODULE: ./node_modules/core-js/modules/es.math.to-string-tag.js
      var es_math_to_string_tag = __webpack_require__(408);
      // EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.slice.js
      var es_array_slice = __webpack_require__(7042);
      // EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.iterator.js
      var es_array_iterator = __webpack_require__(6992);
      // EXTERNAL MODULE: ./node_modules/core-js/modules/es.map.js
      var es_map = __webpack_require__(1532);
      // EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom-collections.iterator.js
      var web_dom_collections_iterator = __webpack_require__(3948);
      // EXTERNAL MODULE: ./node_modules/core-js/modules/es.regexp.to-string.js
      var es_regexp_to_string = __webpack_require__(9714);
      // EXTERNAL MODULE: ./node_modules/core-js/modules/es.promise.js
      var es_promise = __webpack_require__(8674); // CONCATENATED MODULE: ./src/consts.ts
      const Events = {
        startCapture: "startCapture",
        receiveImageOnchange: "receiveImageOnchange",
        receiveImageOnSuccess: "receiveImageOnSuccess",
        receiveError: "receiveError"
      }; // CONCATENATED MODULE: ./src/index.ts
      const _excluded = ["info", "path", "file"];
      function _regeneratorRuntime() {
        "use strict";
        /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime =
          function _regeneratorRuntime() {
            return exports;
          };
        var exports = {},
          Op = Object.prototype,
          hasOwn = Op.hasOwnProperty,
          defineProperty =
            Object.defineProperty ||
            function (obj, key, desc) {
              obj[key] = desc.value;
            },
          $Symbol = "function" == typeof Symbol ? Symbol : {},
          iteratorSymbol = $Symbol.iterator || "@@iterator",
          asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
          toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
        function define(obj, key, value) {
          return (
            Object.defineProperty(obj, key, {
              value: value,
              enumerable: !0,
              configurable: !0,
              writable: !0
            }),
            obj[key]
          );
        }
        try {
          define({}, "");
        } catch (err) {
          define = function define(obj, key, value) {
            return (obj[key] = value);
          };
        }
        function wrap(innerFn, outerFn, self, tryLocsList) {
          var protoGenerator =
              outerFn && outerFn.prototype instanceof Generator
                ? outerFn
                : Generator,
            generator = Object.create(protoGenerator.prototype),
            context = new Context(tryLocsList || []);
          return (
            defineProperty(generator, "_invoke", {
              value: makeInvokeMethod(innerFn, self, context)
            }),
            generator
          );
        }
        function tryCatch(fn, obj, arg) {
          try {
            return { type: "normal", arg: fn.call(obj, arg) };
          } catch (err) {
            return { type: "throw", arg: err };
          }
        }
        exports.wrap = wrap;
        var ContinueSentinel = {};
        function Generator() {}
        function GeneratorFunction() {}
        function GeneratorFunctionPrototype() {}
        var IteratorPrototype = {};
        define(IteratorPrototype, iteratorSymbol, function () {
          return this;
        });
        var getProto = Object.getPrototypeOf,
          NativeIteratorPrototype = getProto && getProto(getProto(values([])));
        NativeIteratorPrototype &&
          NativeIteratorPrototype !== Op &&
          hasOwn.call(NativeIteratorPrototype, iteratorSymbol) &&
          (IteratorPrototype = NativeIteratorPrototype);
        var Gp =
          (GeneratorFunctionPrototype.prototype =
          Generator.prototype =
            Object.create(IteratorPrototype));
        function defineIteratorMethods(prototype) {
          ["next", "throw", "return"].forEach(function (method) {
            define(prototype, method, function (arg) {
              return this._invoke(method, arg);
            });
          });
        }
        function AsyncIterator(generator, PromiseImpl) {
          function invoke(method, arg, resolve, reject) {
            var record = tryCatch(generator[method], generator, arg);
            if ("throw" !== record.type) {
              var result = record.arg,
                value = result.value;
              return value &&
                "object" == typeof value &&
                hasOwn.call(value, "__await")
                ? PromiseImpl.resolve(value.__await).then(
                    function (value) {
                      invoke("next", value, resolve, reject);
                    },
                    function (err) {
                      invoke("throw", err, resolve, reject);
                    }
                  )
                : PromiseImpl.resolve(value).then(
                    function (unwrapped) {
                      (result.value = unwrapped), resolve(result);
                    },
                    function (error) {
                      return invoke("throw", error, resolve, reject);
                    }
                  );
            }
            reject(record.arg);
          }
          var previousPromise;
          defineProperty(this, "_invoke", {
            value: function value(method, arg) {
              function callInvokeWithMethodAndArg() {
                return new PromiseImpl(function (resolve, reject) {
                  invoke(method, arg, resolve, reject);
                });
              }
              return (previousPromise = previousPromise
                ? previousPromise.then(
                    callInvokeWithMethodAndArg,
                    callInvokeWithMethodAndArg
                  )
                : callInvokeWithMethodAndArg());
            }
          });
        }
        function makeInvokeMethod(innerFn, self, context) {
          var state = "suspendedStart";
          return function (method, arg) {
            if ("executing" === state)
              throw new Error("Generator is already running");
            if ("completed" === state) {
              if ("throw" === method) throw arg;
              return doneResult();
            }
            for (context.method = method, context.arg = arg; ; ) {
              var delegate = context.delegate;
              if (delegate) {
                var delegateResult = maybeInvokeDelegate(delegate, context);
                if (delegateResult) {
                  if (delegateResult === ContinueSentinel) continue;
                  return delegateResult;
                }
              }
              if ("next" === context.method)
                context.sent = context._sent = context.arg;
              else if ("throw" === context.method) {
                if ("suspendedStart" === state)
                  throw ((state = "completed"), context.arg);
                context.dispatchException(context.arg);
              } else
                "return" === context.method &&
                  context.abrupt("return", context.arg);
              state = "executing";
              var record = tryCatch(innerFn, self, context);
              if ("normal" === record.type) {
                if (
                  ((state = context.done ? "completed" : "suspendedYield"),
                  record.arg === ContinueSentinel)
                )
                  continue;
                return { value: record.arg, done: context.done };
              }
              "throw" === record.type &&
                ((state = "completed"),
                (context.method = "throw"),
                (context.arg = record.arg));
            }
          };
        }
        function maybeInvokeDelegate(delegate, context) {
          var method = delegate.iterator[context.method];
          if (undefined === method) {
            if (((context.delegate = null), "throw" === context.method)) {
              if (
                delegate.iterator.return &&
                ((context.method = "return"),
                (context.arg = undefined),
                maybeInvokeDelegate(delegate, context),
                "throw" === context.method)
              )
                return ContinueSentinel;
              (context.method = "throw"),
                (context.arg = new TypeError(
                  "The iterator does not provide a 'throw' method"
                ));
            }
            return ContinueSentinel;
          }
          var record = tryCatch(method, delegate.iterator, context.arg);
          if ("throw" === record.type)
            return (
              (context.method = "throw"),
              (context.arg = record.arg),
              (context.delegate = null),
              ContinueSentinel
            );
          var info = record.arg;
          return info
            ? info.done
              ? ((context[delegate.resultName] = info.value),
                (context.next = delegate.nextLoc),
                "return" !== context.method &&
                  ((context.method = "next"), (context.arg = undefined)),
                (context.delegate = null),
                ContinueSentinel)
              : info
            : ((context.method = "throw"),
              (context.arg = new TypeError("iterator result is not an object")),
              (context.delegate = null),
              ContinueSentinel);
        }
        function pushTryEntry(locs) {
          var entry = { tryLoc: locs[0] };
          1 in locs && (entry.catchLoc = locs[1]),
            2 in locs &&
              ((entry.finallyLoc = locs[2]), (entry.afterLoc = locs[3])),
            this.tryEntries.push(entry);
        }
        function resetTryEntry(entry) {
          var record = entry.completion || {};
          (record.type = "normal"),
            delete record.arg,
            (entry.completion = record);
        }
        function Context(tryLocsList) {
          (this.tryEntries = [{ tryLoc: "root" }]),
            tryLocsList.forEach(pushTryEntry, this),
            this.reset(!0);
        }
        function values(iterable) {
          if (iterable) {
            var iteratorMethod = iterable[iteratorSymbol];
            if (iteratorMethod) return iteratorMethod.call(iterable);
            if ("function" == typeof iterable.next) return iterable;
            if (!isNaN(iterable.length)) {
              var i = -1,
                next = function next() {
                  for (; ++i < iterable.length; )
                    if (hasOwn.call(iterable, i))
                      return (next.value = iterable[i]), (next.done = !1), next;
                  return (next.value = undefined), (next.done = !0), next;
                };
              return (next.next = next);
            }
          }
          return { next: doneResult };
        }
        function doneResult() {
          return { value: undefined, done: !0 };
        }
        return (
          (GeneratorFunction.prototype = GeneratorFunctionPrototype),
          defineProperty(Gp, "constructor", {
            value: GeneratorFunctionPrototype,
            configurable: !0
          }),
          defineProperty(GeneratorFunctionPrototype, "constructor", {
            value: GeneratorFunction,
            configurable: !0
          }),
          (GeneratorFunction.displayName = define(
            GeneratorFunctionPrototype,
            toStringTagSymbol,
            "GeneratorFunction"
          )),
          (exports.isGeneratorFunction = function (genFun) {
            var ctor = "function" == typeof genFun && genFun.constructor;
            return (
              !!ctor &&
              (ctor === GeneratorFunction ||
                "GeneratorFunction" === (ctor.displayName || ctor.name))
            );
          }),
          (exports.mark = function (genFun) {
            return (
              Object.setPrototypeOf
                ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype)
                : ((genFun.__proto__ = GeneratorFunctionPrototype),
                  define(genFun, toStringTagSymbol, "GeneratorFunction")),
              (genFun.prototype = Object.create(Gp)),
              genFun
            );
          }),
          (exports.awrap = function (arg) {
            return { __await: arg };
          }),
          defineIteratorMethods(AsyncIterator.prototype),
          define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
            return this;
          }),
          (exports.AsyncIterator = AsyncIterator),
          (exports.async = function (
            innerFn,
            outerFn,
            self,
            tryLocsList,
            PromiseImpl
          ) {
            void 0 === PromiseImpl && (PromiseImpl = Promise);
            var iter = new AsyncIterator(
              wrap(innerFn, outerFn, self, tryLocsList),
              PromiseImpl
            );
            return exports.isGeneratorFunction(outerFn)
              ? iter
              : iter.next().then(function (result) {
                  return result.done ? result.value : iter.next();
                });
          }),
          defineIteratorMethods(Gp),
          define(Gp, toStringTagSymbol, "Generator"),
          define(Gp, iteratorSymbol, function () {
            return this;
          }),
          define(Gp, "toString", function () {
            return "[object Generator]";
          }),
          (exports.keys = function (val) {
            var object = Object(val),
              keys = [];
            for (var key in object) keys.push(key);
            return (
              keys.reverse(),
              function next() {
                for (; keys.length; ) {
                  var key = keys.pop();
                  if (key in object)
                    return (next.value = key), (next.done = !1), next;
                }
                return (next.done = !0), next;
              }
            );
          }),
          (exports.values = values),
          (Context.prototype = {
            constructor: Context,
            reset: function reset(skipTempReset) {
              if (
                ((this.prev = 0),
                (this.next = 0),
                (this.sent = this._sent = undefined),
                (this.done = !1),
                (this.delegate = null),
                (this.method = "next"),
                (this.arg = undefined),
                this.tryEntries.forEach(resetTryEntry),
                !skipTempReset)
              )
                for (var name in this)
                  "t" === name.charAt(0) &&
                    hasOwn.call(this, name) &&
                    !isNaN(+name.slice(1)) &&
                    (this[name] = undefined);
            },
            stop: function stop() {
              this.done = !0;
              var rootRecord = this.tryEntries[0].completion;
              if ("throw" === rootRecord.type) throw rootRecord.arg;
              return this.rval;
            },
            dispatchException: function dispatchException(exception) {
              if (this.done) throw exception;
              var context = this;
              function handle(loc, caught) {
                return (
                  (record.type = "throw"),
                  (record.arg = exception),
                  (context.next = loc),
                  caught &&
                    ((context.method = "next"), (context.arg = undefined)),
                  !!caught
                );
              }
              for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                var entry = this.tryEntries[i],
                  record = entry.completion;
                if ("root" === entry.tryLoc) return handle("end");
                if (entry.tryLoc <= this.prev) {
                  var hasCatch = hasOwn.call(entry, "catchLoc"),
                    hasFinally = hasOwn.call(entry, "finallyLoc");
                  if (hasCatch && hasFinally) {
                    if (this.prev < entry.catchLoc)
                      return handle(entry.catchLoc, !0);
                    if (this.prev < entry.finallyLoc)
                      return handle(entry.finallyLoc);
                  } else if (hasCatch) {
                    if (this.prev < entry.catchLoc)
                      return handle(entry.catchLoc, !0);
                  } else {
                    if (!hasFinally)
                      throw new Error("try statement without catch or finally");
                    if (this.prev < entry.finallyLoc)
                      return handle(entry.finallyLoc);
                  }
                }
              }
            },
            abrupt: function abrupt(type, arg) {
              for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                var entry = this.tryEntries[i];
                if (
                  entry.tryLoc <= this.prev &&
                  hasOwn.call(entry, "finallyLoc") &&
                  this.prev < entry.finallyLoc
                ) {
                  var finallyEntry = entry;
                  break;
                }
              }
              finallyEntry &&
                ("break" === type || "continue" === type) &&
                finallyEntry.tryLoc <= arg &&
                arg <= finallyEntry.finallyLoc &&
                (finallyEntry = null);
              var record = finallyEntry ? finallyEntry.completion : {};
              return (
                (record.type = type),
                (record.arg = arg),
                finallyEntry
                  ? ((this.method = "next"),
                    (this.next = finallyEntry.finallyLoc),
                    ContinueSentinel)
                  : this.complete(record)
              );
            },
            complete: function complete(record, afterLoc) {
              if ("throw" === record.type) throw record.arg;
              return (
                "break" === record.type || "continue" === record.type
                  ? (this.next = record.arg)
                  : "return" === record.type
                  ? ((this.rval = this.arg = record.arg),
                    (this.method = "return"),
                    (this.next = "end"))
                  : "normal" === record.type &&
                    afterLoc &&
                    (this.next = afterLoc),
                ContinueSentinel
              );
            },
            finish: function finish(finallyLoc) {
              for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                var entry = this.tryEntries[i];
                if (entry.finallyLoc === finallyLoc)
                  return (
                    this.complete(entry.completion, entry.afterLoc),
                    resetTryEntry(entry),
                    ContinueSentinel
                  );
              }
            },
            catch: function _catch(tryLoc) {
              for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                var entry = this.tryEntries[i];
                if (entry.tryLoc === tryLoc) {
                  var record = entry.completion;
                  if ("throw" === record.type) {
                    var thrown = record.arg;
                    resetTryEntry(entry);
                  }
                  return thrown;
                }
              }
              throw new Error("illegal catch attempt");
            },
            delegateYield: function delegateYield(
              iterable,
              resultName,
              nextLoc
            ) {
              return (
                (this.delegate = {
                  iterator: values(iterable),
                  resultName: resultName,
                  nextLoc: nextLoc
                }),
                "next" === this.method && (this.arg = undefined),
                ContinueSentinel
              );
            }
          }),
          exports
        );
      }
      function _objectWithoutProperties(source, excluded) {
        if (source == null) return {};
        var target = _objectWithoutPropertiesLoose(source, excluded);
        var key, i;
        if (Object.getOwnPropertySymbols) {
          var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
          for (i = 0; i < sourceSymbolKeys.length; i++) {
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key))
              continue;
            target[key] = source[key];
          }
        }
        return target;
      }
      function _objectWithoutPropertiesLoose(source, excluded) {
        if (source == null) return {};
        var target = {};
        var sourceKeys = Object.keys(source);
        var key, i;
        for (i = 0; i < sourceKeys.length; i++) {
          key = sourceKeys[i];
          if (excluded.indexOf(key) >= 0) continue;
          target[key] = source[key];
        }
        return target;
      }

      function asyncGeneratorStep(
        gen,
        resolve,
        reject,
        _next,
        _throw,
        key,
        arg
      ) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }
        if (info.done) {
          resolve(value);
        } else {
          Promise.resolve(value).then(_next, _throw);
        }
      }
      function _asyncToGenerator(fn) {
        return function () {
          var self = this,
            args = arguments;
          return new Promise(function (resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
              asyncGeneratorStep(
                gen,
                resolve,
                reject,
                _next,
                _throw,
                "next",
                value
              );
            }
            function _throw(err) {
              asyncGeneratorStep(
                gen,
                resolve,
                reject,
                _next,
                _throw,
                "throw",
                err
              );
            }
            _next(undefined);
          });
        };
      }
      function ownKeys(object, enumerableOnly) {
        var keys = Object.keys(object);
        if (Object.getOwnPropertySymbols) {
          var symbols = Object.getOwnPropertySymbols(object);
          enumerableOnly &&
            (symbols = symbols.filter(function (sym) {
              return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            })),
            keys.push.apply(keys, symbols);
        }
        return keys;
      }
      function _objectSpread(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = null != arguments[i] ? arguments[i] : {};
          i % 2
            ? ownKeys(Object(source), !0).forEach(function (key) {
                _defineProperty(target, key, source[key]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(
                target,
                Object.getOwnPropertyDescriptors(source)
              )
            : ownKeys(Object(source)).forEach(function (key) {
                Object.defineProperty(
                  target,
                  key,
                  Object.getOwnPropertyDescriptor(source, key)
                );
              });
        }
        return target;
      }
      function _defineProperty(obj, key, value) {
        if (key in obj) {
          Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
          });
        } else {
          obj[key] = value;
        }
        return obj;
      }

      let captureWorker = null;
      function workerPost(info) {
        captureWorker && captureWorker.postMessage(_objectSpread({}, info));
      }
      function initWorker(_x, _x2) {
        return _initWorker.apply(this, arguments);
      }
      function _initWorker() {
        _initWorker = _asyncToGenerator(
          /*#__PURE__*/ _regeneratorRuntime().mark(function _callee(
            url,
            wasmPath
          ) {
            var promise;
            return _regeneratorRuntime().wrap(function _callee$(_context) {
              while (1)
                switch ((_context.prev = _context.next)) {
                  case 0:
                    if (!captureWorker) {
                      _context.next = 2;
                      break;
                    }
                    return _context.abrupt("return", captureWorker);
                  case 2:
                    // captureWorker = new Worker(new URL('./capture.worker.js', import.meta.url));
                    captureWorker = new Worker(url);
                    workerPost({
                      type: "initPath",
                      info: wasmPath.toString()
                    });
                    promise = new Promise(resolve => {
                      captureWorker &&
                        captureWorker.addEventListener("message", e => {
                          var _e$data;
                          if (
                            (e === null || e === void 0
                              ? void 0
                              : (_e$data = e.data) === null ||
                                _e$data === void 0
                              ? void 0
                              : _e$data.type) === "init"
                          ) {
                            // wasm初始化完毕
                            resolve(captureWorker);
                          }
                        });
                    });
                    return _context.abrupt("return", promise);
                  case 6:
                  case "end":
                    return _context.stop();
                }
            }, _callee);
          })
        );
        return _initWorker.apply(this, arguments);
      }
      function createRequest() {
        let currentId = 0;
        const map = new Map();
        return {
          // 获取视频唯一id
          setFrameCallback(item) {
            const id = ++currentId;
            map.set(
              currentId,
              _objectSpread(
                _objectSpread({}, item),
                {},
                {
                  url: []
                }
              )
            );
            return id;
          },
          // 设置
          getCbk(idx) {
            return map.get(idx);
          }
        };
      }
      const pool = createRequest();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      function rotateImage(imageData) {
        let direction =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : "l";
        const H = imageData.height;
        const W = imageData.width;
        const imgDt1 = new ImageData(H, W);
        const imgDt2 = new ImageData(H, W);
        const dt0 = imageData.data;
        const dt1 = imgDt1.data;
        const dt2 = imgDt2.data;

        // 2. Transposex
        let r = 0;
        let r1 = 0; // index of red pixel in old and new ImageData, respectively
        for (let y = 0, lenH = H; y < lenH; y++) {
          for (let x = 0, lenW = W; x < lenW; x++) {
            r = (x + lenW * y) * 4;
            r1 = (y + lenH * x) * 4;
            dt1[r1 + 0] = dt0[r + 0];
            dt1[r1 + 1] = dt0[r + 1];
            dt1[r1 + 2] = dt0[r + 2];
            dt1[r1 + 3] = dt0[r + 3];
          }
        }

        // 3. Reverse width / height
        for (let y = 0, lenH = W; y < lenH; y++) {
          for (let x = 0, lenW = H; x < lenW; x++) {
            r = (x + lenW * y) * 4;
            r1 =
              direction === "l"
                ? (x + lenW * (lenH - 1 - y)) * 4
                : (lenW - 1 - x + lenW * y) * 4;
            dt2[r1 + 0] = dt1[r + 0];
            dt2[r1 + 1] = dt1[r + 1];
            dt2[r1 + 2] = dt1[r + 2];
            dt2[r1 + 3] = dt1[r + 3];
          }
        }
        return imgDt2;
      }
      function getUrl(_x3, _x4, _x5, _x6) {
        return _getUrl.apply(this, arguments);
      }
      function _getUrl() {
        _getUrl = _asyncToGenerator(
          /*#__PURE__*/ _regeneratorRuntime().mark(function _callee2(
            width,
            height,
            imageDataBuffer,
            angle
          ) {
            var canvasWith, canvasHeight, imageData, imgData;
            return _regeneratorRuntime().wrap(function _callee2$(_context2) {
              while (1)
                switch ((_context2.prev = _context2.next)) {
                  case 0:
                    canvasWith = width;
                    canvasHeight = height;
                    imageData = new ImageData(imageDataBuffer, width, height);
                    imgData = null;
                    _context2.t0 = angle / 90;
                    _context2.next =
                      _context2.t0 === 1
                        ? 7
                        : _context2.t0 === 2
                        ? 11
                        : _context2.t0 === 3
                        ? 14
                        : 18;
                    break;
                  case 7:
                    imgData = rotateImage(imageData, "r");
                    canvasWith = height;
                    canvasHeight = width;
                    return _context2.abrupt("break", 20);
                  case 11:
                    imgData = rotateImage(imageData, "r");
                    imgData = rotateImage(imageData, "r");
                    return _context2.abrupt("break", 20);
                  case 14:
                    imgData = rotateImage(imageData, "l");
                    canvasWith = height;
                    canvasHeight = width;
                    return _context2.abrupt("break", 20);
                  case 18:
                    imgData = imageData;
                    return _context2.abrupt("break", 20);
                  case 20:
                    canvas.width = canvasWith;
                    canvas.height = canvasHeight;
                    ctx.putImageData(
                      imgData,
                      0,
                      0,
                      0,
                      0,
                      canvasWith,
                      canvasHeight
                    );
                    // const blob = new Blob([imageDataBuffer.buffer], {type: 'image/png'} /* (1) */);
                    return _context2.abrupt("return", {
                      url: canvas.toDataURL("image/jpeg")
                      // blob: blob,
                    });
                  case 24:
                  case "end":
                    return _context2.stop();
                }
            }, _callee2);
          })
        );
        return _getUrl.apply(this, arguments);
      }
      function startCapture(id, info, path, file) {
        workerPost({
          type: Events.startCapture,
          id,
          info,
          path,
          file
        });
      }
      function capture(data) {
        const info = data.info,
          path = data.path,
          file = data.file,
          func = _objectWithoutProperties(data, _excluded);
        const id = pool.setFrameCallback(func);
        startCapture(id, info, path, file);
      }
      function initCapture(_x7) {
        return _initCapture.apply(this, arguments);
      }
      function _initCapture() {
        _initCapture = _asyncToGenerator(
          /*#__PURE__*/ _regeneratorRuntime().mark(function _callee4(_ref) {
            var workerPath, wasmPath, worker;
            return _regeneratorRuntime().wrap(function _callee4$(_context4) {
              while (1)
                switch ((_context4.prev = _context4.next)) {
                  case 0:
                    (workerPath = _ref.workerPath), (wasmPath = _ref.wasmPath);
                    _context4.next = 3;
                    return initWorker(workerPath, wasmPath);
                  case 3:
                    worker = _context4.sent;
                    worker.addEventListener(
                      "message",
                      /*#__PURE__*/ (function () {
                        var _ref2 = _asyncToGenerator(
                          /*#__PURE__*/ _regeneratorRuntime().mark(
                            function _callee3(e) {
                              var _e$data2;
                              var _ref3,
                                imageDataBuffer,
                                width,
                                height,
                                duration,
                                id,
                                _ref3$meta,
                                meta,
                                _meta$angle,
                                angle,
                                img,
                                cbk,
                                onChange,
                                info,
                                _pool$getCbk,
                                url,
                                _ref4,
                                onSuccess,
                                _pool$getCbk2,
                                _ref5,
                                errmsg,
                                onError;
                              return _regeneratorRuntime().wrap(
                                function _callee3$(_context3) {
                                  while (1)
                                    switch ((_context3.prev = _context3.next)) {
                                      case 0:
                                        _context3.t0 =
                                          e === null || e === void 0
                                            ? void 0
                                            : (_e$data2 = e.data) === null ||
                                              _e$data2 === void 0
                                            ? void 0
                                            : _e$data2.type;
                                        _context3.next =
                                          _context3.t0 ===
                                          Events.receiveImageOnchange
                                            ? 3
                                            : _context3.t0 ===
                                              Events.receiveImageOnSuccess
                                            ? 15
                                            : _context3.t0 ===
                                              Events.receiveError
                                            ? 21
                                            : 26;
                                        break;
                                      case 3:
                                        (_ref3 = e.data || {}),
                                          (imageDataBuffer =
                                            _ref3.imageDataBuffer),
                                          (width = _ref3.width),
                                          (height = _ref3.height),
                                          (duration = _ref3.duration),
                                          (id = _ref3.id),
                                          (_ref3$meta = _ref3.meta),
                                          (meta =
                                            _ref3$meta === void 0
                                              ? {}
                                              : _ref3$meta);
                                        (_meta$angle = meta.angle),
                                          (angle =
                                            _meta$angle === void 0
                                              ? 0
                                              : _meta$angle);
                                        _context3.next = 7;
                                        return getUrl(
                                          width,
                                          height,
                                          imageDataBuffer,
                                          angle
                                        );
                                      case 7:
                                        img = _context3.sent;
                                        cbk = pool.getCbk(id);
                                        onChange = cbk.onChange;
                                        info = {
                                          width,
                                          height,
                                          duration: duration / 1000000
                                        };
                                        (_pool$getCbk = pool.getCbk(id)),
                                          (url = _pool$getCbk.url);
                                        onChange &&
                                          onChange(
                                            {
                                              url
                                            },
                                            img,
                                            info
                                          );
                                        url.push(img.url);
                                        return _context3.abrupt("break", 27);
                                      case 15:
                                        (_ref4 = e.data || {}),
                                          (id = _ref4.id),
                                          (meta = _ref4.meta);
                                        cbk = pool.getCbk(id);
                                        onSuccess = cbk.onSuccess;
                                        (_pool$getCbk2 = pool.getCbk(id)),
                                          (url = _pool$getCbk2.url);
                                        onSuccess &&
                                          onSuccess({
                                            url,
                                            meta
                                          });
                                        return _context3.abrupt("break", 27);
                                      case 21:
                                        (_ref5 = e.data || {}),
                                          (errmsg = _ref5.errmsg),
                                          (id = _ref5.id);
                                        cbk = pool.getCbk(id);
                                        onError = cbk.onError;
                                        onError && onError(errmsg);
                                        return _context3.abrupt("break", 27);
                                      case 26:
                                        return _context3.abrupt("break", 27);
                                      case 27:
                                      case "end":
                                        return _context3.stop();
                                    }
                                },
                                _callee3
                              );
                            }
                          )
                        );
                        return function (_x8) {
                          return _ref2.apply(this, arguments);
                        };
                      })()
                    );
                    return _context4.abrupt("return", {
                      capture
                    });
                  case 6:
                  case "end":
                    return _context4.stop();
                }
            }, _callee4);
          })
        );
        return _initCapture.apply(this, arguments);
      }
      /* harmony default export */ var src = initCapture;
    })();
    /******/ return __webpack_exports__;
    /******/
  })();
});

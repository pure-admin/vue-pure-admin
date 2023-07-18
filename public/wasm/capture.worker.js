// include: shell.js
// The Module object: Our interface to the outside world. We import
// and export values on it. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(Module) { ..generated code.. }
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to check if Module already exists (e.g. case 3 above).
// Substitution will be replaced with actual code on later stage of the build,
// this way Closure Compiler will not mangle it (e.g. case 4. above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module = typeof Module != "undefined" ? Module : {};

// --pre-jses are emitted after the Module integration code, so that they can
// refer to Module (if they choose; they can also define Module)
/******/ (function () {
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

    /***/ 4019: /***/ function (module) {
      module.exports =
        typeof ArrayBuffer !== "undefined" && typeof DataView !== "undefined";

      /***/
    },

    /***/ 260: /***/ function (
      module,
      __unused_webpack_exports,
      __webpack_require__
    ) {
      "use strict";

      var NATIVE_ARRAY_BUFFER = __webpack_require__(4019);
      var DESCRIPTORS = __webpack_require__(9781);
      var global = __webpack_require__(7854);
      var isObject = __webpack_require__(111);
      var has = __webpack_require__(6656);
      var classof = __webpack_require__(648);
      var createNonEnumerableProperty = __webpack_require__(8880);
      var redefine = __webpack_require__(1320);
      var defineProperty = __webpack_require__(3070).f;
      var getPrototypeOf = __webpack_require__(9518);
      var setPrototypeOf = __webpack_require__(7674);
      var wellKnownSymbol = __webpack_require__(5112);
      var uid = __webpack_require__(9711);

      var Int8Array = global.Int8Array;
      var Int8ArrayPrototype = Int8Array && Int8Array.prototype;
      var Uint8ClampedArray = global.Uint8ClampedArray;
      var Uint8ClampedArrayPrototype =
        Uint8ClampedArray && Uint8ClampedArray.prototype;
      var TypedArray = Int8Array && getPrototypeOf(Int8Array);
      var TypedArrayPrototype =
        Int8ArrayPrototype && getPrototypeOf(Int8ArrayPrototype);
      var ObjectPrototype = Object.prototype;
      var isPrototypeOf = ObjectPrototype.isPrototypeOf;

      var TO_STRING_TAG = wellKnownSymbol("toStringTag");
      var TYPED_ARRAY_TAG = uid("TYPED_ARRAY_TAG");
      // Fixing native typed arrays in Opera Presto crashes the browser, see #595
      var NATIVE_ARRAY_BUFFER_VIEWS =
        NATIVE_ARRAY_BUFFER &&
        !!setPrototypeOf &&
        classof(global.opera) !== "Opera";
      var TYPED_ARRAY_TAG_REQIRED = false;
      var NAME;

      var TypedArrayConstructorsList = {
        Int8Array: 1,
        Uint8Array: 1,
        Uint8ClampedArray: 1,
        Int16Array: 2,
        Uint16Array: 2,
        Int32Array: 4,
        Uint32Array: 4,
        Float32Array: 4,
        Float64Array: 8
      };

      var isView = function isView(it) {
        var klass = classof(it);
        return klass === "DataView" || has(TypedArrayConstructorsList, klass);
      };

      var isTypedArray = function (it) {
        return isObject(it) && has(TypedArrayConstructorsList, classof(it));
      };

      var aTypedArray = function (it) {
        if (isTypedArray(it)) return it;
        throw TypeError("Target is not a typed array");
      };

      var aTypedArrayConstructor = function (C) {
        if (setPrototypeOf) {
          if (isPrototypeOf.call(TypedArray, C)) return C;
        } else
          for (var ARRAY in TypedArrayConstructorsList)
            if (has(TypedArrayConstructorsList, NAME)) {
              var TypedArrayConstructor = global[ARRAY];
              if (
                TypedArrayConstructor &&
                (C === TypedArrayConstructor ||
                  isPrototypeOf.call(TypedArrayConstructor, C))
              ) {
                return C;
              }
            }
        throw TypeError("Target is not a typed array constructor");
      };

      var exportTypedArrayMethod = function (KEY, property, forced) {
        if (!DESCRIPTORS) return;
        if (forced)
          for (var ARRAY in TypedArrayConstructorsList) {
            var TypedArrayConstructor = global[ARRAY];
            if (
              TypedArrayConstructor &&
              has(TypedArrayConstructor.prototype, KEY)
            ) {
              delete TypedArrayConstructor.prototype[KEY];
            }
          }
        if (!TypedArrayPrototype[KEY] || forced) {
          redefine(
            TypedArrayPrototype,
            KEY,
            forced
              ? property
              : (NATIVE_ARRAY_BUFFER_VIEWS && Int8ArrayPrototype[KEY]) ||
                  property
          );
        }
      };

      var exportTypedArrayStaticMethod = function (KEY, property, forced) {
        var ARRAY, TypedArrayConstructor;
        if (!DESCRIPTORS) return;
        if (setPrototypeOf) {
          if (forced)
            for (ARRAY in TypedArrayConstructorsList) {
              TypedArrayConstructor = global[ARRAY];
              if (TypedArrayConstructor && has(TypedArrayConstructor, KEY)) {
                delete TypedArrayConstructor[KEY];
              }
            }
          if (!TypedArray[KEY] || forced) {
            // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
            try {
              return redefine(
                TypedArray,
                KEY,
                forced
                  ? property
                  : (NATIVE_ARRAY_BUFFER_VIEWS && Int8Array[KEY]) || property
              );
            } catch (error) {
              /* empty */
            }
          } else return;
        }
        for (ARRAY in TypedArrayConstructorsList) {
          TypedArrayConstructor = global[ARRAY];
          if (
            TypedArrayConstructor &&
            (!TypedArrayConstructor[KEY] || forced)
          ) {
            redefine(TypedArrayConstructor, KEY, property);
          }
        }
      };

      for (NAME in TypedArrayConstructorsList) {
        if (!global[NAME]) NATIVE_ARRAY_BUFFER_VIEWS = false;
      }

      // WebKit bug - typed arrays constructors prototype is Object.prototype
      if (
        !NATIVE_ARRAY_BUFFER_VIEWS ||
        typeof TypedArray != "function" ||
        TypedArray === Function.prototype
      ) {
        // eslint-disable-next-line no-shadow
        TypedArray = function TypedArray() {
          throw TypeError("Incorrect invocation");
        };
        if (NATIVE_ARRAY_BUFFER_VIEWS)
          for (NAME in TypedArrayConstructorsList) {
            if (global[NAME]) setPrototypeOf(global[NAME], TypedArray);
          }
      }

      if (
        !NATIVE_ARRAY_BUFFER_VIEWS ||
        !TypedArrayPrototype ||
        TypedArrayPrototype === ObjectPrototype
      ) {
        TypedArrayPrototype = TypedArray.prototype;
        if (NATIVE_ARRAY_BUFFER_VIEWS)
          for (NAME in TypedArrayConstructorsList) {
            if (global[NAME])
              setPrototypeOf(global[NAME].prototype, TypedArrayPrototype);
          }
      }

      // WebKit bug - one more object in Uint8ClampedArray prototype chain
      if (
        NATIVE_ARRAY_BUFFER_VIEWS &&
        getPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype
      ) {
        setPrototypeOf(Uint8ClampedArrayPrototype, TypedArrayPrototype);
      }

      if (DESCRIPTORS && !has(TypedArrayPrototype, TO_STRING_TAG)) {
        TYPED_ARRAY_TAG_REQIRED = true;
        defineProperty(TypedArrayPrototype, TO_STRING_TAG, {
          get: function () {
            return isObject(this) ? this[TYPED_ARRAY_TAG] : undefined;
          }
        });
        for (NAME in TypedArrayConstructorsList)
          if (global[NAME]) {
            createNonEnumerableProperty(global[NAME], TYPED_ARRAY_TAG, NAME);
          }
      }

      module.exports = {
        NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS,
        TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQIRED && TYPED_ARRAY_TAG,
        aTypedArray: aTypedArray,
        aTypedArrayConstructor: aTypedArrayConstructor,
        exportTypedArrayMethod: exportTypedArrayMethod,
        exportTypedArrayStaticMethod: exportTypedArrayStaticMethod,
        isView: isView,
        isTypedArray: isTypedArray,
        TypedArray: TypedArray,
        TypedArrayPrototype: TypedArrayPrototype
      };

      /***/
    },

    /***/ 3331: /***/ function (
      module,
      __unused_webpack_exports,
      __webpack_require__
    ) {
      "use strict";

      var global = __webpack_require__(7854);
      var DESCRIPTORS = __webpack_require__(9781);
      var NATIVE_ARRAY_BUFFER = __webpack_require__(4019);
      var createNonEnumerableProperty = __webpack_require__(8880);
      var redefineAll = __webpack_require__(2248);
      var fails = __webpack_require__(7293);
      var anInstance = __webpack_require__(5787);
      var toInteger = __webpack_require__(9958);
      var toLength = __webpack_require__(7466);
      var toIndex = __webpack_require__(7067);
      var IEEE754 = __webpack_require__(1179);
      var getPrototypeOf = __webpack_require__(9518);
      var setPrototypeOf = __webpack_require__(7674);
      var getOwnPropertyNames = __webpack_require__(8006).f;
      var defineProperty = __webpack_require__(3070).f;
      var arrayFill = __webpack_require__(1285);
      var setToStringTag = __webpack_require__(8003);
      var InternalStateModule = __webpack_require__(9909);

      var getInternalState = InternalStateModule.get;
      var setInternalState = InternalStateModule.set;
      var ARRAY_BUFFER = "ArrayBuffer";
      var DATA_VIEW = "DataView";
      var PROTOTYPE = "prototype";
      var WRONG_LENGTH = "Wrong length";
      var WRONG_INDEX = "Wrong index";
      var NativeArrayBuffer = global[ARRAY_BUFFER];
      var $ArrayBuffer = NativeArrayBuffer;
      var $DataView = global[DATA_VIEW];
      var $DataViewPrototype = $DataView && $DataView[PROTOTYPE];
      var ObjectPrototype = Object.prototype;
      var RangeError = global.RangeError;

      var packIEEE754 = IEEE754.pack;
      var unpackIEEE754 = IEEE754.unpack;

      var packInt8 = function (number) {
        return [number & 0xff];
      };

      var packInt16 = function (number) {
        return [number & 0xff, (number >> 8) & 0xff];
      };

      var packInt32 = function (number) {
        return [
          number & 0xff,
          (number >> 8) & 0xff,
          (number >> 16) & 0xff,
          (number >> 24) & 0xff
        ];
      };

      var unpackInt32 = function (buffer) {
        return (
          (buffer[3] << 24) | (buffer[2] << 16) | (buffer[1] << 8) | buffer[0]
        );
      };

      var packFloat32 = function (number) {
        return packIEEE754(number, 23, 4);
      };

      var packFloat64 = function (number) {
        return packIEEE754(number, 52, 8);
      };

      var addGetter = function (Constructor, key) {
        defineProperty(Constructor[PROTOTYPE], key, {
          get: function () {
            return getInternalState(this)[key];
          }
        });
      };

      var get = function (view, count, index, isLittleEndian) {
        var intIndex = toIndex(index);
        var store = getInternalState(view);
        if (intIndex + count > store.byteLength) throw RangeError(WRONG_INDEX);
        var bytes = getInternalState(store.buffer).bytes;
        var start = intIndex + store.byteOffset;
        var pack = bytes.slice(start, start + count);
        return isLittleEndian ? pack : pack.reverse();
      };

      var set = function (
        view,
        count,
        index,
        conversion,
        value,
        isLittleEndian
      ) {
        var intIndex = toIndex(index);
        var store = getInternalState(view);
        if (intIndex + count > store.byteLength) throw RangeError(WRONG_INDEX);
        var bytes = getInternalState(store.buffer).bytes;
        var start = intIndex + store.byteOffset;
        var pack = conversion(+value);
        for (var i = 0; i < count; i++)
          bytes[start + i] = pack[isLittleEndian ? i : count - i - 1];
      };

      if (!NATIVE_ARRAY_BUFFER) {
        $ArrayBuffer = function ArrayBuffer(length) {
          anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
          var byteLength = toIndex(length);
          setInternalState(this, {
            bytes: arrayFill.call(new Array(byteLength), 0),
            byteLength: byteLength
          });
          if (!DESCRIPTORS) this.byteLength = byteLength;
        };

        $DataView = function DataView(buffer, byteOffset, byteLength) {
          anInstance(this, $DataView, DATA_VIEW);
          anInstance(buffer, $ArrayBuffer, DATA_VIEW);
          var bufferLength = getInternalState(buffer).byteLength;
          var offset = toInteger(byteOffset);
          if (offset < 0 || offset > bufferLength)
            throw RangeError("Wrong offset");
          byteLength =
            byteLength === undefined
              ? bufferLength - offset
              : toLength(byteLength);
          if (offset + byteLength > bufferLength)
            throw RangeError(WRONG_LENGTH);
          setInternalState(this, {
            buffer: buffer,
            byteLength: byteLength,
            byteOffset: offset
          });
          if (!DESCRIPTORS) {
            this.buffer = buffer;
            this.byteLength = byteLength;
            this.byteOffset = offset;
          }
        };

        if (DESCRIPTORS) {
          addGetter($ArrayBuffer, "byteLength");
          addGetter($DataView, "buffer");
          addGetter($DataView, "byteLength");
          addGetter($DataView, "byteOffset");
        }

        redefineAll($DataView[PROTOTYPE], {
          getInt8: function getInt8(byteOffset) {
            return (get(this, 1, byteOffset)[0] << 24) >> 24;
          },
          getUint8: function getUint8(byteOffset) {
            return get(this, 1, byteOffset)[0];
          },
          getInt16: function getInt16(byteOffset /* , littleEndian */) {
            var bytes = get(
              this,
              2,
              byteOffset,
              arguments.length > 1 ? arguments[1] : undefined
            );
            return (((bytes[1] << 8) | bytes[0]) << 16) >> 16;
          },
          getUint16: function getUint16(byteOffset /* , littleEndian */) {
            var bytes = get(
              this,
              2,
              byteOffset,
              arguments.length > 1 ? arguments[1] : undefined
            );
            return (bytes[1] << 8) | bytes[0];
          },
          getInt32: function getInt32(byteOffset /* , littleEndian */) {
            return unpackInt32(
              get(
                this,
                4,
                byteOffset,
                arguments.length > 1 ? arguments[1] : undefined
              )
            );
          },
          getUint32: function getUint32(byteOffset /* , littleEndian */) {
            return (
              unpackInt32(
                get(
                  this,
                  4,
                  byteOffset,
                  arguments.length > 1 ? arguments[1] : undefined
                )
              ) >>> 0
            );
          },
          getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
            return unpackIEEE754(
              get(
                this,
                4,
                byteOffset,
                arguments.length > 1 ? arguments[1] : undefined
              ),
              23
            );
          },
          getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
            return unpackIEEE754(
              get(
                this,
                8,
                byteOffset,
                arguments.length > 1 ? arguments[1] : undefined
              ),
              52
            );
          },
          setInt8: function setInt8(byteOffset, value) {
            set(this, 1, byteOffset, packInt8, value);
          },
          setUint8: function setUint8(byteOffset, value) {
            set(this, 1, byteOffset, packInt8, value);
          },
          setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
            set(
              this,
              2,
              byteOffset,
              packInt16,
              value,
              arguments.length > 2 ? arguments[2] : undefined
            );
          },
          setUint16: function setUint16(
            byteOffset,
            value /* , littleEndian */
          ) {
            set(
              this,
              2,
              byteOffset,
              packInt16,
              value,
              arguments.length > 2 ? arguments[2] : undefined
            );
          },
          setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
            set(
              this,
              4,
              byteOffset,
              packInt32,
              value,
              arguments.length > 2 ? arguments[2] : undefined
            );
          },
          setUint32: function setUint32(
            byteOffset,
            value /* , littleEndian */
          ) {
            set(
              this,
              4,
              byteOffset,
              packInt32,
              value,
              arguments.length > 2 ? arguments[2] : undefined
            );
          },
          setFloat32: function setFloat32(
            byteOffset,
            value /* , littleEndian */
          ) {
            set(
              this,
              4,
              byteOffset,
              packFloat32,
              value,
              arguments.length > 2 ? arguments[2] : undefined
            );
          },
          setFloat64: function setFloat64(
            byteOffset,
            value /* , littleEndian */
          ) {
            set(
              this,
              8,
              byteOffset,
              packFloat64,
              value,
              arguments.length > 2 ? arguments[2] : undefined
            );
          }
        });
      } else {
        if (
          !fails(function () {
            NativeArrayBuffer(1);
          }) ||
          !fails(function () {
            new NativeArrayBuffer(-1); // eslint-disable-line no-new
          }) ||
          fails(function () {
            new NativeArrayBuffer(); // eslint-disable-line no-new
            new NativeArrayBuffer(1.5); // eslint-disable-line no-new
            new NativeArrayBuffer(NaN); // eslint-disable-line no-new
            return NativeArrayBuffer.name != ARRAY_BUFFER;
          })
        ) {
          $ArrayBuffer = function ArrayBuffer(length) {
            anInstance(this, $ArrayBuffer);
            return new NativeArrayBuffer(toIndex(length));
          };
          var ArrayBufferPrototype = ($ArrayBuffer[PROTOTYPE] =
            NativeArrayBuffer[PROTOTYPE]);
          for (
            var keys = getOwnPropertyNames(NativeArrayBuffer), j = 0, key;
            keys.length > j;

          ) {
            if (!((key = keys[j++]) in $ArrayBuffer)) {
              createNonEnumerableProperty(
                $ArrayBuffer,
                key,
                NativeArrayBuffer[key]
              );
            }
          }
          ArrayBufferPrototype.constructor = $ArrayBuffer;
        }

        // WebKit bug - the same parent prototype for typed arrays and data view
        if (
          setPrototypeOf &&
          getPrototypeOf($DataViewPrototype) !== ObjectPrototype
        ) {
          setPrototypeOf($DataViewPrototype, ObjectPrototype);
        }

        // iOS Safari 7.x bug
        var testView = new $DataView(new $ArrayBuffer(2));
        var nativeSetInt8 = $DataViewPrototype.setInt8;
        testView.setInt8(0, 2147483648);
        testView.setInt8(1, 2147483649);
        if (testView.getInt8(0) || !testView.getInt8(1))
          redefineAll(
            $DataViewPrototype,
            {
              setInt8: function setInt8(byteOffset, value) {
                nativeSetInt8.call(this, byteOffset, (value << 24) >> 24);
              },
              setUint8: function setUint8(byteOffset, value) {
                nativeSetInt8.call(this, byteOffset, (value << 24) >> 24);
              }
            },
            { unsafe: true }
          );
      }

      setToStringTag($ArrayBuffer, ARRAY_BUFFER);
      setToStringTag($DataView, DATA_VIEW);

      module.exports = {
        ArrayBuffer: $ArrayBuffer,
        DataView: $DataView
      };

      /***/
    },

    /***/ 1285: /***/ function (
      module,
      __unused_webpack_exports,
      __webpack_require__
    ) {
      "use strict";

      var toObject = __webpack_require__(7908);
      var toAbsoluteIndex = __webpack_require__(1400);
      var toLength = __webpack_require__(7466);

      // `Array.prototype.fill` method implementation
      // https://tc39.github.io/ecma262/#sec-array.prototype.fill
      module.exports = function fill(value /* , start = 0, end = @length */) {
        var O = toObject(this);
        var length = toLength(O.length);
        var argumentsLength = arguments.length;
        var index = toAbsoluteIndex(
          argumentsLength > 1 ? arguments[1] : undefined,
          length
        );
        var end = argumentsLength > 2 ? arguments[2] : undefined;
        var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
        while (endPos > index) O[index++] = value;
        return O;
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
          if (returnMethod !== undefined) anObject(returnMethod.call(iterator));
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
              typeof (tag = tryGet((O = Object(it)), TO_STRING_TAG)) == "string"
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
            defineProperty(target, key, getOwnPropertyDescriptor(source, key));
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
            setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
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

    /***/ 1179: /***/ function (module) {
      // IEEE754 conversions based on https://github.com/feross/ieee754
      // eslint-disable-next-line no-shadow-restricted-names
      var Infinity = 1 / 0;
      var abs = Math.abs;
      var pow = Math.pow;
      var floor = Math.floor;
      var log = Math.log;
      var LN2 = Math.LN2;

      var pack = function (number, mantissaLength, bytes) {
        var buffer = new Array(bytes);
        var exponentLength = bytes * 8 - mantissaLength - 1;
        var eMax = (1 << exponentLength) - 1;
        var eBias = eMax >> 1;
        var rt = mantissaLength === 23 ? pow(2, -24) - pow(2, -77) : 0;
        var sign = number < 0 || (number === 0 && 1 / number < 0) ? 1 : 0;
        var index = 0;
        var exponent, mantissa, c;
        number = abs(number);
        // eslint-disable-next-line no-self-compare
        if (number != number || number === Infinity) {
          // eslint-disable-next-line no-self-compare
          mantissa = number != number ? 1 : 0;
          exponent = eMax;
        } else {
          exponent = floor(log(number) / LN2);
          if (number * (c = pow(2, -exponent)) < 1) {
            exponent--;
            c *= 2;
          }
          if (exponent + eBias >= 1) {
            number += rt / c;
          } else {
            number += rt * pow(2, 1 - eBias);
          }
          if (number * c >= 2) {
            exponent++;
            c /= 2;
          }
          if (exponent + eBias >= eMax) {
            mantissa = 0;
            exponent = eMax;
          } else if (exponent + eBias >= 1) {
            mantissa = (number * c - 1) * pow(2, mantissaLength);
            exponent = exponent + eBias;
          } else {
            mantissa = number * pow(2, eBias - 1) * pow(2, mantissaLength);
            exponent = 0;
          }
        }
        for (
          ;
          mantissaLength >= 8;
          buffer[index++] = mantissa & 255, mantissa /= 256, mantissaLength -= 8
        );
        exponent = (exponent << mantissaLength) | mantissa;
        exponentLength += mantissaLength;
        for (
          ;
          exponentLength > 0;
          buffer[index++] = exponent & 255, exponent /= 256, exponentLength -= 8
        );
        buffer[--index] |= sign * 128;
        return buffer;
      };

      var unpack = function (buffer, mantissaLength) {
        var bytes = buffer.length;
        var exponentLength = bytes * 8 - mantissaLength - 1;
        var eMax = (1 << exponentLength) - 1;
        var eBias = eMax >> 1;
        var nBits = exponentLength - 7;
        var index = bytes - 1;
        var sign = buffer[index--];
        var exponent = sign & 127;
        var mantissa;
        sign >>= 7;
        for (
          ;
          nBits > 0;
          exponent = exponent * 256 + buffer[index], index--, nBits -= 8
        );
        mantissa = exponent & ((1 << -nBits) - 1);
        exponent >>= -nBits;
        nBits += mantissaLength;
        for (
          ;
          nBits > 0;
          mantissa = mantissa * 256 + buffer[index], index--, nBits -= 8
        );
        if (exponent === 0) {
          exponent = 1 - eBias;
        } else if (exponent === eMax) {
          return mantissa ? NaN : sign ? -Infinity : Infinity;
        } else {
          mantissa = mantissa + pow(2, mantissaLength);
          exponent = exponent - eBias;
        }
        return (sign ? -1 : 1) * mantissa * pow(2, exponent - mantissaLength);
      };

      module.exports = {
        pack: pack,
        unpack: unpack
      };

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
        return typeof it === "object" ? it !== null : typeof it === "function";
      };

      /***/
    },

    /***/ 1913: /***/ function (module) {
      module.exports = false;

      /***/
    },

    /***/ 408: /***/ function (
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
                ? boundFunction(anObject((step = iterable[index]))[0], step[1])
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
        while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
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
              definePropertyModule.f(O, (key = keys[index++]), Properties[key]);
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
        for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
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
          defineProperty(it, TO_STRING_TAG, { configurable: true, value: TAG });
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

    /***/ 7067: /***/ function (
      module,
      __unused_webpack_exports,
      __webpack_require__
    ) {
      var toInteger = __webpack_require__(9958);
      var toLength = __webpack_require__(7466);

      // `ToIndex` abstract operation
      // https://tc39.github.io/ecma262/#sec-toindex
      module.exports = function (it) {
        if (it === undefined) return 0;
        var number = toInteger(it);
        var length = toLength(number);
        if (number !== length) throw RangeError("Wrong length or index");
        return length;
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

    /***/ 4590: /***/ function (
      module,
      __unused_webpack_exports,
      __webpack_require__
    ) {
      var toPositiveInteger = __webpack_require__(3002);

      module.exports = function (it, BYTES) {
        var offset = toPositiveInteger(it);
        if (offset % BYTES) throw RangeError("Wrong offset");
        return offset;
      };

      /***/
    },

    /***/ 3002: /***/ function (
      module,
      __unused_webpack_exports,
      __webpack_require__
    ) {
      var toInteger = __webpack_require__(9958);

      module.exports = function (it) {
        var result = toInteger(it);
        if (result < 0) throw RangeError("The argument can't be less than 0");
        return result;
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

    /***/ 9843: /***/ function (
      module,
      __unused_webpack_exports,
      __webpack_require__
    ) {
      "use strict";

      var $ = __webpack_require__(2109);
      var global = __webpack_require__(7854);
      var DESCRIPTORS = __webpack_require__(9781);
      var TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS =
        __webpack_require__(3832);
      var ArrayBufferViewCore = __webpack_require__(260);
      var ArrayBufferModule = __webpack_require__(3331);
      var anInstance = __webpack_require__(5787);
      var createPropertyDescriptor = __webpack_require__(9114);
      var createNonEnumerableProperty = __webpack_require__(8880);
      var toLength = __webpack_require__(7466);
      var toIndex = __webpack_require__(7067);
      var toOffset = __webpack_require__(4590);
      var toPrimitive = __webpack_require__(7593);
      var has = __webpack_require__(6656);
      var classof = __webpack_require__(648);
      var isObject = __webpack_require__(111);
      var create = __webpack_require__(30);
      var setPrototypeOf = __webpack_require__(7674);
      var getOwnPropertyNames = __webpack_require__(8006).f;
      var typedArrayFrom = __webpack_require__(7321);
      var forEach = __webpack_require__(2092).forEach;
      var setSpecies = __webpack_require__(6340);
      var definePropertyModule = __webpack_require__(3070);
      var getOwnPropertyDescriptorModule = __webpack_require__(1236);
      var InternalStateModule = __webpack_require__(9909);
      var inheritIfRequired = __webpack_require__(9587);

      var getInternalState = InternalStateModule.get;
      var setInternalState = InternalStateModule.set;
      var nativeDefineProperty = definePropertyModule.f;
      var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
      var round = Math.round;
      var RangeError = global.RangeError;
      var ArrayBuffer = ArrayBufferModule.ArrayBuffer;
      var DataView = ArrayBufferModule.DataView;
      var NATIVE_ARRAY_BUFFER_VIEWS =
        ArrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;
      var TYPED_ARRAY_TAG = ArrayBufferViewCore.TYPED_ARRAY_TAG;
      var TypedArray = ArrayBufferViewCore.TypedArray;
      var TypedArrayPrototype = ArrayBufferViewCore.TypedArrayPrototype;
      var aTypedArrayConstructor = ArrayBufferViewCore.aTypedArrayConstructor;
      var isTypedArray = ArrayBufferViewCore.isTypedArray;
      var BYTES_PER_ELEMENT = "BYTES_PER_ELEMENT";
      var WRONG_LENGTH = "Wrong length";

      var fromList = function (C, list) {
        var index = 0;
        var length = list.length;
        var result = new (aTypedArrayConstructor(C))(length);
        while (length > index) result[index] = list[index++];
        return result;
      };

      var addGetter = function (it, key) {
        nativeDefineProperty(it, key, {
          get: function () {
            return getInternalState(this)[key];
          }
        });
      };

      var isArrayBuffer = function (it) {
        var klass;
        return (
          it instanceof ArrayBuffer ||
          (klass = classof(it)) == "ArrayBuffer" ||
          klass == "SharedArrayBuffer"
        );
      };

      var isTypedArrayIndex = function (target, key) {
        return (
          isTypedArray(target) &&
          typeof key != "symbol" &&
          key in target &&
          String(+key) == String(key)
        );
      };

      var wrappedGetOwnPropertyDescriptor = function getOwnPropertyDescriptor(
        target,
        key
      ) {
        return isTypedArrayIndex(target, (key = toPrimitive(key, true)))
          ? createPropertyDescriptor(2, target[key])
          : nativeGetOwnPropertyDescriptor(target, key);
      };

      var wrappedDefineProperty = function defineProperty(
        target,
        key,
        descriptor
      ) {
        if (
          isTypedArrayIndex(target, (key = toPrimitive(key, true))) &&
          isObject(descriptor) &&
          has(descriptor, "value") &&
          !has(descriptor, "get") &&
          !has(descriptor, "set") &&
          // TODO: add validation descriptor w/o calling accessors
          !descriptor.configurable &&
          (!has(descriptor, "writable") || descriptor.writable) &&
          (!has(descriptor, "enumerable") || descriptor.enumerable)
        ) {
          target[key] = descriptor.value;
          return target;
        }
        return nativeDefineProperty(target, key, descriptor);
      };

      if (DESCRIPTORS) {
        if (!NATIVE_ARRAY_BUFFER_VIEWS) {
          getOwnPropertyDescriptorModule.f = wrappedGetOwnPropertyDescriptor;
          definePropertyModule.f = wrappedDefineProperty;
          addGetter(TypedArrayPrototype, "buffer");
          addGetter(TypedArrayPrototype, "byteOffset");
          addGetter(TypedArrayPrototype, "byteLength");
          addGetter(TypedArrayPrototype, "length");
        }

        $(
          { target: "Object", stat: true, forced: !NATIVE_ARRAY_BUFFER_VIEWS },
          {
            getOwnPropertyDescriptor: wrappedGetOwnPropertyDescriptor,
            defineProperty: wrappedDefineProperty
          }
        );

        module.exports = function (TYPE, wrapper, CLAMPED) {
          var BYTES = TYPE.match(/\d+$/)[0] / 8;
          var CONSTRUCTOR_NAME = TYPE + (CLAMPED ? "Clamped" : "") + "Array";
          var GETTER = "get" + TYPE;
          var SETTER = "set" + TYPE;
          var NativeTypedArrayConstructor = global[CONSTRUCTOR_NAME];
          var TypedArrayConstructor = NativeTypedArrayConstructor;
          var TypedArrayConstructorPrototype =
            TypedArrayConstructor && TypedArrayConstructor.prototype;
          var exported = {};

          var getter = function (that, index) {
            var data = getInternalState(that);
            return data.view[GETTER](index * BYTES + data.byteOffset, true);
          };

          var setter = function (that, index, value) {
            var data = getInternalState(that);
            if (CLAMPED)
              value =
                (value = round(value)) < 0
                  ? 0
                  : value > 0xff
                  ? 0xff
                  : value & 0xff;
            data.view[SETTER](index * BYTES + data.byteOffset, value, true);
          };

          var addElement = function (that, index) {
            nativeDefineProperty(that, index, {
              get: function () {
                return getter(this, index);
              },
              set: function (value) {
                return setter(this, index, value);
              },
              enumerable: true
            });
          };

          if (!NATIVE_ARRAY_BUFFER_VIEWS) {
            TypedArrayConstructor = wrapper(function (
              that,
              data,
              offset,
              $length
            ) {
              anInstance(that, TypedArrayConstructor, CONSTRUCTOR_NAME);
              var index = 0;
              var byteOffset = 0;
              var buffer, byteLength, length;
              if (!isObject(data)) {
                length = toIndex(data);
                byteLength = length * BYTES;
                buffer = new ArrayBuffer(byteLength);
              } else if (isArrayBuffer(data)) {
                buffer = data;
                byteOffset = toOffset(offset, BYTES);
                var $len = data.byteLength;
                if ($length === undefined) {
                  if ($len % BYTES) throw RangeError(WRONG_LENGTH);
                  byteLength = $len - byteOffset;
                  if (byteLength < 0) throw RangeError(WRONG_LENGTH);
                } else {
                  byteLength = toLength($length) * BYTES;
                  if (byteLength + byteOffset > $len)
                    throw RangeError(WRONG_LENGTH);
                }
                length = byteLength / BYTES;
              } else if (isTypedArray(data)) {
                return fromList(TypedArrayConstructor, data);
              } else {
                return typedArrayFrom.call(TypedArrayConstructor, data);
              }
              setInternalState(that, {
                buffer: buffer,
                byteOffset: byteOffset,
                byteLength: byteLength,
                length: length,
                view: new DataView(buffer)
              });
              while (index < length) addElement(that, index++);
            });

            if (setPrototypeOf)
              setPrototypeOf(TypedArrayConstructor, TypedArray);
            TypedArrayConstructorPrototype = TypedArrayConstructor.prototype =
              create(TypedArrayPrototype);
          } else if (TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS) {
            TypedArrayConstructor = wrapper(function (
              dummy,
              data,
              typedArrayOffset,
              $length
            ) {
              anInstance(dummy, TypedArrayConstructor, CONSTRUCTOR_NAME);
              return inheritIfRequired(
                (function () {
                  if (!isObject(data))
                    return new NativeTypedArrayConstructor(toIndex(data));
                  if (isArrayBuffer(data))
                    return $length !== undefined
                      ? new NativeTypedArrayConstructor(
                          data,
                          toOffset(typedArrayOffset, BYTES),
                          $length
                        )
                      : typedArrayOffset !== undefined
                      ? new NativeTypedArrayConstructor(
                          data,
                          toOffset(typedArrayOffset, BYTES)
                        )
                      : new NativeTypedArrayConstructor(data);
                  if (isTypedArray(data))
                    return fromList(TypedArrayConstructor, data);
                  return typedArrayFrom.call(TypedArrayConstructor, data);
                })(),
                dummy,
                TypedArrayConstructor
              );
            });

            if (setPrototypeOf)
              setPrototypeOf(TypedArrayConstructor, TypedArray);
            forEach(
              getOwnPropertyNames(NativeTypedArrayConstructor),
              function (key) {
                if (!(key in TypedArrayConstructor)) {
                  createNonEnumerableProperty(
                    TypedArrayConstructor,
                    key,
                    NativeTypedArrayConstructor[key]
                  );
                }
              }
            );
            TypedArrayConstructor.prototype = TypedArrayConstructorPrototype;
          }

          if (
            TypedArrayConstructorPrototype.constructor !== TypedArrayConstructor
          ) {
            createNonEnumerableProperty(
              TypedArrayConstructorPrototype,
              "constructor",
              TypedArrayConstructor
            );
          }

          if (TYPED_ARRAY_TAG) {
            createNonEnumerableProperty(
              TypedArrayConstructorPrototype,
              TYPED_ARRAY_TAG,
              CONSTRUCTOR_NAME
            );
          }

          exported[CONSTRUCTOR_NAME] = TypedArrayConstructor;

          $(
            {
              global: true,
              forced: TypedArrayConstructor != NativeTypedArrayConstructor,
              sham: !NATIVE_ARRAY_BUFFER_VIEWS
            },
            exported
          );

          if (!(BYTES_PER_ELEMENT in TypedArrayConstructor)) {
            createNonEnumerableProperty(
              TypedArrayConstructor,
              BYTES_PER_ELEMENT,
              BYTES
            );
          }

          if (!(BYTES_PER_ELEMENT in TypedArrayConstructorPrototype)) {
            createNonEnumerableProperty(
              TypedArrayConstructorPrototype,
              BYTES_PER_ELEMENT,
              BYTES
            );
          }

          setSpecies(CONSTRUCTOR_NAME);
        };
      } else
        module.exports = function () {
          /* empty */
        };

      /***/
    },

    /***/ 3832: /***/ function (
      module,
      __unused_webpack_exports,
      __webpack_require__
    ) {
      /* eslint-disable no-new */
      var global = __webpack_require__(7854);
      var fails = __webpack_require__(7293);
      var checkCorrectnessOfIteration = __webpack_require__(7072);
      var NATIVE_ARRAY_BUFFER_VIEWS =
        __webpack_require__(260).NATIVE_ARRAY_BUFFER_VIEWS;

      var ArrayBuffer = global.ArrayBuffer;
      var Int8Array = global.Int8Array;

      module.exports =
        !NATIVE_ARRAY_BUFFER_VIEWS ||
        !fails(function () {
          Int8Array(1);
        }) ||
        !fails(function () {
          new Int8Array(-1);
        }) ||
        !checkCorrectnessOfIteration(function (iterable) {
          new Int8Array();
          new Int8Array(null);
          new Int8Array(1.5);
          new Int8Array(iterable);
        }, true) ||
        fails(function () {
          // Safari (11+) bug - a reason why even Safari 13 should load a typed array polyfill
          return new Int8Array(new ArrayBuffer(2), 1, undefined).length !== 1;
        });

      /***/
    },

    /***/ 7321: /***/ function (
      module,
      __unused_webpack_exports,
      __webpack_require__
    ) {
      var toObject = __webpack_require__(7908);
      var toLength = __webpack_require__(7466);
      var getIteratorMethod = __webpack_require__(1246);
      var isArrayIteratorMethod = __webpack_require__(7659);
      var bind = __webpack_require__(9974);
      var aTypedArrayConstructor =
        __webpack_require__(260).aTypedArrayConstructor;

      module.exports = function from(source /* , mapfn, thisArg */) {
        var O = toObject(source);
        var argumentsLength = arguments.length;
        var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
        var mapping = mapfn !== undefined;
        var iteratorMethod = getIteratorMethod(O);
        var i, length, result, step, iterator, next;
        if (
          iteratorMethod != undefined &&
          !isArrayIteratorMethod(iteratorMethod)
        ) {
          iterator = iteratorMethod.call(O);
          next = iterator.next;
          O = [];
          while (!(step = next.call(iterator)).done) {
            O.push(step.value);
          }
        }
        if (mapping && argumentsLength > 2) {
          mapfn = bind(mapfn, arguments[2], 2);
        }
        length = toLength(O.length);
        result = new (aTypedArrayConstructor(this))(length);
        for (i = 0; length > i; i++) {
          result[i] = mapping ? mapfn(O[i], i) : O[i];
        }
        return result;
      };

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
            var fin = toAbsoluteIndex(end === undefined ? length : end, length);
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

    /***/ 2703: /***/ function (
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
      var iterate = __webpack_require__(408);
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
            reaction.ok = typeof onFulfilled == "function" ? onFulfilled : true;
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

    /***/ 3105: /***/ function (
      __unused_webpack_module,
      __unused_webpack_exports,
      __webpack_require__
    ) {
      "use strict";

      var ArrayBufferViewCore = __webpack_require__(260);
      var $fill = __webpack_require__(1285);

      var aTypedArray = ArrayBufferViewCore.aTypedArray;
      var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

      // `%TypedArray%.prototype.fill` method
      // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.fill
      // eslint-disable-next-line no-unused-vars
      exportTypedArrayMethod("fill", function fill(value /* , start, end */) {
        return $fill.apply(aTypedArray(this), arguments);
      });

      /***/
    },

    /***/ 6319: /***/ function (
      __unused_webpack_module,
      __unused_webpack_exports,
      __webpack_require__
    ) {
      "use strict";

      var global = __webpack_require__(7854);
      var ArrayBufferViewCore = __webpack_require__(260);
      var ArrayIterators = __webpack_require__(6992);
      var wellKnownSymbol = __webpack_require__(5112);

      var ITERATOR = wellKnownSymbol("iterator");
      var Uint8Array = global.Uint8Array;
      var arrayValues = ArrayIterators.values;
      var arrayKeys = ArrayIterators.keys;
      var arrayEntries = ArrayIterators.entries;
      var aTypedArray = ArrayBufferViewCore.aTypedArray;
      var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
      var nativeTypedArrayIterator =
        Uint8Array && Uint8Array.prototype[ITERATOR];

      var CORRECT_ITER_NAME =
        !!nativeTypedArrayIterator &&
        (nativeTypedArrayIterator.name == "values" ||
          nativeTypedArrayIterator.name == undefined);

      var typedArrayValues = function values() {
        return arrayValues.call(aTypedArray(this));
      };

      // `%TypedArray%.prototype.entries` method
      // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.entries
      exportTypedArrayMethod("entries", function entries() {
        return arrayEntries.call(aTypedArray(this));
      });
      // `%TypedArray%.prototype.keys` method
      // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.keys
      exportTypedArrayMethod("keys", function keys() {
        return arrayKeys.call(aTypedArray(this));
      });
      // `%TypedArray%.prototype.values` method
      // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.values
      exportTypedArrayMethod("values", typedArrayValues, !CORRECT_ITER_NAME);
      // `%TypedArray%.prototype[@@iterator]` method
      // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype-@@iterator
      exportTypedArrayMethod(ITERATOR, typedArrayValues, !CORRECT_ITER_NAME);

      /***/
    },

    /***/ 3462: /***/ function (
      __unused_webpack_module,
      __unused_webpack_exports,
      __webpack_require__
    ) {
      "use strict";

      var ArrayBufferViewCore = __webpack_require__(260);
      var toLength = __webpack_require__(7466);
      var toOffset = __webpack_require__(4590);
      var toObject = __webpack_require__(7908);
      var fails = __webpack_require__(7293);

      var aTypedArray = ArrayBufferViewCore.aTypedArray;
      var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

      var FORCED = fails(function () {
        // eslint-disable-next-line no-undef
        new Int8Array(1).set({});
      });

      // `%TypedArray%.prototype.set` method
      // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.set
      exportTypedArrayMethod(
        "set",
        function set(arrayLike /* , offset */) {
          aTypedArray(this);
          var offset = toOffset(
            arguments.length > 1 ? arguments[1] : undefined,
            1
          );
          var length = this.length;
          var src = toObject(arrayLike);
          var len = toLength(src.length);
          var index = 0;
          if (len + offset > length) throw RangeError("Wrong length");
          while (index < len) this[offset + index] = src[index++];
        },
        FORCED
      );

      /***/
    },

    /***/ 3824: /***/ function (
      __unused_webpack_module,
      __unused_webpack_exports,
      __webpack_require__
    ) {
      "use strict";

      var ArrayBufferViewCore = __webpack_require__(260);

      var aTypedArray = ArrayBufferViewCore.aTypedArray;
      var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
      var $sort = [].sort;

      // `%TypedArray%.prototype.sort` method
      // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.sort
      exportTypedArrayMethod("sort", function sort(comparefn) {
        return $sort.call(aTypedArray(this), comparefn);
      });

      /***/
    },

    /***/ 5016: /***/ function (
      __unused_webpack_module,
      __unused_webpack_exports,
      __webpack_require__
    ) {
      "use strict";

      var exportTypedArrayMethod =
        __webpack_require__(260).exportTypedArrayMethod;
      var fails = __webpack_require__(7293);
      var global = __webpack_require__(7854);

      var Uint8Array = global.Uint8Array;
      var Uint8ArrayPrototype = (Uint8Array && Uint8Array.prototype) || {};
      var arrayToString = [].toString;
      var arrayJoin = [].join;

      if (
        fails(function () {
          arrayToString.call({});
        })
      ) {
        arrayToString = function toString() {
          return arrayJoin.call(this);
        };
      }

      var IS_NOT_ARRAY_METHOD = Uint8ArrayPrototype.toString != arrayToString;

      // `%TypedArray%.prototype.toString` method
      // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.tostring
      exportTypedArrayMethod("toString", arrayToString, IS_NOT_ARRAY_METHOD);

      /***/
    },

    /***/ 9743: /***/ function (
      __unused_webpack_module,
      __unused_webpack_exports,
      __webpack_require__
    ) {
      var createTypedArrayConstructor = __webpack_require__(9843);

      // `Uint8ClampedArray` constructor
      // https://tc39.github.io/ecma262/#sec-typedarray-objects
      createTypedArrayConstructor(
        "Uint8",
        function (init) {
          return function Uint8ClampedArray(data, byteOffset, length) {
            return init(this, data, byteOffset, length);
          };
        },
        true
      );

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
  /******/ /* webpack/runtime/compat get default export */
  /******/ !(function () {
    /******/ // getDefaultExport function for compatibility with non-harmony modules
    /******/ __webpack_require__.n = function (module) {
      /******/ var getter =
        module && module.__esModule
          ? /******/ function () {
              return module["default"];
            }
          : /******/ function () {
              return module;
            };
      /******/ __webpack_require__.d(getter, { a: getter });
      /******/ return getter;
      /******/
    };
    /******/
  })();
  /******/
  /******/ /* webpack/runtime/define property getters */
  /******/ !(function () {
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
  /******/ /* webpack/runtime/global */
  /******/ !(function () {
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
  /******/ /* webpack/runtime/hasOwnProperty shorthand */
  /******/ !(function () {
    /******/ __webpack_require__.o = function (obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    };
    /******/
  })();
  /******/
  /************************************************************************/
  var __webpack_exports__ = {};
  // This entry need to be wrapped in an IIFE because it need to be in strict mode.
  !(function () {
    "use strict";
    /* harmony import */ var core_js_modules_es_array_slice_js__WEBPACK_IMPORTED_MODULE_0__ =
      __webpack_require__(7042);
    /* harmony import */ var core_js_modules_es_array_slice_js__WEBPACK_IMPORTED_MODULE_0___default =
      /*#__PURE__*/ __webpack_require__.n(
        core_js_modules_es_array_slice_js__WEBPACK_IMPORTED_MODULE_0__
      );
    /* harmony import */ var core_js_modules_es_array_iterator_js__WEBPACK_IMPORTED_MODULE_1__ =
      __webpack_require__(6992);
    /* harmony import */ var core_js_modules_es_array_iterator_js__WEBPACK_IMPORTED_MODULE_1___default =
      /*#__PURE__*/ __webpack_require__.n(
        core_js_modules_es_array_iterator_js__WEBPACK_IMPORTED_MODULE_1__
      );
    /* harmony import */ var core_js_modules_es_typed_array_uint8_clamped_array_js__WEBPACK_IMPORTED_MODULE_2__ =
      __webpack_require__(9743);
    /* harmony import */ var core_js_modules_es_typed_array_uint8_clamped_array_js__WEBPACK_IMPORTED_MODULE_2___default =
      /*#__PURE__*/ __webpack_require__.n(
        core_js_modules_es_typed_array_uint8_clamped_array_js__WEBPACK_IMPORTED_MODULE_2__
      );
    /* harmony import */ var core_js_modules_es_typed_array_fill_js__WEBPACK_IMPORTED_MODULE_3__ =
      __webpack_require__(3105);
    /* harmony import */ var core_js_modules_es_typed_array_fill_js__WEBPACK_IMPORTED_MODULE_3___default =
      /*#__PURE__*/ __webpack_require__.n(
        core_js_modules_es_typed_array_fill_js__WEBPACK_IMPORTED_MODULE_3__
      );
    /* harmony import */ var core_js_modules_es_typed_array_iterator_js__WEBPACK_IMPORTED_MODULE_4__ =
      __webpack_require__(6319);
    /* harmony import */ var core_js_modules_es_typed_array_iterator_js__WEBPACK_IMPORTED_MODULE_4___default =
      /*#__PURE__*/ __webpack_require__.n(
        core_js_modules_es_typed_array_iterator_js__WEBPACK_IMPORTED_MODULE_4__
      );
    /* harmony import */ var core_js_modules_es_typed_array_set_js__WEBPACK_IMPORTED_MODULE_5__ =
      __webpack_require__(3462);
    /* harmony import */ var core_js_modules_es_typed_array_set_js__WEBPACK_IMPORTED_MODULE_5___default =
      /*#__PURE__*/ __webpack_require__.n(
        core_js_modules_es_typed_array_set_js__WEBPACK_IMPORTED_MODULE_5__
      );
    /* harmony import */ var core_js_modules_es_typed_array_sort_js__WEBPACK_IMPORTED_MODULE_6__ =
      __webpack_require__(3824);
    /* harmony import */ var core_js_modules_es_typed_array_sort_js__WEBPACK_IMPORTED_MODULE_6___default =
      /*#__PURE__*/ __webpack_require__.n(
        core_js_modules_es_typed_array_sort_js__WEBPACK_IMPORTED_MODULE_6__
      );
    /* harmony import */ var core_js_modules_es_typed_array_to_string_js__WEBPACK_IMPORTED_MODULE_7__ =
      __webpack_require__(5016);
    /* harmony import */ var core_js_modules_es_typed_array_to_string_js__WEBPACK_IMPORTED_MODULE_7___default =
      /*#__PURE__*/ __webpack_require__.n(
        core_js_modules_es_typed_array_to_string_js__WEBPACK_IMPORTED_MODULE_7__
      );
    /* harmony import */ var core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_8__ =
      __webpack_require__(4747);
    /* harmony import */ var core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_8___default =
      /*#__PURE__*/ __webpack_require__.n(
        core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_8__
      );
    /* harmony import */ var core_js_modules_es_regexp_to_string_js__WEBPACK_IMPORTED_MODULE_9__ =
      __webpack_require__(9714);
    /* harmony import */ var core_js_modules_es_regexp_to_string_js__WEBPACK_IMPORTED_MODULE_9___default =
      /*#__PURE__*/ __webpack_require__.n(
        core_js_modules_es_regexp_to_string_js__WEBPACK_IMPORTED_MODULE_9__
      );
    /* harmony import */ var core_js_modules_es_symbol_description_js__WEBPACK_IMPORTED_MODULE_10__ =
      __webpack_require__(1817);
    /* harmony import */ var core_js_modules_es_symbol_description_js__WEBPACK_IMPORTED_MODULE_10___default =
      /*#__PURE__*/ __webpack_require__.n(
        core_js_modules_es_symbol_description_js__WEBPACK_IMPORTED_MODULE_10__
      );
    /* harmony import */ var core_js_modules_es_promise_js__WEBPACK_IMPORTED_MODULE_11__ =
      __webpack_require__(8674);
    /* harmony import */ var core_js_modules_es_promise_js__WEBPACK_IMPORTED_MODULE_11___default =
      /*#__PURE__*/ __webpack_require__.n(
        core_js_modules_es_promise_js__WEBPACK_IMPORTED_MODULE_11__
      );
    /* harmony import */ var core_js_modules_es_array_filter_js__WEBPACK_IMPORTED_MODULE_12__ =
      __webpack_require__(7327);
    /* harmony import */ var core_js_modules_es_array_filter_js__WEBPACK_IMPORTED_MODULE_12___default =
      /*#__PURE__*/ __webpack_require__.n(
        core_js_modules_es_array_filter_js__WEBPACK_IMPORTED_MODULE_12__
      );
    /* harmony import */ var core_js_modules_es_object_get_own_property_descriptors_js__WEBPACK_IMPORTED_MODULE_13__ =
      __webpack_require__(9337);
    /* harmony import */ var core_js_modules_es_object_get_own_property_descriptors_js__WEBPACK_IMPORTED_MODULE_13___default =
      /*#__PURE__*/ __webpack_require__.n(
        core_js_modules_es_object_get_own_property_descriptors_js__WEBPACK_IMPORTED_MODULE_13__
      );
    /* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_14__ =
      __webpack_require__(3948);
    /* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_14___default =
      /*#__PURE__*/ __webpack_require__.n(
        core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_14__
      );
    /* harmony import */ var core_js_modules_es_symbol_async_iterator_js__WEBPACK_IMPORTED_MODULE_15__ =
      __webpack_require__(2443);
    /* harmony import */ var core_js_modules_es_symbol_async_iterator_js__WEBPACK_IMPORTED_MODULE_15___default =
      /*#__PURE__*/ __webpack_require__.n(
        core_js_modules_es_symbol_async_iterator_js__WEBPACK_IMPORTED_MODULE_15__
      );
    /* harmony import */ var core_js_modules_es_json_to_string_tag_js__WEBPACK_IMPORTED_MODULE_16__ =
      __webpack_require__(3706);
    /* harmony import */ var core_js_modules_es_json_to_string_tag_js__WEBPACK_IMPORTED_MODULE_16___default =
      /*#__PURE__*/ __webpack_require__.n(
        core_js_modules_es_json_to_string_tag_js__WEBPACK_IMPORTED_MODULE_16__
      );
    /* harmony import */ var core_js_modules_es_math_to_string_tag_js__WEBPACK_IMPORTED_MODULE_17__ =
      __webpack_require__(2703);
    /* harmony import */ var core_js_modules_es_math_to_string_tag_js__WEBPACK_IMPORTED_MODULE_17___default =
      /*#__PURE__*/ __webpack_require__.n(
        core_js_modules_es_math_to_string_tag_js__WEBPACK_IMPORTED_MODULE_17__
      );
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
          delegateYield: function delegateYield(iterable, resultName, nextLoc) {
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
    function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
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

    class ImageCapture {
      constructor() {
        this.isMKDIR = false;
        this.cCaptureByCount = null;
        this.cCaptureByMs = null; // c的方法
        this.imageList = {};
        this.captureInfo = {};
        this.imgDataPtrList = [];
        this.imgBufferPtrList = [];
      }
      getImageInfo(imgDataPtr) {
        const width = Module.HEAPU32[imgDataPtr];
        const height = Module.HEAPU32[imgDataPtr + 1];
        const duration = Module.HEAPU32[imgDataPtr + 2];
        const imageBufferPtr = Module.HEAPU32[imgDataPtr + 3];
        const imageBuffer = Module.HEAPU8.slice(
          imageBufferPtr,
          imageBufferPtr + width * height * 3
        );
        //   Module._free(imgDataPtr);
        //   Module._free(imageBufferPtr);
        this.imgDataPtrList.push(imgDataPtr);
        this.imgBufferPtrList.push(imageBufferPtr);
        const imageDataBuffer = new Uint8ClampedArray(width * height * 4);
        let j = 0;
        for (let i = 0; i < imageBuffer.length; i++) {
          if (i && i % 3 === 0) {
            imageDataBuffer[j] = 255;
            j += 1;
          }
          imageDataBuffer[j] = imageBuffer[i];
          j += 1;
        }
        return {
          width,
          height,
          duration,
          imageDataBuffer
        };
      }
      _singleImage(imgDataPtr) {
        const width = Module.HEAPU32[imgDataPtr];
        const height = Module.HEAPU32[imgDataPtr + 1];
        const duration = Module.HEAPU32[imgDataPtr + 2];
        const imageBufferPtr = Module.HEAPU32[imgDataPtr + 3];
        const imageBuffer = Module.HEAPU8.slice(
          imageBufferPtr,
          imageBufferPtr + width * height * 3
        );
        Module._free(imgDataPtr);
        Module._free(imageBufferPtr);
        const imageDataBuffer = new Uint8ClampedArray(width * height * 4);
        let j = 0;
        for (let i = 0; i < imageBuffer.length; i++) {
          if (i && i % 3 === 0) {
            imageDataBuffer[j] = 255;
            j += 1;
          }
          imageDataBuffer[j] = imageBuffer[i];
          j += 1;
        }
        return {
          width,
          height,
          duration,
          imageDataBuffer
        };
      }
      getImgList(imgDataPtr, count) {
        const dataArr = [];
        for (let i = 0; i < count; i++) {
          dataArr.push(this._singleImage(imgDataPtr / 4 + i * 4));
        }
        return dataArr;
      }
      // 加载文件
      mountFile(file, MOUNT_DIR, id) {
        if (!this.isMKDIR) {
          FS.mkdir(MOUNT_DIR);
          this.isMKDIR = true;
        }
        const data = {};
        let name = "";
        // 判断类型 如果是blob转file
        if (file instanceof File) {
          data.files = [file];
          name = file.name;
        } else {
          name = `${id}.mp4`;
          data.blobs = [
            {
              name,
              data: file
            }
          ];
        }
        // @ts-ignore
        FS.mount(WORKERFS, data, MOUNT_DIR);
        return name;
      }
      free() {
        // 释放指针内存
        this.imgDataPtrList.forEach(ptr => {
          Module._free(ptr);
        });
        this.imgDataPtrList = [];
        this.imgBufferPtrList.forEach(ptr => {
          Module._free(ptr);
        });
        this.imgBufferPtrList = [];
      }
      capture(_ref) {
        let id = _ref.id,
          info = _ref.info,
          _ref$path = _ref.path,
          path = _ref$path === void 0 ? "/working" : _ref$path,
          file = _ref.file;
        try {
          const name = this.mountFile(file, path, id);
          let retData = 0;
          this.imageList[id] = [];
          if (info instanceof Array) {
            // 说明是按照时间抽
            this.captureInfo[id] = info.length;
            if (!this.cCaptureByMs) {
              this.cCaptureByMs = Module.cwrap("captureByMs", "number", [
                "string",
                "string",
                "number"
              ]);
            }
            // const imgDataPtr =
            retData = this.cCaptureByMs(info.join(","), `${path}/${name}`, id);
            this.free();
          } else {
            this.captureInfo[id] = info;
            if (!this.cCaptureByCount) {
              this.cCaptureByCount = Module.cwrap("captureByCount", "number", [
                "number",
                "string",
                "number"
              ]);
            }
            retData = this.cCaptureByCount(info, `${path}/${name}`, id);
            this.free();
            FS.unmount(path);
            // 完善信息 这里需要一种模式 是否只一次性postmsg 不一张张读取
            if (retData === 0) {
              throw new Error("Frame draw exception!");
            }
          }
        } catch (e) {
          console.log("Error occurred", e);
          // 如果发生错误 通知
          self.postMessage({
            type: "receiveError",
            errmsg: e.toString(),
            id
          });
        }
      }
    }

    // importScripts('./capture.js');
    const imageCapture = new ImageCapture();
    let isInit = false;
    const metaDataMap = {};
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function transpostFrame(ptr, id) {
      const data = imageCapture.getImageInfo(ptr / 4);
      // push到数组列表
      imageCapture.imageList[id].push(_objectSpread({}, data));
      self.postMessage(
        _objectSpread(
          _objectSpread(
            {
              type: "receiveImageOnchange"
            },
            data
          ),
          {},
          {
            id,
            meta: metaDataMap[id] || {}
          }
        )
      );
      // console.log('transpostFrame==>', id, imageCapture.captureInfo);
      if (imageCapture.imageList[id].length >= imageCapture.captureInfo[id]) {
        // 说明已经到了数目 可以postonfinish事件
        self.postMessage({
          type: "receiveImageOnSuccess",
          id,
          meta: metaDataMap[id] || {}
          // ...imageCapture.imageList[id], //TODO: 这个是否post未确定
        });
      }
    }

    function setAngle(a, id) {
      metaDataMap[id].angle = +a;
    }
    function setDescription(a, id) {
      metaDataMap[id].description = a;
    }
    self.transpostFrame = transpostFrame;
    self.setAngle = setAngle;
    self.setDescription = setDescription;
    const initPromise = new Promise(res => {
      self.goOnInit = res;
    });
    self.addEventListener("message", e => {
      // console.log('receivemessage', e.data);
      const _e$data = e.data,
        type = _e$data.type,
        id = _e$data.id,
        info = _e$data.info,
        path = _e$data.path,
        file = _e$data.file;
      if (type === "initPath") {
        self.goOnInit(info);
      }
      if (isInit && type === "startCapture") {
        metaDataMap[id] = {};
        imageCapture.capture({
          id,
          info,
          path,
          file
        });
      }
    });
    self.Module = {
      instantiateWasm: (function () {
        var _instantiateWasm = _asyncToGenerator(
          /*#__PURE__*/ _regeneratorRuntime().mark(function _callee(
            info,
            receiveInstance
          ) {
            var url;
            return _regeneratorRuntime().wrap(function _callee$(_context) {
              while (1)
                switch ((_context.prev = _context.next)) {
                  case 0:
                    _context.next = 2;
                    return initPromise;
                  case 2:
                    url = _context.sent;
                    fetch(url || "./capture.worker.wasm")
                      .then(response => response.arrayBuffer())
                      .then(bytes => WebAssembly.instantiate(bytes, info))
                      .then(instance => receiveInstance(instance.instance));
                  // WebAssembly.instantiate(bytes, info).then(result => {
                  //     receiveInstance(result.instance);
                  // });
                  case 4:
                  case "end":
                    return _context.stop();
                }
            }, _callee);
          })
        );
        function instantiateWasm(_x, _x2) {
          return _instantiateWasm.apply(this, arguments);
        }
        return instantiateWasm;
      })(),
      onRuntimeInitialized: () => {
        isInit = true;
        self.postMessage({
          type: "init",
          data: {}
        });
      }
    };
  })();
  /******/
})();

// Sometimes an existing Module object exists with properties
// meant to overwrite the default module functionality. Here
// we collect those properties and reapply _after_ we configure
// the current environment's defaults to avoid having to be so
// defensive during initialization.
var moduleOverrides = Object.assign({}, Module);

var arguments_ = [];
var thisProgram = "./this.program";
var quit_ = (status, toThrow) => {
  throw toThrow;
};

// Determine the runtime environment we are in. You can customize this by
// setting the ENVIRONMENT setting at compile time (see settings.js).

// Attempt to auto-detect the environment
var ENVIRONMENT_IS_WEB = typeof window == "object";
var ENVIRONMENT_IS_WORKER = typeof importScripts == "function";
// N.b. Electron.js environment is simultaneously a NODE-environment, but
// also a web environment.
var ENVIRONMENT_IS_NODE =
  typeof process == "object" &&
  typeof process.versions == "object" &&
  typeof process.versions.node == "string";
var ENVIRONMENT_IS_SHELL =
  !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

// `/` should be present at the end if `scriptDirectory` is not empty
var scriptDirectory = "";
function locateFile(path) {
  if (Module["locateFile"]) {
    return Module["locateFile"](path, scriptDirectory);
  }
  return scriptDirectory + path;
}

// Hooks that are implemented differently in different runtime environments.
var read_, readAsync, readBinary, setWindowTitle;

if (ENVIRONMENT_IS_NODE) {
  // `require()` is no-op in an ESM module, use `createRequire()` to construct
  // the require()` function.  This is only necessary for multi-environment
  // builds, `-sENVIRONMENT=node` emits a static import declaration instead.
  // TODO: Swap all `require()`'s with `import()`'s?
  // These modules will usually be used on Node.js. Load them eagerly to avoid
  // the complexity of lazy-loading.
  var fs = require("fs");
  var nodePath = require("path");

  if (ENVIRONMENT_IS_WORKER) {
    scriptDirectory = nodePath.dirname(scriptDirectory) + "/";
  } else {
    scriptDirectory = __dirname + "/";
  }

  // include: node_shell_read.js
  read_ = (filename, binary) => {
    // We need to re-wrap `file://` strings to URLs. Normalizing isn't
    // necessary in that case, the path should already be absolute.
    filename = isFileURI(filename)
      ? new URL(filename)
      : nodePath.normalize(filename);
    return fs.readFileSync(filename, binary ? undefined : "utf8");
  };

  readBinary = filename => {
    var ret = read_(filename, true);
    if (!ret.buffer) {
      ret = new Uint8Array(ret);
    }
    return ret;
  };

  readAsync = (filename, onload, onerror, binary = true) => {
    // See the comment in the `read_` function.
    filename = isFileURI(filename)
      ? new URL(filename)
      : nodePath.normalize(filename);
    fs.readFile(filename, binary ? undefined : "utf8", (err, data) => {
      if (err) onerror(err);
      else onload(binary ? data.buffer : data);
    });
  };
  // end include: node_shell_read.js
  if (!Module["thisProgram"] && process.argv.length > 1) {
    thisProgram = process.argv[1].replace(/\\/g, "/");
  }

  arguments_ = process.argv.slice(2);

  if (typeof module != "undefined") {
    module["exports"] = Module;
  }

  process.on("uncaughtException", ex => {
    // suppress ExitStatus exceptions from showing an error
    if (
      ex !== "unwind" &&
      !(ex instanceof ExitStatus) &&
      !(ex.context instanceof ExitStatus)
    ) {
      throw ex;
    }
  });

  quit_ = (status, toThrow) => {
    process.exitCode = status;
    throw toThrow;
  };

  Module["inspect"] = () => "[Emscripten Module object]";
}

// Note that this includes Node.js workers when relevant (pthreads is enabled).
// Node.js workers are detected as a combination of ENVIRONMENT_IS_WORKER and
// ENVIRONMENT_IS_NODE.
else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  if (ENVIRONMENT_IS_WORKER) {
    // Check worker, not web, since window could be polyfilled
    scriptDirectory = self.location.href;
  } else if (typeof document != "undefined" && document.currentScript) {
    // web
    scriptDirectory = document.currentScript.src;
  }
  // blob urls look like blob:http://site.com/etc/etc and we cannot infer anything from them.
  // otherwise, slice off the final part of the url to find the script directory.
  // if scriptDirectory does not contain a slash, lastIndexOf will return -1,
  // and scriptDirectory will correctly be replaced with an empty string.
  // If scriptDirectory contains a query (starting with ?) or a fragment (starting with #),
  // they are removed because they could contain a slash.
  if (scriptDirectory.indexOf("blob:") !== 0) {
    scriptDirectory = scriptDirectory.substr(
      0,
      scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1
    );
  } else {
    scriptDirectory = "";
  }

  // Differentiate the Web Worker from the Node Worker case, as reading must
  // be done differently.
  {
    // include: web_or_worker_shell_read.js
    read_ = url => {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url, false);
      xhr.send(null);
      return xhr.responseText;
    };

    if (ENVIRONMENT_IS_WORKER) {
      readBinary = url => {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
        xhr.responseType = "arraybuffer";
        xhr.send(null);
        return new Uint8Array(/** @type{!ArrayBuffer} */ (xhr.response));
      };
    }

    readAsync = (url, onload, onerror) => {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.responseType = "arraybuffer";
      xhr.onload = () => {
        if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) {
          // file URLs can return 0
          onload(xhr.response);
          return;
        }
        onerror();
      };
      xhr.onerror = onerror;
      xhr.send(null);
    };

    // end include: web_or_worker_shell_read.js
  }

  setWindowTitle = title => (document.title = title);
} else {
}

var out = Module["print"] || (() => {});
var err = Module["printErr"] || console.error.bind(console);

// Merge back in the overrides
Object.assign(Module, moduleOverrides);
// Free the object hierarchy contained in the overrides, this lets the GC
// reclaim data used e.g. in memoryInitializerRequest, which is a large typed array.
moduleOverrides = null;

// Emit code to handle expected values on the Module object. This applies Module.x
// to the proper local x. This has two benefits: first, we only emit it if it is
// expected to arrive, and second, by using a local everywhere else that can be
// minified.

if (Module["arguments"]) arguments_ = Module["arguments"];

if (Module["thisProgram"]) thisProgram = Module["thisProgram"];

if (Module["quit"]) quit_ = Module["quit"];

// perform assertions in shell.js after we set up out() and err(), as otherwise if an assertion fails it cannot print the message

// end include: shell.js
// include: preamble.js
// === Preamble library stuff ===

// Documentation for the public APIs defined in this file must be updated in:
//    site/source/docs/api_reference/preamble.js.rst
// A prebuilt local version of the documentation is available at:
//    site/build/text/docs/api_reference/preamble.js.txt
// You can also build docs locally as HTML or other formats in site/
// An online HTML version (which may be of a different version of Emscripten)
//    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html

var wasmBinary;
if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
var noExitRuntime = Module["noExitRuntime"] || true;

if (typeof WebAssembly != "object") {
  abort("no native wasm support detected");
}

// Wasm globals

var wasmMemory;

//========================================
// Runtime essentials
//========================================

// whether we are quitting the application. no code should run after this.
// set in exit() and abort()
var ABORT = false;

// set by exit() and abort().  Passed to 'onExit' handler.
// NOTE: This is also used as the process return code code in shell environments
// but only when noExitRuntime is false.
var EXITSTATUS;

/** @type {function(*, string=)} */
function assert(condition, text) {
  if (!condition) {
    // This build was created without ASSERTIONS defined.  `assert()` should not
    // ever be called in this configuration but in case there are callers in
    // the wild leave this simple abort() implemenation here for now.
    abort(text);
  }
}

// Memory management

var HEAP,
  /** @type {!Int8Array} */
  HEAP8,
  /** @type {!Uint8Array} */
  HEAPU8,
  /** @type {!Int16Array} */
  HEAP16,
  /** @type {!Uint16Array} */
  HEAPU16,
  /** @type {!Int32Array} */
  HEAP32,
  /** @type {!Uint32Array} */
  HEAPU32,
  /** @type {!Float32Array} */
  HEAPF32,
  /** @type {!Float64Array} */
  HEAPF64;

function updateMemoryViews() {
  var b = wasmMemory.buffer;
  Module["HEAP8"] = HEAP8 = new Int8Array(b);
  Module["HEAP16"] = HEAP16 = new Int16Array(b);
  Module["HEAP32"] = HEAP32 = new Int32Array(b);
  Module["HEAPU8"] = HEAPU8 = new Uint8Array(b);
  Module["HEAPU16"] = HEAPU16 = new Uint16Array(b);
  Module["HEAPU32"] = HEAPU32 = new Uint32Array(b);
  Module["HEAPF32"] = HEAPF32 = new Float32Array(b);
  Module["HEAPF64"] = HEAPF64 = new Float64Array(b);
}

// include: runtime_init_table.js
// In regular non-RELOCATABLE mode the table is exported
// from the wasm module and this will be assigned once
// the exports are available.
var wasmTable;
// end include: runtime_init_table.js
// include: runtime_stack_check.js
// end include: runtime_stack_check.js
// include: runtime_assertions.js
// end include: runtime_assertions.js
var __ATPRERUN__ = []; // functions called before the runtime is initialized
var __ATINIT__ = []; // functions called during startup
var __ATMAIN__ = []; // functions called when main() is to be run
var __ATEXIT__ = []; // functions called during shutdown
var __ATPOSTRUN__ = []; // functions called after the main() is called

var runtimeInitialized = false;

var runtimeKeepaliveCounter = 0;

function keepRuntimeAlive() {
  return noExitRuntime || runtimeKeepaliveCounter > 0;
}

function preRun() {
  if (Module["preRun"]) {
    if (typeof Module["preRun"] == "function")
      Module["preRun"] = [Module["preRun"]];
    while (Module["preRun"].length) {
      addOnPreRun(Module["preRun"].shift());
    }
  }
  callRuntimeCallbacks(__ATPRERUN__);
}

function initRuntime() {
  runtimeInitialized = true;

  if (!Module["noFSInit"] && !FS.init.initialized) FS.init();
  FS.ignorePermissions = false;

  TTY.init();
  callRuntimeCallbacks(__ATINIT__);
}

function preMain() {
  callRuntimeCallbacks(__ATMAIN__);
}

function postRun() {
  if (Module["postRun"]) {
    if (typeof Module["postRun"] == "function")
      Module["postRun"] = [Module["postRun"]];
    while (Module["postRun"].length) {
      addOnPostRun(Module["postRun"].shift());
    }
  }

  callRuntimeCallbacks(__ATPOSTRUN__);
}

function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}

function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}

function addOnPreMain(cb) {
  __ATMAIN__.unshift(cb);
}

function addOnExit(cb) {}

function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}

// include: runtime_math.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/fround

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/clz32

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc

// end include: runtime_math.js
// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// Module.preRun (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null; // overridden to take different actions when all run dependencies are fulfilled

function getUniqueRunDependency(id) {
  return id;
}

function addRunDependency(id) {
  runDependencies++;

  if (Module["monitorRunDependencies"]) {
    Module["monitorRunDependencies"](runDependencies);
  }
}

function removeRunDependency(id) {
  runDependencies--;

  if (Module["monitorRunDependencies"]) {
    Module["monitorRunDependencies"](runDependencies);
  }

  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback(); // can add another dependenciesFulfilled
    }
  }
}

/** @param {string|number=} what */
function abort(what) {
  if (Module["onAbort"]) {
    Module["onAbort"](what);
  }

  what = "Aborted(" + what + ")";
  // TODO(sbc): Should we remove printing and leave it up to whoever
  // catches the exception?
  err(what);

  ABORT = true;
  EXITSTATUS = 1;

  what += ". Build with -sASSERTIONS for more info.";

  // Use a wasm runtime error, because a JS error might be seen as a foreign
  // exception, which means we'd run destructors on it. We need the error to
  // simply make the program stop.
  // FIXME This approach does not work in Wasm EH because it currently does not assume
  // all RuntimeErrors are from traps; it decides whether a RuntimeError is from
  // a trap or not based on a hidden field within the object. So at the moment
  // we don't have a way of throwing a wasm trap from JS. TODO Make a JS API that
  // allows this in the wasm spec.

  // Suppress closure compiler warning here. Closure compiler's builtin extern
  // defintion for WebAssembly.RuntimeError claims it takes no arguments even
  // though it can.
  // TODO(https://github.com/google/closure-compiler/pull/3913): Remove if/when upstream closure gets fixed.
  /** @suppress {checkTypes} */
  var e = new WebAssembly.RuntimeError(what);

  // Throw the error whether or not MODULARIZE is set because abort is used
  // in code paths apart from instantiation where an exception is expected
  // to be thrown when abort is called.
  throw e;
}

// include: memoryprofiler.js
// end include: memoryprofiler.js
// include: URIUtils.js
// Prefix of data URIs emitted by SINGLE_FILE and related options.
var dataURIPrefix = "data:application/octet-stream;base64,";

// Indicates whether filename is a base64 data URI.
function isDataURI(filename) {
  // Prefix of data URIs emitted by SINGLE_FILE and related options.
  return filename.startsWith(dataURIPrefix);
}

// Indicates whether filename is delivered via file protocol (as opposed to http/https)
function isFileURI(filename) {
  return filename.startsWith("file://");
}
// end include: URIUtils.js
// include: runtime_exceptions.js
// end include: runtime_exceptions.js
var wasmBinaryFile;
wasmBinaryFile = "capture.worker.wasm";
if (!isDataURI(wasmBinaryFile)) {
  wasmBinaryFile = locateFile(wasmBinaryFile);
}

function getBinarySync(file) {
  if (file == wasmBinaryFile && wasmBinary) {
    return new Uint8Array(wasmBinary);
  }
  if (readBinary) {
    return readBinary(file);
  }
  throw "both async and sync fetching of the wasm failed";
}

function getBinaryPromise(binaryFile) {
  // If we don't have the binary yet, try to load it asynchronously.
  // Fetch has some additional restrictions over XHR, like it can't be used on a file:// url.
  // See https://github.com/github/fetch/pull/92#issuecomment-140665932
  // Cordova or Electron apps are typically loaded from a file:// url.
  // So use fetch if it is available and the url is not a file, otherwise fall back to XHR.
  if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
    if (typeof fetch == "function" && !isFileURI(binaryFile)) {
      return fetch(binaryFile, { credentials: "same-origin" })
        .then(response => {
          if (!response["ok"]) {
            throw "failed to load wasm binary file at '" + binaryFile + "'";
          }
          return response["arrayBuffer"]();
        })
        .catch(() => getBinarySync(binaryFile));
    } else if (readAsync) {
      // fetch is not available or url is file => try XHR (readAsync uses XHR internally)
      return new Promise((resolve, reject) => {
        readAsync(
          binaryFile,
          response =>
            resolve(new Uint8Array(/** @type{!ArrayBuffer} */ (response))),
          reject
        );
      });
    }
  }

  // Otherwise, getBinarySync should be able to get it synchronously
  return Promise.resolve().then(() => getBinarySync(binaryFile));
}

function instantiateArrayBuffer(binaryFile, imports, receiver) {
  return getBinaryPromise(binaryFile)
    .then(binary => {
      return WebAssembly.instantiate(binary, imports);
    })
    .then(instance => {
      return instance;
    })
    .then(receiver, reason => {
      err("failed to asynchronously prepare wasm: " + reason);

      abort(reason);
    });
}

function instantiateAsync(binary, binaryFile, imports, callback) {
  if (
    !binary &&
    typeof WebAssembly.instantiateStreaming == "function" &&
    !isDataURI(binaryFile) &&
    // Don't use streaming for file:// delivered objects in a webview, fetch them synchronously.
    !isFileURI(binaryFile) &&
    // Avoid instantiateStreaming() on Node.js environment for now, as while
    // Node.js v18.1.0 implements it, it does not have a full fetch()
    // implementation yet.
    //
    // Reference:
    //   https://github.com/emscripten-core/emscripten/pull/16917
    !ENVIRONMENT_IS_NODE &&
    typeof fetch == "function"
  ) {
    return fetch(binaryFile, { credentials: "same-origin" }).then(response => {
      // Suppress closure warning here since the upstream definition for
      // instantiateStreaming only allows Promise<Repsponse> rather than
      // an actual Response.
      // TODO(https://github.com/google/closure-compiler/pull/3913): Remove if/when upstream closure is fixed.
      /** @suppress {checkTypes} */
      var result = WebAssembly.instantiateStreaming(response, imports);

      return result.then(callback, function (reason) {
        // We expect the most common failure cause to be a bad MIME type for the binary,
        // in which case falling back to ArrayBuffer instantiation should work.
        err("wasm streaming compile failed: " + reason);
        err("falling back to ArrayBuffer instantiation");
        return instantiateArrayBuffer(binaryFile, imports, callback);
      });
    });
  }
  return instantiateArrayBuffer(binaryFile, imports, callback);
}

// Create the wasm instance.
// Receives the wasm imports, returns the exports.
function createWasm() {
  // prepare imports
  var info = {
    env: wasmImports,
    wasi_snapshot_preview1: wasmImports
  };
  // Load the wasm module and create an instance of using native support in the JS engine.
  // handle a generated wasm instance, receiving its exports and
  // performing other necessary setup
  /** @param {WebAssembly.Module=} module*/
  function receiveInstance(instance, module) {
    var exports = instance.exports;

    Module["asm"] = exports;

    wasmMemory = Module["asm"]["memory"];
    updateMemoryViews();

    wasmTable = Module["asm"]["__indirect_function_table"];

    addOnInit(Module["asm"]["__wasm_call_ctors"]);

    removeRunDependency("wasm-instantiate");
    return exports;
  }
  // wait for the pthread pool (if any)
  addRunDependency("wasm-instantiate");

  // Prefer streaming instantiation if available.
  function receiveInstantiationResult(result) {
    // 'result' is a ResultObject object which has both the module and instance.
    // receiveInstance() will swap in the exports (to Module.asm) so they can be called
    // TODO: Due to Closure regression https://github.com/google/closure-compiler/issues/3193, the above line no longer optimizes out down to the following line.
    // When the regression is fixed, can restore the above PTHREADS-enabled path.
    receiveInstance(result["instance"]);
  }

  // User shell pages can write their own Module.instantiateWasm = function(imports, successCallback) callback
  // to manually instantiate the Wasm module themselves. This allows pages to
  // run the instantiation parallel to any other async startup actions they are
  // performing.
  // Also pthreads and wasm workers initialize the wasm instance through this
  // path.
  if (Module["instantiateWasm"]) {
    try {
      return Module["instantiateWasm"](info, receiveInstance);
    } catch (e) {
      err("Module.instantiateWasm callback failed with error: " + e);
      return false;
    }
  }

  instantiateAsync(
    wasmBinary,
    wasmBinaryFile,
    info,
    receiveInstantiationResult
  );
  return {}; // no exports yet; we'll fill them in later
}

// Globals used by JS i64 conversions (see makeSetValue)
var tempDouble;
var tempI64;

// include: runtime_debug.js
// end include: runtime_debug.js
// === Body ===

// end include: preamble.js

/** @constructor */
function ExitStatus(status) {
  this.name = "ExitStatus";
  this.message = `Program terminated with exit(${status})`;
  this.status = status;
}

var callRuntimeCallbacks = callbacks => {
  while (callbacks.length > 0) {
    // Pass the module as the first argument.
    callbacks.shift()(Module);
  }
};

/**
 * @param {number} ptr
 * @param {string} type
 */
function getValue(ptr, type = "i8") {
  if (type.endsWith("*")) type = "*";
  switch (type) {
    case "i1":
      return HEAP8[ptr >> 0];
    case "i8":
      return HEAP8[ptr >> 0];
    case "i16":
      return HEAP16[ptr >> 1];
    case "i32":
      return HEAP32[ptr >> 2];
    case "i64":
      abort("to do getValue(i64) use WASM_BIGINT");
    case "float":
      return HEAPF32[ptr >> 2];
    case "double":
      return HEAPF64[ptr >> 3];
    case "*":
      return HEAPU32[ptr >> 2];
    default:
      abort(`invalid type for getValue: ${type}`);
  }
}

/**
 * @param {number} ptr
 * @param {number} value
 * @param {string} type
 */
function setValue(ptr, value, type = "i8") {
  if (type.endsWith("*")) type = "*";
  switch (type) {
    case "i1":
      HEAP8[ptr >> 0] = value;
      break;
    case "i8":
      HEAP8[ptr >> 0] = value;
      break;
    case "i16":
      HEAP16[ptr >> 1] = value;
      break;
    case "i32":
      HEAP32[ptr >> 2] = value;
      break;
    case "i64":
      abort("to do setValue(i64) use WASM_BIGINT");
    case "float":
      HEAPF32[ptr >> 2] = value;
      break;
    case "double":
      HEAPF64[ptr >> 3] = value;
      break;
    case "*":
      HEAPU32[ptr >> 2] = value;
      break;
    default:
      abort(`invalid type for setValue: ${type}`);
  }
}

var PATH = {
  isAbs: path => path.charAt(0) === "/",
  splitPath: filename => {
    var splitPathRe =
      /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
    return splitPathRe.exec(filename).slice(1);
  },
  normalizeArray: (parts, allowAboveRoot) => {
    // if the path tries to go above the root, `up` ends up > 0
    var up = 0;
    for (var i = parts.length - 1; i >= 0; i--) {
      var last = parts[i];
      if (last === ".") {
        parts.splice(i, 1);
      } else if (last === "..") {
        parts.splice(i, 1);
        up++;
      } else if (up) {
        parts.splice(i, 1);
        up--;
      }
    }
    // if the path is allowed to go above the root, restore leading ..s
    if (allowAboveRoot) {
      for (; up; up--) {
        parts.unshift("..");
      }
    }
    return parts;
  },
  normalize: path => {
    var isAbsolute = PATH.isAbs(path),
      trailingSlash = path.substr(-1) === "/";
    // Normalize the path
    path = PATH.normalizeArray(
      path.split("/").filter(p => !!p),
      !isAbsolute
    ).join("/");
    if (!path && !isAbsolute) {
      path = ".";
    }
    if (path && trailingSlash) {
      path += "/";
    }
    return (isAbsolute ? "/" : "") + path;
  },
  dirname: path => {
    var result = PATH.splitPath(path),
      root = result[0],
      dir = result[1];
    if (!root && !dir) {
      // No dirname whatsoever
      return ".";
    }
    if (dir) {
      // It has a dirname, strip trailing slash
      dir = dir.substr(0, dir.length - 1);
    }
    return root + dir;
  },
  basename: path => {
    // EMSCRIPTEN return '/'' for '/', not an empty string
    if (path === "/") return "/";
    path = PATH.normalize(path);
    path = path.replace(/\/$/, "");
    var lastSlash = path.lastIndexOf("/");
    if (lastSlash === -1) return path;
    return path.substr(lastSlash + 1);
  },
  join: function () {
    var paths = Array.prototype.slice.call(arguments);
    return PATH.normalize(paths.join("/"));
  },
  join2: (l, r) => {
    return PATH.normalize(l + "/" + r);
  }
};

var initRandomFill = () => {
  if (
    typeof crypto == "object" &&
    typeof crypto["getRandomValues"] == "function"
  ) {
    // for modern web browsers
    return view => crypto.getRandomValues(view);
  } else if (ENVIRONMENT_IS_NODE) {
    // for nodejs with or without crypto support included
    try {
      var crypto_module = require("crypto");
      var randomFillSync = crypto_module["randomFillSync"];
      if (randomFillSync) {
        // nodejs with LTS crypto support
        return view => crypto_module["randomFillSync"](view);
      }
      // very old nodejs with the original crypto API
      var randomBytes = crypto_module["randomBytes"];
      return view => (
        view.set(randomBytes(view.byteLength)),
        // Return the original view to match modern native implementations.
        view
      );
    } catch (e) {
      // nodejs doesn't have crypto support
    }
  }
  // we couldn't find a proper implementation, as Math.random() is not suitable for /dev/random, see emscripten-core/emscripten/pull/7096
  abort("initRandomDevice");
};
var randomFill = view => {
  // Lazily init on the first invocation.
  return (randomFill = initRandomFill())(view);
};

var PATH_FS = {
  resolve: function () {
    var resolvedPath = "",
      resolvedAbsolute = false;
    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path = i >= 0 ? arguments[i] : FS.cwd();
      // Skip empty and invalid entries
      if (typeof path != "string") {
        throw new TypeError("Arguments to path.resolve must be strings");
      } else if (!path) {
        return ""; // an invalid portion invalidates the whole thing
      }
      resolvedPath = path + "/" + resolvedPath;
      resolvedAbsolute = PATH.isAbs(path);
    }
    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)
    resolvedPath = PATH.normalizeArray(
      resolvedPath.split("/").filter(p => !!p),
      !resolvedAbsolute
    ).join("/");
    return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
  },
  relative: (from, to) => {
    from = PATH_FS.resolve(from).substr(1);
    to = PATH_FS.resolve(to).substr(1);
    function trim(arr) {
      var start = 0;
      for (; start < arr.length; start++) {
        if (arr[start] !== "") break;
      }
      var end = arr.length - 1;
      for (; end >= 0; end--) {
        if (arr[end] !== "") break;
      }
      if (start > end) return [];
      return arr.slice(start, end - start + 1);
    }
    var fromParts = trim(from.split("/"));
    var toParts = trim(to.split("/"));
    var length = Math.min(fromParts.length, toParts.length);
    var samePartsLength = length;
    for (var i = 0; i < length; i++) {
      if (fromParts[i] !== toParts[i]) {
        samePartsLength = i;
        break;
      }
    }
    var outputParts = [];
    for (var i = samePartsLength; i < fromParts.length; i++) {
      outputParts.push("..");
    }
    outputParts = outputParts.concat(toParts.slice(samePartsLength));
    return outputParts.join("/");
  }
};

var UTF8Decoder =
  typeof TextDecoder != "undefined" ? new TextDecoder("utf8") : undefined;

/**
 * Given a pointer 'idx' to a null-terminated UTF8-encoded string in the given
 * array that contains uint8 values, returns a copy of that string as a
 * Javascript String object.
 * heapOrArray is either a regular array, or a JavaScript typed array view.
 * @param {number} idx
 * @param {number=} maxBytesToRead
 * @return {string}
 */
var UTF8ArrayToString = (heapOrArray, idx, maxBytesToRead) => {
  var endIdx = idx + maxBytesToRead;
  var endPtr = idx;
  // TextDecoder needs to know the byte length in advance, it doesn't stop on
  // null terminator by itself.  Also, use the length info to avoid running tiny
  // strings through TextDecoder, since .subarray() allocates garbage.
  // (As a tiny code save trick, compare endPtr against endIdx using a negation,
  // so that undefined means Infinity)
  while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;

  if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
    return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
  }
  var str = "";
  // If building with TextDecoder, we have already computed the string length
  // above, so test loop end condition against that
  while (idx < endPtr) {
    // For UTF8 byte structure, see:
    // http://en.wikipedia.org/wiki/UTF-8#Description
    // https://www.ietf.org/rfc/rfc2279.txt
    // https://tools.ietf.org/html/rfc3629
    var u0 = heapOrArray[idx++];
    if (!(u0 & 0x80)) {
      str += String.fromCharCode(u0);
      continue;
    }
    var u1 = heapOrArray[idx++] & 63;
    if ((u0 & 0xe0) == 0xc0) {
      str += String.fromCharCode(((u0 & 31) << 6) | u1);
      continue;
    }
    var u2 = heapOrArray[idx++] & 63;
    if ((u0 & 0xf0) == 0xe0) {
      u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
    } else {
      u0 =
        ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heapOrArray[idx++] & 63);
    }

    if (u0 < 0x10000) {
      str += String.fromCharCode(u0);
    } else {
      var ch = u0 - 0x10000;
      str += String.fromCharCode(0xd800 | (ch >> 10), 0xdc00 | (ch & 0x3ff));
    }
  }
  return str;
};

var FS_stdin_getChar_buffer = [];

var lengthBytesUTF8 = str => {
  var len = 0;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code
    // unit, not a Unicode code point of the character! So decode
    // UTF16->UTF32->UTF8.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var c = str.charCodeAt(i); // possibly a lead surrogate
    if (c <= 0x7f) {
      len++;
    } else if (c <= 0x7ff) {
      len += 2;
    } else if (c >= 0xd800 && c <= 0xdfff) {
      len += 4;
      ++i;
    } else {
      len += 3;
    }
  }
  return len;
};

var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
  // Parameter maxBytesToWrite is not optional. Negative values, 0, null,
  // undefined and false each don't write out any bytes.
  if (!(maxBytesToWrite > 0)) return 0;

  var startIdx = outIdx;
  var endIdx = outIdx + maxBytesToWrite - 1; // -1 for string null terminator.
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code
    // unit, not a Unicode code point of the character! So decode
    // UTF16->UTF32->UTF8.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description
    // and https://www.ietf.org/rfc/rfc2279.txt
    // and https://tools.ietf.org/html/rfc3629
    var u = str.charCodeAt(i); // possibly a lead surrogate
    if (u >= 0xd800 && u <= 0xdfff) {
      var u1 = str.charCodeAt(++i);
      u = (0x10000 + ((u & 0x3ff) << 10)) | (u1 & 0x3ff);
    }
    if (u <= 0x7f) {
      if (outIdx >= endIdx) break;
      heap[outIdx++] = u;
    } else if (u <= 0x7ff) {
      if (outIdx + 1 >= endIdx) break;
      heap[outIdx++] = 0xc0 | (u >> 6);
      heap[outIdx++] = 0x80 | (u & 63);
    } else if (u <= 0xffff) {
      if (outIdx + 2 >= endIdx) break;
      heap[outIdx++] = 0xe0 | (u >> 12);
      heap[outIdx++] = 0x80 | ((u >> 6) & 63);
      heap[outIdx++] = 0x80 | (u & 63);
    } else {
      if (outIdx + 3 >= endIdx) break;
      heap[outIdx++] = 0xf0 | (u >> 18);
      heap[outIdx++] = 0x80 | ((u >> 12) & 63);
      heap[outIdx++] = 0x80 | ((u >> 6) & 63);
      heap[outIdx++] = 0x80 | (u & 63);
    }
  }
  // Null-terminate the pointer to the buffer.
  heap[outIdx] = 0;
  return outIdx - startIdx;
};
/** @type {function(string, boolean=, number=)} */
function intArrayFromString(stringy, dontAddNull, length) {
  var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
  var u8array = new Array(len);
  var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
  if (dontAddNull) u8array.length = numBytesWritten;
  return u8array;
}
var FS_stdin_getChar = () => {
  if (!FS_stdin_getChar_buffer.length) {
    var result = null;
    if (ENVIRONMENT_IS_NODE) {
      // we will read data by chunks of BUFSIZE
      var BUFSIZE = 256;
      var buf = Buffer.alloc(BUFSIZE);
      var bytesRead = 0;

      // For some reason we must suppress a closure warning here, even though
      // fd definitely exists on process.stdin, and is even the proper way to
      // get the fd of stdin,
      // https://github.com/nodejs/help/issues/2136#issuecomment-523649904
      // This started to happen after moving this logic out of library_tty.js,
      // so it is related to the surrounding code in some unclear manner.
      /** @suppress {missingProperties} */
      var fd = process.stdin.fd;

      try {
        bytesRead = fs.readSync(fd, buf, 0, BUFSIZE, -1);
      } catch (e) {
        // Cross-platform differences: on Windows, reading EOF throws an exception, but on other OSes,
        // reading EOF returns 0. Uniformize behavior by treating the EOF exception to return 0.
        if (e.toString().includes("EOF")) bytesRead = 0;
        else throw e;
      }

      if (bytesRead > 0) {
        result = buf.slice(0, bytesRead).toString("utf-8");
      } else {
        result = null;
      }
    } else if (
      typeof window != "undefined" &&
      typeof window.prompt == "function"
    ) {
      // Browser.
      result = window.prompt("Input: "); // returns null on cancel
      if (result !== null) {
        result += "\n";
      }
    } else if (typeof readline == "function") {
      // Command line.
      result = readline();
      if (result !== null) {
        result += "\n";
      }
    }
    if (!result) {
      return null;
    }
    FS_stdin_getChar_buffer = intArrayFromString(result, true);
  }
  return FS_stdin_getChar_buffer.shift();
};
var TTY = {
  ttys: [],
  init: function () {
    // https://github.com/emscripten-core/emscripten/pull/1555
    // if (ENVIRONMENT_IS_NODE) {
    //   // currently, FS.init does not distinguish if process.stdin is a file or TTY
    //   // device, it always assumes it's a TTY device. because of this, we're forcing
    //   // process.stdin to UTF8 encoding to at least make stdin reading compatible
    //   // with text files until FS.init can be refactored.
    //   process.stdin.setEncoding('utf8');
    // }
  },
  shutdown: function () {
    // https://github.com/emscripten-core/emscripten/pull/1555
    // if (ENVIRONMENT_IS_NODE) {
    //   // inolen: any idea as to why node -e 'process.stdin.read()' wouldn't exit immediately (with process.stdin being a tty)?
    //   // isaacs: because now it's reading from the stream, you've expressed interest in it, so that read() kicks off a _read() which creates a ReadReq operation
    //   // inolen: I thought read() in that case was a synchronous operation that just grabbed some amount of buffered data if it exists?
    //   // isaacs: it is. but it also triggers a _read() call, which calls readStart() on the handle
    //   // isaacs: do process.stdin.pause() and i'd think it'd probably close the pending call
    //   process.stdin.pause();
    // }
  },
  register: function (dev, ops) {
    TTY.ttys[dev] = { input: [], output: [], ops: ops };
    FS.registerDevice(dev, TTY.stream_ops);
  },
  stream_ops: {
    open: function (stream) {
      var tty = TTY.ttys[stream.node.rdev];
      if (!tty) {
        throw new FS.ErrnoError(43);
      }
      stream.tty = tty;
      stream.seekable = false;
    },
    close: function (stream) {
      // flush any pending line data
      stream.tty.ops.fsync(stream.tty);
    },
    fsync: function (stream) {
      stream.tty.ops.fsync(stream.tty);
    },
    read: function (stream, buffer, offset, length, pos /* ignored */) {
      if (!stream.tty || !stream.tty.ops.get_char) {
        throw new FS.ErrnoError(60);
      }
      var bytesRead = 0;
      for (var i = 0; i < length; i++) {
        var result;
        try {
          result = stream.tty.ops.get_char(stream.tty);
        } catch (e) {
          throw new FS.ErrnoError(29);
        }
        if (result === undefined && bytesRead === 0) {
          throw new FS.ErrnoError(6);
        }
        if (result === null || result === undefined) break;
        bytesRead++;
        buffer[offset + i] = result;
      }
      if (bytesRead) {
        stream.node.timestamp = Date.now();
      }
      return bytesRead;
    },
    write: function (stream, buffer, offset, length, pos) {
      if (!stream.tty || !stream.tty.ops.put_char) {
        throw new FS.ErrnoError(60);
      }
      try {
        for (var i = 0; i < length; i++) {
          stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
        }
      } catch (e) {
        throw new FS.ErrnoError(29);
      }
      if (length) {
        stream.node.timestamp = Date.now();
      }
      return i;
    }
  },
  default_tty_ops: {
    get_char: function (tty) {
      return FS_stdin_getChar();
    },
    put_char: function (tty, val) {
      if (val === null || val === 10) {
        out(UTF8ArrayToString(tty.output, 0));
        tty.output = [];
      } else {
        if (val != 0) tty.output.push(val); // val == 0 would cut text output off in the middle.
      }
    },
    fsync: function (tty) {
      if (tty.output && tty.output.length > 0) {
        out(UTF8ArrayToString(tty.output, 0));
        tty.output = [];
      }
    },
    ioctl_tcgets: function (tty) {
      // typical setting
      return {
        c_iflag: 25856,
        c_oflag: 5,
        c_cflag: 191,
        c_lflag: 35387,
        c_cc: [
          0x03, 0x1c, 0x7f, 0x15, 0x04, 0x00, 0x01, 0x00, 0x11, 0x13, 0x1a,
          0x00, 0x12, 0x0f, 0x17, 0x16, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
        ]
      };
    },
    ioctl_tcsets: function (tty, optional_actions, data) {
      // currently just ignore
      return 0;
    },
    ioctl_tiocgwinsz: function (tty) {
      return [24, 80];
    }
  },
  default_tty1_ops: {
    put_char: function (tty, val) {
      if (val === null || val === 10) {
        err(UTF8ArrayToString(tty.output, 0));
        tty.output = [];
      } else {
        if (val != 0) tty.output.push(val);
      }
    },
    fsync: function (tty) {
      if (tty.output && tty.output.length > 0) {
        err(UTF8ArrayToString(tty.output, 0));
        tty.output = [];
      }
    }
  }
};

var zeroMemory = (address, size) => {
  HEAPU8.fill(0, address, address + size);
  return address;
};

var alignMemory = (size, alignment) => {
  return Math.ceil(size / alignment) * alignment;
};
var mmapAlloc = size => {
  abort();
};
var MEMFS = {
  ops_table: null,
  mount(mount) {
    return MEMFS.createNode(null, "/", 16384 | 511 /* 0777 */, 0);
  },
  createNode(parent, name, mode, dev) {
    if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
      // no supported
      throw new FS.ErrnoError(63);
    }
    if (!MEMFS.ops_table) {
      MEMFS.ops_table = {
        dir: {
          node: {
            getattr: MEMFS.node_ops.getattr,
            setattr: MEMFS.node_ops.setattr,
            lookup: MEMFS.node_ops.lookup,
            mknod: MEMFS.node_ops.mknod,
            rename: MEMFS.node_ops.rename,
            unlink: MEMFS.node_ops.unlink,
            rmdir: MEMFS.node_ops.rmdir,
            readdir: MEMFS.node_ops.readdir,
            symlink: MEMFS.node_ops.symlink
          },
          stream: {
            llseek: MEMFS.stream_ops.llseek
          }
        },
        file: {
          node: {
            getattr: MEMFS.node_ops.getattr,
            setattr: MEMFS.node_ops.setattr
          },
          stream: {
            llseek: MEMFS.stream_ops.llseek,
            read: MEMFS.stream_ops.read,
            write: MEMFS.stream_ops.write,
            allocate: MEMFS.stream_ops.allocate,
            mmap: MEMFS.stream_ops.mmap,
            msync: MEMFS.stream_ops.msync
          }
        },
        link: {
          node: {
            getattr: MEMFS.node_ops.getattr,
            setattr: MEMFS.node_ops.setattr,
            readlink: MEMFS.node_ops.readlink
          },
          stream: {}
        },
        chrdev: {
          node: {
            getattr: MEMFS.node_ops.getattr,
            setattr: MEMFS.node_ops.setattr
          },
          stream: FS.chrdev_stream_ops
        }
      };
    }
    var node = FS.createNode(parent, name, mode, dev);
    if (FS.isDir(node.mode)) {
      node.node_ops = MEMFS.ops_table.dir.node;
      node.stream_ops = MEMFS.ops_table.dir.stream;
      node.contents = {};
    } else if (FS.isFile(node.mode)) {
      node.node_ops = MEMFS.ops_table.file.node;
      node.stream_ops = MEMFS.ops_table.file.stream;
      node.usedBytes = 0; // The actual number of bytes used in the typed array, as opposed to contents.length which gives the whole capacity.
      // When the byte data of the file is populated, this will point to either a typed array, or a normal JS array. Typed arrays are preferred
      // for performance, and used by default. However, typed arrays are not resizable like normal JS arrays are, so there is a small disk size
      // penalty involved for appending file writes that continuously grow a file similar to std::vector capacity vs used -scheme.
      node.contents = null;
    } else if (FS.isLink(node.mode)) {
      node.node_ops = MEMFS.ops_table.link.node;
      node.stream_ops = MEMFS.ops_table.link.stream;
    } else if (FS.isChrdev(node.mode)) {
      node.node_ops = MEMFS.ops_table.chrdev.node;
      node.stream_ops = MEMFS.ops_table.chrdev.stream;
    }
    node.timestamp = Date.now();
    // add the new node to the parent
    if (parent) {
      parent.contents[name] = node;
      parent.timestamp = node.timestamp;
    }
    return node;
  },
  getFileDataAsTypedArray(node) {
    if (!node.contents) return new Uint8Array(0);
    if (node.contents.subarray)
      return node.contents.subarray(0, node.usedBytes); // Make sure to not return excess unused bytes.
    return new Uint8Array(node.contents);
  },
  expandFileStorage(node, newCapacity) {
    var prevCapacity = node.contents ? node.contents.length : 0;
    if (prevCapacity >= newCapacity) return; // No need to expand, the storage was already large enough.
    // Don't expand strictly to the given requested limit if it's only a very small increase, but instead geometrically grow capacity.
    // For small filesizes (<1MB), perform size*2 geometric increase, but for large sizes, do a much more conservative size*1.125 increase to
    // avoid overshooting the allocation cap by a very large margin.
    var CAPACITY_DOUBLING_MAX = 1024 * 1024;
    newCapacity = Math.max(
      newCapacity,
      (prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2.0 : 1.125)) >>>
        0
    );
    if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256); // At minimum allocate 256b for each file when expanding.
    var oldContents = node.contents;
    node.contents = new Uint8Array(newCapacity); // Allocate new storage.
    if (node.usedBytes > 0)
      node.contents.set(oldContents.subarray(0, node.usedBytes), 0); // Copy old data over to the new storage.
  },
  resizeFileStorage(node, newSize) {
    if (node.usedBytes == newSize) return;
    if (newSize == 0) {
      node.contents = null; // Fully decommit when requesting a resize to zero.
      node.usedBytes = 0;
    } else {
      var oldContents = node.contents;
      node.contents = new Uint8Array(newSize); // Allocate new storage.
      if (oldContents) {
        node.contents.set(
          oldContents.subarray(0, Math.min(newSize, node.usedBytes))
        ); // Copy old data over to the new storage.
      }
      node.usedBytes = newSize;
    }
  },
  node_ops: {
    getattr(node) {
      var attr = {};
      // device numbers reuse inode numbers.
      attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
      attr.ino = node.id;
      attr.mode = node.mode;
      attr.nlink = 1;
      attr.uid = 0;
      attr.gid = 0;
      attr.rdev = node.rdev;
      if (FS.isDir(node.mode)) {
        attr.size = 4096;
      } else if (FS.isFile(node.mode)) {
        attr.size = node.usedBytes;
      } else if (FS.isLink(node.mode)) {
        attr.size = node.link.length;
      } else {
        attr.size = 0;
      }
      attr.atime = new Date(node.timestamp);
      attr.mtime = new Date(node.timestamp);
      attr.ctime = new Date(node.timestamp);
      // NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),
      //       but this is not required by the standard.
      attr.blksize = 4096;
      attr.blocks = Math.ceil(attr.size / attr.blksize);
      return attr;
    },
    setattr(node, attr) {
      if (attr.mode !== undefined) {
        node.mode = attr.mode;
      }
      if (attr.timestamp !== undefined) {
        node.timestamp = attr.timestamp;
      }
      if (attr.size !== undefined) {
        MEMFS.resizeFileStorage(node, attr.size);
      }
    },
    lookup(parent, name) {
      throw FS.genericErrors[44];
    },
    mknod(parent, name, mode, dev) {
      return MEMFS.createNode(parent, name, mode, dev);
    },
    rename(old_node, new_dir, new_name) {
      // if we're overwriting a directory at new_name, make sure it's empty.
      if (FS.isDir(old_node.mode)) {
        var new_node;
        try {
          new_node = FS.lookupNode(new_dir, new_name);
        } catch (e) {}
        if (new_node) {
          for (var i in new_node.contents) {
            throw new FS.ErrnoError(55);
          }
        }
      }
      // do the internal rewiring
      delete old_node.parent.contents[old_node.name];
      old_node.parent.timestamp = Date.now();
      old_node.name = new_name;
      new_dir.contents[new_name] = old_node;
      new_dir.timestamp = old_node.parent.timestamp;
      old_node.parent = new_dir;
    },
    unlink(parent, name) {
      delete parent.contents[name];
      parent.timestamp = Date.now();
    },
    rmdir(parent, name) {
      var node = FS.lookupNode(parent, name);
      for (var i in node.contents) {
        throw new FS.ErrnoError(55);
      }
      delete parent.contents[name];
      parent.timestamp = Date.now();
    },
    readdir(node) {
      var entries = [".", ".."];
      for (var key in node.contents) {
        if (!node.contents.hasOwnProperty(key)) {
          continue;
        }
        entries.push(key);
      }
      return entries;
    },
    symlink(parent, newname, oldpath) {
      var node = MEMFS.createNode(parent, newname, 511 /* 0777 */ | 40960, 0);
      node.link = oldpath;
      return node;
    },
    readlink(node) {
      if (!FS.isLink(node.mode)) {
        throw new FS.ErrnoError(28);
      }
      return node.link;
    }
  },
  stream_ops: {
    read(stream, buffer, offset, length, position) {
      var contents = stream.node.contents;
      if (position >= stream.node.usedBytes) return 0;
      var size = Math.min(stream.node.usedBytes - position, length);
      if (size > 8 && contents.subarray) {
        // non-trivial, and typed array
        buffer.set(contents.subarray(position, position + size), offset);
      } else {
        for (var i = 0; i < size; i++)
          buffer[offset + i] = contents[position + i];
      }
      return size;
    },
    write(stream, buffer, offset, length, position, canOwn) {
      // If the buffer is located in main memory (HEAP), and if
      // memory can grow, we can't hold on to references of the
      // memory buffer, as they may get invalidated. That means we
      // need to do copy its contents.
      if (buffer.buffer === HEAP8.buffer) {
        canOwn = false;
      }

      if (!length) return 0;
      var node = stream.node;
      node.timestamp = Date.now();

      if (buffer.subarray && (!node.contents || node.contents.subarray)) {
        // This write is from a typed array to a typed array?
        if (canOwn) {
          node.contents = buffer.subarray(offset, offset + length);
          node.usedBytes = length;
          return length;
        } else if (node.usedBytes === 0 && position === 0) {
          // If this is a simple first write to an empty file, do a fast set since we don't need to care about old data.
          node.contents = buffer.slice(offset, offset + length);
          node.usedBytes = length;
          return length;
        } else if (position + length <= node.usedBytes) {
          // Writing to an already allocated and used subrange of the file?
          node.contents.set(buffer.subarray(offset, offset + length), position);
          return length;
        }
      }

      // Appending to an existing file and we need to reallocate, or source data did not come as a typed array.
      MEMFS.expandFileStorage(node, position + length);
      if (node.contents.subarray && buffer.subarray) {
        // Use typed array write which is available.
        node.contents.set(buffer.subarray(offset, offset + length), position);
      } else {
        for (var i = 0; i < length; i++) {
          node.contents[position + i] = buffer[offset + i]; // Or fall back to manual write if not.
        }
      }
      node.usedBytes = Math.max(node.usedBytes, position + length);
      return length;
    },
    llseek(stream, offset, whence) {
      var position = offset;
      if (whence === 1) {
        position += stream.position;
      } else if (whence === 2) {
        if (FS.isFile(stream.node.mode)) {
          position += stream.node.usedBytes;
        }
      }
      if (position < 0) {
        throw new FS.ErrnoError(28);
      }
      return position;
    },
    allocate(stream, offset, length) {
      MEMFS.expandFileStorage(stream.node, offset + length);
      stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
    },
    mmap(stream, length, position, prot, flags) {
      if (!FS.isFile(stream.node.mode)) {
        throw new FS.ErrnoError(43);
      }
      var ptr;
      var allocated;
      var contents = stream.node.contents;
      // Only make a new copy when MAP_PRIVATE is specified.
      if (!(flags & 2) && contents.buffer === HEAP8.buffer) {
        // We can't emulate MAP_SHARED when the file is not backed by the
        // buffer we're mapping to (e.g. the HEAP buffer).
        allocated = false;
        ptr = contents.byteOffset;
      } else {
        // Try to avoid unnecessary slices.
        if (position > 0 || position + length < contents.length) {
          if (contents.subarray) {
            contents = contents.subarray(position, position + length);
          } else {
            contents = Array.prototype.slice.call(
              contents,
              position,
              position + length
            );
          }
        }
        allocated = true;
        ptr = mmapAlloc(length);
        if (!ptr) {
          throw new FS.ErrnoError(48);
        }
        HEAP8.set(contents, ptr);
      }
      return { ptr, allocated };
    },
    msync(stream, buffer, offset, length, mmapFlags) {
      MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
      // should we check if bytesWritten and length are the same?
      return 0;
    }
  }
};

/** @param {boolean=} noRunDep */
var asyncLoad = (url, onload, onerror, noRunDep) => {
  var dep = !noRunDep ? getUniqueRunDependency(`al ${url}`) : "";
  readAsync(
    url,
    arrayBuffer => {
      assert(
        arrayBuffer,
        `Loading data file "${url}" failed (no arrayBuffer).`
      );
      onload(new Uint8Array(arrayBuffer));
      if (dep) removeRunDependency(dep);
    },
    event => {
      if (onerror) {
        onerror();
      } else {
        throw `Loading data file "${url}" failed.`;
      }
    }
  );
  if (dep) addRunDependency(dep);
};

var preloadPlugins = Module["preloadPlugins"] || [];
function FS_handledByPreloadPlugin(byteArray, fullname, finish, onerror) {
  // Ensure plugins are ready.
  if (typeof Browser != "undefined") Browser.init();

  var handled = false;
  preloadPlugins.forEach(function (plugin) {
    if (handled) return;
    if (plugin["canHandle"](fullname)) {
      plugin["handle"](byteArray, fullname, finish, onerror);
      handled = true;
    }
  });
  return handled;
}
function FS_createPreloadedFile(
  parent,
  name,
  url,
  canRead,
  canWrite,
  onload,
  onerror,
  dontCreateFile,
  canOwn,
  preFinish
) {
  // TODO we should allow people to just pass in a complete filename instead
  // of parent and name being that we just join them anyways
  var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
  var dep = getUniqueRunDependency(`cp ${fullname}`); // might have several active requests for the same fullname
  function processData(byteArray) {
    function finish(byteArray) {
      if (preFinish) preFinish();
      if (!dontCreateFile) {
        FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
      }
      if (onload) onload();
      removeRunDependency(dep);
    }
    if (
      FS_handledByPreloadPlugin(byteArray, fullname, finish, () => {
        if (onerror) onerror();
        removeRunDependency(dep);
      })
    ) {
      return;
    }
    finish(byteArray);
  }
  addRunDependency(dep);
  if (typeof url == "string") {
    asyncLoad(url, byteArray => processData(byteArray), onerror);
  } else {
    processData(url);
  }
}

function FS_modeStringToFlags(str) {
  var flagModes = {
    r: 0,
    "r+": 2,
    w: 512 | 64 | 1,
    "w+": 512 | 64 | 2,
    a: 1024 | 64 | 1,
    "a+": 1024 | 64 | 2
  };
  var flags = flagModes[str];
  if (typeof flags == "undefined") {
    throw new Error(`Unknown file open mode: ${str}`);
  }
  return flags;
}

function FS_getMode(canRead, canWrite) {
  var mode = 0;
  if (canRead) mode |= 292 | 73;
  if (canWrite) mode |= 146;
  return mode;
}

var WORKERFS = {
  DIR_MODE: 16895,
  FILE_MODE: 33279,
  reader: null,
  mount(mount) {
    assert(ENVIRONMENT_IS_WORKER);
    if (!WORKERFS.reader) WORKERFS.reader = new FileReaderSync();
    var root = WORKERFS.createNode(null, "/", WORKERFS.DIR_MODE, 0);
    var createdParents = {};
    function ensureParent(path) {
      // return the parent node, creating subdirs as necessary
      var parts = path.split("/");
      var parent = root;
      for (var i = 0; i < parts.length - 1; i++) {
        var curr = parts.slice(0, i + 1).join("/");
        // Issue 4254: Using curr as a node name will prevent the node
        // from being found in FS.nameTable when FS.open is called on
        // a path which holds a child of this node,
        // given that all FS functions assume node names
        // are just their corresponding parts within their given path,
        // rather than incremental aggregates which include their parent's
        // directories.
        if (!createdParents[curr]) {
          createdParents[curr] = WORKERFS.createNode(
            parent,
            parts[i],
            WORKERFS.DIR_MODE,
            0
          );
        }
        parent = createdParents[curr];
      }
      return parent;
    }
    function base(path) {
      var parts = path.split("/");
      return parts[parts.length - 1];
    }
    // We also accept FileList here, by using Array.prototype
    Array.prototype.forEach.call(mount.opts["files"] || [], function (file) {
      WORKERFS.createNode(
        ensureParent(file.name),
        base(file.name),
        WORKERFS.FILE_MODE,
        0,
        file,
        file.lastModifiedDate
      );
    });
    (mount.opts["blobs"] || []).forEach(function (obj) {
      WORKERFS.createNode(
        ensureParent(obj["name"]),
        base(obj["name"]),
        WORKERFS.FILE_MODE,
        0,
        obj["data"]
      );
    });
    (mount.opts["packages"] || []).forEach(function (pack) {
      pack["metadata"].files.forEach(function (file) {
        var name = file.filename.substr(1); // remove initial slash
        WORKERFS.createNode(
          ensureParent(name),
          base(name),
          WORKERFS.FILE_MODE,
          0,
          pack["blob"].slice(file.start, file.end)
        );
      });
    });
    return root;
  },
  createNode(parent, name, mode, dev, contents, mtime) {
    var node = FS.createNode(parent, name, mode);
    node.mode = mode;
    node.node_ops = WORKERFS.node_ops;
    node.stream_ops = WORKERFS.stream_ops;
    node.timestamp = (mtime || new Date()).getTime();
    assert(WORKERFS.FILE_MODE !== WORKERFS.DIR_MODE);
    if (mode === WORKERFS.FILE_MODE) {
      node.size = contents.size;
      node.contents = contents;
    } else {
      node.size = 4096;
      node.contents = {};
    }
    if (parent) {
      parent.contents[name] = node;
    }
    return node;
  },
  node_ops: {
    getattr(node) {
      return {
        dev: 1,
        ino: node.id,
        mode: node.mode,
        nlink: 1,
        uid: 0,
        gid: 0,
        rdev: 0,
        size: node.size,
        atime: new Date(node.timestamp),
        mtime: new Date(node.timestamp),
        ctime: new Date(node.timestamp),
        blksize: 4096,
        blocks: Math.ceil(node.size / 4096)
      };
    },
    setattr(node, attr) {
      if (attr.mode !== undefined) {
        node.mode = attr.mode;
      }
      if (attr.timestamp !== undefined) {
        node.timestamp = attr.timestamp;
      }
    },
    lookup(parent, name) {
      throw new FS.ErrnoError(44);
    },
    mknod(parent, name, mode, dev) {
      throw new FS.ErrnoError(63);
    },
    rename(oldNode, newDir, newName) {
      throw new FS.ErrnoError(63);
    },
    unlink(parent, name) {
      throw new FS.ErrnoError(63);
    },
    rmdir(parent, name) {
      throw new FS.ErrnoError(63);
    },
    readdir(node) {
      var entries = [".", ".."];
      for (var key in node.contents) {
        if (!node.contents.hasOwnProperty(key)) {
          continue;
        }
        entries.push(key);
      }
      return entries;
    },
    symlink(parent, newName, oldPath) {
      throw new FS.ErrnoError(63);
    }
  },
  stream_ops: {
    read(stream, buffer, offset, length, position) {
      if (position >= stream.node.size) return 0;
      var chunk = stream.node.contents.slice(position, position + length);
      var ab = WORKERFS.reader.readAsArrayBuffer(chunk);
      buffer.set(new Uint8Array(ab), offset);
      return chunk.size;
    },
    write(stream, buffer, offset, length, position) {
      throw new FS.ErrnoError(29);
    },
    llseek(stream, offset, whence) {
      var position = offset;
      if (whence === 1) {
        position += stream.position;
      } else if (whence === 2) {
        if (FS.isFile(stream.node.mode)) {
          position += stream.node.size;
        }
      }
      if (position < 0) {
        throw new FS.ErrnoError(28);
      }
      return position;
    }
  }
};
var FS = {
  root: null,
  mounts: [],
  devices: {},
  streams: [],
  nextInode: 1,
  nameTable: null,
  currentPath: "/",
  initialized: false,
  ignorePermissions: true,
  ErrnoError: null,
  genericErrors: {},
  filesystems: null,
  syncFSRequests: 0,
  lookupPath: (path, opts = {}) => {
    path = PATH_FS.resolve(path);

    if (!path) return { path: "", node: null };

    var defaults = {
      follow_mount: true,
      recurse_count: 0
    };
    opts = Object.assign(defaults, opts);

    if (opts.recurse_count > 8) {
      // max recursive lookup of 8
      throw new FS.ErrnoError(32);
    }

    // split the absolute path
    var parts = path.split("/").filter(p => !!p);

    // start at the root
    var current = FS.root;
    var current_path = "/";

    for (var i = 0; i < parts.length; i++) {
      var islast = i === parts.length - 1;
      if (islast && opts.parent) {
        // stop resolving
        break;
      }

      current = FS.lookupNode(current, parts[i]);
      current_path = PATH.join2(current_path, parts[i]);

      // jump to the mount's root node if this is a mountpoint
      if (FS.isMountpoint(current)) {
        if (!islast || (islast && opts.follow_mount)) {
          current = current.mounted.root;
        }
      }

      // by default, lookupPath will not follow a symlink if it is the final path component.
      // setting opts.follow = true will override this behavior.
      if (!islast || opts.follow) {
        var count = 0;
        while (FS.isLink(current.mode)) {
          var link = FS.readlink(current_path);
          current_path = PATH_FS.resolve(PATH.dirname(current_path), link);

          var lookup = FS.lookupPath(current_path, {
            recurse_count: opts.recurse_count + 1
          });
          current = lookup.node;

          if (count++ > 40) {
            // limit max consecutive symlinks to 40 (SYMLOOP_MAX).
            throw new FS.ErrnoError(32);
          }
        }
      }
    }

    return { path: current_path, node: current };
  },
  getPath: node => {
    var path;
    while (true) {
      if (FS.isRoot(node)) {
        var mount = node.mount.mountpoint;
        if (!path) return mount;
        return mount[mount.length - 1] !== "/"
          ? `${mount}/${path}`
          : mount + path;
      }
      path = path ? `${node.name}/${path}` : node.name;
      node = node.parent;
    }
  },
  hashName: (parentid, name) => {
    var hash = 0;

    for (var i = 0; i < name.length; i++) {
      hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
    }
    return ((parentid + hash) >>> 0) % FS.nameTable.length;
  },
  hashAddNode: node => {
    var hash = FS.hashName(node.parent.id, node.name);
    node.name_next = FS.nameTable[hash];
    FS.nameTable[hash] = node;
  },
  hashRemoveNode: node => {
    var hash = FS.hashName(node.parent.id, node.name);
    if (FS.nameTable[hash] === node) {
      FS.nameTable[hash] = node.name_next;
    } else {
      var current = FS.nameTable[hash];
      while (current) {
        if (current.name_next === node) {
          current.name_next = node.name_next;
          break;
        }
        current = current.name_next;
      }
    }
  },
  lookupNode: (parent, name) => {
    var errCode = FS.mayLookup(parent);
    if (errCode) {
      throw new FS.ErrnoError(errCode, parent);
    }
    var hash = FS.hashName(parent.id, name);
    for (var node = FS.nameTable[hash]; node; node = node.name_next) {
      var nodeName = node.name;
      if (node.parent.id === parent.id && nodeName === name) {
        return node;
      }
    }
    // if we failed to find it in the cache, call into the VFS
    return FS.lookup(parent, name);
  },
  createNode: (parent, name, mode, rdev) => {
    var node = new FS.FSNode(parent, name, mode, rdev);

    FS.hashAddNode(node);

    return node;
  },
  destroyNode: node => {
    FS.hashRemoveNode(node);
  },
  isRoot: node => {
    return node === node.parent;
  },
  isMountpoint: node => {
    return !!node.mounted;
  },
  isFile: mode => {
    return (mode & 61440) === 32768;
  },
  isDir: mode => {
    return (mode & 61440) === 16384;
  },
  isLink: mode => {
    return (mode & 61440) === 40960;
  },
  isChrdev: mode => {
    return (mode & 61440) === 8192;
  },
  isBlkdev: mode => {
    return (mode & 61440) === 24576;
  },
  isFIFO: mode => {
    return (mode & 61440) === 4096;
  },
  isSocket: mode => {
    return (mode & 49152) === 49152;
  },
  flagsToPermissionString: flag => {
    var perms = ["r", "w", "rw"][flag & 3];
    if (flag & 512) {
      perms += "w";
    }
    return perms;
  },
  nodePermissions: (node, perms) => {
    if (FS.ignorePermissions) {
      return 0;
    }
    // return 0 if any user, group or owner bits are set.
    if (perms.includes("r") && !(node.mode & 292)) {
      return 2;
    } else if (perms.includes("w") && !(node.mode & 146)) {
      return 2;
    } else if (perms.includes("x") && !(node.mode & 73)) {
      return 2;
    }
    return 0;
  },
  mayLookup: dir => {
    var errCode = FS.nodePermissions(dir, "x");
    if (errCode) return errCode;
    if (!dir.node_ops.lookup) return 2;
    return 0;
  },
  mayCreate: (dir, name) => {
    try {
      var node = FS.lookupNode(dir, name);
      return 20;
    } catch (e) {}
    return FS.nodePermissions(dir, "wx");
  },
  mayDelete: (dir, name, isdir) => {
    var node;
    try {
      node = FS.lookupNode(dir, name);
    } catch (e) {
      return e.errno;
    }
    var errCode = FS.nodePermissions(dir, "wx");
    if (errCode) {
      return errCode;
    }
    if (isdir) {
      if (!FS.isDir(node.mode)) {
        return 54;
      }
      if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
        return 10;
      }
    } else {
      if (FS.isDir(node.mode)) {
        return 31;
      }
    }
    return 0;
  },
  mayOpen: (node, flags) => {
    if (!node) {
      return 44;
    }
    if (FS.isLink(node.mode)) {
      return 32;
    } else if (FS.isDir(node.mode)) {
      if (
        FS.flagsToPermissionString(flags) !== "r" || // opening for write
        flags & 512
      ) {
        // TODO: check for O_SEARCH? (== search for dir only)
        return 31;
      }
    }
    return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
  },
  MAX_OPEN_FDS: 4096,
  nextfd: () => {
    for (var fd = 0; fd <= FS.MAX_OPEN_FDS; fd++) {
      if (!FS.streams[fd]) {
        return fd;
      }
    }
    throw new FS.ErrnoError(33);
  },
  getStreamChecked: fd => {
    var stream = FS.getStream(fd);
    if (!stream) {
      throw new FS.ErrnoError(8);
    }
    return stream;
  },
  getStream: fd => FS.streams[fd],
  createStream: (stream, fd = -1) => {
    if (!FS.FSStream) {
      FS.FSStream = /** @constructor */ function () {
        this.shared = {};
      };
      FS.FSStream.prototype = {};
      Object.defineProperties(FS.FSStream.prototype, {
        object: {
          /** @this {FS.FSStream} */
          get() {
            return this.node;
          },
          /** @this {FS.FSStream} */
          set(val) {
            this.node = val;
          }
        },
        isRead: {
          /** @this {FS.FSStream} */
          get() {
            return (this.flags & 2097155) !== 1;
          }
        },
        isWrite: {
          /** @this {FS.FSStream} */
          get() {
            return (this.flags & 2097155) !== 0;
          }
        },
        isAppend: {
          /** @this {FS.FSStream} */
          get() {
            return this.flags & 1024;
          }
        },
        flags: {
          /** @this {FS.FSStream} */
          get() {
            return this.shared.flags;
          },
          /** @this {FS.FSStream} */
          set(val) {
            this.shared.flags = val;
          }
        },
        position: {
          /** @this {FS.FSStream} */
          get() {
            return this.shared.position;
          },
          /** @this {FS.FSStream} */
          set(val) {
            this.shared.position = val;
          }
        }
      });
    }
    // clone it, so we can return an instance of FSStream
    stream = Object.assign(new FS.FSStream(), stream);
    if (fd == -1) {
      fd = FS.nextfd();
    }
    stream.fd = fd;
    FS.streams[fd] = stream;
    return stream;
  },
  closeStream: fd => {
    FS.streams[fd] = null;
  },
  chrdev_stream_ops: {
    open: stream => {
      var device = FS.getDevice(stream.node.rdev);
      // override node's stream ops with the device's
      stream.stream_ops = device.stream_ops;
      // forward the open call
      if (stream.stream_ops.open) {
        stream.stream_ops.open(stream);
      }
    },
    llseek: () => {
      throw new FS.ErrnoError(70);
    }
  },
  major: dev => dev >> 8,
  minor: dev => dev & 0xff,
  makedev: (ma, mi) => (ma << 8) | mi,
  registerDevice: (dev, ops) => {
    FS.devices[dev] = { stream_ops: ops };
  },
  getDevice: dev => FS.devices[dev],
  getMounts: mount => {
    var mounts = [];
    var check = [mount];

    while (check.length) {
      var m = check.pop();

      mounts.push(m);

      check.push.apply(check, m.mounts);
    }

    return mounts;
  },
  syncfs: (populate, callback) => {
    if (typeof populate == "function") {
      callback = populate;
      populate = false;
    }

    FS.syncFSRequests++;

    if (FS.syncFSRequests > 1) {
      err(
        `warning: ${FS.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`
      );
    }

    var mounts = FS.getMounts(FS.root.mount);
    var completed = 0;

    function doCallback(errCode) {
      FS.syncFSRequests--;
      return callback(errCode);
    }

    function done(errCode) {
      if (errCode) {
        if (!done.errored) {
          done.errored = true;
          return doCallback(errCode);
        }
        return;
      }
      if (++completed >= mounts.length) {
        doCallback(null);
      }
    }

    // sync all mounts
    mounts.forEach(mount => {
      if (!mount.type.syncfs) {
        return done(null);
      }
      mount.type.syncfs(mount, populate, done);
    });
  },
  mount: (type, opts, mountpoint) => {
    var root = mountpoint === "/";
    var pseudo = !mountpoint;
    var node;

    if (root && FS.root) {
      throw new FS.ErrnoError(10);
    } else if (!root && !pseudo) {
      var lookup = FS.lookupPath(mountpoint, { follow_mount: false });

      mountpoint = lookup.path; // use the absolute path
      node = lookup.node;

      if (FS.isMountpoint(node)) {
        throw new FS.ErrnoError(10);
      }

      if (!FS.isDir(node.mode)) {
        throw new FS.ErrnoError(54);
      }
    }

    var mount = {
      type,
      opts,
      mountpoint,
      mounts: []
    };

    // create a root node for the fs
    var mountRoot = type.mount(mount);
    mountRoot.mount = mount;
    mount.root = mountRoot;

    if (root) {
      FS.root = mountRoot;
    } else if (node) {
      // set as a mountpoint
      node.mounted = mount;

      // add the new mount to the current mount's children
      if (node.mount) {
        node.mount.mounts.push(mount);
      }
    }

    return mountRoot;
  },
  unmount: mountpoint => {
    var lookup = FS.lookupPath(mountpoint, { follow_mount: false });

    if (!FS.isMountpoint(lookup.node)) {
      throw new FS.ErrnoError(28);
    }

    // destroy the nodes for this mount, and all its child mounts
    var node = lookup.node;
    var mount = node.mounted;
    var mounts = FS.getMounts(mount);

    Object.keys(FS.nameTable).forEach(hash => {
      var current = FS.nameTable[hash];

      while (current) {
        var next = current.name_next;

        if (mounts.includes(current.mount)) {
          FS.destroyNode(current);
        }

        current = next;
      }
    });

    // no longer a mountpoint
    node.mounted = null;

    // remove this mount from the child mounts
    var idx = node.mount.mounts.indexOf(mount);
    node.mount.mounts.splice(idx, 1);
  },
  lookup: (parent, name) => {
    return parent.node_ops.lookup(parent, name);
  },
  mknod: (path, mode, dev) => {
    var lookup = FS.lookupPath(path, { parent: true });
    var parent = lookup.node;
    var name = PATH.basename(path);
    if (!name || name === "." || name === "..") {
      throw new FS.ErrnoError(28);
    }
    var errCode = FS.mayCreate(parent, name);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.mknod) {
      throw new FS.ErrnoError(63);
    }
    return parent.node_ops.mknod(parent, name, mode, dev);
  },
  create: (path, mode) => {
    mode = mode !== undefined ? mode : 438 /* 0666 */;
    mode &= 4095;
    mode |= 32768;
    return FS.mknod(path, mode, 0);
  },
  mkdir: (path, mode) => {
    mode = mode !== undefined ? mode : 511 /* 0777 */;
    mode &= 511 | 512;
    mode |= 16384;
    return FS.mknod(path, mode, 0);
  },
  mkdirTree: (path, mode) => {
    var dirs = path.split("/");
    var d = "";
    for (var i = 0; i < dirs.length; ++i) {
      if (!dirs[i]) continue;
      d += "/" + dirs[i];
      try {
        FS.mkdir(d, mode);
      } catch (e) {
        if (e.errno != 20) throw e;
      }
    }
  },
  mkdev: (path, mode, dev) => {
    if (typeof dev == "undefined") {
      dev = mode;
      mode = 438 /* 0666 */;
    }
    mode |= 8192;
    return FS.mknod(path, mode, dev);
  },
  symlink: (oldpath, newpath) => {
    if (!PATH_FS.resolve(oldpath)) {
      throw new FS.ErrnoError(44);
    }
    var lookup = FS.lookupPath(newpath, { parent: true });
    var parent = lookup.node;
    if (!parent) {
      throw new FS.ErrnoError(44);
    }
    var newname = PATH.basename(newpath);
    var errCode = FS.mayCreate(parent, newname);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.symlink) {
      throw new FS.ErrnoError(63);
    }
    return parent.node_ops.symlink(parent, newname, oldpath);
  },
  rename: (old_path, new_path) => {
    var old_dirname = PATH.dirname(old_path);
    var new_dirname = PATH.dirname(new_path);
    var old_name = PATH.basename(old_path);
    var new_name = PATH.basename(new_path);
    // parents must exist
    var lookup, old_dir, new_dir;

    // let the errors from non existant directories percolate up
    lookup = FS.lookupPath(old_path, { parent: true });
    old_dir = lookup.node;
    lookup = FS.lookupPath(new_path, { parent: true });
    new_dir = lookup.node;

    if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
    // need to be part of the same mount
    if (old_dir.mount !== new_dir.mount) {
      throw new FS.ErrnoError(75);
    }
    // source must exist
    var old_node = FS.lookupNode(old_dir, old_name);
    // old path should not be an ancestor of the new path
    var relative = PATH_FS.relative(old_path, new_dirname);
    if (relative.charAt(0) !== ".") {
      throw new FS.ErrnoError(28);
    }
    // new path should not be an ancestor of the old path
    relative = PATH_FS.relative(new_path, old_dirname);
    if (relative.charAt(0) !== ".") {
      throw new FS.ErrnoError(55);
    }
    // see if the new path already exists
    var new_node;
    try {
      new_node = FS.lookupNode(new_dir, new_name);
    } catch (e) {
      // not fatal
    }
    // early out if nothing needs to change
    if (old_node === new_node) {
      return;
    }
    // we'll need to delete the old entry
    var isdir = FS.isDir(old_node.mode);
    var errCode = FS.mayDelete(old_dir, old_name, isdir);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    // need delete permissions if we'll be overwriting.
    // need create permissions if new doesn't already exist.
    errCode = new_node
      ? FS.mayDelete(new_dir, new_name, isdir)
      : FS.mayCreate(new_dir, new_name);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!old_dir.node_ops.rename) {
      throw new FS.ErrnoError(63);
    }
    if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
      throw new FS.ErrnoError(10);
    }
    // if we are going to change the parent, check write permissions
    if (new_dir !== old_dir) {
      errCode = FS.nodePermissions(old_dir, "w");
      if (errCode) {
        throw new FS.ErrnoError(errCode);
      }
    }
    // remove the node from the lookup hash
    FS.hashRemoveNode(old_node);
    // do the underlying fs rename
    try {
      old_dir.node_ops.rename(old_node, new_dir, new_name);
    } catch (e) {
      throw e;
    } finally {
      // add the node back to the hash (in case node_ops.rename
      // changed its name)
      FS.hashAddNode(old_node);
    }
  },
  rmdir: path => {
    var lookup = FS.lookupPath(path, { parent: true });
    var parent = lookup.node;
    var name = PATH.basename(path);
    var node = FS.lookupNode(parent, name);
    var errCode = FS.mayDelete(parent, name, true);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.rmdir) {
      throw new FS.ErrnoError(63);
    }
    if (FS.isMountpoint(node)) {
      throw new FS.ErrnoError(10);
    }
    parent.node_ops.rmdir(parent, name);
    FS.destroyNode(node);
  },
  readdir: path => {
    var lookup = FS.lookupPath(path, { follow: true });
    var node = lookup.node;
    if (!node.node_ops.readdir) {
      throw new FS.ErrnoError(54);
    }
    return node.node_ops.readdir(node);
  },
  unlink: path => {
    var lookup = FS.lookupPath(path, { parent: true });
    var parent = lookup.node;
    if (!parent) {
      throw new FS.ErrnoError(44);
    }
    var name = PATH.basename(path);
    var node = FS.lookupNode(parent, name);
    var errCode = FS.mayDelete(parent, name, false);
    if (errCode) {
      // According to POSIX, we should map EISDIR to EPERM, but
      // we instead do what Linux does (and we must, as we use
      // the musl linux libc).
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.unlink) {
      throw new FS.ErrnoError(63);
    }
    if (FS.isMountpoint(node)) {
      throw new FS.ErrnoError(10);
    }
    parent.node_ops.unlink(parent, name);
    FS.destroyNode(node);
  },
  readlink: path => {
    var lookup = FS.lookupPath(path);
    var link = lookup.node;
    if (!link) {
      throw new FS.ErrnoError(44);
    }
    if (!link.node_ops.readlink) {
      throw new FS.ErrnoError(28);
    }
    return PATH_FS.resolve(
      FS.getPath(link.parent),
      link.node_ops.readlink(link)
    );
  },
  stat: (path, dontFollow) => {
    var lookup = FS.lookupPath(path, { follow: !dontFollow });
    var node = lookup.node;
    if (!node) {
      throw new FS.ErrnoError(44);
    }
    if (!node.node_ops.getattr) {
      throw new FS.ErrnoError(63);
    }
    return node.node_ops.getattr(node);
  },
  lstat: path => {
    return FS.stat(path, true);
  },
  chmod: (path, mode, dontFollow) => {
    var node;
    if (typeof path == "string") {
      var lookup = FS.lookupPath(path, { follow: !dontFollow });
      node = lookup.node;
    } else {
      node = path;
    }
    if (!node.node_ops.setattr) {
      throw new FS.ErrnoError(63);
    }
    node.node_ops.setattr(node, {
      mode: (mode & 4095) | (node.mode & ~4095),
      timestamp: Date.now()
    });
  },
  lchmod: (path, mode) => {
    FS.chmod(path, mode, true);
  },
  fchmod: (fd, mode) => {
    var stream = FS.getStreamChecked(fd);
    FS.chmod(stream.node, mode);
  },
  chown: (path, uid, gid, dontFollow) => {
    var node;
    if (typeof path == "string") {
      var lookup = FS.lookupPath(path, { follow: !dontFollow });
      node = lookup.node;
    } else {
      node = path;
    }
    if (!node.node_ops.setattr) {
      throw new FS.ErrnoError(63);
    }
    node.node_ops.setattr(node, {
      timestamp: Date.now()
      // we ignore the uid / gid for now
    });
  },
  lchown: (path, uid, gid) => {
    FS.chown(path, uid, gid, true);
  },
  fchown: (fd, uid, gid) => {
    var stream = FS.getStreamChecked(fd);
    FS.chown(stream.node, uid, gid);
  },
  truncate: (path, len) => {
    if (len < 0) {
      throw new FS.ErrnoError(28);
    }
    var node;
    if (typeof path == "string") {
      var lookup = FS.lookupPath(path, { follow: true });
      node = lookup.node;
    } else {
      node = path;
    }
    if (!node.node_ops.setattr) {
      throw new FS.ErrnoError(63);
    }
    if (FS.isDir(node.mode)) {
      throw new FS.ErrnoError(31);
    }
    if (!FS.isFile(node.mode)) {
      throw new FS.ErrnoError(28);
    }
    var errCode = FS.nodePermissions(node, "w");
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    node.node_ops.setattr(node, {
      size: len,
      timestamp: Date.now()
    });
  },
  ftruncate: (fd, len) => {
    var stream = FS.getStreamChecked(fd);
    if ((stream.flags & 2097155) === 0) {
      throw new FS.ErrnoError(28);
    }
    FS.truncate(stream.node, len);
  },
  utime: (path, atime, mtime) => {
    var lookup = FS.lookupPath(path, { follow: true });
    var node = lookup.node;
    node.node_ops.setattr(node, {
      timestamp: Math.max(atime, mtime)
    });
  },
  open: (path, flags, mode) => {
    if (path === "") {
      throw new FS.ErrnoError(44);
    }
    flags = typeof flags == "string" ? FS_modeStringToFlags(flags) : flags;
    mode = typeof mode == "undefined" ? 438 /* 0666 */ : mode;
    if (flags & 64) {
      mode = (mode & 4095) | 32768;
    } else {
      mode = 0;
    }
    var node;
    if (typeof path == "object") {
      node = path;
    } else {
      path = PATH.normalize(path);
      try {
        var lookup = FS.lookupPath(path, {
          follow: !(flags & 131072)
        });
        node = lookup.node;
      } catch (e) {
        // ignore
      }
    }
    // perhaps we need to create the node
    var created = false;
    if (flags & 64) {
      if (node) {
        // if O_CREAT and O_EXCL are set, error out if the node already exists
        if (flags & 128) {
          throw new FS.ErrnoError(20);
        }
      } else {
        // node doesn't exist, try to create it
        node = FS.mknod(path, mode, 0);
        created = true;
      }
    }
    if (!node) {
      throw new FS.ErrnoError(44);
    }
    // can't truncate a device
    if (FS.isChrdev(node.mode)) {
      flags &= ~512;
    }
    // if asked only for a directory, then this must be one
    if (flags & 65536 && !FS.isDir(node.mode)) {
      throw new FS.ErrnoError(54);
    }
    // check permissions, if this is not a file we just created now (it is ok to
    // create and write to a file with read-only permissions; it is read-only
    // for later use)
    if (!created) {
      var errCode = FS.mayOpen(node, flags);
      if (errCode) {
        throw new FS.ErrnoError(errCode);
      }
    }
    // do truncation if necessary
    if (flags & 512 && !created) {
      FS.truncate(node, 0);
    }
    // we've already handled these, don't pass down to the underlying vfs
    flags &= ~(128 | 512 | 131072);

    // register the stream with the filesystem
    var stream = FS.createStream({
      node,
      path: FS.getPath(node), // we want the absolute path to the node
      flags,
      seekable: true,
      position: 0,
      stream_ops: node.stream_ops,
      // used by the file family libc calls (fopen, fwrite, ferror, etc.)
      ungotten: [],
      error: false
    });
    // call the new stream's open function
    if (stream.stream_ops.open) {
      stream.stream_ops.open(stream);
    }
    if (Module["logReadFiles"] && !(flags & 1)) {
      if (!FS.readFiles) FS.readFiles = {};
      if (!(path in FS.readFiles)) {
        FS.readFiles[path] = 1;
      }
    }
    return stream;
  },
  close: stream => {
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if (stream.getdents) stream.getdents = null; // free readdir state
    try {
      if (stream.stream_ops.close) {
        stream.stream_ops.close(stream);
      }
    } catch (e) {
      throw e;
    } finally {
      FS.closeStream(stream.fd);
    }
    stream.fd = null;
  },
  isClosed: stream => {
    return stream.fd === null;
  },
  llseek: (stream, offset, whence) => {
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if (!stream.seekable || !stream.stream_ops.llseek) {
      throw new FS.ErrnoError(70);
    }
    if (whence != 0 && whence != 1 && whence != 2) {
      throw new FS.ErrnoError(28);
    }
    stream.position = stream.stream_ops.llseek(stream, offset, whence);
    stream.ungotten = [];
    return stream.position;
  },
  read: (stream, buffer, offset, length, position) => {
    if (length < 0 || position < 0) {
      throw new FS.ErrnoError(28);
    }
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if ((stream.flags & 2097155) === 1) {
      throw new FS.ErrnoError(8);
    }
    if (FS.isDir(stream.node.mode)) {
      throw new FS.ErrnoError(31);
    }
    if (!stream.stream_ops.read) {
      throw new FS.ErrnoError(28);
    }
    var seeking = typeof position != "undefined";
    if (!seeking) {
      position = stream.position;
    } else if (!stream.seekable) {
      throw new FS.ErrnoError(70);
    }
    var bytesRead = stream.stream_ops.read(
      stream,
      buffer,
      offset,
      length,
      position
    );
    if (!seeking) stream.position += bytesRead;
    return bytesRead;
  },
  write: (stream, buffer, offset, length, position, canOwn) => {
    if (length < 0 || position < 0) {
      throw new FS.ErrnoError(28);
    }
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if ((stream.flags & 2097155) === 0) {
      throw new FS.ErrnoError(8);
    }
    if (FS.isDir(stream.node.mode)) {
      throw new FS.ErrnoError(31);
    }
    if (!stream.stream_ops.write) {
      throw new FS.ErrnoError(28);
    }
    if (stream.seekable && stream.flags & 1024) {
      // seek to the end before writing in append mode
      FS.llseek(stream, 0, 2);
    }
    var seeking = typeof position != "undefined";
    if (!seeking) {
      position = stream.position;
    } else if (!stream.seekable) {
      throw new FS.ErrnoError(70);
    }
    var bytesWritten = stream.stream_ops.write(
      stream,
      buffer,
      offset,
      length,
      position,
      canOwn
    );
    if (!seeking) stream.position += bytesWritten;
    return bytesWritten;
  },
  allocate: (stream, offset, length) => {
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if (offset < 0 || length <= 0) {
      throw new FS.ErrnoError(28);
    }
    if ((stream.flags & 2097155) === 0) {
      throw new FS.ErrnoError(8);
    }
    if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
      throw new FS.ErrnoError(43);
    }
    if (!stream.stream_ops.allocate) {
      throw new FS.ErrnoError(138);
    }
    stream.stream_ops.allocate(stream, offset, length);
  },
  mmap: (stream, length, position, prot, flags) => {
    // User requests writing to file (prot & PROT_WRITE != 0).
    // Checking if we have permissions to write to the file unless
    // MAP_PRIVATE flag is set. According to POSIX spec it is possible
    // to write to file opened in read-only mode with MAP_PRIVATE flag,
    // as all modifications will be visible only in the memory of
    // the current process.
    if (
      (prot & 2) !== 0 &&
      (flags & 2) === 0 &&
      (stream.flags & 2097155) !== 2
    ) {
      throw new FS.ErrnoError(2);
    }
    if ((stream.flags & 2097155) === 1) {
      throw new FS.ErrnoError(2);
    }
    if (!stream.stream_ops.mmap) {
      throw new FS.ErrnoError(43);
    }
    return stream.stream_ops.mmap(stream, length, position, prot, flags);
  },
  msync: (stream, buffer, offset, length, mmapFlags) => {
    if (!stream.stream_ops.msync) {
      return 0;
    }
    return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
  },
  munmap: stream => 0,
  ioctl: (stream, cmd, arg) => {
    if (!stream.stream_ops.ioctl) {
      throw new FS.ErrnoError(59);
    }
    return stream.stream_ops.ioctl(stream, cmd, arg);
  },
  readFile: (path, opts = {}) => {
    opts.flags = opts.flags || 0;
    opts.encoding = opts.encoding || "binary";
    if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
      throw new Error(`Invalid encoding type "${opts.encoding}"`);
    }
    var ret;
    var stream = FS.open(path, opts.flags);
    var stat = FS.stat(path);
    var length = stat.size;
    var buf = new Uint8Array(length);
    FS.read(stream, buf, 0, length, 0);
    if (opts.encoding === "utf8") {
      ret = UTF8ArrayToString(buf, 0);
    } else if (opts.encoding === "binary") {
      ret = buf;
    }
    FS.close(stream);
    return ret;
  },
  writeFile: (path, data, opts = {}) => {
    opts.flags = opts.flags || 577;
    var stream = FS.open(path, opts.flags, opts.mode);
    if (typeof data == "string") {
      var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
      var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
      FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn);
    } else if (ArrayBuffer.isView(data)) {
      FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
    } else {
      throw new Error("Unsupported data type");
    }
    FS.close(stream);
  },
  cwd: () => FS.currentPath,
  chdir: path => {
    var lookup = FS.lookupPath(path, { follow: true });
    if (lookup.node === null) {
      throw new FS.ErrnoError(44);
    }
    if (!FS.isDir(lookup.node.mode)) {
      throw new FS.ErrnoError(54);
    }
    var errCode = FS.nodePermissions(lookup.node, "x");
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    FS.currentPath = lookup.path;
  },
  createDefaultDirectories: () => {
    FS.mkdir("/tmp");
    FS.mkdir("/home");
    FS.mkdir("/home/web_user");
  },
  createDefaultDevices: () => {
    // create /dev
    FS.mkdir("/dev");
    // setup /dev/null
    FS.registerDevice(FS.makedev(1, 3), {
      read: () => 0,
      write: (stream, buffer, offset, length, pos) => length
    });
    FS.mkdev("/dev/null", FS.makedev(1, 3));
    // setup /dev/tty and /dev/tty1
    // stderr needs to print output using err() rather than out()
    // so we register a second tty just for it.
    TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
    TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
    FS.mkdev("/dev/tty", FS.makedev(5, 0));
    FS.mkdev("/dev/tty1", FS.makedev(6, 0));
    // setup /dev/[u]random
    // use a buffer to avoid overhead of individual crypto calls per byte
    var randomBuffer = new Uint8Array(1024),
      randomLeft = 0;
    var randomByte = () => {
      if (randomLeft === 0) {
        randomLeft = randomFill(randomBuffer).byteLength;
      }
      return randomBuffer[--randomLeft];
    };
    FS.createDevice("/dev", "random", randomByte);
    FS.createDevice("/dev", "urandom", randomByte);
    // we're not going to emulate the actual shm device,
    // just create the tmp dirs that reside in it commonly
    FS.mkdir("/dev/shm");
    FS.mkdir("/dev/shm/tmp");
  },
  createSpecialDirectories: () => {
    // create /proc/self/fd which allows /proc/self/fd/6 => readlink gives the
    // name of the stream for fd 6 (see test_unistd_ttyname)
    FS.mkdir("/proc");
    var proc_self = FS.mkdir("/proc/self");
    FS.mkdir("/proc/self/fd");
    FS.mount(
      {
        mount: () => {
          var node = FS.createNode(proc_self, "fd", 16384 | 511 /* 0777 */, 73);
          node.node_ops = {
            lookup: (parent, name) => {
              var fd = +name;
              var stream = FS.getStreamChecked(fd);
              var ret = {
                parent: null,
                mount: { mountpoint: "fake" },
                node_ops: { readlink: () => stream.path }
              };
              ret.parent = ret; // make it look like a simple root node
              return ret;
            }
          };
          return node;
        }
      },
      {},
      "/proc/self/fd"
    );
  },
  createStandardStreams: () => {
    // TODO deprecate the old functionality of a single
    // input / output callback and that utilizes FS.createDevice
    // and instead require a unique set of stream ops

    // by default, we symlink the standard streams to the
    // default tty devices. however, if the standard streams
    // have been overwritten we create a unique device for
    // them instead.
    if (Module["stdin"]) {
      FS.createDevice("/dev", "stdin", Module["stdin"]);
    } else {
      FS.symlink("/dev/tty", "/dev/stdin");
    }
    if (Module["stdout"]) {
      FS.createDevice("/dev", "stdout", null, Module["stdout"]);
    } else {
      FS.symlink("/dev/tty", "/dev/stdout");
    }
    if (Module["stderr"]) {
      FS.createDevice("/dev", "stderr", null, Module["stderr"]);
    } else {
      FS.symlink("/dev/tty1", "/dev/stderr");
    }

    // open default streams for the stdin, stdout and stderr devices
    var stdin = FS.open("/dev/stdin", 0);
    var stdout = FS.open("/dev/stdout", 1);
    var stderr = FS.open("/dev/stderr", 1);
  },
  ensureErrnoError: () => {
    if (FS.ErrnoError) return;
    FS.ErrnoError = /** @this{Object} */ function ErrnoError(errno, node) {
      // We set the `name` property to be able to identify `FS.ErrnoError`
      // - the `name` is a standard ECMA-262 property of error objects. Kind of good to have it anyway.
      // - when using PROXYFS, an error can come from an underlying FS
      // as different FS objects have their own FS.ErrnoError each,
      // the test `err instanceof FS.ErrnoError` won't detect an error coming from another filesystem, causing bugs.
      // we'll use the reliable test `err.name == "ErrnoError"` instead
      this.name = "ErrnoError";
      this.node = node;
      this.setErrno = /** @this{Object} */ function (errno) {
        this.errno = errno;
      };
      this.setErrno(errno);
      this.message = "FS error";
    };
    FS.ErrnoError.prototype = new Error();
    FS.ErrnoError.prototype.constructor = FS.ErrnoError;
    // Some errors may happen quite a bit, to avoid overhead we reuse them (and suffer a lack of stack info)
    [44].forEach(code => {
      FS.genericErrors[code] = new FS.ErrnoError(code);
      FS.genericErrors[code].stack = "<generic error, no stack>";
    });
  },
  staticInit: () => {
    FS.ensureErrnoError();

    FS.nameTable = new Array(4096);

    FS.mount(MEMFS, {}, "/");

    FS.createDefaultDirectories();
    FS.createDefaultDevices();
    FS.createSpecialDirectories();

    FS.filesystems = {
      MEMFS: MEMFS,
      WORKERFS: WORKERFS
    };
  },
  init: (input, output, error) => {
    FS.init.initialized = true;

    FS.ensureErrnoError();

    // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
    Module["stdin"] = input || Module["stdin"];
    Module["stdout"] = output || Module["stdout"];
    Module["stderr"] = error || Module["stderr"];

    FS.createStandardStreams();
  },
  quit: () => {
    FS.init.initialized = false;
    // force-flush all streams, so we get musl std streams printed out
    // close all of our streams
    for (var i = 0; i < FS.streams.length; i++) {
      var stream = FS.streams[i];
      if (!stream) {
        continue;
      }
      FS.close(stream);
    }
  },
  findObject: (path, dontResolveLastLink) => {
    var ret = FS.analyzePath(path, dontResolveLastLink);
    if (!ret.exists) {
      return null;
    }
    return ret.object;
  },
  analyzePath: (path, dontResolveLastLink) => {
    // operate from within the context of the symlink's target
    try {
      var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
      path = lookup.path;
    } catch (e) {}
    var ret = {
      isRoot: false,
      exists: false,
      error: 0,
      name: null,
      path: null,
      object: null,
      parentExists: false,
      parentPath: null,
      parentObject: null
    };
    try {
      var lookup = FS.lookupPath(path, { parent: true });
      ret.parentExists = true;
      ret.parentPath = lookup.path;
      ret.parentObject = lookup.node;
      ret.name = PATH.basename(path);
      lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
      ret.exists = true;
      ret.path = lookup.path;
      ret.object = lookup.node;
      ret.name = lookup.node.name;
      ret.isRoot = lookup.path === "/";
    } catch (e) {
      ret.error = e.errno;
    }
    return ret;
  },
  createPath: (parent, path, canRead, canWrite) => {
    parent = typeof parent == "string" ? parent : FS.getPath(parent);
    var parts = path.split("/").reverse();
    while (parts.length) {
      var part = parts.pop();
      if (!part) continue;
      var current = PATH.join2(parent, part);
      try {
        FS.mkdir(current);
      } catch (e) {
        // ignore EEXIST
      }
      parent = current;
    }
    return current;
  },
  createFile: (parent, name, properties, canRead, canWrite) => {
    var path = PATH.join2(
      typeof parent == "string" ? parent : FS.getPath(parent),
      name
    );
    var mode = FS_getMode(canRead, canWrite);
    return FS.create(path, mode);
  },
  createDataFile: (parent, name, data, canRead, canWrite, canOwn) => {
    var path = name;
    if (parent) {
      parent = typeof parent == "string" ? parent : FS.getPath(parent);
      path = name ? PATH.join2(parent, name) : parent;
    }
    var mode = FS_getMode(canRead, canWrite);
    var node = FS.create(path, mode);
    if (data) {
      if (typeof data == "string") {
        var arr = new Array(data.length);
        for (var i = 0, len = data.length; i < len; ++i)
          arr[i] = data.charCodeAt(i);
        data = arr;
      }
      // make sure we can write to the file
      FS.chmod(node, mode | 146);
      var stream = FS.open(node, 577);
      FS.write(stream, data, 0, data.length, 0, canOwn);
      FS.close(stream);
      FS.chmod(node, mode);
    }
    return node;
  },
  createDevice: (parent, name, input, output) => {
    var path = PATH.join2(
      typeof parent == "string" ? parent : FS.getPath(parent),
      name
    );
    var mode = FS_getMode(!!input, !!output);
    if (!FS.createDevice.major) FS.createDevice.major = 64;
    var dev = FS.makedev(FS.createDevice.major++, 0);
    // Create a fake device that a set of stream ops to emulate
    // the old behavior.
    FS.registerDevice(dev, {
      open: stream => {
        stream.seekable = false;
      },
      close: stream => {
        // flush any pending line data
        if (output && output.buffer && output.buffer.length) {
          output(10);
        }
      },
      read: (stream, buffer, offset, length, pos /* ignored */) => {
        var bytesRead = 0;
        for (var i = 0; i < length; i++) {
          var result;
          try {
            result = input();
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
          if (result === undefined && bytesRead === 0) {
            throw new FS.ErrnoError(6);
          }
          if (result === null || result === undefined) break;
          bytesRead++;
          buffer[offset + i] = result;
        }
        if (bytesRead) {
          stream.node.timestamp = Date.now();
        }
        return bytesRead;
      },
      write: (stream, buffer, offset, length, pos) => {
        for (var i = 0; i < length; i++) {
          try {
            output(buffer[offset + i]);
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
        }
        if (length) {
          stream.node.timestamp = Date.now();
        }
        return i;
      }
    });
    return FS.mkdev(path, mode, dev);
  },
  forceLoadFile: obj => {
    if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
    if (typeof XMLHttpRequest != "undefined") {
      throw new Error(
        "Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread."
      );
    } else if (read_) {
      // Command-line.
      try {
        // WARNING: Can't read binary files in V8's d8 or tracemonkey's js, as
        //          read() will try to parse UTF8.
        obj.contents = intArrayFromString(read_(obj.url), true);
        obj.usedBytes = obj.contents.length;
      } catch (e) {
        throw new FS.ErrnoError(29);
      }
    } else {
      throw new Error("Cannot load without read() or XMLHttpRequest.");
    }
  },
  createLazyFile: (parent, name, url, canRead, canWrite) => {
    // Lazy chunked Uint8Array (implements get and length from Uint8Array). Actual getting is abstracted away for eventual reuse.
    /** @constructor */
    function LazyUint8Array() {
      this.lengthKnown = false;
      this.chunks = []; // Loaded chunks. Index is the chunk number
    }
    LazyUint8Array.prototype.get =
      /** @this{Object} */ function LazyUint8Array_get(idx) {
        if (idx > this.length - 1 || idx < 0) {
          return undefined;
        }
        var chunkOffset = idx % this.chunkSize;
        var chunkNum = (idx / this.chunkSize) | 0;
        return this.getter(chunkNum)[chunkOffset];
      };
    LazyUint8Array.prototype.setDataGetter =
      function LazyUint8Array_setDataGetter(getter) {
        this.getter = getter;
      };
    LazyUint8Array.prototype.cacheLength =
      function LazyUint8Array_cacheLength() {
        // Find length
        var xhr = new XMLHttpRequest();
        xhr.open("HEAD", url, false);
        xhr.send(null);
        if (!((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304))
          throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
        var datalength = Number(xhr.getResponseHeader("Content-length"));
        var header;
        var hasByteServing =
          (header = xhr.getResponseHeader("Accept-Ranges")) &&
          header === "bytes";
        var usesGzip =
          (header = xhr.getResponseHeader("Content-Encoding")) &&
          header === "gzip";

        var chunkSize = 1024 * 1024; // Chunk size in bytes

        if (!hasByteServing) chunkSize = datalength;

        // Function to get a range from the remote URL.
        var doXHR = (from, to) => {
          if (from > to)
            throw new Error(
              "invalid range (" + from + ", " + to + ") or no bytes requested!"
            );
          if (to > datalength - 1)
            throw new Error(
              "only " + datalength + " bytes available! programmer error!"
            );

          // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
          var xhr = new XMLHttpRequest();
          xhr.open("GET", url, false);
          if (datalength !== chunkSize)
            xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);

          // Some hints to the browser that we want binary data.
          xhr.responseType = "arraybuffer";
          if (xhr.overrideMimeType) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
          }

          xhr.send(null);
          if (!((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304))
            throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
          if (xhr.response !== undefined) {
            return new Uint8Array(
              /** @type{Array<number>} */ (xhr.response || [])
            );
          }
          return intArrayFromString(xhr.responseText || "", true);
        };
        var lazyArray = this;
        lazyArray.setDataGetter(chunkNum => {
          var start = chunkNum * chunkSize;
          var end = (chunkNum + 1) * chunkSize - 1; // including this byte
          end = Math.min(end, datalength - 1); // if datalength-1 is selected, this is the last block
          if (typeof lazyArray.chunks[chunkNum] == "undefined") {
            lazyArray.chunks[chunkNum] = doXHR(start, end);
          }
          if (typeof lazyArray.chunks[chunkNum] == "undefined")
            throw new Error("doXHR failed!");
          return lazyArray.chunks[chunkNum];
        });

        if (usesGzip || !datalength) {
          // if the server uses gzip or doesn't supply the length, we have to download the whole file to get the (uncompressed) length
          chunkSize = datalength = 1; // this will force getter(0)/doXHR do download the whole file
          datalength = this.getter(0).length;
          chunkSize = datalength;
          out(
            "LazyFiles on gzip forces download of the whole file when length is accessed"
          );
        }

        this._length = datalength;
        this._chunkSize = chunkSize;
        this.lengthKnown = true;
      };
    if (typeof XMLHttpRequest != "undefined") {
      if (!ENVIRONMENT_IS_WORKER)
        throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
      var lazyArray = new LazyUint8Array();
      Object.defineProperties(lazyArray, {
        length: {
          get: /** @this{Object} */ function () {
            if (!this.lengthKnown) {
              this.cacheLength();
            }
            return this._length;
          }
        },
        chunkSize: {
          get: /** @this{Object} */ function () {
            if (!this.lengthKnown) {
              this.cacheLength();
            }
            return this._chunkSize;
          }
        }
      });

      var properties = { isDevice: false, contents: lazyArray };
    } else {
      var properties = { isDevice: false, url: url };
    }

    var node = FS.createFile(parent, name, properties, canRead, canWrite);
    // This is a total hack, but I want to get this lazy file code out of the
    // core of MEMFS. If we want to keep this lazy file concept I feel it should
    // be its own thin LAZYFS proxying calls to MEMFS.
    if (properties.contents) {
      node.contents = properties.contents;
    } else if (properties.url) {
      node.contents = null;
      node.url = properties.url;
    }
    // Add a function that defers querying the file size until it is asked the first time.
    Object.defineProperties(node, {
      usedBytes: {
        get: /** @this {FSNode} */ function () {
          return this.contents.length;
        }
      }
    });
    // override each stream op with one that tries to force load the lazy file first
    var stream_ops = {};
    var keys = Object.keys(node.stream_ops);
    keys.forEach(key => {
      var fn = node.stream_ops[key];
      stream_ops[key] = function forceLoadLazyFile() {
        FS.forceLoadFile(node);
        return fn.apply(null, arguments);
      };
    });
    function writeChunks(stream, buffer, offset, length, position) {
      var contents = stream.node.contents;
      if (position >= contents.length) return 0;
      var size = Math.min(contents.length - position, length);
      if (contents.slice) {
        // normal array
        for (var i = 0; i < size; i++) {
          buffer[offset + i] = contents[position + i];
        }
      } else {
        for (var i = 0; i < size; i++) {
          // LazyUint8Array from sync binary XHR
          buffer[offset + i] = contents.get(position + i);
        }
      }
      return size;
    }
    // use a custom read function
    stream_ops.read = (stream, buffer, offset, length, position) => {
      FS.forceLoadFile(node);
      return writeChunks(stream, buffer, offset, length, position);
    };
    // use a custom mmap function
    stream_ops.mmap = (stream, length, position, prot, flags) => {
      FS.forceLoadFile(node);
      var ptr = mmapAlloc(length);
      if (!ptr) {
        throw new FS.ErrnoError(48);
      }
      writeChunks(stream, HEAP8, ptr, length, position);
      return { ptr, allocated: true };
    };
    node.stream_ops = stream_ops;
    return node;
  }
};

/**
 * Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the
 * emscripten HEAP, returns a copy of that string as a Javascript String object.
 *
 * @param {number} ptr
 * @param {number=} maxBytesToRead - An optional length that specifies the
 *   maximum number of bytes to read. You can omit this parameter to scan the
 *   string until the first 0 byte. If maxBytesToRead is passed, and the string
 *   at [ptr, ptr+maxBytesToReadr[ contains a null byte in the middle, then the
 *   string will cut short at that byte index (i.e. maxBytesToRead will not
 *   produce a string of exact length [ptr, ptr+maxBytesToRead[) N.B. mixing
 *   frequent uses of UTF8ToString() with and without maxBytesToRead may throw
 *   JS JIT optimizations off, so it is worth to consider consistently using one
 * @return {string}
 */
var UTF8ToString = (ptr, maxBytesToRead) => {
  return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
};
var SYSCALLS = {
  DEFAULT_POLLMASK: 5,
  calculateAt: function (dirfd, path, allowEmpty) {
    if (PATH.isAbs(path)) {
      return path;
    }
    // relative path
    var dir;
    if (dirfd === -100) {
      dir = FS.cwd();
    } else {
      var dirstream = SYSCALLS.getStreamFromFD(dirfd);
      dir = dirstream.path;
    }
    if (path.length == 0) {
      if (!allowEmpty) {
        throw new FS.ErrnoError(44);
      }
      return dir;
    }
    return PATH.join2(dir, path);
  },
  doStat: function (func, path, buf) {
    try {
      var stat = func(path);
    } catch (e) {
      if (
        e &&
        e.node &&
        PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))
      ) {
        // an error occurred while trying to look up the path; we should just report ENOTDIR
        return -54;
      }
      throw e;
    }
    HEAP32[buf >> 2] = stat.dev;
    HEAP32[(buf + 4) >> 2] = stat.mode;
    HEAPU32[(buf + 8) >> 2] = stat.nlink;
    HEAP32[(buf + 12) >> 2] = stat.uid;
    HEAP32[(buf + 16) >> 2] = stat.gid;
    HEAP32[(buf + 20) >> 2] = stat.rdev;
    (tempI64 = [
      stat.size >>> 0,
      ((tempDouble = stat.size),
      +Math.abs(tempDouble) >= 1.0
        ? tempDouble > 0.0
          ? +Math.floor(tempDouble / 4294967296.0) >>> 0
          : ~~+Math.ceil(
              (tempDouble - +(~~tempDouble >>> 0)) / 4294967296.0
            ) >>> 0
        : 0)
    ]),
      (HEAP32[(buf + 24) >> 2] = tempI64[0]),
      (HEAP32[(buf + 28) >> 2] = tempI64[1]);
    HEAP32[(buf + 32) >> 2] = 4096;
    HEAP32[(buf + 36) >> 2] = stat.blocks;
    var atime = stat.atime.getTime();
    var mtime = stat.mtime.getTime();
    var ctime = stat.ctime.getTime();
    (tempI64 = [
      Math.floor(atime / 1000) >>> 0,
      ((tempDouble = Math.floor(atime / 1000)),
      +Math.abs(tempDouble) >= 1.0
        ? tempDouble > 0.0
          ? +Math.floor(tempDouble / 4294967296.0) >>> 0
          : ~~+Math.ceil(
              (tempDouble - +(~~tempDouble >>> 0)) / 4294967296.0
            ) >>> 0
        : 0)
    ]),
      (HEAP32[(buf + 40) >> 2] = tempI64[0]),
      (HEAP32[(buf + 44) >> 2] = tempI64[1]);
    HEAPU32[(buf + 48) >> 2] = (atime % 1000) * 1000;
    (tempI64 = [
      Math.floor(mtime / 1000) >>> 0,
      ((tempDouble = Math.floor(mtime / 1000)),
      +Math.abs(tempDouble) >= 1.0
        ? tempDouble > 0.0
          ? +Math.floor(tempDouble / 4294967296.0) >>> 0
          : ~~+Math.ceil(
              (tempDouble - +(~~tempDouble >>> 0)) / 4294967296.0
            ) >>> 0
        : 0)
    ]),
      (HEAP32[(buf + 56) >> 2] = tempI64[0]),
      (HEAP32[(buf + 60) >> 2] = tempI64[1]);
    HEAPU32[(buf + 64) >> 2] = (mtime % 1000) * 1000;
    (tempI64 = [
      Math.floor(ctime / 1000) >>> 0,
      ((tempDouble = Math.floor(ctime / 1000)),
      +Math.abs(tempDouble) >= 1.0
        ? tempDouble > 0.0
          ? +Math.floor(tempDouble / 4294967296.0) >>> 0
          : ~~+Math.ceil(
              (tempDouble - +(~~tempDouble >>> 0)) / 4294967296.0
            ) >>> 0
        : 0)
    ]),
      (HEAP32[(buf + 72) >> 2] = tempI64[0]),
      (HEAP32[(buf + 76) >> 2] = tempI64[1]);
    HEAPU32[(buf + 80) >> 2] = (ctime % 1000) * 1000;
    (tempI64 = [
      stat.ino >>> 0,
      ((tempDouble = stat.ino),
      +Math.abs(tempDouble) >= 1.0
        ? tempDouble > 0.0
          ? +Math.floor(tempDouble / 4294967296.0) >>> 0
          : ~~+Math.ceil(
              (tempDouble - +(~~tempDouble >>> 0)) / 4294967296.0
            ) >>> 0
        : 0)
    ]),
      (HEAP32[(buf + 88) >> 2] = tempI64[0]),
      (HEAP32[(buf + 92) >> 2] = tempI64[1]);
    return 0;
  },
  doMsync: function (addr, stream, len, flags, offset) {
    if (!FS.isFile(stream.node.mode)) {
      throw new FS.ErrnoError(43);
    }
    if (flags & 2) {
      // MAP_PRIVATE calls need not to be synced back to underlying fs
      return 0;
    }
    var buffer = HEAPU8.slice(addr, addr + len);
    FS.msync(stream, buffer, offset, len, flags);
  },
  varargs: undefined,
  get() {
    SYSCALLS.varargs += 4;
    var ret = HEAP32[(SYSCALLS.varargs - 4) >> 2];
    return ret;
  },
  getStr(ptr) {
    var ret = UTF8ToString(ptr);
    return ret;
  },
  getStreamFromFD: function (fd) {
    var stream = FS.getStreamChecked(fd);
    return stream;
  }
};
function ___syscall_faccessat(dirfd, path, amode, flags) {
  try {
    path = SYSCALLS.getStr(path);
    path = SYSCALLS.calculateAt(dirfd, path);
    if (amode & ~7) {
      // need a valid mode
      return -28;
    }
    var lookup = FS.lookupPath(path, { follow: true });
    var node = lookup.node;
    if (!node) {
      return -44;
    }
    var perms = "";
    if (amode & 4) perms += "r";
    if (amode & 2) perms += "w";
    if (amode & 1) perms += "x";
    if (
      perms /* otherwise, they've just passed F_OK */ &&
      FS.nodePermissions(node, perms)
    ) {
      return -2;
    }
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

var setErrNo = value => {
  HEAP32[___errno_location() >> 2] = value;
  return value;
};

function ___syscall_fcntl64(fd, cmd, varargs) {
  SYSCALLS.varargs = varargs;
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    switch (cmd) {
      case 0: {
        var arg = SYSCALLS.get();
        if (arg < 0) {
          return -28;
        }
        var newStream;
        newStream = FS.createStream(stream, arg);
        return newStream.fd;
      }
      case 1:
      case 2:
        return 0; // FD_CLOEXEC makes no sense for a single process.
      case 3:
        return stream.flags;
      case 4: {
        var arg = SYSCALLS.get();
        stream.flags |= arg;
        return 0;
      }
      case 5: /* case 5: Currently in musl F_GETLK64 has same value as F_GETLK, so omitted to avoid duplicate case blocks. If that changes, uncomment this */ {
        var arg = SYSCALLS.get();
        var offset = 0;
        // We're always unlocked.
        HEAP16[(arg + offset) >> 1] = 2;
        return 0;
      }
      case 6:
      case 7:
        /* case 6: Currently in musl F_SETLK64 has same value as F_SETLK, so omitted to avoid duplicate case blocks. If that changes, uncomment this */
        /* case 7: Currently in musl F_SETLKW64 has same value as F_SETLKW, so omitted to avoid duplicate case blocks. If that changes, uncomment this */

        return 0; // Pretend that the locking is successful.
      case 16:
      case 8:
        return -28; // These are for sockets. We don't have them fully implemented yet.
      case 9:
        // musl trusts getown return values, due to a bug where they must be, as they overlap with errors. just return -1 here, so fcntl() returns that, and we set errno ourselves.
        setErrNo(28);
        return -1;
      default: {
        return -28;
      }
    }
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_fstat64(fd, buf) {
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    return SYSCALLS.doStat(FS.stat, stream.path, buf);
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

var stringToUTF8 = (str, outPtr, maxBytesToWrite) => {
  return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
};

function ___syscall_getdents64(fd, dirp, count) {
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    if (!stream.getdents) {
      stream.getdents = FS.readdir(stream.path);
    }

    var struct_size = 280;
    var pos = 0;
    var off = FS.llseek(stream, 0, 1);

    var idx = Math.floor(off / struct_size);

    while (idx < stream.getdents.length && pos + struct_size <= count) {
      var id;
      var type;
      var name = stream.getdents[idx];
      if (name === ".") {
        id = stream.node.id;
        type = 4; // DT_DIR
      } else if (name === "..") {
        var lookup = FS.lookupPath(stream.path, { parent: true });
        id = lookup.node.id;
        type = 4; // DT_DIR
      } else {
        var child = FS.lookupNode(stream.node, name);
        id = child.id;
        type = FS.isChrdev(child.mode)
          ? 2 // DT_CHR, character device.
          : FS.isDir(child.mode)
          ? 4 // DT_DIR, directory.
          : FS.isLink(child.mode)
          ? 10 // DT_LNK, symbolic link.
          : 8; // DT_REG, regular file.
      }
      (tempI64 = [
        id >>> 0,
        ((tempDouble = id),
        +Math.abs(tempDouble) >= 1.0
          ? tempDouble > 0.0
            ? +Math.floor(tempDouble / 4294967296.0) >>> 0
            : ~~+Math.ceil(
                (tempDouble - +(~~tempDouble >>> 0)) / 4294967296.0
              ) >>> 0
          : 0)
      ]),
        (HEAP32[(dirp + pos) >> 2] = tempI64[0]),
        (HEAP32[(dirp + pos + 4) >> 2] = tempI64[1]);
      (tempI64 = [
        ((idx + 1) * struct_size) >>> 0,
        ((tempDouble = (idx + 1) * struct_size),
        +Math.abs(tempDouble) >= 1.0
          ? tempDouble > 0.0
            ? +Math.floor(tempDouble / 4294967296.0) >>> 0
            : ~~+Math.ceil(
                (tempDouble - +(~~tempDouble >>> 0)) / 4294967296.0
              ) >>> 0
          : 0)
      ]),
        (HEAP32[(dirp + pos + 8) >> 2] = tempI64[0]),
        (HEAP32[(dirp + pos + 12) >> 2] = tempI64[1]);
      HEAP16[(dirp + pos + 16) >> 1] = 280;
      HEAP8[(dirp + pos + 18) >> 0] = type;
      stringToUTF8(name, dirp + pos + 19, 256);
      pos += struct_size;
      idx += 1;
    }
    FS.llseek(stream, idx * struct_size, 0);
    return pos;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_lstat64(path, buf) {
  try {
    path = SYSCALLS.getStr(path);
    return SYSCALLS.doStat(FS.lstat, path, buf);
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_newfstatat(dirfd, path, buf, flags) {
  try {
    path = SYSCALLS.getStr(path);
    var nofollow = flags & 256;
    var allowEmpty = flags & 4096;
    flags = flags & ~6400;
    path = SYSCALLS.calculateAt(dirfd, path, allowEmpty);
    return SYSCALLS.doStat(nofollow ? FS.lstat : FS.stat, path, buf);
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_openat(dirfd, path, flags, varargs) {
  SYSCALLS.varargs = varargs;
  try {
    path = SYSCALLS.getStr(path);
    path = SYSCALLS.calculateAt(dirfd, path);
    var mode = varargs ? SYSCALLS.get() : 0;
    return FS.open(path, flags, mode).fd;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_renameat(olddirfd, oldpath, newdirfd, newpath) {
  try {
    oldpath = SYSCALLS.getStr(oldpath);
    newpath = SYSCALLS.getStr(newpath);
    oldpath = SYSCALLS.calculateAt(olddirfd, oldpath);
    newpath = SYSCALLS.calculateAt(newdirfd, newpath);
    FS.rename(oldpath, newpath);
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_rmdir(path) {
  try {
    path = SYSCALLS.getStr(path);
    FS.rmdir(path);
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_stat64(path, buf) {
  try {
    path = SYSCALLS.getStr(path);
    return SYSCALLS.doStat(FS.stat, path, buf);
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_unlinkat(dirfd, path, flags) {
  try {
    path = SYSCALLS.getStr(path);
    path = SYSCALLS.calculateAt(dirfd, path);
    if (flags === 0) {
      FS.unlink(path);
    } else if (flags === 512) {
      FS.rmdir(path);
    } else {
      abort("Invalid flags passed to unlinkat");
    }
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

var nowIsMonotonic = true;
var __emscripten_get_now_is_monotonic = () => nowIsMonotonic;

function convertI32PairToI53Checked(lo, hi) {
  return (hi + 0x200000) >>> 0 < 0x400001 - !!lo
    ? (lo >>> 0) + hi * 4294967296
    : NaN;
}
function __gmtime_js(time_low, time_high, tmPtr) {
  var time = convertI32PairToI53Checked(time_low, time_high);

  var date = new Date(time * 1000);
  HEAP32[tmPtr >> 2] = date.getUTCSeconds();
  HEAP32[(tmPtr + 4) >> 2] = date.getUTCMinutes();
  HEAP32[(tmPtr + 8) >> 2] = date.getUTCHours();
  HEAP32[(tmPtr + 12) >> 2] = date.getUTCDate();
  HEAP32[(tmPtr + 16) >> 2] = date.getUTCMonth();
  HEAP32[(tmPtr + 20) >> 2] = date.getUTCFullYear() - 1900;
  HEAP32[(tmPtr + 24) >> 2] = date.getUTCDay();
  var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
  var yday = ((date.getTime() - start) / (1000 * 60 * 60 * 24)) | 0;
  HEAP32[(tmPtr + 28) >> 2] = yday;
}

var isLeapYear = year => {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
};

var MONTH_DAYS_LEAP_CUMULATIVE = [
  0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335
];

var MONTH_DAYS_REGULAR_CUMULATIVE = [
  0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334
];
var ydayFromDate = date => {
  var leap = isLeapYear(date.getFullYear());
  var monthDaysCumulative = leap
    ? MONTH_DAYS_LEAP_CUMULATIVE
    : MONTH_DAYS_REGULAR_CUMULATIVE;
  var yday = monthDaysCumulative[date.getMonth()] + date.getDate() - 1; // -1 since it's days since Jan 1

  return yday;
};

function __localtime_js(time_low, time_high, tmPtr) {
  var time = convertI32PairToI53Checked(time_low, time_high);

  var date = new Date(time * 1000);
  HEAP32[tmPtr >> 2] = date.getSeconds();
  HEAP32[(tmPtr + 4) >> 2] = date.getMinutes();
  HEAP32[(tmPtr + 8) >> 2] = date.getHours();
  HEAP32[(tmPtr + 12) >> 2] = date.getDate();
  HEAP32[(tmPtr + 16) >> 2] = date.getMonth();
  HEAP32[(tmPtr + 20) >> 2] = date.getFullYear() - 1900;
  HEAP32[(tmPtr + 24) >> 2] = date.getDay();

  var yday = ydayFromDate(date) | 0;
  HEAP32[(tmPtr + 28) >> 2] = yday;
  HEAP32[(tmPtr + 36) >> 2] = -(date.getTimezoneOffset() * 60);

  // Attention: DST is in December in South, and some regions don't have DST at all.
  var start = new Date(date.getFullYear(), 0, 1);
  var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
  var winterOffset = start.getTimezoneOffset();
  var dst =
    (summerOffset != winterOffset &&
      date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
  HEAP32[(tmPtr + 32) >> 2] = dst;
}

var __mktime_js = function (tmPtr) {
  var ret = (() => {
    var date = new Date(
      HEAP32[(tmPtr + 20) >> 2] + 1900,
      HEAP32[(tmPtr + 16) >> 2],
      HEAP32[(tmPtr + 12) >> 2],
      HEAP32[(tmPtr + 8) >> 2],
      HEAP32[(tmPtr + 4) >> 2],
      HEAP32[tmPtr >> 2],
      0
    );

    // There's an ambiguous hour when the time goes back; the tm_isdst field is
    // used to disambiguate it.  Date() basically guesses, so we fix it up if it
    // guessed wrong, or fill in tm_isdst with the guess if it's -1.
    var dst = HEAP32[(tmPtr + 32) >> 2];
    var guessedOffset = date.getTimezoneOffset();
    var start = new Date(date.getFullYear(), 0, 1);
    var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
    var winterOffset = start.getTimezoneOffset();
    var dstOffset = Math.min(winterOffset, summerOffset); // DST is in December in South
    if (dst < 0) {
      // Attention: some regions don't have DST at all.
      HEAP32[(tmPtr + 32) >> 2] = Number(
        summerOffset != winterOffset && dstOffset == guessedOffset
      );
    } else if (dst > 0 != (dstOffset == guessedOffset)) {
      var nonDstOffset = Math.max(winterOffset, summerOffset);
      var trueOffset = dst > 0 ? dstOffset : nonDstOffset;
      // Don't try setMinutes(date.getMinutes() + ...) -- it's messed up.
      date.setTime(date.getTime() + (trueOffset - guessedOffset) * 60000);
    }

    HEAP32[(tmPtr + 24) >> 2] = date.getDay();
    var yday = ydayFromDate(date) | 0;
    HEAP32[(tmPtr + 28) >> 2] = yday;
    // To match expected behavior, update fields from date
    HEAP32[tmPtr >> 2] = date.getSeconds();
    HEAP32[(tmPtr + 4) >> 2] = date.getMinutes();
    HEAP32[(tmPtr + 8) >> 2] = date.getHours();
    HEAP32[(tmPtr + 12) >> 2] = date.getDate();
    HEAP32[(tmPtr + 16) >> 2] = date.getMonth();
    HEAP32[(tmPtr + 20) >> 2] = date.getYear();

    return date.getTime() / 1000;
  })();
  return (
    setTempRet0(
      ((tempDouble = ret),
      +Math.abs(tempDouble) >= 1.0
        ? tempDouble > 0.0
          ? +Math.floor(tempDouble / 4294967296.0) >>> 0
          : ~~+Math.ceil(
              (tempDouble - +(~~tempDouble >>> 0)) / 4294967296.0
            ) >>> 0
        : 0)
    ),
    ret >>> 0
  );
};

var stringToNewUTF8 = str => {
  var size = lengthBytesUTF8(str) + 1;
  var ret = _malloc(size);
  if (ret) stringToUTF8(str, ret, size);
  return ret;
};
var __tzset_js = (timezone, daylight, tzname) => {
  // TODO: Use (malleable) environment variables instead of system settings.
  var currentYear = new Date().getFullYear();
  var winter = new Date(currentYear, 0, 1);
  var summer = new Date(currentYear, 6, 1);
  var winterOffset = winter.getTimezoneOffset();
  var summerOffset = summer.getTimezoneOffset();

  // Local standard timezone offset. Local standard time is not adjusted for daylight savings.
  // This code uses the fact that getTimezoneOffset returns a greater value during Standard Time versus Daylight Saving Time (DST).
  // Thus it determines the expected output during Standard Time, and it compares whether the output of the given date the same (Standard) or less (DST).
  var stdTimezoneOffset = Math.max(winterOffset, summerOffset);

  // timezone is specified as seconds west of UTC ("The external variable
  // `timezone` shall be set to the difference, in seconds, between
  // Coordinated Universal Time (UTC) and local standard time."), the same
  // as returned by stdTimezoneOffset.
  // See http://pubs.opengroup.org/onlinepubs/009695399/functions/tzset.html
  HEAPU32[timezone >> 2] = stdTimezoneOffset * 60;

  HEAP32[daylight >> 2] = Number(winterOffset != summerOffset);

  function extractZone(date) {
    var match = date.toTimeString().match(/\(([A-Za-z ]+)\)$/);
    return match ? match[1] : "GMT";
  }
  var winterName = extractZone(winter);
  var summerName = extractZone(summer);
  var winterNamePtr = stringToNewUTF8(winterName);
  var summerNamePtr = stringToNewUTF8(summerName);
  if (summerOffset < winterOffset) {
    // Northern hemisphere
    HEAPU32[tzname >> 2] = winterNamePtr;
    HEAPU32[(tzname + 4) >> 2] = summerNamePtr;
  } else {
    HEAPU32[tzname >> 2] = summerNamePtr;
    HEAPU32[(tzname + 4) >> 2] = winterNamePtr;
  }
};

var _abort = () => {
  abort("");
};

function _emscripten_date_now() {
  return Date.now();
}

var _emscripten_get_now;
// Modern environment where performance.now() is supported:
// N.B. a shorter form "_emscripten_get_now = performance.now;" is
// unfortunately not allowed even in current browsers (e.g. FF Nightly 75).
_emscripten_get_now = () => performance.now();
var _emscripten_memcpy_big = (dest, src, num) =>
  HEAPU8.copyWithin(dest, src, src + num);

var getHeapMax = () =>
  // Stay one Wasm page short of 4GB: while e.g. Chrome is able to allocate
  // full 4GB Wasm memories, the size will wrap back to 0 bytes in Wasm side
  // for any code that deals with heap sizes, which would require special
  // casing all heap size related code to treat 0 specially.
  2147483648;

var growMemory = size => {
  var b = wasmMemory.buffer;
  var pages = (size - b.byteLength + 65535) >>> 16;
  try {
    // round size grow request up to wasm page size (fixed 64KB per spec)
    wasmMemory.grow(pages); // .grow() takes a delta compared to the previous size
    updateMemoryViews();
    return 1 /*success*/;
  } catch (e) {}
  // implicit 0 return to save code size (caller will cast "undefined" into 0
  // anyhow)
};
var _emscripten_resize_heap = requestedSize => {
  var oldSize = HEAPU8.length;
  // With CAN_ADDRESS_2GB or MEMORY64, pointers are already unsigned.
  requestedSize >>>= 0;
  // With multithreaded builds, races can happen (another thread might increase the size
  // in between), so return a failure, and let the caller retry.

  // Memory resize rules:
  // 1.  Always increase heap size to at least the requested size, rounded up
  //     to next page multiple.
  // 2a. If MEMORY_GROWTH_LINEAR_STEP == -1, excessively resize the heap
  //     geometrically: increase the heap size according to
  //     MEMORY_GROWTH_GEOMETRIC_STEP factor (default +20%), At most
  //     overreserve by MEMORY_GROWTH_GEOMETRIC_CAP bytes (default 96MB).
  // 2b. If MEMORY_GROWTH_LINEAR_STEP != -1, excessively resize the heap
  //     linearly: increase the heap size by at least
  //     MEMORY_GROWTH_LINEAR_STEP bytes.
  // 3.  Max size for the heap is capped at 2048MB-WASM_PAGE_SIZE, or by
  //     MAXIMUM_MEMORY, or by ASAN limit, depending on which is smallest
  // 4.  If we were unable to allocate as much memory, it may be due to
  //     over-eager decision to excessively reserve due to (3) above.
  //     Hence if an allocation fails, cut down on the amount of excess
  //     growth, in an attempt to succeed to perform a smaller allocation.

  // A limit is set for how much we can grow. We should not exceed that
  // (the wasm binary specifies it, so if we tried, we'd fail anyhow).
  var maxHeapSize = getHeapMax();
  if (requestedSize > maxHeapSize) {
    return false;
  }

  var alignUp = (x, multiple) => x + ((multiple - (x % multiple)) % multiple);

  // Loop through potential heap size increases. If we attempt a too eager
  // reservation that fails, cut down on the attempted size and reserve a
  // smaller bump instead. (max 3 times, chosen somewhat arbitrarily)
  for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
    var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown); // ensure geometric growth
    // but limit overreserving (default to capping at +96MB overgrowth at most)
    overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);

    var newSize = Math.min(
      maxHeapSize,
      alignUp(Math.max(requestedSize, overGrownHeapSize), 65536)
    );

    var replacement = growMemory(newSize);
    if (replacement) {
      return true;
    }
  }
  return false;
};

var _emscripten_run_script = ptr => {
  eval(UTF8ToString(ptr));
};

var ENV = {};

var getExecutableName = () => {
  return thisProgram || "./this.program";
};
var getEnvStrings = () => {
  if (!getEnvStrings.strings) {
    // Default values.
    // Browser language detection #8751
    var lang =
      (
        (typeof navigator == "object" &&
          navigator.languages &&
          navigator.languages[0]) ||
        "C"
      ).replace("-", "_") + ".UTF-8";
    var env = {
      USER: "web_user",
      LOGNAME: "web_user",
      PATH: "/",
      PWD: "/",
      HOME: "/home/web_user",
      LANG: lang,
      _: getExecutableName()
    };
    // Apply the user-provided values, if any.
    for (var x in ENV) {
      // x is a key in ENV; if ENV[x] is undefined, that means it was
      // explicitly set to be so. We allow user code to do that to
      // force variables with default values to remain unset.
      if (ENV[x] === undefined) delete env[x];
      else env[x] = ENV[x];
    }
    var strings = [];
    for (var x in env) {
      strings.push(`${x}=${env[x]}`);
    }
    getEnvStrings.strings = strings;
  }
  return getEnvStrings.strings;
};

var stringToAscii = (str, buffer) => {
  for (var i = 0; i < str.length; ++i) {
    HEAP8[buffer++ >> 0] = str.charCodeAt(i);
  }
  // Null-terminate the string
  HEAP8[buffer >> 0] = 0;
};

var _environ_get = (__environ, environ_buf) => {
  var bufSize = 0;
  getEnvStrings().forEach(function (string, i) {
    var ptr = environ_buf + bufSize;
    HEAPU32[(__environ + i * 4) >> 2] = ptr;
    stringToAscii(string, ptr);
    bufSize += string.length + 1;
  });
  return 0;
};

var _environ_sizes_get = (penviron_count, penviron_buf_size) => {
  var strings = getEnvStrings();
  HEAPU32[penviron_count >> 2] = strings.length;
  var bufSize = 0;
  strings.forEach(function (string) {
    bufSize += string.length + 1;
  });
  HEAPU32[penviron_buf_size >> 2] = bufSize;
  return 0;
};

function _fd_close(fd) {
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    FS.close(stream);
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return e.errno;
  }
}

function _fd_fdstat_get(fd, pbuf) {
  try {
    var rightsBase = 0;
    var rightsInheriting = 0;
    var flags = 0;
    {
      var stream = SYSCALLS.getStreamFromFD(fd);
      // All character devices are terminals (other things a Linux system would
      // assume is a character device, like the mouse, we have special APIs for).
      var type = stream.tty
        ? 2
        : FS.isDir(stream.mode)
        ? 3
        : FS.isLink(stream.mode)
        ? 7
        : 4;
    }
    HEAP8[pbuf >> 0] = type;
    HEAP16[(pbuf + 2) >> 1] = flags;
    (tempI64 = [
      rightsBase >>> 0,
      ((tempDouble = rightsBase),
      +Math.abs(tempDouble) >= 1.0
        ? tempDouble > 0.0
          ? +Math.floor(tempDouble / 4294967296.0) >>> 0
          : ~~+Math.ceil(
              (tempDouble - +(~~tempDouble >>> 0)) / 4294967296.0
            ) >>> 0
        : 0)
    ]),
      (HEAP32[(pbuf + 8) >> 2] = tempI64[0]),
      (HEAP32[(pbuf + 12) >> 2] = tempI64[1]);
    (tempI64 = [
      rightsInheriting >>> 0,
      ((tempDouble = rightsInheriting),
      +Math.abs(tempDouble) >= 1.0
        ? tempDouble > 0.0
          ? +Math.floor(tempDouble / 4294967296.0) >>> 0
          : ~~+Math.ceil(
              (tempDouble - +(~~tempDouble >>> 0)) / 4294967296.0
            ) >>> 0
        : 0)
    ]),
      (HEAP32[(pbuf + 16) >> 2] = tempI64[0]),
      (HEAP32[(pbuf + 20) >> 2] = tempI64[1]);
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return e.errno;
  }
}

/** @param {number=} offset */
var doReadv = (stream, iov, iovcnt, offset) => {
  var ret = 0;
  for (var i = 0; i < iovcnt; i++) {
    var ptr = HEAPU32[iov >> 2];
    var len = HEAPU32[(iov + 4) >> 2];
    iov += 8;
    var curr = FS.read(stream, HEAP8, ptr, len, offset);
    if (curr < 0) return -1;
    ret += curr;
    if (curr < len) break; // nothing more to read
    if (typeof offset !== "undefined") {
      offset += curr;
    }
  }
  return ret;
};

function _fd_read(fd, iov, iovcnt, pnum) {
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    var num = doReadv(stream, iov, iovcnt);
    HEAPU32[pnum >> 2] = num;
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return e.errno;
  }
}

function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
  var offset = convertI32PairToI53Checked(offset_low, offset_high);

  try {
    if (isNaN(offset)) return 61;
    var stream = SYSCALLS.getStreamFromFD(fd);
    FS.llseek(stream, offset, whence);
    (tempI64 = [
      stream.position >>> 0,
      ((tempDouble = stream.position),
      +Math.abs(tempDouble) >= 1.0
        ? tempDouble > 0.0
          ? +Math.floor(tempDouble / 4294967296.0) >>> 0
          : ~~+Math.ceil(
              (tempDouble - +(~~tempDouble >>> 0)) / 4294967296.0
            ) >>> 0
        : 0)
    ]),
      (HEAP32[newOffset >> 2] = tempI64[0]),
      (HEAP32[(newOffset + 4) >> 2] = tempI64[1]);
    if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null; // reset readdir state
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return e.errno;
  }
}

/** @param {number=} offset */
var doWritev = (stream, iov, iovcnt, offset) => {
  var ret = 0;
  for (var i = 0; i < iovcnt; i++) {
    var ptr = HEAPU32[iov >> 2];
    var len = HEAPU32[(iov + 4) >> 2];
    iov += 8;
    var curr = FS.write(stream, HEAP8, ptr, len, offset);
    if (curr < 0) return -1;
    ret += curr;
    if (typeof offset !== "undefined") {
      offset += curr;
    }
  }
  return ret;
};

function _fd_write(fd, iov, iovcnt, pnum) {
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    var num = doWritev(stream, iov, iovcnt);
    HEAPU32[pnum >> 2] = num;
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return e.errno;
  }
}

var arraySum = (array, index) => {
  var sum = 0;
  for (var i = 0; i <= index; sum += array[i++]) {
    // no-op
  }
  return sum;
};

var MONTH_DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

var MONTH_DAYS_REGULAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var addDays = (date, days) => {
  var newDate = new Date(date.getTime());
  while (days > 0) {
    var leap = isLeapYear(newDate.getFullYear());
    var currentMonth = newDate.getMonth();
    var daysInCurrentMonth = (leap ? MONTH_DAYS_LEAP : MONTH_DAYS_REGULAR)[
      currentMonth
    ];

    if (days > daysInCurrentMonth - newDate.getDate()) {
      // we spill over to next month
      days -= daysInCurrentMonth - newDate.getDate() + 1;
      newDate.setDate(1);
      if (currentMonth < 11) {
        newDate.setMonth(currentMonth + 1);
      } else {
        newDate.setMonth(0);
        newDate.setFullYear(newDate.getFullYear() + 1);
      }
    } else {
      // we stay in current month
      newDate.setDate(newDate.getDate() + days);
      return newDate;
    }
  }

  return newDate;
};

var writeArrayToMemory = (array, buffer) => {
  HEAP8.set(array, buffer);
};

var _strftime = (s, maxsize, format, tm) => {
  // size_t strftime(char *restrict s, size_t maxsize, const char *restrict format, const struct tm *restrict timeptr);
  // http://pubs.opengroup.org/onlinepubs/009695399/functions/strftime.html

  var tm_zone = HEAP32[(tm + 40) >> 2];

  var date = {
    tm_sec: HEAP32[tm >> 2],
    tm_min: HEAP32[(tm + 4) >> 2],
    tm_hour: HEAP32[(tm + 8) >> 2],
    tm_mday: HEAP32[(tm + 12) >> 2],
    tm_mon: HEAP32[(tm + 16) >> 2],
    tm_year: HEAP32[(tm + 20) >> 2],
    tm_wday: HEAP32[(tm + 24) >> 2],
    tm_yday: HEAP32[(tm + 28) >> 2],
    tm_isdst: HEAP32[(tm + 32) >> 2],
    tm_gmtoff: HEAP32[(tm + 36) >> 2],
    tm_zone: tm_zone ? UTF8ToString(tm_zone) : ""
  };

  var pattern = UTF8ToString(format);

  // expand format
  var EXPANSION_RULES_1 = {
    "%c": "%a %b %d %H:%M:%S %Y", // Replaced by the locale's appropriate date and time representation - e.g., Mon Aug  3 14:02:01 2013
    "%D": "%m/%d/%y", // Equivalent to %m / %d / %y
    "%F": "%Y-%m-%d", // Equivalent to %Y - %m - %d
    "%h": "%b", // Equivalent to %b
    "%r": "%I:%M:%S %p", // Replaced by the time in a.m. and p.m. notation
    "%R": "%H:%M", // Replaced by the time in 24-hour notation
    "%T": "%H:%M:%S", // Replaced by the time
    "%x": "%m/%d/%y", // Replaced by the locale's appropriate date representation
    "%X": "%H:%M:%S", // Replaced by the locale's appropriate time representation
    // Modified Conversion Specifiers
    "%Ec": "%c", // Replaced by the locale's alternative appropriate date and time representation.
    "%EC": "%C", // Replaced by the name of the base year (period) in the locale's alternative representation.
    "%Ex": "%m/%d/%y", // Replaced by the locale's alternative date representation.
    "%EX": "%H:%M:%S", // Replaced by the locale's alternative time representation.
    "%Ey": "%y", // Replaced by the offset from %EC (year only) in the locale's alternative representation.
    "%EY": "%Y", // Replaced by the full alternative year representation.
    "%Od": "%d", // Replaced by the day of the month, using the locale's alternative numeric symbols, filled as needed with leading zeros if there is any alternative symbol for zero; otherwise, with leading <space> characters.
    "%Oe": "%e", // Replaced by the day of the month, using the locale's alternative numeric symbols, filled as needed with leading <space> characters.
    "%OH": "%H", // Replaced by the hour (24-hour clock) using the locale's alternative numeric symbols.
    "%OI": "%I", // Replaced by the hour (12-hour clock) using the locale's alternative numeric symbols.
    "%Om": "%m", // Replaced by the month using the locale's alternative numeric symbols.
    "%OM": "%M", // Replaced by the minutes using the locale's alternative numeric symbols.
    "%OS": "%S", // Replaced by the seconds using the locale's alternative numeric symbols.
    "%Ou": "%u", // Replaced by the weekday as a number in the locale's alternative representation (Monday=1).
    "%OU": "%U", // Replaced by the week number of the year (Sunday as the first day of the week, rules corresponding to %U ) using the locale's alternative numeric symbols.
    "%OV": "%V", // Replaced by the week number of the year (Monday as the first day of the week, rules corresponding to %V ) using the locale's alternative numeric symbols.
    "%Ow": "%w", // Replaced by the number of the weekday (Sunday=0) using the locale's alternative numeric symbols.
    "%OW": "%W", // Replaced by the week number of the year (Monday as the first day of the week) using the locale's alternative numeric symbols.
    "%Oy": "%y" // Replaced by the year (offset from %C ) using the locale's alternative numeric symbols.
  };
  for (var rule in EXPANSION_RULES_1) {
    pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_1[rule]);
  }

  var WEEKDAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  var MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  function leadingSomething(value, digits, character) {
    var str = typeof value == "number" ? value.toString() : value || "";
    while (str.length < digits) {
      str = character[0] + str;
    }
    return str;
  }

  function leadingNulls(value, digits) {
    return leadingSomething(value, digits, "0");
  }

  function compareByDay(date1, date2) {
    function sgn(value) {
      return value < 0 ? -1 : value > 0 ? 1 : 0;
    }

    var compare;
    if ((compare = sgn(date1.getFullYear() - date2.getFullYear())) === 0) {
      if ((compare = sgn(date1.getMonth() - date2.getMonth())) === 0) {
        compare = sgn(date1.getDate() - date2.getDate());
      }
    }
    return compare;
  }

  function getFirstWeekStartDate(janFourth) {
    switch (janFourth.getDay()) {
      case 0: // Sunday
        return new Date(janFourth.getFullYear() - 1, 11, 29);
      case 1: // Monday
        return janFourth;
      case 2: // Tuesday
        return new Date(janFourth.getFullYear(), 0, 3);
      case 3: // Wednesday
        return new Date(janFourth.getFullYear(), 0, 2);
      case 4: // Thursday
        return new Date(janFourth.getFullYear(), 0, 1);
      case 5: // Friday
        return new Date(janFourth.getFullYear() - 1, 11, 31);
      case 6: // Saturday
        return new Date(janFourth.getFullYear() - 1, 11, 30);
    }
  }

  function getWeekBasedYear(date) {
    var thisDate = addDays(new Date(date.tm_year + 1900, 0, 1), date.tm_yday);

    var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
    var janFourthNextYear = new Date(thisDate.getFullYear() + 1, 0, 4);

    var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
    var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);

    if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
      // this date is after the start of the first week of this year
      if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
        return thisDate.getFullYear() + 1;
      }
      return thisDate.getFullYear();
    }
    return thisDate.getFullYear() - 1;
  }

  var EXPANSION_RULES_2 = {
    "%a": date => WEEKDAYS[date.tm_wday].substring(0, 3),
    "%A": date => WEEKDAYS[date.tm_wday],
    "%b": date => MONTHS[date.tm_mon].substring(0, 3),
    "%B": date => MONTHS[date.tm_mon],
    "%C": date => {
      var year = date.tm_year + 1900;
      return leadingNulls((year / 100) | 0, 2);
    },
    "%d": date => leadingNulls(date.tm_mday, 2),
    "%e": date => leadingSomething(date.tm_mday, 2, " "),
    "%g": date => {
      // %g, %G, and %V give values according to the ISO 8601:2000 standard week-based year.
      // In this system, weeks begin on a Monday and week 1 of the year is the week that includes
      // January 4th, which is also the week that includes the first Thursday of the year, and
      // is also the first week that contains at least four days in the year.
      // If the first Monday of January is the 2nd, 3rd, or 4th, the preceding days are part of
      // the last week of the preceding year; thus, for Saturday 2nd January 1999,
      // %G is replaced by 1998 and %V is replaced by 53. If December 29th, 30th,
      // or 31st is a Monday, it and any following days are part of week 1 of the following year.
      // Thus, for Tuesday 30th December 1997, %G is replaced by 1998 and %V is replaced by 01.

      return getWeekBasedYear(date).toString().substring(2);
    },
    "%G": date => getWeekBasedYear(date),
    "%H": date => leadingNulls(date.tm_hour, 2),
    "%I": date => {
      var twelveHour = date.tm_hour;
      if (twelveHour == 0) twelveHour = 12;
      else if (twelveHour > 12) twelveHour -= 12;
      return leadingNulls(twelveHour, 2);
    },
    "%j": date => {
      // Day of the year (001-366)
      return leadingNulls(
        date.tm_mday +
          arraySum(
            isLeapYear(date.tm_year + 1900)
              ? MONTH_DAYS_LEAP
              : MONTH_DAYS_REGULAR,
            date.tm_mon - 1
          ),
        3
      );
    },
    "%m": date => leadingNulls(date.tm_mon + 1, 2),
    "%M": date => leadingNulls(date.tm_min, 2),
    "%n": () => "\n",
    "%p": date => {
      if (date.tm_hour >= 0 && date.tm_hour < 12) {
        return "AM";
      }
      return "PM";
    },
    "%S": date => leadingNulls(date.tm_sec, 2),
    "%t": () => "\t",
    "%u": date => date.tm_wday || 7,
    "%U": date => {
      var days = date.tm_yday + 7 - date.tm_wday;
      return leadingNulls(Math.floor(days / 7), 2);
    },
    "%V": date => {
      // Replaced by the week number of the year (Monday as the first day of the week)
      // as a decimal number [01,53]. If the week containing 1 January has four
      // or more days in the new year, then it is considered week 1.
      // Otherwise, it is the last week of the previous year, and the next week is week 1.
      // Both January 4th and the first Thursday of January are always in week 1. [ tm_year, tm_wday, tm_yday]
      var val = Math.floor((date.tm_yday + 7 - ((date.tm_wday + 6) % 7)) / 7);
      // If 1 Jan is just 1-3 days past Monday, the previous week
      // is also in this year.
      if ((date.tm_wday + 371 - date.tm_yday - 2) % 7 <= 2) {
        val++;
      }
      if (!val) {
        val = 52;
        // If 31 December of prev year a Thursday, or Friday of a
        // leap year, then the prev year has 53 weeks.
        var dec31 = (date.tm_wday + 7 - date.tm_yday - 1) % 7;
        if (
          dec31 == 4 ||
          (dec31 == 5 && isLeapYear((date.tm_year % 400) - 1))
        ) {
          val++;
        }
      } else if (val == 53) {
        // If 1 January is not a Thursday, and not a Wednesday of a
        // leap year, then this year has only 52 weeks.
        var jan1 = (date.tm_wday + 371 - date.tm_yday) % 7;
        if (jan1 != 4 && (jan1 != 3 || !isLeapYear(date.tm_year))) val = 1;
      }
      return leadingNulls(val, 2);
    },
    "%w": date => date.tm_wday,
    "%W": date => {
      var days = date.tm_yday + 7 - ((date.tm_wday + 6) % 7);
      return leadingNulls(Math.floor(days / 7), 2);
    },
    "%y": date => {
      // Replaced by the last two digits of the year as a decimal number [00,99]. [ tm_year]
      return (date.tm_year + 1900).toString().substring(2);
    },
    // Replaced by the year as a decimal number (for example, 1997). [ tm_year]
    "%Y": date => date.tm_year + 1900,
    "%z": date => {
      // Replaced by the offset from UTC in the ISO 8601:2000 standard format ( +hhmm or -hhmm ).
      // For example, "-0430" means 4 hours 30 minutes behind UTC (west of Greenwich).
      var off = date.tm_gmtoff;
      var ahead = off >= 0;
      off = Math.abs(off) / 60;
      // convert from minutes into hhmm format (which means 60 minutes = 100 units)
      off = (off / 60) * 100 + (off % 60);
      return (ahead ? "+" : "-") + String("0000" + off).slice(-4);
    },
    "%Z": date => date.tm_zone,
    "%%": () => "%"
  };

  // Replace %% with a pair of NULLs (which cannot occur in a C string), then
  // re-inject them after processing.
  pattern = pattern.replace(/%%/g, "\0\0");
  for (var rule in EXPANSION_RULES_2) {
    if (pattern.includes(rule)) {
      pattern = pattern.replace(
        new RegExp(rule, "g"),
        EXPANSION_RULES_2[rule](date)
      );
    }
  }
  pattern = pattern.replace(/\0\0/g, "%");

  var bytes = intArrayFromString(pattern, false);
  if (bytes.length > maxsize) {
    return 0;
  }

  writeArrayToMemory(bytes, s);
  return bytes.length - 1;
};

var _proc_exit = code => {
  EXITSTATUS = code;
  if (!keepRuntimeAlive()) {
    if (Module["onExit"]) Module["onExit"](code);
    ABORT = true;
  }
  quit_(code, new ExitStatus(code));
};
/** @param {boolean|number=} implicit */
var exitJS = (status, implicit) => {
  EXITSTATUS = status;

  _proc_exit(status);
};

var handleException = e => {
  // Certain exception types we do not treat as errors since they are used for
  // internal control flow.
  // 1. ExitStatus, which is thrown by exit()
  // 2. "unwind", which is thrown by emscripten_unwind_to_js_event_loop() and others
  //    that wish to return to JS event loop.
  if (e instanceof ExitStatus || e == "unwind") {
    return EXITSTATUS;
  }
  quit_(1, e);
};

var stringToUTF8OnStack = str => {
  var size = lengthBytesUTF8(str) + 1;
  var ret = stackAlloc(size);
  stringToUTF8(str, ret, size);
  return ret;
};

function getCFunc(ident) {
  var func = Module["_" + ident]; // closure exported function
  return func;
}

/**
 * @param {string|null=} returnType
 * @param {Array=} argTypes
 * @param {Arguments|Array=} args
 * @param {Object=} opts
 */
var ccall = function (ident, returnType, argTypes, args, opts) {
  // For fast lookup of conversion functions
  var toC = {
    string: str => {
      var ret = 0;
      if (str !== null && str !== undefined && str !== 0) {
        // null string
        // at most 4 bytes per UTF-8 code point, +1 for the trailing '\0'
        ret = stringToUTF8OnStack(str);
      }
      return ret;
    },
    array: arr => {
      var ret = stackAlloc(arr.length);
      writeArrayToMemory(arr, ret);
      return ret;
    }
  };

  function convertReturnValue(ret) {
    if (returnType === "string") {
      return UTF8ToString(ret);
    }
    if (returnType === "boolean") return Boolean(ret);
    return ret;
  }

  var func = getCFunc(ident);
  var cArgs = [];
  var stack = 0;
  if (args) {
    for (var i = 0; i < args.length; i++) {
      var converter = toC[argTypes[i]];
      if (converter) {
        if (stack === 0) stack = stackSave();
        cArgs[i] = converter(args[i]);
      } else {
        cArgs[i] = args[i];
      }
    }
  }
  var ret = func.apply(null, cArgs);
  function onDone(ret) {
    if (stack !== 0) stackRestore(stack);
    return convertReturnValue(ret);
  }

  ret = onDone(ret);
  return ret;
};

/**
 * @param {string=} returnType
 * @param {Array=} argTypes
 * @param {Object=} opts
 */
var cwrap = function (ident, returnType, argTypes, opts) {
  // When the function takes numbers and returns a number, we can just return
  // the original function
  var numericArgs =
    !argTypes ||
    argTypes.every(type => type === "number" || type === "boolean");
  var numericRet = returnType !== "string";
  if (numericRet && numericArgs && !opts) {
    return getCFunc(ident);
  }
  return function () {
    return ccall(ident, returnType, argTypes, arguments, opts);
  };
};

var FSNode = /** @constructor */ function (parent, name, mode, rdev) {
  if (!parent) {
    parent = this; // root node sets parent to itself
  }
  this.parent = parent;
  this.mount = parent.mount;
  this.mounted = null;
  this.id = FS.nextInode++;
  this.name = name;
  this.mode = mode;
  this.node_ops = {};
  this.stream_ops = {};
  this.rdev = rdev;
};
var readMode = 292 /*292*/ | 73; /*73*/
var writeMode = 146; /*146*/
Object.defineProperties(FSNode.prototype, {
  read: {
    get: /** @this{FSNode} */ function () {
      return (this.mode & readMode) === readMode;
    },
    set: /** @this{FSNode} */ function (val) {
      val ? (this.mode |= readMode) : (this.mode &= ~readMode);
    }
  },
  write: {
    get: /** @this{FSNode} */ function () {
      return (this.mode & writeMode) === writeMode;
    },
    set: /** @this{FSNode} */ function (val) {
      val ? (this.mode |= writeMode) : (this.mode &= ~writeMode);
    }
  },
  isFolder: {
    get: /** @this{FSNode} */ function () {
      return FS.isDir(this.mode);
    }
  },
  isDevice: {
    get: /** @this{FSNode} */ function () {
      return FS.isChrdev(this.mode);
    }
  }
});
FS.FSNode = FSNode;
FS.createPreloadedFile = FS_createPreloadedFile;
FS.staticInit();
var wasmImports = {
  __syscall_faccessat: ___syscall_faccessat,
  __syscall_fcntl64: ___syscall_fcntl64,
  __syscall_fstat64: ___syscall_fstat64,
  __syscall_getdents64: ___syscall_getdents64,
  __syscall_lstat64: ___syscall_lstat64,
  __syscall_newfstatat: ___syscall_newfstatat,
  __syscall_openat: ___syscall_openat,
  __syscall_renameat: ___syscall_renameat,
  __syscall_rmdir: ___syscall_rmdir,
  __syscall_stat64: ___syscall_stat64,
  __syscall_unlinkat: ___syscall_unlinkat,
  _emscripten_get_now_is_monotonic: __emscripten_get_now_is_monotonic,
  _gmtime_js: __gmtime_js,
  _localtime_js: __localtime_js,
  _mktime_js: __mktime_js,
  _tzset_js: __tzset_js,
  abort: _abort,
  emscripten_date_now: _emscripten_date_now,
  emscripten_get_now: _emscripten_get_now,
  emscripten_memcpy_big: _emscripten_memcpy_big,
  emscripten_resize_heap: _emscripten_resize_heap,
  emscripten_run_script: _emscripten_run_script,
  environ_get: _environ_get,
  environ_sizes_get: _environ_sizes_get,
  fd_close: _fd_close,
  fd_fdstat_get: _fd_fdstat_get,
  fd_read: _fd_read,
  fd_seek: _fd_seek,
  fd_write: _fd_write,
  strftime: _strftime
};
var asm = createWasm();
/** @type {function(...*):?} */
var ___wasm_call_ctors = function () {
  return (___wasm_call_ctors = Module["asm"]["__wasm_call_ctors"]).apply(
    null,
    arguments
  );
};

/** @type {function(...*):?} */
var _malloc = function () {
  return (_malloc = Module["asm"]["malloc"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _captureByCount = (Module["_captureByCount"] = function () {
  return (_captureByCount = Module["_captureByCount"] =
    Module["asm"]["captureByCount"]).apply(null, arguments);
});

/** @type {function(...*):?} */
var _captureByMs = (Module["_captureByMs"] = function () {
  return (_captureByMs = Module["_captureByMs"] =
    Module["asm"]["captureByMs"]).apply(null, arguments);
});

/** @type {function(...*):?} */
var _main = (Module["_main"] = function () {
  return (_main = Module["_main"] = Module["asm"]["__main_argc_argv"]).apply(
    null,
    arguments
  );
});

/** @type {function(...*):?} */
var ___errno_location = function () {
  return (___errno_location = Module["asm"]["__errno_location"]).apply(
    null,
    arguments
  );
};

/** @type {function(...*):?} */
var _free = (Module["_free"] = function () {
  return (_free = Module["_free"] = Module["asm"]["free"]).apply(
    null,
    arguments
  );
});

/** @type {function(...*):?} */
var setTempRet0 = function () {
  return (setTempRet0 = Module["asm"]["setTempRet0"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var stackSave = function () {
  return (stackSave = Module["asm"]["stackSave"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var stackRestore = function () {
  return (stackRestore = Module["asm"]["stackRestore"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var stackAlloc = function () {
  return (stackAlloc = Module["asm"]["stackAlloc"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var dynCall_iiiji = (Module["dynCall_iiiji"] = function () {
  return (dynCall_iiiji = Module["dynCall_iiiji"] =
    Module["asm"]["dynCall_iiiji"]).apply(null, arguments);
});

/** @type {function(...*):?} */
var dynCall_jiji = (Module["dynCall_jiji"] = function () {
  return (dynCall_jiji = Module["dynCall_jiji"] =
    Module["asm"]["dynCall_jiji"]).apply(null, arguments);
});

/** @type {function(...*):?} */
var dynCall_jiiji = (Module["dynCall_jiiji"] = function () {
  return (dynCall_jiiji = Module["dynCall_jiiji"] =
    Module["asm"]["dynCall_jiiji"]).apply(null, arguments);
});

// include: postamble.js
// === Auto-generated postamble setup entry stuff ===

Module["ccall"] = ccall;
Module["cwrap"] = cwrap;

var calledRun;

dependenciesFulfilled = function runCaller() {
  // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
  if (!calledRun) run();
  if (!calledRun) dependenciesFulfilled = runCaller; // try this again later, after new deps are fulfilled
};

function callMain(args = []) {
  var entryFunction = _main;

  args.unshift(thisProgram);

  var argc = args.length;
  var argv = stackAlloc((argc + 1) * 4);
  var argv_ptr = argv >> 2;
  args.forEach(arg => {
    HEAP32[argv_ptr++] = stringToUTF8OnStack(arg);
  });
  HEAP32[argv_ptr] = 0;

  try {
    var ret = entryFunction(argc, argv);

    // if we're not running an evented main loop, it's time to exit
    exitJS(ret, /* implicit = */ true);
    return ret;
  } catch (e) {
    return handleException(e);
  }
}

function run(args = arguments_) {
  if (runDependencies > 0) {
    return;
  }

  preRun();

  // a preRun added a dependency, run will be called later
  if (runDependencies > 0) {
    return;
  }

  function doRun() {
    // run may have just been called through dependencies being fulfilled just in this very frame,
    // or while the async setStatus time below was happening
    if (calledRun) return;
    calledRun = true;
    Module["calledRun"] = true;

    if (ABORT) return;

    initRuntime();

    preMain();

    if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();

    if (shouldRunNow) callMain(args);

    postRun();
  }

  if (Module["setStatus"]) {
    Module["setStatus"]("Running...");
    setTimeout(function () {
      setTimeout(function () {
        Module["setStatus"]("");
      }, 1);
      doRun();
    }, 1);
  } else {
    doRun();
  }
}

if (Module["preInit"]) {
  if (typeof Module["preInit"] == "function")
    Module["preInit"] = [Module["preInit"]];
  while (Module["preInit"].length > 0) {
    Module["preInit"].pop()();
  }
}

// shouldRunNow refers to calling main(), not run().
var shouldRunNow = true;

if (Module["noInitialRun"]) shouldRunNow = false;

run();

// end include: postamble.js

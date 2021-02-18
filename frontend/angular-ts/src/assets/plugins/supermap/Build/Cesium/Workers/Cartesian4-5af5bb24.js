/**
 * Cesium - https://github.com/AnalyticalGraphicsInc/cesium
 *
 * Copyright 2011-2017 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/AnalyticalGraphicsInc/cesium/blob/master/LICENSE.md for full licensing details.
 */
define(['exports', './when-8d13db60', './Check-70bec281', './Math-61ede240'], function (exports, when, Check, _Math) { 'use strict';

    /**
         * A 4D Cartesian point.
         * @alias Cartesian4
         * @constructor
         *
         * @param {Number} [x=0.0] The X component.
         * @param {Number} [y=0.0] The Y component.
         * @param {Number} [z=0.0] The Z component.
         * @param {Number} [w=0.0] The W component.
         *
         * @see Cartesian2
         * @see Cartesian3
         * @see Packable
         */
        function Cartesian4(x, y, z, w) {
            /**
             * The X component.
             * @type {Number}
             * @default 0.0
             */
            this.x = when.defaultValue(x, 0.0);

            /**
             * The Y component.
             * @type {Number}
             * @default 0.0
             */
            this.y = when.defaultValue(y, 0.0);

            /**
             * The Z component.
             * @type {Number}
             * @default 0.0
             */
            this.z = when.defaultValue(z, 0.0);

            /**
             * The W component.
             * @type {Number}
             * @default 0.0
             */
            this.w = when.defaultValue(w, 0.0);
        }

        /**
         * Creates a Cartesian4 instance from x, y, z and w coordinates.
         *
         * @param {Number} x The x coordinate.
         * @param {Number} y The y coordinate.
         * @param {Number} z The z coordinate.
         * @param {Number} w The w coordinate.
         * @param {Cartesian4} [result] The object onto which to store the result.
         * @returns {Cartesian4} The modified result parameter or a new Cartesian4 instance if one was not provided.
         */
        Cartesian4.fromElements = function(x, y, z, w, result) {
            if (!when.defined(result)) {
                return new Cartesian4(x, y, z, w);
            }

            result.x = x;
            result.y = y;
            result.z = z;
            result.w = w;
            return result;
        };

        /**
         * Creates a Cartesian4 instance from a {@link Color}. <code>red</code>, <code>green</code>, <code>blue</code>,
         * and <code>alpha</code> map to <code>x</code>, <code>y</code>, <code>z</code>, and <code>w</code>, respectively.
         *
         * @param {Color} color The source color.
         * @param {Cartesian4} [result] The object onto which to store the result.
         * @returns {Cartesian4} The modified result parameter or a new Cartesian4 instance if one was not provided.
         */
        Cartesian4.fromColor = function(color, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('color', color);
            //>>includeEnd('debug');
            if (!when.defined(result)) {
                return new Cartesian4(color.red, color.green, color.blue, color.alpha);
            }

            result.x = color.red;
            result.y = color.green;
            result.z = color.blue;
            result.w = color.alpha;
            return result;
        };

        /**
         * Duplicates a Cartesian4 instance.
         *
         * @param {Cartesian4} cartesian The Cartesian to duplicate.
         * @param {Cartesian4} [result] The object onto which to store the result.
         * @returns {Cartesian4} The modified result parameter or a new Cartesian4 instance if one was not provided. (Returns undefined if cartesian is undefined)
         */
        Cartesian4.clone = function(cartesian, result) {
            if (!when.defined(cartesian)) {
                return undefined;
            }

            if (!when.defined(result)) {
                return new Cartesian4(cartesian.x, cartesian.y, cartesian.z, cartesian.w);
            }

            result.x = cartesian.x;
            result.y = cartesian.y;
            result.z = cartesian.z;
            result.w = cartesian.w;
            return result;
        };

        /**
         * The number of elements used to pack the object into an array.
         * @type {Number}
         */
        Cartesian4.packedLength = 4;

        /**
         * Stores the provided instance into the provided array.
         *
         * @param {Cartesian4} value The value to pack.
         * @param {Number[]} array The array to pack into.
         * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
         *
         * @returns {Number[]} The array that was packed into
         */
        Cartesian4.pack = function(value, array, startingIndex) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('value', value);
            Check.Check.defined('array', array);
            //>>includeEnd('debug');

            startingIndex = when.defaultValue(startingIndex, 0);

            array[startingIndex++] = value.x;
            array[startingIndex++] = value.y;
            array[startingIndex++] = value.z;
            array[startingIndex] = value.w;

            return array;
        };

        /**
         * Retrieves an instance from a packed array.
         *
         * @param {Number[]} array The packed array.
         * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
         * @param {Cartesian4} [result] The object into which to store the result.
         * @returns {Cartesian4}  The modified result parameter or a new Cartesian4 instance if one was not provided.
         */
        Cartesian4.unpack = function(array, startingIndex, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('array', array);
            //>>includeEnd('debug');

            startingIndex = when.defaultValue(startingIndex, 0);

            if (!when.defined(result)) {
                result = new Cartesian4();
            }
            result.x = array[startingIndex++];
            result.y = array[startingIndex++];
            result.z = array[startingIndex++];
            result.w = array[startingIndex];
            return result;
        };

        /**
         * Flattens an array of Cartesian4s into and array of components.
         *
         * @param {Cartesian4[]} array The array of cartesians to pack.
         * @param {Number[]} [result] The array onto which to store the result. If this is a typed array, it must have array.length * 4 components, else a {@link DeveloperError} will be thrown. If it is a regular array, it will be resized to have (array.length * 4) elements.

         * @returns {Number[]} The packed array.
         */
        Cartesian4.packArray = function(array, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('array', array);
            //>>includeEnd('debug');

            var length = array.length;
            var resultLength = length * 4;
            if (!when.defined(result)) {
                result = new Array(resultLength);
            } else if (!Array.isArray(result) && result.length !== resultLength) {
                throw new Check.DeveloperError('If result is a typed array, it must have exactly array.length * 4 elements');
            } else if (result.length !== resultLength) {
                result.length = resultLength;
            }

            for (var i = 0; i < length; ++i) {
                Cartesian4.pack(array[i], result, i * 4);
            }
            return result;
        };

        /**
         * Unpacks an array of cartesian components into and array of Cartesian4s.
         *
         * @param {Number[]} array The array of components to unpack.
         * @param {Cartesian4[]} [result] The array onto which to store the result.
         * @returns {Cartesian4[]} The unpacked array.
         */
        Cartesian4.unpackArray = function(array, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('array', array);
            Check.Check.typeOf.number.greaterThanOrEquals('array.length', array.length, 4);
            if (array.length % 4 !== 0) {
                throw new Check.DeveloperError('array length must be a multiple of 4.');
            }
            //>>includeEnd('debug');

            var length = array.length;
            if (!when.defined(result)) {
                result = new Array(length / 4);
            } else {
                result.length = length / 4;
            }

            for (var i = 0; i < length; i += 4) {
                var index = i / 4;
                result[index] = Cartesian4.unpack(array, i, result[index]);
            }
            return result;
        };

        /**
         * Creates a Cartesian4 from four consecutive elements in an array.
         * @function
         *
         * @param {Number[]} array The array whose four consecutive elements correspond to the x, y, z, and w components, respectively.
         * @param {Number} [startingIndex=0] The offset into the array of the first element, which corresponds to the x component.
         * @param {Cartesian4} [result] The object onto which to store the result.
         * @returns {Cartesian4}  The modified result parameter or a new Cartesian4 instance if one was not provided.
         *
         * @example
         * // Create a Cartesian4 with (1.0, 2.0, 3.0, 4.0)
         * var v = [1.0, 2.0, 3.0, 4.0];
         * var p = Cesium.Cartesian4.fromArray(v);
         *
         * // Create a Cartesian4 with (1.0, 2.0, 3.0, 4.0) using an offset into an array
         * var v2 = [0.0, 0.0, 1.0, 2.0, 3.0, 4.0];
         * var p2 = Cesium.Cartesian4.fromArray(v2, 2);
         */
        Cartesian4.fromArray = Cartesian4.unpack;

        /**
         * Computes the value of the maximum component for the supplied Cartesian.
         *
         * @param {Cartesian4} cartesian The cartesian to use.
         * @returns {Number} The value of the maximum component.
         */
        Cartesian4.maximumComponent = function(cartesian) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('cartesian', cartesian);
            //>>includeEnd('debug');

            return Math.max(cartesian.x, cartesian.y, cartesian.z, cartesian.w);
        };

        /**
         * Computes the value of the minimum component for the supplied Cartesian.
         *
         * @param {Cartesian4} cartesian The cartesian to use.
         * @returns {Number} The value of the minimum component.
         */
        Cartesian4.minimumComponent = function(cartesian) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('cartesian', cartesian);
            //>>includeEnd('debug');

            return Math.min(cartesian.x, cartesian.y, cartesian.z, cartesian.w);
        };

        /**
         * Compares two Cartesians and computes a Cartesian which contains the minimum components of the supplied Cartesians.
         *
         * @param {Cartesian4} first A cartesian to compare.
         * @param {Cartesian4} second A cartesian to compare.
         * @param {Cartesian4} result The object into which to store the result.
         * @returns {Cartesian4} A cartesian with the minimum components.
         */
        Cartesian4.minimumByComponent = function(first, second, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('first', first);
            Check.Check.typeOf.object('second', second);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result.x = Math.min(first.x, second.x);
            result.y = Math.min(first.y, second.y);
            result.z = Math.min(first.z, second.z);
            result.w = Math.min(first.w, second.w);

            return result;
        };

        /**
         * Compares two Cartesians and computes a Cartesian which contains the maximum components of the supplied Cartesians.
         *
         * @param {Cartesian4} first A cartesian to compare.
         * @param {Cartesian4} second A cartesian to compare.
         * @param {Cartesian4} result The object into which to store the result.
         * @returns {Cartesian4} A cartesian with the maximum components.
         */
        Cartesian4.maximumByComponent = function(first, second, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('first', first);
            Check.Check.typeOf.object('second', second);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result.x = Math.max(first.x, second.x);
            result.y = Math.max(first.y, second.y);
            result.z = Math.max(first.z, second.z);
            result.w = Math.max(first.w, second.w);

            return result;
        };

        /**
         * Computes the provided Cartesian's squared magnitude.
         *
         * @param {Cartesian4} cartesian The Cartesian instance whose squared magnitude is to be computed.
         * @returns {Number} The squared magnitude.
         */
        Cartesian4.magnitudeSquared = function(cartesian) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('cartesian', cartesian);
            //>>includeEnd('debug');

            return cartesian.x * cartesian.x + cartesian.y * cartesian.y + cartesian.z * cartesian.z + cartesian.w * cartesian.w;
        };

        /**
         * Computes the Cartesian's magnitude (length).
         *
         * @param {Cartesian4} cartesian The Cartesian instance whose magnitude is to be computed.
         * @returns {Number} The magnitude.
         */
        Cartesian4.magnitude = function(cartesian) {
            return Math.sqrt(Cartesian4.magnitudeSquared(cartesian));
        };

        var distanceScratch = new Cartesian4();

        /**
         * Computes the 4-space distance between two points.
         *
         * @param {Cartesian4} left The first point to compute the distance from.
         * @param {Cartesian4} right The second point to compute the distance to.
         * @returns {Number} The distance between two points.
         *
         * @example
         * // Returns 1.0
         * var d = Cesium.Cartesian4.distance(
         *   new Cesium.Cartesian4(1.0, 0.0, 0.0, 0.0),
         *   new Cesium.Cartesian4(2.0, 0.0, 0.0, 0.0));
         */
        Cartesian4.distance = function(left, right) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('left', left);
            Check.Check.typeOf.object('right', right);
            //>>includeEnd('debug');

            Cartesian4.subtract(left, right, distanceScratch);
            return Cartesian4.magnitude(distanceScratch);
        };

        /**
         * Computes the squared distance between two points.  Comparing squared distances
         * using this function is more efficient than comparing distances using {@link Cartesian4#distance}.
         *
         * @param {Cartesian4} left The first point to compute the distance from.
         * @param {Cartesian4} right The second point to compute the distance to.
         * @returns {Number} The distance between two points.
         *
         * @example
         * // Returns 4.0, not 2.0
         * var d = Cesium.Cartesian4.distance(
         *   new Cesium.Cartesian4(1.0, 0.0, 0.0, 0.0),
         *   new Cesium.Cartesian4(3.0, 0.0, 0.0, 0.0));
         */
        Cartesian4.distanceSquared = function(left, right) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('left', left);
            Check.Check.typeOf.object('right', right);
            //>>includeEnd('debug');

            Cartesian4.subtract(left, right, distanceScratch);
            return Cartesian4.magnitudeSquared(distanceScratch);
        };

        /**
         * Computes the normalized form of the supplied Cartesian.
         *
         * @param {Cartesian4} cartesian The Cartesian to be normalized.
         * @param {Cartesian4} result The object onto which to store the result.
         * @returns {Cartesian4} The modified result parameter.
         */
        Cartesian4.normalize = function(cartesian, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('cartesian', cartesian);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var magnitude = Cartesian4.magnitude(cartesian);

            result.x = cartesian.x / magnitude;
            result.y = cartesian.y / magnitude;
            result.z = cartesian.z / magnitude;
            result.w = cartesian.w / magnitude;

            //>>includeStart('debug', pragmas.debug);
            if (isNaN(result.x) || isNaN(result.y) || isNaN(result.z) || isNaN(result.w)) {
                throw new Check.DeveloperError('normalized result is not a number');
            }
            //>>includeEnd('debug');

            return result;
        };

        /**
         * Computes the dot (scalar) product of two Cartesians.
         *
         * @param {Cartesian4} left The first Cartesian.
         * @param {Cartesian4} right The second Cartesian.
         * @returns {Number} The dot product.
         */
        Cartesian4.dot = function(left, right) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('left', left);
            Check.Check.typeOf.object('right', right);
            //>>includeEnd('debug');

            return left.x * right.x + left.y * right.y + left.z * right.z + left.w * right.w;
        };

        /**
         * Computes the componentwise product of two Cartesians.
         *
         * @param {Cartesian4} left The first Cartesian.
         * @param {Cartesian4} right The second Cartesian.
         * @param {Cartesian4} result The object onto which to store the result.
         * @returns {Cartesian4} The modified result parameter.
         */
        Cartesian4.multiplyComponents = function(left, right, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('left', left);
            Check.Check.typeOf.object('right', right);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result.x = left.x * right.x;
            result.y = left.y * right.y;
            result.z = left.z * right.z;
            result.w = left.w * right.w;
            return result;
        };

        /**
         * Computes the componentwise quotient of two Cartesians.
         *
         * @param {Cartesian4} left The first Cartesian.
         * @param {Cartesian4} right The second Cartesian.
         * @param {Cartesian4} result The object onto which to store the result.
         * @returns {Cartesian4} The modified result parameter.
         */
        Cartesian4.divideComponents = function(left, right, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('left', left);
            Check.Check.typeOf.object('right', right);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result.x = left.x / right.x;
            result.y = left.y / right.y;
            result.z = left.z / right.z;
            result.w = left.w / right.w;
            return result;
        };

        /**
         * Computes the componentwise sum of two Cartesians.
         *
         * @param {Cartesian4} left The first Cartesian.
         * @param {Cartesian4} right The second Cartesian.
         * @param {Cartesian4} result The object onto which to store the result.
         * @returns {Cartesian4} The modified result parameter.
         */
        Cartesian4.add = function(left, right, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('left', left);
            Check.Check.typeOf.object('right', right);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result.x = left.x + right.x;
            result.y = left.y + right.y;
            result.z = left.z + right.z;
            result.w = left.w + right.w;
            return result;
        };

        /**
         * Computes the componentwise difference of two Cartesians.
         *
         * @param {Cartesian4} left The first Cartesian.
         * @param {Cartesian4} right The second Cartesian.
         * @param {Cartesian4} result The object onto which to store the result.
         * @returns {Cartesian4} The modified result parameter.
         */
        Cartesian4.subtract = function(left, right, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('left', left);
            Check.Check.typeOf.object('right', right);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result.x = left.x - right.x;
            result.y = left.y - right.y;
            result.z = left.z - right.z;
            result.w = left.w - right.w;
            return result;
        };

        /**
         * Multiplies the provided Cartesian componentwise by the provided scalar.
         *
         * @param {Cartesian4} cartesian The Cartesian to be scaled.
         * @param {Number} scalar The scalar to multiply with.
         * @param {Cartesian4} result The object onto which to store the result.
         * @returns {Cartesian4} The modified result parameter.
         */
        Cartesian4.multiplyByScalar = function(cartesian, scalar, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('cartesian', cartesian);
            Check.Check.typeOf.number('scalar', scalar);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result.x = cartesian.x * scalar;
            result.y = cartesian.y * scalar;
            result.z = cartesian.z * scalar;
            result.w = cartesian.w * scalar;
            return result;
        };

        /**
         * Divides the provided Cartesian componentwise by the provided scalar.
         *
         * @param {Cartesian4} cartesian The Cartesian to be divided.
         * @param {Number} scalar The scalar to divide by.
         * @param {Cartesian4} result The object onto which to store the result.
         * @returns {Cartesian4} The modified result parameter.
         */
        Cartesian4.divideByScalar = function(cartesian, scalar, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('cartesian', cartesian);
            Check.Check.typeOf.number('scalar', scalar);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result.x = cartesian.x / scalar;
            result.y = cartesian.y / scalar;
            result.z = cartesian.z / scalar;
            result.w = cartesian.w / scalar;
            return result;
        };

        /**
         * Negates the provided Cartesian.
         *
         * @param {Cartesian4} cartesian The Cartesian to be negated.
         * @param {Cartesian4} result The object onto which to store the result.
         * @returns {Cartesian4} The modified result parameter.
         */
        Cartesian4.negate = function(cartesian, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('cartesian', cartesian);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result.x = -cartesian.x;
            result.y = -cartesian.y;
            result.z = -cartesian.z;
            result.w = -cartesian.w;
            return result;
        };

        /**
         * Computes the absolute value of the provided Cartesian.
         *
         * @param {Cartesian4} cartesian The Cartesian whose absolute value is to be computed.
         * @param {Cartesian4} result The object onto which to store the result.
         * @returns {Cartesian4} The modified result parameter.
         */
        Cartesian4.abs = function(cartesian, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('cartesian', cartesian);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result.x = Math.abs(cartesian.x);
            result.y = Math.abs(cartesian.y);
            result.z = Math.abs(cartesian.z);
            result.w = Math.abs(cartesian.w);
            return result;
        };

        var lerpScratch = new Cartesian4();
        /**
         * Computes the linear interpolation or extrapolation at t using the provided cartesians.
         *
         * @param {Cartesian4} start The value corresponding to t at 0.0.
         * @param {Cartesian4}end The value corresponding to t at 1.0.
         * @param {Number} t The point along t at which to interpolate.
         * @param {Cartesian4} result The object onto which to store the result.
         * @returns {Cartesian4} The modified result parameter.
         */
        Cartesian4.lerp = function(start, end, t, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('start', start);
            Check.Check.typeOf.object('end', end);
            Check.Check.typeOf.number('t', t);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            Cartesian4.multiplyByScalar(end, t, lerpScratch);
            result = Cartesian4.multiplyByScalar(start, 1.0 - t, result);
            return Cartesian4.add(lerpScratch, result, result);
        };

        var mostOrthogonalAxisScratch = new Cartesian4();
        /**
         * Returns the axis that is most orthogonal to the provided Cartesian.
         *
         * @param {Cartesian4} cartesian The Cartesian on which to find the most orthogonal axis.
         * @param {Cartesian4} result The object onto which to store the result.
         * @returns {Cartesian4} The most orthogonal axis.
         */
        Cartesian4.mostOrthogonalAxis = function(cartesian, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('cartesian', cartesian);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var f = Cartesian4.normalize(cartesian, mostOrthogonalAxisScratch);
            Cartesian4.abs(f, f);

            if (f.x <= f.y) {
                if (f.x <= f.z) {
                    if (f.x <= f.w) {
                        result = Cartesian4.clone(Cartesian4.UNIT_X, result);
                    } else {
                        result = Cartesian4.clone(Cartesian4.UNIT_W, result);
                    }
                } else if (f.z <= f.w) {
                    result = Cartesian4.clone(Cartesian4.UNIT_Z, result);
                } else {
                    result = Cartesian4.clone(Cartesian4.UNIT_W, result);
                }
            } else if (f.y <= f.z) {
                if (f.y <= f.w) {
                    result = Cartesian4.clone(Cartesian4.UNIT_Y, result);
                } else {
                    result = Cartesian4.clone(Cartesian4.UNIT_W, result);
                }
            } else if (f.z <= f.w) {
                result = Cartesian4.clone(Cartesian4.UNIT_Z, result);
            } else {
                result = Cartesian4.clone(Cartesian4.UNIT_W, result);
            }

            return result;
        };

        /**
         * Compares the provided Cartesians componentwise and returns
         * <code>true</code> if they are equal, <code>false</code> otherwise.
         *
         * @param {Cartesian4} [left] The first Cartesian.
         * @param {Cartesian4} [right] The second Cartesian.
         * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
         */
        Cartesian4.equals = function(left, right) {
            return (left === right) ||
                   ((when.defined(left)) &&
                    (when.defined(right)) &&
                    (left.x === right.x) &&
                    (left.y === right.y) &&
                    (left.z === right.z) &&
                    (left.w === right.w));
        };

        /**
         * @private
         */
        Cartesian4.equalsArray = function(cartesian, array, offset) {
            return cartesian.x === array[offset] &&
                   cartesian.y === array[offset + 1] &&
                   cartesian.z === array[offset + 2] &&
                   cartesian.w === array[offset + 3];
        };

        /**
         * Compares the provided Cartesians componentwise and returns
         * <code>true</code> if they pass an absolute or relative tolerance test,
         * <code>false</code> otherwise.
         *
         * @param {Cartesian4} [left] The first Cartesian.
         * @param {Cartesian4} [right] The second Cartesian.
         * @param {Number} relativeEpsilon The relative epsilon tolerance to use for equality testing.
         * @param {Number} [absoluteEpsilon=relativeEpsilon] The absolute epsilon tolerance to use for equality testing.
         * @returns {Boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
         */
        Cartesian4.equalsEpsilon = function(left, right, relativeEpsilon, absoluteEpsilon) {
            return (left === right) ||
                   (when.defined(left) &&
                    when.defined(right) &&
                    _Math.CesiumMath.equalsEpsilon(left.x, right.x, relativeEpsilon, absoluteEpsilon) &&
                    _Math.CesiumMath.equalsEpsilon(left.y, right.y, relativeEpsilon, absoluteEpsilon) &&
                    _Math.CesiumMath.equalsEpsilon(left.z, right.z, relativeEpsilon, absoluteEpsilon) &&
                    _Math.CesiumMath.equalsEpsilon(left.w, right.w, relativeEpsilon, absoluteEpsilon));
        };

        /**
         * An immutable Cartesian4 instance initialized to (0.0, 0.0, 0.0, 0.0).
         *
         * @type {Cartesian4}
         * @constant
         */
        Cartesian4.ZERO = Object.freeze(new Cartesian4(0.0, 0.0, 0.0, 0.0));

        /**
         * An immutable Cartesian4 instance initialized to (1.0, 0.0, 0.0, 0.0).
         *
         * @type {Cartesian4}
         * @constant
         */
        Cartesian4.UNIT_X = Object.freeze(new Cartesian4(1.0, 0.0, 0.0, 0.0));

        /**
         * An immutable Cartesian4 instance initialized to (0.0, 1.0, 0.0, 0.0).
         *
         * @type {Cartesian4}
         * @constant
         */
        Cartesian4.UNIT_Y = Object.freeze(new Cartesian4(0.0, 1.0, 0.0, 0.0));

        /**
         * An immutable Cartesian4 instance initialized to (0.0, 0.0, 1.0, 0.0).
         *
         * @type {Cartesian4}
         * @constant
         */
        Cartesian4.UNIT_Z = Object.freeze(new Cartesian4(0.0, 0.0, 1.0, 0.0));

        /**
         * An immutable Cartesian4 instance initialized to (0.0, 0.0, 0.0, 1.0).
         *
         * @type {Cartesian4}
         * @constant
         */
        Cartesian4.UNIT_W = Object.freeze(new Cartesian4(0.0, 0.0, 0.0, 1.0));

        /**
         * Duplicates this Cartesian4 instance.
         *
         * @param {Cartesian4} [result] The object onto which to store the result.
         * @returns {Cartesian4} The modified result parameter or a new Cartesian4 instance if one was not provided.
         */
        Cartesian4.prototype.clone = function(result) {
            return Cartesian4.clone(this, result);
        };

        /**
         * Compares this Cartesian against the provided Cartesian componentwise and returns
         * <code>true</code> if they are equal, <code>false</code> otherwise.
         *
         * @param {Cartesian4} [right] The right hand side Cartesian.
         * @returns {Boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
         */
        Cartesian4.prototype.equals = function(right) {
            return Cartesian4.equals(this, right);
        };

        /**
         * Compares this Cartesian against the provided Cartesian componentwise and returns
         * <code>true</code> if they pass an absolute or relative tolerance test,
         * <code>false</code> otherwise.
         *
         * @param {Cartesian4} [right] The right hand side Cartesian.
         * @param {Number} relativeEpsilon The relative epsilon tolerance to use for equality testing.
         * @param {Number} [absoluteEpsilon=relativeEpsilon] The absolute epsilon tolerance to use for equality testing.
         * @returns {Boolean} <code>true</code> if they are within the provided epsilon, <code>false</code> otherwise.
         */
        Cartesian4.prototype.equalsEpsilon = function(right, relativeEpsilon, absoluteEpsilon) {
            return Cartesian4.equalsEpsilon(this, right, relativeEpsilon, absoluteEpsilon);
        };

        /**
         * Creates a string representing this Cartesian in the format '(x, y, z, w)'.
         *
         * @returns {String} A string representing the provided Cartesian in the format '(x, y, z, w)'.
         */
        Cartesian4.prototype.toString = function() {
            return '(' + this.x + ', ' + this.y + ', ' + this.z + ', ' + this.w + ')';
        };

        var scratchFloatArray = new Float32Array(1);
        var SHIFT_LEFT_8 = 256.0;
        var SHIFT_LEFT_16 = 65536.0;
        var SHIFT_LEFT_24 = 16777216.0;

        var SHIFT_RIGHT_8 = 1.0 / SHIFT_LEFT_8;
        var SHIFT_RIGHT_16 = 1.0 / SHIFT_LEFT_16;
        var SHIFT_RIGHT_24 = 1.0 / SHIFT_LEFT_24;

        var BIAS = 38.0;

        /**
         * Packs an arbitrary floating point value to 4 values representable using uint8.
         *
         * @param {Number} value A floating point number
         * @param {Cartesian4} [result] The Cartesian4 that will contain the packed float.
         * @returns {Cartesian4} A Cartesian4 representing the float packed to values in x, y, z, and w.
         */
        Cartesian4.packFloat = function(value, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.number('value', value);
            //>>includeEnd('debug');

            if (!when.defined(result)) {
                result = new Cartesian4();
            }

            // Force the value to 32 bit precision
            scratchFloatArray[0] = value;
            value = scratchFloatArray[0];

            if (value === 0.0) {
                return Cartesian4.clone(Cartesian4.ZERO, result);
            }

            var sign = value < 0.0 ? 1.0 : 0.0;
            var exponent;

            if (!isFinite(value)) {
                value = 0.1;
                exponent = BIAS;
            } else {
                value = Math.abs(value);
                exponent = Math.floor(_Math.CesiumMath.logBase(value, 10)) + 1.0;
                value = value / Math.pow(10.0, exponent);
            }

            var temp = value * SHIFT_LEFT_8;
            result.x = Math.floor(temp);
            temp = (temp - result.x) * SHIFT_LEFT_8;
            result.y = Math.floor(temp);
            temp = (temp - result.y) * SHIFT_LEFT_8;
            result.z = Math.floor(temp);
            result.w = (exponent + BIAS) * 2.0 + sign;

            return result;
        };

        /**
         * Unpacks a float packed using Cartesian4.packFloat.
         *
         * @param {Cartesian4} packedFloat A Cartesian4 containing a float packed to 4 values representable using uint8.
         * @returns {Number} The unpacked float.
         * @private
         */
        Cartesian4.unpackFloat = function(packedFloat) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('packedFloat', packedFloat);
            //>>includeEnd('debug');

            var temp = packedFloat.w / 2.0;
            var exponent = Math.floor(temp);
            var sign = (temp - exponent) * 2.0;
            exponent = exponent - BIAS;

            sign = sign * 2.0 - 1.0;
            sign = -sign;

            if (exponent >= BIAS) {
                return sign < 0.0 ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
            }

            var unpacked = sign * packedFloat.x * SHIFT_RIGHT_8;
            unpacked += sign * packedFloat.y * SHIFT_RIGHT_16;
            unpacked += sign * packedFloat.z * SHIFT_RIGHT_24;

            return unpacked * Math.pow(10.0, exponent);
        };

    exports.Cartesian4 = Cartesian4;

});

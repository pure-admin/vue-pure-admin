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
define(['exports', './when-8d13db60', './Check-70bec281', './Math-61ede240', './Cartographic-fe4be337', './Cartesian2-85064f09', './BoundingSphere-775c5788', './Cartesian4-5af5bb24', './RuntimeError-ba10bc3e', './FeatureDetection-7bd32c34', './buildModuleUrl-9d43158d'], function (exports, when, Check, _Math, Cartographic, Cartesian2, BoundingSphere, Cartesian4, RuntimeError, FeatureDetection, buildModuleUrl) { 'use strict';

    /**
         * A set of 4-dimensional coordinates used to represent rotation in 3-dimensional space.
         * @alias Quaternion
         * @constructor
         *
         * @param {Number} [x=0.0] The X component.
         * @param {Number} [y=0.0] The Y component.
         * @param {Number} [z=0.0] The Z component.
         * @param {Number} [w=0.0] The W component.
         *
         * @see PackableForInterpolation
         */
        function Quaternion(x, y, z, w) {
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

        var fromAxisAngleScratch = new Cartographic.Cartesian3();

        /**
         * Computes a quaternion representing a rotation around an axis.
         *
         * @param {Cartesian3} axis The axis of rotation.
         * @param {Number} angle The angle in radians to rotate around the axis.
         * @param {Quaternion} [result] The object onto which to store the result.
         * @returns {Quaternion} The modified result parameter or a new Quaternion instance if one was not provided.
         */
        Quaternion.fromAxisAngle = function(axis, angle, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('axis', axis);
            Check.Check.typeOf.number('angle', angle);
            //>>includeEnd('debug');

            var halfAngle = angle / 2.0;
            var s = Math.sin(halfAngle);
            fromAxisAngleScratch = Cartographic.Cartesian3.normalize(axis, fromAxisAngleScratch);

            var x = fromAxisAngleScratch.x * s;
            var y = fromAxisAngleScratch.y * s;
            var z = fromAxisAngleScratch.z * s;
            var w = Math.cos(halfAngle);
            if (!when.defined(result)) {
                return new Quaternion(x, y, z, w);
            }
            result.x = x;
            result.y = y;
            result.z = z;
            result.w = w;
            return result;
        };

        var fromRotationMatrixNext = [1, 2, 0];
        var fromRotationMatrixQuat = new Array(3);
        /**
         * Computes a Quaternion from the provided Matrix3 instance.
         *
         * @param {Matrix3} matrix The rotation matrix.
         * @param {Quaternion} [result] The object onto which to store the result.
         * @returns {Quaternion} The modified result parameter or a new Quaternion instance if one was not provided.
         *
         * @see Matrix3.fromQuaternion
         */
        Quaternion.fromRotationMatrix = function(matrix, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            //>>includeEnd('debug');

            var root;
            var x;
            var y;
            var z;
            var w;

            var m00 = matrix[BoundingSphere.Matrix3.COLUMN0ROW0];
            var m11 = matrix[BoundingSphere.Matrix3.COLUMN1ROW1];
            var m22 = matrix[BoundingSphere.Matrix3.COLUMN2ROW2];
            var trace = m00 + m11 + m22;

            if (trace > 0.0) {
                // |w| > 1/2, may as well choose w > 1/2
                root = Math.sqrt(trace + 1.0); // 2w
                w = 0.5 * root;
                root = 0.5 / root; // 1/(4w)

                x = (matrix[BoundingSphere.Matrix3.COLUMN1ROW2] - matrix[BoundingSphere.Matrix3.COLUMN2ROW1]) * root;
                y = (matrix[BoundingSphere.Matrix3.COLUMN2ROW0] - matrix[BoundingSphere.Matrix3.COLUMN0ROW2]) * root;
                z = (matrix[BoundingSphere.Matrix3.COLUMN0ROW1] - matrix[BoundingSphere.Matrix3.COLUMN1ROW0]) * root;
            } else {
                // |w| <= 1/2
                var next = fromRotationMatrixNext;

                var i = 0;
                if (m11 > m00) {
                    i = 1;
                }
                if (m22 > m00 && m22 > m11) {
                    i = 2;
                }
                var j = next[i];
                var k = next[j];

                root = Math.sqrt(matrix[BoundingSphere.Matrix3.getElementIndex(i, i)] - matrix[BoundingSphere.Matrix3.getElementIndex(j, j)] - matrix[BoundingSphere.Matrix3.getElementIndex(k, k)] + 1.0);

                var quat = fromRotationMatrixQuat;
                quat[i] = 0.5 * root;
                root = 0.5 / root;
                w = (matrix[BoundingSphere.Matrix3.getElementIndex(k, j)] - matrix[BoundingSphere.Matrix3.getElementIndex(j, k)]) * root;
                quat[j] = (matrix[BoundingSphere.Matrix3.getElementIndex(j, i)] + matrix[BoundingSphere.Matrix3.getElementIndex(i, j)]) * root;
                quat[k] = (matrix[BoundingSphere.Matrix3.getElementIndex(k, i)] + matrix[BoundingSphere.Matrix3.getElementIndex(i, k)]) * root;

                x = -quat[0];
                y = -quat[1];
                z = -quat[2];
            }

            if (!when.defined(result)) {
                return new Quaternion(x, y, z, w);
            }
            result.x = x;
            result.y = y;
            result.z = z;
            result.w = w;
            return result;
        };

        var scratchHPRQuaternion = new Quaternion();
        var scratchHeadingQuaternion = new Quaternion();
        var scratchPitchQuaternion = new Quaternion();
        var scratchRollQuaternion = new Quaternion();

        /**
         * Computes a rotation from the given heading, pitch and roll angles. Heading is the rotation about the
         * negative z axis. Pitch is the rotation about the negative y axis. Roll is the rotation about
         * the positive x axis.
         *
         * @param {HeadingPitchRoll} headingPitchRoll The rotation expressed as a heading, pitch and roll.
         * @param {Quaternion} [result] The object onto which to store the result.
         * @returns {Quaternion} The modified result parameter or a new Quaternion instance if none was provided.
         */
        Quaternion.fromHeadingPitchRoll = function(headingPitchRoll, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('headingPitchRoll', headingPitchRoll);
            //>>includeEnd('debug');

            scratchRollQuaternion = Quaternion.fromAxisAngle(Cartographic.Cartesian3.UNIT_X, headingPitchRoll.roll, scratchHPRQuaternion);
            scratchPitchQuaternion = Quaternion.fromAxisAngle(Cartographic.Cartesian3.UNIT_Y, -headingPitchRoll.pitch, result);
            result = Quaternion.multiply(scratchPitchQuaternion, scratchRollQuaternion, scratchPitchQuaternion);
            scratchHeadingQuaternion = Quaternion.fromAxisAngle(Cartographic.Cartesian3.UNIT_Z, -headingPitchRoll.heading, scratchHPRQuaternion);
            return Quaternion.multiply(scratchHeadingQuaternion, result, result);
        };

        var sampledQuaternionAxis = new Cartographic.Cartesian3();
        var sampledQuaternionRotation = new Cartographic.Cartesian3();
        var sampledQuaternionTempQuaternion = new Quaternion();
        var sampledQuaternionQuaternion0 = new Quaternion();
        var sampledQuaternionQuaternion0Conjugate = new Quaternion();

        /**
         * The number of elements used to pack the object into an array.
         * @type {Number}
         */
        Quaternion.packedLength = 4;

        /**
         * Stores the provided instance into the provided array.
         *
         * @param {Quaternion} value The value to pack.
         * @param {Number[]} array The array to pack into.
         * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
         *
         * @returns {Number[]} The array that was packed into
         */
        Quaternion.pack = function(value, array, startingIndex) {
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
         * @param {Quaternion} [result] The object into which to store the result.
         * @returns {Quaternion} The modified result parameter or a new Quaternion instance if one was not provided.
         */
        Quaternion.unpack = function(array, startingIndex, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('array', array);
            //>>includeEnd('debug');

            startingIndex = when.defaultValue(startingIndex, 0);

            if (!when.defined(result)) {
                result = new Quaternion();
            }
            result.x = array[startingIndex];
            result.y = array[startingIndex + 1];
            result.z = array[startingIndex + 2];
            result.w = array[startingIndex + 3];
            return result;
        };

        /**
         * The number of elements used to store the object into an array in its interpolatable form.
         * @type {Number}
         */
        Quaternion.packedInterpolationLength = 3;

        /**
         * Converts a packed array into a form suitable for interpolation.
         *
         * @param {Number[]} packedArray The packed array.
         * @param {Number} [startingIndex=0] The index of the first element to be converted.
         * @param {Number} [lastIndex=packedArray.length] The index of the last element to be converted.
         * @param {Number[]} result The object into which to store the result.
         */
        Quaternion.convertPackedArrayForInterpolation = function(packedArray, startingIndex, lastIndex, result) {
            Quaternion.unpack(packedArray, lastIndex * 4, sampledQuaternionQuaternion0Conjugate);
            Quaternion.conjugate(sampledQuaternionQuaternion0Conjugate, sampledQuaternionQuaternion0Conjugate);

            for (var i = 0, len = lastIndex - startingIndex + 1; i < len; i++) {
                var offset = i * 3;
                Quaternion.unpack(packedArray, (startingIndex + i) * 4, sampledQuaternionTempQuaternion);

                Quaternion.multiply(sampledQuaternionTempQuaternion, sampledQuaternionQuaternion0Conjugate, sampledQuaternionTempQuaternion);

                if (sampledQuaternionTempQuaternion.w < 0) {
                    Quaternion.negate(sampledQuaternionTempQuaternion, sampledQuaternionTempQuaternion);
                }

                Quaternion.computeAxis(sampledQuaternionTempQuaternion, sampledQuaternionAxis);
                var angle = Quaternion.computeAngle(sampledQuaternionTempQuaternion);
                result[offset] = sampledQuaternionAxis.x * angle;
                result[offset + 1] = sampledQuaternionAxis.y * angle;
                result[offset + 2] = sampledQuaternionAxis.z * angle;
            }
        };

        /**
         * Retrieves an instance from a packed array converted with {@link convertPackedArrayForInterpolation}.
         *
         * @param {Number[]} array The array previously packed for interpolation.
         * @param {Number[]} sourceArray The original packed array.
         * @param {Number} [firstIndex=0] The firstIndex used to convert the array.
         * @param {Number} [lastIndex=packedArray.length] The lastIndex used to convert the array.
         * @param {Quaternion} [result] The object into which to store the result.
         * @returns {Quaternion} The modified result parameter or a new Quaternion instance if one was not provided.
         */
        Quaternion.unpackInterpolationResult = function(array, sourceArray, firstIndex, lastIndex, result) {
            if (!when.defined(result)) {
                result = new Quaternion();
            }
            Cartographic.Cartesian3.fromArray(array, 0, sampledQuaternionRotation);
            var magnitude = Cartographic.Cartesian3.magnitude(sampledQuaternionRotation);

            Quaternion.unpack(sourceArray, lastIndex * 4, sampledQuaternionQuaternion0);

            if (magnitude === 0) {
                Quaternion.clone(Quaternion.IDENTITY, sampledQuaternionTempQuaternion);
            } else {
                Quaternion.fromAxisAngle(sampledQuaternionRotation, magnitude, sampledQuaternionTempQuaternion);
            }

            return Quaternion.multiply(sampledQuaternionTempQuaternion, sampledQuaternionQuaternion0, result);
        };

        /**
         * Duplicates a Quaternion instance.
         *
         * @param {Quaternion} quaternion The quaternion to duplicate.
         * @param {Quaternion} [result] The object onto which to store the result.
         * @returns {Quaternion} The modified result parameter or a new Quaternion instance if one was not provided. (Returns undefined if quaternion is undefined)
         */
        Quaternion.clone = function(quaternion, result) {
            if (!when.defined(quaternion)) {
                return undefined;
            }

            if (!when.defined(result)) {
                return new Quaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
            }

            result.x = quaternion.x;
            result.y = quaternion.y;
            result.z = quaternion.z;
            result.w = quaternion.w;
            return result;
        };

        /**
         * Computes the conjugate of the provided quaternion.
         *
         * @param {Quaternion} quaternion The quaternion to conjugate.
         * @param {Quaternion} result The object onto which to store the result.
         * @returns {Quaternion} The modified result parameter.
         */
        Quaternion.conjugate = function(quaternion, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('quaternion', quaternion);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result.x = -quaternion.x;
            result.y = -quaternion.y;
            result.z = -quaternion.z;
            result.w = quaternion.w;
            return result;
        };

        /**
         * Computes magnitude squared for the provided quaternion.
         *
         * @param {Quaternion} quaternion The quaternion to conjugate.
         * @returns {Number} The magnitude squared.
         */
        Quaternion.magnitudeSquared = function(quaternion) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('quaternion', quaternion);
            //>>includeEnd('debug');

            return quaternion.x * quaternion.x + quaternion.y * quaternion.y + quaternion.z * quaternion.z + quaternion.w * quaternion.w;
        };

        /**
         * Computes magnitude for the provided quaternion.
         *
         * @param {Quaternion} quaternion The quaternion to conjugate.
         * @returns {Number} The magnitude.
         */
        Quaternion.magnitude = function(quaternion) {
            return Math.sqrt(Quaternion.magnitudeSquared(quaternion));
        };

        /**
         * Computes the normalized form of the provided quaternion.
         *
         * @param {Quaternion} quaternion The quaternion to normalize.
         * @param {Quaternion} result The object onto which to store the result.
         * @returns {Quaternion} The modified result parameter.
         */
        Quaternion.normalize = function(quaternion, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var inverseMagnitude = 1.0 / Quaternion.magnitude(quaternion);
            var x = quaternion.x * inverseMagnitude;
            var y = quaternion.y * inverseMagnitude;
            var z = quaternion.z * inverseMagnitude;
            var w = quaternion.w * inverseMagnitude;

            result.x = x;
            result.y = y;
            result.z = z;
            result.w = w;
            return result;
        };

        /**
         * Computes the inverse of the provided quaternion.
         *
         * @param {Quaternion} quaternion The quaternion to normalize.
         * @param {Quaternion} result The object onto which to store the result.
         * @returns {Quaternion} The modified result parameter.
         */
        Quaternion.inverse = function(quaternion, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var magnitudeSquared = Quaternion.magnitudeSquared(quaternion);
            result = Quaternion.conjugate(quaternion, result);
            return Quaternion.multiplyByScalar(result, 1.0 / magnitudeSquared, result);
        };

        /**
         * Computes the componentwise sum of two quaternions.
         *
         * @param {Quaternion} left The first quaternion.
         * @param {Quaternion} right The second quaternion.
         * @param {Quaternion} result The object onto which to store the result.
         * @returns {Quaternion} The modified result parameter.
         */
        Quaternion.add = function(left, right, result) {
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
         * Computes the componentwise difference of two quaternions.
         *
         * @param {Quaternion} left The first quaternion.
         * @param {Quaternion} right The second quaternion.
         * @param {Quaternion} result The object onto which to store the result.
         * @returns {Quaternion} The modified result parameter.
         */
        Quaternion.subtract = function(left, right, result) {
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
         * Negates the provided quaternion.
         *
         * @param {Quaternion} quaternion The quaternion to be negated.
         * @param {Quaternion} result The object onto which to store the result.
         * @returns {Quaternion} The modified result parameter.
         */
        Quaternion.negate = function(quaternion, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('quaternion', quaternion);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result.x = -quaternion.x;
            result.y = -quaternion.y;
            result.z = -quaternion.z;
            result.w = -quaternion.w;
            return result;
        };

        /**
         * Computes the dot (scalar) product of two quaternions.
         *
         * @param {Quaternion} left The first quaternion.
         * @param {Quaternion} right The second quaternion.
         * @returns {Number} The dot product.
         */
        Quaternion.dot = function(left, right) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('left', left);
            Check.Check.typeOf.object('right', right);
            //>>includeEnd('debug');

            return left.x * right.x + left.y * right.y + left.z * right.z + left.w * right.w;
        };

        /**
         * Computes the product of two quaternions.
         *
         * @param {Quaternion} left The first quaternion.
         * @param {Quaternion} right The second quaternion.
         * @param {Quaternion} result The object onto which to store the result.
         * @returns {Quaternion} The modified result parameter.
         */
        Quaternion.multiply = function(left, right, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('left', left);
            Check.Check.typeOf.object('right', right);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var leftX = left.x;
            var leftY = left.y;
            var leftZ = left.z;
            var leftW = left.w;

            var rightX = right.x;
            var rightY = right.y;
            var rightZ = right.z;
            var rightW = right.w;

            var x = leftW * rightX + leftX * rightW + leftY * rightZ - leftZ * rightY;
            var y = leftW * rightY - leftX * rightZ + leftY * rightW + leftZ * rightX;
            var z = leftW * rightZ + leftX * rightY - leftY * rightX + leftZ * rightW;
            var w = leftW * rightW - leftX * rightX - leftY * rightY - leftZ * rightZ;

            result.x = x;
            result.y = y;
            result.z = z;
            result.w = w;
            return result;
        };

        Quaternion.multiplyByVec = function(q,v, result) {
            
            var uv =  new Cartographic.Cartesian3();
            var uuv = new Cartographic.Cartesian3();
            
            var qvec = new Cartographic.Cartesian3(q.x,q.y,q.z);
        
            uv = Cartographic.Cartesian3.cross(qvec,v,uv); 
            uuv = Cartographic.Cartesian3.cross(qvec,uv,uuv);
            
            var uv2 = new Cartographic.Cartesian3();
            uv2 = Cartographic.Cartesian3.multiplyByScalar(uv,2.0 * q.w,uv2);
            
            var uuv2 = new Cartographic.Cartesian3();
            uuv2 = Cartographic.Cartesian3.multiplyByScalar(uv,2.0,uuv2);
        
            result = Cartographic.Cartesian3.add(v,uv2,result);
            result = Cartographic.Cartesian3.add(result,uuv2,result);
            
            return result;
        };

        /**
         * Multiplies the provided quaternion componentwise by the provided scalar.
         *
         * @param {Quaternion} quaternion The quaternion to be scaled.
         * @param {Number} scalar The scalar to multiply with.
         * @param {Quaternion} result The object onto which to store the result.
         * @returns {Quaternion} The modified result parameter.
         */
        Quaternion.multiplyByScalar = function(quaternion, scalar, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('quaternion', quaternion);
            Check.Check.typeOf.number('scalar', scalar);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result.x = quaternion.x * scalar;
            result.y = quaternion.y * scalar;
            result.z = quaternion.z * scalar;
            result.w = quaternion.w * scalar;
            return result;
        };

        /**
         * Divides the provided quaternion componentwise by the provided scalar.
         *
         * @param {Quaternion} quaternion The quaternion to be divided.
         * @param {Number} scalar The scalar to divide by.
         * @param {Quaternion} result The object onto which to store the result.
         * @returns {Quaternion} The modified result parameter.
         */
        Quaternion.divideByScalar = function(quaternion, scalar, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('quaternion', quaternion);
            Check.Check.typeOf.number('scalar', scalar);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result.x = quaternion.x / scalar;
            result.y = quaternion.y / scalar;
            result.z = quaternion.z / scalar;
            result.w = quaternion.w / scalar;
            return result;
        };

        /**
         * Computes the axis of rotation of the provided quaternion.
         *
         * @param {Quaternion} quaternion The quaternion to use.
         * @param {Cartesian3} result The object onto which to store the result.
         * @returns {Cartesian3} The modified result parameter.
         */
        Quaternion.computeAxis = function(quaternion, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('quaternion', quaternion);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var w = quaternion.w;
            if (Math.abs(w - 1.0) < _Math.CesiumMath.EPSILON6) {
                result.x = result.y = result.z = 0;
                return result;
            }

            var scalar = 1.0 / Math.sqrt(1.0 - (w * w));

            result.x = quaternion.x * scalar;
            result.y = quaternion.y * scalar;
            result.z = quaternion.z * scalar;
            return result;
        };

        /**
         * Computes the angle of rotation of the provided quaternion.
         *
         * @param {Quaternion} quaternion The quaternion to use.
         * @returns {Number} The angle of rotation.
         */
        Quaternion.computeAngle = function(quaternion) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('quaternion', quaternion);
            //>>includeEnd('debug');

            if (Math.abs(quaternion.w - 1.0) < _Math.CesiumMath.EPSILON6) {
                return 0.0;
            }
            return 2.0 * Math.acos(quaternion.w);
        };

        var lerpScratch = new Quaternion();
        /**
         * Computes the linear interpolation or extrapolation at t using the provided quaternions.
         *
         * @param {Quaternion} start The value corresponding to t at 0.0.
         * @param {Quaternion} end The value corresponding to t at 1.0.
         * @param {Number} t The point along t at which to interpolate.
         * @param {Quaternion} result The object onto which to store the result.
         * @returns {Quaternion} The modified result parameter.
         */
        Quaternion.lerp = function(start, end, t, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('start', start);
            Check.Check.typeOf.object('end', end);
            Check.Check.typeOf.number('t', t);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            lerpScratch = Quaternion.multiplyByScalar(end, t, lerpScratch);
            result = Quaternion.multiplyByScalar(start, 1.0 - t, result);
            return Quaternion.add(lerpScratch, result, result);
        };

        var slerpEndNegated = new Quaternion();
        var slerpScaledP = new Quaternion();
        var slerpScaledR = new Quaternion();
        /**
         * Computes the spherical linear interpolation or extrapolation at t using the provided quaternions.
         *
         * @param {Quaternion} start The value corresponding to t at 0.0.
         * @param {Quaternion} end The value corresponding to t at 1.0.
         * @param {Number} t The point along t at which to interpolate.
         * @param {Quaternion} result The object onto which to store the result.
         * @returns {Quaternion} The modified result parameter.
         *
         * @see Quaternion#fastSlerp
         */
        Quaternion.slerp = function(start, end, t, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('start', start);
            Check.Check.typeOf.object('end', end);
            Check.Check.typeOf.number('t', t);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var dot = Quaternion.dot(start, end);

            // The angle between start must be acute. Since q and -q represent
            // the same rotation, negate q to get the acute angle.
            var r = end;
            if (dot < 0.0) {
                dot = -dot;
                r = slerpEndNegated = Quaternion.negate(end, slerpEndNegated);
            }

            // dot > 0, as the dot product approaches 1, the angle between the
            // quaternions vanishes. use linear interpolation.
            if (1.0 - dot < _Math.CesiumMath.EPSILON6) {
                return Quaternion.lerp(start, r, t, result);
            }

            var theta = Math.acos(dot);
            slerpScaledP = Quaternion.multiplyByScalar(start, Math.sin((1 - t) * theta), slerpScaledP);
            slerpScaledR = Quaternion.multiplyByScalar(r, Math.sin(t * theta), slerpScaledR);
            result = Quaternion.add(slerpScaledP, slerpScaledR, result);
            return Quaternion.multiplyByScalar(result, 1.0 / Math.sin(theta), result);
        };

        /**
         * The logarithmic quaternion function.
         *
         * @param {Quaternion} quaternion The unit quaternion.
         * @param {Cartesian3} result The object onto which to store the result.
         * @returns {Cartesian3} The modified result parameter.
         */
        Quaternion.log = function(quaternion, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('quaternion', quaternion);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var theta = _Math.CesiumMath.acosClamped(quaternion.w);
            var thetaOverSinTheta = 0.0;

            if (theta !== 0.0) {
                thetaOverSinTheta = theta / Math.sin(theta);
            }

            return Cartographic.Cartesian3.multiplyByScalar(quaternion, thetaOverSinTheta, result);
        };

        /**
         * The exponential quaternion function.
         *
         * @param {Cartesian3} cartesian The cartesian.
         * @param {Quaternion} result The object onto which to store the result.
         * @returns {Quaternion} The modified result parameter.
         */
        Quaternion.exp = function(cartesian, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('cartesian', cartesian);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var theta = Cartographic.Cartesian3.magnitude(cartesian);
            var sinThetaOverTheta = 0.0;

            if (theta !== 0.0) {
                sinThetaOverTheta = Math.sin(theta) / theta;
            }

            result.x = cartesian.x * sinThetaOverTheta;
            result.y = cartesian.y * sinThetaOverTheta;
            result.z = cartesian.z * sinThetaOverTheta;
            result.w = Math.cos(theta);

            return result;
        };

        var squadScratchCartesian0 = new Cartographic.Cartesian3();
        var squadScratchCartesian1 = new Cartographic.Cartesian3();
        var squadScratchQuaternion0 = new Quaternion();
        var squadScratchQuaternion1 = new Quaternion();

        /**
         * Computes an inner quadrangle point.
         * <p>This will compute quaternions that ensure a squad curve is C<sup>1</sup>.</p>
         *
         * @param {Quaternion} q0 The first quaternion.
         * @param {Quaternion} q1 The second quaternion.
         * @param {Quaternion} q2 The third quaternion.
         * @param {Quaternion} result The object onto which to store the result.
         * @returns {Quaternion} The modified result parameter.
         *
         * @see Quaternion#squad
         */
        Quaternion.computeInnerQuadrangle = function(q0, q1, q2, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('q0', q0);
            Check.Check.typeOf.object('q1', q1);
            Check.Check.typeOf.object('q2', q2);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var qInv = Quaternion.conjugate(q1, squadScratchQuaternion0);
            Quaternion.multiply(qInv, q2, squadScratchQuaternion1);
            var cart0 = Quaternion.log(squadScratchQuaternion1, squadScratchCartesian0);

            Quaternion.multiply(qInv, q0, squadScratchQuaternion1);
            var cart1 = Quaternion.log(squadScratchQuaternion1, squadScratchCartesian1);

            Cartographic.Cartesian3.add(cart0, cart1, cart0);
            Cartographic.Cartesian3.multiplyByScalar(cart0, 0.25, cart0);
            Cartographic.Cartesian3.negate(cart0, cart0);
            Quaternion.exp(cart0, squadScratchQuaternion0);

            return Quaternion.multiply(q1, squadScratchQuaternion0, result);
        };

        /**
         * Computes the spherical quadrangle interpolation between quaternions.
         *
         * @param {Quaternion} q0 The first quaternion.
         * @param {Quaternion} q1 The second quaternion.
         * @param {Quaternion} s0 The first inner quadrangle.
         * @param {Quaternion} s1 The second inner quadrangle.
         * @param {Number} t The time in [0,1] used to interpolate.
         * @param {Quaternion} result The object onto which to store the result.
         * @returns {Quaternion} The modified result parameter.
         *
         *
         * @example
         * // 1. compute the squad interpolation between two quaternions on a curve
         * var s0 = Cesium.Quaternion.computeInnerQuadrangle(quaternions[i - 1], quaternions[i], quaternions[i + 1], new Cesium.Quaternion());
         * var s1 = Cesium.Quaternion.computeInnerQuadrangle(quaternions[i], quaternions[i + 1], quaternions[i + 2], new Cesium.Quaternion());
         * var q = Cesium.Quaternion.squad(quaternions[i], quaternions[i + 1], s0, s1, t, new Cesium.Quaternion());
         *
         * // 2. compute the squad interpolation as above but where the first quaternion is a end point.
         * var s1 = Cesium.Quaternion.computeInnerQuadrangle(quaternions[0], quaternions[1], quaternions[2], new Cesium.Quaternion());
         * var q = Cesium.Quaternion.squad(quaternions[0], quaternions[1], quaternions[0], s1, t, new Cesium.Quaternion());
         *
         * @see Quaternion#computeInnerQuadrangle
         */
        Quaternion.squad = function(q0, q1, s0, s1, t, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('q0', q0);
            Check.Check.typeOf.object('q1', q1);
            Check.Check.typeOf.object('s0', s0);
            Check.Check.typeOf.object('s1', s1);
            Check.Check.typeOf.number('t', t);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var slerp0 = Quaternion.slerp(q0, q1, t, squadScratchQuaternion0);
            var slerp1 = Quaternion.slerp(s0, s1, t, squadScratchQuaternion1);
            return Quaternion.slerp(slerp0, slerp1, 2.0 * t * (1.0 - t), result);
        };

        var fastSlerpScratchQuaternion = new Quaternion();
        var opmu = 1.90110745351730037;
        var u = FeatureDetection.FeatureDetection.supportsTypedArrays() ? new Float32Array(8) : [];
        var v = FeatureDetection.FeatureDetection.supportsTypedArrays() ? new Float32Array(8) : [];
        var bT = FeatureDetection.FeatureDetection.supportsTypedArrays() ? new Float32Array(8) : [];
        var bD = FeatureDetection.FeatureDetection.supportsTypedArrays() ? new Float32Array(8) : [];

        for (var i = 0; i < 7; ++i) {
            var s = i + 1.0;
            var t = 2.0 * s + 1.0;
            u[i] = 1.0 / (s * t);
            v[i] = s / t;
        }

        u[7] = opmu / (8.0 * 17.0);
        v[7] = opmu * 8.0 / 17.0;

        /**
         * Computes the spherical linear interpolation or extrapolation at t using the provided quaternions.
         * This implementation is faster than {@link Quaternion#slerp}, but is only accurate up to 10<sup>-6</sup>.
         *
         * @param {Quaternion} start The value corresponding to t at 0.0.
         * @param {Quaternion} end The value corresponding to t at 1.0.
         * @param {Number} t The point along t at which to interpolate.
         * @param {Quaternion} result The object onto which to store the result.
         * @returns {Quaternion} The modified result parameter.
         *
         * @see Quaternion#slerp
         */
        Quaternion.fastSlerp = function(start, end, t, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('start', start);
            Check.Check.typeOf.object('end', end);
            Check.Check.typeOf.number('t', t);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var x = Quaternion.dot(start, end);

            var sign;
            if (x >= 0) {
                sign = 1.0;
            } else {
                sign = -1.0;
                x = -x;
            }

            var xm1 = x - 1.0;
            var d = 1.0 - t;
            var sqrT = t * t;
            var sqrD = d * d;

            for (var i = 7; i >= 0; --i) {
                bT[i] = (u[i] * sqrT - v[i]) * xm1;
                bD[i] = (u[i] * sqrD - v[i]) * xm1;
            }

            var cT = sign * t * (
                1.0 + bT[0] * (1.0 + bT[1] * (1.0 + bT[2] * (1.0 + bT[3] * (
                1.0 + bT[4] * (1.0 + bT[5] * (1.0 + bT[6] * (1.0 + bT[7]))))))));
            var cD = d * (
                1.0 + bD[0] * (1.0 + bD[1] * (1.0 + bD[2] * (1.0 + bD[3] * (
                1.0 + bD[4] * (1.0 + bD[5] * (1.0 + bD[6] * (1.0 + bD[7]))))))));

            var temp = Quaternion.multiplyByScalar(start, cD, fastSlerpScratchQuaternion);
            Quaternion.multiplyByScalar(end, cT, result);
            return Quaternion.add(temp, result, result);
        };

        /**
         * Computes the spherical quadrangle interpolation between quaternions.
         * An implementation that is faster than {@link Quaternion#squad}, but less accurate.
         *
         * @param {Quaternion} q0 The first quaternion.
         * @param {Quaternion} q1 The second quaternion.
         * @param {Quaternion} s0 The first inner quadrangle.
         * @param {Quaternion} s1 The second inner quadrangle.
         * @param {Number} t The time in [0,1] used to interpolate.
         * @param {Quaternion} result The object onto which to store the result.
         * @returns {Quaternion} The modified result parameter or a new instance if none was provided.
         *
         * @see Quaternion#squad
         */
        Quaternion.fastSquad = function(q0, q1, s0, s1, t, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('q0', q0);
            Check.Check.typeOf.object('q1', q1);
            Check.Check.typeOf.object('s0', s0);
            Check.Check.typeOf.object('s1', s1);
            Check.Check.typeOf.number('t', t);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var slerp0 = Quaternion.fastSlerp(q0, q1, t, squadScratchQuaternion0);
            var slerp1 = Quaternion.fastSlerp(s0, s1, t, squadScratchQuaternion1);
            return Quaternion.fastSlerp(slerp0, slerp1, 2.0 * t * (1.0 - t), result);
        };

        /**
         * Compares the provided quaternions componentwise and returns
         * <code>true</code> if they are equal, <code>false</code> otherwise.
         *
         * @param {Quaternion} [left] The first quaternion.
         * @param {Quaternion} [right] The second quaternion.
         * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
         */
        Quaternion.equals = function(left, right) {
            return (left === right) ||
                   ((when.defined(left)) &&
                    (when.defined(right)) &&
                    (left.x === right.x) &&
                    (left.y === right.y) &&
                    (left.z === right.z) &&
                    (left.w === right.w));
        };

        /**
         * Compares the provided quaternions componentwise and returns
         * <code>true</code> if they are within the provided epsilon,
         * <code>false</code> otherwise.
         *
         * @param {Quaternion} [left] The first quaternion.
         * @param {Quaternion} [right] The second quaternion.
         * @param {Number} epsilon The epsilon to use for equality testing.
         * @returns {Boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
         */
        Quaternion.equalsEpsilon = function(left, right, epsilon) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.number('epsilon', epsilon);
            //>>includeEnd('debug');

            return (left === right) ||
                   ((when.defined(left)) &&
                    (when.defined(right)) &&
                    (Math.abs(left.x - right.x) <= epsilon) &&
                    (Math.abs(left.y - right.y) <= epsilon) &&
                    (Math.abs(left.z - right.z) <= epsilon) &&
                    (Math.abs(left.w - right.w) <= epsilon));
        };

        /**
         * An immutable Quaternion instance initialized to (0.0, 0.0, 0.0, 0.0).
         *
         * @type {Quaternion}
         * @constant
         */
        Quaternion.ZERO = Object.freeze(new Quaternion(0.0, 0.0, 0.0, 0.0));

        /**
         * An immutable Quaternion instance initialized to (0.0, 0.0, 0.0, 1.0).
         *
         * @type {Quaternion}
         * @constant
         */
        Quaternion.IDENTITY = Object.freeze(new Quaternion(0.0, 0.0, 0.0, 1.0));

        /**
         * Duplicates this Quaternion instance.
         *
         * @param {Quaternion} [result] The object onto which to store the result.
         * @returns {Quaternion} The modified result parameter or a new Quaternion instance if one was not provided.
         */
        Quaternion.prototype.clone = function(result) {
            return Quaternion.clone(this, result);
        };

        /**
         * Compares this and the provided quaternion componentwise and returns
         * <code>true</code> if they are equal, <code>false</code> otherwise.
         *
         * @param {Quaternion} [right] The right hand side quaternion.
         * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
         */
        Quaternion.prototype.equals = function(right) {
            return Quaternion.equals(this, right);
        };

        /**
         * Compares this and the provided quaternion componentwise and returns
         * <code>true</code> if they are within the provided epsilon,
         * <code>false</code> otherwise.
         *
         * @param {Quaternion} [right] The right hand side quaternion.
         * @param {Number} epsilon The epsilon to use for equality testing.
         * @returns {Boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
         */
        Quaternion.prototype.equalsEpsilon = function(right, epsilon) {
            return Quaternion.equalsEpsilon(this, right, epsilon);
        };

        /**
         * Returns a string representing this quaternion in the format (x, y, z, w).
         *
         * @returns {String} A string representing this Quaternion.
         */
        Quaternion.prototype.toString = function() {
            return '(' + this.x + ', ' + this.y + ', ' + this.z + ', ' + this.w + ')';
        };

    /**
         * Finds an item in a sorted array.
         *
         * @exports binarySearch
         * @param {Array} array The sorted array to search.
         * @param {*} itemToFind The item to find in the array.
         * @param {binarySearch~Comparator} comparator The function to use to compare the item to
         *        elements in the array.
         * @returns {Number} The index of <code>itemToFind</code> in the array, if it exists.  If <code>itemToFind</code>
         *        does not exist, the return value is a negative number which is the bitwise complement (~)
         *        of the index before which the itemToFind should be inserted in order to maintain the
         *        sorted order of the array.
         *
         * @example
         * // Create a comparator function to search through an array of numbers.
         * function comparator(a, b) {
         *     return a - b;
         * };
         * var numbers = [0, 2, 4, 6, 8];
         * var index = Cesium.binarySearch(numbers, 6, comparator); // 3
         */
        function binarySearch(array, itemToFind, comparator) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('array', array);
            Check.Check.defined('itemToFind', itemToFind);
            Check.Check.defined('comparator', comparator);
            //>>includeEnd('debug');

            var low = 0;
            var high = array.length - 1;
            var i;
            var comparison;

            while (low <= high) {
                i = ~~((low + high) / 2);
                comparison = comparator(array[i], itemToFind);
                if (comparison < 0) {
                    low = i + 1;
                    continue;
                }
                if (comparison > 0) {
                    high = i - 1;
                    continue;
                }
                return i;
            }
            return ~(high + 1);
        }

    /**
         * A set of Earth Orientation Parameters (EOP) sampled at a time.
         *
         * @alias EarthOrientationParametersSample
         * @constructor
         *
         * @param {Number} xPoleWander The pole wander about the X axis, in radians.
         * @param {Number} yPoleWander The pole wander about the Y axis, in radians.
         * @param {Number} xPoleOffset The offset to the Celestial Intermediate Pole (CIP) about the X axis, in radians.
         * @param {Number} yPoleOffset The offset to the Celestial Intermediate Pole (CIP) about the Y axis, in radians.
         * @param {Number} ut1MinusUtc The difference in time standards, UT1 - UTC, in seconds.
         *
         * @private
         */
        function EarthOrientationParametersSample(xPoleWander, yPoleWander, xPoleOffset, yPoleOffset, ut1MinusUtc) {
            /**
             * The pole wander about the X axis, in radians.
             * @type {Number}
             */
            this.xPoleWander = xPoleWander;

            /**
             * The pole wander about the Y axis, in radians.
             * @type {Number}
             */
            this.yPoleWander = yPoleWander;

            /**
             * The offset to the Celestial Intermediate Pole (CIP) about the X axis, in radians.
             * @type {Number}
             */
            this.xPoleOffset = xPoleOffset;

            /**
             * The offset to the Celestial Intermediate Pole (CIP) about the Y axis, in radians.
             * @type {Number}
             */
            this.yPoleOffset = yPoleOffset;

            /**
             * The difference in time standards, UT1 - UTC, in seconds.
             * @type {Number}
             */
            this.ut1MinusUtc = ut1MinusUtc;
        }

    /**
    @license
    sprintf.js from the php.js project - https://github.com/kvz/phpjs
    Directly from https://github.com/kvz/phpjs/blob/master/functions/strings/sprintf.js

    php.js is copyright 2012 Kevin van Zonneveld.

    Portions copyright Brett Zamir (http://brett-zamir.me), Kevin van Zonneveld
    (http://kevin.vanzonneveld.net), Onno Marsman, Theriault, Michael White
    (http://getsprink.com), Waldo Malqui Silva, Paulo Freitas, Jack, Jonas
    Raoni Soares Silva (http://www.jsfromhell.com), Philip Peterson, Legaev
    Andrey, Ates Goral (http://magnetiq.com), Alex, Ratheous, Martijn Wieringa,
    Rafa? Kukawski (http://blog.kukawski.pl), lmeyrick
    (https://sourceforge.net/projects/bcmath-js/), Nate, Philippe Baumann,
    Enrique Gonzalez, Webtoolkit.info (http://www.webtoolkit.info/), Carlos R.
    L. Rodrigues (http://www.jsfromhell.com), Ash Searle
    (http://hexmen.com/blog/), Jani Hartikainen, travc, Ole Vrijenhoek,
    Erkekjetter, Michael Grier, Rafa? Kukawski (http://kukawski.pl), Johnny
    Mast (http://www.phpvrouwen.nl), T.Wild, d3x,
    http://stackoverflow.com/questions/57803/how-to-convert-decimal-to-hex-in-javascript,
    Rafa? Kukawski (http://blog.kukawski.pl/), stag019, pilus, WebDevHobo
    (http://webdevhobo.blogspot.com/), marrtins, GeekFG
    (http://geekfg.blogspot.com), Andrea Giammarchi
    (http://webreflection.blogspot.com), Arpad Ray (mailto:arpad@php.net),
    gorthaur, Paul Smith, Tim de Koning (http://www.kingsquare.nl), Joris, Oleg
    Eremeev, Steve Hilder, majak, gettimeofday, KELAN, Josh Fraser
    (http://onlineaspect.com/2007/06/08/auto-detect-a-time-zone-with-javascript/),
    Marc Palau, Martin
    (http://www.erlenwiese.de/), Breaking Par Consulting Inc
    (http://www.breakingpar.com/bkp/home.nsf/0/87256B280015193F87256CFB006C45F7),
    Chris, Mirek Slugen, saulius, Alfonso Jimenez
    (http://www.alfonsojimenez.com), Diplom@t (http://difane.com/), felix,
    Mailfaker (http://www.weedem.fr/), Tyler Akins (http://rumkin.com), Caio
    Ariede (http://caioariede.com), Robin, Kankrelune
    (http://www.webfaktory.info/), Karol Kowalski, Imgen Tata
    (http://www.myipdf.com/), mdsjack (http://www.mdsjack.bo.it), Dreamer,
    Felix Geisendoerfer (http://www.debuggable.com/felix), Lars Fischer, AJ,
    David, Aman Gupta, Michael White, Public Domain
    (http://www.json.org/json2.js), Steven Levithan
    (http://blog.stevenlevithan.com), Sakimori, Pellentesque Malesuada,
    Thunder.m, Dj (http://phpjs.org/functions/htmlentities:425#comment_134018),
    Steve Clay, David James, Francois, class_exists, nobbler, T. Wild, Itsacon
    (http://www.itsacon.net/), date, Ole Vrijenhoek (http://www.nervous.nl/),
    Fox, Raphael (Ao RUDLER), Marco, noname, Mateusz "loonquawl" Zalega, Frank
    Forte, Arno, ger, mktime, john (http://www.jd-tech.net), Nick Kolosov
    (http://sammy.ru), marc andreu, Scott Cariss, Douglas Crockford
    (http://javascript.crockford.com), madipta, Slawomir Kaniecki,
    ReverseSyntax, Nathan, Alex Wilson, kenneth, Bayron Guevara, Adam Wallner
    (http://web2.bitbaro.hu/), paulo kuong, jmweb, Lincoln Ramsay, djmix,
    Pyerre, Jon Hohle, Thiago Mata (http://thiagomata.blog.com), lmeyrick
    (https://sourceforge.net/projects/bcmath-js/this.), Linuxworld, duncan,
    Gilbert, Sanjoy Roy, Shingo, sankai, Oskar Larsson H?gfeldt
    (http://oskar-lh.name/), Denny Wardhana, 0m3r, Everlasto, Subhasis Deb,
    josh, jd, Pier Paolo Ramon (http://www.mastersoup.com/), P, merabi, Soren
    Hansen, Eugene Bulkin (http://doubleaw.com/), Der Simon
    (http://innerdom.sourceforge.net/), echo is bad, Ozh, XoraX
    (http://www.xorax.info), EdorFaus, JB, J A R, Marc Jansen, Francesco, LH,
    Stoyan Kyosev (http://www.svest.org/), nord_ua, omid
    (http://phpjs.org/functions/380:380#comment_137122), Brad Touesnard, MeEtc
    (http://yass.meetcweb.com), Peter-Paul Koch
    (http://www.quirksmode.org/js/beat.html), Olivier Louvignes
    (http://mg-crea.com/), T0bsn, Tim Wiel, Bryan Elliott, Jalal Berrami,
    Martin, JT, David Randall, Thomas Beaucourt (http://www.webapp.fr), taith,
    vlado houba, Pierre-Luc Paour, Kristof Coomans (SCK-CEN Belgian Nucleair
    Research Centre), Martin Pool, Kirk Strobeck, Rick Waldron, Brant Messenger
    (http://www.brantmessenger.com/), Devan Penner-Woelk, Saulo Vallory, Wagner
    B. Soares, Artur Tchernychev, Valentina De Rosa, Jason Wong
    (http://carrot.org/), Christoph, Daniel Esteban, strftime, Mick@el, rezna,
    Simon Willison (http://simonwillison.net), Anton Ongson, Gabriel Paderni,
    Marco van Oort, penutbutterjelly, Philipp Lenssen, Bjorn Roesbeke
    (http://www.bjornroesbeke.be/), Bug?, Eric Nagel, Tomasz Wesolowski,
    Evertjan Garretsen, Bobby Drake, Blues (http://tech.bluesmoon.info/), Luke
    Godfrey, Pul, uestla, Alan C, Ulrich, Rafal Kukawski, Yves Sucaet,
    sowberry, Norman "zEh" Fuchs, hitwork, Zahlii, johnrembo, Nick Callen,
    Steven Levithan (stevenlevithan.com), ejsanders, Scott Baker, Brian Tafoya
    (http://www.premasolutions.com/), Philippe Jausions
    (http://pear.php.net/user/jausions), Aidan Lister
    (http://aidanlister.com/), Rob, e-mike, HKM, ChaosNo1, metjay, strcasecmp,
    strcmp, Taras Bogach, jpfle, Alexander Ermolaev
    (http://snippets.dzone.com/user/AlexanderErmolaev), DxGx, kilops, Orlando,
    dptr1988, Le Torbi, James (http://www.james-bell.co.uk/), Pedro Tainha
    (http://www.pedrotainha.com), James, Arnout Kazemier
    (http://www.3rd-Eden.com), Chris McMacken, gabriel paderni, Yannoo,
    FGFEmperor, baris ozdil, Tod Gentille, Greg Frazier, jakes, 3D-GRAF, Allan
    Jensen (http://www.winternet.no), Howard Yeend, Benjamin Lupton, davook,
    daniel airton wermann (http://wermann.com.br), Atli T¨®r, Maximusya, Ryan
    W Tenney (http://ryan.10e.us), Alexander M Beedie, fearphage
    (http://http/my.opera.com/fearphage/), Nathan Sepulveda, Victor, Matteo,
    Billy, stensi, Cord, Manish, T.J. Leahy, Riddler
    (http://www.frontierwebdev.com/), Rafa? Kukawski, FremyCompany, Matt
    Bradley, Tim de Koning, Luis Salazar (http://www.freaky-media.com/), Diogo
    Resende, Rival, Andrej Pavlovic, Garagoth, Le Torbi
    (http://www.letorbi.de/), Dino, Josep Sanz (http://www.ws3.es/), rem,
    Russell Walker (http://www.nbill.co.uk/), Jamie Beck
    (http://www.terabit.ca/), setcookie, Michael, YUI Library:
    http://developer.yahoo.com/yui/docs/YAHOO.util.DateLocale.html, Blues at
    http://hacks.bluesmoon.info/strftime/strftime.js, Ben
    (http://benblume.co.uk/), DtTvB
    (http://dt.in.th/2008-09-16.string-length-in-bytes.html), Andreas, William,
    meo, incidence, Cagri Ekin, Amirouche, Amir Habibi
    (http://www.residence-mixte.com/), Luke Smith (http://lucassmith.name),
    Kheang Hok Chin (http://www.distantia.ca/), Jay Klehr, Lorenzo Pisani,
    Tony, Yen-Wei Liu, Greenseed, mk.keck, Leslie Hoare, dude, booeyOH, Ben
    Bryan

    Licensed under the MIT (MIT-LICENSE.txt) license.

    Permission is hereby granted, free of charge, to any person obtaining a
    copy of this software and associated documentation files (the
    "Software"), to deal in the Software without restriction, including
    without limitation the rights to use, copy, modify, merge, publish,
    distribute, sublicense, and/or sell copies of the Software, and to
    permit persons to whom the Software is furnished to do so, subject to
    the following conditions:

    The above copyright notice and this permission notice shall be included
    in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
    IN NO EVENT SHALL KEVIN VAN ZONNEVELD BE LIABLE FOR ANY CLAIM, DAMAGES
    OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
    ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
    OTHER DEALINGS IN THE SOFTWARE.
    */

    function sprintf () {
      // http://kevin.vanzonneveld.net
      // +   original by: Ash Searle (http://hexmen.com/blog/)
      // + namespaced by: Michael White (http://getsprink.com)
      // +    tweaked by: Jack
      // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // +      input by: Paulo Freitas
      // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // +      input by: Brett Zamir (http://brett-zamir.me)
      // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // +   improved by: Dj
      // +   improved by: Allidylls
      // *     example 1: sprintf("%01.2f", 123.1);
      // *     returns 1: 123.10
      // *     example 2: sprintf("[%10s]", 'monkey');
      // *     returns 2: '[    monkey]'
      // *     example 3: sprintf("[%'#10s]", 'monkey');
      // *     returns 3: '[####monkey]'
      // *     example 4: sprintf("%d", 123456789012345);
      // *     returns 4: '123456789012345'
      var regex = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuideEfFgG])/g;
      var a = arguments,
        i = 0,
        format = a[i++];

      // pad()
      var pad = function (str, len, chr, leftJustify) {
        if (!chr) {
          chr = ' ';
        }

        var padding = (str.length >= len) ? '' : Array(1 + len - str.length >>> 0).join(chr);
        return leftJustify ? str + padding : padding + str;
      };

      // justify()
      var justify = function (value, prefix, leftJustify, minWidth, zeroPad, customPadChar) {
        var diff = minWidth - value.length;
        if (diff > 0) {
          if (leftJustify || !zeroPad) {
            value = pad(value, minWidth, customPadChar, leftJustify);
          } else {
            value = value.slice(0, prefix.length) + pad('', diff, '0', true) + value.slice(prefix.length);
          }
        }
        return value;
      };

      // formatBaseX()
      var formatBaseX = function (value, base, prefix, leftJustify, minWidth, precision, zeroPad) {
        // Note: casts negative numbers to positive ones
        var number = value >>> 0;
        prefix = prefix && number && {
          '2': '0b',
          '8': '0',
          '16': '0x'
        }[base] || '';
        value = prefix + pad(number.toString(base), precision || 0, '0', false);
        return justify(value, prefix, leftJustify, minWidth, zeroPad);
      };

      // formatString()
      var formatString = function (value, leftJustify, minWidth, precision, zeroPad, customPadChar) {
        if (precision != null) {
          value = value.slice(0, precision);
        }
        return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar);
      };

      // doFormat()
      var doFormat = function (substring, valueIndex, flags, minWidth, _, precision, type) {
        var number;
        var prefix;
        var method;
        var textTransform;
        var value;

        if (substring == '%%') {
          return '%';
        }

        // parse flags
        var leftJustify = false,
          positivePrefix = '',
          zeroPad = false,
          prefixBaseX = false,
          customPadChar = ' ';
        var flagsl = flags.length;
        for (var j = 0; flags && j < flagsl; j++) {
          switch (flags.charAt(j)) {
          case ' ':
            positivePrefix = ' ';
            break;
          case '+':
            positivePrefix = '+';
            break;
          case '-':
            leftJustify = true;
            break;
          case "'":
            customPadChar = flags.charAt(j + 1);
            break;
          case '0':
            zeroPad = true;
            break;
          case '#':
            prefixBaseX = true;
            break;
          }
        }

        // parameters may be null, undefined, empty-string or real valued
        // we want to ignore null, undefined and empty-string values
        if (!minWidth) {
          minWidth = 0;
        } else if (minWidth == '*') {
          minWidth = +a[i++];
        } else if (minWidth.charAt(0) == '*') {
          minWidth = +a[minWidth.slice(1, -1)];
        } else {
          minWidth = +minWidth;
        }

        // Note: undocumented perl feature:
        if (minWidth < 0) {
          minWidth = -minWidth;
          leftJustify = true;
        }

        if (!isFinite(minWidth)) {
          throw new Error('sprintf: (minimum-)width must be finite');
        }

        if (!precision) {
          precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type == 'd') ? 0 : undefined;
        } else if (precision == '*') {
          precision = +a[i++];
        } else if (precision.charAt(0) == '*') {
          precision = +a[precision.slice(1, -1)];
        } else {
          precision = +precision;
        }

        // grab value using valueIndex if required?
        value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];

        switch (type) {
        case 's':
          return formatString(String(value), leftJustify, minWidth, precision, zeroPad, customPadChar);
        case 'c':
          return formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad);
        case 'b':
          return formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
        case 'o':
          return formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
        case 'x':
          return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
        case 'X':
          return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad).toUpperCase();
        case 'u':
          return formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
        case 'i':
        case 'd':
          number = +value || 0;
          number = Math.round(number - number % 1); // Plain Math.round doesn't just truncate
          prefix = number < 0 ? '-' : positivePrefix;
          value = prefix + pad(String(Math.abs(number)), precision, '0', false);
          return justify(value, prefix, leftJustify, minWidth, zeroPad);
        case 'e':
        case 'E':
        case 'f': // Should handle locales (as per setlocale)
        case 'F':
        case 'g':
        case 'G':
          number = +value;
          prefix = number < 0 ? '-' : positivePrefix;
          method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())];
          textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2];
          value = prefix + Math.abs(number)[method](precision);
          return justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]();
        default:
          return substring;
        }
      };

      return format.replace(regex, doFormat);
    }

    /**
         * Represents a Gregorian date in a more precise format than the JavaScript Date object.
         * In addition to submillisecond precision, this object can also represent leap seconds.
         * @alias GregorianDate
         * @constructor
         *
         * @see JulianDate#toGregorianDate
         */
        function GregorianDate(year, month, day, hour, minute, second, millisecond, isLeapSecond) {
            /**
             * Gets or sets the year as a whole number.
             * @type {Number}
             */
            this.year = year;
            /**
             * Gets or sets the month as a whole number with range [1, 12].
             * @type {Number}
             */
            this.month = month;
            /**
             * Gets or sets the day of the month as a whole number starting at 1.
             * @type {Number}
             */
            this.day = day;
            /**
             * Gets or sets the hour as a whole number with range [0, 23].
             * @type {Number}
             */
            this.hour = hour;
            /**
             * Gets or sets the minute of the hour as a whole number with range [0, 59].
             * @type {Number}
             */
            this.minute = minute;
            /**
             * Gets or sets the second of the minute as a whole number with range [0, 60], with 60 representing a leap second.
             * @type {Number}
             */
            this.second = second;
            /**
             * Gets or sets the millisecond of the second as a floating point number with range [0.0, 1000.0).
             * @type {Number}
             */
            this.millisecond = millisecond;
            /**
             * Gets or sets whether this time is during a leap second.
             * @type {Boolean}
             */
            this.isLeapSecond = isLeapSecond;
        }

    /**
         * Determines if a given date is a leap year.
         *
         * @exports isLeapYear
         *
         * @param {Number} year The year to be tested.
         * @returns {Boolean} True if <code>year</code> is a leap year.
         *
         * @example
         * var leapYear = Cesium.isLeapYear(2000); // true
         */
        function isLeapYear(year) {
            //>>includeStart('debug', pragmas.debug);
            if (year === null || isNaN(year)) {
                throw new Check.DeveloperError('year is required and must be a number.');
            }
            //>>includeEnd('debug');

            return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
        }

    /**
         * Describes a single leap second, which is constructed from a {@link JulianDate} and a
         * numerical offset representing the number of seconds TAI is ahead of the UTC time standard.
         * @alias LeapSecond
         * @constructor
         *
         * @param {JulianDate} [date] A Julian date representing the time of the leap second.
         * @param {Number} [offset] The cumulative number of seconds that TAI is ahead of UTC at the provided date.
         */
        function LeapSecond(date, offset) {
            /**
             * Gets or sets the date at which this leap second occurs.
             * @type {JulianDate}
             */
            this.julianDate = date;

            /**
             * Gets or sets the cumulative number of seconds between the UTC and TAI time standards at the time
             * of this leap second.
             * @type {Number}
             */
            this.offset = offset;
        }

    /**
         * Constants for time conversions like those done by {@link JulianDate}.
         *
         * @exports TimeConstants
         *
         * @see JulianDate
         *
         * @private
         */
        var TimeConstants = {
            /**
             * The number of seconds in one millisecond: <code>0.001</code>
             * @type {Number}
             * @constant
             */
            SECONDS_PER_MILLISECOND : 0.001,

            /**
             * The number of seconds in one minute: <code>60</code>.
             * @type {Number}
             * @constant
             */
            SECONDS_PER_MINUTE : 60.0,

            /**
             * The number of minutes in one hour: <code>60</code>.
             * @type {Number}
             * @constant
             */
            MINUTES_PER_HOUR : 60.0,

            /**
             * The number of hours in one day: <code>24</code>.
             * @type {Number}
             * @constant
             */
            HOURS_PER_DAY : 24.0,

            /**
             * The number of seconds in one hour: <code>3600</code>.
             * @type {Number}
             * @constant
             */
            SECONDS_PER_HOUR : 3600.0,

            /**
             * The number of minutes in one day: <code>1440</code>.
             * @type {Number}
             * @constant
             */
            MINUTES_PER_DAY : 1440.0,

            /**
             * The number of seconds in one day, ignoring leap seconds: <code>86400</code>.
             * @type {Number}
             * @constant
             */
            SECONDS_PER_DAY : 86400.0,

            /**
             * The number of days in one Julian century: <code>36525</code>.
             * @type {Number}
             * @constant
             */
            DAYS_PER_JULIAN_CENTURY : 36525.0,

            /**
             * One trillionth of a second.
             * @type {Number}
             * @constant
             */
            PICOSECOND : 0.000000001,

            /**
             * The number of days to subtract from a Julian date to determine the
             * modified Julian date, which gives the number of days since midnight
             * on November 17, 1858.
             * @type {Number}
             * @constant
             */
            MODIFIED_JULIAN_DATE_DIFFERENCE : 2400000.5
        };
    var TimeConstants$1 = Object.freeze(TimeConstants);

    /**
         * Provides the type of time standards which JulianDate can take as input.
         *
         * @exports TimeStandard
         *
         * @see JulianDate
         */
        var TimeStandard = {
            /**
             * Represents the coordinated Universal Time (UTC) time standard.
             *
             * UTC is related to TAI according to the relationship
             * <code>UTC = TAI - deltaT</code> where <code>deltaT</code> is the number of leap
             * seconds which have been introduced as of the time in TAI.
             *
             * @type {Number}
             * @constant
             */
            UTC : 0,

            /**
             * Represents the International Atomic Time (TAI) time standard.
             * TAI is the principal time standard to which the other time standards are related.
             *
             * @type {Number}
             * @constant
             */
            TAI : 1
        };
    var TimeStandard$1 = Object.freeze(TimeStandard);

    var gregorianDateScratch = new GregorianDate();
        var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var daysInLeapFeburary = 29;

        function compareLeapSecondDates(leapSecond, dateToFind) {
            return JulianDate.compare(leapSecond.julianDate, dateToFind.julianDate);
        }

        // we don't really need a leap second instance, anything with a julianDate property will do
        var binarySearchScratchLeapSecond = new LeapSecond();

        function convertUtcToTai(julianDate) {
            //Even though julianDate is in UTC, we'll treat it as TAI and
            //search the leap second table for it.
            binarySearchScratchLeapSecond.julianDate = julianDate;
            var leapSeconds = JulianDate.leapSeconds;
            var index = binarySearch(leapSeconds, binarySearchScratchLeapSecond, compareLeapSecondDates);

            if (index < 0) {
                index = ~index;
            }

            if (index >= leapSeconds.length) {
                index = leapSeconds.length - 1;
            }

            var offset = leapSeconds[index].offset;
            if (index > 0) {
                //Now we have the index of the closest leap second that comes on or after our UTC time.
                //However, if the difference between the UTC date being converted and the TAI
                //defined leap second is greater than the offset, we are off by one and need to use
                //the previous leap second.
                var difference = JulianDate.secondsDifference(leapSeconds[index].julianDate, julianDate);
                if (difference > offset) {
                    index--;
                    offset = leapSeconds[index].offset;
                }
            }

            JulianDate.addSeconds(julianDate, offset, julianDate);
        }

        function convertTaiToUtc(julianDate, result) {
            binarySearchScratchLeapSecond.julianDate = julianDate;
            var leapSeconds = JulianDate.leapSeconds;
            var index = binarySearch(leapSeconds, binarySearchScratchLeapSecond, compareLeapSecondDates);
            if (index < 0) {
                index = ~index;
            }

            //All times before our first leap second get the first offset.
            if (index === 0) {
                return JulianDate.addSeconds(julianDate, -leapSeconds[0].offset, result);
            }

            //All times after our leap second get the last offset.
            if (index >= leapSeconds.length) {
                return JulianDate.addSeconds(julianDate, -leapSeconds[index - 1].offset, result);
            }

            //Compute the difference between the found leap second and the time we are converting.
            var difference = JulianDate.secondsDifference(leapSeconds[index].julianDate, julianDate);

            if (difference === 0) {
                //The date is in our leap second table.
                return JulianDate.addSeconds(julianDate, -leapSeconds[index].offset, result);
            }

            if (difference <= 1.0) {
                //The requested date is during the moment of a leap second, then we cannot convert to UTC
                return undefined;
            }

            //The time is in between two leap seconds, index is the leap second after the date
            //we're converting, so we subtract one to get the correct LeapSecond instance.
            return JulianDate.addSeconds(julianDate, -leapSeconds[--index].offset, result);
        }

        function setComponents(wholeDays, secondsOfDay, julianDate) {
            var extraDays = (secondsOfDay / TimeConstants$1.SECONDS_PER_DAY) | 0;
            wholeDays += extraDays;
            secondsOfDay -= TimeConstants$1.SECONDS_PER_DAY * extraDays;

            if (secondsOfDay < 0) {
                wholeDays--;
                secondsOfDay += TimeConstants$1.SECONDS_PER_DAY;
            }

            julianDate.dayNumber = wholeDays;
            julianDate.secondsOfDay = secondsOfDay;
            return julianDate;
        }

        function computeJulianDateComponents(year, month, day, hour, minute, second, millisecond) {
            // Algorithm from page 604 of the Explanatory Supplement to the
            // Astronomical Almanac (Seidelmann 1992).

            var a = ((month - 14) / 12) | 0;
            var b = year + 4800 + a;
            var dayNumber = (((1461 * b) / 4) | 0) + (((367 * (month - 2 - 12 * a)) / 12) | 0) - (((3 * (((b + 100) / 100) | 0)) / 4) | 0) + day - 32075;

            // JulianDates are noon-based
            hour = hour - 12;
            if (hour < 0) {
                hour += 24;
            }

            var secondsOfDay = second + ((hour * TimeConstants$1.SECONDS_PER_HOUR) + (minute * TimeConstants$1.SECONDS_PER_MINUTE) + (millisecond * TimeConstants$1.SECONDS_PER_MILLISECOND));

            if (secondsOfDay >= 43200.0) {
                dayNumber -= 1;
            }

            return [dayNumber, secondsOfDay];
        }

        //Regular expressions used for ISO8601 date parsing.
        //YYYY
        var matchCalendarYear = /^(\d{4})$/;
        //YYYY-MM (YYYYMM is invalid)
        var matchCalendarMonth = /^(\d{4})-(\d{2})$/;
        //YYYY-DDD or YYYYDDD
        var matchOrdinalDate = /^(\d{4})-?(\d{3})$/;
        //YYYY-Www or YYYYWww or YYYY-Www-D or YYYYWwwD
        var matchWeekDate = /^(\d{4})-?W(\d{2})-?(\d{1})?$/;
        //YYYY-MM-DD or YYYYMMDD
        var matchCalendarDate = /^(\d{4})-?(\d{2})-?(\d{2})$/;
        // Match utc offset
        var utcOffset = /([Z+\-])?(\d{2})?:?(\d{2})?$/;
        // Match hours HH or HH.xxxxx
        var matchHours = /^(\d{2})(\.\d+)?/.source + utcOffset.source;
        // Match hours/minutes HH:MM HHMM.xxxxx
        var matchHoursMinutes = /^(\d{2}):?(\d{2})(\.\d+)?/.source + utcOffset.source;
        // Match hours/minutes HH:MM:SS HHMMSS.xxxxx
        var matchHoursMinutesSeconds = /^(\d{2}):?(\d{2}):?(\d{2})(\.\d+)?/.source + utcOffset.source;

        var iso8601ErrorMessage = 'Invalid ISO 8601 date.';

        /**
         * Represents an astronomical Julian date, which is the number of days since noon on January 1, -4712 (4713 BC).
         * For increased precision, this class stores the whole number part of the date and the seconds
         * part of the date in separate components.  In order to be safe for arithmetic and represent
         * leap seconds, the date is always stored in the International Atomic Time standard
         * {@link TimeStandard.TAI}.
         * @alias JulianDate
         * @constructor
         *
         * @param {Number} [julianDayNumber=0.0] The Julian Day Number representing the number of whole days.  Fractional days will also be handled correctly.
         * @param {Number} [secondsOfDay=0.0] The number of seconds into the current Julian Day Number.  Fractional seconds, negative seconds and seconds greater than a day will be handled correctly.
         * @param {TimeStandard} [timeStandard=TimeStandard.UTC] The time standard in which the first two parameters are defined.
         */
        function JulianDate(julianDayNumber, secondsOfDay, timeStandard) {
            /**
             * Gets or sets the number of whole days.
             * @type {Number}
             */
            this.dayNumber = undefined;

            /**
             * Gets or sets the number of seconds into the current day.
             * @type {Number}
             */
            this.secondsOfDay = undefined;

            julianDayNumber = when.defaultValue(julianDayNumber, 0.0);
            secondsOfDay = when.defaultValue(secondsOfDay, 0.0);
            timeStandard = when.defaultValue(timeStandard, TimeStandard$1.UTC);

            //If julianDayNumber is fractional, make it an integer and add the number of seconds the fraction represented.
            var wholeDays = julianDayNumber | 0;
            secondsOfDay = secondsOfDay + (julianDayNumber - wholeDays) * TimeConstants$1.SECONDS_PER_DAY;

            setComponents(wholeDays, secondsOfDay, this);

            if (timeStandard === TimeStandard$1.UTC) {
                convertUtcToTai(this);
            }
        }

        /**
         * Creates a new instance from a GregorianDate.
         *
         * @param {GregorianDate} date A GregorianDate.
         * @param {JulianDate} [result] An existing instance to use for the result.
         * @returns {JulianDate} The modified result parameter or a new instance if none was provided.
         *
         * @exception {DeveloperError} date must be a valid GregorianDate.
         */
        JulianDate.fromGregorianDate = function(date, result) {
            //>>includeStart('debug', pragmas.debug);
            if (!(date instanceof GregorianDate)) {
                throw new Check.DeveloperError('date must be a valid GregorianDate.');
            }
            //>>includeEnd('debug');

            var components = computeJulianDateComponents(date.year, date.month, date.day, date.hour, date.minute, date.second, date.millisecond);
            if (!when.defined(result)) {
                return new JulianDate(components[0], components[1], TimeStandard$1.UTC);
            }
            setComponents(components[0], components[1], result);
            convertUtcToTai(result);
            return result;
        };

        /**
         * Creates a new instance from a JavaScript Date.
         *
         * @param {Date} date A JavaScript Date.
         * @param {JulianDate} [result] An existing instance to use for the result.
         * @returns {JulianDate} The modified result parameter or a new instance if none was provided.
         *
         * @exception {DeveloperError} date must be a valid JavaScript Date.
         */
        JulianDate.fromDate = function(date, result) {
            //>>includeStart('debug', pragmas.debug);
            if (!(date instanceof Date) || isNaN(date.getTime())) {
                throw new Check.DeveloperError('date must be a valid JavaScript Date.');
            }
            //>>includeEnd('debug');

            var components = computeJulianDateComponents(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
            if (!when.defined(result)) {
                return new JulianDate(components[0], components[1], TimeStandard$1.UTC);
            }
            setComponents(components[0], components[1], result);
            convertUtcToTai(result);
            return result;
        };

        /**
         * Creates a new instance from a from an {@link http://en.wikipedia.org/wiki/ISO_8601|ISO 8601} date.
         * This method is superior to <code>Date.parse</code> because it will handle all valid formats defined by the ISO 8601
         * specification, including leap seconds and sub-millisecond times, which discarded by most JavaScript implementations.
         *
         * @param {String} iso8601String An ISO 8601 date.
         * @param {JulianDate} [result] An existing instance to use for the result.
         * @returns {JulianDate} The modified result parameter or a new instance if none was provided.
         *
         * @exception {DeveloperError} Invalid ISO 8601 date.
         */
        JulianDate.fromIso8601 = function(iso8601String, result) {
            //>>includeStart('debug', pragmas.debug);
            if (typeof iso8601String !== 'string') {
                throw new Check.DeveloperError(iso8601ErrorMessage);
            }
            //>>includeEnd('debug');

            //Comma and decimal point both indicate a fractional number according to ISO 8601,
            //start out by blanket replacing , with . which is the only valid such symbol in JS.
            iso8601String = iso8601String.replace(',', '.');

            //Split the string into its date and time components, denoted by a mandatory T
            var tokens = iso8601String.split('T');
            var year;
            var month = 1;
            var day = 1;
            var hour = 0;
            var minute = 0;
            var second = 0;
            var millisecond = 0;

            //Lacking a time is okay, but a missing date is illegal.
            var date = tokens[0];
            var time = tokens[1];
            var tmp;
            var inLeapYear;
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(date)) {
                throw new Check.DeveloperError(iso8601ErrorMessage);
            }

            var dashCount;
            //>>includeEnd('debug');

            //First match the date against possible regular expressions.
            tokens = date.match(matchCalendarDate);
            if (tokens !== null) {
                //>>includeStart('debug', pragmas.debug);
                dashCount = date.split('-').length - 1;
                if (dashCount > 0 && dashCount !== 2) {
                    throw new Check.DeveloperError(iso8601ErrorMessage);
                }
                //>>includeEnd('debug');
                year = +tokens[1];
                month = +tokens[2];
                day = +tokens[3];
            } else {
                tokens = date.match(matchCalendarMonth);
                if (tokens !== null) {
                    year = +tokens[1];
                    month = +tokens[2];
                } else {
                    tokens = date.match(matchCalendarYear);
                    if (tokens !== null) {
                        year = +tokens[1];
                    } else {
                        //Not a year/month/day so it must be an ordinal date.
                        var dayOfYear;
                        tokens = date.match(matchOrdinalDate);
                        if (tokens !== null) {

                            year = +tokens[1];
                            dayOfYear = +tokens[2];
                            inLeapYear = isLeapYear(year);

                            //This validation is only applicable for this format.
                            //>>includeStart('debug', pragmas.debug);
                            if (dayOfYear < 1 || (inLeapYear && dayOfYear > 366) || (!inLeapYear && dayOfYear > 365)) {
                                throw new Check.DeveloperError(iso8601ErrorMessage);
                            }
                            //>>includeEnd('debug')
                        } else {
                            tokens = date.match(matchWeekDate);
                            if (tokens !== null) {
                                //ISO week date to ordinal date from
                                //http://en.wikipedia.org/w/index.php?title=ISO_week_date&oldid=474176775
                                year = +tokens[1];
                                var weekNumber = +tokens[2];
                                var dayOfWeek = +tokens[3] || 0;

                                //>>includeStart('debug', pragmas.debug);
                                dashCount = date.split('-').length - 1;
                                if (dashCount > 0 &&
                                   ((!when.defined(tokens[3]) && dashCount !== 1) ||
                                   (when.defined(tokens[3]) && dashCount !== 2))) {
                                    throw new Check.DeveloperError(iso8601ErrorMessage);
                                }
                                //>>includeEnd('debug')

                                var january4 = new Date(Date.UTC(year, 0, 4));
                                dayOfYear = (weekNumber * 7) + dayOfWeek - january4.getUTCDay() - 3;
                            } else {
                                //None of our regular expressions succeeded in parsing the date properly.
                                //>>includeStart('debug', pragmas.debug);
                                throw new Check.DeveloperError(iso8601ErrorMessage);
                                //>>includeEnd('debug')
                            }
                        }
                        //Split an ordinal date into month/day.
                        tmp = new Date(Date.UTC(year, 0, 1));
                        tmp.setUTCDate(dayOfYear);
                        month = tmp.getUTCMonth() + 1;
                        day = tmp.getUTCDate();
                    }
                }
            }

            //Now that we have all of the date components, validate them to make sure nothing is out of range.
            inLeapYear = isLeapYear(year);
            //>>includeStart('debug', pragmas.debug);
            if (month < 1 || month > 12 || day < 1 || ((month !== 2 || !inLeapYear) && day > daysInMonth[month - 1]) || (inLeapYear && month === 2 && day > daysInLeapFeburary)) {
                throw new Check.DeveloperError(iso8601ErrorMessage);
            }
            //>>includeEnd('debug')

            //Now move onto the time string, which is much simpler.
            //If no time is specified, it is considered the beginning of the day, UTC to match Javascript's implementation.
            var offsetIndex;
            if (when.defined(time)) {
                tokens = time.match(matchHoursMinutesSeconds);
                if (tokens !== null) {
                    //>>includeStart('debug', pragmas.debug);
                    dashCount = time.split(':').length - 1;
                    if (dashCount > 0 && dashCount !== 2 && dashCount !== 3) {
                        throw new Check.DeveloperError(iso8601ErrorMessage);
                    }
                    //>>includeEnd('debug')

                    hour = +tokens[1];
                    minute = +tokens[2];
                    second = +tokens[3];
                    millisecond = +(tokens[4] || 0) * 1000.0;
                    offsetIndex = 5;
                } else {
                    tokens = time.match(matchHoursMinutes);
                    if (tokens !== null) {
                        //>>includeStart('debug', pragmas.debug);
                        dashCount = time.split(':').length - 1;
                        if (dashCount > 2) {
                            throw new Check.DeveloperError(iso8601ErrorMessage);
                        }
                        //>>includeEnd('debug')

                        hour = +tokens[1];
                        minute = +tokens[2];
                        second = +(tokens[3] || 0) * 60.0;
                        offsetIndex = 4;
                    } else {
                        tokens = time.match(matchHours);
                        if (tokens !== null) {
                            hour = +tokens[1];
                            minute = +(tokens[2] || 0) * 60.0;
                            offsetIndex = 3;
                        } else {
                            //>>includeStart('debug', pragmas.debug);
                            throw new Check.DeveloperError(iso8601ErrorMessage);
                            //>>includeEnd('debug')
                        }
                    }
                }

                //Validate that all values are in proper range.  Minutes and hours have special cases at 60 and 24.
                //>>includeStart('debug', pragmas.debug);
                if (minute >= 60 || second >= 61 || hour > 24 || (hour === 24 && (minute > 0 || second > 0 || millisecond > 0))) {
                    throw new Check.DeveloperError(iso8601ErrorMessage);
                }
                //>>includeEnd('debug');

                //Check the UTC offset value, if no value exists, use local time
                //a Z indicates UTC, + or - are offsets.
                var offset = tokens[offsetIndex];
                var offsetHours = +(tokens[offsetIndex + 1]);
                var offsetMinutes = +(tokens[offsetIndex + 2] || 0);
                switch (offset) {
                case '+':
                    hour = hour - offsetHours;
                    minute = minute - offsetMinutes;
                    break;
                case '-':
                    hour = hour + offsetHours;
                    minute = minute + offsetMinutes;
                    break;
                case 'Z':
                    break;
                default:
                    minute = minute + new Date(Date.UTC(year, month - 1, day, hour, minute)).getTimezoneOffset();
                    break;
                }
            }

            //ISO8601 denotes a leap second by any time having a seconds component of 60 seconds.
            //If that's the case, we need to temporarily subtract a second in order to build a UTC date.
            //Then we add it back in after converting to TAI.
            var isLeapSecond = second === 60;
            if (isLeapSecond) {
                second--;
            }

            //Even if we successfully parsed the string into its components, after applying UTC offset or
            //special cases like 24:00:00 denoting midnight, we need to normalize the data appropriately.

            //milliseconds can never be greater than 1000, and seconds can't be above 60, so we start with minutes
            while (minute >= 60) {
                minute -= 60;
                hour++;
            }

            while (hour >= 24) {
                hour -= 24;
                day++;
            }

            tmp = (inLeapYear && month === 2) ? daysInLeapFeburary : daysInMonth[month - 1];
            while (day > tmp) {
                day -= tmp;
                month++;

                if (month > 12) {
                    month -= 12;
                    year++;
                }

                tmp = (inLeapYear && month === 2) ? daysInLeapFeburary : daysInMonth[month - 1];
            }

            //If UTC offset is at the beginning/end of the day, minutes can be negative.
            while (minute < 0) {
                minute += 60;
                hour--;
            }

            while (hour < 0) {
                hour += 24;
                day--;
            }

            while (day < 1) {
                month--;
                if (month < 1) {
                    month += 12;
                    year--;
                }

                tmp = (inLeapYear && month === 2) ? daysInLeapFeburary : daysInMonth[month - 1];
                day += tmp;
            }

            //Now create the JulianDate components from the Gregorian date and actually create our instance.
            var components = computeJulianDateComponents(year, month, day, hour, minute, second, millisecond);

            if (!when.defined(result)) {
                result = new JulianDate(components[0], components[1], TimeStandard$1.UTC);
            } else {
                setComponents(components[0], components[1], result);
                convertUtcToTai(result);
            }

            //If we were on a leap second, add it back.
            if (isLeapSecond) {
                JulianDate.addSeconds(result, 1, result);
            }

            return result;
        };

        /**
         * Creates a new instance that represents the current system time.
         * This is equivalent to calling <code>JulianDate.fromDate(new Date());</code>.
         *
         * @param {JulianDate} [result] An existing instance to use for the result.
         * @returns {JulianDate} The modified result parameter or a new instance if none was provided.
         */
        JulianDate.now = function(result) {
            return JulianDate.fromDate(new Date(), result);
        };

        var toGregorianDateScratch = new JulianDate(0, 0, TimeStandard$1.TAI);

        /**
         * Creates a {@link GregorianDate} from the provided instance.
         *
         * @param {JulianDate} julianDate The date to be converted.
         * @param {GregorianDate} [result] An existing instance to use for the result.
         * @returns {GregorianDate} The modified result parameter or a new instance if none was provided.
         */
        JulianDate.toGregorianDate = function(julianDate, result) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(julianDate)) {
                throw new Check.DeveloperError('julianDate is required.');
            }
            //>>includeEnd('debug');

            var isLeapSecond = false;
            var thisUtc = convertTaiToUtc(julianDate, toGregorianDateScratch);
            if (!when.defined(thisUtc)) {
                //Conversion to UTC will fail if we are during a leap second.
                //If that's the case, subtract a second and convert again.
                //JavaScript doesn't support leap seconds, so this results in second 59 being repeated twice.
                JulianDate.addSeconds(julianDate, -1, toGregorianDateScratch);
                thisUtc = convertTaiToUtc(toGregorianDateScratch, toGregorianDateScratch);
                isLeapSecond = true;
            }

            var julianDayNumber = thisUtc.dayNumber;
            var secondsOfDay = thisUtc.secondsOfDay;

            if (secondsOfDay >= 43200.0) {
                julianDayNumber += 1;
            }

            // Algorithm from page 604 of the Explanatory Supplement to the
            // Astronomical Almanac (Seidelmann 1992).
            var L = (julianDayNumber + 68569) | 0;
            var N = (4 * L / 146097) | 0;
            L = (L - (((146097 * N + 3) / 4) | 0)) | 0;
            var I = ((4000 * (L + 1)) / 1461001) | 0;
            L = (L - (((1461 * I) / 4) | 0) + 31) | 0;
            var J = ((80 * L) / 2447) | 0;
            var day = (L - (((2447 * J) / 80) | 0)) | 0;
            L = (J / 11) | 0;
            var month = (J + 2 - 12 * L) | 0;
            var year = (100 * (N - 49) + I + L) | 0;

            var hour = (secondsOfDay / TimeConstants$1.SECONDS_PER_HOUR) | 0;
            var remainingSeconds = secondsOfDay - (hour * TimeConstants$1.SECONDS_PER_HOUR);
            var minute = (remainingSeconds / TimeConstants$1.SECONDS_PER_MINUTE) | 0;
            remainingSeconds = remainingSeconds - (minute * TimeConstants$1.SECONDS_PER_MINUTE);
            var second = remainingSeconds | 0;
            var millisecond = ((remainingSeconds - second) / TimeConstants$1.SECONDS_PER_MILLISECOND);

            // JulianDates are noon-based
            hour += 12;
            if (hour > 23) {
                hour -= 24;
            }

            //If we were on a leap second, add it back.
            if (isLeapSecond) {
                second += 1;
            }

            if (!when.defined(result)) {
                return new GregorianDate(year, month, day, hour, minute, second, millisecond, isLeapSecond);
            }

            result.year = year;
            result.month = month;
            result.day = day;
            result.hour = hour;
            result.minute = minute;
            result.second = second;
            result.millisecond = millisecond;
            result.isLeapSecond = isLeapSecond;
            return result;
        };

        /**
         * Creates a JavaScript Date from the provided instance.
         * Since JavaScript dates are only accurate to the nearest millisecond and
         * cannot represent a leap second, consider using {@link JulianDate.toGregorianDate} instead.
         * If the provided JulianDate is during a leap second, the previous second is used.
         *
         * @param {JulianDate} julianDate The date to be converted.
         * @returns {Date} A new instance representing the provided date.
         */
        JulianDate.toDate = function(julianDate) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(julianDate)) {
                throw new Check.DeveloperError('julianDate is required.');
            }
            //>>includeEnd('debug');

            var gDate = JulianDate.toGregorianDate(julianDate, gregorianDateScratch);
            var second = gDate.second;
            if (gDate.isLeapSecond) {
                second -= 1;
            }
            return new Date(Date.UTC(gDate.year, gDate.month - 1, gDate.day, gDate.hour, gDate.minute, second, gDate.millisecond));
        };

        /**
         * Creates an ISO8601 representation of the provided date.
         *
         * @param {JulianDate} julianDate The date to be converted.
         * @param {Number} [precision] The number of fractional digits used to represent the seconds component.  By default, the most precise representation is used.
         * @returns {String} The ISO8601 representation of the provided date.
         */
        JulianDate.toIso8601 = function(julianDate, precision) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(julianDate)) {
                throw new Check.DeveloperError('julianDate is required.');
            }
            //>>includeEnd('debug');

            var gDate = JulianDate.toGregorianDate(julianDate, gregorianDateScratch);
            var year = gDate.year;
            var month = gDate.month;
            var day = gDate.day;
            var hour = gDate.hour;
            var minute = gDate.minute;
            var second = gDate.second;
            var millisecond = gDate.millisecond;

            // special case - Iso8601.MAXIMUM_VALUE produces a string which we can't parse unless we adjust.
            // 10000-01-01T00:00:00 is the same instant as 9999-12-31T24:00:00
            if (year === 10000 && month === 1 && day === 1 && hour === 0 && minute === 0 && second === 0 && millisecond === 0) {
                year = 9999;
                month = 12;
                day = 31;
                hour = 24;
            }

            var millisecondStr;

            if (!when.defined(precision) && millisecond !== 0) {
                //Forces milliseconds into a number with at least 3 digits to whatever the default toString() precision is.
                millisecondStr = (millisecond * 0.01).toString().replace('.', '');
                return sprintf('%04d-%02d-%02dT%02d:%02d:%02d.%sZ', year, month, day, hour, minute, second, millisecondStr);
            }

            //Precision is either 0 or milliseconds is 0 with undefined precision, in either case, leave off milliseconds entirely
            if (!when.defined(precision) || precision === 0) {
                return sprintf('%04d-%02d-%02dT%02d:%02d:%02dZ', year, month, day, hour, minute, second);
            }

            //Forces milliseconds into a number with at least 3 digits to whatever the specified precision is.
            millisecondStr = (millisecond * 0.01).toFixed(precision).replace('.', '').slice(0, precision);
            return sprintf('%04d-%02d-%02dT%02d:%02d:%02d.%sZ', year, month, day, hour, minute, second, millisecondStr);
        };

        /**
         * Duplicates a JulianDate instance.
         *
         * @param {JulianDate} julianDate The date to duplicate.
         * @param {JulianDate} [result] An existing instance to use for the result.
         * @returns {JulianDate} The modified result parameter or a new instance if none was provided. Returns undefined if julianDate is undefined.
         */
        JulianDate.clone = function(julianDate, result) {
            if (!when.defined(julianDate)) {
                return undefined;
            }
            if (!when.defined(result)) {
                return new JulianDate(julianDate.dayNumber, julianDate.secondsOfDay, TimeStandard$1.TAI);
            }
            result.dayNumber = julianDate.dayNumber;
            result.secondsOfDay = julianDate.secondsOfDay;
            return result;
        };

        /**
         * Compares two instances.
         *
         * @param {JulianDate} left The first instance.
         * @param {JulianDate} right The second instance.
         * @returns {Number} A negative value if left is less than right, a positive value if left is greater than right, or zero if left and right are equal.
         */
        JulianDate.compare = function(left, right) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(left)) {
                throw new Check.DeveloperError('left is required.');
            }
            if (!when.defined(right)) {
                throw new Check.DeveloperError('right is required.');
            }
            //>>includeEnd('debug');

            var julianDayNumberDifference = left.dayNumber - right.dayNumber;
            if (julianDayNumberDifference !== 0) {
                return julianDayNumberDifference;
            }
            return left.secondsOfDay - right.secondsOfDay;
        };

        /**
         * Compares two instances and returns <code>true</code> if they are equal, <code>false</code> otherwise.
         *
         * @param {JulianDate} [left] The first instance.
         * @param {JulianDate} [right] The second instance.
         * @returns {Boolean} <code>true</code> if the dates are equal; otherwise, <code>false</code>.
         */
        JulianDate.equals = function(left, right) {
            return (left === right) ||
                   (when.defined(left) &&
                    when.defined(right) &&
                    left.dayNumber === right.dayNumber &&
                    left.secondsOfDay === right.secondsOfDay);
        };

        /**
         * Compares two instances and returns <code>true</code> if they are within <code>epsilon</code> seconds of
         * each other.  That is, in order for the dates to be considered equal (and for
         * this function to return <code>true</code>), the absolute value of the difference between them, in
         * seconds, must be less than <code>epsilon</code>.
         *
         * @param {JulianDate} [left] The first instance.
         * @param {JulianDate} [right] The second instance.
         * @param {Number} epsilon The maximum number of seconds that should separate the two instances.
         * @returns {Boolean} <code>true</code> if the two dates are within <code>epsilon</code> seconds of each other; otherwise <code>false</code>.
         */
        JulianDate.equalsEpsilon = function(left, right, epsilon) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(epsilon)) {
                throw new Check.DeveloperError('epsilon is required.');
            }
            //>>includeEnd('debug');

            return (left === right) ||
                   (when.defined(left) &&
                    when.defined(right) &&
                    Math.abs(JulianDate.secondsDifference(left, right)) <= epsilon);
        };

        /**
         * Computes the total number of whole and fractional days represented by the provided instance.
         *
         * @param {JulianDate} julianDate The date.
         * @returns {Number} The Julian date as single floating point number.
         */
        JulianDate.totalDays = function(julianDate) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(julianDate)) {
                throw new Check.DeveloperError('julianDate is required.');
            }
            //>>includeEnd('debug');
            return julianDate.dayNumber + (julianDate.secondsOfDay / TimeConstants$1.SECONDS_PER_DAY);
        };

        /**
         * Computes the difference in seconds between the provided instance.
         *
         * @param {JulianDate} left The first instance.
         * @param {JulianDate} right The second instance.
         * @returns {Number} The difference, in seconds, when subtracting <code>right</code> from <code>left</code>.
         */
        JulianDate.secondsDifference = function(left, right) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(left)) {
                throw new Check.DeveloperError('left is required.');
            }
            if (!when.defined(right)) {
                throw new Check.DeveloperError('right is required.');
            }
            //>>includeEnd('debug');

            var dayDifference = (left.dayNumber - right.dayNumber) * TimeConstants$1.SECONDS_PER_DAY;
            return (dayDifference + (left.secondsOfDay - right.secondsOfDay));
        };

        /**
         * Computes the difference in days between the provided instance.
         *
         * @param {JulianDate} left The first instance.
         * @param {JulianDate} right The second instance.
         * @returns {Number} The difference, in days, when subtracting <code>right</code> from <code>left</code>.
         */
        JulianDate.daysDifference = function(left, right) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(left)) {
                throw new Check.DeveloperError('left is required.');
            }
            if (!when.defined(right)) {
                throw new Check.DeveloperError('right is required.');
            }
            //>>includeEnd('debug');

            var dayDifference = (left.dayNumber - right.dayNumber);
            var secondDifference = (left.secondsOfDay - right.secondsOfDay) / TimeConstants$1.SECONDS_PER_DAY;
            return dayDifference + secondDifference;
        };

        /**
         * Computes the number of seconds the provided instance is ahead of UTC.
         *
         * @param {JulianDate} julianDate The date.
         * @returns {Number} The number of seconds the provided instance is ahead of UTC
         */
        JulianDate.computeTaiMinusUtc = function(julianDate) {
            binarySearchScratchLeapSecond.julianDate = julianDate;
            var leapSeconds = JulianDate.leapSeconds;
            var index = binarySearch(leapSeconds, binarySearchScratchLeapSecond, compareLeapSecondDates);
            if (index < 0) {
                index = ~index;
                --index;
                if (index < 0) {
                    index = 0;
                }
            }
            return leapSeconds[index].offset;
        };

        /**
         * Adds the provided number of seconds to the provided date instance.
         *
         * @param {JulianDate} julianDate The date.
         * @param {Number} seconds The number of seconds to add or subtract.
         * @param {JulianDate} result An existing instance to use for the result.
         * @returns {JulianDate} The modified result parameter.
         */
        JulianDate.addSeconds = function(julianDate, seconds, result) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(julianDate)) {
                throw new Check.DeveloperError('julianDate is required.');
            }
            if (!when.defined(seconds)) {
                throw new Check.DeveloperError('seconds is required.');
            }
            if (!when.defined(result)) {
                throw new Check.DeveloperError('result is required.');
            }
            //>>includeEnd('debug');

            return setComponents(julianDate.dayNumber, julianDate.secondsOfDay + seconds, result);
        };

        /**
         * Adds the provided number of minutes to the provided date instance.
         *
         * @param {JulianDate} julianDate The date.
         * @param {Number} minutes The number of minutes to add or subtract.
         * @param {JulianDate} result An existing instance to use for the result.
         * @returns {JulianDate} The modified result parameter.
         */
        JulianDate.addMinutes = function(julianDate, minutes, result) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(julianDate)) {
                throw new Check.DeveloperError('julianDate is required.');
            }
            if (!when.defined(minutes)) {
                throw new Check.DeveloperError('minutes is required.');
            }
            if (!when.defined(result)) {
                throw new Check.DeveloperError('result is required.');
            }
            //>>includeEnd('debug');

            var newSecondsOfDay = julianDate.secondsOfDay + (minutes * TimeConstants$1.SECONDS_PER_MINUTE);
            return setComponents(julianDate.dayNumber, newSecondsOfDay, result);
        };

        /**
         * Adds the provided number of hours to the provided date instance.
         *
         * @param {JulianDate} julianDate The date.
         * @param {Number} hours The number of hours to add or subtract.
         * @param {JulianDate} result An existing instance to use for the result.
         * @returns {JulianDate} The modified result parameter.
         */
        JulianDate.addHours = function(julianDate, hours, result) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(julianDate)) {
                throw new Check.DeveloperError('julianDate is required.');
            }
            if (!when.defined(hours)) {
                throw new Check.DeveloperError('hours is required.');
            }
            if (!when.defined(result)) {
                throw new Check.DeveloperError('result is required.');
            }
            //>>includeEnd('debug');

            var newSecondsOfDay = julianDate.secondsOfDay + (hours * TimeConstants$1.SECONDS_PER_HOUR);
            return setComponents(julianDate.dayNumber, newSecondsOfDay, result);
        };

        /**
         * Adds the provided number of days to the provided date instance.
         *
         * @param {JulianDate} julianDate The date.
         * @param {Number} days The number of days to add or subtract.
         * @param {JulianDate} result An existing instance to use for the result.
         * @returns {JulianDate} The modified result parameter.
         */
        JulianDate.addDays = function(julianDate, days, result) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(julianDate)) {
                throw new Check.DeveloperError('julianDate is required.');
            }
            if (!when.defined(days)) {
                throw new Check.DeveloperError('days is required.');
            }
            if (!when.defined(result)) {
                throw new Check.DeveloperError('result is required.');
            }
            //>>includeEnd('debug');

            var newJulianDayNumber = julianDate.dayNumber + days;
            return setComponents(newJulianDayNumber, julianDate.secondsOfDay, result);
        };

        /**
         * Compares the provided instances and returns <code>true</code> if <code>left</code> is earlier than <code>right</code>, <code>false</code> otherwise.
         *
         * @param {JulianDate} left The first instance.
         * @param {JulianDate} right The second instance.
         * @returns {Boolean} <code>true</code> if <code>left</code> is earlier than <code>right</code>, <code>false</code> otherwise.
         */
        JulianDate.lessThan = function(left, right) {
            return JulianDate.compare(left, right) < 0;
        };

        /**
         * Compares the provided instances and returns <code>true</code> if <code>left</code> is earlier than or equal to <code>right</code>, <code>false</code> otherwise.
         *
         * @param {JulianDate} left The first instance.
         * @param {JulianDate} right The second instance.
         * @returns {Boolean} <code>true</code> if <code>left</code> is earlier than or equal to <code>right</code>, <code>false</code> otherwise.
         */
        JulianDate.lessThanOrEquals = function(left, right) {
            return JulianDate.compare(left, right) <= 0;
        };

        /**
         * Compares the provided instances and returns <code>true</code> if <code>left</code> is later than <code>right</code>, <code>false</code> otherwise.
         *
         * @param {JulianDate} left The first instance.
         * @param {JulianDate} right The second instance.
         * @returns {Boolean} <code>true</code> if <code>left</code> is later than <code>right</code>, <code>false</code> otherwise.
         */
        JulianDate.greaterThan = function(left, right) {
            return JulianDate.compare(left, right) > 0;
        };

        /**
         * Compares the provided instances and returns <code>true</code> if <code>left</code> is later than or equal to <code>right</code>, <code>false</code> otherwise.
         *
         * @param {JulianDate} left The first instance.
         * @param {JulianDate} right The second instance.
         * @returns {Boolean} <code>true</code> if <code>left</code> is later than or equal to <code>right</code>, <code>false</code> otherwise.
         */
        JulianDate.greaterThanOrEquals = function(left, right) {
            return JulianDate.compare(left, right) >= 0;
        };

        /**
         * Duplicates this instance.
         *
         * @param {JulianDate} [result] An existing instance to use for the result.
         * @returns {JulianDate} The modified result parameter or a new instance if none was provided.
         */
        JulianDate.prototype.clone = function(result) {
            return JulianDate.clone(this, result);
        };

        /**
         * Compares this and the provided instance and returns <code>true</code> if they are equal, <code>false</code> otherwise.
         *
         * @param {JulianDate} [right] The second instance.
         * @returns {Boolean} <code>true</code> if the dates are equal; otherwise, <code>false</code>.
         */
        JulianDate.prototype.equals = function(right) {
            return JulianDate.equals(this, right);
        };

        /**
         * Compares this and the provided instance and returns <code>true</code> if they are within <code>epsilon</code> seconds of
         * each other.  That is, in order for the dates to be considered equal (and for
         * this function to return <code>true</code>), the absolute value of the difference between them, in
         * seconds, must be less than <code>epsilon</code>.
         *
         * @param {JulianDate} [right] The second instance.
         * @param {Number} epsilon The maximum number of seconds that should separate the two instances.
         * @returns {Boolean} <code>true</code> if the two dates are within <code>epsilon</code> seconds of each other; otherwise <code>false</code>.
         */
        JulianDate.prototype.equalsEpsilon = function(right, epsilon) {
            return JulianDate.equalsEpsilon(this, right, epsilon);
        };

        /**
         * Creates a string representing this date in ISO8601 format.
         *
         * @returns {String} A string representing this date in ISO8601 format.
         */
        JulianDate.prototype.toString = function() {
            return JulianDate.toIso8601(this);
        };

        /**
         * Gets or sets the list of leap seconds used throughout Cesium.
         * @memberof JulianDate
         * @type {LeapSecond[]}
         */
        JulianDate.leapSeconds = [
                                   new LeapSecond(new JulianDate(2441317, 43210.0, TimeStandard$1.TAI), 10), // January 1, 1972 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2441499, 43211.0, TimeStandard$1.TAI), 11), // July 1, 1972 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2441683, 43212.0, TimeStandard$1.TAI), 12), // January 1, 1973 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2442048, 43213.0, TimeStandard$1.TAI), 13), // January 1, 1974 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2442413, 43214.0, TimeStandard$1.TAI), 14), // January 1, 1975 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2442778, 43215.0, TimeStandard$1.TAI), 15), // January 1, 1976 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2443144, 43216.0, TimeStandard$1.TAI), 16), // January 1, 1977 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2443509, 43217.0, TimeStandard$1.TAI), 17), // January 1, 1978 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2443874, 43218.0, TimeStandard$1.TAI), 18), // January 1, 1979 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2444239, 43219.0, TimeStandard$1.TAI), 19), // January 1, 1980 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2444786, 43220.0, TimeStandard$1.TAI), 20), // July 1, 1981 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2445151, 43221.0, TimeStandard$1.TAI), 21), // July 1, 1982 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2445516, 43222.0, TimeStandard$1.TAI), 22), // July 1, 1983 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2446247, 43223.0, TimeStandard$1.TAI), 23), // July 1, 1985 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2447161, 43224.0, TimeStandard$1.TAI), 24), // January 1, 1988 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2447892, 43225.0, TimeStandard$1.TAI), 25), // January 1, 1990 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2448257, 43226.0, TimeStandard$1.TAI), 26), // January 1, 1991 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2448804, 43227.0, TimeStandard$1.TAI), 27), // July 1, 1992 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2449169, 43228.0, TimeStandard$1.TAI), 28), // July 1, 1993 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2449534, 43229.0, TimeStandard$1.TAI), 29), // July 1, 1994 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2450083, 43230.0, TimeStandard$1.TAI), 30), // January 1, 1996 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2450630, 43231.0, TimeStandard$1.TAI), 31), // July 1, 1997 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2451179, 43232.0, TimeStandard$1.TAI), 32), // January 1, 1999 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2453736, 43233.0, TimeStandard$1.TAI), 33), // January 1, 2006 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2454832, 43234.0, TimeStandard$1.TAI), 34), // January 1, 2009 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2456109, 43235.0, TimeStandard$1.TAI), 35), // July 1, 2012 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2457204, 43236.0, TimeStandard$1.TAI), 36), // July 1, 2015 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2457754, 43237.0, TimeStandard$1.TAI), 37)  // January 1, 2017 00:00:00 UTC
                                 ];

    /**
         * Specifies Earth polar motion coordinates and the difference between UT1 and UTC.
         * These Earth Orientation Parameters (EOP) are primarily used in the transformation from
         * the International Celestial Reference Frame (ICRF) to the International Terrestrial
         * Reference Frame (ITRF).
         *
         * @alias EarthOrientationParameters
         * @constructor
         *
         * @param {Object} [options] Object with the following properties:
         * @param {Resource|String} [options.url] The URL from which to obtain EOP data.  If neither this
         *                 parameter nor options.data is specified, all EOP values are assumed
         *                 to be 0.0.  If options.data is specified, this parameter is
         *                 ignored.
         * @param {Object} [options.data] The actual EOP data.  If neither this
         *                 parameter nor options.data is specified, all EOP values are assumed
         *                 to be 0.0.
         * @param {Boolean} [options.addNewLeapSeconds=true] True if leap seconds that
         *                  are specified in the EOP data but not in {@link JulianDate.leapSeconds}
         *                  should be added to {@link JulianDate.leapSeconds}.  False if
         *                  new leap seconds should be handled correctly in the context
         *                  of the EOP data but otherwise ignored.
         *
         * @example
         * // An example EOP data file, EOP.json:
         * {
         *   "columnNames" : ["dateIso8601","modifiedJulianDateUtc","xPoleWanderRadians","yPoleWanderRadians","ut1MinusUtcSeconds","lengthOfDayCorrectionSeconds","xCelestialPoleOffsetRadians","yCelestialPoleOffsetRadians","taiMinusUtcSeconds"],
         *   "samples" : [
         *      "2011-07-01T00:00:00Z",55743.0,2.117957047295119e-7,2.111518721609984e-6,-0.2908948,-2.956e-4,3.393695767766752e-11,3.3452143996557983e-10,34.0,
         *      "2011-07-02T00:00:00Z",55744.0,2.193297093339541e-7,2.115460256837405e-6,-0.29065,-1.824e-4,-8.241832578862112e-11,5.623838700870617e-10,34.0,
         *      "2011-07-03T00:00:00Z",55745.0,2.262286080161428e-7,2.1191157519929706e-6,-0.2905572,1.9e-6,-3.490658503988659e-10,6.981317007977318e-10,34.0
         *   ]
         * }
         *
         * @example
         * // Loading the EOP data
         * var eop = new Cesium.EarthOrientationParameters({ url : 'Data/EOP.json' });
         * Cesium.Transforms.earthOrientationParameters = eop;
         *
         * @private
         */
        function EarthOrientationParameters(options) {
            options = when.defaultValue(options, when.defaultValue.EMPTY_OBJECT);

            this._dates = undefined;
            this._samples = undefined;

            this._dateColumn = -1;
            this._xPoleWanderRadiansColumn = -1;
            this._yPoleWanderRadiansColumn = -1;
            this._ut1MinusUtcSecondsColumn = -1;
            this._xCelestialPoleOffsetRadiansColumn = -1;
            this._yCelestialPoleOffsetRadiansColumn = -1;
            this._taiMinusUtcSecondsColumn = -1;

            this._columnCount = 0;
            this._lastIndex = -1;

            this._downloadPromise = undefined;
            this._dataError = undefined;

            this._addNewLeapSeconds = when.defaultValue(options.addNewLeapSeconds, true);

            if (when.defined(options.data)) {
                // Use supplied EOP data.
                onDataReady(this, options.data);
            } else if (when.defined(options.url)) {
                var resource = buildModuleUrl.Resource.createIfNeeded(options.url);

                // Download EOP data.
                var that = this;
                this._downloadPromise = when.when(resource.fetchJson(), function(eopData) {
                    onDataReady(that, eopData);
                }, function() {
                    that._dataError = 'An error occurred while retrieving the EOP data from the URL ' + resource.url + '.';
                });
            } else {
                // Use all zeros for EOP data.
                onDataReady(this, {
                    'columnNames' : ['dateIso8601', 'modifiedJulianDateUtc', 'xPoleWanderRadians', 'yPoleWanderRadians', 'ut1MinusUtcSeconds', 'lengthOfDayCorrectionSeconds', 'xCelestialPoleOffsetRadians', 'yCelestialPoleOffsetRadians', 'taiMinusUtcSeconds'],
                    'samples' : []
                });
            }
        }

        /**
         * A default {@link EarthOrientationParameters} instance that returns zero for all EOP values.
         */
        EarthOrientationParameters.NONE = Object.freeze({
                getPromiseToLoad : function() {
                    return when.when();
                },
                compute : function(date, result) {
                    if (!when.defined(result)) {
                        result = new EarthOrientationParametersSample(0.0, 0.0, 0.0, 0.0, 0.0);
                    } else {
                        result.xPoleWander = 0.0;
                        result.yPoleWander = 0.0;
                        result.xPoleOffset = 0.0;
                        result.yPoleOffset = 0.0;
                        result.ut1MinusUtc = 0.0;
                    }
                    return result;
                }
        });

        /**
         * Gets a promise that, when resolved, indicates that the EOP data has been loaded and is
         * ready to use.
         *
         * @returns {Promise} The promise.
         *
         * @see when
         */
        EarthOrientationParameters.prototype.getPromiseToLoad = function() {
            return when.when(this._downloadPromise);
        };

        /**
         * Computes the Earth Orientation Parameters (EOP) for a given date by interpolating.
         * If the EOP data has not yet been download, this method returns undefined.
         *
         * @param {JulianDate} date The date for each to evaluate the EOP.
         * @param {EarthOrientationParametersSample} [result] The instance to which to copy the result.
         *        If this parameter is undefined, a new instance is created and returned.
         * @returns {EarthOrientationParametersSample} The EOP evaluated at the given date, or
         *          undefined if the data necessary to evaluate EOP at the date has not yet been
         *          downloaded.
         *
         * @exception {RuntimeError} The loaded EOP data has an error and cannot be used.
         *
         * @see EarthOrientationParameters#getPromiseToLoad
         */
        EarthOrientationParameters.prototype.compute = function(date, result) {
            // We cannot compute until the samples are available.
            if (!when.defined(this._samples)) {
                if (when.defined(this._dataError)) {
                    throw new RuntimeError.RuntimeError(this._dataError);
                }

                return undefined;
            }

            if (!when.defined(result)) {
                result = new EarthOrientationParametersSample(0.0, 0.0, 0.0, 0.0, 0.0);
            }

            if (this._samples.length === 0) {
                result.xPoleWander = 0.0;
                result.yPoleWander = 0.0;
                result.xPoleOffset = 0.0;
                result.yPoleOffset = 0.0;
                result.ut1MinusUtc = 0.0;
                return result;
            }

            var dates = this._dates;
            var lastIndex = this._lastIndex;

            var before = 0;
            var after = 0;
            if (when.defined(lastIndex)) {
                var previousIndexDate = dates[lastIndex];
                var nextIndexDate = dates[lastIndex + 1];
                var isAfterPrevious = JulianDate.lessThanOrEquals(previousIndexDate, date);
                var isAfterLastSample = !when.defined(nextIndexDate);
                var isBeforeNext = isAfterLastSample || JulianDate.greaterThanOrEquals(nextIndexDate, date);

                if (isAfterPrevious && isBeforeNext) {
                    before = lastIndex;

                    if (!isAfterLastSample && nextIndexDate.equals(date)) {
                        ++before;
                    }
                    after = before + 1;

                    interpolate(this, dates, this._samples, date, before, after, result);
                    return result;
                }
            }

            var index = binarySearch(dates, date, JulianDate.compare, this._dateColumn);
            if (index >= 0) {
                // If the next entry is the same date, use the later entry.  This way, if two entries
                // describe the same moment, one before a leap second and the other after, then we will use
                // the post-leap second data.
                if (index < dates.length - 1 && dates[index + 1].equals(date)) {
                    ++index;
                }
                before = index;
                after = index;
            } else {
                after = ~index;
                before = after - 1;

                // Use the first entry if the date requested is before the beginning of the data.
                if (before < 0) {
                    before = 0;
                }
            }

            this._lastIndex = before;

            interpolate(this, dates, this._samples, date, before, after, result);
            return result;
        };

        function compareLeapSecondDates$1(leapSecond, dateToFind) {
            return JulianDate.compare(leapSecond.julianDate, dateToFind);
        }

        function onDataReady(eop, eopData) {
            if (!when.defined(eopData.columnNames)) {
                eop._dataError = 'Error in loaded EOP data: The columnNames property is required.';
                return;
            }

            if (!when.defined(eopData.samples)) {
                eop._dataError = 'Error in loaded EOP data: The samples property is required.';
                return;
            }

            var dateColumn = eopData.columnNames.indexOf('modifiedJulianDateUtc');
            var xPoleWanderRadiansColumn = eopData.columnNames.indexOf('xPoleWanderRadians');
            var yPoleWanderRadiansColumn = eopData.columnNames.indexOf('yPoleWanderRadians');
            var ut1MinusUtcSecondsColumn = eopData.columnNames.indexOf('ut1MinusUtcSeconds');
            var xCelestialPoleOffsetRadiansColumn = eopData.columnNames.indexOf('xCelestialPoleOffsetRadians');
            var yCelestialPoleOffsetRadiansColumn = eopData.columnNames.indexOf('yCelestialPoleOffsetRadians');
            var taiMinusUtcSecondsColumn = eopData.columnNames.indexOf('taiMinusUtcSeconds');

            if (dateColumn < 0 || xPoleWanderRadiansColumn < 0 || yPoleWanderRadiansColumn < 0 || ut1MinusUtcSecondsColumn < 0 || xCelestialPoleOffsetRadiansColumn < 0 || yCelestialPoleOffsetRadiansColumn < 0 || taiMinusUtcSecondsColumn < 0) {
                eop._dataError = 'Error in loaded EOP data: The columnNames property must include modifiedJulianDateUtc, xPoleWanderRadians, yPoleWanderRadians, ut1MinusUtcSeconds, xCelestialPoleOffsetRadians, yCelestialPoleOffsetRadians, and taiMinusUtcSeconds columns';
                return;
            }

            var samples = eop._samples = eopData.samples;
            var dates = eop._dates = [];

            eop._dateColumn = dateColumn;
            eop._xPoleWanderRadiansColumn = xPoleWanderRadiansColumn;
            eop._yPoleWanderRadiansColumn = yPoleWanderRadiansColumn;
            eop._ut1MinusUtcSecondsColumn = ut1MinusUtcSecondsColumn;
            eop._xCelestialPoleOffsetRadiansColumn = xCelestialPoleOffsetRadiansColumn;
            eop._yCelestialPoleOffsetRadiansColumn = yCelestialPoleOffsetRadiansColumn;
            eop._taiMinusUtcSecondsColumn = taiMinusUtcSecondsColumn;

            eop._columnCount = eopData.columnNames.length;
            eop._lastIndex = undefined;

            var lastTaiMinusUtc;

            var addNewLeapSeconds = eop._addNewLeapSeconds;

            // Convert the ISO8601 dates to JulianDates.
            for (var i = 0, len = samples.length; i < len; i += eop._columnCount) {
                var mjd = samples[i + dateColumn];
                var taiMinusUtc = samples[i + taiMinusUtcSecondsColumn];
                var day = mjd + TimeConstants$1.MODIFIED_JULIAN_DATE_DIFFERENCE;
                var date = new JulianDate(day, taiMinusUtc, TimeStandard$1.TAI);
                dates.push(date);

                if (addNewLeapSeconds) {
                    if (taiMinusUtc !== lastTaiMinusUtc && when.defined(lastTaiMinusUtc)) {
                        // We crossed a leap second boundary, so add the leap second
                        // if it does not already exist.
                        var leapSeconds = JulianDate.leapSeconds;
                        var leapSecondIndex = binarySearch(leapSeconds, date, compareLeapSecondDates$1);
                        if (leapSecondIndex < 0) {
                            var leapSecond = new LeapSecond(date, taiMinusUtc);
                            leapSeconds.splice(~leapSecondIndex, 0, leapSecond);
                        }
                    }
                    lastTaiMinusUtc = taiMinusUtc;
                }
            }
        }

        function fillResultFromIndex(eop, samples, index, columnCount, result) {
            var start = index * columnCount;
            result.xPoleWander = samples[start + eop._xPoleWanderRadiansColumn];
            result.yPoleWander = samples[start + eop._yPoleWanderRadiansColumn];
            result.xPoleOffset = samples[start + eop._xCelestialPoleOffsetRadiansColumn];
            result.yPoleOffset = samples[start + eop._yCelestialPoleOffsetRadiansColumn];
            result.ut1MinusUtc = samples[start + eop._ut1MinusUtcSecondsColumn];
        }

        function linearInterp(dx, y1, y2) {
            return y1 + dx * (y2 - y1);
        }

        function interpolate(eop, dates, samples, date, before, after, result) {
            var columnCount = eop._columnCount;

            // First check the bounds on the EOP data
            // If we are after the bounds of the data, return zeros.
            // The 'before' index should never be less than zero.
            if (after > dates.length - 1) {
                result.xPoleWander = 0;
                result.yPoleWander = 0;
                result.xPoleOffset = 0;
                result.yPoleOffset = 0;
                result.ut1MinusUtc = 0;
                return result;
            }

            var beforeDate = dates[before];
            var afterDate = dates[after];
            if (beforeDate.equals(afterDate) || date.equals(beforeDate)) {
                fillResultFromIndex(eop, samples, before, columnCount, result);
                return result;
            } else if (date.equals(afterDate)) {
                fillResultFromIndex(eop, samples, after, columnCount, result);
                return result;
            }

            var factor = JulianDate.secondsDifference(date, beforeDate) / JulianDate.secondsDifference(afterDate, beforeDate);

            var startBefore = before * columnCount;
            var startAfter = after * columnCount;

            // Handle UT1 leap second edge case
            var beforeUt1MinusUtc = samples[startBefore + eop._ut1MinusUtcSecondsColumn];
            var afterUt1MinusUtc = samples[startAfter + eop._ut1MinusUtcSecondsColumn];

            var offsetDifference = afterUt1MinusUtc - beforeUt1MinusUtc;
            if (offsetDifference > 0.5 || offsetDifference < -0.5) {
                // The absolute difference between the values is more than 0.5, so we may have
                // crossed a leap second.  Check if this is the case and, if so, adjust the
                // afterValue to account for the leap second.  This way, our interpolation will
                // produce reasonable results.
                var beforeTaiMinusUtc = samples[startBefore + eop._taiMinusUtcSecondsColumn];
                var afterTaiMinusUtc = samples[startAfter + eop._taiMinusUtcSecondsColumn];
                if (beforeTaiMinusUtc !== afterTaiMinusUtc) {
                    if (afterDate.equals(date)) {
                        // If we are at the end of the leap second interval, take the second value
                        // Otherwise, the interpolation below will yield the wrong side of the
                        // discontinuity
                        // At the end of the leap second, we need to start accounting for the jump
                        beforeUt1MinusUtc = afterUt1MinusUtc;
                    } else {
                        // Otherwise, remove the leap second so that the interpolation is correct
                        afterUt1MinusUtc -= afterTaiMinusUtc - beforeTaiMinusUtc;
                    }
                }
            }

            result.xPoleWander = linearInterp(factor, samples[startBefore + eop._xPoleWanderRadiansColumn], samples[startAfter + eop._xPoleWanderRadiansColumn]);
            result.yPoleWander = linearInterp(factor, samples[startBefore + eop._yPoleWanderRadiansColumn], samples[startAfter + eop._yPoleWanderRadiansColumn]);
            result.xPoleOffset = linearInterp(factor, samples[startBefore + eop._xCelestialPoleOffsetRadiansColumn], samples[startAfter + eop._xCelestialPoleOffsetRadiansColumn]);
            result.yPoleOffset = linearInterp(factor, samples[startBefore + eop._yCelestialPoleOffsetRadiansColumn], samples[startAfter + eop._yCelestialPoleOffsetRadiansColumn]);
            result.ut1MinusUtc = linearInterp(factor, beforeUt1MinusUtc, afterUt1MinusUtc);
            return result;
        }

    /**
         * A rotation expressed as a heading, pitch, and roll. Heading is the rotation about the
         * negative z axis. Pitch is the rotation about the negative y axis. Roll is the rotation about
         * the positive x axis.
         * @alias HeadingPitchRoll
         * @constructor
         *
         * @param {Number} [heading=0.0] The heading component in radians.
         * @param {Number} [pitch=0.0] The pitch component in radians.
         * @param {Number} [roll=0.0] The roll component in radians.
         */
        function HeadingPitchRoll(heading, pitch, roll) {
            this.heading = when.defaultValue(heading, 0.0);
            this.pitch = when.defaultValue(pitch, 0.0);
            this.roll = when.defaultValue(roll, 0.0);
        }

        /**
         * Computes the heading, pitch and roll from a quaternion (see http://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles )
         *
         * @param {Quaternion} quaternion The quaternion from which to retrieve heading, pitch, and roll, all expressed in radians.
         * @param {HeadingPitchRoll} [result] The object in which to store the result. If not provided, a new instance is created and returned.
         * @returns {HeadingPitchRoll} The modified result parameter or a new HeadingPitchRoll instance if one was not provided.
         */
        HeadingPitchRoll.fromQuaternion = function(quaternion, result) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(quaternion)) {
                throw new Check.DeveloperError('quaternion is required');
            }
            //>>includeEnd('debug');
            if (!when.defined(result)) {
                result = new HeadingPitchRoll();
            }
            var test = 2 * (quaternion.w * quaternion.y - quaternion.z * quaternion.x);
            var denominatorRoll = 1 - 2 * (quaternion.x * quaternion.x + quaternion.y * quaternion.y);
            var numeratorRoll = 2 * (quaternion.w * quaternion.x + quaternion.y * quaternion.z);
            var denominatorHeading = 1 - 2 * (quaternion.y * quaternion.y + quaternion.z * quaternion.z);
            var numeratorHeading = 2 * (quaternion.w * quaternion.z + quaternion.x * quaternion.y);
            result.heading = -Math.atan2(numeratorHeading, denominatorHeading);
            result.roll = Math.atan2(numeratorRoll, denominatorRoll);
            result.pitch = -_Math.CesiumMath.asinClamped(test);
            return result;
        };

        /**
         * Returns a new HeadingPitchRoll instance from angles given in degrees.
         *
         * @param {Number} heading the heading in degrees
         * @param {Number} pitch the pitch in degrees
         * @param {Number} roll the heading in degrees
         * @param {HeadingPitchRoll} [result] The object in which to store the result. If not provided, a new instance is created and returned.
         * @returns {HeadingPitchRoll} A new HeadingPitchRoll instance
         */
        HeadingPitchRoll.fromDegrees = function(heading, pitch, roll, result) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(heading)) {
                throw new Check.DeveloperError('heading is required');
            }
            if (!when.defined(pitch)) {
                throw new Check.DeveloperError('pitch is required');
            }
            if (!when.defined(roll)) {
                throw new Check.DeveloperError('roll is required');
            }
            //>>includeEnd('debug');
            if (!when.defined(result)) {
                result = new HeadingPitchRoll();
            }
            result.heading = heading * _Math.CesiumMath.RADIANS_PER_DEGREE;
            result.pitch = pitch * _Math.CesiumMath.RADIANS_PER_DEGREE;
            result.roll = roll * _Math.CesiumMath.RADIANS_PER_DEGREE;
            return result;
        };

        /**
         * Duplicates a HeadingPitchRoll instance.
         *
         * @param {HeadingPitchRoll} headingPitchRoll The HeadingPitchRoll to duplicate.
         * @param {HeadingPitchRoll} [result] The object onto which to store the result.
         * @returns {HeadingPitchRoll} The modified result parameter or a new HeadingPitchRoll instance if one was not provided. (Returns undefined if headingPitchRoll is undefined)
         */
        HeadingPitchRoll.clone = function(headingPitchRoll, result) {
            if (!when.defined(headingPitchRoll)) {
                return undefined;
            }
            if (!when.defined(result)) {
                return new HeadingPitchRoll(headingPitchRoll.heading, headingPitchRoll.pitch, headingPitchRoll.roll);
            }
            result.heading = headingPitchRoll.heading;
            result.pitch = headingPitchRoll.pitch;
            result.roll = headingPitchRoll.roll;
            return result;
        };

        /**
         * Compares the provided HeadingPitchRolls componentwise and returns
         * <code>true</code> if they are equal, <code>false</code> otherwise.
         *
         * @param {HeadingPitchRoll} [left] The first HeadingPitchRoll.
         * @param {HeadingPitchRoll} [right] The second HeadingPitchRoll.
         * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
         */
        HeadingPitchRoll.equals = function(left, right) {
            return (left === right) ||
                ((when.defined(left)) &&
                    (when.defined(right)) &&
                    (left.heading === right.heading) &&
                    (left.pitch === right.pitch) &&
                    (left.roll === right.roll));
        };

        /**
         * Compares the provided HeadingPitchRolls componentwise and returns
         * <code>true</code> if they pass an absolute or relative tolerance test,
         * <code>false</code> otherwise.
         *
         * @param {HeadingPitchRoll} [left] The first HeadingPitchRoll.
         * @param {HeadingPitchRoll} [right] The second HeadingPitchRoll.
         * @param {Number} relativeEpsilon The relative epsilon tolerance to use for equality testing.
         * @param {Number} [absoluteEpsilon=relativeEpsilon] The absolute epsilon tolerance to use for equality testing.
         * @returns {Boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
         */
        HeadingPitchRoll.equalsEpsilon = function(left, right, relativeEpsilon, absoluteEpsilon) {
            return (left === right) ||
                (when.defined(left) &&
                    when.defined(right) &&
                    _Math.CesiumMath.equalsEpsilon(left.heading, right.heading, relativeEpsilon, absoluteEpsilon) &&
                    _Math.CesiumMath.equalsEpsilon(left.pitch, right.pitch, relativeEpsilon, absoluteEpsilon) &&
                    _Math.CesiumMath.equalsEpsilon(left.roll, right.roll, relativeEpsilon, absoluteEpsilon));
        };

        /**
         * Duplicates this HeadingPitchRoll instance.
         *
         * @param {HeadingPitchRoll} [result] The object onto which to store the result.
         * @returns {HeadingPitchRoll} The modified result parameter or a new HeadingPitchRoll instance if one was not provided.
         */
        HeadingPitchRoll.prototype.clone = function(result) {
            return HeadingPitchRoll.clone(this, result);
        };

        /**
         * Compares this HeadingPitchRoll against the provided HeadingPitchRoll componentwise and returns
         * <code>true</code> if they are equal, <code>false</code> otherwise.
         *
         * @param {HeadingPitchRoll} [right] The right hand side HeadingPitchRoll.
         * @returns {Boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
         */
        HeadingPitchRoll.prototype.equals = function(right) {
            return HeadingPitchRoll.equals(this, right);
        };

        /**
         * Compares this HeadingPitchRoll against the provided HeadingPitchRoll componentwise and returns
         * <code>true</code> if they pass an absolute or relative tolerance test,
         * <code>false</code> otherwise.
         *
         * @param {HeadingPitchRoll} [right] The right hand side HeadingPitchRoll.
         * @param {Number} relativeEpsilon The relative epsilon tolerance to use for equality testing.
         * @param {Number} [absoluteEpsilon=relativeEpsilon] The absolute epsilon tolerance to use for equality testing.
         * @returns {Boolean} <code>true</code> if they are within the provided epsilon, <code>false</code> otherwise.
         */
        HeadingPitchRoll.prototype.equalsEpsilon = function(right, relativeEpsilon, absoluteEpsilon) {
            return HeadingPitchRoll.equalsEpsilon(this, right, relativeEpsilon, absoluteEpsilon);
        };

        /**
         * Creates a string representing this HeadingPitchRoll in the format '(heading, pitch, roll)' in radians.
         *
         * @returns {String} A string representing the provided HeadingPitchRoll in the format '(heading, pitch, roll)'.
         */
        HeadingPitchRoll.prototype.toString = function() {
            return '(' + this.heading + ', ' + this.pitch + ', ' + this.roll + ')';
        };

    /**
         * An IAU 2006 XYS value sampled at a particular time.
         *
         * @alias Iau2006XysSample
         * @constructor
         *
         * @param {Number} x The X value.
         * @param {Number} y The Y value.
         * @param {Number} s The S value.
         *
         * @private
         */
        function Iau2006XysSample(x, y, s) {
            /**
             * The X value.
             * @type {Number}
             */
            this.x = x;

            /**
             * The Y value.
             * @type {Number}
             */
            this.y = y;

            /**
             * The S value.
             * @type {Number}
             */
            this.s = s;
        }

    /**
         * A set of IAU2006 XYS data that is used to evaluate the transformation between the International
         * Celestial Reference Frame (ICRF) and the International Terrestrial Reference Frame (ITRF).
         *
         * @alias Iau2006XysData
         * @constructor
         *
         * @param {Object} [options] Object with the following properties:
         * @param {Resource|String} [options.xysFileUrlTemplate='Assets/IAU2006_XYS/IAU2006_XYS_{0}.json'] A template URL for obtaining the XYS data.  In the template,
         *                 `{0}` will be replaced with the file index.
         * @param {Number} [options.interpolationOrder=9] The order of interpolation to perform on the XYS data.
         * @param {Number} [options.sampleZeroJulianEphemerisDate=2442396.5] The Julian ephemeris date (JED) of the
         *                 first XYS sample.
         * @param {Number} [options.stepSizeDays=1.0] The step size, in days, between successive XYS samples.
         * @param {Number} [options.samplesPerXysFile=1000] The number of samples in each XYS file.
         * @param {Number} [options.totalSamples=27426] The total number of samples in all XYS files.
         *
         * @private
         */
        function Iau2006XysData(options) {
            options = when.defaultValue(options, when.defaultValue.EMPTY_OBJECT);

            this._xysFileUrlTemplate = buildModuleUrl.Resource.createIfNeeded(options.xysFileUrlTemplate);
            this._interpolationOrder = when.defaultValue(options.interpolationOrder, 9);
            this._sampleZeroJulianEphemerisDate = when.defaultValue(options.sampleZeroJulianEphemerisDate, 2442396.5);
            this._sampleZeroDateTT = new JulianDate(this._sampleZeroJulianEphemerisDate, 0.0, TimeStandard$1.TAI);
            this._stepSizeDays = when.defaultValue(options.stepSizeDays, 1.0);
            this._samplesPerXysFile = when.defaultValue(options.samplesPerXysFile, 1000);
            this._totalSamples = when.defaultValue(options.totalSamples, 27426);
            this._samples = new Array(this._totalSamples * 3);
            this._chunkDownloadsInProgress = [];

            var order = this._interpolationOrder;

            // Compute denominators and X values for interpolation.
            var denom = this._denominators = new Array(order + 1);
            var xTable = this._xTable = new Array(order + 1);

            var stepN = Math.pow(this._stepSizeDays, order);

            for ( var i = 0; i <= order; ++i) {
                denom[i] = stepN;
                xTable[i] = i * this._stepSizeDays;

                for ( var j = 0; j <= order; ++j) {
                    if (j !== i) {
                        denom[i] *= (i - j);
                    }
                }

                denom[i] = 1.0 / denom[i];
            }

            // Allocate scratch arrays for interpolation.
            this._work = new Array(order + 1);
            this._coef = new Array(order + 1);
        }

        var julianDateScratch = new JulianDate(0, 0.0, TimeStandard$1.TAI);

        function getDaysSinceEpoch(xys, dayTT, secondTT) {
            var dateTT = julianDateScratch;
            dateTT.dayNumber = dayTT;
            dateTT.secondsOfDay = secondTT;
            return JulianDate.daysDifference(dateTT, xys._sampleZeroDateTT);
        }

        /**
         * Preloads XYS data for a specified date range.
         *
         * @param {Number} startDayTT The Julian day number of the beginning of the interval to preload, expressed in
         *                 the Terrestrial Time (TT) time standard.
         * @param {Number} startSecondTT The seconds past noon of the beginning of the interval to preload, expressed in
         *                 the Terrestrial Time (TT) time standard.
         * @param {Number} stopDayTT The Julian day number of the end of the interval to preload, expressed in
         *                 the Terrestrial Time (TT) time standard.
         * @param {Number} stopSecondTT The seconds past noon of the end of the interval to preload, expressed in
         *                 the Terrestrial Time (TT) time standard.
         * @returns {Promise} A promise that, when resolved, indicates that the requested interval has been
         *                    preloaded.
         */
        Iau2006XysData.prototype.preload = function(startDayTT, startSecondTT, stopDayTT, stopSecondTT) {
            var startDaysSinceEpoch = getDaysSinceEpoch(this, startDayTT, startSecondTT);
            var stopDaysSinceEpoch = getDaysSinceEpoch(this, stopDayTT, stopSecondTT);

            var startIndex = (startDaysSinceEpoch / this._stepSizeDays - this._interpolationOrder / 2) | 0;
            if (startIndex < 0) {
                startIndex = 0;
            }

            var stopIndex = (stopDaysSinceEpoch / this._stepSizeDays - this._interpolationOrder / 2) | 0 + this._interpolationOrder;
            if (stopIndex >= this._totalSamples) {
                stopIndex = this._totalSamples - 1;
            }

            var startChunk = (startIndex / this._samplesPerXysFile) | 0;
            var stopChunk = (stopIndex / this._samplesPerXysFile) | 0;

            var promises = [];
            for ( var i = startChunk; i <= stopChunk; ++i) {
                promises.push(requestXysChunk(this, i));
            }

            return when.when.all(promises);
        };

        /**
         * Computes the XYS values for a given date by interpolating.  If the required data is not yet downloaded,
         * this method will return undefined.
         *
         * @param {Number} dayTT The Julian day number for which to compute the XYS value, expressed in
         *                 the Terrestrial Time (TT) time standard.
         * @param {Number} secondTT The seconds past noon of the date for which to compute the XYS value, expressed in
         *                 the Terrestrial Time (TT) time standard.
         * @param {Iau2006XysSample} [result] The instance to which to copy the interpolated result.  If this parameter
         *                           is undefined, a new instance is allocated and returned.
         * @returns {Iau2006XysSample} The interpolated XYS values, or undefined if the required data for this
         *                             computation has not yet been downloaded.
         *
         * @see Iau2006XysData#preload
         */
        Iau2006XysData.prototype.computeXysRadians = function(dayTT, secondTT, result) {
            var daysSinceEpoch = getDaysSinceEpoch(this, dayTT, secondTT);
            if (daysSinceEpoch < 0.0) {
                // Can't evaluate prior to the epoch of the data.
                return undefined;
            }

            var centerIndex = (daysSinceEpoch / this._stepSizeDays) | 0;
            if (centerIndex >= this._totalSamples) {
                // Can't evaluate after the last sample in the data.
                return undefined;
            }

            var degree = this._interpolationOrder;

            var firstIndex = centerIndex - ((degree / 2) | 0);
            if (firstIndex < 0) {
                firstIndex = 0;
            }
            var lastIndex = firstIndex + degree;
            if (lastIndex >= this._totalSamples) {
                lastIndex = this._totalSamples - 1;
                firstIndex = lastIndex - degree;
                if (firstIndex < 0) {
                    firstIndex = 0;
                }
            }

            // Are all the samples we need present?
            // We can assume so if the first and last are present
            var isDataMissing = false;
            var samples = this._samples;
            if (!when.defined(samples[firstIndex * 3])) {
                requestXysChunk(this, (firstIndex / this._samplesPerXysFile) | 0);
                isDataMissing = true;
            }

            if (!when.defined(samples[lastIndex * 3])) {
                requestXysChunk(this, (lastIndex / this._samplesPerXysFile) | 0);
                isDataMissing = true;
            }

            if (isDataMissing) {
                return undefined;
            }

            if (!when.defined(result)) {
                result = new Iau2006XysSample(0.0, 0.0, 0.0);
            } else {
                result.x = 0.0;
                result.y = 0.0;
                result.s = 0.0;
            }

            var x = daysSinceEpoch - firstIndex * this._stepSizeDays;

            var work = this._work;
            var denom = this._denominators;
            var coef = this._coef;
            var xTable = this._xTable;

            var i, j;
            for (i = 0; i <= degree; ++i) {
                work[i] = x - xTable[i];
            }

            for (i = 0; i <= degree; ++i) {
                coef[i] = 1.0;

                for (j = 0; j <= degree; ++j) {
                    if (j !== i) {
                        coef[i] *= work[j];
                    }
                }

                coef[i] *= denom[i];

                var sampleIndex = (firstIndex + i) * 3;
                result.x += coef[i] * samples[sampleIndex++];
                result.y += coef[i] * samples[sampleIndex++];
                result.s += coef[i] * samples[sampleIndex];
            }

            return result;
        };

        function requestXysChunk(xysData, chunkIndex) {
            if (xysData._chunkDownloadsInProgress[chunkIndex]) {
                // Chunk has already been requested.
                return xysData._chunkDownloadsInProgress[chunkIndex];
            }

            var deferred = when.when.defer();

            xysData._chunkDownloadsInProgress[chunkIndex] = deferred;

            var chunkUrl;
            var xysFileUrlTemplate = xysData._xysFileUrlTemplate;
            if (when.defined(xysFileUrlTemplate)) {
                chunkUrl = xysFileUrlTemplate.getDerivedResource({
                    templateValues: {
                        '0': chunkIndex
                    }
                });
            } else {
                chunkUrl = new buildModuleUrl.Resource({
                    url : buildModuleUrl.buildModuleUrl('Assets/IAU2006_XYS/IAU2006_XYS_' + chunkIndex + '.json')
                });
            }

            when.when(chunkUrl.fetchJson(), function(chunk) {
                xysData._chunkDownloadsInProgress[chunkIndex] = false;

                var samples = xysData._samples;
                var newSamples = chunk.samples;
                var startIndex = chunkIndex * xysData._samplesPerXysFile * 3;

                for ( var i = 0, len = newSamples.length; i < len; ++i) {
                    samples[startIndex + i] = newSamples[i];
                }

                deferred.resolve();
            });

            return deferred.promise;
        }

    /**
         * Contains functions for transforming positions to various reference frames.
         *
         * @exports Transforms
         * @namespace
         */
        var Transforms = {};

        var vectorProductLocalFrame = {
            up : {
                south : 'east',
                north : 'west',
                west : 'south',
                east : 'north'
            },
            down : {
                south : 'west',
                north : 'east',
                west : 'north',
                east : 'south'
            },
            south : {
                up : 'west',
                down : 'east',
                west : 'down',
                east : 'up'
            },
            north : {
                up : 'east',
                down : 'west',
                west : 'up',
                east : 'down'
            },
            west : {
                up : 'north',
                down : 'south',
                north : 'down',
                south : 'up'
            },
            east : {
                up : 'south',
                down : 'north',
                north : 'up',
                south : 'down'
            }
        };

        var degeneratePositionLocalFrame = {
            north : [-1, 0, 0],
            east : [0, 1, 0],
            up : [0, 0, 1],
            south : [1, 0, 0],
            west : [0, -1, 0],
            down : [0, 0, -1]
        };

        var localFrameToFixedFrameCache = {};

        var scratchCalculateCartesian = {
            east : new Cartographic.Cartesian3(),
            north : new Cartographic.Cartesian3(),
            up : new Cartographic.Cartesian3(),
            west : new Cartographic.Cartesian3(),
            south : new Cartographic.Cartesian3(),
            down : new Cartographic.Cartesian3()
        };
        var scratchFirstCartesian = new Cartographic.Cartesian3();
        var scratchSecondCartesian = new Cartographic.Cartesian3();
        var scratchThirdCartesian = new Cartographic.Cartesian3();
        /**
        * Generates a function that computes a 4x4 transformation matrix from a reference frame
        * centered at the provided origin to the provided ellipsoid's fixed reference frame.
        * @param  {String} firstAxis  name of the first axis of the local reference frame. Must be
        *  'east', 'north', 'up', 'west', 'south' or 'down'.
        * @param  {String} secondAxis  name of the second axis of the local reference frame. Must be
        *  'east', 'north', 'up', 'west', 'south' or 'down'.
        * @return {localFrameToFixedFrameGenerator~resultat} The function that will computes a
        * 4x4 transformation matrix from a reference frame, with first axis and second axis compliant with the parameters,
        */
        Transforms.localFrameToFixedFrameGenerator = function (firstAxis, secondAxis) {
            if (!vectorProductLocalFrame.hasOwnProperty(firstAxis) || !vectorProductLocalFrame[firstAxis].hasOwnProperty(secondAxis)) {
                throw new Check.DeveloperError('firstAxis and secondAxis must be east, north, up, west, south or down.');
            }
            var thirdAxis = vectorProductLocalFrame[firstAxis][secondAxis];

            /**
             * Computes a 4x4 transformation matrix from a reference frame
             * centered at the provided origin to the provided ellipsoid's fixed reference frame.
             * @callback Transforms~LocalFrameToFixedFrame
             * @param {Cartesian3} origin The center point of the local reference frame.
             * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid whose fixed frame is used in the transformation.
             * @param {Matrix4} [result] The object onto which to store the result.
             * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if none was provided.
             */
            var resultat;
            var hashAxis = firstAxis + secondAxis;
            if (when.defined(localFrameToFixedFrameCache[hashAxis])) {
                resultat = localFrameToFixedFrameCache[hashAxis];
            } else {
                resultat = function (origin, ellipsoid, result) {
                    //>>includeStart('debug', pragmas.debug);
                    if (!when.defined(origin)) {
                        throw new Check.DeveloperError('origin is required.');
                    }
                    //>>includeEnd('debug');
                    if (!when.defined(result)) {
                        result = new BoundingSphere.Matrix4();
                    }
                    if (Cartographic.Cartesian3.equalsEpsilon(origin, Cartographic.Cartesian3.ZERO, _Math.CesiumMath.EPSILON14)) {
                        // If x, y, and z are zero, use the degenerate local frame, which is a special case
                        Cartographic.Cartesian3.unpack(degeneratePositionLocalFrame[firstAxis], 0, scratchFirstCartesian);
                        Cartographic.Cartesian3.unpack(degeneratePositionLocalFrame[secondAxis], 0, scratchSecondCartesian);
                        Cartographic.Cartesian3.unpack(degeneratePositionLocalFrame[thirdAxis], 0, scratchThirdCartesian);
                    } else if (_Math.CesiumMath.equalsEpsilon(origin.x, 0.0, _Math.CesiumMath.EPSILON14) && _Math.CesiumMath.equalsEpsilon(origin.y, 0.0, _Math.CesiumMath.EPSILON14)) {
                        // If x and y are zero, assume origin is at a pole, which is a special case.
                        var sign = _Math.CesiumMath.sign(origin.z);

                        Cartographic.Cartesian3.unpack(degeneratePositionLocalFrame[firstAxis], 0, scratchFirstCartesian);
                        if (firstAxis !== 'east' && firstAxis !== 'west') {
                            Cartographic.Cartesian3.multiplyByScalar(scratchFirstCartesian, sign, scratchFirstCartesian);
                        }

                        Cartographic.Cartesian3.unpack(degeneratePositionLocalFrame[secondAxis], 0, scratchSecondCartesian);
                        if (secondAxis !== 'east' && secondAxis !== 'west') {
                            Cartographic.Cartesian3.multiplyByScalar(scratchSecondCartesian, sign, scratchSecondCartesian);
                        }

                        Cartographic.Cartesian3.unpack(degeneratePositionLocalFrame[thirdAxis], 0, scratchThirdCartesian);
                        if (thirdAxis !== 'east' && thirdAxis !== 'west') {
                            Cartographic.Cartesian3.multiplyByScalar(scratchThirdCartesian, sign, scratchThirdCartesian);
                        }
                    } else {
                        ellipsoid = when.defaultValue(ellipsoid, Cartesian2.Ellipsoid.WGS84);
                        ellipsoid.geodeticSurfaceNormal(origin, scratchCalculateCartesian.up);

                        var up = scratchCalculateCartesian.up;
                        var east = scratchCalculateCartesian.east;
                        east.x = -origin.y;
                        east.y = origin.x;
                        east.z = 0.0;
                        Cartographic.Cartesian3.normalize(east, scratchCalculateCartesian.east);
                        Cartographic.Cartesian3.cross(up, east, scratchCalculateCartesian.north);

                        Cartographic.Cartesian3.multiplyByScalar(scratchCalculateCartesian.up, -1, scratchCalculateCartesian.down);
                        Cartographic.Cartesian3.multiplyByScalar(scratchCalculateCartesian.east, -1, scratchCalculateCartesian.west);
                        Cartographic.Cartesian3.multiplyByScalar(scratchCalculateCartesian.north, -1, scratchCalculateCartesian.south);

                        scratchFirstCartesian = scratchCalculateCartesian[firstAxis];
                        scratchSecondCartesian = scratchCalculateCartesian[secondAxis];
                        scratchThirdCartesian = scratchCalculateCartesian[thirdAxis];
                    }
                    result[0] = scratchFirstCartesian.x;
                    result[1] = scratchFirstCartesian.y;
                    result[2] = scratchFirstCartesian.z;
                    result[3] = 0.0;
                    result[4] = scratchSecondCartesian.x;
                    result[5] = scratchSecondCartesian.y;
                    result[6] = scratchSecondCartesian.z;
                    result[7] = 0.0;
                    result[8] = scratchThirdCartesian.x;
                    result[9] = scratchThirdCartesian.y;
                    result[10] = scratchThirdCartesian.z;
                    result[11] = 0.0;
                    result[12] = origin.x;
                    result[13] = origin.y;
                    result[14] = origin.z;
                    result[15] = 1.0;
                    return result;
                };
                localFrameToFixedFrameCache[hashAxis] = resultat;
            }
            return resultat;
        };

        /**
         * Computes a 4x4 transformation matrix from a reference frame with an east-north-up axes
         * centered at the provided origin to the provided ellipsoid's fixed reference frame.
         * The local axes are defined as:
         * <ul>
         * <li>The <code>x</code> axis points in the local east direction.</li>
         * <li>The <code>y</code> axis points in the local north direction.</li>
         * <li>The <code>z</code> axis points in the direction of the ellipsoid surface normal which passes through the position.</li>
         * </ul>
         *
         * @function
         * @param {Cartesian3} origin The center point of the local reference frame.
         * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid whose fixed frame is used in the transformation.
         * @param {Matrix4} [result] The object onto which to store the result.
         * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if none was provided.
         *
         * @example
         * // Get the transform from local east-north-up at cartographic (0.0, 0.0) to Earth's fixed frame.
         * var center = Cesium.Cartesian3.fromDegrees(0.0, 0.0);
         * var transform = Cesium.Transforms.eastNorthUpToFixedFrame(center);
         */
        Transforms.eastNorthUpToFixedFrame = Transforms.localFrameToFixedFrameGenerator('east','north');

        /**
         * Computes a 4x4 transformation matrix from a reference frame with an north-east-down axes
         * centered at the provided origin to the provided ellipsoid's fixed reference frame.
         * The local axes are defined as:
         * <ul>
         * <li>The <code>x</code> axis points in the local north direction.</li>
         * <li>The <code>y</code> axis points in the local east direction.</li>
         * <li>The <code>z</code> axis points in the opposite direction of the ellipsoid surface normal which passes through the position.</li>
         * </ul>
         *
         * @function
         * @param {Cartesian3} origin The center point of the local reference frame.
         * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid whose fixed frame is used in the transformation.
         * @param {Matrix4} [result] The object onto which to store the result.
         * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if none was provided.
         *
         * @example
         * // Get the transform from local north-east-down at cartographic (0.0, 0.0) to Earth's fixed frame.
         * var center = Cesium.Cartesian3.fromDegrees(0.0, 0.0);
         * var transform = Cesium.Transforms.northEastDownToFixedFrame(center);
         */
        Transforms.northEastDownToFixedFrame = Transforms.localFrameToFixedFrameGenerator('north','east');

        /**
         * Computes a 4x4 transformation matrix from a reference frame with an north-up-east axes
         * centered at the provided origin to the provided ellipsoid's fixed reference frame.
         * The local axes are defined as:
         * <ul>
         * <li>The <code>x</code> axis points in the local north direction.</li>
         * <li>The <code>y</code> axis points in the direction of the ellipsoid surface normal which passes through the position.</li>
         * <li>The <code>z</code> axis points in the local east direction.</li>
         * </ul>
         *
         * @function
         * @param {Cartesian3} origin The center point of the local reference frame.
         * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid whose fixed frame is used in the transformation.
         * @param {Matrix4} [result] The object onto which to store the result.
         * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if none was provided.
         *
         * @example
         * // Get the transform from local north-up-east at cartographic (0.0, 0.0) to Earth's fixed frame.
         * var center = Cesium.Cartesian3.fromDegrees(0.0, 0.0);
         * var transform = Cesium.Transforms.northUpEastToFixedFrame(center);
         */
        Transforms.northUpEastToFixedFrame = Transforms.localFrameToFixedFrameGenerator('north','up');

        /**
         * Computes a 4x4 transformation matrix from a reference frame with an north-west-up axes
         * centered at the provided origin to the provided ellipsoid's fixed reference frame.
         * The local axes are defined as:
         * <ul>
         * <li>The <code>x</code> axis points in the local north direction.</li>
         * <li>The <code>y</code> axis points in the local west direction.</li>
         * <li>The <code>z</code> axis points in the direction of the ellipsoid surface normal which passes through the position.</li>
         * </ul>
         *
         * @function
         * @param {Cartesian3} origin The center point of the local reference frame.
         * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid whose fixed frame is used in the transformation.
         * @param {Matrix4} [result] The object onto which to store the result.
         * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if none was provided.
         *
          * @example
         * // Get the transform from local north-West-Up at cartographic (0.0, 0.0) to Earth's fixed frame.
         * var center = Cesium.Cartesian3.fromDegrees(0.0, 0.0);
         * var transform = Cesium.Transforms.northWestUpToFixedFrame(center);
         */
        Transforms.northWestUpToFixedFrame = Transforms.localFrameToFixedFrameGenerator('north','west');

        var scratchHPRQuaternion$1 = new Quaternion();
        var scratchScale = new Cartographic.Cartesian3(1.0, 1.0, 1.0);
        var scratchHPRMatrix4 = new BoundingSphere.Matrix4();

        /**
         * Computes a 4x4 transformation matrix from a reference frame with axes computed from the heading-pitch-roll angles
         * centered at the provided origin to the provided ellipsoid's fixed reference frame. Heading is the rotation from the local north
         * direction where a positive angle is increasing eastward. Pitch is the rotation from the local east-north plane. Positive pitch angles
         * are above the plane. Negative pitch angles are below the plane. Roll is the first rotation applied about the local east axis.
         *
         * @param {Cartesian3} origin The center point of the local reference frame.
         * @param {HeadingPitchRoll} headingPitchRoll The heading, pitch, and roll.
         * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid whose fixed frame is used in the transformation.
         * @param {Transforms~LocalFrameToFixedFrame} [fixedFrameTransform=Transforms.eastNorthUpToFixedFrame] A 4x4 transformation
         *  matrix from a reference frame to the provided ellipsoid's fixed reference frame
         * @param {Matrix4} [result] The object onto which to store the result.
         * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if none was provided.
         *
         * @example
         * // Get the transform from local heading-pitch-roll at cartographic (0.0, 0.0) to Earth's fixed frame.
         * var center = Cesium.Cartesian3.fromDegrees(0.0, 0.0);
         * var heading = -Cesium.Math.PI_OVER_TWO;
         * var pitch = Cesium.Math.PI_OVER_FOUR;
         * var roll = 0.0;
         * var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
         * var transform = Cesium.Transforms.headingPitchRollToFixedFrame(center, hpr);
         */
        Transforms.headingPitchRollToFixedFrame = function(origin, headingPitchRoll, ellipsoid, fixedFrameTransform, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object( 'HeadingPitchRoll', headingPitchRoll);
            //>>includeEnd('debug');

            fixedFrameTransform = when.defaultValue(fixedFrameTransform, Transforms.eastNorthUpToFixedFrame);
            var hprQuaternion = Quaternion.fromHeadingPitchRoll(headingPitchRoll, scratchHPRQuaternion$1);
            var hprMatrix = BoundingSphere.Matrix4.fromTranslationQuaternionRotationScale(Cartographic.Cartesian3.ZERO, hprQuaternion, scratchScale, scratchHPRMatrix4);
            result = fixedFrameTransform(origin, ellipsoid, result);
            return BoundingSphere.Matrix4.multiply(result, hprMatrix, result);
        };

        var scratchENUMatrix4 = new BoundingSphere.Matrix4();
        var scratchHPRMatrix3 = new BoundingSphere.Matrix3();

        /**
         * Computes a quaternion from a reference frame with axes computed from the heading-pitch-roll angles
         * centered at the provided origin. Heading is the rotation from the local north
         * direction where a positive angle is increasing eastward. Pitch is the rotation from the local east-north plane. Positive pitch angles
         * are above the plane. Negative pitch angles are below the plane. Roll is the first rotation applied about the local east axis.
         *
         * @param {Cartesian3} origin The center point of the local reference frame.
         * @param {HeadingPitchRoll} headingPitchRoll The heading, pitch, and roll.
         * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid whose fixed frame is used in the transformation.
         * @param {Transforms~LocalFrameToFixedFrame} [fixedFrameTransform=Transforms.eastNorthUpToFixedFrame] A 4x4 transformation
         *  matrix from a reference frame to the provided ellipsoid's fixed reference frame
         * @param {Quaternion} [result] The object onto which to store the result.
         * @returns {Quaternion} The modified result parameter or a new Quaternion instance if none was provided.
         *
         * @example
         * // Get the quaternion from local heading-pitch-roll at cartographic (0.0, 0.0) to Earth's fixed frame.
         * var center = Cesium.Cartesian3.fromDegrees(0.0, 0.0);
         * var heading = -Cesium.Math.PI_OVER_TWO;
         * var pitch = Cesium.Math.PI_OVER_FOUR;
         * var roll = 0.0;
         * var hpr = new HeadingPitchRoll(heading, pitch, roll);
         * var quaternion = Cesium.Transforms.headingPitchRollQuaternion(center, hpr);
         */
        Transforms.headingPitchRollQuaternion = function(origin, headingPitchRoll, ellipsoid, fixedFrameTransform, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object( 'HeadingPitchRoll', headingPitchRoll);
            //>>includeEnd('debug');

            var transform = Transforms.headingPitchRollToFixedFrame(origin, headingPitchRoll, ellipsoid, fixedFrameTransform, scratchENUMatrix4);
            var rotation = BoundingSphere.Matrix4.getMatrix3(transform, scratchHPRMatrix3);
            return Quaternion.fromRotationMatrix(rotation, result);
        };

        var noScale = new Cartographic.Cartesian3(1.0, 1.0, 1.0);
        var hprCenterScratch = new Cartographic.Cartesian3();
        var ffScratch = new BoundingSphere.Matrix4();
        var hprTransformScratch = new BoundingSphere.Matrix4();
        var hprRotationScratch = new BoundingSphere.Matrix3();
        var hprQuaternionScratch = new Quaternion();
        /**
         * Computes heading-pitch-roll angles from a transform in a particular reference frame. Heading is the rotation from the local north
         * direction where a positive angle is increasing eastward. Pitch is the rotation from the local east-north plane. Positive pitch angles
         * are above the plane. Negative pitch angles are below the plane. Roll is the first rotation applied about the local east axis.
         *
         * @param {Matrix4} transform The transform
         * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid whose fixed frame is used in the transformation.
         * @param {Transforms~LocalFrameToFixedFrame} [fixedFrameTransform=Transforms.eastNorthUpToFixedFrame] A 4x4 transformation
         *  matrix from a reference frame to the provided ellipsoid's fixed reference frame
         * @param {HeadingPitchRoll} [result] The object onto which to store the result.
         * @returns {HeadingPitchRoll} The modified result parameter or a new HeadingPitchRoll instance if none was provided.
         */
        Transforms.fixedFrameToHeadingPitchRoll = function(transform, ellipsoid, fixedFrameTransform, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('transform', transform);
            //>>includeEnd('debug');

            ellipsoid = when.defaultValue(ellipsoid, Cartesian2.Ellipsoid.WGS84);
            fixedFrameTransform = when.defaultValue(fixedFrameTransform, Transforms.eastNorthUpToFixedFrame);
            if (!when.defined(result)) {
                result = new HeadingPitchRoll();
            }

            var center = BoundingSphere.Matrix4.getTranslation(transform, hprCenterScratch);
            if (Cartographic.Cartesian3.equals(center, Cartographic.Cartesian3.ZERO)) {
                result.heading = 0;
                result.pitch = 0;
                result.roll = 0;
                return result;
            }
            var toFixedFrame = BoundingSphere.Matrix4.inverseTransformation(fixedFrameTransform(center, ellipsoid, ffScratch), ffScratch);
            var transformCopy = BoundingSphere.Matrix4.setScale(transform, noScale, hprTransformScratch);
            transformCopy = BoundingSphere.Matrix4.setTranslation(transformCopy, Cartographic.Cartesian3.ZERO, transformCopy);

            toFixedFrame = BoundingSphere.Matrix4.multiply(toFixedFrame, transformCopy, toFixedFrame);
            var quaternionRotation = Quaternion.fromRotationMatrix(BoundingSphere.Matrix4.getMatrix3(toFixedFrame, hprRotationScratch), hprQuaternionScratch);
            quaternionRotation = Quaternion.normalize(quaternionRotation, quaternionRotation);

            return HeadingPitchRoll.fromQuaternion(quaternionRotation, result);
        };

        var gmstConstant0 = 6 * 3600 + 41 * 60 + 50.54841;
        var gmstConstant1 = 8640184.812866;
        var gmstConstant2 = 0.093104;
        var gmstConstant3 = -6.2E-6;
        var rateCoef = 1.1772758384668e-19;
        var wgs84WRPrecessing = 7.2921158553E-5;
        var twoPiOverSecondsInDay = _Math.CesiumMath.TWO_PI / 86400.0;
        var dateInUtc = new JulianDate();

        /**
         * Computes a rotation matrix to transform a point or vector from True Equator Mean Equinox (TEME) axes to the
         * pseudo-fixed axes at a given time.  This method treats the UT1 time standard as equivalent to UTC.
         *
         * @param {JulianDate} date The time at which to compute the rotation matrix.
         * @param {Matrix3} [result] The object onto which to store the result.
         * @returns {Matrix3} The modified result parameter or a new Matrix3 instance if none was provided.
         *
         * @example
         * //Set the view to the inertial frame.
         * scene.postUpdate.addEventListener(function(scene, time) {
         *    var now = Cesium.JulianDate.now();
         *    var offset = Cesium.Matrix4.multiplyByPoint(camera.transform, camera.position, new Cesium.Cartesian3());
         *    var transform = Cesium.Matrix4.fromRotationTranslation(Cesium.Transforms.computeTemeToPseudoFixedMatrix(now));
         *    var inverseTransform = Cesium.Matrix4.inverseTransformation(transform, new Cesium.Matrix4());
         *    Cesium.Matrix4.multiplyByPoint(inverseTransform, offset, offset);
         *    camera.lookAtTransform(transform, offset);
         * });
         */
        Transforms.computeTemeToPseudoFixedMatrix = function (date, result) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(date)) {
                throw new Check.DeveloperError('date is required.');
            }
            //>>includeEnd('debug');

            // GMST is actually computed using UT1.  We're using UTC as an approximation of UT1.
            // We do not want to use the function like convertTaiToUtc in JulianDate because
            // we explicitly do not want to fail when inside the leap second.

            dateInUtc = JulianDate.addSeconds(date, -JulianDate.computeTaiMinusUtc(date), dateInUtc);
            var utcDayNumber = dateInUtc.dayNumber;
            var utcSecondsIntoDay = dateInUtc.secondsOfDay;

            var t;
            var diffDays = utcDayNumber - 2451545;
            if (utcSecondsIntoDay >= 43200.0) {
                t = (diffDays + 0.5) / TimeConstants$1.DAYS_PER_JULIAN_CENTURY;
            } else {
                t = (diffDays - 0.5) / TimeConstants$1.DAYS_PER_JULIAN_CENTURY;
            }

            var gmst0 = gmstConstant0 + t * (gmstConstant1 + t * (gmstConstant2 + t * gmstConstant3));
            var angle = (gmst0 * twoPiOverSecondsInDay) % _Math.CesiumMath.TWO_PI;
            var ratio = wgs84WRPrecessing + rateCoef * (utcDayNumber - 2451545.5);
            var secondsSinceMidnight = (utcSecondsIntoDay + TimeConstants$1.SECONDS_PER_DAY * 0.5) % TimeConstants$1.SECONDS_PER_DAY;
            var gha = angle + (ratio * secondsSinceMidnight);
            var cosGha = Math.cos(gha);
            var sinGha = Math.sin(gha);

            if (!when.defined(result)) {
                return new BoundingSphere.Matrix3(cosGha, sinGha, 0.0,
                                  -sinGha, cosGha, 0.0,
                                      0.0,    0.0, 1.0);
            }
            result[0] = cosGha;
            result[1] = -sinGha;
            result[2] = 0.0;
            result[3] = sinGha;
            result[4] = cosGha;
            result[5] = 0.0;
            result[6] = 0.0;
            result[7] = 0.0;
            result[8] = 1.0;
            return result;
        };

        /**
         * The source of IAU 2006 XYS data, used for computing the transformation between the
         * Fixed and ICRF axes.
         * @type {Iau2006XysData}
         *
         * @see Transforms.computeIcrfToFixedMatrix
         * @see Transforms.computeFixedToIcrfMatrix
         *
         * @private
         */
        Transforms.iau2006XysData = new Iau2006XysData();

        /**
         * The source of Earth Orientation Parameters (EOP) data, used for computing the transformation
         * between the Fixed and ICRF axes.  By default, zero values are used for all EOP values,
         * yielding a reasonable but not completely accurate representation of the ICRF axes.
         * @type {EarthOrientationParameters}
         *
         * @see Transforms.computeIcrfToFixedMatrix
         * @see Transforms.computeFixedToIcrfMatrix
         *
         * @private
         */
        Transforms.earthOrientationParameters = EarthOrientationParameters.NONE;

        var ttMinusTai = 32.184;
        var j2000ttDays = 2451545.0;

        /**
         * Preloads the data necessary to transform between the ICRF and Fixed axes, in either
         * direction, over a given interval.  This function returns a promise that, when resolved,
         * indicates that the preload has completed.
         *
         * @param {TimeInterval} timeInterval The interval to preload.
         * @returns {Promise} A promise that, when resolved, indicates that the preload has completed
         *          and evaluation of the transformation between the fixed and ICRF axes will
         *          no longer return undefined for a time inside the interval.
         *
         *
         * @example
         * var interval = new Cesium.TimeInterval(...);
         * when(Cesium.Transforms.preloadIcrfFixed(interval), function() {
         *     // the data is now loaded
         * });
         *
         * @see Transforms.computeIcrfToFixedMatrix
         * @see Transforms.computeFixedToIcrfMatrix
         * @see when
         */
        Transforms.preloadIcrfFixed = function(timeInterval) {
            var startDayTT = timeInterval.start.dayNumber;
            var startSecondTT = timeInterval.start.secondsOfDay + ttMinusTai;
            var stopDayTT = timeInterval.stop.dayNumber;
            var stopSecondTT = timeInterval.stop.secondsOfDay + ttMinusTai;

            var xysPromise = Transforms.iau2006XysData.preload(startDayTT, startSecondTT, stopDayTT, stopSecondTT);
            var eopPromise = Transforms.earthOrientationParameters.getPromiseToLoad();

            return when.when.all([xysPromise, eopPromise]);
        };

        /**
         * Computes a rotation matrix to transform a point or vector from the International Celestial
         * Reference Frame (GCRF/ICRF) inertial frame axes to the Earth-Fixed frame axes (ITRF)
         * at a given time.  This function may return undefined if the data necessary to
         * do the transformation is not yet loaded.
         *
         * @param {JulianDate} date The time at which to compute the rotation matrix.
         * @param {Matrix3} [result] The object onto which to store the result.  If this parameter is
         *                  not specified, a new instance is created and returned.
         * @returns {Matrix3} The rotation matrix, or undefined if the data necessary to do the
         *                   transformation is not yet loaded.
         *
         *
         * @example
         * scene.postUpdate.addEventListener(function(scene, time) {
         *   // View in ICRF.
         *   var icrfToFixed = Cesium.Transforms.computeIcrfToFixedMatrix(time);
         *   if (Cesium.defined(icrfToFixed)) {
         *     var offset = Cesium.Cartesian3.clone(camera.position);
         *     var transform = Cesium.Matrix4.fromRotationTranslation(icrfToFixed);
         *     camera.lookAtTransform(transform, offset);
         *   }
         * });
         *
         * @see Transforms.preloadIcrfFixed
         */
        Transforms.computeIcrfToFixedMatrix = function(date, result) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(date)) {
                throw new Check.DeveloperError('date is required.');
            }
            //>>includeEnd('debug');
            if (!when.defined(result)) {
                result = new BoundingSphere.Matrix3();
            }

            var fixedToIcrfMtx = Transforms.computeFixedToIcrfMatrix(date, result);
            if (!when.defined(fixedToIcrfMtx)) {
                return undefined;
            }

            return BoundingSphere.Matrix3.transpose(fixedToIcrfMtx, result);
        };

        var xysScratch = new Iau2006XysSample(0.0, 0.0, 0.0);
        var eopScratch = new EarthOrientationParametersSample(0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
        var rotation1Scratch = new BoundingSphere.Matrix3();
        var rotation2Scratch = new BoundingSphere.Matrix3();

        /**
         * Computes a rotation matrix to transform a point or vector from the Earth-Fixed frame axes (ITRF)
         * to the International Celestial Reference Frame (GCRF/ICRF) inertial frame axes
         * at a given time.  This function may return undefined if the data necessary to
         * do the transformation is not yet loaded.
         *
         * @param {JulianDate} date The time at which to compute the rotation matrix.
         * @param {Matrix3} [result] The object onto which to store the result.  If this parameter is
         *                  not specified, a new instance is created and returned.
         * @returns {Matrix3} The rotation matrix, or undefined if the data necessary to do the
         *                   transformation is not yet loaded.
         *
         *
         * @example
         * // Transform a point from the ICRF axes to the Fixed axes.
         * var now = Cesium.JulianDate.now();
         * var pointInFixed = Cesium.Cartesian3.fromDegrees(0.0, 0.0);
         * var fixedToIcrf = Cesium.Transforms.computeIcrfToFixedMatrix(now);
         * var pointInInertial = new Cesium.Cartesian3();
         * if (Cesium.defined(fixedToIcrf)) {
         *     pointInInertial = Cesium.Matrix3.multiplyByVector(fixedToIcrf, pointInFixed, pointInInertial);
         * }
         *
         * @see Transforms.preloadIcrfFixed
         */
        Transforms.computeFixedToIcrfMatrix = function(date, result) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(date)) {
                throw new Check.DeveloperError('date is required.');
            }
            //>>includeEnd('debug');

            if (!when.defined(result)) {
                result = new BoundingSphere.Matrix3();
            }

            // Compute pole wander
            var eop = Transforms.earthOrientationParameters.compute(date, eopScratch);
            if (!when.defined(eop)) {
                return undefined;
            }

            // There is no external conversion to Terrestrial Time (TT).
            // So use International Atomic Time (TAI) and convert using offsets.
            // Here we are assuming that dayTT and secondTT are positive
            var dayTT = date.dayNumber;
            // It's possible here that secondTT could roll over 86400
            // This does not seem to affect the precision (unit tests check for this)
            var secondTT = date.secondsOfDay + ttMinusTai;

            var xys = Transforms.iau2006XysData.computeXysRadians(dayTT, secondTT, xysScratch);
            if (!when.defined(xys)) {
                return undefined;
            }

            var x = xys.x + eop.xPoleOffset;
            var y = xys.y + eop.yPoleOffset;

            // Compute XYS rotation
            var a = 1.0 / (1.0 + Math.sqrt(1.0 - x * x - y * y));

            var rotation1 = rotation1Scratch;
            rotation1[0] = 1.0 - a * x * x;
            rotation1[3] = -a * x * y;
            rotation1[6] = x;
            rotation1[1] = -a * x * y;
            rotation1[4] = 1 - a * y * y;
            rotation1[7] = y;
            rotation1[2] = -x;
            rotation1[5] = -y;
            rotation1[8] = 1 - a * (x * x + y * y);

            var rotation2 = BoundingSphere.Matrix3.fromRotationZ(-xys.s, rotation2Scratch);
            var matrixQ = BoundingSphere.Matrix3.multiply(rotation1, rotation2, rotation1Scratch);

            // Similar to TT conversions above
            // It's possible here that secondTT could roll over 86400
            // This does not seem to affect the precision (unit tests check for this)
            var dateUt1day = date.dayNumber;
            var dateUt1sec = date.secondsOfDay - JulianDate.computeTaiMinusUtc(date) + eop.ut1MinusUtc;

            // Compute Earth rotation angle
            // The IERS standard for era is
            //    era = 0.7790572732640 + 1.00273781191135448 * Tu
            // where
            //    Tu = JulianDateInUt1 - 2451545.0
            // However, you get much more precision if you make the following simplification
            //    era = a + (1 + b) * (JulianDayNumber + FractionOfDay - 2451545)
            //    era = a + (JulianDayNumber - 2451545) + FractionOfDay + b (JulianDayNumber - 2451545 + FractionOfDay)
            //    era = a + FractionOfDay + b (JulianDayNumber - 2451545 + FractionOfDay)
            // since (JulianDayNumber - 2451545) represents an integer number of revolutions which will be discarded anyway.
            var daysSinceJ2000 = dateUt1day - 2451545;
            var fractionOfDay = dateUt1sec / TimeConstants$1.SECONDS_PER_DAY;
            var era = 0.7790572732640 + fractionOfDay + 0.00273781191135448 * (daysSinceJ2000 + fractionOfDay);
            era = (era % 1.0) * _Math.CesiumMath.TWO_PI;

            var earthRotation = BoundingSphere.Matrix3.fromRotationZ(era, rotation2Scratch);

            // pseudoFixed to ICRF
            var pfToIcrf = BoundingSphere.Matrix3.multiply(matrixQ, earthRotation, rotation1Scratch);

            // Compute pole wander matrix
            var cosxp = Math.cos(eop.xPoleWander);
            var cosyp = Math.cos(eop.yPoleWander);
            var sinxp = Math.sin(eop.xPoleWander);
            var sinyp = Math.sin(eop.yPoleWander);

            var ttt = (dayTT - j2000ttDays) + secondTT / TimeConstants$1.SECONDS_PER_DAY;
            ttt /= 36525.0;

            // approximate sp value in rad
            var sp = -47.0e-6 * ttt * _Math.CesiumMath.RADIANS_PER_DEGREE / 3600.0;
            var cossp = Math.cos(sp);
            var sinsp = Math.sin(sp);

            var fToPfMtx = rotation2Scratch;
            fToPfMtx[0] = cosxp * cossp;
            fToPfMtx[1] = cosxp * sinsp;
            fToPfMtx[2] = sinxp;
            fToPfMtx[3] = -cosyp * sinsp + sinyp * sinxp * cossp;
            fToPfMtx[4] = cosyp * cossp + sinyp * sinxp * sinsp;
            fToPfMtx[5] = -sinyp * cosxp;
            fToPfMtx[6] = -sinyp * sinsp - cosyp * sinxp * cossp;
            fToPfMtx[7] = sinyp * cossp - cosyp * sinxp * sinsp;
            fToPfMtx[8] = cosyp * cosxp;

            return BoundingSphere.Matrix3.multiply(pfToIcrf, fToPfMtx, result);
        };

        var pointToWindowCoordinatesTemp = new Cartesian4.Cartesian4();

        /**
         * Transform a point from model coordinates to window coordinates.
         *
         * @param {Matrix4} modelViewProjectionMatrix The 4x4 model-view-projection matrix.
         * @param {Matrix4} viewportTransformation The 4x4 viewport transformation.
         * @param {Cartesian3} point The point to transform.
         * @param {Cartesian2} [result] The object onto which to store the result.
         * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if none was provided.
         */
        Transforms.pointToWindowCoordinates = function (modelViewProjectionMatrix, viewportTransformation, point, result) {
            result = Transforms.pointToGLWindowCoordinates(modelViewProjectionMatrix, viewportTransformation, point, result);
            result.y = 2.0 * viewportTransformation[5] - result.y;
            return result;
        };

        /**
         * @private
         */
        Transforms.pointToGLWindowCoordinates = function(modelViewProjectionMatrix, viewportTransformation, point, result) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(modelViewProjectionMatrix)) {
                throw new Check.DeveloperError('modelViewProjectionMatrix is required.');
            }

            if (!when.defined(viewportTransformation)) {
                throw new Check.DeveloperError('viewportTransformation is required.');
            }

            if (!when.defined(point)) {
                throw new Check.DeveloperError('point is required.');
            }
            //>>includeEnd('debug');

            if (!when.defined(result)) {
                result = new Cartesian2.Cartesian2();
            }

            var tmp = pointToWindowCoordinatesTemp;

            BoundingSphere.Matrix4.multiplyByVector(modelViewProjectionMatrix, Cartesian4.Cartesian4.fromElements(point.x, point.y, point.z, 1, tmp), tmp);
            Cartesian4.Cartesian4.multiplyByScalar(tmp, 1.0 / tmp.w, tmp);
            BoundingSphere.Matrix4.multiplyByVector(viewportTransformation, tmp, tmp);
            return Cartesian2.Cartesian2.fromCartesian4(tmp, result);
        };

        var normalScratch = new Cartographic.Cartesian3();
        var rightScratch = new Cartographic.Cartesian3();
        var upScratch = new Cartographic.Cartesian3();

        /**
         * @private
         */
        Transforms.rotationMatrixFromPositionVelocity = function(position, velocity, ellipsoid, result) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(position)) {
                throw new Check.DeveloperError('position is required.');
            }

            if (!when.defined(velocity)) {
                throw new Check.DeveloperError('velocity is required.');
            }
            //>>includeEnd('debug');

            var normal = when.defaultValue(ellipsoid, Cartesian2.Ellipsoid.WGS84).geodeticSurfaceNormal(position, normalScratch);
            var right = Cartographic.Cartesian3.cross(velocity, normal, rightScratch);

            if (Cartographic.Cartesian3.equalsEpsilon(right, Cartographic.Cartesian3.ZERO, _Math.CesiumMath.EPSILON6)) {
                right = Cartographic.Cartesian3.clone(Cartographic.Cartesian3.UNIT_X, right);
            }

            var up = Cartographic.Cartesian3.cross(right, velocity, upScratch);
            Cartographic.Cartesian3.normalize(up, up);
            Cartographic.Cartesian3.cross(velocity, up, right);
            Cartographic.Cartesian3.negate(right, right);
            Cartographic.Cartesian3.normalize(right, right);

            if (!when.defined(result)) {
                result = new BoundingSphere.Matrix3();
            }

            result[0] = velocity.x;
            result[1] = velocity.y;
            result[2] = velocity.z;
            result[3] = right.x;
            result[4] = right.y;
            result[5] = right.z;
            result[6] = up.x;
            result[7] = up.y;
            result[8] = up.z;

            return result;
        };

        var swizzleMatrix = new BoundingSphere.Matrix4(
            0.0, 0.0, 1.0, 0.0,
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 1.0
        );

        var scratchCartographic = new Cartographic.Cartographic();
        var scratchCartesian3Projection = new Cartographic.Cartesian3();
        var scratchCenter = new Cartographic.Cartesian3();
        var scratchRotation = new BoundingSphere.Matrix3();
        var scratchFromENU = new BoundingSphere.Matrix4();
        var scratchToENU = new BoundingSphere.Matrix4();

        /**
         * @private
         */
        Transforms.basisTo2D = function(projection, matrix, result) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(projection)) {
                throw new Check.DeveloperError('projection is required.');
            }
            if (!when.defined(matrix)) {
                throw new Check.DeveloperError('matrix is required.');
            }
            if (!when.defined(result)) {
                throw new Check.DeveloperError('result is required.');
            }
            //>>includeEnd('debug');

            var rtcCenter = BoundingSphere.Matrix4.getTranslation(matrix, scratchCenter);
            var ellipsoid = projection.ellipsoid;

            // Get the 2D Center
            var cartographic = ellipsoid.cartesianToCartographic(rtcCenter, scratchCartographic);
            var projectedPosition = projection.project(cartographic, scratchCartesian3Projection);
            Cartographic.Cartesian3.fromElements(projectedPosition.z, projectedPosition.x, projectedPosition.y, projectedPosition);

            // Assuming the instance are positioned in WGS84, invert the WGS84 transform to get the local transform and then convert to 2D
            var fromENU = Transforms.eastNorthUpToFixedFrame(rtcCenter, ellipsoid, scratchFromENU);
            var toENU = BoundingSphere.Matrix4.inverseTransformation(fromENU, scratchToENU);
            var rotation = BoundingSphere.Matrix4.getMatrix3(matrix, scratchRotation);
            var local = BoundingSphere.Matrix4.multiplyByMatrix3(toENU, rotation, result);
            BoundingSphere.Matrix4.multiply(swizzleMatrix, local, result); // Swap x, y, z for 2D
            BoundingSphere.Matrix4.setTranslation(result, projectedPosition, result); // Use the projected center

            return result;
        };

        /**
         * @private
         */
        Transforms.wgs84To2DModelMatrix = function(projection, center, result) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(projection)) {
                throw new Check.DeveloperError('projection is required.');
            }
            if (!when.defined(center)) {
                throw new Check.DeveloperError('center is required.');
            }
            if (!when.defined(result)) {
                throw new Check.DeveloperError('result is required.');
            }
            //>>includeEnd('debug');

            var ellipsoid = projection.ellipsoid;

            var fromENU = Transforms.eastNorthUpToFixedFrame(center, ellipsoid, scratchFromENU);
            var toENU = BoundingSphere.Matrix4.inverseTransformation(fromENU, scratchToENU);

            var cartographic = ellipsoid.cartesianToCartographic(center, scratchCartographic);
            var projectedPosition = projection.project(cartographic, scratchCartesian3Projection);
            Cartographic.Cartesian3.fromElements(projectedPosition.z, projectedPosition.x, projectedPosition.y, projectedPosition);

            var translation = BoundingSphere.Matrix4.fromTranslation(projectedPosition, scratchFromENU);
            BoundingSphere.Matrix4.multiply(swizzleMatrix, toENU, result);
            BoundingSphere.Matrix4.multiply(translation, result, result);

            return result;
        };
        Transforms.buildUp = function(viewPos, cartesianDir) {
            var dir = cartesianDir.clone();
            var up = viewPos.clone();
            up = Cartographic.Cartesian3.normalize(up, up);

            if(Math.abs(Cartographic.Cartesian3.dot(up, dir)) >= 1.0){
                if(Math.abs(Cartographic.Cartesian3.dot(dir, Cartographic.Cartesian3.UNIT_Y)) < 1.0){
                    up = Cartographic.Cartesian3.clone(Cartographic.Cartesian3.UNIT_Y, up);
                }
                else{
                    up = Cartographic.Cartesian3.clone(Cartographic.Cartesian3.UNIT_Z, up);
                }
            }

            var vLeft = new Cartographic.Cartesian3();
            Cartographic.Cartesian3.cross(up, dir, vLeft);
            vLeft = Cartographic.Cartesian3.normalize(vLeft, vLeft);
            Cartographic.Cartesian3.cross(dir, vLeft, up);
            up = Cartographic.Cartesian3.normalize(up, up);
            return up;
        };

        Transforms.getHeading = function(direction, up) {
            var heading;
            if (!_Math.CesiumMath.equalsEpsilon(Math.abs(direction.z), 1.0, _Math.CesiumMath.EPSILON3)) {
                heading = Math.atan2(direction.y, direction.x) - _Math.CesiumMath.PI_OVER_TWO;
            } else {
                heading = Math.atan2(up.y, up.x) - _Math.CesiumMath.PI_OVER_TWO;
            }

            return _Math.CesiumMath.TWO_PI - _Math.CesiumMath.zeroToTwoPi(heading);
        };

        Transforms.convertToColumbusCartesian = function(cartesian) {
            var projection = new BoundingSphere.GeographicProjection();
            var ellipsoid = projection.ellipsoid;
            var scratchCartesian = new Cartographic.Cartesian3();
            var scratchCartographic = new Cartographic.Cartographic();
            ellipsoid.cartesianToCartographic(cartesian, scratchCartographic);
            projection.project(scratchCartographic, scratchCartesian);
            return Cartographic.Cartesian3.fromElements(scratchCartesian.z, scratchCartesian.x, scratchCartesian.y);
        };

    exports.Quaternion = Quaternion;
    exports.Transforms = Transforms;

});

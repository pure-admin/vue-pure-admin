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
define(['exports', './when-8d13db60', './Check-70bec281', './Math-61ede240', './Cartographic-fe4be337', './Cartesian2-85064f09', './Cartesian4-5af5bb24', './RuntimeError-ba10bc3e'], function (exports, when, Check, _Math, Cartographic, Cartesian2, Cartesian4, RuntimeError) { 'use strict';

    /**
     * A simple map projection where longitude and latitude are linearly mapped to X and Y by multiplying
     * them by the {@link Ellipsoid#maximumRadius}.  This projection
     * is commonly known as geographic, equirectangular, equidistant cylindrical, or plate carrée.  It
     * is also known as EPSG:4326.
     *
     * @alias GeographicProjection
     * @constructor
     *
     * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid.
     *
     * @see WebMercatorProjection
     */
    function GeographicProjection(ellipsoid) {
        this._ellipsoid = when.defaultValue(ellipsoid, Cartesian2.Ellipsoid.WGS84);
        this._semimajorAxis = this._ellipsoid.maximumRadius;
        this._oneOverSemimajorAxis = 1.0 / this._semimajorAxis;
    }

    Object.defineProperties(GeographicProjection.prototype, {
        /**
         * Gets the {@link Ellipsoid}.
         *
         * @memberof GeographicProjection.prototype
         *
         * @type {Ellipsoid}
         * @readonly
         */
        ellipsoid : {
            get : function() {
                return this._ellipsoid;
            }
        }
    });

    /**
     * Projects a set of {@link Cartographic} coordinates, in radians, to map coordinates, in meters.
     * X and Y are the longitude and latitude, respectively, multiplied by the maximum radius of the
     * ellipsoid.  Z is the unmodified height.
     *
     * @param {Cartographic} cartographic The coordinates to project.
     * @param {Cartesian3} [result] An instance into which to copy the result.  If this parameter is
     *        undefined, a new instance is created and returned.
     * @returns {Cartesian3} The projected coordinates.  If the result parameter is not undefined, the
     *          coordinates are copied there and that instance is returned.  Otherwise, a new instance is
     *          created and returned.
     */
    GeographicProjection.prototype.project = function(cartographic, result) {
        // Actually this is the special case of equidistant cylindrical called the plate carree
        var semimajorAxis = this._semimajorAxis;
        var x = cartographic.longitude * semimajorAxis;
        var y = cartographic.latitude * semimajorAxis;
        var z = cartographic.height;

        if (!when.defined(result)) {
            return new Cartographic.Cartesian3(x, y, z);
        }

        result.x = x;
        result.y = y;
        result.z = z;
        return result;
    };

    /**
     * Unprojects a set of projected {@link Cartesian3} coordinates, in meters, to {@link Cartographic}
     * coordinates, in radians.  Longitude and Latitude are the X and Y coordinates, respectively,
     * divided by the maximum radius of the ellipsoid.  Height is the unmodified Z coordinate.
     *
     * @param {Cartesian3} cartesian The Cartesian position to unproject with height (z) in meters.
     * @param {Cartographic} [result] An instance into which to copy the result.  If this parameter is
     *        undefined, a new instance is created and returned.
     * @returns {Cartographic} The unprojected coordinates.  If the result parameter is not undefined, the
     *          coordinates are copied there and that instance is returned.  Otherwise, a new instance is
     *          created and returned.
     */
    GeographicProjection.prototype.unproject = function(cartesian, result) {
        //>>includeStart('debug', pragmas.debug);
        if (!when.defined(cartesian)) {
            throw new Check.DeveloperError('cartesian is required');
        }
        //>>includeEnd('debug');

        var oneOverEarthSemimajorAxis = this._oneOverSemimajorAxis;
        var longitude = cartesian.x * oneOverEarthSemimajorAxis;
        var latitude = cartesian.y * oneOverEarthSemimajorAxis;
        var height = cartesian.z;

        if (!when.defined(result)) {
            return new Cartographic.Cartographic(longitude, latitude, height);
        }

        result.longitude = longitude;
        result.latitude = latitude;
        result.height = height;
        return result;
    };

    /**
         * This enumerated type is used in determining where, relative to the frustum, an
         * object is located. The object can either be fully contained within the frustum (INSIDE),
         * partially inside the frustum and partially outside (INTERSECTING), or somwhere entirely
         * outside of the frustum's 6 planes (OUTSIDE).
         *
         * @exports Intersect
         */
        var Intersect = {
            /**
             * Represents that an object is not contained within the frustum.
             *
             * @type {Number}
             * @constant
             */
            OUTSIDE : -1,

            /**
             * Represents that an object intersects one of the frustum's planes.
             *
             * @type {Number}
             * @constant
             */
            INTERSECTING : 0,

            /**
             * Represents that an object is fully within the frustum.
             *
             * @type {Number}
             * @constant
             */
            INSIDE : 1
        };
    var Intersect$1 = Object.freeze(Intersect);

    /**
         * Represents the closed interval [start, stop].
         * @alias Interval
         * @constructor
         *
         * @param {Number} [start=0.0] The beginning of the interval.
         * @param {Number} [stop=0.0] The end of the interval.
         */
        function Interval(start, stop) {
            /**
             * The beginning of the interval.
             * @type {Number}
             * @default 0.0
             */
            this.start = when.defaultValue(start, 0.0);
            /**
             * The end of the interval.
             * @type {Number}
             * @default 0.0
             */
            this.stop = when.defaultValue(stop, 0.0);
        }

    /**
         * A 3x3 matrix, indexable as a column-major order array.
         * Constructor parameters are in row-major order for code readability.
         * @alias Matrix3
         * @constructor
         *
         * @param {Number} [column0Row0=0.0] The value for column 0, row 0.
         * @param {Number} [column1Row0=0.0] The value for column 1, row 0.
         * @param {Number} [column2Row0=0.0] The value for column 2, row 0.
         * @param {Number} [column0Row1=0.0] The value for column 0, row 1.
         * @param {Number} [column1Row1=0.0] The value for column 1, row 1.
         * @param {Number} [column2Row1=0.0] The value for column 2, row 1.
         * @param {Number} [column0Row2=0.0] The value for column 0, row 2.
         * @param {Number} [column1Row2=0.0] The value for column 1, row 2.
         * @param {Number} [column2Row2=0.0] The value for column 2, row 2.
         *
         * @see Matrix3.fromColumnMajorArray
         * @see Matrix3.fromRowMajorArray
         * @see Matrix3.fromQuaternion
         * @see Matrix3.fromScale
         * @see Matrix3.fromUniformScale
         * @see Matrix2
         * @see Matrix4
         */
        function Matrix3(column0Row0, column1Row0, column2Row0,
                               column0Row1, column1Row1, column2Row1,
                               column0Row2, column1Row2, column2Row2) {
            this[0] = when.defaultValue(column0Row0, 0.0);
            this[1] = when.defaultValue(column0Row1, 0.0);
            this[2] = when.defaultValue(column0Row2, 0.0);
            this[3] = when.defaultValue(column1Row0, 0.0);
            this[4] = when.defaultValue(column1Row1, 0.0);
            this[5] = when.defaultValue(column1Row2, 0.0);
            this[6] = when.defaultValue(column2Row0, 0.0);
            this[7] = when.defaultValue(column2Row1, 0.0);
            this[8] = when.defaultValue(column2Row2, 0.0);
        }

        /**
         * The number of elements used to pack the object into an array.
         * @type {Number}
         */
        Matrix3.packedLength = 9;

        /**
         * Stores the provided instance into the provided array.
         *
         * @param {Matrix3} value The value to pack.
         * @param {Number[]} array The array to pack into.
         * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
         *
         * @returns {Number[]} The array that was packed into
         */
        Matrix3.pack = function(value, array, startingIndex) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('value', value);
            Check.Check.defined('array', array);
            //>>includeEnd('debug');

            startingIndex = when.defaultValue(startingIndex, 0);

            array[startingIndex++] = value[0];
            array[startingIndex++] = value[1];
            array[startingIndex++] = value[2];
            array[startingIndex++] = value[3];
            array[startingIndex++] = value[4];
            array[startingIndex++] = value[5];
            array[startingIndex++] = value[6];
            array[startingIndex++] = value[7];
            array[startingIndex++] = value[8];

            return array;
        };

        /**
         * Retrieves an instance from a packed array.
         *
         * @param {Number[]} array The packed array.
         * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
         * @param {Matrix3} [result] The object into which to store the result.
         * @returns {Matrix3} The modified result parameter or a new Matrix3 instance if one was not provided.
         */
        Matrix3.unpack = function(array, startingIndex, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('array', array);
            //>>includeEnd('debug');

            startingIndex = when.defaultValue(startingIndex, 0);

            if (!when.defined(result)) {
                result = new Matrix3();
            }

            result[0] = array[startingIndex++];
            result[1] = array[startingIndex++];
            result[2] = array[startingIndex++];
            result[3] = array[startingIndex++];
            result[4] = array[startingIndex++];
            result[5] = array[startingIndex++];
            result[6] = array[startingIndex++];
            result[7] = array[startingIndex++];
            result[8] = array[startingIndex++];
            return result;
        };

        /**
         * Duplicates a Matrix3 instance.
         *
         * @param {Matrix3} matrix The matrix to duplicate.
         * @param {Matrix3} [result] The object onto which to store the result.
         * @returns {Matrix3} The modified result parameter or a new Matrix3 instance if one was not provided. (Returns undefined if matrix is undefined)
         */
        Matrix3.clone = function(matrix, result) {
            if (!when.defined(matrix)) {
                return undefined;
            }
            if (!when.defined(result)) {
                return new Matrix3(matrix[0], matrix[3], matrix[6],
                                   matrix[1], matrix[4], matrix[7],
                                   matrix[2], matrix[5], matrix[8]);
            }
            result[0] = matrix[0];
            result[1] = matrix[1];
            result[2] = matrix[2];
            result[3] = matrix[3];
            result[4] = matrix[4];
            result[5] = matrix[5];
            result[6] = matrix[6];
            result[7] = matrix[7];
            result[8] = matrix[8];
            return result;
        };

        /**
         * Creates a Matrix3 from 9 consecutive elements in an array.
         *
         * @param {Number[]} array The array whose 9 consecutive elements correspond to the positions of the matrix.  Assumes column-major order.
         * @param {Number} [startingIndex=0] The offset into the array of the first element, which corresponds to first column first row position in the matrix.
         * @param {Matrix3} [result] The object onto which to store the result.
         * @returns {Matrix3} The modified result parameter or a new Matrix3 instance if one was not provided.
         *
         * @example
         * // Create the Matrix3:
         * // [1.0, 2.0, 3.0]
         * // [1.0, 2.0, 3.0]
         * // [1.0, 2.0, 3.0]
         *
         * var v = [1.0, 1.0, 1.0, 2.0, 2.0, 2.0, 3.0, 3.0, 3.0];
         * var m = Cesium.Matrix3.fromArray(v);
         *
         * // Create same Matrix3 with using an offset into an array
         * var v2 = [0.0, 0.0, 1.0, 1.0, 1.0, 2.0, 2.0, 2.0, 3.0, 3.0, 3.0];
         * var m2 = Cesium.Matrix3.fromArray(v2, 2);
         */
        Matrix3.fromArray = function(array, startingIndex, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('array', array);
            //>>includeEnd('debug');

            startingIndex = when.defaultValue(startingIndex, 0);

            if (!when.defined(result)) {
                result = new Matrix3();
            }

            result[0] = array[startingIndex];
            result[1] = array[startingIndex + 1];
            result[2] = array[startingIndex + 2];
            result[3] = array[startingIndex + 3];
            result[4] = array[startingIndex + 4];
            result[5] = array[startingIndex + 5];
            result[6] = array[startingIndex + 6];
            result[7] = array[startingIndex + 7];
            result[8] = array[startingIndex + 8];
            return result;
        };

        /**
         * Creates a Matrix3 instance from a column-major order array.
         *
         * @param {Number[]} values The column-major order array.
         * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
         * @returns {Matrix3} The modified result parameter, or a new Matrix3 instance if one was not provided.
         */
        Matrix3.fromColumnMajorArray = function(values, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('values', values);
            //>>includeEnd('debug');

            return Matrix3.clone(values, result);
        };

        /**
         * Creates a Matrix3 instance from a row-major order array.
         * The resulting matrix will be in column-major order.
         *
         * @param {Number[]} values The row-major order array.
         * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
         * @returns {Matrix3} The modified result parameter, or a new Matrix3 instance if one was not provided.
         */
        Matrix3.fromRowMajorArray = function(values, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('values', values);
            //>>includeEnd('debug');

            if (!when.defined(result)) {
                return new Matrix3(values[0], values[1], values[2],
                                   values[3], values[4], values[5],
                                   values[6], values[7], values[8]);
            }
            result[0] = values[0];
            result[1] = values[3];
            result[2] = values[6];
            result[3] = values[1];
            result[4] = values[4];
            result[5] = values[7];
            result[6] = values[2];
            result[7] = values[5];
            result[8] = values[8];
            return result;
        };

        /**
         * Computes a 3x3 rotation matrix from the provided quaternion.
         *
         * @param {Quaternion} quaternion the quaternion to use.
         * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
         * @returns {Matrix3} The 3x3 rotation matrix from this quaternion.
         */
        Matrix3.fromQuaternion = function(quaternion, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('quaternion', quaternion);
            //>>includeEnd('debug');

            var x2 = quaternion.x * quaternion.x;
            var xy = quaternion.x * quaternion.y;
            var xz = quaternion.x * quaternion.z;
            var xw = quaternion.x * quaternion.w;
            var y2 = quaternion.y * quaternion.y;
            var yz = quaternion.y * quaternion.z;
            var yw = quaternion.y * quaternion.w;
            var z2 = quaternion.z * quaternion.z;
            var zw = quaternion.z * quaternion.w;
            var w2 = quaternion.w * quaternion.w;

            var m00 = x2 - y2 - z2 + w2;
            var m01 = 2.0 * (xy - zw);
            var m02 = 2.0 * (xz + yw);

            var m10 = 2.0 * (xy + zw);
            var m11 = -x2 + y2 - z2 + w2;
            var m12 = 2.0 * (yz - xw);

            var m20 = 2.0 * (xz - yw);
            var m21 = 2.0 * (yz + xw);
            var m22 = -x2 - y2 + z2 + w2;

            if (!when.defined(result)) {
                return new Matrix3(m00, m01, m02,
                                   m10, m11, m12,
                                   m20, m21, m22);
            }
            result[0] = m00;
            result[1] = m10;
            result[2] = m20;
            result[3] = m01;
            result[4] = m11;
            result[5] = m21;
            result[6] = m02;
            result[7] = m12;
            result[8] = m22;
            return result;
        };

        /**
         * Computes a 3x3 rotation matrix from the provided headingPitchRoll. (see http://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles )
         *
         * @param {HeadingPitchRoll} headingPitchRoll the headingPitchRoll to use.
         * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
         * @returns {Matrix3} The 3x3 rotation matrix from this headingPitchRoll.
         */
        Matrix3.fromHeadingPitchRoll = function(headingPitchRoll, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('headingPitchRoll', headingPitchRoll);
            //>>includeEnd('debug');

            var cosTheta = Math.cos(-headingPitchRoll.pitch);
            var cosPsi = Math.cos(-headingPitchRoll.heading);
            var cosPhi = Math.cos(headingPitchRoll.roll);
            var sinTheta = Math.sin(-headingPitchRoll.pitch);
            var sinPsi = Math.sin(-headingPitchRoll.heading);
            var sinPhi = Math.sin(headingPitchRoll.roll);

            var m00 = cosTheta * cosPsi;
            var m01 = -cosPhi * sinPsi + sinPhi * sinTheta * cosPsi;
            var m02 = sinPhi * sinPsi + cosPhi * sinTheta * cosPsi;

            var m10 = cosTheta * sinPsi;
            var m11 = cosPhi * cosPsi + sinPhi * sinTheta * sinPsi;
            var m12 = -sinPhi * cosPsi + cosPhi * sinTheta * sinPsi;

            var m20 = -sinTheta;
            var m21 = sinPhi * cosTheta;
            var m22 = cosPhi * cosTheta;

            if (!when.defined(result)) {
                return new Matrix3(m00, m01, m02,
                    m10, m11, m12,
                    m20, m21, m22);
            }
            result[0] = m00;
            result[1] = m10;
            result[2] = m20;
            result[3] = m01;
            result[4] = m11;
            result[5] = m21;
            result[6] = m02;
            result[7] = m12;
            result[8] = m22;
            return result;
        };

        /**
         * Computes a Matrix3 instance representing a non-uniform scale.
         *
         * @param {Cartesian3} scale The x, y, and z scale factors.
         * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
         * @returns {Matrix3} The modified result parameter, or a new Matrix3 instance if one was not provided.
         *
         * @example
         * // Creates
         * //   [7.0, 0.0, 0.0]
         * //   [0.0, 8.0, 0.0]
         * //   [0.0, 0.0, 9.0]
         * var m = Cesium.Matrix3.fromScale(new Cesium.Cartesian3(7.0, 8.0, 9.0));
         */
        Matrix3.fromScale = function(scale, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('scale', scale);
            //>>includeEnd('debug');

            if (!when.defined(result)) {
                return new Matrix3(
                    scale.x, 0.0,     0.0,
                    0.0,     scale.y, 0.0,
                    0.0,     0.0,     scale.z);
            }

            result[0] = scale.x;
            result[1] = 0.0;
            result[2] = 0.0;
            result[3] = 0.0;
            result[4] = scale.y;
            result[5] = 0.0;
            result[6] = 0.0;
            result[7] = 0.0;
            result[8] = scale.z;
            return result;
        };

        /**
         * Computes a Matrix3 instance representing a uniform scale.
         *
         * @param {Number} scale The uniform scale factor.
         * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
         * @returns {Matrix3} The modified result parameter, or a new Matrix3 instance if one was not provided.
         *
         * @example
         * // Creates
         * //   [2.0, 0.0, 0.0]
         * //   [0.0, 2.0, 0.0]
         * //   [0.0, 0.0, 2.0]
         * var m = Cesium.Matrix3.fromUniformScale(2.0);
         */
        Matrix3.fromUniformScale = function(scale, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.number('scale', scale);
            //>>includeEnd('debug');

            if (!when.defined(result)) {
                return new Matrix3(
                    scale, 0.0,   0.0,
                    0.0,   scale, 0.0,
                    0.0,   0.0,   scale);
            }

            result[0] = scale;
            result[1] = 0.0;
            result[2] = 0.0;
            result[3] = 0.0;
            result[4] = scale;
            result[5] = 0.0;
            result[6] = 0.0;
            result[7] = 0.0;
            result[8] = scale;
            return result;
        };

        /**
         * Computes a Matrix3 instance representing the cross product equivalent matrix of a Cartesian3 vector.
         *
         * @param {Cartesian3} vector the vector on the left hand side of the cross product operation.
         * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
         * @returns {Matrix3} The modified result parameter, or a new Matrix3 instance if one was not provided.
         *
         * @example
         * // Creates
         * //   [0.0, -9.0,  8.0]
         * //   [9.0,  0.0, -7.0]
         * //   [-8.0, 7.0,  0.0]
         * var m = Cesium.Matrix3.fromCrossProduct(new Cesium.Cartesian3(7.0, 8.0, 9.0));
         */
        Matrix3.fromCrossProduct = function(vector, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('vector', vector);
            //>>includeEnd('debug');

            if (!when.defined(result)) {
                return new Matrix3(
                          0.0, -vector.z,  vector.y,
                     vector.z,       0.0, -vector.x,
                    -vector.y,  vector.x,       0.0);
            }

            result[0] = 0.0;
            result[1] = vector.z;
            result[2] = -vector.y;
            result[3] = -vector.z;
            result[4] = 0.0;
            result[5] = vector.x;
            result[6] = vector.y;
            result[7] = -vector.x;
            result[8] = 0.0;
            return result;
        };

        /**
         * Creates a rotation matrix around the x-axis.
         *
         * @param {Number} angle The angle, in radians, of the rotation.  Positive angles are counterclockwise.
         * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
         * @returns {Matrix3} The modified result parameter, or a new Matrix3 instance if one was not provided.
         *
         * @example
         * // Rotate a point 45 degrees counterclockwise around the x-axis.
         * var p = new Cesium.Cartesian3(5, 6, 7);
         * var m = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(45.0));
         * var rotated = Cesium.Matrix3.multiplyByVector(m, p, new Cesium.Cartesian3());
         */
        Matrix3.fromRotationX = function(angle, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.number('angle', angle);
            //>>includeEnd('debug');

            var cosAngle = Math.cos(angle);
            var sinAngle = Math.sin(angle);

            if (!when.defined(result)) {
                return new Matrix3(
                    1.0, 0.0, 0.0,
                    0.0, cosAngle, -sinAngle,
                    0.0, sinAngle, cosAngle);
            }

            result[0] = 1.0;
            result[1] = 0.0;
            result[2] = 0.0;
            result[3] = 0.0;
            result[4] = cosAngle;
            result[5] = sinAngle;
            result[6] = 0.0;
            result[7] = -sinAngle;
            result[8] = cosAngle;

            return result;
        };

        /**
         * Creates a rotation matrix around the y-axis.
         *
         * @param {Number} angle The angle, in radians, of the rotation.  Positive angles are counterclockwise.
         * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
         * @returns {Matrix3} The modified result parameter, or a new Matrix3 instance if one was not provided.
         *
         * @example
         * // Rotate a point 45 degrees counterclockwise around the y-axis.
         * var p = new Cesium.Cartesian3(5, 6, 7);
         * var m = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(45.0));
         * var rotated = Cesium.Matrix3.multiplyByVector(m, p, new Cesium.Cartesian3());
         */
        Matrix3.fromRotationY = function(angle, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.number('angle', angle);
            //>>includeEnd('debug');

            var cosAngle = Math.cos(angle);
            var sinAngle = Math.sin(angle);

            if (!when.defined(result)) {
                return new Matrix3(
                    cosAngle, 0.0, sinAngle,
                    0.0, 1.0, 0.0,
                    -sinAngle, 0.0, cosAngle);
            }

            result[0] = cosAngle;
            result[1] = 0.0;
            result[2] = -sinAngle;
            result[3] = 0.0;
            result[4] = 1.0;
            result[5] = 0.0;
            result[6] = sinAngle;
            result[7] = 0.0;
            result[8] = cosAngle;

            return result;
        };

        /**
         * Creates a rotation matrix around the z-axis.
         *
         * @param {Number} angle The angle, in radians, of the rotation.  Positive angles are counterclockwise.
         * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
         * @returns {Matrix3} The modified result parameter, or a new Matrix3 instance if one was not provided.
         *
         * @example
         * // Rotate a point 45 degrees counterclockwise around the z-axis.
         * var p = new Cesium.Cartesian3(5, 6, 7);
         * var m = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(45.0));
         * var rotated = Cesium.Matrix3.multiplyByVector(m, p, new Cesium.Cartesian3());
         */
        Matrix3.fromRotationZ = function(angle, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.number('angle', angle);
            //>>includeEnd('debug');

            var cosAngle = Math.cos(angle);
            var sinAngle = Math.sin(angle);

            if (!when.defined(result)) {
                return new Matrix3(
                    cosAngle, -sinAngle, 0.0,
                    sinAngle, cosAngle, 0.0,
                    0.0, 0.0, 1.0);
            }

            result[0] = cosAngle;
            result[1] = sinAngle;
            result[2] = 0.0;
            result[3] = -sinAngle;
            result[4] = cosAngle;
            result[5] = 0.0;
            result[6] = 0.0;
            result[7] = 0.0;
            result[8] = 1.0;

            return result;
        };

        /**
         * Creates an Array from the provided Matrix3 instance.
         * The array will be in column-major order.
         *
         * @param {Matrix3} matrix The matrix to use..
         * @param {Number[]} [result] The Array onto which to store the result.
         * @returns {Number[]} The modified Array parameter or a new Array instance if one was not provided.
         */
        Matrix3.toArray = function(matrix, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            //>>includeEnd('debug');

            if (!when.defined(result)) {
                return [matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5], matrix[6], matrix[7], matrix[8]];
            }
            result[0] = matrix[0];
            result[1] = matrix[1];
            result[2] = matrix[2];
            result[3] = matrix[3];
            result[4] = matrix[4];
            result[5] = matrix[5];
            result[6] = matrix[6];
            result[7] = matrix[7];
            result[8] = matrix[8];
            return result;
        };

        /**
         * Computes the array index of the element at the provided row and column.
         *
         * @param {Number} row The zero-based index of the row.
         * @param {Number} column The zero-based index of the column.
         * @returns {Number} The index of the element at the provided row and column.
         *
         * @exception {DeveloperError} row must be 0, 1, or 2.
         * @exception {DeveloperError} column must be 0, 1, or 2.
         *
         * @example
         * var myMatrix = new Cesium.Matrix3();
         * var column1Row0Index = Cesium.Matrix3.getElementIndex(1, 0);
         * var column1Row0 = myMatrix[column1Row0Index]
         * myMatrix[column1Row0Index] = 10.0;
         */
        Matrix3.getElementIndex = function(column, row) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.number.greaterThanOrEquals('row', row, 0);
            Check.Check.typeOf.number.lessThanOrEquals('row', row, 2);
            Check.Check.typeOf.number.greaterThanOrEquals('column', column, 0);
            Check.Check.typeOf.number.lessThanOrEquals('column', column, 2);
            //>>includeEnd('debug');

            return column * 3 + row;
        };

        /**
         * Retrieves a copy of the matrix column at the provided index as a Cartesian3 instance.
         *
         * @param {Matrix3} matrix The matrix to use.
         * @param {Number} index The zero-based index of the column to retrieve.
         * @param {Cartesian3} result The object onto which to store the result.
         * @returns {Cartesian3} The modified result parameter.
         *
         * @exception {DeveloperError} index must be 0, 1, or 2.
         */
        Matrix3.getColumn = function(matrix, index, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.number.greaterThanOrEquals('index', index, 0);
            Check.Check.typeOf.number.lessThanOrEquals('index', index, 2);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var startIndex = index * 3;
            var x = matrix[startIndex];
            var y = matrix[startIndex + 1];
            var z = matrix[startIndex + 2];

            result.x = x;
            result.y = y;
            result.z = z;
            return result;
        };

        /**
         * Computes a new matrix that replaces the specified column in the provided matrix with the provided Cartesian3 instance.
         *
         * @param {Matrix3} matrix The matrix to use.
         * @param {Number} index The zero-based index of the column to set.
         * @param {Cartesian3} cartesian The Cartesian whose values will be assigned to the specified column.
         * @param {Matrix3} result The object onto which to store the result.
         * @returns {Matrix3} The modified result parameter.
         *
         * @exception {DeveloperError} index must be 0, 1, or 2.
         */
        Matrix3.setColumn = function(matrix, index, cartesian, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.number.greaterThanOrEquals('index', index, 0);
            Check.Check.typeOf.number.lessThanOrEquals('index', index, 2);
            Check.Check.typeOf.object('cartesian', cartesian);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result = Matrix3.clone(matrix, result);
            var startIndex = index * 3;
            result[startIndex] = cartesian.x;
            result[startIndex + 1] = cartesian.y;
            result[startIndex + 2] = cartesian.z;
            return result;
        };

        /**
         * Retrieves a copy of the matrix row at the provided index as a Cartesian3 instance.
         *
         * @param {Matrix3} matrix The matrix to use.
         * @param {Number} index The zero-based index of the row to retrieve.
         * @param {Cartesian3} result The object onto which to store the result.
         * @returns {Cartesian3} The modified result parameter.
         *
         * @exception {DeveloperError} index must be 0, 1, or 2.
         */
        Matrix3.getRow = function(matrix, index, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.number.greaterThanOrEquals('index', index, 0);
            Check.Check.typeOf.number.lessThanOrEquals('index', index, 2);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var x = matrix[index];
            var y = matrix[index + 3];
            var z = matrix[index + 6];

            result.x = x;
            result.y = y;
            result.z = z;
            return result;
        };

        /**
         * Computes a new matrix that replaces the specified row in the provided matrix with the provided Cartesian3 instance.
         *
         * @param {Matrix3} matrix The matrix to use.
         * @param {Number} index The zero-based index of the row to set.
         * @param {Cartesian3} cartesian The Cartesian whose values will be assigned to the specified row.
         * @param {Matrix3} result The object onto which to store the result.
         * @returns {Matrix3} The modified result parameter.
         *
         * @exception {DeveloperError} index must be 0, 1, or 2.
         */
        Matrix3.setRow = function(matrix, index, cartesian, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.number.greaterThanOrEquals('index', index, 0);
            Check.Check.typeOf.number.lessThanOrEquals('index', index, 2);
            Check.Check.typeOf.object('cartesian', cartesian);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result = Matrix3.clone(matrix, result);
            result[index] = cartesian.x;
            result[index + 3] = cartesian.y;
            result[index + 6] = cartesian.z;
            return result;
        };

        var scratchColumn = new Cartographic.Cartesian3();

        /**
         * Extracts the non-uniform scale assuming the matrix is an affine transformation.
         *
         * @param {Matrix3} matrix The matrix.
         * @param {Cartesian3} result The object onto which to store the result.
         * @returns {Cartesian3} The modified result parameter.
         */
        Matrix3.getScale = function(matrix, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result.x = Cartographic.Cartesian3.magnitude(Cartographic.Cartesian3.fromElements(matrix[0], matrix[1], matrix[2], scratchColumn));
            result.y = Cartographic.Cartesian3.magnitude(Cartographic.Cartesian3.fromElements(matrix[3], matrix[4], matrix[5], scratchColumn));
            result.z = Cartographic.Cartesian3.magnitude(Cartographic.Cartesian3.fromElements(matrix[6], matrix[7], matrix[8], scratchColumn));
            return result;
        };

        var scratchScale = new Cartographic.Cartesian3();

        /**
         * Computes the maximum scale assuming the matrix is an affine transformation.
         * The maximum scale is the maximum length of the column vectors.
         *
         * @param {Matrix3} matrix The matrix.
         * @returns {Number} The maximum scale.
         */
        Matrix3.getMaximumScale = function(matrix) {
            Matrix3.getScale(matrix, scratchScale);
            return Cartographic.Cartesian3.maximumComponent(scratchScale);
        };

        /**
         * Computes the product of two matrices.
         *
         * @param {Matrix3} left The first matrix.
         * @param {Matrix3} right The second matrix.
         * @param {Matrix3} result The object onto which to store the result.
         * @returns {Matrix3} The modified result parameter.
         */
        Matrix3.multiply = function(left, right, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('left', left);
            Check.Check.typeOf.object('right', right);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var column0Row0 = left[0] * right[0] + left[3] * right[1] + left[6] * right[2];
            var column0Row1 = left[1] * right[0] + left[4] * right[1] + left[7] * right[2];
            var column0Row2 = left[2] * right[0] + left[5] * right[1] + left[8] * right[2];

            var column1Row0 = left[0] * right[3] + left[3] * right[4] + left[6] * right[5];
            var column1Row1 = left[1] * right[3] + left[4] * right[4] + left[7] * right[5];
            var column1Row2 = left[2] * right[3] + left[5] * right[4] + left[8] * right[5];

            var column2Row0 = left[0] * right[6] + left[3] * right[7] + left[6] * right[8];
            var column2Row1 = left[1] * right[6] + left[4] * right[7] + left[7] * right[8];
            var column2Row2 = left[2] * right[6] + left[5] * right[7] + left[8] * right[8];

            result[0] = column0Row0;
            result[1] = column0Row1;
            result[2] = column0Row2;
            result[3] = column1Row0;
            result[4] = column1Row1;
            result[5] = column1Row2;
            result[6] = column2Row0;
            result[7] = column2Row1;
            result[8] = column2Row2;
            return result;
        };

        /**
         * Computes the sum of two matrices.
         *
         * @param {Matrix3} left The first matrix.
         * @param {Matrix3} right The second matrix.
         * @param {Matrix3} result The object onto which to store the result.
         * @returns {Matrix3} The modified result parameter.
         */
        Matrix3.add = function(left, right, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('left', left);
            Check.Check.typeOf.object('right', right);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result[0] = left[0] + right[0];
            result[1] = left[1] + right[1];
            result[2] = left[2] + right[2];
            result[3] = left[3] + right[3];
            result[4] = left[4] + right[4];
            result[5] = left[5] + right[5];
            result[6] = left[6] + right[6];
            result[7] = left[7] + right[7];
            result[8] = left[8] + right[8];
            return result;
        };

        /**
         * Computes the difference of two matrices.
         *
         * @param {Matrix3} left The first matrix.
         * @param {Matrix3} right The second matrix.
         * @param {Matrix3} result The object onto which to store the result.
         * @returns {Matrix3} The modified result parameter.
         */
        Matrix3.subtract = function(left, right, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('left', left);
            Check.Check.typeOf.object('right', right);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result[0] = left[0] - right[0];
            result[1] = left[1] - right[1];
            result[2] = left[2] - right[2];
            result[3] = left[3] - right[3];
            result[4] = left[4] - right[4];
            result[5] = left[5] - right[5];
            result[6] = left[6] - right[6];
            result[7] = left[7] - right[7];
            result[8] = left[8] - right[8];
            return result;
        };

        /**
         * Computes the product of a matrix and a column vector.
         *
         * @param {Matrix3} matrix The matrix.
         * @param {Cartesian3} cartesian The column.
         * @param {Cartesian3} result The object onto which to store the result.
         * @returns {Cartesian3} The modified result parameter.
         */
        Matrix3.multiplyByVector = function(matrix, cartesian, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.object('cartesian', cartesian);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var vX = cartesian.x;
            var vY = cartesian.y;
            var vZ = cartesian.z;

            var x = matrix[0] * vX + matrix[3] * vY + matrix[6] * vZ;
            var y = matrix[1] * vX + matrix[4] * vY + matrix[7] * vZ;
            var z = matrix[2] * vX + matrix[5] * vY + matrix[8] * vZ;

            result.x = x;
            result.y = y;
            result.z = z;
            return result;
        };

        /**
         * Computes the product of a matrix and a scalar.
         *
         * @param {Matrix3} matrix The matrix.
         * @param {Number} scalar The number to multiply by.
         * @param {Matrix3} result The object onto which to store the result.
         * @returns {Matrix3} The modified result parameter.
         */
        Matrix3.multiplyByScalar = function(matrix, scalar, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.number('scalar', scalar);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result[0] = matrix[0] * scalar;
            result[1] = matrix[1] * scalar;
            result[2] = matrix[2] * scalar;
            result[3] = matrix[3] * scalar;
            result[4] = matrix[4] * scalar;
            result[5] = matrix[5] * scalar;
            result[6] = matrix[6] * scalar;
            result[7] = matrix[7] * scalar;
            result[8] = matrix[8] * scalar;
            return result;
        };

        /**
         * Computes the product of a matrix times a (non-uniform) scale, as if the scale were a scale matrix.
         *
         * @param {Matrix3} matrix The matrix on the left-hand side.
         * @param {Cartesian3} scale The non-uniform scale on the right-hand side.
         * @param {Matrix3} result The object onto which to store the result.
         * @returns {Matrix3} The modified result parameter.
         *
         *
         * @example
         * // Instead of Cesium.Matrix3.multiply(m, Cesium.Matrix3.fromScale(scale), m);
         * Cesium.Matrix3.multiplyByScale(m, scale, m);
         *
         * @see Matrix3.fromScale
         * @see Matrix3.multiplyByUniformScale
         */
        Matrix3.multiplyByScale = function(matrix, scale, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.object('scale', scale);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result[0] = matrix[0] * scale.x;
            result[1] = matrix[1] * scale.x;
            result[2] = matrix[2] * scale.x;
            result[3] = matrix[3] * scale.y;
            result[4] = matrix[4] * scale.y;
            result[5] = matrix[5] * scale.y;
            result[6] = matrix[6] * scale.z;
            result[7] = matrix[7] * scale.z;
            result[8] = matrix[8] * scale.z;
            return result;
        };

        /**
         * Creates a negated copy of the provided matrix.
         *
         * @param {Matrix3} matrix The matrix to negate.
         * @param {Matrix3} result The object onto which to store the result.
         * @returns {Matrix3} The modified result parameter.
         */
        Matrix3.negate = function(matrix, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result[0] = -matrix[0];
            result[1] = -matrix[1];
            result[2] = -matrix[2];
            result[3] = -matrix[3];
            result[4] = -matrix[4];
            result[5] = -matrix[5];
            result[6] = -matrix[6];
            result[7] = -matrix[7];
            result[8] = -matrix[8];
            return result;
        };

        /**
         * Computes the transpose of the provided matrix.
         *
         * @param {Matrix3} matrix The matrix to transpose.
         * @param {Matrix3} result The object onto which to store the result.
         * @returns {Matrix3} The modified result parameter.
         */
        Matrix3.transpose = function(matrix, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var column0Row0 = matrix[0];
            var column0Row1 = matrix[3];
            var column0Row2 = matrix[6];
            var column1Row0 = matrix[1];
            var column1Row1 = matrix[4];
            var column1Row2 = matrix[7];
            var column2Row0 = matrix[2];
            var column2Row1 = matrix[5];
            var column2Row2 = matrix[8];

            result[0] = column0Row0;
            result[1] = column0Row1;
            result[2] = column0Row2;
            result[3] = column1Row0;
            result[4] = column1Row1;
            result[5] = column1Row2;
            result[6] = column2Row0;
            result[7] = column2Row1;
            result[8] = column2Row2;
            return result;
        };

        var UNIT = new Cartographic.Cartesian3(1, 1, 1);

        /**
         * Extracts the rotation assuming the matrix is an affine transformation.
         *
         * @param {Matrix3} matrix The matrix.
         * @param {Matrix3} result The object onto which to store the result.
         * @returns {Matrix3} The modified result parameter
         */
        Matrix3.getRotation = function(matrix, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var inverseScale = Cartographic.Cartesian3.divideComponents(UNIT, Matrix3.getScale(matrix, scratchScale), scratchScale);
            result = Matrix3.multiplyByScale(matrix, inverseScale, result);

            return result;
        };

        function computeFrobeniusNorm(matrix) {
            var norm = 0.0;
            for (var i = 0; i < 9; ++i) {
                var temp = matrix[i];
                norm += temp * temp;
            }

            return Math.sqrt(norm);
        }

        var rowVal = [1, 0, 0];
        var colVal = [2, 2, 1];

        function offDiagonalFrobeniusNorm(matrix) {
            // Computes the "off-diagonal" Frobenius norm.
            // Assumes matrix is symmetric.

            var norm = 0.0;
            for (var i = 0; i < 3; ++i) {
                var temp = matrix[Matrix3.getElementIndex(colVal[i], rowVal[i])];
                norm += 2.0 * temp * temp;
            }

            return Math.sqrt(norm);
        }

        function shurDecomposition(matrix, result) {
            // This routine was created based upon Matrix Computations, 3rd ed., by Golub and Van Loan,
            // section 8.4.2 The 2by2 Symmetric Schur Decomposition.
            //
            // The routine takes a matrix, which is assumed to be symmetric, and
            // finds the largest off-diagonal term, and then creates
            // a matrix (result) which can be used to help reduce it

            var tolerance = _Math.CesiumMath.EPSILON15;

            var maxDiagonal = 0.0;
            var rotAxis = 1;

            // find pivot (rotAxis) based on max diagonal of matrix
            for (var i = 0; i < 3; ++i) {
                var temp = Math.abs(matrix[Matrix3.getElementIndex(colVal[i], rowVal[i])]);
                if (temp > maxDiagonal) {
                    rotAxis = i;
                    maxDiagonal = temp;
                }
            }

            var c = 1.0;
            var s = 0.0;

            var p = rowVal[rotAxis];
            var q = colVal[rotAxis];

            if (Math.abs(matrix[Matrix3.getElementIndex(q, p)]) > tolerance) {
                var qq = matrix[Matrix3.getElementIndex(q, q)];
                var pp = matrix[Matrix3.getElementIndex(p, p)];
                var qp = matrix[Matrix3.getElementIndex(q, p)];

                var tau = (qq - pp) / 2.0 / qp;
                var t;

                if (tau < 0.0) {
                    t = -1.0 / (-tau + Math.sqrt(1.0 + tau * tau));
                } else {
                    t = 1.0 / (tau + Math.sqrt(1.0 + tau * tau));
                }

                c = 1.0 / Math.sqrt(1.0 + t * t);
                s = t * c;
            }

            result = Matrix3.clone(Matrix3.IDENTITY, result);

            result[Matrix3.getElementIndex(p, p)] = result[Matrix3.getElementIndex(q, q)] = c;
            result[Matrix3.getElementIndex(q, p)] = s;
            result[Matrix3.getElementIndex(p, q)] = -s;

            return result;
        }

        var jMatrix = new Matrix3();
        var jMatrixTranspose = new Matrix3();

        /**
         * Computes the eigenvectors and eigenvalues of a symmetric matrix.
         * <p>
         * Returns a diagonal matrix and unitary matrix such that:
         * <code>matrix = unitary matrix * diagonal matrix * transpose(unitary matrix)</code>
         * </p>
         * <p>
         * The values along the diagonal of the diagonal matrix are the eigenvalues. The columns
         * of the unitary matrix are the corresponding eigenvectors.
         * </p>
         *
         * @param {Matrix3} matrix The matrix to decompose into diagonal and unitary matrix. Expected to be symmetric.
         * @param {Object} [result] An object with unitary and diagonal properties which are matrices onto which to store the result.
         * @returns {Object} An object with unitary and diagonal properties which are the unitary and diagonal matrices, respectively.
         *
         * @example
         * var a = //... symetric matrix
         * var result = {
         *     unitary : new Cesium.Matrix3(),
         *     diagonal : new Cesium.Matrix3()
         * };
         * Cesium.Matrix3.computeEigenDecomposition(a, result);
         *
         * var unitaryTranspose = Cesium.Matrix3.transpose(result.unitary, new Cesium.Matrix3());
         * var b = Cesium.Matrix3.multiply(result.unitary, result.diagonal, new Cesium.Matrix3());
         * Cesium.Matrix3.multiply(b, unitaryTranspose, b); // b is now equal to a
         *
         * var lambda = Cesium.Matrix3.getColumn(result.diagonal, 0, new Cesium.Cartesian3()).x;  // first eigenvalue
         * var v = Cesium.Matrix3.getColumn(result.unitary, 0, new Cesium.Cartesian3());          // first eigenvector
         * var c = Cesium.Cartesian3.multiplyByScalar(v, lambda, new Cesium.Cartesian3());        // equal to Cesium.Matrix3.multiplyByVector(a, v)
         */
        Matrix3.computeEigenDecomposition = function(matrix, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            //>>includeEnd('debug');

            // This routine was created based upon Matrix Computations, 3rd ed., by Golub and Van Loan,
            // section 8.4.3 The Classical Jacobi Algorithm

            var tolerance = _Math.CesiumMath.EPSILON20;
            var maxSweeps = 10;

            var count = 0;
            var sweep = 0;

            if (!when.defined(result)) {
                result = {};
            }

            var unitaryMatrix = result.unitary = Matrix3.clone(Matrix3.IDENTITY, result.unitary);
            var diagMatrix = result.diagonal = Matrix3.clone(matrix, result.diagonal);

            var epsilon = tolerance * computeFrobeniusNorm(diagMatrix);

            while (sweep < maxSweeps && offDiagonalFrobeniusNorm(diagMatrix) > epsilon) {
                shurDecomposition(diagMatrix, jMatrix);
                Matrix3.transpose(jMatrix, jMatrixTranspose);
                Matrix3.multiply(diagMatrix, jMatrix, diagMatrix);
                Matrix3.multiply(jMatrixTranspose, diagMatrix, diagMatrix);
                Matrix3.multiply(unitaryMatrix, jMatrix, unitaryMatrix);

                if (++count > 2) {
                    ++sweep;
                    count = 0;
                }
            }

            return result;
        };

        /**
         * Computes a matrix, which contains the absolute (unsigned) values of the provided matrix's elements.
         *
         * @param {Matrix3} matrix The matrix with signed elements.
         * @param {Matrix3} result The object onto which to store the result.
         * @returns {Matrix3} The modified result parameter.
         */
        Matrix3.abs = function(matrix, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result[0] = Math.abs(matrix[0]);
            result[1] = Math.abs(matrix[1]);
            result[2] = Math.abs(matrix[2]);
            result[3] = Math.abs(matrix[3]);
            result[4] = Math.abs(matrix[4]);
            result[5] = Math.abs(matrix[5]);
            result[6] = Math.abs(matrix[6]);
            result[7] = Math.abs(matrix[7]);
            result[8] = Math.abs(matrix[8]);

            return result;
        };

        /**
         * Computes the determinant of the provided matrix.
         *
         * @param {Matrix3} matrix The matrix to use.
         * @returns {Number} The value of the determinant of the matrix.
         */
        Matrix3.determinant = function(matrix) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            //>>includeEnd('debug');

            var m11 = matrix[0];
            var m21 = matrix[3];
            var m31 = matrix[6];
            var m12 = matrix[1];
            var m22 = matrix[4];
            var m32 = matrix[7];
            var m13 = matrix[2];
            var m23 = matrix[5];
            var m33 = matrix[8];

            return m11 * (m22 * m33 - m23 * m32) + m12 * (m23 * m31 - m21 * m33) + m13 * (m21 * m32 - m22 * m31);
        };

        /**
         * Computes the inverse of the provided matrix.
         *
         * @param {Matrix3} matrix The matrix to invert.
         * @param {Matrix3} result The object onto which to store the result.
         * @returns {Matrix3} The modified result parameter.
         *
         * @exception {DeveloperError} matrix is not invertible.
         */
        Matrix3.inverse = function(matrix, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var m11 = matrix[0];
            var m21 = matrix[1];
            var m31 = matrix[2];
            var m12 = matrix[3];
            var m22 = matrix[4];
            var m32 = matrix[5];
            var m13 = matrix[6];
            var m23 = matrix[7];
            var m33 = matrix[8];

            var determinant = Matrix3.determinant(matrix);

            //>>includeStart('debug', pragmas.debug);
            if (Math.abs(determinant) <= _Math.CesiumMath.EPSILON15) {
                throw new Check.DeveloperError('matrix is not invertible');
            }
            //>>includeEnd('debug');

            result[0] = m22 * m33 - m23 * m32;
            result[1] = m23 * m31 - m21 * m33;
            result[2] = m21 * m32 - m22 * m31;
            result[3] = m13 * m32 - m12 * m33;
            result[4] = m11 * m33 - m13 * m31;
            result[5] = m12 * m31 - m11 * m32;
            result[6] = m12 * m23 - m13 * m22;
            result[7] = m13 * m21 - m11 * m23;
            result[8] = m11 * m22 - m12 * m21;

           var scale = 1.0 / determinant;
           return Matrix3.multiplyByScalar(result, scale, result);
        };

        /**
         * Compares the provided matrices componentwise and returns
         * <code>true</code> if they are equal, <code>false</code> otherwise.
         *
         * @param {Matrix3} [left] The first matrix.
         * @param {Matrix3} [right] The second matrix.
         * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
         */
        Matrix3.equals = function(left, right) {
            return (left === right) ||
                   (when.defined(left) &&
                    when.defined(right) &&
                    left[0] === right[0] &&
                    left[1] === right[1] &&
                    left[2] === right[2] &&
                    left[3] === right[3] &&
                    left[4] === right[4] &&
                    left[5] === right[5] &&
                    left[6] === right[6] &&
                    left[7] === right[7] &&
                    left[8] === right[8]);
        };

        /**
         * Compares the provided matrices componentwise and returns
         * <code>true</code> if they are within the provided epsilon,
         * <code>false</code> otherwise.
         *
         * @param {Matrix3} [left] The first matrix.
         * @param {Matrix3} [right] The second matrix.
         * @param {Number} epsilon The epsilon to use for equality testing.
         * @returns {Boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
         */
        Matrix3.equalsEpsilon = function(left, right, epsilon) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.number('epsilon', epsilon);
            //>>includeEnd('debug');

            return (left === right) ||
                    (when.defined(left) &&
                    when.defined(right) &&
                    Math.abs(left[0] - right[0]) <= epsilon &&
                    Math.abs(left[1] - right[1]) <= epsilon &&
                    Math.abs(left[2] - right[2]) <= epsilon &&
                    Math.abs(left[3] - right[3]) <= epsilon &&
                    Math.abs(left[4] - right[4]) <= epsilon &&
                    Math.abs(left[5] - right[5]) <= epsilon &&
                    Math.abs(left[6] - right[6]) <= epsilon &&
                    Math.abs(left[7] - right[7]) <= epsilon &&
                    Math.abs(left[8] - right[8]) <= epsilon);
        };

        /**
         * An immutable Matrix3 instance initialized to the identity matrix.
         *
         * @type {Matrix3}
         * @constant
         */
        Matrix3.IDENTITY = Object.freeze(new Matrix3(1.0, 0.0, 0.0,
                                                    0.0, 1.0, 0.0,
                                                    0.0, 0.0, 1.0));

        /**
         * An immutable Matrix3 instance initialized to the zero matrix.
         *
         * @type {Matrix3}
         * @constant
         */
        Matrix3.ZERO = Object.freeze(new Matrix3(0.0, 0.0, 0.0,
                                                0.0, 0.0, 0.0,
                                                0.0, 0.0, 0.0));

        /**
         * The index into Matrix3 for column 0, row 0.
         *
         * @type {Number}
         * @constant
         */
        Matrix3.COLUMN0ROW0 = 0;

        /**
         * The index into Matrix3 for column 0, row 1.
         *
         * @type {Number}
         * @constant
         */
        Matrix3.COLUMN0ROW1 = 1;

        /**
         * The index into Matrix3 for column 0, row 2.
         *
         * @type {Number}
         * @constant
         */
        Matrix3.COLUMN0ROW2 = 2;

        /**
         * The index into Matrix3 for column 1, row 0.
         *
         * @type {Number}
         * @constant
         */
        Matrix3.COLUMN1ROW0 = 3;

        /**
         * The index into Matrix3 for column 1, row 1.
         *
         * @type {Number}
         * @constant
         */
        Matrix3.COLUMN1ROW1 = 4;

        /**
         * The index into Matrix3 for column 1, row 2.
         *
         * @type {Number}
         * @constant
         */
        Matrix3.COLUMN1ROW2 = 5;

        /**
         * The index into Matrix3 for column 2, row 0.
         *
         * @type {Number}
         * @constant
         */
        Matrix3.COLUMN2ROW0 = 6;

        /**
         * The index into Matrix3 for column 2, row 1.
         *
         * @type {Number}
         * @constant
         */
        Matrix3.COLUMN2ROW1 = 7;

        /**
         * The index into Matrix3 for column 2, row 2.
         *
         * @type {Number}
         * @constant
         */
        Matrix3.COLUMN2ROW2 = 8;

        Object.defineProperties(Matrix3.prototype, {
            /**
             * Gets the number of items in the collection.
             * @memberof Matrix3.prototype
             *
             * @type {Number}
             */
            length : {
                get : function() {
                    return Matrix3.packedLength;
                }
            }
        });

        /**
         * Duplicates the provided Matrix3 instance.
         *
         * @param {Matrix3} [result] The object onto which to store the result.
         * @returns {Matrix3} The modified result parameter or a new Matrix3 instance if one was not provided.
         */
        Matrix3.prototype.clone = function(result) {
            return Matrix3.clone(this, result);
        };

        /**
         * Compares this matrix to the provided matrix componentwise and returns
         * <code>true</code> if they are equal, <code>false</code> otherwise.
         *
         * @param {Matrix3} [right] The right hand side matrix.
         * @returns {Boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
         */
        Matrix3.prototype.equals = function(right) {
            return Matrix3.equals(this, right);
        };

        /**
         * @private
         */
        Matrix3.equalsArray = function(matrix, array, offset) {
            return matrix[0] === array[offset] &&
                   matrix[1] === array[offset + 1] &&
                   matrix[2] === array[offset + 2] &&
                   matrix[3] === array[offset + 3] &&
                   matrix[4] === array[offset + 4] &&
                   matrix[5] === array[offset + 5] &&
                   matrix[6] === array[offset + 6] &&
                   matrix[7] === array[offset + 7] &&
                   matrix[8] === array[offset + 8];
        };

        /**
         * Compares this matrix to the provided matrix componentwise and returns
         * <code>true</code> if they are within the provided epsilon,
         * <code>false</code> otherwise.
         *
         * @param {Matrix3} [right] The right hand side matrix.
         * @param {Number} epsilon The epsilon to use for equality testing.
         * @returns {Boolean} <code>true</code> if they are within the provided epsilon, <code>false</code> otherwise.
         */
        Matrix3.prototype.equalsEpsilon = function(right, epsilon) {
            return Matrix3.equalsEpsilon(this, right, epsilon);
        };

        /**
         * Creates a string representing this Matrix with each row being
         * on a separate line and in the format '(column0, column1, column2)'.
         *
         * @returns {String} A string representing the provided Matrix with each row being on a separate line and in the format '(column0, column1, column2)'.
         */
        Matrix3.prototype.toString = function() {
            return '(' + this[0] + ', ' + this[3] + ', ' + this[6] + ')\n' +
                   '(' + this[1] + ', ' + this[4] + ', ' + this[7] + ')\n' +
                   '(' + this[2] + ', ' + this[5] + ', ' + this[8] + ')';
        };

    /**
     * A 4x4 matrix, indexable as a column-major order array.
     * Constructor parameters are in row-major order for code readability.
     * @alias Matrix4
     * @constructor
     *
     * @param {Number} [column0Row0=0.0] The value for column 0, row 0.
     * @param {Number} [column1Row0=0.0] The value for column 1, row 0.
     * @param {Number} [column2Row0=0.0] The value for column 2, row 0.
     * @param {Number} [column3Row0=0.0] The value for column 3, row 0.
     * @param {Number} [column0Row1=0.0] The value for column 0, row 1.
     * @param {Number} [column1Row1=0.0] The value for column 1, row 1.
     * @param {Number} [column2Row1=0.0] The value for column 2, row 1.
     * @param {Number} [column3Row1=0.0] The value for column 3, row 1.
     * @param {Number} [column0Row2=0.0] The value for column 0, row 2.
     * @param {Number} [column1Row2=0.0] The value for column 1, row 2.
     * @param {Number} [column2Row2=0.0] The value for column 2, row 2.
     * @param {Number} [column3Row2=0.0] The value for column 3, row 2.
     * @param {Number} [column0Row3=0.0] The value for column 0, row 3.
     * @param {Number} [column1Row3=0.0] The value for column 1, row 3.
     * @param {Number} [column2Row3=0.0] The value for column 2, row 3.
     * @param {Number} [column3Row3=0.0] The value for column 3, row 3.
     *
     * @see Matrix4.fromColumnMajorArray
     * @see Matrix4.fromRowMajorArray
     * @see Matrix4.fromRotationTranslation
     * @see Matrix4.fromTranslationRotationScale
     * @see Matrix4.fromTranslationQuaternionRotationScale
     * @see Matrix4.fromTranslation
     * @see Matrix4.fromScale
     * @see Matrix4.fromUniformScale
     * @see Matrix4.fromCamera
     * @see Matrix4.computePerspectiveFieldOfView
     * @see Matrix4.computeOrthographicOffCenter
     * @see Matrix4.computePerspectiveOffCenter
     * @see Matrix4.computeInfinitePerspectiveOffCenter
     * @see Matrix4.computeViewportTransformation
     * @see Matrix4.computeView
     * @see Matrix2
     * @see Matrix3
     * @see Packable
     */
    function Matrix4(column0Row0, column1Row0, column2Row0, column3Row0,
                           column0Row1, column1Row1, column2Row1, column3Row1,
                           column0Row2, column1Row2, column2Row2, column3Row2,
                           column0Row3, column1Row3, column2Row3, column3Row3) {
        this[0] = when.defaultValue(column0Row0, 0.0);
        this[1] = when.defaultValue(column0Row1, 0.0);
        this[2] = when.defaultValue(column0Row2, 0.0);
        this[3] = when.defaultValue(column0Row3, 0.0);
        this[4] = when.defaultValue(column1Row0, 0.0);
        this[5] = when.defaultValue(column1Row1, 0.0);
        this[6] = when.defaultValue(column1Row2, 0.0);
        this[7] = when.defaultValue(column1Row3, 0.0);
        this[8] = when.defaultValue(column2Row0, 0.0);
        this[9] = when.defaultValue(column2Row1, 0.0);
        this[10] = when.defaultValue(column2Row2, 0.0);
        this[11] = when.defaultValue(column2Row3, 0.0);
        this[12] = when.defaultValue(column3Row0, 0.0);
        this[13] = when.defaultValue(column3Row1, 0.0);
        this[14] = when.defaultValue(column3Row2, 0.0);
        this[15] = when.defaultValue(column3Row3, 0.0);
    }

    /**
     * The number of elements used to pack the object into an array.
     * @type {Number}
     */
    Matrix4.packedLength = 16;

    /**
     * Stores the provided instance into the provided array.
     *
     * @param {Matrix4} value The value to pack.
     * @param {Number[]} array The array to pack into.
     * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
     *
     * @returns {Number[]} The array that was packed into
     */
    Matrix4.pack = function(value, array, startingIndex) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.object('value', value);
        Check.Check.defined('array', array);
        //>>includeEnd('debug');

        startingIndex = when.defaultValue(startingIndex, 0);

        array[startingIndex++] = value[0];
        array[startingIndex++] = value[1];
        array[startingIndex++] = value[2];
        array[startingIndex++] = value[3];
        array[startingIndex++] = value[4];
        array[startingIndex++] = value[5];
        array[startingIndex++] = value[6];
        array[startingIndex++] = value[7];
        array[startingIndex++] = value[8];
        array[startingIndex++] = value[9];
        array[startingIndex++] = value[10];
        array[startingIndex++] = value[11];
        array[startingIndex++] = value[12];
        array[startingIndex++] = value[13];
        array[startingIndex++] = value[14];
        array[startingIndex] = value[15];

        return array;
    };

    /**
     * Retrieves an instance from a packed array.
     *
     * @param {Number[]} array The packed array.
     * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
     * @param {Matrix4} [result] The object into which to store the result.
     * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if one was not provided.
     */
    Matrix4.unpack = function(array, startingIndex, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.defined('array', array);
        //>>includeEnd('debug');

        startingIndex = when.defaultValue(startingIndex, 0);

        if (!when.defined(result)) {
            result = new Matrix4();
        }

        result[0] = array[startingIndex++];
        result[1] = array[startingIndex++];
        result[2] = array[startingIndex++];
        result[3] = array[startingIndex++];
        result[4] = array[startingIndex++];
        result[5] = array[startingIndex++];
        result[6] = array[startingIndex++];
        result[7] = array[startingIndex++];
        result[8] = array[startingIndex++];
        result[9] = array[startingIndex++];
        result[10] = array[startingIndex++];
        result[11] = array[startingIndex++];
        result[12] = array[startingIndex++];
        result[13] = array[startingIndex++];
        result[14] = array[startingIndex++];
        result[15] = array[startingIndex];
        return result;
    };

    /**
     * Duplicates a Matrix4 instance.
     *
     * @param {Matrix4} matrix The matrix to duplicate.
     * @param {Matrix4} [result] The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if one was not provided. (Returns undefined if matrix is undefined)
     */
    Matrix4.clone = function(matrix, result) {
        if (!when.defined(matrix)) {
            return undefined;
        }
        if (!when.defined(result)) {
            return new Matrix4(matrix[0], matrix[4], matrix[8], matrix[12],
                               matrix[1], matrix[5], matrix[9], matrix[13],
                               matrix[2], matrix[6], matrix[10], matrix[14],
                               matrix[3], matrix[7], matrix[11], matrix[15]);
        }
        result[0] = matrix[0];
        result[1] = matrix[1];
        result[2] = matrix[2];
        result[3] = matrix[3];
        result[4] = matrix[4];
        result[5] = matrix[5];
        result[6] = matrix[6];
        result[7] = matrix[7];
        result[8] = matrix[8];
        result[9] = matrix[9];
        result[10] = matrix[10];
        result[11] = matrix[11];
        result[12] = matrix[12];
        result[13] = matrix[13];
        result[14] = matrix[14];
        result[15] = matrix[15];
        return result;
    };

    /**
     * Creates a Matrix4 from 16 consecutive elements in an array.
     * @function
     *
     * @param {Number[]} array The array whose 16 consecutive elements correspond to the positions of the matrix.  Assumes column-major order.
     * @param {Number} [startingIndex=0] The offset into the array of the first element, which corresponds to first column first row position in the matrix.
     * @param {Matrix4} [result] The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if one was not provided.
     *
     * @example
     * // Create the Matrix4:
     * // [1.0, 2.0, 3.0, 4.0]
     * // [1.0, 2.0, 3.0, 4.0]
     * // [1.0, 2.0, 3.0, 4.0]
     * // [1.0, 2.0, 3.0, 4.0]
     *
     * var v = [1.0, 1.0, 1.0, 1.0, 2.0, 2.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 4.0, 4.0, 4.0, 4.0];
     * var m = Cesium.Matrix4.fromArray(v);
     *
     * // Create same Matrix4 with using an offset into an array
     * var v2 = [0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 2.0, 2.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 4.0, 4.0, 4.0, 4.0];
     * var m2 = Cesium.Matrix4.fromArray(v2, 2);
     */
    Matrix4.fromArray = Matrix4.unpack;

    /**
     * Computes a Matrix4 instance from a column-major order array.
     *
     * @param {Number[]} values The column-major order array.
     * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
     * @returns {Matrix4} The modified result parameter, or a new Matrix4 instance if one was not provided.
     */
    Matrix4.fromColumnMajorArray = function(values, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.defined('values', values);
        //>>includeEnd('debug');

        return Matrix4.clone(values, result);
    };

    /**
     * Computes a Matrix4 instance from a row-major order array.
     * The resulting matrix will be in column-major order.
     *
     * @param {Number[]} values The row-major order array.
     * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
     * @returns {Matrix4} The modified result parameter, or a new Matrix4 instance if one was not provided.
     */
    Matrix4.fromRowMajorArray = function(values, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.defined('values', values);
        //>>includeEnd('debug');

        if (!when.defined(result)) {
            return new Matrix4(values[0], values[1], values[2], values[3],
                               values[4], values[5], values[6], values[7],
                               values[8], values[9], values[10], values[11],
                               values[12], values[13], values[14], values[15]);
        }
        result[0] = values[0];
        result[1] = values[4];
        result[2] = values[8];
        result[3] = values[12];
        result[4] = values[1];
        result[5] = values[5];
        result[6] = values[9];
        result[7] = values[13];
        result[8] = values[2];
        result[9] = values[6];
        result[10] = values[10];
        result[11] = values[14];
        result[12] = values[3];
        result[13] = values[7];
        result[14] = values[11];
        result[15] = values[15];
        return result;
    };

    /**
     * Computes a Matrix4 instance from a Matrix3 representing the rotation
     * and a Cartesian3 representing the translation.
     *
     * @param {Matrix3} rotation The upper left portion of the matrix representing the rotation.
     * @param {Cartesian3} [translation=Cartesian3.ZERO] The upper right portion of the matrix representing the translation.
     * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
     * @returns {Matrix4} The modified result parameter, or a new Matrix4 instance if one was not provided.
     */
    Matrix4.fromRotationTranslation = function(rotation, translation, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.object('rotation', rotation);
        //>>includeEnd('debug');

        translation = when.defaultValue(translation, Cartographic.Cartesian3.ZERO);

        if (!when.defined(result)) {
            return new Matrix4(rotation[0], rotation[3], rotation[6], translation.x,
                               rotation[1], rotation[4], rotation[7], translation.y,
                               rotation[2], rotation[5], rotation[8], translation.z,
                                       0.0,         0.0,         0.0,           1.0);
        }

        result[0] = rotation[0];
        result[1] = rotation[1];
        result[2] = rotation[2];
        result[3] = 0.0;
        result[4] = rotation[3];
        result[5] = rotation[4];
        result[6] = rotation[5];
        result[7] = 0.0;
        result[8] = rotation[6];
        result[9] = rotation[7];
        result[10] = rotation[8];
        result[11] = 0.0;
        result[12] = translation.x;
        result[13] = translation.y;
        result[14] = translation.z;
        result[15] = 1.0;
        return result;
    };

    /**
     * Computes a Matrix4 instance from a translation, rotation, and scale (TRS)
     * representation with the rotation represented as a quaternion.
     *
     * @param {Cartesian3} translation The translation transformation.
     * @param {Quaternion} rotation The rotation transformation.
     * @param {Cartesian3} scale The non-uniform scale transformation.
     * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
     * @returns {Matrix4} The modified result parameter, or a new Matrix4 instance if one was not provided.
     *
     * @example
     * var result = Cesium.Matrix4.fromTranslationQuaternionRotationScale(
     *   new Cesium.Cartesian3(1.0, 2.0, 3.0), // translation
     *   Cesium.Quaternion.IDENTITY,           // rotation
     *   new Cesium.Cartesian3(7.0, 8.0, 9.0), // scale
     *   result);
     */
    Matrix4.fromTranslationQuaternionRotationScale = function(translation, rotation, scale, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.object('translation', translation);
        Check.Check.typeOf.object('rotation', rotation);
        Check.Check.typeOf.object('scale', scale);
        //>>includeEnd('debug');

        if (!when.defined(result)) {
            result = new Matrix4();
        }

        var scaleX = scale.x;
        var scaleY = scale.y;
        var scaleZ = scale.z;

        var x2 = rotation.x * rotation.x;
        var xy = rotation.x * rotation.y;
        var xz = rotation.x * rotation.z;
        var xw = rotation.x * rotation.w;
        var y2 = rotation.y * rotation.y;
        var yz = rotation.y * rotation.z;
        var yw = rotation.y * rotation.w;
        var z2 = rotation.z * rotation.z;
        var zw = rotation.z * rotation.w;
        var w2 = rotation.w * rotation.w;

        var m00 = x2 - y2 - z2 + w2;
        var m01 = 2.0 * (xy - zw);
        var m02 = 2.0 * (xz + yw);

        var m10 = 2.0 * (xy + zw);
        var m11 = -x2 + y2 - z2 + w2;
        var m12 = 2.0 * (yz - xw);

        var m20 = 2.0 * (xz - yw);
        var m21 = 2.0 * (yz + xw);
        var m22 = -x2 - y2 + z2 + w2;

        result[0]  = m00 * scaleX;
        result[1]  = m10 * scaleX;
        result[2]  = m20 * scaleX;
        result[3]  = 0.0;
        result[4]  = m01 * scaleY;
        result[5]  = m11 * scaleY;
        result[6]  = m21 * scaleY;
        result[7]  = 0.0;
        result[8]  = m02 * scaleZ;
        result[9]  = m12 * scaleZ;
        result[10] = m22 * scaleZ;
        result[11] = 0.0;
        result[12] = translation.x;
        result[13] = translation.y;
        result[14] = translation.z;
        result[15] = 1.0;

        return result;
    };

    /**
     * Creates a Matrix4 instance from a {@link TranslationRotationScale} instance.
     *
     * @param {TranslationRotationScale} translationRotationScale The instance.
     * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
     * @returns {Matrix4} The modified result parameter, or a new Matrix4 instance if one was not provided.
     */
    Matrix4.fromTranslationRotationScale = function(translationRotationScale, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.object('translationRotationScale', translationRotationScale);
        //>>includeEnd('debug');

        return Matrix4.fromTranslationQuaternionRotationScale(translationRotationScale.translation, translationRotationScale.rotation, translationRotationScale.scale, result);
    };

    /**
     * Creates a Matrix4 instance from a Cartesian3 representing the translation.
     *
     * @param {Cartesian3} translation The upper right portion of the matrix representing the translation.
     * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
     * @returns {Matrix4} The modified result parameter, or a new Matrix4 instance if one was not provided.
     *
     * @see Matrix4.multiplyByTranslation
     */
    Matrix4.fromTranslation = function(translation, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.object('translation', translation);
        //>>includeEnd('debug');

        return Matrix4.fromRotationTranslation(Matrix3.IDENTITY, translation, result);
    };

    /**
     * Computes a Matrix4 instance representing a non-uniform scale.
     *
     * @param {Cartesian3} scale The x, y, and z scale factors.
     * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
     * @returns {Matrix4} The modified result parameter, or a new Matrix4 instance if one was not provided.
     *
     * @example
     * // Creates
     * //   [7.0, 0.0, 0.0, 0.0]
     * //   [0.0, 8.0, 0.0, 0.0]
     * //   [0.0, 0.0, 9.0, 0.0]
     * //   [0.0, 0.0, 0.0, 1.0]
     * var m = Cesium.Matrix4.fromScale(new Cesium.Cartesian3(7.0, 8.0, 9.0));
     */
    Matrix4.fromScale = function(scale, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.object('scale', scale);
        //>>includeEnd('debug');

        if (!when.defined(result)) {
            return new Matrix4(
                scale.x, 0.0,     0.0,     0.0,
                0.0,     scale.y, 0.0,     0.0,
                0.0,     0.0,     scale.z, 0.0,
                0.0,     0.0,     0.0,     1.0);
        }

        result[0] = scale.x;
        result[1] = 0.0;
        result[2] = 0.0;
        result[3] = 0.0;
        result[4] = 0.0;
        result[5] = scale.y;
        result[6] = 0.0;
        result[7] = 0.0;
        result[8] = 0.0;
        result[9] = 0.0;
        result[10] = scale.z;
        result[11] = 0.0;
        result[12] = 0.0;
        result[13] = 0.0;
        result[14] = 0.0;
        result[15] = 1.0;
        return result;
    };

    /**
     * Computes a Matrix4 instance representing a uniform scale.
     *
     * @param {Number} scale The uniform scale factor.
     * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
     * @returns {Matrix4} The modified result parameter, or a new Matrix4 instance if one was not provided.
     *
     * @example
     * // Creates
     * //   [2.0, 0.0, 0.0, 0.0]
     * //   [0.0, 2.0, 0.0, 0.0]
     * //   [0.0, 0.0, 2.0, 0.0]
     * //   [0.0, 0.0, 0.0, 1.0]
     * var m = Cesium.Matrix4.fromUniformScale(2.0);
     */
    Matrix4.fromUniformScale = function(scale, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.number('scale', scale);
        //>>includeEnd('debug');

        if (!when.defined(result)) {
            return new Matrix4(scale, 0.0,   0.0,   0.0,
                               0.0,   scale, 0.0,   0.0,
                               0.0,   0.0,   scale, 0.0,
                               0.0,   0.0,   0.0,   1.0);
        }

        result[0] = scale;
        result[1] = 0.0;
        result[2] = 0.0;
        result[3] = 0.0;
        result[4] = 0.0;
        result[5] = scale;
        result[6] = 0.0;
        result[7] = 0.0;
        result[8] = 0.0;
        result[9] = 0.0;
        result[10] = scale;
        result[11] = 0.0;
        result[12] = 0.0;
        result[13] = 0.0;
        result[14] = 0.0;
        result[15] = 1.0;
        return result;
    };

    var fromCameraF = new Cartographic.Cartesian3();
    var fromCameraR = new Cartographic.Cartesian3();
    var fromCameraU = new Cartographic.Cartesian3();

    /**
     * Computes a Matrix4 instance from a Camera.
     *
     * @param {Camera} camera The camera to use.
     * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
     * @returns {Matrix4} The modified result parameter, or a new Matrix4 instance if one was not provided.
     */
    Matrix4.fromCamera = function(camera, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.object('camera', camera);
        //>>includeEnd('debug');

        var position = camera.position;
        var direction = camera.direction;
        var up = camera.up;

        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.object('camera.position', position);
        Check.Check.typeOf.object('camera.direction', direction);
        Check.Check.typeOf.object('camera.up', up);
        //>>includeEnd('debug');

        Cartographic.Cartesian3.normalize(direction, fromCameraF);
        Cartographic.Cartesian3.normalize(Cartographic.Cartesian3.cross(fromCameraF, up, fromCameraR), fromCameraR);
        Cartographic.Cartesian3.normalize(Cartographic.Cartesian3.cross(fromCameraR, fromCameraF, fromCameraU), fromCameraU);

        var sX = fromCameraR.x;
        var sY = fromCameraR.y;
        var sZ = fromCameraR.z;
        var fX = fromCameraF.x;
        var fY = fromCameraF.y;
        var fZ = fromCameraF.z;
        var uX = fromCameraU.x;
        var uY = fromCameraU.y;
        var uZ = fromCameraU.z;
        var positionX = position.x;
        var positionY = position.y;
        var positionZ = position.z;
        var t0 = sX * -positionX + sY * -positionY+ sZ * -positionZ;
        var t1 = uX * -positionX + uY * -positionY+ uZ * -positionZ;
        var t2 = fX * positionX + fY * positionY + fZ * positionZ;

        // The code below this comment is an optimized
        // version of the commented lines.
        // Rather that create two matrices and then multiply,
        // we just bake in the multiplcation as part of creation.
        // var rotation = new Matrix4(
        //                 sX,  sY,  sZ, 0.0,
        //                 uX,  uY,  uZ, 0.0,
        //                -fX, -fY, -fZ, 0.0,
        //                 0.0,  0.0,  0.0, 1.0);
        // var translation = new Matrix4(
        //                 1.0, 0.0, 0.0, -position.x,
        //                 0.0, 1.0, 0.0, -position.y,
        //                 0.0, 0.0, 1.0, -position.z,
        //                 0.0, 0.0, 0.0, 1.0);
        // return rotation.multiply(translation);
        if (!when.defined(result)) {
            return new Matrix4(
                    sX,   sY,  sZ, t0,
                    uX,   uY,  uZ, t1,
                   -fX,  -fY, -fZ, t2,
                    0.0, 0.0, 0.0, 1.0);
        }
        result[0] = sX;
        result[1] = uX;
        result[2] = -fX;
        result[3] = 0.0;
        result[4] = sY;
        result[5] = uY;
        result[6] = -fY;
        result[7] = 0.0;
        result[8] = sZ;
        result[9] = uZ;
        result[10] = -fZ;
        result[11] = 0.0;
        result[12] = t0;
        result[13] = t1;
        result[14] = t2;
        result[15] = 1.0;
        return result;
    };

     /**
      * Computes a Matrix4 instance representing a perspective transformation matrix.
      *
      * @param {Number} fovY The field of view along the Y axis in radians.
      * @param {Number} aspectRatio The aspect ratio.
      * @param {Number} near The distance to the near plane in meters.
      * @param {Number} far The distance to the far plane in meters.
      * @param {Matrix4} result The object in which the result will be stored.
      * @returns {Matrix4} The modified result parameter.
      *
      * @exception {DeveloperError} fovY must be in (0, PI].
      * @exception {DeveloperError} aspectRatio must be greater than zero.
      * @exception {DeveloperError} near must be greater than zero.
      * @exception {DeveloperError} far must be greater than zero.
      */
    Matrix4.computePerspectiveFieldOfView = function(fovY, aspectRatio, near, far, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.number.greaterThan('fovY', fovY, 0.0);
        Check.Check.typeOf.number.lessThan('fovY', fovY, Math.PI);
        Check.Check.typeOf.number.greaterThan('near', near, 0.0);
        Check.Check.typeOf.number.greaterThan('far', far, 0.0);
        Check.Check.typeOf.object('result', result);
        //>>includeEnd('debug');

        var bottom = Math.tan(fovY * 0.5);

        var column1Row1 = 1.0 / bottom;
        var column0Row0 = column1Row1 / aspectRatio;
        var column2Row2 = (far + near) / (near - far);
        var column3Row2 = (2.0 * far * near) / (near - far);

        result[0] = column0Row0;
        result[1] = 0.0;
        result[2] = 0.0;
        result[3] = 0.0;
        result[4] = 0.0;
        result[5] = column1Row1;
        result[6] = 0.0;
        result[7] = 0.0;
        result[8] = 0.0;
        result[9] = 0.0;
        result[10] = column2Row2;
        result[11] = -1.0;
        result[12] = 0.0;
        result[13] = 0.0;
        result[14] = column3Row2;
        result[15] = 0.0;
        return result;
    };

    /**
    * Computes a Matrix4 instance representing an orthographic transformation matrix.
    *
    * @param {Number} left The number of meters to the left of the camera that will be in view.
    * @param {Number} right The number of meters to the right of the camera that will be in view.
    * @param {Number} bottom The number of meters below of the camera that will be in view.
    * @param {Number} top The number of meters above of the camera that will be in view.
    * @param {Number} near The distance to the near plane in meters.
    * @param {Number} far The distance to the far plane in meters.
    * @param {Matrix4} result The object in which the result will be stored.
    * @returns {Matrix4} The modified result parameter.
    */
    Matrix4.computeOrthographicOffCenter = function(left, right, bottom, top, near, far, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.number('left', left);
        Check.Check.typeOf.number('right', right);
        Check.Check.typeOf.number('bottom', bottom);
        Check.Check.typeOf.number('top', top);
        Check.Check.typeOf.number('near', near);
        Check.Check.typeOf.number('far', far);
        Check.Check.typeOf.object('result', result);
        //>>includeEnd('debug');

        var a = 1.0 / (right - left);
        var b = 1.0 / (top - bottom);
        var c = 1.0 / (far - near);

        var tx = -(right + left) * a;
        var ty = -(top + bottom) * b;
        var tz = -(far + near) * c;
        a *= 2.0;
        b *= 2.0;
        c *= -2.0;

        result[0] = a;
        result[1] = 0.0;
        result[2] = 0.0;
        result[3] = 0.0;
        result[4] = 0.0;
        result[5] = b;
        result[6] = 0.0;
        result[7] = 0.0;
        result[8] = 0.0;
        result[9] = 0.0;
        result[10] = c;
        result[11] = 0.0;
        result[12] = tx;
        result[13] = ty;
        result[14] = tz;
        result[15] = 1.0;
        return result;
    };

    /**
     * Computes a Matrix4 instance representing an off center perspective transformation.
     *
     * @param {Number} left The number of meters to the left of the camera that will be in view.
     * @param {Number} right The number of meters to the right of the camera that will be in view.
     * @param {Number} bottom The number of meters below of the camera that will be in view.
     * @param {Number} top The number of meters above of the camera that will be in view.
     * @param {Number} near The distance to the near plane in meters.
     * @param {Number} far The distance to the far plane in meters.
     * @param {Matrix4} result The object in which the result will be stored.
     * @returns {Matrix4} The modified result parameter.
     */
    Matrix4.computePerspectiveOffCenter = function(left, right, bottom, top, near, far, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.number('left', left);
        Check.Check.typeOf.number('right', right);
        Check.Check.typeOf.number('bottom', bottom);
        Check.Check.typeOf.number('top', top);
        Check.Check.typeOf.number('near', near);
        Check.Check.typeOf.number('far', far);
        Check.Check.typeOf.object('result', result);
        //>>includeEnd('debug');

        var column0Row0 = 2.0 * near / (right - left);
        var column1Row1 = 2.0 * near / (top - bottom);
        var column2Row0 = (right + left) / (right - left);
        var column2Row1 = (top + bottom) / (top - bottom);
        var column2Row2 = -(far + near) / (far - near);
        var column2Row3 = -1.0;
        var column3Row2 = -2.0 * far * near / (far - near);

        result[0] = column0Row0;
        result[1] = 0.0;
        result[2] = 0.0;
        result[3] = 0.0;
        result[4] = 0.0;
        result[5] = column1Row1;
        result[6] = 0.0;
        result[7] = 0.0;
        result[8] = column2Row0;
        result[9] = column2Row1;
        result[10] = column2Row2;
        result[11] = column2Row3;
        result[12] = 0.0;
        result[13] = 0.0;
        result[14] = column3Row2;
        result[15] = 0.0;
        return result;
    };

    /**
     * Computes a Matrix4 instance representing an infinite off center perspective transformation.
     *
     * @param {Number} left The number of meters to the left of the camera that will be in view.
     * @param {Number} right The number of meters to the right of the camera that will be in view.
     * @param {Number} bottom The number of meters below of the camera that will be in view.
     * @param {Number} top The number of meters above of the camera that will be in view.
     * @param {Number} near The distance to the near plane in meters.
     * @param {Matrix4} result The object in which the result will be stored.
     * @returns {Matrix4} The modified result parameter.
     */
    Matrix4.computeInfinitePerspectiveOffCenter = function(left, right, bottom, top, near, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.number('left', left);
        Check.Check.typeOf.number('right', right);
        Check.Check.typeOf.number('bottom', bottom);
        Check.Check.typeOf.number('top', top);
        Check.Check.typeOf.number('near', near);
        Check.Check.typeOf.object('result', result);
        //>>includeEnd('debug');

        var column0Row0 = 2.0 * near / (right - left);
        var column1Row1 = 2.0 * near / (top - bottom);
        var column2Row0 = (right + left) / (right - left);
        var column2Row1 = (top + bottom) / (top - bottom);
        var column2Row2 = -1.0;
        var column2Row3 = -1.0;
        var column3Row2 = -2.0 * near;

        result[0] = column0Row0;
        result[1] = 0.0;
        result[2] = 0.0;
        result[3] = 0.0;
        result[4] = 0.0;
        result[5] = column1Row1;
        result[6] = 0.0;
        result[7] = 0.0;
        result[8] = column2Row0;
        result[9] = column2Row1;
        result[10] = column2Row2;
        result[11] = column2Row3;
        result[12] = 0.0;
        result[13] = 0.0;
        result[14] = column3Row2;
        result[15] = 0.0;
        return result;
    };

    /**
     * Computes a Matrix4 instance that transforms from normalized device coordinates to window coordinates.
     *
     * @param {Object}[viewport = { x : 0.0, y : 0.0, width : 0.0, height : 0.0 }] The viewport's corners as shown in Example 1.
     * @param {Number}[nearDepthRange=0.0] The near plane distance in window coordinates.
     * @param {Number}[farDepthRange=1.0] The far plane distance in window coordinates.
     * @param {Matrix4} result The object in which the result will be stored.
     * @returns {Matrix4} The modified result parameter.
     *
     * @example
     * // Create viewport transformation using an explicit viewport and depth range.
     * var m = Cesium.Matrix4.computeViewportTransformation({
     *     x : 0.0,
     *     y : 0.0,
     *     width : 1024.0,
     *     height : 768.0
     * }, 0.0, 1.0, new Cesium.Matrix4());
     */
    Matrix4.computeViewportTransformation = function(viewport, nearDepthRange, farDepthRange, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.object('result', result);
        //>>includeEnd('debug');

        viewport = when.defaultValue(viewport, when.defaultValue.EMPTY_OBJECT);
        var x = when.defaultValue(viewport.x, 0.0);
        var y = when.defaultValue(viewport.y, 0.0);
        var width = when.defaultValue(viewport.width, 0.0);
        var height = when.defaultValue(viewport.height, 0.0);
        nearDepthRange = when.defaultValue(nearDepthRange, 0.0);
        farDepthRange = when.defaultValue(farDepthRange, 1.0);

        var halfWidth = width * 0.5;
        var halfHeight = height * 0.5;
        var halfDepth = (farDepthRange - nearDepthRange) * 0.5;

        var column0Row0 = halfWidth;
        var column1Row1 = halfHeight;
        var column2Row2 = halfDepth;
        var column3Row0 = x + halfWidth;
        var column3Row1 = y + halfHeight;
        var column3Row2 = nearDepthRange + halfDepth;
        var column3Row3 = 1.0;

        result[0] = column0Row0;
        result[1] = 0.0;
        result[2] = 0.0;
        result[3] = 0.0;
        result[4] = 0.0;
        result[5] = column1Row1;
        result[6] = 0.0;
        result[7] = 0.0;
        result[8] = 0.0;
        result[9] = 0.0;
        result[10] = column2Row2;
        result[11] = 0.0;
        result[12] = column3Row0;
        result[13] = column3Row1;
        result[14] = column3Row2;
        result[15] = column3Row3;
        return result;
    };

    /**
     * Computes a Matrix4 instance that transforms from world space to view space.
     *
     * @param {Cartesian3} position The position of the camera.
     * @param {Cartesian3} direction The forward direction.
     * @param {Cartesian3} up The up direction.
     * @param {Cartesian3} right The right direction.
     * @param {Matrix4} result The object in which the result will be stored.
     * @returns {Matrix4} The modified result parameter.
     */
    Matrix4.computeView = function(position, direction, up, right, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.object('position', position);
        Check.Check.typeOf.object('direction', direction);
        Check.Check.typeOf.object('up', up);
        Check.Check.typeOf.object('right', right);
        Check.Check.typeOf.object('result', result);
        //>>includeEnd('debug');

        result[0] = right.x;
        result[1] = up.x;
        result[2] = -direction.x;
        result[3] = 0.0;
        result[4] = right.y;
        result[5] = up.y;
        result[6] = -direction.y;
        result[7] = 0.0;
        result[8] = right.z;
        result[9] = up.z;
        result[10] = -direction.z;
        result[11] = 0.0;
        result[12] = -Cartographic.Cartesian3.dot(right, position);
        result[13] = -Cartographic.Cartesian3.dot(up, position);
        result[14] = Cartographic.Cartesian3.dot(direction, position);
        result[15] = 1.0;
        return result;
    };

    /**
     * Computes an Array from the provided Matrix4 instance.
     * The array will be in column-major order.
     *
     * @param {Matrix4} matrix The matrix to use..
     * @param {Number[]} [result] The Array onto which to store the result.
     * @returns {Number[]} The modified Array parameter or a new Array instance if one was not provided.
     *
     * @example
     * //create an array from an instance of Matrix4
     * // m = [10.0, 14.0, 18.0, 22.0]
     * //     [11.0, 15.0, 19.0, 23.0]
     * //     [12.0, 16.0, 20.0, 24.0]
     * //     [13.0, 17.0, 21.0, 25.0]
     * var a = Cesium.Matrix4.toArray(m);
     *
     * // m remains the same
     * //creates a = [10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0, 17.0, 18.0, 19.0, 20.0, 21.0, 22.0, 23.0, 24.0, 25.0]
     */
    Matrix4.toArray = function(matrix, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.object('matrix', matrix);
        //>>includeEnd('debug');

        if (!when.defined(result)) {
            return [matrix[0], matrix[1], matrix[2], matrix[3],
                    matrix[4], matrix[5], matrix[6], matrix[7],
                    matrix[8], matrix[9], matrix[10], matrix[11],
                    matrix[12], matrix[13], matrix[14], matrix[15]];
        }
        result[0] = matrix[0];
        result[1] = matrix[1];
        result[2] = matrix[2];
        result[3] = matrix[3];
        result[4] = matrix[4];
        result[5] = matrix[5];
        result[6] = matrix[6];
        result[7] = matrix[7];
        result[8] = matrix[8];
        result[9] = matrix[9];
        result[10] = matrix[10];
        result[11] = matrix[11];
        result[12] = matrix[12];
        result[13] = matrix[13];
        result[14] = matrix[14];
        result[15] = matrix[15];
        return result;
    };

    /**
     * Computes the array index of the element at the provided row and column.
     *
     * @param {Number} row The zero-based index of the row.
     * @param {Number} column The zero-based index of the column.
     * @returns {Number} The index of the element at the provided row and column.
     *
     * @exception {DeveloperError} row must be 0, 1, 2, or 3.
     * @exception {DeveloperError} column must be 0, 1, 2, or 3.
     *
     * @example
     * var myMatrix = new Cesium.Matrix4();
     * var column1Row0Index = Cesium.Matrix4.getElementIndex(1, 0);
     * var column1Row0 = myMatrix[column1Row0Index];
     * myMatrix[column1Row0Index] = 10.0;
     */
    Matrix4.getElementIndex = function(column, row) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.number.greaterThanOrEquals('row', row, 0);
        Check.Check.typeOf.number.lessThanOrEquals('row', row, 3);

        Check.Check.typeOf.number.greaterThanOrEquals('column', column, 0);
        Check.Check.typeOf.number.lessThanOrEquals('column', column, 3);
        //>>includeEnd('debug');

        return column * 4 + row;
    };

    /**
     * Retrieves a copy of the matrix column at the provided index as a Cartesian4 instance.
     *
     * @param {Matrix4} matrix The matrix to use.
     * @param {Number} index The zero-based index of the column to retrieve.
     * @param {Cartesian4} result The object onto which to store the result.
     * @returns {Cartesian4} The modified result parameter.
     *
     * @exception {DeveloperError} index must be 0, 1, 2, or 3.
     *
     * @example
     * //returns a Cartesian4 instance with values from the specified column
     * // m = [10.0, 11.0, 12.0, 13.0]
     * //     [14.0, 15.0, 16.0, 17.0]
     * //     [18.0, 19.0, 20.0, 21.0]
     * //     [22.0, 23.0, 24.0, 25.0]
     *
     * //Example 1: Creates an instance of Cartesian
     * var a = Cesium.Matrix4.getColumn(m, 2, new Cesium.Cartesian4());
     *
     * @example
     * //Example 2: Sets values for Cartesian instance
     * var a = new Cesium.Cartesian4();
     * Cesium.Matrix4.getColumn(m, 2, a);
     *
     * // a.x = 12.0; a.y = 16.0; a.z = 20.0; a.w = 24.0;
     */
    Matrix4.getColumn = function(matrix, index, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.object('matrix', matrix);

        Check.Check.typeOf.number.greaterThanOrEquals('index', index, 0);
        Check.Check.typeOf.number.lessThanOrEquals('index', index, 3);

        Check.Check.typeOf.object('result', result);
        //>>includeEnd('debug');

        var startIndex = index * 4;
        var x = matrix[startIndex];
        var y = matrix[startIndex + 1];
        var z = matrix[startIndex + 2];
        var w = matrix[startIndex + 3];

        result.x = x;
        result.y = y;
        result.z = z;
        result.w = w;
        return result;
    };

    /**
     * Computes a new matrix that replaces the specified column in the provided matrix with the provided Cartesian4 instance.
     *
     * @param {Matrix4} matrix The matrix to use.
     * @param {Number} index The zero-based index of the column to set.
     * @param {Cartesian4} cartesian The Cartesian whose values will be assigned to the specified column.
     * @param {Matrix4} result The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter.
     *
     * @exception {DeveloperError} index must be 0, 1, 2, or 3.
     *
     * @example
     * //creates a new Matrix4 instance with new column values from the Cartesian4 instance
     * // m = [10.0, 11.0, 12.0, 13.0]
     * //     [14.0, 15.0, 16.0, 17.0]
     * //     [18.0, 19.0, 20.0, 21.0]
     * //     [22.0, 23.0, 24.0, 25.0]
     *
     * var a = Cesium.Matrix4.setColumn(m, 2, new Cesium.Cartesian4(99.0, 98.0, 97.0, 96.0), new Cesium.Matrix4());
     *
     * // m remains the same
     * // a = [10.0, 11.0, 99.0, 13.0]
     * //     [14.0, 15.0, 98.0, 17.0]
     * //     [18.0, 19.0, 97.0, 21.0]
     * //     [22.0, 23.0, 96.0, 25.0]
     */
    Matrix4.setColumn = function(matrix, index, cartesian, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.object('matrix', matrix);

        Check.Check.typeOf.number.greaterThanOrEquals('index', index, 0);
        Check.Check.typeOf.number.lessThanOrEquals('index', index, 3);

        Check.Check.typeOf.object('cartesian', cartesian);
        Check.Check.typeOf.object('result', result);
        //>>includeEnd('debug');

        result = Matrix4.clone(matrix, result);
        var startIndex = index * 4;
        result[startIndex] = cartesian.x;
        result[startIndex + 1] = cartesian.y;
        result[startIndex + 2] = cartesian.z;
        result[startIndex + 3] = cartesian.w;
        return result;
    };

    /**
     * Computes a new matrix that replaces the translation in the rightmost column of the provided
     * matrix with the provided translation.  This assumes the matrix is an affine transformation
     *
     * @param {Matrix4} matrix The matrix to use.
     * @param {Cartesian3} translation The translation that replaces the translation of the provided matrix.
     * @param {Matrix4} result The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter.
     */
    Matrix4.setTranslation = function(matrix, translation, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.object('matrix', matrix);
        Check.Check.typeOf.object('translation', translation);
        Check.Check.typeOf.object('result', result);
        //>>includeEnd('debug');

        result[0] = matrix[0];
        result[1] = matrix[1];
        result[2] = matrix[2];
        result[3] = matrix[3];

        result[4] = matrix[4];
        result[5] = matrix[5];
        result[6] = matrix[6];
        result[7] = matrix[7];

        result[8] = matrix[8];
        result[9] = matrix[9];
        result[10] = matrix[10];
        result[11] = matrix[11];

        result[12] = translation.x;
        result[13] = translation.y;
        result[14] = translation.z;
        result[15] = matrix[15];

        return result;
    };

    var scaleScratch = new Cartographic.Cartesian3();
    /**
     * Computes a new matrix that replaces the scale with the provided scale.  This assumes the matrix is an affine transformation
     *
     * @param {Matrix4} matrix The matrix to use.
     * @param {Cartesian3} scale The scale that replaces the scale of the provided matrix.
     * @param {Matrix4} result The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter.
     */
    Matrix4.setScale = function(matrix, scale, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.object('matrix', matrix);
        Check.Check.typeOf.object('scale', scale);
        Check.Check.typeOf.object('result', result);
        //>>includeEnd('debug');

        var existingScale = Matrix4.getScale(matrix, scaleScratch);
        var newScale = Cartographic.Cartesian3.divideComponents(scale, existingScale, scaleScratch);
        return Matrix4.multiplyByScale(matrix, newScale, result);
    };

    /**
     * Retrieves a copy of the matrix row at the provided index as a Cartesian4 instance.
     *
     * @param {Matrix4} matrix The matrix to use.
     * @param {Number} index The zero-based index of the row to retrieve.
     * @param {Cartesian4} result The object onto which to store the result.
     * @returns {Cartesian4} The modified result parameter.
     *
     * @exception {DeveloperError} index must be 0, 1, 2, or 3.
     *
     * @example
     * //returns a Cartesian4 instance with values from the specified column
     * // m = [10.0, 11.0, 12.0, 13.0]
     * //     [14.0, 15.0, 16.0, 17.0]
     * //     [18.0, 19.0, 20.0, 21.0]
     * //     [22.0, 23.0, 24.0, 25.0]
     *
     * //Example 1: Returns an instance of Cartesian
     * var a = Cesium.Matrix4.getRow(m, 2, new Cesium.Cartesian4());
     *
     * @example
     * //Example 2: Sets values for a Cartesian instance
     * var a = new Cesium.Cartesian4();
     * Cesium.Matrix4.getRow(m, 2, a);
     *
     * // a.x = 18.0; a.y = 19.0; a.z = 20.0; a.w = 21.0;
     */
    Matrix4.getRow = function(matrix, index, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.object('matrix', matrix);

        Check.Check.typeOf.number.greaterThanOrEquals('index', index, 0);
        Check.Check.typeOf.number.lessThanOrEquals('index', index, 3);

        Check.Check.typeOf.object('result', result);
        //>>includeEnd('debug');

        var x = matrix[index];
        var y = matrix[index + 4];
        var z = matrix[index + 8];
        var w = matrix[index + 12];

        result.x = x;
        result.y = y;
        result.z = z;
        result.w = w;
        return result;
    };

    /**
     * Computes a new matrix that replaces the specified row in the provided matrix with the provided Cartesian4 instance.
     *
     * @param {Matrix4} matrix The matrix to use.
     * @param {Number} index The zero-based index of the row to set.
     * @param {Cartesian4} cartesian The Cartesian whose values will be assigned to the specified row.
     * @param {Matrix4} result The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter.
     *
     * @exception {DeveloperError} index must be 0, 1, 2, or 3.
     *
     * @example
     * //create a new Matrix4 instance with new row values from the Cartesian4 instance
     * // m = [10.0, 11.0, 12.0, 13.0]
     * //     [14.0, 15.0, 16.0, 17.0]
     * //     [18.0, 19.0, 20.0, 21.0]
     * //     [22.0, 23.0, 24.0, 25.0]
     *
     * var a = Cesium.Matrix4.setRow(m, 2, new Cesium.Cartesian4(99.0, 98.0, 97.0, 96.0), new Cesium.Matrix4());
     *
     * // m remains the same
     * // a = [10.0, 11.0, 12.0, 13.0]
     * //     [14.0, 15.0, 16.0, 17.0]
     * //     [99.0, 98.0, 97.0, 96.0]
     * //     [22.0, 23.0, 24.0, 25.0]
     */
    Matrix4.setRow = function(matrix, index, cartesian, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.object('matrix', matrix);

        Check.Check.typeOf.number.greaterThanOrEquals('index', index, 0);
        Check.Check.typeOf.number.lessThanOrEquals('index', index, 3);

        Check.Check.typeOf.object('cartesian', cartesian);
        Check.Check.typeOf.object('result', result);
        //>>includeEnd('debug');

        result = Matrix4.clone(matrix, result);
        result[index] = cartesian.x;
        result[index + 4] = cartesian.y;
        result[index + 8] = cartesian.z;
        result[index + 12] = cartesian.w;
        return result;
    };

    var scratchColumn$1 = new Cartographic.Cartesian3();

    /**
     * Extracts the non-uniform scale assuming the matrix is an affine transformation.
     *
     * @param {Matrix4} matrix The matrix.
     * @param {Cartesian3} result The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter
     */
    Matrix4.getScale = function(matrix, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.object('matrix', matrix);
        Check.Check.typeOf.object('result', result);
        //>>includeEnd('debug');

        result.x = Cartographic.Cartesian3.magnitude(Cartographic.Cartesian3.fromElements(matrix[0], matrix[1], matrix[2], scratchColumn$1));
        result.y = Cartographic.Cartesian3.magnitude(Cartographic.Cartesian3.fromElements(matrix[4], matrix[5], matrix[6], scratchColumn$1));
        result.z = Cartographic.Cartesian3.magnitude(Cartographic.Cartesian3.fromElements(matrix[8], matrix[9], matrix[10], scratchColumn$1));
        return result;
    };

    var scratchScale$1 = new Cartographic.Cartesian3();

    /**
     * Computes the maximum scale assuming the matrix is an affine transformation.
     * The maximum scale is the maximum length of the column vectors in the upper-left
     * 3x3 matrix.
     *
     * @param {Matrix4} matrix The matrix.
     * @returns {Number} The maximum scale.
     */
    Matrix4.getMaximumScale = function(matrix) {
        Matrix4.getScale(matrix, scratchScale$1);
        return Cartographic.Cartesian3.maximumComponent(scratchScale$1);
    };

    /**
     * Computes the product of two matrices.
     *
     * @param {Matrix4} left The first matrix.
     * @param {Matrix4} right The second matrix.
     * @param {Matrix4} result The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter.
     */
    Matrix4.multiply = function(left, right, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.object('left', left);
        Check.Check.typeOf.object('right', right);
        Check.Check.typeOf.object('result', result);
        //>>includeEnd('debug');

        var left0 = left[0];
        var left1 = left[1];
        var left2 = left[2];
        var left3 = left[3];
        var left4 = left[4];
        var left5 = left[5];
        var left6 = left[6];
        var left7 = left[7];
        var left8 = left[8];
        var left9 = left[9];
        var left10 = left[10];
        var left11 = left[11];
        var left12 = left[12];
        var left13 = left[13];
        var left14 = left[14];
        var left15 = left[15];

        var right0 = right[0];
        var right1 = right[1];
        var right2 = right[2];
        var right3 = right[3];
        var right4 = right[4];
        var right5 = right[5];
        var right6 = right[6];
        var right7 = right[7];
        var right8 = right[8];
        var right9 = right[9];
        var right10 = right[10];
        var right11 = right[11];
        var right12 = right[12];
        var right13 = right[13];
        var right14 = right[14];
        var right15 = right[15];

        var column0Row0 = left0 * right0 + left4 * right1 + left8 * right2 + left12 * right3;
        var column0Row1 = left1 * right0 + left5 * right1 + left9 * right2 + left13 * right3;
        var column0Row2 = left2 * right0 + left6 * right1 + left10 * right2 + left14 * right3;
        var column0Row3 = left3 * right0 + left7 * right1 + left11 * right2 + left15 * right3;

        var column1Row0 = left0 * right4 + left4 * right5 + left8 * right6 + left12 * right7;
        var column1Row1 = left1 * right4 + left5 * right5 + left9 * right6 + left13 * right7;
        var column1Row2 = left2 * right4 + left6 * right5 + left10 * right6 + left14 * right7;
        var column1Row3 = left3 * right4 + left7 * right5 + left11 * right6 + left15 * right7;

        var column2Row0 = left0 * right8 + left4 * right9 + left8 * right10 + left12 * right11;
        var column2Row1 = left1 * right8 + left5 * right9 + left9 * right10 + left13 * right11;
        var column2Row2 = left2 * right8 + left6 * right9 + left10 * right10 + left14 * right11;
        var column2Row3 = left3 * right8 + left7 * right9 + left11 * right10 + left15 * right11;

        var column3Row0 = left0 * right12 + left4 * right13 + left8 * right14 + left12 * right15;
        var column3Row1 = left1 * right12 + left5 * right13 + left9 * right14 + left13 * right15;
        var column3Row2 = left2 * right12 + left6 * right13 + left10 * right14 + left14 * right15;
        var column3Row3 = left3 * right12 + left7 * right13 + left11 * right14 + left15 * right15;

        result[0] = column0Row0;
        result[1] = column0Row1;
        result[2] = column0Row2;
        result[3] = column0Row3;
        result[4] = column1Row0;
        result[5] = column1Row1;
        result[6] = column1Row2;
        result[7] = column1Row3;
        result[8] = column2Row0;
        result[9] = column2Row1;
        result[10] = column2Row2;
        result[11] = column2Row3;
        result[12] = column3Row0;
        result[13] = column3Row1;
        result[14] = column3Row2;
        result[15] = column3Row3;
        return result;
    };

    /**
     * Computes the sum of two matrices.
     *
     * @param {Matrix4} left The first matrix.
     * @param {Matrix4} right The second matrix.
     * @param {Matrix4} result The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter.
     */
    Matrix4.add = function(left, right, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.object('left', left);
        Check.Check.typeOf.object('right', right);
        Check.Check.typeOf.object('result', result);
        //>>includeEnd('debug');

        result[0] = left[0] + right[0];
        result[1] = left[1] + right[1];
        result[2] = left[2] + right[2];
        result[3] = left[3] + right[3];
        result[4] = left[4] + right[4];
        result[5] = left[5] + right[5];
        result[6] = left[6] + right[6];
        result[7] = left[7] + right[7];
        result[8] = left[8] + right[8];
        result[9] = left[9] + right[9];
        result[10] = left[10] + right[10];
        result[11] = left[11] + right[11];
        result[12] = left[12] + right[12];
        result[13] = left[13] + right[13];
        result[14] = left[14] + right[14];
        result[15] = left[15] + right[15];
        return result;
    };

    /**
     * Computes the difference of two matrices.
     *
     * @param {Matrix4} left The first matrix.
     * @param {Matrix4} right The second matrix.
     * @param {Matrix4} result The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter.
     */
    Matrix4.subtract = function(left, right, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.object('left', left);
        Check.Check.typeOf.object('right', right);
        Check.Check.typeOf.object('result', result);
        //>>includeEnd('debug');

        result[0] = left[0] - right[0];
        result[1] = left[1] - right[1];
        result[2] = left[2] - right[2];
        result[3] = left[3] - right[3];
        result[4] = left[4] - right[4];
        result[5] = left[5] - right[5];
        result[6] = left[6] - right[6];
        result[7] = left[7] - right[7];
        result[8] = left[8] - right[8];
        result[9] = left[9] - right[9];
        result[10] = left[10] - right[10];
        result[11] = left[11] - right[11];
        result[12] = left[12] - right[12];
        result[13] = left[13] - right[13];
        result[14] = left[14] - right[14];
        result[15] = left[15] - right[15];
        return result;
    };

    /**
     * Computes the product of two matrices assuming the matrices are
     * affine transformation matrices, where the upper left 3x3 elements
     * are a rotation matrix, and the upper three elements in the fourth
     * column are the translation.  The bottom row is assumed to be [0, 0, 0, 1].
     * The matrix is not verified to be in the proper form.
     * This method is faster than computing the product for general 4x4
     * matrices using {@link Matrix4.multiply}.
     *
     * @param {Matrix4} left The first matrix.
     * @param {Matrix4} right The second matrix.
     * @param {Matrix4} result The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter.
     *
     * @example
     * var m1 = new Cesium.Matrix4(1.0, 6.0, 7.0, 0.0, 2.0, 5.0, 8.0, 0.0, 3.0, 4.0, 9.0, 0.0, 0.0, 0.0, 0.0, 1.0);
     * var m2 = Cesium.Transforms.eastNorthUpToFixedFrame(new Cesium.Cartesian3(1.0, 1.0, 1.0));
     * var m3 = Cesium.Matrix4.multiplyTransformation(m1, m2, new Cesium.Matrix4());
     */
    Matrix4.multiplyTransformation = function(left, right, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.object('left', left);
        Check.Check.typeOf.object('right', right);
        Check.Check.typeOf.object('result', result);
        //>>includeEnd('debug');

        var left0 = left[0];
        var left1 = left[1];
        var left2 = left[2];
        var left4 = left[4];
        var left5 = left[5];
        var left6 = left[6];
        var left8 = left[8];
        var left9 = left[9];
        var left10 = left[10];
        var left12 = left[12];
        var left13 = left[13];
        var left14 = left[14];

        var right0 = right[0];
        var right1 = right[1];
        var right2 = right[2];
        var right4 = right[4];
        var right5 = right[5];
        var right6 = right[6];
        var right8 = right[8];
        var right9 = right[9];
        var right10 = right[10];
        var right12 = right[12];
        var right13 = right[13];
        var right14 = right[14];

        var column0Row0 = left0 * right0 + left4 * right1 + left8 * right2;
        var column0Row1 = left1 * right0 + left5 * right1 + left9 * right2;
        var column0Row2 = left2 * right0 + left6 * right1 + left10 * right2;

        var column1Row0 = left0 * right4 + left4 * right5 + left8 * right6;
        var column1Row1 = left1 * right4 + left5 * right5 + left9 * right6;
        var column1Row2 = left2 * right4 + left6 * right5 + left10 * right6;

        var column2Row0 = left0 * right8 + left4 * right9 + left8 * right10;
        var column2Row1 = left1 * right8 + left5 * right9 + left9 * right10;
        var column2Row2 = left2 * right8 + left6 * right9 + left10 * right10;

        var column3Row0 = left0 * right12 + left4 * right13 + left8 * right14 + left12;
        var column3Row1 = left1 * right12 + left5 * right13 + left9 * right14 + left13;
        var column3Row2 = left2 * right12 + left6 * right13 + left10 * right14 + left14;

        result[0] = column0Row0;
        result[1] = column0Row1;
        result[2] = column0Row2;
        result[3] = 0.0;
        result[4] = column1Row0;
        result[5] = column1Row1;
        result[6] = column1Row2;
        result[7] = 0.0;
        result[8] = column2Row0;
        result[9] = column2Row1;
        result[10] = column2Row2;
        result[11] = 0.0;
        result[12] = column3Row0;
        result[13] = column3Row1;
        result[14] = column3Row2;
        result[15] = 1.0;
        return result;
    };

    /**
     * Multiplies a transformation matrix (with a bottom row of <code>[0.0, 0.0, 0.0, 1.0]</code>)
     * by a 3x3 rotation matrix.  This is an optimization
     * for <code>Matrix4.multiply(m, Matrix4.fromRotationTranslation(rotation), m);</code> with less allocations and arithmetic operations.
     *
     * @param {Matrix4} matrix The matrix on the left-hand side.
     * @param {Matrix3} rotation The 3x3 rotation matrix on the right-hand side.
     * @param {Matrix4} result The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter.
     *
     * @example
     * // Instead of Cesium.Matrix4.multiply(m, Cesium.Matrix4.fromRotationTranslation(rotation), m);
     * Cesium.Matrix4.multiplyByMatrix3(m, rotation, m);
     */
    Matrix4.multiplyByMatrix3 = function(matrix, rotation, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.object('matrix', matrix);
        Check.Check.typeOf.object('rotation', rotation);
        Check.Check.typeOf.object('result', result);
        //>>includeEnd('debug');

        var left0 = matrix[0];
        var left1 = matrix[1];
        var left2 = matrix[2];
        var left4 = matrix[4];
        var left5 = matrix[5];
        var left6 = matrix[6];
        var left8 = matrix[8];
        var left9 = matrix[9];
        var left10 = matrix[10];

        var right0 = rotation[0];
        var right1 = rotation[1];
        var right2 = rotation[2];
        var right4 = rotation[3];
        var right5 = rotation[4];
        var right6 = rotation[5];
        var right8 = rotation[6];
        var right9 = rotation[7];
        var right10 = rotation[8];

        var column0Row0 = left0 * right0 + left4 * right1 + left8 * right2;
        var column0Row1 = left1 * right0 + left5 * right1 + left9 * right2;
        var column0Row2 = left2 * right0 + left6 * right1 + left10 * right2;

        var column1Row0 = left0 * right4 + left4 * right5 + left8 * right6;
        var column1Row1 = left1 * right4 + left5 * right5 + left9 * right6;
        var column1Row2 = left2 * right4 + left6 * right5 + left10 * right6;

        var column2Row0 = left0 * right8 + left4 * right9 + left8 * right10;
        var column2Row1 = left1 * right8 + left5 * right9 + left9 * right10;
        var column2Row2 = left2 * right8 + left6 * right9 + left10 * right10;

        result[0] = column0Row0;
        result[1] = column0Row1;
        result[2] = column0Row2;
        result[3] = 0.0;
        result[4] = column1Row0;
        result[5] = column1Row1;
        result[6] = column1Row2;
        result[7] = 0.0;
        result[8] = column2Row0;
        result[9] = column2Row1;
        result[10] = column2Row2;
        result[11] = 0.0;
        result[12] = matrix[12];
        result[13] = matrix[13];
        result[14] = matrix[14];
        result[15] = matrix[15];
        return result;
    };

    /**
     * Multiplies a transformation matrix (with a bottom row of <code>[0.0, 0.0, 0.0, 1.0]</code>)
     * by an implicit translation matrix defined by a {@link Cartesian3}.  This is an optimization
     * for <code>Matrix4.multiply(m, Matrix4.fromTranslation(position), m);</code> with less allocations and arithmetic operations.
     *
     * @param {Matrix4} matrix The matrix on the left-hand side.
     * @param {Cartesian3} translation The translation on the right-hand side.
     * @param {Matrix4} result The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter.
     *
     * @example
     * // Instead of Cesium.Matrix4.multiply(m, Cesium.Matrix4.fromTranslation(position), m);
     * Cesium.Matrix4.multiplyByTranslation(m, position, m);
     */
    Matrix4.multiplyByTranslation = function(matrix, translation, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.object('matrix', matrix);
        Check.Check.typeOf.object('translation', translation);
        Check.Check.typeOf.object('result', result);
        //>>includeEnd('debug');

        var x = translation.x;
        var y = translation.y;
        var z = translation.z;

        var tx = (x * matrix[0]) + (y * matrix[4]) + (z * matrix[8]) + matrix[12];
        var ty = (x * matrix[1]) + (y * matrix[5]) + (z * matrix[9]) + matrix[13];
        var tz = (x * matrix[2]) + (y * matrix[6]) + (z * matrix[10]) + matrix[14];

        result[0] = matrix[0];
        result[1] = matrix[1];
        result[2] = matrix[2];
        result[3] = matrix[3];
        result[4] = matrix[4];
        result[5] = matrix[5];
        result[6] = matrix[6];
        result[7] = matrix[7];
        result[8] = matrix[8];
        result[9] = matrix[9];
        result[10] = matrix[10];
        result[11] = matrix[11];
        result[12] = tx;
        result[13] = ty;
        result[14] = tz;
        result[15] = matrix[15];
        return result;
    };

    var uniformScaleScratch = new Cartographic.Cartesian3();

    /**
     * Multiplies an affine transformation matrix (with a bottom row of <code>[0.0, 0.0, 0.0, 1.0]</code>)
     * by an implicit uniform scale matrix.  This is an optimization
     * for <code>Matrix4.multiply(m, Matrix4.fromUniformScale(scale), m);</code>, where
     * <code>m</code> must be an affine matrix.
     * This function performs fewer allocations and arithmetic operations.
     *
     * @param {Matrix4} matrix The affine matrix on the left-hand side.
     * @param {Number} scale The uniform scale on the right-hand side.
     * @param {Matrix4} result The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter.
     *
     *
     * @example
     * // Instead of Cesium.Matrix4.multiply(m, Cesium.Matrix4.fromUniformScale(scale), m);
     * Cesium.Matrix4.multiplyByUniformScale(m, scale, m);
     *
     * @see Matrix4.fromUniformScale
     * @see Matrix4.multiplyByScale
     */
    Matrix4.multiplyByUniformScale = function(matrix, scale, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.object('matrix', matrix);
        Check.Check.typeOf.number('scale', scale);
        Check.Check.typeOf.object('result', result);
        //>>includeEnd('debug');

        uniformScaleScratch.x = scale;
        uniformScaleScratch.y = scale;
        uniformScaleScratch.z = scale;
        return Matrix4.multiplyByScale(matrix, uniformScaleScratch, result);
    };

    /**
     * Multiplies an affine transformation matrix (with a bottom row of <code>[0.0, 0.0, 0.0, 1.0]</code>)
     * by an implicit non-uniform scale matrix.  This is an optimization
     * for <code>Matrix4.multiply(m, Matrix4.fromUniformScale(scale), m);</code>, where
     * <code>m</code> must be an affine matrix.
     * This function performs fewer allocations and arithmetic operations.
     *
     * @param {Matrix4} matrix The affine matrix on the left-hand side.
     * @param {Cartesian3} scale The non-uniform scale on the right-hand side.
     * @param {Matrix4} result The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter.
     *
     *
     * @example
     * // Instead of Cesium.Matrix4.multiply(m, Cesium.Matrix4.fromScale(scale), m);
     * Cesium.Matrix4.multiplyByScale(m, scale, m);
     *
     * @see Matrix4.fromScale
     * @see Matrix4.multiplyByUniformScale
     */
    Matrix4.multiplyByScale = function(matrix, scale, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.object('matrix', matrix);
        Check.Check.typeOf.object('scale', scale);
        Check.Check.typeOf.object('result', result);
        //>>includeEnd('debug');

        var scaleX = scale.x;
        var scaleY = scale.y;
        var scaleZ = scale.z;

        // Faster than Cartesian3.equals
        if ((scaleX === 1.0) && (scaleY === 1.0) && (scaleZ === 1.0)) {
            return Matrix4.clone(matrix, result);
        }

        result[0] = scaleX * matrix[0];
        result[1] = scaleX * matrix[1];
        result[2] = scaleX * matrix[2];
        result[3] = 0.0;
        result[4] = scaleY * matrix[4];
        result[5] = scaleY * matrix[5];
        result[6] = scaleY * matrix[6];
        result[7] = 0.0;
        result[8] = scaleZ * matrix[8];
        result[9] = scaleZ * matrix[9];
        result[10] = scaleZ * matrix[10];
        result[11] = 0.0;
        result[12] = matrix[12];
        result[13] = matrix[13];
        result[14] = matrix[14];
        result[15] = 1.0;
        return result;
    };

    /**
     * Computes the product of a matrix and a column vector.
     *
     * @param {Matrix4} matrix The matrix.
     * @param {Cartesian4} cartesian The vector.
     * @param {Cartesian4} result The object onto which to store the result.
     * @returns {Cartesian4} The modified result parameter.
     */
    Matrix4.multiplyByVector = function(matrix, cartesian, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.object('matrix', matrix);
        Check.Check.typeOf.object('cartesian', cartesian);
        Check.Check.typeOf.object('result', result);
        //>>includeEnd('debug');

        var vX = cartesian.x;
        var vY = cartesian.y;
        var vZ = cartesian.z;
        var vW = cartesian.w;

        var x = matrix[0] * vX + matrix[4] * vY + matrix[8] * vZ + matrix[12] * vW;
        var y = matrix[1] * vX + matrix[5] * vY + matrix[9] * vZ + matrix[13] * vW;
        var z = matrix[2] * vX + matrix[6] * vY + matrix[10] * vZ + matrix[14] * vW;
        var w = matrix[3] * vX + matrix[7] * vY + matrix[11] * vZ + matrix[15] * vW;

        result.x = x;
        result.y = y;
        result.z = z;
        result.w = w;
        return result;
    };

    /**
     * Computes the product of a matrix and a {@link Cartesian3}.  This is equivalent to calling {@link Matrix4.multiplyByVector}
     * with a {@link Cartesian4} with a <code>w</code> component of zero.
     *
     * @param {Matrix4} matrix The matrix.
     * @param {Cartesian3} cartesian The point.
     * @param {Cartesian3} result The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter.
     *
     * @example
     * var p = new Cesium.Cartesian3(1.0, 2.0, 3.0);
     * var result = Cesium.Matrix4.multiplyByPointAsVector(matrix, p, new Cesium.Cartesian3());
     * // A shortcut for
     * //   Cartesian3 p = ...
     * //   Cesium.Matrix4.multiplyByVector(matrix, new Cesium.Cartesian4(p.x, p.y, p.z, 0.0), result);
     */
    Matrix4.multiplyByPointAsVector = function(matrix, cartesian, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.object('matrix', matrix);
        Check.Check.typeOf.object('cartesian', cartesian);
        Check.Check.typeOf.object('result', result);
        //>>includeEnd('debug');

        var vX = cartesian.x;
        var vY = cartesian.y;
        var vZ = cartesian.z;

        var x = matrix[0] * vX + matrix[4] * vY + matrix[8] * vZ;
        var y = matrix[1] * vX + matrix[5] * vY + matrix[9] * vZ;
        var z = matrix[2] * vX + matrix[6] * vY + matrix[10] * vZ;

        result.x = x;
        result.y = y;
        result.z = z;
        return result;
    };

    /**
     * Computes the product of a matrix and a {@link Cartesian3}. This is equivalent to calling {@link Matrix4.multiplyByVector}
     * with a {@link Cartesian4} with a <code>w</code> component of 1, but returns a {@link Cartesian3} instead of a {@link Cartesian4}.
     *
     * @param {Matrix4} matrix The matrix.
     * @param {Cartesian3} cartesian The point.
     * @param {Cartesian3} result The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter.
     *
     * @example
     * var p = new Cesium.Cartesian3(1.0, 2.0, 3.0);
     * var result = Cesium.Matrix4.multiplyByPoint(matrix, p, new Cesium.Cartesian3());
     */
    Matrix4.multiplyByPoint = function(matrix, cartesian, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.object('matrix', matrix);
        Check.Check.typeOf.object('cartesian', cartesian);
        Check.Check.typeOf.object('result', result);
        //>>includeEnd('debug');

        var vX = cartesian.x;
        var vY = cartesian.y;
        var vZ = cartesian.z;

        var x = matrix[0] * vX + matrix[4] * vY + matrix[8] * vZ + matrix[12];
        var y = matrix[1] * vX + matrix[5] * vY + matrix[9] * vZ + matrix[13];
        var z = matrix[2] * vX + matrix[6] * vY + matrix[10] * vZ + matrix[14];

        result.x = x;
        result.y = y;
        result.z = z;
        return result;
    };

    /**
     * Computes the product of a matrix and a scalar.
     *
     * @param {Matrix4} matrix The matrix.
     * @param {Number} scalar The number to multiply by.
     * @param {Matrix4} result The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter.
     *
     * @example
     * //create a Matrix4 instance which is a scaled version of the supplied Matrix4
     * // m = [10.0, 11.0, 12.0, 13.0]
     * //     [14.0, 15.0, 16.0, 17.0]
     * //     [18.0, 19.0, 20.0, 21.0]
     * //     [22.0, 23.0, 24.0, 25.0]
     *
     * var a = Cesium.Matrix4.multiplyByScalar(m, -2, new Cesium.Matrix4());
     *
     * // m remains the same
     * // a = [-20.0, -22.0, -24.0, -26.0]
     * //     [-28.0, -30.0, -32.0, -34.0]
     * //     [-36.0, -38.0, -40.0, -42.0]
     * //     [-44.0, -46.0, -48.0, -50.0]
     */
    Matrix4.multiplyByScalar = function(matrix, scalar, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.object('matrix', matrix);
        Check.Check.typeOf.number('scalar', scalar);
        Check.Check.typeOf.object('result', result);
        //>>includeEnd('debug');

        result[0] = matrix[0] * scalar;
        result[1] = matrix[1] * scalar;
        result[2] = matrix[2] * scalar;
        result[3] = matrix[3] * scalar;
        result[4] = matrix[4] * scalar;
        result[5] = matrix[5] * scalar;
        result[6] = matrix[6] * scalar;
        result[7] = matrix[7] * scalar;
        result[8] = matrix[8] * scalar;
        result[9] = matrix[9] * scalar;
        result[10] = matrix[10] * scalar;
        result[11] = matrix[11] * scalar;
        result[12] = matrix[12] * scalar;
        result[13] = matrix[13] * scalar;
        result[14] = matrix[14] * scalar;
        result[15] = matrix[15] * scalar;
        return result;
    };

    /**
     * Compute the product of a matrix and a plane.
     * @param matrix
     * @param plane
     * @param result
     * @returns {*}
     */
    Matrix4.multiplyByPlane = function(matrix, plane, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.object('matrix', matrix);
        Check.Check.typeOf.object('plane', plane);
        Check.Check.typeOf.object('result', result);
        //>>includeEnd('debug');

        var inverseMat = new Matrix4();
        var invTrans = new Matrix4();
        Matrix4.inverse(matrix, inverseMat);
        Matrix4.transpose(inverseMat, invTrans);
        var v4 = new Cartesian4.Cartesian4(plane.normal.x, plane.normal.y, plane.normal.z, plane.distance);
        Matrix4.multiplyByVector(invTrans, v4, v4);

        result.normal.x = v4.x;
        result.normal.y = v4.y;
        result.normal.z = v4.z;
        var length = Cartographic.Cartesian3.magnitude(result.normal);
        Cartographic.Cartesian3.normalize(result.normal, result.normal);
        result.distance = v4.w / length;
        return result;
    };

    /**
     * Computes a negated copy of the provided matrix.
     *
     * @param {Matrix4} matrix The matrix to negate.
     * @param {Matrix4} result The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter.
     *
     * @example
     * //create a new Matrix4 instance which is a negation of a Matrix4
     * // m = [10.0, 11.0, 12.0, 13.0]
     * //     [14.0, 15.0, 16.0, 17.0]
     * //     [18.0, 19.0, 20.0, 21.0]
     * //     [22.0, 23.0, 24.0, 25.0]
     *
     * var a = Cesium.Matrix4.negate(m, new Cesium.Matrix4());
     *
     * // m remains the same
     * // a = [-10.0, -11.0, -12.0, -13.0]
     * //     [-14.0, -15.0, -16.0, -17.0]
     * //     [-18.0, -19.0, -20.0, -21.0]
     * //     [-22.0, -23.0, -24.0, -25.0]
     */
    Matrix4.negate = function(matrix, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.object('matrix', matrix);
        Check.Check.typeOf.object('result', result);
        //>>includeEnd('debug');

        result[0] = -matrix[0];
        result[1] = -matrix[1];
        result[2] = -matrix[2];
        result[3] = -matrix[3];
        result[4] = -matrix[4];
        result[5] = -matrix[5];
        result[6] = -matrix[6];
        result[7] = -matrix[7];
        result[8] = -matrix[8];
        result[9] = -matrix[9];
        result[10] = -matrix[10];
        result[11] = -matrix[11];
        result[12] = -matrix[12];
        result[13] = -matrix[13];
        result[14] = -matrix[14];
        result[15] = -matrix[15];
        return result;
    };

    /**
     * Computes the transpose of the provided matrix.
     *
     * @param {Matrix4} matrix The matrix to transpose.
     * @param {Matrix4} result The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter.
     *
     * @example
     * //returns transpose of a Matrix4
     * // m = [10.0, 11.0, 12.0, 13.0]
     * //     [14.0, 15.0, 16.0, 17.0]
     * //     [18.0, 19.0, 20.0, 21.0]
     * //     [22.0, 23.0, 24.0, 25.0]
     *
     * var a = Cesium.Matrix4.transpose(m, new Cesium.Matrix4());
     *
     * // m remains the same
     * // a = [10.0, 14.0, 18.0, 22.0]
     * //     [11.0, 15.0, 19.0, 23.0]
     * //     [12.0, 16.0, 20.0, 24.0]
     * //     [13.0, 17.0, 21.0, 25.0]
     */
    Matrix4.transpose = function(matrix, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.object('matrix', matrix);
        Check.Check.typeOf.object('result', result);
        //>>includeEnd('debug');

        var matrix1 = matrix[1];
        var matrix2 = matrix[2];
        var matrix3 = matrix[3];
        var matrix6 = matrix[6];
        var matrix7 = matrix[7];
        var matrix11 = matrix[11];

        result[0] = matrix[0];
        result[1] = matrix[4];
        result[2] = matrix[8];
        result[3] = matrix[12];
        result[4] = matrix1;
        result[5] = matrix[5];
        result[6] = matrix[9];
        result[7] = matrix[13];
        result[8] = matrix2;
        result[9] = matrix6;
        result[10] = matrix[10];
        result[11] = matrix[14];
        result[12] = matrix3;
        result[13] = matrix7;
        result[14] = matrix11;
        result[15] = matrix[15];
        return result;
    };

    /**
     * Computes a matrix, which contains the absolute (unsigned) values of the provided matrix's elements.
     *
     * @param {Matrix4} matrix The matrix with signed elements.
     * @param {Matrix4} result The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter.
     */
    Matrix4.abs = function(matrix, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.object('matrix', matrix);
        Check.Check.typeOf.object('result', result);
        //>>includeEnd('debug');

        result[0] = Math.abs(matrix[0]);
        result[1] = Math.abs(matrix[1]);
        result[2] = Math.abs(matrix[2]);
        result[3] = Math.abs(matrix[3]);
        result[4] = Math.abs(matrix[4]);
        result[5] = Math.abs(matrix[5]);
        result[6] = Math.abs(matrix[6]);
        result[7] = Math.abs(matrix[7]);
        result[8] = Math.abs(matrix[8]);
        result[9] = Math.abs(matrix[9]);
        result[10] = Math.abs(matrix[10]);
        result[11] = Math.abs(matrix[11]);
        result[12] = Math.abs(matrix[12]);
        result[13] = Math.abs(matrix[13]);
        result[14] = Math.abs(matrix[14]);
        result[15] = Math.abs(matrix[15]);

        return result;
    };

    /**
     * Compares the provided matrices componentwise and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     *
     * @param {Matrix4} [left] The first matrix.
     * @param {Matrix4} [right] The second matrix.
     * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
     *
     * @example
     * //compares two Matrix4 instances
     *
     * // a = [10.0, 14.0, 18.0, 22.0]
     * //     [11.0, 15.0, 19.0, 23.0]
     * //     [12.0, 16.0, 20.0, 24.0]
     * //     [13.0, 17.0, 21.0, 25.0]
     *
     * // b = [10.0, 14.0, 18.0, 22.0]
     * //     [11.0, 15.0, 19.0, 23.0]
     * //     [12.0, 16.0, 20.0, 24.0]
     * //     [13.0, 17.0, 21.0, 25.0]
     *
     * if(Cesium.Matrix4.equals(a,b)) {
     *      console.log("Both matrices are equal");
     * } else {
     *      console.log("They are not equal");
     * }
     *
     * //Prints "Both matrices are equal" on the console
     */
    Matrix4.equals = function(left, right) {
        // Given that most matrices will be transformation matrices, the elements
        // are tested in order such that the test is likely to fail as early
        // as possible.  I _think_ this is just as friendly to the L1 cache
        // as testing in index order.  It is certainty faster in practice.
        return (left === right) ||
               (when.defined(left) &&
                when.defined(right) &&
                // Translation
                left[12] === right[12] &&
                left[13] === right[13] &&
                left[14] === right[14] &&

                // Rotation/scale
                left[0] === right[0] &&
                left[1] === right[1] &&
                left[2] === right[2] &&
                left[4] === right[4] &&
                left[5] === right[5] &&
                left[6] === right[6] &&
                left[8] === right[8] &&
                left[9] === right[9] &&
                left[10] === right[10] &&

                // Bottom row
                left[3] === right[3] &&
                left[7] === right[7] &&
                left[11] === right[11] &&
                left[15] === right[15]);
    };

    /**
     * Compares the provided matrices componentwise and returns
     * <code>true</code> if they are within the provided epsilon,
     * <code>false</code> otherwise.
     *
     * @param {Matrix4} [left] The first matrix.
     * @param {Matrix4} [right] The second matrix.
     * @param {Number} epsilon The epsilon to use for equality testing.
     * @returns {Boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
     *
     * @example
     * //compares two Matrix4 instances
     *
     * // a = [10.5, 14.5, 18.5, 22.5]
     * //     [11.5, 15.5, 19.5, 23.5]
     * //     [12.5, 16.5, 20.5, 24.5]
     * //     [13.5, 17.5, 21.5, 25.5]
     *
     * // b = [10.0, 14.0, 18.0, 22.0]
     * //     [11.0, 15.0, 19.0, 23.0]
     * //     [12.0, 16.0, 20.0, 24.0]
     * //     [13.0, 17.0, 21.0, 25.0]
     *
     * if(Cesium.Matrix4.equalsEpsilon(a,b,0.1)){
     *      console.log("Difference between both the matrices is less than 0.1");
     * } else {
     *      console.log("Difference between both the matrices is not less than 0.1");
     * }
     *
     * //Prints "Difference between both the matrices is not less than 0.1" on the console
     */
    Matrix4.equalsEpsilon = function(left, right, epsilon) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.number('epsilon', epsilon);
        //>>includeEnd('debug');

        return (left === right) ||
                (when.defined(left) &&
                when.defined(right) &&
                Math.abs(left[0] - right[0]) <= epsilon &&
                Math.abs(left[1] - right[1]) <= epsilon &&
                Math.abs(left[2] - right[2]) <= epsilon &&
                Math.abs(left[3] - right[3]) <= epsilon &&
                Math.abs(left[4] - right[4]) <= epsilon &&
                Math.abs(left[5] - right[5]) <= epsilon &&
                Math.abs(left[6] - right[6]) <= epsilon &&
                Math.abs(left[7] - right[7]) <= epsilon &&
                Math.abs(left[8] - right[8]) <= epsilon &&
                Math.abs(left[9] - right[9]) <= epsilon &&
                Math.abs(left[10] - right[10]) <= epsilon &&
                Math.abs(left[11] - right[11]) <= epsilon &&
                Math.abs(left[12] - right[12]) <= epsilon &&
                Math.abs(left[13] - right[13]) <= epsilon &&
                Math.abs(left[14] - right[14]) <= epsilon &&
                Math.abs(left[15] - right[15]) <= epsilon);
    };

    /**
     * Gets the translation portion of the provided matrix, assuming the matrix is a affine transformation matrix.
     *
     * @param {Matrix4} matrix The matrix to use.
     * @param {Cartesian3} result The object onto which to store the result.
     * @returns {Cartesian3} The modified result parameter.
     */
    Matrix4.getTranslation = function(matrix, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.object('matrix', matrix);
        Check.Check.typeOf.object('result', result);
        //>>includeEnd('debug');

        result.x = matrix[12];
        result.y = matrix[13];
        result.z = matrix[14];
        return result;
    };

    /**
     * Gets the upper left 3x3 rotation matrix of the provided matrix, assuming the matrix is an affine transformation matrix.
     *
     * @param {Matrix4} matrix The matrix to use.
     * @param {Matrix3} result The object onto which to store the result.
     * @returns {Matrix3} The modified result parameter.
     *
     * @example
     * // returns a Matrix3 instance from a Matrix4 instance
     *
     * // m = [10.0, 14.0, 18.0, 22.0]
     * //     [11.0, 15.0, 19.0, 23.0]
     * //     [12.0, 16.0, 20.0, 24.0]
     * //     [13.0, 17.0, 21.0, 25.0]
     *
     * var b = new Cesium.Matrix3();
     * Cesium.Matrix4.getMatrix3(m,b);
     *
     * // b = [10.0, 14.0, 18.0]
     * //     [11.0, 15.0, 19.0]
     * //     [12.0, 16.0, 20.0]
     */
    Matrix4.getMatrix3 = function(matrix, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.object('matrix', matrix);
        Check.Check.typeOf.object('result', result);
        //>>includeEnd('debug');

        result[0] = matrix[0];
        result[1] = matrix[1];
        result[2] = matrix[2];
        result[3] = matrix[4];
        result[4] = matrix[5];
        result[5] = matrix[6];
        result[6] = matrix[8];
        result[7] = matrix[9];
        result[8] = matrix[10];
        return result;
    };

    /**
     * Gets the upper left 3x3 rotation matrix of the provided matrix, assuming the matrix is a affine transformation matrix.
     *
     * @param {Matrix4} matrix The matrix to use.
     * @param {Matrix3} result The object onto which to store the result.
     * @returns {Matrix3} The modified result parameter.
     *
     * @example
     * // returns a Matrix3 instance from a Matrix4 instance
     *
     * // m = [10.0, 14.0, 18.0, 22.0]
     * //     [11.0, 15.0, 19.0, 23.0]
     * //     [12.0, 16.0, 20.0, 24.0]
     * //     [13.0, 17.0, 21.0, 25.0]
     *
     * var b = new Cesium.Matrix3();
     * Cesium.Matrix4.getRotation(m,b);
     *
     * // b = [10.0, 14.0, 18.0]
     * //     [11.0, 15.0, 19.0]
     * //     [12.0, 16.0, 20.0]
     */
    Matrix4.getRotation = function(matrix, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.object('matrix', matrix);
        Check.Check.typeOf.object('result', result);
        //>>includeEnd('debug');

        result[0] = matrix[0];
        result[1] = matrix[1];
        result[2] = matrix[2];
        result[3] = matrix[4];
        result[4] = matrix[5];
        result[5] = matrix[6];
        result[6] = matrix[8];
        result[7] = matrix[9];
        result[8] = matrix[10];
        return result;
    };

    var scratchInverseRotation = new Matrix3();
    var scratchMatrix3Zero = new Matrix3();
    var scratchBottomRow = new Cartesian4.Cartesian4();
    var scratchExpectedBottomRow = new Cartesian4.Cartesian4(0.0, 0.0, 0.0, 1.0);

     /**
      * Computes the inverse of the provided matrix using Cramers Rule.
      * If the determinant is zero, the matrix can not be inverted, and an exception is thrown.
      * If the matrix is an affine transformation matrix, it is more efficient
      * to invert it with {@link Matrix4.inverseTransformation}.
      *
      * @param {Matrix4} matrix The matrix to invert.
      * @param {Matrix4} result The object onto which to store the result.
      * @returns {Matrix4} The modified result parameter.
      *
      * @exception {RuntimeError} matrix is not invertible because its determinate is zero.
      */
    Matrix4.inverse = function(matrix, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.object('matrix', matrix);
        Check.Check.typeOf.object('result', result);
        //>>includeEnd('debug');
        //
        // Ported from:
        //   ftp://download.intel.com/design/PentiumIII/sml/24504301.pdf
        //
        var src0 = matrix[0];
        var src1 = matrix[4];
        var src2 = matrix[8];
        var src3 = matrix[12];
        var src4 = matrix[1];
        var src5 = matrix[5];
        var src6 = matrix[9];
        var src7 = matrix[13];
        var src8 = matrix[2];
        var src9 = matrix[6];
        var src10 = matrix[10];
        var src11 = matrix[14];
        var src12 = matrix[3];
        var src13 = matrix[7];
        var src14 = matrix[11];
        var src15 = matrix[15];

        // calculate pairs for first 8 elements (cofactors)
        var tmp0 = src10 * src15;
        var tmp1 = src11 * src14;
        var tmp2 = src9 * src15;
        var tmp3 = src11 * src13;
        var tmp4 = src9 * src14;
        var tmp5 = src10 * src13;
        var tmp6 = src8 * src15;
        var tmp7 = src11 * src12;
        var tmp8 = src8 * src14;
        var tmp9 = src10 * src12;
        var tmp10 = src8 * src13;
        var tmp11 = src9 * src12;

        // calculate first 8 elements (cofactors)
        var dst0 = (tmp0 * src5 + tmp3 * src6 + tmp4 * src7) - (tmp1 * src5 + tmp2 * src6 + tmp5 * src7);
        var dst1 = (tmp1 * src4 + tmp6 * src6 + tmp9 * src7) - (tmp0 * src4 + tmp7 * src6 + tmp8 * src7);
        var dst2 = (tmp2 * src4 + tmp7 * src5 + tmp10 * src7) - (tmp3 * src4 + tmp6 * src5 + tmp11 * src7);
        var dst3 = (tmp5 * src4 + tmp8 * src5 + tmp11 * src6) - (tmp4 * src4 + tmp9 * src5 + tmp10 * src6);
        var dst4 = (tmp1 * src1 + tmp2 * src2 + tmp5 * src3) - (tmp0 * src1 + tmp3 * src2 + tmp4 * src3);
        var dst5 = (tmp0 * src0 + tmp7 * src2 + tmp8 * src3) - (tmp1 * src0 + tmp6 * src2 + tmp9 * src3);
        var dst6 = (tmp3 * src0 + tmp6 * src1 + tmp11 * src3) - (tmp2 * src0 + tmp7 * src1 + tmp10 * src3);
        var dst7 = (tmp4 * src0 + tmp9 * src1 + tmp10 * src2) - (tmp5 * src0 + tmp8 * src1 + tmp11 * src2);

        // calculate pairs for second 8 elements (cofactors)
        tmp0 = src2 * src7;
        tmp1 = src3 * src6;
        tmp2 = src1 * src7;
        tmp3 = src3 * src5;
        tmp4 = src1 * src6;
        tmp5 = src2 * src5;
        tmp6 = src0 * src7;
        tmp7 = src3 * src4;
        tmp8 = src0 * src6;
        tmp9 = src2 * src4;
        tmp10 = src0 * src5;
        tmp11 = src1 * src4;

        // calculate second 8 elements (cofactors)
        var dst8 = (tmp0 * src13 + tmp3 * src14 + tmp4 * src15) - (tmp1 * src13 + tmp2 * src14 + tmp5 * src15);
        var dst9 = (tmp1 * src12 + tmp6 * src14 + tmp9 * src15) - (tmp0 * src12 + tmp7 * src14 + tmp8 * src15);
        var dst10 = (tmp2 * src12 + tmp7 * src13 + tmp10 * src15) - (tmp3 * src12 + tmp6 * src13 + tmp11 * src15);
        var dst11 = (tmp5 * src12 + tmp8 * src13 + tmp11 * src14) - (tmp4 * src12 + tmp9 * src13 + tmp10 * src14);
        var dst12 = (tmp2 * src10 + tmp5 * src11 + tmp1 * src9) - (tmp4 * src11 + tmp0 * src9 + tmp3 * src10);
        var dst13 = (tmp8 * src11 + tmp0 * src8 + tmp7 * src10) - (tmp6 * src10 + tmp9 * src11 + tmp1 * src8);
        var dst14 = (tmp6 * src9 + tmp11 * src11 + tmp3 * src8) - (tmp10 * src11 + tmp2 * src8 + tmp7 * src9);
        var dst15 = (tmp10 * src10 + tmp4 * src8 + tmp9 * src9) - (tmp8 * src9 + tmp11 * src10 + tmp5 * src8);

        // calculate determinant
        var det = src0 * dst0 + src1 * dst1 + src2 * dst2 + src3 * dst3;

        if (Math.abs(det) < _Math.CesiumMath.EPSILON21) {
                // Special case for a zero scale matrix that can occur, for example,
                // when a model's node has a [0, 0, 0] scale.
                if (Matrix3.equalsEpsilon(Matrix4.getRotation(matrix, scratchInverseRotation), scratchMatrix3Zero, _Math.CesiumMath.EPSILON7) &&
                Cartesian4.Cartesian4.equals(Matrix4.getRow(matrix, 3, scratchBottomRow), scratchExpectedBottomRow)) {

                result[0] = 0.0;
                result[1] = 0.0;
                result[2] = 0.0;
                result[3] = 0.0;
                result[4] = 0.0;
                result[5] = 0.0;
                result[6] = 0.0;
                result[7] = 0.0;
                result[8] = 0.0;
                result[9] = 0.0;
                result[10] = 0.0;
                result[11] = 0.0;
                result[12] = -matrix[12];
                result[13] = -matrix[13];
                result[14] = -matrix[14];
                result[15] = 1.0;
                return result;
            }

            throw new RuntimeError.RuntimeError('matrix is not invertible because its determinate is zero.');
        }

        // calculate matrix inverse
        det = 1.0 / det;

        result[0] = dst0 * det;
        result[1] = dst1 * det;
        result[2] = dst2 * det;
        result[3] = dst3 * det;
        result[4] = dst4 * det;
        result[5] = dst5 * det;
        result[6] = dst6 * det;
        result[7] = dst7 * det;
        result[8] = dst8 * det;
        result[9] = dst9 * det;
        result[10] = dst10 * det;
        result[11] = dst11 * det;
        result[12] = dst12 * det;
        result[13] = dst13 * det;
        result[14] = dst14 * det;
        result[15] = dst15 * det;
        return result;
    };

    /**
     * Computes the inverse of the provided matrix assuming it is
     * an affine transformation matrix, where the upper left 3x3 elements
     * are a rotation matrix, and the upper three elements in the fourth
     * column are the translation.  The bottom row is assumed to be [0, 0, 0, 1].
     * The matrix is not verified to be in the proper form.
     * This method is faster than computing the inverse for a general 4x4
     * matrix using {@link Matrix4.inverse}.
     *
     * @param {Matrix4} matrix The matrix to invert.
     * @param {Matrix4} result The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter.
     */
    Matrix4.inverseTransformation = function(matrix, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.object('matrix', matrix);
        Check.Check.typeOf.object('result', result);
        //>>includeEnd('debug');

        //This function is an optimized version of the below 4 lines.
        //var rT = Matrix3.transpose(Matrix4.getRotation(matrix));
        //var rTN = Matrix3.negate(rT);
        //var rTT = Matrix3.multiplyByVector(rTN, Matrix4.getTranslation(matrix));
        //return Matrix4.fromRotationTranslation(rT, rTT, result);

        var matrix0 = matrix[0];
        var matrix1 = matrix[1];
        var matrix2 = matrix[2];
        var matrix4 = matrix[4];
        var matrix5 = matrix[5];
        var matrix6 = matrix[6];
        var matrix8 = matrix[8];
        var matrix9 = matrix[9];
        var matrix10 = matrix[10];

        var vX = matrix[12];
        var vY = matrix[13];
        var vZ = matrix[14];

        var x = -matrix0 * vX - matrix1 * vY - matrix2 * vZ;
        var y = -matrix4 * vX - matrix5 * vY - matrix6 * vZ;
        var z = -matrix8 * vX - matrix9 * vY - matrix10 * vZ;

        result[0] = matrix0;
        result[1] = matrix4;
        result[2] = matrix8;
        result[3] = 0.0;
        result[4] = matrix1;
        result[5] = matrix5;
        result[6] = matrix9;
        result[7] = 0.0;
        result[8] = matrix2;
        result[9] = matrix6;
        result[10] = matrix10;
        result[11] = 0.0;
        result[12] = x;
        result[13] = y;
        result[14] = z;
        result[15] = 1.0;
        return result;
    };

    /**
     * An immutable Matrix4 instance initialized to the identity matrix.
     *
     * @type {Matrix4}
     * @constant
     */
    Matrix4.IDENTITY = Object.freeze(new Matrix4(1.0, 0.0, 0.0, 0.0,
                                                0.0, 1.0, 0.0, 0.0,
                                                0.0, 0.0, 1.0, 0.0,
                                                0.0, 0.0, 0.0, 1.0));

    /**
     * An immutable Matrix4 instance initialized to the zero matrix.
     *
     * @type {Matrix4}
     * @constant
     */
    Matrix4.ZERO = Object.freeze(new Matrix4(0.0, 0.0, 0.0, 0.0,
                                            0.0, 0.0, 0.0, 0.0,
                                            0.0, 0.0, 0.0, 0.0,
                                            0.0, 0.0, 0.0, 0.0));

    /**
     * The index into Matrix4 for column 0, row 0.
     *
     * @type {Number}
     * @constant
     */
    Matrix4.COLUMN0ROW0 = 0;

    /**
     * The index into Matrix4 for column 0, row 1.
     *
     * @type {Number}
     * @constant
     */
    Matrix4.COLUMN0ROW1 = 1;

    /**
     * The index into Matrix4 for column 0, row 2.
     *
     * @type {Number}
     * @constant
     */
    Matrix4.COLUMN0ROW2 = 2;

    /**
     * The index into Matrix4 for column 0, row 3.
     *
     * @type {Number}
     * @constant
     */
    Matrix4.COLUMN0ROW3 = 3;

    /**
     * The index into Matrix4 for column 1, row 0.
     *
     * @type {Number}
     * @constant
     */
    Matrix4.COLUMN1ROW0 = 4;

    /**
     * The index into Matrix4 for column 1, row 1.
     *
     * @type {Number}
     * @constant
     */
    Matrix4.COLUMN1ROW1 = 5;

    /**
     * The index into Matrix4 for column 1, row 2.
     *
     * @type {Number}
     * @constant
     */
    Matrix4.COLUMN1ROW2 = 6;

    /**
     * The index into Matrix4 for column 1, row 3.
     *
     * @type {Number}
     * @constant
     */
    Matrix4.COLUMN1ROW3 = 7;

    /**
     * The index into Matrix4 for column 2, row 0.
     *
     * @type {Number}
     * @constant
     */
    Matrix4.COLUMN2ROW0 = 8;

    /**
     * The index into Matrix4 for column 2, row 1.
     *
     * @type {Number}
     * @constant
     */
    Matrix4.COLUMN2ROW1 = 9;

    /**
     * The index into Matrix4 for column 2, row 2.
     *
     * @type {Number}
     * @constant
     */
    Matrix4.COLUMN2ROW2 = 10;

    /**
     * The index into Matrix4 for column 2, row 3.
     *
     * @type {Number}
     * @constant
     */
    Matrix4.COLUMN2ROW3 = 11;

    /**
     * The index into Matrix4 for column 3, row 0.
     *
     * @type {Number}
     * @constant
     */
    Matrix4.COLUMN3ROW0 = 12;

    /**
     * The index into Matrix4 for column 3, row 1.
     *
     * @type {Number}
     * @constant
     */
    Matrix4.COLUMN3ROW1 = 13;

    /**
     * The index into Matrix4 for column 3, row 2.
     *
     * @type {Number}
     * @constant
     */
    Matrix4.COLUMN3ROW2 = 14;

    /**
     * The index into Matrix4 for column 3, row 3.
     *
     * @type {Number}
     * @constant
     */
    Matrix4.COLUMN3ROW3 = 15;

    Object.defineProperties(Matrix4.prototype, {
        /**
         * Gets the number of items in the collection.
         * @memberof Matrix4.prototype
         *
         * @type {Number}
         */
        length : {
            get : function() {
                return Matrix4.packedLength;
            }
        }
    });

    /**
     * Duplicates the provided Matrix4 instance.
     *
     * @param {Matrix4} [result] The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if one was not provided.
     */
    Matrix4.prototype.clone = function(result) {
        return Matrix4.clone(this, result);
    };

    /**
     * Compares this matrix to the provided matrix componentwise and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     *
     * @param {Matrix4} [right] The right hand side matrix.
     * @returns {Boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
     */
    Matrix4.prototype.equals = function(right) {
        return Matrix4.equals(this, right);
    };

    /**
     * @private
     */
    Matrix4.equalsArray = function(matrix, array, offset) {
        return matrix[0] === array[offset] &&
               matrix[1] === array[offset + 1] &&
               matrix[2] === array[offset + 2] &&
               matrix[3] === array[offset + 3] &&
               matrix[4] === array[offset + 4] &&
               matrix[5] === array[offset + 5] &&
               matrix[6] === array[offset + 6] &&
               matrix[7] === array[offset + 7] &&
               matrix[8] === array[offset + 8] &&
               matrix[9] === array[offset + 9] &&
               matrix[10] === array[offset + 10] &&
               matrix[11] === array[offset + 11] &&
               matrix[12] === array[offset + 12] &&
               matrix[13] === array[offset + 13] &&
               matrix[14] === array[offset + 14] &&
               matrix[15] === array[offset + 15];
    };

    /**
     * Compares this matrix to the provided matrix componentwise and returns
     * <code>true</code> if they are within the provided epsilon,
     * <code>false</code> otherwise.
     *
     * @param {Matrix4} [right] The right hand side matrix.
     * @param {Number} epsilon The epsilon to use for equality testing.
     * @returns {Boolean} <code>true</code> if they are within the provided epsilon, <code>false</code> otherwise.
     */
    Matrix4.prototype.equalsEpsilon = function(right, epsilon) {
        return Matrix4.equalsEpsilon(this, right, epsilon);
    };

    /**
     * Computes a string representing this Matrix with each row being
     * on a separate line and in the format '(column0, column1, column2, column3)'.
     *
     * @returns {String} A string representing the provided Matrix with each row being on a separate line and in the format '(column0, column1, column2, column3)'.
     */
    Matrix4.prototype.toString = function() {
        return '(' + this[0] + ', ' + this[4] + ', ' + this[8] + ', ' + this[12] +')\n' +
               '(' + this[1] + ', ' + this[5] + ', ' + this[9] + ', ' + this[13] +')\n' +
               '(' + this[2] + ', ' + this[6] + ', ' + this[10] + ', ' + this[14] +')\n' +
               '(' + this[3] + ', ' + this[7] + ', ' + this[11] + ', ' + this[15] +')';
    };

    /**
         * A bounding sphere with a center and a radius.
         * @alias BoundingSphere
         * @constructor
         *
         * @param {Cartesian3} [center=Cartesian3.ZERO] The center of the bounding sphere.
         * @param {Number} [radius=0.0] The radius of the bounding sphere.
         *
         * @see AxisAlignedBoundingBox
         * @see BoundingRectangle
         * @see Packable
         */
        function BoundingSphere(center, radius) {
            /**
             * The center point of the sphere.
             * @type {Cartesian3}
             * @default {@link Cartesian3.ZERO}
             */
            this.center = Cartographic.Cartesian3.clone(when.defaultValue(center, Cartographic.Cartesian3.ZERO));

            /**
             * The radius of the sphere.
             * @type {Number}
             * @default 0.0
             */
            this.radius = when.defaultValue(radius, 0.0);
        }

        var fromPointsXMin = new Cartographic.Cartesian3();
        var fromPointsYMin = new Cartographic.Cartesian3();
        var fromPointsZMin = new Cartographic.Cartesian3();
        var fromPointsXMax = new Cartographic.Cartesian3();
        var fromPointsYMax = new Cartographic.Cartesian3();
        var fromPointsZMax = new Cartographic.Cartesian3();
        var fromPointsCurrentPos = new Cartographic.Cartesian3();
        var fromPointsScratch = new Cartographic.Cartesian3();
        var fromPointsRitterCenter = new Cartographic.Cartesian3();
        var fromPointsMinBoxPt = new Cartographic.Cartesian3();
        var fromPointsMaxBoxPt = new Cartographic.Cartesian3();
        var fromPointsNaiveCenterScratch = new Cartographic.Cartesian3();
        var volumeConstant = (4.0 / 3.0) * _Math.CesiumMath.PI;

        /**
         * Computes a tight-fitting bounding sphere enclosing a list of 3D Cartesian points.
         * The bounding sphere is computed by running two algorithms, a naive algorithm and
         * Ritter's algorithm. The smaller of the two spheres is used to ensure a tight fit.
         *
         * @param {Cartesian3[]} [positions] An array of points that the bounding sphere will enclose.  Each point must have <code>x</code>, <code>y</code>, and <code>z</code> properties.
         * @param {BoundingSphere} [result] The object onto which to store the result.
         * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if one was not provided.
         *
         * @see {@link http://help.agi.com/AGIComponents/html/BlogBoundingSphere.htm|Bounding Sphere computation article}
         */
        BoundingSphere.fromPoints = function(positions, result) {
            if (!when.defined(result)) {
                result = new BoundingSphere();
            }

            if (!when.defined(positions) || positions.length === 0) {
                result.center = Cartographic.Cartesian3.clone(Cartographic.Cartesian3.ZERO, result.center);
                result.radius = 0.0;
                return result;
            }

            var currentPos = Cartographic.Cartesian3.clone(positions[0], fromPointsCurrentPos);

            var xMin = Cartographic.Cartesian3.clone(currentPos, fromPointsXMin);
            var yMin = Cartographic.Cartesian3.clone(currentPos, fromPointsYMin);
            var zMin = Cartographic.Cartesian3.clone(currentPos, fromPointsZMin);

            var xMax = Cartographic.Cartesian3.clone(currentPos, fromPointsXMax);
            var yMax = Cartographic.Cartesian3.clone(currentPos, fromPointsYMax);
            var zMax = Cartographic.Cartesian3.clone(currentPos, fromPointsZMax);

            var numPositions = positions.length;
            var i;
            for (i = 1; i < numPositions; i++) {
                Cartographic.Cartesian3.clone(positions[i], currentPos);

                var x = currentPos.x;
                var y = currentPos.y;
                var z = currentPos.z;

                // Store points containing the the smallest and largest components
                if (x < xMin.x) {
                    Cartographic.Cartesian3.clone(currentPos, xMin);
                }

                if (x > xMax.x) {
                    Cartographic.Cartesian3.clone(currentPos, xMax);
                }

                if (y < yMin.y) {
                    Cartographic.Cartesian3.clone(currentPos, yMin);
                }

                if (y > yMax.y) {
                    Cartographic.Cartesian3.clone(currentPos, yMax);
                }

                if (z < zMin.z) {
                    Cartographic.Cartesian3.clone(currentPos, zMin);
                }

                if (z > zMax.z) {
                    Cartographic.Cartesian3.clone(currentPos, zMax);
                }
            }

            // Compute x-, y-, and z-spans (Squared distances b/n each component's min. and max.).
            var xSpan = Cartographic.Cartesian3.magnitudeSquared(Cartographic.Cartesian3.subtract(xMax, xMin, fromPointsScratch));
            var ySpan = Cartographic.Cartesian3.magnitudeSquared(Cartographic.Cartesian3.subtract(yMax, yMin, fromPointsScratch));
            var zSpan = Cartographic.Cartesian3.magnitudeSquared(Cartographic.Cartesian3.subtract(zMax, zMin, fromPointsScratch));

            // Set the diameter endpoints to the largest span.
            var diameter1 = xMin;
            var diameter2 = xMax;
            var maxSpan = xSpan;
            if (ySpan > maxSpan) {
                maxSpan = ySpan;
                diameter1 = yMin;
                diameter2 = yMax;
            }
            if (zSpan > maxSpan) {
                maxSpan = zSpan;
                diameter1 = zMin;
                diameter2 = zMax;
            }

            // Calculate the center of the initial sphere found by Ritter's algorithm
            var ritterCenter = fromPointsRitterCenter;
            ritterCenter.x = (diameter1.x + diameter2.x) * 0.5;
            ritterCenter.y = (diameter1.y + diameter2.y) * 0.5;
            ritterCenter.z = (diameter1.z + diameter2.z) * 0.5;

            // Calculate the radius of the initial sphere found by Ritter's algorithm
            var radiusSquared = Cartographic.Cartesian3.magnitudeSquared(Cartographic.Cartesian3.subtract(diameter2, ritterCenter, fromPointsScratch));
            var ritterRadius = Math.sqrt(radiusSquared);

            // Find the center of the sphere found using the Naive method.
            var minBoxPt = fromPointsMinBoxPt;
            minBoxPt.x = xMin.x;
            minBoxPt.y = yMin.y;
            minBoxPt.z = zMin.z;

            var maxBoxPt = fromPointsMaxBoxPt;
            maxBoxPt.x = xMax.x;
            maxBoxPt.y = yMax.y;
            maxBoxPt.z = zMax.z;

            var naiveCenter = Cartographic.Cartesian3.midpoint(minBoxPt, maxBoxPt, fromPointsNaiveCenterScratch);

            // Begin 2nd pass to find naive radius and modify the ritter sphere.
            var naiveRadius = 0;
            for (i = 0; i < numPositions; i++) {
                Cartographic.Cartesian3.clone(positions[i], currentPos);

                // Find the furthest point from the naive center to calculate the naive radius.
                var r = Cartographic.Cartesian3.magnitude(Cartographic.Cartesian3.subtract(currentPos, naiveCenter, fromPointsScratch));
                if (r > naiveRadius) {
                    naiveRadius = r;
                }

                // Make adjustments to the Ritter Sphere to include all points.
                var oldCenterToPointSquared = Cartographic.Cartesian3.magnitudeSquared(Cartographic.Cartesian3.subtract(currentPos, ritterCenter, fromPointsScratch));
                if (oldCenterToPointSquared > radiusSquared) {
                    var oldCenterToPoint = Math.sqrt(oldCenterToPointSquared);
                    // Calculate new radius to include the point that lies outside
                    ritterRadius = (ritterRadius + oldCenterToPoint) * 0.5;
                    radiusSquared = ritterRadius * ritterRadius;
                    // Calculate center of new Ritter sphere
                    var oldToNew = oldCenterToPoint - ritterRadius;
                    ritterCenter.x = (ritterRadius * ritterCenter.x + oldToNew * currentPos.x) / oldCenterToPoint;
                    ritterCenter.y = (ritterRadius * ritterCenter.y + oldToNew * currentPos.y) / oldCenterToPoint;
                    ritterCenter.z = (ritterRadius * ritterCenter.z + oldToNew * currentPos.z) / oldCenterToPoint;
                }
            }

            if (ritterRadius < naiveRadius) {
                Cartographic.Cartesian3.clone(ritterCenter, result.center);
                result.radius = ritterRadius;
            } else {
                Cartographic.Cartesian3.clone(naiveCenter, result.center);
                result.radius = naiveRadius;
            }

            return result;
        };

        var defaultProjection = new GeographicProjection();
        var fromRectangle2DLowerLeft = new Cartographic.Cartesian3();
        var fromRectangle2DUpperRight = new Cartographic.Cartesian3();
        var fromRectangle2DSouthwest = new Cartographic.Cartographic();
        var fromRectangle2DNortheast = new Cartographic.Cartographic();

        /**
         * Computes a bounding sphere from a rectangle projected in 2D.
         *
         * @param {Rectangle} [rectangle] The rectangle around which to create a bounding sphere.
         * @param {Object} [projection=GeographicProjection] The projection used to project the rectangle into 2D.
         * @param {BoundingSphere} [result] The object onto which to store the result.
         * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
         */
        BoundingSphere.fromRectangle2D = function(rectangle, projection, result) {
            return BoundingSphere.fromRectangleWithHeights2D(rectangle, projection, 0.0, 0.0, result);
        };

        /**
         * Computes a bounding sphere from a rectangle projected in 2D.  The bounding sphere accounts for the
         * object's minimum and maximum heights over the rectangle.
         *
         * @param {Rectangle} [rectangle] The rectangle around which to create a bounding sphere.
         * @param {Object} [projection=GeographicProjection] The projection used to project the rectangle into 2D.
         * @param {Number} [minimumHeight=0.0] The minimum height over the rectangle.
         * @param {Number} [maximumHeight=0.0] The maximum height over the rectangle.
         * @param {BoundingSphere} [result] The object onto which to store the result.
         * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
         */
        BoundingSphere.fromRectangleWithHeights2D = function(rectangle, projection, minimumHeight, maximumHeight, result) {
            if (!when.defined(result)) {
                result = new BoundingSphere();
            }

            if (!when.defined(rectangle)) {
                result.center = Cartographic.Cartesian3.clone(Cartographic.Cartesian3.ZERO, result.center);
                result.radius = 0.0;
                return result;
            }

            projection = when.defaultValue(projection, defaultProjection);

            Cartesian2.Rectangle.southwest(rectangle, fromRectangle2DSouthwest);
            fromRectangle2DSouthwest.height = minimumHeight;
            Cartesian2.Rectangle.northeast(rectangle, fromRectangle2DNortheast);
            fromRectangle2DNortheast.height = maximumHeight;

            var lowerLeft = projection.project(fromRectangle2DSouthwest, fromRectangle2DLowerLeft);
            var upperRight = projection.project(fromRectangle2DNortheast, fromRectangle2DUpperRight);

            var width = upperRight.x - lowerLeft.x;
            var height = upperRight.y - lowerLeft.y;
            var elevation = upperRight.z - lowerLeft.z;

            result.radius = Math.sqrt(width * width + height * height + elevation * elevation) * 0.5;
            var center = result.center;
            center.x = lowerLeft.x + width * 0.5;
            center.y = lowerLeft.y + height * 0.5;
            center.z = lowerLeft.z + elevation * 0.5;
            return result;
        };

        var fromRectangle3DScratch = [];

        /**
         * Computes a bounding sphere from a rectangle in 3D. The bounding sphere is created using a subsample of points
         * on the ellipsoid and contained in the rectangle. It may not be accurate for all rectangles on all types of ellipsoids.
         *
         * @param {Rectangle} [rectangle] The valid rectangle used to create a bounding sphere.
         * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid used to determine positions of the rectangle.
         * @param {Number} [surfaceHeight=0.0] The height above the surface of the ellipsoid.
         * @param {BoundingSphere} [result] The object onto which to store the result.
         * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
         */
        BoundingSphere.fromRectangle3D = function(rectangle, ellipsoid, surfaceHeight, result) {
            ellipsoid = when.defaultValue(ellipsoid, Cartesian2.Ellipsoid.WGS84);
            surfaceHeight = when.defaultValue(surfaceHeight, 0.0);

            if (!when.defined(result)) {
                result = new BoundingSphere();
            }

            if (!when.defined(rectangle)) {
                result.center = Cartographic.Cartesian3.clone(Cartographic.Cartesian3.ZERO, result.center);
                result.radius = 0.0;
                return result;
            }

            var positions = Cartesian2.Rectangle.subsample(rectangle, ellipsoid, surfaceHeight, fromRectangle3DScratch);
            return BoundingSphere.fromPoints(positions, result);
        };

        /**
         * Computes a tight-fitting bounding sphere enclosing a list of 3D points, where the points are
         * stored in a flat array in X, Y, Z, order.  The bounding sphere is computed by running two
         * algorithms, a naive algorithm and Ritter's algorithm. The smaller of the two spheres is used to
         * ensure a tight fit.
         *
         * @param {Number[]} [positions] An array of points that the bounding sphere will enclose.  Each point
         *        is formed from three elements in the array in the order X, Y, Z.
         * @param {Cartesian3} [center=Cartesian3.ZERO] The position to which the positions are relative, which need not be the
         *        origin of the coordinate system.  This is useful when the positions are to be used for
         *        relative-to-center (RTC) rendering.
         * @param {Number} [stride=3] The number of array elements per vertex.  It must be at least 3, but it may
         *        be higher.  Regardless of the value of this parameter, the X coordinate of the first position
         *        is at array index 0, the Y coordinate is at array index 1, and the Z coordinate is at array index
         *        2.  When stride is 3, the X coordinate of the next position then begins at array index 3.  If
         *        the stride is 5, however, two array elements are skipped and the next position begins at array
         *        index 5.
         * @param {BoundingSphere} [result] The object onto which to store the result.
         * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if one was not provided.
         *
         * @example
         * // Compute the bounding sphere from 3 positions, each specified relative to a center.
         * // In addition to the X, Y, and Z coordinates, the points array contains two additional
         * // elements per point which are ignored for the purpose of computing the bounding sphere.
         * var center = new Cesium.Cartesian3(1.0, 2.0, 3.0);
         * var points = [1.0, 2.0, 3.0, 0.1, 0.2,
         *               4.0, 5.0, 6.0, 0.1, 0.2,
         *               7.0, 8.0, 9.0, 0.1, 0.2];
         * var sphere = Cesium.BoundingSphere.fromVertices(points, center, 5);
         *
         * @see {@link http://blogs.agi.com/insight3d/index.php/2008/02/04/a-bounding/|Bounding Sphere computation article}
         */
        BoundingSphere.fromVertices = function(positions, center, stride, result) {
            if (!when.defined(result)) {
                result = new BoundingSphere();
            }

            if (!when.defined(positions) || positions.length === 0) {
                result.center = Cartographic.Cartesian3.clone(Cartographic.Cartesian3.ZERO, result.center);
                result.radius = 0.0;
                return result;
            }

            center = when.defaultValue(center, Cartographic.Cartesian3.ZERO);

            stride = when.defaultValue(stride, 3);

            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.number.greaterThanOrEquals('stride', stride, 3);
            //>>includeEnd('debug');

            var currentPos = fromPointsCurrentPos;
            currentPos.x = positions[0] + center.x;
            currentPos.y = positions[1] + center.y;
            currentPos.z = positions[2] + center.z;

            var xMin = Cartographic.Cartesian3.clone(currentPos, fromPointsXMin);
            var yMin = Cartographic.Cartesian3.clone(currentPos, fromPointsYMin);
            var zMin = Cartographic.Cartesian3.clone(currentPos, fromPointsZMin);

            var xMax = Cartographic.Cartesian3.clone(currentPos, fromPointsXMax);
            var yMax = Cartographic.Cartesian3.clone(currentPos, fromPointsYMax);
            var zMax = Cartographic.Cartesian3.clone(currentPos, fromPointsZMax);

            var numElements = positions.length;
            var i;
            for (i = 0; i < numElements; i += stride) {
                var x = positions[i] + center.x;
                var y = positions[i + 1] + center.y;
                var z = positions[i + 2] + center.z;

                currentPos.x = x;
                currentPos.y = y;
                currentPos.z = z;

                // Store points containing the the smallest and largest components
                if (x < xMin.x) {
                    Cartographic.Cartesian3.clone(currentPos, xMin);
                }

                if (x > xMax.x) {
                    Cartographic.Cartesian3.clone(currentPos, xMax);
                }

                if (y < yMin.y) {
                    Cartographic.Cartesian3.clone(currentPos, yMin);
                }

                if (y > yMax.y) {
                    Cartographic.Cartesian3.clone(currentPos, yMax);
                }

                if (z < zMin.z) {
                    Cartographic.Cartesian3.clone(currentPos, zMin);
                }

                if (z > zMax.z) {
                    Cartographic.Cartesian3.clone(currentPos, zMax);
                }
            }

            // Compute x-, y-, and z-spans (Squared distances b/n each component's min. and max.).
            var xSpan = Cartographic.Cartesian3.magnitudeSquared(Cartographic.Cartesian3.subtract(xMax, xMin, fromPointsScratch));
            var ySpan = Cartographic.Cartesian3.magnitudeSquared(Cartographic.Cartesian3.subtract(yMax, yMin, fromPointsScratch));
            var zSpan = Cartographic.Cartesian3.magnitudeSquared(Cartographic.Cartesian3.subtract(zMax, zMin, fromPointsScratch));

            // Set the diameter endpoints to the largest span.
            var diameter1 = xMin;
            var diameter2 = xMax;
            var maxSpan = xSpan;
            if (ySpan > maxSpan) {
                maxSpan = ySpan;
                diameter1 = yMin;
                diameter2 = yMax;
            }
            if (zSpan > maxSpan) {
                maxSpan = zSpan;
                diameter1 = zMin;
                diameter2 = zMax;
            }

            // Calculate the center of the initial sphere found by Ritter's algorithm
            var ritterCenter = fromPointsRitterCenter;
            ritterCenter.x = (diameter1.x + diameter2.x) * 0.5;
            ritterCenter.y = (diameter1.y + diameter2.y) * 0.5;
            ritterCenter.z = (diameter1.z + diameter2.z) * 0.5;

            // Calculate the radius of the initial sphere found by Ritter's algorithm
            var radiusSquared = Cartographic.Cartesian3.magnitudeSquared(Cartographic.Cartesian3.subtract(diameter2, ritterCenter, fromPointsScratch));
            var ritterRadius = Math.sqrt(radiusSquared);

            // Find the center of the sphere found using the Naive method.
            var minBoxPt = fromPointsMinBoxPt;
            minBoxPt.x = xMin.x;
            minBoxPt.y = yMin.y;
            minBoxPt.z = zMin.z;

            var maxBoxPt = fromPointsMaxBoxPt;
            maxBoxPt.x = xMax.x;
            maxBoxPt.y = yMax.y;
            maxBoxPt.z = zMax.z;

            var naiveCenter = Cartographic.Cartesian3.midpoint(minBoxPt, maxBoxPt, fromPointsNaiveCenterScratch);

            // Begin 2nd pass to find naive radius and modify the ritter sphere.
            var naiveRadius = 0;
            for (i = 0; i < numElements; i += stride) {
                currentPos.x = positions[i] + center.x;
                currentPos.y = positions[i + 1] + center.y;
                currentPos.z = positions[i + 2] + center.z;

                // Find the furthest point from the naive center to calculate the naive radius.
                var r = Cartographic.Cartesian3.magnitude(Cartographic.Cartesian3.subtract(currentPos, naiveCenter, fromPointsScratch));
                if (r > naiveRadius) {
                    naiveRadius = r;
                }

                // Make adjustments to the Ritter Sphere to include all points.
                var oldCenterToPointSquared = Cartographic.Cartesian3.magnitudeSquared(Cartographic.Cartesian3.subtract(currentPos, ritterCenter, fromPointsScratch));
                if (oldCenterToPointSquared > radiusSquared) {
                    var oldCenterToPoint = Math.sqrt(oldCenterToPointSquared);
                    // Calculate new radius to include the point that lies outside
                    ritterRadius = (ritterRadius + oldCenterToPoint) * 0.5;
                    radiusSquared = ritterRadius * ritterRadius;
                    // Calculate center of new Ritter sphere
                    var oldToNew = oldCenterToPoint - ritterRadius;
                    ritterCenter.x = (ritterRadius * ritterCenter.x + oldToNew * currentPos.x) / oldCenterToPoint;
                    ritterCenter.y = (ritterRadius * ritterCenter.y + oldToNew * currentPos.y) / oldCenterToPoint;
                    ritterCenter.z = (ritterRadius * ritterCenter.z + oldToNew * currentPos.z) / oldCenterToPoint;
                }
            }

            if (ritterRadius < naiveRadius) {
                Cartographic.Cartesian3.clone(ritterCenter, result.center);
                result.radius = ritterRadius;
            } else {
                Cartographic.Cartesian3.clone(naiveCenter, result.center);
                result.radius = naiveRadius;
            }

            return result;
        };

        /**
         * Computes a tight-fitting bounding sphere enclosing a list of EncodedCartesian3s, where the points are
         * stored in parallel flat arrays in X, Y, Z, order.  The bounding sphere is computed by running two
         * algorithms, a naive algorithm and Ritter's algorithm. The smaller of the two spheres is used to
         * ensure a tight fit.
         *
         * @param {Number[]} [positionsHigh] An array of high bits of the encoded cartesians that the bounding sphere will enclose.  Each point
         *        is formed from three elements in the array in the order X, Y, Z.
         * @param {Number[]} [positionsLow] An array of low bits of the encoded cartesians that the bounding sphere will enclose.  Each point
         *        is formed from three elements in the array in the order X, Y, Z.
         * @param {BoundingSphere} [result] The object onto which to store the result.
         * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if one was not provided.
         *
         * @see {@link http://blogs.agi.com/insight3d/index.php/2008/02/04/a-bounding/|Bounding Sphere computation article}
         */
        BoundingSphere.fromEncodedCartesianVertices = function(positionsHigh, positionsLow, result) {
            if (!when.defined(result)) {
                result = new BoundingSphere();
            }

            if (!when.defined(positionsHigh) || !when.defined(positionsLow) || positionsHigh.length !== positionsLow.length || positionsHigh.length === 0) {
                result.center = Cartographic.Cartesian3.clone(Cartographic.Cartesian3.ZERO, result.center);
                result.radius = 0.0;
                return result;
            }

            var currentPos = fromPointsCurrentPos;
            currentPos.x = positionsHigh[0] + positionsLow[0];
            currentPos.y = positionsHigh[1] + positionsLow[1];
            currentPos.z = positionsHigh[2] + positionsLow[2];

            var xMin = Cartographic.Cartesian3.clone(currentPos, fromPointsXMin);
            var yMin = Cartographic.Cartesian3.clone(currentPos, fromPointsYMin);
            var zMin = Cartographic.Cartesian3.clone(currentPos, fromPointsZMin);

            var xMax = Cartographic.Cartesian3.clone(currentPos, fromPointsXMax);
            var yMax = Cartographic.Cartesian3.clone(currentPos, fromPointsYMax);
            var zMax = Cartographic.Cartesian3.clone(currentPos, fromPointsZMax);

            var numElements = positionsHigh.length;
            var i;
            for (i = 0; i < numElements; i += 3) {
                var x = positionsHigh[i] + positionsLow[i];
                var y = positionsHigh[i + 1] + positionsLow[i + 1];
                var z = positionsHigh[i + 2] + positionsLow[i + 2];

                currentPos.x = x;
                currentPos.y = y;
                currentPos.z = z;

                // Store points containing the the smallest and largest components
                if (x < xMin.x) {
                    Cartographic.Cartesian3.clone(currentPos, xMin);
                }

                if (x > xMax.x) {
                    Cartographic.Cartesian3.clone(currentPos, xMax);
                }

                if (y < yMin.y) {
                    Cartographic.Cartesian3.clone(currentPos, yMin);
                }

                if (y > yMax.y) {
                    Cartographic.Cartesian3.clone(currentPos, yMax);
                }

                if (z < zMin.z) {
                    Cartographic.Cartesian3.clone(currentPos, zMin);
                }

                if (z > zMax.z) {
                    Cartographic.Cartesian3.clone(currentPos, zMax);
                }
            }

            // Compute x-, y-, and z-spans (Squared distances b/n each component's min. and max.).
            var xSpan = Cartographic.Cartesian3.magnitudeSquared(Cartographic.Cartesian3.subtract(xMax, xMin, fromPointsScratch));
            var ySpan = Cartographic.Cartesian3.magnitudeSquared(Cartographic.Cartesian3.subtract(yMax, yMin, fromPointsScratch));
            var zSpan = Cartographic.Cartesian3.magnitudeSquared(Cartographic.Cartesian3.subtract(zMax, zMin, fromPointsScratch));

            // Set the diameter endpoints to the largest span.
            var diameter1 = xMin;
            var diameter2 = xMax;
            var maxSpan = xSpan;
            if (ySpan > maxSpan) {
                maxSpan = ySpan;
                diameter1 = yMin;
                diameter2 = yMax;
            }
            if (zSpan > maxSpan) {
                maxSpan = zSpan;
                diameter1 = zMin;
                diameter2 = zMax;
            }

            // Calculate the center of the initial sphere found by Ritter's algorithm
            var ritterCenter = fromPointsRitterCenter;
            ritterCenter.x = (diameter1.x + diameter2.x) * 0.5;
            ritterCenter.y = (diameter1.y + diameter2.y) * 0.5;
            ritterCenter.z = (diameter1.z + diameter2.z) * 0.5;

            // Calculate the radius of the initial sphere found by Ritter's algorithm
            var radiusSquared = Cartographic.Cartesian3.magnitudeSquared(Cartographic.Cartesian3.subtract(diameter2, ritterCenter, fromPointsScratch));
            var ritterRadius = Math.sqrt(radiusSquared);

            // Find the center of the sphere found using the Naive method.
            var minBoxPt = fromPointsMinBoxPt;
            minBoxPt.x = xMin.x;
            minBoxPt.y = yMin.y;
            minBoxPt.z = zMin.z;

            var maxBoxPt = fromPointsMaxBoxPt;
            maxBoxPt.x = xMax.x;
            maxBoxPt.y = yMax.y;
            maxBoxPt.z = zMax.z;

            var naiveCenter = Cartographic.Cartesian3.midpoint(minBoxPt, maxBoxPt, fromPointsNaiveCenterScratch);

            // Begin 2nd pass to find naive radius and modify the ritter sphere.
            var naiveRadius = 0;
            for (i = 0; i < numElements; i += 3) {
                currentPos.x = positionsHigh[i] + positionsLow[i];
                currentPos.y = positionsHigh[i + 1] + positionsLow[i + 1];
                currentPos.z = positionsHigh[i + 2] + positionsLow[i + 2];

                // Find the furthest point from the naive center to calculate the naive radius.
                var r = Cartographic.Cartesian3.magnitude(Cartographic.Cartesian3.subtract(currentPos, naiveCenter, fromPointsScratch));
                if (r > naiveRadius) {
                    naiveRadius = r;
                }

                // Make adjustments to the Ritter Sphere to include all points.
                var oldCenterToPointSquared = Cartographic.Cartesian3.magnitudeSquared(Cartographic.Cartesian3.subtract(currentPos, ritterCenter, fromPointsScratch));
                if (oldCenterToPointSquared > radiusSquared) {
                    var oldCenterToPoint = Math.sqrt(oldCenterToPointSquared);
                    // Calculate new radius to include the point that lies outside
                    ritterRadius = (ritterRadius + oldCenterToPoint) * 0.5;
                    radiusSquared = ritterRadius * ritterRadius;
                    // Calculate center of new Ritter sphere
                    var oldToNew = oldCenterToPoint - ritterRadius;
                    ritterCenter.x = (ritterRadius * ritterCenter.x + oldToNew * currentPos.x) / oldCenterToPoint;
                    ritterCenter.y = (ritterRadius * ritterCenter.y + oldToNew * currentPos.y) / oldCenterToPoint;
                    ritterCenter.z = (ritterRadius * ritterCenter.z + oldToNew * currentPos.z) / oldCenterToPoint;
                }
            }

            if (ritterRadius < naiveRadius) {
                Cartographic.Cartesian3.clone(ritterCenter, result.center);
                result.radius = ritterRadius;
            } else {
                Cartographic.Cartesian3.clone(naiveCenter, result.center);
                result.radius = naiveRadius;
            }

            return result;
        };

        /**
         * Computes a bounding sphere from the corner points of an axis-aligned bounding box.  The sphere
         * tighly and fully encompases the box.
         *
         * @param {Cartesian3} [corner] The minimum height over the rectangle.
         * @param {Cartesian3} [oppositeCorner] The maximum height over the rectangle.
         * @param {BoundingSphere} [result] The object onto which to store the result.
         * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
         *
         * @example
         * // Create a bounding sphere around the unit cube
         * var sphere = Cesium.BoundingSphere.fromCornerPoints(new Cesium.Cartesian3(-0.5, -0.5, -0.5), new Cesium.Cartesian3(0.5, 0.5, 0.5));
         */
        BoundingSphere.fromCornerPoints = function(corner, oppositeCorner, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('corner', corner);
            Check.Check.typeOf.object('oppositeCorner', oppositeCorner);
            //>>includeEnd('debug');

            if (!when.defined(result)) {
                result = new BoundingSphere();
            }

            var center = Cartographic.Cartesian3.midpoint(corner, oppositeCorner, result.center);
            result.radius = Cartographic.Cartesian3.distance(center, oppositeCorner);
            return result;
        };

        /**
         * Creates a bounding sphere encompassing an ellipsoid.
         *
         * @param {Ellipsoid} ellipsoid The ellipsoid around which to create a bounding sphere.
         * @param {BoundingSphere} [result] The object onto which to store the result.
         * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
         *
         * @example
         * var boundingSphere = Cesium.BoundingSphere.fromEllipsoid(ellipsoid);
         */
        BoundingSphere.fromEllipsoid = function(ellipsoid, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('ellipsoid', ellipsoid);
            //>>includeEnd('debug');

            if (!when.defined(result)) {
                result = new BoundingSphere();
            }

            Cartographic.Cartesian3.clone(Cartographic.Cartesian3.ZERO, result.center);
            result.radius = ellipsoid.maximumRadius;
            return result;
        };

        var fromBoundingSpheresScratch = new Cartographic.Cartesian3();

        /**
         * Computes a tight-fitting bounding sphere enclosing the provided array of bounding spheres.
         *
         * @param {BoundingSphere[]} [boundingSpheres] The array of bounding spheres.
         * @param {BoundingSphere} [result] The object onto which to store the result.
         * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
         */
        BoundingSphere.fromBoundingSpheres = function(boundingSpheres, result) {
            if (!when.defined(result)) {
                result = new BoundingSphere();
            }

            if (!when.defined(boundingSpheres) || boundingSpheres.length === 0) {
                result.center = Cartographic.Cartesian3.clone(Cartographic.Cartesian3.ZERO, result.center);
                result.radius = 0.0;
                return result;
            }

            var length = boundingSpheres.length;
            if (length === 1) {
                return BoundingSphere.clone(boundingSpheres[0], result);
            }

            if (length === 2) {
                return BoundingSphere.union(boundingSpheres[0], boundingSpheres[1], result);
            }

            var positions = [];
            var i;
            for (i = 0; i < length; i++) {
                positions.push(boundingSpheres[i].center);
            }

            result = BoundingSphere.fromPoints(positions, result);

            var center = result.center;
            var radius = result.radius;
            for (i = 0; i < length; i++) {
                var tmp = boundingSpheres[i];
                radius = Math.max(radius, Cartographic.Cartesian3.distance(center, tmp.center, fromBoundingSpheresScratch) + tmp.radius);
            }
            result.radius = radius;

            return result;
        };

        var fromOrientedBoundingBoxScratchU = new Cartographic.Cartesian3();
        var fromOrientedBoundingBoxScratchV = new Cartographic.Cartesian3();
        var fromOrientedBoundingBoxScratchW = new Cartographic.Cartesian3();

        /**
         * Computes a tight-fitting bounding sphere enclosing the provided oriented bounding box.
         *
         * @param {OrientedBoundingBox} orientedBoundingBox The oriented bounding box.
         * @param {BoundingSphere} [result] The object onto which to store the result.
         * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
         */
        BoundingSphere.fromOrientedBoundingBox = function(orientedBoundingBox, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('orientedBoundingBox', orientedBoundingBox);
            //>>includeEnd('debug');

            if (!when.defined(result)) {
                result = new BoundingSphere();
            }

            var halfAxes = orientedBoundingBox.halfAxes;
            var u = Matrix3.getColumn(halfAxes, 0, fromOrientedBoundingBoxScratchU);
            var v = Matrix3.getColumn(halfAxes, 1, fromOrientedBoundingBoxScratchV);
            var w = Matrix3.getColumn(halfAxes, 2, fromOrientedBoundingBoxScratchW);

            Cartographic.Cartesian3.add(u, v, u);
            Cartographic.Cartesian3.add(u, w, u);

            result.center = Cartographic.Cartesian3.clone(orientedBoundingBox.center, result.center);
            result.radius = Cartographic.Cartesian3.magnitude(u);

            return result;
        };

        /**
         * Duplicates a BoundingSphere instance.
         *
         * @param {BoundingSphere} sphere The bounding sphere to duplicate.
         * @param {BoundingSphere} [result] The object onto which to store the result.
         * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided. (Returns undefined if sphere is undefined)
         */
        BoundingSphere.clone = function(sphere, result) {
            if (!when.defined(sphere)) {
                return undefined;
            }

            if (!when.defined(result)) {
                return new BoundingSphere(sphere.center, sphere.radius);
            }

            result.center = Cartographic.Cartesian3.clone(sphere.center, result.center);
            result.radius = sphere.radius;
            return result;
        };

        /**
         * The number of elements used to pack the object into an array.
         * @type {Number}
         */
        BoundingSphere.packedLength = 4;

        /**
         * Stores the provided instance into the provided array.
         *
         * @param {BoundingSphere} value The value to pack.
         * @param {Number[]} array The array to pack into.
         * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
         *
         * @returns {Number[]} The array that was packed into
         */
        BoundingSphere.pack = function(value, array, startingIndex) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('value', value);
            Check.Check.defined('array', array);
            //>>includeEnd('debug');

            startingIndex = when.defaultValue(startingIndex, 0);

            var center = value.center;
            array[startingIndex++] = center.x;
            array[startingIndex++] = center.y;
            array[startingIndex++] = center.z;
            array[startingIndex] = value.radius;

            return array;
        };

        /**
         * Retrieves an instance from a packed array.
         *
         * @param {Number[]} array The packed array.
         * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
         * @param {BoundingSphere} [result] The object into which to store the result.
         * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if one was not provided.
         */
        BoundingSphere.unpack = function(array, startingIndex, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('array', array);
            //>>includeEnd('debug');

            startingIndex = when.defaultValue(startingIndex, 0);

            if (!when.defined(result)) {
                result = new BoundingSphere();
            }

            var center = result.center;
            center.x = array[startingIndex++];
            center.y = array[startingIndex++];
            center.z = array[startingIndex++];
            result.radius = array[startingIndex];
            return result;
        };

        var unionScratch = new Cartographic.Cartesian3();
        var unionScratchCenter = new Cartographic.Cartesian3();
        /**
         * Computes a bounding sphere that contains both the left and right bounding spheres.
         *
         * @param {BoundingSphere} left A sphere to enclose in a bounding sphere.
         * @param {BoundingSphere} right A sphere to enclose in a bounding sphere.
         * @param {BoundingSphere} [result] The object onto which to store the result.
         * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
         */
        BoundingSphere.union = function(left, right, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('left', left);
            Check.Check.typeOf.object('right', right);
            //>>includeEnd('debug');

            if (!when.defined(result)) {
                result = new BoundingSphere();
            }

            var leftCenter = left.center;
            var leftRadius = left.radius;
            var rightCenter = right.center;
            var rightRadius = right.radius;

            var toRightCenter = Cartographic.Cartesian3.subtract(rightCenter, leftCenter, unionScratch);
            var centerSeparation = Cartographic.Cartesian3.magnitude(toRightCenter);

            if (leftRadius >= (centerSeparation + rightRadius)) {
                // Left sphere wins.
                left.clone(result);
                return result;
            }

            if (rightRadius >= (centerSeparation + leftRadius)) {
                // Right sphere wins.
                right.clone(result);
                return result;
            }

            // There are two tangent points, one on far side of each sphere.
            var halfDistanceBetweenTangentPoints = (leftRadius + centerSeparation + rightRadius) * 0.5;

            // Compute the center point halfway between the two tangent points.
            var center = Cartographic.Cartesian3.multiplyByScalar(toRightCenter,
                    (-leftRadius + halfDistanceBetweenTangentPoints) / centerSeparation, unionScratchCenter);
            Cartographic.Cartesian3.add(center, leftCenter, center);
            Cartographic.Cartesian3.clone(center, result.center);
            result.radius = halfDistanceBetweenTangentPoints;

            return result;
        };

        var expandScratch = new Cartographic.Cartesian3();
        /**
         * Computes a bounding sphere by enlarging the provided sphere to contain the provided point.
         *
         * @param {BoundingSphere} sphere A sphere to expand.
         * @param {Cartesian3} point A point to enclose in a bounding sphere.
         * @param {BoundingSphere} [result] The object onto which to store the result.
         * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
         */
        BoundingSphere.expand = function(sphere, point, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('sphere', sphere);
            Check.Check.typeOf.object('point', point);
            //>>includeEnd('debug');

            result = BoundingSphere.clone(sphere, result);

            var radius = Cartographic.Cartesian3.magnitude(Cartographic.Cartesian3.subtract(point, result.center, expandScratch));
            if (radius > result.radius) {
                result.radius = radius;
            }

            return result;
        };

        /**
         * Determines which side of a plane a sphere is located.
         *
         * @param {BoundingSphere} sphere The bounding sphere to test.
         * @param {Plane} plane The plane to test against.
         * @returns {Intersect} {@link Intersect.INSIDE} if the entire sphere is on the side of the plane
         *                      the normal is pointing, {@link Intersect.OUTSIDE} if the entire sphere is
         *                      on the opposite side, and {@link Intersect.INTERSECTING} if the sphere
         *                      intersects the plane.
         */
        BoundingSphere.intersectPlane = function(sphere, plane) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('sphere', sphere);
            Check.Check.typeOf.object('plane', plane);
            //>>includeEnd('debug');

            var center = sphere.center;
            var radius = sphere.radius;
            var normal = plane.normal;
            var distanceToPlane = Cartographic.Cartesian3.dot(normal, center) + plane.distance;

            if (distanceToPlane < -radius) {
                // The center point is negative side of the plane normal
                return Intersect$1.OUTSIDE;
            } else if (distanceToPlane < radius) {
                // The center point is positive side of the plane, but radius extends beyond it; partial overlap
                return Intersect$1.INTERSECTING;
            }
            return Intersect$1.INSIDE;
        };

        /**
         * Applies a 4x4 affine transformation matrix to a bounding sphere.
         *
         * @param {BoundingSphere} sphere The bounding sphere to apply the transformation to.
         * @param {Matrix4} transform The transformation matrix to apply to the bounding sphere.
         * @param {BoundingSphere} [result] The object onto which to store the result.
         * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
         */
        BoundingSphere.transform = function(sphere, transform, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('sphere', sphere);
            Check.Check.typeOf.object('transform', transform);
            //>>includeEnd('debug');

            if (!when.defined(result)) {
                result = new BoundingSphere();
            }

            result.center = Matrix4.multiplyByPoint(transform, sphere.center, result.center);
            result.radius = Matrix4.getMaximumScale(transform) * sphere.radius;

            return result;
        };

        var distanceSquaredToScratch = new Cartographic.Cartesian3();

        /**
         * Computes the estimated distance squared from the closest point on a bounding sphere to a point.
         *
         * @param {BoundingSphere} sphere The sphere.
         * @param {Cartesian3} cartesian The point
         * @returns {Number} The estimated distance squared from the bounding sphere to the point.
         *
         * @example
         * // Sort bounding spheres from back to front
         * spheres.sort(function(a, b) {
         *     return Cesium.BoundingSphere.distanceSquaredTo(b, camera.positionWC) - Cesium.BoundingSphere.distanceSquaredTo(a, camera.positionWC);
         * });
         */
        BoundingSphere.distanceSquaredTo = function(sphere, cartesian) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('sphere', sphere);
            Check.Check.typeOf.object('cartesian', cartesian);
            //>>includeEnd('debug');

            var diff = Cartographic.Cartesian3.subtract(sphere.center, cartesian, distanceSquaredToScratch);
            return Cartographic.Cartesian3.magnitudeSquared(diff) - sphere.radius * sphere.radius;
        };

        /**
         * Applies a 4x4 affine transformation matrix to a bounding sphere where there is no scale
         * The transformation matrix is not verified to have a uniform scale of 1.
         * This method is faster than computing the general bounding sphere transform using {@link BoundingSphere.transform}.
         *
         * @param {BoundingSphere} sphere The bounding sphere to apply the transformation to.
         * @param {Matrix4} transform The transformation matrix to apply to the bounding sphere.
         * @param {BoundingSphere} [result] The object onto which to store the result.
         * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
         *
         * @example
         * var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(positionOnEllipsoid);
         * var boundingSphere = new Cesium.BoundingSphere();
         * var newBoundingSphere = Cesium.BoundingSphere.transformWithoutScale(boundingSphere, modelMatrix);
         */
        BoundingSphere.transformWithoutScale = function(sphere, transform, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('sphere', sphere);
            Check.Check.typeOf.object('transform', transform);
            //>>includeEnd('debug');

            if (!when.defined(result)) {
                result = new BoundingSphere();
            }

            result.center = Matrix4.multiplyByPoint(transform, sphere.center, result.center);
            result.radius = sphere.radius;

            return result;
        };

        var scratchCartesian3 = new Cartographic.Cartesian3();
        /**
         * The distances calculated by the vector from the center of the bounding sphere to position projected onto direction
         * plus/minus the radius of the bounding sphere.
         * <br>
         * If you imagine the infinite number of planes with normal direction, this computes the smallest distance to the
         * closest and farthest planes from position that intersect the bounding sphere.
         *
         * @param {BoundingSphere} sphere The bounding sphere to calculate the distance to.
         * @param {Cartesian3} position The position to calculate the distance from.
         * @param {Cartesian3} direction The direction from position.
         * @param {Interval} [result] A Interval to store the nearest and farthest distances.
         * @returns {Interval} The nearest and farthest distances on the bounding sphere from position in direction.
         */
        BoundingSphere.computePlaneDistances = function(sphere, position, direction, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('sphere', sphere);
            Check.Check.typeOf.object('position', position);
            Check.Check.typeOf.object('direction', direction);
            //>>includeEnd('debug');

            if (!when.defined(result)) {
                result = new Interval();
            }

            var toCenter = Cartographic.Cartesian3.subtract(sphere.center, position, scratchCartesian3);
            var mag = Cartographic.Cartesian3.dot(direction, toCenter);

            result.start = mag - sphere.radius;
            result.stop = mag + sphere.radius;
            return result;
        };

        var projectTo2DNormalScratch = new Cartographic.Cartesian3();
        var projectTo2DEastScratch = new Cartographic.Cartesian3();
        var projectTo2DNorthScratch = new Cartographic.Cartesian3();
        var projectTo2DWestScratch = new Cartographic.Cartesian3();
        var projectTo2DSouthScratch = new Cartographic.Cartesian3();
        var projectTo2DCartographicScratch = new Cartographic.Cartographic();
        var projectTo2DPositionsScratch = new Array(8);
        for (var n = 0; n < 8; ++n) {
            projectTo2DPositionsScratch[n] = new Cartographic.Cartesian3();
        }

        var projectTo2DProjection = new GeographicProjection();
        /**
         * Creates a bounding sphere in 2D from a bounding sphere in 3D world coordinates.
         *
         * @param {BoundingSphere} sphere The bounding sphere to transform to 2D.
         * @param {Object} [projection=GeographicProjection] The projection to 2D.
         * @param {BoundingSphere} [result] The object onto which to store the result.
         * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
         */
        BoundingSphere.projectTo2D = function(sphere, projection, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('sphere', sphere);
            //>>includeEnd('debug');

            projection = when.defaultValue(projection, projectTo2DProjection);

            var ellipsoid = projection.ellipsoid;
            var center = sphere.center;
            var radius = sphere.radius;

            var normal;
            if (Cartographic.Cartesian3.equals(center, Cartographic.Cartesian3.ZERO)) {
                // Bounding sphere is at the center. The geodetic surface normal is not
                // defined here so pick the x-axis as a fallback.
                normal = Cartographic.Cartesian3.clone(Cartographic.Cartesian3.UNIT_X, projectTo2DNormalScratch);
            } else {
                normal = ellipsoid.geodeticSurfaceNormal(center, projectTo2DNormalScratch);
            }
            var east = Cartographic.Cartesian3.cross(Cartographic.Cartesian3.UNIT_Z, normal, projectTo2DEastScratch);
            Cartographic.Cartesian3.normalize(east, east);
            var north = Cartographic.Cartesian3.cross(normal, east, projectTo2DNorthScratch);
            Cartographic.Cartesian3.normalize(north, north);

            Cartographic.Cartesian3.multiplyByScalar(normal, radius, normal);
            Cartographic.Cartesian3.multiplyByScalar(north, radius, north);
            Cartographic.Cartesian3.multiplyByScalar(east, radius, east);

            var south = Cartographic.Cartesian3.negate(north, projectTo2DSouthScratch);
            var west = Cartographic.Cartesian3.negate(east, projectTo2DWestScratch);

            var positions = projectTo2DPositionsScratch;

            // top NE corner
            var corner = positions[0];
            Cartographic.Cartesian3.add(normal, north, corner);
            Cartographic.Cartesian3.add(corner, east, corner);

            // top NW corner
            corner = positions[1];
            Cartographic.Cartesian3.add(normal, north, corner);
            Cartographic.Cartesian3.add(corner, west, corner);

            // top SW corner
            corner = positions[2];
            Cartographic.Cartesian3.add(normal, south, corner);
            Cartographic.Cartesian3.add(corner, west, corner);

            // top SE corner
            corner = positions[3];
            Cartographic.Cartesian3.add(normal, south, corner);
            Cartographic.Cartesian3.add(corner, east, corner);

            Cartographic.Cartesian3.negate(normal, normal);

            // bottom NE corner
            corner = positions[4];
            Cartographic.Cartesian3.add(normal, north, corner);
            Cartographic.Cartesian3.add(corner, east, corner);

            // bottom NW corner
            corner = positions[5];
            Cartographic.Cartesian3.add(normal, north, corner);
            Cartographic.Cartesian3.add(corner, west, corner);

            // bottom SW corner
            corner = positions[6];
            Cartographic.Cartesian3.add(normal, south, corner);
            Cartographic.Cartesian3.add(corner, west, corner);

            // bottom SE corner
            corner = positions[7];
            Cartographic.Cartesian3.add(normal, south, corner);
            Cartographic.Cartesian3.add(corner, east, corner);

            var length = positions.length;
            for (var i = 0; i < length; ++i) {
                var position = positions[i];
                Cartographic.Cartesian3.add(center, position, position);
                var cartographic = ellipsoid.cartesianToCartographic(position, projectTo2DCartographicScratch);
                projection.project(cartographic, position);
            }

            result = BoundingSphere.fromPoints(positions, result);

            // swizzle center components
            center = result.center;
            var x = center.x;
            var y = center.y;
            var z = center.z;
            center.x = z;
            center.y = x;
            center.z = y;

            return result;
        };

        /**
         * Determines whether or not a sphere is hidden from view by the occluder.
         *
         * @param {BoundingSphere} sphere The bounding sphere surrounding the occludee object.
         * @param {Occluder} occluder The occluder.
         * @returns {Boolean} <code>true</code> if the sphere is not visible; otherwise <code>false</code>.
         */
        BoundingSphere.isOccluded = function(sphere, occluder) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('sphere', sphere);
            Check.Check.typeOf.object('occluder', occluder);
            //>>includeEnd('debug');
            return !occluder.isBoundingSphereVisible(sphere);
        };

        /**
         * Compares the provided BoundingSphere componentwise and returns
         * <code>true</code> if they are equal, <code>false</code> otherwise.
         *
         * @param {BoundingSphere} [left] The first BoundingSphere.
         * @param {BoundingSphere} [right] The second BoundingSphere.
         * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
         */
        BoundingSphere.equals = function(left, right) {
            return (left === right) ||
                   ((when.defined(left)) &&
                    (when.defined(right)) &&
                    Cartographic.Cartesian3.equals(left.center, right.center) &&
                    left.radius === right.radius);
        };

        /**
         * Determines which side of a plane the sphere is located.
         *
         * @param {Plane} plane The plane to test against.
         * @returns {Intersect} {@link Intersect.INSIDE} if the entire sphere is on the side of the plane
         *                      the normal is pointing, {@link Intersect.OUTSIDE} if the entire sphere is
         *                      on the opposite side, and {@link Intersect.INTERSECTING} if the sphere
         *                      intersects the plane.
         */
        BoundingSphere.prototype.intersectPlane = function(plane) {
            return BoundingSphere.intersectPlane(this, plane);
        };

        /**
         * Computes the estimated distance squared from the closest point on a bounding sphere to a point.
         *
         * @param {Cartesian3} cartesian The point
         * @returns {Number} The estimated distance squared from the bounding sphere to the point.
         *
         * @example
         * // Sort bounding spheres from back to front
         * spheres.sort(function(a, b) {
         *     return b.distanceSquaredTo(camera.positionWC) - a.distanceSquaredTo(camera.positionWC);
         * });
         */
        BoundingSphere.prototype.distanceSquaredTo = function(cartesian) {
            return BoundingSphere.distanceSquaredTo(this, cartesian);
        };

        /**
         * The distances calculated by the vector from the center of the bounding sphere to position projected onto direction
         * plus/minus the radius of the bounding sphere.
         * <br>
         * If you imagine the infinite number of planes with normal direction, this computes the smallest distance to the
         * closest and farthest planes from position that intersect the bounding sphere.
         *
         * @param {Cartesian3} position The position to calculate the distance from.
         * @param {Cartesian3} direction The direction from position.
         * @param {Interval} [result] A Interval to store the nearest and farthest distances.
         * @returns {Interval} The nearest and farthest distances on the bounding sphere from position in direction.
         */
        BoundingSphere.prototype.computePlaneDistances = function(position, direction, result) {
            return BoundingSphere.computePlaneDistances(this, position, direction, result);
        };

        /**
         * Determines whether or not a sphere is hidden from view by the occluder.
         *
         * @param {Occluder} occluder The occluder.
         * @returns {Boolean} <code>true</code> if the sphere is not visible; otherwise <code>false</code>.
         */
        BoundingSphere.prototype.isOccluded = function(occluder) {
            return BoundingSphere.isOccluded(this, occluder);
        };

        /**
         * Compares this BoundingSphere against the provided BoundingSphere componentwise and returns
         * <code>true</code> if they are equal, <code>false</code> otherwise.
         *
         * @param {BoundingSphere} [right] The right hand side BoundingSphere.
         * @returns {Boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
         */
        BoundingSphere.prototype.equals = function(right) {
            return BoundingSphere.equals(this, right);
        };

        /**
         * Duplicates this BoundingSphere instance.
         *
         * @param {BoundingSphere} [result] The object onto which to store the result.
         * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
         */
        BoundingSphere.prototype.clone = function(result) {
            return BoundingSphere.clone(this, result);
        };

        /**
         * Computes the radius of the BoundingSphere.
         * @returns {Number} The radius of the BoundingSphere.
         */
        BoundingSphere.prototype.volume = function() {
            var radius = this.radius;
            return volumeConstant * radius * radius * radius;
        };

    exports.BoundingSphere = BoundingSphere;
    exports.GeographicProjection = GeographicProjection;
    exports.Intersect = Intersect$1;
    exports.Interval = Interval;
    exports.Matrix3 = Matrix3;
    exports.Matrix4 = Matrix4;

});

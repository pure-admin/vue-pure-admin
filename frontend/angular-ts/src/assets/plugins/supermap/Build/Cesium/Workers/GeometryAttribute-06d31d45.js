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
define(['exports', './when-8d13db60', './Check-70bec281', './Cartographic-fe4be337', './Cartesian2-85064f09', './BoundingSphere-775c5788', './PrimitiveType-97893bc7', './Transforms-913163ed'], function (exports, when, Check, Cartographic, Cartesian2, BoundingSphere, PrimitiveType, Transforms) { 'use strict';

    /**
         * @private
         */
        var GeometryType = {
            NONE : 0,
            TRIANGLES : 1,
            LINES : 2,
            POLYLINES : 3
        };
    var GeometryType$1 = Object.freeze(GeometryType);

    /**
         * A 2x2 matrix, indexable as a column-major order array.
         * Constructor parameters are in row-major order for code readability.
         * @alias Matrix2
         * @constructor
         *
         * @param {Number} [column0Row0=0.0] The value for column 0, row 0.
         * @param {Number} [column1Row0=0.0] The value for column 1, row 0.
         * @param {Number} [column0Row1=0.0] The value for column 0, row 1.
         * @param {Number} [column1Row1=0.0] The value for column 1, row 1.
         *
         * @see Matrix2.fromColumnMajorArray
         * @see Matrix2.fromRowMajorArray
         * @see Matrix2.fromScale
         * @see Matrix2.fromUniformScale
         * @see Matrix3
         * @see Matrix4
         */
        function Matrix2(column0Row0, column1Row0, column0Row1, column1Row1) {
            this[0] = when.defaultValue(column0Row0, 0.0);
            this[1] = when.defaultValue(column0Row1, 0.0);
            this[2] = when.defaultValue(column1Row0, 0.0);
            this[3] = when.defaultValue(column1Row1, 0.0);
        }

        /**
         * The number of elements used to pack the object into an array.
         * @type {Number}
         */
        Matrix2.packedLength = 4;

        /**
         * Stores the provided instance into the provided array.
         *
         * @param {Matrix2} value The value to pack.
         * @param {Number[]} array The array to pack into.
         * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
         *
         * @returns {Number[]} The array that was packed into
         */
        Matrix2.pack = function(value, array, startingIndex) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('value', value);
            Check.Check.defined('array', array);
            //>>includeEnd('debug');

            startingIndex = when.defaultValue(startingIndex, 0);

            array[startingIndex++] = value[0];
            array[startingIndex++] = value[1];
            array[startingIndex++] = value[2];
            array[startingIndex++] = value[3];

            return array;
        };

        /**
         * Retrieves an instance from a packed array.
         *
         * @param {Number[]} array The packed array.
         * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
         * @param {Matrix2} [result] The object into which to store the result.
         * @returns {Matrix2} The modified result parameter or a new Matrix2 instance if one was not provided.
         */
        Matrix2.unpack = function(array, startingIndex, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('array', array);
            //>>includeEnd('debug');

            startingIndex = when.defaultValue(startingIndex, 0);

            if (!when.defined(result)) {
                result = new Matrix2();
            }

            result[0] = array[startingIndex++];
            result[1] = array[startingIndex++];
            result[2] = array[startingIndex++];
            result[3] = array[startingIndex++];
            return result;
        };

        /**
         * Duplicates a Matrix2 instance.
         *
         * @param {Matrix2} matrix The matrix to duplicate.
         * @param {Matrix2} [result] The object onto which to store the result.
         * @returns {Matrix2} The modified result parameter or a new Matrix2 instance if one was not provided. (Returns undefined if matrix is undefined)
         */
        Matrix2.clone = function(matrix, result) {
            if (!when.defined(matrix)) {
                return undefined;
            }
            if (!when.defined(result)) {
                return new Matrix2(matrix[0], matrix[2],
                                   matrix[1], matrix[3]);
            }
            result[0] = matrix[0];
            result[1] = matrix[1];
            result[2] = matrix[2];
            result[3] = matrix[3];
            return result;
        };

        /**
         * Creates a Matrix2 from 4 consecutive elements in an array.
         *
         * @param {Number[]} array The array whose 4 consecutive elements correspond to the positions of the matrix.  Assumes column-major order.
         * @param {Number} [startingIndex=0] The offset into the array of the first element, which corresponds to first column first row position in the matrix.
         * @param {Matrix2} [result] The object onto which to store the result.
         * @returns {Matrix2} The modified result parameter or a new Matrix2 instance if one was not provided.
         *
         * @example
         * // Create the Matrix2:
         * // [1.0, 2.0]
         * // [1.0, 2.0]
         *
         * var v = [1.0, 1.0, 2.0, 2.0];
         * var m = Cesium.Matrix2.fromArray(v);
         *
         * // Create same Matrix2 with using an offset into an array
         * var v2 = [0.0, 0.0, 1.0, 1.0, 2.0, 2.0];
         * var m2 = Cesium.Matrix2.fromArray(v2, 2);
         */
        Matrix2.fromArray = function(array, startingIndex, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('array', array);
            //>>includeEnd('debug');

            startingIndex = when.defaultValue(startingIndex, 0);

            if (!when.defined(result)) {
                result = new Matrix2();
            }

            result[0] = array[startingIndex];
            result[1] = array[startingIndex + 1];
            result[2] = array[startingIndex + 2];
            result[3] = array[startingIndex + 3];
            return result;
        };

        /**
         * Creates a Matrix2 instance from a column-major order array.
         *
         * @param {Number[]} values The column-major order array.
         * @param {Matrix2} [result] The object in which the result will be stored, if undefined a new instance will be created.
         * @returns {Matrix2} The modified result parameter, or a new Matrix2 instance if one was not provided.
         */
        Matrix2.fromColumnMajorArray = function(values, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('values', values);
            //>>includeEnd('debug');

            return Matrix2.clone(values, result);
        };

        /**
         * Creates a Matrix2 instance from a row-major order array.
         * The resulting matrix will be in column-major order.
         *
         * @param {Number[]} values The row-major order array.
         * @param {Matrix2} [result] The object in which the result will be stored, if undefined a new instance will be created.
         * @returns {Matrix2} The modified result parameter, or a new Matrix2 instance if one was not provided.
         */
        Matrix2.fromRowMajorArray = function(values, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('values', values);
            //>>includeEnd('debug');

            if (!when.defined(result)) {
                return new Matrix2(values[0], values[1],
                                   values[2], values[3]);
            }
            result[0] = values[0];
            result[1] = values[2];
            result[2] = values[1];
            result[3] = values[3];
            return result;
        };

        /**
         * Computes a Matrix2 instance representing a non-uniform scale.
         *
         * @param {Cartesian2} scale The x and y scale factors.
         * @param {Matrix2} [result] The object in which the result will be stored, if undefined a new instance will be created.
         * @returns {Matrix2} The modified result parameter, or a new Matrix2 instance if one was not provided.
         *
         * @example
         * // Creates
         * //   [7.0, 0.0]
         * //   [0.0, 8.0]
         * var m = Cesium.Matrix2.fromScale(new Cesium.Cartesian2(7.0, 8.0));
         */
        Matrix2.fromScale = function(scale, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('scale', scale);
            //>>includeEnd('debug');

            if (!when.defined(result)) {
                return new Matrix2(
                    scale.x, 0.0,
                    0.0,     scale.y);
            }

            result[0] = scale.x;
            result[1] = 0.0;
            result[2] = 0.0;
            result[3] = scale.y;
            return result;
        };

        /**
         * Computes a Matrix2 instance representing a uniform scale.
         *
         * @param {Number} scale The uniform scale factor.
         * @param {Matrix2} [result] The object in which the result will be stored, if undefined a new instance will be created.
         * @returns {Matrix2} The modified result parameter, or a new Matrix2 instance if one was not provided.
         *
         * @example
         * // Creates
         * //   [2.0, 0.0]
         * //   [0.0, 2.0]
         * var m = Cesium.Matrix2.fromUniformScale(2.0);
         */
        Matrix2.fromUniformScale = function(scale, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.number('scale', scale);
            //>>includeEnd('debug');

            if (!when.defined(result)) {
                return new Matrix2(
                    scale, 0.0,
                    0.0,   scale);
            }

            result[0] = scale;
            result[1] = 0.0;
            result[2] = 0.0;
            result[3] = scale;
            return result;
        };

        /**
         * Creates a rotation matrix.
         *
         * @param {Number} angle The angle, in radians, of the rotation.  Positive angles are counterclockwise.
         * @param {Matrix2} [result] The object in which the result will be stored, if undefined a new instance will be created.
         * @returns {Matrix2} The modified result parameter, or a new Matrix2 instance if one was not provided.
         *
         * @example
         * // Rotate a point 45 degrees counterclockwise.
         * var p = new Cesium.Cartesian2(5, 6);
         * var m = Cesium.Matrix2.fromRotation(Cesium.Math.toRadians(45.0));
         * var rotated = Cesium.Matrix2.multiplyByVector(m, p, new Cesium.Cartesian2());
         */
        Matrix2.fromRotation = function(angle, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.number('angle', angle);
            //>>includeEnd('debug');

            var cosAngle = Math.cos(angle);
            var sinAngle = Math.sin(angle);

            if (!when.defined(result)) {
                return new Matrix2(
                    cosAngle, -sinAngle,
                    sinAngle, cosAngle);
            }
            result[0] = cosAngle;
            result[1] = sinAngle;
            result[2] = -sinAngle;
            result[3] = cosAngle;
            return result;
        };

        /**
         * Creates an Array from the provided Matrix2 instance.
         * The array will be in column-major order.
         *
         * @param {Matrix2} matrix The matrix to use..
         * @param {Number[]} [result] The Array onto which to store the result.
         * @returns {Number[]} The modified Array parameter or a new Array instance if one was not provided.
         */
        Matrix2.toArray = function(matrix, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            //>>includeEnd('debug');

            if (!when.defined(result)) {
                return [matrix[0], matrix[1], matrix[2], matrix[3]];
            }
            result[0] = matrix[0];
            result[1] = matrix[1];
            result[2] = matrix[2];
            result[3] = matrix[3];
            return result;
        };

        /**
         * Computes the array index of the element at the provided row and column.
         *
         * @param {Number} row The zero-based index of the row.
         * @param {Number} column The zero-based index of the column.
         * @returns {Number} The index of the element at the provided row and column.
         *
         * @exception {DeveloperError} row must be 0 or 1.
         * @exception {DeveloperError} column must be 0 or 1.
         *
         * @example
         * var myMatrix = new Cesium.Matrix2();
         * var column1Row0Index = Cesium.Matrix2.getElementIndex(1, 0);
         * var column1Row0 = myMatrix[column1Row0Index]
         * myMatrix[column1Row0Index] = 10.0;
         */
        Matrix2.getElementIndex = function(column, row) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.number.greaterThanOrEquals('row', row, 0);
            Check.Check.typeOf.number.lessThanOrEquals('row', row, 1);

            Check.Check.typeOf.number.greaterThanOrEquals('column', column, 0);
            Check.Check.typeOf.number.lessThanOrEquals('column', column, 1);
            //>>includeEnd('debug');

            return column * 2 + row;
        };

        /**
         * Retrieves a copy of the matrix column at the provided index as a Cartesian2 instance.
         *
         * @param {Matrix2} matrix The matrix to use.
         * @param {Number} index The zero-based index of the column to retrieve.
         * @param {Cartesian2} result The object onto which to store the result.
         * @returns {Cartesian2} The modified result parameter.
         *
         * @exception {DeveloperError} index must be 0 or 1.
         */
        Matrix2.getColumn = function(matrix, index, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);

            Check.Check.typeOf.number.greaterThanOrEquals('index', index, 0);
            Check.Check.typeOf.number.lessThanOrEquals('index', index, 1);

            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var startIndex = index * 2;
            var x = matrix[startIndex];
            var y = matrix[startIndex + 1];

            result.x = x;
            result.y = y;
            return result;
        };

        /**
         * Computes a new matrix that replaces the specified column in the provided matrix with the provided Cartesian2 instance.
         *
         * @param {Matrix2} matrix The matrix to use.
         * @param {Number} index The zero-based index of the column to set.
         * @param {Cartesian2} cartesian The Cartesian whose values will be assigned to the specified column.
         * @param {Cartesian2} result The object onto which to store the result.
         * @returns {Matrix2} The modified result parameter.
         *
         * @exception {DeveloperError} index must be 0 or 1.
         */
        Matrix2.setColumn = function(matrix, index, cartesian, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);

            Check.Check.typeOf.number.greaterThanOrEquals('index', index, 0);
            Check.Check.typeOf.number.lessThanOrEquals('index', index, 1);

            Check.Check.typeOf.object('cartesian', cartesian);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result = Matrix2.clone(matrix, result);
            var startIndex = index * 2;
            result[startIndex] = cartesian.x;
            result[startIndex + 1] = cartesian.y;
            return result;
        };

        /**
         * Retrieves a copy of the matrix row at the provided index as a Cartesian2 instance.
         *
         * @param {Matrix2} matrix The matrix to use.
         * @param {Number} index The zero-based index of the row to retrieve.
         * @param {Cartesian2} result The object onto which to store the result.
         * @returns {Cartesian2} The modified result parameter.
         *
         * @exception {DeveloperError} index must be 0 or 1.
         */
        Matrix2.getRow = function(matrix, index, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);

            Check.Check.typeOf.number.greaterThanOrEquals('index', index, 0);
            Check.Check.typeOf.number.lessThanOrEquals('index', index, 1);

            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var x = matrix[index];
            var y = matrix[index + 2];

            result.x = x;
            result.y = y;
            return result;
        };

        /**
         * Computes a new matrix that replaces the specified row in the provided matrix with the provided Cartesian2 instance.
         *
         * @param {Matrix2} matrix The matrix to use.
         * @param {Number} index The zero-based index of the row to set.
         * @param {Cartesian2} cartesian The Cartesian whose values will be assigned to the specified row.
         * @param {Matrix2} result The object onto which to store the result.
         * @returns {Matrix2} The modified result parameter.
         *
         * @exception {DeveloperError} index must be 0 or 1.
         */
        Matrix2.setRow = function(matrix, index, cartesian, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);

            Check.Check.typeOf.number.greaterThanOrEquals('index', index, 0);
            Check.Check.typeOf.number.lessThanOrEquals('index', index, 1);

            Check.Check.typeOf.object('cartesian', cartesian);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result = Matrix2.clone(matrix, result);
            result[index] = cartesian.x;
            result[index + 2] = cartesian.y;
            return result;
        };

        var scratchColumn = new Cartesian2.Cartesian2();

        /**
         * Extracts the non-uniform scale assuming the matrix is an affine transformation.
         *
         * @param {Matrix2} matrix The matrix.
         * @param {Cartesian2} result The object onto which to store the result.
         * @returns {Cartesian2} The modified result parameter.
         */
        Matrix2.getScale = function(matrix, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result.x = Cartesian2.Cartesian2.magnitude(Cartesian2.Cartesian2.fromElements(matrix[0], matrix[1], scratchColumn));
            result.y = Cartesian2.Cartesian2.magnitude(Cartesian2.Cartesian2.fromElements(matrix[2], matrix[3], scratchColumn));
            return result;
        };

        var scratchScale = new Cartesian2.Cartesian2();

        /**
         * Computes the maximum scale assuming the matrix is an affine transformation.
         * The maximum scale is the maximum length of the column vectors.
         *
         * @param {Matrix2} matrix The matrix.
         * @returns {Number} The maximum scale.
         */
        Matrix2.getMaximumScale = function(matrix) {
            Matrix2.getScale(matrix, scratchScale);
            return Cartesian2.Cartesian2.maximumComponent(scratchScale);
        };

        /**
         * Computes the product of two matrices.
         *
         * @param {Matrix2} left The first matrix.
         * @param {Matrix2} right The second matrix.
         * @param {Matrix2} result The object onto which to store the result.
         * @returns {Matrix2} The modified result parameter.
         */
        Matrix2.multiply = function(left, right, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('left', left);
            Check.Check.typeOf.object('right', right);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var column0Row0 = left[0] * right[0] + left[2] * right[1];
            var column1Row0 = left[0] * right[2] + left[2] * right[3];
            var column0Row1 = left[1] * right[0] + left[3] * right[1];
            var column1Row1 = left[1] * right[2] + left[3] * right[3];

            result[0] = column0Row0;
            result[1] = column0Row1;
            result[2] = column1Row0;
            result[3] = column1Row1;
            return result;
        };

        /**
         * Computes the sum of two matrices.
         *
         * @param {Matrix2} left The first matrix.
         * @param {Matrix2} right The second matrix.
         * @param {Matrix2} result The object onto which to store the result.
         * @returns {Matrix2} The modified result parameter.
         */
        Matrix2.add = function(left, right, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('left', left);
            Check.Check.typeOf.object('right', right);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result[0] = left[0] + right[0];
            result[1] = left[1] + right[1];
            result[2] = left[2] + right[2];
            result[3] = left[3] + right[3];
            return result;
        };

        /**
         * Computes the difference of two matrices.
         *
         * @param {Matrix2} left The first matrix.
         * @param {Matrix2} right The second matrix.
         * @param {Matrix2} result The object onto which to store the result.
         * @returns {Matrix2} The modified result parameter.
         */
        Matrix2.subtract = function(left, right, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('left', left);
            Check.Check.typeOf.object('right', right);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result[0] = left[0] - right[0];
            result[1] = left[1] - right[1];
            result[2] = left[2] - right[2];
            result[3] = left[3] - right[3];
            return result;
        };

        /**
         * Computes the product of a matrix and a column vector.
         *
         * @param {Matrix2} matrix The matrix.
         * @param {Cartesian2} cartesian The column.
         * @param {Cartesian2} result The object onto which to store the result.
         * @returns {Cartesian2} The modified result parameter.
         */
        Matrix2.multiplyByVector = function(matrix, cartesian, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.object('cartesian', cartesian);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var x = matrix[0] * cartesian.x + matrix[2] * cartesian.y;
            var y = matrix[1] * cartesian.x + matrix[3] * cartesian.y;

            result.x = x;
            result.y = y;
            return result;
        };

        /**
         * Computes the product of a matrix and a scalar.
         *
         * @param {Matrix2} matrix The matrix.
         * @param {Number} scalar The number to multiply by.
         * @param {Matrix2} result The object onto which to store the result.
         * @returns {Matrix2} The modified result parameter.
         */
        Matrix2.multiplyByScalar = function(matrix, scalar, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.number('scalar', scalar);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result[0] = matrix[0] * scalar;
            result[1] = matrix[1] * scalar;
            result[2] = matrix[2] * scalar;
            result[3] = matrix[3] * scalar;
            return result;
        };

        /**
         * Computes the product of a matrix times a (non-uniform) scale, as if the scale were a scale matrix.
         *
         * @param {Matrix2} matrix The matrix on the left-hand side.
         * @param {Cartesian2} scale The non-uniform scale on the right-hand side.
         * @param {Matrix2} result The object onto which to store the result.
         * @returns {Matrix2} The modified result parameter.
         *
         *
         * @example
         * // Instead of Cesium.Matrix2.multiply(m, Cesium.Matrix2.fromScale(scale), m);
         * Cesium.Matrix2.multiplyByScale(m, scale, m);
         *
         * @see Matrix2.fromScale
         * @see Matrix2.multiplyByUniformScale
         */
        Matrix2.multiplyByScale = function(matrix, scale, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.object('scale', scale);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result[0] = matrix[0] * scale.x;
            result[1] = matrix[1] * scale.x;
            result[2] = matrix[2] * scale.y;
            result[3] = matrix[3] * scale.y;
            return result;
        };

        /**
         * Creates a negated copy of the provided matrix.
         *
         * @param {Matrix2} matrix The matrix to negate.
         * @param {Matrix2} result The object onto which to store the result.
         * @returns {Matrix2} The modified result parameter.
         */
        Matrix2.negate = function(matrix, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result[0] = -matrix[0];
            result[1] = -matrix[1];
            result[2] = -matrix[2];
            result[3] = -matrix[3];
            return result;
        };

        /**
         * Computes the transpose of the provided matrix.
         *
         * @param {Matrix2} matrix The matrix to transpose.
         * @param {Matrix2} result The object onto which to store the result.
         * @returns {Matrix2} The modified result parameter.
         */
        Matrix2.transpose = function(matrix, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var column0Row0 = matrix[0];
            var column0Row1 = matrix[2];
            var column1Row0 = matrix[1];
            var column1Row1 = matrix[3];

            result[0] = column0Row0;
            result[1] = column0Row1;
            result[2] = column1Row0;
            result[3] = column1Row1;
            return result;
        };

        /**
         * Computes a matrix, which contains the absolute (unsigned) values of the provided matrix's elements.
         *
         * @param {Matrix2} matrix The matrix with signed elements.
         * @param {Matrix2} result The object onto which to store the result.
         * @returns {Matrix2} The modified result parameter.
         */
        Matrix2.abs = function(matrix, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result[0] = Math.abs(matrix[0]);
            result[1] = Math.abs(matrix[1]);
            result[2] = Math.abs(matrix[2]);
            result[3] = Math.abs(matrix[3]);

            return result;
        };

        /**
         * Compares the provided matrices componentwise and returns
         * <code>true</code> if they are equal, <code>false</code> otherwise.
         *
         * @param {Matrix2} [left] The first matrix.
         * @param {Matrix2} [right] The second matrix.
         * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
         */
        Matrix2.equals = function(left, right) {
            return (left === right) ||
                   (when.defined(left) &&
                    when.defined(right) &&
                    left[0] === right[0] &&
                    left[1] === right[1] &&
                    left[2] === right[2] &&
                    left[3] === right[3]);
        };

        /**
         * @private
         */
        Matrix2.equalsArray = function(matrix, array, offset) {
            return matrix[0] === array[offset] &&
                   matrix[1] === array[offset + 1] &&
                   matrix[2] === array[offset + 2] &&
                   matrix[3] === array[offset + 3];
        };

        /**
         * Compares the provided matrices componentwise and returns
         * <code>true</code> if they are within the provided epsilon,
         * <code>false</code> otherwise.
         *
         * @param {Matrix2} [left] The first matrix.
         * @param {Matrix2} [right] The second matrix.
         * @param {Number} epsilon The epsilon to use for equality testing.
         * @returns {Boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
         */
        Matrix2.equalsEpsilon = function(left, right, epsilon) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.number('epsilon', epsilon);
            //>>includeEnd('debug');

            return (left === right) ||
                    (when.defined(left) &&
                    when.defined(right) &&
                    Math.abs(left[0] - right[0]) <= epsilon &&
                    Math.abs(left[1] - right[1]) <= epsilon &&
                    Math.abs(left[2] - right[2]) <= epsilon &&
                    Math.abs(left[3] - right[3]) <= epsilon);
        };

        /**
         * An immutable Matrix2 instance initialized to the identity matrix.
         *
         * @type {Matrix2}
         * @constant
         */
        Matrix2.IDENTITY = Object.freeze(new Matrix2(1.0, 0.0,
                                                    0.0, 1.0));

        /**
         * An immutable Matrix2 instance initialized to the zero matrix.
         *
         * @type {Matrix2}
         * @constant
         */
        Matrix2.ZERO = Object.freeze(new Matrix2(0.0, 0.0,
                                                0.0, 0.0));

        /**
         * The index into Matrix2 for column 0, row 0.
         *
         * @type {Number}
         * @constant
         *
         * @example
         * var matrix = new Cesium.Matrix2();
         * matrix[Cesium.Matrix2.COLUMN0ROW0] = 5.0; // set column 0, row 0 to 5.0
         */
        Matrix2.COLUMN0ROW0 = 0;

        /**
         * The index into Matrix2 for column 0, row 1.
         *
         * @type {Number}
         * @constant
         *
         * @example
         * var matrix = new Cesium.Matrix2();
         * matrix[Cesium.Matrix2.COLUMN0ROW1] = 5.0; // set column 0, row 1 to 5.0
         */
        Matrix2.COLUMN0ROW1 = 1;

        /**
         * The index into Matrix2 for column 1, row 0.
         *
         * @type {Number}
         * @constant
         *
         * @example
         * var matrix = new Cesium.Matrix2();
         * matrix[Cesium.Matrix2.COLUMN1ROW0] = 5.0; // set column 1, row 0 to 5.0
         */
        Matrix2.COLUMN1ROW0 = 2;

        /**
         * The index into Matrix2 for column 1, row 1.
         *
         * @type {Number}
         * @constant
         *
         * @example
         * var matrix = new Cesium.Matrix2();
         * matrix[Cesium.Matrix2.COLUMN1ROW1] = 5.0; // set column 1, row 1 to 5.0
         */
        Matrix2.COLUMN1ROW1 = 3;

        Object.defineProperties(Matrix2.prototype, {
            /**
             * Gets the number of items in the collection.
             * @memberof Matrix2.prototype
             *
             * @type {Number}
             */
            length : {
                get : function() {
                    return Matrix2.packedLength;
                }
            }
        });

        /**
         * Duplicates the provided Matrix2 instance.
         *
         * @param {Matrix2} [result] The object onto which to store the result.
         * @returns {Matrix2} The modified result parameter or a new Matrix2 instance if one was not provided.
         */
        Matrix2.prototype.clone = function(result) {
            return Matrix2.clone(this, result);
        };

        /**
         * Compares this matrix to the provided matrix componentwise and returns
         * <code>true</code> if they are equal, <code>false</code> otherwise.
         *
         * @param {Matrix2} [right] The right hand side matrix.
         * @returns {Boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
         */
        Matrix2.prototype.equals = function(right) {
            return Matrix2.equals(this, right);
        };

        /**
         * Compares this matrix to the provided matrix componentwise and returns
         * <code>true</code> if they are within the provided epsilon,
         * <code>false</code> otherwise.
         *
         * @param {Matrix2} [right] The right hand side matrix.
         * @param {Number} epsilon The epsilon to use for equality testing.
         * @returns {Boolean} <code>true</code> if they are within the provided epsilon, <code>false</code> otherwise.
         */
        Matrix2.prototype.equalsEpsilon = function(right, epsilon) {
            return Matrix2.equalsEpsilon(this, right, epsilon);
        };

        /**
         * Creates a string representing this Matrix with each row being
         * on a separate line and in the format '(column0, column1)'.
         *
         * @returns {String} A string representing the provided Matrix with each row being on a separate line and in the format '(column0, column1)'.
         */
        Matrix2.prototype.toString = function() {
            return '(' + this[0] + ', ' + this[2] + ')\n' +
                   '(' + this[1] + ', ' + this[3] + ')';
        };

    /**
         * A geometry representation with attributes forming vertices and optional index data
         * defining primitives.  Geometries and an {@link Appearance}, which describes the shading,
         * can be assigned to a {@link Primitive} for visualization.  A <code>Primitive</code> can
         * be created from many heterogeneous - in many cases - geometries for performance.
         * <p>
         * Geometries can be transformed and optimized using functions in {@link GeometryPipeline}.
         * </p>
         *
         * @alias Geometry
         * @constructor
         *
         * @param {Object} options Object with the following properties:
         * @param {GeometryAttributes} options.attributes Attributes, which make up the geometry's vertices.
         * @param {PrimitiveType} [options.primitiveType=PrimitiveType.TRIANGLES] The type of primitives in the geometry.
         * @param {Uint16Array|Uint32Array} [options.indices] Optional index data that determines the primitives in the geometry.
         * @param {BoundingSphere} [options.boundingSphere] An optional bounding sphere that fully enclosed the geometry.
         *
         * @see PolygonGeometry
         * @see RectangleGeometry
         * @see EllipseGeometry
         * @see CircleGeometry
         * @see WallGeometry
         * @see SimplePolylineGeometry
         * @see BoxGeometry
         * @see EllipsoidGeometry
         *
         * @demo {@link https://sandcastle.cesium.com/index.html?src=Geometry%20and%20Appearances.html|Geometry and Appearances Demo}
         *
         * @example
         * // Create geometry with a position attribute and indexed lines.
         * var positions = new Float64Array([
         *   0.0, 0.0, 0.0,
         *   7500000.0, 0.0, 0.0,
         *   0.0, 7500000.0, 0.0
         * ]);
         *
         * var geometry = new Cesium.Geometry({
         *   attributes : {
         *     position : new Cesium.GeometryAttribute({
         *       componentDatatype : Cesium.ComponentDatatype.DOUBLE,
         *       componentsPerAttribute : 3,
         *       values : positions
         *     })
         *   },
         *   indices : new Uint16Array([0, 1, 1, 2, 2, 0]),
         *   primitiveType : Cesium.PrimitiveType.LINES,
         *   boundingSphere : Cesium.BoundingSphere.fromVertices(positions)
         * });
         */
        function Geometry(options) {
            options = when.defaultValue(options, when.defaultValue.EMPTY_OBJECT);

            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('options.attributes', options.attributes);
            //>>includeEnd('debug');

            /**
             * Attributes, which make up the geometry's vertices.  Each property in this object corresponds to a
             * {@link GeometryAttribute} containing the attribute's data.
             * <p>
             * Attributes are always stored non-interleaved in a Geometry.
             * </p>
             * <p>
             * There are reserved attribute names with well-known semantics.  The following attributes
             * are created by a Geometry (depending on the provided {@link VertexFormat}.
             * <ul>
             *    <li><code>position</code> - 3D vertex position.  64-bit floating-point (for precision).  3 components per attribute.  See {@link VertexFormat#position}.</li>
             *    <li><code>normal</code> - Normal (normalized), commonly used for lighting.  32-bit floating-point.  3 components per attribute.  See {@link VertexFormat#normal}.</li>
             *    <li><code>st</code> - 2D texture coordinate.  32-bit floating-point.  2 components per attribute.  See {@link VertexFormat#st}.</li>
             *    <li><code>bitangent</code> - Bitangent (normalized), used for tangent-space effects like bump mapping.  32-bit floating-point.  3 components per attribute.  See {@link VertexFormat#bitangent}.</li>
             *    <li><code>tangent</code> - Tangent (normalized), used for tangent-space effects like bump mapping.  32-bit floating-point.  3 components per attribute.  See {@link VertexFormat#tangent}.</li>
             * </ul>
             * </p>
             * <p>
             * The following attribute names are generally not created by a Geometry, but are added
             * to a Geometry by a {@link Primitive} or {@link GeometryPipeline} functions to prepare
             * the geometry for rendering.
             * <ul>
             *    <li><code>position3DHigh</code> - High 32 bits for encoded 64-bit position computed with {@link GeometryPipeline.encodeAttribute}.  32-bit floating-point.  4 components per attribute.</li>
             *    <li><code>position3DLow</code> - Low 32 bits for encoded 64-bit position computed with {@link GeometryPipeline.encodeAttribute}.  32-bit floating-point.  4 components per attribute.</li>
             *    <li><code>position3DHigh</code> - High 32 bits for encoded 64-bit 2D (Columbus view) position computed with {@link GeometryPipeline.encodeAttribute}.  32-bit floating-point.  4 components per attribute.</li>
             *    <li><code>position2DLow</code> - Low 32 bits for encoded 64-bit 2D (Columbus view) position computed with {@link GeometryPipeline.encodeAttribute}.  32-bit floating-point.  4 components per attribute.</li>
             *    <li><code>color</code> - RGBA color (normalized) usually from {@link GeometryInstance#color}.  32-bit floating-point.  4 components per attribute.</li>
             *    <li><code>pickColor</code> - RGBA color used for picking.  32-bit floating-point.  4 components per attribute.</li>
             * </ul>
             * </p>
             *
             * @type GeometryAttributes
             *
             * @default undefined
             *
             *
             * @example
             * geometry.attributes.position = new Cesium.GeometryAttribute({
             *   componentDatatype : Cesium.ComponentDatatype.FLOAT,
             *   componentsPerAttribute : 3,
             *   values : new Float32Array(0)
             * });
             *
             * @see GeometryAttribute
             * @see VertexFormat
             */
            this.attributes = options.attributes;

            /**
             * Optional index data that - along with {@link Geometry#primitiveType} -
             * determines the primitives in the geometry.
             *
             * @type Array
             *
             * @default undefined
             */
            this.indices = options.indices;

            /**
             * The type of primitives in the geometry.  This is most often {@link PrimitiveType.TRIANGLES},
             * but can varying based on the specific geometry.
             *
             * @type PrimitiveType
             *
             * @default undefined
             */
            this.primitiveType = when.defaultValue(options.primitiveType, PrimitiveType.PrimitiveType.TRIANGLES);

            /**
             * An optional bounding sphere that fully encloses the geometry.  This is
             * commonly used for culling.
             *
             * @type BoundingSphere
             *
             * @default undefined
             */
            this.boundingSphere = options.boundingSphere;

            /**
             * @private
             */
            this.geometryType = when.defaultValue(options.geometryType, GeometryType$1.NONE);

            /**
             * @private
             */
            this.boundingSphereCV = options.boundingSphereCV;

            /**
             * @private
             * Used for computing the bounding sphere for geometry using the applyOffset vertex attribute
             */
            this.offsetAttribute = options.offsetAttribute;
        }

        /**
         * Computes the number of vertices in a geometry.  The runtime is linear with
         * respect to the number of attributes in a vertex, not the number of vertices.
         *
         * @param {Geometry} geometry The geometry.
         * @returns {Number} The number of vertices in the geometry.
         *
         * @example
         * var numVertices = Cesium.Geometry.computeNumberOfVertices(geometry);
         */
        Geometry.computeNumberOfVertices = function(geometry) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('geometry', geometry);
            //>>includeEnd('debug');

            var numberOfVertices = -1;
            for ( var property in geometry.attributes) {
                if (geometry.attributes.hasOwnProperty(property) &&
                        when.defined(geometry.attributes[property]) &&
                        when.defined(geometry.attributes[property].values)) {

                    var attribute = geometry.attributes[property];
                    var num = attribute.values.length / attribute.componentsPerAttribute;
                    //>>includeStart('debug', pragmas.debug);
                    if ((numberOfVertices !== num) && (numberOfVertices !== -1)) {
                        throw new Check.DeveloperError('All attribute lists must have the same number of attributes.');
                    }
                    //>>includeEnd('debug');
                    numberOfVertices = num;
                }
            }

            return numberOfVertices;
        };

        var rectangleCenterScratch = new Cartographic.Cartographic();
        var enuCenterScratch = new Cartographic.Cartesian3();
        var fixedFrameToEnuScratch = new BoundingSphere.Matrix4();
        var boundingRectanglePointsCartographicScratch = [new Cartographic.Cartographic(), new Cartographic.Cartographic(), new Cartographic.Cartographic()];
        var boundingRectanglePointsEnuScratch = [new Cartesian2.Cartesian2(), new Cartesian2.Cartesian2(), new Cartesian2.Cartesian2()];
        var points2DScratch = [new Cartesian2.Cartesian2(), new Cartesian2.Cartesian2(), new Cartesian2.Cartesian2()];
        var pointEnuScratch = new Cartographic.Cartesian3();
        var enuRotationScratch = new Transforms.Quaternion();
        var enuRotationMatrixScratch = new BoundingSphere.Matrix4();
        var rotation2DScratch = new Matrix2();

        /**
         * For remapping texture coordinates when rendering GroundPrimitives with materials.
         * GroundPrimitive texture coordinates are computed to align with the cartographic coordinate system on the globe.
         * However, EllipseGeometry, RectangleGeometry, and PolygonGeometry all bake rotations to per-vertex texture coordinates
         * using different strategies.
         *
         * This method is used by EllipseGeometry and PolygonGeometry to approximate the same visual effect.
         * We encapsulate rotation and scale by computing a "transformed" texture coordinate system and computing
         * a set of reference points from which "cartographic" texture coordinates can be remapped to the "transformed"
         * system using distances to lines in 2D.
         *
         * This approximation becomes less accurate as the covered area increases, especially for GroundPrimitives near the poles,
         * but is generally reasonable for polygons and ellipses around the size of USA states.
         *
         * RectangleGeometry has its own version of this method that computes remapping coordinates using cartographic space
         * as an intermediary instead of local ENU, which is more accurate for large-area rectangles.
         *
         * @param {Cartesian3[]} positions Array of positions outlining the geometry
         * @param {Number} stRotation Texture coordinate rotation.
         * @param {Ellipsoid} ellipsoid Ellipsoid for projecting and generating local vectors.
         * @param {Rectangle} boundingRectangle Bounding rectangle around the positions.
         * @returns {Number[]} An array of 6 numbers specifying [minimum point, u extent, v extent] as points in the "cartographic" system.
         * @private
         */
        Geometry._textureCoordinateRotationPoints = function(positions, stRotation, ellipsoid, boundingRectangle) {
            var i;

            // Create a local east-north-up coordinate system centered on the polygon's bounding rectangle.
            // Project the southwest, northwest, and southeast corners of the bounding rectangle into the plane of ENU as 2D points.
            // These are the equivalents of (0,0), (0,1), and (1,0) in the texture coordiante system computed in ShadowVolumeAppearanceFS,
            // aka "ENU texture space."
            var rectangleCenter = Cartesian2.Rectangle.center(boundingRectangle, rectangleCenterScratch);
            var enuCenter = Cartographic.Cartographic.toCartesian(rectangleCenter, ellipsoid, enuCenterScratch);
            var enuToFixedFrame = Transforms.Transforms.eastNorthUpToFixedFrame(enuCenter, ellipsoid, fixedFrameToEnuScratch);
            var fixedFrameToEnu = BoundingSphere.Matrix4.inverse(enuToFixedFrame, fixedFrameToEnuScratch);

            var boundingPointsEnu = boundingRectanglePointsEnuScratch;
            var boundingPointsCarto = boundingRectanglePointsCartographicScratch;

            boundingPointsCarto[0].longitude = boundingRectangle.west;
            boundingPointsCarto[0].latitude = boundingRectangle.south;

            boundingPointsCarto[1].longitude = boundingRectangle.west;
            boundingPointsCarto[1].latitude = boundingRectangle.north;

            boundingPointsCarto[2].longitude = boundingRectangle.east;
            boundingPointsCarto[2].latitude = boundingRectangle.south;

            var posEnu = pointEnuScratch;

            for (i = 0; i < 3; i++) {
                Cartographic.Cartographic.toCartesian(boundingPointsCarto[i], ellipsoid, posEnu);
                posEnu = BoundingSphere.Matrix4.multiplyByPointAsVector(fixedFrameToEnu, posEnu, posEnu);
                boundingPointsEnu[i].x = posEnu.x;
                boundingPointsEnu[i].y = posEnu.y;
            }

            // Rotate each point in the polygon around the up vector in the ENU by -stRotation and project into ENU as 2D.
            // Compute the bounding box of these rotated points in the 2D ENU plane.
            // Rotate the corners back by stRotation, then compute their equivalents in the ENU texture space using the corners computed earlier.
            var rotation = Transforms.Quaternion.fromAxisAngle(Cartographic.Cartesian3.UNIT_Z, -stRotation, enuRotationScratch);
            var textureMatrix = BoundingSphere.Matrix3.fromQuaternion(rotation, enuRotationMatrixScratch);

            var positionsLength = positions.length;
            var enuMinX = Number.POSITIVE_INFINITY;
            var enuMinY = Number.POSITIVE_INFINITY;
            var enuMaxX = Number.NEGATIVE_INFINITY;
            var enuMaxY = Number.NEGATIVE_INFINITY;
            for (i = 0; i < positionsLength; i++) {
                posEnu = BoundingSphere.Matrix4.multiplyByPointAsVector(fixedFrameToEnu, positions[i], posEnu);
                posEnu = BoundingSphere.Matrix3.multiplyByVector(textureMatrix, posEnu, posEnu);

                enuMinX = Math.min(enuMinX, posEnu.x);
                enuMinY = Math.min(enuMinY, posEnu.y);
                enuMaxX = Math.max(enuMaxX, posEnu.x);
                enuMaxY = Math.max(enuMaxY, posEnu.y);
            }

            var toDesiredInComputed = Matrix2.fromRotation(stRotation, rotation2DScratch);

            var points2D = points2DScratch;
            points2D[0].x = enuMinX;
            points2D[0].y = enuMinY;

            points2D[1].x = enuMinX;
            points2D[1].y = enuMaxY;

            points2D[2].x = enuMaxX;
            points2D[2].y = enuMinY;

            var boundingEnuMin = boundingPointsEnu[0];
            var boundingPointsWidth = boundingPointsEnu[2].x - boundingEnuMin.x;
            var boundingPointsHeight = boundingPointsEnu[1].y - boundingEnuMin.y;

            for (i = 0; i < 3; i++) {
                var point2D = points2D[i];
                // rotate back
                Matrix2.multiplyByVector(toDesiredInComputed, point2D, point2D);

                // Convert point into east-north texture coordinate space
                point2D.x = (point2D.x - boundingEnuMin.x) / boundingPointsWidth;
                point2D.y = (point2D.y - boundingEnuMin.y) / boundingPointsHeight;
            }

            var minXYCorner = points2D[0];
            var maxYCorner = points2D[1];
            var maxXCorner = points2D[2];
            var result = new Array(6);
            Cartesian2.Cartesian2.pack(minXYCorner, result);
            Cartesian2.Cartesian2.pack(maxYCorner, result, 2);
            Cartesian2.Cartesian2.pack(maxXCorner, result, 4);

            return result;
        };

    /**
         * Values and type information for geometry attributes.  A {@link Geometry}
         * generally contains one or more attributes.  All attributes together form
         * the geometry's vertices.
         *
         * @alias GeometryAttribute
         * @constructor
         *
         * @param {Object} [options] Object with the following properties:
         * @param {ComponentDatatype} [options.componentDatatype] The datatype of each component in the attribute, e.g., individual elements in values.
         * @param {Number} [options.componentsPerAttribute] A number between 1 and 4 that defines the number of components in an attributes.
         * @param {Boolean} [options.normalize=false] When <code>true</code> and <code>componentDatatype</code> is an integer format, indicate that the components should be mapped to the range [0, 1] (unsigned) or [-1, 1] (signed) when they are accessed as floating-point for rendering.
         * @param {TypedArray} [options.values] The values for the attributes stored in a typed array.
         *
         * @exception {DeveloperError} options.componentsPerAttribute must be between 1 and 4.
         *
         *
         * @example
         * var geometry = new Cesium.Geometry({
         *   attributes : {
         *     position : new Cesium.GeometryAttribute({
         *       componentDatatype : Cesium.ComponentDatatype.FLOAT,
         *       componentsPerAttribute : 3,
         *       values : new Float32Array([
         *         0.0, 0.0, 0.0,
         *         7500000.0, 0.0, 0.0,
         *         0.0, 7500000.0, 0.0
         *       ])
         *     })
         *   },
         *   primitiveType : Cesium.PrimitiveType.LINE_LOOP
         * });
         *
         * @see Geometry
         */
        function GeometryAttribute(options) {
            options = when.defaultValue(options, when.defaultValue.EMPTY_OBJECT);

            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(options.componentDatatype)) {
                throw new Check.DeveloperError('options.componentDatatype is required.');
            }
            if (!when.defined(options.componentsPerAttribute)) {
                throw new Check.DeveloperError('options.componentsPerAttribute is required.');
            }
            if (options.componentsPerAttribute < 1 || options.componentsPerAttribute > 4) {
                throw new Check.DeveloperError('options.componentsPerAttribute must be between 1 and 4.');
            }
            if (!when.defined(options.values)) {
                throw new Check.DeveloperError('options.values is required.');
            }
            //>>includeEnd('debug');

            /**
             * The datatype of each component in the attribute, e.g., individual elements in
             * {@link GeometryAttribute#values}.
             *
             * @type ComponentDatatype
             *
             * @default undefined
             */
            this.componentDatatype = options.componentDatatype;

            /**
             * A number between 1 and 4 that defines the number of components in an attributes.
             * For example, a position attribute with x, y, and z components would have 3 as
             * shown in the code example.
             *
             * @type Number
             *
             * @default undefined
             *
             * @example
             * attribute.componentDatatype = Cesium.ComponentDatatype.FLOAT;
             * attribute.componentsPerAttribute = 3;
             * attribute.values = new Float32Array([
             *   0.0, 0.0, 0.0,
             *   7500000.0, 0.0, 0.0,
             *   0.0, 7500000.0, 0.0
             * ]);
             */
            this.componentsPerAttribute = options.componentsPerAttribute;

            /**
             * When <code>true</code> and <code>componentDatatype</code> is an integer format,
             * indicate that the components should be mapped to the range [0, 1] (unsigned)
             * or [-1, 1] (signed) when they are accessed as floating-point for rendering.
             * <p>
             * This is commonly used when storing colors using {@link ComponentDatatype.UNSIGNED_BYTE}.
             * </p>
             *
             * @type Boolean
             *
             * @default false
             *
             * @example
             * attribute.componentDatatype = Cesium.ComponentDatatype.UNSIGNED_BYTE;
             * attribute.componentsPerAttribute = 4;
             * attribute.normalize = true;
             * attribute.values = new Uint8Array([
             *   Cesium.Color.floatToByte(color.red),
             *   Cesium.Color.floatToByte(color.green),
             *   Cesium.Color.floatToByte(color.blue),
             *   Cesium.Color.floatToByte(color.alpha)
             * ]);
             */
            this.normalize = when.defaultValue(options.normalize, false);

            /**
             * The values for the attributes stored in a typed array.  In the code example,
             * every three elements in <code>values</code> defines one attributes since
             * <code>componentsPerAttribute</code> is 3.
             *
             * @type TypedArray
             *
             * @default undefined
             *
             * @example
             * attribute.componentDatatype = Cesium.ComponentDatatype.FLOAT;
             * attribute.componentsPerAttribute = 3;
             * attribute.values = new Float32Array([
             *   0.0, 0.0, 0.0,
             *   7500000.0, 0.0, 0.0,
             *   0.0, 7500000.0, 0.0
             * ]);
             */
            this.values = options.values;
        }

    exports.Geometry = Geometry;
    exports.GeometryAttribute = GeometryAttribute;
    exports.GeometryType = GeometryType$1;
    exports.Matrix2 = Matrix2;

});

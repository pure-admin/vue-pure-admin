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
define(['./when-8d13db60', './Check-70bec281', './Math-61ede240', './Cartographic-fe4be337', './Cartesian2-85064f09', './BoundingSphere-775c5788', './Cartesian4-5af5bb24', './RuntimeError-ba10bc3e', './WebGLConstants-4c11ee5f', './ComponentDatatype-5862616f', './GeometryAttribute-06d31d45', './PrimitiveType-97893bc7', './FeatureDetection-7bd32c34', './Transforms-913163ed', './buildModuleUrl-9d43158d', './GeometryAttributes-aacecde6', './GeometryOffsetAttribute-ca302482'], function (when, Check, _Math, Cartographic, Cartesian2, BoundingSphere, Cartesian4, RuntimeError, WebGLConstants, ComponentDatatype, GeometryAttribute, PrimitiveType, FeatureDetection, Transforms, buildModuleUrl, GeometryAttributes, GeometryOffsetAttribute) { 'use strict';

    var diffScratch = new Cartographic.Cartesian3();

        /**
         * A description of the outline of a cube centered at the origin.
         *
         * @alias BoxOutlineGeometry
         * @constructor
         *
         * @param {Object} options Object with the following properties:
         * @param {Cartesian3} options.minimum The minimum x, y, and z coordinates of the box.
         * @param {Cartesian3} options.maximum The maximum x, y, and z coordinates of the box.
         *
         * @see BoxOutlineGeometry.fromDimensions
         * @see BoxOutlineGeometry.createGeometry
         * @see Packable
         *
         * @example
         * var box = new Cesium.BoxOutlineGeometry({
         *   maximum : new Cesium.Cartesian3(250000.0, 250000.0, 250000.0),
         *   minimum : new Cesium.Cartesian3(-250000.0, -250000.0, -250000.0)
         * });
         * var geometry = Cesium.BoxOutlineGeometry.createGeometry(box);
         */
        function BoxOutlineGeometry(options) {
            options = when.defaultValue(options, when.defaultValue.EMPTY_OBJECT);

            var min = options.minimum;
            var max = options.maximum;

            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('min', min);
            Check.Check.typeOf.object('max', max);
            if (when.defined(options.offsetAttribute) && options.offsetAttribute === GeometryOffsetAttribute.GeometryOffsetAttribute.TOP) {
                throw new Check.DeveloperError('GeometryOffsetAttribute.TOP is not a supported options.offsetAttribute for this geometry.');
            }
            //>>includeEnd('debug');

            this._min = Cartographic.Cartesian3.clone(min);
            this._max = Cartographic.Cartesian3.clone(max);
            this._offsetAttribute = options.offsetAttribute;
            this._workerName = 'createBoxOutlineGeometry';
        }

        /**
         * Creates an outline of a cube centered at the origin given its dimensions.
         *
         * @param {Object} options Object with the following properties:
         * @param {Cartesian3} options.dimensions The width, depth, and height of the box stored in the x, y, and z coordinates of the <code>Cartesian3</code>, respectively.
         * @returns {BoxOutlineGeometry}
         *
         * @exception {DeveloperError} All dimensions components must be greater than or equal to zero.
         *
         *
         * @example
         * var box = Cesium.BoxOutlineGeometry.fromDimensions({
         *   dimensions : new Cesium.Cartesian3(500000.0, 500000.0, 500000.0)
         * });
         * var geometry = Cesium.BoxOutlineGeometry.createGeometry(box);
         *
         * @see BoxOutlineGeometry.createGeometry
         */
        BoxOutlineGeometry.fromDimensions = function(options) {
            options = when.defaultValue(options, when.defaultValue.EMPTY_OBJECT);
            var dimensions = options.dimensions;

            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('dimensions', dimensions);
            Check.Check.typeOf.number.greaterThanOrEquals('dimensions.x', dimensions.x, 0);
            Check.Check.typeOf.number.greaterThanOrEquals('dimensions.y', dimensions.y, 0);
            Check.Check.typeOf.number.greaterThanOrEquals('dimensions.z', dimensions.z, 0);
            //>>includeEnd('debug');

            var corner = Cartographic.Cartesian3.multiplyByScalar(dimensions, 0.5, new Cartographic.Cartesian3());

            return new BoxOutlineGeometry({
                minimum : Cartographic.Cartesian3.negate(corner, new Cartographic.Cartesian3()),
                maximum : corner,
                offsetAttribute: options.offsetAttribute
            });
        };

        /**
         * Creates an outline of a cube from the dimensions of an AxisAlignedBoundingBox.
         *
         * @param {AxisAlignedBoundingBox} boundingBox A description of the AxisAlignedBoundingBox.
         * @returns {BoxOutlineGeometry}
         *
         *
         *
         * @example
         * var aabb = Cesium.AxisAlignedBoundingBox.fromPoints(Cesium.Cartesian3.fromDegreesArray([
         *      -72.0, 40.0,
         *      -70.0, 35.0,
         *      -75.0, 30.0,
         *      -70.0, 30.0,
         *      -68.0, 40.0
         * ]));
         * var box = Cesium.BoxOutlineGeometry.fromAxisAlignedBoundingBox(aabb);
         *
         *  @see BoxOutlineGeometry.createGeometry
         */
        BoxOutlineGeometry.fromAxisAlignedBoundingBox = function(boundingBox) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('boundindBox', boundingBox);
            //>>includeEnd('debug');

            return new BoxOutlineGeometry({
                minimum : boundingBox.minimum,
                maximum : boundingBox.maximum
            });
        };

        /**
         * The number of elements used to pack the object into an array.
         * @type {Number}
         */
        BoxOutlineGeometry.packedLength = 2 * Cartographic.Cartesian3.packedLength + 1;

        /**
         * Stores the provided instance into the provided array.
         *
         * @param {BoxOutlineGeometry} value The value to pack.
         * @param {Number[]} array The array to pack into.
         * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
         *
         * @returns {Number[]} The array that was packed into
         */
        BoxOutlineGeometry.pack = function(value, array, startingIndex) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('value', value);
            Check.Check.defined('array', array);
            //>>includeEnd('debug');

            startingIndex = when.defaultValue(startingIndex, 0);

            Cartographic.Cartesian3.pack(value._min, array, startingIndex);
            Cartographic.Cartesian3.pack(value._max, array, startingIndex + Cartographic.Cartesian3.packedLength);
            array[startingIndex + (Cartographic.Cartesian3.packedLength * 2)] = when.defaultValue(value._offsetAttribute, -1);

            return array;
        };

        var scratchMin = new Cartographic.Cartesian3();
        var scratchMax = new Cartographic.Cartesian3();
        var scratchOptions = {
            minimum : scratchMin,
            maximum : scratchMax,
            offsetAttribute : undefined
        };

        /**
         * Retrieves an instance from a packed array.
         *
         * @param {Number[]} array The packed array.
         * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
         * @param {BoxOutlineGeometry} [result] The object into which to store the result.
         * @returns {BoxOutlineGeometry} The modified result parameter or a new BoxOutlineGeometry instance if one was not provided.
         */
        BoxOutlineGeometry.unpack = function(array, startingIndex, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('array', array);
            //>>includeEnd('debug');

            startingIndex = when.defaultValue(startingIndex, 0);

            var min = Cartographic.Cartesian3.unpack(array, startingIndex, scratchMin);
            var max = Cartographic.Cartesian3.unpack(array, startingIndex + Cartographic.Cartesian3.packedLength, scratchMax);
            var offsetAttribute = array[startingIndex + Cartographic.Cartesian3.packedLength * 2];

            if (!when.defined(result)) {
                scratchOptions.offsetAttribute = offsetAttribute === -1 ? undefined : offsetAttribute;
                return new BoxOutlineGeometry(scratchOptions);
            }

            result._min = Cartographic.Cartesian3.clone(min, result._min);
            result._max = Cartographic.Cartesian3.clone(max, result._max);
            result._offsetAttribute = offsetAttribute === -1 ? undefined : offsetAttribute;

            return result;
        };

        /**
         * Computes the geometric representation of an outline of a box, including its vertices, indices, and a bounding sphere.
         *
         * @param {BoxOutlineGeometry} boxGeometry A description of the box outline.
         * @returns {Geometry|undefined} The computed vertices and indices.
         */
        BoxOutlineGeometry.createGeometry = function(boxGeometry) {
            var min = boxGeometry._min;
            var max = boxGeometry._max;

            if (Cartographic.Cartesian3.equals(min, max)) {
                return;
            }

            var attributes = new GeometryAttributes.GeometryAttributes();
            var indices = new Uint16Array(12 * 2);
            var positions = new Float64Array(8 * 3);

            positions[0] = min.x;
            positions[1] = min.y;
            positions[2] = min.z;
            positions[3] = max.x;
            positions[4] = min.y;
            positions[5] = min.z;
            positions[6] = max.x;
            positions[7] = max.y;
            positions[8] = min.z;
            positions[9] = min.x;
            positions[10] = max.y;
            positions[11] = min.z;

            positions[12] = min.x;
            positions[13] = min.y;
            positions[14] = max.z;
            positions[15] = max.x;
            positions[16] = min.y;
            positions[17] = max.z;
            positions[18] = max.x;
            positions[19] = max.y;
            positions[20] = max.z;
            positions[21] = min.x;
            positions[22] = max.y;
            positions[23] = max.z;

            attributes.position = new GeometryAttribute.GeometryAttribute({
                componentDatatype : ComponentDatatype.ComponentDatatype.DOUBLE,
                componentsPerAttribute : 3,
                values : positions
            });

            // top
            indices[0] = 4;
            indices[1] = 5;
            indices[2] = 5;
            indices[3] = 6;
            indices[4] = 6;
            indices[5] = 7;
            indices[6] = 7;
            indices[7] = 4;

            // bottom
            indices[8] = 0;
            indices[9] = 1;
            indices[10] = 1;
            indices[11] = 2;
            indices[12] = 2;
            indices[13] = 3;
            indices[14] = 3;
            indices[15] = 0;

            // left
            indices[16] = 0;
            indices[17] = 4;
            indices[18] = 1;
            indices[19] = 5;

            //right
            indices[20] = 2;
            indices[21] = 6;
            indices[22] = 3;
            indices[23] = 7;

            var diff = Cartographic.Cartesian3.subtract(max, min, diffScratch);
            var radius = Cartographic.Cartesian3.magnitude(diff) * 0.5;

            if (when.defined(boxGeometry._offsetAttribute)) {
                var length = positions.length;
                var applyOffset = new Uint8Array(length / 3);
                var offsetValue = boxGeometry._offsetAttribute === GeometryOffsetAttribute.GeometryOffsetAttribute.NONE ? 0 : 1;
                GeometryOffsetAttribute.arrayFill(applyOffset, offsetValue);
                attributes.applyOffset = new GeometryAttribute.GeometryAttribute({
                    componentDatatype : ComponentDatatype.ComponentDatatype.UNSIGNED_BYTE,
                    componentsPerAttribute : 1,
                    values: applyOffset
                });
            }

            return new GeometryAttribute.Geometry({
                attributes : attributes,
                indices : indices,
                primitiveType : PrimitiveType.PrimitiveType.LINES,
                boundingSphere : new BoundingSphere.BoundingSphere(Cartographic.Cartesian3.ZERO, radius),
                offsetAttribute : boxGeometry._offsetAttribute
            });
        };

    function createBoxOutlineGeometry(boxGeometry, offset) {
        if (when.defined(offset)) {
            boxGeometry = BoxOutlineGeometry.unpack(boxGeometry, offset);
        }
        return BoxOutlineGeometry.createGeometry(boxGeometry);
    }

    return createBoxOutlineGeometry;

});

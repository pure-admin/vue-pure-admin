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
define(['./when-8d13db60', './Check-70bec281', './Math-61ede240', './Cartographic-fe4be337', './Cartesian2-85064f09', './BoundingSphere-775c5788', './Cartesian4-5af5bb24', './RuntimeError-ba10bc3e', './WebGLConstants-4c11ee5f', './ComponentDatatype-5862616f', './GeometryAttribute-06d31d45', './PrimitiveType-97893bc7', './FeatureDetection-7bd32c34', './Transforms-913163ed', './buildModuleUrl-9d43158d', './GeometryAttributes-aacecde6', './IndexDatatype-9435b55f', './GeometryOffsetAttribute-ca302482', './EllipsoidRhumbLine-f161e674', './earcut-2.2.1-b404d9e6', './PolygonPipeline-62047934', './RectangleGeometryLibrary-430d6a29'], function (when, Check, _Math, Cartographic, Cartesian2, BoundingSphere, Cartesian4, RuntimeError, WebGLConstants, ComponentDatatype, GeometryAttribute, PrimitiveType, FeatureDetection, Transforms, buildModuleUrl, GeometryAttributes, IndexDatatype, GeometryOffsetAttribute, EllipsoidRhumbLine, earcut2_2_1, PolygonPipeline, RectangleGeometryLibrary) { 'use strict';

    var bottomBoundingSphere = new BoundingSphere.BoundingSphere();
        var topBoundingSphere = new BoundingSphere.BoundingSphere();
        var positionScratch = new Cartographic.Cartesian3();
        var rectangleScratch = new Cartesian2.Rectangle();

        function constructRectangle(geometry, computedOptions) {
            var ellipsoid = geometry._ellipsoid;
            var height = computedOptions.height;
            var width = computedOptions.width;
            var northCap = computedOptions.northCap;
            var southCap = computedOptions.southCap;

            var rowHeight = height;
            var widthMultiplier = 2;
            var size = 0;
            var corners = 4;
            if (northCap) {
                widthMultiplier -= 1;
                rowHeight -= 1;
                size += 1;
                corners -= 2;
            }
            if (southCap) {
                widthMultiplier -= 1;
                rowHeight -= 1;
                size += 1;
                corners -= 2;
            }
            size += (widthMultiplier * width + 2 * rowHeight - corners);

            var positions = new Float64Array(size * 3);

            var posIndex = 0;
            var row = 0;
            var col;
            var position = positionScratch;
            if (northCap) {
                RectangleGeometryLibrary.RectangleGeometryLibrary.computePosition(computedOptions, ellipsoid, false, row, 0, position);
                positions[posIndex++] = position.x;
                positions[posIndex++] = position.y;
                positions[posIndex++] = position.z;
            } else {
                for (col = 0; col < width; col++) {
                    RectangleGeometryLibrary.RectangleGeometryLibrary.computePosition(computedOptions, ellipsoid, false, row, col, position);
                    positions[posIndex++] = position.x;
                    positions[posIndex++] = position.y;
                    positions[posIndex++] = position.z;
                }
            }

            col = width - 1;
            for (row = 1; row < height; row++) {
                RectangleGeometryLibrary.RectangleGeometryLibrary.computePosition(computedOptions, ellipsoid, false, row, col, position);
                positions[posIndex++] = position.x;
                positions[posIndex++] = position.y;
                positions[posIndex++] = position.z;
            }

            row = height - 1;
            if (!southCap) {  // if southCap is true, we dont need to add any more points because the south pole point was added by the iteration above
                for (col = width - 2; col >= 0; col--) {
                    RectangleGeometryLibrary.RectangleGeometryLibrary.computePosition(computedOptions, ellipsoid, false, row, col, position);
                    positions[posIndex++] = position.x;
                    positions[posIndex++] = position.y;
                    positions[posIndex++] = position.z;
                }
            }

            col = 0;
            for (row = height - 2; row > 0; row--) {
                RectangleGeometryLibrary.RectangleGeometryLibrary.computePosition(computedOptions, ellipsoid, false, row, col, position);
                positions[posIndex++] = position.x;
                positions[posIndex++] = position.y;
                positions[posIndex++] = position.z;
            }

            var indicesSize = positions.length / 3 * 2;
            var indices = IndexDatatype.IndexDatatype.createTypedArray(positions.length / 3, indicesSize);

            var index = 0;
            for (var i = 0; i < (positions.length / 3) - 1; i++) {
                indices[index++] = i;
                indices[index++] = i + 1;
            }
            indices[index++] = (positions.length / 3) - 1;
            indices[index++] = 0;

            var geo = new GeometryAttribute.Geometry({
                attributes : new GeometryAttributes.GeometryAttributes(),
                primitiveType : PrimitiveType.PrimitiveType.LINES
            });

            geo.attributes.position = new GeometryAttribute.GeometryAttribute({
                componentDatatype : ComponentDatatype.ComponentDatatype.DOUBLE,
                componentsPerAttribute : 3,
                values : positions
            });
            geo.indices = indices;

            return geo;
        }

        function constructExtrudedRectangle(rectangleGeometry, computedOptions) {
            var surfaceHeight = rectangleGeometry._surfaceHeight;
            var extrudedHeight = rectangleGeometry._extrudedHeight;
            var ellipsoid = rectangleGeometry._ellipsoid;
            var minHeight = extrudedHeight;
            var maxHeight = surfaceHeight;
            var geo = constructRectangle(rectangleGeometry, computedOptions);

            var height = computedOptions.height;
            var width = computedOptions.width;

            var topPositions = PolygonPipeline.PolygonPipeline.scaleToGeodeticHeight(geo.attributes.position.values, maxHeight, ellipsoid, false);
            var length = topPositions.length;
            var positions = new Float64Array(length * 2);
            positions.set(topPositions);
            var bottomPositions = PolygonPipeline.PolygonPipeline.scaleToGeodeticHeight(geo.attributes.position.values, minHeight, ellipsoid);
            positions.set(bottomPositions, length);
            geo.attributes.position.values = positions;

            var northCap = computedOptions.northCap;
            var southCap = computedOptions.southCap;
            var corners = 4;
            if (northCap) {
                corners -= 1;
            }
            if (southCap) {
                corners -= 1;
            }

            var indicesSize = (positions.length / 3 + corners) * 2;
            var indices = IndexDatatype.IndexDatatype.createTypedArray(positions.length / 3, indicesSize);
            length = positions.length / 6;
            var index = 0;
            for (var i = 0; i < length - 1; i++) {
                indices[index++] = i;
                indices[index++] = i + 1;
                indices[index++] = i + length;
                indices[index++] = i + length + 1;
            }
            indices[index++] = length - 1;
            indices[index++] = 0;
            indices[index++] = length + length - 1;
            indices[index++] = length;

            indices[index++] = 0;
            indices[index++] = length;

            var bottomCorner;
            if (northCap) {
                bottomCorner = height - 1;
            } else {
                var topRightCorner = width - 1;
                indices[index++] = topRightCorner;
                indices[index++] = topRightCorner + length;
                bottomCorner = width + height - 2;
            }

            indices[index++] = bottomCorner;
            indices[index++] = bottomCorner + length;

            if (!southCap) {
                var bottomLeftCorner = width + bottomCorner - 1;
                indices[index++] = bottomLeftCorner;
                indices[index] = bottomLeftCorner + length;
            }

            geo.indices = indices;

            return geo;
        }

        /**
         * A description of the outline of a a cartographic rectangle on an ellipsoid centered at the origin.
         *
         * @alias RectangleOutlineGeometry
         * @constructor
         *
         * @param {Object} options Object with the following properties:
         * @param {Rectangle} options.rectangle A cartographic rectangle with north, south, east and west properties in radians.
         * @param {Ellipsoid} [options.ellipsoid=Ellipsoid.WGS84] The ellipsoid on which the rectangle lies.
         * @param {Number} [options.granularity=CesiumMath.RADIANS_PER_DEGREE] The distance, in radians, between each latitude and longitude. Determines the number of positions in the buffer.
         * @param {Number} [options.height=0.0] The distance in meters between the rectangle and the ellipsoid surface.
         * @param {Number} [options.rotation=0.0] The rotation of the rectangle, in radians. A positive rotation is counter-clockwise.
         * @param {Number} [options.extrudedHeight] The distance in meters between the rectangle's extruded face and the ellipsoid surface.
         *
         * @exception {DeveloperError} <code>options.rectangle.north</code> must be in the interval [<code>-Pi/2</code>, <code>Pi/2</code>].
         * @exception {DeveloperError} <code>options.rectangle.south</code> must be in the interval [<code>-Pi/2</code>, <code>Pi/2</code>].
         * @exception {DeveloperError} <code>options.rectangle.east</code> must be in the interval [<code>-Pi</code>, <code>Pi</code>].
         * @exception {DeveloperError} <code>options.rectangle.west</code> must be in the interval [<code>-Pi</code>, <code>Pi</code>].
         * @exception {DeveloperError} <code>options.rectangle.north</code> must be greater than <code>rectangle.south</code>.
         *
         * @see RectangleOutlineGeometry#createGeometry
         *
         * @example
         * var rectangle = new Cesium.RectangleOutlineGeometry({
         *   ellipsoid : Cesium.Ellipsoid.WGS84,
         *   rectangle : Cesium.Rectangle.fromDegrees(-80.0, 39.0, -74.0, 42.0),
         *   height : 10000.0
         * });
         * var geometry = Cesium.RectangleOutlineGeometry.createGeometry(rectangle);
         */
        function RectangleOutlineGeometry(options) {
            options = when.defaultValue(options, when.defaultValue.EMPTY_OBJECT);

            var rectangle = options.rectangle;
            var granularity = when.defaultValue(options.granularity, _Math.CesiumMath.RADIANS_PER_DEGREE);
            var ellipsoid = when.defaultValue(options.ellipsoid, Cartesian2.Ellipsoid.WGS84);
            var rotation = when.defaultValue(options.rotation, 0.0);

            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(rectangle)) {
                throw new Check.DeveloperError('rectangle is required.');
            }
            Cartesian2.Rectangle.validate(rectangle);
            if (rectangle.north < rectangle.south) {
                throw new Check.DeveloperError('options.rectangle.north must be greater than options.rectangle.south');
            }
            //>>includeEnd('debug');

            var height = when.defaultValue(options.height, 0.0);
            var extrudedHeight = when.defaultValue(options.extrudedHeight, height);

            this._rectangle = Cartesian2.Rectangle.clone(rectangle);
            this._granularity = granularity;
            this._ellipsoid = ellipsoid;
            this._surfaceHeight = Math.max(height, extrudedHeight);
            this._rotation = rotation;
            this._extrudedHeight = Math.min(height, extrudedHeight);
            this._offsetAttribute = options.offsetAttribute;
            this._workerName = 'createRectangleOutlineGeometry';
        }

        /**
         * The number of elements used to pack the object into an array.
         * @type {Number}
         */
        RectangleOutlineGeometry.packedLength = Cartesian2.Rectangle.packedLength + Cartesian2.Ellipsoid.packedLength + 5;

        /**
         * Stores the provided instance into the provided array.
         *
         * @param {RectangleOutlineGeometry} value The value to pack.
         * @param {Number[]} array The array to pack into.
         * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
         *
         * @returns {Number[]} The array that was packed into
         */
        RectangleOutlineGeometry.pack = function(value, array, startingIndex) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(value)) {
                throw new Check.DeveloperError('value is required');
            }

            if (!when.defined(array)) {
                throw new Check.DeveloperError('array is required');
            }
            //>>includeEnd('debug');

            startingIndex = when.defaultValue(startingIndex, 0);

            Cartesian2.Rectangle.pack(value._rectangle, array, startingIndex);
            startingIndex += Cartesian2.Rectangle.packedLength;

            Cartesian2.Ellipsoid.pack(value._ellipsoid, array, startingIndex);
            startingIndex += Cartesian2.Ellipsoid.packedLength;

            array[startingIndex++] = value._granularity;
            array[startingIndex++] = value._surfaceHeight;
            array[startingIndex++] = value._rotation;
            array[startingIndex++] = value._extrudedHeight;
            array[startingIndex] = when.defaultValue(value._offsetAttribute, -1);

            return array;
        };

        var scratchRectangle = new Cartesian2.Rectangle();
        var scratchEllipsoid = Cartesian2.Ellipsoid.clone(Cartesian2.Ellipsoid.UNIT_SPHERE);
        var scratchOptions = {
            rectangle : scratchRectangle,
            ellipsoid : scratchEllipsoid,
            granularity : undefined,
            height : undefined,
            rotation : undefined,
            extrudedHeight : undefined,
            offsetAttribute : undefined
        };

        /**
         * Retrieves an instance from a packed array.
         *
         * @param {Number[]} array The packed array.
         * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
         * @param {RectangleOutlineGeometry} [result] The object into which to store the result.
         * @returns {RectangleOutlineGeometry} The modified result parameter or a new Quaternion instance if one was not provided.
         */
        RectangleOutlineGeometry.unpack = function(array, startingIndex, result) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(array)) {
                throw new Check.DeveloperError('array is required');
            }
            //>>includeEnd('debug');

            startingIndex = when.defaultValue(startingIndex, 0);

            var rectangle = Cartesian2.Rectangle.unpack(array, startingIndex, scratchRectangle);
            startingIndex += Cartesian2.Rectangle.packedLength;

            var ellipsoid = Cartesian2.Ellipsoid.unpack(array, startingIndex, scratchEllipsoid);
            startingIndex += Cartesian2.Ellipsoid.packedLength;

            var granularity = array[startingIndex++];
            var height = array[startingIndex++];
            var rotation = array[startingIndex++];
            var extrudedHeight = array[startingIndex++];
            var offsetAttribute = array[startingIndex];

            if (!when.defined(result)) {
                scratchOptions.granularity = granularity;
                scratchOptions.height = height;
                scratchOptions.rotation = rotation;
                scratchOptions.extrudedHeight = extrudedHeight;
                scratchOptions.offsetAttribute = offsetAttribute === -1 ? undefined : offsetAttribute;

                return new RectangleOutlineGeometry(scratchOptions);
            }

            result._rectangle = Cartesian2.Rectangle.clone(rectangle, result._rectangle);
            result._ellipsoid = Cartesian2.Ellipsoid.clone(ellipsoid, result._ellipsoid);
            result._surfaceHeight = height;
            result._rotation = rotation;
            result._extrudedHeight = extrudedHeight;
            result._offsetAttribute = offsetAttribute === -1 ? undefined : offsetAttribute;

            return result;
        };

        var nwScratch = new Cartographic.Cartographic();
        /**
         * Computes the geometric representation of an outline of a rectangle, including its vertices, indices, and a bounding sphere.
         *
         * @param {RectangleOutlineGeometry} rectangleGeometry A description of the rectangle outline.
         * @returns {Geometry|undefined} The computed vertices and indices.
         *
         * @exception {DeveloperError} Rotated rectangle is invalid.
         */
        RectangleOutlineGeometry.createGeometry = function(rectangleGeometry) {
            var rectangle = rectangleGeometry._rectangle;
            var ellipsoid = rectangleGeometry._ellipsoid;
            var computedOptions = RectangleGeometryLibrary.RectangleGeometryLibrary.computeOptions(rectangle, rectangleGeometry._granularity, rectangleGeometry._rotation, 0, rectangleScratch, nwScratch);

            var geometry;
            var boundingSphere;

            if ((_Math.CesiumMath.equalsEpsilon(rectangle.north, rectangle.south, _Math.CesiumMath.EPSILON10) ||
                 (_Math.CesiumMath.equalsEpsilon(rectangle.east, rectangle.west, _Math.CesiumMath.EPSILON10)))) {
                return undefined;
            }

            var surfaceHeight = rectangleGeometry._surfaceHeight;
            var extrudedHeight = rectangleGeometry._extrudedHeight;
            var extrude = !_Math.CesiumMath.equalsEpsilon(surfaceHeight, extrudedHeight, 0, _Math.CesiumMath.EPSILON2);
            var offsetValue;
            if (extrude) {
                geometry = constructExtrudedRectangle(rectangleGeometry, computedOptions);
                if (when.defined(rectangleGeometry._offsetAttribute)) {
                    var size = geometry.attributes.position.values.length / 3;
                    var offsetAttribute = new Uint8Array(size);
                    if (rectangleGeometry._offsetAttribute === GeometryOffsetAttribute.GeometryOffsetAttribute.TOP) {
                        offsetAttribute = GeometryOffsetAttribute.arrayFill(offsetAttribute, 1, 0, size / 2);
                    } else {
                        offsetValue = rectangleGeometry._offsetAttribute === GeometryOffsetAttribute.GeometryOffsetAttribute.NONE ? 0 : 1;
                        offsetAttribute = GeometryOffsetAttribute.arrayFill(offsetAttribute, offsetValue);
                    }

                    geometry.attributes.applyOffset = new GeometryAttribute.GeometryAttribute({
                        componentDatatype : ComponentDatatype.ComponentDatatype.UNSIGNED_BYTE,
                        componentsPerAttribute : 1,
                        values : offsetAttribute
                    });
                }
                var topBS = BoundingSphere.BoundingSphere.fromRectangle3D(rectangle, ellipsoid, surfaceHeight, topBoundingSphere);
                var bottomBS = BoundingSphere.BoundingSphere.fromRectangle3D(rectangle, ellipsoid, extrudedHeight, bottomBoundingSphere);
                boundingSphere = BoundingSphere.BoundingSphere.union(topBS, bottomBS);
            } else {
                geometry = constructRectangle(rectangleGeometry, computedOptions);
                geometry.attributes.position.values = PolygonPipeline.PolygonPipeline.scaleToGeodeticHeight(geometry.attributes.position.values, surfaceHeight, ellipsoid, false);

                if (when.defined(rectangleGeometry._offsetAttribute)) {
                    var length = geometry.attributes.position.values.length;
                    var applyOffset = new Uint8Array(length / 3);
                    offsetValue = rectangleGeometry._offsetAttribute === GeometryOffsetAttribute.GeometryOffsetAttribute.NONE ? 0 : 1;
                    GeometryOffsetAttribute.arrayFill(applyOffset, offsetValue);
                    geometry.attributes.applyOffset = new GeometryAttribute.GeometryAttribute({
                        componentDatatype : ComponentDatatype.ComponentDatatype.UNSIGNED_BYTE,
                        componentsPerAttribute : 1,
                        values : applyOffset
                    });
                }

                boundingSphere = BoundingSphere.BoundingSphere.fromRectangle3D(rectangle, ellipsoid, surfaceHeight);
            }

            return new GeometryAttribute.Geometry({
                attributes : geometry.attributes,
                indices : geometry.indices,
                primitiveType : PrimitiveType.PrimitiveType.LINES,
                boundingSphere : boundingSphere,
                offsetAttribute : rectangleGeometry._offsetAttribute
            });
        };

    function createRectangleOutlineGeometry(rectangleGeometry, offset) {
        if (when.defined(offset)) {
            rectangleGeometry = RectangleOutlineGeometry.unpack(rectangleGeometry, offset);
        }
        rectangleGeometry._ellipsoid = Cartesian2.Ellipsoid.clone(rectangleGeometry._ellipsoid);
        rectangleGeometry._rectangle = Cartesian2.Rectangle.clone(rectangleGeometry._rectangle);
        return RectangleOutlineGeometry.createGeometry(rectangleGeometry);
    }

    return createRectangleOutlineGeometry;

});

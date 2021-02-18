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
define(['./when-8d13db60', './Check-70bec281', './Math-61ede240', './Cartographic-fe4be337', './Cartesian2-85064f09', './BoundingSphere-775c5788', './Cartesian4-5af5bb24', './RuntimeError-ba10bc3e', './WebGLConstants-4c11ee5f', './ComponentDatatype-5862616f', './GeometryAttribute-06d31d45', './PrimitiveType-97893bc7', './FeatureDetection-7bd32c34', './Transforms-913163ed', './buildModuleUrl-9d43158d', './GeometryAttributes-aacecde6', './IndexDatatype-9435b55f', './IntersectionTests-397d9494', './Plane-8390418f', './EllipsoidTangentPlane-605dc181', './EllipsoidRhumbLine-f161e674', './earcut-2.2.1-b404d9e6', './PolygonPipeline-62047934', './EllipsoidGeodesic-84507801', './PolylinePipeline-a9f32196', './WallGeometryLibrary-398a350f'], function (when, Check, _Math, Cartographic, Cartesian2, BoundingSphere, Cartesian4, RuntimeError, WebGLConstants, ComponentDatatype, GeometryAttribute, PrimitiveType, FeatureDetection, Transforms, buildModuleUrl, GeometryAttributes, IndexDatatype, IntersectionTests, Plane, EllipsoidTangentPlane, EllipsoidRhumbLine, earcut2_2_1, PolygonPipeline, EllipsoidGeodesic, PolylinePipeline, WallGeometryLibrary) { 'use strict';

    var scratchCartesian3Position1 = new Cartographic.Cartesian3();
        var scratchCartesian3Position2 = new Cartographic.Cartesian3();

        /**
         * A description of a wall outline. A wall is defined by a series of points,
         * which extrude down to the ground. Optionally, they can extrude downwards to a specified height.
         *
         * @alias WallOutlineGeometry
         * @constructor
         *
         * @param {Object} options Object with the following properties:
         * @param {Cartesian3[]} options.positions An array of Cartesian objects, which are the points of the wall.
         * @param {Number} [options.granularity=CesiumMath.RADIANS_PER_DEGREE] The distance, in radians, between each latitude and longitude. Determines the number of positions in the buffer.
         * @param {Number[]} [options.maximumHeights] An array parallel to <code>positions</code> that give the maximum height of the
         *        wall at <code>positions</code>. If undefined, the height of each position in used.
         * @param {Number[]} [options.minimumHeights] An array parallel to <code>positions</code> that give the minimum height of the
         *        wall at <code>positions</code>. If undefined, the height at each position is 0.0.
         * @param {Ellipsoid} [options.ellipsoid=Ellipsoid.WGS84] The ellipsoid for coordinate manipulation
         *
         * @exception {DeveloperError} positions length must be greater than or equal to 2.
         * @exception {DeveloperError} positions and maximumHeights must have the same length.
         * @exception {DeveloperError} positions and minimumHeights must have the same length.
         *
         * @see WallGeometry#createGeometry
         * @see WallGeometry#fromConstantHeight
         *
         * @example
         * // create a wall outline that spans from ground level to 10000 meters
         * var wall = new Cesium.WallOutlineGeometry({
         *   positions : Cesium.Cartesian3.fromDegreesArrayHeights([
         *     19.0, 47.0, 10000.0,
         *     19.0, 48.0, 10000.0,
         *     20.0, 48.0, 10000.0,
         *     20.0, 47.0, 10000.0,
         *     19.0, 47.0, 10000.0
         *   ])
         * });
         * var geometry = Cesium.WallOutlineGeometry.createGeometry(wall);
         */
        function WallOutlineGeometry(options) {
            options = when.defaultValue(options, when.defaultValue.EMPTY_OBJECT);

            var wallPositions = options.positions;
            var maximumHeights = options.maximumHeights;
            var minimumHeights = options.minimumHeights;

            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(wallPositions)) {
                throw new Check.DeveloperError('options.positions is required.');
            }
            if (when.defined(maximumHeights) && maximumHeights.length !== wallPositions.length) {
                throw new Check.DeveloperError('options.positions and options.maximumHeights must have the same length.');
            }
            if (when.defined(minimumHeights) && minimumHeights.length !== wallPositions.length) {
                throw new Check.DeveloperError('options.positions and options.minimumHeights must have the same length.');
            }
            //>>includeEnd('debug');

            var granularity = when.defaultValue(options.granularity, _Math.CesiumMath.RADIANS_PER_DEGREE);
            var ellipsoid = when.defaultValue(options.ellipsoid, Cartesian2.Ellipsoid.WGS84);

            this._positions = wallPositions;
            this._minimumHeights = minimumHeights;
            this._maximumHeights = maximumHeights;
            this._granularity = granularity;
            this._ellipsoid = Cartesian2.Ellipsoid.clone(ellipsoid);
            this._workerName = 'createWallOutlineGeometry';

            var numComponents = 1 + wallPositions.length * Cartographic.Cartesian3.packedLength + 2;
            if (when.defined(minimumHeights)) {
                numComponents += minimumHeights.length;
            }
            if (when.defined(maximumHeights)) {
                numComponents += maximumHeights.length;
            }

            /**
             * The number of elements used to pack the object into an array.
             * @type {Number}
             */
            this.packedLength = numComponents + Cartesian2.Ellipsoid.packedLength + 1;
        }

        /**
         * Stores the provided instance into the provided array.
         *
         * @param {WallOutlineGeometry} value The value to pack.
         * @param {Number[]} array The array to pack into.
         * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
         *
         * @returns {Number[]} The array that was packed into
         */
        WallOutlineGeometry.pack = function(value, array, startingIndex) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(value)) {
                throw new Check.DeveloperError('value is required');
            }
            if (!when.defined(array)) {
                throw new Check.DeveloperError('array is required');
            }
            //>>includeEnd('debug');

            startingIndex = when.defaultValue(startingIndex, 0);

            var i;

            var positions = value._positions;
            var length = positions.length;
            array[startingIndex++] = length;

            for (i = 0; i < length; ++i, startingIndex += Cartographic.Cartesian3.packedLength) {
                Cartographic.Cartesian3.pack(positions[i], array, startingIndex);
            }

            var minimumHeights = value._minimumHeights;
            length = when.defined(minimumHeights) ? minimumHeights.length : 0;
            array[startingIndex++] = length;

            if (when.defined(minimumHeights)) {
                for (i = 0; i < length; ++i) {
                    array[startingIndex++] = minimumHeights[i];
                }
            }

            var maximumHeights = value._maximumHeights;
            length = when.defined(maximumHeights) ? maximumHeights.length : 0;
            array[startingIndex++] = length;

            if (when.defined(maximumHeights)) {
                for (i = 0; i < length; ++i) {
                    array[startingIndex++] = maximumHeights[i];
                }
            }

            Cartesian2.Ellipsoid.pack(value._ellipsoid, array, startingIndex);
            startingIndex += Cartesian2.Ellipsoid.packedLength;

            array[startingIndex]   = value._granularity;

            return array;
        };

        var scratchEllipsoid = Cartesian2.Ellipsoid.clone(Cartesian2.Ellipsoid.UNIT_SPHERE);
        var scratchOptions = {
            positions : undefined,
            minimumHeights : undefined,
            maximumHeights : undefined,
            ellipsoid : scratchEllipsoid,
            granularity : undefined
        };

        /**
         * Retrieves an instance from a packed array.
         *
         * @param {Number[]} array The packed array.
         * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
         * @param {WallOutlineGeometry} [result] The object into which to store the result.
         * @returns {WallOutlineGeometry} The modified result parameter or a new WallOutlineGeometry instance if one was not provided.
         */
        WallOutlineGeometry.unpack = function(array, startingIndex, result) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(array)) {
                throw new Check.DeveloperError('array is required');
            }
            //>>includeEnd('debug');

            startingIndex = when.defaultValue(startingIndex, 0);

            var i;

            var length = array[startingIndex++];
            var positions = new Array(length);

            for (i = 0; i < length; ++i, startingIndex += Cartographic.Cartesian3.packedLength) {
                positions[i] = Cartographic.Cartesian3.unpack(array, startingIndex);
            }

            length = array[startingIndex++];
            var minimumHeights;

            if (length > 0) {
                minimumHeights = new Array(length);
                for (i = 0; i < length; ++i) {
                    minimumHeights[i] = array[startingIndex++];
                }
            }

            length = array[startingIndex++];
            var maximumHeights;

            if (length > 0) {
                maximumHeights = new Array(length);
                for (i = 0; i < length; ++i) {
                    maximumHeights[i] = array[startingIndex++];
                }
            }

            var ellipsoid = Cartesian2.Ellipsoid.unpack(array, startingIndex, scratchEllipsoid);
            startingIndex += Cartesian2.Ellipsoid.packedLength;

            var granularity = array[startingIndex];

            if (!when.defined(result)) {
                scratchOptions.positions = positions;
                scratchOptions.minimumHeights = minimumHeights;
                scratchOptions.maximumHeights = maximumHeights;
                scratchOptions.granularity = granularity;
                return new WallOutlineGeometry(scratchOptions);
            }

            result._positions = positions;
            result._minimumHeights = minimumHeights;
            result._maximumHeights = maximumHeights;
            result._ellipsoid = Cartesian2.Ellipsoid.clone(ellipsoid, result._ellipsoid);
            result._granularity = granularity;

            return result;
        };

        /**
         * A description of a walloutline. A wall is defined by a series of points,
         * which extrude down to the ground. Optionally, they can extrude downwards to a specified height.
         *
         * @param {Object} options Object with the following properties:
         * @param {Cartesian3[]} options.positions An array of Cartesian objects, which are the points of the wall.
         * @param {Number} [options.maximumHeight] A constant that defines the maximum height of the
         *        wall at <code>positions</code>. If undefined, the height of each position in used.
         * @param {Number} [options.minimumHeight] A constant that defines the minimum height of the
         *        wall at <code>positions</code>. If undefined, the height at each position is 0.0.
         * @param {Ellipsoid} [options.ellipsoid=Ellipsoid.WGS84] The ellipsoid for coordinate manipulation
         * @returns {WallOutlineGeometry}
         *
         *
         * @example
         * // create a wall that spans from 10000 meters to 20000 meters
         * var wall = Cesium.WallOutlineGeometry.fromConstantHeights({
         *   positions : Cesium.Cartesian3.fromDegreesArray([
         *     19.0, 47.0,
         *     19.0, 48.0,
         *     20.0, 48.0,
         *     20.0, 47.0,
         *     19.0, 47.0,
         *   ]),
         *   minimumHeight : 20000.0,
         *   maximumHeight : 10000.0
         * });
         * var geometry = Cesium.WallOutlineGeometry.createGeometry(wall);
         *
         * @see WallOutlineGeometry#createGeometry
         */
        WallOutlineGeometry.fromConstantHeights = function(options) {
            options = when.defaultValue(options, when.defaultValue.EMPTY_OBJECT);
            var positions = options.positions;

            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(positions)) {
                throw new Check.DeveloperError('options.positions is required.');
            }
            //>>includeEnd('debug');

            var minHeights;
            var maxHeights;

            var min = options.minimumHeight;
            var max = options.maximumHeight;

            var doMin = when.defined(min);
            var doMax = when.defined(max);
            if (doMin || doMax) {
                var length = positions.length;
                minHeights = (doMin) ? new Array(length) : undefined;
                maxHeights = (doMax) ? new Array(length) : undefined;

                for (var i = 0; i < length; ++i) {
                    if (doMin) {
                        minHeights[i] = min;
                    }

                    if (doMax) {
                        maxHeights[i] = max;
                    }
                }
            }

            var newOptions = {
                positions : positions,
                maximumHeights : maxHeights,
                minimumHeights : minHeights,
                ellipsoid : options.ellipsoid
            };
            return new WallOutlineGeometry(newOptions);
        };

        /**
         * Computes the geometric representation of a wall outline, including its vertices, indices, and a bounding sphere.
         *
         * @param {WallOutlineGeometry} wallGeometry A description of the wall outline.
         * @returns {Geometry|undefined} The computed vertices and indices.
         */
        WallOutlineGeometry.createGeometry = function(wallGeometry) {
            var wallPositions = wallGeometry._positions;
            var minimumHeights = wallGeometry._minimumHeights;
            var maximumHeights = wallGeometry._maximumHeights;
            var granularity = wallGeometry._granularity;
            var ellipsoid = wallGeometry._ellipsoid;

            var pos = WallGeometryLibrary.WallGeometryLibrary.computePositions(ellipsoid, wallPositions, maximumHeights, minimumHeights, granularity, false);
            if (!when.defined(pos)) {
                return;
            }

            var bottomPositions = pos.bottomPositions;
            var topPositions = pos.topPositions;

            var length = topPositions.length;
            var size = length * 2;

            var positions = new Float64Array(size);
            var positionIndex = 0;

            // add lower and upper points one after the other, lower
            // points being even and upper points being odd
            length /= 3;
            var i;
            for (i = 0; i < length; ++i) {
                var i3 = i * 3;
                var topPosition = Cartographic.Cartesian3.fromArray(topPositions, i3, scratchCartesian3Position1);
                var bottomPosition = Cartographic.Cartesian3.fromArray(bottomPositions, i3, scratchCartesian3Position2);

                // insert the lower point
                positions[positionIndex++] = bottomPosition.x;
                positions[positionIndex++] = bottomPosition.y;
                positions[positionIndex++] = bottomPosition.z;

                // insert the upper point
                positions[positionIndex++] = topPosition.x;
                positions[positionIndex++] = topPosition.y;
                positions[positionIndex++] = topPosition.z;
            }

            var attributes = new GeometryAttributes.GeometryAttributes({
                position : new GeometryAttribute.GeometryAttribute({
                    componentDatatype : ComponentDatatype.ComponentDatatype.DOUBLE,
                    componentsPerAttribute : 3,
                    values : positions
                })
            });

            var numVertices = size / 3;
            size = 2 * numVertices - 4 + numVertices;
            var indices = IndexDatatype.IndexDatatype.createTypedArray(numVertices, size);

            var edgeIndex = 0;
            for (i = 0; i < numVertices - 2; i += 2) {
                var LL = i;
                var LR = i + 2;
                var pl = Cartographic.Cartesian3.fromArray(positions, LL * 3, scratchCartesian3Position1);
                var pr = Cartographic.Cartesian3.fromArray(positions, LR * 3, scratchCartesian3Position2);
                if (Cartographic.Cartesian3.equalsEpsilon(pl, pr, _Math.CesiumMath.EPSILON10)) {
                    continue;
                }
                var UL = i + 1;
                var UR = i + 3;

                indices[edgeIndex++] = UL;
                indices[edgeIndex++] = LL;
                indices[edgeIndex++] = UL;
                indices[edgeIndex++] = UR;
                indices[edgeIndex++] = LL;
                indices[edgeIndex++] = LR;
            }

            indices[edgeIndex++] = numVertices - 2;
            indices[edgeIndex++] = numVertices - 1;

            return new GeometryAttribute.Geometry({
                attributes : attributes,
                indices : indices,
                primitiveType : PrimitiveType.PrimitiveType.LINES,
                boundingSphere : new BoundingSphere.BoundingSphere.fromVertices(positions)
            });
        };

    function createWallOutlineGeometry(wallGeometry, offset) {
        if (when.defined(offset)) {
            wallGeometry = WallOutlineGeometry.unpack(wallGeometry, offset);
        }
        wallGeometry._ellipsoid = Cartesian2.Ellipsoid.clone(wallGeometry._ellipsoid);
        return WallOutlineGeometry.createGeometry(wallGeometry);
    }

    return createWallOutlineGeometry;

});

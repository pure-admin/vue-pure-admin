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
define(['./when-8d13db60', './Check-70bec281', './Math-61ede240', './Cartographic-fe4be337', './Cartesian2-85064f09', './BoundingSphere-775c5788', './Cartesian4-5af5bb24', './RuntimeError-ba10bc3e', './WebGLConstants-4c11ee5f', './ComponentDatatype-5862616f', './GeometryAttribute-06d31d45', './PrimitiveType-97893bc7', './FeatureDetection-7bd32c34', './Transforms-913163ed', './buildModuleUrl-9d43158d', './GeometryAttributes-aacecde6', './AttributeCompression-84a90a13', './GeometryPipeline-f6e7a4ed', './EncodedCartesian3-a569cba8', './IndexDatatype-9435b55f', './IntersectionTests-397d9494', './Plane-8390418f', './GeometryOffsetAttribute-ca302482', './GeometryInstance-93a01b5d', './arrayRemoveDuplicates-f0b089b1', './EllipsoidTangentPlane-605dc181', './ArcType-66bc286a', './EllipsoidRhumbLine-f161e674', './earcut-2.2.1-b404d9e6', './PolygonPipeline-62047934', './PolygonGeometryLibrary-759746dd'], function (when, Check, _Math, Cartographic, Cartesian2, BoundingSphere, Cartesian4, RuntimeError, WebGLConstants, ComponentDatatype, GeometryAttribute, PrimitiveType, FeatureDetection, Transforms, buildModuleUrl, GeometryAttributes, AttributeCompression, GeometryPipeline, EncodedCartesian3, IndexDatatype, IntersectionTests, Plane, GeometryOffsetAttribute, GeometryInstance, arrayRemoveDuplicates, EllipsoidTangentPlane, ArcType, EllipsoidRhumbLine, earcut2_2_1, PolygonPipeline, PolygonGeometryLibrary) { 'use strict';

    var createGeometryFromPositionsPositions = [];
        var createGeometryFromPositionsSubdivided = [];

        function createGeometryFromPositions(ellipsoid, positions, minDistance, perPositionHeight, arcType) {
            var tangentPlane = EllipsoidTangentPlane.EllipsoidTangentPlane.fromPoints(positions, ellipsoid);
            var positions2D = tangentPlane.projectPointsOntoPlane(positions, createGeometryFromPositionsPositions);

            var originalWindingOrder = PolygonPipeline.PolygonPipeline.computeWindingOrder2D(positions2D);
            if (originalWindingOrder === PolygonPipeline.WindingOrder.CLOCKWISE) {
                positions2D.reverse();
                positions = positions.slice().reverse();
            }

            var subdividedPositions;
            var i;

            var length = positions.length;
            var index = 0;

            if (!perPositionHeight) {
                var numVertices = 0;
                if (arcType === ArcType.ArcType.GEODESIC) {
                    for (i = 0; i < length; i++) {
                        numVertices += PolygonGeometryLibrary.PolygonGeometryLibrary.subdivideLineCount(positions[i], positions[(i + 1) % length], minDistance);
                    }
                } else if (arcType === ArcType.ArcType.RHUMB) {
                    for (i = 0; i < length; i++) {
                        numVertices += PolygonGeometryLibrary.PolygonGeometryLibrary.subdivideRhumbLineCount(ellipsoid, positions[i], positions[(i + 1) % length], minDistance);
                    }
                }
                subdividedPositions = new Float64Array(numVertices * 3);
                for (i = 0; i < length; i++) {
                    var tempPositions;
                    if (arcType === ArcType.ArcType.GEODESIC) {
                        tempPositions = PolygonGeometryLibrary.PolygonGeometryLibrary.subdivideLine(positions[i], positions[(i + 1) % length], minDistance, createGeometryFromPositionsSubdivided);
                    } else if (arcType === ArcType.ArcType.RHUMB) {
                        tempPositions = PolygonGeometryLibrary.PolygonGeometryLibrary.subdivideRhumbLine(ellipsoid, positions[i], positions[(i + 1) % length], minDistance, createGeometryFromPositionsSubdivided);
                    }
                    var tempPositionsLength = tempPositions.length;
                    for (var j = 0; j < tempPositionsLength; ++j) {
                        subdividedPositions[index++] = tempPositions[j];
                    }
                }
            } else {
                subdividedPositions = new Float64Array(length * 2 * 3);
                for (i = 0; i < length; i++) {
                    var p0 = positions[i];
                    var p1 = positions[(i + 1) % length];
                    subdividedPositions[index++] = p0.x;
                    subdividedPositions[index++] = p0.y;
                    subdividedPositions[index++] = p0.z;
                    subdividedPositions[index++] = p1.x;
                    subdividedPositions[index++] = p1.y;
                    subdividedPositions[index++] = p1.z;
                }
            }

            length = subdividedPositions.length / 3;
            var indicesSize = length * 2;
            var indices = IndexDatatype.IndexDatatype.createTypedArray(length, indicesSize);
            index = 0;
            for (i = 0; i < length - 1; i++) {
                indices[index++] = i;
                indices[index++] = i + 1;
            }
            indices[index++] = length - 1;
            indices[index++] = 0;

            return new GeometryInstance.GeometryInstance({
                geometry : new GeometryAttribute.Geometry({
                    attributes : new GeometryAttributes.GeometryAttributes({
                        position : new GeometryAttribute.GeometryAttribute({
                            componentDatatype : ComponentDatatype.ComponentDatatype.DOUBLE,
                            componentsPerAttribute : 3,
                            values : subdividedPositions
                        })
                    }),
                    indices : indices,
                    primitiveType : PrimitiveType.PrimitiveType.LINES
                })
            });
        }

        function createGeometryFromPositionsExtruded(ellipsoid, positions, minDistance, perPositionHeight, arcType) {
            var tangentPlane = EllipsoidTangentPlane.EllipsoidTangentPlane.fromPoints(positions, ellipsoid);
            var positions2D = tangentPlane.projectPointsOntoPlane(positions, createGeometryFromPositionsPositions);

            var originalWindingOrder = PolygonPipeline.PolygonPipeline.computeWindingOrder2D(positions2D);
            if (originalWindingOrder === PolygonPipeline.WindingOrder.CLOCKWISE) {
                positions2D.reverse();
                positions = positions.slice().reverse();
            }

            var subdividedPositions;
            var i;

            var length = positions.length;
            var corners = new Array(length);
            var index = 0;

            if (!perPositionHeight) {
                var numVertices = 0;
                if (arcType === ArcType.ArcType.GEODESIC) {
                    for (i = 0; i < length; i++) {
                        numVertices += PolygonGeometryLibrary.PolygonGeometryLibrary.subdivideLineCount(positions[i], positions[(i + 1) % length], minDistance);
                    }
                } else if (arcType === ArcType.ArcType.RHUMB) {
                    for (i = 0; i < length; i++) {
                        numVertices += PolygonGeometryLibrary.PolygonGeometryLibrary.subdivideRhumbLineCount(ellipsoid, positions[i], positions[(i + 1) % length], minDistance);
                    }
                }

                subdividedPositions = new Float64Array(numVertices * 3 * 2);
                for (i = 0; i < length; ++i) {
                    corners[i] = index / 3;
                    var tempPositions;
                    if (arcType === ArcType.ArcType.GEODESIC) {
                        tempPositions = PolygonGeometryLibrary.PolygonGeometryLibrary.subdivideLine(positions[i], positions[(i + 1) % length], minDistance, createGeometryFromPositionsSubdivided);
                    } else if (arcType === ArcType.ArcType.RHUMB) {
                        tempPositions = PolygonGeometryLibrary.PolygonGeometryLibrary.subdivideRhumbLine(ellipsoid, positions[i], positions[(i + 1) % length], minDistance, createGeometryFromPositionsSubdivided);
                    }
                    var tempPositionsLength = tempPositions.length;
                    for (var j = 0; j < tempPositionsLength; ++j) {
                        subdividedPositions[index++] = tempPositions[j];
                    }
                }
            } else {
                subdividedPositions = new Float64Array(length * 2 * 3 * 2);
                for (i = 0; i < length; ++i) {
                    corners[i] = index / 3;
                    var p0 = positions[i];
                    var p1 = positions[(i + 1) % length];

                    subdividedPositions[index++] = p0.x;
                    subdividedPositions[index++] = p0.y;
                    subdividedPositions[index++] = p0.z;
                    subdividedPositions[index++] = p1.x;
                    subdividedPositions[index++] = p1.y;
                    subdividedPositions[index++] = p1.z;
                }
            }

            length = subdividedPositions.length / (3 * 2);
            var cornersLength = corners.length;

            var indicesSize = ((length * 2) + cornersLength) * 2;
            var indices = IndexDatatype.IndexDatatype.createTypedArray(length, indicesSize);

            index = 0;
            for (i = 0; i < length; ++i) {
                indices[index++] = i;
                indices[index++] = (i + 1) % length;
                indices[index++] = i + length;
                indices[index++] = ((i + 1) % length) + length;
            }

            for (i = 0; i < cornersLength; i++) {
                var corner = corners[i];
                indices[index++] = corner;
                indices[index++] = corner + length;
            }

            return new GeometryInstance.GeometryInstance({
                geometry : new GeometryAttribute.Geometry({
                    attributes : new GeometryAttributes.GeometryAttributes({
                        position : new GeometryAttribute.GeometryAttribute({
                            componentDatatype : ComponentDatatype.ComponentDatatype.DOUBLE,
                            componentsPerAttribute : 3,
                            values : subdividedPositions
                        })
                    }),
                    indices : indices,
                    primitiveType : PrimitiveType.PrimitiveType.LINES
                })
            });
        }

        /**
         * A description of the outline of a polygon on the ellipsoid. The polygon is defined by a polygon hierarchy.
         *
         * @alias PolygonOutlineGeometry
         * @constructor
         *
         * @param {Object} options Object with the following properties:
         * @param {PolygonHierarchy} options.polygonHierarchy A polygon hierarchy that can include holes.
         * @param {Number} [options.height=0.0] The distance in meters between the polygon and the ellipsoid surface.
         * @param {Number} [options.extrudedHeight] The distance in meters between the polygon's extruded face and the ellipsoid surface.
         * @param {VertexFormat} [options.vertexFormat=VertexFormat.DEFAULT] The vertex attributes to be computed.
         * @param {Ellipsoid} [options.ellipsoid=Ellipsoid.WGS84] The ellipsoid to be used as a reference.
         * @param {Number} [options.granularity=CesiumMath.RADIANS_PER_DEGREE] The distance, in radians, between each latitude and longitude. Determines the number of positions in the buffer.
         * @param {Boolean} [options.perPositionHeight=false] Use the height of options.positions for each position instead of using options.height to determine the height.
         * @param {ArcType} [options.arcType=ArcType.GEODESIC] The type of path the outline must follow. Valid options are {@link ArcType.GEODESIC} and {@link ArcType.RHUMB}.
         *
         * @see PolygonOutlineGeometry#createGeometry
         * @see PolygonOutlineGeometry#fromPositions
         *
         * @example
         * // 1. create a polygon outline from points
         * var polygon = new Cesium.PolygonOutlineGeometry({
         *   polygonHierarchy : new Cesium.PolygonHierarchy(
         *     Cesium.Cartesian3.fromDegreesArray([
         *       -72.0, 40.0,
         *       -70.0, 35.0,
         *       -75.0, 30.0,
         *       -70.0, 30.0,
         *       -68.0, 40.0
         *     ])
         *   )
         * });
         * var geometry = Cesium.PolygonOutlineGeometry.createGeometry(polygon);
         *
         * // 2. create a nested polygon with holes outline
         * var polygonWithHole = new Cesium.PolygonOutlineGeometry({
         *   polygonHierarchy : new Cesium.PolygonHierarchy(
         *     Cesium.Cartesian3.fromDegreesArray([
         *       -109.0, 30.0,
         *       -95.0, 30.0,
         *       -95.0, 40.0,
         *       -109.0, 40.0
         *     ]),
         *     [new Cesium.PolygonHierarchy(
         *       Cesium.Cartesian3.fromDegreesArray([
         *         -107.0, 31.0,
         *         -107.0, 39.0,
         *         -97.0, 39.0,
         *         -97.0, 31.0
         *       ]),
         *       [new Cesium.PolygonHierarchy(
         *         Cesium.Cartesian3.fromDegreesArray([
         *           -105.0, 33.0,
         *           -99.0, 33.0,
         *           -99.0, 37.0,
         *           -105.0, 37.0
         *         ]),
         *         [new Cesium.PolygonHierarchy(
         *           Cesium.Cartesian3.fromDegreesArray([
         *             -103.0, 34.0,
         *             -101.0, 34.0,
         *             -101.0, 36.0,
         *             -103.0, 36.0
         *           ])
         *         )]
         *       )]
         *     )]
         *   )
         * });
         * var geometry = Cesium.PolygonOutlineGeometry.createGeometry(polygonWithHole);
         *
         * // 3. create extruded polygon outline
         * var extrudedPolygon = new Cesium.PolygonOutlineGeometry({
         *   polygonHierarchy : new Cesium.PolygonHierarchy(
         *     Cesium.Cartesian3.fromDegreesArray([
         *       -72.0, 40.0,
         *       -70.0, 35.0,
         *       -75.0, 30.0,
         *       -70.0, 30.0,
         *       -68.0, 40.0
         *     ])
         *   ),
         *   extrudedHeight: 300000
         * });
         * var geometry = Cesium.PolygonOutlineGeometry.createGeometry(extrudedPolygon);
         */
        function PolygonOutlineGeometry(options) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('options', options);
            Check.Check.typeOf.object('options.polygonHierarchy', options.polygonHierarchy);

            if (options.perPositionHeight && when.defined(options.height)) {
                throw new Check.DeveloperError('Cannot use both options.perPositionHeight and options.height');
            }
            if (when.defined(options.arcType) && options.arcType !== ArcType.ArcType.GEODESIC && options.arcType !== ArcType.ArcType.RHUMB) {
                throw new Check.DeveloperError('Invalid arcType. Valid options are ArcType.GEODESIC and ArcType.RHUMB.');
            }
            //>>includeEnd('debug');

            var polygonHierarchy = options.polygonHierarchy;
            var ellipsoid = when.defaultValue(options.ellipsoid, Cartesian2.Ellipsoid.WGS84);
            var granularity = when.defaultValue(options.granularity, _Math.CesiumMath.RADIANS_PER_DEGREE);
            var perPositionHeight = when.defaultValue(options.perPositionHeight, false);
            var perPositionHeightExtrude = perPositionHeight && when.defined(options.extrudedHeight);
            var arcType = when.defaultValue(options.arcType, ArcType.ArcType.GEODESIC);

            var height = when.defaultValue(options.height, 0.0);
            var extrudedHeight = when.defaultValue(options.extrudedHeight, height);

            if (!perPositionHeightExtrude) {
                var h = Math.max(height, extrudedHeight);
                extrudedHeight = Math.min(height, extrudedHeight);
                height = h;
            }

            this._ellipsoid = Cartesian2.Ellipsoid.clone(ellipsoid);
            this._granularity = granularity;
            this._height = height;
            this._extrudedHeight = extrudedHeight;
            this._arcType = arcType;
            this._polygonHierarchy = polygonHierarchy;
            this._perPositionHeight = perPositionHeight;
            this._perPositionHeightExtrude = perPositionHeightExtrude;
            this._offsetAttribute = options.offsetAttribute;
            this._workerName = 'createPolygonOutlineGeometry';

            /**
             * The number of elements used to pack the object into an array.
             * @type {Number}
             */
            this.packedLength = PolygonGeometryLibrary.PolygonGeometryLibrary.computeHierarchyPackedLength(polygonHierarchy) + Cartesian2.Ellipsoid.packedLength + 8;
        }

        /**
         * Stores the provided instance into the provided array.
         *
         * @param {PolygonOutlineGeometry} value The value to pack.
         * @param {Number[]} array The array to pack into.
         * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
         *
         * @returns {Number[]} The array that was packed into
         */
        PolygonOutlineGeometry.pack = function(value, array, startingIndex) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('value', value);
            Check.Check.defined('array', array);
            //>>includeEnd('debug');

            startingIndex = when.defaultValue(startingIndex, 0);

            startingIndex = PolygonGeometryLibrary.PolygonGeometryLibrary.packPolygonHierarchy(value._polygonHierarchy, array, startingIndex);

            Cartesian2.Ellipsoid.pack(value._ellipsoid, array, startingIndex);
            startingIndex += Cartesian2.Ellipsoid.packedLength;

            array[startingIndex++] = value._height;
            array[startingIndex++] = value._extrudedHeight;
            array[startingIndex++] = value._granularity;
            array[startingIndex++] = value._perPositionHeightExtrude ? 1.0 : 0.0;
            array[startingIndex++] = value._perPositionHeight ? 1.0 : 0.0;
            array[startingIndex++] = value._arcType;
            array[startingIndex++] = when.defaultValue(value._offsetAttribute, -1);
            array[startingIndex] = value.packedLength;

            return array;
        };

        var scratchEllipsoid = Cartesian2.Ellipsoid.clone(Cartesian2.Ellipsoid.UNIT_SPHERE);
        var dummyOptions = {
            polygonHierarchy : {}
        };

        /**
         * Retrieves an instance from a packed array.
         *
         * @param {Number[]} array The packed array.
         * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
         * @param {PolygonOutlineGeometry} [result] The object into which to store the result.
         * @returns {PolygonOutlineGeometry} The modified result parameter or a new PolygonOutlineGeometry instance if one was not provided.
         */
        PolygonOutlineGeometry.unpack = function(array, startingIndex, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('array', array);
            //>>includeEnd('debug');

            startingIndex = when.defaultValue(startingIndex, 0);

            var polygonHierarchy = PolygonGeometryLibrary.PolygonGeometryLibrary.unpackPolygonHierarchy(array, startingIndex);
            startingIndex = polygonHierarchy.startingIndex;
            delete polygonHierarchy.startingIndex;

            var ellipsoid = Cartesian2.Ellipsoid.unpack(array, startingIndex, scratchEllipsoid);
            startingIndex += Cartesian2.Ellipsoid.packedLength;

            var height = array[startingIndex++];
            var extrudedHeight = array[startingIndex++];
            var granularity = array[startingIndex++];
            var perPositionHeightExtrude = array[startingIndex++] === 1.0;
            var perPositionHeight = array[startingIndex++] === 1.0;
            var arcType = array[startingIndex++];
            var offsetAttribute = array[startingIndex++];
            var packedLength = array[startingIndex];

            if (!when.defined(result)) {
                result = new PolygonOutlineGeometry(dummyOptions);
            }

            result._polygonHierarchy = polygonHierarchy;
            result._ellipsoid = Cartesian2.Ellipsoid.clone(ellipsoid, result._ellipsoid);
            result._height = height;
            result._extrudedHeight = extrudedHeight;
            result._granularity = granularity;
            result._perPositionHeight = perPositionHeight;
            result._perPositionHeightExtrude = perPositionHeightExtrude;
            result._arcType = arcType;
            result._offsetAttribute = offsetAttribute === -1 ? undefined : offsetAttribute;
            result.packedLength = packedLength;

            return result;
        };

        /**
         * A description of a polygon outline from an array of positions.
         *
         * @param {Object} options Object with the following properties:
         * @param {Cartesian3[]} options.positions An array of positions that defined the corner points of the polygon.
         * @param {Number} [options.height=0.0] The height of the polygon.
         * @param {Number} [options.extrudedHeight] The height of the polygon extrusion.
         * @param {Ellipsoid} [options.ellipsoid=Ellipsoid.WGS84] The ellipsoid to be used as a reference.
         * @param {Number} [options.granularity=CesiumMath.RADIANS_PER_DEGREE] The distance, in radians, between each latitude and longitude. Determines the number of positions in the buffer.
         * @param {Boolean} [options.perPositionHeight=false] Use the height of options.positions for each position instead of using options.height to determine the height.
         * @param {ArcType} [options.arcType=ArcType.GEODESIC] The type of path the outline must follow. Valid options are {@link LinkType.GEODESIC} and {@link ArcType.RHUMB}.
         * @returns {PolygonOutlineGeometry}
         *
         *
         * @example
         * // create a polygon from points
         * var polygon = Cesium.PolygonOutlineGeometry.fromPositions({
         *   positions : Cesium.Cartesian3.fromDegreesArray([
         *     -72.0, 40.0,
         *     -70.0, 35.0,
         *     -75.0, 30.0,
         *     -70.0, 30.0,
         *     -68.0, 40.0
         *   ])
         * });
         * var geometry = Cesium.PolygonOutlineGeometry.createGeometry(polygon);
         *
         * @see PolygonOutlineGeometry#createGeometry
         */
        PolygonOutlineGeometry.fromPositions = function(options) {
            options = when.defaultValue(options, when.defaultValue.EMPTY_OBJECT);

            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('options.positions', options.positions);
            //>>includeEnd('debug');

            var newOptions = {
                polygonHierarchy : {
                    positions : options.positions
                },
                height : options.height,
                extrudedHeight : options.extrudedHeight,
                ellipsoid : options.ellipsoid,
                granularity : options.granularity,
                perPositionHeight : options.perPositionHeight,
                arcType: options.arcType,
                offsetAttribute : options.offsetAttribute
            };
            return new PolygonOutlineGeometry(newOptions);
        };

        /**
         * Computes the geometric representation of a polygon outline, including its vertices, indices, and a bounding sphere.
         *
         * @param {PolygonOutlineGeometry} polygonGeometry A description of the polygon outline.
         * @returns {Geometry|undefined} The computed vertices and indices.
         */
        PolygonOutlineGeometry.createGeometry = function(polygonGeometry) {
            var ellipsoid = polygonGeometry._ellipsoid;
            var granularity = polygonGeometry._granularity;
            var polygonHierarchy = polygonGeometry._polygonHierarchy;
            var perPositionHeight = polygonGeometry._perPositionHeight;
            var arcType = polygonGeometry._arcType;

            var polygons = PolygonGeometryLibrary.PolygonGeometryLibrary.polygonOutlinesFromHierarchy(polygonHierarchy, !perPositionHeight, ellipsoid);

            if (polygons.length === 0) {
                return undefined;
            }

            var geometryInstance;
            var geometries = [];
            var minDistance = _Math.CesiumMath.chordLength(granularity, ellipsoid.maximumRadius);

            var height = polygonGeometry._height;
            var extrudedHeight = polygonGeometry._extrudedHeight;
            var extrude = polygonGeometry._perPositionHeightExtrude || !_Math.CesiumMath.equalsEpsilon(height, extrudedHeight, 0, _Math.CesiumMath.EPSILON2);
            var offsetValue;
            var i;
            if (extrude) {
                for (i = 0; i < polygons.length; i++) {
                    geometryInstance = createGeometryFromPositionsExtruded(ellipsoid, polygons[i], minDistance, perPositionHeight, arcType);
                    geometryInstance.geometry = PolygonGeometryLibrary.PolygonGeometryLibrary.scaleToGeodeticHeightExtruded(geometryInstance.geometry, height, extrudedHeight, ellipsoid, perPositionHeight);
                    if (when.defined(polygonGeometry._offsetAttribute)) {
                        var size = geometryInstance.geometry.attributes.position.values.length / 3;
                        var offsetAttribute = new Uint8Array(size);
                        if (polygonGeometry._offsetAttribute === GeometryOffsetAttribute.GeometryOffsetAttribute.TOP) {
                            offsetAttribute = GeometryOffsetAttribute.arrayFill(offsetAttribute, 1, 0, size / 2);
                        } else {
                            offsetValue = polygonGeometry._offsetAttribute === GeometryOffsetAttribute.GeometryOffsetAttribute.NONE ? 0 : 1;
                            offsetAttribute = GeometryOffsetAttribute.arrayFill(offsetAttribute, offsetValue);
                        }

                        geometryInstance.geometry.attributes.applyOffset = new GeometryAttribute.GeometryAttribute({
                            componentDatatype : ComponentDatatype.ComponentDatatype.UNSIGNED_BYTE,
                            componentsPerAttribute : 1,
                            values : offsetAttribute
                        });
                    }
                    geometries.push(geometryInstance);
                }
            } else {
                for (i = 0; i < polygons.length; i++) {
                    geometryInstance = createGeometryFromPositions(ellipsoid, polygons[i], minDistance, perPositionHeight, arcType);
                    geometryInstance.geometry.attributes.position.values = PolygonPipeline.PolygonPipeline.scaleToGeodeticHeight(geometryInstance.geometry.attributes.position.values, height, ellipsoid, !perPositionHeight);

                    if (when.defined(polygonGeometry._offsetAttribute)) {
                        var length = geometryInstance.geometry.attributes.position.values.length;
                        var applyOffset = new Uint8Array(length / 3);
                        offsetValue = polygonGeometry._offsetAttribute === GeometryOffsetAttribute.GeometryOffsetAttribute.NONE ? 0 : 1;
                        GeometryOffsetAttribute.arrayFill(applyOffset, offsetValue);
                        geometryInstance.geometry.attributes.applyOffset = new GeometryAttribute.GeometryAttribute({
                            componentDatatype : ComponentDatatype.ComponentDatatype.UNSIGNED_BYTE,
                            componentsPerAttribute : 1,
                            values: applyOffset
                        });
                    }

                    geometries.push(geometryInstance);
                }
            }

            var geometry = GeometryPipeline.GeometryPipeline.combineInstances(geometries)[0];
            var boundingSphere = BoundingSphere.BoundingSphere.fromVertices(geometry.attributes.position.values);

            return new GeometryAttribute.Geometry({
                attributes : geometry.attributes,
                indices : geometry.indices,
                primitiveType : geometry.primitiveType,
                boundingSphere : boundingSphere,
                offsetAttribute : polygonGeometry._offsetAttribute
            });
        };

    function createPolygonOutlineGeometry(polygonGeometry, offset) {
        if (when.defined(offset)) {
            polygonGeometry = PolygonOutlineGeometry.unpack(polygonGeometry, offset);
        }
        polygonGeometry._ellipsoid = Cartesian2.Ellipsoid.clone(polygonGeometry._ellipsoid);
        return PolygonOutlineGeometry.createGeometry(polygonGeometry);
    }

    return createPolygonOutlineGeometry;

});

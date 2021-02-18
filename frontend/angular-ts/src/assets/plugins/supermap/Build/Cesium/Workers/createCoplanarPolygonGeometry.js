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
define(['./when-8d13db60', './Check-70bec281', './Math-61ede240', './Cartographic-fe4be337', './Cartesian2-85064f09', './BoundingSphere-775c5788', './Cartesian4-5af5bb24', './RuntimeError-ba10bc3e', './WebGLConstants-4c11ee5f', './ComponentDatatype-5862616f', './GeometryAttribute-06d31d45', './PrimitiveType-97893bc7', './FeatureDetection-7bd32c34', './Transforms-913163ed', './buildModuleUrl-9d43158d', './GeometryAttributes-aacecde6', './AttributeCompression-84a90a13', './GeometryPipeline-f6e7a4ed', './EncodedCartesian3-a569cba8', './IndexDatatype-9435b55f', './IntersectionTests-397d9494', './Plane-8390418f', './VertexFormat-fe4db402', './GeometryInstance-93a01b5d', './arrayRemoveDuplicates-f0b089b1', './BoundingRectangle-dc808c42', './EllipsoidTangentPlane-605dc181', './OrientedBoundingBox-64cb80e5', './CoplanarPolygonGeometryLibrary-c5eaec10', './ArcType-66bc286a', './EllipsoidRhumbLine-f161e674', './earcut-2.2.1-b404d9e6', './PolygonPipeline-62047934', './PolygonGeometryLibrary-759746dd'], function (when, Check, _Math, Cartographic, Cartesian2, BoundingSphere, Cartesian4, RuntimeError, WebGLConstants, ComponentDatatype, GeometryAttribute, PrimitiveType, FeatureDetection, Transforms, buildModuleUrl, GeometryAttributes, AttributeCompression, GeometryPipeline, EncodedCartesian3, IndexDatatype, IntersectionTests, Plane, VertexFormat, GeometryInstance, arrayRemoveDuplicates, BoundingRectangle, EllipsoidTangentPlane, OrientedBoundingBox, CoplanarPolygonGeometryLibrary, ArcType, EllipsoidRhumbLine, earcut2_2_1, PolygonPipeline, PolygonGeometryLibrary) { 'use strict';

    var scratchPosition = new Cartographic.Cartesian3();
        var scratchBR = new BoundingRectangle.BoundingRectangle();
        var stScratch = new Cartesian2.Cartesian2();
        var textureCoordinatesOrigin = new Cartesian2.Cartesian2();
        var scratchNormal = new Cartographic.Cartesian3();
        var scratchTangent = new Cartographic.Cartesian3();
        var scratchBitangent = new Cartographic.Cartesian3();
        var centerScratch = new Cartographic.Cartesian3();
        var axis1Scratch = new Cartographic.Cartesian3();
        var axis2Scratch = new Cartographic.Cartesian3();
        var quaternionScratch = new Transforms.Quaternion();
        var textureMatrixScratch = new BoundingSphere.Matrix3();
        var tangentRotationScratch = new BoundingSphere.Matrix3();
        var surfaceNormalScratch = new Cartographic.Cartesian3();

        function createGeometryFromPolygon(polygon, vertexFormat, boundingRectangle, stRotation, projectPointTo2D, normal, tangent, bitangent) {
            var positions = polygon.positions;
            var indices = PolygonPipeline.PolygonPipeline.triangulate(polygon.positions2D, polygon.holes);

            /* If polygon is completely unrenderable, just use the first three vertices */
            if (indices.length < 3) {
                indices = [0, 1, 2];
            }

            var newIndices = IndexDatatype.IndexDatatype.createTypedArray(positions.length, indices.length);
            newIndices.set(indices);

            var textureMatrix = textureMatrixScratch;
            if (stRotation !== 0.0) {
                var rotation = Transforms.Quaternion.fromAxisAngle(normal, stRotation, quaternionScratch);
                textureMatrix = BoundingSphere.Matrix3.fromQuaternion(rotation, textureMatrix);

                if (vertexFormat.tangent || vertexFormat.bitangent) {
                    rotation = Transforms.Quaternion.fromAxisAngle(normal, -stRotation, quaternionScratch);
                    var tangentRotation = BoundingSphere.Matrix3.fromQuaternion(rotation, tangentRotationScratch);

                    tangent = Cartographic.Cartesian3.normalize(BoundingSphere.Matrix3.multiplyByVector(tangentRotation, tangent, tangent), tangent);
                    if (vertexFormat.bitangent) {
                        bitangent = Cartographic.Cartesian3.normalize(Cartographic.Cartesian3.cross(normal, tangent, bitangent), bitangent);
                    }
                }
            } else {
                textureMatrix = BoundingSphere.Matrix3.clone(BoundingSphere.Matrix3.IDENTITY, textureMatrix);
            }

            var stOrigin = textureCoordinatesOrigin;
            if (vertexFormat.st) {
                stOrigin.x = boundingRectangle.x;
                stOrigin.y = boundingRectangle.y;
            }

            var length = positions.length;
            var size = length * 3;
            var flatPositions = new Float64Array(size);
            var normals = vertexFormat.normal ? new Float32Array(size) : undefined;
            var tangents = vertexFormat.tangent ? new Float32Array(size) : undefined;
            var bitangents = vertexFormat.bitangent ? new Float32Array(size) : undefined;
            var textureCoordinates = vertexFormat.st ? new Float32Array(length * 2) : undefined;

            var positionIndex = 0;
            var normalIndex = 0;
            var bitangentIndex = 0;
            var tangentIndex = 0;
            var stIndex = 0;

            for (var i = 0; i < length; i++) {
                var position = positions[i];
                flatPositions[positionIndex++] = position.x;
                flatPositions[positionIndex++] = position.y;
                flatPositions[positionIndex++] = position.z;

                if (vertexFormat.st) {
                    var p = BoundingSphere.Matrix3.multiplyByVector(textureMatrix, position, scratchPosition);
                    var st = projectPointTo2D(p, stScratch);
                    Cartesian2.Cartesian2.subtract(st, stOrigin, st);

                    var stx = _Math.CesiumMath.clamp(st.x / boundingRectangle.width, 0, 1);
                    var sty = _Math.CesiumMath.clamp(st.y / boundingRectangle.height, 0, 1);
                    textureCoordinates[stIndex++] = stx;
                    textureCoordinates[stIndex++] = sty;
                }

                if (vertexFormat.normal) {
                    normals[normalIndex++] = normal.x;
                    normals[normalIndex++] = normal.y;
                    normals[normalIndex++] = normal.z;
                }

                if (vertexFormat.tangent) {
                    tangents[tangentIndex++] = tangent.x;
                    tangents[tangentIndex++] = tangent.y;
                    tangents[tangentIndex++] = tangent.z;
                }

                if (vertexFormat.bitangent) {
                    bitangents[bitangentIndex++] = bitangent.x;
                    bitangents[bitangentIndex++] = bitangent.y;
                    bitangents[bitangentIndex++] = bitangent.z;
                }
            }

            var attributes = new GeometryAttributes.GeometryAttributes();

            if (vertexFormat.position) {
                attributes.position = new GeometryAttribute.GeometryAttribute({
                    componentDatatype : ComponentDatatype.ComponentDatatype.DOUBLE,
                    componentsPerAttribute : 3,
                    values : flatPositions
                });
            }

            if (vertexFormat.normal) {
                attributes.normal = new GeometryAttribute.GeometryAttribute({
                    componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
                    componentsPerAttribute : 3,
                    values : normals
                });
            }

            if (vertexFormat.tangent) {
                attributes.tangent = new GeometryAttribute.GeometryAttribute({
                    componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
                    componentsPerAttribute : 3,
                    values : tangents
                });
            }

            if (vertexFormat.bitangent) {
                attributes.bitangent = new GeometryAttribute.GeometryAttribute({
                    componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
                    componentsPerAttribute : 3,
                    values : bitangents
                });
            }

            if (vertexFormat.st) {
                attributes.st = new GeometryAttribute.GeometryAttribute({
                    componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
                    componentsPerAttribute : 2,
                    values : textureCoordinates
                });
            }

            return new GeometryAttribute.Geometry({
                attributes : attributes,
                indices : newIndices,
                primitiveType : PrimitiveType.PrimitiveType.TRIANGLES
            });
        }

        /**
         * A description of a polygon composed of arbitrary coplanar positions.
         *
         * @alias CoplanarPolygonGeometry
         * @constructor
         *
         * @param {Object} options Object with the following properties:
         * @param {PolygonHierarchy} options.polygonHierarchy A polygon hierarchy that can include holes.
         * @param {Number} [options.stRotation=0.0] The rotation of the texture coordinates, in radians. A positive rotation is counter-clockwise.
         * @param {VertexFormat} [options.vertexFormat=VertexFormat.DEFAULT] The vertex attributes to be computed.
         * @param {Ellipsoid} [options.ellipsoid=Ellipsoid.WGS84] The ellipsoid to be used as a reference.
         *
         * @example
         * var polygon = new Cesium.CoplanarPolygonGeometry({
         *   positions : Cesium.Cartesian3.fromDegreesArrayHeights([
         *      -90.0, 30.0, 0.0,
         *      -90.0, 30.0, 1000.0,
         *      -80.0, 30.0, 1000.0,
         *      -80.0, 30.0, 0.0
         *   ])
         * });
         * var geometry = Cesium.CoplanarPolygonGeometry.createGeometry(polygon);
         *
         * @see CoplanarPolygonGeometry.createGeometry
         */
        function CoplanarPolygonGeometry(options) {
            options = when.defaultValue(options, when.defaultValue.EMPTY_OBJECT);
            var polygonHierarchy = options.polygonHierarchy;
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('options.polygonHierarchy', polygonHierarchy);
            //>>includeEnd('debug');

            var vertexFormat = when.defaultValue(options.vertexFormat, VertexFormat.VertexFormat.DEFAULT);
            this._vertexFormat = VertexFormat.VertexFormat.clone(vertexFormat);
            this._polygonHierarchy = polygonHierarchy;
            this._stRotation = when.defaultValue(options.stRotation, 0.0);
            this._ellipsoid = Cartesian2.Ellipsoid.clone(when.defaultValue(options.ellipsoid, Cartesian2.Ellipsoid.WGS84));
            this._workerName = 'createCoplanarPolygonGeometry';

            /**
             * The number of elements used to pack the object into an array.
             * @type {Number}
             */
            this.packedLength = PolygonGeometryLibrary.PolygonGeometryLibrary.computeHierarchyPackedLength(polygonHierarchy) + VertexFormat.VertexFormat.packedLength + Cartesian2.Ellipsoid.packedLength + 2;
        }

        /**
         * A description of a coplanar polygon from an array of positions.
         *
         * @param {Object} options Object with the following properties:
         * @param {Cartesian3[]} options.positions An array of positions that defined the corner points of the polygon.
         * @param {VertexFormat} [options.vertexFormat=VertexFormat.DEFAULT] The vertex attributes to be computed.
         * @param {Number} [options.stRotation=0.0] The rotation of the texture coordinates, in radians. A positive rotation is counter-clockwise.
         * @param {Ellipsoid} [options.ellipsoid=Ellipsoid.WGS84] The ellipsoid to be used as a reference.
         * @returns {CoplanarPolygonGeometry}
         *
         * @example
         * // create a polygon from points
         * var polygon = Cesium.CoplanarPolygonGeometry.fromPositions({
         *   positions : Cesium.Cartesian3.fromDegreesArray([
         *     -72.0, 40.0,
         *     -70.0, 35.0,
         *     -75.0, 30.0,
         *     -70.0, 30.0,
         *     -68.0, 40.0
         *   ])
         * });
         * var geometry = Cesium.PolygonGeometry.createGeometry(polygon);
         *
         * @see PolygonGeometry#createGeometry
         */
        CoplanarPolygonGeometry.fromPositions = function(options) {
            options = when.defaultValue(options, when.defaultValue.EMPTY_OBJECT);

            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('options.positions', options.positions);
            //>>includeEnd('debug');

            var newOptions = {
                polygonHierarchy : {
                    positions : options.positions
                },
                vertexFormat : options.vertexFormat,
                stRotation : options.stRotation,
                ellipsoid : options.ellipsoid
            };
            return new CoplanarPolygonGeometry(newOptions);
        };

        /**
         * Stores the provided instance into the provided array.
         *
         * @param {CoplanarPolygonGeometry} value The value to pack.
         * @param {Number[]} array The array to pack into.
         * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
         *
         * @returns {Number[]} The array that was packed into
         */
        CoplanarPolygonGeometry.pack = function(value, array, startingIndex) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('value', value);
            Check.Check.defined('array', array);
            //>>includeEnd('debug');

            startingIndex = when.defaultValue(startingIndex, 0);

            startingIndex = PolygonGeometryLibrary.PolygonGeometryLibrary.packPolygonHierarchy(value._polygonHierarchy, array, startingIndex);

            Cartesian2.Ellipsoid.pack(value._ellipsoid, array, startingIndex);
            startingIndex += Cartesian2.Ellipsoid.packedLength;

            VertexFormat.VertexFormat.pack(value._vertexFormat, array, startingIndex);
            startingIndex += VertexFormat.VertexFormat.packedLength;

            array[startingIndex++] = value._stRotation;
            array[startingIndex] = value.packedLength;

            return array;
        };

        var scratchEllipsoid = Cartesian2.Ellipsoid.clone(Cartesian2.Ellipsoid.UNIT_SPHERE);
        var scratchVertexFormat = new VertexFormat.VertexFormat();
        var scratchOptions = {
            polygonHierarchy : {}
        };
        /**
         * Retrieves an instance from a packed array.
         *
         * @param {Number[]} array The packed array.
         * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
         * @param {CoplanarPolygonGeometry} [result] The object into which to store the result.
         * @returns {CoplanarPolygonGeometry} The modified result parameter or a new CoplanarPolygonGeometry instance if one was not provided.
         */
        CoplanarPolygonGeometry.unpack = function(array, startingIndex, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('array', array);
            //>>includeEnd('debug');

            startingIndex = when.defaultValue(startingIndex, 0);

            var polygonHierarchy = PolygonGeometryLibrary.PolygonGeometryLibrary.unpackPolygonHierarchy(array, startingIndex);
            startingIndex = polygonHierarchy.startingIndex;
            delete polygonHierarchy.startingIndex;

            var ellipsoid = Cartesian2.Ellipsoid.unpack(array, startingIndex, scratchEllipsoid);
            startingIndex += Cartesian2.Ellipsoid.packedLength;

            var vertexFormat = VertexFormat.VertexFormat.unpack(array, startingIndex, scratchVertexFormat);
            startingIndex += VertexFormat.VertexFormat.packedLength;

            var stRotation = array[startingIndex++];
            var packedLength = array[startingIndex];

            if (!when.defined(result)) {
                result = new CoplanarPolygonGeometry(scratchOptions);
            }

            result._polygonHierarchy = polygonHierarchy;
            result._ellipsoid = Cartesian2.Ellipsoid.clone(ellipsoid, result._ellipsoid);
            result._vertexFormat = VertexFormat.VertexFormat.clone(vertexFormat, result._vertexFormat);
            result._stRotation = stRotation;
            result.packedLength = packedLength;
            return result;
        };

        /**
         * Computes the geometric representation of an arbitrary coplanar polygon, including its vertices, indices, and a bounding sphere.
         *
         * @param {CoplanarPolygonGeometry} polygonGeometry A description of the polygon.
         * @returns {Geometry|undefined} The computed vertices and indices.
         */
        CoplanarPolygonGeometry.createGeometry = function(polygonGeometry) {
            var vertexFormat = polygonGeometry._vertexFormat;
            var polygonHierarchy = polygonGeometry._polygonHierarchy;
            var stRotation = polygonGeometry._stRotation;

            var outerPositions = polygonHierarchy.positions;
            outerPositions = arrayRemoveDuplicates.arrayRemoveDuplicates(outerPositions, Cartographic.Cartesian3.equalsEpsilon, true);
            if (outerPositions.length < 3) {
                return;
            }

            var normal = scratchNormal;
            var tangent = scratchTangent;
            var bitangent = scratchBitangent;
            var axis1 = axis1Scratch;
            var axis2 = axis2Scratch;

            var validGeometry = CoplanarPolygonGeometryLibrary.CoplanarPolygonGeometryLibrary.computeProjectTo2DArguments(outerPositions, centerScratch, axis1, axis2);
            if (!validGeometry) {
                return undefined;
            }

            normal = Cartographic.Cartesian3.cross(axis1, axis2, normal);
            normal = Cartographic.Cartesian3.normalize(normal, normal);

            if (!Cartographic.Cartesian3.equalsEpsilon(centerScratch, Cartographic.Cartesian3.ZERO, _Math.CesiumMath.EPSILON6)) {
                var surfaceNormal = polygonGeometry._ellipsoid.geodeticSurfaceNormal(centerScratch, surfaceNormalScratch);
                if (Cartographic.Cartesian3.dot(normal, surfaceNormal) < 0) {
                    normal = Cartographic.Cartesian3.negate(normal, normal);
                    axis1 = Cartographic.Cartesian3.negate(axis1, axis1);
                }
            }

            var projectPoints = CoplanarPolygonGeometryLibrary.CoplanarPolygonGeometryLibrary.createProjectPointsTo2DFunction(centerScratch, axis1, axis2);
            var projectPoint = CoplanarPolygonGeometryLibrary.CoplanarPolygonGeometryLibrary.createProjectPointTo2DFunction(centerScratch, axis1, axis2);

            if (vertexFormat.tangent) {
                tangent = Cartographic.Cartesian3.clone(axis1, tangent);
            }
            if (vertexFormat.bitangent) {
                bitangent = Cartographic.Cartesian3.clone(axis2, bitangent);
            }

            var results = PolygonGeometryLibrary.PolygonGeometryLibrary.polygonsFromHierarchy(polygonHierarchy, projectPoints, false);
            var hierarchy = results.hierarchy;
            var polygons = results.polygons;

            if (hierarchy.length === 0) {
                return;
            }
            outerPositions = hierarchy[0].outerRing;

            var boundingSphere = BoundingSphere.BoundingSphere.fromPoints(outerPositions);
            var boundingRectangle = PolygonGeometryLibrary.PolygonGeometryLibrary.computeBoundingRectangle(normal, projectPoint, outerPositions, stRotation, scratchBR);

            var geometries = [];
            for (var i = 0; i < polygons.length; i++) {
                var geometryInstance = new GeometryInstance.GeometryInstance({
                    geometry : createGeometryFromPolygon(polygons[i], vertexFormat, boundingRectangle, stRotation, projectPoint, normal, tangent, bitangent)
                });

                geometries.push(geometryInstance);
            }

            var geometry = GeometryPipeline.GeometryPipeline.combineInstances(geometries)[0];
            geometry.attributes.position.values = new Float64Array(geometry.attributes.position.values);
            geometry.indices = IndexDatatype.IndexDatatype.createTypedArray(geometry.attributes.position.values.length / 3, geometry.indices);

            var attributes = geometry.attributes;
            if (!vertexFormat.position) {
                delete attributes.position;
            }
            return new GeometryAttribute.Geometry({
                attributes : attributes,
                indices : geometry.indices,
                primitiveType : geometry.primitiveType,
                boundingSphere : boundingSphere
            });
        };

    function createCoplanarPolygonGeometry(polygonGeometry, offset) {
        if (when.defined(offset)) {
            polygonGeometry = CoplanarPolygonGeometry.unpack(polygonGeometry, offset);
        }
        return CoplanarPolygonGeometry.createGeometry(polygonGeometry);
    }

    return createCoplanarPolygonGeometry;

});

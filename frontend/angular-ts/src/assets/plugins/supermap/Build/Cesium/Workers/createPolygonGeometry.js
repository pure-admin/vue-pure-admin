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
define(['./when-8d13db60', './Check-70bec281', './Math-61ede240', './Cartographic-fe4be337', './Cartesian2-85064f09', './BoundingSphere-775c5788', './Cartesian4-5af5bb24', './RuntimeError-ba10bc3e', './WebGLConstants-4c11ee5f', './ComponentDatatype-5862616f', './GeometryAttribute-06d31d45', './PrimitiveType-97893bc7', './FeatureDetection-7bd32c34', './Transforms-913163ed', './buildModuleUrl-9d43158d', './GeometryAttributes-aacecde6', './AttributeCompression-84a90a13', './GeometryPipeline-f6e7a4ed', './EncodedCartesian3-a569cba8', './IndexDatatype-9435b55f', './IntersectionTests-397d9494', './Plane-8390418f', './GeometryOffsetAttribute-ca302482', './VertexFormat-fe4db402', './GeometryInstance-93a01b5d', './arrayRemoveDuplicates-f0b089b1', './BoundingRectangle-dc808c42', './EllipsoidTangentPlane-605dc181', './ArcType-66bc286a', './EllipsoidRhumbLine-f161e674', './earcut-2.2.1-b404d9e6', './PolygonPipeline-62047934', './PolygonGeometryLibrary-759746dd', './EllipsoidGeodesic-84507801'], function (when, Check, _Math, Cartographic, Cartesian2, BoundingSphere, Cartesian4, RuntimeError, WebGLConstants, ComponentDatatype, GeometryAttribute, PrimitiveType, FeatureDetection, Transforms, buildModuleUrl, GeometryAttributes, AttributeCompression, GeometryPipeline, EncodedCartesian3, IndexDatatype, IntersectionTests, Plane, GeometryOffsetAttribute, VertexFormat, GeometryInstance, arrayRemoveDuplicates, BoundingRectangle, EllipsoidTangentPlane, ArcType, EllipsoidRhumbLine, earcut2_2_1, PolygonPipeline, PolygonGeometryLibrary, EllipsoidGeodesic) { 'use strict';

    var scratchCarto1 = new Cartographic.Cartographic();
        var scratchCarto2 = new Cartographic.Cartographic();
        function adjustPosHeightsForNormal(position, p1, p2, ellipsoid) {
            var carto1 = ellipsoid.cartesianToCartographic(position, scratchCarto1);
            var height = carto1.height;
            var p1Carto = ellipsoid.cartesianToCartographic(p1, scratchCarto2);
            p1Carto.height = height;
            ellipsoid.cartographicToCartesian(p1Carto, p1);

            var p2Carto = ellipsoid.cartesianToCartographic(p2, scratchCarto2);
            p2Carto.height = height - 100;
            ellipsoid.cartographicToCartesian(p2Carto, p2);
        }

        var scratchBoundingRectangle = new BoundingRectangle.BoundingRectangle();
        var scratchPosition = new Cartographic.Cartesian3();
        var scratchNormal = new Cartographic.Cartesian3();
        var scratchTangent = new Cartographic.Cartesian3();
        var scratchBitangent = new Cartographic.Cartesian3();
        var p1Scratch = new Cartographic.Cartesian3();
        var p2Scratch = new Cartographic.Cartesian3();
        var scratchPerPosNormal = new Cartographic.Cartesian3();
        var scratchPerPosTangent = new Cartographic.Cartesian3();
        var scratchPerPosBitangent = new Cartographic.Cartesian3();

        var appendTextureCoordinatesOrigin = new Cartesian2.Cartesian2();
        var appendTextureCoordinatesCartesian2 = new Cartesian2.Cartesian2();
        var appendTextureCoordinatesCartesian3 = new Cartographic.Cartesian3();
        var appendTextureCoordinatesQuaternion = new Transforms.Quaternion();
        var appendTextureCoordinatesMatrix3 = new BoundingSphere.Matrix3();
        var tangentMatrixScratch = new BoundingSphere.Matrix3();

        function computeAttributes(options) {
            var vertexFormat = options.vertexFormat;
            var geometry = options.geometry;
            var shadowVolume = options.shadowVolume;
            var flatPositions = geometry.attributes.position.values;
            var length = flatPositions.length;
            var wall = options.wall;
            var top = options.top || wall;
            var bottom = options.bottom || wall;
            if (vertexFormat.st || vertexFormat.normal || vertexFormat.tangent || vertexFormat.bitangent || shadowVolume) {
                // PERFORMANCE_IDEA: Compute before subdivision, then just interpolate during subdivision.
                // PERFORMANCE_IDEA: Compute with createGeometryFromPositions() for fast path when there's no holes.
                var boundingRectangle = options.boundingRectangle;
                var tangentPlane = options.tangentPlane;
                var ellipsoid = options.ellipsoid;
                var stRotation = options.stRotation;
                var perPositionHeight = options.perPositionHeight;

                var origin = appendTextureCoordinatesOrigin;
                origin.x = boundingRectangle.x;
                origin.y = boundingRectangle.y;

                var textureCoordinates = vertexFormat.st ? new Float32Array(2 * (length / 3)) : undefined;
                var normals;
                if (vertexFormat.normal) {
                    if (perPositionHeight && top && !wall) {
                        normals = geometry.attributes.normal.values;
                    } else {
                        normals = new Float32Array(length);
                    }
                }
                var tangents = vertexFormat.tangent ? new Float32Array(length) : undefined;
                var bitangents = vertexFormat.bitangent ? new Float32Array(length) : undefined;
                var extrudeNormals = shadowVolume ? new Float32Array(length) : undefined;

                var textureCoordIndex = 0;
                var attrIndex = 0;

                var normal = scratchNormal;
                var tangent = scratchTangent;
                var bitangent = scratchBitangent;
                var recomputeNormal = true;

                var textureMatrix = appendTextureCoordinatesMatrix3;
                var tangentRotationMatrix = tangentMatrixScratch;
                if (stRotation !== 0.0) {
                    var rotation = Transforms.Quaternion.fromAxisAngle(tangentPlane._plane.normal, stRotation, appendTextureCoordinatesQuaternion);
                    textureMatrix = BoundingSphere.Matrix3.fromQuaternion(rotation, textureMatrix);

                    rotation = Transforms.Quaternion.fromAxisAngle(tangentPlane._plane.normal, -stRotation, appendTextureCoordinatesQuaternion);
                    tangentRotationMatrix = BoundingSphere.Matrix3.fromQuaternion(rotation, tangentRotationMatrix);
                } else {
                    textureMatrix = BoundingSphere.Matrix3.clone(BoundingSphere.Matrix3.IDENTITY, textureMatrix);
                    tangentRotationMatrix = BoundingSphere.Matrix3.clone(BoundingSphere.Matrix3.IDENTITY, tangentRotationMatrix);
                }

                var bottomOffset = 0;
                var bottomOffset2 = 0;

                if (top && bottom) {
                    bottomOffset = length / 2;
                    bottomOffset2 = length / 3;

                    length /= 2;
                }

                for ( var i = 0; i < length; i += 3) {
                    var position = Cartographic.Cartesian3.fromArray(flatPositions, i, appendTextureCoordinatesCartesian3);

                    if (vertexFormat.st) {
                        var p = BoundingSphere.Matrix3.multiplyByVector(textureMatrix, position, scratchPosition);
                        p = ellipsoid.scaleToGeodeticSurface(p,p);
                        var st = tangentPlane.projectPointOntoPlane(p, appendTextureCoordinatesCartesian2);
                        Cartesian2.Cartesian2.subtract(st, origin, st);

                        var stx = _Math.CesiumMath.clamp(st.x / boundingRectangle.width, 0, 1);
                        var sty = _Math.CesiumMath.clamp(st.y / boundingRectangle.height, 0, 1);
                        if (bottom) {
                            textureCoordinates[textureCoordIndex + bottomOffset2] = stx;
                            textureCoordinates[textureCoordIndex + 1 + bottomOffset2] = sty;
                        }
                        if (top) {
                            textureCoordinates[textureCoordIndex] = stx;
                            textureCoordinates[textureCoordIndex + 1] = sty;
                        }

                        textureCoordIndex += 2;
                    }

                    if (vertexFormat.normal || vertexFormat.tangent || vertexFormat.bitangent || shadowVolume) {
                        var attrIndex1 = attrIndex + 1;
                        var attrIndex2 = attrIndex + 2;

                        if (wall) {
                            if (i + 3 < length) {
                                var p1 = Cartographic.Cartesian3.fromArray(flatPositions, i + 3, p1Scratch);

                                if (recomputeNormal) {
                                    var p2 = Cartographic.Cartesian3.fromArray(flatPositions, i + length, p2Scratch);
                                    if (perPositionHeight) {
                                        adjustPosHeightsForNormal(position, p1, p2, ellipsoid);
                                    }
                                    Cartographic.Cartesian3.subtract(p1, position, p1);
                                    Cartographic.Cartesian3.subtract(p2, position, p2);
                                    normal = Cartographic.Cartesian3.normalize(Cartographic.Cartesian3.cross(p2, p1, normal), normal);
                                    recomputeNormal = false;
                                }

                                if (Cartographic.Cartesian3.equalsEpsilon(p1, position, _Math.CesiumMath.EPSILON10)) { // if we've reached a corner
                                    recomputeNormal = true;
                                }
                            }

                            if (vertexFormat.tangent || vertexFormat.bitangent) {
                                bitangent = ellipsoid.geodeticSurfaceNormal(position, bitangent);
                                if (vertexFormat.tangent) {
                                    tangent = Cartographic.Cartesian3.normalize(Cartographic.Cartesian3.cross(bitangent, normal, tangent), tangent);
                                }
                            }
                        } else {
                            normal = ellipsoid.geodeticSurfaceNormal(position, normal);
                            if (vertexFormat.tangent || vertexFormat.bitangent) {
                                if (perPositionHeight) {
                                    scratchPerPosNormal = Cartographic.Cartesian3.fromArray(normals, attrIndex, scratchPerPosNormal);
                                    scratchPerPosTangent = Cartographic.Cartesian3.cross(Cartographic.Cartesian3.UNIT_Z, scratchPerPosNormal, scratchPerPosTangent);
                                    scratchPerPosTangent = Cartographic.Cartesian3.normalize(BoundingSphere.Matrix3.multiplyByVector(tangentRotationMatrix, scratchPerPosTangent, scratchPerPosTangent), scratchPerPosTangent);
                                    if (vertexFormat.bitangent) {
                                        scratchPerPosBitangent = Cartographic.Cartesian3.normalize(Cartographic.Cartesian3.cross(scratchPerPosNormal, scratchPerPosTangent, scratchPerPosBitangent), scratchPerPosBitangent);
                                    }
                                }

                                tangent = Cartographic.Cartesian3.cross(Cartographic.Cartesian3.UNIT_Z, normal, tangent);
                                tangent = Cartographic.Cartesian3.normalize(BoundingSphere.Matrix3.multiplyByVector(tangentRotationMatrix, tangent, tangent), tangent);
                                if (vertexFormat.bitangent) {
                                    bitangent = Cartographic.Cartesian3.normalize(Cartographic.Cartesian3.cross(normal, tangent, bitangent), bitangent);
                                }
                            }
                        }

                        if (vertexFormat.normal) {
                            if (options.wall) {
                                normals[attrIndex + bottomOffset] = normal.x;
                                normals[attrIndex1 + bottomOffset] = normal.y;
                                normals[attrIndex2 + bottomOffset] = normal.z;
                            } else if (bottom){
                                normals[attrIndex + bottomOffset] = -normal.x;
                                normals[attrIndex1 + bottomOffset] = -normal.y;
                                normals[attrIndex2 + bottomOffset] = -normal.z;
                            }

                            if ((top && !perPositionHeight) || wall) {
                                normals[attrIndex] = normal.x;
                                normals[attrIndex1] = normal.y;
                                normals[attrIndex2] = normal.z;
                            }
                        }

                        if (shadowVolume) {
                            if (wall) {
                                normal = ellipsoid.geodeticSurfaceNormal(position, normal);
                            }
                            extrudeNormals[attrIndex + bottomOffset] = -normal.x;
                            extrudeNormals[attrIndex1 + bottomOffset] = -normal.y;
                            extrudeNormals[attrIndex2 + bottomOffset] = -normal.z;
                        }

                        if (vertexFormat.tangent) {
                            if (options.wall) {
                                tangents[attrIndex + bottomOffset] = tangent.x;
                                tangents[attrIndex1 + bottomOffset] = tangent.y;
                                tangents[attrIndex2 + bottomOffset] = tangent.z;
                            } else if (bottom) {
                                tangents[attrIndex + bottomOffset] = -tangent.x;
                                tangents[attrIndex1 + bottomOffset] = -tangent.y;
                                tangents[attrIndex2 + bottomOffset] = -tangent.z;
                            }

                            if(top) {
                                if (perPositionHeight) {
                                    tangents[attrIndex] = scratchPerPosTangent.x;
                                    tangents[attrIndex1] = scratchPerPosTangent.y;
                                    tangents[attrIndex2] = scratchPerPosTangent.z;
                                } else {
                                    tangents[attrIndex] = tangent.x;
                                    tangents[attrIndex1] = tangent.y;
                                    tangents[attrIndex2] = tangent.z;
                                }
                            }
                        }

                        if (vertexFormat.bitangent) {
                            if (bottom) {
                                bitangents[attrIndex + bottomOffset] = bitangent.x;
                                bitangents[attrIndex1 + bottomOffset] = bitangent.y;
                                bitangents[attrIndex2 + bottomOffset] = bitangent.z;
                            }
                            if (top) {
                                if (perPositionHeight) {
                                    bitangents[attrIndex] = scratchPerPosBitangent.x;
                                    bitangents[attrIndex1] = scratchPerPosBitangent.y;
                                    bitangents[attrIndex2] = scratchPerPosBitangent.z;
                                } else {
                                    bitangents[attrIndex] = bitangent.x;
                                    bitangents[attrIndex1] = bitangent.y;
                                    bitangents[attrIndex2] = bitangent.z;
                                }
                            }
                        }
                        attrIndex += 3;
                    }
                }

                if (vertexFormat.st) {
                    geometry.attributes.st = new GeometryAttribute.GeometryAttribute({
                        componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
                        componentsPerAttribute : 2,
                        values : textureCoordinates
                    });
                }

                if (vertexFormat.normal) {
                    geometry.attributes.normal = new GeometryAttribute.GeometryAttribute({
                        componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
                        componentsPerAttribute : 3,
                        values : normals
                    });
                }

                if (vertexFormat.tangent) {
                    geometry.attributes.tangent = new GeometryAttribute.GeometryAttribute({
                        componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
                        componentsPerAttribute : 3,
                        values : tangents
                    });
                }

                if (vertexFormat.bitangent) {
                    geometry.attributes.bitangent = new GeometryAttribute.GeometryAttribute({
                        componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
                        componentsPerAttribute : 3,
                        values : bitangents
                    });
                }

                if (shadowVolume) {
                    geometry.attributes.extrudeDirection = new GeometryAttribute.GeometryAttribute({
                        componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
                        componentsPerAttribute : 3,
                        values : extrudeNormals
                    });
                }
            }

            if (options.extrude && when.defined(options.offsetAttribute)) {
                var size = flatPositions.length / 3;
                var offsetAttribute = new Uint8Array(size);

                if (options.offsetAttribute === GeometryOffsetAttribute.GeometryOffsetAttribute.TOP) {
                    if ((top && bottom) || wall) {
                        offsetAttribute = GeometryOffsetAttribute.arrayFill(offsetAttribute, 1, 0, size / 2);
                    } else if (top) {
                        offsetAttribute = GeometryOffsetAttribute.arrayFill(offsetAttribute, 1);
                    }
                } else {
                    var offsetValue = options.offsetAttribute === GeometryOffsetAttribute.GeometryOffsetAttribute.NONE ? 0 : 1;
                    offsetAttribute = GeometryOffsetAttribute.arrayFill(offsetAttribute, offsetValue);
                }

                geometry.attributes.applyOffset = new GeometryAttribute.GeometryAttribute({
                    componentDatatype : ComponentDatatype.ComponentDatatype.UNSIGNED_BYTE,
                    componentsPerAttribute : 1,
                    values : offsetAttribute
                });
            }

            return geometry;
        }

        var startCartographicScratch = new Cartographic.Cartographic();
        var endCartographicScratch = new Cartographic.Cartographic();
        var idlCross = {
            west : 0.0,
            east : 0.0
        };
        var ellipsoidGeodesic = new EllipsoidGeodesic.EllipsoidGeodesic();
        function computeRectangle(positions, ellipsoid, arcType, granularity, result) {
            result = when.defaultValue(result, new Cartesian2.Rectangle());
            if (!when.defined(positions) || positions.length < 3) {
                result.west = 0.0;
                result.north = 0.0;
                result.south = 0.0;
                result.east = 0.0;
                return result;
            }

            if (arcType === ArcType.ArcType.RHUMB) {
                return Cartesian2.Rectangle.fromCartesianArray(positions, ellipsoid, result);
            }

            if (!ellipsoidGeodesic.ellipsoid.equals(ellipsoid)) {
                ellipsoidGeodesic = new EllipsoidGeodesic.EllipsoidGeodesic(undefined, undefined, ellipsoid);
            }

            result.west = Number.POSITIVE_INFINITY;
            result.east = Number.NEGATIVE_INFINITY;
            result.south = Number.POSITIVE_INFINITY;
            result.north = Number.NEGATIVE_INFINITY;

            idlCross.west = Number.POSITIVE_INFINITY;
            idlCross.east = Number.NEGATIVE_INFINITY;

            var inverseChordLength = 1.0 / _Math.CesiumMath.chordLength(granularity, ellipsoid.maximumRadius);
            var positionsLength = positions.length;
            var endCartographic = ellipsoid.cartesianToCartographic(positions[0], endCartographicScratch);
            var startCartographic = startCartographicScratch;
            var swap;

            for (var i = 1; i < positionsLength; i++) {
                swap = startCartographic;
                startCartographic = endCartographic;
                endCartographic = ellipsoid.cartesianToCartographic(positions[i], swap);
                ellipsoidGeodesic.setEndPoints(startCartographic, endCartographic);
                interpolateAndGrowRectangle(ellipsoidGeodesic, inverseChordLength, result, idlCross);
            }

            swap = startCartographic;
            startCartographic = endCartographic;
            endCartographic = ellipsoid.cartesianToCartographic(positions[0], swap);
            ellipsoidGeodesic.setEndPoints(startCartographic, endCartographic);
            interpolateAndGrowRectangle(ellipsoidGeodesic, inverseChordLength, result, idlCross);

            if (result.east - result.west > idlCross.west - idlCross.east) {
                result.east = idlCross.east;
                result.west = idlCross.west;
            }

            return result;
        }

        var interpolatedCartographicScratch = new Cartographic.Cartographic();
        function interpolateAndGrowRectangle(ellipsoidGeodesic, inverseChordLength, result, idlCross) {
            var segmentLength = ellipsoidGeodesic.surfaceDistance;

            var numPoints = Math.ceil(segmentLength * inverseChordLength);
            var subsegmentDistance = numPoints > 0 ? segmentLength / (numPoints - 1) : Number.POSITIVE_INFINITY;
            var interpolationDistance = 0.0;

            for (var i = 0; i < numPoints; i++) {
                var interpolatedCartographic = ellipsoidGeodesic.interpolateUsingSurfaceDistance(interpolationDistance, interpolatedCartographicScratch);
                interpolationDistance += subsegmentDistance;
                var longitude = interpolatedCartographic.longitude;
                var latitude = interpolatedCartographic.latitude;

                result.west = Math.min(result.west, longitude);
                result.east = Math.max(result.east, longitude);
                result.south = Math.min(result.south, latitude);
                result.north = Math.max(result.north, latitude);

                idlCross.west = longitude > 0.0 ? Math.min(longitude, idlCross.west) : idlCross.west;
                idlCross.east = longitude < 0.0 ? Math.max(longitude, idlCross.east) : idlCross.east;
            }
        }

        var createGeometryFromPositionsExtrudedPositions = [];

        function createGeometryFromPositionsExtruded(ellipsoid, polygon, granularity, hierarchy, perPositionHeight, closeTop, closeBottom, vertexFormat, arcType, extrudeOutering) {
            var geos = {
                walls : []
            };
            var i;

            if (closeTop || closeBottom) {
                var topGeo = PolygonGeometryLibrary.PolygonGeometryLibrary.createGeometryFromPositions(ellipsoid, polygon, granularity, perPositionHeight, vertexFormat, arcType);

                var edgePoints = topGeo.attributes.position.values;
                var indices = topGeo.indices;
                var numPositions;
                var newIndices;

                if (closeTop && closeBottom) {
                    var topBottomPositions = edgePoints.concat(edgePoints);

                    numPositions = topBottomPositions.length / 3;

                    newIndices = IndexDatatype.IndexDatatype.createTypedArray(numPositions, indices.length * 2);
                    newIndices.set(indices);
                    var ilength = indices.length;

                    var length = numPositions / 2;

                    for (i = 0; i < ilength; i += 3) {
                        var i0 = newIndices[i] + length;
                        var i1 = newIndices[i + 1] + length;
                        var i2 = newIndices[i + 2] + length;

                        newIndices[i + ilength] = i2;
                        newIndices[i + 1 + ilength] = i1;
                        newIndices[i + 2 + ilength] = i0;
                    }

                    topGeo.attributes.position.values = topBottomPositions;
                    if (perPositionHeight && vertexFormat.normal) {
                        var normals = topGeo.attributes.normal.values;
                        topGeo.attributes.normal.values = new Float32Array(topBottomPositions.length);
                        topGeo.attributes.normal.values.set(normals);
                    }
                    topGeo.indices = newIndices;
                } else if (closeBottom) {
                    numPositions = edgePoints.length / 3;
                    newIndices = IndexDatatype.IndexDatatype.createTypedArray(numPositions, indices.length);

                    for (i = 0; i < indices.length; i += 3) {
                        newIndices[i] = indices[i + 2];
                        newIndices[i + 1] = indices[i + 1];
                        newIndices[i + 2] = indices[i];
                    }

                    topGeo.indices = newIndices;
                }

                geos.topAndBottom = new GeometryInstance.GeometryInstance({
                    geometry : topGeo
                });
            }

            var outerRing = hierarchy.outerRing;
            var tangentPlane = EllipsoidTangentPlane.EllipsoidTangentPlane.fromPoints(outerRing, ellipsoid);
            var positions2D = tangentPlane.projectPointsOntoPlane(outerRing, createGeometryFromPositionsExtrudedPositions);

            var windingOrder = PolygonPipeline.PolygonPipeline.computeWindingOrder2D(positions2D);
            if (windingOrder === PolygonPipeline.WindingOrder.CLOCKWISE) {
                outerRing = outerRing.slice().reverse();
            }

            var wallGeo;
            if(extrudeOutering) {
                wallGeo = PolygonGeometryLibrary.PolygonGeometryLibrary.computeWallGeometry(outerRing, ellipsoid, granularity, perPositionHeight, arcType);
                geos.walls.push(new GeometryInstance.GeometryInstance({
                    geometry : wallGeo
                }));
            }


            var holes = hierarchy.holes;
            for (i = 0; i < holes.length; i++) {
                var hole = holes[i];

                tangentPlane = EllipsoidTangentPlane.EllipsoidTangentPlane.fromPoints(hole, ellipsoid);
                positions2D = tangentPlane.projectPointsOntoPlane(hole, createGeometryFromPositionsExtrudedPositions);

                windingOrder = PolygonPipeline.PolygonPipeline.computeWindingOrder2D(positions2D);
                if (windingOrder === PolygonPipeline.WindingOrder.COUNTER_CLOCKWISE) {
                    hole = hole.slice().reverse();
                }

                wallGeo = PolygonGeometryLibrary.PolygonGeometryLibrary.computeWallGeometry(hole, ellipsoid, granularity, perPositionHeight, arcType);
                geos.walls.push(new GeometryInstance.GeometryInstance({
                    geometry : wallGeo
                }));
            }

            return geos;
        }

        /**
         * A description of a polygon on the ellipsoid. The polygon is defined by a polygon hierarchy. Polygon geometry can be rendered with both {@link Primitive} and {@link GroundPrimitive}.
         *
         * @alias PolygonGeometry
         * @constructor
         *
         * @param {Object} options Object with the following properties:
         * @param {PolygonHierarchy} options.polygonHierarchy A polygon hierarchy that can include holes.
         * @param {Number} [options.height=0.0] The distance in meters between the polygon and the ellipsoid surface.
         * @param {Number} [options.extrudedHeight] The distance in meters between the polygon's extruded face and the ellipsoid surface.
         * @param {VertexFormat} [options.vertexFormat=VertexFormat.DEFAULT] The vertex attributes to be computed.
         * @param {Number} [options.stRotation=0.0] The rotation of the texture coordinates, in radians. A positive rotation is counter-clockwise.
         * @param {Ellipsoid} [options.ellipsoid=Ellipsoid.WGS84] The ellipsoid to be used as a reference.
         * @param {Number} [options.granularity=CesiumMath.RADIANS_PER_DEGREE] The distance, in radians, between each latitude and longitude. Determines the number of positions in the buffer.
         * @param {Boolean} [options.perPositionHeight=false] Use the height of options.positions for each position instead of using options.height to determine the height.
         * @param {Boolean} [options.closeTop=true] When false, leaves off the top of an extruded polygon open.
         * @param {Boolean} [options.closeBottom=true] When false, leaves off the bottom of an extruded polygon open.
         * @param {ArcType} [options.arcType=ArcType.GEODESIC] The type of line the polygon edges must follow. Valid options are {@link ArcType.GEODESIC} and {@link ArcType.RHUMB}.
         *
         * @see PolygonGeometry#createGeometry
         * @see PolygonGeometry#fromPositions
         *
         * @demo {@link https://cesiumjs.org/Cesium/Apps/Sandcastle/index.html?src=Polygon.html|Cesium Sandcastle Polygon Demo}
         *
         * @example
         * // 1. create a polygon from points
         * var polygon = new Cesium.PolygonGeometry({
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
         * var geometry = Cesium.PolygonGeometry.createGeometry(polygon);
         *
         * // 2. create a nested polygon with holes
         * var polygonWithHole = new Cesium.PolygonGeometry({
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
         * var geometry = Cesium.PolygonGeometry.createGeometry(polygonWithHole);
         *
         * // 3. create extruded polygon
         * var extrudedPolygon = new Cesium.PolygonGeometry({
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
         * var geometry = Cesium.PolygonGeometry.createGeometry(extrudedPolygon);
         */
        function PolygonGeometry(options) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('options', options);
            Check.Check.typeOf.object('options.polygonHierarchy', options.polygonHierarchy);
            if (when.defined(options.perPositionHeight) && options.perPositionHeight && when.defined(options.height)) {
                throw new Check.DeveloperError('Cannot use both options.perPositionHeight and options.height');
            }
            if (when.defined(options.arcType) && options.arcType !== ArcType.ArcType.GEODESIC && options.arcType !== ArcType.ArcType.RHUMB) {
                throw new Check.DeveloperError('Invalid arcType. Valid options are ArcType.GEODESIC and ArcType.RHUMB.');
            }
            //>>includeEnd('debug');

            var polygonHierarchy = options.polygonHierarchy;
            var vertexFormat = when.defaultValue(options.vertexFormat, VertexFormat.VertexFormat.DEFAULT);
            var ellipsoid = when.defaultValue(options.ellipsoid, Cartesian2.Ellipsoid.WGS84);
            var granularity = when.defaultValue(options.granularity, _Math.CesiumMath.RADIANS_PER_DEGREE);
            var stRotation = when.defaultValue(options.stRotation, 0.0);
            var perPositionHeight = when.defaultValue(options.perPositionHeight, false);
            var perPositionHeightExtrude = perPositionHeight && when.defined(options.extrudedHeight);
            var height = when.defaultValue(options.height, 0.0);
            var extrudedHeight = when.defaultValue(options.extrudedHeight, height);

            if (!perPositionHeightExtrude) {
                var h = Math.max(height, extrudedHeight);
                extrudedHeight = Math.min(height, extrudedHeight);
                height = h;
            }

            this._vertexFormat = VertexFormat.VertexFormat.clone(vertexFormat);
            this._ellipsoid = Cartesian2.Ellipsoid.clone(ellipsoid);
            this._granularity = granularity;
            this._stRotation = stRotation;
            this._height = height;
            this._extrudedHeight = extrudedHeight;
            this._closeTop = when.defaultValue(options.closeTop, true);
            this._closeBottom = when.defaultValue(options.closeBottom, true);
            this._extrudeOutering  = when.defaultValue(options.extrudeOutering, true);
            this._polygonHierarchy = polygonHierarchy;
            this._perPositionHeight = perPositionHeight;
            this._perPositionHeightExtrude = perPositionHeightExtrude;
            this._shadowVolume = when.defaultValue(options.shadowVolume, false);
            this._workerName = 'createPolygonGeometry';
            this._offsetAttribute = options.offsetAttribute;
            this._arcType = when.defaultValue(options.arcType, ArcType.ArcType.GEODESIC);

            this._rectangle = undefined;
            this._textureCoordinateRotationPoints = undefined;

            /**
             * The number of elements used to pack the object into an array.
             * @type {Number}
             */
            this.packedLength = PolygonGeometryLibrary.PolygonGeometryLibrary.computeHierarchyPackedLength(polygonHierarchy) + Cartesian2.Ellipsoid.packedLength + VertexFormat.VertexFormat.packedLength + 12;
        }

        /**
         * A description of a polygon from an array of positions. Polygon geometry can be rendered with both {@link Primitive} and {@link GroundPrimitive}.
         *
         * @param {Object} options Object with the following properties:
         * @param {Cartesian3[]} options.positions An array of positions that defined the corner points of the polygon.
         * @param {Number} [options.height=0.0] The height of the polygon.
         * @param {Number} [options.extrudedHeight] The height of the polygon extrusion.
         * @param {VertexFormat} [options.vertexFormat=VertexFormat.DEFAULT] The vertex attributes to be computed.
         * @param {Number} [options.stRotation=0.0] The rotation of the texture coordinates, in radians. A positive rotation is counter-clockwise.
         * @param {Ellipsoid} [options.ellipsoid=Ellipsoid.WGS84] The ellipsoid to be used as a reference.
         * @param {Number} [options.granularity=CesiumMath.RADIANS_PER_DEGREE] The distance, in radians, between each latitude and longitude. Determines the number of positions in the buffer.
         * @param {Boolean} [options.perPositionHeight=false] Use the height of options.positions for each position instead of using options.height to determine the height.
         * @param {Boolean} [options.closeTop=true] When false, leaves off the top of an extruded polygon open.
         * @param {Boolean} [options.closeBottom=true] When false, leaves off the bottom of an extruded polygon open.
         * @param {ArcType} [options.arcType=ArcType.GEODESIC] The type of line the polygon edges must follow. Valid options are {@link ArcType.GEODESIC} and {@link ArcType.RHUMB}.
         * @returns {PolygonGeometry}
         *
         *
         * @example
         * // create a polygon from points
         * var polygon = Cesium.PolygonGeometry.fromPositions({
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
        PolygonGeometry.fromPositions = function(options) {
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
                vertexFormat : options.vertexFormat,
                stRotation : options.stRotation,
                ellipsoid : options.ellipsoid,
                granularity : options.granularity,
                perPositionHeight : options.perPositionHeight,
                closeTop : options.closeTop,
                closeBottom : options.closeBottom,
                offsetAttribute : options.offsetAttribute,
                arcType : options.arcType
            };
            return new PolygonGeometry(newOptions);
        };

        /**
         * Stores the provided instance into the provided array.
         *
         * @param {PolygonGeometry} value The value to pack.
         * @param {Number[]} array The array to pack into.
         * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
         *
         * @returns {Number[]} The array that was packed into
         */
        PolygonGeometry.pack = function(value, array, startingIndex) {
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

            array[startingIndex++] = value._height;
            array[startingIndex++] = value._extrudedHeight;
            array[startingIndex++] = value._granularity;
            array[startingIndex++] = value._stRotation;
            array[startingIndex++] = value._perPositionHeightExtrude ? 1.0 : 0.0;
            array[startingIndex++] = value._perPositionHeight ? 1.0 : 0.0;
            array[startingIndex++] = value._closeTop ? 1.0 : 0.0;
            array[startingIndex++] = value._closeBottom ? 1.0 : 0.0;
            array[startingIndex++] = value._shadowVolume ? 1.0 : 0.0;
            array[startingIndex++] = when.defaultValue(value._offsetAttribute, -1);
            array[startingIndex++] = value._arcType;
            array[startingIndex] = value.packedLength;

            return array;
        };

        var scratchEllipsoid = Cartesian2.Ellipsoid.clone(Cartesian2.Ellipsoid.UNIT_SPHERE);
        var scratchVertexFormat = new VertexFormat.VertexFormat();

        //Only used to avoid inability to default construct.
        var dummyOptions = {
            polygonHierarchy : {}
        };

        /**
         * Retrieves an instance from a packed array.
         *
         * @param {Number[]} array The packed array.
         * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
         * @param {PolygonGeometry} [result] The object into which to store the result.
         */
        PolygonGeometry.unpack = function(array, startingIndex, result) {
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

            var height = array[startingIndex++];
            var extrudedHeight = array[startingIndex++];
            var granularity = array[startingIndex++];
            var stRotation = array[startingIndex++];
            var perPositionHeightExtrude = array[startingIndex++] === 1.0;
            var perPositionHeight = array[startingIndex++] === 1.0;
            var closeTop = array[startingIndex++] === 1.0;
            var closeBottom = array[startingIndex++] === 1.0;
            var shadowVolume = array[startingIndex++] === 1.0;
            var offsetAttribute = array[startingIndex++];
            var arcType = array[startingIndex++];
            var packedLength = array[startingIndex];

            if (!when.defined(result)) {
                result = new PolygonGeometry(dummyOptions);
            }

            result._polygonHierarchy = polygonHierarchy;
            result._ellipsoid = Cartesian2.Ellipsoid.clone(ellipsoid, result._ellipsoid);
            result._vertexFormat = VertexFormat.VertexFormat.clone(vertexFormat, result._vertexFormat);
            result._height = height;
            result._extrudedHeight = extrudedHeight;
            result._granularity = granularity;
            result._stRotation = stRotation;
            result._perPositionHeightExtrude = perPositionHeightExtrude;
            result._perPositionHeight = perPositionHeight;
            result._closeTop = closeTop;
            result._closeBottom = closeBottom;
            result._shadowVolume = shadowVolume;
            result._offsetAttribute = offsetAttribute === -1 ? undefined : offsetAttribute;
            result._arcType = arcType;
            result.packedLength = packedLength;
            return result;
        };

        /**
         * Returns the bounding rectangle given the provided options
         *
         * @param {Object} options Object with the following properties:
         * @param {PolygonHierarchy} options.polygonHierarchy A polygon hierarchy that can include holes.
         * @param {Number} [options.granularity=CesiumMath.RADIANS_PER_DEGREE] The distance, in radians, between each latitude and longitude. Determines the number of positions sampled.
         * @param {ArcType} [options.arcType=ArcType.GEODESIC] The type of line the polygon edges must follow. Valid options are {@link ArcType.GEODESIC} and {@link ArcType.RHUMB}.
         * @param {Ellipsoid} [options.ellipsoid=Ellipsoid.WGS84] The ellipsoid to be used as a reference.
         * @param {Rectangle} [result] An object in which to store the result.
         *
         * @returns {Rectangle} The result rectangle
         */
        PolygonGeometry.computeRectangle = function(options, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('options', options);
            Check.Check.typeOf.object('options.polygonHierarchy', options.polygonHierarchy);
            //>>includeEnd('debug');

            var granularity = when.defaultValue(options.granularity, _Math.CesiumMath.RADIANS_PER_DEGREE);
            var arcType = when.defaultValue(options.arcType, ArcType.ArcType.GEODESIC);
            //>>includeStart('debug', pragmas.debug);
            if (arcType !== ArcType.ArcType.GEODESIC && arcType !== ArcType.ArcType.RHUMB) {
                throw new Check.DeveloperError('Invalid arcType. Valid options are ArcType.GEODESIC and ArcType.RHUMB.');
            }
            //>>includeEnd('debug');

            var polygonHierarchy = options.polygonHierarchy;
            var ellipsoid = when.defaultValue(options.ellipsoid, Cartesian2.Ellipsoid.WGS84);

            return computeRectangle(polygonHierarchy.positions, ellipsoid, arcType, granularity, result);
        };

        /**
         * Computes the geometric representation of a polygon, including its vertices, indices, and a bounding sphere.
         *
         * @param {PolygonGeometry} polygonGeometry A description of the polygon.
         * @returns {Geometry|undefined} The computed vertices and indices.
         */
        PolygonGeometry.createGeometry = function(polygonGeometry) {
            var vertexFormat = polygonGeometry._vertexFormat;
            var ellipsoid = polygonGeometry._ellipsoid;
            var granularity = polygonGeometry._granularity;
            var stRotation = polygonGeometry._stRotation;
            var polygonHierarchy = polygonGeometry._polygonHierarchy;
            var perPositionHeight = polygonGeometry._perPositionHeight;
            var closeTop = polygonGeometry._closeTop;
            var closeBottom = polygonGeometry._closeBottom;
            var arcType = polygonGeometry._arcType;

            var outerPositions = polygonHierarchy.positions;
            if (outerPositions.length < 3) {
                return;
            }

            var tangentPlane = EllipsoidTangentPlane.EllipsoidTangentPlane.fromPoints(outerPositions, ellipsoid);

            var results = PolygonGeometryLibrary.PolygonGeometryLibrary.polygonsFromHierarchy(polygonHierarchy, tangentPlane.projectPointsOntoPlane.bind(tangentPlane), !perPositionHeight, ellipsoid);
            var hierarchy = results.hierarchy;
            var polygons = results.polygons;

            if (hierarchy.length === 0) {
                return;
            }

            outerPositions = hierarchy[0].outerRing;
            var boundingRectangle = PolygonGeometryLibrary.PolygonGeometryLibrary.computeBoundingRectangle(tangentPlane.plane.normal, tangentPlane.projectPointOntoPlane.bind(tangentPlane), outerPositions, stRotation, scratchBoundingRectangle);

            var geometries = [];

            var height = polygonGeometry._height;
            var extrudedHeight = polygonGeometry._extrudedHeight;
            var extrude = polygonGeometry._perPositionHeightExtrude || !_Math.CesiumMath.equalsEpsilon(height, extrudedHeight, 0, _Math.CesiumMath.EPSILON2);

            var options = {
                perPositionHeight: perPositionHeight,
                vertexFormat: vertexFormat,
                geometry: undefined,
                tangentPlane: tangentPlane,
                boundingRectangle: boundingRectangle,
                ellipsoid: ellipsoid,
                stRotation: stRotation,
                bottom: false,
                top: true,
                wall: false,
                extrude: false,
                arcType: arcType
            };

            var i;

            if (extrude) {
                options.extrude = true;
                options.top = closeTop;
                options.bottom = closeBottom;
                options.shadowVolume = polygonGeometry._shadowVolume;
                options.offsetAttribute = polygonGeometry._offsetAttribute;
                for (i = 0; i < polygons.length; i++) {
                    var splitGeometry = createGeometryFromPositionsExtruded(ellipsoid, polygons[i], granularity, hierarchy[i], perPositionHeight, closeTop, closeBottom, vertexFormat, arcType, polygonGeometry._extrudeOutering);

                    var topAndBottom;
                    if (closeTop && closeBottom) {
                        topAndBottom = splitGeometry.topAndBottom;
                        options.geometry = PolygonGeometryLibrary.PolygonGeometryLibrary.scaleToGeodeticHeightExtruded(topAndBottom.geometry, height, extrudedHeight, ellipsoid, perPositionHeight);
                    } else if (closeTop) {
                        topAndBottom = splitGeometry.topAndBottom;
                        topAndBottom.geometry.attributes.position.values = PolygonPipeline.PolygonPipeline.scaleToGeodeticHeight(topAndBottom.geometry.attributes.position.values, height, ellipsoid, !perPositionHeight);
                        options.geometry = topAndBottom.geometry;
                    } else if (closeBottom) {
                        topAndBottom = splitGeometry.topAndBottom;
                        topAndBottom.geometry.attributes.position.values = PolygonPipeline.PolygonPipeline.scaleToGeodeticHeight(topAndBottom.geometry.attributes.position.values, extrudedHeight, ellipsoid, true);
                        options.geometry = topAndBottom.geometry;
                    }
                    if (closeTop || closeBottom) {
                        options.wall = false;
                        topAndBottom.geometry = computeAttributes(options);
                        geometries.push(topAndBottom);
                    }

                    var walls = splitGeometry.walls;
                    options.wall = true;
                    for ( var k = 0; k < walls.length; k++) {
                        var wall = walls[k];
                        options.geometry = PolygonGeometryLibrary.PolygonGeometryLibrary.scaleToGeodeticHeightExtruded(wall.geometry, height, extrudedHeight, ellipsoid, perPositionHeight);
                        wall.geometry = computeAttributes(options);
                        geometries.push(wall);
                    }
                }
            } else {
                for (i = 0; i < polygons.length; i++) {
                    var geometryInstance = new GeometryInstance.GeometryInstance({
                        geometry : PolygonGeometryLibrary.PolygonGeometryLibrary.createGeometryFromPositions(ellipsoid, polygons[i], granularity, perPositionHeight, vertexFormat, arcType)
                    });
                    geometryInstance.geometry.attributes.position.values = PolygonPipeline.PolygonPipeline.scaleToGeodeticHeight(geometryInstance.geometry.attributes.position.values, height, ellipsoid, !perPositionHeight);
                    options.geometry = geometryInstance.geometry;
                    geometryInstance.geometry = computeAttributes(options);

                    if (when.defined(polygonGeometry._offsetAttribute)) {
                        var length = geometryInstance.geometry.attributes.position.values.length;
                        var applyOffset = new Uint8Array(length / 3);
                        var offsetValue = polygonGeometry._offsetAttribute === GeometryOffsetAttribute.GeometryOffsetAttribute.NONE ? 0 : 1;
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
            geometry.attributes.position.values = new Float64Array(geometry.attributes.position.values);
            geometry.indices = IndexDatatype.IndexDatatype.createTypedArray(geometry.attributes.position.values.length / 3, geometry.indices);

            var attributes = geometry.attributes;
            var boundingSphere = BoundingSphere.BoundingSphere.fromVertices(attributes.position.values);

            if (!vertexFormat.position) {
                delete attributes.position;
            }

            return new GeometryAttribute.Geometry({
                attributes : attributes,
                indices : geometry.indices,
                primitiveType : geometry.primitiveType,
                boundingSphere : boundingSphere,
                offsetAttribute : polygonGeometry._offsetAttribute
            });
        };

        /**
         * @private
         */
        PolygonGeometry.createShadowVolume = function(polygonGeometry, minHeightFunc, maxHeightFunc) {
            var granularity = polygonGeometry._granularity;
            var ellipsoid = polygonGeometry._ellipsoid;

            var minHeight = minHeightFunc(granularity, ellipsoid);
            var maxHeight = maxHeightFunc(granularity, ellipsoid);

            return new PolygonGeometry({
                polygonHierarchy : polygonGeometry._polygonHierarchy,
                ellipsoid : ellipsoid,
                stRotation : polygonGeometry._stRotation,
                granularity : granularity,
                perPositionHeight : false,
                extrudedHeight : minHeight,
                height : maxHeight,
                vertexFormat : VertexFormat.VertexFormat.POSITION_ONLY,
                shadowVolume: true,
                arcType : polygonGeometry._arcType
            });
        };

        function textureCoordinateRotationPoints(polygonGeometry) {
            var stRotation = -polygonGeometry._stRotation;
            if (stRotation === 0.0) {
                return [0, 0, 0, 1, 1, 0];
            }
            var ellipsoid = polygonGeometry._ellipsoid;
            var positions = polygonGeometry._polygonHierarchy.positions;
            var boundingRectangle = polygonGeometry.rectangle;
            return GeometryAttribute.Geometry._textureCoordinateRotationPoints(positions, stRotation, ellipsoid, boundingRectangle);
        }

        Object.defineProperties(PolygonGeometry.prototype, {
            /**
             * @private
             */
            rectangle : {
                get : function() {
                    if (!when.defined(this._rectangle)) {
                        var positions = this._polygonHierarchy.positions;
                        this._rectangle = computeRectangle(positions, this._ellipsoid, this._arcType, this._granularity);
                    }

                    return this._rectangle;
                }
            },
            /**
             * For remapping texture coordinates when rendering PolygonGeometries as GroundPrimitives.
             * @private
             */
            textureCoordinateRotationPoints : {
                get : function() {
                    if (!when.defined(this._textureCoordinateRotationPoints)) {
                        this._textureCoordinateRotationPoints = textureCoordinateRotationPoints(this);
                    }
                    return this._textureCoordinateRotationPoints;
                }
            }
        });

    function createPolygonGeometry(polygonGeometry, offset) {
        if (when.defined(offset)) {
            polygonGeometry = PolygonGeometry.unpack(polygonGeometry, offset);
        }
        polygonGeometry._ellipsoid = Cartesian2.Ellipsoid.clone(polygonGeometry._ellipsoid);
        return PolygonGeometry.createGeometry(polygonGeometry);
    }

    return createPolygonGeometry;

});

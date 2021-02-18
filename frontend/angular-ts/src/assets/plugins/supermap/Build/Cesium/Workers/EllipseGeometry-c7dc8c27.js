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
define(['exports', './when-8d13db60', './Check-70bec281', './Math-61ede240', './Cartographic-fe4be337', './Cartesian2-85064f09', './BoundingSphere-775c5788', './ComponentDatatype-5862616f', './GeometryAttribute-06d31d45', './PrimitiveType-97893bc7', './Transforms-913163ed', './GeometryAttributes-aacecde6', './GeometryPipeline-f6e7a4ed', './IndexDatatype-9435b55f', './GeometryOffsetAttribute-ca302482', './VertexFormat-fe4db402', './EllipseGeometryLibrary-3558b757', './GeometryInstance-93a01b5d'], function (exports, when, Check, _Math, Cartographic, Cartesian2, BoundingSphere, ComponentDatatype, GeometryAttribute, PrimitiveType, Transforms, GeometryAttributes, GeometryPipeline, IndexDatatype, GeometryOffsetAttribute, VertexFormat, EllipseGeometryLibrary, GeometryInstance) { 'use strict';

    var scratchCartesian1 = new Cartographic.Cartesian3();
        var scratchCartesian2 = new Cartographic.Cartesian3();
        var scratchCartesian3 = new Cartographic.Cartesian3();
        var scratchCartesian4 = new Cartographic.Cartesian3();
        var texCoordScratch = new Cartesian2.Cartesian2();
        var textureMatrixScratch = new BoundingSphere.Matrix3();
        var tangentMatrixScratch = new BoundingSphere.Matrix3();
        var quaternionScratch = new Transforms.Quaternion();

        var scratchNormal = new Cartographic.Cartesian3();
        var scratchTangent = new Cartographic.Cartesian3();
        var scratchBitangent = new Cartographic.Cartesian3();

        var scratchCartographic = new Cartographic.Cartographic();
        var projectedCenterScratch = new Cartographic.Cartesian3();

        var scratchMinTexCoord = new Cartesian2.Cartesian2();
        var scratchMaxTexCoord = new Cartesian2.Cartesian2();

        function computeTopBottomAttributes(positions, options, extrude) {
            var vertexFormat = options.vertexFormat;
            var center = options.center;
            var semiMajorAxis = options.semiMajorAxis;
            var semiMinorAxis = options.semiMinorAxis;
            var ellipsoid = options.ellipsoid;
            var stRotation = options.stRotation;
            var size = (extrude) ? positions.length / 3 * 2 : positions.length / 3;
            var shadowVolume = options.shadowVolume;

            var textureCoordinates = (vertexFormat.st) ? new Float32Array(size * 2) : undefined;
            var normals = (vertexFormat.normal) ? new Float32Array(size * 3) : undefined;
            var tangents = (vertexFormat.tangent) ? new Float32Array(size * 3) : undefined;
            var bitangents = (vertexFormat.bitangent) ? new Float32Array(size * 3) : undefined;

            var extrudeNormals = (shadowVolume) ? new Float32Array(size * 3) : undefined;

            var textureCoordIndex = 0;

            // Raise positions to a height above the ellipsoid and compute the
            // texture coordinates, normals, tangents, and bitangents.
            var normal = scratchNormal;
            var tangent = scratchTangent;
            var bitangent = scratchBitangent;

            var projection = new BoundingSphere.GeographicProjection(ellipsoid);
            var projectedCenter = projection.project(ellipsoid.cartesianToCartographic(center, scratchCartographic), projectedCenterScratch);

            var geodeticNormal = ellipsoid.scaleToGeodeticSurface(center, scratchCartesian1);
            ellipsoid.geodeticSurfaceNormal(geodeticNormal, geodeticNormal);

            var textureMatrix = textureMatrixScratch;
            var tangentMatrix = tangentMatrixScratch;
            if (stRotation !== 0) {
                var rotation = Transforms.Quaternion.fromAxisAngle(geodeticNormal, stRotation, quaternionScratch);
                textureMatrix = BoundingSphere.Matrix3.fromQuaternion(rotation, textureMatrix);

                rotation = Transforms.Quaternion.fromAxisAngle(geodeticNormal, -stRotation, quaternionScratch);
                tangentMatrix = BoundingSphere.Matrix3.fromQuaternion(rotation, tangentMatrix);
            } else {
                textureMatrix = BoundingSphere.Matrix3.clone(BoundingSphere.Matrix3.IDENTITY, textureMatrix);
                tangentMatrix = BoundingSphere.Matrix3.clone(BoundingSphere.Matrix3.IDENTITY, tangentMatrix);
            }

            var minTexCoord = Cartesian2.Cartesian2.fromElements(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, scratchMinTexCoord);
            var maxTexCoord = Cartesian2.Cartesian2.fromElements(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, scratchMaxTexCoord);

            var length = positions.length;
            var bottomOffset = (extrude) ? length : 0;
            var stOffset = bottomOffset / 3 * 2;
            for (var i = 0; i < length; i += 3) {
                var i1 = i + 1;
                var i2 = i + 2;
                var position = Cartographic.Cartesian3.fromArray(positions, i, scratchCartesian1);

                if (vertexFormat.st) {
                    var rotatedPoint = BoundingSphere.Matrix3.multiplyByVector(textureMatrix, position, scratchCartesian2);
                    var projectedPoint = projection.project(ellipsoid.cartesianToCartographic(rotatedPoint, scratchCartographic), scratchCartesian3);
                    Cartographic.Cartesian3.subtract(projectedPoint, projectedCenter, projectedPoint);

                    texCoordScratch.x = (projectedPoint.x + semiMajorAxis) / (2.0 * semiMajorAxis);
                    texCoordScratch.y = (projectedPoint.y + semiMinorAxis) / (2.0 * semiMinorAxis);

                    minTexCoord.x = Math.min(texCoordScratch.x, minTexCoord.x);
                    minTexCoord.y = Math.min(texCoordScratch.y, minTexCoord.y);
                    maxTexCoord.x = Math.max(texCoordScratch.x, maxTexCoord.x);
                    maxTexCoord.y = Math.max(texCoordScratch.y, maxTexCoord.y);

                    if (extrude) {
                        textureCoordinates[textureCoordIndex + stOffset] = texCoordScratch.x;
                        textureCoordinates[textureCoordIndex + 1 + stOffset] = texCoordScratch.y;
                    }

                    textureCoordinates[textureCoordIndex++] = texCoordScratch.x;
                    textureCoordinates[textureCoordIndex++] = texCoordScratch.y;
                }

                if (vertexFormat.normal || vertexFormat.tangent || vertexFormat.bitangent || shadowVolume) {
                    normal = ellipsoid.geodeticSurfaceNormal(position, normal);

                    if (shadowVolume) {
                        extrudeNormals[i + bottomOffset] = -normal.x;
                        extrudeNormals[i1 + bottomOffset] = -normal.y;
                        extrudeNormals[i2 + bottomOffset] = -normal.z;
                    }

                    if (vertexFormat.normal || vertexFormat.tangent || vertexFormat.bitangent) {
                        if (vertexFormat.tangent || vertexFormat.bitangent) {
                            tangent = Cartographic.Cartesian3.normalize(Cartographic.Cartesian3.cross(Cartographic.Cartesian3.UNIT_Z, normal, tangent), tangent);
                            BoundingSphere.Matrix3.multiplyByVector(tangentMatrix, tangent, tangent);
                        }
                        if (vertexFormat.normal) {
                            normals[i] = normal.x;
                            normals[i1] = normal.y;
                            normals[i2] = normal.z;
                            if (extrude) {
                                normals[i + bottomOffset] = -normal.x;
                                normals[i1 + bottomOffset] = -normal.y;
                                normals[i2 + bottomOffset] = -normal.z;
                            }
                        }

                        if (vertexFormat.tangent) {
                            tangents[i] = tangent.x;
                            tangents[i1] = tangent.y;
                            tangents[i2] = tangent.z;
                            if (extrude) {
                                tangents[i + bottomOffset] = -tangent.x;
                                tangents[i1 + bottomOffset] = -tangent.y;
                                tangents[i2 + bottomOffset] = -tangent.z;
                            }
                        }

                        if (vertexFormat.bitangent) {
                            bitangent = Cartographic.Cartesian3.normalize(Cartographic.Cartesian3.cross(normal, tangent, bitangent), bitangent);
                            bitangents[i ] = bitangent.x;
                            bitangents[i1] = bitangent.y;
                            bitangents[i2] = bitangent.z;
                            if (extrude) {
                                bitangents[i + bottomOffset] = bitangent.x;
                                bitangents[i1 + bottomOffset] = bitangent.y;
                                bitangents[i2 + bottomOffset] = bitangent.z;
                            }
                        }
                    }
                }
            }

            if (vertexFormat.st) {
                length = textureCoordinates.length;
                for (var k = 0; k < length; k += 2) {
                    textureCoordinates[k] = (textureCoordinates[k] - minTexCoord.x) / (maxTexCoord.x - minTexCoord.x);
                    textureCoordinates[k + 1] = (textureCoordinates[k + 1] - minTexCoord.y) / (maxTexCoord.y - minTexCoord.y);
                }
            }

            var attributes = new GeometryAttributes.GeometryAttributes();

            if (vertexFormat.position) {
                var finalPositions = EllipseGeometryLibrary.EllipseGeometryLibrary.raisePositionsToHeight(positions, options, extrude);
                attributes.position = new GeometryAttribute.GeometryAttribute({
                    componentDatatype : ComponentDatatype.ComponentDatatype.DOUBLE,
                    componentsPerAttribute : 3,
                    values : finalPositions
                });
            }

            if (vertexFormat.st) {
                attributes.st = new GeometryAttribute.GeometryAttribute({
                    componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
                    componentsPerAttribute : 2,
                    values : textureCoordinates
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

            if (shadowVolume) {
                attributes.extrudeDirection = new GeometryAttribute.GeometryAttribute({
                    componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
                    componentsPerAttribute : 3,
                    values : extrudeNormals
                });
            }

            if (extrude && when.defined(options.offsetAttribute)) {
                var offsetAttribute = new Uint8Array(size);
                if (options.offsetAttribute === GeometryOffsetAttribute.GeometryOffsetAttribute.TOP) {
                    offsetAttribute = GeometryOffsetAttribute.arrayFill(offsetAttribute, 1, 0, size / 2);
                } else {
                    var offsetValue = options.offsetAttribute === GeometryOffsetAttribute.GeometryOffsetAttribute.NONE ? 0 : 1;
                    offsetAttribute = GeometryOffsetAttribute.arrayFill(offsetAttribute, offsetValue);
                }

                attributes.applyOffset = new GeometryAttribute.GeometryAttribute({
                    componentDatatype : ComponentDatatype.ComponentDatatype.UNSIGNED_BYTE,
                    componentsPerAttribute : 1,
                    values : offsetAttribute
                });
            }

            return attributes;
        }

        function topIndices(numPts) {
            // numTriangles in half = 3 + 8 + 12 + ... = -1 + 4 + (4 + 4) + (4 + 4 + 4) + ... = -1 + 4 * (1 + 2 + 3 + ...)
            //              = -1 + 4 * ((n * ( n + 1)) / 2)
            // total triangles = 2 * numTrangles in half
            // indices = total triangles * 3;
            // Substitute numPts for n above

            var indices = new Array(12 * (numPts * ( numPts + 1)) - 6);
            var indicesIndex = 0;
            var prevIndex;
            var numInterior;
            var positionIndex;
            var i;
            var j;
            // Indices triangles to the 'right' of the north vector

            prevIndex = 0;
            positionIndex = 1;
            for (i = 0; i < 3; i++) {
                indices[indicesIndex++] = positionIndex++;
                indices[indicesIndex++] = prevIndex;
                indices[indicesIndex++] = positionIndex;
            }

            for (i = 2; i < numPts + 1; ++i) {
                positionIndex = i * (i + 1) - 1;
                prevIndex = (i - 1) * i - 1;

                indices[indicesIndex++] = positionIndex++;
                indices[indicesIndex++] = prevIndex;
                indices[indicesIndex++] = positionIndex;

                numInterior = 2 * i;
                for (j = 0; j < numInterior - 1; ++j) {

                    indices[indicesIndex++] = positionIndex;
                    indices[indicesIndex++] = prevIndex++;
                    indices[indicesIndex++] = prevIndex;

                    indices[indicesIndex++] = positionIndex++;
                    indices[indicesIndex++] = prevIndex;
                    indices[indicesIndex++] = positionIndex;
                }

                indices[indicesIndex++] = positionIndex++;
                indices[indicesIndex++] = prevIndex;
                indices[indicesIndex++] = positionIndex;
            }

            // Indices for center column of triangles
            numInterior = numPts * 2;
            ++positionIndex;
            ++prevIndex;
            for (i = 0; i < numInterior - 1; ++i) {
                indices[indicesIndex++] = positionIndex;
                indices[indicesIndex++] = prevIndex++;
                indices[indicesIndex++] = prevIndex;

                indices[indicesIndex++] = positionIndex++;
                indices[indicesIndex++] = prevIndex;
                indices[indicesIndex++] = positionIndex;
            }

            indices[indicesIndex++] = positionIndex;
            indices[indicesIndex++] = prevIndex++;
            indices[indicesIndex++] = prevIndex;

            indices[indicesIndex++] = positionIndex++;
            indices[indicesIndex++] = prevIndex++;
            indices[indicesIndex++] = prevIndex;

            // Reverse the process creating indices to the 'left' of the north vector
            ++prevIndex;
            for (i = numPts - 1; i > 1; --i) {
                indices[indicesIndex++] = prevIndex++;
                indices[indicesIndex++] = prevIndex;
                indices[indicesIndex++] = positionIndex;

                numInterior = 2 * i;
                for (j = 0; j < numInterior - 1; ++j) {
                    indices[indicesIndex++] = positionIndex;
                    indices[indicesIndex++] = prevIndex++;
                    indices[indicesIndex++] = prevIndex;

                    indices[indicesIndex++] = positionIndex++;
                    indices[indicesIndex++] = prevIndex;
                    indices[indicesIndex++] = positionIndex;
                }

                indices[indicesIndex++] = prevIndex++;
                indices[indicesIndex++] = prevIndex++;
                indices[indicesIndex++] = positionIndex++;
            }

            for (i = 0; i < 3; i++) {
                indices[indicesIndex++] = prevIndex++;
                indices[indicesIndex++] = prevIndex;
                indices[indicesIndex++] = positionIndex;
            }
            return indices;
        }

        var boundingSphereCenter = new Cartographic.Cartesian3();

        function computeEllipse(options) {
            var center = options.center;
            boundingSphereCenter = Cartographic.Cartesian3.multiplyByScalar(options.ellipsoid.geodeticSurfaceNormal(center, boundingSphereCenter), options.height, boundingSphereCenter);
            boundingSphereCenter = Cartographic.Cartesian3.add(center, boundingSphereCenter, boundingSphereCenter);
            var boundingSphere = new BoundingSphere.BoundingSphere(boundingSphereCenter, options.semiMajorAxis);
            var cep = EllipseGeometryLibrary.EllipseGeometryLibrary.computeEllipsePositions(options, true, false);
            var positions = cep.positions;
            var numPts = cep.numPts;
            var attributes = computeTopBottomAttributes(positions, options, false);
            var indices = topIndices(numPts);
            indices = IndexDatatype.IndexDatatype.createTypedArray(positions.length / 3, indices);
            return {
                boundingSphere : boundingSphere,
                attributes : attributes,
                indices : indices
            };
        }

        function computeWallAttributes(positions, options) {
            var vertexFormat = options.vertexFormat;
            var center = options.center;
            var semiMajorAxis = options.semiMajorAxis;
            var semiMinorAxis = options.semiMinorAxis;
            var ellipsoid = options.ellipsoid;
            var height = options.height;
            var extrudedHeight = options.extrudedHeight;
            var stRotation = options.stRotation;
            var size = positions.length / 3 * 2;

            var finalPositions = new Float64Array(size * 3);
            var textureCoordinates = (vertexFormat.st) ? new Float32Array(size * 2) : undefined;
            var normals = (vertexFormat.normal) ? new Float32Array(size * 3) : undefined;
            var tangents = (vertexFormat.tangent) ? new Float32Array(size * 3) : undefined;
            var bitangents = (vertexFormat.bitangent) ? new Float32Array(size * 3) : undefined;

            var shadowVolume = options.shadowVolume;
            var extrudeNormals = (shadowVolume) ? new Float32Array(size * 3) : undefined;

            var textureCoordIndex = 0;

            // Raise positions to a height above the ellipsoid and compute the
            // texture coordinates, normals, tangents, and bitangents.
            var normal = scratchNormal;
            var tangent = scratchTangent;
            var bitangent = scratchBitangent;

            var projection = new BoundingSphere.GeographicProjection(ellipsoid);
            var projectedCenter = projection.project(ellipsoid.cartesianToCartographic(center, scratchCartographic), projectedCenterScratch);

            var geodeticNormal = ellipsoid.scaleToGeodeticSurface(center, scratchCartesian1);
            ellipsoid.geodeticSurfaceNormal(geodeticNormal, geodeticNormal);
            var rotation = Transforms.Quaternion.fromAxisAngle(geodeticNormal, stRotation, quaternionScratch);
            var textureMatrix = BoundingSphere.Matrix3.fromQuaternion(rotation, textureMatrixScratch);

            var minTexCoord = Cartesian2.Cartesian2.fromElements(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, scratchMinTexCoord);
            var maxTexCoord = Cartesian2.Cartesian2.fromElements(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, scratchMaxTexCoord);

            var length = positions.length;
            var stOffset = length / 3 * 2;
            for (var i = 0; i < length; i += 3) {
                var i1 = i + 1;
                var i2 = i + 2;
                var position = Cartographic.Cartesian3.fromArray(positions, i, scratchCartesian1);
                var extrudedPosition;

                if (vertexFormat.st) {
                    var rotatedPoint = BoundingSphere.Matrix3.multiplyByVector(textureMatrix, position, scratchCartesian2);
                    var projectedPoint = projection.project(ellipsoid.cartesianToCartographic(rotatedPoint, scratchCartographic), scratchCartesian3);
                    Cartographic.Cartesian3.subtract(projectedPoint, projectedCenter, projectedPoint);

                    texCoordScratch.x = (projectedPoint.x + semiMajorAxis) / (2.0 * semiMajorAxis);
                    texCoordScratch.y = (projectedPoint.y + semiMinorAxis) / (2.0 * semiMinorAxis);

                    minTexCoord.x = Math.min(texCoordScratch.x, minTexCoord.x);
                    minTexCoord.y = Math.min(texCoordScratch.y, minTexCoord.y);
                    maxTexCoord.x = Math.max(texCoordScratch.x, maxTexCoord.x);
                    maxTexCoord.y = Math.max(texCoordScratch.y, maxTexCoord.y);

                    textureCoordinates[textureCoordIndex + stOffset] = texCoordScratch.x;
                    textureCoordinates[textureCoordIndex + 1 + stOffset] = texCoordScratch.y;

                    textureCoordinates[textureCoordIndex++] = texCoordScratch.x;
                    textureCoordinates[textureCoordIndex++] = texCoordScratch.y;
                }

                position = ellipsoid.scaleToGeodeticSurface(position, position);
                extrudedPosition = Cartographic.Cartesian3.clone(position, scratchCartesian2);
                normal = ellipsoid.geodeticSurfaceNormal(position, normal);

                if (shadowVolume) {
                    extrudeNormals[i + length] = -normal.x;
                    extrudeNormals[i1 + length] = -normal.y;
                    extrudeNormals[i2 + length] = -normal.z;
                }

                var scaledNormal = Cartographic.Cartesian3.multiplyByScalar(normal, height, scratchCartesian4);
                position = Cartographic.Cartesian3.add(position, scaledNormal, position);
                scaledNormal = Cartographic.Cartesian3.multiplyByScalar(normal, extrudedHeight, scaledNormal);
                extrudedPosition = Cartographic.Cartesian3.add(extrudedPosition, scaledNormal, extrudedPosition);

                if (vertexFormat.position) {
                    finalPositions[i + length] = extrudedPosition.x;
                    finalPositions[i1 + length] = extrudedPosition.y;
                    finalPositions[i2 + length] = extrudedPosition.z;

                    finalPositions[i] = position.x;
                    finalPositions[i1] = position.y;
                    finalPositions[i2] = position.z;
                }

                if (vertexFormat.normal || vertexFormat.tangent || vertexFormat.bitangent) {

                    bitangent = Cartographic.Cartesian3.clone(normal, bitangent);
                    var next = Cartographic.Cartesian3.fromArray(positions, (i + 3) % length, scratchCartesian4);
                    Cartographic.Cartesian3.subtract(next, position, next);
                    var bottom = Cartographic.Cartesian3.subtract(extrudedPosition, position, scratchCartesian3);

                    normal = Cartographic.Cartesian3.normalize(Cartographic.Cartesian3.cross(bottom, next, normal), normal);

                    if (vertexFormat.normal) {
                        normals[i] = normal.x;
                        normals[i1] = normal.y;
                        normals[i2] = normal.z;

                        normals[i + length] = normal.x;
                        normals[i1 + length] = normal.y;
                        normals[i2 + length] = normal.z;
                    }

                    if (vertexFormat.tangent) {
                        tangent = Cartographic.Cartesian3.normalize(Cartographic.Cartesian3.cross(bitangent, normal, tangent), tangent);
                        tangents[i] = tangent.x;
                        tangents[i1] = tangent.y;
                        tangents[i2] = tangent.z;

                        tangents[i + length] = tangent.x;
                        tangents[i + 1 + length] = tangent.y;
                        tangents[i + 2 + length] = tangent.z;
                    }

                    if (vertexFormat.bitangent) {
                        bitangents[i ] = bitangent.x;
                        bitangents[i1] = bitangent.y;
                        bitangents[i2] = bitangent.z;

                        bitangents[i + length] = bitangent.x;
                        bitangents[i1 + length] = bitangent.y;
                        bitangents[i2 + length] = bitangent.z;
                    }
                }
            }

            if (vertexFormat.st) {
                length = textureCoordinates.length;
                for (var k = 0; k < length; k += 2) {
                    textureCoordinates[k] = (textureCoordinates[k] - minTexCoord.x) / (maxTexCoord.x - minTexCoord.x);
                    textureCoordinates[k + 1] = (textureCoordinates[k + 1] - minTexCoord.y) / (maxTexCoord.y - minTexCoord.y);
                }
            }

            var attributes = new GeometryAttributes.GeometryAttributes();

            if (vertexFormat.position) {
                attributes.position = new GeometryAttribute.GeometryAttribute({
                    componentDatatype : ComponentDatatype.ComponentDatatype.DOUBLE,
                    componentsPerAttribute : 3,
                    values : finalPositions
                });
            }

            if (vertexFormat.st) {
                attributes.st = new GeometryAttribute.GeometryAttribute({
                    componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
                    componentsPerAttribute : 2,
                    values : textureCoordinates
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

            if (shadowVolume) {
                attributes.extrudeDirection = new GeometryAttribute.GeometryAttribute({
                    componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
                    componentsPerAttribute : 3,
                    values : extrudeNormals
                });
            }

            if (when.defined(options.offsetAttribute)) {
                var offsetAttribute = new Uint8Array(size);
                if (options.offsetAttribute === GeometryOffsetAttribute.GeometryOffsetAttribute.TOP) {
                    offsetAttribute = GeometryOffsetAttribute.arrayFill(offsetAttribute, 1, 0, size / 2);
                } else {
                    var offsetValue = options.offsetAttribute === GeometryOffsetAttribute.GeometryOffsetAttribute.NONE ? 0 : 1;
                    offsetAttribute = GeometryOffsetAttribute.arrayFill(offsetAttribute, offsetValue);
                }
                attributes.applyOffset = new GeometryAttribute.GeometryAttribute({
                    componentDatatype : ComponentDatatype.ComponentDatatype.UNSIGNED_BYTE,
                    componentsPerAttribute : 1,
                    values : offsetAttribute
                });
            }

            return attributes;
        }

        function computeWallIndices(positions) {
            var length = positions.length / 3;
            var indices = IndexDatatype.IndexDatatype.createTypedArray(length, length * 6);
            var index = 0;
            for (var i = 0; i < length; i++) {
                var UL = i;
                var LL = i + length;
                var UR = (UL + 1) % length;
                var LR = UR + length;
                indices[index++] = UL;
                indices[index++] = LL;
                indices[index++] = UR;
                indices[index++] = UR;
                indices[index++] = LL;
                indices[index++] = LR;
            }

            return indices;
        }

        var topBoundingSphere = new BoundingSphere.BoundingSphere();
        var bottomBoundingSphere = new BoundingSphere.BoundingSphere();

        function computeExtrudedEllipse(options) {
            var center = options.center;
            var ellipsoid = options.ellipsoid;
            var semiMajorAxis = options.semiMajorAxis;
            var scaledNormal = Cartographic.Cartesian3.multiplyByScalar(ellipsoid.geodeticSurfaceNormal(center, scratchCartesian1), options.height, scratchCartesian1);
            topBoundingSphere.center = Cartographic.Cartesian3.add(center, scaledNormal, topBoundingSphere.center);
            topBoundingSphere.radius = semiMajorAxis;

            scaledNormal = Cartographic.Cartesian3.multiplyByScalar(ellipsoid.geodeticSurfaceNormal(center, scaledNormal), options.extrudedHeight, scaledNormal);
            bottomBoundingSphere.center = Cartographic.Cartesian3.add(center, scaledNormal, bottomBoundingSphere.center);
            bottomBoundingSphere.radius = semiMajorAxis;

            var cep = EllipseGeometryLibrary.EllipseGeometryLibrary.computeEllipsePositions(options, true, true);
            var positions = cep.positions;
            var numPts = cep.numPts;
            var outerPositions = cep.outerPositions;
            var boundingSphere = BoundingSphere.BoundingSphere.union(topBoundingSphere, bottomBoundingSphere);
            var topBottomAttributes = computeTopBottomAttributes(positions, options, true);
            var indices = topIndices(numPts);
            var length = indices.length;
            indices.length = length * 2;
            var posLength = positions.length / 3;
            for (var i = 0; i < length; i += 3) {
                indices[i + length] = indices[i + 2] + posLength;
                indices[i + 1 + length] = indices[i + 1] + posLength;
                indices[i + 2 + length] = indices[i] + posLength;
            }

            var topBottomIndices = IndexDatatype.IndexDatatype.createTypedArray(posLength * 2 / 3, indices);

            var topBottomGeo = new GeometryAttribute.Geometry({
                attributes : topBottomAttributes,
                indices : topBottomIndices,
                primitiveType : PrimitiveType.PrimitiveType.TRIANGLES
            });

            var wallAttributes = computeWallAttributes(outerPositions, options);
            indices = computeWallIndices(outerPositions);
            var wallIndices = IndexDatatype.IndexDatatype.createTypedArray(outerPositions.length * 2 / 3, indices);

            var wallGeo = new GeometryAttribute.Geometry({
                attributes : wallAttributes,
                indices : wallIndices,
                primitiveType : PrimitiveType.PrimitiveType.TRIANGLES
            });

            var geo = GeometryPipeline.GeometryPipeline.combineInstances([
                new GeometryInstance.GeometryInstance({
                    geometry : topBottomGeo
                }),
                new GeometryInstance.GeometryInstance({
                    geometry : wallGeo
                })
            ]);

            return {
                boundingSphere : boundingSphere,
                attributes : geo[0].attributes,
                indices : geo[0].indices
            };
        }

        function computeRectangle(center, semiMajorAxis, semiMinorAxis, rotation, granularity, ellipsoid, result) {
            var cep = EllipseGeometryLibrary.EllipseGeometryLibrary.computeEllipsePositions({
                center : center,
                semiMajorAxis : semiMajorAxis,
                semiMinorAxis : semiMinorAxis,
                rotation : rotation,
                granularity : granularity
            }, false, true);
            var positionsFlat = cep.outerPositions;
            var positionsCount = positionsFlat.length / 3;
            var positions = new Array(positionsCount);
            for (var i = 0; i < positionsCount; ++i) {
                positions[i] = Cartographic.Cartesian3.fromArray(positionsFlat, i * 3);
            }
            var rectangle = Cartesian2.Rectangle.fromCartesianArray(positions, ellipsoid, result);
            // Rectangle width goes beyond 180 degrees when the ellipse crosses a pole.
            // When this happens, make the rectangle into a "circle" around the pole
            if (rectangle.width > _Math.CesiumMath.PI) {
                rectangle.north = rectangle.north > 0.0 ? _Math.CesiumMath.PI_OVER_TWO - _Math.CesiumMath.EPSILON7 : rectangle.north;
                rectangle.south = rectangle.south < 0.0 ? _Math.CesiumMath.EPSILON7 - _Math.CesiumMath.PI_OVER_TWO : rectangle.south;
                rectangle.east = _Math.CesiumMath.PI;
                rectangle.west = -_Math.CesiumMath.PI;
            }
            return rectangle;
        }

        /**
         * A description of an ellipse on an ellipsoid. Ellipse geometry can be rendered with both {@link Primitive} and {@link GroundPrimitive}.
         *
         * @alias EllipseGeometry
         * @constructor
         *
         * @param {Object} options Object with the following properties:
         * @param {Cartesian3} options.center The ellipse's center point in the fixed frame.
         * @param {Number} options.semiMajorAxis The length of the ellipse's semi-major axis in meters.
         * @param {Number} options.semiMinorAxis The length of the ellipse's semi-minor axis in meters.
         * @param {Ellipsoid} [options.ellipsoid=Ellipsoid.WGS84] The ellipsoid the ellipse will be on.
         * @param {Number} [options.height=0.0] The distance in meters between the ellipse and the ellipsoid surface.
         * @param {Number} [options.extrudedHeight] The distance in meters between the ellipse's extruded face and the ellipsoid surface.
         * @param {Number} [options.rotation=0.0] The angle of rotation counter-clockwise from north.
         * @param {Number} [options.stRotation=0.0] The rotation of the texture coordinates counter-clockwise from north.
         * @param {Number} [options.granularity=CesiumMath.RADIANS_PER_DEGREE] The angular distance between points on the ellipse in radians.
         * @param {VertexFormat} [options.vertexFormat=VertexFormat.DEFAULT] The vertex attributes to be computed.
         *
         * @exception {DeveloperError} semiMajorAxis and semiMinorAxis must be greater than zero.
         * @exception {DeveloperError} semiMajorAxis must be greater than or equal to the semiMinorAxis.
         * @exception {DeveloperError} granularity must be greater than zero.
         *
         *
         * @example
         * // Create an ellipse.
         * var ellipse = new Cesium.EllipseGeometry({
         *   center : Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
         *   semiMajorAxis : 500000.0,
         *   semiMinorAxis : 300000.0,
         *   rotation : Cesium.Math.toRadians(60.0)
         * });
         * var geometry = Cesium.EllipseGeometry.createGeometry(ellipse);
         *
         * @see EllipseGeometry.createGeometry
         */
        function EllipseGeometry(options) {
            options = when.defaultValue(options, when.defaultValue.EMPTY_OBJECT);

            var center = options.center;
            var ellipsoid = when.defaultValue(options.ellipsoid, Cartesian2.Ellipsoid.WGS84);
            var semiMajorAxis = options.semiMajorAxis;
            var semiMinorAxis = options.semiMinorAxis;
            var granularity = when.defaultValue(options.granularity, _Math.CesiumMath.RADIANS_PER_DEGREE);
            var vertexFormat = when.defaultValue(options.vertexFormat, VertexFormat.VertexFormat.DEFAULT);

            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('options.center', center);
            Check.Check.typeOf.number('options.semiMajorAxis', semiMajorAxis);
            Check.Check.typeOf.number('options.semiMinorAxis', semiMinorAxis);
            if (semiMajorAxis < semiMinorAxis) {
                throw new Check.DeveloperError('semiMajorAxis must be greater than or equal to the semiMinorAxis.');
            }
            if (granularity <= 0.0) {
                throw new Check.DeveloperError('granularity must be greater than zero.');
            }
            //>>includeEnd('debug');

            var height = when.defaultValue(options.height, 0.0);
            var extrudedHeight = when.defaultValue(options.extrudedHeight, height);

            this._center = Cartographic.Cartesian3.clone(center);
            this._semiMajorAxis = semiMajorAxis;
            this._semiMinorAxis = semiMinorAxis;
            this._ellipsoid = Cartesian2.Ellipsoid.clone(ellipsoid);
            this._rotation = when.defaultValue(options.rotation, 0.0);
            this._stRotation = when.defaultValue(options.stRotation, 0.0);
            this._height = Math.max(extrudedHeight, height);
            this._granularity = granularity;
            this._vertexFormat = VertexFormat.VertexFormat.clone(vertexFormat);
            this._extrudedHeight = Math.min(extrudedHeight, height);
            this._shadowVolume = when.defaultValue(options.shadowVolume, false);
            this._workerName = 'createEllipseGeometry';
            this._offsetAttribute = options.offsetAttribute;

            this._rectangle = undefined;
            this._textureCoordinateRotationPoints = undefined;
        }

        /**
         * The number of elements used to pack the object into an array.
         * @type {Number}
         */
        EllipseGeometry.packedLength = Cartographic.Cartesian3.packedLength + Cartesian2.Ellipsoid.packedLength + VertexFormat.VertexFormat.packedLength + 9;

        /**
         * Stores the provided instance into the provided array.
         *
         * @param {EllipseGeometry} value The value to pack.
         * @param {Number[]} array The array to pack into.
         * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
         *
         * @returns {Number[]} The array that was packed into
         */
        EllipseGeometry.pack = function(value, array, startingIndex) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('value', value);
            Check.Check.defined('array', array);
            //>>includeEnd('debug');

            startingIndex = when.defaultValue(startingIndex, 0);

            Cartographic.Cartesian3.pack(value._center, array, startingIndex);
            startingIndex += Cartographic.Cartesian3.packedLength;

            Cartesian2.Ellipsoid.pack(value._ellipsoid, array, startingIndex);
            startingIndex += Cartesian2.Ellipsoid.packedLength;

            VertexFormat.VertexFormat.pack(value._vertexFormat, array, startingIndex);
            startingIndex += VertexFormat.VertexFormat.packedLength;

            array[startingIndex++] = value._semiMajorAxis;
            array[startingIndex++] = value._semiMinorAxis;
            array[startingIndex++] = value._rotation;
            array[startingIndex++] = value._stRotation;
            array[startingIndex++] = value._height;
            array[startingIndex++] = value._granularity;
            array[startingIndex++] = value._extrudedHeight;
            array[startingIndex++] = value._shadowVolume ? 1.0 : 0.0;
            array[startingIndex] = when.defaultValue(value._offsetAttribute, -1);

            return array;
        };

        var scratchCenter = new Cartographic.Cartesian3();
        var scratchEllipsoid = new Cartesian2.Ellipsoid();
        var scratchVertexFormat = new VertexFormat.VertexFormat();
        var scratchOptions = {
            center : scratchCenter,
            ellipsoid : scratchEllipsoid,
            vertexFormat : scratchVertexFormat,
            semiMajorAxis : undefined,
            semiMinorAxis : undefined,
            rotation : undefined,
            stRotation : undefined,
            height : undefined,
            granularity : undefined,
            extrudedHeight : undefined,
            shadowVolume: undefined,
            offsetAttribute: undefined
        };

        /**
         * Retrieves an instance from a packed array.
         *
         * @param {Number[]} array The packed array.
         * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
         * @param {EllipseGeometry} [result] The object into which to store the result.
         * @returns {EllipseGeometry} The modified result parameter or a new EllipseGeometry instance if one was not provided.
         */
        EllipseGeometry.unpack = function(array, startingIndex, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('array', array);
            //>>includeEnd('debug');

            startingIndex = when.defaultValue(startingIndex, 0);

            var center = Cartographic.Cartesian3.unpack(array, startingIndex, scratchCenter);
            startingIndex += Cartographic.Cartesian3.packedLength;

            var ellipsoid = Cartesian2.Ellipsoid.unpack(array, startingIndex, scratchEllipsoid);
            startingIndex += Cartesian2.Ellipsoid.packedLength;

            var vertexFormat = VertexFormat.VertexFormat.unpack(array, startingIndex, scratchVertexFormat);
            startingIndex += VertexFormat.VertexFormat.packedLength;

            var semiMajorAxis = array[startingIndex++];
            var semiMinorAxis = array[startingIndex++];
            var rotation = array[startingIndex++];
            var stRotation = array[startingIndex++];
            var height = array[startingIndex++];
            var granularity = array[startingIndex++];
            var extrudedHeight = array[startingIndex++];
            var shadowVolume = array[startingIndex++] === 1.0;
            var offsetAttribute = array[startingIndex];

            if (!when.defined(result)) {
                scratchOptions.height = height;
                scratchOptions.extrudedHeight = extrudedHeight;
                scratchOptions.granularity = granularity;
                scratchOptions.stRotation = stRotation;
                scratchOptions.rotation = rotation;
                scratchOptions.semiMajorAxis = semiMajorAxis;
                scratchOptions.semiMinorAxis = semiMinorAxis;
                scratchOptions.shadowVolume = shadowVolume;
                scratchOptions.offsetAttribute = offsetAttribute === -1 ? undefined : offsetAttribute;

                return new EllipseGeometry(scratchOptions);
            }

            result._center = Cartographic.Cartesian3.clone(center, result._center);
            result._ellipsoid = Cartesian2.Ellipsoid.clone(ellipsoid, result._ellipsoid);
            result._vertexFormat = VertexFormat.VertexFormat.clone(vertexFormat, result._vertexFormat);
            result._semiMajorAxis = semiMajorAxis;
            result._semiMinorAxis = semiMinorAxis;
            result._rotation = rotation;
            result._stRotation = stRotation;
            result._height = height;
            result._granularity = granularity;
            result._extrudedHeight = extrudedHeight;
            result._shadowVolume = shadowVolume;
            result._offsetAttribute = offsetAttribute === -1 ? undefined : offsetAttribute;

            return result;
        };

        /**
         * Computes the bounding rectangle based on the provided options
         *
         * @param {Object} options Object with the following properties:
         * @param {Cartesian3} options.center The ellipse's center point in the fixed frame.
         * @param {Number} options.semiMajorAxis The length of the ellipse's semi-major axis in meters.
         * @param {Number} options.semiMinorAxis The length of the ellipse's semi-minor axis in meters.
         * @param {Ellipsoid} [options.ellipsoid=Ellipsoid.WGS84] The ellipsoid the ellipse will be on.
         * @param {Number} [options.rotation=0.0] The angle of rotation counter-clockwise from north.
         * @param {Number} [options.granularity=CesiumMath.RADIANS_PER_DEGREE] The angular distance between points on the ellipse in radians.
         * @param {Rectangle} [result] An object in which to store the result
         *
         * @returns {Rectangle} The result rectangle
         */
        EllipseGeometry.computeRectangle = function(options, result) {
            options = when.defaultValue(options, when.defaultValue.EMPTY_OBJECT);

            var center = options.center;
            var ellipsoid = when.defaultValue(options.ellipsoid, Cartesian2.Ellipsoid.WGS84);
            var semiMajorAxis = options.semiMajorAxis;
            var semiMinorAxis = options.semiMinorAxis;
            var granularity = when.defaultValue(options.granularity, _Math.CesiumMath.RADIANS_PER_DEGREE);
            var rotation = when.defaultValue(options.rotation, 0.0);

            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('options.center', center);
            Check.Check.typeOf.number('options.semiMajorAxis', semiMajorAxis);
            Check.Check.typeOf.number('options.semiMinorAxis', semiMinorAxis);
            if (semiMajorAxis < semiMinorAxis) {
                throw new Check.DeveloperError('semiMajorAxis must be greater than or equal to the semiMinorAxis.');
            }
            if (granularity <= 0.0) {
                throw new Check.DeveloperError('granularity must be greater than zero.');
            }
            //>>includeEnd('debug');

            return computeRectangle(center, semiMajorAxis, semiMinorAxis, rotation, granularity, ellipsoid, result);
        };

        /**
         * Computes the geometric representation of a ellipse on an ellipsoid, including its vertices, indices, and a bounding sphere.
         *
         * @param {EllipseGeometry} ellipseGeometry A description of the ellipse.
         * @returns {Geometry|undefined} The computed vertices and indices.
         */
        EllipseGeometry.createGeometry = function(ellipseGeometry) {
            if ((ellipseGeometry._semiMajorAxis <= 0.0) || (ellipseGeometry._semiMinorAxis <= 0.0)) {
                return;
            }

            var height = ellipseGeometry._height;
            var extrudedHeight = ellipseGeometry._extrudedHeight;
            var extrude = !_Math.CesiumMath.equalsEpsilon(height, extrudedHeight, 0, _Math.CesiumMath.EPSILON2);

            ellipseGeometry._center = ellipseGeometry._ellipsoid.scaleToGeodeticSurface(ellipseGeometry._center, ellipseGeometry._center);
            var options = {
                center : ellipseGeometry._center,
                semiMajorAxis : ellipseGeometry._semiMajorAxis,
                semiMinorAxis : ellipseGeometry._semiMinorAxis,
                ellipsoid : ellipseGeometry._ellipsoid,
                rotation : ellipseGeometry._rotation,
                height : height,
                granularity : ellipseGeometry._granularity,
                vertexFormat : ellipseGeometry._vertexFormat,
                stRotation : ellipseGeometry._stRotation
            };
            var geometry;
            if (extrude) {
                options.extrudedHeight = extrudedHeight;
                options.shadowVolume = ellipseGeometry._shadowVolume;
                options.offsetAttribute = ellipseGeometry._offsetAttribute;
                geometry = computeExtrudedEllipse(options);
            } else {
                geometry = computeEllipse(options);

                if (when.defined(ellipseGeometry._offsetAttribute)) {
                    var length = geometry.attributes.position.values.length;
                    var applyOffset = new Uint8Array(length / 3);
                    var offsetValue = ellipseGeometry._offsetAttribute === GeometryOffsetAttribute.GeometryOffsetAttribute.NONE ? 0 : 1;
                    GeometryOffsetAttribute.arrayFill(applyOffset, offsetValue);
                    geometry.attributes.applyOffset = new GeometryAttribute.GeometryAttribute({
                        componentDatatype : ComponentDatatype.ComponentDatatype.UNSIGNED_BYTE,
                        componentsPerAttribute : 1,
                        values: applyOffset
                    });
                }
            }

            return new GeometryAttribute.Geometry({
                attributes : geometry.attributes,
                indices : geometry.indices,
                primitiveType : PrimitiveType.PrimitiveType.TRIANGLES,
                boundingSphere : geometry.boundingSphere,
                offsetAttribute : ellipseGeometry._offsetAttribute
            });
        };

        /**
         * @private
         */
        EllipseGeometry.createShadowVolume = function(ellipseGeometry, minHeightFunc, maxHeightFunc) {
            var granularity = ellipseGeometry._granularity;
            var ellipsoid = ellipseGeometry._ellipsoid;

            var minHeight = minHeightFunc(granularity, ellipsoid);
            var maxHeight = maxHeightFunc(granularity, ellipsoid);

            return new EllipseGeometry({
                center : ellipseGeometry._center,
                semiMajorAxis : ellipseGeometry._semiMajorAxis,
                semiMinorAxis : ellipseGeometry._semiMinorAxis,
                ellipsoid : ellipsoid,
                rotation : ellipseGeometry._rotation,
                stRotation : ellipseGeometry._stRotation,
                granularity : granularity,
                extrudedHeight : minHeight,
                height : maxHeight,
                vertexFormat : VertexFormat.VertexFormat.POSITION_ONLY,
                shadowVolume: true
            });
        };

        function textureCoordinateRotationPoints(ellipseGeometry) {
            var stRotation = -ellipseGeometry._stRotation;
            if (stRotation === 0.0) {
                return [0, 0, 0, 1, 1, 0];
            }

            var cep = EllipseGeometryLibrary.EllipseGeometryLibrary.computeEllipsePositions({
                center : ellipseGeometry._center,
                semiMajorAxis : ellipseGeometry._semiMajorAxis,
                semiMinorAxis : ellipseGeometry._semiMinorAxis,
                rotation : ellipseGeometry._rotation,
                granularity : ellipseGeometry._granularity
            }, false, true);
            var positionsFlat = cep.outerPositions;
            var positionsCount = positionsFlat.length / 3;
            var positions = new Array(positionsCount);
            for (var i = 0; i < positionsCount; ++i) {
                positions[i] = Cartographic.Cartesian3.fromArray(positionsFlat, i * 3);
            }

            var ellipsoid = ellipseGeometry._ellipsoid;
            var boundingRectangle = ellipseGeometry.rectangle;
            return GeometryAttribute.Geometry._textureCoordinateRotationPoints(positions, stRotation, ellipsoid, boundingRectangle);
        }

        Object.defineProperties(EllipseGeometry.prototype, {
            /**
             * @private
             */
            rectangle : {
                get : function() {
                    if (!when.defined(this._rectangle)) {
                        this._rectangle = computeRectangle(this._center, this._semiMajorAxis, this._semiMinorAxis, this._rotation, this._granularity, this._ellipsoid);
                    }
                    return this._rectangle;
                }
            },
            /**
             * For remapping texture coordinates when rendering EllipseGeometries as GroundPrimitives.
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

    exports.EllipseGeometry = EllipseGeometry;

});

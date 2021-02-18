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
define(['./when-8d13db60', './Check-70bec281', './Math-61ede240', './Cartographic-fe4be337', './Cartesian2-85064f09', './BoundingSphere-775c5788', './Cartesian4-5af5bb24', './RuntimeError-ba10bc3e', './WebGLConstants-4c11ee5f', './ComponentDatatype-5862616f', './GeometryAttribute-06d31d45', './PrimitiveType-97893bc7', './FeatureDetection-7bd32c34', './Transforms-913163ed', './buildModuleUrl-9d43158d', './GeometryAttributes-aacecde6', './AttributeCompression-84a90a13', './GeometryPipeline-f6e7a4ed', './EncodedCartesian3-a569cba8', './IndexDatatype-9435b55f', './IntersectionTests-397d9494', './Plane-8390418f', './GeometryOffsetAttribute-ca302482', './VertexFormat-fe4db402', './GeometryInstance-93a01b5d', './EllipsoidRhumbLine-f161e674', './earcut-2.2.1-b404d9e6', './PolygonPipeline-62047934', './RectangleGeometryLibrary-430d6a29'], function (when, Check, _Math, Cartographic, Cartesian2, BoundingSphere, Cartesian4, RuntimeError, WebGLConstants, ComponentDatatype, GeometryAttribute, PrimitiveType, FeatureDetection, Transforms, buildModuleUrl, GeometryAttributes, AttributeCompression, GeometryPipeline, EncodedCartesian3, IndexDatatype, IntersectionTests, Plane, GeometryOffsetAttribute, VertexFormat, GeometryInstance, EllipsoidRhumbLine, earcut2_2_1, PolygonPipeline, RectangleGeometryLibrary) { 'use strict';

    var positionScratch = new Cartographic.Cartesian3();
        var normalScratch = new Cartographic.Cartesian3();
        var tangentScratch = new Cartographic.Cartesian3();
        var bitangentScratch = new Cartographic.Cartesian3();
        var rectangleScratch = new Cartesian2.Rectangle();
        var stScratch = new Cartesian2.Cartesian2();
        var bottomBoundingSphere = new BoundingSphere.BoundingSphere();
        var topBoundingSphere = new BoundingSphere.BoundingSphere();

        function createAttributes(vertexFormat, attributes) {
            var geo = new GeometryAttribute.Geometry({
                attributes : new GeometryAttributes.GeometryAttributes(),
                primitiveType : PrimitiveType.PrimitiveType.TRIANGLES
            });

            geo.attributes.position = new GeometryAttribute.GeometryAttribute({
                componentDatatype : ComponentDatatype.ComponentDatatype.DOUBLE,
                componentsPerAttribute : 3,
                values : attributes.positions
            });
            if (vertexFormat.normal) {
                geo.attributes.normal = new GeometryAttribute.GeometryAttribute({
                    componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
                    componentsPerAttribute : 3,
                    values : attributes.normals
                });
            }
            if (vertexFormat.tangent) {
                geo.attributes.tangent = new GeometryAttribute.GeometryAttribute({
                    componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
                    componentsPerAttribute : 3,
                    values : attributes.tangents
                });
            }
            if (vertexFormat.bitangent) {
                geo.attributes.bitangent = new GeometryAttribute.GeometryAttribute({
                    componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
                    componentsPerAttribute : 3,
                    values : attributes.bitangents
                });
            }
            return geo;
        }

        function calculateAttributes(positions, vertexFormat, ellipsoid, tangentRotationMatrix) {
            var length = positions.length;

            var normals = (vertexFormat.normal) ? new Float32Array(length) : undefined;
            var tangents = (vertexFormat.tangent) ? new Float32Array(length) : undefined;
            var bitangents = (vertexFormat.bitangent) ? new Float32Array(length) : undefined;

            var attrIndex = 0;
            var bitangent = bitangentScratch;
            var tangent = tangentScratch;
            var normal = normalScratch;
            if (vertexFormat.normal || vertexFormat.tangent || vertexFormat.bitangent) {
                for (var i = 0; i < length; i += 3) {
                    var p = Cartographic.Cartesian3.fromArray(positions, i, positionScratch);
                    var attrIndex1 = attrIndex + 1;
                    var attrIndex2 = attrIndex + 2;

                    normal = ellipsoid.geodeticSurfaceNormal(p, normal);
                    if (vertexFormat.tangent || vertexFormat.bitangent) {
                        Cartographic.Cartesian3.cross(Cartographic.Cartesian3.UNIT_Z, normal, tangent);
                        BoundingSphere.Matrix3.multiplyByVector(tangentRotationMatrix, tangent, tangent);
                        Cartographic.Cartesian3.normalize(tangent, tangent);

                        if (vertexFormat.bitangent) {
                            Cartographic.Cartesian3.normalize(Cartographic.Cartesian3.cross(normal, tangent, bitangent), bitangent);
                        }
                    }

                    if (vertexFormat.normal) {
                        normals[attrIndex] = normal.x;
                        normals[attrIndex1] = normal.y;
                        normals[attrIndex2] = normal.z;
                    }
                    if (vertexFormat.tangent) {
                        tangents[attrIndex] = tangent.x;
                        tangents[attrIndex1] = tangent.y;
                        tangents[attrIndex2] = tangent.z;
                    }
                    if (vertexFormat.bitangent) {
                        bitangents[attrIndex] = bitangent.x;
                        bitangents[attrIndex1] = bitangent.y;
                        bitangents[attrIndex2] = bitangent.z;
                    }
                    attrIndex += 3;
                }
            }
            return createAttributes(vertexFormat, {
                positions : positions,
                normals : normals,
                tangents : tangents,
                bitangents : bitangents
            });
        }

        var v1Scratch = new Cartographic.Cartesian3();
        var v2Scratch = new Cartographic.Cartesian3();

        function calculateAttributesWall(positions, vertexFormat, ellipsoid) {
            var length = positions.length;

            var normals = (vertexFormat.normal) ? new Float32Array(length) : undefined;
            var tangents = (vertexFormat.tangent) ? new Float32Array(length) : undefined;
            var bitangents = (vertexFormat.bitangent) ? new Float32Array(length) : undefined;

            var normalIndex = 0;
            var tangentIndex = 0;
            var bitangentIndex = 0;
            var recomputeNormal = true;

            var bitangent = bitangentScratch;
            var tangent = tangentScratch;
            var normal = normalScratch;
            if (vertexFormat.normal || vertexFormat.tangent || vertexFormat.bitangent) {
                for (var i = 0; i < length; i += 6) {
                    var p = Cartographic.Cartesian3.fromArray(positions, i, positionScratch);
                    var p1 = Cartographic.Cartesian3.fromArray(positions, (i + 6) % length, v1Scratch);
                    if (recomputeNormal) {
                        var p2 = Cartographic.Cartesian3.fromArray(positions, (i + 3) % length, v2Scratch);
                        Cartographic.Cartesian3.subtract(p1, p, p1);
                        Cartographic.Cartesian3.subtract(p2, p, p2);
                        normal = Cartographic.Cartesian3.normalize(Cartographic.Cartesian3.cross(p2, p1, normal), normal);
                        recomputeNormal = false;
                    }

                    if (Cartographic.Cartesian3.equalsEpsilon(p1, p, _Math.CesiumMath.EPSILON10)) { // if we've reached a corner
                        recomputeNormal = true;
                    }

                    if (vertexFormat.tangent || vertexFormat.bitangent) {
                        bitangent = ellipsoid.geodeticSurfaceNormal(p, bitangent);
                        if (vertexFormat.tangent) {
                            tangent = Cartographic.Cartesian3.normalize(Cartographic.Cartesian3.cross(bitangent, normal, tangent), tangent);
                        }
                    }

                    if (vertexFormat.normal) {
                        normals[normalIndex++] = normal.x;
                        normals[normalIndex++] = normal.y;
                        normals[normalIndex++] = normal.z;
                        normals[normalIndex++] = normal.x;
                        normals[normalIndex++] = normal.y;
                        normals[normalIndex++] = normal.z;
                    }

                    if (vertexFormat.tangent) {
                        tangents[tangentIndex++] = tangent.x;
                        tangents[tangentIndex++] = tangent.y;
                        tangents[tangentIndex++] = tangent.z;
                        tangents[tangentIndex++] = tangent.x;
                        tangents[tangentIndex++] = tangent.y;
                        tangents[tangentIndex++] = tangent.z;
                    }

                    if (vertexFormat.bitangent) {
                        bitangents[bitangentIndex++] = bitangent.x;
                        bitangents[bitangentIndex++] = bitangent.y;
                        bitangents[bitangentIndex++] = bitangent.z;
                        bitangents[bitangentIndex++] = bitangent.x;
                        bitangents[bitangentIndex++] = bitangent.y;
                        bitangents[bitangentIndex++] = bitangent.z;
                    }
                }
            }

            return createAttributes(vertexFormat, {
                positions : positions,
                normals : normals,
                tangents : tangents,
                bitangents : bitangents
            });
        }

        function constructRectangle(rectangleGeometry, computedOptions) {
            var vertexFormat = rectangleGeometry._vertexFormat;
            var ellipsoid = rectangleGeometry._ellipsoid;
            var height = computedOptions.height;
            var width = computedOptions.width;
            var northCap = computedOptions.northCap;
            var southCap = computedOptions.southCap;

            var rowStart = 0;
            var rowEnd = height;
            var rowHeight = height;
            var size = 0;
            if (northCap) {
                rowStart = 1;
                rowHeight -= 1;
                size += 1;
            }
            if (southCap) {
                rowEnd -= 1;
                rowHeight -= 1;
                size += 1;
            }
            size += (width * rowHeight);

            var positions = (vertexFormat.position) ? new Float64Array(size * 3) : undefined;
            var textureCoordinates = (vertexFormat.st) ? new Float32Array(size * 2) : undefined;

            var posIndex = 0;
            var stIndex = 0;

            var position = positionScratch;
            var st = stScratch;

            var minX = Number.MAX_VALUE;
            var minY = Number.MAX_VALUE;
            var maxX = -Number.MAX_VALUE;
            var maxY = -Number.MAX_VALUE;

            for (var row = rowStart; row < rowEnd; ++row) {
                for (var col = 0; col < width; ++col) {
                    RectangleGeometryLibrary.RectangleGeometryLibrary.computePosition(computedOptions, ellipsoid, vertexFormat.st, row, col, position, st);

                    positions[posIndex++] = position.x;
                    positions[posIndex++] = position.y;
                    positions[posIndex++] = position.z;

                    if (vertexFormat.st) {
                        textureCoordinates[stIndex++] = st.x;
                        textureCoordinates[stIndex++] = st.y;

                        minX = Math.min(minX, st.x);
                        minY = Math.min(minY, st.y);
                        maxX = Math.max(maxX, st.x);
                        maxY = Math.max(maxY, st.y);
                    }
                }
            }
            if (northCap) {
                RectangleGeometryLibrary.RectangleGeometryLibrary.computePosition(computedOptions, ellipsoid, vertexFormat.st, 0, 0, position, st);

                positions[posIndex++] = position.x;
                positions[posIndex++] = position.y;
                positions[posIndex++] = position.z;

                if (vertexFormat.st) {
                    textureCoordinates[stIndex++] = st.x;
                    textureCoordinates[stIndex++] = st.y;

                    minX = st.x;
                    minY = st.y;
                    maxX = st.x;
                    maxY = st.y;
                }
            }
            if (southCap) {
                RectangleGeometryLibrary.RectangleGeometryLibrary.computePosition(computedOptions, ellipsoid, vertexFormat.st, height - 1, 0, position, st);

                positions[posIndex++] = position.x;
                positions[posIndex++] = position.y;
                positions[posIndex] = position.z;

                if (vertexFormat.st) {
                    textureCoordinates[stIndex++] = st.x;
                    textureCoordinates[stIndex] = st.y;

                    minX = Math.min(minX, st.x);
                    minY = Math.min(minY, st.y);
                    maxX = Math.max(maxX, st.x);
                    maxY = Math.max(maxY, st.y);
                }
            }

            if (vertexFormat.st && (minX < 0.0 || minY < 0.0 || maxX > 1.0 || maxY > 1.0)) {
                for (var k = 0; k < textureCoordinates.length; k += 2) {
                    textureCoordinates[k] = (textureCoordinates[k] - minX) / (maxX - minX);
                    textureCoordinates[k + 1] = (textureCoordinates[k + 1] - minY) / (maxY - minY);
                }
            }

            var geo = calculateAttributes(positions, vertexFormat, ellipsoid, computedOptions.tangentRotationMatrix);

            var indicesSize = 6 * (width - 1) * (rowHeight - 1);
            if (northCap) {
                indicesSize += 3 * (width - 1);
            }
            if (southCap) {
                indicesSize += 3 * (width - 1);
            }
            var indices = IndexDatatype.IndexDatatype.createTypedArray(size, indicesSize);
            var index = 0;
            var indicesIndex = 0;
            var i;
            for (i = 0; i < rowHeight - 1; ++i) {
                for (var j = 0; j < width - 1; ++j) {
                    var upperLeft = index;
                    var lowerLeft = upperLeft + width;
                    var lowerRight = lowerLeft + 1;
                    var upperRight = upperLeft + 1;
                    indices[indicesIndex++] = upperLeft;
                    indices[indicesIndex++] = lowerLeft;
                    indices[indicesIndex++] = upperRight;
                    indices[indicesIndex++] = upperRight;
                    indices[indicesIndex++] = lowerLeft;
                    indices[indicesIndex++] = lowerRight;
                    ++index;
                }
                ++index;
            }
            if (northCap || southCap) {
                var northIndex = size - 1;
                var southIndex = size - 1;
                if (northCap && southCap) {
                    northIndex = size - 2;
                }

                var p1;
                var p2;
                index = 0;

                if (northCap) {
                    for (i = 0; i < width - 1; i++) {
                        p1 = index;
                        p2 = p1 + 1;
                        indices[indicesIndex++] = northIndex;
                        indices[indicesIndex++] = p1;
                        indices[indicesIndex++] = p2;
                        ++index;
                    }
                }
                if (southCap) {
                    index = (rowHeight - 1) * (width);
                    for (i = 0; i < width - 1; i++) {
                        p1 = index;
                        p2 = p1 + 1;
                        indices[indicesIndex++] = p1;
                        indices[indicesIndex++] = southIndex;
                        indices[indicesIndex++] = p2;
                        ++index;
                    }
                }
            }

            geo.indices = indices;
            if (vertexFormat.st) {
                geo.attributes.st = new GeometryAttribute.GeometryAttribute({
                    componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
                    componentsPerAttribute : 2,
                    values : textureCoordinates
                });
            }

            return geo;
        }

        function addWallPositions(wallPositions, posIndex, i, topPositions, bottomPositions) {
            wallPositions[posIndex++] = topPositions[i];
            wallPositions[posIndex++] = topPositions[i + 1];
            wallPositions[posIndex++] = topPositions[i + 2];
            wallPositions[posIndex++] = bottomPositions[i];
            wallPositions[posIndex++] = bottomPositions[i + 1];
            wallPositions[posIndex] = bottomPositions[i + 2];
            return wallPositions;
        }

        function addWallTextureCoordinates(wallTextures, stIndex, i, st) {
            wallTextures[stIndex++] = st[i];
            wallTextures[stIndex++] = st[i + 1];
            wallTextures[stIndex++] = st[i];
            wallTextures[stIndex] = st[i + 1];
            return wallTextures;
        }

        var scratchVertexFormat = new VertexFormat.VertexFormat();

        function constructExtrudedRectangle(rectangleGeometry, computedOptions) {
            var shadowVolume = rectangleGeometry._shadowVolume;
            var offsetAttributeValue = rectangleGeometry._offsetAttribute;
            var vertexFormat = rectangleGeometry._vertexFormat;
            var minHeight = rectangleGeometry._extrudedHeight;
            var maxHeight = rectangleGeometry._surfaceHeight;
            var ellipsoid = rectangleGeometry._ellipsoid;

            var height = computedOptions.height;
            var width = computedOptions.width;

            var i;

            if (shadowVolume) {
                var newVertexFormat = VertexFormat.VertexFormat.clone(vertexFormat, scratchVertexFormat);
                newVertexFormat.normal = true;
                rectangleGeometry._vertexFormat = newVertexFormat;
            }

            var topBottomGeo = constructRectangle(rectangleGeometry, computedOptions);

            if (shadowVolume) {
                rectangleGeometry._vertexFormat = vertexFormat;
            }

            var topPositions = PolygonPipeline.PolygonPipeline.scaleToGeodeticHeight(topBottomGeo.attributes.position.values, maxHeight, ellipsoid, false);
            topPositions = new Float64Array(topPositions);
            var length = topPositions.length;
            var newLength = length * 2;
            var positions = new Float64Array(newLength);
            positions.set(topPositions);
            var bottomPositions = PolygonPipeline.PolygonPipeline.scaleToGeodeticHeight(topBottomGeo.attributes.position.values, minHeight, ellipsoid);
            positions.set(bottomPositions, length);
            topBottomGeo.attributes.position.values = positions;

            var normals = (vertexFormat.normal) ? new Float32Array(newLength) : undefined;
            var tangents = (vertexFormat.tangent) ? new Float32Array(newLength) : undefined;
            var bitangents = (vertexFormat.bitangent) ? new Float32Array(newLength) : undefined;
            var textures = (vertexFormat.st) ? new Float32Array(newLength / 3 * 2) : undefined;
            var topSt;
            var topNormals;
            if (vertexFormat.normal) {
                topNormals = topBottomGeo.attributes.normal.values;
                normals.set(topNormals);
                for (i = 0; i < length; i++) {
                    topNormals[i] = -topNormals[i];
                }
                normals.set(topNormals, length);
                topBottomGeo.attributes.normal.values = normals;
            }
            if (shadowVolume) {
                topNormals = topBottomGeo.attributes.normal.values;
                if (!vertexFormat.normal) {
                    topBottomGeo.attributes.normal = undefined;
                }
                var extrudeNormals = new Float32Array(newLength);
                for (i = 0; i < length; i++) {
                    topNormals[i] = -topNormals[i];
                }
                extrudeNormals.set(topNormals, length); //only get normals for bottom layer that's going to be pushed down
                topBottomGeo.attributes.extrudeDirection = new GeometryAttribute.GeometryAttribute({
                    componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
                    componentsPerAttribute : 3,
                    values : extrudeNormals
                });
            }

            var offsetValue;
            var hasOffsets = when.defined(offsetAttributeValue);
            if (hasOffsets) {
                var size = length / 3 * 2;
                var offsetAttribute = new Uint8Array(size);
                if (offsetAttributeValue === GeometryOffsetAttribute.GeometryOffsetAttribute.TOP) {
                    offsetAttribute = GeometryOffsetAttribute.arrayFill(offsetAttribute, 1, 0, size / 2);
                } else {
                    offsetValue = offsetAttributeValue === GeometryOffsetAttribute.GeometryOffsetAttribute.NONE ? 0 : 1;
                    offsetAttribute = GeometryOffsetAttribute.arrayFill(offsetAttribute, offsetValue);
                }

                topBottomGeo.attributes.applyOffset = new GeometryAttribute.GeometryAttribute({
                    componentDatatype : ComponentDatatype.ComponentDatatype.UNSIGNED_BYTE,
                    componentsPerAttribute : 1,
                    values : offsetAttribute
                });
            }

            if (vertexFormat.tangent) {
                var topTangents = topBottomGeo.attributes.tangent.values;
                tangents.set(topTangents);
                for (i = 0; i < length; i++) {
                    topTangents[i] = -topTangents[i];
                }
                tangents.set(topTangents, length);
                topBottomGeo.attributes.tangent.values = tangents;
            }
            if (vertexFormat.bitangent) {
                var topBitangents = topBottomGeo.attributes.bitangent.values;
                bitangents.set(topBitangents);
                bitangents.set(topBitangents, length);
                topBottomGeo.attributes.bitangent.values = bitangents;
            }
            if (vertexFormat.st) {
                topSt = topBottomGeo.attributes.st.values;
                textures.set(topSt);
                textures.set(topSt, length / 3 * 2);
                topBottomGeo.attributes.st.values = textures;
            }

            var indices = topBottomGeo.indices;
            var indicesLength = indices.length;
            var posLength = length / 3;
            var newIndices = IndexDatatype.IndexDatatype.createTypedArray(newLength / 3, indicesLength * 2);
            newIndices.set(indices);
            for (i = 0; i < indicesLength; i += 3) {
                newIndices[i + indicesLength] = indices[i + 2] + posLength;
                newIndices[i + 1 + indicesLength] = indices[i + 1] + posLength;
                newIndices[i + 2 + indicesLength] = indices[i] + posLength;
            }
            topBottomGeo.indices = newIndices;

            var northCap = computedOptions.northCap;
            var southCap = computedOptions.southCap;

            var rowHeight = height;
            var widthMultiplier = 2;
            var perimeterPositions = 0;
            var corners = 4;
            var dupliateCorners = 4;
            if (northCap) {
                widthMultiplier -= 1;
                rowHeight -= 1;
                perimeterPositions += 1;
                corners -= 2;
                dupliateCorners -= 1;
            }
            if (southCap) {
                widthMultiplier -= 1;
                rowHeight -= 1;
                perimeterPositions += 1;
                corners -= 2;
                dupliateCorners -= 1;
            }
            perimeterPositions += (widthMultiplier * width + 2 * rowHeight - corners);

            var wallCount = (perimeterPositions + dupliateCorners) * 2;

            var wallPositions = new Float64Array(wallCount * 3);
            var wallExtrudeNormals = shadowVolume ? new Float32Array(wallCount * 3) : undefined;
            var wallOffsetAttribute = hasOffsets ? new Uint8Array(wallCount) : undefined;
            var wallTextures = (vertexFormat.st) ? new Float32Array(wallCount * 2) : undefined;

            var computeTopOffsets = offsetAttributeValue === GeometryOffsetAttribute.GeometryOffsetAttribute.TOP;
            if (hasOffsets && !computeTopOffsets) {
                offsetValue = offsetAttributeValue === GeometryOffsetAttribute.GeometryOffsetAttribute.ALL ? 1 : 0;
                wallOffsetAttribute = GeometryOffsetAttribute.arrayFill(wallOffsetAttribute, offsetValue);
            }

            var posIndex = 0;
            var stIndex = 0;
            var extrudeNormalIndex = 0;
            var wallOffsetIndex = 0;
            var area = width * rowHeight;
            var threeI;
            for (i = 0; i < area; i += width) {
                threeI = i * 3;
                wallPositions = addWallPositions(wallPositions, posIndex, threeI, topPositions, bottomPositions);
                posIndex += 6;
                if (vertexFormat.st) {
                    wallTextures = addWallTextureCoordinates(wallTextures, stIndex, i * 2, topSt);
                    stIndex += 4;
                }
                if (shadowVolume) {
                    extrudeNormalIndex += 3;
                    wallExtrudeNormals[extrudeNormalIndex++] = topNormals[threeI];
                    wallExtrudeNormals[extrudeNormalIndex++] = topNormals[threeI + 1];
                    wallExtrudeNormals[extrudeNormalIndex++] = topNormals[threeI + 2];
                }
                if (computeTopOffsets) {
                    wallOffsetAttribute[wallOffsetIndex++] = 1;
                    wallOffsetIndex += 1;
                }
            }

            if (!southCap) {
                for (i = area - width; i < area; i++) {
                    threeI = i * 3;
                    wallPositions = addWallPositions(wallPositions, posIndex, threeI, topPositions, bottomPositions);
                    posIndex += 6;
                    if (vertexFormat.st) {
                        wallTextures = addWallTextureCoordinates(wallTextures, stIndex, i * 2, topSt);
                        stIndex += 4;
                    }
                    if (shadowVolume) {
                        extrudeNormalIndex += 3;
                        wallExtrudeNormals[extrudeNormalIndex++] = topNormals[threeI];
                        wallExtrudeNormals[extrudeNormalIndex++] = topNormals[threeI + 1];
                        wallExtrudeNormals[extrudeNormalIndex++] = topNormals[threeI + 2];
                    }
                    if (computeTopOffsets) {
                        wallOffsetAttribute[wallOffsetIndex++] = 1;
                        wallOffsetIndex += 1;
                    }
                }
            } else {
                var southIndex = northCap ? area + 1 : area;
                threeI = southIndex * 3;

                for (i = 0; i < 2; i++) { // duplicate corner points
                    wallPositions = addWallPositions(wallPositions, posIndex, threeI, topPositions, bottomPositions);
                    posIndex += 6;
                    if (vertexFormat.st) {
                        wallTextures = addWallTextureCoordinates(wallTextures, stIndex, southIndex * 2, topSt);
                        stIndex += 4;
                    }
                    if (shadowVolume) {
                        extrudeNormalIndex += 3;
                        wallExtrudeNormals[extrudeNormalIndex++] = topNormals[threeI];
                        wallExtrudeNormals[extrudeNormalIndex++] = topNormals[threeI + 1];
                        wallExtrudeNormals[extrudeNormalIndex++] = topNormals[threeI + 2];
                    }
                    if (computeTopOffsets) {
                        wallOffsetAttribute[wallOffsetIndex++] = 1;
                        wallOffsetIndex += 1;
                    }
                }
            }

            for (i = area - 1; i > 0; i -= width) {
                threeI = i * 3;
                wallPositions = addWallPositions(wallPositions, posIndex, threeI, topPositions, bottomPositions);
                posIndex += 6;
                if (vertexFormat.st) {
                    wallTextures = addWallTextureCoordinates(wallTextures, stIndex, i * 2, topSt);
                    stIndex += 4;
                }
                if (shadowVolume) {
                    extrudeNormalIndex += 3;
                    wallExtrudeNormals[extrudeNormalIndex++] = topNormals[threeI];
                    wallExtrudeNormals[extrudeNormalIndex++] = topNormals[threeI + 1];
                    wallExtrudeNormals[extrudeNormalIndex++] = topNormals[threeI + 2];
                }
                if (computeTopOffsets) {
                    wallOffsetAttribute[wallOffsetIndex++] = 1;
                    wallOffsetIndex += 1;
                }

            }

            if (!northCap) {
                for (i = width - 1; i >= 0; i--) {
                    threeI = i * 3;
                    wallPositions = addWallPositions(wallPositions, posIndex, threeI, topPositions, bottomPositions);
                    posIndex += 6;
                    if (vertexFormat.st) {
                        wallTextures = addWallTextureCoordinates(wallTextures, stIndex, i * 2, topSt);
                        stIndex += 4;
                    }
                    if (shadowVolume) {
                        extrudeNormalIndex += 3;
                        wallExtrudeNormals[extrudeNormalIndex++] = topNormals[threeI];
                        wallExtrudeNormals[extrudeNormalIndex++] = topNormals[threeI + 1];
                        wallExtrudeNormals[extrudeNormalIndex++] = topNormals[threeI + 2];
                    }
                    if (computeTopOffsets) {
                        wallOffsetAttribute[wallOffsetIndex++] = 1;
                        wallOffsetIndex += 1;
                    }
                }
            } else {
                var northIndex = area;
                threeI = northIndex * 3;

                for (i = 0; i < 2; i++) { // duplicate corner points
                    wallPositions = addWallPositions(wallPositions, posIndex, threeI, topPositions, bottomPositions);
                    posIndex += 6;
                    if (vertexFormat.st) {
                        wallTextures = addWallTextureCoordinates(wallTextures, stIndex, northIndex * 2, topSt);
                        stIndex += 4;
                    }
                    if (shadowVolume) {
                        extrudeNormalIndex += 3;
                        wallExtrudeNormals[extrudeNormalIndex++] = topNormals[threeI];
                        wallExtrudeNormals[extrudeNormalIndex++] = topNormals[threeI + 1];
                        wallExtrudeNormals[extrudeNormalIndex++] = topNormals[threeI + 2];
                    }
                    if (computeTopOffsets) {
                        wallOffsetAttribute[wallOffsetIndex++] = 1;
                        wallOffsetIndex += 1;
                    }
                }
            }

            var geo = calculateAttributesWall(wallPositions, vertexFormat, ellipsoid);

            if (vertexFormat.st) {
                geo.attributes.st = new GeometryAttribute.GeometryAttribute({
                    componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
                    componentsPerAttribute : 2,
                    values : wallTextures
                });
            }
            if (shadowVolume) {
                geo.attributes.extrudeDirection = new GeometryAttribute.GeometryAttribute({
                    componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
                    componentsPerAttribute : 3,
                    values : wallExtrudeNormals
                });
            }
            if (hasOffsets) {
                geo.attributes.applyOffset = new GeometryAttribute.GeometryAttribute({
                    componentDatatype : ComponentDatatype.ComponentDatatype.UNSIGNED_BYTE,
                    componentsPerAttribute : 1,
                    values : wallOffsetAttribute
                });
            }

            var wallIndices = IndexDatatype.IndexDatatype.createTypedArray(wallCount, perimeterPositions * 6);

            var upperLeft;
            var lowerLeft;
            var lowerRight;
            var upperRight;
            length = wallPositions.length / 3;
            var index = 0;
            for (i = 0; i < length - 1; i += 2) {
                upperLeft = i;
                upperRight = (upperLeft + 2) % length;
                var p1 = Cartographic.Cartesian3.fromArray(wallPositions, upperLeft * 3, v1Scratch);
                var p2 = Cartographic.Cartesian3.fromArray(wallPositions, upperRight * 3, v2Scratch);
                if (Cartographic.Cartesian3.equalsEpsilon(p1, p2, _Math.CesiumMath.EPSILON10)) {
                    continue;
                }
                lowerLeft = (upperLeft + 1) % length;
                lowerRight = (lowerLeft + 2) % length;
                wallIndices[index++] = upperLeft;
                wallIndices[index++] = lowerLeft;
                wallIndices[index++] = upperRight;
                wallIndices[index++] = upperRight;
                wallIndices[index++] = lowerLeft;
                wallIndices[index++] = lowerRight;
            }

            geo.indices = wallIndices;

            geo = GeometryPipeline.GeometryPipeline.combineInstances([
                new GeometryInstance.GeometryInstance({
                    geometry : topBottomGeo
                }),
                new GeometryInstance.GeometryInstance({
                    geometry : geo
                })
            ]);

            return geo[0];
        }

        var scratchRectanglePoints = [new Cartographic.Cartesian3(), new Cartographic.Cartesian3(), new Cartographic.Cartesian3(), new Cartographic.Cartesian3()];
        var nwScratch = new Cartographic.Cartographic();
        var stNwScratch = new Cartographic.Cartographic();
        function computeRectangle(rectangle, granularity, rotation, ellipsoid, result) {
            if (rotation === 0.0) {
                return Cartesian2.Rectangle.clone(rectangle, result);
            }

            var computedOptions = RectangleGeometryLibrary.RectangleGeometryLibrary.computeOptions(rectangle, granularity, rotation, 0, rectangleScratch, nwScratch);

            var height = computedOptions.height;
            var width = computedOptions.width;

            var positions = scratchRectanglePoints;
            RectangleGeometryLibrary.RectangleGeometryLibrary.computePosition(computedOptions, ellipsoid, false, 0, 0, positions[0]);
            RectangleGeometryLibrary.RectangleGeometryLibrary.computePosition(computedOptions, ellipsoid, false, 0, width - 1, positions[1]);
            RectangleGeometryLibrary.RectangleGeometryLibrary.computePosition(computedOptions, ellipsoid, false, height - 1, 0, positions[2]);
            RectangleGeometryLibrary.RectangleGeometryLibrary.computePosition(computedOptions, ellipsoid, false, height - 1, width - 1, positions[3]);

            return Cartesian2.Rectangle.fromCartesianArray(positions, ellipsoid, result);
        }

        /**
         * A description of a cartographic rectangle on an ellipsoid centered at the origin. Rectangle geometry can be rendered with both {@link Primitive} and {@link GroundPrimitive}.
         *
         * @alias RectangleGeometry
         * @constructor
         *
         * @param {Object} options Object with the following properties:
         * @param {Rectangle} options.rectangle A cartographic rectangle with north, south, east and west properties in radians.
         * @param {VertexFormat} [options.vertexFormat=VertexFormat.DEFAULT] The vertex attributes to be computed.
         * @param {Ellipsoid} [options.ellipsoid=Ellipsoid.WGS84] The ellipsoid on which the rectangle lies.
         * @param {Number} [options.granularity=CesiumMath.RADIANS_PER_DEGREE] The distance, in radians, between each latitude and longitude. Determines the number of positions in the buffer.
         * @param {Number} [options.height=0.0] The distance in meters between the rectangle and the ellipsoid surface.
         * @param {Number} [options.rotation=0.0] The rotation of the rectangle, in radians. A positive rotation is counter-clockwise.
         * @param {Number} [options.stRotation=0.0] The rotation of the texture coordinates, in radians. A positive rotation is counter-clockwise.
         * @param {Number} [options.extrudedHeight] The distance in meters between the rectangle's extruded face and the ellipsoid surface.
         *
         * @exception {DeveloperError} <code>options.rectangle.north</code> must be in the interval [<code>-Pi/2</code>, <code>Pi/2</code>].
         * @exception {DeveloperError} <code>options.rectangle.south</code> must be in the interval [<code>-Pi/2</code>, <code>Pi/2</code>].
         * @exception {DeveloperError} <code>options.rectangle.east</code> must be in the interval [<code>-Pi</code>, <code>Pi</code>].
         * @exception {DeveloperError} <code>options.rectangle.west</code> must be in the interval [<code>-Pi</code>, <code>Pi</code>].
         * @exception {DeveloperError} <code>options.rectangle.north</code> must be greater than <code>options.rectangle.south</code>.
         *
         * @see RectangleGeometry#createGeometry
         *
         * @demo {@link https://sandcastle.cesium.com/index.html?src=Rectangle.html|Cesium Sandcastle Rectangle Demo}
         *
         * @example
         * // 1. create a rectangle
         * var rectangle = new Cesium.RectangleGeometry({
         *   ellipsoid : Cesium.Ellipsoid.WGS84,
         *   rectangle : Cesium.Rectangle.fromDegrees(-80.0, 39.0, -74.0, 42.0),
         *   height : 10000.0
         * });
         * var geometry = Cesium.RectangleGeometry.createGeometry(rectangle);
         *
         * // 2. create an extruded rectangle without a top
         * var rectangle = new Cesium.RectangleGeometry({
         *   ellipsoid : Cesium.Ellipsoid.WGS84,
         *   rectangle : Cesium.Rectangle.fromDegrees(-80.0, 39.0, -74.0, 42.0),
         *   height : 10000.0,
         *   extrudedHeight: 300000
         * });
         * var geometry = Cesium.RectangleGeometry.createGeometry(rectangle);
         */
        function RectangleGeometry(options) {
            options = when.defaultValue(options, when.defaultValue.EMPTY_OBJECT);

            var rectangle = options.rectangle;

            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('rectangle', rectangle);
            Cartesian2.Rectangle.validate(rectangle);
            if (rectangle.north < rectangle.south) {
                throw new Check.DeveloperError('options.rectangle.north must be greater than or equal to options.rectangle.south');
            }
            //>>includeEnd('debug');

            var height = when.defaultValue(options.height, 0.0);
            var extrudedHeight = when.defaultValue(options.extrudedHeight, height);

            this._rectangle = Cartesian2.Rectangle.clone(rectangle);
            this._granularity = when.defaultValue(options.granularity, _Math.CesiumMath.RADIANS_PER_DEGREE);
            this._ellipsoid = Cartesian2.Ellipsoid.clone(when.defaultValue(options.ellipsoid, Cartesian2.Ellipsoid.WGS84));
            this._surfaceHeight = Math.max(height, extrudedHeight);
            this._rotation = when.defaultValue(options.rotation, 0.0);
            this._stRotation = when.defaultValue(options.stRotation, 0.0);
            this._vertexFormat = VertexFormat.VertexFormat.clone(when.defaultValue(options.vertexFormat, VertexFormat.VertexFormat.DEFAULT));
            this._extrudedHeight = Math.min(height, extrudedHeight);
            this._shadowVolume = when.defaultValue(options.shadowVolume, false);
            this._workerName = 'createRectangleGeometry';
            this._offsetAttribute = options.offsetAttribute;
            this._rotatedRectangle = undefined;

            this._textureCoordinateRotationPoints = undefined;
        }

        /**
         * The number of elements used to pack the object into an array.
         * @type {Number}
         */
        RectangleGeometry.packedLength = Cartesian2.Rectangle.packedLength + Cartesian2.Ellipsoid.packedLength + VertexFormat.VertexFormat.packedLength + 7;

        /**
         * Stores the provided instance into the provided array.
         *
         * @param {RectangleGeometry} value The value to pack.
         * @param {Number[]} array The array to pack into.
         * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
         *
         * @returns {Number[]} The array that was packed into
         */
        RectangleGeometry.pack = function(value, array, startingIndex) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('value', value);
            Check.Check.defined('array', array);
            //>>includeEnd('debug');

            startingIndex = when.defaultValue(startingIndex, 0);

            Cartesian2.Rectangle.pack(value._rectangle, array, startingIndex);
            startingIndex += Cartesian2.Rectangle.packedLength;

            Cartesian2.Ellipsoid.pack(value._ellipsoid, array, startingIndex);
            startingIndex += Cartesian2.Ellipsoid.packedLength;

            VertexFormat.VertexFormat.pack(value._vertexFormat, array, startingIndex);
            startingIndex += VertexFormat.VertexFormat.packedLength;

            array[startingIndex++] = value._granularity;
            array[startingIndex++] = value._surfaceHeight;
            array[startingIndex++] = value._rotation;
            array[startingIndex++] = value._stRotation;
            array[startingIndex++] = value._extrudedHeight;
            array[startingIndex++] = value._shadowVolume ? 1.0 : 0.0;
            array[startingIndex] = when.defaultValue(value._offsetAttribute, -1);

            return array;
        };

        var scratchRectangle = new Cartesian2.Rectangle();
        var scratchEllipsoid = Cartesian2.Ellipsoid.clone(Cartesian2.Ellipsoid.UNIT_SPHERE);
        var scratchOptions = {
            rectangle : scratchRectangle,
            ellipsoid : scratchEllipsoid,
            vertexFormat : scratchVertexFormat,
            granularity : undefined,
            height : undefined,
            rotation : undefined,
            stRotation : undefined,
            extrudedHeight : undefined,
            shadowVolume : undefined,
            offsetAttribute: undefined
        };

        /**
         * Retrieves an instance from a packed array.
         *
         * @param {Number[]} array The packed array.
         * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
         * @param {RectangleGeometry} [result] The object into which to store the result.
         * @returns {RectangleGeometry} The modified result parameter or a new RectangleGeometry instance if one was not provided.
         */
        RectangleGeometry.unpack = function(array, startingIndex, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('array', array);
            //>>includeEnd('debug');

            startingIndex = when.defaultValue(startingIndex, 0);

            var rectangle = Cartesian2.Rectangle.unpack(array, startingIndex, scratchRectangle);
            startingIndex += Cartesian2.Rectangle.packedLength;

            var ellipsoid = Cartesian2.Ellipsoid.unpack(array, startingIndex, scratchEllipsoid);
            startingIndex += Cartesian2.Ellipsoid.packedLength;

            var vertexFormat = VertexFormat.VertexFormat.unpack(array, startingIndex, scratchVertexFormat);
            startingIndex += VertexFormat.VertexFormat.packedLength;

            var granularity = array[startingIndex++];
            var surfaceHeight = array[startingIndex++];
            var rotation = array[startingIndex++];
            var stRotation = array[startingIndex++];
            var extrudedHeight = array[startingIndex++];
            var shadowVolume = array[startingIndex++] === 1.0;
            var offsetAttribute = array[startingIndex];

            if (!when.defined(result)) {
                scratchOptions.granularity = granularity;
                scratchOptions.height = surfaceHeight;
                scratchOptions.rotation = rotation;
                scratchOptions.stRotation = stRotation;
                scratchOptions.extrudedHeight = extrudedHeight;
                scratchOptions.shadowVolume = shadowVolume;
                scratchOptions.offsetAttribute = offsetAttribute === -1 ? undefined : offsetAttribute;

                return new RectangleGeometry(scratchOptions);
            }

            result._rectangle = Cartesian2.Rectangle.clone(rectangle, result._rectangle);
            result._ellipsoid = Cartesian2.Ellipsoid.clone(ellipsoid, result._ellipsoid);
            result._vertexFormat = VertexFormat.VertexFormat.clone(vertexFormat, result._vertexFormat);
            result._granularity = granularity;
            result._surfaceHeight = surfaceHeight;
            result._rotation = rotation;
            result._stRotation = stRotation;
            result._extrudedHeight = extrudedHeight;
            result._shadowVolume = shadowVolume;
            result._offsetAttribute = offsetAttribute === -1 ? undefined : offsetAttribute;

            return result;
        };

        /**
         * Computes the bounding rectangle based on the provided options
         *
         * @param {Object} options Object with the following properties:
         * @param {Rectangle} options.rectangle A cartographic rectangle with north, south, east and west properties in radians.
         * @param {Ellipsoid} [options.ellipsoid=Ellipsoid.WGS84] The ellipsoid on which the rectangle lies.
         * @param {Number} [options.granularity=CesiumMath.RADIANS_PER_DEGREE] The distance, in radians, between each latitude and longitude. Determines the number of positions in the buffer.
         * @param {Number} [options.rotation=0.0] The rotation of the rectangle, in radians. A positive rotation is counter-clockwise.
         * @param {Rectangle} [result] An object in which to store the result.
         *
         * @returns {Rectangle} The result rectangle
         */
        RectangleGeometry.computeRectangle = function(options, result) {
            options = when.defaultValue(options, when.defaultValue.EMPTY_OBJECT);

            var rectangle = options.rectangle;

            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('rectangle', rectangle);
            Cartesian2.Rectangle.validate(rectangle);
            if (rectangle.north < rectangle.south) {
                throw new Check.DeveloperError('options.rectangle.north must be greater than or equal to options.rectangle.south');
            }
            //>>includeEnd('debug');

            var granularity = when.defaultValue(options.granularity, _Math.CesiumMath.RADIANS_PER_DEGREE);
            var ellipsoid = when.defaultValue(options.ellipsoid, Cartesian2.Ellipsoid.WGS84);
            var rotation = when.defaultValue(options.rotation, 0.0);

            return computeRectangle(rectangle, granularity, rotation, ellipsoid, result);
        };

        var tangentRotationMatrixScratch = new BoundingSphere.Matrix3();
        var quaternionScratch = new Transforms.Quaternion();
        var centerScratch = new Cartographic.Cartographic();
        /**
         * Computes the geometric representation of a rectangle, including its vertices, indices, and a bounding sphere.
         *
         * @param {RectangleGeometry} rectangleGeometry A description of the rectangle.
         * @returns {Geometry|undefined} The computed vertices and indices.
         *
         * @exception {DeveloperError} Rotated rectangle is invalid.
         */
        RectangleGeometry.createGeometry = function(rectangleGeometry) {
            if ((_Math.CesiumMath.equalsEpsilon(rectangleGeometry._rectangle.north, rectangleGeometry._rectangle.south, _Math.CesiumMath.EPSILON10) ||
                 (_Math.CesiumMath.equalsEpsilon(rectangleGeometry._rectangle.east, rectangleGeometry._rectangle.west, _Math.CesiumMath.EPSILON10)))) {
                return undefined;
            }

            var rectangle = rectangleGeometry._rectangle;
            var ellipsoid = rectangleGeometry._ellipsoid;
            var rotation = rectangleGeometry._rotation;
            var stRotation = rectangleGeometry._stRotation;
            var vertexFormat = rectangleGeometry._vertexFormat;

            var computedOptions = RectangleGeometryLibrary.RectangleGeometryLibrary.computeOptions(rectangle, rectangleGeometry._granularity, rotation, stRotation, rectangleScratch, nwScratch, stNwScratch);

            var tangentRotationMatrix = tangentRotationMatrixScratch;
            if (stRotation !== 0 || rotation !== 0) {
                var center = Cartesian2.Rectangle.center(rectangle, centerScratch);
                var axis = ellipsoid.geodeticSurfaceNormalCartographic(center, v1Scratch);
                Transforms.Quaternion.fromAxisAngle(axis, -stRotation, quaternionScratch);
                BoundingSphere.Matrix3.fromQuaternion(quaternionScratch, tangentRotationMatrix);
            } else {
                BoundingSphere.Matrix3.clone(BoundingSphere.Matrix3.IDENTITY, tangentRotationMatrix);
            }

            var surfaceHeight = rectangleGeometry._surfaceHeight;
            var extrudedHeight = rectangleGeometry._extrudedHeight;
            var extrude = !_Math.CesiumMath.equalsEpsilon(surfaceHeight, extrudedHeight, 0, _Math.CesiumMath.EPSILON2);

            computedOptions.lonScalar = 1.0 / rectangleGeometry._rectangle.width;
            computedOptions.latScalar = 1.0 / rectangleGeometry._rectangle.height;
            computedOptions.tangentRotationMatrix = tangentRotationMatrix;

            var geometry;
            var boundingSphere;
            rectangle = rectangleGeometry._rectangle;
            if (extrude) {
                geometry = constructExtrudedRectangle(rectangleGeometry, computedOptions);
                var topBS = BoundingSphere.BoundingSphere.fromRectangle3D(rectangle, ellipsoid, surfaceHeight, topBoundingSphere);
                var bottomBS = BoundingSphere.BoundingSphere.fromRectangle3D(rectangle, ellipsoid, extrudedHeight, bottomBoundingSphere);
                boundingSphere = BoundingSphere.BoundingSphere.union(topBS, bottomBS);
            } else {
                geometry = constructRectangle(rectangleGeometry, computedOptions);
                geometry.attributes.position.values = PolygonPipeline.PolygonPipeline.scaleToGeodeticHeight(geometry.attributes.position.values, surfaceHeight, ellipsoid, false);

                if (when.defined(rectangleGeometry._offsetAttribute)) {
                    var length = geometry.attributes.position.values.length;
                    var applyOffset = new Uint8Array(length / 3);
                    var offsetValue = rectangleGeometry._offsetAttribute === GeometryOffsetAttribute.GeometryOffsetAttribute.NONE ? 0 : 1;
                    GeometryOffsetAttribute.arrayFill(applyOffset, offsetValue);
                    geometry.attributes.applyOffset = new GeometryAttribute.GeometryAttribute({
                        componentDatatype : ComponentDatatype.ComponentDatatype.UNSIGNED_BYTE,
                        componentsPerAttribute : 1,
                        values: applyOffset
                    });
                }

                boundingSphere = BoundingSphere.BoundingSphere.fromRectangle3D(rectangle, ellipsoid, surfaceHeight);
            }

            if (!vertexFormat.position) {
                delete geometry.attributes.position;
            }

            return new GeometryAttribute.Geometry({
                attributes : geometry.attributes,
                indices : geometry.indices,
                primitiveType : geometry.primitiveType,
                boundingSphere : boundingSphere,
                offsetAttribute : rectangleGeometry._offsetAttribute
            });
        };

        /**
         * @private
         */
        RectangleGeometry.createShadowVolume = function(rectangleGeometry, minHeightFunc, maxHeightFunc) {
            var granularity = rectangleGeometry._granularity;
            var ellipsoid = rectangleGeometry._ellipsoid;

            var minHeight = minHeightFunc(granularity, ellipsoid);
            var maxHeight = maxHeightFunc(granularity, ellipsoid);

            return new RectangleGeometry({
                rectangle : rectangleGeometry._rectangle,
                rotation : rectangleGeometry._rotation,
                ellipsoid : ellipsoid,
                stRotation : rectangleGeometry._stRotation,
                granularity : granularity,
                extrudedHeight : maxHeight,
                height : minHeight,
                vertexFormat : VertexFormat.VertexFormat.POSITION_ONLY,
                shadowVolume : true
            });
        };

        var unrotatedTextureRectangleScratch = new Cartesian2.Rectangle();
        var points2DScratch = [new Cartesian2.Cartesian2(), new Cartesian2.Cartesian2(), new Cartesian2.Cartesian2()];
        var rotation2DScratch = new GeometryAttribute.Matrix2();
        var rectangleCenterScratch = new Cartographic.Cartographic();

        function textureCoordinateRotationPoints(rectangleGeometry) {
            if (rectangleGeometry._stRotation === 0.0) {
                return [0, 0, 0, 1, 1, 0];
            }

            var rectangle = Cartesian2.Rectangle.clone(rectangleGeometry._rectangle, unrotatedTextureRectangleScratch);
            var granularity = rectangleGeometry._granularity;
            var ellipsoid = rectangleGeometry._ellipsoid;

            // Rotate to align the texture coordinates with ENU
            var rotation = rectangleGeometry._rotation - rectangleGeometry._stRotation;

            var unrotatedTextureRectangle = computeRectangle(rectangle, granularity, rotation, ellipsoid, unrotatedTextureRectangleScratch);

            // Assume a computed "east-north" texture coordinate system based on spherical or planar tricks, bounded by `boundingRectangle`.
            // The "desired" texture coordinate system forms an oriented rectangle (un-oriented computed) around the geometry that completely and tightly bounds it.
            // We want to map from the "east-north" texture coordinate system into the "desired" system using a pair of lines (analagous planes in 2D)
            // Compute 3 corners of the "desired" texture coordinate system in "east-north" texture space by the following in cartographic space:
            // - rotate 3 of the corners in unrotatedTextureRectangle by stRotation around the center of the bounding rectangle
            // - apply the "east-north" system's normalization formula to the rotated cartographics, even though this is likely to produce values outside [0-1].
            // This gives us a set of points in the "east-north" texture coordinate system that can be used to map "east-north" texture coordinates to "desired."

            var points2D = points2DScratch;
            points2D[0].x = unrotatedTextureRectangle.west;
            points2D[0].y = unrotatedTextureRectangle.south;

            points2D[1].x = unrotatedTextureRectangle.west;
            points2D[1].y = unrotatedTextureRectangle.north;

            points2D[2].x = unrotatedTextureRectangle.east;
            points2D[2].y = unrotatedTextureRectangle.south;

            var boundingRectangle = rectangleGeometry.rectangle;
            var toDesiredInComputed = GeometryAttribute.Matrix2.fromRotation(rectangleGeometry._stRotation, rotation2DScratch);
            var boundingRectangleCenter = Cartesian2.Rectangle.center(boundingRectangle, rectangleCenterScratch);

            for (var i = 0; i < 3; ++i) {
                var point2D = points2D[i];
                point2D.x -= boundingRectangleCenter.longitude;
                point2D.y -= boundingRectangleCenter.latitude;
                GeometryAttribute.Matrix2.multiplyByVector(toDesiredInComputed, point2D, point2D);
                point2D.x += boundingRectangleCenter.longitude;
                point2D.y += boundingRectangleCenter.latitude;

                // Convert point into east-north texture coordinate space
                point2D.x = (point2D.x - boundingRectangle.west) / boundingRectangle.width;
                point2D.y = (point2D.y - boundingRectangle.south) / boundingRectangle.height;
            }

            var minXYCorner = points2D[0];
            var maxYCorner = points2D[1];
            var maxXCorner = points2D[2];
            var result = new Array(6);
            Cartesian2.Cartesian2.pack(minXYCorner, result);
            Cartesian2.Cartesian2.pack(maxYCorner, result, 2);
            Cartesian2.Cartesian2.pack(maxXCorner, result, 4);
            return result;
        }

        Object.defineProperties(RectangleGeometry.prototype, {
            /**
             * @private
             */
            rectangle : {
                get : function() {
                    if (!when.defined(this._rotatedRectangle)) {
                        this._rotatedRectangle = computeRectangle(this._rectangle, this._granularity, this._rotation, this._ellipsoid);
                    }
                    return this._rotatedRectangle;
                }
            },
            /**
             * For remapping texture coordinates when rendering RectangleGeometries as GroundPrimitives.
             * This version permits skew in textures by computing offsets directly in cartographic space and
             * more accurately approximates rendering RectangleGeometries with height as standard Primitives.
             * @see Geometry#_textureCoordinateRotationPoints
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

    function createRectangleGeometry(rectangleGeometry, offset) {
        if (when.defined(offset)) {
            rectangleGeometry = RectangleGeometry.unpack(rectangleGeometry, offset);
        }
        rectangleGeometry._ellipsoid = Cartesian2.Ellipsoid.clone(rectangleGeometry._ellipsoid);
        rectangleGeometry._rectangle = Cartesian2.Rectangle.clone(rectangleGeometry._rectangle);
        return RectangleGeometry.createGeometry(rectangleGeometry);
    }

    return createRectangleGeometry;

});

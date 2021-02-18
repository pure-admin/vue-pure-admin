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
define(['./when-8d13db60', './Check-70bec281', './Math-61ede240', './Cartographic-fe4be337', './Cartesian2-85064f09', './BoundingSphere-775c5788', './Cartesian4-5af5bb24', './RuntimeError-ba10bc3e', './WebGLConstants-4c11ee5f', './ComponentDatatype-5862616f', './GeometryAttribute-06d31d45', './PrimitiveType-97893bc7', './FeatureDetection-7bd32c34', './Transforms-913163ed', './buildModuleUrl-9d43158d', './GeometryAttributes-aacecde6', './IndexDatatype-9435b55f', './IntersectionTests-397d9494', './Plane-8390418f', './GeometryOffsetAttribute-ca302482', './VertexFormat-fe4db402', './arrayRemoveDuplicates-f0b089b1', './EllipsoidTangentPlane-605dc181', './EllipsoidRhumbLine-f161e674', './earcut-2.2.1-b404d9e6', './PolygonPipeline-62047934', './PolylineVolumeGeometryLibrary-30d16dbe', './EllipsoidGeodesic-84507801', './PolylinePipeline-a9f32196', './CorridorGeometryLibrary-ac1b8968'], function (when, Check, _Math, Cartographic, Cartesian2, BoundingSphere, Cartesian4, RuntimeError, WebGLConstants, ComponentDatatype, GeometryAttribute, PrimitiveType, FeatureDetection, Transforms, buildModuleUrl, GeometryAttributes, IndexDatatype, IntersectionTests, Plane, GeometryOffsetAttribute, VertexFormat, arrayRemoveDuplicates, EllipsoidTangentPlane, EllipsoidRhumbLine, earcut2_2_1, PolygonPipeline, PolylineVolumeGeometryLibrary, EllipsoidGeodesic, PolylinePipeline, CorridorGeometryLibrary) { 'use strict';

    var cartesian1 = new Cartographic.Cartesian3();
        var cartesian2 = new Cartographic.Cartesian3();
        var cartesian3 = new Cartographic.Cartesian3();
        var cartesian4 = new Cartographic.Cartesian3();
        var cartesian5 = new Cartographic.Cartesian3();
        var cartesian6 = new Cartographic.Cartesian3();

        var scratch1 = new Cartographic.Cartesian3();
        var scratch2 = new Cartographic.Cartesian3();

        function scaleToSurface(positions, ellipsoid) {
            for (var i = 0; i < positions.length; i++) {
                positions[i] = ellipsoid.scaleToGeodeticSurface(positions[i], positions[i]);
            }
            return positions;
        }

        function addNormals(attr, normal, left, front, back, vertexFormat) {
            var normals = attr.normals;
            var tangents = attr.tangents;
            var bitangents = attr.bitangents;
            var forward = Cartographic.Cartesian3.normalize(Cartographic.Cartesian3.cross(left, normal, scratch1), scratch1);
            if (vertexFormat.normal) {
                CorridorGeometryLibrary.CorridorGeometryLibrary.addAttribute(normals, normal, front, back);
            }
            if (vertexFormat.tangent) {
                CorridorGeometryLibrary.CorridorGeometryLibrary.addAttribute(tangents, forward, front, back);
            }
            if (vertexFormat.bitangent) {
                CorridorGeometryLibrary.CorridorGeometryLibrary.addAttribute(bitangents, left, front, back);
            }
        }

        function combine(computedPositions, vertexFormat, ellipsoid) {
            var positions = computedPositions.positions;
            var corners = computedPositions.corners;
            var endPositions = computedPositions.endPositions;
            var computedLefts = computedPositions.lefts;
            var computedNormals = computedPositions.normals;
            var attributes = new GeometryAttributes.GeometryAttributes();
            var corner;
            var leftCount = 0;
            var rightCount = 0;
            var i;
            var indicesLength = 0;
            var length;
            for (i = 0; i < positions.length; i += 2) {
                length = positions[i].length - 3;
                leftCount += length; //subtracting 3 to account for duplicate points at corners
                indicesLength += length*2;
                rightCount += positions[i + 1].length - 3;
            }
            leftCount += 3; //add back count for end positions
            rightCount += 3;
            for (i = 0; i < corners.length; i++) {
                corner = corners[i];
                var leftSide = corners[i].leftPositions;
                if (when.defined(leftSide)) {
                    length = leftSide.length;
                    leftCount += length;
                    indicesLength += length;
                } else {
                    length = corners[i].rightPositions.length;
                    rightCount += length;
                    indicesLength += length;
                }
            }

            var addEndPositions = when.defined(endPositions);
            var endPositionLength;
            if (addEndPositions) {
                endPositionLength = endPositions[0].length - 3;
                leftCount += endPositionLength;
                rightCount += endPositionLength;
                endPositionLength /= 3;
                indicesLength += endPositionLength * 6;
            }
            var size = leftCount + rightCount;
            var finalPositions = new Float64Array(size);
            var normals = (vertexFormat.normal) ? new Float32Array(size) : undefined;
            var tangents = (vertexFormat.tangent) ? new Float32Array(size) : undefined;
            var bitangents = (vertexFormat.bitangent) ? new Float32Array(size) : undefined;
            var attr = {
                normals : normals,
                tangents : tangents,
                bitangents : bitangents
            };
            var front = 0;
            var back = size - 1;
            var UL, LL, UR, LR;
            var normal = cartesian1;
            var left = cartesian2;
            var rightPos, leftPos;
            var halfLength = endPositionLength / 2;

            var indices = IndexDatatype.IndexDatatype.createTypedArray(size / 3, indicesLength);
            var index = 0;
            if (addEndPositions) { // add rounded end
                leftPos = cartesian3;
                rightPos = cartesian4;
                var firstEndPositions = endPositions[0];
                normal = Cartographic.Cartesian3.fromArray(computedNormals, 0, normal);
                left = Cartographic.Cartesian3.fromArray(computedLefts, 0, left);
                for (i = 0; i < halfLength; i++) {
                    leftPos = Cartographic.Cartesian3.fromArray(firstEndPositions, (halfLength - 1 - i) * 3, leftPos);
                    rightPos = Cartographic.Cartesian3.fromArray(firstEndPositions, (halfLength + i) * 3, rightPos);
                    CorridorGeometryLibrary.CorridorGeometryLibrary.addAttribute(finalPositions, rightPos, front);
                    CorridorGeometryLibrary.CorridorGeometryLibrary.addAttribute(finalPositions, leftPos, undefined, back);
                    addNormals(attr, normal, left, front, back, vertexFormat);

                    LL = front / 3;
                    LR = LL + 1;
                    UL = (back - 2) / 3;
                    UR = UL - 1;
                    indices[index++] = UL;
                    indices[index++] = LL;
                    indices[index++] = UR;
                    indices[index++] = UR;
                    indices[index++] = LL;
                    indices[index++] = LR;

                    front += 3;
                    back -= 3;
                }
            }

            var posIndex = 0;
            var compIndex = 0;
            var rightEdge = positions[posIndex++]; //add first two edges
            var leftEdge = positions[posIndex++];
            finalPositions.set(rightEdge, front);
            finalPositions.set(leftEdge, back - leftEdge.length + 1);

            left = Cartographic.Cartesian3.fromArray(computedLefts, compIndex, left);
            var rightNormal;
            var leftNormal;
            length = leftEdge.length - 3;
            for (i = 0; i < length; i += 3) {
                rightNormal = ellipsoid.geodeticSurfaceNormal(Cartographic.Cartesian3.fromArray(rightEdge, i, scratch1), scratch1);
                leftNormal = ellipsoid.geodeticSurfaceNormal(Cartographic.Cartesian3.fromArray(leftEdge, length - i, scratch2), scratch2);
                normal = Cartographic.Cartesian3.normalize(Cartographic.Cartesian3.add(rightNormal, leftNormal, normal), normal);
                addNormals(attr, normal, left, front, back, vertexFormat);

                LL = front / 3;
                LR = LL + 1;
                UL = (back - 2) / 3;
                UR = UL - 1;
                indices[index++] = UL;
                indices[index++] = LL;
                indices[index++] = UR;
                indices[index++] = UR;
                indices[index++] = LL;
                indices[index++] = LR;

                front += 3;
                back -= 3;
            }

            rightNormal = ellipsoid.geodeticSurfaceNormal(Cartographic.Cartesian3.fromArray(rightEdge, length, scratch1), scratch1);
            leftNormal = ellipsoid.geodeticSurfaceNormal(Cartographic.Cartesian3.fromArray(leftEdge, length, scratch2), scratch2);
            normal = Cartographic.Cartesian3.normalize(Cartographic.Cartesian3.add(rightNormal, leftNormal, normal), normal);
            compIndex += 3;
            for (i = 0; i < corners.length; i++) {
                var j;
                corner = corners[i];
                var l = corner.leftPositions;
                var r = corner.rightPositions;
                var pivot;
                var start;
                var outsidePoint = cartesian6;
                var previousPoint = cartesian3;
                var nextPoint = cartesian4;
                normal = Cartographic.Cartesian3.fromArray(computedNormals, compIndex, normal);
                if (when.defined(l)) {
                    addNormals(attr, normal, left, undefined, back, vertexFormat);
                    back -= 3;
                    pivot = LR;
                    start = UR;
                    for (j = 0; j < l.length / 3; j++) {
                        outsidePoint = Cartographic.Cartesian3.fromArray(l, j * 3, outsidePoint);
                        indices[index++] = pivot;
                        indices[index++] = start - j - 1;
                        indices[index++] = start - j;
                        CorridorGeometryLibrary.CorridorGeometryLibrary.addAttribute(finalPositions, outsidePoint, undefined, back);
                        previousPoint = Cartographic.Cartesian3.fromArray(finalPositions, (start - j - 1) * 3, previousPoint);
                        nextPoint = Cartographic.Cartesian3.fromArray(finalPositions, pivot * 3, nextPoint);
                        left = Cartographic.Cartesian3.normalize(Cartographic.Cartesian3.subtract(previousPoint, nextPoint, left), left);
                        addNormals(attr, normal, left, undefined, back, vertexFormat);
                        back -= 3;
                    }
                    outsidePoint = Cartographic.Cartesian3.fromArray(finalPositions, pivot * 3, outsidePoint);
                    previousPoint = Cartographic.Cartesian3.subtract(Cartographic.Cartesian3.fromArray(finalPositions, (start) * 3, previousPoint), outsidePoint, previousPoint);
                    nextPoint = Cartographic.Cartesian3.subtract(Cartographic.Cartesian3.fromArray(finalPositions, (start - j) * 3, nextPoint), outsidePoint, nextPoint);
                    left = Cartographic.Cartesian3.normalize(Cartographic.Cartesian3.add(previousPoint, nextPoint, left), left);
                    addNormals(attr, normal, left, front, undefined, vertexFormat);
                    front += 3;
                } else {
                    addNormals(attr, normal, left, front, undefined, vertexFormat);
                    front += 3;
                    pivot = UR;
                    start = LR;
                    for (j = 0; j < r.length / 3; j++) {
                        outsidePoint = Cartographic.Cartesian3.fromArray(r, j * 3, outsidePoint);
                        indices[index++] = pivot;
                        indices[index++] = start + j;
                        indices[index++] = start + j + 1;
                        CorridorGeometryLibrary.CorridorGeometryLibrary.addAttribute(finalPositions, outsidePoint, front);
                        previousPoint = Cartographic.Cartesian3.fromArray(finalPositions, pivot * 3, previousPoint);
                        nextPoint = Cartographic.Cartesian3.fromArray(finalPositions, (start + j) * 3, nextPoint);
                        left = Cartographic.Cartesian3.normalize(Cartographic.Cartesian3.subtract(previousPoint, nextPoint, left), left);
                        addNormals(attr, normal, left, front, undefined, vertexFormat);
                        front += 3;
                    }
                    outsidePoint = Cartographic.Cartesian3.fromArray(finalPositions, pivot * 3, outsidePoint);
                    previousPoint = Cartographic.Cartesian3.subtract(Cartographic.Cartesian3.fromArray(finalPositions, (start + j) * 3, previousPoint), outsidePoint, previousPoint);
                    nextPoint = Cartographic.Cartesian3.subtract(Cartographic.Cartesian3.fromArray(finalPositions, start * 3, nextPoint), outsidePoint, nextPoint);
                    left = Cartographic.Cartesian3.normalize(Cartographic.Cartesian3.negate(Cartographic.Cartesian3.add(nextPoint, previousPoint, left), left), left);
                    addNormals(attr, normal, left, undefined, back, vertexFormat);
                    back -= 3;
                }
                rightEdge = positions[posIndex++];
                leftEdge = positions[posIndex++];
                rightEdge.splice(0, 3); //remove duplicate points added by corner
                leftEdge.splice(leftEdge.length - 3, 3);
                finalPositions.set(rightEdge, front);
                finalPositions.set(leftEdge, back - leftEdge.length + 1);
                length = leftEdge.length - 3;

                compIndex += 3;
                left = Cartographic.Cartesian3.fromArray(computedLefts, compIndex, left);
                for (j = 0; j < leftEdge.length; j += 3) {
                    rightNormal = ellipsoid.geodeticSurfaceNormal(Cartographic.Cartesian3.fromArray(rightEdge, j, scratch1), scratch1);
                    leftNormal = ellipsoid.geodeticSurfaceNormal(Cartographic.Cartesian3.fromArray(leftEdge, length - j, scratch2), scratch2);
                    normal = Cartographic.Cartesian3.normalize(Cartographic.Cartesian3.add(rightNormal, leftNormal, normal), normal);
                    addNormals(attr, normal, left, front, back, vertexFormat);

                    LR = front / 3;
                    LL = LR - 1;
                    UR = (back - 2) / 3;
                    UL = UR + 1;
                    indices[index++] = UL;
                    indices[index++] = LL;
                    indices[index++] = UR;
                    indices[index++] = UR;
                    indices[index++] = LL;
                    indices[index++] = LR;

                    front += 3;
                    back -= 3;
                }
                front -= 3;
                back += 3;
            }
            normal = Cartographic.Cartesian3.fromArray(computedNormals, computedNormals.length - 3, normal);
            addNormals(attr, normal, left, front, back, vertexFormat);

            if (addEndPositions) { // add rounded end
                front += 3;
                back -= 3;
                leftPos = cartesian3;
                rightPos = cartesian4;
                var lastEndPositions = endPositions[1];
                for (i = 0; i < halfLength; i++) {
                    leftPos = Cartographic.Cartesian3.fromArray(lastEndPositions, (endPositionLength - i - 1) * 3, leftPos);
                    rightPos = Cartographic.Cartesian3.fromArray(lastEndPositions, i * 3, rightPos);
                    CorridorGeometryLibrary.CorridorGeometryLibrary.addAttribute(finalPositions, leftPos, undefined, back);
                    CorridorGeometryLibrary.CorridorGeometryLibrary.addAttribute(finalPositions, rightPos, front);
                    addNormals(attr, normal, left, front, back, vertexFormat);

                    LR = front / 3;
                    LL = LR - 1;
                    UR = (back - 2) / 3;
                    UL = UR + 1;
                    indices[index++] = UL;
                    indices[index++] = LL;
                    indices[index++] = UR;
                    indices[index++] = UR;
                    indices[index++] = LL;
                    indices[index++] = LR;

                    front += 3;
                    back -= 3;
                }
            }

            attributes.position = new GeometryAttribute.GeometryAttribute({
                componentDatatype : ComponentDatatype.ComponentDatatype.DOUBLE,
                componentsPerAttribute : 3,
                values : finalPositions
            });

            if (vertexFormat.st) {
                var st = new Float32Array(size / 3 * 2);
                var rightSt;
                var leftSt;
                var stIndex = 0;
                if (addEndPositions) {
                    leftCount /= 3;
                    rightCount /= 3;
                    var theta = Math.PI / (endPositionLength + 1);
                    leftSt = 1 / (leftCount - endPositionLength + 1);
                    rightSt = 1 / (rightCount - endPositionLength + 1);
                    var a;
                    var halfEndPos = endPositionLength / 2;
                    for (i = halfEndPos + 1; i < endPositionLength + 1; i++) { // lower left rounded end
                        a = _Math.CesiumMath.PI_OVER_TWO + theta * i;
                        st[stIndex++] = rightSt * (1 + Math.cos(a));
                        st[stIndex++] = 0.5 * (1 + Math.sin(a));
                    }
                    for (i = 1; i < rightCount - endPositionLength + 1; i++) { // bottom edge
                        st[stIndex++] = i * rightSt;
                        st[stIndex++] = 0;
                    }
                    for (i = endPositionLength; i > halfEndPos; i--) { // lower right rounded end
                        a = _Math.CesiumMath.PI_OVER_TWO - i * theta;
                        st[stIndex++] = 1 - rightSt * (1 + Math.cos(a));
                        st[stIndex++] = 0.5 * (1 + Math.sin(a));
                    }
                    for (i = halfEndPos; i > 0; i--) { // upper right rounded end
                        a = _Math.CesiumMath.PI_OVER_TWO - theta * i;
                        st[stIndex++] = 1 - leftSt * (1 + Math.cos(a));
                        st[stIndex++] = 0.5 * (1 + Math.sin(a));
                    }
                    for (i = leftCount - endPositionLength; i > 0; i--) { // top edge
                        st[stIndex++] = i * leftSt;
                        st[stIndex++] = 1;
                    }
                    for (i = 1; i < halfEndPos + 1; i++) { // upper left rounded end
                        a = _Math.CesiumMath.PI_OVER_TWO + theta * i;
                        st[stIndex++] = leftSt * (1 + Math.cos(a));
                        st[stIndex++] = 0.5 * (1 + Math.sin(a));
                    }
                } else {
                    leftCount /= 3;
                    rightCount /= 3;
                    leftSt = 1 / (leftCount - 1);
                    rightSt = 1 / (rightCount - 1);
                    for (i = 0; i < rightCount; i++) { // bottom edge
                        st[stIndex++] = i * rightSt;
                        st[stIndex++] = 0;
                    }
                    for (i = leftCount; i > 0; i--) { // top edge
                        st[stIndex++] = (i - 1) * leftSt;
                        st[stIndex++] = 1;
                    }
                }

                attributes.st = new GeometryAttribute.GeometryAttribute({
                    componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
                    componentsPerAttribute : 2,
                    values : st
                });
            }

            if (vertexFormat.normal) {
                attributes.normal = new GeometryAttribute.GeometryAttribute({
                    componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
                    componentsPerAttribute : 3,
                    values : attr.normals
                });
            }

            if (vertexFormat.tangent) {
                attributes.tangent = new GeometryAttribute.GeometryAttribute({
                    componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
                    componentsPerAttribute : 3,
                    values : attr.tangents
                });
            }

            if (vertexFormat.bitangent) {
                attributes.bitangent = new GeometryAttribute.GeometryAttribute({
                    componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
                    componentsPerAttribute : 3,
                    values : attr.bitangents
                });
            }

            return {
                attributes : attributes,
                indices : indices
            };
        }

        function extrudedAttributes(attributes, vertexFormat) {
            if (!vertexFormat.normal && !vertexFormat.tangent && !vertexFormat.bitangent && !vertexFormat.st) {
                return attributes;
            }
            var positions = attributes.position.values;
            var topNormals;
            var topBitangents;
            if (vertexFormat.normal || vertexFormat.bitangent) {
                topNormals = attributes.normal.values;
                topBitangents = attributes.bitangent.values;
            }
            var size = attributes.position.values.length / 18;
            var threeSize = size * 3;
            var twoSize = size * 2;
            var sixSize = threeSize * 2;
            var i;
            if (vertexFormat.normal || vertexFormat.bitangent || vertexFormat.tangent) {
                var normals = (vertexFormat.normal) ? new Float32Array(threeSize * 6) : undefined;
                var tangents = (vertexFormat.tangent) ? new Float32Array(threeSize * 6) : undefined;
                var bitangents = (vertexFormat.bitangent) ? new Float32Array(threeSize * 6) : undefined;
                var topPosition = cartesian1;
                var bottomPosition = cartesian2;
                var previousPosition = cartesian3;
                var normal = cartesian4;
                var tangent = cartesian5;
                var bitangent = cartesian6;
                var attrIndex = sixSize;
                for (i = 0; i < threeSize; i += 3) {
                    var attrIndexOffset = attrIndex + sixSize;
                    topPosition      = Cartographic.Cartesian3.fromArray(positions, i, topPosition);
                    bottomPosition   = Cartographic.Cartesian3.fromArray(positions, i + threeSize, bottomPosition);
                    previousPosition = Cartographic.Cartesian3.fromArray(positions, (i + 3) % threeSize, previousPosition);
                    bottomPosition   = Cartographic.Cartesian3.subtract(bottomPosition,   topPosition, bottomPosition);
                    previousPosition = Cartographic.Cartesian3.subtract(previousPosition, topPosition, previousPosition);
                    normal = Cartographic.Cartesian3.normalize(Cartographic.Cartesian3.cross(bottomPosition, previousPosition, normal), normal);
                    if (vertexFormat.normal) {
                        CorridorGeometryLibrary.CorridorGeometryLibrary.addAttribute(normals, normal, attrIndexOffset);
                        CorridorGeometryLibrary.CorridorGeometryLibrary.addAttribute(normals, normal, attrIndexOffset + 3);
                        CorridorGeometryLibrary.CorridorGeometryLibrary.addAttribute(normals, normal, attrIndex);
                        CorridorGeometryLibrary.CorridorGeometryLibrary.addAttribute(normals, normal, attrIndex + 3);
                    }
                    if (vertexFormat.tangent || vertexFormat.bitangent) {
                        bitangent = Cartographic.Cartesian3.fromArray(topNormals, i, bitangent);
                        if (vertexFormat.bitangent) {
                            CorridorGeometryLibrary.CorridorGeometryLibrary.addAttribute(bitangents, bitangent, attrIndexOffset);
                            CorridorGeometryLibrary.CorridorGeometryLibrary.addAttribute(bitangents, bitangent, attrIndexOffset + 3);
                            CorridorGeometryLibrary.CorridorGeometryLibrary.addAttribute(bitangents, bitangent, attrIndex);
                            CorridorGeometryLibrary.CorridorGeometryLibrary.addAttribute(bitangents, bitangent, attrIndex + 3);
                        }

                        if (vertexFormat.tangent) {
                            tangent = Cartographic.Cartesian3.normalize(Cartographic.Cartesian3.cross(bitangent, normal, tangent), tangent);
                            CorridorGeometryLibrary.CorridorGeometryLibrary.addAttribute(tangents, tangent, attrIndexOffset);
                            CorridorGeometryLibrary.CorridorGeometryLibrary.addAttribute(tangents, tangent, attrIndexOffset + 3);
                            CorridorGeometryLibrary.CorridorGeometryLibrary.addAttribute(tangents, tangent, attrIndex);
                            CorridorGeometryLibrary.CorridorGeometryLibrary.addAttribute(tangents, tangent, attrIndex + 3);
                        }
                    }
                    attrIndex += 6;
                }

                if (vertexFormat.normal) {
                    normals.set(topNormals); //top
                    for (i = 0; i < threeSize; i += 3) { //bottom normals
                        normals[i + threeSize] = -topNormals[i];
                        normals[i + threeSize + 1] = -topNormals[i + 1];
                        normals[i + threeSize + 2] = -topNormals[i + 2];
                    }
                    attributes.normal.values = normals;
                } else {
                    attributes.normal = undefined;
                }

                if (vertexFormat.bitangent) {
                    bitangents.set(topBitangents); //top
                    bitangents.set(topBitangents, threeSize); //bottom
                    attributes.bitangent.values = bitangents;
                } else {
                    attributes.bitangent = undefined;
                }

                if (vertexFormat.tangent) {
                    var topTangents = attributes.tangent.values;
                    tangents.set(topTangents); //top
                    tangents.set(topTangents, threeSize); //bottom
                    attributes.tangent.values = tangents;
                }
            }
            if (vertexFormat.st) {
                var topSt = attributes.st.values;
                var st = new Float32Array(twoSize * 6);
                st.set(topSt); //top
                st.set(topSt, twoSize); //bottom
                var index = twoSize * 2;

                for ( var j = 0; j < 2; j++) {
                    st[index++] = topSt[0];
                    st[index++] = topSt[1];
                    for (i = 2; i < twoSize; i += 2) {
                        var s = topSt[i];
                        var t = topSt[i + 1];
                        st[index++] = s;
                        st[index++] = t;
                        st[index++] = s;
                        st[index++] = t;
                    }
                    st[index++] = topSt[0];
                    st[index++] = topSt[1];
                }
                attributes.st.values = st;
            }

            return attributes;
        }

        function addWallPositions(positions, index, wallPositions) {
            wallPositions[index++] = positions[0];
            wallPositions[index++] = positions[1];
            wallPositions[index++] = positions[2];
            for ( var i = 3; i < positions.length; i += 3) {
                var x = positions[i];
                var y = positions[i + 1];
                var z = positions[i + 2];
                wallPositions[index++] = x;
                wallPositions[index++] = y;
                wallPositions[index++] = z;
                wallPositions[index++] = x;
                wallPositions[index++] = y;
                wallPositions[index++] = z;
            }
            wallPositions[index++] = positions[0];
            wallPositions[index++] = positions[1];
            wallPositions[index++] = positions[2];

            return wallPositions;
        }

        function computePositionsExtruded(params, vertexFormat) {
            var topVertexFormat = new VertexFormat.VertexFormat({
                position : vertexFormat.position,
                normal : (vertexFormat.normal || vertexFormat.bitangent || params.shadowVolume),
                tangent : vertexFormat.tangent,
                bitangent : (vertexFormat.normal || vertexFormat.bitangent),
                st : vertexFormat.st
            });
            var ellipsoid = params.ellipsoid;
            var computedPositions = CorridorGeometryLibrary.CorridorGeometryLibrary.computePositions(params);
            var attr = combine(computedPositions, topVertexFormat, ellipsoid);
            var height = params.height;
            var extrudedHeight = params.extrudedHeight;
            var attributes = attr.attributes;
            var indices = attr.indices;
            var positions = attributes.position.values;
            var length = positions.length;
            var newPositions = new Float64Array(length * 6);
            var extrudedPositions = new Float64Array(length);
            extrudedPositions.set(positions);
            var wallPositions = new Float64Array(length * 4);

            positions = PolygonPipeline.PolygonPipeline.scaleToGeodeticHeight(positions, height, ellipsoid);
            wallPositions = addWallPositions(positions, 0, wallPositions);
            extrudedPositions = PolygonPipeline.PolygonPipeline.scaleToGeodeticHeight(extrudedPositions, extrudedHeight, ellipsoid);
            wallPositions = addWallPositions(extrudedPositions, length * 2, wallPositions);
            newPositions.set(positions);
            newPositions.set(extrudedPositions, length);
            newPositions.set(wallPositions, length * 2);
            attributes.position.values = newPositions;

            attributes = extrudedAttributes(attributes, vertexFormat);
            var i;
            var size = length / 3;
            if (params.shadowVolume) {
                var topNormals = attributes.normal.values;
                length = topNormals.length;

                var extrudeNormals = new Float32Array(length * 6);
                for (i = 0; i < length; i ++) {
                    topNormals[i] = -topNormals[i];
                }
                //only get normals for bottom layer that's going to be pushed down
                extrudeNormals.set(topNormals, length); //bottom face
                extrudeNormals = addWallPositions(topNormals, length*4, extrudeNormals); //bottom wall
                attributes.extrudeDirection = new GeometryAttribute.GeometryAttribute({
                    componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
                    componentsPerAttribute : 3,
                    values : extrudeNormals
                });
                if (!vertexFormat.normal) {
                    attributes.normal = undefined;
                }
            }
            if (when.defined(params.offsetAttribute)) {
                var applyOffset = new Uint8Array(size * 6);
                if (params.offsetAttribute === GeometryOffsetAttribute.GeometryOffsetAttribute.TOP) {
                    applyOffset = GeometryOffsetAttribute.arrayFill(applyOffset, 1, 0, size); // top face
                    applyOffset = GeometryOffsetAttribute.arrayFill(applyOffset, 1, size*2, size * 4); // top wall
                } else {
                    var applyOffsetValue = params.offsetAttribute === GeometryOffsetAttribute.GeometryOffsetAttribute.NONE ? 0 : 1;
                    applyOffset = GeometryOffsetAttribute.arrayFill(applyOffset, applyOffsetValue);
                }
                attributes.applyOffset = new GeometryAttribute.GeometryAttribute({
                    componentDatatype : ComponentDatatype.ComponentDatatype.UNSIGNED_BYTE,
                    componentsPerAttribute : 1,
                    values: applyOffset
                });
            }

            var iLength = indices.length;
            var twoSize = size + size;
            var newIndices = IndexDatatype.IndexDatatype.createTypedArray(newPositions.length / 3, iLength * 2 + twoSize * 3);
            newIndices.set(indices);
            var index = iLength;
            for (i = 0; i < iLength; i += 3) { // bottom indices
                var v0 = indices[i];
                var v1 = indices[i + 1];
                var v2 = indices[i + 2];
                newIndices[index++] = v2 + size;
                newIndices[index++] = v1 + size;
                newIndices[index++] = v0 + size;
            }

            var UL, LL, UR, LR;

            for (i = 0; i < twoSize; i += 2) { //wall indices
                UL = i + twoSize;
                LL = UL + twoSize;
                UR = UL + 1;
                LR = LL + 1;
                newIndices[index++] = UL;
                newIndices[index++] = LL;
                newIndices[index++] = UR;
                newIndices[index++] = UR;
                newIndices[index++] = LL;
                newIndices[index++] = LR;
            }

            return {
                attributes : attributes,
                indices : newIndices
            };
        }

        var scratchCartesian1 = new Cartographic.Cartesian3();
        var scratchCartesian2 = new Cartographic.Cartesian3();
        var scratchCartographic = new Cartographic.Cartographic();

        function computeOffsetPoints(position1, position2, ellipsoid, halfWidth, min, max) {
            // Compute direction of offset the point
            var direction = Cartographic.Cartesian3.subtract(position2, position1, scratchCartesian1);
            Cartographic.Cartesian3.normalize(direction, direction);
            var normal = ellipsoid.geodeticSurfaceNormal(position1, scratchCartesian2);
            var offsetDirection = Cartographic.Cartesian3.cross(direction, normal, scratchCartesian1);
            Cartographic.Cartesian3.multiplyByScalar(offsetDirection, halfWidth, offsetDirection);

            var minLat = min.latitude;
            var minLon = min.longitude;
            var maxLat = max.latitude;
            var maxLon = max.longitude;

            // Compute 2 offset points
            Cartographic.Cartesian3.add(position1, offsetDirection, scratchCartesian2);
            ellipsoid.cartesianToCartographic(scratchCartesian2, scratchCartographic);

            var lat = scratchCartographic.latitude;
            var lon = scratchCartographic.longitude;
            minLat = Math.min(minLat, lat);
            minLon = Math.min(minLon, lon);
            maxLat = Math.max(maxLat, lat);
            maxLon = Math.max(maxLon, lon);

            Cartographic.Cartesian3.subtract(position1, offsetDirection, scratchCartesian2);
            ellipsoid.cartesianToCartographic(scratchCartesian2, scratchCartographic);

            lat = scratchCartographic.latitude;
            lon = scratchCartographic.longitude;
            minLat = Math.min(minLat, lat);
            minLon = Math.min(minLon, lon);
            maxLat = Math.max(maxLat, lat);
            maxLon = Math.max(maxLon, lon);

            min.latitude = minLat;
            min.longitude = minLon;
            max.latitude = maxLat;
            max.longitude = maxLon;
        }

        var scratchCartesianOffset = new Cartographic.Cartesian3();
        var scratchCartesianEnds = new Cartographic.Cartesian3();
        var scratchCartographicMin = new Cartographic.Cartographic();
        var scratchCartographicMax = new Cartographic.Cartographic();

        function computeRectangle(positions, ellipsoid, width, cornerType, result) {
            positions = scaleToSurface(positions, ellipsoid);
            var cleanPositions = arrayRemoveDuplicates.arrayRemoveDuplicates(positions, Cartographic.Cartesian3.equalsEpsilon);
            var length = cleanPositions.length;
            if (length < 2 || width <= 0) {
                return new Cartesian2.Rectangle();
            }
            var halfWidth = width * 0.5;

            scratchCartographicMin.latitude = Number.POSITIVE_INFINITY;
            scratchCartographicMin.longitude = Number.POSITIVE_INFINITY;
            scratchCartographicMax.latitude = Number.NEGATIVE_INFINITY;
            scratchCartographicMax.longitude = Number.NEGATIVE_INFINITY;

            var lat, lon;
            if (cornerType === PolylineVolumeGeometryLibrary.CornerType.ROUNDED) {
                // Compute start cap
                var first = cleanPositions[0];
                Cartographic.Cartesian3.subtract(first, cleanPositions[1], scratchCartesianOffset);
                Cartographic.Cartesian3.normalize(scratchCartesianOffset, scratchCartesianOffset);
                Cartographic.Cartesian3.multiplyByScalar(scratchCartesianOffset, halfWidth, scratchCartesianOffset);
                Cartographic.Cartesian3.add(first, scratchCartesianOffset, scratchCartesianEnds);

                ellipsoid.cartesianToCartographic(scratchCartesianEnds, scratchCartographic);
                lat = scratchCartographic.latitude;
                lon = scratchCartographic.longitude;
                scratchCartographicMin.latitude = Math.min(scratchCartographicMin.latitude, lat);
                scratchCartographicMin.longitude = Math.min(scratchCartographicMin.longitude, lon);
                scratchCartographicMax.latitude = Math.max(scratchCartographicMax.latitude, lat);
                scratchCartographicMax.longitude = Math.max(scratchCartographicMax.longitude, lon);
            }

            // Compute the rest
            for (var i = 0; i < length-1; ++i) {
                computeOffsetPoints(cleanPositions[i], cleanPositions[i+1], ellipsoid, halfWidth,
                    scratchCartographicMin, scratchCartographicMax);
            }

            // Compute ending point
            var last = cleanPositions[length-1];
            Cartographic.Cartesian3.subtract(last, cleanPositions[length-2], scratchCartesianOffset);
            Cartographic.Cartesian3.normalize(scratchCartesianOffset, scratchCartesianOffset);
            Cartographic.Cartesian3.multiplyByScalar(scratchCartesianOffset, halfWidth, scratchCartesianOffset);
            Cartographic.Cartesian3.add(last, scratchCartesianOffset, scratchCartesianEnds);
            computeOffsetPoints(last, scratchCartesianEnds, ellipsoid, halfWidth,
                scratchCartographicMin, scratchCartographicMax);

            if (cornerType === PolylineVolumeGeometryLibrary.CornerType.ROUNDED) {
                // Compute end cap
                ellipsoid.cartesianToCartographic(scratchCartesianEnds, scratchCartographic);
                lat = scratchCartographic.latitude;
                lon = scratchCartographic.longitude;
                scratchCartographicMin.latitude = Math.min(scratchCartographicMin.latitude, lat);
                scratchCartographicMin.longitude = Math.min(scratchCartographicMin.longitude, lon);
                scratchCartographicMax.latitude = Math.max(scratchCartographicMax.latitude, lat);
                scratchCartographicMax.longitude = Math.max(scratchCartographicMax.longitude, lon);
            }

            var rectangle = when.defined(result) ? result : new Cartesian2.Rectangle();
            rectangle.north = scratchCartographicMax.latitude;
            rectangle.south = scratchCartographicMin.latitude;
            rectangle.east = scratchCartographicMax.longitude;
            rectangle.west = scratchCartographicMin.longitude;

            return rectangle;
        }

        /**
         * A description of a corridor. Corridor geometry can be rendered with both {@link Primitive} and {@link GroundPrimitive}.
         *
         * @alias CorridorGeometry
         * @constructor
         *
         * @param {Object} options Object with the following properties:
         * @param {Cartesian3[]} options.positions An array of positions that define the center of the corridor.
         * @param {Number} options.width The distance between the edges of the corridor in meters.
         * @param {Ellipsoid} [options.ellipsoid=Ellipsoid.WGS84] The ellipsoid to be used as a reference.
         * @param {Number} [options.granularity=CesiumMath.RADIANS_PER_DEGREE] The distance, in radians, between each latitude and longitude. Determines the number of positions in the buffer.
         * @param {Number} [options.height=0] The distance in meters between the ellipsoid surface and the positions.
         * @param {Number} [options.extrudedHeight] The distance in meters between the ellipsoid surface and the extruded face.
         * @param {VertexFormat} [options.vertexFormat=VertexFormat.DEFAULT] The vertex attributes to be computed.
         * @param {CornerType} [options.cornerType=CornerType.ROUNDED] Determines the style of the corners.
         *
         * @see CorridorGeometry.createGeometry
         * @see Packable
         *
         * @demo {@link https://sandcastle.cesium.com/index.html?src=Corridor.html|Cesium Sandcastle Corridor Demo}
         *
         * @example
         * var corridor = new Cesium.CorridorGeometry({
         *   vertexFormat : Cesium.VertexFormat.POSITION_ONLY,
         *   positions : Cesium.Cartesian3.fromDegreesArray([-72.0, 40.0, -70.0, 35.0]),
         *   width : 100000
         * });
         */
        function CorridorGeometry(options) {
            options = when.defaultValue(options, when.defaultValue.EMPTY_OBJECT);
            var positions = options.positions;
            var width = options.width;

            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('options.positions', positions);
            Check.Check.defined('options.width', width);
            //>>includeEnd('debug');

            var height = when.defaultValue(options.height, 0.0);
            var extrudedHeight = when.defaultValue(options.extrudedHeight, height);

            this._positions = positions;
            this._ellipsoid = Cartesian2.Ellipsoid.clone(when.defaultValue(options.ellipsoid, Cartesian2.Ellipsoid.WGS84));
            this._vertexFormat = VertexFormat.VertexFormat.clone(when.defaultValue(options.vertexFormat, VertexFormat.VertexFormat.DEFAULT));
            this._width = width;
            this._height = Math.max(height, extrudedHeight);
            this._extrudedHeight = Math.min(height, extrudedHeight);
            this._cornerType = when.defaultValue(options.cornerType, PolylineVolumeGeometryLibrary.CornerType.ROUNDED);
            this._granularity = when.defaultValue(options.granularity, _Math.CesiumMath.RADIANS_PER_DEGREE);
            this._shadowVolume = when.defaultValue(options.shadowVolume, false);
            this._workerName = 'createCorridorGeometry';
            this._offsetAttribute = options.offsetAttribute;
            this._rectangle = undefined;

            /**
             * The number of elements used to pack the object into an array.
             * @type {Number}
             */
            this.packedLength = 1 + positions.length * Cartographic.Cartesian3.packedLength + Cartesian2.Ellipsoid.packedLength + VertexFormat.VertexFormat.packedLength + 7;
        }

        /**
         * Stores the provided instance into the provided array.
         *
         * @param {CorridorGeometry} value The value to pack.
         * @param {Number[]} array The array to pack into.
         * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
         *
         * @returns {Number[]} The array that was packed into
         */
        CorridorGeometry.pack = function(value, array, startingIndex) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('value', value);
            Check.Check.defined('array', array);
            //>>includeEnd('debug');

            startingIndex = when.defaultValue(startingIndex, 0);

            var positions = value._positions;
            var length = positions.length;
            array[startingIndex++] = length;

            for (var i = 0; i < length; ++i, startingIndex += Cartographic.Cartesian3.packedLength) {
                Cartographic.Cartesian3.pack(positions[i], array, startingIndex);
            }

            Cartesian2.Ellipsoid.pack(value._ellipsoid, array, startingIndex);
            startingIndex += Cartesian2.Ellipsoid.packedLength;

            VertexFormat.VertexFormat.pack(value._vertexFormat, array, startingIndex);
            startingIndex += VertexFormat.VertexFormat.packedLength;

            array[startingIndex++] = value._width;
            array[startingIndex++] = value._height;
            array[startingIndex++] = value._extrudedHeight;
            array[startingIndex++] = value._cornerType;
            array[startingIndex++] = value._granularity;
            array[startingIndex++] = value._shadowVolume ? 1.0 : 0.0;
            array[startingIndex] = when.defaultValue(value._offsetAttribute, -1);

            return array;
        };

        var scratchEllipsoid = Cartesian2.Ellipsoid.clone(Cartesian2.Ellipsoid.UNIT_SPHERE);
        var scratchVertexFormat = new VertexFormat.VertexFormat();
        var scratchOptions = {
            positions : undefined,
            ellipsoid : scratchEllipsoid,
            vertexFormat : scratchVertexFormat,
            width : undefined,
            height : undefined,
            extrudedHeight : undefined,
            cornerType : undefined,
            granularity : undefined,
            shadowVolume: undefined,
            offsetAttribute: undefined
        };

        /**
         * Retrieves an instance from a packed array.
         *
         * @param {Number[]} array The packed array.
         * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
         * @param {CorridorGeometry} [result] The object into which to store the result.
         * @returns {CorridorGeometry} The modified result parameter or a new CorridorGeometry instance if one was not provided.
         */
        CorridorGeometry.unpack = function(array, startingIndex, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('array', array);
            //>>includeEnd('debug');

            startingIndex = when.defaultValue(startingIndex, 0);

            var length = array[startingIndex++];
            var positions = new Array(length);

            for (var i = 0; i < length; ++i, startingIndex += Cartographic.Cartesian3.packedLength) {
                positions[i] = Cartographic.Cartesian3.unpack(array, startingIndex);
            }

            var ellipsoid = Cartesian2.Ellipsoid.unpack(array, startingIndex, scratchEllipsoid);
            startingIndex += Cartesian2.Ellipsoid.packedLength;

            var vertexFormat = VertexFormat.VertexFormat.unpack(array, startingIndex, scratchVertexFormat);
            startingIndex += VertexFormat.VertexFormat.packedLength;

            var width = array[startingIndex++];
            var height = array[startingIndex++];
            var extrudedHeight = array[startingIndex++];
            var cornerType = array[startingIndex++];
            var granularity = array[startingIndex++];
            var shadowVolume = array[startingIndex++] === 1.0;
            var offsetAttribute = array[startingIndex];

            if (!when.defined(result)) {
                scratchOptions.positions = positions;
                scratchOptions.width = width;
                scratchOptions.height = height;
                scratchOptions.extrudedHeight = extrudedHeight;
                scratchOptions.cornerType = cornerType;
                scratchOptions.granularity = granularity;
                scratchOptions.shadowVolume = shadowVolume;
                scratchOptions.offsetAttribute = offsetAttribute === -1 ? undefined : offsetAttribute;

                return new CorridorGeometry(scratchOptions);
            }

            result._positions = positions;
            result._ellipsoid = Cartesian2.Ellipsoid.clone(ellipsoid, result._ellipsoid);
            result._vertexFormat = VertexFormat.VertexFormat.clone(vertexFormat, result._vertexFormat);
            result._width = width;
            result._height = height;
            result._extrudedHeight = extrudedHeight;
            result._cornerType = cornerType;
            result._granularity = granularity;
            result._shadowVolume = shadowVolume;
            result._offsetAttribute = offsetAttribute === -1 ? undefined : offsetAttribute;

            return result;
        };

        /**
         * Computes the bounding rectangle given the provided options
         *
         * @param {Object} options Object with the following properties:
         * @param {Cartesian3[]} options.positions An array of positions that define the center of the corridor.
         * @param {Number} options.width The distance between the edges of the corridor in meters.
         * @param {Ellipsoid} [options.ellipsoid=Ellipsoid.WGS84] The ellipsoid to be used as a reference.
         * @param {CornerType} [options.cornerType=CornerType.ROUNDED] Determines the style of the corners.
         * @param {Rectangle} [result] An object in which to store the result.
         *
         * @returns {Rectangle} The result rectangle.
         */
        CorridorGeometry.computeRectangle = function(options, result) {
            options = when.defaultValue(options, when.defaultValue.EMPTY_OBJECT);
            var positions = options.positions;
            var width = options.width;

            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('options.positions', positions);
            Check.Check.defined('options.width', width);
            //>>includeEnd('debug');

            var ellipsoid = when.defaultValue(options.ellipsoid, Cartesian2.Ellipsoid.WGS84);
            var cornerType = when.defaultValue(options.cornerType, PolylineVolumeGeometryLibrary.CornerType.ROUNDED);

            return computeRectangle(positions, ellipsoid, width, cornerType, result);
        };

        /**
         * Computes the geometric representation of a corridor, including its vertices, indices, and a bounding sphere.
         *
         * @param {CorridorGeometry} corridorGeometry A description of the corridor.
         * @returns {Geometry|undefined} The computed vertices and indices.
         */
        CorridorGeometry.createGeometry = function(corridorGeometry) {
            var positions = corridorGeometry._positions;
            var width = corridorGeometry._width;
            var ellipsoid = corridorGeometry._ellipsoid;

            positions = scaleToSurface(positions, ellipsoid);
            var cleanPositions = arrayRemoveDuplicates.arrayRemoveDuplicates(positions, Cartographic.Cartesian3.equalsEpsilon);

            if ((cleanPositions.length < 2) || (width <= 0)) {
                return;
            }

            var height = corridorGeometry._height;
            var extrudedHeight = corridorGeometry._extrudedHeight;
            var extrude = !_Math.CesiumMath.equalsEpsilon(height, extrudedHeight, 0, _Math.CesiumMath.EPSILON2);

            var vertexFormat = corridorGeometry._vertexFormat;
            var params = {
                ellipsoid : ellipsoid,
                positions : cleanPositions,
                width : width,
                cornerType : corridorGeometry._cornerType,
                granularity : corridorGeometry._granularity,
                saveAttributes: true
            };
            var attr;
            if (extrude) {
                params.height = height;
                params.extrudedHeight = extrudedHeight;
                params.shadowVolume = corridorGeometry._shadowVolume;
                params.offsetAttribute = corridorGeometry._offsetAttribute;
                attr = computePositionsExtruded(params, vertexFormat);
            } else {
                var computedPositions = CorridorGeometryLibrary.CorridorGeometryLibrary.computePositions(params);
                attr = combine(computedPositions, vertexFormat, ellipsoid);
                attr.attributes.position.values = PolygonPipeline.PolygonPipeline.scaleToGeodeticHeight(attr.attributes.position.values, height, ellipsoid);

                if (when.defined(corridorGeometry._offsetAttribute)) {
                    var applyOffsetValue = corridorGeometry._offsetAttribute === GeometryOffsetAttribute.GeometryOffsetAttribute.NONE ? 0 : 1;
                    var length = attr.attributes.position.values.length;
                    var applyOffset = new Uint8Array(length / 3);
                    GeometryOffsetAttribute.arrayFill(applyOffset, applyOffsetValue);
                    attr.attributes.applyOffset = new GeometryAttribute.GeometryAttribute({
                        componentDatatype : ComponentDatatype.ComponentDatatype.UNSIGNED_BYTE,
                        componentsPerAttribute : 1,
                        values: applyOffset
                    });
                }
            }
            var attributes = attr.attributes;
            var boundingSphere = BoundingSphere.BoundingSphere.fromVertices(attributes.position.values, undefined, 3);
            if (!vertexFormat.position) {
                attr.attributes.position.values = undefined;
            }

            return new GeometryAttribute.Geometry({
                attributes : attributes,
                indices : attr.indices,
                primitiveType : PrimitiveType.PrimitiveType.TRIANGLES,
                boundingSphere : boundingSphere,
                offsetAttribute : corridorGeometry._offsetAttribute
            });
        };

        /**
         * @private
         */
        CorridorGeometry.createShadowVolume = function(corridorGeometry, minHeightFunc, maxHeightFunc) {
            var granularity = corridorGeometry._granularity;
            var ellipsoid = corridorGeometry._ellipsoid;

            var minHeight = minHeightFunc(granularity, ellipsoid);
            var maxHeight = maxHeightFunc(granularity, ellipsoid);

            return new CorridorGeometry({
                positions : corridorGeometry._positions,
                width : corridorGeometry._width,
                cornerType : corridorGeometry._cornerType,
                ellipsoid : ellipsoid,
                granularity : granularity,
                extrudedHeight : minHeight,
                height : maxHeight,
                vertexFormat : VertexFormat.VertexFormat.POSITION_ONLY,
                shadowVolume: true
            });
        };

        Object.defineProperties(CorridorGeometry.prototype, {
            /**
             * @private
             */
            rectangle : {
                get : function() {
                    if (!when.defined(this._rectangle)) {
                        this._rectangle = computeRectangle(this._positions, this._ellipsoid, this._width, this._cornerType);
                    }
                    return this._rectangle;
                }
            },
            /**
             * For remapping texture coordinates when rendering CorridorGeometries as GroundPrimitives.
             *
             * Corridors don't support stRotation,
             * so just return the corners of the original system.
             * @private
             */
            textureCoordinateRotationPoints : {
                get : function() {
                    return [0, 0, 0, 1, 1, 0];
                }
            }
        });

    function createCorridorGeometry(corridorGeometry, offset) {
        if (when.defined(offset)) {
            corridorGeometry = CorridorGeometry.unpack(corridorGeometry, offset);
        }
        corridorGeometry._ellipsoid = Cartesian2.Ellipsoid.clone(corridorGeometry._ellipsoid);
        return CorridorGeometry.createGeometry(corridorGeometry);
    }

    return createCorridorGeometry;

});

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
define(['./when-8d13db60', './Check-70bec281', './Math-61ede240', './Cartographic-fe4be337', './Cartesian2-85064f09', './BoundingSphere-775c5788', './Cartesian4-5af5bb24', './RuntimeError-ba10bc3e', './WebGLConstants-4c11ee5f', './ComponentDatatype-5862616f', './FeatureDetection-7bd32c34', './Transforms-913163ed', './buildModuleUrl-9d43158d', './AttributeCompression-84a90a13', './IntersectionTests-397d9494', './Plane-8390418f', './WebMercatorProjection-80c70558', './createTaskProcessorWorker', './EllipsoidTangentPlane-605dc181', './OrientedBoundingBox-64cb80e5', './TerrainEncoding-a807a704'], function (when, Check, _Math, Cartographic, Cartesian2, BoundingSphere, Cartesian4, RuntimeError, WebGLConstants, ComponentDatatype, FeatureDetection, Transforms, buildModuleUrl, AttributeCompression, IntersectionTests, Plane, WebMercatorProjection, createTaskProcessorWorker, EllipsoidTangentPlane, OrientedBoundingBox, TerrainEncoding) { 'use strict';

    var sizeOfUint16 = Uint16Array.BYTES_PER_ELEMENT;
        var sizeOfInt32 = Int32Array.BYTES_PER_ELEMENT;
        var sizeOfUint32 = Uint32Array.BYTES_PER_ELEMENT;
        var sizeOfFloat = Float32Array.BYTES_PER_ELEMENT;
        var sizeOfDouble = Float64Array.BYTES_PER_ELEMENT;

        function indexOfEpsilon(arr, elem, elemType) {
            elemType = when.defaultValue(elemType, _Math.CesiumMath);
            var count = arr.length;
            for (var i = 0; i < count; ++i) {
                if (elemType.equalsEpsilon(arr[i], elem, _Math.CesiumMath.EPSILON12)) {
                    return i;
                }
            }

            return -1;
        }

        function createVerticesFromGoogleEarthEnterpriseBuffer(parameters, transferableObjects) {
            parameters.ellipsoid = Cartesian2.Ellipsoid.clone(parameters.ellipsoid);
            parameters.rectangle = Cartesian2.Rectangle.clone(parameters.rectangle);

            var statistics = processBuffer(parameters.buffer, parameters.relativeToCenter, parameters.ellipsoid,
                parameters.rectangle, parameters.nativeRectangle, parameters.exaggeration, parameters.skirtHeight,
                parameters.includeWebMercatorT, parameters.negativeAltitudeExponentBias, parameters.negativeElevationThreshold);
            var vertices = statistics.vertices;
            transferableObjects.push(vertices.buffer);
            var indices = statistics.indices;
            transferableObjects.push(indices.buffer);

            return {
                vertices : vertices.buffer,
                indices : indices.buffer,
                numberOfAttributes : statistics.encoding.getStride(),
                minimumHeight : statistics.minimumHeight,
                maximumHeight : statistics.maximumHeight,
                boundingSphere3D : statistics.boundingSphere3D,
                orientedBoundingBox : statistics.orientedBoundingBox,
                occludeePointInScaledSpace : statistics.occludeePointInScaledSpace,
                encoding : statistics.encoding,
                vertexCountWithoutSkirts : statistics.vertexCountWithoutSkirts,
                indexCountWithoutSkirts : statistics.indexCountWithoutSkirts,
                westIndicesSouthToNorth : statistics.westIndicesSouthToNorth,
                southIndicesEastToWest : statistics.southIndicesEastToWest,
                eastIndicesNorthToSouth : statistics.eastIndicesNorthToSouth,
                northIndicesWestToEast : statistics.northIndicesWestToEast
            };
        }

        var scratchCartographic = new Cartographic.Cartographic();
        var scratchCartesian = new Cartographic.Cartesian3();
        var minimumScratch = new Cartographic.Cartesian3();
        var maximumScratch = new Cartographic.Cartesian3();
        var matrix4Scratch = new BoundingSphere.Matrix4();

        function processBuffer(buffer, relativeToCenter, ellipsoid, rectangle, nativeRectangle, exaggeration, skirtHeight, includeWebMercatorT, negativeAltitudeExponentBias, negativeElevationThreshold) {
            var geographicWest;
            var geographicSouth;
            var geographicEast;
            var geographicNorth;
            var rectangleWidth, rectangleHeight;

            if (!when.defined(rectangle)) {
                geographicWest = _Math.CesiumMath.toRadians(nativeRectangle.west);
                geographicSouth = _Math.CesiumMath.toRadians(nativeRectangle.south);
                geographicEast = _Math.CesiumMath.toRadians(nativeRectangle.east);
                geographicNorth = _Math.CesiumMath.toRadians(nativeRectangle.north);
                rectangleWidth = _Math.CesiumMath.toRadians(rectangle.width);
                rectangleHeight = _Math.CesiumMath.toRadians(rectangle.height);
            } else {
                geographicWest = rectangle.west;
                geographicSouth = rectangle.south;
                geographicEast = rectangle.east;
                geographicNorth = rectangle.north;
                rectangleWidth = rectangle.width;
                rectangleHeight = rectangle.height;
            }

            // Keep track of quad borders so we can remove duplicates around the borders
            var quadBorderLatitudes = [geographicSouth, geographicNorth];
            var quadBorderLongitudes = [geographicWest, geographicEast];

            var fromENU = Transforms.Transforms.eastNorthUpToFixedFrame(relativeToCenter, ellipsoid);
            var toENU = BoundingSphere.Matrix4.inverseTransformation(fromENU, matrix4Scratch);

            var southMercatorY;
            var oneOverMercatorHeight;
            if (includeWebMercatorT) {
                southMercatorY = WebMercatorProjection.WebMercatorProjection.geodeticLatitudeToMercatorAngle(geographicSouth);
                oneOverMercatorHeight = 1.0 / (WebMercatorProjection.WebMercatorProjection.geodeticLatitudeToMercatorAngle(geographicNorth) - southMercatorY);
            }

            var dv = new DataView(buffer);

            var minHeight = Number.POSITIVE_INFINITY;
            var maxHeight = Number.NEGATIVE_INFINITY;

            var minimum = minimumScratch;
            minimum.x = Number.POSITIVE_INFINITY;
            minimum.y = Number.POSITIVE_INFINITY;
            minimum.z = Number.POSITIVE_INFINITY;

            var maximum = maximumScratch;
            maximum.x = Number.NEGATIVE_INFINITY;
            maximum.y = Number.NEGATIVE_INFINITY;
            maximum.z = Number.NEGATIVE_INFINITY;

            // Compute sizes
            var offset = 0;
            var size = 0;
            var indicesSize = 0;
            var quadSize;
            var quad;
            for (quad = 0; quad < 4; ++quad) {
                var o = offset;
                quadSize = dv.getUint32(o, true);
                o += sizeOfUint32;

                var x = _Math.CesiumMath.toRadians(dv.getFloat64(o, true) * 180.0);
                o += sizeOfDouble;
                if (indexOfEpsilon(quadBorderLongitudes, x) === -1) {
                    quadBorderLongitudes.push(x);
                }

                var y = _Math.CesiumMath.toRadians(dv.getFloat64(o, true) * 180.0);
                o += sizeOfDouble;
                if (indexOfEpsilon(quadBorderLatitudes, y) === -1) {
                    quadBorderLatitudes.push(y);
                }

                o += 2 * sizeOfDouble; // stepX + stepY

                var c = dv.getInt32(o, true); // Read point count
                o += sizeOfInt32;
                size += c;

                c = dv.getInt32(o, true); // Read index count
                indicesSize += c * 3;

                offset += quadSize + sizeOfUint32; // Jump to next quad
            }

            // Quad Border points to remove duplicates
            var quadBorderPoints = [];
            var quadBorderIndices = [];

            // Create arrays
            var positions = new Array(size);
            var uvs = new Array(size);
            var heights = new Array(size);
            var webMercatorTs = includeWebMercatorT ? new Array(size) : [];
            var indices = new Array(indicesSize);

            // Points are laid out in rows starting at SW, so storing border points as we
            //  come across them all points will be adjacent.
            var westBorder = [];
            var southBorder = [];
            var eastBorder = [];
            var northBorder = [];

            // Each tile is split into 4 parts
            var pointOffset = 0;
            var indicesOffset = 0;
            offset = 0;
            for (quad = 0; quad < 4; ++quad) {
                quadSize = dv.getUint32(offset, true);
                offset += sizeOfUint32;
                var startQuad = offset;

                var originX = _Math.CesiumMath.toRadians(dv.getFloat64(offset, true) * 180.0);
                offset += sizeOfDouble;

                var originY = _Math.CesiumMath.toRadians(dv.getFloat64(offset, true) * 180.0);
                offset += sizeOfDouble;

                var stepX = _Math.CesiumMath.toRadians(dv.getFloat64(offset, true) * 180.0);
                var halfStepX = stepX * 0.5;
                offset += sizeOfDouble;

                var stepY = _Math.CesiumMath.toRadians(dv.getFloat64(offset, true) * 180.0);
                var halfStepY = stepY * 0.5;
                offset += sizeOfDouble;

                var numPoints = dv.getInt32(offset, true);
                offset += sizeOfInt32;

                var numFaces = dv.getInt32(offset, true);
                offset += sizeOfInt32;

                //var level = dv.getInt32(offset, true);
                offset += sizeOfInt32;

                // Keep track of quad indices to overall tile indices
                var indicesMapping = new Array(numPoints);
                for (var i = 0; i < numPoints; ++i) {
                    var longitude = originX + dv.getUint8(offset++) * stepX;
                    scratchCartographic.longitude = longitude;
                    var latitude = originY + dv.getUint8(offset++) * stepY;
                    scratchCartographic.latitude = latitude;

                    var height = dv.getFloat32(offset, true);
                    offset += sizeOfFloat;

                    // In order to support old clients, negative altitude values are stored as
                    // height/-2^32. Old clients see the value as really close to 0 but new clients multiply
                    // by -2^32 to get the real negative altitude value.
                    if (height !== 0 && height < negativeElevationThreshold) {
                        height *= -Math.pow(2, negativeAltitudeExponentBias);
                    }

                    // Height is stored in units of (1/EarthRadius) or (1/6371010.0)
                    height *= 6371010.0 * exaggeration;

                    scratchCartographic.height = height;

                    // Is it along a quad border - if so check if already exists and use that index
                    if (indexOfEpsilon(quadBorderLongitudes, longitude) !== -1 ||
                        indexOfEpsilon(quadBorderLatitudes, latitude) !== -1) {
                        var index = indexOfEpsilon(quadBorderPoints, scratchCartographic, Cartographic.Cartographic);
                        if (index === -1) {
                            quadBorderPoints.push(Cartographic.Cartographic.clone(scratchCartographic));
                            quadBorderIndices.push(pointOffset);
                        } else {
                            indicesMapping[i] = quadBorderIndices[index];
                            continue;
                        }
                    }
                    indicesMapping[i] = pointOffset;

                    if (Math.abs(longitude - geographicWest) < halfStepX) {
                        westBorder.push({
                            index : pointOffset,
                            cartographic : Cartographic.Cartographic.clone(scratchCartographic)
                        });
                    } else if (Math.abs(longitude - geographicEast) < halfStepX) {
                        eastBorder.push({
                            index : pointOffset,
                            cartographic : Cartographic.Cartographic.clone(scratchCartographic)
                        });
                    } else if (Math.abs(latitude - geographicSouth) < halfStepY) {
                        southBorder.push({
                            index : pointOffset,
                            cartographic : Cartographic.Cartographic.clone(scratchCartographic)
                        });
                    } else if (Math.abs(latitude - geographicNorth) < halfStepY) {
                        northBorder.push({
                            index : pointOffset,
                            cartographic : Cartographic.Cartographic.clone(scratchCartographic)
                        });
                    }

                    minHeight = Math.min(height, minHeight);
                    maxHeight = Math.max(height, maxHeight);
                    heights[pointOffset] = height;

                    var pos = ellipsoid.cartographicToCartesian(scratchCartographic);
                    positions[pointOffset] = pos;

                    if (includeWebMercatorT) {
                        webMercatorTs[pointOffset] = (WebMercatorProjection.WebMercatorProjection.geodeticLatitudeToMercatorAngle(latitude) - southMercatorY) * oneOverMercatorHeight;
                    }

                    BoundingSphere.Matrix4.multiplyByPoint(toENU, pos, scratchCartesian);

                    Cartographic.Cartesian3.minimumByComponent(scratchCartesian, minimum, minimum);
                    Cartographic.Cartesian3.maximumByComponent(scratchCartesian, maximum, maximum);

                    var u = (longitude - geographicWest) / (geographicEast - geographicWest);
                    u = _Math.CesiumMath.clamp(u, 0.0, 1.0);
                    var v = (latitude - geographicSouth) / (geographicNorth - geographicSouth);
                    v = _Math.CesiumMath.clamp(v, 0.0, 1.0);

                    uvs[pointOffset] = new Cartesian2.Cartesian2(u, v);
                    ++pointOffset;
                }

                var facesElementCount = numFaces * 3;
                for (var j = 0; j < facesElementCount; ++j, ++indicesOffset) {
                    indices[indicesOffset] = indicesMapping[dv.getUint16(offset, true)];
                    offset += sizeOfUint16;
                }

                if (quadSize !== (offset - startQuad)) {
                    throw new RuntimeError.RuntimeError('Invalid terrain tile.');
                }
            }

            positions.length = pointOffset;
            uvs.length = pointOffset;
            heights.length = pointOffset;
            if (includeWebMercatorT) {
                webMercatorTs.length = pointOffset;
            }

            var vertexCountWithoutSkirts = pointOffset;
            var indexCountWithoutSkirts = indicesOffset;

            // Add skirt points
            var skirtOptions = {
                hMin : minHeight,
                lastBorderPoint : undefined,
                skirtHeight : skirtHeight,
                toENU : toENU,
                ellipsoid : ellipsoid,
                minimum : minimum,
                maximum : maximum
            };

            // Sort counter clockwise from NW corner
            // Corner points are in the east/west arrays
            westBorder.sort(function(a, b) {
                return b.cartographic.latitude - a.cartographic.latitude;
            });
            southBorder.sort(function(a, b) {
                return a.cartographic.longitude - b.cartographic.longitude;
            });
            eastBorder.sort(function(a, b) {
                return a.cartographic.latitude - b.cartographic.latitude;
            });
            northBorder.sort(function(a, b) {
                return b.cartographic.longitude - a.cartographic.longitude;
            });

            var percentage = 0.00001;
            addSkirt(positions, heights, uvs, webMercatorTs, indices, skirtOptions,
                westBorder, -percentage * rectangleWidth, true, -percentage * rectangleHeight);
            addSkirt(positions, heights, uvs, webMercatorTs, indices, skirtOptions,
                southBorder, -percentage * rectangleHeight, false);
            addSkirt(positions, heights, uvs, webMercatorTs, indices, skirtOptions,
                eastBorder, percentage * rectangleWidth, true, percentage * rectangleHeight);
            addSkirt(positions, heights, uvs, webMercatorTs, indices, skirtOptions,
                northBorder, percentage * rectangleHeight, false);

            // Since the corner between the north and west sides is in the west array, generate the last
            //  two triangles between the last north vertex and the first west vertex
            if (westBorder.length > 0 && northBorder.length > 0) {
                var firstBorderIndex = westBorder[0].index;
                var firstSkirtIndex = vertexCountWithoutSkirts;
                var lastBorderIndex = northBorder[northBorder.length - 1].index;
                var lastSkirtIndex = positions.length - 1;

                indices.push(lastBorderIndex, lastSkirtIndex, firstSkirtIndex, firstSkirtIndex, firstBorderIndex, lastBorderIndex);
            }

            size = positions.length; // Get new size with skirt vertices

            var boundingSphere3D = BoundingSphere.BoundingSphere.fromPoints(positions);
            var orientedBoundingBox;
            if (when.defined(rectangle)) {
                orientedBoundingBox = OrientedBoundingBox.OrientedBoundingBox.fromRectangle(rectangle, minHeight, maxHeight, ellipsoid);
            }

            var occluder = new TerrainEncoding.EllipsoidalOccluder(ellipsoid);
            var occludeePointInScaledSpace = occluder.computeHorizonCullingPointPossiblyUnderEllipsoid(relativeToCenter, positions, minHeight);

            var aaBox = new EllipsoidTangentPlane.AxisAlignedBoundingBox(minimum, maximum, relativeToCenter);
            var encoding = new TerrainEncoding.TerrainEncoding(aaBox, skirtOptions.hMin, maxHeight, fromENU, false, includeWebMercatorT);
            var vertices = new Float32Array(size * encoding.getStride());

            var bufferIndex = 0;
            for (var k = 0; k < size; ++k) {
                bufferIndex = encoding.encode(vertices, bufferIndex, positions[k], uvs[k], heights[k], undefined, webMercatorTs[k]);
            }

            var westIndicesSouthToNorth = westBorder.map(function(vertex) { return vertex.index; }).reverse();
            var southIndicesEastToWest = southBorder.map(function(vertex) { return vertex.index; }).reverse();
            var eastIndicesNorthToSouth = eastBorder.map(function(vertex) { return vertex.index; }).reverse();
            var northIndicesWestToEast = northBorder.map(function(vertex) { return vertex.index; }).reverse();

            southIndicesEastToWest.unshift(eastIndicesNorthToSouth[eastIndicesNorthToSouth.length - 1]);
            southIndicesEastToWest.push(westIndicesSouthToNorth[0]);

            northIndicesWestToEast.unshift(westIndicesSouthToNorth[westIndicesSouthToNorth.length - 1]);
            northIndicesWestToEast.push(eastIndicesNorthToSouth[0]);

            return {
                vertices : vertices,
                indices : new Uint16Array(indices),
                maximumHeight : maxHeight,
                minimumHeight : minHeight,
                encoding : encoding,
                boundingSphere3D : boundingSphere3D,
                orientedBoundingBox : orientedBoundingBox,
                occludeePointInScaledSpace : occludeePointInScaledSpace,
                vertexCountWithoutSkirts : vertexCountWithoutSkirts,
                indexCountWithoutSkirts : indexCountWithoutSkirts,
                westIndicesSouthToNorth : westIndicesSouthToNorth,
                southIndicesEastToWest : southIndicesEastToWest,
                eastIndicesNorthToSouth : eastIndicesNorthToSouth,
                northIndicesWestToEast : northIndicesWestToEast
            };
        }

        function addSkirt(positions, heights, uvs, webMercatorTs, indices, skirtOptions,
                          borderPoints, fudgeFactor, eastOrWest, cornerFudge) {
            var count = borderPoints.length;
            for (var j = 0; j < count; ++j) {
                var borderPoint = borderPoints[j];
                var borderCartographic = borderPoint.cartographic;
                var borderIndex = borderPoint.index;
                var currentIndex = positions.length;

                var longitude = borderCartographic.longitude;
                var latitude = borderCartographic.latitude;
                latitude = _Math.CesiumMath.clamp(latitude, -_Math.CesiumMath.PI_OVER_TWO, _Math.CesiumMath.PI_OVER_TWO); // Don't go over the poles
                var height = borderCartographic.height - skirtOptions.skirtHeight;
                skirtOptions.hMin = Math.min(skirtOptions.hMin, height);

                Cartographic.Cartographic.fromRadians(longitude, latitude, height, scratchCartographic);

                // Adjust sides to angle out
                if (eastOrWest) {
                    scratchCartographic.longitude += fudgeFactor;
                }

                // Adjust top or bottom to angle out
                // Since corners are in the east/west arrays angle the first and last points as well
                if (!eastOrWest) {
                    scratchCartographic.latitude += fudgeFactor;
                } else if (j === (count - 1)) {
                    scratchCartographic.latitude += cornerFudge;
                } else if (j === 0) {
                    scratchCartographic.latitude -= cornerFudge;
                }

                var pos = skirtOptions.ellipsoid.cartographicToCartesian(scratchCartographic);
                positions.push(pos);
                heights.push(height);
                uvs.push(Cartesian2.Cartesian2.clone(uvs[borderIndex])); // Copy UVs from border point
                if (webMercatorTs.length > 0) {
                    webMercatorTs.push(webMercatorTs[borderIndex]);
                }

                BoundingSphere.Matrix4.multiplyByPoint(skirtOptions.toENU, pos, scratchCartesian);

                var minimum = skirtOptions.minimum;
                var maximum = skirtOptions.maximum;
                Cartographic.Cartesian3.minimumByComponent(scratchCartesian, minimum, minimum);
                Cartographic.Cartesian3.maximumByComponent(scratchCartesian, maximum, maximum);

                var lastBorderPoint = skirtOptions.lastBorderPoint;
                if (when.defined(lastBorderPoint)) {
                    var lastBorderIndex = lastBorderPoint.index;
                    indices.push(lastBorderIndex, currentIndex - 1, currentIndex, currentIndex, borderIndex, lastBorderIndex);
                }

                skirtOptions.lastBorderPoint = borderPoint;
            }
        }
    var createVerticesFromGoogleEarthEnterpriseBuffer$1 = createTaskProcessorWorker(createVerticesFromGoogleEarthEnterpriseBuffer);

    return createVerticesFromGoogleEarthEnterpriseBuffer$1;

});

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
define(['exports', './when-8d13db60', './Math-61ede240', './Cartographic-fe4be337', './BoundingSphere-775c5788', './Transforms-913163ed', './EllipsoidTangentPlane-605dc181', './PolygonPipeline-62047934', './PolylinePipeline-a9f32196'], function (exports, when, _Math, Cartographic, BoundingSphere, Transforms, EllipsoidTangentPlane, PolygonPipeline, PolylinePipeline) { 'use strict';

    /**
         * private
         */
        var WallGeometryLibrary = {};

        function latLonEquals(c0, c1) {
            return ((_Math.CesiumMath.equalsEpsilon(c0.latitude, c1.latitude, _Math.CesiumMath.EPSILON14)) && (_Math.CesiumMath.equalsEpsilon(c0.longitude, c1.longitude, _Math.CesiumMath.EPSILON14)));
        }

        var scratchCartographic1 = new Cartographic.Cartographic();
        var scratchCartographic2 = new Cartographic.Cartographic();
        function removeDuplicates(ellipsoid, positions, topHeights, bottomHeights) {
            var length = positions.length;
            if (length < 2) {
                return;
            }

            var hasBottomHeights = when.defined(bottomHeights);
            var hasTopHeights = when.defined(topHeights);
            var hasAllZeroHeights = true;

            var cleanedPositions = new Array(length);
            var cleanedTopHeights = new Array(length);
            var cleanedBottomHeights = new Array(length);

            var v0 = positions[0];
            cleanedPositions[0] = v0;

            var c0 = ellipsoid.cartesianToCartographic(v0, scratchCartographic1);
            if (hasTopHeights) {
                c0.height = topHeights[0];
            }

            hasAllZeroHeights = hasAllZeroHeights && c0.height <= 0;

            cleanedTopHeights[0] = c0.height;

            if (hasBottomHeights) {
                cleanedBottomHeights[0] = bottomHeights[0];
            } else {
                cleanedBottomHeights[0] = 0.0;
            }

            var index = 1;
            for (var i = 1; i < length; ++i) {
                var v1 = positions[i];
                var c1 = ellipsoid.cartesianToCartographic(v1, scratchCartographic2);
                if (hasTopHeights) {
                    c1.height = topHeights[i];
                }
                hasAllZeroHeights = hasAllZeroHeights && c1.height <= 0;

                if (!latLonEquals(c0, c1)) {
                    cleanedPositions[index] = v1; // Shallow copy!
                    cleanedTopHeights[index] = c1.height;

                    if (hasBottomHeights) {
                        cleanedBottomHeights[index] = bottomHeights[i];
                    } else {
                        cleanedBottomHeights[index] = 0.0;
                    }

                    Cartographic.Cartographic.clone(c1, c0);
                    ++index;
                } else if (c0.height < c1.height) {
                    cleanedTopHeights[index - 1] = c1.height;
                }
            }

            if (hasAllZeroHeights || index < 2) {
                return;
            }

            cleanedPositions.length = index;
            cleanedTopHeights.length = index;
            cleanedBottomHeights.length = index;

            return {
                positions: cleanedPositions,
                topHeights: cleanedTopHeights,
                bottomHeights: cleanedBottomHeights
            };
        }

        var positionsArrayScratch = new Array(2);
        var heightsArrayScratch = new Array(2);
        var generateArcOptionsScratch = {
            positions : undefined,
            height : undefined,
            granularity : undefined,
            ellipsoid : undefined
        };

        /**
         * @private
         */
        WallGeometryLibrary.computePositions = function(ellipsoid, wallPositions, maximumHeights, minimumHeights, granularity, duplicateCorners, enuCenter) {
            var o = removeDuplicates(ellipsoid, wallPositions, maximumHeights, minimumHeights);

            if (!when.defined(o)) {
                return;
            }

            var enu = Transforms.Transforms.eastNorthUpToFixedFrame(o.positions[0], ellipsoid, new BoundingSphere.Matrix4());
            var enuInverse = BoundingSphere.Matrix4.inverse(enu, new BoundingSphere.Matrix4());

            wallPositions = o.positions;
            maximumHeights = o.topHeights;
            minimumHeights = o.bottomHeights;

            if (wallPositions.length >= 3) {
                // Order positions counter-clockwise
                var tangentPlane = EllipsoidTangentPlane.EllipsoidTangentPlane.fromPoints(wallPositions, ellipsoid);
                var positions2D = tangentPlane.projectPointsOntoPlane(wallPositions);

                if (PolygonPipeline.PolygonPipeline.computeWindingOrder2D(positions2D) === PolygonPipeline.WindingOrder.CLOCKWISE) {
                    wallPositions.reverse();
                    maximumHeights.reverse();
                    minimumHeights.reverse();
                }
            }

            var length = wallPositions.length;
            var numCorners = length - 2;
            var topPositions;
            var bottomPositions;
            var localTopPositions;
            var localBottomPositions;

            var minDistance = _Math.CesiumMath.chordLength(granularity, ellipsoid.maximumRadius);

            var generateArcOptions = generateArcOptionsScratch;
            generateArcOptions.minDistance = minDistance;
            generateArcOptions.ellipsoid = ellipsoid;

            if (duplicateCorners) {
                var count = 0;
                var i;

                for (i = 0; i < length - 1; i++) {
                    count += PolylinePipeline.PolylinePipeline.numberOfPoints(wallPositions[i], wallPositions[i+1], minDistance) + 1;
                }

                topPositions = new Float64Array(count * 3);
                bottomPositions = new Float64Array(count * 3);

                if(when.defined(enuCenter)) {
                    localTopPositions = new Float64Array(count * 3);
                    localBottomPositions = new Float64Array(count * 3);
                }

                var generateArcPositions = positionsArrayScratch;
                var generateArcHeights = heightsArrayScratch;
                generateArcOptions.positions = generateArcPositions;
                generateArcOptions.height = generateArcHeights;

                var offset = 0;
                for (i = 0; i < length - 1; i++) {
                    generateArcPositions[0] = wallPositions[i];
                    generateArcPositions[1] = wallPositions[i + 1];

                    generateArcHeights[0] = maximumHeights[i];
                    generateArcHeights[1] = maximumHeights[i + 1];

                    var pos = PolylinePipeline.PolylinePipeline.generateArc(generateArcOptions);
                    topPositions.set(pos, offset);
                    if(when.defined(enuCenter)) {
                        localTopPositions.set(transformToENU(pos, enuInverse), offset);
                    }

                    generateArcHeights[0] = minimumHeights[i];
                    generateArcHeights[1] = minimumHeights[i + 1];

                    bottomPositions.set(PolylinePipeline.PolylinePipeline.generateArc(generateArcOptions), offset);
                    if(when.defined(enuCenter)) {
                        localBottomPositions.set(transformToENU(PolylinePipeline.PolylinePipeline.generateArc(generateArcOptions), enuInverse), offset);
                    }

                    offset += pos.length;
                }
            } else {
                generateArcOptions.positions = wallPositions;
                generateArcOptions.height = maximumHeights;
                topPositions = new Float64Array(PolylinePipeline.PolylinePipeline.generateArc(generateArcOptions));
                if(when.defined(enuCenter)) {
                    localTopPositions = new Float64Array(transformToENU(PolylinePipeline.PolylinePipeline.generateArc(generateArcOptions)));
                }

                generateArcOptions.height = minimumHeights;
                bottomPositions = new Float64Array(PolylinePipeline.PolylinePipeline.generateArc(generateArcOptions));
                if(when.defined(enuCenter)) {
                    localBottomPositions = new Float64Array(transformToENU(PolylinePipeline.PolylinePipeline.generateArc(generateArcOptions)));
                }
            }

            var posObj = {
                pos: {
                    bottomPositions: bottomPositions,
                    topPositions: topPositions,
                    numCorners: numCorners
                }
            };
            if(when.defined(enuCenter)) {
                posObj.localPos = {
                    bottomPositions: localBottomPositions,
                    topPositions: localTopPositions,
                    numCorners: numCorners
                };
            }
            return posObj;
        };
        function transformToENU(pos, enuInverse) {
            var localPos = new Array(pos.length);
            for(var j = 0; j < pos.length; j += 3) {
                var cartesian = new Cartographic.Cartesian3(pos[j], pos[j + 1], pos[j + 2]);
                BoundingSphere.Matrix4.multiplyByPoint(enuInverse, cartesian, cartesian);
                localPos[j] = cartesian.x;
                localPos[j + 1] = cartesian.y;
                localPos[j + 2] = cartesian.z;
            }
            return localPos;
        }

    exports.WallGeometryLibrary = WallGeometryLibrary;

});

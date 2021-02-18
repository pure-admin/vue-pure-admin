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
define(['exports', './when-8d13db60', './Check-70bec281', './Math-61ede240', './Cartographic-fe4be337', './Cartesian2-85064f09', './WebGLConstants-4c11ee5f', './ComponentDatatype-5862616f', './GeometryAttribute-06d31d45', './PrimitiveType-97893bc7', './EllipsoidRhumbLine-f161e674', './earcut-2.2.1-b404d9e6'], function (exports, when, Check, _Math, Cartographic, Cartesian2, WebGLConstants, ComponentDatatype, GeometryAttribute, PrimitiveType, EllipsoidRhumbLine, earcut2_2_1) { 'use strict';

    /**
         * Winding order defines the order of vertices for a triangle to be considered front-facing.
         *
         * @exports WindingOrder
         */
        var WindingOrder = {
            /**
             * Vertices are in clockwise order.
             *
             * @type {Number}
             * @constant
             */
            CLOCKWISE : WebGLConstants.WebGLConstants.CW,

            /**
             * Vertices are in counter-clockwise order.
             *
             * @type {Number}
             * @constant
             */
            COUNTER_CLOCKWISE : WebGLConstants.WebGLConstants.CCW,

            /**
             * @private
             */
            validate : function(windingOrder) {
                return windingOrder === WindingOrder.CLOCKWISE ||
                       windingOrder === WindingOrder.COUNTER_CLOCKWISE;
            }
        };
    var WindingOrder$1 = Object.freeze(WindingOrder);

    var scaleToGeodeticHeightN = new Cartographic.Cartesian3();
        var scaleToGeodeticHeightP = new Cartographic.Cartesian3();

        /**
         * @private
         */
        var PolygonPipeline = {};

        /**
         * @exception {DeveloperError} At least three positions are required.
         */
        PolygonPipeline.computeArea2D = function(positions) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('positions', positions);
            Check.Check.typeOf.number.greaterThanOrEquals('positions.length', positions.length, 3);
            //>>includeEnd('debug');

            var length = positions.length;
            var area = 0.0;

            for ( var i0 = length - 1, i1 = 0; i1 < length; i0 = i1++) {
                var v0 = positions[i0];
                var v1 = positions[i1];

                area += (v0.x * v1.y) - (v1.x * v0.y);
            }

            return area * 0.5;
        };

        /**
         * @returns {WindingOrder} The winding order.
         *
         * @exception {DeveloperError} At least three positions are required.
         */
        PolygonPipeline.computeWindingOrder2D = function(positions) {
            var area = PolygonPipeline.computeArea2D(positions);
            return (area > 0.0) ? WindingOrder$1.COUNTER_CLOCKWISE : WindingOrder$1.CLOCKWISE;
        };

        /**
         * Triangulate a polygon.
         *
         * @param {Cartesian2[]} positions Cartesian2 array containing the vertices of the polygon
         * @param {Number[]} [holes] An array of the staring indices of the holes.
         * @returns {Number[]} Index array representing triangles that fill the polygon
         */
        PolygonPipeline.triangulate = function(positions, holes) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('positions', positions);
            //>>includeEnd('debug');

            var flattenedPositions = Cartesian2.Cartesian2.packArray(positions);
            return earcut2_2_1.earcut(flattenedPositions, holes, 2);
        };

        var subdivisionV0Scratch = new Cartographic.Cartesian3();
        var subdivisionV1Scratch = new Cartographic.Cartesian3();
        var subdivisionV2Scratch = new Cartographic.Cartesian3();
        var subdivisionS0Scratch = new Cartographic.Cartesian3();
        var subdivisionS1Scratch = new Cartographic.Cartesian3();
        var subdivisionS2Scratch = new Cartographic.Cartesian3();
        var subdivisionMidScratch = new Cartographic.Cartesian3();

        /**
         * Subdivides positions and raises points to the surface of the ellipsoid.
         *
         * @param {Ellipsoid} ellipsoid The ellipsoid the polygon in on.
         * @param {Cartesian3[]} positions An array of {@link Cartesian3} positions of the polygon.
         * @param {Number[]} indices An array of indices that determines the triangles in the polygon.
         * @param {Number} [granularity=CesiumMath.RADIANS_PER_DEGREE] The distance, in radians, between each latitude and longitude. Determines the number of positions in the buffer.
         *
         * @exception {DeveloperError} At least three indices are required.
         * @exception {DeveloperError} The number of indices must be divisable by three.
         * @exception {DeveloperError} Granularity must be greater than zero.
         */
        PolygonPipeline.computeSubdivision = function(ellipsoid, positions, indices, granularity, hasHeight) {
            hasHeight = when.defaultValue(hasHeight, false);
            granularity = when.defaultValue(granularity, _Math.CesiumMath.RADIANS_PER_DEGREE);

            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('ellipsoid', ellipsoid);
            Check.Check.defined('positions', positions);
            Check.Check.defined('indices', indices);
            Check.Check.typeOf.number.greaterThanOrEquals('indices.length', indices.length, 3);
            Check.Check.typeOf.number.equals('indices.length % 3', '0', indices.length % 3, 0);
            Check.Check.typeOf.number.greaterThan('granularity', granularity, 0.0);
            //>>includeEnd('debug');

            // triangles that need (or might need) to be subdivided.
            var triangles = indices.slice(0);

            // New positions due to edge splits are appended to the positions list.
            var i;
            var length = positions.length;
            var subdividedPositions = new Array(length * 3);
            var q = 0;
            for (i = 0; i < length; i++) {
                var item = positions[i];
                subdividedPositions[q++] = item.x;
                subdividedPositions[q++] = item.y;
                subdividedPositions[q++] = item.z;
            }

            var subdividedIndices = [];

            // Used to make sure shared edges are not split more than once.
            var edges = {};

            var radius = ellipsoid.maximumRadius;
            var minDistance = _Math.CesiumMath.chordLength(granularity, radius);
            var minDistanceSqrd = minDistance * minDistance;

            while (triangles.length > 0) {
                var i2 = triangles.pop();
                var i1 = triangles.pop();
                var i0 = triangles.pop();

                var v0 = Cartographic.Cartesian3.fromArray(subdividedPositions, i0 * 3, subdivisionV0Scratch);
                var v1 = Cartographic.Cartesian3.fromArray(subdividedPositions, i1 * 3, subdivisionV1Scratch);
                var v2 = Cartographic.Cartesian3.fromArray(subdividedPositions, i2 * 3, subdivisionV2Scratch);

                var s0 = hasHeight ? v0 : Cartographic.Cartesian3.multiplyByScalar(Cartographic.Cartesian3.normalize(v0, subdivisionS0Scratch), radius, subdivisionS0Scratch);
                var s1 = hasHeight ? v1 : Cartographic.Cartesian3.multiplyByScalar(Cartographic.Cartesian3.normalize(v1, subdivisionS1Scratch), radius, subdivisionS1Scratch);
                var s2 = hasHeight ? v2 : Cartographic.Cartesian3.multiplyByScalar(Cartographic.Cartesian3.normalize(v2, subdivisionS2Scratch), radius, subdivisionS2Scratch);
        
                var g0 = Cartographic.Cartesian3.magnitudeSquared(Cartographic.Cartesian3.subtract(s0, s1, subdivisionMidScratch));
                var g1 = Cartographic.Cartesian3.magnitudeSquared(Cartographic.Cartesian3.subtract(s1, s2, subdivisionMidScratch));
                var g2 = Cartographic.Cartesian3.magnitudeSquared(Cartographic.Cartesian3.subtract(s2, s0, subdivisionMidScratch));

                var max = Math.max(g0, g1, g2);
                var edge;
                var mid;

                // if the max length squared of a triangle edge is greater than the chord length of squared
                // of the granularity, subdivide the triangle
                if (max > minDistanceSqrd) {
                    if (g0 === max) {
                        edge = Math.min(i0, i1) + ' ' + Math.max(i0, i1);

                        i = edges[edge];
                        if (!when.defined(i)) {
                            mid = Cartographic.Cartesian3.add(v0, v1, subdivisionMidScratch);
                            Cartographic.Cartesian3.multiplyByScalar(mid, 0.5, mid);
                            subdividedPositions.push(mid.x, mid.y, mid.z);
                            i = subdividedPositions.length / 3 - 1;
                            edges[edge] = i;
                        }

                        triangles.push(i0, i, i2);
                        triangles.push(i, i1, i2);
                    } else if (g1 === max) {
                        edge = Math.min(i1, i2) + ' ' + Math.max(i1, i2);

                        i = edges[edge];
                        if (!when.defined(i)) {
                            mid = Cartographic.Cartesian3.add(v1, v2, subdivisionMidScratch);
                            Cartographic.Cartesian3.multiplyByScalar(mid, 0.5, mid);
                            subdividedPositions.push(mid.x, mid.y, mid.z);
                            i = subdividedPositions.length / 3 - 1;
                            edges[edge] = i;
                        }

                        triangles.push(i1, i, i0);
                        triangles.push(i, i2, i0);
                    } else if (g2 === max) {
                        edge = Math.min(i2, i0) + ' ' + Math.max(i2, i0);

                        i = edges[edge];
                        if (!when.defined(i)) {
                            mid = Cartographic.Cartesian3.add(v2, v0, subdivisionMidScratch);
                            Cartographic.Cartesian3.multiplyByScalar(mid, 0.5, mid);
                            subdividedPositions.push(mid.x, mid.y, mid.z);
                            i = subdividedPositions.length / 3 - 1;
                            edges[edge] = i;
                        }

                        triangles.push(i2, i, i1);
                        triangles.push(i, i0, i1);
                    }
                } else {
                    subdividedIndices.push(i0);
                    subdividedIndices.push(i1);
                    subdividedIndices.push(i2);
                }
            }

            return new GeometryAttribute.Geometry({
                attributes : {
                    position : new GeometryAttribute.GeometryAttribute({
                        componentDatatype : ComponentDatatype.ComponentDatatype.DOUBLE,
                        componentsPerAttribute : 3,
                        values : subdividedPositions
                    })
                },
                indices : subdividedIndices,
                primitiveType : PrimitiveType.PrimitiveType.TRIANGLES
            });
        };

        var subdivisionC0Scratch = new Cartographic.Cartographic();
        var subdivisionC1Scratch = new Cartographic.Cartographic();
        var subdivisionC2Scratch = new Cartographic.Cartographic();
        var subdivisionCartographicScratch = new Cartographic.Cartographic();

        /**
         * Subdivides positions on rhumb lines and raises points to the surface of the ellipsoid.
         *
         * @param {Ellipsoid} ellipsoid The ellipsoid the polygon in on.
         * @param {Cartesian3[]} positions An array of {@link Cartesian3} positions of the polygon.
         * @param {Number[]} indices An array of indices that determines the triangles in the polygon.
         * @param {Number} [granularity=CesiumMath.RADIANS_PER_DEGREE] The distance, in radians, between each latitude and longitude. Determines the number of positions in the buffer.
         *
         * @exception {DeveloperError} At least three indices are required.
         * @exception {DeveloperError} The number of indices must be divisable by three.
         * @exception {DeveloperError} Granularity must be greater than zero.
         */
        PolygonPipeline.computeRhumbLineSubdivision = function(ellipsoid, positions, indices, granularity) {
            granularity = when.defaultValue(granularity, _Math.CesiumMath.RADIANS_PER_DEGREE);

            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('ellipsoid', ellipsoid);
            Check.Check.defined('positions', positions);
            Check.Check.defined('indices', indices);
            Check.Check.typeOf.number.greaterThanOrEquals('indices.length', indices.length, 3);
            Check.Check.typeOf.number.equals('indices.length % 3', '0', indices.length % 3, 0);
            Check.Check.typeOf.number.greaterThan('granularity', granularity, 0.0);
            //>>includeEnd('debug');

            // triangles that need (or might need) to be subdivided.
            var triangles = indices.slice(0);

            // New positions due to edge splits are appended to the positions list.
            var i;
            var length = positions.length;
            var subdividedPositions = new Array(length * 3);
            var q = 0;
            for (i = 0; i < length; i++) {
                var item = positions[i];
                subdividedPositions[q++] = item.x;
                subdividedPositions[q++] = item.y;
                subdividedPositions[q++] = item.z;
            }

            var subdividedIndices = [];

            // Used to make sure shared edges are not split more than once.
            var edges = {};

            var radius = ellipsoid.maximumRadius;
            var minDistance = _Math.CesiumMath.chordLength(granularity, radius);

            var rhumb0 = new EllipsoidRhumbLine.EllipsoidRhumbLine(undefined, undefined, ellipsoid);
            var rhumb1 = new EllipsoidRhumbLine.EllipsoidRhumbLine(undefined, undefined, ellipsoid);
            var rhumb2 = new EllipsoidRhumbLine.EllipsoidRhumbLine(undefined, undefined, ellipsoid);

            while (triangles.length > 0) {
                var i2 = triangles.pop();
                var i1 = triangles.pop();
                var i0 = triangles.pop();

                var v0 = Cartographic.Cartesian3.fromArray(subdividedPositions, i0 * 3, subdivisionV0Scratch);
                var v1 = Cartographic.Cartesian3.fromArray(subdividedPositions, i1 * 3, subdivisionV1Scratch);
                var v2 = Cartographic.Cartesian3.fromArray(subdividedPositions, i2 * 3, subdivisionV2Scratch);

                var c0 = ellipsoid.cartesianToCartographic(v0, subdivisionC0Scratch);
                var c1 = ellipsoid.cartesianToCartographic(v1, subdivisionC1Scratch);
                var c2 = ellipsoid.cartesianToCartographic(v2, subdivisionC2Scratch);

                rhumb0.setEndPoints(c0, c1);
                var g0 = rhumb0.surfaceDistance;
                rhumb1.setEndPoints(c1, c2);
                var g1 = rhumb1.surfaceDistance;
                rhumb2.setEndPoints(c2, c0);
                var g2 = rhumb2.surfaceDistance;

                var max = Math.max(g0, g1, g2);
                var edge;
                var mid;
                var midHeight;
                var midCartesian3;

                // if the max length squared of a triangle edge is greater than granularity, subdivide the triangle
                if (max > minDistance) {
                    if (g0 === max) {
                        edge = Math.min(i0, i1) + ' ' + Math.max(i0, i1);

                        i = edges[edge];
                        if (!when.defined(i)) {
                            mid = rhumb0.interpolateUsingFraction(0.5, subdivisionCartographicScratch);
                            midHeight = (c0.height + c1.height) * 0.5;
                            midCartesian3 = Cartographic.Cartesian3.fromRadians(mid.longitude, mid.latitude, midHeight, ellipsoid, subdivisionMidScratch);
                            subdividedPositions.push(midCartesian3.x, midCartesian3.y, midCartesian3.z);
                            i = subdividedPositions.length / 3 - 1;
                            edges[edge] = i;
                        }

                        triangles.push(i0, i, i2);
                        triangles.push(i, i1, i2);
                    } else if (g1 === max) {
                        edge = Math.min(i1, i2) + ' ' + Math.max(i1, i2);

                        i = edges[edge];
                        if (!when.defined(i)) {
                            mid = rhumb1.interpolateUsingFraction(0.5, subdivisionCartographicScratch);
                            midHeight = (c1.height + c2.height) * 0.5;
                            midCartesian3 = Cartographic.Cartesian3.fromRadians(mid.longitude, mid.latitude, midHeight, ellipsoid, subdivisionMidScratch);
                            subdividedPositions.push(midCartesian3.x, midCartesian3.y, midCartesian3.z);
                            i = subdividedPositions.length / 3 - 1;
                            edges[edge] = i;
                        }

                        triangles.push(i1, i, i0);
                        triangles.push(i, i2, i0);
                    } else if (g2 === max) {
                        edge = Math.min(i2, i0) + ' ' + Math.max(i2, i0);

                        i = edges[edge];
                        if (!when.defined(i)) {
                            mid = rhumb2.interpolateUsingFraction(0.5, subdivisionCartographicScratch);
                            midHeight = (c2.height + c0.height) * 0.5;
                            midCartesian3 = Cartographic.Cartesian3.fromRadians(mid.longitude, mid.latitude, midHeight, ellipsoid, subdivisionMidScratch);
                            subdividedPositions.push(midCartesian3.x, midCartesian3.y, midCartesian3.z);
                            i = subdividedPositions.length / 3 - 1;
                            edges[edge] = i;
                        }

                        triangles.push(i2, i, i1);
                        triangles.push(i, i0, i1);
                    }
                } else {
                    subdividedIndices.push(i0);
                    subdividedIndices.push(i1);
                    subdividedIndices.push(i2);
                }
            }

            return new GeometryAttribute.Geometry({
                attributes : {
                    position : new GeometryAttribute.GeometryAttribute({
                        componentDatatype : ComponentDatatype.ComponentDatatype.DOUBLE,
                        componentsPerAttribute : 3,
                        values : subdividedPositions
                    })
                },
                indices : subdividedIndices,
                primitiveType : PrimitiveType.PrimitiveType.TRIANGLES
            });
        };

        /**
         * Scales each position of a geometry's position attribute to a height, in place.
         *
         * @param {Number[]} positions The array of numbers representing the positions to be scaled
         * @param {Number} [height=0.0] The desired height to add to the positions
         * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid on which the positions lie.
         * @param {Boolean} [scaleToSurface=true] <code>true</code> if the positions need to be scaled to the surface before the height is added.
         * @returns {Number[]} The input array of positions, scaled to height
         */
        PolygonPipeline.scaleToGeodeticHeight = function(positions, height, ellipsoid, scaleToSurface) {
            ellipsoid = when.defaultValue(ellipsoid, Cartesian2.Ellipsoid.WGS84);

            var n = scaleToGeodeticHeightN;
            var p = scaleToGeodeticHeightP;

            height = when.defaultValue(height, 0.0);
            scaleToSurface = when.defaultValue(scaleToSurface, true);

            if (when.defined(positions)) {
                var length = positions.length;

                for ( var i = 0; i < length; i += 3) {
                    Cartographic.Cartesian3.fromArray(positions, i, p);

                    if (scaleToSurface) {
                        p = ellipsoid.scaleToGeodeticSurface(p, p);
                    }

                    if (height !== 0) {
                        n = ellipsoid.geodeticSurfaceNormal(p, n);

                        Cartographic.Cartesian3.multiplyByScalar(n, height, n);
                        Cartographic.Cartesian3.add(p, n, p);
                    }

                    positions[i] = p.x;
                    positions[i + 1] = p.y;
                    positions[i + 2] = p.z;
                }
            }

            return positions;
        };

    exports.PolygonPipeline = PolygonPipeline;
    exports.WindingOrder = WindingOrder$1;

});

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
define(['exports', './Math-61ede240', './Cartographic-fe4be337', './Cartesian2-85064f09', './BoundingSphere-775c5788', './Cartesian4-5af5bb24', './Transforms-913163ed', './EllipsoidTangentPlane-605dc181', './PolylinePipeline-a9f32196'], function (exports, _Math, Cartographic, Cartesian2, BoundingSphere, Cartesian4, Transforms, EllipsoidTangentPlane, PolylinePipeline) { 'use strict';

    /**
         * Style options for corners.
         *
         * @demo The {@link https://sandcastle.cesium.com/index.html?src=Corridor.html&label=Geometries|Corridor Demo}
         * demonstrates the three corner types, as used by {@link CorridorGraphics}.
         *
         * @exports CornerType
         */
        var CornerType = {
            /**
             * <img src="Images/CornerTypeRounded.png" style="vertical-align: middle;" width="186" height="189" />
             *
             * Corner has a smooth edge.
             * @type {Number}
             * @constant
             */
            ROUNDED : 0,

            /**
             * <img src="Images/CornerTypeMitered.png" style="vertical-align: middle;" width="186" height="189" />
             *
             * Corner point is the intersection of adjacent edges.
             * @type {Number}
             * @constant
             */
            MITERED : 1,

            /**
             * <img src="Images/CornerTypeBeveled.png" style="vertical-align: middle;" width="186" height="189" />
             *
             * Corner is clipped.
             * @type {Number}
             * @constant
             */
            BEVELED : 2
        };
    var CornerType$1 = Object.freeze(CornerType);

    var scratch2Array = [new Cartographic.Cartesian3(), new Cartographic.Cartesian3()];
        var scratchCartesian1 = new Cartographic.Cartesian3();
        var scratchCartesian2 = new Cartographic.Cartesian3();
        var scratchCartesian3 = new Cartographic.Cartesian3();
        var scratchCartesian4 = new Cartographic.Cartesian3();
        var scratchCartesian5 = new Cartographic.Cartesian3();
        var scratchCartesian6 = new Cartographic.Cartesian3();
        var scratchCartesian7 = new Cartographic.Cartesian3();
        var scratchCartesian8 = new Cartographic.Cartesian3();
        var scratchCartesian9 = new Cartographic.Cartesian3();

        var scratch1 = new Cartographic.Cartesian3();
        var scratch2 = new Cartographic.Cartesian3();

        /**
         * @private
         */
        var PolylineVolumeGeometryLibrary = {};

        var cartographic = new Cartographic.Cartographic();
        function scaleToSurface(positions, ellipsoid) {
            var heights = new Array(positions.length);
            for (var i = 0; i < positions.length; i++) {
                var pos = positions[i];
                cartographic = ellipsoid.cartesianToCartographic(pos, cartographic);
                heights[i] = cartographic.height;
                positions[i] = ellipsoid.scaleToGeodeticSurface(pos, pos);
            }
            return heights;
        }

        function subdivideHeights(points, h0, h1, granularity) {
            var p0 = points[0];
            var p1 = points[1];
            var angleBetween = Cartographic.Cartesian3.angleBetween(p0, p1);
            var numPoints = Math.ceil(angleBetween / granularity);
            var heights = new Array(numPoints);
            var i;
            if (h0 === h1) {
                for (i = 0; i < numPoints; i++) {
                    heights[i] = h0;
                }
                heights.push(h1);
                return heights;
            }

            var dHeight = h1 - h0;
            var heightPerVertex = dHeight / (numPoints);

            for (i = 1; i < numPoints; i++) {
                var h = h0 + i * heightPerVertex;
                heights[i] = h;
            }

            heights[0] = h0;
            heights.push(h1);
            return heights;
        }

        var nextScratch = new Cartographic.Cartesian3();
        var prevScratch = new Cartographic.Cartesian3();

        function computeRotationAngle(start, end, position, ellipsoid) {
            var tangentPlane = new EllipsoidTangentPlane.EllipsoidTangentPlane(position, ellipsoid);
            var next = tangentPlane.projectPointOntoPlane(Cartographic.Cartesian3.add(position, start, nextScratch), nextScratch);
            var prev = tangentPlane.projectPointOntoPlane(Cartographic.Cartesian3.add(position, end, prevScratch), prevScratch);
            var angle = Cartesian2.Cartesian2.angleBetween(next, prev);

            return (prev.x * next.y - prev.y * next.x >= 0.0) ? -angle : angle;
        }

        var negativeX = new Cartographic.Cartesian3(-1, 0, 0);
        var transform = BoundingSphere.Matrix4.clone(BoundingSphere.Matrix4.IDENTITY);
        var translation = new BoundingSphere.Matrix4();
        var rotationZ = new BoundingSphere.Matrix3();
        var scaleMatrix = BoundingSphere.Matrix3.IDENTITY.clone();
        var westScratch = new Cartographic.Cartesian3();
        var finalPosScratch = new Cartesian4.Cartesian4();
        var heightCartesian = new Cartographic.Cartesian3();
        function addPosition(center, left, shape, finalPositions, ellipsoid, height, xScalar, repeat) {
            var west = westScratch;
            var finalPosition = finalPosScratch;
            transform = Transforms.Transforms.eastNorthUpToFixedFrame(center, ellipsoid, transform);

            west = BoundingSphere.Matrix4.multiplyByPointAsVector(transform, negativeX, west);
            west = Cartographic.Cartesian3.normalize(west, west);
            var angle = computeRotationAngle(west, left, center, ellipsoid);
            rotationZ = BoundingSphere.Matrix3.fromRotationZ(angle, rotationZ);

            heightCartesian.z = height;
            transform = BoundingSphere.Matrix4.multiplyTransformation(transform, BoundingSphere.Matrix4.fromRotationTranslation(rotationZ, heightCartesian, translation), transform);
            var scale = scaleMatrix;
            scale[0] = xScalar;

            for (var j = 0; j < repeat; j++) {
                for (var i = 0; i < shape.length; i += 3) {
                    finalPosition = Cartographic.Cartesian3.fromArray(shape, i, finalPosition);
                    finalPosition = BoundingSphere.Matrix3.multiplyByVector(scale, finalPosition, finalPosition);
                    finalPosition = BoundingSphere.Matrix4.multiplyByPoint(transform, finalPosition, finalPosition);
                    finalPositions.push(finalPosition.x, finalPosition.y, finalPosition.z);
                }
            }

            return finalPositions;
        }

        function addPositionLocal(center, left, shape, finalPositions, ellipsoid, height, xScalar, repeat, enuInverse) {
            var west = westScratch;
            var finalPosition = finalPosScratch;
            transform = Transforms.Transforms.eastNorthUpToFixedFrame(center, ellipsoid, transform);
            west = BoundingSphere.Matrix4.multiplyByPointAsVector(transform, negativeX, west);
            west = Cartographic.Cartesian3.normalize(west, west);
            var angle = computeRotationAngle(west, left, center, ellipsoid);
            rotationZ = BoundingSphere.Matrix3.fromRotationZ(angle, rotationZ);

            heightCartesian.z = height;
            transform = BoundingSphere.Matrix4.multiplyTransformation(transform, BoundingSphere.Matrix4.fromRotationTranslation(rotationZ, heightCartesian, translation), transform);
            var scale = scaleMatrix;
            scale[0] = xScalar;

            for (var j = 0; j < repeat; j++) {
                for (var i = 0; i < shape.length; i += 3) {
                    finalPosition = Cartographic.Cartesian3.fromArray(shape, i, finalPosition);
                    finalPosition = BoundingSphere.Matrix3.multiplyByVector(scale, finalPosition, finalPosition);
                    finalPosition = BoundingSphere.Matrix4.multiplyByPoint(transform, finalPosition, finalPosition);
                    finalPosition = BoundingSphere.Matrix4.multiplyByPoint(enuInverse, finalPosition, finalPosition);
                    finalPositions.push(finalPosition.x, finalPosition.y, finalPosition.z);
                }
            }

            return finalPositions;
        }

        var centerScratch = new Cartographic.Cartesian3();
        function addPositions(centers, left, shape, finalPositions, ellipsoid, heights, xScalar) {
            for (var i = 0; i < centers.length; i += 3) {
                var center = Cartographic.Cartesian3.fromArray(centers, i, centerScratch);
                finalPositions = addPosition(center, left, shape, finalPositions, ellipsoid, heights[i / 3], xScalar, 1);
            }
            return finalPositions;
        }

        function addLocalPositions(centers, left, shape, finalPositions, ellipsoid, heights, xScalar, enuInverse) {
            for (var i = 0; i < centers.length; i += 3) {
                var center = Cartographic.Cartesian3.fromArray(centers, i, centerScratch);
                finalPositions = addPositionLocal(center, left, shape, finalPositions, ellipsoid, heights[i / 3], xScalar, 1, enuInverse);
            }
            return finalPositions;
        }

        function convertShapeTo3DDuplicate(shape2D, boundingRectangle) { //orientate 2D shape to XZ plane center at (0, 0, 0), duplicate points
            var length = shape2D.length;
            var shape = new Array(length * 6);
            var index = 0;
            var xOffset = boundingRectangle.x + boundingRectangle.width / 2;
            var yOffset = boundingRectangle.y + boundingRectangle.height / 2;

            var point = shape2D[0];
            shape[index++] = point.x - xOffset;
            shape[index++] = 0.0;
            shape[index++] = point.y - yOffset;
            for (var i = 1; i < length; i++) {
                point = shape2D[i];
                var x = point.x - xOffset;
                var z = point.y - yOffset;
                shape[index++] = x;
                shape[index++] = 0.0;
                shape[index++] = z;

                shape[index++] = x;
                shape[index++] = 0.0;
                shape[index++] = z;
            }
            point = shape2D[0];
            shape[index++] = point.x - xOffset;
            shape[index++] = 0.0;
            shape[index++] = point.y - yOffset;

            return shape;
        }

        function convertShapeTo3D(shape2D, boundingRectangle) { //orientate 2D shape to XZ plane center at (0, 0, 0)
            var length = shape2D.length;
            var shape = new Array(length * 3);
            var index = 0;
            var xOffset = boundingRectangle.x + boundingRectangle.width / 2;
            var yOffset = boundingRectangle.y + boundingRectangle.height / 2;

            for (var i = 0; i < length; i++) {
                shape[index++] = shape2D[i].x - xOffset;
                shape[index++] = 0;
                shape[index++] = shape2D[i].y - yOffset;
            }

            return shape;
        }

        var quaterion = new Transforms.Quaternion();
        var startPointScratch = new Cartographic.Cartesian3();
        var rotMatrix = new BoundingSphere.Matrix3();
        function computeRoundCorner(pivot, startPoint, endPoint, cornerType, leftIsOutside, ellipsoid, finalPositions, shape, height, duplicatePoints) {
            var angle = Cartographic.Cartesian3.angleBetween(Cartographic.Cartesian3.subtract(startPoint, pivot, scratch1), Cartographic.Cartesian3.subtract(endPoint, pivot, scratch2));
            var granularity = (cornerType === CornerType$1.BEVELED) ? 0 : Math.ceil(angle / _Math.CesiumMath.toRadians(5));

            var m;
            if (leftIsOutside) {
                m = BoundingSphere.Matrix3.fromQuaternion(Transforms.Quaternion.fromAxisAngle(Cartographic.Cartesian3.negate(pivot, scratch1), angle / (granularity + 1), quaterion), rotMatrix);
            } else {
                m = BoundingSphere.Matrix3.fromQuaternion(Transforms.Quaternion.fromAxisAngle(pivot, angle / (granularity + 1), quaterion), rotMatrix);
            }

            var left;
            var surfacePoint;
            startPoint = Cartographic.Cartesian3.clone(startPoint, startPointScratch);
            if (granularity > 0) {
                var repeat = duplicatePoints ? 2 : 1;
                for (var i = 0; i < granularity; i++) {
                    startPoint = BoundingSphere.Matrix3.multiplyByVector(m, startPoint, startPoint);
                    left = Cartographic.Cartesian3.subtract(startPoint, pivot, scratch1);
                    left = Cartographic.Cartesian3.normalize(left, left);
                    if (!leftIsOutside) {
                        left = Cartographic.Cartesian3.negate(left, left);
                    }
                    surfacePoint = ellipsoid.scaleToGeodeticSurface(startPoint, scratch2);
                    finalPositions = addPosition(surfacePoint, left, shape, finalPositions, ellipsoid, height, 1, repeat);
                }
            } else {
                left = Cartographic.Cartesian3.subtract(startPoint, pivot, scratch1);
                left = Cartographic.Cartesian3.normalize(left, left);
                if (!leftIsOutside) {
                    left = Cartographic.Cartesian3.negate(left, left);
                }
                surfacePoint = ellipsoid.scaleToGeodeticSurface(startPoint, scratch2);
                finalPositions = addPosition(surfacePoint, left, shape, finalPositions, ellipsoid, height, 1, 1);

                endPoint = Cartographic.Cartesian3.clone(endPoint, startPointScratch);
                left = Cartographic.Cartesian3.subtract(endPoint, pivot, scratch1);
                left = Cartographic.Cartesian3.normalize(left, left);
                if (!leftIsOutside) {
                    left = Cartographic.Cartesian3.negate(left, left);
                }
                surfacePoint = ellipsoid.scaleToGeodeticSurface(endPoint, scratch2);
                finalPositions = addPosition(surfacePoint, left, shape, finalPositions, ellipsoid, height, 1, 1);
            }

            return finalPositions;
        }

        PolylineVolumeGeometryLibrary.removeDuplicatesFromShape = function(shapePositions) {
            var length = shapePositions.length;
            var cleanedPositions = [];
            for (var i0 = length - 1, i1 = 0; i1 < length; i0 = i1++) {
                var v0 = shapePositions[i0];
                var v1 = shapePositions[i1];

                if (!Cartesian2.Cartesian2.equals(v0, v1)) {
                    cleanedPositions.push(v1); // Shallow copy!
                }
            }

            return cleanedPositions;
        };

        PolylineVolumeGeometryLibrary.angleIsGreaterThanPi = function(forward, backward, position, ellipsoid) {
            var tangentPlane = new EllipsoidTangentPlane.EllipsoidTangentPlane(position, ellipsoid);
            var next = tangentPlane.projectPointOntoPlane(Cartographic.Cartesian3.add(position, forward, nextScratch), nextScratch);
            var prev = tangentPlane.projectPointOntoPlane(Cartographic.Cartesian3.add(position, backward, prevScratch), prevScratch);

            return ((prev.x * next.y) - (prev.y * next.x)) >= 0.0;
        };

        var scratchForwardProjection = new Cartographic.Cartesian3();
        var scratchBackwardProjection = new Cartographic.Cartesian3();

        PolylineVolumeGeometryLibrary.computePositions = function(positions, shape2D, boundingRectangle, geometry, duplicatePoints) {
            var ellipsoid = geometry._ellipsoid;
            var heights = scaleToSurface(positions, ellipsoid);
            var granularity = geometry._granularity;
            var cornerType = geometry._cornerType;
            var shapeForSides = duplicatePoints ? convertShapeTo3DDuplicate(shape2D, boundingRectangle) : convertShapeTo3D(shape2D, boundingRectangle);
            var shapeForEnds = duplicatePoints ? convertShapeTo3D(shape2D, boundingRectangle) : undefined;
            var heightOffset = boundingRectangle.height / 2;
            var width = boundingRectangle.width / 2;
            var length = positions.length;
            var finalPositions = [];
            var ends = duplicatePoints ? [] : undefined;

            var forward = scratchCartesian1;
            var backward = scratchCartesian2;
            var cornerDirection = scratchCartesian3;
            var surfaceNormal = scratchCartesian4;
            var pivot = scratchCartesian5;
            var start = scratchCartesian6;
            var end = scratchCartesian7;
            var left = scratchCartesian8;
            var previousPosition = scratchCartesian9;

            var position = positions[0];
            var nextPosition = positions[1];
            surfaceNormal = ellipsoid.geodeticSurfaceNormal(position, surfaceNormal);
            forward = Cartographic.Cartesian3.subtract(nextPosition, position, forward);
            forward = Cartographic.Cartesian3.normalize(forward, forward);
            left = Cartographic.Cartesian3.cross(surfaceNormal, forward, left);
            left = Cartographic.Cartesian3.normalize(left, left);
            var h0 = heights[0];
            var h1 = heights[1];
            if (duplicatePoints) {
                ends = addPosition(position, left, shapeForEnds, ends, ellipsoid, h0 + heightOffset, 1, 1);
            }
            previousPosition = Cartographic.Cartesian3.clone(position, previousPosition);
            position = nextPosition;
            backward = Cartographic.Cartesian3.negate(forward, backward);
            var subdividedHeights;
            var subdividedPositions;
            for (var i = 1; i < length - 1; i++) {
                var repeat = duplicatePoints ? 2 : 1;
                nextPosition = positions[i + 1];
                forward = Cartographic.Cartesian3.subtract(nextPosition, position, forward);
                forward = Cartographic.Cartesian3.normalize(forward, forward);
                cornerDirection = Cartographic.Cartesian3.add(forward, backward, cornerDirection);
                cornerDirection = Cartographic.Cartesian3.normalize(cornerDirection, cornerDirection);
                surfaceNormal = ellipsoid.geodeticSurfaceNormal(position, surfaceNormal);

                var forwardProjection = Cartographic.Cartesian3.multiplyByScalar(surfaceNormal, Cartographic.Cartesian3.dot(forward, surfaceNormal), scratchForwardProjection);
                Cartographic.Cartesian3.subtract(forward, forwardProjection, forwardProjection);
                Cartographic.Cartesian3.normalize(forwardProjection, forwardProjection);

                var backwardProjection = Cartographic.Cartesian3.multiplyByScalar(surfaceNormal, Cartographic.Cartesian3.dot(backward, surfaceNormal), scratchBackwardProjection);
                Cartographic.Cartesian3.subtract(backward, backwardProjection, backwardProjection);
                Cartographic.Cartesian3.normalize(backwardProjection, backwardProjection);

                var doCorner = !_Math.CesiumMath.equalsEpsilon(Math.abs(Cartographic.Cartesian3.dot(forwardProjection, backwardProjection)), 1.0, _Math.CesiumMath.EPSILON7);

                if (doCorner) {
                    cornerDirection = Cartographic.Cartesian3.cross(cornerDirection, surfaceNormal, cornerDirection);
                    cornerDirection = Cartographic.Cartesian3.cross(surfaceNormal, cornerDirection, cornerDirection);
                    cornerDirection = Cartographic.Cartesian3.normalize(cornerDirection, cornerDirection);
                    var scalar = 1 / Math.max(0.25, (Cartographic.Cartesian3.magnitude(Cartographic.Cartesian3.cross(cornerDirection, backward, scratch1))));
                    var leftIsOutside = PolylineVolumeGeometryLibrary.angleIsGreaterThanPi(forward, backward, position, ellipsoid);
                    if (leftIsOutside) {
                        pivot = Cartographic.Cartesian3.add(position, Cartographic.Cartesian3.multiplyByScalar(cornerDirection, scalar * width, cornerDirection), pivot);
                        start = Cartographic.Cartesian3.add(pivot, Cartographic.Cartesian3.multiplyByScalar(left, width, start), start);
                        scratch2Array[0] = Cartographic.Cartesian3.clone(previousPosition, scratch2Array[0]);
                        scratch2Array[1] = Cartographic.Cartesian3.clone(start, scratch2Array[1]);
                        subdividedHeights = subdivideHeights(scratch2Array, h0 + heightOffset, h1 + heightOffset, granularity);
                        subdividedPositions = PolylinePipeline.PolylinePipeline.generateArc({
                            positions: scratch2Array,
                            granularity: granularity,
                            ellipsoid: ellipsoid
                        });
                        finalPositions = addPositions(subdividedPositions, left, shapeForSides, finalPositions, ellipsoid, subdividedHeights, 1);
                        left = Cartographic.Cartesian3.cross(surfaceNormal, forward, left);
                        left = Cartographic.Cartesian3.normalize(left, left);
                        end = Cartographic.Cartesian3.add(pivot, Cartographic.Cartesian3.multiplyByScalar(left, width, end), end);
                        if (cornerType === CornerType$1.ROUNDED || cornerType === CornerType$1.BEVELED) {
                            computeRoundCorner(pivot, start, end, cornerType, leftIsOutside, ellipsoid, finalPositions, shapeForSides, h1 + heightOffset, duplicatePoints);
                        } else {
                            cornerDirection = Cartographic.Cartesian3.negate(cornerDirection, cornerDirection);
                            finalPositions = addPosition(position, cornerDirection, shapeForSides, finalPositions, ellipsoid, h1 + heightOffset, scalar, repeat);
                        }
                        previousPosition = Cartographic.Cartesian3.clone(end, previousPosition);
                    } else {
                        pivot = Cartographic.Cartesian3.add(position, Cartographic.Cartesian3.multiplyByScalar(cornerDirection, scalar * width, cornerDirection), pivot);
                        start = Cartographic.Cartesian3.add(pivot, Cartographic.Cartesian3.multiplyByScalar(left, -width, start), start);
                        scratch2Array[0] = Cartographic.Cartesian3.clone(previousPosition, scratch2Array[0]);
                        scratch2Array[1] = Cartographic.Cartesian3.clone(start, scratch2Array[1]);
                        subdividedHeights = subdivideHeights(scratch2Array, h0 + heightOffset, h1 + heightOffset, granularity);
                        subdividedPositions = PolylinePipeline.PolylinePipeline.generateArc({
                            positions: scratch2Array,
                            granularity: granularity,
                            ellipsoid: ellipsoid
                        });
                        finalPositions = addPositions(subdividedPositions, left, shapeForSides, finalPositions, ellipsoid, subdividedHeights, 1);
                        left = Cartographic.Cartesian3.cross(surfaceNormal, forward, left);
                        left = Cartographic.Cartesian3.normalize(left, left);
                        end = Cartographic.Cartesian3.add(pivot, Cartographic.Cartesian3.multiplyByScalar(left, -width, end), end);
                        if (cornerType === CornerType$1.ROUNDED || cornerType === CornerType$1.BEVELED) {
                            computeRoundCorner(pivot, start, end, cornerType, leftIsOutside, ellipsoid, finalPositions, shapeForSides, h1 + heightOffset, duplicatePoints);
                        } else {
                            finalPositions = addPosition(position, cornerDirection, shapeForSides, finalPositions, ellipsoid, h1 + heightOffset, scalar, repeat);
                        }
                        previousPosition = Cartographic.Cartesian3.clone(end, previousPosition);
                    }
                    backward = Cartographic.Cartesian3.negate(forward, backward);
                } else {
                    finalPositions = addPosition(previousPosition, left, shapeForSides, finalPositions, ellipsoid, h0 + heightOffset, 1, 1);
                    previousPosition = position;
                }
                h0 = h1;
                h1 = heights[i + 1];
                position = nextPosition;
            }

            scratch2Array[0] = Cartographic.Cartesian3.clone(previousPosition, scratch2Array[0]);
            scratch2Array[1] = Cartographic.Cartesian3.clone(position, scratch2Array[1]);
            subdividedHeights = subdivideHeights(scratch2Array, h0 + heightOffset, h1 + heightOffset, granularity);
            subdividedPositions = PolylinePipeline.PolylinePipeline.generateArc({
                positions: scratch2Array,
                granularity: granularity,
                ellipsoid: ellipsoid
            });
            finalPositions = addPositions(subdividedPositions, left, shapeForSides, finalPositions, ellipsoid, subdividedHeights, 1);
            if (duplicatePoints) {
                ends = addPosition(position, left, shapeForEnds, ends, ellipsoid, h1 + heightOffset, 1, 1);
            }

            length = finalPositions.length;
            var posLength = duplicatePoints ? length + ends.length : length;
            var combinedPositions = new Float64Array(posLength);
            combinedPositions.set(finalPositions);
            if (duplicatePoints) {
                combinedPositions.set(ends, length);
            }

            return combinedPositions;
        };

        PolylineVolumeGeometryLibrary.computeLocalPositions = function(positions, shape2D, boundingRectangle, geometry, duplicatePoints, enuCenter) {
            var ellipsoid = geometry._ellipsoid;
            var heights = scaleToSurface(positions, ellipsoid);
            var granularity = geometry._granularity;
            var cornerType = geometry._cornerType;
            var shapeForSides = duplicatePoints ? convertShapeTo3DDuplicate(shape2D, boundingRectangle) : convertShapeTo3D(shape2D, boundingRectangle);
            var shapeForEnds = duplicatePoints ? convertShapeTo3D(shape2D, boundingRectangle) : undefined;
            var heightOffset = 0; //保证放样模型处于放样点的中心点
            var width = boundingRectangle.width / 2;
            var length = positions.length;
            var finalPositions = [];
            var ends = duplicatePoints ? [] : undefined;

            var forward = scratchCartesian1;
            var backward = scratchCartesian2;
            var cornerDirection = scratchCartesian3;
            var surfaceNormal = scratchCartesian4;
            var pivot = scratchCartesian5;
            var start = scratchCartesian6;
            var end = scratchCartesian7;
            var left = scratchCartesian8;
            var previousPosition = scratchCartesian9;

            var enu = Transforms.Transforms.eastNorthUpToFixedFrame(enuCenter, ellipsoid, new BoundingSphere.Matrix4());
            var enuInverse = BoundingSphere.Matrix4.inverse(enu, new BoundingSphere.Matrix4());
            var position = positions[0];
            var nextPosition = positions[1];
            surfaceNormal = ellipsoid.geodeticSurfaceNormal(position, surfaceNormal);
            forward = Cartographic.Cartesian3.subtract(nextPosition, position, forward);
            forward = Cartographic.Cartesian3.normalize(forward, forward);
            left = Cartographic.Cartesian3.cross(surfaceNormal, forward, left);
            left = Cartographic.Cartesian3.normalize(left, left);
            var h0 = heights[0];
            var h1 = heights[1];
            if (duplicatePoints) {
                ends = addPositionLocal(position, left, shapeForEnds, ends, ellipsoid, h0 + heightOffset, 1, 1, enuInverse);
            }
            previousPosition = Cartographic.Cartesian3.clone(position, previousPosition);
            position = nextPosition;
            backward = Cartographic.Cartesian3.negate(forward, backward);
            var subdividedHeights;
            var subdividedPositions;
            for (var i = 1; i < length - 1; i++) {
                var repeat = duplicatePoints ? 2 : 1;
                nextPosition = positions[i + 1];
                forward = Cartographic.Cartesian3.subtract(nextPosition, position, forward);
                forward = Cartographic.Cartesian3.normalize(forward, forward);
                cornerDirection = Cartographic.Cartesian3.add(forward, backward, cornerDirection);
                cornerDirection = Cartographic.Cartesian3.normalize(cornerDirection, cornerDirection);
                surfaceNormal = ellipsoid.geodeticSurfaceNormal(position, surfaceNormal);

                var forwardProjection = Cartographic.Cartesian3.multiplyByScalar(surfaceNormal, Cartographic.Cartesian3.dot(forward, surfaceNormal), scratchForwardProjection);
                Cartographic.Cartesian3.subtract(forward, forwardProjection, forwardProjection);
                Cartographic.Cartesian3.normalize(forwardProjection, forwardProjection);

                var backwardProjection = Cartographic.Cartesian3.multiplyByScalar(surfaceNormal, Cartographic.Cartesian3.dot(backward, surfaceNormal), scratchBackwardProjection);
                Cartographic.Cartesian3.subtract(backward, backwardProjection, backwardProjection);
                Cartographic.Cartesian3.normalize(backwardProjection, backwardProjection);

                var doCorner = !_Math.CesiumMath.equalsEpsilon(Math.abs(Cartographic.Cartesian3.dot(forwardProjection, backwardProjection)), 1.0, _Math.CesiumMath.EPSILON7);

                if (doCorner) {
                    cornerDirection = Cartographic.Cartesian3.cross(cornerDirection, surfaceNormal, cornerDirection);
                    cornerDirection = Cartographic.Cartesian3.cross(surfaceNormal, cornerDirection, cornerDirection);
                    cornerDirection = Cartographic.Cartesian3.normalize(cornerDirection, cornerDirection);
                    var scalar = 1 / Math.max(0.25, (Cartographic.Cartesian3.magnitude(Cartographic.Cartesian3.cross(cornerDirection, backward, scratch1))));
                    var leftIsOutside = PolylineVolumeGeometryLibrary.angleIsGreaterThanPi(forward, backward, position, ellipsoid);
                    if (leftIsOutside) {
                        pivot = Cartographic.Cartesian3.add(position, Cartographic.Cartesian3.multiplyByScalar(cornerDirection, scalar * width, cornerDirection), pivot);
                        start = Cartographic.Cartesian3.add(pivot, Cartographic.Cartesian3.multiplyByScalar(left, width, start), start);
                        scratch2Array[0] = Cartographic.Cartesian3.clone(previousPosition, scratch2Array[0]);
                        scratch2Array[1] = Cartographic.Cartesian3.clone(start, scratch2Array[1]);
                        subdividedHeights = subdivideHeights(scratch2Array, h0 + heightOffset, h1 + heightOffset, granularity);
                        subdividedPositions = PolylinePipeline.PolylinePipeline.generateArc({
                            positions: scratch2Array,
                            granularity: granularity,
                            ellipsoid: ellipsoid
                        });
                        finalPositions = addPositions(subdividedPositions, left, shapeForSides, finalPositions, ellipsoid, subdividedHeights, 1, fromEnu);
                        left = Cartographic.Cartesian3.cross(surfaceNormal, forward, left);
                        left = Cartographic.Cartesian3.normalize(left, left);
                        end = Cartographic.Cartesian3.add(pivot, Cartographic.Cartesian3.multiplyByScalar(left, width, end), end);
                        if (cornerType === CornerType$1.ROUNDED || cornerType === CornerType$1.BEVELED) {
                            computeRoundCorner(pivot, start, end, cornerType, leftIsOutside, ellipsoid, finalPositions, shapeForSides, h1 + heightOffset, duplicatePoints);
                        } else {
                            cornerDirection = Cartographic.Cartesian3.negate(cornerDirection, cornerDirection);
                            finalPositions = addPositionLocal(position, cornerDirection, shapeForSides, finalPositions, ellipsoid, h1 + heightOffset, scalar, repeat, enuInverse);
                        }
                        previousPosition = Cartographic.Cartesian3.clone(end, previousPosition);
                    } else {
                        pivot = Cartographic.Cartesian3.add(position, Cartographic.Cartesian3.multiplyByScalar(cornerDirection, scalar * width, cornerDirection), pivot);
                        start = Cartographic.Cartesian3.add(pivot, Cartographic.Cartesian3.multiplyByScalar(left, -width, start), start);
                        scratch2Array[0] = Cartographic.Cartesian3.clone(previousPosition, scratch2Array[0]);
                        scratch2Array[1] = Cartographic.Cartesian3.clone(start, scratch2Array[1]);
                        subdividedHeights = subdivideHeights(scratch2Array, h0 + heightOffset, h1 + heightOffset, granularity);
                        subdividedPositions = PolylinePipeline.PolylinePipeline.generateArc({
                            positions: scratch2Array,
                            granularity: granularity,
                            ellipsoid: ellipsoid
                        });
                        finalPositions = addPositions(subdividedPositions, left, shapeForSides, finalPositions, ellipsoid, subdividedHeights, 1);
                        left = Cartographic.Cartesian3.cross(surfaceNormal, forward, left);
                        left = Cartographic.Cartesian3.normalize(left, left);
                        end = Cartographic.Cartesian3.add(pivot, Cartographic.Cartesian3.multiplyByScalar(left, -width, end), end);
                        if (cornerType === CornerType$1.ROUNDED || cornerType === CornerType$1.BEVELED) {
                            computeRoundCorner(pivot, start, end, cornerType, leftIsOutside, ellipsoid, finalPositions, shapeForSides, h1 + heightOffset, duplicatePoints);
                        } else {
                            finalPositions = addPositionLocal(position, cornerDirection, shapeForSides, finalPositions, ellipsoid, h1 + heightOffset, scalar, repeat, enuInverse);
                        }
                        previousPosition = Cartographic.Cartesian3.clone(end, previousPosition);
                    }
                    backward = Cartographic.Cartesian3.negate(forward, backward);
                } else {
                    finalPositions = addPositionLocal(previousPosition, left, shapeForSides, finalPositions, ellipsoid, h0 + heightOffset, 1, 1, enuInverse);
                    previousPosition = position;
                }
                h0 = h1;
                h1 = heights[i + 1];
                position = nextPosition;
            }

            scratch2Array[0] = Cartographic.Cartesian3.clone(previousPosition, scratch2Array[0]);
            scratch2Array[1] = Cartographic.Cartesian3.clone(position, scratch2Array[1]);
            subdividedHeights = subdivideHeights(scratch2Array, h0 + heightOffset, h1 + heightOffset, granularity);
            subdividedPositions = PolylinePipeline.PolylinePipeline.generateArc({
                positions: scratch2Array,
                granularity: granularity,
                ellipsoid: ellipsoid
            });
            finalPositions = addLocalPositions(subdividedPositions, left, shapeForSides, finalPositions, ellipsoid, subdividedHeights, 1, enuInverse);
            if (duplicatePoints) {
                ends = addPositionLocal(position, left, shapeForEnds, ends, ellipsoid, h1 + heightOffset, 1, 1, enuInverse);
            }

            length = finalPositions.length;
            var posLength = duplicatePoints ? length + ends.length : length;
            var combinedPositions = new Float64Array(posLength);
            combinedPositions.set(finalPositions);
            if (duplicatePoints) {
                combinedPositions.set(ends, length);
            }

            return combinedPositions;
        };

    exports.CornerType = CornerType$1;
    exports.PolylineVolumeGeometryLibrary = PolylineVolumeGeometryLibrary;

});

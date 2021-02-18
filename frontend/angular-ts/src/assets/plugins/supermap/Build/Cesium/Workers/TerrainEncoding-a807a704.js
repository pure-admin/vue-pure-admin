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
define(['exports', './when-8d13db60', './Check-70bec281', './Math-61ede240', './Cartographic-fe4be337', './Cartesian2-85064f09', './BoundingSphere-775c5788', './ComponentDatatype-5862616f', './AttributeCompression-84a90a13'], function (exports, when, Check, _Math, Cartographic, Cartesian2, BoundingSphere, ComponentDatatype, AttributeCompression) { 'use strict';

    /**
         * Determine whether or not other objects are visible or hidden behind the visible horizon defined by
         * an {@link Ellipsoid} and a camera position.  The ellipsoid is assumed to be located at the
         * origin of the coordinate system.  This class uses the algorithm described in the
         * {@link https://cesium.com/blog/2013/04/25/Horizon-culling/|Horizon Culling} blog post.
         *
         * @alias EllipsoidalOccluder
         *
         * @param {Ellipsoid} ellipsoid The ellipsoid to use as an occluder.
         * @param {Cartesian3} [cameraPosition] The coordinate of the viewer/camera.  If this parameter is not
         *        specified, {@link EllipsoidalOccluder#cameraPosition} must be called before
         *        testing visibility.
         *
         * @constructor
         *
         * @example
         * // Construct an ellipsoidal occluder with radii 1.0, 1.1, and 0.9.
         * var cameraPosition = new Cesium.Cartesian3(5.0, 6.0, 7.0);
         * var occluderEllipsoid = new Cesium.Ellipsoid(1.0, 1.1, 0.9);
         * var occluder = new Cesium.EllipsoidalOccluder(occluderEllipsoid, cameraPosition);
         *
         * @private
         */
        function EllipsoidalOccluder(ellipsoid, cameraPosition) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('ellipsoid', ellipsoid);
            //>>includeEnd('debug');

            this._ellipsoid = ellipsoid;
            this._cameraPosition = new Cartographic.Cartesian3();
            this._cameraPositionInScaledSpace = new Cartographic.Cartesian3();
            this._distanceToLimbInScaledSpaceSquared = 0.0;

            // cameraPosition fills in the above values
            if (when.defined(cameraPosition)) {
                this.cameraPosition = cameraPosition;
            }
        }

        Object.defineProperties(EllipsoidalOccluder.prototype, {
            /**
             * Gets the occluding ellipsoid.
             * @memberof EllipsoidalOccluder.prototype
             * @type {Ellipsoid}
             */
            ellipsoid : {
                get: function() {
                    return this._ellipsoid;
                }
            },
            /**
             * Gets or sets the position of the camera.
             * @memberof EllipsoidalOccluder.prototype
             * @type {Cartesian3}
             */
            cameraPosition : {
                get : function() {
                    return this._cameraPosition;
                },
                set : function(cameraPosition) {
                    // See https://cesium.com/blog/2013/04/25/Horizon-culling/
                    var ellipsoid = this._ellipsoid;
                    var cv = ellipsoid.transformPositionToScaledSpace(cameraPosition, this._cameraPositionInScaledSpace);
                    var vhMagnitudeSquared = Cartographic.Cartesian3.magnitudeSquared(cv) - 1.0;

                    Cartographic.Cartesian3.clone(cameraPosition, this._cameraPosition);
                    this._cameraPositionInScaledSpace = cv;
                    this._distanceToLimbInScaledSpaceSquared = vhMagnitudeSquared;
                }
            }
        });

        var scratchCartesian = new Cartographic.Cartesian3();

        /**
         * Determines whether or not a point, the <code>occludee</code>, is hidden from view by the occluder.
         *
         * @param {Cartesian3} occludee The point to test for visibility.
         * @returns {Boolean} <code>true</code> if the occludee is visible; otherwise <code>false</code>.
         *
         * @example
         * var cameraPosition = new Cesium.Cartesian3(0, 0, 2.5);
         * var ellipsoid = new Cesium.Ellipsoid(1.0, 1.1, 0.9);
         * var occluder = new Cesium.EllipsoidalOccluder(ellipsoid, cameraPosition);
         * var point = new Cesium.Cartesian3(0, -3, -3);
         * occluder.isPointVisible(point); //returns true
         */
        EllipsoidalOccluder.prototype.isPointVisible = function(occludee) {
            var ellipsoid = this._ellipsoid;
            var occludeeScaledSpacePosition = ellipsoid.transformPositionToScaledSpace(occludee, scratchCartesian);
            return isScaledSpacePointVisible(occludeeScaledSpacePosition, this._cameraPositionInScaledSpace, this._distanceToLimbInScaledSpaceSquared);
        };

        /**
         * Determines whether or not a point expressed in the ellipsoid scaled space, is hidden from view by the
         * occluder.  To transform a Cartesian X, Y, Z position in the coordinate system aligned with the ellipsoid
         * into the scaled space, call {@link Ellipsoid#transformPositionToScaledSpace}.
         *
         * @param {Cartesian3} occludeeScaledSpacePosition The point to test for visibility, represented in the scaled space.
         * @returns {Boolean} <code>true</code> if the occludee is visible; otherwise <code>false</code>.
         *
         * @example
         * var cameraPosition = new Cesium.Cartesian3(0, 0, 2.5);
         * var ellipsoid = new Cesium.Ellipsoid(1.0, 1.1, 0.9);
         * var occluder = new Cesium.EllipsoidalOccluder(ellipsoid, cameraPosition);
         * var point = new Cesium.Cartesian3(0, -3, -3);
         * var scaledSpacePoint = ellipsoid.transformPositionToScaledSpace(point);
         * occluder.isScaledSpacePointVisible(scaledSpacePoint); //returns true
         */
        EllipsoidalOccluder.prototype.isScaledSpacePointVisible = function(occludeeScaledSpacePosition) {
            return isScaledSpacePointVisible(occludeeScaledSpacePosition, this._cameraPositionInScaledSpace, this._distanceToLimbInScaledSpaceSquared);
        };

        var scratchCameraPositionInScaledSpaceShrunk = new Cartographic.Cartesian3();

        /**
         * Similar to {@link EllipsoidalOccluder#isScaledSpacePointVisible} except tests against an
         * ellipsoid that has been shrunk by the minimum height when the minimum height is below
         * the ellipsoid. This is intended to be used with points generated by
         * {@link EllipsoidalOccluder#computeHorizonCullingPointPossiblyUnderEllipsoid} or
         * {@link EllipsoidalOccluder#computeHorizonCullingPointFromVerticesPossiblyUnderEllipsoid}.
         *
         * @param {Cartesian3} occludeeScaledSpacePosition The point to test for visibility, represented in the scaled space of the possibly-shrunk ellipsoid.
         * @returns {Boolean} <code>true</code> if the occludee is visible; otherwise <code>false</code>.
         */
        EllipsoidalOccluder.prototype.isScaledSpacePointVisiblePossiblyUnderEllipsoid = function(occludeeScaledSpacePosition, minimumHeight) {
            var ellipsoid = this._ellipsoid;
            var vhMagnitudeSquared;
            var cv;

            if (when.defined(minimumHeight) && minimumHeight < 0.0 && ellipsoid.minimumRadius > -minimumHeight) {
                // This code is similar to the cameraPosition setter, but unrolled for performance because it will be called a lot.
                cv = scratchCameraPositionInScaledSpaceShrunk;
                cv.x = this._cameraPosition.x / (ellipsoid.radii.x + minimumHeight);
                cv.y = this._cameraPosition.y / (ellipsoid.radii.y + minimumHeight);
                cv.z = this._cameraPosition.z / (ellipsoid.radii.z + minimumHeight);
                vhMagnitudeSquared = cv.x * cv.x + cv.y * cv.y + cv.z * cv.z - 1.0;
            } else {
                cv = this._cameraPositionInScaledSpace;
                vhMagnitudeSquared = this._distanceToLimbInScaledSpaceSquared;
            }

            return isScaledSpacePointVisible(occludeeScaledSpacePosition, cv, vhMagnitudeSquared);
        };

        /**
         * Computes a point that can be used for horizon culling from a list of positions.  If the point is below
         * the horizon, all of the positions are guaranteed to be below the horizon as well.  The returned point
         * is expressed in the ellipsoid-scaled space and is suitable for use with
         * {@link EllipsoidalOccluder#isScaledSpacePointVisible}.
         *
         * @param {Cartesian3} directionToPoint The direction that the computed point will lie along.
         *                     A reasonable direction to use is the direction from the center of the ellipsoid to
         *                     the center of the bounding sphere computed from the positions.  The direction need not
         *                     be normalized.
         * @param {Cartesian3[]} positions The positions from which to compute the horizon culling point.  The positions
         *                       must be expressed in a reference frame centered at the ellipsoid and aligned with the
         *                       ellipsoid's axes.
         * @param {Cartesian3} [result] The instance on which to store the result instead of allocating a new instance.
         * @returns {Cartesian3} The computed horizon culling point, expressed in the ellipsoid-scaled space.
         */
        EllipsoidalOccluder.prototype.computeHorizonCullingPoint = function(directionToPoint, positions, result) {
            return computeHorizonCullingPointFromPositions(this._ellipsoid, directionToPoint, positions, result);
        };

        var scratchEllipsoidShrunk = Cartesian2.Ellipsoid.clone(Cartesian2.Ellipsoid.UNIT_SPHERE);

        /**
         * Similar to {@link EllipsoidalOccluder#computeHorizonCullingPoint} except computes the culling
         * point relative to an ellipsoid that has been shrunk by the minimum height when the minimum height is below
         * the ellipsoid. The returned point is expressed in the possibly-shrunk ellipsoid-scaled space and is suitable
         * for use with {@link EllipsoidalOccluder#isScaledSpacePointVisiblePossiblyUnderEllipsoid}.
         *
         * @param {Cartesian3} directionToPoint The direction that the computed point will lie along.
         *                     A reasonable direction to use is the direction from the center of the ellipsoid to
         *                     the center of the bounding sphere computed from the positions.  The direction need not
         *                     be normalized.
         * @param {Cartesian3[]} positions The positions from which to compute the horizon culling point.  The positions
         *                       must be expressed in a reference frame centered at the ellipsoid and aligned with the
         *                       ellipsoid's axes.
         * @param {Number} [minimumHeight] The minimum height of all positions. If this value is undefined, all positions are assumed to be above the ellipsoid.
         * @param {Cartesian3} [result] The instance on which to store the result instead of allocating a new instance.
         * @returns {Cartesian3} The computed horizon culling point, expressed in the possibly-shrunk ellipsoid-scaled space.
         */
        EllipsoidalOccluder.prototype.computeHorizonCullingPointPossiblyUnderEllipsoid = function(directionToPoint, positions, minimumHeight, result) {
            var possiblyShrunkEllipsoid = getPossiblyShrunkEllipsoid(this._ellipsoid, minimumHeight, scratchEllipsoidShrunk);
            return computeHorizonCullingPointFromPositions(possiblyShrunkEllipsoid, directionToPoint, positions, result);
        };
        /**
         * Computes a point that can be used for horizon culling from a list of positions.  If the point is below
         * the horizon, all of the positions are guaranteed to be below the horizon as well.  The returned point
         * is expressed in the ellipsoid-scaled space and is suitable for use with
         * {@link EllipsoidalOccluder#isScaledSpacePointVisible}.
         *
         * @param {Cartesian3} directionToPoint The direction that the computed point will lie along.
         *                     A reasonable direction to use is the direction from the center of the ellipsoid to
         *                     the center of the bounding sphere computed from the positions.  The direction need not
         *                     be normalized.
         * @param {Number[]} vertices  The vertices from which to compute the horizon culling point.  The positions
         *                   must be expressed in a reference frame centered at the ellipsoid and aligned with the
         *                   ellipsoid's axes.
         * @param {Number} [stride=3]
         * @param {Cartesian3} [center=Cartesian3.ZERO]
         * @param {Cartesian3} [result] The instance on which to store the result instead of allocating a new instance.
         * @returns {Cartesian3} The computed horizon culling point, expressed in the ellipsoid-scaled space.
         */
        EllipsoidalOccluder.prototype.computeHorizonCullingPointFromVertices = function(directionToPoint, vertices, stride, center, result) {
            return computeHorizonCullingPointFromVertices(this._ellipsoid, directionToPoint, vertices, stride, center, result);
        };

        /**
         * Similar to {@link EllipsoidalOccluder#computeHorizonCullingPointFromVertices} except computes the culling
         * point relative to an ellipsoid that has been shrunk by the minimum height when the minimum height is below
         * the ellipsoid. The returned point is expressed in the possibly-shrunk ellipsoid-scaled space and is suitable
         * for use with {@link EllipsoidalOccluder#isScaledSpacePointVisiblePossiblyUnderEllipsoid}.
         *
         * @param {Cartesian3} directionToPoint The direction that the computed point will lie along.
         *                     A reasonable direction to use is the direction from the center of the ellipsoid to
         *                     the center of the bounding sphere computed from the positions.  The direction need not
         *                     be normalized.
         * @param {Number[]} vertices  The vertices from which to compute the horizon culling point.  The positions
         *                   must be expressed in a reference frame centered at the ellipsoid and aligned with the
         *                   ellipsoid's axes.
         * @param {Number} [stride=3]
         * @param {Cartesian3} [center=Cartesian3.ZERO]
         * @param {Number} [minimumHeight] The minimum height of all vertices. If this value is undefined, all vertices are assumed to be above the ellipsoid.
         * @param {Cartesian3} [result] The instance on which to store the result instead of allocating a new instance.
         * @returns {Cartesian3} The computed horizon culling point, expressed in the possibly-shrunk ellipsoid-scaled space.
         */
        EllipsoidalOccluder.prototype.computeHorizonCullingPointFromVerticesPossiblyUnderEllipsoid = function(directionToPoint, vertices, stride, center, minimumHeight, result) {
            var possiblyShrunkEllipsoid = getPossiblyShrunkEllipsoid(this._ellipsoid, minimumHeight, scratchEllipsoidShrunk);
            return computeHorizonCullingPointFromVertices(possiblyShrunkEllipsoid, directionToPoint, vertices, stride, center, result);
        };

        var subsampleScratch = [];

        /**
         * Computes a point that can be used for horizon culling of a rectangle.  If the point is below
         * the horizon, the ellipsoid-conforming rectangle is guaranteed to be below the horizon as well.
         * The returned point is expressed in the ellipsoid-scaled space and is suitable for use with
         * {@link EllipsoidalOccluder#isScaledSpacePointVisible}.
         *
         * @param {Rectangle} rectangle The rectangle for which to compute the horizon culling point.
         * @param {Ellipsoid} ellipsoid The ellipsoid on which the rectangle is defined.  This may be different from
         *                    the ellipsoid used by this instance for occlusion testing.
         * @param {Cartesian3} [result] The instance on which to store the result instead of allocating a new instance.
         * @returns {Cartesian3} The computed horizon culling point, expressed in the ellipsoid-scaled space.
         */
        EllipsoidalOccluder.prototype.computeHorizonCullingPointFromRectangle = function(rectangle, ellipsoid, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('rectangle', rectangle);
            //>>includeEnd('debug');

            var positions = Cartesian2.Rectangle.subsample(rectangle, ellipsoid, 0.0, subsampleScratch);
            var bs = BoundingSphere.BoundingSphere.fromPoints(positions);

            // If the bounding sphere center is too close to the center of the occluder, it doesn't make
            // sense to try to horizon cull it.
            if (Cartographic.Cartesian3.magnitude(bs.center) < 0.1 * ellipsoid.minimumRadius) {
                return undefined;
            }

            return this.computeHorizonCullingPoint(bs.center, positions, result);
        };

        var scratchEllipsoidShrunkRadii = new Cartographic.Cartesian3();

        function getPossiblyShrunkEllipsoid(ellipsoid, minimumHeight, result) {
            if (when.defined(minimumHeight) && minimumHeight < 0.0 && ellipsoid.minimumRadius > -minimumHeight) {
                var ellipsoidShrunkRadii = Cartographic.Cartesian3.fromElements(
                    ellipsoid.radii.x + minimumHeight,
                    ellipsoid.radii.y + minimumHeight,
                    ellipsoid.radii.z + minimumHeight,
                    scratchEllipsoidShrunkRadii
                );
                ellipsoid = Cartesian2.Ellipsoid.fromCartesian3(ellipsoidShrunkRadii, result);
            }
            return ellipsoid;
        }

        function computeHorizonCullingPointFromPositions(ellipsoid, directionToPoint, positions, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('directionToPoint', directionToPoint);
            Check.Check.defined('positions', positions);
            //>>includeEnd('debug');

            if (!when.defined(result)) {
                result = new Cartographic.Cartesian3();
            }

            var scaledSpaceDirectionToPoint = computeScaledSpaceDirectionToPoint(ellipsoid, directionToPoint);
            var resultMagnitude = 0.0;

            for (var i = 0, len = positions.length; i < len; ++i) {
                var position = positions[i];
                var candidateMagnitude = computeMagnitude(ellipsoid, position, scaledSpaceDirectionToPoint);
                if (candidateMagnitude < 0.0) {
                    // all points should face the same direction, but this one doesn't, so return undefined
                    return undefined;
                }
                resultMagnitude = Math.max(resultMagnitude, candidateMagnitude);
            }

            return magnitudeToPoint(scaledSpaceDirectionToPoint, resultMagnitude, result);
        }

        var positionScratch = new Cartographic.Cartesian3();

        function computeHorizonCullingPointFromVertices(ellipsoid, directionToPoint, vertices, stride, center, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('directionToPoint', directionToPoint);
            Check.Check.defined('vertices', vertices);
            Check.Check.typeOf.number('stride', stride);
            //>>includeEnd('debug');

            if (!when.defined(result)) {
                result = new Cartographic.Cartesian3();
            }

            stride = when.defaultValue(stride, 3);
            center = when.defaultValue(center, Cartographic.Cartesian3.ZERO);
            var scaledSpaceDirectionToPoint = computeScaledSpaceDirectionToPoint(ellipsoid, directionToPoint);
            var resultMagnitude = 0.0;

            for (var i = 0, len = vertices.length; i < len; i += stride) {
                positionScratch.x = vertices[i] + center.x;
                positionScratch.y = vertices[i + 1] + center.y;
                positionScratch.z = vertices[i + 2] + center.z;

                var candidateMagnitude = computeMagnitude(ellipsoid, positionScratch, scaledSpaceDirectionToPoint);
                if (candidateMagnitude < 0.0) {
                    // all points should face the same direction, but this one doesn't, so return undefined
                    return undefined;
                }
                resultMagnitude = Math.max(resultMagnitude, candidateMagnitude);
            }

            return magnitudeToPoint(scaledSpaceDirectionToPoint, resultMagnitude, result);
        }

        function isScaledSpacePointVisible(occludeeScaledSpacePosition, cameraPositionInScaledSpace, distanceToLimbInScaledSpaceSquared) {
            // See https://cesium.com/blog/2013/04/25/Horizon-culling/
            var cv = cameraPositionInScaledSpace;
            var vhMagnitudeSquared = distanceToLimbInScaledSpaceSquared;
            var vt = Cartographic.Cartesian3.subtract(occludeeScaledSpacePosition, cv, scratchCartesian);
            var vtDotVc = -Cartographic.Cartesian3.dot(vt, cv);
            // If vhMagnitudeSquared < 0 then we are below the surface of the ellipsoid and
            // in this case, set the culling plane to be on V.
            var isOccluded = vhMagnitudeSquared < 0 ? vtDotVc > 0 : (vtDotVc > vhMagnitudeSquared &&
                             vtDotVc * vtDotVc / Cartographic.Cartesian3.magnitudeSquared(vt) > vhMagnitudeSquared);
            return !isOccluded;
        }

        var scaledSpaceScratch = new Cartographic.Cartesian3();
        var directionScratch = new Cartographic.Cartesian3();

        function computeMagnitude(ellipsoid, position, scaledSpaceDirectionToPoint) {
            var scaledSpacePosition = ellipsoid.transformPositionToScaledSpace(position, scaledSpaceScratch);
            var magnitudeSquared = Cartographic.Cartesian3.magnitudeSquared(scaledSpacePosition);
            var magnitude = Math.sqrt(magnitudeSquared);
            var direction = Cartographic.Cartesian3.divideByScalar(scaledSpacePosition, magnitude, directionScratch);

            // For the purpose of this computation, points below the ellipsoid are consider to be on it instead.
            magnitudeSquared = Math.max(1.0, magnitudeSquared);
            magnitude = Math.max(1.0, magnitude);

            var cosAlpha = Cartographic.Cartesian3.dot(direction, scaledSpaceDirectionToPoint);
            var sinAlpha = Cartographic.Cartesian3.magnitude(Cartographic.Cartesian3.cross(direction, scaledSpaceDirectionToPoint, direction));
            var cosBeta = 1.0 / magnitude;
            var sinBeta = Math.sqrt(magnitudeSquared - 1.0) * cosBeta;

            return 1.0 / (cosAlpha * cosBeta - sinAlpha * sinBeta);
        }

        function magnitudeToPoint(scaledSpaceDirectionToPoint, resultMagnitude, result) {
            // The horizon culling point is undefined if there were no positions from which to compute it,
            // the directionToPoint is pointing opposite all of the positions,  or if we computed NaN or infinity.
            if (resultMagnitude <= 0.0 || resultMagnitude === 1.0 / 0.0 || resultMagnitude !== resultMagnitude) {
                return undefined;
            }

            return Cartographic.Cartesian3.multiplyByScalar(scaledSpaceDirectionToPoint, resultMagnitude, result);
        }

        var directionToPointScratch = new Cartographic.Cartesian3();

        function computeScaledSpaceDirectionToPoint(ellipsoid, directionToPoint) {
            if (Cartographic.Cartesian3.equals(directionToPoint, Cartographic.Cartesian3.ZERO)) {
                return directionToPoint;
            }

            ellipsoid.transformPositionToScaledSpace(directionToPoint, directionToPointScratch);
            return Cartographic.Cartesian3.normalize(directionToPointScratch, directionToPointScratch);
        }

    /**
     * This enumerated type is used to determine how the vertices of the terrain mesh are compressed.
     *
     * @exports TerrainQuantization
     *
     * @private
     */
    var TerrainQuantization = {
        /**
         * The vertices are not compressed.
         *
         * @type {Number}
         * @constant
         */
        NONE : 0,

        /**
         * The vertices are compressed to 12 bits.
         *
         * @type {Number}
         * @constant
         */
        BITS12 : 1
    };

    var TerrainQuantization$1 = Object.freeze(TerrainQuantization);

    var cartesian3Scratch = new Cartographic.Cartesian3();
    var cartesian3DimScratch = new Cartographic.Cartesian3();
    var cartesian2Scratch = new Cartesian2.Cartesian2();
    var matrix4Scratch = new BoundingSphere.Matrix4();
    var matrix4Scratch2 = new BoundingSphere.Matrix4();

    var SHIFT_LEFT_12 = Math.pow(2.0, 12.0);

    /**
     * Data used to quantize and pack the terrain mesh. The position can be unpacked for picking and all attributes
     * are unpacked in the vertex shader.
     *
     * @alias TerrainEncoding
     * @constructor
     *
     * @param {AxisAlignedBoundingBox} axisAlignedBoundingBox The bounds of the tile in the east-north-up coordinates at the tiles center.
     * @param {Number} minimumHeight The minimum height.
     * @param {Number} maximumHeight The maximum height.
     * @param {Matrix4} fromENU The east-north-up to fixed frame matrix at the center of the terrain mesh.
     * @param {Boolean} hasVertexNormals If the mesh has vertex normals.
     * @param {Boolean} [hasWebMercatorT=false] true if the terrain data includes a Web Mercator texture coordinate; otherwise, false.
     *
     * @private
     */
    function TerrainEncoding(axisAlignedBoundingBox, minimumHeight, maximumHeight, fromENU, hasVertexNormals, hasWebMercatorT) {
        var quantization = TerrainQuantization$1.NONE;
        var center;
        var toENU;
        var matrix;

        if (when.defined(axisAlignedBoundingBox) && when.defined(minimumHeight) && when.defined(maximumHeight) && when.defined(fromENU)) {
            var minimum = axisAlignedBoundingBox.minimum;
            var maximum = axisAlignedBoundingBox.maximum;

            var dimensions = Cartographic.Cartesian3.subtract(maximum, minimum, cartesian3DimScratch);
            var hDim = maximumHeight - minimumHeight;
            var maxDim = Math.max(Cartographic.Cartesian3.maximumComponent(dimensions), hDim);

            if (maxDim < SHIFT_LEFT_12 - 1.0) {
                quantization = TerrainQuantization$1.BITS12;
            } else {
                quantization = TerrainQuantization$1.NONE;
            }

            quantization = TerrainQuantization$1.NONE;//防止精度损失，出现地形模型匹配不上，默认不压缩

            center = axisAlignedBoundingBox.center;
            toENU = BoundingSphere.Matrix4.inverseTransformation(fromENU, new BoundingSphere.Matrix4());

            var translation = Cartographic.Cartesian3.negate(minimum, cartesian3Scratch);
            BoundingSphere.Matrix4.multiply(BoundingSphere.Matrix4.fromTranslation(translation, matrix4Scratch), toENU, toENU);

            var scale = cartesian3Scratch;
            scale.x = 1.0 / dimensions.x;
            scale.y = 1.0 / dimensions.y;
            scale.z = 1.0 / dimensions.z;
            BoundingSphere.Matrix4.multiply(BoundingSphere.Matrix4.fromScale(scale, matrix4Scratch), toENU, toENU);

            matrix = BoundingSphere.Matrix4.clone(fromENU);
            BoundingSphere.Matrix4.setTranslation(matrix, Cartographic.Cartesian3.ZERO, matrix);

            fromENU = BoundingSphere.Matrix4.clone(fromENU, new BoundingSphere.Matrix4());

            var translationMatrix = BoundingSphere.Matrix4.fromTranslation(minimum, matrix4Scratch);
            var scaleMatrix =  BoundingSphere.Matrix4.fromScale(dimensions, matrix4Scratch2);
            var st = BoundingSphere.Matrix4.multiply(translationMatrix, scaleMatrix,matrix4Scratch);

            BoundingSphere.Matrix4.multiply(fromENU, st, fromENU);
            BoundingSphere.Matrix4.multiply(matrix, st, matrix);
        }

        /**
         * How the vertices of the mesh were compressed.
         * @type {TerrainQuantization}
         */
        this.quantization = quantization;

        /**
         * The minimum height of the tile including the skirts.
         * @type {Number}
         */
        this.minimumHeight = minimumHeight;

        /**
         * The maximum height of the tile.
         * @type {Number}
         */
        this.maximumHeight = maximumHeight;

        /**
         * The center of the tile.
         * @type {Cartesian3}
         */
        this.center = center;

        /**
         * A matrix that takes a vertex from the tile, transforms it to east-north-up at the center and scales
         * it so each component is in the [0, 1] range.
         * @type {Matrix4}
         */
        this.toScaledENU = toENU;

        /**
         * A matrix that restores a vertex transformed with toScaledENU back to the earth fixed reference frame
         * @type {Matrix4}
         */
        this.fromScaledENU = fromENU;

        /**
         * The matrix used to decompress the terrain vertices in the shader for RTE rendering.
         * @type {Matrix4}
         */
        this.matrix = matrix;

        /**
         * The terrain mesh contains normals.
         * @type {Boolean}
         */
        this.hasVertexNormals = hasVertexNormals;

        /**
         * The terrain mesh contains a vertical texture coordinate following the Web Mercator projection.
         * @type {Boolean}
         */
        this.hasWebMercatorT = when.defaultValue(hasWebMercatorT, false);
    }

    TerrainEncoding.prototype.encode = function(vertexBuffer, bufferIndex, position, uv, height, normalToPack, webMercatorT) {
        var u = uv.x;
        var v = uv.y;

        if (this.quantization === TerrainQuantization$1.BITS12) {
            position = BoundingSphere.Matrix4.multiplyByPoint(this.toScaledENU, position, cartesian3Scratch);

            position.x = _Math.CesiumMath.clamp(position.x, 0.0, 1.0);
            position.y = _Math.CesiumMath.clamp(position.y, 0.0, 1.0);
            position.z = _Math.CesiumMath.clamp(position.z, 0.0, 1.0);

            var hDim = this.maximumHeight - this.minimumHeight;
            var h = _Math.CesiumMath.clamp((height - this.minimumHeight) / hDim, 0.0, 1.0);

            Cartesian2.Cartesian2.fromElements(position.x, position.y, cartesian2Scratch);
            var compressed0 = AttributeCompression.AttributeCompression.compressTextureCoordinates(cartesian2Scratch);

            Cartesian2.Cartesian2.fromElements(position.z, h, cartesian2Scratch);
            var compressed1 = AttributeCompression.AttributeCompression.compressTextureCoordinates(cartesian2Scratch);

            Cartesian2.Cartesian2.fromElements(u, v, cartesian2Scratch);
            var compressed2 = AttributeCompression.AttributeCompression.compressTextureCoordinates(cartesian2Scratch);

            vertexBuffer[bufferIndex++] = compressed0;
            vertexBuffer[bufferIndex++] = compressed1;
            vertexBuffer[bufferIndex++] = compressed2;

            if (this.hasWebMercatorT) {
                Cartesian2.Cartesian2.fromElements(webMercatorT, 0.0, cartesian2Scratch);
                var compressed3 = AttributeCompression.AttributeCompression.compressTextureCoordinates(cartesian2Scratch);
                vertexBuffer[bufferIndex++] = compressed3;
            }
        } else {
            Cartographic.Cartesian3.subtract(position, this.center, cartesian3Scratch);

            vertexBuffer[bufferIndex++] = cartesian3Scratch.x;
            vertexBuffer[bufferIndex++] = cartesian3Scratch.y;
            vertexBuffer[bufferIndex++] = cartesian3Scratch.z;
            vertexBuffer[bufferIndex++] = height;
            vertexBuffer[bufferIndex++] = u;
            vertexBuffer[bufferIndex++] = v;

            if (this.hasWebMercatorT) {
                vertexBuffer[bufferIndex++] = webMercatorT;
            }
        }

        if (this.hasVertexNormals) {
            vertexBuffer[bufferIndex++] = AttributeCompression.AttributeCompression.octPackFloat(normalToPack);
        }

        return bufferIndex;
    };

    TerrainEncoding.prototype.decodePosition = function(buffer, index, result) {
        if (!when.defined(result)) {
            result = new Cartographic.Cartesian3();
        }

        index *= this.getStride();

        if (this.quantization === TerrainQuantization$1.BITS12) {
            var xy = AttributeCompression.AttributeCompression.decompressTextureCoordinates(buffer[index], cartesian2Scratch);
            result.x = xy.x;
            result.y = xy.y;

            var zh = AttributeCompression.AttributeCompression.decompressTextureCoordinates(buffer[index + 1], cartesian2Scratch);
            result.z = zh.x;

            return BoundingSphere.Matrix4.multiplyByPoint(this.fromScaledENU, result, result);
        }

        result.x = buffer[index];
        result.y = buffer[index + 1];
        result.z = buffer[index + 2];
        return Cartographic.Cartesian3.add(result, this.center, result);
    };

    TerrainEncoding.prototype.decodeTextureCoordinates = function(buffer, index, result) {
        if (!when.defined(result)) {
            result = new Cartesian2.Cartesian2();
        }

        index *= this.getStride();

        if (this.quantization === TerrainQuantization$1.BITS12) {
            return AttributeCompression.AttributeCompression.decompressTextureCoordinates(buffer[index + 2], result);
        }

        return Cartesian2.Cartesian2.fromElements(buffer[index + 4], buffer[index + 5], result);
    };

    TerrainEncoding.prototype.decodeHeight = function(buffer, index) {
        index *= this.getStride();

        if (this.quantization === TerrainQuantization$1.BITS12) {
            var zh = AttributeCompression.AttributeCompression.decompressTextureCoordinates(buffer[index + 1], cartesian2Scratch);
            return zh.y * (this.maximumHeight - this.minimumHeight) + this.minimumHeight;
        }

        return buffer[index + 3];
    };

    TerrainEncoding.prototype.decodeWebMercatorT = function(buffer, index) {
        index *= this.getStride();

        if (this.quantization === TerrainQuantization$1.BITS12) {
            return AttributeCompression.AttributeCompression.decompressTextureCoordinates(buffer[index + 3], cartesian2Scratch).x;
        }

        return buffer[index + 6];
    };

    TerrainEncoding.prototype.getOctEncodedNormal = function(buffer, index, result) {
        var stride = this.getStride();
        index = (index + 1) * stride - 1;

        var temp = buffer[index] / 256.0;
        var x = Math.floor(temp);
        var y = (temp - x) * 256.0;

        return Cartesian2.Cartesian2.fromElements(x, y, result);
    };

    TerrainEncoding.prototype.getStride = function() {
        var vertexStride;

        switch (this.quantization) {
            case TerrainQuantization$1.BITS12:
                vertexStride = 3;
                break;
            default:
                vertexStride = 6;
        }

        if (this.hasWebMercatorT) {
            ++vertexStride;
        }

        if (this.hasVertexNormals) {
            ++vertexStride;
        }

        return vertexStride;
    };

    var attributesNone = {
        position3DAndHeight : 0,
        textureCoordAndEncodedNormals : 1
    };
    var attributes = {
        compressed0 : 0,
        compressed1 : 1
    };

    TerrainEncoding.prototype.getAttributes = function(buffer) {
        var datatype = ComponentDatatype.ComponentDatatype.FLOAT;
        var sizeInBytes = ComponentDatatype.ComponentDatatype.getSizeInBytes(datatype);
        var stride;

        if (this.quantization === TerrainQuantization$1.NONE) {
            var position3DAndHeightLength = 4;
            var numTexCoordComponents = 2;

            if (this.hasWebMercatorT) {
                ++numTexCoordComponents;
            }

            if (this.hasVertexNormals) {
                ++numTexCoordComponents;
            }

            stride = (position3DAndHeightLength + numTexCoordComponents) * sizeInBytes;

            return [{
                index : attributesNone.position3DAndHeight,
                vertexBuffer : buffer,
                componentDatatype : datatype,
                componentsPerAttribute : position3DAndHeightLength,
                offsetInBytes : 0,
                strideInBytes : stride
            }, {
                index : attributesNone.textureCoordAndEncodedNormals,
                vertexBuffer : buffer,
                componentDatatype : datatype,
                componentsPerAttribute : numTexCoordComponents,
                offsetInBytes : position3DAndHeightLength * sizeInBytes,
                strideInBytes : stride
            }];
        }

        var numCompressed0 = 3;
        var numCompressed1 = 0;

        if (this.hasWebMercatorT || this.hasVertexNormals) {
            ++numCompressed0;
        }

        if (this.hasWebMercatorT && this.hasVertexNormals) {
            ++numCompressed1;

            stride = (numCompressed0 + numCompressed1) * sizeInBytes;

            return [{
                index : attributes.compressed0,
                vertexBuffer : buffer,
                componentDatatype : datatype,
                componentsPerAttribute : numCompressed0,
                offsetInBytes : 0,
                strideInBytes : stride
            }, {
                index : attributes.compressed1,
                vertexBuffer : buffer,
                componentDatatype : datatype,
                componentsPerAttribute : numCompressed1,
                offsetInBytes : numCompressed0 * sizeInBytes,
                strideInBytes : stride
            }];
        }
        return [{
            index : attributes.compressed0,
            vertexBuffer : buffer,
            componentDatatype : datatype,
            componentsPerAttribute : numCompressed0
        }];
    };

    TerrainEncoding.prototype.getAttributeLocations = function() {
        if (this.quantization === TerrainQuantization$1.NONE) {
            return attributesNone;
        }
        return attributes;
    };

    TerrainEncoding.clone = function(encoding, result) {
        if (!when.defined(result)) {
            result = new TerrainEncoding();
        }

        result.quantization = encoding.quantization;
        result.minimumHeight = encoding.minimumHeight;
        result.maximumHeight = encoding.maximumHeight;
        result.center = Cartographic.Cartesian3.clone(encoding.center);
        result.toScaledENU = BoundingSphere.Matrix4.clone(encoding.toScaledENU);
        result.fromScaledENU = BoundingSphere.Matrix4.clone(encoding.fromScaledENU);
        result.matrix = BoundingSphere.Matrix4.clone(encoding.matrix);
        result.hasVertexNormals = encoding.hasVertexNormals;
        result.hasWebMercatorT = encoding.hasWebMercatorT;
        return result;
    };

    exports.EllipsoidalOccluder = EllipsoidalOccluder;
    exports.TerrainEncoding = TerrainEncoding;

});

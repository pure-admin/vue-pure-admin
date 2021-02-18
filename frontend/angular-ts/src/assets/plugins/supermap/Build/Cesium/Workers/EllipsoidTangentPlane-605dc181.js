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
define(['exports', './when-8d13db60', './Check-70bec281', './Cartographic-fe4be337', './Cartesian2-85064f09', './BoundingSphere-775c5788', './Cartesian4-5af5bb24', './Transforms-913163ed', './IntersectionTests-397d9494', './Plane-8390418f'], function (exports, when, Check, Cartographic, Cartesian2, BoundingSphere, Cartesian4, Transforms, IntersectionTests, Plane) { 'use strict';

    /**
         * Creates an instance of an AxisAlignedBoundingBox from the minimum and maximum points along the x, y, and z axes.
         * @alias AxisAlignedBoundingBox
         * @constructor
         *
         * @param {Cartesian3} [minimum=Cartesian3.ZERO] The minimum point along the x, y, and z axes.
         * @param {Cartesian3} [maximum=Cartesian3.ZERO] The maximum point along the x, y, and z axes.
         * @param {Cartesian3} [center] The center of the box; automatically computed if not supplied.
         *
         * @see BoundingSphere
         * @see BoundingRectangle
         */
        function AxisAlignedBoundingBox(minimum, maximum, center) {
            /**
             * The minimum point defining the bounding box.
             * @type {Cartesian3}
             * @default {@link Cartesian3.ZERO}
             */
            this.minimum = Cartographic.Cartesian3.clone(when.defaultValue(minimum, Cartographic.Cartesian3.ZERO));

            /**
             * The maximum point defining the bounding box.
             * @type {Cartesian3}
             * @default {@link Cartesian3.ZERO}
             */
            this.maximum = Cartographic.Cartesian3.clone(when.defaultValue(maximum, Cartographic.Cartesian3.ZERO));

            //If center was not defined, compute it.
            if (!when.defined(center)) {
                center = Cartographic.Cartesian3.midpoint(this.minimum, this.maximum, new Cartographic.Cartesian3());
            } else {
                center = Cartographic.Cartesian3.clone(center);
            }

            /**
             * The center point of the bounding box.
             * @type {Cartesian3}
             */
            this.center = center;
        }

        /**
         * Computes an instance of an AxisAlignedBoundingBox. The box is determined by
         * finding the points spaced the farthest apart on the x, y, and z axes.
         *
         * @param {Cartesian3[]} positions List of points that the bounding box will enclose.  Each point must have a <code>x</code>, <code>y</code>, and <code>z</code> properties.
         * @param {AxisAlignedBoundingBox} [result] The object onto which to store the result.
         * @returns {AxisAlignedBoundingBox} The modified result parameter or a new AxisAlignedBoundingBox instance if one was not provided.
         *
         * @example
         * // Compute an axis aligned bounding box enclosing two points.
         * var box = Cesium.AxisAlignedBoundingBox.fromPoints([new Cesium.Cartesian3(2, 0, 0), new Cesium.Cartesian3(-2, 0, 0)]);
         */
        AxisAlignedBoundingBox.fromPoints = function(positions, result) {
            if (!when.defined(result)) {
                result = new AxisAlignedBoundingBox();
            }

            if (!when.defined(positions) || positions.length === 0) {
                result.minimum = Cartographic.Cartesian3.clone(Cartographic.Cartesian3.ZERO, result.minimum);
                result.maximum = Cartographic.Cartesian3.clone(Cartographic.Cartesian3.ZERO, result.maximum);
                result.center = Cartographic.Cartesian3.clone(Cartographic.Cartesian3.ZERO, result.center);
                return result;
            }

            var minimumX = positions[0].x;
            var minimumY = positions[0].y;
            var minimumZ = positions[0].z;

            var maximumX = positions[0].x;
            var maximumY = positions[0].y;
            var maximumZ = positions[0].z;

            var length = positions.length;
            for ( var i = 1; i < length; i++) {
                var p = positions[i];
                var x = p.x;
                var y = p.y;
                var z = p.z;

                minimumX = Math.min(x, minimumX);
                maximumX = Math.max(x, maximumX);
                minimumY = Math.min(y, minimumY);
                maximumY = Math.max(y, maximumY);
                minimumZ = Math.min(z, minimumZ);
                maximumZ = Math.max(z, maximumZ);
            }

            var minimum = result.minimum;
            minimum.x = minimumX;
            minimum.y = minimumY;
            minimum.z = minimumZ;

            var maximum = result.maximum;
            maximum.x = maximumX;
            maximum.y = maximumY;
            maximum.z = maximumZ;

            result.center = Cartographic.Cartesian3.midpoint(minimum, maximum, result.center);

            return result;
        };

        /**
         * Duplicates a AxisAlignedBoundingBox instance.
         *
         * @param {AxisAlignedBoundingBox} box The bounding box to duplicate.
         * @param {AxisAlignedBoundingBox} [result] The object onto which to store the result.
         * @returns {AxisAlignedBoundingBox} The modified result parameter or a new AxisAlignedBoundingBox instance if none was provided. (Returns undefined if box is undefined)
         */
        AxisAlignedBoundingBox.clone = function(box, result) {
            if (!when.defined(box)) {
                return undefined;
            }

            if (!when.defined(result)) {
                return new AxisAlignedBoundingBox(box.minimum, box.maximum, box.center);
            }

            result.minimum = Cartographic.Cartesian3.clone(box.minimum, result.minimum);
            result.maximum = Cartographic.Cartesian3.clone(box.maximum, result.maximum);
            result.center = Cartographic.Cartesian3.clone(box.center, result.center);
            return result;
        };

        /**
         * Compares the provided AxisAlignedBoundingBox componentwise and returns
         * <code>true</code> if they are equal, <code>false</code> otherwise.
         *
         * @param {AxisAlignedBoundingBox} [left] The first AxisAlignedBoundingBox.
         * @param {AxisAlignedBoundingBox} [right] The second AxisAlignedBoundingBox.
         * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
         */
        AxisAlignedBoundingBox.equals = function(left, right) {
            return (left === right) ||
                   ((when.defined(left)) &&
                    (when.defined(right)) &&
                    Cartographic.Cartesian3.equals(left.center, right.center) &&
                    Cartographic.Cartesian3.equals(left.minimum, right.minimum) &&
                    Cartographic.Cartesian3.equals(left.maximum, right.maximum));
        };

        var intersectScratch = new Cartographic.Cartesian3();
        /**
         * Determines which side of a plane a box is located.
         *
         * @param {AxisAlignedBoundingBox} box The bounding box to test.
         * @param {Plane} plane The plane to test against.
         * @returns {Intersect} {@link Intersect.INSIDE} if the entire box is on the side of the plane
         *                      the normal is pointing, {@link Intersect.OUTSIDE} if the entire box is
         *                      on the opposite side, and {@link Intersect.INTERSECTING} if the box
         *                      intersects the plane.
         */
        AxisAlignedBoundingBox.intersectPlane = function(box, plane) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('box', box);
            Check.Check.defined('plane', plane);
            //>>includeEnd('debug');

            intersectScratch = Cartographic.Cartesian3.subtract(box.maximum, box.minimum, intersectScratch);
            var h = Cartographic.Cartesian3.multiplyByScalar(intersectScratch, 0.5, intersectScratch); //The positive half diagonal
            var normal = plane.normal;
            var e = h.x * Math.abs(normal.x) + h.y * Math.abs(normal.y) + h.z * Math.abs(normal.z);
            var s = Cartographic.Cartesian3.dot(box.center, normal) + plane.distance; //signed distance from center

            if (s - e > 0) {
                return BoundingSphere.Intersect.INSIDE;
            }

            if (s + e < 0) {
                //Not in front because normals point inward
                return BoundingSphere.Intersect.OUTSIDE;
            }

            return BoundingSphere.Intersect.INTERSECTING;
        };

        /**
         * Duplicates this AxisAlignedBoundingBox instance.
         *
         * @param {AxisAlignedBoundingBox} [result] The object onto which to store the result.
         * @returns {AxisAlignedBoundingBox} The modified result parameter or a new AxisAlignedBoundingBox instance if one was not provided.
         */
        AxisAlignedBoundingBox.prototype.clone = function(result) {
            return AxisAlignedBoundingBox.clone(this, result);
        };

        /**
         * Determines which side of a plane this box is located.
         *
         * @param {Plane} plane The plane to test against.
         * @returns {Intersect} {@link Intersect.INSIDE} if the entire box is on the side of the plane
         *                      the normal is pointing, {@link Intersect.OUTSIDE} if the entire box is
         *                      on the opposite side, and {@link Intersect.INTERSECTING} if the box
         *                      intersects the plane.
         */
        AxisAlignedBoundingBox.prototype.intersectPlane = function(plane) {
            return AxisAlignedBoundingBox.intersectPlane(this, plane);
        };

        /**
         * Compares this AxisAlignedBoundingBox against the provided AxisAlignedBoundingBox componentwise and returns
         * <code>true</code> if they are equal, <code>false</code> otherwise.
         *
         * @param {AxisAlignedBoundingBox} [right] The right hand side AxisAlignedBoundingBox.
         * @returns {Boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
         */
        AxisAlignedBoundingBox.prototype.equals = function(right) {
            return AxisAlignedBoundingBox.equals(this, right);
        };

    var scratchCart4 = new Cartesian4.Cartesian4();
        /**
         * A plane tangent to the provided ellipsoid at the provided origin.
         * If origin is not on the surface of the ellipsoid, it's surface projection will be used.
         * If origin is at the center of the ellipsoid, an exception will be thrown.
         * @alias EllipsoidTangentPlane
         * @constructor
         *
         * @param {Cartesian3} origin The point on the surface of the ellipsoid where the tangent plane touches.
         * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid to use.
         *
         * @exception {DeveloperError} origin must not be at the center of the ellipsoid.
         */
        function EllipsoidTangentPlane(origin, ellipsoid) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('origin', origin);
            //>>includeEnd('debug');

            ellipsoid = when.defaultValue(ellipsoid, Cartesian2.Ellipsoid.WGS84);
            origin = ellipsoid.scaleToGeodeticSurface(origin);

            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(origin)) {
                throw new Check.DeveloperError('origin must not be at the center of the ellipsoid.');
            }
            //>>includeEnd('debug');

            var eastNorthUp = Transforms.Transforms.eastNorthUpToFixedFrame(origin, ellipsoid);
            this._ellipsoid = ellipsoid;
            this._origin = origin;
            this._xAxis = Cartographic.Cartesian3.fromCartesian4(BoundingSphere.Matrix4.getColumn(eastNorthUp, 0, scratchCart4));
            this._yAxis = Cartographic.Cartesian3.fromCartesian4(BoundingSphere.Matrix4.getColumn(eastNorthUp, 1, scratchCart4));

            var normal = Cartographic.Cartesian3.fromCartesian4(BoundingSphere.Matrix4.getColumn(eastNorthUp, 2, scratchCart4));
            this._plane = Plane.Plane.fromPointNormal(origin, normal);
        }

        Object.defineProperties(EllipsoidTangentPlane.prototype, {
            /**
             * Gets the ellipsoid.
             * @memberof EllipsoidTangentPlane.prototype
             * @type {Ellipsoid}
             */
            ellipsoid : {
                get : function() {
                    return this._ellipsoid;
                }
            },

            /**
             * Gets the origin.
             * @memberof EllipsoidTangentPlane.prototype
             * @type {Cartesian3}
             */
            origin : {
                get : function() {
                    return this._origin;
                }
            },

            /**
             * Gets the plane which is tangent to the ellipsoid.
             * @memberof EllipsoidTangentPlane.prototype
             * @readonly
             * @type {Plane}
             */
            plane : {
                get : function() {
                    return this._plane;
                }
            },

            /**
             * Gets the local X-axis (east) of the tangent plane.
             * @memberof EllipsoidTangentPlane.prototype
             * @readonly
             * @type {Cartesian3}
             */
            xAxis : {
                get : function() {
                    return this._xAxis;
                }
            },

            /**
             * Gets the local Y-axis (north) of the tangent plane.
             * @memberof EllipsoidTangentPlane.prototype
             * @readonly
             * @type {Cartesian3}
             */
            yAxis : {
                get : function() {
                    return this._yAxis;
                }
            },

            /**
             * Gets the local Z-axis (up) of the tangent plane.
             * @member EllipsoidTangentPlane.prototype
             * @readonly
             * @type {Cartesian3}
             */
            zAxis : {
                get : function() {
                    return this._plane.normal;
                }
            }
        });

        var tmp = new AxisAlignedBoundingBox();
        /**
         * Creates a new instance from the provided ellipsoid and the center
         * point of the provided Cartesians.
         *
         * @param {Cartesian3} cartesians The list of positions surrounding the center point.
         * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid to use.
         */
        EllipsoidTangentPlane.fromPoints = function(cartesians, ellipsoid) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('cartesians', cartesians);
            //>>includeEnd('debug');

            var box = AxisAlignedBoundingBox.fromPoints(cartesians, tmp);
            return new EllipsoidTangentPlane(box.center, ellipsoid);
        };

        var scratchProjectPointOntoPlaneRay = new IntersectionTests.Ray();
        var scratchProjectPointOntoPlaneCartesian3 = new Cartographic.Cartesian3();

        /**
         * Computes the projection of the provided 3D position onto the 2D plane, radially outward from the {@link EllipsoidTangentPlane.ellipsoid} coordinate system origin.
         *
         * @param {Cartesian3} cartesian The point to project.
         * @param {Cartesian2} [result] The object onto which to store the result.
         * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if none was provided. Undefined if there is no intersection point
         */
        EllipsoidTangentPlane.prototype.projectPointOntoPlane = function(cartesian, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('cartesian', cartesian);
            //>>includeEnd('debug');

            var ray = scratchProjectPointOntoPlaneRay;
            ray.origin = cartesian;
            Cartographic.Cartesian3.normalize(cartesian, ray.direction);

            var intersectionPoint = IntersectionTests.IntersectionTests.rayPlane(ray, this._plane, scratchProjectPointOntoPlaneCartesian3);
            if (!when.defined(intersectionPoint)) {
                Cartographic.Cartesian3.negate(ray.direction, ray.direction);
                intersectionPoint = IntersectionTests.IntersectionTests.rayPlane(ray, this._plane, scratchProjectPointOntoPlaneCartesian3);
            }

            if (when.defined(intersectionPoint)) {
                var v = Cartographic.Cartesian3.subtract(intersectionPoint, this._origin, intersectionPoint);
                var x = Cartographic.Cartesian3.dot(this._xAxis, v);
                var y = Cartographic.Cartesian3.dot(this._yAxis, v);

                if (!when.defined(result)) {
                    return new Cartesian2.Cartesian2(x, y);
                }
                result.x = x;
                result.y = y;
                return result;
            }
            return undefined;
        };

        /**
         * Computes the projection of the provided 3D positions onto the 2D plane (where possible), radially outward from the global origin.
         * The resulting array may be shorter than the input array - if a single projection is impossible it will not be included.
         *
         * @see EllipsoidTangentPlane.projectPointOntoPlane
         *
         * @param {Cartesian3[]} cartesians The array of points to project.
         * @param {Cartesian2[]} [result] The array of Cartesian2 instances onto which to store results.
         * @returns {Cartesian2[]} The modified result parameter or a new array of Cartesian2 instances if none was provided.
         */
        EllipsoidTangentPlane.prototype.projectPointsOntoPlane = function(cartesians, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('cartesians', cartesians);
            //>>includeEnd('debug');

            if (!when.defined(result)) {
                result = [];
            }

            var count = 0;
            var length = cartesians.length;
            for ( var i = 0; i < length; i++) {
                var p = this.projectPointOntoPlane(cartesians[i], result[count]);
                if (when.defined(p)) {
                    result[count] = p;
                    count++;
                }
            }
            result.length = count;
            return result;
        };

        /**
         * Computes the projection of the provided 3D position onto the 2D plane, along the plane normal.
         *
         * @param {Cartesian3} cartesian The point to project.
         * @param {Cartesian2} [result] The object onto which to store the result.
         * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if none was provided.
         */
        EllipsoidTangentPlane.prototype.projectPointToNearestOnPlane = function(cartesian, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('cartesian', cartesian);
            //>>includeEnd('debug');

            if (!when.defined(result)) {
                result = new Cartesian2.Cartesian2();
            }

            var ray = scratchProjectPointOntoPlaneRay;
            ray.origin = cartesian;
            Cartographic.Cartesian3.clone(this._plane.normal, ray.direction);

            var intersectionPoint = IntersectionTests.IntersectionTests.rayPlane(ray, this._plane, scratchProjectPointOntoPlaneCartesian3);
            if (!when.defined(intersectionPoint)) {
                Cartographic.Cartesian3.negate(ray.direction, ray.direction);
                intersectionPoint = IntersectionTests.IntersectionTests.rayPlane(ray, this._plane, scratchProjectPointOntoPlaneCartesian3);
            }

            var v = Cartographic.Cartesian3.subtract(intersectionPoint, this._origin, intersectionPoint);
            var x = Cartographic.Cartesian3.dot(this._xAxis, v);
            var y = Cartographic.Cartesian3.dot(this._yAxis, v);

            result.x = x;
            result.y = y;
            return result;
        };

        /**
         * Computes the projection of the provided 3D positions onto the 2D plane, along the plane normal.
         *
         * @see EllipsoidTangentPlane.projectPointToNearestOnPlane
         *
         * @param {Cartesian3[]} cartesians The array of points to project.
         * @param {Cartesian2[]} [result] The array of Cartesian2 instances onto which to store results.
         * @returns {Cartesian2[]} The modified result parameter or a new array of Cartesian2 instances if none was provided. This will have the same length as <code>cartesians</code>.
         */
        EllipsoidTangentPlane.prototype.projectPointsToNearestOnPlane = function(cartesians, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('cartesians', cartesians);
            //>>includeEnd('debug');

            if (!when.defined(result)) {
                result = [];
            }

            var length = cartesians.length;
            result.length = length;
            for (var i = 0; i < length; i++) {
                result[i] = this.projectPointToNearestOnPlane(cartesians[i], result[i]);
            }
            return result;
        };

        var projectPointsOntoEllipsoidScratch = new Cartographic.Cartesian3();
        /**
         * Computes the projection of the provided 2D position onto the 3D ellipsoid.
         *
         * @param {Cartesian2} cartesian The points to project.
         * @param {Cartesian3} [result] The Cartesian3 instance to store result.
         * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if none was provided.
         */
        EllipsoidTangentPlane.prototype.projectPointOntoEllipsoid = function(cartesian, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('cartesian', cartesian);
            //>>includeEnd('debug');

            if (!when.defined(result)) {
                result = new Cartographic.Cartesian3();
            }

            var ellipsoid = this._ellipsoid;
            var origin = this._origin;
            var xAxis = this._xAxis;
            var yAxis = this._yAxis;
            var tmp = projectPointsOntoEllipsoidScratch;

            Cartographic.Cartesian3.multiplyByScalar(xAxis, cartesian.x, tmp);
            result = Cartographic.Cartesian3.add(origin, tmp, result);
            Cartographic.Cartesian3.multiplyByScalar(yAxis, cartesian.y, tmp);
            Cartographic.Cartesian3.add(result, tmp, result);
            ellipsoid.scaleToGeocentricSurface(result, result);

            return result;
        };

        /**
         * Computes the projection of the provided 2D positions onto the 3D ellipsoid.
         *
         * @param {Cartesian2[]} cartesians The array of points to project.
         * @param {Cartesian3[]} [result] The array of Cartesian3 instances onto which to store results.
         * @returns {Cartesian3[]} The modified result parameter or a new array of Cartesian3 instances if none was provided.
         */
        EllipsoidTangentPlane.prototype.projectPointsOntoEllipsoid = function(cartesians, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('cartesians', cartesians);
            //>>includeEnd('debug');

            var length = cartesians.length;
            if (!when.defined(result)) {
                result = new Array(length);
            } else {
                result.length = length;
            }

            for ( var i = 0; i < length; ++i) {
                result[i] = this.projectPointOntoEllipsoid(cartesians[i], result[i]);
            }

            return result;
        };

    exports.AxisAlignedBoundingBox = AxisAlignedBoundingBox;
    exports.EllipsoidTangentPlane = EllipsoidTangentPlane;

});

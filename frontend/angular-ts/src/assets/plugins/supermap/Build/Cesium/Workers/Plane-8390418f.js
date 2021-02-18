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
define(['exports', './when-8d13db60', './Check-70bec281', './Math-61ede240', './Cartographic-fe4be337', './BoundingSphere-775c5788'], function (exports, when, Check, _Math, Cartographic, BoundingSphere) { 'use strict';

    /**
         * A plane in Hessian Normal Form defined by
         * <pre>
         * ax + by + cz + d = 0
         * </pre>
         * where (a, b, c) is the plane's <code>normal</code>, d is the signed
         * <code>distance</code> to the plane, and (x, y, z) is any point on
         * the plane.
         *
         * @alias Plane
         * @constructor
         *
         * @param {Cartesian3} normal The plane's normal (normalized).
         * @param {Number} distance The shortest distance from the origin to the plane.  The sign of
         * <code>distance</code> determines which side of the plane the origin
         * is on.  If <code>distance</code> is positive, the origin is in the half-space
         * in the direction of the normal; if negative, the origin is in the half-space
         * opposite to the normal; if zero, the plane passes through the origin.
         *
         * @example
         * // The plane x=0
         * var plane = new Cesium.Plane(Cesium.Cartesian3.UNIT_X, 0.0);
         *
         * @exception {DeveloperError} Normal must be normalized
         */
        function Plane(normal, distance) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('normal', normal);
            if (!_Math.CesiumMath.equalsEpsilon(Cartographic.Cartesian3.magnitude(normal), 1.0, _Math.CesiumMath.EPSILON6)) {
                throw new Check.DeveloperError('normal must be normalized.');
            }
            Check.Check.typeOf.number('distance', distance);
            //>>includeEnd('debug');

            /**
             * The plane's normal.
             *
             * @type {Cartesian3}
             */
            this.normal = Cartographic.Cartesian3.clone(normal);

            /**
             * The shortest distance from the origin to the plane.  The sign of
             * <code>distance</code> determines which side of the plane the origin
             * is on.  If <code>distance</code> is positive, the origin is in the half-space
             * in the direction of the normal; if negative, the origin is in the half-space
             * opposite to the normal; if zero, the plane passes through the origin.
             *
             * @type {Number}
             */
            this.distance = distance;
        }

        /**
         * Creates a plane from a normal and a point on the plane.
         *
         * @param {Cartesian3} point The point on the plane.
         * @param {Cartesian3} normal The plane's normal (normalized).
         * @param {Plane} [result] The object onto which to store the result.
         * @returns {Plane} A new plane instance or the modified result parameter.
         *
         * @example
         * var point = Cesium.Cartesian3.fromDegrees(-72.0, 40.0);
         * var normal = ellipsoid.geodeticSurfaceNormal(point);
         * var tangentPlane = Cesium.Plane.fromPointNormal(point, normal);
         *
         * @exception {DeveloperError} Normal must be normalized
         */
        Plane.fromPointNormal = function(point, normal, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('point', point);
            Check.Check.typeOf.object('normal', normal);
            if (!_Math.CesiumMath.equalsEpsilon(Cartographic.Cartesian3.magnitude(normal), 1.0, _Math.CesiumMath.EPSILON6)) {
                throw new Check.DeveloperError('normal must be normalized.');
            }
            //>>includeEnd('debug');

            var distance = -Cartographic.Cartesian3.dot(normal, point);

            if (!when.defined(result)) {
                return new Plane(normal, distance);
            }

            Cartographic.Cartesian3.clone(normal, result.normal);
            result.distance = distance;
            return result;
        };

        var scratchNormal = new Cartographic.Cartesian3();
        /**
         * Creates a plane from the general equation
         *
         * @param {Cartesian4} coefficients The plane's normal (normalized).
         * @param {Plane} [result] The object onto which to store the result.
         * @returns {Plane} A new plane instance or the modified result parameter.
         *
         * @exception {DeveloperError} Normal must be normalized
         */
        Plane.fromCartesian4 = function(coefficients, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('coefficients', coefficients);
            //>>includeEnd('debug');

            var normal = Cartographic.Cartesian3.fromCartesian4(coefficients, scratchNormal);
            var distance = coefficients.w;

            //>>includeStart('debug', pragmas.debug);
            if (!_Math.CesiumMath.equalsEpsilon(Cartographic.Cartesian3.magnitude(normal), 1.0, _Math.CesiumMath.EPSILON6)) {
                throw new Check.DeveloperError('normal must be normalized.');
            }
            //>>includeEnd('debug');

            if (!when.defined(result)) {
                return new Plane(normal, distance);
            }
            Cartographic.Cartesian3.clone(normal, result.normal);
            result.distance = distance;
            return result;
        };

        /**
         * Computes the signed shortest distance of a point to a plane.
         * The sign of the distance determines which side of the plane the point
         * is on.  If the distance is positive, the point is in the half-space
         * in the direction of the normal; if negative, the point is in the half-space
         * opposite to the normal; if zero, the plane passes through the point.
         *
         * @param {Plane} plane The plane.
         * @param {Cartesian3} point The point.
         * @returns {Number} The signed shortest distance of the point to the plane.
         */
        Plane.getPointDistance = function(plane, point) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('plane', plane);
            Check.Check.typeOf.object('point', point);
            //>>includeEnd('debug');

            return Cartographic.Cartesian3.dot(plane.normal, point) + plane.distance;
        };

        var scratchCartesian = new Cartographic.Cartesian3();
        /**
         * Projects a point onto the plane.
         * @param {Plane} plane The plane to project the point onto
         * @param {Cartesian3} point The point to project onto the plane
         * @param {Cartesian3} [result] The result point.  If undefined, a new Cartesian3 will be created.
         * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided.
         */
        Plane.projectPointOntoPlane = function(plane, point, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('plane', plane);
            Check.Check.typeOf.object('point', point);
            //>>includeEnd('debug');

            if (!when.defined(result)) {
                result = new Cartographic.Cartesian3();
            }

            // projectedPoint = point - (normal.point + scale) * normal
            var pointDistance = Plane.getPointDistance(plane, point);
            var scaledNormal = Cartographic.Cartesian3.multiplyByScalar(plane.normal, pointDistance, scratchCartesian);

            return Cartographic.Cartesian3.subtract(point, scaledNormal, result);
        };

        var scratchPosition = new Cartographic.Cartesian3();
        /**
         * Transforms the plane by the given transformation matrix.
         *
         * @param {Plane} plane The plane.
         * @param {Matrix4} transform The transformation matrix.
         * @param {Plane} [result] The object into which to store the result.
         * @returns {Plane} The plane transformed by the given transformation matrix.
         */
        Plane.transform = function(plane, transform, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('plane', plane);
            Check.Check.typeOf.object('transform', transform);
            //>>includeEnd('debug');

            BoundingSphere.Matrix4.multiplyByPointAsVector(transform, plane.normal, scratchNormal);
            Cartographic.Cartesian3.normalize(scratchNormal, scratchNormal);

            Cartographic.Cartesian3.multiplyByScalar(plane.normal, -plane.distance, scratchPosition);
            BoundingSphere.Matrix4.multiplyByPoint(transform, scratchPosition, scratchPosition);

            return Plane.fromPointNormal(scratchPosition, scratchNormal, result);
        };

        /**
         * Duplicates a Plane instance.
         *
         * @param {Plane} plane The plane to duplicate.
         * @param {Plane} [result] The object onto which to store the result.
         * @returns {Plane} The modified result parameter or a new Plane instance if one was not provided.
         */
        Plane.clone = function(plane, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('plane', plane);
            //>>includeEnd('debug');

            if (!when.defined(result)) {
                return new Plane(plane.normal, plane.distance);
            }

            Cartographic.Cartesian3.clone(plane.normal, result.normal);
            result.distance = plane.distance;

            return result;
        };

        /**
         * Compares the provided Planes by normal and distance and returns
         * <code>true</code> if they are equal, <code>false</code> otherwise.
         *
         * @param {Plane} left The first plane.
         * @param {Plane} right The second plane.
         * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
         */
        Plane.equals = function(left, right) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('left', left);
            Check.Check.typeOf.object('right', right);
            //>>includeEnd('debug');

            return (left.distance === right.distance) && Cartographic.Cartesian3.equals(left.normal, right.normal);
        };

        /**
         * A constant initialized to the XY plane passing through the origin, with normal in positive Z.
         *
         * @type {Plane}
         * @constant
         */
        Plane.ORIGIN_XY_PLANE = Object.freeze(new Plane(Cartographic.Cartesian3.UNIT_Z, 0.0));

        /**
         * A constant initialized to the YZ plane passing through the origin, with normal in positive X.
         *
         * @type {Plane}
         * @constant
         */
        Plane.ORIGIN_YZ_PLANE = Object.freeze(new Plane(Cartographic.Cartesian3.UNIT_X, 0.0));

        /**
         * A constant initialized to the ZX plane passing through the origin, with normal in positive Y.
         *
         * @type {Plane}
         * @constant
         */
        Plane.ORIGIN_ZX_PLANE = Object.freeze(new Plane(Cartographic.Cartesian3.UNIT_Y, 0.0));

    exports.Plane = Plane;

});

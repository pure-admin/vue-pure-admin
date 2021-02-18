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
define(['exports', './when-8d13db60', './Check-70bec281', './Math-61ede240', './Cartographic-fe4be337', './Cartesian2-85064f09'], function (exports, when, Check, _Math, Cartographic, Cartesian2) { 'use strict';

    /**
         * The map projection used by Google Maps, Bing Maps, and most of ArcGIS Online, EPSG:3857.  This
         * projection use longitude and latitude expressed with the WGS84 and transforms them to Mercator using
         * the spherical (rather than ellipsoidal) equations.
         *
         * @alias WebMercatorProjection
         * @constructor
         *
         * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid.
         *
         * @see GeographicProjection
         */
        function WebMercatorProjection(ellipsoid) {
            this._ellipsoid = when.defaultValue(ellipsoid, Cartesian2.Ellipsoid.WGS84);
            this._semimajorAxis = this._ellipsoid.maximumRadius;
            this._oneOverSemimajorAxis = 1.0 / this._semimajorAxis;
        }

        Object.defineProperties(WebMercatorProjection.prototype, {
            /**
             * Gets the {@link Ellipsoid}.
             *
             * @memberof WebMercatorProjection.prototype
             *
             * @type {Ellipsoid}
             * @readonly
             */
            ellipsoid : {
                get : function() {
                    return this._ellipsoid;
                }
            }
        });

        /**
         * Converts a Mercator angle, in the range -PI to PI, to a geodetic latitude
         * in the range -PI/2 to PI/2.
         *
         * @param {Number} mercatorAngle The angle to convert.
         * @returns {Number} The geodetic latitude in radians.
         */
        WebMercatorProjection.mercatorAngleToGeodeticLatitude = function(mercatorAngle) {
            return _Math.CesiumMath.PI_OVER_TWO - (2.0 * Math.atan(Math.exp(-mercatorAngle)));
        };

        /**
         * Converts a geodetic latitude in radians, in the range -PI/2 to PI/2, to a Mercator
         * angle in the range -PI to PI.
         *
         * @param {Number} latitude The geodetic latitude in radians.
         * @returns {Number} The Mercator angle.
         */
        WebMercatorProjection.geodeticLatitudeToMercatorAngle = function(latitude) {
            // Clamp the latitude coordinate to the valid Mercator bounds.
            if (latitude > WebMercatorProjection.MaximumLatitude) {
                latitude = WebMercatorProjection.MaximumLatitude;
            } else if (latitude < -WebMercatorProjection.MaximumLatitude) {
                latitude = -WebMercatorProjection.MaximumLatitude;
            }
            var sinLatitude = Math.sin(latitude);
            return 0.5 * Math.log((1.0 + sinLatitude) / (1.0 - sinLatitude));
        };

        /**
         * The maximum latitude (both North and South) supported by a Web Mercator
         * (EPSG:3857) projection.  Technically, the Mercator projection is defined
         * for any latitude up to (but not including) 90 degrees, but it makes sense
         * to cut it off sooner because it grows exponentially with increasing latitude.
         * The logic behind this particular cutoff value, which is the one used by
         * Google Maps, Bing Maps, and Esri, is that it makes the projection
         * square.  That is, the rectangle is equal in the X and Y directions.
         *
         * The constant value is computed by calling:
         *    WebMercatorProjection.mercatorAngleToGeodeticLatitude(Math.PI)
         *
         * @type {Number}
         */
        WebMercatorProjection.MaximumLatitude = WebMercatorProjection.mercatorAngleToGeodeticLatitude(Math.PI);

        /**
         * Converts geodetic ellipsoid coordinates, in radians, to the equivalent Web Mercator
         * X, Y, Z coordinates expressed in meters and returned in a {@link Cartesian3}.  The height
         * is copied unmodified to the Z coordinate.
         *
         * @param {Cartographic} cartographic The cartographic coordinates in radians.
         * @param {Cartesian3} [result] The instance to which to copy the result, or undefined if a
         *        new instance should be created.
         * @returns {Cartesian3} The equivalent web mercator X, Y, Z coordinates, in meters.
         */
        WebMercatorProjection.prototype.project = function(cartographic, result) {
            var semimajorAxis = this._semimajorAxis;
            var x = cartographic.longitude * semimajorAxis;
            var y = WebMercatorProjection.geodeticLatitudeToMercatorAngle(cartographic.latitude) * semimajorAxis;
            var z = cartographic.height;

            if (!when.defined(result)) {
                return new Cartographic.Cartesian3(x, y, z);
            }

            result.x = x;
            result.y = y;
            result.z = z;
            return result;
        };

        /**
         * Converts Web Mercator X, Y coordinates, expressed in meters, to a {@link Cartographic}
         * containing geodetic ellipsoid coordinates.  The Z coordinate is copied unmodified to the
         * height.
         *
         * @param {Cartesian3} cartesian The web mercator Cartesian position to unrproject with height (z) in meters.
         * @param {Cartographic} [result] The instance to which to copy the result, or undefined if a
         *        new instance should be created.
         * @returns {Cartographic} The equivalent cartographic coordinates.
         */
        WebMercatorProjection.prototype.unproject = function(cartesian, result) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(cartesian)) {
                throw new Check.DeveloperError('cartesian is required');
            }
            //>>includeEnd('debug');

            var oneOverEarthSemimajorAxis = this._oneOverSemimajorAxis;
            var longitude = cartesian.x * oneOverEarthSemimajorAxis;
            var latitude = WebMercatorProjection.mercatorAngleToGeodeticLatitude(cartesian.y * oneOverEarthSemimajorAxis);
            var height = cartesian.z;

            if (!when.defined(result)) {
                return new Cartographic.Cartographic(longitude, latitude, height);
            }

            result.longitude = longitude;
            result.latitude = latitude;
            result.height = height;
            return result;
        };

    exports.WebMercatorProjection = WebMercatorProjection;

});

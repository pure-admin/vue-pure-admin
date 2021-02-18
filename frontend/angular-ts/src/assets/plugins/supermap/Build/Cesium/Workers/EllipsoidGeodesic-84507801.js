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

    function setConstants(ellipsoidGeodesic) {
            var uSquared = ellipsoidGeodesic._uSquared;
            var a = ellipsoidGeodesic._ellipsoid.maximumRadius;
            var b = ellipsoidGeodesic._ellipsoid.minimumRadius;
            var f = (a - b) / a;

            var cosineHeading = Math.cos(ellipsoidGeodesic._startHeading);
            var sineHeading = Math.sin(ellipsoidGeodesic._startHeading);

            var tanU = (1 - f) * Math.tan(ellipsoidGeodesic._start.latitude);

            var cosineU = 1.0 / Math.sqrt(1.0 + tanU * tanU);
            var sineU = cosineU * tanU;

            var sigma = Math.atan2(tanU, cosineHeading);

            var sineAlpha = cosineU * sineHeading;
            var sineSquaredAlpha = sineAlpha * sineAlpha;

            var cosineSquaredAlpha = 1.0 - sineSquaredAlpha;
            var cosineAlpha = Math.sqrt(cosineSquaredAlpha);

            var u2Over4 = uSquared / 4.0;
            var u4Over16 = u2Over4 * u2Over4;
            var u6Over64 = u4Over16 * u2Over4;
            var u8Over256 = u4Over16 * u4Over16;

            var a0 = (1.0 + u2Over4 - 3.0 * u4Over16 / 4.0 + 5.0 * u6Over64 / 4.0 - 175.0 * u8Over256 / 64.0);
            var a1 = (1.0 - u2Over4 + 15.0 * u4Over16 / 8.0 - 35.0 * u6Over64 / 8.0);
            var a2 = (1.0 - 3.0 * u2Over4 + 35.0 * u4Over16 / 4.0);
            var a3 = (1.0 - 5.0 * u2Over4);

            var distanceRatio = a0 * sigma - a1 * Math.sin(2.0 * sigma) * u2Over4 / 2.0 - a2 * Math.sin(4.0 * sigma) * u4Over16 / 16.0 -
                                a3 * Math.sin(6.0 * sigma) * u6Over64 / 48.0 - Math.sin(8.0 * sigma) * 5.0 * u8Over256 / 512;

            var constants = ellipsoidGeodesic._constants;

            constants.a = a;
            constants.b = b;
            constants.f = f;
            constants.cosineHeading = cosineHeading;
            constants.sineHeading = sineHeading;
            constants.tanU = tanU;
            constants.cosineU = cosineU;
            constants.sineU = sineU;
            constants.sigma = sigma;
            constants.sineAlpha = sineAlpha;
            constants.sineSquaredAlpha = sineSquaredAlpha;
            constants.cosineSquaredAlpha = cosineSquaredAlpha;
            constants.cosineAlpha = cosineAlpha;
            constants.u2Over4 = u2Over4;
            constants.u4Over16 = u4Over16;
            constants.u6Over64 = u6Over64;
            constants.u8Over256 = u8Over256;
            constants.a0 = a0;
            constants.a1 = a1;
            constants.a2 = a2;
            constants.a3 = a3;
            constants.distanceRatio = distanceRatio;
        }

        function computeC(f, cosineSquaredAlpha) {
            return f * cosineSquaredAlpha * (4.0 + f * (4.0 - 3.0 * cosineSquaredAlpha)) / 16.0;
        }

        function computeDeltaLambda(f, sineAlpha, cosineSquaredAlpha, sigma, sineSigma, cosineSigma, cosineTwiceSigmaMidpoint) {
            var C = computeC(f, cosineSquaredAlpha);

            return (1.0 - C) * f * sineAlpha * (sigma + C * sineSigma * (cosineTwiceSigmaMidpoint +
                    C * cosineSigma * (2.0 * cosineTwiceSigmaMidpoint * cosineTwiceSigmaMidpoint - 1.0)));
        }

        function vincentyInverseFormula(ellipsoidGeodesic, major, minor, firstLongitude, firstLatitude, secondLongitude, secondLatitude) {
            var eff = (major - minor) / major;
            var l = secondLongitude - firstLongitude;

            var u1 = Math.atan((1 - eff) * Math.tan(firstLatitude));
            var u2 = Math.atan((1 - eff) * Math.tan(secondLatitude));

            var cosineU1 = Math.cos(u1);
            var sineU1 = Math.sin(u1);
            var cosineU2 = Math.cos(u2);
            var sineU2 = Math.sin(u2);

            var cc = cosineU1 * cosineU2;
            var cs = cosineU1 * sineU2;
            var ss = sineU1 * sineU2;
            var sc = sineU1 * cosineU2;

            var lambda = l;
            var lambdaDot = _Math.CesiumMath.TWO_PI;

            var cosineLambda = Math.cos(lambda);
            var sineLambda = Math.sin(lambda);

            var sigma;
            var cosineSigma;
            var sineSigma;
            var cosineSquaredAlpha;
            var cosineTwiceSigmaMidpoint;

            do {
                cosineLambda = Math.cos(lambda);
                sineLambda = Math.sin(lambda);

                var temp = cs - sc * cosineLambda;
                sineSigma = Math.sqrt(cosineU2 * cosineU2 * sineLambda * sineLambda + temp * temp);
                cosineSigma = ss + cc * cosineLambda;

                sigma = Math.atan2(sineSigma, cosineSigma);

                var sineAlpha;

                if (sineSigma === 0.0) {
                    sineAlpha = 0.0;
                    cosineSquaredAlpha = 1.0;
                } else {
                    sineAlpha = cc * sineLambda / sineSigma;
                    cosineSquaredAlpha = 1.0 - sineAlpha * sineAlpha;
                }

                lambdaDot = lambda;

                cosineTwiceSigmaMidpoint = cosineSigma - 2.0 * ss / cosineSquaredAlpha;

                if (isNaN(cosineTwiceSigmaMidpoint)) {
                    cosineTwiceSigmaMidpoint = 0.0;
                }

                lambda = l + computeDeltaLambda(eff, sineAlpha, cosineSquaredAlpha,
                                                sigma, sineSigma, cosineSigma, cosineTwiceSigmaMidpoint);
            } while (Math.abs(lambda - lambdaDot) > _Math.CesiumMath.EPSILON12);

            var uSquared = cosineSquaredAlpha * (major * major - minor * minor) / (minor * minor);
            var A = 1.0 + uSquared * (4096.0 + uSquared * (uSquared * (320.0 - 175.0 * uSquared) - 768.0)) / 16384.0;
            var B = uSquared * (256.0 + uSquared * (uSquared * (74.0 - 47.0 * uSquared) - 128.0)) / 1024.0;

            var cosineSquaredTwiceSigmaMidpoint = cosineTwiceSigmaMidpoint * cosineTwiceSigmaMidpoint;
            var deltaSigma = B * sineSigma * (cosineTwiceSigmaMidpoint + B * (cosineSigma *
                    (2.0 * cosineSquaredTwiceSigmaMidpoint - 1.0) - B * cosineTwiceSigmaMidpoint *
                    (4.0 * sineSigma * sineSigma - 3.0) * (4.0 * cosineSquaredTwiceSigmaMidpoint - 3.0) / 6.0) / 4.0);

            var distance = minor * A * (sigma - deltaSigma);

            var startHeading = Math.atan2(cosineU2 * sineLambda, cs - sc * cosineLambda);
            var endHeading = Math.atan2(cosineU1 * sineLambda, cs * cosineLambda - sc);

            ellipsoidGeodesic._distance = distance;
            ellipsoidGeodesic._startHeading = startHeading;
            ellipsoidGeodesic._endHeading = endHeading;
            ellipsoidGeodesic._uSquared = uSquared;
        }

        var scratchCart1 = new Cartographic.Cartesian3();
        var scratchCart2 = new Cartographic.Cartesian3();
        function computeProperties(ellipsoidGeodesic, start, end, ellipsoid) {
            var firstCartesian = Cartographic.Cartesian3.normalize(ellipsoid.cartographicToCartesian(start, scratchCart2), scratchCart1);
            var lastCartesian = Cartographic.Cartesian3.normalize(ellipsoid.cartographicToCartesian(end, scratchCart2), scratchCart2);

            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.number.greaterThanOrEquals('value', Math.abs(Math.abs(Cartographic.Cartesian3.angleBetween(firstCartesian, lastCartesian)) - Math.PI), 0.0125);
            //>>includeEnd('debug');

            vincentyInverseFormula(ellipsoidGeodesic, ellipsoid.maximumRadius, ellipsoid.minimumRadius,
                                   start.longitude, start.latitude, end.longitude, end.latitude);

            ellipsoidGeodesic._start = Cartographic.Cartographic.clone(start, ellipsoidGeodesic._start);
            ellipsoidGeodesic._end = Cartographic.Cartographic.clone(end, ellipsoidGeodesic._end);
            ellipsoidGeodesic._start.height = 0;
            ellipsoidGeodesic._end.height = 0;

            setConstants(ellipsoidGeodesic);
        }

        /**
         * Initializes a geodesic on the ellipsoid connecting the two provided planetodetic points.
         *
         * @alias EllipsoidGeodesic
         * @constructor
         *
         * @param {Cartographic} [start] The initial planetodetic point on the path.
         * @param {Cartographic} [end] The final planetodetic point on the path.
         * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid on which the geodesic lies.
         */
        function EllipsoidGeodesic(start, end, ellipsoid) {
            var e = when.defaultValue(ellipsoid, Cartesian2.Ellipsoid.WGS84);
            this._ellipsoid = e;
            this._start = new Cartographic.Cartographic();
            this._end = new Cartographic.Cartographic();

            this._constants = {};
            this._startHeading = undefined;
            this._endHeading = undefined;
            this._distance = undefined;
            this._uSquared = undefined;

            if (when.defined(start) && when.defined(end)) {
                computeProperties(this, start, end, e);
            }
        }

        Object.defineProperties(EllipsoidGeodesic.prototype, {
            /**
             * Gets the ellipsoid.
             * @memberof EllipsoidGeodesic.prototype
             * @type {Ellipsoid}
             * @readonly
             */
            ellipsoid : {
                get : function() {
                    return this._ellipsoid;
                }
            },

            /**
             * Gets the surface distance between the start and end point
             * @memberof EllipsoidGeodesic.prototype
             * @type {Number}
             * @readonly
             */
            surfaceDistance : {
                get : function() {
                    //>>includeStart('debug', pragmas.debug);
                    Check.Check.defined('distance', this._distance);
                    //>>includeEnd('debug');

                    return this._distance;
                }
            },

            /**
             * Gets the initial planetodetic point on the path.
             * @memberof EllipsoidGeodesic.prototype
             * @type {Cartographic}
             * @readonly
             */
            start : {
                get : function() {
                    return this._start;
                }
            },

            /**
             * Gets the final planetodetic point on the path.
             * @memberof EllipsoidGeodesic.prototype
             * @type {Cartographic}
             * @readonly
             */
            end : {
                get : function() {
                    return this._end;
                }
            },

            /**
             * Gets the heading at the initial point.
             * @memberof EllipsoidGeodesic.prototype
             * @type {Number}
             * @readonly
             */
            startHeading : {
                get : function() {
                    //>>includeStart('debug', pragmas.debug);
                    Check.Check.defined('distance', this._distance);
                    //>>includeEnd('debug');

                    return this._startHeading;
                }
            },

            /**
             * Gets the heading at the final point.
             * @memberof EllipsoidGeodesic.prototype
             * @type {Number}
             * @readonly
             */
            endHeading : {
                get : function() {
                    //>>includeStart('debug', pragmas.debug);
                    Check.Check.defined('distance', this._distance);
                    //>>includeEnd('debug');

                    return this._endHeading;
                }
            }
        });

        /**
         * Sets the start and end points of the geodesic
         *
         * @param {Cartographic} start The initial planetodetic point on the path.
         * @param {Cartographic} end The final planetodetic point on the path.
         */
        EllipsoidGeodesic.prototype.setEndPoints = function(start, end) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('start', start);
            Check.Check.defined('end', end);
            //>>includeEnd('debug');

            computeProperties(this, start, end, this._ellipsoid);
        };

        /**
         * Provides the location of a point at the indicated portion along the geodesic.
         *
         * @param {Number} fraction The portion of the distance between the initial and final points.
         * @param {Cartographic} result The object in which to store the result.
         * @returns {Cartographic} The location of the point along the geodesic.
         */
        EllipsoidGeodesic.prototype.interpolateUsingFraction = function(fraction, result) {
            return this.interpolateUsingSurfaceDistance(this._distance * fraction, result);
        };

        /**
         * Provides the location of a point at the indicated distance along the geodesic.
         *
         * @param {Number} distance The distance from the inital point to the point of interest along the geodesic
         * @param {Cartographic} result The object in which to store the result.
         * @returns {Cartographic} The location of the point along the geodesic.
         *
         * @exception {DeveloperError} start and end must be set before calling function interpolateUsingSurfaceDistance
         */
        EllipsoidGeodesic.prototype.interpolateUsingSurfaceDistance = function(distance, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('distance', this._distance);
            //>>includeEnd('debug');

            var constants = this._constants;

            var s = constants.distanceRatio + distance / constants.b;

            var cosine2S = Math.cos(2.0 * s);
            var cosine4S = Math.cos(4.0 * s);
            var cosine6S = Math.cos(6.0 * s);
            var sine2S = Math.sin(2.0 * s);
            var sine4S = Math.sin(4.0 * s);
            var sine6S = Math.sin(6.0 * s);
            var sine8S = Math.sin(8.0 * s);

            var s2 = s * s;
            var s3 = s * s2;

            var u8Over256 = constants.u8Over256;
            var u2Over4 = constants.u2Over4;
            var u6Over64 = constants.u6Over64;
            var u4Over16 = constants.u4Over16;
            var sigma = 2.0 * s3 * u8Over256 * cosine2S / 3.0 +
                s * (1.0 - u2Over4 + 7.0 * u4Over16 / 4.0 - 15.0 * u6Over64 / 4.0 + 579.0 * u8Over256 / 64.0 -
                (u4Over16 - 15.0 * u6Over64 / 4.0 + 187.0 * u8Over256 / 16.0) * cosine2S -
                (5.0 * u6Over64 / 4.0 - 115.0 * u8Over256 / 16.0) * cosine4S -
                29.0 * u8Over256 * cosine6S / 16.0) +
                (u2Over4 / 2.0 - u4Over16 + 71.0 * u6Over64 / 32.0 - 85.0 * u8Over256 / 16.0) * sine2S +
                (5.0 * u4Over16 / 16.0 - 5.0 * u6Over64 / 4.0 + 383.0 * u8Over256 / 96.0) * sine4S -
                s2 * ((u6Over64 - 11.0 * u8Over256 / 2.0) * sine2S + 5.0 * u8Over256 * sine4S / 2.0) +
                (29.0 * u6Over64 / 96.0 - 29.0 * u8Over256 / 16.0) * sine6S +
                539.0 * u8Over256 * sine8S / 1536.0;

            var theta = Math.asin(Math.sin(sigma) * constants.cosineAlpha);
            var latitude = Math.atan(constants.a / constants.b * Math.tan(theta));

            // Redefine in terms of relative argument of latitude.
            sigma = sigma - constants.sigma;

            var cosineTwiceSigmaMidpoint = Math.cos(2.0 * constants.sigma + sigma);

            var sineSigma = Math.sin(sigma);
            var cosineSigma = Math.cos(sigma);

            var cc = constants.cosineU * cosineSigma;
            var ss = constants.sineU * sineSigma;

            var lambda = Math.atan2(sineSigma * constants.sineHeading, cc - ss * constants.cosineHeading);

            var l = lambda - computeDeltaLambda(constants.f, constants.sineAlpha, constants.cosineSquaredAlpha,
                                                sigma, sineSigma, cosineSigma, cosineTwiceSigmaMidpoint);

            if (when.defined(result)) {
                result.longitude = this._start.longitude + l;
                result.latitude = latitude;
                result.height = 0.0;
                return result;
            }

            return new Cartographic.Cartographic(this._start.longitude + l, latitude, 0.0);
        };

    exports.EllipsoidGeodesic = EllipsoidGeodesic;

});

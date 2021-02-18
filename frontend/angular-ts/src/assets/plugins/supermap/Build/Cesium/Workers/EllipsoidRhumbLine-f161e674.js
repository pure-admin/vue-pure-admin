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

    function calculateM(ellipticity, major, latitude) {
            if (ellipticity === 0.0) { // sphere
                return major * latitude;
            }

            var e2 = ellipticity * ellipticity;
            var e4 = e2 * e2;
            var e6 = e4 * e2;
            var e8 = e6 * e2;
            var e10 = e8 * e2;
            var e12 = e10 * e2;
            var phi = latitude;
            var sin2Phi = Math.sin(2 * phi);
            var sin4Phi = Math.sin(4 * phi);
            var sin6Phi = Math.sin(6 * phi);
            var sin8Phi = Math.sin(8 * phi);
            var sin10Phi = Math.sin(10 * phi);
            var sin12Phi = Math.sin(12 * phi);

            return major * ((1 - e2 / 4 - 3 * e4 / 64 - 5 * e6 / 256 - 175 * e8 / 16384 - 441 * e10 / 65536 - 4851 * e12 / 1048576) * phi
                         - (3 * e2 / 8 + 3 * e4 / 32 + 45 * e6 / 1024 + 105 * e8 / 4096 + 2205 * e10 / 131072 + 6237 * e12 / 524288) * sin2Phi
                         + (15 * e4 / 256 + 45 * e6 / 1024 + 525 * e8 / 16384 + 1575 * e10 / 65536 + 155925 * e12 / 8388608) * sin4Phi
                         - (35 * e6 / 3072 + 175 * e8 / 12288 + 3675 * e10 / 262144 + 13475 * e12 / 1048576) * sin6Phi
                         + (315 * e8 / 131072 + 2205 * e10 / 524288 + 43659 * e12 / 8388608) * sin8Phi
                         - (693 * e10 / 1310720 + 6237 * e12 / 5242880) * sin10Phi
                         + 1001 * e12 / 8388608 * sin12Phi);
        }

        function calculateInverseM(M, ellipticity, major) {
            var d = M / major;

            if (ellipticity === 0.0) { // sphere
                return d;
            }

            var d2 = d * d;
            var d3 = d2 * d;
            var d4 = d3 * d;
            var e = ellipticity;
            var e2 = e * e;
            var e4 = e2 * e2;
            var e6 = e4 * e2;
            var e8 = e6 * e2;
            var e10 = e8 * e2;
            var e12 = e10 * e2;
            var sin2D = Math.sin(2 * d);
            var cos2D = Math.cos(2 * d);
            var sin4D = Math.sin(4 * d);
            var cos4D = Math.cos(4 * d);
            var sin6D = Math.sin(6 * d);
            var cos6D = Math.cos(6 * d);
            var sin8D = Math.sin(8 * d);
            var cos8D = Math.cos(8 * d);
            var sin10D = Math.sin(10 * d);
            var cos10D = Math.cos(10 * d);
            var sin12D = Math.sin(12 * d);

            return d + d * e2 / 4 + 7 * d * e4 / 64 + 15 * d * e6 / 256 + 579 * d * e8 / 16384 + 1515 * d * e10 / 65536 + 16837 * d * e12 / 1048576
                + (3 * d * e4 / 16 + 45 * d * e6 / 256 - d * (32 * d2 - 561) * e8 / 4096 - d * (232 * d2 - 1677) * e10 / 16384 + d * (399985 - 90560 * d2 + 512 * d4) * e12 / 5242880) * cos2D
                + (21 * d * e6 / 256 + 483 * d * e8 / 4096 - d * (224 * d2 - 1969) * e10 / 16384 - d * (33152 * d2 - 112599) * e12 / 1048576) * cos4D
                + (151 * d * e8 / 4096 + 4681 * d * e10 / 65536 + 1479 * d * e12 / 16384 - 453 * d3 * e12 / 32768) * cos6D
                + (1097 * d * e10 / 65536 + 42783 * d * e12 / 1048576) * cos8D
                + 8011 * d * e12 / 1048576 * cos10D
                + (3 * e2 / 8 + 3 * e4 / 16 + 213 * e6 / 2048 - 3 * d2 * e6 / 64 + 255 * e8 / 4096 - 33 * d2 * e8 / 512 + 20861 * e10 / 524288 - 33 * d2 * e10 / 512 + d4 * e10 / 1024 + 28273 * e12 / 1048576 - 471 * d2 * e12 / 8192 + 9 * d4 * e12 / 4096) * sin2D
                + (21 * e4 / 256 + 21 * e6 / 256 + 533 * e8 / 8192 - 21 * d2 * e8 / 512 + 197 * e10 / 4096 - 315 * d2 * e10 / 4096 + 584039 * e12 / 16777216 - 12517 * d2 * e12 / 131072 + 7 * d4 * e12 / 2048) * sin4D
                + (151 * e6 / 6144 + 151 * e8 / 4096 + 5019 * e10 / 131072 - 453 * d2 * e10 / 16384 + 26965 * e12 / 786432 - 8607 * d2 * e12 / 131072) * sin6D
                + (1097 * e8 / 131072 + 1097 * e10 / 65536 + 225797 * e12 / 10485760 - 1097 * d2 * e12 / 65536) * sin8D
                + (8011 * e10 / 2621440 + 8011 * e12 / 1048576) * sin10D
                + 293393 * e12 / 251658240 * sin12D;
        }

        function calculateSigma(ellipticity, latitude) {
            if (ellipticity === 0.0) { // sphere
                return Math.log(Math.tan(0.5 * (_Math.CesiumMath.PI_OVER_TWO + latitude)));
            }

            var eSinL = ellipticity * Math.sin(latitude);
            return Math.log(Math.tan(0.5 * (_Math.CesiumMath.PI_OVER_TWO + latitude))) - (ellipticity / 2.0 * Math.log((1 + eSinL) / (1 - eSinL)));
        }

        function calculateHeading(ellipsoidRhumbLine, firstLongitude, firstLatitude, secondLongitude, secondLatitude) {
            var sigma1 = calculateSigma(ellipsoidRhumbLine._ellipticity, firstLatitude);
            var sigma2 = calculateSigma(ellipsoidRhumbLine._ellipticity, secondLatitude);
            return Math.atan2(_Math.CesiumMath.negativePiToPi(secondLongitude - firstLongitude), sigma2 - sigma1);
        }

        function calculateArcLength(ellipsoidRhumbLine, major, minor, firstLongitude, firstLatitude, secondLongitude, secondLatitude) {
            var heading = ellipsoidRhumbLine._heading;
            var deltaLongitude = secondLongitude - firstLongitude;

            var distance = 0.0;

            //Check to see if the rhumb line has constant latitude
            //This equation will diverge if heading gets close to 90 degrees
            if (_Math.CesiumMath.equalsEpsilon(Math.abs(heading), _Math.CesiumMath.PI_OVER_TWO, _Math.CesiumMath.EPSILON8)) { //If heading is close to 90 degrees
                if (major === minor) {
                    distance = major * Math.cos(firstLatitude) * _Math.CesiumMath.negativePiToPi(deltaLongitude);
                } else {
                    var sinPhi = Math.sin(firstLatitude);
                    distance = major * Math.cos(firstLatitude) * _Math.CesiumMath.negativePiToPi(deltaLongitude) / Math.sqrt(1 - ellipsoidRhumbLine._ellipticitySquared * sinPhi * sinPhi);
                }
            } else {
                var M1 = calculateM(ellipsoidRhumbLine._ellipticity, major, firstLatitude);
                var M2 = calculateM(ellipsoidRhumbLine._ellipticity, major, secondLatitude);

                distance = (M2 - M1) / Math.cos(heading);
            }
            return Math.abs(distance);
        }

        var scratchCart1 = new Cartographic.Cartesian3();
        var scratchCart2 = new Cartographic.Cartesian3();

        function computeProperties(ellipsoidRhumbLine, start, end, ellipsoid) {
            var firstCartesian = Cartographic.Cartesian3.normalize(ellipsoid.cartographicToCartesian(start, scratchCart2), scratchCart1);
            var lastCartesian = Cartographic.Cartesian3.normalize(ellipsoid.cartographicToCartesian(end, scratchCart2), scratchCart2);

            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.number.greaterThanOrEquals('value', Math.abs(Math.abs(Cartographic.Cartesian3.angleBetween(firstCartesian, lastCartesian)) - Math.PI), 0.0125);
            //>>includeEnd('debug');

            var major = ellipsoid.maximumRadius;
            var minor = ellipsoid.minimumRadius;
            var majorSquared = major * major;
            var minorSquared = minor * minor;
            ellipsoidRhumbLine._ellipticitySquared = (majorSquared - minorSquared) / majorSquared;
            ellipsoidRhumbLine._ellipticity = Math.sqrt(ellipsoidRhumbLine._ellipticitySquared);

            ellipsoidRhumbLine._start = Cartographic.Cartographic.clone(start, ellipsoidRhumbLine._start);
            ellipsoidRhumbLine._start.height = 0;

            ellipsoidRhumbLine._end = Cartographic.Cartographic.clone(end, ellipsoidRhumbLine._end);
            ellipsoidRhumbLine._end.height = 0;

            ellipsoidRhumbLine._heading = calculateHeading(ellipsoidRhumbLine, start.longitude, start.latitude, end.longitude, end.latitude);
            ellipsoidRhumbLine._distance = calculateArcLength(ellipsoidRhumbLine, ellipsoid.maximumRadius, ellipsoid.minimumRadius,
                                                              start.longitude, start.latitude, end.longitude, end.latitude);
        }

        function interpolateUsingSurfaceDistance(start, heading, distance, major, ellipticity, result)
        {
            var ellipticitySquared = ellipticity * ellipticity;

            var longitude;
            var latitude;
            var deltaLongitude;

            //Check to see if the rhumb line has constant latitude
            //This won't converge if heading is close to 90 degrees
            if (Math.abs(_Math.CesiumMath.PI_OVER_TWO - Math.abs(heading)) > _Math.CesiumMath.EPSILON8) {
                //Calculate latitude of the second point
                var M1 = calculateM(ellipticity, major, start.latitude);
                var deltaM = distance * Math.cos(heading);
                var M2 = M1 + deltaM;
                latitude = calculateInverseM(M2, ellipticity, major);

                //Now find the longitude of the second point
                var sigma1 = calculateSigma(ellipticity, start.latitude);
                var sigma2 = calculateSigma(ellipticity, latitude);
                deltaLongitude = Math.tan(heading) * (sigma2 - sigma1);
                longitude = _Math.CesiumMath.negativePiToPi(start.longitude + deltaLongitude);
            } else { //If heading is close to 90 degrees
                latitude = start.latitude;
                var localRad;

                if (ellipticity === 0.0) { // sphere
                    localRad = major * Math.cos(start.latitude);
                } else {
                    var sinPhi = Math.sin(start.latitude);
                    localRad = major * Math.cos(start.latitude) / Math.sqrt(1 - ellipticitySquared * sinPhi * sinPhi);
                }

                deltaLongitude = distance / localRad;
                if (heading > 0.0) {
                    longitude = _Math.CesiumMath.negativePiToPi(start.longitude + deltaLongitude);
                } else {
                    longitude = _Math.CesiumMath.negativePiToPi(start.longitude - deltaLongitude);
                }
            }

            if (when.defined(result)) {
                result.longitude = longitude;
                result.latitude = latitude;
                result.height = 0;

                return result;
            }

            return new Cartographic.Cartographic(longitude, latitude, 0);
        }

        /**
         * Initializes a rhumb line on the ellipsoid connecting the two provided planetodetic points.
         *
         * @alias EllipsoidRhumbLine
         * @constructor
         *
         * @param {Cartographic} [start] The initial planetodetic point on the path.
         * @param {Cartographic} [end] The final planetodetic point on the path.
         * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid on which the rhumb line lies.
         *
         * @exception {DeveloperError} angle between start and end must be at least 0.0125 radians.
         */
        function EllipsoidRhumbLine(start, end, ellipsoid) {
            var e = when.defaultValue(ellipsoid, Cartesian2.Ellipsoid.WGS84);
            this._ellipsoid = e;
            this._start = new Cartographic.Cartographic();
            this._end = new Cartographic.Cartographic();

            this._heading = undefined;
            this._distance = undefined;
            this._ellipticity = undefined;
            this._ellipticitySquared = undefined;

            if (when.defined(start) && when.defined(end)) {
                computeProperties(this, start, end, e);
            }
        }

        Object.defineProperties(EllipsoidRhumbLine.prototype, {
            /**
             * Gets the ellipsoid.
             * @memberof EllipsoidRhumbLine.prototype
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
             * @memberof EllipsoidRhumbLine.prototype
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
             * @memberof EllipsoidRhumbLine.prototype
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
             * @memberof EllipsoidRhumbLine.prototype
             * @type {Cartographic}
             * @readonly
             */
            end : {
                get : function() {
                    return this._end;
                }
            },

            /**
             * Gets the heading from the start point to the end point.
             * @memberof EllipsoidRhumbLine.prototype
             * @type {Number}
             * @readonly
             */
            heading : {
                get : function() {
                    //>>includeStart('debug', pragmas.debug);
                    Check.Check.defined('distance', this._distance);
                    //>>includeEnd('debug');

                    return this._heading;
                }
            }
        });

        /**
         * Create a rhumb line using an initial position with a heading and distance.
         *
         * @param {Cartographic} start The initial planetodetic point on the path.
         * @param {Number} heading The heading in radians.
         * @param {Number} distance The rhumb line distance between the start and end point.
         * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid on which the rhumb line lies.
         * @param {EllipsoidRhumbLine} [result] The object in which to store the result.
         * @returns {EllipsoidRhumbLine} The EllipsoidRhumbLine object.
         */
        EllipsoidRhumbLine.fromStartHeadingDistance = function(start, heading, distance, ellipsoid, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('start', start);
            Check.Check.defined('heading', heading);
            Check.Check.defined('distance', distance);
            Check.Check.typeOf.number.greaterThan('distance', distance, 0.0);
            //>>includeEnd('debug');

            var e = when.defaultValue(ellipsoid, Cartesian2.Ellipsoid.WGS84);
            var major = e.maximumRadius;
            var minor = e.minimumRadius;
            var majorSquared = major * major;
            var minorSquared = minor * minor;
            var ellipticity = Math.sqrt((majorSquared - minorSquared) / majorSquared);

            heading = _Math.CesiumMath.negativePiToPi(heading);
            var end = interpolateUsingSurfaceDistance(start, heading, distance, e.maximumRadius, ellipticity);

            if (!when.defined(result) || (when.defined(ellipsoid) && !ellipsoid.equals(result.ellipsoid))) {
                return new EllipsoidRhumbLine(start, end, e);
            }

            result.setEndPoints(start, end);
            return result;
        };

        /**
         * Sets the start and end points of the rhumb line.
         *
         * @param {Cartographic} start The initial planetodetic point on the path.
         * @param {Cartographic} end The final planetodetic point on the path.
         */
        EllipsoidRhumbLine.prototype.setEndPoints = function(start, end) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('start', start);
            Check.Check.defined('end', end);
            //>>includeEnd('debug');

            computeProperties(this, start, end, this._ellipsoid);
        };

        /**
         * Provides the location of a point at the indicated portion along the rhumb line.
         *
         * @param {Number} fraction The portion of the distance between the initial and final points.
         * @param {Cartographic} [result] The object in which to store the result.
         * @returns {Cartographic} The location of the point along the rhumb line.
         */
        EllipsoidRhumbLine.prototype.interpolateUsingFraction = function(fraction, result) {
            return this.interpolateUsingSurfaceDistance(fraction * this._distance, result);
        };

        /**
         * Provides the location of a point at the indicated distance along the rhumb line.
         *
         * @param {Number} distance The distance from the inital point to the point of interest along the rhumbLine.
         * @param {Cartographic} [result] The object in which to store the result.
         * @returns {Cartographic} The location of the point along the rhumb line.
         *
         * @exception {DeveloperError} start and end must be set before calling function interpolateUsingSurfaceDistance
         */
        EllipsoidRhumbLine.prototype.interpolateUsingSurfaceDistance = function(distance, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.number('distance', distance);
            if (!when.defined(this._distance) || this._distance === 0.0) {
                throw new Check.DeveloperError('EllipsoidRhumbLine must have distinct start and end set.');
            }
            //>>includeEnd('debug');

            return interpolateUsingSurfaceDistance(this._start, this._heading, distance, this._ellipsoid.maximumRadius, this._ellipticity, result);
        };

        /**
         * Provides the location of a point at the indicated longitude along the rhumb line.
         * If the longitude is outside the range of start and end points, the first intersection with the longitude from the start point in the direction of the heading is returned. This follows the spiral property of a rhumb line.
         *
         * @param {Number} intersectionLongitude The longitude, in radians, at which to find the intersection point from the starting point using the heading.
         * @param {Cartographic} [result] The object in which to store the result.
         * @returns {Cartographic} The location of the intersection point along the rhumb line, undefined if there is no intersection or infinite intersections.
         *
         * @exception {DeveloperError} start and end must be set before calling function findIntersectionWithLongitude.
         */
        EllipsoidRhumbLine.prototype.findIntersectionWithLongitude = function(intersectionLongitude, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.number('intersectionLongitude', intersectionLongitude);
            if (!when.defined(this._distance) || this._distance === 0.0) {
                throw new Check.DeveloperError('EllipsoidRhumbLine must have distinct start and end set.');
            }
            //>>includeEnd('debug');

            var ellipticity = this._ellipticity;
            var heading = this._heading;
            var absHeading = Math.abs(heading);
            var start = this._start;

            intersectionLongitude = _Math.CesiumMath.negativePiToPi(intersectionLongitude);

            if (_Math.CesiumMath.equalsEpsilon(Math.abs(intersectionLongitude), Math.PI, _Math.CesiumMath.EPSILON14)) {
                intersectionLongitude = _Math.CesiumMath.sign(start.longitude) * Math.PI;
            }

            if (!when.defined(result)) {
                result = new Cartographic.Cartographic();
            }

            // If heading is -PI/2 or PI/2, this is an E-W rhumb line
            // If heading is 0 or PI, this is an N-S rhumb line
            if (Math.abs(_Math.CesiumMath.PI_OVER_TWO - absHeading) <= _Math.CesiumMath.EPSILON8) {
                result.longitude = intersectionLongitude;
                result.latitude = start.latitude;
                result.height = 0;
                return result;
            } else if (_Math.CesiumMath.equalsEpsilon(Math.abs(_Math.CesiumMath.PI_OVER_TWO - absHeading), _Math.CesiumMath.PI_OVER_TWO, _Math.CesiumMath.EPSILON8)) {
                if (_Math.CesiumMath.equalsEpsilon(intersectionLongitude, start.longitude, _Math.CesiumMath.EPSILON12)) {
                    return undefined;
                }

                result.longitude = intersectionLongitude;
                result.latitude = _Math.CesiumMath.PI_OVER_TWO * _Math.CesiumMath.sign(_Math.CesiumMath.PI_OVER_TWO - heading);
                result.height = 0;
                return result;
            }

            // Use iterative solver from Equation 9 from http://edwilliams.org/ellipsoid/ellipsoid.pdf
            var phi1 = start.latitude;
            var eSinPhi1 = ellipticity * Math.sin(phi1);
            var leftComponent = Math.tan(0.5 * (_Math.CesiumMath.PI_OVER_TWO + phi1)) * Math.exp((intersectionLongitude - start.longitude) / Math.tan(heading));
            var denominator = (1 + eSinPhi1) / (1 - eSinPhi1);

            var newPhi = start.latitude;
            var phi;
            do {
                phi = newPhi;
                var eSinPhi = ellipticity * Math.sin(phi);
                var numerator = (1 + eSinPhi) / (1 - eSinPhi);
                newPhi = 2 * Math.atan(leftComponent * Math.pow(numerator / denominator, ellipticity / 2)) - _Math.CesiumMath.PI_OVER_TWO;
            } while (!_Math.CesiumMath.equalsEpsilon(newPhi, phi, _Math.CesiumMath.EPSILON12));

            result.longitude = intersectionLongitude;
            result.latitude = newPhi;
            result.height = 0;
            return result;
        };

        /**
         * Provides the location of a point at the indicated latitude along the rhumb line.
         * If the latitude is outside the range of start and end points, the first intersection with the latitude from that start point in the direction of the heading is returned. This follows the spiral property of a rhumb line.
         *
         * @param {Number} intersectionLatitude The latitude, in radians, at which to find the intersection point from the starting point using the heading.
         * @param {Cartographic} [result] The object in which to store the result.
         * @returns {Cartographic} The location of the intersection point along the rhumb line, undefined if there is no intersection or infinite intersections.
         *
         * @exception {DeveloperError} start and end must be set before calling function findIntersectionWithLongitude.
         */
        EllipsoidRhumbLine.prototype.findIntersectionWithLatitude = function(intersectionLatitude, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.number('intersectionLatitude', intersectionLatitude);
            if (!when.defined(this._distance) || this._distance === 0.0) {
                throw new Check.DeveloperError('EllipsoidRhumbLine must have distinct start and end set.');
            }
            //>>includeEnd('debug');

            var ellipticity = this._ellipticity;
            var heading = this._heading;
            var start = this._start;

            // If start and end have same latitude, return undefined since it's either no intersection or infinite intersections
            if (_Math.CesiumMath.equalsEpsilon(Math.abs(heading), _Math.CesiumMath.PI_OVER_TWO, _Math.CesiumMath.EPSILON8)) {
                return;
            }

            // Can be solved using the same equations from interpolateUsingSurfaceDistance
            var sigma1 = calculateSigma(ellipticity, start.latitude);
            var sigma2 = calculateSigma(ellipticity, intersectionLatitude);
            var deltaLongitude = Math.tan(heading) * (sigma2 - sigma1);
            var longitude = _Math.CesiumMath.negativePiToPi(start.longitude + deltaLongitude);

            if (when.defined(result)) {
                result.longitude = longitude;
                result.latitude = intersectionLatitude;
                result.height = 0;

                return result;
            }

            return new Cartographic.Cartographic(longitude, intersectionLatitude, 0);
        };

    exports.EllipsoidRhumbLine = EllipsoidRhumbLine;

});

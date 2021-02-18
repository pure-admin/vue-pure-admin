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
define(['exports', './when-8d13db60', './Check-70bec281', './Math-61ede240', './Cartographic-fe4be337', './Cartesian2-85064f09', './BoundingSphere-775c5788', './GeometryAttribute-06d31d45'], function (exports, when, Check, _Math, Cartographic, Cartesian2, BoundingSphere, GeometryAttribute) { 'use strict';

    var cos = Math.cos;
        var sin = Math.sin;
        var sqrt = Math.sqrt;

        /**
         * @private
         */
        var RectangleGeometryLibrary = {};

        /**
         * @private
         */
        RectangleGeometryLibrary.computePosition = function(computedOptions, ellipsoid, computeST, row, col, position, st) {
            var radiiSquared = ellipsoid.radiiSquared;
            var nwCorner = computedOptions.nwCorner;
            var rectangle = computedOptions.boundingRectangle;

            var stLatitude = nwCorner.latitude - computedOptions.granYCos * row + col * computedOptions.granXSin;
            var cosLatitude = cos(stLatitude);
            var nZ = sin(stLatitude);
            var kZ = radiiSquared.z * nZ;

            var stLongitude = nwCorner.longitude + row * computedOptions.granYSin + col * computedOptions.granXCos;
            var nX = cosLatitude * cos(stLongitude);
            var nY = cosLatitude * sin(stLongitude);

            var kX = radiiSquared.x * nX;
            var kY = radiiSquared.y * nY;

            var gamma = sqrt((kX * nX) + (kY * nY) + (kZ * nZ));

            position.x = kX / gamma;
            position.y = kY / gamma;
            position.z = kZ / gamma;

            if (computeST) {
                var stNwCorner = computedOptions.stNwCorner;
                if (when.defined(stNwCorner)) {
                    stLatitude = stNwCorner.latitude - computedOptions.stGranYCos * row + col * computedOptions.stGranXSin;
                    stLongitude = stNwCorner.longitude + row * computedOptions.stGranYSin + col * computedOptions.stGranXCos;

                    st.x = (stLongitude - computedOptions.stWest) * computedOptions.lonScalar;
                    st.y = (stLatitude - computedOptions.stSouth) * computedOptions.latScalar;
                } else {
                    st.x = (stLongitude - rectangle.west) * computedOptions.lonScalar;
                    st.y = (stLatitude - rectangle.south) * computedOptions.latScalar;
                }
            }
        };

        var rotationMatrixScratch = new GeometryAttribute.Matrix2();
        var nwCartesian = new Cartographic.Cartesian3();
        var centerScratch = new Cartographic.Cartographic();
        var centerCartesian = new Cartographic.Cartesian3();
        var proj = new BoundingSphere.GeographicProjection();

        function getRotationOptions(nwCorner, rotation, granularityX, granularityY, center, width, height) {
            var cosRotation = Math.cos(rotation);
            var granYCos = granularityY * cosRotation;
            var granXCos = granularityX * cosRotation;

            var sinRotation = Math.sin(rotation);
            var granYSin = granularityY * sinRotation;
            var granXSin = granularityX * sinRotation;

            nwCartesian = proj.project(nwCorner, nwCartesian);

            nwCartesian = Cartographic.Cartesian3.subtract(nwCartesian, centerCartesian, nwCartesian);
            var rotationMatrix = GeometryAttribute.Matrix2.fromRotation(rotation, rotationMatrixScratch);
            nwCartesian = GeometryAttribute.Matrix2.multiplyByVector(rotationMatrix, nwCartesian, nwCartesian);
            nwCartesian = Cartographic.Cartesian3.add(nwCartesian, centerCartesian, nwCartesian);
            nwCorner = proj.unproject(nwCartesian, nwCorner);

            width -= 1;
            height -= 1;

            var latitude = nwCorner.latitude;
            var latitude0 = latitude + width * granXSin;
            var latitude1 = latitude - granYCos * height;
            var latitude2 = latitude - granYCos * height + width * granXSin;

            var north = Math.max(latitude, latitude0, latitude1, latitude2);
            var south = Math.min(latitude, latitude0, latitude1, latitude2);

            var longitude = nwCorner.longitude;
            var longitude0 = longitude + width * granXCos;
            var longitude1 = longitude + height * granYSin;
            var longitude2 = longitude + height * granYSin + width * granXCos;

            var east = Math.max(longitude, longitude0, longitude1, longitude2);
            var west = Math.min(longitude, longitude0, longitude1, longitude2);

            return {
                north: north,
                south: south,
                east: east,
                west: west,
                granYCos : granYCos,
                granYSin : granYSin,
                granXCos : granXCos,
                granXSin : granXSin,
                nwCorner : nwCorner
            };
        }

        /**
         * @private
         */
        RectangleGeometryLibrary.computeOptions = function(rectangle, granularity, rotation, stRotation, boundingRectangleScratch, nwCornerResult, stNwCornerResult) {
            var east = rectangle.east;
            var west = rectangle.west;
            var north = rectangle.north;
            var south = rectangle.south;

            var northCap = false;
            var southCap = false;

            if (north === _Math.CesiumMath.PI_OVER_TWO) {
                northCap = true;
            }
            if (south === -_Math.CesiumMath.PI_OVER_TWO) {
                southCap = true;
            }

            var width;
            var height;
            var granularityX;
            var granularityY;
            var dx;
            var dy = north - south;
            if (west > east) {
                dx = (_Math.CesiumMath.TWO_PI - west + east);
            } else {
                dx = east - west;
            }

            width = Math.ceil(dx / granularity) + 1;
            height = Math.ceil(dy / granularity) + 1;
            granularityX = dx / (width - 1);
            granularityY = dy / (height - 1);

            var nwCorner = Cartesian2.Rectangle.northwest(rectangle, nwCornerResult);
            var center = Cartesian2.Rectangle.center(rectangle, centerScratch);
            if (rotation !== 0 || stRotation !== 0) {
                if (center.longitude < nwCorner.longitude) {
                    center.longitude += _Math.CesiumMath.TWO_PI;
                }
                centerCartesian = proj.project(center, centerCartesian);
            }

            var granYCos = granularityY;
            var granXCos = granularityX;
            var granYSin = 0.0;
            var granXSin = 0.0;

            var boundingRectangle = Cartesian2.Rectangle.clone(rectangle, boundingRectangleScratch);

            var computedOptions = {
                granYCos : granYCos,
                granYSin : granYSin,
                granXCos : granXCos,
                granXSin : granXSin,
                nwCorner : nwCorner,
                boundingRectangle : boundingRectangle,
                width: width,
                height: height,
                northCap: northCap,
                southCap: southCap
            };

            if (rotation !== 0) {
                var rotationOptions = getRotationOptions(nwCorner, rotation, granularityX, granularityY, center, width, height);
                north = rotationOptions.north;
                south = rotationOptions.south;
                east = rotationOptions.east;
                west = rotationOptions.west;

                //>>includeStart('debug', pragmas.debug);
                if (north < -_Math.CesiumMath.PI_OVER_TWO || north > _Math.CesiumMath.PI_OVER_TWO ||
                    south < -_Math.CesiumMath.PI_OVER_TWO || south > _Math.CesiumMath.PI_OVER_TWO) {
                    throw new Check.DeveloperError('Rotated rectangle is invalid.  It crosses over either the north or south pole.');
                }
                //>>includeEnd('debug')

                computedOptions.granYCos = rotationOptions.granYCos;
                computedOptions.granYSin = rotationOptions.granYSin;
                computedOptions.granXCos = rotationOptions.granXCos;
                computedOptions.granXSin = rotationOptions.granXSin;

                boundingRectangle.north = north;
                boundingRectangle.south = south;
                boundingRectangle.east = east;
                boundingRectangle.west = west;
            }

            if (stRotation !== 0) {
                rotation = rotation - stRotation;
                var stNwCorner = Cartesian2.Rectangle.northwest(boundingRectangle, stNwCornerResult);

                var stRotationOptions = getRotationOptions(stNwCorner, rotation, granularityX, granularityY, center, width, height);

                computedOptions.stGranYCos =  stRotationOptions.granYCos;
                computedOptions.stGranXCos = stRotationOptions.granXCos;
                computedOptions.stGranYSin = stRotationOptions.granYSin;
                computedOptions.stGranXSin = stRotationOptions.granXSin;
                computedOptions.stNwCorner = stNwCorner;
                computedOptions.stWest = stRotationOptions.west;
                computedOptions.stSouth = stRotationOptions.south;
            }

            return computedOptions;
        };

    exports.RectangleGeometryLibrary = RectangleGeometryLibrary;

});

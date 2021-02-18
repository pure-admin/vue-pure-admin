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
define(['exports', './Math-61ede240', './Cartographic-fe4be337', './BoundingSphere-775c5788', './Transforms-913163ed'], function (exports, _Math, Cartographic, BoundingSphere, Transforms) { 'use strict';

    var EllipseGeometryLibrary = {};

        var rotAxis = new Cartographic.Cartesian3();
        var tempVec = new Cartographic.Cartesian3();
        var unitQuat = new Transforms.Quaternion();
        var rotMtx = new BoundingSphere.Matrix3();

        function pointOnEllipsoid(theta, rotation, northVec, eastVec, aSqr, ab, bSqr, mag, unitPos, result) {
            var azimuth = theta + rotation;

            Cartographic.Cartesian3.multiplyByScalar(eastVec, Math.cos(azimuth), rotAxis);
            Cartographic.Cartesian3.multiplyByScalar(northVec, Math.sin(azimuth), tempVec);
            Cartographic.Cartesian3.add(rotAxis, tempVec, rotAxis);

            var cosThetaSquared = Math.cos(theta);
            cosThetaSquared = cosThetaSquared * cosThetaSquared;

            var sinThetaSquared = Math.sin(theta);
            sinThetaSquared = sinThetaSquared * sinThetaSquared;

            var radius = ab / Math.sqrt(bSqr * cosThetaSquared + aSqr * sinThetaSquared);
            var angle = radius / mag;

            // Create the quaternion to rotate the position vector to the boundary of the ellipse.
            Transforms.Quaternion.fromAxisAngle(rotAxis, angle, unitQuat);
            BoundingSphere.Matrix3.fromQuaternion(unitQuat, rotMtx);

            BoundingSphere.Matrix3.multiplyByVector(rotMtx, unitPos, result);
            Cartographic.Cartesian3.normalize(result, result);
            Cartographic.Cartesian3.multiplyByScalar(result, mag, result);
            return result;
        }

        var scratchCartesian1 = new Cartographic.Cartesian3();
        var scratchCartesian2 = new Cartographic.Cartesian3();
        var scratchCartesian3 = new Cartographic.Cartesian3();
        var scratchNormal = new Cartographic.Cartesian3();
        /**
         * Returns the positions raised to the given heights
         * @private
         */
        EllipseGeometryLibrary.raisePositionsToHeight = function(positions, options, extrude) {
            var ellipsoid = options.ellipsoid;
            var height = options.height;
            var extrudedHeight = options.extrudedHeight;
            var size = (extrude) ? positions.length / 3 * 2 : positions.length / 3;

            var finalPositions = new Float64Array(size * 3);

            var length = positions.length;
            var bottomOffset = (extrude) ? length : 0;
            for (var i = 0; i < length; i += 3) {
                var i1 = i + 1;
                var i2 = i + 2;

                var position = Cartographic.Cartesian3.fromArray(positions, i, scratchCartesian1);
                ellipsoid.scaleToGeodeticSurface(position, position);

                var extrudedPosition = Cartographic.Cartesian3.clone(position, scratchCartesian2);
                var normal = ellipsoid.geodeticSurfaceNormal(position, scratchNormal);
                var scaledNormal = Cartographic.Cartesian3.multiplyByScalar(normal, height, scratchCartesian3);
                Cartographic.Cartesian3.add(position, scaledNormal, position);

                if (extrude) {
                    Cartographic.Cartesian3.multiplyByScalar(normal, extrudedHeight, scaledNormal);
                    Cartographic.Cartesian3.add(extrudedPosition, scaledNormal, extrudedPosition);

                    finalPositions[i + bottomOffset] = extrudedPosition.x;
                    finalPositions[i1 + bottomOffset] = extrudedPosition.y;
                    finalPositions[i2 + bottomOffset] = extrudedPosition.z;
                }

                finalPositions[i] = position.x;
                finalPositions[i1] = position.y;
                finalPositions[i2] = position.z;
            }

            return finalPositions;
        };

        var unitPosScratch = new Cartographic.Cartesian3();
        var eastVecScratch = new Cartographic.Cartesian3();
        var northVecScratch = new Cartographic.Cartesian3();
        /**
         * Returns an array of positions that make up the ellipse.
         * @private
         */
        EllipseGeometryLibrary.computeEllipsePositions = function(options, addFillPositions, addEdgePositions) {
            var semiMinorAxis = options.semiMinorAxis;
            var semiMajorAxis = options.semiMajorAxis;
            var rotation = options.rotation;
            var center = options.center;

            // Computing the arc-length of the ellipse is too expensive to be practical. Estimating it using the
            // arc length of the sphere is too inaccurate and creates sharp edges when either the semi-major or
            // semi-minor axis is much bigger than the other. Instead, scale the angle delta to make
            // the distance along the ellipse boundary more closely match the granularity.
            var granularity = options.granularity * 8.0;

            var aSqr = semiMinorAxis * semiMinorAxis;
            var bSqr = semiMajorAxis * semiMajorAxis;
            var ab = semiMajorAxis * semiMinorAxis;

            var mag = Cartographic.Cartesian3.magnitude(center);

            var unitPos = Cartographic.Cartesian3.normalize(center, unitPosScratch);
            var eastVec = Cartographic.Cartesian3.cross(Cartographic.Cartesian3.UNIT_Z, center, eastVecScratch);
            eastVec = Cartographic.Cartesian3.normalize(eastVec, eastVec);
            var northVec = Cartographic.Cartesian3.cross(unitPos, eastVec, northVecScratch);

            // The number of points in the first quadrant
            var numPts = 1 + Math.ceil(_Math.CesiumMath.PI_OVER_TWO / granularity);

            var deltaTheta = _Math.CesiumMath.PI_OVER_TWO / (numPts - 1);
            var theta = _Math.CesiumMath.PI_OVER_TWO - numPts * deltaTheta;
            if (theta < 0.0) {
                numPts -= Math.ceil(Math.abs(theta) / deltaTheta);
            }

            // If the number of points were three, the ellipse
            // would be tessellated like below:
            //
            //         *---*
            //       / | \ | \
            //     *---*---*---*
            //   / | \ | \ | \ | \
            //  / .*---*---*---*. \
            // * ` | \ | \ | \ | `*
            //  \`.*---*---*---*.`/
            //   \ | \ | \ | \ | /
            //     *---*---*---*
            //       \ | \ | /
            //         *---*
            // The first and last column have one position and fan to connect to the adjacent column.
            // Each other vertical column contains an even number of positions.
            var size = 2 * (numPts * (numPts + 2));
            var positions = (addFillPositions) ? new Array(size * 3) : undefined;
            var positionIndex = 0;
            var position = scratchCartesian1;
            var reflectedPosition = scratchCartesian2;

            var outerPositionsLength = (numPts * 4) * 3;
            var outerRightIndex = outerPositionsLength - 1;
            var outerLeftIndex = 0;
            var outerPositions = (addEdgePositions) ? new Array(outerPositionsLength) : undefined;

            var i;
            var j;
            var numInterior;
            var t;
            var interiorPosition;

            // Compute points in the 'eastern' half of the ellipse
            theta = _Math.CesiumMath.PI_OVER_TWO;
            position = pointOnEllipsoid(theta, rotation, northVec, eastVec, aSqr, ab, bSqr, mag, unitPos, position);
            if (addFillPositions) {
                positions[positionIndex++] = position.x;
                positions[positionIndex++] = position.y;
                positions[positionIndex++] = position.z;
            }
            if (addEdgePositions) {
                outerPositions[outerRightIndex--] = position.z;
                outerPositions[outerRightIndex--] = position.y;
                outerPositions[outerRightIndex--] = position.x;
            }
            theta = _Math.CesiumMath.PI_OVER_TWO -  deltaTheta;
            for (i = 1; i < numPts + 1; ++i) {
                position = pointOnEllipsoid(theta, rotation, northVec, eastVec, aSqr, ab, bSqr, mag, unitPos, position);
                reflectedPosition = pointOnEllipsoid(Math.PI - theta, rotation, northVec, eastVec, aSqr, ab, bSqr, mag, unitPos, reflectedPosition);

                if (addFillPositions) {
                    positions[positionIndex++] = position.x;
                    positions[positionIndex++] = position.y;
                    positions[positionIndex++] = position.z;

                    numInterior = 2 * i + 2;
                    for (j = 1; j < numInterior - 1; ++j) {
                        t = j / (numInterior - 1);
                        interiorPosition = Cartographic.Cartesian3.lerp(position, reflectedPosition, t, scratchCartesian3);
                        positions[positionIndex++] = interiorPosition.x;
                        positions[positionIndex++] = interiorPosition.y;
                        positions[positionIndex++] = interiorPosition.z;
                    }

                    positions[positionIndex++] = reflectedPosition.x;
                    positions[positionIndex++] = reflectedPosition.y;
                    positions[positionIndex++] = reflectedPosition.z;
                }

                if (addEdgePositions) {
                    outerPositions[outerRightIndex--] = position.z;
                    outerPositions[outerRightIndex--] = position.y;
                    outerPositions[outerRightIndex--] = position.x;
                    outerPositions[outerLeftIndex++] = reflectedPosition.x;
                    outerPositions[outerLeftIndex++] = reflectedPosition.y;
                    outerPositions[outerLeftIndex++] = reflectedPosition.z;
                }

                theta = _Math.CesiumMath.PI_OVER_TWO - (i + 1) * deltaTheta;
            }

            // Compute points in the 'western' half of the ellipse
            for (i = numPts; i > 1; --i) {
                theta = _Math.CesiumMath.PI_OVER_TWO - (i - 1) * deltaTheta;

                position = pointOnEllipsoid(-theta, rotation, northVec, eastVec, aSqr, ab, bSqr, mag, unitPos, position);
                reflectedPosition = pointOnEllipsoid(theta + Math.PI, rotation, northVec, eastVec, aSqr, ab, bSqr, mag, unitPos, reflectedPosition);

                if (addFillPositions) {
                    positions[positionIndex++] = position.x;
                    positions[positionIndex++] = position.y;
                    positions[positionIndex++] = position.z;

                    numInterior = 2 * (i - 1) + 2;
                    for (j = 1; j < numInterior - 1; ++j) {
                        t = j / (numInterior - 1);
                        interiorPosition = Cartographic.Cartesian3.lerp(position, reflectedPosition, t, scratchCartesian3);
                        positions[positionIndex++] = interiorPosition.x;
                        positions[positionIndex++] = interiorPosition.y;
                        positions[positionIndex++] = interiorPosition.z;
                    }

                    positions[positionIndex++] = reflectedPosition.x;
                    positions[positionIndex++] = reflectedPosition.y;
                    positions[positionIndex++] = reflectedPosition.z;
                }

                if (addEdgePositions) {
                    outerPositions[outerRightIndex--] = position.z;
                    outerPositions[outerRightIndex--] = position.y;
                    outerPositions[outerRightIndex--] = position.x;
                    outerPositions[outerLeftIndex++] = reflectedPosition.x;
                    outerPositions[outerLeftIndex++] = reflectedPosition.y;
                    outerPositions[outerLeftIndex++] = reflectedPosition.z;
                }
            }

            theta = _Math.CesiumMath.PI_OVER_TWO;
            position = pointOnEllipsoid(-theta, rotation, northVec, eastVec, aSqr, ab, bSqr, mag, unitPos, position);

            var r = {};
            if (addFillPositions) {
                positions[positionIndex++] = position.x;
                positions[positionIndex++] = position.y;
                positions[positionIndex++] = position.z;
                r.positions = positions;
                r.numPts = numPts;
            }
            if (addEdgePositions) {
                outerPositions[outerRightIndex--] = position.z;
                outerPositions[outerRightIndex--] = position.y;
                outerPositions[outerRightIndex--] = position.x;
                r.outerPositions = outerPositions;
            }

            return r;
        };

    exports.EllipseGeometryLibrary = EllipseGeometryLibrary;

});

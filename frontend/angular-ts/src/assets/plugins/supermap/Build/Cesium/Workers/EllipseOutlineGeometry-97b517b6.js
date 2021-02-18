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
define(['exports', './when-8d13db60', './Check-70bec281', './Math-61ede240', './Cartographic-fe4be337', './Cartesian2-85064f09', './BoundingSphere-775c5788', './ComponentDatatype-5862616f', './GeometryAttribute-06d31d45', './PrimitiveType-97893bc7', './GeometryAttributes-aacecde6', './IndexDatatype-9435b55f', './GeometryOffsetAttribute-ca302482', './EllipseGeometryLibrary-3558b757'], function (exports, when, Check, _Math, Cartographic, Cartesian2, BoundingSphere, ComponentDatatype, GeometryAttribute, PrimitiveType, GeometryAttributes, IndexDatatype, GeometryOffsetAttribute, EllipseGeometryLibrary) { 'use strict';

    var scratchCartesian1 = new Cartographic.Cartesian3();
        var boundingSphereCenter = new Cartographic.Cartesian3();

        function computeEllipse(options) {
            var center = options.center;
            boundingSphereCenter = Cartographic.Cartesian3.multiplyByScalar(options.ellipsoid.geodeticSurfaceNormal(center, boundingSphereCenter), options.height, boundingSphereCenter);
            boundingSphereCenter = Cartographic.Cartesian3.add(center, boundingSphereCenter, boundingSphereCenter);
            var boundingSphere = new BoundingSphere.BoundingSphere(boundingSphereCenter, options.semiMajorAxis);
            var positions = EllipseGeometryLibrary.EllipseGeometryLibrary.computeEllipsePositions(options, false, true).outerPositions;

            var attributes = new GeometryAttributes.GeometryAttributes({
                position: new GeometryAttribute.GeometryAttribute({
                    componentDatatype : ComponentDatatype.ComponentDatatype.DOUBLE,
                    componentsPerAttribute : 3,
                    values : EllipseGeometryLibrary.EllipseGeometryLibrary.raisePositionsToHeight(positions, options, false)
                })
            });

            var length = positions.length / 3;
            var indices = IndexDatatype.IndexDatatype.createTypedArray(length, length * 2);
            var index = 0;
            for ( var i = 0; i < length; ++i) {
                indices[index++] = i;
                indices[index++] = (i + 1) % length;
            }

            return {
                boundingSphere : boundingSphere,
                attributes : attributes,
                indices : indices
            };
        }

        var topBoundingSphere = new BoundingSphere.BoundingSphere();
        var bottomBoundingSphere = new BoundingSphere.BoundingSphere();
        function computeExtrudedEllipse(options) {
            var center = options.center;
            var ellipsoid = options.ellipsoid;
            var semiMajorAxis = options.semiMajorAxis;
            var scaledNormal = Cartographic.Cartesian3.multiplyByScalar(ellipsoid.geodeticSurfaceNormal(center, scratchCartesian1), options.height, scratchCartesian1);
            topBoundingSphere.center = Cartographic.Cartesian3.add(center, scaledNormal, topBoundingSphere.center);
            topBoundingSphere.radius = semiMajorAxis;

            scaledNormal = Cartographic.Cartesian3.multiplyByScalar(ellipsoid.geodeticSurfaceNormal(center, scaledNormal), options.extrudedHeight, scaledNormal);
            bottomBoundingSphere.center = Cartographic.Cartesian3.add(center, scaledNormal, bottomBoundingSphere.center);
            bottomBoundingSphere.radius = semiMajorAxis;

            var positions = EllipseGeometryLibrary.EllipseGeometryLibrary.computeEllipsePositions(options, false, true).outerPositions;
            var attributes = new GeometryAttributes.GeometryAttributes({
                position: new GeometryAttribute.GeometryAttribute({
                    componentDatatype : ComponentDatatype.ComponentDatatype.DOUBLE,
                    componentsPerAttribute : 3,
                    values : EllipseGeometryLibrary.EllipseGeometryLibrary.raisePositionsToHeight(positions, options, true)
                })
            });

            positions = attributes.position.values;
            var boundingSphere = BoundingSphere.BoundingSphere.union(topBoundingSphere, bottomBoundingSphere);
            var length = positions.length/3;

            if (when.defined(options.offsetAttribute)) {
                var applyOffset = new Uint8Array(length);
                if (options.offsetAttribute === GeometryOffsetAttribute.GeometryOffsetAttribute.TOP) {
                    applyOffset = GeometryOffsetAttribute.arrayFill(applyOffset, 1, 0, length / 2);
                } else {
                    var offsetValue = options.offsetAttribute === GeometryOffsetAttribute.GeometryOffsetAttribute.NONE ? 0 : 1;
                    applyOffset = GeometryOffsetAttribute.arrayFill(applyOffset, offsetValue);
                }

                attributes.applyOffset = new GeometryAttribute.GeometryAttribute({
                    componentDatatype : ComponentDatatype.ComponentDatatype.UNSIGNED_BYTE,
                    componentsPerAttribute : 1,
                    values: applyOffset
                });
            }

            var numberOfVerticalLines = when.defaultValue(options.numberOfVerticalLines, 16);
            numberOfVerticalLines = _Math.CesiumMath.clamp(numberOfVerticalLines, 0, length/2);

            var indices = IndexDatatype.IndexDatatype.createTypedArray(length, length * 2 + numberOfVerticalLines * 2);

            length /= 2;
            var index = 0;
            var i;
            for (i = 0; i < length; ++i) {
                indices[index++] = i;
                indices[index++] = (i + 1) % length;
                indices[index++] = i + length;
                indices[index++] = ((i + 1) % length) + length;
            }

            var numSide;
            if (numberOfVerticalLines > 0) {
                var numSideLines = Math.min(numberOfVerticalLines, length);
                numSide = Math.round(length / numSideLines);

                var maxI = Math.min(numSide * numberOfVerticalLines, length);
                for (i = 0; i < maxI; i += numSide) {
                    indices[index++] = i;
                    indices[index++] = i + length;
                }
            }

            return {
                boundingSphere : boundingSphere,
                attributes : attributes,
                indices : indices
            };
        }

        /**
         * A description of the outline of an ellipse on an ellipsoid.
         *
         * @alias EllipseOutlineGeometry
         * @constructor
         *
         * @param {Object} options Object with the following properties:
         * @param {Cartesian3} options.center The ellipse's center point in the fixed frame.
         * @param {Number} options.semiMajorAxis The length of the ellipse's semi-major axis in meters.
         * @param {Number} options.semiMinorAxis The length of the ellipse's semi-minor axis in meters.
         * @param {Ellipsoid} [options.ellipsoid=Ellipsoid.WGS84] The ellipsoid the ellipse will be on.
         * @param {Number} [options.height=0.0] The distance in meters between the ellipse and the ellipsoid surface.
         * @param {Number} [options.extrudedHeight] The distance in meters between the ellipse's extruded face and the ellipsoid surface.
         * @param {Number} [options.rotation=0.0] The angle from north (counter-clockwise) in radians.
         * @param {Number} [options.granularity=0.02] The angular distance between points on the ellipse in radians.
         * @param {Number} [options.numberOfVerticalLines=16] Number of lines to draw between the top and bottom surface of an extruded ellipse.
         *
         * @exception {DeveloperError} semiMajorAxis and semiMinorAxis must be greater than zero.
         * @exception {DeveloperError} semiMajorAxis must be greater than or equal to the semiMinorAxis.
         * @exception {DeveloperError} granularity must be greater than zero.
         *
         * @see EllipseOutlineGeometry.createGeometry
         *
         * @example
         * var ellipse = new Cesium.EllipseOutlineGeometry({
         *   center : Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
         *   semiMajorAxis : 500000.0,
         *   semiMinorAxis : 300000.0,
         *   rotation : Cesium.Math.toRadians(60.0)
         * });
         * var geometry = Cesium.EllipseOutlineGeometry.createGeometry(ellipse);
         */
        function EllipseOutlineGeometry(options) {
            options = when.defaultValue(options, when.defaultValue.EMPTY_OBJECT);

            var center = options.center;
            var ellipsoid = when.defaultValue(options.ellipsoid, Cartesian2.Ellipsoid.WGS84);
            var semiMajorAxis = options.semiMajorAxis;
            var semiMinorAxis = options.semiMinorAxis;
            var granularity = when.defaultValue(options.granularity, _Math.CesiumMath.RADIANS_PER_DEGREE);

            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(center)) {
                throw new Check.DeveloperError('center is required.');
            }
            if (!when.defined(semiMajorAxis)) {
                throw new Check.DeveloperError('semiMajorAxis is required.');
            }
            if (!when.defined(semiMinorAxis)) {
                throw new Check.DeveloperError('semiMinorAxis is required.');
            }
            if (semiMajorAxis < semiMinorAxis) {
                throw new Check.DeveloperError('semiMajorAxis must be greater than or equal to the semiMinorAxis.');
            }
            if (granularity <= 0.0) {
                throw new Check.DeveloperError('granularity must be greater than zero.');
            }
            //>>includeEnd('debug');

            var height = when.defaultValue(options.height, 0.0);
            var extrudedHeight = when.defaultValue(options.extrudedHeight, height);

            this._center = Cartographic.Cartesian3.clone(center);
            this._semiMajorAxis = semiMajorAxis;
            this._semiMinorAxis = semiMinorAxis;
            this._ellipsoid = Cartesian2.Ellipsoid.clone(ellipsoid);
            this._rotation = when.defaultValue(options.rotation, 0.0);
            this._height = Math.max(extrudedHeight, height);
            this._granularity = granularity;
            this._extrudedHeight = Math.min(extrudedHeight, height);
            this._numberOfVerticalLines = Math.max(when.defaultValue(options.numberOfVerticalLines, 16), 0);
            this._offsetAttribute = options.offsetAttribute;
            this._workerName = 'createEllipseOutlineGeometry';
        }

        /**
         * The number of elements used to pack the object into an array.
         * @type {Number}
         */
        EllipseOutlineGeometry.packedLength = Cartographic.Cartesian3.packedLength + Cartesian2.Ellipsoid.packedLength + 8;

        /**
         * Stores the provided instance into the provided array.
         *
         * @param {EllipseOutlineGeometry} value The value to pack.
         * @param {Number[]} array The array to pack into.
         * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
         *
         * @returns {Number[]} The array that was packed into
         */
        EllipseOutlineGeometry.pack = function(value, array, startingIndex) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(value)) {
                throw new Check.DeveloperError('value is required');
            }
            if (!when.defined(array)) {
                throw new Check.DeveloperError('array is required');
            }
            //>>includeEnd('debug');

            startingIndex = when.defaultValue(startingIndex, 0);

            Cartographic.Cartesian3.pack(value._center, array, startingIndex);
            startingIndex += Cartographic.Cartesian3.packedLength;

            Cartesian2.Ellipsoid.pack(value._ellipsoid, array, startingIndex);
            startingIndex += Cartesian2.Ellipsoid.packedLength;

            array[startingIndex++] = value._semiMajorAxis;
            array[startingIndex++] = value._semiMinorAxis;
            array[startingIndex++] = value._rotation;
            array[startingIndex++] = value._height;
            array[startingIndex++] = value._granularity;
            array[startingIndex++] = value._extrudedHeight;
            array[startingIndex++]   = value._numberOfVerticalLines;
            array[startingIndex] = when.defaultValue(value._offsetAttribute, -1);

            return array;
        };

        var scratchCenter = new Cartographic.Cartesian3();
        var scratchEllipsoid = new Cartesian2.Ellipsoid();
        var scratchOptions = {
            center : scratchCenter,
            ellipsoid : scratchEllipsoid,
            semiMajorAxis : undefined,
            semiMinorAxis : undefined,
            rotation : undefined,
            height : undefined,
            granularity : undefined,
            extrudedHeight : undefined,
            numberOfVerticalLines : undefined,
            offsetAttribute: undefined
        };

        /**
         * Retrieves an instance from a packed array.
         *
         * @param {Number[]} array The packed array.
         * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
         * @param {EllipseOutlineGeometry} [result] The object into which to store the result.
         * @returns {EllipseOutlineGeometry} The modified result parameter or a new EllipseOutlineGeometry instance if one was not provided.
         */
        EllipseOutlineGeometry.unpack = function(array, startingIndex, result) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(array)) {
                throw new Check.DeveloperError('array is required');
            }
            //>>includeEnd('debug');

            startingIndex = when.defaultValue(startingIndex, 0);

            var center = Cartographic.Cartesian3.unpack(array, startingIndex, scratchCenter);
            startingIndex += Cartographic.Cartesian3.packedLength;

            var ellipsoid = Cartesian2.Ellipsoid.unpack(array, startingIndex, scratchEllipsoid);
            startingIndex += Cartesian2.Ellipsoid.packedLength;

            var semiMajorAxis = array[startingIndex++];
            var semiMinorAxis = array[startingIndex++];
            var rotation = array[startingIndex++];
            var height = array[startingIndex++];
            var granularity = array[startingIndex++];
            var extrudedHeight = array[startingIndex++];
            var numberOfVerticalLines = array[startingIndex++];
            var offsetAttribute = array[startingIndex];

            if (!when.defined(result)) {
                scratchOptions.height = height;
                scratchOptions.extrudedHeight = extrudedHeight;
                scratchOptions.granularity = granularity;
                scratchOptions.rotation = rotation;
                scratchOptions.semiMajorAxis = semiMajorAxis;
                scratchOptions.semiMinorAxis = semiMinorAxis;
                scratchOptions.numberOfVerticalLines = numberOfVerticalLines;
                scratchOptions.offsetAttribute = offsetAttribute === -1 ? undefined : offsetAttribute;

                return new EllipseOutlineGeometry(scratchOptions);
            }

            result._center = Cartographic.Cartesian3.clone(center, result._center);
            result._ellipsoid = Cartesian2.Ellipsoid.clone(ellipsoid, result._ellipsoid);
            result._semiMajorAxis = semiMajorAxis;
            result._semiMinorAxis = semiMinorAxis;
            result._rotation = rotation;
            result._height = height;
            result._granularity = granularity;
            result._extrudedHeight = extrudedHeight;
            result._numberOfVerticalLines = numberOfVerticalLines;
            result._offsetAttribute = offsetAttribute === -1 ? undefined : offsetAttribute;

            return result;
        };

        /**
         * Computes the geometric representation of an outline of an ellipse on an ellipsoid, including its vertices, indices, and a bounding sphere.
         *
         * @param {EllipseOutlineGeometry} ellipseGeometry A description of the ellipse.
         * @returns {Geometry|undefined} The computed vertices and indices.
         */
        EllipseOutlineGeometry.createGeometry = function(ellipseGeometry) {
            if ((ellipseGeometry._semiMajorAxis <= 0.0) || (ellipseGeometry._semiMinorAxis <= 0.0)) {
                return;
            }

            var height = ellipseGeometry._height;
            var extrudedHeight = ellipseGeometry._extrudedHeight;
            var extrude = !_Math.CesiumMath.equalsEpsilon(height, extrudedHeight, 0, _Math.CesiumMath.EPSILON2);

            ellipseGeometry._center = ellipseGeometry._ellipsoid.scaleToGeodeticSurface(ellipseGeometry._center, ellipseGeometry._center);
            var options = {
                center : ellipseGeometry._center,
                semiMajorAxis : ellipseGeometry._semiMajorAxis,
                semiMinorAxis : ellipseGeometry._semiMinorAxis,
                ellipsoid : ellipseGeometry._ellipsoid,
                rotation : ellipseGeometry._rotation,
                height : height,
                granularity : ellipseGeometry._granularity,
                numberOfVerticalLines : ellipseGeometry._numberOfVerticalLines
            };
            var geometry;
            if (extrude) {
                options.extrudedHeight = extrudedHeight;
                options.offsetAttribute = ellipseGeometry._offsetAttribute;
                geometry = computeExtrudedEllipse(options);
            } else {
                geometry = computeEllipse(options);

                if (when.defined(ellipseGeometry._offsetAttribute)) {
                    var length = geometry.attributes.position.values.length;
                    var applyOffset = new Uint8Array(length / 3);
                    var offsetValue = ellipseGeometry._offsetAttribute === GeometryOffsetAttribute.GeometryOffsetAttribute.NONE ? 0 : 1;
                    GeometryOffsetAttribute.arrayFill(applyOffset, offsetValue);
                    geometry.attributes.applyOffset = new GeometryAttribute.GeometryAttribute({
                        componentDatatype : ComponentDatatype.ComponentDatatype.UNSIGNED_BYTE,
                        componentsPerAttribute : 1,
                        values: applyOffset
                    });
                }
            }

            return new GeometryAttribute.Geometry({
                attributes : geometry.attributes,
                indices : geometry.indices,
                primitiveType : PrimitiveType.PrimitiveType.LINES,
                boundingSphere : geometry.boundingSphere,
                offsetAttribute : ellipseGeometry._offsetAttribute
            });
        };

    exports.EllipseOutlineGeometry = EllipseOutlineGeometry;

});

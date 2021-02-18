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
define(['exports', './when-8d13db60', './Check-70bec281', './Math-61ede240', './Cartographic-fe4be337', './Cartesian2-85064f09', './BoundingSphere-775c5788', './ComponentDatatype-5862616f', './GeometryAttribute-06d31d45', './PrimitiveType-97893bc7', './GeometryAttributes-aacecde6', './IndexDatatype-9435b55f', './GeometryOffsetAttribute-ca302482'], function (exports, when, Check, _Math, Cartographic, Cartesian2, BoundingSphere, ComponentDatatype, GeometryAttribute, PrimitiveType, GeometryAttributes, IndexDatatype, GeometryOffsetAttribute) { 'use strict';

    var defaultRadii = new Cartographic.Cartesian3(1.0, 1.0, 1.0);
        var cos = Math.cos;
        var sin = Math.sin;

        /**
         * A description of the outline of an ellipsoid centered at the origin.
         *
         * @alias EllipsoidOutlineGeometry
         * @constructor
         *
         * @param {Object} [options] Object with the following properties:
         * @param {Cartesian3} [options.radii=Cartesian3(1.0, 1.0, 1.0)] The radii of the ellipsoid in the x, y, and z directions.
         * @param {Cartesian3} [options.innerRadii=options.radii] The inner radii of the ellipsoid in the x, y, and z directions.
         * @param {Number} [options.minimumClock=0.0] The minimum angle lying in the xy-plane measured from the positive x-axis and toward the positive y-axis.
         * @param {Number} [options.maximumClock=2*PI] The maximum angle lying in the xy-plane measured from the positive x-axis and toward the positive y-axis.
         * @param {Number} [options.minimumCone=0.0] The minimum angle measured from the positive z-axis and toward the negative z-axis.
         * @param {Number} [options.maximumCone=PI] The maximum angle measured from the positive z-axis and toward the negative z-axis.
         * @param {Number} [options.stackPartitions=10] The count of stacks for the ellipsoid (1 greater than the number of parallel lines).
         * @param {Number} [options.slicePartitions=8] The count of slices for the ellipsoid (Equal to the number of radial lines).
         * @param {Number} [options.subdivisions=128] The number of points per line, determining the granularity of the curvature.
         *
         * @exception {DeveloperError} options.stackPartitions must be greater than or equal to one.
         * @exception {DeveloperError} options.slicePartitions must be greater than or equal to zero.
         * @exception {DeveloperError} options.subdivisions must be greater than or equal to zero.
         *
         * @example
         * var ellipsoid = new Cesium.EllipsoidOutlineGeometry({
         *   radii : new Cesium.Cartesian3(1000000.0, 500000.0, 500000.0),
         *   stackPartitions: 6,
         *   slicePartitions: 5
         * });
         * var geometry = Cesium.EllipsoidOutlineGeometry.createGeometry(ellipsoid);
         */
        function EllipsoidOutlineGeometry(options) {
            options = when.defaultValue(options, when.defaultValue.EMPTY_OBJECT);

            var radii = when.defaultValue(options.radii, defaultRadii);
            var innerRadii = when.defaultValue(options.innerRadii, radii);
            var minimumClock = when.defaultValue(options.minimumClock, 0.0);
            var maximumClock = when.defaultValue(options.maximumClock, _Math.CesiumMath.TWO_PI);
            var minimumCone = when.defaultValue(options.minimumCone, 0.0);
            var maximumCone = when.defaultValue(options.maximumCone, _Math.CesiumMath.PI);
            var stackPartitions = Math.round(when.defaultValue(options.stackPartitions, 10));
            var slicePartitions = Math.round(when.defaultValue(options.slicePartitions, 8));
            var subdivisions = Math.round(when.defaultValue(options.subdivisions, 128));

            //>>includeStart('debug', pragmas.debug);
            if (stackPartitions < 1) {
                throw new Check.DeveloperError('options.stackPartitions cannot be less than 1');
            }
            if (slicePartitions < 0) {
                throw new Check.DeveloperError('options.slicePartitions cannot be less than 0');
            }
            if (subdivisions < 0) {
                throw new Check.DeveloperError('options.subdivisions must be greater than or equal to zero.');
            }
            if (when.defined(options.offsetAttribute) && options.offsetAttribute === GeometryOffsetAttribute.GeometryOffsetAttribute.TOP) {
                throw new Check.DeveloperError('GeometryOffsetAttribute.TOP is not a supported options.offsetAttribute for this geometry.');
            }
            //>>includeEnd('debug');

            this._radii = Cartographic.Cartesian3.clone(radii);
            this._innerRadii = Cartographic.Cartesian3.clone(innerRadii);
            this._minimumClock = minimumClock;
            this._maximumClock = maximumClock;
            this._minimumCone = minimumCone;
            this._maximumCone = maximumCone;
            this._stackPartitions = stackPartitions;
            this._slicePartitions = slicePartitions;
            this._subdivisions = subdivisions;
            this._offsetAttribute = options.offsetAttribute;
            this._workerName = 'createEllipsoidOutlineGeometry';
        }

        /**
         * The number of elements used to pack the object into an array.
         * @type {Number}
         */
        EllipsoidOutlineGeometry.packedLength = 2 * (Cartographic.Cartesian3.packedLength) + 8;

        /**
         * Stores the provided instance into the provided array.
         *
         * @param {EllipsoidOutlineGeometry} value The value to pack.
         * @param {Number[]} array The array to pack into.
         * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
         *
         * @returns {Number[]} The array that was packed into
         */
        EllipsoidOutlineGeometry.pack = function(value, array, startingIndex) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(value)) {
                throw new Check.DeveloperError('value is required');
            }
            if (!when.defined(array)) {
                throw new Check.DeveloperError('array is required');
            }
            //>>includeEnd('debug');

            startingIndex = when.defaultValue(startingIndex, 0);

            Cartographic.Cartesian3.pack(value._radii, array, startingIndex);
            startingIndex += Cartographic.Cartesian3.packedLength;

            Cartographic.Cartesian3.pack(value._innerRadii, array, startingIndex);
            startingIndex += Cartographic.Cartesian3.packedLength;

            array[startingIndex++] = value._minimumClock;
            array[startingIndex++] = value._maximumClock;
            array[startingIndex++] = value._minimumCone;
            array[startingIndex++] = value._maximumCone;
            array[startingIndex++] = value._stackPartitions;
            array[startingIndex++] = value._slicePartitions;
            array[startingIndex++] = value._subdivisions;
            array[startingIndex] = when.defaultValue(value._offsetAttribute, -1);

            return array;
        };

        var scratchRadii = new Cartographic.Cartesian3();
        var scratchInnerRadii = new Cartographic.Cartesian3();
        var scratchOptions = {
            radii : scratchRadii,
            innerRadii : scratchInnerRadii,
            minimumClock : undefined,
            maximumClock : undefined,
            minimumCone : undefined,
            maximumCone : undefined,
            stackPartitions : undefined,
            slicePartitions : undefined,
            subdivisions : undefined,
            offsetAttribute : undefined
        };

        /**
         * Retrieves an instance from a packed array.
         *
         * @param {Number[]} array The packed array.
         * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
         * @param {EllipsoidOutlineGeometry} [result] The object into which to store the result.
         * @returns {EllipsoidOutlineGeometry} The modified result parameter or a new EllipsoidOutlineGeometry instance if one was not provided.
         */
        EllipsoidOutlineGeometry.unpack = function(array, startingIndex, result) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(array)) {
                throw new Check.DeveloperError('array is required');
            }
            //>>includeEnd('debug');

            startingIndex = when.defaultValue(startingIndex, 0);

            var radii = Cartographic.Cartesian3.unpack(array, startingIndex, scratchRadii);
            startingIndex += Cartographic.Cartesian3.packedLength;

            var innerRadii = Cartographic.Cartesian3.unpack(array, startingIndex, scratchInnerRadii);
            startingIndex += Cartographic.Cartesian3.packedLength;

            var minimumClock = array[startingIndex++];
            var maximumClock = array[startingIndex++];
            var minimumCone = array[startingIndex++];
            var maximumCone = array[startingIndex++];
            var stackPartitions = array[startingIndex++];
            var slicePartitions = array[startingIndex++];
            var subdivisions = array[startingIndex++];
            var offsetAttribute = array[startingIndex];

            if (!when.defined(result)) {
                scratchOptions.minimumClock = minimumClock;
                scratchOptions.maximumClock = maximumClock;
                scratchOptions.minimumCone = minimumCone;
                scratchOptions.maximumCone = maximumCone;
                scratchOptions.stackPartitions = stackPartitions;
                scratchOptions.slicePartitions = slicePartitions;
                scratchOptions.subdivisions = subdivisions;
                scratchOptions.offsetAttribute = offsetAttribute === -1 ? undefined : offsetAttribute;
                return new EllipsoidOutlineGeometry(scratchOptions);
            }

            result._radii = Cartographic.Cartesian3.clone(radii, result._radii);
            result._innerRadii = Cartographic.Cartesian3.clone(innerRadii, result._innerRadii);
            result._minimumClock = minimumClock;
            result._maximumClock = maximumClock;
            result._minimumCone = minimumCone;
            result._maximumCone = maximumCone;
            result._stackPartitions = stackPartitions;
            result._slicePartitions = slicePartitions;
            result._subdivisions = subdivisions;
            result._offsetAttribute = offsetAttribute === -1 ? undefined : offsetAttribute;

            return result;
        };

        /**
         * Computes the geometric representation of an outline of an ellipsoid, including its vertices, indices, and a bounding sphere.
         *
         * @param {EllipsoidOutlineGeometry} ellipsoidGeometry A description of the ellipsoid outline.
         * @returns {Geometry|undefined} The computed vertices and indices.
         */
        EllipsoidOutlineGeometry.createGeometry = function(ellipsoidGeometry) {
            var radii = ellipsoidGeometry._radii;
            if ((radii.x <= 0) || (radii.y <= 0) || (radii.z <= 0)) {
                return;
            }

            var innerRadii = ellipsoidGeometry._innerRadii;
            if ((innerRadii.x <= 0) || (innerRadii.y <= 0) || (innerRadii.z <= 0)) {
                return;
            }

            var minimumClock = ellipsoidGeometry._minimumClock;
            var maximumClock = ellipsoidGeometry._maximumClock;
            var minimumCone = ellipsoidGeometry._minimumCone;
            var maximumCone = ellipsoidGeometry._maximumCone;
            var subdivisions = ellipsoidGeometry._subdivisions;
            var ellipsoid = Cartesian2.Ellipsoid.fromCartesian3(radii);

            // Add an extra slice and stack to remain consistent with EllipsoidGeometry
            var slicePartitions = ellipsoidGeometry._slicePartitions + 1;
            var stackPartitions = ellipsoidGeometry._stackPartitions + 1;

            slicePartitions = Math.round(slicePartitions * Math.abs(maximumClock - minimumClock) / _Math.CesiumMath.TWO_PI);
            stackPartitions = Math.round(stackPartitions * Math.abs(maximumCone - minimumCone) / _Math.CesiumMath.PI);

            if (slicePartitions < 2) {
                slicePartitions = 2;
            }
            if (stackPartitions < 2) {
                stackPartitions = 2;
            }

            var extraIndices = 0;
            var vertexMultiplier = 1.0;
            var hasInnerSurface = ((innerRadii.x !== radii.x) || (innerRadii.y !== radii.y) || innerRadii.z !== radii.z);
            var isTopOpen = false;
            var isBotOpen = false;
            if (hasInnerSurface) {
                vertexMultiplier = 2.0;
                // Add 2x slicePartitions to connect the top/bottom of the outer to
                // the top/bottom of the inner
                if (minimumCone > 0.0) {
                    isTopOpen = true;
                    extraIndices += slicePartitions;
                }
                if (maximumCone < Math.PI) {
                    isBotOpen = true;
                    extraIndices += slicePartitions;
                }
            }

            var vertexCount = subdivisions * vertexMultiplier * (stackPartitions + slicePartitions);
            var positions = new Float64Array(vertexCount * 3);

            // Multiply by two because two points define each line segment
            var numIndices = 2 * (vertexCount + extraIndices - (slicePartitions + stackPartitions) * vertexMultiplier);
            var indices = IndexDatatype.IndexDatatype.createTypedArray(vertexCount, numIndices);

            var i;
            var j;
            var theta;
            var phi;
            var index = 0;

            // Calculate sin/cos phi
            var sinPhi = new Array(stackPartitions);
            var cosPhi = new Array(stackPartitions);
            for (i = 0; i < stackPartitions; i++) {
                phi = minimumCone + i * (maximumCone - minimumCone) / (stackPartitions - 1);
                sinPhi[i] = sin(phi);
                cosPhi[i] = cos(phi);
            }

            // Calculate sin/cos theta
            var sinTheta = new Array(subdivisions);
            var cosTheta = new Array(subdivisions);
            for (i = 0; i < subdivisions; i++) {
                theta = minimumClock + i * (maximumClock - minimumClock) / (subdivisions - 1);
                sinTheta[i] = sin(theta);
                cosTheta[i] = cos(theta);
            }

            // Calculate the latitude lines on the outer surface
            for (i = 0; i < stackPartitions; i++) {
                for (j = 0; j < subdivisions; j++) {
                    positions[index++] = radii.x * sinPhi[i] * cosTheta[j];
                    positions[index++] = radii.y * sinPhi[i] * sinTheta[j];
                    positions[index++] = radii.z * cosPhi[i];
                }
            }

            // Calculate the latitude lines on the inner surface
            if (hasInnerSurface) {
                for (i = 0; i < stackPartitions; i++) {
                    for (j = 0; j < subdivisions; j++) {
                        positions[index++] = innerRadii.x * sinPhi[i] * cosTheta[j];
                        positions[index++] = innerRadii.y * sinPhi[i] * sinTheta[j];
                        positions[index++] = innerRadii.z * cosPhi[i];
                    }
                }
            }

            // Calculate sin/cos phi
            sinPhi.length = subdivisions;
            cosPhi.length = subdivisions;
            for (i = 0; i < subdivisions; i++) {
                phi = minimumCone + i * (maximumCone - minimumCone) / (subdivisions - 1);
                sinPhi[i] = sin(phi);
                cosPhi[i] = cos(phi);
            }

            // Calculate sin/cos theta for each slice partition
            sinTheta.length = slicePartitions;
            cosTheta.length = slicePartitions;
            for (i = 0; i < slicePartitions; i++) {
                theta = minimumClock + i * (maximumClock - minimumClock) / (slicePartitions - 1);
                sinTheta[i] = sin(theta);
                cosTheta[i] = cos(theta);
            }

            // Calculate the longitude lines on the outer surface
            for (i = 0; i < subdivisions; i++) {
                for (j = 0; j < slicePartitions; j++) {
                    positions[index++] = radii.x * sinPhi[i] * cosTheta[j];
                    positions[index++] = radii.y * sinPhi[i] * sinTheta[j];
                    positions[index++] = radii.z * cosPhi[i];
                }
            }

            // Calculate the longitude lines on the inner surface
            if (hasInnerSurface) {
                for (i = 0; i < subdivisions; i++) {
                    for (j = 0; j < slicePartitions; j++) {
                        positions[index++] = innerRadii.x * sinPhi[i] * cosTheta[j];
                        positions[index++] = innerRadii.y * sinPhi[i] * sinTheta[j];
                        positions[index++] = innerRadii.z * cosPhi[i];
                    }
                }
            }

            // Create indices for the latitude lines
            index = 0;
            for (i = 0; i < stackPartitions * vertexMultiplier; i++) {
                var topOffset = i * subdivisions;
                for (j = 0; j < subdivisions - 1; j++) {
                    indices[index++] = topOffset + j;
                    indices[index++] = topOffset + j + 1;
                }
            }

            // Create indices for the outer longitude lines
            var offset = stackPartitions * subdivisions * vertexMultiplier;
            for (i = 0; i < slicePartitions; i++) {
                for (j = 0; j < subdivisions - 1; j++) {
                    indices[index++] = offset + i + (j * slicePartitions);
                    indices[index++] = offset + i + (j + 1) * slicePartitions;
                }
            }

            // Create indices for the inner longitude lines
            if (hasInnerSurface) {
                offset = stackPartitions * subdivisions * vertexMultiplier + slicePartitions * subdivisions;
                for (i = 0; i < slicePartitions; i++) {
                    for (j = 0; j < subdivisions - 1; j++) {
                        indices[index++] = offset + i + (j * slicePartitions);
                        indices[index++] = offset + i + (j + 1) * slicePartitions;
                    }
                }
            }

            if (hasInnerSurface) {
                var outerOffset = stackPartitions * subdivisions * vertexMultiplier;
                var innerOffset = outerOffset + (subdivisions * slicePartitions);
                if (isTopOpen) {
                    // Draw lines from the top of the inner surface to the top of the outer surface
                    for (i = 0; i < slicePartitions; i++) {
                        indices[index++] = outerOffset + i;
                        indices[index++] = innerOffset + i;
                    }
                }

                if (isBotOpen) {
                    // Draw lines from the top of the inner surface to the top of the outer surface
                    outerOffset += (subdivisions * slicePartitions) - slicePartitions;
                    innerOffset += (subdivisions * slicePartitions) - slicePartitions;
                    for (i = 0; i < slicePartitions; i++) {
                        indices[index++] = outerOffset + i;
                        indices[index++] = innerOffset + i;
                    }
                }
            }

            var attributes = new GeometryAttributes.GeometryAttributes({
                position : new GeometryAttribute.GeometryAttribute({
                    componentDatatype : ComponentDatatype.ComponentDatatype.DOUBLE,
                    componentsPerAttribute : 3,
                    values : positions
                })
            });

            if (when.defined(ellipsoidGeometry._offsetAttribute)) {
                var length = positions.length;
                var applyOffset = new Uint8Array(length / 3);
                var offsetValue = ellipsoidGeometry._offsetAttribute === GeometryOffsetAttribute.GeometryOffsetAttribute.NONE ? 0 : 1;
                GeometryOffsetAttribute.arrayFill(applyOffset, offsetValue);
                attributes.applyOffset = new GeometryAttribute.GeometryAttribute({
                    componentDatatype : ComponentDatatype.ComponentDatatype.UNSIGNED_BYTE,
                    componentsPerAttribute : 1,
                    values : applyOffset
                });
            }

            return new GeometryAttribute.Geometry({
                attributes : attributes,
                indices : indices,
                primitiveType : PrimitiveType.PrimitiveType.LINES,
                boundingSphere : BoundingSphere.BoundingSphere.fromEllipsoid(ellipsoid),
                offsetAttribute : ellipsoidGeometry._offsetAttribute
            });
        };

    exports.EllipsoidOutlineGeometry = EllipsoidOutlineGeometry;

});

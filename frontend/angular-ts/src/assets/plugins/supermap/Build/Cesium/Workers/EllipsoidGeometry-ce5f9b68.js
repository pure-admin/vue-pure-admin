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
define(['exports', './when-8d13db60', './Check-70bec281', './Math-61ede240', './Cartographic-fe4be337', './Cartesian2-85064f09', './BoundingSphere-775c5788', './ComponentDatatype-5862616f', './GeometryAttribute-06d31d45', './PrimitiveType-97893bc7', './GeometryAttributes-aacecde6', './IndexDatatype-9435b55f', './GeometryOffsetAttribute-ca302482', './VertexFormat-fe4db402'], function (exports, when, Check, _Math, Cartographic, Cartesian2, BoundingSphere, ComponentDatatype, GeometryAttribute, PrimitiveType, GeometryAttributes, IndexDatatype, GeometryOffsetAttribute, VertexFormat) { 'use strict';

    var scratchPosition = new Cartographic.Cartesian3();
        var scratchNormal = new Cartographic.Cartesian3();
        var scratchTangent = new Cartographic.Cartesian3();
        var scratchBitangent = new Cartographic.Cartesian3();
        var scratchNormalST = new Cartographic.Cartesian3();
        var defaultRadii = new Cartographic.Cartesian3(1.0, 1.0, 1.0);

        var cos = Math.cos;
        var sin = Math.sin;

        /**
         * A description of an ellipsoid centered at the origin.
         *
         * @alias EllipsoidGeometry
         * @constructor
         *
         * @param {Object} [options] Object with the following properties:
         * @param {Cartesian3} [options.radii=Cartesian3(1.0, 1.0, 1.0)] The radii of the ellipsoid in the x, y, and z directions.
         * @param {Cartesian3} [options.innerRadii=options.radii] The inner radii of the ellipsoid in the x, y, and z directions.
         * @param {Number} [options.minimumClock=0.0] The minimum angle lying in the xy-plane measured from the positive x-axis and toward the positive y-axis.
         * @param {Number} [options.maximumClock=2*PI] The maximum angle lying in the xy-plane measured from the positive x-axis and toward the positive y-axis.
         * @param {Number} [options.minimumCone=0.0] The minimum angle measured from the positive z-axis and toward the negative z-axis.
         * @param {Number} [options.maximumCone=PI] The maximum angle measured from the positive z-axis and toward the negative z-axis.
         * @param {Number} [options.stackPartitions=64] The number of times to partition the ellipsoid into stacks.
         * @param {Number} [options.slicePartitions=64] The number of times to partition the ellipsoid into radial slices.
         * @param {VertexFormat} [options.vertexFormat=VertexFormat.DEFAULT] The vertex attributes to be computed.
         *
         * @exception {DeveloperError} options.slicePartitions cannot be less than three.
         * @exception {DeveloperError} options.stackPartitions cannot be less than three.
         *
         * @see EllipsoidGeometry#createGeometry
         *
         * @example
         * var ellipsoid = new Cesium.EllipsoidGeometry({
         *   vertexFormat : Cesium.VertexFormat.POSITION_ONLY,
         *   radii : new Cesium.Cartesian3(1000000.0, 500000.0, 500000.0)
         * });
         * var geometry = Cesium.EllipsoidGeometry.createGeometry(ellipsoid);
         */
        function EllipsoidGeometry(options) {
            options = when.defaultValue(options, when.defaultValue.EMPTY_OBJECT);

            var radii = when.defaultValue(options.radii, defaultRadii);
            var innerRadii = when.defaultValue(options.innerRadii, radii);
            var minimumClock = when.defaultValue(options.minimumClock, 0.0);
            var maximumClock = when.defaultValue(options.maximumClock, _Math.CesiumMath.TWO_PI);
            var minimumCone = when.defaultValue(options.minimumCone, 0.0);
            var maximumCone = when.defaultValue(options.maximumCone, _Math.CesiumMath.PI);
            var stackPartitions = Math.round(when.defaultValue(options.stackPartitions, 64));
            var slicePartitions = Math.round(when.defaultValue(options.slicePartitions, 64));
            var vertexFormat = when.defaultValue(options.vertexFormat, VertexFormat.VertexFormat.DEFAULT);

            //>>includeStart('debug', pragmas.debug);
            if (slicePartitions < 3) {
                throw new Check.DeveloperError('options.slicePartitions cannot be less than three.');
            }
            if (stackPartitions < 3) {
                throw new Check.DeveloperError('options.stackPartitions cannot be less than three.');
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
            this._vertexFormat = VertexFormat.VertexFormat.clone(vertexFormat);
            this._offsetAttribute = options.offsetAttribute;
            this._workerName = 'createEllipsoidGeometry';
        }

        /**
         * The number of elements used to pack the object into an array.
         * @type {Number}
         */
        EllipsoidGeometry.packedLength = 2 * (Cartographic.Cartesian3.packedLength) + VertexFormat.VertexFormat.packedLength + 7;

        /**
         * Stores the provided instance into the provided array.
         *
         * @param {EllipsoidGeometry} value The value to pack.
         * @param {Number[]} array The array to pack into.
         * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
         *
         * @returns {Number[]} The array that was packed into
         */
        EllipsoidGeometry.pack = function(value, array, startingIndex) {
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

            VertexFormat.VertexFormat.pack(value._vertexFormat, array, startingIndex);
            startingIndex += VertexFormat.VertexFormat.packedLength;

            array[startingIndex++] = value._minimumClock;
            array[startingIndex++] = value._maximumClock;
            array[startingIndex++] = value._minimumCone;
            array[startingIndex++] = value._maximumCone;
            array[startingIndex++] = value._stackPartitions;
            array[startingIndex++] = value._slicePartitions;
            array[startingIndex] = when.defaultValue(value._offsetAttribute, -1);

            return array;
        };

        var scratchRadii = new Cartographic.Cartesian3();
        var scratchInnerRadii = new Cartographic.Cartesian3();
        var scratchVertexFormat = new VertexFormat.VertexFormat();
        var scratchOptions = {
            radii : scratchRadii,
            innerRadii : scratchInnerRadii,
            vertexFormat : scratchVertexFormat,
            minimumClock : undefined,
            maximumClock : undefined,
            minimumCone : undefined,
            maximumCone : undefined,
            stackPartitions : undefined,
            slicePartitions : undefined,
            offsetAttribute : undefined
        };

        /**
         * Retrieves an instance from a packed array.
         *
         * @param {Number[]} array The packed array.
         * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
         * @param {EllipsoidGeometry} [result] The object into which to store the result.
         * @returns {EllipsoidGeometry} The modified result parameter or a new EllipsoidGeometry instance if one was not provided.
         */
        EllipsoidGeometry.unpack = function(array, startingIndex, result) {
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

            var vertexFormat = VertexFormat.VertexFormat.unpack(array, startingIndex, scratchVertexFormat);
            startingIndex += VertexFormat.VertexFormat.packedLength;

            var minimumClock = array[startingIndex++];
            var maximumClock = array[startingIndex++];
            var minimumCone = array[startingIndex++];
            var maximumCone = array[startingIndex++];
            var stackPartitions = array[startingIndex++];
            var slicePartitions = array[startingIndex++];
            var offsetAttribute = array[startingIndex];

            if (!when.defined(result)) {
                scratchOptions.minimumClock = minimumClock;
                scratchOptions.maximumClock = maximumClock;
                scratchOptions.minimumCone = minimumCone;
                scratchOptions.maximumCone = maximumCone;
                scratchOptions.stackPartitions = stackPartitions;
                scratchOptions.slicePartitions = slicePartitions;
                scratchOptions.offsetAttribute = offsetAttribute === -1 ? undefined : offsetAttribute;
                return new EllipsoidGeometry(scratchOptions);
            }

            result._radii = Cartographic.Cartesian3.clone(radii, result._radii);
            result._innerRadii = Cartographic.Cartesian3.clone(innerRadii, result._innerRadii);
            result._vertexFormat = VertexFormat.VertexFormat.clone(vertexFormat, result._vertexFormat);
            result._minimumClock = minimumClock;
            result._maximumClock = maximumClock;
            result._minimumCone = minimumCone;
            result._maximumCone = maximumCone;
            result._stackPartitions = stackPartitions;
            result._slicePartitions = slicePartitions;
            result._offsetAttribute = offsetAttribute === -1 ? undefined : offsetAttribute;

            return result;
        };

        /**
         * Computes the geometric representation of an ellipsoid, including its vertices, indices, and a bounding sphere.
         *
         * @param {EllipsoidGeometry} ellipsoidGeometry A description of the ellipsoid.
         * @returns {Geometry|undefined} The computed vertices and indices.
         */
        EllipsoidGeometry.createGeometry = function(ellipsoidGeometry) {
            var radii = ellipsoidGeometry._radii;
            if ((radii.x <= 0) || (radii.y <= 0) || (radii.z <= 0)) {
                return;
            }

            var innerRadii = ellipsoidGeometry._innerRadii;
            if ((innerRadii.x <= 0) || (innerRadii.y <= 0) || innerRadii.z <= 0) {
                return;
            }

            var minimumClock = ellipsoidGeometry._minimumClock;
            var maximumClock = ellipsoidGeometry._maximumClock;
            var minimumCone = ellipsoidGeometry._minimumCone;
            var maximumCone = ellipsoidGeometry._maximumCone;
            var vertexFormat = ellipsoidGeometry._vertexFormat;

            // Add an extra slice and stack so that the number of partitions is the
            // number of surfaces rather than the number of joints
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

            var i;
            var j;
            var index = 0;

            // Create arrays for theta and phi. Duplicate first and last angle to
            // allow different normals at the intersections.
            var phis = [minimumCone];
            var thetas = [minimumClock];
            for (i = 0; i < stackPartitions; i++) {
                phis.push(minimumCone + i * (maximumCone - minimumCone) / (stackPartitions - 1));
            }
            phis.push(maximumCone);
            for (j = 0; j < slicePartitions; j++) {
                thetas.push(minimumClock + j * (maximumClock - minimumClock) / (slicePartitions - 1));
            }
            thetas.push(maximumClock);
            var numPhis = phis.length;
            var numThetas = thetas.length;

            // Allow for extra indices if there is an inner surface and if we need
            // to close the sides if the clock range is not a full circle
            var extraIndices = 0;
            var vertexMultiplier = 1.0;
            var hasInnerSurface = ((innerRadii.x !== radii.x) || (innerRadii.y !== radii.y) || innerRadii.z !== radii.z);
            var isTopOpen = false;
            var isBotOpen = false;
            var isClockOpen = false;
            if (hasInnerSurface) {
                vertexMultiplier = 2.0;
                if (minimumCone > 0.0) {
                    isTopOpen = true;
                    extraIndices += (slicePartitions - 1);
                }
                if (maximumCone < Math.PI) {
                    isBotOpen = true;
                    extraIndices += (slicePartitions - 1);
                }
                if ((maximumClock - minimumClock) % _Math.CesiumMath.TWO_PI) {
                    isClockOpen = true;
                    extraIndices += ((stackPartitions - 1) * 2) + 1;
                } else {
                    extraIndices += 1;
                }
            }

            var vertexCount = numThetas * numPhis * vertexMultiplier;
            var positions = new Float64Array(vertexCount * 3);
            var isInner = GeometryOffsetAttribute.arrayFill(new Array(vertexCount), false);
            var negateNormal = GeometryOffsetAttribute.arrayFill(new Array(vertexCount), false);

            // Multiply by 6 because there are two triangles per sector
            var indexCount = slicePartitions * stackPartitions * vertexMultiplier;
            var numIndices = 6 * (indexCount + extraIndices + 1 - (slicePartitions + stackPartitions) * vertexMultiplier);
            var indices = IndexDatatype.IndexDatatype.createTypedArray(indexCount, numIndices);

            var normals = (vertexFormat.normal) ? new Float32Array(vertexCount * 3) : undefined;
            var tangents = (vertexFormat.tangent) ? new Float32Array(vertexCount * 3) : undefined;
            var bitangents = (vertexFormat.bitangent) ? new Float32Array(vertexCount * 3) : undefined;
            var st = (vertexFormat.st) ? new Float32Array(vertexCount * 2) : undefined;

            // Calculate sin/cos phi
            var sinPhi = new Array(numPhis);
            var cosPhi = new Array(numPhis);
            for (i = 0; i < numPhis; i++) {
                sinPhi[i] = sin(phis[i]);
                cosPhi[i] = cos(phis[i]);
            }

            // Calculate sin/cos theta
            var sinTheta = new Array(numThetas);
            var cosTheta = new Array(numThetas);
            for (j = 0; j < numThetas; j++) {
                cosTheta[j] = cos(thetas[j]);
                sinTheta[j] = sin(thetas[j]);
            }

            // Create outer surface
            for (i = 0; i < numPhis; i++) {
                for (j = 0; j < numThetas; j++) {
                    positions[index++] = radii.x * sinPhi[i] * cosTheta[j];
                    positions[index++] = radii.y * sinPhi[i] * sinTheta[j];
                    positions[index++] = radii.z * cosPhi[i];
                }
            }

            // Create inner surface
            var vertexIndex = vertexCount / 2.0;
            if (hasInnerSurface) {
                for (i = 0; i < numPhis; i++) {
                    for (j = 0; j < numThetas; j++) {
                        positions[index++] = innerRadii.x * sinPhi[i] * cosTheta[j];
                        positions[index++] = innerRadii.y * sinPhi[i] * sinTheta[j];
                        positions[index++] = innerRadii.z * cosPhi[i];

                        // Keep track of which vertices are the inner and which ones
                        // need the normal to be negated
                        isInner[vertexIndex] = true;
                        if (i > 0 && i !== (numPhis - 1) && j !== 0 && j !== (numThetas - 1)) {
                            negateNormal[vertexIndex] = true;
                        }
                        vertexIndex++;
                    }
                }
            }

            // Create indices for outer surface
            index = 0;
            var topOffset;
            var bottomOffset;
            for (i = 1; i < (numPhis - 2); i++) {
                topOffset = i * numThetas;
                bottomOffset = (i + 1) * numThetas;

                for (j = 1; j < numThetas - 2; j++) {
                    indices[index++] = bottomOffset + j;
                    indices[index++] = bottomOffset + j + 1;
                    indices[index++] = topOffset + j + 1;

                    indices[index++] = bottomOffset + j;
                    indices[index++] = topOffset + j + 1;
                    indices[index++] = topOffset + j;
                }
            }

            // Create indices for inner surface
            if (hasInnerSurface) {
                var offset = numPhis * numThetas;
                for (i = 1; i < (numPhis - 2); i++) {
                    topOffset = offset + i * numThetas;
                    bottomOffset = offset + (i + 1) * numThetas;

                    for (j = 1; j < numThetas - 2; j++) {
                        indices[index++] = bottomOffset + j;
                        indices[index++] = topOffset + j;
                        indices[index++] = topOffset + j + 1;

                        indices[index++] = bottomOffset + j;
                        indices[index++] = topOffset + j + 1;
                        indices[index++] = bottomOffset + j + 1;
                    }
                }
            }

            var outerOffset;
            var innerOffset;
            if (hasInnerSurface) {
                if (isTopOpen) {
                    // Connect the top of the inner surface to the top of the outer surface
                    innerOffset = numPhis * numThetas;
                    for (i = 1; i < numThetas - 2; i++) {
                        indices[index++] = i;
                        indices[index++] = i + 1;
                        indices[index++] = innerOffset + i + 1;

                        indices[index++] = i;
                        indices[index++] = innerOffset + i + 1;
                        indices[index++] = innerOffset + i;
                    }
                }

                if (isBotOpen) {
                    // Connect the bottom of the inner surface to the bottom of the outer surface
                    outerOffset = numPhis * numThetas - numThetas;
                    innerOffset = numPhis * numThetas * vertexMultiplier - numThetas;
                    for (i = 1; i < numThetas - 2; i++) {
                        indices[index++] = outerOffset + i + 1;
                        indices[index++] = outerOffset + i;
                        indices[index++] = innerOffset + i;

                        indices[index++] = outerOffset + i + 1;
                        indices[index++] = innerOffset + i;
                        indices[index++] = innerOffset + i + 1;
                    }
                }
            }

            // Connect the edges if clock is not closed
            if (isClockOpen) {
                for (i = 1; i < numPhis - 2; i++) {
                    innerOffset = numThetas * numPhis + (numThetas * i);
                    outerOffset = numThetas * i;
                    indices[index++] = innerOffset;
                    indices[index++] = outerOffset + numThetas;
                    indices[index++] = outerOffset;

                    indices[index++] = innerOffset;
                    indices[index++] = innerOffset + numThetas;
                    indices[index++] = outerOffset + numThetas;
                }

                for (i = 1; i < numPhis - 2; i++) {
                    innerOffset = numThetas * numPhis + (numThetas * (i + 1)) - 1;
                    outerOffset = numThetas * (i + 1) - 1;
                    indices[index++] = outerOffset + numThetas;
                    indices[index++] = innerOffset;
                    indices[index++] = outerOffset;

                    indices[index++] = outerOffset + numThetas;
                    indices[index++] = innerOffset + numThetas;
                    indices[index++] = innerOffset;
                }
            }

            var attributes = new GeometryAttributes.GeometryAttributes();

            if (vertexFormat.position) {
                attributes.position = new GeometryAttribute.GeometryAttribute({
                    componentDatatype : ComponentDatatype.ComponentDatatype.DOUBLE,
                    componentsPerAttribute : 3,
                    values : positions
                });
            }

            var stIndex = 0;
            var normalIndex = 0;
            var tangentIndex = 0;
            var bitangentIndex = 0;
            var vertexCountHalf = vertexCount / 2.0;

            var ellipsoid;
            var ellipsoidOuter = Cartesian2.Ellipsoid.fromCartesian3(radii);
            var ellipsoidInner = Cartesian2.Ellipsoid.fromCartesian3(innerRadii);

            if (vertexFormat.st || vertexFormat.normal || vertexFormat.tangent || vertexFormat.bitangent) {
                for (i = 0; i < vertexCount; i++) {
                    ellipsoid = (isInner[i]) ? ellipsoidInner : ellipsoidOuter;
                    var position = Cartographic.Cartesian3.fromArray(positions, i * 3, scratchPosition);
                    var normal = ellipsoid.geodeticSurfaceNormal(position, scratchNormal);
                    if (negateNormal[i]) {
                        Cartographic.Cartesian3.negate(normal, normal);
                    }

                    if (vertexFormat.st) {
                        var normalST = Cartesian2.Cartesian2.negate(normal, scratchNormalST);
                        st[stIndex++] = (Math.atan2(normalST.y, normalST.x) / _Math.CesiumMath.TWO_PI) + 0.5;
                        st[stIndex++] = (Math.asin(normal.z) / Math.PI) + 0.5;
                    }

                    if (vertexFormat.normal) {
                        normals[normalIndex++] = normal.x;
                        normals[normalIndex++] = normal.y;
                        normals[normalIndex++] = normal.z;
                    }

                    if (vertexFormat.tangent || vertexFormat.bitangent) {
                        var tangent = scratchTangent;

                        // Use UNIT_X for the poles
                        var tangetOffset = 0;
                        var unit;
                        if (isInner[i]) {
                            tangetOffset = vertexCountHalf;
                        }
                        if ((!isTopOpen && (i >= tangetOffset && i < (tangetOffset + numThetas * 2)))) {
                            unit = Cartographic.Cartesian3.UNIT_X;
                        } else {
                            unit = Cartographic.Cartesian3.UNIT_Z;
                        }
                        Cartographic.Cartesian3.cross(unit, normal, tangent);
                        Cartographic.Cartesian3.normalize(tangent, tangent);

                        if (vertexFormat.tangent) {
                            tangents[tangentIndex++] = tangent.x;
                            tangents[tangentIndex++] = tangent.y;
                            tangents[tangentIndex++] = tangent.z;
                        }

                        if (vertexFormat.bitangent) {
                            var bitangent = Cartographic.Cartesian3.cross(normal, tangent, scratchBitangent);
                            Cartographic.Cartesian3.normalize(bitangent, bitangent);

                            bitangents[bitangentIndex++] = bitangent.x;
                            bitangents[bitangentIndex++] = bitangent.y;
                            bitangents[bitangentIndex++] = bitangent.z;
                        }
                    }
                }

                if (vertexFormat.st) {
                    attributes.st = new GeometryAttribute.GeometryAttribute({
                        componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
                        componentsPerAttribute : 2,
                        values : st
                    });
                }

                if (vertexFormat.normal) {
                    attributes.normal = new GeometryAttribute.GeometryAttribute({
                        componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
                        componentsPerAttribute : 3,
                        values : normals
                    });
                }

                if (vertexFormat.tangent) {
                    attributes.tangent = new GeometryAttribute.GeometryAttribute({
                        componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
                        componentsPerAttribute : 3,
                        values : tangents
                    });
                }

                if (vertexFormat.bitangent) {
                    attributes.bitangent = new GeometryAttribute.GeometryAttribute({
                        componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
                        componentsPerAttribute : 3,
                        values : bitangents
                    });
                }
            }

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
                primitiveType : PrimitiveType.PrimitiveType.TRIANGLES,
                boundingSphere : BoundingSphere.BoundingSphere.fromEllipsoid(ellipsoidOuter),
                offsetAttribute : ellipsoidGeometry._offsetAttribute
            });
        };

        var unitEllipsoidGeometry;

        /**
         * Returns the geometric representation of a unit ellipsoid, including its vertices, indices, and a bounding sphere.
         * @returns {Geometry} The computed vertices and indices.
         *
         * @private
         */
        EllipsoidGeometry.getUnitEllipsoid = function() {
            if (!when.defined(unitEllipsoidGeometry)) {
                unitEllipsoidGeometry = EllipsoidGeometry.createGeometry((new EllipsoidGeometry({
                    radii : new Cartographic.Cartesian3(1.0, 1.0, 1.0),
                    vertexFormat : VertexFormat.VertexFormat.POSITION_ONLY
                })));
            }
            return unitEllipsoidGeometry;
        };

    exports.EllipsoidGeometry = EllipsoidGeometry;

});

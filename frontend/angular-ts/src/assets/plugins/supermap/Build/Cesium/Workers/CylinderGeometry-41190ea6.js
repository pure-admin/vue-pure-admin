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
define(['exports', './when-8d13db60', './Check-70bec281', './Math-61ede240', './Cartographic-fe4be337', './Cartesian2-85064f09', './BoundingSphere-775c5788', './ComponentDatatype-5862616f', './GeometryAttribute-06d31d45', './PrimitiveType-97893bc7', './GeometryAttributes-aacecde6', './IndexDatatype-9435b55f', './GeometryOffsetAttribute-ca302482', './VertexFormat-fe4db402', './CylinderGeometryLibrary-8c0fda9f'], function (exports, when, Check, _Math, Cartographic, Cartesian2, BoundingSphere, ComponentDatatype, GeometryAttribute, PrimitiveType, GeometryAttributes, IndexDatatype, GeometryOffsetAttribute, VertexFormat, CylinderGeometryLibrary) { 'use strict';

    var radiusScratch = new Cartesian2.Cartesian2();
        var normalScratch = new Cartographic.Cartesian3();
        var bitangentScratch = new Cartographic.Cartesian3();
        var tangentScratch = new Cartographic.Cartesian3();
        var positionScratch = new Cartographic.Cartesian3();

        /**
         * A description of a cylinder.
         *
         * @alias CylinderGeometry
         * @constructor
         *
         * @param {Object} options Object with the following properties:
         * @param {Number} options.length The length of the cylinder.
         * @param {Number} options.topRadius The radius of the top of the cylinder.
         * @param {Number} options.bottomRadius The radius of the bottom of the cylinder.
         * @param {Number} [options.slices=128] The number of edges around the perimeter of the cylinder.
         * @param {VertexFormat} [options.vertexFormat=VertexFormat.DEFAULT] The vertex attributes to be computed.
         *
         * @exception {DeveloperError} options.slices must be greater than or equal to 3.
         *
         * @see CylinderGeometry.createGeometry
         *
         * @example
         * // create cylinder geometry
         * var cylinder = new Cesium.CylinderGeometry({
         *     length: 200000,
         *     topRadius: 80000,
         *     bottomRadius: 200000,
         * });
         * var geometry = Cesium.CylinderGeometry.createGeometry(cylinder);
         */
        function CylinderGeometry(options) {
            options = when.defaultValue(options, when.defaultValue.EMPTY_OBJECT);

            var length = options.length;
            var topRadius = options.topRadius;
            var bottomRadius = options.bottomRadius;
            var vertexFormat = when.defaultValue(options.vertexFormat, VertexFormat.VertexFormat.DEFAULT);
            var slices = when.defaultValue(options.slices, 128);

            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(length)) {
                throw new Check.DeveloperError('options.length must be defined.');
            }
            if (!when.defined(topRadius)) {
                throw new Check.DeveloperError('options.topRadius must be defined.');
            }
            if (!when.defined(bottomRadius)) {
                throw new Check.DeveloperError('options.bottomRadius must be defined.');
            }
            if (slices < 3) {
                throw new Check.DeveloperError('options.slices must be greater than or equal to 3.');
            }
            if (when.defined(options.offsetAttribute) && options.offsetAttribute === GeometryOffsetAttribute.GeometryOffsetAttribute.TOP) {
                throw new Check.DeveloperError('GeometryOffsetAttribute.TOP is not a supported options.offsetAttribute for this geometry.');
            }
            //>>includeEnd('debug');

            this._length = length;
            this._topRadius = topRadius;
            this._bottomRadius = bottomRadius;
            this._vertexFormat = VertexFormat.VertexFormat.clone(vertexFormat);
            this._slices = slices;
            this._offsetAttribute = options.offsetAttribute;
            this._workerName = 'createCylinderGeometry';
        }

        /**
         * The number of elements used to pack the object into an array.
         * @type {Number}
         */
        CylinderGeometry.packedLength = VertexFormat.VertexFormat.packedLength + 5;

        /**
         * Stores the provided instance into the provided array.
         *
         * @param {CylinderGeometry} value The value to pack.
         * @param {Number[]} array The array to pack into.
         * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
         *
         * @returns {Number[]} The array that was packed into
         */
        CylinderGeometry.pack = function(value, array, startingIndex) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(value)) {
                throw new Check.DeveloperError('value is required');
            }
            if (!when.defined(array)) {
                throw new Check.DeveloperError('array is required');
            }
            //>>includeEnd('debug');

            startingIndex = when.defaultValue(startingIndex, 0);

            VertexFormat.VertexFormat.pack(value._vertexFormat, array, startingIndex);
            startingIndex += VertexFormat.VertexFormat.packedLength;

            array[startingIndex++] = value._length;
            array[startingIndex++] = value._topRadius;
            array[startingIndex++] = value._bottomRadius;
            array[startingIndex++] = value._slices;
            array[startingIndex] = when.defaultValue(value._offsetAttribute, -1);

            return array;
        };

        var scratchVertexFormat = new VertexFormat.VertexFormat();
        var scratchOptions = {
            vertexFormat : scratchVertexFormat,
            length : undefined,
            topRadius : undefined,
            bottomRadius : undefined,
            slices : undefined,
            offsetAttribute : undefined
        };

        /**
         * Retrieves an instance from a packed array.
         *
         * @param {Number[]} array The packed array.
         * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
         * @param {CylinderGeometry} [result] The object into which to store the result.
         * @returns {CylinderGeometry} The modified result parameter or a new CylinderGeometry instance if one was not provided.
         */
        CylinderGeometry.unpack = function(array, startingIndex, result) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(array)) {
                throw new Check.DeveloperError('array is required');
            }
            //>>includeEnd('debug');

            startingIndex = when.defaultValue(startingIndex, 0);

            var vertexFormat = VertexFormat.VertexFormat.unpack(array, startingIndex, scratchVertexFormat);
            startingIndex += VertexFormat.VertexFormat.packedLength;

            var length = array[startingIndex++];
            var topRadius = array[startingIndex++];
            var bottomRadius = array[startingIndex++];
            var slices = array[startingIndex++];
            var offsetAttribute = array[startingIndex];

            if (!when.defined(result)) {
                scratchOptions.length = length;
                scratchOptions.topRadius = topRadius;
                scratchOptions.bottomRadius = bottomRadius;
                scratchOptions.slices = slices;
                scratchOptions.offsetAttribute = offsetAttribute === -1 ? undefined : offsetAttribute;
                return new CylinderGeometry(scratchOptions);
            }

            result._vertexFormat = VertexFormat.VertexFormat.clone(vertexFormat, result._vertexFormat);
            result._length = length;
            result._topRadius = topRadius;
            result._bottomRadius = bottomRadius;
            result._slices = slices;
            result._offsetAttribute = offsetAttribute === -1 ? undefined : offsetAttribute;

            return result;
        };

        /**
         * Computes the geometric representation of a cylinder, including its vertices, indices, and a bounding sphere.
         *
         * @param {CylinderGeometry} cylinderGeometry A description of the cylinder.
         * @returns {Geometry|undefined} The computed vertices and indices.
         */
        CylinderGeometry.createGeometry = function(cylinderGeometry) {
            var length = cylinderGeometry._length;
            var topRadius = cylinderGeometry._topRadius;
            var bottomRadius = cylinderGeometry._bottomRadius;
            var vertexFormat = cylinderGeometry._vertexFormat;
            var slices = cylinderGeometry._slices;

            if ((length <= 0) || (topRadius < 0) || (bottomRadius < 0) || ((topRadius === 0) && (bottomRadius === 0))) {
                return;
            }

            var twoSlices = slices + slices;
            var threeSlices = slices + twoSlices;
            var numVertices = twoSlices + twoSlices;

            var positions = CylinderGeometryLibrary.CylinderGeometryLibrary.computePositions(length, topRadius, bottomRadius, slices, true);

            var st = (vertexFormat.st) ? new Float32Array(numVertices * 2) : undefined;
            var normals = (vertexFormat.normal) ? new Float32Array(numVertices * 3) : undefined;
            var tangents = (vertexFormat.tangent) ? new Float32Array(numVertices * 3) : undefined;
            var bitangents = (vertexFormat.bitangent) ? new Float32Array(numVertices * 3) : undefined;

            var i;
            var computeNormal = (vertexFormat.normal || vertexFormat.tangent || vertexFormat.bitangent);

            if (computeNormal) {
                var computeTangent = (vertexFormat.tangent || vertexFormat.bitangent);

                var normalIndex = 0;
                var tangentIndex = 0;
                var bitangentIndex = 0;

                var theta = Math.atan2(bottomRadius - topRadius, length);
                var normal = normalScratch;
                normal.z = Math.sin(theta);
                var normalScale = Math.cos(theta);
                var tangent = tangentScratch;
                var bitangent = bitangentScratch;

                for (i = 0; i < slices; i++) {
                    var angle = i / slices * _Math.CesiumMath.TWO_PI;
                    var x = normalScale * Math.cos(angle);
                    var y = normalScale * Math.sin(angle);
                    if (computeNormal) {
                        normal.x = x;
                        normal.y = y;

                        if (computeTangent) {
                            tangent = Cartographic.Cartesian3.normalize(Cartographic.Cartesian3.cross(Cartographic.Cartesian3.UNIT_Z, normal, tangent), tangent);
                        }

                        if (vertexFormat.normal) {
                            normals[normalIndex++] = normal.x;
                            normals[normalIndex++] = normal.y;
                            normals[normalIndex++] = normal.z;
                            normals[normalIndex++] = normal.x;
                            normals[normalIndex++] = normal.y;
                            normals[normalIndex++] = normal.z;
                        }

                        if (vertexFormat.tangent) {
                            tangents[tangentIndex++] = tangent.x;
                            tangents[tangentIndex++] = tangent.y;
                            tangents[tangentIndex++] = tangent.z;
                            tangents[tangentIndex++] = tangent.x;
                            tangents[tangentIndex++] = tangent.y;
                            tangents[tangentIndex++] = tangent.z;
                        }

                        if (vertexFormat.bitangent) {
                            bitangent = Cartographic.Cartesian3.normalize(Cartographic.Cartesian3.cross(normal, tangent, bitangent), bitangent);
                            bitangents[bitangentIndex++] = bitangent.x;
                            bitangents[bitangentIndex++] = bitangent.y;
                            bitangents[bitangentIndex++] = bitangent.z;
                            bitangents[bitangentIndex++] = bitangent.x;
                            bitangents[bitangentIndex++] = bitangent.y;
                            bitangents[bitangentIndex++] = bitangent.z;
                        }
                    }
                }

                for (i = 0; i < slices; i++) {
                    if (vertexFormat.normal) {
                        normals[normalIndex++] = 0;
                        normals[normalIndex++] = 0;
                        normals[normalIndex++] = -1;
                    }
                    if (vertexFormat.tangent) {
                        tangents[tangentIndex++] = 1;
                        tangents[tangentIndex++] = 0;
                        tangents[tangentIndex++] = 0;
                    }
                    if (vertexFormat.bitangent) {
                        bitangents[bitangentIndex++] = 0;
                        bitangents[bitangentIndex++] = -1;
                        bitangents[bitangentIndex++] = 0;
                    }
                }

                for (i = 0; i < slices; i++) {
                    if (vertexFormat.normal) {
                        normals[normalIndex++] = 0;
                        normals[normalIndex++] = 0;
                        normals[normalIndex++] = 1;
                    }
                    if (vertexFormat.tangent) {
                        tangents[tangentIndex++] = 1;
                        tangents[tangentIndex++] = 0;
                        tangents[tangentIndex++] = 0;
                    }
                    if (vertexFormat.bitangent) {
                        bitangents[bitangentIndex++] = 0;
                        bitangents[bitangentIndex++] = 1;
                        bitangents[bitangentIndex++] = 0;
                    }
                }
            }

            var numIndices = 12 * slices - 12;
            var indices = IndexDatatype.IndexDatatype.createTypedArray(numVertices, numIndices);
            var index = 0;
            var j = 0;
            for (i = 0; i < slices - 1; i++) {
                indices[index++] = j;
                indices[index++] = j + 2;
                indices[index++] = j + 3;

                indices[index++] = j;
                indices[index++] = j + 3;
                indices[index++] = j + 1;

                j += 2;
            }

            indices[index++] = twoSlices - 2;
            indices[index++] = 0;
            indices[index++] = 1;
            indices[index++] = twoSlices - 2;
            indices[index++] = 1;
            indices[index++] = twoSlices - 1;

            for (i = 1; i < slices - 1; i++) {
                indices[index++] = twoSlices + i + 1;
                indices[index++] = twoSlices + i;
                indices[index++] = twoSlices;
            }

            for (i = 1; i < slices - 1; i++) {
                indices[index++] = threeSlices;
                indices[index++] = threeSlices + i;
                indices[index++] = threeSlices + i + 1;
            }

            var textureCoordIndex = 0;
            if (vertexFormat.st) {
                var rad = Math.max(topRadius, bottomRadius);
                for (i = 0; i < numVertices; i++) {
                    var position = Cartographic.Cartesian3.fromArray(positions, i * 3, positionScratch);
                    st[textureCoordIndex++] = (position.x + rad) / (2.0 * rad);
                    st[textureCoordIndex++] = (position.y + rad) / (2.0 * rad);
                }
            }

            var attributes = new GeometryAttributes.GeometryAttributes();
            if (vertexFormat.position) {
                attributes.position = new GeometryAttribute.GeometryAttribute({
                    componentDatatype: ComponentDatatype.ComponentDatatype.DOUBLE,
                    componentsPerAttribute: 3,
                    values: positions
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

            if (vertexFormat.st) {
                attributes.st = new GeometryAttribute.GeometryAttribute({
                    componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
                    componentsPerAttribute : 2,
                    values : st
                });
            }

            radiusScratch.x = length * 0.5;
            radiusScratch.y = Math.max(bottomRadius, topRadius);

            var boundingSphere = new BoundingSphere.BoundingSphere(Cartographic.Cartesian3.ZERO, Cartesian2.Cartesian2.magnitude(radiusScratch));

            if (when.defined(cylinderGeometry._offsetAttribute)) {
                length = positions.length;
                var applyOffset = new Uint8Array(length / 3);
                var offsetValue = cylinderGeometry._offsetAttribute === GeometryOffsetAttribute.GeometryOffsetAttribute.NONE ? 0 : 1;
                GeometryOffsetAttribute.arrayFill(applyOffset, offsetValue);
                attributes.applyOffset = new GeometryAttribute.GeometryAttribute({
                    componentDatatype : ComponentDatatype.ComponentDatatype.UNSIGNED_BYTE,
                    componentsPerAttribute : 1,
                    values: applyOffset
                });
            }

            return new GeometryAttribute.Geometry({
                attributes : attributes,
                indices : indices,
                primitiveType : PrimitiveType.PrimitiveType.TRIANGLES,
                boundingSphere : boundingSphere,
                offsetAttribute : cylinderGeometry._offsetAttribute
            });
        };

        var unitCylinderGeometry;

        /**
         * Returns the geometric representation of a unit cylinder, including its vertices, indices, and a bounding sphere.
         * @returns {Geometry} The computed vertices and indices.
         *
         * @private
         */
        CylinderGeometry.getUnitCylinder = function() {
            if (!when.defined(unitCylinderGeometry)) {
                unitCylinderGeometry = CylinderGeometry.createGeometry(new CylinderGeometry({
                    topRadius : 1.0,
                    bottomRadius : 1.0,
                    length : 1.0,
                    vertexFormat : VertexFormat.VertexFormat.POSITION_ONLY
                }));
            }
            return unitCylinderGeometry;
        };

    exports.CylinderGeometry = CylinderGeometry;

});

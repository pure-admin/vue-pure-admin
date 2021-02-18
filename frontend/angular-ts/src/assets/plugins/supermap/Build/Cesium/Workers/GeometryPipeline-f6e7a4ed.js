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
define(['exports', './when-8d13db60', './Check-70bec281', './Math-61ede240', './Cartographic-fe4be337', './Cartesian2-85064f09', './BoundingSphere-775c5788', './Cartesian4-5af5bb24', './ComponentDatatype-5862616f', './GeometryAttribute-06d31d45', './PrimitiveType-97893bc7', './AttributeCompression-84a90a13', './EncodedCartesian3-a569cba8', './IndexDatatype-9435b55f', './IntersectionTests-397d9494', './Plane-8390418f'], function (exports, when, Check, _Math, Cartographic, Cartesian2, BoundingSphere, Cartesian4, ComponentDatatype, GeometryAttribute, PrimitiveType, AttributeCompression, EncodedCartesian3, IndexDatatype, IntersectionTests, Plane) { 'use strict';

    var scratchCartesian1 = new Cartographic.Cartesian3();
        var scratchCartesian2 = new Cartographic.Cartesian3();
        var scratchCartesian3 = new Cartographic.Cartesian3();

        /**
         * Computes the barycentric coordinates for a point with respect to a triangle.
         *
         * @exports barycentricCoordinates
         *
         * @param {Cartesian2|Cartesian3} point The point to test.
         * @param {Cartesian2|Cartesian3} p0 The first point of the triangle, corresponding to the barycentric x-axis.
         * @param {Cartesian2|Cartesian3} p1 The second point of the triangle, corresponding to the barycentric y-axis.
         * @param {Cartesian2|Cartesian3} p2 The third point of the triangle, corresponding to the barycentric z-axis.
         * @param {Cartesian3} [result] The object onto which to store the result.
         * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided.
         *
         * @example
         * // Returns Cartesian3.UNIT_X
         * var p = new Cesium.Cartesian3(-1.0, 0.0, 0.0);
         * var b = Cesium.barycentricCoordinates(p,
         *   new Cesium.Cartesian3(-1.0, 0.0, 0.0),
         *   new Cesium.Cartesian3( 1.0, 0.0, 0.0),
         *   new Cesium.Cartesian3( 0.0, 1.0, 1.0));
         */
        function barycentricCoordinates(point, p0, p1, p2, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('point', point);
            Check.Check.defined('p0', p0);
            Check.Check.defined('p1', p1);
            Check.Check.defined('p2', p2);
            //>>includeEnd('debug');

            if (!when.defined(result)) {
                result = new Cartographic.Cartesian3();
            }

            // Implementation based on http://www.blackpawn.com/texts/pointinpoly/default.html.
            var v0;
            var v1;
            var v2;
            var dot00;
            var dot01;
            var dot02;
            var dot11;
            var dot12;

            if(!when.defined(p0.z)) {
                if (Cartesian2.Cartesian2.equalsEpsilon(point, p0, _Math.CesiumMath.EPSILON14)) {
                    return Cartographic.Cartesian3.clone(Cartographic.Cartesian3.UNIT_X, result);
                }
                if (Cartesian2.Cartesian2.equalsEpsilon(point, p1, _Math.CesiumMath.EPSILON14)) {
                    return Cartographic.Cartesian3.clone(Cartographic.Cartesian3.UNIT_Y, result);
                }
                if (Cartesian2.Cartesian2.equalsEpsilon(point, p2, _Math.CesiumMath.EPSILON14)) {
                    return Cartographic.Cartesian3.clone(Cartographic.Cartesian3.UNIT_Z, result);
                }

                v0 = Cartesian2.Cartesian2.subtract(p1, p0, scratchCartesian1);
                v1 = Cartesian2.Cartesian2.subtract(p2, p0, scratchCartesian2);
                v2 = Cartesian2.Cartesian2.subtract(point, p0, scratchCartesian3);

                dot00 = Cartesian2.Cartesian2.dot(v0, v0);
                dot01 = Cartesian2.Cartesian2.dot(v0, v1);
                dot02 = Cartesian2.Cartesian2.dot(v0, v2);
                dot11 = Cartesian2.Cartesian2.dot(v1, v1);
                dot12 = Cartesian2.Cartesian2.dot(v1, v2);
            } else {
                if (Cartographic.Cartesian3.equalsEpsilon(point, p0, _Math.CesiumMath.EPSILON14)) {
                    return Cartographic.Cartesian3.clone(Cartographic.Cartesian3.UNIT_X, result);
                }
                if (Cartographic.Cartesian3.equalsEpsilon(point, p1, _Math.CesiumMath.EPSILON14)) {
                    return Cartographic.Cartesian3.clone(Cartographic.Cartesian3.UNIT_Y, result);
                }
                if (Cartographic.Cartesian3.equalsEpsilon(point, p2, _Math.CesiumMath.EPSILON14)) {
                    return Cartographic.Cartesian3.clone(Cartographic.Cartesian3.UNIT_Z, result);
                }

                v0 = Cartographic.Cartesian3.subtract(p1, p0, scratchCartesian1);
                v1 = Cartographic.Cartesian3.subtract(p2, p0, scratchCartesian2);
                v2 = Cartographic.Cartesian3.subtract(point, p0, scratchCartesian3);

                dot00 = Cartographic.Cartesian3.dot(v0, v0);
                dot01 = Cartographic.Cartesian3.dot(v0, v1);
                dot02 = Cartographic.Cartesian3.dot(v0, v2);
                dot11 = Cartographic.Cartesian3.dot(v1, v1);
                dot12 = Cartographic.Cartesian3.dot(v1, v2);
            }

            result.y = (dot11 * dot02 - dot01 * dot12);
            result.z = (dot00 * dot12 - dot01 * dot02);
            var q = dot00 * dot11 - dot01 * dot01;

            // This is done to avoid dividing by infinity causing a NaN
            if (result.y !== 0) {
                result.y /= q;
            }
            if (result.z !== 0) {
                result.z /= q;
            }

            result.x = 1.0 - result.y - result.z;
            return result;
        }

    /**
         * Encapsulates an algorithm to optimize triangles for the post
         * vertex-shader cache.  This is based on the 2007 SIGGRAPH paper
         * 'Fast Triangle Reordering for Vertex Locality and Reduced Overdraw.'
         * The runtime is linear but several passes are made.
         *
         * @exports Tipsify
         *
         * @see <a href='http://gfx.cs.princeton.edu/pubs/Sander_2007_%3ETR/tipsy.pdf'>
         * Fast Triangle Reordering for Vertex Locality and Reduced Overdraw</a>
         * by Sander, Nehab, and Barczak
         *
         * @private
         */
        var Tipsify = {};

        /**
         * Calculates the average cache miss ratio (ACMR) for a given set of indices.
         *
         * @param {Object} options Object with the following properties:
         * @param {Number[]} options.indices Lists triads of numbers corresponding to the indices of the vertices
         *                        in the vertex buffer that define the geometry's triangles.
         * @param {Number} [options.maximumIndex] The maximum value of the elements in <code>args.indices</code>.
         *                                     If not supplied, this value will be computed.
         * @param {Number} [options.cacheSize=24] The number of vertices that can be stored in the cache at any one time.
         * @returns {Number} The average cache miss ratio (ACMR).
         *
         * @exception {DeveloperError} indices length must be a multiple of three.
         * @exception {DeveloperError} cacheSize must be greater than two.
         *
         * @example
         * var indices = [0, 1, 2, 3, 4, 5];
         * var maxIndex = 5;
         * var cacheSize = 3;
         * var acmr = Cesium.Tipsify.calculateACMR({indices : indices, maxIndex : maxIndex, cacheSize : cacheSize});
         */
        Tipsify.calculateACMR = function(options) {
            options = when.defaultValue(options, when.defaultValue.EMPTY_OBJECT);
            var indices = options.indices;
            var maximumIndex = options.maximumIndex;
            var cacheSize = when.defaultValue(options.cacheSize, 24);

            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(indices)) {
                throw new Check.DeveloperError('indices is required.');
            }
            //>>includeEnd('debug');

            var numIndices = indices.length;

            //>>includeStart('debug', pragmas.debug);
            if (numIndices < 3 || numIndices % 3 !== 0) {
                throw new Check.DeveloperError('indices length must be a multiple of three.');
            }
            if (maximumIndex <= 0) {
                throw new Check.DeveloperError('maximumIndex must be greater than zero.');
            }
            if (cacheSize < 3) {
                throw new Check.DeveloperError('cacheSize must be greater than two.');
            }
            //>>includeEnd('debug');

            // Compute the maximumIndex if not given
            if (!when.defined(maximumIndex)) {
                maximumIndex = 0;
                var currentIndex = 0;
                var intoIndices = indices[currentIndex];
                while (currentIndex < numIndices) {
                    if (intoIndices > maximumIndex) {
                        maximumIndex = intoIndices;
                    }
                    ++currentIndex;
                    intoIndices = indices[currentIndex];
                }
            }

            // Vertex time stamps
            var vertexTimeStamps = [];
            for ( var i = 0; i < maximumIndex + 1; i++) {
                vertexTimeStamps[i] = 0;
            }

            // Cache processing
            var s = cacheSize + 1;
            for ( var j = 0; j < numIndices; ++j) {
                if ((s - vertexTimeStamps[indices[j]]) > cacheSize) {
                    vertexTimeStamps[indices[j]] = s;
                    ++s;
                }
            }

            return (s - cacheSize + 1) / (numIndices / 3);
        };

        /**
         * Optimizes triangles for the post-vertex shader cache.
         *
         * @param {Object} options Object with the following properties:
         * @param {Number[]} options.indices Lists triads of numbers corresponding to the indices of the vertices
         *                        in the vertex buffer that define the geometry's triangles.
         * @param {Number} [options.maximumIndex] The maximum value of the elements in <code>args.indices</code>.
         *                                     If not supplied, this value will be computed.
         * @param {Number} [options.cacheSize=24] The number of vertices that can be stored in the cache at any one time.
         * @returns {Number[]} A list of the input indices in an optimized order.
         *
         * @exception {DeveloperError} indices length must be a multiple of three.
         * @exception {DeveloperError} cacheSize must be greater than two.
         *
         * @example
         * var indices = [0, 1, 2, 3, 4, 5];
         * var maxIndex = 5;
         * var cacheSize = 3;
         * var reorderedIndices = Cesium.Tipsify.tipsify({indices : indices, maxIndex : maxIndex, cacheSize : cacheSize});
         */
        Tipsify.tipsify = function(options) {
            options = when.defaultValue(options, when.defaultValue.EMPTY_OBJECT);
            var indices = options.indices;
            var maximumIndex = options.maximumIndex;
            var cacheSize = when.defaultValue(options.cacheSize, 24);

            var cursor;

            function skipDeadEnd(vertices, deadEnd, indices, maximumIndexPlusOne) {
                while (deadEnd.length >= 1) {
                    // while the stack is not empty
                    var d = deadEnd[deadEnd.length - 1]; // top of the stack
                    deadEnd.splice(deadEnd.length - 1, 1); // pop the stack

                    if (vertices[d].numLiveTriangles > 0) {
                        return d;
                    }
                }

                while (cursor < maximumIndexPlusOne) {
                    if (vertices[cursor].numLiveTriangles > 0) {
                        ++cursor;
                        return cursor - 1;
                    }
                    ++cursor;
                }
                return -1;
            }

            function getNextVertex(indices, cacheSize, oneRing, vertices, s, deadEnd, maximumIndexPlusOne) {
                var n = -1;
                var p;
                var m = -1;
                var itOneRing = 0;
                while (itOneRing < oneRing.length) {
                    var index = oneRing[itOneRing];
                    if (vertices[index].numLiveTriangles) {
                        p = 0;
                        if ((s - vertices[index].timeStamp + (2 * vertices[index].numLiveTriangles)) <= cacheSize) {
                            p = s - vertices[index].timeStamp;
                        }
                        if ((p > m) || (m === -1)) {
                            m = p;
                            n = index;
                        }
                    }
                    ++itOneRing;
                }
                if (n === -1) {
                    return skipDeadEnd(vertices, deadEnd, indices, maximumIndexPlusOne);
                }
                return n;
            }

            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(indices)) {
                throw new Check.DeveloperError('indices is required.');
            }
            //>>includeEnd('debug');

            var numIndices = indices.length;

            //>>includeStart('debug', pragmas.debug);
            if (numIndices < 3 || numIndices % 3 !== 0) {
                throw new Check.DeveloperError('indices length must be a multiple of three.');
            }
            if (maximumIndex <= 0) {
                throw new Check.DeveloperError('maximumIndex must be greater than zero.');
            }
            if (cacheSize < 3) {
                throw new Check.DeveloperError('cacheSize must be greater than two.');
            }
            //>>includeEnd('debug');

            // Determine maximum index
            var maximumIndexPlusOne = 0;
            var currentIndex = 0;
            var intoIndices = indices[currentIndex];
            var endIndex = numIndices;
            if (when.defined(maximumIndex)) {
                maximumIndexPlusOne = maximumIndex + 1;
            } else {
                while (currentIndex < endIndex) {
                    if (intoIndices > maximumIndexPlusOne) {
                        maximumIndexPlusOne = intoIndices;
                    }
                    ++currentIndex;
                    intoIndices = indices[currentIndex];
                }
                if (maximumIndexPlusOne === -1) {
                    return 0;
                }
                ++maximumIndexPlusOne;
            }

            // Vertices
            var vertices = [];
            var i;
            for (i = 0; i < maximumIndexPlusOne; i++) {
                vertices[i] = {
                    numLiveTriangles : 0,
                    timeStamp : 0,
                    vertexTriangles : []
                };
            }
            currentIndex = 0;
            var triangle = 0;
            while (currentIndex < endIndex) {
                vertices[indices[currentIndex]].vertexTriangles.push(triangle);
                ++(vertices[indices[currentIndex]]).numLiveTriangles;
                vertices[indices[currentIndex + 1]].vertexTriangles.push(triangle);
                ++(vertices[indices[currentIndex + 1]]).numLiveTriangles;
                vertices[indices[currentIndex + 2]].vertexTriangles.push(triangle);
                ++(vertices[indices[currentIndex + 2]]).numLiveTriangles;
                ++triangle;
                currentIndex += 3;
            }

            // Starting index
            var f = 0;

            // Time Stamp
            var s = cacheSize + 1;
            cursor = 1;

            // Process
            var oneRing = [];
            var deadEnd = []; //Stack
            var vertex;
            var intoVertices;
            var currentOutputIndex = 0;
            var outputIndices = [];
            var numTriangles = numIndices / 3;
            var triangleEmitted = [];
            for (i = 0; i < numTriangles; i++) {
                triangleEmitted[i] = false;
            }
            var index;
            var limit;
            while (f !== -1) {
                oneRing = [];
                intoVertices = vertices[f];
                limit = intoVertices.vertexTriangles.length;
                for ( var k = 0; k < limit; ++k) {
                    triangle = intoVertices.vertexTriangles[k];
                    if (!triangleEmitted[triangle]) {
                        triangleEmitted[triangle] = true;
                        currentIndex = triangle + triangle + triangle;
                        for ( var j = 0; j < 3; ++j) {
                            // Set this index as a possible next index
                            index = indices[currentIndex];
                            oneRing.push(index);
                            deadEnd.push(index);

                            // Output index
                            outputIndices[currentOutputIndex] = index;
                            ++currentOutputIndex;

                            // Cache processing
                            vertex = vertices[index];
                            --vertex.numLiveTriangles;
                            if ((s - vertex.timeStamp) > cacheSize) {
                                vertex.timeStamp = s;
                                ++s;
                            }
                            ++currentIndex;
                        }
                    }
                }
                f = getNextVertex(indices, cacheSize, oneRing, vertices, s, deadEnd, maximumIndexPlusOne);
            }

            return outputIndices;
        };

    /**
     * Content pipeline functions for geometries.
     *
     * @exports GeometryPipeline
     *
     * @see Geometry
     */
    var GeometryPipeline = {};

    function addTriangle(lines, index, i0, i1, i2) {
        lines[index++] = i0;
        lines[index++] = i1;

        lines[index++] = i1;
        lines[index++] = i2;

        lines[index++] = i2;
        lines[index] = i0;
    }

    function trianglesToLines(triangles) {
        var count = triangles.length;
        var size = (count / 3) * 6;
        var lines = IndexDatatype.IndexDatatype.createTypedArray(count, size);

        var index = 0;
        for ( var i = 0; i < count; i += 3, index += 6) {
            addTriangle(lines, index, triangles[i], triangles[i + 1], triangles[i + 2]);
        }

        return lines;
    }

    function triangleStripToLines(triangles) {
        var count = triangles.length;
        if (count >= 3) {
            var size = (count - 2) * 6;
            var lines = IndexDatatype.IndexDatatype.createTypedArray(count, size);

            addTriangle(lines, 0, triangles[0], triangles[1], triangles[2]);
            var index = 6;

            for ( var i = 3; i < count; ++i, index += 6) {
                addTriangle(lines, index, triangles[i - 1], triangles[i], triangles[i - 2]);
            }

            return lines;
        }

        return new Uint16Array();
    }

    function triangleFanToLines(triangles) {
        if (triangles.length > 0) {
            var count = triangles.length - 1;
            var size = (count - 1) * 6;
            var lines = IndexDatatype.IndexDatatype.createTypedArray(count, size);

            var base = triangles[0];
            var index = 0;
            for ( var i = 1; i < count; ++i, index += 6) {
                addTriangle(lines, index, base, triangles[i], triangles[i + 1]);
            }

            return lines;
        }

        return new Uint16Array();
    }

    /**
     * Converts a geometry's triangle indices to line indices.  If the geometry has an <code>indices</code>
     * and its <code>primitiveType</code> is <code>TRIANGLES</code>, <code>TRIANGLE_STRIP</code>,
     * <code>TRIANGLE_FAN</code>, it is converted to <code>LINES</code>; otherwise, the geometry is not changed.
     * <p>
     * This is commonly used to create a wireframe geometry for visual debugging.
     * </p>
     *
     * @param {Geometry} geometry The geometry to modify.
     * @returns {Geometry} The modified <code>geometry</code> argument, with its triangle indices converted to lines.
     *
     * @exception {DeveloperError} geometry.primitiveType must be TRIANGLES, TRIANGLE_STRIP, or TRIANGLE_FAN.
     *
     * @example
     * geometry = Cesium.GeometryPipeline.toWireframe(geometry);
     */
    GeometryPipeline.toWireframe = function(geometry) {
        //>>includeStart('debug', pragmas.debug);
        if (!when.defined(geometry)) {
            throw new Check.DeveloperError('geometry is required.');
        }
        //>>includeEnd('debug');

        var indices = geometry.indices;
        if (when.defined(indices)) {
            switch (geometry.primitiveType) {
                case PrimitiveType.PrimitiveType.TRIANGLES:
                    geometry.indices = trianglesToLines(indices);
                    break;
                case PrimitiveType.PrimitiveType.TRIANGLE_STRIP:
                    geometry.indices = triangleStripToLines(indices);
                    break;
                case PrimitiveType.PrimitiveType.TRIANGLE_FAN:
                    geometry.indices = triangleFanToLines(indices);
                    break;
                //>>includeStart('debug', pragmas.debug);
                default:
                    throw new Check.DeveloperError('geometry.primitiveType must be TRIANGLES, TRIANGLE_STRIP, or TRIANGLE_FAN.');
                //>>includeEnd('debug');
            }

            geometry.primitiveType = PrimitiveType.PrimitiveType.LINES;
        }

        return geometry;
    };

    /**
     * Creates a new {@link Geometry} with <code>LINES</code> representing the provided
     * attribute (<code>attributeName</code>) for the provided geometry.  This is used to
     * visualize vector attributes like normals, tangents, and bitangents.
     *
     * @param {Geometry} geometry The <code>Geometry</code> instance with the attribute.
     * @param {String} [attributeName='normal'] The name of the attribute.
     * @param {Number} [length=10000.0] The length of each line segment in meters.  This can be negative to point the vector in the opposite direction.
     * @returns {Geometry} A new <code>Geometry</code> instance with line segments for the vector.
     *
     * @exception {DeveloperError} geometry.attributes must have an attribute with the same name as the attributeName parameter.
     *
     * @example
     * var geometry = Cesium.GeometryPipeline.createLineSegmentsForVectors(instance.geometry, 'bitangent', 100000.0);
     */
    GeometryPipeline.createLineSegmentsForVectors = function(geometry, attributeName, length) {
        attributeName = when.defaultValue(attributeName, 'normal');

        //>>includeStart('debug', pragmas.debug);
        if (!when.defined(geometry)) {
            throw new Check.DeveloperError('geometry is required.');
        }
        if (!when.defined(geometry.attributes.position)) {
            throw new Check.DeveloperError('geometry.attributes.position is required.');
        }
        if (!when.defined(geometry.attributes[attributeName])) {
            throw new Check.DeveloperError('geometry.attributes must have an attribute with the same name as the attributeName parameter, ' + attributeName + '.');
        }
        //>>includeEnd('debug');

        length = when.defaultValue(length, 10000.0);

        var positions = geometry.attributes.position.values;
        var vectors = geometry.attributes[attributeName].values;
        var positionsLength = positions.length;

        var newPositions = new Float64Array(2 * positionsLength);

        var j = 0;
        for (var i = 0; i < positionsLength; i += 3) {
            newPositions[j++] = positions[i];
            newPositions[j++] = positions[i + 1];
            newPositions[j++] = positions[i + 2];

            newPositions[j++] = positions[i] + (vectors[i] * length);
            newPositions[j++] = positions[i + 1] + (vectors[i + 1] * length);
            newPositions[j++] = positions[i + 2] + (vectors[i + 2] * length);
        }

        var newBoundingSphere;
        var bs = geometry.boundingSphere;
        if (when.defined(bs)) {
            newBoundingSphere = new BoundingSphere.BoundingSphere(bs.center, bs.radius + length);
        }

        return new GeometryAttribute.Geometry({
            attributes : {
                position : new GeometryAttribute.GeometryAttribute({
                    componentDatatype : ComponentDatatype.ComponentDatatype.DOUBLE,
                    componentsPerAttribute : 3,
                    values : newPositions
                })
            },
            primitiveType : PrimitiveType.PrimitiveType.LINES,
            boundingSphere : newBoundingSphere
        });
    };

    /**
     * Creates an object that maps attribute names to unique locations (indices)
     * for matching vertex attributes and shader programs.
     *
     * @param {Geometry} geometry The geometry, which is not modified, to create the object for.
     * @returns {Object} An object with attribute name / index pairs.
     *
     * @example
     * var attributeLocations = Cesium.GeometryPipeline.createAttributeLocations(geometry);
     * // Example output
     * // {
     * //   'position' : 0,
     * //   'normal' : 1
     * // }
     */
    GeometryPipeline.createAttributeLocations = function(geometry) {
        //>>includeStart('debug', pragmas.debug);
        if (!when.defined(geometry)) {
            throw new Check.DeveloperError('geometry is required.');
        }
        //>>includeEnd('debug')

        // There can be a WebGL performance hit when attribute 0 is disabled, so
        // assign attribute locations to well-known attributes.
        var semantics = [
            'position',
            'positionHigh',
            'positionLow',

            // From VertexFormat.position - after 2D projection and high-precision encoding
            'position3DHigh',
            'position3DLow',
            'position2DHigh',
            'position2DLow',

            // From Primitive
            'pickColor',

            // From VertexFormat
            'normal',
            'st',
            'tangent',
            'bitangent',

            // For shadow volumes
            'extrudeDirection',

            // From compressing texture coordinates and normals
            'compressedAttributes'
        ];

        var attributes = geometry.attributes;
        var indices = {};
        var j = 0;
        var i;
        var len = semantics.length;

        // Attribute locations for well-known attributes
        for (i = 0; i < len; ++i) {
            var semantic = semantics[i];

            if (when.defined(attributes[semantic])) {
                indices[semantic] = j++;
            }
        }

        // Locations for custom attributes
        for (var name in attributes) {
            if (attributes.hasOwnProperty(name) && (!when.defined(indices[name]))) {
                indices[name] = j++;
            }
        }

        return indices;
    };

    /**
     * Reorders a geometry's attributes and <code>indices</code> to achieve better performance from the GPU's pre-vertex-shader cache.
     *
     * @param {Geometry} geometry The geometry to modify.
     * @returns {Geometry} The modified <code>geometry</code> argument, with its attributes and indices reordered for the GPU's pre-vertex-shader cache.
     *
     * @exception {DeveloperError} Each attribute array in geometry.attributes must have the same number of attributes.
     *
     *
     * @example
     * geometry = Cesium.GeometryPipeline.reorderForPreVertexCache(geometry);
     *
     * @see GeometryPipeline.reorderForPostVertexCache
     */
    GeometryPipeline.reorderForPreVertexCache = function(geometry) {
        //>>includeStart('debug', pragmas.debug);
        if (!when.defined(geometry)) {
            throw new Check.DeveloperError('geometry is required.');
        }
        //>>includeEnd('debug');

        var numVertices = GeometryAttribute.Geometry.computeNumberOfVertices(geometry);

        var indices = geometry.indices;
        if (when.defined(indices)) {
            var indexCrossReferenceOldToNew = new Int32Array(numVertices);
            for ( var i = 0; i < numVertices; i++) {
                indexCrossReferenceOldToNew[i] = -1;
            }

            // Construct cross reference and reorder indices
            var indicesIn = indices;
            var numIndices = indicesIn.length;
            var indicesOut = IndexDatatype.IndexDatatype.createTypedArray(numVertices, numIndices);

            var intoIndicesIn = 0;
            var intoIndicesOut = 0;
            var nextIndex = 0;
            var tempIndex;
            while (intoIndicesIn < numIndices) {
                tempIndex = indexCrossReferenceOldToNew[indicesIn[intoIndicesIn]];
                if (tempIndex !== -1) {
                    indicesOut[intoIndicesOut] = tempIndex;
                } else {
                    tempIndex = indicesIn[intoIndicesIn];
                    indexCrossReferenceOldToNew[tempIndex] = nextIndex;

                    indicesOut[intoIndicesOut] = nextIndex;
                    ++nextIndex;
                }
                ++intoIndicesIn;
                ++intoIndicesOut;
            }
            geometry.indices = indicesOut;

            // Reorder attributes
            var attributes = geometry.attributes;
            for ( var property in attributes) {
                if (attributes.hasOwnProperty(property) &&
                        when.defined(attributes[property]) &&
                        when.defined(attributes[property].values)) {

                    var attribute = attributes[property];
                    var elementsIn = attribute.values;
                    var intoElementsIn = 0;
                    var numComponents = attribute.componentsPerAttribute;
                    var elementsOut = ComponentDatatype.ComponentDatatype.createTypedArray(attribute.componentDatatype, nextIndex * numComponents);
                    while (intoElementsIn < numVertices) {
                        var temp = indexCrossReferenceOldToNew[intoElementsIn];
                        if (temp !== -1) {
                            for (var j = 0; j < numComponents; j++) {
                                elementsOut[numComponents * temp + j] = elementsIn[numComponents * intoElementsIn + j];
                            }
                        }
                        ++intoElementsIn;
                    }
                    attribute.values = elementsOut;
                }
            }
        }

        return geometry;
    };

    /**
     * Reorders a geometry's <code>indices</code> to achieve better performance from the GPU's
     * post vertex-shader cache by using the Tipsify algorithm.  If the geometry <code>primitiveType</code>
     * is not <code>TRIANGLES</code> or the geometry does not have an <code>indices</code>, this function has no effect.
     *
     * @param {Geometry} geometry The geometry to modify.
     * @param {Number} [cacheCapacity=24] The number of vertices that can be held in the GPU's vertex cache.
     * @returns {Geometry} The modified <code>geometry</code> argument, with its indices reordered for the post-vertex-shader cache.
     *
     * @exception {DeveloperError} cacheCapacity must be greater than two.
     *
     *
     * @example
     * geometry = Cesium.GeometryPipeline.reorderForPostVertexCache(geometry);
     *
     * @see GeometryPipeline.reorderForPreVertexCache
     * @see {@link http://gfx.cs.princ0eton.edu/pubs/Sander_2007_%3ETR/tipsy.pdf|Fast Triangle Reordering for Vertex Locality and Reduced Overdraw}
     * by Sander, Nehab, and Barczak
     */
    GeometryPipeline.reorderForPostVertexCache = function(geometry, cacheCapacity) {
        //>>includeStart('debug', pragmas.debug);
        if (!when.defined(geometry)) {
            throw new Check.DeveloperError('geometry is required.');
        }
        //>>includeEnd('debug');

        var indices = geometry.indices;
        if ((geometry.primitiveType === PrimitiveType.PrimitiveType.TRIANGLES) && (when.defined(indices))) {
            var numIndices = indices.length;
            var maximumIndex = 0;
            for ( var j = 0; j < numIndices; j++) {
                if (indices[j] > maximumIndex) {
                    maximumIndex = indices[j];
                }
            }
            geometry.indices = Tipsify.tipsify({
                indices : indices,
                maximumIndex : maximumIndex,
                cacheSize : cacheCapacity
            });
        }

        return geometry;
    };

    function copyAttributesDescriptions(attributes) {
        var newAttributes = {};

        for ( var attribute in attributes) {
            if (attributes.hasOwnProperty(attribute) &&
                    when.defined(attributes[attribute]) &&
                    when.defined(attributes[attribute].values)) {

                var attr = attributes[attribute];
                newAttributes[attribute] = new GeometryAttribute.GeometryAttribute({
                    componentDatatype : attr.componentDatatype,
                    componentsPerAttribute : attr.componentsPerAttribute,
                    normalize : attr.normalize,
                    values : []
                });
            }
        }

        return newAttributes;
    }

    function copyVertex(destinationAttributes, sourceAttributes, index) {
        for ( var attribute in sourceAttributes) {
            if (sourceAttributes.hasOwnProperty(attribute) &&
                    when.defined(sourceAttributes[attribute]) &&
                    when.defined(sourceAttributes[attribute].values)) {

                var attr = sourceAttributes[attribute];

                for ( var k = 0; k < attr.componentsPerAttribute; ++k) {
                    destinationAttributes[attribute].values.push(attr.values[(index * attr.componentsPerAttribute) + k]);
                }
            }
        }
    }

    /**
     * Splits a geometry into multiple geometries, if necessary, to ensure that indices in the
     * <code>indices</code> fit into unsigned shorts.  This is used to meet the WebGL requirements
     * when unsigned int indices are not supported.
     * <p>
     * If the geometry does not have any <code>indices</code>, this function has no effect.
     * </p>
     *
     * @param {Geometry} geometry The geometry to be split into multiple geometries.
     * @returns {Geometry[]} An array of geometries, each with indices that fit into unsigned shorts.
     *
     * @exception {DeveloperError} geometry.primitiveType must equal to PrimitiveType.TRIANGLES, PrimitiveType.LINES, or PrimitiveType.POINTS
     * @exception {DeveloperError} All geometry attribute lists must have the same number of attributes.
     *
     * @example
     * var geometries = Cesium.GeometryPipeline.fitToUnsignedShortIndices(geometry);
     */
    GeometryPipeline.fitToUnsignedShortIndices = function(geometry) {
        //>>includeStart('debug', pragmas.debug);
        if (!when.defined(geometry)) {
            throw new Check.DeveloperError('geometry is required.');
        }
        if ((when.defined(geometry.indices)) &&
            ((geometry.primitiveType !== PrimitiveType.PrimitiveType.TRIANGLES) &&
             (geometry.primitiveType !== PrimitiveType.PrimitiveType.LINES) &&
             (geometry.primitiveType !== PrimitiveType.PrimitiveType.POINTS))) {
            throw new Check.DeveloperError('geometry.primitiveType must equal to PrimitiveType.TRIANGLES, PrimitiveType.LINES, or PrimitiveType.POINTS.');
        }
        //>>includeEnd('debug');

        var geometries = [];

        // If there's an index list and more than 64K attributes, it is possible that
        // some indices are outside the range of unsigned short [0, 64K - 1]
        var numberOfVertices = GeometryAttribute.Geometry.computeNumberOfVertices(geometry);
        if (when.defined(geometry.indices) && (numberOfVertices >= _Math.CesiumMath.SIXTY_FOUR_KILOBYTES)) {
            var oldToNewIndex = [];
            var newIndices = [];
            var currentIndex = 0;
            var newAttributes = copyAttributesDescriptions(geometry.attributes);

            var originalIndices = geometry.indices;
            var numberOfIndices = originalIndices.length;

            var indicesPerPrimitive;

            if (geometry.primitiveType === PrimitiveType.PrimitiveType.TRIANGLES) {
                indicesPerPrimitive = 3;
            } else if (geometry.primitiveType === PrimitiveType.PrimitiveType.LINES) {
                indicesPerPrimitive = 2;
            } else if (geometry.primitiveType === PrimitiveType.PrimitiveType.POINTS) {
                indicesPerPrimitive = 1;
            }

            for ( var j = 0; j < numberOfIndices; j += indicesPerPrimitive) {
                for (var k = 0; k < indicesPerPrimitive; ++k) {
                    var x = originalIndices[j + k];
                    var i = oldToNewIndex[x];
                    if (!when.defined(i)) {
                        i = currentIndex++;
                        oldToNewIndex[x] = i;
                        copyVertex(newAttributes, geometry.attributes, x);
                    }
                    newIndices.push(i);
                }

                if (currentIndex + indicesPerPrimitive >= _Math.CesiumMath.SIXTY_FOUR_KILOBYTES) {
                    geometries.push(new GeometryAttribute.Geometry({
                        attributes : newAttributes,
                        indices : newIndices,
                        primitiveType : geometry.primitiveType,
                        boundingSphere : geometry.boundingSphere,
                        boundingSphereCV : geometry.boundingSphereCV
                    }));

                    // Reset for next vertex-array
                    oldToNewIndex = [];
                    newIndices = [];
                    currentIndex = 0;
                    newAttributes = copyAttributesDescriptions(geometry.attributes);
                }
            }

            if (newIndices.length !== 0) {
                geometries.push(new GeometryAttribute.Geometry({
                    attributes : newAttributes,
                    indices : newIndices,
                    primitiveType : geometry.primitiveType,
                    boundingSphere : geometry.boundingSphere,
                    boundingSphereCV : geometry.boundingSphereCV
                }));
            }
        } else {
            // No need to split into multiple geometries
            geometries.push(geometry);
        }

        return geometries;
    };

    var scratchProjectTo2DCartesian3 = new Cartographic.Cartesian3();
    var scratchProjectTo2DCartographic = new Cartographic.Cartographic();

    /**
     * Projects a geometry's 3D <code>position</code> attribute to 2D, replacing the <code>position</code>
     * attribute with separate <code>position3D</code> and <code>position2D</code> attributes.
     * <p>
     * If the geometry does not have a <code>position</code>, this function has no effect.
     * </p>
     *
     * @param {Geometry} geometry The geometry to modify.
     * @param {String} attributeName The name of the attribute.
     * @param {String} attributeName3D The name of the attribute in 3D.
     * @param {String} attributeName2D The name of the attribute in 2D.
     * @param {Object} [projection=new GeographicProjection()] The projection to use.
     * @returns {Geometry} The modified <code>geometry</code> argument with <code>position3D</code> and <code>position2D</code> attributes.
     *
     * @exception {DeveloperError} geometry must have attribute matching the attributeName argument.
     * @exception {DeveloperError} The attribute componentDatatype must be ComponentDatatype.DOUBLE.
     * @exception {DeveloperError} Could not project a point to 2D.
     *
     * @example
     * geometry = Cesium.GeometryPipeline.projectTo2D(geometry, 'position', 'position3D', 'position2D');
     */
    GeometryPipeline.projectTo2D = function(geometry, attributeName, attributeName3D, attributeName2D, projection) {
        //>>includeStart('debug', pragmas.debug);
        if (!when.defined(geometry)) {
            throw new Check.DeveloperError('geometry is required.');
        }
        if (!when.defined(attributeName)) {
            throw new Check.DeveloperError('attributeName is required.');
        }
        if (!when.defined(attributeName3D)) {
            throw new Check.DeveloperError('attributeName3D is required.');
        }
        if (!when.defined(attributeName2D)) {
            throw new Check.DeveloperError('attributeName2D is required.');
        }
        if (!when.defined(geometry.attributes[attributeName])) {
            throw new Check.DeveloperError('geometry must have attribute matching the attributeName argument: ' + attributeName + '.');
        }
        if (geometry.attributes[attributeName].componentDatatype !== ComponentDatatype.ComponentDatatype.DOUBLE) {
            throw new Check.DeveloperError('The attribute componentDatatype must be ComponentDatatype.DOUBLE.');
        }
        //>>includeEnd('debug');

        var attribute = geometry.attributes[attributeName];
        projection = (when.defined(projection)) ? projection : new BoundingSphere.GeographicProjection();
        var ellipsoid = projection.ellipsoid;

        // Project original values to 2D.
        var values3D = attribute.values;
        var projectedValues = new Float64Array(values3D.length);
        var index = 0;

        for ( var i = 0; i < values3D.length; i += 3) {
            var value = Cartographic.Cartesian3.fromArray(values3D, i, scratchProjectTo2DCartesian3);

            var lonLat = ellipsoid.cartesianToCartographic(value, scratchProjectTo2DCartographic);
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(lonLat)) {
                throw new Check.DeveloperError('Could not project point (' + value.x + ', ' + value.y + ', ' + value.z + ') to 2D.');
            }
            //>>includeEnd('debug');

            var projectedLonLat = projection.project(lonLat, scratchProjectTo2DCartesian3);

            projectedValues[index++] = projectedLonLat.x;
            projectedValues[index++] = projectedLonLat.y;
            projectedValues[index++] = projectedLonLat.z;
        }

        // Rename original cartesians to WGS84 cartesians.
        geometry.attributes[attributeName3D] = attribute;

        // Replace original cartesians with 2D projected cartesians
        geometry.attributes[attributeName2D] = new GeometryAttribute.GeometryAttribute({
            componentDatatype : ComponentDatatype.ComponentDatatype.DOUBLE,
            componentsPerAttribute : 3,
            values : projectedValues
        });
        delete geometry.attributes[attributeName];

        return geometry;
    };

    var encodedResult = {
        high : 0.0,
        low : 0.0
    };

    /**
     * Encodes floating-point geometry attribute values as two separate attributes to improve
     * rendering precision.
     * <p>
     * This is commonly used to create high-precision position vertex attributes.
     * </p>
     *
     * @param {Geometry} geometry The geometry to modify.
     * @param {String} attributeName The name of the attribute.
     * @param {String} attributeHighName The name of the attribute for the encoded high bits.
     * @param {String} attributeLowName The name of the attribute for the encoded low bits.
     * @returns {Geometry} The modified <code>geometry</code> argument, with its encoded attribute.
     *
     * @exception {DeveloperError} geometry must have attribute matching the attributeName argument.
     * @exception {DeveloperError} The attribute componentDatatype must be ComponentDatatype.DOUBLE.
     *
     * @example
     * geometry = Cesium.GeometryPipeline.encodeAttribute(geometry, 'position3D', 'position3DHigh', 'position3DLow');
     */
    GeometryPipeline.encodeAttribute = function(geometry, attributeName, attributeHighName, attributeLowName) {
        //>>includeStart('debug', pragmas.debug);
        if (!when.defined(geometry)) {
            throw new Check.DeveloperError('geometry is required.');
        }
        if (!when.defined(attributeName)) {
            throw new Check.DeveloperError('attributeName is required.');
        }
        if (!when.defined(attributeHighName)) {
            throw new Check.DeveloperError('attributeHighName is required.');
        }
        if (!when.defined(attributeLowName)) {
            throw new Check.DeveloperError('attributeLowName is required.');
        }
        if (!when.defined(geometry.attributes[attributeName])) {
            throw new Check.DeveloperError('geometry must have attribute matching the attributeName argument: ' + attributeName + '.');
        }
        if (geometry.attributes[attributeName].componentDatatype !== ComponentDatatype.ComponentDatatype.DOUBLE) {
            throw new Check.DeveloperError('The attribute componentDatatype must be ComponentDatatype.DOUBLE.');
        }
        //>>includeEnd('debug');

        var attribute = geometry.attributes[attributeName];
        var values = attribute.values;
        var length = values.length;
        var highValues = new Float32Array(length);
        var lowValues = new Float32Array(length);

        for (var i = 0; i < length; ++i) {
            EncodedCartesian3.EncodedCartesian3.encode(values[i], encodedResult);
            highValues[i] = encodedResult.high;
            lowValues[i] = encodedResult.low;
        }

        var componentsPerAttribute = attribute.componentsPerAttribute;

        geometry.attributes[attributeHighName] = new GeometryAttribute.GeometryAttribute({
            componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
            componentsPerAttribute : componentsPerAttribute,
            values : highValues
        });
        geometry.attributes[attributeLowName] = new GeometryAttribute.GeometryAttribute({
            componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
            componentsPerAttribute : componentsPerAttribute,
            values : lowValues
        });
        delete geometry.attributes[attributeName];

        return geometry;
    };

    var scratchCartesian3$1 = new Cartographic.Cartesian3();

    function transformPoint(matrix, attribute) {
        if (when.defined(attribute)) {
            var values = attribute.values;
            var length = values.length;
            for (var i = 0; i < length; i += 3) {
                Cartographic.Cartesian3.unpack(values, i, scratchCartesian3$1);
                BoundingSphere.Matrix4.multiplyByPoint(matrix, scratchCartesian3$1, scratchCartesian3$1);
                Cartographic.Cartesian3.pack(scratchCartesian3$1, values, i);
            }
        }
    }

    function transformVector(matrix, attribute) {
        if (when.defined(attribute)) {
            var values = attribute.values;
            var length = values.length;
            for (var i = 0; i < length; i += 3) {
                Cartographic.Cartesian3.unpack(values, i, scratchCartesian3$1);
                BoundingSphere.Matrix3.multiplyByVector(matrix, scratchCartesian3$1, scratchCartesian3$1);
                scratchCartesian3$1 = Cartographic.Cartesian3.normalize(scratchCartesian3$1, scratchCartesian3$1);
                Cartographic.Cartesian3.pack(scratchCartesian3$1, values, i);
            }
        }
    }

    var inverseTranspose = new BoundingSphere.Matrix4();
    var normalMatrix = new BoundingSphere.Matrix3();

    /**
     * Transforms a geometry instance to world coordinates.  This changes
     * the instance's <code>modelMatrix</code> to {@link Matrix4.IDENTITY} and transforms the
     * following attributes if they are present: <code>position</code>, <code>normal</code>,
     * <code>tangent</code>, and <code>bitangent</code>.
     *
     * @param {GeometryInstance} instance The geometry instance to modify.
     * @returns {GeometryInstance} The modified <code>instance</code> argument, with its attributes transforms to world coordinates.
     *
     * @example
     * Cesium.GeometryPipeline.transformToWorldCoordinates(instance);
     */
    GeometryPipeline.transformToWorldCoordinates = function(instance) {
        //>>includeStart('debug', pragmas.debug);
        if (!when.defined(instance)) {
            throw new Check.DeveloperError('instance is required.');
        }
        //>>includeEnd('debug');

        var modelMatrix = instance.modelMatrix;

        if (BoundingSphere.Matrix4.equals(modelMatrix, BoundingSphere.Matrix4.IDENTITY)) {
            // Already in world coordinates
            return instance;
        }

        var attributes = instance.geometry.attributes;

        // Transform attributes in known vertex formats
        transformPoint(modelMatrix, attributes.position);
        transformPoint(modelMatrix, attributes.prevPosition);
        transformPoint(modelMatrix, attributes.nextPosition);

        if ((when.defined(attributes.normal)) ||
            (when.defined(attributes.tangent)) ||
            (when.defined(attributes.bitangent))) {

            BoundingSphere.Matrix4.inverse(modelMatrix, inverseTranspose);
            BoundingSphere.Matrix4.transpose(inverseTranspose, inverseTranspose);
            BoundingSphere.Matrix4.getRotation(inverseTranspose, normalMatrix);

            transformVector(normalMatrix, attributes.normal);
            transformVector(normalMatrix, attributes.tangent);
            transformVector(normalMatrix, attributes.bitangent);
        }

        var boundingSphere = instance.geometry.boundingSphere;
        if (when.defined(boundingSphere)) {
            instance.geometry.boundingSphere = BoundingSphere.BoundingSphere.transform(boundingSphere, modelMatrix, boundingSphere);
        }

        instance.modelMatrix = BoundingSphere.Matrix4.clone(BoundingSphere.Matrix4.IDENTITY);

        return instance;
    };

    function findAttributesInAllGeometries(instances, propertyName) {
        var length = instances.length;

        var attributesInAllGeometries = {};

        var attributes0 = instances[0][propertyName].attributes;
        var name;

        for (name in attributes0) {
            if (attributes0.hasOwnProperty(name) &&
                    when.defined(attributes0[name]) &&
                    when.defined(attributes0[name].values)) {

                var attribute = attributes0[name];
                var numberOfComponents = attribute.values.length;
                var inAllGeometries = true;

                // Does this same attribute exist in all geometries?
                for (var i = 1; i < length; ++i) {
                    var otherAttribute = instances[i][propertyName].attributes[name];

                    if ((!when.defined(otherAttribute)) ||
                        (attribute.componentDatatype !== otherAttribute.componentDatatype) ||
                        (attribute.componentsPerAttribute !== otherAttribute.componentsPerAttribute) ||
                        (attribute.normalize !== otherAttribute.normalize)) {

                        inAllGeometries = false;
                        break;
                    }

                    numberOfComponents += otherAttribute.values.length;
                }

                if (inAllGeometries) {
                    attributesInAllGeometries[name] = new GeometryAttribute.GeometryAttribute({
                        componentDatatype : attribute.componentDatatype,
                        componentsPerAttribute : attribute.componentsPerAttribute,
                        normalize : attribute.normalize,
                        values : ComponentDatatype.ComponentDatatype.createTypedArray(attribute.componentDatatype, numberOfComponents)
                    });
                }
            }
        }

        return attributesInAllGeometries;
    }

    var tempScratch = new Cartographic.Cartesian3();

    function combineGeometries(instances, propertyName) {
        var length = instances.length;

        var name;
        var i;
        var j;
        var k;

        var m = instances[0].modelMatrix;
        var haveIndices = (when.defined(instances[0][propertyName].indices));
        var primitiveType = instances[0][propertyName].primitiveType;

        //>>includeStart('debug', pragmas.debug);
        for (i = 1; i < length; ++i) {
            if (!BoundingSphere.Matrix4.equals(instances[i].modelMatrix, m)) {
                throw new Check.DeveloperError('All instances must have the same modelMatrix.');
            }
            if ((when.defined(instances[i][propertyName].indices)) !== haveIndices) {
                throw new Check.DeveloperError('All instance geometries must have an indices or not have one.');
            }
            if (instances[i][propertyName].primitiveType !== primitiveType) {
                throw new Check.DeveloperError('All instance geometries must have the same primitiveType.');
            }
        }
        //>>includeEnd('debug');

        // Find subset of attributes in all geometries
        var attributes = findAttributesInAllGeometries(instances, propertyName);
        var values;
        var sourceValues;
        var sourceValuesLength;

        // Combine attributes from each geometry into a single typed array
        for (name in attributes) {
            if (attributes.hasOwnProperty(name)) {
                values = attributes[name].values;

                k = 0;
                for (i = 0; i < length; ++i) {
                    sourceValues = instances[i][propertyName].attributes[name].values;
                    sourceValuesLength = sourceValues.length;

                    for (j = 0; j < sourceValuesLength; ++j) {
                        values[k++] = sourceValues[j];
                    }
                }
            }
        }

        // Combine index lists
        var indices;

        if (haveIndices) {
            var numberOfIndices = 0;
            for (i = 0; i < length; ++i) {
                numberOfIndices += instances[i][propertyName].indices.length;
            }

            var numberOfVertices = GeometryAttribute.Geometry.computeNumberOfVertices(new GeometryAttribute.Geometry({
                attributes : attributes,
                primitiveType : PrimitiveType.PrimitiveType.POINTS
            }));
            var destIndices = IndexDatatype.IndexDatatype.createTypedArray(numberOfVertices, numberOfIndices);

            var destOffset = 0;
            var offset = 0;

            for (i = 0; i < length; ++i) {
                var sourceIndices = instances[i][propertyName].indices;
                var sourceIndicesLen = sourceIndices.length;

                for (k = 0; k < sourceIndicesLen; ++k) {
                    destIndices[destOffset++] = offset + sourceIndices[k];
                }

                offset += GeometryAttribute.Geometry.computeNumberOfVertices(instances[i][propertyName]);
            }

            indices = destIndices;
        }

        // Create bounding sphere that includes all instances
        var center = new Cartographic.Cartesian3();
        var radius = 0.0;
        var bs;

        for (i = 0; i < length; ++i) {
            bs = instances[i][propertyName].boundingSphere;
            if (!when.defined(bs)) {
                // If any geometries have an undefined bounding sphere, then so does the combined geometry
                center = undefined;
                break;
            }

            Cartographic.Cartesian3.add(bs.center, center, center);
        }

        if (when.defined(center)) {
            Cartographic.Cartesian3.divideByScalar(center, length, center);

            for (i = 0; i < length; ++i) {
                bs = instances[i][propertyName].boundingSphere;
                var tempRadius = Cartographic.Cartesian3.magnitude(Cartographic.Cartesian3.subtract(bs.center, center, tempScratch)) + bs.radius;

                if (tempRadius > radius) {
                    radius = tempRadius;
                }
            }
        }

        return new GeometryAttribute.Geometry({
            attributes : attributes,
            indices : indices,
            primitiveType : primitiveType,
            boundingSphere : (when.defined(center)) ? new BoundingSphere.BoundingSphere(center, radius) : undefined
        });
    }

    /**
     * Combines geometry from several {@link GeometryInstance} objects into one geometry.
     * This concatenates the attributes, concatenates and adjusts the indices, and creates
     * a bounding sphere encompassing all instances.
     * <p>
     * If the instances do not have the same attributes, a subset of attributes common
     * to all instances is used, and the others are ignored.
     * </p>
     * <p>
     * This is used by {@link Primitive} to efficiently render a large amount of static data.
     * </p>
     *
     * @private
     *
     * @param {GeometryInstance[]} [instances] The array of {@link GeometryInstance} objects whose geometry will be combined.
     * @returns {Geometry} A single geometry created from the provided geometry instances.
     *
     * @exception {DeveloperError} All instances must have the same modelMatrix.
     * @exception {DeveloperError} All instance geometries must have an indices or not have one.
     * @exception {DeveloperError} All instance geometries must have the same primitiveType.
     *
     *
     * @example
     * for (var i = 0; i < instances.length; ++i) {
     *   Cesium.GeometryPipeline.transformToWorldCoordinates(instances[i]);
     * }
     * var geometries = Cesium.GeometryPipeline.combineInstances(instances);
     *
     * @see GeometryPipeline.transformToWorldCoordinates
     */
    GeometryPipeline.combineInstances = function(instances) {
        //>>includeStart('debug', pragmas.debug);
        if ((!when.defined(instances)) || (instances.length < 1)) {
            throw new Check.DeveloperError('instances is required and must have length greater than zero.');
        }
        //>>includeEnd('debug');

        var instanceGeometry = [];
        var instanceSplitGeometry = [];
        var length = instances.length;
        for (var i = 0; i < length; ++i) {
            var instance = instances[i];

            if (when.defined(instance.geometry)) {
                instanceGeometry.push(instance);
            } else if (when.defined(instance.westHemisphereGeometry) && when.defined(instance.eastHemisphereGeometry)) {
                instanceSplitGeometry.push(instance);
            }
        }

        var geometries = [];
        if (instanceGeometry.length > 0) {
            geometries.push(combineGeometries(instanceGeometry, 'geometry'));
        }

        if (instanceSplitGeometry.length > 0) {
            geometries.push(combineGeometries(instanceSplitGeometry, 'westHemisphereGeometry'));
            geometries.push(combineGeometries(instanceSplitGeometry, 'eastHemisphereGeometry'));
        }

        return geometries;
    };

    var normal = new Cartographic.Cartesian3();
    var v0 = new Cartographic.Cartesian3();
    var v1 = new Cartographic.Cartesian3();
    var v2 = new Cartographic.Cartesian3();

    /**
     * Computes per-vertex normals for a geometry containing <code>TRIANGLES</code> by averaging the normals of
     * all triangles incident to the vertex.  The result is a new <code>normal</code> attribute added to the geometry.
     * This assumes a counter-clockwise winding order.
     *
     * @param {Geometry} geometry The geometry to modify.
     * @returns {Geometry} The modified <code>geometry</code> argument with the computed <code>normal</code> attribute.
     *
     * @exception {DeveloperError} geometry.indices length must be greater than 0 and be a multiple of 3.
     * @exception {DeveloperError} geometry.primitiveType must be {@link PrimitiveType.TRIANGLES}.
     *
     * @example
     * Cesium.GeometryPipeline.computeNormal(geometry);
     */
    GeometryPipeline.computeNormal = function(geometry) {
        //>>includeStart('debug', pragmas.debug);
        if (!when.defined(geometry)) {
            throw new Check.DeveloperError('geometry is required.');
        }
        if (!when.defined(geometry.attributes.position) || !when.defined(geometry.attributes.position.values)) {
            throw new Check.DeveloperError('geometry.attributes.position.values is required.');
        }
        if (!when.defined(geometry.indices)) {
            throw new Check.DeveloperError('geometry.indices is required.');
        }
        if (geometry.indices.length < 2 || geometry.indices.length % 3 !== 0) {
            throw new Check.DeveloperError('geometry.indices length must be greater than 0 and be a multiple of 3.');
        }
        if (geometry.primitiveType !== PrimitiveType.PrimitiveType.TRIANGLES) {
            throw new Check.DeveloperError('geometry.primitiveType must be PrimitiveType.TRIANGLES.');
        }
        //>>includeEnd('debug');

        var indices = geometry.indices;
        var attributes = geometry.attributes;
        var vertices = attributes.position.values;
        var numVertices = attributes.position.values.length / 3;
        var numIndices = indices.length;
        var normalsPerVertex = new Array(numVertices);
        var normalsPerTriangle = new Array(numIndices / 3);
        var normalIndices = new Array(numIndices);
        var i;
        for ( i = 0; i < numVertices; i++) {
            normalsPerVertex[i] = {
                indexOffset : 0,
                count : 0,
                currentCount : 0
            };
        }

        var j = 0;
        for (i = 0; i < numIndices; i += 3) {
            var i0 = indices[i];
            var i1 = indices[i + 1];
            var i2 = indices[i + 2];
            var i03 = i0 * 3;
            var i13 = i1 * 3;
            var i23 = i2 * 3;

            v0.x = vertices[i03];
            v0.y = vertices[i03 + 1];
            v0.z = vertices[i03 + 2];
            v1.x = vertices[i13];
            v1.y = vertices[i13 + 1];
            v1.z = vertices[i13 + 2];
            v2.x = vertices[i23];
            v2.y = vertices[i23 + 1];
            v2.z = vertices[i23 + 2];

            normalsPerVertex[i0].count++;
            normalsPerVertex[i1].count++;
            normalsPerVertex[i2].count++;

            Cartographic.Cartesian3.subtract(v1, v0, v1);
            Cartographic.Cartesian3.subtract(v2, v0, v2);
            normalsPerTriangle[j] = Cartographic.Cartesian3.cross(v1, v2, new Cartographic.Cartesian3());
            j++;
        }

        var indexOffset = 0;
        for (i = 0; i < numVertices; i++) {
            normalsPerVertex[i].indexOffset += indexOffset;
            indexOffset += normalsPerVertex[i].count;
        }

        j = 0;
        var vertexNormalData;
        for (i = 0; i < numIndices; i += 3) {
            vertexNormalData = normalsPerVertex[indices[i]];
            var index = vertexNormalData.indexOffset + vertexNormalData.currentCount;
            normalIndices[index] = j;
            vertexNormalData.currentCount++;

            vertexNormalData = normalsPerVertex[indices[i + 1]];
            index = vertexNormalData.indexOffset + vertexNormalData.currentCount;
            normalIndices[index] = j;
            vertexNormalData.currentCount++;

            vertexNormalData = normalsPerVertex[indices[i + 2]];
            index = vertexNormalData.indexOffset + vertexNormalData.currentCount;
            normalIndices[index] = j;
            vertexNormalData.currentCount++;

            j++;
        }

        var normalValues = new Float32Array(numVertices * 3);
        for (i = 0; i < numVertices; i++) {
            var i3 = i * 3;
            vertexNormalData = normalsPerVertex[i];
            Cartographic.Cartesian3.clone(Cartographic.Cartesian3.ZERO, normal);
            if (vertexNormalData.count > 0) {
                for (j = 0; j < vertexNormalData.count; j++) {
                    Cartographic.Cartesian3.add(normal, normalsPerTriangle[normalIndices[vertexNormalData.indexOffset + j]], normal);
                }

                // We can run into an issue where a vertex is used with 2 primitives that have opposite winding order.
                if (Cartographic.Cartesian3.equalsEpsilon(Cartographic.Cartesian3.ZERO, normal, _Math.CesiumMath.EPSILON10)) {
                    Cartographic.Cartesian3.clone(normalsPerTriangle[normalIndices[vertexNormalData.indexOffset]], normal);
                }
            }

            // We end up with a zero vector probably because of a degenerate triangle
            if (Cartographic.Cartesian3.equalsEpsilon(Cartographic.Cartesian3.ZERO, normal, _Math.CesiumMath.EPSILON10)) {
                // Default to (0,0,1)
                normal.z = 1.0;
            }

            Cartographic.Cartesian3.normalize(normal, normal);
            normalValues[i3] = normal.x;
            normalValues[i3 + 1] = normal.y;
            normalValues[i3 + 2] = normal.z;
        }

        geometry.attributes.normal = new GeometryAttribute.GeometryAttribute({
            componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
            componentsPerAttribute : 3,
            values : normalValues
        });

        return geometry;
    };

    var normalScratch = new Cartographic.Cartesian3();
    var normalScale = new Cartographic.Cartesian3();
    var tScratch = new Cartographic.Cartesian3();

    /**
     * Computes per-vertex tangents and bitangents for a geometry containing <code>TRIANGLES</code>.
     * The result is new <code>tangent</code> and <code>bitangent</code> attributes added to the geometry.
     * This assumes a counter-clockwise winding order.
     * <p>
     * Based on <a href="http://www.terathon.com/code/tangent.html">Computing Tangent Space Basis Vectors
     * for an Arbitrary Mesh</a> by Eric Lengyel.
     * </p>
     *
     * @param {Geometry} geometry The geometry to modify.
     * @returns {Geometry} The modified <code>geometry</code> argument with the computed <code>tangent</code> and <code>bitangent</code> attributes.
     *
     * @exception {DeveloperError} geometry.indices length must be greater than 0 and be a multiple of 3.
     * @exception {DeveloperError} geometry.primitiveType must be {@link PrimitiveType.TRIANGLES}.
     *
     * @example
     * Cesium.GeometryPipeline.computeTangentAndBiTangent(geometry);
     */
    GeometryPipeline.computeTangentAndBitangent = function(geometry) {
        //>>includeStart('debug', pragmas.debug);
        if (!when.defined(geometry)) {
            throw new Check.DeveloperError('geometry is required.');
        }
        //>>includeEnd('debug');

        var attributes = geometry.attributes;
        var indices = geometry.indices;

        //>>includeStart('debug', pragmas.debug);
        if (!when.defined(attributes.position) || !when.defined(attributes.position.values)) {
            throw new Check.DeveloperError('geometry.attributes.position.values is required.');
        }
        if (!when.defined(attributes.normal) || !when.defined(attributes.normal.values)) {
            throw new Check.DeveloperError('geometry.attributes.normal.values is required.');
        }
        if (!when.defined(attributes.st) || !when.defined(attributes.st.values)) {
            throw new Check.DeveloperError('geometry.attributes.st.values is required.');
        }
        if (!when.defined(indices)) {
            throw new Check.DeveloperError('geometry.indices is required.');
        }
        if (indices.length < 2 || indices.length % 3 !== 0) {
            throw new Check.DeveloperError('geometry.indices length must be greater than 0 and be a multiple of 3.');
        }
        if (geometry.primitiveType !== PrimitiveType.PrimitiveType.TRIANGLES) {
            throw new Check.DeveloperError('geometry.primitiveType must be PrimitiveType.TRIANGLES.');
        }
        //>>includeEnd('debug');

        var vertices = geometry.attributes.position.values;
        var normals = geometry.attributes.normal.values;
        var st = geometry.attributes.st.values;

        var numVertices = geometry.attributes.position.values.length / 3;
        var numIndices = indices.length;
        var tan1 = new Array(numVertices * 3);

        var i;
        for ( i = 0; i < tan1.length; i++) {
            tan1[i] = 0;
        }

        var i03;
        var i13;
        var i23;
        for (i = 0; i < numIndices; i += 3) {
            var i0 = indices[i];
            var i1 = indices[i + 1];
            var i2 = indices[i + 2];
            i03 = i0 * 3;
            i13 = i1 * 3;
            i23 = i2 * 3;
            var i02 = i0 * 2;
            var i12 = i1 * 2;
            var i22 = i2 * 2;

            var ux = vertices[i03];
            var uy = vertices[i03 + 1];
            var uz = vertices[i03 + 2];

            var wx = st[i02];
            var wy = st[i02 + 1];
            var t1 = st[i12 + 1] - wy;
            var t2 = st[i22 + 1] - wy;

            var r = 1.0 / ((st[i12] - wx) * t2 - (st[i22] - wx) * t1);
            var sdirx = (t2 * (vertices[i13] - ux) - t1 * (vertices[i23] - ux)) * r;
            var sdiry = (t2 * (vertices[i13 + 1] - uy) - t1 * (vertices[i23 + 1] - uy)) * r;
            var sdirz = (t2 * (vertices[i13 + 2] - uz) - t1 * (vertices[i23 + 2] - uz)) * r;

            tan1[i03] += sdirx;
            tan1[i03 + 1] += sdiry;
            tan1[i03 + 2] += sdirz;

            tan1[i13] += sdirx;
            tan1[i13 + 1] += sdiry;
            tan1[i13 + 2] += sdirz;

            tan1[i23] += sdirx;
            tan1[i23 + 1] += sdiry;
            tan1[i23 + 2] += sdirz;
        }

        var tangentValues = new Float32Array(numVertices * 3);
        var bitangentValues = new Float32Array(numVertices * 3);

        for (i = 0; i < numVertices; i++) {
            i03 = i * 3;
            i13 = i03 + 1;
            i23 = i03 + 2;

            var n = Cartographic.Cartesian3.fromArray(normals, i03, normalScratch);
            var t = Cartographic.Cartesian3.fromArray(tan1, i03, tScratch);
            var scalar = Cartographic.Cartesian3.dot(n, t);
            Cartographic.Cartesian3.multiplyByScalar(n, scalar, normalScale);
            Cartographic.Cartesian3.normalize(Cartographic.Cartesian3.subtract(t, normalScale, t), t);

            tangentValues[i03] = t.x;
            tangentValues[i13] = t.y;
            tangentValues[i23] = t.z;

            Cartographic.Cartesian3.normalize(Cartographic.Cartesian3.cross(n, t, t), t);

            bitangentValues[i03] = t.x;
            bitangentValues[i13] = t.y;
            bitangentValues[i23] = t.z;
        }

        geometry.attributes.tangent = new GeometryAttribute.GeometryAttribute({
            componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
            componentsPerAttribute : 3,
            values : tangentValues
        });

        geometry.attributes.bitangent = new GeometryAttribute.GeometryAttribute({
            componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
            componentsPerAttribute : 3,
            values : bitangentValues
        });

        return geometry;
    };

    var scratchCartesian2$1 = new Cartesian2.Cartesian2();
    var toEncode1 = new Cartographic.Cartesian3();
    var toEncode2 = new Cartographic.Cartesian3();
    var toEncode3 = new Cartographic.Cartesian3();
    var encodeResult2 = new Cartesian2.Cartesian2();
    /**
     * Compresses and packs geometry normal attribute values to save memory.
     *
     * @param {Geometry} geometry The geometry to modify.
     * @returns {Geometry} The modified <code>geometry</code> argument, with its normals compressed and packed.
     *
     * @example
     * geometry = Cesium.GeometryPipeline.compressVertices(geometry);
     */
    GeometryPipeline.compressVertices = function(geometry) {
        //>>includeStart('debug', pragmas.debug);
        if (!when.defined(geometry)) {
            throw new Check.DeveloperError('geometry is required.');
        }
        //>>includeEnd('debug');

        var extrudeAttribute = geometry.attributes.extrudeDirection;
        var i;
        var numVertices;
        if (when.defined(extrudeAttribute)) {
            //only shadow volumes use extrudeDirection, and shadow volumes use vertexFormat: POSITION_ONLY so we don't need to check other attributes
            var extrudeDirections = extrudeAttribute.values;
            numVertices = extrudeDirections.length / 3.0;
            var compressedDirections = new Float32Array(numVertices * 2);

            var i2 = 0;
            for (i = 0; i < numVertices; ++i) {
                Cartographic.Cartesian3.fromArray(extrudeDirections, i * 3.0, toEncode1);
                if (Cartographic.Cartesian3.equals(toEncode1, Cartographic.Cartesian3.ZERO)) {
                    i2 += 2;
                    continue;
                }
                encodeResult2 = AttributeCompression.AttributeCompression.octEncodeInRange(toEncode1, 65535, encodeResult2);
                compressedDirections[i2++] = encodeResult2.x;
                compressedDirections[i2++] = encodeResult2.y;
            }

            geometry.attributes.compressedAttributes = new GeometryAttribute.GeometryAttribute({
                componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
                componentsPerAttribute : 2,
                values : compressedDirections
            });
            delete geometry.attributes.extrudeDirection;
            return geometry;
        }

        var normalAttribute = geometry.attributes.normal;
        var stAttribute = geometry.attributes.st;

        var hasNormal = when.defined(normalAttribute);
        var hasSt = when.defined(stAttribute);
        if (!hasNormal && !hasSt) {
            return geometry;
        }

        var tangentAttribute = geometry.attributes.tangent;
        var bitangentAttribute = geometry.attributes.bitangent;

        var hasTangent = when.defined(tangentAttribute);
        var hasBitangent = when.defined(bitangentAttribute);

        var normals;
        var st;
        var tangents;
        var bitangents;

        if (hasNormal) {
            normals = normalAttribute.values;
        }
        if (hasSt) {
            st = stAttribute.values;
        }
        if (hasTangent) {
            tangents = tangentAttribute.values;
        }
        if (hasBitangent) {
            bitangents = bitangentAttribute.values;
        }

        var length = hasNormal ? normals.length : st.length;
        var numComponents = hasNormal ? 3.0 : 2.0;
        numVertices = length / numComponents;

        var compressedLength = numVertices;
        var numCompressedComponents = hasSt && hasNormal ? 2.0 : 1.0;
        numCompressedComponents += hasTangent || hasBitangent ? 1.0 : 0.0;
        compressedLength *= numCompressedComponents;

        var compressedAttributes = new Float32Array(compressedLength);

        var normalIndex = 0;
        for (i = 0; i < numVertices; ++i) {
            if (hasSt) {
                Cartesian2.Cartesian2.fromArray(st, i * 2.0, scratchCartesian2$1);
                compressedAttributes[normalIndex++] = AttributeCompression.AttributeCompression.compressTextureCoordinates(scratchCartesian2$1);
            }

            var index = i * 3.0;
            if (hasNormal && when.defined(tangents) && when.defined(bitangents)) {
                Cartographic.Cartesian3.fromArray(normals, index, toEncode1);
                Cartographic.Cartesian3.fromArray(tangents, index, toEncode2);
                Cartographic.Cartesian3.fromArray(bitangents, index, toEncode3);

                AttributeCompression.AttributeCompression.octPack(toEncode1, toEncode2, toEncode3, scratchCartesian2$1);
                compressedAttributes[normalIndex++] = scratchCartesian2$1.x;
                compressedAttributes[normalIndex++] = scratchCartesian2$1.y;
            } else {
                if (hasNormal) {
                    Cartographic.Cartesian3.fromArray(normals, index, toEncode1);
                    compressedAttributes[normalIndex++] = AttributeCompression.AttributeCompression.octEncodeFloat(toEncode1);
                }

                if (hasTangent) {
                    Cartographic.Cartesian3.fromArray(tangents, index, toEncode1);
                    compressedAttributes[normalIndex++] = AttributeCompression.AttributeCompression.octEncodeFloat(toEncode1);
                }

                if (hasBitangent) {
                    Cartographic.Cartesian3.fromArray(bitangents, index, toEncode1);
                    compressedAttributes[normalIndex++] = AttributeCompression.AttributeCompression.octEncodeFloat(toEncode1);
                }
            }
        }

        geometry.attributes.compressedAttributes = new GeometryAttribute.GeometryAttribute({
            componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
            componentsPerAttribute : numCompressedComponents,
            values : compressedAttributes
        });

        if (hasNormal) {
            delete geometry.attributes.normal;
        }
        if (hasSt) {
            delete geometry.attributes.st;
        }
        if (hasBitangent) {
            delete geometry.attributes.bitangent;
        }
        if (hasTangent) {
            delete geometry.attributes.tangent;
        }

        return geometry;
    };

    function indexTriangles(geometry) {
        if (when.defined(geometry.indices)) {
            return geometry;
        }
        var numberOfVertices = GeometryAttribute.Geometry.computeNumberOfVertices(geometry);

        //>>includeStart('debug', pragmas.debug);
        if (numberOfVertices < 3) {
            throw new Check.DeveloperError('The number of vertices must be at least three.');
        }
        if (numberOfVertices % 3 !== 0) {
            throw new Check.DeveloperError('The number of vertices must be a multiple of three.');
        }
        //>>includeEnd('debug');

        var indices = IndexDatatype.IndexDatatype.createTypedArray(numberOfVertices, numberOfVertices);
        for (var i = 0; i < numberOfVertices; ++i) {
            indices[i] = i;
        }

        geometry.indices = indices;
        return geometry;
    }

    function indexTriangleFan(geometry) {
        var numberOfVertices = GeometryAttribute.Geometry.computeNumberOfVertices(geometry);

        //>>includeStart('debug', pragmas.debug);
        if (numberOfVertices < 3) {
            throw new Check.DeveloperError('The number of vertices must be at least three.');
        }
        //>>includeEnd('debug');

        var indices = IndexDatatype.IndexDatatype.createTypedArray(numberOfVertices, (numberOfVertices - 2) * 3);
        indices[0] = 1;
        indices[1] = 0;
        indices[2] = 2;

        var indicesIndex = 3;
        for (var i = 3; i < numberOfVertices; ++i) {
            indices[indicesIndex++] = i - 1;
            indices[indicesIndex++] = 0;
            indices[indicesIndex++] = i;
        }

        geometry.indices = indices;
        geometry.primitiveType = PrimitiveType.PrimitiveType.TRIANGLES;
        return geometry;
    }

    function indexTriangleStrip(geometry) {
        var numberOfVertices = GeometryAttribute.Geometry.computeNumberOfVertices(geometry);

        //>>includeStart('debug', pragmas.debug);
        if (numberOfVertices < 3) {
            throw new Check.DeveloperError('The number of vertices must be at least 3.');
        }
        //>>includeEnd('debug');

        var indices = IndexDatatype.IndexDatatype.createTypedArray(numberOfVertices, (numberOfVertices - 2) * 3);
        indices[0] = 0;
        indices[1] = 1;
        indices[2] = 2;

        if (numberOfVertices > 3) {
            indices[3] = 0;
            indices[4] = 2;
            indices[5] = 3;
        }

        var indicesIndex = 6;
        for (var i = 3; i < numberOfVertices - 1; i += 2) {
            indices[indicesIndex++] = i;
            indices[indicesIndex++] = i - 1;
            indices[indicesIndex++] = i + 1;

            if (i + 2 < numberOfVertices) {
                indices[indicesIndex++] = i;
                indices[indicesIndex++] = i + 1;
                indices[indicesIndex++] = i + 2;
            }
        }

        geometry.indices = indices;
        geometry.primitiveType = PrimitiveType.PrimitiveType.TRIANGLES;
        return geometry;
    }

    function indexLines(geometry) {
        if (when.defined(geometry.indices)) {
            return geometry;
        }
        var numberOfVertices = GeometryAttribute.Geometry.computeNumberOfVertices(geometry);

        //>>includeStart('debug', pragmas.debug);
        if (numberOfVertices < 2) {
            throw new Check.DeveloperError('The number of vertices must be at least two.');
        }
        if (numberOfVertices % 2 !== 0) {
            throw new Check.DeveloperError('The number of vertices must be a multiple of 2.');
        }
        //>>includeEnd('debug');

        var indices = IndexDatatype.IndexDatatype.createTypedArray(numberOfVertices, numberOfVertices);
        for (var i = 0; i < numberOfVertices; ++i) {
            indices[i] = i;
        }

        geometry.indices = indices;
        return geometry;
    }

    function indexLineStrip(geometry) {
        var numberOfVertices = GeometryAttribute.Geometry.computeNumberOfVertices(geometry);

        //>>includeStart('debug', pragmas.debug);
        if (numberOfVertices < 2) {
            throw new Check.DeveloperError('The number of vertices must be at least two.');
        }
        //>>includeEnd('debug');

        var indices = IndexDatatype.IndexDatatype.createTypedArray(numberOfVertices, (numberOfVertices - 1) * 2);
        indices[0] = 0;
        indices[1] = 1;
        var indicesIndex = 2;
        for (var i = 2; i < numberOfVertices; ++i) {
            indices[indicesIndex++] = i - 1;
            indices[indicesIndex++] = i;
        }

        geometry.indices = indices;
        geometry.primitiveType = PrimitiveType.PrimitiveType.LINES;
        return geometry;
    }

    function indexLineLoop(geometry) {
        var numberOfVertices = GeometryAttribute.Geometry.computeNumberOfVertices(geometry);

        //>>includeStart('debug', pragmas.debug);
        if (numberOfVertices < 2) {
            throw new Check.DeveloperError('The number of vertices must be at least two.');
        }
        //>>includeEnd('debug');

        var indices = IndexDatatype.IndexDatatype.createTypedArray(numberOfVertices, numberOfVertices * 2);

        indices[0] = 0;
        indices[1] = 1;

        var indicesIndex = 2;
        for (var i = 2; i < numberOfVertices; ++i) {
            indices[indicesIndex++] = i - 1;
            indices[indicesIndex++] = i;
        }

        indices[indicesIndex++] = numberOfVertices - 1;
        indices[indicesIndex] = 0;

        geometry.indices = indices;
        geometry.primitiveType = PrimitiveType.PrimitiveType.LINES;
        return geometry;
    }

    function indexPrimitive(geometry) {
        switch (geometry.primitiveType) {
        case PrimitiveType.PrimitiveType.TRIANGLE_FAN:
            return indexTriangleFan(geometry);
        case PrimitiveType.PrimitiveType.TRIANGLE_STRIP:
            return indexTriangleStrip(geometry);
        case PrimitiveType.PrimitiveType.TRIANGLES:
            return indexTriangles(geometry);
        case PrimitiveType.PrimitiveType.LINE_STRIP:
            return indexLineStrip(geometry);
        case PrimitiveType.PrimitiveType.LINE_LOOP:
            return indexLineLoop(geometry);
        case PrimitiveType.PrimitiveType.LINES:
            return indexLines(geometry);
        }

        return geometry;
    }

    function offsetPointFromXZPlane(p, isBehind) {
        if (Math.abs(p.y) < _Math.CesiumMath.EPSILON6){
            if (isBehind) {
                p.y = -_Math.CesiumMath.EPSILON6;
            } else {
                p.y = _Math.CesiumMath.EPSILON6;
            }
        }
    }

    function offsetTriangleFromXZPlane(p0, p1, p2) {
        if (p0.y !== 0.0 && p1.y !== 0.0 && p2.y !== 0.0) {
            offsetPointFromXZPlane(p0, p0.y < 0.0);
            offsetPointFromXZPlane(p1, p1.y < 0.0);
            offsetPointFromXZPlane(p2, p2.y < 0.0);
            return;
        }

        var p0y = Math.abs(p0.y);
        var p1y = Math.abs(p1.y);
        var p2y = Math.abs(p2.y);

        var sign;
        if (p0y > p1y) {
            if (p0y > p2y) {
                sign = _Math.CesiumMath.sign(p0.y);
            } else {
                sign = _Math.CesiumMath.sign(p2.y);
            }
        } else if (p1y > p2y) {
            sign = _Math.CesiumMath.sign(p1.y);
        } else {
            sign = _Math.CesiumMath.sign(p2.y);
        }

        var isBehind = sign < 0.0;
        offsetPointFromXZPlane(p0, isBehind);
        offsetPointFromXZPlane(p1, isBehind);
        offsetPointFromXZPlane(p2, isBehind);
    }

    var c3 = new Cartographic.Cartesian3();
    function getXZIntersectionOffsetPoints(p, p1, u1, v1) {
        Cartographic.Cartesian3.add(p, Cartographic.Cartesian3.multiplyByScalar(Cartographic.Cartesian3.subtract(p1, p, c3), p.y/(p.y-p1.y), c3), u1);
        Cartographic.Cartesian3.clone(u1, v1);
        offsetPointFromXZPlane(u1, true);
        offsetPointFromXZPlane(v1, false);
    }

    var u1 = new Cartographic.Cartesian3();
    var u2 = new Cartographic.Cartesian3();
    var q1 = new Cartographic.Cartesian3();
    var q2 = new Cartographic.Cartesian3();

    var splitTriangleResult = {
        positions : new Array(7),
        indices : new Array(3 * 3)
    };

    function splitTriangle(p0, p1, p2) {
        // In WGS84 coordinates, for a triangle approximately on the
        // ellipsoid to cross the IDL, first it needs to be on the
        // negative side of the plane x = 0.
        if ((p0.x >= 0.0) || (p1.x >= 0.0) || (p2.x >= 0.0)) {
            return undefined;
        }

        offsetTriangleFromXZPlane(p0, p1, p2);

        var p0Behind = p0.y < 0.0;
        var p1Behind = p1.y < 0.0;
        var p2Behind = p2.y < 0.0;

        var numBehind = 0;
        numBehind += p0Behind ? 1 : 0;
        numBehind += p1Behind ? 1 : 0;
        numBehind += p2Behind ? 1 : 0;

        var indices = splitTriangleResult.indices;

        if (numBehind === 1) {
            indices[1] = 3;
            indices[2] = 4;
            indices[5] = 6;
            indices[7] = 6;
            indices[8] = 5;

            if (p0Behind) {
                getXZIntersectionOffsetPoints(p0, p1, u1, q1);
                getXZIntersectionOffsetPoints(p0, p2, u2, q2);

                indices[0] = 0;
                indices[3] = 1;
                indices[4] = 2;
                indices[6] = 1;
            } else if (p1Behind) {
                getXZIntersectionOffsetPoints(p1, p2, u1, q1);
                getXZIntersectionOffsetPoints(p1, p0, u2, q2);

                indices[0] = 1;
                indices[3] = 2;
                indices[4] = 0;
                indices[6] = 2;
            } else if (p2Behind) {
                getXZIntersectionOffsetPoints(p2, p0, u1, q1);
                getXZIntersectionOffsetPoints(p2, p1, u2, q2);

                indices[0] = 2;
                indices[3] = 0;
                indices[4] = 1;
                indices[6] = 0;
            }
        } else if (numBehind === 2) {
            indices[2] = 4;
            indices[4] = 4;
            indices[5] = 3;
            indices[7] = 5;
            indices[8] = 6;

            if (!p0Behind) {
                getXZIntersectionOffsetPoints(p0, p1, u1, q1);
                getXZIntersectionOffsetPoints(p0, p2, u2, q2);

                indices[0] = 1;
                indices[1] = 2;
                indices[3] = 1;
                indices[6] = 0;
            } else if (!p1Behind) {
                getXZIntersectionOffsetPoints(p1, p2, u1, q1);
                getXZIntersectionOffsetPoints(p1, p0, u2, q2);

                indices[0] = 2;
                indices[1] = 0;
                indices[3] = 2;
                indices[6] = 1;
            } else if (!p2Behind) {
                getXZIntersectionOffsetPoints(p2, p0, u1, q1);
                getXZIntersectionOffsetPoints(p2, p1, u2, q2);

                indices[0] = 0;
                indices[1] = 1;
                indices[3] = 0;
                indices[6] = 2;
            }
        }

        var positions = splitTriangleResult.positions;
        positions[0] = p0;
        positions[1] = p1;
        positions[2] = p2;
        positions.length = 3;

        if (numBehind === 1 || numBehind === 2) {
            positions[3] = u1;
            positions[4] = u2;
            positions[5] = q1;
            positions[6] = q2;
            positions.length = 7;
        }

        return splitTriangleResult;
    }

    function updateGeometryAfterSplit(geometry, computeBoundingSphere) {
        var attributes = geometry.attributes;

        if (attributes.position.values.length === 0) {
            return undefined;
        }

        for (var property in attributes) {
            if (attributes.hasOwnProperty(property) &&
                    when.defined(attributes[property]) &&
                    when.defined(attributes[property].values)) {

                var attribute = attributes[property];
                attribute.values = ComponentDatatype.ComponentDatatype.createTypedArray(attribute.componentDatatype, attribute.values);
            }
        }

        var numberOfVertices = GeometryAttribute.Geometry.computeNumberOfVertices(geometry);
        geometry.indices = IndexDatatype.IndexDatatype.createTypedArray(numberOfVertices, geometry.indices);

        if (computeBoundingSphere) {
            geometry.boundingSphere = BoundingSphere.BoundingSphere.fromVertices(attributes.position.values);
        }

        return geometry;
    }

    function copyGeometryForSplit(geometry) {
        var attributes = geometry.attributes;
        var copiedAttributes = {};

        for (var property in attributes) {
            if (attributes.hasOwnProperty(property) &&
                    when.defined(attributes[property]) &&
                    when.defined(attributes[property].values)) {

                var attribute = attributes[property];
                copiedAttributes[property] = new GeometryAttribute.GeometryAttribute({
                    componentDatatype : attribute.componentDatatype,
                    componentsPerAttribute : attribute.componentsPerAttribute,
                    normalize : attribute.normalize,
                    values : []
                });
            }
        }

        return new GeometryAttribute.Geometry({
            attributes : copiedAttributes,
            indices : [],
            primitiveType : geometry.primitiveType
        });
    }

    function updateInstanceAfterSplit(instance, westGeometry, eastGeometry) {
        var computeBoundingSphere = when.defined(instance.geometry.boundingSphere);

        westGeometry = updateGeometryAfterSplit(westGeometry, computeBoundingSphere);
        eastGeometry = updateGeometryAfterSplit(eastGeometry, computeBoundingSphere);

        if (when.defined(eastGeometry) && !when.defined(westGeometry)) {
            instance.geometry = eastGeometry;
        } else if (!when.defined(eastGeometry) && when.defined(westGeometry)) {
            instance.geometry = westGeometry;
        } else {
            instance.westHemisphereGeometry = westGeometry;
            instance.eastHemisphereGeometry = eastGeometry;
            instance.geometry = undefined;
        }
    }

    function generateBarycentricInterpolateFunction(CartesianType, numberOfComponents) {
        var v0Scratch = new CartesianType();
        var v1Scratch = new CartesianType();
        var v2Scratch = new CartesianType();

        return function(i0, i1, i2, coords, sourceValues, currentValues, insertedIndex, normalize) {
            var v0 = CartesianType.fromArray(sourceValues, i0 * numberOfComponents, v0Scratch);
            var v1 = CartesianType.fromArray(sourceValues, i1 * numberOfComponents, v1Scratch);
            var v2 = CartesianType.fromArray(sourceValues, i2 * numberOfComponents, v2Scratch);

            CartesianType.multiplyByScalar(v0, coords.x, v0);
            CartesianType.multiplyByScalar(v1, coords.y, v1);
            CartesianType.multiplyByScalar(v2, coords.z, v2);

            var value = CartesianType.add(v0, v1, v0);
            CartesianType.add(value, v2, value);

            if (normalize) {
                CartesianType.normalize(value, value);
            }

            CartesianType.pack(value, currentValues, insertedIndex * numberOfComponents);
        };
    }

    var interpolateAndPackCartesian4 = generateBarycentricInterpolateFunction(Cartesian4.Cartesian4, 4);
    var interpolateAndPackCartesian3 = generateBarycentricInterpolateFunction(Cartographic.Cartesian3, 3);
    var interpolateAndPackCartesian2 = generateBarycentricInterpolateFunction(Cartesian2.Cartesian2, 2);
    var interpolateAndPackBoolean = function(i0, i1, i2, coords, sourceValues, currentValues, insertedIndex) {
        var v1 = sourceValues[i0] * coords.x;
        var v2 = sourceValues[i1] * coords.y;
        var v3 = sourceValues[i2] * coords.z;
        currentValues[insertedIndex] = (v1 + v2 + v3) > _Math.CesiumMath.EPSILON6 ? 1 : 0;
    };

    var p0Scratch = new Cartographic.Cartesian3();
    var p1Scratch = new Cartographic.Cartesian3();
    var p2Scratch = new Cartographic.Cartesian3();
    var barycentricScratch = new Cartographic.Cartesian3();

    function computeTriangleAttributes(i0, i1, i2, point, positions, normals, tangents, bitangents, texCoords, extrudeDirections, applyOffset, currentAttributes, customAttributeNames, customAttributesLength, allAttributes, insertedIndex) {
        if (!when.defined(normals) && !when.defined(tangents) && !when.defined(bitangents) && !when.defined(texCoords) && !when.defined(extrudeDirections) && customAttributesLength === 0) {
            return;
        }

        var p0 = Cartographic.Cartesian3.fromArray(positions, i0 * 3, p0Scratch);
        var p1 = Cartographic.Cartesian3.fromArray(positions, i1 * 3, p1Scratch);
        var p2 = Cartographic.Cartesian3.fromArray(positions, i2 * 3, p2Scratch);
        var coords = barycentricCoordinates(point, p0, p1, p2, barycentricScratch);

        if (when.defined(normals)) {
            interpolateAndPackCartesian3(i0, i1, i2, coords, normals, currentAttributes.normal.values, insertedIndex, true);
        }

        if (when.defined(extrudeDirections)) {
            var d0 = Cartographic.Cartesian3.fromArray(extrudeDirections, i0 * 3, p0Scratch);
            var d1 = Cartographic.Cartesian3.fromArray(extrudeDirections, i1 * 3, p1Scratch);
            var d2 = Cartographic.Cartesian3.fromArray(extrudeDirections, i2 * 3, p2Scratch);

            Cartographic.Cartesian3.multiplyByScalar(d0, coords.x, d0);
            Cartographic.Cartesian3.multiplyByScalar(d1, coords.y, d1);
            Cartographic.Cartesian3.multiplyByScalar(d2, coords.z, d2);

            var direction;
            if (!Cartographic.Cartesian3.equals(d0, Cartographic.Cartesian3.ZERO) || !Cartographic.Cartesian3.equals(d1, Cartographic.Cartesian3.ZERO) || !Cartographic.Cartesian3.equals(d2, Cartographic.Cartesian3.ZERO)) {
                direction = Cartographic.Cartesian3.add(d0, d1, d0);
                Cartographic.Cartesian3.add(direction, d2, direction);
                Cartographic.Cartesian3.normalize(direction, direction);
            } else {
                direction = p0Scratch;
                direction.x = 0;
                direction.y = 0;
                direction.z = 0;
            }
            Cartographic.Cartesian3.pack(direction, currentAttributes.extrudeDirection.values, insertedIndex * 3);
        }

        if (when.defined(applyOffset)) {
            interpolateAndPackBoolean(i0, i1, i2, coords, applyOffset, currentAttributes.applyOffset.values, insertedIndex);
        }

        if (when.defined(tangents)) {
            interpolateAndPackCartesian3(i0, i1, i2, coords, tangents, currentAttributes.tangent.values, insertedIndex, true);
        }

        if (when.defined(bitangents)) {
            interpolateAndPackCartesian3(i0, i1, i2, coords, bitangents, currentAttributes.bitangent.values, insertedIndex, true);
        }

        if (when.defined(texCoords)) {
            interpolateAndPackCartesian2(i0, i1, i2, coords, texCoords, currentAttributes.st.values, insertedIndex);
        }

        if (customAttributesLength > 0) {
            for (var i = 0; i < customAttributesLength; i++) {
                var attributeName = customAttributeNames[i];
                genericInterpolate(i0, i1, i2, coords, insertedIndex, allAttributes[attributeName], currentAttributes[attributeName]);
            }
        }
    }

    function genericInterpolate(i0, i1, i2, coords, insertedIndex, sourceAttribute, currentAttribute) {
        var componentsPerAttribute = sourceAttribute.componentsPerAttribute;
        var sourceValues = sourceAttribute.values;
        var currentValues = currentAttribute.values;
        switch(componentsPerAttribute) {
            case 4:
                interpolateAndPackCartesian4(i0, i1, i2, coords, sourceValues, currentValues, insertedIndex, false);
                break;
            case 3:
                interpolateAndPackCartesian3(i0, i1, i2, coords, sourceValues, currentValues, insertedIndex, false);
                break;
            case 2:
                interpolateAndPackCartesian2(i0, i1, i2, coords, sourceValues, currentValues, insertedIndex, false);
                break;
            default:
                currentValues[insertedIndex] = sourceValues[i0] * coords.x + sourceValues[i1] * coords.y + sourceValues[i2] * coords.z;
        }
    }

    function insertSplitPoint(currentAttributes, currentIndices, currentIndexMap, indices, currentIndex, point) {
        var insertIndex = currentAttributes.position.values.length / 3;

        if (currentIndex !== -1) {
            var prevIndex = indices[currentIndex];
            var newIndex = currentIndexMap[prevIndex];

            if (newIndex === -1) {
                currentIndexMap[prevIndex] = insertIndex;
                currentAttributes.position.values.push(point.x, point.y, point.z);
                currentIndices.push(insertIndex);
                return insertIndex;
            }

            currentIndices.push(newIndex);
            return newIndex;
        }

        currentAttributes.position.values.push(point.x, point.y, point.z);
        currentIndices.push(insertIndex);
        return insertIndex;
    }

    var NAMED_ATTRIBUTES = {
        position : true,
        normal : true,
        bitangent : true,
        tangent : true,
        st : true,
        extrudeDirection : true,
        applyOffset: true
    };
    function splitLongitudeTriangles(instance) {
        var geometry = instance.geometry;
        var attributes = geometry.attributes;
        var positions = attributes.position.values;
        var normals = (when.defined(attributes.normal)) ? attributes.normal.values : undefined;
        var bitangents = (when.defined(attributes.bitangent)) ? attributes.bitangent.values : undefined;
        var tangents = (when.defined(attributes.tangent)) ? attributes.tangent.values : undefined;
        var texCoords = (when.defined(attributes.st)) ? attributes.st.values : undefined;
        var extrudeDirections = (when.defined(attributes.extrudeDirection)) ? attributes.extrudeDirection.values : undefined;
        var applyOffset = when.defined(attributes.applyOffset) ? attributes.applyOffset.values : undefined;
        var indices = geometry.indices;

        var customAttributeNames = [];
        for (var attributeName in attributes) {
            if (attributes.hasOwnProperty(attributeName) && !NAMED_ATTRIBUTES[attributeName] && when.defined(attributes[attributeName])) {
                customAttributeNames.push(attributeName);
            }
        }
        var customAttributesLength = customAttributeNames.length;

        var eastGeometry = copyGeometryForSplit(geometry);
        var westGeometry = copyGeometryForSplit(geometry);

        var currentAttributes;
        var currentIndices;
        var currentIndexMap;
        var insertedIndex;
        var i;

        var westGeometryIndexMap = [];
        westGeometryIndexMap.length = positions.length / 3;

        var eastGeometryIndexMap = [];
        eastGeometryIndexMap.length = positions.length / 3;

        for (i = 0; i < westGeometryIndexMap.length; ++i) {
            westGeometryIndexMap[i] = -1;
            eastGeometryIndexMap[i] = -1;
        }

        var len = indices.length;
        for (i = 0; i < len; i += 3) {
            var i0 = indices[i];
            var i1 = indices[i + 1];
            var i2 = indices[i + 2];

            var p0 = Cartographic.Cartesian3.fromArray(positions, i0 * 3);
            var p1 = Cartographic.Cartesian3.fromArray(positions, i1 * 3);
            var p2 = Cartographic.Cartesian3.fromArray(positions, i2 * 3);

            var result = splitTriangle(p0, p1, p2);
            if (when.defined(result) && result.positions.length > 3) {
                var resultPositions = result.positions;
                var resultIndices = result.indices;
                var resultLength = resultIndices.length;

                for (var j = 0; j < resultLength; ++j) {
                    var resultIndex = resultIndices[j];
                    var point = resultPositions[resultIndex];

                    if (point.y < 0.0) {
                        currentAttributes = westGeometry.attributes;
                        currentIndices = westGeometry.indices;
                        currentIndexMap = westGeometryIndexMap;
                    } else {
                        currentAttributes = eastGeometry.attributes;
                        currentIndices = eastGeometry.indices;
                        currentIndexMap = eastGeometryIndexMap;
                    }

                    insertedIndex = insertSplitPoint(currentAttributes, currentIndices, currentIndexMap, indices, resultIndex < 3 ? i + resultIndex : -1, point);
                    computeTriangleAttributes(i0, i1, i2, point, positions, normals, tangents, bitangents, texCoords, extrudeDirections, applyOffset, currentAttributes, customAttributeNames, customAttributesLength, attributes, insertedIndex);
                }
            } else {
                if (when.defined(result)) {
                    p0 = result.positions[0];
                    p1 = result.positions[1];
                    p2 = result.positions[2];
                }

                if (p0.y < 0.0) {
                    currentAttributes = westGeometry.attributes;
                    currentIndices = westGeometry.indices;
                    currentIndexMap = westGeometryIndexMap;
                } else {
                    currentAttributes = eastGeometry.attributes;
                    currentIndices = eastGeometry.indices;
                    currentIndexMap = eastGeometryIndexMap;
                }

                insertedIndex = insertSplitPoint(currentAttributes, currentIndices, currentIndexMap, indices, i, p0);
                computeTriangleAttributes(i0, i1, i2, p0, positions, normals, tangents, bitangents, texCoords, extrudeDirections, applyOffset, currentAttributes, customAttributeNames, customAttributesLength, attributes, insertedIndex);

                insertedIndex = insertSplitPoint(currentAttributes, currentIndices, currentIndexMap, indices, i + 1, p1);
                computeTriangleAttributes(i0, i1, i2, p1, positions, normals, tangents, bitangents, texCoords, extrudeDirections, applyOffset, currentAttributes, customAttributeNames, customAttributesLength, attributes, insertedIndex);

                insertedIndex = insertSplitPoint(currentAttributes, currentIndices, currentIndexMap, indices, i + 2, p2);
                computeTriangleAttributes(i0, i1, i2, p2, positions, normals, tangents, bitangents, texCoords, extrudeDirections, applyOffset, currentAttributes, customAttributeNames, customAttributesLength, attributes, insertedIndex);
            }
        }

        updateInstanceAfterSplit(instance, westGeometry, eastGeometry);
    }

    var xzPlane = Plane.Plane.fromPointNormal(Cartographic.Cartesian3.ZERO, Cartographic.Cartesian3.UNIT_Y);

    var offsetScratch = new Cartographic.Cartesian3();
    var offsetPointScratch = new Cartographic.Cartesian3();

    function computeLineAttributes(i0, i1, point, positions, insertIndex, currentAttributes, applyOffset) {
        if (!when.defined(applyOffset)) {
            return;
        }

        var p0 = Cartographic.Cartesian3.fromArray(positions, i0 * 3, p0Scratch);
        if (Cartographic.Cartesian3.equalsEpsilon(p0, point, _Math.CesiumMath.EPSILON10)) {
            currentAttributes.applyOffset.values[insertIndex] = applyOffset[i0];
        } else {
            currentAttributes.applyOffset.values[insertIndex] = applyOffset[i1];
        }

    }

    function splitLongitudeLines(instance) {
        var geometry = instance.geometry;
        var attributes = geometry.attributes;
        var positions = attributes.position.values;
        var applyOffset = when.defined(attributes.applyOffset) ? attributes.applyOffset.values : undefined;
        var indices = geometry.indices;

        var eastGeometry = copyGeometryForSplit(geometry);
        var westGeometry = copyGeometryForSplit(geometry);

        var i;
        var length = indices.length;

        var westGeometryIndexMap = [];
        westGeometryIndexMap.length = positions.length / 3;

        var eastGeometryIndexMap = [];
        eastGeometryIndexMap.length = positions.length / 3;

        for (i = 0; i < westGeometryIndexMap.length; ++i) {
            westGeometryIndexMap[i] = -1;
            eastGeometryIndexMap[i] = -1;
        }

        for (i = 0; i < length; i += 2) {
            var i0 = indices[i];
            var i1 = indices[i + 1];

            var p0 = Cartographic.Cartesian3.fromArray(positions, i0 * 3, p0Scratch);
            var p1 = Cartographic.Cartesian3.fromArray(positions, i1 * 3, p1Scratch);
            var insertIndex;

            if (Math.abs(p0.y) < _Math.CesiumMath.EPSILON6){
                if (p0.y < 0.0) {
                    p0.y = -_Math.CesiumMath.EPSILON6;
                } else {
                    p0.y = _Math.CesiumMath.EPSILON6;
                }
            }

            if (Math.abs(p1.y) < _Math.CesiumMath.EPSILON6){
                if (p1.y < 0.0) {
                    p1.y = -_Math.CesiumMath.EPSILON6;
                } else {
                    p1.y = _Math.CesiumMath.EPSILON6;
                }
            }

            var p0Attributes = eastGeometry.attributes;
            var p0Indices = eastGeometry.indices;
            var p0IndexMap = eastGeometryIndexMap;
            var p1Attributes = westGeometry.attributes;
            var p1Indices = westGeometry.indices;
            var p1IndexMap = westGeometryIndexMap;

            var intersection = IntersectionTests.IntersectionTests.lineSegmentPlane(p0, p1, xzPlane, p2Scratch);
            if (when.defined(intersection)) {
                // move point on the xz-plane slightly away from the plane
                var offset = Cartographic.Cartesian3.multiplyByScalar(Cartographic.Cartesian3.UNIT_Y, 5.0 * _Math.CesiumMath.EPSILON9, offsetScratch);
                if (p0.y < 0.0) {
                    Cartographic.Cartesian3.negate(offset, offset);

                    p0Attributes = westGeometry.attributes;
                    p0Indices = westGeometry.indices;
                    p0IndexMap = westGeometryIndexMap;
                    p1Attributes = eastGeometry.attributes;
                    p1Indices = eastGeometry.indices;
                    p1IndexMap = eastGeometryIndexMap;
                }

                var offsetPoint = Cartographic.Cartesian3.add(intersection, offset, offsetPointScratch);

                insertIndex = insertSplitPoint(p0Attributes, p0Indices, p0IndexMap, indices, i, p0);
                computeLineAttributes(i0, i1, p0, positions, insertIndex, p0Attributes, applyOffset);

                insertIndex = insertSplitPoint(p0Attributes, p0Indices, p0IndexMap, indices, -1, offsetPoint);
                computeLineAttributes(i0, i1, offsetPoint, positions, insertIndex, p0Attributes, applyOffset);

                Cartographic.Cartesian3.negate(offset, offset);
                Cartographic.Cartesian3.add(intersection, offset, offsetPoint);
                insertIndex = insertSplitPoint(p1Attributes, p1Indices, p1IndexMap, indices, -1, offsetPoint);
                computeLineAttributes(i0, i1, offsetPoint, positions, insertIndex, p1Attributes, applyOffset);

                insertIndex = insertSplitPoint(p1Attributes, p1Indices, p1IndexMap, indices, i + 1, p1);
                computeLineAttributes(i0, i1, p1, positions, insertIndex, p1Attributes, applyOffset);
            } else {
                var currentAttributes;
                var currentIndices;
                var currentIndexMap;

                if (p0.y < 0.0) {
                    currentAttributes = westGeometry.attributes;
                    currentIndices = westGeometry.indices;
                    currentIndexMap = westGeometryIndexMap;
                } else {
                    currentAttributes = eastGeometry.attributes;
                    currentIndices = eastGeometry.indices;
                    currentIndexMap = eastGeometryIndexMap;
                }

                insertIndex = insertSplitPoint(currentAttributes, currentIndices, currentIndexMap, indices, i, p0);
                computeLineAttributes(i0, i1, p0, positions, insertIndex, currentAttributes, applyOffset);

                insertIndex = insertSplitPoint(currentAttributes, currentIndices, currentIndexMap, indices, i + 1, p1);
                computeLineAttributes(i0, i1, p1, positions, insertIndex, currentAttributes, applyOffset);
            }
        }

        updateInstanceAfterSplit(instance, westGeometry, eastGeometry);
    }

    var cartesian2Scratch0 = new Cartesian2.Cartesian2();
    var cartesian2Scratch1 = new Cartesian2.Cartesian2();

    var cartesian3Scratch0 = new Cartographic.Cartesian3();
    var cartesian3Scratch2 = new Cartographic.Cartesian3();
    var cartesian3Scratch3 = new Cartographic.Cartesian3();
    var cartesian3Scratch4 = new Cartographic.Cartesian3();
    var cartesian3Scratch5 = new Cartographic.Cartesian3();
    var cartesian3Scratch6 = new Cartographic.Cartesian3();
    var cartesian3Scratch7 = new Cartographic.Cartesian3();

    var cartesian4Scratch0 = new Cartesian4.Cartesian4();

    function updateAdjacencyAfterSplit(geometry) {
        var attributes = geometry.attributes;
        var positions = attributes.position.values;
        var prevPositions = attributes.prevPosition.values;
        var nextPositions = attributes.nextPosition.values;

        var length = positions.length;
        for (var j = 0; j < length; j += 3) {
            var position = Cartographic.Cartesian3.unpack(positions, j, cartesian3Scratch0);
            if (position.x > 0.0) {
                continue;
            }

            var prevPosition = Cartographic.Cartesian3.unpack(prevPositions, j, cartesian3Scratch2);
            if ((position.y < 0.0 && prevPosition.y > 0.0) || (position.y > 0.0 && prevPosition.y < 0.0)) {
                if (j - 3 > 0) {
                    prevPositions[j] = positions[j - 3];
                    prevPositions[j + 1] = positions[j - 2];
                    prevPositions[j + 2] = positions[j - 1];
                } else {
                    Cartographic.Cartesian3.pack(position, prevPositions, j);
                }
            }

            var nextPosition = Cartographic.Cartesian3.unpack(nextPositions, j, cartesian3Scratch3);
            if ((position.y < 0.0 && nextPosition.y > 0.0) || (position.y > 0.0 && nextPosition.y < 0.0)) {
                if (j + 3 < length) {
                    nextPositions[j] = positions[j + 3];
                    nextPositions[j + 1] = positions[j + 4];
                    nextPositions[j + 2] = positions[j + 5];
                } else {
                    Cartographic.Cartesian3.pack(position, nextPositions, j);
                }
            }
        }
    }

    var offsetScalar = 5.0 * _Math.CesiumMath.EPSILON9;
    var coplanarOffset = _Math.CesiumMath.EPSILON6;

    function splitLongitudePolyline(instance) {
        var geometry = instance.geometry;
        var attributes = geometry.attributes;
        var positions = attributes.position.values;
        var prevPositions = attributes.prevPosition.values;
        var nextPositions = attributes.nextPosition.values;
        var expandAndWidths = attributes.expandAndWidth.values;

        var texCoords = (when.defined(attributes.st)) ? attributes.st.values : undefined;
        var colors = (when.defined(attributes.color)) ? attributes.color.values : undefined;
        var dist = (when.defined(attributes.dist)) ? attributes.dist.values : undefined;

        var eastGeometry = copyGeometryForSplit(geometry);
        var westGeometry = copyGeometryForSplit(geometry);

        var i;
        var j;
        var index;

        var intersectionFound = false;

        var length = positions.length / 3;
        for (i = 0; i < length; i += 4) {
            var i0 = i;
            var i2 = i + 2;

            var p0 = Cartographic.Cartesian3.fromArray(positions, i0 * 3, cartesian3Scratch0);
            var p2 = Cartographic.Cartesian3.fromArray(positions, i2 * 3, cartesian3Scratch2);

            // Offset points that are close to the 180 longitude and change the previous/next point
            // to be the same offset point so it can be projected to 2D. There is special handling in the
            // shader for when position == prevPosition || position == nextPosition.
            if (Math.abs(p0.y) < coplanarOffset) {
                p0.y = coplanarOffset * (p2.y < 0.0 ? -1.0 : 1.0);
                positions[i * 3 + 1] = p0.y;
                positions[(i + 1) * 3 + 1] = p0.y;

                for (j = i0 * 3; j < i0 * 3 + 4 * 3; j += 3) {
                    prevPositions[j] = positions[i * 3];
                    prevPositions[j + 1] = positions[i * 3 + 1];
                    prevPositions[j + 2] = positions[i * 3 + 2];
                }
            }

            // Do the same but for when the line crosses 180 longitude in the opposite direction.
            if (Math.abs(p2.y) < coplanarOffset) {
                p2.y = coplanarOffset * (p0.y < 0.0 ? -1.0 : 1.0);
                positions[(i + 2) * 3 + 1] = p2.y;
                positions[(i + 3) * 3 + 1] = p2.y;

                for (j = i0 * 3; j < i0 * 3 + 4 * 3; j += 3) {
                    nextPositions[j] = positions[(i + 2) * 3];
                    nextPositions[j + 1] = positions[(i + 2) * 3 + 1];
                    nextPositions[j + 2] = positions[(i + 2) * 3 + 2];
                }
            }

            var p0Attributes = eastGeometry.attributes;
            var p0Indices = eastGeometry.indices;
            var p2Attributes = westGeometry.attributes;
            var p2Indices = westGeometry.indices;

            var intersection = IntersectionTests.IntersectionTests.lineSegmentPlane(p0, p2, xzPlane, cartesian3Scratch4);
            if (when.defined(intersection)) {
                intersectionFound = true;

                // move point on the xz-plane slightly away from the plane
                var offset = Cartographic.Cartesian3.multiplyByScalar(Cartographic.Cartesian3.UNIT_Y, offsetScalar, cartesian3Scratch5);
                if (p0.y < 0.0) {
                    Cartographic.Cartesian3.negate(offset, offset);
                    p0Attributes = westGeometry.attributes;
                    p0Indices = westGeometry.indices;
                    p2Attributes = eastGeometry.attributes;
                    p2Indices = eastGeometry.indices;
                }

                var offsetPoint = Cartographic.Cartesian3.add(intersection, offset, cartesian3Scratch6);
                p0Attributes.position.values.push(p0.x, p0.y, p0.z, p0.x, p0.y, p0.z);
                p0Attributes.position.values.push(offsetPoint.x, offsetPoint.y, offsetPoint.z);
                p0Attributes.position.values.push(offsetPoint.x, offsetPoint.y, offsetPoint.z);

                p0Attributes.prevPosition.values.push(prevPositions[i0 * 3], prevPositions[i0 * 3 + 1], prevPositions[i0 * 3 + 2]);
                p0Attributes.prevPosition.values.push(prevPositions[i0 * 3 + 3], prevPositions[i0 * 3 + 4], prevPositions[i0 * 3 + 5]);
                p0Attributes.prevPosition.values.push(p0.x, p0.y, p0.z, p0.x, p0.y, p0.z);

                p0Attributes.nextPosition.values.push(offsetPoint.x, offsetPoint.y, offsetPoint.z);
                p0Attributes.nextPosition.values.push(offsetPoint.x, offsetPoint.y, offsetPoint.z);
                p0Attributes.nextPosition.values.push(offsetPoint.x, offsetPoint.y, offsetPoint.z);
                p0Attributes.nextPosition.values.push(offsetPoint.x, offsetPoint.y, offsetPoint.z);

                Cartographic.Cartesian3.negate(offset, offset);
                Cartographic.Cartesian3.add(intersection, offset, offsetPoint);
                p2Attributes.position.values.push(offsetPoint.x, offsetPoint.y, offsetPoint.z);
                p2Attributes.position.values.push(offsetPoint.x, offsetPoint.y, offsetPoint.z);
                p2Attributes.position.values.push(p2.x, p2.y, p2.z, p2.x, p2.y, p2.z);

                p2Attributes.prevPosition.values.push(offsetPoint.x, offsetPoint.y, offsetPoint.z);
                p2Attributes.prevPosition.values.push(offsetPoint.x, offsetPoint.y, offsetPoint.z);
                p2Attributes.prevPosition.values.push(offsetPoint.x, offsetPoint.y, offsetPoint.z);
                p2Attributes.prevPosition.values.push(offsetPoint.x, offsetPoint.y, offsetPoint.z);

                p2Attributes.nextPosition.values.push(p2.x, p2.y, p2.z, p2.x, p2.y, p2.z);
                p2Attributes.nextPosition.values.push(nextPositions[i2 * 3], nextPositions[i2 * 3 + 1], nextPositions[i2 * 3 + 2]);
                p2Attributes.nextPosition.values.push(nextPositions[i2 * 3 + 3], nextPositions[i2 * 3 + 4], nextPositions[i2 * 3 + 5]);

                var ew0 = Cartesian2.Cartesian2.fromArray(expandAndWidths, i0 * 2, cartesian2Scratch0);
                var width = Math.abs(ew0.y);

                p0Attributes.expandAndWidth.values.push(-1,  width, 1,  width);
                p0Attributes.expandAndWidth.values.push(-1, -width, 1, -width);
                p2Attributes.expandAndWidth.values.push(-1,  width, 1,  width);
                p2Attributes.expandAndWidth.values.push(-1, -width, 1, -width);

                var t = Cartographic.Cartesian3.magnitudeSquared(Cartographic.Cartesian3.subtract(intersection, p0, cartesian3Scratch3));
                t /= Cartographic.Cartesian3.magnitudeSquared(Cartographic.Cartesian3.subtract(p2, p0, cartesian3Scratch3));

                if (when.defined(colors)) {
                    var c0 = Cartesian4.Cartesian4.fromArray(colors, i0 * 4, cartesian4Scratch0);
                    var c2 = Cartesian4.Cartesian4.fromArray(colors, i2 * 4, cartesian4Scratch0);

                    var r = _Math.CesiumMath.lerp(c0.x, c2.x, t);
                    var g = _Math.CesiumMath.lerp(c0.y, c2.y, t);
                    var b = _Math.CesiumMath.lerp(c0.z, c2.z, t);
                    var a = _Math.CesiumMath.lerp(c0.w, c2.w, t);

                    for (j = i0 * 4; j < i0 * 4 + 2 * 4; ++j) {
                        p0Attributes.color.values.push(colors[j]);
                    }
                    p0Attributes.color.values.push(r, g, b, a);
                    p0Attributes.color.values.push(r, g, b, a);
                    p2Attributes.color.values.push(r, g, b, a);
                    p2Attributes.color.values.push(r, g, b, a);
                    for (j = i2 * 4; j < i2 * 4 + 2 * 4; ++j) {
                        p2Attributes.color.values.push(colors[j]);
                    }
                }

                if (when.defined(texCoords)) {
                    var s0 = Cartesian2.Cartesian2.fromArray(texCoords, i0 * 2, cartesian2Scratch0);
                    var s3 = Cartesian2.Cartesian2.fromArray(texCoords, (i + 3) * 2, cartesian2Scratch1);

                    var sx = _Math.CesiumMath.lerp(s0.x, s3.x, t);

                    for (j = i0 * 2; j < i0 * 2 + 2 * 2; ++j) {
                        p0Attributes.st.values.push(texCoords[j]);
                    }
                    p0Attributes.st.values.push(sx, s0.y);
                    p0Attributes.st.values.push(sx, s3.y);
                    p2Attributes.st.values.push(sx, s0.y);
                    p2Attributes.st.values.push(sx, s3.y);
                    for (j = i2 * 2; j < i2 * 2 + 2 * 2; ++j) {
                        p2Attributes.st.values.push(texCoords[j]);
                    }
                }

                if (when.defined(dist)) {
                    var d0 = Cartographic.Cartesian3.fromArray(dist, i0 * 3, cartesian3Scratch7);
                    var d1 = Cartographic.Cartesian3.fromArray(dist, i2 * 3, cartesian3Scratch7);

                    var disFrom = _Math.CesiumMath.lerp(d0.x, d1.x, t);

                    for (j = i0 * 3; j < i0 * 3 + 2 * 3; ++j) {
                        p0Attributes.dist.values.push(dist[j]);
                    }
                    p0Attributes.dist.values.push(disFrom, d0.y, d0.z);
                    p0Attributes.dist.values.push(disFrom, d0.y, d0.z);
                    p2Attributes.dist.values.push(disFrom, d1.y, d1.z);
                    p2Attributes.dist.values.push(disFrom, d1.y, d1.z);
                    for (j = i2 * 3; j < i2 * 3 + 2 * 3; ++j) {
                        p2Attributes.dist.values.push(dist[j]);
                    }
                }

                index = p0Attributes.position.values.length / 3 - 4;
                p0Indices.push(index, index + 2, index + 1);
                p0Indices.push(index + 1, index + 2, index + 3);

                index = p2Attributes.position.values.length / 3 - 4;
                p2Indices.push(index, index + 2, index + 1);
                p2Indices.push(index + 1, index + 2, index + 3);
            } else {
                var currentAttributes;
                var currentIndices;

                if (p0.y < 0.0) {
                    currentAttributes = westGeometry.attributes;
                    currentIndices = westGeometry.indices;
                } else {
                    currentAttributes = eastGeometry.attributes;
                    currentIndices = eastGeometry.indices;
                }

                currentAttributes.position.values.push(p0.x, p0.y, p0.z);
                currentAttributes.position.values.push(p0.x, p0.y, p0.z);
                currentAttributes.position.values.push(p2.x, p2.y, p2.z);
                currentAttributes.position.values.push(p2.x, p2.y, p2.z);

                for (j = i * 3; j < i * 3 + 4 * 3; ++j) {
                    currentAttributes.prevPosition.values.push(prevPositions[j]);
                    currentAttributes.nextPosition.values.push(nextPositions[j]);
                }

                for (j = i * 2; j < i * 2 + 4 * 2; ++j) {
                    currentAttributes.expandAndWidth.values.push(expandAndWidths[j]);
                    if (when.defined(texCoords)) {
                        currentAttributes.st.values.push(texCoords[j]);
                    }
                }

                if (when.defined(colors)) {
                    for (j = i * 4; j < i * 4 + 4 * 4; ++j) {
                        currentAttributes.color.values.push(colors[j]);
                    }
                }

                if (when.defined(dist)) {
                    for (j = i * 3; j < i * 3 + 4 * 3; ++j) {
                        currentAttributes.dist.values.push(dist[j]);
                    }
                }

                index = currentAttributes.position.values.length / 3 - 4;
                currentIndices.push(index, index + 2, index + 1);
                currentIndices.push(index + 1, index + 2, index + 3);
            }
        }

        if (intersectionFound) {
            updateAdjacencyAfterSplit(westGeometry);
            updateAdjacencyAfterSplit(eastGeometry);
        }

        updateInstanceAfterSplit(instance, westGeometry, eastGeometry);
    }

    /**
     * Splits the instances's geometry, by introducing new vertices and indices,that
     * intersect the International Date Line and Prime Meridian so that no primitives cross longitude
     * -180/180 degrees.  This is not required for 3D drawing, but is required for
     * correcting drawing in 2D and Columbus view.
     *
     * @private
     *
     * @param {GeometryInstance} instance The instance to modify.
     * @returns {GeometryInstance} The modified <code>instance</code> argument, with it's geometry split at the International Date Line.
     *
     * @example
     * instance = Cesium.GeometryPipeline.splitLongitude(instance);
     */
    GeometryPipeline.splitLongitude = function(instance) {
        //>>includeStart('debug', pragmas.debug);
        if (!when.defined(instance)) {
            throw new Check.DeveloperError('instance is required.');
        }
        //>>includeEnd('debug');

        var geometry = instance.geometry;
        var boundingSphere = geometry.boundingSphere;
        if (when.defined(boundingSphere)) {
            var minX = boundingSphere.center.x - boundingSphere.radius;
            if (minX > 0 || BoundingSphere.BoundingSphere.intersectPlane(boundingSphere, Plane.Plane.ORIGIN_ZX_PLANE) !== BoundingSphere.Intersect.INTERSECTING) {
                return instance;
            }
        }

        if (geometry.geometryType !== GeometryAttribute.GeometryType.NONE) {
            switch (geometry.geometryType) {
            case GeometryAttribute.GeometryType.POLYLINES:
                splitLongitudePolyline(instance);
                break;
            case GeometryAttribute.GeometryType.TRIANGLES:
                splitLongitudeTriangles(instance);
                break;
            case GeometryAttribute.GeometryType.LINES:
                splitLongitudeLines(instance);
                break;
            }
        } else {
            indexPrimitive(geometry);
            if (geometry.primitiveType === PrimitiveType.PrimitiveType.TRIANGLES) {
                splitLongitudeTriangles(instance);
            } else if (geometry.primitiveType === PrimitiveType.PrimitiveType.LINES) {
                splitLongitudeLines(instance);
            }
        }

        return instance;
    };

    exports.GeometryPipeline = GeometryPipeline;

});

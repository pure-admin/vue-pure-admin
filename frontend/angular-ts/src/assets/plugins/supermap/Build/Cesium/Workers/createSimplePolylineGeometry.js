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
define(['./when-8d13db60', './Check-70bec281', './Math-61ede240', './Cartographic-fe4be337', './Cartesian2-85064f09', './BoundingSphere-775c5788', './Cartesian4-5af5bb24', './RuntimeError-ba10bc3e', './WebGLConstants-4c11ee5f', './ComponentDatatype-5862616f', './GeometryAttribute-06d31d45', './PrimitiveType-97893bc7', './FeatureDetection-7bd32c34', './Transforms-913163ed', './buildModuleUrl-9d43158d', './GeometryAttributes-aacecde6', './IndexDatatype-9435b55f', './IntersectionTests-397d9494', './Plane-8390418f', './ArcType-66bc286a', './EllipsoidRhumbLine-f161e674', './EllipsoidGeodesic-84507801', './PolylinePipeline-a9f32196', './Color-69f1845f'], function (when, Check, _Math, Cartographic, Cartesian2, BoundingSphere, Cartesian4, RuntimeError, WebGLConstants, ComponentDatatype, GeometryAttribute, PrimitiveType, FeatureDetection, Transforms, buildModuleUrl, GeometryAttributes, IndexDatatype, IntersectionTests, Plane, ArcType, EllipsoidRhumbLine, EllipsoidGeodesic, PolylinePipeline, Color) { 'use strict';

    function interpolateColors(p0, p1, color0, color1, minDistance, array, offset) {
            var numPoints = PolylinePipeline.PolylinePipeline.numberOfPoints(p0, p1, minDistance);
            var i;

            var r0 = color0.red;
            var g0 = color0.green;
            var b0 = color0.blue;
            var a0 = color0.alpha;

            var r1 = color1.red;
            var g1 = color1.green;
            var b1 = color1.blue;
            var a1 = color1.alpha;

            if (Color.Color.equals(color0, color1)) {
                for (i = 0; i < numPoints; i++) {
                    array[offset++] = Color.Color.floatToByte(r0);
                    array[offset++] = Color.Color.floatToByte(g0);
                    array[offset++] = Color.Color.floatToByte(b0);
                    array[offset++] = Color.Color.floatToByte(a0);
                }
                return offset;
            }

            var redPerVertex = (r1 - r0) / numPoints;
            var greenPerVertex = (g1 - g0) / numPoints;
            var bluePerVertex = (b1 - b0) / numPoints;
            var alphaPerVertex = (a1 - a0) / numPoints;

            var index = offset;
            for (i = 0; i < numPoints; i++) {
                array[index++] = Color.Color.floatToByte(r0 + i * redPerVertex);
                array[index++] = Color.Color.floatToByte(g0 + i * greenPerVertex);
                array[index++] = Color.Color.floatToByte(b0 + i * bluePerVertex);
                array[index++] = Color.Color.floatToByte(a0 + i * alphaPerVertex);
            }

            return index;
        }

        /**
         * A description of a polyline modeled as a line strip; the first two positions define a line segment,
         * and each additional position defines a line segment from the previous position.
         *
         * @alias SimplePolylineGeometry
         * @constructor
         *
         * @param {Object} options Object with the following properties:
         * @param {Cartesian3[]} options.positions An array of {@link Cartesian3} defining the positions in the polyline as a line strip.
         * @param {Color[]} [options.colors] An Array of {@link Color} defining the per vertex or per segment colors.
         * @param {Boolean} [options.colorsPerVertex=false] A boolean that determines whether the colors will be flat across each segment of the line or interpolated across the vertices.
         * @param {ArcType} [options.arcType=ArcType.GEODESIC] The type of line the polyline segments must follow.
         * @param {Number} [options.granularity=CesiumMath.RADIANS_PER_DEGREE] The distance, in radians, between each latitude and longitude if options.arcType is not ArcType.NONE. Determines the number of positions in the buffer.
         * @param {Ellipsoid} [options.ellipsoid=Ellipsoid.WGS84] The ellipsoid to be used as a reference.
         *
         * @exception {DeveloperError} At least two positions are required.
         * @exception {DeveloperError} colors has an invalid length.
         *
         * @see SimplePolylineGeometry#createGeometry
         *
         * @example
         * // A polyline with two connected line segments
         * var polyline = new Cesium.SimplePolylineGeometry({
         *   positions : Cesium.Cartesian3.fromDegreesArray([
         *     0.0, 0.0,
         *     5.0, 0.0,
         *     5.0, 5.0
         *   ])
         * });
         * var geometry = Cesium.SimplePolylineGeometry.createGeometry(polyline);
         */
        function SimplePolylineGeometry(options) {
            options = when.defaultValue(options, when.defaultValue.EMPTY_OBJECT);
            var positions = options.positions;
            var colors = options.colors;
            var colorsPerVertex = when.defaultValue(options.colorsPerVertex, false);

            //>>includeStart('debug', pragmas.debug);
            if ((!when.defined(positions)) || (positions.length < 2)) {
                throw new Check.DeveloperError('At least two positions are required.');
            }
            if (when.defined(colors) && ((colorsPerVertex && colors.length < positions.length) || (!colorsPerVertex && colors.length < positions.length - 1))) {
                throw new Check.DeveloperError('colors has an invalid length.');
            }
            //>>includeEnd('debug');

            this._positions = positions;
            this._colors = colors;
            this._colorsPerVertex = colorsPerVertex;

            this._arcType = when.defaultValue(options.arcType, ArcType.ArcType.GEODESIC);
            this._granularity = when.defaultValue(options.granularity, _Math.CesiumMath.RADIANS_PER_DEGREE);
            this._ellipsoid = when.defaultValue(options.ellipsoid, Cartesian2.Ellipsoid.WGS84);
            this._workerName = 'createSimplePolylineGeometry';

            var numComponents = 1 + positions.length * Cartographic.Cartesian3.packedLength;
            numComponents += when.defined(colors) ? 1 + colors.length * Color.Color.packedLength : 1;

            /**
             * The number of elements used to pack the object into an array.
             * @type {Number}
             */
            this.packedLength = numComponents + Cartesian2.Ellipsoid.packedLength + 3;
        }

        /**
         * Stores the provided instance into the provided array.
         *
         * @param {SimplePolylineGeometry} value The value to pack.
         * @param {Number[]} array The array to pack into.
         * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
         *
         * @returns {Number[]} The array that was packed into
         */
        SimplePolylineGeometry.pack = function(value, array, startingIndex) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(value)) {
                throw new Check.DeveloperError('value is required');
            }
            if (!when.defined(array)) {
                throw new Check.DeveloperError('array is required');
            }
            //>>includeEnd('debug');

            startingIndex = when.defaultValue(startingIndex, 0);

            var i;

            var positions = value._positions;
            var length = positions.length;
            array[startingIndex++] = length;

            for (i = 0; i < length; ++i, startingIndex += Cartographic.Cartesian3.packedLength) {
                Cartographic.Cartesian3.pack(positions[i], array, startingIndex);
            }

            var colors = value._colors;
            length = when.defined(colors) ? colors.length : 0.0;
            array[startingIndex++] = length;

            for (i = 0; i < length; ++i, startingIndex += Color.Color.packedLength) {
                Color.Color.pack(colors[i], array, startingIndex);
            }

            Cartesian2.Ellipsoid.pack(value._ellipsoid, array, startingIndex);
            startingIndex += Cartesian2.Ellipsoid.packedLength;

            array[startingIndex++] = value._colorsPerVertex ? 1.0 : 0.0;
            array[startingIndex++] = value._arcType;
            array[startingIndex]   = value._granularity;

            return array;
        };

        /**
         * Retrieves an instance from a packed array.
         *
         * @param {Number[]} array The packed array.
         * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
         * @param {SimplePolylineGeometry} [result] The object into which to store the result.
         * @returns {SimplePolylineGeometry} The modified result parameter or a new SimplePolylineGeometry instance if one was not provided.
         */
        SimplePolylineGeometry.unpack = function(array, startingIndex, result) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(array)) {
                throw new Check.DeveloperError('array is required');
            }
            //>>includeEnd('debug');

            startingIndex = when.defaultValue(startingIndex, 0);

            var i;

            var length = array[startingIndex++];
            var positions = new Array(length);

            for (i = 0; i < length; ++i, startingIndex += Cartographic.Cartesian3.packedLength) {
                positions[i] = Cartographic.Cartesian3.unpack(array, startingIndex);
            }

            length = array[startingIndex++];
            var colors = length > 0 ? new Array(length) : undefined;

            for (i = 0; i < length; ++i, startingIndex += Color.Color.packedLength) {
                colors[i] = Color.Color.unpack(array, startingIndex);
            }

            var ellipsoid = Cartesian2.Ellipsoid.unpack(array, startingIndex);
            startingIndex += Cartesian2.Ellipsoid.packedLength;

            var colorsPerVertex = array[startingIndex++] === 1.0;
            var arcType = array[startingIndex++];
            var granularity = array[startingIndex];

            if (!when.defined(result)) {
                return new SimplePolylineGeometry({
                    positions : positions,
                    colors : colors,
                    ellipsoid : ellipsoid,
                    colorsPerVertex : colorsPerVertex,
                    arcType : arcType,
                    granularity : granularity
                });
            }

            result._positions = positions;
            result._colors = colors;
            result._ellipsoid = ellipsoid;
            result._colorsPerVertex = colorsPerVertex;
            result._arcType = arcType;
            result._granularity = granularity;

            return result;
        };

        var scratchArray1 = new Array(2);
        var scratchArray2 = new Array(2);
        var generateArcOptionsScratch = {
            positions : scratchArray1,
            height: scratchArray2,
            ellipsoid: undefined,
            minDistance : undefined,
            granularity : undefined
        };

        /**
         * Computes the geometric representation of a simple polyline, including its vertices, indices, and a bounding sphere.
         *
         * @param {SimplePolylineGeometry} simplePolylineGeometry A description of the polyline.
         * @returns {Geometry} The computed vertices and indices.
         */
        SimplePolylineGeometry.createGeometry = function(simplePolylineGeometry) {
            var positions = simplePolylineGeometry._positions;
            var colors = simplePolylineGeometry._colors;
            var colorsPerVertex = simplePolylineGeometry._colorsPerVertex;
            var arcType = simplePolylineGeometry._arcType;
            var granularity = simplePolylineGeometry._granularity;
            var ellipsoid = simplePolylineGeometry._ellipsoid;

            var minDistance = _Math.CesiumMath.chordLength(granularity, ellipsoid.maximumRadius);
            var perSegmentColors = when.defined(colors) && !colorsPerVertex;

            var i;
            var length = positions.length;

            var positionValues;
            var numberOfPositions;
            var colorValues;
            var color;
            var offset = 0;

            if (arcType === ArcType.ArcType.GEODESIC || arcType === ArcType.ArcType.RHUMB) {
                var subdivisionSize;
                var numberOfPointsFunction;
                var generateArcFunction;
                if (arcType === ArcType.ArcType.GEODESIC) {
                    subdivisionSize = _Math.CesiumMath.chordLength(granularity, ellipsoid.maximumRadius);
                    numberOfPointsFunction = PolylinePipeline.PolylinePipeline.numberOfPoints;
                    generateArcFunction = PolylinePipeline.PolylinePipeline.generateArc;
                } else {
                    subdivisionSize = granularity;
                    numberOfPointsFunction = PolylinePipeline.PolylinePipeline.numberOfPointsRhumbLine;
                    generateArcFunction = PolylinePipeline.PolylinePipeline.generateRhumbArc;
                }

                var heights = PolylinePipeline.PolylinePipeline.extractHeights(positions, ellipsoid);

                var generateArcOptions = generateArcOptionsScratch;
                if (arcType === ArcType.ArcType.GEODESIC) {
                    generateArcOptions.minDistance = minDistance;
                } else {
                    generateArcOptions.granularity = granularity;
                }
                generateArcOptions.ellipsoid = ellipsoid;

                if (perSegmentColors) {
                    var positionCount = 0;
                    for (i = 0; i < length - 1; i++) {
                        positionCount += numberOfPointsFunction(positions[i], positions[i+1], subdivisionSize) + 1;
                    }

                    positionValues = new Float64Array(positionCount * 3);
                    colorValues = new Uint8Array(positionCount * 4);

                    generateArcOptions.positions = scratchArray1;
                    generateArcOptions.height= scratchArray2;

                    var ci = 0;
                    for (i = 0; i < length - 1; ++i) {
                        scratchArray1[0] = positions[i];
                        scratchArray1[1] = positions[i + 1];

                        scratchArray2[0] = heights[i];
                        scratchArray2[1] = heights[i + 1];

                        var pos = generateArcFunction(generateArcOptions);

                        if (when.defined(colors)) {
                            var segLen = pos.length / 3;
                            color = colors[i];
                            for(var k = 0; k < segLen; ++k) {
                                colorValues[ci++] = Color.Color.floatToByte(color.red);
                                colorValues[ci++] = Color.Color.floatToByte(color.green);
                                colorValues[ci++] = Color.Color.floatToByte(color.blue);
                                colorValues[ci++] = Color.Color.floatToByte(color.alpha);
                            }
                        }

                        positionValues.set(pos, offset);
                        offset += pos.length;
                    }
                } else {
                    generateArcOptions.positions = positions;
                    generateArcOptions.height= heights;
                    positionValues = new Float64Array(generateArcFunction(generateArcOptions));

                    if (when.defined(colors)) {
                        colorValues = new Uint8Array(positionValues.length / 3 * 4);

                        for (i = 0; i < length - 1; ++i) {
                            var p0 = positions[i];
                            var p1 = positions[i + 1];
                            var c0 = colors[i];
                            var c1 = colors[i + 1];
                            offset = interpolateColors(p0, p1, c0, c1, minDistance, colorValues, offset);
                        }

                        var lastColor = colors[length - 1];
                        colorValues[offset++] = Color.Color.floatToByte(lastColor.red);
                        colorValues[offset++] = Color.Color.floatToByte(lastColor.green);
                        colorValues[offset++] = Color.Color.floatToByte(lastColor.blue);
                        colorValues[offset++] = Color.Color.floatToByte(lastColor.alpha);
                    }
                }
            } else {
                numberOfPositions = perSegmentColors ? length * 2 - 2 : length;
                positionValues = new Float64Array(numberOfPositions * 3);
                colorValues = when.defined(colors) ? new Uint8Array(numberOfPositions * 4) : undefined;

                var positionIndex = 0;
                var colorIndex = 0;

                for (i = 0; i < length; ++i) {
                    var p = positions[i];

                    if (perSegmentColors && i > 0) {
                        Cartographic.Cartesian3.pack(p, positionValues, positionIndex);
                        positionIndex += 3;

                        color = colors[i - 1];
                        colorValues[colorIndex++] = Color.Color.floatToByte(color.red);
                        colorValues[colorIndex++] = Color.Color.floatToByte(color.green);
                        colorValues[colorIndex++] = Color.Color.floatToByte(color.blue);
                        colorValues[colorIndex++] = Color.Color.floatToByte(color.alpha);
                    }

                    if (perSegmentColors && i === length - 1) {
                        break;
                    }

                    Cartographic.Cartesian3.pack(p, positionValues, positionIndex);
                    positionIndex += 3;

                    if (when.defined(colors)) {
                        color = colors[i];
                        colorValues[colorIndex++] = Color.Color.floatToByte(color.red);
                        colorValues[colorIndex++] = Color.Color.floatToByte(color.green);
                        colorValues[colorIndex++] = Color.Color.floatToByte(color.blue);
                        colorValues[colorIndex++] = Color.Color.floatToByte(color.alpha);
                    }
                }
            }

            var attributes = new GeometryAttributes.GeometryAttributes();
            attributes.position = new GeometryAttribute.GeometryAttribute({
                componentDatatype : ComponentDatatype.ComponentDatatype.DOUBLE,
                componentsPerAttribute : 3,
                values : positionValues
            });

            if (when.defined(colors)) {
                attributes.color = new GeometryAttribute.GeometryAttribute({
                    componentDatatype : ComponentDatatype.ComponentDatatype.UNSIGNED_BYTE,
                    componentsPerAttribute : 4,
                    values : colorValues,
                    normalize : true
                });
            }

            numberOfPositions = positionValues.length / 3;
            var numberOfIndices = (numberOfPositions - 1) * 2;
            var indices = IndexDatatype.IndexDatatype.createTypedArray(numberOfPositions, numberOfIndices);

            var index = 0;
            for (i = 0; i < numberOfPositions - 1; ++i) {
                indices[index++] = i;
                indices[index++] = i + 1;
            }

            return new GeometryAttribute.Geometry({
                attributes : attributes,
                indices : indices,
                primitiveType : PrimitiveType.PrimitiveType.LINES,
                boundingSphere : BoundingSphere.BoundingSphere.fromPoints(positions)
            });
        };

    function createSimplePolylineGeometry(simplePolylineGeometry, offset) {
        if (when.defined(offset)) {
            simplePolylineGeometry = SimplePolylineGeometry.unpack(simplePolylineGeometry, offset);
        }
        simplePolylineGeometry._ellipsoid = Cartesian2.Ellipsoid.clone(simplePolylineGeometry._ellipsoid);
        return SimplePolylineGeometry.createGeometry(simplePolylineGeometry);
    }

    return createSimplePolylineGeometry;

});

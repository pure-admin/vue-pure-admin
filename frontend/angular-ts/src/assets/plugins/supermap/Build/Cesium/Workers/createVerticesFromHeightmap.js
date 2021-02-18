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
define(['./when-8d13db60', './Check-70bec281', './Math-61ede240', './Cartographic-fe4be337', './Cartesian2-85064f09', './BoundingSphere-775c5788', './Cartesian4-5af5bb24', './RuntimeError-ba10bc3e', './WebGLConstants-4c11ee5f', './ComponentDatatype-5862616f', './FeatureDetection-7bd32c34', './Transforms-913163ed', './buildModuleUrl-9d43158d', './AttributeCompression-84a90a13', './IntersectionTests-397d9494', './Plane-8390418f', './WebMercatorProjection-80c70558', './createTaskProcessorWorker', './EllipsoidTangentPlane-605dc181', './OrientedBoundingBox-64cb80e5', './TerrainEncoding-a807a704'], function (when, Check, _Math, Cartographic, Cartesian2, BoundingSphere, Cartesian4, RuntimeError, WebGLConstants, ComponentDatatype, FeatureDetection, Transforms, buildModuleUrl, AttributeCompression, IntersectionTests, Plane, WebMercatorProjection, createTaskProcessorWorker, EllipsoidTangentPlane, OrientedBoundingBox, TerrainEncoding) { 'use strict';

    /**
         * The encoding that is used for a heightmap
         *
         * @exports HeightmapEncoding
         */
        var HeightmapEncoding = {
            /**
             * No encoding
             *
             * @type {Number}
             * @constant
             */
            NONE: 0,

            /**
             * LERC encoding
             *
             * @type {Number}
             * @constant
             *
             * @see {@link https://github.com/Esri/lerc|The LERC specification}
             */
            LERC: 1
        };
    var HeightmapEncoding$1 = Object.freeze(HeightmapEncoding);

    /**
         * Contains functions to create a mesh from a heightmap image.
         *
         * @exports HeightmapTessellator
         *
         * @private
         */
        var HeightmapTessellator = {};

        /**
         * The default structure of a heightmap, as given to {@link HeightmapTessellator.computeVertices}.
         *
         * @constant
         */
        HeightmapTessellator.DEFAULT_STRUCTURE = Object.freeze({
            heightScale : 1.0,
            heightOffset : 0.0,
            elementsPerHeight : 1,
            stride : 1,
            elementMultiplier : 256.0,
            isBigEndian : false
        });

        var cartesian3Scratch = new Cartographic.Cartesian3();
        var matrix4Scratch = new BoundingSphere.Matrix4();
        var minimumScratch = new Cartographic.Cartesian3();
        var maximumScratch = new Cartographic.Cartesian3();

        /**
         * Fills an array of vertices from a heightmap image.
         *
         * @param {Object} options Object with the following properties:
         * @param {TypedArray} options.heightmap The heightmap to tessellate.
         * @param {Number} options.width The width of the heightmap, in height samples.
         * @param {Number} options.height The height of the heightmap, in height samples.
         * @param {Number} options.skirtHeight The height of skirts to drape at the edges of the heightmap.
         * @param {Rectangle} options.nativeRectangle A rectangle in the native coordinates of the heightmap's projection.  For
         *                 a heightmap with a geographic projection, this is degrees.  For the web mercator
         *                 projection, this is meters.
         * @param {Number} [options.exaggeration=1.0] The scale used to exaggerate the terrain.
         * @param {Rectangle} [options.rectangle] The rectangle covered by the heightmap, in geodetic coordinates with north, south, east and
         *                 west properties in radians.  Either rectangle or nativeRectangle must be provided.  If both
         *                 are provided, they're assumed to be consistent.
         * @param {Boolean} [options.isGeographic=true] True if the heightmap uses a {@link GeographicProjection}, or false if it uses
         *                  a {@link WebMercatorProjection}.
         * @param {Cartesian3} [options.relativeToCenter=Cartesian3.ZERO] The positions will be computed as <code>Cartesian3.subtract(worldPosition, relativeToCenter)</code>.
         * @param {Ellipsoid} [options.ellipsoid=Ellipsoid.WGS84] The ellipsoid to which the heightmap applies.
         * @param {Object} [options.structure] An object describing the structure of the height data.
         * @param {Number} [options.structure.heightScale=1.0] The factor by which to multiply height samples in order to obtain
         *                 the height above the heightOffset, in meters.  The heightOffset is added to the resulting
         *                 height after multiplying by the scale.
         * @param {Number} [options.structure.heightOffset=0.0] The offset to add to the scaled height to obtain the final
         *                 height in meters.  The offset is added after the height sample is multiplied by the
         *                 heightScale.
         * @param {Number} [options.structure.elementsPerHeight=1] The number of elements in the buffer that make up a single height
         *                 sample.  This is usually 1, indicating that each element is a separate height sample.  If
         *                 it is greater than 1, that number of elements together form the height sample, which is
         *                 computed according to the structure.elementMultiplier and structure.isBigEndian properties.
         * @param {Number} [options.structure.stride=1] The number of elements to skip to get from the first element of
         *                 one height to the first element of the next height.
         * @param {Number} [options.structure.elementMultiplier=256.0] The multiplier used to compute the height value when the
         *                 stride property is greater than 1.  For example, if the stride is 4 and the strideMultiplier
         *                 is 256, the height is computed as follows:
         *                 `height = buffer[index] + buffer[index + 1] * 256 + buffer[index + 2] * 256 * 256 + buffer[index + 3] * 256 * 256 * 256`
         *                 This is assuming that the isBigEndian property is false.  If it is true, the order of the
         *                 elements is reversed.
         * @param {Number} [options.structure.lowestEncodedHeight] The lowest value that can be stored in the height buffer.  Any heights that are lower
         *                 than this value after encoding with the `heightScale` and `heightOffset` are clamped to this value.  For example, if the height
         *                 buffer is a `Uint16Array`, this value should be 0 because a `Uint16Array` cannot store negative numbers.  If this parameter is
         *                 not specified, no minimum value is enforced.
         * @param {Number} [options.structure.highestEncodedHeight] The highest value that can be stored in the height buffer.  Any heights that are higher
         *                 than this value after encoding with the `heightScale` and `heightOffset` are clamped to this value.  For example, if the height
         *                 buffer is a `Uint16Array`, this value should be `256 * 256 - 1` or 65535 because a `Uint16Array` cannot store numbers larger
         *                 than 65535.  If this parameter is not specified, no maximum value is enforced.
         * @param {Boolean} [options.structure.isBigEndian=false] Indicates endianness of the elements in the buffer when the
         *                  stride property is greater than 1.  If this property is false, the first element is the
         *                  low-order element.  If it is true, the first element is the high-order element.
         *
         * @example
         * var width = 5;
         * var height = 5;
         * var statistics = Cesium.HeightmapTessellator.computeVertices({
         *     heightmap : [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0],
         *     width : width,
         *     height : height,
         *     skirtHeight : 0.0,
         *     nativeRectangle : {
         *         west : 10.0,
         *         east : 20.0,
         *         south : 30.0,
         *         north : 40.0
         *     }
         * });
         *
         * var encoding = statistics.encoding;
         * var position = encoding.decodePosition(statistics.vertices, index * encoding.getStride());
         */
        HeightmapTessellator.computeVertices = function(options) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(options) || !when.defined(options.heightmap)) {
                throw new Check.DeveloperError('options.heightmap is required.');
            }
            if (!when.defined(options.width) || !when.defined(options.height)) {
                throw new Check.DeveloperError('options.width and options.height are required.');
            }
            if (!when.defined(options.nativeRectangle)) {
                throw new Check.DeveloperError('options.nativeRectangle is required.');
            }
            if (!when.defined(options.skirtHeight)) {
                throw new Check.DeveloperError('options.skirtHeight is required.');
            }
            //>>includeEnd('debug');

            // This function tends to be a performance hotspot for terrain rendering,
            // so it employs a lot of inlining and unrolling as an optimization.
            // In particular, the functionality of Ellipsoid.cartographicToCartesian
            // is inlined.

            var cos = Math.cos;
            var sin = Math.sin;
            var sqrt = Math.sqrt;
            var atan = Math.atan;
            var exp = Math.exp;
            var piOverTwo = _Math.CesiumMath.PI_OVER_TWO;
            var toRadians = _Math.CesiumMath.toRadians;

            var heightmap = options.heightmap;
            var width = options.width;
            var height = options.height;
            var skirtHeight = options.skirtHeight;

            var isGeographic = when.defaultValue(options.isGeographic, true);
            var ellipsoid = when.defaultValue(options.ellipsoid, Cartesian2.Ellipsoid.WGS84);

            var oneOverGlobeSemimajorAxis = 1.0 / ellipsoid.maximumRadius;

            var nativeRectangle = options.nativeRectangle;

            var geographicWest;
            var geographicSouth;
            var geographicEast;
            var geographicNorth;

            var rectangle = options.rectangle;
            if (!when.defined(rectangle)) {
                if (isGeographic) {
                    geographicWest = toRadians(nativeRectangle.west);
                    geographicSouth = toRadians(nativeRectangle.south);
                    geographicEast = toRadians(nativeRectangle.east);
                    geographicNorth = toRadians(nativeRectangle.north);
                } else {
                    geographicWest = nativeRectangle.west * oneOverGlobeSemimajorAxis;
                    geographicSouth = piOverTwo - (2.0 * atan(exp(-nativeRectangle.south * oneOverGlobeSemimajorAxis)));
                    geographicEast = nativeRectangle.east * oneOverGlobeSemimajorAxis;
                    geographicNorth = piOverTwo - (2.0 * atan(exp(-nativeRectangle.north * oneOverGlobeSemimajorAxis)));
                }
            } else {
                geographicWest = rectangle.west;
                geographicSouth = rectangle.south;
                geographicEast = rectangle.east;
                geographicNorth = rectangle.north;
            }

            var relativeToCenter = options.relativeToCenter;
            var hasRelativeToCenter = when.defined(relativeToCenter);
            relativeToCenter = hasRelativeToCenter ? relativeToCenter : Cartographic.Cartesian3.ZERO;
            var exaggeration = when.defaultValue(options.exaggeration, 1.0);
            var includeWebMercatorT = when.defaultValue(options.includeWebMercatorT, false);

            var structure = when.defaultValue(options.structure, HeightmapTessellator.DEFAULT_STRUCTURE);
            var heightScale = when.defaultValue(structure.heightScale, HeightmapTessellator.DEFAULT_STRUCTURE.heightScale);
            var heightOffset = when.defaultValue(structure.heightOffset, HeightmapTessellator.DEFAULT_STRUCTURE.heightOffset);
            var elementsPerHeight = when.defaultValue(structure.elementsPerHeight, HeightmapTessellator.DEFAULT_STRUCTURE.elementsPerHeight);
            var stride = when.defaultValue(structure.stride, HeightmapTessellator.DEFAULT_STRUCTURE.stride);
            var elementMultiplier = when.defaultValue(structure.elementMultiplier, HeightmapTessellator.DEFAULT_STRUCTURE.elementMultiplier);
            var isBigEndian = when.defaultValue(structure.isBigEndian, HeightmapTessellator.DEFAULT_STRUCTURE.isBigEndian);

            var rectangleWidth = Cartesian2.Rectangle.computeWidth(nativeRectangle);
            var rectangleHeight = Cartesian2.Rectangle.computeHeight(nativeRectangle);

            var granularityX = rectangleWidth / (width - 1);
            var granularityY = rectangleHeight / (height - 1);

            if (!isGeographic) {
                rectangleWidth *= oneOverGlobeSemimajorAxis;
                rectangleHeight *= oneOverGlobeSemimajorAxis;
            }

            var radiiSquared = ellipsoid.radiiSquared;
            var radiiSquaredX = radiiSquared.x;
            var radiiSquaredY = radiiSquared.y;
            var radiiSquaredZ = radiiSquared.z;

            var minimumHeight = 65536.0;
            var maximumHeight = -65536.0;

            var fromENU = Transforms.Transforms.eastNorthUpToFixedFrame(relativeToCenter, ellipsoid);
            var toENU = BoundingSphere.Matrix4.inverseTransformation(fromENU, matrix4Scratch);

            var southMercatorY;
            var oneOverMercatorHeight;
            if (includeWebMercatorT) {
                southMercatorY = WebMercatorProjection.WebMercatorProjection.geodeticLatitudeToMercatorAngle(geographicSouth);
                oneOverMercatorHeight = 1.0 / (WebMercatorProjection.WebMercatorProjection.geodeticLatitudeToMercatorAngle(geographicNorth) - southMercatorY);
            }

            var minimum = minimumScratch;
            minimum.x = Number.POSITIVE_INFINITY;
            minimum.y = Number.POSITIVE_INFINITY;
            minimum.z = Number.POSITIVE_INFINITY;

            var maximum = maximumScratch;
            maximum.x = Number.NEGATIVE_INFINITY;
            maximum.y = Number.NEGATIVE_INFINITY;
            maximum.z = Number.NEGATIVE_INFINITY;

            var hMin = Number.POSITIVE_INFINITY;

            var gridVertexCount = width * height;
            var edgeVertexCount = skirtHeight > 0.0 ? (width * 2 + height * 2) : 0;
            var vertexCount = gridVertexCount + edgeVertexCount;

            var positions = new Array(vertexCount);
            var heights = new Array(vertexCount);
            var uvs = new Array(vertexCount);
            var webMercatorTs = includeWebMercatorT ? new Array(vertexCount) : [];

            var startRow = 0;
            var endRow = height;
            var startCol = 0;
            var endCol = width;

            if (skirtHeight > 0.0) {
                --startRow;
                ++endRow;
                --startCol;
                ++endCol;
            }

            var skirtOffsetPercentage = 0.00001;

            for (var rowIndex = startRow; rowIndex < endRow; ++rowIndex) {
                var row = rowIndex;
                if (row < 0) {
                    row = 0;
                }
                if (row >= height) {
                    row = height - 1;
                }

                var latitude = nativeRectangle.north - granularityY * row;

                if (!isGeographic) {
                    latitude = piOverTwo - (2.0 * atan(exp(-latitude * oneOverGlobeSemimajorAxis)));
                } else {
                    latitude = toRadians(latitude);
                }

                var v = (latitude - geographicSouth) / (geographicNorth - geographicSouth);
                v = _Math.CesiumMath.clamp(v, 0.0, 1.0);

                var isNorthEdge = rowIndex === startRow;
                var isSouthEdge = rowIndex === endRow - 1;
                if (skirtHeight > 0.0) {
                    if (isNorthEdge) {
                        latitude += skirtOffsetPercentage * rectangleHeight;
                    } else if (isSouthEdge) {
                        latitude -= skirtOffsetPercentage * rectangleHeight;
                    }
                }

                var cosLatitude = cos(latitude);
                var nZ = sin(latitude);
                var kZ = radiiSquaredZ * nZ;

                var webMercatorT;
                if (includeWebMercatorT) {
                    webMercatorT = (WebMercatorProjection.WebMercatorProjection.geodeticLatitudeToMercatorAngle(latitude) - southMercatorY) * oneOverMercatorHeight;
                }

                for (var colIndex = startCol; colIndex < endCol; ++colIndex) {
                    var col = colIndex;
                    if (col < 0) {
                        col = 0;
                    }
                    if (col >= width) {
                        col = width - 1;
                    }

                    var terrainOffset = row * (width * stride) + col * stride;

                    var heightSample;
                    if (elementsPerHeight === 1) {
                        heightSample = heightmap[terrainOffset];
                    } else {
                        heightSample = 0;

                        var elementOffset;
                        if (isBigEndian) {
                            for (elementOffset = 0; elementOffset < elementsPerHeight; ++elementOffset) {
                                heightSample = (heightSample * elementMultiplier) + heightmap[terrainOffset + elementOffset];
                            }
                        } else {
                            for (elementOffset = elementsPerHeight - 1; elementOffset >= 0; --elementOffset) {
                                heightSample = (heightSample * elementMultiplier) + heightmap[terrainOffset + elementOffset];
                            }
                        }
                    }

                    heightSample = (heightSample * heightScale + heightOffset) * exaggeration;

                    maximumHeight = Math.max(maximumHeight, heightSample);
                    minimumHeight = Math.min(minimumHeight, heightSample);

                    var longitude = nativeRectangle.west + granularityX * col;

                    if (!isGeographic) {
                        longitude = longitude * oneOverGlobeSemimajorAxis;
                    } else {
                        longitude = toRadians(longitude);
                    }

                    var u = (longitude - geographicWest) / (geographicEast - geographicWest);
                    u = _Math.CesiumMath.clamp(u, 0.0, 1.0);

                    var index = row * width + col;

                    if (skirtHeight > 0.0) {
                        var isWestEdge = colIndex === startCol;
                        var isEastEdge = colIndex === endCol - 1;
                        var isEdge = isNorthEdge || isSouthEdge || isWestEdge || isEastEdge;
                        var isCorner = (isNorthEdge || isSouthEdge) && (isWestEdge || isEastEdge);
                        if (isCorner) {
                            // Don't generate skirts on the corners.
                            continue;
                        } else if (isEdge) {
                            heightSample -= skirtHeight;

                            if (isWestEdge) {
                                // The outer loop iterates north to south but the indices are ordered south to north, hence the index flip below
                                index = gridVertexCount + (height - row - 1);
                                longitude -= skirtOffsetPercentage * rectangleWidth;
                            } else if (isSouthEdge) {
                                // Add after west indices. South indices are ordered east to west.
                                index = gridVertexCount + height + (width - col - 1);
                            } else if (isEastEdge) {
                                // Add after west and south indices. East indices are ordered north to south. The index is flipped like above.
                                index = gridVertexCount + height + width + row;
                                longitude += skirtOffsetPercentage * rectangleWidth;
                            } else if (isNorthEdge) {
                                // Add after west, south, and east indices. North indices are ordered west to east.
                                index = gridVertexCount + height + width + height + col;
                            }
                        }
                    }

                    var nX = cosLatitude * cos(longitude);
                    var nY = cosLatitude * sin(longitude);

                    var kX = radiiSquaredX * nX;
                    var kY = radiiSquaredY * nY;

                    var gamma = sqrt((kX * nX) + (kY * nY) + (kZ * nZ));
                    var oneOverGamma = 1.0 / gamma;

                    var rSurfaceX = kX * oneOverGamma;
                    var rSurfaceY = kY * oneOverGamma;
                    var rSurfaceZ = kZ * oneOverGamma;

                    var position = new Cartographic.Cartesian3();
                    position.x = rSurfaceX + nX * heightSample;
                    position.y = rSurfaceY + nY * heightSample;
                    position.z = rSurfaceZ + nZ * heightSample;

                    positions[index] = position;
                    heights[index] = heightSample;
                    uvs[index] = new Cartesian2.Cartesian2(u, v);

                    if (includeWebMercatorT) {
                        webMercatorTs[index] = webMercatorT;
                    }

                    BoundingSphere.Matrix4.multiplyByPoint(toENU, position, cartesian3Scratch);

                    Cartographic.Cartesian3.minimumByComponent(cartesian3Scratch, minimum, minimum);
                    Cartographic.Cartesian3.maximumByComponent(cartesian3Scratch, maximum, maximum);
                    hMin = Math.min(hMin, heightSample);
                }
            }

            var boundingSphere3D = BoundingSphere.BoundingSphere.fromPoints(positions);
            var orientedBoundingBox;
            if (when.defined(rectangle)) {
                orientedBoundingBox = OrientedBoundingBox.OrientedBoundingBox.fromRectangle(rectangle, minimumHeight, maximumHeight, ellipsoid);
            }

            var occludeePointInScaledSpace;
            if (hasRelativeToCenter) {
                var occluder = new TerrainEncoding.EllipsoidalOccluder(ellipsoid);
                occludeePointInScaledSpace = occluder.computeHorizonCullingPointPossiblyUnderEllipsoid(relativeToCenter, positions, minimumHeight);
            }

            var aaBox = new EllipsoidTangentPlane.AxisAlignedBoundingBox(minimum, maximum, relativeToCenter);
            var encoding = new TerrainEncoding.TerrainEncoding(aaBox, hMin, maximumHeight, fromENU, false, includeWebMercatorT);
            var vertices = new Float32Array(vertexCount * encoding.getStride());

            var bufferIndex = 0;
            for (var j = 0; j < vertexCount; ++j) {
                bufferIndex = encoding.encode(vertices, bufferIndex, positions[j], uvs[j], heights[j], undefined, webMercatorTs[j]);
            }

            return {
                vertices : vertices,
                maximumHeight : maximumHeight,
                minimumHeight : minimumHeight,
                encoding : encoding,
                boundingSphere3D : boundingSphere3D,
                orientedBoundingBox : orientedBoundingBox,
                occludeePointInScaledSpace : occludeePointInScaledSpace
            };
        };

    /* jshint forin: false, bitwise: false */
    /*
    Copyright 2015-2018 Esri

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

    A copy of the license and additional notices are located with the
    source distribution at:

    http://github.com/Esri/lerc/

    Contributors:  Johannes Schmid, (LERC v1)
                   Chayanika Khatua, (LERC v1)
                   Wenxue Ju (LERC v1, v2.x)
    */

    /* Copyright 2015-2018 Esri. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 @preserve */

    var tmp = {};

    /**
     * a module for decoding LERC blobs
     * @module Lerc
     */
    (function() {
      //the original LercDecode for Version 1
      var LercDecode = (function() {

        // WARNING: This decoder version can only read old version 1 Lerc blobs. Use with caution.

        // Note: currently, this module only has an implementation for decoding LERC data, not encoding. The name of
        // the class was chosen to be future proof.

        var CntZImage = {};

        CntZImage.defaultNoDataValue = -3.4027999387901484e+38; // smallest Float32 value

        /**
         * Decode a LERC byte stream and return an object containing the pixel data and some required and optional
         * information about it, such as the image's width and height.
         *
         * @param {ArrayBuffer} input The LERC input byte stream
         * @param {object} [options] Decoding options, containing any of the following properties:
         * @config {number} [inputOffset = 0]
         *        Skip the first inputOffset bytes of the input byte stream. A valid LERC file is expected at that position.
         * @config {Uint8Array} [encodedMask = null]
         *        If specified, the decoder will not read mask information from the input and use the specified encoded
         *        mask data instead. Mask header/data must not be present in the LERC byte stream in this case.
         * @config {number} [noDataValue = LercCode.defaultNoDataValue]
         *        Pixel value to use for masked pixels.
         * @config {ArrayBufferView|Array} [pixelType = Float32Array]
         *        The desired type of the pixelData array in the return value. Note that it is the caller's responsibility to
         *        provide an appropriate noDataValue if the default pixelType is overridden.
         * @config {boolean} [returnMask = false]
         *        If true, the return value will contain a maskData property of type Uint8Array which has one element per
         *        pixel, the value of which is 1 or 0 depending on whether that pixel's data is present or masked. If the
         *        input LERC data does not contain a mask, maskData will not be returned.
         * @config {boolean} [returnEncodedMask = false]
         *        If true, the return value will contain a encodedMaskData property, which can be passed into encode() as
         *        encodedMask.
         * @config {boolean} [returnFileInfo = false]
         *        If true, the return value will have a fileInfo property that contains metadata obtained from the
         *        LERC headers and the decoding process.
         * @config {boolean} [computeUsedBitDepths = false]
         *        If true, the fileInfo property in the return value will contain the set of all block bit depths
         *        encountered during decoding. Will only have an effect if returnFileInfo option is true.
         * @returns {{width, height, pixelData, minValue, maxValue, noDataValue, maskData, encodedMaskData, fileInfo}}
         */
        CntZImage.decode = function(input, options) {
          options = options || {};

          var skipMask = options.encodedMaskData || (options.encodedMaskData === null);
          var parsedData = parse(input, options.inputOffset || 0, skipMask);

          var noDataValue = (options.noDataValue !== null) ? options.noDataValue : CntZImage.defaultNoDataValue;

          var uncompressedData = uncompressPixelValues(parsedData, options.pixelType || Float32Array,
            options.encodedMaskData, noDataValue, options.returnMask);

          var result = {
            width: parsedData.width,
            height: parsedData.height,
            pixelData: uncompressedData.resultPixels,
            minValue: uncompressedData.minValue,
            maxValue: parsedData.pixels.maxValue,
            noDataValue: noDataValue
          };

          if (uncompressedData.resultMask) {
            result.maskData = uncompressedData.resultMask;
          }

          if (options.returnEncodedMask && parsedData.mask) {
            result.encodedMaskData = parsedData.mask.bitset ? parsedData.mask.bitset : null;
          }

          if (options.returnFileInfo) {
            result.fileInfo = formatFileInfo(parsedData);
            if (options.computeUsedBitDepths) {
              result.fileInfo.bitDepths = computeUsedBitDepths(parsedData);
            }
          }

          return result;
        };

        var uncompressPixelValues = function(data, TypedArrayClass, maskBitset, noDataValue, storeDecodedMask) {
          var blockIdx = 0;
          var numX = data.pixels.numBlocksX;
          var numY = data.pixels.numBlocksY;
          var blockWidth = Math.floor(data.width / numX);
          var blockHeight = Math.floor(data.height / numY);
          var scale = 2 * data.maxZError;
          var minValue = Number.MAX_VALUE, currentValue;
          maskBitset = maskBitset || ((data.mask) ? data.mask.bitset : null);

          var resultPixels, resultMask;
          resultPixels = new TypedArrayClass(data.width * data.height);
          if (storeDecodedMask && maskBitset) {
            resultMask = new Uint8Array(data.width * data.height);
          }
          var blockDataBuffer = new Float32Array(blockWidth * blockHeight);

          var xx, yy;
          for (var y = 0; y <= numY; y++) {
            var thisBlockHeight = (y !== numY) ? blockHeight : (data.height % numY);
            if (thisBlockHeight === 0) {
              continue;
            }
            for (var x = 0; x <= numX; x++) {
              var thisBlockWidth = (x !== numX) ? blockWidth : (data.width % numX);
              if (thisBlockWidth === 0) {
                continue;
              }

              var outPtr = y * data.width * blockHeight + x * blockWidth;
              var outStride = data.width - thisBlockWidth;

              var block = data.pixels.blocks[blockIdx];

              var blockData, blockPtr, constValue;
              if (block.encoding < 2) {
                // block is either uncompressed or bit-stuffed (encodings 0 and 1)
                if (block.encoding === 0) {
                  // block is uncompressed
                  blockData = block.rawData;
                } else {
                  // block is bit-stuffed
                  unstuff(block.stuffedData, block.bitsPerPixel, block.numValidPixels, block.offset, scale, blockDataBuffer, data.pixels.maxValue);
                  blockData = blockDataBuffer;
                }
                blockPtr = 0;
              }
              else if (block.encoding === 2) {
                // block is all 0
                constValue = 0;
              }
              else {
                // block has constant value (encoding === 3)
                constValue = block.offset;
              }

              var maskByte;
              if (maskBitset) {
                for (yy = 0; yy < thisBlockHeight; yy++) {
                  if (outPtr & 7) {
                    //
                    maskByte = maskBitset[outPtr >> 3];
                    maskByte <<= outPtr & 7;
                  }
                  for (xx = 0; xx < thisBlockWidth; xx++) {
                    if (!(outPtr & 7)) {
                      // read next byte from mask
                      maskByte = maskBitset[outPtr >> 3];
                    }
                    if (maskByte & 128) {
                      // pixel data present
                      if (resultMask) {
                        resultMask[outPtr] = 1;
                      }
                      currentValue = (block.encoding < 2) ? blockData[blockPtr++] : constValue;
                      minValue = minValue > currentValue ? currentValue : minValue;
                      resultPixels[outPtr++] = currentValue;
                    } else {
                      // pixel data not present
                      if (resultMask) {
                        resultMask[outPtr] = 0;
                      }
                      resultPixels[outPtr++] = noDataValue;
                    }
                    maskByte <<= 1;
                  }
                  outPtr += outStride;
                }
              } else {
                // mask not present, simply copy block over
                if (block.encoding < 2) {
                  // duplicating this code block for performance reasons
                  // blockData case:
                  for (yy = 0; yy < thisBlockHeight; yy++) {
                    for (xx = 0; xx < thisBlockWidth; xx++) {
                      currentValue = blockData[blockPtr++];
                      minValue = minValue > currentValue ? currentValue : minValue;
                      resultPixels[outPtr++] = currentValue;
                    }
                    outPtr += outStride;
                  }
                }
                else {
                  // constValue case:
                  minValue = minValue > constValue ? constValue : minValue;
                  for (yy = 0; yy < thisBlockHeight; yy++) {
                    for (xx = 0; xx < thisBlockWidth; xx++) {
                      resultPixels[outPtr++] = constValue;
                    }
                    outPtr += outStride;
                  }
                }
              }
              if ((block.encoding === 1) && (blockPtr !== block.numValidPixels)) {
                throw "Block and Mask do not match";
              }
              blockIdx++;
            }
          }

          return {
            resultPixels: resultPixels,
            resultMask: resultMask,
            minValue: minValue
          };
        };

        var formatFileInfo = function(data) {
          return {
            "fileIdentifierString": data.fileIdentifierString,
            "fileVersion": data.fileVersion,
            "imageType": data.imageType,
            "height": data.height,
            "width": data.width,
            "maxZError": data.maxZError,
            "eofOffset": data.eofOffset,
            "mask": data.mask ? {
              "numBlocksX": data.mask.numBlocksX,
              "numBlocksY": data.mask.numBlocksY,
              "numBytes": data.mask.numBytes,
              "maxValue": data.mask.maxValue
            } : null,
            "pixels": {
              "numBlocksX": data.pixels.numBlocksX,
              "numBlocksY": data.pixels.numBlocksY,
              "numBytes": data.pixels.numBytes,
              "maxValue": data.pixels.maxValue,
              "noDataValue": data.noDataValue
            }
          };
        };

        var computeUsedBitDepths = function(data) {
          var numBlocks = data.pixels.numBlocksX * data.pixels.numBlocksY;
          var bitDepths = {};
          for (var i = 0; i < numBlocks; i++) {
            var block = data.pixels.blocks[i];
            if (block.encoding === 0) {
              bitDepths.float32 = true;
            } else if (block.encoding === 1) {
              bitDepths[block.bitsPerPixel] = true;
            } else {
              bitDepths[0] = true;
            }
          }

          return Object.keys(bitDepths);
        };

        var parse = function(input, fp, skipMask) {
          var data = {};

          // File header
          var fileIdView = new Uint8Array(input, fp, 10);
          data.fileIdentifierString = String.fromCharCode.apply(null, fileIdView);
          if (data.fileIdentifierString.trim() !== "CntZImage") {
            throw "Unexpected file identifier string: " + data.fileIdentifierString;
          }
          fp += 10;
          var view = new DataView(input, fp, 24);
          data.fileVersion = view.getInt32(0, true);
          data.imageType = view.getInt32(4, true);
          data.height = view.getUint32(8, true);
          data.width = view.getUint32(12, true);
          data.maxZError = view.getFloat64(16, true);
          fp += 24;

          // Mask Header
          if (!skipMask) {
            view = new DataView(input, fp, 16);
            data.mask = {};
            data.mask.numBlocksY = view.getUint32(0, true);
            data.mask.numBlocksX = view.getUint32(4, true);
            data.mask.numBytes = view.getUint32(8, true);
            data.mask.maxValue = view.getFloat32(12, true);
            fp += 16;

            // Mask Data
            if (data.mask.numBytes > 0) {
              var bitset = new Uint8Array(Math.ceil(data.width * data.height / 8));
              view = new DataView(input, fp, data.mask.numBytes);
              var cnt = view.getInt16(0, true);
              var ip = 2, op = 0;
              do {
                if (cnt > 0) {
                  while (cnt--) { bitset[op++] = view.getUint8(ip++); }
                } else {
                  var val = view.getUint8(ip++);
                  cnt = -cnt;
                  while (cnt--) { bitset[op++] = val; }
                }
                cnt = view.getInt16(ip, true);
                ip += 2;
              } while (ip < data.mask.numBytes);
              if ((cnt !== -32768) || (op < bitset.length)) {
                throw "Unexpected end of mask RLE encoding";
              }
              data.mask.bitset = bitset;
              fp += data.mask.numBytes;
            }
            else if ((data.mask.numBytes | data.mask.numBlocksY | data.mask.maxValue) === 0) {  // Special case, all nodata
              data.mask.bitset = new Uint8Array(Math.ceil(data.width * data.height / 8));
            }
          }

          // Pixel Header
          view = new DataView(input, fp, 16);
          data.pixels = {};
          data.pixels.numBlocksY = view.getUint32(0, true);
          data.pixels.numBlocksX = view.getUint32(4, true);
          data.pixels.numBytes = view.getUint32(8, true);
          data.pixels.maxValue = view.getFloat32(12, true);
          fp += 16;

          var numBlocksX = data.pixels.numBlocksX;
          var numBlocksY = data.pixels.numBlocksY;
          // the number of blocks specified in the header does not take into account the blocks at the end of
          // each row/column with a special width/height that make the image complete in case the width is not
          // evenly divisible by the number of blocks.
          var actualNumBlocksX = numBlocksX + ((data.width % numBlocksX) > 0 ? 1 : 0);
          var actualNumBlocksY = numBlocksY + ((data.height % numBlocksY) > 0 ? 1 : 0);
          data.pixels.blocks = new Array(actualNumBlocksX * actualNumBlocksY);
          var blockI = 0;
          for (var blockY = 0; blockY < actualNumBlocksY; blockY++) {
            for (var blockX = 0; blockX < actualNumBlocksX; blockX++) {

              // Block
              var size = 0;
              var bytesLeft = input.byteLength - fp;
              view = new DataView(input, fp, Math.min(10, bytesLeft));
              var block = {};
              data.pixels.blocks[blockI++] = block;
              var headerByte = view.getUint8(0); size++;
              block.encoding = headerByte & 63;
              if (block.encoding > 3) {
                throw "Invalid block encoding (" + block.encoding + ")";
              }
              if (block.encoding === 2) {
                fp++;
                continue;
              }
              if ((headerByte !== 0) && (headerByte !== 2)) {
                headerByte >>= 6;
                block.offsetType = headerByte;
                if (headerByte === 2) {
                  block.offset = view.getInt8(1); size++;
                } else if (headerByte === 1) {
                  block.offset = view.getInt16(1, true); size += 2;
                } else if (headerByte === 0) {
                  block.offset = view.getFloat32(1, true); size += 4;
                } else {
                  throw "Invalid block offset type";
                }

                if (block.encoding === 1) {
                  headerByte = view.getUint8(size); size++;
                  block.bitsPerPixel = headerByte & 63;
                  headerByte >>= 6;
                  block.numValidPixelsType = headerByte;
                  if (headerByte === 2) {
                    block.numValidPixels = view.getUint8(size); size++;
                  } else if (headerByte === 1) {
                    block.numValidPixels = view.getUint16(size, true); size += 2;
                  } else if (headerByte === 0) {
                    block.numValidPixels = view.getUint32(size, true); size += 4;
                  } else {
                    throw "Invalid valid pixel count type";
                  }
                }
              }
              fp += size;

              if (block.encoding === 3) {
                continue;
              }

              var arrayBuf, store8;
              if (block.encoding === 0) {
                var numPixels = (data.pixels.numBytes - 1) / 4;
                if (numPixels !== Math.floor(numPixels)) {
                  throw "uncompressed block has invalid length";
                }
                arrayBuf = new ArrayBuffer(numPixels * 4);
                store8 = new Uint8Array(arrayBuf);
                store8.set(new Uint8Array(input, fp, numPixels * 4));
                var rawData = new Float32Array(arrayBuf);
                block.rawData = rawData;
                fp += numPixels * 4;
              } else if (block.encoding === 1) {
                var dataBytes = Math.ceil(block.numValidPixels * block.bitsPerPixel / 8);
                var dataWords = Math.ceil(dataBytes / 4);
                arrayBuf = new ArrayBuffer(dataWords * 4);
                store8 = new Uint8Array(arrayBuf);
                store8.set(new Uint8Array(input, fp, dataBytes));
                block.stuffedData = new Uint32Array(arrayBuf);
                fp += dataBytes;
              }
            }
          }
          data.eofOffset = fp;
          return data;
        };

        var unstuff = function(src, bitsPerPixel, numPixels, offset, scale, dest, maxValue) {
          var bitMask = (1 << bitsPerPixel) - 1;
          var i = 0, o;
          var bitsLeft = 0;
          var n, buffer;
          var nmax = Math.ceil((maxValue - offset) / scale);
          // get rid of trailing bytes that are already part of next block
          var numInvalidTailBytes = src.length * 4 - Math.ceil(bitsPerPixel * numPixels / 8);
          src[src.length - 1] <<= 8 * numInvalidTailBytes;

          for (o = 0; o < numPixels; o++) {
            if (bitsLeft === 0) {
              buffer = src[i++];
              bitsLeft = 32;
            }
            if (bitsLeft >= bitsPerPixel) {
              n = (buffer >>> (bitsLeft - bitsPerPixel)) & bitMask;
              bitsLeft -= bitsPerPixel;
            } else {
              var missingBits = (bitsPerPixel - bitsLeft);
              n = ((buffer & bitMask) << missingBits) & bitMask;
              buffer = src[i++];
              bitsLeft = 32 - missingBits;
              n += (buffer >>> bitsLeft);
            }
            //pixel values may exceed max due to quantization
            dest[o] = n < nmax ? offset + n * scale : maxValue;
          }
          return dest;
        };

        return CntZImage;
      })();

      //version 2. Supports 2.1, 2.2, 2.3
      var Lerc2Decode = (function() {
        // Note: currently, this module only has an implementation for decoding LERC data, not encoding. The name of
        // the class was chosen to be future proof, following LercDecode.

        /*****************************************
        * private static class bitsutffer used by Lerc2Decode
        *******************************************/
        var BitStuffer = {
          //methods ending with 2 are for the new byte order used by Lerc2.3 and above.
          //originalUnstuff is used to unpack Huffman code table. code is duplicated to unstuffx for performance reasons.
          unstuff: function(src, dest, bitsPerPixel, numPixels, lutArr, offset, scale, maxValue) {
            var bitMask = (1 << bitsPerPixel) - 1;
            var i = 0, o;
            var bitsLeft = 0;
            var n, buffer, missingBits, nmax;

            // get rid of trailing bytes that are already part of next block
            var numInvalidTailBytes = src.length * 4 - Math.ceil(bitsPerPixel * numPixels / 8);
            src[src.length - 1] <<= 8 * numInvalidTailBytes;
            if (lutArr) {
              for (o = 0; o < numPixels; o++) {
                if (bitsLeft === 0) {
                  buffer = src[i++];
                  bitsLeft = 32;
                }
                if (bitsLeft >= bitsPerPixel) {
                  n = (buffer >>> (bitsLeft - bitsPerPixel)) & bitMask;
                  bitsLeft -= bitsPerPixel;
                }
                else {
                  missingBits = (bitsPerPixel - bitsLeft);
                  n = ((buffer & bitMask) << missingBits) & bitMask;
                  buffer = src[i++];
                  bitsLeft = 32 - missingBits;
                  n += (buffer >>> bitsLeft);
                }
                dest[o] = lutArr[n];//offset + lutArr[n] * scale;
              }
            }
            else {
              nmax = Math.ceil((maxValue - offset) / scale);
              for (o = 0; o < numPixels; o++) {
                if (bitsLeft === 0) {
                  buffer = src[i++];
                  bitsLeft = 32;
                }
                if (bitsLeft >= bitsPerPixel) {
                  n = (buffer >>> (bitsLeft - bitsPerPixel)) & bitMask;
                  bitsLeft -= bitsPerPixel;
                }
                else {
                  missingBits = (bitsPerPixel - bitsLeft);
                  n = ((buffer & bitMask) << missingBits) & bitMask;
                  buffer = src[i++];
                  bitsLeft = 32 - missingBits;
                  n += (buffer >>> bitsLeft);
                }
                //pixel values may exceed max due to quantization
                dest[o] = n < nmax ? offset + n * scale : maxValue;
              }
            }
          },

          unstuffLUT: function(src, bitsPerPixel, numPixels, offset, scale, maxValue) {
            var bitMask = (1 << bitsPerPixel) - 1;
            var i = 0, o = 0, missingBits = 0, bitsLeft = 0, n = 0;
            var buffer;
            var dest = [];

            // get rid of trailing bytes that are already part of next block
            var numInvalidTailBytes = src.length * 4 - Math.ceil(bitsPerPixel * numPixels / 8);
            src[src.length - 1] <<= 8 * numInvalidTailBytes;

            var nmax = Math.ceil((maxValue - offset) / scale);
            for (o = 0; o < numPixels; o++) {
              if (bitsLeft === 0) {
                buffer = src[i++];
                bitsLeft = 32;
              }
              if (bitsLeft >= bitsPerPixel) {
                n = (buffer >>> (bitsLeft - bitsPerPixel)) & bitMask;
                bitsLeft -= bitsPerPixel;
              } else {
                missingBits = (bitsPerPixel - bitsLeft);
                n = ((buffer & bitMask) << missingBits) & bitMask;
                buffer = src[i++];
                bitsLeft = 32 - missingBits;
                n += (buffer >>> bitsLeft);
              }
              //dest.push(n);
              dest[o] = n < nmax ? offset + n * scale : maxValue;
            }
            dest.unshift(offset);//1st one
            return dest;
          },

          unstuff2: function(src, dest, bitsPerPixel, numPixels, lutArr, offset, scale, maxValue) {
            var bitMask = (1 << bitsPerPixel) - 1;
            var i = 0, o;
            var bitsLeft = 0, bitPos = 0;
            var n, buffer, missingBits;
            if (lutArr) {
              for (o = 0; o < numPixels; o++) {
                if (bitsLeft === 0) {
                  buffer = src[i++];
                  bitsLeft = 32;
                  bitPos = 0;
                }
                if (bitsLeft >= bitsPerPixel) {
                  n = ((buffer >>> bitPos) & bitMask);
                  bitsLeft -= bitsPerPixel;
                  bitPos += bitsPerPixel;
                } else {
                  missingBits = (bitsPerPixel - bitsLeft);
                  n = (buffer >>> bitPos) & bitMask;
                  buffer = src[i++];
                  bitsLeft = 32 - missingBits;
                  n |= (buffer & ((1 << missingBits) - 1)) << (bitsPerPixel - missingBits);
                  bitPos = missingBits;
                }
                dest[o] = lutArr[n];
              }
            }
            else {
              var nmax = Math.ceil((maxValue - offset) / scale);
              for (o = 0; o < numPixels; o++) {
                if (bitsLeft === 0) {
                  buffer = src[i++];
                  bitsLeft = 32;
                  bitPos = 0;
                }
                if (bitsLeft >= bitsPerPixel) {
                  //no unsigned left shift
                  n = ((buffer >>> bitPos) & bitMask);
                  bitsLeft -= bitsPerPixel;
                  bitPos += bitsPerPixel;
                } else {
                  missingBits = (bitsPerPixel - bitsLeft);
                  n = (buffer >>> bitPos) & bitMask;//((buffer & bitMask) << missingBits) & bitMask;
                  buffer = src[i++];
                  bitsLeft = 32 - missingBits;
                  n |= (buffer & ((1 << missingBits) - 1)) << (bitsPerPixel - missingBits);
                  bitPos = missingBits;
                }
                //pixel values may exceed max due to quantization
                dest[o] = n < nmax ? offset + n * scale : maxValue;
              }
            }
            return dest;
          },

          unstuffLUT2: function(src, bitsPerPixel, numPixels, offset, scale, maxValue) {
            var bitMask = (1 << bitsPerPixel) - 1;
            var i = 0, o = 0, missingBits = 0, bitsLeft = 0, n = 0, bitPos = 0;
            var buffer;
            var dest = [];
            var nmax = Math.ceil((maxValue - offset) / scale);
            for (o = 0; o < numPixels; o++) {
              if (bitsLeft === 0) {
                buffer = src[i++];
                bitsLeft = 32;
                bitPos = 0;
              }
              if (bitsLeft >= bitsPerPixel) {
                //no unsigned left shift
                n = ((buffer >>> bitPos) & bitMask);
                bitsLeft -= bitsPerPixel;
                bitPos += bitsPerPixel;
              } else {
                missingBits = (bitsPerPixel - bitsLeft);
                n = (buffer >>> bitPos) & bitMask;//((buffer & bitMask) << missingBits) & bitMask;
                buffer = src[i++];
                bitsLeft = 32 - missingBits;
                n |= (buffer & ((1 << missingBits) - 1)) << (bitsPerPixel - missingBits);
                bitPos = missingBits;
              }
              //dest.push(n);
              dest[o] = n < nmax ? offset + n * scale : maxValue;
            }
            dest.unshift(offset);
            return dest;
          },

          originalUnstuff: function(src, dest, bitsPerPixel, numPixels) {
            var bitMask = (1 << bitsPerPixel) - 1;
            var i = 0, o;
            var bitsLeft = 0;
            var n, buffer, missingBits;

            // get rid of trailing bytes that are already part of next block
            var numInvalidTailBytes = src.length * 4 - Math.ceil(bitsPerPixel * numPixels / 8);
            src[src.length - 1] <<= 8 * numInvalidTailBytes;

            for (o = 0; o < numPixels; o++) {
              if (bitsLeft === 0) {
                buffer = src[i++];
                bitsLeft = 32;
              }
              if (bitsLeft >= bitsPerPixel) {
                n = (buffer >>> (bitsLeft - bitsPerPixel)) & bitMask;
                bitsLeft -= bitsPerPixel;
              }
              else {
                missingBits = (bitsPerPixel - bitsLeft);
                n = ((buffer & bitMask) << missingBits) & bitMask;
                buffer = src[i++];
                bitsLeft = 32 - missingBits;
                n += (buffer >>> bitsLeft);
              }
              dest[o] = n;
            }
            return dest;
          },

          originalUnstuff2: function(src, dest, bitsPerPixel, numPixels) {
            var bitMask = (1 << bitsPerPixel) - 1;
            var i = 0, o;
            var bitsLeft = 0, bitPos = 0;
            var n, buffer, missingBits;
            //micro-optimizations
            for (o = 0; o < numPixels; o++) {
              if (bitsLeft === 0) {
                buffer = src[i++];
                bitsLeft = 32;
                bitPos = 0;
              }
              if (bitsLeft >= bitsPerPixel) {
                //no unsigned left shift
                n = ((buffer >>> bitPos) & bitMask);
                bitsLeft -= bitsPerPixel;
                bitPos += bitsPerPixel;
              } else {
                missingBits = (bitsPerPixel - bitsLeft);
                n = (buffer >>> bitPos) & bitMask;//((buffer & bitMask) << missingBits) & bitMask;
                buffer = src[i++];
                bitsLeft = 32 - missingBits;
                n |= (buffer & ((1 << missingBits) - 1)) << (bitsPerPixel - missingBits);
                bitPos = missingBits;
              }
              dest[o] = n;
            }
            return dest;
          }
        };

        /*****************************************
        *private static class used by Lerc2Decode
        ******************************************/
        var Lerc2Helpers = {
          HUFFMAN_LUT_BITS_MAX: 12, //use 2^12 lut, treat it like constant
          computeChecksumFletcher32: function(input) {

            var sum1 = 0xffff, sum2 = 0xffff;
            var len = input.length;
            var words = Math.floor(len / 2);
            var i = 0;
            while (words) {
              var tlen = (words >= 359) ? 359 : words;
              words -= tlen;
              do {
                sum1 += (input[i++] << 8);
                sum2 += sum1 += input[i++];
              } while (--tlen);

              sum1 = (sum1 & 0xffff) + (sum1 >>> 16);
              sum2 = (sum2 & 0xffff) + (sum2 >>> 16);
            }

            // add the straggler byte if it exists
            if (len & 1) {
              sum2 += sum1 += (input[i] << 8);
            }
            // second reduction step to reduce sums to 16 bits
            sum1 = (sum1 & 0xffff) + (sum1 >>> 16);
            sum2 = (sum2 & 0xffff) + (sum2 >>> 16);

            return (sum2 << 16 | sum1) >>> 0;
          },

          readHeaderInfo: function(input, data) {
            var ptr = data.ptr;
            var fileIdView = new Uint8Array(input, ptr, 6);
            var headerInfo = {};
            headerInfo.fileIdentifierString = String.fromCharCode.apply(null, fileIdView);
            if (headerInfo.fileIdentifierString.lastIndexOf("Lerc2", 0) !== 0) {
              throw "Unexpected file identifier string (expect Lerc2 ): " + headerInfo.fileIdentifierString;
            }
            ptr += 6;
            var view = new DataView(input, ptr, 8);
            var fileVersion = view.getInt32(0, true);
            headerInfo.fileVersion = fileVersion;
            ptr += 4;
            if (fileVersion >= 3) {
              headerInfo.checksum = view.getUint32(4, true); //nrows
              ptr += 4;
            }

            //keys start from here
            view = new DataView(input, ptr, 12);
            headerInfo.height = view.getUint32(0, true); //nrows
            headerInfo.width = view.getUint32(4, true); //ncols
            ptr += 8;
            if (fileVersion >= 4) {
              headerInfo.numDims = view.getUint32(8, true);
              ptr += 4;
            }
            else {
              headerInfo.numDims = 1;
            }

            view = new DataView(input, ptr, 40);
            headerInfo.numValidPixel = view.getUint32(0, true);
            headerInfo.microBlockSize = view.getInt32(4, true);
            headerInfo.blobSize = view.getInt32(8, true);
            headerInfo.imageType = view.getInt32(12, true);

            headerInfo.maxZError = view.getFloat64(16, true);
            headerInfo.zMin = view.getFloat64(24, true);
            headerInfo.zMax = view.getFloat64(32, true);
            ptr += 40;
            data.headerInfo = headerInfo;
            data.ptr = ptr;

            var checksum, keyLength;
            if (fileVersion >= 3) {
              keyLength = fileVersion >= 4 ? 52 : 48;
              checksum = this.computeChecksumFletcher32(new Uint8Array(input, ptr - keyLength, headerInfo.blobSize - 14));
              if (checksum !== headerInfo.checksum) {
                throw "Checksum failed.";
              }
            }
            return true;
          },

          checkMinMaxRanges: function(input, data) {
            var headerInfo = data.headerInfo;
            var OutPixelTypeArray = this.getDataTypeArray(headerInfo.imageType);
            var rangeBytes = headerInfo.numDims * this.getDataTypeSize(headerInfo.imageType);
            var minValues = this.readSubArray(input, data.ptr, OutPixelTypeArray, rangeBytes);
            var maxValues = this.readSubArray(input, data.ptr + rangeBytes, OutPixelTypeArray, rangeBytes);
            data.ptr += (2 * rangeBytes);
            var i, equal = true;
            for (i = 0; i < headerInfo.numDims; i++) {
              if (minValues[i] !== maxValues[i]) {
                equal = false;
                break;
              }
            }
            headerInfo.minValues = minValues;
            headerInfo.maxValues = maxValues;
            return equal;
          },

          readSubArray: function(input, ptr, OutPixelTypeArray, numBytes) {
            var rawData;
            if (OutPixelTypeArray === Uint8Array) {
              rawData = new Uint8Array(input, ptr, numBytes);
            }
            else {
              var arrayBuf = new ArrayBuffer(numBytes);
              var store8 = new Uint8Array(arrayBuf);
              store8.set(new Uint8Array(input, ptr, numBytes));
              rawData = new OutPixelTypeArray(arrayBuf);
            }
            return rawData;
          },

          readMask: function(input, data) {
            var ptr = data.ptr;
            var headerInfo = data.headerInfo;
            var numPixels = headerInfo.width * headerInfo.height;
            var numValidPixel = headerInfo.numValidPixel;

            var view = new DataView(input, ptr, 4);
            var mask = {};
            mask.numBytes = view.getUint32(0, true);
            ptr += 4;

            // Mask Data
            if ((0 === numValidPixel || numPixels === numValidPixel) && 0 !== mask.numBytes) {
              throw ("invalid mask");
            }
            var bitset, resultMask;
            if (numValidPixel === 0) {
              bitset = new Uint8Array(Math.ceil(numPixels / 8));
              mask.bitset = bitset;
              resultMask = new Uint8Array(numPixels);
              data.pixels.resultMask = resultMask;
              ptr += mask.numBytes;
            }// ????? else if (data.mask.numBytes > 0 && data.mask.numBytes< data.numValidPixel) {
            else if (mask.numBytes > 0) {
              bitset = new Uint8Array(Math.ceil(numPixels / 8));
              view = new DataView(input, ptr, mask.numBytes);
              var cnt = view.getInt16(0, true);
              var ip = 2, op = 0, val = 0;
              do {
                if (cnt > 0) {
                  while (cnt--) { bitset[op++] = view.getUint8(ip++); }
                } else {
                  val = view.getUint8(ip++);
                  cnt = -cnt;
                  while (cnt--) { bitset[op++] = val; }
                }
                cnt = view.getInt16(ip, true);
                ip += 2;
              } while (ip < mask.numBytes);
              if ((cnt !== -32768) || (op < bitset.length)) {
                throw "Unexpected end of mask RLE encoding";
              }

              resultMask = new Uint8Array(numPixels);
              var mb = 0, k = 0;

              for (k = 0; k < numPixels; k++) {
                if (k & 7) {
                  mb = bitset[k >> 3];
                  mb <<= k & 7;
                }
                else {
                  mb = bitset[k >> 3];
                }
                if (mb & 128) {
                  resultMask[k] = 1;
                }
              }
              data.pixels.resultMask = resultMask;

              mask.bitset = bitset;
              ptr += mask.numBytes;
            }
            data.ptr = ptr;
            data.mask = mask;
            return true;
          },

          readDataOneSweep: function(input, data, OutPixelTypeArray) {
            var ptr = data.ptr;
            var headerInfo = data.headerInfo;
            var numDims = headerInfo.numDims;
            var numPixels = headerInfo.width * headerInfo.height;
            var imageType = headerInfo.imageType;
            var numBytes = headerInfo.numValidPixel * Lerc2Helpers.getDataTypeSize(imageType) * numDims;
            //data.pixels.numBytes = numBytes;
            var rawData;
            var mask = data.pixels.resultMask;
            if (OutPixelTypeArray === Uint8Array) {
              rawData = new Uint8Array(input, ptr, numBytes);
            }
            else {
              var arrayBuf = new ArrayBuffer(numBytes);
              var store8 = new Uint8Array(arrayBuf);
              store8.set(new Uint8Array(input, ptr, numBytes));
              rawData = new OutPixelTypeArray(arrayBuf);
            }
            if (rawData.length === numPixels * numDims) {
              data.pixels.resultPixels = rawData;
            }
            else  //mask
            {
              data.pixels.resultPixels = new OutPixelTypeArray(numPixels * numDims);
              var z = 0, k = 0, i = 0, nStart = 0;
              if (numDims > 1) {
                for (i=0; i < numDims; i++) {
                  nStart = i * numPixels;
                  for (k = 0; k < numPixels; k++) {
                    if (mask[k]) {
                      data.pixels.resultPixels[nStart + k] = rawData[z++];
                    }
                  }
                }
              }
              else {
                for (k = 0; k < numPixels; k++) {
                  if (mask[k]) {
                    data.pixels.resultPixels[k] = rawData[z++];
                  }
                }
              }
            }
            ptr += numBytes;
            data.ptr = ptr;       //return data;
            return true;
          },

          readHuffmanTree: function(input, data) {
            var BITS_MAX = this.HUFFMAN_LUT_BITS_MAX; //8 is slow for the large test image
            //var size_max = 1 << BITS_MAX;
            /* ************************
             * reading code table
             *************************/
            var view = new DataView(input, data.ptr, 16);
            data.ptr += 16;
            var version = view.getInt32(0, true);
            if (version < 2) {
              throw "unsupported Huffman version";
            }
            var size = view.getInt32(4, true);
            var i0 = view.getInt32(8, true);
            var i1 = view.getInt32(12, true);
            if (i0 >= i1) {
              return false;
            }
            var blockDataBuffer = new Uint32Array(i1 - i0);
            Lerc2Helpers.decodeBits(input, data, blockDataBuffer);
            var codeTable = []; //size
            var i, j, k, len;

            for (i = i0; i < i1; i++) {
              j = i - (i < size ? 0 : size);//wrap around
              codeTable[j] = { first: blockDataBuffer[i - i0], second: null };
            }

            var dataBytes = input.byteLength - data.ptr;
            var dataWords = Math.ceil(dataBytes / 4);
            var arrayBuf = new ArrayBuffer(dataWords * 4);
            var store8 = new Uint8Array(arrayBuf);
            store8.set(new Uint8Array(input, data.ptr, dataBytes));
            var stuffedData = new Uint32Array(arrayBuf); //must start from x*4
            var bitPos = 0, word, srcPtr = 0;
            word = stuffedData[0];
            for (i = i0; i < i1; i++) {
              j = i - (i < size ? 0 : size);//wrap around
              len = codeTable[j].first;
              if (len > 0) {
                codeTable[j].second = (word << bitPos) >>> (32 - len);

                if (32 - bitPos >= len) {
                  bitPos += len;
                  if (bitPos === 32) {
                    bitPos = 0;
                    srcPtr++;
                    word = stuffedData[srcPtr];
                  }
                }
                else {
                  bitPos += len - 32;
                  srcPtr++;
                  word = stuffedData[srcPtr];
                  codeTable[j].second |= word >>> (32 - bitPos);
                }
              }
            }

            //finished reading code table

            /* ************************
             * building lut
             *************************/
            var numBitsLUT = 0, numBitsLUTQick = 0;
            var tree = new TreeNode();
            for (i = 0; i < codeTable.length; i++) {
              if (codeTable[i] !== undefined) {
                numBitsLUT = Math.max(numBitsLUT, codeTable[i].first);
              }
            }
            if (numBitsLUT >= BITS_MAX) {
              numBitsLUTQick = BITS_MAX;
            }
            else {
              numBitsLUTQick = numBitsLUT;
            }
            if (numBitsLUT >= 30) {
              console.log("WARning, large NUM LUT BITS IS " + numBitsLUT);
            }
            var decodeLut = [], entry, code, numEntries, jj, currentBit, node;
            for (i = i0; i < i1; i++) {
              j = i - (i < size ? 0 : size);//wrap around
              len = codeTable[j].first;
              if (len > 0) {
                entry = [len, j];
                if (len <= numBitsLUTQick) {
                  code = codeTable[j].second << (numBitsLUTQick - len);
                  numEntries = 1 << (numBitsLUTQick - len);
                  for (k = 0; k < numEntries; k++) {
                    decodeLut[code | k] = entry;
                  }
                }
                else {
                  //build tree
                  code = codeTable[j].second;
                  node = tree;
                  for (jj = len - 1; jj >= 0; jj--) {
                    currentBit = code >>> jj & 1; //no left shift as length could be 30,31
                    if (currentBit) {
                      if (!node.right) {
                        node.right = new TreeNode();
                      }
                      node = node.right;
                    }
                    else {
                      if (!node.left) {
                        node.left = new TreeNode();
                      }
                      node = node.left;
                    }
                    if (jj === 0 && !node.val) {
                      node.val = entry[1];
                    }
                  }
                }
              }
            }
            return {
              decodeLut: decodeLut,
              numBitsLUTQick: numBitsLUTQick,
              numBitsLUT: numBitsLUT,
              tree: tree,
              stuffedData: stuffedData,
              srcPtr: srcPtr,
              bitPos: bitPos
            };
          },

          readHuffman: function(input, data, OutPixelTypeArray) {
            var headerInfo = data.headerInfo;
            var numDims = headerInfo.numDims;
            var height = data.headerInfo.height;
            var width = data.headerInfo.width;
            var numPixels = width * height;
            //var size_max = 1 << BITS_MAX;
            /* ************************
             * reading huffman structure info
             *************************/
            var huffmanInfo = this.readHuffmanTree(input, data);
            var decodeLut = huffmanInfo.decodeLut;
            var tree = huffmanInfo.tree;
            //stuffedData includes huffman headers
            var stuffedData = huffmanInfo.stuffedData;
            var srcPtr = huffmanInfo.srcPtr;
            var bitPos = huffmanInfo.bitPos;
            var numBitsLUTQick = huffmanInfo.numBitsLUTQick;
            var numBitsLUT = huffmanInfo.numBitsLUT;
            var offset = data.headerInfo.imageType === 0 ? 128 : 0;
            /*************************
            *  decode
            ***************************/
            var node, val, delta, mask = data.pixels.resultMask, valTmp, valTmpQuick, currentBit;
            var i, j, k, ii;
            var prevVal = 0;
            if (bitPos > 0) {
              srcPtr++;
              bitPos = 0;
            }
            var word = stuffedData[srcPtr];
            var deltaEncode = data.encodeMode === 1;
            var resultPixelsAllDim = new OutPixelTypeArray(numPixels * numDims);
            var resultPixels = resultPixelsAllDim;
            var iDim;
            for (iDim = 0; iDim < headerInfo.numDims; iDim++) {
              if (numDims > 1) {
                //get the mem block of current dimension
                resultPixels = new OutPixelTypeArray(resultPixelsAllDim.buffer, numPixels * iDim, numPixels);
                prevVal = 0;
              }
              if (data.headerInfo.numValidPixel === width * height) { //all valid
                for (k = 0, i = 0; i < height; i++) {
                  for (j = 0; j < width; j++, k++) {
                    val = 0;
                    valTmp = (word << bitPos) >>> (32 - numBitsLUTQick);
                    valTmpQuick = valTmp;// >>> deltaBits;
                    if (32 - bitPos < numBitsLUTQick) {
                      valTmp |= ((stuffedData[srcPtr + 1]) >>> (64 - bitPos - numBitsLUTQick));
                      valTmpQuick = valTmp;// >>> deltaBits;
                    }
                    if (decodeLut[valTmpQuick])    // if there, move the correct number of bits and done
                    {
                      val = decodeLut[valTmpQuick][1];
                      bitPos += decodeLut[valTmpQuick][0];
                    }
                    else {
                      valTmp = (word << bitPos) >>> (32 - numBitsLUT);
                      valTmpQuick = valTmp;// >>> deltaBits;
                      if (32 - bitPos < numBitsLUT) {
                        valTmp |= ((stuffedData[srcPtr + 1]) >>> (64 - bitPos - numBitsLUT));
                        valTmpQuick = valTmp;// >>> deltaBits;
                      }
                      node = tree;
                      for (ii = 0; ii < numBitsLUT; ii++) {
                        currentBit = valTmp >>> (numBitsLUT - ii - 1) & 1;
                        node = currentBit ? node.right : node.left;
                        if (!(node.left || node.right)) {
                          val = node.val;
                          bitPos = bitPos + ii + 1;
                          break;
                        }
                      }
                    }

                    if (bitPos >= 32) {
                      bitPos -= 32;
                      srcPtr++;
                      word = stuffedData[srcPtr];
                    }

                    delta = val - offset;
                    if (deltaEncode) {
                      if (j > 0) {
                        delta += prevVal;    // use overflow
                      }
                      else if (i > 0) {
                        delta += resultPixels[k - width];
                      }
                      else {
                        delta += prevVal;
                      }
                      delta &= 0xFF; //overflow
                      resultPixels[k] = delta;//overflow
                      prevVal = delta;
                    }
                    else {
                      resultPixels[k] = delta;
                    }
                  }
                }
              }
              else { //not all valid, use mask
                for (k = 0, i = 0; i < height; i++) {
                  for (j = 0; j < width; j++, k++) {
                    if (mask[k]) {
                      val = 0;
                      valTmp = (word << bitPos) >>> (32 - numBitsLUTQick);
                      valTmpQuick = valTmp;// >>> deltaBits;
                      if (32 - bitPos < numBitsLUTQick) {
                        valTmp |= ((stuffedData[srcPtr + 1]) >>> (64 - bitPos - numBitsLUTQick));
                        valTmpQuick = valTmp;// >>> deltaBits;
                      }
                      if (decodeLut[valTmpQuick])    // if there, move the correct number of bits and done
                      {
                        val = decodeLut[valTmpQuick][1];
                        bitPos += decodeLut[valTmpQuick][0];
                      }
                      else {
                        valTmp = (word << bitPos) >>> (32 - numBitsLUT);
                        valTmpQuick = valTmp;// >>> deltaBits;
                        if (32 - bitPos < numBitsLUT) {
                          valTmp |= ((stuffedData[srcPtr + 1]) >>> (64 - bitPos - numBitsLUT));
                          valTmpQuick = valTmp;// >>> deltaBits;
                        }
                        node = tree;
                        for (ii = 0; ii < numBitsLUT; ii++) {
                          currentBit = valTmp >>> (numBitsLUT - ii - 1) & 1;
                          node = currentBit ? node.right : node.left;
                          if (!(node.left || node.right)) {
                            val = node.val;
                            bitPos = bitPos + ii + 1;
                            break;
                          }
                        }
                      }

                      if (bitPos >= 32) {
                        bitPos -= 32;
                        srcPtr++;
                        word = stuffedData[srcPtr];
                      }

                      delta = val - offset;
                      if (deltaEncode) {
                        if (j > 0 && mask[k - 1]) {
                          delta += prevVal;    // use overflow
                        }
                        else if (i > 0 && mask[k - width]) {
                          delta += resultPixels[k - width];
                        }
                        else {
                          delta += prevVal;
                        }

                        delta &= 0xFF; //overflow
                        resultPixels[k] = delta;//overflow
                        prevVal = delta;
                      }
                      else {
                        resultPixels[k] = delta;
                      }
                    }
                  }
                }
              }
              data.ptr = data.ptr + (srcPtr + 1) * 4 + (bitPos > 0 ? 4 : 0);
            }
            data.pixels.resultPixels = resultPixelsAllDim;
          },

          decodeBits: function(input, data, blockDataBuffer, offset, iDim) {
            {
              //bitstuff encoding is 3
              var headerInfo = data.headerInfo;
              var fileVersion = headerInfo.fileVersion;
              //var block = {};
              var blockPtr = 0;
              var viewByteLength = ((input.byteLength - data.ptr) >= 5) ? 5 : (input.byteLength - data.ptr);
              var view = new DataView(input, data.ptr, viewByteLength);
              var headerByte = view.getUint8(0);
              blockPtr++;
              var bits67 = headerByte >> 6;
              var n = (bits67 === 0) ? 4 : 3 - bits67;
              var doLut = (headerByte & 32) > 0 ? true : false;//5th bit
              var numBits = headerByte & 31;
              var numElements = 0;
              if (n === 1) {
                numElements = view.getUint8(blockPtr); blockPtr++;
              } else if (n === 2) {
                numElements = view.getUint16(blockPtr, true); blockPtr += 2;
              } else if (n === 4) {
                numElements = view.getUint32(blockPtr, true); blockPtr += 4;
              } else {
                throw "Invalid valid pixel count type";
              }
              //fix: huffman codes are bit stuffed, but not bound by data's max value, so need to use originalUnstuff
              //offset = offset || 0;
              var scale = 2 * headerInfo.maxZError;
              var stuffedData, arrayBuf, store8, dataBytes, dataWords;
              var lutArr, lutData, lutBytes, bitsPerPixel;
              var zMax = headerInfo.numDims > 1 ? headerInfo.maxValues[iDim] : headerInfo.zMax;
              if (doLut) {
                data.counter.lut++;
                lutBytes = view.getUint8(blockPtr);
                blockPtr++;
                dataBytes = Math.ceil((lutBytes - 1) * numBits / 8);
                dataWords = Math.ceil(dataBytes / 4);
                arrayBuf = new ArrayBuffer(dataWords * 4);
                store8 = new Uint8Array(arrayBuf);

                data.ptr += blockPtr;
                store8.set(new Uint8Array(input, data.ptr, dataBytes));

                lutData = new Uint32Array(arrayBuf);
                data.ptr += dataBytes;

                bitsPerPixel = 0;
                while ((lutBytes - 1) >>> bitsPerPixel) {
                  bitsPerPixel++;
                }
                dataBytes = Math.ceil(numElements * bitsPerPixel / 8);
                dataWords = Math.ceil(dataBytes / 4);
                arrayBuf = new ArrayBuffer(dataWords * 4);
                store8 = new Uint8Array(arrayBuf);
                store8.set(new Uint8Array(input, data.ptr, dataBytes));
                stuffedData = new Uint32Array(arrayBuf);
                data.ptr += dataBytes;
                if (fileVersion >= 3) {
                  lutArr = BitStuffer.unstuffLUT2(lutData, numBits, lutBytes - 1, offset, scale, zMax);
                }
                else {
                  lutArr = BitStuffer.unstuffLUT(lutData, numBits, lutBytes - 1, offset, scale, zMax);
                }
                //lutArr.unshift(0);
                if (fileVersion >= 3) {
                  //BitStuffer.unstuff2(block, blockDataBuffer, headerInfo.zMax);
                  BitStuffer.unstuff2(stuffedData, blockDataBuffer, bitsPerPixel, numElements, lutArr);
                }
                else {
                  BitStuffer.unstuff(stuffedData, blockDataBuffer, bitsPerPixel, numElements, lutArr);
                }
              }
              else {
                //console.debug("bitstuffer");
                data.counter.bitstuffer++;
                bitsPerPixel = numBits;
                data.ptr += blockPtr;
                if (bitsPerPixel > 0) {
                  dataBytes = Math.ceil(numElements * bitsPerPixel / 8);
                  dataWords = Math.ceil(dataBytes / 4);
                  arrayBuf = new ArrayBuffer(dataWords * 4);
                  store8 = new Uint8Array(arrayBuf);
                  store8.set(new Uint8Array(input, data.ptr, dataBytes));
                  stuffedData = new Uint32Array(arrayBuf);
                  data.ptr += dataBytes;
                  if (fileVersion >= 3) {
                    if (offset === null) {
                      BitStuffer.originalUnstuff2(stuffedData, blockDataBuffer, bitsPerPixel, numElements);
                    }
                    else {
                      BitStuffer.unstuff2(stuffedData, blockDataBuffer, bitsPerPixel, numElements, false, offset, scale, zMax);
                    }
                  }
                  else {
                    if (offset === null) {
                      BitStuffer.originalUnstuff(stuffedData, blockDataBuffer, bitsPerPixel, numElements);
                    }
                    else {
                      BitStuffer.unstuff(stuffedData, blockDataBuffer, bitsPerPixel, numElements, false, offset, scale, zMax);
                    }
                  }
                }
              }
            }

          },

          readTiles: function(input, data, OutPixelTypeArray) {
            var headerInfo = data.headerInfo;
            var width = headerInfo.width;
            var height = headerInfo.height;
            var microBlockSize = headerInfo.microBlockSize;
            var imageType = headerInfo.imageType;
            var dataTypeSize = Lerc2Helpers.getDataTypeSize(imageType);
            var numBlocksX = Math.ceil(width / microBlockSize);
            var numBlocksY = Math.ceil(height / microBlockSize);
            data.pixels.numBlocksY = numBlocksY;
            data.pixels.numBlocksX = numBlocksX;
            data.pixels.ptr = 0;
            var row = 0, col = 0, blockY = 0, blockX = 0, thisBlockHeight = 0, thisBlockWidth = 0, bytesLeft = 0, headerByte = 0, bits67 = 0, testCode = 0, outPtr = 0, outStride = 0, numBytes = 0, bytesleft = 0, z = 0, blockPtr = 0;
            var view, block, arrayBuf, store8, rawData;
            var blockEncoding;
            var blockDataBuffer = new OutPixelTypeArray(microBlockSize * microBlockSize);
            var lastBlockHeight = (height % microBlockSize) || microBlockSize;
            var lastBlockWidth = (width % microBlockSize) || microBlockSize;
            var offsetType, offset;
            var numDims = headerInfo.numDims, iDim;
            var mask = data.pixels.resultMask;
            var resultPixels = data.pixels.resultPixels;
            for (blockY = 0; blockY < numBlocksY; blockY++) {
              thisBlockHeight = (blockY !== numBlocksY - 1) ? microBlockSize : lastBlockHeight;
              for (blockX = 0; blockX < numBlocksX; blockX++) {
                //console.debug("y" + blockY + " x" + blockX);
                thisBlockWidth = (blockX !== numBlocksX - 1) ? microBlockSize : lastBlockWidth;

                outPtr = blockY * width * microBlockSize + blockX * microBlockSize;
                outStride = width - thisBlockWidth;


                for (iDim = 0; iDim < numDims; iDim++) {
                  if (numDims > 1) {
                    resultPixels = new OutPixelTypeArray(data.pixels.resultPixels.buffer, width * height * iDim * dataTypeSize, width * height);
                  }
                  bytesLeft = input.byteLength - data.ptr;
                  view = new DataView(input, data.ptr, Math.min(10, bytesLeft));
                  block = {};
                  blockPtr = 0;
                  headerByte = view.getUint8(0);
                  blockPtr++;
                  bits67 = (headerByte >> 6) & 0xFF;
                  testCode = (headerByte >> 2) & 15;    // use bits 2345 for integrity check
                  if (testCode !== (((blockX * microBlockSize) >> 3) & 15)) {
                    throw "integrity issue";
                    //return false;
                  }

                  blockEncoding = headerByte & 3;
                  if (blockEncoding > 3) {
                    data.ptr += blockPtr;
                    throw "Invalid block encoding (" + blockEncoding + ")";
                  }
                  else if (blockEncoding === 2) { //constant 0
                    data.counter.constant++;
                    data.ptr += blockPtr;
                    continue;
                  }
                  else if (blockEncoding === 0) {  //uncompressed
                    data.counter.uncompressed++;
                    data.ptr += blockPtr;
                    numBytes = thisBlockHeight * thisBlockWidth * dataTypeSize;
                    bytesleft = input.byteLength - data.ptr;
                    numBytes = numBytes < bytesleft ? numBytes : bytesleft;
                    //bit alignment
                    arrayBuf = new ArrayBuffer((numBytes % dataTypeSize) === 0 ? numBytes : (numBytes + dataTypeSize - numBytes % dataTypeSize));
                    store8 = new Uint8Array(arrayBuf);
                    store8.set(new Uint8Array(input, data.ptr, numBytes));
                    rawData = new OutPixelTypeArray(arrayBuf);
                    z = 0;
                    if (mask) {
                      for (row = 0; row < thisBlockHeight; row++) {
                        for (col = 0; col < thisBlockWidth; col++) {
                          if (mask[outPtr]) {
                            resultPixels[outPtr] = rawData[z++];
                          }
                          outPtr++;
                        }
                        outPtr += outStride;
                      }
                    }
                    else {//all valid
                      for (row = 0; row < thisBlockHeight; row++) {
                        for (col = 0; col < thisBlockWidth; col++) {
                          resultPixels[outPtr++] = rawData[z++];
                        }
                        outPtr += outStride;
                      }
                    }
                    data.ptr += z * dataTypeSize;
                  }
                  else { //1 or 3
                    offsetType = Lerc2Helpers.getDataTypeUsed(imageType, bits67);
                    offset = Lerc2Helpers.getOnePixel(block, blockPtr, offsetType, view);
                    blockPtr += Lerc2Helpers.getDataTypeSize(offsetType);
                    if (blockEncoding === 3) //constant offset value
                    {
                      data.ptr += blockPtr;
                      data.counter.constantoffset++;
                      //you can delete the following resultMask case in favor of performance because val is constant and users use nodata mask, otherwise nodatavalue post processing handles it too.
                      //while the above statement is true, we're not doing it as we want to keep invalid pixel value at 0 rather than arbitrary values
                      if (mask) {
                        for (row = 0; row < thisBlockHeight; row++) {
                          for (col = 0; col < thisBlockWidth; col++) {
                            if (mask[outPtr]) {
                              resultPixels[outPtr] = offset;
                            }
                            outPtr++;
                          }
                          outPtr += outStride;
                        }
                      }
                      else {
                        for (row = 0; row < thisBlockHeight; row++) {
                          for (col = 0; col < thisBlockWidth; col++) {
                            resultPixels[outPtr++] = offset;
                          }
                          outPtr += outStride;
                        }
                      }
                    }
                    else { //bitstuff encoding is 3
                      data.ptr += blockPtr;
                      //heavy lifting
                      Lerc2Helpers.decodeBits(input, data, blockDataBuffer, offset, iDim);
                      blockPtr = 0;
                      if (mask) {
                        for (row = 0; row < thisBlockHeight; row++) {
                          for (col = 0; col < thisBlockWidth; col++) {
                            if (mask[outPtr]) {
                              resultPixels[outPtr] = blockDataBuffer[blockPtr++];
                            }
                            outPtr++;
                          }
                          outPtr += outStride;
                        }
                      }
                      else {
                        for (row = 0; row < thisBlockHeight; row++) {
                          for (col = 0; col < thisBlockWidth; col++) {
                            resultPixels[outPtr++] = blockDataBuffer[blockPtr++];
                          }
                          outPtr += outStride;
                        }
                      }
                    }
                  }
                }
              }
            }
          },

          /*****************
          *  private methods (helper methods)
          *****************/

          formatFileInfo: function(data) {
            return {
              "fileIdentifierString": data.headerInfo.fileIdentifierString,
              "fileVersion": data.headerInfo.fileVersion,
              "imageType": data.headerInfo.imageType,
              "height": data.headerInfo.height,
              "width": data.headerInfo.width,
              "numValidPixel": data.headerInfo.numValidPixel,
              "microBlockSize": data.headerInfo.microBlockSize,
              "blobSize": data.headerInfo.blobSize,
              "maxZError": data.headerInfo.maxZError,
              "pixelType": Lerc2Helpers.getPixelType(data.headerInfo.imageType),
              "eofOffset": data.eofOffset,
              "mask": data.mask ? {
                "numBytes": data.mask.numBytes
              } : null,
              "pixels": {
                "numBlocksX": data.pixels.numBlocksX,
                "numBlocksY": data.pixels.numBlocksY,
                //"numBytes": data.pixels.numBytes,
                "maxValue": data.headerInfo.zMax,
                "minValue": data.headerInfo.zMin,
                "noDataValue": data.noDataValue
              }
            };
          },

          constructConstantSurface: function(data) {
            var val = data.headerInfo.zMax;
            var numDims =  data.headerInfo.numDims;
            var numPixels = data.headerInfo.height * data.headerInfo.width;
            var numPixelAllDims = numPixels * numDims;
            var i=0, k = 0, nStart=0;
            var mask = data.pixels.resultMask;
            if (mask) {
              if (numDims > 1) {
                for (i=0; i < numDims; i++) {
                  nStart = i * numPixels;
                  for (k = 0; k < numPixels; k++) {
                    if (mask[k]) {
                      data.pixels.resultPixels[nStart + k] = val;
                    }
                  }
                }
              }
              else {
                for (k = 0; k < numPixels; k++) {
                  if (mask[k]) {
                    data.pixels.resultPixels[k] = val;
                  }
                }
              }
            }
            else {
              if (data.pixels.resultPixels.fill) {
                data.pixels.resultPixels.fill(val);
              }
              else {
                for (k = 0; k < numPixelAllDims; k++) {
                  data.pixels.resultPixels[k] = val;
                }
              }
            }
            return;
          },

          getDataTypeArray: function(t) {
            var tp;
            switch (t) {
              case 0: //char
                tp = Int8Array;
                break;
              case 1: //byte
                tp = Uint8Array;
                break;
              case 2: //short
                tp = Int16Array;
                break;
              case 3: //ushort
                tp = Uint16Array;
                break;
              case 4:
                tp = Int32Array;
                break;
              case 5:
                tp = Uint32Array;
                break;
              case 6:
                tp = Float32Array;
                break;
              case 7:
                tp = Float64Array;
                break;
              default:
                tp = Float32Array;
            }
            return tp;
          },

          getPixelType: function(t) {
            var tp;
            switch (t) {
              case 0: //char
                tp = "S8";
                break;
              case 1: //byte
                tp = "U8";
                break;
              case 2: //short
                tp = "S16";
                break;
              case 3: //ushort
                tp = "U16";
                break;
              case 4:
                tp = "S32";
                break;
              case 5:
                tp = "U32";
                break;
              case 6:
                tp = "F32";
                break;
              case 7:
                tp = "F64"; //not supported
                break;
              default:
                tp = "F32";
            }
            return tp;
          },

          isValidPixelValue: function(t, val) {
            if (val === null) {
              return false;
            }
            var isValid;
            switch (t) {
              case 0: //char
                isValid = val >= -128 && val <= 127;
                break;
              case 1: //byte  (unsigned char)
                isValid = val >= 0 && val <= 255;
                break;
              case 2: //short
                isValid = val >= -32768 && val <= 32767;
                break;
              case 3: //ushort
                isValid = val >= 0 && val <= 65536;
                break;
              case 4: //int 32
                isValid = val >= -2147483648 && val <= 2147483647;
                break;
              case 5: //uinit 32
                isValid = val >= 0 && val <= 4294967296;
                break;
              case 6:
                isValid = val >= -3.4027999387901484e+38 && val <= 3.4027999387901484e+38;
                break;
              case 7:
                isValid = val >= 5e-324 && val <= 1.7976931348623157e+308;
                break;
              default:
                isValid = false;
            }
            return isValid;
          },

          getDataTypeSize: function(t) {
            var s = 0;
            switch (t) {
              case 0: //ubyte
              case 1: //byte
                s = 1;
                break;
              case 2: //short
              case 3: //ushort
                s = 2;
                break;
              case 4:
              case 5:
              case 6:
                s = 4;
                break;
              case 7:
                s = 8;
                break;
              default:
                s = t;
            }
            return s;
          },

          getDataTypeUsed: function(dt, tc) {
            var t = dt;
            switch (dt) {
              case 2: //short
              case 4: //long
                t = dt - tc;
                break;
              case 3: //ushort
              case 5: //ulong
                t = dt - 2 * tc;
                break;
              case 6: //float
                if (0 === tc) {
                  t = dt;
                }
                else if (1 === tc) {
                  t = 2;
                }
                else {
                  t = 1;//byte
                }
                break;
              case 7: //double
                if (0 === tc) {
                  t = dt;
                }
                else {
                  t = dt - 2 * tc + 1;
                }
                break;
              default:
                t = dt;
                break;
            }
            return t;
          },

          getOnePixel: function(block, blockPtr, offsetType, view) {
            var temp = 0;
            switch (offsetType) {
              case 0: //char
                temp = view.getInt8(blockPtr);
                break;
              case 1: //byte
                temp = view.getUint8(blockPtr);
                break;
              case 2:
                temp = view.getInt16(blockPtr, true);
                break;
              case 3:
                temp = view.getUint16(blockPtr, true);
                break;
              case 4:
                temp = view.getInt32(blockPtr, true);
                break;
              case 5:
                temp = view.getUInt32(blockPtr, true);
                break;
              case 6:
                temp = view.getFloat32(blockPtr, true);
                break;
              case 7:
                //temp = view.getFloat64(blockPtr, true);
                //blockPtr += 8;
                //lerc2 encoding doesnt handle float 64, force to float32???
                temp = view.getFloat64(blockPtr, true);
                break;
              default:
                throw ("the decoder does not understand this pixel type");
            }
            return temp;
          }
        };

        /***************************************************
        *private class for a tree node. Huffman code is in Lerc2Helpers
        ****************************************************/
        var TreeNode = function(val, left, right) {
          this.val = val;
          this.left = left;
          this.right = right;
        };

        var Lerc2Decode = {
          /*
          * ********removed options compared to LERC1. We can bring some of them back if needed.
           * removed pixel type. LERC2 is typed and doesn't require user to give pixel type
           * changed encodedMaskData to maskData. LERC2 's js version make it faster to use maskData directly.
           * removed returnMask. mask is used by LERC2 internally and is cost free. In case of user input mask, it's returned as well and has neglible cost.
           * removed nodatavalue. Because LERC2 pixels are typed, nodatavalue will sacrify a useful value for many types (8bit, 16bit) etc,
           *       user has to be knowledgable enough about raster and their data to avoid usability issues. so nodata value is simply removed now.
           *       We can add it back later if their's a clear requirement.
           * removed encodedMask. This option was not implemented in LercDecode. It can be done after decoding (less efficient)
           * removed computeUsedBitDepths.
           *
           *
           * response changes compared to LERC1
           * 1. encodedMaskData is not available
           * 2. noDataValue is optional (returns only if user's noDataValue is with in the valid data type range)
           * 3. maskData is always available
          */
          /*****************
          *  public properties
          ******************/
          //HUFFMAN_LUT_BITS_MAX: 12, //use 2^12 lut, not configurable

          /*****************
          *  public methods
          *****************/

          /**
           * Decode a LERC2 byte stream and return an object containing the pixel data and optional metadata.
           *
           * @param {ArrayBuffer} input The LERC input byte stream
           * @param {object} [options] options Decoding options
           * @param {number} [options.inputOffset] The number of bytes to skip in the input byte stream. A valid LERC file is expected at that position
           * @param {boolean} [options.returnFileInfo] If true, the return value will have a fileInfo property that contains metadata obtained from the LERC headers and the decoding process
           */
          decode: function(/*byte array*/ input, /*object*/ options) {
            //currently there's a bug in the sparse array, so please do not set to false
            options = options || {};
            var noDataValue = options.noDataValue;

            //initialize
            var i = 0, data = {};
            data.ptr = options.inputOffset || 0;
            data.pixels = {};

            // File header
            if (!Lerc2Helpers.readHeaderInfo(input, data)) {
              return;
            }
            var headerInfo = data.headerInfo;
            var fileVersion = headerInfo.fileVersion;
            var OutPixelTypeArray = Lerc2Helpers.getDataTypeArray(headerInfo.imageType);

            // Mask Header
            Lerc2Helpers.readMask(input, data);
            if (headerInfo.numValidPixel !== headerInfo.width * headerInfo.height && !data.pixels.resultMask) {
              data.pixels.resultMask = options.maskData;
            }

            var numPixels = headerInfo.width * headerInfo.height;
            data.pixels.resultPixels = new OutPixelTypeArray(numPixels * headerInfo.numDims);

            data.counter = {
              onesweep: 0,
              uncompressed: 0,
              lut: 0,
              bitstuffer: 0,
              constant: 0,
              constantoffset: 0
            };
            if (headerInfo.numValidPixel !== 0) {
              //not tested
              if (headerInfo.zMax === headerInfo.zMin) //constant surface
              {
                Lerc2Helpers.constructConstantSurface(data);
              }
              else if (fileVersion >= 4 && Lerc2Helpers.checkMinMaxRanges(input, data)) {
                Lerc2Helpers.constructConstantSurface(data);
              }
              else {
                var view = new DataView(input, data.ptr, 2);
                var bReadDataOneSweep = view.getUint8(0);
                data.ptr++;
                if (bReadDataOneSweep) {
                  //console.debug("OneSweep");
                  Lerc2Helpers.readDataOneSweep(input, data, OutPixelTypeArray);
                }
                else {
                  //lerc2.1: //bitstuffing + lut
                  //lerc2.2: //bitstuffing + lut + huffman
                  //lerc2.3: new bitstuffer
                  if (fileVersion > 1 && headerInfo.imageType <= 1 && Math.abs(headerInfo.maxZError - 0.5) < 0.00001) {
                    //this is 2.x plus 8 bit (unsigned and signed) data, possiblity of Huffman
                    var flagHuffman = view.getUint8(1);
                    data.ptr++;
                    data.encodeMode = flagHuffman;
                    if (flagHuffman > 2 || (fileVersion < 4 && flagHuffman > 1)) {
                      throw "Invalid Huffman flag " + flagHuffman;
                    }
                    if (flagHuffman) {//1 - delta Huffman, 2 - Huffman
                      //console.log("Huffman");
                      Lerc2Helpers.readHuffman(input, data, OutPixelTypeArray);
                    }
                    else {
                      //console.log("Tiles");
                      Lerc2Helpers.readTiles(input, data, OutPixelTypeArray);
                    }
                  }
                  else { //lerc2.x non-8 bit data
                    //console.log("Tiles");
                    Lerc2Helpers.readTiles(input, data, OutPixelTypeArray);
                  }
                }
              }
            }

            data.eofOffset = data.ptr;
            var diff;
            if (options.inputOffset) {
              diff = data.headerInfo.blobSize + options.inputOffset - data.ptr;
              if (Math.abs(diff) >= 1) {
                //console.debug("incorrect eof: dataptr " + data.ptr + " offset " + options.inputOffset + " blobsize " + data.headerInfo.blobSize + " diff: " + diff);
                data.eofOffset = options.inputOffset + data.headerInfo.blobSize;
              }
            }
            else {
              diff = data.headerInfo.blobSize - data.ptr;
              if (Math.abs(diff) >= 1) {
                //console.debug("incorrect first band eof: dataptr " + data.ptr + " blobsize " + data.headerInfo.blobSize + " diff: " + diff);
                data.eofOffset = data.headerInfo.blobSize;
              }
            }

            var result = {
              width: headerInfo.width,
              height: headerInfo.height,
              pixelData: data.pixels.resultPixels,
              minValue: headerInfo.zMin,
              maxValue: headerInfo.zMax,
              validPixelCount: headerInfo.numValidPixel,
              dimCount: headerInfo.numDims,
              dimStats: {
                minValues: headerInfo.minValues,
                maxValues: headerInfo.maxValues
              },
              maskData: data.pixels.resultMask
              //noDataValue: noDataValue
            };

            //we should remove this if there's no existing client
            //optional noDataValue processing, it's user's responsiblity
            if (data.pixels.resultMask && Lerc2Helpers.isValidPixelValue(headerInfo.imageType, noDataValue)) {
              var mask = data.pixels.resultMask;
              for (i = 0; i < numPixels; i++) {
                if (!mask[i]) {
                  result.pixelData[i] = noDataValue;
                }
              }
              result.noDataValue = noDataValue;
            }
            data.noDataValue = noDataValue;
            if (options.returnFileInfo) {
              result.fileInfo = Lerc2Helpers.formatFileInfo(data);
            }
            return result;
          },

          getBandCount: function(/*byte array*/ input) {
            var count = 0;
            var i = 0;
            var temp = {};
            temp.ptr = 0;
            temp.pixels = {};
            while (i < input.byteLength - 58) {
              Lerc2Helpers.readHeaderInfo(input, temp);
              i += temp.headerInfo.blobSize;
              count++;
              temp.ptr = i;
            }
            return count;
          }
        };

        return Lerc2Decode;
      })();

      var isPlatformLittleEndian = (function() {
        var a = new ArrayBuffer(4);
        var b = new Uint8Array(a);
        var c = new Uint32Array(a);
        c[0] = 1;
        return b[0] === 1;
      })();

      var Lerc = {
        /************wrapper**********************************************/
        /**
         * A wrapper for decoding both LERC1 and LERC2 byte streams capable of handling multiband pixel blocks for various pixel types.
         *
         * @alias module:Lerc
         * @param {ArrayBuffer} input The LERC input byte stream
         * @param {object} [options] The decoding options below are optional.
         * @param {number} [options.inputOffset] The number of bytes to skip in the input byte stream. A valid Lerc file is expected at that position.
         * @param {string} [options.pixelType] (LERC1 only) Default value is F32. Valid pixel types for input are U8/S8/S16/U16/S32/U32/F32.
         * @param {number} [options.noDataValue] (LERC1 only). It is recommended to use the returned mask instead of setting this value.
         * @returns {{width, height, pixels, pixelType, mask, statistics}}
           * @property {number} width Width of decoded image.
           * @property {number} height Height of decoded image.
           * @property {array} pixels [band1, band2, …] Each band is a typed array of width*height.
           * @property {string} pixelType The type of pixels represented in the output.
           * @property {mask} mask Typed array with a size of width*height, or null if all pixels are valid.
           * @property {array} statistics [statistics_band1, statistics_band2, …] Each element is a statistics object representing min and max values
        **/
        decode: function(encodedData, options) {
          if (!isPlatformLittleEndian) {
            throw "Big endian system is not supported.";
          }
          options = options || {};
          var inputOffset = options.inputOffset || 0;
          var fileIdView = new Uint8Array(encodedData, inputOffset, 10);
          var fileIdentifierString = String.fromCharCode.apply(null, fileIdView);
          var lerc, majorVersion;
          if (fileIdentifierString.trim() === "CntZImage") {
            lerc = LercDecode;
            majorVersion = 1;
          }
          else if (fileIdentifierString.substring(0, 5) === "Lerc2") {
            lerc = Lerc2Decode;
            majorVersion = 2;
          }
          else {
            throw "Unexpected file identifier string: " + fileIdentifierString;
          }

          var iPlane = 0, eof = encodedData.byteLength - 10, encodedMaskData, bandMasks = [], bandMask, maskData;
          var decodedPixelBlock = {
            width: 0,
            height: 0,
            pixels: [],
            pixelType: options.pixelType,
            mask: null,
            statistics: []
          };

          while (inputOffset < eof) {
            var result = lerc.decode(encodedData, {
              inputOffset: inputOffset,//for both lerc1 and lerc2
              encodedMaskData: encodedMaskData,//lerc1 only
              maskData: maskData,//lerc2 only
              returnMask: iPlane === 0 ? true : false,//lerc1 only
              returnEncodedMask: iPlane === 0 ? true : false,//lerc1 only
              returnFileInfo: true,//for both lerc1 and lerc2
              pixelType: options.pixelType || null,//lerc1 only
              noDataValue: options.noDataValue || null//lerc1 only
            });

            inputOffset = result.fileInfo.eofOffset;
            if (iPlane === 0) {
              encodedMaskData = result.encodedMaskData;//lerc1
              maskData = result.maskData;//lerc2
              decodedPixelBlock.width = result.width;
              decodedPixelBlock.height = result.height;
              decodedPixelBlock.dimCount = result.dimCount || 1;
              //decodedPixelBlock.dimStats = decodedPixelBlock.dimStats;
              decodedPixelBlock.pixelType = result.pixelType || result.fileInfo.pixelType;
              decodedPixelBlock.mask = result.maskData;
            }
            if (majorVersion >1 && result.fileInfo.mask && result.fileInfo.mask.numBytes > 0) {
              bandMasks.push(result.maskData);
            }

            iPlane++;
            decodedPixelBlock.pixels.push(result.pixelData);
            decodedPixelBlock.statistics.push({
              minValue: result.minValue,
              maxValue: result.maxValue,
              noDataValue: result.noDataValue,
              dimStats: result.dimStats
            });
          }
          var i, j, numPixels;
          if (majorVersion > 1 && bandMasks.length > 1) {
            numPixels = decodedPixelBlock.width * decodedPixelBlock.height;
            decodedPixelBlock.bandMasks = bandMasks;
            maskData = new Uint8Array(numPixels);
            maskData.set(bandMasks[0]);
            for (i = 1; i < bandMasks.length; i++) {
              bandMask = bandMasks[i];
              for (j = 0; j < numPixels; j++) {
                maskData[j] = maskData[j] & bandMask[j];
              }
            }
            decodedPixelBlock.maskData = maskData;
          }

          return decodedPixelBlock;
        }
      };

      tmp.Lerc = Lerc;
    })();

    var Lerc = tmp.Lerc;

    function createVerticesFromHeightmap(parameters, transferableObjects) {
            // LERC encoded buffers must be decoded, then we can process them like normal
            if (parameters.encoding === HeightmapEncoding$1.LERC) {
                var result;
                try {
                    result = Lerc.decode(parameters.heightmap);
                } catch (error) {
                    throw new RuntimeError.RuntimeError(error);
                }

                var lercStatistics = result.statistics[0];
                if (lercStatistics.minValue === Number.MAX_VALUE) {
                    throw new RuntimeError.RuntimeError('Invalid tile data');
                }

                parameters.heightmap = result.pixels[0];
                parameters.width = result.width;
                parameters.height = result.height;
            }

            parameters.ellipsoid = Cartesian2.Ellipsoid.clone(parameters.ellipsoid);
            parameters.rectangle = Cartesian2.Rectangle.clone(parameters.rectangle);

            var statistics = HeightmapTessellator.computeVertices(parameters);
            var vertices = statistics.vertices;
            transferableObjects.push(vertices.buffer);

            return {
                vertices : vertices.buffer,
                numberOfAttributes : statistics.encoding.getStride(),
                minimumHeight : statistics.minimumHeight,
                maximumHeight : statistics.maximumHeight,
                gridWidth : parameters.width,
                gridHeight : parameters.height,
                boundingSphere3D : statistics.boundingSphere3D,
                orientedBoundingBox : statistics.orientedBoundingBox,
                occludeePointInScaledSpace : statistics.occludeePointInScaledSpace,
                encoding : statistics.encoding,
                westIndicesSouthToNorth : statistics.westIndicesSouthToNorth,
                southIndicesEastToWest : statistics.southIndicesEastToWest,
                eastIndicesNorthToSouth : statistics.eastIndicesNorthToSouth,
                northIndicesWestToEast : statistics.northIndicesWestToEast
            };
        }
    var createVerticesFromHeightmap$1 = createTaskProcessorWorker(createVerticesFromHeightmap);

    return createVerticesFromHeightmap$1;

});

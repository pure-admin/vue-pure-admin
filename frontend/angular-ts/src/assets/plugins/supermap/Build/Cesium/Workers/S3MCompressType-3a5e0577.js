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
define(['exports', './when-8d13db60', './Check-70bec281', './Cartographic-fe4be337', './Cartesian2-85064f09', './BoundingSphere-775c5788', './Cartesian4-5af5bb24', './RuntimeError-ba10bc3e', './ComponentDatatype-5862616f', './PrimitiveType-97893bc7', './BoundingRectangle-dc808c42'], function (exports, when, Check, Cartographic, Cartesian2, BoundingSphere, Cartesian4, RuntimeError, ComponentDatatype, PrimitiveType, BoundingRectangle) { 'use strict';

    /**
         * @private
         */
        function getStringFromTypedArray(uint8Array, byteOffset, byteLength, codeType) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(uint8Array)) {
                throw new Check.DeveloperError('uint8Array is required.');
            }
            if (byteOffset < 0) {
                throw new Check.DeveloperError('byteOffset cannot be negative.');
            }
            if (byteLength < 0) {
                throw new Check.DeveloperError('byteLength cannot be negative.');
            }
            if ((byteOffset + byteLength) > uint8Array.byteLength) {
                throw new Check.DeveloperError('sub-region exceeds array bounds.');
            }
            //>>includeEnd('debug');

            byteOffset = when.defaultValue(byteOffset, 0);
            byteLength = when.defaultValue(byteLength, uint8Array.byteLength - byteOffset);
            codeType = when.defaultValue(codeType, 'utf-8');

            uint8Array = uint8Array.subarray(byteOffset, byteOffset + byteLength);

            return getStringFromTypedArray.decode(uint8Array, codeType);
        }

        // Exposed functions for testing
        getStringFromTypedArray.decodeWithTextDecoder = function(view, codeType) {
            var decoder = new TextDecoder(codeType);
            return decoder.decode(view);
        };

        getStringFromTypedArray.decodeWithFromCharCode = function(view) {
            var result = '';
            var codePoints = utf8Handler(view);
            var length = codePoints.length;
            for (var i = 0; i < length; ++i) {
                var cp = codePoints[i];
                if (cp <= 0xFFFF) {
                    result += String.fromCharCode(cp);
                } else {
                    cp -= 0x10000;
                    result += String.fromCharCode((cp >> 10) + 0xD800,
                        (cp & 0x3FF) + 0xDC00);
                }

            }
            return result;
        };

        function inRange(a, min, max) {
            return min <= a && a <= max;
        }

        // This code is inspired by public domain code found here: https://github.com/inexorabletash/text-encoding
        function utf8Handler(utfBytes) {
            var codePoint = 0;
            var bytesSeen = 0;
            var bytesNeeded = 0;
            var lowerBoundary = 0x80;
            var upperBoundary = 0xBF;

            var codePoints = [];
            var length = utfBytes.length;
            for (var i = 0; i < length; ++i) {
                var currentByte = utfBytes[i];

                // If bytesNeeded = 0, then we are starting a new character
                if (bytesNeeded === 0) {
                    // 1 Byte Ascii character
                    if (inRange(currentByte, 0x00, 0x7F)) {
                        // Return a code point whose value is byte.
                        codePoints.push(currentByte);
                        continue;
                    }

                    // 2 Byte character
                    if (inRange(currentByte, 0xC2, 0xDF)) {
                        bytesNeeded = 1;
                        codePoint = currentByte & 0x1F;
                        continue;
                    }

                    // 3 Byte character
                    if (inRange(currentByte, 0xE0, 0xEF)) {
                        // If byte is 0xE0, set utf-8 lower boundary to 0xA0.
                        if (currentByte === 0xE0) {
                            lowerBoundary = 0xA0;
                        }
                        // If byte is 0xED, set utf-8 upper boundary to 0x9F.
                        if (currentByte === 0xED) {
                            upperBoundary = 0x9F;
                        }

                        bytesNeeded = 2;
                        codePoint = currentByte & 0xF;
                        continue;
                    }

                    // 4 Byte character
                    if (inRange(currentByte, 0xF0, 0xF4)) {
                        // If byte is 0xF0, set utf-8 lower boundary to 0x90.
                        if (currentByte === 0xF0) {
                            lowerBoundary = 0x90;
                        }
                        // If byte is 0xF4, set utf-8 upper boundary to 0x8F.
                        if (currentByte === 0xF4) {
                            upperBoundary = 0x8F;
                        }

                        bytesNeeded = 3;
                        codePoint = currentByte & 0x7;
                        continue;
                    }

                    throw new RuntimeError.RuntimeError('String decoding failed.');
                }

                // Out of range, so ignore the first part(s) of the character and continue with this byte on its own
                if (!inRange(currentByte, lowerBoundary, upperBoundary)) {
                    codePoint = bytesNeeded = bytesSeen = 0;
                    lowerBoundary = 0x80;
                    upperBoundary = 0xBF;
                    --i;
                    continue;
                }

                // Set appropriate boundaries, since we've now checked byte 2 of a potential longer character
                lowerBoundary = 0x80;
                upperBoundary = 0xBF;

                // Add byte to code point
                codePoint = (codePoint << 6) | (currentByte & 0x3F);

                // We have the correct number of bytes, so push and reset for next character
                ++bytesSeen;
                if (bytesSeen === bytesNeeded) {
                    codePoints.push(codePoint);
                    codePoint = bytesNeeded = bytesSeen = 0;
                }
            }

            return codePoints;
        }

        if (typeof TextDecoder !== 'undefined') {
            getStringFromTypedArray.decode = getStringFromTypedArray.decodeWithTextDecoder;
        } else {
            getStringFromTypedArray.decode = getStringFromTypedArray.decodeWithFromCharCode;
        }

    /**
     * S3M像素格式
     * @export S3MPixelFormat
     */
    var S3MPixelFormat = {
        /**
         * 8位像素，代表亮度
         */
        LUMINANCE_8 : 1,
        /**
         * 16位像素，代表亮度
         */
        LUMINANCE_16 : 2,
        /**
         * 8位像素，代表透明度
         */
        ALPHA : 3,
        /**
         * 8位像素，4位透明度4位亮度
         */
        ALPHA_4_LUMINANCE_4 : 4,
        /**
         * 16位像素，8位亮度8位透明度
         */
        LUMINANCE_ALPHA : 5,
        /**
         * 16位像素，R G B各为5 6 5
         */
        RGB_565 : 6,
        /**
         * 16位像素，B G R各为5 6 5
         */
        BGR565 : 7,
        /**
         * 24位像素，R G B各为8 8 8
         */
        RGB : 10,
        /**
         * 24位像素， B G R各为8 8 8
         */
        BGR : 11,
        /**
         * 32位像素，A R G B 各为8 8 8 8
         */
        ARGB : 12,
        /**
         * 32位像素，A B G R 各为8 8 8 8
         */
        ABGR : 13,
        /**
         * 32位像素，B G R A 各为8 8 8 8
         */
        BGRA : 14,
        /**
         * 32位像素，R G B A 各为8 8 8 8
         */
        WEBP : 25,
        RGBA : 28,
        DXT1 : 17,
        DXT2 : 18,
        DXT3 : 19,
        DXT4 : 20,
        DXT5 : 21,
        CRN_DXT5 : 26
    };

    var S3MPixelFormat$1 = Object.freeze(S3MPixelFormat);

    //! Use DXT1 compression.
    var kDxt1 = ( 1 << 0 );

    //! Use DXT3 compression.
    var kDxt3 = ( 1 << 1 );

    //! Use DXT5 compression.
    var kDxt5 = ( 1 << 2 );

    var krgb565 = ( 1 << 5 );

    function Unpack565(packed0, packed1, colour, offset) {
        var value = packed0 | (packed1 << 8);

        var red = (value >> 11) & 0x1f;
        var green = (value >> 5) & 0x3f;
        var blue = value & 0x1f;

        colour[offset + 0] = ( red << 3 ) | ( red >> 2 );
        colour[offset + 1] = ( green << 2 ) | ( green >> 4 );
        colour[offset + 2] = ( blue << 3 ) | ( blue >> 2 );
        colour[offset + 3] = 255;

        return value;
    }

    function DecompressColour(rgba, block, nOffset, isDxt1) {
        var codes = new Uint8Array(16);

        var a = Unpack565(block[nOffset + 0], block[nOffset + 1], codes, 0);
        var b = Unpack565(block[nOffset + 2], block[nOffset + 3], codes, 4);

        for (var i = 0; i < 3; i++) {
            var c = codes[i];
            var d = codes[4 + i];

            if (isDxt1 && a <= b) {
                codes[8 + i] = ( c + d ) / 2;
                codes[12 + i] = 0;
            }
            else {
                codes[8 + i] = ( 2 * c + d ) / 3;
                codes[12 + i] = ( c + 2 * d ) / 3;
            }
        }

        codes[8 + 3] = 255;
        codes[12 + 3] = ( isDxt1 && a <= b ) ? 0 : 255;

        var indices = new Uint8Array(16);
        for (var i = 0; i < 4; ++i) {
            var packed = block[nOffset + 4 + i];

            indices[4 * i + 0] = packed & 0x3;
            indices[4 * i + 1] = ( packed >> 2 ) & 0x3;
            indices[4 * i + 2] = ( packed >> 4 ) & 0x3;
            indices[4 * i + 3] = ( packed >> 6 ) & 0x3;
        }

        for (var i = 0; i < 16; ++i) {
            var offset = 4 * indices[i];
            for (var j = 0; j < 4; ++j)
                rgba[4 * i + j] = codes[offset + j];
        }

    }

    function DecompressAlphaDxt3(rgba, block, nOffset) {
        // unpack the alpha values pairwise
        for (var i = 0; i < 8; ++i) {
            // quantise down to 4 bits
            var quant = bytes[nOffset + i];

            // unpack the values
            var lo = quant & 0x0f;
            var hi = quant & 0xf0;

            // convert back up to bytes
            rgba[8 * i + 3] = lo | ( lo << 4 );
            rgba[8 * i + 7] = hi | ( hi >> 4 );
        }
    }

    function DecompressAlphaDxt5(rgba, block, nOffset) {
        var alpha0 = block[nOffset + 0];
        var alpha1 = block[nOffset + 1];

        var codes = new Uint8Array(8);

        codes[0] = alpha0;
        codes[1] = alpha1;
        if (alpha0 <= alpha1) {
            // use 5-alpha codebook
            for (var i = 1; i < 5; ++i)
                codes[1 + i] = ( ( 5 - i ) * alpha0 + i * alpha1 ) / 5;
            codes[6] = 0;
            codes[7] = 255;
        }
        else {
            // use 7-alpha codebook
            for (var i = 1; i < 7; ++i)
                codes[1 + i] = ( ( 7 - i ) * alpha0 + i * alpha1 ) / 7;
        }

        var indices = new Uint8Array(16);
        var nOffset = nOffset + 2;
        var nBegin = 0;
        for (var i = 0; i < 2; ++i) {
            // grab 3 bytes
            var value = 0;
            for (var j = 0; j < 3; ++j) {
                var byte = block[nOffset++];
                value |= ( byte << 8 * j );
            }

            // unpack 8 3-bit values from it
            for (var j = 0; j < 8; ++j) {
                var index = ( value >> 3 * j ) & 0x7;
                indices[nBegin++] = index;
            }
        }

        for (var i = 0; i < 16; ++i)
            rgba[4 * i + 3] = codes[indices[i]];
    }

    function Decompress(rgba, block, nOffset, flags) {
        var nOffset2 = 0;
        if (( flags & ( kDxt3 | kDxt5 ) ) != 0)
            nOffset2 = 8;

        DecompressColour(rgba, block, nOffset + nOffset2, ( flags & kDxt1 ) != 0);

        if (( flags & kDxt3 ) != 0) {
            DecompressAlphaDxt3(rgba, block, nOffset);
        }
        else if (( flags & kDxt5 ) != 0) {
            DecompressAlphaDxt5(rgba, block, nOffset);
        }
    }

    function DecompressImage565(rgb565, width, height, blocks) {
        var c = new Uint16Array(4);
        var dst = rgb565;
        var m = 0;
        var dstI = 0;
        var i = 0;
        var r0 = 0, g0 = 0, b0 = 0, r1 = 0, g1 = 0, b1 = 0;

        var blockWidth = width / 4;
        var blockHeight = height / 4;
        for (var blockY = 0; blockY < blockHeight; blockY++) {
            for (var blockX = 0; blockX < blockWidth; blockX++) {
                i = 4 * ((blockHeight - blockY) * blockWidth + blockX);
                c[0] = blocks[i];
                c[1] = blocks[i + 1];
                r0 = c[0] & 0x1f;
                g0 = c[0] & 0x7e0;
                b0 = c[0] & 0xf800;
                r1 = c[1] & 0x1f;
                g1 = c[1] & 0x7e0;
                b1 = c[1] & 0xf800;
                // Interpolate between c0 and c1 to get c2 and c3.    ~
                // Note that we approximate 1/3 as 3/8 and 2/3 as 5/8 for
                // speed.  This also appears to be what the hardware DXT
                // decoder in many GPUs does :)
                c[2] = ((5 * r0 + 3 * r1) >> 3)
                    | (((5 * g0 + 3 * g1) >> 3) & 0x7e0)
                    | (((5 * b0 + 3 * b1) >> 3) & 0xf800);
                c[3] = ((5 * r1 + 3 * r0) >> 3)
                    | (((5 * g1 + 3 * g0) >> 3) & 0x7e0)
                    | (((5 * b1 + 3 * b0) >> 3) & 0xf800);
                m = blocks[i + 2];
                dstI = (blockY * 4) * width + blockX * 4;
                dst[dstI] = c[m & 0x3];
                dst[dstI + 1] = c[(m >> 2) & 0x3];
                dst[dstI + 2] = c[(m >> 4) & 0x3];
                dst[dstI + 3] = c[(m >> 6) & 0x3];
                dstI += width;
                dst[dstI] = c[(m >> 8) & 0x3];
                dst[dstI + 1] = c[(m >> 10) & 0x3];
                dst[dstI + 2] = c[(m >> 12) & 0x3];
                dst[dstI + 3] = c[(m >> 14)];
                m = blocks[i + 3];
                dstI += width;
                dst[dstI] = c[m & 0x3];
                dst[dstI + 1] = c[(m >> 2) & 0x3];
                dst[dstI + 2] = c[(m >> 4) & 0x3];
                dst[dstI + 3] = c[(m >> 6) & 0x3];
                dstI += width;
                dst[dstI] = c[(m >> 8) & 0x3];
                dst[dstI + 1] = c[(m >> 10) & 0x3];
                dst[dstI + 2] = c[(m >> 12) & 0x3];
                dst[dstI + 3] = c[(m >> 14)];
            }
        }
        return dst;
    }

    /*! @brief Decompresses an image in memory.

     @param rgba		Storage for the decompressed pixels.
     @param width	The width of the source image.
     @param height	The height of the source image.
     @param blocks	The compressed DXT blocks.
     @param flags	Compression flags.

     The decompressed pixels will be written as a contiguous array of width*height
     16 rgba values, with each component as 1 byte each. In memory this is:

     { r1, g1, b1, a1, .... , rn, gn, bn, an } for n = width*height

     The flags parameter should specify either kDxt1, kDxt3 or kDxt5 compression,
     however, DXT1 will be used by default if none is specified. All other flags
     are ignored.

     Internally this function calls squish::Decompress for each block.
     */
    function DecompressImage(rgba, width, height, blocks, flags) {
        var bytesPerBlock = ( ( flags & kDxt1 ) != 0 ) ? 8 : 16;

        var nOffset = 0;
        for (var y = 0; y < height; y += 4) {
            for (var x = 0; x < width; x += 4) {
                var targetRgba = new Uint8Array(4 * 16);
                Decompress(targetRgba, blocks, nOffset, flags);

                var nOffsetTarget = 0;
                for (var py = 0; py < 4; ++py) {
                    for (var px = 0; px < 4; ++px) {
                        var sx = x + px;
                        var sy = y + py;
                        if (sx < width && sy < height) {
                            // flip Y
                            var nBegin = 4 * ( width * (height - sy) + sx );

                            for (var i = 0; i < 4; ++i) {
                                rgba[nBegin++] = targetRgba[nOffsetTarget++];
                            }
                        }
                        else {
                            nOffsetTarget += 4;
                        }
                    }
                }

                // advance
                nOffset += bytesPerBlock;
            }
        }
    }

    function DXTTextureDecode(options){
    }

    DXTTextureDecode.decode = function(out, width, height, block, format){
        if (out == null || block == null || height == 0 || width == 0) {
            return;
        }
        var flags = 0;
        //有alpha通道,转为RGBA，否则转为rgb565
        if (format > S3MPixelFormat$1.BGR || format === S3MPixelFormat$1.LUMINANCE_ALPHA) {
            flags = kDxt5;
        }
        else {
            flags = kDxt1 | krgb565;
        }
        if ((flags & kDxt1) && (flags & krgb565)) {
            DecompressImage565(out, width, height, block);
        }
        else {
            DecompressImage(out, width, height, block, flags);
        }
    };

    var VertexCompressOptions = {
        SVC_Vertex : 1,	// 顶点带压缩
        SVC_Normal : 2,	// 法线带压缩
        SVC_VertexColor : 4, // 顶点颜色带压缩
        SVC_SecondColor	: 8, // 顶点颜色带压缩
        SVC_TexutreCoord : 16, // 纹理坐标带压缩
        SVC_TexutreCoordIsW	: 32 // 纹理坐标存储的是W位信息
    };

    var VertexCompressOption = Object.freeze(VertexCompressOptions);

    var DATAFILETYPE = {
        OSGBFile : 0,
        OSGBCacheFile : 1,
        ClampGroundPolygon : 2,
        ClampObjectPolygon : 3,
        ClampGroundLine : 4,
        ClampObjectLine : 5,
        IconPoint : 6,
        Text : 7,
        PointCloudFile : 8,
        // 动态拉伸面
        ExtendRegion3D : 9,
        ExtendClampPolygonCache : 10,

        PolylineEffect : 11,
        RegionEffect : 12,
        ClampGroundAndObjectLineCache : 13,
        ClampGroundRealtimeRasterCache : 14
    };

    var DATAFILETYPE$1 = Object.freeze(DATAFILETYPE);

    function S3MVertexPackage() {
    }

    function calcBoundingSphereForInstance(vertexPackage){
        var bSphere = new BoundingSphere.BoundingSphere();
        var bsValues = vertexPackage.instanceBounds;
        if(!when.defined(bsValues)) {
            return bSphere;
        }
        var pntLU = new Cartographic.Cartesian3(bsValues[0],bsValues[1],bsValues[2]);
        var pntRD = new Cartographic.Cartesian3(bsValues[3],bsValues[4],bsValues[5]);
        var center = Cartographic.Cartesian3.lerp(pntLU,pntRD,0.5,new Cartographic.Cartesian3());
        var radius = Cartographic.Cartesian3.distance(center,pntLU);
        bSphere.center = center;
        bSphere.radius = radius;
        return bSphere;
    }

    function calcBoundingSphereForNormal(vertexPackage){
        var bSphere = new BoundingSphere.BoundingSphere();
        var v1 = new Cartographic.Cartesian3();
        var positionAttr = vertexPackage.vertexAttributes[0];
        var dim = positionAttr.componentsPerAttribute;
        var isCompress = when.defined(vertexPackage.nCompressOptions) && (vertexPackage.nCompressOptions & VertexCompressOption.SVC_Vertex) === VertexCompressOption.SVC_Vertex;
        var normConstant = 1.0;
        var minVertex;
        var vertexTypedArray;
        if(isCompress){
            normConstant = vertexPackage.vertCompressConstant;
            minVertex = new Cartographic.Cartesian3(vertexPackage.minVerticesValue.x, vertexPackage.minVerticesValue.y, vertexPackage.minVerticesValue.z);
            vertexTypedArray = new Uint16Array(positionAttr.typedArray.buffer, positionAttr.typedArray.byteOffset, positionAttr.typedArray.byteLength / 2);
        }
        else{
            vertexTypedArray = new Float32Array(positionAttr.typedArray.buffer, positionAttr.typedArray.byteOffset, positionAttr.typedArray.byteLength / 4);
        }

        var vertexArray = [];
        for(var t = 0; t < vertexPackage.verticesCount; t++){
            Cartographic.Cartesian3.fromArray(vertexTypedArray, dim * t, v1);
            if(isCompress){
                v1 = Cartographic.Cartesian3.multiplyByScalar(v1, normConstant, v1);
                v1 = Cartographic.Cartesian3.add(v1, minVertex, v1);
            }
            vertexArray.push(Cartographic.Cartesian3.clone(v1));
        }
        BoundingSphere.BoundingSphere.fromPoints(vertexArray, bSphere);
        vertexArray.length = 0;
        return bSphere;
    }

    function calcBoundingSphereForShadowVolume(vertexPackage){
        var bSphere = new BoundingSphere.BoundingSphere();
        var v1 = new Cartographic.Cartesian3();
        var isCompress = when.defined(vertexPackage.nCompressOptions) && (vertexPackage.nCompressOptions & VertexCompressOption.SVC_Vertex) === VertexCompressOption.SVC_Vertex;
        var positionAttr = vertexPackage.vertexAttributes[0];
        var dim = positionAttr.componentsPerAttribute;
        var vertexTypedArray;
        var normConstant = 1.0;
        var minVertex;
        if(isCompress){
            normConstant = vertexPackage.vertCompressConstant;
            minVertex = new Cartographic.Cartesian3(vertexPackage.minVerticesValue.x, vertexPackage.minVerticesValue.y, vertexPackage.minVerticesValue.z);
            vertexTypedArray = new Uint16Array(positionAttr.typedArray.buffer, positionAttr.typedArray.byteOffset, positionAttr.typedArray.byteLength / 2);
        }
        else{
            vertexTypedArray = new Float32Array(positionAttr.typedArray.buffer, positionAttr.typedArray.byteOffset, positionAttr.typedArray.byteLength / 4);
        }

        var vertexArray = [];
        for(var t = 0; t < vertexPackage.verticesCount; t++){
            Cartographic.Cartesian3.fromArray(vertexTypedArray, dim * t, v1);
            if(isCompress){
                v1 = Cartographic.Cartesian3.multiplyByScalar(v1, normConstant, v1);
                v1 = Cartographic.Cartesian3.add(v1, minVertex, v1);
            }
            vertexArray.push(Cartographic.Cartesian3.clone(v1));
        }
        BoundingSphere.BoundingSphere.fromPoints(vertexArray, bSphere);
        vertexArray.length = 0;
        return bSphere;
    }

    function calcBoundingRectangleForShadowVolume(vertexPackage){
        var isCompress = when.defined(vertexPackage.nCompressOptions) && (vertexPackage.nCompressOptions & VertexCompressOption.SVC_Vertex) === VertexCompressOption.SVC_Vertex;
        var boundingRectangle = new BoundingRectangle.BoundingRectangle();
        var positionAttr = vertexPackage.vertexAttributes[0];
        var dim = positionAttr.componentsPerAttribute;
        var vertexTypedArray;
        var normConstant = 1.0;
        var minVertex;
        if(isCompress){
            normConstant = vertexPackage.vertCompressConstant;
            minVertex = new Cartographic.Cartesian3(vertexPackage.minVerticesValue.x, vertexPackage.minVerticesValue.y, vertexPackage.minVerticesValue.z);
            vertexTypedArray = new Uint16Array(positionAttr.typedArray.buffer, positionAttr.typedArray.byteOffset, positionAttr.typedArray.byteLength / 2);
        }
        else{
            vertexTypedArray = new Float32Array(positionAttr.typedArray.buffer, positionAttr.typedArray.byteOffset, positionAttr.typedArray.byteLength / 4);
        }
        var vertexArray = [];
        for(var t = 0; t < vertexPackage.verticesCount; t++){
            var x = vertexTypedArray[dim * t];
            var y = vertexTypedArray[dim * t + 1];
            if(isCompress){
                x = normConstant * x + minVertex.x;
                y = normConstant * y + minVertex.y;
            }
            vertexArray.push(new Cartesian2.Cartesian2(x, y));
        }
        BoundingRectangle.BoundingRectangle.fromPoints(vertexArray, boundingRectangle);
        vertexArray.length = 0;
        return boundingRectangle;
    }

    function calcBoundingSphereForClampGroundAndObjectLineCache(vertexPackage){
        var isCompress = when.defined(vertexPackage.nCompressOptions) && (vertexPackage.nCompressOptions & VertexCompressOption.SVC_Vertex) === VertexCompressOption.SVC_Vertex;
        var bSphere = new BoundingSphere.BoundingSphere();
        var v1 = new Cartographic.Cartesian3();
        var v2 = new Cartographic.Cartesian3();
        var positionAttr = vertexPackage.vertexAttributes[0];
        var posDim = positionAttr.componentsPerAttribute;
        var posAttrIndex = vertexPackage.attrLocation['aPosition'];
        var pos = vertexPackage.vertexAttributes[posAttrIndex];

        var posLowIndex = vertexPackage.attrLocation['aTexCoord5'];
        var posLowAttr = vertexPackage.vertexAttributes[posLowIndex];
        var posLowDim = posLowAttr.componentsPerAttribute;

        var posHighTypedArray, posLowTypedArray;
        if(isCompress){
            posDim = 3;
            posLowDim = 3;
            posHighTypedArray = getPosArrayForCompress(vertexPackage, pos);
            posLowTypedArray = getPosArrayForCompressTexCoord(vertexPackage, posLowAttr, 5);
        }
        else{
            posHighTypedArray = new Float32Array(positionAttr.typedArray.buffer, positionAttr.typedArray.byteOffset, positionAttr.typedArray.byteLength / 4);
            posLowTypedArray = new Float32Array(posLowAttr.typedArray.buffer, posLowAttr.typedArray.byteOffset, posLowAttr.typedArray.byteLength / 4);
        }

        var vertexArray = [];
        for(var t = 0; t < vertexPackage.verticesCount; t++){
            Cartographic.Cartesian3.fromArray(posHighTypedArray, posDim * t, v1);
            Cartographic.Cartesian3.fromArray(posLowTypedArray, posLowDim * t, v2);
            Cartographic.Cartesian3.add(v1, v2, v1);
            vertexArray.push(Cartographic.Cartesian3.clone(v1));
        }
        BoundingSphere.BoundingSphere.fromPoints(vertexArray, bSphere);
        vertexArray.length = 0;
        return bSphere;
    }

    S3MVertexPackage.calcBoundingSphereInWorker = function(fileType, vertexPackage){
        var bSphere;
        if(vertexPackage.instanceIndex > -1){
            bSphere = calcBoundingSphereForInstance(vertexPackage);
        }
        else if(when.defined(vertexPackage.clampRegionEdge)){
            bSphere = calcBoundingSphereForClampGroundAndObjectLineCache(vertexPackage);
        }
        else if(fileType >= DATAFILETYPE$1.ClampGroundPolygon && fileType <= DATAFILETYPE$1.ClampObjectLine){
            bSphere = calcBoundingSphereForShadowVolume(vertexPackage);
        }
        else if(fileType == DATAFILETYPE$1.ClampGroundAndObjectLineCache){
            bSphere = calcBoundingSphereForClampGroundAndObjectLineCache(vertexPackage);
        }
        else{
            bSphere = calcBoundingSphereForNormal(vertexPackage);
        }
        return bSphere;
    };

    S3MVertexPackage.calcBoundingSphere = function(layer, vertexPackage, modelMatrix){
        var fileType = layer._fileType;
        var bSphere;
        if(vertexPackage.instanceIndex > -1){
            bSphere = calcBoundingSphereForInstance(vertexPackage);
        }
        else if(when.defined(vertexPackage.clampRegionEdge)){
            bSphere = calcBoundingSphereForClampGroundAndObjectLineCache(vertexPackage);
        }
        else if(fileType >= DATAFILETYPE$1.ClampGroundPolygon && fileType <= DATAFILETYPE$1.ClampObjectLine){
            bSphere = calcBoundingSphereForShadowVolume(vertexPackage);
        }
        else if(fileType == DATAFILETYPE$1.ClampGroundAndObjectLineCache){
            bSphere = calcBoundingSphereForClampGroundAndObjectLineCache(vertexPackage);
        }
        else{
            bSphere = calcBoundingSphereForNormal(vertexPackage);
        }
        BoundingSphere.BoundingSphere.transform(bSphere, modelMatrix, bSphere);
        return bSphere;
    };

    S3MVertexPackage.calcBoundingRectangle = function(layer, vertexPackage){
        var fileType = layer._fileType;
        var boundingRectangle;
        if(fileType === DATAFILETYPE$1.ClampGroundPolygon){
            boundingRectangle = calcBoundingRectangleForShadowVolume(vertexPackage);
        }
        return boundingRectangle;
    };

    function convertToCesiumPrimitiveType(s3mType){
        var primitiveType = PrimitiveType.PrimitiveType.TRIANGLES;
        switch(s3mType){
            case 1 : primitiveType = PrimitiveType.PrimitiveType.POINTS;break;
            case 2 : primitiveType = PrimitiveType.PrimitiveType.LINES;break;
            case 3 : primitiveType = PrimitiveType.PrimitiveType.LINE_STRIP;break;
            case 4 : primitiveType = PrimitiveType.PrimitiveType.TRIANGLES;break;
        }
        return primitiveType;
    }

    function createEdgeIndex(nPointCount, nSubCount, subPointCounts, nVertexCount){
        var indexPackage = {};
        indexPackage.indicesCount = 6 * (nPointCount - nSubCount);
        indexPackage.indexType = nVertexCount > 65535 ? 1 : 0;
        indexPackage.primitiveType = PrimitiveType.PrimitiveType.TRIANGLES;
        var indicesArray;
        if( indexPackage.indexType === 0){
            indicesArray = new Uint16Array(indexPackage.indicesCount);
        }
        else{
            indicesArray = new Uint32Array(indexPackage.indicesCount);
        }

        var nCount = 0;
        for (var nSub = 0; nSub < nSubCount; nSub++){
            for (var nData = 0; nData < subPointCounts[nSub] - 1; nData++){
                indicesArray[6 * (nCount - nSub  + nData)]     = 4 * (nCount - nSub + nData);
                indicesArray[6 * (nCount - nSub  + nData) + 1] = 4 * (nCount - nSub + nData) + 2;
                indicesArray[6 * (nCount - nSub  + nData) + 2] = 4 * (nCount - nSub + nData) + 1;
                indicesArray[6 * (nCount - nSub  + nData) + 3] = 4 * (nCount - nSub + nData) + 1;
                indicesArray[6 * (nCount - nSub  + nData) + 4] = 4 * (nCount - nSub + nData) + 2;
                indicesArray[6 * (nCount - nSub  + nData) + 5] = 4 * (nCount - nSub + nData) + 3;
            }
            // 点计数增加
            nCount += subPointCounts[nSub];
        }
        indexPackage.indicesTypedArray = indicesArray;
        return indexPackage;
    }

    function getPosArrayForCompress(vertexPackage, posAttr){
        var nVertexDim = posAttr.componentsPerAttribute;
        var normConstant = vertexPackage.vertCompressConstant;
        var minVertex = new Cartographic.Cartesian3(vertexPackage.minVerticesValue.x, vertexPackage.minVerticesValue.y, vertexPackage.minVerticesValue.z);
        var compressVertexArray = new Uint16Array(posAttr.typedArray.buffer, posAttr.typedArray.byteOffset, posAttr.typedArray.byteLength / 2);
        var uncompressVertexArray = new Float32Array(vertexPackage.verticesCount * 3);
        var x, y, z;
        for(var t = 0; t < vertexPackage.verticesCount; t++){
            x = compressVertexArray[nVertexDim * t] * normConstant + minVertex.x;
            y = compressVertexArray[nVertexDim * t + 1] * normConstant + minVertex.y;
            z = compressVertexArray[nVertexDim * t + 2] * normConstant + minVertex.z;
            uncompressVertexArray[3 * t] = x;
            uncompressVertexArray[3 * t + 1] = y;
            uncompressVertexArray[3 * t + 2] = z;
        }
        return uncompressVertexArray;
    }

    function getPosArrayForCompressTexCoord(vertexPackage, texAttr, texIdx){
        var nVertexDim = texAttr.componentsPerAttribute;
        var texCoordCompressConstant = vertexPackage.texCoordCompressConstant[texIdx];
        var minVertex = new Cartesian4.Cartesian4(vertexPackage.minTexCoordValue[texIdx].x, vertexPackage.minTexCoordValue[texIdx].y, vertexPackage.minTexCoordValue[texIdx].z, vertexPackage.minTexCoordValue[texIdx].w);
        var compressVertexArray = new Uint16Array(texAttr.typedArray.buffer, texAttr.typedArray.byteOffset, texAttr.typedArray.byteLength / 2);
        var uncompressVertexArray = new Float32Array(vertexPackage.verticesCount * 3);
        var x, y, z;
        for(var t = 0; t < vertexPackage.verticesCount; t++){
            x = compressVertexArray[nVertexDim * t] * texCoordCompressConstant + minVertex.x;
            y = compressVertexArray[nVertexDim * t + 1] * texCoordCompressConstant + minVertex.y;
            z = compressVertexArray[nVertexDim * t + 2] * texCoordCompressConstant + minVertex.z;
            uncompressVertexArray[3 * t] = x;
            uncompressVertexArray[3 * t + 1] = y;
            uncompressVertexArray[3 * t + 2] = z;
        }
        return uncompressVertexArray;
    }

    function getEdgeIndexPackage(arrIndexPackage){
        var oldEdgeIndexPackages = [];
        var length = arrIndexPackage.length;
        for(var i = 0; i < length; i++){
            var primitveTpe = convertToCesiumPrimitiveType(arrIndexPackage[i].primitiveType);
            if(primitveTpe === PrimitiveType.PrimitiveType.LINES || primitveTpe === PrimitiveType.PrimitiveType.LINE_STRIP){
                oldEdgeIndexPackages.push(arrIndexPackage[i]);
            }
        }
        return oldEdgeIndexPackages;
    }

    function getEdgeCount(edgeIndexPackages){
        var nSubCount = 0;
        var length = edgeIndexPackages.length;
        for (var k = 0; k < length; k++){
            var indexPackage = edgeIndexPackages[k];
            var primitveTpe = convertToCesiumPrimitiveType(indexPackage.primitiveType);
            if(primitveTpe == PrimitiveType.PrimitiveType.LINES){
                nSubCount += indexPackage.indicesCount / 2;
            }
            else if(primitveTpe == PrimitiveType.PrimitiveType.LINE_STRIP){
                nSubCount++;
            }
        }
        return nSubCount;
    }

    function getEdgePointCount(edgeIndexPackages){
        var nPointCount = 0;
        var length = edgeIndexPackages.length;
        for (var k = 0; k < length; k++){
            var indexPackage = edgeIndexPackages[k];
            nPointCount += indexPackage.indicesCount;
        }
        return nPointCount;
    }

    function getEdgePointArray(posArray, nVertexDim, edgeIndexPackages){
        var arrEdgePoint = [];
        var i;
        var length = edgeIndexPackages.length;
        for(var k = 0; k < length; k++){
            var indexPackage = edgeIndexPackages[k];
            var indicesArray;
            if(indexPackage.indexType === 0){
                indicesArray = new Uint16Array(indexPackage.indicesTypedArray.buffer, indexPackage.indicesTypedArray.byteOffset,
                    indexPackage.indicesTypedArray.byteLength / 2);
            }
            else{
                indicesArray = new Uint32Array(indexPackage.indicesTypedArray.buffer, indexPackage.indicesTypedArray.byteOffset,
                    indexPackage.indicesTypedArray.byteLength / 4);
            }
            var primitiveType = convertToCesiumPrimitiveType(indexPackage.primitiveType);
            if(primitiveType == PrimitiveType.PrimitiveType.LINES){
                for(i = 0; i < indexPackage.indicesCount; i += 2) {
                    var segment = [];
                    var vecPoint3DStart = new Cartographic.Cartesian3();
                    vecPoint3DStart.x = posArray[indicesArray[i] * nVertexDim];
                    vecPoint3DStart.y = posArray[indicesArray[i] * nVertexDim + 1];
                    vecPoint3DStart.z = posArray[indicesArray[i] * nVertexDim + 2];
                    segment.push(vecPoint3DStart);
                    var vecPoint3DEnd = new Cartographic.Cartesian3();
                    vecPoint3DEnd.x = posArray[indicesArray[i + 1] * nVertexDim];
                    vecPoint3DEnd.y = posArray[indicesArray[i + 1] * nVertexDim + 1];
                    vecPoint3DEnd.z = posArray[indicesArray[i + 1] * nVertexDim + 2];
                    segment.push(vecPoint3DEnd);
                    arrEdgePoint.push(segment);
                }
            }
            else if(primitiveType == PrimitiveType.PrimitiveType.LINE_STRIP) {
                var segment = [];
                for(i = 0; i < indexPackage.indicesCount; i++) {
                    var vecPoint3D = new Cartographic.Cartesian3();
                    vecPoint3D.x = posArray[indicesArray[ i ] * nVertexDim];
                    vecPoint3D.y = posArray[indicesArray[ i ] * nVertexDim + 1];
                    vecPoint3D.z = posArray[indicesArray[ i ] * nVertexDim + 2];
                    segment.push(vecPoint3D);
                }
                arrEdgePoint.push(segment);
            }
        }
        return arrEdgePoint;
    }

    S3MVertexPackage.createEdge = function(vertexPackage, arrIndexPackage){
        if(arrIndexPackage.length < 1){
            return;
        }
        var oldEdgeIndexPackages = getEdgeIndexPackage(arrIndexPackage);
        if(oldEdgeIndexPackages.length == 0){
            return;
        }

        var nSubCount = getEdgeCount(oldEdgeIndexPackages);

        var posAttrIndex = vertexPackage.attrLocation['aPosition'];
        var pos = vertexPackage.vertexAttributes[posAttrIndex];
        var isCompress = when.defined(vertexPackage.nCompressOptions) && (vertexPackage.nCompressOptions & VertexCompressOption.SVC_Vertex) === VertexCompressOption.SVC_Vertex;
        var nVertexDim = pos.componentsPerAttribute;
        var posArray;
        if(isCompress){
            nVertexDim = 3;
            posArray = getPosArrayForCompress(vertexPackage, pos);
        }
        else{
            posArray = new Float32Array(pos.typedArray.buffer, pos.typedArray.byteOffset, pos.typedArray.byteLength / 4);
        }

        var nPointCount = getEdgePointCount(oldEdgeIndexPackages);
        var arrPoints = getEdgePointArray(posArray, nVertexDim, oldEdgeIndexPackages);

        var vertexCount = 4 * nPointCount - 4 * nSubCount;
        var edgePosArray = new Float32Array(vertexCount * 3);
        var edgeNormalArray = new Float32Array(vertexCount * 3);
        var edgeTex0Array = new Float32Array(vertexCount * 3);
        var edgeTex1Array = new Int8Array(vertexCount * 2);

        var nCount = 0;
        for (var nSub = 0; nSub < nSubCount; nSub++){
            var nSubSize = arrPoints[nSub].length;
            for (var nData = 0; nData < nSubSize; nData++){
                var nTempPointOffset = 4 * nCount - 4 * nSub;
                var nTemp = nTempPointOffset * 3 + 12 * nData;
                var vecPoint3D = arrPoints[nSub][nData];
                if(nData != 0){
                    edgePosArray[nTemp - 6] = vecPoint3D.x;
                    edgePosArray[nTemp - 5] = vecPoint3D.y;
                    edgePosArray[nTemp - 4] = vecPoint3D.z;

                    edgePosArray[nTemp - 3] = vecPoint3D.x;
                    edgePosArray[nTemp - 2] = vecPoint3D.y;
                    edgePosArray[nTemp - 1] = vecPoint3D.z;
                }
                if(nData != nSubSize - 1){
                    edgePosArray[nTemp] =	  vecPoint3D.x;
                    edgePosArray[nTemp + 1] = vecPoint3D.y;
                    edgePosArray[nTemp + 2] = vecPoint3D.z;

                    edgePosArray[nTemp + 3] = vecPoint3D.x;
                    edgePosArray[nTemp + 4] = vecPoint3D.y;
                    edgePosArray[nTemp + 5] = vecPoint3D.z;
                }

                var vVertexNext = vecPoint3D;
                if(nData + 1 < nSubSize){
                    vVertexNext = arrPoints[nSub][nData + 1];
                }
                if(nData != 0){
                    edgeTex0Array[nTemp - 6] = vVertexNext.x;
                    edgeTex0Array[nTemp - 5] = vVertexNext.y;
                    edgeTex0Array[nTemp - 4] = vVertexNext.z;

                    edgeTex0Array[nTemp - 3] = vVertexNext.x;
                    edgeTex0Array[nTemp - 2] = vVertexNext.y;
                    edgeTex0Array[nTemp - 1] = vVertexNext.z;
                }
                if(nData != nSubSize - 1){
                    edgeTex0Array[nTemp] =	   vVertexNext.x;
                    edgeTex0Array[nTemp + 1] = vVertexNext.y;
                    edgeTex0Array[nTemp + 2] = vVertexNext.z;

                    edgeTex0Array[nTemp + 3] = vVertexNext.x;
                    edgeTex0Array[nTemp + 4] = vVertexNext.y;
                    edgeTex0Array[nTemp + 5] = vVertexNext.z;
                }

                var vVertexPrev = vecPoint3D;
                if(nData >= 1){
                    vVertexPrev = arrPoints[nSub][nData-1];
                }
                if(nData != 0){
                    edgeNormalArray[nTemp - 6] = vVertexPrev.x;
                    edgeNormalArray[nTemp - 5] = vVertexPrev.y;
                    edgeNormalArray[nTemp - 4] = vVertexPrev.z;

                    edgeNormalArray[nTemp - 3] = vVertexPrev.x;
                    edgeNormalArray[nTemp - 2] = vVertexPrev.y;
                    edgeNormalArray[nTemp - 1] = vVertexPrev.z;
                }
                if(nData != nSubSize - 1){
                    edgeNormalArray[nTemp] =	 vVertexPrev.x;
                    edgeNormalArray[nTemp + 1] = vVertexPrev.y;
                    edgeNormalArray[nTemp + 2] = vVertexPrev.z;

                    edgeNormalArray[nTemp + 3] = vVertexPrev.x;
                    edgeNormalArray[nTemp + 4] = vVertexPrev.y;
                    edgeNormalArray[nTemp + 5] = vVertexPrev.z;
                }

                nTemp = nTempPointOffset * 2 + 8 * nData;
                if(nData != 0){
                    //expandAndWidth
                    edgeTex1Array[nTemp - 4] = -1;
                    edgeTex1Array[nTemp - 3] = -1;
                    edgeTex1Array[nTemp - 2] = 1;
                    edgeTex1Array[nTemp - 1] = -1;
                }
                if(nData != nSubSize - 1){
                    //expandAndWidth
                    edgeTex1Array[nTemp] = -1;
                    edgeTex1Array[nTemp + 1] = 1;
                    edgeTex1Array[nTemp + 2] = 1;
                    edgeTex1Array[nTemp + 3] = 1;
                }
            }
            nCount += arrPoints[nSub].length;
        }

        var edgeVertexPackage = {};
        edgeVertexPackage.vertexAttributes = [];
        edgeVertexPackage.attrLocation = {};
        var edgeAttributes = edgeVertexPackage.vertexAttributes;
        var edgeAttrLocation = edgeVertexPackage.attrLocation;
        edgeVertexPackage.instanceCount = 0;
        edgeVertexPackage.instanceMode = 0;

        edgeAttrLocation['aPosition'] = 0;
        edgeAttributes.push({
            index: edgeAttrLocation['aPosition'],
            typedArray: edgePosArray,
            componentsPerAttribute: 3,
            componentDatatype: ComponentDatatype.ComponentDatatype.FLOAT,
            offsetInBytes: 0,
            strideInBytes: 3 * Float32Array.BYTES_PER_ELEMENT,
            normalize: false
        });

        edgeAttrLocation['aNormal'] = 1;
        edgeAttributes.push({
            index: edgeAttrLocation['aNormal'],
            typedArray: edgeNormalArray,
            componentsPerAttribute: 3,
            componentDatatype: ComponentDatatype.ComponentDatatype.FLOAT,
            offsetInBytes: 0,
            strideInBytes: 3 * Float32Array.BYTES_PER_ELEMENT,
            normalize: false
        });

        edgeAttrLocation['aTexCoord0'] = 2;
        edgeAttributes.push({
            index: edgeAttrLocation['aTexCoord0'],
            typedArray: edgeTex0Array,
            componentsPerAttribute: 3,
            componentDatatype: ComponentDatatype.ComponentDatatype.FLOAT,
            offsetInBytes: 0,
            strideInBytes: 3 * Float32Array.BYTES_PER_ELEMENT,
            normalize: false
        });

        edgeAttrLocation['aTexCoord1'] = 3;
        edgeAttributes.push({
            index: edgeAttrLocation['aTexCoord1'],
            typedArray: edgeTex1Array,
            componentsPerAttribute: 2,
            componentDatatype: ComponentDatatype.ComponentDatatype.BYTE,
            offsetInBytes: 0,
            strideInBytes: 2 * Int8Array.BYTES_PER_ELEMENT,
            normalize: false
        });

        var arrPolyCount = [];
        for(var i = 0; i < arrPoints.length; i++) {
            arrPolyCount.push(arrPoints[i].length);
        }
        var edgeIndexPackage = createEdgeIndex(nPointCount, nSubCount, arrPolyCount, vertexCount);
        return {
            vertexPackage: edgeVertexPackage,
            indexPackage: edgeIndexPackage
        }
    };

    /**
     * S3M纹理压缩类型
     * @export S3MCompressType
     */
    var S3MCompressType = {
        /**
         * 非压缩
         */
        encNONE : 0,
        /**
         * DXT压缩
         */
        enrS3TCDXTN : 14,
        /**
         * PVR压缩-IOS设备
         */
        enrPVRTPF_PVRTC2 : 19,
        /**
         * PVR压缩-IOS设备
         */
        enrPVRTPF_PVRTC : 20,
        /**
         * PVR压缩-IOS设备
         */
        enrPVRTPF_PVRTC_4bpp : 21,
        /**
         * ETC压缩-安卓设备
         */
        enrPVRTPF_ETC1 : 22
    };

    var S3MCompressType$1 = Object.freeze(S3MCompressType);

    exports.DXTTextureDecode = DXTTextureDecode;
    exports.S3MCompressType = S3MCompressType$1;
    exports.S3MPixelFormat = S3MPixelFormat$1;
    exports.S3MVertexPackage = S3MVertexPackage;
    exports.VertexCompressOption = VertexCompressOption;
    exports.getStringFromTypedArray = getStringFromTypedArray;

});

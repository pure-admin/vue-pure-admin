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
define(['./when-8d13db60', './RuntimeError-ba10bc3e', './WebGLConstants-4c11ee5f', './createTaskProcessorWorker', './PixelFormat-e6d821ed'], function (when, RuntimeError, WebGLConstants, createTaskProcessorWorker, PixelFormat) { 'use strict';

    // Modified from texture-tester
    // See:
    //     https://github.com/toji/texture-tester/blob/master/js/webgl-texture-util.js
    //     http://toji.github.io/texture-tester/

    /**
     * @license
     *
     * Copyright (c) 2014, Brandon Jones. All rights reserved.
     *
     * Redistribution and use in source and binary forms, with or without modification,
     * are permitted provided that the following conditions are met:
     *
     *  * Redistributions of source code must retain the above copyright notice, this
     *  list of conditions and the following disclaimer.
     *  * Redistributions in binary form must reproduce the above copyright notice,
     *  this list of conditions and the following disclaimer in the documentation
     *  and/or other materials provided with the distribution.
     *
     * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
     * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
     * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
     * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
     * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
     * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     */

    // Taken from crnlib.h
    var CRN_FORMAT = {
        cCRNFmtInvalid: -1,

        cCRNFmtDXT1: 0,
        // cCRNFmtDXT3 is not currently supported when writing to CRN - only DDS.
        cCRNFmtDXT3: 1,
        cCRNFmtDXT5: 2

        // Crunch supports more formats than this, but we can't use them here.
    };

    // Mapping of Crunch formats to DXT formats.
    var DXT_FORMAT_MAP = {};
    DXT_FORMAT_MAP[CRN_FORMAT.cCRNFmtDXT1] = PixelFormat.PixelFormat.RGB_DXT1;
    DXT_FORMAT_MAP[CRN_FORMAT.cCRNFmtDXT3] = PixelFormat.PixelFormat.RGBA_DXT3;
    DXT_FORMAT_MAP[CRN_FORMAT.cCRNFmtDXT5] = PixelFormat.PixelFormat.RGBA_DXT5;

    var dst;
    var dxtData;
    var cachedDstSize = 0;

    var crunch;

    // Copy an array of bytes into or out of the emscripten heap.
    function arrayBufferCopy(src, dst, dstByteOffset, numBytes) {
        var i;
        var dst32Offset = dstByteOffset / 4;
        var tail = (numBytes % 4);
        var src32 = new Uint32Array(src.buffer, 0, (numBytes - tail) / 4);
        var dst32 = new Uint32Array(dst.buffer);
        for (i = 0; i < src32.length; i++) {
            dst32[dst32Offset + i] = src32[i];
        }
        for (i = numBytes - tail; i < numBytes; i++) {
            dst[dstByteOffset + i] = src[i];
        }
    }

    /**
     * @private
     */
    function convertCRNToDXT(parameters, transferableObjects) {
        // Copy the contents of the arrayBuffer into emscriptens heap.
        var arrayBuffer = parameters.data;
        var srcSize = arrayBuffer.byteLength;
        var bytes = new Uint8Array(arrayBuffer);
        var src = crunch._malloc(srcSize);
        arrayBufferCopy(bytes, crunch.HEAPU8, src, srcSize);

        // Determine what type of compressed data the file contains.
        var crnFormat = crunch._crn_get_dxt_format(src, srcSize);
        var format = DXT_FORMAT_MAP[crnFormat];
        if (!when.defined(format)) {
            throw new RuntimeError.RuntimeError('Unsupported compressed format.');
        }

        // Gather basic metrics about the DXT data.
        var levels = crunch._crn_get_levels(src, srcSize);
        var width = crunch._crn_get_width(src, srcSize);
        var height = crunch._crn_get_height(src, srcSize);

        // Determine the size of the decoded DXT data.
        var dstSize = 0;
        var i;
        for (i = 0; i < levels; ++i) {
            dstSize += PixelFormat.PixelFormat.compressedTextureSizeInBytes(format, width >> i, height >> i);
        }

        // Allocate enough space on the emscripten heap to hold the decoded DXT data
        // or reuse the existing allocation if a previous call to this function has
        // already acquired a large enough buffer.
        if(cachedDstSize < dstSize) {
            if(when.defined(dst)) {
                crunch._free(dst);
            }
            dst = crunch._malloc(dstSize);
            dxtData = new Uint8Array(crunch.HEAPU8.buffer, dst, dstSize);
            cachedDstSize = dstSize;
        }

        // Decompress the DXT data from the Crunch file into the allocated space.
        crunch._crn_decompress(src, srcSize, dst, dstSize, 0, levels);

        // Release the crunch file data from the emscripten heap.
        crunch._free(src);

        var bOutMipMapData = when.defaultValue(parameters.bMipMap, false);
        if(bOutMipMapData){
            var dXTDataMipMap = dxtData.slice(0, dstSize);
            transferableObjects.push(dXTDataMipMap.buffer);
            return new PixelFormat.CompressedTextureBuffer(format, width, height, dXTDataMipMap);
        }
        else {
            // Mipmaps are unsupported, so copy the level 0 texture
            // When mipmaps are supported, a copy will still be necessary as dxtData is a view on the heap.
            var length = PixelFormat.PixelFormat.compressedTextureSizeInBytes(format, width, height);

            // Get a copy of the 0th mip level. dxtData will exceed length when there are more mip levels.
            // Equivalent to dxtData.slice(0, length), which is not supported in IE11
            var level0DXTDataView = dxtData.subarray(0, length);
            var level0DXTData = new Uint8Array(length);
            level0DXTData.set(level0DXTDataView, 0);

            transferableObjects.push(level0DXTData.buffer);
            return new PixelFormat.CompressedTextureBuffer(format, width, height, level0DXTData);
        }
    }

    function initWorker(crunchModule) {
        crunch = crunchModule;
        self.onmessage = createTaskProcessorWorker(convertCRNToDXT);
        self.postMessage(true);
    }

    function transcodeCRNToDXT(event) {
        var data = event.data;

        // Expect the first message to be to load a web assembly module
        var wasmConfig = data.webAssemblyConfig;
        if (when.defined(wasmConfig)) {
            // Require and compile WebAssembly module, or use fallback if not supported
            return require([wasmConfig.modulePath], function(crnModule) {
                if (when.defined(wasmConfig.wasmBinaryFile)) {
                    if (!when.defined(crnModule)) {
                        crnModule = self.Module;
                    }
                    initWorker(crnModule);
                } else {
                    initWorker(crnModule);
                }
            });
        }
    }

    return transcodeCRNToDXT;

});

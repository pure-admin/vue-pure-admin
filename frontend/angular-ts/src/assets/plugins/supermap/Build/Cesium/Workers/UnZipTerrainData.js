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
define(['./when-8d13db60', './createTaskProcessorWorker', './pako_inflate-8ea163f9', './unzip-b0fc9445'], function (when, createTaskProcessorWorker, pako_inflate, unzip) { 'use strict';

    var unzipwasmReady = false;
    unzip.unzip.onRuntimeInitialized = function() {
        unzipwasmReady = true;
    };

    var unzipwasm = unzip.unzip.cwrap('unzip', 'number', ['number', 'number', 'number', 'number']);
    var freec = unzip.unzip.cwrap('freePointer', null, ['number']);
    function unzipWithwasm(datazip) {
        var unzipsize = datazip.length * 4;
        var offset = unzip.unzip._malloc(Uint8Array.BYTES_PER_ELEMENT * unzipsize); //开辟内存
        var tar = new Uint8Array(unzipsize);
        unzip.unzip.HEAPU8.set(tar, offset / Uint8Array.BYTES_PER_ELEMENT);
        var offset1 = unzip.unzip._malloc(Uint8Array.BYTES_PER_ELEMENT * datazip.length);
        unzip.unzip.HEAPU8.set(datazip, offset1 / Uint8Array.BYTES_PER_ELEMENT);

        var resultLen;
        while ((resultLen = unzipwasm(offset, unzipsize, offset1, datazip.length)) == 0) {
            freec(offset); //释放内存
            unzipsize *= 4;
            offset = unzip.unzip._malloc(Uint8Array.BYTES_PER_ELEMENT * unzipsize);
            tar = new Uint8Array(unzipsize);
            unzip.unzip.HEAPU8.set(tar, offset / Uint8Array.BYTES_PER_ELEMENT);
        }
        var res = new Uint8Array(unzip.unzip.HEAPU8.buffer, offset, resultLen);
        datazip = null;
        tar = null;
        var buffer = new Uint8Array(res);
        freec(offset);
        freec(offset1);
        return buffer;
    }

    function UnZipTerrainData(parameters, transferableObjects) {
        var buffer = parameters.data;
        var dataZip = new Uint8Array(buffer);

        var unzipBuffer;
        if (unzipwasmReady === true) {
            unzipBuffer = unzipWithwasm(dataZip);
            return {
                data : unzipBuffer
            };
        } else {
            unzipBuffer = pako_inflate.pako.inflate(dataZip).buffer;
        }
        
        transferableObjects.push(unzipBuffer);

        return {
            data : new Uint8Array(unzipBuffer)
        };
    }

    var UnZipTerrainData$1 = createTaskProcessorWorker(UnZipTerrainData);

    return UnZipTerrainData$1;

});

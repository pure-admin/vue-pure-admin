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
define(['./when-8d13db60', './Check-70bec281', './Math-61ede240', './Cartographic-fe4be337', './Cartesian2-85064f09', './BoundingSphere-775c5788', './Cartesian4-5af5bb24', './RuntimeError-ba10bc3e', './WebGLConstants-4c11ee5f', './ComponentDatatype-5862616f', './PrimitiveType-97893bc7', './FeatureDetection-7bd32c34', './createTaskProcessorWorker', './BoundingRectangle-dc808c42', './Color-69f1845f', './pako_inflate-8ea163f9', './S3MCompressType-3a5e0577'], function (when, Check, _Math, Cartographic, Cartesian2, BoundingSphere, Cartesian4, RuntimeError, WebGLConstants, ComponentDatatype, PrimitiveType, FeatureDetection, createTaskProcessorWorker, BoundingRectangle, Color, pako_inflate, S3MCompressType) { 'use strict';

    function Bound3D(left, bottom, right, top, minHeight, maxHeight) {
        this.left = left;
        this.bottom = bottom;
        this.right = right;
        this.top = top;
        this.minHeight = minHeight;
        this.maxHeight = maxHeight;
        this.width = right - left;
        this.length = top - bottom;
        this.height = maxHeight - minHeight;

    }
    function parseGeoPackage(geoPackage, typedArray, view, bytesOffset, needCreateEdge, transferableObjects) {
        var geoName = view.getUint32(bytesOffset, true);
        bytesOffset += Uint32Array.BYTES_PER_ELEMENT;
        var byteLength = 0;
        var vertexPackage = {};
        var attributes = vertexPackage.vertexAttributes = [];
        var attrLocation = vertexPackage.attrLocation = {};
        vertexPackage.instanceCount = 0;
        vertexPackage.instanceMode = 0;
        var index = 0;
        var nVertexOptions = view.getUint32(bytesOffset, true);
        bytesOffset += Uint32Array.BYTES_PER_ELEMENT;
        var vertexDimension = view.getUint16(bytesOffset, true);
        bytesOffset += Uint32Array.BYTES_PER_ELEMENT;
        var normalDimension = vertexDimension;
        if (vertexDimension > 4) {
            normalDimension = vertexDimension >> 8;
            vertexDimension = vertexDimension & 0x0f;
        }
        var verticesCount = view.getUint32(bytesOffset, true);
        bytesOffset += Uint32Array.BYTES_PER_ELEMENT;
        if (verticesCount > 0) {
            var vertexStride = view.getUint16(bytesOffset, true);
            vertexStride = vertexDimension * Float32Array.BYTES_PER_ELEMENT;
            bytesOffset += Uint32Array.BYTES_PER_ELEMENT;
            byteLength = verticesCount * vertexStride;
            attrLocation['aPosition'] = index;
            attributes.push({
                index: attrLocation['aPosition'],
                typedArray: typedArray.subarray(bytesOffset, bytesOffset + byteLength),
                componentsPerAttribute: vertexDimension,
                componentDatatype: ComponentDatatype.ComponentDatatype.FLOAT,
                offsetInBytes: 0,
                strideInBytes: vertexStride,
                normalize: false
            });
            index++;
            bytesOffset += byteLength;
        }

        var normalCount = view.getUint32(bytesOffset, true);
        bytesOffset += Uint32Array.BYTES_PER_ELEMENT;
        if (normalCount > 0) {
            var normalStride = view.getUint16(bytesOffset, true);
            normalStride = normalDimension * Float32Array.BYTES_PER_ELEMENT;
            bytesOffset += Uint32Array.BYTES_PER_ELEMENT;
            byteLength = normalCount * normalStride;
            if(!geoPackage.ignoreNormal){
                attrLocation['aNormal'] = index;
                attributes.push({
                    index: attrLocation['aNormal'],
                    typedArray: typedArray.subarray(bytesOffset, bytesOffset + byteLength),
                    componentsPerAttribute: normalDimension,
                    componentDatatype: ComponentDatatype.ComponentDatatype.FLOAT,
                    offsetInBytes: 0,
                    strideInBytes: normalStride,
                    normalize: false
                });
                index++;
            }
            bytesOffset += byteLength;
        }

        var vertexColorCount = view.getUint32(bytesOffset, true);
        bytesOffset += Uint32Array.BYTES_PER_ELEMENT;
        if (vertexColorCount > 0) {
            var vertexColor = new Uint8Array(4 * vertexColorCount);
            transferableObjects.push(vertexColor.buffer);
            var vertexColorStride = view.getUint32(bytesOffset, true);
            vertexColorStride = 4 * Float32Array.BYTES_PER_ELEMENT;
            bytesOffset += Uint32Array.BYTES_PER_ELEMENT;
            byteLength = vertexColorCount * vertexColorStride;
            var oriVertexColor = new Float32Array(typedArray.buffer, bytesOffset, verticesCount * 4);
            for (var m = 0; m < verticesCount; m++) {
                vertexColor[4 * m] = oriVertexColor[4 * m] * 255;
                vertexColor[4 * m + 1] = oriVertexColor[4 * m + 1] * 255;
                vertexColor[4 * m + 2] = oriVertexColor[4 * m + 2] * 255;
                vertexColor[4 * m + 3] = oriVertexColor[4 * m + 3] * 255;
            }
            bytesOffset += byteLength;
            attrLocation['aColor'] = index;
            attributes.push({
                index: attrLocation['aColor'],
                typedArray: vertexColor,
                componentsPerAttribute: 4,
                componentDatatype: ComponentDatatype.ComponentDatatype.UNSIGNED_BYTE,
                offsetInBytes: 0,
                strideInBytes: 4,
                normalize: true
            });
            index++;
        }

        var secondVertexColorCount = view.getUint32(bytesOffset, true);
        bytesOffset += Uint32Array.BYTES_PER_ELEMENT;
        if (secondVertexColorCount > 0) {
            byteLength = secondVertexColorCount * 16;
            bytesOffset += byteLength;
        }

        var textureCount = view.getUint32(bytesOffset, true);
        bytesOffset += Uint32Array.BYTES_PER_ELEMENT;
        var instanceIndex = -1;
        var texCoordCount, texCoordStride, texCoordDim;
        for (var j = 0; j < textureCount; j++) {
            texCoordCount = view.getUint32(bytesOffset, true);
            bytesOffset += Uint32Array.BYTES_PER_ELEMENT;
            texCoordDim = view.getUint16(bytesOffset, true);
            bytesOffset += Uint16Array.BYTES_PER_ELEMENT;
            texCoordStride = view.getUint16(bytesOffset, true);
            bytesOffset += Uint16Array.BYTES_PER_ELEMENT;
            byteLength = texCoordCount * texCoordDim * Float32Array.BYTES_PER_ELEMENT;
            var texBuffer = typedArray.subarray(bytesOffset, bytesOffset + byteLength);
            if (instanceIndex == -1 && (texCoordDim == 20 || texCoordDim == 35)) {
                instanceIndex = j;
                vertexPackage.instanceCount = texCoordCount;
                vertexPackage.instanceMode = texCoordDim;
                vertexPackage.instanceBuffer = texBuffer;
                var byteStride;
                if (texCoordDim === 20) {
                    byteStride = Float32Array.BYTES_PER_ELEMENT * 20;
                    attrLocation['uv2'] = index++;
                    attributes.push({
                        index: attrLocation['uv2'],
                        componentsPerAttribute: 4,
                        componentDatatype: ComponentDatatype.ComponentDatatype.FLOAT,
                        normalize: false,
                        offsetInBytes: 0,
                        strideInBytes: byteStride,
                        instanceDivisor: 1
                    });

                    attrLocation['uv3'] = index++;
                    attributes.push({
                        index: attrLocation['uv3'],
                        componentsPerAttribute: 4,
                        componentDatatype: ComponentDatatype.ComponentDatatype.FLOAT,
                        normalize: false,
                        offsetInBytes: 4 * Float32Array.BYTES_PER_ELEMENT,
                        strideInBytes: byteStride,
                        instanceDivisor: 1
                    });

                    attrLocation['uv4'] = index++;
                    attributes.push({
                        index: attrLocation['uv4'],
                        componentsPerAttribute: 4,
                        componentDatatype: ComponentDatatype.ComponentDatatype.FLOAT,
                        normalize: false,
                        offsetInBytes: 8 * Float32Array.BYTES_PER_ELEMENT,
                        strideInBytes: byteStride,
                        instanceDivisor: 1
                    });

                    attrLocation['secondary_colour'] = index++;
                    attributes.push({
                        index: attrLocation['secondary_colour'],
                        componentsPerAttribute: 4,
                        componentDatatype: ComponentDatatype.ComponentDatatype.FLOAT,
                        normalize: false,
                        offsetInBytes: 12 * Float32Array.BYTES_PER_ELEMENT,
                        strideInBytes: byteStride,
                        instanceDivisor: 1
                    });

                    attrLocation['uv6'] = index++;
                    attributes.push({
                        index: attrLocation['uv6'],
                        componentsPerAttribute: 4,
                        componentDatatype: ComponentDatatype.ComponentDatatype.FLOAT,
                        normalize: false,
                        offsetInBytes: 16 * Float32Array.BYTES_PER_ELEMENT,
                        strideInBytes: byteStride,
                        instanceDivisor: 1
                    });
                }
                else if (texCoordDim === 35) {
                    byteStride = Float32Array.BYTES_PER_ELEMENT * 35;
                    attrLocation['uv1'] = index++;
                    attributes.push({
                        index: attrLocation['uv1'],
                        componentsPerAttribute: 4,
                        componentDatatype: ComponentDatatype.ComponentDatatype.FLOAT,
                        normalize: false,
                        offsetInBytes: 0,
                        strideInBytes: byteStride,
                        instanceDivisor: 1,
                        byteLength: byteLength
                    });
                    attrLocation['uv2'] = index++;
                    attributes.push({
                        index: attrLocation['uv2'],
                        componentsPerAttribute: 4,
                        componentDatatype: ComponentDatatype.ComponentDatatype.FLOAT,
                        normalize: false,
                        offsetInBytes: 4 * Float32Array.BYTES_PER_ELEMENT,
                        strideInBytes: byteStride,
                        instanceDivisor: 1
                    });
                    attrLocation['uv3'] = index++;
                    attributes.push({
                        index: attrLocation['uv3'],
                        componentsPerAttribute: 4,
                        componentDatatype: ComponentDatatype.ComponentDatatype.FLOAT,
                        normalize: false,
                        offsetInBytes: 8 * Float32Array.BYTES_PER_ELEMENT,
                        strideInBytes: byteStride,
                        instanceDivisor: 1
                    });
                    attrLocation['uv4'] = index++;
                    attributes.push({
                        index: attrLocation['uv4'],
                        componentsPerAttribute: 4,
                        componentDatatype: ComponentDatatype.ComponentDatatype.FLOAT,
                        normalize: false,
                        offsetInBytes: 12 * Float32Array.BYTES_PER_ELEMENT,
                        strideInBytes: byteStride,
                        instanceDivisor: 1
                    });
                    attrLocation['uv5'] = index++;
                    attributes.push({
                        index: attrLocation['uv5'],
                        componentsPerAttribute: 4,
                        componentDatatype: ComponentDatatype.ComponentDatatype.FLOAT,
                        normalize: false,
                        offsetInBytes: 16 * Float32Array.BYTES_PER_ELEMENT,
                        strideInBytes: byteStride,
                        instanceDivisor: 1
                    });
                    attrLocation['uv6'] = index++;
                    attributes.push({
                        index: attrLocation['uv6'],
                        componentsPerAttribute: 4,
                        componentDatatype: ComponentDatatype.ComponentDatatype.FLOAT,
                        normalize: false,
                        offsetInBytes: 20 * Float32Array.BYTES_PER_ELEMENT,
                        strideInBytes: byteStride,
                        instanceDivisor: 1
                    });
                    attrLocation['uv7'] = index++;
                    attributes.push({
                        index: attrLocation['uv7'],
                        componentsPerAttribute: 3,
                        componentDatatype: ComponentDatatype.ComponentDatatype.FLOAT,
                        normalize: false,
                        offsetInBytes: 24 * Float32Array.BYTES_PER_ELEMENT,
                        strideInBytes: byteStride,
                        instanceDivisor: 1
                    });
                    attrLocation['secondary_colour'] = index++;
                    attributes.push({
                        index: attrLocation['secondary_colour'],
                        componentsPerAttribute: 4,
                        componentDatatype: ComponentDatatype.ComponentDatatype.FLOAT,
                        normalize: false,
                        offsetInBytes: 27 * Float32Array.BYTES_PER_ELEMENT,
                        strideInBytes: byteStride,
                        instanceDivisor: 1
                    });
                    attrLocation['uv9'] = index++;
                    attributes.push({
                        index: attrLocation['uv9'],
                        componentsPerAttribute: 4,
                        componentDatatype: ComponentDatatype.ComponentDatatype.FLOAT,
                        normalize: false,
                        offsetInBytes: 31 * Float32Array.BYTES_PER_ELEMENT,
                        strideInBytes: byteStride,
                        instanceDivisor: 1
                    });
                }
            }
            else {
                if (instanceIndex !== -1) {
                    vertexPackage.instanceBounds = new Float32Array(typedArray.buffer, bytesOffset, texCoordCount * texCoordDim);
                }
                else {
                    var str = 'aTexCoord' + j;
                    attrLocation[str] = index++;
                    attributes.push({
                        index: attrLocation[str],
                        typedArray: texBuffer,
                        componentsPerAttribute: texCoordDim,
                        componentDatatype: ComponentDatatype.ComponentDatatype.FLOAT,
                        offsetInBytes: 0,
                        strideInBytes: texCoordDim * Float32Array.BYTES_PER_ELEMENT,
                        normalize: false
                    });
                }
            }
            bytesOffset += byteLength;
        }

        vertexPackage.verticesCount = verticesCount;
        vertexPackage.instanceIndex = instanceIndex;
        var indexPackageSize = view.getUint32(bytesOffset, true);
        bytesOffset += Uint32Array.BYTES_PER_ELEMENT;
        var arrIndexPackage = [];
        for (var j = 0; j < indexPackageSize; j++) {
            var indexPackage = {};
            var indicesCount = view.getUint32(bytesOffset, true);
            bytesOffset += Uint32Array.BYTES_PER_ELEMENT;
            var indexType = view.getUint8(bytesOffset, true);
            bytesOffset += Uint8Array.BYTES_PER_ELEMENT;
            var useIndex = view.getUint8(bytesOffset, true);
            bytesOffset += Uint8Array.BYTES_PER_ELEMENT;
            var primitiveType = view.getUint8(bytesOffset, true);
            bytesOffset += Uint8Array.BYTES_PER_ELEMENT;
            bytesOffset += 1;
            indexPackage.indicesCount = indicesCount;
            indexPackage.indexType = indexType;
            indexPackage.primitiveType = primitiveType;
            var indexOffset = bytesOffset;
            if (indicesCount > 0) {
                if (indexType == 0) {
                    byteLength = indicesCount * Uint16Array.BYTES_PER_ELEMENT;
                    bytesOffset += byteLength;
                    if (indicesCount % 2 == 1) {
                        bytesOffset += 2;
                    }
                }
                else {
                    byteLength = indicesCount * 4;
                    bytesOffset += byteLength;
                }
            }

            indexPackage.indicesTypedArray = typedArray.subarray(indexOffset, indexOffset + byteLength);
            var passNameCount = view.getUint32(bytesOffset, true);
            bytesOffset += Uint32Array.BYTES_PER_ELEMENT;
            var materialCode = view.getUint32(bytesOffset, true);
            bytesOffset += Uint32Array.BYTES_PER_ELEMENT * passNameCount;
            indexPackage.materialCode = materialCode;
            arrIndexPackage.push(indexPackage);
        }

        var edgeGeometry;
        if(needCreateEdge){
            edgeGeometry = S3MCompressType.S3MVertexPackage.createEdge(vertexPackage, arrIndexPackage);
        }

        geoPackage[geoName] = {
            vertexPackage: vertexPackage,
            arrIndexPackage: arrIndexPackage,
            edgeGeometry : edgeGeometry
        };

        return bytesOffset;
    }

    function createBatchIdAttribute(vertexPackage, typedArray, instanceDivisor) {
        var vertexAttributes = vertexPackage.vertexAttributes;
        var attrLocation = vertexPackage.attrLocation;
        var len = vertexAttributes.length;
        var attrName = instanceDivisor === 1 ? 'instanceId' : 'batchId';
        attrLocation[attrName] = len;
        vertexAttributes.push({
            index: len,
            typedArray: typedArray,
            componentsPerAttribute: 1,
            componentDatatype: ComponentDatatype.ComponentDatatype.FLOAT,
            offsetInBytes: 0,
            strideInBytes: 0,
            instanceDivisor : instanceDivisor
        });
    }

    function S3MTilesParser(parameters, transferableObjects) {
        var buffer = parameters.buffer;
        //transferableObjects.push(buffer);
        var supportCompressType = parameters.supportCompressType;
        var bVolume = parameters.bVolume;//是否是体渲染数据
        var createEdge = parameters.createEdge;
        var bound3D = null;
        var volBounds = null;
        var volImageBuffer = null;
        if (bVolume) {
            if (parameters.volbuffer.byteLength < 8) {
                bVolume = false;
            }
        }
        if (bVolume) {

            var volData = parameters.volbuffer;
            var dataZip = new Uint8Array(volData, 8);
            var volumeBuffer = pako_inflate.pako.inflate(dataZip).buffer;
            var volVersion = new Float64Array(volumeBuffer, 0, 1);
            var volFormat = new Uint32Array(volumeBuffer , 48, 1);

            if(volVersion[0] === 0.0 || volFormat[0] === 3200 || volFormat[0] === 3201)
            {
                var nHeaderOffset = 0;
                if(volVersion[0] === 0.0)
                {
                    nHeaderOffset = 8;
                }

                transferableObjects.push(volumeBuffer);
                var boundsArray = new Float64Array(volumeBuffer, nHeaderOffset, 6);
                var left = boundsArray[0];
                var top = boundsArray[1];
                var right = boundsArray[2];
                var bottom = boundsArray[3];
                var minHeight = boundsArray[4] < boundsArray[5] ? boundsArray[4] : boundsArray[5];
                var maxHeight = boundsArray[4] > boundsArray[5] ? boundsArray[4] : boundsArray[5];
                bound3D = new Bound3D(left, bottom, right, top, minHeight, maxHeight);

                volBounds = {
                    left: left,
                    top: top,
                    right: right,
                    bottom: bottom,
                    minHeight: minHeight,
                    maxHeight: maxHeight,
                    width: bound3D.width,
                    length: bound3D.length,
                    height: bound3D.height
                };

                // 中间空出来
                var infoVolume = new Uint32Array(volumeBuffer, 48 + nHeaderOffset, 7);
                var nFormat = infoVolume[0];
                var nSideBlockCount = infoVolume[1];
                var nBlockLength = infoVolume[2];
                var nLength = infoVolume[3];
                var nWidth = infoVolume[4];
                var nHeight = infoVolume[5];
                var nDepth = infoVolume[6];
                var nCount = nLength * nLength * 4;
                var image = new Uint8Array(volumeBuffer, 76 + nHeaderOffset, nCount);
                volImageBuffer = {
                    nFormat: nFormat,
                    nSideBlockCount: nSideBlockCount,
                    nBlockLength: nBlockLength,
                    nLength: nLength,
                    nWidth: nWidth,
                    nHeight: nHeight,
                    nDepth: nDepth,
                    imageArray: image
                };
            }
        }

        var bytesOffset = 0;
        var header = new Uint8Array(buffer, 0, 4);
        if (header[0] !== 115 || header[1] !== 51 || header[2] !== 109) {
            return {
                result: false
            };
        }

        var version = header[3];
        var dataZip = new Uint8Array(buffer, 4);
        var unzipBuffer = pako_inflate.pako.inflate(dataZip).buffer;
        var typedArray = new Uint8Array(unzipBuffer);
        transferableObjects.push(typedArray.buffer);
        var view = new DataView(unzipBuffer);
        var xmlSize = view.getUint32(bytesOffset, true);
        bytesOffset += Uint32Array.BYTES_PER_ELEMENT;
        var xmlBuffer = new Uint8Array(unzipBuffer, bytesOffset, xmlSize);
        var nAlign = xmlSize % 4;
        if(nAlign){
            nAlign = 4 - nAlign;
        }

        bytesOffset += xmlSize + nAlign;

        var xmlDoc = S3MCompressType.getStringFromTypedArray(xmlBuffer, undefined, undefined, 'gbk');
        xmlDoc = xmlDoc.replace(new RegExp("\r\n",'gm'),'');
        xmlDoc = xmlDoc.replace(new RegExp(":",'gm'),'');

        var packageSize = view.getUint32(bytesOffset, true);
        bytesOffset += Uint32Array.BYTES_PER_ELEMENT;
        var geoCount = view.getUint32(bytesOffset, true);
        bytesOffset += Uint32Array.BYTES_PER_ELEMENT;
        var geoPackage = {};
        geoPackage.ignoreNormal = parameters.ignoreNormal;
        for (var i = 0; i < geoCount; i++) {
            bytesOffset = parseGeoPackage(geoPackage, typedArray, view, bytesOffset, createEdge, transferableObjects);
        }

        var pickInfoPackageCount = view.getUint32(bytesOffset, true);
        bytesOffset += Uint32Array.BYTES_PER_ELEMENT;
        var pickColorCount = view.getUint32(bytesOffset, true);
        bytesOffset += Uint32Array.BYTES_PER_ELEMENT;
        for (var i = 0; i < pickColorCount; i++) {
            var geoName = view.getUint32(bytesOffset, true);
            bytesOffset += Uint32Array.BYTES_PER_ELEMENT;
            var pickIdsCount = view.getUint32(bytesOffset, true);
            bytesOffset += Uint32Array.BYTES_PER_ELEMENT;
            var pickInfo = {};
            var bInstanced = geoPackage[geoName].vertexPackage.instanceIndex;
            if (bInstanced == -1) {
                var batchIds = new Float32Array(geoPackage[geoName].vertexPackage.verticesCount);
                for (var j = 0; j < pickIdsCount; j++) {
                    var pickId = view.getUint32(bytesOffset, true);
                    bytesOffset += Uint32Array.BYTES_PER_ELEMENT;
                    var size = view.getUint32(bytesOffset, true);
                    bytesOffset += Uint32Array.BYTES_PER_ELEMENT;
                    var vertexCount = 0, vertexColorOffset = 0;
                    pickInfo[pickId] = {
                        batchId : j
                    };
                    for (var k = 0; k < size; k++) {
                        vertexColorOffset = view.getUint32(bytesOffset, true);
                        bytesOffset += Uint32Array.BYTES_PER_ELEMENT;
                        vertexCount = view.getUint32(bytesOffset, true);
                        bytesOffset += Uint32Array.BYTES_PER_ELEMENT;
                        if (batchIds.fill) {
                            batchIds.fill(j, vertexColorOffset, vertexColorOffset + vertexCount);
                        } else {
                            var total = vertexColorOffset + vertexColorOffset;
                            for(var m = vertexColorOffset; m < total; m++) {
                                batchIds[m] = j;
                            }
                        }
                    }
                    pickInfo[pickId].vertexColorOffset = vertexColorOffset;
                    pickInfo[pickId].vertexColorCount = vertexCount;
                }

                createBatchIdAttribute(geoPackage[geoName].vertexPackage, batchIds, undefined);
            }
            else {
                var instanceCount = geoPackage[geoName].vertexPackage.instanceCount;
                var instanceArray = geoPackage[geoName].vertexPackage.instanceBuffer;
                var instanceMode = geoPackage[geoName].vertexPackage.instanceMode;
                var instanceIds = new Float32Array(instanceCount);
                var instanceIdIndex = 0;
                for (var j = 0; j < pickIdsCount; j++) {
                    var pickId = view.getUint32(bytesOffset, true);
                    bytesOffset += Uint32Array.BYTES_PER_ELEMENT;
                    var size = view.getUint32(bytesOffset, true);
                    bytesOffset += Uint32Array.BYTES_PER_ELEMENT;
                    for (var k = 0; k < size; k++) {
                        var instanceId = view.getUint32(bytesOffset, true);
                        bytesOffset += Uint32Array.BYTES_PER_ELEMENT;
                        instanceIds[instanceIdIndex] = instanceIdIndex;
                        if(pickInfo[pickId] === undefined){
                            pickInfo[pickId] = {
                                vertexColorCount : 1,
                                instanceIds : [],
                                vertexColorOffset : instanceIdIndex
                            };
                        }
                        pickInfo[pickId].instanceIds.push(instanceId);
                        instanceIdIndex ++;
                    }

                }

                createBatchIdAttribute(geoPackage[geoName].vertexPackage, instanceIds, 1);
            }

            geoPackage[geoName].pickInfo = pickInfo;
        }

        var texturePackageCount = view.getUint32(bytesOffset, true);
        bytesOffset += Uint32Array.BYTES_PER_ELEMENT;
        var imageCount = view.getUint32(bytesOffset, true);
        bytesOffset += Uint32Array.BYTES_PER_ELEMENT;
        var texturePackage = {};
        for (var i = 0; i < imageCount; i++) {
            var id = view.getUint32(bytesOffset, true);
            bytesOffset += Uint32Array.BYTES_PER_ELEMENT;
            var width = view.getUint32(bytesOffset, true);
            bytesOffset += Uint32Array.BYTES_PER_ELEMENT;
            var height = view.getUint32(bytesOffset, true);
            bytesOffset += Uint32Array.BYTES_PER_ELEMENT;
            var compressType = view.getUint32(bytesOffset, true);
            bytesOffset += Uint32Array.BYTES_PER_ELEMENT;
            var size = view.getUint32(bytesOffset, true);
            bytesOffset += Uint32Array.BYTES_PER_ELEMENT;
            var pixelFormat = view.getUint32(bytesOffset, true);
            bytesOffset += Uint32Array.BYTES_PER_ELEMENT;
            var imageTypedArray = null;
            if (compressType === S3MCompressType.S3MCompressType.enrS3TCDXTN && supportCompressType !== 1) {
                var pEncode = null;
                if (pixelFormat > S3MCompressType.S3MPixelFormat.BGR || pixelFormat === S3MCompressType.S3MPixelFormat.LUMINANCE_ALPHA) {
                    pEncode = new Uint8Array(unzipBuffer, bytesOffset, width * height);
                    imageTypedArray = new Uint8Array(width * height * 4);
                }
                else {
                    pEncode = new Uint16Array(unzipBuffer, bytesOffset, size / 2);
                    imageTypedArray = new Uint16Array(width * height);
                }
                S3MCompressType.DXTTextureDecode.decode(imageTypedArray, width, height, pEncode, pixelFormat);
                transferableObjects.push(imageTypedArray.buffer);
                compressType = 0;
            }
            else {
                imageTypedArray = new Uint8Array(unzipBuffer, bytesOffset, size);
            }

            texturePackage[id] = {
                id: id,
                width: width,
                height: height,
                compressType: compressType,
                nFormat: pixelFormat,
                imageBuffer: imageTypedArray
            };
            bytesOffset += size;
        }

        return {
            result: true,
            version: version,
            xmlDoc: xmlDoc,
            geoPackage: geoPackage,
            texturePackage: texturePackage,
            volImageBuffer: volImageBuffer,
            volBounds: volBounds
        };
    }

    var S3MTilesParser$1 = createTaskProcessorWorker(S3MTilesParser);

    return S3MTilesParser$1;

});

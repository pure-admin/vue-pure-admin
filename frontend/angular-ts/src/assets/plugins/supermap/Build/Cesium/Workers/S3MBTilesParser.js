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
define(['./when-8d13db60', './Check-70bec281', './Math-61ede240', './Cartographic-fe4be337', './Cartesian2-85064f09', './BoundingSphere-775c5788', './Cartesian4-5af5bb24', './RuntimeError-ba10bc3e', './WebGLConstants-4c11ee5f', './ComponentDatatype-5862616f', './PrimitiveType-97893bc7', './FeatureDetection-7bd32c34', './buildModuleUrl-9d43158d', './IndexDatatype-9435b55f', './createTaskProcessorWorker', './BoundingRectangle-dc808c42', './Color-69f1845f', './pako_inflate-8ea163f9', './S3MCompressType-3a5e0577', './unzip-b0fc9445'], function (when, Check, _Math, Cartographic, Cartesian2, BoundingSphere, Cartesian4, RuntimeError, WebGLConstants, ComponentDatatype, PrimitiveType, FeatureDetection, buildModuleUrl, IndexDatatype, createTaskProcessorWorker, BoundingRectangle, Color, pako_inflate, S3MCompressType, unzip) { 'use strict';

    /**
         * Create a shallow copy of an array from begin to end.
         *
         * @param {Array} array The array to fill.
         * @param {Number} [begin=0] The index to start at.
         * @param {Number} [end=array.length] The index to end at which is not included.
         *
         * @returns {Array} The resulting array.
         * @private
         */
        function arraySlice(array, begin, end) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('array', array);
            if (when.defined(begin)) {
                Check.Check.typeOf.number('begin', begin);
            }
            if (when.defined(end)) {
                Check.Check.typeOf.number('end', end);
            }
            //>>includeEnd('debug');

            if (typeof array.slice === 'function') {
                return array.slice(begin, end);
            }

            var copy = Array.prototype.slice.call(array, begin, end);
            var typedArrayTypes = FeatureDetection.FeatureDetection.typedArrayTypes;
            var length = typedArrayTypes.length;
            for (var i = 0; i < length; ++i) {
                if (array instanceof typedArrayTypes[i]) {
                    copy = new typedArrayTypes[i](copy);
                    break;
                }
            }

            return copy;
        }

    function S3MDracoDecode() {
    }

    var draco;

    function decodeIndexArray(dracoGeometry, dracoDecoder) {
        var numPoints = dracoGeometry.num_points();
        var numFaces = dracoGeometry.num_faces();
        var faceIndices = new draco.DracoInt32Array();
        var numIndices = numFaces * 3;
        var indexArray = IndexDatatype.IndexDatatype.createTypedArray(numPoints, numIndices);

        var offset = 0;
        for (var i = 0; i < numFaces; ++i) {
            dracoDecoder.GetFaceFromMesh(dracoGeometry, i, faceIndices);
            indexArray[offset + 0] = faceIndices.GetValue(0);
            indexArray[offset + 1] = faceIndices.GetValue(1);
            indexArray[offset + 2] = faceIndices.GetValue(2);
            offset += 3;
        }

        var indexDataType = IndexDatatype.IndexDatatype.UNSIGNED_SHORT;
        if (indexArray instanceof Uint32Array) {
            indexDataType = IndexDatatype.IndexDatatype.UNSIGNED_INT;
        }

        draco.destroy(faceIndices);
        return {
            typedArray : indexArray,
            numberOfIndices : numIndices,
            indexDataType : indexDataType
        };
    }


    function decodeQuantizedDracoTypedArray(dracoGeometry, dracoDecoder, dracoAttribute, quantization, vertexArrayLength) {
        var vertexArray;
        var attributeData;
        if (quantization.quantizationBits <= 8) {
            attributeData = new draco.DracoUInt8Array();
            vertexArray = new Uint8Array(vertexArrayLength);
            dracoDecoder.GetAttributeUInt8ForAllPoints(dracoGeometry, dracoAttribute, attributeData);
        } else {
            attributeData = new draco.DracoUInt16Array();
            vertexArray = new Uint16Array(vertexArrayLength);
            dracoDecoder.GetAttributeUInt16ForAllPoints(dracoGeometry, dracoAttribute, attributeData);
        }

        for (var i = 0; i < vertexArrayLength; ++i) {
            vertexArray[i] = attributeData.GetValue(i);
        }

        draco.destroy(attributeData);
        return vertexArray;
    }

    function decodeDracoTypedArray(dracoGeometry, dracoDecoder, dracoAttribute, vertexArrayLength) {
        var vertexArray;
        var attributeData;

        // Some attribute types are casted down to 32 bit since Draco only returns 32 bit values
        switch (dracoAttribute.data_type()) {
            case 1: case 11: // DT_INT8 or DT_BOOL
            attributeData = new draco.DracoInt8Array();
            vertexArray = new Int8Array(vertexArrayLength);
            dracoDecoder.GetAttributeInt8ForAllPoints(dracoGeometry, dracoAttribute, attributeData);
            break;
            case 2: // DT_UINT8
                attributeData = new draco.DracoUInt8Array();
                vertexArray = new Uint8Array(vertexArrayLength);
                dracoDecoder.GetAttributeUInt8ForAllPoints(dracoGeometry, dracoAttribute, attributeData);
                break;
            case 3: // DT_INT16
                attributeData = new draco.DracoInt16Array();
                vertexArray = new Int16Array(vertexArrayLength);
                dracoDecoder.GetAttributeInt16ForAllPoints(dracoGeometry, dracoAttribute, attributeData);
                break;
            case 4: // DT_UINT16
                attributeData = new draco.DracoUInt16Array();
                vertexArray = new Uint16Array(vertexArrayLength);
                dracoDecoder.GetAttributeUInt16ForAllPoints(dracoGeometry, dracoAttribute, attributeData);
                break;
            case 5: case 7: // DT_INT32 or DT_INT64
            attributeData = new draco.DracoInt32Array();
            vertexArray = new Int32Array(vertexArrayLength);
            dracoDecoder.GetAttributeInt32ForAllPoints(dracoGeometry, dracoAttribute, attributeData);
            break;
            case 6: case 8: // DT_UINT32 or DT_UINT64
            attributeData = new draco.DracoUInt32Array();
            vertexArray = new Uint32Array(vertexArrayLength);
            dracoDecoder.GetAttributeUInt32ForAllPoints(dracoGeometry, dracoAttribute, attributeData);
            break;
            case 9: case 10: // DT_FLOAT32 or DT_FLOAT64
            attributeData = new draco.DracoFloat32Array();
            vertexArray = new Float32Array(vertexArrayLength);
            dracoDecoder.GetAttributeFloatForAllPoints(dracoGeometry, dracoAttribute, attributeData);
            break;
        }

        for (var i = 0; i < vertexArrayLength; ++i) {
            vertexArray[i] = attributeData.GetValue(i);
        }

        draco.destroy(attributeData);
        return vertexArray;
    }

    function decodeAttribute(dracoGeometry, dracoDecoder, dracoAttribute) {
        var numPoints = dracoGeometry.num_points();
        var numComponents = dracoAttribute.num_components();

        var quantization;
        var transform = new draco.AttributeQuantizationTransform();
        if (transform.InitFromAttribute(dracoAttribute)) {
            var minValues = new Array(numComponents);
            for (var i = 0; i < numComponents; ++i) {
                minValues[i] = transform.min_value(i);
            }
            quantization = {
                quantizationBits : transform.quantization_bits(),
                minValues : minValues,
                range : transform.range(),
                octEncoded : false
            };
        }
        draco.destroy(transform);

        transform = new draco.AttributeOctahedronTransform();
        if (transform.InitFromAttribute(dracoAttribute)) {
            quantization = {
                quantizationBits : transform.quantization_bits(),
                octEncoded : true
            };
        }
        draco.destroy(transform);

        var vertexArrayLength = numPoints * numComponents;
        var vertexArray;
        if (when.defined(quantization)) {
            vertexArray = decodeQuantizedDracoTypedArray(dracoGeometry, dracoDecoder, dracoAttribute, quantization, vertexArrayLength);
        } else {
            vertexArray = decodeDracoTypedArray(dracoGeometry, dracoDecoder, dracoAttribute, vertexArrayLength);
        }

        var componentDatatype = ComponentDatatype.ComponentDatatype.fromTypedArray(vertexArray);

        return {
            array : vertexArray,
            data : {
                componentsPerAttribute : numComponents,
                componentDatatype : componentDatatype,
                byteOffset : dracoAttribute.byte_offset(),
                byteStride : ComponentDatatype.ComponentDatatype.getSizeInBytes(componentDatatype) * numComponents,
                normalized : dracoAttribute.normalized(),
                quantization : quantization
            }
        };
    }

    function decodeAllAttributes(dracoGeometry, dracoDecoder, vertexPackage, vertexUniqueIDs){
        var attributes = vertexPackage.vertexAttributes;
        var attrLocation = vertexPackage.attrLocation;
        vertexPackage.nCompressOptions = 0;
        if(when.defined(vertexUniqueIDs.posUniqueID) && vertexUniqueIDs.posUniqueID >= 0){
            vertexPackage.nCompressOptions |= S3MCompressType.VertexCompressOption.SVC_Vertex;
            var posAttribute = dracoDecoder.GetAttribute(dracoGeometry, vertexUniqueIDs.posUniqueID);
            var posAttributeData = decodeAttribute(dracoGeometry, dracoDecoder, posAttribute);
            var componentsPerAttribute = posAttributeData.data.componentsPerAttribute;
            vertexPackage.verticesCount = posAttributeData.array.length / componentsPerAttribute;
            vertexPackage.vertCompressConstant = posAttributeData.data.quantization.range / (1 << posAttributeData.data.quantization.quantizationBits);
            var minValuesArray = posAttributeData.data.quantization.minValues;
            vertexPackage.minVerticesValue = new Cartesian4.Cartesian4(minValuesArray[0], minValuesArray[1], minValuesArray[2], 1.0);
            if(componentsPerAttribute > 3){
                vertexPackage.minVerticesValue.w = minValuesArray[3];
            }
            attrLocation['aPosition'] = attributes.length;
            attributes.push({
                index: attrLocation['aPosition'],
                typedArray: posAttributeData.array,
                componentsPerAttribute: componentsPerAttribute,
                componentDatatype: posAttributeData.data.componentDatatype,
                offsetInBytes: posAttributeData.data.byteOffset,
                strideInBytes: posAttributeData.data.byteStride,
                normalize: posAttributeData.data.normalized
            });
        }
        if(when.defined(vertexUniqueIDs.normalUniqueID) && vertexUniqueIDs.normalUniqueID >= 0){
            vertexPackage.nCompressOptions |= S3MCompressType.VertexCompressOption.SVC_Normal;
            var normalAttribute = dracoDecoder.GetAttribute(dracoGeometry, vertexUniqueIDs.normalUniqueID);
            var normalAttributeData = decodeAttribute(dracoGeometry, dracoDecoder, normalAttribute);
            var normalQuantization = normalAttributeData.data.quantization;
            vertexPackage.normalRangeConstant = (1 << normalQuantization.quantizationBits) - 1.0;
            attrLocation['aNormal'] = attributes.length;
            attributes.push({
                index: attrLocation['aNormal'],
                typedArray: normalAttributeData.array,
                componentsPerAttribute: normalAttributeData.data.componentsPerAttribute,
                componentDatatype: normalAttributeData.data.componentDatatype,
                offsetInBytes: normalAttributeData.data.byteOffset,
                strideInBytes: normalAttributeData.data.byteStride,
                normalize: normalAttributeData.data.normalized
            });
        }
        if(when.defined(vertexUniqueIDs.colorUniqueID) && vertexUniqueIDs.colorUniqueID >= 0){
            vertexPackage.nCompressOptions |= S3MCompressType.VertexCompressOption.SVC_VertexColor;
            var colorAttribute = dracoDecoder.GetAttribute(dracoGeometry, vertexUniqueIDs.colorUniqueID);
            var colorAttributeData = decodeAttribute(dracoGeometry, dracoDecoder, colorAttribute);
            attrLocation['aColor'] = attributes.length;
            attributes.push({
                index: attrLocation['aColor'],
                typedArray: colorAttributeData.array,
                componentsPerAttribute: colorAttributeData.data.componentsPerAttribute,
                componentDatatype: colorAttributeData.data.componentDatatype,
                offsetInBytes: colorAttributeData.data.byteOffset,
                strideInBytes: colorAttributeData.data.byteStride,
                normalize: colorAttributeData.data.normalized
            });
        }

        for(var i = 0 ; i < vertexUniqueIDs.texCoordUniqueIDs.length; i++){
            vertexPackage.texCoordCompressConstant = [];
            vertexPackage.minTexCoordValue = [];
            var texCoordUniqueID = vertexUniqueIDs.texCoordUniqueIDs[i];
            if(texCoordUniqueID < 0){
                continue;
            }
            var texCoordAttribute = dracoDecoder.GetAttribute(dracoGeometry, texCoordUniqueID);
            var texAttributeData = decodeAttribute(dracoGeometry, dracoDecoder, texCoordAttribute);
            if(when.defined(texAttributeData.data.quantization)){
                vertexPackage.nCompressOptions |= S3MCompressType.VertexCompressOption.SVC_TexutreCoord;
                vertexPackage.texCoordCompressConstant.push(texAttributeData.data.quantization.range / (1 << texAttributeData.data.quantization.quantizationBits));
                var minValuesArray = texAttributeData.data.quantization.minValues;
                vertexPackage.minTexCoordValue.push(new Cartesian2.Cartesian2(minValuesArray[0], minValuesArray[1]));
            }
            var attName = 'aTexCoord' + i;
            attrLocation[attName] = attributes.length;
            attributes.push({
                index: attrLocation[attName],
                typedArray: texAttributeData.array,
                componentsPerAttribute: texAttributeData.data.componentsPerAttribute,
                componentDatatype: texAttributeData.data.componentDatatype,
                offsetInBytes: texAttributeData.data.byteOffset,
                strideInBytes: texAttributeData.data.byteStride,
                normalize: texAttributeData.data.normalized
            });
        }
    }

    S3MDracoDecode.dracoDecodePointCloud = function(dracoLib, dataBuffer, byteLength, vertexPackage, vertexUniqueIDs){
        draco = dracoLib;
        var dracoDecoder = new draco.Decoder();

        // Skip all parameter types except generic
        var attributesToSkip = ['POSITION', 'NORMAL', 'COLOR'];
        for (var i = 0; i < attributesToSkip.length; ++i) {
            dracoDecoder.SkipAttributeTransform(draco[attributesToSkip[i]]);
        }

        var buffer = new draco.DecoderBuffer();
        buffer.Init(dataBuffer, byteLength);

        var geometryType = dracoDecoder.GetEncodedGeometryType(buffer);
        if (geometryType !== draco.POINT_CLOUD) {
            throw new RuntimeError.RuntimeError('Draco geometry type must be POINT_CLOUD.');
        }

        var dracoPointCloud = new draco.PointCloud();
        var decodingStatus = dracoDecoder.DecodeBufferToPointCloud(buffer, dracoPointCloud);
        if (!decodingStatus.ok() || dracoPointCloud.ptr === 0) {
            throw new RuntimeError.RuntimeError('Error decoding draco point cloud: ' + decodingStatus.error_msg());
        }

        draco.destroy(buffer);

        decodeAllAttributes(dracoPointCloud, dracoDecoder, vertexPackage, vertexUniqueIDs);

        draco.destroy(dracoPointCloud);
        draco.destroy(dracoDecoder);
    };

    S3MDracoDecode.dracoDecodeMesh = function(dracoLib, dataBuffer, byteLength, vertexPackage, indexPackage, vertexUniqueIDs){
        draco = dracoLib;
        var dracoDecoder = new draco.Decoder();

        // Skip all parameter types except generic
        var attributesToSkip = ['POSITION', 'NORMAL', 'COLOR', 'TEX_COORD'];
        for (var i = 0; i < attributesToSkip.length; ++i) {
            dracoDecoder.SkipAttributeTransform(draco[attributesToSkip[i]]);
        }

        var buffer = new draco.DecoderBuffer();
        buffer.Init(dataBuffer, byteLength);

        var geometryType = dracoDecoder.GetEncodedGeometryType(buffer);
        if (geometryType !== draco.TRIANGULAR_MESH) {
            throw new RuntimeError.RuntimeError('Unsupported draco mesh geometry type.');
        }

        var dracoGeometry = new draco.Mesh();
        var decodingStatus = dracoDecoder.DecodeBufferToMesh(buffer, dracoGeometry);
        if (!decodingStatus.ok() || dracoGeometry.ptr === 0) {
            throw new RuntimeError.RuntimeError('Error decoding draco mesh geometry: ' + decodingStatus.error_msg());
        }
        draco.destroy(buffer);

        decodeAllAttributes(dracoGeometry, dracoDecoder, vertexPackage, vertexUniqueIDs);

        var indexArray = decodeIndexArray(dracoGeometry, dracoDecoder);
        indexPackage.indicesTypedArray = indexArray.typedArray;
        indexPackage.indicesCount = indexArray.numberOfIndices;
        indexPackage.indexType = indexArray.indexDataType;
        indexPackage.primitiveType = PrimitiveType.PrimitiveType.TRIANGLES;

        draco.destroy(dracoGeometry);
        draco.destroy(dracoDecoder);
    };

    var VERSION = {
        S3M : 49,
        S3M4 : 1
    };

    var S3MVersion = Object.freeze(VERSION);

    var S3MBVertexOptions = {
        SVO_HasInstSelInfo: 1
    };

    var S3MBVertexTag = {
        SV_Unkown: 0,
        SV_Standard: 1,
        SV_Compressed: 2,
        SV_DracoCompressed: 3
    };

    var dracoLib;
    var colorScratch = new Color.Color();
    var CLAMP_GROUND_LINE_PASS_NAME = "ClampGroundAndObjectLinePass";
    var unzipwasmReady = false;
    if (when.defined(unzip.unzip)) {
        unzip.unzip.onRuntimeInitialized = function () {
            unzipwasmReady = true;
        };
        var unzipwasm = unzip.unzip.cwrap('unzip', 'number', ['number', 'number', 'number', 'number']);
        var freec = unzip.unzip.cwrap('freePointer', null, ['number']);
    }
    function loadStream(dataView, dataBuffer, byteOffset) {
        var newByteOffset = byteOffset;
        var streamSize = dataView.getUint32(newByteOffset, true);
        newByteOffset += Uint32Array.BYTES_PER_ELEMENT;
        var bufferByteOffset = newByteOffset;
            var buffer = new Uint8Array(dataBuffer, newByteOffset, streamSize);
        newByteOffset += streamSize * Uint8Array.BYTES_PER_ELEMENT;
        return {
            dataViewByteOffset: bufferByteOffset,
            byteOffset: newByteOffset,
            buffer: buffer
        };
    }

    function loadString(dataView, viewByteOffset, typedArray, bufferByteOffset) {
        var stringLength = dataView.getUint32(bufferByteOffset + viewByteOffset, true);
        bufferByteOffset += Uint32Array.BYTES_PER_ELEMENT;
        var stringBuffer = typedArray.subarray(bufferByteOffset, bufferByteOffset + stringLength);
        var strResult = S3MCompressType.getStringFromTypedArray(stringBuffer);
        bufferByteOffset += stringLength;
        return {
            string: strResult,
            bytesOffset: bufferByteOffset
        }
    }

    function loadTexCoord(view, typedArray, bufferByteOffset, viewByteOffset, vertexPackage, isOldVersion) {
        var newBytesOffset = bufferByteOffset;
        var nTexCount = view.getUint16(bufferByteOffset + viewByteOffset, true);
        newBytesOffset += Uint16Array.BYTES_PER_ELEMENT;

        if (!isOldVersion) {
            newBytesOffset += Uint16Array.BYTES_PER_ELEMENT;
        }

        for (var i = 0; i < nTexCount; i++) {
            var nTexCoordCount = view.getUint32(newBytesOffset + viewByteOffset, true);
            newBytesOffset += Uint32Array.BYTES_PER_ELEMENT;
            var nDimension = view.getUint16(newBytesOffset + viewByteOffset, true);
            newBytesOffset += Uint16Array.BYTES_PER_ELEMENT;
            var nTexCoordStride = view.getUint16(newBytesOffset + viewByteOffset, true);
            newBytesOffset += Uint16Array.BYTES_PER_ELEMENT;
            if (nDimension == 20 || nDimension == 35) ;
            else {
                var byteLength = nTexCoordCount * nDimension * Float32Array.BYTES_PER_ELEMENT;
                var texCoordBuffer = typedArray.subarray(newBytesOffset, newBytesOffset + byteLength);
                newBytesOffset += byteLength;
                var str = 'aTexCoord' + i;
                var attributes = vertexPackage.vertexAttributes;
                var attrLocation = vertexPackage.attrLocation;
                attrLocation[str] = attributes.length;
                attributes.push({
                    index: attrLocation[str],
                    typedArray: texCoordBuffer,
                    componentsPerAttribute: nDimension,
                    componentDatatype: ComponentDatatype.ComponentDatatype.FLOAT,
                    offsetInBytes: 0,
                    strideInBytes: nDimension * Float32Array.BYTES_PER_ELEMENT,
                    normalize: false
                });
            }
        }
        return {
            bytesOffset: newBytesOffset
        };
    }

    function loadCompressTexCoord(view, typedArray, bufferByteOffset, viewByteOffset, vertexPackage) {
        vertexPackage.texCoordCompressConstant = [];
        vertexPackage.minTexCoordValue = [];
        var newBytesOffset = bufferByteOffset;
        var nTexCount = view.getUint16(bufferByteOffset + viewByteOffset, true);
        newBytesOffset += Uint16Array.BYTES_PER_ELEMENT;
        newBytesOffset += Uint16Array.BYTES_PER_ELEMENT;
        var texIndex = 0;
        for (var i = 0; i < nTexCount; i++) {
            var bNeedTexCoordZ = view.getUint8(newBytesOffset + viewByteOffset, true);
            newBytesOffset += Uint8Array.BYTES_PER_ELEMENT;
            newBytesOffset += Uint8Array.BYTES_PER_ELEMENT * 3;
            var nTexCoordCount = view.getUint32(newBytesOffset + viewByteOffset, true);
            newBytesOffset += Uint32Array.BYTES_PER_ELEMENT;
            var nDimension = view.getUint16(newBytesOffset + viewByteOffset, true);
            newBytesOffset += Uint16Array.BYTES_PER_ELEMENT;
            var nTexCoordStride = view.getUint16(newBytesOffset + viewByteOffset, true);
            newBytesOffset += Uint16Array.BYTES_PER_ELEMENT;

            var texCoordCompressConstant = view.getFloat32(newBytesOffset + viewByteOffset, true);
            newBytesOffset += Float32Array.BYTES_PER_ELEMENT;
            vertexPackage.texCoordCompressConstant.push(texCoordCompressConstant);

            var minTexCoordValue = new Cartesian4.Cartesian4();
            minTexCoordValue.x = view.getFloat32(newBytesOffset + viewByteOffset, true);
            newBytesOffset += Float32Array.BYTES_PER_ELEMENT;
            minTexCoordValue.y = view.getFloat32(newBytesOffset + viewByteOffset, true);
            newBytesOffset += Float32Array.BYTES_PER_ELEMENT;
            minTexCoordValue.z = view.getFloat32(newBytesOffset + viewByteOffset, true);
            newBytesOffset += Float32Array.BYTES_PER_ELEMENT;
            minTexCoordValue.w = view.getFloat32(newBytesOffset + viewByteOffset, true);
            newBytesOffset += Float32Array.BYTES_PER_ELEMENT;
            vertexPackage.minTexCoordValue.push(minTexCoordValue);

            var byteLength = nTexCoordCount * nDimension * Int16Array.BYTES_PER_ELEMENT;
            var texCoordBuffer = typedArray.subarray(newBytesOffset, newBytesOffset + byteLength);
            newBytesOffset += byteLength;
            var align = newBytesOffset % 4;
            if (align !== 0) {
                newBytesOffset += (4 - align);
            }


            var str = 'aTexCoord' + texIndex;
            var attributes = vertexPackage.vertexAttributes;
            var attrLocation = vertexPackage.attrLocation;
            attrLocation[str] = attributes.length;
            attributes.push({
                index: attrLocation[str],
                typedArray: texCoordBuffer,
                componentsPerAttribute: nDimension,
                componentDatatype: ComponentDatatype.ComponentDatatype.SHORT,
                offsetInBytes: 0,
                strideInBytes: nDimension * Int16Array.BYTES_PER_ELEMENT,
                normalize: false
            });

            if (bNeedTexCoordZ) {
                byteLength = nTexCoordCount * Float32Array.BYTES_PER_ELEMENT;
                var texCoordZBuffer = typedArray.subarray(newBytesOffset, newBytesOffset + byteLength);
                newBytesOffset += byteLength;
                vertexPackage.texCoordZMatrix = true;
                str = 'aTexCoordZ' + texIndex;
                attrLocation[str] = attributes.length;
                attributes.push({
                    index: attrLocation[str],
                    typedArray: texCoordZBuffer,
                    componentsPerAttribute: 1,
                    componentDatatype: ComponentDatatype.ComponentDatatype.FLOAT,
                    offsetInBytes: 0,
                    strideInBytes: Float32Array.BYTES_PER_ELEMENT,
                    normalize: false
                });
            }
            texIndex++;
        }
        return {
            bytesOffset: newBytesOffset
        };
    }

    function loadInstanceInfo(view, typedArray, bufferByteOffset, viewByteOffset, vertexPackage) {
        var newBytesOffset = bufferByteOffset;
        var nInstanceInfo = view.getUint16(newBytesOffset + viewByteOffset, true);
        newBytesOffset += Uint16Array.BYTES_PER_ELEMENT;
        newBytesOffset += Uint16Array.BYTES_PER_ELEMENT;
        var attributes = vertexPackage.vertexAttributes;
        var attrLocation = vertexPackage.attrLocation;

        for (var iIndex = 0; iIndex < nInstanceInfo; iIndex++) {
            var nTexCoordCount = view.getUint32(newBytesOffset + viewByteOffset, true);
            newBytesOffset += Uint32Array.BYTES_PER_ELEMENT;
            var nTexDimensions = view.getUint16(newBytesOffset + viewByteOffset, true);
            newBytesOffset += Uint16Array.BYTES_PER_ELEMENT;
            var nTexCoordStride = view.getUint16(newBytesOffset + viewByteOffset, true);
            newBytesOffset += Uint16Array.BYTES_PER_ELEMENT;

            var byteLength = nTexCoordCount * nTexDimensions * Float32Array.BYTES_PER_ELEMENT;
            if (nTexDimensions === 17 || nTexDimensions === 29) {
                var instanceBuffer = typedArray.subarray(newBytesOffset, newBytesOffset + byteLength);
                vertexPackage.instanceCount = nTexCoordCount;
                vertexPackage.instanceMode = nTexDimensions;
                vertexPackage.instanceBuffer = instanceBuffer;
                vertexPackage.instanceIndex = 1;
                var byteStride;
                if (nTexDimensions === 17) {
                    byteStride = Float32Array.BYTES_PER_ELEMENT * 17;
                    attrLocation['uv2'] = attributes.length;
                    attributes.push({
                        index: attrLocation['uv2'],
                        componentsPerAttribute: 4,
                        componentDatatype: ComponentDatatype.ComponentDatatype.FLOAT,
                        normalize: false,
                        offsetInBytes: 0,
                        strideInBytes: byteStride,
                        instanceDivisor: 1
                    });

                    attrLocation['uv3'] = attributes.length;
                    attributes.push({
                        index: attrLocation['uv3'],
                        componentsPerAttribute: 4,
                        componentDatatype: ComponentDatatype.ComponentDatatype.FLOAT,
                        normalize: false,
                        offsetInBytes: 4 * Float32Array.BYTES_PER_ELEMENT,
                        strideInBytes: byteStride,
                        instanceDivisor: 1
                    });

                    attrLocation['uv4'] = attributes.length;
                    attributes.push({
                        index: attrLocation['uv4'],
                        componentsPerAttribute: 4,
                        componentDatatype: ComponentDatatype.ComponentDatatype.FLOAT,
                        normalize: false,
                        offsetInBytes: 8 * Float32Array.BYTES_PER_ELEMENT,
                        strideInBytes: byteStride,
                        instanceDivisor: 1
                    });

                    attrLocation['secondary_colour'] = attributes.length;
                    attributes.push({
                        index: attrLocation['secondary_colour'],
                        componentsPerAttribute: 4,
                        componentDatatype: ComponentDatatype.ComponentDatatype.FLOAT,
                        normalize: false,
                        offsetInBytes: 12 * Float32Array.BYTES_PER_ELEMENT,
                        strideInBytes: byteStride,
                        instanceDivisor: 1
                    });

                    attrLocation['uv6'] = attributes.length;
                    attributes.push({
                        index: attrLocation['uv6'],
                        componentsPerAttribute: 4,
                        componentDatatype: ComponentDatatype.ComponentDatatype.UNSIGNED_BYTE,
                        normalize: true,
                        offsetInBytes: 16 * Float32Array.BYTES_PER_ELEMENT,
                        strideInBytes: byteStride,
                        instanceDivisor: 1
                    });
                }
                else if (nTexDimensions === 29) {
                    byteStride = Float32Array.BYTES_PER_ELEMENT * 29;
                    attrLocation['uv1'] = attributes.length;
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
                    attrLocation['uv2'] = attributes.length;
                    attributes.push({
                        index: attrLocation['uv2'],
                        componentsPerAttribute: 4,
                        componentDatatype: ComponentDatatype.ComponentDatatype.FLOAT,
                        normalize: false,
                        offsetInBytes: 4 * Float32Array.BYTES_PER_ELEMENT,
                        strideInBytes: byteStride,
                        instanceDivisor: 1
                    });
                    attrLocation['uv3'] = attributes.length;
                    attributes.push({
                        index: attrLocation['uv3'],
                        componentsPerAttribute: 4,
                        componentDatatype: ComponentDatatype.ComponentDatatype.FLOAT,
                        normalize: false,
                        offsetInBytes: 8 * Float32Array.BYTES_PER_ELEMENT,
                        strideInBytes: byteStride,
                        instanceDivisor: 1
                    });
                    attrLocation['uv4'] = attributes.length;
                    attributes.push({
                        index: attrLocation['uv4'],
                        componentsPerAttribute: 4,
                        componentDatatype: ComponentDatatype.ComponentDatatype.FLOAT,
                        normalize: false,
                        offsetInBytes: 12 * Float32Array.BYTES_PER_ELEMENT,
                        strideInBytes: byteStride,
                        instanceDivisor: 1
                    });
                    attrLocation['uv5'] = attributes.length;
                    attributes.push({
                        index: attrLocation['uv5'],
                        componentsPerAttribute: 4,
                        componentDatatype: ComponentDatatype.ComponentDatatype.FLOAT,
                        normalize: false,
                        offsetInBytes: 16 * Float32Array.BYTES_PER_ELEMENT,
                        strideInBytes: byteStride,
                        instanceDivisor: 1
                    });
                    attrLocation['uv6'] = attributes.length;
                    attributes.push({
                        index: attrLocation['uv6'],
                        componentsPerAttribute: 4,
                        componentDatatype: ComponentDatatype.ComponentDatatype.FLOAT,
                        normalize: false,
                        offsetInBytes: 20 * Float32Array.BYTES_PER_ELEMENT,
                        strideInBytes: byteStride,
                        instanceDivisor: 1
                    });
                    attrLocation['uv7'] = attributes.length;
                    attributes.push({
                        index: attrLocation['uv7'],
                        componentsPerAttribute: 3,
                        componentDatatype: ComponentDatatype.ComponentDatatype.FLOAT,
                        normalize: false,
                        offsetInBytes: 24 * Float32Array.BYTES_PER_ELEMENT,
                        strideInBytes: byteStride,
                        instanceDivisor: 1
                    });
                    attrLocation['secondary_colour'] = attributes.length;
                    attributes.push({
                        index: attrLocation['secondary_colour'],
                        componentsPerAttribute: 4,
                        componentDatatype: ComponentDatatype.ComponentDatatype.UNSIGNED_BYTE,
                        normalize: true,
                        offsetInBytes: 27 * Float32Array.BYTES_PER_ELEMENT,
                        strideInBytes: byteStride,
                        instanceDivisor: 1
                    });
                    attrLocation['uv9'] = attributes.length;
                    attributes.push({
                        index: attrLocation['uv9'],
                        componentsPerAttribute: 4,
                        componentDatatype: ComponentDatatype.ComponentDatatype.UNSIGNED_BYTE,
                        normalize: true,
                        offsetInBytes: 28 * Float32Array.BYTES_PER_ELEMENT,
                        strideInBytes: byteStride,
                        instanceDivisor: 1
                    });
                }
            }
            else {
                var valueCount = nTexCoordCount * nTexDimensions;
                vertexPackage.instanceBounds = new Float32Array(valueCount);
                for (var k = 0; k < valueCount; k++) {
                    vertexPackage.instanceBounds[k] = view.getFloat32(newBytesOffset + viewByteOffset + k * Float32Array.BYTES_PER_ELEMENT, true);
                }
            }
            newBytesOffset += byteLength;
        }
        return {
            bytesOffset: newBytesOffset
        };
    }

    function loadVertex(typedArray, view, viewByteOffset, bufferByteOffset, vertexPackage) {
        var newBytesOffset = bufferByteOffset;
        var nVerticesCount = view.getUint32(newBytesOffset + viewByteOffset, true);
        vertexPackage.verticesCount = nVerticesCount;
        newBytesOffset += Uint32Array.BYTES_PER_ELEMENT;
        if (nVerticesCount <= 0) {
            return {
                bytesOffset: newBytesOffset
            };
        }
        var nVertexDimension = view.getUint16(newBytesOffset + viewByteOffset, true);
        newBytesOffset += Uint16Array.BYTES_PER_ELEMENT;
        var nVertexStride = view.getUint16(newBytesOffset + viewByteOffset, true);
        nVertexStride = nVertexDimension * Float32Array.BYTES_PER_ELEMENT;
        newBytesOffset += Uint16Array.BYTES_PER_ELEMENT;

        var byteLength = nVerticesCount * nVertexDimension * Float32Array.BYTES_PER_ELEMENT;
        var vertexBuffer = typedArray.subarray(newBytesOffset, newBytesOffset + byteLength);
        newBytesOffset += byteLength;

        var attributes = vertexPackage.vertexAttributes;
        var attrLocation = vertexPackage.attrLocation;
        attrLocation['aPosition'] = attributes.length;
        attributes.push({
            index: attrLocation['aPosition'],
            typedArray: vertexBuffer,
            componentsPerAttribute: nVertexDimension,
            componentDatatype: ComponentDatatype.ComponentDatatype.FLOAT,
            offsetInBytes: 0,
            strideInBytes: nVertexStride,
            normalize: false
        });
        return {
            bytesOffset: newBytesOffset
        }
    }

    function loadCompressVertex(typedArray, view, viewByteOffset, bufferByteOffset, vertexPackage) {
        var newBytesOffset = bufferByteOffset;
        var nVerticesCount = view.getUint32(newBytesOffset + viewByteOffset, true);
        vertexPackage.verticesCount = nVerticesCount;
        newBytesOffset += Uint32Array.BYTES_PER_ELEMENT;
        if (nVerticesCount <= 0) {
            return {
                bytesOffset: newBytesOffset
            };
        }
        var nVertexDimension = view.getUint16(newBytesOffset + viewByteOffset, true);
        newBytesOffset += Uint16Array.BYTES_PER_ELEMENT;
        var nVertexStride = view.getUint16(newBytesOffset + viewByteOffset, true);
        nVertexStride = nVertexDimension * Int16Array.BYTES_PER_ELEMENT;
        newBytesOffset += Uint16Array.BYTES_PER_ELEMENT;

        var fVertCompressConstant = view.getFloat32(newBytesOffset + viewByteOffset, true);
        newBytesOffset += Float32Array.BYTES_PER_ELEMENT;
        var minVerticesValue = new Cartesian4.Cartesian4();
        minVerticesValue.x = view.getFloat32(newBytesOffset + viewByteOffset, true);
        newBytesOffset += Float32Array.BYTES_PER_ELEMENT;
        minVerticesValue.y = view.getFloat32(newBytesOffset + viewByteOffset, true);
        newBytesOffset += Float32Array.BYTES_PER_ELEMENT;
        minVerticesValue.z = view.getFloat32(newBytesOffset + viewByteOffset, true);
        newBytesOffset += Float32Array.BYTES_PER_ELEMENT;
        minVerticesValue.w = view.getFloat32(newBytesOffset + viewByteOffset, true);
        newBytesOffset += Float32Array.BYTES_PER_ELEMENT;

        vertexPackage.vertCompressConstant = fVertCompressConstant;
        vertexPackage.minVerticesValue = minVerticesValue;

        var byteLength = nVerticesCount * nVertexDimension * Int16Array.BYTES_PER_ELEMENT;
        var vertexBuffer = typedArray.subarray(newBytesOffset, newBytesOffset + byteLength);
        newBytesOffset += byteLength;

        var attributes = vertexPackage.vertexAttributes;
        var attrLocation = vertexPackage.attrLocation;
        attrLocation['aPosition'] = attributes.length;
        attributes.push({
            index: attrLocation['aPosition'],
            typedArray: vertexBuffer,
            componentsPerAttribute: nVertexDimension,
            componentDatatype: ComponentDatatype.ComponentDatatype.SHORT,
            offsetInBytes: 0,
            strideInBytes: nVertexStride,
            normalize: false
        });
        return {
            bytesOffset: newBytesOffset
        }
    }

    function loadNormal(typedArray, view, viewByteOffset, bufferByteOffset, vertexPackage) {
        var newBytesOffset = bufferByteOffset;
        var nNormalCount = view.getUint32(newBytesOffset + viewByteOffset, true);
        newBytesOffset += Uint32Array.BYTES_PER_ELEMENT;
        if (nNormalCount <= 0) {
            return {
                bytesOffset: newBytesOffset
            };
        }
        var nNormalDimension = view.getUint16(newBytesOffset + viewByteOffset, true);
        newBytesOffset += Uint16Array.BYTES_PER_ELEMENT;
        var nNormalStride = view.getUint16(newBytesOffset + viewByteOffset, true);
        newBytesOffset += Uint16Array.BYTES_PER_ELEMENT;
        var byteLength = nNormalCount * nNormalDimension * Float32Array.BYTES_PER_ELEMENT;
        var normalBuffer = typedArray.subarray(newBytesOffset, newBytesOffset + byteLength);
        newBytesOffset += byteLength;
        if (!vertexPackage.ignoreNormal) {
            var attributes = vertexPackage.vertexAttributes;
            var attrLocation = vertexPackage.attrLocation;
            attrLocation['aNormal'] = attributes.length;
            attributes.push({
                index: attrLocation['aNormal'],
                typedArray: normalBuffer,
                componentsPerAttribute: nNormalDimension,
                componentDatatype: ComponentDatatype.ComponentDatatype.FLOAT,
                offsetInBytes: 0,
                strideInBytes: nNormalStride,
                normalize: false
            });
        }
        return {
            bytesOffset: newBytesOffset
        }
    }

    function loadCompressNormal(typedArray, view, viewByteOffset, bufferByteOffset, vertexPackage) {
        var newBytesOffset = bufferByteOffset;
        var nNormalCount = view.getUint32(newBytesOffset + viewByteOffset, true);
        newBytesOffset += Uint32Array.BYTES_PER_ELEMENT;
        if (nNormalCount <= 0) {
            return {
                bytesOffset: newBytesOffset
            };
        }
        var nNormalDimension = view.getUint16(newBytesOffset + viewByteOffset, true);
        newBytesOffset += Uint16Array.BYTES_PER_ELEMENT;
        var nNormalStride = view.getUint16(newBytesOffset + viewByteOffset, true);
        newBytesOffset += Uint16Array.BYTES_PER_ELEMENT;
        var byteLength = nNormalCount * 2 * Int16Array.BYTES_PER_ELEMENT;
        var normalBuffer = typedArray.subarray(newBytesOffset, newBytesOffset + byteLength);
        newBytesOffset += byteLength;
        if (!vertexPackage.ignoreNormal) {
            var attributes = vertexPackage.vertexAttributes;
            var attrLocation = vertexPackage.attrLocation;
            attrLocation['aNormal'] = attributes.length;
            attributes.push({
                index: attrLocation['aNormal'],
                typedArray: normalBuffer,
                componentsPerAttribute: 2,
                componentDatatype: ComponentDatatype.ComponentDatatype.SHORT,
                offsetInBytes: 0,
                strideInBytes: nNormalStride,
                normalize: false
            });
        }
        return {
            bytesOffset: newBytesOffset
        }
    }

    function loadVertexColor(typedArray, view, viewByteOffset, bufferByteOffset, vertexPackage) {
        var newBytesOffset = bufferByteOffset;
        var nColorCount = view.getUint32(newBytesOffset + viewByteOffset, true);
        newBytesOffset += Uint32Array.BYTES_PER_ELEMENT;
        var verticesCount = vertexPackage.verticesCount;
        var vertexColor;
        if (nColorCount > 0) {
            var colorStride = view.getUint16(newBytesOffset + viewByteOffset, true);
            newBytesOffset += Uint16Array.BYTES_PER_ELEMENT;
            newBytesOffset += Uint8Array.BYTES_PER_ELEMENT * 2;
            var byteLength = nColorCount * Uint8Array.BYTES_PER_ELEMENT * 4;
            vertexColor = typedArray.slice(newBytesOffset, newBytesOffset + byteLength);
            newBytesOffset += byteLength;
            var attributes = vertexPackage.vertexAttributes;
            var attrLocation = vertexPackage.attrLocation;
            attrLocation['aColor'] = attributes.length;
            attributes.push({
                index: attrLocation['aColor'],
                typedArray: vertexColor,
                componentsPerAttribute: 4,
                componentDatatype: ComponentDatatype.ComponentDatatype.UNSIGNED_BYTE,
                offsetInBytes: 0,
                strideInBytes: 4,
                normalize: true
            });
        }

        return {
            bytesOffset: newBytesOffset
        };
    }

    function loadSecondColor(typedArray, view, viewByteOffset, bufferByteOffset, vertexPackage) {
        var newBytesOffset = bufferByteOffset;
        var nSecondColorCount = view.getUint32(newBytesOffset + viewByteOffset, true);
        newBytesOffset += Uint32Array.BYTES_PER_ELEMENT;
        if (nSecondColorCount <= 0) {
            return {
                bytesOffset: newBytesOffset
            };
        }
        var secondColorStride = view.getUint16(newBytesOffset + viewByteOffset, true);
        newBytesOffset += Uint16Array.BYTES_PER_ELEMENT;
        newBytesOffset += Uint8Array.BYTES_PER_ELEMENT * 2;
        var byteLength = nSecondColorCount * Uint8Array.BYTES_PER_ELEMENT * 4;
        newBytesOffset += byteLength;
        return {
            bytesOffset: newBytesOffset
        };
    }

    function loadIndexPackage(typedArray, view, viewByteOffset, bufferByteOffset) {
        var newBytesOffset = bufferByteOffset;
        var arrIndexPackage = [];
        var nIndexPackageCount = view.getUint32(newBytesOffset + viewByteOffset, true);
        newBytesOffset += Uint32Array.BYTES_PER_ELEMENT;
        for (var k = 0; k < nIndexPackageCount; k++) {
            var indexPackage = {};
            var nIndexCount = view.getUint32(newBytesOffset + viewByteOffset, true);
            newBytesOffset += Uint32Array.BYTES_PER_ELEMENT;
            var enIndexType = view.getUint8(newBytesOffset + viewByteOffset, true);
            newBytesOffset += Uint8Array.BYTES_PER_ELEMENT;
            var bUseIndex = view.getUint8(newBytesOffset + viewByteOffset, true);
            newBytesOffset += Uint8Array.BYTES_PER_ELEMENT;
            var operationType = view.getUint8(newBytesOffset + viewByteOffset, true);
            newBytesOffset += Uint8Array.BYTES_PER_ELEMENT;
            newBytesOffset += Uint8Array.BYTES_PER_ELEMENT;
            if (nIndexCount > 0) {
                var byteLength = 0;
                var indexBuffer = null;
                if (enIndexType === 1 || enIndexType === 3) {
                    byteLength = nIndexCount * Uint32Array.BYTES_PER_ELEMENT;
                    indexBuffer = typedArray.subarray(newBytesOffset, newBytesOffset + byteLength);
                }
                else {
                    byteLength = nIndexCount * Uint16Array.BYTES_PER_ELEMENT;
                    indexBuffer = typedArray.subarray(newBytesOffset, newBytesOffset + byteLength);
                    if (nIndexCount % 2 != 0) {
                        byteLength += 2;
                    }
                }
                indexPackage.indicesTypedArray = indexBuffer;
                newBytesOffset += byteLength;
            }
            indexPackage.indicesCount = nIndexCount;
            indexPackage.indexType = enIndexType;
            indexPackage.primitiveType = operationType;

            var arrPassName = [];
            var nPassNameCount = view.getUint32(newBytesOffset + viewByteOffset, true);
            newBytesOffset += Uint32Array.BYTES_PER_ELEMENT;
            for (var passIndex = 0; passIndex < nPassNameCount; passIndex++) {
                var res = loadString(view, viewByteOffset, typedArray, newBytesOffset);
                var strPassName = res.string;
                newBytesOffset = res.bytesOffset;
                arrPassName.push(strPassName);
                indexPackage.materialCode = strPassName;
            }
            arrIndexPackage.push(indexPackage);

            var align = newBytesOffset % 4;
            if (align !== 0) {
                var nReserved = 4 - newBytesOffset % 4;
                newBytesOffset += nReserved;
            }
        }
        return {
            bytesOffset: newBytesOffset,
            arrIndexPackage: arrIndexPackage
        };
    }

    function loadCompressSkeleton(typedArray, view, viewByteOffset, bufferByteOffset, vertexPackage, isOldVersion) {
        var newBytesOffset = bufferByteOffset;
        var nCompressOptions = view.getUint32(newBytesOffset + viewByteOffset, true);
        vertexPackage.nCompressOptions = nCompressOptions;
        var result;
        newBytesOffset += Uint32Array.BYTES_PER_ELEMENT;
        if ((nCompressOptions & S3MCompressType.VertexCompressOption.SVC_Vertex) == S3MCompressType.VertexCompressOption.SVC_Vertex) {
            result = loadCompressVertex(typedArray, view, viewByteOffset, newBytesOffset, vertexPackage);
            newBytesOffset = result.bytesOffset;
        }
        else {
            result = loadVertex(typedArray, view, viewByteOffset, newBytesOffset, vertexPackage);
            newBytesOffset = result.bytesOffset;
        }

        if ((nCompressOptions & S3MCompressType.VertexCompressOption.SVC_Normal) == S3MCompressType.VertexCompressOption.SVC_Normal) {
            result = loadCompressNormal(typedArray, view, viewByteOffset, newBytesOffset, vertexPackage);
            newBytesOffset = result.bytesOffset;
        }
        else {
            result = loadNormal(typedArray, view, viewByteOffset, newBytesOffset, vertexPackage);
            newBytesOffset = result.bytesOffset;
        }

        result = loadVertexColor(typedArray, view, viewByteOffset, newBytesOffset, vertexPackage);
        newBytesOffset = result.bytesOffset;

        result = loadSecondColor(typedArray, view, viewByteOffset, newBytesOffset);
        newBytesOffset = result.bytesOffset;

        if ((nCompressOptions & S3MCompressType.VertexCompressOption.SVC_TexutreCoord) == S3MCompressType.VertexCompressOption.SVC_TexutreCoord) {
            result = loadCompressTexCoord(view, typedArray, newBytesOffset, viewByteOffset, vertexPackage);
            newBytesOffset = result.bytesOffset;
        }
        else {
            result = loadTexCoord(view, typedArray, newBytesOffset, viewByteOffset, vertexPackage, isOldVersion);
            newBytesOffset = result.bytesOffset;
        }

        if ((nCompressOptions & S3MCompressType.VertexCompressOption.SVC_TexutreCoordIsW) == S3MCompressType.VertexCompressOption.SVC_TexutreCoordIsW) {
            vertexPackage.textureCoordIsW = true;
        }

        result = loadInstanceInfo(view, typedArray, newBytesOffset, viewByteOffset, vertexPackage);
        newBytesOffset = result.bytesOffset;

        return {
            bytesOffset: newBytesOffset
        }
    }

    function loadStandardSkeleton(typedArray, view, viewByteOffset, bufferByteOffset, vertexPackage, isOldVersion) {
        var newBytesOffset = bufferByteOffset;
        var result;
        result = loadVertex(typedArray, view, viewByteOffset, newBytesOffset, vertexPackage);
        newBytesOffset = result.bytesOffset;

        result = loadNormal(typedArray, view, viewByteOffset, newBytesOffset, vertexPackage);
        newBytesOffset = result.bytesOffset;

        result = loadVertexColor(typedArray, view, viewByteOffset, newBytesOffset, vertexPackage);
        newBytesOffset = result.bytesOffset;

        result = loadSecondColor(typedArray, view, viewByteOffset, newBytesOffset);
        newBytesOffset = result.bytesOffset;

        result = loadTexCoord(view, typedArray, newBytesOffset, viewByteOffset, vertexPackage, isOldVersion);
        newBytesOffset = result.bytesOffset;

        result = loadInstanceInfo(view, typedArray, newBytesOffset, viewByteOffset, vertexPackage);
        newBytesOffset = result.bytesOffset;

        return {
            bytesOffset: newBytesOffset
        }
    }

    function isClampGroundLinePass(arrIndexPackage) {
        if (arrIndexPackage.length === 0) {
            return false;
        }
        return arrIndexPackage[0].materialCode === CLAMP_GROUND_LINE_PASS_NAME;
    }

    function loadSkeletonEntities(skeletonBuffer, view, viewByteOffset, needCreateEdge, geoPackage, isOldVersion) {
        var typedArray = skeletonBuffer;
        var bufferByteOffset = 0;
        var nCount = view.getUint32(bufferByteOffset + viewByteOffset, true);
        bufferByteOffset += Uint32Array.BYTES_PER_ELEMENT;
        for (var i = 0; i < nCount; i++) {
            // S3MB头名字长度
            var result = loadString(view, viewByteOffset, typedArray, bufferByteOffset);
            var strGeometryName = result.string;
            bufferByteOffset = result.bytesOffset;
            var align = bufferByteOffset % 4;
            if (align !== 0) {
                bufferByteOffset += (4 - align);
            }

            var nTagValue = S3MBVertexTag.SV_Unkown;
            nTagValue = view.getUint32(bufferByteOffset + viewByteOffset, true);
            bufferByteOffset += Int32Array.BYTES_PER_ELEMENT;

            var vertexPackage = {};
            vertexPackage.vertexAttributes = [];
            vertexPackage.attrLocation = {};
            vertexPackage.instanceCount = 0;
            vertexPackage.instanceMode = 0;
            vertexPackage.instanceIndex = -1;
            vertexPackage.ignoreNormal = geoPackage.ignoreNormal;

            if (nTagValue == S3MBVertexTag.SV_DracoCompressed) {
                var vertexUniqueIDs = {};
                vertexUniqueIDs.posUniqueID = view.getInt32(bufferByteOffset + viewByteOffset, true);
                bufferByteOffset += Int32Array.BYTES_PER_ELEMENT;
                vertexUniqueIDs.normalUniqueID = view.getInt32(bufferByteOffset + viewByteOffset, true);
                bufferByteOffset += Int32Array.BYTES_PER_ELEMENT;
                vertexUniqueIDs.colorUniqueID = view.getInt32(bufferByteOffset + viewByteOffset, true);
                bufferByteOffset += Int32Array.BYTES_PER_ELEMENT;
                vertexUniqueIDs.secondColorUniqueID = view.getInt32(bufferByteOffset + viewByteOffset, true);
                bufferByteOffset += Int32Array.BYTES_PER_ELEMENT;

                var nTextureCoord = view.getUint16(bufferByteOffset + viewByteOffset, true);
                bufferByteOffset += Int16Array.BYTES_PER_ELEMENT;

                var texCoordUniqueIDs = [];
                for (var nTexCoordIdx = 0; nTexCoordIdx < nTextureCoord; nTexCoordIdx++) {
                    var nTexCoordUniqueID = view.getInt32(bufferByteOffset + viewByteOffset, true);
                    texCoordUniqueIDs.push(nTexCoordUniqueID);
                    bufferByteOffset += Int32Array.BYTES_PER_ELEMENT;
                }
                vertexUniqueIDs.texCoordUniqueIDs = texCoordUniqueIDs;

                var nIndexPackageCount = view.getInt32(bufferByteOffset + viewByteOffset, true);
                bufferByteOffset += Int32Array.BYTES_PER_ELEMENT;
                var arrIndexPackage = [];
                // 目前只支持单索引
                var indexPackage = {};
                if (nIndexPackageCount > 0) {
                    var res = loadString(view, viewByteOffset, typedArray, bufferByteOffset);
                    var strPassName = res.string;
                    bufferByteOffset = res.bytesOffset;
                    indexPackage.materialCode = strPassName;
                    arrIndexPackage.push(indexPackage);
                }

                var nDracoBufferSize = view.getUint32(bufferByteOffset + viewByteOffset, true);
                bufferByteOffset += Int32Array.BYTES_PER_ELEMENT;
                var dataBuffer = arraySlice(typedArray, bufferByteOffset, bufferByteOffset + nDracoBufferSize);
                if (nIndexPackageCount > 0) {
                    S3MDracoDecode.dracoDecodeMesh(dracoLib, dataBuffer, nDracoBufferSize, vertexPackage, indexPackage, vertexUniqueIDs);
                }
                else {
                    S3MDracoDecode.dracoDecodePointCloud(dracoLib, dataBuffer, nDracoBufferSize, vertexPackage, vertexUniqueIDs);
                }

                bufferByteOffset += nDracoBufferSize;
                geoPackage[strGeometryName] = {
                    vertexPackage: vertexPackage,
                    arrIndexPackage: arrIndexPackage
                };
            }
            else {
                if (nTagValue == S3MBVertexTag.SV_Standard) {
                    result = loadStandardSkeleton(typedArray, view, viewByteOffset, bufferByteOffset, vertexPackage, isOldVersion);
                    bufferByteOffset = result.bytesOffset;
                }
                else if (nTagValue == S3MBVertexTag.SV_Compressed) {
                    result = loadCompressSkeleton(typedArray, view, viewByteOffset, bufferByteOffset, vertexPackage, isOldVersion);
                    bufferByteOffset = result.bytesOffset;
                }

                result = loadIndexPackage(typedArray, view, viewByteOffset, bufferByteOffset);
                var arrIndexPackage = result.arrIndexPackage;
                if (isClampGroundLinePass(arrIndexPackage)) {
                    vertexPackage.clampRegionEdge = true;
                }

                var edgeGeometry;
                if (needCreateEdge) {
                    edgeGeometry = S3MCompressType.S3MVertexPackage.createEdge(vertexPackage, arrIndexPackage);
                }

                bufferByteOffset = result.bytesOffset;
                geoPackage[strGeometryName] = {
                    vertexPackage: vertexPackage,
                    arrIndexPackage: arrIndexPackage,
                    edgeGeometry: edgeGeometry
                };
            }
        }
    }

    function loadGeodeEntities(shellBuffer, view, bufferByteOffset, dataViewByteOffset) {
        var geode = {};
        var skeletonNames = [];
        var geoMatrix = new BoundingSphere.Matrix4();
        var typedArray = shellBuffer;
        for (var matIndex = 0; matIndex < 16; matIndex++) {
            geoMatrix[matIndex] = view.getFloat64(bufferByteOffset + dataViewByteOffset, true);
            bufferByteOffset += Float64Array.BYTES_PER_ELEMENT;
        }
        geode.matrix = geoMatrix;
        geode.skeletonNames = skeletonNames;
        var nSkeletonCount = view.getUint32(bufferByteOffset + dataViewByteOffset, true);
        bufferByteOffset += Uint32Array.BYTES_PER_ELEMENT;
        for (var i = 0; i < nSkeletonCount; i++) {
            var res = loadString(view, dataViewByteOffset, typedArray, bufferByteOffset);
            var strSkeletonName = res.string;
            bufferByteOffset = res.bytesOffset;
            skeletonNames.push(strSkeletonName);
        }
        return {
            byteOffset: bufferByteOffset,
            geode: geode
        }
    }

    function removeUnusedStringTileName(oldTileName) {
        var index = oldTileName.indexOf('Geometry');
        if (index === -1) {
            return oldTileName;
        }
        var ignoreString = oldTileName.substring(index, oldTileName.length);
        return oldTileName.replace(ignoreString, '');
    }

    function loadPageLODEntities(shellBuffer, view, bufferByteOffset, dataViewByteOffset) {
        var pageLOD = {};
        var dbDis = view.getFloat32(bufferByteOffset + dataViewByteOffset, true);
        bufferByteOffset += Float32Array.BYTES_PER_ELEMENT;
        var uRangeMode = view.getUint16(bufferByteOffset + dataViewByteOffset, true);
        bufferByteOffset += Uint16Array.BYTES_PER_ELEMENT;
        pageLOD.rangeMode = uRangeMode;
        pageLOD.rangeList = dbDis;

        var boundingSphereCenter = new Cartographic.Cartesian3();
        boundingSphereCenter.x = view.getFloat64(bufferByteOffset + dataViewByteOffset, true);
        bufferByteOffset += Float64Array.BYTES_PER_ELEMENT;
        boundingSphereCenter.y = view.getFloat64(bufferByteOffset + dataViewByteOffset, true);
        bufferByteOffset += Float64Array.BYTES_PER_ELEMENT;
        boundingSphereCenter.z = view.getFloat64(bufferByteOffset + dataViewByteOffset, true);
        bufferByteOffset += Float64Array.BYTES_PER_ELEMENT;
        var radius = view.getFloat64(bufferByteOffset + dataViewByteOffset, true);
        bufferByteOffset += Float64Array.BYTES_PER_ELEMENT;
        pageLOD.boundingSphere = new BoundingSphere.BoundingSphere(boundingSphereCenter, radius);

        var typedArray = shellBuffer;
        var res = loadString(view, dataViewByteOffset, typedArray, bufferByteOffset);
        var strChildTile = res.string;
        bufferByteOffset = res.bytesOffset;

        strChildTile = strChildTile.replace(/(\.s3mbz)|(\.s3mb)/gi, '');
        strChildTile = removeUnusedStringTileName(strChildTile);

        pageLOD.childTile = strChildTile;
        pageLOD.geodes = [];
        var nGeodeCount = view.getUint32(bufferByteOffset + dataViewByteOffset, true);
        bufferByteOffset += Uint32Array.BYTES_PER_ELEMENT;
        for (var i = 0; i < nGeodeCount; i++) {
            var res = loadGeodeEntities(shellBuffer, view, bufferByteOffset, dataViewByteOffset);
            bufferByteOffset = res.byteOffset;
            pageLOD.geodes.push(res.geode);
        }
        return {
            pageLOD: pageLOD,
            bytesOffset: bufferByteOffset
        }
    }

    function loadShellEntites(shellBuffer, view, dataViewByteOffset) {
        var bufferByteOffset = 0;
        var groupNode = {};
        var pageLods = [];
        var nCount = view.getUint32(bufferByteOffset + dataViewByteOffset, true);
        bufferByteOffset += Uint32Array.BYTES_PER_ELEMENT;
        for (var i = 0; i < nCount; i++) {
            var res = loadPageLODEntities(shellBuffer, view, bufferByteOffset, dataViewByteOffset);
            bufferByteOffset = res.bytesOffset;
            pageLods.push(res.pageLOD);
        }
        groupNode.pageLods = pageLods;
        return groupNode;
    }

    function loadTextureEntities(supportCompressType, textureDataBuffer, dataView, dataViewByteOffset, texturePackage, transferableObjects) {
        var bufferByteOffset = 0;
        var nTextureCount = dataView.getUint32(bufferByteOffset + dataViewByteOffset, true);
        bufferByteOffset += Uint32Array.BYTES_PER_ELEMENT;
        for (var i = 0; i < nTextureCount; i++) {
            var res = loadString(dataView, dataViewByteOffset, textureDataBuffer, bufferByteOffset);
            var strTextureName = res.string;
            bufferByteOffset = res.bytesOffset;
            var align = bufferByteOffset % 4;
            if (align !== 0) {
                bufferByteOffset += (4 - align);
            }

            var nLevel = dataView.getUint32(bufferByteOffset + dataViewByteOffset, true);
            bufferByteOffset += Uint32Array.BYTES_PER_ELEMENT;
            var width = dataView.getUint32(bufferByteOffset + dataViewByteOffset, true);
            bufferByteOffset += Uint32Array.BYTES_PER_ELEMENT;
            var height = dataView.getUint32(bufferByteOffset + dataViewByteOffset, true);
            bufferByteOffset += Uint32Array.BYTES_PER_ELEMENT;
            var compressType = dataView.getUint32(bufferByteOffset + dataViewByteOffset, true);
            bufferByteOffset += Uint32Array.BYTES_PER_ELEMENT;
            var nSize = dataView.getUint32(bufferByteOffset + dataViewByteOffset, true);
            bufferByteOffset += Uint32Array.BYTES_PER_ELEMENT;
            var pixelFormat = dataView.getUint32(bufferByteOffset + dataViewByteOffset, true);
            bufferByteOffset += Uint32Array.BYTES_PER_ELEMENT;

            var textureData = textureDataBuffer.subarray(bufferByteOffset, bufferByteOffset + nSize);
            bufferByteOffset += nSize;

            var imageTypedArray = null;
            if (compressType === S3MCompressType.S3MCompressType.enrS3TCDXTN && supportCompressType != 1) {
                S3MCompressType.DXTTextureDecode.decode(imageTypedArray, width, height, textureData, pixelFormat);
                if (pixelFormat > S3MCompressType.S3MPixelFormat.BGR || pixelFormat === S3MCompressType.S3MPixelFormat.LUMINANCE_ALPHA) {
                    imageTypedArray = new Uint8Array(width * height * 4);
                }
                else {
                    imageTypedArray = new Uint16Array(width * height);
                }
                S3MCompressType.DXTTextureDecode.decode(imageTypedArray, width, height, textureData, pixelFormat);
                transferableObjects.push(imageTypedArray.buffer);
                compressType = 0;
            }
            else {
                imageTypedArray = textureData;
            }

            texturePackage[strTextureName] = {
                id: strTextureName,
                width: width,
                height: height,
                compressType: compressType,
                nFormat: pixelFormat,
                imageBuffer: imageTypedArray
            };
        }
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
            instanceDivisor: instanceDivisor
        });
    }

    var LEFT_16 = 65536;
    function loadSelectionInfo(selectionInfoBuffer, view, dataViewByteOffset, geoPackage) {
        var bufferByteOffset = 0;
        var typedArray = selectionInfoBuffer;
        var nGeometryCount = view.getUint32(bufferByteOffset + dataViewByteOffset, true);
        bufferByteOffset += Uint32Array.BYTES_PER_ELEMENT;
        for (var i = 0; i < nGeometryCount; i++) {
            // S3MB头名字长度
            var result = loadString(view, dataViewByteOffset, typedArray, bufferByteOffset);
            var strGeometryName = result.string;
            bufferByteOffset = result.bytesOffset;
            var nSelectInfoCount = view.getUint32(bufferByteOffset + dataViewByteOffset, true);
            bufferByteOffset += Uint32Array.BYTES_PER_ELEMENT;
            var pickInfo = {};
            geoPackage[strGeometryName].pickInfo = pickInfo;
            // 非实例化的选择信息
            var bInstanced = geoPackage[strGeometryName].vertexPackage.instanceIndex;
            if (bInstanced == -1) {
                var batchIds = new Float32Array(geoPackage[strGeometryName].vertexPackage.verticesCount);
                for (var j = 0; j < nSelectInfoCount; j++) {
                    var nDictID = view.getUint32(bufferByteOffset + dataViewByteOffset, true);
                    bufferByteOffset += Uint32Array.BYTES_PER_ELEMENT;
                    var nSize = view.getUint32(bufferByteOffset + dataViewByteOffset, true);
                    bufferByteOffset += Uint32Array.BYTES_PER_ELEMENT;
                    var vertexCount = 0, vertexColorOffset = 0;
                    pickInfo[nDictID] = {
                        batchId: j
                    };
                    for (var k = 0; k < nSize; k++) {
                        vertexColorOffset = view.getUint32(bufferByteOffset + dataViewByteOffset, true);
                        bufferByteOffset += Uint32Array.BYTES_PER_ELEMENT;
                        vertexCount = view.getUint32(bufferByteOffset + dataViewByteOffset, true);
                        bufferByteOffset += Uint32Array.BYTES_PER_ELEMENT;
                        batchIds.fill(j, vertexColorOffset, vertexColorOffset + vertexCount);
                    }

                    pickInfo[nDictID].vertexColorOffset = vertexColorOffset;
                    pickInfo[nDictID].vertexCount = vertexCount;
                }
                createBatchIdAttribute(geoPackage[strGeometryName].vertexPackage, batchIds, undefined);
            }
            else {
                var instanceCount = geoPackage[strGeometryName].vertexPackage.instanceCount;
                var instanceArray = geoPackage[strGeometryName].vertexPackage.instanceBuffer;
                var instanceMode = geoPackage[strGeometryName].vertexPackage.instanceMode;
                var instanceIds = new Float32Array(instanceCount);
                for (var j = 0; j < nSelectInfoCount; j++) {
                    var nDictID = view.getUint32(bufferByteOffset + dataViewByteOffset, true);
                    bufferByteOffset += Uint32Array.BYTES_PER_ELEMENT;
                    var nSize = view.getUint32(bufferByteOffset + dataViewByteOffset, true);
                    bufferByteOffset += Uint32Array.BYTES_PER_ELEMENT;
                    for (var k = 0; k < nSize; k++) {
                        var instanceId = view.getUint32(bufferByteOffset + dataViewByteOffset, true);
                        bufferByteOffset += Uint32Array.BYTES_PER_ELEMENT;
                    }
                }

                var beginOffset = instanceMode === 17 ? 16 : 28;
                beginOffset *= Float32Array.BYTES_PER_ELEMENT;
                for (j = 0; j < instanceCount; j++) {
                    instanceIds[j] = j;
                    var offset = j * instanceMode * Float32Array.BYTES_PER_ELEMENT + beginOffset;
                    Color.Color.unpack(instanceArray, offset, colorScratch);
                    var pickId = colorScratch.red + colorScratch.green * 256 + colorScratch.blue * LEFT_16;
                    if (pickInfo[pickId] === undefined) {
                        pickInfo[pickId] = {
                            vertexColorCount: 1,
                            instanceIds: [],
                            vertexColorOffset: j
                        };
                    }

                    pickInfo[pickId].instanceIds.push(j);
                }

                createBatchIdAttribute(geoPackage[strGeometryName].vertexPackage, instanceIds, 1);
            }
        }
    }

    function OGDCIS0(x) {
        return (((x) < 1e-10) && ((x) > -1e-10));
    }

    function unzipWithwasm(datazip, unzipSize) {
        var unzipsize = unzipSize || datazip.length * 4;//unzipSize;//
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
        var buffer = new Uint8Array(res).buffer;
        freec(offset);
        freec(offset1);
        return buffer;
    }

    function parseS3MB(parameters, transferableObjects) {
        var buffer = parameters.buffer;
        var bZip = parameters.isS3MZ;
        var fileType = parameters.fileType;
        var createEdge = parameters.createEdge;
        var supportCompressType = parameters.supportCompressType;
        var bytesOffset = 0;
        var geoPackage = {};
        geoPackage.ignoreNormal = parameters.ignoreNormal;

        var view = new DataView(buffer);

        var version = view.getFloat32(bytesOffset, true);
        bytesOffset += Float32Array.BYTES_PER_ELEMENT;
        var isOldVersion = false;
        var unzipSize;
        if (version === 2) {
            unzipSize = view.getUint32(bytesOffset, true);
            bytesOffset += Uint32Array.BYTES_PER_ELEMENT;
        }
        if (OGDCIS0(version - 1) || OGDCIS0(version - 2)) {
            //总字节大小
            var byteSize = view.getUint32(bytesOffset, true);
            bytesOffset += Uint32Array.BYTES_PER_ELEMENT;
            var datazip = new Uint8Array(buffer, bytesOffset, byteSize);

            if (unzipwasmReady === true) {
                buffer = unzipWithwasm(datazip, unzipSize);
            } else {
                buffer = pako_inflate.pako.inflate(datazip).buffer;
            }

            transferableObjects.push(buffer);
            view = new DataView(buffer);
            bytesOffset = 0;
        }
        // 不zip压缩的解析性能，测试用
        else if (version > 1.199 && version < 1.201) {
            var byteSize = view.getUint32(bytesOffset, true);
            bytesOffset += Uint32Array.BYTES_PER_ELEMENT;
            transferableObjects.push(buffer);
        }
        else {
            //老版本的s3mb缓存,解析方式跟UGC保持一致
            isOldVersion = true;
            bytesOffset = 0;
            var byteSize = view.getInt32(bytesOffset, true);
            bytesOffset += Int32Array.BYTES_PER_ELEMENT;
            bytesOffset += Uint8Array.BYTES_PER_ELEMENT * byteSize;

            if (bZip) {
                var zipSize = view.getUint32(bytesOffset, true);
                bytesOffset += Uint32Array.BYTES_PER_ELEMENT;
                var dataZip = new Uint8Array(buffer, bytesOffset);
                buffer = pako_inflate.pako.inflate(dataZip).buffer;
                transferableObjects.push(buffer);
                view = new DataView(buffer);
                bytesOffset = 0;
            }
        }

        var nOptions = view.getUint32(bytesOffset, true);
        bytesOffset += Uint32Array.BYTES_PER_ELEMENT;

        // load Shell
        var loadStreamResult = loadStream(view, buffer, bytesOffset);
        var shellBuffer = loadStreamResult.buffer;
        bytesOffset = loadStreamResult.byteOffset;
        var groupNode = loadShellEntites(shellBuffer, view, loadStreamResult.dataViewByteOffset);
        var align = bytesOffset % 4;
        if (align !== 0) {
            bytesOffset += (4 - align);
        }

        // load skeleton
        loadStreamResult = loadStream(view, buffer, bytesOffset);
        var skeletonBuffer = loadStreamResult.buffer;
        loadSkeletonEntities(skeletonBuffer, view, loadStreamResult.dataViewByteOffset, createEdge, geoPackage, isOldVersion);
        bytesOffset = loadStreamResult.byteOffset;

        // load secondColor
        loadStreamResult = loadStream(view, buffer, bytesOffset);
        var secondColorBuffer = loadStreamResult.buffer;
        bytesOffset = loadStreamResult.byteOffset;

        // load textureData
        loadStreamResult = loadStream(view, buffer, bytesOffset);
        var textureDataBuffer = loadStreamResult.buffer;
        var texturePackage = {};
        loadTextureEntities(supportCompressType, textureDataBuffer, view, loadStreamResult.dataViewByteOffset, texturePackage, transferableObjects);
        bytesOffset = loadStreamResult.byteOffset;

        var strJsonMaterialsLength = view.getUint32(bytesOffset, true);
        bytesOffset += Uint32Array.BYTES_PER_ELEMENT;
        var typedArray = new Uint8Array(buffer);
        var materialBuffer = typedArray.subarray(bytesOffset, bytesOffset + strJsonMaterialsLength);
        var strJsonMaterials = S3MCompressType.getStringFromTypedArray(materialBuffer);
        bytesOffset += strJsonMaterialsLength;
        var matrialObj = JSON.parse(strJsonMaterials);

        var bHasSelectionInfo = (nOptions & S3MBVertexOptions.SVO_HasInstSelInfo) == S3MBVertexOptions.SVO_HasInstSelInfo;
        if (bHasSelectionInfo) {
            loadStreamResult = loadStream(view, buffer, bytesOffset);
            var selectionInfoBuffer = loadStreamResult.buffer;
            loadSelectionInfo(selectionInfoBuffer, view, loadStreamResult.dataViewByteOffset, geoPackage);
        }


        var pagelodList = groupNode.pageLods;
        var isLeafNode = true;
        for (var i = 0; i < pagelodList.length; i++) {
            var pagelodNode = pagelodList[i];
            isLeafNode = pagelodNode.childTile === '';

            var geodeList = pagelodNode.geodes;
            for (var m = 0; m < geodeList.length; m++) {
                var geodeNode = geodeList[m];
                var skeletonNames = geodeNode.skeletonNames;
                for (var n = 0; n < skeletonNames.length; n++) {
                    var geoName = skeletonNames[n];
                    if (isLeafNode) {
                        var geo = geoPackage[geoName];
                        var vertexPackage = geo.vertexPackage;
                        vertexPackage.boundingSphere = S3MCompressType.S3MVertexPackage.calcBoundingSphereInWorker(fileType, vertexPackage);
                    }
                }
            }
        }

        return {
            result: true,
            groupNode: groupNode,
            geoPackage: geoPackage,
            matrials: matrialObj,
            texturePackage: texturePackage,
            version: S3MVersion.S3M4
        };
    }

    function initWorker(dracoModule) {
        dracoLib = dracoModule;
        self.onmessage = createTaskProcessorWorker(parseS3MB);
        self.postMessage(true);
    }

    function S3MBTilesParser(event) {
        var data = event.data;

        // Expect the first message to be to load a web assembly module
        var wasmConfig = data.webAssemblyConfig;
        if (when.defined(wasmConfig)) {
            if (FeatureDetection.FeatureDetection.isInternetExplorer()) {
                return require([buildModuleUrl.buildModuleUrl('ThirdParty/Workers/ie-webworker-promise-polyfill.js')], function (e) {
                    self.Promise = e;
                    return require([wasmConfig.modulePath], function (dracoModule) {
                        if (when.defined(wasmConfig.wasmBinaryFile)) {
                            if (!when.defined(dracoModule)) {
                                dracoModule = self.DracoDecoderModule;
                            }

                            dracoModule(wasmConfig).then(function (compiledModule) {
                                initWorker(compiledModule);
                            });
                        } else {
                            initWorker(dracoModule());
                        }
                    });
                });
            }
            // Require and compile WebAssembly module, or use fallback if not supported
            return require([wasmConfig.modulePath], function (dracoModule) {
                if (when.defined(wasmConfig.wasmBinaryFile)) {
                    if (!when.defined(dracoModule)) {
                        dracoModule = self.DracoDecoderModule;
                    }

                    dracoModule(wasmConfig).then(function (compiledModule) {
                        initWorker(compiledModule);
                    });
                } else {
                    initWorker(dracoModule());
                }
            });
        }
    }
    //export default createTaskProcessorWorker(S3MBTilesParser);

    return S3MBTilesParser;

});

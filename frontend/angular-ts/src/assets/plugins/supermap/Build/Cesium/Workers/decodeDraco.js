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
define(['./when-8d13db60', './Check-70bec281', './Math-61ede240', './RuntimeError-ba10bc3e', './WebGLConstants-4c11ee5f', './ComponentDatatype-5862616f', './IndexDatatype-9435b55f', './createTaskProcessorWorker'], function (when, Check, _Math, RuntimeError, WebGLConstants, ComponentDatatype, IndexDatatype, createTaskProcessorWorker) { 'use strict';

    /* global require */

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

        draco.destroy(faceIndices);

        return {
            typedArray : indexArray,
            numberOfIndices : numIndices
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

    function decodePointCloud(parameters) {
        var dracoDecoder = new draco.Decoder();

        if (parameters.dequantizeInShader) {
            dracoDecoder.SkipAttributeTransform(draco.POSITION);
            dracoDecoder.SkipAttributeTransform(draco.NORMAL);
        }

        var buffer = new draco.DecoderBuffer();
        buffer.Init(parameters.buffer, parameters.buffer.length);

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

        var result = {};

        var properties = parameters.properties;
        for (var propertyName in properties) {
            if (properties.hasOwnProperty(propertyName)) {
                var attributeId = properties[propertyName];
                var dracoAttribute = dracoDecoder.GetAttributeByUniqueId(dracoPointCloud, attributeId);
                result[propertyName] = decodeAttribute(dracoPointCloud, dracoDecoder, dracoAttribute);
            }
        }

        draco.destroy(dracoPointCloud);
        draco.destroy(dracoDecoder);

        return result;
    }

    function decodePrimitive(parameters) {
        var dracoDecoder = new draco.Decoder();

        // Skip all parameter types except generic
        var attributesToSkip = ['POSITION', 'NORMAL', 'COLOR', 'TEX_COORD'];
        if (parameters.dequantizeInShader) {
            for (var i = 0; i < attributesToSkip.length; ++i) {
                dracoDecoder.SkipAttributeTransform(draco[attributesToSkip[i]]);
            }
        }

        var bufferView = parameters.bufferView;
        var buffer = new draco.DecoderBuffer();
        buffer.Init(parameters.array, bufferView.byteLength);

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

        var attributeData = {};

        var compressedAttributes = parameters.compressedAttributes;
        for (var attributeName in compressedAttributes) {
            if (compressedAttributes.hasOwnProperty(attributeName)) {
                var compressedAttribute = compressedAttributes[attributeName];
                var dracoAttribute = dracoDecoder.GetAttributeByUniqueId(dracoGeometry, compressedAttribute);
                attributeData[attributeName] = decodeAttribute(dracoGeometry, dracoDecoder, dracoAttribute);
            }
        }

        var result = {
            indexArray : decodeIndexArray(dracoGeometry, dracoDecoder),
            attributeData : attributeData
        };

        draco.destroy(dracoGeometry);
        draco.destroy(dracoDecoder);

        return result;
    }

    function decode(parameters) {
        if (when.defined(parameters.primitive)) {
            return decodePrimitive(parameters);
        }
        return decodePointCloud(parameters);
    }

    function initWorker(dracoModule) {
        draco = dracoModule;
        self.onmessage = createTaskProcessorWorker(decode);
        self.postMessage(true);
    }

    function decodeDraco(event) {
        var data = event.data;

        // Expect the first message to be to load a web assembly module
        var wasmConfig = data.webAssemblyConfig;
        if (when.defined(wasmConfig)) {
            // Require and compile WebAssembly module, or use fallback if not supported
            return require([wasmConfig.modulePath], function(dracoModule) {
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

    return decodeDraco;

});

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
define(['exports', './when-8d13db60', './Check-70bec281', './Cartesian2-85064f09', './BoundingSphere-775c5788', './ComponentDatatype-5862616f', './GeometryAttribute-06d31d45', './GeometryAttributes-aacecde6', './GeometryPipeline-f6e7a4ed', './IndexDatatype-9435b55f', './WebMercatorProjection-80c70558'], function (exports, when, Check, Cartesian2, BoundingSphere, ComponentDatatype, GeometryAttribute, GeometryAttributes, GeometryPipeline, IndexDatatype, WebMercatorProjection) { 'use strict';

    /**
         * Value and type information for per-instance geometry attribute that determines the geometry instance offset
         *
         * @alias OffsetGeometryInstanceAttribute
         * @constructor
         *
         * @param {Number} [x=0] The x translation
         * @param {Number} [y=0] The y translation
         * @param {Number} [z=0] The z translation
         *
         * @private
         *
         * @see GeometryInstance
         * @see GeometryInstanceAttribute
         */
        function OffsetGeometryInstanceAttribute(x, y, z) {
            x = when.defaultValue(x, 0);
            y = when.defaultValue(y, 0);
            z = when.defaultValue(z, 0);

            /**
             * The values for the attributes stored in a typed array.
             *
             * @type Float32Array
             */
            this.value = new Float32Array([x, y, z]);
        }

        Object.defineProperties(OffsetGeometryInstanceAttribute.prototype, {
            /**
             * The datatype of each component in the attribute, e.g., individual elements in
             * {@link OffsetGeometryInstanceAttribute#value}.
             *
             * @memberof OffsetGeometryInstanceAttribute.prototype
             *
             * @type {ComponentDatatype}
             * @readonly
             *
             * @default {@link ComponentDatatype.FLOAT}
             */
            componentDatatype : {
                get : function() {
                    return ComponentDatatype.ComponentDatatype.FLOAT;
                }
            },

            /**
             * The number of components in the attributes, i.e., {@link OffsetGeometryInstanceAttribute#value}.
             *
             * @memberof OffsetGeometryInstanceAttribute.prototype
             *
             * @type {Number}
             * @readonly
             *
             * @default 3
             */
            componentsPerAttribute : {
                get : function() {
                    return 3;
                }
            },

            /**
             * When <code>true</code> and <code>componentDatatype</code> is an integer format,
             * indicate that the components should be mapped to the range [0, 1] (unsigned)
             * or [-1, 1] (signed) when they are accessed as floating-point for rendering.
             *
             * @memberof OffsetGeometryInstanceAttribute.prototype
             *
             * @type {Boolean}
             * @readonly
             *
             * @default false
             */
            normalize : {
                get : function() {
                    return false;
                }
            }
        });

        /**
         * Creates a new {@link OffsetGeometryInstanceAttribute} instance given the provided an enabled flag and {@link DistanceDisplayCondition}.
         *
         * @param {Cartesian3} offset The cartesian offset
         * @returns {OffsetGeometryInstanceAttribute} The new {@link OffsetGeometryInstanceAttribute} instance.
         */
        OffsetGeometryInstanceAttribute.fromCartesian3 = function(offset) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('offset', offset);
            //>>includeEnd('debug');

            return new OffsetGeometryInstanceAttribute(offset.x, offset.y, offset.z);
        };

        /**
         * Converts a distance display condition to a typed array that can be used to assign a distance display condition attribute.
         *
         * @param {Cartesian3} offset The cartesian offset
         * @param {Float32Array} [result] The array to store the result in, if undefined a new instance will be created.
         * @returns {Float32Array} The modified result parameter or a new instance if result was undefined.
         *
         * @example
         * var attributes = primitive.getGeometryInstanceAttributes('an id');
         * attributes.modelMatrix = Cesium.OffsetGeometryInstanceAttribute.toValue(modelMatrix, attributes.modelMatrix);
         */
        OffsetGeometryInstanceAttribute.toValue = function(offset, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('offset', offset);
            //>>includeEnd('debug');

            if (!when.defined(result)) {
                result = new Float32Array([offset.x, offset.y, offset.z]);
            }

            result[0] = offset.x;
            result[1] = offset.y;
            result[2] = offset.z;
            return result;
        };

    function transformToWorldCoordinates(instances, primitiveModelMatrix, scene3DOnly) {
        var toWorld = !scene3DOnly;
        var length = instances.length;
        var i;

        if (!toWorld && (length > 1)) {
            var modelMatrix = instances[0].modelMatrix;

            for (i = 1; i < length; ++i) {
                if (!BoundingSphere.Matrix4.equals(modelMatrix, instances[i].modelMatrix)) {
                    toWorld = true;
                    break;
                }
            }
        }

        if (toWorld) {
            for (i = 0; i < length; ++i) {
                if (when.defined(instances[i].geometry)) {
                    GeometryPipeline.GeometryPipeline.transformToWorldCoordinates(instances[i]);
                }
            }
        } else {
            // Leave geometry in local coordinate system; auto update model-matrix.
            BoundingSphere.Matrix4.multiplyTransformation(primitiveModelMatrix, instances[0].modelMatrix, primitiveModelMatrix);
        }
    }

    function addGeometryBatchId(geometry, batchId) {
        var attributes = geometry.attributes;
        var positionAttr = attributes.position;
        var numberOfComponents = positionAttr.values.length / positionAttr.componentsPerAttribute;

        attributes.batchId = new GeometryAttribute.GeometryAttribute({
            componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
            componentsPerAttribute : 1,
            values : new Float32Array(numberOfComponents)
        });

        var values = attributes.batchId.values;
        for (var j = 0; j < numberOfComponents; ++j) {
            values[j] = batchId;
        }
    }

    function addBatchIds(instances) {
        var length = instances.length;

        for (var i = 0; i < length; ++i) {
            var instance = instances[i];
            if (when.defined(instance.geometry)) {
                addGeometryBatchId(instance.geometry, i);
            } else if (when.defined(instance.westHemisphereGeometry) && when.defined(instance.eastHemisphereGeometry)) {
                addGeometryBatchId(instance.westHemisphereGeometry, i);
                addGeometryBatchId(instance.eastHemisphereGeometry, i);
            }
        }
    }

    function geometryPipeline(parameters) {
        var instances = parameters.instances;
        var projection = parameters.projection;
        var uintIndexSupport = parameters.elementIndexUintSupported;
        var scene3DOnly = parameters.scene3DOnly;
        var vertexCacheOptimize = parameters.vertexCacheOptimize;
        var compressVertices = parameters.compressVertices;
        var modelMatrix = parameters.modelMatrix;

        var i;
        var geometry;
        var primitiveType;
        var length = instances.length;

        for (i = 0; i < length; ++i) {
            if (when.defined(instances[i].geometry)) {
                primitiveType = instances[i].geometry.primitiveType;
                break;
            }
        }

        //>>includeStart('debug', pragmas.debug);
        for (i = 1; i < length; ++i) {
            if (when.defined(instances[i].geometry) && instances[i].geometry.primitiveType !== primitiveType) {
                throw new Check.DeveloperError('All instance geometries must have the same primitiveType.');
            }
        }
        //>>includeEnd('debug');

        // Unify to world coordinates before combining.
        transformToWorldCoordinates(instances, modelMatrix, scene3DOnly);

        // Clip to IDL
        if (!scene3DOnly) {
            for (i = 0; i < length; ++i) {
                if (when.defined(instances[i].geometry)) {
                    GeometryPipeline.GeometryPipeline.splitLongitude(instances[i]);
                }
            }
        }

        addBatchIds(instances);

        // Optimize for vertex shader caches
        if (vertexCacheOptimize) {
            for (i = 0; i < length; ++i) {
                var instance = instances[i];
                if (when.defined(instance.geometry)) {
                    GeometryPipeline.GeometryPipeline.reorderForPostVertexCache(instance.geometry);
                    GeometryPipeline.GeometryPipeline.reorderForPreVertexCache(instance.geometry);
                } else if (when.defined(instance.westHemisphereGeometry) && when.defined(instance.eastHemisphereGeometry)) {
                    GeometryPipeline.GeometryPipeline.reorderForPostVertexCache(instance.westHemisphereGeometry);
                    GeometryPipeline.GeometryPipeline.reorderForPreVertexCache(instance.westHemisphereGeometry);

                    GeometryPipeline.GeometryPipeline.reorderForPostVertexCache(instance.eastHemisphereGeometry);
                    GeometryPipeline.GeometryPipeline.reorderForPreVertexCache(instance.eastHemisphereGeometry);
                }
            }
        }

        // Combine into single geometry for better rendering performance.
        var geometries = GeometryPipeline.GeometryPipeline.combineInstances(instances);

        length = geometries.length;
        for (i = 0; i < length; ++i) {
            geometry = geometries[i];

            // Split positions for GPU RTE
            var attributes = geometry.attributes;
            var name;
            if (!scene3DOnly) {
                for (name in attributes) {
                    if (attributes.hasOwnProperty(name) && attributes[name].componentDatatype === ComponentDatatype.ComponentDatatype.DOUBLE) {
                        var name3D = name + '3D';
                        var name2D = name + '2D';

                        // Compute 2D positions
                        GeometryPipeline.GeometryPipeline.projectTo2D(geometry, name, name3D, name2D, projection);
                        if (when.defined(geometry.boundingSphere) && name === 'position') {
                            geometry.boundingSphereCV = BoundingSphere.BoundingSphere.fromVertices(geometry.attributes.position2D.values);
                        }

                        GeometryPipeline.GeometryPipeline.encodeAttribute(geometry, name3D, name3D + 'High', name3D + 'Low');
                        GeometryPipeline.GeometryPipeline.encodeAttribute(geometry, name2D, name2D + 'High', name2D + 'Low');
                    }
                }
            } else {
                for (name in attributes) {
                    if (attributes.hasOwnProperty(name) && attributes[name].componentDatatype === ComponentDatatype.ComponentDatatype.DOUBLE) {
                        GeometryPipeline.GeometryPipeline.encodeAttribute(geometry, name, name + '3DHigh', name + '3DLow');
                    }
                }
            }

            // oct encode and pack normals, compress texture coordinates
            if (compressVertices) {
                GeometryPipeline.GeometryPipeline.compressVertices(geometry);
            }
        }

        if (!uintIndexSupport) {
            // Break into multiple geometries to fit within unsigned short indices if needed
            var splitGeometries = [];
            length = geometries.length;
            for (i = 0; i < length; ++i) {
                geometry = geometries[i];
                splitGeometries = splitGeometries.concat(GeometryPipeline.GeometryPipeline.fitToUnsignedShortIndices(geometry));
            }

            geometries = splitGeometries;
        }

        return geometries;
    }

    function createPickOffsets(instances, geometryName, geometries, pickOffsets) {
        var offset;
        var indexCount;
        var geometryIndex;

        var offsetIndex = pickOffsets.length - 1;
        if (offsetIndex >= 0) {
            var pickOffset = pickOffsets[offsetIndex];
            offset = pickOffset.offset + pickOffset.count;
            geometryIndex = pickOffset.index;
            indexCount = geometries[geometryIndex].indices.length;
        } else {
            offset = 0;
            geometryIndex = 0;
            indexCount = geometries[geometryIndex].indices.length;
        }

        var length = instances.length;
        for (var i = 0; i < length; ++i) {
            var instance = instances[i];
            var geometry = instance[geometryName];
            if (!when.defined(geometry)) {
                continue;
            }

            var count = geometry.indices.length;

            if (offset + count > indexCount) {
                offset = 0;
                indexCount = geometries[++geometryIndex].indices.length;
            }

            pickOffsets.push({
                index : geometryIndex,
                offset : offset,
                count : count
            });
            offset += count;
        }
    }

    function createInstancePickOffsets(instances, geometries) {
        var pickOffsets = [];
        createPickOffsets(instances, 'geometry', geometries, pickOffsets);
        createPickOffsets(instances, 'westHemisphereGeometry', geometries, pickOffsets);
        createPickOffsets(instances, 'eastHemisphereGeometry', geometries, pickOffsets);
        return pickOffsets;
    }

    /**
     * @private
     */
    var PrimitivePipeline = {};

    /**
     * @private
     */
    PrimitivePipeline.combineGeometry = function(parameters) {
        var geometries;
        var attributeLocations;
        var instances = parameters.instances;
        var length = instances.length;
        var pickOffsets;

        var offsetInstanceExtend;
        var hasOffset = false;
        if (length > 0) {
            geometries = geometryPipeline(parameters);
            if (geometries.length > 0) {
                attributeLocations = GeometryPipeline.GeometryPipeline.createAttributeLocations(geometries[0]);
                if (parameters.createPickOffsets) {
                    pickOffsets = createInstancePickOffsets(instances, geometries);
                }
            }
            if (when.defined(instances[0].attributes) && when.defined(instances[0].attributes.offset)) {
                offsetInstanceExtend = new Array(length);
                hasOffset = true;
            }
        }

        var boundingSpheres = new Array(length);
        var boundingSpheresCV = new Array(length);
        for (var i = 0; i < length; ++i) {
            var instance = instances[i];
            var geometry = instance.geometry;
            if (when.defined(geometry)) {
                boundingSpheres[i] = geometry.boundingSphere;
                boundingSpheresCV[i] = geometry.boundingSphereCV;
                if (hasOffset) {
                    offsetInstanceExtend[i] = instance.geometry.offsetAttribute;
                }
            }

            var eastHemisphereGeometry = instance.eastHemisphereGeometry;
            var westHemisphereGeometry = instance.westHemisphereGeometry;
            if (when.defined(eastHemisphereGeometry) && when.defined(westHemisphereGeometry)) {
                if (when.defined(eastHemisphereGeometry.boundingSphere) && when.defined(westHemisphereGeometry.boundingSphere)) {
                    boundingSpheres[i] = BoundingSphere.BoundingSphere.union(eastHemisphereGeometry.boundingSphere, westHemisphereGeometry.boundingSphere);
                }
                if (when.defined(eastHemisphereGeometry.boundingSphereCV) && when.defined(westHemisphereGeometry.boundingSphereCV)) {
                    boundingSpheresCV[i] = BoundingSphere.BoundingSphere.union(eastHemisphereGeometry.boundingSphereCV, westHemisphereGeometry.boundingSphereCV);
                }
            }
        }

        return {
            geometries : geometries,
            modelMatrix : parameters.modelMatrix,
            attributeLocations : attributeLocations,
            pickOffsets : pickOffsets,
            offsetInstanceExtend : offsetInstanceExtend,
            boundingSpheres : boundingSpheres,
            boundingSpheresCV : boundingSpheresCV
        };
    };

    function transferGeometry(geometry, transferableObjects) {
        var attributes = geometry.attributes;
        for (var name in attributes) {
            if (attributes.hasOwnProperty(name)) {
                var attribute = attributes[name];

                if (when.defined(attribute) && when.defined(attribute.values)) {
                    transferableObjects.push(attribute.values.buffer);
                }
            }
        }

        if (when.defined(geometry.indices)) {
            transferableObjects.push(geometry.indices.buffer);
        }
    }

    function transferGeometries(geometries, transferableObjects) {
        var length = geometries.length;
        for (var i = 0; i < length; ++i) {
            transferGeometry(geometries[i], transferableObjects);
        }
    }

    // This function was created by simplifying packCreateGeometryResults into a count-only operation.
    function countCreateGeometryResults(items) {
        var count = 1;
        var length = items.length;
        for (var i = 0; i < length; i++) {
            var geometry = items[i];
            ++count;

            if (!when.defined(geometry)) {
                continue;
            }

            var attributes = geometry.attributes;

            count += 7 + 2 * BoundingSphere.BoundingSphere.packedLength + (when.defined(geometry.indices) ? geometry.indices.length : 0);

            for (var property in attributes) {
                if (attributes.hasOwnProperty(property) && when.defined(attributes[property])) {
                    var attribute = attributes[property];
                    count += 5 + attribute.values.length;
                }
            }
        }

        return count;
    }

    /**
     * @private
     */
    PrimitivePipeline.packCreateGeometryResults = function(items, transferableObjects) {
        var packedData = new Float64Array(countCreateGeometryResults(items));
        var stringTable = [];
        var stringHash = {};

        var length = items.length;
        var count = 0;
        packedData[count++] = length;
        for (var i = 0; i < length; i++) {
            var geometry = items[i];

            var validGeometry = when.defined(geometry);
            packedData[count++] = validGeometry ? 1.0 : 0.0;

            if (!validGeometry) {
                continue;
            }

            packedData[count++] = geometry.primitiveType;
            packedData[count++] = geometry.geometryType;
            packedData[count++] = when.defaultValue(geometry.offsetAttribute, -1);

            var validBoundingSphere = when.defined(geometry.boundingSphere) ? 1.0 : 0.0;
            packedData[count++] = validBoundingSphere;
            if (validBoundingSphere) {
                BoundingSphere.BoundingSphere.pack(geometry.boundingSphere, packedData, count);
            }

            count += BoundingSphere.BoundingSphere.packedLength;

            var validBoundingSphereCV = when.defined(geometry.boundingSphereCV) ? 1.0 : 0.0;
            packedData[count++] = validBoundingSphereCV;
            if (validBoundingSphereCV) {
                BoundingSphere.BoundingSphere.pack(geometry.boundingSphereCV, packedData, count);
            }

            count += BoundingSphere.BoundingSphere.packedLength;

            var attributes = geometry.attributes;
            var attributesToWrite = [];
            for (var property in attributes) {
                if (attributes.hasOwnProperty(property) && when.defined(attributes[property])) {
                    attributesToWrite.push(property);
                    if (!when.defined(stringHash[property])) {
                        stringHash[property] = stringTable.length;
                        stringTable.push(property);
                    }
                }
            }

            packedData[count++] = attributesToWrite.length;
            for (var q = 0; q < attributesToWrite.length; q++) {
                var name = attributesToWrite[q];
                var attribute = attributes[name];
                packedData[count++] = stringHash[name];
                packedData[count++] = attribute.componentDatatype;
                packedData[count++] = attribute.componentsPerAttribute;
                packedData[count++] = attribute.normalize ? 1 : 0;
                packedData[count++] = attribute.values.length;
                packedData.set(attribute.values, count);
                count += attribute.values.length;
            }

            var indicesLength = when.defined(geometry.indices) ? geometry.indices.length : 0;
            packedData[count++] = indicesLength;

            if (indicesLength > 0) {
                packedData.set(geometry.indices, count);
                count += indicesLength;
            }
        }

        transferableObjects.push(packedData.buffer);

        return {
            stringTable : stringTable,
            packedData : packedData
        };
    };

    /**
     * @private
     */
    PrimitivePipeline.unpackCreateGeometryResults = function(createGeometryResult) {
        var stringTable = createGeometryResult.stringTable;
        var packedGeometry = createGeometryResult.packedData;

        var i;
        var result = new Array(packedGeometry[0]);
        var resultIndex = 0;

        var packedGeometryIndex = 1;
        while (packedGeometryIndex < packedGeometry.length) {
            var valid = packedGeometry[packedGeometryIndex++] === 1.0;
            if (!valid) {
                result[resultIndex++] = undefined;
                continue;
            }

            var primitiveType = packedGeometry[packedGeometryIndex++];
            var geometryType = packedGeometry[packedGeometryIndex++];
            var offsetAttribute = packedGeometry[packedGeometryIndex++];
            if (offsetAttribute === -1) {
                offsetAttribute = undefined;
            }

            var boundingSphere;
            var boundingSphereCV;

            var validBoundingSphere = packedGeometry[packedGeometryIndex++] === 1.0;
            if (validBoundingSphere) {
                boundingSphere = BoundingSphere.BoundingSphere.unpack(packedGeometry, packedGeometryIndex);
            }

            packedGeometryIndex += BoundingSphere.BoundingSphere.packedLength;

            var validBoundingSphereCV = packedGeometry[packedGeometryIndex++] === 1.0;
            if (validBoundingSphereCV) {
                boundingSphereCV = BoundingSphere.BoundingSphere.unpack(packedGeometry, packedGeometryIndex);
            }

            packedGeometryIndex += BoundingSphere.BoundingSphere.packedLength;

            var length;
            var values;
            var componentsPerAttribute;
            var attributes = new GeometryAttributes.GeometryAttributes();
            var numAttributes = packedGeometry[packedGeometryIndex++];
            for (i = 0; i < numAttributes; i++) {
                var name = stringTable[packedGeometry[packedGeometryIndex++]];
                var componentDatatype = packedGeometry[packedGeometryIndex++];
                componentsPerAttribute = packedGeometry[packedGeometryIndex++];
                var normalize = packedGeometry[packedGeometryIndex++] !== 0;

                length = packedGeometry[packedGeometryIndex++];
                values = ComponentDatatype.ComponentDatatype.createTypedArray(componentDatatype, length);
                for (var valuesIndex = 0; valuesIndex < length; valuesIndex++) {
                    values[valuesIndex] = packedGeometry[packedGeometryIndex++];
                }

                attributes[name] = new GeometryAttribute.GeometryAttribute({
                    componentDatatype : componentDatatype,
                    componentsPerAttribute : componentsPerAttribute,
                    normalize : normalize,
                    values : values
                });
            }

            var indices;
            length = packedGeometry[packedGeometryIndex++];

            if (length > 0) {
                var numberOfVertices = values.length / componentsPerAttribute;
                indices = IndexDatatype.IndexDatatype.createTypedArray(numberOfVertices, length);
                for (i = 0; i < length; i++) {
                    indices[i] = packedGeometry[packedGeometryIndex++];
                }
            }

            result[resultIndex++] = new GeometryAttribute.Geometry({
                primitiveType : primitiveType,
                geometryType : geometryType,
                boundingSphere : boundingSphere,
                boundingSphereCV : boundingSphereCV,
                indices : indices,
                attributes : attributes,
                offsetAttribute: offsetAttribute
            });
        }

        return result;
    };

    function packInstancesForCombine(instances, transferableObjects) {
        var length = instances.length;
        var packedData = new Float64Array(1 + (length * 19));
        var count = 0;
        packedData[count++] = length;
        for (var i = 0; i < length; i++) {
            var instance = instances[i];
            BoundingSphere.Matrix4.pack(instance.modelMatrix, packedData, count);
            count += BoundingSphere.Matrix4.packedLength;
            if (when.defined(instance.attributes) && when.defined(instance.attributes.offset)) {
                var values = instance.attributes.offset.value;
                packedData[count] = values[0];
                packedData[count + 1] = values[1];
                packedData[count + 2] = values[2];
            }
            count += 3;
        }
        transferableObjects.push(packedData.buffer);

        return packedData;
    }

    function unpackInstancesForCombine(data) {
        var packedInstances = data;
        var result = new Array(packedInstances[0]);
        var count = 0;

        var i = 1;
        while (i < packedInstances.length) {
            var modelMatrix = BoundingSphere.Matrix4.unpack(packedInstances, i);
            var attributes;
            i += BoundingSphere.Matrix4.packedLength;
            if (when.defined(packedInstances[i])) {
                attributes = {
                    offset : new OffsetGeometryInstanceAttribute(packedInstances[i], packedInstances[i + 1], packedInstances[i + 2])
                };
            }
            i += 3;

            result[count++] = {
                modelMatrix : modelMatrix,
                attributes : attributes
            };
        }

        return result;
    }

    /**
     * @private
     */
    PrimitivePipeline.packCombineGeometryParameters = function(parameters, transferableObjects) {
        var createGeometryResults = parameters.createGeometryResults;
        var length = createGeometryResults.length;

        for (var i = 0; i < length; i++) {
            transferableObjects.push(createGeometryResults[i].packedData.buffer);
        }

        return {
            createGeometryResults : parameters.createGeometryResults,
            packedInstances : packInstancesForCombine(parameters.instances, transferableObjects),
            ellipsoid : parameters.ellipsoid,
            isGeographic : parameters.projection instanceof BoundingSphere.GeographicProjection,
            elementIndexUintSupported : parameters.elementIndexUintSupported,
            scene3DOnly : parameters.scene3DOnly,
            vertexCacheOptimize : parameters.vertexCacheOptimize,
            compressVertices : parameters.compressVertices,
            modelMatrix : parameters.modelMatrix,
            createPickOffsets : parameters.createPickOffsets
        };
    };

    /**
     * @private
     */
    PrimitivePipeline.unpackCombineGeometryParameters = function(packedParameters) {
        var instances = unpackInstancesForCombine(packedParameters.packedInstances);
        var createGeometryResults = packedParameters.createGeometryResults;
        var length = createGeometryResults.length;
        var instanceIndex = 0;

        for (var resultIndex = 0; resultIndex < length; resultIndex++) {
            var geometries = PrimitivePipeline.unpackCreateGeometryResults(createGeometryResults[resultIndex]);
            var geometriesLength = geometries.length;
            for (var geometryIndex = 0; geometryIndex < geometriesLength; geometryIndex++) {
                var geometry = geometries[geometryIndex];
                var instance = instances[instanceIndex];
                instance.geometry = geometry;
                ++instanceIndex;
            }
        }

        var ellipsoid = Cartesian2.Ellipsoid.clone(packedParameters.ellipsoid);
        var projection = packedParameters.isGeographic ? new BoundingSphere.GeographicProjection(ellipsoid) : new WebMercatorProjection.WebMercatorProjection(ellipsoid);

        return {
            instances : instances,
            ellipsoid : ellipsoid,
            projection : projection,
            elementIndexUintSupported : packedParameters.elementIndexUintSupported,
            scene3DOnly : packedParameters.scene3DOnly,
            vertexCacheOptimize : packedParameters.vertexCacheOptimize,
            compressVertices : packedParameters.compressVertices,
            modelMatrix : BoundingSphere.Matrix4.clone(packedParameters.modelMatrix),
            createPickOffsets : packedParameters.createPickOffsets
        };
    };

    function packBoundingSpheres(boundingSpheres) {
        var length = boundingSpheres.length;
        var bufferLength = 1 + (BoundingSphere.BoundingSphere.packedLength + 1) * length;
        var buffer = new Float32Array(bufferLength);

        var bufferIndex = 0;
        buffer[bufferIndex++] = length;

        for (var i = 0; i < length; ++i) {
            var bs = boundingSpheres[i];
            if (!when.defined(bs)) {
                buffer[bufferIndex++] = 0.0;
            } else {
                buffer[bufferIndex++] = 1.0;
                BoundingSphere.BoundingSphere.pack(boundingSpheres[i], buffer, bufferIndex);
            }
            bufferIndex += BoundingSphere.BoundingSphere.packedLength;
        }

        return buffer;
    }

    function unpackBoundingSpheres(buffer) {
        var result = new Array(buffer[0]);
        var count = 0;

        var i = 1;
        while (i < buffer.length) {
            if (buffer[i++] === 1.0) {
                result[count] = BoundingSphere.BoundingSphere.unpack(buffer, i);
            }
            ++count;
            i += BoundingSphere.BoundingSphere.packedLength;
        }

        return result;
    }

    /**
     * @private
     */
    PrimitivePipeline.packCombineGeometryResults = function(results, transferableObjects) {
        if (when.defined(results.geometries)) {
            transferGeometries(results.geometries, transferableObjects);
        }

        var packedBoundingSpheres = packBoundingSpheres(results.boundingSpheres);
        var packedBoundingSpheresCV = packBoundingSpheres(results.boundingSpheresCV);
        transferableObjects.push(packedBoundingSpheres.buffer, packedBoundingSpheresCV.buffer);

        return {
            geometries : results.geometries,
            attributeLocations : results.attributeLocations,
            modelMatrix : results.modelMatrix,
            pickOffsets : results.pickOffsets,
            offsetInstanceExtend: results.offsetInstanceExtend,
            boundingSpheres : packedBoundingSpheres,
            boundingSpheresCV : packedBoundingSpheresCV
        };
    };

    /**
     * @private
     */
    PrimitivePipeline.unpackCombineGeometryResults = function(packedResult) {
        return {
            geometries : packedResult.geometries,
            attributeLocations : packedResult.attributeLocations,
            modelMatrix : packedResult.modelMatrix,
            pickOffsets : packedResult.pickOffsets,
            offsetInstanceExtend: packedResult.offsetInstanceExtend,
            boundingSpheres : unpackBoundingSpheres(packedResult.boundingSpheres),
            boundingSpheresCV : unpackBoundingSpheres(packedResult.boundingSpheresCV)
        };
    };

    exports.PrimitivePipeline = PrimitivePipeline;

});

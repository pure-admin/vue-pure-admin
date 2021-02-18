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
define(['./when-8d13db60', './Check-70bec281', './Math-61ede240', './Cartographic-fe4be337', './Cartesian2-85064f09', './BoundingSphere-775c5788', './Cartesian4-5af5bb24', './RuntimeError-ba10bc3e', './WebGLConstants-4c11ee5f', './ComponentDatatype-5862616f', './GeometryAttribute-06d31d45', './PrimitiveType-97893bc7', './FeatureDetection-7bd32c34', './Transforms-913163ed', './buildModuleUrl-9d43158d', './GeometryAttributes-aacecde6', './Plane-8390418f', './VertexFormat-fe4db402', './FrustumGeometry-e2ea329a'], function (when, Check, _Math, Cartographic, Cartesian2, BoundingSphere, Cartesian4, RuntimeError, WebGLConstants, ComponentDatatype, GeometryAttribute, PrimitiveType, FeatureDetection, Transforms, buildModuleUrl, GeometryAttributes, Plane, VertexFormat, FrustumGeometry) { 'use strict';

    var PERSPECTIVE = 0;
        var ORTHOGRAPHIC = 1;

        /**
         * A description of the outline of a frustum with the given the origin and orientation.
         *
         * @alias FrustumOutlineGeometry
         * @constructor
         *
         * @param {Object} options Object with the following properties:
         * @param {PerspectiveFrustum|OrthographicFrustum} options.frustum The frustum.
         * @param {Cartesian3} options.origin The origin of the frustum.
         * @param {Quaternion} options.orientation The orientation of the frustum.
         */
        function FrustumOutlineGeometry(options) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('options', options);
            Check.Check.typeOf.object('options.frustum', options.frustum);
            Check.Check.typeOf.object('options.origin', options.origin);
            Check.Check.typeOf.object('options.orientation', options.orientation);
            //>>includeEnd('debug');

            var frustum = options.frustum;
            var orientation = options.orientation;
            var origin = options.origin;

            // This is private because it is used by DebugCameraPrimitive to draw a multi-frustum by
            // creating multiple FrustumOutlineGeometrys. This way the near plane of one frustum doesn't overlap
            // the far plane of another.
            var drawNearPlane = when.defaultValue(options._drawNearPlane, true);

            var frustumType;
            var frustumPackedLength;
            if (frustum instanceof FrustumGeometry.PerspectiveFrustum) {
                frustumType = PERSPECTIVE;
                frustumPackedLength = FrustumGeometry.PerspectiveFrustum.packedLength;
            } else if (frustum instanceof FrustumGeometry.OrthographicFrustum) {
                frustumType = ORTHOGRAPHIC;
                frustumPackedLength = FrustumGeometry.OrthographicFrustum.packedLength;
            }

            this._frustumType = frustumType;
            this._frustum = frustum.clone();
            this._origin = Cartographic.Cartesian3.clone(origin);
            this._orientation = Transforms.Quaternion.clone(orientation);
            this._drawNearPlane = drawNearPlane;
            this._workerName = 'createFrustumOutlineGeometry';

            /**
             * The number of elements used to pack the object into an array.
             * @type {Number}
             */
            this.packedLength = 2 + frustumPackedLength + Cartographic.Cartesian3.packedLength + Transforms.Quaternion.packedLength;
        }

        /**
         * Stores the provided instance into the provided array.
         *
         * @param {FrustumOutlineGeometry} value The value to pack.
         * @param {Number[]} array The array to pack into.
         * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
         *
         * @returns {Number[]} The array that was packed into
         */
        FrustumOutlineGeometry.pack = function(value, array, startingIndex) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('value', value);
            Check.Check.defined('array', array);
            //>>includeEnd('debug');

            startingIndex = when.defaultValue(startingIndex, 0);

            var frustumType = value._frustumType;
            var frustum = value._frustum;

            array[startingIndex++] = frustumType;

            if (frustumType === PERSPECTIVE) {
                FrustumGeometry.PerspectiveFrustum.pack(frustum, array, startingIndex);
                startingIndex += FrustumGeometry.PerspectiveFrustum.packedLength;
            } else {
                FrustumGeometry.OrthographicFrustum.pack(frustum, array, startingIndex);
                startingIndex += FrustumGeometry.OrthographicFrustum.packedLength;
            }

            Cartographic.Cartesian3.pack(value._origin, array, startingIndex);
            startingIndex += Cartographic.Cartesian3.packedLength;
            Transforms.Quaternion.pack(value._orientation, array, startingIndex);
            startingIndex += Transforms.Quaternion.packedLength;
            array[startingIndex] = value._drawNearPlane ? 1.0 : 0.0;

            return array;
        };

        var scratchPackPerspective = new FrustumGeometry.PerspectiveFrustum();
        var scratchPackOrthographic = new FrustumGeometry.OrthographicFrustum();
        var scratchPackQuaternion = new Transforms.Quaternion();
        var scratchPackorigin = new Cartographic.Cartesian3();

        /**
         * Retrieves an instance from a packed array.
         *
         * @param {Number[]} array The packed array.
         * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
         * @param {FrustumOutlineGeometry} [result] The object into which to store the result.
         */
        FrustumOutlineGeometry.unpack = function(array, startingIndex, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('array', array);
            //>>includeEnd('debug');

            startingIndex = when.defaultValue(startingIndex, 0);

            var frustumType = array[startingIndex++];

            var frustum;
            if (frustumType === PERSPECTIVE) {
                frustum = FrustumGeometry.PerspectiveFrustum.unpack(array, startingIndex, scratchPackPerspective);
                startingIndex += FrustumGeometry.PerspectiveFrustum.packedLength;
            } else {
                frustum = FrustumGeometry.OrthographicFrustum.unpack(array, startingIndex, scratchPackOrthographic);
                startingIndex += FrustumGeometry.OrthographicFrustum.packedLength;
            }

            var origin = Cartographic.Cartesian3.unpack(array, startingIndex, scratchPackorigin);
            startingIndex += Cartographic.Cartesian3.packedLength;
            var orientation = Transforms.Quaternion.unpack(array, startingIndex, scratchPackQuaternion);
            startingIndex += Transforms.Quaternion.packedLength;
            var drawNearPlane = array[startingIndex] === 1.0;

            if (!when.defined(result)) {
                return new FrustumOutlineGeometry({
                    frustum : frustum,
                    origin : origin,
                    orientation : orientation,
                    _drawNearPlane : drawNearPlane
                });
            }

            var frustumResult = frustumType === result._frustumType ? result._frustum : undefined;
            result._frustum = frustum.clone(frustumResult);

            result._frustumType = frustumType;
            result._origin = Cartographic.Cartesian3.clone(origin, result._origin);
            result._orientation = Transforms.Quaternion.clone(orientation, result._orientation);
            result._drawNearPlane = drawNearPlane;

            return result;
        };

        /**
         * Computes the geometric representation of a frustum outline, including its vertices, indices, and a bounding sphere.
         *
         * @param {FrustumOutlineGeometry} frustumGeometry A description of the frustum.
         * @returns {Geometry|undefined} The computed vertices and indices.
         */
        FrustumOutlineGeometry.createGeometry = function(frustumGeometry) {
            var frustumType = frustumGeometry._frustumType;
            var frustum = frustumGeometry._frustum;
            var origin = frustumGeometry._origin;
            var orientation = frustumGeometry._orientation;
            var drawNearPlane = frustumGeometry._drawNearPlane;

            var positions = new Float64Array(3 * 4 * 2);
            FrustumGeometry.FrustumGeometry._computeNearFarPlanes(origin, orientation, frustumType, frustum, positions);

            var attributes = new GeometryAttributes.GeometryAttributes({
                position : new GeometryAttribute.GeometryAttribute({
                    componentDatatype : ComponentDatatype.ComponentDatatype.DOUBLE,
                    componentsPerAttribute : 3,
                    values : positions
                })
            });

            var offset;
            var index;

            var numberOfPlanes = drawNearPlane ? 2 : 1;
            var indices = new Uint16Array(8 * (numberOfPlanes + 1));

            // Build the near/far planes
            var i = drawNearPlane ? 0 : 1;
            for (; i < 2; ++i) {
                offset = drawNearPlane ? i * 8 : 0;
                index = i * 4;

                indices[offset] = index;
                indices[offset + 1] = index + 1;
                indices[offset + 2] = index + 1;
                indices[offset + 3] = index + 2;
                indices[offset + 4] = index + 2;
                indices[offset + 5] = index + 3;
                indices[offset + 6] = index + 3;
                indices[offset + 7] = index;
            }

            // Build the sides of the frustums
            for (i = 0; i < 2; ++i) {
                offset = (numberOfPlanes + i) * 8;
                index = i * 4;

                indices[offset] = index;
                indices[offset + 1] = index + 4;
                indices[offset + 2] = index + 1;
                indices[offset + 3] = index + 5;
                indices[offset + 4] = index + 2;
                indices[offset + 5] = index + 6;
                indices[offset + 6] = index + 3;
                indices[offset + 7] = index + 7;
            }

            return new GeometryAttribute.Geometry({
                attributes : attributes,
                indices : indices,
                primitiveType : PrimitiveType.PrimitiveType.LINES,
                boundingSphere : BoundingSphere.BoundingSphere.fromVertices(positions)
            });
        };

    function createFrustumOutlineGeometry(frustumGeometry, offset) {
        if (when.defined(offset)) {
            frustumGeometry = FrustumOutlineGeometry.unpack(frustumGeometry, offset);
        }
        return FrustumOutlineGeometry.createGeometry(frustumGeometry);
    }

    return createFrustumOutlineGeometry;

});

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
define(['./when-8d13db60', './Check-70bec281', './Math-61ede240', './Cartographic-fe4be337', './Cartesian2-85064f09', './BoundingSphere-775c5788', './Cartesian4-5af5bb24', './RuntimeError-ba10bc3e', './WebGLConstants-4c11ee5f', './ComponentDatatype-5862616f', './GeometryAttribute-06d31d45', './PrimitiveType-97893bc7', './FeatureDetection-7bd32c34', './Transforms-913163ed', './buildModuleUrl-9d43158d', './GeometryAttributes-aacecde6', './AttributeCompression-84a90a13', './GeometryPipeline-f6e7a4ed', './EncodedCartesian3-a569cba8', './IndexDatatype-9435b55f', './IntersectionTests-397d9494', './Plane-8390418f', './GeometryOffsetAttribute-ca302482', './VertexFormat-fe4db402', './EllipseGeometryLibrary-3558b757', './GeometryInstance-93a01b5d', './EllipseGeometry-c7dc8c27'], function (when, Check, _Math, Cartographic, Cartesian2, BoundingSphere, Cartesian4, RuntimeError, WebGLConstants, ComponentDatatype, GeometryAttribute, PrimitiveType, FeatureDetection, Transforms, buildModuleUrl, GeometryAttributes, AttributeCompression, GeometryPipeline, EncodedCartesian3, IndexDatatype, IntersectionTests, Plane, GeometryOffsetAttribute, VertexFormat, EllipseGeometryLibrary, GeometryInstance, EllipseGeometry) { 'use strict';

    /**
         * A description of a circle on the ellipsoid. Circle geometry can be rendered with both {@link Primitive} and {@link GroundPrimitive}.
         *
         * @alias CircleGeometry
         * @constructor
         *
         * @param {Object} options Object with the following properties:
         * @param {Cartesian3} options.center The circle's center point in the fixed frame.
         * @param {Number} options.radius The radius in meters.
         * @param {Ellipsoid} [options.ellipsoid=Ellipsoid.WGS84] The ellipsoid the circle will be on.
         * @param {Number} [options.height=0.0] The distance in meters between the circle and the ellipsoid surface.
         * @param {Number} [options.granularity=0.02] The angular distance between points on the circle in radians.
         * @param {VertexFormat} [options.vertexFormat=VertexFormat.DEFAULT] The vertex attributes to be computed.
         * @param {Number} [options.extrudedHeight=0.0] The distance in meters between the circle's extruded face and the ellipsoid surface.
         * @param {Number} [options.stRotation=0.0] The rotation of the texture coordinates, in radians. A positive rotation is counter-clockwise.
         *
         * @exception {DeveloperError} radius must be greater than zero.
         * @exception {DeveloperError} granularity must be greater than zero.
         *
         * @see CircleGeometry.createGeometry
         * @see Packable
         *
         * @example
         * // Create a circle.
         * var circle = new Cesium.CircleGeometry({
         *   center : Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
         *   radius : 100000.0
         * });
         * var geometry = Cesium.CircleGeometry.createGeometry(circle);
         */
        function CircleGeometry(options) {
            options = when.defaultValue(options, when.defaultValue.EMPTY_OBJECT);
            var radius = options.radius;

            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.number('radius', radius);
            //>>includeEnd('debug');

            var ellipseGeometryOptions = {
                center : options.center,
                semiMajorAxis : radius,
                semiMinorAxis : radius,
                ellipsoid : options.ellipsoid,
                height : options.height,
                extrudedHeight : options.extrudedHeight,
                granularity : options.granularity,
                vertexFormat : options.vertexFormat,
                stRotation : options.stRotation,
                shadowVolume: options.shadowVolume
            };
            this._ellipseGeometry = new EllipseGeometry.EllipseGeometry(ellipseGeometryOptions);
            this._workerName = 'createCircleGeometry';
        }

        /**
         * The number of elements used to pack the object into an array.
         * @type {Number}
         */
        CircleGeometry.packedLength = EllipseGeometry.EllipseGeometry.packedLength;

        /**
         * Stores the provided instance into the provided array.
         *
         * @param {CircleGeometry} value The value to pack.
         * @param {Number[]} array The array to pack into.
         * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
         *
         * @returns {Number[]} The array that was packed into
         */
        CircleGeometry.pack = function(value, array, startingIndex) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('value', value);
            //>>includeEnd('debug');
            return EllipseGeometry.EllipseGeometry.pack(value._ellipseGeometry, array, startingIndex);
        };

        var scratchEllipseGeometry = new EllipseGeometry.EllipseGeometry({
            center : new Cartographic.Cartesian3(),
            semiMajorAxis : 1.0,
            semiMinorAxis : 1.0
        });
        var scratchOptions = {
            center : new Cartographic.Cartesian3(),
            radius : undefined,
            ellipsoid : Cartesian2.Ellipsoid.clone(Cartesian2.Ellipsoid.UNIT_SPHERE),
            height : undefined,
            extrudedHeight : undefined,
            granularity : undefined,
            vertexFormat : new VertexFormat.VertexFormat(),
            stRotation : undefined,
            semiMajorAxis : undefined,
            semiMinorAxis : undefined,
            shadowVolume: undefined
        };

        /**
         * Retrieves an instance from a packed array.
         *
         * @param {Number[]} array The packed array.
         * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
         * @param {CircleGeometry} [result] The object into which to store the result.
         * @returns {CircleGeometry} The modified result parameter or a new CircleGeometry instance if one was not provided.
         */
        CircleGeometry.unpack = function(array, startingIndex, result) {
            var ellipseGeometry = EllipseGeometry.EllipseGeometry.unpack(array, startingIndex, scratchEllipseGeometry);
            scratchOptions.center = Cartographic.Cartesian3.clone(ellipseGeometry._center, scratchOptions.center);
            scratchOptions.ellipsoid = Cartesian2.Ellipsoid.clone(ellipseGeometry._ellipsoid, scratchOptions.ellipsoid);
            scratchOptions.height = ellipseGeometry._height;
            scratchOptions.extrudedHeight = ellipseGeometry._extrudedHeight;
            scratchOptions.granularity = ellipseGeometry._granularity;
            scratchOptions.vertexFormat = VertexFormat.VertexFormat.clone(ellipseGeometry._vertexFormat, scratchOptions.vertexFormat);
            scratchOptions.stRotation = ellipseGeometry._stRotation;
            scratchOptions.shadowVolume = ellipseGeometry._shadowVolume;

            if (!when.defined(result)) {
                scratchOptions.radius = ellipseGeometry._semiMajorAxis;
                return new CircleGeometry(scratchOptions);
            }

            scratchOptions.semiMajorAxis = ellipseGeometry._semiMajorAxis;
            scratchOptions.semiMinorAxis = ellipseGeometry._semiMinorAxis;
            result._ellipseGeometry = new EllipseGeometry.EllipseGeometry(scratchOptions);
            return result;
        };

        /**
         * Computes the geometric representation of a circle on an ellipsoid, including its vertices, indices, and a bounding sphere.
         *
         * @param {CircleGeometry} circleGeometry A description of the circle.
         * @returns {Geometry|undefined} The computed vertices and indices.
         */
        CircleGeometry.createGeometry = function(circleGeometry) {
            return EllipseGeometry.EllipseGeometry.createGeometry(circleGeometry._ellipseGeometry);
        };

        /**
         * @private
         */
        CircleGeometry.createShadowVolume = function(circleGeometry, minHeightFunc, maxHeightFunc) {
            var granularity = circleGeometry._ellipseGeometry._granularity;
            var ellipsoid = circleGeometry._ellipseGeometry._ellipsoid;

            var minHeight = minHeightFunc(granularity, ellipsoid);
            var maxHeight = maxHeightFunc(granularity, ellipsoid);

            return new CircleGeometry({
                center : circleGeometry._ellipseGeometry._center,
                radius : circleGeometry._ellipseGeometry._semiMajorAxis,
                ellipsoid : ellipsoid,
                stRotation : circleGeometry._ellipseGeometry._stRotation,
                granularity : granularity,
                extrudedHeight : minHeight,
                height : maxHeight,
                vertexFormat : VertexFormat.VertexFormat.POSITION_ONLY,
                shadowVolume: true
            });
        };

        Object.defineProperties(CircleGeometry.prototype, {
            /**
             * @private
             */
            rectangle : {
                get : function() {
                    return this._ellipseGeometry.rectangle;
                }
            },
            /**
             * For remapping texture coordinates when rendering CircleGeometries as GroundPrimitives.
             * @private
             */
            textureCoordinateRotationPoints : {
                get : function() {
                    return this._ellipseGeometry.textureCoordinateRotationPoints;
                }
            }
        });

    function createCircleGeometry(circleGeometry, offset) {
        if (when.defined(offset)) {
            circleGeometry = CircleGeometry.unpack(circleGeometry, offset);
        }
        circleGeometry._ellipseGeometry._center = Cartographic.Cartesian3.clone(circleGeometry._ellipseGeometry._center);
        circleGeometry._ellipseGeometry._ellipsoid = Cartesian2.Ellipsoid.clone(circleGeometry._ellipseGeometry._ellipsoid);
        return CircleGeometry.createGeometry(circleGeometry);
    }

    return createCircleGeometry;

});

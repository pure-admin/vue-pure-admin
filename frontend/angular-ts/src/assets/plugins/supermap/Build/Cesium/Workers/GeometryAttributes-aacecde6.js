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
define(['exports', './when-8d13db60'], function (exports, when) { 'use strict';

    /**
         * Attributes, which make up a geometry's vertices.  Each property in this object corresponds to a
         * {@link GeometryAttribute} containing the attribute's data.
         * <p>
         * Attributes are always stored non-interleaved in a Geometry.
         * </p>
         *
         * @alias GeometryAttributes
         * @constructor
         */
        function GeometryAttributes(options) {
            options = when.defaultValue(options, when.defaultValue.EMPTY_OBJECT);

            /**
             * The 3D position attribute.
             * <p>
             * 64-bit floating-point (for precision).  3 components per attribute.
             * </p>
             *
             * @type GeometryAttribute
             *
             * @default undefined
             */
            this.position = options.position;

            /**
             * The normal attribute (normalized), which is commonly used for lighting.
             * <p>
             * 32-bit floating-point.  3 components per attribute.
             * </p>
             *
             * @type GeometryAttribute
             *
             * @default undefined
             */
            this.normal = options.normal;

            /**
             * The 2D texture coordinate attribute.
             * <p>
             * 32-bit floating-point.  2 components per attribute
             * </p>
             *
             * @type GeometryAttribute
             *
             * @default undefined
             */
            this.st = options.st;

            /**
             * The bitangent attribute (normalized), which is used for tangent-space effects like bump mapping.
             * <p>
             * 32-bit floating-point.  3 components per attribute.
             * </p>
             *
             * @type GeometryAttribute
             *
             * @default undefined
             */
            this.bitangent = options.bitangent;

            /**
             * The tangent attribute (normalized), which is used for tangent-space effects like bump mapping.
             * <p>
             * 32-bit floating-point.  3 components per attribute.
             * </p>
             *
             * @type GeometryAttribute
             *
             * @default undefined
             */
            this.tangent = options.tangent;

            /**
             * The color attribute.
             * <p>
             * 8-bit unsigned integer. 4 components per attribute.
             * </p>
             *
             * @type GeometryAttribute
             *
             * @default undefined
             */
            this.color = options.color;
        }

    exports.GeometryAttributes = GeometryAttributes;

});

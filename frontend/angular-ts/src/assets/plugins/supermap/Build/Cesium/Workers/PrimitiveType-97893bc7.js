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
define(['exports', './WebGLConstants-4c11ee5f'], function (exports, WebGLConstants) { 'use strict';

    /**
         * The type of a geometric primitive, i.e., points, lines, and triangles.
         *
         * @exports PrimitiveType
         */
        var PrimitiveType = {
            /**
             * Points primitive where each vertex (or index) is a separate point.
             *
             * @type {Number}
             * @constant
             */
            POINTS : WebGLConstants.WebGLConstants.POINTS,

            /**
             * Lines primitive where each two vertices (or indices) is a line segment.  Line segments are not necessarily connected.
             *
             * @type {Number}
             * @constant
             */
            LINES : WebGLConstants.WebGLConstants.LINES,

            /**
             * Line loop primitive where each vertex (or index) after the first connects a line to
             * the previous vertex, and the last vertex implicitly connects to the first.
             *
             * @type {Number}
             * @constant
             */
            LINE_LOOP : WebGLConstants.WebGLConstants.LINE_LOOP,

            /**
             * Line strip primitive where each vertex (or index) after the first connects a line to the previous vertex.
             *
             * @type {Number}
             * @constant
             */
            LINE_STRIP : WebGLConstants.WebGLConstants.LINE_STRIP,

            /**
             * Triangles primitive where each three vertices (or indices) is a triangle.  Triangles do not necessarily share edges.
             *
             * @type {Number}
             * @constant
             */
            TRIANGLES : WebGLConstants.WebGLConstants.TRIANGLES,

            /**
             * Triangle strip primitive where each vertex (or index) after the first two connect to
             * the previous two vertices forming a triangle.  For example, this can be used to model a wall.
             *
             * @type {Number}
             * @constant
             */
            TRIANGLE_STRIP : WebGLConstants.WebGLConstants.TRIANGLE_STRIP,

            /**
             * Triangle fan primitive where each vertex (or index) after the first two connect to
             * the previous vertex and the first vertex forming a triangle.  For example, this can be used
             * to model a cone or circle.
             *
             * @type {Number}
             * @constant
             */
            TRIANGLE_FAN : WebGLConstants.WebGLConstants.TRIANGLE_FAN,

            /**
             * @private
             */
            validate : function(primitiveType) {
                return primitiveType === PrimitiveType.POINTS ||
                       primitiveType === PrimitiveType.LINES ||
                       primitiveType === PrimitiveType.LINE_LOOP ||
                       primitiveType === PrimitiveType.LINE_STRIP ||
                       primitiveType === PrimitiveType.TRIANGLES ||
                       primitiveType === PrimitiveType.TRIANGLE_STRIP ||
                       primitiveType === PrimitiveType.TRIANGLE_FAN;
            }
        };
    var PrimitiveType$1 = Object.freeze(PrimitiveType);

    exports.PrimitiveType = PrimitiveType$1;

});

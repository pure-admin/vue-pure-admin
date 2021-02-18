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
define(['exports', './Math-61ede240'], function (exports, _Math) { 'use strict';

    /**
         * @private
         */
        var CylinderGeometryLibrary = {};

        /**
         * @private
         */
        CylinderGeometryLibrary.computePositions = function(length, topRadius, bottomRadius, slices, fill){
            var topZ = length * 0.5;
            var bottomZ = -topZ;

            var twoSlice = slices + slices;
            var size = (fill) ? 2 * twoSlice : twoSlice;
            var positions = new Float64Array(size*3);
            var i;
            var index = 0;
            var tbIndex = 0;
            var bottomOffset = (fill) ? twoSlice*3 : 0;
            var topOffset = (fill) ? (twoSlice + slices)*3 : slices*3;

            for (i = 0; i < slices; i++) {
                var angle = i / slices * _Math.CesiumMath.TWO_PI;
                var x = Math.cos(angle);
                var y = Math.sin(angle);
                var bottomX = x * bottomRadius;
                var bottomY = y * bottomRadius;
                var topX = x * topRadius;
                var topY = y * topRadius;

                positions[tbIndex + bottomOffset] = bottomX;
                positions[tbIndex + bottomOffset + 1] = bottomY;
                positions[tbIndex + bottomOffset + 2] = bottomZ;

                positions[tbIndex + topOffset] = topX;
                positions[tbIndex + topOffset + 1] = topY;
                positions[tbIndex + topOffset + 2] = topZ;
                tbIndex += 3;
                if (fill) {
                    positions[index++] = bottomX;
                    positions[index++] = bottomY;
                    positions[index++] = bottomZ;
                    positions[index++] = topX;
                    positions[index++] = topY;
                    positions[index++] = topZ;
                }
            }

            return positions;
        };

    exports.CylinderGeometryLibrary = CylinderGeometryLibrary;

});

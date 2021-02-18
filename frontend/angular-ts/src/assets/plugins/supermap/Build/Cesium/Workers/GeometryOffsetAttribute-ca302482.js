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
define(['exports', './when-8d13db60', './Check-70bec281'], function (exports, when, Check) { 'use strict';

    /**
         * Fill an array or a portion of an array with a given value.
         *
         * @param {Array} array The array to fill.
         * @param {*} value The value to fill the array with.
         * @param {Number} [start=0] The index to start filling at.
         * @param {Number} [end=array.length] The index to end stop at.
         *
         * @returns {Array} The resulting array.
         * @private
         */
        function arrayFill(array, value, start, end) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('array', array);
            Check.Check.defined('value', value);
            if (when.defined(start)) {
                Check.Check.typeOf.number('start', start);
            }
            if (when.defined(end)) {
                Check.Check.typeOf.number('end', end);
            }
            //>>includeEnd('debug');

            if (typeof array.fill === 'function') {
                return array.fill(value, start, end);
            }

            var length = array.length >>> 0;
            var relativeStart = when.defaultValue(start, 0);
            // If negative, find wrap around position
            var k = (relativeStart < 0) ? Math.max(length + relativeStart, 0) : Math.min(relativeStart, length);
            var relativeEnd = when.defaultValue(end, length);
            // If negative, find wrap around position
            var last = (relativeEnd < 0) ? Math.max(length + relativeEnd, 0) : Math.min(relativeEnd, length);

            // Fill array accordingly
            while (k < last) {
                array[k] = value;
                k++;
            }
            return array;
        }

    /**
         * Represents which vertices should have a value of `true` for the `applyOffset` attribute
         * @private
         */
        var GeometryOffsetAttribute = {
            NONE : 0,
            TOP : 1,
            ALL : 2
        };
    var GeometryOffsetAttribute$1 = Object.freeze(GeometryOffsetAttribute);

    exports.GeometryOffsetAttribute = GeometryOffsetAttribute$1;
    exports.arrayFill = arrayFill;

});

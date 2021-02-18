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
define(['exports', './when-8d13db60', './Check-70bec281', './Math-61ede240'], function (exports, when, Check, _Math) { 'use strict';

    var removeDuplicatesEpsilon = _Math.CesiumMath.EPSILON10;

        /**
         * Removes adjacent duplicate values in an array of values.
         *
         * @param {Array.<*>} [values] The array of values.
         * @param {Function} equalsEpsilon Function to compare values with an epsilon. Boolean equalsEpsilon(left, right, epsilon).
         * @param {Boolean} [wrapAround=false] Compare the last value in the array against the first value.
         * @returns {Array.<*>|undefined} A new array of values with no adjacent duplicate values or the input array if no duplicates were found.
         *
         * @example
         * // Returns [(1.0, 1.0, 1.0), (2.0, 2.0, 2.0), (3.0, 3.0, 3.0), (1.0, 1.0, 1.0)]
         * var values = [
         *     new Cesium.Cartesian3(1.0, 1.0, 1.0),
         *     new Cesium.Cartesian3(1.0, 1.0, 1.0),
         *     new Cesium.Cartesian3(2.0, 2.0, 2.0),
         *     new Cesium.Cartesian3(3.0, 3.0, 3.0),
         *     new Cesium.Cartesian3(1.0, 1.0, 1.0)];
         * var nonDuplicatevalues = Cesium.PolylinePipeline.removeDuplicates(values, Cartesian3.equalsEpsilon);
         *
         * @example
         * // Returns [(1.0, 1.0, 1.0), (2.0, 2.0, 2.0), (3.0, 3.0, 3.0)]
         * var values = [
         *     new Cesium.Cartesian3(1.0, 1.0, 1.0),
         *     new Cesium.Cartesian3(1.0, 1.0, 1.0),
         *     new Cesium.Cartesian3(2.0, 2.0, 2.0),
         *     new Cesium.Cartesian3(3.0, 3.0, 3.0),
         *     new Cesium.Cartesian3(1.0, 1.0, 1.0)];
         * var nonDuplicatevalues = Cesium.PolylinePipeline.removeDuplicates(values, Cartesian3.equalsEpsilon, true);
         *
         * @private
         */
        function arrayRemoveDuplicates(values, equalsEpsilon, wrapAround) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('equalsEpsilon', equalsEpsilon);
            //>>includeEnd('debug');

            if (!when.defined(values)) {
                return undefined;
            }

            wrapAround = when.defaultValue(wrapAround, false);

            var length = values.length;
            if (length < 2) {
                return values;
            }

            var i;
            var v0;
            var v1;

            for (i = 1; i < length; ++i) {
                v0 = values[i - 1];
                v1 = values[i];
                if (equalsEpsilon(v0, v1, removeDuplicatesEpsilon)) {
                    break;
                }
            }

            if (i === length) {
                if (wrapAround && equalsEpsilon(values[0], values[values.length - 1], removeDuplicatesEpsilon)) {
                    return values.slice(1);
                }
                return values;
            }

            var cleanedvalues = values.slice(0, i);
            for (; i < length; ++i) {
                // v0 is set by either the previous loop, or the previous clean point.
                v1 = values[i];
                if (!equalsEpsilon(v0, v1, removeDuplicatesEpsilon)) {
                    cleanedvalues.push(v1);
                    v0 = v1;
                }
            }

            if (wrapAround && cleanedvalues.length > 1 && equalsEpsilon(cleanedvalues[0], cleanedvalues[cleanedvalues.length - 1], removeDuplicatesEpsilon)) {
                cleanedvalues.shift();
            }

            return cleanedvalues;
        }

    exports.arrayRemoveDuplicates = arrayRemoveDuplicates;

});

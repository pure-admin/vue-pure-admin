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
define(['exports'], function (exports) { 'use strict';

    /**
         * @exports defined
         *
         * @param {*} value The object.
         * @returns {Boolean} Returns true if the object is defined, returns false otherwise.
         *
         * @example
         * if (Cesium.defined(positions)) {
         *      doSomething();
         * } else {
         *      doSomethingElse();
         * }
         */
        function defined(value) {
            return value !== undefined && value !== null;
        }

    exports.defined = defined;

});

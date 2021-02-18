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
         * ArcType defines the path that should be taken connecting vertices.
         *
         * @exports ArcType
         */
        var ArcType = {
            /**
             * Straight line that does not conform to the surface of the ellipsoid.
             *
             * @type {Number}
             * @constant
             */
            NONE : 0,

            /**
             * Follow geodesic path.
             *
             * @type {Number}
             * @constant
             */
            GEODESIC : 1,

            /**
             * Follow rhumb or loxodrome path.
             *
             * @type {Number}
             * @constant
             */
            RHUMB : 2
        };
    var ArcType$1 = Object.freeze(ArcType);

    exports.ArcType = ArcType$1;

});

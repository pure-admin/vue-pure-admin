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
define(['./when-8d13db60', './Check-70bec281', './Math-61ede240', './Cartographic-fe4be337', './Cartesian4-5af5bb24', './createTaskProcessorWorker'], function (when, Check, _Math, Cartographic, Cartesian4, createTaskProcessorWorker) { 'use strict';

    var packedDepthScale = new Cartesian4.Cartesian4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 160581375.0);
    var scratchPacked = new Cartesian4.Cartesian4();
    var TEXTURE_SIZE = 1024;

    function getShadowRadio(cartographic, bounds, extend, spacing, oriBottom, enuPoints, pixelsArray){
        var longitude = cartographic.longitude;
        var latitude = cartographic.latitude;
        var height = cartographic.height;

        longitude = _Math.CesiumMath.toDegrees(longitude);
        latitude = _Math.CesiumMath.toDegrees(latitude);

        if(longitude < bounds[0] || longitude > bounds[2] ||
            latitude < bounds[1] || latitude > bounds[3]){
            return -1;
        }

        var bUsed = false;
        var nTexIndex = 0;
        var minDist = spacing * 0.1;
        for(var bottom = 0.0; bottom <= extend; bottom += spacing){
            if(Math.abs(oriBottom + bottom - height) < minDist){
                bUsed = true;
                break;
            }
            nTexIndex++;
        }

        if(!bUsed){
            return -1;
        }

        if(enuPoints.length < 0){
            return -1;
        }

        bUsed = false;
        for(var i = 0; i < enuPoints.length; i+=2){
            var pos1 = Cartographic.Cartesian3.fromDegrees(longitude, latitude, height);
            var pos2 = Cartographic.Cartesian3.fromDegrees(enuPoints[i + 0], enuPoints[i + 1], height);
            var dis = Cartographic.Cartesian3.distance(pos1, pos2);
            if(dis < minDist){
                bUsed = true;
                break;
            }
        }

        if(!bUsed){
            return -1;
        }

        var width = bounds[2] - bounds[0];
        var height = bounds[3] - bounds[1];
        var left = bounds[0] - width * 0.025;
        var right = bounds[1] - height * 0.025;
        width += width * 0.05;
        height += height * 0.05;

        var xTexcoord = parseInt((longitude - left) / width * TEXTURE_SIZE);
        var yTexcoord = parseInt((latitude - right) / height * TEXTURE_SIZE);
        xTexcoord = xTexcoord < 1 ? 1 : xTexcoord;
        yTexcoord = yTexcoord < 1 ? 1 : yTexcoord;

        var pixels = pixelsArray[nTexIndex];
        var result = 0;
        for(var i = -1; i < 2; i++){
            for(var j = -1; j < 2; j++){
                var offset = (TEXTURE_SIZE * (yTexcoord + j) + (xTexcoord + i)) * 4;
                scratchPacked.x = pixels[offset];
                scratchPacked.y = pixels[offset + 1];
                scratchPacked.z = pixels[offset + 2];
                scratchPacked.w = pixels[offset + 3];
                Cartesian4.Cartesian4.divideByScalar(scratchPacked, 255.0, scratchPacked);
                result = Math.max(result, Cartesian4.Cartesian4.dot(scratchPacked, packedDepthScale));
            }
        }

        result = result > 0.999 ? 1.0 : result;
        return result;
    }

    function computeShadowRatio(parameters, transferableObjects) {
        var points = parameters.points;
        var enuPoints = parameters.enuPoints;
        var bounds = parameters.bounds;
        var extend = parameters.extend;
        var spacing = parameters.spacing;
        var bottom = parameters.bottom;
        var pixelsArray = parameters.pixelsArray;
        var result = [];
        for(var j = 0,len = points.length;j < len;j++){
            var p = points[j];
            var cartographic = Cartographic.Cartographic.fromCartesian(p);
            var ratio = getShadowRadio(cartographic, bounds, extend, spacing, bottom, enuPoints, pixelsArray);
            result.push({
                position : Cartographic.Cartesian3.clone(p),
                shadowRatio : ratio
            });
        }
        return {
            resultData : result
        };
    }

    var computeShadowRatio$1 = createTaskProcessorWorker(computeShadowRatio);

    return computeShadowRatio$1;

});

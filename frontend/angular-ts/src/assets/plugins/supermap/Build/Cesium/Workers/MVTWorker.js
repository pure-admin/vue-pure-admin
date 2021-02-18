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
define(['./when-8d13db60', './Check-70bec281', './Math-61ede240', './FeatureDetection-7bd32c34', './createTaskProcessorWorker', './Color-69f1845f', './pbf-9fe59c76'], function (when, Check, _Math, FeatureDetection, createTaskProcessorWorker, Color, pbf) { 'use strict';

    // 用来根据Mapbox style标准构建过滤器和定义过滤方法
    function MvtFilter() {
    }

    /**
     * 根据根据Mapbox style的过滤器对象构造过滤条件
     * @param filter 输入过滤器
     * @returns 返回过滤条件数组
     */
    MvtFilter.parseLayerFilter = function(filter) {
        if (!when.defined(filter) || !(filter instanceof Array)) {
            return null;
        }

        var filterArray = [];
        var condition;
        if (isOperator(filter[0])) {
            condition = parseSingleFilterArray(filter);
            if(when.defined(condition)){
                filterArray.push(condition);
            }
        }
        else{
            for (var fi = 0; fi < filter.length; fi++) {
                if (!(filter[fi] instanceof Array)) {
                    continue;
                }

                if (filter[fi].length !== 3) {
                    for (var fj = 0; fj < filter[fi].length; fj++) {
                        if (filter[fi][fj] instanceof Array && filter[fi][fj].length === 3) {
                            condition = parseSingleFilterArray(filter[fi][fj]);
                            if(when.defined(condition)){
                                filterArray.push(condition);
                            }
                        }
                    }
                } else {
                    condition = parseSingleFilterArray(filter[fi]);
                    if(when.defined(condition)){
                        filterArray.push(condition);
                    }
                }

            }
        }
        return filterArray;
    };

    /**
     * 根据对象的属性进行过滤条件测试
     * @param filterArray 过滤条件数组
     * @param properties 对象属性
     * @returns 通过过滤条件返回true
     */
    MvtFilter.filterTest = function(properties, filterArray) {
        for(var filterIdx = 0, filterCount = filterArray.length; filterIdx < filterCount; filterIdx++){
            var filter = filterArray[filterIdx];
            if(!compareFunctions[filter.filterOperator](properties, filter.filterFieldName, filter.filterCompareValue)){
                return false;
            }
        }
        return true;
    };

    function parseSingleFilterArray(filterArray){
        var filterCompareValue = null;
        var filterFieldName = null;
        var filterOperator = null;
        if (isOperator(filterArray[0])) {
            filterOperator = filterArray[0];
        }
        else{
            return null;
        }

        if(filterArray.length > 1){
            filterFieldName = filterArray[1];
            // TODO: 系统字段暂不处理
            if(filterFieldName[0] === "$" ){
                return null;
            }
        }
        if(filterArray.length > 2){
            filterCompareValue = filterArray[2];
        }
        return {
            filterOperator : filterOperator,
            filterFieldName : filterFieldName,
            filterCompareValue : filterCompareValue
        };
    }

    function isOperator(key) {
        return ["==", "===", ">=", "<=", ">", "<", "!=", "has"].indexOf(key) !== -1;
    }

    function equalFunction(properties, fieldName, testValue){
        return properties[fieldName] == testValue;
    }

    function greaterFunction(properties, fieldName, testValue){
        return properties[fieldName] > testValue;
    }

    function lessFunction(properties, fieldName, testValue){
        return properties[fieldName] < testValue;
    }

    function greaterEqualFunction(properties, fieldName, testValue){
        return properties[fieldName] >= testValue;
    }

    function lessEqualFunction(properties, fieldName, testValue){
        return properties[fieldName] <= testValue;
    }

    function notEqualFunction(properties, fieldName, testValue){
        return properties[fieldName] != testValue;
    }

    function hasFunction(properties, fieldName){
        return when.defined(properties[fieldName]);
    }

    var compareFunctions = {
        "==" : equalFunction,
        "===" : equalFunction,
        ">" : greaterFunction,
        "<" : lessFunction,
        ">=" : greaterEqualFunction,
        "<=" : lessEqualFunction,
        "!=" : notEqualFunction,
        "has" : hasFunction
    };

    function MvtStyle(openlayer, useOffscreen) {
        if(!openlayer){
            throw new Check.DeveloperError('need include ol-debug.js');
        }
        this._useOffscreen = useOffscreen;
        this._openlayer = openlayer;
    }

    Object.defineProperties(MvtStyle.prototype, {
        proxy: {
            get: function() {}
        }
    });

    MvtStyle.prototype.getStyle = function() {
        var openlayer = this._openlayer;
        var fill = new openlayer.style.Fill({
            color: ""
        });
        fill.setColor("#ffffff");

        var stroke = new openlayer.style.Stroke({
            color: "",
            width: 1
        });
        stroke.setWidth(1);
        stroke.setColor("#000000");

        var fillAndOutlineStyle = new openlayer.style.Style({
            fill: fill,
            stroke: stroke
        });

        return fillAndOutlineStyle;
    };

    function parseMapboxColorString(colorString){
        var tempS = colorString.substring(colorString.indexOf("(") + 1, colorString.indexOf(")"));
        tempS = tempS.split(",");
        var resultColor = [];
        resultColor.push(parseFloat(tempS[0]));
        resultColor.push(parseFloat(tempS[1]));
        resultColor.push(parseFloat(tempS[2]));
        resultColor.push(parseFloat(tempS[3]));
        return resultColor;
    }

    function colorWithOpacity(color, opacity) {
        if (color && opacity !== undefined) {
            var colorData = {
                color: [
                    color[0] * 255 / color[3],
                    color[1] * 255 / color[3],
                    color[2] * 255 / color[3],
                    color[3]
                ],
                opacity: color[3]
            };
            color = colorData.color;
            color[3] = colorData.opacity * opacity;
            if (color[3] === 0) {
                color = undefined;
            }
        }
        return color;
    }

    MvtStyle.prototype.getStyleByMapboxStyle = function(mapboxStyle) {
        var openlayer = this._openlayer;
        var type = mapboxStyle.type;
        var paint = mapboxStyle.paint;
        var layout = mapboxStyle.layout;
        if(!when.defined(type) || !when.defined(paint)){
            return this.getStyle();
        }
        if(type == "fill"){
            var fillStyle = new openlayer.style.Style({
            });
            var fill = new openlayer.style.Fill({
                color: "[255,255,255,1]"
            });
            fillStyle.setFill(fill);
            var fillOpcatiy = paint["fill-opacity"];
            if (when.defined(paint["fill-color"])) {
                var fillColor = parseMapboxColorString(paint["fill-color"]);
                if(when.defined(fillOpcatiy)){
                    fillColor[3] *= fillOpcatiy;
                }
                fill.setColor(fillColor);
            }
            if (when.defined(paint["fill-outline-color"])) {
                var fillOutlineStroke = new openlayer.style.Stroke({
                    color: "",
                    width: 1
                });
                fillOutlineStroke.setColor(paint["fill-outline-color"]);
                fillStyle.setStroke(fillOutlineStroke);
            }
            if (when.defined(paint["fill-pattern"])) {
                fillStyle.fillPatternName = paint["fill-pattern"];
            }
            return fillStyle;
        }
        else if(type == "line"){
            var lineStyle = new openlayer.style.Style({
            });
            var lineStroke = new openlayer.style.Stroke({
                color: "#000000",
                width: 1
            });
            lineStyle.setStroke(lineStroke);
            var lineOpcatiy = paint["line-opacity"];
            if (when.defined(paint["line-color"])) {
                var lineColor = parseMapboxColorString(paint["line-color"]);
                if(when.defined(lineOpcatiy)){
                    lineColor[3] *= lineOpcatiy;
                }
            }
            if (when.defined(paint["line-width"])) {
                var lineWidth = paint["line-width"];
                lineStroke.setWidth(lineWidth);
            }

            if (when.defined(paint["line-dasharray"])) {
                var lineDasharray = paint["line-dasharray"];
                lineStroke.setLineDash(lineDasharray);
            }

            if(when.defined(layout)){
                if (when.defined(layout["line-cap"])) {
                    var lineCap = layout["line-cap"];
                    lineStroke.setLineCap(lineCap);
                }
                if (when.defined(layout["line-join"])) {
                    var lineJoin = layout["line-join"];
                    lineStroke.setLineJoin(lineJoin);
                }
                if (when.defined(layout["line-miter-limit"])) {
                    var lineMiterLimit = layout["line-miter-limit"];
                    lineStroke.setMiterLimit(lineMiterLimit);
                }
            }

            lineStroke.setColor(lineColor);
            return lineStyle;
        }
        else if(type == "symbol"){
            var iconStyle = new openlayer.style.Style({
            });
            if(when.defined(layout) && when.defined(layout["icon-image"])){
                iconStyle.hasIconImage = true;
            }
            if(when.defined(layout) && when.defined(layout["text-field"])){
                iconStyle.hasTextStyle = true;
            }
            return iconStyle;
        }
        else if(type == "circle"){
            var circleRadius = paint["circle-radius"];
            var circleColor = paint["circle-color"];
            var circleStrokeColor = paint["circle-stroke-color"];
            var circleOpacity = paint["circle-opacity"];
            var circleStrokeOpacity = paint["circle-stroke-opacity"];
            var circleStrokeWidth = paint["circle-stroke-width"];
            var iconImg = new openlayer.style.Circle({
                radius: circleRadius,
                stroke: circleStrokeWidth === 0 ? undefined : new openlayer.style.Stroke({
                    width: circleStrokeWidth,
                    color: colorWithOpacity(circleStrokeColor, circleStrokeOpacity)
                }),
                fill: new openlayer.style.Fill({
                    color: colorWithOpacity(circleColor, circleOpacity)
                })
            });
            var circleStyle = new openlayer.style.Style({
            });
            circleStyle.setImage(iconImg);
            return circleStyle;
        }
        else{
            return this.getStyle();
        }
    };

    var scratchIDColor = new Color.Color();
    function convertIDtoColor(id, layerID){
        var colorB = Math.floor(id / 65536);
        var d = id - colorB * 65536;
        var colorG = Math.floor(d / 256);
        var colorR = d - colorG * 256;
        var alpha = 1;
        scratchIDColor.red = colorR / 256;
        scratchIDColor.green = colorG / 256;
        scratchIDColor.blue = colorB / 256;
        scratchIDColor.alpha = alpha;
        return scratchIDColor;
    }

    MvtStyle.prototype.getIDColorStyle = function(geometryType, id, layerID, lineWidth, radius, lineWidthExpand) {
        var openlayer = this._openlayer;
        var idColor = convertIDtoColor(id);
        var cssColor = idColor.toCssColorString();
        if(geometryType ==  'LineString' || geometryType ==  'LinearRing' || geometryType ==  'MultiLineString'){
            var expandWidth = 4;
            if (when.defined(lineWidth)) {
                expandWidth = lineWidth * 2 + lineWidthExpand;
            }
            var scratchIDStroke = new openlayer.style.Stroke({
                color: "",
                width: expandWidth
            });
            scratchIDStroke.setColor(cssColor);
            return new openlayer.style.Style({
                stroke: scratchIDStroke
            });
        }
        else if(geometryType == 'Point' || geometryType == 'MultiPoint'){
            var iconImg = new openlayer.style.Circle({
                radius: (radius - 0.5),
                fill: new openlayer.style.Fill({
                    color: cssColor
                })
            });
            var circleStyle = new openlayer.style.Style({
            });
            circleStyle.setImage(iconImg);
            return circleStyle;
        }
        else{
            var scratchIDFill = new openlayer.style.Fill({
                color: ""
            });
            scratchIDFill.setColor(cssColor);
            var resultStyle = new openlayer.style.Style({
                fill: scratchIDFill
            });
            if(when.defined(lineWidth)){
                var scratchIDStroke = new openlayer.style.Stroke({
                    color: "",
                    width: when.defined(lineWidth) ? lineWidth * 2 : 4
                });
                scratchIDStroke.setColor(cssColor);
                resultStyle.setStroke(scratchIDStroke);
            }
            return resultStyle;
        }
    };

    var templateRegEx = /^([^]*)\{(.*)\}([^]*)$/;
    function fromTemplate(text, properties) {
        var parts;
        do {
            parts = text.match(templateRegEx);
            if (parts) {
                const value = properties[parts[2]] || '';
                text = parts[1] + value + parts[3];
            }
        } while (parts);
        return text;
    }

    MvtStyle.prototype.getTextStyle = function(oldStyle, feature, mapboxStyleLayer) {
        var openlayer = this._openlayer;
        var paint = mapboxStyleLayer.paint;
        var layout = mapboxStyleLayer.layout;
        var textField = layout['text-field'];
        var label = fromTemplate(textField, feature.getProperties());
        if(!when.defined(label)){
            return;
        }
        var style = new openlayer.style.Style();
        var text = new openlayer.style.Text();
        style.setText(text);
        var textSize = layout['text-size'];
        var font = when.defaultValue(layout['text-font'], ['Open Sans Regular', 'Arial Unicode MS Regular']);
        var textTransform = layout['text-transform'];
        if (textTransform == 'uppercase') {
            label = label.toUpperCase();
        } else if (textTransform == 'lowercase') {
            label = label.toLowerCase();
        }
        var textMaxWidth = when.defaultValue(layout['text-max-width'], 10);
        //var wrappedLabel = wrapText(label, font, textMaxWidth);
        var wrappedLabel = label;
        text.setText(wrappedLabel);
        text.setFont(font);
        text.setRotation(0);

        var textAnchor = when.defaultValue(layout['text-anchor'], 'center');
        var placement = when.defaultValue(layout['symbol-placement'], 'point');
        text.setPlacement(placement);
        if (placement == 'point') {
            var textAlign = 'center';
            if (textAnchor.indexOf('left') !== -1) {
                textAlign = 'left';
            } else if (textAnchor.indexOf('right') !== -1) {
                textAlign = 'right';
            }
            text.setTextAlign(textAlign);
        } else {
            text.setTextAlign();
        }
        var textBaseline = 'middle';
        if (textAnchor.indexOf('bottom') == 0) {
            textBaseline = 'bottom';
        } else if (textAnchor.indexOf('top') == 0) {
            textBaseline = 'top';
        }
        text.setTextBaseline(textBaseline);
        var textOffset = when.defaultValue(layout['text-offset'], [0.0, 0.0]);
        var textTranslate = when.defaultValue(layout['text-translate'], [0.0, 0.0]);
        text.setOffsetX(textOffset[0] * textSize + textTranslate[0]);
        text.setOffsetY(textOffset[1] * textSize + textTranslate[1]);
        var opacity = paint['text-opacity'];
        var textColorFill = new openlayer.style.Fill();
        var textColor = paint["text-color"];
        if(when.defined(textColor)){
            textColor = parseMapboxColorString(textColor);
            textColorFill.setColor(textColor);
        }
        text.setFill(textColorFill);
        var textHaloColor = paint["text-halo-color"];
        if (when.defined(textHaloColor)) {
            var textHalo = new openlayer.style.Stroke();
            textHaloColor = parseMapboxColorString(textHaloColor);
            textHalo.setColor(textHaloColor);
            textHalo.setWidth(paint['text-halo-width']);
            text.setStroke(textHalo);
        } else {
            text.setStroke(undefined);
        }
        style.setZIndex(oldStyle.getZIndex());
        style.hasIconImage = oldStyle.hasIconImage;
        style.textSize = textSize;
        return style;
    };

    function covertIconAnchor(iconAnchor) {
        var anchorOffset = [0.5, 0.5];
        if (['top-left', 'top-right', 'bottom-left', 'bottom-right'].includes(iconAnchor)) {
            anchorOffset = [0, 0];
        }
        if (iconAnchor === 'left') {
            iconAnchor = 'top-left';
            anchorOffset = [0, 0.5];
        }
        if (iconAnchor === 'right') {
            iconAnchor = 'top-left';
            anchorOffset = [1, 0.5];
        }
        if (iconAnchor === 'bottom') {
            iconAnchor = 'top-left';
            anchorOffset = [0.5, 1];
        }
        if (iconAnchor === 'top') {
            iconAnchor = 'top-left';
            anchorOffset = [0.5, 0];
        }
        return {
            anchorOffset: anchorOffset,
            iconAnchor: iconAnchor
        };
    }

    var iconImageCache = {};

    MvtStyle.prototype.setIconImageForStyle = function(spriteImageDatas, style, mapboxStyleLayer){
        var openlayer = this._openlayer;
        var paint = mapboxStyleLayer.paint;
        var layout = mapboxStyleLayer.layout;
        var iconSize = when.defaultValue(layout["icon-size"], 1);
        var iconColor = paint['icon-color'];
        var iconTranslate = when.defaultValue(paint['icon-translate'], [0.0, 0.0]);
        var iconTranslateAnchor = when.defaultValue(paint['icon-translate-anchor'], 'map');
        var iconAnchor = when.defaultValue(layout['icon-anchor'], 'center');
        var anchorOffsetAndIconAnchor = covertIconAnchor(iconAnchor);
        var anchorOffset = anchorOffsetAndIconAnchor.anchorOffset;
        var iconOffset = when.defaultValue(layout['iconoffset'], [0.0, 0.0]);
        var iconOpacity = when.defaultValue(layout['icon-opacity'], 1.0);
        var spriteImageName = layout["icon-image"];
        if(!when.defined(spriteImageDatas[spriteImageName])){
            console.log('miss icon-image ' + spriteImageName);
            return;
        }

        var icon_cache_key = spriteImageName + '.' + iconSize + '.' + iconTranslate + '.' + iconTranslateAnchor + '.' + iconAnchor + '.' + iconOffset;
        if (when.defined(iconColor)) {
            icon_cache_key += '.' + iconColor;
        }
        var iconImg = iconImageCache[icon_cache_key];
        if(!when.defined(iconImg)){
            var spriteImage = spriteImageDatas[spriteImageName];
            var canvas;
            if(this._useOffscreen){
                canvas = new OffscreenCanvas(spriteImage.width, spriteImage.height);
            }
            else{
                canvas = document.createElement('canvas');
                canvas.width = spriteImage.width;
                canvas.height = spriteImage.height;
            }
            var ctx = canvas.getContext('2d');
            ctx.putImageData(spriteImage, 0, 0);
            var translateOffset = [iconTranslate[0] / spriteImage.width, iconTranslate[1] / spriteImage.height];
            iconImg = new openlayer.style.Icon({
                img: canvas,
                anchorOrigin: anchorOffsetAndIconAnchor.iconAnchor,
                anchor: [iconOffset[0] + anchorOffset[0] + translateOffset[0], iconOffset[1] + anchorOffset[1] - translateOffset[1]],
                imgSize: [canvas.width, canvas.height],
                scale: iconSize
            });
            iconImg.setOpacity(iconOpacity);
            iconImageCache[icon_cache_key] = iconImg;
        }

        style.setImage(iconImg);
        //style.setText(undefined);
    };

    var VALUE_EXTENT = 4096;
    var replays = ["Default", "Polygon", "LineString", "Image", "Symbol", "Text"];

    function MvtRenderer2D(options) {
        this._mvtStyleClass = options.mvtStyle;
        this._openlayer = options.openlayer;
    }

    Object.defineProperties(MvtRenderer2D.prototype, {
    });

    MvtRenderer2D.prototype.renderFeatures = function(options) {
        var canvas = options.colorCanvas;
        var idCanvas = options.idCanvas;
        var transform = options.transform;
        var layers = options.layers;
        var features = options.features;
        var tileLevel = options.tileLevel;
        var spriteImageCanvas = options.spriteImageCanvas;
        var spriteImageDatas = options.spriteImageDatas;
        var squaredTolerance = options.squaredTolerance;
        var showBillboard = options.showBillboard;
        var renderID = options.renderID;
        var renderColor = options.renderColor;
        var lineWidthExpand = options.lineWidthExpand;

        var ol = this._openlayer;
        var ctx = canvas.getContext('2d');

        var idFeatures = [];
        var iconImageObjects = [];
        var textObjects = [];
        var style = null;
        var declutterTree = ol.ext.rbush(9);
        var replayGroup = new ol.render.canvas.ReplayGroup(0, [0, 0, VALUE_EXTENT, VALUE_EXTENT], 8, 2, true, declutterTree);

        var featureLength = features.length;
        for (var r = 0; r < featureLength; r++) {
            var feature = features[r];
            var sourceLayer = feature.getProperties().layer;
            feature.index = sourceLayer + feature.getId();
            var featureHasStyle = false;
            var layerGroupById = layers[sourceLayer];
            var zIndex = 0;
            for (var layerId in layerGroupById) {
                var layerById = layerGroupById[layerId];

                var maxzoom = layerById.mapboxStyleLayer.maxzoom;
                var minzoom = layerById.mapboxStyleLayer.minzoom;
                if(tileLevel < minzoom || tileLevel > maxzoom){
                    continue;
                }

                var filterArray = layerById.filterArray;
                if (!when.defined(filterArray)) {
                    style = this._mvtStyleClass.getStyleByMapboxStyle(layerById.mapboxStyleLayer);
                }
                else {
                    var properties = feature.getProperties();
                    if (MvtFilter.filterTest(properties, filterArray)) {
                        style = this._mvtStyleClass.getStyleByMapboxStyle(layerById.mapboxStyleLayer);
                    }
                    else {
                        continue;
                    }
                }

                if (!when.defined(style)) {
                    continue;
                }

                this.createFillPatternForStyle(style, spriteImageCanvas, spriteImageDatas, ctx);

                if (when.defined(style.hasTextStyle)) {
                    var textStyle = this._mvtStyleClass.getTextStyle(style, feature, layerById.mapboxStyleLayer);
                    textStyle.setZIndex(zIndex);
                    if(showBillboard){
                        textObjects.push({
                            feature : feature,
                            style : textStyle
                        });
                    }
                    else{
                        if(renderColor){
                            ol.renderer.vector.renderFeature_(replayGroup, feature, textStyle, -1);
                        }
                    }
                }

                if (when.defined(style.hasIconImage) && !when.defined(style.getImage())) {
                    if(showBillboard){
                        iconImageObjects.push({
                            feature : feature,
                            style : layerById.mapboxStyleLayer
                        });
                        continue;
                    }
                    else{
                        this._mvtStyleClass.setIconImageForStyle(spriteImageDatas, style, layerById.mapboxStyleLayer);
                    }
                }

                style.setZIndex(zIndex);
                this.setPickStyleInFeature(feature, style);
                zIndex++;

                if(renderColor){
                    ol.renderer.vector.renderFeature_(replayGroup, feature, style, -1);
                }
                featureHasStyle = true;
            }
            if (featureHasStyle) {
                idFeatures.push(feature);
            }
        }

        if(renderColor){
            replayGroup.finish();
            var declutterReplays = {};
            replayGroup.replay(ctx, transform, 0, {}, replays, declutterReplays);
            if (declutterReplays) {
                ol.render.canvas.ReplayGroup.replayDeclutter(declutterReplays, ctx, 0.0);
            }
        }

        replayGroup = null;
        if(renderID){
            this.renderIDtoTexture(transform, idCanvas, idFeatures, 0, squaredTolerance, lineWidthExpand);
        }
        return {
            idFeatures : idFeatures,
            iconImageObjects : iconImageObjects,
            textObjects : textObjects
        }
    };

    MvtRenderer2D.prototype.renderIDtoTexture = function(transform, canvas, features, layerID, tileTolerance, lineWidthExpand) {
        var ol = this._openlayer;
        var ctx = canvas.getContext('2d');
        var declutterTree = ol.ext.rbush(9);
        var replayGroup = new ol.render.canvas.ReplayGroup(0, [0, 0, VALUE_EXTENT, VALUE_EXTENT], 8, 2, true, declutterTree);
        var featureLength = features.length;
        for (var r = 0; r < featureLength; r++) {
            var feature = features[r];
            var id = getFeatureID(feature);
            var idStyle = this._mvtStyleClass.getIDColorStyle(feature.getGeometry().getType(), id, layerID, feature.lineWidth, feature.radius, lineWidthExpand);
            idStyle.setZIndex(feature.zIndex);
            ol.renderer.vector.renderFeature_(replayGroup, feature, idStyle, -1);
        }
        replayGroup.finish();
        var declutterReplays = {};
        replayGroup.replay(ctx, transform, 0, {}, replays, declutterReplays);
        if (declutterReplays) {
            ol.render.canvas.ReplayGroup.replayDeclutter(declutterReplays, ctx, 0.0);
        }
        replayGroup = null;
    };

    MvtRenderer2D.prototype.createFillPatternForStyle = function(style, spriteImageCanvas, subSpriteImage, ctx){
        if(!when.defined(style.fillPatternName)){
            return;
        }
        var patternName = style.fillPatternName;
        var patternCanvas = null;
        if (when.defined(spriteImageCanvas[patternName])) {
            patternCanvas = spriteImageCanvas[patternName];
        }
        else {
            var imageData = subSpriteImage[patternName];
            if (!when.defined(imageData)) {
                console.log('miss sprite ' + patternName);
                return;
            }
            patternCanvas = document.createElement('canvas');
            patternCanvas.width = imageData.width;
            patternCanvas.height = imageData.height;
            var spriteCtx = patternCanvas.getContext('2d');
            spriteCtx.putImageData(imageData, 0, 0);
            spriteImageCanvas[patternName] = patternCanvas;
        }
        style.fill_.color_ = ctx.createPattern(patternCanvas, 'repeat');
    };

    MvtRenderer2D.prototype.setPickStyleInFeature = function(feature, style){
        var ol = this._openlayer;
        feature.zIndex = style.getZIndex();
        if(when.defined(style.getStroke())){
            var styleLineWidth = style.getStroke().getWidth();
            if(when.defined(feature.lineWidth)){
                feature.lineWidth = Math.max(feature.lineWidth, styleLineWidth);
            }
            else{
                feature.lineWidth = styleLineWidth;
            }
        }
        if(when.defined(style.getImage())){
            var imageStyle = style.getImage();
            var radius = 1.0;
            if(imageStyle instanceof ol.style.Icon ){
                var imageSize = imageStyle.getImageSize();
                radius = Math.max(imageSize[0], imageSize[1]) / 2.0;
                radius -= 1.0;
            }
            else if(imageStyle instanceof ol.style.Circle ){
                radius = imageStyle.getRadius();
            }
            if(when.defined(feature.radius)){
                feature.radius = Math.max(feature.radius, radius);
            }
            else{
                feature.radius = radius;
            }
        }
    };

    function getFeatureID(feature) {
        var id = feature.getId();
        // 只在颜色中记录256*256*256这么大范围的ID，超过这个范围的ID舍去
        var discard = Math.floor(id / 16777216);
        id = id - discard * 16777216;
        return id;
    }

    function ol() {
        }

        ol.array = {};

        /**
         * Performs a binary search on the provided sorted list and returns the index of the item if found. If it can't be found it'll return -1.
         * https://github.com/darkskyapp/binary-search
         *
         * @param {Array.<*>} haystack Items to search through.
         * @param {*} needle The item to look for.
         * @param {Function=} opt_comparator Comparator function.
         * @return {number} The index of the item if found, -1 if not.
         */
        ol.array.binarySearch = function(haystack, needle, opt_comparator) {
            var mid, cmp;
            var comparator = opt_comparator || ol.array.numberSafeCompareFunction;
            var low = 0;
            var high = haystack.length;
            var found = false;

            while (low < high) {
                /* Note that "(low + high) >>> 1" may overflow, and results in a typecast
                 * to double (which gives the wrong results). */
                mid = low + (high - low >> 1);
                cmp = +comparator(haystack[mid], needle);

                if (cmp < 0.0) { /* Too low. */
                    low  = mid + 1;

                } else { /* Key found or too high */
                    high = mid;
                    found = !cmp;
                }
            }

            /* Key not found. */
            return found ? low : ~low;
        };


        /**
         * Compare function for array sort that is safe for numbers.
         * @param {*} a The first object to be compared.
         * @param {*} b The second object to be compared.
         * @return {number} A negative number, zero, or a positive number as the first
         *     argument is less than, equal to, or greater than the second.
         */
        ol.array.numberSafeCompareFunction = function(a, b) {
            return a > b ? 1 : a < b ? -1 : 0;
        };


        /**
         * Whether the array contains the given object.
         * @param {Array.<*>} arr The array to test for the presence of the element.
         * @param {*} obj The object for which to test.
         * @return {boolean} The object is in the array.
         */
        ol.array.includes = function(arr, obj) {
            return arr.indexOf(obj) >= 0;
        };


        /**
         * @param {Array.<number>} arr Array.
         * @param {number} target Target.
         * @param {number} direction 0 means return the nearest, > 0
         *    means return the largest nearest, < 0 means return the
         *    smallest nearest.
         * @return {number} Index.
         */
        ol.array.linearFindNearest = function(arr, target, direction) {
            var n = arr.length;
            if (arr[0] <= target) {
                return 0;
            } else if (target <= arr[n - 1]) {
                return n - 1;
            } else {
                var i;
                if (direction > 0) {
                    for (i = 1; i < n; ++i) {
                        if (arr[i] < target) {
                            return i - 1;
                        }
                    }
                } else if (direction < 0) {
                    for (i = 1; i < n; ++i) {
                        if (arr[i] <= target) {
                            return i;
                        }
                    }
                } else {
                    for (i = 1; i < n; ++i) {
                        if (arr[i] == target) {
                            return i;
                        } else if (arr[i] < target) {
                            if (arr[i - 1] - target < target - arr[i]) {
                                return i - 1;
                            } else {
                                return i;
                            }
                        }
                    }
                }
                return n - 1;
            }
        };


        /**
         * @param {Array.<*>} arr Array.
         * @param {number} begin Begin index.
         * @param {number} end End index.
         */
        ol.array.reverseSubArray = function(arr, begin, end) {
            while (begin < end) {
                var tmp = arr[begin];
                arr[begin] = arr[end];
                arr[end] = tmp;
                ++begin;
                --end;
            }
        };

        /**
         * @param {Array.<VALUE>} arr The array to modify.
         * @param {Array.<VALUE>|VALUE} data The elements or arrays of elements
         *     to add to arr.
         * @template VALUE
         */
        ol.array.extend = function(arr, data) {
            var i;
            var extension = Array.isArray(data) ? data : [data];
            var length = extension.length;
            for (i = 0; i < length; i++) {
                arr[arr.length] = extension[i];
            }
        };


        /**
         * @param {Array.<VALUE>} arr The array to modify.
         * @param {VALUE} obj The element to remove.
         * @template VALUE
         * @return {boolean} If the element was removed.
         */
        ol.array.remove = function(arr, obj) {
            var i = arr.indexOf(obj);
            var found = i > -1;
            if (found) {
                arr.splice(i, 1);
            }
            return found;
        };


        /**
         * @param {Array.<VALUE>} arr The array to search in.
         * @param {function(VALUE, number, ?) : boolean} func The function to compare.
         * @template VALUE
         * @return {VALUE} The element found.
         */
        ol.array.find = function(arr, func) {
            var length = arr.length >>> 0;
            var value;

            for (var i = 0; i < length; i++) {
                value = arr[i];
                if (func(value, i, arr)) {
                    return value;
                }
            }
            return null;
        };


        /**
         * @param {Array|Uint8ClampedArray} arr1 The first array to compare.
         * @param {Array|Uint8ClampedArray} arr2 The second array to compare.
         * @return {boolean} Whether the two arrays are equal.
         */
        ol.array.equals = function(arr1, arr2) {
            var len1 = arr1.length;
            if (len1 !== arr2.length) {
                return false;
            }
            for (var i = 0; i < len1; i++) {
                if (arr1[i] !== arr2[i]) {
                    return false;
                }
            }
            return true;
        };


        /**
         * @param {Array.<*>} arr The array to sort (modifies original).
         * @param {Function} compareFnc Comparison function.
         */
        ol.array.stableSort = function(arr, compareFnc) {
            var length = arr.length;
            var tmp = Array(arr.length);
            var i;
            for (i = 0; i < length; i++) {
                tmp[i] = {index: i, value: arr[i]};
            }
            tmp.sort(function(a, b) {
                return compareFnc(a.value, b.value) || a.index - b.index;
            });
            for (i = 0; i < arr.length; i++) {
                arr[i] = tmp[i].value;
            }
        };


        /**
         * @param {Array.<*>} arr The array to search in.
         * @param {Function} func Comparison function.
         * @return {number} Return index.
         */
        ol.array.findIndex = function(arr, func) {
            var index;
            var found = !arr.every(function(el, idx) {
                index = idx;
                return !func(el, idx, arr);
            });
            return found ? index : -1;
        };


        /**
         * @param {Array.<*>} arr The array to test.
         * @param {Function=} opt_func Comparison function.
         * @param {boolean=} opt_strict Strictly sorted (default false).
         * @return {boolean} Return index.
         */
        ol.array.isSorted = function(arr, opt_func, opt_strict) {
            var compare = opt_func || ol.array.numberSafeCompareFunction;
            return arr.every(function(currentVal, index) {
                if (index === 0) {
                    return true;
                }
                var res = compare(arr[index - 1], currentVal);
                return !(res > 0 || opt_strict && res === 0);
            });
        };


        ol.ASSUME_TOUCH = false;
        ol.DEFAULT_MAX_ZOOM = 42;
        ol.DEFAULT_MIN_ZOOM = 0;
        ol.DEFAULT_RASTER_REPROJECTION_ERROR_THRESHOLD = 0.5;
        ol.DEFAULT_TILE_SIZE = 256;
        ol.DEFAULT_WMS_VERSION = '1.3.0';
        ol.ENABLE_CANVAS = true;
        ol.ENABLE_PROJ4JS = true;
        ol.ENABLE_RASTER_REPROJECTION = true;
        ol.ENABLE_WEBGL = true;
        ol.DEBUG_WEBGL = true;
        ol.INITIAL_ATLAS_SIZE = 256;
        ol.MAX_ATLAS_SIZE = -1;
        ol.MOUSEWHEELZOOM_MAXDELTA = 1;
        ol.OVERVIEWMAP_MAX_RATIO = 0.75;
        ol.OVERVIEWMAP_MIN_RATIO = 0.1;
        ol.RASTER_REPROJECTION_MAX_SOURCE_TILES = 100;
        ol.RASTER_REPROJECTION_MAX_SUBDIVISION = 10;
        ol.RASTER_REPROJECTION_MAX_TRIANGLE_WIDTH = 0.25;
        ol.SIMPLIFY_TOLERANCE = 0.5;
        ol.WEBGL_TEXTURE_CACHE_HIGH_WATER_MARK = 1024;
        ol.VERSION = '';

        ol.inherits = function(childCtor, parentCtor) {
            childCtor.prototype = Object.create(parentCtor.prototype);
            childCtor.prototype.constructor = childCtor;
        };

        ol.nullFunction = function() {};

        ol.getUid = function(obj) {
            return obj.ol_uid ||
                (obj.ol_uid = ++ol.uidCounter_);
        };

        ol.asserts = {};
        ol.asserts.assert = function(assertion, errorCode) {
        };

        ol.has = {};

        var ua = typeof navigator !== 'undefined' ?
            navigator.userAgent.toLowerCase() : '';

        ol.has.FIREFOX = ua.indexOf('firefox') !== -1;
        ol.has.SAFARI = ua.indexOf('safari') !== -1 && ua.indexOf('chrom') == -1;
        ol.has.WEBKIT = ua.indexOf('webkit') !== -1 && ua.indexOf('edge') == -1;
        ol.has.MAC = ua.indexOf('macintosh') !== -1;
        ol.has.DEVICE_PIXEL_RATIO = 1;
        ol.has.CANVAS_LINE_DASH = true;

        ol.structs = {};

        /**
         * @enum {string}
         */
        ol.CollectionEventType = {
            ADD: 'add',
            REMOVE: 'remove'
        };

        /**
         * @enum {string}
         */
        ol.ObjectEventType = {
            PROPERTYCHANGE: 'propertychange'
        };

        ol.events = {};

        /**
         * @param {ol.EventsKey} listenerObj Listener object.
         * @return {ol.EventsListenerFunctionType} Bound listener.
         */
        ol.events.bindListener_ = function(listenerObj) {
            var boundListener = function(evt) {
                var listener = listenerObj.listener;
                var bindTo = listenerObj.bindTo || listenerObj.target;
                if (listenerObj.callOnce) {
                    ol.events.unlistenByKey(listenerObj);
                }
                return listener.call(bindTo, evt);
            };
            listenerObj.boundListener = boundListener;
            return boundListener;
        };

        ol.events.findListener_ = function(listeners, listener, opt_this,
                                           opt_setDeleteIndex) {
            var listenerObj;
            for (var i = 0, ii = listeners.length; i < ii; ++i) {
                listenerObj = listeners[i];
                if (listenerObj.listener === listener &&
                    listenerObj.bindTo === opt_this) {
                    if (opt_setDeleteIndex) {
                        listenerObj.deleteIndex = i;
                    }
                    return listenerObj;
                }
            }
            return undefined;
        };


        /**
         * @param {ol.EventTargetLike} target Target.
         * @param {string} type Type.
         * @return {Array.<ol.EventsKey>|undefined} Listeners.
         */
        ol.events.getListeners = function(target, type) {
            var listenerMap = target.ol_lm;
            return listenerMap ? listenerMap[type] : undefined;
        };


        /**
         * Get the lookup of listeners.  If one does not exist on the target, it is
         * created.
         * @param {ol.EventTargetLike} target Target.
         * @return {!Object.<string, Array.<ol.EventsKey>>} Map of
         *     listeners by event type.
         * @private
         */
        ol.events.getListenerMap_ = function(target) {
            var listenerMap = target.ol_lm;
            if (!listenerMap) {
                listenerMap = target.ol_lm = {};
            }
            return listenerMap;
        };


        /**
         * Clean up all listener objects of the given type.  All properties on the
         * listener objects will be removed, and if no listeners remain in the listener
         * map, it will be removed from the target.
         * @param {ol.EventTargetLike} target Target.
         * @param {string} type Type.
         * @private
         */
        ol.events.removeListeners_ = function(target, type) {
            var listeners = ol.events.getListeners(target, type);
            if (listeners) {
                for (var i = 0, ii = listeners.length; i < ii; ++i) {
                    target.removeEventListener(type, listeners[i].boundListener);
                    ol.obj.clear(listeners[i]);
                }
                listeners.length = 0;
                var listenerMap = target.ol_lm;
                if (listenerMap) {
                    delete listenerMap[type];
                    if (Object.keys(listenerMap).length === 0) {
                        delete target.ol_lm;
                    }
                }
            }
        };

        ol.events.listen = function(target, type, listener, opt_this, opt_once) {
            var listenerMap = ol.events.getListenerMap_(target);
            var listeners = listenerMap[type];
            if (!listeners) {
                listeners = listenerMap[type] = [];
            }
            var listenerObj = ol.events.findListener_(listeners, listener, opt_this,
                false);
            if (listenerObj) {
                if (!opt_once) {
                    // Turn one-off listener into a permanent one.
                    listenerObj.callOnce = false;
                }
            } else {
                listenerObj = /** @type {ol.EventsKey} */ ({
                    bindTo: opt_this,
                    callOnce: !!opt_once,
                    listener: listener,
                    target: target,
                    type: type
                });
                target.addEventListener(type, ol.events.bindListener_(listenerObj));
                listeners.push(listenerObj);
            }

            return listenerObj;
        };

        ol.events.listenOnce = function(target, type, listener, opt_this) {
            return ol.events.listen(target, type, listener, opt_this, true);
        };

        ol.events.unlisten = function(target, type, listener, opt_this) {
            var listeners = ol.events.getListeners(target, type);
            if (listeners) {
                var listenerObj = ol.events.findListener_(listeners, listener, opt_this,
                    true);
                if (listenerObj) {
                    ol.events.unlistenByKey(listenerObj);
                }
            }
        };

        ol.events.unlistenByKey = function(key) {
            if (key && key.target) {
                key.target.removeEventListener(key.type, key.boundListener);
                var listeners = ol.events.getListeners(key.target, key.type);
                if (listeners) {
                    var i = 'deleteIndex' in key ? key.deleteIndex : listeners.indexOf(key);
                    if (i !== -1) {
                        listeners.splice(i, 1);
                    }
                    if (listeners.length === 0) {
                        ol.events.removeListeners_(key.target, key.type);
                    }
                }
                ol.obj.clear(key);
            }
        };

        ol.events.unlistenAll = function(target) {
            var listenerMap = ol.events.getListenerMap_(target);
            for (var type in listenerMap) {
                ol.events.removeListeners_(target, type);
            }
        };

        /**
         * Objects that need to clean up after themselves.
         * @constructor
         */
        ol.Disposable = function() {};

        ol.Disposable.prototype.disposed_ = false;

        ol.Disposable.prototype.dispose = function() {
            if (!this.disposed_) {
                this.disposed_ = true;
                this.disposeInternal();
            }
        };

        ol.Disposable.prototype.disposeInternal = ol.nullFunction;

        ol.events.Event = {};

        ol.events.Event = function(type) {
            this.propagationStopped;
            this.type = type;
            this.target = null;
        };

        ol.events.Event.prototype.preventDefault =

        /**
         * Stop event propagation.
         * @function
         * @override
         * @api
         */
            ol.events.Event.prototype.stopPropagation = function() {
                this.propagationStopped = true;
            };


        /**
         * @param {Event|ol.events.Event} evt Event
         */
        ol.events.Event.stopPropagation = function(evt) {
            evt.stopPropagation();
        };


        /**
         * @param {Event|ol.events.Event} evt Event
         */
        ol.events.Event.preventDefault = function(evt) {
            evt.preventDefault();
        };

        ol.events.EventTarget = {};

        ol.events.EventTarget = function() {
            ol.Disposable.call(this);
            this.pendingRemovals_ = {};
            this.dispatching_ = {};
            this.listeners_ = {};

        };
        ol.inherits(ol.events.EventTarget, ol.Disposable);


        /**
         * @param {string} type Type.
         * @param {ol.EventsListenerFunctionType} listener Listener.
         */
        ol.events.EventTarget.prototype.addEventListener = function(type, listener) {
            var listeners = this.listeners_[type];
            if (!listeners) {
                listeners = this.listeners_[type] = [];
            }
            if (listeners.indexOf(listener) === -1) {
                listeners.push(listener);
            }
        };

        ol.events.EventTarget.prototype.dispatchEvent = function(event) {
            var evt = typeof event === 'string' ? new ol.events.Event(event) : event;
            var type = evt.type;
            evt.target = this;
            var listeners = this.listeners_[type];
            var propagate;
            if (listeners) {
                if (!(type in this.dispatching_)) {
                    this.dispatching_[type] = 0;
                    this.pendingRemovals_[type] = 0;
                }
                ++this.dispatching_[type];
                for (var i = 0, ii = listeners.length; i < ii; ++i) {
                    if (listeners[i].call(this, evt) === false || evt.propagationStopped) {
                        propagate = false;
                        break;
                    }
                }
                --this.dispatching_[type];
                if (this.dispatching_[type] === 0) {
                    var pendingRemovals = this.pendingRemovals_[type];
                    delete this.pendingRemovals_[type];
                    while (pendingRemovals--) {
                        this.removeEventListener(type, ol.nullFunction);
                    }
                    delete this.dispatching_[type];
                }
                return propagate;
            }
        };


        /**
         * @inheritDoc
         */
        ol.events.EventTarget.prototype.disposeInternal = function() {
            ol.events.unlistenAll(this);
        };


        /**
         * Get the listeners for a specified event type. Listeners are returned in the
         * order that they will be called in.
         *
         * @param {string} type Type.
         * @return {Array.<ol.EventsListenerFunctionType>} Listeners.
         */
        ol.events.EventTarget.prototype.getListeners = function(type) {
            return this.listeners_[type];
        };


        /**
         * @param {string=} opt_type Type. If not provided,
         *     `true` will be returned if this EventTarget has any listeners.
         * @return {boolean} Has listeners.
         */
        ol.events.EventTarget.prototype.hasListener = function(opt_type) {
            return opt_type ?
                opt_type in this.listeners_ :
                Object.keys(this.listeners_).length > 0;
        };


        /**
         * @param {string} type Type.
         * @param {ol.EventsListenerFunctionType} listener Listener.
         */
        ol.events.EventTarget.prototype.removeEventListener = function(type, listener) {
            var listeners = this.listeners_[type];
            if (listeners) {
                var index = listeners.indexOf(listener);
                if (type in this.pendingRemovals_) {
                    // make listener a no-op, and remove later in #dispatchEvent()
                    listeners[index] = ol.nullFunction;
                    ++this.pendingRemovals_[type];
                } else {
                    listeners.splice(index, 1);
                    if (listeners.length === 0) {
                        delete this.listeners_[type];
                    }
                }
            }
        };

        /**
         * @enum {string}
         * @const
         */
        ol.events.EventType = {
            CHANGE: 'change',
            CLEAR: 'clear',
            CLICK: 'click',
            DBLCLICK: 'dblclick',
            DRAGENTER: 'dragenter',
            DRAGOVER: 'dragover',
            DROP: 'drop',
            ERROR: 'error',
            KEYDOWN: 'keydown',
            KEYPRESS: 'keypress',
            LOAD: 'load',
            MOUSEDOWN: 'mousedown',
            MOUSEMOVE: 'mousemove',
            MOUSEOUT: 'mouseout',
            MOUSEUP: 'mouseup',
            MOUSEWHEEL: 'mousewheel',
            MSPOINTERDOWN: 'MSPointerDown',
            RESIZE: 'resize',
            TOUCHSTART: 'touchstart',
            TOUCHMOVE: 'touchmove',
            TOUCHEND: 'touchend',
            WHEEL: 'wheel'
        };

        ol.Observable = function() {
            this.revision_ = 0;

        };
        ol.inherits(ol.Observable, ol.events.EventTarget);

        ol.Observable.unByKey = function(key) {
            if (Array.isArray(key)) {
                for (var i = 0, ii = key.length; i < ii; ++i) {
                    ol.events.unlistenByKey(key[i]);
                }
            } else {
                ol.events.unlistenByKey(/** @type {ol.EventsKey} */ (key));
            }
        };


        /**
         * Increases the revision counter and dispatches a 'change' event.
         * @api
         */
        ol.Observable.prototype.changed = function() {
            ++this.revision_;
            //this.dispatchEvent(ol.events.EventType.CHANGE);
        };


        /**
         * Dispatches an event and calls all listeners listening for events
         * of this type. The event parameter can either be a string or an
         * Object with a `type` property.
         *
         * @param {{type: string,
     *     target: (EventTarget|ol.events.EventTarget|undefined)}|ol.events.Event|
     *     string} event Event object.
         * @function
         * @api
         */
        ol.Observable.prototype.dispatchEvent;


        /**
         * Get the version number for this object.  Each time the object is modified,
         * its version number will be incremented.
         * @return {number} Revision.
         * @api
         */
        ol.Observable.prototype.getRevision = function() {
            return this.revision_;
        };


        /**
         * Listen for a certain type of event.
         * @param {string|Array.<string>} type The event type or array of event types.
         * @param {function(?): ?} listener The listener function.
         * @param {Object=} opt_this The object to use as `this` in `listener`.
         * @return {ol.EventsKey|Array.<ol.EventsKey>} Unique key for the listener. If
         *     called with an array of event types as the first argument, the return
         *     will be an array of keys.
         * @api
         */
        ol.Observable.prototype.on = function(type, listener, opt_this) {
            if (Array.isArray(type)) {
                var len = type.length;
                var keys = new Array(len);
                for (var i = 0; i < len; ++i) {
                    keys[i] = ol.events.listen(this, type[i], listener, opt_this);
                }
                return keys;
            } else {
                return ol.events.listen(
                    this, /** @type {string} */ (type), listener, opt_this);
            }
        };


        /**
         * Listen once for a certain type of event.
         * @param {string|Array.<string>} type The event type or array of event types.
         * @param {function(?): ?} listener The listener function.
         * @param {Object=} opt_this The object to use as `this` in `listener`.
         * @return {ol.EventsKey|Array.<ol.EventsKey>} Unique key for the listener. If
         *     called with an array of event types as the first argument, the return
         *     will be an array of keys.
         * @api
         */
        ol.Observable.prototype.once = function(type, listener, opt_this) {
            if (Array.isArray(type)) {
                var len = type.length;
                var keys = new Array(len);
                for (var i = 0; i < len; ++i) {
                    keys[i] = ol.events.listenOnce(this, type[i], listener, opt_this);
                }
                return keys;
            } else {
                return ol.events.listenOnce(
                    this, /** @type {string} */ (type), listener, opt_this);
            }
        };


        /**
         * Unlisten for a certain type of event.
         * @param {string|Array.<string>} type The event type or array of event types.
         * @param {function(?): ?} listener The listener function.
         * @param {Object=} opt_this The object which was used as `this` by the
         * `listener`.
         * @api
         */
        ol.Observable.prototype.un = function(type, listener, opt_this) {
            if (Array.isArray(type)) {
                for (var i = 0, ii = type.length; i < ii; ++i) {
                    ol.events.unlisten(this, type[i], listener, opt_this);
                }
                return;
            } else {
                ol.events.unlisten(this, /** @type {string} */ (type), listener, opt_this);
            }
        };

        ol.uidCounter_ = 0;

        ol.Object = function(opt_values) {
            ol.Observable.call(this);

            // Call ol.getUid to ensure that the order of objects' ids is the same as
            // the order in which they were created.  This also helps to ensure that
            // object properties are always added in the same order, which helps many
            // JavaScript engines generate faster code.
            ol.getUid(this);

            /**
             * @private
             * @type {!Object.<string, *>}
             */
            this.values_ = {};

            if (opt_values !== undefined) {
                this.setProperties(opt_values);
            }
        };
        ol.inherits(ol.Object, ol.Observable);


        /**
         * @private
         * @type {Object.<string, string>}
         */
        ol.Object.changeEventTypeCache_ = {};


        /**
         * @param {string} key Key name.
         * @return {string} Change name.
         */
        ol.Object.getChangeEventType = function(key) {
            return ol.Object.changeEventTypeCache_.hasOwnProperty(key) ?
                ol.Object.changeEventTypeCache_[key] :
                (ol.Object.changeEventTypeCache_[key] = 'change:' + key);
        };


        /**
         * Gets a value.
         * @param {string} key Key name.
         * @return {*} Value.
         * @api
         */
        ol.Object.prototype.get = function(key) {
            var value;
            if (this.values_.hasOwnProperty(key)) {
                value = this.values_[key];
            }
            return value;
        };


        /**
         * Get a list of object property names.
         * @return {Array.<string>} List of property names.
         * @api
         */
        ol.Object.prototype.getKeys = function() {
            return Object.keys(this.values_);
        };


        /**
         * Get an object of all property names and values.
         * @return {Object.<string, *>} Object.
         * @api
         */
        ol.Object.prototype.getProperties = function() {
            return ol.obj.assign({}, this.values_);
        };


        /**
         * @param {string} key Key name.
         * @param {*} oldValue Old value.
         */
        ol.Object.prototype.notify = function(key, oldValue) {
            // FIX ME
            return;
        };


        /**
         * Sets a value.
         * @param {string} key Key name.
         * @param {*} value Value.
         * @param {boolean=} opt_silent Update without triggering an event.
         * @api
         */
        ol.Object.prototype.set = function(key, value, opt_silent) {
            if (opt_silent) {
                this.values_[key] = value;
            } else {
                var oldValue = this.values_[key];
                this.values_[key] = value;
                if (oldValue !== value) {
                    this.notify(key, oldValue);
                }
            }
        };


        /**
         * Sets a collection of key-value pairs.  Note that this changes any existing
         * properties and adds new ones (it does not remove any existing properties).
         * @param {Object.<string, *>} values Values.
         * @param {boolean=} opt_silent Update without triggering an event.
         * @api
         */
        ol.Object.prototype.setProperties = function(values, opt_silent) {
            var key;
            for (key in values) {
                this.set(key, values[key], opt_silent);
            }
        };


        /**
         * Unsets a property.
         * @param {string} key Key name.
         * @param {boolean=} opt_silent Unset without triggering an event.
         * @api
         */
        ol.Object.prototype.unset = function(key, opt_silent) {
            if (key in this.values_) {
                var oldValue = this.values_[key];
                delete this.values_[key];
                if (!opt_silent) {
                    this.notify(key, oldValue);
                }
            }
        };

        ol.Object.Event = function(type, key, oldValue) {
            ol.events.Event.call(this, type);
            this.key = key;
            this.oldValue = oldValue;

        };
        ol.inherits(ol.Object.Event, ol.events.Event);

        ol.functions = {};
        /**
         * Always returns true.
         * @returns {boolean} true.
         */
        ol.functions.TRUE = function() {
            return true;
        };

        /**
         * Always returns false.
         * @returns {boolean} false.
         */
        ol.functions.FALSE = function() {
            return false;
        };

        ol.math = {};

        ol.math.clamp = function(value, min, max) {
            return Math.min(Math.max(value, min), max);
        };

        ol.math.cosh = (function() {
            // Wrapped in a iife, to save the overhead of checking for the native
            // implementation on every invocation.
            var cosh;
            if ('cosh' in Math) {
                // The environment supports the native Math.cosh function, use it…
                cosh = Math.cosh;
            } else {
                // … else, use the reference implementation of MDN:
                cosh = function(x) {
                    var y = Math.exp(x);
                    return (y + 1 / y) / 2;
                };
            }
            return cosh;
        }());


        /**
         * @param {number} x X.
         * @return {number} The smallest power of two greater than or equal to x.
         */
        ol.math.roundUpToPowerOfTwo = function(x) {
            ol.asserts.assert(0 < x, 29); // `x` must be greater than `0`
            return Math.pow(2, Math.ceil(Math.log(x) / Math.LN2));
        };

        ol.math.squaredSegmentDistance = function(x, y, x1, y1, x2, y2) {
            var dx = x2 - x1;
            var dy = y2 - y1;
            if (dx !== 0 || dy !== 0) {
                var t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy);
                if (t > 1) {
                    x1 = x2;
                    y1 = y2;
                } else if (t > 0) {
                    x1 += dx * t;
                    y1 += dy * t;
                }
            }
            return ol.math.squaredDistance(x, y, x1, y1);
        };

        ol.math.squaredDistance = function(x1, y1, x2, y2) {
            var dx = x2 - x1;
            var dy = y2 - y1;
            return dx * dx + dy * dy;
        };

        ol.math.solveLinearSystem = function(mat) {
            var n = mat.length;

            for (var i = 0; i < n; i++) {
                // Find max in the i-th column (ignoring i - 1 first rows)
                var maxRow = i;
                var maxEl = Math.abs(mat[i][i]);
                for (var r = i + 1; r < n; r++) {
                    var absValue = Math.abs(mat[r][i]);
                    if (absValue > maxEl) {
                        maxEl = absValue;
                        maxRow = r;
                    }
                }

                if (maxEl === 0) {
                    return null; // matrix is singular
                }

                // Swap max row with i-th (current) row
                var tmp = mat[maxRow];
                mat[maxRow] = mat[i];
                mat[i] = tmp;

                // Subtract the i-th row to make all the remaining rows 0 in the i-th column
                for (var j = i + 1; j < n; j++) {
                    var coef = -mat[j][i] / mat[i][i];
                    for (var k = i; k < n + 1; k++) {
                        if (i == k) {
                            mat[j][k] = 0;
                        } else {
                            mat[j][k] += coef * mat[i][k];
                        }
                    }
                }
            }

            // Solve Ax=b for upper triangular matrix A (mat)
            var x = new Array(n);
            for (var l = n - 1; l >= 0; l--) {
                x[l] = mat[l][n] / mat[l][l];
                for (var m = l - 1; m >= 0; m--) {
                    mat[m][n] -= mat[m][l] * x[l];
                }
            }
            return x;
        };

        ol.math.toDegrees = function(angleInRadians) {
            return angleInRadians * 180 / Math.PI;
        };

        ol.math.toRadians = function(angleInDegrees) {
            return angleInDegrees * Math.PI / 180;
        };

        ol.math.modulo = function(a, b) {
            var r = a % b;
            return r * b < 0 ? r + b : r;
        };

        ol.math.lerp = function(a, b, x) {
            return a + x * (b - a);
        };

        ol.ImageState = {
            IDLE: 0,
            LOADING: 1,
            LOADED: 2,
            ERROR: 3
        };

        ol.color = {};

        ol.color.HEX_COLOR_RE_ = /^#(?:[0-9a-f]{3,4}){1,2}$/i;

        ol.color.NAMED_COLOR_RE_ = /^([a-z]*)$/i;

        ol.color.asArray = function(color) {
            if (Array.isArray(color)) {
                return color;
            } else {
                return ol.color.fromString(/** @type {string} */ (color));
            }
        };

        ol.color.asString = function(color) {
            if (typeof color === 'string') {
                return color;
            } else {
                return ol.color.toString(color);
            }
        };

        ol.color.fromNamed = function(color) {
            var el = document.createElement('div');
            el.style.color = color;
            document.body.appendChild(el);
            var rgb = getComputedStyle(el).color;
            document.body.removeChild(el);
            return rgb;
        };

        ol.color.fromString = (
            function() {

                // We maintain a small cache of parsed strings.  To provide cheap LRU-like
                // semantics, whenever the cache grows too large we simply delete an
                // arbitrary 25% of the entries.

                /**
                 * @const
                 * @type {number}
                 */
                var MAX_CACHE_SIZE = 1024;

                /**
                 * @type {Object.<string, ol.Color>}
                 */
                var cache = {};

                /**
                 * @type {number}
                 */
                var cacheSize = 0;

                return (
                    /**
                     * @param {string} s String.
                     * @return {ol.Color} Color.
                     */
                        function(s) {
                        var color;
                        if (cache.hasOwnProperty(s)) {
                            color = cache[s];
                        } else {
                            if (cacheSize >= MAX_CACHE_SIZE) {
                                var i = 0;
                                var key;
                                for (key in cache) {
                                    if ((i++ & 3) === 0) {
                                        delete cache[key];
                                        --cacheSize;
                                    }
                                }
                            }
                            color = ol.color.fromStringInternal_(s);
                            cache[s] = color;
                            ++cacheSize;
                        }
                        return color;
                    });

            })();

        ol.color.fromStringInternal_ = function(s) {
            var r, g, b, a, color, parts;

            if (ol.color.NAMED_COLOR_RE_.exec(s)) {
                s = ol.color.fromNamed(s);
            }

            if (ol.color.HEX_COLOR_RE_.exec(s)) { // hex
                var n = s.length - 1; // number of hex digits
                var d; // number of digits per channel
                if (n <= 4) {
                    d = 1;
                } else {
                    d = 2;
                }
                var hasAlpha = n === 4 || n === 8;
                r = parseInt(s.substr(1 + 0 * d, d), 16);
                g = parseInt(s.substr(1 + 1 * d, d), 16);
                b = parseInt(s.substr(1 + 2 * d, d), 16);
                if (hasAlpha) {
                    a = parseInt(s.substr(1 + 3 * d, d), 16);
                } else {
                    a = 255;
                }
                if (d == 1) {
                    r = (r << 4) + r;
                    g = (g << 4) + g;
                    b = (b << 4) + b;
                    if (hasAlpha) {
                        a = (a << 4) + a;
                    }
                }
                color = [r, g, b, a / 255];
            } else if (s.indexOf('rgba(') == 0) { // rgba()
                parts = s.slice(5, -1).split(',').map(Number);
                color = ol.color.normalize(parts);
            } else if (s.indexOf('rgb(') == 0) { // rgb()
                parts = s.slice(4, -1).split(',').map(Number);
                parts.push(1);
                color = ol.color.normalize(parts);
            } else {
                ol.asserts.assert(false, 14); // Invalid color
            }
            return /** @type {ol.Color} */ (color);
        };


        /**
         * @param {ol.Color} color Color.
         * @param {ol.Color=} opt_color Color.
         * @return {ol.Color} Clamped color.
         */
        ol.color.normalize = function(color, opt_color) {
            var result = opt_color || [];
            result[0] = ol.math.clamp((color[0] + 0.5) | 0, 0, 255);
            result[1] = ol.math.clamp((color[1] + 0.5) | 0, 0, 255);
            result[2] = ol.math.clamp((color[2] + 0.5) | 0, 0, 255);
            result[3] = ol.math.clamp(color[3], 0, 1);
            return result;
        };


        /**
         * @param {ol.Color} color Color.
         * @return {string} String.
         */
        ol.color.toString = function(color) {
            var r = color[0];
            if (r != (r | 0)) {
                r = (r + 0.5) | 0;
            }
            var g = color[1];
            if (g != (g | 0)) {
                g = (g + 0.5) | 0;
            }
            var b = color[2];
            if (b != (b | 0)) {
                b = (b + 0.5) | 0;
            }
            var a = color[3] === undefined ? 1 : color[3];
            return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
        };

        ol.colorlike = {};

        ol.colorlike.asColorLike = function(color) {
            if (ol.colorlike.isColorLike(color)) {
                return /** @type {string|CanvasPattern|CanvasGradient} */ (color);
            } else {
                return ol.color.asString(/** @type {ol.Color} */ (color));
            }
        };

        ol.colorlike.isColorLike = function(color) {
            return (
                typeof color === 'string' ||
                    color instanceof CanvasPattern ||
                    color instanceof CanvasGradient
                );
        };

        ol.css = {};
        ol.css.CLASS_HIDDEN = 'ol-hidden';
        ol.css.CLASS_SELECTABLE = 'ol-selectable';
        ol.css.CLASS_UNSELECTABLE = 'ol-unselectable';
        ol.css.CLASS_UNSUPPORTED = 'ol-unsupported';
        ol.css.CLASS_CONTROL = 'ol-control';
        ol.css.getFontFamilies = (function() {
            var style;
            var cache = {};
            return function(font) {
                if (!style) {
                    style = document.createElement('div').style;
                }
                if (!(font in cache)) {
                    style.font = font;
                    var family = style.fontFamily;
                    style.font = '';
                    if (!family) {
                        return null;
                    }
                    cache[font] = family.split(/,\s?/);
                }
                return cache[font];
            };
        })();

        ol.dom = {};

        /**
         * Create an html canvas element and returns its 2d context.
         * @param {number=} opt_width Canvas width.
         * @param {number=} opt_height Canvas height.
         * @return {CanvasRenderingContext2D} The context.
         */
        ol.dom.createCanvasContext2D = function(opt_width, opt_height) {
            //var canvas = document.createElement('CANVAS');
            var canvas;
            if (opt_width && opt_height) {
                canvas = new OffscreenCanvas(opt_width, opt_height);
            }
            else{
                canvas = new OffscreenCanvas(1, 1);
            }
            return canvas.getContext('2d');
        };


        /**
         * Get the current computed width for the given element including margin,
         * padding and border.
         * Equivalent to jQuery's `$(el).outerWidth(true)`.
         * @param {!Element} element Element.
         * @return {number} The width.
         */
        ol.dom.outerWidth = function(element) {
            var width = element.offsetWidth;
            var style = getComputedStyle(element);
            width += parseInt(style.marginLeft, 10) + parseInt(style.marginRight, 10);

            return width;
        };


        /**
         * Get the current computed height for the given element including margin,
         * padding and border.
         * Equivalent to jQuery's `$(el).outerHeight(true)`.
         * @param {!Element} element Element.
         * @return {number} The height.
         */
        ol.dom.outerHeight = function(element) {
            var height = element.offsetHeight;
            var style = getComputedStyle(element);
            height += parseInt(style.marginTop, 10) + parseInt(style.marginBottom, 10);

            return height;
        };

        /**
         * @param {Node} newNode Node to replace old node
         * @param {Node} oldNode The node to be replaced
         */
        ol.dom.replaceNode = function(newNode, oldNode) {
            var parent = oldNode.parentNode;
            if (parent) {
                parent.replaceChild(newNode, oldNode);
            }
        };

        /**
         * @param {Node} node The node to remove.
         * @returns {Node} The node that was removed or null.
         */
        ol.dom.removeNode = function(node) {
            return node && node.parentNode ? node.parentNode.removeChild(node) : null;
        };

        /**
         * @param {Node} node The node to remove the children from.
         */
        ol.dom.removeChildren = function(node) {
            while (node.lastChild) {
                node.removeChild(node.lastChild);
            }
        };

        ol.extent = {};

        ol.extent.Corner = {
            BOTTOM_LEFT: 'bottom-left',
            BOTTOM_RIGHT: 'bottom-right',
            TOP_LEFT: 'top-left',
            TOP_RIGHT: 'top-right'
        };

        /**
         * Relationship to an extent.
         * @enum {number}
         */
        ol.extent.Relationship = {
            UNKNOWN: 0,
            INTERSECTING: 1,
            ABOVE: 2,
            RIGHT: 4,
            BELOW: 8,
            LEFT: 16
        };

        /**
         * Build an extent that includes all given coordinates.
         *
         * @param {Array.<ol.Coordinate>} coordinates Coordinates.
         * @return {ol.Extent} Bounding extent.
         * @api
         */
        ol.extent.boundingExtent = function(coordinates) {
            var extent = ol.extent.createEmpty();
            for (var i = 0, ii = coordinates.length; i < ii; ++i) {
                ol.extent.extendCoordinate(extent, coordinates[i]);
            }
            return extent;
        };

        ol.extent.boundingExtentXYs_ = function(xs, ys, opt_extent) {
            var minX = Math.min.apply(null, xs);
            var minY = Math.min.apply(null, ys);
            var maxX = Math.max.apply(null, xs);
            var maxY = Math.max.apply(null, ys);
            return ol.extent.createOrUpdate(minX, minY, maxX, maxY, opt_extent);
        };

        ol.extent.buffer = function(extent, value, opt_extent) {
            if (opt_extent) {
                opt_extent[0] = extent[0] - value;
                opt_extent[1] = extent[1] - value;
                opt_extent[2] = extent[2] + value;
                opt_extent[3] = extent[3] + value;
                return opt_extent;
            } else {
                return [
                    extent[0] - value,
                    extent[1] - value,
                    extent[2] + value,
                    extent[3] + value
                ];
            }
        };

        ol.extent.clone = function(extent, opt_extent) {
            if (opt_extent) {
                opt_extent[0] = extent[0];
                opt_extent[1] = extent[1];
                opt_extent[2] = extent[2];
                opt_extent[3] = extent[3];
                return opt_extent;
            } else {
                return extent.slice();
            }
        };

        ol.extent.closestSquaredDistanceXY = function(extent, x, y) {
            var dx, dy;
            if (x < extent[0]) {
                dx = extent[0] - x;
            } else if (extent[2] < x) {
                dx = x - extent[2];
            } else {
                dx = 0;
            }
            if (y < extent[1]) {
                dy = extent[1] - y;
            } else if (extent[3] < y) {
                dy = y - extent[3];
            } else {
                dy = 0;
            }
            return dx * dx + dy * dy;
        };


        /**
         * Check if the passed coordinate is contained or on the edge of the extent.
         *
         * @param {ol.Extent} extent Extent.
         * @param {ol.Coordinate} coordinate Coordinate.
         * @return {boolean} The coordinate is contained in the extent.
         * @api
         */
        ol.extent.containsCoordinate = function(extent, coordinate) {
            return ol.extent.containsXY(extent, coordinate[0], coordinate[1]);
        };


        /**
         * Check if one extent contains another.
         *
         * An extent is deemed contained if it lies completely within the other extent,
         * including if they share one or more edges.
         *
         * @param {ol.Extent} extent1 Extent 1.
         * @param {ol.Extent} extent2 Extent 2.
         * @return {boolean} The second extent is contained by or on the edge of the
         *     first.
         * @api
         */
        ol.extent.containsExtent = function(extent1, extent2) {
            return extent1[0] <= extent2[0] && extent2[2] <= extent1[2] &&
                extent1[1] <= extent2[1] && extent2[3] <= extent1[3];
        };


        /**
         * Check if the passed coordinate is contained or on the edge of the extent.
         *
         * @param {ol.Extent} extent Extent.
         * @param {number} x X coordinate.
         * @param {number} y Y coordinate.
         * @return {boolean} The x, y values are contained in the extent.
         * @api
         */
        ol.extent.containsXY = function(extent, x, y) {
            return extent[0] <= x && x <= extent[2] && extent[1] <= y && y <= extent[3];
        };


        /**
         * Get the relationship between a coordinate and extent.
         * @param {ol.Extent} extent The extent.
         * @param {ol.Coordinate} coordinate The coordinate.
         * @return {number} The relationship (bitwise compare with
         *     ol.extent.Relationship).
         */
        ol.extent.coordinateRelationship = function(extent, coordinate) {
            var minX = extent[0];
            var minY = extent[1];
            var maxX = extent[2];
            var maxY = extent[3];
            var x = coordinate[0];
            var y = coordinate[1];
            var relationship = ol.extent.Relationship.UNKNOWN;
            if (x < minX) {
                relationship = relationship | ol.extent.Relationship.LEFT;
            } else if (x > maxX) {
                relationship = relationship | ol.extent.Relationship.RIGHT;
            }
            if (y < minY) {
                relationship = relationship | ol.extent.Relationship.BELOW;
            } else if (y > maxY) {
                relationship = relationship | ol.extent.Relationship.ABOVE;
            }
            if (relationship === ol.extent.Relationship.UNKNOWN) {
                relationship = ol.extent.Relationship.INTERSECTING;
            }
            return relationship;
        };


        /**
         * Create an empty extent.
         * @return {ol.Extent} Empty extent.
         * @api
         */
        ol.extent.createEmpty = function() {
            return [Infinity, Infinity, -Infinity, -Infinity];
        };


        /**
         * Create a new extent or update the provided extent.
         * @param {number} minX Minimum X.
         * @param {number} minY Minimum Y.
         * @param {number} maxX Maximum X.
         * @param {number} maxY Maximum Y.
         * @param {ol.Extent=} opt_extent Destination extent.
         * @return {ol.Extent} Extent.
         */
        ol.extent.createOrUpdate = function(minX, minY, maxX, maxY, opt_extent) {
            if (opt_extent) {
                opt_extent[0] = minX;
                opt_extent[1] = minY;
                opt_extent[2] = maxX;
                opt_extent[3] = maxY;
                return opt_extent;
            } else {
                return [minX, minY, maxX, maxY];
            }
        };


        /**
         * Create a new empty extent or make the provided one empty.
         * @param {ol.Extent=} opt_extent Extent.
         * @return {ol.Extent} Extent.
         */
        ol.extent.createOrUpdateEmpty = function(opt_extent) {
            return ol.extent.createOrUpdate(
                Infinity, Infinity, -Infinity, -Infinity, opt_extent);
        };


        /**
         * @param {ol.Coordinate} coordinate Coordinate.
         * @param {ol.Extent=} opt_extent Extent.
         * @return {ol.Extent} Extent.
         */
        ol.extent.createOrUpdateFromCoordinate = function(coordinate, opt_extent) {
            var x = coordinate[0];
            var y = coordinate[1];
            return ol.extent.createOrUpdate(x, y, x, y, opt_extent);
        };


        /**
         * @param {Array.<ol.Coordinate>} coordinates Coordinates.
         * @param {ol.Extent=} opt_extent Extent.
         * @return {ol.Extent} Extent.
         */
        ol.extent.createOrUpdateFromCoordinates = function(coordinates, opt_extent) {
            var extent = ol.extent.createOrUpdateEmpty(opt_extent);
            return ol.extent.extendCoordinates(extent, coordinates);
        };


        /**
         * @param {Array.<number>} flatCoordinates Flat coordinates.
         * @param {number} offset Offset.
         * @param {number} end End.
         * @param {number} stride Stride.
         * @param {ol.Extent=} opt_extent Extent.
         * @return {ol.Extent} Extent.
         */
        ol.extent.createOrUpdateFromFlatCoordinates = function(flatCoordinates, offset, end, stride, opt_extent) {
            var extent = ol.extent.createOrUpdateEmpty(opt_extent);
            return ol.extent.extendFlatCoordinates(
                extent, flatCoordinates, offset, end, stride);
        };


        /**
         * @param {Array.<Array.<ol.Coordinate>>} rings Rings.
         * @param {ol.Extent=} opt_extent Extent.
         * @return {ol.Extent} Extent.
         */
        ol.extent.createOrUpdateFromRings = function(rings, opt_extent) {
            var extent = ol.extent.createOrUpdateEmpty(opt_extent);
            return ol.extent.extendRings(extent, rings);
        };


        /**
         * Determine if two extents are equivalent.
         * @param {ol.Extent} extent1 Extent 1.
         * @param {ol.Extent} extent2 Extent 2.
         * @return {boolean} The two extents are equivalent.
         * @api
         */
        ol.extent.equals = function(extent1, extent2) {
            return extent1[0] == extent2[0] && extent1[2] == extent2[2] &&
                extent1[1] == extent2[1] && extent1[3] == extent2[3];
        };


        /**
         * Modify an extent to include another extent.
         * @param {ol.Extent} extent1 The extent to be modified.
         * @param {ol.Extent} extent2 The extent that will be included in the first.
         * @return {ol.Extent} A reference to the first (extended) extent.
         * @api
         */
        ol.extent.extend = function(extent1, extent2) {
            if (extent2[0] < extent1[0]) {
                extent1[0] = extent2[0];
            }
            if (extent2[2] > extent1[2]) {
                extent1[2] = extent2[2];
            }
            if (extent2[1] < extent1[1]) {
                extent1[1] = extent2[1];
            }
            if (extent2[3] > extent1[3]) {
                extent1[3] = extent2[3];
            }
            return extent1;
        };


        /**
         * @param {ol.Extent} extent Extent.
         * @param {ol.Coordinate} coordinate Coordinate.
         */
        ol.extent.extendCoordinate = function(extent, coordinate) {
            if (coordinate[0] < extent[0]) {
                extent[0] = coordinate[0];
            }
            if (coordinate[0] > extent[2]) {
                extent[2] = coordinate[0];
            }
            if (coordinate[1] < extent[1]) {
                extent[1] = coordinate[1];
            }
            if (coordinate[1] > extent[3]) {
                extent[3] = coordinate[1];
            }
        };


        /**
         * @param {ol.Extent} extent Extent.
         * @param {Array.<ol.Coordinate>} coordinates Coordinates.
         * @return {ol.Extent} Extent.
         */
        ol.extent.extendCoordinates = function(extent, coordinates) {
            var i, ii;
            for (i = 0, ii = coordinates.length; i < ii; ++i) {
                ol.extent.extendCoordinate(extent, coordinates[i]);
            }
            return extent;
        };


        /**
         * @param {ol.Extent} extent Extent.
         * @param {Array.<number>} flatCoordinates Flat coordinates.
         * @param {number} offset Offset.
         * @param {number} end End.
         * @param {number} stride Stride.
         * @return {ol.Extent} Extent.
         */
        ol.extent.extendFlatCoordinates = function(extent, flatCoordinates, offset, end, stride) {
            for (; offset < end; offset += stride) {
                ol.extent.extendXY(
                    extent, flatCoordinates[offset], flatCoordinates[offset + 1]);
            }
            return extent;
        };


        /**
         * @param {ol.Extent} extent Extent.
         * @param {Array.<Array.<ol.Coordinate>>} rings Rings.
         * @return {ol.Extent} Extent.
         */
        ol.extent.extendRings = function(extent, rings) {
            var i, ii;
            for (i = 0, ii = rings.length; i < ii; ++i) {
                ol.extent.extendCoordinates(extent, rings[i]);
            }
            return extent;
        };


        /**
         * @param {ol.Extent} extent Extent.
         * @param {number} x X.
         * @param {number} y Y.
         */
        ol.extent.extendXY = function(extent, x, y) {
            extent[0] = Math.min(extent[0], x);
            extent[1] = Math.min(extent[1], y);
            extent[2] = Math.max(extent[2], x);
            extent[3] = Math.max(extent[3], y);
        };


        /**
         * This function calls `callback` for each corner of the extent. If the
         * callback returns a truthy value the function returns that value
         * immediately. Otherwise the function returns `false`.
         * @param {ol.Extent} extent Extent.
         * @param {function(this:T, ol.Coordinate): S} callback Callback.
         * @param {T=} opt_this Value to use as `this` when executing `callback`.
         * @return {S|boolean} Value.
         * @template S, T
         */
        ol.extent.forEachCorner = function(extent, callback, opt_this) {
            var val;
            val = callback.call(opt_this, ol.extent.getBottomLeft(extent));
            if (val) {
                return val;
            }
            val = callback.call(opt_this, ol.extent.getBottomRight(extent));
            if (val) {
                return val;
            }
            val = callback.call(opt_this, ol.extent.getTopRight(extent));
            if (val) {
                return val;
            }
            val = callback.call(opt_this, ol.extent.getTopLeft(extent));
            if (val) {
                return val;
            }
            return false;
        };


        /**
         * Get the size of an extent.
         * @param {ol.Extent} extent Extent.
         * @return {number} Area.
         * @api
         */
        ol.extent.getArea = function(extent) {
            var area = 0;
            if (!ol.extent.isEmpty(extent)) {
                area = ol.extent.getWidth(extent) * ol.extent.getHeight(extent);
            }
            return area;
        };


        /**
         * Get the bottom left coordinate of an extent.
         * @param {ol.Extent} extent Extent.
         * @return {ol.Coordinate} Bottom left coordinate.
         * @api
         */
        ol.extent.getBottomLeft = function(extent) {
            return [extent[0], extent[1]];
        };


        /**
         * Get the bottom right coordinate of an extent.
         * @param {ol.Extent} extent Extent.
         * @return {ol.Coordinate} Bottom right coordinate.
         * @api
         */
        ol.extent.getBottomRight = function(extent) {
            return [extent[2], extent[1]];
        };


        /**
         * Get the center coordinate of an extent.
         * @param {ol.Extent} extent Extent.
         * @return {ol.Coordinate} Center.
         * @api
         */
        ol.extent.getCenter = function(extent) {
            return [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2];
        };


        /**
         * Get a corner coordinate of an extent.
         * @param {ol.Extent} extent Extent.
         * @param {ol.extent.Corner} corner Corner.
         * @return {ol.Coordinate} Corner coordinate.
         */
        ol.extent.getCorner = function(extent, corner) {
            var coordinate;
            if (corner === ol.extent.Corner.BOTTOM_LEFT) {
                coordinate = ol.extent.getBottomLeft(extent);
            } else if (corner === ol.extent.Corner.BOTTOM_RIGHT) {
                coordinate = ol.extent.getBottomRight(extent);
            } else if (corner === ol.extent.Corner.TOP_LEFT) {
                coordinate = ol.extent.getTopLeft(extent);
            } else if (corner === ol.extent.Corner.TOP_RIGHT) {
                coordinate = ol.extent.getTopRight(extent);
            } else {
                ol.asserts.assert(false, 13); // Invalid corner
            }
            return /** @type {!ol.Coordinate} */ (coordinate);
        };


        /**
         * @param {ol.Extent} extent1 Extent 1.
         * @param {ol.Extent} extent2 Extent 2.
         * @return {number} Enlarged area.
         */
        ol.extent.getEnlargedArea = function(extent1, extent2) {
            var minX = Math.min(extent1[0], extent2[0]);
            var minY = Math.min(extent1[1], extent2[1]);
            var maxX = Math.max(extent1[2], extent2[2]);
            var maxY = Math.max(extent1[3], extent2[3]);
            return (maxX - minX) * (maxY - minY);
        };


        /**
         * @param {ol.Coordinate} center Center.
         * @param {number} resolution Resolution.
         * @param {number} rotation Rotation.
         * @param {ol.Size} size Size.
         * @param {ol.Extent=} opt_extent Destination extent.
         * @return {ol.Extent} Extent.
         */
        ol.extent.getForViewAndSize = function(center, resolution, rotation, size, opt_extent) {
            var dx = resolution * size[0] / 2;
            var dy = resolution * size[1] / 2;
            var cosRotation = Math.cos(rotation);
            var sinRotation = Math.sin(rotation);
            var xCos = dx * cosRotation;
            var xSin = dx * sinRotation;
            var yCos = dy * cosRotation;
            var ySin = dy * sinRotation;
            var x = center[0];
            var y = center[1];
            var x0 = x - xCos + ySin;
            var x1 = x - xCos - ySin;
            var x2 = x + xCos - ySin;
            var x3 = x + xCos + ySin;
            var y0 = y - xSin - yCos;
            var y1 = y - xSin + yCos;
            var y2 = y + xSin + yCos;
            var y3 = y + xSin - yCos;
            return ol.extent.createOrUpdate(
                Math.min(x0, x1, x2, x3), Math.min(y0, y1, y2, y3),
                Math.max(x0, x1, x2, x3), Math.max(y0, y1, y2, y3),
                opt_extent);
        };


        /**
         * Get the height of an extent.
         * @param {ol.Extent} extent Extent.
         * @return {number} Height.
         * @api
         */
        ol.extent.getHeight = function(extent) {
            return extent[3] - extent[1];
        };


        /**
         * @param {ol.Extent} extent1 Extent 1.
         * @param {ol.Extent} extent2 Extent 2.
         * @return {number} Intersection area.
         */
        ol.extent.getIntersectionArea = function(extent1, extent2) {
            var intersection = ol.extent.getIntersection(extent1, extent2);
            return ol.extent.getArea(intersection);
        };


        /**
         * Get the intersection of two extents.
         * @param {ol.Extent} extent1 Extent 1.
         * @param {ol.Extent} extent2 Extent 2.
         * @param {ol.Extent=} opt_extent Optional extent to populate with intersection.
         * @return {ol.Extent} Intersecting extent.
         * @api
         */
        ol.extent.getIntersection = function(extent1, extent2, opt_extent) {
            var intersection = opt_extent ? opt_extent : ol.extent.createEmpty();
            if (ol.extent.intersects(extent1, extent2)) {
                if (extent1[0] > extent2[0]) {
                    intersection[0] = extent1[0];
                } else {
                    intersection[0] = extent2[0];
                }
                if (extent1[1] > extent2[1]) {
                    intersection[1] = extent1[1];
                } else {
                    intersection[1] = extent2[1];
                }
                if (extent1[2] < extent2[2]) {
                    intersection[2] = extent1[2];
                } else {
                    intersection[2] = extent2[2];
                }
                if (extent1[3] < extent2[3]) {
                    intersection[3] = extent1[3];
                } else {
                    intersection[3] = extent2[3];
                }
            }
            return intersection;
        };


        /**
         * @param {ol.Extent} extent Extent.
         * @return {number} Margin.
         */
        ol.extent.getMargin = function(extent) {
            return ol.extent.getWidth(extent) + ol.extent.getHeight(extent);
        };


        /**
         * Get the size (width, height) of an extent.
         * @param {ol.Extent} extent The extent.
         * @return {ol.Size} The extent size.
         * @api
         */
        ol.extent.getSize = function(extent) {
            return [extent[2] - extent[0], extent[3] - extent[1]];
        };


        /**
         * Get the top left coordinate of an extent.
         * @param {ol.Extent} extent Extent.
         * @return {ol.Coordinate} Top left coordinate.
         * @api
         */
        ol.extent.getTopLeft = function(extent) {
            return [extent[0], extent[3]];
        };


        /**
         * Get the top right coordinate of an extent.
         * @param {ol.Extent} extent Extent.
         * @return {ol.Coordinate} Top right coordinate.
         * @api
         */
        ol.extent.getTopRight = function(extent) {
            return [extent[2], extent[3]];
        };


        /**
         * Get the width of an extent.
         * @param {ol.Extent} extent Extent.
         * @return {number} Width.
         * @api
         */
        ol.extent.getWidth = function(extent) {
            return extent[2] - extent[0];
        };


        /**
         * Determine if one extent intersects another.
         * @param {ol.Extent} extent1 Extent 1.
         * @param {ol.Extent} extent2 Extent.
         * @return {boolean} The two extents intersect.
         * @api
         */
        ol.extent.intersects = function(extent1, extent2) {
            return extent1[0] <= extent2[2] &&
                extent1[2] >= extent2[0] &&
                extent1[1] <= extent2[3] &&
                extent1[3] >= extent2[1];
        };


        /**
         * Determine if an extent is empty.
         * @param {ol.Extent} extent Extent.
         * @return {boolean} Is empty.
         * @api
         */
        ol.extent.isEmpty = function(extent) {
            return extent[2] < extent[0] || extent[3] < extent[1];
        };


        /**
         * @param {ol.Extent} extent Extent.
         * @param {ol.Extent=} opt_extent Extent.
         * @return {ol.Extent} Extent.
         */
        ol.extent.returnOrUpdate = function(extent, opt_extent) {
            if (opt_extent) {
                opt_extent[0] = extent[0];
                opt_extent[1] = extent[1];
                opt_extent[2] = extent[2];
                opt_extent[3] = extent[3];
                return opt_extent;
            } else {
                return extent;
            }
        };


        /**
         * @param {ol.Extent} extent Extent.
         * @param {number} value Value.
         */
        ol.extent.scaleFromCenter = function(extent, value) {
            var deltaX = ((extent[2] - extent[0]) / 2) * (value - 1);
            var deltaY = ((extent[3] - extent[1]) / 2) * (value - 1);
            extent[0] -= deltaX;
            extent[2] += deltaX;
            extent[1] -= deltaY;
            extent[3] += deltaY;
        };


        /**
         * Determine if the segment between two coordinates intersects (crosses,
         * touches, or is contained by) the provided extent.
         * @param {ol.Extent} extent The extent.
         * @param {ol.Coordinate} start Segment start coordinate.
         * @param {ol.Coordinate} end Segment end coordinate.
         * @return {boolean} The segment intersects the extent.
         */
        ol.extent.intersectsSegment = function(extent, start, end) {
            var intersects = false;
            var startRel = ol.extent.coordinateRelationship(extent, start);
            var endRel = ol.extent.coordinateRelationship(extent, end);
            if (startRel === ol.extent.Relationship.INTERSECTING ||
                endRel === ol.extent.Relationship.INTERSECTING) {
                intersects = true;
            } else {
                var minX = extent[0];
                var minY = extent[1];
                var maxX = extent[2];
                var maxY = extent[3];
                var startX = start[0];
                var startY = start[1];
                var endX = end[0];
                var endY = end[1];
                var slope = (endY - startY) / (endX - startX);
                var x, y;
                if (!!(endRel & ol.extent.Relationship.ABOVE) &&
                    !(startRel & ol.extent.Relationship.ABOVE)) {
                    // potentially intersects top
                    x = endX - ((endY - maxY) / slope);
                    intersects = x >= minX && x <= maxX;
                }
                if (!intersects && !!(endRel & ol.extent.Relationship.RIGHT) &&
                    !(startRel & ol.extent.Relationship.RIGHT)) {
                    // potentially intersects right
                    y = endY - ((endX - maxX) * slope);
                    intersects = y >= minY && y <= maxY;
                }
                if (!intersects && !!(endRel & ol.extent.Relationship.BELOW) &&
                    !(startRel & ol.extent.Relationship.BELOW)) {
                    // potentially intersects bottom
                    x = endX - ((endY - minY) / slope);
                    intersects = x >= minX && x <= maxX;
                }
                if (!intersects && !!(endRel & ol.extent.Relationship.LEFT) &&
                    !(startRel & ol.extent.Relationship.LEFT)) {
                    // potentially intersects left
                    y = endY - ((endX - minX) * slope);
                    intersects = y >= minY && y <= maxY;
                }

            }
            return intersects;
        };


        /**
         * Apply a transform function to the extent.
         * @param {ol.Extent} extent Extent.
         * @param {ol.TransformFunction} transformFn Transform function.  Called with
         * [minX, minY, maxX, maxY] extent coordinates.
         * @param {ol.Extent=} opt_extent Destination extent.
         * @return {ol.Extent} Extent.
         * @api
         */
        ol.extent.applyTransform = function(extent, transformFn, opt_extent) {
            var coordinates = [
                extent[0], extent[1],
                extent[0], extent[3],
                extent[2], extent[1],
                extent[2], extent[3]
            ];
            transformFn(coordinates, coordinates, 2);
            var xs = [coordinates[0], coordinates[2], coordinates[4], coordinates[6]];
            var ys = [coordinates[1], coordinates[3], coordinates[5], coordinates[7]];
            return ol.extent.boundingExtentXYs_(xs, ys, opt_extent);
        };

        ol.obj = {};

        /**
         * Polyfill for Object.assign().  Assigns enumerable and own properties from
         * one or more source objects to a target object.
         *
         * @see https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
         * @param {!Object} target The target object.
         * @param {...Object} var_sources The source object(s).
         * @return {!Object} The modified target object.
         */
        ol.obj.assign = (typeof Object.assign === 'function') ? Object.assign : function(target, var_sources) {
            if (target === undefined || target === null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }

            var output = Object(target);
            for (var i = 1, ii = arguments.length; i < ii; ++i) {
                var source = arguments[i];
                if (source !== undefined && source !== null) {
                    for (var key in source) {
                        if (source.hasOwnProperty(key)) {
                            output[key] = source[key];
                        }
                    }
                }
            }
            return output;
        };


        /**
         * Removes all properties from an object.
         * @param {Object} object The object to clear.
         */
        ol.obj.clear = function(object) {
            for (var property in object) {
                delete object[property];
            }
        };


        /**
         * Get an array of property values from an object.
         * @param {Object<K,V>} object The object from which to get the values.
         * @return {!Array<V>} The property values.
         * @template K,V
         */
        ol.obj.getValues = function(object) {
            var values = [];
            for (var property in object) {
                values.push(object[property]);
            }
            return values;
        };


        /**
         * Determine if an object has any properties.
         * @param {Object} object The object to check.
         * @return {boolean} The object is empty.
         */
        ol.obj.isEmpty = function(object) {
            var property;
            for (property in object) {
                return false;
            }
            return !property;
        };

        ol.transform = {};

        /**
         * @private
         * @type {ol.Transform}
         */
        ol.transform.tmp_ = new Array(6);


        /**
         * Create an identity transform.
         * @return {!ol.Transform} Identity transform.
         */
        ol.transform.create = function() {
            return [1, 0, 0, 1, 0, 0];
        };


        /**
         * Resets the given transform to an identity transform.
         * @param {!ol.Transform} transform Transform.
         * @return {!ol.Transform} Transform.
         */
        ol.transform.reset = function(transform) {
            return ol.transform.set(transform, 1, 0, 0, 1, 0, 0);
        };


        /**
         * Multiply the underlying matrices of two transforms and return the result in
         * the first transform.
         * @param {!ol.Transform} transform1 Transform parameters of matrix 1.
         * @param {!ol.Transform} transform2 Transform parameters of matrix 2.
         * @return {!ol.Transform} transform1 multiplied with transform2.
         */
        ol.transform.multiply = function(transform1, transform2) {
            var a1 = transform1[0];
            var b1 = transform1[1];
            var c1 = transform1[2];
            var d1 = transform1[3];
            var e1 = transform1[4];
            var f1 = transform1[5];
            var a2 = transform2[0];
            var b2 = transform2[1];
            var c2 = transform2[2];
            var d2 = transform2[3];
            var e2 = transform2[4];
            var f2 = transform2[5];

            transform1[0] = a1 * a2 + c1 * b2;
            transform1[1] = b1 * a2 + d1 * b2;
            transform1[2] = a1 * c2 + c1 * d2;
            transform1[3] = b1 * c2 + d1 * d2;
            transform1[4] = a1 * e2 + c1 * f2 + e1;
            transform1[5] = b1 * e2 + d1 * f2 + f1;

            return transform1;
        };

        /**
         * Set the transform components a-f on a given transform.
         * @param {!ol.Transform} transform Transform.
         * @param {number} a The a component of the transform.
         * @param {number} b The b component of the transform.
         * @param {number} c The c component of the transform.
         * @param {number} d The d component of the transform.
         * @param {number} e The e component of the transform.
         * @param {number} f The f component of the transform.
         * @return {!ol.Transform} Matrix with transform applied.
         */
        ol.transform.set = function(transform, a, b, c, d, e, f) {
            transform[0] = a;
            transform[1] = b;
            transform[2] = c;
            transform[3] = d;
            transform[4] = e;
            transform[5] = f;
            return transform;
        };


        /**
         * Set transform on one matrix from another matrix.
         * @param {!ol.Transform} transform1 Matrix to set transform to.
         * @param {!ol.Transform} transform2 Matrix to set transform from.
         * @return {!ol.Transform} transform1 with transform from transform2 applied.
         */
        ol.transform.setFromArray = function(transform1, transform2) {
            transform1[0] = transform2[0];
            transform1[1] = transform2[1];
            transform1[2] = transform2[2];
            transform1[3] = transform2[3];
            transform1[4] = transform2[4];
            transform1[5] = transform2[5];
            return transform1;
        };


        /**
         * Transforms the given coordinate with the given transform returning the
         * resulting, transformed coordinate. The coordinate will be modified in-place.
         *
         * @param {ol.Transform} transform The transformation.
         * @param {ol.Coordinate|ol.Pixel} coordinate The coordinate to transform.
         * @return {ol.Coordinate|ol.Pixel} return coordinate so that operations can be
         *     chained together.
         */
        ol.transform.apply = function(transform, coordinate) {
            var x = coordinate[0], y = coordinate[1];
            coordinate[0] = transform[0] * x + transform[2] * y + transform[4];
            coordinate[1] = transform[1] * x + transform[3] * y + transform[5];
            return coordinate;
        };


        /**
         * Applies rotation to the given transform.
         * @param {!ol.Transform} transform Transform.
         * @param {number} angle Angle in radians.
         * @return {!ol.Transform} The rotated transform.
         */
        ol.transform.rotate = function(transform, angle) {
            var cos = Math.cos(angle);
            var sin = Math.sin(angle);
            return ol.transform.multiply(transform,
                ol.transform.set(ol.transform.tmp_, cos, sin, -sin, cos, 0, 0));
        };


        /**
         * Applies scale to a given transform.
         * @param {!ol.Transform} transform Transform.
         * @param {number} x Scale factor x.
         * @param {number} y Scale factor y.
         * @return {!ol.Transform} The scaled transform.
         */
        ol.transform.scale = function(transform, x, y) {
            return ol.transform.multiply(transform,
                ol.transform.set(ol.transform.tmp_, x, 0, 0, y, 0, 0));
        };


        /**
         * Applies translation to the given transform.
         * @param {!ol.Transform} transform Transform.
         * @param {number} dx Translation x.
         * @param {number} dy Translation y.
         * @return {!ol.Transform} The translated transform.
         */
        ol.transform.translate = function(transform, dx, dy) {
            return ol.transform.multiply(transform,
                ol.transform.set(ol.transform.tmp_, 1, 0, 0, 1, dx, dy));
        };


        /**
         * Creates a composite transform given an initial translation, scale, rotation, and
         * final translation (in that order only, not commutative).
         * @param {!ol.Transform} transform The transform (will be modified in place).
         * @param {number} dx1 Initial translation x.
         * @param {number} dy1 Initial translation y.
         * @param {number} sx Scale factor x.
         * @param {number} sy Scale factor y.
         * @param {number} angle Rotation (in counter-clockwise radians).
         * @param {number} dx2 Final translation x.
         * @param {number} dy2 Final translation y.
         * @return {!ol.Transform} The composite transform.
         */
        ol.transform.compose = function(transform, dx1, dy1, sx, sy, angle, dx2, dy2) {
            var sin = Math.sin(angle);
            var cos = Math.cos(angle);
            transform[0] = sx * cos;
            transform[1] = sy * sin;
            transform[2] = -sx * sin;
            transform[3] = sy * cos;
            transform[4] = dx2 * sx * cos - dy2 * sx * sin + dx1;
            transform[5] = dx2 * sy * sin + dy2 * sy * cos + dy1;
            return transform;
        };


        /**
         * Invert the given transform.
         * @param {!ol.Transform} transform Transform.
         * @return {!ol.Transform} Inverse of the transform.
         */
        ol.transform.invert = function(transform) {
            var det = ol.transform.determinant(transform);
            //ol.asserts.assert(det !== 0, 32); // Transformation matrix cannot be inverted

            var a = transform[0];
            var b = transform[1];
            var c = transform[2];
            var d = transform[3];
            var e = transform[4];
            var f = transform[5];

            transform[0] = d / det;
            transform[1] = -b / det;
            transform[2] = -c / det;
            transform[3] = a / det;
            transform[4] = (c * f - d * e) / det;
            transform[5] = -(a * f - b * e) / det;

            return transform;
        };


        /**
         * Returns the determinant of the given matrix.
         * @param {!ol.Transform} mat Matrix.
         * @return {number} Determinant.
         */
        ol.transform.determinant = function(mat) {
            return mat[0] * mat[3] - mat[1] * mat[2];
        };

        ol.geom = {};
        ol.geom.flat = {};
        ol.geom.flat.center = {};
        ol.geom.flat.reverse = {};
        ol.geom.flat.orient = {};


        ol.geom.flat.transform = {};
        ol.geom.flat.transform.transform2D = function(flatCoordinates, offset, end, stride, transform, opt_dest) {
            var dest = opt_dest ? opt_dest : [];
            var i = 0;
            var j;
            for (j = offset; j < end; j += stride) {
                var x = flatCoordinates[j];
                var y = flatCoordinates[j + 1];
                dest[i++] = transform[0] * x + transform[2] * y + transform[4];
                dest[i++] = transform[1] * x + transform[3] * y + transform[5];
            }
            if (opt_dest && dest.length != i) {
                dest.length = i;
            }
            return dest;
        };


        /**
         * @param {Array.<number>} flatCoordinates Flat coordinates.
         * @param {number} offset Offset.
         * @param {number} end End.
         * @param {number} stride Stride.
         * @param {number} angle Angle.
         * @param {Array.<number>} anchor Rotation anchor point.
         * @param {Array.<number>=} opt_dest Destination.
         * @return {Array.<number>} Transformed coordinates.
         */
        ol.geom.flat.transform.rotate = function(flatCoordinates, offset, end, stride, angle, anchor, opt_dest) {
            var dest = opt_dest ? opt_dest : [];
            var cos = Math.cos(angle);
            var sin = Math.sin(angle);
            var anchorX = anchor[0];
            var anchorY = anchor[1];
            var i = 0;
            for (var j = offset; j < end; j += stride) {
                var deltaX = flatCoordinates[j] - anchorX;
                var deltaY = flatCoordinates[j + 1] - anchorY;
                dest[i++] = anchorX + deltaX * cos - deltaY * sin;
                dest[i++] = anchorY + deltaX * sin + deltaY * cos;
                for (var k = j + 2; k < j + stride; ++k) {
                    dest[i++] = flatCoordinates[k];
                }
            }
            if (opt_dest && dest.length != i) {
                dest.length = i;
            }
            return dest;
        };


        /**
         * Scale the coordinates.
         * @param {Array.<number>} flatCoordinates Flat coordinates.
         * @param {number} offset Offset.
         * @param {number} end End.
         * @param {number} stride Stride.
         * @param {number} sx Scale factor in the x-direction.
         * @param {number} sy Scale factor in the y-direction.
         * @param {Array.<number>} anchor Scale anchor point.
         * @param {Array.<number>=} opt_dest Destination.
         * @return {Array.<number>} Transformed coordinates.
         */
        ol.geom.flat.transform.scale = function(flatCoordinates, offset, end, stride, sx, sy, anchor, opt_dest) {
            var dest = opt_dest ? opt_dest : [];
            var anchorX = anchor[0];
            var anchorY = anchor[1];
            var i = 0;
            for (var j = offset; j < end; j += stride) {
                var deltaX = flatCoordinates[j] - anchorX;
                var deltaY = flatCoordinates[j + 1] - anchorY;
                dest[i++] = anchorX + sx * deltaX;
                dest[i++] = anchorY + sy * deltaY;
                for (var k = j + 2; k < j + stride; ++k) {
                    dest[i++] = flatCoordinates[k];
                }
            }
            if (opt_dest && dest.length != i) {
                dest.length = i;
            }
            return dest;
        };

        /**
         * The coordinate layout for geometries, indicating whether a 3rd or 4th z ('Z')
         * or measure ('M') coordinate is available. Supported values are `'XY'`,
         * `'XYZ'`, `'XYM'`, `'XYZM'`.
         * @enum {string}
         */
        ol.geom.GeometryLayout = {
            XY: 'XY',
            XYZ: 'XYZ',
            XYM: 'XYM',
            XYZM: 'XYZM'
        };

        /**
         * @param {Array.<number>} flatCoordinates Flat coordinates.
         * @param {number} offset Offset.
         * @param {number} end End.
         * @param {number} stride Stride.
         */
        ol.geom.flat.reverse.coordinates = function(flatCoordinates, offset, end, stride) {
            while (offset < end - stride) {
                var i;
                for (i = 0; i < stride; ++i) {
                    var tmp = flatCoordinates[offset + i];
                    flatCoordinates[offset + i] = flatCoordinates[end - stride + i];
                    flatCoordinates[end - stride + i] = tmp;
                }
                offset += stride;
                end -= stride;
            }
        };

        /**
         * @param {Array.<number>} flatCoordinates Flat coordinates.
         * @param {number} offset Offset.
         * @param {number} end End.
         * @param {number} stride Stride.
         * @return {boolean} Is clockwise.
         */
        ol.geom.flat.orient.linearRingIsClockwise = function(flatCoordinates, offset, end, stride) {
            // http://tinyurl.com/clockwise-method
            // https://github.com/OSGeo/gdal/blob/trunk/gdal/ogr/ogrlinearring.cpp
            var edge = 0;
            var x1 = flatCoordinates[end - stride];
            var y1 = flatCoordinates[end - stride + 1];
            for (; offset < end; offset += stride) {
                var x2 = flatCoordinates[offset];
                var y2 = flatCoordinates[offset + 1];
                edge += (x2 - x1) * (y2 + y1);
                x1 = x2;
                y1 = y2;
            }
            return edge > 0;
        };


        /**
         * Determines if linear rings are oriented.  By default, left-hand orientation
         * is tested (first ring must be clockwise, remaining rings counter-clockwise).
         * To test for right-hand orientation, use the `opt_right` argument.
         *
         * @param {Array.<number>} flatCoordinates Flat coordinates.
         * @param {number} offset Offset.
         * @param {Array.<number>} ends Array of end indexes.
         * @param {number} stride Stride.
         * @param {boolean=} opt_right Test for right-hand orientation
         *     (counter-clockwise exterior ring and clockwise interior rings).
         * @return {boolean} Rings are correctly oriented.
         */
        ol.geom.flat.orient.linearRingsAreOriented = function(flatCoordinates, offset, ends, stride, opt_right) {
            var right = opt_right !== undefined ? opt_right : false;
            var i, ii;
            for (i = 0, ii = ends.length; i < ii; ++i) {
                var end = ends[i];
                var isClockwise = ol.geom.flat.orient.linearRingIsClockwise(
                    flatCoordinates, offset, end, stride);
                if (i === 0) {
                    if ((right && isClockwise) || (!right && !isClockwise)) {
                        return false;
                    }
                } else {
                    if ((right && !isClockwise) || (!right && isClockwise)) {
                        return false;
                    }
                }
                offset = end;
            }
            return true;
        };


        /**
         * Determines if linear rings are oriented.  By default, left-hand orientation
         * is tested (first ring must be clockwise, remaining rings counter-clockwise).
         * To test for right-hand orientation, use the `opt_right` argument.
         *
         * @param {Array.<number>} flatCoordinates Flat coordinates.
         * @param {number} offset Offset.
         * @param {Array.<Array.<number>>} endss Array of array of end indexes.
         * @param {number} stride Stride.
         * @param {boolean=} opt_right Test for right-hand orientation
         *     (counter-clockwise exterior ring and clockwise interior rings).
         * @return {boolean} Rings are correctly oriented.
         */
        ol.geom.flat.orient.linearRingssAreOriented = function(flatCoordinates, offset, endss, stride, opt_right) {
            var i, ii;
            for (i = 0, ii = endss.length; i < ii; ++i) {
                if (!ol.geom.flat.orient.linearRingsAreOriented(
                    flatCoordinates, offset, endss[i], stride, opt_right)) {
                    return false;
                }
            }
            return true;
        };


        /**
         * Orient coordinates in a flat array of linear rings.  By default, rings
         * are oriented following the left-hand rule (clockwise for exterior and
         * counter-clockwise for interior rings).  To orient according to the
         * right-hand rule, use the `opt_right` argument.
         *
         * @param {Array.<number>} flatCoordinates Flat coordinates.
         * @param {number} offset Offset.
         * @param {Array.<number>} ends Ends.
         * @param {number} stride Stride.
         * @param {boolean=} opt_right Follow the right-hand rule for orientation.
         * @return {number} End.
         */
        ol.geom.flat.orient.orientLinearRings = function(flatCoordinates, offset, ends, stride, opt_right) {
            var right = opt_right !== undefined ? opt_right : false;
            var i, ii;
            for (i = 0, ii = ends.length; i < ii; ++i) {
                var end = ends[i];
                var isClockwise = ol.geom.flat.orient.linearRingIsClockwise(
                    flatCoordinates, offset, end, stride);
                var reverse = i === 0 ?
                    (right && isClockwise) || (!right && !isClockwise) :
                    (right && !isClockwise) || (!right && isClockwise);
                if (reverse) {
                    ol.geom.flat.reverse.coordinates(flatCoordinates, offset, end, stride);
                }
                offset = end;
            }
            return offset;
        };


        /**
         * Orient coordinates in a flat array of linear rings.  By default, rings
         * are oriented following the left-hand rule (clockwise for exterior and
         * counter-clockwise for interior rings).  To orient according to the
         * right-hand rule, use the `opt_right` argument.
         *
         * @param {Array.<number>} flatCoordinates Flat coordinates.
         * @param {number} offset Offset.
         * @param {Array.<Array.<number>>} endss Array of array of end indexes.
         * @param {number} stride Stride.
         * @param {boolean=} opt_right Follow the right-hand rule for orientation.
         * @return {number} End.
         */
        ol.geom.flat.orient.orientLinearRingss = function(flatCoordinates, offset, endss, stride, opt_right) {
            var i, ii;
            for (i = 0, ii = endss.length; i < ii; ++i) {
                offset = ol.geom.flat.orient.orientLinearRings(
                    flatCoordinates, offset, endss[i], stride, opt_right);
            }
            return offset;
        };

        ol.geom.flat.simplify = {};

        /**
         * @param {Array.<number>} flatCoordinates Flat coordinates.
         * @param {number} offset Offset.
         * @param {number} end End.
         * @param {number} stride Stride.
         * @param {number} squaredTolerance Squared tolerance.
         * @param {boolean} highQuality Highest quality.
         * @param {Array.<number>=} opt_simplifiedFlatCoordinates Simplified flat
         *     coordinates.
         * @return {Array.<number>} Simplified line string.
         */
        ol.geom.flat.simplify.lineString = function(flatCoordinates, offset, end,
                                                    stride, squaredTolerance, highQuality, opt_simplifiedFlatCoordinates) {
            var simplifiedFlatCoordinates = opt_simplifiedFlatCoordinates !== undefined ?
                opt_simplifiedFlatCoordinates : [];
            if (!highQuality) {
                end = ol.geom.flat.simplify.radialDistance(flatCoordinates, offset, end,
                    stride, squaredTolerance,
                    simplifiedFlatCoordinates, 0);
                flatCoordinates = simplifiedFlatCoordinates;
                offset = 0;
                stride = 2;
            }
            simplifiedFlatCoordinates.length = ol.geom.flat.simplify.douglasPeucker(
                flatCoordinates, offset, end, stride, squaredTolerance,
                simplifiedFlatCoordinates, 0);
            return simplifiedFlatCoordinates;
        };


        /**
         * @param {Array.<number>} flatCoordinates Flat coordinates.
         * @param {number} offset Offset.
         * @param {number} end End.
         * @param {number} stride Stride.
         * @param {number} squaredTolerance Squared tolerance.
         * @param {Array.<number>} simplifiedFlatCoordinates Simplified flat
         *     coordinates.
         * @param {number} simplifiedOffset Simplified offset.
         * @return {number} Simplified offset.
         */
        ol.geom.flat.simplify.douglasPeucker = function(flatCoordinates, offset, end,
                                                        stride, squaredTolerance, simplifiedFlatCoordinates, simplifiedOffset) {
            var n = (end - offset) / stride;
            if (n < 3) {
                for (; offset < end; offset += stride) {
                    simplifiedFlatCoordinates[simplifiedOffset++] =
                        flatCoordinates[offset];
                    simplifiedFlatCoordinates[simplifiedOffset++] =
                        flatCoordinates[offset + 1];
                }
                return simplifiedOffset;
            }
            /** @type {Array.<number>} */
            var markers = new Array(n);
            markers[0] = 1;
            markers[n - 1] = 1;
            /** @type {Array.<number>} */
            var stack = [offset, end - stride];
            var index = 0;
            var i;
            while (stack.length > 0) {
                var last = stack.pop();
                var first = stack.pop();
                var maxSquaredDistance = 0;
                var x1 = flatCoordinates[first];
                var y1 = flatCoordinates[first + 1];
                var x2 = flatCoordinates[last];
                var y2 = flatCoordinates[last + 1];
                for (i = first + stride; i < last; i += stride) {
                    var x = flatCoordinates[i];
                    var y = flatCoordinates[i + 1];
                    var squaredDistance = ol.math.squaredSegmentDistance(
                        x, y, x1, y1, x2, y2);
                    if (squaredDistance > maxSquaredDistance) {
                        index = i;
                        maxSquaredDistance = squaredDistance;
                    }
                }
                if (maxSquaredDistance > squaredTolerance) {
                    markers[(index - offset) / stride] = 1;
                    if (first + stride < index) {
                        stack.push(first, index);
                    }
                    if (index + stride < last) {
                        stack.push(index, last);
                    }
                }
            }
            for (i = 0; i < n; ++i) {
                if (markers[i]) {
                    simplifiedFlatCoordinates[simplifiedOffset++] =
                        flatCoordinates[offset + i * stride];
                    simplifiedFlatCoordinates[simplifiedOffset++] =
                        flatCoordinates[offset + i * stride + 1];
                }
            }
            return simplifiedOffset;
        };


        /**
         * @param {Array.<number>} flatCoordinates Flat coordinates.
         * @param {number} offset Offset.
         * @param {Array.<number>} ends Ends.
         * @param {number} stride Stride.
         * @param {number} squaredTolerance Squared tolerance.
         * @param {Array.<number>} simplifiedFlatCoordinates Simplified flat
         *     coordinates.
         * @param {number} simplifiedOffset Simplified offset.
         * @param {Array.<number>} simplifiedEnds Simplified ends.
         * @return {number} Simplified offset.
         */
        ol.geom.flat.simplify.douglasPeuckers = function(flatCoordinates, offset,
                                                         ends, stride, squaredTolerance, simplifiedFlatCoordinates,
                                                         simplifiedOffset, simplifiedEnds) {
            var i, ii;
            for (i = 0, ii = ends.length; i < ii; ++i) {
                var end = ends[i];
                simplifiedOffset = ol.geom.flat.simplify.douglasPeucker(
                    flatCoordinates, offset, end, stride, squaredTolerance,
                    simplifiedFlatCoordinates, simplifiedOffset);
                simplifiedEnds.push(simplifiedOffset);
                offset = end;
            }
            return simplifiedOffset;
        };


        /**
         * @param {Array.<number>} flatCoordinates Flat coordinates.
         * @param {number} offset Offset.
         * @param {Array.<Array.<number>>} endss Endss.
         * @param {number} stride Stride.
         * @param {number} squaredTolerance Squared tolerance.
         * @param {Array.<number>} simplifiedFlatCoordinates Simplified flat
         *     coordinates.
         * @param {number} simplifiedOffset Simplified offset.
         * @param {Array.<Array.<number>>} simplifiedEndss Simplified endss.
         * @return {number} Simplified offset.
         */
        ol.geom.flat.simplify.douglasPeuckerss = function(
            flatCoordinates, offset, endss, stride, squaredTolerance,
            simplifiedFlatCoordinates, simplifiedOffset, simplifiedEndss) {
            var i, ii;
            for (i = 0, ii = endss.length; i < ii; ++i) {
                var ends = endss[i];
                var simplifiedEnds = [];
                simplifiedOffset = ol.geom.flat.simplify.douglasPeuckers(
                    flatCoordinates, offset, ends, stride, squaredTolerance,
                    simplifiedFlatCoordinates, simplifiedOffset, simplifiedEnds);
                simplifiedEndss.push(simplifiedEnds);
                offset = ends[ends.length - 1];
            }
            return simplifiedOffset;
        };


        /**
         * @param {Array.<number>} flatCoordinates Flat coordinates.
         * @param {number} offset Offset.
         * @param {number} end End.
         * @param {number} stride Stride.
         * @param {number} squaredTolerance Squared tolerance.
         * @param {Array.<number>} simplifiedFlatCoordinates Simplified flat
         *     coordinates.
         * @param {number} simplifiedOffset Simplified offset.
         * @return {number} Simplified offset.
         */
        ol.geom.flat.simplify.radialDistance = function(flatCoordinates, offset, end,
                                                        stride, squaredTolerance, simplifiedFlatCoordinates, simplifiedOffset) {
            if (end <= offset + stride) {
                // zero or one point, no simplification possible, so copy and return
                for (; offset < end; offset += stride) {
                    simplifiedFlatCoordinates[simplifiedOffset++] = flatCoordinates[offset];
                    simplifiedFlatCoordinates[simplifiedOffset++] =
                        flatCoordinates[offset + 1];
                }
                return simplifiedOffset;
            }
            var x1 = flatCoordinates[offset];
            var y1 = flatCoordinates[offset + 1];
            // copy first point
            simplifiedFlatCoordinates[simplifiedOffset++] = x1;
            simplifiedFlatCoordinates[simplifiedOffset++] = y1;
            var x2 = x1;
            var y2 = y1;
            for (offset += stride; offset < end; offset += stride) {
                x2 = flatCoordinates[offset];
                y2 = flatCoordinates[offset + 1];
                if (ol.math.squaredDistance(x1, y1, x2, y2) > squaredTolerance) {
                    // copy point at offset
                    simplifiedFlatCoordinates[simplifiedOffset++] = x2;
                    simplifiedFlatCoordinates[simplifiedOffset++] = y2;
                    x1 = x2;
                    y1 = y2;
                }
            }
            if (x2 != x1 || y2 != y1) {
                // copy last point
                simplifiedFlatCoordinates[simplifiedOffset++] = x2;
                simplifiedFlatCoordinates[simplifiedOffset++] = y2;
            }
            return simplifiedOffset;
        };


        /**
         * @param {number} value Value.
         * @param {number} tolerance Tolerance.
         * @return {number} Rounded value.
         */
        ol.geom.flat.simplify.snap = function(value, tolerance) {
            return tolerance * Math.round(value / tolerance);
        };


        /**
         * Simplifies a line string using an algorithm designed by Tim Schaub.
         * Coordinates are snapped to the nearest value in a virtual grid and
         * consecutive duplicate coordinates are discarded.  This effectively preserves
         * topology as the simplification of any subsection of a line string is
         * independent of the rest of the line string.  This means that, for examples,
         * the common edge between two polygons will be simplified to the same line
         * string independently in both polygons.  This implementation uses a single
         * pass over the coordinates and eliminates intermediate collinear points.
         * @param {Array.<number>} flatCoordinates Flat coordinates.
         * @param {number} offset Offset.
         * @param {number} end End.
         * @param {number} stride Stride.
         * @param {number} tolerance Tolerance.
         * @param {Array.<number>} simplifiedFlatCoordinates Simplified flat
         *     coordinates.
         * @param {number} simplifiedOffset Simplified offset.
         * @return {number} Simplified offset.
         */
        ol.geom.flat.simplify.quantize = function(flatCoordinates, offset, end, stride,
                                                  tolerance, simplifiedFlatCoordinates, simplifiedOffset) {
            // do nothing if the line is empty
            if (offset == end) {
                return simplifiedOffset;
            }
            // snap the first coordinate (P1)
            var x1 = ol.geom.flat.simplify.snap(flatCoordinates[offset], tolerance);
            var y1 = ol.geom.flat.simplify.snap(flatCoordinates[offset + 1], tolerance);
            offset += stride;
            // add the first coordinate to the output
            simplifiedFlatCoordinates[simplifiedOffset++] = x1;
            simplifiedFlatCoordinates[simplifiedOffset++] = y1;
            // find the next coordinate that does not snap to the same value as the first
            // coordinate (P2)
            var x2, y2;
            do {
                x2 = ol.geom.flat.simplify.snap(flatCoordinates[offset], tolerance);
                y2 = ol.geom.flat.simplify.snap(flatCoordinates[offset + 1], tolerance);
                offset += stride;
                if (offset == end) {
                    // all coordinates snap to the same value, the line collapses to a point
                    // push the last snapped value anyway to ensure that the output contains
                    // at least two points
                    // FIXME should we really return at least two points anyway?
                    simplifiedFlatCoordinates[simplifiedOffset++] = x2;
                    simplifiedFlatCoordinates[simplifiedOffset++] = y2;
                    return simplifiedOffset;
                }
            } while (x2 == x1 && y2 == y1);
            while (offset < end) {
                var x3, y3;
                // snap the next coordinate (P3)
                x3 = ol.geom.flat.simplify.snap(flatCoordinates[offset], tolerance);
                y3 = ol.geom.flat.simplify.snap(flatCoordinates[offset + 1], tolerance);
                offset += stride;
                // skip P3 if it is equal to P2
                if (x3 == x2 && y3 == y2) {
                    continue;
                }
                // calculate the delta between P1 and P2
                var dx1 = x2 - x1;
                var dy1 = y2 - y1;
                // calculate the delta between P3 and P1
                var dx2 = x3 - x1;
                var dy2 = y3 - y1;
                // if P1, P2, and P3 are colinear and P3 is further from P1 than P2 is from
                // P1 in the same direction then P2 is on the straight line between P1 and
                // P3
                if ((dx1 * dy2 == dy1 * dx2) &&
                    ((dx1 < 0 && dx2 < dx1) || dx1 == dx2 || (dx1 > 0 && dx2 > dx1)) &&
                    ((dy1 < 0 && dy2 < dy1) || dy1 == dy2 || (dy1 > 0 && dy2 > dy1))) {
                    // discard P2 and set P2 = P3
                    x2 = x3;
                    y2 = y3;
                    continue;
                }
                // either P1, P2, and P3 are not colinear, or they are colinear but P3 is
                // between P3 and P1 or on the opposite half of the line to P2.  add P2,
                // and continue with P1 = P2 and P2 = P3
                simplifiedFlatCoordinates[simplifiedOffset++] = x2;
                simplifiedFlatCoordinates[simplifiedOffset++] = y2;
                x1 = x2;
                y1 = y2;
                x2 = x3;
                y2 = y3;
            }
            // add the last point (P2)
            simplifiedFlatCoordinates[simplifiedOffset++] = x2;
            simplifiedFlatCoordinates[simplifiedOffset++] = y2;
            return simplifiedOffset;
        };


        /**
         * @param {Array.<number>} flatCoordinates Flat coordinates.
         * @param {number} offset Offset.
         * @param {Array.<number>} ends Ends.
         * @param {number} stride Stride.
         * @param {number} tolerance Tolerance.
         * @param {Array.<number>} simplifiedFlatCoordinates Simplified flat
         *     coordinates.
         * @param {number} simplifiedOffset Simplified offset.
         * @param {Array.<number>} simplifiedEnds Simplified ends.
         * @return {number} Simplified offset.
         */
        ol.geom.flat.simplify.quantizes = function(
            flatCoordinates, offset, ends, stride,
            tolerance,
            simplifiedFlatCoordinates, simplifiedOffset, simplifiedEnds) {
            var i, ii;
            for (i = 0, ii = ends.length; i < ii; ++i) {
                var end = ends[i];
                simplifiedOffset = ol.geom.flat.simplify.quantize(
                    flatCoordinates, offset, end, stride,
                    tolerance,
                    simplifiedFlatCoordinates, simplifiedOffset);
                simplifiedEnds.push(simplifiedOffset);
                offset = end;
            }
            return simplifiedOffset;
        };


        /**
         * @param {Array.<number>} flatCoordinates Flat coordinates.
         * @param {number} offset Offset.
         * @param {Array.<Array.<number>>} endss Endss.
         * @param {number} stride Stride.
         * @param {number} tolerance Tolerance.
         * @param {Array.<number>} simplifiedFlatCoordinates Simplified flat
         *     coordinates.
         * @param {number} simplifiedOffset Simplified offset.
         * @param {Array.<Array.<number>>} simplifiedEndss Simplified endss.
         * @return {number} Simplified offset.
         */
        ol.geom.flat.simplify.quantizess = function(
            flatCoordinates, offset, endss, stride,
            tolerance,
            simplifiedFlatCoordinates, simplifiedOffset, simplifiedEndss) {
            var i, ii;
            for (i = 0, ii = endss.length; i < ii; ++i) {
                var ends = endss[i];
                var simplifiedEnds = [];
                simplifiedOffset = ol.geom.flat.simplify.quantizes(
                    flatCoordinates, offset, ends, stride,
                    tolerance,
                    simplifiedFlatCoordinates, simplifiedOffset, simplifiedEnds);
                simplifiedEndss.push(simplifiedEnds);
                offset = ends[ends.length - 1];
            }
            return simplifiedOffset;
        };

        ol.geom.GeometryType = {
            POINT: 'Point',
            LINE_STRING: 'LineString',
            LINEAR_RING: 'LinearRing',
            POLYGON: 'Polygon',
            MULTI_POINT: 'MultiPoint',
            MULTI_LINE_STRING: 'MultiLineString',
            MULTI_POLYGON: 'MultiPolygon',
            GEOMETRY_COLLECTION: 'GeometryCollection',
            CIRCLE: 'Circle'
        };

        /**
         * @classdesc
         * Abstract base class; normally only used for creating subclasses and not
         * instantiated in apps.
         * Base class for vector geometries.
         *
         * To get notified of changes to the geometry, register a listener for the
         * generic `change` event on your geometry instance.
         *
         * @constructor
         * @abstract
         * @extends {ol.Object}
         * @api
         */
        ol.geom.Geometry = function() {

            ol.Object.call(this);

            /**
             * @private
             * @type {ol.Extent}
             */
            this.extent_ = ol.extent.createEmpty();

            /**
             * @private
             * @type {number}
             */
            this.extentRevision_ = -1;

            /**
             * @protected
             * @type {Object.<string, ol.geom.Geometry>}
             */
            this.simplifiedGeometryCache = {};

            /**
             * @protected
             * @type {number}
             */
            this.simplifiedGeometryMaxMinSquaredTolerance = 0;

            /**
             * @protected
             * @type {number}
             */
            this.simplifiedGeometryRevision = 0;

            /**
             * @private
             * @type {ol.Transform}
             */
            this.tmpTransform_ = ol.transform.create();

        };
        ol.inherits(ol.geom.Geometry, ol.Object);


        /**
         * Make a complete copy of the geometry.
         * @abstract
         * @return {!ol.geom.Geometry} Clone.
         */
        ol.geom.Geometry.prototype.clone = function() {};


        /**
         * @abstract
         * @param {number} x X.
         * @param {number} y Y.
         * @param {ol.Coordinate} closestPoint Closest point.
         * @param {number} minSquaredDistance Minimum squared distance.
         * @return {number} Minimum squared distance.
         */
        ol.geom.Geometry.prototype.closestPointXY = function(x, y, closestPoint, minSquaredDistance) {};


        /**
         * Return the closest point of the geometry to the passed point as
         * {@link ol.Coordinate coordinate}.
         * @param {ol.Coordinate} point Point.
         * @param {ol.Coordinate=} opt_closestPoint Closest point.
         * @return {ol.Coordinate} Closest point.
         * @api
         */
        ol.geom.Geometry.prototype.getClosestPoint = function(point, opt_closestPoint) {
            var closestPoint = opt_closestPoint ? opt_closestPoint : [NaN, NaN];
            this.closestPointXY(point[0], point[1], closestPoint, Infinity);
            return closestPoint;
        };


        /**
         * Returns true if this geometry includes the specified coordinate. If the
         * coordinate is on the boundary of the geometry, returns false.
         * @param {ol.Coordinate} coordinate Coordinate.
         * @return {boolean} Contains coordinate.
         * @api
         */
        ol.geom.Geometry.prototype.intersectsCoordinate = function(coordinate) {
            return this.containsXY(coordinate[0], coordinate[1]);
        };


        /**
         * @abstract
         * @param {ol.Extent} extent Extent.
         * @protected
         * @return {ol.Extent} extent Extent.
         */
        ol.geom.Geometry.prototype.computeExtent = function(extent) {};


        /**
         * @param {number} x X.
         * @param {number} y Y.
         * @return {boolean} Contains (x, y).
         */
        ol.geom.Geometry.prototype.containsXY = ol.functions.FALSE;


        /**
         * Get the extent of the geometry.
         * @param {ol.Extent=} opt_extent Extent.
         * @return {ol.Extent} extent Extent.
         * @api
         */
        ol.geom.Geometry.prototype.getExtent = function(opt_extent) {
            if (this.extentRevision_ != this.getRevision()) {
                this.extent_ = this.computeExtent(this.extent_);
                this.extentRevision_ = this.getRevision();
            }
            return ol.extent.returnOrUpdate(this.extent_, opt_extent);
        };


        /**
         * Rotate the geometry around a given coordinate. This modifies the geometry
         * coordinates in place.
         * @abstract
         * @param {number} angle Rotation angle in radians.
         * @param {ol.Coordinate} anchor The rotation center.
         * @api
         */
        ol.geom.Geometry.prototype.rotate = function(angle, anchor) {};


        /**
         * Scale the geometry (with an optional origin).  This modifies the geometry
         * coordinates in place.
         * @abstract
         * @param {number} sx The scaling factor in the x-direction.
         * @param {number=} opt_sy The scaling factor in the y-direction (defaults to
         *     sx).
         * @param {ol.Coordinate=} opt_anchor The scale origin (defaults to the center
         *     of the geometry extent).
         * @api
         */
        ol.geom.Geometry.prototype.scale = function(sx, opt_sy, opt_anchor) {};


        /**
         * Create a simplified version of this geometry.  For linestrings, this uses
         * the the {@link
         * https://en.wikipedia.org/wiki/Ramer-Douglas-Peucker_algorithm
         * Douglas Peucker} algorithm.  For polygons, a quantization-based
         * simplification is used to preserve topology.
         * @function
         * @param {number} tolerance The tolerance distance for simplification.
         * @return {ol.geom.Geometry} A new, simplified version of the original
         *     geometry.
         * @api
         */
        ol.geom.Geometry.prototype.simplify = function(tolerance) {
            return this.getSimplifiedGeometry(tolerance * tolerance);
        };


        /**
         * Create a simplified version of this geometry using the Douglas Peucker
         * algorithm.
         * @see https://en.wikipedia.org/wiki/Ramer-Douglas-Peucker_algorithm
         * @abstract
         * @param {number} squaredTolerance Squared tolerance.
         * @return {ol.geom.Geometry} Simplified geometry.
         */
        ol.geom.Geometry.prototype.getSimplifiedGeometry = function(squaredTolerance) {};


        /**
         * Get the type of this geometry.
         * @abstract
         * @return {ol.geom.GeometryType} Geometry type.
         */
        ol.geom.Geometry.prototype.getType = function() {};


        /**
         * Apply a transform function to each coordinate of the geometry.
         * The geometry is modified in place.
         * If you do not want the geometry modified in place, first `clone()` it and
         * then use this function on the clone.
         * @abstract
         * @param {ol.TransformFunction} transformFn Transform.
         */
        ol.geom.Geometry.prototype.applyTransform = function(transformFn) {};


        /**
         * Test if the geometry and the passed extent intersect.
         * @abstract
         * @param {ol.Extent} extent Extent.
         * @return {boolean} `true` if the geometry and the extent intersect.
         */
        ol.geom.Geometry.prototype.intersectsExtent = function(extent) {};


        /**
         * Translate the geometry.  This modifies the geometry coordinates in place.  If
         * instead you want a new geometry, first `clone()` this geometry.
         * @abstract
         * @param {number} deltaX Delta X.
         * @param {number} deltaY Delta Y.
         */
        ol.geom.Geometry.prototype.translate = function(deltaX, deltaY) {};


        /**
         * Transform each coordinate of the geometry from one coordinate reference
         * system to another. The geometry is modified in place.
         * For example, a line will be transformed to a line and a circle to a circle.
         * If you do not want the geometry modified in place, first `clone()` it and
         * then use this function on the clone.
         *
         * @param {ol.ProjectionLike} source The current projection.  Can be a
         *     string identifier or a {@link ol.proj.Projection} object.
         * @param {ol.ProjectionLike} destination The desired projection.  Can be a
         *     string identifier or a {@link ol.proj.Projection} object.
         * @return {ol.geom.Geometry} This geometry.  Note that original geometry is
         *     modified in place.
         * @api
         */
        ol.geom.Geometry.prototype.transform = function(source, destination) {
            var tmpTransform = this.tmpTransform_;
            source = ol.proj.get(source);
            var transformFn = source.getUnits() == ol.proj.Units.TILE_PIXELS ?
                function(inCoordinates, outCoordinates, stride) {
                    var pixelExtent = source.getExtent();
                    var projectedExtent = source.getWorldExtent();
                    var scale = ol.extent.getHeight(projectedExtent) / ol.extent.getHeight(pixelExtent);
                    ol.transform.compose(tmpTransform,
                        projectedExtent[0], projectedExtent[3],
                        scale, -scale, 0,
                        0, 0);
                    ol.geom.flat.transform.transform2D(inCoordinates, 0, inCoordinates.length, stride,
                        tmpTransform, outCoordinates);
                    return ol.proj.getTransform(source, destination)(inCoordinates, outCoordinates, stride);
                } :
                ol.proj.getTransform(source, destination);
            this.applyTransform(transformFn);
            return this;
        };


        /**
         * @classdesc
         * Abstract base class; only used for creating subclasses; do not instantiate
         * in apps, as cannot be rendered.
         *
         * @constructor
         * @abstract
         * @extends {ol.geom.Geometry}
         * @api
         */
        ol.geom.SimpleGeometry = function() {

            ol.geom.Geometry.call(this);

            /**
             * @protected
             * @type {ol.geom.GeometryLayout}
             */
            this.layout = ol.geom.GeometryLayout.XY;

            /**
             * @protected
             * @type {number}
             */
            this.stride = 2;

            /**
             * @protected
             * @type {Array.<number>}
             */
            this.flatCoordinates = null;

        };
        ol.inherits(ol.geom.SimpleGeometry, ol.geom.Geometry);


        /**
         * @param {number} stride Stride.
         * @private
         * @return {ol.geom.GeometryLayout} layout Layout.
         */
        ol.geom.SimpleGeometry.getLayoutForStride_ = function(stride) {
            var layout;
            if (stride == 2) {
                layout = ol.geom.GeometryLayout.XY;
            } else if (stride == 3) {
                layout = ol.geom.GeometryLayout.XYZ;
            } else if (stride == 4) {
                layout = ol.geom.GeometryLayout.XYZM;
            }
            return /** @type {ol.geom.GeometryLayout} */ (layout);
        };


        /**
         * @param {ol.geom.GeometryLayout} layout Layout.
         * @return {number} Stride.
         */
        ol.geom.SimpleGeometry.getStrideForLayout = function(layout) {
            var stride;
            if (layout == ol.geom.GeometryLayout.XY) {
                stride = 2;
            } else if (layout == ol.geom.GeometryLayout.XYZ || layout == ol.geom.GeometryLayout.XYM) {
                stride = 3;
            } else if (layout == ol.geom.GeometryLayout.XYZM) {
                stride = 4;
            }
            return /** @type {number} */ (stride);
        };


        /**
         * @inheritDoc
         */
        ol.geom.SimpleGeometry.prototype.containsXY = ol.functions.FALSE;


        /**
         * @inheritDoc
         */
        ol.geom.SimpleGeometry.prototype.computeExtent = function(extent) {
            return ol.extent.createOrUpdateFromFlatCoordinates(
                this.flatCoordinates, 0, this.flatCoordinates.length, this.stride,
                extent);
        };


        /**
         * @abstract
         * @return {Array} Coordinates.
         */
        ol.geom.SimpleGeometry.prototype.getCoordinates = function() {};


        /**
         * Return the first coordinate of the geometry.
         * @return {ol.Coordinate} First coordinate.
         * @api
         */
        ol.geom.SimpleGeometry.prototype.getFirstCoordinate = function() {
            return this.flatCoordinates.slice(0, this.stride);
        };


        /**
         * @return {Array.<number>} Flat coordinates.
         */
        ol.geom.SimpleGeometry.prototype.getFlatCoordinates = function() {
            return this.flatCoordinates;
        };


        /**
         * Return the last coordinate of the geometry.
         * @return {ol.Coordinate} Last point.
         * @api
         */
        ol.geom.SimpleGeometry.prototype.getLastCoordinate = function() {
            return this.flatCoordinates.slice(this.flatCoordinates.length - this.stride);
        };


        /**
         * Return the {@link ol.geom.GeometryLayout layout} of the geometry.
         * @return {ol.geom.GeometryLayout} Layout.
         * @api
         */
        ol.geom.SimpleGeometry.prototype.getLayout = function() {
            return this.layout;
        };


        /**
         * @inheritDoc
         */
        ol.geom.SimpleGeometry.prototype.getSimplifiedGeometry = function(squaredTolerance) {
            if (this.simplifiedGeometryRevision != this.getRevision()) {
                ol.obj.clear(this.simplifiedGeometryCache);
                this.simplifiedGeometryMaxMinSquaredTolerance = 0;
                this.simplifiedGeometryRevision = this.getRevision();
            }
            // If squaredTolerance is negative or if we know that simplification will not
            // have any effect then just return this.
            if (squaredTolerance < 0 ||
                (this.simplifiedGeometryMaxMinSquaredTolerance !== 0 &&
                    squaredTolerance <= this.simplifiedGeometryMaxMinSquaredTolerance)) {
                return this;
            }
            var key = squaredTolerance.toString();
            if (this.simplifiedGeometryCache.hasOwnProperty(key)) {
                return this.simplifiedGeometryCache[key];
            } else {
                var simplifiedGeometry =
                    this.getSimplifiedGeometryInternal(squaredTolerance);
                var simplifiedFlatCoordinates = simplifiedGeometry.getFlatCoordinates();
                if (simplifiedFlatCoordinates.length < this.flatCoordinates.length) {
                    this.simplifiedGeometryCache[key] = simplifiedGeometry;
                    return simplifiedGeometry;
                } else {
                    // Simplification did not actually remove any coordinates.  We now know
                    // that any calls to getSimplifiedGeometry with a squaredTolerance less
                    // than or equal to the current squaredTolerance will also not have any
                    // effect.  This allows us to short circuit simplification (saving CPU
                    // cycles) and prevents the cache of simplified geometries from filling
                    // up with useless identical copies of this geometry (saving memory).
                    this.simplifiedGeometryMaxMinSquaredTolerance = squaredTolerance;
                    return this;
                }
            }
        };


        /**
         * @param {number} squaredTolerance Squared tolerance.
         * @return {ol.geom.SimpleGeometry} Simplified geometry.
         * @protected
         */
        ol.geom.SimpleGeometry.prototype.getSimplifiedGeometryInternal = function(squaredTolerance) {
            return this;
        };


        /**
         * @return {number} Stride.
         */
        ol.geom.SimpleGeometry.prototype.getStride = function() {
            return this.stride;
        };


        /**
         * @param {ol.geom.GeometryLayout} layout Layout.
         * @param {Array.<number>} flatCoordinates Flat coordinates.
         * @protected
         */
        ol.geom.SimpleGeometry.prototype.setFlatCoordinatesInternal = function(layout, flatCoordinates) {
            this.stride = ol.geom.SimpleGeometry.getStrideForLayout(layout);
            this.layout = layout;
            this.flatCoordinates = flatCoordinates;
        };


        /**
         * @abstract
         * @param {Array} coordinates Coordinates.
         * @param {ol.geom.GeometryLayout=} opt_layout Layout.
         */
        ol.geom.SimpleGeometry.prototype.setCoordinates = function(coordinates, opt_layout) {};


        /**
         * @param {ol.geom.GeometryLayout|undefined} layout Layout.
         * @param {Array} coordinates Coordinates.
         * @param {number} nesting Nesting.
         * @protected
         */
        ol.geom.SimpleGeometry.prototype.setLayout = function(layout, coordinates, nesting) {
            /** @type {number} */
            var stride;
            if (layout) {
                stride = ol.geom.SimpleGeometry.getStrideForLayout(layout);
            } else {
                var i;
                for (i = 0; i < nesting; ++i) {
                    if (coordinates.length === 0) {
                        this.layout = ol.geom.GeometryLayout.XY;
                        this.stride = 2;
                        return;
                    } else {
                        coordinates = /** @type {Array} */ (coordinates[0]);
                    }
                }
                stride = coordinates.length;
                layout = ol.geom.SimpleGeometry.getLayoutForStride_(stride);
            }
            this.layout = layout;
            this.stride = stride;
        };


        /**
         * @inheritDoc
         * @api
         */
        ol.geom.SimpleGeometry.prototype.applyTransform = function(transformFn) {
            if (this.flatCoordinates) {
                transformFn(this.flatCoordinates, this.flatCoordinates, this.stride);
                this.changed();
            }
        };


        /**
         * @inheritDoc
         * @api
         */
        ol.geom.SimpleGeometry.prototype.rotate = function(angle, anchor) {
            var flatCoordinates = this.getFlatCoordinates();
            if (flatCoordinates) {
                var stride = this.getStride();
                ol.geom.flat.transform.rotate(
                    flatCoordinates, 0, flatCoordinates.length,
                    stride, angle, anchor, flatCoordinates);
                this.changed();
            }
        };


        /**
         * @inheritDoc
         * @api
         */
        ol.geom.SimpleGeometry.prototype.scale = function(sx, opt_sy, opt_anchor) {
            var sy = opt_sy;
            if (sy === undefined) {
                sy = sx;
            }
            var anchor = opt_anchor;
            if (!anchor) {
                anchor = ol.extent.getCenter(this.getExtent());
            }
            var flatCoordinates = this.getFlatCoordinates();
            if (flatCoordinates) {
                var stride = this.getStride();
                ol.geom.flat.transform.scale(
                    flatCoordinates, 0, flatCoordinates.length,
                    stride, sx, sy, anchor, flatCoordinates);
                this.changed();
            }
        };


        /**
         * @inheritDoc
         * @api
         */
        ol.geom.SimpleGeometry.prototype.translate = function(deltaX, deltaY) {
            var flatCoordinates = this.getFlatCoordinates();
            if (flatCoordinates) {
                var stride = this.getStride();
                ol.geom.flat.transform.translate(
                    flatCoordinates, 0, flatCoordinates.length, stride,
                    deltaX, deltaY, flatCoordinates);
                this.changed();
            }
        };


        /**
         * @param {ol.geom.SimpleGeometry} simpleGeometry Simple geometry.
         * @param {ol.Transform} transform Transform.
         * @param {Array.<number>=} opt_dest Destination.
         * @return {Array.<number>} Transformed flat coordinates.
         */
        ol.geom.SimpleGeometry.transform2D = function(simpleGeometry, transform, opt_dest) {
            var flatCoordinates = simpleGeometry.getFlatCoordinates();
            if (!flatCoordinates) {
                return null;
            } else {
                var stride = simpleGeometry.getStride();
                return ol.geom.flat.transform.transform2D(
                    flatCoordinates, 0, flatCoordinates.length, stride,
                    transform, opt_dest);
            }
        };

        ol.geom.Polygon = function(coordinates, opt_layout) {

            ol.geom.SimpleGeometry.call(this);

            /**
             * @type {Array.<number>}
             * @private
             */
            this.ends_ = [];

            /**
             * @private
             * @type {number}
             */
            this.flatInteriorPointRevision_ = -1;

            /**
             * @private
             * @type {ol.Coordinate}
             */
            this.flatInteriorPoint_ = null;

            /**
             * @private
             * @type {number}
             */
            this.maxDelta_ = -1;

            /**
             * @private
             * @type {number}
             */
            this.maxDeltaRevision_ = -1;

            /**
             * @private
             * @type {number}
             */
            this.orientedRevision_ = -1;

            /**
             * @private
             * @type {Array.<number>}
             */
            this.orientedFlatCoordinates_ = null;

            this.setCoordinates(coordinates, opt_layout);

        };
        ol.inherits(ol.geom.Polygon, ol.geom.SimpleGeometry);


        /**
         * Append the passed linear ring to this polygon.
         * @param {ol.geom.LinearRing} linearRing Linear ring.
         * @api
         */
        ol.geom.Polygon.prototype.appendLinearRing = function(linearRing) {
            if (!this.flatCoordinates) {
                this.flatCoordinates = linearRing.getFlatCoordinates().slice();
            } else {
                ol.array.extend(this.flatCoordinates, linearRing.getFlatCoordinates());
            }
            this.ends_.push(this.flatCoordinates.length);
            this.changed();
        };


        /**
         * Make a complete copy of the geometry.
         * @return {!ol.geom.Polygon} Clone.
         * @override
         * @api
         */
        ol.geom.Polygon.prototype.clone = function() {
            var polygon = new ol.geom.Polygon(null);
            polygon.setFlatCoordinates(
                this.layout, this.flatCoordinates.slice(), this.ends_.slice());
            return polygon;
        };


        /**
         * @inheritDoc
         */
        ol.geom.Polygon.prototype.closestPointXY = function(x, y, closestPoint, minSquaredDistance) {
            if (minSquaredDistance <
                ol.extent.closestSquaredDistanceXY(this.getExtent(), x, y)) {
                return minSquaredDistance;
            }
            if (this.maxDeltaRevision_ != this.getRevision()) {
                this.maxDelta_ = Math.sqrt(ol.geom.flat.closest.getsMaxSquaredDelta(
                    this.flatCoordinates, 0, this.ends_, this.stride, 0));
                this.maxDeltaRevision_ = this.getRevision();
            }
            return ol.geom.flat.closest.getsClosestPoint(
                this.flatCoordinates, 0, this.ends_, this.stride,
                this.maxDelta_, true, x, y, closestPoint, minSquaredDistance);
        };


        /**
         * @inheritDoc
         */
        ol.geom.Polygon.prototype.containsXY = function(x, y) {
            return ol.geom.flat.contains.linearRingsContainsXY(
                this.getOrientedFlatCoordinates(), 0, this.ends_, this.stride, x, y);
        };


        /**
         * Return the area of the polygon on projected plane.
         * @return {number} Area (on projected plane).
         * @api
         */
        ol.geom.Polygon.prototype.getArea = function() {
            return ol.geom.flat.area.linearRings(
                this.getOrientedFlatCoordinates(), 0, this.ends_, this.stride);
        };


        /**
         * Get the coordinate array for this geometry.  This array has the structure
         * of a GeoJSON coordinate array for polygons.
         *
         * @param {boolean=} opt_right Orient coordinates according to the right-hand
         *     rule (counter-clockwise for exterior and clockwise for interior rings).
         *     If `false`, coordinates will be oriented according to the left-hand rule
         *     (clockwise for exterior and counter-clockwise for interior rings).
         *     By default, coordinate orientation will depend on how the geometry was
         *     constructed.
         * @return {Array.<Array.<ol.Coordinate>>} Coordinates.
         * @override
         * @api
         */
        ol.geom.Polygon.prototype.getCoordinates = function(opt_right) {
            var flatCoordinates;
            if (opt_right !== undefined) {
                flatCoordinates = this.getOrientedFlatCoordinates().slice();
                ol.geom.flat.orient.orientLinearRings(
                    flatCoordinates, 0, this.ends_, this.stride, opt_right);
            } else {
                flatCoordinates = this.flatCoordinates;
            }

            return ol.geom.flat.inflate.coordinatess(
                flatCoordinates, 0, this.ends_, this.stride);
        };


        /**
         * @return {Array.<number>} Ends.
         */
        ol.geom.Polygon.prototype.getEnds = function() {
            return this.ends_;
        };


        /**
         * @return {Array.<number>} Interior point.
         */
        ol.geom.Polygon.prototype.getFlatInteriorPoint = function() {
            if (this.flatInteriorPointRevision_ != this.getRevision()) {
                var flatCenter = ol.extent.getCenter(this.getExtent());
                this.flatInteriorPoint_ = ol.geom.flat.interiorpoint.linearRings(
                    this.getOrientedFlatCoordinates(), 0, this.ends_, this.stride,
                    flatCenter, 0);
                this.flatInteriorPointRevision_ = this.getRevision();
            }
            return this.flatInteriorPoint_;
        };


        /**
         * Return an interior point of the polygon.
         * @return {ol.geom.Point} Interior point as XYM coordinate, where M is the
         * length of the horizontal intersection that the point belongs to.
         * @api
         */
        ol.geom.Polygon.prototype.getInteriorPoint = function() {
            return new ol.geom.Point(this.getFlatInteriorPoint(), ol.geom.GeometryLayout.XYM);
        };


        /**
         * Return the number of rings of the polygon,  this includes the exterior
         * ring and any interior rings.
         *
         * @return {number} Number of rings.
         * @api
         */
        ol.geom.Polygon.prototype.getLinearRingCount = function() {
            return this.ends_.length;
        };


        /**
         * Return the Nth linear ring of the polygon geometry. Return `null` if the
         * given index is out of range.
         * The exterior linear ring is available at index `0` and the interior rings
         * at index `1` and beyond.
         *
         * @param {number} index Index.
         * @return {ol.geom.LinearRing} Linear ring.
         * @api
         */
        ol.geom.Polygon.prototype.getLinearRing = function(index) {
            if (index < 0 || this.ends_.length <= index) {
                return null;
            }
            var linearRing = new ol.geom.LinearRing(null);
            linearRing.setFlatCoordinates(this.layout, this.flatCoordinates.slice(
                index === 0 ? 0 : this.ends_[index - 1], this.ends_[index]));
            return linearRing;
        };


        /**
         * Return the linear rings of the polygon.
         * @return {Array.<ol.geom.LinearRing>} Linear rings.
         * @api
         */
        ol.geom.Polygon.prototype.getLinearRings = function() {
            var layout = this.layout;
            var flatCoordinates = this.flatCoordinates;
            var ends = this.ends_;
            var linearRings = [];
            var offset = 0;
            var i, ii;
            for (i = 0, ii = ends.length; i < ii; ++i) {
                var end = ends[i];
                var linearRing = new ol.geom.LinearRing(null);
                linearRing.setFlatCoordinates(layout, flatCoordinates.slice(offset, end));
                linearRings.push(linearRing);
                offset = end;
            }
            return linearRings;
        };


        /**
         * @return {Array.<number>} Oriented flat coordinates.
         */
        ol.geom.Polygon.prototype.getOrientedFlatCoordinates = function() {
            if (this.orientedRevision_ != this.getRevision()) {
                var flatCoordinates = this.flatCoordinates;
                if (ol.geom.flat.orient.linearRingsAreOriented(
                    flatCoordinates, 0, this.ends_, this.stride)) {
                    this.orientedFlatCoordinates_ = flatCoordinates;
                } else {
                    this.orientedFlatCoordinates_ = flatCoordinates.slice();
                    this.orientedFlatCoordinates_.length =
                        ol.geom.flat.orient.orientLinearRings(
                            this.orientedFlatCoordinates_, 0, this.ends_, this.stride);
                }
                this.orientedRevision_ = this.getRevision();
            }
            return this.orientedFlatCoordinates_;
        };


        /**
         * @inheritDoc
         */
        ol.geom.Polygon.prototype.getSimplifiedGeometryInternal = function(squaredTolerance) {
            var simplifiedFlatCoordinates = [];
            var simplifiedEnds = [];
            simplifiedFlatCoordinates.length = ol.geom.flat.simplify.quantizes(
                this.flatCoordinates, 0, this.ends_, this.stride,
                Math.sqrt(squaredTolerance),
                simplifiedFlatCoordinates, 0, simplifiedEnds);
            var simplifiedPolygon = new ol.geom.Polygon(null);
            simplifiedPolygon.setFlatCoordinates(
                ol.geom.GeometryLayout.XY, simplifiedFlatCoordinates, simplifiedEnds);
            return simplifiedPolygon;
        };


        /**
         * @inheritDoc
         * @api
         */
        ol.geom.Polygon.prototype.getType = function() {
            return ol.geom.GeometryType.POLYGON;
        };


        /**
         * @inheritDoc
         * @api
         */
        ol.geom.Polygon.prototype.intersectsExtent = function(extent) {
            return ol.geom.flat.intersectsextent.linearRings(
                this.getOrientedFlatCoordinates(), 0, this.ends_, this.stride, extent);
        };


        /**
         * Set the coordinates of the polygon.
         * @param {Array.<Array.<ol.Coordinate>>} coordinates Coordinates.
         * @param {ol.geom.GeometryLayout=} opt_layout Layout.
         * @override
         * @api
         */
        ol.geom.Polygon.prototype.setCoordinates = function(coordinates, opt_layout) {
            if (!coordinates) {
                this.setFlatCoordinates(ol.geom.GeometryLayout.XY, null, this.ends_);
            } else {
                this.setLayout(opt_layout, coordinates, 2);
                if (!this.flatCoordinates) {
                    this.flatCoordinates = [];
                }
                var ends = ol.geom.flat.deflate.coordinatess(
                    this.flatCoordinates, 0, coordinates, this.stride, this.ends_);
                this.flatCoordinates.length = ends.length === 0 ? 0 : ends[ends.length - 1];
                //this.changed();
            }
        };


        /**
         * @param {ol.geom.GeometryLayout} layout Layout.
         * @param {Array.<number>} flatCoordinates Flat coordinates.
         * @param {Array.<number>} ends Ends.
         */
        ol.geom.Polygon.prototype.setFlatCoordinates = function(layout, flatCoordinates, ends) {
            this.setFlatCoordinatesInternal(layout, flatCoordinates);
            this.ends_ = ends;
            //this.changed();
        };


        /**
         * Create an approximation of a circle on the surface of a sphere.
         * @param {ol.Sphere} sphere The sphere.
         * @param {ol.Coordinate} center Center (`[lon, lat]` in degrees).
         * @param {number} radius The great-circle distance from the center to
         *     the polygon vertices.
         * @param {number=} opt_n Optional number of vertices for the resulting
         *     polygon. Default is `32`.
         * @return {ol.geom.Polygon} The "circular" polygon.
         * @api
         */
        ol.geom.Polygon.circular = function(sphere, center, radius, opt_n) {
            var n = opt_n ? opt_n : 32;
            /** @type {Array.<number>} */
            var flatCoordinates = [];
            var i;
            for (i = 0; i < n; ++i) {
                ol.array.extend(
                    flatCoordinates, sphere.offset(center, radius, 2 * Math.PI * i / n));
            }
            flatCoordinates.push(flatCoordinates[0], flatCoordinates[1]);
            var polygon = new ol.geom.Polygon(null);
            polygon.setFlatCoordinates(
                ol.geom.GeometryLayout.XY, flatCoordinates, [flatCoordinates.length]);
            return polygon;
        };


        /**
         * Create a polygon from an extent. The layout used is `XY`.
         * @param {ol.Extent} extent The extent.
         * @return {ol.geom.Polygon} The polygon.
         * @api
         */
        ol.geom.Polygon.fromExtent = function(extent) {
            var minX = extent[0];
            var minY = extent[1];
            var maxX = extent[2];
            var maxY = extent[3];
            var flatCoordinates =
                [minX, minY, minX, maxY, maxX, maxY, maxX, minY, minX, minY];
            var polygon = new ol.geom.Polygon(null);
            polygon.setFlatCoordinates(
                ol.geom.GeometryLayout.XY, flatCoordinates, [flatCoordinates.length]);
            return polygon;
        };


        /**
         * Create a regular polygon from a circle.
         * @param {ol.geom.Circle} circle Circle geometry.
         * @param {number=} opt_sides Number of sides of the polygon. Default is 32.
         * @param {number=} opt_angle Start angle for the first vertex of the polygon in
         *     radians. Default is 0.
         * @return {ol.geom.Polygon} Polygon geometry.
         * @api
         */
        ol.geom.Polygon.fromCircle = function(circle, opt_sides, opt_angle) {
            var sides = opt_sides ? opt_sides : 32;
            var stride = circle.getStride();
            var layout = circle.getLayout();
            var polygon = new ol.geom.Polygon(null, layout);
            var arrayLength = stride * (sides + 1);
            var flatCoordinates = new Array(arrayLength);
            for (var i = 0; i < arrayLength; i++) {
                flatCoordinates[i] = 0;
            }
            var ends = [flatCoordinates.length];
            polygon.setFlatCoordinates(layout, flatCoordinates, ends);
            ol.geom.Polygon.makeRegular(
                polygon, circle.getCenter(), circle.getRadius(), opt_angle);
            return polygon;
        };


        /**
         * Modify the coordinates of a polygon to make it a regular polygon.
         * @param {ol.geom.Polygon} polygon Polygon geometry.
         * @param {ol.Coordinate} center Center of the regular polygon.
         * @param {number} radius Radius of the regular polygon.
         * @param {number=} opt_angle Start angle for the first vertex of the polygon in
         *     radians. Default is 0.
         */
        ol.geom.Polygon.makeRegular = function(polygon, center, radius, opt_angle) {
            var flatCoordinates = polygon.getFlatCoordinates();
            var layout = polygon.getLayout();
            var stride = polygon.getStride();
            var ends = polygon.getEnds();
            var sides = flatCoordinates.length / stride - 1;
            var startAngle = opt_angle ? opt_angle : 0;
            var angle, offset;
            for (var i = 0; i <= sides; ++i) {
                offset = i * stride;
                angle = startAngle + (ol.math.modulo(i, sides) * 2 * Math.PI / sides);
                flatCoordinates[offset] = center[0] + (radius * Math.cos(angle));
                flatCoordinates[offset + 1] = center[1] + (radius * Math.sin(angle));
            }
            polygon.setFlatCoordinates(layout, flatCoordinates, ends);
        };

        /**
         * @classdesc
         * Linestring geometry.
         *
         * @constructor
         * @extends {ol.geom.SimpleGeometry}
         * @param {Array.<ol.Coordinate>} coordinates Coordinates.
         * @param {ol.geom.GeometryLayout=} opt_layout Layout.
         * @api
         */
        ol.geom.LineString = function(coordinates, opt_layout) {

            ol.geom.SimpleGeometry.call(this);

            /**
             * @private
             * @type {ol.Coordinate}
             */
            this.flatMidpoint_ = null;

            /**
             * @private
             * @type {number}
             */
            this.flatMidpointRevision_ = -1;

            /**
             * @private
             * @type {number}
             */
            this.maxDelta_ = -1;

            /**
             * @private
             * @type {number}
             */
            this.maxDeltaRevision_ = -1;

            this.setCoordinates(coordinates, opt_layout);

        };
        ol.inherits(ol.geom.LineString, ol.geom.SimpleGeometry);


        /**
         * Append the passed coordinate to the coordinates of the linestring.
         * @param {ol.Coordinate} coordinate Coordinate.
         * @api
         */
        ol.geom.LineString.prototype.appendCoordinate = function(coordinate) {
            if (!this.flatCoordinates) {
                this.flatCoordinates = coordinate.slice();
            } else {
                ol.array.extend(this.flatCoordinates, coordinate);
            }
            this.changed();
        };


        /**
         * Make a complete copy of the geometry.
         * @return {!ol.geom.LineString} Clone.
         * @override
         * @api
         */
        ol.geom.LineString.prototype.clone = function() {
            var lineString = new ol.geom.LineString(null);
            lineString.setFlatCoordinates(this.layout, this.flatCoordinates.slice());
            return lineString;
        };


        /**
         * @inheritDoc
         */
        ol.geom.LineString.prototype.closestPointXY = function(x, y, closestPoint, minSquaredDistance) {
            if (minSquaredDistance <
                ol.extent.closestSquaredDistanceXY(this.getExtent(), x, y)) {
                return minSquaredDistance;
            }
            if (this.maxDeltaRevision_ != this.getRevision()) {
                this.maxDelta_ = Math.sqrt(ol.geom.flat.closest.getMaxSquaredDelta(
                    this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, 0));
                this.maxDeltaRevision_ = this.getRevision();
            }
            return ol.geom.flat.closest.getClosestPoint(
                this.flatCoordinates, 0, this.flatCoordinates.length, this.stride,
                this.maxDelta_, false, x, y, closestPoint, minSquaredDistance);
        };


        /**
         * Iterate over each segment, calling the provided callback.
         * If the callback returns a truthy value the function returns that
         * value immediately. Otherwise the function returns `false`.
         *
         * @param {function(this: S, ol.Coordinate, ol.Coordinate): T} callback Function
         *     called for each segment.
         * @param {S=} opt_this The object to be used as the value of 'this'
         *     within callback.
         * @return {T|boolean} Value.
         * @template T,S
         * @api
         */
        ol.geom.LineString.prototype.forEachSegment = function(callback, opt_this) {
            return ol.geom.flat.segments.forEach(this.flatCoordinates, 0,
                this.flatCoordinates.length, this.stride, callback, opt_this);
        };


        /**
         * Returns the coordinate at `m` using linear interpolation, or `null` if no
         * such coordinate exists.
         *
         * `opt_extrapolate` controls extrapolation beyond the range of Ms in the
         * MultiLineString. If `opt_extrapolate` is `true` then Ms less than the first
         * M will return the first coordinate and Ms greater than the last M will
         * return the last coordinate.
         *
         * @param {number} m M.
         * @param {boolean=} opt_extrapolate Extrapolate. Default is `false`.
         * @return {ol.Coordinate} Coordinate.
         * @api
         */
        ol.geom.LineString.prototype.getCoordinateAtM = function(m, opt_extrapolate) {
            if (this.layout != ol.geom.GeometryLayout.XYM &&
                this.layout != ol.geom.GeometryLayout.XYZM) {
                return null;
            }
            var extrapolate = opt_extrapolate !== undefined ? opt_extrapolate : false;
            return ol.geom.flat.interpolate.lineStringCoordinateAtM(this.flatCoordinates, 0,
                this.flatCoordinates.length, this.stride, m, extrapolate);
        };


        /**
         * Return the coordinates of the linestring.
         * @return {Array.<ol.Coordinate>} Coordinates.
         * @override
         * @api
         */
        ol.geom.LineString.prototype.getCoordinates = function() {
            return ol.geom.flat.inflate.coordinates(
                this.flatCoordinates, 0, this.flatCoordinates.length, this.stride);
        };


        /**
         * Return the coordinate at the provided fraction along the linestring.
         * The `fraction` is a number between 0 and 1, where 0 is the start of the
         * linestring and 1 is the end.
         * @param {number} fraction Fraction.
         * @param {ol.Coordinate=} opt_dest Optional coordinate whose values will
         *     be modified. If not provided, a new coordinate will be returned.
         * @return {ol.Coordinate} Coordinate of the interpolated point.
         * @api
         */
        ol.geom.LineString.prototype.getCoordinateAt = function(fraction, opt_dest) {
            return ol.geom.flat.interpolate.lineString(
                this.flatCoordinates, 0, this.flatCoordinates.length, this.stride,
                fraction, opt_dest);
        };


        /**
         * Return the length of the linestring on projected plane.
         * @return {number} Length (on projected plane).
         * @api
         */
        ol.geom.LineString.prototype.getLength = function() {
            return ol.geom.flat.length.lineString(
                this.flatCoordinates, 0, this.flatCoordinates.length, this.stride);
        };


        /**
         * @return {Array.<number>} Flat midpoint.
         */
        ol.geom.LineString.prototype.getFlatMidpoint = function() {
            if (this.flatMidpointRevision_ != this.getRevision()) {
                this.flatMidpoint_ = this.getCoordinateAt(0.5, this.flatMidpoint_);
                this.flatMidpointRevision_ = this.getRevision();
            }
            return this.flatMidpoint_;
        };


        /**
         * @inheritDoc
         */
        ol.geom.LineString.prototype.getSimplifiedGeometryInternal = function(squaredTolerance) {
            var simplifiedFlatCoordinates = [];
            simplifiedFlatCoordinates.length = ol.geom.flat.simplify.douglasPeucker(
                this.flatCoordinates, 0, this.flatCoordinates.length, this.stride,
                squaredTolerance, simplifiedFlatCoordinates, 0);
            var simplifiedLineString = new ol.geom.LineString(null);
            simplifiedLineString.setFlatCoordinates(
                ol.geom.GeometryLayout.XY, simplifiedFlatCoordinates);
            return simplifiedLineString;
        };


        /**
         * @inheritDoc
         * @api
         */
        ol.geom.LineString.prototype.getType = function() {
            return ol.geom.GeometryType.LINE_STRING;
        };


        /**
         * @inheritDoc
         * @api
         */
        ol.geom.LineString.prototype.intersectsExtent = function(extent) {
            return ol.geom.flat.intersectsextent.lineString(
                this.flatCoordinates, 0, this.flatCoordinates.length, this.stride,
                extent);
        };


        /**
         * Set the coordinates of the linestring.
         * @param {Array.<ol.Coordinate>} coordinates Coordinates.
         * @param {ol.geom.GeometryLayout=} opt_layout Layout.
         * @override
         * @api
         */
        ol.geom.LineString.prototype.setCoordinates = function(coordinates, opt_layout) {
            if (!coordinates) {
                this.setFlatCoordinates(ol.geom.GeometryLayout.XY, null);
            } else {
                this.setLayout(opt_layout, coordinates, 1);
                if (!this.flatCoordinates) {
                    this.flatCoordinates = [];
                }
                this.flatCoordinates.length = ol.geom.flat.deflate.coordinates(
                    this.flatCoordinates, 0, coordinates, this.stride);
                this.changed();
            }
        };


        /**
         * @param {ol.geom.GeometryLayout} layout Layout.
         * @param {Array.<number>} flatCoordinates Flat coordinates.
         */
        ol.geom.LineString.prototype.setFlatCoordinates = function(layout, flatCoordinates) {
            this.setFlatCoordinatesInternal(layout, flatCoordinates);
            this.changed();
        };

        ol.geom.Point = function(coordinates, opt_layout) {
            ol.geom.SimpleGeometry.call(this);
            this.setCoordinates(coordinates, opt_layout);
        };
        ol.inherits(ol.geom.Point, ol.geom.SimpleGeometry);

        ol.geom.Point.prototype.clone = function() {
            var point = new ol.geom.Point(null);
            point.setFlatCoordinates(this.layout, this.flatCoordinates.slice());
            return point;
        };


        /**
         * @inheritDoc
         */
        ol.geom.Point.prototype.closestPointXY = function(x, y, closestPoint, minSquaredDistance) {
            var flatCoordinates = this.flatCoordinates;
            var squaredDistance = ol.math.squaredDistance(
                x, y, flatCoordinates[0], flatCoordinates[1]);
            if (squaredDistance < minSquaredDistance) {
                var stride = this.stride;
                var i;
                for (i = 0; i < stride; ++i) {
                    closestPoint[i] = flatCoordinates[i];
                }
                closestPoint.length = stride;
                return squaredDistance;
            } else {
                return minSquaredDistance;
            }
        };

        ol.geom.Point.prototype.getCoordinates = function() {
            return !this.flatCoordinates ? [] : this.flatCoordinates.slice();
        };

        ol.geom.Point.prototype.computeExtent = function(extent) {
            return ol.extent.createOrUpdateFromCoordinate(this.flatCoordinates, extent);
        };

        ol.geom.Point.prototype.getType = function() {
            return ol.geom.GeometryType.POINT;
        };

        ol.geom.Point.prototype.intersectsExtent = function(extent) {
            return ol.extent.containsXY(extent,
                this.flatCoordinates[0], this.flatCoordinates[1]);
        };

        ol.geom.Point.prototype.setCoordinates = function(coordinates, opt_layout) {
            if (!coordinates) {
                this.setFlatCoordinates(ol.geom.GeometryLayout.XY, null);
            } else {
                this.setLayout(opt_layout, coordinates, 0);
                if (!this.flatCoordinates) {
                    this.flatCoordinates = [];
                }
                this.flatCoordinates.length = ol.geom.flat.deflate.coordinate(
                    this.flatCoordinates, 0, coordinates, this.stride);
                this.changed();
            }
        };

        ol.geom.Point.prototype.setFlatCoordinates = function(layout, flatCoordinates) {
            this.setFlatCoordinatesInternal(layout, flatCoordinates);
            this.changed();
        };

        /**
         * @classdesc
         * Multi-linestring geometry.
         *
         * @constructor
         * @extends {ol.geom.SimpleGeometry}
         * @param {Array.<Array.<ol.Coordinate>>} coordinates Coordinates.
         * @param {ol.geom.GeometryLayout=} opt_layout Layout.
         * @api
         */
        ol.geom.MultiLineString = function(coordinates, opt_layout) {

            ol.geom.SimpleGeometry.call(this);

            /**
             * @type {Array.<number>}
             * @private
             */
            this.ends_ = [];

            /**
             * @private
             * @type {number}
             */
            this.maxDelta_ = -1;

            /**
             * @private
             * @type {number}
             */
            this.maxDeltaRevision_ = -1;

            this.setCoordinates(coordinates, opt_layout);

        };
        ol.inherits(ol.geom.MultiLineString, ol.geom.SimpleGeometry);


        /**
         * Append the passed linestring to the multilinestring.
         * @param {ol.geom.LineString} lineString LineString.
         * @api
         */
        ol.geom.MultiLineString.prototype.appendLineString = function(lineString) {
            if (!this.flatCoordinates) {
                this.flatCoordinates = lineString.getFlatCoordinates().slice();
            } else {
                ol.array.extend(
                    this.flatCoordinates, lineString.getFlatCoordinates().slice());
            }
            this.ends_.push(this.flatCoordinates.length);
            this.changed();
        };


        /**
         * Make a complete copy of the geometry.
         * @return {!ol.geom.MultiLineString} Clone.
         * @override
         * @api
         */
        ol.geom.MultiLineString.prototype.clone = function() {
            var multiLineString = new ol.geom.MultiLineString(null);
            multiLineString.setFlatCoordinates(
                this.layout, this.flatCoordinates.slice(), this.ends_.slice());
            return multiLineString;
        };


        /**
         * @inheritDoc
         */
        ol.geom.MultiLineString.prototype.closestPointXY = function(x, y, closestPoint, minSquaredDistance) {
            if (minSquaredDistance <
                ol.extent.closestSquaredDistanceXY(this.getExtent(), x, y)) {
                return minSquaredDistance;
            }
            if (this.maxDeltaRevision_ != this.getRevision()) {
                this.maxDelta_ = Math.sqrt(ol.geom.flat.closest.getsMaxSquaredDelta(
                    this.flatCoordinates, 0, this.ends_, this.stride, 0));
                this.maxDeltaRevision_ = this.getRevision();
            }
            return ol.geom.flat.closest.getsClosestPoint(
                this.flatCoordinates, 0, this.ends_, this.stride,
                this.maxDelta_, false, x, y, closestPoint, minSquaredDistance);
        };


        /**
         * Returns the coordinate at `m` using linear interpolation, or `null` if no
         * such coordinate exists.
         *
         * `opt_extrapolate` controls extrapolation beyond the range of Ms in the
         * MultiLineString. If `opt_extrapolate` is `true` then Ms less than the first
         * M will return the first coordinate and Ms greater than the last M will
         * return the last coordinate.
         *
         * `opt_interpolate` controls interpolation between consecutive LineStrings
         * within the MultiLineString. If `opt_interpolate` is `true` the coordinates
         * will be linearly interpolated between the last coordinate of one LineString
         * and the first coordinate of the next LineString.  If `opt_interpolate` is
         * `false` then the function will return `null` for Ms falling between
         * LineStrings.
         *
         * @param {number} m M.
         * @param {boolean=} opt_extrapolate Extrapolate. Default is `false`.
         * @param {boolean=} opt_interpolate Interpolate. Default is `false`.
         * @return {ol.Coordinate} Coordinate.
         * @api
         */
        ol.geom.MultiLineString.prototype.getCoordinateAtM = function(m, opt_extrapolate, opt_interpolate) {
            if ((this.layout != ol.geom.GeometryLayout.XYM &&
                this.layout != ol.geom.GeometryLayout.XYZM) ||
                this.flatCoordinates.length === 0) {
                return null;
            }
            var extrapolate = opt_extrapolate !== undefined ? opt_extrapolate : false;
            var interpolate = opt_interpolate !== undefined ? opt_interpolate : false;
            return ol.geom.flat.interpolate.lineStringsCoordinateAtM(this.flatCoordinates, 0,
                this.ends_, this.stride, m, extrapolate, interpolate);
        };


        /**
         * Return the coordinates of the multilinestring.
         * @return {Array.<Array.<ol.Coordinate>>} Coordinates.
         * @override
         * @api
         */
        ol.geom.MultiLineString.prototype.getCoordinates = function() {
            return ol.geom.flat.inflate.coordinatess(
                this.flatCoordinates, 0, this.ends_, this.stride);
        };


        /**
         * @return {Array.<number>} Ends.
         */
        ol.geom.MultiLineString.prototype.getEnds = function() {
            return this.ends_;
        };


        /**
         * Return the linestring at the specified index.
         * @param {number} index Index.
         * @return {ol.geom.LineString} LineString.
         * @api
         */
        ol.geom.MultiLineString.prototype.getLineString = function(index) {
            if (index < 0 || this.ends_.length <= index) {
                return null;
            }
            var lineString = new ol.geom.LineString(null);
            lineString.setFlatCoordinates(this.layout, this.flatCoordinates.slice(
                index === 0 ? 0 : this.ends_[index - 1], this.ends_[index]));
            return lineString;
        };


        /**
         * Return the linestrings of this multilinestring.
         * @return {Array.<ol.geom.LineString>} LineStrings.
         * @api
         */
        ol.geom.MultiLineString.prototype.getLineStrings = function() {
            var flatCoordinates = this.flatCoordinates;
            var ends = this.ends_;
            var layout = this.layout;
            /** @type {Array.<ol.geom.LineString>} */
            var lineStrings = [];
            var offset = 0;
            var i, ii;
            for (i = 0, ii = ends.length; i < ii; ++i) {
                var end = ends[i];
                var lineString = new ol.geom.LineString(null);
                lineString.setFlatCoordinates(layout, flatCoordinates.slice(offset, end));
                lineStrings.push(lineString);
                offset = end;
            }
            return lineStrings;
        };


        /**
         * @return {Array.<number>} Flat midpoints.
         */
        ol.geom.MultiLineString.prototype.getFlatMidpoints = function() {
            var midpoints = [];
            var flatCoordinates = this.flatCoordinates;
            var offset = 0;
            var ends = this.ends_;
            var stride = this.stride;
            var i, ii;
            for (i = 0, ii = ends.length; i < ii; ++i) {
                var end = ends[i];
                var midpoint = ol.geom.flat.interpolate.lineString(
                    flatCoordinates, offset, end, stride, 0.5);
                ol.array.extend(midpoints, midpoint);
                offset = end;
            }
            return midpoints;
        };


        /**
         * @inheritDoc
         */
        ol.geom.MultiLineString.prototype.getSimplifiedGeometryInternal = function(squaredTolerance) {
            var simplifiedFlatCoordinates = [];
            var simplifiedEnds = [];
            simplifiedFlatCoordinates.length = ol.geom.flat.simplify.douglasPeuckers(
                this.flatCoordinates, 0, this.ends_, this.stride, squaredTolerance,
                simplifiedFlatCoordinates, 0, simplifiedEnds);
            var simplifiedMultiLineString = new ol.geom.MultiLineString(null);
            simplifiedMultiLineString.setFlatCoordinates(
                ol.geom.GeometryLayout.XY, simplifiedFlatCoordinates, simplifiedEnds);
            return simplifiedMultiLineString;
        };


        /**
         * @inheritDoc
         * @api
         */
        ol.geom.MultiLineString.prototype.getType = function() {
            return ol.geom.GeometryType.MULTI_LINE_STRING;
        };


        /**
         * @inheritDoc
         * @api
         */
        ol.geom.MultiLineString.prototype.intersectsExtent = function(extent) {
            return ol.geom.flat.intersectsextent.lineStrings(
                this.flatCoordinates, 0, this.ends_, this.stride, extent);
        };


        /**
         * Set the coordinates of the multilinestring.
         * @param {Array.<Array.<ol.Coordinate>>} coordinates Coordinates.
         * @param {ol.geom.GeometryLayout=} opt_layout Layout.
         * @override
         * @api
         */
        ol.geom.MultiLineString.prototype.setCoordinates = function(coordinates, opt_layout) {
            if (!coordinates) {
                this.setFlatCoordinates(ol.geom.GeometryLayout.XY, null, this.ends_);
            } else {
                this.setLayout(opt_layout, coordinates, 2);
                if (!this.flatCoordinates) {
                    this.flatCoordinates = [];
                }
                var ends = ol.geom.flat.deflate.coordinatess(
                    this.flatCoordinates, 0, coordinates, this.stride, this.ends_);
                this.flatCoordinates.length = ends.length === 0 ? 0 : ends[ends.length - 1];
                this.changed();
            }
        };


        /**
         * @param {ol.geom.GeometryLayout} layout Layout.
         * @param {Array.<number>} flatCoordinates Flat coordinates.
         * @param {Array.<number>} ends Ends.
         */
        ol.geom.MultiLineString.prototype.setFlatCoordinates = function(layout, flatCoordinates, ends) {
            this.setFlatCoordinatesInternal(layout, flatCoordinates);
            this.ends_ = ends;
            this.changed();
        };


        /**
         * @param {Array.<ol.geom.LineString>} lineStrings LineStrings.
         */
        ol.geom.MultiLineString.prototype.setLineStrings = function(lineStrings) {
            var layout = this.getLayout();
            var flatCoordinates = [];
            var ends = [];
            var i, ii;
            for (i = 0, ii = lineStrings.length; i < ii; ++i) {
                var lineString = lineStrings[i];
                if (i === 0) {
                    layout = lineString.getLayout();
                }
                ol.array.extend(flatCoordinates, lineString.getFlatCoordinates());
                ends.push(flatCoordinates.length);
            }
            this.setFlatCoordinates(layout, flatCoordinates, ends);
        };

        /**
         * @classdesc
         * Multi-point geometry.
         *
         * @constructor
         * @extends {ol.geom.SimpleGeometry}
         * @param {Array.<ol.Coordinate>} coordinates Coordinates.
         * @param {ol.geom.GeometryLayout=} opt_layout Layout.
         * @api
         */
        ol.geom.MultiPoint = function(coordinates, opt_layout) {
            ol.geom.SimpleGeometry.call(this);
            this.setCoordinates(coordinates, opt_layout);
        };
        ol.inherits(ol.geom.MultiPoint, ol.geom.SimpleGeometry);


        /**
         * Append the passed point to this multipoint.
         * @param {ol.geom.Point} point Point.
         * @api
         */
        ol.geom.MultiPoint.prototype.appendPoint = function(point) {
            if (!this.flatCoordinates) {
                this.flatCoordinates = point.getFlatCoordinates().slice();
            } else {
                ol.array.extend(this.flatCoordinates, point.getFlatCoordinates());
            }
            this.changed();
        };


        /**
         * Make a complete copy of the geometry.
         * @return {!ol.geom.MultiPoint} Clone.
         * @override
         * @api
         */
        ol.geom.MultiPoint.prototype.clone = function() {
            var multiPoint = new ol.geom.MultiPoint(null);
            multiPoint.setFlatCoordinates(this.layout, this.flatCoordinates.slice());
            return multiPoint;
        };


        /**
         * @inheritDoc
         */
        ol.geom.MultiPoint.prototype.closestPointXY = function(x, y, closestPoint, minSquaredDistance) {
            if (minSquaredDistance <
                ol.extent.closestSquaredDistanceXY(this.getExtent(), x, y)) {
                return minSquaredDistance;
            }
            var flatCoordinates = this.flatCoordinates;
            var stride = this.stride;
            var i, ii, j;
            for (i = 0, ii = flatCoordinates.length; i < ii; i += stride) {
                var squaredDistance = ol.math.squaredDistance(
                    x, y, flatCoordinates[i], flatCoordinates[i + 1]);
                if (squaredDistance < minSquaredDistance) {
                    minSquaredDistance = squaredDistance;
                    for (j = 0; j < stride; ++j) {
                        closestPoint[j] = flatCoordinates[i + j];
                    }
                    closestPoint.length = stride;
                }
            }
            return minSquaredDistance;
        };


        /**
         * Return the coordinates of the multipoint.
         * @return {Array.<ol.Coordinate>} Coordinates.
         * @override
         * @api
         */
        ol.geom.MultiPoint.prototype.getCoordinates = function() {
            return ol.geom.flat.inflate.coordinates(
                this.flatCoordinates, 0, this.flatCoordinates.length, this.stride);
        };


        /**
         * Return the point at the specified index.
         * @param {number} index Index.
         * @return {ol.geom.Point} Point.
         * @api
         */
        ol.geom.MultiPoint.prototype.getPoint = function(index) {
            var n = !this.flatCoordinates ?
                0 : this.flatCoordinates.length / this.stride;
            if (index < 0 || n <= index) {
                return null;
            }
            var point = new ol.geom.Point(null);
            point.setFlatCoordinates(this.layout, this.flatCoordinates.slice(
                index * this.stride, (index + 1) * this.stride));
            return point;
        };


        /**
         * Return the points of this multipoint.
         * @return {Array.<ol.geom.Point>} Points.
         * @api
         */
        ol.geom.MultiPoint.prototype.getPoints = function() {
            var flatCoordinates = this.flatCoordinates;
            var layout = this.layout;
            var stride = this.stride;
            /** @type {Array.<ol.geom.Point>} */
            var points = [];
            var i, ii;
            for (i = 0, ii = flatCoordinates.length; i < ii; i += stride) {
                var point = new ol.geom.Point(null);
                point.setFlatCoordinates(layout, flatCoordinates.slice(i, i + stride));
                points.push(point);
            }
            return points;
        };


        /**
         * @inheritDoc
         * @api
         */
        ol.geom.MultiPoint.prototype.getType = function() {
            return ol.geom.GeometryType.MULTI_POINT;
        };


        /**
         * @inheritDoc
         * @api
         */
        ol.geom.MultiPoint.prototype.intersectsExtent = function(extent) {
            var flatCoordinates = this.flatCoordinates;
            var stride = this.stride;
            var i, ii, x, y;
            for (i = 0, ii = flatCoordinates.length; i < ii; i += stride) {
                x = flatCoordinates[i];
                y = flatCoordinates[i + 1];
                if (ol.extent.containsXY(extent, x, y)) {
                    return true;
                }
            }
            return false;
        };


        /**
         * Set the coordinates of the multipoint.
         * @param {Array.<ol.Coordinate>} coordinates Coordinates.
         * @param {ol.geom.GeometryLayout=} opt_layout Layout.
         * @override
         * @api
         */
        ol.geom.MultiPoint.prototype.setCoordinates = function(coordinates, opt_layout) {
            if (!coordinates) {
                this.setFlatCoordinates(ol.geom.GeometryLayout.XY, null);
            } else {
                this.setLayout(opt_layout, coordinates, 1);
                if (!this.flatCoordinates) {
                    this.flatCoordinates = [];
                }
                this.flatCoordinates.length = ol.geom.flat.deflate.coordinates(
                    this.flatCoordinates, 0, coordinates, this.stride);
                this.changed();
            }
        };


        /**
         * @param {ol.geom.GeometryLayout} layout Layout.
         * @param {Array.<number>} flatCoordinates Flat coordinates.
         */
        ol.geom.MultiPoint.prototype.setFlatCoordinates = function(layout, flatCoordinates) {
            this.setFlatCoordinatesInternal(layout, flatCoordinates);
            this.changed();
        };

        /**
         * @param {Array.<number>} flatCoordinates Flat coordinates.
         * @param {number} offset Offset.
         * @param {Array.<Array.<number>>} endss Endss.
         * @param {number} stride Stride.
         * @return {Array.<number>} Flat centers.
         */
        ol.geom.flat.center.linearRingss = {};

        /**
         * @param {Array.<number>} flatCoordinates Flat coordinates.
         * @param {number} offset Offset.
         * @param {Array.<Array.<number>>} endss Endss.
         * @param {number} stride Stride.
         * @return {Array.<number>} Flat centers.
         */
        ol.geom.flat.center.linearRingss = function(flatCoordinates, offset, endss, stride) {
            var flatCenters = [];
            var i, ii;
            var extent = ol.extent.createEmpty();
            for (i = 0, ii = endss.length; i < ii; ++i) {
                var ends = endss[i];
                extent = ol.extent.createOrUpdateFromFlatCoordinates(
                    flatCoordinates, offset, ends[0], stride);
                flatCenters.push((extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2);
                offset = ends[ends.length - 1];
            }
            return flatCenters;
        };

        /**
         * @classdesc
         * Multi-polygon geometry.
         *
         * @constructor
         * @extends {ol.geom.SimpleGeometry}
         * @param {Array.<Array.<Array.<ol.Coordinate>>>} coordinates Coordinates.
         * @param {ol.geom.GeometryLayout=} opt_layout Layout.
         * @api
         */
        ol.geom.MultiPolygon = function(coordinates, opt_layout) {

            ol.geom.SimpleGeometry.call(this);

            /**
             * @type {Array.<Array.<number>>}
             * @private
             */
            this.endss_ = [];

            /**
             * @private
             * @type {number}
             */
            this.flatInteriorPointsRevision_ = -1;

            /**
             * @private
             * @type {Array.<number>}
             */
            this.flatInteriorPoints_ = null;

            /**
             * @private
             * @type {number}
             */
            this.maxDelta_ = -1;

            /**
             * @private
             * @type {number}
             */
            this.maxDeltaRevision_ = -1;

            /**
             * @private
             * @type {number}
             */
            this.orientedRevision_ = -1;

            /**
             * @private
             * @type {Array.<number>}
             */
            this.orientedFlatCoordinates_ = null;

            this.setCoordinates(coordinates, opt_layout);

        };
        ol.inherits(ol.geom.MultiPolygon, ol.geom.SimpleGeometry);


        /**
         * Append the passed polygon to this multipolygon.
         * @param {ol.geom.Polygon} polygon Polygon.
         * @api
         */
        ol.geom.MultiPolygon.prototype.appendPolygon = function(polygon) {
            /** @type {Array.<number>} */
            var ends;
            if (!this.flatCoordinates) {
                this.flatCoordinates = polygon.getFlatCoordinates().slice();
                ends = polygon.getEnds().slice();
                this.endss_.push();
            } else {
                var offset = this.flatCoordinates.length;
                ol.array.extend(this.flatCoordinates, polygon.getFlatCoordinates());
                ends = polygon.getEnds().slice();
                var i, ii;
                for (i = 0, ii = ends.length; i < ii; ++i) {
                    ends[i] += offset;
                }
            }
            this.endss_.push(ends);
            this.changed();
        };


        /**
         * Make a complete copy of the geometry.
         * @return {!ol.geom.MultiPolygon} Clone.
         * @override
         * @api
         */
        ol.geom.MultiPolygon.prototype.clone = function() {
            var multiPolygon = new ol.geom.MultiPolygon(null);

            var len = this.endss_.length;
            var newEndss = new Array(len);
            for (var i = 0; i < len; ++i) {
                newEndss[i] = this.endss_[i].slice();
            }

            multiPolygon.setFlatCoordinates(
                this.layout, this.flatCoordinates.slice(), newEndss);
            return multiPolygon;
        };


        /**
         * @inheritDoc
         */
        ol.geom.MultiPolygon.prototype.closestPointXY = function(x, y, closestPoint, minSquaredDistance) {
            if (minSquaredDistance <
                ol.extent.closestSquaredDistanceXY(this.getExtent(), x, y)) {
                return minSquaredDistance;
            }
            if (this.maxDeltaRevision_ != this.getRevision()) {
                this.maxDelta_ = Math.sqrt(ol.geom.flat.closest.getssMaxSquaredDelta(
                    this.flatCoordinates, 0, this.endss_, this.stride, 0));
                this.maxDeltaRevision_ = this.getRevision();
            }
            return ol.geom.flat.closest.getssClosestPoint(
                this.getOrientedFlatCoordinates(), 0, this.endss_, this.stride,
                this.maxDelta_, true, x, y, closestPoint, minSquaredDistance);
        };


        /**
         * @inheritDoc
         */
        ol.geom.MultiPolygon.prototype.containsXY = function(x, y) {
            return ol.geom.flat.contains.linearRingssContainsXY(
                this.getOrientedFlatCoordinates(), 0, this.endss_, this.stride, x, y);
        };


        /**
         * Return the area of the multipolygon on projected plane.
         * @return {number} Area (on projected plane).
         * @api
         */
        ol.geom.MultiPolygon.prototype.getArea = function() {
            return ol.geom.flat.area.linearRingss(
                this.getOrientedFlatCoordinates(), 0, this.endss_, this.stride);
        };


        /**
         * Get the coordinate array for this geometry.  This array has the structure
         * of a GeoJSON coordinate array for multi-polygons.
         *
         * @param {boolean=} opt_right Orient coordinates according to the right-hand
         *     rule (counter-clockwise for exterior and clockwise for interior rings).
         *     If `false`, coordinates will be oriented according to the left-hand rule
         *     (clockwise for exterior and counter-clockwise for interior rings).
         *     By default, coordinate orientation will depend on how the geometry was
         *     constructed.
         * @return {Array.<Array.<Array.<ol.Coordinate>>>} Coordinates.
         * @override
         * @api
         */
        ol.geom.MultiPolygon.prototype.getCoordinates = function(opt_right) {
            var flatCoordinates;
            if (opt_right !== undefined) {
                flatCoordinates = this.getOrientedFlatCoordinates().slice();
                ol.geom.flat.orient.orientLinearRingss(
                    flatCoordinates, 0, this.endss_, this.stride, opt_right);
            } else {
                flatCoordinates = this.flatCoordinates;
            }

            return ol.geom.flat.inflate.coordinatesss(
                flatCoordinates, 0, this.endss_, this.stride);
        };


        /**
         * @return {Array.<Array.<number>>} Endss.
         */
        ol.geom.MultiPolygon.prototype.getEndss = function() {
            return this.endss_;
        };


        /**
         * @return {Array.<number>} Flat interior points.
         */
        ol.geom.MultiPolygon.prototype.getFlatInteriorPoints = function() {
            if (this.flatInteriorPointsRevision_ != this.getRevision()) {
                var flatCenters = ol.geom.flat.center.linearRingss(
                    this.flatCoordinates, 0, this.endss_, this.stride);
                this.flatInteriorPoints_ = ol.geom.flat.interiorpoint.linearRingss(
                    this.getOrientedFlatCoordinates(), 0, this.endss_, this.stride,
                    flatCenters);
                this.flatInteriorPointsRevision_ = this.getRevision();
            }
            return this.flatInteriorPoints_;
        };


        /**
         * Return the interior points as {@link ol.geom.MultiPoint multipoint}.
         * @return {ol.geom.MultiPoint} Interior points as XYM coordinates, where M is
         * the length of the horizontal intersection that the point belongs to.
         * @api
         */
        ol.geom.MultiPolygon.prototype.getInteriorPoints = function() {
            var interiorPoints = new ol.geom.MultiPoint(null);
            interiorPoints.setFlatCoordinates(ol.geom.GeometryLayout.XYM,
                this.getFlatInteriorPoints().slice());
            return interiorPoints;
        };


        /**
         * @return {Array.<number>} Oriented flat coordinates.
         */
        ol.geom.MultiPolygon.prototype.getOrientedFlatCoordinates = function() {
            if (this.orientedRevision_ != this.getRevision()) {
                var flatCoordinates = this.flatCoordinates;
                if (ol.geom.flat.orient.linearRingssAreOriented(
                    flatCoordinates, 0, this.endss_, this.stride)) {
                    this.orientedFlatCoordinates_ = flatCoordinates;
                } else {
                    this.orientedFlatCoordinates_ = flatCoordinates.slice();
                    this.orientedFlatCoordinates_.length =
                        ol.geom.flat.orient.orientLinearRingss(
                            this.orientedFlatCoordinates_, 0, this.endss_, this.stride);
                }
                this.orientedRevision_ = this.getRevision();
            }
            return this.orientedFlatCoordinates_;
        };


        /**
         * @inheritDoc
         */
        ol.geom.MultiPolygon.prototype.getSimplifiedGeometryInternal = function(squaredTolerance) {
            var simplifiedFlatCoordinates = [];
            var simplifiedEndss = [];
            simplifiedFlatCoordinates.length = ol.geom.flat.simplify.quantizess(
                this.flatCoordinates, 0, this.endss_, this.stride,
                Math.sqrt(squaredTolerance),
                simplifiedFlatCoordinates, 0, simplifiedEndss);
            var simplifiedMultiPolygon = new ol.geom.MultiPolygon(null);
            simplifiedMultiPolygon.setFlatCoordinates(
                ol.geom.GeometryLayout.XY, simplifiedFlatCoordinates, simplifiedEndss);
            return simplifiedMultiPolygon;
        };


        /**
         * Return the polygon at the specified index.
         * @param {number} index Index.
         * @return {ol.geom.Polygon} Polygon.
         * @api
         */
        ol.geom.MultiPolygon.prototype.getPolygon = function(index) {
            if (index < 0 || this.endss_.length <= index) {
                return null;
            }
            var offset;
            if (index === 0) {
                offset = 0;
            } else {
                var prevEnds = this.endss_[index - 1];
                offset = prevEnds[prevEnds.length - 1];
            }
            var ends = this.endss_[index].slice();
            var end = ends[ends.length - 1];
            if (offset !== 0) {
                var i, ii;
                for (i = 0, ii = ends.length; i < ii; ++i) {
                    ends[i] -= offset;
                }
            }
            var polygon = new ol.geom.Polygon(null);
            polygon.setFlatCoordinates(
                this.layout, this.flatCoordinates.slice(offset, end), ends);
            return polygon;
        };


        /**
         * Return the polygons of this multipolygon.
         * @return {Array.<ol.geom.Polygon>} Polygons.
         * @api
         */
        ol.geom.MultiPolygon.prototype.getPolygons = function() {
            var layout = this.layout;
            var flatCoordinates = this.flatCoordinates;
            var endss = this.endss_;
            var polygons = [];
            var offset = 0;
            var i, ii, j, jj;
            for (i = 0, ii = endss.length; i < ii; ++i) {
                var ends = endss[i].slice();
                var end = ends[ends.length - 1];
                if (offset !== 0) {
                    for (j = 0, jj = ends.length; j < jj; ++j) {
                        ends[j] -= offset;
                    }
                }
                var polygon = new ol.geom.Polygon(null);
                polygon.setFlatCoordinates(
                    layout, flatCoordinates.slice(offset, end), ends);
                polygons.push(polygon);
                offset = end;
            }
            return polygons;
        };


        /**
         * @inheritDoc
         * @api
         */
        ol.geom.MultiPolygon.prototype.getType = function() {
            return ol.geom.GeometryType.MULTI_POLYGON;
        };


        /**
         * @inheritDoc
         * @api
         */
        ol.geom.MultiPolygon.prototype.intersectsExtent = function(extent) {
            return ol.geom.flat.intersectsextent.linearRingss(
                this.getOrientedFlatCoordinates(), 0, this.endss_, this.stride, extent);
        };


        /**
         * Set the coordinates of the multipolygon.
         * @param {Array.<Array.<Array.<ol.Coordinate>>>} coordinates Coordinates.
         * @param {ol.geom.GeometryLayout=} opt_layout Layout.
         * @override
         * @api
         */
        ol.geom.MultiPolygon.prototype.setCoordinates = function(coordinates, opt_layout) {
            if (!coordinates) {
                this.setFlatCoordinates(ol.geom.GeometryLayout.XY, null, this.endss_);
            } else {
                this.setLayout(opt_layout, coordinates, 3);
                if (!this.flatCoordinates) {
                    this.flatCoordinates = [];
                }
                var endss = ol.geom.flat.deflate.coordinatesss(
                    this.flatCoordinates, 0, coordinates, this.stride, this.endss_);
                if (endss.length === 0) {
                    this.flatCoordinates.length = 0;
                } else {
                    var lastEnds = endss[endss.length - 1];
                    this.flatCoordinates.length = lastEnds.length === 0 ?
                        0 : lastEnds[lastEnds.length - 1];
                }
                this.changed();
            }
        };


        /**
         * @param {ol.geom.GeometryLayout} layout Layout.
         * @param {Array.<number>} flatCoordinates Flat coordinates.
         * @param {Array.<Array.<number>>} endss Endss.
         */
        ol.geom.MultiPolygon.prototype.setFlatCoordinates = function(layout, flatCoordinates, endss) {
            this.setFlatCoordinatesInternal(layout, flatCoordinates);
            this.endss_ = endss;
            this.changed();
        };


        /**
         * @param {Array.<ol.geom.Polygon>} polygons Polygons.
         */
        ol.geom.MultiPolygon.prototype.setPolygons = function(polygons) {
            var layout = this.getLayout();
            var flatCoordinates = [];
            var endss = [];
            var i, ii, ends;
            for (i = 0, ii = polygons.length; i < ii; ++i) {
                var polygon = polygons[i];
                if (i === 0) {
                    layout = polygon.getLayout();
                }
                var offset = flatCoordinates.length;
                ends = polygon.getEnds();
                var j, jj;
                for (j = 0, jj = ends.length; j < jj; ++j) {
                    ends[j] += offset;
                }
                ol.array.extend(flatCoordinates, polygon.getFlatCoordinates());
                endss.push(ends);
            }
            this.setFlatCoordinates(layout, flatCoordinates, endss);
        };


        ol.Feature = function(opt_geometryOrProperties) {

            ol.Object.call(this);

            /**
             * @private
             * @type {number|string|undefined}
             */
            this.id_ = undefined;

            /**
             * @type {string}
             * @private
             */
            this.geometryName_ = 'geometry';

            /**
             * User provided style.
             * @private
             * @type {ol.style.Style|Array.<ol.style.Style>|
       *     ol.FeatureStyleFunction}
             */
            this.style_ = null;

            /**
             * @private
             * @type {ol.FeatureStyleFunction|undefined}
             */
            this.styleFunction_ = undefined;

            /**
             * @private
             * @type {?ol.EventsKey}
             */
            this.geometryChangeKey_ = null;

    //        ol.events.listen(
    //            this, ol.Object.getChangeEventType(this.geometryName_),
    //            this.handleGeometryChanged_, this);

            if (opt_geometryOrProperties !== undefined) {
                if (opt_geometryOrProperties instanceof ol.geom.Geometry ||
                    !opt_geometryOrProperties) {
                    var geometry = opt_geometryOrProperties;
                    this.setGeometry(geometry);
                } else {
                    /** @type {Object.<string, *>} */
                    var properties = opt_geometryOrProperties;
                    this.setProperties(properties);
                }
            }
        };
        ol.inherits(ol.Feature, ol.Object);


        /**
         * Clone this feature. If the original feature has a geometry it
         * is also cloned. The feature id is not set in the clone.
         * @return {ol.Feature} The clone.
         * @api
         */
        ol.Feature.prototype.clone = function() {
            var clone = new ol.Feature(this.getProperties());
            clone.setGeometryName(this.getGeometryName());
            var geometry = this.getGeometry();
            if (geometry) {
                clone.setGeometry(geometry.clone());
            }
            var style = this.getStyle();
            if (style) {
                clone.setStyle(style);
            }
            return clone;
        };


        /**
         * Get the feature's default geometry.  A feature may have any number of named
         * geometries.  The "default" geometry (the one that is rendered by default) is
         * set when calling {@link ol.Feature#setGeometry}.
         * @return {ol.geom.Geometry|undefined} The default geometry for the feature.
         * @api
         * @observable
         */
        ol.Feature.prototype.getGeometry = function() {
            return /** @type {ol.geom.Geometry|undefined} */ (
                this.get(this.geometryName_));
        };


        /**
         * Get the feature identifier.  This is a stable identifier for the feature and
         * is either set when reading data from a remote source or set explicitly by
         * calling {@link ol.Feature#setId}.
         * @return {number|string|undefined} Id.
         * @api
         */
        ol.Feature.prototype.getId = function() {
            return this.id_;
        };


        /**
         * Get the name of the feature's default geometry.  By default, the default
         * geometry is named `geometry`.
         * @return {string} Get the property name associated with the default geometry
         *     for this feature.
         * @api
         */
        ol.Feature.prototype.getGeometryName = function() {
            return this.geometryName_;
        };


        /**
         * Get the feature's style. Will return what was provided to the
         * {@link ol.Feature#setStyle} method.
         * @return {ol.style.Style|Array.<ol.style.Style>|
     *     ol.FeatureStyleFunction|ol.StyleFunction} The feature style.
         * @api
         */
        ol.Feature.prototype.getStyle = function() {
            return this.style_;
        };


        /**
         * Get the feature's style function.
         * @return {ol.FeatureStyleFunction|undefined} Return a function
         * representing the current style of this feature.
         * @api
         */
        ol.Feature.prototype.getStyleFunction = function() {
            return this.styleFunction_;
        };


        /**
         * @private
         */
        ol.Feature.prototype.handleGeometryChange_ = function() {
            this.changed();
        };


        /**
         * @private
         */
        ol.Feature.prototype.handleGeometryChanged_ = function() {
            if (this.geometryChangeKey_) {
                ol.events.unlistenByKey(this.geometryChangeKey_);
                this.geometryChangeKey_ = null;
            }
            var geometry = this.getGeometry();
            if (geometry) {
                this.geometryChangeKey_ = ol.events.listen(geometry,
                    ol.events.EventType.CHANGE, this.handleGeometryChange_, this);
            }
            this.changed();
        };


        /**
         * Set the default geometry for the feature.  This will update the property
         * with the name returned by {@link ol.Feature#getGeometryName}.
         * @param {ol.geom.Geometry|undefined} geometry The new geometry.
         * @api
         * @observable
         */
        ol.Feature.prototype.setGeometry = function(geometry) {
            this.set(this.geometryName_, geometry);
        };


        /**
         * Set the style for the feature.  This can be a single style object, an array
         * of styles, or a function that takes a resolution and returns an array of
         * styles. If it is `null` the feature has no style (a `null` style).
         * @param {ol.style.Style|Array.<ol.style.Style>|
     *     ol.FeatureStyleFunction|ol.StyleFunction} style Style for this feature.
         * @api
         * @fires ol.events.Event#event:change
         */
        ol.Feature.prototype.setStyle = function(style) {
            this.style_ = style;
            this.styleFunction_ = !style ?
                undefined : ol.Feature.createStyleFunction(style);
            this.changed();
        };


        /**
         * Set the feature id.  The feature id is considered stable and may be used when
         * requesting features or comparing identifiers returned from a remote source.
         * The feature id can be used with the {@link ol.source.Vector#getFeatureById}
         * method.
         * @param {number|string|undefined} id The feature id.
         * @api
         * @fires ol.events.Event#event:change
         */
        ol.Feature.prototype.setId = function(id) {
            this.id_ = id;
            this.changed();
        };


        /**
         * Set the property name to be used when getting the feature's default geometry.
         * When calling {@link ol.Feature#getGeometry}, the value of the property with
         * this name will be returned.
         * @param {string} name The property name of the default geometry.
         * @api
         */
        ol.Feature.prototype.setGeometryName = function(name) {
            ol.events.unlisten(
                this, ol.Object.getChangeEventType(this.geometryName_),
                this.handleGeometryChanged_, this);
            this.geometryName_ = name;
            ol.events.listen(
                this, ol.Object.getChangeEventType(this.geometryName_),
                this.handleGeometryChanged_, this);
            this.handleGeometryChanged_();
        };


        /**
         * Convert the provided object into a feature style function.  Functions passed
         * through unchanged.  Arrays of ol.style.Style or single style objects wrapped
         * in a new feature style function.
         * @param {ol.FeatureStyleFunction|!Array.<ol.style.Style>|!ol.style.Style} obj
         *     A feature style function, a single style, or an array of styles.
         * @return {ol.FeatureStyleFunction} A style function.
         */
        ol.Feature.createStyleFunction = function(obj) {
            var styleFunction;

            if (typeof obj === 'function') {
                if (obj.length == 2) {
                    styleFunction = function(resolution) {
                        return /** @type {ol.StyleFunction} */ (obj)(this, resolution);
                    };
                } else {
                    styleFunction = obj;
                }
            } else {
                /**
                 * @type {Array.<ol.style.Style>}
                 */
                var styles;
                if (Array.isArray(obj)) {
                    styles = obj;
                } else {
                    ol.asserts.assert(obj instanceof ol.style.Style,
                        41); // Expected an `ol.style.Style` or an array of `ol.style.Style`
                    styles = [obj];
                }
                styleFunction = function() {
                    return styles;
                };
            }
            return styleFunction;
        };

        ol.format = {};

        ol.format.Feature = function() {

            /**
             * @protected
             * @type {ol.proj.Projection}
             */
            this.defaultDataProjection = null;

            /**
             * @protected
             * @type {ol.proj.Projection}
             */
            this.defaultFeatureProjection = null;

        };


        /**
         * Adds the data projection to the read options.
         * @param {Document|Node|Object|string} source Source.
         * @param {olx.format.ReadOptions=} opt_options Options.
         * @return {olx.format.ReadOptions|undefined} Options.
         * @protected
         */
        ol.format.Feature.prototype.getReadOptions = function(source, opt_options) {
            var options;
            if (opt_options) {
                options = {
                    dataProjection: opt_options.dataProjection ?
                        opt_options.dataProjection : this.readProjection(source),
                    featureProjection: opt_options.featureProjection
                };
            }
            return this.adaptOptions(options);
        };


        /**
         * Sets the `defaultDataProjection` on the options, if no `dataProjection`
         * is set.
         * @param {olx.format.WriteOptions|olx.format.ReadOptions|undefined} options
         *     Options.
         * @protected
         * @return {olx.format.WriteOptions|olx.format.ReadOptions|undefined}
         *     Updated options.
         */
        ol.format.Feature.prototype.adaptOptions = function(options) {
            return ol.obj.assign({
                dataProjection: this.defaultDataProjection,
                featureProjection: this.defaultFeatureProjection
            }, options);
        };


        /**
         * Get the extent from the source of the last {@link readFeatures} call.
         * @return {ol.Extent} Tile extent.
         */
        ol.format.Feature.prototype.getLastExtent = function() {
            return null;
        };


        /**
         * @abstract
         * @return {ol.format.FormatType} Format.
         */
        ol.format.Feature.prototype.getType = function() {};


        /**
         * Read a single feature from a source.
         *
         * @abstract
         * @param {Document|Node|Object|string} source Source.
         * @param {olx.format.ReadOptions=} opt_options Read options.
         * @return {ol.Feature} Feature.
         */
        ol.format.Feature.prototype.readFeature = function(source, opt_options) {};


        /**
         * Read all features from a source.
         *
         * @abstract
         * @param {Document|Node|ArrayBuffer|Object|string} source Source.
         * @param {olx.format.ReadOptions=} opt_options Read options.
         * @return {Array.<ol.Feature>} Features.
         */
        ol.format.Feature.prototype.readFeatures = function(source, opt_options) {};


        /**
         * Read a single geometry from a source.
         *
         * @abstract
         * @param {Document|Node|Object|string} source Source.
         * @param {olx.format.ReadOptions=} opt_options Read options.
         * @return {ol.geom.Geometry} Geometry.
         */
        ol.format.Feature.prototype.readGeometry = function(source, opt_options) {};


        /**
         * Read the projection from a source.
         *
         * @abstract
         * @param {Document|Node|Object|string} source Source.
         * @return {ol.proj.Projection} Projection.
         */
        ol.format.Feature.prototype.readProjection = function(source) {};


        /**
         * Encode a feature in this format.
         *
         * @abstract
         * @param {ol.Feature} feature Feature.
         * @param {olx.format.WriteOptions=} opt_options Write options.
         * @return {string} Result.
         */
        ol.format.Feature.prototype.writeFeature = function(feature, opt_options) {};


        /**
         * Encode an array of features in this format.
         *
         * @abstract
         * @param {Array.<ol.Feature>} features Features.
         * @param {olx.format.WriteOptions=} opt_options Write options.
         * @return {string} Result.
         */
        ol.format.Feature.prototype.writeFeatures = function(features, opt_options) {};


        /**
         * Write a single geometry in this format.
         *
         * @abstract
         * @param {ol.geom.Geometry} geometry Geometry.
         * @param {olx.format.WriteOptions=} opt_options Write options.
         * @return {string} Result.
         */
        ol.format.Feature.prototype.writeGeometry = function(geometry, opt_options) {};


        /**
         * @param {ol.geom.Geometry|ol.Extent} geometry Geometry.
         * @param {boolean} write Set to true for writing, false for reading.
         * @param {(olx.format.WriteOptions|olx.format.ReadOptions)=} opt_options
         *     Options.
         * @return {ol.geom.Geometry|ol.Extent} Transformed geometry.
         * @protected
         */
        ol.format.Feature.transformWithOptions = function(
            geometry, write, opt_options) {

            /**
             * @type {ol.geom.Geometry|ol.Extent}
             */
            var transformed;
            {
                transformed = geometry;
            }
            if (write && opt_options && opt_options.decimals !== undefined) {
                var power = Math.pow(10, opt_options.decimals);
                // if decimals option on write, round each coordinate appropriately
                /**
                 * @param {Array.<number>} coordinates Coordinates.
                 * @return {Array.<number>} Transformed coordinates.
                 */
                var transform = function(coordinates) {
                    for (var i = 0, ii = coordinates.length; i < ii; ++i) {
                        coordinates[i] = Math.round(coordinates[i] * power) / power;
                    }
                    return coordinates;
                };
                if (transformed === geometry) {
                    transformed = transformed.clone();
                }
                transformed.applyTransform(transform);
            }
            return transformed;
        };


        ol.format.MVT = function(opt_options) {

            ol.format.Feature.call(this);

            var options = opt_options ? opt_options : {};

            /**
             * @type {ol.proj.Projection}
             */
    //        this.defaultDataProjection = new ol.proj.Projection({
    //            code: 'EPSG:3857',
    //            units: ol.proj.Units.TILE_PIXELS
    //        });

            /**
             * @private
             * @type {function((ol.geom.Geometry|Object.<string,*>)=)|
       *     function(ol.geom.GeometryType,Array.<number>,
       *         (Array.<number>|Array.<Array.<number>>),Object.<string,*>,number)}
             */
            this.featureClass_ = options.featureClass ?
                options.featureClass : ol.render.Feature;

            /**
             * @private
             * @type {string|undefined}
             */
            this.geometryName_ = options.geometryName;

            /**
             * @private
             * @type {string}
             */
            this.layerName_ = options.layerName ? options.layerName : 'layer';

            /**
             * @private
             * @type {Array.<string>}
             */
            this.layers_ = options.layers ? options.layers : null;

            /**
             * @private
             * @type {ol.Extent}
             */
            this.extent_ = null;

        };
        ol.inherits(ol.format.MVT, ol.format.Feature);

        ol.format.MVT.pbfReaders_ = {
            layers: function (tag, layers, pbf) {
                if (tag === 3) {
                    var layer = {
                        keys: [],
                        values: [],
                        features: []
                    };
                    var end = pbf.readVarint() + pbf.pos;
                    pbf.readFields(ol.format.MVT.pbfReaders_.layer, layer, end);
                    layer.length = layer.features.length;
                    if (layer.length) {
                        layers[layer.name] = layer;
                    }
                }
            },
            layer: function (tag, layer, pbf) {
                if (tag === 15) {
                    layer.version = pbf.readVarint();
                } else if (tag === 1) {
                    layer.name = pbf.readString();
                } else if (tag === 5) {
                    layer.extent = pbf.readVarint();
                } else if (tag === 2) {
                    layer.features.push(pbf.pos);
                } else if (tag === 3) {
                    layer.keys.push(pbf.readString());
                } else if (tag === 4) {
                    var value = null;
                    var end = pbf.readVarint() + pbf.pos;
                    while (pbf.pos < end) {
                        tag = pbf.readVarint() >> 3;
                        value = tag === 1 ? pbf.readString() :
                            tag === 2 ? pbf.readFloat() :
                                tag === 3 ? pbf.readDouble() :
                                    tag === 4 ? pbf.readVarint64() :
                                        tag === 5 ? pbf.readVarint() :
                                            tag === 6 ? pbf.readSVarint() :
                                                tag === 7 ? pbf.readBoolean() : null;
                    }
                    layer.values.push(value);
                }
            },
            feature: function (tag, feature, pbf) {
                if (tag == 1) {
                    feature.id = pbf.readVarint();
                } else if (tag == 2) {
                    var end = pbf.readVarint() + pbf.pos;
                    while (pbf.pos < end) {
                        var key = feature.layer.keys[pbf.readVarint()];
                        var value = feature.layer.values[pbf.readVarint()];
                        feature.properties[key] = value;
                    }
                } else if (tag == 3) {
                    feature.type = pbf.readVarint();
                } else if (tag == 4) {
                    feature.geometry = pbf.pos;
                }
            }
        };

        /**
         * Read a raw feature from the pbf offset stored at index `i` in the raw layer.
         * @suppress {missingProperties}
         * @private
         * @param {ol.ext.PBF} pbf PBF.
         * @param {Object} layer Raw layer.
         * @param {number} i Index of the feature in the raw layer's `features` array.
         * @return {Object} Raw feature.
         */
        ol.format.MVT.readRawFeature_ = function (pbf, layer, i) {
            pbf.pos = layer.features[i];
            var end = pbf.readVarint() + pbf.pos;

            var feature = {
                layer: layer,
                type: 0,
                properties: {}
            };
            pbf.readFields(ol.format.MVT.pbfReaders_.feature, feature, end);
            return feature;
        };

        /**
         * Read the raw geometry from the pbf offset stored in a raw feature's geometry
         * proeprty.
         * @suppress {missingProperties}
         * @private
         * @param {ol.ext.PBF} pbf PBF.
         * @param {Object} feature Raw feature.
         * @param {Array.<number>} flatCoordinates Array to store flat coordinates in.
         * @param {Array.<number>} ends Array to store ends in.
         */
        ol.format.MVT.readRawGeometry_ = function (pbf, feature, flatCoordinates, ends) {
            pbf.pos = feature.geometry;

            var end = pbf.readVarint() + pbf.pos;
            var cmd = 1;
            var length = 0;
            var x = 0;
            var y = 0;
            var coordsLen = 0;
            var currentEnd = 0;

            while (pbf.pos < end) {
                if (!length) {
                    var cmdLen = pbf.readVarint();
                    cmd = cmdLen & 0x7;
                    length = cmdLen >> 3;
                }

                length--;

                if (cmd === 1 || cmd === 2) {
                    x += pbf.readSVarint();
                    y += pbf.readSVarint();

                    if (cmd === 1) { // moveTo
                        if (coordsLen > currentEnd) {
                            ends.push(coordsLen);
                            currentEnd = coordsLen;
                        }
                    }

                    flatCoordinates.push(x, y);
                    coordsLen += 2;

                } else if (cmd === 7) {

                    if (coordsLen > currentEnd) {
                        // close polygon
                        flatCoordinates.push(
                            flatCoordinates[currentEnd], flatCoordinates[currentEnd + 1]);
                        coordsLen += 2;
                    }

                } else {
                    ol.asserts.assert(false, 59); // Invalid command found in the PBF
                }
            }

            if (coordsLen > currentEnd) {
                ends.push(coordsLen);
                currentEnd = coordsLen;
            }

        };

        /**
         * @suppress {missingProperties}
         * @private
         * @param {number} type The raw feature's geometry type
         * @param {number} numEnds Number of ends of the flat coordinates of the
         * geometry.
         * @return {ol.geom.GeometryType} The geometry type.
         */
        ol.format.MVT.getGeometryType_ = function (type, numEnds) {
            /** @type {ol.geom.GeometryType} */
            var geometryType;
            if (type === 1) {
                geometryType = numEnds === 1 ?
                    ol.geom.GeometryType.POINT : ol.geom.GeometryType.MULTI_POINT;
            } else if (type === 2) {
                geometryType = numEnds === 1 ?
                    ol.geom.GeometryType.LINE_STRING :
                    ol.geom.GeometryType.MULTI_LINE_STRING;
            } else if (type === 3) {
                geometryType = ol.geom.GeometryType.POLYGON;
                // MultiPolygon not relevant for rendering - winding order determines
                // outer rings of polygons.
            }
            return geometryType;
        };

        /**
         * @private
         * @param {ol.ext.PBF} pbf PBF
         * @param {Object} rawFeature Raw Mapbox feature.
         * @param {olx.format.ReadOptions=} opt_options Read options.
         * @return {ol.Feature|ol.render.Feature} Feature.
         */
        ol.format.MVT.prototype.createFeature_ = function (pbf, rawFeature, opt_options) {
            var type = rawFeature.type;
            if (type === 0) {
                return null;
            }

            var feature;
            var id = rawFeature.id;
            var values = rawFeature.properties;
            values[this.layerName_] = rawFeature.layer.name;

            var flatCoordinates = [];
            var ends = [];
            ol.format.MVT.readRawGeometry_(pbf, rawFeature, flatCoordinates, ends);

            var geometryType = ol.format.MVT.getGeometryType_(type, ends.length);

            var geom;
            if (geometryType == ol.geom.GeometryType.POLYGON) {
                var endss = [];
                var offset = 0;
                var prevEndIndex = 0;
                for (var i = 0, ii = ends.length; i < ii; ++i) {
                    var end = ends[i];
                    if (!ol.geom.flat.orient.linearRingIsClockwise(flatCoordinates, offset, end, 2)) {
                        endss.push(ends.slice(prevEndIndex, i + 1));
                        prevEndIndex = i + 1;
                    }
                    offset = end;
                }
                if (endss.length > 1) {
                    ends = endss;
                    geom = new ol.geom.MultiPolygon(null);
                } else {
                    geom = new ol.geom.Polygon(null);
                }
            } else {
                geom = geometryType === ol.geom.GeometryType.POINT ? new ol.geom.Point(null) :
                    geometryType === ol.geom.GeometryType.LINE_STRING ? new ol.geom.LineString(null) :
                        geometryType === ol.geom.GeometryType.POLYGON ? new ol.geom.Polygon(null) :
                            geometryType === ol.geom.GeometryType.MULTI_POINT ? new ol.geom.MultiPoint(null) :
                                geometryType === ol.geom.GeometryType.MULTI_LINE_STRING ? new ol.geom.MultiLineString(null) :
                                    null;
            }
            geom.setFlatCoordinates(ol.geom.GeometryLayout.XY, flatCoordinates, ends);
            feature = new this.featureClass_();
            if (this.geometryName_) {
                feature.setGeometryName(this.geometryName_);
            }
            var geometry = ol.format.Feature.transformWithOptions(geom, false, this.adaptOptions(opt_options));
            feature.setGeometry(geometry);
            feature.setId(id);
            feature.setProperties(values);

            return feature;
        };

        ol.format.MVT.prototype.readFeatures = function (source, opt_options) {
            var layers = this.layers_;

            var pbf$1 = new pbf.Protobuf(/** @type {ArrayBuffer} */ (source));
            var pbfLayers = pbf$1.readFields(ol.format.MVT.pbfReaders_.layers, {});
            /** @type {Array.<ol.Feature|ol.render.Feature>} */
            var features = [];
            var pbfLayer;
            for (var name in pbfLayers) {
                if (layers && layers.indexOf(name) == -1) {
                    continue;
                }

                if (opt_options !== undefined) {
                    var needSourceLayerNames = opt_options.needSourceLayerNames;
                    if (needSourceLayerNames !== undefined && needSourceLayerNames[name] === undefined) {
                        continue;
                    }
                }

                pbfLayer = pbfLayers[name];

                var rawFeature;
                for (var i = 0, ii = pbfLayer.length; i < ii; ++i) {
                    rawFeature = ol.format.MVT.readRawFeature_(pbf$1, pbfLayer, i);
                    features.push(this.createFeature_(pbf$1, rawFeature));
                }
                this.extent_ = pbfLayer ? [0, 0, pbfLayer.extent, pbfLayer.extent] : null;
            }

            return features;
        };

        ol.style = {};

        /**
         * Singleton class. Available through {@link ol.style.iconImageCache}.
         * @constructor
         */
        ol.style.IconImageCache = function() {
            this.cache_ = {};
            this.cacheSize_ = 0;
            this.maxCacheSize_ = 32;
        };

        ol.style.IconImageCache.getKey = function(src, crossOrigin, color) {
            var colorString = color ? ol.color.asString(color) : 'null';
            return crossOrigin + ':' + src + ':' + colorString;
        };


        /**
         * FIXME empty description for jsdoc
         */
        ol.style.IconImageCache.prototype.clear = function() {
            this.cache_ = {};
            this.cacheSize_ = 0;
        };


        /**
         * FIXME empty description for jsdoc
         */
        ol.style.IconImageCache.prototype.expire = function() {
            if (this.cacheSize_ > this.maxCacheSize_) {
                var i = 0;
                var key, iconImage;
                for (key in this.cache_) {
                    iconImage = this.cache_[key];
                    if ((i++ & 3) === 0 && !iconImage.hasListener()) {
                        delete this.cache_[key];
                        --this.cacheSize_;
                    }
                }
            }
        };

        ol.style.IconImageCache.prototype.get = function(src, crossOrigin, color) {
            var key = ol.style.IconImageCache.getKey(src, crossOrigin, color);
            return key in this.cache_ ? this.cache_[key] : null;
        };

        ol.style.IconImageCache.prototype.set = function(src, crossOrigin, color, iconImage) {
            var key = ol.style.IconImageCache.getKey(src, crossOrigin, color);
            this.cache_[key] = iconImage;
            ++this.cacheSize_;
        };

        ol.style.IconImageCache.prototype.setSize = function(maxCacheSize) {
            this.maxCacheSize_ = maxCacheSize;
            this.expire();
        };

        /**
         * The {@link ol.style.IconImageCache} for {@link ol.style.Icon} images.
         * @api
         */
        ol.style.iconImageCache = new ol.style.IconImageCache();

        ol.style.Image = function(options) {

            /**
             * @private
             * @type {number}
             */
            this.opacity_ = options.opacity;

            /**
             * @private
             * @type {boolean}
             */
            this.rotateWithView_ = options.rotateWithView;

            /**
             * @private
             * @type {number}
             */
            this.rotation_ = options.rotation;

            /**
             * @private
             * @type {number}
             */
            this.scale_ = options.scale;

            /**
             * @private
             * @type {boolean}
             */
            this.snapToPixel_ = options.snapToPixel;

        };

        ol.style.Image.prototype.getOpacity = function() {
            return this.opacity_;
        };

        ol.style.Image.prototype.getRotateWithView = function() {
            return this.rotateWithView_;
        };

        ol.style.Image.prototype.getRotation = function() {
            return this.rotation_;
        };

        ol.style.Image.prototype.getScale = function() {
            return this.scale_;
        };

        ol.style.Image.prototype.getSnapToPixel = function() {
            return this.snapToPixel_;
        };

        ol.style.Image.prototype.getAnchor = function() {};

        ol.style.Image.prototype.getImage = function(pixelRatio) {};

        ol.style.Image.prototype.getHitDetectionImage = function(pixelRatio) {};

        ol.style.Image.prototype.getImageState = function() {};

        ol.style.Image.prototype.getImageSize = function() {};

        ol.style.Image.prototype.getHitDetectionImageSize = function() {};

        ol.style.Image.prototype.getOrigin = function() {};

        ol.style.Image.prototype.getSize = function() {};

        ol.style.Image.prototype.setOpacity = function(opacity) {
            this.opacity_ = opacity;
        };

        ol.style.Image.prototype.setRotateWithView = function(rotateWithView) {
            this.rotateWithView_ = rotateWithView;
        };

        ol.style.Image.prototype.setRotation = function(rotation) {
            this.rotation_ = rotation;
        };

        ol.style.Image.prototype.setScale = function(scale) {
            this.scale_ = scale;
        };

        ol.style.Image.prototype.setSnapToPixel = function(snapToPixel) {
            this.snapToPixel_ = snapToPixel;
        };

        ol.style.Image.prototype.listenImageChange = function(listener, thisArg) {};

        ol.style.Image.prototype.load = function() {};

        ol.style.Image.prototype.unlistenImageChange = function(listener, thisArg) {};

        /**
         * @classdesc
         * Set regular shape style for vector features. The resulting shape will be
         * a regular polygon when `radius` is provided, or a star when `radius1` and
         * `radius2` are provided.
         *
         * @constructor
         * @param {olx.style.RegularShapeOptions} options Options.
         * @extends {ol.style.Image}
         * @api
         */
        ol.style.RegularShape = function(options) {
            /**
             * @private
             * @type {Array.<string>}
             */
            this.checksums_ = null;

            /**
             * @private
             * @type {HTMLCanvasElement}
             */
            this.canvas_ = null;

            /**
             * @private
             * @type {HTMLCanvasElement}
             */
            this.hitDetectionCanvas_ = null;

            /**
             * @private
             * @type {ol.style.Fill}
             */
            this.fill_ = options.fill !== undefined ? options.fill : null;

            /**
             * @private
             * @type {Array.<number>}
             */
            this.origin_ = [0, 0];

            /**
             * @private
             * @type {number}
             */
            this.points_ = options.points;

            /**
             * @protected
             * @type {number}
             */
            this.radius_ = /** @type {number} */ (options.radius !== undefined ?
                options.radius : options.radius1);

            /**
             * @private
             * @type {number|undefined}
             */
            this.radius2_ = options.radius2;

            /**
             * @private
             * @type {number}
             */
            this.angle_ = options.angle !== undefined ? options.angle : 0;

            /**
             * @private
             * @type {ol.style.Stroke}
             */
            this.stroke_ = options.stroke !== undefined ? options.stroke : null;

            /**
             * @private
             * @type {Array.<number>}
             */
            this.anchor_ = null;

            /**
             * @private
             * @type {ol.Size}
             */
            this.size_ = null;

            /**
             * @private
             * @type {ol.Size}
             */
            this.imageSize_ = null;

            /**
             * @private
             * @type {ol.Size}
             */
            this.hitDetectionImageSize_ = null;

            /**
             * @protected
             * @type {ol.style.AtlasManager|undefined}
             */
            this.atlasManager_ = options.atlasManager;

            this.render_(this.atlasManager_);

            /**
             * @type {boolean}
             */
            var snapToPixel = options.snapToPixel !== undefined ?
                options.snapToPixel : true;

            /**
             * @type {boolean}
             */
            var rotateWithView = options.rotateWithView !== undefined ?
                options.rotateWithView : false;

            ol.style.Image.call(this, {
                opacity: 1,
                rotateWithView: rotateWithView,
                rotation: options.rotation !== undefined ? options.rotation : 0,
                scale: 1,
                snapToPixel: snapToPixel
            });
        };
        ol.inherits(ol.style.RegularShape, ol.style.Image);

        ol.style.RegularShape.prototype.clone = function() {
            var style = new ol.style.RegularShape({
                fill: this.getFill() ? this.getFill().clone() : undefined,
                points: this.getPoints(),
                radius: this.getRadius(),
                radius2: this.getRadius2(),
                angle: this.getAngle(),
                snapToPixel: this.getSnapToPixel(),
                stroke: this.getStroke() ?  this.getStroke().clone() : undefined,
                rotation: this.getRotation(),
                rotateWithView: this.getRotateWithView(),
                atlasManager: this.atlasManager_
            });
            style.setOpacity(this.getOpacity());
            style.setScale(this.getScale());
            return style;
        };

        /**
         * @inheritDoc
         * @api
         */
        ol.style.RegularShape.prototype.getAnchor = function() {
            return this.anchor_;
        };


        /**
         * Get the angle used in generating the shape.
         * @return {number} Shape's rotation in radians.
         * @api
         */
        ol.style.RegularShape.prototype.getAngle = function() {
            return this.angle_;
        };

        /**
         * Get the fill style for the shape.
         * @return {ol.style.Fill} Fill style.
         * @api
         */
        ol.style.RegularShape.prototype.getFill = function() {
            return this.fill_;
        };

        /**
         * @inheritDoc
         */
        ol.style.RegularShape.prototype.getHitDetectionImage = function(pixelRatio) {
            return this.hitDetectionCanvas_;
        };


        /**
         * @inheritDoc
         * @api
         */
        ol.style.RegularShape.prototype.getImage = function(pixelRatio) {
            return this.canvas_;
        };

        /**
         * @inheritDoc
         */
        ol.style.RegularShape.prototype.getImageSize = function() {
            return this.imageSize_;
        };


        /**
         * @inheritDoc
         */
        ol.style.RegularShape.prototype.getHitDetectionImageSize = function() {
            return this.hitDetectionImageSize_;
        };


        /**
         * @inheritDoc
         */
        ol.style.RegularShape.prototype.getImageState = function() {
            return ol.ImageState.LOADED;
        };

        /**
         * @inheritDoc
         * @api
         */
        ol.style.RegularShape.prototype.getOrigin = function() {
            return this.origin_;
        };


        /**
         * Get the number of points for generating the shape.
         * @return {number} Number of points for stars and regular polygons.
         * @api
         */
        ol.style.RegularShape.prototype.getPoints = function() {
            return this.points_;
        };


        /**
         * Get the (primary) radius for the shape.
         * @return {number} Radius.
         * @api
         */
        ol.style.RegularShape.prototype.getRadius = function() {
            return this.radius_;
        };


        /**
         * Get the secondary radius for the shape.
         * @return {number|undefined} Radius2.
         * @api
         */
        ol.style.RegularShape.prototype.getRadius2 = function() {
            return this.radius2_;
        };


        /**
         * @inheritDoc
         * @api
         */
        ol.style.RegularShape.prototype.getSize = function() {
            return this.size_;
        };


        /**
         * Get the stroke style for the shape.
         * @return {ol.style.Stroke} Stroke style.
         * @api
         */
        ol.style.RegularShape.prototype.getStroke = function() {
            return this.stroke_;
        };


        /**
         * @inheritDoc
         */
        ol.style.RegularShape.prototype.listenImageChange = function(listener, thisArg) {};


        /**
         * @inheritDoc
         */
        ol.style.RegularShape.prototype.load = function() {};


        /**
         * @inheritDoc
         */
        ol.style.RegularShape.prototype.unlistenImageChange = function(listener, thisArg) {};


        /**
         * @protected
         * @param {ol.style.AtlasManager|undefined} atlasManager An atlas manager.
         */
        ol.style.RegularShape.prototype.render_ = function(atlasManager) {
            var imageSize;
            var lineCap = '';
            var lineJoin = '';
            var miterLimit = 0;
            var lineDash = null;
            var lineDashOffset = 0;
            var strokeStyle;
            var strokeWidth = 0;

            if (this.stroke_) {
                strokeStyle = this.stroke_.getColor();
                if (strokeStyle === null) {
                    strokeStyle = ol.render.canvas.defaultStrokeStyle;
                }
                strokeStyle = ol.colorlike.asColorLike(strokeStyle);
                strokeWidth = this.stroke_.getWidth();
                if (strokeWidth === undefined) {
                    strokeWidth = ol.render.canvas.defaultLineWidth;
                }
                lineDash = this.stroke_.getLineDash();
                lineDashOffset = this.stroke_.getLineDashOffset();
                if (!ol.has.CANVAS_LINE_DASH) {
                    lineDash = null;
                    lineDashOffset = 0;
                }
                lineJoin = this.stroke_.getLineJoin();
                if (lineJoin === undefined) {
                    lineJoin = ol.render.canvas.defaultLineJoin;
                }
                lineCap = this.stroke_.getLineCap();
                if (lineCap === undefined) {
                    lineCap = ol.render.canvas.defaultLineCap;
                }
                miterLimit = this.stroke_.getMiterLimit();
                if (miterLimit === undefined) {
                    miterLimit = ol.render.canvas.defaultMiterLimit;
                }
            }

            var size = 2 * (this.radius_ + strokeWidth) + 1;

            /** @type {ol.RegularShapeRenderOptions} */
            var renderOptions = {
                strokeStyle: strokeStyle,
                strokeWidth: strokeWidth,
                size: size,
                lineCap: lineCap,
                lineDash: lineDash,
                lineDashOffset: lineDashOffset,
                lineJoin: lineJoin,
                miterLimit: miterLimit
            };

            if (atlasManager === undefined) {
                // no atlas manager is used, create a new canvas
                var context = ol.dom.createCanvasContext2D(size, size);
                this.canvas_ = context.canvas;

                // canvas.width and height are rounded to the closest integer
                size = this.canvas_.width;
                imageSize = size;

                this.draw_(renderOptions, context, 0, 0);

                this.createHitDetectionCanvas_(renderOptions);
            } else {
                // an atlas manager is used, add the symbol to an atlas
                size = Math.round(size);

                var hasCustomHitDetectionImage = !this.fill_;
                var renderHitDetectionCallback;
                if (hasCustomHitDetectionImage) {
                    // render the hit-detection image into a separate atlas image
                    renderHitDetectionCallback =
                        this.drawHitDetectionCanvas_.bind(this, renderOptions);
                }

                var id = this.getChecksum();
                var info = atlasManager.add(
                    id, size, size, this.draw_.bind(this, renderOptions),
                    renderHitDetectionCallback);

                this.canvas_ = info.image;
                this.origin_ = [info.offsetX, info.offsetY];
                imageSize = info.image.width;

                if (hasCustomHitDetectionImage) {
                    this.hitDetectionCanvas_ = info.hitImage;
                    this.hitDetectionImageSize_ =
                        [info.hitImage.width, info.hitImage.height];
                } else {
                    this.hitDetectionCanvas_ = this.canvas_;
                    this.hitDetectionImageSize_ = [imageSize, imageSize];
                }
            }

            this.anchor_ = [size / 2, size / 2];
            this.size_ = [size, size];
            this.imageSize_ = [imageSize, imageSize];
        };


        /**
         * @private
         * @param {ol.RegularShapeRenderOptions} renderOptions Render options.
         * @param {CanvasRenderingContext2D} context The rendering context.
         * @param {number} x The origin for the symbol (x).
         * @param {number} y The origin for the symbol (y).
         */
        ol.style.RegularShape.prototype.draw_ = function(renderOptions, context, x, y) {
            var i, angle0, radiusC;
            // reset transform
            context.setTransform(1, 0, 0, 1, 0, 0);

            // then move to (x, y)
            context.translate(x, y);

            context.beginPath();

            var points = this.points_;
            if (points === Infinity) {
                context.arc(
                    renderOptions.size / 2, renderOptions.size / 2,
                    this.radius_, 0, 2 * Math.PI, true);
            } else {
                var radius2 = (this.radius2_ !== undefined) ? this.radius2_
                    : this.radius_;
                if (radius2 !== this.radius_) {
                    points = 2 * points;
                }
                for (i = 0; i <= points; i++) {
                    angle0 = i * 2 * Math.PI / points - Math.PI / 2 + this.angle_;
                    radiusC = i % 2 === 0 ? this.radius_ : radius2;
                    context.lineTo(renderOptions.size / 2 + radiusC * Math.cos(angle0),
                        renderOptions.size / 2 + radiusC * Math.sin(angle0));
                }
            }


            if (this.fill_) {
                var color = this.fill_.getColor();
                if (color === null) {
                    color = ol.render.canvas.defaultFillStyle;
                }
                context.fillStyle = ol.colorlike.asColorLike(color);
                context.fill();
            }
            if (this.stroke_) {
                context.strokeStyle = renderOptions.strokeStyle;
                context.lineWidth = renderOptions.strokeWidth;
                if (renderOptions.lineDash) {
                    context.setLineDash(renderOptions.lineDash);
                    context.lineDashOffset = renderOptions.lineDashOffset;
                }
                context.lineCap = renderOptions.lineCap;
                context.lineJoin = renderOptions.lineJoin;
                context.miterLimit = renderOptions.miterLimit;
                context.stroke();
            }
            context.closePath();
        };


        /**
         * @private
         * @param {ol.RegularShapeRenderOptions} renderOptions Render options.
         */
        ol.style.RegularShape.prototype.createHitDetectionCanvas_ = function(renderOptions) {
            this.hitDetectionImageSize_ = [renderOptions.size, renderOptions.size];
            if (this.fill_) {
                this.hitDetectionCanvas_ = this.canvas_;
                return;
            }

            // if no fill style is set, create an extra hit-detection image with a
            // default fill style
            var context = ol.dom.createCanvasContext2D(renderOptions.size, renderOptions.size);
            this.hitDetectionCanvas_ = context.canvas;

            this.drawHitDetectionCanvas_(renderOptions, context, 0, 0);
        };


        /**
         * @private
         * @param {ol.RegularShapeRenderOptions} renderOptions Render options.
         * @param {CanvasRenderingContext2D} context The context.
         * @param {number} x The origin for the symbol (x).
         * @param {number} y The origin for the symbol (y).
         */
        ol.style.RegularShape.prototype.drawHitDetectionCanvas_ = function(renderOptions, context, x, y) {
            // reset transform
            context.setTransform(1, 0, 0, 1, 0, 0);

            // then move to (x, y)
            context.translate(x, y);

            context.beginPath();

            var points = this.points_;
            if (points === Infinity) {
                context.arc(
                    renderOptions.size / 2, renderOptions.size / 2,
                    this.radius_, 0, 2 * Math.PI, true);
            } else {
                var radius2 = (this.radius2_ !== undefined) ? this.radius2_
                    : this.radius_;
                if (radius2 !== this.radius_) {
                    points = 2 * points;
                }
                var i, radiusC, angle0;
                for (i = 0; i <= points; i++) {
                    angle0 = i * 2 * Math.PI / points - Math.PI / 2 + this.angle_;
                    radiusC = i % 2 === 0 ? this.radius_ : radius2;
                    context.lineTo(renderOptions.size / 2 + radiusC * Math.cos(angle0),
                        renderOptions.size / 2 + radiusC * Math.sin(angle0));
                }
            }

            context.fillStyle = ol.render.canvas.defaultFillStyle;
            context.fill();
            if (this.stroke_) {
                context.strokeStyle = renderOptions.strokeStyle;
                context.lineWidth = renderOptions.strokeWidth;
                if (renderOptions.lineDash) {
                    context.setLineDash(renderOptions.lineDash);
                    context.lineDashOffset = renderOptions.lineDashOffset;
                }
                context.stroke();
            }
            context.closePath();
        };


        /**
         * @return {string} The checksum.
         */
        ol.style.RegularShape.prototype.getChecksum = function() {
            var strokeChecksum = this.stroke_ ?
                this.stroke_.getChecksum() : '-';
            var fillChecksum = this.fill_ ?
                this.fill_.getChecksum() : '-';

            var recalculate = !this.checksums_ ||
                (strokeChecksum != this.checksums_[1] ||
                    fillChecksum != this.checksums_[2] ||
                    this.radius_ != this.checksums_[3] ||
                    this.radius2_ != this.checksums_[4] ||
                    this.angle_ != this.checksums_[5] ||
                    this.points_ != this.checksums_[6]);

            if (recalculate) {
                var checksum = 'r' + strokeChecksum + fillChecksum +
                    (this.radius_ !== undefined ? this.radius_.toString() : '-') +
                    (this.radius2_ !== undefined ? this.radius2_.toString() : '-') +
                    (this.angle_ !== undefined ? this.angle_.toString() : '-') +
                    (this.points_ !== undefined ? this.points_.toString() : '-');
                this.checksums_ = [checksum, strokeChecksum, fillChecksum,
                    this.radius_, this.radius2_, this.angle_, this.points_];
            }

            return this.checksums_[0];
        };

        /**
         * @classdesc
         * Set circle style for vector features.
         *
         * @constructor
         * @param {olx.style.CircleOptions=} opt_options Options.
         * @extends {ol.style.RegularShape}
         * @api
         */
        ol.style.Circle = function(opt_options) {

            var options = opt_options || {};

            ol.style.RegularShape.call(this, {
                points: Infinity,
                fill: options.fill,
                radius: options.radius,
                snapToPixel: options.snapToPixel,
                stroke: options.stroke,
                atlasManager: options.atlasManager
            });

        };
        ol.inherits(ol.style.Circle, ol.style.RegularShape);


        /**
         * Clones the style.  If an atlasmanager was provided to the original style it will be used in the cloned style, too.
         * @return {ol.style.Circle} The cloned style.
         * @override
         * @api
         */
        ol.style.Circle.prototype.clone = function() {
            var style = new ol.style.Circle({
                fill: this.getFill() ? this.getFill().clone() : undefined,
                stroke: this.getStroke() ? this.getStroke().clone() : undefined,
                radius: this.getRadius(),
                snapToPixel: this.getSnapToPixel(),
                atlasManager: this.atlasManager_
            });
            style.setOpacity(this.getOpacity());
            style.setScale(this.getScale());
            return style;
        };


        /**
         * Set the circle radius.
         *
         * @param {number} radius Circle radius.
         * @api
         */
        ol.style.Circle.prototype.setRadius = function(radius) {
            this.radius_ = radius;
            this.render_(this.atlasManager_);
        };

        /**
         * @classdesc
         * Set fill style for vector features.
         *
         * @constructor
         * @param {olx.style.FillOptions=} opt_options Options.
         * @api
         */
        ol.style.Fill = function(opt_options) {

            var options = opt_options || {};

            /**
             * @private
             * @type {ol.Color|ol.ColorLike}
             */
            this.color_ = options.color !== undefined ? options.color : null;

            /**
             * @private
             * @type {string|undefined}
             */
            this.checksum_ = undefined;
        };


        /**
         * Clones the style. The color is not cloned if it is an {@link ol.ColorLike}.
         * @return {ol.style.Fill} The cloned style.
         * @api
         */
        ol.style.Fill.prototype.clone = function() {
            var color = this.getColor();
            return new ol.style.Fill({
                color: (color && color.slice) ? color.slice() : color || undefined
            });
        };


        /**
         * Get the fill color.
         * @return {ol.Color|ol.ColorLike} Color.
         * @api
         */
        ol.style.Fill.prototype.getColor = function() {
            return this.color_;
        };


        /**
         * Set the color.
         *
         * @param {ol.Color|ol.ColorLike} color Color.
         * @api
         */
        ol.style.Fill.prototype.setColor = function(color) {
            this.color_ = color;
            this.checksum_ = undefined;
        };


        /**
         * @return {string} The checksum.
         */
        ol.style.Fill.prototype.getChecksum = function() {
            if (this.checksum_ === undefined) {
                if (
                    this.color_ instanceof CanvasPattern ||
                        this.color_ instanceof CanvasGradient
                    ) {
                    this.checksum_ = ol.getUid(this.color_).toString();
                } else {
                    this.checksum_ = 'f' + (this.color_ ?
                        ol.color.asString(this.color_) : '-');
                }
            }

            return this.checksum_;
        };

        /**
         * @classdesc
         * Set stroke style for vector features.
         * Note that the defaults given are the Canvas defaults, which will be used if
         * option is not defined. The `get` functions return whatever was entered in
         * the options; they will not return the default.
         *
         * @constructor
         * @param {olx.style.StrokeOptions=} opt_options Options.
         * @api
         */
        ol.style.Stroke = function(opt_options) {

            var options = opt_options || {};

            /**
             * @private
             * @type {ol.Color|ol.ColorLike}
             */
            this.color_ = options.color !== undefined ? options.color : null;

            /**
             * @private
             * @type {string|undefined}
             */
            this.lineCap_ = options.lineCap;

            /**
             * @private
             * @type {Array.<number>}
             */
            this.lineDash_ = options.lineDash !== undefined ? options.lineDash : null;

            /**
             * @private
             * @type {number|undefined}
             */
            this.lineDashOffset_ = options.lineDashOffset;

            /**
             * @private
             * @type {string|undefined}
             */
            this.lineJoin_ = options.lineJoin;

            /**
             * @private
             * @type {number|undefined}
             */
            this.miterLimit_ = options.miterLimit;

            /**
             * @private
             * @type {number|undefined}
             */
            this.width_ = options.width;

            /**
             * @private
             * @type {string|undefined}
             */
            this.checksum_ = undefined;
        };


        /**
         * Clones the style.
         * @return {ol.style.Stroke} The cloned style.
         * @api
         */
        ol.style.Stroke.prototype.clone = function() {
            var color = this.getColor();
            return new ol.style.Stroke({
                color: (color && color.slice) ? color.slice() : color || undefined,
                lineCap: this.getLineCap(),
                lineDash: this.getLineDash() ? this.getLineDash().slice() : undefined,
                lineDashOffset: this.getLineDashOffset(),
                lineJoin: this.getLineJoin(),
                miterLimit: this.getMiterLimit(),
                width: this.getWidth()
            });
        };


        /**
         * Get the stroke color.
         * @return {ol.Color|ol.ColorLike} Color.
         * @api
         */
        ol.style.Stroke.prototype.getColor = function() {
            return this.color_;
        };


        /**
         * Get the line cap type for the stroke.
         * @return {string|undefined} Line cap.
         * @api
         */
        ol.style.Stroke.prototype.getLineCap = function() {
            return this.lineCap_;
        };


        /**
         * Get the line dash style for the stroke.
         * @return {Array.<number>} Line dash.
         * @api
         */
        ol.style.Stroke.prototype.getLineDash = function() {
            return this.lineDash_;
        };


        /**
         * Get the line dash offset for the stroke.
         * @return {number|undefined} Line dash offset.
         * @api
         */
        ol.style.Stroke.prototype.getLineDashOffset = function() {
            return this.lineDashOffset_;
        };


        /**
         * Get the line join type for the stroke.
         * @return {string|undefined} Line join.
         * @api
         */
        ol.style.Stroke.prototype.getLineJoin = function() {
            return this.lineJoin_;
        };


        /**
         * Get the miter limit for the stroke.
         * @return {number|undefined} Miter limit.
         * @api
         */
        ol.style.Stroke.prototype.getMiterLimit = function() {
            return this.miterLimit_;
        };


        /**
         * Get the stroke width.
         * @return {number|undefined} Width.
         * @api
         */
        ol.style.Stroke.prototype.getWidth = function() {
            return this.width_;
        };


        /**
         * Set the color.
         *
         * @param {ol.Color|ol.ColorLike} color Color.
         * @api
         */
        ol.style.Stroke.prototype.setColor = function(color) {
            this.color_ = color;
            this.checksum_ = undefined;
        };


        /**
         * Set the line cap.
         *
         * @param {string|undefined} lineCap Line cap.
         * @api
         */
        ol.style.Stroke.prototype.setLineCap = function(lineCap) {
            this.lineCap_ = lineCap;
            this.checksum_ = undefined;
        };


        /**
         * Set the line dash.
         *
         * Please note that Internet Explorer 10 and lower [do not support][mdn] the
         * `setLineDash` method on the `CanvasRenderingContext2D` and therefore this
         * property will have no visual effect in these browsers.
         *
         * [mdn]: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash#Browser_compatibility
         *
         * @param {Array.<number>} lineDash Line dash.
         * @api
         */
        ol.style.Stroke.prototype.setLineDash = function(lineDash) {
            this.lineDash_ = lineDash;
            this.checksum_ = undefined;
        };


        /**
         * Set the line dash offset.
         *
         * @param {number|undefined} lineDashOffset Line dash offset.
         * @api
         */
        ol.style.Stroke.prototype.setLineDashOffset = function(lineDashOffset) {
            this.lineDashOffset_ = lineDashOffset;
            this.checksum_ = undefined;
        };


        /**
         * Set the line join.
         *
         * @param {string|undefined} lineJoin Line join.
         * @api
         */
        ol.style.Stroke.prototype.setLineJoin = function(lineJoin) {
            this.lineJoin_ = lineJoin;
            this.checksum_ = undefined;
        };


        /**
         * Set the miter limit.
         *
         * @param {number|undefined} miterLimit Miter limit.
         * @api
         */
        ol.style.Stroke.prototype.setMiterLimit = function(miterLimit) {
            this.miterLimit_ = miterLimit;
            this.checksum_ = undefined;
        };


        /**
         * Set the width.
         *
         * @param {number|undefined} width Width.
         * @api
         */
        ol.style.Stroke.prototype.setWidth = function(width) {
            this.width_ = width;
            this.checksum_ = undefined;
        };


        /**
         * @return {string} The checksum.
         */
        ol.style.Stroke.prototype.getChecksum = function() {
            if (this.checksum_ === undefined) {
                this.checksum_ = 's';
                if (this.color_) {
                    if (typeof this.color_ === 'string') {
                        this.checksum_ += this.color_;
                    } else {
                        this.checksum_ += ol.getUid(this.color_).toString();
                    }
                } else {
                    this.checksum_ += '-';
                }
                this.checksum_ += ',' +
                    (this.lineCap_ !== undefined ?
                        this.lineCap_.toString() : '-') + ',' +
                    (this.lineDash_ ?
                        this.lineDash_.toString() : '-') + ',' +
                    (this.lineDashOffset_ !== undefined ?
                        this.lineDashOffset_ : '-') + ',' +
                    (this.lineJoin_ !== undefined ?
                        this.lineJoin_ : '-') + ',' +
                    (this.miterLimit_ !== undefined ?
                        this.miterLimit_.toString() : '-') + ',' +
                    (this.width_ !== undefined ?
                        this.width_.toString() : '-');
            }

            return this.checksum_;
        };

        /**
         * Icon anchor units. One of 'fraction', 'pixels'.
         * @enum {string}
         */
        ol.style.IconAnchorUnits = {
            FRACTION: 'fraction',
            PIXELS: 'pixels'
        };

        /**
         * @constructor
         * @param {Image|HTMLCanvasElement} image Image.
         * @param {string|undefined} src Src.
         * @param {ol.Size} size Size.
         * @param {?string} crossOrigin Cross origin.
         * @param {ol.ImageState} imageState Image state.
         * @param {ol.Color} color Color.
         * @extends {ol.events.EventTarget}
         */
        ol.style.IconImage = function(image, src, size, crossOrigin, imageState,
                                      color) {

            ol.events.EventTarget.call(this);

            /**
             * @private
             * @type {Image|HTMLCanvasElement}
             */
            this.hitDetectionImage_ = null;

            /**
             * @private
             * @type {Image|HTMLCanvasElement}
             */
            this.image_ = !image ? new Image() : image;

            if (crossOrigin !== null) {
                this.image_.crossOrigin = crossOrigin;
            }

            /**
             * @private
             * @type {HTMLCanvasElement}
             */
            this.canvas_ = color ?
            /** @type {HTMLCanvasElement} */ (document.createElement('CANVAS')) :
                null;

            /**
             * @private
             * @type {ol.Color}
             */
            this.color_ = color;

            /**
             * @private
             * @type {Array.<ol.EventsKey>}
             */
            this.imageListenerKeys_ = null;

            /**
             * @private
             * @type {ol.ImageState}
             */
            this.imageState_ = imageState;

            /**
             * @private
             * @type {ol.Size}
             */
            this.size_ = size;

            /**
             * @private
             * @type {string|undefined}
             */
            this.src_ = src;

            /**
             * @private
             * @type {boolean}
             */
            this.tainting_ = false;
            if (this.imageState_ == ol.ImageState.LOADED) {
                this.determineTainting_();
            }

        };
        ol.inherits(ol.style.IconImage, ol.events.EventTarget);


        /**
         * @param {Image|HTMLCanvasElement} image Image.
         * @param {string} src Src.
         * @param {ol.Size} size Size.
         * @param {?string} crossOrigin Cross origin.
         * @param {ol.ImageState} imageState Image state.
         * @param {ol.Color} color Color.
         * @return {ol.style.IconImage} Icon image.
         */
        ol.style.IconImage.get = function(image, src, size, crossOrigin, imageState,
                                          color) {
            var iconImageCache = ol.style.iconImageCache;
            var iconImage = iconImageCache.get(src, crossOrigin, color);
            if (!iconImage) {
                iconImage = new ol.style.IconImage(
                    image, src, size, crossOrigin, imageState, color);
                iconImageCache.set(src, crossOrigin, color, iconImage);
            }
            return iconImage;
        };


        /**
         * @private
         */
        ol.style.IconImage.prototype.determineTainting_ = function() {
            var context = ol.dom.createCanvasContext2D(1, 1);
            try {
                context.drawImage(this.image_, 0, 0);
                context.getImageData(0, 0, 1, 1);
            } catch (e) {
                this.tainting_ = true;
            }
        };


        /**
         * @private
         */
        ol.style.IconImage.prototype.dispatchChangeEvent_ = function() {
            this.dispatchEvent(ol.events.EventType.CHANGE);
        };


        /**
         * @private
         */
        ol.style.IconImage.prototype.handleImageError_ = function() {
            this.imageState_ = ol.ImageState.ERROR;
            this.unlistenImage_();
            this.dispatchChangeEvent_();
        };


        /**
         * @private
         */
        ol.style.IconImage.prototype.handleImageLoad_ = function() {
            this.imageState_ = ol.ImageState.LOADED;
            if (this.size_) {
                this.image_.width = this.size_[0];
                this.image_.height = this.size_[1];
            }
            this.size_ = [this.image_.width, this.image_.height];
            this.unlistenImage_();
            this.determineTainting_();
            this.replaceColor_();
            this.dispatchChangeEvent_();
        };


        /**
         * @param {number} pixelRatio Pixel ratio.
         * @return {Image|HTMLCanvasElement} Image or Canvas element.
         */
        ol.style.IconImage.prototype.getImage = function(pixelRatio) {
            return this.canvas_ ? this.canvas_ : this.image_;
        };


        /**
         * @return {ol.ImageState} Image state.
         */
        ol.style.IconImage.prototype.getImageState = function() {
            return this.imageState_;
        };


        /**
         * @param {number} pixelRatio Pixel ratio.
         * @return {Image|HTMLCanvasElement} Image element.
         */
        ol.style.IconImage.prototype.getHitDetectionImage = function(pixelRatio) {
            if (!this.hitDetectionImage_) {
                if (this.tainting_) {
                    var width = this.size_[0];
                    var height = this.size_[1];
                    var context = ol.dom.createCanvasContext2D(width, height);
                    context.fillRect(0, 0, width, height);
                    this.hitDetectionImage_ = context.canvas;
                } else {
                    this.hitDetectionImage_ = this.image_;
                }
            }
            return this.hitDetectionImage_;
        };


        /**
         * @return {ol.Size} Image size.
         */
        ol.style.IconImage.prototype.getSize = function() {
            return this.size_;
        };


        /**
         * @return {string|undefined} Image src.
         */
        ol.style.IconImage.prototype.getSrc = function() {
            return this.src_;
        };


        /**
         * Load not yet loaded URI.
         */
        ol.style.IconImage.prototype.load = function() {
            if (this.imageState_ == ol.ImageState.IDLE) {
                this.imageState_ = ol.ImageState.LOADING;
                this.imageListenerKeys_ = [
                    ol.events.listenOnce(this.image_, ol.events.EventType.ERROR,
                        this.handleImageError_, this),
                    ol.events.listenOnce(this.image_, ol.events.EventType.LOAD,
                        this.handleImageLoad_, this)
                ];
                try {
                    this.image_.src = this.src_;
                } catch (e) {
                    this.handleImageError_();
                }
            }
        };


        /**
         * @private
         */
        ol.style.IconImage.prototype.replaceColor_ = function() {
            if (this.tainting_ || this.color_ === null) {
                return;
            }

            this.canvas_.width = this.image_.width;
            this.canvas_.height = this.image_.height;

            var ctx = this.canvas_.getContext('2d');
            ctx.drawImage(this.image_, 0, 0);

            var imgData = ctx.getImageData(0, 0, this.image_.width, this.image_.height);
            var data = imgData.data;
            var r = this.color_[0] / 255.0;
            var g = this.color_[1] / 255.0;
            var b = this.color_[2] / 255.0;

            for (var i = 0, ii = data.length; i < ii; i += 4) {
                data[i] *= r;
                data[i + 1] *= g;
                data[i + 2] *= b;
            }
            ctx.putImageData(imgData, 0, 0);
        };


        /**
         * Discards event handlers which listen for load completion or errors.
         *
         * @private
         */
        ol.style.IconImage.prototype.unlistenImage_ = function() {
            this.imageListenerKeys_.forEach(ol.events.unlistenByKey);
            this.imageListenerKeys_ = null;
        };

        /**
         * Icon origin. One of 'bottom-left', 'bottom-right', 'top-left', 'top-right'.
         * @enum {string}
         */
        ol.style.IconOrigin = {
            BOTTOM_LEFT: 'bottom-left',
            BOTTOM_RIGHT: 'bottom-right',
            TOP_LEFT: 'top-left',
            TOP_RIGHT: 'top-right'
        };

        /**
         * @classdesc
         * Set icon style for vector features.
         *
         * @constructor
         * @param {olx.style.IconOptions=} opt_options Options.
         * @extends {ol.style.Image}
         * @api
         */
        ol.style.Icon = function(opt_options) {

            var options = opt_options || {};

            /**
             * @private
             * @type {Array.<number>}
             */
            this.anchor_ = options.anchor !== undefined ? options.anchor : [0.5, 0.5];

            /**
             * @private
             * @type {Array.<number>}
             */
            this.normalizedAnchor_ = null;

            /**
             * @private
             * @type {ol.style.IconOrigin}
             */
            this.anchorOrigin_ = options.anchorOrigin !== undefined ?
                options.anchorOrigin : ol.style.IconOrigin.TOP_LEFT;

            /**
             * @private
             * @type {ol.style.IconAnchorUnits}
             */
            this.anchorXUnits_ = options.anchorXUnits !== undefined ?
                options.anchorXUnits : ol.style.IconAnchorUnits.FRACTION;

            /**
             * @private
             * @type {ol.style.IconAnchorUnits}
             */
            this.anchorYUnits_ = options.anchorYUnits !== undefined ?
                options.anchorYUnits : ol.style.IconAnchorUnits.FRACTION;

            /**
             * @private
             * @type {?string}
             */
            this.crossOrigin_ =
                options.crossOrigin !== undefined ? options.crossOrigin : null;

            /**
             * @type {Image|HTMLCanvasElement}
             */
            var image = options.img !== undefined ? options.img : null;

            /**
             * @type {ol.Size}
             */
            var imgSize = options.imgSize !== undefined ? options.imgSize : null;

            /**
             * @type {string|undefined}
             */
            var src = options.src;

    //        ol.asserts.assert(!(src !== undefined && image),
    //            4); // `image` and `src` cannot be provided at the same time
    //        ol.asserts.assert(!image || (image && imgSize),
    //            5); // `imgSize` must be set when `image` is provided

            if ((src === undefined || src.length === 0) && image) {
                src = image.src || ol.getUid(image).toString();
            }
    //        ol.asserts.assert(src !== undefined && src.length > 0,
    //            6); // A defined and non-empty `src` or `image` must be provided

            /**
             * @type {ol.ImageState}
             */
            var imageState = options.src !== undefined ?
                ol.ImageState.IDLE : ol.ImageState.LOADED;

            /**
             * @private
             * @type {ol.Color}
             */
            this.color_ = options.color !== undefined ? ol.color.asArray(options.color) :
                null;

            /**
             * @private
             * @type {ol.style.IconImage}
             */
            this.iconImage_ = ol.style.IconImage.get(
                image, /** @type {string} */ (src), imgSize, this.crossOrigin_, imageState, this.color_);

            /**
             * @private
             * @type {Array.<number>}
             */
            this.offset_ = options.offset !== undefined ? options.offset : [0, 0];

            /**
             * @private
             * @type {ol.style.IconOrigin}
             */
            this.offsetOrigin_ = options.offsetOrigin !== undefined ?
                options.offsetOrigin : ol.style.IconOrigin.TOP_LEFT;

            /**
             * @private
             * @type {Array.<number>}
             */
            this.origin_ = null;

            /**
             * @private
             * @type {ol.Size}
             */
            this.size_ = options.size !== undefined ? options.size : null;

            /**
             * @type {number}
             */
            var opacity = options.opacity !== undefined ? options.opacity : 1;

            /**
             * @type {boolean}
             */
            var rotateWithView = options.rotateWithView !== undefined ?
                options.rotateWithView : false;

            /**
             * @type {number}
             */
            var rotation = options.rotation !== undefined ? options.rotation : 0;

            /**
             * @type {number}
             */
            var scale = options.scale !== undefined ? options.scale : 1;

            /**
             * @type {boolean}
             */
            var snapToPixel = options.snapToPixel !== undefined ?
                options.snapToPixel : true;

            ol.style.Image.call(this, {
                opacity: opacity,
                rotation: rotation,
                scale: scale,
                snapToPixel: snapToPixel,
                rotateWithView: rotateWithView
            });

        };
        ol.inherits(ol.style.Icon, ol.style.Image);


        /**
         * Clones the style. The underlying Image/HTMLCanvasElement is not cloned.
         * @return {ol.style.Icon} The cloned style.
         * @api
         */
        ol.style.Icon.prototype.clone = function() {
            return new ol.style.Icon({
                anchor: this.anchor_.slice(),
                anchorOrigin: this.anchorOrigin_,
                anchorXUnits: this.anchorXUnits_,
                anchorYUnits: this.anchorYUnits_,
                crossOrigin: this.crossOrigin_,
                color: (this.color_ && this.color_.slice) ? this.color_.slice() : this.color_ || undefined,
                src: this.getSrc(),
                offset: this.offset_.slice(),
                offsetOrigin: this.offsetOrigin_,
                size: this.size_ !== null ? this.size_.slice() : undefined,
                opacity: this.getOpacity(),
                scale: this.getScale(),
                snapToPixel: this.getSnapToPixel(),
                rotation: this.getRotation(),
                rotateWithView: this.getRotateWithView()
            });
        };


        /**
         * @inheritDoc
         * @api
         */
        ol.style.Icon.prototype.getAnchor = function() {
            if (this.normalizedAnchor_) {
                return this.normalizedAnchor_;
            }
            var anchor = this.anchor_;
            var size = this.getSize();
            if (this.anchorXUnits_ == ol.style.IconAnchorUnits.FRACTION ||
                this.anchorYUnits_ == ol.style.IconAnchorUnits.FRACTION) {
                if (!size) {
                    return null;
                }
                anchor = this.anchor_.slice();
                if (this.anchorXUnits_ == ol.style.IconAnchorUnits.FRACTION) {
                    anchor[0] *= size[0];
                }
                if (this.anchorYUnits_ == ol.style.IconAnchorUnits.FRACTION) {
                    anchor[1] *= size[1];
                }
            }

            if (this.anchorOrigin_ != ol.style.IconOrigin.TOP_LEFT) {
                if (!size) {
                    return null;
                }
                if (anchor === this.anchor_) {
                    anchor = this.anchor_.slice();
                }
                if (this.anchorOrigin_ == ol.style.IconOrigin.TOP_RIGHT ||
                    this.anchorOrigin_ == ol.style.IconOrigin.BOTTOM_RIGHT) {
                    anchor[0] = -anchor[0] + size[0];
                }
                if (this.anchorOrigin_ == ol.style.IconOrigin.BOTTOM_LEFT ||
                    this.anchorOrigin_ == ol.style.IconOrigin.BOTTOM_RIGHT) {
                    anchor[1] = -anchor[1] + size[1];
                }
            }
            this.normalizedAnchor_ = anchor;
            return this.normalizedAnchor_;
        };


        /**
         * Get the icon color.
         * @return {ol.Color} Color.
         * @api
         */
        ol.style.Icon.prototype.getColor = function() {
            return this.color_;
        };


        /**
         * Get the image icon.
         * @param {number} pixelRatio Pixel ratio.
         * @return {Image|HTMLCanvasElement} Image or Canvas element.
         * @override
         * @api
         */
        ol.style.Icon.prototype.getImage = function(pixelRatio) {
            return this.iconImage_.getImage(pixelRatio);
        };


        /**
         * @override
         */
        ol.style.Icon.prototype.getImageSize = function() {
            return this.iconImage_.getSize();
        };


        /**
         * @override
         */
        ol.style.Icon.prototype.getHitDetectionImageSize = function() {
            return this.getImageSize();
        };


        /**
         * @override
         */
        ol.style.Icon.prototype.getImageState = function() {
            return this.iconImage_.getImageState();
        };


        /**
         * @override
         */
        ol.style.Icon.prototype.getHitDetectionImage = function(pixelRatio) {
            return this.iconImage_.getHitDetectionImage(pixelRatio);
        };


        /**
         * @inheritDoc
         * @api
         */
        ol.style.Icon.prototype.getOrigin = function() {
            if (this.origin_) {
                return this.origin_;
            }
            var offset = this.offset_;

            if (this.offsetOrigin_ != ol.style.IconOrigin.TOP_LEFT) {
                var size = this.getSize();
                var iconImageSize = this.iconImage_.getSize();
                if (!size || !iconImageSize) {
                    return null;
                }
                offset = offset.slice();
                if (this.offsetOrigin_ == ol.style.IconOrigin.TOP_RIGHT ||
                    this.offsetOrigin_ == ol.style.IconOrigin.BOTTOM_RIGHT) {
                    offset[0] = iconImageSize[0] - size[0] - offset[0];
                }
                if (this.offsetOrigin_ == ol.style.IconOrigin.BOTTOM_LEFT ||
                    this.offsetOrigin_ == ol.style.IconOrigin.BOTTOM_RIGHT) {
                    offset[1] = iconImageSize[1] - size[1] - offset[1];
                }
            }
            this.origin_ = offset;
            return this.origin_;
        };


        /**
         * Get the image URL.
         * @return {string|undefined} Image src.
         * @api
         */
        ol.style.Icon.prototype.getSrc = function() {
            return this.iconImage_.getSrc();
        };


        /**
         * @inheritDoc
         * @api
         */
        ol.style.Icon.prototype.getSize = function() {
            return !this.size_ ? this.iconImage_.getSize() : this.size_;
        };


        /**
         * @override
         */
        ol.style.Icon.prototype.listenImageChange = function(listener, thisArg) {
            return ol.events.listen(this.iconImage_, ol.events.EventType.CHANGE,
                listener, thisArg);
        };


        /**
         * Load not yet loaded URI.
         * When rendering a feature with an icon style, the vector renderer will
         * automatically call this method. However, you might want to call this
         * method yourself for preloading or other purposes.
         * @override
         * @api
         */
        ol.style.Icon.prototype.load = function() {
            this.iconImage_.load();
        };


        /**
         * @override
         */
        ol.style.Icon.prototype.unlistenImageChange = function(listener, thisArg) {
            ol.events.unlisten(this.iconImage_, ol.events.EventType.CHANGE,
                listener, thisArg);
        };

        ol.style.Text = function(opt_options) {
            var options = opt_options || {};
            this.font_ = options.font;
            this.rotation_ = options.rotation;
            this.rotateWithView_ = options.rotateWithView;
            this.scale_ = options.scale;
            this.text_ = options.text;
            this.textAlign_ = options.textAlign;
            this.textBaseline_ = options.textBaseline;
            this.fill_ = options.fill !== undefined ? options.fill :
                new ol.style.Fill({color: ol.style.Text.DEFAULT_FILL_COLOR_});
            this.maxAngle_ = options.maxAngle !== undefined ? options.maxAngle : Math.PI / 4;
            this.placement_ = options.placement !== undefined ? options.placement : ol.style.TextPlacement.POINT;

            //TODO Use options.overflow directly after removing @deprecated exceedLength
            var overflow = options.overflow === undefined ? options.exceedLength : options.overflow;

            this.overflow_ = overflow !== undefined ? overflow : false;
            this.stroke_ = options.stroke !== undefined ? options.stroke : null;
            this.offsetX_ = options.offsetX !== undefined ? options.offsetX : 0;
            this.offsetY_ = options.offsetY !== undefined ? options.offsetY : 0;
            this.backgroundFill_ = options.backgroundFill ? options.backgroundFill : null;
            this.backgroundStroke_ = options.backgroundStroke ? options.backgroundStroke : null;
            this.padding_ = options.padding === undefined ? null : options.padding;
        };

        ol.style.Text.DEFAULT_FILL_COLOR_ = '#333';
        ol.style.Text.prototype.clone = function() {
            return new ol.style.Text({
                font: this.getFont(),
                placement: this.getPlacement(),
                maxAngle: this.getMaxAngle(),
                overflow: this.getOverflow(),
                rotation: this.getRotation(),
                rotateWithView: this.getRotateWithView(),
                scale: this.getScale(),
                text: this.getText(),
                textAlign: this.getTextAlign(),
                textBaseline: this.getTextBaseline(),
                fill: this.getFill() ? this.getFill().clone() : undefined,
                stroke: this.getStroke() ? this.getStroke().clone() : undefined,
                offsetX: this.getOffsetX(),
                offsetY: this.getOffsetY()
            });
        };

        ol.style.Text.prototype.getOverflow = function() {
            return this.overflow_;
        };

        ol.style.Text.prototype.getFont = function() {
            return this.font_;
        };

        ol.style.Text.prototype.getMaxAngle = function() {
            return this.maxAngle_;
        };

        ol.style.Text.prototype.getPlacement = function() {
            return this.placement_;
        };

        ol.style.Text.prototype.getOffsetX = function() {
            return this.offsetX_;
        };

        ol.style.Text.prototype.getOffsetY = function() {
            return this.offsetY_;
        };

        ol.style.Text.prototype.getFill = function() {
            return this.fill_;
        };

        ol.style.Text.prototype.getRotateWithView = function() {
            return this.rotateWithView_;
        };

        ol.style.Text.prototype.getRotation = function() {
            return this.rotation_;
        };

        ol.style.Text.prototype.getScale = function() {
            return this.scale_;
        };

        ol.style.Text.prototype.getStroke = function() {
            return this.stroke_;
        };

        ol.style.Text.prototype.getText = function() {
            return this.text_;
        };

        ol.style.Text.prototype.getTextAlign = function() {
            return this.textAlign_;
        };

        ol.style.Text.prototype.getTextBaseline = function() {
            return this.textBaseline_;
        };

        ol.style.Text.prototype.getBackgroundFill = function() {
            return this.backgroundFill_;
        };

        ol.style.Text.prototype.getBackgroundStroke = function() {
            return this.backgroundStroke_;
        };

        ol.style.Text.prototype.getPadding = function() {
            return this.padding_;
        };

        ol.style.Text.prototype.setOverflow = function(overflow) {
            this.overflow_ = overflow;
        };

        ol.style.Text.prototype.setFont = function(font) {
            this.font_ = font;
        };

        ol.style.Text.prototype.setMaxAngle = function(maxAngle) {
            this.maxAngle_ = maxAngle;
        };

        ol.style.Text.prototype.setOffsetX = function(offsetX) {
            this.offsetX_ = offsetX;
        };

        ol.style.Text.prototype.setOffsetY = function(offsetY) {
            this.offsetY_ = offsetY;
        };

        ol.style.Text.prototype.setPlacement = function(placement) {
            this.placement_ = placement;
        };

        ol.style.Text.prototype.setFill = function(fill) {
            this.fill_ = fill;
        };

        ol.style.Text.prototype.setRotation = function(rotation) {
            this.rotation_ = rotation;
        };

        ol.style.Text.prototype.setScale = function(scale) {
            this.scale_ = scale;
        };

        ol.style.Text.prototype.setStroke = function(stroke) {
            this.stroke_ = stroke;
        };

        ol.style.Text.prototype.setText = function(text) {
            this.text_ = text;
        };

        ol.style.Text.prototype.setTextAlign = function(textAlign) {
            this.textAlign_ = textAlign;
        };

        ol.style.Text.prototype.setTextBaseline = function(textBaseline) {
            this.textBaseline_ = textBaseline;
        };

        ol.style.Text.prototype.setBackgroundFill = function(fill) {
            this.backgroundFill_ = fill;
        };

        ol.style.Text.prototype.setBackgroundStroke = function(stroke) {
            this.backgroundStroke_ = stroke;
        };

        ol.style.Text.prototype.setPadding = function(padding) {
            this.padding_ = padding;
        };

        ol.style.Style = function(opt_options) {

            var options = opt_options || {};

            /**
             * @private
             * @type {string|ol.geom.Geometry|ol.StyleGeometryFunction}
             */
            this.geometry_ = null;

            /**
             * @private
             * @type {!ol.StyleGeometryFunction}
             */
            this.geometryFunction_ = ol.style.Style.defaultGeometryFunction;

            if (options.geometry !== undefined) {
                this.setGeometry(options.geometry);
            }

            /**
             * @private
             * @type {ol.style.Fill}
             */
            this.fill_ = options.fill !== undefined ? options.fill : null;

            /**
             * @private
             * @type {ol.style.Image}
             */
            this.image_ = options.image !== undefined ? options.image : null;

            /**
             * @private
             * @type {ol.StyleRenderFunction|null}
             */
            this.renderer_ = options.renderer !== undefined ? options.renderer : null;

            /**
             * @private
             * @type {ol.style.Stroke}
             */
            this.stroke_ = options.stroke !== undefined ? options.stroke : null;

            /**
             * @private
             * @type {ol.style.Text}
             */
            this.text_ = options.text !== undefined ? options.text : null;

            /**
             * @private
             * @type {number|undefined}
             */
            this.zIndex_ = options.zIndex;

        };


        /**
         * Clones the style.
         * @return {ol.style.Style} The cloned style.
         * @api
         */
        ol.style.Style.prototype.clone = function() {
            var geometry = this.getGeometry();
            if (geometry && geometry.clone) {
                geometry = geometry.clone();
            }
            return new ol.style.Style({
                geometry: geometry,
                fill: this.getFill() ? this.getFill().clone() : undefined,
                image: this.getImage() ? this.getImage().clone() : undefined,
                stroke: this.getStroke() ? this.getStroke().clone() : undefined,
                text: this.getText() ? this.getText().clone() : undefined,
                zIndex: this.getZIndex()
            });
        };


        /**
         * Get the custom renderer function that was configured with
         * {@link #setRenderer} or the `renderer` constructor option.
         * @return {ol.StyleRenderFunction|null} Custom renderer function.
         * @api
         */
        ol.style.Style.prototype.getRenderer = function() {
            return this.renderer_;
        };


        /**
         * Sets a custom renderer function for this style. When set, `fill`, `stroke`
         * and `image` options of the style will be ignored.
         * @param {ol.StyleRenderFunction|null} renderer Custom renderer function.
         * @api
         */
        ol.style.Style.prototype.setRenderer = function(renderer) {
            this.renderer_ = renderer;
        };


        /**
         * Get the geometry to be rendered.
         * @return {string|ol.geom.Geometry|ol.StyleGeometryFunction}
         * Feature property or geometry or function that returns the geometry that will
         * be rendered with this style.
         * @api
         */
        ol.style.Style.prototype.getGeometry = function() {
            return this.geometry_;
        };


        /**
         * Get the function used to generate a geometry for rendering.
         * @return {!ol.StyleGeometryFunction} Function that is called with a feature
         * and returns the geometry to render instead of the feature's geometry.
         * @api
         */
        ol.style.Style.prototype.getGeometryFunction = function() {
            return this.geometryFunction_;
        };


        /**
         * Get the fill style.
         * @return {ol.style.Fill} Fill style.
         * @api
         */
        ol.style.Style.prototype.getFill = function() {
            return this.fill_;
        };


        /**
         * Set the fill style.
         * @param {ol.style.Fill} fill Fill style.
         * @api
         */
        ol.style.Style.prototype.setFill = function(fill) {
            this.fill_ = fill;
        };


        /**
         * Get the image style.
         * @return {ol.style.Image} Image style.
         * @api
         */
        ol.style.Style.prototype.getImage = function() {
            return this.image_;
        };


        /**
         * Set the image style.
         * @param {ol.style.Image} image Image style.
         * @api
         */
        ol.style.Style.prototype.setImage = function(image) {
            this.image_ = image;
        };


        /**
         * Get the stroke style.
         * @return {ol.style.Stroke} Stroke style.
         * @api
         */
        ol.style.Style.prototype.getStroke = function() {
            return this.stroke_;
        };


        /**
         * Set the stroke style.
         * @param {ol.style.Stroke} stroke Stroke style.
         * @api
         */
        ol.style.Style.prototype.setStroke = function(stroke) {
            this.stroke_ = stroke;
        };


        /**
         * Get the text style.
         * @return {ol.style.Text} Text style.
         * @api
         */
        ol.style.Style.prototype.getText = function() {
            return this.text_;
        };


        /**
         * Set the text style.
         * @param {ol.style.Text} text Text style.
         * @api
         */
        ol.style.Style.prototype.setText = function(text) {
            this.text_ = text;
        };


        /**
         * Get the z-index for the style.
         * @return {number|undefined} ZIndex.
         * @api
         */
        ol.style.Style.prototype.getZIndex = function() {
            return this.zIndex_;
        };


        /**
         * Set a geometry that is rendered instead of the feature's geometry.
         *
         * @param {string|ol.geom.Geometry|ol.StyleGeometryFunction} geometry
         *     Feature property or geometry or function returning a geometry to render
         *     for this style.
         * @api
         */
        ol.style.Style.prototype.setGeometry = function(geometry) {
            if (typeof geometry === 'function') {
                this.geometryFunction_ = geometry;
            } else if (typeof geometry === 'string') {
                this.geometryFunction_ = function(feature) {
                    return /** @type {ol.geom.Geometry} */ (feature.get(geometry));
                };
            } else if (!geometry) {
                this.geometryFunction_ = ol.style.Style.defaultGeometryFunction;
            } else if (geometry !== undefined) {
                this.geometryFunction_ = function() {
                    return /** @type {ol.geom.Geometry} */ (geometry);
                };
            }
            this.geometry_ = geometry;
        };


        /**
         * Set the z-index.
         *
         * @param {number|undefined} zIndex ZIndex.
         * @api
         */
        ol.style.Style.prototype.setZIndex = function(zIndex) {
            this.zIndex_ = zIndex;
        };


        /**
         * Convert the provided object into a style function.  Functions passed through
         * unchanged.  Arrays of ol.style.Style or single style objects wrapped in a
         * new style function.
         * @param {ol.StyleFunction|Array.<ol.style.Style>|ol.style.Style} obj
         *     A style function, a single style, or an array of styles.
         * @return {ol.StyleFunction} A style function.
         */
        ol.style.Style.createFunction = function(obj) {
            var styleFunction;

            if (typeof obj === 'function') {
                styleFunction = obj;
            } else {
                /**
                 * @type {Array.<ol.style.Style>}
                 */
                var styles;
                if (Array.isArray(obj)) {
                    styles = obj;
                } else {
                    ol.asserts.assert(obj instanceof ol.style.Style,
                        41); // Expected an `ol.style.Style` or an array of `ol.style.Style`
                    styles = [obj];
                }
                styleFunction = function() {
                    return styles;
                };
            }
            return styleFunction;
        };


        /**
         * @type {Array.<ol.style.Style>}
         * @private
         */
        ol.style.Style.default_ = null;


        /**
         * @param {ol.Feature|ol.render.Feature} feature Feature.
         * @param {number} resolution Resolution.
         * @return {Array.<ol.style.Style>} Style.
         */
        ol.style.Style.defaultFunction = function(feature, resolution) {
            // We don't use an immediately-invoked function
            // and a closure so we don't get an error at script evaluation time in
            // browsers that do not support Canvas. (ol.style.Circle does
            // canvas.getContext('2d') at construction time, which will cause an.error
            // in such browsers.)
            if (!ol.style.Style.default_) {
                var fill = new ol.style.Fill({
                    color: 'rgba(255,255,255,0.4)'
                });
                var stroke = new ol.style.Stroke({
                    color: '#3399CC',
                    width: 1.25
                });
                ol.style.Style.default_ = [
                    new ol.style.Style({
                        image: new ol.style.Circle({
                            fill: fill,
                            stroke: stroke,
                            radius: 5
                        }),
                        fill: fill,
                        stroke: stroke
                    })
                ];
            }
            return ol.style.Style.default_;
        };


        /**
         * Default styles for editing features.
         * @return {Object.<ol.geom.GeometryType, Array.<ol.style.Style>>} Styles
         */
        ol.style.Style.createDefaultEditing = function() {
            /** @type {Object.<ol.geom.GeometryType, Array.<ol.style.Style>>} */
            var styles = {};
            var white = [255, 255, 255, 1];
            var blue = [0, 153, 255, 1];
            var width = 3;
            styles[ol.geom.GeometryType.POLYGON] = [
                new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: [255, 255, 255, 0.5]
                    })
                })
            ];
            styles[ol.geom.GeometryType.MULTI_POLYGON] =
                styles[ol.geom.GeometryType.POLYGON];

            styles[ol.geom.GeometryType.LINE_STRING] = [
                new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: white,
                        width: width + 2
                    })
                }),
                new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: blue,
                        width: width
                    })
                })
            ];
            styles[ol.geom.GeometryType.MULTI_LINE_STRING] =
                styles[ol.geom.GeometryType.LINE_STRING];

            styles[ol.geom.GeometryType.CIRCLE] =
                styles[ol.geom.GeometryType.POLYGON].concat(
                    styles[ol.geom.GeometryType.LINE_STRING]
                );


            styles[ol.geom.GeometryType.POINT] = [
                new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: width * 2,
                        fill: new ol.style.Fill({
                            color: blue
                        }),
                        stroke: new ol.style.Stroke({
                            color: white,
                            width: width / 2
                        })
                    }),
                    zIndex: Infinity
                })
            ];
            styles[ol.geom.GeometryType.MULTI_POINT] =
                styles[ol.geom.GeometryType.POINT];

            styles[ol.geom.GeometryType.GEOMETRY_COLLECTION] =
                styles[ol.geom.GeometryType.POLYGON].concat(
                    styles[ol.geom.GeometryType.LINE_STRING],
                    styles[ol.geom.GeometryType.POINT]
                );

            return styles;
        };


        /**
         * Function that is called with a feature and returns its default geometry.
         * @param {ol.Feature|ol.render.Feature} feature Feature to get the geometry
         *     for.
         * @return {ol.geom.Geometry|ol.render.Feature|undefined} Geometry to render.
         */
        ol.style.Style.defaultGeometryFunction = function(feature) {
            return feature.getGeometry();
        };


        ol.ext = {};
        ol.ext.rbush = function() {};

        (function() {(function (exports) {

            var quickselect_1 = quickselect;
            var default_1 = quickselect;
            function quickselect(arr, k, left, right, compare) {
                quickselectStep(arr, k, left || 0, right || (arr.length - 1), compare || defaultCompare);
            }
            function quickselectStep(arr, k, left, right, compare) {
                while (right > left) {
                    if (right - left > 600) {
                        var n = right - left + 1;
                        var m = k - left + 1;
                        var z = Math.log(n);
                        var s = 0.5 * Math.exp(2 * z / 3);
                        var sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
                        var newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
                        var newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
                        quickselectStep(arr, k, newLeft, newRight, compare);
                    }
                    var t = arr[k];
                    var i = left;
                    var j = right;
                    swap(arr, left, k);
                    if (compare(arr[right], t) > 0) swap(arr, left, right);
                    while (i < j) {
                        swap(arr, i, j);
                        i++;
                        j--;
                        while (compare(arr[i], t) < 0) i++;
                        while (compare(arr[j], t) > 0) j--;
                    }
                    if (compare(arr[left], t) === 0) swap(arr, left, j);
                    else {
                        j++;
                        swap(arr, j, right);
                    }
                    if (j <= k) left = j + 1;
                    if (k <= j) right = j - 1;
                }
            }
            function swap(arr, i, j) {
                var tmp = arr[i];
                arr[i] = arr[j];
                arr[j] = tmp;
            }
            function defaultCompare(a, b) {
                return a < b ? -1 : a > b ? 1 : 0;
            }
            quickselect_1.default = default_1;

            var rbush_1 = rbush;
            function rbush(maxEntries, format) {
                if (!(this instanceof rbush)) return new rbush(maxEntries, format);
                this._maxEntries = Math.max(4, maxEntries || 9);
                this._minEntries = Math.max(2, Math.ceil(this._maxEntries * 0.4));
                if (format) {
                    this._initFormat(format);
                }
                this.clear();
            }
            rbush.prototype = {
                all: function () {
                    return this._all(this.data, []);
                },
                search: function (bbox) {
                    var node = this.data,
                        result = [],
                        toBBox = this.toBBox;
                    if (!intersects(bbox, node)) return result;
                    var nodesToSearch = [],
                        i, len, child, childBBox;
                    while (node) {
                        for (i = 0, len = node.children.length; i < len; i++) {
                            child = node.children[i];
                            childBBox = node.leaf ? toBBox(child) : child;
                            if (intersects(bbox, childBBox)) {
                                if (node.leaf) result.push(child);
                                else if (contains(bbox, childBBox)) this._all(child, result);
                                else nodesToSearch.push(child);
                            }
                        }
                        node = nodesToSearch.pop();
                    }
                    return result;
                },
                collides: function (bbox) {
                    var node = this.data,
                        toBBox = this.toBBox;
                    if (!intersects(bbox, node)) return false;
                    var nodesToSearch = [],
                        i, len, child, childBBox;
                    while (node) {
                        for (i = 0, len = node.children.length; i < len; i++) {
                            child = node.children[i];
                            childBBox = node.leaf ? toBBox(child) : child;
                            if (intersects(bbox, childBBox)) {
                                if (node.leaf || contains(bbox, childBBox)) return true;
                                nodesToSearch.push(child);
                            }
                        }
                        node = nodesToSearch.pop();
                    }
                    return false;
                },
                load: function (data) {
                    if (!(data && data.length)) return this;
                    if (data.length < this._minEntries) {
                        for (var i = 0, len = data.length; i < len; i++) {
                            this.insert(data[i]);
                        }
                        return this;
                    }
                    var node = this._build(data.slice(), 0, data.length - 1, 0);
                    if (!this.data.children.length) {
                        this.data = node;
                    } else if (this.data.height === node.height) {
                        this._splitRoot(this.data, node);
                    } else {
                        if (this.data.height < node.height) {
                            var tmpNode = this.data;
                            this.data = node;
                            node = tmpNode;
                        }
                        this._insert(node, this.data.height - node.height - 1, true);
                    }
                    return this;
                },
                insert: function (item) {
                    if (item) this._insert(item, this.data.height - 1);
                    return this;
                },
                clear: function () {
                    this.data = createNode([]);
                    return this;
                },
                remove: function (item, equalsFn) {
                    if (!item) return this;
                    var node = this.data,
                        bbox = this.toBBox(item),
                        path = [],
                        indexes = [],
                        i, parent, index, goingUp;
                    while (node || path.length) {
                        if (!node) {
                            node = path.pop();
                            parent = path[path.length - 1];
                            i = indexes.pop();
                            goingUp = true;
                        }
                        if (node.leaf) {
                            index = findItem(item, node.children, equalsFn);
                            if (index !== -1) {
                                node.children.splice(index, 1);
                                path.push(node);
                                this._condense(path);
                                return this;
                            }
                        }
                        if (!goingUp && !node.leaf && contains(node, bbox)) {
                            path.push(node);
                            indexes.push(i);
                            i = 0;
                            parent = node;
                            node = node.children[0];
                        } else if (parent) {
                            i++;
                            node = parent.children[i];
                            goingUp = false;
                        } else node = null;
                    }
                    return this;
                },
                toBBox: function (item) { return item; },
                compareMinX: compareNodeMinX,
                compareMinY: compareNodeMinY,
                toJSON: function () { return this.data; },
                fromJSON: function (data) {
                    this.data = data;
                    return this;
                },
                _all: function (node, result) {
                    var nodesToSearch = [];
                    while (node) {
                        if (node.leaf) result.push.apply(result, node.children);
                        else nodesToSearch.push.apply(nodesToSearch, node.children);
                        node = nodesToSearch.pop();
                    }
                    return result;
                },
                _build: function (items, left, right, height) {
                    var N = right - left + 1,
                        M = this._maxEntries,
                        node;
                    if (N <= M) {
                        node = createNode(items.slice(left, right + 1));
                        calcBBox(node, this.toBBox);
                        return node;
                    }
                    if (!height) {
                        height = Math.ceil(Math.log(N) / Math.log(M));
                        M = Math.ceil(N / Math.pow(M, height - 1));
                    }
                    node = createNode([]);
                    node.leaf = false;
                    node.height = height;
                    var N2 = Math.ceil(N / M),
                        N1 = N2 * Math.ceil(Math.sqrt(M)),
                        i, j, right2, right3;
                    multiSelect(items, left, right, N1, this.compareMinX);
                    for (i = left; i <= right; i += N1) {
                        right2 = Math.min(i + N1 - 1, right);
                        multiSelect(items, i, right2, N2, this.compareMinY);
                        for (j = i; j <= right2; j += N2) {
                            right3 = Math.min(j + N2 - 1, right2);
                            node.children.push(this._build(items, j, right3, height - 1));
                        }
                    }
                    calcBBox(node, this.toBBox);
                    return node;
                },
                _chooseSubtree: function (bbox, node, level, path) {
                    var i, len, child, targetNode, area, enlargement, minArea, minEnlargement;
                    while (true) {
                        path.push(node);
                        if (node.leaf || path.length - 1 === level) break;
                        minArea = minEnlargement = Infinity;
                        for (i = 0, len = node.children.length; i < len; i++) {
                            child = node.children[i];
                            area = bboxArea(child);
                            enlargement = enlargedArea(bbox, child) - area;
                            if (enlargement < minEnlargement) {
                                minEnlargement = enlargement;
                                minArea = area < minArea ? area : minArea;
                                targetNode = child;
                            } else if (enlargement === minEnlargement) {
                                if (area < minArea) {
                                    minArea = area;
                                    targetNode = child;
                                }
                            }
                        }
                        node = targetNode || node.children[0];
                    }
                    return node;
                },
                _insert: function (item, level, isNode) {
                    var toBBox = this.toBBox,
                        bbox = isNode ? item : toBBox(item),
                        insertPath = [];
                    var node = this._chooseSubtree(bbox, this.data, level, insertPath);
                    node.children.push(item);
                    extend(node, bbox);
                    while (level >= 0) {
                        if (insertPath[level].children.length > this._maxEntries) {
                            this._split(insertPath, level);
                            level--;
                        } else break;
                    }
                    this._adjustParentBBoxes(bbox, insertPath, level);
                },
                _split: function (insertPath, level) {
                    var node = insertPath[level],
                        M = node.children.length,
                        m = this._minEntries;
                    this._chooseSplitAxis(node, m, M);
                    var splitIndex = this._chooseSplitIndex(node, m, M);
                    var newNode = createNode(node.children.splice(splitIndex, node.children.length - splitIndex));
                    newNode.height = node.height;
                    newNode.leaf = node.leaf;
                    calcBBox(node, this.toBBox);
                    calcBBox(newNode, this.toBBox);
                    if (level) insertPath[level - 1].children.push(newNode);
                    else this._splitRoot(node, newNode);
                },
                _splitRoot: function (node, newNode) {
                    this.data = createNode([node, newNode]);
                    this.data.height = node.height + 1;
                    this.data.leaf = false;
                    calcBBox(this.data, this.toBBox);
                },
                _chooseSplitIndex: function (node, m, M) {
                    var i, bbox1, bbox2, overlap, area, minOverlap, minArea, index;
                    minOverlap = minArea = Infinity;
                    for (i = m; i <= M - m; i++) {
                        bbox1 = distBBox(node, 0, i, this.toBBox);
                        bbox2 = distBBox(node, i, M, this.toBBox);
                        overlap = intersectionArea(bbox1, bbox2);
                        area = bboxArea(bbox1) + bboxArea(bbox2);
                        if (overlap < minOverlap) {
                            minOverlap = overlap;
                            index = i;
                            minArea = area < minArea ? area : minArea;
                        } else if (overlap === minOverlap) {
                            if (area < minArea) {
                                minArea = area;
                                index = i;
                            }
                        }
                    }
                    return index;
                },
                _chooseSplitAxis: function (node, m, M) {
                    var compareMinX = node.leaf ? this.compareMinX : compareNodeMinX,
                        compareMinY = node.leaf ? this.compareMinY : compareNodeMinY,
                        xMargin = this._allDistMargin(node, m, M, compareMinX),
                        yMargin = this._allDistMargin(node, m, M, compareMinY);
                    if (xMargin < yMargin) node.children.sort(compareMinX);
                },
                _allDistMargin: function (node, m, M, compare) {
                    node.children.sort(compare);
                    var toBBox = this.toBBox,
                        leftBBox = distBBox(node, 0, m, toBBox),
                        rightBBox = distBBox(node, M - m, M, toBBox),
                        margin = bboxMargin(leftBBox) + bboxMargin(rightBBox),
                        i, child;
                    for (i = m; i < M - m; i++) {
                        child = node.children[i];
                        extend(leftBBox, node.leaf ? toBBox(child) : child);
                        margin += bboxMargin(leftBBox);
                    }
                    for (i = M - m - 1; i >= m; i--) {
                        child = node.children[i];
                        extend(rightBBox, node.leaf ? toBBox(child) : child);
                        margin += bboxMargin(rightBBox);
                    }
                    return margin;
                },
                _adjustParentBBoxes: function (bbox, path, level) {
                    for (var i = level; i >= 0; i--) {
                        extend(path[i], bbox);
                    }
                },
                _condense: function (path) {
                    for (var i = path.length - 1, siblings; i >= 0; i--) {
                        if (path[i].children.length === 0) {
                            if (i > 0) {
                                siblings = path[i - 1].children;
                                siblings.splice(siblings.indexOf(path[i]), 1);
                            } else this.clear();
                        } else calcBBox(path[i], this.toBBox);
                    }
                },
                _initFormat: function (format) {
                    var compareArr = ['return a', ' - b', ';'];
                    this.compareMinX = new Function('a', 'b', compareArr.join(format[0]));
                    this.compareMinY = new Function('a', 'b', compareArr.join(format[1]));
                    this.toBBox = new Function('a',
                        'return {minX: a' + format[0] +
                            ', minY: a' + format[1] +
                            ', maxX: a' + format[2] +
                            ', maxY: a' + format[3] + '};');
                }
            };
            function findItem(item, items, equalsFn) {
                if (!equalsFn) return items.indexOf(item);
                for (var i = 0; i < items.length; i++) {
                    if (equalsFn(item, items[i])) return i;
                }
                return -1;
            }
            function calcBBox(node, toBBox) {
                distBBox(node, 0, node.children.length, toBBox, node);
            }
            function distBBox(node, k, p, toBBox, destNode) {
                if (!destNode) destNode = createNode(null);
                destNode.minX = Infinity;
                destNode.minY = Infinity;
                destNode.maxX = -Infinity;
                destNode.maxY = -Infinity;
                for (var i = k, child; i < p; i++) {
                    child = node.children[i];
                    extend(destNode, node.leaf ? toBBox(child) : child);
                }
                return destNode;
            }
            function extend(a, b) {
                a.minX = Math.min(a.minX, b.minX);
                a.minY = Math.min(a.minY, b.minY);
                a.maxX = Math.max(a.maxX, b.maxX);
                a.maxY = Math.max(a.maxY, b.maxY);
                return a;
            }
            function compareNodeMinX(a, b) { return a.minX - b.minX; }
            function compareNodeMinY(a, b) { return a.minY - b.minY; }
            function bboxArea(a)   { return (a.maxX - a.minX) * (a.maxY - a.minY); }
            function bboxMargin(a) { return (a.maxX - a.minX) + (a.maxY - a.minY); }
            function enlargedArea(a, b) {
                return (Math.max(b.maxX, a.maxX) - Math.min(b.minX, a.minX)) *
                    (Math.max(b.maxY, a.maxY) - Math.min(b.minY, a.minY));
            }
            function intersectionArea(a, b) {
                var minX = Math.max(a.minX, b.minX),
                    minY = Math.max(a.minY, b.minY),
                    maxX = Math.min(a.maxX, b.maxX),
                    maxY = Math.min(a.maxY, b.maxY);
                return Math.max(0, maxX - minX) *
                    Math.max(0, maxY - minY);
            }
            function contains(a, b) {
                return a.minX <= b.minX &&
                    a.minY <= b.minY &&
                    b.maxX <= a.maxX &&
                    b.maxY <= a.maxY;
            }
            function intersects(a, b) {
                return b.minX <= a.maxX &&
                    b.minY <= a.maxY &&
                    b.maxX >= a.minX &&
                    b.maxY >= a.minY;
            }
            function createNode(children) {
                return {
                    children: children,
                    height: 1,
                    leaf: true,
                    minX: Infinity,
                    minY: Infinity,
                    maxX: -Infinity,
                    maxY: -Infinity
                };
            }
            function multiSelect(arr, left, right, n, compare) {
                var stack = [left, right],
                    mid;
                while (stack.length) {
                    right = stack.pop();
                    left = stack.pop();
                    if (right - left <= n) continue;
                    mid = left + Math.ceil((right - left) / n / 2) * n;
                    quickselect_1(arr, mid, left, right, compare);
                    stack.push(left, mid, mid, right);
                }
            }

            exports['default'] = rbush_1;

        }((this.rbush = this.rbush || {})));}).call(ol.ext);
        ol.ext.rbush = ol.ext.rbush.default;

        ol.render = {};

        /**
         * Context for drawing geometries.  A vector context is available on render
         * events and does not need to be constructed directly.
         * @constructor
         * @abstract
         * @struct
         * @api
         */
        ol.render.VectorContext = function() {
        };

        ol.render.VectorContext.prototype.drawCustom = function(geometry, feature, renderer) {};
        ol.render.VectorContext.prototype.drawGeometry = function(geometry) {};
        ol.render.VectorContext.prototype.setStyle = function(style) {};
        ol.render.VectorContext.prototype.drawCircle = function(circleGeometry, feature) {};
        ol.render.VectorContext.prototype.drawFeature = function(feature, style) {};
        ol.render.VectorContext.prototype.drawGeometryCollection = function(geometryCollectionGeometry, feature) {};
        ol.render.VectorContext.prototype.drawLineString = function(lineStringGeometry, feature) {};
        ol.render.VectorContext.prototype.drawMultiLineString = function(multiLineStringGeometry, feature) {};
        ol.render.VectorContext.prototype.drawMultiPoint = function(multiPointGeometry, feature) {};
        ol.render.VectorContext.prototype.drawMultiPolygon = function(multiPolygonGeometry, feature) {};
        ol.render.VectorContext.prototype.drawPoint = function(pointGeometry, feature) {};
        ol.render.VectorContext.prototype.drawPolygon = function(polygonGeometry, feature) {};
        ol.render.VectorContext.prototype.drawText = function(geometry, feature) {};
        ol.render.VectorContext.prototype.setFillStrokeStyle = function(fillStyle, strokeStyle) {};
        ol.render.VectorContext.prototype.setImageStyle = function(imageStyle, opt_declutterGroup) {};
        ol.render.VectorContext.prototype.setTextStyle = function(textStyle, opt_declutterGroup) {};

        ol.render.ReplayGroup = {};

        ol.render.ReplayGroup = function() {};

        ol.render.ReplayGroup.prototype.getReplay = function(zIndex, replayType) {};

        ol.render.ReplayGroup.prototype.isEmpty = function() {};

        ol.render.ReplayType = {
            CIRCLE: 'Circle',
            DEFAULT: 'Default',
            IMAGE: 'Image',
            LINE_STRING: 'LineString',
            POLYGON: 'Polygon',
            TEXT: 'Text'
        };

        ol.geom.flat.length = {};

        ol.geom.flat.length.lineString = function(flatCoordinates, offset, end, stride) {
            var x1 = flatCoordinates[offset];
            var y1 = flatCoordinates[offset + 1];
            var length = 0;
            var i;
            for (i = offset + stride; i < end; i += stride) {
                var x2 = flatCoordinates[i];
                var y2 = flatCoordinates[i + 1];
                length += Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
                x1 = x2;
                y1 = y2;
            }
            return length;
        };

        ol.geom.flat.length.linearRing = function(flatCoordinates, offset, end, stride) {
            var perimeter =
                ol.geom.flat.length.lineString(flatCoordinates, offset, end, stride);
            var dx = flatCoordinates[end - stride] - flatCoordinates[offset];
            var dy = flatCoordinates[end - stride + 1] - flatCoordinates[offset + 1];
            perimeter += Math.sqrt(dx * dx + dy * dy);
            return perimeter;
        };

        ol.geom.flat.textpath = {};

        ol.geom.flat.textpath.lineString = function(
            flatCoordinates, offset, end, stride, text, measure, startM, maxAngle) {
            var result = [];

            // Keep text upright
            var reverse = flatCoordinates[offset] > flatCoordinates[end - stride];

            var numChars = text.length;

            var x1 = flatCoordinates[offset];
            var y1 = flatCoordinates[offset + 1];
            offset += stride;
            var x2 = flatCoordinates[offset];
            var y2 = flatCoordinates[offset + 1];
            var segmentM = 0;
            var segmentLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

            var chunk = '';
            var chunkLength = 0;
            var data, index, previousAngle;
            for (var i = 0; i < numChars; ++i) {
                index = reverse ? numChars - i - 1 : i;
                var char = text.charAt(index);
                chunk = reverse ? char + chunk : chunk + char;
                var charLength = measure(chunk) - chunkLength;
                chunkLength += charLength;
                var charM = startM + charLength / 2;
                while (offset < end - stride && segmentM + segmentLength < charM) {
                    x1 = x2;
                    y1 = y2;
                    offset += stride;
                    x2 = flatCoordinates[offset];
                    y2 = flatCoordinates[offset + 1];
                    segmentM += segmentLength;
                    segmentLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                }
                var segmentPos = charM - segmentM;
                var angle = Math.atan2(y2 - y1, x2 - x1);
                if (reverse) {
                    angle += angle > 0 ? -Math.PI : Math.PI;
                }
                if (previousAngle !== undefined) {
                    var delta = angle - previousAngle;
                    delta += (delta > Math.PI) ? -2 * Math.PI : (delta < -Math.PI) ? 2 * Math.PI : 0;
                    if (Math.abs(delta) > maxAngle) {
                        return null;
                    }
                }
                var interpolate = segmentPos / segmentLength;
                var x = ol.math.lerp(x1, x2, interpolate);
                var y = ol.math.lerp(y1, y2, interpolate);
                if (previousAngle == angle) {
                    if (reverse) {
                        data[0] = x;
                        data[1] = y;
                        data[2] = charLength / 2;
                    }
                    data[4] = chunk;
                } else {
                    chunk = char;
                    chunkLength = charLength;
                    data = [x, y, charLength / 2, angle, chunk];
                    if (reverse) {
                        result.unshift(data);
                    } else {
                        result.push(data);
                    }
                    previousAngle = angle;
                }
                startM += charLength;
            }
            return result;
        };


        ol.structs.LRUCache = function(opt_highWaterMark) {
            ol.events.EventTarget.call(this);
            this.highWaterMark = opt_highWaterMark !== undefined ? opt_highWaterMark : 2048;
            this.count_ = 0;
            this.entries_ = {};
            this.oldest_ = null;
            this.newest_ = null;
        };

        ol.inherits(ol.structs.LRUCache, ol.events.EventTarget);

        ol.structs.LRUCache.prototype.canExpireCache = function() {
            return this.getCount() > this.highWaterMark;
        };

        ol.structs.LRUCache.prototype.clear = function() {
            this.count_ = 0;
            this.entries_ = {};
            this.oldest_ = null;
            this.newest_ = null;
            this.dispatchEvent(ol.events.EventType.CLEAR);
        };

        ol.structs.LRUCache.prototype.containsKey = function(key) {
            return this.entries_.hasOwnProperty(key);
        };

        ol.structs.LRUCache.prototype.forEach = function(f, opt_this) {
            var entry = this.oldest_;
            while (entry) {
                f.call(opt_this, entry.value_, entry.key_, this);
                entry = entry.newer;
            }
        };

        ol.structs.LRUCache.prototype.get = function(key) {
            var entry = this.entries_[key];
            ol.asserts.assert(entry !== undefined,
                15); // Tried to get a value for a key that does not exist in the cache
            if (entry === this.newest_) {
                return entry.value_;
            } else if (entry === this.oldest_) {
                this.oldest_ = /** @type {ol.LRUCacheEntry} */ (this.oldest_.newer);
                this.oldest_.older = null;
            } else {
                entry.newer.older = entry.older;
                entry.older.newer = entry.newer;
            }
            entry.newer = null;
            entry.older = this.newest_;
            this.newest_.newer = entry;
            this.newest_ = entry;
            return entry.value_;
        };

        ol.structs.LRUCache.prototype.remove = function(key) {
            var entry = this.entries_[key];
            ol.asserts.assert(entry !== undefined, 15); // Tried to get a value for a key that does not exist in the cache
            if (entry === this.newest_) {
                this.newest_ = /** @type {ol.LRUCacheEntry} */ (entry.older);
                if (this.newest_) {
                    this.newest_.newer = null;
                }
            } else if (entry === this.oldest_) {
                this.oldest_ = /** @type {ol.LRUCacheEntry} */ (entry.newer);
                if (this.oldest_) {
                    this.oldest_.older = null;
                }
            } else {
                entry.newer.older = entry.older;
                entry.older.newer = entry.newer;
            }
            delete this.entries_[key];
            --this.count_;
            return entry.value_;
        };

        ol.structs.LRUCache.prototype.getCount = function() {
            return this.count_;
        };

        ol.structs.LRUCache.prototype.getKeys = function() {
            var keys = new Array(this.count_);
            var i = 0;
            var entry;
            for (entry = this.newest_; entry; entry = entry.older) {
                keys[i++] = entry.key_;
            }
            return keys;
        };

        ol.structs.LRUCache.prototype.getValues = function() {
            var values = new Array(this.count_);
            var i = 0;
            var entry;
            for (entry = this.newest_; entry; entry = entry.older) {
                values[i++] = entry.value_;
            }
            return values;
        };

        ol.structs.LRUCache.prototype.peekLast = function() {
            return this.oldest_.value_;
        };

        ol.structs.LRUCache.prototype.peekLastKey = function() {
            return this.oldest_.key_;
        };

        ol.structs.LRUCache.prototype.peekFirstKey = function() {
            return this.newest_.key_;
        };

        ol.structs.LRUCache.prototype.pop = function() {
            var entry = this.oldest_;
            delete this.entries_[entry.key_];
            if (entry.newer) {
                entry.newer.older = null;
            }
            this.oldest_ = /** @type {ol.LRUCacheEntry} */ (entry.newer);
            if (!this.oldest_) {
                this.newest_ = null;
            }
            --this.count_;
            return entry.value_;
        };

        ol.structs.LRUCache.prototype.replace = function(key, value) {
            this.get(key);  // update `newest_`
            this.entries_[key].value_ = value;
        };

        ol.structs.LRUCache.prototype.set = function(key, value) {
            ol.asserts.assert(!(key in this.entries_),
                16); // Tried to set a value for a key that is used already
            var entry = /** @type {ol.LRUCacheEntry} */ ({
                key_: key,
                newer: null,
                older: this.newest_,
                value_: value
            });
            if (!this.newest_) {
                this.oldest_ = entry;
            } else {
                this.newest_.newer = entry;
            }
            this.newest_ = entry;
            this.entries_[key] = entry;
            ++this.count_;
        };

        ol.structs.LRUCache.prototype.prune = function() {
            while (this.canExpireCache()) {
                this.pop();
            }
        };

        ol.render.canvas = {};
        ol.render.canvas.defaultFont = '10px sans-serif';
        ol.render.canvas.defaultFillStyle = [0, 0, 0, 1];
        ol.render.canvas.defaultLineCap = 'round';
        ol.render.canvas.defaultLineDash = [];
        ol.render.canvas.defaultLineDashOffset = 0;
        ol.render.canvas.defaultLineJoin = 'round';
        ol.render.canvas.defaultMiterLimit = 10;
        ol.render.canvas.defaultStrokeStyle = [0, 0, 0, 1];
        ol.render.canvas.defaultTextAlign = 'center';
        ol.render.canvas.defaultTextBaseline = 'middle';
        ol.render.canvas.defaultPadding = [0, 0, 0, 0];
        ol.render.canvas.defaultLineWidth = 1;
        ol.render.canvas.labelCache = new ol.structs.LRUCache();
        ol.render.canvas.checkedFonts_ = {};
        ol.render.canvas.measureContext_ = null;
        ol.render.canvas.textHeights_ = {};

        /**
         * Clears the label cache when a font becomes available.
         * @param {string} fontSpec CSS font spec.
         */
        ol.render.canvas.checkFont = (function() {
            var retries = 60;
            var checked = ol.render.canvas.checkedFonts_;
            var labelCache = ol.render.canvas.labelCache;
            var font = '32px monospace';
            var text = 'wmytzilWMYTZIL@#/&?$%10';
            var interval, referenceWidth;

            function isAvailable(fontFamily) {
                var context = ol.render.canvas.getMeasureContext();
                context.font = font;
                referenceWidth = context.measureText(text).width;
                var available = true;
                if (fontFamily != 'monospace') {
                    context.font = '32px ' + fontFamily + ',monospace';
                    var width = context.measureText(text).width;
                    // If width and referenceWidth are the same, then the 'monospace'
                    // fallback was used instead of the font we wanted, so the font is not
                    // available.
                    available = width != referenceWidth;
                }
                return available;
            }

            function check() {
                var done = true;
                for (var font in checked) {
                    if (checked[font] < retries) {
                        if (isAvailable(font)) {
                            checked[font] = retries;
                            ol.obj.clear(ol.render.canvas.textHeights_);
                            // Make sure that loaded fonts are picked up by Safari
                            ol.render.canvas.measureContext_ = null;
                            labelCache.clear();
                        } else {
                            ++checked[font];
                            done = false;
                        }
                    }
                }
                if (done) {
                    window.clearInterval(interval);
                    interval = undefined;
                }
            }

            return function(fontSpec) {
                var fontFamilies = ol.css.getFontFamilies(fontSpec);
                if (!fontFamilies) {
                    return;
                }
                for (var i = 0, ii = fontFamilies.length; i < ii; ++i) {
                    var fontFamily = fontFamilies[i];
                    if (!(fontFamily in checked)) {
                        checked[fontFamily] = retries;
                        if (!isAvailable(fontFamily)) {
                            checked[fontFamily] = 0;
                            if (interval === undefined) {
                                interval = window.setInterval(check, 32);
                            }
                        }
                    }
                }
            };
        })();


        /**
         * @return {CanvasRenderingContext2D} Measure context.
         */
        ol.render.canvas.getMeasureContext = function() {
            var context = ol.render.canvas.measureContext_;
            if (!context) {
                context = ol.render.canvas.measureContext_ = ol.dom.createCanvasContext2D(1, 1);
            }
            return context;
        };


        /**
         * @param {string} font Font to use for measuring.
         * @return {ol.Size} Measurement.
         */
        ol.render.canvas.measureTextHeight = (function() {
            var heights = ol.render.canvas.textHeights_;
            return function(font) {
                var height = heights[font];
                if (height == undefined) {
    //                if (!span) {
    //                    span = document.createElement('span');
    //                    span.textContent = 'M';
    //                    span.style.margin = span.style.padding = '0 !important';
    //                    span.style.position = 'absolute !important';
    //                    span.style.left = '-99999px !important';
    //                }
    //                span.style.font = font;
    //                document.body.appendChild(span);
    //                height = heights[font] = span.offsetHeight;
    //                document.body.removeChild(span);
                    height = heights[font] = 19; // FIXME sunyl
                }
                return height;
            };
        })();


        /**
         * @param {string} font Font.
         * @param {string} text Text.
         * @return {number} Width.
         */
        ol.render.canvas.measureTextWidth = function(font, text) {
            var measureContext = ol.render.canvas.getMeasureContext();
            if (font != measureContext.font) {
                measureContext.font = font;
            }
            return measureContext.measureText(text).width;
        };


        /**
         * @param {CanvasRenderingContext2D} context Context.
         * @param {number} rotation Rotation.
         * @param {number} offsetX X offset.
         * @param {number} offsetY Y offset.
         */
        ol.render.canvas.rotateAtOffset = function(context, rotation, offsetX, offsetY) {
            if (rotation !== 0) {
                context.translate(offsetX, offsetY);
                context.rotate(rotation);
                context.translate(-offsetX, -offsetY);
            }
        };


        ol.render.canvas.resetTransform_ = ol.transform.create();


        /**
         * @param {CanvasRenderingContext2D} context Context.
         * @param {ol.Transform|null} transform Transform.
         * @param {number} opacity Opacity.
         * @param {HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} image Image.
         * @param {number} originX Origin X.
         * @param {number} originY Origin Y.
         * @param {number} w Width.
         * @param {number} h Height.
         * @param {number} x X.
         * @param {number} y Y.
         * @param {number} scale Scale.
         */
        ol.render.canvas.drawImage = function(context,
                                              transform, opacity, image, originX, originY, w, h, x, y, scale) {
            var alpha;
            if (opacity != 1) {
                alpha = context.globalAlpha;
                context.globalAlpha = alpha * opacity;
            }
            if (transform) {
                context.setTransform.apply(context, transform);
            }

            context.drawImage(image, originX, originY, w, h, x, y, w * scale, h * scale);

            if (alpha) {
                context.globalAlpha = alpha;
            }
            if (transform) {
                context.setTransform.apply(context, ol.render.canvas.resetTransform_);
            }
        };


        /**
         * @enum {number}
         */
        ol.render.canvas.Instruction = {
            BEGIN_GEOMETRY: 0,
            BEGIN_PATH: 1,
            CIRCLE: 2,
            CLOSE_PATH: 3,
            CUSTOM: 4,
            DRAW_CHARS: 5,
            DRAW_IMAGE: 6,
            END_GEOMETRY: 7,
            FILL: 8,
            MOVE_TO_LINE_TO: 9,
            SET_FILL_STYLE: 10,
            SET_STROKE_STYLE: 11,
            STROKE: 12
        };

        ol.render.replay = {};

        ol.render.replay.ORDER = [
            ol.render.ReplayType.POLYGON,
            ol.render.ReplayType.CIRCLE,
            ol.render.ReplayType.LINE_STRING,
            ol.render.ReplayType.IMAGE,
            ol.render.ReplayType.TEXT,
            ol.render.ReplayType.DEFAULT
        ];

        ol.render.replay.TEXT_ALIGN = {};
        ol.render.replay.TEXT_ALIGN['left'] = 0;
        ol.render.replay.TEXT_ALIGN['end'] = 0;
        ol.render.replay.TEXT_ALIGN['center'] = 0.5;
        ol.render.replay.TEXT_ALIGN['right'] = 1;
        ol.render.replay.TEXT_ALIGN['start'] = 1;
        ol.render.replay.TEXT_ALIGN['top'] = 0;
        ol.render.replay.TEXT_ALIGN['middle'] = 0.5;
        ol.render.replay.TEXT_ALIGN['hanging'] = 0.2;
        ol.render.replay.TEXT_ALIGN['alphabetic'] = 0.8;
        ol.render.replay.TEXT_ALIGN['ideographic'] = 0.8;
        ol.render.replay.TEXT_ALIGN['bottom'] = 1;


        ol.render.canvas.Replay = function(tolerance, maxExtent, resolution, pixelRatio, overlaps, declutterTree) {
            ol.render.VectorContext.call(this);

            /**
             * @type {?}
             */
            this.declutterTree = declutterTree;

            /**
             * @private
             * @type {ol.Extent}
             */
            this.tmpExtent_ = ol.extent.createEmpty();

            /**
             * @protected
             * @type {number}
             */
            this.tolerance = tolerance;

            /**
             * @protected
             * @const
             * @type {ol.Extent}
             */
            this.maxExtent = maxExtent;

            /**
             * @protected
             * @type {boolean}
             */
            this.overlaps = overlaps;

            /**
             * @protected
             * @type {number}
             */
            this.pixelRatio = pixelRatio;

            /**
             * @protected
             * @type {number}
             */
            this.maxLineWidth = 0;

            /**
             * @protected
             * @const
             * @type {number}
             */
            this.resolution = resolution;

            /**
             * @private
             * @type {ol.Coordinate}
             */
            this.fillOrigin_;

            /**
             * @private
             * @type {Array.<*>}
             */
            this.beginGeometryInstruction1_ = null;

            /**
             * @private
             * @type {Array.<*>}
             */
            this.beginGeometryInstruction2_ = null;

            /**
             * @private
             * @type {ol.Extent}
             */
            this.bufferedMaxExtent_ = null;

            /**
             * @protected
             * @type {Array.<*>}
             */
            this.instructions = [];

            /**
             * @protected
             * @type {Array.<number>}
             */
            this.coordinates = [];

            /**
             * @private
             * @type {Object.<number,ol.Coordinate|Array.<ol.Coordinate>|Array.<Array.<ol.Coordinate>>>}
             */
            this.coordinateCache_ = {};

            /**
             * @private
             * @type {!ol.Transform}
             */
            this.renderedTransform_ = ol.transform.create();

            /**
             * @protected
             * @type {Array.<*>}
             */
            this.hitDetectionInstructions = [];

            /**
             * @private
             * @type {Array.<number>}
             */
            this.pixelCoordinates_ = null;

            /**
             * @protected
             * @type {ol.CanvasFillStrokeState}
             */
            this.state = /** @type {ol.CanvasFillStrokeState} */ ({});

            /**
             * @private
             * @type {number}
             */
            this.viewRotation_ = 0;

            /**
             * @private
             * @type {!ol.Transform}
             */
            this.tmpLocalTransform_ = ol.transform.create();

            /**
             * @private
             * @type {!ol.Transform}
             */
            this.resetTransform_ = ol.transform.create();
        };
        ol.inherits(ol.render.canvas.Replay, ol.render.VectorContext);


        /**
         * @param {CanvasRenderingContext2D} context Context.
         * @param {ol.Coordinate} p1 1st point of the background box.
         * @param {ol.Coordinate} p2 2nd point of the background box.
         * @param {ol.Coordinate} p3 3rd point of the background box.
         * @param {ol.Coordinate} p4 4th point of the background box.
         * @param {Array.<*>} fillInstruction Fill instruction.
         * @param {Array.<*>} strokeInstruction Stroke instruction.
         */
        ol.render.canvas.Replay.prototype.replayTextBackground_ = function(context, p1, p2, p3, p4,
                                                                           fillInstruction, strokeInstruction) {
            context.beginPath();
            context.moveTo.apply(context, p1);
            context.lineTo.apply(context, p2);
            context.lineTo.apply(context, p3);
            context.lineTo.apply(context, p4);
            context.lineTo.apply(context, p1);
            if (fillInstruction) {
                this.fillOrigin_ = /** @type {Array.<number>} */ (fillInstruction[2]);
                this.fill_(context);
            }
            if (strokeInstruction) {
                this.setStrokeStyle_(context, /** @type {Array.<*>} */ (strokeInstruction));
                context.stroke();
            }
        };


        /**
         * @param {CanvasRenderingContext2D} context Context.
         * @param {number} x X.
         * @param {number} y Y.
         * @param {HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} image Image.
         * @param {number} anchorX Anchor X.
         * @param {number} anchorY Anchor Y.
         * @param {ol.DeclutterGroup} declutterGroup Declutter group.
         * @param {number} height Height.
         * @param {number} opacity Opacity.
         * @param {number} originX Origin X.
         * @param {number} originY Origin Y.
         * @param {number} rotation Rotation.
         * @param {number} scale Scale.
         * @param {boolean} snapToPixel Snap to pixel.
         * @param {number} width Width.
         * @param {Array.<number>} padding Padding.
         * @param {Array.<*>} fillInstruction Fill instruction.
         * @param {Array.<*>} strokeInstruction Stroke instruction.
         */
        ol.render.canvas.Replay.prototype.replayImage_ = function(context, x, y, image,
                                                                  anchorX, anchorY, declutterGroup, height, opacity, originX, originY,
                                                                  rotation, scale, snapToPixel, width, padding, fillInstruction, strokeInstruction) {
            var fillStroke = fillInstruction || strokeInstruction;
            var localTransform = this.tmpLocalTransform_;
            anchorX *= scale;
            anchorY *= scale;
            x -= anchorX;
            y -= anchorY;
            if (snapToPixel) {
                x = Math.round(x);
                y = Math.round(y);
            }

            var w = (width + originX > image.width) ? image.width - originX : width;
            var h = (height + originY > image.height) ? image.height - originY : height;
            var box = this.tmpExtent_;
            var boxW = padding[3] + w * scale + padding[1];
            var boxH = padding[0] + h * scale + padding[2];
            var boxX = x - padding[3];
            var boxY = y - padding[0];

            /** @type {ol.Coordinate} */
            var p1;
            /** @type {ol.Coordinate} */
            var p2;
            /** @type {ol.Coordinate} */
            var p3;
            /** @type {ol.Coordinate} */
            var p4;
            if (fillStroke || rotation !== 0) {
                p1 = [boxX, boxY];
                p2 = [boxX + boxW, boxY];
                p3 = [boxX + boxW, boxY + boxH];
                p4 = [boxX, boxY + boxH];
            }

            var transform = null;
            if (rotation !== 0) {
                var centerX = x + anchorX;
                var centerY = y + anchorY;
                transform = ol.transform.compose(localTransform,
                    centerX, centerY, 1, 1, rotation, -centerX, -centerY);

                ol.extent.createOrUpdateEmpty(box);
                ol.extent.extendCoordinate(box, ol.transform.apply(localTransform, p1));
                ol.extent.extendCoordinate(box, ol.transform.apply(localTransform, p2));
                ol.extent.extendCoordinate(box, ol.transform.apply(localTransform, p3));
                ol.extent.extendCoordinate(box, ol.transform.apply(localTransform, p4));
            } else {
                ol.extent.createOrUpdate(boxX, boxY, boxX + boxW, boxY + boxH, box);
            }
            var canvas = context.canvas;
            var intersects = box[0] <= canvas.width && box[2] >= 0 && box[1] <= canvas.height && box[3] >= 0;
            if (declutterGroup) {
                if (!intersects && declutterGroup[4] == 1) {
                    return;
                }
                ol.extent.extend(declutterGroup, box);
                var declutterArgs = intersects ?
                    [context, transform ? transform.slice(0) : null, opacity, image, originX, originY, w, h, x, y, scale] :
                    null;
                if (declutterArgs && fillStroke) {
                    declutterArgs.push(fillInstruction, strokeInstruction, p1, p2, p3, p4);
                }
                declutterGroup.push(declutterArgs);
            } else if (intersects) {
                if (fillStroke) {
                    this.replayTextBackground_(context, p1, p2, p3, p4,
                        /** @type {Array.<*>} */ (fillInstruction),
                        /** @type {Array.<*>} */ (strokeInstruction));
                }
                ol.render.canvas.drawImage(context, transform, opacity, image, originX, originY, w, h, x, y, scale);
            }
        };


        /**
         * @protected
         * @param {Array.<number>} dashArray Dash array.
         * @return {Array.<number>} Dash array with pixel ratio applied
         */
        ol.render.canvas.Replay.prototype.applyPixelRatio = function(dashArray) {
            var pixelRatio = this.pixelRatio;
            return pixelRatio == 1 ? dashArray : dashArray.map(function(dash) {
                return dash * pixelRatio;
            });
        };


        /**
         * @param {Array.<number>} flatCoordinates Flat coordinates.
         * @param {number} offset Offset.
         * @param {number} end End.
         * @param {number} stride Stride.
         * @param {boolean} closed Last input coordinate equals first.
         * @param {boolean} skipFirst Skip first coordinate.
         * @protected
         * @return {number} My end.
         */
        ol.render.canvas.Replay.prototype.appendFlatCoordinates = function(flatCoordinates, offset, end, stride, closed, skipFirst) {

            var myEnd = this.coordinates.length;
            var extent = this.getBufferedMaxExtent();
            if (skipFirst) {
                offset += stride;
            }
            var lastCoord = [flatCoordinates[offset], flatCoordinates[offset + 1]];
            var nextCoord = [NaN, NaN];
            var skipped = true;

            var i, lastRel, nextRel;
            for (i = offset + stride; i < end; i += stride) {
                nextCoord[0] = flatCoordinates[i];
                nextCoord[1] = flatCoordinates[i + 1];
                nextRel = ol.extent.coordinateRelationship(extent, nextCoord);
                if (nextRel !== lastRel) {
                    if (skipped) {
                        this.coordinates[myEnd++] = lastCoord[0];
                        this.coordinates[myEnd++] = lastCoord[1];
                    }
                    this.coordinates[myEnd++] = nextCoord[0];
                    this.coordinates[myEnd++] = nextCoord[1];
                    skipped = false;
                } else if (nextRel === ol.extent.Relationship.INTERSECTING) {
                    this.coordinates[myEnd++] = nextCoord[0];
                    this.coordinates[myEnd++] = nextCoord[1];
                    skipped = false;
                } else {
                    skipped = true;
                }
                lastCoord[0] = nextCoord[0];
                lastCoord[1] = nextCoord[1];
                lastRel = nextRel;
            }

            // Last coordinate equals first or only one point to append:
            if ((closed && skipped) || i === offset + stride) {
                this.coordinates[myEnd++] = lastCoord[0];
                this.coordinates[myEnd++] = lastCoord[1];
            }
            return myEnd;
        };


        /**
         * @param {Array.<number>} flatCoordinates Flat coordinates.
         * @param {number} offset Offset.
         * @param {Array.<number>} ends Ends.
         * @param {number} stride Stride.
         * @param {Array.<number>} replayEnds Replay ends.
         * @return {number} Offset.
         */
        ol.render.canvas.Replay.prototype.drawCustomCoordinates_ = function(flatCoordinates, offset, ends, stride, replayEnds) {
            for (var i = 0, ii = ends.length; i < ii; ++i) {
                var end = ends[i];
                var replayEnd = this.appendFlatCoordinates(flatCoordinates, offset, end, stride, false, false);
                replayEnds.push(replayEnd);
                offset = end;
            }
            return offset;
        };


        /**
         * @inheritDoc.
         */
        ol.render.canvas.Replay.prototype.drawCustom = function(geometry, feature, renderer) {
            this.beginGeometry(geometry, feature);
            var type = geometry.getType();
            var stride = geometry.getStride();
            var replayBegin = this.coordinates.length;
            var flatCoordinates, replayEnd, replayEnds, replayEndss;
            var offset;
            if (type == ol.geom.GeometryType.MULTI_POLYGON) {
                geometry = /** @type {ol.geom.MultiPolygon} */ (geometry);
                flatCoordinates = geometry.getOrientedFlatCoordinates();
                replayEndss = [];
                var endss = geometry.getEndss();
                offset = 0;
                for (var i = 0, ii = endss.length; i < ii; ++i) {
                    var myEnds = [];
                    offset = this.drawCustomCoordinates_(flatCoordinates, offset, endss[i], stride, myEnds);
                    replayEndss.push(myEnds);
                }
                this.instructions.push([ol.render.canvas.Instruction.CUSTOM,
                    replayBegin, replayEndss, geometry, renderer, ol.geom.flat.inflate.coordinatesss]);
            } else if (type == ol.geom.GeometryType.POLYGON || type == ol.geom.GeometryType.MULTI_LINE_STRING) {
                replayEnds = [];
                flatCoordinates = (type == ol.geom.GeometryType.POLYGON) ?
                /** @type {ol.geom.Polygon} */ (geometry).getOrientedFlatCoordinates() :
                    geometry.getFlatCoordinates();
                offset = this.drawCustomCoordinates_(flatCoordinates, 0,
                    /** @type {ol.geom.Polygon|ol.geom.MultiLineString} */ (geometry).getEnds(),
                    stride, replayEnds);
                this.instructions.push([ol.render.canvas.Instruction.CUSTOM,
                    replayBegin, replayEnds, geometry, renderer, ol.geom.flat.inflate.coordinatess]);
            } else if (type == ol.geom.GeometryType.LINE_STRING || type == ol.geom.GeometryType.MULTI_POINT) {
                flatCoordinates = geometry.getFlatCoordinates();
                replayEnd = this.appendFlatCoordinates(
                    flatCoordinates, 0, flatCoordinates.length, stride, false, false);
                this.instructions.push([ol.render.canvas.Instruction.CUSTOM,
                    replayBegin, replayEnd, geometry, renderer, ol.geom.flat.inflate.coordinates]);
            } else if (type == ol.geom.GeometryType.POINT) {
                flatCoordinates = geometry.getFlatCoordinates();
                this.coordinates.push(flatCoordinates[0], flatCoordinates[1]);
                replayEnd = this.coordinates.length;
                this.instructions.push([ol.render.canvas.Instruction.CUSTOM,
                    replayBegin, replayEnd, geometry, renderer]);
            }
            this.endGeometry(geometry, feature);
        };


        /**
         * @protected
         * @param {ol.geom.Geometry|ol.render.Feature} geometry Geometry.
         * @param {ol.Feature|ol.render.Feature} feature Feature.
         */
        ol.render.canvas.Replay.prototype.beginGeometry = function(geometry, feature) {
            this.beginGeometryInstruction1_ =
                [ol.render.canvas.Instruction.BEGIN_GEOMETRY, feature, 0];
            this.instructions.push(this.beginGeometryInstruction1_);
            this.beginGeometryInstruction2_ =
                [ol.render.canvas.Instruction.BEGIN_GEOMETRY, feature, 0];
            this.hitDetectionInstructions.push(this.beginGeometryInstruction2_);
        };


        /**
         * @private
         * @param {CanvasRenderingContext2D} context Context.
         */
        ol.render.canvas.Replay.prototype.fill_ = function(context) {
            if (this.fillOrigin_) {
                var origin = ol.transform.apply(this.renderedTransform_, this.fillOrigin_.slice());
                context.translate(origin[0], origin[1]);
                context.rotate(this.viewRotation_);
            }
            context.fill();
            if (this.fillOrigin_) {
                context.setTransform.apply(context, ol.render.canvas.resetTransform_);
            }
        };


        /**
         * @private
         * @param {CanvasRenderingContext2D} context Context.
         * @param {Array.<*>} instruction Instruction.
         */
        ol.render.canvas.Replay.prototype.setStrokeStyle_ = function(context, instruction) {
            context.strokeStyle = /** @type {ol.ColorLike} */ (instruction[1]);
            context.lineWidth = /** @type {number} */ (instruction[2]);
            context.lineCap = /** @type {string} */ (instruction[3]);
            context.lineJoin = /** @type {string} */ (instruction[4]);
            context.miterLimit = /** @type {number} */ (instruction[5]);
            if (ol.has.CANVAS_LINE_DASH) {
                context.lineDashOffset = /** @type {number} */ (instruction[7]);
                context.setLineDash(/** @type {Array.<number>} */ (instruction[6]));
            }
        };


        /**
         * @param {ol.DeclutterGroup} declutterGroup Declutter group.
         * @param {ol.Feature|ol.render.Feature} feature Feature.
         */
        ol.render.canvas.Replay.prototype.renderDeclutter_ = function(declutterGroup, feature) {
            if (declutterGroup && declutterGroup.length > 5) {
                var groupCount = declutterGroup[4];
                if (groupCount == 1 || groupCount == declutterGroup.length - 5) {
                    /** @type {ol.RBushEntry} */
                    var box = {
                        minX: /** @type {number} */ (declutterGroup[0]),
                        minY: /** @type {number} */ (declutterGroup[1]),
                        maxX: /** @type {number} */ (declutterGroup[2]),
                        maxY: /** @type {number} */ (declutterGroup[3]),
                        value: feature
                    };
                    if (!this.declutterTree.collides(box)) {
                        this.declutterTree.insert(box);
                        var drawImage = ol.render.canvas.drawImage;
                        for (var j = 5, jj = declutterGroup.length; j < jj; ++j) {
                            var declutterData = /** @type {Array} */ (declutterGroup[j]);
                            if (declutterData) {
                                if (declutterData.length > 11) {
                                    this.replayTextBackground_(declutterData[0],
                                        declutterData[13], declutterData[14], declutterData[15], declutterData[16],
                                        declutterData[11], declutterData[12]);
                                }
                                drawImage.apply(undefined, declutterData);
                            }
                        }
                    }
                    declutterGroup.length = 5;
                    ol.extent.createOrUpdateEmpty(declutterGroup);
                }
            }
        };


        /**
         * @private
         * @param {CanvasRenderingContext2D} context Context.
         * @param {ol.Transform} transform Transform.
         * @param {Object.<string, boolean>} skippedFeaturesHash Ids of features
         *     to skip.
         * @param {Array.<*>} instructions Instructions array.
         * @param {function((ol.Feature|ol.render.Feature)): T|undefined}
         *     featureCallback Feature callback.
         * @param {ol.Extent=} opt_hitExtent Only check features that intersect this
         *     extent.
         * @return {T|undefined} Callback result.
         * @template T
         */
        ol.render.canvas.Replay.prototype.replay_ = function(
            context, transform, skippedFeaturesHash,
            instructions, featureCallback, opt_hitExtent) {
            /** @type {Array.<number>} */
            var pixelCoordinates;
            if (this.pixelCoordinates_ && ol.array.equals(transform, this.renderedTransform_)) {
                pixelCoordinates = this.pixelCoordinates_;
            } else {
                if (!this.pixelCoordinates_) {
                    this.pixelCoordinates_ = [];
                }
                pixelCoordinates = ol.geom.flat.transform.transform2D(
                    this.coordinates, 0, this.coordinates.length, 2,
                    transform, this.pixelCoordinates_);
                ol.transform.setFromArray(this.renderedTransform_, transform);
            }
            var skipFeatures = !ol.obj.isEmpty(skippedFeaturesHash);
            var i = 0; // instruction index
            var ii = instructions.length; // end of instructions
            var d = 0; // data index
            var dd; // end of per-instruction data
            var anchorX, anchorY, prevX, prevY, roundX, roundY, declutterGroup, image;
            var pendingFill = 0;
            var pendingStroke = 0;
            var lastFillInstruction = null;
            var lastStrokeInstruction = null;
            var coordinateCache = this.coordinateCache_;
            var viewRotation = this.viewRotation_;

            var state = /** @type {olx.render.State} */ ({
                context: context,
                pixelRatio: this.pixelRatio,
                resolution: this.resolution,
                rotation: viewRotation
            });

            // When the batch size gets too big, performance decreases. 200 is a good
            // balance between batch size and number of fill/stroke instructions.
            var batchSize =
                this.instructions != instructions || this.overlaps ? 0 : 200;
            while (i < ii) {
                var instruction = instructions[i];
                var type = /** @type {ol.render.canvas.Instruction} */ (instruction[0]);
                var /** @type {ol.Feature|ol.render.Feature} */ feature, x, y;
                switch (type) {
                    case ol.render.canvas.Instruction.BEGIN_GEOMETRY:
                        feature = /** @type {ol.Feature|ol.render.Feature} */ (instruction[1]);
                        if ((skipFeatures &&
                            skippedFeaturesHash[ol.getUid(feature).toString()]) ||
                            !feature.getGeometry()) {
                            i = /** @type {number} */ (instruction[2]);
                        } else if (opt_hitExtent !== undefined && !ol.extent.intersects(
                            opt_hitExtent, feature.getGeometry().getExtent())) {
                            i = /** @type {number} */ (instruction[2]) + 1;
                        } else {
                            ++i;
                        }
                        break;
                    case ol.render.canvas.Instruction.BEGIN_PATH:
                        if (pendingFill > batchSize) {
                            this.fill_(context);
                            pendingFill = 0;
                        }
                        if (pendingStroke > batchSize) {
                            context.stroke();
                            pendingStroke = 0;
                        }
                        if (!pendingFill && !pendingStroke) {
                            context.beginPath();
                            prevX = prevY = NaN;
                        }
                        ++i;
                        break;
                    case ol.render.canvas.Instruction.CIRCLE:
                        d = /** @type {number} */ (instruction[1]);
                        var x1 = pixelCoordinates[d];
                        var y1 = pixelCoordinates[d + 1];
                        var x2 = pixelCoordinates[d + 2];
                        var y2 = pixelCoordinates[d + 3];
                        var dx = x2 - x1;
                        var dy = y2 - y1;
                        var r = Math.sqrt(dx * dx + dy * dy);
                        context.moveTo(x1 + r, y1);
                        context.arc(x1, y1, r, 0, 2 * Math.PI, true);
                        ++i;
                        break;
                    case ol.render.canvas.Instruction.CLOSE_PATH:
                        context.closePath();
                        ++i;
                        break;
                    case ol.render.canvas.Instruction.CUSTOM:
                        d = /** @type {number} */ (instruction[1]);
                        dd = instruction[2];
                        var geometry = /** @type {ol.geom.SimpleGeometry} */ (instruction[3]);
                        var renderer = instruction[4];
                        var fn = instruction.length == 6 ? instruction[5] : undefined;
                        state.geometry = geometry;
                        state.feature = feature;
                        if (!(i in coordinateCache)) {
                            coordinateCache[i] = [];
                        }
                        var coords = coordinateCache[i];
                        if (fn) {
                            fn(pixelCoordinates, d, dd, 2, coords);
                        } else {
                            coords[0] = pixelCoordinates[d];
                            coords[1] = pixelCoordinates[d + 1];
                            coords.length = 2;
                        }
                        renderer(coords, state);
                        ++i;
                        break;
                    case ol.render.canvas.Instruction.DRAW_IMAGE:
                        d = /** @type {number} */ (instruction[1]);
                        dd = /** @type {number} */ (instruction[2]);
                        image =  /** @type {HTMLCanvasElement|HTMLVideoElement|Image} */
                            (instruction[3]);
                        // Remaining arguments in DRAW_IMAGE are in alphabetical order
                        anchorX = /** @type {number} */ (instruction[4]);
                        anchorY = /** @type {number} */ (instruction[5]);
                        declutterGroup = featureCallback ? null : /** @type {ol.DeclutterGroup} */ (instruction[6]);
                        var height = /** @type {number} */ (instruction[7]);
                        var opacity = /** @type {number} */ (instruction[8]);
                        var originX = /** @type {number} */ (instruction[9]);
                        var originY = /** @type {number} */ (instruction[10]);
                        var rotateWithView = /** @type {boolean} */ (instruction[11]);
                        var rotation = /** @type {number} */ (instruction[12]);
                        var scale = /** @type {number} */ (instruction[13]);
                        var snapToPixel = /** @type {boolean} */ (instruction[14]);
                        var width = /** @type {number} */ (instruction[15]);

                        var padding, backgroundFill, backgroundStroke;
                        if (instruction.length > 16) {
                            padding = /** @type {Array.<number>} */ (instruction[16]);
                            backgroundFill = /** @type {boolean} */ (instruction[17]);
                            backgroundStroke = /** @type {boolean} */ (instruction[18]);
                        } else {
                            padding = ol.render.canvas.defaultPadding;
                            backgroundFill = backgroundStroke = false;
                        }

                        if (rotateWithView) {
                            rotation += viewRotation;
                        }
                        for (; d < dd; d += 2) {
                            this.replayImage_(context,
                                pixelCoordinates[d], pixelCoordinates[d + 1], image, anchorX, anchorY,
                                declutterGroup, height, opacity, originX, originY, rotation, scale,
                                snapToPixel, width, padding,
                                backgroundFill ? /** @type {Array.<*>} */ (lastFillInstruction) : null,
                                backgroundStroke ? /** @type {Array.<*>} */ (lastStrokeInstruction) : null);
                        }
                        this.renderDeclutter_(declutterGroup, feature);
                        ++i;
                        break;
                    case ol.render.canvas.Instruction.DRAW_CHARS:
                        var begin = /** @type {number} */ (instruction[1]);
                        var end = /** @type {number} */ (instruction[2]);
                        var baseline = /** @type {number} */ (instruction[3]);
                        declutterGroup = featureCallback ? null : /** @type {ol.DeclutterGroup} */ (instruction[4]);
                        var overflow = /** @type {number} */ (instruction[5]);
                        var fillKey = /** @type {string} */ (instruction[6]);
                        var maxAngle = /** @type {number} */ (instruction[7]);
                        var measure = /** @type {function(string):number} */ (instruction[8]);
                        var offsetY = /** @type {number} */ (instruction[9]);
                        var strokeKey = /** @type {string} */ (instruction[10]);
                        var strokeWidth =  /** @type {number} */ (instruction[11]);
                        var text = /** @type {string} */ (instruction[12]);
                        var textKey = /** @type {string} */ (instruction[13]);
                        var textScale = /** @type {number} */ (instruction[14]);

                        var pathLength = ol.geom.flat.length.lineString(pixelCoordinates, begin, end, 2);
                        var textLength = measure(text);
                        if (overflow || textLength <= pathLength) {
                            var textAlign = /** @type {ol.render.canvas.TextReplay} */ (this).textStates[textKey].textAlign;
                            var startM = (pathLength - textLength) * ol.render.replay.TEXT_ALIGN[textAlign];
                            var parts = ol.geom.flat.textpath.lineString(
                                pixelCoordinates, begin, end, 2, text, measure, startM, maxAngle);
                            if (parts) {
                                var c, cc, chars, label, part;
                                if (strokeKey) {
                                    for (c = 0, cc = parts.length; c < cc; ++c) {
                                        part = parts[c]; // x, y, anchorX, rotation, chunk
                                        chars = /** @type {string} */ (part[4]);
                                        label = /** @type {ol.render.canvas.TextReplay} */ (this).getImage(chars, textKey, '', strokeKey);
                                        anchorX = /** @type {number} */ (part[2]) + strokeWidth;
                                        anchorY = baseline * label.height + (0.5 - baseline) * 2 * strokeWidth - offsetY;
                                        this.replayImage_(context,
                                            /** @type {number} */ (part[0]), /** @type {number} */ (part[1]), label,
                                            anchorX, anchorY, declutterGroup, label.height, 1, 0, 0,
                                            /** @type {number} */ (part[3]), textScale, false, label.width,
                                            ol.render.canvas.defaultPadding, null, null);
                                    }
                                }
                                if (fillKey) {
                                    for (c = 0, cc = parts.length; c < cc; ++c) {
                                        part = parts[c]; // x, y, anchorX, rotation, chunk
                                        chars = /** @type {string} */ (part[4]);
                                        label = /** @type {ol.render.canvas.TextReplay} */ (this).getImage(chars, textKey, fillKey, '');
                                        anchorX = /** @type {number} */ (part[2]);
                                        anchorY = baseline * label.height - offsetY;
                                        this.replayImage_(context,
                                            /** @type {number} */ (part[0]), /** @type {number} */ (part[1]), label,
                                            anchorX, anchorY, declutterGroup, label.height, 1, 0, 0,
                                            /** @type {number} */ (part[3]), textScale, false, label.width,
                                            ol.render.canvas.defaultPadding, null, null);
                                    }
                                }
                            }
                        }
                        this.renderDeclutter_(declutterGroup, feature);
                        ++i;
                        break;
                    case ol.render.canvas.Instruction.END_GEOMETRY:
                        if (featureCallback !== undefined) {
                            feature = /** @type {ol.Feature|ol.render.Feature} */ (instruction[1]);
                            var result = featureCallback(feature);
                            if (result) {
                                return result;
                            }
                        }
                        ++i;
                        break;
                    case ol.render.canvas.Instruction.FILL:
                        if (batchSize) {
                            pendingFill++;
                        } else {
                            this.fill_(context);
                        }
                        ++i;
                        break;
                    case ol.render.canvas.Instruction.MOVE_TO_LINE_TO:
                        d = /** @type {number} */ (instruction[1]);
                        dd = /** @type {number} */ (instruction[2]);
                        x = pixelCoordinates[d];
                        y = pixelCoordinates[d + 1];
                        roundX = (x + 0.5) | 0;
                        roundY = (y + 0.5) | 0;
                        if (roundX !== prevX || roundY !== prevY) {
                            context.moveTo(x, y);
                            prevX = roundX;
                            prevY = roundY;
                        }
                        for (d += 2; d < dd; d += 2) {
                            x = pixelCoordinates[d];
                            y = pixelCoordinates[d + 1];
                            roundX = (x + 0.5) | 0;
                            roundY = (y + 0.5) | 0;
                            if (d == dd - 2 || roundX !== prevX || roundY !== prevY) {
                                context.lineTo(x, y);
                                prevX = roundX;
                                prevY = roundY;
                            }
                        }
                        ++i;
                        break;
                    case ol.render.canvas.Instruction.SET_FILL_STYLE:
                        lastFillInstruction = instruction;
                        this.fillOrigin_ = instruction[2];

                        if (pendingFill) {
                            this.fill_(context);
                            pendingFill = 0;
                            if (pendingStroke) {
                                context.stroke();
                                pendingStroke = 0;
                            }
                        }

                        context.fillStyle = /** @type {ol.ColorLike} */ (instruction[1]);
                        ++i;
                        break;
                    case ol.render.canvas.Instruction.SET_STROKE_STYLE:
                        lastStrokeInstruction = instruction;
                        if (pendingStroke) {
                            context.stroke();
                            pendingStroke = 0;
                        }
                        this.setStrokeStyle_(context, /** @type {Array.<*>} */ (instruction));
                        ++i;
                        break;
                    case ol.render.canvas.Instruction.STROKE:
                        if (batchSize) {
                            pendingStroke++;
                        } else {
                            context.stroke();
                        }
                        ++i;
                        break;
                    default:
                        ++i; // consume the instruction anyway, to avoid an infinite loop
                        break;
                }
            }
            if (pendingFill) {
                this.fill_(context);
            }
            if (pendingStroke) {
                context.stroke();
            }
            return undefined;
        };


        /**
         * @param {CanvasRenderingContext2D} context Context.
         * @param {ol.Transform} transform Transform.
         * @param {number} viewRotation View rotation.
         * @param {Object.<string, boolean>} skippedFeaturesHash Ids of features
         *     to skip.
         */
        ol.render.canvas.Replay.prototype.replay = function(
            context, transform, viewRotation, skippedFeaturesHash) {
            this.viewRotation_ = viewRotation;
            this.replay_(context, transform,
                skippedFeaturesHash, this.instructions, undefined, undefined);
        };


        /**
         * @param {CanvasRenderingContext2D} context Context.
         * @param {ol.Transform} transform Transform.
         * @param {number} viewRotation View rotation.
         * @param {Object.<string, boolean>} skippedFeaturesHash Ids of features
         *     to skip.
         * @param {function((ol.Feature|ol.render.Feature)): T=} opt_featureCallback
         *     Feature callback.
         * @param {ol.Extent=} opt_hitExtent Only check features that intersect this
         *     extent.
         * @return {T|undefined} Callback result.
         * @template T
         */
        ol.render.canvas.Replay.prototype.replayHitDetection = function(
            context, transform, viewRotation, skippedFeaturesHash,
            opt_featureCallback, opt_hitExtent) {
            this.viewRotation_ = viewRotation;
            return this.replay_(context, transform, skippedFeaturesHash,
                this.hitDetectionInstructions, opt_featureCallback, opt_hitExtent);
        };


        /**
         * Reverse the hit detection instructions.
         */
        ol.render.canvas.Replay.prototype.reverseHitDetectionInstructions = function() {
            var hitDetectionInstructions = this.hitDetectionInstructions;
            // step 1 - reverse array
            hitDetectionInstructions.reverse();
            // step 2 - reverse instructions within geometry blocks
            var i;
            var n = hitDetectionInstructions.length;
            var instruction;
            var type;
            var begin = -1;
            for (i = 0; i < n; ++i) {
                instruction = hitDetectionInstructions[i];
                type = /** @type {ol.render.canvas.Instruction} */ (instruction[0]);
                if (type == ol.render.canvas.Instruction.END_GEOMETRY) {
                    begin = i;
                } else if (type == ol.render.canvas.Instruction.BEGIN_GEOMETRY) {
                    instruction[2] = i;
                    ol.array.reverseSubArray(this.hitDetectionInstructions, begin, i);
                    begin = -1;
                }
            }
        };


        /**
         * @inheritDoc
         */
        ol.render.canvas.Replay.prototype.setFillStrokeStyle = function(fillStyle, strokeStyle) {
            var state = this.state;
            if (fillStyle) {
                var fillStyleColor = fillStyle.getColor();
                state.fillStyle = ol.colorlike.asColorLike(fillStyleColor ?
                    fillStyleColor : ol.render.canvas.defaultFillStyle);
            } else {
                state.fillStyle = undefined;
            }
            if (strokeStyle) {
                var strokeStyleColor = strokeStyle.getColor();
                state.strokeStyle = ol.colorlike.asColorLike(strokeStyleColor ?
                    strokeStyleColor : ol.render.canvas.defaultStrokeStyle);
                var strokeStyleLineCap = strokeStyle.getLineCap();
                state.lineCap = strokeStyleLineCap !== undefined ?
                    strokeStyleLineCap : ol.render.canvas.defaultLineCap;
                var strokeStyleLineDash = strokeStyle.getLineDash();
                state.lineDash = strokeStyleLineDash ?
                    strokeStyleLineDash.slice() : ol.render.canvas.defaultLineDash;
                var strokeStyleLineDashOffset = strokeStyle.getLineDashOffset();
                state.lineDashOffset = strokeStyleLineDashOffset ?
                    strokeStyleLineDashOffset : ol.render.canvas.defaultLineDashOffset;
                var strokeStyleLineJoin = strokeStyle.getLineJoin();
                state.lineJoin = strokeStyleLineJoin !== undefined ?
                    strokeStyleLineJoin : ol.render.canvas.defaultLineJoin;
                var strokeStyleWidth = strokeStyle.getWidth();
                state.lineWidth = strokeStyleWidth !== undefined ?
                    strokeStyleWidth : ol.render.canvas.defaultLineWidth;
                var strokeStyleMiterLimit = strokeStyle.getMiterLimit();
                state.miterLimit = strokeStyleMiterLimit !== undefined ?
                    strokeStyleMiterLimit : ol.render.canvas.defaultMiterLimit;

                if (state.lineWidth > this.maxLineWidth) {
                    this.maxLineWidth = state.lineWidth;
                    // invalidate the buffered max extent cache
                    this.bufferedMaxExtent_ = null;
                }
            } else {
                state.strokeStyle = undefined;
                state.lineCap = undefined;
                state.lineDash = null;
                state.lineDashOffset = undefined;
                state.lineJoin = undefined;
                state.lineWidth = undefined;
                state.miterLimit = undefined;
            }
        };


        /**
         * @param {ol.CanvasFillStrokeState} state State.
         * @param {ol.geom.Geometry|ol.render.Feature} geometry Geometry.
         */
        ol.render.canvas.Replay.prototype.applyFill = function(state, geometry) {
            var fillStyle = state.fillStyle;
            var fillInstruction = [ol.render.canvas.Instruction.SET_FILL_STYLE, fillStyle];
            if (typeof fillStyle !== 'string') {
                var fillExtent = geometry.getExtent();
                fillInstruction.push([fillExtent[0], fillExtent[3]]);
            }
            this.instructions.push(fillInstruction);
        };


        /**
         * @param {ol.CanvasFillStrokeState} state State.
         */
        ol.render.canvas.Replay.prototype.applyStroke = function(state) {
            this.instructions.push([
                ol.render.canvas.Instruction.SET_STROKE_STYLE,
                state.strokeStyle, state.lineWidth * this.pixelRatio, state.lineCap,
                state.lineJoin, state.miterLimit,
                this.applyPixelRatio(state.lineDash), state.lineDashOffset * this.pixelRatio
            ]);
        };


        /**
         * @param {ol.CanvasFillStrokeState} state State.
         * @param {function(this:ol.render.canvas.Replay, ol.CanvasFillStrokeState, (ol.geom.Geometry|ol.render.Feature))} applyFill Apply fill.
         * @param {ol.geom.Geometry|ol.render.Feature} geometry Geometry.
         */
        ol.render.canvas.Replay.prototype.updateFillStyle = function(state, applyFill, geometry) {
            var fillStyle = state.fillStyle;
            if (typeof fillStyle !== 'string' || state.currentFillStyle != fillStyle) {
                applyFill.call(this, state, geometry);
                state.currentFillStyle = fillStyle;
            }
        };


        /**
         * @param {ol.CanvasFillStrokeState} state State.
         * @param {function(this:ol.render.canvas.Replay, ol.CanvasFillStrokeState)} applyStroke Apply stroke.
         */
        ol.render.canvas.Replay.prototype.updateStrokeStyle = function(state, applyStroke) {
            var strokeStyle = state.strokeStyle;
            var lineCap = state.lineCap;
            var lineDash = state.lineDash;
            var lineDashOffset = state.lineDashOffset;
            var lineJoin = state.lineJoin;
            var lineWidth = state.lineWidth;
            var miterLimit = state.miterLimit;
            if (state.currentStrokeStyle != strokeStyle ||
                state.currentLineCap != lineCap ||
                (lineDash != state.currentLineDash && !ol.array.equals(state.currentLineDash, lineDash)) ||
                state.currentLineDashOffset != lineDashOffset ||
                state.currentLineJoin != lineJoin ||
                state.currentLineWidth != lineWidth ||
                state.currentMiterLimit != miterLimit) {
                applyStroke.call(this, state);
                state.currentStrokeStyle = strokeStyle;
                state.currentLineCap = lineCap;
                state.currentLineDash = lineDash;
                state.currentLineDashOffset = lineDashOffset;
                state.currentLineJoin = lineJoin;
                state.currentLineWidth = lineWidth;
                state.currentMiterLimit = miterLimit;
            }
        };


        /**
         * @param {ol.geom.Geometry|ol.render.Feature} geometry Geometry.
         * @param {ol.Feature|ol.render.Feature} feature Feature.
         */
        ol.render.canvas.Replay.prototype.endGeometry = function(geometry, feature) {
            this.beginGeometryInstruction1_[2] = this.instructions.length;
            this.beginGeometryInstruction1_ = null;
            this.beginGeometryInstruction2_[2] = this.hitDetectionInstructions.length;
            this.beginGeometryInstruction2_ = null;
            var endGeometryInstruction =
                [ol.render.canvas.Instruction.END_GEOMETRY, feature];
            this.instructions.push(endGeometryInstruction);
            this.hitDetectionInstructions.push(endGeometryInstruction);
        };


        /**
         * FIXME empty description for jsdoc
         */
        ol.render.canvas.Replay.prototype.finish = ol.nullFunction;


        /**
         * Get the buffered rendering extent.  Rendering will be clipped to the extent
         * provided to the constructor.  To account for symbolizers that may intersect
         * this extent, we calculate a buffered extent (e.g. based on stroke width).
         * @return {ol.Extent} The buffered rendering extent.
         * @protected
         */
        ol.render.canvas.Replay.prototype.getBufferedMaxExtent = function() {
            if (!this.bufferedMaxExtent_) {
                this.bufferedMaxExtent_ = ol.extent.clone(this.maxExtent);
                if (this.maxLineWidth > 0) {
                    var width = this.resolution * (this.maxLineWidth + 1) / 2;
                    ol.extent.buffer(this.bufferedMaxExtent_, width, this.bufferedMaxExtent_);
                }
            }
            return this.bufferedMaxExtent_;
        };

        /**
         * @constructor
         * @extends {ol.render.canvas.Replay}
         * @param {number} tolerance Tolerance.
         * @param {ol.Extent} maxExtent Maximum extent.
         * @param {number} resolution Resolution.
         * @param {number} pixelRatio Pixel ratio.
         * @param {boolean} overlaps The replay can have overlapping geometries.
         * @param {?} declutterTree Declutter tree.
         * @struct
         */
        ol.render.canvas.ImageReplay = function(
            tolerance, maxExtent, resolution, pixelRatio, overlaps, declutterTree) {
            ol.render.canvas.Replay.call(this,
                tolerance, maxExtent, resolution, pixelRatio, overlaps, declutterTree);

            /**
             * @private
             * @type {ol.DeclutterGroup}
             */
            this.declutterGroup_ = null;

            /**
             * @private
             * @type {HTMLCanvasElement|HTMLVideoElement|Image}
             */
            this.hitDetectionImage_ = null;

            /**
             * @private
             * @type {HTMLCanvasElement|HTMLVideoElement|Image}
             */
            this.image_ = null;

            /**
             * @private
             * @type {number|undefined}
             */
            this.anchorX_ = undefined;

            /**
             * @private
             * @type {number|undefined}
             */
            this.anchorY_ = undefined;

            /**
             * @private
             * @type {number|undefined}
             */
            this.height_ = undefined;

            /**
             * @private
             * @type {number|undefined}
             */
            this.opacity_ = undefined;

            /**
             * @private
             * @type {number|undefined}
             */
            this.originX_ = undefined;

            /**
             * @private
             * @type {number|undefined}
             */
            this.originY_ = undefined;

            /**
             * @private
             * @type {boolean|undefined}
             */
            this.rotateWithView_ = undefined;

            /**
             * @private
             * @type {number|undefined}
             */
            this.rotation_ = undefined;

            /**
             * @private
             * @type {number|undefined}
             */
            this.scale_ = undefined;

            /**
             * @private
             * @type {boolean|undefined}
             */
            this.snapToPixel_ = undefined;

            /**
             * @private
             * @type {number|undefined}
             */
            this.width_ = undefined;

        };
        ol.inherits(ol.render.canvas.ImageReplay, ol.render.canvas.Replay);


        /**
         * @param {Array.<number>} flatCoordinates Flat coordinates.
         * @param {number} offset Offset.
         * @param {number} end End.
         * @param {number} stride Stride.
         * @private
         * @return {number} My end.
         */
        ol.render.canvas.ImageReplay.prototype.drawCoordinates_ = function(flatCoordinates, offset, end, stride) {
            return this.appendFlatCoordinates(
                flatCoordinates, offset, end, stride, false, false);
        };


        /**
         * @inheritDoc
         */
        ol.render.canvas.ImageReplay.prototype.drawPoint = function(pointGeometry, feature) {
            if (!this.image_) {
                return;
            }
            this.beginGeometry(pointGeometry, feature);
            var flatCoordinates = pointGeometry.getFlatCoordinates();
            var stride = pointGeometry.getStride();
            var myBegin = this.coordinates.length;
            var myEnd = this.drawCoordinates_(
                flatCoordinates, 0, flatCoordinates.length, stride);
            this.instructions.push([
                ol.render.canvas.Instruction.DRAW_IMAGE, myBegin, myEnd, this.image_,
                // Remaining arguments to DRAW_IMAGE are in alphabetical order
                this.anchorX_, this.anchorY_, this.declutterGroup_, this.height_, this.opacity_,
                this.originX_, this.originY_, this.rotateWithView_, this.rotation_,
                this.scale_ * this.pixelRatio, this.snapToPixel_, this.width_
            ]);
            this.hitDetectionInstructions.push([
                ol.render.canvas.Instruction.DRAW_IMAGE, myBegin, myEnd,
                this.hitDetectionImage_,
                // Remaining arguments to DRAW_IMAGE are in alphabetical order
                this.anchorX_, this.anchorY_, this.declutterGroup_, this.height_, this.opacity_,
                this.originX_, this.originY_, this.rotateWithView_, this.rotation_,
                this.scale_, this.snapToPixel_, this.width_
            ]);
            this.endGeometry(pointGeometry, feature);
        };


        /**
         * @inheritDoc
         */
        ol.render.canvas.ImageReplay.prototype.drawMultiPoint = function(multiPointGeometry, feature) {
            if (!this.image_) {
                return;
            }
            this.beginGeometry(multiPointGeometry, feature);
            var flatCoordinates = multiPointGeometry.getFlatCoordinates();
            var stride = multiPointGeometry.getStride();
            var myBegin = this.coordinates.length;
            var myEnd = this.drawCoordinates_(
                flatCoordinates, 0, flatCoordinates.length, stride);
            this.instructions.push([
                ol.render.canvas.Instruction.DRAW_IMAGE, myBegin, myEnd, this.image_,
                // Remaining arguments to DRAW_IMAGE are in alphabetical order
                this.anchorX_, this.anchorY_, this.declutterGroup_, this.height_, this.opacity_,
                this.originX_, this.originY_, this.rotateWithView_, this.rotation_,
                this.scale_ * this.pixelRatio, this.snapToPixel_, this.width_
            ]);
            this.hitDetectionInstructions.push([
                ol.render.canvas.Instruction.DRAW_IMAGE, myBegin, myEnd,
                this.hitDetectionImage_,
                // Remaining arguments to DRAW_IMAGE are in alphabetical order
                this.anchorX_, this.anchorY_, this.declutterGroup_, this.height_, this.opacity_,
                this.originX_, this.originY_, this.rotateWithView_, this.rotation_,
                this.scale_, this.snapToPixel_, this.width_
            ]);
            this.endGeometry(multiPointGeometry, feature);
        };


        /**
         * @inheritDoc
         */
        ol.render.canvas.ImageReplay.prototype.finish = function() {
            this.reverseHitDetectionInstructions();
            // FIXME this doesn't really protect us against further calls to draw*Geometry
            this.anchorX_ = undefined;
            this.anchorY_ = undefined;
            this.hitDetectionImage_ = null;
            this.image_ = null;
            this.height_ = undefined;
            this.scale_ = undefined;
            this.opacity_ = undefined;
            this.originX_ = undefined;
            this.originY_ = undefined;
            this.rotateWithView_ = undefined;
            this.rotation_ = undefined;
            this.snapToPixel_ = undefined;
            this.width_ = undefined;
        };


        /**
         * @inheritDoc
         */
        ol.render.canvas.ImageReplay.prototype.setImageStyle = function(imageStyle, declutterGroup) {
            var anchor = imageStyle.getAnchor();
            var size = imageStyle.getSize();
            var hitDetectionImage = imageStyle.getHitDetectionImage(1);
            var image = imageStyle.getImage(1);
            var origin = imageStyle.getOrigin();
            this.anchorX_ = anchor[0];
            this.anchorY_ = anchor[1];
            this.declutterGroup_ = /** @type {ol.DeclutterGroup} */ (declutterGroup);
            this.hitDetectionImage_ = hitDetectionImage;
            this.image_ = image;
            this.height_ = size[1];
            this.opacity_ = imageStyle.getOpacity();
            this.originX_ = origin[0];
            this.originY_ = origin[1];
            this.rotateWithView_ = imageStyle.getRotateWithView();
            this.rotation_ = imageStyle.getRotation();
            this.scale_ = imageStyle.getScale();
            this.snapToPixel_ = imageStyle.getSnapToPixel();
            this.width_ = size[0];
        };

        /**
         * @constructor
         * @extends {ol.render.canvas.Replay}
         * @param {number} tolerance Tolerance.
         * @param {ol.Extent} maxExtent Maximum extent.
         * @param {number} resolution Resolution.
         * @param {number} pixelRatio Pixel ratio.
         * @param {boolean} overlaps The replay can have overlapping geometries.
         * @param {?} declutterTree Declutter tree.
         * @struct
         */
        ol.render.canvas.LineStringReplay = function(
            tolerance, maxExtent, resolution, pixelRatio, overlaps, declutterTree) {
            ol.render.canvas.Replay.call(this,
                tolerance, maxExtent, resolution, pixelRatio, overlaps, declutterTree);
        };
        ol.inherits(ol.render.canvas.LineStringReplay, ol.render.canvas.Replay);


        /**
         * @param {Array.<number>} flatCoordinates Flat coordinates.
         * @param {number} offset Offset.
         * @param {number} end End.
         * @param {number} stride Stride.
         * @private
         * @return {number} end.
         */
        ol.render.canvas.LineStringReplay.prototype.drawFlatCoordinates_ = function(flatCoordinates, offset, end, stride) {
            var myBegin = this.coordinates.length;
            var myEnd = this.appendFlatCoordinates(
                flatCoordinates, offset, end, stride, false, false);
            var moveToLineToInstruction =
                [ol.render.canvas.Instruction.MOVE_TO_LINE_TO, myBegin, myEnd];
            this.instructions.push(moveToLineToInstruction);
            this.hitDetectionInstructions.push(moveToLineToInstruction);
            return end;
        };


        /**
         * @inheritDoc
         */
        ol.render.canvas.LineStringReplay.prototype.drawLineString = function(lineStringGeometry, feature) {
            var state = this.state;
            var strokeStyle = state.strokeStyle;
            var lineWidth = state.lineWidth;
            if (strokeStyle === undefined || lineWidth === undefined) {
                return;
            }
            this.updateStrokeStyle(state, this.applyStroke);
            this.beginGeometry(lineStringGeometry, feature);
            this.hitDetectionInstructions.push([
                ol.render.canvas.Instruction.SET_STROKE_STYLE,
                state.strokeStyle, state.lineWidth, state.lineCap, state.lineJoin,
                state.miterLimit, state.lineDash, state.lineDashOffset
            ], [
                ol.render.canvas.Instruction.BEGIN_PATH
            ]);
            var flatCoordinates = lineStringGeometry.getFlatCoordinates();
            var stride = lineStringGeometry.getStride();
            this.drawFlatCoordinates_(flatCoordinates, 0, flatCoordinates.length, stride);
            this.hitDetectionInstructions.push([ol.render.canvas.Instruction.STROKE]);
            this.endGeometry(lineStringGeometry, feature);
        };


        /**
         * @inheritDoc
         */
        ol.render.canvas.LineStringReplay.prototype.drawMultiLineString = function(multiLineStringGeometry, feature) {
            var state = this.state;
            var strokeStyle = state.strokeStyle;
            var lineWidth = state.lineWidth;
            if (strokeStyle === undefined || lineWidth === undefined) {
                return;
            }
            this.updateStrokeStyle(state, this.applyStroke);
            this.beginGeometry(multiLineStringGeometry, feature);
            this.hitDetectionInstructions.push([
                ol.render.canvas.Instruction.SET_STROKE_STYLE,
                state.strokeStyle, state.lineWidth, state.lineCap, state.lineJoin,
                state.miterLimit, state.lineDash, state.lineDashOffset
            ], [
                ol.render.canvas.Instruction.BEGIN_PATH
            ]);
            var ends = multiLineStringGeometry.getEnds();
            var flatCoordinates = multiLineStringGeometry.getFlatCoordinates();
            var stride = multiLineStringGeometry.getStride();
            var offset = 0;
            var i, ii;
            for (i = 0, ii = ends.length; i < ii; ++i) {
                offset = this.drawFlatCoordinates_(
                    flatCoordinates, offset, ends[i], stride);
            }
            this.hitDetectionInstructions.push([ol.render.canvas.Instruction.STROKE]);
            this.endGeometry(multiLineStringGeometry, feature);
        };


        /**
         * @inheritDoc
         */
        ol.render.canvas.LineStringReplay.prototype.finish = function() {
            var state = this.state;
            if (state.lastStroke != undefined && state.lastStroke != this.coordinates.length) {
                this.instructions.push([ol.render.canvas.Instruction.STROKE]);
            }
            this.reverseHitDetectionInstructions();
            this.state = null;
        };


        /**
         * @inheritDoc.
         */
        ol.render.canvas.LineStringReplay.prototype.applyStroke = function(state) {
            if (state.lastStroke != undefined && state.lastStroke != this.coordinates.length) {
                this.instructions.push([ol.render.canvas.Instruction.STROKE]);
                state.lastStroke = this.coordinates.length;
            }
            state.lastStroke = 0;
            ol.render.canvas.Replay.prototype.applyStroke.call(this, state);
            this.instructions.push([ol.render.canvas.Instruction.BEGIN_PATH]);
        };

        /**
         * @constructor
         * @extends {ol.render.canvas.Replay}
         * @param {number} tolerance Tolerance.
         * @param {ol.Extent} maxExtent Maximum extent.
         * @param {number} resolution Resolution.
         * @param {number} pixelRatio Pixel ratio.
         * @param {boolean} overlaps The replay can have overlapping geometries.
         * @param {?} declutterTree Declutter tree.
         * @struct
         */
        ol.render.canvas.PolygonReplay = function(
            tolerance, maxExtent, resolution, pixelRatio, overlaps, declutterTree) {
            ol.render.canvas.Replay.call(this,
                tolerance, maxExtent, resolution, pixelRatio, overlaps, declutterTree);
        };
        ol.inherits(ol.render.canvas.PolygonReplay, ol.render.canvas.Replay);


        /**
         * @param {Array.<number>} flatCoordinates Flat coordinates.
         * @param {number} offset Offset.
         * @param {Array.<number>} ends Ends.
         * @param {number} stride Stride.
         * @private
         * @return {number} End.
         */
        ol.render.canvas.PolygonReplay.prototype.drawFlatCoordinatess_ = function(flatCoordinates, offset, ends, stride) {
            var state = this.state;
            var fill = state.fillStyle !== undefined;
            var stroke = state.strokeStyle != undefined;
            var numEnds = ends.length;
            var beginPathInstruction = [ol.render.canvas.Instruction.BEGIN_PATH];
            this.instructions.push(beginPathInstruction);
            this.hitDetectionInstructions.push(beginPathInstruction);
            for (var i = 0; i < numEnds; ++i) {
                var end = ends[i];
                var myBegin = this.coordinates.length;
                var myEnd = this.appendFlatCoordinates(
                    flatCoordinates, offset, end, stride, true, !stroke);
                var moveToLineToInstruction =
                    [ol.render.canvas.Instruction.MOVE_TO_LINE_TO, myBegin, myEnd];
                this.instructions.push(moveToLineToInstruction);
                this.hitDetectionInstructions.push(moveToLineToInstruction);
                if (stroke) {
                    // Performance optimization: only call closePath() when we have a stroke.
                    // Otherwise the ring is closed already (see appendFlatCoordinates above).
                    var closePathInstruction = [ol.render.canvas.Instruction.CLOSE_PATH];
                    this.instructions.push(closePathInstruction);
                    this.hitDetectionInstructions.push(closePathInstruction);
                }
                offset = end;
            }
            var fillInstruction = [ol.render.canvas.Instruction.FILL];
            this.hitDetectionInstructions.push(fillInstruction);
            if (fill) {
                this.instructions.push(fillInstruction);
            }
            if (stroke) {
                var strokeInstruction = [ol.render.canvas.Instruction.STROKE];
                this.instructions.push(strokeInstruction);
                this.hitDetectionInstructions.push(strokeInstruction);
            }
            return offset;
        };


        /**
         * @inheritDoc
         */
        ol.render.canvas.PolygonReplay.prototype.drawCircle = function(circleGeometry, feature) {
            var state = this.state;
            var fillStyle = state.fillStyle;
            var strokeStyle = state.strokeStyle;
            if (fillStyle === undefined && strokeStyle === undefined) {
                return;
            }
            this.setFillStrokeStyles_(circleGeometry);
            this.beginGeometry(circleGeometry, feature);
            // always fill the circle for hit detection
            this.hitDetectionInstructions.push([
                ol.render.canvas.Instruction.SET_FILL_STYLE,
                ol.color.asString(ol.render.canvas.defaultFillStyle)
            ]);
            if (state.strokeStyle !== undefined) {
                this.hitDetectionInstructions.push([
                    ol.render.canvas.Instruction.SET_STROKE_STYLE,
                    state.strokeStyle, state.lineWidth, state.lineCap, state.lineJoin,
                    state.miterLimit, state.lineDash, state.lineDashOffset
                ]);
            }
            var flatCoordinates = circleGeometry.getFlatCoordinates();
            var stride = circleGeometry.getStride();
            var myBegin = this.coordinates.length;
            this.appendFlatCoordinates(
                flatCoordinates, 0, flatCoordinates.length, stride, false, false);
            var beginPathInstruction = [ol.render.canvas.Instruction.BEGIN_PATH];
            var circleInstruction = [ol.render.canvas.Instruction.CIRCLE, myBegin];
            this.instructions.push(beginPathInstruction, circleInstruction);
            this.hitDetectionInstructions.push(beginPathInstruction, circleInstruction);
            var fillInstruction = [ol.render.canvas.Instruction.FILL];
            this.hitDetectionInstructions.push(fillInstruction);
            if (state.fillStyle !== undefined) {
                this.instructions.push(fillInstruction);
            }
            if (state.strokeStyle !== undefined) {
                var strokeInstruction = [ol.render.canvas.Instruction.STROKE];
                this.instructions.push(strokeInstruction);
                this.hitDetectionInstructions.push(strokeInstruction);
            }
            this.endGeometry(circleGeometry, feature);
        };


        /**
         * @inheritDoc
         */
        ol.render.canvas.PolygonReplay.prototype.drawPolygon = function(polygonGeometry, feature) {
            var state = this.state;
            this.setFillStrokeStyles_(polygonGeometry);
            this.beginGeometry(polygonGeometry, feature);
            // always fill the polygon for hit detection
            this.hitDetectionInstructions.push([
                ol.render.canvas.Instruction.SET_FILL_STYLE,
                ol.color.asString(ol.render.canvas.defaultFillStyle)]
            );
            if (state.strokeStyle !== undefined) {
                this.hitDetectionInstructions.push([
                    ol.render.canvas.Instruction.SET_STROKE_STYLE,
                    state.strokeStyle, state.lineWidth, state.lineCap, state.lineJoin,
                    state.miterLimit, state.lineDash, state.lineDashOffset
                ]);
            }
            var ends = polygonGeometry.getEnds();
            var flatCoordinates = polygonGeometry.getOrientedFlatCoordinates();
            var stride = polygonGeometry.getStride();
            this.drawFlatCoordinatess_(flatCoordinates, 0, ends, stride);
            this.endGeometry(polygonGeometry, feature);
        };


        /**
         * @inheritDoc
         */
        ol.render.canvas.PolygonReplay.prototype.drawMultiPolygon = function(multiPolygonGeometry, feature) {
            var state = this.state;
            var fillStyle = state.fillStyle;
            var strokeStyle = state.strokeStyle;
            if (fillStyle === undefined && strokeStyle === undefined) {
                return;
            }
            this.setFillStrokeStyles_(multiPolygonGeometry);
            this.beginGeometry(multiPolygonGeometry, feature);
            // always fill the multi-polygon for hit detection
            this.hitDetectionInstructions.push([
                ol.render.canvas.Instruction.SET_FILL_STYLE,
                ol.color.asString(ol.render.canvas.defaultFillStyle)
            ]);
            if (state.strokeStyle !== undefined) {
                this.hitDetectionInstructions.push([
                    ol.render.canvas.Instruction.SET_STROKE_STYLE,
                    state.strokeStyle, state.lineWidth, state.lineCap, state.lineJoin,
                    state.miterLimit, state.lineDash, state.lineDashOffset
                ]);
            }
            var endss = multiPolygonGeometry.getEndss();
            var flatCoordinates = multiPolygonGeometry.getOrientedFlatCoordinates();
            var stride = multiPolygonGeometry.getStride();
            var offset = 0;
            var i, ii;
            for (i = 0, ii = endss.length; i < ii; ++i) {
                offset = this.drawFlatCoordinatess_(
                    flatCoordinates, offset, endss[i], stride);
            }
            this.endGeometry(multiPolygonGeometry, feature);
        };


        /**
         * @inheritDoc
         */
        ol.render.canvas.PolygonReplay.prototype.finish = function() {
            this.reverseHitDetectionInstructions();
            this.state = null;
            // We want to preserve topology when drawing polygons.  Polygons are
            // simplified using quantization and point elimination. However, we might
            // have received a mix of quantized and non-quantized geometries, so ensure
            // that all are quantized by quantizing all coordinates in the batch.
            var tolerance = this.tolerance;
            if (tolerance !== 0) {
                var coordinates = this.coordinates;
                var i, ii;
                for (i = 0, ii = coordinates.length; i < ii; ++i) {
                    coordinates[i] = ol.geom.flat.simplify.snap(coordinates[i], tolerance);
                }
            }
        };


        /**
         * @private
         * @param {ol.geom.Geometry|ol.render.Feature} geometry Geometry.
         */
        ol.render.canvas.PolygonReplay.prototype.setFillStrokeStyles_ = function(geometry) {
            var state = this.state;
            var fillStyle = state.fillStyle;
            if (fillStyle !== undefined) {
                this.updateFillStyle(state, this.applyFill, geometry);
            }
            if (state.strokeStyle !== undefined) {
                this.updateStrokeStyle(state, this.applyStroke);
            }
        };

        ol.geom.flat.straightchunk = {};
        ol.geom.flat.straightchunk.lineString = function(maxAngle, flatCoordinates, offset, end, stride) {
            var chunkStart = offset;
            var chunkEnd = offset;
            var chunkM = 0;
            var m = 0;
            var start = offset;
            var acos, i, m12, m23, x1, y1, x12, y12, x23, y23;
            for (i = offset; i < end; i += stride) {
                var x2 = flatCoordinates[i];
                var y2 = flatCoordinates[i + 1];
                if (x1 !== undefined) {
                    x23 = x2 - x1;
                    y23 = y2 - y1;
                    m23 = Math.sqrt(x23 * x23 + y23 * y23);
                    if (x12 !== undefined) {
                        m += m12;
                        acos = Math.acos((x12 * x23 + y12 * y23) / (m12 * m23));
                        if (acos > maxAngle) {
                            if (m > chunkM) {
                                chunkM = m;
                                chunkStart = start;
                                chunkEnd = i;
                            }
                            m = 0;
                            start = i - stride;
                        }
                    }
                    m12 = m23;
                    x12 = x23;
                    y12 = y23;
                }
                x1 = x2;
                y1 = y2;
            }
            m += m23;
            return m > chunkM ? [start, i] : [chunkStart, chunkEnd];
        };

        ol.style.TextPlacement = {
            POINT: 'point',
            LINE: 'line'
        };

        ol.render.canvas.TextReplay = function(
            tolerance, maxExtent, resolution, pixelRatio, overlaps, declutterTree) {
            ol.render.canvas.Replay.call(this,
                tolerance, maxExtent, resolution, pixelRatio, overlaps, declutterTree);

            /**
             * @private
             * @type {ol.DeclutterGroup}
             */
            this.declutterGroup_;

            /**
             * @private
             * @type {Array.<HTMLCanvasElement>}
             */
            this.labels_ = null;

            /**
             * @private
             * @type {string}
             */
            this.text_ = '';

            /**
             * @private
             * @type {number}
             */
            this.textOffsetX_ = 0;

            /**
             * @private
             * @type {number}
             */
            this.textOffsetY_ = 0;

            /**
             * @private
             * @type {boolean|undefined}
             */
            this.textRotateWithView_ = undefined;

            /**
             * @private
             * @type {number}
             */
            this.textRotation_ = 0;

            /**
             * @private
             * @type {?ol.CanvasFillState}
             */
            this.textFillState_ = null;

            /**
             * @type {Object.<string, ol.CanvasFillState>}
             */
            this.fillStates = {};

            /**
             * @private
             * @type {?ol.CanvasStrokeState}
             */
            this.textStrokeState_ = null;

            /**
             * @type {Object.<string, ol.CanvasStrokeState>}
             */
            this.strokeStates = {};

            /**
             * @private
             * @type {ol.CanvasTextState}
             */
            this.textState_ = /** @type {ol.CanvasTextState} */ ({});

            /**
             * @type {Object.<string, ol.CanvasTextState>}
             */
            this.textStates = {};

            /**
             * @private
             * @type {string}
             */
            this.textKey_ = '';

            /**
             * @private
             * @type {string}
             */
            this.fillKey_ = '';

            /**
             * @private
             * @type {string}
             */
            this.strokeKey_ = '';

            /**
             * @private
             * @type {Object.<string, Object.<string, number>>}
             */
            this.widths_ = {};

            var labelCache = ol.render.canvas.labelCache;
            labelCache.prune();

        };
        ol.inherits(ol.render.canvas.TextReplay, ol.render.canvas.Replay);


        /**
         * @param {string} font Font to use for measuring.
         * @param {Array.<string>} lines Lines to measure.
         * @param {Array.<number>} widths Array will be populated with the widths of
         * each line.
         * @return {number} Width of the whole text.
         */
        ol.render.canvas.TextReplay.measureTextWidths = function(font, lines, widths) {
            var numLines = lines.length;
            var width = 0;
            var currentWidth, i;
            for (i = 0; i < numLines; ++i) {
                currentWidth = ol.render.canvas.measureTextWidth(font, lines[i]);
                width = Math.max(width, currentWidth);
                widths.push(currentWidth);
            }
            return width;
        };


        /**
         * @inheritDoc
         */
        ol.render.canvas.TextReplay.prototype.drawText = function(geometry, feature) {
            var fillState = this.textFillState_;
            var strokeState = this.textStrokeState_;
            var textState = this.textState_;
            if (this.text_ === '' || !textState || (!fillState && !strokeState)) {
                return;
            }

            var begin = this.coordinates.length;

            var geometryType = geometry.getType();
            var flatCoordinates = null;
            var end = 2;
            var stride = 2;
            var i, ii;

            if (textState.placement === ol.style.TextPlacement.LINE) {
                if (!ol.extent.intersects(this.getBufferedMaxExtent(), geometry.getExtent())) {
                    return;
                }
                var ends;
                flatCoordinates = geometry.getFlatCoordinates();
                stride = geometry.getStride();
                if (geometryType == ol.geom.GeometryType.LINE_STRING) {
                    ends = [flatCoordinates.length];
                } else if (geometryType == ol.geom.GeometryType.MULTI_LINE_STRING) {
                    ends = geometry.getEnds();
                } else if (geometryType == ol.geom.GeometryType.POLYGON) {
                    ends = geometry.getEnds().slice(0, 1);
                } else if (geometryType == ol.geom.GeometryType.MULTI_POLYGON) {
                    var endss = geometry.getEndss();
                    ends = [];
                    for (i = 0, ii = endss.length; i < ii; ++i) {
                        ends.push(endss[i][0]);
                    }
                }
                this.beginGeometry(geometry, feature);
                var textAlign = textState.textAlign;
                var flatOffset = 0;
                var flatEnd;
                for (var o = 0, oo = ends.length; o < oo; ++o) {
                    if (textAlign == undefined) {
                        var range = ol.geom.flat.straightchunk.lineString(
                            textState.maxAngle, flatCoordinates, flatOffset, ends[o], stride);
                        flatOffset = range[0];
                        flatEnd = range[1];
                    } else {
                        flatEnd = ends[o];
                    }
                    for (i = flatOffset; i < flatEnd; i += stride) {
                        this.coordinates.push(flatCoordinates[i], flatCoordinates[i + 1]);
                    }
                    end = this.coordinates.length;
                    flatOffset = ends[o];
                    this.drawChars_(begin, end, this.declutterGroup_);
                    begin = end;
                }
                this.endGeometry(geometry, feature);

            } else {
                var label = this.getImage(this.text_, this.textKey_, this.fillKey_, this.strokeKey_);
                var width = label.width / this.pixelRatio;
                switch (geometryType) {
                    case ol.geom.GeometryType.POINT:
                    case ol.geom.GeometryType.MULTI_POINT:
                        flatCoordinates = geometry.getFlatCoordinates();
                        end = flatCoordinates.length;
                        break;
                    case ol.geom.GeometryType.LINE_STRING:
                        flatCoordinates = /** @type {ol.geom.LineString} */ (geometry).getFlatMidpoint();
                        break;
                    case ol.geom.GeometryType.CIRCLE:
                        flatCoordinates = /** @type {ol.geom.Circle} */ (geometry).getCenter();
                        break;
                    case ol.geom.GeometryType.MULTI_LINE_STRING:
                        flatCoordinates = /** @type {ol.geom.MultiLineString} */ (geometry).getFlatMidpoints();
                        end = flatCoordinates.length;
                        break;
                    case ol.geom.GeometryType.POLYGON:
                        flatCoordinates = /** @type {ol.geom.Polygon} */ (geometry).getFlatInteriorPoint();
                        if (!textState.overflow && flatCoordinates[2] / this.resolution < width) {
                            return;
                        }
                        stride = 3;
                        break;
                    case ol.geom.GeometryType.MULTI_POLYGON:
                        var interiorPoints = /** @type {ol.geom.MultiPolygon} */ (geometry).getFlatInteriorPoints();
                        flatCoordinates = [];
                        for (i = 0, ii = interiorPoints.length; i < ii; i += 3) {
                            if (textState.overflow || interiorPoints[i + 2] / this.resolution >= width) {
                                flatCoordinates.push(interiorPoints[i], interiorPoints[i + 1]);
                            }
                        }
                        end = flatCoordinates.length;
                        if (end == 0) {
                            return;
                        }
                        break;
                }
                end = this.appendFlatCoordinates(flatCoordinates, 0, end, stride, false, false);
                this.beginGeometry(geometry, feature);
                if (textState.backgroundFill || textState.backgroundStroke) {
                    this.setFillStrokeStyle(textState.backgroundFill, textState.backgroundStroke);
                    this.updateFillStyle(this.state, this.applyFill, geometry);
                    this.updateStrokeStyle(this.state, this.applyStroke);
                }
                this.drawTextImage_(label, begin, end);
                this.endGeometry(geometry, feature);
            }
        };


        /**
         * @param {string} text Text.
         * @param {string} textKey Text style key.
         * @param {string} fillKey Fill style key.
         * @param {string} strokeKey Stroke style key.
         * @return {HTMLCanvasElement} Image.
         */
        ol.render.canvas.TextReplay.prototype.getImage = function(text, textKey, fillKey, strokeKey) {
            var label;
            var key = strokeKey + textKey + text + fillKey + this.pixelRatio;

            var labelCache = ol.render.canvas.labelCache;
            if (!labelCache.containsKey(key)) {
                var strokeState = strokeKey ? this.strokeStates[strokeKey] || this.textStrokeState_ : null;
                var fillState = fillKey ? this.fillStates[fillKey] || this.textFillState_ : null;
                var textState = this.textStates[textKey] || this.textState_;
                var pixelRatio = this.pixelRatio;
                var scale = textState.scale * pixelRatio;
                var align =  ol.render.replay.TEXT_ALIGN[textState.textAlign || ol.render.canvas.defaultTextAlign];
                var strokeWidth = strokeKey && strokeState.lineWidth ? strokeState.lineWidth : 0;

                var lines = text.split('\n');
                var numLines = lines.length;
                var widths = [];
                var width = ol.render.canvas.TextReplay.measureTextWidths(textState.font, lines, widths);
                var lineHeight = ol.render.canvas.measureTextHeight(textState.font);
                var height = lineHeight * numLines;
                var renderWidth = (width + strokeWidth);
                var context = ol.dom.createCanvasContext2D(
                    Math.ceil(renderWidth * scale),
                    Math.ceil((height + strokeWidth) * scale));
                label = context.canvas;
                labelCache.set(key, label);
                if (scale != 1) {
                    context.scale(scale, scale);
                }
                context.font = textState.font;
                if (strokeKey) {
                    context.strokeStyle = strokeState.strokeStyle;
                    context.lineWidth = strokeWidth * (ol.has.SAFARI ? scale : 1);
                    context.lineCap = strokeState.lineCap;
                    context.lineJoin = strokeState.lineJoin;
                    context.miterLimit = strokeState.miterLimit;
                    if (ol.has.CANVAS_LINE_DASH && strokeState.lineDash.length) {
                        context.setLineDash(strokeState.lineDash);
                        context.lineDashOffset = strokeState.lineDashOffset;
                    }
                }
                if (fillKey) {
                    context.fillStyle = fillState.fillStyle;
                }
                context.textBaseline = 'middle';
                context.textAlign = 'center';
                var leftRight = (0.5 - align);
                var x = align * label.width / scale + leftRight * strokeWidth;
                var i;
                if (strokeKey) {
                    for (i = 0; i < numLines; ++i) {
                        context.strokeText(lines[i], x + leftRight * widths[i], 0.5 * (strokeWidth + lineHeight) + i * lineHeight);
                    }
                }
                if (fillKey) {
                    for (i = 0; i < numLines; ++i) {
                        context.fillText(lines[i], x + leftRight * widths[i], 0.5 * (strokeWidth + lineHeight) + i * lineHeight);
                    }
                }
            }
            return labelCache.get(key);
        };


        /**
         * @private
         * @param {HTMLCanvasElement} label Label.
         * @param {number} begin Begin.
         * @param {number} end End.
         */
        ol.render.canvas.TextReplay.prototype.drawTextImage_ = function(label, begin, end) {
            var textState = this.textState_;
            var strokeState = this.textStrokeState_;
            var pixelRatio = this.pixelRatio;
            var align = ol.render.replay.TEXT_ALIGN[textState.textAlign || ol.render.canvas.defaultTextAlign];
            var baseline = ol.render.replay.TEXT_ALIGN[textState.textBaseline];
            var strokeWidth = strokeState && strokeState.lineWidth ? strokeState.lineWidth : 0;

            var anchorX = align * label.width / pixelRatio + 2 * (0.5 - align) * strokeWidth;
            var anchorY = baseline * label.height / pixelRatio + 2 * (0.5 - baseline) * strokeWidth;
            this.instructions.push([ol.render.canvas.Instruction.DRAW_IMAGE, begin, end,
                label, (anchorX - this.textOffsetX_) * pixelRatio, (anchorY - this.textOffsetY_) * pixelRatio,
                this.declutterGroup_, label.height, 1, 0, 0, this.textRotateWithView_, this.textRotation_,
                1, true, label.width,
                textState.padding == ol.render.canvas.defaultPadding ?
                    ol.render.canvas.defaultPadding : textState.padding.map(function(p) {
                    return p * pixelRatio;
                }),
                !!textState.backgroundFill, !!textState.backgroundStroke
            ]);
            this.hitDetectionInstructions.push([ol.render.canvas.Instruction.DRAW_IMAGE, begin, end,
                label, (anchorX - this.textOffsetX_) * pixelRatio, (anchorY - this.textOffsetY_) * pixelRatio,
                this.declutterGroup_, label.height, 1, 0, 0, this.textRotateWithView_, this.textRotation_,
                1 / pixelRatio, true, label.width, textState.padding,
                !!textState.backgroundFill, !!textState.backgroundStroke
            ]);
        };


        /**
         * @private
         * @param {number} begin Begin.
         * @param {number} end End.
         * @param {ol.DeclutterGroup} declutterGroup Declutter group.
         */
        ol.render.canvas.TextReplay.prototype.drawChars_ = function(begin, end, declutterGroup) {
            var strokeState = this.textStrokeState_;
            var textState = this.textState_;
            var fillState = this.textFillState_;

            var strokeKey = this.strokeKey_;
            if (strokeState) {
                if (!(strokeKey in this.strokeStates)) {
                    this.strokeStates[strokeKey] = /** @type {ol.CanvasStrokeState} */ ({
                        strokeStyle: strokeState.strokeStyle,
                        lineCap: strokeState.lineCap,
                        lineDashOffset: strokeState.lineDashOffset,
                        lineWidth: strokeState.lineWidth,
                        lineJoin: strokeState.lineJoin,
                        miterLimit: strokeState.miterLimit,
                        lineDash: strokeState.lineDash
                    });
                }
            }
            var textKey = this.textKey_;
            if (!(this.textKey_ in this.textStates)) {
                this.textStates[this.textKey_] = /** @type {ol.CanvasTextState} */ ({
                    font: textState.font,
                    textAlign: textState.textAlign || ol.render.canvas.defaultTextAlign,
                    scale: textState.scale
                });
            }
            var fillKey = this.fillKey_;
            if (fillState) {
                if (!(fillKey in this.fillStates)) {
                    this.fillStates[fillKey] = /** @type {ol.CanvasFillState} */ ({
                        fillStyle: fillState.fillStyle
                    });
                }
            }

            var pixelRatio = this.pixelRatio;
            var baseline = ol.render.replay.TEXT_ALIGN[textState.textBaseline];

            var offsetY = this.textOffsetY_ * pixelRatio;
            var text = this.text_;
            var font = textState.font;
            var textScale = textState.scale;
            var strokeWidth = strokeState ? strokeState.lineWidth * textScale / 2 : 0;
            var widths = this.widths_[font];
            if (!widths) {
                this.widths_[font] = widths = {};
            }
            this.instructions.push([ol.render.canvas.Instruction.DRAW_CHARS,
                begin, end, baseline, declutterGroup,
                textState.overflow, fillKey, textState.maxAngle,
                function(text) {
                    var width = widths[text];
                    if (!width) {
                        width = widths[text] = ol.render.canvas.measureTextWidth(font, text);
                    }
                    return width * textScale * pixelRatio;
                },
                offsetY, strokeKey, strokeWidth * pixelRatio, text, textKey, 1
            ]);
            this.hitDetectionInstructions.push([ol.render.canvas.Instruction.DRAW_CHARS,
                begin, end, baseline, declutterGroup,
                textState.overflow, fillKey, textState.maxAngle,
                function(text) {
                    var width = widths[text];
                    if (!width) {
                        width = widths[text] = ol.render.canvas.measureTextWidth(font, text);
                    }
                    return width * textScale;
                },
                offsetY, strokeKey, strokeWidth, text, textKey, 1 / pixelRatio
            ]);
        };


        /**
         * @inheritDoc
         */
        ol.render.canvas.TextReplay.prototype.setTextStyle = function(textStyle, declutterGroup) {
            var textState, fillState, strokeState;
            if (!textStyle) {
                this.text_ = '';
            } else {
                this.declutterGroup_ = /** @type {ol.DeclutterGroup} */ (declutterGroup);

                var textFillStyle = textStyle.getFill();
                if (!textFillStyle) {
                    fillState = this.textFillState_ = null;
                } else {
                    fillState = this.textFillState_;
                    if (!fillState) {
                        fillState = this.textFillState_ = /** @type {ol.CanvasFillState} */ ({});
                    }
                    fillState.fillStyle = ol.colorlike.asColorLike(
                        textFillStyle.getColor() || ol.render.canvas.defaultFillStyle);
                }

                var textStrokeStyle = textStyle.getStroke();
                if (!textStrokeStyle) {
                    strokeState = this.textStrokeState_ = null;
                } else {
                    strokeState = this.textStrokeState_;
                    if (!strokeState) {
                        strokeState = this.textStrokeState_ = /** @type {ol.CanvasStrokeState} */ ({});
                    }
                    var lineDash = textStrokeStyle.getLineDash();
                    var lineDashOffset = textStrokeStyle.getLineDashOffset();
                    var lineWidth = textStrokeStyle.getWidth();
                    var miterLimit = textStrokeStyle.getMiterLimit();
                    strokeState.lineCap = textStrokeStyle.getLineCap() || ol.render.canvas.defaultLineCap;
                    strokeState.lineDash = lineDash ? lineDash.slice() : ol.render.canvas.defaultLineDash;
                    strokeState.lineDashOffset =
                        lineDashOffset === undefined ? ol.render.canvas.defaultLineDashOffset : lineDashOffset;
                    strokeState.lineJoin = textStrokeStyle.getLineJoin() || ol.render.canvas.defaultLineJoin;
                    strokeState.lineWidth =
                        lineWidth === undefined ? ol.render.canvas.defaultLineWidth : lineWidth;
                    strokeState.miterLimit =
                        miterLimit === undefined ? ol.render.canvas.defaultMiterLimit : miterLimit;
                    strokeState.strokeStyle = ol.colorlike.asColorLike(
                        textStrokeStyle.getColor() || ol.render.canvas.defaultStrokeStyle);
                }

                textState = this.textState_;
                var font = textStyle.getFont() || ol.render.canvas.defaultFont;
                //ol.render.canvas.checkFont(font);  // FIXME sunyl
                var textScale = textStyle.getScale();
                textState.overflow = textStyle.getOverflow();
                textState.font = font;
                textState.maxAngle = textStyle.getMaxAngle();
                textState.placement = textStyle.getPlacement();
                textState.textAlign = textStyle.getTextAlign();
                textState.textBaseline = textStyle.getTextBaseline() || ol.render.canvas.defaultTextBaseline;
                textState.backgroundFill = textStyle.getBackgroundFill();
                textState.backgroundStroke = textStyle.getBackgroundStroke();
                textState.padding = textStyle.getPadding() || ol.render.canvas.defaultPadding;
                textState.scale = textScale === undefined ? 1 : textScale;

                var textOffsetX = textStyle.getOffsetX();
                var textOffsetY = textStyle.getOffsetY();
                var textRotateWithView = textStyle.getRotateWithView();
                var textRotation = textStyle.getRotation();
                this.text_ = textStyle.getText() || '';
                this.textOffsetX_ = textOffsetX === undefined ? 0 : textOffsetX;
                this.textOffsetY_ = textOffsetY === undefined ? 0 : textOffsetY;
                this.textRotateWithView_ = textRotateWithView === undefined ? false : textRotateWithView;
                this.textRotation_ = textRotation === undefined ? 0 : textRotation;

                this.strokeKey_ = strokeState ?
                    (typeof strokeState.strokeStyle == 'string' ? strokeState.strokeStyle : ol.getUid(strokeState.strokeStyle)) +
                        strokeState.lineCap + strokeState.lineDashOffset + '|' + strokeState.lineWidth +
                        strokeState.lineJoin + strokeState.miterLimit + '[' + strokeState.lineDash.join() + ']' :
                    '';
                this.textKey_ = textState.font + textState.scale + (textState.textAlign || '?');
                this.fillKey_ = fillState ?
                    (typeof fillState.fillStyle == 'string' ? fillState.fillStyle : ('|' + ol.getUid(fillState.fillStyle))) :
                    '';
            }
        };

        /**
         * @constructor
         * @extends {ol.render.ReplayGroup}
         * @param {number} tolerance Tolerance.
         * @param {ol.Extent} maxExtent Max extent.
         * @param {number} resolution Resolution.
         * @param {number} pixelRatio Pixel ratio.
         * @param {boolean} overlaps The replay group can have overlapping geometries.
         * @param {?} declutterTree Declutter tree
         * for declutter processing in postrender.
         * @param {number=} opt_renderBuffer Optional rendering buffer.
         * @struct
         */
        ol.render.canvas.ReplayGroup = function(
            tolerance, maxExtent, resolution, pixelRatio, overlaps, declutterTree, opt_renderBuffer) {
            ol.render.ReplayGroup.call(this);

            /**
             * Declutter tree.
             * @private
             */
            this.declutterTree_ = declutterTree;

            /**
             * @type {ol.DeclutterGroup}
             * @private
             */
            this.declutterGroup_ = null;

            /**
             * @private
             * @type {number}
             */
            this.tolerance_ = tolerance;

            /**
             * @private
             * @type {ol.Extent}
             */
            this.maxExtent_ = maxExtent;

            /**
             * @private
             * @type {boolean}
             */
            this.overlaps_ = overlaps;

            /**
             * @private
             * @type {number}
             */
            this.pixelRatio_ = pixelRatio;

            /**
             * @private
             * @type {number}
             */
            this.resolution_ = resolution;

            /**
             * @private
             * @type {number|undefined}
             */
            this.renderBuffer_ = opt_renderBuffer;

            /**
             * @private
             * @type {!Object.<string,
       *        Object.<ol.render.ReplayType, ol.render.canvas.Replay>>}
             */
            this.replaysByZIndex_ = {};

            /**
             * @private
             * @type {CanvasRenderingContext2D}
             */
            // FIXME
            this.hitDetectionContext_ = null;

            /**
             * @private
             * @type {ol.Transform}
             */
            this.hitDetectionTransform_ = ol.transform.create();
        };
        ol.inherits(ol.render.canvas.ReplayGroup, ol.render.ReplayGroup);


        /**
         * This cache is used for storing calculated pixel circles for increasing performance.
         * It is a static property to allow each Replaygroup to access it.
         * @type {Object.<number, Array.<Array.<(boolean|undefined)>>>}
         * @private
         */
        ol.render.canvas.ReplayGroup.circleArrayCache_ = {
            0: [[true]]
        };


        /**
         * This method fills a row in the array from the given coordinate to the
         * middle with `true`.
         * @param {Array.<Array.<(boolean|undefined)>>} array The array that will be altered.
         * @param {number} x X coordinate.
         * @param {number} y Y coordinate.
         * @private
         */
        ol.render.canvas.ReplayGroup.fillCircleArrayRowToMiddle_ = function(array, x, y) {
            var i;
            var radius = Math.floor(array.length / 2);
            if (x >= radius) {
                for (i = radius; i < x; i++) {
                    array[i][y] = true;
                }
            } else if (x < radius) {
                for (i = x + 1; i < radius; i++) {
                    array[i][y] = true;
                }
            }
        };


        /**
         * This methods creates a circle inside a fitting array. Points inside the
         * circle are marked by true, points on the outside are undefined.
         * It uses the midpoint circle algorithm.
         * A cache is used to increase performance.
         * @param {number} radius Radius.
         * @returns {Array.<Array.<(boolean|undefined)>>} An array with marked circle points.
         * @private
         */
        ol.render.canvas.ReplayGroup.getCircleArray_ = function(radius) {
            if (ol.render.canvas.ReplayGroup.circleArrayCache_[radius] !== undefined) {
                return ol.render.canvas.ReplayGroup.circleArrayCache_[radius];
            }

            var arraySize = radius * 2 + 1;
            var arr = new Array(arraySize);
            for (var i = 0; i < arraySize; i++) {
                arr[i] = new Array(arraySize);
            }

            var x = radius;
            var y = 0;
            var error = 0;

            while (x >= y) {
                ol.render.canvas.ReplayGroup.fillCircleArrayRowToMiddle_(arr, radius + x, radius + y);
                ol.render.canvas.ReplayGroup.fillCircleArrayRowToMiddle_(arr, radius + y, radius + x);
                ol.render.canvas.ReplayGroup.fillCircleArrayRowToMiddle_(arr, radius - y, radius + x);
                ol.render.canvas.ReplayGroup.fillCircleArrayRowToMiddle_(arr, radius - x, radius + y);
                ol.render.canvas.ReplayGroup.fillCircleArrayRowToMiddle_(arr, radius - x, radius - y);
                ol.render.canvas.ReplayGroup.fillCircleArrayRowToMiddle_(arr, radius - y, radius - x);
                ol.render.canvas.ReplayGroup.fillCircleArrayRowToMiddle_(arr, radius + y, radius - x);
                ol.render.canvas.ReplayGroup.fillCircleArrayRowToMiddle_(arr, radius + x, radius - y);

                y++;
                error += 1 + 2 * y;
                if (2 * (error - x) + 1 > 0) {
                    x -= 1;
                    error += 1 - 2 * x;
                }
            }

            ol.render.canvas.ReplayGroup.circleArrayCache_[radius] = arr;
            return arr;
        };


        /**
         * @param {!Object.<string, Array.<*>>} declutterReplays Declutter replays.
         * @param {CanvasRenderingContext2D} context Context.
         * @param {number} rotation Rotation.
         */
        ol.render.canvas.ReplayGroup.replayDeclutter = function(declutterReplays, context, rotation) {
            var zs = Object.keys(declutterReplays).map(Number).sort(ol.array.numberSafeCompareFunction);
            var skippedFeatureUids = {};
            for (var z = 0, zz = zs.length; z < zz; ++z) {
                var replayData = declutterReplays[zs[z].toString()];
                for (var i = 0, ii = replayData.length; i < ii;) {
                    var replay = replayData[i++];
                    var transform = replayData[i++];
                    replay.replay(context, transform, rotation, skippedFeatureUids);
                }
            }
        };


        /**
         * @param {boolean} group Group with previous replay.
         * @return {ol.DeclutterGroup} Declutter instruction group.
         */
        ol.render.canvas.ReplayGroup.prototype.addDeclutter = function(group) {
            var declutter = null;
            if (this.declutterTree_) {
                if (group) {
                    declutter = this.declutterGroup_;
                    /** @type {number} */ (declutter[4])++;
                } else {
                    declutter = this.declutterGroup_ = ol.extent.createEmpty();
                    declutter.push(1);
                }
            }
            return declutter;
        };


        /**
         * @param {CanvasRenderingContext2D} context Context.
         * @param {ol.Transform} transform Transform.
         */
        ol.render.canvas.ReplayGroup.prototype.clip = function(context, transform) {
            var flatClipCoords = this.getClipCoords(transform);
            context.beginPath();
            context.moveTo(flatClipCoords[0], flatClipCoords[1]);
            context.lineTo(flatClipCoords[2], flatClipCoords[3]);
            context.lineTo(flatClipCoords[4], flatClipCoords[5]);
            context.lineTo(flatClipCoords[6], flatClipCoords[7]);
            context.clip();
        };


        /**
         * @param {Array.<ol.render.ReplayType>} replays Replays.
         * @return {boolean} Has replays of the provided types.
         */
        ol.render.canvas.ReplayGroup.prototype.hasReplays = function(replays) {
            for (var zIndex in this.replaysByZIndex_) {
                var candidates = this.replaysByZIndex_[zIndex];
                for (var i = 0, ii = replays.length; i < ii; ++i) {
                    if (replays[i] in candidates) {
                        return true;
                    }
                }
            }
            return false;
        };


        /**
         * FIXME empty description for jsdoc
         */
        ol.render.canvas.ReplayGroup.prototype.finish = function() {
            var zKey;
            for (zKey in this.replaysByZIndex_) {
                var replays = this.replaysByZIndex_[zKey];
                var replayKey;
                for (replayKey in replays) {
                    replays[replayKey].finish();
                }
            }
        };


        /**
         * @param {ol.Coordinate} coordinate Coordinate.
         * @param {number} resolution Resolution.
         * @param {number} rotation Rotation.
         * @param {number} hitTolerance Hit tolerance in pixels.
         * @param {Object.<string, boolean>} skippedFeaturesHash Ids of features
         *     to skip.
         * @param {function((ol.Feature|ol.render.Feature)): T} callback Feature
         *     callback.
         * @param {Object.<string, ol.DeclutterGroup>} declutterReplays Declutter
         *     replays.
         * @return {T|undefined} Callback result.
         * @template T
         */
        ol.render.canvas.ReplayGroup.prototype.forEachFeatureAtCoordinate = function(
            coordinate, resolution, rotation, hitTolerance, skippedFeaturesHash, callback, declutterReplays) {

            hitTolerance = Math.round(hitTolerance);
            var contextSize = hitTolerance * 2 + 1;
            var transform = ol.transform.compose(this.hitDetectionTransform_,
                hitTolerance + 0.5, hitTolerance + 0.5,
                1 / resolution, -1 / resolution,
                -rotation,
                -coordinate[0], -coordinate[1]);
            var context = this.hitDetectionContext_;

            if (context.canvas.width !== contextSize || context.canvas.height !== contextSize) {
                context.canvas.width = contextSize;
                context.canvas.height = contextSize;
            } else {
                context.clearRect(0, 0, contextSize, contextSize);
            }

            /**
             * @type {ol.Extent}
             */
            var hitExtent;
            if (this.renderBuffer_ !== undefined) {
                hitExtent = ol.extent.createEmpty();
                ol.extent.extendCoordinate(hitExtent, coordinate);
                ol.extent.buffer(hitExtent, resolution * (this.renderBuffer_ + hitTolerance), hitExtent);
            }

            var mask = ol.render.canvas.ReplayGroup.getCircleArray_(hitTolerance);
            var declutteredFeatures;
            if (this.declutterTree_) {
                declutteredFeatures = this.declutterTree_.all().map(function(entry) {
                    return entry.value;
                });
            }

            var replayType;

            /**
             * @param {ol.Feature|ol.render.Feature} feature Feature.
             * @return {?} Callback result.
             */
            function featureCallback(feature) {
                var imageData = context.getImageData(0, 0, contextSize, contextSize).data;
                for (var i = 0; i < contextSize; i++) {
                    for (var j = 0; j < contextSize; j++) {
                        if (mask[i][j]) {
                            if (imageData[(j * contextSize + i) * 4 + 3] > 0) {
                                var result;
                                if (!(declutteredFeatures && (replayType == ol.render.ReplayType.IMAGE || replayType == ol.render.ReplayType.TEXT)) ||
                                    declutteredFeatures.indexOf(feature) !== -1) {
                                    result = callback(feature);
                                }
                                if (result) {
                                    return result;
                                } else {
                                    context.clearRect(0, 0, contextSize, contextSize);
                                    return undefined;
                                }
                            }
                        }
                    }
                }
            }

            /** @type {Array.<number>} */
            var zs = Object.keys(this.replaysByZIndex_).map(Number);
            zs.sort(ol.array.numberSafeCompareFunction);

            var i, j, replays, replay, result;
            for (i = zs.length - 1; i >= 0; --i) {
                var zIndexKey = zs[i].toString();
                replays = this.replaysByZIndex_[zIndexKey];
                for (j = ol.render.replay.ORDER.length - 1; j >= 0; --j) {
                    replayType = ol.render.replay.ORDER[j];
                    replay = replays[replayType];
                    if (replay !== undefined) {
                        if (declutterReplays &&
                            (replayType == ol.render.ReplayType.IMAGE || replayType == ol.render.ReplayType.TEXT)) {
                            var declutter = declutterReplays[zIndexKey];
                            if (!declutter) {
                                declutterReplays[zIndexKey] = [replay, transform.slice(0)];
                            } else {
                                declutter.push(replay, transform.slice(0));
                            }
                        } else {
                            result = replay.replayHitDetection(context, transform, rotation,
                                skippedFeaturesHash, featureCallback, hitExtent);
                            if (result) {
                                return result;
                            }
                        }
                    }
                }
            }
            return undefined;
        };


        /**
         * @param {ol.Transform} transform Transform.
         * @return {Array.<number>} Clip coordinates.
         */
        ol.render.canvas.ReplayGroup.prototype.getClipCoords = function(transform) {
            var maxExtent = this.maxExtent_;
            var minX = maxExtent[0];
            var minY = maxExtent[1];
            var maxX = maxExtent[2];
            var maxY = maxExtent[3];
            var flatClipCoords = [minX, minY, minX, maxY, maxX, maxY, maxX, minY];
            ol.geom.flat.transform.transform2D(
                flatClipCoords, 0, 8, 2, transform, flatClipCoords);
            return flatClipCoords;
        };


        /**
         * @inheritDoc
         */
        ol.render.canvas.ReplayGroup.prototype.getReplay = function(zIndex, replayType) {
            var zIndexKey = zIndex !== undefined ? zIndex.toString() : '0';
            var replays = this.replaysByZIndex_[zIndexKey];
            if (replays === undefined) {
                replays = {};
                this.replaysByZIndex_[zIndexKey] = replays;
            }
            var replay = replays[replayType];
            if (replay === undefined) {
                var Constructor = ol.render.canvas.ReplayGroup.BATCH_CONSTRUCTORS_[replayType];
                replay = new Constructor(this.tolerance_, this.maxExtent_,
                    this.resolution_, this.pixelRatio_, this.overlaps_, this.declutterTree_);
                replays[replayType] = replay;
            }
            return replay;
        };


        /**
         * @return {Object.<string, Object.<ol.render.ReplayType, ol.render.canvas.Replay>>} Replays.
         */
        ol.render.canvas.ReplayGroup.prototype.getReplays = function() {
            return this.replaysByZIndex_;
        };


        /**
         * @inheritDoc
         */
        ol.render.canvas.ReplayGroup.prototype.isEmpty = function() {
            return ol.obj.isEmpty(this.replaysByZIndex_);
        };


        /**
         * @param {CanvasRenderingContext2D} context Context.
         * @param {ol.Transform} transform Transform.
         * @param {number} viewRotation View rotation.
         * @param {Object.<string, boolean>} skippedFeaturesHash Ids of features
         *     to skip.
         * @param {Array.<ol.render.ReplayType>=} opt_replayTypes Ordered replay types
         *     to replay. Default is {@link ol.render.replay.ORDER}
         * @param {Object.<string, ol.DeclutterGroup>=} opt_declutterReplays Declutter
         *     replays.
         */
        ol.render.canvas.ReplayGroup.prototype.replay = function(context,
                                                                 transform, viewRotation, skippedFeaturesHash, opt_replayTypes, opt_declutterReplays) {

            /** @type {Array.<number>} */
            var zs = Object.keys(this.replaysByZIndex_).map(Number);
            zs.sort(ol.array.numberSafeCompareFunction);

            // setup clipping so that the parts of over-simplified geometries are not
            // visible outside the current extent when panning
            context.save();
            this.clip(context, transform);

            var replayTypes = opt_replayTypes ? opt_replayTypes : ol.render.replay.ORDER;
            var i, ii, j, jj, replays, replay;
            for (i = 0, ii = zs.length; i < ii; ++i) {
                var zIndexKey = zs[i].toString();
                replays = this.replaysByZIndex_[zIndexKey];
                for (j = 0, jj = replayTypes.length; j < jj; ++j) {
                    var replayType = replayTypes[j];
                    replay = replays[replayType];
                    if (replay !== undefined) {
                        if (opt_declutterReplays &&
                            (replayType == ol.render.ReplayType.IMAGE || replayType == ol.render.ReplayType.TEXT)) {
                            var declutter = opt_declutterReplays[zIndexKey];
                            if (!declutter) {
                                opt_declutterReplays[zIndexKey] = [replay, transform.slice(0)];
                            } else {
                                declutter.push(replay, transform.slice(0));
                            }
                        } else {
                            replay.replay(context, transform, viewRotation, skippedFeaturesHash);
                        }
                    }
                }
            }

            context.restore();
        };


        /**
         * @const
         * @private
         * @type {Object.<ol.render.ReplayType,
     *                function(new: ol.render.canvas.Replay, number, ol.Extent,
     *                number, number, boolean, Array.<ol.DeclutterGroup>)>}
         */
        ol.render.canvas.ReplayGroup.BATCH_CONSTRUCTORS_ = {
            'Circle': ol.render.canvas.PolygonReplay,
            'Default': ol.render.canvas.Replay,
            'Image': ol.render.canvas.ImageReplay,
            'LineString': ol.render.canvas.LineStringReplay,
            'Polygon': ol.render.canvas.PolygonReplay,
            'Text': ol.render.canvas.TextReplay
        };

        ol.renderer = {};
        ol.renderer.vector = {};

        /**
         * @param {ol.Feature|ol.render.Feature} feature1 Feature 1.
         * @param {ol.Feature|ol.render.Feature} feature2 Feature 2.
         * @return {number} Order.
         */
        ol.renderer.vector.defaultOrder = function(feature1, feature2) {
            return ol.getUid(feature1) - ol.getUid(feature2);
        };


        /**
         * @param {number} resolution Resolution.
         * @param {number} pixelRatio Pixel ratio.
         * @return {number} Squared pixel tolerance.
         */
        ol.renderer.vector.getSquaredTolerance = function(resolution, pixelRatio) {
            var tolerance = ol.renderer.vector.getTolerance(resolution, pixelRatio);
            return tolerance * tolerance;
        };


        /**
         * @param {number} resolution Resolution.
         * @param {number} pixelRatio Pixel ratio.
         * @return {number} Pixel tolerance.
         */
        ol.renderer.vector.getTolerance = function(resolution, pixelRatio) {
            return ol.SIMPLIFY_TOLERANCE * resolution / pixelRatio;
        };


        /**
         * @param {ol.render.ReplayGroup} replayGroup Replay group.
         * @param {ol.geom.Circle} geometry Geometry.
         * @param {ol.style.Style} style Style.
         * @param {ol.Feature} feature Feature.
         * @private
         */
        ol.renderer.vector.renderCircleGeometry_ = function(replayGroup, geometry, style, feature) {
            var fillStyle = style.getFill();
            var strokeStyle = style.getStroke();
            if (fillStyle || strokeStyle) {
                var circleReplay = replayGroup.getReplay(
                    style.getZIndex(), ol.render.ReplayType.CIRCLE);
                circleReplay.setFillStrokeStyle(fillStyle, strokeStyle);
                circleReplay.drawCircle(geometry, feature);
            }
            var textStyle = style.getText();
            if (textStyle) {
                var textReplay = replayGroup.getReplay(
                    style.getZIndex(), ol.render.ReplayType.TEXT);
                textReplay.setTextStyle(textStyle, replayGroup.addDeclutter(false));
                textReplay.drawText(geometry, feature);
            }
        };


        /**
         * @param {ol.render.ReplayGroup} replayGroup Replay group.
         * @param {ol.Feature|ol.render.Feature} feature Feature.
         * @param {ol.style.Style} style Style.
         * @param {number} squaredTolerance Squared tolerance.
         * @param {function(this: T, ol.events.Event)} listener Listener function.
         * @param {T} thisArg Value to use as `this` when executing `listener`.
         * @return {boolean} `true` if style is loading.
         * @template T
         */
        ol.renderer.vector.renderFeature = function(
            replayGroup, feature, style, squaredTolerance, listener, thisArg) {
            var loading = false;
            var imageStyle, imageState;
            imageStyle = style.getImage();
            if (imageStyle) {
                imageState = imageStyle.getImageState();
                if (imageState == ol.ImageState.LOADED ||
                    imageState == ol.ImageState.ERROR) {
                    imageStyle.unlistenImageChange(listener, thisArg);
                } else {
                    if (imageState == ol.ImageState.IDLE) {
                        imageStyle.load();
                    }
                    imageState = imageStyle.getImageState();
                    imageStyle.listenImageChange(listener, thisArg);
                    loading = true;
                }
            }
            ol.renderer.vector.renderFeature_(replayGroup, feature, style,
                squaredTolerance);

            return loading;
        };


        /**
         * @param {ol.render.ReplayGroup} replayGroup Replay group.
         * @param {ol.Feature|ol.render.Feature} feature Feature.
         * @param {ol.style.Style} style Style.
         * @param {number} squaredTolerance Squared tolerance.
         * @private
         */
        ol.renderer.vector.renderFeature_ = function(
            replayGroup, feature, style, squaredTolerance) {
            var geometry = style.getGeometryFunction()(feature);
            if (!geometry) {
                return;
            }
            var simplifiedGeometry = geometry.getSimplifiedGeometry(squaredTolerance);
            var renderer = style.getRenderer();
            if (renderer) {
                ol.renderer.vector.renderGeometry_(replayGroup, simplifiedGeometry, style, feature);
            } else {
                var geometryRenderer =
                    ol.renderer.vector.GEOMETRY_RENDERERS_[simplifiedGeometry.getType()];
                geometryRenderer(replayGroup, simplifiedGeometry, style, feature);
            }
        };


        /**
         * @param {ol.render.ReplayGroup} replayGroup Replay group.
         * @param {ol.geom.Geometry} geometry Geometry.
         * @param {ol.style.Style} style Style.
         * @param {ol.Feature|ol.render.Feature} feature Feature.
         * @private
         */
        ol.renderer.vector.renderGeometry_ = function(replayGroup, geometry, style, feature) {
            if (geometry.getType() == ol.geom.GeometryType.GEOMETRY_COLLECTION) {
                var geometries = /** @type {ol.geom.GeometryCollection} */ (geometry).getGeometries();
                for (var i = 0, ii = geometries.length; i < ii; ++i) {
                    ol.renderer.vector.renderGeometry_(replayGroup, geometries[i], style, feature);
                }
                return;
            }
            var replay = replayGroup.getReplay(style.getZIndex(), ol.render.ReplayType.DEFAULT);
            replay.drawCustom(/** @type {ol.geom.SimpleGeometry} */ (geometry), feature, style.getRenderer());
        };


        /**
         * @param {ol.render.ReplayGroup} replayGroup Replay group.
         * @param {ol.geom.GeometryCollection} geometry Geometry.
         * @param {ol.style.Style} style Style.
         * @param {ol.Feature} feature Feature.
         * @private
         */
        ol.renderer.vector.renderGeometryCollectionGeometry_ = function(replayGroup, geometry, style, feature) {
            var geometries = geometry.getGeometriesArray();
            var i, ii;
            for (i = 0, ii = geometries.length; i < ii; ++i) {
                var geometryRenderer =
                    ol.renderer.vector.GEOMETRY_RENDERERS_[geometries[i].getType()];
                geometryRenderer(replayGroup, geometries[i], style, feature);
            }
        };


        /**
         * @param {ol.render.ReplayGroup} replayGroup Replay group.
         * @param {ol.geom.LineString|ol.render.Feature} geometry Geometry.
         * @param {ol.style.Style} style Style.
         * @param {ol.Feature|ol.render.Feature} feature Feature.
         * @private
         */
        ol.renderer.vector.renderLineStringGeometry_ = function(replayGroup, geometry, style, feature) {
            var strokeStyle = style.getStroke();
            if (strokeStyle) {
                var lineStringReplay = replayGroup.getReplay(
                    style.getZIndex(), ol.render.ReplayType.LINE_STRING);
                lineStringReplay.setFillStrokeStyle(null, strokeStyle);
                lineStringReplay.drawLineString(geometry, feature);
            }
            var textStyle = style.getText();
            if (textStyle) {
                var textReplay = replayGroup.getReplay(
                    style.getZIndex(), ol.render.ReplayType.TEXT);
                textReplay.setTextStyle(textStyle, replayGroup.addDeclutter(false));
                textReplay.drawText(geometry, feature);
            }
        };


        /**
         * @param {ol.render.ReplayGroup} replayGroup Replay group.
         * @param {ol.geom.MultiLineString|ol.render.Feature} geometry Geometry.
         * @param {ol.style.Style} style Style.
         * @param {ol.Feature|ol.render.Feature} feature Feature.
         * @private
         */
        ol.renderer.vector.renderMultiLineStringGeometry_ = function(replayGroup, geometry, style, feature) {
            var strokeStyle = style.getStroke();
            if (strokeStyle) {
                var lineStringReplay = replayGroup.getReplay(
                    style.getZIndex(), ol.render.ReplayType.LINE_STRING);
                lineStringReplay.setFillStrokeStyle(null, strokeStyle);
                lineStringReplay.drawMultiLineString(geometry, feature);
            }
            var textStyle = style.getText();
            if (textStyle) {
                var textReplay = replayGroup.getReplay(
                    style.getZIndex(), ol.render.ReplayType.TEXT);
                textReplay.setTextStyle(textStyle, replayGroup.addDeclutter(false));
                textReplay.drawText(geometry, feature);
            }
        };


        /**
         * @param {ol.render.ReplayGroup} replayGroup Replay group.
         * @param {ol.geom.MultiPolygon} geometry Geometry.
         * @param {ol.style.Style} style Style.
         * @param {ol.Feature} feature Feature.
         * @private
         */
        ol.renderer.vector.renderMultiPolygonGeometry_ = function(replayGroup, geometry, style, feature) {
            var fillStyle = style.getFill();
            var strokeStyle = style.getStroke();
            if (strokeStyle || fillStyle) {
                var polygonReplay = replayGroup.getReplay(
                    style.getZIndex(), ol.render.ReplayType.POLYGON);
                polygonReplay.setFillStrokeStyle(fillStyle, strokeStyle);
                polygonReplay.drawMultiPolygon(geometry, feature);
            }
            var textStyle = style.getText();
            if (textStyle) {
                var textReplay = replayGroup.getReplay(
                    style.getZIndex(), ol.render.ReplayType.TEXT);
                textReplay.setTextStyle(textStyle, replayGroup.addDeclutter(false));
                textReplay.drawText(geometry, feature);
            }
        };


        /**
         * @param {ol.render.ReplayGroup} replayGroup Replay group.
         * @param {ol.geom.Point|ol.render.Feature} geometry Geometry.
         * @param {ol.style.Style} style Style.
         * @param {ol.Feature|ol.render.Feature} feature Feature.
         * @private
         */
        ol.renderer.vector.renderPointGeometry_ = function(replayGroup, geometry, style, feature) {
            var imageStyle = style.getImage();
            if (imageStyle) {
                if (imageStyle.getImageState() != ol.ImageState.LOADED) {
                    return;
                }
                var imageReplay = replayGroup.getReplay(
                    style.getZIndex(), ol.render.ReplayType.IMAGE);
                imageReplay.setImageStyle(imageStyle, replayGroup.addDeclutter(false));
                imageReplay.drawPoint(geometry, feature);
            }
            var textStyle = style.getText();
            if (textStyle) {
                var textReplay = replayGroup.getReplay(
                    style.getZIndex(), ol.render.ReplayType.TEXT);
                textReplay.setTextStyle(textStyle, replayGroup.addDeclutter(!!imageStyle));
                textReplay.drawText(geometry, feature);
            }
        };


        /**
         * @param {ol.render.ReplayGroup} replayGroup Replay group.
         * @param {ol.geom.MultiPoint|ol.render.Feature} geometry Geometry.
         * @param {ol.style.Style} style Style.
         * @param {ol.Feature|ol.render.Feature} feature Feature.
         * @private
         */
        ol.renderer.vector.renderMultiPointGeometry_ = function(replayGroup, geometry, style, feature) {
            var imageStyle = style.getImage();
            if (imageStyle) {
                if (imageStyle.getImageState() != ol.ImageState.LOADED) {
                    return;
                }
                var imageReplay = replayGroup.getReplay(
                    style.getZIndex(), ol.render.ReplayType.IMAGE);
                imageReplay.setImageStyle(imageStyle, replayGroup.addDeclutter(false));
                imageReplay.drawMultiPoint(geometry, feature);
            }
            var textStyle = style.getText();
            if (textStyle) {
                var textReplay = replayGroup.getReplay(
                    style.getZIndex(), ol.render.ReplayType.TEXT);
                textReplay.setTextStyle(textStyle, replayGroup.addDeclutter(!!imageStyle));
                textReplay.drawText(geometry, feature);
            }
        };


        /**
         * @param {ol.render.ReplayGroup} replayGroup Replay group.
         * @param {ol.geom.Polygon|ol.render.Feature} geometry Geometry.
         * @param {ol.style.Style} style Style.
         * @param {ol.Feature|ol.render.Feature} feature Feature.
         * @private
         */
        ol.renderer.vector.renderPolygonGeometry_ = function(replayGroup, geometry, style, feature) {
            var fillStyle = style.getFill();
            var strokeStyle = style.getStroke();
            if (fillStyle || strokeStyle) {
                var polygonReplay = replayGroup.getReplay(
                    style.getZIndex(), ol.render.ReplayType.POLYGON);
                polygonReplay.setFillStrokeStyle(fillStyle, strokeStyle);
                polygonReplay.drawPolygon(geometry, feature);
            }
            var textStyle = style.getText();
            if (textStyle) {
                var textReplay = replayGroup.getReplay(
                    style.getZIndex(), ol.render.ReplayType.TEXT);
                textReplay.setTextStyle(textStyle, replayGroup.addDeclutter(false));
                textReplay.drawText(geometry, feature);
            }
        };


        /**
         * @const
         * @private
         * @type {Object.<ol.geom.GeometryType,
     *                function(ol.render.ReplayGroup, ol.geom.Geometry,
     *                         ol.style.Style, Object)>}
         */
        ol.renderer.vector.GEOMETRY_RENDERERS_ = {
            'Point': ol.renderer.vector.renderPointGeometry_,
            'LineString': ol.renderer.vector.renderLineStringGeometry_,
            'Polygon': ol.renderer.vector.renderPolygonGeometry_,
            'MultiPoint': ol.renderer.vector.renderMultiPointGeometry_,
            'MultiLineString': ol.renderer.vector.renderMultiLineStringGeometry_,
            'MultiPolygon': ol.renderer.vector.renderMultiPolygonGeometry_,
            'GeometryCollection': ol.renderer.vector.renderGeometryCollectionGeometry_,
            'Circle': ol.renderer.vector.renderCircleGeometry_
        };

    var spriteImageCanvas = {};

    var mvtStyleClass = new MvtStyle(ol, true);
    var mvtRenderer2D = new MvtRenderer2D({
        mvtStyle: mvtStyleClass,
        openlayer: ol,
        useOffscreen: true
    });

    function MVTWorker(parameters, transferableObjects) {
        var canvas = new OffscreenCanvas(parameters.canvasWidth, parameters.canvasWidth);
        var idCanvas = new OffscreenCanvas(parameters.canvasWidth, parameters.canvasWidth);
        var pbfData = parameters.pbfData;
        var layers = parameters.layers;
        var transform = parameters.transform;
        var squaredTolerance = parameters.squaredTolerance;
        var spriteImageDatas = parameters.spriteImageDatas;
        var keepProperties = parameters.keepProperties;
        var tileLevel = parameters.tileLevel;
        var needSourceLayerNames = parameters.needSourceLayerNames;
        var selectEnabled = parameters.selectEnabled;
        var featureProperties = {};

        try {
            var mvtParser = new ol.format.MVT({
                featureClass: ol.Feature
            });
            var features = mvtParser.readFeatures(pbfData, {
                needSourceLayerNames: needSourceLayerNames
            });
            var renderResult = mvtRenderer2D.renderFeatures({
                colorCanvas: canvas,
                idCanvas: idCanvas,
                transform: transform,
                layers: layers,
                features: features,
                tileLevel: tileLevel,
                spriteImageCanvas: spriteImageCanvas,
                spriteImageDatas: spriteImageDatas,
                squaredTolerance: squaredTolerance,
                selectEnabled: selectEnabled,
                showBillboard: false
            });

            if (keepProperties) {
                var featuresToRender = renderResult.idFeatures;
                var featuresToRenderLength = featuresToRender.length;
                for (var i = 0; i < featuresToRenderLength; i++) {
                    var feature = featuresToRender[i];
                    var featureID = getFeatureID$1(feature);
                    var propertiesWithoutGeometry = feature.getProperties();
                    if (when.defined(propertiesWithoutGeometry.geometry)) {
                        delete propertiesWithoutGeometry.geometry;
                    }
                    featureProperties[featureID] = propertiesWithoutGeometry;
                }
            }
        }
        catch (err) {
        }

        var imageBitmap = canvas.transferToImageBitmap();
        var idImageBitmap = selectEnabled ? idCanvas.transferToImageBitmap() : null;
        transferableObjects.push(imageBitmap);
        return {
            buffer: imageBitmap,
            idBuffer: idImageBitmap,
            properties: featureProperties
        };
    }

    function getFeatureID$1(feature) {
        var id = feature.getId();
        // 只在颜色中记录256*256*256这么大范围的ID，超过这个范围的ID舍去
        var discard = Math.floor(id / 16777216);
        id = id - discard * 16777216;
        return id;
    }

    var MVTWorker$1 = createTaskProcessorWorker(MVTWorker);

    return MVTWorker$1;

});

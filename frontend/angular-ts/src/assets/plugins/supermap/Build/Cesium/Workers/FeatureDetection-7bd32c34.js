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

    var _supportsFullscreen;
        var _names = {
            requestFullscreen : undefined,
            exitFullscreen : undefined,
            fullscreenEnabled : undefined,
            fullscreenElement : undefined,
            fullscreenchange : undefined,
            fullscreenerror : undefined
        };

        /**
         * Browser-independent functions for working with the standard fullscreen API.
         *
         * @exports Fullscreen
         * @namespace
         *
         * @see {@link http://dvcs.w3.org/hg/fullscreen/raw-file/tip/Overview.html|W3C Fullscreen Living Specification}
         */
        var Fullscreen = {};

        Object.defineProperties(Fullscreen, {
            /**
             * The element that is currently fullscreen, if any.  To simply check if the
             * browser is in fullscreen mode or not, use {@link Fullscreen#fullscreen}.
             * @memberof Fullscreen
             * @type {Object}
             * @readonly
             */
            element : {
                get : function() {
                    if (!Fullscreen.supportsFullscreen()) {
                        return undefined;
                    }

                    return document[_names.fullscreenElement];
                }
            },

            /**
             * The name of the event on the document that is fired when fullscreen is
             * entered or exited.  This event name is intended for use with addEventListener.
             * In your event handler, to determine if the browser is in fullscreen mode or not,
             * use {@link Fullscreen#fullscreen}.
             * @memberof Fullscreen
             * @type {String}
             * @readonly
             */
            changeEventName : {
                get : function() {
                    if (!Fullscreen.supportsFullscreen()) {
                        return undefined;
                    }

                    return _names.fullscreenchange;
                }
            },

            /**
             * The name of the event that is fired when a fullscreen error
             * occurs.  This event name is intended for use with addEventListener.
             * @memberof Fullscreen
             * @type {String}
             * @readonly
             */
            errorEventName : {
                get : function() {
                    if (!Fullscreen.supportsFullscreen()) {
                        return undefined;
                    }

                    return _names.fullscreenerror;
                }
            },

            /**
             * Determine whether the browser will allow an element to be made fullscreen, or not.
             * For example, by default, iframes cannot go fullscreen unless the containing page
             * adds an "allowfullscreen" attribute (or prefixed equivalent).
             * @memberof Fullscreen
             * @type {Boolean}
             * @readonly
             */
            enabled : {
                get : function() {
                    if (!Fullscreen.supportsFullscreen()) {
                        return undefined;
                    }

                    return document[_names.fullscreenEnabled];
                }
            },

            /**
             * Determines if the browser is currently in fullscreen mode.
             * @memberof Fullscreen
             * @type {Boolean}
             * @readonly
             */
            fullscreen : {
                get : function() {
                    if (!Fullscreen.supportsFullscreen()) {
                        return undefined;
                    }

                    return Fullscreen.element !== null;
                }
            }
        });

        /**
         * Detects whether the browser supports the standard fullscreen API.
         *
         * @returns {Boolean} <code>true</code> if the browser supports the standard fullscreen API,
         * <code>false</code> otherwise.
         */
        Fullscreen.supportsFullscreen = function() {
            if (when.defined(_supportsFullscreen)) {
                return _supportsFullscreen;
            }

            _supportsFullscreen = false;

            var body = document.body;
            if (typeof body.requestFullscreen === 'function') {
                // go with the unprefixed, standard set of names
                _names.requestFullscreen = 'requestFullscreen';
                _names.exitFullscreen = 'exitFullscreen';
                _names.fullscreenEnabled = 'fullscreenEnabled';
                _names.fullscreenElement = 'fullscreenElement';
                _names.fullscreenchange = 'fullscreenchange';
                _names.fullscreenerror = 'fullscreenerror';
                _supportsFullscreen = true;
                return _supportsFullscreen;
            }

            //check for the correct combination of prefix plus the various names that browsers use
            var prefixes = ['webkit', 'moz', 'o', 'ms', 'khtml'];
            var name;
            for (var i = 0, len = prefixes.length; i < len; ++i) {
                var prefix = prefixes[i];

                // casing of Fullscreen differs across browsers
                name = prefix + 'RequestFullscreen';
                if (typeof body[name] === 'function') {
                    _names.requestFullscreen = name;
                    _supportsFullscreen = true;
                } else {
                    name = prefix + 'RequestFullScreen';
                    if (typeof body[name] === 'function') {
                        _names.requestFullscreen = name;
                        _supportsFullscreen = true;
                    }
                }

                // disagreement about whether it's "exit" as per spec, or "cancel"
                name = prefix + 'ExitFullscreen';
                if (typeof document[name] === 'function') {
                    _names.exitFullscreen = name;
                } else {
                    name = prefix + 'CancelFullScreen';
                    if (typeof document[name] === 'function') {
                        _names.exitFullscreen = name;
                    }
                }

                // casing of Fullscreen differs across browsers
                name = prefix + 'FullscreenEnabled';
                if (document[name] !== undefined) {
                    _names.fullscreenEnabled = name;
                } else {
                    name = prefix + 'FullScreenEnabled';
                    if (document[name] !== undefined) {
                        _names.fullscreenEnabled = name;
                    }
                }

                // casing of Fullscreen differs across browsers
                name = prefix + 'FullscreenElement';
                if (document[name] !== undefined) {
                    _names.fullscreenElement = name;
                } else {
                    name = prefix + 'FullScreenElement';
                    if (document[name] !== undefined) {
                        _names.fullscreenElement = name;
                    }
                }

                // thankfully, event names are all lowercase per spec
                name = prefix + 'fullscreenchange';
                // event names do not have 'on' in the front, but the property on the document does
                if (document['on' + name] !== undefined) {
                    //except on IE
                    if (prefix === 'ms') {
                        name = 'MSFullscreenChange';
                    }
                    _names.fullscreenchange = name;
                }

                name = prefix + 'fullscreenerror';
                if (document['on' + name] !== undefined) {
                    //except on IE
                    if (prefix === 'ms') {
                        name = 'MSFullscreenError';
                    }
                    _names.fullscreenerror = name;
                }
            }

            return _supportsFullscreen;
        };

        /**
         * Asynchronously requests the browser to enter fullscreen mode on the given element.
         * If fullscreen mode is not supported by the browser, does nothing.
         *
         * @param {Object} element The HTML element which will be placed into fullscreen mode.
         * @param {HMDVRDevice} [vrDevice] The VR device.
         *
         * @example
         * // Put the entire page into fullscreen.
         * Cesium.Fullscreen.requestFullscreen(document.body)
         *
         * // Place only the Cesium canvas into fullscreen.
         * Cesium.Fullscreen.requestFullscreen(scene.canvas)
         */
        Fullscreen.requestFullscreen = function(element, vrDevice) {
            if (!Fullscreen.supportsFullscreen()) {
                return;
            }

            element[_names.requestFullscreen]({ vrDisplay: vrDevice });
        };

        /**
         * Asynchronously exits fullscreen mode.  If the browser is not currently
         * in fullscreen, or if fullscreen mode is not supported by the browser, does nothing.
         */
        Fullscreen.exitFullscreen = function() {
            if (!Fullscreen.supportsFullscreen()) {
                return;
            }

            document[_names.exitFullscreen]();
        };

        //For unit tests
        Fullscreen._names = _names;

    var theNavigator;
    if (typeof navigator !== 'undefined') {
        theNavigator = navigator;
    } else {
        theNavigator = {};
    }

    function extractVersion(versionString) {
        var parts = versionString.split('.');
        for (var i = 0, len = parts.length; i < len; ++i) {
            parts[i] = parseInt(parts[i], 10);
        }
        return parts;
    }

    var isChromeResult;
    var chromeVersionResult;
    function isChrome() {
        if (!when.defined(isChromeResult)) {
            isChromeResult = false;
            // Edge contains Chrome in the user agent too
            if (!isEdge()) {
                var fields = (/ Chrome\/([\.0-9]+)/).exec(theNavigator.userAgent);
                if (fields !== null) {
                    isChromeResult = true;
                    chromeVersionResult = extractVersion(fields[1]);
                }
            }
        }

        return isChromeResult;
    }

    function chromeVersion() {
        return isChrome() && chromeVersionResult;
    }

    var isSafariResult;
    var safariVersionResult;
    function isSafari() {
        if (!when.defined(isSafariResult)) {
            isSafariResult = false;

            // Chrome and Edge contain Safari in the user agent too
            if (!isChrome() && !isEdge() && (/ Safari\/[\.0-9]+/).test(theNavigator.userAgent)) {
                var fields = (/ Version\/([\.0-9]+)/).exec(theNavigator.userAgent);
                if (fields !== null) {
                    isSafariResult = true;
                    safariVersionResult = extractVersion(fields[1]);
                }
            }
        }

        return isSafariResult;
    }

    function safariVersion() {
        return isSafari() && safariVersionResult;
    }

    var isWebkitResult;
    var webkitVersionResult;
    function isWebkit() {
        if (!when.defined(isWebkitResult)) {
            isWebkitResult = false;

            var fields = (/ AppleWebKit\/([\.0-9]+)(\+?)/).exec(theNavigator.userAgent);
            if (fields !== null) {
                isWebkitResult = true;
                webkitVersionResult = extractVersion(fields[1]);
                webkitVersionResult.isNightly = !!fields[2];
            }
        }

        return isWebkitResult;
    }

    function webkitVersion() {
        return isWebkit() && webkitVersionResult;
    }

    var isInternetExplorerResult;
    var internetExplorerVersionResult;
    function isInternetExplorer() {
        if (!when.defined(isInternetExplorerResult)) {
            isInternetExplorerResult = false;

            var fields;
            if (theNavigator.appName === 'Microsoft Internet Explorer') {
                fields = /MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(theNavigator.userAgent);
                if (fields !== null) {
                    isInternetExplorerResult = true;
                    internetExplorerVersionResult = extractVersion(fields[1]);
                }
            } else if (theNavigator.appName === 'Netscape') {
                fields = /Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.exec(theNavigator.userAgent);
                if (fields !== null) {
                    isInternetExplorerResult = true;
                    internetExplorerVersionResult = extractVersion(fields[1]);
                }
            }
        }
        return isInternetExplorerResult;
    }

    function internetExplorerVersion() {
        return isInternetExplorer() && internetExplorerVersionResult;
    }

    var isEdgeResult;
    var edgeVersionResult;
    function isEdge() {
        if (!when.defined(isEdgeResult)) {
            isEdgeResult = false;
            var fields = (/ Edge\/([\.0-9]+)/).exec(theNavigator.userAgent);
            if (fields !== null) {
                isEdgeResult = true;
                edgeVersionResult = extractVersion(fields[1]);
            }
        }
        return isEdgeResult;
    }

    function edgeVersion() {
        return isEdge() && edgeVersionResult;
    }

    var isFirefoxResult;
    var firefoxVersionResult;
    function isFirefox() {
        if (!when.defined(isFirefoxResult)) {
            isFirefoxResult = false;

            var fields = /Firefox\/([\.0-9]+)/.exec(theNavigator.userAgent);
            if (fields !== null) {
                isFirefoxResult = true;
                firefoxVersionResult = extractVersion(fields[1]);
            }
        }
        return isFirefoxResult;
    }

    var isWindowsResult;
    function isWindows() {
        if (!when.defined(isWindowsResult)) {
            isWindowsResult = /Windows/i.test(theNavigator.appVersion);
        }
        return isWindowsResult;
    }

    function firefoxVersion() {
        return isFirefox() && firefoxVersionResult;
    }

    var isNodeJsResult;
    function isNodeJs() {
        if (!when.defined(isNodeJsResult)) {
            isNodeJsResult = typeof process === 'object' && Object.prototype.toString.call(process) === '[object process]'; // eslint-disable-line
        }
        return isNodeJsResult;
    }

    var hasPointerEvents;
    function supportsPointerEvents() {
        if (!when.defined(hasPointerEvents)) {
            //While navigator.pointerEnabled is deprecated in the W3C specification
            //we still need to use it if it exists in order to support browsers
            //that rely on it, such as the Windows WebBrowser control which defines
            //PointerEvent but sets navigator.pointerEnabled to false.

            //Firefox disabled because of https://github.com/AnalyticalGraphicsInc/cesium/issues/6372
            hasPointerEvents = !isFirefox() && typeof PointerEvent !== 'undefined' && (!when.defined(theNavigator.pointerEnabled) || theNavigator.pointerEnabled);
        }
        return hasPointerEvents;
    }

    var imageRenderingValueResult;
    var supportsImageRenderingPixelatedResult;
    function supportsImageRenderingPixelated() {
        if (!when.defined(supportsImageRenderingPixelatedResult)) {
            var canvas = document.createElement('canvas');
            canvas.setAttribute('style',
                'image-rendering: -moz-crisp-edges;' +
                'image-rendering: pixelated;');
            //canvas.style.imageRendering will be undefined, null or an empty string on unsupported browsers.
            var tmp = canvas.style.imageRendering;
            supportsImageRenderingPixelatedResult = when.defined(tmp) && tmp !== '';
            if (supportsImageRenderingPixelatedResult) {
                imageRenderingValueResult = tmp;
            }
        }
        return supportsImageRenderingPixelatedResult;
    }

    function imageRenderingValue() {
        return supportsImageRenderingPixelated() ? imageRenderingValueResult : undefined;
    }

    var supportsWebPResult;
    var supportsWebPPromise;
    function supportsWebP() {
        // From https://developers.google.com/speed/webp/faq#how_can_i_detect_browser_support_for_webp
        if (when.defined(supportsWebPPromise)) {
            return supportsWebPPromise.promise;
        }

        supportsWebPPromise = when.when.defer();
        if (isEdge()) {
            // Edge's WebP support with WebGL is incomplete.
            // See bug report: https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/19221241/
            supportsWebPResult = false;
            supportsWebPPromise.resolve(supportsWebPResult);
        }

        var image = new Image();
        image.onload = function () {
            supportsWebPResult = (image.width > 0) && (image.height > 0);
            supportsWebPPromise.resolve(supportsWebPResult);
        };

        image.onerror = function () {
            supportsWebPResult = false;
            supportsWebPPromise.resolve(supportsWebPResult);
        };

        image.src = 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA';

        return supportsWebPPromise.promise;
    }

    function supportsWebPSync() {
        if (!when.defined(supportsWebPPromise)) {
            supportsWebP();
        }
        return supportsWebPResult;
    }

    var typedArrayTypes = [];
    if (typeof ArrayBuffer !== 'undefined') {
        typedArrayTypes.push(Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array);

        if (typeof Uint8ClampedArray !== 'undefined') {
            typedArrayTypes.push(Uint8ClampedArray);
        }

        if (typeof CanvasPixelArray !== 'undefined') {
            typedArrayTypes.push(CanvasPixelArray);
        }
    }

    /**
     * A set of functions to detect whether the current browser supports
     * various features.
     *
     * @exports FeatureDetection
     */
    var FeatureDetection = {
        isChrome : isChrome,
        chromeVersion : chromeVersion,
        isSafari : isSafari,
        safariVersion : safariVersion,
        isWebkit : isWebkit,
        webkitVersion : webkitVersion,
        isInternetExplorer : isInternetExplorer,
        internetExplorerVersion : internetExplorerVersion,
        isEdge : isEdge,
        edgeVersion : edgeVersion,
        isFirefox : isFirefox,
        firefoxVersion : firefoxVersion,
        isWindows : isWindows,
        isNodeJs : isNodeJs,
        hardwareConcurrency : when.defaultValue(theNavigator.hardwareConcurrency, 3),
        supportsPointerEvents : supportsPointerEvents,
        supportsImageRenderingPixelated: supportsImageRenderingPixelated,
        supportsWebP: supportsWebP,
        supportsWebPSync: supportsWebPSync,
        imageRenderingValue: imageRenderingValue,
        typedArrayTypes: typedArrayTypes,
        isPCBroswer : isPCBroswer
    };

    /**
     * Detects whether the current browser supports the full screen standard.
     *
     * @returns {Boolean} true if the browser supports the full screen standard, false if not.
     *
     * @see Fullscreen
     * @see {@link http://dvcs.w3.org/hg/fullscreen/raw-file/tip/Overview.html|W3C Fullscreen Living Specification}
     */
    FeatureDetection.supportsFullscreen = function() {
        return Fullscreen.supportsFullscreen();
    };

    /**
     * Detects whether the current browser supports typed arrays.
     *
     * @returns {Boolean} true if the browser supports typed arrays, false if not.
     *
     * @see {@link http://www.khronos.org/registry/typedarray/specs/latest/|Typed Array Specification}
     */
    FeatureDetection.supportsTypedArrays = function() {
        return typeof ArrayBuffer !== 'undefined';
    };

    /**
     * Detects whether the current browser supports Web Workers.
     *
     * @returns {Boolean} true if the browsers supports Web Workers, false if not.
     *
     * @see {@link http://www.w3.org/TR/workers/}
     */
    FeatureDetection.supportsWebWorkers = function() {
        return typeof Worker !== 'undefined';
    };

    /**
     * Detects whether the current browser supports Web Assembly.
     *
     * @returns {Boolean} true if the browsers supports Web Assembly, false if not.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/WebAssembly}
     */
    FeatureDetection.supportsWebAssembly = function() {
        return typeof WebAssembly !== 'undefined' && !FeatureDetection.isEdge();
    };

    /**
     * Detects whether the current browser supports OffscreenCanvas.
     * @returns {Boolean} true if the browsers supports OffscreenCanvas, false if not.
     */
    FeatureDetection.supportsOffscreenCanvas = function() {
        return typeof OffscreenCanvas !== 'undefined' && !FeatureDetection.isEdge();
    };

    function isPCBroswer() {
        var sUserAgent = window.navigator.userAgent.toLowerCase();
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) == "android";
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
        if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
            return false;
        } else {
            return true;
        }
    }

    exports.FeatureDetection = FeatureDetection;

});

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
define(['exports', './when-8d13db60', './Check-70bec281', './Math-61ede240', './FeatureDetection-7bd32c34'], function (exports, when, Check, _Math, FeatureDetection) { 'use strict';

    function hue2rgb(m1, m2, h) {
            if (h < 0) {
                h += 1;
            }
            if (h > 1) {
                h -= 1;
            }
            if (h * 6 < 1) {
                return m1 + (m2 - m1) * 6 * h;
            }
            if (h * 2 < 1) {
                return m2;
            }
            if (h * 3 < 2) {
                return m1 + (m2 - m1) * (2 / 3 - h) * 6;
            }
            return m1;
        }

        /**
         * A color, specified using red, green, blue, and alpha values,
         * which range from <code>0</code> (no intensity) to <code>1.0</code> (full intensity).
         * @param {Number} [red=1.0] The red component.
         * @param {Number} [green=1.0] The green component.
         * @param {Number} [blue=1.0] The blue component.
         * @param {Number} [alpha=1.0] The alpha component.
         *
         * @constructor
         * @alias Color
         *
         * @see Packable
         */
        function Color(red, green, blue, alpha) {
            /**
             * The red component.
             * @type {Number}
             * @default 1.0
             */
            this.red = when.defaultValue(red, 1.0);
            /**
             * The green component.
             * @type {Number}
             * @default 1.0
             */
            this.green = when.defaultValue(green, 1.0);
            /**
             * The blue component.
             * @type {Number}
             * @default 1.0
             */
            this.blue = when.defaultValue(blue, 1.0);
            /**
             * The alpha component.
             * @type {Number}
             * @default 1.0
             */
            this.alpha = when.defaultValue(alpha, 1.0);
        }

        /**
         * Creates a Color instance from a {@link Cartesian4}. <code>x</code>, <code>y</code>, <code>z</code>,
         * and <code>w</code> map to <code>red</code>, <code>green</code>, <code>blue</code>, and <code>alpha</code>, respectively.
         *
         * @param {Cartesian4} cartesian The source cartesian.
         * @param {Color} [result] The object onto which to store the result.
         * @returns {Color} The modified result parameter or a new Color instance if one was not provided.
         */
        Color.fromCartesian4 = function(cartesian, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('cartesian', cartesian);
            //>>includeEnd('debug');

            if (!when.defined(result)) {
                return new Color(cartesian.x, cartesian.y, cartesian.z, cartesian.w);
            }

            result.red = cartesian.x;
            result.green = cartesian.y;
            result.blue = cartesian.z;
            result.alpha = cartesian.w;
            return result;
        };

        /**
         * Creates a new Color specified using red, green, blue, and alpha values
         * that are in the range of 0 to 255, converting them internally to a range of 0.0 to 1.0.
         *
         * @param {Number} [red=255] The red component.
         * @param {Number} [green=255] The green component.
         * @param {Number} [blue=255] The blue component.
         * @param {Number} [alpha=255] The alpha component.
         * @param {Color} [result] The object onto which to store the result.
         * @returns {Color} The modified result parameter or a new Color instance if one was not provided.
         */
        Color.fromBytes = function(red, green, blue, alpha, result) {
            red = Color.byteToFloat(when.defaultValue(red, 255.0));
            green = Color.byteToFloat(when.defaultValue(green, 255.0));
            blue = Color.byteToFloat(when.defaultValue(blue, 255.0));
            alpha = Color.byteToFloat(when.defaultValue(alpha, 255.0));

            if (!when.defined(result)) {
                return new Color(red, green, blue, alpha);
            }

            result.red = red;
            result.green = green;
            result.blue = blue;
            result.alpha = alpha;
            return result;
        };

        /**
         * Creates a new Color that has the same red, green, and blue components
         * of the specified color, but with the specified alpha value.
         *
         * @param {Color} color The base color
         * @param {Number} alpha The new alpha component.
         * @param {Color} [result] The object onto which to store the result.
         * @returns {Color} The modified result parameter or a new Color instance if one was not provided.
         *
         * @example var translucentRed = Cesium.Color.fromAlpha(Cesium.Color.RED, 0.9);
         */
        Color.fromAlpha = function(color, alpha, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('color', color);
            Check.Check.typeOf.number('alpha', alpha);
            //>>includeEnd('debug');

            if (!when.defined(result)) {
                return new Color(color.red, color.green, color.blue, alpha);
            }

            result.red = color.red;
            result.green = color.green;
            result.blue = color.blue;
            result.alpha = alpha;
            return result;
        };

        var scratchArrayBuffer;
        var scratchUint32Array;
        var scratchUint8Array;
        if (FeatureDetection.FeatureDetection.supportsTypedArrays()) {
            scratchArrayBuffer = new ArrayBuffer(4);
            scratchUint32Array = new Uint32Array(scratchArrayBuffer);
            scratchUint8Array = new Uint8Array(scratchArrayBuffer);
        }

        /**
         * Creates a new Color from a single numeric unsigned 32-bit RGBA value, using the endianness
         * of the system.
         *
         * @param {Number} rgba A single numeric unsigned 32-bit RGBA value.
         * @param {Color} [result] The object to store the result in, if undefined a new instance will be created.
         * @returns {Color} The color object.
         *
         * @example
         * var color = Cesium.Color.fromRgba(0x67ADDFFF);
         *
         * @see Color#toRgba
         */
        Color.fromRgba = function(rgba, result) {
            // scratchUint32Array and scratchUint8Array share an underlying array buffer
            scratchUint32Array[0] = rgba;
            return Color.fromBytes(scratchUint8Array[0], scratchUint8Array[1], scratchUint8Array[2], scratchUint8Array[3], result);
        };

        Color.byteToRgba = function(red, green, blue, alpha) {
            scratchUint8Array[0] = red;
            scratchUint8Array[1] = green;
            scratchUint8Array[2] = blue;
            scratchUint8Array[3] = alpha;
            return scratchUint32Array[0];
        };

        /**
         * Creates a Color instance from hue, saturation, and lightness.
         *
         * @param {Number} [hue=0] The hue angle 0...1
         * @param {Number} [saturation=0] The saturation value 0...1
         * @param {Number} [lightness=0] The lightness value 0...1
         * @param {Number} [alpha=1.0] The alpha component 0...1
         * @param {Color} [result] The object to store the result in, if undefined a new instance will be created.
         * @returns {Color} The color object.
         *
         * @see {@link http://www.w3.org/TR/css3-color/#hsl-color|CSS color values}
         */
        Color.fromHsl = function(hue, saturation, lightness, alpha, result) {
            hue = when.defaultValue(hue, 0.0) % 1.0;
            saturation = when.defaultValue(saturation, 0.0);
            lightness = when.defaultValue(lightness, 0.0);
            alpha = when.defaultValue(alpha, 1.0);

            var red = lightness;
            var green = lightness;
            var blue = lightness;

            if (saturation !== 0) {
                var m2;
                if (lightness < 0.5) {
                    m2 = lightness * (1 + saturation);
                } else {
                    m2 = lightness + saturation - lightness * saturation;
                }

                var m1 = 2.0 * lightness - m2;
                red = hue2rgb(m1, m2, hue + 1 / 3);
                green = hue2rgb(m1, m2, hue);
                blue = hue2rgb(m1, m2, hue - 1 / 3);
            }

            if (!when.defined(result)) {
                return new Color(red, green, blue, alpha);
            }

            result.red = red;
            result.green = green;
            result.blue = blue;
            result.alpha = alpha;
            return result;
        };

        /**
         * Creates a random color using the provided options. For reproducible random colors, you should
         * call {@link CesiumMath#setRandomNumberSeed} once at the beginning of your application.
         *
         * @param {Object} [options] Object with the following properties:
         * @param {Number} [options.red] If specified, the red component to use instead of a randomized value.
         * @param {Number} [options.minimumRed=0.0] The maximum red value to generate if none was specified.
         * @param {Number} [options.maximumRed=1.0] The minimum red value to generate if none was specified.
         * @param {Number} [options.green] If specified, the green component to use instead of a randomized value.
         * @param {Number} [options.minimumGreen=0.0] The maximum green value to generate if none was specified.
         * @param {Number} [options.maximumGreen=1.0] The minimum green value to generate if none was specified.
         * @param {Number} [options.blue] If specified, the blue component to use instead of a randomized value.
         * @param {Number} [options.minimumBlue=0.0] The maximum blue value to generate if none was specified.
         * @param {Number} [options.maximumBlue=1.0] The minimum blue value to generate if none was specified.
         * @param {Number} [options.alpha] If specified, the alpha component to use instead of a randomized value.
         * @param {Number} [options.minimumAlpha=0.0] The maximum alpha value to generate if none was specified.
         * @param {Number} [options.maximumAlpha=1.0] The minimum alpha value to generate if none was specified.
         * @param {Color} [result] The object to store the result in, if undefined a new instance will be created.
         * @returns {Color} The modified result parameter or a new instance if result was undefined.
         *
         * @exception {DeveloperError} minimumRed must be less than or equal to maximumRed.
         * @exception {DeveloperError} minimumGreen must be less than or equal to maximumGreen.
         * @exception {DeveloperError} minimumBlue must be less than or equal to maximumBlue.
         * @exception {DeveloperError} minimumAlpha must be less than or equal to maximumAlpha.
         *
         * @example
         * //Create a completely random color
         * var color = Cesium.Color.fromRandom();
         *
         * //Create a random shade of yellow.
         * var color = Cesium.Color.fromRandom({
         *     red : 1.0,
         *     green : 1.0,
         *     alpha : 1.0
         * });
         *
         * //Create a random bright color.
         * var color = Cesium.Color.fromRandom({
         *     minimumRed : 0.75,
         *     minimumGreen : 0.75,
         *     minimumBlue : 0.75,
         *     alpha : 1.0
         * });
         */
        Color.fromRandom = function(options, result) {
            options = when.defaultValue(options, when.defaultValue.EMPTY_OBJECT);

            var red = options.red;
            if (!when.defined(red)) {
                var minimumRed = when.defaultValue(options.minimumRed, 0);
                var maximumRed = when.defaultValue(options.maximumRed, 1.0);

                //>>includeStart('debug', pragmas.debug);
                Check.Check.typeOf.number.lessThanOrEquals('minimumRed', minimumRed, maximumRed);
                //>>includeEnd('debug');

                red = minimumRed + (_Math.CesiumMath.nextRandomNumber() * (maximumRed - minimumRed));
            }

            var green = options.green;
            if (!when.defined(green)) {
                var minimumGreen = when.defaultValue(options.minimumGreen, 0);
                var maximumGreen = when.defaultValue(options.maximumGreen, 1.0);

                //>>includeStart('debug', pragmas.debug);
                Check.Check.typeOf.number.lessThanOrEquals('minimumGreen', minimumGreen, maximumGreen);
                //>>includeEnd('debug');
                green = minimumGreen + (_Math.CesiumMath.nextRandomNumber() * (maximumGreen - minimumGreen));
            }

            var blue = options.blue;
            if (!when.defined(blue)) {
                var minimumBlue = when.defaultValue(options.minimumBlue, 0);
                var maximumBlue = when.defaultValue(options.maximumBlue, 1.0);

                //>>includeStart('debug', pragmas.debug);
                Check.Check.typeOf.number.lessThanOrEquals('minimumBlue', minimumBlue, maximumBlue);
                //>>includeEnd('debug');

                blue = minimumBlue + (_Math.CesiumMath.nextRandomNumber() * (maximumBlue - minimumBlue));
            }

            var alpha = options.alpha;
            if (!when.defined(alpha)) {
                var minimumAlpha = when.defaultValue(options.minimumAlpha, 0);
                var maximumAlpha = when.defaultValue(options.maximumAlpha, 1.0);

                //>>includeStart('debug', pragmas.debug);
                Check.Check.typeOf.number.lessThanOrEquals('minumumAlpha', minimumAlpha, maximumAlpha);
                //>>includeEnd('debug');

                alpha = minimumAlpha + (_Math.CesiumMath.nextRandomNumber() * (maximumAlpha - minimumAlpha));
            }

            if (!when.defined(result)) {
                return new Color(red, green, blue, alpha);
            }

            result.red = red;
            result.green = green;
            result.blue = blue;
            result.alpha = alpha;
            return result;
        };

        //#rgb
        var rgbMatcher = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i;
        //#rrggbb
        var rrggbbMatcher = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i;
        //rgb(), rgba(), or rgb%()
        var rgbParenthesesMatcher = /^rgba?\(\s*([0-9.]+%?)\s*,\s*([0-9.]+%?)\s*,\s*([0-9.]+%?)(?:\s*,\s*([0-9.]+))?\s*\)$/i;
        //hsl(), hsla(), or hsl%()
        var hslParenthesesMatcher = /^hsla?\(\s*([0-9.]+)\s*,\s*([0-9.]+%)\s*,\s*([0-9.]+%)(?:\s*,\s*([0-9.]+))?\s*\)$/i;

        /**
         * Creates a Color instance from a CSS color value.
         *
         * @param {String} color The CSS color value in #rgb, #rrggbb, rgb(), rgba(), hsl(), or hsla() format.
         * @param {Color} [result] The object to store the result in, if undefined a new instance will be created.
         * @returns {Color} The color object, or undefined if the string was not a valid CSS color.
         *
         *
         * @example
         * var cesiumBlue = Cesium.Color.fromCssColorString('#67ADDF');
         * var green = Cesium.Color.fromCssColorString('green');
         *
         * @see {@link http://www.w3.org/TR/css3-color|CSS color values}
         */
        Color.fromCssColorString = function(color, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.string('color', color);
            //>>includeEnd('debug');

            if (!when.defined(result)) {
                result = new Color();
            }

            var namedColor = Color[color.toUpperCase()];
            if (when.defined(namedColor)) {
                Color.clone(namedColor, result);
                return result;
            }

            var matches = rgbMatcher.exec(color);
            if (matches !== null) {
                result.red = parseInt(matches[1], 16) / 15;
                result.green = parseInt(matches[2], 16) / 15.0;
                result.blue = parseInt(matches[3], 16) / 15.0;
                result.alpha = 1.0;
                return result;
            }

            matches = rrggbbMatcher.exec(color);
            if (matches !== null) {
                result.red = parseInt(matches[1], 16) / 255.0;
                result.green = parseInt(matches[2], 16) / 255.0;
                result.blue = parseInt(matches[3], 16) / 255.0;
                result.alpha = 1.0;
                return result;
            }

            matches = rgbParenthesesMatcher.exec(color);
            if (matches !== null) {
                result.red = parseFloat(matches[1]) / ('%' === matches[1].substr(-1) ? 100.0 : 255.0);
                result.green = parseFloat(matches[2]) / ('%' === matches[2].substr(-1) ? 100.0 : 255.0);
                result.blue = parseFloat(matches[3]) / ('%' === matches[3].substr(-1) ? 100.0 : 255.0);
                result.alpha = parseFloat(when.defaultValue(matches[4], '1.0'));
                return result;
            }

            matches = hslParenthesesMatcher.exec(color);
            if (matches !== null) {
                return Color.fromHsl(parseFloat(matches[1]) / 360.0,
                                     parseFloat(matches[2]) / 100.0,
                                     parseFloat(matches[3]) / 100.0,
                                     parseFloat(when.defaultValue(matches[4], '1.0')), result);
            }

            result = undefined;
            return result;
        };

        /**
         * The number of elements used to pack the object into an array.
         * @type {Number}
         */
        Color.packedLength = 4;

        /**
         * Stores the provided instance into the provided array.
         *
         * @param {Color} value The value to pack.
         * @param {Number[]} array The array to pack into.
         * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
         *
         * @returns {Number[]} The array that was packed into
         */
        Color.pack = function(value, array, startingIndex) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('value', value);
            Check.Check.defined('array', array);
            //>>includeEnd('debug');

            startingIndex = when.defaultValue(startingIndex, 0);
            array[startingIndex++] = value.red;
            array[startingIndex++] = value.green;
            array[startingIndex++] = value.blue;
            array[startingIndex] = value.alpha;

            return array;
        };

        /**
         * Retrieves an instance from a packed array.
         *
         * @param {Number[]} array The packed array.
         * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
         * @param {Color} [result] The object into which to store the result.
         * @returns {Color} The modified result parameter or a new Color instance if one was not provided.
         */
        Color.unpack = function(array, startingIndex, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('array', array);
            //>>includeEnd('debug');

            startingIndex = when.defaultValue(startingIndex, 0);
            if (!when.defined(result)) {
                result = new Color();
            }
            result.red = array[startingIndex++];
            result.green = array[startingIndex++];
            result.blue = array[startingIndex++];
            result.alpha = array[startingIndex];
            return result;
        };

        /**
         * Converts a 'byte' color component in the range of 0 to 255 into
         * a 'float' color component in the range of 0 to 1.0.
         *
         * @param {Number} number The number to be converted.
         * @returns {Number} The converted number.
         */
        Color.byteToFloat = function(number) {
            return number / 255.0;
        };

        /**
         * Converts a 'float' color component in the range of 0 to 1.0 into
         * a 'byte' color component in the range of 0 to 255.
         *
         * @param {Number} number The number to be converted.
         * @returns {Number} The converted number.
         */
        Color.floatToByte = function(number) {
            return number === 1.0 ? 255.0 : (number * 256.0) | 0;
        };

        /**
         * Duplicates a Color.
         *
         * @param {Color} color The Color to duplicate.
         * @param {Color} [result] The object to store the result in, if undefined a new instance will be created.
         * @returns {Color} The modified result parameter or a new instance if result was undefined. (Returns undefined if color is undefined)
         */
        Color.clone = function(color, result) {
            if (!when.defined(color)) {
                return undefined;
            }
            if (!when.defined(result)) {
                return new Color(color.red, color.green, color.blue, color.alpha);
            }
            result.red = color.red;
            result.green = color.green;
            result.blue = color.blue;
            result.alpha = color.alpha;
            return result;
        };

        /**
         * Returns true if the first Color equals the second color.
         *
         * @param {Color} left The first Color to compare for equality.
         * @param {Color} right The second Color to compare for equality.
         * @returns {Boolean} <code>true</code> if the Colors are equal; otherwise, <code>false</code>.
         */
        Color.equals = function(left, right) {
            return (left === right) || //
                   (when.defined(left) && //
                    when.defined(right) && //
                    left.red === right.red && //
                    left.green === right.green && //
                    left.blue === right.blue && //
                    left.alpha === right.alpha);
        };

        /**
         * @private
         */
        Color.equalsArray = function(color, array, offset) {
            return color.red === array[offset] &&
                   color.green === array[offset + 1] &&
                   color.blue === array[offset + 2] &&
                   color.alpha === array[offset + 3];
        };

        /**
         * Returns a duplicate of a Color instance.
         *
         * @param {Color} [result] The object to store the result in, if undefined a new instance will be created.
         * @returns {Color} The modified result parameter or a new instance if result was undefined.
         */
        Color.prototype.clone = function(result) {
            return Color.clone(this, result);
        };

        /**
         * Returns true if this Color equals other.
         *
         * @param {Color} other The Color to compare for equality.
         * @returns {Boolean} <code>true</code> if the Colors are equal; otherwise, <code>false</code>.
         */
        Color.prototype.equals = function(other) {
            return Color.equals(this, other);
        };

        /**
         * Returns <code>true</code> if this Color equals other componentwise within the specified epsilon.
         *
         * @param {Color} other The Color to compare for equality.
         * @param {Number} [epsilon=0.0] The epsilon to use for equality testing.
         * @returns {Boolean} <code>true</code> if the Colors are equal within the specified epsilon; otherwise, <code>false</code>.
         */
        Color.prototype.equalsEpsilon = function(other, epsilon) {
            return (this === other) || //
                   ((when.defined(other)) && //
                    (Math.abs(this.red - other.red) <= epsilon) && //
                    (Math.abs(this.green - other.green) <= epsilon) && //
                    (Math.abs(this.blue - other.blue) <= epsilon) && //
                    (Math.abs(this.alpha - other.alpha) <= epsilon));
        };

        /**
         * Creates a string representing this Color in the format '(red, green, blue, alpha)'.
         *
         * @returns {String} A string representing this Color in the format '(red, green, blue, alpha)'.
         */
        Color.prototype.toString = function() {
            return '(' + this.red + ', ' + this.green + ', ' + this.blue + ', ' + this.alpha + ')';
        };

        /**
         * Creates a string containing the CSS color value for this color.
         *
         * @returns {String} The CSS equivalent of this color.
         *
         * @see {@link http://www.w3.org/TR/css3-color/#rgba-color|CSS RGB or RGBA color values}
         */
        Color.prototype.toCssColorString = function() {
            var red = Color.floatToByte(this.red);
            var green = Color.floatToByte(this.green);
            var blue = Color.floatToByte(this.blue);
            if (this.alpha === 1) {
                return 'rgb(' + red + ',' + green + ',' + blue + ')';
            }
            return 'rgba(' + red + ',' + green + ',' + blue + ',' + this.alpha + ')';
        };

        /**
         * Converts this color to an array of red, green, blue, and alpha values
         * that are in the range of 0 to 255.
         *
         * @param {Number[]} [result] The array to store the result in, if undefined a new instance will be created.
         * @returns {Number[]} The modified result parameter or a new instance if result was undefined.
         */
        Color.prototype.toBytes = function(result) {
            var red = Color.floatToByte(this.red);
            var green = Color.floatToByte(this.green);
            var blue = Color.floatToByte(this.blue);
            var alpha = Color.floatToByte(this.alpha);

            if (!when.defined(result)) {
                return [red, green, blue, alpha];
            }
            result[0] = red;
            result[1] = green;
            result[2] = blue;
            result[3] = alpha;
            return result;
        };

        /**
         * Converts this color to a single numeric unsigned 32-bit RGBA value, using the endianness
         * of the system.
         *
         * @returns {Number} A single numeric unsigned 32-bit RGBA value.
         *
         *
         * @example
         * var rgba = Cesium.Color.BLUE.toRgba();
         *
         * @see Color.fromRgba
         */
        Color.prototype.toRgba = function() {
            // scratchUint32Array and scratchUint8Array share an underlying array buffer
            scratchUint8Array[0] = Color.floatToByte(this.red);
            scratchUint8Array[1] = Color.floatToByte(this.green);
            scratchUint8Array[2] = Color.floatToByte(this.blue);
            scratchUint8Array[3] = Color.floatToByte(this.alpha);
            return scratchUint32Array[0];
        };

        /**
         * Brightens this color by the provided magnitude.
         *
         * @param {Number} magnitude A positive number indicating the amount to brighten.
         * @param {Color} result The object onto which to store the result.
         * @returns {Color} The modified result parameter.
         *
         * @example
         * var brightBlue = Cesium.Color.BLUE.brighten(0.5, new Cesium.Color());
         */
        Color.prototype.brighten = function(magnitude, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.number('magnitude', magnitude);
            Check.Check.typeOf.number.greaterThanOrEquals('magnitude', magnitude, 0.0);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            magnitude = (1.0 - magnitude);
            result.red = 1.0 - ((1.0 - this.red) * magnitude);
            result.green = 1.0 - ((1.0 - this.green) * magnitude);
            result.blue = 1.0 - ((1.0 - this.blue) * magnitude);
            result.alpha = this.alpha;
            return result;
        };

        /**
         * Darkens this color by the provided magnitude.
         *
         * @param {Number} magnitude A positive number indicating the amount to darken.
         * @param {Color} result The object onto which to store the result.
         * @returns {Color} The modified result parameter.
         *
         * @example
         * var darkBlue = Cesium.Color.BLUE.darken(0.5, new Cesium.Color());
         */
        Color.prototype.darken = function(magnitude, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.number('magnitude', magnitude);
            Check.Check.typeOf.number.greaterThanOrEquals('magnitude', magnitude, 0.0);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            magnitude = (1.0 - magnitude);
            result.red = this.red * magnitude;
            result.green = this.green * magnitude;
            result.blue = this.blue * magnitude;
            result.alpha = this.alpha;
            return result;
        };

        /**
         * Creates a new Color that has the same red, green, and blue components
         * as this Color, but with the specified alpha value.
         *
         * @param {Number} alpha The new alpha component.
         * @param {Color} [result] The object onto which to store the result.
         * @returns {Color} The modified result parameter or a new Color instance if one was not provided.
         *
         * @example var translucentRed = Cesium.Color.RED.withAlpha(0.9);
         */
        Color.prototype.withAlpha = function(alpha, result) {
            return Color.fromAlpha(this, alpha, result);
        };

        /**
         * Computes the componentwise sum of two Colors.
         *
         * @param {Color} left The first Color.
         * @param {Color} right The second Color.
         * @param {Color} result The object onto which to store the result.
         * @returns {Color} The modified result parameter.
         */
        Color.add = function(left, right, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('left', left);
            Check.Check.typeOf.object('right', right);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result.red = left.red + right.red;
            result.green = left.green + right.green;
            result.blue = left.blue + right.blue;
            result.alpha = left.alpha + right.alpha;
            return result;
        };

        /**
         * Computes the componentwise difference of two Colors.
         *
         * @param {Color} left The first Color.
         * @param {Color} right The second Color.
         * @param {Color} result The object onto which to store the result.
         * @returns {Color} The modified result parameter.
         */
        Color.subtract = function(left, right, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('left', left);
            Check.Check.typeOf.object('right', right);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result.red = left.red - right.red;
            result.green = left.green - right.green;
            result.blue = left.blue - right.blue;
            result.alpha = left.alpha - right.alpha;
            return result;
        };

        /**
         * Computes the componentwise product of two Colors.
         *
         * @param {Color} left The first Color.
         * @param {Color} right The second Color.
         * @param {Color} result The object onto which to store the result.
         * @returns {Color} The modified result parameter.
         */
        Color.multiply = function(left, right, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('left', left);
            Check.Check.typeOf.object('right', right);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result.red = left.red * right.red;
            result.green = left.green * right.green;
            result.blue = left.blue * right.blue;
            result.alpha = left.alpha * right.alpha;
            return result;
        };

        /**
         * Computes the componentwise quotient of two Colors.
         *
         * @param {Color} left The first Color.
         * @param {Color} right The second Color.
         * @param {Color} result The object onto which to store the result.
         * @returns {Color} The modified result parameter.
         */
        Color.divide = function(left, right, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('left', left);
            Check.Check.typeOf.object('right', right);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result.red = left.red / right.red;
            result.green = left.green / right.green;
            result.blue = left.blue / right.blue;
            result.alpha = left.alpha / right.alpha;
            return result;
        };

        /**
         * Computes the componentwise modulus of two Colors.
         *
         * @param {Color} left The first Color.
         * @param {Color} right The second Color.
         * @param {Color} result The object onto which to store the result.
         * @returns {Color} The modified result parameter.
         */
        Color.mod = function(left, right, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('left', left);
            Check.Check.typeOf.object('right', right);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result.red = left.red % right.red;
            result.green = left.green % right.green;
            result.blue = left.blue % right.blue;
            result.alpha = left.alpha % right.alpha;
            return result;
        };

        /**
         * Computes the linear interpolation or extrapolation at t between the provided colors.
         *
         * @param {Color} start The color corresponding to t at 0.0.
         * @param {Color} end The color corresponding to t at 1.0.
         * @param {Number} t The point along t at which to interpolate.
         * @param {Color} result The object onto which to store the result.
         * @returns {Color} The modified result parameter.
         */
        Color.lerp = function(start, end, t, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('start', start);
            Check.Check.typeOf.object('end', end);
            Check.Check.typeOf.number('t', t);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result.red = _Math.CesiumMath.lerp(start.red, end.red, t);
            result.green = _Math.CesiumMath.lerp(start.green, end.green, t);
            result.blue = _Math.CesiumMath.lerp(start.blue, end.blue, t);
            result.alpha = _Math.CesiumMath.lerp(start.alpha, end.alpha, t);
            return result;
        };

        /**
         * Multiplies the provided Color componentwise by the provided scalar.
         *
         * @param {Color} color The Color to be scaled.
         * @param {Number} scalar The scalar to multiply with.
         * @param {Color} result The object onto which to store the result.
         * @returns {Color} The modified result parameter.
         */
        Color.multiplyByScalar = function(color, scalar, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('color', color);
            Check.Check.typeOf.number('scalar', scalar);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result.red = color.red * scalar;
            result.green = color.green * scalar;
            result.blue = color.blue * scalar;
            result.alpha = color.alpha * scalar;
            return result;
        };

        /**
         * Divides the provided Color componentwise by the provided scalar.
         *
         * @param {Color} color The Color to be divided.
         * @param {Number} scalar The scalar to divide with.
         * @param {Color} result The object onto which to store the result.
         * @returns {Color} The modified result parameter.
         */
        Color.divideByScalar = function(color, scalar, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('color', color);
            Check.Check.typeOf.number('scalar', scalar);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result.red = color.red / scalar;
            result.green = color.green / scalar;
            result.blue = color.blue / scalar;
            result.alpha = color.alpha / scalar;
            return result;
        };

        /**
         * An immutable Color instance initialized to CSS color #F0F8FF
         * <span class="colorSwath" style="background: #F0F8FF;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.ALICEBLUE = Object.freeze(Color.fromCssColorString('#F0F8FF'));

        /**
         * An immutable Color instance initialized to CSS color #FAEBD7
         * <span class="colorSwath" style="background: #FAEBD7;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.ANTIQUEWHITE = Object.freeze(Color.fromCssColorString('#FAEBD7'));

        /**
         * An immutable Color instance initialized to CSS color #00FFFF
         * <span class="colorSwath" style="background: #00FFFF;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.AQUA = Object.freeze(Color.fromCssColorString('#00FFFF'));

        /**
         * An immutable Color instance initialized to CSS color #7FFFD4
         * <span class="colorSwath" style="background: #7FFFD4;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.AQUAMARINE = Object.freeze(Color.fromCssColorString('#7FFFD4'));

        /**
         * An immutable Color instance initialized to CSS color #F0FFFF
         * <span class="colorSwath" style="background: #F0FFFF;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.AZURE = Object.freeze(Color.fromCssColorString('#F0FFFF'));

        /**
         * An immutable Color instance initialized to CSS color #F5F5DC
         * <span class="colorSwath" style="background: #F5F5DC;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.BEIGE = Object.freeze(Color.fromCssColorString('#F5F5DC'));

        /**
         * An immutable Color instance initialized to CSS color #FFE4C4
         * <span class="colorSwath" style="background: #FFE4C4;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.BISQUE = Object.freeze(Color.fromCssColorString('#FFE4C4'));

        /**
         * An immutable Color instance initialized to CSS color #000000
         * <span class="colorSwath" style="background: #000000;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.BLACK = Object.freeze(Color.fromCssColorString('#000000'));

        /**
         * An immutable Color instance initialized to CSS color #FFEBCD
         * <span class="colorSwath" style="background: #FFEBCD;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.BLANCHEDALMOND = Object.freeze(Color.fromCssColorString('#FFEBCD'));

        /**
         * An immutable Color instance initialized to CSS color #0000FF
         * <span class="colorSwath" style="background: #0000FF;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.BLUE = Object.freeze(Color.fromCssColorString('#0000FF'));

        /**
         * An immutable Color instance initialized to CSS color #8A2BE2
         * <span class="colorSwath" style="background: #8A2BE2;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.BLUEVIOLET = Object.freeze(Color.fromCssColorString('#8A2BE2'));

        /**
         * An immutable Color instance initialized to CSS color #A52A2A
         * <span class="colorSwath" style="background: #A52A2A;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.BROWN = Object.freeze(Color.fromCssColorString('#A52A2A'));

        /**
         * An immutable Color instance initialized to CSS color #DEB887
         * <span class="colorSwath" style="background: #DEB887;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.BURLYWOOD = Object.freeze(Color.fromCssColorString('#DEB887'));

        /**
         * An immutable Color instance initialized to CSS color #5F9EA0
         * <span class="colorSwath" style="background: #5F9EA0;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.CADETBLUE = Object.freeze(Color.fromCssColorString('#5F9EA0'));
        /**
         * An immutable Color instance initialized to CSS color #7FFF00
         * <span class="colorSwath" style="background: #7FFF00;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.CHARTREUSE = Object.freeze(Color.fromCssColorString('#7FFF00'));

        /**
         * An immutable Color instance initialized to CSS color #D2691E
         * <span class="colorSwath" style="background: #D2691E;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.CHOCOLATE = Object.freeze(Color.fromCssColorString('#D2691E'));

        /**
         * An immutable Color instance initialized to CSS color #FF7F50
         * <span class="colorSwath" style="background: #FF7F50;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.CORAL = Object.freeze(Color.fromCssColorString('#FF7F50'));

        /**
         * An immutable Color instance initialized to CSS color #6495ED
         * <span class="colorSwath" style="background: #6495ED;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.CORNFLOWERBLUE = Object.freeze(Color.fromCssColorString('#6495ED'));

        /**
         * An immutable Color instance initialized to CSS color #FFF8DC
         * <span class="colorSwath" style="background: #FFF8DC;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.CORNSILK = Object.freeze(Color.fromCssColorString('#FFF8DC'));

        /**
         * An immutable Color instance initialized to CSS color #DC143C
         * <span class="colorSwath" style="background: #DC143C;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.CRIMSON = Object.freeze(Color.fromCssColorString('#DC143C'));

        /**
         * An immutable Color instance initialized to CSS color #00FFFF
         * <span class="colorSwath" style="background: #00FFFF;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.CYAN = Object.freeze(Color.fromCssColorString('#00FFFF'));

        /**
         * An immutable Color instance initialized to CSS color #00008B
         * <span class="colorSwath" style="background: #00008B;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.DARKBLUE = Object.freeze(Color.fromCssColorString('#00008B'));

        /**
         * An immutable Color instance initialized to CSS color #008B8B
         * <span class="colorSwath" style="background: #008B8B;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.DARKCYAN = Object.freeze(Color.fromCssColorString('#008B8B'));

        /**
         * An immutable Color instance initialized to CSS color #B8860B
         * <span class="colorSwath" style="background: #B8860B;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.DARKGOLDENROD = Object.freeze(Color.fromCssColorString('#B8860B'));

        /**
         * An immutable Color instance initialized to CSS color #A9A9A9
         * <span class="colorSwath" style="background: #A9A9A9;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.DARKGRAY = Object.freeze(Color.fromCssColorString('#A9A9A9'));

        /**
         * An immutable Color instance initialized to CSS color #006400
         * <span class="colorSwath" style="background: #006400;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.DARKGREEN = Object.freeze(Color.fromCssColorString('#006400'));

        /**
         * An immutable Color instance initialized to CSS color #A9A9A9
         * <span class="colorSwath" style="background: #A9A9A9;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.DARKGREY = Color.DARKGRAY;

        /**
         * An immutable Color instance initialized to CSS color #BDB76B
         * <span class="colorSwath" style="background: #BDB76B;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.DARKKHAKI = Object.freeze(Color.fromCssColorString('#BDB76B'));

        /**
         * An immutable Color instance initialized to CSS color #8B008B
         * <span class="colorSwath" style="background: #8B008B;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.DARKMAGENTA = Object.freeze(Color.fromCssColorString('#8B008B'));

        /**
         * An immutable Color instance initialized to CSS color #556B2F
         * <span class="colorSwath" style="background: #556B2F;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.DARKOLIVEGREEN = Object.freeze(Color.fromCssColorString('#556B2F'));

        /**
         * An immutable Color instance initialized to CSS color #FF8C00
         * <span class="colorSwath" style="background: #FF8C00;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.DARKORANGE = Object.freeze(Color.fromCssColorString('#FF8C00'));

        /**
         * An immutable Color instance initialized to CSS color #9932CC
         * <span class="colorSwath" style="background: #9932CC;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.DARKORCHID = Object.freeze(Color.fromCssColorString('#9932CC'));

        /**
         * An immutable Color instance initialized to CSS color #8B0000
         * <span class="colorSwath" style="background: #8B0000;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.DARKRED = Object.freeze(Color.fromCssColorString('#8B0000'));

        /**
         * An immutable Color instance initialized to CSS color #E9967A
         * <span class="colorSwath" style="background: #E9967A;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.DARKSALMON = Object.freeze(Color.fromCssColorString('#E9967A'));

        /**
         * An immutable Color instance initialized to CSS color #8FBC8F
         * <span class="colorSwath" style="background: #8FBC8F;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.DARKSEAGREEN = Object.freeze(Color.fromCssColorString('#8FBC8F'));

        /**
         * An immutable Color instance initialized to CSS color #483D8B
         * <span class="colorSwath" style="background: #483D8B;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.DARKSLATEBLUE = Object.freeze(Color.fromCssColorString('#483D8B'));

        /**
         * An immutable Color instance initialized to CSS color #2F4F4F
         * <span class="colorSwath" style="background: #2F4F4F;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.DARKSLATEGRAY = Object.freeze(Color.fromCssColorString('#2F4F4F'));

        /**
         * An immutable Color instance initialized to CSS color #2F4F4F
         * <span class="colorSwath" style="background: #2F4F4F;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.DARKSLATEGREY = Color.DARKSLATEGRAY;

        /**
         * An immutable Color instance initialized to CSS color #00CED1
         * <span class="colorSwath" style="background: #00CED1;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.DARKTURQUOISE = Object.freeze(Color.fromCssColorString('#00CED1'));

        /**
         * An immutable Color instance initialized to CSS color #9400D3
         * <span class="colorSwath" style="background: #9400D3;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.DARKVIOLET = Object.freeze(Color.fromCssColorString('#9400D3'));

        /**
         * An immutable Color instance initialized to CSS color #FF1493
         * <span class="colorSwath" style="background: #FF1493;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.DEEPPINK = Object.freeze(Color.fromCssColorString('#FF1493'));

        /**
         * An immutable Color instance initialized to CSS color #00BFFF
         * <span class="colorSwath" style="background: #00BFFF;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.DEEPSKYBLUE = Object.freeze(Color.fromCssColorString('#00BFFF'));

        /**
         * An immutable Color instance initialized to CSS color #696969
         * <span class="colorSwath" style="background: #696969;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.DIMGRAY = Object.freeze(Color.fromCssColorString('#696969'));

        /**
         * An immutable Color instance initialized to CSS color #696969
         * <span class="colorSwath" style="background: #696969;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.DIMGREY = Color.DIMGRAY;

        /**
         * An immutable Color instance initialized to CSS color #1E90FF
         * <span class="colorSwath" style="background: #1E90FF;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.DODGERBLUE = Object.freeze(Color.fromCssColorString('#1E90FF'));

        /**
         * An immutable Color instance initialized to CSS color #B22222
         * <span class="colorSwath" style="background: #B22222;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.FIREBRICK = Object.freeze(Color.fromCssColorString('#B22222'));

        /**
         * An immutable Color instance initialized to CSS color #FFFAF0
         * <span class="colorSwath" style="background: #FFFAF0;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.FLORALWHITE = Object.freeze(Color.fromCssColorString('#FFFAF0'));

        /**
         * An immutable Color instance initialized to CSS color #228B22
         * <span class="colorSwath" style="background: #228B22;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.FORESTGREEN = Object.freeze(Color.fromCssColorString('#228B22'));

        /**
         * An immutable Color instance initialized to CSS color #FF00FF
         * <span class="colorSwath" style="background: #FF00FF;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.FUCHSIA = Object.freeze(Color.fromCssColorString('#FF00FF'));

        /**
         * An immutable Color instance initialized to CSS color #DCDCDC
         * <span class="colorSwath" style="background: #DCDCDC;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.GAINSBORO = Object.freeze(Color.fromCssColorString('#DCDCDC'));

        /**
         * An immutable Color instance initialized to CSS color #F8F8FF
         * <span class="colorSwath" style="background: #F8F8FF;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.GHOSTWHITE = Object.freeze(Color.fromCssColorString('#F8F8FF'));

        /**
         * An immutable Color instance initialized to CSS color #FFD700
         * <span class="colorSwath" style="background: #FFD700;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.GOLD = Object.freeze(Color.fromCssColorString('#FFD700'));

        /**
         * An immutable Color instance initialized to CSS color #DAA520
         * <span class="colorSwath" style="background: #DAA520;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.GOLDENROD = Object.freeze(Color.fromCssColorString('#DAA520'));

        /**
         * An immutable Color instance initialized to CSS color #808080
         * <span class="colorSwath" style="background: #808080;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.GRAY = Object.freeze(Color.fromCssColorString('#808080'));

        /**
         * An immutable Color instance initialized to CSS color #008000
         * <span class="colorSwath" style="background: #008000;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.GREEN = Object.freeze(Color.fromCssColorString('#008000'));

        /**
         * An immutable Color instance initialized to CSS color #ADFF2F
         * <span class="colorSwath" style="background: #ADFF2F;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.GREENYELLOW = Object.freeze(Color.fromCssColorString('#ADFF2F'));

        /**
         * An immutable Color instance initialized to CSS color #808080
         * <span class="colorSwath" style="background: #808080;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.GREY = Color.GRAY;

        /**
         * An immutable Color instance initialized to CSS color #F0FFF0
         * <span class="colorSwath" style="background: #F0FFF0;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.HONEYDEW = Object.freeze(Color.fromCssColorString('#F0FFF0'));

        /**
         * An immutable Color instance initialized to CSS color #FF69B4
         * <span class="colorSwath" style="background: #FF69B4;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.HOTPINK = Object.freeze(Color.fromCssColorString('#FF69B4'));

        /**
         * An immutable Color instance initialized to CSS color #CD5C5C
         * <span class="colorSwath" style="background: #CD5C5C;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.INDIANRED = Object.freeze(Color.fromCssColorString('#CD5C5C'));

        /**
         * An immutable Color instance initialized to CSS color #4B0082
         * <span class="colorSwath" style="background: #4B0082;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.INDIGO = Object.freeze(Color.fromCssColorString('#4B0082'));

        /**
         * An immutable Color instance initialized to CSS color #FFFFF0
         * <span class="colorSwath" style="background: #FFFFF0;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.IVORY = Object.freeze(Color.fromCssColorString('#FFFFF0'));

        /**
         * An immutable Color instance initialized to CSS color #F0E68C
         * <span class="colorSwath" style="background: #F0E68C;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.KHAKI = Object.freeze(Color.fromCssColorString('#F0E68C'));

        /**
         * An immutable Color instance initialized to CSS color #E6E6FA
         * <span class="colorSwath" style="background: #E6E6FA;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.LAVENDER = Object.freeze(Color.fromCssColorString('#E6E6FA'));

        /**
         * An immutable Color instance initialized to CSS color #FFF0F5
         * <span class="colorSwath" style="background: #FFF0F5;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.LAVENDAR_BLUSH = Object.freeze(Color.fromCssColorString('#FFF0F5'));

        /**
         * An immutable Color instance initialized to CSS color #7CFC00
         * <span class="colorSwath" style="background: #7CFC00;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.LAWNGREEN = Object.freeze(Color.fromCssColorString('#7CFC00'));

        /**
         * An immutable Color instance initialized to CSS color #FFFACD
         * <span class="colorSwath" style="background: #FFFACD;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.LEMONCHIFFON = Object.freeze(Color.fromCssColorString('#FFFACD'));

        /**
         * An immutable Color instance initialized to CSS color #ADD8E6
         * <span class="colorSwath" style="background: #ADD8E6;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.LIGHTBLUE = Object.freeze(Color.fromCssColorString('#ADD8E6'));

        /**
         * An immutable Color instance initialized to CSS color #F08080
         * <span class="colorSwath" style="background: #F08080;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.LIGHTCORAL = Object.freeze(Color.fromCssColorString('#F08080'));

        /**
         * An immutable Color instance initialized to CSS color #E0FFFF
         * <span class="colorSwath" style="background: #E0FFFF;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.LIGHTCYAN = Object.freeze(Color.fromCssColorString('#E0FFFF'));

        /**
         * An immutable Color instance initialized to CSS color #FAFAD2
         * <span class="colorSwath" style="background: #FAFAD2;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.LIGHTGOLDENRODYELLOW = Object.freeze(Color.fromCssColorString('#FAFAD2'));

        /**
         * An immutable Color instance initialized to CSS color #D3D3D3
         * <span class="colorSwath" style="background: #D3D3D3;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.LIGHTGRAY = Object.freeze(Color.fromCssColorString('#D3D3D3'));

        /**
         * An immutable Color instance initialized to CSS color #90EE90
         * <span class="colorSwath" style="background: #90EE90;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.LIGHTGREEN = Object.freeze(Color.fromCssColorString('#90EE90'));

        /**
         * An immutable Color instance initialized to CSS color #D3D3D3
         * <span class="colorSwath" style="background: #D3D3D3;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.LIGHTGREY = Color.LIGHTGRAY;

        /**
         * An immutable Color instance initialized to CSS color #FFB6C1
         * <span class="colorSwath" style="background: #FFB6C1;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.LIGHTPINK = Object.freeze(Color.fromCssColorString('#FFB6C1'));

        /**
         * An immutable Color instance initialized to CSS color #20B2AA
         * <span class="colorSwath" style="background: #20B2AA;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.LIGHTSEAGREEN = Object.freeze(Color.fromCssColorString('#20B2AA'));

        /**
         * An immutable Color instance initialized to CSS color #87CEFA
         * <span class="colorSwath" style="background: #87CEFA;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.LIGHTSKYBLUE = Object.freeze(Color.fromCssColorString('#87CEFA'));

        /**
         * An immutable Color instance initialized to CSS color #778899
         * <span class="colorSwath" style="background: #778899;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.LIGHTSLATEGRAY = Object.freeze(Color.fromCssColorString('#778899'));

        /**
         * An immutable Color instance initialized to CSS color #778899
         * <span class="colorSwath" style="background: #778899;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.LIGHTSLATEGREY = Color.LIGHTSLATEGRAY;

        /**
         * An immutable Color instance initialized to CSS color #B0C4DE
         * <span class="colorSwath" style="background: #B0C4DE;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.LIGHTSTEELBLUE = Object.freeze(Color.fromCssColorString('#B0C4DE'));

        /**
         * An immutable Color instance initialized to CSS color #FFFFE0
         * <span class="colorSwath" style="background: #FFFFE0;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.LIGHTYELLOW = Object.freeze(Color.fromCssColorString('#FFFFE0'));

        /**
         * An immutable Color instance initialized to CSS color #00FF00
         * <span class="colorSwath" style="background: #00FF00;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.LIME = Object.freeze(Color.fromCssColorString('#00FF00'));

        /**
         * An immutable Color instance initialized to CSS color #32CD32
         * <span class="colorSwath" style="background: #32CD32;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.LIMEGREEN = Object.freeze(Color.fromCssColorString('#32CD32'));

        /**
         * An immutable Color instance initialized to CSS color #FAF0E6
         * <span class="colorSwath" style="background: #FAF0E6;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.LINEN = Object.freeze(Color.fromCssColorString('#FAF0E6'));

        /**
         * An immutable Color instance initialized to CSS color #FF00FF
         * <span class="colorSwath" style="background: #FF00FF;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.MAGENTA = Object.freeze(Color.fromCssColorString('#FF00FF'));

        /**
         * An immutable Color instance initialized to CSS color #800000
         * <span class="colorSwath" style="background: #800000;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.MAROON = Object.freeze(Color.fromCssColorString('#800000'));

        /**
         * An immutable Color instance initialized to CSS color #66CDAA
         * <span class="colorSwath" style="background: #66CDAA;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.MEDIUMAQUAMARINE = Object.freeze(Color.fromCssColorString('#66CDAA'));

        /**
         * An immutable Color instance initialized to CSS color #0000CD
         * <span class="colorSwath" style="background: #0000CD;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.MEDIUMBLUE = Object.freeze(Color.fromCssColorString('#0000CD'));

        /**
         * An immutable Color instance initialized to CSS color #BA55D3
         * <span class="colorSwath" style="background: #BA55D3;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.MEDIUMORCHID = Object.freeze(Color.fromCssColorString('#BA55D3'));

        /**
         * An immutable Color instance initialized to CSS color #9370DB
         * <span class="colorSwath" style="background: #9370DB;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.MEDIUMPURPLE = Object.freeze(Color.fromCssColorString('#9370DB'));

        /**
         * An immutable Color instance initialized to CSS color #3CB371
         * <span class="colorSwath" style="background: #3CB371;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.MEDIUMSEAGREEN = Object.freeze(Color.fromCssColorString('#3CB371'));

        /**
         * An immutable Color instance initialized to CSS color #7B68EE
         * <span class="colorSwath" style="background: #7B68EE;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.MEDIUMSLATEBLUE = Object.freeze(Color.fromCssColorString('#7B68EE'));

        /**
         * An immutable Color instance initialized to CSS color #00FA9A
         * <span class="colorSwath" style="background: #00FA9A;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.MEDIUMSPRINGGREEN = Object.freeze(Color.fromCssColorString('#00FA9A'));

        /**
         * An immutable Color instance initialized to CSS color #48D1CC
         * <span class="colorSwath" style="background: #48D1CC;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.MEDIUMTURQUOISE = Object.freeze(Color.fromCssColorString('#48D1CC'));

        /**
         * An immutable Color instance initialized to CSS color #C71585
         * <span class="colorSwath" style="background: #C71585;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.MEDIUMVIOLETRED = Object.freeze(Color.fromCssColorString('#C71585'));

        /**
         * An immutable Color instance initialized to CSS color #191970
         * <span class="colorSwath" style="background: #191970;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.MIDNIGHTBLUE = Object.freeze(Color.fromCssColorString('#191970'));

        /**
         * An immutable Color instance initialized to CSS color #F5FFFA
         * <span class="colorSwath" style="background: #F5FFFA;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.MINTCREAM = Object.freeze(Color.fromCssColorString('#F5FFFA'));

        /**
         * An immutable Color instance initialized to CSS color #FFE4E1
         * <span class="colorSwath" style="background: #FFE4E1;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.MISTYROSE = Object.freeze(Color.fromCssColorString('#FFE4E1'));

        /**
         * An immutable Color instance initialized to CSS color #FFE4B5
         * <span class="colorSwath" style="background: #FFE4B5;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.MOCCASIN = Object.freeze(Color.fromCssColorString('#FFE4B5'));

        /**
         * An immutable Color instance initialized to CSS color #FFDEAD
         * <span class="colorSwath" style="background: #FFDEAD;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.NAVAJOWHITE = Object.freeze(Color.fromCssColorString('#FFDEAD'));

        /**
         * An immutable Color instance initialized to CSS color #000080
         * <span class="colorSwath" style="background: #000080;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.NAVY = Object.freeze(Color.fromCssColorString('#000080'));

        /**
         * An immutable Color instance initialized to CSS color #FDF5E6
         * <span class="colorSwath" style="background: #FDF5E6;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.OLDLACE = Object.freeze(Color.fromCssColorString('#FDF5E6'));

        /**
         * An immutable Color instance initialized to CSS color #808000
         * <span class="colorSwath" style="background: #808000;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.OLIVE = Object.freeze(Color.fromCssColorString('#808000'));

        /**
         * An immutable Color instance initialized to CSS color #6B8E23
         * <span class="colorSwath" style="background: #6B8E23;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.OLIVEDRAB = Object.freeze(Color.fromCssColorString('#6B8E23'));

        /**
         * An immutable Color instance initialized to CSS color #FFA500
         * <span class="colorSwath" style="background: #FFA500;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.ORANGE = Object.freeze(Color.fromCssColorString('#FFA500'));

        /**
         * An immutable Color instance initialized to CSS color #FF4500
         * <span class="colorSwath" style="background: #FF4500;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.ORANGERED = Object.freeze(Color.fromCssColorString('#FF4500'));

        /**
         * An immutable Color instance initialized to CSS color #DA70D6
         * <span class="colorSwath" style="background: #DA70D6;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.ORCHID = Object.freeze(Color.fromCssColorString('#DA70D6'));

        /**
         * An immutable Color instance initialized to CSS color #EEE8AA
         * <span class="colorSwath" style="background: #EEE8AA;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.PALEGOLDENROD = Object.freeze(Color.fromCssColorString('#EEE8AA'));

        /**
         * An immutable Color instance initialized to CSS color #98FB98
         * <span class="colorSwath" style="background: #98FB98;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.PALEGREEN = Object.freeze(Color.fromCssColorString('#98FB98'));

        /**
         * An immutable Color instance initialized to CSS color #AFEEEE
         * <span class="colorSwath" style="background: #AFEEEE;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.PALETURQUOISE = Object.freeze(Color.fromCssColorString('#AFEEEE'));

        /**
         * An immutable Color instance initialized to CSS color #DB7093
         * <span class="colorSwath" style="background: #DB7093;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.PALEVIOLETRED = Object.freeze(Color.fromCssColorString('#DB7093'));

        /**
         * An immutable Color instance initialized to CSS color #FFEFD5
         * <span class="colorSwath" style="background: #FFEFD5;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.PAPAYAWHIP = Object.freeze(Color.fromCssColorString('#FFEFD5'));

        /**
         * An immutable Color instance initialized to CSS color #FFDAB9
         * <span class="colorSwath" style="background: #FFDAB9;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.PEACHPUFF = Object.freeze(Color.fromCssColorString('#FFDAB9'));

        /**
         * An immutable Color instance initialized to CSS color #CD853F
         * <span class="colorSwath" style="background: #CD853F;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.PERU = Object.freeze(Color.fromCssColorString('#CD853F'));

        /**
         * An immutable Color instance initialized to CSS color #FFC0CB
         * <span class="colorSwath" style="background: #FFC0CB;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.PINK = Object.freeze(Color.fromCssColorString('#FFC0CB'));

        /**
         * An immutable Color instance initialized to CSS color #DDA0DD
         * <span class="colorSwath" style="background: #DDA0DD;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.PLUM = Object.freeze(Color.fromCssColorString('#DDA0DD'));

        /**
         * An immutable Color instance initialized to CSS color #B0E0E6
         * <span class="colorSwath" style="background: #B0E0E6;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.POWDERBLUE = Object.freeze(Color.fromCssColorString('#B0E0E6'));

        /**
         * An immutable Color instance initialized to CSS color #800080
         * <span class="colorSwath" style="background: #800080;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.PURPLE = Object.freeze(Color.fromCssColorString('#800080'));

        /**
         * An immutable Color instance initialized to CSS color #FF0000
         * <span class="colorSwath" style="background: #FF0000;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.RED = Object.freeze(Color.fromCssColorString('#FF0000'));

        /**
         * An immutable Color instance initialized to CSS color #BC8F8F
         * <span class="colorSwath" style="background: #BC8F8F;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.ROSYBROWN = Object.freeze(Color.fromCssColorString('#BC8F8F'));

        /**
         * An immutable Color instance initialized to CSS color #4169E1
         * <span class="colorSwath" style="background: #4169E1;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.ROYALBLUE = Object.freeze(Color.fromCssColorString('#4169E1'));

        /**
         * An immutable Color instance initialized to CSS color #8B4513
         * <span class="colorSwath" style="background: #8B4513;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.SADDLEBROWN = Object.freeze(Color.fromCssColorString('#8B4513'));

        /**
         * An immutable Color instance initialized to CSS color #FA8072
         * <span class="colorSwath" style="background: #FA8072;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.SALMON = Object.freeze(Color.fromCssColorString('#FA8072'));

        /**
         * An immutable Color instance initialized to CSS color #F4A460
         * <span class="colorSwath" style="background: #F4A460;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.SANDYBROWN = Object.freeze(Color.fromCssColorString('#F4A460'));

        /**
         * An immutable Color instance initialized to CSS color #2E8B57
         * <span class="colorSwath" style="background: #2E8B57;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.SEAGREEN = Object.freeze(Color.fromCssColorString('#2E8B57'));

        /**
         * An immutable Color instance initialized to CSS color #FFF5EE
         * <span class="colorSwath" style="background: #FFF5EE;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.SEASHELL = Object.freeze(Color.fromCssColorString('#FFF5EE'));

        /**
         * An immutable Color instance initialized to CSS color #A0522D
         * <span class="colorSwath" style="background: #A0522D;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.SIENNA = Object.freeze(Color.fromCssColorString('#A0522D'));

        /**
         * An immutable Color instance initialized to CSS color #C0C0C0
         * <span class="colorSwath" style="background: #C0C0C0;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.SILVER = Object.freeze(Color.fromCssColorString('#C0C0C0'));

        /**
         * An immutable Color instance initialized to CSS color #87CEEB
         * <span class="colorSwath" style="background: #87CEEB;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.SKYBLUE = Object.freeze(Color.fromCssColorString('#87CEEB'));

        /**
         * An immutable Color instance initialized to CSS color #6A5ACD
         * <span class="colorSwath" style="background: #6A5ACD;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.SLATEBLUE = Object.freeze(Color.fromCssColorString('#6A5ACD'));

        /**
         * An immutable Color instance initialized to CSS color #708090
         * <span class="colorSwath" style="background: #708090;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.SLATEGRAY = Object.freeze(Color.fromCssColorString('#708090'));

        /**
         * An immutable Color instance initialized to CSS color #708090
         * <span class="colorSwath" style="background: #708090;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.SLATEGREY = Color.SLATEGRAY;

        /**
         * An immutable Color instance initialized to CSS color #FFFAFA
         * <span class="colorSwath" style="background: #FFFAFA;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.SNOW = Object.freeze(Color.fromCssColorString('#FFFAFA'));

        /**
         * An immutable Color instance initialized to CSS color #00FF7F
         * <span class="colorSwath" style="background: #00FF7F;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.SPRINGGREEN = Object.freeze(Color.fromCssColorString('#00FF7F'));

        /**
         * An immutable Color instance initialized to CSS color #4682B4
         * <span class="colorSwath" style="background: #4682B4;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.STEELBLUE = Object.freeze(Color.fromCssColorString('#4682B4'));

        /**
         * An immutable Color instance initialized to CSS color #D2B48C
         * <span class="colorSwath" style="background: #D2B48C;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.TAN = Object.freeze(Color.fromCssColorString('#D2B48C'));

        /**
         * An immutable Color instance initialized to CSS color #008080
         * <span class="colorSwath" style="background: #008080;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.TEAL = Object.freeze(Color.fromCssColorString('#008080'));

        /**
         * An immutable Color instance initialized to CSS color #D8BFD8
         * <span class="colorSwath" style="background: #D8BFD8;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.THISTLE = Object.freeze(Color.fromCssColorString('#D8BFD8'));

        /**
         * An immutable Color instance initialized to CSS color #FF6347
         * <span class="colorSwath" style="background: #FF6347;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.TOMATO = Object.freeze(Color.fromCssColorString('#FF6347'));

        /**
         * An immutable Color instance initialized to CSS color #40E0D0
         * <span class="colorSwath" style="background: #40E0D0;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.TURQUOISE = Object.freeze(Color.fromCssColorString('#40E0D0'));

        /**
         * An immutable Color instance initialized to CSS color #EE82EE
         * <span class="colorSwath" style="background: #EE82EE;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.VIOLET = Object.freeze(Color.fromCssColorString('#EE82EE'));

        /**
         * An immutable Color instance initialized to CSS color #F5DEB3
         * <span class="colorSwath" style="background: #F5DEB3;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.WHEAT = Object.freeze(Color.fromCssColorString('#F5DEB3'));

        /**
         * An immutable Color instance initialized to CSS color #FFFFFF
         * <span class="colorSwath" style="background: #FFFFFF;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.WHITE = Object.freeze(Color.fromCssColorString('#FFFFFF'));

        /**
         * An immutable Color instance initialized to CSS color #F5F5F5
         * <span class="colorSwath" style="background: #F5F5F5;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.WHITESMOKE = Object.freeze(Color.fromCssColorString('#F5F5F5'));

        /**
         * An immutable Color instance initialized to CSS color #FFFF00
         * <span class="colorSwath" style="background: #FFFF00;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.YELLOW = Object.freeze(Color.fromCssColorString('#FFFF00'));

        /**
         * An immutable Color instance initialized to CSS color #9ACD32
         * <span class="colorSwath" style="background: #9ACD32;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.YELLOWGREEN = Object.freeze(Color.fromCssColorString('#9ACD32'));

        /**
         * An immutable Color instance initialized to CSS transparent.
         * <span class="colorSwath" style="background: transparent;"></span>
         *
         * @constant
         * @type {Color}
         */
        Color.TRANSPARENT = Object.freeze(new Color(0, 0, 0, 0));

    exports.Color = Color;

});

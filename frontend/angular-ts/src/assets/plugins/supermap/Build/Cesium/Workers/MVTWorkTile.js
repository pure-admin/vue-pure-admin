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
define(['./when-8d13db60', './createTaskProcessorWorker', './earcut-2.2.1-b404d9e6', './defined-21f7e510', './pbf-9fe59c76'], function (when, createTaskProcessorWorker, earcut2_2_1, defined, pbf) { 'use strict';

    function DictionaryCoder(strings) {
        this._stringToNumber = {};
        this._numberToString = [];
        for (var i = 0; i < strings.length; i++) {
            var string = strings[i];
            this._stringToNumber[string] = i;
            this._numberToString[i] = string;
        }
    }

    DictionaryCoder.prototype.encode = function(string) {
        return this._stringToNumber[string];
    };

    DictionaryCoder.prototype.decode = function(n) {
        return this._numberToString[n];
    };

    var viewTypes = {
        'Int8': Int8Array,
        'Uint8': Uint8Array,
        'Int16': Int16Array,
        'Uint16': Uint16Array,
        'Int32': Int32Array,
        'Uint32': Uint32Array,
        'Float32': Float32Array
    };

    /**
     * Given a list of member fields, create a full StructArrayLayout, in
     * particular calculating the correct byte offset for each field.  This data
     * is used at build time to generate StructArrayLayout_*#emplaceBack() and
     * other accessors, and at runtime for binding vertex buffer attributes.
     *
     * @private
     */
    function createLayout(members, alignment) {
        if (alignment === void 0) alignment = 1;


        var offset = 0;
        var maxSize = 0;
        var layoutMembers = members.map(function (member) {
            //assert_1(member.name.length);
            var typeSize = sizeOf(member.type);
            var memberOffset = offset = align(offset, Math.max(alignment, typeSize));
            var components = member.components || 1;

            maxSize = Math.max(maxSize, typeSize);
            offset += typeSize * components;

            return {
                name: member.name,
                type: member.type,
                components: components,
                offset: memberOffset,
            };
        });

        var size = align(offset, Math.max(maxSize, alignment));

        return {
            members: layoutMembers,
            size: size,
            alignment: alignment
        };
    }

    function sizeOf(type) {
        return viewTypes[type].BYTES_PER_ELEMENT;
    }

    function align(offset, size) {
        return Math.ceil(offset / size) * size;
    }

    var IMAGE_PADDING = 1;

    var ImagePosition = function ImagePosition(paddedRect, ref) {
        var pixelRatio = ref.pixelRatio;
        var version = ref.version;
        var stretchX = ref.stretchX;
        var stretchY = ref.stretchY;
        var content = ref.content;

        this.paddedRect = paddedRect;
        this.pixelRatio = pixelRatio;
        this.stretchX = stretchX;
        this.stretchY = stretchY;
        this.content = content;
        this.version = version;
    };

    var prototypeAccessors = { tl: { configurable: true }, br: { configurable: true }, tlbr: { configurable: true }, displaySize: { configurable: true } };

    prototypeAccessors.tl.get = function () {
        return [
            this.paddedRect.x + IMAGE_PADDING,
            this.paddedRect.y + IMAGE_PADDING
        ];
    };

    prototypeAccessors.br.get = function () {
        return [
            this.paddedRect.x + this.paddedRect.w - IMAGE_PADDING,
            this.paddedRect.y + this.paddedRect.h - IMAGE_PADDING
        ];
    };

    prototypeAccessors.tlbr.get = function () {
        return this.tl.concat(this.br);
    };

    prototypeAccessors.displaySize.get = function () {
        return [
            (this.paddedRect.w - IMAGE_PADDING * 2) / this.pixelRatio,
            (this.paddedRect.h - IMAGE_PADDING * 2) / this.pixelRatio
        ];
    };

    Object.defineProperties(ImagePosition.prototype, prototypeAccessors);

    // Not premultiplied, because ImageData is not premultiplied.
    // UNPACK_PREMULTIPLY_ALPHA_WEBGL must be used when uploading to a texture.
    var RGBAImage = function RGBAImage(size, data) {
        createImage(this, size, 4, data);
    };

    RGBAImage.prototype.resize = function resize(size) {
        resizeImage(this, size, 4);
    };

    RGBAImage.prototype.replace = function replace(data, copy) {
        if (copy) {
            this.data.set(data);
        } else if (data instanceof Uint8ClampedArray) {
            this.data = new Uint8Array(data.buffer);
        } else {
            this.data = data;
        }
    };

    RGBAImage.prototype.clone = function clone() {
        return new RGBAImage({width: this.width, height: this.height}, new Uint8Array(this.data));
    };

    RGBAImage.copy = function copy(srcImg, dstImg, srcPt, dstPt, size) {
        copyImage(srcImg, dstImg, srcPt, dstPt, size, 4);
    };

    function createImage(image, ref, channels, data) {
        var width = ref.width;
        var height = ref.height;

        if (!data) {
            data = new Uint8Array(width * height * channels);
        } else if (data instanceof Uint8ClampedArray) {
            data = new Uint8Array(data.buffer);
        } else if (data.length !== width * height * channels) {
            throw new RangeError('mismatched image size');
        }
        image.width = width;
        image.height = height;
        image.data = data;
        return image;
    }

    function resizeImage(image, ref, channels) {
        var width = ref.width;
        var height = ref.height;

        if (width === image.width && height === image.height) {
            return;
        }

        var newImage = createImage({}, {width: width, height: height}, channels);

        copyImage(image, newImage, {x: 0, y: 0}, {x: 0, y: 0}, {
            width: Math.min(image.width, width),
            height: Math.min(image.height, height)
        }, channels);

        image.width = width;
        image.height = height;
        image.data = newImage.data;
    }

    function copyImage(srcImg, dstImg, srcPt, dstPt, size, channels) {
        if (size.width === 0 || size.height === 0) {
            return dstImg;
        }

        if (size.width > srcImg.width ||
            size.height > srcImg.height ||
            srcPt.x > srcImg.width - size.width ||
            srcPt.y > srcImg.height - size.height) {
            throw new RangeError('out of range source coordinates for image copy');
        }

        if (size.width > dstImg.width ||
            size.height > dstImg.height ||
            dstPt.x > dstImg.width - size.width ||
            dstPt.y > dstImg.height - size.height) {
            throw new RangeError('out of range destination coordinates for image copy');
        }

        var srcData = srcImg.data;
        var dstData = dstImg.data;

        //assert_1(srcData !== dstData);

        for (var y = 0; y < size.height; y++) {
            var srcOffset = ((srcPt.y + y) * srcImg.width + srcPt.x) * channels;
            var dstOffset = ((dstPt.y + y) * dstImg.width + dstPt.x) * channels;
            for (var i = 0; i < size.width * channels; i++) {
                dstData[dstOffset + i] = srcData[srcOffset + i];
            }
        }
        return dstImg;
    }

    function potpack(boxes) {

        // calculate total box area and maximum box width
        var area = 0;
        var maxWidth = 0;

        for (var i$1 = 0, list = boxes; i$1 < list.length; i$1 += 1) {
            var box = list[i$1];

            area += box.w * box.h;
            maxWidth = Math.max(maxWidth, box.w);
        }

        // sort the boxes for insertion by height, descending
        boxes.sort(function (a, b) { return b.h - a.h; });

        // aim for a squarish resulting container,
        // slightly adjusted for sub-100% space utilization
        var startWidth = Math.max(Math.ceil(Math.sqrt(area / 0.95)), maxWidth);

        // start with a single empty space, unbounded at the bottom
        var spaces = [{x: 0, y: 0, w: startWidth, h: Infinity}];

        var width = 0;
        var height = 0;

        for (var i$2 = 0, list$1 = boxes; i$2 < list$1.length; i$2 += 1) {
            // look through spaces backwards so that we check smaller spaces first
            var box$1 = list$1[i$2];

            for (var i = spaces.length - 1; i >= 0; i--) {
                var space = spaces[i];

                // look for empty spaces that can accommodate the current box
                if (box$1.w > space.w || box$1.h > space.h) { continue; }

                // found the space; add the box to its top-left corner
                // |-------|-------|
                // |  box  |       |
                // |_______|       |
                // |         space |
                // |_______________|
                box$1.x = space.x;
                box$1.y = space.y;

                height = Math.max(height, box$1.y + box$1.h);
                width = Math.max(width, box$1.x + box$1.w);

                if (box$1.w === space.w && box$1.h === space.h) {
                    // space matches the box exactly; remove it
                    var last = spaces.pop();
                    if (i < spaces.length) { spaces[i] = last; }

                } else if (box$1.h === space.h) {
                    // space matches the box height; update it accordingly
                    // |-------|---------------|
                    // |  box  | updated space |
                    // |_______|_______________|
                    space.x += box$1.w;
                    space.w -= box$1.w;

                } else if (box$1.w === space.w) {
                    // space matches the box width; update it accordingly
                    // |---------------|
                    // |      box      |
                    // |_______________|
                    // | updated space |
                    // |_______________|
                    space.y += box$1.h;
                    space.h -= box$1.h;

                } else {
                    // otherwise the box splits the space into two spaces
                    // |-------|-----------|
                    // |  box  | new space |
                    // |_______|___________|
                    // | updated space     |
                    // |___________________|
                    spaces.push({
                        x: space.x + box$1.w,
                        y: space.y,
                        w: space.w - box$1.w,
                        h: box$1.h
                    });
                    space.y += box$1.h;
                    space.h -= box$1.h;
                }
                break;
            }
        }

        return {
            w: width, // container width
            h: height, // container height
            fill: (area / (width * height)) || 0 // space utilization
        };
    }

    var IMAGE_PADDING$1 = 1;

    var ImageAtlas = function ImageAtlas(icons, patterns) {
        var iconPositions = {}, patternPositions = {};
        this.haveRenderCallbacks = [];

        var bins = [];

        this.addImages(icons, iconPositions, bins);
        this.addImages(patterns, patternPositions, bins);

        var ref = potpack(bins);
        var w = ref.w;
        var h = ref.h;
        var image = new RGBAImage({width: w || 1, height: h || 1});

        for (var id in icons) {
            var src = icons[id];
            var bin = iconPositions[id].paddedRect;
            RGBAImage.copy(src.data, image, {x: 0, y: 0}, {x: bin.x + IMAGE_PADDING$1, y: bin.y + IMAGE_PADDING$1}, src.data);
        }

        for (var id$1 in patterns) {
            var src$1 = patterns[id$1];
            var bin$1 = patternPositions[id$1].paddedRect;
            var x = bin$1.x + IMAGE_PADDING$1,
                y = bin$1.y + IMAGE_PADDING$1,
                w$1 = src$1.data.width,
                h$1 = src$1.data.height;

            RGBAImage.copy(src$1.data, image, {x: 0, y: 0}, {x: x, y: y}, src$1.data);
            // Add 1 pixel wrapped padding on each side of the image.
            RGBAImage.copy(src$1.data, image, {x: 0, y: h$1 - 1}, {x: x, y: y - 1}, {width: w$1, height: 1}); // T
            RGBAImage.copy(src$1.data, image, {x: 0, y: 0}, {x: x, y: y + h$1}, {width: w$1, height: 1}); // B
            RGBAImage.copy(src$1.data, image, {x: w$1 - 1, y: 0}, {x: x - 1, y: y}, {width: 1, height: h$1}); // L
            RGBAImage.copy(src$1.data, image, {x: 0, y: 0}, {x: x + w$1, y: y}, {width: 1, height: h$1}); // R
        }

        this.image = image;
        this.iconPositions = iconPositions;
        this.patternPositions = patternPositions;
    };

    ImageAtlas.prototype.addImages = function addImages(images, positions, bins) {
        for (var id in images) {
            var src = images[id];
            var bin = {
                x: 0,
                y: 0,
                w: src.data.width + 2 * IMAGE_PADDING$1,
                h: src.data.height + 2 * IMAGE_PADDING$1,
            };
            bins.push(bin);
            positions[id] = new ImagePosition(bin, src);

            if (src.hasRenderCallback) {
                this.haveRenderCallbacks.push(id);
            }
        }
    };

    ImageAtlas.prototype.patchUpdatedImages = function patchUpdatedImages(imageManager, texture) {
        imageManager.dispatchRenderCallbacks(this.haveRenderCallbacks);
        for (var name in imageManager.updatedImages) {
            this.patchUpdatedImage(this.iconPositions[name], imageManager.getImage(name), texture);
            this.patchUpdatedImage(this.patternPositions[name], imageManager.getImage(name), texture);
        }
    };

    ImageAtlas.prototype.patchUpdatedImage = function patchUpdatedImage(position, image, texture) {
        if (!position || !image) {
            return;
        }

        if (position.version === image.version) {
            return;
        }

        position.version = image.version;
        var ref = position.tl;
        var x = ref[0];
        var y = ref[1];
        texture.update(image.data, undefined, {x: x, y: y});
    };

    // http://www.w3.org/TR/css3-color/
    var kCSSColorTable = {
        "transparent": [0,0,0,0], "aliceblue": [240,248,255,1],
        "antiquewhite": [250,235,215,1], "aqua": [0,255,255,1],
        "aquamarine": [127,255,212,1], "azure": [240,255,255,1],
        "beige": [245,245,220,1], "bisque": [255,228,196,1],
        "black": [0,0,0,1], "blanchedalmond": [255,235,205,1],
        "blue": [0,0,255,1], "blueviolet": [138,43,226,1],
        "brown": [165,42,42,1], "burlywood": [222,184,135,1],
        "cadetblue": [95,158,160,1], "chartreuse": [127,255,0,1],
        "chocolate": [210,105,30,1], "coral": [255,127,80,1],
        "cornflowerblue": [100,149,237,1], "cornsilk": [255,248,220,1],
        "crimson": [220,20,60,1], "cyan": [0,255,255,1],
        "darkblue": [0,0,139,1], "darkcyan": [0,139,139,1],
        "darkgoldenrod": [184,134,11,1], "darkgray": [169,169,169,1],
        "darkgreen": [0,100,0,1], "darkgrey": [169,169,169,1],
        "darkkhaki": [189,183,107,1], "darkmagenta": [139,0,139,1],
        "darkolivegreen": [85,107,47,1], "darkorange": [255,140,0,1],
        "darkorchid": [153,50,204,1], "darkred": [139,0,0,1],
        "darksalmon": [233,150,122,1], "darkseagreen": [143,188,143,1],
        "darkslateblue": [72,61,139,1], "darkslategray": [47,79,79,1],
        "darkslategrey": [47,79,79,1], "darkturquoise": [0,206,209,1],
        "darkviolet": [148,0,211,1], "deeppink": [255,20,147,1],
        "deepskyblue": [0,191,255,1], "dimgray": [105,105,105,1],
        "dimgrey": [105,105,105,1], "dodgerblue": [30,144,255,1],
        "firebrick": [178,34,34,1], "floralwhite": [255,250,240,1],
        "forestgreen": [34,139,34,1], "fuchsia": [255,0,255,1],
        "gainsboro": [220,220,220,1], "ghostwhite": [248,248,255,1],
        "gold": [255,215,0,1], "goldenrod": [218,165,32,1],
        "gray": [128,128,128,1], "green": [0,128,0,1],
        "greenyellow": [173,255,47,1], "grey": [128,128,128,1],
        "honeydew": [240,255,240,1], "hotpink": [255,105,180,1],
        "indianred": [205,92,92,1], "indigo": [75,0,130,1],
        "ivory": [255,255,240,1], "khaki": [240,230,140,1],
        "lavender": [230,230,250,1], "lavenderblush": [255,240,245,1],
        "lawngreen": [124,252,0,1], "lemonchiffon": [255,250,205,1],
        "lightblue": [173,216,230,1], "lightcoral": [240,128,128,1],
        "lightcyan": [224,255,255,1], "lightgoldenrodyellow": [250,250,210,1],
        "lightgray": [211,211,211,1], "lightgreen": [144,238,144,1],
        "lightgrey": [211,211,211,1], "lightpink": [255,182,193,1],
        "lightsalmon": [255,160,122,1], "lightseagreen": [32,178,170,1],
        "lightskyblue": [135,206,250,1], "lightslategray": [119,136,153,1],
        "lightslategrey": [119,136,153,1], "lightsteelblue": [176,196,222,1],
        "lightyellow": [255,255,224,1], "lime": [0,255,0,1],
        "limegreen": [50,205,50,1], "linen": [250,240,230,1],
        "magenta": [255,0,255,1], "maroon": [128,0,0,1],
        "mediumaquamarine": [102,205,170,1], "mediumblue": [0,0,205,1],
        "mediumorchid": [186,85,211,1], "mediumpurple": [147,112,219,1],
        "mediumseagreen": [60,179,113,1], "mediumslateblue": [123,104,238,1],
        "mediumspringgreen": [0,250,154,1], "mediumturquoise": [72,209,204,1],
        "mediumvioletred": [199,21,133,1], "midnightblue": [25,25,112,1],
        "mintcream": [245,255,250,1], "mistyrose": [255,228,225,1],
        "moccasin": [255,228,181,1], "navajowhite": [255,222,173,1],
        "navy": [0,0,128,1], "oldlace": [253,245,230,1],
        "olive": [128,128,0,1], "olivedrab": [107,142,35,1],
        "orange": [255,165,0,1], "orangered": [255,69,0,1],
        "orchid": [218,112,214,1], "palegoldenrod": [238,232,170,1],
        "palegreen": [152,251,152,1], "paleturquoise": [175,238,238,1],
        "palevioletred": [219,112,147,1], "papayawhip": [255,239,213,1],
        "peachpuff": [255,218,185,1], "peru": [205,133,63,1],
        "pink": [255,192,203,1], "plum": [221,160,221,1],
        "powderblue": [176,224,230,1], "purple": [128,0,128,1],
        "rebeccapurple": [102,51,153,1],
        "red": [255,0,0,1], "rosybrown": [188,143,143,1],
        "royalblue": [65,105,225,1], "saddlebrown": [139,69,19,1],
        "salmon": [250,128,114,1], "sandybrown": [244,164,96,1],
        "seagreen": [46,139,87,1], "seashell": [255,245,238,1],
        "sienna": [160,82,45,1], "silver": [192,192,192,1],
        "skyblue": [135,206,235,1], "slateblue": [106,90,205,1],
        "slategray": [112,128,144,1], "slategrey": [112,128,144,1],
        "snow": [255,250,250,1], "springgreen": [0,255,127,1],
        "steelblue": [70,130,180,1], "tan": [210,180,140,1],
        "teal": [0,128,128,1], "thistle": [216,191,216,1],
        "tomato": [255,99,71,1], "turquoise": [64,224,208,1],
        "violet": [238,130,238,1], "wheat": [245,222,179,1],
        "white": [255,255,255,1], "whitesmoke": [245,245,245,1],
        "yellow": [255,255,0,1], "yellowgreen": [154,205,50,1]};

    function clamp_css_byte(i) {  // Clamp to integer 0 .. 255.
        i = Math.round(i);  // Seems to be what Chrome does (vs truncation).
        return i < 0 ? 0 : i > 255 ? 255 : i;
    }

    function clamp_css_float(f) {  // Clamp to float 0.0 .. 1.0.
        return f < 0 ? 0 : f > 1 ? 1 : f;
    }

    function parse_css_int(str) {  // int or percentage.
        if (str[str.length - 1] === '%')
            return clamp_css_byte(parseFloat(str) / 100 * 255);
        return clamp_css_byte(parseInt(str));
    }

    function parse_css_float(str) {  // float or percentage.
        if (str[str.length - 1] === '%')
            return clamp_css_float(parseFloat(str) / 100);
        return clamp_css_float(parseFloat(str));
    }

    function css_hue_to_rgb(m1, m2, h) {
        if (h < 0) h += 1;
        else if (h > 1) h -= 1;

        if (h * 6 < 1) return m1 + (m2 - m1) * h * 6;
        if (h * 2 < 1) return m2;
        if (h * 3 < 2) return m1 + (m2 - m1) * (2/3 - h) * 6;
        return m1;
    }

    function parseCSSColor(css_str) {
        // Remove all whitespace, not compliant, but should just be more accepting.
        var str = css_str.replace(/ /g, '').toLowerCase();

        // Color keywords (and transparent) lookup.
        if (str in kCSSColorTable) return kCSSColorTable[str].slice();  // dup.

        // #abc and #abc123 syntax.
        if (str[0] === '#') {
            if (str.length === 4) {
                var iv = parseInt(str.substr(1), 16);  // TODO(deanm): Stricter parsing.
                if (!(iv >= 0 && iv <= 0xfff)) return null;  // Covers NaN.
                return [((iv & 0xf00) >> 4) | ((iv & 0xf00) >> 8),
                    (iv & 0xf0) | ((iv & 0xf0) >> 4),
                    (iv & 0xf) | ((iv & 0xf) << 4),
                    1];
            } else if (str.length === 7) {
                var iv = parseInt(str.substr(1), 16);  // TODO(deanm): Stricter parsing.
                if (!(iv >= 0 && iv <= 0xffffff)) return null;  // Covers NaN.
                return [(iv & 0xff0000) >> 16,
                    (iv & 0xff00) >> 8,
                    iv & 0xff,
                    1];
            }

            return null;
        }

        var op = str.indexOf('('), ep = str.indexOf(')');
        if (op !== -1 && ep + 1 === str.length) {
            var fname = str.substr(0, op);
            var params = str.substr(op+1, ep-(op+1)).split(',');
            var alpha = 1;  // To allow case fallthrough.
            switch (fname) {
                case 'rgba':
                    if (params.length !== 4) return null;
                    alpha = parse_css_float(params.pop());
                // Fall through.
                case 'rgb':
                    if (params.length !== 3) return null;
                    return [parse_css_int(params[0]),
                        parse_css_int(params[1]),
                        parse_css_int(params[2]),
                        alpha];
                case 'hsla':
                    if (params.length !== 4) return null;
                    alpha = parse_css_float(params.pop());
                // Fall through.
                case 'hsl':
                    if (params.length !== 3) return null;
                    var h = (((parseFloat(params[0]) % 360) + 360) % 360) / 360;  // 0 .. 1
                    // NOTE(deanm): According to the CSS spec s/l should only be
                    // percentages, but we don't bother and let float or percentage.
                    var s = parse_css_float(params[1]);
                    var l = parse_css_float(params[2]);
                    var m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
                    var m1 = l * 2 - m2;
                    return [clamp_css_byte(css_hue_to_rgb(m1, m2, h+1/3) * 255),
                        clamp_css_byte(css_hue_to_rgb(m1, m2, h) * 255),
                        clamp_css_byte(css_hue_to_rgb(m1, m2, h-1/3) * 255),
                        alpha];
                default:
                    return null;
            }
        }

        return null;
    }

    /**
     * An RGBA color value. Create instances from color strings using the static
     * method `Color.parse`. The constructor accepts RGB channel values in the range
     * `[0, 1]`, premultiplied by A.
     *
     * @param {number} r The red channel.
     * @param {number} g The green channel.
     * @param {number} b The blue channel.
     * @param {number} a The alpha channel.
     * @private
     */
    var Color$1 = function Color(r, g, b, a) {
        if (a === void 0) a = 1;

        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    };

    /**
     * Parses valid CSS color strings and returns a `Color` instance.
     * @returns A `Color` instance, or `undefined` if the input is not a valid color string.
     */
    Color$1.parse = function parse(input) {
        if (!input) {
            return undefined;
        }

        if (input instanceof Color$1) {
            return input;
        }

        if (typeof input !== 'string') {
            return undefined;
        }

        var rgba = parseCSSColor(input);
        if (!rgba) {
            return undefined;
        }

        return new Color$1(
            rgba[0] / 255 * rgba[3],
            rgba[1] / 255 * rgba[3],
            rgba[2] / 255 * rgba[3],
            rgba[3]
        );
    };

    /**
     * Returns an RGBA string representing the color value.
     *
     * @returns An RGBA string.
     * @example
     * var purple = new Color.parse('purple');
     * purple.toString; // = "rgba(128,0,128,1)"
     * var translucentGreen = new Color.parse('rgba(26, 207, 26, .73)');
     * translucentGreen.toString(); // = "rgba(26,207,26,0.73)"
     */
    Color$1.prototype.toString = function toString() {
        var ref = this.toArray();
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        var a = ref[3];
        return ("rgba(" + (Math.round(r)) + "," + (Math.round(g)) + "," + (Math.round(b)) + "," + a + ")");
    };

    Color$1.prototype.toArray = function toArray() {
        var ref = this;
        var r = ref.r;
        var g = ref.g;
        var b = ref.b;
        var a = ref.a;
        return a === 0 ? [0, 0, 0, 0] : [
            r * 255 / a,
            g * 255 / a,
            b * 255 / a,
            a
        ];
    };

    Color$1.black = new Color$1(0, 0, 0, 1);
    Color$1.white = new Color$1(1, 1, 1, 1);
    Color$1.transparent = new Color$1(0, 0, 0, 0);
    Color$1.red = new Color$1(1, 0, 0, 1);

    var NullType = {kind: 'null'};
    var NumberType$1 = {kind: 'number'};
    var StringType = {kind: 'string'};
    var BooleanType = {kind: 'boolean'};
    var ColorType$1 = {kind: 'color'};
    var ObjectType = {kind: 'object'};
    var ValueType = {kind: 'value'};
    var FormattedType = {kind: 'formatted'};
    var ResolvedImageType = {kind: 'resolvedImage'};

    function array(itemType, N) {
        return {
            kind: 'array',
            itemType: itemType,
            N: N
        };
    }

    function toString$2(type) {
        if (type.kind === 'array') {
            var itemType = toString$2(type.itemType);
            return typeof type.N === 'number' ?
                ("array<" + itemType + ", " + (type.N) + ">") :
                type.itemType.kind === 'value' ? 'array' : ("array<" + itemType + ">");
        } else {
            return type.kind;
        }
    }

    var valueMemberTypes = [
        NullType,
        NumberType$1,
        StringType,
        BooleanType,
        ColorType$1,
        FormattedType,
        ObjectType,
        array(ValueType),
        ResolvedImageType
    ];

    /**
     * Returns null if `t` is a subtype of `expected`; otherwise returns an
     * error message.
     * @private
     */
    function checkSubtype(expected, t) {
        if (t.kind === 'error') {
            // Error is a subtype of every type
            return null;
        } else if (expected.kind === 'array') {
            if (t.kind === 'array' &&
                ((t.N === 0 && t.itemType.kind === 'value') || !checkSubtype(expected.itemType, t.itemType)) &&
                (typeof expected.N !== 'number' || expected.N === t.N)) {
                return null;
            }
        } else if (expected.kind === t.kind) {
            return null;
        } else if (expected.kind === 'value') {
            for (var i = 0, list = valueMemberTypes; i < list.length; i += 1) {
                var memberType = list[i];

                if (!checkSubtype(memberType, t)) {
                    return null;
                }
            }
        }

        return ("Expected " + (toString$2(expected)) + " but found " + (toString$2(t)) + " instead.");
    }

    var Collator = function Collator(caseSensitive       , diacriticSensitive       , locale             ) {
        if (caseSensitive)
        { this.sensitivity = diacriticSensitive ? 'variant' : 'case'; }
        else
        { this.sensitivity = diacriticSensitive ? 'accent' : 'base'; }

        this.locale = locale;
        this.collator = new Intl.Collator(this.locale ? this.locale : [],
            {sensitivity: this.sensitivity, usage: 'search'});
    };

    Collator.prototype.compare = function compare (lhs      , rhs      )       {
        return this.collator.compare(lhs, rhs);
    };

    Collator.prototype.resolvedLocale = function resolvedLocale ()       {
        // We create a Collator without "usage: search" because we don't want
        // the search options encoded in our result (e.g. "en-u-co-search")
        return new Intl.Collator(this.locale ? this.locale : [])
            .resolvedOptions().locale;
    };

    var FormattedSection = function FormattedSection(text, image, scale, fontStack, textColor) {
        this.text = text;
        this.image = image;
        this.scale = scale;
        this.fontStack = fontStack;
        this.textColor = textColor;
    };

    var Formatted$1 = function Formatted(sections) {
        this.sections = sections;
    };

    Formatted$1.fromString = function fromString(unformatted) {
        return new Formatted$1([new FormattedSection(unformatted, null, null, null, null)]);
    };

    Formatted$1.prototype.isEmpty = function isEmpty() {
        if (this.sections.length === 0) {
            return true;
        }
        return !this.sections.some(function (section) {
            return section.text.length !== 0 ||
                (section.image && section.image.name.length !== 0);
        });
    };

    Formatted$1.factory = function factory(text) {
        if (text instanceof Formatted$1) {
            return text;
        } else {
            return Formatted$1.fromString(text);
        }
    };

    Formatted$1.prototype.toString = function toString() {
        if (this.sections.length === 0) {
            return '';
        }
        return this.sections.map(function (section) {
            return section.text;
        }).join('');
    };

    Formatted$1.prototype.serialize = function serialize() {
        var serialized = ["format"];
        for (var i = 0, list = this.sections; i < list.length; i += 1) {
            var section = list[i];

            if (section.image) {
                serialized.push(["image", section.image.name]);
                continue;
            }
            serialized.push(section.text);
            var options = {};
            if (section.fontStack) {
                options["text-font"] = ["literal", section.fontStack.split(',')];
            }
            if (section.scale) {
                options["font-scale"] = section.scale;
            }
            if (section.textColor) {
                options["text-color"] = (["rgba"]          ).concat(section.textColor.toArray());
            }
            serialized.push(options);
        }
        return serialized;
    };

    var ResolvedImage$1 = function ResolvedImage(options) {
        this.name = options.name;
        this.available = options.available;
    };

    ResolvedImage$1.prototype.toString = function toString() {
        return this.name;
    };

    ResolvedImage$1.fromString = function fromString(name) {
        return new ResolvedImage$1({name: name, available: false});
    };

    ResolvedImage$1.prototype.serialize = function serialize() {
        return ["image", this.name];
    };

    var NullType$1 = {kind: 'null'};
    var NumberType$2 = {kind: 'number'};
    var StringType$1 = {kind: 'string'};
    var BooleanType$1 = {kind: 'boolean'};
    var ColorType$2 = {kind: 'color'};
    var ObjectType$1 = {kind: 'object'};
    var ValueType$1 = {kind: 'value'};
    var CollatorType = {kind: 'collator'};
    var FormattedType$1 = {kind: 'formatted'};
    var ResolvedImageType$1 = {kind: 'resolvedImage'};

    function array$1(itemType, N) {
        return {
            kind: 'array',
            itemType: itemType,
            N: N
        };
    }

    function Values$1() {
    }

    Values$1.validateRGBA = function(r, g, b, a){
        if (!(
            typeof r === 'number' && r >= 0 && r <= 255 &&
                typeof g === 'number' && g >= 0 && g <= 255 &&
                typeof b === 'number' && b >= 0 && b <= 255
            )) {
            var value = typeof a === 'number' ? [r, g, b, a] : [r, g, b];
            return ("Invalid rgba value [" + (value.join(', ')) + "]: 'r', 'g', and 'b' must be between 0 and 255.");
        }
        if (!(
            typeof a === 'undefined' || (typeof a === 'number' && a >= 0 && a <= 1)
            )) {
            return ("Invalid rgba value [" + ([r, g, b, a].join(', ')) + "]: 'a' must be between 0 and 1.");
        }
        return null;
    };

    Values$1.isValue = function(mixed){
        if (mixed === null) {
            return true;
        } else if (typeof mixed === 'string') {
            return true;
        } else if (typeof mixed === 'boolean') {
            return true;
        } else if (typeof mixed === 'number') {
            return true;
        } else if (mixed instanceof Color$1) {
            return true;
        } else if (mixed instanceof Collator) {
            return true;
        } else if (mixed instanceof Formatted$1) {
            return true;
        } else if (mixed instanceof ResolvedImage$1) {
            return true;
        } else if (Array.isArray(mixed)) {
            for (var i = 0, list = mixed; i < list.length; i += 1) {
                var item = list[i];

                if (!Values$1.isValue(item)) {
                    return false;
                }
            }
            return true;
        } else if (typeof mixed === 'object') {
            for (var key in mixed) {
                if (!Values$1.isValue(mixed[key])) {
                    return false;
                }
            }
            return true;
        } else {
            return false;
        }
    };

    Values$1.typeOf = function(value){
        if (value === null) {
            return NullType$1;
        } else if (typeof value === 'string') {
            return StringType$1;
        } else if (typeof value === 'boolean') {
            return BooleanType$1;
        } else if (typeof value === 'number') {
            return NumberType$2;
        } else if (value instanceof Color$1) {
            return ColorType$2;
        } else if (value instanceof Collator) {
            return CollatorType;
        } else if (value instanceof Formatted$1) {
            return FormattedType$1;
        } else if (value instanceof ResolvedImage$1) {
            return ResolvedImageType$1;
        } else if (Array.isArray(value)) {
            var length = value.length;
            var itemType;

            for (var i = 0, list = value; i < list.length; i += 1) {
                var item = list[i];

                var t = Values$1.typeOf(item);
                if (!itemType) {
                    itemType = t;
                } else if (itemType === t) {
                    continue;
                } else {
                    itemType = ValueType$1;
                    break;
                }
            }

            return array$1(itemType || ValueType$1, length);
        } else {
            assert_1(typeof value === 'object');
            return ObjectType$1;
        }
    };

    Values$1.toString$1 = function(value){
        var type = typeof value;
        if (value === null) {
            return '';
        } else if (type === 'string' || type === 'number' || type === 'boolean') {
            return String(value);
        } else if (value instanceof Color$1 || value instanceof Formatted$1 || value instanceof ResolvedImage$1) {
            return value.toString();
        } else {
            return JSON.stringify(value);
        }
    };

    var NumberType$3 = {kind: 'number'};
    var StringType$2 = {kind: 'string'};
    var BooleanType$2 = {kind: 'boolean'};
    var ObjectType$2 = {kind: 'object'};
    var ValueType$2 = {kind: 'value'};

    function array$2(itemType, N) {
        return {
            kind: 'array',
            itemType: itemType,
            N: N
        };
    }

    var types = {
        string: StringType$2,
        number: NumberType$3,
        boolean: BooleanType$2,
        object: ObjectType$2
    };

    var Assertion = function Assertion(type, args) {
        this.type = type;
        this.args = args;
    };

    Assertion.parse = function parse(args, context) {
        if (args.length < 2) {
            return context.error("Expected at least one argument.");
        }

        var i = 1;
        var type;

        var name = (args[0] );
        if (name === 'array') {
            var itemType;
            if (args.length > 2) {
                var type$1 = args[1];
                if (typeof type$1 !== 'string' || !(type$1 in types) || type$1 === 'object') {
                    return context.error('The item type argument of "array" must be one of string, number, boolean', 1);
                }
                itemType = types[type$1];
                i++;
            } else {
                itemType = ValueType$2;
            }

            var N;
            if (args.length > 3) {
                if (args[2] !== null &&
                    (typeof args[2] !== 'number' ||
                        args[2] < 0 ||
                        args[2] !== Math.floor(args[2]))
                    ) {
                    return context.error('The length argument to "array" must be a positive integer literal', 2);
                }
                N = args[2];
                i++;
            }

            type = array$2(itemType, N);
        } else {
            assert_1(types[name], name);
            type = types[name];
        }

        var parsed = [];
        for (; i < args.length; i++) {
            var input = context.parse(args[i], i, ValueType$2);
            if (!input) {
                return null;
            }
            parsed.push(input);
        }

        return new Assertion(type, parsed);
    };

    Assertion.prototype.evaluate = function evaluate(ctx) {
        for (var i = 0; i < this.args.length; i++) {
            var value = this.args[i].evaluate(ctx);
            var error = checkSubtype(this.type, Values$1.typeOf(value));
            if (!error) {
                return value;
            } else if (i === this.args.length - 1) {
                throw new RuntimeError(("Expected value to be of type " + (toString(this.type)) + ", but found " + (toString(Values$1.typeOf(value))) + " instead."));
            }
        }

        assert_1(false);
        return null;
    };

    Assertion.prototype.eachChild = function eachChild(fn) {
        this.args.forEach(fn);
    };

    Assertion.prototype.possibleOutputs = function possibleOutputs() {
        var ref;

        return (ref = []).concat.apply(ref, this.args.map(function (arg) {
            return arg.possibleOutputs();
        }));
    };

    Assertion.prototype.serialize = function serialize() {
        var type = this.type;
        var serialized = [type.kind];
        if (type.kind === 'array') {
            var itemType = type.itemType;
            if (itemType.kind === 'string' ||
                itemType.kind === 'number' ||
                itemType.kind === 'boolean') {
                serialized.push(itemType.kind);
                var N = type.N;
                if (typeof N === 'number' || this.args.length > 1) {
                    serialized.push(N);
                }
            }
        }
        return serialized.concat(this.args.map(function (arg) {
            return arg.serialize();
        }));
    };

    var NumberType$4 = {kind: 'number'};
    var ValueType$3 = {kind: 'value'};

    function array$3(itemType, N) {
        return {
            kind: 'array',
            itemType: itemType,
            N: N
        };
    }

    var At = function At(type, index, input) {
        this.type = type;
        this.index = index;
        this.input = input;
    };

    At.parse = function parse(args, context) {
        if (args.length !== 3) {
            return context.error(("Expected 2 arguments, but found " + (args.length - 1) + " instead."));
        }

        var index = context.parse(args[1], 1, NumberType$4);
        var input = context.parse(args[2], 2, array$3(context.expectedType || ValueType$3));

        if (!index || !input) {
            return null;
        }

        var t = (input.type );
        return new At(t.itemType, index, input);
    };

    At.prototype.evaluate = function evaluate(ctx) {
        var index = ((this.index.evaluate(ctx) )    );
        var array = ((this.input.evaluate(ctx) )          );

        if (index < 0) {
            throw new RuntimeError(("Array index out of bounds: " + index + " < 0."));
        }

        if (index >= array.length) {
            throw new RuntimeError(("Array index out of bounds: " + index + " > " + (array.length - 1) + "."));
        }

        if (index !== Math.floor(index)) {
            throw new RuntimeError(("Array index must be an integer, but found " + index + " instead."));
        }

        return array[index];
    };

    At.prototype.eachChild = function eachChild(fn) {
        fn(this.index);
        fn(this.input);
    };

    At.prototype.possibleOutputs = function possibleOutputs() {
        return [undefined];
    };

    At.prototype.serialize = function serialize() {
        return ["at", this.index.serialize(), this.input.serialize()];
    };

    var BooleanType$3 = {kind: 'boolean'};

    var Case = function Case(type, branches, otherwise) {
        this.type = type;
        this.branches = branches;
        this.otherwise = otherwise;
    };

    Case.parse = function parse(args, context) {
        if (args.length < 4) {
            return context.error(("Expected at least 3 arguments, but found only " + (args.length - 1) + "."));
        }
        if (args.length % 2 !== 0) {
            return context.error("Expected an odd number of arguments.");
        }

        var outputType;
        if (context.expectedType && context.expectedType.kind !== 'value') {
            outputType = context.expectedType;
        }

        var branches = [];
        for (var i = 1; i < args.length - 1; i += 2) {
            var test = context.parse(args[i], i, BooleanType$3);
            if (!test) {
                return null;
            }

            var result = context.parse(args[i + 1], i + 1, outputType);
            if (!result) {
                return null;
            }

            branches.push([test, result]);

            outputType = outputType || result.type;
        }

        var otherwise = context.parse(args[args.length - 1], args.length - 1, outputType);
        if (!otherwise) {
            return null;
        }

        assert_1(outputType);
        return new Case((outputType ), branches, otherwise);
    };

    Case.prototype.evaluate = function evaluate(ctx) {
        for (var i = 0, list = this.branches; i < list.length; i += 1) {
            var ref = list[i];
            var test = ref[0];
            var expression = ref[1];

            if (test.evaluate(ctx)) {
                return expression.evaluate(ctx);
            }
        }
        return this.otherwise.evaluate(ctx);
    };

    Case.prototype.eachChild = function eachChild(fn) {
        for (var i = 0, list = this.branches; i < list.length; i += 1) {
            var ref = list[i];
            var test = ref[0];
            var expression = ref[1];

            fn(test);
            fn(expression);
        }
        fn(this.otherwise);
    };

    Case.prototype.possibleOutputs = function possibleOutputs() {
        var ref;

        return (ref = [])
            .concat.apply(ref, this.branches.map(function (ref) {
                var _ = ref[0];
                var out = ref[1];

                return out.possibleOutputs();
            }))
            .concat(this.otherwise.possibleOutputs());
    };

    Case.prototype.serialize = function serialize() {
        var serialized = ["case"];
        this.eachChild(function (child) {
            serialized.push(child.serialize());
        });
        return serialized;
    };

    var ValueType$4 = {kind: 'value'};

    var Coalesce = function Coalesce(type, args) {
        this.type = type;
        this.args = args;
    };

    Coalesce.parse = function parse(args, context) {
        if (args.length < 2) {
            return context.error("Expectected at least one argument.");
        }
        var outputType = (null );
        var expectedType = context.expectedType;
        if (expectedType && expectedType.kind !== 'value') {
            outputType = expectedType;
        }
        var parsedArgs = [];

        for (var i = 0, list = args.slice(1); i < list.length; i += 1) {
            var arg = list[i];

            var parsed = context.parse(arg, 1 + parsedArgs.length, outputType, undefined, {typeAnnotation: 'omit'});
            if (!parsed) {
                return null;
            }
            outputType = outputType || parsed.type;
            parsedArgs.push(parsed);
        }
        assert_1(outputType);

        // Above, we parse arguments without inferred type annotation so that
        // they don't produce a runtime error for `null` input, which would
        // preempt the desired null-coalescing behavior.
        // Thus, if any of our arguments would have needed an annotation, we
        // need to wrap the enclosing coalesce expression with it instead.
        var needsAnnotation = expectedType &&
            parsedArgs.some(function (arg) {
                return checkSubtype(expectedType, arg.type);
            });

        return needsAnnotation ?
            new Coalesce(ValueType$4, parsedArgs) :
            new Coalesce((outputType ), parsedArgs);
    };

    Coalesce.prototype.evaluate = function evaluate(ctx) {
        var result = null;
        var argCount = 0;
        var requestedImageName;
        for (var i = 0, list = this.args; i < list.length; i += 1) {
            var arg = list[i];

            argCount++;
            result = arg.evaluate(ctx);
            // we need to keep track of the first requested image in a coalesce statement
            // if coalesce can't find a valid image, we return the first image name so styleimagemissing can fire
            if (result && result instanceof ResolvedImage$1 && !result.available) {
                if (!requestedImageName) {
                    requestedImageName = result.name;
                }
                result = null;
                if (argCount === this.args.length) {
                    result = requestedImageName;
                }
            }

            if (result !== null) {
                break;
            }
        }
        return result;
    };

    Coalesce.prototype.eachChild = function eachChild(fn) {
        this.args.forEach(fn);
    };

    Coalesce.prototype.possibleOutputs = function possibleOutputs() {
        var ref;

        return (ref = []).concat.apply(ref, this.args.map(function (arg) {
            return arg.possibleOutputs();
        }));
    };

    Coalesce.prototype.serialize = function serialize() {
        var serialized = ["coalesce"];
        this.eachChild(function (child) {
            serialized.push(child.serialize());
        });
        return serialized;
    };

    var NumberType$5 = {kind: 'number'};
    var StringType$3 = {kind: 'string'};
    var BooleanType$4 = {kind: 'boolean'};
    var ColorType$3 = {kind: 'color'};
    var ValueType$5 = {kind: 'value'};

    var types$1 = {
        'to-boolean': BooleanType$4,
        'to-color': ColorType$3,
        'to-number': NumberType$5,
        'to-string': StringType$3
    };

    /**
     * Special form for error-coalescing coercion expressions "to-number",
     * "to-color".  Since these coercions can fail at runtime, they accept multiple
     * arguments, only evaluating one at a time until one succeeds.
     *
     * @private
     */
    var Coercion = function Coercion(type, args) {
        this.type = type;
        this.args = args;
    };

    Coercion.parse = function parse(args, context) {
        if (args.length < 2) {
            return context.error("Expected at least one argument.");
        }

        var name = (args[0] );
        assert_1(types$1[name], name);

        if ((name === 'to-boolean' || name === 'to-string') && args.length !== 2) {
            return context.error("Expected one argument.");
        }

        var type = types$1[name];

        var parsed = [];
        for (var i = 1; i < args.length; i++) {
            var input = context.parse(args[i], i, ValueType$5);
            if (!input) {
                return null;
            }
            parsed.push(input);
        }

        return new Coercion(type, parsed);
    };

    Coercion.prototype.evaluate = function evaluate(ctx) {
        if (this.type.kind === 'boolean') {
            return Boolean(this.args[0].evaluate(ctx));
        } else if (this.type.kind === 'color') {
            var input;
            var error;
            for (var i = 0, list = this.args; i < list.length; i += 1) {
                var arg = list[i];

                input = arg.evaluate(ctx);
                error = null;
                if (input instanceof Color) {
                    return input;
                } else if (typeof input === 'string') {
                    var c = ctx.parseColor(input);
                    if (c) {
                        return c;
                    }
                } else if (Array.isArray(input)) {
                    if (input.length < 3 || input.length > 4) {
                        error = "Invalid rbga value " + (JSON.stringify(input)) + ": expected an array containing either three or four numeric values.";
                    } else {
                        error = validateRGBA(input[0], input[1], input[2], input[3]);
                    }
                    if (!error) {
                        return new Color((input[0] ) / 255, (input[1] ) / 255, (input[2] ) / 255, (input[3] ));
                    }
                }
            }
            throw new RuntimeError(error || ("Could not parse color from value '" + (typeof input === 'string' ? input : String(JSON.stringify(input))) + "'"));
        } else if (this.type.kind === 'number') {
            var value = null;
            for (var i$1 = 0, list$1 = this.args; i$1 < list$1.length; i$1 += 1) {
                var arg$1 = list$1[i$1];

                value = arg$1.evaluate(ctx);
                if (value === null) {
                    return 0;
                }
                var num = Number(value);
                if (isNaN(num)) {
                    continue;
                }
                return num;
            }
            throw new RuntimeError(("Could not convert " + (JSON.stringify(value)) + " to number."));
        } else if (this.type.kind === 'formatted') {
            // There is no explicit 'to-formatted' but this coercion can be implicitly
            // created by properties that expect the 'formatted' type.
            return Formatted.fromString(toString$1(this.args[0].evaluate(ctx)));
        } else if (this.type.kind === 'resolvedImage') {
            return ResolvedImage.fromString(toString$1(this.args[0].evaluate(ctx)));
        } else {
            return toString$1(this.args[0].evaluate(ctx));
        }
    };

    Coercion.prototype.eachChild = function eachChild(fn) {
        this.args.forEach(fn);
    };

    Coercion.prototype.possibleOutputs = function possibleOutputs() {
        var ref;

        return (ref = []).concat.apply(ref, this.args.map(function (arg) {
            return arg.possibleOutputs();
        }));
    };

    Coercion.prototype.serialize = function serialize() {
        if (this.type.kind === 'formatted') {
            return new FormatExpression([
                {content: this.args[0], scale: null, font: null, textColor: null}
            ]).serialize();
        }

        if (this.type.kind === 'resolvedImage') {
            return new ImageExpression(this.args[0]).serialize();
        }

        var serialized = [("to-" + (this.type.kind))];
        this.eachChild(function (child) {
            serialized.push(child.serialize());
        });
        return serialized;
    };

    var StringType$4 = {kind: 'string'};
    var BooleanType$5 = {kind: 'boolean'};
    var CollatorType$1 = {kind: 'collator'};

    var CollatorExpression = function CollatorExpression(caseSensitive, diacriticSensitive, locale) {
        this.type = CollatorType$1;
        this.locale = locale;
        this.caseSensitive = caseSensitive;
        this.diacriticSensitive = diacriticSensitive;
    };

    CollatorExpression.parse = function parse(args, context) {
        if (args.length !== 2) {
            return context.error("Expected one argument.");
        }

        var options = (args[1] );
        if (typeof options !== "object" || Array.isArray(options)) {
            return context.error("Collator options argument must be an object.");
        }

        var caseSensitive = context.parse(
            options['case-sensitive'] === undefined ? false : options['case-sensitive'], 1, BooleanType$5);
        if (!caseSensitive) {
            return null;
        }

        var diacriticSensitive = context.parse(
            options['diacritic-sensitive'] === undefined ? false : options['diacritic-sensitive'], 1, BooleanType$5);
        if (!diacriticSensitive) {
            return null;
        }

        var locale = null;
        if (options['locale']) {
            locale = context.parse(options['locale'], 1, StringType$4);
            if (!locale) {
                return null;
            }
        }

        return new CollatorExpression(caseSensitive, diacriticSensitive, locale);
    };

    CollatorExpression.prototype.evaluate = function evaluate(ctx) {
        return new Collator(this.caseSensitive.evaluate(ctx), this.diacriticSensitive.evaluate(ctx), this.locale ? this.locale.evaluate(ctx) : null);
    };

    CollatorExpression.prototype.eachChild = function eachChild(fn) {
        fn(this.caseSensitive);
        fn(this.diacriticSensitive);
        if (this.locale) {
            fn(this.locale);
        }
    };

    CollatorExpression.prototype.possibleOutputs = function possibleOutputs() {
        // Technically the set of possible outputs is the combinatoric set of Collators produced
        // by all possibleOutputs of locale/caseSensitive/diacriticSensitive
        // But for the primary use of Collators in comparison operators, we ignore the Collator's
        // possibleOutputs anyway, so we can get away with leaving this undefined for now.
        return [undefined];
    };

    CollatorExpression.prototype.serialize = function serialize() {
        var options = {};
        options['case-sensitive'] = this.caseSensitive.serialize();
        options['diacritic-sensitive'] = this.diacriticSensitive.serialize();
        if (this.locale) {
            options['locale'] = this.locale.serialize();
        }
        return ["collator", options];
    };

    var BooleanType$6 = {kind: 'boolean'};
    var ValueType$6 = {kind: 'value'};
    var CollatorType$2 = {kind: 'collator'};

    function isComparableType$1(op, type) {
        if (op === '==' || op === '!=') {
            // equality operator
            return type.kind === 'boolean' ||
                type.kind === 'string' ||
                type.kind === 'number' ||
                type.kind === 'null' ||
                type.kind === 'value';
        } else {
            // ordering operator
            return type.kind === 'string' ||
                type.kind === 'number' ||
                type.kind === 'value';
        }
    }

    function eq(ctx, a, b) {
        return a === b;
    }
    function neq(ctx, a, b) {
        return a !== b;
    }
    function lt(ctx, a, b) {
        return a < b;
    }
    function gt(ctx, a, b) {
        return a > b;
    }
    function lteq(ctx, a, b) {
        return a <= b;
    }
    function gteq(ctx, a, b) {
        return a >= b;
    }

    function eqCollate(ctx, a, b, c) {
        return c.compare(a, b) === 0;
    }
    function neqCollate(ctx, a, b, c) {
        return !eqCollate(ctx, a, b, c);
    }
    function ltCollate(ctx, a, b, c) {
        return c.compare(a, b) < 0;
    }
    function gtCollate(ctx, a, b, c) {
        return c.compare(a, b) > 0;
    }
    function lteqCollate(ctx, a, b, c) {
        return c.compare(a, b) <= 0;
    }
    function gteqCollate(ctx, a, b, c) {
        return c.compare(a, b) >= 0;
    }

    /**
     * Special form for comparison operators, implementing the signatures:
     * - (T, T, ?Collator) => boolean
     * - (T, value, ?Collator) => boolean
     * - (value, T, ?Collator) => boolean
     *
     * For inequalities, T must be either value, string, or number. For ==/!=, it
     * can also be boolean or null.
     *
     * Equality semantics are equivalent to Javascript's strict equality (===/!==)
     * -- i.e., when the arguments' types don't match, == evaluates to false, != to
     * true.
     *
     * When types don't match in an ordering comparison, a runtime error is thrown.
     *
     * @private
     */
    function makeComparison(op, compareBasic, compareWithCollator) {
        var isOrderComparison = op !== '==' && op !== '!=';

        return /*@__PURE__*/(function () {
            function Comparison(lhs, rhs, collator) {
                this.type = BooleanType$6;
                this.lhs = lhs;
                this.rhs = rhs;
                this.collator = collator;
                this.hasUntypedArgument = lhs.type.kind === 'value' || rhs.type.kind === 'value';
            }

            Comparison.parse = function parse(args, context) {
                if (args.length !== 3 && args.length !== 4) {
                    return context.error("Expected two or three arguments.");
                }

                var op = (args[0]     );

                var lhs = context.parse(args[1], 1, ValueType$6);
                if (!lhs) {
                    return null;
                }
                if (!isComparableType$1(op, lhs.type)) {
                    return context.concat(1).error(("\"" + op + "\" comparisons are not supported for type '" + (toString(lhs.type)) + "'."));
                }
                var rhs = context.parse(args[2], 2, ValueType$6);
                if (!rhs) {
                    return null;
                }
                if (!isComparableType$1(op, rhs.type)) {
                    return context.concat(2).error(("\"" + op + "\" comparisons are not supported for type '" + (toString(rhs.type)) + "'."));
                }

                if (
                    lhs.type.kind !== rhs.type.kind &&
                        lhs.type.kind !== 'value' &&
                        rhs.type.kind !== 'value'
                    ) {
                    return context.error(("Cannot compare types '" + (toString(lhs.type)) + "' and '" + (toString(rhs.type)) + "'."));
                }

                if (isOrderComparison) {
                    // typing rules specific to less/greater than operators
                    if (lhs.type.kind === 'value' && rhs.type.kind !== 'value') {
                        // (value, T)
                        lhs = new Assertion(rhs.type, [lhs]);
                    } else if (lhs.type.kind !== 'value' && rhs.type.kind === 'value') {
                        // (T, value)
                        rhs = new Assertion(lhs.type, [rhs]);
                    }
                }

                var collator = null;
                if (args.length === 4) {
                    if (
                        lhs.type.kind !== 'string' &&
                            rhs.type.kind !== 'string' &&
                            lhs.type.kind !== 'value' &&
                            rhs.type.kind !== 'value'
                        ) {
                        return context.error("Cannot use collator to compare non-string types.");
                    }
                    collator = context.parse(args[3], 3, CollatorType$2);
                    if (!collator) {
                        return null;
                    }
                }

                return new Comparison(lhs, rhs, collator);
            };

            Comparison.prototype.evaluate = function evaluate(ctx) {
                var lhs = this.lhs.evaluate(ctx);
                var rhs = this.rhs.evaluate(ctx);

                if (isOrderComparison && this.hasUntypedArgument) {
                    var lt = Values$1.typeOf(lhs);
                    var rt = Values$1.typeOf(rhs);
                    // check that type is string or number, and equal
                    if (lt.kind !== rt.kind || !(lt.kind === 'string' || lt.kind === 'number')) {
                        throw new RuntimeError(("Expected arguments for \"" + op + "\" to be (string, string) or (number, number), but found (" + (lt.kind) + ", " + (rt.kind) + ") instead."));
                    }
                }

                if (this.collator && !isOrderComparison && this.hasUntypedArgument) {
                    var lt$1 = Values$1.typeOf(lhs);
                    var rt$1 = Values$1.typeOf(rhs);
                    if (lt$1.kind !== 'string' || rt$1.kind !== 'string') {
                        return compareBasic(ctx, lhs, rhs);
                    }
                }

                return this.collator ?
                    compareWithCollator(ctx, lhs, rhs, this.collator.evaluate(ctx)) :
                    compareBasic(ctx, lhs, rhs);
            };

            Comparison.prototype.eachChild = function eachChild(fn) {
                fn(this.lhs);
                fn(this.rhs);
                if (this.collator) {
                    fn(this.collator);
                }
            };

            Comparison.prototype.possibleOutputs = function possibleOutputs() {
                return [true, false];
            };

            Comparison.prototype.serialize = function serialize() {
                var serialized = [op];
                this.eachChild(function (child) {
                    serialized.push(child.serialize());
                });
                return serialized;
            };

            return Comparison;
        }());
    }

    var ComparisonEnum = {
    };
    ComparisonEnum.Equals = makeComparison('==', eq, eqCollate);
    ComparisonEnum.NotEquals = makeComparison('!=', neq, neqCollate);
    ComparisonEnum.LessThan = makeComparison('<', lt, ltCollate);
    ComparisonEnum.GreaterThan = makeComparison('>', gt, gtCollate);
    ComparisonEnum.LessThanOrEqual = makeComparison('<=', lteq, lteqCollate);
    ComparisonEnum.GreaterThanOrEqual = makeComparison('>=', gteq, gteqCollate);

    var NumberType$6 = {kind: 'number'};
    var StringType$5 = {kind: 'string'};
    var ColorType$4 = {kind: 'color'};
    var ValueType$7 = {kind: 'value'};
    var FormattedType$2 = {kind: 'formatted'};
    var ResolvedImageType$2 = {kind: 'resolvedImage'};

    function array$4(itemType, N) {
        return {
            kind: 'array',
            itemType: itemType,
            N: N
        };
    }

    var FormatExpression$1 = function FormatExpression(sections) {
        this.type = FormattedType$2;
        this.sections = sections;
    };

    FormatExpression$1.parse = function parse(args, context) {
        if (args.length < 2) {
            return context.error("Expected at least one argument.");
        }

        var firstArg = args[1];
        if (!Array.isArray(firstArg) && typeof firstArg === 'object') {
            return context.error("First argument must be an image or text section.");
        }

        var sections = [];
        var nextTokenMayBeObject = false;
        for (var i = 1; i <= args.length - 1; ++i) {
            var arg = (args[i] );

            if (nextTokenMayBeObject && typeof arg === "object" && !Array.isArray(arg)) {
                nextTokenMayBeObject = false;

                var scale = null;
                if (arg['font-scale']) {
                    scale = context.parse(arg['font-scale'], 1, NumberType$6);
                    if (!scale) {
                        return null;
                    }
                }

                var font = null;
                if (arg['text-font']) {
                    font = context.parse(arg['text-font'], 1, array$4(StringType$5));
                    if (!font) {
                        return null;
                    }
                }

                var textColor = null;
                if (arg['text-color']) {
                    textColor = context.parse(arg['text-color'], 1, ColorType$4);
                    if (!textColor) {
                        return null;
                    }
                }

                var lastExpression = sections[sections.length - 1];
                lastExpression.scale = scale;
                lastExpression.font = font;
                lastExpression.textColor = textColor;
            } else {
                var content = context.parse(args[i], 1, ValueType$7);
                if (!content) {
                    return null;
                }

                var kind = content.type.kind;
                if (kind !== 'string' && kind !== 'value' && kind !== 'null' && kind !== 'resolvedImage') {
                    return context.error("Formatted text type must be 'string', 'value', 'image' or 'null'.");
                }

                nextTokenMayBeObject = true;
                sections.push({content: content, scale: null, font: null, textColor: null});
            }
        }

        return new FormatExpression$1(sections);
    };

    FormatExpression$1.prototype.evaluate = function evaluate(ctx) {
        var evaluateSection = function (section) {
            var evaluatedContent = section.content.evaluate(ctx);
            if (Values$1.typeOf(evaluatedContent) === ResolvedImageType$2) {
                return new FormattedSection('', evaluatedContent, null, null, null);
            }

            return new FormattedSection(
                Values$1.toString$1(evaluatedContent),
                null,
                section.scale ? section.scale.evaluate(ctx) : null,
                section.font ? section.font.evaluate(ctx).join(',') : null,
                section.textColor ? section.textColor.evaluate(ctx) : null
            );
        };

        return new Formatted$1(this.sections.map(evaluateSection));
    };

    FormatExpression$1.prototype.eachChild = function eachChild(fn) {
        for (var i = 0, list = this.sections; i < list.length; i += 1) {
            var section = list[i];

            fn(section.content);
            if (section.scale) {
                fn(section.scale);
            }
            if (section.font) {
                fn(section.font);
            }
            if (section.textColor) {
                fn(section.textColor);
            }
        }
    };

    FormatExpression$1.prototype.possibleOutputs = function possibleOutputs() {
        // Technically the combinatoric set of all children
        // Usually, this.text will be undefined anyway
        return [undefined];
    };

    FormatExpression$1.prototype.serialize = function serialize() {
        var serialized = ["format"];
        for (var i = 0, list = this.sections; i < list.length; i += 1) {
            var section = list[i];

            serialized.push(section.content.serialize());
            var options = {};
            if (section.scale) {
                options['font-scale'] = section.scale.serialize();
            }
            if (section.font) {
                options['text-font'] = section.font.serialize();
            }
            if (section.textColor) {
                options['text-color'] = section.textColor.serialize();
            }
            serialized.push(options);
        }
        return serialized;
    };

    var StringType$6 = {kind: 'string'};
    var ResolvedImageType$3 = {kind: 'resolvedImage'};

    var ImageExpression$1 = function ImageExpression(input) {
        this.type = ResolvedImageType$3;
        this.input = input;
    };

    ImageExpression$1.parse = function parse(args, context) {
        if (args.length !== 2) {
            return context.error("Expected two arguments.");
        }

        var name = context.parse(args[1], 1, StringType$6);
        if (!name) {
            return context.error("No image name provided.");
        }

        return new ImageExpression$1(name);
    };

    ImageExpression$1.prototype.evaluate = function evaluate(ctx) {
        var evaluatedImageName = this.input.evaluate(ctx);
        var available = false;

        if (ctx.availableImages && ctx.availableImages.indexOf(evaluatedImageName) > -1) {
            available = true;
        }

        return new ResolvedImage$1({name: evaluatedImageName, available: available});
    };

    ImageExpression$1.prototype.eachChild = function eachChild(fn) {
        fn(this.input);
    };

    ImageExpression$1.prototype.possibleOutputs = function possibleOutputs() {
        // The output of image is determined by the list of available images in the evaluation context
        return [undefined];
    };

    ImageExpression$1.prototype.serialize = function serialize() {
        return ["image", this.input.serialize()];
    };

    var Interpolate$1 = function Interpolate(type, operator, interpolation, input, stops) {
        this.type = type;
        this.operator = operator;
        this.interpolation = interpolation;
        this.input = input;

        this.labels = [];
        this.outputs = [];
        for (var i = 0, list = stops; i < list.length; i += 1) {
            var ref = list[i];
            var label = ref[0];
            var expression = ref[1];

            this.labels.push(label);
            this.outputs.push(expression);
        }
    };

    Interpolate$1.interpolationFactor = function interpolationFactor(interpolation, input, lower, upper) {
        var t = 0;
        if (interpolation.name === 'exponential') {
            t = exponentialInterpolation(input, interpolation.base, lower, upper);
        } else if (interpolation.name === 'linear') {
            t = exponentialInterpolation(input, 1, lower, upper);
        } else if (interpolation.name === 'cubic-bezier') {
            var c = interpolation.controlPoints;
            var ub = new unitbezier(c[0], c[1], c[2], c[3]);
            t = ub.solve(exponentialInterpolation(input, 1, lower, upper));
        }
        return t;
    };

    Interpolate$1.parse = function parse(args, context) {
        var operator = args[0];
        var interpolation = args[1];
        var input = args[2];
        var rest = args.slice(3);

        if (!Array.isArray(interpolation) || interpolation.length === 0) {
            return context.error("Expected an interpolation type expression.", 1);
        }

        if (interpolation[0] === 'linear') {
            interpolation = {name: 'linear'};
        } else if (interpolation[0] === 'exponential') {
            var base = interpolation[1];
            if (typeof base !== 'number') {
                return context.error("Exponential interpolation requires a numeric base.", 1, 1);
            }
            interpolation = {
                name: 'exponential',
                base: base
            };
        } else if (interpolation[0] === 'cubic-bezier') {
            var controlPoints = interpolation.slice(1);
            if (
                controlPoints.length !== 4 ||
                    controlPoints.some(function (t) {
                        return typeof t !== 'number' || t < 0 || t > 1;
                    })
                ) {
                return context.error('Cubic bezier interpolation requires four numeric arguments with values between 0 and 1.', 1);
            }

            interpolation = {
                name: 'cubic-bezier',
                controlPoints: (controlPoints )
            };
        } else {
            return context.error(("Unknown interpolation type " + (String(interpolation[0]))), 1, 0);
        }

        if (args.length - 1 < 4) {
            return context.error(("Expected at least 4 arguments, but found only " + (args.length - 1) + "."));
        }

        if ((args.length - 1) % 2 !== 0) {
            return context.error("Expected an even number of arguments.");
        }

        input = context.parse(input, 2, NumberType);
        if (!input) {
            return null;
        }

        var stops = [];

        var outputType = (null );
        if (operator === 'interpolate-hcl' || operator === 'interpolate-lab') {
            outputType = ColorType;
        } else if (context.expectedType && context.expectedType.kind !== 'value') {
            outputType = context.expectedType;
        }

        for (var i = 0; i < rest.length; i += 2) {
            var label = rest[i];
            var value = rest[i + 1];

            var labelKey = i + 3;
            var valueKey = i + 4;

            if (typeof label !== 'number') {
                return context.error('Input/output pairs for "interpolate" expressions must be defined using literal numeric values (not computed expressions) for the input values.', labelKey);
            }

            if (stops.length && stops[stops.length - 1][0] >= label) {
                return context.error('Input/output pairs for "interpolate" expressions must be arranged with input values in strictly ascending order.', labelKey);
            }

            var parsed = context.parse(value, valueKey, outputType);
            if (!parsed) {
                return null;
            }
            outputType = outputType || parsed.type;
            stops.push([label, parsed]);
        }

        if (outputType.kind !== 'number' &&
            outputType.kind !== 'color' && !(
            outputType.kind === 'array' &&
                outputType.itemType.kind === 'number' &&
                typeof outputType.N === 'number'
            )
            ) {
            return context.error(("Type " + (toString(outputType)) + " is not interpolatable."));
        }

        return new Interpolate$1(outputType, (operator ), interpolation, input, stops);
    };

    Interpolate$1.prototype.evaluate = function evaluate(ctx) {
        var labels = this.labels;
        var outputs = this.outputs;

        if (labels.length === 1) {
            return outputs[0].evaluate(ctx);
        }

        var value = ((this.input.evaluate(ctx) )    );
        if (value <= labels[0]) {
            return outputs[0].evaluate(ctx);
        }

        var stopCount = labels.length;
        if (value >= labels[stopCount - 1]) {
            return outputs[stopCount - 1].evaluate(ctx);
        }

        var index = findStopLessThanOrEqualTo(labels, value);
        var lower = labels[index];
        var upper = labels[index + 1];
        var t = Interpolate$1.interpolationFactor(this.interpolation, value, lower, upper);

        var outputLower = outputs[index].evaluate(ctx);
        var outputUpper = outputs[index + 1].evaluate(ctx);

        if (this.operator === 'interpolate') {
            return (interpolate[this.type.kind.toLowerCase()] )(outputLower, outputUpper, t); // eslint-disable-line import/namespace
        } else if (this.operator === 'interpolate-hcl') {
            return hcl.reverse(hcl.interpolate(hcl.forward(outputLower), hcl.forward(outputUpper), t));
        } else {
            return lab.reverse(lab.interpolate(lab.forward(outputLower), lab.forward(outputUpper), t));
        }
    };

    Interpolate$1.prototype.eachChild = function eachChild(fn) {
        fn(this.input);
        for (var i = 0, list = this.outputs; i < list.length; i += 1) {
            var expression = list[i];

            fn(expression);
        }
    };

    Interpolate$1.prototype.possibleOutputs = function possibleOutputs() {
        var ref;

        return (ref = []).concat.apply(ref, this.outputs.map(function (output) {
            return output.possibleOutputs();
        }));
    };

    Interpolate$1.prototype.serialize = function serialize() {
        var interpolation;
        if (this.interpolation.name === 'linear') {
            interpolation = ["linear"];
        } else if (this.interpolation.name === 'exponential') {
            if (this.interpolation.base === 1) {
                interpolation = ["linear"];
            } else {
                interpolation = ["exponential", this.interpolation.base];
            }
        } else {
            interpolation = ["cubic-bezier" ].concat(this.interpolation.controlPoints);
        }

        var serialized = [this.operator, interpolation, this.input.serialize()];

        for (var i = 0; i < this.labels.length; i++) {
            serialized.push(
                this.labels[i],
                this.outputs[i].serialize()
            );
        }
        return serialized;
    };

    /**
     * Returns a ratio that can be used to interpolate between exponential function
     * stops.
     * How it works: Two consecutive stop values define a (scaled and shifted) exponential function `f(x) = a * base^x + b`, where `base` is the user-specified base,
     * and `a` and `b` are constants affording sufficient degrees of freedom to fit
     * the function to the given stops.
     *
     * Here's a bit of algebra that lets us compute `f(x)` directly from the stop
     * values without explicitly solving for `a` and `b`:
     *
     * First stop value: `f(x0) = y0 = a * base^x0 + b`
     * Second stop value: `f(x1) = y1 = a * base^x1 + b`
     * => `y1 - y0 = a(base^x1 - base^x0)`
     * => `a = (y1 - y0)/(base^x1 - base^x0)`
     *
     * Desired value: `f(x) = y = a * base^x + b`
     * => `f(x) = y0 + a * (base^x - base^x0)`
     *
     * From the above, we can replace the `a` in `a * (base^x - base^x0)` and do a
     * little algebra:
     * ```
     * a * (base^x - base^x0) = (y1 - y0)/(base^x1 - base^x0) * (base^x - base^x0)
     *                     = (y1 - y0) * (base^x - base^x0) / (base^x1 - base^x0)
     * ```
     *
     * If we let `(base^x - base^x0) / (base^x1 base^x0)`, then we have
     * `f(x) = y0 + (y1 - y0) * ratio`.  In other words, `ratio` may be treated as
     * an interpolation factor between the two stops' output values.
     *
     * (Note: a slightly different form for `ratio`,
     * `(base^(x-x0) - 1) / (base^(x1-x0) - 1) `, is equivalent, but requires fewer
     * expensive `Math.pow()` operations.)
     *
     * @private
     */
    function exponentialInterpolation(input, base, lowerValue, upperValue) {
        var difference = upperValue - lowerValue;
        var progress = input - lowerValue;

        if (difference === 0) {
            return 0;
        } else if (base === 1) {
            return progress / difference;
        } else {
            return (Math.pow(base, progress) - 1) / (Math.pow(base, difference) - 1);
        }
    }

    var BooleanType$7 = {kind: 'boolean'};
    var ValueType$8 = {kind: 'value'};

    function isComparableType(type) {
        return type.kind === 'boolean' ||
            type.kind === 'string' ||
            type.kind === 'number' ||
            type.kind === 'null' ||
            type.kind === 'value';
    }

    function isComparableRuntimeValue(needle) {
        return typeof needle === 'boolean' ||
            typeof needle === 'string' ||
            typeof needle === 'number';
    }

    function isSearchableRuntimeValue(haystack) {
        return Array.isArray(haystack) ||
            typeof haystack === 'string';
    }

    var In = function In(needle, haystack) {
        this.type = BooleanType$7;
        this.needle = needle;
        this.haystack = haystack;
    };

    In.parse = function parse(args, context) {
        if (args.length !== 3) {
            return context.error(("Expected 2 arguments, but found " + (args.length - 1) + " instead."));
        }

        var needle = context.parse(args[1], 1, ValueType$8);

        var haystack = context.parse(args[2], 2, ValueType$8);

        if (!needle || !haystack) {
            return null;
        }

        if (!isComparableType(needle.type)) {
            return context.error(("Expected first argument to be of type boolean, string, number or null, but found " + (toString(needle.type)) + " instead"));
        }

        return new In(needle, haystack);
    };

    In.prototype.evaluate = function evaluate(ctx) {
        var needle = (this.needle.evaluate(ctx) );
        var haystack = (this.haystack.evaluate(ctx) );

        if (!needle || !haystack) {
            return false;
        }

        if (!isComparableRuntimeValue(needle)) {
            throw new RuntimeError(("Expected first argument to be of type boolean, string or number, but found " + (toString(typeOf(needle))) + " instead."));
        }

        if (!isSearchableRuntimeValue(haystack)) {
            throw new RuntimeError(("Expected second argument to be of type array or string, but found " + (toString(typeOf(haystack))) + " instead."));
        }

        return haystack.indexOf(needle) >= 0;
    };

    In.prototype.eachChild = function eachChild(fn) {
        fn(this.needle);
        fn(this.haystack);
    };

    In.prototype.possibleOutputs = function possibleOutputs() {
        return [true, false];
    };

    In.prototype.serialize = function serialize() {
        return ["in", this.needle.serialize(), this.haystack.serialize()];
    };

    var Let = function Let(bindings, result) {
        this.type = result.type;
        this.bindings = [].concat(bindings);
        this.result = result;
    };

    Let.prototype.evaluate = function evaluate(ctx) {
        return this.result.evaluate(ctx);
    };

    Let.prototype.eachChild = function eachChild(fn) {
        for (var i = 0, list = this.bindings; i < list.length; i += 1) {
            var binding = list[i];

            fn(binding[1]);
        }
        fn(this.result);
    };

    Let.parse = function parse(args, context) {
        if (args.length < 4) {
            return context.error(("Expected at least 3 arguments, but found " + (args.length - 1) + " instead."));
        }

        var bindings = [];
        for (var i = 1; i < args.length - 1; i += 2) {
            var name = args[i];

            if (typeof name !== 'string') {
                return context.error(("Expected string, but found " + (typeof name) + " instead."), i);
            }

            if (/[^a-zA-Z0-9_]/.test(name)) {
                return context.error("Variable names must contain only alphanumeric characters or '_'.", i);
            }

            var value = context.parse(args[i + 1], i + 1);
            if (!value) {
                return null;
            }

            bindings.push([name, value]);
        }

        var result = context.parse(args[args.length - 1], args.length - 1, context.expectedType, bindings);
        if (!result) {
            return null;
        }

        return new Let(bindings, result);
    };

    Let.prototype.possibleOutputs = function possibleOutputs() {
        return this.result.possibleOutputs();
    };

    Let.prototype.serialize = function serialize() {
        var serialized = ["let"];
        for (var i = 0, list = this.bindings; i < list.length; i += 1) {
            var ref = list[i];
            var name = ref[0];
            var expr = ref[1];

            serialized.push(name, expr.serialize());
        }
        serialized.push(this.result.serialize());
        return serialized;
    };

    var NumberType$7 = {kind: 'number'};

    var Length = function Length(input) {
        this.type = NumberType$7;
        this.input = input;
    };

    Length.parse = function parse(args, context) {
        if (args.length !== 2) {
            return context.error(("Expected 1 argument, but found " + (args.length - 1) + " instead."));
        }

        var input = context.parse(args[1], 1);
        if (!input) {
            return null;
        }

        if (input.type.kind !== 'array' && input.type.kind !== 'string' && input.type.kind !== 'value') {
            return context.error(("Expected argument of type string or array, but found " + (toString(input.type)) + " instead."));
        }

        return new Length(input);
    };

    Length.prototype.evaluate = function evaluate(ctx) {
        var input = this.input.evaluate(ctx);
        if (typeof input === 'string') {
            return input.length;
        } else if (Array.isArray(input)) {
            return input.length;
        } else {
            throw new RuntimeError(("Expected value to be of type string or array, but found " + (toString(typeOf(input))) + " instead."));
        }
    };

    Length.prototype.eachChild = function eachChild(fn) {
        fn(this.input);
    };

    Length.prototype.possibleOutputs = function possibleOutputs() {
        return [undefined];
    };

    Length.prototype.serialize = function serialize() {
        var serialized = ["length"];
        this.eachChild(function (child) {
            serialized.push(child.serialize());
        });
        return serialized;
    };

    var Literal = function Literal(type, value) {
        this.type = type;
        this.value = value;
    };

    Literal.parse = function parse(args, context) {
        if (args.length !== 2) {
            return context.error(("'literal' expression requires exactly one argument, but found " + (args.length - 1) + " instead."));
        }

        if (!Values$1.isValue(args[1])) {
            return context.error("invalid value");
        }

        var value = (args[1] );
        var type = Values$1.typeOf(value);

        // special case: infer the item type if possible for zero-length arrays
        var expected = context.expectedType;
        if (
            type.kind === 'array' &&
                type.N === 0 &&
                expected &&
                expected.kind === 'array' &&
                (typeof expected.N !== 'number' || expected.N === 0)
            ) {
            type = expected;
        }

        return new Literal(type, value);
    };

    Literal.prototype.evaluate = function evaluate() {
        return this.value;
    };

    Literal.prototype.eachChild = function eachChild() {
    };

    Literal.prototype.possibleOutputs = function possibleOutputs() {
        return [this.value];
    };

    Literal.prototype.serialize = function serialize() {
        if (this.type.kind === 'array' || this.type.kind === 'object') {
            return ["literal", this.value];
        } else if (this.value instanceof Color) {
            // Constant-folding can generate Literal expressions that you
            // couldn't actually generate with a "literal" expression,
            // so we have to implement an equivalent serialization here
            return ["rgba"].concat(this.value.toArray());
        } else if (this.value instanceof Formatted$1) {
            // Same as Color
            return this.value.serialize();
        } else {
            assert_1(this.value === null ||
                typeof this.value === 'string' ||
                typeof this.value === 'number' ||
                typeof this.value === 'boolean');
            return (this.value );
        }
    };

    var ValueType$9 = {kind: 'value'};

    // Map input label values to output expression index
    var Match = function Match(inputType, outputType, input, cases, outputs, otherwise) {
        this.inputType = inputType;
        this.type = outputType;
        this.input = input;
        this.cases = cases;
        this.outputs = outputs;
        this.otherwise = otherwise;
    };

    Match.parse = function parse(args, context) {
        if (args.length < 5) {
            return context.error(("Expected at least 4 arguments, but found only " + (args.length - 1) + "."));
        }
        if (args.length % 2 !== 1) {
            return context.error("Expected an even number of arguments.");
        }

        var inputType;
        var outputType;
        if (context.expectedType && context.expectedType.kind !== 'value') {
            outputType = context.expectedType;
        }
        var cases = {};
        var outputs = [];
        for (var i = 2; i < args.length - 1; i += 2) {
            var labels = args[i];
            var value = args[i + 1];

            if (!Array.isArray(labels)) {
                labels = [labels];
            }

            var labelContext = context.concat(i);
            if (labels.length === 0) {
                return labelContext.error('Expected at least one branch label.');
            }

            for (var i$1 = 0, list = labels; i$1 < list.length; i$1 += 1) {
                var label = list[i$1];

                if (typeof label !== 'number' && typeof label !== 'string') {
                    return labelContext.error("Branch labels must be numbers or strings.");
                } else if (typeof label === 'number' && Math.abs(label) > Number.MAX_SAFE_INTEGER) {
                    return labelContext.error(("Branch labels must be integers no larger than " + (Number.MAX_SAFE_INTEGER) + "."));

                } else if (typeof label === 'number' && Math.floor(label) !== label) {
                    return labelContext.error("Numeric branch labels must be integer values.");

                } else if (!inputType) {
                    inputType = Values$1.typeOf(label);
                } else if (labelContext.checkSubtype(inputType, Values$1.typeOf(label))) {
                    return null;
                }

                if (typeof cases[String(label)] !== 'undefined') {
                    return labelContext.error('Branch labels must be unique.');
                }

                cases[String(label)] = outputs.length;
            }

            var result = context.parse(value, i, outputType);
            if (!result) {
                return null;
            }
            outputType = outputType || result.type;
            outputs.push(result);
        }

        var input = context.parse(args[1], 1, ValueType$9);
        if (!input) {
            return null;
        }

        var otherwise = context.parse(args[args.length - 1], args.length - 1, outputType);
        if (!otherwise) {
            return null;
        }

        assert_1(inputType && outputType);

        if (input.type.kind !== 'value' && context.concat(1).checkSubtype((inputType ), input.type)) {
            return null;
        }

        return new Match((inputType ), (outputType ), input, cases, outputs, otherwise);
    };

    Match.prototype.evaluate = function evaluate(ctx) {
        var input = (this.input.evaluate(ctx) );
        var output = (Values$1.typeOf(input) === this.inputType && this.outputs[this.cases[input]]) || this.otherwise;
        return output.evaluate(ctx);
    };

    Match.prototype.eachChild = function eachChild(fn) {
        fn(this.input);
        this.outputs.forEach(fn);
        fn(this.otherwise);
    };

    Match.prototype.possibleOutputs = function possibleOutputs() {
        var ref;

        return (ref = [])
            .concat.apply(ref, this.outputs.map(function (out) {
                return out.possibleOutputs();
            }))
            .concat(this.otherwise.possibleOutputs());
    };

    Match.prototype.serialize = function serialize() {
        var this$1 = this;

        var serialized = ["match", this.input.serialize()];

        // Sort so serialization has an arbitrary defined order, even though
        // branch order doesn't affect evaluation
        var sortedLabels = Object.keys(this.cases).sort();

        // Group branches by unique match expression to support condensed
        // serializations of the form [case1, case2, ...] -> matchExpression
        var groupedByOutput = [];
        var outputLookup = {}; // lookup index into groupedByOutput for a given output expression
        for (var i = 0, list = sortedLabels; i < list.length; i += 1) {
            var label = list[i];

            var outputIndex = outputLookup[this.cases[label]];
            if (outputIndex === undefined) {
                // First time seeing this output, add it to the end of the grouped list
                outputLookup[this.cases[label]] = groupedByOutput.length;
                groupedByOutput.push([this.cases[label], [label]]);
            } else {
                // We've seen this expression before, add the label to that output's group
                groupedByOutput[outputIndex][1].push(label);
            }
        }

        var coerceLabel = function (label) {
            return this$1.inputType.kind === 'number' ? Number(label) : label;
        };

        for (var i$1 = 0, list$1 = groupedByOutput; i$1 < list$1.length; i$1 += 1) {
            var ref = list$1[i$1];
            var outputIndex = ref[0];
            var labels = ref[1];

            if (labels.length === 1) {
                // Only a single label matches this output expression
                serialized.push(coerceLabel(labels[0]));
            } else {
                // Array of literal labels pointing to this output expression
                serialized.push(labels.map(coerceLabel));
            }
            serialized.push(this.outputs[outputIndex$1].serialize());
        }
        serialized.push(this.otherwise.serialize());
        return serialized;
    };

    var NumberType$8 = {kind: 'number'};
    var StringType$7 = {kind: 'string'};

    var NumberFormat = function NumberFormat(number, locale, currency, minFractionDigits, maxFractionDigits) {
        this.type = StringType$7;
        this.number = number;
        this.locale = locale;
        this.currency = currency;
        this.minFractionDigits = minFractionDigits;
        this.maxFractionDigits = maxFractionDigits;
    };

    NumberFormat.parse = function parse(args, context) {
        if (args.length !== 3) {
            return context.error("Expected two arguments.");
        }

        var number = context.parse(args[1], 1, NumberType$8);
        if (!number) {
            return null;
        }

        var options = (args[2]   );
        if (typeof options !== "object" || Array.isArray(options)) {
            return context.error("NumberFormat options argument must be an object.");
        }

        var locale = null;
        if (options['locale']) {
            locale = context.parse(options['locale'], 1, StringType$7);
            if (!locale) {
                return null;
            }
        }

        var currency = null;
        if (options['currency']) {
            currency = context.parse(options['currency'], 1, StringType$7);
            if (!currency) {
                return null;
            }
        }

        var minFractionDigits = null;
        if (options['min-fraction-digits']) {
            minFractionDigits = context.parse(options['min-fraction-digits'], 1, NumberType$8);
            if (!minFractionDigits) {
                return null;
            }
        }

        var maxFractionDigits = null;
        if (options['max-fraction-digits']) {
            maxFractionDigits = context.parse(options['max-fraction-digits'], 1, NumberType$8);
            if (!maxFractionDigits) {
                return null;
            }
        }

        return new NumberFormat(number, locale, currency, minFractionDigits, maxFractionDigits);
    };

    NumberFormat.prototype.evaluate = function evaluate(ctx) {
        return new Intl.NumberFormat(this.locale ? this.locale.evaluate(ctx) : [],
            {
                style: this.currency ? "currency" : "decimal",
                currency: this.currency ? this.currency.evaluate(ctx) : undefined,
                minimumFractionDigits: this.minFractionDigits ? this.minFractionDigits.evaluate(ctx) : undefined,
                maximumFractionDigits: this.maxFractionDigits ? this.maxFractionDigits.evaluate(ctx) : undefined,
            }).format(this.number.evaluate(ctx));
    };

    NumberFormat.prototype.eachChild = function eachChild(fn) {
        fn(this.number);
        if (this.locale) {
            fn(this.locale);
        }
        if (this.currency) {
            fn(this.currency);
        }
        if (this.minFractionDigits) {
            fn(this.minFractionDigits);
        }
        if (this.maxFractionDigits) {
            fn(this.maxFractionDigits);
        }
    };

    NumberFormat.prototype.possibleOutputs = function possibleOutputs() {
        return [undefined];
    };

    NumberFormat.prototype.serialize = function serialize() {
        var options = {};
        if (this.locale) {
            options['locale'] = this.locale.serialize();
        }
        if (this.currency) {
            options['currency'] = this.currency.serialize();
        }
        if (this.minFractionDigits) {
            options['min-fraction-digits'] = this.minFractionDigits.serialize();
        }
        if (this.maxFractionDigits) {
            options['max-fraction-digits'] = this.maxFractionDigits.serialize();
        }
        return ["number-format", this.number.serialize(), options];
    };

    /**
     * Returns the index of the last stop <= input, or 0 if it doesn't exist.
     * @private
     */
    function findStopLessThanOrEqualTo$1(stops, input) {
        var lastIndex = stops.length - 1;
        var lowerIndex = 0;
        var upperIndex = lastIndex;
        var currentIndex = 0;
        var currentValue, nextValue;

        while (lowerIndex <= upperIndex) {
            currentIndex = Math.floor((lowerIndex + upperIndex) / 2);
            currentValue = stops[currentIndex];
            nextValue = stops[currentIndex + 1];

            if (currentValue <= input) {
                if (currentIndex === lastIndex || input < nextValue) { // Search complete
                    return currentIndex;
                }

                lowerIndex = currentIndex + 1;
            } else if (currentValue > input) {
                upperIndex = currentIndex - 1;
            } else {
                throw new RuntimeError('Input is not a number.');
            }
        }

        return 0;
    }

    var NumberType$9 = {kind: 'number'};

    var Step = function Step(type, input, stops) {
        this.type = type;
        this.input = input;

        this.labels = [];
        this.outputs = [];
        for (var i = 0, list = stops; i < list.length; i += 1) {
            var ref = list[i];
            var label = ref[0];
            var expression = ref[1];

            this.labels.push(label);
            this.outputs.push(expression);
        }
    };

    Step.parse = function parse(args, context) {
        if (args.length - 1 < 4) {
            return context.error(("Expected at least 4 arguments, but found only " + (args.length - 1) + "."));
        }

        if ((args.length - 1) % 2 !== 0) {
            return context.error("Expected an even number of arguments.");
        }

        var input = context.parse(args[1], 1, NumberType$9);
        if (!input) {
            return null;
        }

        var stops = [];

        var outputType = (null );
        if (context.expectedType && context.expectedType.kind !== 'value') {
            outputType = context.expectedType;
        }

        for (var i = 1; i < args.length; i += 2) {
            var label = i === 1 ? -Infinity : args[i];
            var value = args[i + 1];

            var labelKey = i;
            var valueKey = i + 1;

            if (typeof label !== 'number') {
                return context.error('Input/output pairs for "step" expressions must be defined using literal numeric values (not computed expressions) for the input values.', labelKey);
            }

            if (stops.length && stops[stops.length - 1][0] >= label) {
                return context.error('Input/output pairs for "step" expressions must be arranged with input values in strictly ascending order.', labelKey);
            }

            var parsed = context.parse(value, valueKey, outputType);
            if (!parsed) {
                return null;
            }
            outputType = outputType || parsed.type;
            stops.push([label, parsed]);
        }

        return new Step(outputType, input, stops);
    };

    Step.prototype.evaluate = function evaluate(ctx) {
        var labels = this.labels;
        var outputs = this.outputs;

        if (labels.length === 1) {
            return outputs[0].evaluate(ctx);
        }

        var value = ((this.input.evaluate(ctx) )    );
        if (value <= labels[0]) {
            return outputs[0].evaluate(ctx);
        }

        var stopCount = labels.length;
        if (value >= labels[stopCount - 1]) {
            return outputs[stopCount - 1].evaluate(ctx);
        }

        var index = findStopLessThanOrEqualTo$1(labels, value);
        return outputs[index].evaluate(ctx);
    };

    Step.prototype.eachChild = function eachChild(fn) {
        fn(this.input);
        for (var i = 0, list = this.outputs; i < list.length; i += 1) {
            var expression = list[i];

            fn(expression);
        }
    };

    Step.prototype.possibleOutputs = function possibleOutputs() {
        var ref;

        return (ref = []).concat.apply(ref, this.outputs.map(function (output) {
            return output.possibleOutputs();
        }));
    };

    Step.prototype.serialize = function serialize() {
        var serialized = ["step", this.input.serialize()];
        for (var i = 0; i < this.labels.length; i++) {
            if (i > 0) {
                serialized.push(this.labels[i]);
            }
            serialized.push(this.outputs[i].serialize());
        }
        return serialized;
    };

    var Var = function Var(name, boundExpression) {
        this.type = boundExpression.type;
        this.name = name;
        this.boundExpression = boundExpression;
    };

    Var.parse = function parse(args, context) {
        if (args.length !== 2 || typeof args[1] !== 'string') {
            return context.error("'var' expression requires exactly one string literal argument.");
        }

        var name = args[1];
        if (!context.scope.has(name)) {
            return context.error(("Unknown variable \"" + name + "\". Make sure \"" + name + "\" has been bound in an enclosing \"let\" expression before using it."), 1);
        }

        return new Var(name, context.scope.get(name));
    };

    Var.prototype.evaluate = function evaluate(ctx) {
        return this.boundExpression.evaluate(ctx);
    };

    Var.prototype.eachChild = function eachChild() {
    };

    Var.prototype.possibleOutputs = function possibleOutputs() {
        return [undefined];
    };

    Var.prototype.serialize = function serialize() {
        return ["var", this.name];
    };

    var expressions = {
        // special forms
        '==': ComparisonEnum.Equals,
        '!=': ComparisonEnum.NotEquals,
        '>': ComparisonEnum.GreaterThan,
        '<': ComparisonEnum.LessThan,
        '>=': ComparisonEnum.GreaterThanOrEqual,
        '<=': ComparisonEnum.LessThanOrEqual,
        'array': Assertion,
        'at': At,
        'boolean': Assertion,
        'case': Case,
        'coalesce': Coalesce,
        'collator': CollatorExpression,
        'format': FormatExpression$1,
        'image': ImageExpression$1,
        'in': In,
        'interpolate': Interpolate$1,
        'interpolate-hcl': Interpolate$1,
        'interpolate-lab': Interpolate$1,
        'length': Length,
        'let': Let,
        'literal': Literal,
        'match': Match,
        'number': Assertion,
        'number-format': NumberFormat,
        'object': Assertion,
        'step': Step,
        'string': Assertion,
        'to-boolean': Coercion,
        'to-color': Coercion,
        'to-number': Coercion,
        'to-string': Coercion,
        'var': Var
    };

    function WebWorkerTransfer() {

    }

    var registry = {};

    /**
     * Register the given class as serializable.
     *
     * @param options
     * @param options.omit List of properties to omit from serialization (e.g., cached/computed properties)
     * @param options.shallow List of properties that should be serialized by a simple shallow copy, rather than by a recursive call to serialize().
     *
     * @private
     */
    WebWorkerTransfer.register = function (name, klass, options) {
        if (options === void 0) options = {};

        //assert(!registry[name], (name + " is already registered."));
        (Object.defineProperty     )(klass, '_classRegistryKey', {
            value: name,
            writeable: false
        });
        registry[name] = {
            klass: klass,
            omit: options.omit || [],
            shallow: options.shallow || []
        };
    };

    WebWorkerTransfer.register('Object', Object);


    //    gridIndex.serialize = function serialize(grid, transferables) {
    //        var buffer = grid.toArrayBuffer();
    //        if (transferables) {
    //            transferables.push(buffer);
    //        }
    //        return {buffer: buffer};
    //    };
    //
    //    gridIndex.deserialize = function deserialize(serialized) {
    //        return new gridIndex(serialized.buffer);
    //    };
    //    register('Grid', gridIndex);

    WebWorkerTransfer.register('Color', Color$1);
    //WebWorkerTransfer.register('Error', Error);
    WebWorkerTransfer.register('ResolvedImage', ResolvedImage$1);
    WebWorkerTransfer.register('ImageAtlas', ImageAtlas);
    WebWorkerTransfer.register('ImagePosition', ImagePosition);
    WebWorkerTransfer.register('RGBAImage', RGBAImage);
    WebWorkerTransfer.register('Formatted', Formatted$1);
    WebWorkerTransfer.register('FormattedSection', FormattedSection);

    //    WebWorkerTransfer.register('StylePropertyFunction', StylePropertyFunction);
    //    WebWorkerTransfer.register('StyleExpression', StyleExpression, {omit: ['_evaluator']});
    //
    //    WebWorkerTransfer.register('ZoomDependentExpression', ZoomDependentExpression);
    //    WebWorkerTransfer.register('ZoomConstantExpression', ZoomConstantExpression);
    //    WebWorkerTransfer.register('CompoundExpression', CompoundExpression, {omit: ['_evaluate']});

    for (var name$1 in expressions) {
        if ((expressions[name$1]     )._classRegistryKey) {
            continue;
        }
        WebWorkerTransfer.register(("Expression_" + name$1), expressions[name$1]);
    }

    function isArrayBuffer(val) {
        return val && typeof ArrayBuffer !== 'undefined' &&
            (val instanceof ArrayBuffer || (val.constructor && val.constructor.name === 'ArrayBuffer'));
    }

    /**
     * Serialize the given object for transfer to or from a web worker.
     *
     * For non-builtin types, recursively serialize each property (possibly
     * omitting certain properties - see register()), and package the result along
     * with the constructor's `name` so that the appropriate constructor can be
     * looked up in `deserialize()`.
     *
     * If a `transferables` array is provided, add any transferable objects (i.e.,
     * any ArrayBuffers or ArrayBuffer views) to the list. (If a copy is needed,
     * this should happen in the client code, before using serialize().)
     *
     * @private
     */
    WebWorkerTransfer.serialize = function (input, transferables) {
        if (input === null ||
            input === undefined ||
            typeof input === 'boolean' ||
            typeof input === 'number' ||
            typeof input === 'string' ||
            input instanceof Boolean ||
            input instanceof Number ||
            input instanceof String ||
            input instanceof Date ||
            input instanceof RegExp) {
            return input;
        }

        if (isArrayBuffer(input)) {
            if (transferables) {
                transferables.push(((input     )             ));
            }
            return input;
        }

        if (ArrayBuffer.isView(input)) {
            var view = (input     );
            if (transferables) {
                transferables.push(view.buffer);
            }
            return view;
        }

        if (input instanceof ImageData) {
            if (transferables) {
                transferables.push(input.data.buffer);
            }
            return input;
        }

        if (Array.isArray(input)) {
            var serialized = [];
            for (var i = 0, list = input; i < list.length; i += 1) {
                var item = list[i];

                serialized.push(WebWorkerTransfer.serialize(item, transferables));
            }
            return serialized;
        }

        if (typeof input === 'object') {
            var klass = (input.constructor     );
            var name = klass._classRegistryKey;
            if (!name) {
                throw new Error("can't serialize object of unregistered class");
            }
            //assert(registry[name]);

            var properties = klass.serialize ?
                // (Temporary workaround) allow a class to provide static
                // `serialize()` and `deserialize()` methods to bypass the generic
                // approach.
                // This temporary workaround lets us use the generic serialization
                // approach for objects whose members include instances of dynamic
                // StructArray types. Once we refactor StructArray to be static,
                // we can remove this complexity.
                (klass.serialize(input, transferables)                  ) : {};

            if (!klass.serialize) {
                for (var key in input) {
                    // any cast due to https://github.com/facebook/flow/issues/5393
                    if (!(input     ).hasOwnProperty(key)) {
                        continue;
                    }
                    if (registry[name].omit.indexOf(key) >= 0) {
                        continue;
                    }
                    var property = (input     )[key];
                    properties[key] = registry[name].shallow.indexOf(key) >= 0 ?
                        property :
                        WebWorkerTransfer.serialize(property, transferables);
                }
                if (input instanceof Error) {
                    properties.message = input.message;
                }
            }

            if (properties.$name) {
                throw new Error('$name property is reserved for worker serialization logic.');
            }
            if (name !== 'Object') {
                properties.$name = name;
            }

            return properties;
        }

        throw new Error(("can't serialize object of type " + (typeof input)));
    };

    WebWorkerTransfer.deserialize = function (input) {
        if (input === null ||
            input === undefined ||
            typeof input === 'boolean' ||
            typeof input === 'number' ||
            typeof input === 'string' ||
            input instanceof Boolean ||
            input instanceof Number ||
            input instanceof String ||
            input instanceof Date ||
            input instanceof RegExp ||
            isArrayBuffer(input) ||
            ArrayBuffer.isView(input) ||
            input instanceof ImageData) {
            return input;
        }

        if (Array.isArray(input)) {
            return input.map(WebWorkerTransfer.deserialize);
        }

        if (typeof input === 'object') {
            var name = (input     ).$name || 'Object';

            var ref = registry[name];
            var klass = ref.klass;
            if (!klass) {
                throw new Error(("can't deserialize unregistered class " + name));
            }

            if (klass.deserialize) {
                return (klass.deserialize                    )(input);
            }

            var result = Object.create(klass.prototype);

            for (var i = 0, list = Object.keys(input); i < list.length; i += 1) {
                var key = list[i];

                if (key === '$name') {
                    continue;
                }
                var value = (input                  )[key];
                result[key] = registry[name].shallow.indexOf(key) >= 0 ? value : WebWorkerTransfer.deserialize(value);
            }
            return result;
        }
        throw new Error(("can't deserialize object of type " + (typeof input)));
    };

    var ZoomHistory = function ZoomHistory() {
        this.first = true;
    };

    ZoomHistory.prototype.update = function update (z    , now    ) {
        var floorZ = Math.floor(z);

        if (this.first) {
            this.first = false;
            this.lastIntegerZoom = floorZ;
            this.lastIntegerZoomTime = 0;
            this.lastZoom = z;
            this.lastFloorZoom = floorZ;
            return true;
        }

        if (this.lastFloorZoom > floorZ) {
            this.lastIntegerZoom = floorZ + 1;
            this.lastIntegerZoomTime = now;
        } else if (this.lastFloorZoom < floorZ) {
            this.lastIntegerZoom = floorZ;
            this.lastIntegerZoomTime = now;
        }

        if (z !== this.lastZoom) {
            this.lastZoom = z;
            this.lastFloorZoom = floorZ;
            return true;
        }

        return false;
    };

    var EvaluationParameters$1 = function EvaluationParameters(zoom, options) {
        this.zoom = zoom;

        if (options) {
            this.now = options.now;
            this.fadeDuration = options.fadeDuration;
            this.zoomHistory = options.zoomHistory;
            this.transition = options.transition;
        } else {
            this.now = 0;
            this.fadeDuration = 0;
            this.zoomHistory = new ZoomHistory();
            this.transition = {};
        }
    };

    EvaluationParameters$1.prototype.isSupportedScript = function isSupportedScript(str) {
        return false;
        //return isStringInSupportedScript(str, plugin.isLoaded());
    };

    EvaluationParameters$1.prototype.crossFadingFactor = function crossFadingFactor() {
        if (this.fadeDuration === 0) {
            return 1;
        } else {
            return Math.min((this.now - this.zoomHistory.lastIntegerZoomTime) / this.fadeDuration, 1);
        }
    };

    EvaluationParameters$1.prototype.getCrossfadeParameters = function getCrossfadeParameters() {
        var z = this.zoom;
        var fraction = z - Math.floor(z);
        var t = this.crossFadingFactor();

        return z > this.zoomHistory.lastIntegerZoom ?
        {fromScale: 2, toScale: 1, t: fraction + (1 - fraction) * t} :
        {fromScale: 0.5, toScale: 1, t: 1 - (1 - t) * fraction};
    };

    var EXTENT = 8192;

    function clamp(n, min, max) {
        return Math.min(max, Math.max(min, n));
    }

    // These bounds define the minimum and maximum supported coordinate values.
    // While visible coordinates are within [0, EXTENT], tiles may theoretically
    // contain cordinates within [-Infinity, Infinity]. Our range is limited by the
    // number of bits used to represent the coordinate.
    function createBounds(bits) {
        return {
            min: -1 * Math.pow(2, bits - 1),
            max: Math.pow(2, bits - 1) - 1
        };
    }

    var bounds = createBounds(15);

    /**
     * Loads a geometry from a VectorTileFeature and scales it to the common extent
     * used internally.
     * @param {VectorTileFeature} feature
     * @private
     */
    function loadGeometry(feature) {
        var scale = EXTENT / feature.extent;
        var geometry = feature.loadGeometry();
        for (var r = 0; r < geometry.length; r++) {
            var ring = geometry[r];
            for (var p = 0; p < ring.length; p++) {
                var point = ring[p];
                // round here because mapbox-gl-native uses integers to represent
                // points and we need to do the same to avoid renering differences.
                point.x = Math.round(point.x * scale);
                // 因为绘制到纹理上颠倒了，所以在这里取反
                point.y = EXTENT - Math.round(point.y * scale);

                if (point.x < bounds.min || point.x > bounds.max || point.y < bounds.min || point.y > bounds.max) {
                    //warnOnce('Geometry exceeds allowed extent, reduce your vector tile buffer size');
                    point.x = clamp(point.x, bounds.min, bounds.max);
                    point.y = clamp(point.y, bounds.min, bounds.max);
                }
            }
        }
        return geometry;
    }

    var SegmentVector = function SegmentVector(segments) {
        if (segments === void 0) segments = [];

        this.segments = segments;
    };

    SegmentVector.prototype.prepareSegment = function prepareSegment(numVertices, layoutVertexArray, indexArray, sortKey) {
        var segment = this.segments[this.segments.length - 1];
        if (!segment || segment.vertexLength + numVertices > SegmentVector.MAX_VERTEX_ARRAY_LENGTH || segment.sortKey !== sortKey) {
            segment = ({
                vertexOffset: layoutVertexArray.length,
                primitiveOffset: indexArray.length,
                vertexLength: 0,
                primitiveLength: 0
            } );
            if (sortKey !== undefined) {
                segment.sortKey = sortKey;
            }
            this.segments.push(segment);
        }
        return segment;
    };

    SegmentVector.prototype.get = function get() {
        return this.segments;
    };

    SegmentVector.prototype.destroy = function destroy() {
        for (var i = 0, list = this.segments; i < list.length; i += 1) {
            var segment = list[i];

            for (var k in segment.vaos) {
                segment.vaos[k].destroy();
            }
        }
    };

    SegmentVector.simpleSegment = function simpleSegment(vertexOffset, primitiveOffset, vertexLength, primitiveLength) {
        return new SegmentVector([
            {
                vertexOffset: vertexOffset,
                primitiveOffset: primitiveOffset,
                vertexLength: vertexLength,
                primitiveLength: primitiveLength,
                vaos: {},
                sortKey: 0
            }
        ]);
    };

    /*
     * The maximum size of a vertex array. This limit is imposed by WebGL's 16 bit
     * addressing of vertex buffers.
     * @private
     * @readonly
     */
    SegmentVector.MAX_VERTEX_ARRAY_LENGTH = Math.pow(2, 16) - 1;
    WebWorkerTransfer.register('SegmentVector', SegmentVector);

    /**
     * @private
     */

    var DEFAULT_CAPACITY = 128;
    var RESIZE_MULTIPLIER = 5;

    /**
     * `StructArray` provides an abstraction over `ArrayBuffer` and `TypedArray`
     * making it behave like an array of typed structs.
     *
     * Conceptually, a StructArray is comprised of elements, i.e., instances of its
     * associated struct type. Each particular struct type, together with an
     * alignment size, determines the memory layout of a StructArray whose elements
     * are of that type.  Thus, for each such layout that we need, we have
     * a corrseponding StructArrayLayout class, inheriting from StructArray and
     * implementing `emplaceBack()` and `_refreshViews()`.
     *
     * In some cases, where we need to access particular elements of a StructArray,
     * we implement a more specific subclass that inherits from one of the
     * StructArrayLayouts and adds a `get(i): T` accessor that returns a structured
     * object whose properties are proxies into the underlying memory space for the
     * i-th element.  This affords the convience of working with (seemingly) plain
     * Javascript objects without the overhead of serializing/deserializing them
     * into ArrayBuffers for efficient web worker transfer.
     *
     * @private
     */
    var StructArray = function StructArray() {
        this.isTransferred = false;
        this.capacity = -1;
        this.resize(0);
    };

    /**
     * Serialize a StructArray instance.Serializes both the raw data and the
     * metadata needed to reconstruct the StructArray base class during
     * deserialization.
     */
    StructArray.serialize = function serialize(array, transferables) {
        //assert_1(!array.isTransferred);
        if(array.isTransferred){
            console.log("StructArray array.isTransferred.");
        }

        array._trim();

        if (transferables) {
            array.isTransferred = true;
            transferables.push(array.arrayBuffer);
        }

        return {
            length: array.length,
            arrayBuffer: array.arrayBuffer,
        };
    };

    StructArray.deserialize = function deserialize(input) {
        var structArray = Object.create(this.prototype);
        structArray.arrayBuffer = input.arrayBuffer;
        structArray.length = input.length;
        structArray.capacity = input.arrayBuffer.byteLength / structArray.bytesPerElement;
        structArray._refreshViews();
        return structArray;
    };

    /**
     * Resize the array to discard unused capacity.
     */
    StructArray.prototype._trim = function _trim() {
        if (this.length !== this.capacity) {
            this.capacity = this.length;
            this.arrayBuffer = this.arrayBuffer.slice(0, this.length * this.bytesPerElement);
            this._refreshViews();
        }
    };

    /**
     * Resets the the length of the array to 0 without de-allocating capcacity.
     */
    StructArray.prototype.clear = function clear() {
        this.length = 0;
    };

    /**
     * Resize the array.
     * If `n` is greater than the current length then additional elements with undefined values are added.
     * If `n` is less than the current length then the array will be reduced to the first `n` elements.
     * @param {number} n The new size of the array.
     */
    StructArray.prototype.resize = function resize(n) {
        //assert_1(!this.isTransferred);
        this.reserve(n);
        this.length = n;
    };

    /**
     * Indicate a planned increase in size, so that any necessary allocation may
     * be done once, ahead of time.
     * @param {number} n The expected size of the array.
     */
    StructArray.prototype.reserve = function reserve(n) {
        if (n > this.capacity) {
            this.capacity = Math.max(n, Math.floor(this.capacity * RESIZE_MULTIPLIER), DEFAULT_CAPACITY);
            this.arrayBuffer = new ArrayBuffer(this.capacity * this.bytesPerElement);

            var oldUint8Array = this.uint8;
            this._refreshViews();
            if (oldUint8Array) {
                this.uint8.set(oldUint8Array);
            }
        }
    };

    /**
     * Create TypedArray views for the current ArrayBuffer.
     */
    StructArray.prototype._refreshViews = function _refreshViews() {
        throw new Error('_refreshViews() must be implemented by each concrete StructArray layout');
    };

    /**
     * Implementation of the StructArray layout:
     * [0]: Int16[2]
     * [4]: Uint8[4]
     *
     * @private
     */
    var StructArrayLayout2i4ub8 = /*@__PURE__*/(function (StructArray) {
        function StructArrayLayout2i4ub8() {
            StructArray.apply(this, arguments);
        }

        if (StructArray) StructArrayLayout2i4ub8.__proto__ = StructArray;
        StructArrayLayout2i4ub8.prototype = Object.create(StructArray && StructArray.prototype);
        StructArrayLayout2i4ub8.prototype.constructor = StructArrayLayout2i4ub8;

        StructArrayLayout2i4ub8.prototype._refreshViews = function _refreshViews() {
            this.uint8 = new Uint8Array(this.arrayBuffer);
            this.int16 = new Int16Array(this.arrayBuffer);
        };

        StructArrayLayout2i4ub8.prototype.emplaceBack = function emplaceBack(v0, v1, v2, v3, v4, v5) {
            var i = this.length;
            this.resize(i + 1);
            return this.emplace(i, v0, v1, v2, v3, v4, v5);
        };

        StructArrayLayout2i4ub8.prototype.emplace = function emplace(i, v0, v1, v2, v3, v4, v5) {
            var o2 = i * 4;
            var o1 = i * 8;
            this.int16[o2 + 0] = v0;
            this.int16[o2 + 1] = v1;
            this.uint8[o1 + 4] = v2;
            this.uint8[o1 + 5] = v3;
            this.uint8[o1 + 6] = v4;
            this.uint8[o1 + 7] = v5;
            return i;
        };

        return StructArrayLayout2i4ub8;
    }(StructArray));

    StructArrayLayout2i4ub8.prototype.bytesPerElement = 8;
    WebWorkerTransfer.register('StructArrayLayout2i4ub8', StructArrayLayout2i4ub8);

    /**
     * Implementation of the StructArray layout:
     * [0]: Uint16[3]
     *
     * @private
     */
    var StructArrayLayout3ui6 = /*@__PURE__*/(function (StructArray) {
        function StructArrayLayout3ui6() {
            StructArray.apply(this, arguments);
        }

        if (StructArray) StructArrayLayout3ui6.__proto__ = StructArray;
        StructArrayLayout3ui6.prototype = Object.create(StructArray && StructArray.prototype);
        StructArrayLayout3ui6.prototype.constructor = StructArrayLayout3ui6;

        StructArrayLayout3ui6.prototype._refreshViews = function _refreshViews() {
            this.uint8 = new Uint8Array(this.arrayBuffer);
            this.uint16 = new Uint16Array(this.arrayBuffer);
        };

        StructArrayLayout3ui6.prototype.emplaceBack = function emplaceBack(v0, v1, v2) {
            var i = this.length;
            this.resize(i + 1);
            return this.emplace(i, v0, v1, v2);
        };

        StructArrayLayout3ui6.prototype.emplace = function emplace(i, v0, v1, v2) {
            var o2 = i * 3;
            this.uint16[o2 + 0] = v0;
            this.uint16[o2 + 1] = v1;
            this.uint16[o2 + 2] = v2;
            return i;
        };

        return StructArrayLayout3ui6;
    }(StructArray));

    StructArrayLayout3ui6.prototype.bytesPerElement = 6;
    WebWorkerTransfer.register('StructArrayLayout3ui6', StructArrayLayout3ui6);

    // A transferable data structure that maps feature ids to their indices and buffer offsets
    var FeaturePositionMap = function FeaturePositionMap() {
        this.ids = [];
        this.positions = [];
        this.indexed = false;
    };

    FeaturePositionMap.prototype.add = function add(id, index, start, end) {
        this.ids.push(id);
        this.positions.push(index, start, end);
    };

    FeaturePositionMap.prototype.getPositions = function getPositions(id) {
        //assert_1(this.indexed);

        // binary search for the first occurrence of id in this.ids;
        // relies on ids/positions being sorted by id, which happens in serialization
        var i = 0;
        var j = this.ids.length - 1;
        while (i < j) {
            var m = (i + j) >> 1;
            if (this.ids[m] >= id) {
                j = m;
            } else {
                i = m + 1;
            }
        }
        var positions = [];
        while (this.ids[i] === id) {
            var index = this.positions[3 * i];
            var start = this.positions[3 * i + 1];
            var end = this.positions[3 * i + 2];
            positions.push({index: index, start: start, end: end});
            i++;
        }
        return positions;
    };

    FeaturePositionMap.serialize = function serialize(map, transferables) {
        var ids = new Float64Array(map.ids);
        var positions = new Uint32Array(map.positions);

        sort(ids, positions, 0, ids.length - 1);

        if (transferables) {
            transferables.push(ids.buffer, positions.buffer);
        }

        return {ids: ids, positions: positions};
    };

    FeaturePositionMap.deserialize = function deserialize(obj) {
        var map = new FeaturePositionMap();
        // after transferring, we only use these arrays statically (no pushes),
        // so TypedArray vs Array distinction that flow points out doesn't matter
        map.ids = (obj.ids   );
        map.positions = (obj.positions   );
        map.indexed = true;
        return map;
    };

    // custom quicksort that sorts ids, indices and offsets together (by ids)
    function sort(ids, positions, left, right) {
        if (left >= right) {
            return;
        }

        var pivot = ids[(left + right) >> 1];
        var i = left - 1;
        var j = right + 1;

        while (true) {
            do {
                i++;
            } while (ids[i] < pivot);
            do {
                j--;
            } while (ids[j] > pivot);
            if (i >= j) {
                break;
            }
            swap(ids, i, j);
            swap(positions, 3 * i, 3 * j);
            swap(positions, 3 * i + 1, 3 * j + 1);
            swap(positions, 3 * i + 2, 3 * j + 2);
        }

        sort(ids, positions, left, j);
        sort(ids, positions, j + 1, right);
    }

    function swap(arr, i, j) {
        var tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }

    WebWorkerTransfer.register('FeaturePositionMap', FeaturePositionMap);

    /**
     * `PossiblyEvaluatedPropertyValue` is used for data-driven paint and layout property values. It holds a
     * `PossiblyEvaluatedValue` and the `GlobalProperties` that were used to generate it. You're not allowed to supply
     * a different set of `GlobalProperties` when performing the final evaluation because they would be ignored in the
     * case where the input value was a constant or camera function.
     *
     * @private
     */
    var PossiblyEvaluatedPropertyValue$1 = function PossiblyEvaluatedPropertyValue(property, value, parameters) {
        this.property = property;
        this.value = value;
        this.parameters = parameters;
    };

    PossiblyEvaluatedPropertyValue$1.prototype.isConstant = function isConstant() {
        return this.value.kind === 'constant';
    };

    PossiblyEvaluatedPropertyValue$1.prototype.constantOr = function constantOr(value) {
        if (this.value.kind === 'constant') {
            return this.value.value;
        } else {
            return value;
        }
    };

    PossiblyEvaluatedPropertyValue$1.prototype.evaluate = function evaluate(feature, featureState, availableImages) {
        return this.property.evaluate(this.value, this.parameters, feature, featureState, availableImages);
    };

    function Supports() {
    }

    Supports.supportsPropertyExpression = function (spec) {
        return spec['property-type'] === 'data-driven' || spec['property-type'] === 'cross-faded-data-driven';
    };

    Supports.supportsZoomExpression = function (spec) {
        return !!spec.expression && spec.expression.parameters.indexOf('zoom') > -1;
    };

    Supports.supportsInterpolation = function (spec) {
        return !!spec.expression && spec.expression.interpolated;
    };

    var UniformType = {};

    var Uniform = function Uniform(context, location) {
        this.gl = context.gl;
        this.location = location;
    };

    UniformType.Uniform1i = /*@__PURE__*/(function (Uniform) {
        function Uniform1i(context, location) {
            Uniform.call(this, context, location);
            this.current = 0;
        }

        if (Uniform) Uniform1i.__proto__ = Uniform;
        Uniform1i.prototype = Object.create(Uniform && Uniform.prototype);
        Uniform1i.prototype.constructor = Uniform1i;

        Uniform1i.prototype.set = function set(v) {
            if (this.current !== v) {
                this.current = v;
                this.gl.uniform1i(this.location, v);
            }
        };

        return Uniform1i;
    }(Uniform));

    UniformType.Uniform1f = /*@__PURE__*/(function (Uniform) {
        function Uniform1f(context, location) {
            Uniform.call(this, context, location);
            this.current = 0;
        }

        if (Uniform) Uniform1f.__proto__ = Uniform;
        Uniform1f.prototype = Object.create(Uniform && Uniform.prototype);
        Uniform1f.prototype.constructor = Uniform1f;

        Uniform1f.prototype.set = function set(v) {
            if (this.current !== v) {
                this.current = v;
                this.gl.uniform1f(this.location, v);
            }
        };

        return Uniform1f;
    }(Uniform));

    UniformType.Uniform2f = /*@__PURE__*/(function (Uniform) {
        function Uniform2f(context, location) {
            Uniform.call(this, context, location);
            this.current = [0, 0];
        }

        if (Uniform) Uniform2f.__proto__ = Uniform;
        Uniform2f.prototype = Object.create(Uniform && Uniform.prototype);
        Uniform2f.prototype.constructor = Uniform2f;

        Uniform2f.prototype.set = function set(v) {
            if (v[0] !== this.current[0] || v[1] !== this.current[1]) {
                this.current = v;
                this.gl.uniform2f(this.location, v[0], v[1]);
            }
        };

        return Uniform2f;
    }(Uniform));

    UniformType.Uniform3f = /*@__PURE__*/(function (Uniform) {
        function Uniform3f(context, location) {
            Uniform.call(this, context, location);
            this.current = [0, 0, 0];
        }

        if (Uniform) Uniform3f.__proto__ = Uniform;
        Uniform3f.prototype = Object.create(Uniform && Uniform.prototype);
        Uniform3f.prototype.constructor = Uniform3f;

        Uniform3f.prototype.set = function set(v) {
            if (v[0] !== this.current[0] || v[1] !== this.current[1] || v[2] !== this.current[2]) {
                this.current = v;
                this.gl.uniform3f(this.location, v[0], v[1], v[2]);
            }
        };

        return Uniform3f;
    }(Uniform));

    UniformType.Uniform4f = /*@__PURE__*/(function (Uniform) {
        function Uniform4f(context, location) {
            Uniform.call(this, context, location);
            this.current = [0, 0, 0, 0];
        }

        if (Uniform) Uniform4f.__proto__ = Uniform;
        Uniform4f.prototype = Object.create(Uniform && Uniform.prototype);
        Uniform4f.prototype.constructor = Uniform4f;

        Uniform4f.prototype.set = function set(v) {
            if (v[0] !== this.current[0] || v[1] !== this.current[1] ||
                v[2] !== this.current[2] || v[3] !== this.current[3]) {
                this.current = v;
                this.gl.uniform4f(this.location, v[0], v[1], v[2], v[3]);
            }
        };

        return Uniform4f;
    }(Uniform));

    UniformType.UniformColor = /*@__PURE__*/(function (Uniform) {
        function UniformColor(context, location) {
            Uniform.call(this, context, location);
            this.current = Color$1.transparent;
        }

        if (Uniform) UniformColor.__proto__ = Uniform;
        UniformColor.prototype = Object.create(Uniform && Uniform.prototype);
        UniformColor.prototype.constructor = UniformColor;

        UniformColor.prototype.set = function set(v) {
            if (v.r !== this.current.r || v.g !== this.current.g ||
                v.b !== this.current.b || v.a !== this.current.a) {
                this.current = v;
                this.gl.uniform4f(this.location, v.r, v.g, v.b, v.a);
            }
        };

        return UniformColor;
    }(Uniform));

    var emptyMat4 = new Float32Array(16);
    UniformType.UniformMatrix4f = /*@__PURE__*/(function (Uniform) {
        function UniformMatrix4f(context, location) {
            Uniform.call(this, context, location);
            this.current = emptyMat4;
        }

        if (Uniform) UniformMatrix4f.__proto__ = Uniform;
        UniformMatrix4f.prototype = Object.create(Uniform && Uniform.prototype);
        UniformMatrix4f.prototype.constructor = UniformMatrix4f;

        UniformMatrix4f.prototype.set = function set(v) {
            this.gl.uniformMatrix4fv(this.location, false, v);
            // The vast majority of matrix comparisons that will trip this set
            // happen at i=12 or i=0, so we check those first to avoid lots of
            // unnecessary iteration:
    //            if (v[12] !== this.current[12] || v[0] !== this.current[0]) {
    //                this.current = v;
    //                this.gl.uniformMatrix4fv(this.location, false, v);
    //                return;
    //            }
    //            for (var i = 1; i < 16; i++) {
    //                if (v[i] !== this.current[i]) {
    //                    this.current = v;
    //                    this.gl.uniformMatrix4fv(this.location, false, v);
    //                    break;
    //                }
    //            }
        };

        return UniformMatrix4f;
    }(Uniform));

    /**
     * Implementation of the StructArray layout:
     * [0]: Uint16[8]
     *
     * @private
     */
    var StructArrayLayout8ui16 = /*@__PURE__*/(function (StructArray) {
        function StructArrayLayout8ui16() {
            StructArray.apply(this, arguments);
        }

        if (StructArray) StructArrayLayout8ui16.__proto__ = StructArray;
        StructArrayLayout8ui16.prototype = Object.create(StructArray && StructArray.prototype);
        StructArrayLayout8ui16.prototype.constructor = StructArrayLayout8ui16;

        StructArrayLayout8ui16.prototype._refreshViews = function _refreshViews() {
            this.uint8 = new Uint8Array(this.arrayBuffer);
            this.uint16 = new Uint16Array(this.arrayBuffer);
        };

        StructArrayLayout8ui16.prototype.emplaceBack = function emplaceBack(v0, v1, v2, v3, v4, v5, v6, v7) {
            var i = this.length;
            this.resize(i + 1);
            return this.emplace(i, v0, v1, v2, v3, v4, v5, v6, v7);
        };

        StructArrayLayout8ui16.prototype.emplace = function emplace(i, v0, v1, v2, v3, v4, v5, v6, v7) {
            var o2 = i * 8;
            this.uint16[o2 + 0] = v0;
            this.uint16[o2 + 1] = v1;
            this.uint16[o2 + 2] = v2;
            this.uint16[o2 + 3] = v3;
            this.uint16[o2 + 4] = v4;
            this.uint16[o2 + 5] = v5;
            this.uint16[o2 + 6] = v6;
            this.uint16[o2 + 7] = v7;
            return i;
        };

        return StructArrayLayout8ui16;
    }(StructArray));

    StructArrayLayout8ui16.prototype.bytesPerElement = 16;
    WebWorkerTransfer.register('StructArrayLayout8ui16', StructArrayLayout8ui16);

    /**
     * Implementation of the StructArray layout:
     * [0]: Float32[2]
     *
     * @private
     */
    var StructArrayLayout2f8 = /*@__PURE__*/(function (StructArray) {
        function StructArrayLayout2f8() {
            StructArray.apply(this, arguments);
        }

        if (StructArray) StructArrayLayout2f8.__proto__ = StructArray;
        StructArrayLayout2f8.prototype = Object.create(StructArray && StructArray.prototype);
        StructArrayLayout2f8.prototype.constructor = StructArrayLayout2f8;

        StructArrayLayout2f8.prototype._refreshViews = function _refreshViews() {
            this.uint8 = new Uint8Array(this.arrayBuffer);
            this.float32 = new Float32Array(this.arrayBuffer);
        };

        StructArrayLayout2f8.prototype.emplaceBack = function emplaceBack(v0, v1) {
            var i = this.length;
            this.resize(i + 1);
            return this.emplace(i, v0, v1);
        };

        StructArrayLayout2f8.prototype.emplace = function emplace(i, v0, v1) {
            var o4 = i * 2;
            this.float32[o4 + 0] = v0;
            this.float32[o4 + 1] = v1;
            return i;
        };

        return StructArrayLayout2f8;
    }(StructArray));

    StructArrayLayout2f8.prototype.bytesPerElement = 8;
    WebWorkerTransfer.register('StructArrayLayout2f8', StructArrayLayout2f8);

    /**
     * Implementation of the StructArray layout:
     * [0]: Float32[4]
     *
     * @private
     */
    var StructArrayLayout4f16 = /*@__PURE__*/(function (StructArray) {
        function StructArrayLayout4f16() {
            StructArray.apply(this, arguments);
        }

        if (StructArray) StructArrayLayout4f16.__proto__ = StructArray;
        StructArrayLayout4f16.prototype = Object.create(StructArray && StructArray.prototype);
        StructArrayLayout4f16.prototype.constructor = StructArrayLayout4f16;

        StructArrayLayout4f16.prototype._refreshViews = function _refreshViews() {
            this.uint8 = new Uint8Array(this.arrayBuffer);
            this.float32 = new Float32Array(this.arrayBuffer);
        };

        StructArrayLayout4f16.prototype.emplaceBack = function emplaceBack(v0, v1, v2, v3) {
            var i = this.length;
            this.resize(i + 1);
            return this.emplace(i, v0, v1, v2, v3);
        };

        StructArrayLayout4f16.prototype.emplace = function emplace(i, v0, v1, v2, v3) {
            var o4 = i * 4;
            this.float32[o4 + 0] = v0;
            this.float32[o4 + 1] = v1;
            this.float32[o4 + 2] = v2;
            this.float32[o4 + 3] = v3;
            return i;
        };

        return StructArrayLayout4f16;
    }(StructArray));

    StructArrayLayout4f16.prototype.bytesPerElement = 16;
    WebWorkerTransfer.register('StructArrayLayout4f16', StructArrayLayout4f16);

    /**
     * Implementation of the StructArray layout:
     * [0]: Float32[1]
     *
     * @private
     */
    var StructArrayLayout1f4 = /*@__PURE__*/(function (StructArray) {
        function StructArrayLayout1f4() {
            StructArray.apply(this, arguments);
        }

        if (StructArray) StructArrayLayout1f4.__proto__ = StructArray;
        StructArrayLayout1f4.prototype = Object.create(StructArray && StructArray.prototype);
        StructArrayLayout1f4.prototype.constructor = StructArrayLayout1f4;

        StructArrayLayout1f4.prototype._refreshViews = function _refreshViews() {
            this.uint8 = new Uint8Array(this.arrayBuffer);
            this.float32 = new Float32Array(this.arrayBuffer);
        };

        StructArrayLayout1f4.prototype.emplaceBack = function emplaceBack(v0) {
            var i = this.length;
            this.resize(i + 1);
            return this.emplace(i, v0);
        };

        StructArrayLayout1f4.prototype.emplace = function emplace(i, v0) {
            var o4 = i * 1;
            this.float32[o4 + 0] = v0;
            return i;
        };

        return StructArrayLayout1f4;
    }(StructArray));

    StructArrayLayout1f4.prototype.bytesPerElement = 4;
    WebWorkerTransfer.register('StructArrayLayout1f4', StructArrayLayout1f4);

    function clamp$1(n, min, max) {
        return Math.min(max, Math.max(min, n));
    }

    function packUint8ToFloat(a, b) {
        // coerce a and b to 8-bit ints
        a = clamp$1(Math.floor(a), 0, 255);
        b = clamp$1(Math.floor(b), 0, 255);
        return 256 * a + b;
    }

    function packColor(color) {
        return [
            packUint8ToFloat(255 * color.r, 255 * color.g),
            packUint8ToFloat(255 * color.b, 255 * color.a)
        ];
    }

    var ConstantBinder = function ConstantBinder(value, names, type) {
        this.value = value;
        this.names = names;
        this.uniformNames = this.names.map(function (name) {
            return ("u_" + name);
        });
        this.type = type;
        this.maxValue = -Infinity;
    };

    ConstantBinder.prototype.defines = function defines() {
        return this.names.map(function (name) {
            return ("#define HAS_UNIFORM_u_" + name);
        });
    };
    ConstantBinder.prototype.setConstantPatternPositions = function setConstantPatternPositions() {
    };
    ConstantBinder.prototype.populatePaintArray = function populatePaintArray() {
    };
    ConstantBinder.prototype.updatePaintArray = function updatePaintArray() {
    };
    ConstantBinder.prototype.upload = function upload() {
    };
    ConstantBinder.prototype.destroy = function destroy() {
    };

    ConstantBinder.prototype.setUniforms = function setUniforms(context, uniform, globals, currentValue) {
        uniform.set(currentValue.constantOr(this.value));
    };

    ConstantBinder.prototype.getBinding = function getBinding(context, location) {
        return (this.type === 'color') ?
            new UniformType.UniformColor(context, location) :
            new UniformType.Uniform1f(context, location);
    };

    ConstantBinder.serialize = function serialize$1(binder) {
        var value = binder.value;
        var names = binder.names;
        var type = binder.type;
        return {value: WebWorkerTransfer.serialize(value), names: names, type: type};
    };

    ConstantBinder.deserialize = function deserialize$1(serialized) {
        var value = serialized.value;
        var names = serialized.names;
        var type = serialized.type;
        return new ConstantBinder(WebWorkerTransfer.deserialize(value), names, type);
    };

    var CrossFadedConstantBinder = function CrossFadedConstantBinder(value, names, type) {
        this.value = value;
        this.names = names;
        this.uniformNames = this.names.map(function (name) {
            return ("u_" + name);
        });
        this.type = type;
        this.maxValue = -Infinity;
        this.patternPositions = {patternTo: null, patternFrom: null};
    };

    CrossFadedConstantBinder.prototype.defines = function defines() {
        return this.names.map(function (name) {
            return ("#define HAS_UNIFORM_u_" + name);
        });
    };

    CrossFadedConstantBinder.prototype.populatePaintArray = function populatePaintArray() {
    };
    CrossFadedConstantBinder.prototype.updatePaintArray = function updatePaintArray() {
    };
    CrossFadedConstantBinder.prototype.upload = function upload() {
    };
    CrossFadedConstantBinder.prototype.destroy = function destroy() {
    };

    CrossFadedConstantBinder.prototype.setConstantPatternPositions = function setConstantPatternPositions(posTo, posFrom) {
        this.patternPositions.patternTo = posTo.tlbr;
        this.patternPositions.patternFrom = posFrom.tlbr;
    };

    CrossFadedConstantBinder.prototype.setUniforms = function setUniforms(context, uniform, globals, currentValue, uniformName) {
        var pos = this.patternPositions;
        if (uniformName === "u_pattern_to" && pos.patternTo) {
            uniform.set(pos.patternTo);
        }
        if (uniformName === "u_pattern_from" && pos.patternFrom) {
            uniform.set(pos.patternFrom);
        }
    };

    CrossFadedConstantBinder.prototype.getBinding = function getBinding(context, location) {
        return new UniformType.Uniform4f(context, location);
    };

    var SourceExpressionBinder = function SourceExpressionBinder(expression, names, type, PaintVertexArray) {
        this.expression = expression;
        this.names = names;
        this.type = type;
        this.uniformNames = this.names.map(function (name) {
            return ("a_" + name);
        });
        this.maxValue = -Infinity;
        this.paintVertexAttributes = names.map(function (name) {
                return ({
                    name: ("a_" + name),
                    type: 'Float32',
                    components: type === 'color' ? 2 : 1,
                    offset: 0
                });
            }
        );
        this.paintVertexArray = new PaintVertexArray();
    };

    SourceExpressionBinder.prototype.defines = function defines() {
        return [];
    };

    SourceExpressionBinder.prototype.setConstantPatternPositions = function setConstantPatternPositions() {
    };

    SourceExpressionBinder.prototype.populatePaintArray = function populatePaintArray(newLength, feature, imagePositions, formattedSection) {
        var paintArray = this.paintVertexArray;

        var start = paintArray.length;
        paintArray.reserve(newLength);

        var value = this.expression.evaluate(new EvaluationParameters(0), feature, {}, [], formattedSection);

        if (this.type === 'color') {
            var color = packColor(value);
            for (var i = start; i < newLength; i++) {
                paintArray.emplaceBack(color[0], color[1]);
            }
        } else {
            for (var i$1 = start; i$1 < newLength; i$1++) {
                paintArray.emplaceBack(value);
            }

            this.maxValue = Math.max(this.maxValue, value);
        }
    };

    SourceExpressionBinder.prototype.updatePaintArray = function updatePaintArray(start, end, feature, featureState) {
        var paintArray = this.paintVertexArray;
        var value = this.expression.evaluate({zoom: 0}, feature, featureState);

        if (this.type === 'color') {
            var color = packColor(value);
            for (var i = start; i < end; i++) {
                paintArray.emplace(i, color[0], color[1]);
            }
        } else {
            for (var i$1 = start; i$1 < end; i$1++) {
                paintArray.emplace(i$1, value);
            }

            this.maxValue = Math.max(this.maxValue, value);
        }
    };

    SourceExpressionBinder.prototype.upload = function upload(context) {
        if (this.paintVertexArray && this.paintVertexArray.arrayBuffer) {
            if (this.paintVertexBuffer && this.paintVertexBuffer.buffer) {
                this.paintVertexBuffer.updateData(this.paintVertexArray);
            } else {
                this.paintVertexBuffer = context.createVertexBuffer(this.paintVertexArray, this.paintVertexAttributes, this.expression.isStateDependent);
            }
        }
    };

    SourceExpressionBinder.prototype.destroy = function destroy() {
        if (this.paintVertexBuffer) {
            this.paintVertexBuffer.destroy();
        }
    };

    SourceExpressionBinder.prototype.setUniforms = function setUniforms(context, uniform) {
        uniform.set(0);
    };

    SourceExpressionBinder.prototype.getBinding = function getBinding(context, location) {
        return new UniformType.Uniform1f(context, location);
    };

    var CompositeExpressionBinder = function CompositeExpressionBinder(expression, names, type, useIntegerZoom, zoom, layout) {
        this.expression = expression;
        this.names = names;
        this.uniformNames = this.names.map(function (name) {
            return ("u_" + name + "_t");
        });
        this.type = type;
        this.useIntegerZoom = useIntegerZoom;
        this.zoom = zoom;
        this.maxValue = -Infinity;
        var PaintVertexArray = layout;
        this.paintVertexAttributes = names.map(function (name) {
            return {
                name: ("a_" + name),
                type: 'Float32',
                components: type === 'color' ? 4 : 2,
                offset: 0
            };
        });
        this.paintVertexArray = new PaintVertexArray();
    };

    CompositeExpressionBinder.prototype.defines = function defines() {
        return [];
    };

    CompositeExpressionBinder.prototype.setConstantPatternPositions = function setConstantPatternPositions() {
    };

    CompositeExpressionBinder.prototype.populatePaintArray = function populatePaintArray(newLength, feature, imagePositions, formattedSection) {
        var paintArray = this.paintVertexArray;

        var start = paintArray.length;
        paintArray.reserve(newLength);

        var min = this.expression.evaluate(new EvaluationParameters(this.zoom), feature, {}, [], formattedSection);
        var max = this.expression.evaluate(new EvaluationParameters(this.zoom + 1), feature, {}, [], formattedSection);

        if (this.type === 'color') {
            var minColor = packColor(min);
            var maxColor = packColor(max);
            for (var i = start; i < newLength; i++) {
                paintArray.emplaceBack(minColor[0], minColor[1], maxColor[0], maxColor[1]);
            }
        } else {
            for (var i$1 = start; i$1 < newLength; i$1++) {
                paintArray.emplaceBack(min, max);
            }
            this.maxValue = Math.max(this.maxValue, min, max);
        }
    };

    CompositeExpressionBinder.prototype.updatePaintArray = function updatePaintArray(start, end, feature, featureState) {
        var paintArray = this.paintVertexArray;

        var min = this.expression.evaluate({zoom: this.zoom}, feature, featureState);
        var max = this.expression.evaluate({zoom: this.zoom + 1}, feature, featureState);

        if (this.type === 'color') {
            var minColor = packColor(min);
            var maxColor = packColor(max);
            for (var i = start; i < end; i++) {
                paintArray.emplace(i, minColor[0], minColor[1], maxColor[0], maxColor[1]);
            }
        } else {
            for (var i$1 = start; i$1 < end; i$1++) {
                paintArray.emplace(i$1, min, max);
            }
            this.maxValue = Math.max(this.maxValue, min, max);
        }
    };

    CompositeExpressionBinder.prototype.upload = function upload(context) {
        if (this.paintVertexArray && this.paintVertexArray.arrayBuffer) {
            if (this.paintVertexBuffer && this.paintVertexBuffer.buffer) {
                this.paintVertexBuffer.updateData(this.paintVertexArray);
            } else {
                this.paintVertexBuffer = context.createVertexBuffer(this.paintVertexArray, this.paintVertexAttributes, this.expression.isStateDependent);
            }
        }
    };

    CompositeExpressionBinder.prototype.destroy = function destroy() {
        if (this.paintVertexBuffer) {
            this.paintVertexBuffer.destroy();
        }
    };

    CompositeExpressionBinder.prototype.interpolationFactor = function interpolationFactor(currentZoom) {
        if (this.useIntegerZoom) {
            currentZoom = Math.floor(currentZoom);
        }
        return clamp$1(this.expression.interpolationFactor(currentZoom, this.zoom, this.zoom + 1), 0, 1);
    };

    CompositeExpressionBinder.prototype.setUniforms = function setUniforms(context, uniform, globals) {
        uniform.set(this.interpolationFactor(globals.zoom));
    };

    CompositeExpressionBinder.prototype.getBinding = function getBinding(context, location) {
        return new UniformType.Uniform1f(context, location);
    };

    var CrossFadedCompositeBinder = function CrossFadedCompositeBinder(expression, names, type, useIntegerZoom, zoom, PaintVertexArray, layerId) {

        this.expression = expression;
        this.names = names;
        this.type = type;
        this.uniformNames = this.names.map(function (name) {
            return ("u_" + name + "_t");
        });
        this.useIntegerZoom = useIntegerZoom;
        this.zoom = zoom;
        this.maxValue = -Infinity;
        this.layerId = layerId;

        this.paintVertexAttributes = names.map(function (name) {
                return ({
                    name: ("a_" + name),
                    type: 'Uint16',
                    components: 4,
                    offset: 0
                });
            }
        );

        this.zoomInPaintVertexArray = new PaintVertexArray();
        this.zoomOutPaintVertexArray = new PaintVertexArray();
    };

    CrossFadedCompositeBinder.prototype.defines = function defines() {
        return [];
    };

    CrossFadedCompositeBinder.prototype.setConstantPatternPositions = function setConstantPatternPositions() {
    };

    CrossFadedCompositeBinder.prototype.populatePaintArray = function populatePaintArray(length, feature, imagePositions) {
        // We populate two paint arrays because, for cross-faded properties, we don't know which direction
        // we're cross-fading to at layout time. In order to keep vertex attributes to a minimum and not pass
        // unnecessary vertex data to the shaders, we determine which to upload at draw time.

        var zoomInArray = this.zoomInPaintVertexArray;
        var zoomOutArray = this.zoomOutPaintVertexArray;
        var ref = this;
        var layerId = ref.layerId;
        var start = zoomInArray.length;

        zoomInArray.reserve(length);
        zoomOutArray.reserve(length);

        if (imagePositions && feature.patterns && feature.patterns[layerId]) {
            var ref$1 = feature.patterns[layerId];
            var min = ref$1.min;
            var mid = ref$1.mid;
            var max = ref$1.max;

            var imageMin = imagePositions[min];
            var imageMid = imagePositions[mid];
            var imageMax = imagePositions[max];

            if (!imageMin || !imageMid || !imageMax) {
                return;
            }

            for (var i = start; i < length; i++) {
                zoomInArray.emplaceBack(
                    imageMid.tl[0], imageMid.tl[1], imageMid.br[0], imageMid.br[1],
                    imageMin.tl[0], imageMin.tl[1], imageMin.br[0], imageMin.br[1]
                );

                zoomOutArray.emplaceBack(
                    imageMid.tl[0], imageMid.tl[1], imageMid.br[0], imageMid.br[1],
                    imageMax.tl[0], imageMax.tl[1], imageMax.br[0], imageMax.br[1]
                );
            }
        }
    };

    CrossFadedCompositeBinder.prototype.updatePaintArray = function updatePaintArray(start, end, feature, featureState, imagePositions) {
        // We populate two paint arrays because, for cross-faded properties, we don't know which direction
        // we're cross-fading to at layout time. In order to keep vertex attributes to a minimum and not pass
        // unnecessary vertex data to the shaders, we determine which to upload at draw time.

        var zoomInArray = this.zoomInPaintVertexArray;
        var zoomOutArray = this.zoomOutPaintVertexArray;
        var ref = this;
        var layerId = ref.layerId;

        if (imagePositions && feature.patterns && feature.patterns[layerId]) {
            var ref$1 = feature.patterns[layerId];
            var min = ref$1.min;
            var mid = ref$1.mid;
            var max = ref$1.max;
            var imageMin = imagePositions[min];
            var imageMid = imagePositions[mid];
            var imageMax = imagePositions[max];

            if (!imageMin || !imageMid || !imageMax) {
                return;
            }
            for (var i = start; i < end; i++) {
                zoomInArray.emplace(i,
                    imageMid.tl[0], imageMid.tl[1], imageMid.br[0], imageMid.br[1],
                    imageMin.tl[0], imageMin.tl[1], imageMin.br[0], imageMin.br[1]
                );

                zoomOutArray.emplace(i,
                    imageMid.tl[0], imageMid.tl[1], imageMid.br[0], imageMid.br[1],
                    imageMax.tl[0], imageMax.tl[1], imageMax.br[0], imageMax.br[1]
                );
            }
        }
    };

    CrossFadedCompositeBinder.prototype.upload = function upload(context) {
        if (this.zoomInPaintVertexArray && this.zoomInPaintVertexArray.arrayBuffer && this.zoomOutPaintVertexArray && this.zoomOutPaintVertexArray.arrayBuffer) {
            this.zoomInPaintVertexBuffer = context.createVertexBuffer(this.zoomInPaintVertexArray, this.paintVertexAttributes, this.expression.isStateDependent);
            this.zoomOutPaintVertexBuffer = context.createVertexBuffer(this.zoomOutPaintVertexArray, this.paintVertexAttributes, this.expression.isStateDependent);
        }
    };

    CrossFadedCompositeBinder.prototype.destroy = function destroy() {
        if (this.zoomOutPaintVertexBuffer) {
            this.zoomOutPaintVertexBuffer.destroy();
        }
        if (this.zoomInPaintVertexBuffer) {
            this.zoomInPaintVertexBuffer.destroy();
        }

    };

    CrossFadedCompositeBinder.prototype.setUniforms = function setUniforms(context, uniform) {
        uniform.set(0);
    };

    CrossFadedCompositeBinder.prototype.getBinding = function getBinding(context, location) {
        return new Uniform1f(context, location);
    };

    /**
     * ProgramConfiguration contains the logic for binding style layer properties and tile
     * layer feature data into GL program uniforms and vertex attributes.
     *
     * Non-data-driven property values are bound to shader uniforms. Data-driven property
     * values are bound to vertex attributes. In order to support a uniform GLSL syntax over
     * both, [Mapbox GL Shaders](https://github.com/mapbox/mapbox-gl-shaders) defines a `#pragma`
     * abstraction, which ProgramConfiguration is responsible for implementing. At runtime,
     * it examines the attributes of a particular layer, combines this with fixed knowledge
     * about how layers of the particular type are implemented, and determines which uniforms
     * and vertex attributes will be required. It can then substitute the appropriate text
     * into the shader source code, create and link a program, and bind the uniforms and
     * vertex attributes in preparation for drawing.
     *
     * When a vector tile is parsed, this same configuration information is used to
     * populate the attribute buffers needed for data-driven styling using the zoom
     * level and feature property data.
     *
     * @private
     */
    var ProgramConfiguration = function ProgramConfiguration() {
        this.binders = {};
        this.cacheKey = '';
        this._buffers = [];
    };

    ProgramConfiguration.createDynamic = function createDynamic(layer, zoom, filterProperties) {
        var self = new ProgramConfiguration();
        var keys = [];

        for (var property in layer.paint._values) {
            if (!filterProperties(property)) {
                continue;
            }
            var value = layer.paint.get(property);
            if (!(value instanceof PossiblyEvaluatedPropertyValue$1) || !Supports.supportsPropertyExpression(value.property.specification)) {
                continue;
            }
            var names = paintAttributeNames(property, layer.type);
            var type = value.property.specification.type;
            var useIntegerZoom = value.property.useIntegerZoom;
            var isCrossFaded = value.property.specification['property-type'] === 'cross-faded' ||
                value.property.specification['property-type'] === 'cross-faded-data-driven';

            if (isCrossFaded) {
                if (value.value.kind === 'constant') {
                    self.binders[property] = new CrossFadedConstantBinder(value.value.value, names, type);
                    keys.push(("/u_" + property));
                } else {
                    var StructArrayLayout = layoutType(property, type, 'source');
                    self.binders[property] = new CrossFadedCompositeBinder(value.value, names, type, useIntegerZoom, zoom, StructArrayLayout, layer.id);
                    keys.push(("/a_" + property));
                }
            } else if (value.value.kind === 'constant') {
                self.binders[property] = new ConstantBinder(value.value.value, names, type);
                keys.push(("/u_" + property));
            } else if (value.value.kind === 'source') {
                var StructArrayLayout$1 = layoutType(property, type, 'source');
                self.binders[property] = new SourceExpressionBinder(value.value, names, type, StructArrayLayout$1);
                keys.push(("/a_" + property));
            } else {
                var StructArrayLayout$2 = layoutType(property, type, 'composite');
                self.binders[property] = new CompositeExpressionBinder(value.value, names, type, useIntegerZoom, zoom, StructArrayLayout$2);
                keys.push(("/z_" + property));
            }
        }

        self.cacheKey = keys.sort().join('');

        return self;
    };

    ProgramConfiguration.prototype.populatePaintArrays = function populatePaintArrays(newLength, feature, index, imagePositions, formattedSection) {
        for (var property in this.binders) {
            var binder = this.binders[property];
            binder.populatePaintArray(newLength, feature, imagePositions, formattedSection);
        }
    };
    ProgramConfiguration.prototype.setConstantPatternPositions = function setConstantPatternPositions(posTo, posFrom) {
        for (var property in this.binders) {
            var binder = this.binders[property];
            binder.setConstantPatternPositions(posTo, posFrom);
        }
    };

    ProgramConfiguration.prototype.updatePaintArrays = function updatePaintArrays(featureStates, featureMap, vtLayer, layer, imagePositions) {
        var dirty = false;
        for (var id in featureStates) {
            var positions = featureMap.getPositions(+id);

            for (var i = 0, list = positions; i < list.length; i += 1) {
                var pos = list[i];

                var feature = vtLayer.feature(pos.index);

                for (var property in this.binders) {
                    var binder = this.binders[property];
                    if (binder instanceof ConstantBinder || binder instanceof CrossFadedConstantBinder) {
                        continue;
                    }
                    if ((binder   ).expression.isStateDependent === true) {
                        //AHM: Remove after https://github.com/mapbox/mapbox-gl-js/issues/6255
                        var value = layer.paint.get(property);
                        (binder   ).expression = value.value;
                        binder.updatePaintArray(pos.start, pos.end, feature, featureStates[id], imagePositions);
                        dirty = true;
                    }
                }
            }
        }
        return dirty;
    };

    ProgramConfiguration.prototype.defines = function defines() {
        var result = [];
        for (var property in this.binders) {
            result.push.apply(result, this.binders[property].defines());
        }
        return result;
    };

    ProgramConfiguration.prototype.getPaintVertexBuffers = function getPaintVertexBuffers() {
        return this._buffers;
    };

    ProgramConfiguration.prototype.getUniforms = function getUniforms(context, locations) {
        var uniforms = [];
        for (var property in this.binders) {
            var binder = this.binders[property];
            for (var i = 0, list = binder.uniformNames; i < list.length; i += 1) {
                var name = list[i];

                if (locations[name]) {
                    var binding = binder.getBinding(context, locations[name]);
                    uniforms.push({name: name, property: property, binding: binding});
                }
            }
        }
        return uniforms;
    };

    ProgramConfiguration.prototype.setUniforms = function setUniforms(context, binderUniforms, properties, globals) {
        // Uniform state bindings are owned by the Program, but we set them
        // from within the ProgramConfiguraton's binder members.
        for (var i = 0, list = binderUniforms; i < list.length; i += 1) {
            var ref = list[i];
            var name = ref.name;
            var property = ref.property;
            var binding = ref.binding;

            this.binders[property].setUniforms(context, binding, globals, properties.get(property), name);
        }
    };

    ProgramConfiguration.prototype.updatePatternPaintBuffers = function updatePatternPaintBuffers(crossfade) {
        var buffers = [];

        for (var property in this.binders) {
            var binder = this.binders[property];
            if (binder instanceof CrossFadedCompositeBinder) {
                var patternVertexBuffer = crossfade.fromScale === 2 ? binder.zoomInPaintVertexBuffer : binder.zoomOutPaintVertexBuffer;
                if (patternVertexBuffer) {
                    buffers.push(patternVertexBuffer);
                }
            } else if ((binder instanceof SourceExpressionBinder ||
                binder instanceof CompositeExpressionBinder) &&
                binder.paintVertexBuffer
                ) {
                buffers.push(binder.paintVertexBuffer);
            }
        }

        this._buffers = buffers;
    };

    ProgramConfiguration.prototype.upload = function upload(context) {
        for (var property in this.binders) {
            this.binders[property].upload(context);
        }

        var buffers = [];
        for (var property$1 in this.binders) {
            var binder = this.binders[property$1];
            if ((binder instanceof SourceExpressionBinder ||
                binder instanceof CompositeExpressionBinder) &&
                binder.paintVertexBuffer
                ) {
                buffers.push(binder.paintVertexBuffer);
            }
        }
        this._buffers = buffers;
    };

    ProgramConfiguration.prototype.destroy = function destroy() {
        for (var property in this.binders) {
            this.binders[property].destroy();
        }
    };

    function paintAttributeNames(property, type) {
        var attributeNameExceptions = {
            'text-opacity': ['opacity'],
            'icon-opacity': ['opacity'],
            'text-color': ['fill_color'],
            'icon-color': ['fill_color'],
            'text-halo-color': ['halo_color'],
            'icon-halo-color': ['halo_color'],
            'text-halo-blur': ['halo_blur'],
            'icon-halo-blur': ['halo_blur'],
            'text-halo-width': ['halo_width'],
            'icon-halo-width': ['halo_width'],
            'line-gap-width': ['gapwidth'],
            'line-pattern': ['pattern_to', 'pattern_from'],
            'fill-pattern': ['pattern_to', 'pattern_from'],
            'fill-extrusion-pattern': ['pattern_to', 'pattern_from'],
        };

        return attributeNameExceptions[property] ||
            [property.replace((type + "-"), '').replace(/-/g, '_')];
    }

    function getLayoutException(property) {
        var propertyExceptions = {
            'line-pattern': {
                'source': StructArrayLayout8ui16,
                'composite': StructArrayLayout8ui16
            },
            'fill-pattern': {
                'source': StructArrayLayout8ui16,
                'composite': StructArrayLayout8ui16
            },
            'fill-extrusion-pattern': {
                'source': StructArrayLayout8ui16,
                'composite': StructArrayLayout8ui16
            }
        };

        return propertyExceptions[property];
    }

    function layoutType(property, type, binderType) {
        var defaultLayouts = {
            'color': {
                'source': StructArrayLayout2f8,
                'composite': StructArrayLayout4f16
            },
            'number': {
                'source': StructArrayLayout1f4,
                'composite': StructArrayLayout2f8
            }
        };

        var layoutException = getLayoutException(property);
        return  layoutException && layoutException[binderType] ||
            defaultLayouts[type][binderType];
    }

    WebWorkerTransfer.register('ConstantBinder', ConstantBinder);
    WebWorkerTransfer.register('CrossFadedConstantBinder', CrossFadedConstantBinder);
    WebWorkerTransfer.register('SourceExpressionBinder', SourceExpressionBinder);
    WebWorkerTransfer.register('CrossFadedCompositeBinder', CrossFadedCompositeBinder);
    WebWorkerTransfer.register('CompositeExpressionBinder', CompositeExpressionBinder);
    WebWorkerTransfer.register('ProgramConfiguration', ProgramConfiguration, {omit: ['_buffers']});

    var ProgramConfigurationSet = function ProgramConfigurationSet(layoutAttributes, layers, zoom, filterProperties) {
        if (filterProperties === void 0) filterProperties = function () {
            return true;
        };

        this.programConfigurations = {};
        for (var i = 0, list = layers; i < list.length; i += 1) {
            var layer = list[i];

            this.programConfigurations[layer.id] = ProgramConfiguration.createDynamic(layer, zoom, filterProperties);
            this.programConfigurations[layer.id].layoutAttributes = layoutAttributes;
        }
        this.needsUpload = false;
        this._featureMap = new FeaturePositionMap();
        this._bufferOffset = 0;
    };

    ProgramConfigurationSet.prototype.populatePaintArrays = function populatePaintArrays(length, feature, index, imagePositions, formattedSection) {
        for (var key in this.programConfigurations) {
            this.programConfigurations[key].populatePaintArrays(length, feature, index, imagePositions, formattedSection);
        }

        if (feature.id !== undefined) {
            this._featureMap.add(+feature.id, index, this._bufferOffset, length);
        }
        this._bufferOffset = length;

        this.needsUpload = true;
    };

    ProgramConfigurationSet.prototype.updatePaintArrays = function updatePaintArrays(featureStates, vtLayer, layers, imagePositions) {
        for (var i = 0, list = layers; i < list.length; i += 1) {
            var layer = list[i];

            this.needsUpload = this.programConfigurations[layer.id].updatePaintArrays(featureStates, this._featureMap, vtLayer, layer, imagePositions) || this.needsUpload;
        }
    };

    ProgramConfigurationSet.prototype.get = function get(layerId) {
        return this.programConfigurations[layerId];
    };

    ProgramConfigurationSet.prototype.upload = function upload(context) {
        if (!this.needsUpload) {
            return;
        }
        for (var layerId in this.programConfigurations) {
            this.programConfigurations[layerId].upload(context);
        }
        this.needsUpload = false;
    };

    ProgramConfigurationSet.prototype.destroy = function destroy() {
        for (var layerId in this.programConfigurations) {
            this.programConfigurations[layerId].destroy();
        }
    };

    WebWorkerTransfer.register('ProgramConfigurationSet', ProgramConfigurationSet);

    function addPatternDependencies(type, layers, patternFeature, zoom, options) {
        var patterns = options.patternDependencies;
        for (var i = 0, list = layers; i < list.length; i += 1) {
            var layer = list[i];

            var patternProperty = layer.paint.get((type + "-pattern"));

            var patternPropertyValue = patternProperty.value;
            if (patternPropertyValue.kind !== "constant") {
                var min = patternPropertyValue.evaluate({zoom: zoom - 1}, patternFeature, {}, options.availableImages);
                var mid = patternPropertyValue.evaluate({zoom: zoom}, patternFeature, {}, options.availableImages);
                var max = patternPropertyValue.evaluate({zoom: zoom + 1}, patternFeature, {}, options.availableImages);
                min = min && min.name ? min.name : min;
                mid = mid && mid.name ? mid.name : mid;
                max = max && max.name ? max.name : max;
                // add to patternDependencies
                patterns[min] = true;
                patterns[mid] = true;
                patterns[max] = true;

                // save for layout
                patternFeature.patterns[layer.id] = {min: min, mid: mid, max: max};
            }
        }
        return patternFeature;
    }

    var VectorTileFeatureTypes = ['Unknown', 'Point', 'LineString', 'Polygon'];

    var lineLayoutAttributes = createLayout([
        {name: 'a_pos_normal', components: 2, type: 'Int16'},
        {name: 'a_data', components: 4, type: 'Uint8'}
    ], 4);
    var members$3 = lineLayoutAttributes.members;

    // NOTE ON EXTRUDE SCALE:
    // scale the extrusion vector so that the normal length is this value.
    // contains the "texture" normals (-1..1). this is distinct from the extrude
    // normals for line joins, because the x-value remains 0 for the texture
    // normal array, while the extrude normal actually moves the vertex to create
    // the acute/bevelled line join.
    var EXTRUDE_SCALE = 63;

    /*
     * Sharp corners cause dashed lines to tilt because the distance along the line
     * is the same at both the inner and outer corners. To improve the appearance of
     * dashed lines we add extra points near sharp corners so that a smaller part
     * of the line is tilted.
     *
     * COS_HALF_SHARP_CORNER controls how sharp a corner has to be for us to add an
     * extra vertex. The default is 75 degrees.
     *
     * The newly created vertices are placed SHARP_CORNER_OFFSET pixels from the corner.
     */
    var COS_HALF_SHARP_CORNER = Math.cos(75 / 2 * (Math.PI / 180));
    var SHARP_CORNER_OFFSET = 15;

    // Angle per triangle for approximating round line joins.
    var DEG_PER_TRIANGLE = 20;

    // The number of bits that is used to store the line distance in the buffer.
    var LINE_DISTANCE_BUFFER_BITS = 15;

    // We don't have enough bits for the line distance as we'd like to have, so
    // use this value to scale the line distance (in tile units) down to a smaller
    // value. This lets us store longer distances while sacrificing precision.
    var LINE_DISTANCE_SCALE = 1 / 2;

    // The maximum line distance, in tile units, that fits in the buffer.
    var MAX_LINE_DISTANCE = Math.pow(2, LINE_DISTANCE_BUFFER_BITS - 1) / LINE_DISTANCE_SCALE;

    /**
     * @private
     */
    var LineBucket = function LineBucket(options) {
        this.zoom = options.zoom;
        this.overscaling = options.overscaling;
        this.layers = options.layers;
        this.layerIds = this.layers.map(function (layer) {
            return layer.id;
        });
        this.index = options.index;
        this.hasPattern = false;
        this.patternFeatures = [];

        this.layoutVertexArray = new StructArrayLayout2i4ub8();
        this.indexArray = new StructArrayLayout3ui6();
        this.programConfigurations = new ProgramConfigurationSet(members$3, options.layers, options.zoom);
        this.segments = new SegmentVector();

        this.stateDependentLayerIds = this.layers.filter(function (l) {
            return l.isStateDependent();
        }).map(function (l) {
            return l.id;
        });
    };

    LineBucket.prototype.populate = function populate(features, options) {
        //this.hasPattern = hasPattern('line', this.layers, options);
        this.hasPattern = false;
        var lineSortKey = this.layers[0].layout.get('line-sort-key');
        var bucketFeatures = [];

        for (var i = 0, list = features; i < list.length; i += 1) {
            var ref = list[i];
            var feature = ref.feature;
            var index = ref.index;
            var sourceLayerIndex = ref.sourceLayerIndex;

            if (!this.layers[0]._featureFilter(new EvaluationParameters$1(0), feature)) {
                continue;
            }

            var geometry = loadGeometry(feature);
            var sortKey = lineSortKey ?
                lineSortKey.evaluate(feature, {}) :
                undefined;

            var bucketFeature = {
                id: feature.id,
                properties: feature.properties,
                type: feature.type,
                sourceLayerIndex: sourceLayerIndex,
                index: index,
                geometry: geometry,
                patterns: {},
                sortKey: sortKey
            };

            bucketFeatures.push(bucketFeature);
        }

        if (lineSortKey) {
            bucketFeatures.sort(function (a, b) {
                // a.sortKey is always a number when in use
                return ((a.sortKey )    ) - ((b.sortKey )    );
            });
        }

        for (var i$1 = 0, list$1 = bucketFeatures; i$1 < list$1.length; i$1 += 1) {
            var bucketFeature$1 = list$1[i$1];

            var ref$1 = bucketFeature$1;
            var geometry$1 = ref$1.geometry;
            var index$1 = ref$1.index;
            var sourceLayerIndex$1 = ref$1.sourceLayerIndex;

            if (this.hasPattern) {
                var patternBucketFeature = addPatternDependencies('line', this.layers, bucketFeature$1, this.zoom, options);
                // pattern features are added only once the pattern is loaded into the image atlas
                // so are stored during populate until later updated with positions by tile worker in addFeatures
                this.patternFeatures.push(patternBucketFeature);
            } else {
                this.addFeature(bucketFeature$1, geometry$1, index$1, {});
            }

            var feature$1 = features[index$1].feature;
            options.featureIndex.insert(feature$1, geometry$1, index$1, sourceLayerIndex$1, this.index);
        }
    };

    LineBucket.prototype.update = function update(states, vtLayer, imagePositions) {
        if (!this.stateDependentLayers.length) {
            return;
        }
        this.programConfigurations.updatePaintArrays(states, vtLayer, this.stateDependentLayers, imagePositions);
    };

    LineBucket.prototype.addFeatures = function addFeatures(options, imagePositions) {
        for (var i = 0, list = this.patternFeatures; i < list.length; i += 1) {
            var feature = list[i];

            this.addFeature(feature, feature.geometry, feature.index, imagePositions);
        }
    };

    LineBucket.prototype.isEmpty = function isEmpty() {
        return this.layoutVertexArray.length === 0;
    };

    LineBucket.prototype.uploadPending = function uploadPending() {
        return !this.uploaded || this.programConfigurations.needsUpload;
    };

    LineBucket.prototype.upload = function upload(context) {
        if (!this.uploaded) {
            if(this.layoutVertexArray == null) {
                return;
            }
            this.layoutVertexBuffer = context.createVertexBuffer(this.layoutVertexArray, members$3);
            this.indexBuffer = context.createIndexBuffer(this.indexArray);
        }
        this.programConfigurations.upload(context);
        this.uploaded = true;
    };

    LineBucket.prototype.destroy = function destroy() {
        if (!this.layoutVertexBuffer) {
            return;
        }
        this.layoutVertexBuffer.destroy();
        this.indexBuffer.destroy();
        this.programConfigurations.destroy();
        this.segments.destroy();
    };

    LineBucket.prototype.clear = function clear() {
        if (defined.defined(this.layoutVertexArray)) {
            this.layoutVertexArray = null;
        }
        if (defined.defined(this.indexArray)) {
            this.indexArray = null;
        }
    };

    LineBucket.prototype.addFeature = function addFeature(feature, geometry, index, imagePositions) {
        var layout = this.layers[0].layout;
        var join = layout.get('line-join').evaluate(feature, {});
        var cap = layout.get('line-cap');
        var miterLimit = layout.get('line-miter-limit');
        var roundLimit = layout.get('line-round-limit');

        for (var i = 0, list = geometry; i < list.length; i += 1) {
            var line = list[i];

            this.addLine(line, feature, join, cap, miterLimit, roundLimit, index, imagePositions);
        }
    };

    LineBucket.prototype.addLine = function addLine(vertices, feature, join, cap, miterLimit, roundLimit, index, imagePositions) {
        this.distance = 0;
        this.scaledDistance = 0;
        this.totalDistance = 0;

        if (!!feature.properties &&
            feature.properties.hasOwnProperty('mapbox_clip_start') &&
            feature.properties.hasOwnProperty('mapbox_clip_end')) {

            this.clipStart = +feature.properties['mapbox_clip_start'];
            this.clipEnd = +feature.properties['mapbox_clip_end'];

            // Calculate the total distance, in tile units, of this tiled line feature
            for (var i = 0; i < vertices.length - 1; i++) {
                this.totalDistance += vertices[i].dist(vertices[i + 1]);
            }
        }

        var isPolygon = VectorTileFeatureTypes[feature.type] === 'Polygon';

        // If the line has duplicate vertices at the ends, adjust start/length to remove them.
        var len = vertices.length;
        while (len >= 2 && vertices[len - 1].equals(vertices[len - 2])) {
            len--;
        }
        var first = 0;
        while (first < len - 1 && vertices[first].equals(vertices[first + 1])) {
            first++;
        }

        // Ignore invalid geometry.
        if (len < (isPolygon ? 3 : 2)) {
            return;
        }

        if (join === 'bevel') {
            miterLimit = 1.05;
        }

        var sharpCornerOffset = this.overscaling <= 16 ?
            SHARP_CORNER_OFFSET * EXTENT / (512 * this.overscaling) :
            0;

        // we could be more precise, but it would only save a negligible amount of space
        var segment = this.segments.prepareSegment(len * 10, this.layoutVertexArray, this.indexArray);

        var currentVertex;
        var prevVertex = ((undefined )   );
        var nextVertex = ((undefined )   );
        var prevNormal = ((undefined )   );
        var nextNormal = ((undefined )   );

        // the last two vertices added
        this.e1 = this.e2 = -1;

        if (isPolygon) {
            currentVertex = vertices[len - 2];
            nextNormal = vertices[first].sub(currentVertex)._unit()._perp();
        }

        for (var i$1 = first; i$1 < len; i$1++) {

            nextVertex = isPolygon && i$1 === len - 1 ?
                vertices[first + 1] : // if the line is closed, we treat the last vertex like the first
                vertices[i$1 + 1]; // just the next vertex

            // if two consecutive vertices exist, skip the current one
            if (nextVertex && vertices[i$1].equals(nextVertex)) {
                continue;
            }

            if (nextNormal) {
                prevNormal = nextNormal;
            }
            if (currentVertex) {
                prevVertex = currentVertex;
            }

            currentVertex = vertices[i$1];

            // Calculate the normal towards the next vertex in this line. In case
            // there is no next vertex, pretend that the line is continuing straight,
            // meaning that we are just using the previous normal.
            nextNormal = nextVertex ? nextVertex.sub(currentVertex)._unit()._perp() : prevNormal;

            // If we still don't have a previous normal, this is the beginning of a
            // non-closed line, so we're doing a straight "join".
            prevNormal = prevNormal || nextNormal;

            // Determine the normal of the join extrusion. It is the angle bisector
            // of the segments between the previous line and the next line.
            // In the case of 180° angles, the prev and next normals cancel each other out:
            // prevNormal + nextNormal = (0, 0), its magnitude is 0, so the unit vector would be
            // undefined. In that case, we're keeping the joinNormal at (0, 0), so that the cosHalfAngle
            // below will also become 0 and miterLength will become Infinity.
            var joinNormal = prevNormal.add(nextNormal);
            if (joinNormal.x !== 0 || joinNormal.y !== 0) {
                joinNormal._unit();
            }
            /*  joinNormal prevNormal
             *         ↖  ↑
             *            .________. prevVertex
             *            |
             * nextNormal  ←  |  currentVertex
             *            |
             * nextVertex !
             *
             */

            // calculate cosines of the angle (and its half) using dot product
            var cosAngle = prevNormal.x * nextNormal.x + prevNormal.y * nextNormal.y;
            var cosHalfAngle = joinNormal.x * nextNormal.x + joinNormal.y * nextNormal.y;

            // Calculate the length of the miter (the ratio of the miter to the width)
            // as the inverse of cosine of the angle between next and join normals
            var miterLength = cosHalfAngle !== 0 ? 1 / cosHalfAngle : Infinity;

            // approximate angle from cosine
            var approxAngle = 2 * Math.sqrt(2 - 2 * cosHalfAngle);

            var isSharpCorner = cosHalfAngle < COS_HALF_SHARP_CORNER && prevVertex && nextVertex;
            var lineTurnsLeft = prevNormal.x * nextNormal.y - prevNormal.y * nextNormal.x > 0;

            if (isSharpCorner && i$1 > first) {
                var prevSegmentLength = currentVertex.dist(prevVertex);
                if (prevSegmentLength > 2 * sharpCornerOffset) {
                    var newPrevVertex = currentVertex.sub(currentVertex.sub(prevVertex)._mult(sharpCornerOffset / prevSegmentLength)._round());
                    this.updateDistance(prevVertex, newPrevVertex);
                    this.addCurrentVertex(newPrevVertex, prevNormal, 0, 0, segment);
                    prevVertex = newPrevVertex;
                }
            }

            // The join if a middle vertex, otherwise the cap.
            var middleVertex = prevVertex && nextVertex;
            var currentJoin = middleVertex ? join : isPolygon ? 'butt' : cap;

            if (middleVertex && currentJoin === 'round') {
                if (miterLength < roundLimit) {
                    currentJoin = 'miter';
                } else if (miterLength <= 2) {
                    currentJoin = 'fakeround';
                }
            }

            if (currentJoin === 'miter' && miterLength > miterLimit) {
                currentJoin = 'bevel';
            }

            if (currentJoin === 'bevel') {
                // The maximum extrude length is 128 / 63 = 2 times the width of the line
                // so if miterLength >= 2 we need to draw a different type of bevel here.
                if (miterLength > 2) {
                    currentJoin = 'flipbevel';
                }

                // If the miterLength is really small and the line bevel wouldn't be visible,
                // just draw a miter join to save a triangle.
                if (miterLength < miterLimit) {
                    currentJoin = 'miter';
                }
            }

            // Calculate how far along the line the currentVertex is
            if (prevVertex) {
                this.updateDistance(prevVertex, currentVertex);
            }

            if (currentJoin === 'miter') {

                joinNormal._mult(miterLength);
                this.addCurrentVertex(currentVertex, joinNormal, 0, 0, segment);

            } else if (currentJoin === 'flipbevel') {
                // miter is too big, flip the direction to make a beveled join

                if (miterLength > 100) {
                    // Almost parallel lines
                    joinNormal = nextNormal.mult(-1);

                } else {
                    var bevelLength = miterLength * prevNormal.add(nextNormal).mag() / prevNormal.sub(nextNormal).mag();
                    joinNormal._perp()._mult(bevelLength * (lineTurnsLeft ? -1 : 1));
                }
                this.addCurrentVertex(currentVertex, joinNormal, 0, 0, segment);
                this.addCurrentVertex(currentVertex, joinNormal.mult(-1), 0, 0, segment);

            } else if (currentJoin === 'bevel' || currentJoin === 'fakeround') {
                var offset = -Math.sqrt(miterLength * miterLength - 1);
                var offsetA = lineTurnsLeft ? offset : 0;
                var offsetB = lineTurnsLeft ? 0 : offset;

                // Close previous segment with a bevel
                if (prevVertex) {
                    this.addCurrentVertex(currentVertex, prevNormal, offsetA, offsetB, segment);
                }

                if (currentJoin === 'fakeround') {
                    // The join angle is sharp enough that a round join would be visible.
                    // Bevel joins fill the gap between segments with a single pie slice triangle.
                    // Create a round join by adding multiple pie slices. The join isn't actually round, but
                    // it looks like it is at the sizes we render lines at.

                    // pick the number of triangles for approximating round join by based on the angle between normals
                    var n = Math.round((approxAngle * 180 / Math.PI) / DEG_PER_TRIANGLE);

                    for (var m = 1; m < n; m++) {
                        var t = m / n;
                        if (t !== 0.5) {
                            // approximate spherical interpolation https://observablehq.com/@mourner/approximating-geometric-slerp
                            var t2 = t - 0.5;
                            var A = 1.0904 + cosAngle * (-3.2452 + cosAngle * (3.55645 - cosAngle * 1.43519));
                            var B = 0.848013 + cosAngle * (-1.06021 + cosAngle * 0.215638);
                            t = t + t * t2 * (t - 1) * (A * t2 * t2 + B);
                        }
                        var extrude = nextNormal.sub(prevNormal)._mult(t)._add(prevNormal)._unit()._mult(lineTurnsLeft ? -1 : 1);
                        this.addHalfVertex(currentVertex, extrude.x, extrude.y, false, lineTurnsLeft, 0, segment);
                    }
                }

                if (nextVertex) {
                    // Start next segment
                    this.addCurrentVertex(currentVertex, nextNormal, -offsetA, -offsetB, segment);
                }

            } else if (currentJoin === 'butt') {
                this.addCurrentVertex(currentVertex, joinNormal, 0, 0, segment); // butt cap

            } else if (currentJoin === 'square') {
                var offset$1 = prevVertex ? 1 : -1; // closing or starting square cap
                this.addCurrentVertex(currentVertex, joinNormal, offset$1, offset$1, segment);

            } else if (currentJoin === 'round') {

                if (prevVertex) {
                    // Close previous segment with butt
                    this.addCurrentVertex(currentVertex, prevNormal, 0, 0, segment);

                    // Add round cap or linejoin at end of segment
                    this.addCurrentVertex(currentVertex, prevNormal, 1, 1, segment, true);
                }
                if (nextVertex) {
                    // Add round cap before first segment
                    this.addCurrentVertex(currentVertex, nextNormal, -1, -1, segment, true);

                    // Start next segment with a butt
                    this.addCurrentVertex(currentVertex, nextNormal, 0, 0, segment);
                }
            }

            if (isSharpCorner && i$1 < len - 1) {
                var nextSegmentLength = currentVertex.dist(nextVertex);
                if (nextSegmentLength > 2 * sharpCornerOffset) {
                    var newCurrentVertex = currentVertex.add(nextVertex.sub(currentVertex)._mult(sharpCornerOffset / nextSegmentLength)._round());
                    this.updateDistance(currentVertex, newCurrentVertex);
                    this.addCurrentVertex(newCurrentVertex, nextNormal, 0, 0, segment);
                    currentVertex = newCurrentVertex;
                }
            }
        }

        this.programConfigurations.populatePaintArrays(this.layoutVertexArray.length, feature, index, imagePositions);
    };

    /**
     * Add two vertices to the buffers.
     *
     * @param p the line vertex to add buffer vertices for
     * @param normal vertex normal
     * @param endLeft extrude to shift the left vertex along the line
     * @param endRight extrude to shift the left vertex along the line
     * @param segment the segment object to add the vertex to
     * @param round whether this is a round cap
     * @private
     */
    LineBucket.prototype.addCurrentVertex = function addCurrentVertex(p, normal, endLeft, endRight, segment, round) {
        if (round === void 0) round = false;

        // left and right extrude vectors, perpendicularly shifted by endLeft/endRight
        var leftX = normal.x + normal.y * endLeft;
        var leftY = normal.y - normal.x * endLeft;
        var rightX = -normal.x + normal.y * endRight;
        var rightY = -normal.y - normal.x * endRight;

        this.addHalfVertex(p, leftX, leftY, round, false, endLeft, segment);
        this.addHalfVertex(p, rightX, rightY, round, true, -endRight, segment);

        // There is a maximum "distance along the line" that we can store in the buffers.
        // When we get close to the distance, reset it to zero and add the vertex again with
        // a distance of zero. The max distance is determined by the number of bits we allocate
        // to `linesofar`.
        if (this.distance > MAX_LINE_DISTANCE / 2 && this.totalDistance === 0) {
            this.distance = 0;
            this.addCurrentVertex(p, normal, endLeft, endRight, segment, round);
        }
    };

    LineBucket.prototype.addHalfVertex = function addHalfVertex(ref, extrudeX, extrudeY, round, up, dir, segment) {
        var x = ref.x;
        var y = ref.y;

        // scale down so that we can store longer distances while sacrificing precision.
        var linesofar = this.scaledDistance * LINE_DISTANCE_SCALE;

        this.layoutVertexArray.emplaceBack(
            // a_pos_normal
            // Encode round/up the least significant bits
            (x << 1) + (round ? 1 : 0),
            (y << 1) + (up ? 1 : 0),
            // a_data
            // add 128 to store a byte in an unsigned byte
            Math.round(EXTRUDE_SCALE * extrudeX) + 128,
            Math.round(EXTRUDE_SCALE * extrudeY) + 128,
            // Encode the -1/0/1 direction value into the first two bits of .z of a_data.
            // Combine it with the lower 6 bits of `linesofar` (shifted by 2 bites to make
            // room for the direction value). The upper 8 bits of `linesofar` are placed in
            // the `w` component.
            ((dir === 0 ? 0 : (dir < 0 ? -1 : 1)) + 1) | ((linesofar & 0x3F) << 2),
            linesofar >> 6);

        var e = segment.vertexLength++;
        if (this.e1 >= 0 && this.e2 >= 0) {
            this.indexArray.emplaceBack(this.e1, this.e2, e);
            segment.primitiveLength++;
        }
        if (up) {
            this.e2 = e;
        } else {
            this.e1 = e;
        }
    };

    LineBucket.prototype.updateDistance = function updateDistance(prev, next) {
        this.distance += prev.dist(next);

        // Knowing the ratio of the full linestring covered by this tiled feature, as well
        // as the total distance (in tile units) of this tiled feature, and the distance
        // (in tile units) of the current vertex, we can determine the relative distance
        // of this vertex along the full linestring feature and scale it to [0, 2^15)
        this.scaledDistance = this.totalDistance > 0 ?
            (this.clipStart + (this.clipEnd - this.clipStart) * this.distance / this.totalDistance) * (MAX_LINE_DISTANCE - 1) :
            this.distance;
    };

    WebWorkerTransfer.register('LineBucket', LineBucket, {omit: ['layers', 'patternFeatures']});

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

            swap$1(arr, left, k);
            if (compare(arr[right], t) > 0) swap$1(arr, left, right);

            while (i < j) {
                swap$1(arr, i, j);
                i++;
                j--;
                while (compare(arr[i], t) < 0) i++;
                while (compare(arr[j], t) > 0) j--;
            }

            if (compare(arr[left], t) === 0) swap$1(arr, left, j);
            else {
                j++;
                swap$1(arr, j, right);
            }

            if (j <= k) left = j + 1;
            if (k <= j) right = j - 1;
        }
    }

    function swap$1(arr, i, j) {
        var tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }

    function defaultCompare(a, b) {
        return a < b ? -1 : a > b ? 1 : 0;
    }

    /**
     * Returns the signed area for the polygon ring.  Postive areas are exterior rings and
     * have a clockwise winding.  Negative areas are interior rings and have a counter clockwise
     * ordering.
     *
     * @private
     * @param ring Exterior or interior ring
     */
    function calculateSignedArea(ring) {
        var sum = 0;
        for (var i = 0, len = ring.length, j = len - 1, p1 = (void 0), p2 = (void 0); i < len; j = i++) {
            p1 = ring[i];
            p2 = ring[j];
            sum += (p2.x - p1.x) * (p1.y + p2.y);
        }
        return sum;
    }

    // classifies an array of rings into polygons with outer rings and holes
    function classifyRings(rings, maxRings) {
        var len = rings.length;

        if (len <= 1) {
            return [rings];
        }

        var polygons = [];
        var polygon,
            ccw;

        for (var i = 0; i < len; i++) {
            var area = calculateSignedArea(rings[i]);
            if (area === 0) {
                continue;
            }

            (rings[i]     ).area = Math.abs(area);

            if (ccw === undefined) {
                ccw = area < 0;
            }

            if (ccw === area < 0) {
                if (polygon) {
                    polygons.push(polygon);
                }
                polygon = [rings[i]];

            } else {
                (polygon     ).push(rings[i]);
            }
        }
        if (polygon) {
            polygons.push(polygon);
        }

        // Earcut performance degrades with the # of rings in a polygon. For this
        // reason, we limit strip out all but the `maxRings` largest rings.
        if (maxRings > 1) {
            for (var j = 0; j < polygons.length; j++) {
                if (polygons[j].length <= maxRings) {
                    continue;
                }
                quickselect(polygons[j], maxRings, 1, polygons[j].length - 1, compareAreas);
                polygons[j] = polygons[j].slice(0, maxRings);
            }
        }

        return polygons;
    }

    function compareAreas(a, b) {
        return b.area - a.area;
    }

    var StructArrayLayout2i4 = /*@__PURE__*/(function (StructArray) {
        function StructArrayLayout2i4() {
            StructArray.apply(this, arguments);
        }

        if (StructArray) StructArrayLayout2i4.__proto__ = StructArray;
        StructArrayLayout2i4.prototype = Object.create(StructArray && StructArray.prototype);
        StructArrayLayout2i4.prototype.constructor = StructArrayLayout2i4;

        StructArrayLayout2i4.prototype._refreshViews = function _refreshViews() {
            this.uint8 = new Uint8Array(this.arrayBuffer);
            this.int16 = new Int16Array(this.arrayBuffer);
        };

        StructArrayLayout2i4.prototype.emplaceBack = function emplaceBack(v0, v1) {
            var i = this.length;
            this.resize(i + 1);
            return this.emplace(i, v0, v1);
        };

        StructArrayLayout2i4.prototype.emplace = function emplace(i, v0, v1) {
            var o2 = i * 2;
            this.int16[o2 + 0] = v0;
            this.int16[o2 + 1] = v1;
            return i;
        };

        return StructArrayLayout2i4;
    }(StructArray));

    StructArrayLayout2i4.prototype.bytesPerElement = 4;
    WebWorkerTransfer.register('StructArrayLayout2i4', StructArrayLayout2i4);

    var StructArrayLayout2ui4 = /*@__PURE__*/(function (StructArray) {
        function StructArrayLayout2ui4() {
            StructArray.apply(this, arguments);
        }

        if (StructArray) StructArrayLayout2ui4.__proto__ = StructArray;
        StructArrayLayout2ui4.prototype = Object.create(StructArray && StructArray.prototype);
        StructArrayLayout2ui4.prototype.constructor = StructArrayLayout2ui4;

        StructArrayLayout2ui4.prototype._refreshViews = function _refreshViews() {
            this.uint8 = new Uint8Array(this.arrayBuffer);
            this.uint16 = new Uint16Array(this.arrayBuffer);
        };

        StructArrayLayout2ui4.prototype.emplaceBack = function emplaceBack(v0, v1) {
            var i = this.length;
            this.resize(i + 1);
            return this.emplace(i, v0, v1);
        };

        StructArrayLayout2ui4.prototype.emplace = function emplace(i, v0, v1) {
            var o2 = i * 2;
            this.uint16[o2 + 0] = v0;
            this.uint16[o2 + 1] = v1;
            return i;
        };

        return StructArrayLayout2ui4;
    }(StructArray));

    StructArrayLayout2ui4.prototype.bytesPerElement = 4;
    WebWorkerTransfer.register('StructArrayLayout2ui4', StructArrayLayout2ui4);

    function hasPattern(type, layers, options) {
        var patterns = options.patternDependencies;
        var hasPattern = false;

        for (var i = 0, list = layers; i < list.length; i += 1) {
            var layer = list[i];

            var patternProperty = layer.paint.get((type + "-pattern"));
            if (!patternProperty.isConstant()) {
                hasPattern = true;
            }

            var constantPattern = patternProperty.constantOr(null);
            if (constantPattern) {
                hasPattern = true;
                patterns[constantPattern.to] = true;
                patterns[constantPattern.from] = true;
            }
        }

        return hasPattern;
    }

    // Copyright 2010 The Emscripten Authors.  All rights reserved.
    // Emscripten is available under two separate licenses, the MIT license and the
    // University of Illinois/NCSA Open Source License.  Both these licenses can be
    // found in the LICENSE file.

    // The Module object: Our interface to the outside world. We import
    // and export values on it. There are various ways Module can be used:
    // 1. Not defined. We create it here
    // 2. A function parameter, function(Module) { ..generated code.. }
    // 3. pre-run appended it, var Module = {}; ..generated code..
    // 4. External script tag defines var Module.
    // We need to check if Module already exists (e.g. case 3 above).
    // Substitution will be replaced with actual code on later stage of the build,
    // this way Closure Compiler will not mangle it (e.g. case 4. above).
    // Note that if you want to run closure, and also to use Module
    // after the generated code, you will need to define   var Module = {};
    // before the code. Then that object will be used in the code, and you
    // can continue to use Module afterwards as well.
    if (typeof WebAssembly !== 'undefined') {
    	var Module = typeof Module !== 'undefined' ? Module : {};

    	// --pre-jses are emitted after the Module integration code, so that they can
    	// refer to Module (if they choose; they can also define Module)
    	// {{PRE_JSES}}

    	// Sometimes an existing Module object exists with properties
    	// meant to overwrite the default module functionality. Here
    	// we collect those properties and reapply _after_ we configure
    	// the current environment's defaults to avoid having to be so
    	// defensive during initialization.
    	var moduleOverrides = {};
    	var key;
    	for (key in Module) {
    	  if (Module.hasOwnProperty(key)) {
    		moduleOverrides[key] = Module[key];
    	  }
    	}

    	Module['arguments'] = [];
    	Module['thisProgram'] = './this.program';
    	Module['quit'] = function(status, toThrow) {
    	  throw toThrow;
    	};
    	Module['preRun'] = [];
    	Module['postRun'] = [];

    	// Determine the runtime environment we are in. You can customize this by
    	// setting the ENVIRONMENT setting at compile time (see settings.js).

    	var ENVIRONMENT_IS_WEB = false;
    	var ENVIRONMENT_IS_WORKER = false;
    	var ENVIRONMENT_IS_NODE = false;
    	var ENVIRONMENT_HAS_NODE = false;
    	var ENVIRONMENT_IS_SHELL = false;
    	ENVIRONMENT_IS_WEB = typeof window === 'object';
    	ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
    	// A web environment like Electron.js can have Node enabled, so we must
    	// distinguish between Node-enabled environments and Node environments per se.
    	// This will allow the former to do things like mount NODEFS.
    	ENVIRONMENT_HAS_NODE = typeof process === 'object' && typeof require === 'function';
    	ENVIRONMENT_IS_NODE = ENVIRONMENT_HAS_NODE && !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER;
    	ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

    	if (Module['ENVIRONMENT']) {
    	  throw new Error('Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -s ENVIRONMENT=web or -s ENVIRONMENT=node)');
    	}


    	// Three configurations we can be running in:
    	// 1) We could be the application main() thread running in the main JS UI thread. (ENVIRONMENT_IS_WORKER == false and ENVIRONMENT_IS_PTHREAD == false)
    	// 2) We could be the application main() thread proxied to worker. (with Emscripten -s PROXY_TO_WORKER=1) (ENVIRONMENT_IS_WORKER == true, ENVIRONMENT_IS_PTHREAD == false)
    	// 3) We could be an application pthread running in a worker. (ENVIRONMENT_IS_WORKER == true and ENVIRONMENT_IS_PTHREAD == true)




    	// `/` should be present at the end if `scriptDirectory` is not empty
    	var scriptDirectory = '';
    	function locateFile(path) {
    	  if (Module['locateFile']) {
    		return Module['locateFile'](path, scriptDirectory);
    	  } else {
    		return scriptDirectory + path;
    	  }
    	}

    	if (ENVIRONMENT_IS_NODE) {
    	  scriptDirectory = __dirname + '/';

    	  // Expose functionality in the same simple way that the shells work
    	  // Note that we pollute the global namespace here, otherwise we break in node
    	  var nodeFS;
    	  var nodePath;

    	  Module['read'] = function shell_read(filename, binary) {
    		var ret;
    		  if (!nodeFS) nodeFS = require('fs');
    		  if (!nodePath) nodePath = require('path');
    		  filename = nodePath['normalize'](filename);
    		  ret = nodeFS['readFileSync'](filename);
    		return binary ? ret : ret.toString();
    	  };

    	  Module['readBinary'] = function readBinary(filename) {
    		var ret = Module['read'](filename, true);
    		if (!ret.buffer) {
    		  ret = new Uint8Array(ret);
    		}
    		assert(ret.buffer);
    		return ret;
    	  };

    	  if (process['argv'].length > 1) {
    		Module['thisProgram'] = process['argv'][1].replace(/\\/g, '/');
    	  }

    	  Module['arguments'] = process['argv'].slice(2);

    	  if (typeof module !== 'undefined') {
    		module['exports'] = Module;
    	  }

    	  process['on']('uncaughtException', function(ex) {
    		// suppress ExitStatus exceptions from showing an error
    		if (!(ex instanceof ExitStatus)) {
    		  throw ex;
    		}
    	  });
    	  // Currently node will swallow unhandled rejections, but this behavior is
    	  // deprecated, and in the future it will exit with error status.
    	  process['on']('unhandledRejection', abort);

    	  Module['quit'] = function(status) {
    		process['exit'](status);
    	  };

    	  Module['inspect'] = function () { return '[Emscripten Module object]'; };
    	} else
    	if (ENVIRONMENT_IS_SHELL) {


    	  if (typeof read != 'undefined') {
    		Module['read'] = function shell_read(f) {
    		  return read(f);
    		};
    	  }

    	  Module['readBinary'] = function readBinary(f) {
    		var data;
    		if (typeof readbuffer === 'function') {
    		  return new Uint8Array(readbuffer(f));
    		}
    		data = read(f, 'binary');
    		assert(typeof data === 'object');
    		return data;
    	  };

    	  if (typeof scriptArgs != 'undefined') {
    		Module['arguments'] = scriptArgs;
    	  } else if (typeof arguments != 'undefined') {
    		Module['arguments'] = arguments;
    	  }

    	  if (typeof quit === 'function') {
    		Module['quit'] = function(status) {
    		  quit(status);
    		};
    	  }
    	} else
    	if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
    	  if (ENVIRONMENT_IS_WORKER) { // Check worker, not web, since window could be polyfilled
    		scriptDirectory = self.location.href;
    	  } else if (document.currentScript) { // web
    		scriptDirectory = document.currentScript.src;
    	  }
    	  // blob urls look like blob:http://site.com/etc/etc and we cannot infer anything from them.
    	  // otherwise, slice off the final part of the url to find the script directory.
    	  // if scriptDirectory does not contain a slash, lastIndexOf will return -1,
    	  // and scriptDirectory will correctly be replaced with an empty string.
    	  if (scriptDirectory.indexOf('blob:') !== 0) {
    		scriptDirectory = scriptDirectory.substr(0, scriptDirectory.lastIndexOf('/')+1);
    	  } else {
    		scriptDirectory = '';
    	  }


    	  Module['read'] = function shell_read(url) {
    		  var xhr = new XMLHttpRequest();
    		  xhr.open('GET', url, false);
    		  xhr.send(null);
    		  return xhr.responseText;
    	  };

    	  if (ENVIRONMENT_IS_WORKER) {
    		Module['readBinary'] = function readBinary(url) {
    			var xhr = new XMLHttpRequest();
    			xhr.open('GET', url, false);
    			xhr.responseType = 'arraybuffer';
    			xhr.send(null);
    			return new Uint8Array(xhr.response);
    		};
    	  }

    	  Module['readAsync'] = function readAsync(url, onload, onerror) {
    		var xhr = new XMLHttpRequest();
    		xhr.open('GET', url, true);
    		xhr.responseType = 'arraybuffer';
    		xhr.onload = function xhr_onload() {
    		  if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
    			onload(xhr.response);
    			return;
    		  }
    		  onerror();
    		};
    		xhr.onerror = onerror;
    		xhr.send(null);
    	  };

    	  Module['setWindowTitle'] = function(title) { document.title = title; };
    	} else
    	{
    	  throw new Error('environment detection error');
    	}

    	// Set up the out() and err() hooks, which are how we can print to stdout or
    	// stderr, respectively.
    	// If the user provided Module.print or printErr, use that. Otherwise,
    	// console.log is checked first, as 'print' on the web will open a print dialogue
    	// printErr is preferable to console.warn (works better in shells)
    	// bind(console) is necessary to fix IE/Edge closed dev tools panel behavior.
    	var out = Module['print'] || (typeof console !== 'undefined' ? console.log.bind(console) : (typeof print !== 'undefined' ? print : null));
    	var err = Module['printErr'] || (typeof printErr !== 'undefined' ? printErr : ((typeof console !== 'undefined' && console.warn.bind(console)) || out));

    	// Merge back in the overrides
    	for (key in moduleOverrides) {
    	  if (moduleOverrides.hasOwnProperty(key)) {
    		Module[key] = moduleOverrides[key];
    	  }
    	}
    	// Free the object hierarchy contained in the overrides, this lets the GC
    	// reclaim data used e.g. in memoryInitializerRequest, which is a large typed array.
    	moduleOverrides = undefined;

    	// perform assertions in shell.js after we set up out() and err(), as otherwise if an assertion fails it cannot print the message
    	assert(typeof Module['memoryInitializerPrefixURL'] === 'undefined', 'Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead');
    	assert(typeof Module['pthreadMainPrefixURL'] === 'undefined', 'Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead');
    	assert(typeof Module['cdInitializerPrefixURL'] === 'undefined', 'Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead');
    	assert(typeof Module['filePackagePrefixURL'] === 'undefined', 'Module.filePackagePrefixURL option was removed, use Module.locateFile instead');

    	// stack management, and other functionality that is provided by the compiled code,
    	// should not be used before it is ready
    	stackSave = stackRestore = stackAlloc = function() {
    	  abort('cannot use the stack before compiled code is ready to run, and has provided stack access');
    	};

    	function warnOnce(text) {
    	  if (!warnOnce.shown) warnOnce.shown = {};
    	  if (!warnOnce.shown[text]) {
    		warnOnce.shown[text] = 1;
    		//err(text);
    	  }
    	}

    	var asm2wasmImports = { // special asm2wasm imports
    		"f64-rem": function(x, y) {
    			return x % y;
    		},
    		"debugger": function() {
    			debugger;
    		}
    	};
    	var functionPointers = new Array(0);

    	var tempRet0 = 0;

    	var setTempRet0 = function(value) {
    	  tempRet0 = value;
    	};

    	var getTempRet0 = function() {
    	  return tempRet0;
    	};




    	// === Preamble library stuff ===

    	// Documentation for the public APIs defined in this file must be updated in:
    	//    site/source/docs/api_reference/preamble.js.rst
    	// A prebuilt local version of the documentation is available at:
    	//    site/build/text/docs/api_reference/preamble.js.txt
    	// You can also build docs locally as HTML or other formats in site/
    	// An online HTML version (which may be of a different version of Emscripten)
    	//    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html



    	if (typeof WebAssembly !== 'object') {
    	  abort('No WebAssembly support found. Build with -s WASM=0 to target JavaScript instead.');
    	}

    	/** @type {function(number, string, boolean=)} */
    	function getValue(ptr, type, noSafe) {
    	  type = type || 'i8';
    	  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    		switch(type) {
    		  case 'i1': return HEAP8[((ptr)>>0)];
    		  case 'i8': return HEAP8[((ptr)>>0)];
    		  case 'i16': return HEAP16[((ptr)>>1)];
    		  case 'i32': return HEAP32[((ptr)>>2)];
    		  case 'i64': return HEAP32[((ptr)>>2)];
    		  case 'float': return HEAPF32[((ptr)>>2)];
    		  case 'double': return HEAPF64[((ptr)>>3)];
    		  default: abort('invalid type for getValue: ' + type);
    		}
    	  return null;
    	}





    	// Wasm globals

    	var wasmMemory;

    	// Potentially used for direct table calls.
    	var wasmTable;


    	//========================================
    	// Runtime essentials
    	//========================================

    	// whether we are quitting the application. no code should run after this.
    	// set in exit() and abort()
    	var ABORT = false;

    	/** @type {function(*, string=)} */
    	function assert(condition, text) {
    	  if (!condition) {
    		abort('Assertion failed: ' + text);
    	  }
    	}

    	// Returns the C function with a specified identifier (for C++, you need to do manual name mangling)
    	function getCFunc(ident) {
    	  var func = Module['_' + ident]; // closure exported function
    	  assert(func, 'Cannot call unknown function ' + ident + ', make sure it is exported');
    	  return func;
    	}

    	// C calling interface.
    	function ccall(ident, returnType, argTypes, args, opts) {
    	  // For fast lookup of conversion functions
    	  var toC = {
    		'string': function(str) {
    		  var ret = 0;
    		  if (str !== null && str !== undefined && str !== 0) { // null string
    			// at most 4 bytes per UTF-8 code point, +1 for the trailing '\0'
    			var len = (str.length << 2) + 1;
    			ret = stackAlloc(len);
    			stringToUTF8(str, ret, len);
    		  }
    		  return ret;
    		},
    		'array': function(arr) {
    		  var ret = stackAlloc(arr.length);
    		  writeArrayToMemory(arr, ret);
    		  return ret;
    		}
    	  };

    	  function convertReturnValue(ret) {
    		if (returnType === 'string') return UTF8ToString(ret);
    		if (returnType === 'boolean') return Boolean(ret);
    		return ret;
    	  }

    	  var func = getCFunc(ident);
    	  var cArgs = [];
    	  var stack = 0;
    	  assert(returnType !== 'array', 'Return type should not be "array".');
    	  if (args) {
    		for (var i = 0; i < args.length; i++) {
    		  var converter = toC[argTypes[i]];
    		  if (converter) {
    			if (stack === 0) stack = stackSave();
    			cArgs[i] = converter(args[i]);
    		  } else {
    			cArgs[i] = args[i];
    		  }
    		}
    	  }
    	  var ret = func.apply(null, cArgs);
    	  ret = convertReturnValue(ret);
    	  if (stack !== 0) stackRestore(stack);
    	  return ret;
    	}

    	function cwrap(ident, returnType, argTypes, opts) {
    	  return function() {
    		return ccall(ident, returnType, argTypes, arguments);
    	  }
    	}


    	// Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the given array that contains uint8 values, returns
    	// a copy of that string as a Javascript String object.

    	var UTF8Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf8') : undefined;

    	/**
    	 * @param {number} idx
    	 * @param {number=} maxBytesToRead
    	 * @return {string}
    	 */
    	function UTF8ArrayToString(u8Array, idx, maxBytesToRead) {
    	  var endIdx = idx + maxBytesToRead;
    	  var endPtr = idx;
    	  // TextDecoder needs to know the byte length in advance, it doesn't stop on null terminator by itself.
    	  // Also, use the length info to avoid running tiny strings through TextDecoder, since .subarray() allocates garbage.
    	  // (As a tiny code save trick, compare endPtr against endIdx using a negation, so that undefined means Infinity)
    	  while (u8Array[endPtr] && !(endPtr >= endIdx)) ++endPtr;

    	  if (endPtr - idx > 16 && u8Array.subarray && UTF8Decoder) {
    		return UTF8Decoder.decode(u8Array.subarray(idx, endPtr));
    	  } else {
    		var str = '';
    		// If building with TextDecoder, we have already computed the string length above, so test loop end condition against that
    		while (idx < endPtr) {
    		  // For UTF8 byte structure, see:
    		  // http://en.wikipedia.org/wiki/UTF-8#Description
    		  // https://www.ietf.org/rfc/rfc2279.txt
    		  // https://tools.ietf.org/html/rfc3629
    		  var u0 = u8Array[idx++];
    		  if (!(u0 & 0x80)) { str += String.fromCharCode(u0); continue; }
    		  var u1 = u8Array[idx++] & 63;
    		  if ((u0 & 0xE0) == 0xC0) { str += String.fromCharCode(((u0 & 31) << 6) | u1); continue; }
    		  var u2 = u8Array[idx++] & 63;
    		  if ((u0 & 0xF0) == 0xE0) {
    			u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
    		  } else {
    			if ((u0 & 0xF8) != 0xF0) warnOnce('Invalid UTF-8 leading byte 0x' + u0.toString(16) + ' encountered when deserializing a UTF-8 string on the asm.js/wasm heap to a JS string!');
    			u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (u8Array[idx++] & 63);
    		  }

    		  if (u0 < 0x10000) {
    			str += String.fromCharCode(u0);
    		  } else {
    			var ch = u0 - 0x10000;
    			str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
    		  }
    		}
    	  }
    	  return str;
    	}

    	// Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the emscripten HEAP, returns a
    	// copy of that string as a Javascript String object.
    	// maxBytesToRead: an optional length that specifies the maximum number of bytes to read. You can omit
    	//                 this parameter to scan the string until the first \0 byte. If maxBytesToRead is
    	//                 passed, and the string at [ptr, ptr+maxBytesToReadr[ contains a null byte in the
    	//                 middle, then the string will cut short at that byte index (i.e. maxBytesToRead will
    	//                 not produce a string of exact length [ptr, ptr+maxBytesToRead[)
    	//                 N.B. mixing frequent uses of UTF8ToString() with and without maxBytesToRead may
    	//                 throw JS JIT optimizations off, so it is worth to consider consistently using one
    	//                 style or the other.
    	/**
    	 * @param {number} ptr
    	 * @param {number=} maxBytesToRead
    	 * @return {string}
    	 */
    	function UTF8ToString(ptr, maxBytesToRead) {
    	  return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : '';
    	}

    	// Copies the given Javascript String object 'str' to the given byte array at address 'outIdx',
    	// encoded in UTF8 form and null-terminated. The copy will require at most str.length*4+1 bytes of space in the HEAP.
    	// Use the function lengthBytesUTF8 to compute the exact number of bytes (excluding null terminator) that this function will write.
    	// Parameters:
    	//   str: the Javascript string to copy.
    	//   outU8Array: the array to copy to. Each index in this array is assumed to be one 8-byte element.
    	//   outIdx: The starting offset in the array to begin the copying.
    	//   maxBytesToWrite: The maximum number of bytes this function can write to the array.
    	//                    This count should include the null terminator,
    	//                    i.e. if maxBytesToWrite=1, only the null terminator will be written and nothing else.
    	//                    maxBytesToWrite=0 does not write any bytes to the output, not even the null terminator.
    	// Returns the number of bytes written, EXCLUDING the null terminator.

    	function stringToUTF8Array(str, outU8Array, outIdx, maxBytesToWrite) {
    	  if (!(maxBytesToWrite > 0)) // Parameter maxBytesToWrite is not optional. Negative values, 0, null, undefined and false each don't write out any bytes.
    		return 0;

    	  var startIdx = outIdx;
    	  var endIdx = outIdx + maxBytesToWrite - 1; // -1 for string null terminator.
    	  for (var i = 0; i < str.length; ++i) {
    		// Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
    		// See http://unicode.org/faq/utf_bom.html#utf16-3
    		// For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description and https://www.ietf.org/rfc/rfc2279.txt and https://tools.ietf.org/html/rfc3629
    		var u = str.charCodeAt(i); // possibly a lead surrogate
    		if (u >= 0xD800 && u <= 0xDFFF) {
    		  var u1 = str.charCodeAt(++i);
    		  u = 0x10000 + ((u & 0x3FF) << 10) | (u1 & 0x3FF);
    		}
    		if (u <= 0x7F) {
    		  if (outIdx >= endIdx) break;
    		  outU8Array[outIdx++] = u;
    		} else if (u <= 0x7FF) {
    		  if (outIdx + 1 >= endIdx) break;
    		  outU8Array[outIdx++] = 0xC0 | (u >> 6);
    		  outU8Array[outIdx++] = 0x80 | (u & 63);
    		} else if (u <= 0xFFFF) {
    		  if (outIdx + 2 >= endIdx) break;
    		  outU8Array[outIdx++] = 0xE0 | (u >> 12);
    		  outU8Array[outIdx++] = 0x80 | ((u >> 6) & 63);
    		  outU8Array[outIdx++] = 0x80 | (u & 63);
    		} else {
    		  if (outIdx + 3 >= endIdx) break;
    		  if (u >= 0x200000) warnOnce('Invalid Unicode code point 0x' + u.toString(16) + ' encountered when serializing a JS string to an UTF-8 string on the asm.js/wasm heap! (Valid unicode code points should be in range 0-0x1FFFFF).');
    		  outU8Array[outIdx++] = 0xF0 | (u >> 18);
    		  outU8Array[outIdx++] = 0x80 | ((u >> 12) & 63);
    		  outU8Array[outIdx++] = 0x80 | ((u >> 6) & 63);
    		  outU8Array[outIdx++] = 0x80 | (u & 63);
    		}
    	  }
    	  // Null-terminate the pointer to the buffer.
    	  outU8Array[outIdx] = 0;
    	  return outIdx - startIdx;
    	}

    	// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
    	// null-terminated and encoded in UTF8 form. The copy will require at most str.length*4+1 bytes of space in the HEAP.
    	// Use the function lengthBytesUTF8 to compute the exact number of bytes (excluding null terminator) that this function will write.
    	// Returns the number of bytes written, EXCLUDING the null terminator.

    	function stringToUTF8(str, outPtr, maxBytesToWrite) {
    	  assert(typeof maxBytesToWrite == 'number', 'stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
    	  return stringToUTF8Array(str, HEAPU8,outPtr, maxBytesToWrite);
    	}


    	// Given a pointer 'ptr' to a null-terminated UTF16LE-encoded string in the emscripten HEAP, returns
    	// a copy of that string as a Javascript String object.

    	var UTF16Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-16le') : undefined;

    	function writeArrayToMemory(array, buffer) {
    	  assert(array.length >= 0, 'writeArrayToMemory array must have a length (should be an array or typed array)');
    	  HEAP8.set(array, buffer);
    	}





    	function demangle(func) {
    	  return func;
    	}

    	function demangleAll(text) {
    	  var regex =
    		/__Z[\w\d_]+/g;
    	  return text.replace(regex,
    		function(x) {
    		  var y = demangle(x);
    		  return x === y ? x : (y + ' [' + x + ']');
    		});
    	}

    	function jsStackTrace() {
    	  var err = new Error();
    	  if (!err.stack) {
    		// IE10+ special cases: It does have callstack info, but it is only populated if an Error object is thrown,
    		// so try that as a special-case.
    		try {
    		  throw new Error(0);
    		} catch(e) {
    		  err = e;
    		}
    		if (!err.stack) {
    		  return '(no stack trace available)';
    		}
    	  }
    	  return err.stack.toString();
    	}

    	function stackTrace() {
    	  var js = jsStackTrace();
    	  if (Module['extraStackTrace']) js += '\n' + Module['extraStackTrace']();
    	  return demangleAll(js);
    	}
    	var WASM_PAGE_SIZE = 65536;

    	function alignUp(x, multiple) {
    	  if (x % multiple > 0) {
    		x += multiple - (x % multiple);
    	  }
    	  return x;
    	}

    	var /** @type {ArrayBuffer} */
    	  buffer,
    	/** @type {Int8Array} */
    	  HEAP8,
    	/** @type {Uint8Array} */
    	  HEAPU8,
    	/** @type {Int16Array} */
    	  HEAP16,
    	/** @type {Uint16Array} */
    	  HEAPU16,
    	/** @type {Int32Array} */
    	  HEAP32,
    	/** @type {Uint32Array} */
    	  HEAPU32,
    	/** @type {Float32Array} */
    	  HEAPF32,
    	/** @type {Float64Array} */
    	  HEAPF64;

    	function updateGlobalBufferViews() {
    	  Module['HEAP8'] = HEAP8 = new Int8Array(buffer);
    	  Module['HEAP16'] = HEAP16 = new Int16Array(buffer);
    	  Module['HEAP32'] = HEAP32 = new Int32Array(buffer);
    	  Module['HEAPU8'] = HEAPU8 = new Uint8Array(buffer);
    	  Module['HEAPU16'] = HEAPU16 = new Uint16Array(buffer);
    	  Module['HEAPU32'] = HEAPU32 = new Uint32Array(buffer);
    	  Module['HEAPF32'] = HEAPF32 = new Float32Array(buffer);
    	  Module['HEAPF64'] = HEAPF64 = new Float64Array(buffer);
    	}


    	var STACK_BASE = 5872,
    		STACK_MAX = 5248752,
    		DYNAMIC_BASE = 5248752,
    		DYNAMICTOP_PTR = 5840;

    	assert(STACK_BASE % 16 === 0, 'stack must start aligned');
    	assert(DYNAMIC_BASE % 16 === 0, 'heap must start aligned');



    	var TOTAL_STACK = 5242880;
    	if (Module['TOTAL_STACK']) assert(TOTAL_STACK === Module['TOTAL_STACK'], 'the stack size can no longer be determined at runtime');

    	var INITIAL_TOTAL_MEMORY = Module['TOTAL_MEMORY'] || 16777216;
    	if (INITIAL_TOTAL_MEMORY < TOTAL_STACK) err('TOTAL_MEMORY should be larger than TOTAL_STACK, was ' + INITIAL_TOTAL_MEMORY + '! (TOTAL_STACK=' + TOTAL_STACK + ')');

    	// Initialize the runtime's memory
    	// check for full engine support (use string 'subarray' to avoid closure compiler confusion)
    	assert(typeof Int32Array !== 'undefined' && typeof Float64Array !== 'undefined' && Int32Array.prototype.subarray !== undefined && Int32Array.prototype.set !== undefined,
    		   'JS engine does not provide full typed array support');







    	// Use a provided buffer, if there is one, or else allocate a new one
    	if (Module['buffer']) {
    	  buffer = Module['buffer'];
    	  assert(buffer.byteLength === INITIAL_TOTAL_MEMORY, 'provided buffer should be ' + INITIAL_TOTAL_MEMORY + ' bytes, but it is ' + buffer.byteLength);
    	} else {
    	  // Use a WebAssembly memory where available
    	  if (typeof WebAssembly === 'object' && typeof WebAssembly.Memory === 'function') {
    		assert(INITIAL_TOTAL_MEMORY % WASM_PAGE_SIZE === 0);
    		wasmMemory = new WebAssembly.Memory({ 'initial': INITIAL_TOTAL_MEMORY / WASM_PAGE_SIZE });
    		buffer = wasmMemory.buffer;
    	  } else
    	  {
    		buffer = new ArrayBuffer(INITIAL_TOTAL_MEMORY);
    	  }
    	  assert(buffer.byteLength === INITIAL_TOTAL_MEMORY);
    	}
    	updateGlobalBufferViews();


    	HEAP32[DYNAMICTOP_PTR>>2] = DYNAMIC_BASE;


    	// Initializes the stack cookie. Called at the startup of main and at the startup of each thread in pthreads mode.
    	function writeStackCookie() {
    	  assert((STACK_MAX & 3) == 0);
    	  HEAPU32[(STACK_MAX >> 2)-1] = 0x02135467;
    	  HEAPU32[(STACK_MAX >> 2)-2] = 0x89BACDFE;
    	}

    	function checkStackCookie() {
    	  if (HEAPU32[(STACK_MAX >> 2)-1] != 0x02135467 || HEAPU32[(STACK_MAX >> 2)-2] != 0x89BACDFE) {
    		abort('Stack overflow! Stack cookie has been overwritten, expected hex dwords 0x89BACDFE and 0x02135467, but received 0x' + HEAPU32[(STACK_MAX >> 2)-2].toString(16) + ' ' + HEAPU32[(STACK_MAX >> 2)-1].toString(16));
    	  }
    	  // Also test the global address 0 for integrity.
    	  if (HEAP32[0] !== 0x63736d65 /* 'emsc' */) abort('Runtime error: The application has corrupted its heap memory area (address zero)!');
    	}

    	function abortStackOverflow(allocSize) {
    	  abort('Stack overflow! Attempted to allocate ' + allocSize + ' bytes on the stack, but stack has only ' + (STACK_MAX - stackSave() + allocSize) + ' bytes available!');
    	}


    	  HEAP32[0] = 0x63736d65; /* 'emsc' */



    	// Endianness check (note: assumes compiler arch was little-endian)
    	HEAP16[1] = 0x6373;
    	if (HEAPU8[2] !== 0x73 || HEAPU8[3] !== 0x63) throw 'Runtime error: expected the system to be little-endian!';

    	function callRuntimeCallbacks(callbacks) {
    	  while(callbacks.length > 0) {
    		var callback = callbacks.shift();
    		if (typeof callback == 'function') {
    		  callback();
    		  continue;
    		}
    		var func = callback.func;
    		if (typeof func === 'number') {
    		  if (callback.arg === undefined) {
    			Module['dynCall_v'](func);
    		  } else {
    			Module['dynCall_vi'](func, callback.arg);
    		  }
    		} else {
    		  func(callback.arg === undefined ? null : callback.arg);
    		}
    	  }
    	}

    	var __ATPRERUN__  = []; // functions called before the runtime is initialized
    	var __ATINIT__    = []; // functions called during startup
    	var __ATMAIN__    = []; // functions called when main() is to be run
    	var __ATPOSTRUN__ = []; // functions called after the main() is called

    	var runtimeInitialized = false;
    	var runtimeExited = false;


    	function preRun() {
    	  // compatibility - merge in anything from Module['preRun'] at this time
    	  if (Module['preRun']) {
    		if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    		while (Module['preRun'].length) {
    		  addOnPreRun(Module['preRun'].shift());
    		}
    	  }
    	  callRuntimeCallbacks(__ATPRERUN__);
    	}

    	function ensureInitRuntime() {
    	  checkStackCookie();
    	  if (runtimeInitialized) return;
    	  runtimeInitialized = true;
    	  
    	  callRuntimeCallbacks(__ATINIT__);
    	}

    	function preMain() {
    	  checkStackCookie();
    	  
    	  callRuntimeCallbacks(__ATMAIN__);
    	}

    	function postRun() {
    	  checkStackCookie();
    	  // compatibility - merge in anything from Module['postRun'] at this time
    	  if (Module['postRun']) {
    		if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    		while (Module['postRun'].length) {
    		  addOnPostRun(Module['postRun'].shift());
    		}
    	  }
    	  callRuntimeCallbacks(__ATPOSTRUN__);
    	}

    	function addOnPreRun(cb) {
    	  __ATPRERUN__.unshift(cb);
    	}

    	function addOnPostRun(cb) {
    	  __ATPOSTRUN__.unshift(cb);
    	}


    	assert(Math.imul, 'This browser does not support Math.imul(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
    	assert(Math.fround, 'This browser does not support Math.fround(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
    	assert(Math.clz32, 'This browser does not support Math.clz32(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
    	assert(Math.trunc, 'This browser does not support Math.trunc(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');



    	// A counter of dependencies for calling run(). If we need to
    	// do asynchronous work before running, increment this and
    	// decrement it. Incrementing must happen in a place like
    	// Module.preRun (used by emcc to add file preloading).
    	// Note that you can add dependencies in preRun, even though
    	// it happens right before run - run will be postponed until
    	// the dependencies are met.
    	var runDependencies = 0;
    	var runDependencyWatcher = null;
    	var dependenciesFulfilled = null; // overridden to take different actions when all run dependencies are fulfilled
    	var runDependencyTracking = {};

    	function addRunDependency(id) {
    	  runDependencies++;
    	  if (Module['monitorRunDependencies']) {
    		Module['monitorRunDependencies'](runDependencies);
    	  }
    	  if (id) {
    		assert(!runDependencyTracking[id]);
    		runDependencyTracking[id] = 1;
    		if (runDependencyWatcher === null && typeof setInterval !== 'undefined') {
    		  // Check for missing dependencies every few seconds
    		  runDependencyWatcher = setInterval(function() {
    			if (ABORT) {
    			  clearInterval(runDependencyWatcher);
    			  runDependencyWatcher = null;
    			  return;
    			}
    		  }, 10000);
    		}
    	  }
    	}

    	function removeRunDependency(id) {
    	  runDependencies--;
    	  if (Module['monitorRunDependencies']) {
    		Module['monitorRunDependencies'](runDependencies);
    	  }
    	  if (id) {
    		assert(runDependencyTracking[id]);
    		delete runDependencyTracking[id];
    	  }
    	  if (runDependencies == 0) {
    		if (runDependencyWatcher !== null) {
    		  clearInterval(runDependencyWatcher);
    		  runDependencyWatcher = null;
    		}
    		if (dependenciesFulfilled) {
    		  var callback = dependenciesFulfilled;
    		  dependenciesFulfilled = null;
    		  callback(); // can add another dependenciesFulfilled
    		}
    	  }
    	}

    	Module["preloadedImages"] = {}; // maps url to image data
    	Module["preloadedAudios"] = {}; // maps url to audio data



    	// show errors on likely calls to FS when it was not included
    	var FS = {
    	  error: function() {
    		abort('Filesystem support (FS) was not included. The problem is that you are using files from JS, but files were not used from C/C++, so filesystem support was not auto-included. You can force-include filesystem support with  -s FORCE_FILESYSTEM=1');
    	  },
    	  init: function() { FS.error(); },
    	  createDataFile: function() { FS.error(); },
    	  createPreloadedFile: function() { FS.error(); },
    	  createLazyFile: function() { FS.error(); },
    	  open: function() { FS.error(); },
    	  mkdev: function() { FS.error(); },
    	  registerDevice: function() { FS.error(); },
    	  analyzePath: function() { FS.error(); },
    	  loadFilesFromDB: function() { FS.error(); },

    	  ErrnoError: function ErrnoError() { FS.error(); },
    	};
    	Module['FS_createDataFile'] = FS.createDataFile;
    	Module['FS_createPreloadedFile'] = FS.createPreloadedFile;



    	// Copyright 2017 The Emscripten Authors.  All rights reserved.
    	// Emscripten is available under two separate licenses, the MIT license and the
    	// University of Illinois/NCSA Open Source License.  Both these licenses can be
    	// found in the LICENSE file.

    	// Prefix of data URIs emitted by SINGLE_FILE and related options.
    	var dataURIPrefix = 'data:application/octet-stream;base64,';

    	// Indicates whether filename is a base64 data URI.
    	function isDataURI(filename) {
    	  return String.prototype.startsWith ?
    		  filename.startsWith(dataURIPrefix) :
    		  filename.indexOf(dataURIPrefix) === 0;
    	}




    	var wasmBinaryFile = 'ThirdParty/earcut.wasm';
    	if (!isDataURI(wasmBinaryFile)) {
    	  wasmBinaryFile = locateFile(wasmBinaryFile);
    	}

    	function getBinary() {
    	  try {
    		if (Module['wasmBinary']) {
    		  return new Uint8Array(Module['wasmBinary']);
    		}
    		if (Module['readBinary']) {
    		  return Module['readBinary'](wasmBinaryFile);
    		} else {
    		  throw "both async and sync fetching of the wasm failed";
    		}
    	  }
    	  catch (err) {
    		abort(err);
    	  }
    	}

    	function getBinaryPromise() {
    	  // if we don't have the binary yet, and have the Fetch api, use that
    	  // in some environments, like Electron's render process, Fetch api may be present, but have a different context than expected, let's only use it on the Web
    	  if (!Module['wasmBinary'] && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && typeof fetch === 'function') {
    		return fetch(wasmBinaryFile, { credentials: 'same-origin' }).then(function(response) {
    		  if (!response['ok']) {
    			throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
    		  }
    		  return response['arrayBuffer']();
    		}).catch(function () {
    		  return getBinary();
    		});
    	  }
    	  // Otherwise, getBinary should be able to get it synchronously
    	  return new Promise(function(resolve, reject) {
    		resolve(getBinary());
    	  });
    	}



    	// Create the wasm instance.
    	// Receives the wasm imports, returns the exports.
    	function createWasm(env) {

    	  // prepare imports
    	  var info = {
    		'env': env
    		,
    		'global': {
    		  'NaN': NaN,
    		  'Infinity': Infinity
    		},
    		'global.Math': Math,
    		'asm2wasm': asm2wasmImports
    	  };
    	  // Load the wasm module and create an instance of using native support in the JS engine.
    	  // handle a generated wasm instance, receiving its exports and
    	  // performing other necessary setup
    	  function receiveInstance(instance, module) {
    		var exports = instance.exports;
    		Module['asm'] = exports;
    		removeRunDependency('wasm-instantiate');
    	  }
    	  addRunDependency('wasm-instantiate');


    	  // Async compilation can be confusing when an error on the page overwrites Module
    	  // (for example, if the order of elements is wrong, and the one defining Module is
    	  // later), so we save Module and check it later.
    	  var trueModule = Module;
    	  function receiveInstantiatedSource(output) {
    		// 'output' is a WebAssemblyInstantiatedSource object which has both the module and instance.
    		// receiveInstance() will swap in the exports (to Module.asm) so they can be called
    		assert(Module === trueModule, 'the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?');
    		trueModule = null;
    		  // TODO: Due to Closure regression https://github.com/google/closure-compiler/issues/3193, the above line no longer optimizes out down to the following line.
    		  // When the regression is fixed, can restore the above USE_PTHREADS-enabled path.
    		receiveInstance(output['instance']);
    	  }


    	  function instantiateArrayBuffer(receiver) {
    		return getBinaryPromise().then(function(binary) {
    		  return WebAssembly.instantiate(binary, info);
    		}).then(receiver, function(reason) {
    		  //err('failed to asynchronously prepare wasm: ' + reason);
    		  //abort(reason);
    		});
    	  }

    	  // Prefer streaming instantiation if available.
    	  function instantiateAsync() {
    		if (!Module['wasmBinary'] &&
    			typeof WebAssembly.instantiateStreaming === 'function' &&
    			!isDataURI(wasmBinaryFile) &&
    			typeof fetch === 'function') {
    		  fetch(wasmBinaryFile, { credentials: 'same-origin' }).then(function (response) {
    			return WebAssembly.instantiateStreaming(response, info)
    			  .then(receiveInstantiatedSource, function(reason) {
    				// We expect the most common failure cause to be a bad MIME type for the binary,
    				// in which case falling back to ArrayBuffer instantiation should work.
    				//err('wasm streaming compile failed: ' + reason);
    				//err('falling back to ArrayBuffer instantiation');
    				instantiateArrayBuffer(receiveInstantiatedSource);
    			  });
    		  });
    		} else {
    		  return instantiateArrayBuffer(receiveInstantiatedSource);
    		}
    	  }
    	  // User shell pages can write their own Module.instantiateWasm = function(imports, successCallback) callback
    	  // to manually instantiate the Wasm module themselves. This allows pages to run the instantiation parallel
    	  // to any other async startup actions they are performing.
    	  if (Module['instantiateWasm']) {
    		try {
    		  return Module['instantiateWasm'](info, receiveInstance);
    		} catch(e) {
    		  //err('Module.instantiateWasm callback failed with error: ' + e);
    		  return false;
    		}
    	  }

    	  instantiateAsync();
    	  return {}; // no exports yet; we'll fill them in later
    	}

    	// Provide an "asm.js function" for the application, called to "link" the asm.js module. We instantiate
    	// the wasm module at that time, and it receives imports and provides exports and so forth, the app
    	// doesn't need to care that it is wasm or asm.js.

    	Module['asm'] = function(global, env, providedBuffer) {
    	  // memory was already allocated (so js could use the buffer)
    	  env['memory'] = wasmMemory
    	  ;
    	  // import table
    	  env['table'] = wasmTable = new WebAssembly.Table({
    		'initial': 260,
    		'maximum': 260,
    		'element': 'anyfunc'
    	  });
    	  // With the wasm backend __memory_base and __table_base and only needed for
    	  // relocatable output.
    	  env['__memory_base'] = 1024; // tell the memory segments where to place themselves
    	  // table starts at 0 by default (even in dynamic linking, for the main module)
    	  env['__table_base'] = 0;

    	  var exports = createWasm(env);
    	  assert(exports, 'binaryen setup failed (no wasm support?)');
    	  return exports;
    	};





    	// STATICTOP = STATIC_BASE + 4848;
    	/* global initializers */ /*__ATINIT__.push();*/








    	/* no memory initializer */
    	var tempDoublePtr = 5856;
    	assert(tempDoublePtr % 8 == 0);

    	// {{PRE_LIBRARY}}


    	  function ___cxa_allocate_exception(size) {
    		  return _malloc(size);
    		}

    	  
    	  var ___exception_infos={};
    	  
    	  var ___exception_caught= [];
    	  
    	  function ___exception_addRef(ptr) {
    		  if (!ptr) return;
    		  var info = ___exception_infos[ptr];
    		  info.refcount++;
    		}
    	  
    	  function ___exception_deAdjust(adjusted) {
    		  if (!adjusted || ___exception_infos[adjusted]) return adjusted;
    		  for (var key in ___exception_infos) {
    			var ptr = +key; // the iteration key is a string, and if we throw this, it must be an integer as that is what we look for
    			var adj = ___exception_infos[ptr].adjusted;
    			var len = adj.length;
    			for (var i = 0; i < len; i++) {
    			  if (adj[i] === adjusted) {
    				return ptr;
    			  }
    			}
    		  }
    		  return adjusted;
    		}function ___cxa_begin_catch(ptr) {
    		  var info = ___exception_infos[ptr];
    		  if (info && !info.caught) {
    			info.caught = true;
    			__ZSt18uncaught_exceptionv.uncaught_exception--;
    		  }
    		  if (info) info.rethrown = false;
    		  ___exception_caught.push(ptr);
    		  ___exception_addRef(___exception_deAdjust(ptr));
    		  return ptr;
    		}
    function ___cxa_throw(ptr, type, destructor) {
    		  ___exception_infos[ptr] = {
    			ptr: ptr,
    			adjusted: [ptr],
    			type: type,
    			destructor: destructor,
    			refcount: 0,
    			caught: false,
    			rethrown: false
    		  };
    		  if (!("uncaught_exception" in __ZSt18uncaught_exceptionv)) {
    			__ZSt18uncaught_exceptionv.uncaught_exception = 1;
    		  } else {
    			__ZSt18uncaught_exceptionv.uncaught_exception++;
    		  }
    		  throw ptr + " - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch.";
    		}

    	  function ___cxa_uncaught_exception() {
    		  return !!__ZSt18uncaught_exceptionv.uncaught_exception;
    		}

    	  function ___gxx_personality_v0() {
    		}

    	  function ___lock() {}
    var SYSCALLS={buffers:[null,[],[]],printChar:function (stream, curr) {
    			var buffer = SYSCALLS.buffers[stream];
    			assert(buffer);
    			if (curr === 0 || curr === 10) {
    			  (stream === 1 ? out : err)(UTF8ArrayToString(buffer, 0));
    			  buffer.length = 0;
    			} else {
    			  buffer.push(curr);
    			}
    		  },varargs:0,get:function (varargs) {
    			SYSCALLS.varargs += 4;
    			var ret = HEAP32[(((SYSCALLS.varargs)-(4))>>2)];
    			return ret;
    		  },getStr:function () {
    			var ret = UTF8ToString(SYSCALLS.get());
    			return ret;
    		  },get64:function () {
    			var low = SYSCALLS.get(), high = SYSCALLS.get();
    			if (low >= 0) assert(high === 0);
    			else assert(high === -1);
    			return low;
    		  },getZero:function () {
    			assert(SYSCALLS.get() === 0);
    		  }};function ___syscall140(which, varargs) {SYSCALLS.varargs = varargs;
    	  try {
    	   // llseek
    		  var stream = SYSCALLS.getStreamFromFD(), offset_high = SYSCALLS.get(), offset_low = SYSCALLS.get(), result = SYSCALLS.get(), whence = SYSCALLS.get();
    		  abort('it should not be possible to operate on streams when !SYSCALLS_REQUIRE_FILESYSTEM');
    		  return 0;
    		} catch (e) {
    		if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    		return -e.errno;
    	  }
    	  }

    	  
    	  function flush_NO_FILESYSTEM() {
    		  // flush anything remaining in the buffers during shutdown
    		  var fflush = Module["_fflush"];
    		  if (fflush) fflush(0);
    		  var buffers = SYSCALLS.buffers;
    		  if (buffers[1].length) SYSCALLS.printChar(1, 10);
    		  if (buffers[2].length) SYSCALLS.printChar(2, 10);
    		}function ___syscall146(which, varargs) {SYSCALLS.varargs = varargs;
    	  try {
    	   // writev
    		  // hack to support printf in SYSCALLS_REQUIRE_FILESYSTEM=0
    		  var stream = SYSCALLS.get(), iov = SYSCALLS.get(), iovcnt = SYSCALLS.get();
    		  var ret = 0;
    		  for (var i = 0; i < iovcnt; i++) {
    			var ptr = HEAP32[(((iov)+(i*8))>>2)];
    			var len = HEAP32[(((iov)+(i*8 + 4))>>2)];
    			for (var j = 0; j < len; j++) {
    			  SYSCALLS.printChar(stream, HEAPU8[ptr+j]);
    			}
    			ret += len;
    		  }
    		  return ret;
    		} catch (e) {
    		if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    		return -e.errno;
    	  }
    	  }

    	  function ___syscall54(which, varargs) {SYSCALLS.varargs = varargs;
    	  try {
    	   // ioctl
    		  return 0;
    		} catch (e) {
    		if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    		return -e.errno;
    	  }
    	  }

    	  function ___syscall6(which, varargs) {SYSCALLS.varargs = varargs;
    	  try {
    	   // close
    		  var stream = SYSCALLS.getStreamFromFD();
    		  abort('it should not be possible to operate on streams when !SYSCALLS_REQUIRE_FILESYSTEM');
    		  return 0;
    		} catch (e) {
    		if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    		return -e.errno;
    	  }
    	  }

    	  function ___unlock() {}

    	  function _abort() {
    		  Module['abort']();
    		}

    	  function _emscripten_get_heap_size() {
    		  return HEAP8.length;
    		}

    	   

    	   

    	  
    	  function _emscripten_memcpy_big(dest, src, num) {
    		  HEAPU8.set(HEAPU8.subarray(src, src+num), dest);
    		}
    	  
    	   

    	   

    	  
    	  function ___setErrNo(value) {
    		  if (Module['___errno_location']) HEAP32[((Module['___errno_location']())>>2)]=value;
    		  else //err('failed to set errno from JS');
    		  return value;
    		}
    	  
    	  
    	  function abortOnCannotGrowMemory(requestedSize) {
    		  abort('Cannot enlarge memory arrays to size ' + requestedSize + ' bytes (OOM). Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value ' + HEAP8.length + ', (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ');
    		}
    	  
    	  function emscripten_realloc_buffer(size) {
    		  var PAGE_MULTIPLE = 65536;
    		  size = alignUp(size, PAGE_MULTIPLE); // round up to wasm page size
    		  var oldSize = buffer.byteLength;
    		  // native wasm support
    		  // note that this is *not* threadsafe. multiple threads can call .grow(), and each
    		  // presents a delta, so in theory we may over-allocate here (e.g. if two threads
    		  // ask to grow from 256MB to 512MB, we get 2 requests to add +256MB, and may end
    		  // up growing to 768MB (even though we may have been able to make do with 512MB).
    		  // TODO: consider decreasing the step sizes in emscripten_resize_heap
    		  try {
    			var result = wasmMemory.grow((size - oldSize) / 65536); // .grow() takes a delta compared to the previous size
    			if (result !== (-1 | 0)) {
    			  // success in native wasm memory growth, get the buffer from the memory
    			  buffer = wasmMemory.buffer;
    			  return true;
    			} else {
    			  return false;
    			}
    		  } catch(e) {
    			console.error('emscripten_realloc_buffer: Attempted to grow from ' + oldSize  + ' bytes to ' + size + ' bytes, but got error: ' + e);
    			return false;
    		  }
    		}function _emscripten_resize_heap(requestedSize) {
    		  var oldSize = _emscripten_get_heap_size();
    		  // With pthreads, races can happen (another thread might increase the size in between), so return a failure, and let the caller retry.
    		  assert(requestedSize > oldSize);
    	  
    	  
    		  var PAGE_MULTIPLE = 65536;
    		  var LIMIT = 2147483648 - PAGE_MULTIPLE; // We can do one page short of 2GB as theoretical maximum.
    	  
    		  if (requestedSize > LIMIT) {
    			//err('Cannot enlarge memory, asked to go up to ' + requestedSize + ' bytes, but the limit is ' + LIMIT + ' bytes!');
    			return false;
    		  }
    	  
    		  var MIN_TOTAL_MEMORY = 16777216;
    		  var newSize = Math.max(oldSize, MIN_TOTAL_MEMORY); // So the loop below will not be infinite, and minimum asm.js memory size is 16MB.
    	  
    		  // TODO: see realloc_buffer - for PTHREADS we may want to decrease these jumps
    		  while (newSize < requestedSize) { // Keep incrementing the heap size as long as it's less than what is requested.
    			if (newSize <= 536870912) {
    			  newSize = alignUp(2 * newSize, PAGE_MULTIPLE); // Simple heuristic: double until 1GB...
    			} else {
    			  // ..., but after that, add smaller increments towards 2GB, which we cannot reach
    			  newSize = Math.min(alignUp((3 * newSize + 2147483648) / 4, PAGE_MULTIPLE), LIMIT);
    			}
    	  
    			if (newSize === oldSize) {
    			  warnOnce('Cannot ask for more memory since we reached the practical limit in browsers (which is just below 2GB), so the request would have failed. Requesting only ' + HEAP8.length);
    			}
    		  }
    	  
    		  if (!emscripten_realloc_buffer(newSize)) {
    			//err('Failed to grow the heap from ' + oldSize + ' bytes to ' + newSize + ' bytes, not enough memory!');
    			return false;
    		  }
    	  
    		  updateGlobalBufferViews();
    	  
    	  
    	  
    		  return true;
    		} 


    	// ASM_LIBRARY EXTERN PRIMITIVES: Math_max,Math_min,Int8Array,Int32Array


    	function nullFunc_ii(x) { err("Invalid function pointer called with signature 'ii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  err("Build with ASSERTIONS=2 for more info.");abort(x); }

    	function nullFunc_iidiiii(x) { err("Invalid function pointer called with signature 'iidiiii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  err("Build with ASSERTIONS=2 for more info.");abort(x); }

    	function nullFunc_iiii(x) { err("Invalid function pointer called with signature 'iiii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  err("Build with ASSERTIONS=2 for more info.");abort(x); }

    	function nullFunc_jiji(x) { err("Invalid function pointer called with signature 'jiji'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  err("Build with ASSERTIONS=2 for more info.");abort(x); }

    	function nullFunc_v(x) { err("Invalid function pointer called with signature 'v'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  err("Build with ASSERTIONS=2 for more info.");abort(x); }

    	function nullFunc_vi(x) { err("Invalid function pointer called with signature 'vi'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  err("Build with ASSERTIONS=2 for more info.");abort(x); }

    	function nullFunc_vii(x) { err("Invalid function pointer called with signature 'vii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  err("Build with ASSERTIONS=2 for more info.");abort(x); }

    	function nullFunc_viiii(x) { err("Invalid function pointer called with signature 'viiii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  err("Build with ASSERTIONS=2 for more info.");abort(x); }

    	function nullFunc_viiiii(x) { err("Invalid function pointer called with signature 'viiiii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  err("Build with ASSERTIONS=2 for more info.");abort(x); }

    	function nullFunc_viiiiii(x) { err("Invalid function pointer called with signature 'viiiiii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  err("Build with ASSERTIONS=2 for more info.");abort(x); }

    	var asmGlobalArg = {};

    	var asmLibraryArg = {
    	  "abort": abort,
    	  "setTempRet0": setTempRet0,
    	  "getTempRet0": getTempRet0,
    	  "abortStackOverflow": abortStackOverflow,
    	  "nullFunc_ii": nullFunc_ii,
    	  "nullFunc_iidiiii": nullFunc_iidiiii,
    	  "nullFunc_iiii": nullFunc_iiii,
    	  "nullFunc_jiji": nullFunc_jiji,
    	  "nullFunc_v": nullFunc_v,
    	  "nullFunc_vi": nullFunc_vi,
    	  "nullFunc_vii": nullFunc_vii,
    	  "nullFunc_viiii": nullFunc_viiii,
    	  "nullFunc_viiiii": nullFunc_viiiii,
    	  "nullFunc_viiiiii": nullFunc_viiiiii,
    	  "___cxa_allocate_exception": ___cxa_allocate_exception,
    	  "___cxa_begin_catch": ___cxa_begin_catch,
    	  "___cxa_throw": ___cxa_throw,
    	  "___cxa_uncaught_exception": ___cxa_uncaught_exception,
    	  "___exception_addRef": ___exception_addRef,
    	  "___exception_deAdjust": ___exception_deAdjust,
    	  "___gxx_personality_v0": ___gxx_personality_v0,
    	  "___lock": ___lock,
    	  "___setErrNo": ___setErrNo,
    	  "___syscall140": ___syscall140,
    	  "___syscall146": ___syscall146,
    	  "___syscall54": ___syscall54,
    	  "___syscall6": ___syscall6,
    	  "___unlock": ___unlock,
    	  "_abort": _abort,
    	  "_emscripten_get_heap_size": _emscripten_get_heap_size,
    	  "_emscripten_memcpy_big": _emscripten_memcpy_big,
    	  "_emscripten_resize_heap": _emscripten_resize_heap,
    	  "abortOnCannotGrowMemory": abortOnCannotGrowMemory,
    	  "emscripten_realloc_buffer": emscripten_realloc_buffer,
    	  "flush_NO_FILESYSTEM": flush_NO_FILESYSTEM,
    	  "tempDoublePtr": tempDoublePtr,
    	  "DYNAMICTOP_PTR": DYNAMICTOP_PTR
    	};
    	// EMSCRIPTEN_START_ASM
    	var asm =Module["asm"]// EMSCRIPTEN_END_ASM
    	(asmGlobalArg, asmLibraryArg, buffer);

    	var real___ZSt18uncaught_exceptionv = asm["__ZSt18uncaught_exceptionv"];
    	asm["__ZSt18uncaught_exceptionv"] = function() {
    	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
    	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    	  return real___ZSt18uncaught_exceptionv.apply(null, arguments);
    	};

    	var real____cxa_can_catch = asm["___cxa_can_catch"];
    	asm["___cxa_can_catch"] = function() {
    	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
    	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    	  return real____cxa_can_catch.apply(null, arguments);
    	};

    	var real____cxa_is_pointer_type = asm["___cxa_is_pointer_type"];
    	asm["___cxa_is_pointer_type"] = function() {
    	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
    	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    	  return real____cxa_is_pointer_type.apply(null, arguments);
    	};

    	var real____errno_location = asm["___errno_location"];
    	asm["___errno_location"] = function() {
    	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
    	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    	  return real____errno_location.apply(null, arguments);
    	};

    	var real__earcut = asm["_earcut"];
    	asm["_earcut"] = function() {
    	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
    	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    	  return real__earcut.apply(null, arguments);
    	};

    	var real__fflush = asm["_fflush"];
    	asm["_fflush"] = function() {
    	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
    	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    	  return real__fflush.apply(null, arguments);
    	};

    	var real__free = asm["_free"];
    	asm["_free"] = function() {
    	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
    	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    	  return real__free.apply(null, arguments);
    	};

    	var real__llvm_maxnum_f64 = asm["_llvm_maxnum_f64"];
    	asm["_llvm_maxnum_f64"] = function() {
    	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
    	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    	  return real__llvm_maxnum_f64.apply(null, arguments);
    	};

    	var real__llvm_minnum_f64 = asm["_llvm_minnum_f64"];
    	asm["_llvm_minnum_f64"] = function() {
    	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
    	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    	  return real__llvm_minnum_f64.apply(null, arguments);
    	};

    	var real__malloc = asm["_malloc"];
    	asm["_malloc"] = function() {
    	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
    	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    	  return real__malloc.apply(null, arguments);
    	};

    	var real__sbrk = asm["_sbrk"];
    	asm["_sbrk"] = function() {
    	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
    	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    	  return real__sbrk.apply(null, arguments);
    	};

    	var real_establishStackSpace = asm["establishStackSpace"];
    	asm["establishStackSpace"] = function() {
    	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
    	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    	  return real_establishStackSpace.apply(null, arguments);
    	};

    	var real_stackAlloc = asm["stackAlloc"];
    	asm["stackAlloc"] = function() {
    	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
    	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    	  return real_stackAlloc.apply(null, arguments);
    	};

    	var real_stackRestore = asm["stackRestore"];
    	asm["stackRestore"] = function() {
    	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
    	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    	  return real_stackRestore.apply(null, arguments);
    	};

    	var real_stackSave = asm["stackSave"];
    	asm["stackSave"] = function() {
    	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
    	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    	  return real_stackSave.apply(null, arguments);
    	};
    	Module["asm"] = asm;
    	var __ZSt18uncaught_exceptionv = Module["__ZSt18uncaught_exceptionv"] = function() {
    	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
    	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    	  return Module["asm"]["__ZSt18uncaught_exceptionv"].apply(null, arguments)
    	};

    	var ___cxa_can_catch = Module["___cxa_can_catch"] = function() {
    	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
    	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    	  return Module["asm"]["___cxa_can_catch"].apply(null, arguments)
    	};

    	var ___cxa_is_pointer_type = Module["___cxa_is_pointer_type"] = function() {
    	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
    	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    	  return Module["asm"]["___cxa_is_pointer_type"].apply(null, arguments)
    	};

    	var ___errno_location = Module["___errno_location"] = function() {
    	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
    	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    	  return Module["asm"]["___errno_location"].apply(null, arguments)
    	};

    	var _earcut = Module["_earcut"] = function() {
    	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
    	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    	  return Module["asm"]["_earcut"].apply(null, arguments)
    	};

    	var _emscripten_replace_memory = Module["_emscripten_replace_memory"] = function() {
    	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
    	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    	  return Module["asm"]["_emscripten_replace_memory"].apply(null, arguments)
    	};

    	var _fflush = Module["_fflush"] = function() {
    	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
    	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    	  return Module["asm"]["_fflush"].apply(null, arguments)
    	};

    	var _free = Module["_free"] = function() {
    	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
    	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    	  return Module["asm"]["_free"].apply(null, arguments)
    	};

    	var _llvm_maxnum_f64 = Module["_llvm_maxnum_f64"] = function() {
    	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
    	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    	  return Module["asm"]["_llvm_maxnum_f64"].apply(null, arguments)
    	};

    	var _llvm_minnum_f64 = Module["_llvm_minnum_f64"] = function() {
    	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
    	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    	  return Module["asm"]["_llvm_minnum_f64"].apply(null, arguments)
    	};

    	var _malloc = Module["_malloc"] = function() {
    	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
    	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    	  return Module["asm"]["_malloc"].apply(null, arguments)
    	};

    	var _memcpy = Module["_memcpy"] = function() {
    	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
    	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    	  return Module["asm"]["_memcpy"].apply(null, arguments)
    	};

    	var _memset = Module["_memset"] = function() {
    	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
    	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    	  return Module["asm"]["_memset"].apply(null, arguments)
    	};

    	var _sbrk = Module["_sbrk"] = function() {
    	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
    	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    	  return Module["asm"]["_sbrk"].apply(null, arguments)
    	};

    	var establishStackSpace = Module["establishStackSpace"] = function() {
    	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
    	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    	  return Module["asm"]["establishStackSpace"].apply(null, arguments)
    	};

    	var stackAlloc = Module["stackAlloc"] = function() {
    	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
    	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    	  return Module["asm"]["stackAlloc"].apply(null, arguments)
    	};

    	var stackRestore = Module["stackRestore"] = function() {
    	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
    	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    	  return Module["asm"]["stackRestore"].apply(null, arguments)
    	};

    	var stackSave = Module["stackSave"] = function() {
    	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
    	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    	  return Module["asm"]["stackSave"].apply(null, arguments)
    	};

    	var dynCall_ii = Module["dynCall_ii"] = function() {
    	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
    	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    	  return Module["asm"]["dynCall_ii"].apply(null, arguments)
    	};

    	var dynCall_iidiiii = Module["dynCall_iidiiii"] = function() {
    	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
    	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    	  return Module["asm"]["dynCall_iidiiii"].apply(null, arguments)
    	};

    	var dynCall_iiii = Module["dynCall_iiii"] = function() {
    	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
    	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    	  return Module["asm"]["dynCall_iiii"].apply(null, arguments)
    	};

    	var dynCall_jiji = Module["dynCall_jiji"] = function() {
    	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
    	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    	  return Module["asm"]["dynCall_jiji"].apply(null, arguments)
    	};

    	var dynCall_v = Module["dynCall_v"] = function() {
    	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
    	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    	  return Module["asm"]["dynCall_v"].apply(null, arguments)
    	};

    	var dynCall_vi = Module["dynCall_vi"] = function() {
    	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
    	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    	  return Module["asm"]["dynCall_vi"].apply(null, arguments)
    	};

    	var dynCall_vii = Module["dynCall_vii"] = function() {
    	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
    	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    	  return Module["asm"]["dynCall_vii"].apply(null, arguments)
    	};

    	var dynCall_viiii = Module["dynCall_viiii"] = function() {
    	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
    	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    	  return Module["asm"]["dynCall_viiii"].apply(null, arguments)
    	};

    	var dynCall_viiiii = Module["dynCall_viiiii"] = function() {
    	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
    	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    	  return Module["asm"]["dynCall_viiiii"].apply(null, arguments)
    	};

    	var dynCall_viiiiii = Module["dynCall_viiiiii"] = function() {
    	  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
    	  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    	  return Module["asm"]["dynCall_viiiiii"].apply(null, arguments)
    	};



    	// === Auto-generated postamble setup entry stuff ===

    	Module['asm'] = asm;

    	if (!Module["intArrayFromString"]) Module["intArrayFromString"] = function() { abort("'intArrayFromString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["intArrayToString"]) Module["intArrayToString"] = function() { abort("'intArrayToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	Module["ccall"] = ccall;
    	Module["cwrap"] = cwrap;
    	if (!Module["setValue"]) Module["setValue"] = function() { abort("'setValue' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	Module["getValue"] = getValue;
    	if (!Module["allocate"]) Module["allocate"] = function() { abort("'allocate' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["getMemory"]) Module["getMemory"] = function() { abort("'getMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you"); };
    	if (!Module["AsciiToString"]) Module["AsciiToString"] = function() { abort("'AsciiToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["stringToAscii"]) Module["stringToAscii"] = function() { abort("'stringToAscii' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["UTF8ArrayToString"]) Module["UTF8ArrayToString"] = function() { abort("'UTF8ArrayToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["UTF8ToString"]) Module["UTF8ToString"] = function() { abort("'UTF8ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["stringToUTF8Array"]) Module["stringToUTF8Array"] = function() { abort("'stringToUTF8Array' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["stringToUTF8"]) Module["stringToUTF8"] = function() { abort("'stringToUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["lengthBytesUTF8"]) Module["lengthBytesUTF8"] = function() { abort("'lengthBytesUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["UTF16ToString"]) Module["UTF16ToString"] = function() { abort("'UTF16ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["stringToUTF16"]) Module["stringToUTF16"] = function() { abort("'stringToUTF16' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["lengthBytesUTF16"]) Module["lengthBytesUTF16"] = function() { abort("'lengthBytesUTF16' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["UTF32ToString"]) Module["UTF32ToString"] = function() { abort("'UTF32ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["stringToUTF32"]) Module["stringToUTF32"] = function() { abort("'stringToUTF32' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["lengthBytesUTF32"]) Module["lengthBytesUTF32"] = function() { abort("'lengthBytesUTF32' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["allocateUTF8"]) Module["allocateUTF8"] = function() { abort("'allocateUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["stackTrace"]) Module["stackTrace"] = function() { abort("'stackTrace' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["addOnPreRun"]) Module["addOnPreRun"] = function() { abort("'addOnPreRun' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["addOnInit"]) Module["addOnInit"] = function() { abort("'addOnInit' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["addOnPreMain"]) Module["addOnPreMain"] = function() { abort("'addOnPreMain' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["addOnExit"]) Module["addOnExit"] = function() { abort("'addOnExit' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["addOnPostRun"]) Module["addOnPostRun"] = function() { abort("'addOnPostRun' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["writeStringToMemory"]) Module["writeStringToMemory"] = function() { abort("'writeStringToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["writeArrayToMemory"]) Module["writeArrayToMemory"] = function() { abort("'writeArrayToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["writeAsciiToMemory"]) Module["writeAsciiToMemory"] = function() { abort("'writeAsciiToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["addRunDependency"]) Module["addRunDependency"] = function() { abort("'addRunDependency' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you"); };
    	if (!Module["removeRunDependency"]) Module["removeRunDependency"] = function() { abort("'removeRunDependency' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you"); };
    	if (!Module["ENV"]) Module["ENV"] = function() { abort("'ENV' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["FS"]) Module["FS"] = function() { abort("'FS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["FS_createFolder"]) Module["FS_createFolder"] = function() { abort("'FS_createFolder' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you"); };
    	if (!Module["FS_createPath"]) Module["FS_createPath"] = function() { abort("'FS_createPath' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you"); };
    	if (!Module["FS_createDataFile"]) Module["FS_createDataFile"] = function() { abort("'FS_createDataFile' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you"); };
    	if (!Module["FS_createPreloadedFile"]) Module["FS_createPreloadedFile"] = function() { abort("'FS_createPreloadedFile' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you"); };
    	if (!Module["FS_createLazyFile"]) Module["FS_createLazyFile"] = function() { abort("'FS_createLazyFile' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you"); };
    	if (!Module["FS_createLink"]) Module["FS_createLink"] = function() { abort("'FS_createLink' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you"); };
    	if (!Module["FS_createDevice"]) Module["FS_createDevice"] = function() { abort("'FS_createDevice' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you"); };
    	if (!Module["FS_unlink"]) Module["FS_unlink"] = function() { abort("'FS_unlink' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you"); };
    	if (!Module["GL"]) Module["GL"] = function() { abort("'GL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["dynamicAlloc"]) Module["dynamicAlloc"] = function() { abort("'dynamicAlloc' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["warnOnce"]) Module["warnOnce"] = function() { abort("'warnOnce' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["loadDynamicLibrary"]) Module["loadDynamicLibrary"] = function() { abort("'loadDynamicLibrary' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["loadWebAssemblyModule"]) Module["loadWebAssemblyModule"] = function() { abort("'loadWebAssemblyModule' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["getLEB"]) Module["getLEB"] = function() { abort("'getLEB' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["getFunctionTables"]) Module["getFunctionTables"] = function() { abort("'getFunctionTables' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["alignFunctionTables"]) Module["alignFunctionTables"] = function() { abort("'alignFunctionTables' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["registerFunctions"]) Module["registerFunctions"] = function() { abort("'registerFunctions' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["addFunction"]) Module["addFunction"] = function() { abort("'addFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["removeFunction"]) Module["removeFunction"] = function() { abort("'removeFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["getFuncWrapper"]) Module["getFuncWrapper"] = function() { abort("'getFuncWrapper' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["prettyPrint"]) Module["prettyPrint"] = function() { abort("'prettyPrint' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["makeBigInt"]) Module["makeBigInt"] = function() { abort("'makeBigInt' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["dynCall"]) Module["dynCall"] = function() { abort("'dynCall' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["getCompilerSetting"]) Module["getCompilerSetting"] = function() { abort("'getCompilerSetting' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["stackSave"]) Module["stackSave"] = function() { abort("'stackSave' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["stackRestore"]) Module["stackRestore"] = function() { abort("'stackRestore' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["stackAlloc"]) Module["stackAlloc"] = function() { abort("'stackAlloc' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["establishStackSpace"]) Module["establishStackSpace"] = function() { abort("'establishStackSpace' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["print"]) Module["print"] = function() { abort("'print' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["printErr"]) Module["printErr"] = function() { abort("'printErr' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["getTempRet0"]) Module["getTempRet0"] = function() { abort("'getTempRet0' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["setTempRet0"]) Module["setTempRet0"] = function() { abort("'setTempRet0' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };
    	if (!Module["Pointer_stringify"]) Module["Pointer_stringify"] = function() { abort("'Pointer_stringify' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); };if (!Module["ALLOC_NORMAL"]) Object.defineProperty(Module, "ALLOC_NORMAL", { get: function() { abort("'ALLOC_NORMAL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); } });
    	if (!Module["ALLOC_STACK"]) Object.defineProperty(Module, "ALLOC_STACK", { get: function() { abort("'ALLOC_STACK' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); } });
    	if (!Module["ALLOC_DYNAMIC"]) Object.defineProperty(Module, "ALLOC_DYNAMIC", { get: function() { abort("'ALLOC_DYNAMIC' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); } });
    	if (!Module["ALLOC_NONE"]) Object.defineProperty(Module, "ALLOC_NONE", { get: function() { abort("'ALLOC_NONE' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"); } });




    	/**
    	 * @constructor
    	 * @extends {Error}
    	 * @this {ExitStatus}
    	 */
    	function ExitStatus(status) {
    	  this.name = "ExitStatus";
    	  this.message = "Program terminated with exit(" + status + ")";
    	  this.status = status;
    	}	ExitStatus.prototype = new Error();
    	ExitStatus.prototype.constructor = ExitStatus;

    	dependenciesFulfilled = function runCaller() {
    	  // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
    	  if (!Module['calledRun']) run();
    	  if (!Module['calledRun']) dependenciesFulfilled = runCaller; // try this again later, after new deps are fulfilled
    	};





    	/** @type {function(Array=)} */
    	function run(args) {
    	  args = args || Module['arguments'];

    	  if (runDependencies > 0) {
    		return;
    	  }

    	  writeStackCookie();

    	  preRun();

    	  if (runDependencies > 0) return; // a preRun added a dependency, run will be called later
    	  if (Module['calledRun']) return; // run may have just been called through dependencies being fulfilled just in this very frame

    	  function doRun() {
    		if (Module['calledRun']) return; // run may have just been called while the async setStatus time below was happening
    		Module['calledRun'] = true;

    		if (ABORT) return;

    		ensureInitRuntime();

    		preMain();

    		if (Module['onRuntimeInitialized']) Module['onRuntimeInitialized']();

    		assert(!Module['_main'], 'compiled without a main, but one is present. if you added it from JS, use Module["onRuntimeInitialized"]');

    		postRun();
    	  }

    	  if (Module['setStatus']) {
    		Module['setStatus']('Running...');
    		setTimeout(function() {
    		  setTimeout(function() {
    			Module['setStatus']('');
    		  }, 1);
    		  doRun();
    		}, 1);
    	  } else {
    		doRun();
    	  }
    	  checkStackCookie();
    	}
    	Module['run'] = run;

    	var abortDecorators = [];

    	function abort(what) {
    	  if (Module['onAbort']) {
    		Module['onAbort'](what);
    	  }

    	  if (what !== undefined) {
    		//out(what);
    		//err(what);
    		what = '"' + what + '"';
    	  } else {
    		what = '';
    	  }

    	  ABORT = true;

    	  var extra = '';
    	  var output = 'abort(' + what + ') at ' + stackTrace() + extra;
    	  if (abortDecorators) {
    		abortDecorators.forEach(function(decorator) {
    		  output = decorator(output, what);
    		});
    	  }
    	  throw output;
    	}
    	Module['abort'] = abort;

    	if (Module['preInit']) {
    	  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
    	  while (Module['preInit'].length > 0) {
    		Module['preInit'].pop()();
    	  }
    	}


    	  Module["noExitRuntime"] = true;

    	run();
    } else {
        var Module = null;
    }

    var earcutWasm = Module;



    // {{MODULE_ADDITIONS}}

    var earcutWasmReady = false;
    if (defined.defined(earcutWasm)) {
        earcutWasm.onRuntimeInitialized = function () {
            earcutWasmReady = true;
        };
        var earcutwasm = earcutWasm.cwrap('earcut','number',['number','number','number','number','number','number']);
    }

    var layout$3 = createLayout([
        {name: 'a_pos', components: 2, type: 'Int16'}
    ], 4);
    var members$1 = layout$3.members;

    var EARCUT_MAX_RINGS = 500;

    var FillBucket = function FillBucket(options) {
        this.zoom = options.zoom;
        this.overscaling = options.overscaling;
        this.layers = options.layers;
        this.layerIds = this.layers.map(function (layer) {
            return layer.id;
        });
        this.index = options.index;
        this.hasPattern = false;
        this.patternFeatures = [];

        this.layoutVertexArray = new StructArrayLayout2i4();
        this.indexArray = new StructArrayLayout3ui6();
        this.indexArray2 = new StructArrayLayout2ui4();
        this.programConfigurations = new ProgramConfigurationSet(members$1, options.layers, options.zoom);
        this.segments = new SegmentVector();
        this.segments2 = new SegmentVector();
        this.stateDependentLayerIds = this.layers.filter(function (l) {
            return l.isStateDependent();
        }).map(function (l) {
            return l.id;
        });
    };

    FillBucket.prototype.populate = function populate(features, options) {
        this.hasPattern = hasPattern('fill', this.layers, options);
        var bucketFeatures = [];

        for (var i = 0, list = features; i < list.length; i += 1) {
            var ref = list[i];
            var feature = ref.feature;
            var index = ref.index;
            var sourceLayerIndex = ref.sourceLayerIndex;

            if (!this.layers[0]._featureFilter(new EvaluationParameters$1(0), feature)) {
                continue;
            }

            var geometry = loadGeometry(feature);
            var sortKey = 
                undefined;

            var bucketFeature = {
                id: feature.id,
                properties: feature.properties,
                type: feature.type,
                sourceLayerIndex: sourceLayerIndex,
                index: index,
                geometry: geometry,
                patterns: {},
                sortKey: sortKey
            };

            bucketFeatures.push(bucketFeature);
        }

        for (var i$1 = 0, list$1 = bucketFeatures; i$1 < list$1.length; i$1 += 1) {
            var bucketFeature$1 = list$1[i$1];

            var ref$1 = bucketFeature$1;
            var geometry$1 = ref$1.geometry;
            var index$1 = ref$1.index;
            var sourceLayerIndex$1 = ref$1.sourceLayerIndex;

            if (this.hasPattern) {
                var patternFeature = addPatternDependencies('fill', this.layers, bucketFeature$1, this.zoom, options);
                // pattern features are added only once the pattern is loaded into the image atlas
                // so are stored during populate until later updated with positions by tile worker in addFeatures
                this.patternFeatures.push(patternFeature);
            } else {
                this.addFeature(bucketFeature$1, geometry$1, index$1, {}, options.indexData);
            }

            var feature$1 = features[index$1].feature;
            options.featureIndex.insert(feature$1, geometry$1, index$1, sourceLayerIndex$1, this.index);
        }
    };

    FillBucket.prototype.update = function update(states, vtLayer, imagePositions) {
        if (!this.stateDependentLayers.length) {
            return;
        }
        this.programConfigurations.updatePaintArrays(states, vtLayer, this.stateDependentLayers, imagePositions);
    };

    FillBucket.prototype.addFeatures = function addFeatures(options, imagePositions) {
        for (var i = 0, list = this.patternFeatures; i < list.length; i += 1) {
            var feature = list[i];

            this.addFeature(feature, feature.geometry, feature.index, imagePositions);
        }
    };

    FillBucket.prototype.isEmpty = function isEmpty() {
        return this.layoutVertexArray.length === 0;
    };

    FillBucket.prototype.uploadPending = function uploadPending() {
        return !this.uploaded || this.programConfigurations.needsUpload;
    };
    FillBucket.prototype.upload = function upload(context) {
        if (!this.uploaded) {
            if(this.layoutVertexArray == null) {
                return;
            }
            this.layoutVertexBuffer = context.createVertexBuffer(this.layoutVertexArray, members$1);
            this.indexBuffer = context.createIndexBuffer(this.indexArray);
            this.indexBuffer2 = context.createIndexBuffer(this.indexArray2);
        }
        this.programConfigurations.upload(context);
        this.uploaded = true;
    };

    FillBucket.prototype.destroy = function destroy() {
        if (!this.layoutVertexBuffer) {
            return;
        }
        this.layoutVertexBuffer.destroy();
        this.indexBuffer.destroy();
        this.indexBuffer2.destroy();
        this.programConfigurations.destroy();
        this.segments.destroy();
        this.segments2.destroy();
    };

    FillBucket.prototype.clear = function clear() {
        if (defined.defined(this.layoutVertexArray)) {
            this.layoutVertexArray = null;
        }
        if (defined.defined(this.indexArray)) {
            this.indexArray = null;
        }
        if (defined.defined(this.indexArray2)) {
            this.indexArray2 = null;
        }
    };

    FillBucket.prototype.addFeature = function addFeature(feature, geometry, index, imagePositions, indexData) {
        for (var i$4 = 0, list$2 = classifyRings(geometry, EARCUT_MAX_RINGS); i$4 < list$2.length; i$4 += 1) {
            var polygon = list$2[i$4];

            var numVertices = 0;
            for (var i$2 = 0, list = polygon; i$2 < list.length; i$2 += 1) {
                var ring = list[i$2];

                numVertices += ring.length;
            }

            var triangleSegment = this.segments.prepareSegment(numVertices, this.layoutVertexArray, this.indexArray);
            var triangleIndex = triangleSegment.vertexLength;

            var flattened = [];
            var holeIndices = [];

            for (var i$3 = 0, list$1 = polygon; i$3 < list$1.length; i$3 += 1) {
                var ring$1 = list$1[i$3];

                if (ring$1.length === 0) {
                    continue;
                }

                if (ring$1 !== polygon[0]) {
                    holeIndices.push(flattened.length / 2);
                }

                var lineSegment = this.segments2.prepareSegment(ring$1.length, this.layoutVertexArray, this.indexArray2);
                var lineIndex = lineSegment.vertexLength;

                this.layoutVertexArray.emplaceBack(ring$1[0].x, ring$1[0].y);
                this.indexArray2.emplaceBack(lineIndex + ring$1.length - 1, lineIndex);
                flattened.push(ring$1[0].x);
                flattened.push(ring$1[0].y);

                for (var i = 1; i < ring$1.length; i++) {
                    this.layoutVertexArray.emplaceBack(ring$1[i].x, ring$1[i].y);
                    this.indexArray2.emplaceBack(lineIndex + i - 1, lineIndex + i);
                    flattened.push(ring$1[i].x);
                    flattened.push(ring$1[i].y);
                }

                lineSegment.vertexLength += ring$1.length;
                lineSegment.primitiveLength += ring$1.length;
            }
            
            var indices;

            if (defined.defined(indexData) && defined.defined(indexData[feature.id])) {
                indices = indexData[feature.id];
            } else if (earcutWasmReady === true) {
                var data = new Int32Array(flattened);
                var dataLength = data.length;

                var offset = earcutWasm._malloc(Int32Array.BYTES_PER_ELEMENT * dataLength); //开辟内存
                earcutWasm.HEAP32.set(data, offset / Int32Array.BYTES_PER_ELEMENT); //设置值

                var hole = new Int32Array(holeIndices);
                var holeLength = hole.length;
                var offset1 = earcutWasm._malloc(Int32Array.BYTES_PER_ELEMENT * holeLength); //开辟内存
                earcutWasm.HEAP32.set(hole, offset1 / Int32Array.BYTES_PER_ELEMENT); //设置值

                var res = new Int32Array(dataLength * 10);
                var offset2 = earcutWasm._malloc(Int32Array.BYTES_PER_ELEMENT * dataLength * 10); //开辟内存
                earcutWasm.HEAP32.set(res, offset2 / Int32Array.BYTES_PER_ELEMENT);

                var len = earcutwasm(offset, dataLength, offset1, holeLength, 2, offset2);
                var result = new Int32Array(earcutWasm.HEAP32.buffer, offset2, len);
                indices = new Int32Array(result);
                earcutWasm._free(offset);
                earcutWasm._free(offset1);
                earcutWasm._free(offset2);
            }  else {
                indices = earcut2_2_1.earcut(flattened, holeIndices);
            }
            
            for (var i$1 = 0; i$1 < indices.length; i$1 += 3) {
                this.indexArray.emplaceBack(
                    triangleIndex + indices[i$1],
                    triangleIndex + indices[i$1 + 1],
                    triangleIndex + indices[i$1 + 2]);
            }

            triangleSegment.vertexLength += numVertices;
            triangleSegment.primitiveLength += indices.length / 3;
        }
        this.programConfigurations.populatePaintArrays(this.layoutVertexArray.length, feature, index, imagePositions);
    };

    WebWorkerTransfer.register('FillBucket', FillBucket, {omit: ['layers', 'patternFeatures']});

    var Struct = function Struct(structArray           , index      ) {
        (this   )._structArray = structArray;
        this._pos1 = index * this.size;
        this._pos2 = this._pos1 / 2;
        this._pos4 = this._pos1 / 4;
        this._pos8 = this._pos1 / 8;
    };

    var DEFAULT_CAPACITY$1 = 128;
    var RESIZE_MULTIPLIER$1 = 5;

    /**
     * `StructArray` provides an abstraction over `ArrayBuffer` and `TypedArray`
     * making it behave like an array of typed structs.
     *
     * Conceptually, a StructArray is comprised of elements, i.e., instances of its
     * associated struct type. Each particular struct type, together with an
     * alignment size, determines the memory layout of a StructArray whose elements
     * are of that type.  Thus, for each such layout that we need, we have
     * a corrseponding StructArrayLayout class, inheriting from StructArray and
     * implementing `emplaceBack()` and `_refreshViews()`.
     *
     * In some cases, where we need to access particular elements of a StructArray,
     * we implement a more specific subclass that inherits from one of the
     * StructArrayLayouts and adds a `get(i): T` accessor that returns a structured
     * object whose properties are proxies into the underlying memory space for the
     * i-th element.  This affords the convience of working with (seemingly) plain
     * Javascript objects without the overhead of serializing/deserializing them
     * into ArrayBuffers for efficient web worker transfer.
     *
     * @private
     */
    var StructArray$1 = function StructArray() {
        this.isTransferred = false;
        this.capacity = -1;
        this.resize(0);
    };

    /**
     * Serialize a StructArray instance.Serializes both the raw data and the
     * metadata needed to reconstruct the StructArray base class during
     * deserialization.
     */
    StructArray$1.serialize = function serialize (array, transferables) {
        //assert_1(!array.isTransferred);
        if(array.isTransferred){
            console.log("StructArray array.isTransferred.");
        }

        array._trim();

        if (transferables) {
            array.isTransferred = true;
            transferables.push(array.arrayBuffer);
        }

        return {
            length: array.length,
            arrayBuffer: array.arrayBuffer,
        };
    };

    StructArray$1.deserialize = function deserialize (input                     ) {
        var structArray = Object.create(this.prototype);
        structArray.arrayBuffer = input.arrayBuffer;
        structArray.length = input.length;
        structArray.capacity = input.arrayBuffer.byteLength / structArray.bytesPerElement;
        structArray._refreshViews();
        return structArray;
    };

    /**
     * Resize the array to discard unused capacity.
     */
    StructArray$1.prototype._trim = function _trim () {
        if (this.length !== this.capacity) {
            this.capacity = this.length;
            this.arrayBuffer = this.arrayBuffer.slice(0, this.length * this.bytesPerElement);
            this._refreshViews();
        }
    };

    /**
     * Resets the the length of the array to 0 without de-allocating capcacity.
     */
    StructArray$1.prototype.clear = function clear () {
        this.length = 0;
    };

    /**
     * Resize the array.
     * If `n` is greater than the current length then additional elements with undefined values are added.
     * If `n` is less than the current length then the array will be reduced to the first `n` elements.
     * @param {number} n The new size of the array.
     */
    StructArray$1.prototype.resize = function resize (n      ) {
        //assert_1(!this.isTransferred);
        this.reserve(n);
        this.length = n;
    };

    /**
     * Indicate a planned increase in size, so that any necessary allocation may
     * be done once, ahead of time.
     * @param {number} n The expected size of the array.
     */
    StructArray$1.prototype.reserve = function reserve (n      ) {
        if (n > this.capacity) {
            this.capacity = Math.max(n, Math.floor(this.capacity * RESIZE_MULTIPLIER$1), DEFAULT_CAPACITY$1);
            this.arrayBuffer = new ArrayBuffer(this.capacity * this.bytesPerElement);

            var oldUint8Array = this.uint8;
            this._refreshViews();
            if (oldUint8Array) { this.uint8.set(oldUint8Array); }
        }
    };

    /**
     * Create TypedArray views for the current ArrayBuffer.
     */
    StructArray$1.prototype._refreshViews = function _refreshViews () {
        throw new Error('_refreshViews() must be implemented by each concrete StructArray layout');
    };
    /**
     * Implementation of the StructArray layout:
     * [0]: Uint32[1]
     * [4]: Uint16[2]
     *
     * @private
     */
    var StructArrayLayout1ul2ui8 = /*@__PURE__*/(function (StructArray) {
        function StructArrayLayout1ul2ui8 () {
            StructArray.apply(this, arguments);
        }

        if ( StructArray ) StructArrayLayout1ul2ui8.__proto__ = StructArray;
        StructArrayLayout1ul2ui8.prototype = Object.create( StructArray && StructArray.prototype );
        StructArrayLayout1ul2ui8.prototype.constructor = StructArrayLayout1ul2ui8;

        StructArrayLayout1ul2ui8.prototype._refreshViews = function _refreshViews () {
            this.uint8 = new Uint8Array(this.arrayBuffer);
            this.uint32 = new Uint32Array(this.arrayBuffer);
            this.uint16 = new Uint16Array(this.arrayBuffer);
        };

        StructArrayLayout1ul2ui8.prototype.emplaceBack = function emplaceBack (v0        , v1        , v2        ) {
            var i = this.length;
            this.resize(i + 1);
            return this.emplace(i, v0, v1, v2);
        };

        StructArrayLayout1ul2ui8.prototype.emplace = function emplace (i        , v0        , v1        , v2        ) {
            var o4 = i * 2;
            var o2 = i * 4;
            this.uint32[o4 + 0] = v0;
            this.uint16[o2 + 2] = v1;
            this.uint16[o2 + 3] = v2;
            return i;
        };

        return StructArrayLayout1ul2ui8;
    }(StructArray$1));

    StructArrayLayout1ul2ui8.prototype.bytesPerElement = 8;

    var FeatureIndexStruct = /*@__PURE__*/(function (Struct) {
        function FeatureIndexStruct () {
            Struct.apply(this, arguments);
        }

        if ( Struct ) FeatureIndexStruct.__proto__ = Struct;
        FeatureIndexStruct.prototype = Object.create( Struct && Struct.prototype );
        FeatureIndexStruct.prototype.constructor = FeatureIndexStruct;

        var prototypeAccessors$5 = { featureIndex: { configurable: true },sourceLayerIndex: { configurable: true },bucketIndex: { configurable: true } };

        prototypeAccessors$5.featureIndex.get = function () { return this._structArray.uint32[this._pos4 + 0]; };
        prototypeAccessors$5.featureIndex.set = function (x        ) { this._structArray.uint32[this._pos4 + 0] = x; };
        prototypeAccessors$5.sourceLayerIndex.get = function () { return this._structArray.uint16[this._pos2 + 2]; };
        prototypeAccessors$5.sourceLayerIndex.set = function (x        ) { this._structArray.uint16[this._pos2 + 2] = x; };
        prototypeAccessors$5.bucketIndex.get = function () { return this._structArray.uint16[this._pos2 + 3]; };
        prototypeAccessors$5.bucketIndex.set = function (x        ) { this._structArray.uint16[this._pos2 + 3] = x; };

        Object.defineProperties( FeatureIndexStruct.prototype, prototypeAccessors$5 );

        return FeatureIndexStruct;
    }(Struct));

    FeatureIndexStruct.prototype.size = 8;

    /**
     * @private
     */
    var FeatureIndexArray = /*@__PURE__*/(function (StructArrayLayout1ul2ui8) {
        function FeatureIndexArray () {
            StructArrayLayout1ul2ui8.apply(this, arguments);
        }

        if ( StructArrayLayout1ul2ui8 ) FeatureIndexArray.__proto__ = StructArrayLayout1ul2ui8;
        FeatureIndexArray.prototype = Object.create( StructArrayLayout1ul2ui8 && StructArrayLayout1ul2ui8.prototype );
        FeatureIndexArray.prototype.constructor = FeatureIndexArray;

        FeatureIndexArray.prototype.get = function get (index        )                     {
            //assert_1(!this.isTransferred);
            return new FeatureIndexStruct(this, index);
        };

        return FeatureIndexArray;
    }(StructArrayLayout1ul2ui8));

    WebWorkerTransfer.register('FeatureIndexArray', FeatureIndexArray, {omit: ['layers', 'patternFeatures']});
    var arrayTypes = {
        FeatureIndexArray : FeatureIndexArray
    };

    /**
     * A standalone point geometry with useful accessor, comparison, and
     * modification methods.
     *
     * @class Point
     * @param {Number} x the x-coordinate. this could be longitude or screen
     * pixels, or any other sort of unit.
     * @param {Number} y the y-coordinate. this could be latitude or screen
     * pixels, or any other sort of unit.
     * @example
     * var point = new Point(-77, 38);
     */
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }

    Point.prototype = {

        /**
         * Clone this point, returning a new point that can be modified
         * without affecting the old one.
         * @return {Point} the clone
         */
        clone: function() { return new Point(this.x, this.y); },

        /**
         * Add this point's x & y coordinates to another point,
         * yielding a new point.
         * @param {Point} p the other point
         * @return {Point} output point
         */
        add:     function(p) { return this.clone()._add(p); },

        /**
         * Subtract this point's x & y coordinates to from point,
         * yielding a new point.
         * @param {Point} p the other point
         * @return {Point} output point
         */
        sub:     function(p) { return this.clone()._sub(p); },

        /**
         * Multiply this point's x & y coordinates by point,
         * yielding a new point.
         * @param {Point} p the other point
         * @return {Point} output point
         */
        multByPoint:    function(p) { return this.clone()._multByPoint(p); },

        /**
         * Divide this point's x & y coordinates by point,
         * yielding a new point.
         * @param {Point} p the other point
         * @return {Point} output point
         */
        divByPoint:     function(p) { return this.clone()._divByPoint(p); },

        /**
         * Multiply this point's x & y coordinates by a factor,
         * yielding a new point.
         * @param {Point} k factor
         * @return {Point} output point
         */
        mult:    function(k) { return this.clone()._mult(k); },

        /**
         * Divide this point's x & y coordinates by a factor,
         * yielding a new point.
         * @param {Point} k factor
         * @return {Point} output point
         */
        div:     function(k) { return this.clone()._div(k); },

        /**
         * Rotate this point around the 0, 0 origin by an angle a,
         * given in radians
         * @param {Number} a angle to rotate around, in radians
         * @return {Point} output point
         */
        rotate:  function(a) { return this.clone()._rotate(a); },

        /**
         * Rotate this point around p point by an angle a,
         * given in radians
         * @param {Number} a angle to rotate around, in radians
         * @param {Point} p Point to rotate around
         * @return {Point} output point
         */
        rotateAround:  function(a,p) { return this.clone()._rotateAround(a,p); },

        /**
         * Multiply this point by a 4x1 transformation matrix
         * @param {Array<Number>} m transformation matrix
         * @return {Point} output point
         */
        matMult: function(m) { return this.clone()._matMult(m); },

        /**
         * Calculate this point but as a unit vector from 0, 0, meaning
         * that the distance from the resulting point to the 0, 0
         * coordinate will be equal to 1 and the angle from the resulting
         * point to the 0, 0 coordinate will be the same as before.
         * @return {Point} unit vector point
         */
        unit:    function() { return this.clone()._unit(); },

        /**
         * Compute a perpendicular point, where the new y coordinate
         * is the old x coordinate and the new x coordinate is the old y
         * coordinate multiplied by -1
         * @return {Point} perpendicular point
         */
        perp:    function() { return this.clone()._perp(); },

        /**
         * Return a version of this point with the x & y coordinates
         * rounded to integers.
         * @return {Point} rounded point
         */
        round:   function() { return this.clone()._round(); },

        /**
         * Return the magitude of this point: this is the Euclidean
         * distance from the 0, 0 coordinate to this point's x and y
         * coordinates.
         * @return {Number} magnitude
         */
        mag: function() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        },

        /**
         * Judge whether this point is equal to another point, returning
         * true or false.
         * @param {Point} other the other point
         * @return {boolean} whether the points are equal
         */
        equals: function(other) {
            return this.x === other.x &&
                this.y === other.y;
        },

        /**
         * Calculate the distance from this point to another point
         * @param {Point} p the other point
         * @return {Number} distance
         */
        dist: function(p) {
            return Math.sqrt(this.distSqr(p));
        },

        /**
         * Calculate the distance from this point to another point,
         * without the square root step. Useful if you're comparing
         * relative distances.
         * @param {Point} p the other point
         * @return {Number} distance
         */
        distSqr: function(p) {
            var dx = p.x - this.x,
                dy = p.y - this.y;
            return dx * dx + dy * dy;
        },

        /**
         * Get the angle from the 0, 0 coordinate to this point, in radians
         * coordinates.
         * @return {Number} angle
         */
        angle: function() {
            return Math.atan2(this.y, this.x);
        },

        /**
         * Get the angle from this point to another point, in radians
         * @param {Point} b the other point
         * @return {Number} angle
         */
        angleTo: function(b) {
            return Math.atan2(this.y - b.y, this.x - b.x);
        },

        /**
         * Get the angle between this point and another point, in radians
         * @param {Point} b the other point
         * @return {Number} angle
         */
        angleWith: function(b) {
            return this.angleWithSep(b.x, b.y);
        },

        /*
         * Find the angle of the two vectors, solving the formula for
         * the cross product a x b = |a||b|sin(θ) for θ.
         * @param {Number} x the x-coordinate
         * @param {Number} y the y-coordinate
         * @return {Number} the angle in radians
         */
        angleWithSep: function(x, y) {
            return Math.atan2(
                this.x * y - this.y * x,
                this.x * x + this.y * y);
        },

        _matMult: function(m) {
            var x = m[0] * this.x + m[1] * this.y,
                y = m[2] * this.x + m[3] * this.y;
            this.x = x;
            this.y = y;
            return this;
        },

        _add: function(p) {
            this.x += p.x;
            this.y += p.y;
            return this;
        },

        _sub: function(p) {
            this.x -= p.x;
            this.y -= p.y;
            return this;
        },

        _mult: function(k) {
            this.x *= k;
            this.y *= k;
            return this;
        },

        _div: function(k) {
            this.x /= k;
            this.y /= k;
            return this;
        },

        _multByPoint: function(p) {
            this.x *= p.x;
            this.y *= p.y;
            return this;
        },

        _divByPoint: function(p) {
            this.x /= p.x;
            this.y /= p.y;
            return this;
        },

        _unit: function() {
            this._div(this.mag());
            return this;
        },

        _perp: function() {
            var y = this.y;
            this.y = this.x;
            this.x = -y;
            return this;
        },

        _rotate: function(angle) {
            var cos = Math.cos(angle),
                sin = Math.sin(angle),
                x = cos * this.x - sin * this.y,
                y = sin * this.x + cos * this.y;
            this.x = x;
            this.y = y;
            return this;
        },

        _rotateAround: function(angle, p) {
            var cos = Math.cos(angle),
                sin = Math.sin(angle),
                x = p.x + cos * (this.x - p.x) - sin * (this.y - p.y),
                y = p.y + sin * (this.x - p.x) + cos * (this.y - p.y);
            this.x = x;
            this.y = y;
            return this;
        },

        _round: function() {
            this.x = Math.round(this.x);
            this.y = Math.round(this.y);
            return this;
        }
    };

    /**
     * Construct a point from an array if necessary, otherwise if the input
     * is already a Point, or an unknown type, return it unchanged
     * @param {Array<Number>|Point|*} a any kind of input value
     * @return {Point} constructed point, or passed-through value.
     * @example
     * // this
     * var point = Point.convert([0, 1]);
     * // is equivalent to
     * var point = new Point(0, 1);
     */
    Point.convert = function (a) {
        if (a instanceof Point) {
            return a;
        }
        if (Array.isArray(a)) {
            return new Point(a[0], a[1]);
        }
        return a;
    };

    function VectorTileFeature(pbf, end, extent, keys, values) {
        // Public
        this.properties = {};
        this.extent = extent;
        this.type = 0;

        // Private
        this._pbf = pbf;
        this._geometry = -1;
        this._keys = keys;
        this._values = values;

        pbf.readFields(readFeature, this, end);
    }

    function readFeature(tag, feature, pbf) {
        if (tag == 1) feature.id = pbf.readVarint();
        else if (tag == 2) readTag(pbf, feature);
        else if (tag == 3) feature.type = pbf.readVarint();
        else if (tag == 4) feature._geometry = pbf.pos;
    }

    function readTag(pbf, feature) {
        var end = pbf.readVarint() + pbf.pos;

        while (pbf.pos < end) {
            var key = feature._keys[pbf.readVarint()],
                value = feature._values[pbf.readVarint()];
            feature.properties[key] = value;
        }
    }

    VectorTileFeature.types = ['Unknown', 'Point', 'LineString', 'Polygon'];

    VectorTileFeature.prototype.loadGeometry = function() {
        var pbf = this._pbf;
        pbf.pos = this._geometry;

        var end = pbf.readVarint() + pbf.pos,
            cmd = 1,
            length = 0,
            x = 0,
            y = 0,
            lines = [],
            line;

        while (pbf.pos < end) {
            if (length <= 0) {
                var cmdLen = pbf.readVarint();
                cmd = cmdLen & 0x7;
                length = cmdLen >> 3;
            }

            length--;

            if (cmd === 1 || cmd === 2) {
                x += pbf.readSVarint();
                y += pbf.readSVarint();

                if (cmd === 1) { // moveTo
                    if (line) lines.push(line);
                    line = [];
                }

                line.push(new Point(x, y));

            } else if (cmd === 7) {

                // Workaround for https://github.com/mapbox/mapnik-vector-tile/issues/90
                if (line) {
                    line.push(line[0].clone()); // closePolygon
                }

            } else {
                throw new Error('unknown command ' + cmd);
            }
        }

        if (line) lines.push(line);

        return lines;
    };

    VectorTileFeature.prototype.bbox = function() {
        var pbf = this._pbf;
        pbf.pos = this._geometry;

        var end = pbf.readVarint() + pbf.pos,
            cmd = 1,
            length = 0,
            x = 0,
            y = 0,
            x1 = Infinity,
            x2 = -Infinity,
            y1 = Infinity,
            y2 = -Infinity;

        while (pbf.pos < end) {
            if (length <= 0) {
                var cmdLen = pbf.readVarint();
                cmd = cmdLen & 0x7;
                length = cmdLen >> 3;
            }

            length--;

            if (cmd === 1 || cmd === 2) {
                x += pbf.readSVarint();
                y += pbf.readSVarint();
                if (x < x1) x1 = x;
                if (x > x2) x2 = x;
                if (y < y1) y1 = y;
                if (y > y2) y2 = y;

            } else if (cmd !== 7) {
                throw new Error('unknown command ' + cmd);
            }
        }

        return [x1, y1, x2, y2];
    };

    VectorTileFeature.prototype.toGeoJSON = function(x, y, z) {
        var size = this.extent * Math.pow(2, z),
            x0 = this.extent * x,
            y0 = this.extent * y,
            coords = this.loadGeometry(),
            type = VectorTileFeature.types[this.type],
            i, j;

        function project(line) {
            for (var j = 0; j < line.length; j++) {
                var p = line[j], y2 = 180 - (p.y + y0) * 360 / size;
                line[j] = [
                    (p.x + x0) * 360 / size - 180,
                    360 / Math.PI * Math.atan(Math.exp(y2 * Math.PI / 180)) - 90
                ];
            }
        }

        switch (this.type) {
            case 1:
                var points = [];
                for (i = 0; i < coords.length; i++) {
                    points[i] = coords[i][0];
                }
                coords = points;
                project(coords);
                break;

            case 2:
                for (i = 0; i < coords.length; i++) {
                    project(coords[i]);
                }
                break;

            case 3:
                coords = classifyRings$1(coords);
                for (i = 0; i < coords.length; i++) {
                    for (j = 0; j < coords[i].length; j++) {
                        project(coords[i][j]);
                    }
                }
                break;
        }

        if (coords.length === 1) {
            coords = coords[0];
        } else {
            type = 'Multi' + type;
        }

        var result = {
            type: "Feature",
            geometry: {
                type: type,
                coordinates: coords
            },
            properties: this.properties
        };

        if ('id' in this) {
            result.id = this.id;
        }

        return result;
    };

    // classifies an array of rings into polygons with outer rings and holes

    function classifyRings$1(rings) {
        var len = rings.length;

        if (len <= 1) return [rings];

        var polygons = [],
            polygon,
            ccw;

        for (var i = 0; i < len; i++) {
            var area = signedArea(rings[i]);
            if (area === 0) continue;

            if (ccw === undefined) ccw = area < 0;

            if (ccw === area < 0) {
                if (polygon) polygons.push(polygon);
                polygon = [rings[i]];

            } else {
                polygon.push(rings[i]);
            }
        }
        if (polygon) polygons.push(polygon);

        return polygons;
    }

    function signedArea(ring) {
        var sum = 0;
        for (var i = 0, len = ring.length, j = len - 1, p1, p2; i < len; j = i++) {
            p1 = ring[i];
            p2 = ring[j];
            sum += (p2.x - p1.x) * (p1.y + p2.y);
        }
        return sum;
    }

    function VectorTileLayer(pbf, end) {
        // Public
        this.version = 1;
        this.name = null;
        this.extent = 4096;
        this.length = 0;

        // Private
        this._pbf = pbf;
        this._keys = [];
        this._values = [];
        this._features = [];

        pbf.readFields(readLayer, this, end);

        this.length = this._features.length;
    }

    function readLayer(tag, layer, pbf) {
        if (tag === 15) layer.version = pbf.readVarint();
        else if (tag === 1) layer.name = pbf.readString();
        else if (tag === 5) layer.extent = pbf.readVarint();
        else if (tag === 2) layer._features.push(pbf.pos);
        else if (tag === 3) layer._keys.push(pbf.readString());
        else if (tag === 4) layer._values.push(readValueMessage(pbf));
    }

    function readValueMessage(pbf) {
        var value = null,
            end = pbf.readVarint() + pbf.pos;

        while (pbf.pos < end) {
            var tag = pbf.readVarint() >> 3;

            value = tag === 1 ? pbf.readString() :
                tag === 2 ? pbf.readFloat() :
                    tag === 3 ? pbf.readDouble() :
                        tag === 4 ? pbf.readVarint64() :
                            tag === 5 ? pbf.readVarint() :
                                tag === 6 ? pbf.readSVarint() :
                                    tag === 7 ? pbf.readBoolean() : null;
        }

        return value;
    }

    // return feature `i` from this layer as a `VectorTileFeature`
    VectorTileLayer.prototype.feature = function(i) {
        if (i < 0 || i >= this._features.length) throw new Error('feature index out of bounds');

        this._pbf.pos = this._features[i];

        var end = this._pbf.readVarint() + this._pbf.pos;
        return new VectorTileFeature(this._pbf, end, this.extent, this._keys, this._values);
    };

    function VectorTile(pbf, end) {
        this.layers = pbf.readFields(readTile, {}, end);
    }

    function readTile(tag, layers, pbf) {
        if (tag === 3) {
            var layer = new VectorTileLayer(pbf, pbf.readVarint() + pbf.pos);
            if (layer.length) layers[layer.name] = layer;
        }
    }

    var NUM_PARAMS = 3;

    function GridIndex(extent, n, padding) {
        var cells = this.cells = [];

        if (extent instanceof ArrayBuffer) {
            this.arrayBuffer = extent;
            var array = new Int32Array(this.arrayBuffer);
            extent = array[0];
            n = array[1];
            padding = array[2];

            this.d = n + 2 * padding;
            for (var k = 0; k < this.d * this.d; k++) {
                var start = array[NUM_PARAMS + k];
                var end = array[NUM_PARAMS + k + 1];
                cells.push(start === end ?
                        null :
                        array.subarray(start, end));
            }
            var keysOffset = array[NUM_PARAMS + cells.length];
            var bboxesOffset = array[NUM_PARAMS + cells.length + 1];
            this.keys = array.subarray(keysOffset, bboxesOffset);
            this.bboxes = array.subarray(bboxesOffset);

            this.insert = this._insertReadonly;

        } else {
            this.d = n + 2 * padding;
            for (var i = 0; i < this.d * this.d; i++) {
                cells.push([]);
            }
            this.keys = [];
            this.bboxes = [];
        }

        this.n = n;
        this.extent = extent;
        this.padding = padding;
        this.scale = n / extent;
        this.uid = 0;

        var p = (padding / n) * extent;
        this.min = -p;
        this.max = extent + p;
    }


    GridIndex.prototype.insert = function(key, x1, y1, x2, y2) {
        this._forEachCell(x1, y1, x2, y2, this._insertCell, this.uid++);
        this.keys.push(key);
        this.bboxes.push(x1);
        this.bboxes.push(y1);
        this.bboxes.push(x2);
        this.bboxes.push(y2);
    };

    GridIndex.prototype._insertReadonly = function() {
        throw 'Cannot insert into a GridIndex created from an ArrayBuffer.';
    };

    GridIndex.prototype._insertCell = function(x1, y1, x2, y2, cellIndex, uid) {
        this.cells[cellIndex].push(uid);
    };

    GridIndex.prototype.query = function(x1, y1, x2, y2, intersectionTest) {
        var min = this.min;
        var max = this.max;
        if (x1 <= min && y1 <= min && max <= x2 && max <= y2 && !intersectionTest) {
            // We use `Array#slice` because `this.keys` may be a `Int32Array` and
            // some browsers (Safari and IE) do not support `TypedArray#slice`
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/slice#Browser_compatibility
            return Array.prototype.slice.call(this.keys);

        } else {
            var result = [];
            var seenUids = {};
            this._forEachCell(x1, y1, x2, y2, this._queryCell, result, seenUids, intersectionTest);
            return result;
        }
    };

    GridIndex.prototype._queryCell = function(x1, y1, x2, y2, cellIndex, result, seenUids, intersectionTest) {
        var cell = this.cells[cellIndex];
        if (cell !== null) {
            var keys = this.keys;
            var bboxes = this.bboxes;
            for (var u = 0; u < cell.length; u++) {
                var uid = cell[u];
                if (seenUids[uid] === undefined) {
                    var offset = uid * 4;
                    if (intersectionTest ?
                        intersectionTest(bboxes[offset + 0], bboxes[offset + 1], bboxes[offset + 2], bboxes[offset + 3]) :
                        ((x1 <= bboxes[offset + 2]) &&
                        (y1 <= bboxes[offset + 3]) &&
                        (x2 >= bboxes[offset + 0]) &&
                        (y2 >= bboxes[offset + 1]))) {
                        seenUids[uid] = true;
                        result.push(keys[uid]);
                    } else {
                        seenUids[uid] = false;
                    }
                }
            }
        }
    };

    GridIndex.prototype._forEachCell = function(x1, y1, x2, y2, fn, arg1, arg2, intersectionTest) {
        var cx1 = this._convertToCellCoord(x1);
        var cy1 = this._convertToCellCoord(y1);
        var cx2 = this._convertToCellCoord(x2);
        var cy2 = this._convertToCellCoord(y2);
        for (var x = cx1; x <= cx2; x++) {
            for (var y = cy1; y <= cy2; y++) {
                var cellIndex = this.d * y + x;
                if (intersectionTest && !intersectionTest(
                            this._convertFromCellCoord(x),
                            this._convertFromCellCoord(y),
                            this._convertFromCellCoord(x + 1),
                            this._convertFromCellCoord(y + 1))) { continue; }
                if (fn.call(this, x1, y1, x2, y2, cellIndex, arg1, arg2, intersectionTest)) { return; }
            }
        }
    };

    GridIndex.prototype._convertFromCellCoord = function(x) {
        return (x - this.padding) / this.scale;
    };

    GridIndex.prototype._convertToCellCoord = function(x) {
        return Math.max(0, Math.min(this.d - 1, Math.floor(x * this.scale) + this.padding));
    };

    GridIndex.prototype.toArrayBuffer = function() {
        if (this.arrayBuffer) { return this.arrayBuffer; }

        var cells = this.cells;

        var metadataLength = NUM_PARAMS + this.cells.length + 1 + 1;
        var totalCellLength = 0;
        for (var i = 0; i < this.cells.length; i++) {
            totalCellLength += this.cells[i].length;
        }

        var array = new Int32Array(metadataLength + totalCellLength + this.keys.length + this.bboxes.length);
        array[0] = this.extent;
        array[1] = this.n;
        array[2] = this.padding;

        var offset = metadataLength;
        for (var k = 0; k < cells.length; k++) {
            var cell = cells[k];
            array[NUM_PARAMS + k] = offset;
            array.set(cell, offset);
            offset += cell.length;
        }

        array[NUM_PARAMS + cells.length] = offset;
        array.set(this.keys, offset);
        offset += this.keys.length;

        array[NUM_PARAMS + cells.length + 1] = offset;
        array.set(this.bboxes, offset);
        offset += this.bboxes.length;

        return array.buffer;
    };

    WebWorkerTransfer.register('GridIndex', GridIndex, {omit: ['layers', 'patternFeatures']});

    /**
     * @module util
     * @private
     */
    function Util() {
    }

    /**
     * Given a value `t` that varies between 0 and 1, return
     * an interpolation function that eases between 0 and 1 in a pleasing
     * cubic in-out fashion.
     *
     * @private
     */
    Util.easeCubicInOut = function (t) {
        if (t <= 0) {
            return 0;
        }
        if (t >= 1) {
            return 1;
        }
        var t2 = t * t,
            t3 = t2 * t;
        return 4 * (t < 0.5 ? t3 : 3 * (t - t2) + t3 - 0.75);
    };

    /*
     * Call an asynchronous function on an array of arguments,
     * calling `callback` with the completed results of all calls.
     *
     * @param array input to each call of the async function.
     * @param fn an async function with signature (data, callback)
     * @param callback a callback run after all async work is done.
     * called with an array, containing the results of each async call.
     * @private
     */
    Util.asyncAll = function (array, fn, callback) {
        if (!array.length) {
            return callback(null, []);
        }
        var remaining = array.length;
        var results = new Array(array.length);
        var error = null;
        array.forEach(function (item, i) {
            fn(item, function (err, result) {
                if (err) {
                    error = err;
                }
                results[i] = ((result     )        ); // https://github.com/facebook/flow/issues/2123
                if (--remaining === 0) {
                    callback(error, results);
                }
            });
        });
    };

    /**
     * Given a destination object and optionally many source objects,
     * copy all properties from the source objects into the destination.
     * The last source object given overrides properties from previous
     * source objects.
     *
     * @param dest destination object
     * @param sources sources from which properties are pulled
     * @private
     */
    Util.extend = function (dest) {
        var sources = [], len = arguments.length - 1;
        while (len-- > 0) sources[ len ] = arguments[ len + 1 ];

        for (var i = 0, list = sources; i < list.length; i += 1) {
            var src = list[i];

            for (var k in src) {
                dest[k] = src[k];
            }
        }
        return dest;
    };

    var id = 1;

    /**
     * Return a unique numeric id, starting at 1 and incrementing with
     * each call.
     *
     * @returns unique numeric id.
     * @private
     */
    Util.uniqueId = function () {
        return id++;
    };

    /**
     * Return a random UUID (v4). Taken from: https://gist.github.com/jed/982883
     * @private
     */
    Util.uuid = function () {
        function b(a) {
            return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) :
                //$FlowFixMe: Flow doesn't like the implied array literal conversion here
                ([1e7] + -[1e3] + -4e3 + -8e3 + -1e11).replace(/[018]/g, b);
        }

        return b();
    };

    /**
     * Validate a string to match UUID(v4) of the
     * form: xxxxxxxx-xxxx-4xxx-[89ab]xxx-xxxxxxxxxxxx
     * @param str string to validate.
     * @private
     */
    Util.validateUuid = function (str) {
        return str ? /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str) : false;
    };

    /**
     * Given an array of member function names as strings, replace all of them
     * with bound versions that will always refer to `context` as `this`. This
     * is useful for classes where otherwise event bindings would reassign
     * `this` to the evented object or some other value: this lets you ensure
     * the `this` value always.
     *
     * @param fns list of member function names
     * @param context the context value
     * @example
     * function MyClass() {
    *   bindAll(['ontimer'], this);
    *   this.name = 'Tom';
    * }
     * MyClass.prototype.ontimer = function() {
    *   alert(this.name);
    * };
     * var myClass = new MyClass();
     * setTimeout(myClass.ontimer, 100);
     * @private
     */
    Util.bindAll = function (fns, context) {
        fns.forEach(function (fn) {
            if (!context[fn]) {
                return;
            }
            context[fn] = context[fn].bind(context);
        });
    };

    /**
     * Determine if a string ends with a particular substring
     *
     * @private
     */
    Util.endsWith = function (string, suffix) {
        return string.indexOf(suffix, string.length - suffix.length) !== -1;
    };

    /**
     * Create an object by mapping all the values of an existing object while
     * preserving their keys.
     *
     * @private
     */
    Util.mapObject = function (input, iterator, context) {
        var output = {};
        for (var key in input) {
            output[key] = iterator.call(context || this, input[key], key, input);
        }
        return output;
    };

    /**
     * Create an object by filtering out values of an existing object.
     *
     * @private
     */
    Util.filterObject = function (input, iterator, context) {
        var output = {};
        for (var key in input) {
            if (iterator.call(context || this, input[key], key, input)) {
                output[key] = input[key];
            }
        }
        return output;
    };

    /**
     * Deeply clones two objects.
     *
     * @private
     */
    Util.clone = function (input) {
        if (Array.isArray(input)) {
            return input.map(Util.clone);
        } else if (typeof input === 'object' && input) {
            return ((Util.mapObject(input, Util.clone)     )   );
        } else {
            return input;
        }
    };

    Util.deepEqual = function (a, b) {
        if (Array.isArray(a)) {
            if (!Array.isArray(b) || a.length !== b.length) {
                return false;
            }
            for (var i = 0; i < a.length; i++) {
                if (!Util.deepEqual(a[i], b[i])) {
                    return false;
                }
            }
            return true;
        }
        if (typeof a === 'object' && a !== null && b !== null) {
            if (!(typeof b === 'object')) {
                return false;
            }
            var keys = Object.keys(a);
            if (keys.length !== Object.keys(b).length) {
                return false;
            }
            for (var key in a) {
                if (!Util.deepEqual(a[key], b[key])) {
                    return false;
                }
            }
            return true;
        }
        return a === b;
    };

    /**
     * Check if two arrays have at least one common element.
     *
     * @private
     */
    Util.arraysIntersect = function (a, b) {
        for (var l = 0; l < a.length; l++) {
            if (b.indexOf(a[l]) >= 0) {
                return true;
            }
        }
        return false;
    };

    /**
     * Indicates if the provided Points are in a counter clockwise (true) or clockwise (false) order
     *
     * @private
     * @returns true for a counter clockwise set of points
     */
    // http://bryceboe.com/2006/10/23/line-segment-intersection-algorithm/
    Util.isCounterClockwise = function (a, b, c) {
        return (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x);
    };

    /* global self, WorkerGlobalScope */
    /**
     *  Retuns true if the when run in the web-worker context.
     *
     * @private
     * @returns {boolean}
     */
    Util.isWorker = function () {
        return typeof WorkerGlobalScope !== 'undefined' && typeof self !== 'undefined' &&
            self instanceof WorkerGlobalScope;
    };

    var _isSafari = null;

    /**
     * Returns true when run in WebKit derived browsers.
     * This is used as a workaround for a memory leak in Safari caused by using Transferable objects to
     * transfer data between WebWorkers and the main thread.
     * https://github.com/mapbox/mapbox-gl-js/issues/8771
     *
     * This should be removed once the underlying Safari issue is fixed.
     *
     * @private
     * @param scope {WindowOrWorkerGlobalScope} Since this function is used both on the main thread and WebWorker context,
     *      let the calling scope pass in the global scope object.
     * @returns {boolean}
     */
    Util.isSafari = function (scope) {
        if (_isSafari == null) {
            var userAgent = scope.navigator ? scope.navigator.userAgent : null;
            _isSafari = !!scope.safari || !!(userAgent && (/\b(iPad|iPhone|iPod)\b/.test(userAgent) || (!!userAgent.match('Safari') && !userAgent.match('Chrome'))));
        }
        return _isSafari;
    };

    /**
     * Replace tokens in a string template with values in an object
     *
     * @param properties a key/value relationship between tokens and replacements
     * @param text the template string
     * @returns the template with tokens replaced
     * @private
     */
    Util.resolveTokens = function (properties, text) {
        return text.replace(/{([^{}]+)}/g, function (match, key) {
            return key in properties ? String(properties[key]) : '';
        });
    };

    /**
     * Tracks `let` bindings during expression parsing.
     * @private
     */
    var Scope = function Scope(parent, bindings) {
        if (bindings === void 0) bindings = [];

        this.parent = parent;
        this.bindings = {};
        for (var i = 0, list = bindings; i < list.length; i += 1) {
            var ref = list[i];
            var name = ref[0];
            var expression = ref[1];

            this.bindings[name] = expression;
        }
    };

    Scope.prototype.concat = function concat(bindings) {
        return new Scope(this, bindings);
    };

    Scope.prototype.get = function get(name) {
        if (this.bindings[name]) {
            return this.bindings[name];
        }
        if (this.parent) {
            return this.parent.get(name);
        }
        throw new Error((name + " not found in scope."));
    };

    Scope.prototype.has = function has(name) {
        if (this.bindings[name]) {
            return true;
        }
        return this.parent ? this.parent.has(name) : false;
    };

    var ParsingError = /*@__PURE__*/(function (Error) {
        function ParsingError(key        , message        ) {
            Error.call(this, message);
            this.message = message;
            this.key = key;
        }

        if ( Error ) ParsingError.__proto__ = Error;
        ParsingError.prototype = Object.create( Error && Error.prototype );
        ParsingError.prototype.constructor = ParsingError;

        return ParsingError;
    }(Error));

    var geometryTypes = ['Unknown', 'Point', 'LineString', 'Polygon'];

    var EvaluationContext = function EvaluationContext() {
        this.globals = (null );
        this.feature = null;
        this.featureState = null;
        this.formattedSection = null;
        this._parseColorCache = {};
        this.availableImages = null;
    };

    EvaluationContext.prototype.id = function id () {
        return this.feature && 'id' in this.feature ? this.feature.id : null;
    };

    EvaluationContext.prototype.geometryType = function geometryType () {
        return this.feature ? typeof this.feature.type === 'number' ? geometryTypes[this.feature.type] : this.feature.type : null;
    };

    EvaluationContext.prototype.properties = function properties () {
        return this.feature && this.feature.properties || {};
    };

    EvaluationContext.prototype.parseColor = function parseColor (input    )     {
        var cached = this._parseColorCache[input];
        if (!cached) {
            cached = this._parseColorCache[input] = Color.parse(input);
        }
        return cached;
    };

    function isConstant() {
    }

    isConstant.isFeatureConstant = function(e){
        if (e instanceof CompoundExpression) {
            if (e.name === 'get' && e.args.length === 1) {
                return false;
            } else if (e.name === 'feature-state') {
                return false;
            } else if (e.name === 'has' && e.args.length === 1) {
                return false;
            } else if (
                e.name === 'properties' ||
                    e.name === 'geometry-type' ||
                    e.name === 'id'
                ) {
                return false;
            } else if (/^filter-/.test(e.name)) {
                return false;
            }
        }

        var result = true;
        e.eachChild(function (arg) {
            if (result && !isConstant.isFeatureConstant(arg)) {
                result = false;
            }
        });
        return result;
    };

    isConstant.isStateConstant = function(e){
        if (e instanceof CompoundExpression) {
            if (e.name === 'feature-state') {
                return false;
            }
        }
        var result = true;
        e.eachChild(function (arg) {
            if (result && !isConstant.isStateConstant(arg)) {
                result = false;
            }
        });
        return result;
    };

    isConstant.isGlobalPropertyConstant = function(e, properties){
        if (e instanceof CompoundExpression && properties.indexOf(e.name) >= 0) {
            return false;
        }
        var result = true;
        e.eachChild(function (arg) {
            if (result && !isConstant.isGlobalPropertyConstant(arg, properties)) {
                result = false;
            }
        });
        return result;
    };

    /**
     * State associated parsing at a given point in an expression tree.
     * @private
     */
    var ParsingContext = function ParsingContext(registry, path, expectedType, scope, errors) {
        if (path === void 0) path = [];
        if (scope === void 0) scope = new Scope();
        if (errors === void 0) errors = [];

        this.registry = registry;
        this.path = path;
        this.key = path.map(function (part) {
            return ("[" + part + "]");
        }).join('');
        this.scope = scope;
        this.errors = errors;
        this.expectedType = expectedType;
    };

    /**
     * @param expr the JSON expression to parse
     * @param index the optional argument index if this expression is an argument of a parent expression that's being parsed
     * @param options
     * @param options.omitTypeAnnotations set true to omit inferred type annotations.  Caller beware: with this option set, the parsed expression's type will NOT satisfy `expectedType` if it would normally be wrapped in an inferred annotation.
     * @private
     */
    ParsingContext.prototype.parse = function parse(expr, index, expectedType, bindings, options) {
        if (options === void 0) options = {};

        if (index) {
            return this.concat(index, expectedType, bindings)._parse(expr, options);
        }
        return this._parse(expr, options);
    };

    ParsingContext.prototype._parse = function _parse(expr, options) {
        if (expr === null || typeof expr === 'string' || typeof expr === 'boolean' || typeof expr === 'number') {
            expr = ['literal', expr];
        }

        function annotate(parsed, type, typeAnnotation) {
            if (typeAnnotation === 'assert') {
                return new Assertion(type, [parsed]);
            } else if (typeAnnotation === 'coerce') {
                return new Coercion(type, [parsed]);
            } else {
                return parsed;
            }
        }

        if (Array.isArray(expr)) {
            if (expr.length === 0) {
                return this.error("Expected an array with at least one element. If you wanted a literal array, use [\"literal\", []].");
            }

            var op = expr[0];
            if (typeof op !== 'string') {
                this.error(("Expression name must be a string, but found " + (typeof op) + " instead. If you wanted a literal array, use [\"literal\", [...]]."), 0);
                return null;
            }

            var Expr = this.registry[op];
            if (Expr) {
                var parsed = Expr.parse(expr, this);
                if (!parsed) {
                    return null;
                }

                if (this.expectedType) {
                    var expected = this.expectedType;
                    var actual = parsed.type;

                    // When we expect a number, string, boolean, or array but have a value, wrap it in an assertion.
                    // When we expect a color or formatted string, but have a string or value, wrap it in a coercion.
                    // Otherwise, we do static type-checking.
                    //
                    // These behaviors are overridable for:
                    //   * The "coalesce" operator, which needs to omit type annotations.
                    //   * String-valued properties (e.g. `text-field`), where coercion is more convenient than assertion.
                    //
                    if ((expected.kind === 'string' || expected.kind === 'number' || expected.kind === 'boolean' || expected.kind === 'object' || expected.kind === 'array') && actual.kind === 'value') {
                        parsed = annotate(parsed, expected, options.typeAnnotation || 'assert');
                    } else if ((expected.kind === 'color' || expected.kind === 'formatted' || expected.kind === 'resolvedImage') && (actual.kind === 'value' || actual.kind === 'string')) {
                        parsed = annotate(parsed, expected, options.typeAnnotation || 'coerce');
                    } else if (this.checkSubtype(expected, actual)) {
                        return null;
                    }
                }

                // If an expression's arguments are all literals, we can evaluate
                // it immediately and replace it with a literal value in the
                // parsed/compiled result. Expressions that expect an image should
                // not be resolved here so we can later get the available images.
                if (!(parsed instanceof Literal) && (parsed.type.kind !== 'resolvedImage') && isConstant()) {
                    var ec = new EvaluationContext();
                    try {
                        parsed = new Literal(parsed.type, parsed.evaluate(ec));
                    } catch (e) {
                        this.error(e.message);
                        return null;
                    }
                }

                return parsed;
            }

            return this.error(("Unknown expression \"" + op + "\". If you wanted a literal array, use [\"literal\", [...]]."), 0);
        } else if (typeof expr === 'undefined') {
            return this.error("'undefined' value invalid. Use null instead.");
        } else if (typeof expr === 'object') {
            return this.error("Bare objects invalid. Use [\"literal\", {...}] instead.");
        } else {
            return this.error(("Expected an array, but found " + (typeof expr) + " instead."));
        }
    };

    /**
     * Returns a copy of this context suitable for parsing the subexpression at
     * index `index`, optionally appending to 'let' binding map.
     *
     * Note that `errors` property, intended for collecting errors while
     * parsing, is copied by reference rather than cloned.
     * @private
     */
    ParsingContext.prototype.concat = function concat(index, expectedType, bindings) {
        var path = typeof index === 'number' ? this.path.concat(index) : this.path;
        var scope = bindings ? this.scope.concat(bindings) : this.scope;
        return new ParsingContext(
            this.registry,
            path,
            expectedType || null,
            scope,
            this.errors
        );
    };

    /**
     * Push a parsing (or type checking) error into the `this.errors`
     * @param error The message
     * @param keys Optionally specify the source of the error at a child
     * of the current expression at `this.key`.
     * @private
     */
    ParsingContext.prototype.error = function error(error$1) {
        var keys = [], len = arguments.length - 1;
        while (len-- > 0) keys[ len ] = arguments[ len + 1 ];

        var key = "" + (this.key) + (keys.map(function (k) {
            return ("[" + k + "]");
        }).join(''));
        this.errors.push(new ParsingError(key, error$1));
    };

    /**
     * Returns null if `t` is a subtype of `expected`; otherwise returns an
     * error message and also pushes it to `this.errors`.
     */
    ParsingContext.prototype.checkSubtype = function checkSubtype$1(expected, t) {
        var error = checkSubtype(expected, t);
        if (error) {
            this.error(error);
        }
        return error;
    };

    function get(key, obj) {
        const v = obj[key];
        return typeof v === 'undefined' ? null : v;
    }

    var CompoundExpression$1 = function CompoundExpression(name, type, evaluate, args) {
        this.name = name;
        this.type = type;
        this._evaluate = evaluate;
        this.args = args;
    };

    CompoundExpression$1.prototype.evaluate = function evaluate(ctx) {
        return this._evaluate(ctx, this.args);
    };

    CompoundExpression$1.prototype.eachChild = function eachChild(fn) {
        this.args.forEach(fn);
    };

    CompoundExpression$1.prototype.possibleOutputs = function possibleOutputs() {
        return [undefined];
    };

    CompoundExpression$1.prototype.serialize = function serialize() {
        return [this.name].concat(this.args.map(function (arg) {
            return arg.serialize();
        }));
    };

    CompoundExpression$1.parse = function parse(args, context) {
        var ref$1;

        var op = (args[0] );
        var definition = CompoundExpression$1.definitions[op];
        if (!definition) {
            return context.error(("Unknown expression \"" + op + "\". If you wanted a literal array, use [\"literal\", [...]]."), 0);
        }

        // Now check argument types against each signature
        var type = Array.isArray(definition) ?
            definition[0] : definition.type;

        var availableOverloads = Array.isArray(definition) ?
            [
                [definition[1], definition[2]]
            ] :
            definition.overloads;

        var overloads = availableOverloads.filter(function (ref) {
            var signature = ref[0];

            return (
                !Array.isArray(signature) || // varags
                    signature.length === args.length - 1 // correct param count
                );
        });

        var signatureContext = (null );

        for (var i$3 = 0, list = overloads; i$3 < list.length; i$3 += 1) {
            // Use a fresh context for each attempted signature so that, if
            // we eventually succeed, we haven't polluted `context.errors`.
            var ref = list[i$3];
            var params = ref[0];
            var evaluate = ref[1];

            signatureContext = new ParsingContext(context.registry, context.path, null, context.scope);

            // First parse all the args, potentially coercing to the
            // types expected by this overload.
            var parsedArgs = [];
            var argParseFailed = false;
            for (var i = 1; i < args.length; i++) {
                var arg = args[i];
                var expectedType = Array.isArray(params) ?
                    params[i - 1] :
                    params.type;

                var parsed = signatureContext.parse(arg, 1 + parsedArgs.length, expectedType);
                if (!parsed) {
                    argParseFailed = true;
                    break;
                }
                parsedArgs.push(parsed);
            }
            if (argParseFailed) {
                // Couldn't coerce args of this overload to expected type, move
                // on to next one.
                continue;
            }

            if (Array.isArray(params)) {
                if (params.length !== parsedArgs.length) {
                    signatureContext.error(("Expected " + (params.length) + " arguments, but found " + (parsedArgs.length) + " instead."));
                    continue;
                }
            }

            for (var i$1 = 0; i$1 < parsedArgs.length; i$1++) {
                var expected = Array.isArray(params) ? params[i$1] : params.type;
                var arg$1 = parsedArgs[i$1];
                signatureContext.concat(i$1 + 1).checkSubtype(expected, arg$1.type);
            }

            if (signatureContext.errors.length === 0) {
                return new CompoundExpression$1(op, type, evaluate, parsedArgs);
            }
        }

        //assert_1(!signatureContext || signatureContext.errors.length > 0);

        if (overloads.length === 1) {
            (ref$1 = context.errors).push.apply(ref$1, signatureContext.errors);
        } else {
            var expected$1 = overloads.length ? overloads : availableOverloads;
            var signatures = expected$1
                .map(function (ref) {
                    var params = ref[0];

                    return stringifySignature(params);
                })
                .join(' | ');

            var actualTypes = [];
            // For error message, re-parse arguments without trying to
            // apply any coercions
            for (var i$2 = 1; i$2 < args.length; i$2++) {
                var parsed$1 = context.parse(args[i$2], 1 + actualTypes.length);
                if (!parsed$1) {
                    return null;
                }
                actualTypes.push(toString(parsed$1.type));
            }
            context.error(("Expected arguments of type " + signatures + ", but found (" + (actualTypes.join(', ')) + ") instead."));
        }

        return null;
    };

    CompoundExpression$1.register = function register(registry, definitions) {
        //assert_1(!CompoundExpression.definitions);
        CompoundExpression$1.definitions = definitions;
        for (var name in definitions) {
            registry[name] = CompoundExpression$1;
        }
    };

    function stringifySignature(signature) {
        if (Array.isArray(signature)) {
            return ("(" + (signature.map(toString).join(', ')) + ")");
        } else {
            return ("(" + (toString(signature.type)) + "...)");
        }
    }
    var NumberType$a = {kind: 'number'};
    var StringType$8 = {kind: 'string'};
    var BooleanType$8 = {kind: 'boolean'};
    var ColorType$5 = {kind: 'color'};
    var ObjectType$3 = {kind: 'object'};
    var ValueType$a = {kind: 'value'};
    var ErrorType = {kind: 'error'};
    var CollatorType$3 = {kind: 'collator'};

    function array$5(itemType, N) {
        return {
            kind: 'array',
            itemType: itemType,
            N: N
        };
    }

    function varargs(type) {
        return {type: type};
    }

    function rgba(ctx, ref) {
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        var a = ref[3];

        r = r.evaluate(ctx);
        g = g.evaluate(ctx);
        b = b.evaluate(ctx);
        var alpha = a ? a.evaluate(ctx) : 1;
        var error = Values.validateRGBA(r, g, b, alpha);
        if (error) {
            throw new RuntimeError(error);
        }
        return new Color(r / 255 * alpha, g / 255 * alpha, b / 255 * alpha, alpha);
    }

    CompoundExpression$1.register(expressions, {
        'error': [
            ErrorType,
            [StringType$8],
            function (ctx, ref) {
                var v = ref[0];
                throw new RuntimeError(v.evaluate(ctx));
            }
        ],
        'typeof': [
            StringType$8,
            [ValueType$a],
            function (ctx, ref) {
                var v = ref[0];

                return toString(Values.typeOf(v.evaluate(ctx)));
            }
        ],
        'to-rgba': [
            array$5(NumberType$a, 4),
            [ColorType$5],
            function (ctx, ref) {
                var v = ref[0];

                return v.evaluate(ctx).toArray();
            }
        ],
        'rgb': [
            ColorType$5,
            [NumberType$a, NumberType$a, NumberType$a],
            rgba
        ],
        'rgba': [
            ColorType$5,
            [NumberType$a, NumberType$a, NumberType$a, NumberType$a],
            rgba
        ],
        'has': {
            type: BooleanType$8,
            overloads: [
                [
                    [StringType$8],
                    function (ctx, ref) {
                        var key = ref[0];

                        return has(key.evaluate(ctx), ctx.properties());
                    }
                ],
                [
                    [StringType$8, ObjectType$3],
                    function (ctx, ref) {
                        var key = ref[0];
                        var obj = ref[1];

                        return has(key.evaluate(ctx), obj.evaluate(ctx));
                    }
                ]
            ]
        },
        'get': {
            type: ValueType$a,
            overloads: [
                [
                    [StringType$8],
                    function (ctx, ref) {
                        var key = ref[0];

                        return get(key.evaluate(ctx), ctx.properties());
                    }
                ],
                [
                    [StringType$8, ObjectType$3],
                    function (ctx, ref) {
                        var key = ref[0];
                        var obj = ref[1];

                        return get(key.evaluate(ctx), obj.evaluate(ctx));
                    }
                ]
            ]
        },
        'feature-state': [
            ValueType$a,
            [StringType$8],
            function (ctx, ref) {
                var key = ref[0];

                return get(key.evaluate(ctx), ctx.featureState || {});
            }
        ],
        'properties': [
            ObjectType$3,
            [],
            function (ctx) {
                return ctx.properties();
            }
        ],
        'geometry-type': [
            StringType$8,
            [],
            function (ctx) {
                return ctx.geometryType();
            }
        ],
        'id': [
            ValueType$a,
            [],
            function (ctx) {
                return ctx.id();
            }
        ],
        'zoom': [
            NumberType$a,
            [],
            function (ctx) {
                return ctx.globals.zoom;
            }
        ],
        'heatmap-density': [
            NumberType$a,
            [],
            function (ctx) {
                return ctx.globals.heatmapDensity || 0;
            }
        ],
        'line-progress': [
            NumberType$a,
            [],
            function (ctx) {
                return ctx.globals.lineProgress || 0;
            }
        ],
        'accumulated': [
            ValueType$a,
            [],
            function (ctx) {
                return ctx.globals.accumulated === undefined ? null : ctx.globals.accumulated;
            }
        ],
        '+': [
            NumberType$a,
            varargs(NumberType$a),
            function (ctx, args) {
                var result = 0;
                for (var i = 0, list = args; i < list.length; i += 1) {
                    var arg = list[i];

                    result += arg.evaluate(ctx);
                }
                return result;
            }
        ],
        '*': [
            NumberType$a,
            varargs(NumberType$a),
            function (ctx, args) {
                var result = 1;
                for (var i = 0, list = args; i < list.length; i += 1) {
                    var arg = list[i];

                    result *= arg.evaluate(ctx);
                }
                return result;
            }
        ],
        '-': {
            type: NumberType$a,
            overloads: [
                [
                    [NumberType$a, NumberType$a],
                    function (ctx, ref) {
                        var a = ref[0];
                        var b = ref[1];

                        return a.evaluate(ctx) - b.evaluate(ctx);
                    }
                ],
                [
                    [NumberType$a],
                    function (ctx, ref) {
                        var a = ref[0];

                        return -a.evaluate(ctx);
                    }
                ]
            ]
        },
        '/': [
            NumberType$a,
            [NumberType$a, NumberType$a],
            function (ctx, ref) {
                var a = ref[0];
                var b = ref[1];

                return a.evaluate(ctx) / b.evaluate(ctx);
            }
        ],
        '%': [
            NumberType$a,
            [NumberType$a, NumberType$a],
            function (ctx, ref) {
                var a = ref[0];
                var b = ref[1];

                return a.evaluate(ctx) % b.evaluate(ctx);
            }
        ],
        'ln2': [
            NumberType$a,
            [],
            function () {
                return Math.LN2;
            }
        ],
        'pi': [
            NumberType$a,
            [],
            function () {
                return Math.PI;
            }
        ],
        'e': [
            NumberType$a,
            [],
            function () {
                return Math.E;
            }
        ],
        '^': [
            NumberType$a,
            [NumberType$a, NumberType$a],
            function (ctx, ref) {
                var b = ref[0];
                var e = ref[1];

                return Math.pow(b.evaluate(ctx), e.evaluate(ctx));
            }
        ],
        'sqrt': [
            NumberType$a,
            [NumberType$a],
            function (ctx, ref) {
                var x = ref[0];

                return Math.sqrt(x.evaluate(ctx));
            }
        ],
        'log10': [
            NumberType$a,
            [NumberType$a],
            function (ctx, ref) {
                var n = ref[0];

                return Math.log(n.evaluate(ctx)) / Math.LN10;
            }
        ],
        'ln': [
            NumberType$a,
            [NumberType$a],
            function (ctx, ref) {
                var n = ref[0];

                return Math.log(n.evaluate(ctx));
            }
        ],
        'log2': [
            NumberType$a,
            [NumberType$a],
            function (ctx, ref) {
                var n = ref[0];

                return Math.log(n.evaluate(ctx)) / Math.LN2;
            }
        ],
        'sin': [
            NumberType$a,
            [NumberType$a],
            function (ctx, ref) {
                var n = ref[0];

                return Math.sin(n.evaluate(ctx));
            }
        ],
        'cos': [
            NumberType$a,
            [NumberType$a],
            function (ctx, ref) {
                var n = ref[0];

                return Math.cos(n.evaluate(ctx));
            }
        ],
        'tan': [
            NumberType$a,
            [NumberType$a],
            function (ctx, ref) {
                var n = ref[0];

                return Math.tan(n.evaluate(ctx));
            }
        ],
        'asin': [
            NumberType$a,
            [NumberType$a],
            function (ctx, ref) {
                var n = ref[0];

                return Math.asin(n.evaluate(ctx));
            }
        ],
        'acos': [
            NumberType$a,
            [NumberType$a],
            function (ctx, ref) {
                var n = ref[0];

                return Math.acos(n.evaluate(ctx));
            }
        ],
        'atan': [
            NumberType$a,
            [NumberType$a],
            function (ctx, ref) {
                var n = ref[0];

                return Math.atan(n.evaluate(ctx));
            }
        ],
        'min': [
            NumberType$a,
            varargs(NumberType$a),
            function (ctx, args) {
                return Math.min.apply(Math, args.map(function (arg) {
                    return arg.evaluate(ctx);
                }));
            }
        ],
        'max': [
            NumberType$a,
            varargs(NumberType$a),
            function (ctx, args) {
                return Math.max.apply(Math, args.map(function (arg) {
                    return arg.evaluate(ctx);
                }));
            }
        ],
        'abs': [
            NumberType$a,
            [NumberType$a],
            function (ctx, ref) {
                var n = ref[0];

                return Math.abs(n.evaluate(ctx));
            }
        ],
        'round': [
            NumberType$a,
            [NumberType$a],
            function (ctx, ref) {
                var n = ref[0];

                var v = n.evaluate(ctx);
                // Javascript's Math.round() rounds towards +Infinity for halfway
                // values, even when they're negative. It's more common to round
                // away from 0 (e.g., this is what python and C++ do)
                return v < 0 ? -Math.round(-v) : Math.round(v);
            }
        ],
        'floor': [
            NumberType$a,
            [NumberType$a],
            function (ctx, ref) {
                var n = ref[0];

                return Math.floor(n.evaluate(ctx));
            }
        ],
        'ceil': [
            NumberType$a,
            [NumberType$a],
            function (ctx, ref) {
                var n = ref[0];

                return Math.ceil(n.evaluate(ctx));
            }
        ],
        'filter-==': [
            BooleanType$8,
            [StringType$8, ValueType$a],
            function (ctx, ref) {
                var k = ref[0];
                var v = ref[1];

                return ctx.properties()[(k     ).value] === (v     ).value;
            }
        ],
        'filter-id-==': [
            BooleanType$8,
            [ValueType$a],
            function (ctx, ref) {
                var v = ref[0];

                return ctx.id() === (v     ).value;
            }
        ],
        'filter-like': [
            BooleanType$8,
            [StringType$8, StringType$8],
            function (ctx, ref) {
                var a = ref[0].value;
                var b = ref[1].value;
                var properties = ctx.properties();
                if(!(a in properties)) {
                    return false;
                }
                if(/^%.*[^%]$/.test(b)) { // 以百分号开头并且不以百分号结尾
                    b = b.replace("%", "");
                    return properties[a].endsWith(b);
                } else if(/^(?!%).+%$/.test(b)) { // 以百分号结尾并且不以百分号开头
                    b = b.replace("%", "");
                    return properties[a].startsWith(b);
                } else { // 百分号开头百分号结尾 or 不含百分号
                    b = b.replace(/%/g, "");
                    return (properties[a].indexOf(b)) > -1;
                }
            }
        ],
        'filter-type-==': [
            BooleanType$8,
            [StringType$8],
            function (ctx, ref) {
                var v = ref[0];

                return ctx.geometryType() === (v     ).value;
            }
        ],
        'filter-<': [
            BooleanType$8,
            [StringType$8, ValueType$a],
            function (ctx, ref) {
                var k = ref[0];
                var v = ref[1];

                var a = ctx.properties()[(k     ).value];
                var b = (v     ).value;
                return typeof a === typeof b && a < b;
            }
        ],
        'filter-id-<': [
            BooleanType$8,
            [ValueType$a],
            function (ctx, ref) {
                var v = ref[0];

                var a = ctx.id();
                var b = (v     ).value;
                return typeof a === typeof b && a < b;
            }
        ],
        'filter->': [
            BooleanType$8,
            [StringType$8, ValueType$a],
            function (ctx, ref) {
                var k = ref[0];
                var v = ref[1];

                var a = ctx.properties()[(k     ).value];
                var b = (v     ).value;
                return typeof a === typeof b && a > b;
            }
        ],
        'filter-id->': [
            BooleanType$8,
            [ValueType$a],
            function (ctx, ref) {
                var v = ref[0];

                var a = ctx.id();
                var b = (v     ).value;
                return typeof a === typeof b && a > b;
            }
        ],
        'filter-<=': [
            BooleanType$8,
            [StringType$8, ValueType$a],
            function (ctx, ref) {
                var k = ref[0];
                var v = ref[1];

                var a = ctx.properties()[(k     ).value];
                var b = (v     ).value;
                return typeof a === typeof b && a <= b;
            }
        ],
        'filter-id-<=': [
            BooleanType$8,
            [ValueType$a],
            function (ctx, ref) {
                var v = ref[0];

                var a = ctx.id();
                var b = (v     ).value;
                return typeof a === typeof b && a <= b;
            }
        ],
        'filter->=': [
            BooleanType$8,
            [StringType$8, ValueType$a],
            function (ctx, ref) {
                var k = ref[0];
                var v = ref[1];

                var a = ctx.properties()[(k     ).value];
                var b = (v     ).value;
                return typeof a === typeof b && a >= b;
            }
        ],
        'filter-id->=': [
            BooleanType$8,
            [ValueType$a],
            function (ctx, ref) {
                var v = ref[0];

                var a = ctx.id();
                var b = (v     ).value;
                return typeof a === typeof b && a >= b;
            }
        ],
        'filter-has': [
            BooleanType$8,
            [ValueType$a],
            function (ctx, ref) {
                var k = ref[0];

                return (k     ).value in ctx.properties();
            }
        ],
        'filter-has-id': [
            BooleanType$8,
            [],
            function (ctx) {
                return ctx.id() !== null;
            }
        ],
        'filter-type-in': [
            BooleanType$8,
            [array$5(StringType$8)],
            function (ctx, ref) {
                var v = ref[0];

                return (v     ).value.indexOf(ctx.geometryType()) >= 0;
            }
        ],
        'filter-id-in': [
            BooleanType$8,
            [array$5(ValueType$a)],
            function (ctx, ref) {
                var v = ref[0];

                return (v     ).value.indexOf(ctx.id()) >= 0;
            }
        ],
        'filter-in-small': [
            BooleanType$8,
            [StringType$8, array$5(ValueType$a)],
            // assumes v is an array literal
            function (ctx, ref) {
                var k = ref[0];
                var v = ref[1];

                return (v     ).value.indexOf(ctx.properties()[(k     ).value]) >= 0;
            }
        ],
        'filter-in-large': [
            BooleanType$8,
            [StringType$8, array$5(ValueType$a)],
            // assumes v is a array literal with values sorted in ascending order and of a single type
            function (ctx, ref) {
                var k = ref[0];
                var v = ref[1];

                return binarySearch(ctx.properties()[(k     ).value], (v     ).value, 0, (v     ).value.length - 1);
            }
        ],
        'all': {
            type: BooleanType$8,
            overloads: [
                [
                    [BooleanType$8, BooleanType$8],
                    function (ctx, ref) {
                        var a = ref[0];
                        var b = ref[1];

                        return a.evaluate(ctx) && b.evaluate(ctx);
                    }
                ],
                [
                    varargs(BooleanType$8),
                    function (ctx, args) {
                        for (var i = 0, list = args; i < list.length; i += 1) {
                            var arg = list[i];

                            if (!arg.evaluate(ctx)) {
                                return false;
                            }
                        }
                        return true;
                    }
                ]
            ]
        },
        'any': {
            type: BooleanType$8,
            overloads: [
                [
                    [BooleanType$8, BooleanType$8],
                    function (ctx, ref) {
                        var a = ref[0];
                        var b = ref[1];

                        return a.evaluate(ctx) || b.evaluate(ctx);
                    }
                ],
                [
                    varargs(BooleanType$8),
                    function (ctx, args) {
                        for (var i = 0, list = args; i < list.length; i += 1) {
                            var arg = list[i];

                            if (arg.evaluate(ctx)) {
                                return true;
                            }
                        }
                        return false;
                    }
                ]
            ]
        },
        '!': [
            BooleanType$8,
            [BooleanType$8],
            function (ctx, ref) {
                var b = ref[0];

                return !b.evaluate(ctx);
            }
        ],
        'is-supported-script': [
            BooleanType$8,
            [StringType$8],
            // At parse time this will always return true, so we need to exclude this expression with isGlobalPropertyConstant
            function (ctx, ref) {
                var s = ref[0];

                var isSupportedScript = ctx.globals && ctx.globals.isSupportedScript;
                if (isSupportedScript) {
                    return isSupportedScript(s.evaluate(ctx));
                }
                return true;
            }
        ],
        'upcase': [
            StringType$8,
            [StringType$8],
            function (ctx, ref) {
                var s = ref[0];

                return s.evaluate(ctx).toUpperCase();
            }
        ],
        'downcase': [
            StringType$8,
            [StringType$8],
            function (ctx, ref) {
                var s = ref[0];

                return s.evaluate(ctx).toLowerCase();
            }
        ],
        'concat': [
            StringType$8,
            varargs(ValueType$a),
            function (ctx, args) {
                return args.map(function (arg) {
                    return Values.toString$1(arg.evaluate(ctx));
                }).join('');
            }
        ],
        'resolved-locale': [
            StringType$8,
            [CollatorType$3],
            function (ctx, ref) {
                var collator = ref[0];

                return collator.evaluate(ctx).resolvedLocale();
            }
        ]
    });

    var StyleExpression$1 = function StyleExpression(expression, propertySpec) {
        this.expression = expression;
        this._warningHistory = {};
        this._evaluator = new EvaluationContext();
        this._defaultValue = propertySpec ? getDefaultValue(propertySpec) : null;
        this._enumValues = propertySpec && propertySpec.type === 'enum' ? propertySpec.values : null;
    };

    StyleExpression$1.prototype.evaluateWithoutErrorHandling = function evaluateWithoutErrorHandling(globals, feature, featureState, availableImages, formattedSection) {
        this._evaluator.globals = globals;
        this._evaluator.feature = feature;
        this._evaluator.featureState = featureState;
        this._evaluator.availableImages = availableImages || null;
        this._evaluator.formattedSection = formattedSection;

        return this.expression.evaluate(this._evaluator);
    };

    StyleExpression$1.prototype.evaluate = function evaluate(globals, feature, featureState, availableImages, formattedSection) {
        this._evaluator.globals = globals;
        this._evaluator.feature = feature || null;
        this._evaluator.featureState = featureState || null;
        this._evaluator.availableImages = availableImages || null;
        this._evaluator.formattedSection = formattedSection || null;

        try {
            var val = this.expression.evaluate(this._evaluator);
            // eslint-disable-next-line no-self-compare
            if (val === null || val === undefined || (typeof val === 'number' && val !== val)) {
                return this._defaultValue;
            }
            if (this._enumValues && !(val in this._enumValues)) {
                throw new RuntimeError(("Expected value to be one of " + (Object.keys(this._enumValues).map(function (v) {
                    return JSON.stringify(v);
                }).join(', ')) + ", but found " + (JSON.stringify(val)) + " instead."));
            }
            return val;
        } catch (e) {
            if (!this._warningHistory[e.message]) {
                this._warningHistory[e.message] = true;
                if (typeof console !== 'undefined') {
                    console.warn(e.message);
                }
            }
            return this._defaultValue;
        }
    };

    function isFunction(value) {
        return typeof value === 'object' && value !== null && !Array.isArray(value);
    }

    function getDefaultValue(spec) {
        if (spec.type === 'color' && isFunction(spec.default)) {
            // Special case for heatmap-color: it uses the 'default:' to define a
            // default color ramp, but createExpression expects a simple value to fall
            // back to in case of runtime errors
            return new Color(0, 0, 0, 0);
        } else if (spec.type === 'color') {
            return Color.parse(spec.default) || null;
        } else if (spec.default === undefined) {
            return null;
        } else {
            return spec.default;
        }
    }

    function Expression() {
    }

    function success(value) {
        return {result: 'success', value: value};
    }

    function error(value) {
        return {result: 'error', value: value};
    }

    Expression.isExpression = function (testExpression) {
        return Array.isArray(testExpression) && testExpression.length > 0 &&
            typeof testExpression[0] === 'string' && testExpression[0] in expressions;
    };

    var NumberType$b = {kind: 'number'};
    var StringType$9 = {kind: 'string'};
    var BooleanType$9 = {kind: 'boolean'};
    var ColorType$6 = {kind: 'color'};
    var ValueType$b = {kind: 'value'};
    var FormattedType$3 = {kind: 'formatted'};
    var ResolvedImageType$4 = {kind: 'resolvedImage'};

    function array$6(itemType, N) {
        return {
            kind: 'array',
            itemType: itemType,
            N: N
        };
    }

    function getExpectedType(spec) {
        var types = {
            color: ColorType$6,
            string: StringType$9,
            number: NumberType$b,
            enum: StringType$9,
            boolean: BooleanType$9,
            formatted: FormattedType$3,
            resolvedImage: ResolvedImageType$4
        };

        if (spec.type === 'array') {
            return array$6(types[spec.value] || ValueType$b, spec.length);
        }

        return types[spec.type];
    }

    Expression.createExpression = function (expression, propertySpec) {
        var parser = new ParsingContext(expressions, [], propertySpec ? getExpectedType(propertySpec) : undefined);
        // For string-valued properties, coerce to string at the top level rather than asserting.
        var parsed = parser.parse(expression, undefined, undefined, undefined,
            propertySpec && propertySpec.type === 'string' ? {typeAnnotation: 'coerce'} : undefined);

        if (!parsed) {
            //assert_1(parser.errors.length > 0);
            return error(parser.errors);
        }

        return success(new StyleExpression$1(parsed, propertySpec));
    };


    function isFunction$1(value) {
        return typeof value === 'object' && value !== null && !Array.isArray(value);
    }

    function extend$1(output) {
        var inputs = [], len = arguments.length - 1;
        while (len-- > 0) inputs[ len ] = arguments[ len + 1 ];

        for (var i = 0, list = inputs; i < list.length; i += 1) {
            var input = list[i];

            for (var k in input) {
                output[k] = input[k];
            }
        }
        return output;
    }

    function evaluateIdentityFunction(parameters, propertySpec, input) {
        if (propertySpec.type === 'color') {
            input = Color$1.parse(input);
        } else if (propertySpec.type === 'formatted') {
            input = Formatted.fromString(input.toString());
        } else if (propertySpec.type === 'resolvedImage') {
            input = ResolvedImage.fromString(input.toString());
        } else if (getType(input) !== propertySpec.type && (propertySpec.type !== 'enum' || !propertySpec.values[input])) {
            input = undefined;
        }
        return coalesce(input, parameters.default, propertySpec.default);
    }

    function createFunction(parameters, propertySpec) {
        var isColor = propertySpec.type === 'color';
        var zoomAndFeatureDependent = parameters.stops && typeof parameters.stops[0][0] === 'object';
        var featureDependent = zoomAndFeatureDependent || parameters.property !== undefined;
        var zoomDependent = zoomAndFeatureDependent || !featureDependent;
        var type = parameters.type || (supportsInterpolation(propertySpec) ? 'exponential' : 'interval');

        if (isColor) {
            parameters = extend$1({}, parameters);

            if (parameters.stops) {
                parameters.stops = parameters.stops.map(function (stop) {
                    return [stop[0], Color$1.parse(stop[1])];
                });
            }

            if (parameters.default) {
                parameters.default = Color$1.parse(parameters.default);
            } else {
                parameters.default = Color$1.parse(propertySpec.default);
            }
        }

        if (parameters.colorSpace && parameters.colorSpace !== 'rgb' && !colorSpaces[parameters.colorSpace]) { // eslint-disable-line import/namespace
            throw new Error(("Unknown color space: " + (parameters.colorSpace)));
        }

        var innerFun;
        var hashedStops;
        var categoricalKeyType;
        if (type === 'exponential') {
            innerFun = evaluateExponentialFunction;
        } else if (type === 'interval') {
            innerFun = evaluateIntervalFunction;
        } else if (type === 'categorical') {
            innerFun = evaluateCategoricalFunction;

            // For categorical functions, generate an Object as a hashmap of the stops for fast searching
            hashedStops = Object.create(null);
            for (var i = 0, list = parameters.stops; i < list.length; i += 1) {
                var stop = list[i];

                hashedStops[stop[0]] = stop[1];
            }

            // Infer key type based on first stop key-- used to encforce strict type checking later
            categoricalKeyType = typeof parameters.stops[0][0];

        } else if (type === 'identity') {
            innerFun = evaluateIdentityFunction;
        } else {
            throw new Error(("Unknown function type \"" + type + "\""));
        }

        if (zoomAndFeatureDependent) {
            var featureFunctions = {};
            var zoomStops = [];
            for (var s = 0; s < parameters.stops.length; s++) {
                var stop$1 = parameters.stops[s];
                var zoom = stop$1[0].zoom;
                if (featureFunctions[zoom] === undefined) {
                    featureFunctions[zoom] = {
                        zoom: zoom,
                        type: parameters.type,
                        property: parameters.property,
                        default: parameters.default,
                        stops: []
                    };
                    zoomStops.push(zoom);
                }
                featureFunctions[zoom].stops.push([stop$1[0].value, stop$1[1]]);
            }

            var featureFunctionStops = [];
            for (var i$1 = 0, list$1 = zoomStops; i$1 < list$1.length; i$1 += 1) {
                var z = list$1[i$1];

                featureFunctionStops.push([featureFunctions[z].zoom, createFunction(featureFunctions[z], propertySpec)]);
            }

            var interpolationType = {name: 'linear'};
            return {
                kind: 'composite',
                interpolationType: interpolationType,
                interpolationFactor: Interpolate.interpolationFactor.bind(undefined, interpolationType),
                zoomStops: featureFunctionStops.map(function (s) {
                    return s[0];
                }),
                evaluate: function evaluate(ref, properties) {
                    var zoom = ref.zoom;

                    return evaluateExponentialFunction({
                        stops: featureFunctionStops,
                        base: parameters.base
                    }, propertySpec, zoom).evaluate(zoom, properties);
                }
            };
        } else if (zoomDependent) {
            var interpolationType$1 = type === 'exponential' ?
            {name: 'exponential', base: parameters.base !== undefined ? parameters.base : 1} : null;
            return {
                kind: 'camera',
                interpolationType: interpolationType$1,
                interpolationFactor: Interpolate.interpolationFactor.bind(undefined, interpolationType$1),
                zoomStops: parameters.stops.map(function (s) {
                    return s[0];
                }),
                evaluate: function (ref) {
                    var zoom = ref.zoom;

                    return innerFun(parameters, propertySpec, zoom, hashedStops, categoricalKeyType);
                }
            };
        } else {
            return {
                kind: 'source',
                evaluate: function evaluate(_, feature) {
                    var value = feature && feature.properties ? feature.properties[parameters.property] : undefined;
                    if (value === undefined) {
                        return coalesce(parameters.default, propertySpec.default);
                    }
                    return innerFun(parameters, propertySpec, value, hashedStops, categoricalKeyType);
                }
            };
        }
    }

    function coalesce(a, b, c) {
        if (a !== undefined) return a;
        if (b !== undefined) return b;
        if (c !== undefined) return c;
    }

    // serialization wrapper for old-style stop functions normalized to the
    // expression interface
    var StylePropertyFunction = function StylePropertyFunction(parameters, specification) {
        this._parameters = parameters;
        this._specification = specification;
        extend$1(this, createFunction(this._parameters, this._specification));
    };

    StylePropertyFunction.deserialize = function deserialize(serialized) {
        return ((new StylePropertyFunction(serialized._parameters, serialized._specification))                        );
    };

    StylePropertyFunction.serialize = function serialize(input) {
        return {
            _parameters: input._parameters,
            _specification: input._specification
        };
    };

    Expression.normalizePropertyExpression = function (value, specification) {
        if (isFunction$1(value)) {
            return (new StylePropertyFunction(value, specification)     );

        } else if (Expression.isExpression(value)) {
            var expression = createPropertyExpression(value, specification);
            if (expression.result === 'error') {
                // this should have been caught in validation
                throw new Error(expression.value.map(function (err) {
                    return ((err.key) + ": " + (err.message));
                }).join(', '));
            }
            return expression.value;

        } else {
            var constant = value;
            if (typeof value === 'string' && specification.type === 'color') {
                constant = Color$1.parse(value);
            }
            return {
                kind: 'constant',
                evaluate: function () {
                    return constant;
                }
            };
        }
    };

    function featureFilter() {
    }

    featureFilter.isExpressionFilter = function (filter) {
        if (filter === true || filter === false) {
            return true;
        }

        if (!Array.isArray(filter) || filter.length === 0) {
            return false;
        }
        switch (filter[0]) {
            case 'has':
                return filter.length >= 2 && filter[1] !== '$id' && filter[1] !== '$type';

            case 'in':
                return filter.length >= 3 && Array.isArray(filter[2]);
            case '!in':
            case '!has':
            case 'none':
                return false;

            case '==':
            case '!=':
            case '>':
            case '>=':
            case '<':
            case '<=':
            case 'like':
                return filter.length !== 3 || (Array.isArray(filter[1]) || Array.isArray(filter[2]));

            case 'any':
            case 'all':
                for (var i = 0, list = filter.slice(1); i < list.length; i += 1) {
                    var f = list[i];

                    if (!featureFilter.isExpressionFilter(f) && typeof f !== 'boolean') {
                        return false;
                    }
                }
                return true;

            default:
                return true;
        }
    };

    var filterSpec = {
        'type': 'boolean',
        'default': false,
        'transition': false,
        'property-type': 'data-driven',
        'expression': {
            'interpolated': false,
            'parameters': ['zoom', 'feature']
        }
    };

    /**
     * Given a filter expressed as nested arrays, return a new function
     * that evaluates whether a given feature (with a .properties or .tags property)
     * passes its test.
     *
     * @private
     * @param {Array} filter mapbox gl filter
     * @returns {Function} filter-evaluating function
     */
    featureFilter.createFilter = function (filter) {
        if (filter === null || filter === undefined) {
            return function () {
                return true;
            };
        }

        if (!featureFilter.isExpressionFilter(filter)) {
            filter = convertFilter(filter);
        }

        var compiled = Expression.createExpression(filter, filterSpec);
        if (compiled.result === 'error') {
            throw new Error(compiled.value.map(function (err) {
                return ((err.key) + ": " + (err.message));
            }).join(', '));
        } else {
            return function (globalProperties, feature) {
                return compiled.value.evaluate(globalProperties, feature);
            };
        }
    };

    // Comparison function to sort numbers and strings
    function compare(a, b) {
        return a < b ? -1 : a > b ? 1 : 0;
    }

    function convertFilter(filter) {
        if (!filter) {
            return true;
        }
        var op = filter[0];
        if (filter.length <= 1) {
            return (op !== 'any');
        }
        var converted =
            op === '==' ? convertComparisonOp(filter[1], filter[2], '==') :
                op === '!=' ? convertNegation(convertComparisonOp(filter[1], filter[2], '==')) :
                    op === '<' ||
                        op === '>' ||
                        op === '<=' ||
                        op === '>=' ? convertComparisonOp(filter[1], filter[2], op) :
                        op === 'any' ? convertDisjunctionOp(filter.slice(1)) :
                            op === 'all' ? ['all'].concat(filter.slice(1).map(convertFilter)) :
                                op === 'none' ? ['all'].concat(filter.slice(1).map(convertFilter).map(convertNegation)) :
                                    op === 'in' ? convertInOp(filter[1], filter.slice(2)) :
                                        op === '!in' ? convertNegation(convertInOp(filter[1], filter.slice(2))) :
                                            op === 'has' ? convertHasOp(filter[1]) :
                                                op === '!has' ? convertNegation(convertHasOp(filter[1])) :
                                                    op === 'like' ? convertComparisonOp(filter[1], filter[2], 'like') :
                                                        true;
        return converted;
    }

    function convertComparisonOp(property, value, op) {
        switch (property) {
            case '$type':
                return [("filter-type-" + op), value];
            case '$id':
                return [("filter-id-" + op), value];
            default:
                return [("filter-" + op), property, value];
        }
    }

    function convertDisjunctionOp(filters) {
        return ['any'].concat(filters.map(convertFilter));
    }

    function convertInOp(property, values) {
        if (values.length === 0) {
            return false;
        }
        switch (property) {
            case '$type':
                return ["filter-type-in", ['literal', values]];
            case '$id':
                return ["filter-id-in", ['literal', values]];
            default:
                if (values.length > 200 && !values.some(function (v) {
                    return typeof v !== typeof values[0];
                })) {
                    return ['filter-in-large', property, ['literal', values.sort(compare)]];
                } else {
                    return ['filter-in-small', property, ['literal', values]];
                }
        }
    }

    function convertHasOp(property) {
        switch (property) {
            case '$type':
                return true;
            case '$id':
                return ["filter-has-id"];
            default:
                return ["filter-has", property];
        }
    }

    function convertNegation(filter) {
        return ['!', filter];
    }

    var FeatureIndexArray$1 = arrayTypes.FeatureIndexArray;
    var FeatureIndex = function FeatureIndex(tileID, grid, featureIndexArray) {
        //this.tileID = tileID;
        this.x = tileID.x;
        this.y = tileID.y;
        this.z = tileID.z;
        this.grid = grid || new GridIndex(EXTENT, 16, 0);
        this.featureIndexArray = featureIndexArray || new FeatureIndexArray$1();
    };

    FeatureIndex.prototype.insert = function insert(feature, geometry, featureIndex, sourceLayerIndex, bucketIndex, is3D) {
        var key = this.featureIndexArray.length;
        this.featureIndexArray.emplaceBack(featureIndex, sourceLayerIndex, bucketIndex);

        var grid = this.grid;

        for (var r = 0; r < geometry.length; r++) {
            var ring = geometry[r];

            var bbox = [Infinity, Infinity, -Infinity, -Infinity];
            for (var i = 0; i < ring.length; i++) {
                var p = ring[i];
                bbox[0] = Math.min(bbox[0], p.x);
                bbox[1] = Math.min(bbox[1], p.y);
                bbox[2] = Math.max(bbox[2], p.x);
                bbox[3] = Math.max(bbox[3], p.y);
            }

            if (bbox[0] < EXTENT &&
                bbox[1] < EXTENT &&
                bbox[2] >= 0 &&
                bbox[3] >= 0) {
                grid.insert(key, bbox[0], bbox[1], bbox[2], bbox[3]);
            }
        }
    };

    FeatureIndex.prototype.loadVTLayers = function loadVTLayers() {
        if (!this.vtLayers) {
            this.vtLayers = new VectorTile(new pbf.Protobuf(this.rawTileData)).layers;
            this.sourceLayerCoder = new DictionaryCoder(this.vtLayers ? Object.keys(this.vtLayers).sort() : ['_geojsonTileLayer']);
        }
        return this.vtLayers;
    };

    // Finds non-symbol features in this tile at a particular position.
    FeatureIndex.prototype.query = function query(args, styleLayers, sourceFeatureState) {
        var this$1 = this;

        this.loadVTLayers();

        var params = args.params || {},
            pixelsToTileUnits = EXTENT / args.tileSize,
            filter = featureFilter.createFilter(params.filter);

        var queryGeometry = args.queryGeometry;
        var queryPadding = 5;

        var bounds = getBounds(queryGeometry);
        var matching = this.grid.query(bounds.minX - queryPadding, bounds.minY - queryPadding, bounds.maxX + queryPadding, bounds.maxY + queryPadding);
        matching.sort(topDownFeatureComparator);

        var result = {};
        var previousIndex;
        var loop = function (k) {
            var index = matching[k];

            // don't check the same feature more than once
            if (index === previousIndex) {
                return;
            }
            previousIndex = index;

            var match = this$1.featureIndexArray.get(index);
            var featureGeometry = null;
            this$1.loadMatchingFeature(
                result,
                match.bucketIndex,
                match.sourceLayerIndex,
                match.featureIndex,
                filter,
                params.layers,
                styleLayers,
                function (feature, styleLayer) {
                    if (!featureGeometry) {
                        featureGeometry = loadGeometry(feature);
                    }
                    var featureState = {};
    //                    if (feature.id) {
    //                        // `feature-state` expression evaluation requires feature state to be available
    //                        featureState = sourceFeatureState.getState(styleLayer.sourceLayer || '_geojsonTileLayer', feature.id);
    //                    }
                    return styleLayer.queryIntersectsFeature(queryGeometry, feature, featureState, featureGeometry, this$1.z, args.transform, pixelsToTileUnits, args.pixelPosMatrix);
                }
            );
        };

        for (var k = 0; k < matching.length; k++) loop(k);

        return result;
    };

    FeatureIndex.prototype.loadMatchingFeature = function loadMatchingFeature(result, bucketIndex, sourceLayerIndex, featureIndex, filter, filterLayerIDs, styleLayers, intersectionTest) {
        if(!when.defined(bucketIndex) || !when.defined(sourceLayerIndex) || !when.defined(featureIndex)){
            return;
        }

        var layerIDs = this.bucketLayerIDs[bucketIndex];
        if (filterLayerIDs && !Util.arraysIntersect(filterLayerIDs, layerIDs)) {
            return;
        }

        var sourceLayerName = this.sourceLayerCoder.decode(sourceLayerIndex);
        var sourceLayer = this.vtLayers[sourceLayerName];
        var feature = sourceLayer.feature(featureIndex);

        if (!filter(new EvaluationParameters$1(this.z), feature)) {
            return;
        }

        for (var l = 0; l < layerIDs.length; l++) {
            var layerID = layerIDs[l];

            if (filterLayerIDs && filterLayerIDs.indexOf(layerID) < 0) {
                continue;
            }

            var styleLayer = styleLayers[layerID];
            if (!styleLayer) {
                continue;
            }

            var intersectionZ = !intersectionTest || intersectionTest(feature, styleLayer);
            if (!intersectionZ) {
                // Only applied for non-symbol features
                continue;
            }

    //            var geojsonFeature = new Feature(feature, this.z, this.x, this.y);
    //            (geojsonFeature ).layer = styleLayer.serialize();
            feature.layer = styleLayer.serialize();
            var layerResult = result[layerID];
            if (layerResult === undefined) {
                layerResult = result[layerID] = [];
            }
            layerResult.push({featureIndex: featureIndex, feature: feature, intersectionZ: intersectionZ});
        }
    };

    // Given a set of symbol indexes that have already been looked up,
    // return a matching set of GeoJSONFeatures
    FeatureIndex.prototype.lookupSymbolFeatures = function lookupSymbolFeatures(symbolFeatureIndexes, bucketIndex, sourceLayerIndex, filterSpec, filterLayerIDs, styleLayers) {
        var result = {};
        this.loadVTLayers();

        var filter = createFilter(filterSpec);

        for (var i = 0, list = symbolFeatureIndexes; i < list.length; i += 1) {
            var symbolFeatureIndex = list[i];

            this.loadMatchingFeature(
                result,
                bucketIndex,
                sourceLayerIndex,
                symbolFeatureIndex,
                filter,
                filterLayerIDs,
                styleLayers
            );

        }
        return result;
    };

    FeatureIndex.prototype.hasLayer = function hasLayer(id) {
        for (var i$1 = 0, list$1 = this.bucketLayerIDs; i$1 < list$1.length; i$1 += 1) {
            var layerIDs = list$1[i$1];

            for (var i = 0, list = layerIDs; i < list.length; i += 1) {
                var layerID = list[i];

                if (id === layerID) {
                    return true;
                }
            }
        }

        return false;
    };

    // register(
    //     'FeatureIndex',
    //     FeatureIndex,
    //     {omit: ['rawTileData', 'sourceLayerCoder']}
    // );

    function getBounds(geometry) {
        var minX = Infinity;
        var minY = Infinity;
        var maxX = -Infinity;
        var maxY = -Infinity;
        for (var i = 0, list = geometry; i < list.length; i += 1) {
            var p = list[i];

            minX = Math.min(minX, p.x);
            minY = Math.min(minY, p.y);
            maxX = Math.max(maxX, p.x);
            maxY = Math.max(maxY, p.y);
        }
        return {minX: minX, minY: minY, maxX: maxX, maxY: maxY};
    }

    function topDownFeatureComparator(a, b) {
        return b - a;
    }

    WebWorkerTransfer.register('FeatureIndex', FeatureIndex, {omit: ['rawTileData', 'sourceLayerCoder', 'vtLayers']});

    const refProperties = ['type', 'source', 'source-layer', 'minzoom', 'maxzoom', 'filter', 'layout'];

    function stringify(obj) {
        var type = typeof obj;
        if (type === 'number' || type === 'boolean' || type === 'string' || obj === undefined || obj === null)
        { return JSON.stringify(obj); }

        if (Array.isArray(obj)) {
            var str$1 = '[';
            for (var i$1 = 0, list = obj; i$1 < list.length; i$1 += 1) {
                var val = list[i$1];

                str$1 += (stringify(val)) + ",";
            }
            return (str$1 + "]");
        }

        var keys = Object.keys(obj).sort();

        var str = '{';
        for (var i = 0; i < keys.length; i++) {
            str += (JSON.stringify(keys[i])) + ":" + (stringify(obj[keys[i]])) + ",";
        }
        return (str + "}");
    }

    function getKey(layer) {
        var key = '';
        for (var i = 0, list = refProperties; i < list.length; i += 1) {
            var k = list[i];

            key += "/" + (stringify(layer[k]));
        }
        return key;
    }

    /**
     * Given an array of layers, return an array of arrays of layers where all
     * layers in each group have identical layout-affecting properties. These
     * are the properties that were formerly used by explicit `ref` mechanism
     * for layers: 'type', 'source', 'source-layer', 'minzoom', 'maxzoom',
     * 'filter', and 'layout'.
     *
     * The input is not modified. The output layers are references to the
     * input layers.
     *
     * @private
     * @param {Array<Layer>} layers
     * @param {Object} [cachedKeys] - an object to keep already calculated keys.
     * @returns {Array<Array<Layer>>}
     */
    function groupByLayout(layers, cachedKeys) {
        var groups = {};

        for (var i = 0; i < layers.length; i++) {

            var k = (cachedKeys && cachedKeys[layers[i].id]) || getKey(layers[i]);
            // update the cache if there is one
            if (cachedKeys)
            { cachedKeys[layers[i].id] = k; }

            var group = groups[k];
            if (!group) {
                group = groups[k] = [];
            }
            group.push(layers[i]);
        }

        var result = [];

        for (var k$1 in groups) {
            result.push(groups[k$1]);
        }

        return result;
    }

    var layout$1 = createLayout([
        {name: 'a_pos', components: 2, type: 'Int16'}
    ], 4);
    var members = layout$1.members;

    function addCircleVertex(layoutVertexArray, x, y, extrudeX, extrudeY) {
        layoutVertexArray.emplaceBack(
            (x * 2) + ((extrudeX + 1) / 2),
            (y * 2) + ((extrudeY + 1) / 2));
    }

    /**
     * Circles are represented by two triangles.
     *
     * Each corner has a pos that is the center of the circle and an extrusion
     * vector that is where it points.
     * @private
     */
    var CircleBucket = function CircleBucket(options) {
        this.zoom = options.zoom;
        this.overscaling = options.overscaling;
        this.layers = options.layers;
        this.layerIds = this.layers.map(function (layer) {
            return layer.id;
        });
        this.index = options.index;
        this.hasPattern = false;

        this.layoutVertexArray = new StructArrayLayout2i4();
        this.indexArray = new StructArrayLayout3ui6();
        this.segments = new SegmentVector();
        this.programConfigurations = new ProgramConfigurationSet(members, options.layers, options.zoom);
        this.stateDependentLayerIds = this.layers.filter(function (l) {
            return l.isStateDependent();
        }).map(function (l) {
            return l.id;
        });
    };

    CircleBucket.prototype.populate = function populate(features, options) {
        var styleLayer = this.layers[0];
        var bucketFeatures = [];
        var circleSortKey = null;

        // Heatmap layers are handled in this bucket and have no evaluated properties, so we check our access
        if (styleLayer.type === 'circle') {
            circleSortKey = ((styleLayer )).layout.get('circle-sort-key');
        }

        for (var i = 0, list = features; i < list.length; i += 1) {
            var ref = list[i];
            var feature = ref.feature;
            var index = ref.index;
            var sourceLayerIndex = ref.sourceLayerIndex;

            if (this.layers[0]._featureFilter(new EvaluationParameters$1(0), feature)) {
                var geometry = loadGeometry(feature);
                var sortKey = circleSortKey ?
                    circleSortKey.evaluate(feature, {}) :
                    undefined;

                var bucketFeature = {
                    id: feature.id,
                    properties: feature.properties,
                    type: feature.type,
                    sourceLayerIndex: sourceLayerIndex,
                    index: index,
                    geometry: geometry,
                    patterns: {},
                    sortKey: sortKey
                };

                bucketFeatures.push(bucketFeature);
            }
        }

        if (circleSortKey) {
            bucketFeatures.sort(function (a, b) {
                // a.sortKey is always a number when in use
                return ((a.sortKey )    ) - ((b.sortKey )    );
            });
        }

        for (var i$1 = 0, list$1 = bucketFeatures; i$1 < list$1.length; i$1 += 1) {
            var bucketFeature$1 = list$1[i$1];

            var ref$1 = bucketFeature$1;
            var geometry$1 = ref$1.geometry;
            var index$1 = ref$1.index;
            var sourceLayerIndex$1 = ref$1.sourceLayerIndex;
            var feature$1 = features[index$1].feature;

            this.addFeature(bucketFeature$1, geometry$1, index$1);
            options.featureIndex.insert(feature$1, geometry$1, index$1, sourceLayerIndex$1, this.index);
        }
    };

    CircleBucket.prototype.update = function update(states, vtLayer, imagePositions) {
        if (!this.stateDependentLayers.length) {
            return;
        }
        this.programConfigurations.updatePaintArrays(states, vtLayer, this.stateDependentLayers, imagePositions);
    };

    CircleBucket.prototype.isEmpty = function isEmpty() {
        return this.layoutVertexArray.length === 0;
    };

    CircleBucket.prototype.uploadPending = function uploadPending() {
        return !this.uploaded || this.programConfigurations.needsUpload;
    };

    CircleBucket.prototype.upload = function upload(context) {
        if (!this.uploaded) {
            this.layoutVertexBuffer = context.createVertexBuffer(this.layoutVertexArray, members);
            this.indexBuffer = context.createIndexBuffer(this.indexArray);
        }
        this.programConfigurations.upload(context);
        this.uploaded = true;
    };

    CircleBucket.prototype.destroy = function destroy() {
        if (!this.layoutVertexBuffer) {
            return;
        }
        this.layoutVertexBuffer.destroy();
        this.indexBuffer.destroy();
        this.programConfigurations.destroy();
        this.segments.destroy();
    };

    CircleBucket.prototype.addFeature = function addFeature(feature, geometry, index) {
        for (var i$1 = 0, list$1 = geometry; i$1 < list$1.length; i$1 += 1) {
            var ring = list$1[i$1];

            for (var i = 0, list = ring; i < list.length; i += 1) {
                var point = list[i];

                var x = point.x;
                var y = point.y;

                // Do not include points that are outside the tile boundaries.
                if (x < 0 || x >= EXTENT || y < 0 || y >= EXTENT) {
                    continue;
                }

                // this geometry will be of the Point type, and we'll derive
                // two triangles from it.
                //
                // ┌─────────┐
                // │ 3 2 │
                // │     │
                // │ 0 1 │
                // └─────────┘

                var segment = this.segments.prepareSegment(4, this.layoutVertexArray, this.indexArray, feature.sortKey);
                var index$1 = segment.vertexLength;

                addCircleVertex(this.layoutVertexArray, x, y, -1, -1);
                addCircleVertex(this.layoutVertexArray, x, y, 1, -1);
                addCircleVertex(this.layoutVertexArray, x, y, 1, 1);
                addCircleVertex(this.layoutVertexArray, x, y, -1, 1);

                this.indexArray.emplaceBack(index$1, index$1 + 1, index$1 + 2);
                this.indexArray.emplaceBack(index$1, index$1 + 3, index$1 + 2);

                segment.vertexLength += 4;
                segment.primitiveLength += 2;
            }
        }

        this.programConfigurations.populatePaintArrays(this.layoutVertexArray.length, feature, index, {});
    };

    WebWorkerTransfer.register('CircleBucket', CircleBucket, {omit: ['layers']});

    /**
     * An implementation of `Property` for properties that do not permit data-driven (source or composite) expressions.
     * This restriction allows us to declare statically that the result of possibly evaluating this kind of property
     * is in fact always the scalar type `T`, and can be used without further evaluating the value on a per-feature basis.
     *
     * @private
     */
    var DataConstantProperty = function DataConstantProperty(specification) {
        this.specification = specification;
    };

    DataConstantProperty.prototype.possiblyEvaluate = function possiblyEvaluate(value, parameters) {
        //assert_1(!value.isDataDriven());
        return value.expression.evaluate(parameters);
    };

    DataConstantProperty.prototype.interpolate = function interpolate$1(a, b, t) {
        var interp = (interpolate   )[this.specification.type];
        if (interp) {
            return interp(a, b, t);
        } else {
            return a;
        }
    };

    WebWorkerTransfer.register('DataConstantProperty', DataConstantProperty);

    /**
     * An implementation of `Property` for properties that permit data-driven (source or composite) expressions.
     * The result of possibly evaluating this kind of property is `PossiblyEvaluatedPropertyValue<T>`; obtaining
     * a scalar value `T` requires further evaluation on a per-feature basis.
     *
     * @private
     */
    var DataDrivenProperty = function DataDrivenProperty(specification, overrides) {
        this.specification = specification;
        this.overrides = overrides;
    };

    DataDrivenProperty.prototype.possiblyEvaluate = function possiblyEvaluate(value, parameters, availableImages) {
        if (value.expression.kind === 'constant' || value.expression.kind === 'camera') {
            return new PossiblyEvaluatedPropertyValue$1(this, {kind: 'constant', value: value.expression.evaluate(parameters, (null   ), {}, availableImages)}, parameters);
        } else {
            return new PossiblyEvaluatedPropertyValue$1(this, value.expression, parameters);
        }
    };

    DataDrivenProperty.prototype.interpolate = function interpolate$2(a, b, t) {
        // If either possibly-evaluated value is non-constant, give up: we aren't able to interpolate data-driven values.
        if (a.value.kind !== 'constant' || b.value.kind !== 'constant') {
            return a;
        }

        // Special case hack solely for fill-outline-color. The undefined value is subsequently handled in
        // FillStyleLayer#recalculate, which sets fill-outline-color to the fill-color value if the former
        // is a PossiblyEvaluatedPropertyValue containing a constant undefined value. In addition to the
        // return value here, the other source of a PossiblyEvaluatedPropertyValue containing a constant
        // undefined value is the "default value" for fill-outline-color held in
        // `Properties#defaultPossiblyEvaluatedValues`, which serves as the prototype of
        // `PossiblyEvaluated#_values`.
        if (a.value.value === undefined || b.value.value === undefined) {
            return new PossiblyEvaluatedPropertyValue$1(this, {kind: 'constant', value: (undefined   )}, a.parameters);
        }

        var interp = (interpolate   )[this.specification.type];
        if (interp) {
            return new PossiblyEvaluatedPropertyValue$1(this, {kind: 'constant', value: interp(a.value.value, b.value.value, t)}, a.parameters);
        } else {
            return a;
        }
    };

    DataDrivenProperty.prototype.evaluate = function evaluate(value, parameters, feature, featureState, availableImages) {
        if (value.kind === 'constant') {
            return value.value;
        } else {
            return value.evaluate(parameters, feature, featureState, availableImages);
        }
    };

    WebWorkerTransfer.register('DataDrivenProperty', DataDrivenProperty);

    var PropertyValue = function PropertyValue(property, value) {
        this.property = property;
        this.value = value;
        this.expression = Expression.normalizePropertyExpression(value === undefined ? property.specification.default : value, property.specification);
    };

    PropertyValue.prototype.isDataDriven = function isDataDriven() {
        return this.expression.kind === 'source' || this.expression.kind === 'composite';
    };

    PropertyValue.prototype.possiblyEvaluate = function possiblyEvaluate(parameters, availableImages) {
        return this.property.possiblyEvaluate(this, parameters, availableImages);
    };

    /**
     * Given a value `t` that varies between 0 and 1, return
     * an interpolation function that eases between 0 and 1 in a pleasing
     * cubic in-out fashion.
     *
     * @private
     */
    function easeCubicInOut(t        )         {
        if (t <= 0) { return 0; }
        if (t >= 1) { return 1; }
        var t2 = t * t,
            t3 = t2 * t;
        return 4 * (t < 0.5 ? t3 : 3 * (t - t2) + t3 - 0.75);
    }

    /**
     * `TransitioningPropertyValue` implements the first of two intermediate steps in the evaluation chain of a paint
     * property value. In this step, transitions between old and new values are handled: as long as the transition is in
     * progress, `TransitioningPropertyValue` maintains a reference to the prior value, and interpolates between it and
     * the new value based on the current time and the configured transition duration and delay. The product is the next
     * step in the evaluation chain: the "possibly evaluated" result type `R`. See below for more on this concept.
     *
     * @private
     */
    var TransitioningPropertyValue = function TransitioningPropertyValue(property, value, prior, transition, now) {
        this.property = property;
        this.value = value;
        this.begin = now + transition.delay || 0;
        this.end = this.begin + transition.duration || 0;
        if (property.specification.transition && (transition.delay || transition.duration)) {
            this.prior = prior;
        }
    };

    TransitioningPropertyValue.prototype.possiblyEvaluate = function possiblyEvaluate(parameters, availableImages) {
        var now = parameters.now || 0;
        var finalValue = this.value.possiblyEvaluate(parameters, availableImages);
        var prior = this.prior;
        if (!prior) {
            // No prior value.
            return finalValue;
        } else if (now > this.end) {
            // Transition from prior value is now complete.
            this.prior = null;
            return finalValue;
        } else if (this.value.isDataDriven()) {
            // Transitions to data-driven properties are not supported.
            // We snap immediately to the data-driven value so that, when we perform layout,
            // we see the data-driven function and can use it to populate vertex buffers.
            this.prior = null;
            return finalValue;
        } else if (now < this.begin) {
            // Transition hasn't started yet.
            return prior.possiblyEvaluate(parameters, availableImages);
        } else {
            // Interpolate between recursively-calculated prior value and final.
            var t = (now - this.begin) / (this.end - this.begin);
            return this.property.interpolate(prior.possiblyEvaluate(parameters, availableImages), finalValue, easeCubicInOut(t));
        }
    };

    /**
     * Paint properties are _transitionable_: they can change in a fluid manner, interpolating or cross-fading between
     * old and new value. The duration of the transition, and the delay before it begins, is configurable.
     *
     * `TransitionablePropertyValue` is a compositional class that stores both the property value and that transition
     * configuration.
     *
     * A `TransitionablePropertyValue` can calculate the next step in the evaluation chain for paint property values:
     * `TransitioningPropertyValue`.
     *
     * @private
     */
    var TransitionablePropertyValue = function TransitionablePropertyValue(property) {
        this.property = property;
        this.value = new PropertyValue(property, undefined);
    };

    TransitionablePropertyValue.prototype.transitioned = function transitioned(parameters, prior) {
        return new TransitioningPropertyValue(this.property, this.value, prior, // eslint-disable-line no-use-before-define
            Util.extend({}, parameters.transition, this.transition), parameters.now);
    };

    TransitionablePropertyValue.prototype.untransitioned = function untransitioned() {
        return new TransitioningPropertyValue(this.property, this.value, null, {}, 0); // eslint-disable-line no-use-before-define
    };

    /**
     * A helper type: given an object type `Properties` whose values are each of type `Property<T, R>`, it calculates
     * an object type with the same keys, and values of type `R`.
     *
     * For properties that don't allow data-driven values, `R` is a scalar type such as `number`, `string`, or `Color`.
     * For data-driven properties, it is `PossiblyEvaluatedPropertyValue`. Critically, the type definitions are set up
     * in a way that allows flow to know which of these two cases applies for any given property name, and if you attempt
     * to use a `PossiblyEvaluatedPropertyValue` as if it was a scalar, or vice versa, you will get a type error. (However,
     * there's at least one case in which flow fails to produce a type error that you should be aware of: in a context such
     * as `layer.paint.get('foo-opacity') === 0`, if `foo-opacity` is data-driven, than the left-hand side is of type
     * `PossiblyEvaluatedPropertyValue<number>`, but flow will not complain about comparing this to a number using `===`.
     * See https://github.com/facebook/flow/issues/2359.)
     *
     * There's also a third, special case possiblity for `R`: for cross-faded properties, it's `?CrossFaded<T>`.
     *
     * @private
     */

    /**
     * `Properties` holds objects containing default values for the layout or paint property set of a given
     * layer type. These objects are immutable, and they are used as the prototypes for the `_values` members of
     * `Transitionable`, `Transitioning`, `Layout`, and `PossiblyEvaluated`. This allows these classes to avoid
     * doing work in the common case where a property has no explicit value set and should be considered to take
     * on the default value: using `for (const property of Object.keys(this._values))`, they can iterate over
     * only the _own_ properties of `_values`, skipping repeated calculation of transitions and possible/final
     * evaluations for defaults, the result of which will always be the same.
     *
     * @private
     */
    var Properties = function Properties(properties) {
        this.properties = properties;
        this.defaultPropertyValues = ({}   );
        this.defaultTransitionablePropertyValues = ({}   );
        this.defaultTransitioningPropertyValues = ({}   );
        this.defaultPossiblyEvaluatedValues = ({}   );
        this.overridableProperties = ([]   );

        for (var property in properties) {
            var prop = properties[property];
            if (prop.specification.overridable) {
                this.overridableProperties.push(property);
            }
            var defaultPropertyValue = this.defaultPropertyValues[property] =
                new PropertyValue(prop, undefined);
            var defaultTransitionablePropertyValue = this.defaultTransitionablePropertyValues[property] =
                new TransitionablePropertyValue(prop);
            this.defaultTransitioningPropertyValues[property] =
                defaultTransitionablePropertyValue.untransitioned();
            this.defaultPossiblyEvaluatedValues[property] =
                defaultPropertyValue.possiblyEvaluate(({}   ));
        }
    };

    function QueryUtils() {
    }

    QueryUtils.getMaximumPaintValue = function (property, layer, bucket) {
        var value = ((layer.paint).get(property)).value;
        if (value.kind === 'constant') {
            return value.value;
        } else {
            var binders = bucket.programConfigurations.get(layer.id).binders;
            return binders[property].maxValue;
        }
    };

    QueryUtils.translateDistance = function (translate) {
        return Math.sqrt(translate[0] * translate[0] + translate[1] * translate[1]);
    };

    QueryUtils.translate = function (queryGeometry, translate, translateAnchor, bearing, pixelsToTileUnits) {
        if (!translate[0] && !translate[1]) {
            return queryGeometry;
        }
        var pt = Point.convert(translate)._mult(pixelsToTileUnits);

        if (translateAnchor === "viewport") {
            pt._rotate(-bearing);
        }

        var translated = [];
        for (var i = 0; i < queryGeometry.length; i++) {
            var point = queryGeometry[i];
            translated.push(point.sub(pt));
        }
        return translated;
    };

    /**
     * `PossiblyEvaluated` stores a map of all (property name, `R`) pairs for paint or layout properties of a
     * given layer type.
     * @private
     */
    var PossiblyEvaluated = function PossiblyEvaluated(properties) {
        this._properties = properties;
        this._values = (Object.create(properties.defaultPossiblyEvaluatedValues)   );
    };

    PossiblyEvaluated.prototype.get = function get(name) {
        return this._values[name];
    };

    /**
     * Because layout properties are not transitionable, they have a simpler representation and evaluation chain than
     * paint properties: `PropertyValue`s are possibly evaluated, producing possibly evaluated values, which are then
     * fully evaluated.
     *
     * `Layout` stores a map of all (property name, `PropertyValue`) pairs for layout properties of a
     * given layer type. It can calculate the possibly-evaluated values for all of them at once, producing a
     * `PossiblyEvaluated` instance for the same set of properties.
     *
     * @private
     */
    var Layout = function Layout(properties                 ) {
        this._properties = properties;
        this._values = (Object.create(properties.defaultPropertyValues)   );
    };

    Layout.prototype.getValue = function getValue (name ) {
        return Util.clone(this._values[name].value);
    };

    Layout.prototype.setValue = function setValue (name , value ) {
        this._values[name] = new PropertyValue(this._values[name].property, value === null ? undefined : Util.clone(value));
    };

    Layout.prototype.serialize = function serialize () {
        var result    = {};
        for (var i = 0, list = Object.keys(this._values); i < list.length; i += 1) {
            var property = list[i];

            var value = this.getValue(property);
            if (value !== undefined) {
                result[property] = value;
            }
        }
        return result;
    };

    Layout.prototype.possiblyEvaluate = function possiblyEvaluate (parameters                    , availableImages              )                         {
        var result = new PossiblyEvaluated(this._properties); // eslint-disable-line no-use-before-define
        for (var i = 0, list = Object.keys(this._values); i < list.length; i += 1) {
            var property = list[i];

            result._values[property] = this._values[property].possiblyEvaluate(parameters, availableImages);
        }
        return result;
    };

    // ------- Transitioning -------

    /**
     * A helper type: given an object type `Properties` whose values are each of type `Property<T, R>`, it calculates
     * an object type with the same keys and values of type `TransitioningPropertyValue<T, R>`.
     *
     * @private
     */


    /**
     * `Transitioning` stores a map of all (property name, `TransitioningPropertyValue`) pairs for paint properties of a
     * given layer type. It can calculate the possibly-evaluated values for all of them at once, producing a
     * `PossiblyEvaluated` instance for the same set of properties.
     *
     * @private
     */
    var Transitioning = function Transitioning(properties) {
        this._properties = properties;
        this._values = (Object.create(properties.defaultTransitioningPropertyValues)   );
    };

    Transitioning.prototype.possiblyEvaluate = function possiblyEvaluate(parameters, availableImages) {
        var result = new PossiblyEvaluated(this._properties); // eslint-disable-line no-use-before-define
        for (var i = 0, list = Object.keys(this._values); i < list.length; i += 1) {
            var property = list[i];

            result._values[property] = this._values[property].possiblyEvaluate(parameters, availableImages);
        }
        return result;
    };

    Transitioning.prototype.hasTransition = function hasTransition() {
        for (var i = 0, list = Object.keys(this._values); i < list.length; i += 1) {
            var property = list[i];

            if (this._values[property].prior) {
                return true;
            }
        }
        return false;
    };

    /**
     * A helper type: given an object type `Properties` whose values are each of type `Property<T, R>`, it calculates
     * an object type with the same keys and values of type `TransitionablePropertyValue<T, R>`.
     *
     * @private
     */


    /**
     * `Transitionable` stores a map of all (property name, `TransitionablePropertyValue`) pairs for paint properties of a
     * given layer type. It can calculate the `TransitioningPropertyValue`s for all of them at once, producing a
     * `Transitioning` instance for the same set of properties.
     *
     * @private
     */
    var Transitionable = function Transitionable(properties) {
        this._properties = properties;
        this._values = (Object.create(properties.defaultTransitionablePropertyValues)   );
    };

    Transitionable.prototype.getValue = function getValue(name) {
        return Util.clone(this._values[name].value.value);
    };

    Transitionable.prototype.setValue = function setValue(name, value) {
        if (!this._values.hasOwnProperty(name)) {
            this._values[name] = new TransitionablePropertyValue(this._values[name].property);
        }
        // Note that we do not _remove_ an own property in the case where a value is being reset
        // to the default: the transition might still be non-default.
        this._values[name].value = new PropertyValue(this._values[name].property, value === null ? undefined : Util.clone(value));
    };

    Transitionable.prototype.getTransition = function getTransition(name) {
        return Util.clone(this._values[name].transition);
    };

    Transitionable.prototype.setTransition = function setTransition(name, value) {
        if (!this._values.hasOwnProperty(name)) {
            this._values[name] = new TransitionablePropertyValue(this._values[name].property);
        }
        this._values[name].transition = Util.clone(value) || undefined;
    };

    Transitionable.prototype.serialize = function serialize() {
        var result = {};
        for (var i = 0, list = Object.keys(this._values); i < list.length; i += 1) {
            var property = list[i];

            var value = this.getValue(property);
            if (value !== undefined) {
                result[property] = value;
            }

            var transition = this.getTransition(property);
            if (transition !== undefined) {
                result[(property + "-transition")] = transition;
            }
        }
        return result;
    };

    Transitionable.prototype.transitioned = function transitioned(parameters, prior) {
        var result = new Transitioning(this._properties); // eslint-disable-line no-use-before-define
        for (var i = 0, list = Object.keys(this._values); i < list.length; i += 1) {
            var property = list[i];

            result._values[property] = this._values[property].transitioned(parameters, prior._values[property]);
        }
        return result;
    };

    Transitionable.prototype.untransitioned = function untransitioned() {
        var result = new Transitioning(this._properties); // eslint-disable-line no-use-before-define
        for (var i = 0, list = Object.keys(this._values); i < list.length; i += 1) {
            var property = list[i];

            result._values[property] = this._values[property].untransitioned();
        }
        return result;
    };

    var TRANSITION_SUFFIX = '-transition';

    function endsWith(string, suffix) {
        return string.indexOf(suffix, string.length - suffix.length) !== -1;
    }

    function StyleLayer(layer, properties) {
        //Evented.call(this);

        this.id = layer.id;
        this.type = layer.type;
    //        this._featureFilter = function () {
    //            return true;
    //        };

        if (layer.type === 'custom') {
            return;
        }

        layer = ((layer));

        this.metadata = layer.metadata;
        this.minzoom = layer.minzoom;
        this.maxzoom = layer.maxzoom;

        if (layer.type !== 'background') {
            this.source = layer.source;
            this.sourceLayer = layer['source-layer'];
            this.filter = layer.filter;
        }

        if (properties.layout) {
            this._unevaluatedLayout = new Layout(properties.layout);
        }

        if (properties.paint) {
            this._transitionablePaint = new Transitionable(properties.paint);

            for (var property in layer.paint) {
                this.setPaintProperty(property, layer.paint[property], {validate: false});
            }
            for (var property$1 in layer.layout) {
                this.setLayoutProperty(property$1, layer.layout[property$1], {validate: false});
            }

            this._transitioningPaint = this._transitionablePaint.untransitioned();
        }
    }

    //    if (Evented) StyleLayer.__proto__ = Evented;
    //    StyleLayer.prototype = Object.create(Evented && Evented.prototype);
    //    StyleLayer.prototype.constructor = StyleLayer;

    StyleLayer.prototype.getCrossfadeParameters = function getCrossfadeParameters() {
        return this._crossfadeParameters;
    };

    StyleLayer.prototype.getLayoutProperty = function getLayoutProperty(name) {
        if (name === 'visibility') {
            return this.visibility;
        }

        return this._unevaluatedLayout.getValue(name);
    };

    StyleLayer.prototype.setLayoutProperty = function setLayoutProperty(name, value, options) {

        if (value !== null && value !== undefined) {
            var key = "layers." + (this.id) + ".layout." + name;
    //            if (this._validate(validateLayoutProperty$1, key, name, value, options)) {
    //                return;
    //            }
        }

        if (name === 'visibility') {
            this.visibility = value;
            return;
        }

        this._unevaluatedLayout.setValue(name, value);
    };

    StyleLayer.prototype.getPaintProperty = function getPaintProperty(name) {
        if (endsWith(name, TRANSITION_SUFFIX)) {
            return this._transitionablePaint.getTransition(name.slice(0, -TRANSITION_SUFFIX.length));
        } else {
            return this._transitionablePaint.getValue(name);
        }
    };

    StyleLayer.prototype.setPaintProperty = function setPaintProperty(name, value, options) {

        if (value !== null && value !== undefined) {
            var key = "layers." + (this.id) + ".paint." + name;
    //            if (this._validate(validatePaintProperty$1, key, name, value, options)) {
    //                return false;
    //            }
        }

        if (endsWith(name, TRANSITION_SUFFIX)) {
            this._transitionablePaint.setTransition(name.slice(0, -TRANSITION_SUFFIX.length), (value     ) || undefined);
            return false;
        } else {
            var transitionable = this._transitionablePaint._values[name];
            var isCrossFadedProperty = transitionable.property.specification["property-type"] === 'cross-faded-data-driven';
            var wasDataDriven = transitionable.value.isDataDriven();
            var oldValue = transitionable.value;

            this._transitionablePaint.setValue(name, value);
            this._handleSpecialPaintPropertyUpdate(name);

            var newValue = this._transitionablePaint._values[name].value;
            var isDataDriven = newValue.isDataDriven();

            // if a cross-faded value is changed, we need to make sure the new icons get added to each tile's iconAtlas
            // so a call to _updateLayer is necessary, and we return true from this function so it gets called in
            // Style#setPaintProperty
            return isDataDriven || wasDataDriven || isCrossFadedProperty || this._handleOverridablePaintPropertyUpdate(name, oldValue, newValue);
        }
    };

    StyleLayer.prototype._handleSpecialPaintPropertyUpdate = function _handleSpecialPaintPropertyUpdate(_) {
        // No-op; can be overridden by derived classes.
    };

    // eslint-disable-next-line no-unused-vars
    StyleLayer.prototype._handleOverridablePaintPropertyUpdate = function _handleOverridablePaintPropertyUpdate(name, oldValue, newValue) {
        // No-op; can be overridden by derived classes.
        return false;
    };

    StyleLayer.prototype.isHidden = function isHidden(zoom) {
        if (this.minzoom && zoom < this.minzoom) {
            return true;
        }
        if (this.maxzoom && zoom >= this.maxzoom) {
            return true;
        }
        return this.visibility === 'none';
    };

    StyleLayer.prototype.updateTransitions = function updateTransitions(parameters) {
        this._transitioningPaint = this._transitionablePaint.transitioned(parameters, this._transitioningPaint);
    };

    StyleLayer.prototype.hasTransition = function hasTransition() {
        return this._transitioningPaint.hasTransition();
    };

    StyleLayer.prototype.recalculate = function recalculate(parameters, availableImages) {
        if (parameters.getCrossfadeParameters) {
            this._crossfadeParameters = parameters.getCrossfadeParameters();
        }

        if (this._unevaluatedLayout) {
            (this).layout = this._unevaluatedLayout.possiblyEvaluate(parameters, availableImages);
        }

        (this).paint = this._transitioningPaint.possiblyEvaluate(parameters, availableImages);
    };

    StyleLayer.prototype.serialize = function serialize() {
        var output = {
            'id': this.id,
            'type': this.type,
            'source': this.source,
            'source-layer': this.sourceLayer,
            'metadata': this.metadata,
            'minzoom': this.minzoom,
            'maxzoom': this.maxzoom,
            'filter': this.filter,
            'layout': this._unevaluatedLayout && this._unevaluatedLayout.serialize(),
            'paint': this._transitionablePaint && this._transitionablePaint.serialize()
        };

        if (this.visibility) {
            output.layout = output.layout || {};
            output.layout.visibility = this.visibility;
        }

        return Util.filterObject(output, function (value, key) {
            return value !== undefined && !(key === 'layout' && !Object.keys(value).length) && !(key === 'paint' && !Object.keys(value).length);
        });
    };

    StyleLayer.prototype._validate = function _validate(validate, key, name, value, options) {
        return true;
    //        if (options === void 0) options = {};
    //
    //        if (options && options.validate === false) {
    //            return false;
    //        }
    //        return emitValidationErrors(this, validate.call(validateStyle, {
    //            key: key,
    //            layerType: this.type,
    //            objectKey: name,
    //            value: value,
    //            styleSpec: spec,
    //            // Workaround for https://github.com/mapbox/mapbox-gl-js/issues/2407
    //            style: {glyphs: true, sprite: true}
    //        }));
    };

    StyleLayer.prototype.is3D = function is3D() {
        return false;
    };

    StyleLayer.prototype.isTileClipped = function isTileClipped() {
        return false;
    };

    StyleLayer.prototype.hasOffscreenPass = function hasOffscreenPass() {
        return false;
    };

    StyleLayer.prototype.resize = function resize() {
        // noop
    };

    StyleLayer.prototype.isStateDependent = function isStateDependent() {
        return true;
    //        for (var property in (this     ).paint._values) {
    //            var value = (this     ).paint.get(property);
    //            if (!(value instanceof PossiblyEvaluatedPropertyValue) || !supportsPropertyExpression(value.property.specification)) {
    //                continue;
    //            }
    //
    //            if ((value.value.kind === 'source' || value.value.kind === 'composite') &&
    //                value.value.isStateDependent) {
    //                return true;
    //            }
    //        }
    //        return false;
    };

    var $version = 8;
    var $root = {
        version: {
            required: true,
            type: "enum",
            values: [
                8
            ]
        },
        name: {
            type: "string"
        },
        metadata: {
            type: "*"
        },
        center: {
            type: "array",
            value: "number"
        },
        zoom: {
            type: "number"
        },
        bearing: {
            type: "number",
            "default": 0,
            period: 360,
            units: "degrees"
        },
        pitch: {
            type: "number",
            "default": 0,
            units: "degrees"
        },
        light: {
            type: "light"
        },
        sources: {
            required: true,
            type: "sources"
        },
        sprite: {
            type: "string"
        },
        glyphs: {
            type: "string"
        },
        transition: {
            type: "transition"
        },
        layers: {
            required: true,
            type: "array",
            value: "layer"
        }
    };
    var sources = {
        "*": {
            type: "source"
        }
    };
    var source = [
        "source_vector",
        "source_raster",
        "source_raster_dem",
        "source_geojson",
        "source_video",
        "source_image"
    ];
    var source_vector = {
        type: {
            required: true,
            type: "enum",
            values: {
                vector: {
                }
            }
        },
        url: {
            type: "string"
        },
        tiles: {
            type: "array",
            value: "string"
        },
        bounds: {
            type: "array",
            value: "number",
            length: 4,
            "default": [
                -180,
                -85.051129,
                180,
                85.051129
            ]
        },
        scheme: {
            type: "enum",
            values: {
                xyz: {
                },
                tms: {
                }
            },
            "default": "xyz"
        },
        minzoom: {
            type: "number",
            "default": 0
        },
        maxzoom: {
            type: "number",
            "default": 22
        },
        attribution: {
            type: "string"
        },
        "*": {
            type: "*"
        }
    };
    var source_raster = {
        type: {
            required: true,
            type: "enum",
            values: {
                raster: {
                }
            }
        },
        url: {
            type: "string"
        },
        tiles: {
            type: "array",
            value: "string"
        },
        bounds: {
            type: "array",
            value: "number",
            length: 4,
            "default": [
                -180,
                -85.051129,
                180,
                85.051129
            ]
        },
        minzoom: {
            type: "number",
            "default": 0
        },
        maxzoom: {
            type: "number",
            "default": 22
        },
        tileSize: {
            type: "number",
            "default": 512,
            units: "pixels"
        },
        scheme: {
            type: "enum",
            values: {
                xyz: {
                },
                tms: {
                }
            },
            "default": "xyz"
        },
        attribution: {
            type: "string"
        },
        "*": {
            type: "*"
        }
    };
    var source_raster_dem = {
        type: {
            required: true,
            type: "enum",
            values: {
                "raster-dem": {
                }
            }
        },
        url: {
            type: "string"
        },
        tiles: {
            type: "array",
            value: "string"
        },
        bounds: {
            type: "array",
            value: "number",
            length: 4,
            "default": [
                -180,
                -85.051129,
                180,
                85.051129
            ]
        },
        minzoom: {
            type: "number",
            "default": 0
        },
        maxzoom: {
            type: "number",
            "default": 22
        },
        tileSize: {
            type: "number",
            "default": 512,
            units: "pixels"
        },
        attribution: {
            type: "string"
        },
        encoding: {
            type: "enum",
            values: {
                terrarium: {
                },
                mapbox: {
                }
            },
            "default": "mapbox"
        },
        "*": {
            type: "*"
        }
    };
    var source_geojson = {
        type: {
            required: true,
            type: "enum",
            values: {
                geojson: {
                }
            }
        },
        data: {
            type: "*"
        },
        maxzoom: {
            type: "number",
            "default": 18
        },
        attribution: {
            type: "string"
        },
        buffer: {
            type: "number",
            "default": 128,
            maximum: 512,
            minimum: 0
        },
        tolerance: {
            type: "number",
            "default": 0.375
        },
        cluster: {
            type: "boolean",
            "default": false
        },
        clusterRadius: {
            type: "number",
            "default": 50,
            minimum: 0
        },
        clusterMaxZoom: {
            type: "number"
        },
        clusterProperties: {
            type: "*"
        },
        lineMetrics: {
            type: "boolean",
            "default": false
        },
        generateId: {
            type: "boolean",
            "default": false
        }
    };
    var source_video = {
        type: {
            required: true,
            type: "enum",
            values: {
                video: {
                }
            }
        },
        urls: {
            required: true,
            type: "array",
            value: "string"
        },
        coordinates: {
            required: true,
            type: "array",
            length: 4,
            value: {
                type: "array",
                length: 2,
                value: "number"
            }
        }
    };
    var source_image = {
        type: {
            required: true,
            type: "enum",
            values: {
                image: {
                }
            }
        },
        url: {
            required: true,
            type: "string"
        },
        coordinates: {
            required: true,
            type: "array",
            length: 4,
            value: {
                type: "array",
                length: 2,
                value: "number"
            }
        }
    };
    var layer = {
        id: {
            type: "string",
            required: true
        },
        type: {
            type: "enum",
            values: {
                fill: {
                },
                line: {
                },
                symbol: {
                },
                circle: {
                },
                heatmap: {
                },
                "fill-extrusion": {
                },
                raster: {
                },
                hillshade: {
                },
                background: {
                }
            },
            required: true
        },
        metadata: {
            type: "*"
        },
        source: {
            type: "string"
        },
        "source-layer": {
            type: "string"
        },
        minzoom: {
            type: "number",
            minimum: 0,
            maximum: 24
        },
        maxzoom: {
            type: "number",
            minimum: 0,
            maximum: 24
        },
        filter: {
            type: "filter"
        },
        layout: {
            type: "layout"
        },
        paint: {
            type: "paint"
        }
    };
    var layout = [
        "layout_fill",
        "layout_line",
        "layout_circle",
        "layout_heatmap",
        "layout_fill-extrusion",
        "layout_symbol",
        "layout_raster",
        "layout_hillshade",
        "layout_background"
    ];
    var layout_background = {
        visibility: {
            type: "enum",
            values: {
                visible: {
                },
                none: {
                }
            },
            "default": "visible",
            "property-type": "constant"
        }
    };
    var layout_fill = {
        "fill-sort-key": {
            type: "number",
            expression: {
                interpolated: false,
                parameters: [
                    "zoom",
                    "feature"
                ]
            },
            "property-type": "data-driven"
        },
        visibility: {
            type: "enum",
            values: {
                visible: {
                },
                none: {
                }
            },
            "default": "visible",
            "property-type": "constant"
        }
    };
    var layout_circle = {
        "circle-sort-key": {
            type: "number",
            expression: {
                interpolated: false,
                parameters: [
                    "zoom",
                    "feature"
                ]
            },
            "property-type": "data-driven"
        },
        visibility: {
            type: "enum",
            values: {
                visible: {
                },
                none: {
                }
            },
            "default": "visible",
            "property-type": "constant"
        }
    };
    var layout_heatmap = {
        visibility: {
            type: "enum",
            values: {
                visible: {
                },
                none: {
                }
            },
            "default": "visible",
            "property-type": "constant"
        }
    };
    var layout_line = {
        "line-cap": {
            type: "enum",
            values: {
                butt: {
                },
                round: {
                },
                square: {
                }
            },
            "default": "butt",
            expression: {
                interpolated: false,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "line-join": {
            type: "enum",
            values: {
                bevel: {
                },
                round: {
                },
                miter: {
                }
            },
            "default": "miter",
            expression: {
                interpolated: false,
                parameters: [
                    "zoom",
                    "feature"
                ]
            },
            "property-type": "data-driven"
        },
        "line-miter-limit": {
            type: "number",
            "default": 2,
            requires: [
                {
                    "line-join": "miter"
                }
            ],
            expression: {
                interpolated: true,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "line-round-limit": {
            type: "number",
            "default": 1.05,
            requires: [
                {
                    "line-join": "round"
                }
            ],
            expression: {
                interpolated: true,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "line-sort-key": {
            type: "number",
            expression: {
                interpolated: false,
                parameters: [
                    "zoom",
                    "feature"
                ]
            },
            "property-type": "data-driven"
        },
        visibility: {
            type: "enum",
            values: {
                visible: {
                },
                none: {
                }
            },
            "default": "visible",
            "property-type": "constant"
        }
    };
    var layout_symbol = {
        "symbol-placement": {
            type: "enum",
            values: {
                point: {
                },
                line: {
                },
                "line-center": {
                }
            },
            "default": "point",
            expression: {
                interpolated: false,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "symbol-spacing": {
            type: "number",
            "default": 250,
            minimum: 1,
            units: "pixels",
            requires: [
                {
                    "symbol-placement": "line"
                }
            ],
            expression: {
                interpolated: true,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "symbol-avoid-edges": {
            type: "boolean",
            "default": false,
            expression: {
                interpolated: false,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "symbol-sort-key": {
            type: "number",
            expression: {
                interpolated: false,
                parameters: [
                    "zoom",
                    "feature"
                ]
            },
            "property-type": "data-driven"
        },
        "symbol-z-order": {
            type: "enum",
            values: {
                auto: {
                },
                "viewport-y": {
                },
                source: {
                }
            },
            "default": "auto",
            expression: {
                interpolated: false,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "icon-allow-overlap": {
            type: "boolean",
            "default": false,
            requires: [
                "icon-image"
            ],
            expression: {
                interpolated: false,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "icon-ignore-placement": {
            type: "boolean",
            "default": false,
            requires: [
                "icon-image"
            ],
            expression: {
                interpolated: false,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "icon-optional": {
            type: "boolean",
            "default": false,
            requires: [
                "icon-image",
                "text-field"
            ],
            expression: {
                interpolated: false,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "icon-rotation-alignment": {
            type: "enum",
            values: {
                map: {
                },
                viewport: {
                },
                auto: {
                }
            },
            "default": "auto",
            requires: [
                "icon-image"
            ],
            expression: {
                interpolated: false,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "icon-size": {
            type: "number",
            "default": 1,
            minimum: 0,
            units: "factor of the original icon size",
            requires: [
                "icon-image"
            ],
            expression: {
                interpolated: true,
                parameters: [
                    "zoom",
                    "feature"
                ]
            },
            "property-type": "data-driven"
        },
        "icon-text-fit": {
            type: "enum",
            values: {
                none: {
                },
                width: {
                },
                height: {
                },
                both: {
                }
            },
            "default": "none",
            requires: [
                "icon-image",
                "text-field"
            ],
            expression: {
                interpolated: false,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "icon-text-fit-padding": {
            type: "array",
            value: "number",
            length: 4,
            "default": [
                0,
                0,
                0,
                0
            ],
            units: "pixels",
            requires: [
                "icon-image",
                "text-field",
                {
                    "icon-text-fit": [
                        "both",
                        "width",
                        "height"
                    ]
                }
            ],
            expression: {
                interpolated: true,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "icon-image": {
            type: "resolvedImage",
            tokens: true,
            expression: {
                interpolated: false,
                parameters: [
                    "zoom",
                    "feature"
                ]
            },
            "property-type": "data-driven"
        },
        "icon-rotate": {
            type: "number",
            "default": 0,
            period: 360,
            units: "degrees",
            requires: [
                "icon-image"
            ],
            expression: {
                interpolated: true,
                parameters: [
                    "zoom",
                    "feature"
                ]
            },
            "property-type": "data-driven"
        },
        "icon-padding": {
            type: "number",
            "default": 2,
            minimum: 0,
            units: "pixels",
            requires: [
                "icon-image"
            ],
            expression: {
                interpolated: true,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "icon-keep-upright": {
            type: "boolean",
            "default": false,
            requires: [
                "icon-image",
                {
                    "icon-rotation-alignment": "map"
                },
                {
                    "symbol-placement": [
                        "line",
                        "line-center"
                    ]
                }
            ],
            expression: {
                interpolated: false,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "icon-offset": {
            type: "array",
            value: "number",
            length: 2,
            "default": [
                0,
                0
            ],
            requires: [
                "icon-image"
            ],
            expression: {
                interpolated: true,
                parameters: [
                    "zoom",
                    "feature"
                ]
            },
            "property-type": "data-driven"
        },
        "icon-anchor": {
            type: "enum",
            values: {
                center: {
                },
                left: {
                },
                right: {
                },
                top: {
                },
                bottom: {
                },
                "top-left": {
                },
                "top-right": {
                },
                "bottom-left": {
                },
                "bottom-right": {
                }
            },
            "default": "center",
            requires: [
                "icon-image"
            ],
            expression: {
                interpolated: false,
                parameters: [
                    "zoom",
                    "feature"
                ]
            },
            "property-type": "data-driven"
        },
        "icon-pitch-alignment": {
            type: "enum",
            values: {
                map: {
                },
                viewport: {
                },
                auto: {
                }
            },
            "default": "auto",
            requires: [
                "icon-image"
            ],
            expression: {
                interpolated: false,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "text-pitch-alignment": {
            type: "enum",
            values: {
                map: {
                },
                viewport: {
                },
                auto: {
                }
            },
            "default": "auto",
            requires: [
                "text-field"
            ],
            expression: {
                interpolated: false,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "text-rotation-alignment": {
            type: "enum",
            values: {
                map: {
                },
                viewport: {
                },
                auto: {
                }
            },
            "default": "auto",
            requires: [
                "text-field"
            ],
            expression: {
                interpolated: false,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "text-field": {
            type: "formatted",
            "default": "",
            tokens: true,
            expression: {
                interpolated: false,
                parameters: [
                    "zoom",
                    "feature"
                ]
            },
            "property-type": "data-driven"
        },
        "text-font": {
            type: "array",
            value: "string",
            "default": [
                "Open Sans Regular",
                "Arial Unicode MS Regular"
            ],
            requires: [
                "text-field"
            ],
            expression: {
                interpolated: false,
                parameters: [
                    "zoom",
                    "feature"
                ]
            },
            "property-type": "data-driven"
        },
        "text-size": {
            type: "number",
            "default": 16,
            minimum: 0,
            units: "pixels",
            requires: [
                "text-field"
            ],
            expression: {
                interpolated: true,
                parameters: [
                    "zoom",
                    "feature"
                ]
            },
            "property-type": "data-driven"
        },
        "text-max-width": {
            type: "number",
            "default": 10,
            minimum: 0,
            units: "ems",
            requires: [
                "text-field"
            ],
            expression: {
                interpolated: true,
                parameters: [
                    "zoom",
                    "feature"
                ]
            },
            "property-type": "data-driven"
        },
        "text-line-height": {
            type: "number",
            "default": 1.2,
            units: "ems",
            requires: [
                "text-field"
            ],
            expression: {
                interpolated: true,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "text-letter-spacing": {
            type: "number",
            "default": 0,
            units: "ems",
            requires: [
                "text-field"
            ],
            expression: {
                interpolated: true,
                parameters: [
                    "zoom",
                    "feature"
                ]
            },
            "property-type": "data-driven"
        },
        "text-justify": {
            type: "enum",
            values: {
                auto: {
                },
                left: {
                },
                center: {
                },
                right: {
                }
            },
            "default": "center",
            requires: [
                "text-field"
            ],
            expression: {
                interpolated: false,
                parameters: [
                    "zoom",
                    "feature"
                ]
            },
            "property-type": "data-driven"
        },
        "text-radial-offset": {
            type: "number",
            units: "ems",
            "default": 0,
            requires: [
                "text-field"
            ],
            "property-type": "data-driven",
            expression: {
                interpolated: true,
                parameters: [
                    "zoom",
                    "feature"
                ]
            }
        },
        "text-variable-anchor": {
            type: "array",
            value: "enum",
            values: {
                center: {
                },
                left: {
                },
                right: {
                },
                top: {
                },
                bottom: {
                },
                "top-left": {
                },
                "top-right": {
                },
                "bottom-left": {
                },
                "bottom-right": {
                }
            },
            requires: [
                "text-field",
                {
                    "symbol-placement": [
                        "point"
                    ]
                }
            ],
            expression: {
                interpolated: false,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "text-anchor": {
            type: "enum",
            values: {
                center: {
                },
                left: {
                },
                right: {
                },
                top: {
                },
                bottom: {
                },
                "top-left": {
                },
                "top-right": {
                },
                "bottom-left": {
                },
                "bottom-right": {
                }
            },
            "default": "center",
            requires: [
                "text-field",
                {
                    "!": "text-variable-anchor"
                }
            ],
            expression: {
                interpolated: false,
                parameters: [
                    "zoom",
                    "feature"
                ]
            },
            "property-type": "data-driven"
        },
        "text-max-angle": {
            type: "number",
            "default": 45,
            units: "degrees",
            requires: [
                "text-field",
                {
                    "symbol-placement": [
                        "line",
                        "line-center"
                    ]
                }
            ],
            expression: {
                interpolated: true,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "text-writing-mode": {
            type: "array",
            value: "enum",
            values: {
                horizontal: {
                },
                vertical: {
                }
            },
            requires: [
                "text-field",
                {
                    "symbol-placement": [
                        "point"
                    ]
                }
            ],
            expression: {
                interpolated: false,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "text-rotate": {
            type: "number",
            "default": 0,
            period: 360,
            units: "degrees",
            requires: [
                "text-field"
            ],
            expression: {
                interpolated: true,
                parameters: [
                    "zoom",
                    "feature"
                ]
            },
            "property-type": "data-driven"
        },
        "text-padding": {
            type: "number",
            "default": 2,
            minimum: 0,
            units: "pixels",
            requires: [
                "text-field"
            ],
            expression: {
                interpolated: true,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "text-keep-upright": {
            type: "boolean",
            "default": true,
            requires: [
                "text-field",
                {
                    "text-rotation-alignment": "map"
                },
                {
                    "symbol-placement": [
                        "line",
                        "line-center"
                    ]
                }
            ],
            expression: {
                interpolated: false,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "text-transform": {
            type: "enum",
            values: {
                none: {
                },
                uppercase: {
                },
                lowercase: {
                }
            },
            "default": "none",
            requires: [
                "text-field"
            ],
            expression: {
                interpolated: false,
                parameters: [
                    "zoom",
                    "feature"
                ]
            },
            "property-type": "data-driven"
        },
        "text-offset": {
            type: "array",
            value: "number",
            units: "ems",
            length: 2,
            "default": [
                0,
                0
            ],
            requires: [
                "text-field",
                {
                    "!": "text-radial-offset"
                }
            ],
            expression: {
                interpolated: true,
                parameters: [
                    "zoom",
                    "feature"
                ]
            },
            "property-type": "data-driven"
        },
        "text-allow-overlap": {
            type: "boolean",
            "default": false,
            requires: [
                "text-field"
            ],
            expression: {
                interpolated: false,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "text-ignore-placement": {
            type: "boolean",
            "default": false,
            requires: [
                "text-field"
            ],
            expression: {
                interpolated: false,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "text-optional": {
            type: "boolean",
            "default": false,
            requires: [
                "text-field",
                "icon-image"
            ],
            expression: {
                interpolated: false,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        visibility: {
            type: "enum",
            values: {
                visible: {
                },
                none: {
                }
            },
            "default": "visible",
            "property-type": "constant"
        }
    };
    var layout_raster = {
        visibility: {
            type: "enum",
            values: {
                visible: {
                },
                none: {
                }
            },
            "default": "visible",
            "property-type": "constant"
        }
    };
    var layout_hillshade = {
        visibility: {
            type: "enum",
            values: {
                visible: {
                },
                none: {
                }
            },
            "default": "visible",
            "property-type": "constant"
        }
    };
    var filter = {
        type: "array",
        value: "*"
    };
    var filter_operator = {
        type: "enum",
        values: {
            "==": {
            },
            "!=": {
            },
            ">": {
            },
            ">=": {
            },
            "<": {
            },
            "<=": {
            },
            "in": {
            },
            "!in": {
            },
            all: {
            },
            any: {
            },
            none: {
            },
            has: {
            },
            "!has": {
            }
        }
    };
    var geometry_type = {
        type: "enum",
        values: {
            Point: {
            },
            LineString: {
            },
            Polygon: {
            }
        }
    };
    var function_stop = {
        type: "array",
        minimum: 0,
        maximum: 24,
        value: [
            "number",
            "color"
        ],
        length: 2
    };
    var expression = {
        type: "array",
        value: "*",
        minimum: 1
    };
    var expression_name = {
        type: "enum",
        values: {
            "let": {
                group: "Variable binding"
            },
            "var": {
                group: "Variable binding"
            },
            literal: {
                group: "Types"
            },
            array: {
                group: "Types"
            },
            at: {
                group: "Lookup"
            },
            "in": {
                group: "Lookup"
            },
            "case": {
                group: "Decision"
            },
            match: {
                group: "Decision"
            },
            coalesce: {
                group: "Decision"
            },
            step: {
                group: "Ramps, scales, curves"
            },
            interpolate: {
                group: "Ramps, scales, curves"
            },
            "interpolate-hcl": {
                group: "Ramps, scales, curves"
            },
            "interpolate-lab": {
                group: "Ramps, scales, curves"
            },
            ln2: {
                group: "Math"
            },
            pi: {
                group: "Math"
            },
            e: {
                group: "Math"
            },
            "typeof": {
                group: "Types"
            },
            string: {
                group: "Types"
            },
            number: {
                group: "Types"
            },
            boolean: {
                group: "Types"
            },
            object: {
                group: "Types"
            },
            collator: {
                group: "Types"
            },
            format: {
                group: "Types"
            },
            image: {
                group: "Types"
            },
            "number-format": {
                group: "Types"
            },
            "to-string": {
                group: "Types"
            },
            "to-number": {
                group: "Types"
            },
            "to-boolean": {
                group: "Types"
            },
            "to-rgba": {
                group: "Color"
            },
            "to-color": {
                group: "Types"
            },
            rgb: {
                group: "Color"
            },
            rgba: {
                group: "Color"
            },
            get: {
                group: "Lookup"
            },
            has: {
                group: "Lookup"
            },
            length: {
                group: "Lookup"
            },
            properties: {
                group: "Feature data"
            },
            "feature-state": {
                group: "Feature data"
            },
            "geometry-type": {
                group: "Feature data"
            },
            id: {
                group: "Feature data"
            },
            zoom: {
                group: "Zoom"
            },
            "heatmap-density": {
                group: "Heatmap"
            },
            "line-progress": {
                group: "Feature data"
            },
            accumulated: {
                group: "Feature data"
            },
            "+": {
                group: "Math"
            },
            "*": {
                group: "Math"
            },
            "-": {
                group: "Math"
            },
            "/": {
                group: "Math"
            },
            "%": {
                group: "Math"
            },
            "^": {
                group: "Math"
            },
            sqrt: {
                group: "Math"
            },
            log10: {
                group: "Math"
            },
            ln: {
                group: "Math"
            },
            log2: {
                group: "Math"
            },
            sin: {
                group: "Math"
            },
            cos: {
                group: "Math"
            },
            tan: {
                group: "Math"
            },
            asin: {
                group: "Math"
            },
            acos: {
                group: "Math"
            },
            atan: {
                group: "Math"
            },
            min: {
                group: "Math"
            },
            max: {
                group: "Math"
            },
            round: {
                group: "Math"
            },
            abs: {
                group: "Math"
            },
            ceil: {
                group: "Math"
            },
            floor: {
                group: "Math"
            },
            "==": {
                group: "Decision"
            },
            "!=": {
                group: "Decision"
            },
            ">": {
                group: "Decision"
            },
            "<": {
                group: "Decision"
            },
            ">=": {
                group: "Decision"
            },
            "<=": {
                group: "Decision"
            },
            all: {
                group: "Decision"
            },
            any: {
                group: "Decision"
            },
            "!": {
                group: "Decision"
            },
            "is-supported-script": {
                group: "String"
            },
            upcase: {
                group: "String"
            },
            downcase: {
                group: "String"
            },
            concat: {
                group: "String"
            },
            "resolved-locale": {
                group: "String"
            }
        }
    };
    var light = {
        anchor: {
            type: "enum",
            "default": "viewport",
            values: {
                map: {
                },
                viewport: {
                }
            },
            "property-type": "data-constant",
            transition: false,
            expression: {
                interpolated: false,
                parameters: [
                    "zoom"
                ]
            }
        },
        position: {
            type: "array",
            "default": [
                1.15,
                210,
                30
            ],
            length: 3,
            value: "number",
            "property-type": "data-constant",
            transition: true,
            expression: {
                interpolated: true,
                parameters: [
                    "zoom"
                ]
            }
        },
        color: {
            type: "color",
            "property-type": "data-constant",
            "default": "#ffffff",
            expression: {
                interpolated: true,
                parameters: [
                    "zoom"
                ]
            },
            transition: true
        },
        intensity: {
            type: "number",
            "property-type": "data-constant",
            "default": 0.5,
            minimum: 0,
            maximum: 1,
            expression: {
                interpolated: true,
                parameters: [
                    "zoom"
                ]
            },
            transition: true
        }
    };
    var paint = [
        "paint_fill",
        "paint_line",
        "paint_circle",
        "paint_heatmap",
        "paint_fill-extrusion",
        "paint_symbol",
        "paint_raster",
        "paint_hillshade",
        "paint_background"
    ];
    var paint_fill = {
        "fill-antialias": {
            type: "boolean",
            "default": true,
            expression: {
                interpolated: false,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "fill-opacity": {
            type: "number",
            "default": 1,
            minimum: 0,
            maximum: 1,
            transition: true,
            expression: {
                interpolated: true,
                parameters: [
                    "zoom",
                    "feature",
                    "feature-state"
                ]
            },
            "property-type": "data-driven"
        },
        "fill-color": {
            type: "color",
            "default": "#000000",
            transition: true,
            requires: [
                {
                    "!": "fill-pattern"
                }
            ],
            expression: {
                interpolated: true,
                parameters: [
                    "zoom",
                    "feature",
                    "feature-state"
                ]
            },
            "property-type": "data-driven"
        },
        "fill-outline-color": {
            type: "color",
            transition: true,
            requires: [
                {
                    "!": "fill-pattern"
                },
                {
                    "fill-antialias": true
                }
            ],
            expression: {
                interpolated: true,
                parameters: [
                    "zoom",
                    "feature",
                    "feature-state"
                ]
            },
            "property-type": "data-driven"
        },
        "fill-translate": {
            type: "array",
            value: "number",
            length: 2,
            "default": [
                0,
                0
            ],
            transition: true,
            units: "pixels",
            expression: {
                interpolated: true,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "fill-translate-anchor": {
            type: "enum",
            values: {
                map: {
                },
                viewport: {
                }
            },
            "default": "map",
            requires: [
                "fill-translate"
            ],
            expression: {
                interpolated: false,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "fill-pattern": {
            type: "resolvedImage",
            transition: true,
            expression: {
                interpolated: false,
                parameters: [
                    "zoom",
                    "feature"
                ]
            },
            "property-type": "cross-faded-data-driven"
        }
    };
    var paint_line = {
        "line-opacity": {
            type: "number",
            "default": 1,
            minimum: 0,
            maximum: 1,
            transition: true,
            expression: {
                interpolated: true,
                parameters: [
                    "zoom",
                    "feature",
                    "feature-state"
                ]
            },
            "property-type": "data-driven"
        },
        "line-color": {
            type: "color",
            "default": "#000000",
            transition: true,
            requires: [
                {
                    "!": "line-pattern"
                }
            ],
            expression: {
                interpolated: true,
                parameters: [
                    "zoom",
                    "feature",
                    "feature-state"
                ]
            },
            "property-type": "data-driven"
        },
        "line-translate": {
            type: "array",
            value: "number",
            length: 2,
            "default": [
                0,
                0
            ],
            transition: true,
            units: "pixels",
            expression: {
                interpolated: true,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "line-translate-anchor": {
            type: "enum",
            values: {
                map: {
                },
                viewport: {
                }
            },
            "default": "map",
            requires: [
                "line-translate"
            ],
            expression: {
                interpolated: false,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "line-width": {
            type: "number",
            "default": 1,
            minimum: 0,
            transition: true,
            units: "pixels",
            expression: {
                interpolated: true,
                parameters: [
                    "zoom",
                    "feature",
                    "feature-state"
                ]
            },
            "property-type": "data-driven"
        },
        "line-gap-width": {
            type: "number",
            "default": 0,
            minimum: 0,
            transition: true,
            units: "pixels",
            expression: {
                interpolated: true,
                parameters: [
                    "zoom",
                    "feature",
                    "feature-state"
                ]
            },
            "property-type": "data-driven"
        },
        "line-offset": {
            type: "number",
            "default": 0,
            transition: true,
            units: "pixels",
            expression: {
                interpolated: true,
                parameters: [
                    "zoom",
                    "feature",
                    "feature-state"
                ]
            },
            "property-type": "data-driven"
        },
        "line-blur": {
            type: "number",
            "default": 0,
            minimum: 0,
            transition: true,
            units: "pixels",
            expression: {
                interpolated: true,
                parameters: [
                    "zoom",
                    "feature",
                    "feature-state"
                ]
            },
            "property-type": "data-driven"
        },
        "line-dasharray": {
            type: "array",
            value: "number",
            minimum: 0,
            transition: true,
            units: "line widths",
            requires: [
                {
                    "!": "line-pattern"
                }
            ],
            expression: {
                interpolated: false,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "cross-faded"
        },
        "line-pattern": {
            type: "resolvedImage",
            transition: true,
            expression: {
                interpolated: false,
                parameters: [
                    "zoom",
                    "feature"
                ]
            },
            "property-type": "cross-faded-data-driven"
        },
        "line-gradient": {
            type: "color",
            transition: false,
            requires: [
                {
                    "!": "line-dasharray"
                },
                {
                    "!": "line-pattern"
                },
                {
                    source: "geojson",
                    has: {
                        lineMetrics: true
                    }
                }
            ],
            expression: {
                interpolated: true,
                parameters: [
                    "line-progress"
                ]
            },
            "property-type": "color-ramp"
        }
    };
    var paint_circle = {
        "circle-radius": {
            type: "number",
            "default": 5,
            minimum: 0,
            transition: true,
            units: "pixels",
            expression: {
                interpolated: true,
                parameters: [
                    "zoom",
                    "feature",
                    "feature-state"
                ]
            },
            "property-type": "data-driven"
        },
        "circle-color": {
            type: "color",
            "default": "#000000",
            transition: true,
            expression: {
                interpolated: true,
                parameters: [
                    "zoom",
                    "feature",
                    "feature-state"
                ]
            },
            "property-type": "data-driven"
        },
        "circle-blur": {
            type: "number",
            "default": 0,
            transition: true,
            expression: {
                interpolated: true,
                parameters: [
                    "zoom",
                    "feature",
                    "feature-state"
                ]
            },
            "property-type": "data-driven"
        },
        "circle-opacity": {
            type: "number",
            "default": 1,
            minimum: 0,
            maximum: 1,
            transition: true,
            expression: {
                interpolated: true,
                parameters: [
                    "zoom",
                    "feature",
                    "feature-state"
                ]
            },
            "property-type": "data-driven"
        },
        "circle-translate": {
            type: "array",
            value: "number",
            length: 2,
            "default": [
                0,
                0
            ],
            transition: true,
            units: "pixels",
            expression: {
                interpolated: true,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "circle-translate-anchor": {
            type: "enum",
            values: {
                map: {
                },
                viewport: {
                }
            },
            "default": "map",
            requires: [
                "circle-translate"
            ],
            expression: {
                interpolated: false,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "circle-pitch-scale": {
            type: "enum",
            values: {
                map: {
                },
                viewport: {
                }
            },
            "default": "map",
            expression: {
                interpolated: false,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "circle-pitch-alignment": {
            type: "enum",
            values: {
                map: {
                },
                viewport: {
                }
            },
            "default": "viewport",
            expression: {
                interpolated: false,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "circle-stroke-width": {
            type: "number",
            "default": 0,
            minimum: 0,
            transition: true,
            units: "pixels",
            expression: {
                interpolated: true,
                parameters: [
                    "zoom",
                    "feature",
                    "feature-state"
                ]
            },
            "property-type": "data-driven"
        },
        "circle-stroke-color": {
            type: "color",
            "default": "#000000",
            transition: true,
            expression: {
                interpolated: true,
                parameters: [
                    "zoom",
                    "feature",
                    "feature-state"
                ]
            },
            "property-type": "data-driven"
        },
        "circle-stroke-opacity": {
            type: "number",
            "default": 1,
            minimum: 0,
            maximum: 1,
            transition: true,
            expression: {
                interpolated: true,
                parameters: [
                    "zoom",
                    "feature",
                    "feature-state"
                ]
            },
            "property-type": "data-driven"
        }
    };
    var paint_heatmap = {
        "heatmap-radius": {
            type: "number",
            "default": 30,
            minimum: 1,
            transition: true,
            units: "pixels",
            expression: {
                interpolated: true,
                parameters: [
                    "zoom",
                    "feature",
                    "feature-state"
                ]
            },
            "property-type": "data-driven"
        },
        "heatmap-weight": {
            type: "number",
            "default": 1,
            minimum: 0,
            transition: false,
            expression: {
                interpolated: true,
                parameters: [
                    "zoom",
                    "feature",
                    "feature-state"
                ]
            },
            "property-type": "data-driven"
        },
        "heatmap-intensity": {
            type: "number",
            "default": 1,
            minimum: 0,
            transition: true,
            expression: {
                interpolated: true,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "heatmap-color": {
            type: "color",
            "default": [
                "interpolate",
                [
                    "linear"
                ],
                [
                    "heatmap-density"
                ],
                0,
                "rgba(0, 0, 255, 0)",
                0.1,
                "royalblue",
                0.3,
                "cyan",
                0.5,
                "lime",
                0.7,
                "yellow",
                1,
                "red"
            ],
            transition: false,
            expression: {
                interpolated: true,
                parameters: [
                    "heatmap-density"
                ]
            },
            "property-type": "color-ramp"
        },
        "heatmap-opacity": {
            type: "number",
            "default": 1,
            minimum: 0,
            maximum: 1,
            transition: true,
            expression: {
                interpolated: true,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        }
    };
    var paint_symbol = {
        "icon-opacity": {
            type: "number",
            "default": 1,
            minimum: 0,
            maximum: 1,
            transition: true,
            requires: [
                "icon-image"
            ],
            expression: {
                interpolated: true,
                parameters: [
                    "zoom",
                    "feature",
                    "feature-state"
                ]
            },
            "property-type": "data-driven"
        },
        "icon-color": {
            type: "color",
            "default": "#000000",
            transition: true,
            requires: [
                "icon-image"
            ],
            expression: {
                interpolated: true,
                parameters: [
                    "zoom",
                    "feature",
                    "feature-state"
                ]
            },
            "property-type": "data-driven"
        },
        "icon-halo-color": {
            type: "color",
            "default": "rgba(0, 0, 0, 0)",
            transition: true,
            requires: [
                "icon-image"
            ],
            expression: {
                interpolated: true,
                parameters: [
                    "zoom",
                    "feature",
                    "feature-state"
                ]
            },
            "property-type": "data-driven"
        },
        "icon-halo-width": {
            type: "number",
            "default": 0,
            minimum: 0,
            transition: true,
            units: "pixels",
            requires: [
                "icon-image"
            ],
            expression: {
                interpolated: true,
                parameters: [
                    "zoom",
                    "feature",
                    "feature-state"
                ]
            },
            "property-type": "data-driven"
        },
        "icon-halo-blur": {
            type: "number",
            "default": 0,
            minimum: 0,
            transition: true,
            units: "pixels",
            requires: [
                "icon-image"
            ],
            expression: {
                interpolated: true,
                parameters: [
                    "zoom",
                    "feature",
                    "feature-state"
                ]
            },
            "property-type": "data-driven"
        },
        "icon-translate": {
            type: "array",
            value: "number",
            length: 2,
            "default": [
                0,
                0
            ],
            transition: true,
            units: "pixels",
            requires: [
                "icon-image"
            ],
            expression: {
                interpolated: true,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "icon-translate-anchor": {
            type: "enum",
            values: {
                map: {
                },
                viewport: {
                }
            },
            "default": "map",
            requires: [
                "icon-image",
                "icon-translate"
            ],
            expression: {
                interpolated: false,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "text-opacity": {
            type: "number",
            "default": 1,
            minimum: 0,
            maximum: 1,
            transition: true,
            requires: [
                "text-field"
            ],
            expression: {
                interpolated: true,
                parameters: [
                    "zoom",
                    "feature",
                    "feature-state"
                ]
            },
            "property-type": "data-driven"
        },
        "text-color": {
            type: "color",
            "default": "#000000",
            transition: true,
            overridable: true,
            requires: [
                "text-field"
            ],
            expression: {
                interpolated: true,
                parameters: [
                    "zoom",
                    "feature",
                    "feature-state"
                ]
            },
            "property-type": "data-driven"
        },
        "text-halo-color": {
            type: "color",
            "default": "rgba(0, 0, 0, 0)",
            transition: true,
            requires: [
                "text-field"
            ],
            expression: {
                interpolated: true,
                parameters: [
                    "zoom",
                    "feature",
                    "feature-state"
                ]
            },
            "property-type": "data-driven"
        },
        "text-halo-width": {
            type: "number",
            "default": 0,
            minimum: 0,
            transition: true,
            units: "pixels",
            requires: [
                "text-field"
            ],
            expression: {
                interpolated: true,
                parameters: [
                    "zoom",
                    "feature",
                    "feature-state"
                ]
            },
            "property-type": "data-driven"
        },
        "text-halo-blur": {
            type: "number",
            "default": 0,
            minimum: 0,
            transition: true,
            units: "pixels",
            requires: [
                "text-field"
            ],
            expression: {
                interpolated: true,
                parameters: [
                    "zoom",
                    "feature",
                    "feature-state"
                ]
            },
            "property-type": "data-driven"
        },
        "text-translate": {
            type: "array",
            value: "number",
            length: 2,
            "default": [
                0,
                0
            ],
            transition: true,
            units: "pixels",
            requires: [
                "text-field"
            ],
            expression: {
                interpolated: true,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "text-translate-anchor": {
            type: "enum",
            values: {
                map: {
                },
                viewport: {
                }
            },
            "default": "map",
            requires: [
                "text-field",
                "text-translate"
            ],
            expression: {
                interpolated: false,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        }
    };
    var paint_raster = {
        "raster-opacity": {
            type: "number",
            "default": 1,
            minimum: 0,
            maximum: 1,
            transition: true,
            expression: {
                interpolated: true,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "raster-hue-rotate": {
            type: "number",
            "default": 0,
            period: 360,
            transition: true,
            units: "degrees",
            expression: {
                interpolated: true,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "raster-brightness-min": {
            type: "number",
            "default": 0,
            minimum: 0,
            maximum: 1,
            transition: true,
            expression: {
                interpolated: true,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "raster-brightness-max": {
            type: "number",
            "default": 1,
            minimum: 0,
            maximum: 1,
            transition: true,
            expression: {
                interpolated: true,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "raster-saturation": {
            type: "number",
            "default": 0,
            minimum: -1,
            maximum: 1,
            transition: true,
            expression: {
                interpolated: true,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "raster-contrast": {
            type: "number",
            "default": 0,
            minimum: -1,
            maximum: 1,
            transition: true,
            expression: {
                interpolated: true,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "raster-resampling": {
            type: "enum",
            values: {
                linear: {
                },
                nearest: {
                }
            },
            "default": "linear",
            expression: {
                interpolated: false,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "raster-fade-duration": {
            type: "number",
            "default": 300,
            minimum: 0,
            transition: false,
            units: "milliseconds",
            expression: {
                interpolated: true,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        }
    };
    var paint_hillshade = {
        "hillshade-illumination-direction": {
            type: "number",
            "default": 335,
            minimum: 0,
            maximum: 359,
            transition: false,
            expression: {
                interpolated: true,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "hillshade-illumination-anchor": {
            type: "enum",
            values: {
                map: {
                },
                viewport: {
                }
            },
            "default": "viewport",
            expression: {
                interpolated: false,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "hillshade-exaggeration": {
            type: "number",
            "default": 0.5,
            minimum: 0,
            maximum: 1,
            transition: true,
            expression: {
                interpolated: true,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "hillshade-shadow-color": {
            type: "color",
            "default": "#000000",
            transition: true,
            expression: {
                interpolated: true,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "hillshade-highlight-color": {
            type: "color",
            "default": "#FFFFFF",
            transition: true,
            expression: {
                interpolated: true,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "hillshade-accent-color": {
            type: "color",
            "default": "#000000",
            transition: true,
            expression: {
                interpolated: true,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        }
    };
    var paint_background = {
        "background-color": {
            type: "color",
            "default": "#000000",
            transition: true,
            requires: [
                {
                    "!": "background-pattern"
                }
            ],
            expression: {
                interpolated: true,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "background-pattern": {
            type: "resolvedImage",
            transition: true,
            expression: {
                interpolated: false,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "cross-faded"
        },
        "background-opacity": {
            type: "number",
            "default": 1,
            minimum: 0,
            maximum: 1,
            transition: true,
            expression: {
                interpolated: true,
                parameters: [
                    "zoom"
                ]
            },
            "property-type": "data-constant"
        }
    };
    var transition = {
        duration: {
            type: "number",
            "default": 300,
            minimum: 0,
            units: "milliseconds"
        },
        delay: {
            type: "number",
            "default": 0,
            minimum: 0,
            units: "milliseconds"
        }
    };

    var StyleSpec = {
        $version: $version,
        $root: $root,
        sources: sources,
        source: source,
        source_vector: source_vector,
        source_raster: source_raster,
        source_raster_dem: source_raster_dem,
        source_geojson: source_geojson,
        source_video: source_video,
        source_image: source_image,
        layer: layer,
        layout: layout,
        layout_background: layout_background,
        layout_fill: layout_fill,
        layout_circle: layout_circle,
        layout_heatmap: layout_heatmap,
        "layout_fill-extrusion": {
            visibility: {
                type: "enum",
                values: {
                    visible: {
                    },
                    none: {
                    }
                },
                "default": "visible",
                "property-type": "constant"
            }
        },
        layout_line: layout_line,
        layout_symbol: layout_symbol,
        layout_raster: layout_raster,
        layout_hillshade: layout_hillshade,
        filter: filter,
        filter_operator: filter_operator,
        geometry_type: geometry_type,
        "function": {
            expression: {
                type: "expression"
            },
            stops: {
                type: "array",
                value: "function_stop"
            },
            base: {
                type: "number",
                "default": 1,
                minimum: 0
            },
            property: {
                type: "string",
                "default": "$zoom"
            },
            type: {
                type: "enum",
                values: {
                    identity: {
                    },
                    exponential: {
                    },
                    interval: {
                    },
                    categorical: {
                    }
                },
                "default": "exponential"
            },
            colorSpace: {
                type: "enum",
                values: {
                    rgb: {
                    },
                    lab: {
                    },
                    hcl: {
                    }
                },
                "default": "rgb"
            },
            "default": {
                type: "*",
                required: false
            }
        },
        function_stop: function_stop,
        expression: expression,
        expression_name: expression_name,
        light: light,
        paint: paint,
        paint_fill: paint_fill,
        "paint_fill-extrusion": {
            "fill-extrusion-opacity": {
                type: "number",
                "default": 1,
                minimum: 0,
                maximum: 1,
                transition: true,
                expression: {
                    interpolated: true,
                    parameters: [
                        "zoom"
                    ]
                },
                "property-type": "data-constant"
            },
            "fill-extrusion-color": {
                type: "color",
                "default": "#000000",
                transition: true,
                requires: [
                    {
                        "!": "fill-extrusion-pattern"
                    }
                ],
                expression: {
                    interpolated: true,
                    parameters: [
                        "zoom",
                        "feature",
                        "feature-state"
                    ]
                },
                "property-type": "data-driven"
            },
            "fill-extrusion-translate": {
                type: "array",
                value: "number",
                length: 2,
                "default": [
                    0,
                    0
                ],
                transition: true,
                units: "pixels",
                expression: {
                    interpolated: true,
                    parameters: [
                        "zoom"
                    ]
                },
                "property-type": "data-constant"
            },
            "fill-extrusion-translate-anchor": {
                type: "enum",
                values: {
                    map: {
                    },
                    viewport: {
                    }
                },
                "default": "map",
                requires: [
                    "fill-extrusion-translate"
                ],
                expression: {
                    interpolated: false,
                    parameters: [
                        "zoom"
                    ]
                },
                "property-type": "data-constant"
            },
            "fill-extrusion-pattern": {
                type: "resolvedImage",
                transition: true,
                expression: {
                    interpolated: false,
                    parameters: [
                        "zoom",
                        "feature"
                    ]
                },
                "property-type": "cross-faded-data-driven"
            },
            "fill-extrusion-height": {
                type: "number",
                "default": 0,
                minimum: 0,
                units: "meters",
                transition: true,
                expression: {
                    interpolated: true,
                    parameters: [
                        "zoom",
                        "feature",
                        "feature-state"
                    ]
                },
                "property-type": "data-driven"
            },
            "fill-extrusion-base": {
                type: "number",
                "default": 0,
                minimum: 0,
                units: "meters",
                transition: true,
                requires: [
                    "fill-extrusion-height"
                ],
                expression: {
                    interpolated: true,
                    parameters: [
                        "zoom",
                        "feature",
                        "feature-state"
                    ]
                },
                "property-type": "data-driven"
            },
            "fill-extrusion-vertical-gradient": {
                type: "boolean",
                "default": true,
                transition: false,
                expression: {
                    interpolated: false,
                    parameters: [
                        "zoom"
                    ]
                },
                "property-type": "data-constant"
            }
        },
        paint_line: paint_line,
        paint_circle: paint_circle,
        paint_heatmap: paint_heatmap,
        paint_symbol: paint_symbol,
        paint_raster: paint_raster,
        paint_hillshade: paint_hillshade,
        paint_background: paint_background,
        transition: transition,
        "property-type": {
            "data-driven": {
                type: "property-type"
            },
            "cross-faded": {
                type: "property-type"
            },
            "cross-faded-data-driven": {
                type: "property-type"
            },
            "color-ramp": {
                type: "property-type"
            },
            "data-constant": {
                type: "property-type"
            },
            constant: {
                type: "property-type"
            }
        }
    };

    function IntersectionTest() {
    }

    IntersectionTest.polygonIntersectsPolygon = function (polygonA, polygonB) {
        for (var i = 0; i < polygonA.length; i++) {
            if (polygonContainsPoint(polygonB, polygonA[i])) {
                return true;
            }
        }

        for (var i$1 = 0; i$1 < polygonB.length; i$1++) {
            if (polygonContainsPoint(polygonA, polygonB[i$1])) {
                return true;
            }
        }

        if (lineIntersectsLine(polygonA, polygonB)) {
            return true;
        }

        return false;
    };

    IntersectionTest.polygonIntersectsBufferedPoint = function (polygon, point, radius) {
        if (polygonContainsPoint(polygon, point)) {
            return true;
        }
        if (pointIntersectsBufferedLine(point, polygon, radius)) {
            return true;
        }
        return false;
    };

    IntersectionTest.polygonIntersectsMultiPolygon = function (polygon, multiPolygon) {
        if (polygon.length === 1) {
            return multiPolygonContainsPoint(multiPolygon, polygon[0]);
        }

        for (var m = 0; m < multiPolygon.length; m++) {
            var ring = multiPolygon[m];
            for (var n = 0; n < ring.length; n++) {
                if (polygonContainsPoint(polygon, ring[n])) {
                    return true;
                }
            }
        }

        for (var i = 0; i < polygon.length; i++) {
            if (multiPolygonContainsPoint(multiPolygon, polygon[i])) {
                return true;
            }
        }

        for (var k = 0; k < multiPolygon.length; k++) {
            if (lineIntersectsLine(polygon, multiPolygon[k])) {
                return true;
            }
        }

        return false;
    };

    IntersectionTest.polygonIntersectsBufferedMultiLine = function (polygon, multiLine, radius) {
        for (var i = 0; i < multiLine.length; i++) {
            var line = multiLine[i];

            if (polygon.length >= 3) {
                for (var k = 0; k < line.length; k++) {
                    if (polygonContainsPoint(polygon, line[k])) {
                        return true;
                    }
                }
            }

            if (lineIntersectsBufferedLine(polygon, line, radius)) {
                return true;
            }
        }
        return false;
    };

    function lineIntersectsBufferedLine(lineA, lineB, radius) {

        if (lineA.length > 1) {
            if (lineIntersectsLine(lineA, lineB)) {
                return true;
            }

            // Check whether any point in either line is within radius of the other line
            for (var j = 0; j < lineB.length; j++) {
                if (pointIntersectsBufferedLine(lineB[j], lineA, radius)) {
                    return true;
                }
            }
        }

        for (var k = 0; k < lineA.length; k++) {
            if (pointIntersectsBufferedLine(lineA[k], lineB, radius)) {
                return true;
            }
        }

        return false;
    }

    function lineIntersectsLine(lineA, lineB) {
        if (lineA.length === 0 || lineB.length === 0) {
            return false;
        }
        for (var i = 0; i < lineA.length - 1; i++) {
            var a0 = lineA[i];
            var a1 = lineA[i + 1];
            for (var j = 0; j < lineB.length - 1; j++) {
                var b0 = lineB[j];
                var b1 = lineB[j + 1];
                if (lineSegmentIntersectsLineSegment(a0, a1, b0, b1)) {
                    return true;
                }
            }
        }
        return false;
    }

    function lineSegmentIntersectsLineSegment(a0, a1, b0, b1) {
        return Util.isCounterClockwise(a0, b0, b1) !== Util.isCounterClockwise(a1, b0, b1) &&
            Util.isCounterClockwise(a0, a1, b0) !== Util.isCounterClockwise(a0, a1, b1);
    }

    function pointIntersectsBufferedLine(p, line, radius) {
        var radiusSquared = radius * radius;

        if (line.length === 1) {
            return p.distSqr(line[0]) < radiusSquared;
        }

        for (var i = 1; i < line.length; i++) {
            // Find line segments that have a distance <= radius^2 to p
            // In that case, we treat the line as "containing point p".
            var v = line[i - 1], w = line[i];
            if (IntersectionTest.distToSegmentSquared(p, v, w) < radiusSquared) {
                return true;
            }
        }
        return false;
    }

    // Code from http://stackoverflow.com/a/1501725/331379.
    IntersectionTest.distToSegmentSquared = function (p, v, w) {
        var l2 = v.distSqr(w);
        if (l2 === 0) {
            return p.distSqr(v);
        }
        var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
        if (t < 0) {
            return p.distSqr(v);
        }
        if (t > 1) {
            return p.distSqr(w);
        }
        return p.distSqr(w.sub(v)._mult(t)._add(v));
    };

    // point in polygon ray casting algorithm
    function multiPolygonContainsPoint(rings, p) {
        var c = false,
            ring, p1, p2;

        for (var k = 0; k < rings.length; k++) {
            ring = rings[k];
            for (var i = 0, j = ring.length - 1; i < ring.length; j = i++) {
                p1 = ring[i];
                p2 = ring[j];
                if (((p1.y > p.y) !== (p2.y > p.y)) && (p.x < (p2.x - p1.x) * (p.y - p1.y) / (p2.y - p1.y) + p1.x)) {
                    c = !c;
                }
            }
        }
        return c;
    }

    function polygonContainsPoint(ring, p) {
        var c = false;
        for (var i = 0, j = ring.length - 1; i < ring.length; j = i++) {
            var p1 = ring[i];
            var p2 = ring[j];
            if (((p1.y > p.y) !== (p2.y > p.y)) && (p.x < (p2.x - p1.x) * (p.y - p1.y) / (p2.y - p1.y) + p1.x)) {
                c = !c;
            }
        }
        return c;
    }

    var layout$2 = new Properties({
        "circle-sort-key": new DataDrivenProperty(StyleSpec["layout_circle"]["circle-sort-key"])
    });

    var paint$1 = new Properties({
        "circle-radius": new DataDrivenProperty(StyleSpec["paint_circle"]["circle-radius"]),
        "circle-color": new DataDrivenProperty(StyleSpec["paint_circle"]["circle-color"]),
        "circle-blur": new DataDrivenProperty(StyleSpec["paint_circle"]["circle-blur"]),
        "circle-opacity": new DataDrivenProperty(StyleSpec["paint_circle"]["circle-opacity"]),
        "circle-translate": new DataConstantProperty(StyleSpec["paint_circle"]["circle-translate"]),
        "circle-translate-anchor": new DataConstantProperty(StyleSpec["paint_circle"]["circle-translate-anchor"]),
        "circle-pitch-scale": new DataConstantProperty(StyleSpec["paint_circle"]["circle-pitch-scale"]),
        "circle-pitch-alignment": new DataConstantProperty(StyleSpec["paint_circle"]["circle-pitch-alignment"]),
        "circle-stroke-width": new DataDrivenProperty(StyleSpec["paint_circle"]["circle-stroke-width"]),
        "circle-stroke-color": new DataDrivenProperty(StyleSpec["paint_circle"]["circle-stroke-color"]),
        "circle-stroke-opacity": new DataDrivenProperty(StyleSpec["paint_circle"]["circle-stroke-opacity"])
    });

    // Note: without adding the explicit type annotation, Flow infers weaker types
    // for these objects from their use in the constructor to StyleLayer, as
    // {layout?: Properties<...>, paint: Properties<...>}
    var properties = ({ paint: paint$1, layout: layout$2 });

    var CircleStyleLayer = /*@__PURE__*/(function (StyleLayer) {
        function CircleStyleLayer(layer) {
            StyleLayer.call(this, layer, properties);
        }

        if (StyleLayer) CircleStyleLayer.__proto__ = StyleLayer;
        CircleStyleLayer.prototype = Object.create(StyleLayer && StyleLayer.prototype);
        CircleStyleLayer.prototype.constructor = CircleStyleLayer;

        CircleStyleLayer.prototype.createBucket = function createBucket(parameters) {
            return new CircleBucket(parameters);
        };

        CircleStyleLayer.prototype.queryRadius = function queryRadius(bucket) {
            var circleBucket = (bucket     );
            return QueryUtils.getMaximumPaintValue('circle-radius', this, circleBucket) +
                QueryUtils.getMaximumPaintValue('circle-stroke-width', this, circleBucket) +
                QueryUtils.translateDistance(this.paint.get('circle-translate'));
        };

        CircleStyleLayer.prototype.queryIntersectsFeature = function queryIntersectsFeature(queryGeometry, feature, featureState, geometry, zoom, transform, pixelsToTileUnits, pixelPosMatrix) {
            pixelPosMatrix = createMat4();
            var translatedPolygon = QueryUtils.translate(queryGeometry,
                this.paint.get('circle-translate'),
                this.paint.get('circle-translate-anchor'),
                0, pixelsToTileUnits);
            var radius = this.paint.get('circle-radius').evaluate(feature, featureState);
            var stroke = this.paint.get('circle-stroke-width').evaluate(feature, featureState);
            var size = radius + stroke;

            // For pitch-alignment: map, compare feature geometry to query geometry in the plane of the tile
            // // Otherwise, compare geometry in the plane of the viewport
            // // A circle with fixed scaling relative to the viewport gets larger in tile space as it moves into the distance
            // // A circle with fixed scaling relative to the map gets smaller in viewport space as it moves into the distance
            var alignWithMap = this.paint.get('circle-pitch-alignment') === 'map';
            var transformedPolygon = alignWithMap ? translatedPolygon : projectQueryGeometry(translatedPolygon, pixelPosMatrix);
            var transformedSize = alignWithMap ? size * pixelsToTileUnits : size;

            for (var i$1 = 0, list$1 = geometry; i$1 < list$1.length; i$1 += 1) {
                var ring = list$1[i$1];

                for (var i = 0, list = ring; i < list.length; i += 1) {

                    var point = list[i];

                    var transformedPoint = alignWithMap ? point : projectPoint(point, pixelPosMatrix);

                    var adjustedSize = transformedSize;
                    var projectedCenter = transformMat4([], [point.x, point.y, 0, 1], pixelPosMatrix);
                    if (this.paint.get('circle-pitch-scale') === 'viewport' && this.paint.get('circle-pitch-alignment') === 'map') ; else if (this.paint.get('circle-pitch-scale') === 'map' && this.paint.get('circle-pitch-alignment') === 'viewport') ;
                    adjustedSize *= 10.0;

                    if (IntersectionTest.polygonIntersectsBufferedPoint(transformedPolygon, transformedPoint, adjustedSize)) {
                        return true;
                    }
                }
            }

            return false;
        };

        return CircleStyleLayer;
    }(StyleLayer));

    function projectPoint(p, pixelPosMatrix) {
        var point = transformMat4([], [p.x, p.y, 0, 1], pixelPosMatrix);
        //return new pointGeometry(point[0] / point[3], point[1] / point[3]);
        return new Point(point[0], point[1]);
    }

    function projectQueryGeometry(queryGeometry, pixelPosMatrix) {
        return queryGeometry.map(function (p) {
            return projectPoint(p, pixelPosMatrix);
        });
    }

    function createMat4() {
        var out = new Float32Array(16);
        out[0] = 1;
        out[5] = 1;
        out[10] = 1;
        out[15] = 1;
        return out;
    }

    /**
     * Transforms the vec3 with a mat4.
     * 4th vector component is implicitly '1'
     *
     * @param {vec3} out the receiving vector
     * @param {vec3} a the vector to transform
     * @param {mat4} m matrix to transform with
     * @returns {vec3} out
     */
    function transformMat4(out, a, m) {
        var x = a[0],
            y = a[1],
            z = a[2];
        var w = m[3] * x + m[7] * y + m[11] * z + m[15];
        w = w || 1.0;
        out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
        out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
        out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
        return out;
    }

    /**
     * An implementation of `Property` for  data driven `line-pattern` which are transitioned by cross-fading
     * rather than interpolation.
     *
     * @private
     */

    var CrossFadedDataDrivenProperty = /*@__PURE__*/(function (DataDrivenProperty) {
        function CrossFadedDataDrivenProperty() {
            DataDrivenProperty.apply(this, arguments);
        }

        if (DataDrivenProperty) CrossFadedDataDrivenProperty.__proto__ = DataDrivenProperty;
        CrossFadedDataDrivenProperty.prototype = Object.create(DataDrivenProperty && DataDrivenProperty.prototype);
        CrossFadedDataDrivenProperty.prototype.constructor = CrossFadedDataDrivenProperty;

        CrossFadedDataDrivenProperty.prototype.possiblyEvaluate = function possiblyEvaluate(value, parameters, availableImages) {
            if (value.value === undefined) {
                return new PossiblyEvaluatedPropertyValue$1(this, {kind: 'constant', value: undefined}, parameters);
            } else if (value.expression.kind === 'constant') {
                var evaluatedValue = value.expression.evaluate(parameters, (null     ), {}, availableImages);
                var isImageExpression = value.property.specification.type === 'resolvedImage';
                var constantValue = isImageExpression && typeof evaluatedValue !== 'string' ? evaluatedValue.name : evaluatedValue;
                var constant = this._calculate(constantValue, constantValue, constantValue, parameters);
                return new PossiblyEvaluatedPropertyValue$1(this, {kind: 'constant', value: constant}, parameters);
            } else if (value.expression.kind === 'camera') {
                var cameraVal = this._calculate(
                    value.expression.evaluate({zoom: parameters.zoom - 1.0}),
                    value.expression.evaluate({zoom: parameters.zoom}),
                    value.expression.evaluate({zoom: parameters.zoom + 1.0}),
                    parameters);
                return new PossiblyEvaluatedPropertyValue$1(this, {kind: 'constant', value: cameraVal}, parameters);
            } else {
                // source or composite expression
                return new PossiblyEvaluatedPropertyValue$1(this, value.expression, parameters);
            }
        };

        CrossFadedDataDrivenProperty.prototype.evaluate = function evaluate(value, globals, feature, featureState, availableImages) {
            if (value.kind === 'source') {
                var constant = value.evaluate(globals, feature, featureState, availableImages);
                return this._calculate(constant, constant, constant, globals);
            } else if (value.kind === 'composite') {
                return this._calculate(
                    value.evaluate({zoom: Math.floor(globals.zoom) - 1.0}, feature, featureState),
                    value.evaluate({zoom: Math.floor(globals.zoom)}, feature, featureState),
                    value.evaluate({zoom: Math.floor(globals.zoom) + 1.0}, feature, featureState),
                    globals);
            } else {
                return value.value;
            }
        };

        CrossFadedDataDrivenProperty.prototype._calculate = function _calculate(min, mid, max, parameters) {
            var z = parameters.zoom;
            return z > parameters.zoomHistory.lastIntegerZoom ? {from: min, to: mid} : {from: max, to: mid};
        };

        CrossFadedDataDrivenProperty.prototype.interpolate = function interpolate(a) {
            return a;
        };

        return CrossFadedDataDrivenProperty;
    }(DataDrivenProperty));

    WebWorkerTransfer.register('DataDrivenProperty', DataDrivenProperty);

    var layout$4 = new Properties({
        "fill-sort-key": new DataDrivenProperty(StyleSpec["layout_fill"]["fill-sort-key"])
    });

    var paint$4 = new Properties({
        "fill-antialias": new DataConstantProperty(StyleSpec["paint_fill"]["fill-antialias"]),
        "fill-opacity": new DataDrivenProperty(StyleSpec["paint_fill"]["fill-opacity"]),
        "fill-color": new DataDrivenProperty(StyleSpec["paint_fill"]["fill-color"]),
        "fill-outline-color": new DataDrivenProperty(StyleSpec["paint_fill"]["fill-outline-color"]),
        "fill-translate": new DataConstantProperty(StyleSpec["paint_fill"]["fill-translate"]),
        "fill-translate-anchor": new DataConstantProperty(StyleSpec["paint_fill"]["fill-translate-anchor"]),
        "fill-pattern": new CrossFadedDataDrivenProperty(StyleSpec["paint_fill"]["fill-pattern"]),
    });

    // Note: without adding the explicit type annotation, Flow infers weaker types
    // for these objects from their use in the constructor to StyleLayer, as
    // {layout?: Properties<...>, paint: Properties<...>}
    var properties$3 = ({ paint: paint$4, layout: layout$4 }

        );

    var FillStyleLayer = /*@__PURE__*/(function (StyleLayer) {
        function FillStyleLayer(layer) {
            StyleLayer.call(this, layer, properties$3);
        }

        if (StyleLayer) FillStyleLayer.__proto__ = StyleLayer;
        FillStyleLayer.prototype = Object.create(StyleLayer && StyleLayer.prototype);
        FillStyleLayer.prototype.constructor = FillStyleLayer;

        FillStyleLayer.prototype.recalculate = function recalculate(parameters, availableImages) {
            StyleLayer.prototype.recalculate.call(this, parameters, availableImages);

            var outlineColor = this.paint._values['fill-outline-color'];
            if (outlineColor.value.kind === 'constant' && outlineColor.value.value === undefined) {
                this.paint._values['fill-outline-color'] = this.paint._values['fill-color'];
            }
        };

        FillStyleLayer.prototype.createBucket = function createBucket(parameters) {
            return new FillBucket(parameters);
        };

        FillStyleLayer.prototype.queryRadius = function queryRadius() {
            return QueryUtils.translateDistance(this.paint.get('fill-translate'));
        };

        FillStyleLayer.prototype.queryIntersectsFeature = function queryIntersectsFeature(queryGeometry, feature, featureState, geometry, zoom, transform, pixelsToTileUnits) {
            var translatedPolygon = QueryUtils.translate(queryGeometry,
                this.paint.get('fill-translate'),
                this.paint.get('fill-translate-anchor'),
                0, pixelsToTileUnits);
            return IntersectionTest.polygonIntersectsMultiPolygon(translatedPolygon, geometry);
        };

        FillStyleLayer.prototype.isTileClipped = function isTileClipped() {
            return true;
        };

        return FillStyleLayer;
    }(StyleLayer));

    /**
     * An implementation of `Property` for `*-pattern` and `line-dasharray`, which are transitioned by cross-fading
     * rather than interpolation.
     *
     * @private
     */
    var CrossFadedProperty = function CrossFadedProperty(specification) {
        this.specification = specification;
    };

    CrossFadedProperty.prototype.possiblyEvaluate = function possiblyEvaluate(value, parameters, availableImages) {
        if (value.value === undefined) {
            return undefined;
        } else if (value.expression.kind === 'constant') {
            var constant = value.expression.evaluate(parameters, (null   ), {}, availableImages);
            return this._calculate(constant, constant, constant, parameters);
        } else {
            //assert_1(!value.isDataDriven());
            return this._calculate(
                value.expression.evaluate(new EvaluationParameters(Math.floor(parameters.zoom - 1.0), parameters)),
                value.expression.evaluate(new EvaluationParameters(Math.floor(parameters.zoom), parameters)),
                value.expression.evaluate(new EvaluationParameters(Math.floor(parameters.zoom + 1.0), parameters)),
                parameters);
        }
    };

    CrossFadedProperty.prototype._calculate = function _calculate(min, mid, max, parameters) {
        var z = parameters.zoom;
        return z > parameters.zoomHistory.lastIntegerZoom ? {from: min, to: mid} : {from: max, to: mid};
    };

    CrossFadedProperty.prototype.interpolate = function interpolate(a) {
        return a;
    };

    WebWorkerTransfer.register('CrossFadedProperty', CrossFadedProperty);

    /**
     * An implementation of `Property` for `heatmap-color` and `line-gradient`. Interpolation is a no-op, and
     * evaluation returns a boolean value in order to indicate its presence, but the real
     * evaluation happens in StyleLayer classes.
     *
     * @private
     */

    var ColorRampProperty = function ColorRampProperty(specification) {
        this.specification = specification;
    };

    ColorRampProperty.prototype.possiblyEvaluate = function possiblyEvaluate(value, parameters, availableImages) {
        return !!value.expression.evaluate(parameters, (null   ), {}, availableImages);
    };

    ColorRampProperty.prototype.interpolate = function interpolate() {
        return false;
    };

    WebWorkerTransfer.register('ColorRampProperty', ColorRampProperty);

    var layout$6 = new Properties({
        "line-cap": new DataConstantProperty(StyleSpec["layout_line"]["line-cap"]),
        "line-join": new DataDrivenProperty(StyleSpec["layout_line"]["line-join"]),
        "line-miter-limit": new DataConstantProperty(StyleSpec["layout_line"]["line-miter-limit"]),
        "line-round-limit": new DataConstantProperty(StyleSpec["layout_line"]["line-round-limit"]),
        "line-sort-key": new DataDrivenProperty(StyleSpec["layout_line"]["line-sort-key"])
    });


    var paint$6 = new Properties({
        "line-opacity": new DataDrivenProperty(StyleSpec["paint_line"]["line-opacity"]),
        "line-color": new DataDrivenProperty(StyleSpec["paint_line"]["line-color"]),
        "line-translate": new DataConstantProperty(StyleSpec["paint_line"]["line-translate"]),
        "line-translate-anchor": new DataConstantProperty(StyleSpec["paint_line"]["line-translate-anchor"]),
        "line-width": new DataDrivenProperty(StyleSpec["paint_line"]["line-width"]),
        "line-gap-width": new DataDrivenProperty(StyleSpec["paint_line"]["line-gap-width"]),
        "line-offset": new DataDrivenProperty(StyleSpec["paint_line"]["line-offset"]),
        "line-blur": new DataDrivenProperty(StyleSpec["paint_line"]["line-blur"]),
        "line-dasharray": new CrossFadedProperty(StyleSpec["paint_line"]["line-dasharray"]),
        "line-pattern": new CrossFadedDataDrivenProperty(StyleSpec["paint_line"]["line-pattern"]),
        "line-gradient": new ColorRampProperty(StyleSpec["paint_line"]["line-gradient"])
    });

    // Note: without adding the explicit type annotation, Flow infers weaker types
    // for these objects from their use in the constructor to StyleLayer, as
    // {layout?: Properties<...>, paint: Properties<...>}
    var properties$5 = ({ paint: paint$6, layout: layout$6 }

        );

    var LineFloorwidthProperty = /*@__PURE__*/(function (DataDrivenProperty) {
        function LineFloorwidthProperty() {
            DataDrivenProperty.apply(this, arguments);
        }

        if (DataDrivenProperty) LineFloorwidthProperty.__proto__ = DataDrivenProperty;
        LineFloorwidthProperty.prototype = Object.create(DataDrivenProperty && DataDrivenProperty.prototype);
        LineFloorwidthProperty.prototype.constructor = LineFloorwidthProperty;

        LineFloorwidthProperty.prototype.possiblyEvaluate = function possiblyEvaluate(value, parameters) {
            parameters = new EvaluationParameters$1(Math.floor(parameters.zoom), {
                now: parameters.now,
                fadeDuration: parameters.fadeDuration,
                zoomHistory: parameters.zoomHistory,
                transition: parameters.transition
            });
            return DataDrivenProperty.prototype.possiblyEvaluate.call(this, value, parameters);
        };

        LineFloorwidthProperty.prototype.evaluate = function evaluate(value, globals, feature, featureState) {
            globals = extend({}, globals, {zoom: Math.floor(globals.zoom)});
            return DataDrivenProperty.prototype.evaluate.call(this, value, globals, feature, featureState);
        };

        return LineFloorwidthProperty;
    }(DataDrivenProperty));

    var lineFloorwidthProperty = new LineFloorwidthProperty(properties$5.paint.properties['line-width'].specification);
    lineFloorwidthProperty.useIntegerZoom = true;

    var LineStyleLayer = /*@__PURE__*/(function (StyleLayer) {
        function LineStyleLayer(layer) {
            StyleLayer.call(this, layer, properties$5);
        }

        if (StyleLayer) LineStyleLayer.__proto__ = StyleLayer;
        LineStyleLayer.prototype = Object.create(StyleLayer && StyleLayer.prototype);
        LineStyleLayer.prototype.constructor = LineStyleLayer;

        LineStyleLayer.prototype._handleSpecialPaintPropertyUpdate = function _handleSpecialPaintPropertyUpdate(name) {
            if (name === 'line-gradient') {
                this._updateGradient();
            }
        };

        LineStyleLayer.prototype._updateGradient = function _updateGradient() {
            var expression = this._transitionablePaint._values['line-gradient'].value.expression;
            this.gradient = renderColorRamp(expression, 'lineProgress');
            this.gradientTexture = null;
        };

        LineStyleLayer.prototype.recalculate = function recalculate(parameters, availableImages) {
            StyleLayer.prototype.recalculate.call(this, parameters, availableImages);

            (this.paint._values     )['line-floorwidth'] =
                lineFloorwidthProperty.possiblyEvaluate(this._transitioningPaint._values['line-width'].value, parameters);
        };

        LineStyleLayer.prototype.createBucket = function createBucket(parameters) {
            return new LineBucket(parameters);
        };

        LineStyleLayer.prototype.queryRadius = function queryRadius(bucket) {
            var lineBucket = (bucket     );
            var width = getLineWidth(
                QueryUtils.getMaximumPaintValue('line-width', this, lineBucket),
                QueryUtils.getMaximumPaintValue('line-gap-width', this, lineBucket));
            var offset = QueryUtils.getMaximumPaintValue('line-offset', this, lineBucket);
            return width / 2 + Math.abs(offset) + QueryUtils.translateDistance(this.paint.get('line-translate'));
        };

        LineStyleLayer.prototype.queryIntersectsFeature = function queryIntersectsFeature(queryGeometry, feature, featureState, geometry, zoom, transform, pixelsToTileUnits) {
            var translatedPolygon = QueryUtils.translate(queryGeometry,
                this.paint.get('line-translate'),
                this.paint.get('line-translate-anchor'),
                0, pixelsToTileUnits);
            var halfWidth = pixelsToTileUnits / 2 * getLineWidth(
                this.paint.get('line-width').evaluate(feature, featureState),
                this.paint.get('line-gap-width').evaluate(feature, featureState));
            var lineOffset = this.paint.get('line-offset').evaluate(feature, featureState);
            if (lineOffset) {
                geometry = offsetLine(geometry, lineOffset * pixelsToTileUnits);
            }

            return IntersectionTest.polygonIntersectsBufferedMultiLine(translatedPolygon, geometry, halfWidth);
        };

        LineStyleLayer.prototype.isTileClipped = function isTileClipped() {
            return true;
        };

        function getLineWidth(lineWidth, lineGapWidth) {
            if (lineGapWidth > 0) {
                return lineGapWidth + 2 * lineWidth;
            } else {
                return lineWidth;
            }
        }

        function offsetLine(rings, offset) {
            var newRings = [];
            var zero = new Point(0, 0);
            for (var k = 0; k < rings.length; k++) {
                var ring = rings[k];
                var newRing = [];
                for (var i = 0; i < ring.length; i++) {
                    var a = ring[i - 1];
                    var b = ring[i];
                    var c = ring[i + 1];
                    var aToB = i === 0 ? zero : b.sub(a)._unit()._perp();
                    var bToC = i === ring.length - 1 ? zero : c.sub(b)._unit()._perp();
                    var extrude = aToB._add(bToC)._unit();

                    var cosHalfAngle = extrude.x * bToC.x + extrude.y * bToC.y;
                    extrude._mult(1 / cosHalfAngle);

                    newRing.push(extrude._mult(offset)._add(b));
                }
                newRings.push(newRing);
            }
            return newRings;
        }

        return LineStyleLayer;
    }(StyleLayer));

    function SymbolAttributes() {
    }

    SymbolAttributes.symbolLayoutAttributes = createLayout([
        {name: 'a_pos_offset', components: 4, type: 'Int16'},
        {name: 'a_data', components: 4, type: 'Uint16'},
        {name: 'a_pixeloffset', components: 4, type: 'Int16'}
    ], 4);

    SymbolAttributes.dynamicLayoutAttributes = createLayout([
        {name: 'a_projected_pos', components: 3, type: 'Float32'}
    ], 4);

    SymbolAttributes.placementOpacityAttributes = createLayout([
        {name: 'a_fade_opacity', components: 1, type: 'Uint32'}
    ], 4);

    SymbolAttributes.collisionVertexAttributes = createLayout([
        {name: 'a_placed', components: 2, type: 'Uint8'},
        {name: 'a_shift', components: 2, type: 'Float32'}
    ]);

    SymbolAttributes.collisionBox = createLayout([
        // the box is centered around the anchor point
        {type: 'Int16', name: 'anchorPointX'},
        {type: 'Int16', name: 'anchorPointY'},

        // distances to the edges from the anchor
        {type: 'Int16', name: 'x1'},
        {type: 'Int16', name: 'y1'},
        {type: 'Int16', name: 'x2'},
        {type: 'Int16', name: 'y2'},

        // the index of the feature in the original vectortile
        {type: 'Uint32', name: 'featureIndex'},
        // the source layer the feature appears in
        {type: 'Uint16', name: 'sourceLayerIndex'},
        // the bucket the feature appears in
        {type: 'Uint16', name: 'bucketIndex'},

        // collision circles for lines store their distance to the anchor in tile units
        // so that they can be ignored if the projected label doesn't extend into
        // the box area
        {type: 'Int16', name: 'radius'},
        {type: 'Int16', name: 'signedDistanceFromAnchor'}
    ]);

    SymbolAttributes.collisionBoxLayout = createLayout([ // used to render collision boxes for debugging purposes
        {name: 'a_pos', components: 2, type: 'Int16'},
        {name: 'a_anchor_pos', components: 2, type: 'Int16'},
        {name: 'a_extrude', components: 2, type: 'Int16'}
    ], 4);

    SymbolAttributes.collisionCircleLayout = createLayout([ // used to render collision circles for debugging purposes
        {name: 'a_pos', components: 2, type: 'Int16'},
        {name: 'a_anchor_pos', components: 2, type: 'Int16'},
        {name: 'a_extrude', components: 2, type: 'Int16'}
    ], 4);

    SymbolAttributes.placement = createLayout([
        {type: 'Int16', name: 'anchorX'},
        {type: 'Int16', name: 'anchorY'},
        {type: 'Uint16', name: 'glyphStartIndex'},
        {type: 'Uint16', name: 'numGlyphs'},
        {type: 'Uint32', name: 'vertexStartIndex'},
        {type: 'Uint32', name: 'lineStartIndex'},
        {type: 'Uint32', name: 'lineLength'},
        {type: 'Uint16', name: 'segment'},
        {type: 'Uint16', name: 'lowerSize'},
        {type: 'Uint16', name: 'upperSize'},
        {type: 'Float32', name: 'lineOffsetX'},
        {type: 'Float32', name: 'lineOffsetY'},
        {type: 'Uint8', name: 'writingMode'},
        {type: 'Uint8', name: 'placedOrientation'},
        {type: 'Uint8', name: 'hidden'},
        {type: 'Uint32', name: 'crossTileID'},
        {type: 'Int16', name: 'associatedIconIndex'}
    ]);

    SymbolAttributes.symbolInstance = createLayout([
        {type: 'Int16', name: 'anchorX'},
        {type: 'Int16', name: 'anchorY'},
        {type: 'Int16', name: 'rightJustifiedTextSymbolIndex'},
        {type: 'Int16', name: 'centerJustifiedTextSymbolIndex'},
        {type: 'Int16', name: 'leftJustifiedTextSymbolIndex'},
        {type: 'Int16', name: 'verticalPlacedTextSymbolIndex'},
        {type: 'Int16', name: 'placedIconSymbolIndex'},
        {type: 'Int16', name: 'verticalPlacedIconSymbolIndex'},
        {type: 'Uint16', name: 'key'},
        {type: 'Uint16', name: 'textBoxStartIndex'},
        {type: 'Uint16', name: 'textBoxEndIndex'},
        {type: 'Uint16', name: 'verticalTextBoxStartIndex'},
        {type: 'Uint16', name: 'verticalTextBoxEndIndex'},
        {type: 'Uint16', name: 'iconBoxStartIndex'},
        {type: 'Uint16', name: 'iconBoxEndIndex'},
        {type: 'Uint16', name: 'verticalIconBoxStartIndex'},
        {type: 'Uint16', name: 'verticalIconBoxEndIndex'},
        {type: 'Uint16', name: 'featureIndex'},
        {type: 'Uint16', name: 'numHorizontalGlyphVertices'},
        {type: 'Uint16', name: 'numVerticalGlyphVertices'},
        {type: 'Uint16', name: 'numIconVertices'},
        {type: 'Uint16', name: 'numVerticalIconVertices'},
        {type: 'Uint32', name: 'crossTileID'},
        {type: 'Float32', name: 'textBoxScale'},
        {type: 'Float32', components: 2, name: 'textOffset'}
    ]);

    SymbolAttributes.glyphOffset = createLayout([
        {type: 'Float32', name: 'offsetX'}
    ]);

    SymbolAttributes.lineVertex = createLayout([
        {type: 'Int16', name: 'x'},
        {type: 'Int16', name: 'y'},
        {type: 'Int16', name: 'tileUnitDistanceFromAnchor'}
    ]);

    function mergeLines(features) {
        var leftIndex = {};
        var rightIndex = {};
        var mergedFeatures = [];
        var mergedIndex = 0;

        function add(k) {
            mergedFeatures.push(features[k]);
            mergedIndex++;
        }

        function mergeFromRight(leftKey, rightKey, geom) {
            var i = rightIndex[leftKey];
            delete rightIndex[leftKey];
            rightIndex[rightKey] = i;

            mergedFeatures[i].geometry[0].pop();
            mergedFeatures[i].geometry[0] = mergedFeatures[i].geometry[0].concat(geom[0]);
            return i;
        }

        function mergeFromLeft(leftKey, rightKey, geom) {
            var i = leftIndex[rightKey];
            delete leftIndex[rightKey];
            leftIndex[leftKey] = i;

            mergedFeatures[i].geometry[0].shift();
            mergedFeatures[i].geometry[0] = geom[0].concat(mergedFeatures[i].geometry[0]);
            return i;
        }

        function getKey(text, geom, onRight) {
            var point = onRight ? geom[0][geom[0].length - 1] : geom[0][0];
            return (text + ":" + (point.x) + ":" + (point.y));
        }

        for (var k = 0; k < features.length; k++) {
            var feature = features[k];
            var geom = feature.geometry;
            var text = feature.text ? feature.text.toString() : null;

            if (!text) {
                add(k);
                continue;
            }

            var leftKey = getKey(text, geom),
                rightKey = getKey(text, geom, true);

            if ((leftKey in rightIndex) && (rightKey in leftIndex) && (rightIndex[leftKey] !== leftIndex[rightKey])) {
                // found lines with the same text adjacent to both ends of the current line, merge all three
                var j = mergeFromLeft(leftKey, rightKey, geom);
                var i = mergeFromRight(leftKey, rightKey, mergedFeatures[j].geometry);

                delete leftIndex[leftKey];
                delete rightIndex[rightKey];

                rightIndex[getKey(text, mergedFeatures[i].geometry, true)] = i;
                mergedFeatures[j].geometry = (null     );

            } else if (leftKey in rightIndex) {
                // found mergeable line adjacent to the start of the current line, merge
                mergeFromRight(leftKey, rightKey, geom);

            } else if (rightKey in leftIndex) {
                // found mergeable line adjacent to the end of the current line, merge
                mergeFromLeft(leftKey, rightKey, geom);

            } else {
                // no adjacent lines, add as a new item
                add(k);
                leftIndex[leftKey] = mergedIndex - 1;
                rightIndex[rightKey] = mergedIndex - 1;
            }
        }

        return mergedFeatures.filter(function (f) {
            return f.geometry;
        });
    }

    var Shaping = function Shaping() {
    };

    Shaping.WritingMode = {
        horizontal: 1,
        vertical: 2,
        horizontalOnly: 3
    };

    // The position of a glyph relative to the text's anchor point.


    // A collection of positioned glyphs and some metadata


    function isEmpty(positionedLines) {
        for (var i = 0, list = positionedLines; i < list.length; i += 1) {
            var line = list[i];

            if (line.positionedGlyphs.length !== 0) {
                return false;
            }
        }
        return true;
    }


    // Max number of images in label is 6401 U+E000–U+F8FF that covers
    // Basic Multilingual Plane Unicode Private Use Area (PUA).
    var PUAbegin = 0xE000;
    var PUAend = 0xF8FF;

    var SectionOptions = function SectionOptions() {
        this.scale = 1.0;
        this.fontStack = "";
        this.imageName = null;
    };

    SectionOptions.forText = function forText(scale, fontStack) {
        var textOptions = new SectionOptions();
        textOptions.scale = scale || 1;
        textOptions.fontStack = fontStack;
        return textOptions;
    };

    SectionOptions.forImage = function forImage(imageName) {
        var imageOptions = new SectionOptions();
        imageOptions.imageName = imageName;
        return imageOptions;
    };

    var TaggedString = function TaggedString() {
        this.text = "";
        this.sectionIndex = [];
        this.sections = [];
        this.imageSectionID = null;
    };

    TaggedString.fromFeature = function fromFeature(text, defaultFontStack) {
        var result = new TaggedString();
        for (var i = 0; i < text.sections.length; i++) {
            var section = text.sections[i];
            if (!section.image) {
                result.addTextSection(section, defaultFontStack);
            } else {
                result.addImageSection(section);
            }
        }
        return result;
    };

    TaggedString.prototype.length = function length() {
        return this.text.length;
    };

    TaggedString.prototype.getSection = function getSection(index) {
        return this.sections[this.sectionIndex[index]];
    };

    TaggedString.prototype.getSectionIndex = function getSectionIndex(index) {
        return this.sectionIndex[index];
    };

    TaggedString.prototype.getCharCode = function getCharCode(index) {
        return this.text.charCodeAt(index);
    };

    TaggedString.prototype.verticalizePunctuation = function verticalizePunctuation$1() {
        //this.text = verticalizePunctuation(this.text);
    };

    TaggedString.prototype.trim = function trim() {
        var beginningWhitespace = 0;
        for (var i = 0;
             i < this.text.length && whitespace[this.text.charCodeAt(i)];
             i++) {
            beginningWhitespace++;
        }
        var trailingWhitespace = this.text.length;
        for (var i$1 = this.text.length - 1;
             i$1 >= 0 && i$1 >= beginningWhitespace && whitespace[this.text.charCodeAt(i$1)];
             i$1--) {
            trailingWhitespace--;
        }
        this.text = this.text.substring(beginningWhitespace, trailingWhitespace);
        this.sectionIndex = this.sectionIndex.slice(beginningWhitespace, trailingWhitespace);
    };

    TaggedString.prototype.substring = function substring(start, end) {
        var substring = new TaggedString();
        substring.text = this.text.substring(start, end);
        substring.sectionIndex = this.sectionIndex.slice(start, end);
        substring.sections = this.sections;
        return substring;
    };

    TaggedString.prototype.toString = function toString() {
        return this.text;
    };

    TaggedString.prototype.getMaxScale = function getMaxScale() {
        var this$1 = this;

        return this.sectionIndex.reduce(function (max, index) {
            return Math.max(max, this$1.sections[index].scale);
        }, 0);
    };

    TaggedString.prototype.addTextSection = function addTextSection(section, defaultFontStack) {
        this.text += section.text;
        this.sections.push(SectionOptions.forText(section.scale, section.fontStack || defaultFontStack));
        var index = this.sections.length - 1;
        for (var i = 0; i < section.text.length; ++i) {
            this.sectionIndex.push(index);
        }
    };

    TaggedString.prototype.addImageSection = function addImageSection(section) {
        var imageName = section.image ? section.image.name : '';
        if (imageName.length === 0) {
            //warnOnce("Can't add FormattedSection with an empty image.");
            return;
        }

        var nextImageSectionCharCode = this.getNextImageSectionCharCode();
        if (!nextImageSectionCharCode) {
            //warnOnce(("Reached maximum number of images " + (PUAend - PUAbegin + 2)));
            return;
        }

        this.text += String.fromCharCode(nextImageSectionCharCode);
        this.sections.push(SectionOptions.forImage(imageName));
        this.sectionIndex.push(this.sections.length - 1);
    };

    TaggedString.prototype.getNextImageSectionCharCode = function getNextImageSectionCharCode() {
        if (!this.imageSectionID) {
            this.imageSectionID = PUAbegin;
            return this.imageSectionID;
        }

        if (this.imageSectionID >= PUAend) {
            return null;
        }
        return ++this.imageSectionID;
    };

    function breakLines(input, lineBreakPoints) {
        var lines = [];
        var text = input.text;
        var start = 0;
        for (var i = 0, list = lineBreakPoints; i < list.length; i += 1) {
            var lineBreak = list[i];

            lines.push(input.substring(start, lineBreak));
            start = lineBreak;
        }

        if (start < text.length) {
            lines.push(input.substring(start, text.length));
        }
        return lines;
    }

    Shaping.shapeText = function(text, glyphMap, glyphPositions, imagePositions, defaultFontStack, maxWidth, lineHeight, textAnchor, textJustify, spacing, translate, writingMode, allowVerticalPlacement, symbolPlacement, layoutTextSize, layoutTextSizeThisZoom){
        var logicalInput = TaggedString.fromFeature(text, defaultFontStack);

        if (writingMode === Shaping.WritingMode.vertical) {
            logicalInput.verticalizePunctuation();
        }

        var lines;
        {
            lines = breakLines(logicalInput, determineLineBreaks());
        }

        var positionedLines = [];
        var shaping = {
            positionedLines: positionedLines,
            text: logicalInput.toString(),
            top: translate[1],
            bottom: translate[1],
            left: translate[0],
            right: translate[0],
            writingMode: writingMode,
            iconsInText: false,
            verticalizable: false
        };
        if (isEmpty(positionedLines)) {
            return false;
        }

        return shaping;
    };

    // using computed properties due to https://github.com/facebook/flow/issues/380
    /* eslint no-useless-computed-key: 0 */

    var whitespace = {};
    whitespace[0x09] = true;
    whitespace[0x0a] = true;
    whitespace[0x0b] = true;
    whitespace[0x0c] = true;
    whitespace[0x0d] = true;
    whitespace[0x20] = true;

    function determineLineBreaks(logicalInput, spacing, maxWidth, glyphMap, imagePositions, symbolPlacement, layoutTextSize) {
    //        if (symbolPlacement !== 'point') {
    //            return [];
    //        }
    //
    //        if (!logicalInput) {
    //            return [];
    //        }
    //
    //        var potentialLineBreaks = [];
    //        var targetWidth = determineAverageLineWidth(logicalInput, spacing, maxWidth, glyphMap, imagePositions, layoutTextSize);
    //
    //        var hasServerSuggestedBreakpoints = logicalInput.text.indexOf("\u200b") >= 0;
    //
    //        var currentX = 0;
    //
    //        for (var i = 0; i < logicalInput.length(); i++) {
    //            var section = logicalInput.getSection(i);
    //            var codePoint = logicalInput.getCharCode(i);
    //            if (!whitespace[codePoint]) {
    //                currentX += getGlyphAdvance(codePoint, section, glyphMap, imagePositions, spacing, layoutTextSize);
    //            }
    //
    //            // Ideographic characters, spaces, and word-breaking punctuation that often appear without
    //            // surrounding spaces.
    //            if ((i < logicalInput.length() - 1)) {
    //                var ideographicBreak = charAllowsIdeographicBreaking(codePoint);
    //                if (breakable[codePoint] || ideographicBreak || section.imageName) {
    //
    //                    potentialLineBreaks.push(
    //                        evaluateBreak(
    //                            i + 1,
    //                            currentX,
    //                            targetWidth,
    //                            potentialLineBreaks,
    //                            calculatePenalty(codePoint, logicalInput.getCharCode(i + 1), ideographicBreak && hasServerSuggestedBreakpoints),
    //                            false));
    //                }
    //            }
    //        }
    //
    //        return leastBadBreaks(
    //            evaluateBreak(
    //                logicalInput.length(),
    //                currentX,
    //                targetWidth,
    //                potentialLineBreaks,
    //                0,
    //                true));
    }

    function getAnchorAlignment(anchor) {
        var horizontalAlign = 0.5, verticalAlign = 0.5;

        switch (anchor) {
            case 'right':
            case 'top-right':
            case 'bottom-right':
                horizontalAlign = 1;
                break;
            case 'left':
            case 'top-left':
            case 'bottom-left':
                horizontalAlign = 0;
                break;
        }

        switch (anchor) {
            case 'bottom':
            case 'bottom-right':
            case 'bottom-left':
                verticalAlign = 1;
                break;
            case 'top':
            case 'top-right':
            case 'top-left':
                verticalAlign = 0;
                break;
        }

        return {horizontalAlign: horizontalAlign, verticalAlign: verticalAlign};
    }


    Shaping.shapeIcon = function(image, iconOffset, iconAnchor){
        var ref = getAnchorAlignment(iconAnchor);
        var horizontalAlign = ref.horizontalAlign;
        var verticalAlign = ref.verticalAlign;
        var dx = iconOffset[0];
        var dy = iconOffset[1];
        var x1 = dx - image.displaySize[0] * horizontalAlign;
        var x2 = x1 + image.displaySize[0];
        var y1 = dy - image.displaySize[1] * verticalAlign;
        var y2 = y1 + image.displaySize[1];
        return {image: image, top: y1, bottom: y2, left: x1, right: x2};
    };

    Shaping.fitIconToText = function(shapedIcon, shapedText, textFit, padding, iconOffset, fontScale){
    //        assert_1(textFit !== 'none');
    //        assert_1(Array.isArray(padding) && padding.length === 4);
    //        assert_1(Array.isArray(iconOffset) && iconOffset.length === 2);

        var image = shapedIcon.image;

        var collisionPadding;
        if (image.content) {
            var content = image.content;
            var pixelRatio = image.pixelRatio || 1;
            collisionPadding = [
                content[0] / pixelRatio,
                content[1] / pixelRatio,
                image.displaySize[0] - content[2] / pixelRatio,
                image.displaySize[1] - content[3] / pixelRatio
            ];
        }

        // We don't respect the icon-anchor, because icon-text-fit is set. Instead,
        // the icon will be centered on the text, then stretched in the given
        // dimensions.

        var textLeft = shapedText.left * fontScale;
        var textRight = shapedText.right * fontScale;

        var top, right, bottom, left;
        if (textFit === 'width' || textFit === 'both') {
            // Stretched horizontally to the text width
            left = iconOffset[0] + textLeft - padding[3];
            right = iconOffset[0] + textRight + padding[1];
        } else {
            // Centered on the text
            left = iconOffset[0] + (textLeft + textRight - image.displaySize[0]) / 2;
            right = left + image.displaySize[0];
        }

        var textTop = shapedText.top * fontScale;
        var textBottom = shapedText.bottom * fontScale;
        if (textFit === 'height' || textFit === 'both') {
            // Stretched vertically to the text height
            top = iconOffset[1] + textTop - padding[0];
            bottom = iconOffset[1] + textBottom + padding[2];
        } else {
            // Centered on the text
            top = iconOffset[1] + (textTop + textBottom - image.displaySize[1]) / 2;
            bottom = top + image.displaySize[1];
        }

        return {image: image, top: top, right: right, bottom: bottom, left: left, collisionPadding: collisionPadding};
    };

    var SIZE_PACK_FACTOR = 128;

    // For {text,icon}-size, get the bucket-level data that will be needed by
    // the painter to set symbol-size-related uniforms
    function getSizeData(tileZoom, value) {
        var expression = value.expression;

        if (expression.kind === 'constant') {
            var layoutSize = expression.evaluate(new EvaluationParameters$1(tileZoom + 1));
            return {kind: 'constant', layoutSize: layoutSize};

        } else if (expression.kind === 'source') {
            return {kind: 'source'};

        } else {
            var zoomStops = expression.zoomStops;
            var interpolationType = expression.interpolationType;

            // calculate covering zoom stops for zoom-dependent values
            var lower = 0;
            while (lower < zoomStops.length && zoomStops[lower] <= tileZoom) {
                lower++;
            }
            lower = Math.max(0, lower - 1);
            var upper = lower;
            while (upper < zoomStops.length && zoomStops[upper] < tileZoom + 1) {
                upper++;
            }
            upper = Math.min(zoomStops.length - 1, upper);

            var minZoom = zoomStops[lower];
            var maxZoom = zoomStops[upper];

            // We'd like to be able to use CameraExpression or CompositeExpression in these
            // return types rather than ExpressionSpecification, but the former are not
            // transferrable across Web Worker boundaries.
            if (expression.kind === 'composite') {
                return {kind: 'composite', minZoom: minZoom, maxZoom: maxZoom, interpolationType: interpolationType};
            }

            // for camera functions, also save off the function values
            // evaluated at the covering zoom levels
            var minSize = expression.evaluate(new EvaluationParameters$1(minZoom));
            var maxSize = expression.evaluate(new EvaluationParameters$1(maxZoom));

            return {kind: 'camera', minZoom: minZoom, maxZoom: maxZoom, minSize: minSize, maxSize: maxSize, interpolationType: interpolationType};
        }
    }

    function evaluateSizeForFeature(sizeData, ref, ref$1) {
        var uSize = ref.uSize;
        var uSizeT = ref.uSizeT;
        var lowerSize = ref$1.lowerSize;
        var upperSize = ref$1.upperSize;

        if (sizeData.kind === 'source') {
            return lowerSize / SIZE_PACK_FACTOR;
        } else if (sizeData.kind === 'composite') {
            return number(lowerSize / SIZE_PACK_FACTOR, upperSize / SIZE_PACK_FACTOR, uSizeT);
        }
        return uSize;
    }

    function evaluateSizeForZoom(sizeData, zoom) {
        var uSizeT = 0;
        var uSize = 0;

        if (sizeData.kind === 'constant') {
            uSize = sizeData.layoutSize;

        } else if (sizeData.kind !== 'source') {
            var interpolationType = sizeData.interpolationType;
            var minZoom = sizeData.minZoom;
            var maxZoom = sizeData.maxZoom;

            // Even though we could get the exact value of the camera function
            // at z = tr.zoom, we intentionally do not: instead, we interpolate
            // between the camera function values at a pair of zoom stops covering
            // [tileZoom, tileZoom + 1] in order to be consistent with this
            // restriction on composite functions
    //            var t = !interpolationType ? 0 : clamp(
    //                Interpolate.interpolationFactor(interpolationType, zoom, minZoom, maxZoom), 0, 1);
            var t = 0;

            if (sizeData.kind === 'camera') {
                uSize = number(sizeData.minSize, sizeData.maxSize, t);
            } else {
                uSizeT = t;
            }
        }

        return {uSizeT: uSizeT, uSize: uSize};
    }

    var symbolSize = /*#__PURE__*/Object.freeze({
        __proto__: null,
        getSizeData: getSizeData,
        evaluateSizeForFeature: evaluateSizeForFeature,
        evaluateSizeForZoom: evaluateSizeForZoom,
        SIZE_PACK_FACTOR: SIZE_PACK_FACTOR
    });

    function transformText(text, layer, feature) {
        var transform = layer.layout.get('text-transform').evaluate(feature, {});
        if (transform === 'uppercase') {
            text = text.toLocaleUpperCase();
        } else if (transform === 'lowercase') {
            text = text.toLocaleLowerCase();
        }

    //        if (plugin.applyArabicShaping) {
    //            text = plugin.applyArabicShaping(text);
    //        }

        return text;
    }

    function transformText$1(text, layer, feature) {
        text.sections.forEach(function (section) {
            section.text = transformText(section.text, layer, feature);
        });
        return text;
    }

    // The following table comes from <http://www.unicode.org/Public/12.0.0/ucd/Blocks.txt>.
    // Keep it synchronized with <http://www.unicode.org/Public/UCD/latest/ucd/Blocks.txt>.

    var unicodeBlockLookup = {
        // 'Basic Latin': (char) => char >= 0x0000 && char <= 0x007F,
        'Latin-1 Supplement': function (char) {
            return char >= 0x0080 && char <= 0x00FF;
        },
        // 'Latin Extended-A': (char) => char >= 0x0100 && char <= 0x017F,
        // 'Latin Extended-B': (char) => char >= 0x0180 && char <= 0x024F,
        // 'IPA Extensions': (char) => char >= 0x0250 && char <= 0x02AF,
        // 'Spacing Modifier Letters': (char) => char >= 0x02B0 && char <= 0x02FF,
        // 'Combining Diacritical Marks': (char) => char >= 0x0300 && char <= 0x036F,
        // 'Greek and Coptic': (char) => char >= 0x0370 && char <= 0x03FF,
        // 'Cyrillic': (char) => char >= 0x0400 && char <= 0x04FF,
        // 'Cyrillic Supplement': (char) => char >= 0x0500 && char <= 0x052F,
        // 'Armenian': (char) => char >= 0x0530 && char <= 0x058F,
        //'Hebrew': (char) => char >= 0x0590 && char <= 0x05FF,
        'Arabic': function (char) {
            return char >= 0x0600 && char <= 0x06FF;
        },
        //'Syriac': (char) => char >= 0x0700 && char <= 0x074F,
        'Arabic Supplement': function (char) {
            return char >= 0x0750 && char <= 0x077F;
        },
        // 'Thaana': (char) => char >= 0x0780 && char <= 0x07BF,
        // 'NKo': (char) => char >= 0x07C0 && char <= 0x07FF,
        // 'Samaritan': (char) => char >= 0x0800 && char <= 0x083F,
        // 'Mandaic': (char) => char >= 0x0840 && char <= 0x085F,
        // 'Syriac Supplement': (char) => char >= 0x0860 && char <= 0x086F,
        'Arabic Extended-A': function (char) {
            return char >= 0x08A0 && char <= 0x08FF;
        },
        // 'Devanagari': (char) => char >= 0x0900 && char <= 0x097F,
        // 'Bengali': (char) => char >= 0x0980 && char <= 0x09FF,
        // 'Gurmukhi': (char) => char >= 0x0A00 && char <= 0x0A7F,
        // 'Gujarati': (char) => char >= 0x0A80 && char <= 0x0AFF,
        // 'Oriya': (char) => char >= 0x0B00 && char <= 0x0B7F,
        // 'Tamil': (char) => char >= 0x0B80 && char <= 0x0BFF,
        // 'Telugu': (char) => char >= 0x0C00 && char <= 0x0C7F,
        // 'Kannada': (char) => char >= 0x0C80 && char <= 0x0CFF,
        // 'Malayalam': (char) => char >= 0x0D00 && char <= 0x0D7F,
        // 'Sinhala': (char) => char >= 0x0D80 && char <= 0x0DFF,
        // 'Thai': (char) => char >= 0x0E00 && char <= 0x0E7F,
        // 'Lao': (char) => char >= 0x0E80 && char <= 0x0EFF,
        // 'Tibetan': (char) => char >= 0x0F00 && char <= 0x0FFF,
        // 'Myanmar': (char) => char >= 0x1000 && char <= 0x109F,
        // 'Georgian': (char) => char >= 0x10A0 && char <= 0x10FF,
        'Hangul Jamo': function (char) {
            return char >= 0x1100 && char <= 0x11FF;
        },
        // 'Ethiopic': (char) => char >= 0x1200 && char <= 0x137F,
        // 'Ethiopic Supplement': (char) => char >= 0x1380 && char <= 0x139F,
        // 'Cherokee': (char) => char >= 0x13A0 && char <= 0x13FF,
        'Unified Canadian Aboriginal Syllabics': function (char) {
            return char >= 0x1400 && char <= 0x167F;
        },
        // 'Ogham': (char) => char >= 0x1680 && char <= 0x169F,
        // 'Runic': (char) => char >= 0x16A0 && char <= 0x16FF,
        // 'Tagalog': (char) => char >= 0x1700 && char <= 0x171F,
        // 'Hanunoo': (char) => char >= 0x1720 && char <= 0x173F,
        // 'Buhid': (char) => char >= 0x1740 && char <= 0x175F,
        // 'Tagbanwa': (char) => char >= 0x1760 && char <= 0x177F,
        'Khmer': function (char) {
            return char >= 0x1780 && char <= 0x17FF;
        },
        // 'Mongolian': (char) => char >= 0x1800 && char <= 0x18AF,
        'Unified Canadian Aboriginal Syllabics Extended': function (char) {
            return char >= 0x18B0 && char <= 0x18FF;
        },
        // 'Limbu': (char) => char >= 0x1900 && char <= 0x194F,
        // 'Tai Le': (char) => char >= 0x1950 && char <= 0x197F,
        // 'New Tai Lue': (char) => char >= 0x1980 && char <= 0x19DF,
        // 'Khmer Symbols': (char) => char >= 0x19E0 && char <= 0x19FF,
        // 'Buginese': (char) => char >= 0x1A00 && char <= 0x1A1F,
        // 'Tai Tham': (char) => char >= 0x1A20 && char <= 0x1AAF,
        // 'Combining Diacritical Marks Extended': (char) => char >= 0x1AB0 && char <= 0x1AFF,
        // 'Balinese': (char) => char >= 0x1B00 && char <= 0x1B7F,
        // 'Sundanese': (char) => char >= 0x1B80 && char <= 0x1BBF,
        // 'Batak': (char) => char >= 0x1BC0 && char <= 0x1BFF,
        // 'Lepcha': (char) => char >= 0x1C00 && char <= 0x1C4F,
        // 'Ol Chiki': (char) => char >= 0x1C50 && char <= 0x1C7F,
        // 'Cyrillic Extended-C': (char) => char >= 0x1C80 && char <= 0x1C8F,
        // 'Georgian Extended': (char) => char >= 0x1C90 && char <= 0x1CBF,
        // 'Sundanese Supplement': (char) => char >= 0x1CC0 && char <= 0x1CCF,
        // 'Vedic Extensions': (char) => char >= 0x1CD0 && char <= 0x1CFF,
        // 'Phonetic Extensions': (char) => char >= 0x1D00 && char <= 0x1D7F,
        // 'Phonetic Extensions Supplement': (char) => char >= 0x1D80 && char <= 0x1DBF,
        // 'Combining Diacritical Marks Supplement': (char) => char >= 0x1DC0 && char <= 0x1DFF,
        // 'Latin Extended Additional': (char) => char >= 0x1E00 && char <= 0x1EFF,
        // 'Greek Extended': (char) => char >= 0x1F00 && char <= 0x1FFF,
        'General Punctuation': function (char) {
            return char >= 0x2000 && char <= 0x206F;
        },
        // 'Superscripts and Subscripts': (char) => char >= 0x2070 && char <= 0x209F,
        // 'Currency Symbols': (char) => char >= 0x20A0 && char <= 0x20CF,
        // 'Combining Diacritical Marks for Symbols': (char) => char >= 0x20D0 && char <= 0x20FF,
        'Letterlike Symbols': function (char) {
            return char >= 0x2100 && char <= 0x214F;
        },
        'Number Forms': function (char) {
            return char >= 0x2150 && char <= 0x218F;
        },
        // 'Arrows': (char) => char >= 0x2190 && char <= 0x21FF,
        // 'Mathematical Operators': (char) => char >= 0x2200 && char <= 0x22FF,
        'Miscellaneous Technical': function (char) {
            return char >= 0x2300 && char <= 0x23FF;
        },
        'Control Pictures': function (char) {
            return char >= 0x2400 && char <= 0x243F;
        },
        'Optical Character Recognition': function (char) {
            return char >= 0x2440 && char <= 0x245F;
        },
        'Enclosed Alphanumerics': function (char) {
            return char >= 0x2460 && char <= 0x24FF;
        },
        // 'Box Drawing': (char) => char >= 0x2500 && char <= 0x257F,
        // 'Block Elements': (char) => char >= 0x2580 && char <= 0x259F,
        'Geometric Shapes': function (char) {
            return char >= 0x25A0 && char <= 0x25FF;
        },
        'Miscellaneous Symbols': function (char) {
            return char >= 0x2600 && char <= 0x26FF;
        },
        // 'Dingbats': (char) => char >= 0x2700 && char <= 0x27BF,
        // 'Miscellaneous Mathematical Symbols-A': (char) => char >= 0x27C0 && char <= 0x27EF,
        // 'Supplemental Arrows-A': (char) => char >= 0x27F0 && char <= 0x27FF,
        // 'Braille Patterns': (char) => char >= 0x2800 && char <= 0x28FF,
        // 'Supplemental Arrows-B': (char) => char >= 0x2900 && char <= 0x297F,
        // 'Miscellaneous Mathematical Symbols-B': (char) => char >= 0x2980 && char <= 0x29FF,
        // 'Supplemental Mathematical Operators': (char) => char >= 0x2A00 && char <= 0x2AFF,
        'Miscellaneous Symbols and Arrows': function (char) {
            return char >= 0x2B00 && char <= 0x2BFF;
        },
        // 'Glagolitic': (char) => char >= 0x2C00 && char <= 0x2C5F,
        // 'Latin Extended-C': (char) => char >= 0x2C60 && char <= 0x2C7F,
        // 'Coptic': (char) => char >= 0x2C80 && char <= 0x2CFF,
        // 'Georgian Supplement': (char) => char >= 0x2D00 && char <= 0x2D2F,
        // 'Tifinagh': (char) => char >= 0x2D30 && char <= 0x2D7F,
        // 'Ethiopic Extended': (char) => char >= 0x2D80 && char <= 0x2DDF,
        // 'Cyrillic Extended-A': (char) => char >= 0x2DE0 && char <= 0x2DFF,
        // 'Supplemental Punctuation': (char) => char >= 0x2E00 && char <= 0x2E7F,
        'CJK Radicals Supplement': function (char) {
            return char >= 0x2E80 && char <= 0x2EFF;
        },
        'Kangxi Radicals': function (char) {
            return char >= 0x2F00 && char <= 0x2FDF;
        },
        'Ideographic Description Characters': function (char) {
            return char >= 0x2FF0 && char <= 0x2FFF;
        },
        'CJK Symbols and Punctuation': function (char) {
            return char >= 0x3000 && char <= 0x303F;
        },
        'Hiragana': function (char) {
            return char >= 0x3040 && char <= 0x309F;
        },
        'Katakana': function (char) {
            return char >= 0x30A0 && char <= 0x30FF;
        },
        'Bopomofo': function (char) {
            return char >= 0x3100 && char <= 0x312F;
        },
        'Hangul Compatibility Jamo': function (char) {
            return char >= 0x3130 && char <= 0x318F;
        },
        'Kanbun': function (char) {
            return char >= 0x3190 && char <= 0x319F;
        },
        'Bopomofo Extended': function (char) {
            return char >= 0x31A0 && char <= 0x31BF;
        },
        'CJK Strokes': function (char) {
            return char >= 0x31C0 && char <= 0x31EF;
        },
        'Katakana Phonetic Extensions': function (char) {
            return char >= 0x31F0 && char <= 0x31FF;
        },
        'Enclosed CJK Letters and Months': function (char) {
            return char >= 0x3200 && char <= 0x32FF;
        },
        'CJK Compatibility': function (char) {
            return char >= 0x3300 && char <= 0x33FF;
        },
        'CJK Unified Ideographs Extension A': function (char) {
            return char >= 0x3400 && char <= 0x4DBF;
        },
        'Yijing Hexagram Symbols': function (char) {
            return char >= 0x4DC0 && char <= 0x4DFF;
        },
        'CJK Unified Ideographs': function (char) {
            return char >= 0x4E00 && char <= 0x9FFF;
        },
        'Yi Syllables': function (char) {
            return char >= 0xA000 && char <= 0xA48F;
        },
        'Yi Radicals': function (char) {
            return char >= 0xA490 && char <= 0xA4CF;
        },
        // 'Lisu': (char) => char >= 0xA4D0 && char <= 0xA4FF,
        // 'Vai': (char) => char >= 0xA500 && char <= 0xA63F,
        // 'Cyrillic Extended-B': (char) => char >= 0xA640 && char <= 0xA69F,
        // 'Bamum': (char) => char >= 0xA6A0 && char <= 0xA6FF,
        // 'Modifier Tone Letters': (char) => char >= 0xA700 && char <= 0xA71F,
        // 'Latin Extended-D': (char) => char >= 0xA720 && char <= 0xA7FF,
        // 'Syloti Nagri': (char) => char >= 0xA800 && char <= 0xA82F,
        // 'Common Indic Number Forms': (char) => char >= 0xA830 && char <= 0xA83F,
        // 'Phags-pa': (char) => char >= 0xA840 && char <= 0xA87F,
        // 'Saurashtra': (char) => char >= 0xA880 && char <= 0xA8DF,
        // 'Devanagari Extended': (char) => char >= 0xA8E0 && char <= 0xA8FF,
        // 'Kayah Li': (char) => char >= 0xA900 && char <= 0xA92F,
        // 'Rejang': (char) => char >= 0xA930 && char <= 0xA95F,
        'Hangul Jamo Extended-A': function (char) {
            return char >= 0xA960 && char <= 0xA97F;
        },
        // 'Javanese': (char) => char >= 0xA980 && char <= 0xA9DF,
        // 'Myanmar Extended-B': (char) => char >= 0xA9E0 && char <= 0xA9FF,
        // 'Cham': (char) => char >= 0xAA00 && char <= 0xAA5F,
        // 'Myanmar Extended-A': (char) => char >= 0xAA60 && char <= 0xAA7F,
        // 'Tai Viet': (char) => char >= 0xAA80 && char <= 0xAADF,
        // 'Meetei Mayek Extensions': (char) => char >= 0xAAE0 && char <= 0xAAFF,
        // 'Ethiopic Extended-A': (char) => char >= 0xAB00 && char <= 0xAB2F,
        // 'Latin Extended-E': (char) => char >= 0xAB30 && char <= 0xAB6F,
        // 'Cherokee Supplement': (char) => char >= 0xAB70 && char <= 0xABBF,
        // 'Meetei Mayek': (char) => char >= 0xABC0 && char <= 0xABFF,
        'Hangul Syllables': function (char) {
            return char >= 0xAC00 && char <= 0xD7AF;
        },
        'Hangul Jamo Extended-B': function (char) {
            return char >= 0xD7B0 && char <= 0xD7FF;
        },
        // 'High Surrogates': (char) => char >= 0xD800 && char <= 0xDB7F,
        // 'High Private Use Surrogates': (char) => char >= 0xDB80 && char <= 0xDBFF,
        // 'Low Surrogates': (char) => char >= 0xDC00 && char <= 0xDFFF,
        'Private Use Area': function (char) {
            return char >= 0xE000 && char <= 0xF8FF;
        },
        'CJK Compatibility Ideographs': function (char) {
            return char >= 0xF900 && char <= 0xFAFF;
        },
        // 'Alphabetic Presentation Forms': (char) => char >= 0xFB00 && char <= 0xFB4F,
        'Arabic Presentation Forms-A': function (char) {
            return char >= 0xFB50 && char <= 0xFDFF;
        },
        // 'Variation Selectors': (char) => char >= 0xFE00 && char <= 0xFE0F,
        'Vertical Forms': function (char) {
            return char >= 0xFE10 && char <= 0xFE1F;
        },
        // 'Combining Half Marks': (char) => char >= 0xFE20 && char <= 0xFE2F,
        'CJK Compatibility Forms': function (char) {
            return char >= 0xFE30 && char <= 0xFE4F;
        },
        'Small Form Variants': function (char) {
            return char >= 0xFE50 && char <= 0xFE6F;
        },
        'Arabic Presentation Forms-B': function (char) {
            return char >= 0xFE70 && char <= 0xFEFF;
        },
        'Halfwidth and Fullwidth Forms': function (char) {
            return char >= 0xFF00 && char <= 0xFFEF;
        }
        // 'Specials': (char) => char >= 0xFFF0 && char <= 0xFFFF,
        // 'Linear B Syllabary': (char) => char >= 0x10000 && char <= 0x1007F,
        // 'Linear B Ideograms': (char) => char >= 0x10080 && char <= 0x100FF,
        // 'Aegean Numbers': (char) => char >= 0x10100 && char <= 0x1013F,
        // 'Ancient Greek Numbers': (char) => char >= 0x10140 && char <= 0x1018F,
        // 'Ancient Symbols': (char) => char >= 0x10190 && char <= 0x101CF,
        // 'Phaistos Disc': (char) => char >= 0x101D0 && char <= 0x101FF,
        // 'Lycian': (char) => char >= 0x10280 && char <= 0x1029F,
        // 'Carian': (char) => char >= 0x102A0 && char <= 0x102DF,
        // 'Coptic Epact Numbers': (char) => char >= 0x102E0 && char <= 0x102FF,
        // 'Old Italic': (char) => char >= 0x10300 && char <= 0x1032F,
        // 'Gothic': (char) => char >= 0x10330 && char <= 0x1034F,
        // 'Old Permic': (char) => char >= 0x10350 && char <= 0x1037F,
        // 'Ugaritic': (char) => char >= 0x10380 && char <= 0x1039F,
        // 'Old Persian': (char) => char >= 0x103A0 && char <= 0x103DF,
        // 'Deseret': (char) => char >= 0x10400 && char <= 0x1044F,
        // 'Shavian': (char) => char >= 0x10450 && char <= 0x1047F,
        // 'Osmanya': (char) => char >= 0x10480 && char <= 0x104AF,
        // 'Osage': (char) => char >= 0x104B0 && char <= 0x104FF,
        // 'Elbasan': (char) => char >= 0x10500 && char <= 0x1052F,
        // 'Caucasian Albanian': (char) => char >= 0x10530 && char <= 0x1056F,
        // 'Linear A': (char) => char >= 0x10600 && char <= 0x1077F,
        // 'Cypriot Syllabary': (char) => char >= 0x10800 && char <= 0x1083F,
        // 'Imperial Aramaic': (char) => char >= 0x10840 && char <= 0x1085F,
        // 'Palmyrene': (char) => char >= 0x10860 && char <= 0x1087F,
        // 'Nabataean': (char) => char >= 0x10880 && char <= 0x108AF,
        // 'Hatran': (char) => char >= 0x108E0 && char <= 0x108FF,
        // 'Phoenician': (char) => char >= 0x10900 && char <= 0x1091F,
        // 'Lydian': (char) => char >= 0x10920 && char <= 0x1093F,
        // 'Meroitic Hieroglyphs': (char) => char >= 0x10980 && char <= 0x1099F,
        // 'Meroitic Cursive': (char) => char >= 0x109A0 && char <= 0x109FF,
        // 'Kharoshthi': (char) => char >= 0x10A00 && char <= 0x10A5F,
        // 'Old South Arabian': (char) => char >= 0x10A60 && char <= 0x10A7F,
        // 'Old North Arabian': (char) => char >= 0x10A80 && char <= 0x10A9F,
        // 'Manichaean': (char) => char >= 0x10AC0 && char <= 0x10AFF,
        // 'Avestan': (char) => char >= 0x10B00 && char <= 0x10B3F,
        // 'Inscriptional Parthian': (char) => char >= 0x10B40 && char <= 0x10B5F,
        // 'Inscriptional Pahlavi': (char) => char >= 0x10B60 && char <= 0x10B7F,
        // 'Psalter Pahlavi': (char) => char >= 0x10B80 && char <= 0x10BAF,
        // 'Old Turkic': (char) => char >= 0x10C00 && char <= 0x10C4F,
        // 'Old Hungarian': (char) => char >= 0x10C80 && char <= 0x10CFF,
        // 'Hanifi Rohingya': (char) => char >= 0x10D00 && char <= 0x10D3F,
        // 'Rumi Numeral Symbols': (char) => char >= 0x10E60 && char <= 0x10E7F,
        // 'Old Sogdian': (char) => char >= 0x10F00 && char <= 0x10F2F,
        // 'Sogdian': (char) => char >= 0x10F30 && char <= 0x10F6F,
        // 'Elymaic': (char) => char >= 0x10FE0 && char <= 0x10FFF,
        // 'Brahmi': (char) => char >= 0x11000 && char <= 0x1107F,
        // 'Kaithi': (char) => char >= 0x11080 && char <= 0x110CF,
        // 'Sora Sompeng': (char) => char >= 0x110D0 && char <= 0x110FF,
        // 'Chakma': (char) => char >= 0x11100 && char <= 0x1114F,
        // 'Mahajani': (char) => char >= 0x11150 && char <= 0x1117F,
        // 'Sharada': (char) => char >= 0x11180 && char <= 0x111DF,
        // 'Sinhala Archaic Numbers': (char) => char >= 0x111E0 && char <= 0x111FF,
        // 'Khojki': (char) => char >= 0x11200 && char <= 0x1124F,
        // 'Multani': (char) => char >= 0x11280 && char <= 0x112AF,
        // 'Khudawadi': (char) => char >= 0x112B0 && char <= 0x112FF,
        // 'Grantha': (char) => char >= 0x11300 && char <= 0x1137F,
        // 'Newa': (char) => char >= 0x11400 && char <= 0x1147F,
        // 'Tirhuta': (char) => char >= 0x11480 && char <= 0x114DF,
        // 'Siddham': (char) => char >= 0x11580 && char <= 0x115FF,
        // 'Modi': (char) => char >= 0x11600 && char <= 0x1165F,
        // 'Mongolian Supplement': (char) => char >= 0x11660 && char <= 0x1167F,
        // 'Takri': (char) => char >= 0x11680 && char <= 0x116CF,
        // 'Ahom': (char) => char >= 0x11700 && char <= 0x1173F,
        // 'Dogra': (char) => char >= 0x11800 && char <= 0x1184F,
        // 'Warang Citi': (char) => char >= 0x118A0 && char <= 0x118FF,
        // 'Nandinagari': (char) => char >= 0x119A0 && char <= 0x119FF,
        // 'Zanabazar Square': (char) => char >= 0x11A00 && char <= 0x11A4F,
        // 'Soyombo': (char) => char >= 0x11A50 && char <= 0x11AAF,
        // 'Pau Cin Hau': (char) => char >= 0x11AC0 && char <= 0x11AFF,
        // 'Bhaiksuki': (char) => char >= 0x11C00 && char <= 0x11C6F,
        // 'Marchen': (char) => char >= 0x11C70 && char <= 0x11CBF,
        // 'Masaram Gondi': (char) => char >= 0x11D00 && char <= 0x11D5F,
        // 'Gunjala Gondi': (char) => char >= 0x11D60 && char <= 0x11DAF,
        // 'Makasar': (char) => char >= 0x11EE0 && char <= 0x11EFF,
        // 'Tamil Supplement': (char) => char >= 0x11FC0 && char <= 0x11FFF,
        // 'Cuneiform': (char) => char >= 0x12000 && char <= 0x123FF,
        // 'Cuneiform Numbers and Punctuation': (char) => char >= 0x12400 && char <= 0x1247F,
        // 'Early Dynastic Cuneiform': (char) => char >= 0x12480 && char <= 0x1254F,
        // 'Egyptian Hieroglyphs': (char) => char >= 0x13000 && char <= 0x1342F,
        // 'Egyptian Hieroglyph Format Controls': (char) => char >= 0x13430 && char <= 0x1343F,
        // 'Anatolian Hieroglyphs': (char) => char >= 0x14400 && char <= 0x1467F,
        // 'Bamum Supplement': (char) => char >= 0x16800 && char <= 0x16A3F,
        // 'Mro': (char) => char >= 0x16A40 && char <= 0x16A6F,
        // 'Bassa Vah': (char) => char >= 0x16AD0 && char <= 0x16AFF,
        // 'Pahawh Hmong': (char) => char >= 0x16B00 && char <= 0x16B8F,
        // 'Medefaidrin': (char) => char >= 0x16E40 && char <= 0x16E9F,
        // 'Miao': (char) => char >= 0x16F00 && char <= 0x16F9F,
        // 'Ideographic Symbols and Punctuation': (char) => char >= 0x16FE0 && char <= 0x16FFF,
        // 'Tangut': (char) => char >= 0x17000 && char <= 0x187FF,
        // 'Tangut Components': (char) => char >= 0x18800 && char <= 0x18AFF,
        // 'Kana Supplement': (char) => char >= 0x1B000 && char <= 0x1B0FF,
        // 'Kana Extended-A': (char) => char >= 0x1B100 && char <= 0x1B12F,
        // 'Small Kana Extension': (char) => char >= 0x1B130 && char <= 0x1B16F,
        // 'Nushu': (char) => char >= 0x1B170 && char <= 0x1B2FF,
        // 'Duployan': (char) => char >= 0x1BC00 && char <= 0x1BC9F,
        // 'Shorthand Format Controls': (char) => char >= 0x1BCA0 && char <= 0x1BCAF,
        // 'Byzantine Musical Symbols': (char) => char >= 0x1D000 && char <= 0x1D0FF,
        // 'Musical Symbols': (char) => char >= 0x1D100 && char <= 0x1D1FF,
        // 'Ancient Greek Musical Notation': (char) => char >= 0x1D200 && char <= 0x1D24F,
        // 'Mayan Numerals': (char) => char >= 0x1D2E0 && char <= 0x1D2FF,
        // 'Tai Xuan Jing Symbols': (char) => char >= 0x1D300 && char <= 0x1D35F,
        // 'Counting Rod Numerals': (char) => char >= 0x1D360 && char <= 0x1D37F,
        // 'Mathematical Alphanumeric Symbols': (char) => char >= 0x1D400 && char <= 0x1D7FF,
        // 'Sutton SignWriting': (char) => char >= 0x1D800 && char <= 0x1DAAF,
        // 'Glagolitic Supplement': (char) => char >= 0x1E000 && char <= 0x1E02F,
        // 'Nyiakeng Puachue Hmong': (char) => char >= 0x1E100 && char <= 0x1E14F,
        // 'Wancho': (char) => char >= 0x1E2C0 && char <= 0x1E2FF,
        // 'Mende Kikakui': (char) => char >= 0x1E800 && char <= 0x1E8DF,
        // 'Adlam': (char) => char >= 0x1E900 && char <= 0x1E95F,
        // 'Indic Siyaq Numbers': (char) => char >= 0x1EC70 && char <= 0x1ECBF,
        // 'Ottoman Siyaq Numbers': (char) => char >= 0x1ED00 && char <= 0x1ED4F,
        // 'Arabic Mathematical Alphabetic Symbols': (char) => char >= 0x1EE00 && char <= 0x1EEFF,
        // 'Mahjong Tiles': (char) => char >= 0x1F000 && char <= 0x1F02F,
        // 'Domino Tiles': (char) => char >= 0x1F030 && char <= 0x1F09F,
        // 'Playing Cards': (char) => char >= 0x1F0A0 && char <= 0x1F0FF,
        // 'Enclosed Alphanumeric Supplement': (char) => char >= 0x1F100 && char <= 0x1F1FF,
        // 'Enclosed Ideographic Supplement': (char) => char >= 0x1F200 && char <= 0x1F2FF,
        // 'Miscellaneous Symbols and Pictographs': (char) => char >= 0x1F300 && char <= 0x1F5FF,
        // 'Emoticons': (char) => char >= 0x1F600 && char <= 0x1F64F,
        // 'Ornamental Dingbats': (char) => char >= 0x1F650 && char <= 0x1F67F,
        // 'Transport and Map Symbols': (char) => char >= 0x1F680 && char <= 0x1F6FF,
        // 'Alchemical Symbols': (char) => char >= 0x1F700 && char <= 0x1F77F,
        // 'Geometric Shapes Extended': (char) => char >= 0x1F780 && char <= 0x1F7FF,
        // 'Supplemental Arrows-C': (char) => char >= 0x1F800 && char <= 0x1F8FF,
        // 'Supplemental Symbols and Pictographs': (char) => char >= 0x1F900 && char <= 0x1F9FF,
        // 'Chess Symbols': (char) => char >= 0x1FA00 && char <= 0x1FA6F,
        // 'Symbols and Pictographs Extended-A': (char) => char >= 0x1FA70 && char <= 0x1FAFF,
        // 'CJK Unified Ideographs Extension B': (char) => char >= 0x20000 && char <= 0x2A6DF,
        // 'CJK Unified Ideographs Extension C': (char) => char >= 0x2A700 && char <= 0x2B73F,
        // 'CJK Unified Ideographs Extension D': (char) => char >= 0x2B740 && char <= 0x2B81F,
        // 'CJK Unified Ideographs Extension E': (char) => char >= 0x2B820 && char <= 0x2CEAF,
        // 'CJK Unified Ideographs Extension F': (char) => char >= 0x2CEB0 && char <= 0x2EBEF,
        // 'CJK Compatibility Ideographs Supplement': (char) => char >= 0x2F800 && char <= 0x2FA1F,
        // 'Tags': (char) => char >= 0xE0000 && char <= 0xE007F,
        // 'Variation Selectors Supplement': (char) => char >= 0xE0100 && char <= 0xE01EF,
        // 'Supplementary Private Use Area-A': (char) => char >= 0xF0000 && char <= 0xFFFFF,
        // 'Supplementary Private Use Area-B': (char) => char >= 0x100000 && char <= 0x10FFFF,
    };

    var ScriptDetection = function ScriptDetection() {
    };

    ScriptDetection.allowsVerticalWritingMode = function(chars){
        for (var i = 0, list = chars; i < list.length; i += 1) {
            var char = list[i];

            if (charHasUprightVerticalOrientation(char.charCodeAt(0))) {
                return true;
            }
        }
        return false;
    };

    ScriptDetection.allowsLetterSpacing = function(chars){
        for (var i = 0, list = chars; i < list.length; i += 1) {
            var char = list[i];

            if (!charAllowsLetterSpacing(char.charCodeAt(0))) {
                return false;
            }
        }
        return true;
    };

    function charAllowsLetterSpacing(char) {
        if (unicodeBlockLookup['Arabic'](char)) {
            return false;
        }
        if (unicodeBlockLookup['Arabic Supplement'](char)) {
            return false;
        }
        if (unicodeBlockLookup['Arabic Extended-A'](char)) {
            return false;
        }
        if (unicodeBlockLookup['Arabic Presentation Forms-A'](char)) {
            return false;
        }
        if (unicodeBlockLookup['Arabic Presentation Forms-B'](char)) {
            return false;
        }

        return true;
    }

    // The following logic comes from
    // <http://www.unicode.org/Public/12.0.0/ucd/VerticalOrientation.txt>.
    // Keep it synchronized with
    // <http://www.unicode.org/Public/UCD/latest/ucd/VerticalOrientation.txt>.
    // The data file denotes with “U” or “Tu” any codepoint that may be drawn
    // upright in vertical text but does not distinguish between upright and
    // “neutral” characters.

    // Blocks in the Unicode supplementary planes are excluded from this module due
    // to <https://github.com/mapbox/mapbox-gl/issues/29>.

    /**
     * Returns true if the given Unicode codepoint identifies a character with
     * upright orientation.
     *
     * A character has upright orientation if it is drawn upright (unrotated)
     * whether the line is oriented horizontally or vertically, even if both
     * adjacent characters can be rotated. For example, a Chinese character is
     * always drawn upright. An uprightly oriented character causes an adjacent
     * “neutral” character to be drawn upright as well.
     * @private
     */
    function charHasUprightVerticalOrientation(char) {
        if (char === 0x02EA /* modifier letter yin departing tone mark */ ||
            char === 0x02EB /* modifier letter yang departing tone mark */) {
            return true;
        }

        // Return early for characters outside all ranges whose characters remain
        // upright in vertical writing mode.
        if (char < 0x1100) {
            return false;
        }

        if (unicodeBlockLookup['Bopomofo Extended'](char)) {
            return true;
        }
        if (unicodeBlockLookup['Bopomofo'](char)) {
            return true;
        }
        if (unicodeBlockLookup['CJK Compatibility Forms'](char)) {
            if (!((char >= 0xFE49 /* dashed overline */ && char <= 0xFE4F) /* wavy low line */)) {
                return true;
            }
        }
        if (unicodeBlockLookup['CJK Compatibility Ideographs'](char)) {
            return true;
        }
        if (unicodeBlockLookup['CJK Compatibility'](char)) {
            return true;
        }
        if (unicodeBlockLookup['CJK Radicals Supplement'](char)) {
            return true;
        }
        if (unicodeBlockLookup['CJK Strokes'](char)) {
            return true;
        }
        if (unicodeBlockLookup['CJK Symbols and Punctuation'](char)) {
            if (!((char >= 0x3008 /* left angle bracket */ && char <= 0x3011) /* right black lenticular bracket */) && !((char >= 0x3014 /* left tortoise shell bracket */ && char <= 0x301F) /* low double prime quotation mark */) &&
                char !== 0x3030 /* wavy dash */) {
                return true;
            }
        }
        if (unicodeBlockLookup['CJK Unified Ideographs Extension A'](char)) {
            return true;
        }
        if (unicodeBlockLookup['CJK Unified Ideographs'](char)) {
            return true;
        }
        if (unicodeBlockLookup['Enclosed CJK Letters and Months'](char)) {
            return true;
        }
        if (unicodeBlockLookup['Hangul Compatibility Jamo'](char)) {
            return true;
        }
        if (unicodeBlockLookup['Hangul Jamo Extended-A'](char)) {
            return true;
        }
        if (unicodeBlockLookup['Hangul Jamo Extended-B'](char)) {
            return true;
        }
        if (unicodeBlockLookup['Hangul Jamo'](char)) {
            return true;
        }
        if (unicodeBlockLookup['Hangul Syllables'](char)) {
            return true;
        }
        if (unicodeBlockLookup['Hiragana'](char)) {
            return true;
        }
        if (unicodeBlockLookup['Ideographic Description Characters'](char)) {
            return true;
        }
        if (unicodeBlockLookup['Kanbun'](char)) {
            return true;
        }
        if (unicodeBlockLookup['Kangxi Radicals'](char)) {
            return true;
        }
        if (unicodeBlockLookup['Katakana Phonetic Extensions'](char)) {
            return true;
        }
        if (unicodeBlockLookup['Katakana'](char)) {
            if (char !== 0x30FC /* katakana-hiragana prolonged sound mark */) {
                return true;
            }
        }
        if (unicodeBlockLookup['Halfwidth and Fullwidth Forms'](char)) {
            if (char !== 0xFF08 /* fullwidth left parenthesis */ &&
                char !== 0xFF09 /* fullwidth right parenthesis */ &&
                char !== 0xFF0D /* fullwidth hyphen-minus */ && !((char >= 0xFF1A /* fullwidth colon */ && char <= 0xFF1E) /* fullwidth greater-than sign */) &&
                char !== 0xFF3B /* fullwidth left square bracket */ &&
                char !== 0xFF3D /* fullwidth right square bracket */ &&
                char !== 0xFF3F /* fullwidth low line */ && !(char >= 0xFF5B /* fullwidth left curly bracket */ && char <= 0xFFDF) &&
                char !== 0xFFE3 /* fullwidth macron */ && !(char >= 0xFFE8 /* halfwidth forms light vertical */ && char <= 0xFFEF)) {
                return true;
            }
        }
        if (unicodeBlockLookup['Small Form Variants'](char)) {
            if (!((char >= 0xFE58 /* small em dash */ && char <= 0xFE5E) /* small right tortoise shell bracket */) && !((char >= 0xFE63 /* small hyphen-minus */ && char <= 0xFE66) /* small equals sign */)) {
                return true;
            }
        }
        if (unicodeBlockLookup['Unified Canadian Aboriginal Syllabics'](char)) {
            return true;
        }
        if (unicodeBlockLookup['Unified Canadian Aboriginal Syllabics Extended'](char)) {
            return true;
        }
        if (unicodeBlockLookup['Vertical Forms'](char)) {
            return true;
        }
        if (unicodeBlockLookup['Yijing Hexagram Symbols'](char)) {
            return true;
        }
        if (unicodeBlockLookup['Yi Syllables'](char)) {
            return true;
        }
        if (unicodeBlockLookup['Yi Radicals'](char)) {
            return true;
        }

        return false;
    }

    function charInRTLScript(char) {
        // Main blocks for Hebrew, Arabic, Thaana and other RTL scripts
        return (char >= 0x0590 && char <= 0x08FF) ||
            unicodeBlockLookup['Arabic Presentation Forms-A'](char) ||
            unicodeBlockLookup['Arabic Presentation Forms-B'](char);
    }

    ScriptDetection.stringContainsRTLText = function(chars){
        for (var i = 0, list = chars; i < list.length; i += 1) {
            var char = list[i];

            if (charInRTLScript(char.charCodeAt(0))) {
                return true;
            }
        }
        return false;
    };

    var vectorTileFeatureTypes$2 = ['Unknown', 'Point', 'LineString', 'Polygon'];

    // Opacity arrays are frequently updated but don't contain a lot of information, so we pack them
    // tight. Each Uint32 is actually four duplicate Uint8s for the four corners of a glyph
    // 7 bits are for the current opacity, and the lowest bit is the target opacity

    // actually defined in symbol_attributes.js
    // const placementOpacityAttributes = [
    //     { name: 'a_fade_opacity', components: 1, type: 'Uint32' }
    // ];
    var shaderOpacityAttributes = [
        {name: 'a_fade_opacity', components: 1, type: 'Uint8', offset: 0}
    ];

    function addVertex$1(array, anchorX, anchorY, ox, oy, tx, ty, sizeVertex, isSDF, pixelOffsetX, pixelOffsetY, minFontScaleX, minFontScaleY) {
        var aSizeX = sizeVertex ? Math.min(MAX_PACKED_SIZE, Math.round(sizeVertex[0])) : 0;
        var aSizeY = sizeVertex ? Math.min(MAX_PACKED_SIZE, Math.round(sizeVertex[1])) : 0;
        array.emplaceBack(
            // a_pos_offset
            anchorX,
            anchorY,
            Math.round(ox * 32),
            Math.round(oy * 32),

            // a_data
            tx, // x coordinate of symbol on glyph atlas texture
            ty, // y coordinate of symbol on glyph atlas texture
            (aSizeX << 1) + (isSDF ? 1 : 0),
            aSizeY,
            pixelOffsetX * 16,
            pixelOffsetY * 16,
            minFontScaleX * 256,
            minFontScaleY * 256
        );
    }

    function addDynamicAttributes(dynamicLayoutVertexArray, p, angle) {
        dynamicLayoutVertexArray.emplaceBack(p.x, p.y, angle);
        dynamicLayoutVertexArray.emplaceBack(p.x, p.y, angle);
        dynamicLayoutVertexArray.emplaceBack(p.x, p.y, angle);
        dynamicLayoutVertexArray.emplaceBack(p.x, p.y, angle);
    }

    function containsRTLText(formattedText) {
        for (var i = 0, list = formattedText.sections; i < list.length; i += 1) {
            var section = list[i];

            if (ScriptDetection.stringContainsRTLText(section.text)) {
                return true;
            }
        }
        return false;
    }

    var SymbolBuffers = function SymbolBuffers(programConfigurations) {
        this.layoutVertexArray = new StructArrayLayout4i4ui4i24();
        this.indexArray = new StructArrayLayout3ui6();
        this.programConfigurations = programConfigurations;
        this.segments = new SegmentVector();
        this.dynamicLayoutVertexArray = new StructArrayLayout3f12();
        this.opacityVertexArray = new StructArrayLayout1ul4();
        this.placedSymbolArray = new PlacedSymbolArray();
    };

    SymbolBuffers.prototype.upload = function upload(context, dynamicIndexBuffer, upload$1, update) {
        if (upload$1) {
            this.layoutVertexBuffer = context.createVertexBuffer(this.layoutVertexArray, SymbolAttributes.symbolLayoutAttributes.members);
            this.indexBuffer = context.createIndexBuffer(this.indexArray, dynamicIndexBuffer);
            this.dynamicLayoutVertexBuffer = context.createVertexBuffer(this.dynamicLayoutVertexArray, SymbolAttributes.dynamicLayoutAttributes.members, true);
            this.opacityVertexBuffer = context.createVertexBuffer(this.opacityVertexArray, shaderOpacityAttributes, true);
            // This is a performance hack so that we can write to opacityVertexArray with uint32s
            // even though the shaders read uint8s
            this.opacityVertexBuffer.itemSize = 1;
        }
        if (upload$1 || update) {
            this.programConfigurations.upload(context);
        }
    };

    SymbolBuffers.prototype.destroy = function destroy() {
        if (!this.layoutVertexBuffer) {
            return;
        }
        this.layoutVertexBuffer.destroy();
        this.indexBuffer.destroy();
        this.programConfigurations.destroy();
        this.segments.destroy();
        this.dynamicLayoutVertexBuffer.destroy();
        this.opacityVertexBuffer.destroy();
    };

    SymbolBuffers.prototype.clear = function clear() {

    };

    WebWorkerTransfer.register('SymbolBuffers', SymbolBuffers);

    var CollisionBuffers = function CollisionBuffers(LayoutArray, layoutAttributes, IndexArray) {
        this.layoutVertexArray = new LayoutArray();
        this.layoutAttributes = layoutAttributes;
        this.indexArray = new IndexArray();
        this.segments = new SegmentVector();
        this.collisionVertexArray = new StructArrayLayout2ub2f12();
    };

    CollisionBuffers.prototype.upload = function upload(context) {
        this.layoutVertexBuffer = context.createVertexBuffer(this.layoutVertexArray, this.layoutAttributes);
        this.indexBuffer = context.createIndexBuffer(this.indexArray);
        this.collisionVertexBuffer = context.createVertexBuffer(this.collisionVertexArray, collisionVertexAttributes.members, true);
    };

    CollisionBuffers.prototype.destroy = function destroy() {
        if (!this.layoutVertexBuffer) {
            return;
        }
        this.layoutVertexBuffer.destroy();
        this.indexBuffer.destroy();
        this.segments.destroy();
        this.collisionVertexBuffer.destroy();
    };

    WebWorkerTransfer.register('CollisionBuffers', CollisionBuffers);

    /**
     * Unlike other buckets, which simply implement #addFeature with type-specific
     * logic for (essentially) triangulating feature geometries, SymbolBucket
     * requires specialized behavior:
     *
     * 1. WorkerTile#parse(), the logical owner of the bucket creation process,
     *    calls SymbolBucket#populate(), which resolves text and icon tokens on
     *    each feature, adds each glyphs and symbols needed to the passed-in
     *    collections options.glyphDependencies and options.iconDependencies, and
     *    stores the feature data for use in subsequent step (this.features).
     *
     * 2. WorkerTile asynchronously requests from the main thread all of the glyphs
     *    and icons needed (by this bucket and any others). When glyphs and icons
     *    have been received, the WorkerTile creates a CollisionIndex and invokes:
     *
     * 3. performSymbolLayout(bucket, stacks, icons) perform texts shaping and
     *    layout on a Symbol Bucket. This step populates:
     *      `this.symbolInstances`: metadata on generated symbols
     *      `this.collisionBoxArray`: collision data for use by foreground
     *      `this.text`: SymbolBuffers for text symbols
     *      `this.icons`: SymbolBuffers for icons
     *      `this.iconCollisionBox`: Debug SymbolBuffers for icon collision boxes
     *      `this.textCollisionBox`: Debug SymbolBuffers for text collision boxes
     *      `this.iconCollisionCircle`: Debug SymbolBuffers for icon collision circles
     *      `this.textCollisionCircle`: Debug SymbolBuffers for text collision circles
     *    The results are sent to the foreground for rendering
     *
     * 4. performSymbolPlacement(bucket, collisionIndex) is run on the foreground,
     *    and uses the CollisionIndex along with current camera settings to determine
     *    which symbols can actually show on the map. Collided symbols are hidden
     *    using a dynamic "OpacityVertexArray".
     *
     * @private
     */
    var SymbolBucket = function SymbolBucket(options) {
        this.collisionBoxArray = options.collisionBoxArray;
        this.zoom = options.zoom;
        this.overscaling = options.overscaling;
        this.layers = options.layers;
        this.layerIds = this.layers.map(function (layer) {
            return layer.id;
        });
        this.index = options.index;
        this.pixelRatio = options.pixelRatio;
        this.sourceLayerIndex = options.sourceLayerIndex;
        this.hasPattern = false;
        this.hasPaintOverrides = false;
        this.hasRTLText = false;

        var layer = this.layers[0];
        var unevaluatedLayoutValues = layer._unevaluatedLayout._values;

        this.textSizeData = symbolSize.getSizeData(this.zoom, unevaluatedLayoutValues['text-size']);
        this.iconSizeData = symbolSize.getSizeData(this.zoom, unevaluatedLayoutValues['icon-size']);

        var layout = this.layers[0].layout;
        var sortKey = layout.get('symbol-sort-key');
        var zOrder = layout.get('symbol-z-order');
        this.sortFeaturesByKey = zOrder !== 'viewport-y' && sortKey.constantOr(1) !== undefined;
        var zOrderByViewportY = zOrder === 'viewport-y' || (zOrder === 'auto' && !this.sortFeaturesByKey);
        this.sortFeaturesByY = zOrderByViewportY && (layout.get('text-allow-overlap') || layout.get('icon-allow-overlap') ||
            layout.get('text-ignore-placement') || layout.get('icon-ignore-placement'));

        if (layout.get('symbol-placement') === 'point') {
            this.writingModes = layout.get('text-writing-mode').map(function (wm) {
                return Shaping.WritingMode[wm];
            });
        }

        this.stateDependentLayerIds = this.layers.filter(function (l) {
            return l.isStateDependent();
        }).map(function (l) {
                return l.id;
            });

        this.sourceID = options.sourceID;
    };

    SymbolBucket.prototype.createArrays = function createArrays() {
    //        var layout = this.layers[0].layout;
    //        //this.hasPaintOverrides = SymbolStyleLayer.hasPaintOverrides(layout);
    //        this.hasPaintOverrides = false;
    //
    //        this.text = new SymbolBuffers(new ProgramConfigurationSet(SymbolAttributes.symbolLayoutAttributes.members, this.layers, this.zoom, function (property) {
    //            return /^text/.test(property);
    //        }));
    //        this.icon = new SymbolBuffers(new ProgramConfigurationSet(SymbolAttributes.symbolLayoutAttributes.members, this.layers, this.zoom, function (property) {
    //            return /^icon/.test(property);
    //        }));
    //
    //        this.textCollisionBox = new CollisionBuffers(StructArrayLayout2i2i2i12, SymbolAttributes.collisionBoxLayout.members, StructArrayLayout2ui4);
    //        this.iconCollisionBox = new CollisionBuffers(StructArrayLayout2i2i2i12, SymbolAttributes.collisionBoxLayout.members, StructArrayLayout2ui4);
    //        this.textCollisionCircle = new CollisionBuffers(StructArrayLayout2i2i2i12, SymbolAttributes.collisionCircleLayout.members, StructArrayLayout3ui6);
    //        this.iconCollisionCircle = new CollisionBuffers(StructArrayLayout2i2i2i12, SymbolAttributes.collisionCircleLayout.members, StructArrayLayout3ui6);
    //
    //        this.glyphOffsetArray = new GlyphOffsetArray();
    //        this.lineVertexArray = new SymbolLineVertexArray();
    //        this.symbolInstances = new SymbolInstanceArray();
    };

    SymbolBucket.prototype.calculateGlyphDependencies = function calculateGlyphDependencies(text, stack, textAlongLine, allowVerticalPlacement, doesAllowVerticalWritingMode) {
        for (var i = 0; i < text.length; i++) {
            stack[text.charCodeAt(i)] = true;
        }
    };

    SymbolBucket.prototype.populate = function populate(features, options) {
        var layer = this.layers[0];
        var layout = layer.layout;

        var textFont = layout.get('text-font');
        var textField = layout.get('text-field');
        var iconImage = layout.get('icon-image');
        var hasText =
            (textField.value.kind !== 'constant' ||
                (textField.value.value instanceof Formatted$1 && !textField.value.value.isEmpty()) ||
                textField.value.value.toString().length > 0) &&
                (textFont.value.kind !== 'constant' || textFont.value.value.length > 0);
        // we should always resolve the icon-image value if the property was defined in the style
        // this allows us to fire the styleimagemissing event if image evaluation returns null
        // the only way to distinguish between null returned from a coalesce statement with no valid images
        // and null returned because icon-image wasn't defined is to check whether or not iconImage.parameters is an empty object
        var hasIcon = (iconImage.value.kind !== 'constant' || !!iconImage.value.value) && Object.keys(iconImage.parameters).length > 0;
        var symbolSortKey = layout.get('symbol-sort-key');

        this.features = [];

        if (!hasText && !hasIcon) {
            return;
        }

        var icons = options.iconDependencies;
        var stacks = options.glyphDependencies;
        var availableImages = options.availableImages;
        var globalProperties = new EvaluationParameters$1(this.zoom);

        for (var i$1 = 0, list$1 = features; i$1 < list$1.length; i$1 += 1) {
            var ref = list$1[i$1];
            var feature = ref.feature;
            var index = ref.index;
            var sourceLayerIndex = ref.sourceLayerIndex;

            if (!layer._featureFilter(globalProperties, feature)) {
                continue;
            }

            var text = (void 0);
            if (hasText) {
                // Expression evaluation will automatically coerce to Formatted
                // but plain string token evaluation skips that pathway so do the
                // conversion here.
                var resolvedTokens = layer.getValueAndResolveTokens('text-field', feature, availableImages);
                var formattedText = Formatted$1.factory(resolvedTokens);
                if (containsRTLText(formattedText)) {
                    this.hasRTLText = true;
                }
                if (
                    !this.hasRTLText || // non-rtl text so can proceed safely
                        getRTLTextPluginStatus() === 'unavailable' || // We don't intend to lazy-load the rtl text plugin, so proceed with incorrect shaping
                        this.hasRTLText && plugin.isParsed() // Use the rtlText plugin to shape text
                    ) {
                    text = transformText$1(formattedText, layer, feature);
                }
            }

            var icon = (void 0);
            if (hasIcon) {
                // Expression evaluation will automatically coerce to Image
                // but plain string token evaluation skips that pathway so do the
                // conversion here.
                var resolvedTokens$1 = layer.getValueAndResolveTokens('icon-image', feature, availableImages);
                if (resolvedTokens$1 instanceof ResolvedImage$1) {
                    icon = resolvedTokens$1;
                } else {
                    icon = ResolvedImage$1.fromString(resolvedTokens$1);
                }
            }

            if (!text && !icon) {
                continue;
            }

            var sortKey = this.sortFeaturesByKey ?
                symbolSortKey.evaluate(feature, {}) :
                undefined;

            var symbolFeature = {
                text: text,
                icon: icon,
                index: index,
                sourceLayerIndex: sourceLayerIndex,
                geometry: loadGeometry(feature),
                properties: feature.properties,
                type: vectorTileFeatureTypes$2[feature.type],
                sortKey: sortKey
            };
            if (typeof feature.id !== 'undefined') {
                symbolFeature.id = feature.id;
            }
            this.features.push(symbolFeature);

            if (icon) {
                icons[icon.name] = true;
            }

            if (text) {
                var fontStack = textFont.evaluate(feature, {}).join(',');
                var textAlongLine = layout.get('text-rotation-alignment') === 'map' && layout.get('symbol-placement') !== 'point';
                this.allowVerticalPlacement = this.writingModes && this.writingModes.indexOf(Shaping.WritingMode.vertical) >= 0;
                for (var i = 0, list = text.sections; i < list.length; i += 1) {
                    var section = list[i];

                    if (!section.image) {
                        var doesAllowVerticalWritingMode = ScriptDetection.allowsVerticalWritingMode(text.toString());
                        var sectionFont = section.fontStack || fontStack;
                        var sectionStack = stacks[sectionFont] = stacks[sectionFont] || {};
                        this.calculateGlyphDependencies(section.text, sectionStack, textAlongLine, this.allowVerticalPlacement, doesAllowVerticalWritingMode);
                    } else {
                        // Add section image to the list of dependencies.
                        icons[section.image.name] = true;
                    }
                }
            }
        }

        if (layout.get('symbol-placement') === 'line') {
            // Merge adjacent lines with the same text to improve labelling.
            // It's better to place labels on one long line than on many short segments.
            this.features = mergeLines(this.features);
        }

        if (this.sortFeaturesByKey) {
            this.features.sort(function (a, b) {
                // a.sortKey is always a number when sortFeaturesByKey is true
                return ((a.sortKey   )      ) - ((b.sortKey   )      );
            });
        }
    };

    SymbolBucket.prototype.update = function update(states, vtLayer, imagePositions) {
        if (!this.stateDependentLayers.length) {
            return;
        }
        this.text.programConfigurations.updatePaintArrays(states, vtLayer, this.layers, imagePositions);
        this.icon.programConfigurations.updatePaintArrays(states, vtLayer, this.layers, imagePositions);
    };

    SymbolBucket.prototype.isEmpty = function isEmpty() {
        // When the bucket encounters only rtl-text but the plugin isnt loaded, no symbol instances will be created.
        // In order for the bucket to be serialized, and not discarded as an empty bucket both checks are necessary.
        return this.symbolInstances.length === 0 && !this.hasRTLText;
    };

    SymbolBucket.prototype.uploadPending = function uploadPending() {
        return !this.uploaded || this.text.programConfigurations.needsUpload || this.icon.programConfigurations.needsUpload;
    };

    SymbolBucket.prototype.upload = function upload(context) {
    //        if (!this.uploaded) {
    //            this.textCollisionBox.upload(context);
    //            this.iconCollisionBox.upload(context);
    //            this.textCollisionCircle.upload(context);
    //            this.iconCollisionCircle.upload(context);
    //        }
    //        this.text.upload(context, this.sortFeaturesByY, !this.uploaded, this.text.programConfigurations.needsUpload);
    //        this.icon.upload(context, this.sortFeaturesByY, !this.uploaded, this.icon.programConfigurations.needsUpload);
    //        this.uploaded = true;
    };

    SymbolBucket.prototype.destroy = function destroy() {
    //        this.text.destroy();
    //        this.icon.destroy();
    //        this.textCollisionBox.destroy();
    //        this.iconCollisionBox.destroy();
    //        this.textCollisionCircle.destroy();
    //        this.iconCollisionCircle.destroy();
    };

    SymbolBucket.prototype.clear = function clear() {
    };

    SymbolBucket.prototype.addToLineVertexArray = function addToLineVertexArray(anchor, line) {
        var lineStartIndex = this.lineVertexArray.length;
        if (anchor.segment !== undefined) {
            var sumForwardLength = anchor.dist(line[anchor.segment + 1]);
            var sumBackwardLength = anchor.dist(line[anchor.segment]);
            var vertices = {};
            for (var i = anchor.segment + 1; i < line.length; i++) {
                vertices[i] = {x: line[i].x, y: line[i].y, tileUnitDistanceFromAnchor: sumForwardLength};
                if (i < line.length - 1) {
                    sumForwardLength += line[i + 1].dist(line[i]);
                }
            }
            for (var i$1 = anchor.segment || 0; i$1 >= 0; i$1--) {
                vertices[i$1] = {x: line[i$1].x, y: line[i$1].y, tileUnitDistanceFromAnchor: sumBackwardLength};
                if (i$1 > 0) {
                    sumBackwardLength += line[i$1 - 1].dist(line[i$1]);
                }
            }
            for (var i$2 = 0; i$2 < line.length; i$2++) {
                var vertex = vertices[i$2];
                this.lineVertexArray.emplaceBack(vertex.x, vertex.y, vertex.tileUnitDistanceFromAnchor);
            }
        }
        return {
            lineStartIndex: lineStartIndex,
            lineLength: this.lineVertexArray.length - lineStartIndex
        };
    };

    SymbolBucket.prototype.addSymbols = function addSymbols(arrays, quads, sizeVertex, lineOffset, alongLine, feature, writingMode, labelAnchor, lineStartIndex, lineLength, associatedIconIndex) {
        var this$1 = this;

        var indexArray = arrays.indexArray;
        var layoutVertexArray = arrays.layoutVertexArray;
        var dynamicLayoutVertexArray = arrays.dynamicLayoutVertexArray;

        var segment = arrays.segments.prepareSegment(4 * quads.length, arrays.layoutVertexArray, arrays.indexArray, feature.sortKey);
        var glyphOffsetArrayStart = this.glyphOffsetArray.length;
        var vertexStartIndex = segment.vertexLength;

        var angle = (this.allowVerticalPlacement && writingMode === Shaping.WritingMode.vertical) ? Math.PI / 2 : 0;

        var addSymbol = function (symbol) {
            var tl = symbol.tl,
                tr = symbol.tr,
                bl = symbol.bl,
                br = symbol.br,
                tex = symbol.tex,
                pixelOffsetTL = symbol.pixelOffsetTL,
                pixelOffsetBR = symbol.pixelOffsetBR,
                mfsx = symbol.minFontScaleX,
                mfsy = symbol.minFontScaleY;

            var index = segment.vertexLength;

            var y = symbol.glyphOffset[1];
            addVertex$1(layoutVertexArray, labelAnchor.x, labelAnchor.y, tl.x, y + tl.y, tex.x, tex.y, sizeVertex, symbol.isSDF, pixelOffsetTL.x, pixelOffsetTL.y, mfsx, mfsy);
            addVertex$1(layoutVertexArray, labelAnchor.x, labelAnchor.y, tr.x, y + tr.y, tex.x + tex.w, tex.y, sizeVertex, symbol.isSDF, pixelOffsetBR.x, pixelOffsetTL.y, mfsx, mfsy);
            addVertex$1(layoutVertexArray, labelAnchor.x, labelAnchor.y, bl.x, y + bl.y, tex.x, tex.y + tex.h, sizeVertex, symbol.isSDF, pixelOffsetTL.x, pixelOffsetBR.y, mfsx, mfsy);
            addVertex$1(layoutVertexArray, labelAnchor.x, labelAnchor.y, br.x, y + br.y, tex.x + tex.w, tex.y + tex.h, sizeVertex, symbol.isSDF, pixelOffsetBR.x, pixelOffsetBR.y, mfsx, mfsy);

            addDynamicAttributes(dynamicLayoutVertexArray, labelAnchor, angle);

            indexArray.emplaceBack(index, index + 1, index + 2);
            indexArray.emplaceBack(index + 1, index + 2, index + 3);

            segment.vertexLength += 4;
            segment.primitiveLength += 2;

            this$1.glyphOffsetArray.emplaceBack(symbol.glyphOffset[0]);
        };

        if (feature.text && feature.text.sections) {
            var sections = feature.text.sections;

            if (this.hasPaintOverrides) {
                var currentSectionIndex;
                var populatePaintArrayForSection = function (sectionIndex, lastSection) {
                    if (currentSectionIndex !== undefined && (currentSectionIndex !== sectionIndex || lastSection)) {
                        arrays.programConfigurations.populatePaintArrays(arrays.layoutVertexArray.length, feature, feature.index, {}, sections[currentSectionIndex]);
                    }
                    currentSectionIndex = sectionIndex;
                };

                for (var i = 0, list = quads; i < list.length; i += 1) {
                    var symbol = list[i];

                    populatePaintArrayForSection(symbol.sectionIndex, false);
                    addSymbol(symbol);
                }

                // Populate paint arrays for the last section.
                populatePaintArrayForSection(currentSectionIndex, true);
            } else {
                for (var i$1 = 0, list$1 = quads; i$1 < list$1.length; i$1 += 1) {
                    var symbol$1 = list$1[i$1];

                    addSymbol(symbol$1);
                }
                arrays.programConfigurations.populatePaintArrays(arrays.layoutVertexArray.length, feature, feature.index, {}, sections[0]);
            }

        } else {
            for (var i$2 = 0, list$2 = quads; i$2 < list$2.length; i$2 += 1) {
                var symbol$2 = list$2[i$2];

                addSymbol(symbol$2);
            }
            arrays.programConfigurations.populatePaintArrays(arrays.layoutVertexArray.length, feature, feature.index, {});
        }

        arrays.placedSymbolArray.emplaceBack(labelAnchor.x, labelAnchor.y,
            glyphOffsetArrayStart, this.glyphOffsetArray.length - glyphOffsetArrayStart, vertexStartIndex,
            lineStartIndex, lineLength, (labelAnchor.segment   ),
            sizeVertex ? sizeVertex[0] : 0, sizeVertex ? sizeVertex[1] : 0,
            lineOffset[0], lineOffset[1],
            writingMode,
            // placedOrientation is null initially; will be updated to horizontal(1)/vertical(2) if placed
            0,
            (false   ),
            // The crossTileID is only filled/used on the foreground for dynamic text anchors
            0,
            associatedIconIndex
        );
    };

    SymbolBucket.prototype._addCollisionDebugVertex = function _addCollisionDebugVertex(layoutVertexArray, collisionVertexArray, point, anchorX, anchorY, extrude) {
        collisionVertexArray.emplaceBack(0, 0);
        return layoutVertexArray.emplaceBack(
            // pos
            point.x,
            point.y,
            // a_anchor_pos
            anchorX,
            anchorY,
            // extrude
            Math.round(extrude.x),
            Math.round(extrude.y));
    };

    SymbolBucket.prototype.addCollisionDebugVertices = function addCollisionDebugVertices(x1, y1, x2, y2, arrays, boxAnchorPoint, symbolInstance, isCircle) {
        var segment = arrays.segments.prepareSegment(4, arrays.layoutVertexArray, arrays.indexArray);
        var index = segment.vertexLength;

        var layoutVertexArray = arrays.layoutVertexArray;
        var collisionVertexArray = arrays.collisionVertexArray;

        var anchorX = symbolInstance.anchorX;
        var anchorY = symbolInstance.anchorY;

        this._addCollisionDebugVertex(layoutVertexArray, collisionVertexArray, boxAnchorPoint, anchorX, anchorY, new pointGeometry(x1, y1));
        this._addCollisionDebugVertex(layoutVertexArray, collisionVertexArray, boxAnchorPoint, anchorX, anchorY, new pointGeometry(x2, y1));
        this._addCollisionDebugVertex(layoutVertexArray, collisionVertexArray, boxAnchorPoint, anchorX, anchorY, new pointGeometry(x2, y2));
        this._addCollisionDebugVertex(layoutVertexArray, collisionVertexArray, boxAnchorPoint, anchorX, anchorY, new pointGeometry(x1, y2));

        segment.vertexLength += 4;
        if (isCircle) {
            var indexArray = (arrays.indexArray   );
            indexArray.emplaceBack(index, index + 1, index + 2);
            indexArray.emplaceBack(index, index + 2, index + 3);

            segment.primitiveLength += 2;
        } else {
            var indexArray$1 = (arrays.indexArray   );
            indexArray$1.emplaceBack(index, index + 1);
            indexArray$1.emplaceBack(index + 1, index + 2);
            indexArray$1.emplaceBack(index + 2, index + 3);
            indexArray$1.emplaceBack(index + 3, index);

            segment.primitiveLength += 4;
        }
    };

    SymbolBucket.prototype.addDebugCollisionBoxes = function addDebugCollisionBoxes(startIndex, endIndex, symbolInstance, isText) {
        for (var b = startIndex; b < endIndex; b++) {
            var box = (this.collisionBoxArray.get(b)   );
            var x1 = box.x1;
            var y1 = box.y1;
            var x2 = box.x2;
            var y2 = box.y2;

            // If the radius > 0, this collision box is actually a circle
            // The data we add to the buffers is exactly the same, but we'll render with a different shader.
            var isCircle = box.radius > 0;
            this.addCollisionDebugVertices(x1, y1, x2, y2, isCircle ?
                (isText ? this.textCollisionCircle : this.iconCollisionCircle) : (isText ? this.textCollisionBox : this.iconCollisionBox),
                box.anchorPoint, symbolInstance, isCircle);
        }
    };

    SymbolBucket.prototype.generateCollisionDebugBuffers = function generateCollisionDebugBuffers() {
        for (var i = 0; i < this.symbolInstances.length; i++) {
            var symbolInstance = this.symbolInstances.get(i);
            this.addDebugCollisionBoxes(symbolInstance.textBoxStartIndex, symbolInstance.textBoxEndIndex, symbolInstance, true);
            this.addDebugCollisionBoxes(symbolInstance.verticalTextBoxStartIndex, symbolInstance.verticalTextBoxEndIndex, symbolInstance, true);
            this.addDebugCollisionBoxes(symbolInstance.iconBoxStartIndex, symbolInstance.iconBoxEndIndex, symbolInstance, false);
            this.addDebugCollisionBoxes(symbolInstance.verticalIconBoxStartIndex, symbolInstance.verticalIconBoxEndIndex, symbolInstance, false);
        }
    };

    // These flat arrays are meant to be quicker to iterate over than the source
    // CollisionBoxArray
    SymbolBucket.prototype._deserializeCollisionBoxesForSymbol = function _deserializeCollisionBoxesForSymbol(collisionBoxArray, textStartIndex, textEndIndex, verticalTextStartIndex, verticalTextEndIndex, iconStartIndex, iconEndIndex, verticalIconStartIndex, verticalIconEndIndex) {

        var collisionArrays = {};
        for (var k = textStartIndex; k < textEndIndex; k++) {
            var box = (collisionBoxArray.get(k)   );
            if (box.radius === 0) {
                collisionArrays.textBox = {x1: box.x1, y1: box.y1, x2: box.x2, y2: box.y2, anchorPointX: box.anchorPointX, anchorPointY: box.anchorPointY};
                collisionArrays.textFeatureIndex = box.featureIndex;
                break; // Only one box allowed per instance
            } else {
                if (!collisionArrays.textCircles) {
                    collisionArrays.textCircles = [];
                    collisionArrays.textFeatureIndex = box.featureIndex;
                }
                var used = 1; // May be updated at collision detection time
                collisionArrays.textCircles.push(box.anchorPointX, box.anchorPointY, box.radius, box.signedDistanceFromAnchor, used);
            }
        }
        for (var k$1 = verticalTextStartIndex; k$1 < verticalTextEndIndex; k$1++) {
            var box$1 = (collisionBoxArray.get(k$1)   );
            if (box$1.radius === 0) {
                collisionArrays.verticalTextBox = {x1: box$1.x1, y1: box$1.y1, x2: box$1.x2, y2: box$1.y2, anchorPointX: box$1.anchorPointX, anchorPointY: box$1.anchorPointY};
                collisionArrays.verticalTextFeatureIndex = box$1.featureIndex;
                break; // Only one box allowed per instance
            }
        }
        for (var k$2 = iconStartIndex; k$2 < iconEndIndex; k$2++) {
            // An icon can only have one box now, so this indexing is a bit vestigial...
            var box$2 = (collisionBoxArray.get(k$2)   );
            if (box$2.radius === 0) {
                collisionArrays.iconBox = {x1: box$2.x1, y1: box$2.y1, x2: box$2.x2, y2: box$2.y2, anchorPointX: box$2.anchorPointX, anchorPointY: box$2.anchorPointY};
                collisionArrays.iconFeatureIndex = box$2.featureIndex;
                break; // Only one box allowed per instance
            }
        }
        for (var k$3 = verticalIconStartIndex; k$3 < verticalIconEndIndex; k$3++) {
            // An icon can only have one box now, so this indexing is a bit vestigial...
            var box$3 = (collisionBoxArray.get(k$3)   );
            if (box$3.radius === 0) {
                collisionArrays.verticalIconBox = {x1: box$3.x1, y1: box$3.y1, x2: box$3.x2, y2: box$3.y2, anchorPointX: box$3.anchorPointX, anchorPointY: box$3.anchorPointY};
                collisionArrays.verticalIconFeatureIndex = box$3.featureIndex;
                break; // Only one box allowed per instance
            }
        }
        return collisionArrays;
    };

    SymbolBucket.prototype.deserializeCollisionBoxes = function deserializeCollisionBoxes(collisionBoxArray) {
        this.collisionArrays = [];
        for (var i = 0; i < this.symbolInstances.length; i++) {
            var symbolInstance = this.symbolInstances.get(i);
            this.collisionArrays.push(this._deserializeCollisionBoxesForSymbol(
                collisionBoxArray,
                symbolInstance.textBoxStartIndex,
                symbolInstance.textBoxEndIndex,
                symbolInstance.verticalTextBoxStartIndex,
                symbolInstance.verticalTextBoxEndIndex,
                symbolInstance.iconBoxStartIndex,
                symbolInstance.iconBoxEndIndex,
                symbolInstance.verticalIconBoxStartIndex,
                symbolInstance.verticalIconBoxEndIndex
            ));
        }
    };

    SymbolBucket.prototype.hasTextData = function hasTextData() {
        return this.text.segments.get().length > 0;
    };

    SymbolBucket.prototype.hasIconData = function hasIconData() {
        return this.icon.segments.get().length > 0;
    };

    SymbolBucket.prototype.hasTextCollisionBoxData = function hasTextCollisionBoxData() {
        return this.textCollisionBox.segments.get().length > 0;
    };

    SymbolBucket.prototype.hasIconCollisionBoxData = function hasIconCollisionBoxData() {
        return this.iconCollisionBox.segments.get().length > 0;
    };

    SymbolBucket.prototype.hasTextCollisionCircleData = function hasTextCollisionCircleData() {
        return this.textCollisionCircle.segments.get().length > 0;
    };

    SymbolBucket.prototype.hasIconCollisionCircleData = function hasIconCollisionCircleData() {
        return this.iconCollisionCircle.segments.get().length > 0;
    };

    SymbolBucket.prototype.addIndicesForPlacedSymbol = function addIndicesForPlacedSymbol(iconOrText, placedSymbolIndex) {
        var placedSymbol = iconOrText.placedSymbolArray.get(placedSymbolIndex);

        var endIndex = placedSymbol.vertexStartIndex + placedSymbol.numGlyphs * 4;
        for (var vertexIndex = placedSymbol.vertexStartIndex; vertexIndex < endIndex; vertexIndex += 4) {
            iconOrText.indexArray.emplaceBack(vertexIndex, vertexIndex + 1, vertexIndex + 2);
            iconOrText.indexArray.emplaceBack(vertexIndex + 1, vertexIndex + 2, vertexIndex + 3);
        }
    };

    SymbolBucket.prototype.getSortedSymbolIndexes = function getSortedSymbolIndexes(angle) {
        if (this.sortedAngle === angle && this.symbolInstanceIndexes !== undefined) {
            return this.symbolInstanceIndexes;
        }
        var sin = Math.sin(angle);
        var cos = Math.cos(angle);
        var rotatedYs = [];
        var featureIndexes = [];
        var result = [];

        for (var i = 0; i < this.symbolInstances.length; ++i) {
            result.push(i);
            var symbolInstance = this.symbolInstances.get(i);
            rotatedYs.push(Math.round(sin * symbolInstance.anchorX + cos * symbolInstance.anchorY) | 0);
            featureIndexes.push(symbolInstance.featureIndex);
        }

        result.sort(function (aIndex, bIndex) {
            return (rotatedYs[aIndex] - rotatedYs[bIndex]) ||
                (featureIndexes[bIndex] - featureIndexes[aIndex]);
        });

        return result;
    };

    SymbolBucket.prototype.sortFeatures = function sortFeatures(angle) {
        var this$1 = this;

        if (!this.sortFeaturesByY) {
            return;
        }
        if (this.sortedAngle === angle) {
            return;
        }

        // The current approach to sorting doesn't sort across segments so don't try.
        // Sorting within segments separately seemed not to be worth the complexity.
        if (this.text.segments.get().length > 1 || this.icon.segments.get().length > 1) {
            return;
        }

        // If the symbols are allowed to overlap sort them by their vertical screen position.
        // The index array buffer is rewritten to reference the (unchanged) vertices in the
        // sorted order.

        // To avoid sorting the actual symbolInstance array we sort an array of indexes.
        this.symbolInstanceIndexes = this.getSortedSymbolIndexes(angle);
        this.sortedAngle = angle;

        this.text.indexArray.clear();
        this.icon.indexArray.clear();

        this.featureSortOrder = [];

        for (var i$1 = 0, list = this.symbolInstanceIndexes; i$1 < list.length; i$1 += 1) {
            var i = list[i$1];

            var symbolInstance = this.symbolInstances.get(i);
            this.featureSortOrder.push(symbolInstance.featureIndex);

            [
                symbolInstance.rightJustifiedTextSymbolIndex,
                symbolInstance.centerJustifiedTextSymbolIndex,
                symbolInstance.leftJustifiedTextSymbolIndex
            ].forEach(function (index, i, array) {
                    // Only add a given index the first time it shows up,
                    // to avoid duplicate opacity entries when multiple justifications
                    // share the same glyphs.
                    if (index >= 0 && array.indexOf(index) === i) {
                        this$1.addIndicesForPlacedSymbol(this$1.text, index);
                    }
                });

            if (symbolInstance.verticalPlacedTextSymbolIndex >= 0) {
                this.addIndicesForPlacedSymbol(this.text, symbolInstance.verticalPlacedTextSymbolIndex);
            }

            if (symbolInstance.placedIconSymbolIndex >= 0) {
                this.addIndicesForPlacedSymbol(this.icon, symbolInstance.placedIconSymbolIndex);
            }

            if (symbolInstance.verticalPlacedIconSymbolIndex >= 0) {
                this.addIndicesForPlacedSymbol(this.icon, symbolInstance.verticalPlacedIconSymbolIndex);
            }
        }

        if (this.text.indexBuffer) {
            this.text.indexBuffer.updateData(this.text.indexArray);
        }
        if (this.icon.indexBuffer) {
            this.icon.indexBuffer.updateData(this.icon.indexArray);
        }
    };

    WebWorkerTransfer.register('SymbolBucket', SymbolBucket, {
        //omit: ['layers', 'collisionBoxArray', 'features', 'compareText']
        omit: ['layers', 'collisionBoxArray', 'compareText']
    });

    // this constant is based on the size of StructArray indexes used in a symbol
    // bucket--namely, glyphOffsetArrayStart
    // eg the max valid UInt16 is 65,535
    // See https://github.com/mapbox/mapbox-gl-js/issues/2907 for motivation
    // lineStartIndex and textBoxStartIndex could potentially be concerns
    // but we expect there to be many fewer boxes/lines than glyphs
    SymbolBucket.MAX_GLYPHS = 65535;

    SymbolBucket.addDynamicAttributes = addDynamicAttributes;

    var ColorType$7 = {kind: 'color'};
    var FormattedType$4 = {kind: 'formatted'};

    var layout$7 = new Properties({
        "symbol-placement": new DataConstantProperty(StyleSpec["layout_symbol"]["symbol-placement"]),
        "symbol-spacing": new DataConstantProperty(StyleSpec["layout_symbol"]["symbol-spacing"]),
        "symbol-avoid-edges": new DataConstantProperty(StyleSpec["layout_symbol"]["symbol-avoid-edges"]),
        "symbol-sort-key": new DataDrivenProperty(StyleSpec["layout_symbol"]["symbol-sort-key"]),
        "symbol-z-order": new DataConstantProperty(StyleSpec["layout_symbol"]["symbol-z-order"]),
        "icon-allow-overlap": new DataConstantProperty(StyleSpec["layout_symbol"]["icon-allow-overlap"]),
        "icon-ignore-placement": new DataConstantProperty(StyleSpec["layout_symbol"]["icon-ignore-placement"]),
        "icon-optional": new DataConstantProperty(StyleSpec["layout_symbol"]["icon-optional"]),
        "icon-rotation-alignment": new DataConstantProperty(StyleSpec["layout_symbol"]["icon-rotation-alignment"]),
        "icon-size": new DataDrivenProperty(StyleSpec["layout_symbol"]["icon-size"]),
        "icon-text-fit": new DataConstantProperty(StyleSpec["layout_symbol"]["icon-text-fit"]),
        "icon-text-fit-padding": new DataConstantProperty(StyleSpec["layout_symbol"]["icon-text-fit-padding"]),
        "icon-image": new DataDrivenProperty(StyleSpec["layout_symbol"]["icon-image"]),
        "icon-rotate": new DataDrivenProperty(StyleSpec["layout_symbol"]["icon-rotate"]),
        "icon-padding": new DataConstantProperty(StyleSpec["layout_symbol"]["icon-padding"]),
        "icon-keep-upright": new DataConstantProperty(StyleSpec["layout_symbol"]["icon-keep-upright"]),
        "icon-offset": new DataDrivenProperty(StyleSpec["layout_symbol"]["icon-offset"]),
        "icon-anchor": new DataDrivenProperty(StyleSpec["layout_symbol"]["icon-anchor"]),
        "icon-pitch-alignment": new DataConstantProperty(StyleSpec["layout_symbol"]["icon-pitch-alignment"]),
        "text-pitch-alignment": new DataConstantProperty(StyleSpec["layout_symbol"]["text-pitch-alignment"]),
        "text-rotation-alignment": new DataConstantProperty(StyleSpec["layout_symbol"]["text-rotation-alignment"]),
        "text-field": new DataDrivenProperty(StyleSpec["layout_symbol"]["text-field"]),
        "text-font": new DataDrivenProperty(StyleSpec["layout_symbol"]["text-font"]),
        "text-size": new DataDrivenProperty(StyleSpec["layout_symbol"]["text-size"]),
        "text-max-width": new DataDrivenProperty(StyleSpec["layout_symbol"]["text-max-width"]),
        "text-line-height": new DataConstantProperty(StyleSpec["layout_symbol"]["text-line-height"]),
        "text-letter-spacing": new DataDrivenProperty(StyleSpec["layout_symbol"]["text-letter-spacing"]),
        "text-justify": new DataDrivenProperty(StyleSpec["layout_symbol"]["text-justify"]),
        "text-radial-offset": new DataDrivenProperty(StyleSpec["layout_symbol"]["text-radial-offset"]),
        "text-variable-anchor": new DataConstantProperty(StyleSpec["layout_symbol"]["text-variable-anchor"]),
        "text-anchor": new DataDrivenProperty(StyleSpec["layout_symbol"]["text-anchor"]),
        "text-max-angle": new DataConstantProperty(StyleSpec["layout_symbol"]["text-max-angle"]),
        "text-writing-mode": new DataConstantProperty(StyleSpec["layout_symbol"]["text-writing-mode"]),
        "text-rotate": new DataDrivenProperty(StyleSpec["layout_symbol"]["text-rotate"]),
        "text-padding": new DataConstantProperty(StyleSpec["layout_symbol"]["text-padding"]),
        "text-keep-upright": new DataConstantProperty(StyleSpec["layout_symbol"]["text-keep-upright"]),
        "text-transform": new DataDrivenProperty(StyleSpec["layout_symbol"]["text-transform"]),
        "text-offset": new DataDrivenProperty(StyleSpec["layout_symbol"]["text-offset"]),
        "text-allow-overlap": new DataConstantProperty(StyleSpec["layout_symbol"]["text-allow-overlap"]),
        "text-ignore-placement": new DataConstantProperty(StyleSpec["layout_symbol"]["text-ignore-placement"]),
        "text-optional": new DataConstantProperty(StyleSpec["layout_symbol"]["text-optional"])
    });


    var paint$7 = new Properties({
        "icon-opacity": new DataDrivenProperty(StyleSpec["paint_symbol"]["icon-opacity"]),
        "icon-color": new DataDrivenProperty(StyleSpec["paint_symbol"]["icon-color"]),
        "icon-halo-color": new DataDrivenProperty(StyleSpec["paint_symbol"]["icon-halo-color"]),
        "icon-halo-width": new DataDrivenProperty(StyleSpec["paint_symbol"]["icon-halo-width"]),
        "icon-halo-blur": new DataDrivenProperty(StyleSpec["paint_symbol"]["icon-halo-blur"]),
        "icon-translate": new DataConstantProperty(StyleSpec["paint_symbol"]["icon-translate"]),
        "icon-translate-anchor": new DataConstantProperty(StyleSpec["paint_symbol"]["icon-translate-anchor"]),
        "text-opacity": new DataDrivenProperty(StyleSpec["paint_symbol"]["text-opacity"]),
        "text-color": new DataDrivenProperty(StyleSpec["paint_symbol"]["text-color"], { runtimeType: ColorType$7, getOverride: function (o) {
            return o.textColor;
        }, hasOverride: function (o) {
            return !!o.textColor;
        } }),
        "text-halo-color": new DataDrivenProperty(StyleSpec["paint_symbol"]["text-halo-color"]),
        "text-halo-width": new DataDrivenProperty(StyleSpec["paint_symbol"]["text-halo-width"]),
        "text-halo-blur": new DataDrivenProperty(StyleSpec["paint_symbol"]["text-halo-blur"]),
        "text-translate": new DataConstantProperty(StyleSpec["paint_symbol"]["text-translate"]),
        "text-translate-anchor": new DataConstantProperty(StyleSpec["paint_symbol"]["text-translate-anchor"])
    });

    // Note: without adding the explicit type annotation, Flow infers weaker types
    // for these objects from their use in the constructor to StyleLayer, as
    // {layout?: Properties<...>, paint: Properties<...>}
    var properties$6 = ({ paint: paint$7, layout: layout$7 }
        );

    var SymbolStyleLayer = /*@__PURE__*/(function (StyleLayer) {
        function SymbolStyleLayer(layer) {
            StyleLayer.call(this, layer, properties$6);
        }

        if (StyleLayer) SymbolStyleLayer.__proto__ = StyleLayer;
        SymbolStyleLayer.prototype = Object.create(StyleLayer && StyleLayer.prototype);
        SymbolStyleLayer.prototype.constructor = SymbolStyleLayer;

        SymbolStyleLayer.prototype.recalculate = function recalculate(parameters, availableImages) {
            StyleLayer.prototype.recalculate.call(this, parameters, availableImages);

            if (this.layout.get('icon-rotation-alignment') === 'auto') {
                if (this.layout.get('symbol-placement') !== 'point') {
                    this.layout._values['icon-rotation-alignment'] = 'map';
                } else {
                    this.layout._values['icon-rotation-alignment'] = 'viewport';
                }
            }

            if (this.layout.get('text-rotation-alignment') === 'auto') {
                if (this.layout.get('symbol-placement') !== 'point') {
                    this.layout._values['text-rotation-alignment'] = 'map';
                } else {
                    this.layout._values['text-rotation-alignment'] = 'viewport';
                }
            }

            // If unspecified, `*-pitch-alignment` inherits `*-rotation-alignment`
            if (this.layout.get('text-pitch-alignment') === 'auto') {
                this.layout._values['text-pitch-alignment'] = this.layout.get('text-rotation-alignment');
            }
            if (this.layout.get('icon-pitch-alignment') === 'auto') {
                this.layout._values['icon-pitch-alignment'] = this.layout.get('icon-rotation-alignment');
            }

            if (this.layout.get('symbol-placement') === 'point') {
                var writingModes = this.layout.get('text-writing-mode');
                if (writingModes) {
                    // remove duplicates, preserving order
                    var deduped = [];
                    for (var i = 0, list = writingModes; i < list.length; i += 1) {
                        var m = list[i];

                        if (deduped.indexOf(m) < 0) {
                            deduped.push(m);
                        }
                    }
                    this.layout._values['text-writing-mode'] = deduped;
                } else {
                    this.layout._values['text-writing-mode'] = ['horizontal'];
                }
            }

            this._setPaintOverrides();
        };

        SymbolStyleLayer.prototype.getValueAndResolveTokens = function getValueAndResolveTokens(name, feature, availableImages) {
            var value = this.layout.get(name).evaluate(feature, {}, availableImages);
            var unevaluated = this._unevaluatedLayout._values[name];
            if (!unevaluated.isDataDriven() && !Expression.isExpression(unevaluated.value) && value) {
                return Util.resolveTokens(feature.properties, value);
            }

            return value;
        };

        SymbolStyleLayer.prototype.createBucket = function createBucket(parameters) {
            return new SymbolBucket(parameters);
        };

        SymbolStyleLayer.prototype.queryRadius = function queryRadius() {
            return 0;
        };

        SymbolStyleLayer.prototype.queryIntersectsFeature = function queryIntersectsFeature() {
            assert_1(false); // Should take a different path in FeatureIndex
            return false;
        };

        SymbolStyleLayer.prototype._setPaintOverrides = function _setPaintOverrides() {
            for (var i = 0, list = properties$6.paint.overridableProperties; i < list.length; i += 1) {
                var overridable = list[i];

                if (!SymbolStyleLayer.hasPaintOverride(this.layout, overridable)) {
                    continue;
                }
                var overriden = this.paint.get(overridable);
                var override = new FormatSectionOverride(overriden);
                var styleExpression = new StyleExpression(override, overriden.property.specification);
                var expression = null;
                if (overriden.value.kind === 'constant' || overriden.value.kind === 'source') {
                    expression = (new ZoomConstantExpression('source', styleExpression)                  );
                } else {
                    expression = (new ZoomDependentExpression('composite',
                        styleExpression,
                        overriden.value.zoomStops,
                        overriden.value._interpolationType)                     );
                }
                this.paint._values[overridable] = new PossiblyEvaluatedPropertyValue(overriden.property,
                    expression,
                    overriden.parameters);
            }
        };

        SymbolStyleLayer.prototype._handleOverridablePaintPropertyUpdate = function _handleOverridablePaintPropertyUpdate(name, oldValue, newValue) {
            if (!this.layout || oldValue.isDataDriven() || newValue.isDataDriven()) {
                return false;
            }
            return SymbolStyleLayer.hasPaintOverride(this.layout, name);
        };

        SymbolStyleLayer.hasPaintOverride = function hasPaintOverride(layout, propertyName) {
            var textField = layout.get('text-field');
            var property = properties$6.paint.properties[propertyName];
            var hasOverrides = false;

            var checkSections = function (sections) {
                for (var i = 0, list = sections; i < list.length; i += 1) {
                    var section = list[i];

                    if (property.overrides && property.overrides.hasOverride(section)) {
                        hasOverrides = true;
                        return;
                    }
                }
            };

            if (textField.value.kind === 'constant' && textField.value.value instanceof Formatted$1) {
                checkSections(textField.value.value.sections);
            } else if (textField.value.kind === 'source') {

                var checkExpression = function (expression) {
                    if (hasOverrides) {
                        return;
                    }

                    if (expression instanceof Literal && Values$1.typeOf(expression.value) === FormattedType$4) {
                        var formatted = ((expression.value)     );
                        checkSections(formatted.sections);
                    } else if (expression instanceof FormatExpression$1) {
                        checkSections(expression.sections);
                    } else {
                        expression.eachChild(checkExpression);
                    }
                };

                var expr = ((textField.value)     );
                if (expr._styleExpression) {
                    checkExpression(expr._styleExpression.expression);
                }
            }

            return hasOverrides;
        };

        SymbolStyleLayer.hasPaintOverrides = function hasPaintOverrides(layout) {
            for (var i = 0, list = properties$6.paint.overridableProperties; i < list.length; i += 1) {
                var overridable = list[i];

                if (SymbolStyleLayer.hasPaintOverride(layout, overridable)) {
                    return true;
                }
            }
            return false;
        };

        return SymbolStyleLayer;
    }(StyleLayer));

    var subclasses = {
        circle: CircleStyleLayer,
        fill: FillStyleLayer,
        line: LineStyleLayer,
        symbol : SymbolStyleLayer
    };

    function createStyleLayer(layer) {
        if(subclasses[layer.type]){
            return new subclasses[layer.type](layer);
        }
        else{
            return null;
        }
    }

    var StyleLayerIndex = function StyleLayerIndex(layerConfigs) {
        this.keyCache = {};
        if (layerConfigs) {
            this.replace(layerConfigs);
        }
    };

    StyleLayerIndex.prototype.replace = function replace (layerConfigs) {
        this._layerConfigs = {};
        this._layers = {};
        this.update(layerConfigs, []);
    };

    function values(obj) {
        var result = [];
        for (var k in obj) {
            result.push(obj[k]);
        }
        return result;
    }

    StyleLayerIndex.prototype.update = function update (layerConfigs, removedIds) {
        var this$1 = this;

        for (var i = 0, list = layerConfigs; i < list.length; i += 1) {
            var layerConfig = list[i];

            this._layerConfigs[layerConfig.id] = layerConfig;

            var layer = createStyleLayer(layerConfig);
            if(layer == null){
                continue;
            }
            this._layers[layerConfig.id] = layer;
            layer._featureFilter = featureFilter.createFilter(layer.filter);
            if (this.keyCache[layerConfig.id])
            { delete this.keyCache[layerConfig.id]; }
        }
        for (var i$1 = 0, list$1 = removedIds; i$1 < list$1.length; i$1 += 1) {
            var id = list$1[i$1];

            delete this.keyCache[id];
            delete this._layerConfigs[id];
            delete this._layers[id];
        }

        this.familiesBySource = {};

        var groups = groupByLayout(values(this._layerConfigs), this.keyCache);

        for (var i$2 = 0, list$2 = groups; i$2 < list$2.length; i$2 += 1) {
            var layerConfigs$1 = list$2[i$2];

            var layers = layerConfigs$1.map(function (layerConfig) { return this$1._layers[layerConfig.id]; });

            var layer$1 = layers[0];
            if (layer$1 == undefined || layer$1.visibility === 'none') {
                continue;
            }

            var sourceId = layer$1.source || '';
            var sourceGroup = this.familiesBySource[sourceId];
            if (!sourceGroup) {
                sourceGroup = this.familiesBySource[sourceId] = {};
            }

            var sourceLayerId = layer$1.sourceLayer;
            var sourceLayerFamilies = sourceGroup[sourceLayerId];
            if (!sourceLayerFamilies) {
                sourceLayerFamilies = sourceGroup[sourceLayerId] = [];
            }

            sourceLayerFamilies.push(layers);
        }
    };

    WebWorkerTransfer.register('FeatureIndex', FeatureIndex, {omit: ['rawTileData', 'sourceLayerCoder']});

    function MVTWorkTile(parameters, transferableObjects) {
        var pbfData = parameters.pbfData;
        var layers = parameters.layers;
        var imageMap = parameters.imageMap;
        var serializeObj = WebWorkerTransfer.deserialize(parameters.serializeObj);
        var featureIndex = serializeObj.featureIndex;
        var zoom = parameters.tileID.z;
        if(!when.defined(featureIndex)){
            featureIndex = new FeatureIndex(parameters.tileID);
            featureIndex.bucketLayerIDs = [];
        }
        var result = {};
        try {
            var styleIndexLayer = new StyleLayerIndex(layers);
            var vectorTile = loadVectorTile(pbfData);
            result = parse(vectorTile, styleIndexLayer, imageMap, featureIndex, zoom, parameters.indexData);
            result = WebWorkerTransfer.serialize(result, transferableObjects);
        }
        catch (err) {
        }
        return result;
    }

    function loadVectorTile(rawData) {
        if (!when.defined(rawData)) {
            return;
        }
        return new VectorTile(new pbf.Protobuf(rawData));
    }

    function parse(vectorTile, layerIndex, imageMap, featureIndex, zoom, indexData) {
        var sourceLayerCoder = new DictionaryCoder(Object.keys(vectorTile.layers).sort());
        var buckets = {};
        var options = {
            featureIndex: featureIndex,
            iconDependencies: {},
            patternDependencies: {},
            glyphDependencies: {},
            //availableImages: availableImages
        };

        for (var source in layerIndex.familiesBySource) {
            //if (source == "") continue;
            var layerFamilies = layerIndex.familiesBySource[source];
            for (var sourceLayerId in layerFamilies) {
                var sourceLayer = vectorTile.layers[sourceLayerId];
                if (!sourceLayer) {
                    continue;
                }

                var sourceLayerIndex = sourceLayerCoder.encode(sourceLayerId);
                var features = [];
                for (var index = 0; index < sourceLayer.length; index++) {
                    var feature = sourceLayer.feature(index);
                    features.push({feature: feature, index: index, sourceLayerIndex: sourceLayerIndex});
                }

                for (var i = 0, list = layerFamilies[sourceLayerId]; i < list.length; i += 1) {
                    var family = list[i];
                    var layer = family[0];
    //                    if(defined(layer.minzoom) && zoom < Math.floor(layer.minzoom)){
    //                        continue;
    //                    }
    //                    if(defined(layer.maxzoom) && zoom >= layer.maxzoom){
    //                        continue;
    //                    }
                    if (layer.visibility === 'none') {
                        continue;
                    }

                    //recalculateLayers(family, this.zoom, availableImages);
                    recalculateLayers(family, 0, null);
                    var bucketName = layer.id;
                    var bucket = buckets[bucketName] = layer.createBucket({
                        index: featureIndex.bucketLayerIDs.length,
                        layers: family,
    //                    zoom: this.zoom,
    //                    pixelRatio: this.pixelRatio,
    //                    overscaling : this.overscaling,
    //                    collisionBoxArray: this.collisionBoxArray,
                        sourceLayerIndex: sourceLayerIndex,
                        //sourceID: this.source
                    });

                    if (when.defined(indexData) && when.defined(indexData[layer.id])) {
                        options.indexData = indexData[layer.id];
                    }
                    bucket.populate(features, options);
                    featureIndex.bucketLayerIDs.push(family.map(function (l) { return l.id; }));
                }
            }
        }

        var imageAtlas = null;

        for (var key in buckets) {
            var bucket = buckets[key];
            if (bucket.hasPattern &&
                (bucket instanceof LineBucket || bucket instanceof FillBucket)) {
                //recalculateLayers(bucket.layers, this.zoom, availableImages);
                if(imageAtlas == null){
                    imageAtlas = new ImageAtlas({}, imageMap);
                }
                bucket.addFeatures(options, imageAtlas.patternPositions);
            }
        }

        return {
            buckets : buckets,
            imageAtlas : imageAtlas,
            featureIndex : featureIndex
        };
    }

    function recalculateLayers(layers, zoom, availableImages) {
        // Layers are shared and may have been used by a WorkerTile with a different zoom.
        var parameters = new EvaluationParameters$1(zoom);
        for (var i = 0, list = layers; i < list.length; i += 1) {
            var layer = list[i];
            layer.recalculate(parameters, availableImages);
        }
    }

    var MVTWorkTile$1 = createTaskProcessorWorker(MVTWorkTile);

    return MVTWorkTile$1;

});

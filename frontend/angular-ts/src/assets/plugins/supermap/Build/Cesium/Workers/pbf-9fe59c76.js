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

    var read = function (buffer, offset, isLE, mLen, nBytes) {
        var e, m;
        var eLen = (nBytes * 8) - mLen - 1;
        var eMax = (1 << eLen) - 1;
        var eBias = eMax >> 1;
        var nBits = -7;
        var i = isLE ? (nBytes - 1) : 0;
        var d = isLE ? -1 : 1;
        var s = buffer[offset + i];
        i += d;
        e = s & ((1 << (-nBits)) - 1);
        s >>= (-nBits);
        nBits += eLen;
        for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}
        m = e & ((1 << (-nBits)) - 1);
        e >>= (-nBits);
        nBits += mLen;
        for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}
        if (e === 0) {
            e = 1 - eBias;
        } else if (e === eMax) {
            return m ? NaN : ((s ? -1 : 1) * Infinity)
        } else {
            m = m + Math.pow(2, mLen);
            e = e - eBias;
        }
        return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
    };
    var write = function (buffer, value, offset, isLE, mLen, nBytes) {
        var e, m, c;
        var eLen = (nBytes * 8) - mLen - 1;
        var eMax = (1 << eLen) - 1;
        var eBias = eMax >> 1;
        var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
        var i = isLE ? 0 : (nBytes - 1);
        var d = isLE ? 1 : -1;
        var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;
        value = Math.abs(value);
        if (isNaN(value) || value === Infinity) {
            m = isNaN(value) ? 1 : 0;
            e = eMax;
        } else {
            e = Math.floor(Math.log(value) / Math.LN2);
            if (value * (c = Math.pow(2, -e)) < 1) {
                e--;
                c *= 2;
            }
            if (e + eBias >= 1) {
                value += rt / c;
            } else {
                value += rt * Math.pow(2, 1 - eBias);
            }
            if (value * c >= 2) {
                e++;
                c /= 2;
            }
            if (e + eBias >= eMax) {
                m = 0;
                e = eMax;
            } else if (e + eBias >= 1) {
                m = ((value * c) - 1) * Math.pow(2, mLen);
                e = e + eBias;
            } else {
                m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
                e = 0;
            }
        }
        for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}
        e = (e << mLen) | m;
        eLen += mLen;
        for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}
        buffer[offset + i - d] |= s * 128;
    };
    var ieee754 = {
        read: read,
        write: write
    };

    function Pbf(buf) {
        this.buf = ArrayBuffer.isView && ArrayBuffer.isView(buf) ? buf : new Uint8Array(buf || 0);
        this.pos = 0;
        this.type = 0;
        this.length = this.buf.length;
    }
    Pbf.Varint  = 0;
    Pbf.Fixed64 = 1;
    Pbf.Bytes   = 2;
    Pbf.Fixed32 = 5;
    var SHIFT_LEFT_32 = (1 << 16) * (1 << 16);
    var SHIFT_RIGHT_32 = 1 / SHIFT_LEFT_32;
    Pbf.prototype = {
        destroy: function() {
            this.buf = null;
        },
        readFields: function(readField, result, end) {
            end = end || this.length;
            while (this.pos < end) {
                var val = this.readVarint(),
                    tag = val >> 3,
                    startPos = this.pos;
                this.type = val & 0x7;
                readField(tag, result, this);
                if (this.pos === startPos) this.skip(val);
            }
            return result;
        },
        readMessage: function(readField, result) {
            return this.readFields(readField, result, this.readVarint() + this.pos);
        },
        readFixed32: function() {
            var val = readUInt32(this.buf, this.pos);
            this.pos += 4;
            return val;
        },
        readSFixed32: function() {
            var val = readInt32(this.buf, this.pos);
            this.pos += 4;
            return val;
        },
        readFixed64: function() {
            var val = readUInt32(this.buf, this.pos) + readUInt32(this.buf, this.pos + 4) * SHIFT_LEFT_32;
            this.pos += 8;
            return val;
        },
        readSFixed64: function() {
            var val = readUInt32(this.buf, this.pos) + readInt32(this.buf, this.pos + 4) * SHIFT_LEFT_32;
            this.pos += 8;
            return val;
        },
        readFloat: function() {
            var val = ieee754.read(this.buf, this.pos, true, 23, 4);
            this.pos += 4;
            return val;
        },
        readDouble: function() {
            var val = ieee754.read(this.buf, this.pos, true, 52, 8);
            this.pos += 8;
            return val;
        },
        readVarint: function(isSigned) {
            var buf = this.buf,
                val, b;
            b = buf[this.pos++]; val  =  b & 0x7f;        if (b < 0x80) return val;
            b = buf[this.pos++]; val |= (b & 0x7f) << 7;  if (b < 0x80) return val;
            b = buf[this.pos++]; val |= (b & 0x7f) << 14; if (b < 0x80) return val;
            b = buf[this.pos++]; val |= (b & 0x7f) << 21; if (b < 0x80) return val;
            b = buf[this.pos];   val |= (b & 0x0f) << 28;
            return readVarintRemainder(val, isSigned, this);
        },
        readVarint64: function() {
            return this.readVarint(true);
        },
        readSVarint: function() {
            var num = this.readVarint();
            return num % 2 === 1 ? (num + 1) / -2 : num / 2;
        },
        readBoolean: function() {
            return Boolean(this.readVarint());
        },
        readString: function() {
            var end = this.readVarint() + this.pos,
                str = readUtf8(this.buf, this.pos, end);
            this.pos = end;
            return str;
        },
        readBytes: function() {
            var end = this.readVarint() + this.pos,
                buffer = this.buf.subarray(this.pos, end);
            this.pos = end;
            return buffer;
        },
        readPackedVarint: function(arr, isSigned) {
            var end = readPackedEnd(this);
            arr = arr || [];
            while (this.pos < end) arr.push(this.readVarint(isSigned));
            return arr;
        },
        readPackedSVarint: function(arr) {
            var end = readPackedEnd(this);
            arr = arr || [];
            while (this.pos < end) arr.push(this.readSVarint());
            return arr;
        },
        readPackedBoolean: function(arr) {
            var end = readPackedEnd(this);
            arr = arr || [];
            while (this.pos < end) arr.push(this.readBoolean());
            return arr;
        },
        readPackedFloat: function(arr) {
            var end = readPackedEnd(this);
            arr = arr || [];
            while (this.pos < end) arr.push(this.readFloat());
            return arr;
        },
        readPackedDouble: function(arr) {
            var end = readPackedEnd(this);
            arr = arr || [];
            while (this.pos < end) arr.push(this.readDouble());
            return arr;
        },
        readPackedFixed32: function(arr) {
            var end = readPackedEnd(this);
            arr = arr || [];
            while (this.pos < end) arr.push(this.readFixed32());
            return arr;
        },
        readPackedSFixed32: function(arr) {
            var end = readPackedEnd(this);
            arr = arr || [];
            while (this.pos < end) arr.push(this.readSFixed32());
            return arr;
        },
        readPackedFixed64: function(arr) {
            var end = readPackedEnd(this);
            arr = arr || [];
            while (this.pos < end) arr.push(this.readFixed64());
            return arr;
        },
        readPackedSFixed64: function(arr) {
            var end = readPackedEnd(this);
            arr = arr || [];
            while (this.pos < end) arr.push(this.readSFixed64());
            return arr;
        },
        skip: function(val) {
            var type = val & 0x7;
            if (type === Pbf.Varint) while (this.buf[this.pos++] > 0x7f) {}
            else if (type === Pbf.Bytes) this.pos = this.readVarint() + this.pos;
            else if (type === Pbf.Fixed32) this.pos += 4;
            else if (type === Pbf.Fixed64) this.pos += 8;
            else throw new Error('Unimplemented type: ' + type);
        },
        writeTag: function(tag, type) {
            this.writeVarint((tag << 3) | type);
        },
        realloc: function(min) {
            var length = this.length || 16;
            while (length < this.pos + min) length *= 2;
            if (length !== this.length) {
                var buf = new Uint8Array(length);
                buf.set(this.buf);
                this.buf = buf;
                this.length = length;
            }
        },
        finish: function() {
            this.length = this.pos;
            this.pos = 0;
            return this.buf.subarray(0, this.length);
        },
        writeFixed32: function(val) {
            this.realloc(4);
            writeInt32(this.buf, val, this.pos);
            this.pos += 4;
        },
        writeSFixed32: function(val) {
            this.realloc(4);
            writeInt32(this.buf, val, this.pos);
            this.pos += 4;
        },
        writeFixed64: function(val) {
            this.realloc(8);
            writeInt32(this.buf, val & -1, this.pos);
            writeInt32(this.buf, Math.floor(val * SHIFT_RIGHT_32), this.pos + 4);
            this.pos += 8;
        },
        writeSFixed64: function(val) {
            this.realloc(8);
            writeInt32(this.buf, val & -1, this.pos);
            writeInt32(this.buf, Math.floor(val * SHIFT_RIGHT_32), this.pos + 4);
            this.pos += 8;
        },
        writeVarint: function(val) {
            val = +val || 0;
            if (val > 0xfffffff || val < 0) {
                writeBigVarint(val, this);
                return;
            }
            this.realloc(4);
            this.buf[this.pos++] =           val & 0x7f  | (val > 0x7f ? 0x80 : 0); if (val <= 0x7f) return;
            this.buf[this.pos++] = ((val >>>= 7) & 0x7f) | (val > 0x7f ? 0x80 : 0); if (val <= 0x7f) return;
            this.buf[this.pos++] = ((val >>>= 7) & 0x7f) | (val > 0x7f ? 0x80 : 0); if (val <= 0x7f) return;
            this.buf[this.pos++] =   (val >>> 7) & 0x7f;
        },
        writeSVarint: function(val) {
            this.writeVarint(val < 0 ? -val * 2 - 1 : val * 2);
        },
        writeBoolean: function(val) {
            this.writeVarint(Boolean(val));
        },
        writeString: function(str) {
            str = String(str);
            this.realloc(str.length * 4);
            this.pos++;
            var startPos = this.pos;
            this.pos = writeUtf8(this.buf, str, this.pos);
            var len = this.pos - startPos;
            if (len >= 0x80) makeRoomForExtraLength(startPos, len, this);
            this.pos = startPos - 1;
            this.writeVarint(len);
            this.pos += len;
        },
        writeFloat: function(val) {
            this.realloc(4);
            ieee754.write(this.buf, val, this.pos, true, 23, 4);
            this.pos += 4;
        },
        writeDouble: function(val) {
            this.realloc(8);
            ieee754.write(this.buf, val, this.pos, true, 52, 8);
            this.pos += 8;
        },
        writeBytes: function(buffer) {
            var len = buffer.length;
            this.writeVarint(len);
            this.realloc(len);
            for (var i = 0; i < len; i++) this.buf[this.pos++] = buffer[i];
        },
        writeRawMessage: function(fn, obj) {
            this.pos++;
            var startPos = this.pos;
            fn(obj, this);
            var len = this.pos - startPos;
            if (len >= 0x80) makeRoomForExtraLength(startPos, len, this);
            this.pos = startPos - 1;
            this.writeVarint(len);
            this.pos += len;
        },
        writeMessage: function(tag, fn, obj) {
            this.writeTag(tag, Pbf.Bytes);
            this.writeRawMessage(fn, obj);
        },
        writePackedVarint:   function(tag, arr) { this.writeMessage(tag, writePackedVarint, arr);   },
        writePackedSVarint:  function(tag, arr) { this.writeMessage(tag, writePackedSVarint, arr);  },
        writePackedBoolean:  function(tag, arr) { this.writeMessage(tag, writePackedBoolean, arr);  },
        writePackedFloat:    function(tag, arr) { this.writeMessage(tag, writePackedFloat, arr);    },
        writePackedDouble:   function(tag, arr) { this.writeMessage(tag, writePackedDouble, arr);   },
        writePackedFixed32:  function(tag, arr) { this.writeMessage(tag, writePackedFixed32, arr);  },
        writePackedSFixed32: function(tag, arr) { this.writeMessage(tag, writePackedSFixed32, arr); },
        writePackedFixed64:  function(tag, arr) { this.writeMessage(tag, writePackedFixed64, arr);  },
        writePackedSFixed64: function(tag, arr) { this.writeMessage(tag, writePackedSFixed64, arr); },
        writeBytesField: function(tag, buffer) {
            this.writeTag(tag, Pbf.Bytes);
            this.writeBytes(buffer);
        },
        writeFixed32Field: function(tag, val) {
            this.writeTag(tag, Pbf.Fixed32);
            this.writeFixed32(val);
        },
        writeSFixed32Field: function(tag, val) {
            this.writeTag(tag, Pbf.Fixed32);
            this.writeSFixed32(val);
        },
        writeFixed64Field: function(tag, val) {
            this.writeTag(tag, Pbf.Fixed64);
            this.writeFixed64(val);
        },
        writeSFixed64Field: function(tag, val) {
            this.writeTag(tag, Pbf.Fixed64);
            this.writeSFixed64(val);
        },
        writeVarintField: function(tag, val) {
            this.writeTag(tag, Pbf.Varint);
            this.writeVarint(val);
        },
        writeSVarintField: function(tag, val) {
            this.writeTag(tag, Pbf.Varint);
            this.writeSVarint(val);
        },
        writeStringField: function(tag, str) {
            this.writeTag(tag, Pbf.Bytes);
            this.writeString(str);
        },
        writeFloatField: function(tag, val) {
            this.writeTag(tag, Pbf.Fixed32);
            this.writeFloat(val);
        },
        writeDoubleField: function(tag, val) {
            this.writeTag(tag, Pbf.Fixed64);
            this.writeDouble(val);
        },
        writeBooleanField: function(tag, val) {
            this.writeVarintField(tag, Boolean(val));
        }
    };
    function readVarintRemainder(l, s, p) {
        var buf = p.buf,
            h, b;
        b = buf[p.pos++]; h  = (b & 0x70) >> 4;  if (b < 0x80) return toNum(l, h, s);
        b = buf[p.pos++]; h |= (b & 0x7f) << 3;  if (b < 0x80) return toNum(l, h, s);
        b = buf[p.pos++]; h |= (b & 0x7f) << 10; if (b < 0x80) return toNum(l, h, s);
        b = buf[p.pos++]; h |= (b & 0x7f) << 17; if (b < 0x80) return toNum(l, h, s);
        b = buf[p.pos++]; h |= (b & 0x7f) << 24; if (b < 0x80) return toNum(l, h, s);
        b = buf[p.pos++]; h |= (b & 0x01) << 31; if (b < 0x80) return toNum(l, h, s);
        throw new Error('Expected varint not more than 10 bytes');
    }
    function readPackedEnd(pbf) {
        return pbf.type === Pbf.Bytes ?
            pbf.readVarint() + pbf.pos : pbf.pos + 1;
    }
    function toNum(low, high, isSigned) {
        if (isSigned) {
            return high * 0x100000000 + (low >>> 0);
        }
        return ((high >>> 0) * 0x100000000) + (low >>> 0);
    }
    function writeBigVarint(val, pbf) {
        var low, high;
        if (val >= 0) {
            low  = (val % 0x100000000) | 0;
            high = (val / 0x100000000) | 0;
        } else {
            low  = ~(-val % 0x100000000);
            high = ~(-val / 0x100000000);
            if (low ^ 0xffffffff) {
                low = (low + 1) | 0;
            } else {
                low = 0;
                high = (high + 1) | 0;
            }
        }
        if (val >= 0x10000000000000000 || val < -0x10000000000000000) {
            throw new Error('Given varint doesn\'t fit into 10 bytes');
        }
        pbf.realloc(10);
        writeBigVarintLow(low, high, pbf);
        writeBigVarintHigh(high, pbf);
    }
    function writeBigVarintLow(low, high, pbf) {
        pbf.buf[pbf.pos++] = low & 0x7f | 0x80; low >>>= 7;
        pbf.buf[pbf.pos++] = low & 0x7f | 0x80; low >>>= 7;
        pbf.buf[pbf.pos++] = low & 0x7f | 0x80; low >>>= 7;
        pbf.buf[pbf.pos++] = low & 0x7f | 0x80; low >>>= 7;
        pbf.buf[pbf.pos]   = low & 0x7f;
    }
    function writeBigVarintHigh(high, pbf) {
        var lsb = (high & 0x07) << 4;
        pbf.buf[pbf.pos++] |= lsb         | ((high >>>= 3) ? 0x80 : 0); if (!high) return;
        pbf.buf[pbf.pos++]  = high & 0x7f | ((high >>>= 7) ? 0x80 : 0); if (!high) return;
        pbf.buf[pbf.pos++]  = high & 0x7f | ((high >>>= 7) ? 0x80 : 0); if (!high) return;
        pbf.buf[pbf.pos++]  = high & 0x7f | ((high >>>= 7) ? 0x80 : 0); if (!high) return;
        pbf.buf[pbf.pos++]  = high & 0x7f | ((high >>>= 7) ? 0x80 : 0); if (!high) return;
        pbf.buf[pbf.pos++]  = high & 0x7f;
    }
    function makeRoomForExtraLength(startPos, len, pbf) {
        var extraLen =
            len <= 0x3fff ? 1 :
                len <= 0x1fffff ? 2 :
                    len <= 0xfffffff ? 3 : Math.ceil(Math.log(len) / (Math.LN2 * 7));
        pbf.realloc(extraLen);
        for (var i = pbf.pos - 1; i >= startPos; i--) pbf.buf[i + extraLen] = pbf.buf[i];
    }
    function writePackedVarint(arr, pbf)   { for (var i = 0; i < arr.length; i++) pbf.writeVarint(arr[i]);   }
    function writePackedSVarint(arr, pbf)  { for (var i = 0; i < arr.length; i++) pbf.writeSVarint(arr[i]);  }
    function writePackedFloat(arr, pbf)    { for (var i = 0; i < arr.length; i++) pbf.writeFloat(arr[i]);    }
    function writePackedDouble(arr, pbf)   { for (var i = 0; i < arr.length; i++) pbf.writeDouble(arr[i]);   }
    function writePackedBoolean(arr, pbf)  { for (var i = 0; i < arr.length; i++) pbf.writeBoolean(arr[i]);  }
    function writePackedFixed32(arr, pbf)  { for (var i = 0; i < arr.length; i++) pbf.writeFixed32(arr[i]);  }
    function writePackedSFixed32(arr, pbf) { for (var i = 0; i < arr.length; i++) pbf.writeSFixed32(arr[i]); }
    function writePackedFixed64(arr, pbf)  { for (var i = 0; i < arr.length; i++) pbf.writeFixed64(arr[i]);  }
    function writePackedSFixed64(arr, pbf) { for (var i = 0; i < arr.length; i++) pbf.writeSFixed64(arr[i]); }
    function readUInt32(buf, pos) {
        return ((buf[pos]) |
            (buf[pos + 1] << 8) |
            (buf[pos + 2] << 16)) +
            (buf[pos + 3] * 0x1000000);
    }
    function writeInt32(buf, val, pos) {
        buf[pos] = val;
        buf[pos + 1] = (val >>> 8);
        buf[pos + 2] = (val >>> 16);
        buf[pos + 3] = (val >>> 24);
    }
    function readInt32(buf, pos) {
        return ((buf[pos]) |
            (buf[pos + 1] << 8) |
            (buf[pos + 2] << 16)) +
            (buf[pos + 3] << 24);
    }
    function readUtf8(buf, pos, end) {
        var str = '';
        var i = pos;
        while (i < end) {
            var b0 = buf[i];
            var c = null;
            var bytesPerSequence =
                b0 > 0xEF ? 4 :
                    b0 > 0xDF ? 3 :
                        b0 > 0xBF ? 2 : 1;
            if (i + bytesPerSequence > end) break;
            var b1, b2, b3;
            if (bytesPerSequence === 1) {
                if (b0 < 0x80) {
                    c = b0;
                }
            } else if (bytesPerSequence === 2) {
                b1 = buf[i + 1];
                if ((b1 & 0xC0) === 0x80) {
                    c = (b0 & 0x1F) << 0x6 | (b1 & 0x3F);
                    if (c <= 0x7F) {
                        c = null;
                    }
                }
            } else if (bytesPerSequence === 3) {
                b1 = buf[i + 1];
                b2 = buf[i + 2];
                if ((b1 & 0xC0) === 0x80 && (b2 & 0xC0) === 0x80) {
                    c = (b0 & 0xF) << 0xC | (b1 & 0x3F) << 0x6 | (b2 & 0x3F);
                    if (c <= 0x7FF || (c >= 0xD800 && c <= 0xDFFF)) {
                        c = null;
                    }
                }
            } else if (bytesPerSequence === 4) {
                b1 = buf[i + 1];
                b2 = buf[i + 2];
                b3 = buf[i + 3];
                if ((b1 & 0xC0) === 0x80 && (b2 & 0xC0) === 0x80 && (b3 & 0xC0) === 0x80) {
                    c = (b0 & 0xF) << 0x12 | (b1 & 0x3F) << 0xC | (b2 & 0x3F) << 0x6 | (b3 & 0x3F);
                    if (c <= 0xFFFF || c >= 0x110000) {
                        c = null;
                    }
                }
            }
            if (c === null) {
                c = 0xFFFD;
                bytesPerSequence = 1;
            } else if (c > 0xFFFF) {
                c -= 0x10000;
                str += String.fromCharCode(c >>> 10 & 0x3FF | 0xD800);
                c = 0xDC00 | c & 0x3FF;
            }
            str += String.fromCharCode(c);
            i += bytesPerSequence;
        }
        return str;
    }
    function writeUtf8(buf, str, pos) {
        for (var i = 0, c, lead; i < str.length; i++) {
            c = str.charCodeAt(i);
            if (c > 0xD7FF && c < 0xE000) {
                if (lead) {
                    if (c < 0xDC00) {
                        buf[pos++] = 0xEF;
                        buf[pos++] = 0xBF;
                        buf[pos++] = 0xBD;
                        lead = c;
                        continue;
                    } else {
                        c = lead - 0xD800 << 10 | c - 0xDC00 | 0x10000;
                        lead = null;
                    }
                } else {
                    if (c > 0xDBFF || (i + 1 === str.length)) {
                        buf[pos++] = 0xEF;
                        buf[pos++] = 0xBF;
                        buf[pos++] = 0xBD;
                    } else {
                        lead = c;
                    }
                    continue;
                }
            } else if (lead) {
                buf[pos++] = 0xEF;
                buf[pos++] = 0xBF;
                buf[pos++] = 0xBD;
                lead = null;
            }
            if (c < 0x80) {
                buf[pos++] = c;
            } else {
                if (c < 0x800) {
                    buf[pos++] = c >> 0x6 | 0xC0;
                } else {
                    if (c < 0x10000) {
                        buf[pos++] = c >> 0xC | 0xE0;
                    } else {
                        buf[pos++] = c >> 0x12 | 0xF0;
                        buf[pos++] = c >> 0xC & 0x3F | 0x80;
                    }
                    buf[pos++] = c >> 0x6 & 0x3F | 0x80;
                }
                buf[pos++] = c & 0x3F | 0x80;
            }
        }
        return pos;
    }

    exports.Protobuf = Pbf;

});

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
define(['exports', './when-8d13db60', './Check-70bec281', './Math-61ede240', './WebGLConstants-4c11ee5f'], function (exports, when, Check, _Math, WebGLConstants) { 'use strict';

    /**
         * Constants for WebGL index datatypes.  These corresponds to the
         * <code>type</code> parameter of {@link http://www.khronos.org/opengles/sdk/docs/man/xhtml/glDrawElements.xml|drawElements}.
         *
         * @exports IndexDatatype
         */
        var IndexDatatype = {
            /**
             * 8-bit unsigned byte corresponding to <code>UNSIGNED_BYTE</code> and the type
             * of an element in <code>Uint8Array</code>.
             *
             * @type {Number}
             * @constant
             */
            UNSIGNED_BYTE : WebGLConstants.WebGLConstants.UNSIGNED_BYTE,

            /**
             * 16-bit unsigned short corresponding to <code>UNSIGNED_SHORT</code> and the type
             * of an element in <code>Uint16Array</code>.
             *
             * @type {Number}
             * @constant
             */
            UNSIGNED_SHORT : WebGLConstants.WebGLConstants.UNSIGNED_SHORT,

            /**
             * 32-bit unsigned int corresponding to <code>UNSIGNED_INT</code> and the type
             * of an element in <code>Uint32Array</code>.
             *
             * @type {Number}
             * @constant
             */
            UNSIGNED_INT : WebGLConstants.WebGLConstants.UNSIGNED_INT
        };

        /**
         * Returns the size, in bytes, of the corresponding datatype.
         *
         * @param {IndexDatatype} indexDatatype The index datatype to get the size of.
         * @returns {Number} The size in bytes.
         *
         * @example
         * // Returns 2
         * var size = Cesium.IndexDatatype.getSizeInBytes(Cesium.IndexDatatype.UNSIGNED_SHORT);
         */
        IndexDatatype.getSizeInBytes = function(indexDatatype) {
            switch(indexDatatype) {
                case IndexDatatype.UNSIGNED_BYTE:
                    return Uint8Array.BYTES_PER_ELEMENT;
                case IndexDatatype.UNSIGNED_SHORT:
                    return Uint16Array.BYTES_PER_ELEMENT;
                case IndexDatatype.UNSIGNED_INT:
                    return Uint32Array.BYTES_PER_ELEMENT;
            }

            //>>includeStart('debug', pragmas.debug);
            throw new Check.DeveloperError('indexDatatype is required and must be a valid IndexDatatype constant.');
            //>>includeEnd('debug');
        };

        /**
         * Gets the datatype with a given size in bytes.
         *
         * @param {Number} sizeInBytes The size of a single index in bytes.
         * @returns {IndexDatatype} The index datatype with the given size.
         */
        IndexDatatype.fromSizeInBytes = function(sizeInBytes) {
            switch (sizeInBytes) {
                case 2:
                    return IndexDatatype.UNSIGNED_SHORT;
                case 4:
                    return IndexDatatype.UNSIGNED_INT;
                case 1:
                    return IndexDatatype.UNSIGNED_BYTE;
                //>>includeStart('debug', pragmas.debug);
                default:
                    throw new Check.DeveloperError('Size in bytes cannot be mapped to an IndexDatatype');
                //>>includeEnd('debug');
            }
        };

        /**
         * Validates that the provided index datatype is a valid {@link IndexDatatype}.
         *
         * @param {IndexDatatype} indexDatatype The index datatype to validate.
         * @returns {Boolean} <code>true</code> if the provided index datatype is a valid value; otherwise, <code>false</code>.
         *
         * @example
         * if (!Cesium.IndexDatatype.validate(indexDatatype)) {
         *   throw new Cesium.DeveloperError('indexDatatype must be a valid value.');
         * }
         */
        IndexDatatype.validate = function(indexDatatype) {
            return when.defined(indexDatatype) &&
                   (indexDatatype === IndexDatatype.UNSIGNED_BYTE ||
                    indexDatatype === IndexDatatype.UNSIGNED_SHORT ||
                    indexDatatype === IndexDatatype.UNSIGNED_INT);
        };

        /**
         * Creates a typed array that will store indices, using either <code><Uint16Array</code>
         * or <code>Uint32Array</code> depending on the number of vertices.
         *
         * @param {Number} numberOfVertices Number of vertices that the indices will reference.
         * @param {Number|Array} indicesLengthOrArray Passed through to the typed array constructor.
         * @returns {Uint16Array|Uint32Array} A <code>Uint16Array</code> or <code>Uint32Array</code> constructed with <code>indicesLengthOrArray</code>.
         *
         * @example
         * this.indices = Cesium.IndexDatatype.createTypedArray(positions.length / 3, numberOfIndices);
         */
        IndexDatatype.createTypedArray = function(numberOfVertices, indicesLengthOrArray) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(numberOfVertices)) {
                throw new Check.DeveloperError('numberOfVertices is required.');
            }
            //>>includeEnd('debug');

            if (numberOfVertices >= _Math.CesiumMath.SIXTY_FOUR_KILOBYTES) {
                return new Uint32Array(indicesLengthOrArray);
            }

            return new Uint16Array(indicesLengthOrArray);
        };

        /**
         * Creates a typed array from a source array buffer.  The resulting typed array will store indices, using either <code><Uint16Array</code>
         * or <code>Uint32Array</code> depending on the number of vertices.
         *
         * @param {Number} numberOfVertices Number of vertices that the indices will reference.
         * @param {ArrayBuffer} sourceArray Passed through to the typed array constructor.
         * @param {Number} byteOffset Passed through to the typed array constructor.
         * @param {Number} length Passed through to the typed array constructor.
         * @returns {Uint16Array|Uint32Array} A <code>Uint16Array</code> or <code>Uint32Array</code> constructed with <code>sourceArray</code>, <code>byteOffset</code>, and <code>length</code>.
         *
         */
        IndexDatatype.createTypedArrayFromArrayBuffer = function(numberOfVertices, sourceArray, byteOffset, length) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(numberOfVertices)) {
                throw new Check.DeveloperError('numberOfVertices is required.');
            }
            if (!when.defined(sourceArray)) {
                throw new Check.DeveloperError('sourceArray is required.');
            }
            if (!when.defined(byteOffset)) {
                throw new Check.DeveloperError('byteOffset is required.');
            }
            //>>includeEnd('debug');

            if (numberOfVertices >= _Math.CesiumMath.SIXTY_FOUR_KILOBYTES) {
                return new Uint32Array(sourceArray, byteOffset, length);
            }

            return new Uint16Array(sourceArray, byteOffset, length);
        };
    var IndexDatatype$1 = Object.freeze(IndexDatatype);

    exports.IndexDatatype = IndexDatatype$1;

});

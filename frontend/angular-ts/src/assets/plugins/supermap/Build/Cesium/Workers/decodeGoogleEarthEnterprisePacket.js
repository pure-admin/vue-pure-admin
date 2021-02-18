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
define(['./when-8d13db60', './Check-70bec281', './RuntimeError-ba10bc3e', './createTaskProcessorWorker', './pako_inflate-8ea163f9'], function (when, Check, RuntimeError, createTaskProcessorWorker, pako_inflate) { 'use strict';

    var compressedMagic = 0x7468dead;
        var compressedMagicSwap = 0xadde6874;

        /**
         * Decodes data that is received from the Google Earth Enterprise server.
         *
         * @param {ArrayBuffer} key The key used during decoding.
         * @param {ArrayBuffer} data The data to be decoded.
         *
         * @private
         */
        function decodeGoogleEarthEnterpriseData(key, data) {
            if (decodeGoogleEarthEnterpriseData.passThroughDataForTesting) {
                return data;
            }

            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('key', key);
            Check.Check.typeOf.object('data', data);
            //>>includeEnd('debug');

            var keyLength = key.byteLength;
            if (keyLength === 0 || (keyLength % 4) !== 0) {
                throw new RuntimeError.RuntimeError('The length of key must be greater than 0 and a multiple of 4.');
            }

            var dataView = new DataView(data);
            var magic = dataView.getUint32(0, true);
            if (magic === compressedMagic || magic === compressedMagicSwap) {
                // Occasionally packets don't come back encoded, so just return
                return data;
            }

            var keyView = new DataView(key);

            var dp = 0;
            var dpend = data.byteLength;
            var dpend64 = dpend - (dpend % 8);
            var kpend = keyLength;
            var kp;
            var off = 8;

            // This algorithm is intentionally asymmetric to make it more difficult to
            // guess. Security through obscurity. :-(

            // while we have a full uint64 (8 bytes) left to do
            // assumes buffer is 64bit aligned (or processor doesn't care)
            while (dp < dpend64) {
                // rotate the key each time through by using the offets 16,0,8,16,0,8,...
                off = (off + 8) % 24;
                kp = off;

                // run through one key length xor'ing one uint64 at a time
                // then drop out to rotate the key for the next bit
                while ((dp < dpend64) && (kp < kpend)) {
                    dataView.setUint32(dp, dataView.getUint32(dp, true) ^ keyView.getUint32(kp, true), true);
                    dataView.setUint32(dp + 4, dataView.getUint32(dp + 4, true) ^ keyView.getUint32(kp + 4, true), true);
                    dp += 8;
                    kp += 24;
                }
            }

            // now the remaining 1 to 7 bytes
            if (dp < dpend) {
                if (kp >= kpend) {
                    // rotate the key one last time (if necessary)
                    off = (off + 8) % 24;
                    kp = off;
                }

                while (dp < dpend) {
                    dataView.setUint8(dp, dataView.getUint8(dp) ^ keyView.getUint8(kp));
                    dp++;
                    kp++;
                }
            }
        }

        decodeGoogleEarthEnterpriseData.passThroughDataForTesting = false;

    /**
         * @private
         */
        function isBitSet(bits, mask) {
            return ((bits & mask) !== 0);
        }

    // Bitmask for checking tile properties
        var childrenBitmasks = [0x01, 0x02, 0x04, 0x08];
        var anyChildBitmask = 0x0F;
        var cacheFlagBitmask = 0x10; // True if there is a child subtree
        var imageBitmask = 0x40;
        var terrainBitmask = 0x80;

        /**
         * Contains information about each tile from a Google Earth Enterprise server
         *
         * @param {Number} bits Bitmask that contains the type of data and available children for each tile.
         * @param {Number} cnodeVersion Version of the request for subtree metadata.
         * @param {Number} imageryVersion Version of the request for imagery tile.
         * @param {Number} terrainVersion Version of the request for terrain tile.
         * @param {Number} imageryProvider Id of imagery provider.
         * @param {Number} terrainProvider Id of terrain provider.
         *
         * @private
         */
        function GoogleEarthEnterpriseTileInformation(bits, cnodeVersion, imageryVersion, terrainVersion, imageryProvider, terrainProvider) {
            this._bits = bits;
            this.cnodeVersion = cnodeVersion;
            this.imageryVersion = imageryVersion;
            this.terrainVersion = terrainVersion;
            this.imageryProvider = imageryProvider;
            this.terrainProvider = terrainProvider;
            this.ancestorHasTerrain = false; // Set it later once we find its parent
            this.terrainState = undefined;
        }

        /**
         * Creates GoogleEarthEnterpriseTileInformation from an object
         *
         * @param {Object} info Object to be cloned
         * @param {GoogleEarthEnterpriseTileInformation} [result] The object onto which to store the result.
         * @returns {GoogleEarthEnterpriseTileInformation} The modified result parameter or a new GoogleEarthEnterpriseTileInformation instance if none was provided.
         */
        GoogleEarthEnterpriseTileInformation.clone = function(info, result) {
            if (!when.defined(result)) {
                result = new GoogleEarthEnterpriseTileInformation(info._bits, info.cnodeVersion, info.imageryVersion, info.terrainVersion,
                    info.imageryProvider, info.terrainProvider);
            } else {
                result._bits = info._bits;
                result.cnodeVersion = info.cnodeVersion;
                result.imageryVersion = info.imageryVersion;
                result.terrainVersion = info.terrainVersion;
                result.imageryProvider = info.imageryProvider;
                result.terrainProvider = info.terrainProvider;
            }
            result.ancestorHasTerrain = info.ancestorHasTerrain;
            result.terrainState = info.terrainState;

            return result;
        };

        /**
         * Sets the parent for the tile
         *
         * @param {GoogleEarthEnterpriseTileInformation} parent Parent tile
         */
        GoogleEarthEnterpriseTileInformation.prototype.setParent = function(parent) {
            this.ancestorHasTerrain = parent.ancestorHasTerrain || this.hasTerrain();
        };

        /**
         * Gets whether a subtree is available
         *
         * @returns {Boolean} true if subtree is available, false otherwise.
         */
        GoogleEarthEnterpriseTileInformation.prototype.hasSubtree = function() {
            return isBitSet(this._bits, cacheFlagBitmask);
        };

        /**
         * Gets whether imagery is available
         *
         * @returns {Boolean} true if imagery is available, false otherwise.
         */
        GoogleEarthEnterpriseTileInformation.prototype.hasImagery = function() {
            return isBitSet(this._bits, imageBitmask);
        };

        /**
         * Gets whether terrain is available
         *
         * @returns {Boolean} true if terrain is available, false otherwise.
         */
        GoogleEarthEnterpriseTileInformation.prototype.hasTerrain = function() {
            return isBitSet(this._bits, terrainBitmask);
        };

        /**
         * Gets whether any children are present
         *
         * @returns {Boolean} true if any children are available, false otherwise.
         */
        GoogleEarthEnterpriseTileInformation.prototype.hasChildren = function() {
            return isBitSet(this._bits, anyChildBitmask);
        };

        /**
         * Gets whether a specified child is available
         *
         * @param {Number} index Index of child tile
         *
         * @returns {Boolean} true if child is available, false otherwise
         */
        GoogleEarthEnterpriseTileInformation.prototype.hasChild = function(index) {
            return isBitSet(this._bits, childrenBitmasks[index]);
        };

        /**
         * Gets bitmask containing children
         *
         * @returns {Number} Children bitmask
         */
        GoogleEarthEnterpriseTileInformation.prototype.getChildBitmask = function() {
            return this._bits & anyChildBitmask;
        };

    // Datatype sizes
    var sizeOfUint16 = Uint16Array.BYTES_PER_ELEMENT;
    var sizeOfInt32 = Int32Array.BYTES_PER_ELEMENT;
    var sizeOfUint32 = Uint32Array.BYTES_PER_ELEMENT;

    var Types = {
        METADATA : 0,
        TERRAIN : 1,
        DBROOT : 2
    };

    Types.fromString = function(s) {
        if (s === 'Metadata') {
            return Types.METADATA;
        } else if (s === 'Terrain') {
            return Types.TERRAIN;
        } else if (s === 'DbRoot') {
            return Types.DBROOT;
        }
    };

    function decodeGoogleEarthEnterprisePacket(parameters, transferableObjects) {
        var type = Types.fromString(parameters.type);
        var buffer = parameters.buffer;
        decodeGoogleEarthEnterpriseData(parameters.key, buffer);

        var uncompressedTerrain = uncompressPacket(buffer);
        buffer = uncompressedTerrain.buffer;
        var length = uncompressedTerrain.length;

        switch (type) {
            case Types.METADATA:
                return processMetadata(buffer, length, parameters.quadKey);
            case Types.TERRAIN:
                return processTerrain(buffer, length, transferableObjects);
            case Types.DBROOT:
                transferableObjects.push(buffer);
                return {
                    buffer : buffer
                };
        }

    }

    var qtMagic = 32301;

    function processMetadata(buffer, totalSize, quadKey) {
        var dv = new DataView(buffer);
        var offset = 0;
        var magic = dv.getUint32(offset, true);
        offset += sizeOfUint32;
        if (magic !== qtMagic) {
            throw new RuntimeError.RuntimeError('Invalid magic');
        }

        var dataTypeId = dv.getUint32(offset, true);
        offset += sizeOfUint32;
        if (dataTypeId !== 1) {
            throw new RuntimeError.RuntimeError('Invalid data type. Must be 1 for QuadTreePacket');
        }

        // Tile format version
        var quadVersion = dv.getUint32(offset, true);
        offset += sizeOfUint32;
        if (quadVersion !== 2) {
            throw new RuntimeError.RuntimeError('Invalid QuadTreePacket version. Only version 2 is supported.');
        }

        var numInstances = dv.getInt32(offset, true);
        offset += sizeOfInt32;

        var dataInstanceSize = dv.getInt32(offset, true);
        offset += sizeOfInt32;
        if (dataInstanceSize !== 32) {
            throw new RuntimeError.RuntimeError('Invalid instance size.');
        }

        var dataBufferOffset = dv.getInt32(offset, true);
        offset += sizeOfInt32;

        var dataBufferSize = dv.getInt32(offset, true);
        offset += sizeOfInt32;

        var metaBufferSize = dv.getInt32(offset, true);
        offset += sizeOfInt32;

        // Offset from beginning of packet (instances + current offset)
        if (dataBufferOffset !== (numInstances * dataInstanceSize + offset)) {
            throw new RuntimeError.RuntimeError('Invalid dataBufferOffset');
        }

        // Verify the packets is all there header + instances + dataBuffer + metaBuffer
        if (dataBufferOffset + dataBufferSize + metaBufferSize !== totalSize) {
            throw new RuntimeError.RuntimeError('Invalid packet offsets');
        }

        // Read all the instances
        var instances = [];
        for (var i = 0; i < numInstances; ++i) {
            var bitfield = dv.getUint8(offset);
            ++offset;

            ++offset; // 2 byte align

            var cnodeVersion = dv.getUint16(offset, true);
            offset += sizeOfUint16;

            var imageVersion = dv.getUint16(offset, true);
            offset += sizeOfUint16;

            var terrainVersion = dv.getUint16(offset, true);
            offset += sizeOfUint16;

            // Number of channels stored in the dataBuffer
            offset += sizeOfUint16;

            offset += sizeOfUint16; // 4 byte align

            // Channel type offset into dataBuffer
            offset += sizeOfInt32;

            // Channel version offset into dataBuffer
            offset += sizeOfInt32;

            offset += 8; // Ignore image neighbors for now

            // Data providers
            var imageProvider = dv.getUint8(offset++);
            var terrainProvider = dv.getUint8(offset++);
            offset += sizeOfUint16; // 4 byte align

            instances.push(new GoogleEarthEnterpriseTileInformation(bitfield, cnodeVersion,
                imageVersion, terrainVersion, imageProvider, terrainProvider));
        }

        var tileInfo = [];
        var index = 0;

        function populateTiles(parentKey, parent, level) {
            var isLeaf = false;
            if (level === 4) {
                if (parent.hasSubtree()) {
                    return; // We have a subtree, so just return
                }

                isLeaf = true; // No subtree, so set all children to null
            }
            for (var i = 0; i < 4; ++i) {
                var childKey = parentKey + i.toString();
                if (isLeaf) {
                    // No subtree so set all children to null
                    tileInfo[childKey] = null;
                } else if (level < 4) {
                    // We are still in the middle of the subtree, so add child
                    //  only if their bits are set, otherwise set child to null.
                    if (!parent.hasChild(i)) {
                        tileInfo[childKey] = null;
                    } else {
                        if (index === numInstances) {
                            console.log('Incorrect number of instances');
                            return;
                        }

                        var instance = instances[index++];
                        tileInfo[childKey] = instance;
                        populateTiles(childKey, instance, level + 1);
                    }
                }
            }
        }

        var level = 0;
        var root = instances[index++];
        if (quadKey === '') {
            // Root tile has data at its root and one less level
            ++level;
        } else {
            tileInfo[quadKey] = root; // This will only contain the child bitmask
        }

        populateTiles(quadKey, root, level);

        return tileInfo;
    }

    function processTerrain(buffer, totalSize, transferableObjects) {
        var dv = new DataView(buffer);

        var offset = 0;
        var terrainTiles = [];
        while (offset < totalSize) {
            // Each tile is split into 4 parts
            var tileStart = offset;
            for (var quad = 0; quad < 4; ++quad) {
                var size = dv.getUint32(offset, true);
                offset += sizeOfUint32;
                offset += size;
            }
            var tile = buffer.slice(tileStart, offset);
            transferableObjects.push(tile);
            terrainTiles.push(tile);
        }

        return terrainTiles;
    }

    var compressedMagic$1 = 0x7468dead;
    var compressedMagicSwap$1 = 0xadde6874;

    function uncompressPacket(data) {
        // The layout of this decoded data is
        // Magic Uint32
        // Size Uint32
        // [GZipped chunk of Size bytes]

        // Pullout magic and verify we have the correct data
        var dv = new DataView(data);
        var offset = 0;
        var magic = dv.getUint32(offset, true);
        offset += sizeOfUint32;
        if (magic !== compressedMagic$1 && magic !== compressedMagicSwap$1) {
            throw new RuntimeError.RuntimeError('Invalid magic');
        }

        // Get the size of the compressed buffer - the endianness depends on which magic was used
        var size = dv.getUint32(offset, (magic === compressedMagic$1));
        offset += sizeOfUint32;

        var compressedPacket = new Uint8Array(data, offset);
        var uncompressedPacket = pako_inflate.pako.inflate(compressedPacket);

        if (uncompressedPacket.length !== size) {
            throw new RuntimeError.RuntimeError('Size of packet doesn\'t match header');
        }

        return uncompressedPacket;
    }
    var decodeGoogleEarthEnterprisePacket$1 = createTaskProcessorWorker(decodeGoogleEarthEnterprisePacket);

    return decodeGoogleEarthEnterprisePacket$1;

});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zlib_1 = require("zlib");
const stream_1 = require("stream");
const fs_1 = require("fs");
const util_1 = require("util");
const duplexer = require('duplexer');
const readFilePromise = util_1.promisify(fs_1.readFile);
const bufferFormatter = (incoming) => typeof incoming === 'string' ? Buffer.from(incoming, 'utf8') : incoming;
const optionFormatter = (passed, toEncode) => ({
    params: {
        [zlib_1.constants.BROTLI_PARAM_MODE]: passed && 'mode' in passed && passed.mode || zlib_1.constants.BROTLI_DEFAULT_MODE,
        [zlib_1.constants.BROTLI_PARAM_QUALITY]: passed && 'quality' in passed && passed.quality || zlib_1.constants.BROTLI_MAX_QUALITY,
        [zlib_1.constants.BROTLI_PARAM_SIZE_HINT]: toEncode ? toEncode.byteLength : 0,
    }
});
/**
 * @param incoming Either a Buffer or string of the value to encode.
 * @param options Subset of Encoding Parameters.
 * @return Promise that resolves with the encoded Buffer length.
 */
async function size(incoming, options) {
    const buffer = bufferFormatter(incoming);
    return new Promise(function (resolve, reject) {
        zlib_1.brotliCompress(buffer, optionFormatter(options, buffer), (error, result) => {
            if (error !== null) {
                reject(error);
            }
            resolve(result.byteLength);
        });
    });
}
exports.default = size;
/**
 * @param incoming Either a Buffer or string of the value to encode.
 * @param options Subset of Encoding Parameters.
 * @return Length of encoded Buffer.
 */
function sync(incoming, options) {
    const buffer = bufferFormatter(incoming);
    return zlib_1.brotliCompressSync(buffer, optionFormatter(options, buffer)).byteLength;
}
exports.sync = sync;
/**
 * @param options
 * @return PassThroughStream for the contents being compressed
 */
function stream(options) {
    const input = new stream_1.PassThrough();
    const output = new stream_1.PassThrough();
    const wrapper = duplexer(input, output);
    let size = 0;
    const brotli = zlib_1.createBrotliCompress(optionFormatter(options))
        .on('data', buf => {
        size += buf.length;
    })
        .on('error', () => {
        wrapper.brotliSize = 0;
    })
        .on('end', () => {
        wrapper.brotliSize = size;
        wrapper.emit('brotli-size', size);
        output.end();
    });
    input.pipe(brotli);
    input.pipe(output, { end: false });
    return wrapper;
}
exports.stream = stream;
/**
 * @param path File Path for the file to compress.
 * @param options Subset of Encoding Parameters.
 * @return Promise that resolves with size of encoded file.
 */
async function file(path, options) {
    const file = await readFilePromise(path);
    return (await size(file, options));
}
exports.file = file;
/**
 * @param path File Path for the file to compress.
 * @param options Subset of Encoding Parameters.
 * @return size of encoded file.
 */
function fileSync(path, options) {
    const file = fs_1.readFileSync(path);
    return sync(file, options);
}
exports.fileSync = fileSync;
//# sourceMappingURL=index.js.map
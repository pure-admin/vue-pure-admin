/// <reference types="node" />
import { PassThrough as PassThroughStream } from 'stream';
export interface BrotliEncodeParams {
    mode?: number;
    quality?: number;
}
/**
 * @param incoming Either a Buffer or string of the value to encode.
 * @param options Subset of Encoding Parameters.
 * @return Promise that resolves with the encoded Buffer length.
 */
export default function size(incoming: Buffer | string, options?: BrotliEncodeParams): Promise<number>;
/**
 * @param incoming Either a Buffer or string of the value to encode.
 * @param options Subset of Encoding Parameters.
 * @return Length of encoded Buffer.
 */
export declare function sync(incoming: Buffer | string, options?: BrotliEncodeParams): number;
/**
 * @param options
 * @return PassThroughStream for the contents being compressed
 */
export declare function stream(options?: BrotliEncodeParams): PassThroughStream;
/**
 * @param path File Path for the file to compress.
 * @param options Subset of Encoding Parameters.
 * @return Promise that resolves with size of encoded file.
 */
export declare function file(path: string, options?: BrotliEncodeParams): Promise<number>;
/**
 * @param path File Path for the file to compress.
 * @param options Subset of Encoding Parameters.
 * @return size of encoded file.
 */
export declare function fileSync(path: string, options?: BrotliEncodeParams): number;

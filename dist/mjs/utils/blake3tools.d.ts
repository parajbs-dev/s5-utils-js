/// <reference types="node" />
import { Buffer } from "buffer";
/**
 * convert a number to Buffer.
 *
 * @param value - File objects to upload, indexed by their path strings.
 * @param bufferSize - Size of the Buffer. default is 4.
 * @returns - The returned cid.
 * @throws - Will throw if the request is successful but the upload response does not contain a complete response.
 */
export declare function numberToBuffer(value: number, bufferSize: number): Buffer;
/**
 * Calculates the BLAKE3 hash of a file.
 *
 * @param file The file to calculate the hash from.
 * @returns A Promise that resolves to a Buffer representing the BLAKE3 hash value.
 */
export declare function getB3hashFromFile(file: File): Promise<Buffer>;
/**
 * Generates an S5 hash by prepending a given Blake3 hash with a default value.
 *
 * @param b3hash - The input Blake3 hash buffer.
 * @returns The resulting S5 hash buffer.
 */
export declare function getS5HashFromB3hash(b3hash: Buffer): Buffer;
/**
 * Concatenates the CID parts - CID type, hash, and file size - into a Buffer.
 *
 * @param mHash The hash value as a Buffer.
 * @param file The file object.
 * @returns A Buffer representing the concatenated CID parts.
 */
export declare function getS5CidFromHash(mHash: Buffer, file: File): Buffer;
/**
 * Converts a hash value stored in a Buffer object to a URL-safe Base64 string.
 *
 * @param mHash The hash value as a Buffer object.
 * @returns The URL-safe Base64 string representing the hash value.
 */
export declare function convertS5mHashToBase64url(mHash: Buffer): string;
//# sourceMappingURL=blake3tools.d.ts.map
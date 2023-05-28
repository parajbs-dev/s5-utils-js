/// <reference types="node" />
import { Buffer } from "buffer";
/**
 * Calculates the BLAKE3 hash of a file.
 *
 * @param file - The file to calculate the hash from.
 * @returns A promise that resolves to a Buffer containing the BLAKE3 hash.
 */
export declare function calculateB3hashFromFile(file: File): Promise<Buffer>;
/**
 * Generates an S5 mHash by prepending a given Blake3 hash with a default value.
 *
 * @param b3hash - The input Blake3 hash buffer.
 * @returns The resulting S5 mHash buffer.
 */
export declare function generateMHashFromB3hash(b3hash: Buffer): Buffer;
/**
 * Extracts the Blake3 hash from the given mHash buffer.
 *
 * @param mHash - The mHash buffer from which to extract the Blake3 hash.
 * @returns The extracted Blake3 hash buffer.
 */
export declare function extractB3hashFromMHash(mHash: Buffer): Buffer;
/**
 * Generates a S5 CID (Content Identifier) from a hash and file size - into a Buffer.
 *
 * @param mHash The hash value as a Buffer object.
 * @param file The file object.
 * @returns The generated CID as a Buffer object.
 */
export declare function generateCIDFromMHash(mHash: Buffer, file: File): Buffer;
/**
 * Extracts the mHash from a CID buffer.
 *
 * @param cid - The CID buffer.
 * @returns The extracted mHash as a Buffer.
 */
export declare function extractMHashFromCID(cid: Buffer): Buffer;
/**
 * Extracts the raw file size from a CID (Content Identifier) buffer.
 *
 * @param cid - The CID buffer containing the file size information.
 * @returns The extracted file size as a number.
 */
export declare function extractRawSizeFromCID(cid: Buffer): number;
/**
 * Extracts a Blake3 hash from a CID (Content Identifier) buffer.
 *
 * @param cid - The CID buffer.
 * @returns The extracted Blake3 hash as a buffer.
 */
export declare function extractB3hashFromCID(cid: Buffer): Buffer;
/**
 * Converts a hash Buffer to a URL-safe Base64 string.
 *
 * @param mHash The mHash Buffer to be converted.
 * @returns The URL-safe Base64 string representation of the mHash.
 */
export declare function convertMHashToB64url(mHash: Buffer): string;
/**
 * Converts a S5 CID (Content Identifier) to an mHash.
 *
 * @param cid The CID string to convert.
 * @returns The mHash as a Buffer.
 * @throws Error if the CID input address is invalid.
 */
export declare function convertS5CidToMHash(cid: string): Buffer;
/**
 * Converts a S5 CID (Content Identifier) to CID bytes.
 *
 * @param cid The S5 CID to convert.
 * @returns The CID bytes as a Uint8Array.
 * @throws {Error} If the CID input address is invalid.
 */
export declare function convertS5CidToCIDBytes(cid: string): Uint8Array;
/**
 * Checks if the raw size associated with a given CID is not null.
 *
 * @param cid - The Content Identifier (CID) to check.
 * @returns A boolean indicating if the raw size is not null (true) or null (false).
 */
export declare function checkRawSizeIsNotNull(cid: string): boolean;
/**
 * Converts an S5 CID to a base64 URL-formatted mHash.
 *
 * @param cid The S5 CID to convert.
 * @returns The base64 URL-formatted mHash.
 */
export declare function convertS5CidToMHashB64url(cid: string): string;
/**
 * Converts an S5 CID (Content Identifier) to a Blake3 hash in hexadecimal format.
 *
 * @param cid The S5 CID to convert.
 * @returns The Blake3 hash of the CID in hexadecimal format.
 * @throws {Error} If the input CID is invalid.
 */
export declare function convertS5CidToB3hashHex(cid: string): string;
export type ResponseAllCidsFromCid = {
    zcid: string;
    ucid: string;
    bcid: string;
    mhashb64url: string;
    b3hashhex: string;
    b3filesize: number;
};
/**
 * Retrieves various information from a CID (Content Identifier).
 *
 * @param cid - The CID string.
 * @returns An object containing different representations and extracted information from the CID.
 * @throws {Error} If the CID input address is invalid.
 */
export declare function getAllInfosFromCid(cid: string): ResponseAllCidsFromCid;
//# sourceMappingURL=blake3tools.d.ts.map
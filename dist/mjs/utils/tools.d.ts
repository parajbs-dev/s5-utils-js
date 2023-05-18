/// <reference types="node" />
/**
 * Encodes a CID using base58 encoding and adds a prefix "z".
 *
 * @param bytes - The bytes to encode.
 * @returns {string} - The encoded CID with "z" prefix or undefined if the cid is not of length 38.
 */
export declare function getS5zCidEncoded(bytes: Buffer): string;
/**
 * Decodes a given input address using base58 decoding and returns the byte representation of the decoded address.
 * If the input address starts with "z" and has a length greater than or equal to 53, the remaining characters (excluding the prefix "z") are decoded.
 * If the input address does not start with "z" and has a length less than or equal to 52, the entire address is decoded.
 * Throws an error if the input address does not match any of the specified formats.
 *
 * @param cid The input address to decode.
 * @returns The byte representation of the decoded Bitcoin address.
 * @throws Error if the input address is invalid.
 */
export declare function getS5zBytesDecoded(cid: string): Buffer;
/**
 * Encodes a CID using base64url encoding and prefixes it with "u".
 *
 * @param bytes - The bytes to encode.
 * @returns {string|undefined} - The encoded CID with "u" prefix or undefined if the input CID is not of length 38.
 */
export declare function getS5uCidEncoded(bytes: Buffer): string;
/**
 * Decodes a Content Identifier (CID) string and returns the decoded bytes as a Buffer object.
 *
 * @param cid - The CID string to decode.
 * @returns The decoded bytes as a Buffer object.
 * @throws Error if the CID format is invalid.
 */
export declare function getS5uBytesDecoded(cid: string): Buffer;
/**
 * Encodes a CID string using base32rfc encoding and adds "b" at the beginning of the resulting string.
 *
 * @param bytes - The bytes to encode.
 * @returns The encoded CID string with "b" at the beginning, or undefined if the input CID is not 38 characters long.
 */
export declare function getS5bCidEncoded(bytes: Buffer): string;
/**
 * Decodes an encoded CID string and returns the decoded bytes.
 *
 * @param cid - The encoded CID string to decode.
 * @returns The decoded bytes of the CID as a Buffer.
 */
export declare function getS5bBytesDecoded(cid: string): Buffer;
/**
 * Converts a base58-encoded CID to a base32-encoded CID.
 *
 * @param cid - The base58-encoded CID string to convert.
 * @returns The base32-encoded CID string.
 */
export declare function convertBase58ToBase32(cid: string): string;
/**
 * Converts a base32-encoded CID to a base58-encoded CID.
 *
 * @param cid - The base32-encoded CID string to convert.
 * @returns The base58-encoded CID string.
 */
export declare function convertBase32ToBase58(cid: string): string;
/**
 * Converts a CID from base64url encoding to base58 encoding.
 *
 * @param cid - The CID in base64url encoding.
 * @returns The CID in base58 encoding.
 */
export declare function convertBase64urlToBase58(cid: string): string;
/**
 * Converts a CID from base58 encoding to base64url encoding.
 *
 * @param cid - The CID in base58 encoding.
 * @returns The CID in base64url encoding.
 */
export declare function convertBase58ToBase64url(cid: string): string;
/**
 * Converts a CID encoded in base64url format to base32 format.
 *
 * @param cid The CID to convert.
 * @returns The CID encoded in base32 format.
 */
export declare function convertBase64urlToBase32(cid: string): string;
/**
 * Converts a CID encoded in base32 format to base64url format.
 *
 * @param cid The CID to convert.
 * @returns The CID encoded in base64url format.
 */
export declare function convertBase32ToBase64url(cid: string): string;
//# sourceMappingURL=tools.d.ts.map
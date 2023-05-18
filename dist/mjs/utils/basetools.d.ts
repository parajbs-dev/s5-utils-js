/// <reference types="node" />
import { Buffer } from "buffer";
export declare const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
/**
 * Encodes a Buffer of bytes as a Base58-encoded string for use in Bitcoin addresses.
 *
 * @param bytes An array of bytes to encode.
 * @returns A Base58-encoded string.
 */
export declare function base58BitcoinEncode(bytes: Buffer): string;
/**
 * Decodes a Base58-encoded string used in Bitcoin addresses to a Buffer of bytes.
 *
 * @param str A Base58-encoded string to decode.
 * @returns An array of bytes.
 * @throws Error if the input string contains characters not in the ALPHABET string.
 */
export declare function base58BitcoinDecode(str: string): Buffer;
export declare const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
/**
 * Encodes binary data to Base32 RFC 4648 format.
 *
 * @param data - The binary data to encode as a Buffer.
 * @returns The Base32-encoded string.
 */
export declare function base32rfcEncode(data: Buffer): string;
/**
 * Decodes binary data from Base32 RFC 4648 format.
 *
 * @param encoded - The Base32-encoded string to decode.
 * @returns The decoded binary data as a Buffer.
 */
export declare function base32rfcDecode(encoded: string): Buffer;
/**
 * Encodes a Buffer as a base64url-encoded string.
 *
 * @param input The Buffer to encode.
 * @returns The base64url-encoded string.
 */
export declare function base64urlEncode(input: Buffer): string;
/**
 * Decodes a base64url-encoded string as a Buffer.
 *
 * @param input The base64url-encoded string to decode.
 * @returns The decoded Buffer.
 */
export declare function base64urlDecode(input: string): Buffer;
//# sourceMappingURL=basetools.d.ts.map
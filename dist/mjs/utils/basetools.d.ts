/// <reference types="node" />
import { Buffer } from "buffer";
export declare const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
/**
 * Encodes a buffer of bytes using Base58 encoding (specifically designed for Bitcoin addresses).
 *
 * @param bytes The buffer of bytes to encode.
 * @returns The Base58-encoded string representation of the input bytes.
 */
export declare function encodeBase58BTC(bytes: Buffer): string;
/**
 * Decodes a Base58btc string into a Buffer object.
 *
 * @param str The Base58btc encoded string to decode.
 * @returns A Buffer object containing the decoded bytes.
 * @throws Error if the input string is not a valid Base58btc string.
 */
export declare function decodeBase58BTC(str: string): Buffer;
export declare const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
/**
 * Encodes data using the Base32 encoding scheme based on the RFC 4648 specification.
 *
 * @param data - The input data to be encoded as a Buffer object.
 * @returns The Base32 encoded string.
 */
export declare function encodeBase32RFC(data: Buffer): string;
/**
 * Decodes a string encoded in Base32 RFC 4648 format into a Buffer object.
 *
 * @param encoded The Base32 encoded string to decode.
 * @returns A Buffer containing the decoded bytes.
 */
export declare function decodeBase32RFC(encoded: string): Buffer;
/**
 * Encodes a buffer into a Base64URL string.
 *
 * @param input - The buffer to be encoded.
 * @returns The Base64URL-encoded string.
 */
export declare function encodeBase64URL(input: Buffer): string;
/**
 * Decodes a Base64 URL-encoded string into a Buffer object.
 *
 * @param input - The Base64 URL-encoded string to decode.
 * @returns A Buffer object containing the decoded binary data.
 */
export declare function decodeBase64URL(input: string): Buffer;
//# sourceMappingURL=basetools.d.ts.map
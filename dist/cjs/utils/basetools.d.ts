export declare const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
/**
 * Encodes a Uint8Array of bytes as a Base58-encoded string for use in Bitcoin addresses.
 *
 * @param bytes An array of bytes to encode.
 * @returns A Base58-encoded string.
 */
export declare function base58BitcoinEncode(bytes: Uint8Array): string;
/**
 * Decodes a Base58-encoded string used in Bitcoin addresses to a Uint8Array of bytes.
 *
 * @param str A Base58-encoded string to decode.
 * @returns An array of bytes.
 * @throws Error if the input string contains characters not in the ALPHABET string.
 */
export declare function base58BitcoinDecode(str: string): Uint8Array;
export declare const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
/**
 * Encodes binary data to Base32 RFC 4648 format.
 *
 * @param data - The binary data to encode as a Uint8Array.
 * @returns The Base32-encoded string.
 */
export declare function base32rfcEncode(data: Uint8Array): string;
/**
 * Decodes binary data from Base32 RFC 4648 format.
 *
 * @param encoded - The Base32-encoded string to decode.
 * @returns The decoded binary data as a Uint8Array.
 */
export declare function base32rfcDecode(encoded: string): Uint8Array;
/**
 * Encodes a Uint8Array as a base64url-encoded string.
 *
 * @param input The Uint8Array to encode.
 * @returns The base64url-encoded string.
 */
export declare function base64urlEncode(input: Uint8Array): string;
/**
 * Decodes a base64url-encoded string as a Uint8Array.
 *
 * @param input The base64url-encoded string to decode.
 * @returns The decoded Uint8Array.
 */
export declare function base64urlDecode(input: string): Uint8Array;
//# sourceMappingURL=basetools.d.ts.map
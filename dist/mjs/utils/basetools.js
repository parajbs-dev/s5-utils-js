import { Buffer } from "buffer";
// Define the Base58 alphabet used for Bitcoin addresses
export const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
/**
 * Encodes a Buffer of bytes as a Base58-encoded string for use in Bitcoin addresses.
 *
 * @param bytes An array of bytes to encode.
 * @returns A Base58-encoded string.
 */
export function base58BitcoinEncode(bytes) {
    const digits = [0]; // Initialize an array of digits with a single 0
    for (let i = 0; i < bytes.length; i++) {
        // Multiply each digit in the array by 256 (left-shift by 8 bits) and add the byte's value to the first digit
        for (let j = 0; j < digits.length; j++) {
            digits[j] <<= 8;
        }
        digits[0] += bytes[i];
        // Perform a base conversion from base 256 to base 58
        let carry = 0;
        for (let j = 0; j < digits.length; ++j) {
            digits[j] += carry;
            carry = (digits[j] / 58) | 0;
            digits[j] %= 58;
        }
        while (carry) {
            digits.push(carry % 58);
            carry = (carry / 58) | 0;
        }
    }
    // Remove leading zeros from the digits array and convert the remaining digits back to characters in the ALPHABET string
    let result = '';
    while (digits[digits.length - 1] === 0) {
        digits.pop();
    }
    for (let i = digits.length - 1; i >= 0; i--) {
        result += ALPHABET[digits[i]];
    }
    return result;
}
/**
 * Decodes a Base58-encoded string used in Bitcoin addresses to a Buffer of bytes.
 *
 * @param str A Base58-encoded string to decode.
 * @returns An array of bytes.
 * @throws Error if the input string contains characters not in the ALPHABET string.
 */
export function base58BitcoinDecode(str) {
    const bytes = []; // Initialize an empty array for the decoded bytes
    for (let i = 0; i < str.length; i++) {
        // Convert each character in the input string to its corresponding value in the ALPHABET string
        let value = ALPHABET.indexOf(str[i]);
        if (value === -1) {
            throw new Error('Invalid Base58Bitcoin string');
        }
        // Perform a base conversion from base 58 to base 256
        for (let j = 0; j < bytes.length; j++) {
            value += bytes[j] * 58;
            bytes[j] = value & 0xff;
            value >>= 8;
        }
        while (value > 0) {
            bytes.push(value & 0xff);
            value >>= 8;
        }
    }
    // Reverse the order of the bytes in the array and return as a Buffer
    bytes.reverse();
    return Buffer.from(bytes);
}
// Base32 RFC 4648 Alphabet
export const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
/**
 * Encodes binary data to Base32 RFC 4648 format.
 *
 * @param data - The binary data to encode as a Buffer.
 * @returns The Base32-encoded string.
 */
export function base32rfcEncode(data) {
    let result = '';
    let bits = 0;
    let value = 0;
    for (let i = 0; i < data.length; i++) {
        // Append the bits of the current byte to the value
        value = (value << 8) | data[i];
        bits += 8;
        // While there are at least 5 bits in the value, extract the 5 most significant bits
        while (bits >= 5) {
            const index = (value >>> (bits - 5)) & 31; // Mask the 5 most significant bits
            result += BASE32_ALPHABET.charAt(index); // Append the corresponding character to the result
            bits -= 5; // Remove the 5 bits from the value
        }
    }
    // If there are any remaining bits in the value, append the final character to the result
    if (bits > 0) {
        const index = (value << (5 - bits)) & 31; // Pad the remaining bits with 0s and mask the 5 most significant bits
        result += BASE32_ALPHABET.charAt(index); // Append the corresponding character to the result
    }
    return result;
}
/**
 * Decodes binary data from Base32 RFC 4648 format.
 *
 * @param encoded - The Base32-encoded string to decode.
 * @returns The decoded binary data as a Buffer.
 */
export function base32rfcDecode(encoded) {
    const result = new Uint8Array(Math.ceil(encoded.length * 5 / 8)); // Allocate the result array
    let bits = 0;
    let value = 0;
    let index = 0;
    for (let i = 0; i < encoded.length; i++) {
        const c = encoded.charAt(i);
        const charIndex = BASE32_ALPHABET.indexOf(c);
        // Append the bits corresponding to the character to the value
        value = (value << 5) | charIndex;
        bits += 5;
        // While there are at least 8 bits in the value, extract the 8 most significant bits
        if (bits >= 8) {
            result[index++] = (value >>> (bits - 8)) & 255; // Mask the 8 most significant bits and append to the result
            bits -= 8; // Remove the 8 bits from the value
        }
    }
    // Return a subarray of the result that only includes the filled elements
    //return result.subarray(0, index);
    // Convert the Uint8Array to a Buffer
    const buffer = Buffer.from(result.subarray(0, index));
    // Return the Buffer
    return buffer;
}
/**
 * Encodes a Buffer as a base64url-encoded string.
 *
 * @param input The Buffer to encode.
 * @returns The base64url-encoded string.
 */
export function base64urlEncode(input) {
    const base64 = btoa(String.fromCharCode(...input));
    return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}
/**
 * Decodes a base64url-encoded string as a Buffer.
 *
 * @param input The base64url-encoded string to decode.
 * @returns The decoded Buffer.
 */
export function base64urlDecode(input) {
    input = input.replace(/-/g, '+').replace(/_/g, '/');
    const paddingLength = input.length % 4;
    if (paddingLength > 0) {
        input += '='.repeat(4 - paddingLength);
    }
    const base64 = atob(input);
    const output = Buffer.alloc(base64.length);
    for (let i = 0; i < base64.length; i++) {
        output[i] = base64.charCodeAt(i);
    }
    return output;
}

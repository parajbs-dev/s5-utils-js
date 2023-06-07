import { Buffer } from "buffer";

// Define the Base58 alphabet used for Bitcoin addresses
export const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

/**
 * Encodes a buffer of bytes using Base58 encoding (specifically designed for Bitcoin addresses).
 *
 * @param bytes The buffer of bytes to encode.
 * @returns The Base58-encoded string representation of the input bytes.
 */
export function encodeBase58BTC(bytes: Buffer): string {
  const digits: number[] = [0]; // Initialize an array of digits with a single 0

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
  let result = "";
  while (digits[digits.length - 1] === 0) {
    digits.pop();
  }

  for (let i = digits.length - 1; i >= 0; i--) {
    result += ALPHABET[digits[i]];
  }

  return result;
}

/**
 * Decodes a Base58btc string into a Buffer object.
 *
 * @param str The Base58btc encoded string to decode.
 * @returns A Buffer object containing the decoded bytes.
 * @throws Error if the input string is not a valid Base58btc string.
 */
export function decodeBase58BTC(str: string): Buffer {
  const bytes: number[] = []; // Initialize an empty array for the decoded bytes

  for (let i = 0; i < str.length; i++) {
    // Convert each character in the input string to its corresponding value in the ALPHABET string
    let value = ALPHABET.indexOf(str[i]);
    if (value === -1) {
      throw new Error("Invalid Base58Bitcoin string");
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
export const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

/**
 * Encodes data using the Base32 encoding scheme based on the RFC 4648 specification.
 *
 * @param data - The input data to be encoded as a Buffer object.
 * @returns The Base32 encoded string.
 */
export function encodeBase32RFC(data: Buffer): string {
  let result = "";
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
 * Decodes a string encoded in Base32 RFC 4648 format into a Buffer object.
 *
 * @param encoded The Base32 encoded string to decode.
 * @returns A Buffer containing the decoded bytes.
 */
export function decodeBase32RFC(encoded: string): Buffer {
  const result = new Uint8Array(Math.ceil((encoded.length * 5) / 8)); // Allocate the result array

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

  // Convert the Uint8Array to a Buffer
  const buffer = Buffer.from(result.subarray(0, index));

  // Return the Buffer
  return buffer;
}

/**
 * Encodes a buffer into a Base64URL string.
 *
 * @param input - The buffer to be encoded.
 * @returns The Base64URL-encoded string.
 */
export function encodeBase64URL(input: Buffer): string {
  // Convert the buffer into a string of characters using the spread operator
  const base64 = btoa(String.fromCharCode(...input));

  // Replace characters in the Base64 string to make it URL-safe
  return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

/**
 * Decodes a Base64 URL-encoded string into a Buffer object.
 *
 * @param input - The Base64 URL-encoded string to decode.
 * @returns A Buffer object containing the decoded binary data.
 */
export function decodeBase64URL(input: string): Buffer {
  // Replace characters '-' with '+' and '_' with '/' in the input string
  input = input.replace(/-/g, "+").replace(/_/g, "/");

  // Calculate the padding length
  const paddingLength = input.length % 4;

  // Append necessary padding characters to the input string
  if (paddingLength > 0) {
    input += "=".repeat(4 - paddingLength);
  }

  // Decode the modified Base64 string using the built-in atob function
  const base64 = atob(input);

  // Create a new Buffer object with the same length as the decoded Base64 string
  const output = Buffer.alloc(base64.length);

  // Convert each character in the decoded Base64 string to its character code
  // and store it in the corresponding index of the output Buffer
  for (let i = 0; i < base64.length; i++) {
    output[i] = base64.charCodeAt(i);
  }

  // Return the resulting Buffer object
  return output;
}

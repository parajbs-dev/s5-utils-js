import { Buffer } from "buffer";

import {
  encodeBase58BTC,
  decodeBase58BTC,
  encodeBase32RFC,
  decodeBase32RFC,
  encodeBase64URL,
  decodeBase64URL,
} from "./basetools";

import { getSubdomainFromUrl } from "./url";

/**
 * Converts a number into a Buffer representation with a specified buffer size.
 * Any leading zero bytes are removed from the Buffer.
 * @param value1 The number to be converted into a Buffer.
 * @param bufferSize The size of the Buffer to be created.
 * @returns A Buffer containing the converted value.
 */
export function numToBuf(value1: number, bufferSize: number): Buffer {
  // Create a buffer of the specified size
  const buffer = Buffer.alloc(bufferSize);
  
  // Initialize the index of the last element in the buffer
  let lastIndex = bufferSize - 1;
  
  // Convert the input number to a BigInt
  let value = BigInt(value1);
  
  // Loop through each byte of the buffer
  for (let i = 0; i <= lastIndex; i++) {
    // Check if the value is zero
    if (value === 0n) {
      lastIndex = i - 1;
      break;
    }
    
    // Store the lowest 8 bits of the value as a number in the buffer
    buffer[i] = Number(value & 0xffn);
    
    // Shift the value right by 8 bits
    value = value >> 8n;
  }
  
  // Return the relevant portion of the buffer
  return buffer.slice(0, lastIndex + 1);
}

/**
 * Converts a portion of a Buffer to a signed integer.
 * @param buffer The Buffer containing the bytes to read from.
 * @returns The signed integer value obtained from the Buffer.
 */
export function bufToNum(buffer: Buffer): number {
  let value = 0n;
  const bufferLength = buffer.length;

  for (let i = bufferLength - 1; i >= 0; i--) {
    value = (value << 8n) + BigInt(buffer[i]);
  }

  return Number(value);
}

/**
 * Encodes a CID (Content Identifier) with a prefix "z" using base58btc-encoding.
 * @param bytes The Buffer object representing the Bitcoin address.
 * @returns The Cid with the prefix "z".
 */
export function encodeCIDWithPrefixZ(bytes: Buffer): string {
  // Check if the bytes has a length of 38 (standard uncompressed Bitcoin address)
  if (bytes.length === 38) {
    // Encode the input address using base58 encoding
    const zCid = "z" + encodeBase58BTC(bytes);
    // Return the modified Bitcoin address with the prefix "z"
    return zCid;
  } else {
    // Encode the input address using base58 encoding
    const zCid = "z" + encodeBase58BTC(bytes);
    // Return the modified Bitcoin address with the prefix "z"
    return zCid;
  }
  return "";
}

/**
 * Decodes a CID (Content Identifier) with a prefix 'z' if present.
 * @param cid - The CID to decode.
 * @returns A Buffer containing the decoded CID.
 * @throws Error if the input address is invalid.
 */
export function decodeCIDWithPrefixZ(cid: string): Buffer {
  if (cid[0] === "z") {
    const zCidBytes = decodeBase58BTC(cid.substring(1));
    return zCidBytes;
  }

  if (cid[0] !== "z") {
    const zCidBytes = decodeBase58BTC(cid);
    return zCidBytes;
  }

  // Handle the case where none of the conditions are met
  throw new Error("Invalid input address");
}

/**
 * Encodes a CID (Content Identifier) with a "u" prefix using base64url-encoding.
 * @param bytes The input CID as a Buffer object.
 * @returns The encoded CID with the "u" prefix as a string.
 */
export function encodeCIDWithPrefixU(bytes: Buffer): string {
  // Check if the input CID is of length 38.
  if (bytes.length === 38) {
    // Encode the CID using base64url-encoding and prefix it with "u".
    const uCid = "u" + encodeBase64URL(bytes);
    return uCid;
  } else {
    // Encode the CID using base64url-encoding and prefix it with "u".
    const uCid = "u" + encodeBase64URL(bytes);
    return uCid;
  }

  // If the bytes is not of length 38, return undefined.
  return "";
}

/**
 * Decodes a Content Identifier (CID) with a prefix 'u' and returns the decoded bytes as a Buffer.
 * @param cid The CID to decode, either prefixed with 'u' or already decoded.
 * @returns A Buffer containing the decoded bytes of the CID.
 * @throws Error Throws an error for an invalid 'u' CID format.
 */
export function decodeCIDWithPrefixU(cid: string): Buffer {
  if (cid[0] === "u") {
    const uCidBytes = decodeBase64URL(cid.substring(1));
    return uCidBytes;
  }

  if (cid[0] !== "u") {
    // Assume the input CID is already decoded and decode it using base64url-decoding.
    const uCidBytes = decodeBase64URL(cid);
    return uCidBytes;
  }

  // Throw an error for invalid CID format.
  throw new Error("Invalid u CID format");
}

/**
 * Encodes the given bytes using Base32rfc-encoding and prefixes the result with 'b'.
 * @param bytes - The bytes to encode (should have a length of 38).
 * @returns The encoded string prefixed with 'b', or an empty string if the input is invalid.
 */
export function encodeCIDWithPrefixB(bytes: Buffer): string {
  if (bytes.length === 38) {
    const bCid = "b" + encodeBase32RFC(bytes).toLowerCase();
    return bCid;
  } else {
    const bCid = "b" + encodeBase32RFC(bytes).toLowerCase();
    return bCid;
  }

  return "";
}

/**
 * Decodes a CID (Content Identifier) with a prefix 'B' or 'b' and returns the decoded bytes as a Buffer object.
 * If the CID starts with 'B' and contains any uppercase letters, it converts the CID to lowercase and removes the 'B' prefix.
 * If the CID starts with 'b' and contains any lowercase letters, it removes the 'b' prefix.
 * If the CID contains any lowercase letters, it converts all characters to uppercase.
 * @param cid The CID string to decode.
 * @returns The decoded CID bytes as a Buffer object.
 */
export function decodeCIDWithPrefixB(cid: string): Buffer {
  if (cid[0] === "B" && /[A-Z]/.test(cid)) {
    cid = cid.toLowerCase(); // Convert the CID to lowercase
    cid = cid.substring(1); // Remove the first character ("B")
  }

  if (cid[0] === "b" && /[a-z]/.test(cid)) {
    cid = cid.substring(1); // Remove the first character ("b")
  }

  if (/[a-z]/.test(cid)) {
    cid = cid.toUpperCase(); // Convert all characters to uppercase
  }

  const bCidBytes = decodeBase32RFC(cid); // Assuming decodeBase32RFC is defined elsewhere
  return bCidBytes;
}

/**
 * Converts a Base58btc-encoded CID to a Base32rfc-encoded CID.
 * @param cid - The Base58btc-encoded CID string to convert.
 * @returns The Base32rfc-encoded CID string.
 */
export function convertB58btcToB32rfcCid(cid: string): string {
  // Decode the base58btc-encoded CID using decodeBase58BTC function.
  const decoded = decodeBase58BTC(cid.substring(1));

  // Encode the decoded binary data as base32rfc using encodeBase32RFC function.
  const encoded = encodeBase32RFC(decoded).toString().replace(/=+$/, "").toLowerCase();

  // Add a 'b' prefix to the base32rfc-encoded string and return the result.
  return `b${encoded}`;
}

/**
 * Converts a Base32rfc-encoded CID to a Base58btc-encoded CID.
 * @param cid - The Base32rfc-encoded CID to convert.
 * @returns The Base58btc-encoded CID.
 */
export function convertB32rfcToB58btcCid(cid: string): string {
  // Decode the base32rfc-encoded CID using decodeBase32RFC function.
  const decoded = decodeBase32RFC(cid.substring(1).toUpperCase());

  // Encode the decoded binary data as base58btc using encodeBase58BTC function.
  const encoded = encodeBase58BTC(decoded);

  // Add a 'z' prefix to the base58btc-encoded string and return the result.
  return `z${encoded}`;
}

/**
 * Converts a base64URL-encoded CID to a base58btc-encoded CID.
 * @param cid The base64URL-encoded CID to convert.
 * @returns The base58btc-encoded CID.
 */
export function convertB64urlToB58btcCid(cid: string): string {
  // Decode the base58btc-encoded CID using decodeBase58BTC function.
  const decoded: Buffer = decodeBase64URL(cid.substring(1));

  // Encode the decoded binary data as base58btc using encodeBase58BTC function.
  const encoded: string = encodeBase58BTC(decoded);

  // Add a 'z' prefix to the base58btc-encoded string and return the result.
  return `z${encoded}`;
}

/**
 * Converts a base58btc-encoded CID (Content Identifier) to a base64url-encoded CID.
 * @param cid - The base58btc-encoded CID to be converted.
 * @returns The base64url-encoded CID with a 'u' prefix.
 */
export function convertB58btcToB64urlCid(cid: string): string {
  // Decode the base58btc-encoded CID using decodeBase58BTC function.
  const decoded: Buffer = decodeBase58BTC(cid.substring(1));

  // Encode the decoded binary data as base64url using encodeBase64URL function.
  const encoded: string = encodeBase64URL(decoded);

  // Add a 'u' prefix to the base64url-encoded string and return the result.
  return `u${encoded}`;
}

/**
 * Converts a base64url-encoded CID to a base32rfc-encoded CID.
 * @param cid The base64url-encoded CID to convert.
 * @returns The base32rfc-encoded CID.
 */
export function convertB64urlToB32rfcCid(cid: string): string {
  // Decode the base64url-encoded CID using decodeBase64URL function.
  const decoded = decodeBase64URL(cid.substring(1));

  // Encode the decoded binary data as base32rfc using encodeBase32RFC function.
  const encoded = encodeBase32RFC(decoded).toString().replace(/=+$/, "").toLowerCase();

  // Add a 'b' prefix to the base32rfc-encoded string and return the result.
  return `b${encoded}`;
}

/**
 * Converts a base32rfc-encoded CID to a base64url-encoded CID.
 * @param cid - The base32rfc-encoded CID to be converted.
 * @returns The base64url-encoded CID.
 */
export function convertB32rfcToB64urlCid(cid: string): string {
  // Decode the base32rfc-encoded CID using decodeBase32RFC function.
  const decoded = decodeBase32RFC(cid.substring(1).toUpperCase());

  // Encode the decoded binary data as base64url using encodeBase64URL function.
  const encoded = encodeBase64URL(decoded);

  // Add a 'u' prefix to the base64url-encoded string and return the result.
  return `u${encoded}`;
}

/**
 * Converts the download directory input CID into a different format based on certain conditions.
 * @param cid - The input CID to be converted.
 * @returns The converted CID.
 * @throws Error if the input CID is invalid or cannot be converted.
 */
export function convertDownloadDirectoryInputCid(cid: string): string {
  let responseCid: string | null = null;

  if (cid.startsWith("http")) {
    const subdomain = getSubdomainFromUrl(cid);
    if (subdomain !== null) {
      responseCid = subdomain;
    } else {
      throw new Error("Invalid CID input address");
    }
  } else {
    if (cid[0] === "z") {
      responseCid = convertB58btcToB32rfcCid(cid);
    }
    if (cid[0] === "u") {
      responseCid = convertB64urlToB32rfcCid(cid);
    }
    if (cid[0] === "b") {
      responseCid = cid;
    }
  }

  if (responseCid !== null) {
    return responseCid;
  } else {
    throw new Error("Invalid CID input address");
  }
}

import {
  base58BitcoinEncode,
  base58BitcoinDecode,
  base32rfcEncode,
  base32rfcDecode,
  base64urlEncode,
  base64urlDecode,
} from "./basetools";

/**
 * Encodes a CID using base58 encoding and adds a prefix "z".
 *
 * @param bytes - The bytes to encode.
 * @returns {string} - The encoded CID with "z" prefix or undefined if the cid is not of length 38.
 */
export function getS5zCidEncoded(bytes: Uint8Array): string {
  // Check if the bytes has a length of 38 (standard uncompressed Bitcoin address)
  if (bytes.length === 38) {
    // Encode the input address using base58 encoding
    const zCid = 'z' + base58BitcoinEncode(bytes);
    // Return the modified Bitcoin address with a prefix "z"
    return zCid;
  }
return '';
}

/**
 * Decodes a CID that has been encoded using base58 encoding and prefixed with "z".
 *
 * @param {string} cid - The CID to decode.
 * @returns {Uint8Array|undefined} - The decoded CID as a Uint8Array or undefined if the cid is not valid.
 */
export function getS5zBytesDecoded(cid: string): Uint8Array | undefined {
  // Check if the first character of the input address is "z" and the length is greater than or equal to 53
  if (cid[0] === 'z' && cid.length >= 53) {
    // Decode the remaining characters of the input address (excluding the prefix "z") using base58 decoding
    const zCidBytes: Uint8Array = base58BitcoinDecode(cid.substring(1));
    // Return the byte representation of the decoded Bitcoin address
    return zCidBytes;
  }
  // Check if the first character of the input address is not "z" and the length is less than or equal to 52
  if (cid[0] !== 'z' && cid.length <= 52) {
    // Decode the input address using base58 decoding
    const zCidBytes: Uint8Array = base58BitcoinDecode(cid);
    // Return the byte representation of the decoded Bitcoin address
    return zCidBytes;
  }
}

/**
 * Encodes a CID using base64url encoding and prefixes it with "u".
 *
 * @param bytes - The bytes to encode.
 * @returns {string|undefined} - The encoded CID with "u" prefix or undefined if the input CID is not of length 38.
 */
export function getS5uCidEncoded(bytes: Uint8Array): string {
  // Check if the input CID is of length 38.
  if (bytes.length === 38) {
    // Encode the CID using base64url encoding and prefix it with "u".
    const uCid = 'u' + base64urlEncode(bytes);
    return uCid;
  }
  // If the bytes is not of length 38, return undefined.
  return '';
}

/**
 * Decodes a CID that has been encoded using base64url encoding and prefixed with "u", or a CID that is already decoded.
 *
 * @param {string} cid - The CID to decode.
 * @returns {Uint8Array} - The decoded CID as a Uint8Array or undefined if the input CID is not valid.
 */
export function getS5uBytesDecoded(cid: string): Uint8Array  {
  // Check if the input CID is prefixed with "u" and has a length of at least 52.
  if (cid[0] === 'u' && cid.length >= 52) {
    // Decode the CID using base64url decoding after removing the "u" prefix.
    const uCidBytes = base64urlDecode(cid.substring(1));
    return uCidBytes;
  } 
  // Check if the input CID is not prefixed with "u" and has a length of no more than 51.
  if (cid[0] !== 'u' && cid.length <= 51) {
    // Assume the input CID is already decoded and decode it using base64url decoding.
    const uCidBytes = base64urlDecode(cid);
    return uCidBytes;
  }
  // If the input CID is not valid, return undefined.
  return new Uint8Array();
}

/**
 * Encodes a CID string using base32rfc encoding and adds "b" at the beginning of the resulting string.
 *
 * @param bytes - The bytes to encode.
 * @returns The encoded CID string with "b" at the beginning, or undefined if the input CID is not 38 characters long.
 */
export function getS5bCidEncoded(bytes: Uint8Array): string  {
  if (bytes.length === 38) {
    const bCid = 'b' + base32rfcEncode(bytes).toLowerCase();
    return bCid;
  }
return '';
}

/**
 * Decodes an encoded CID string and returns the decoded bytes.
 *
 * @param cid - The encoded CID string to decode.
 * @returns The decoded bytes of the CID as a Uint8Array.
 */
export function getS5bBytesDecoded(cid: string): Uint8Array {
  // Check if the CID starts with "B" (uppercase) and has length >= 62 and contains at least one uppercase character
  if (cid[0] === 'B' && cid.length >= 62 && /[A-Z]/.test(cid)) {
    cid = cid.toLowerCase(); // Convert the CID to lowercase
    cid = cid.substring(1); // Remove the first character ("B")
  }
  // Check if the CID starts with "b" (lowercase) and has length >= 62
  if (cid[0] === 'b' && cid.length >= 62) {
    cid = cid.substring(1); // Remove the first character ("b")
  } 
  // Check if the CID contains any lowercase characters and has length <= 61
  if (/[a-z]/.test(cid) && cid.length <= 61) {
    cid = cid.toUpperCase(); // Convert all characters to uppercase
  }
  // Decode the CID using base32rfc decoding and return the decoded bytes
  const bCidBytes = base32rfcDecode(cid);
  return bCidBytes;
}

/**
 * Converts a base58-encoded CID to a base32-encoded CID.
 *
 * @param cid - The base58-encoded CID string to convert.
 * @returns The base32-encoded CID string.
 */
export function convertBase58ToBase32(cid: string): string {
  // Decode the base58-encoded CID using base58BitcoinDecode function.
  const decoded = base58BitcoinDecode(cid.substring(1));

  // Encode the decoded binary data as base32 using base32rfcEncode function.
  const encoded = base32rfcEncode(decoded).toString().replace(/=+$/, '').toLowerCase();

  // Add a 'b' prefix to the base32-encoded string and return the result.
  return `b${encoded}`;
}

/**
 * Converts a base32-encoded CID to a base58-encoded CID.
 *
 * @param cid - The base32-encoded CID string to convert.
 * @returns The base58-encoded CID string.
 */
export function convertBase32ToBase58(cid: string): string {
  // Decode the base32-encoded CID using base32rfcDecode function.
  const decoded = base32rfcDecode(cid.substring(1).toUpperCase());

  // Encode the decoded binary data as base58 using base58BitcoinEncode function.
  const encoded = base58BitcoinEncode(decoded);

  // Add a 'z' prefix to the base58-encoded string and return the result.
  return `z${encoded}`;
}

/**
 * Converts a CID from base64url encoding to base58 encoding.
 *
 * @param cid - The CID in base64url encoding.
 * @returns The CID in base58 encoding.
 */
export function convertBase64urlToBase58(cid: string): string {
  // Decode the base58-encoded CID using base58BitcoinDecode function.
  const decoded: Uint8Array = base64urlDecode(cid.substring(1));

  // Encode the decoded binary data as base58 using base58BitcoinEncode function.
  const encoded: string = base58BitcoinEncode(decoded);

  // Add a 'z' prefix to the base58-encoded string and return the result.
  return `z${encoded}`;
}

/**
 * Converts a CID from base58 encoding to base64url encoding.
 *
 * @param cid - The CID in base58 encoding.
 * @returns The CID in base64url encoding.
 */
export function convertBase58ToBase64url(cid: string): string {
  // Decode the base58-encoded CID using base58BitcoinDecode function.
  const decoded: Uint8Array = base58BitcoinDecode(cid.substring(1));

  // Encode the decoded binary data as base64url using base64urlEncode function.
  const encoded: string = base64urlEncode(decoded);

  // Add a 'u' prefix to the base64url-encoded string and return the result.
  return `u${encoded}`;
}

/**
 * Converts a CID encoded in base64url format to base32 format.
 *
 * @param cid The CID to convert.
 * @returns The CID encoded in base32 format.
 */
export function convertBase64urlToBase32(cid: string): string {
  // Decode the base64url-encoded CID using base64urlDecode function.
  const decoded = base64urlDecode(cid.substring(1));

  // Encode the decoded binary data as base32 using base32rfcEncode function.
  const encoded = base32rfcEncode(decoded).toString().replace(/=+$/, '').toLowerCase();

  // Add a 'b' prefix to the base32-encoded string and return the result.
  return `b${encoded}`;
}

/**
 * Converts a CID encoded in base32 format to base64url format.
 *
 * @param cid The CID to convert.
 * @returns The CID encoded in base64url format.
 */
export function convertBase32ToBase64url(cid: string): string {
  // Decode the base32-encoded CID using base32rfcDecode function.
  const decoded = base32rfcDecode(cid.substring(1).toUpperCase());

  // Encode the decoded binary data as base64url using base64urlEncode function.
  const encoded = base64urlEncode(decoded);

  // Add a 'u' prefix to the base64url-encoded string and return the result.
  return `u${encoded}`;
}


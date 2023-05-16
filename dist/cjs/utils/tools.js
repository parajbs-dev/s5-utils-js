"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertBase32ToBase64url = exports.convertBase64urlToBase32 = exports.convertBase58ToBase64url = exports.convertBase64urlToBase58 = exports.convertBase32ToBase58 = exports.convertBase58ToBase32 = exports.getS5bBytesDecoded = exports.getS5bCidEncoded = exports.getS5uBytesDecoded = exports.getS5uCidEncoded = exports.getS5zBytesDecoded = exports.getS5zCidEncoded = void 0;
const basetools_1 = require("./basetools");
/**
 * Encodes a CID using base58 encoding and adds a prefix "z".
 *
 * @param bytes - The bytes to encode.
 * @returns {string|undefined} - The encoded CID with "z" prefix or undefined if the cid is not of length 38.
 */
function getS5zCidEncoded(bytes) {
    // Check if the bytes has a length of 38 (standard uncompressed Bitcoin address)
    if (bytes.length === 38) {
        // Encode the input address using base58 encoding
        const zCid = 'z' + (0, basetools_1.base58BitcoinEncode)(bytes);
        // Return the modified Bitcoin address with a prefix "z"
        return zCid;
    }
}
exports.getS5zCidEncoded = getS5zCidEncoded;
/**
 * Decodes a CID that has been encoded using base58 encoding and prefixed with "z".
 *
 * @param {string} cid - The CID to decode.
 * @returns {Uint8Array|undefined} - The decoded CID as a Uint8Array or undefined if the cid is not valid.
 */
function getS5zBytesDecoded(cid) {
    // Check if the first character of the input address is "z" and the length is greater than or equal to 53
    if (cid[0] === 'z' && cid.length >= 53) {
        // Decode the remaining characters of the input address (excluding the prefix "z") using base58 decoding
        const zCidBytes = (0, basetools_1.base58BitcoinDecode)(cid.substring(1));
        // Return the byte representation of the decoded Bitcoin address
        return zCidBytes;
    }
    // Check if the first character of the input address is not "z" and the length is less than or equal to 52
    if (cid[0] !== 'z' && cid.length <= 52) {
        // Decode the input address using base58 decoding
        const zCidBytes = (0, basetools_1.base58BitcoinDecode)(cid);
        // Return the byte representation of the decoded Bitcoin address
        return zCidBytes;
    }
}
exports.getS5zBytesDecoded = getS5zBytesDecoded;
/**
 * Encodes a CID using base64url encoding and prefixes it with "u".
 *
 * @param bytes - The bytes to encode.
 * @returns {string|undefined} - The encoded CID with "u" prefix or undefined if the input CID is not of length 38.
 */
function getS5uCidEncoded(bytes) {
    // Check if the input CID is of length 38.
    if (bytes.length === 38) {
        // Encode the CID using base64url encoding and prefix it with "u".
        const uCid = 'u' + (0, basetools_1.base64urlEncode)(bytes);
        return uCid;
    }
    // If the bytes is not of length 38, return undefined.
    return undefined;
}
exports.getS5uCidEncoded = getS5uCidEncoded;
/**
 * Decodes a CID that has been encoded using base64url encoding and prefixed with "u", or a CID that is already decoded.
 *
 * @param {string} cid - The CID to decode.
 * @returns {Uint8Array|undefined} - The decoded CID as a Uint8Array or undefined if the input CID is not valid.
 */
function getS5uBytesDecoded(cid) {
    // Check if the input CID is prefixed with "u" and has a length of at least 52.
    if (cid[0] === 'u' && cid.length >= 52) {
        // Decode the CID using base64url decoding after removing the "u" prefix.
        const uCidBytes = (0, basetools_1.base64urlDecode)(cid.substring(1));
        return uCidBytes;
    }
    // Check if the input CID is not prefixed with "u" and has a length of no more than 51.
    if (cid[0] !== 'u' && cid.length <= 51) {
        // Assume the input CID is already decoded and decode it using base64url decoding.
        const uCidBytes = (0, basetools_1.base64urlDecode)(cid);
        return uCidBytes;
    }
    // If the input CID is not valid, return undefined.
    return undefined;
}
exports.getS5uBytesDecoded = getS5uBytesDecoded;
/**
 * Encodes a CID string using base32rfc encoding and adds "b" at the beginning of the resulting string.
 *
 * @param bytes - The bytes to encode.
 * @returns The encoded CID string with "b" at the beginning, or undefined if the input CID is not 38 characters long.
 */
function getS5bCidEncoded(bytes) {
    if (bytes.length === 38) {
        const bCid = 'b' + (0, basetools_1.base32rfcEncode)(bytes).toLowerCase();
        return bCid;
    }
}
exports.getS5bCidEncoded = getS5bCidEncoded;
/**
 * Decodes an encoded CID string and returns the decoded bytes.
 *
 * @param cid - The encoded CID string to decode.
 * @returns The decoded bytes of the CID as a Uint8Array.
 */
function getS5bBytesDecoded(cid) {
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
    const bCidBytes = (0, basetools_1.base32rfcDecode)(cid);
    return bCidBytes;
}
exports.getS5bBytesDecoded = getS5bBytesDecoded;
/**
 * Converts a base58-encoded CID to a base32-encoded CID.
 *
 * @param cid - The base58-encoded CID string to convert.
 * @returns The base32-encoded CID string.
 */
function convertBase58ToBase32(cid) {
    // Decode the base58-encoded CID using base58BitcoinDecode function.
    const decoded = (0, basetools_1.base58BitcoinDecode)(cid.substring(1));
    // Encode the decoded binary data as base32 using base32rfcEncode function.
    const encoded = (0, basetools_1.base32rfcEncode)(decoded).toString().replace(/=+$/, '').toLowerCase();
    // Add a 'b' prefix to the base32-encoded string and return the result.
    return `b${encoded}`;
}
exports.convertBase58ToBase32 = convertBase58ToBase32;
/**
 * Converts a base32-encoded CID to a base58-encoded CID.
 *
 * @param cid - The base32-encoded CID string to convert.
 * @returns The base58-encoded CID string.
 */
function convertBase32ToBase58(cid) {
    // Decode the base32-encoded CID using base32rfcDecode function.
    const decoded = (0, basetools_1.base32rfcDecode)(cid.substring(1).toUpperCase());
    // Encode the decoded binary data as base58 using base58BitcoinEncode function.
    const encoded = (0, basetools_1.base58BitcoinEncode)(decoded);
    // Add a 'z' prefix to the base58-encoded string and return the result.
    return `z${encoded}`;
}
exports.convertBase32ToBase58 = convertBase32ToBase58;
/**
 * Converts a CID from base64url encoding to base58 encoding.
 *
 * @param cid - The CID in base64url encoding.
 * @returns The CID in base58 encoding.
 */
function convertBase64urlToBase58(cid) {
    // Decode the base58-encoded CID using base58BitcoinDecode function.
    const decoded = (0, basetools_1.base64urlDecode)(cid.substring(1));
    // Encode the decoded binary data as base58 using base58BitcoinEncode function.
    const encoded = (0, basetools_1.base58BitcoinEncode)(decoded);
    // Add a 'z' prefix to the base58-encoded string and return the result.
    return `z${encoded}`;
}
exports.convertBase64urlToBase58 = convertBase64urlToBase58;
/**
 * Converts a CID from base58 encoding to base64url encoding.
 *
 * @param cid - The CID in base58 encoding.
 * @returns The CID in base64url encoding.
 */
function convertBase58ToBase64url(cid) {
    // Decode the base58-encoded CID using base58BitcoinDecode function.
    const decoded = (0, basetools_1.base58BitcoinDecode)(cid.substring(1));
    // Encode the decoded binary data as base64url using base64urlEncode function.
    const encoded = (0, basetools_1.base64urlEncode)(decoded);
    // Add a 'u' prefix to the base64url-encoded string and return the result.
    return `u${encoded}`;
}
exports.convertBase58ToBase64url = convertBase58ToBase64url;
/**
 * Converts a CID encoded in base64url format to base32 format.
 *
 * @param cid The CID to convert.
 * @returns The CID encoded in base32 format.
 */
function convertBase64urlToBase32(cid) {
    // Decode the base64url-encoded CID using base64urlDecode function.
    const decoded = (0, basetools_1.base64urlDecode)(cid.substring(1));
    // Encode the decoded binary data as base32 using base32rfcEncode function.
    const encoded = (0, basetools_1.base32rfcEncode)(decoded).toString().replace(/=+$/, '').toLowerCase();
    // Add a 'b' prefix to the base32-encoded string and return the result.
    return `b${encoded}`;
}
exports.convertBase64urlToBase32 = convertBase64urlToBase32;
/**
 * Converts a CID encoded in base32 format to base64url format.
 *
 * @param cid The CID to convert.
 * @returns The CID encoded in base64url format.
 */
function convertBase32ToBase64url(cid) {
    // Decode the base32-encoded CID using base32rfcDecode function.
    const decoded = (0, basetools_1.base32rfcDecode)(cid.substring(1).toUpperCase());
    // Encode the decoded binary data as base64url using base64urlEncode function.
    const encoded = (0, basetools_1.base64urlEncode)(decoded);
    // Add a 'u' prefix to the base64url-encoded string and return the result.
    return `u${encoded}`;
}
exports.convertBase32ToBase64url = convertBase32ToBase64url;

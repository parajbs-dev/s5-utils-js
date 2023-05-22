"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllInfosFromCid = exports.convertS5CidToB3hashHex = exports.convertS5CidToMHashB64url = exports.convertS5CidToMHash = exports.convertMHashToB64url = exports.extractB3hashFromCID = exports.extractRawSizeFromCID = exports.extractMHashFromCID = exports.generateCIDFromMHash = exports.extractB3hashFromMHash = exports.generateMHashFromB3hash = exports.calculateB3hashFromFile = exports.bufToNum = exports.numToBuf = void 0;
const blake3 = __importStar(require("blake3-wasm"));
const buffer_1 = require("buffer");
const tools_1 = require("./tools");
const constants_1 = require("./constants");
/**
 * Converts a number into a Buffer of a specified size.
 * If the resulting value requires fewer bytes than the buffer size,
 * the returned Buffer will be truncated accordingly.
 *
 * @param value - The number to convert into a Buffer.
 * @param bufferSize - The desired size of the resulting Buffer.
 * @returns A Buffer containing the converted number.
 */
function numToBuf(value, bufferSize) {
    // Create a new Buffer of the specified size
    const buffer = buffer_1.Buffer.alloc(bufferSize);
    let lastIndex = bufferSize - 1;
    // Iterate over the buffer from index 0 to lastIndex
    for (let i = 0; i <= lastIndex; i++) {
        // If the value is 0, update the lastIndex and exit the loop
        if (value === 0) {
            lastIndex = i - 1;
            break;
        }
        // Set the least significant byte of the value in the current buffer index
        buffer[i] = value % 256;
        // Right shift the value by 8 bits to move to the next byte
        value = value >> 8;
    }
    // Return a subarray of the buffer from index 0 to lastIndex + 1
    return buffer.subarray(0, lastIndex + 1);
}
exports.numToBuf = numToBuf;
/**
 * Converts a portion of a Buffer to a signed integer.
 *
 * @param bytes The Buffer containing the bytes to read from.
 * @param bufferSize The number of bytes to read from the Buffer.
 * @returns The signed integer value obtained from the Buffer.
 */
function bufToNum(bytes, bufferSize) {
    // Read a 4-byte signed integer from the bytes in little-endian format
    const numberFromBuf = bytes.readIntLE(0, bufferSize);
    // Return the 4-byte signed integer
    return numberFromBuf;
}
exports.bufToNum = bufToNum;
/**
 * Calculates the BLAKE3 hash of a file.
 *
 * @param file - The file to calculate the hash from.
 * @returns A promise that resolves to a Buffer containing the BLAKE3 hash.
 */
async function calculateB3hashFromFile(file) {
    // Load the BLAKE3 library asynchronously
    await blake3.load();
    // Create a hash object
    const hasher = blake3.createHash();
    // Define the chunk size (1 MB)
    const chunkSize = 1024 * 1024;
    // Initialize the position to 0
    let position = 0;
    // Process the file in chunks
    while (position <= file.size) {
        // Slice the file to extract a chunk
        const chunk = file.slice(position, position + chunkSize);
        // Update the hash with the chunk's data
        hasher.update(await chunk.arrayBuffer());
        // Move to the next position
        position += chunkSize;
    }
    // Obtain the final hash value
    const b3hash = hasher.digest();
    // Return the hash value as a Promise resolved to a Buffer
    return b3hash;
}
exports.calculateB3hashFromFile = calculateB3hashFromFile;
/**
 * Generates an S5 mHash by prepending a given Blake3 hash with a default value.
 *
 * @param b3hash - The input Blake3 hash buffer.
 * @returns The resulting S5 mHash buffer.
 */
function generateMHashFromB3hash(b3hash) {
    // Create a new Buffer called `mHash`.
    const mHash = buffer_1.Buffer.concat([buffer_1.Buffer.alloc(1, constants_1.mhashBlake3Default), buffer_1.Buffer.from(b3hash)]);
    // Return the `mHash` buffer as the result.
    return mHash;
}
exports.generateMHashFromB3hash = generateMHashFromB3hash;
/**
 * Extracts the Blake3 hash from the given mHash buffer.
 *
 * @param mHash - The mHash buffer from which to extract the Blake3 hash.
 * @returns The extracted Blake3 hash buffer.
 */
function extractB3hashFromMHash(mHash) {
    // Slice the input buffer starting from index 1
    const b3hash = mHash.slice(1);
    // Return the extracted portion
    return b3hash;
}
exports.extractB3hashFromMHash = extractB3hashFromMHash;
/**
 * Generates a S5 CID (Content Identifier) from a hash and file size - into a Buffer.
 *
 * @param mHash The hash value as a Buffer object.
 * @param file The file object.
 * @returns The generated CID as a Buffer object.
 */
function generateCIDFromMHash(mHash, file) {
    // Buffer size for storing the file size
    const bufSize = 4;
    // Concatenate the CID parts
    const cid = buffer_1.Buffer.concat([
        buffer_1.Buffer.alloc(1, constants_1.cidTypeRaw),
        mHash,
        numToBuf(file.size, bufSize) // File size converted to buffer
    ]);
    return cid;
}
exports.generateCIDFromMHash = generateCIDFromMHash;
/**
 * Extracts the mHash from a CID buffer.
 *
 * @param cid - The CID buffer.
 * @returns The extracted mHash as a Buffer.
 */
function extractMHashFromCID(cid) {
    // Size of the CID type (assuming 1 byte)
    const cidTypeSize = 1;
    // Size of the hash (assuming hash size matches mHash)
    let hashSize = cid.length - cidTypeSize; // Initialize hashSize with a value
    let i = 0;
    while (hashSize !== 33) {
        // Update the variables for the next iteration
        i++;
        hashSize = cid.length - i;
    }
    // Extract the mHash from the CID buffer
    const mHash = cid.slice(cidTypeSize, cidTypeSize + hashSize);
    return mHash;
}
exports.extractMHashFromCID = extractMHashFromCID;
/**
 * Extracts the raw file size from a CID (Content Identifier) buffer.
 *
 * @param cid - The CID buffer containing the file size information.
 * @returns The extracted file size as a number.
 */
function extractRawSizeFromCID(cid) {
    // Extract the portion of the CID buffer containing the file size information
    const rawfilesizeBuffer = cid.slice(34);
    // Buffer size for storing the file size
    const bufSize = 4;
    // Read a 4-byte signed integer from the rawfilesizeBuffer in little-endian format
    const rawfilesize = bufToNum(rawfilesizeBuffer, bufSize);
    // Return the file size
    return rawfilesize;
}
exports.extractRawSizeFromCID = extractRawSizeFromCID;
/**
 * Extracts a Blake3 hash from a CID (Content Identifier) buffer.
 *
 * @param cid - The CID buffer.
 * @returns The extracted Blake3 hash as a buffer.
 */
function extractB3hashFromCID(cid) {
    // Size of the CID type (assuming 1 byte)
    const cidTypeSize = 1;
    // Size of the hash (assuming hash size matches mHash)
    //let hashSize: number;
    let hashSize = cid.length - cidTypeSize; // Initialize hashSize with a value
    let i = 0;
    while (hashSize !== 33) {
        // Update the variables for the next iteration
        i++;
        hashSize = cid.length - i;
    }
    // Extract the mHash from the CID buffer
    const mHash = cid.slice(cidTypeSize, cidTypeSize + hashSize);
    const b3hash = extractB3hashFromMHash(mHash);
    return b3hash;
}
exports.extractB3hashFromCID = extractB3hashFromCID;
/**
 * Converts a hash Buffer to a URL-safe Base64 string.
 *
 * @param mHash The mHash Buffer to be converted.
 * @returns The URL-safe Base64 string representation of the mHash.
 */
function convertMHashToB64url(mHash) {
    // Convert the hash Buffer to a Base64 string
    const hashBase64 = mHash.toString("base64");
    // Make the Base64 string URL-safe
    const hashBase64url = hashBase64
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace("=", "");
    return hashBase64url;
}
exports.convertMHashToB64url = convertMHashToB64url;
/**
 * Converts a S5 CID (Content Identifier) to an mHash.
 *
 * @param cid The CID string to convert.
 * @returns The mHash as a Buffer.
 * @throws Error if the CID input address is invalid.
 */
function convertS5CidToMHash(cid) {
    let mhash;
    // Check the first character of the CID string
    if (cid[0] === 'z') {
        // Decode the CID using decodeCIDWithPrefixZ function
        const cidBytes = (0, tools_1.decodeCIDWithPrefixZ)(cid);
        // Get the mHash from the decoded CID using extractMHashFromCID function
        mhash = extractMHashFromCID(cidBytes);
    }
    else if (cid[0] === 'u') {
        // Decode the CID using decodeCIDWithPrefixU function
        const cidBytes = (0, tools_1.decodeCIDWithPrefixU)(cid);
        // Get the mHash from the decoded CID using extractMHashFromCID function
        mhash = extractMHashFromCID(cidBytes);
    }
    else if (cid[0] === 'b') {
        // Decode the CID using decodeCIDWithPrefixB function
        const cidBytes = (0, tools_1.decodeCIDWithPrefixB)(cid);
        // Get the mHash from the decoded CID using extractMHashFromCID function
        mhash = extractMHashFromCID(cidBytes);
    }
    else {
        // Invalid CID input address
        throw new Error('Invalid CID input address');
    }
    return mhash;
}
exports.convertS5CidToMHash = convertS5CidToMHash;
/**
 * Converts an S5 CID to a base64 URL-formatted mHash.
 *
 * @param cid The S5 CID to convert.
 * @returns The base64 URL-formatted mHash.
 */
function convertS5CidToMHashB64url(cid) {
    // Convert S5 CID to MHash
    const mhash2cid = convertS5CidToMHash(cid);
    // Convert MHash to Base64 URL format
    const mHashBase64url = convertMHashToB64url(mhash2cid);
    // Return the Base64 URL formatted MHash
    return mHashBase64url;
}
exports.convertS5CidToMHashB64url = convertS5CidToMHashB64url;
/**
 * Converts an S5 CID (Content Identifier) to a Blake3 hash in hexadecimal format.
 *
 * @param cid The S5 CID to convert.
 * @returns The Blake3 hash of the CID in hexadecimal format.
 * @throws {Error} If the input CID is invalid.
 */
function convertS5CidToB3hashHex(cid) {
    let b3hash = null;
    if (cid[0] === 'z') {
        // Decode the CID using decodeCIDWithPrefixZ function
        const zcidBytes = (0, tools_1.decodeCIDWithPrefixZ)(cid);
        b3hash = extractB3hashFromCID(zcidBytes);
    }
    if (cid[0] === 'u') {
        // Decode the CID using decodeCIDWithPrefixU function
        const ucidBytes = (0, tools_1.decodeCIDWithPrefixU)(cid);
        b3hash = extractB3hashFromCID(ucidBytes);
    }
    if (cid[0] === 'b') {
        // Decode the CID using decodeCIDWithPrefixB function
        const bcidBytes = (0, tools_1.decodeCIDWithPrefixB)(cid);
        b3hash = extractB3hashFromCID(bcidBytes);
    }
    if (b3hash != null) {
        return b3hash.toString('hex');
    }
    else {
        throw new Error('Invalid CID input address');
    }
}
exports.convertS5CidToB3hashHex = convertS5CidToB3hashHex;
/**
 * Retrieves various information from a CID (Content Identifier).
 *
 * @param cid - The CID string.
 * @returns An object containing different representations and extracted information from the CID.
 * @throws {Error} If the CID input address is invalid.
 */
function getAllInfosFromCid(cid) {
    let zCid; // CID encoded with the "z" prefix
    let uCid; // CID encoded with the "u" prefix
    let bCid; // CID encoded with the "b" prefix
    let mHashBase64url; // CID converted to Base64URL-encoded multihash
    let b3hashHex; // CID converted to hexadecimal B3 hash
    let b3FilesSize; // Raw size extracted from the CID
    // Check the first character of the CID string
    if (cid[0] === 'z') {
        // Decode the CID using decodeCIDWithPrefixZ function
        const zcidBytes = (0, tools_1.decodeCIDWithPrefixZ)(cid);
        zCid = (0, tools_1.encodeCIDWithPrefixZ)(zcidBytes);
        uCid = (0, tools_1.encodeCIDWithPrefixU)(zcidBytes);
        bCid = (0, tools_1.encodeCIDWithPrefixB)(zcidBytes);
        mHashBase64url = convertS5CidToMHashB64url(cid);
        b3hashHex = convertS5CidToB3hashHex(cid);
        b3FilesSize = extractRawSizeFromCID(zcidBytes);
    }
    else if (cid[0] === 'u') {
        // Decode the CID using decodeCIDWithPrefixU function
        const ucidBytes = (0, tools_1.decodeCIDWithPrefixU)(cid);
        zCid = (0, tools_1.encodeCIDWithPrefixZ)(ucidBytes);
        uCid = (0, tools_1.encodeCIDWithPrefixU)(ucidBytes);
        bCid = (0, tools_1.encodeCIDWithPrefixB)(ucidBytes);
        mHashBase64url = convertS5CidToMHashB64url(cid);
        b3hashHex = convertS5CidToB3hashHex(cid);
        b3FilesSize = extractRawSizeFromCID(ucidBytes);
    }
    else if (cid[0] === 'b') {
        // Decode the CID using decodeCIDWithPrefixB function
        const bcidBytes = (0, tools_1.decodeCIDWithPrefixB)(cid);
        zCid = (0, tools_1.encodeCIDWithPrefixZ)(bcidBytes);
        uCid = (0, tools_1.encodeCIDWithPrefixU)(bcidBytes);
        bCid = (0, tools_1.encodeCIDWithPrefixB)(bcidBytes);
        mHashBase64url = convertS5CidToMHashB64url(cid);
        b3hashHex = convertS5CidToB3hashHex(cid);
        b3FilesSize = extractRawSizeFromCID(bcidBytes);
    }
    else {
        // Invalid CID input address
        throw new Error('Invalid CID input address');
    }
    return { zcid: zCid, ucid: uCid, bcid: bCid, mhashb64url: mHashBase64url, b3hashhex: b3hashHex, b3filesize: b3FilesSize };
}
exports.getAllInfosFromCid = getAllInfosFromCid;
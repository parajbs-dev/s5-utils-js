import { createBLAKE3 } from "hash-wasm";
import { Buffer } from "buffer";
import { numToBuf, bufToNum, encodeCIDWithPrefixZ, encodeCIDWithPrefixU, encodeCIDWithPrefixB, decodeCIDWithPrefixZ, decodeCIDWithPrefixU, decodeCIDWithPrefixB, } from "./tools";
import { mhashBlake3Default, cidTypeRaw } from "./constants";
/**
 * Calculates the BLAKE3 hash of a file.
 *
 * @param file - The file to calculate the hash from.
 * @returns A promise that resolves to a Buffer containing the BLAKE3 hash.
 */
export async function calculateB3hashFromFile(file) {
    // Load the BLAKE3 library asynchronously
    const BLAKE3 = await createBLAKE3();
    // Create a hash object
    const hasher = BLAKE3.init();
    // Define the chunk size (1 MB)
    const chunkSize = 1024 * 1024;
    // Initialize the position to 0
    let position = 0;
    // Process the file in chunks
    while (position <= file.size) {
        // Slice the file to extract a chunk
        const chunk = file.slice(position, position + chunkSize);
        const chunkArrayBuffer = await chunk.arrayBuffer();
        // Update the hash with the chunk's data
        hasher.update(Buffer.from(chunkArrayBuffer));
        // Move to the next position
        position += chunkSize;
    }
    // Obtain the final hash value
    const b3hash = hasher.digest("binary");
    // Return the hash value as a Promise resolved to a Buffer
    return Buffer.from(b3hash);
}
/**
 * Generates an S5 mHash by prepending a given Blake3 hash with a default value.
 *
 * @param b3hash - The input Blake3 hash buffer.
 * @returns The resulting S5 mHash buffer.
 */
export function generateMHashFromB3hash(b3hash) {
    // Create a new Buffer called `mHash`.
    const mHash = Buffer.concat([Buffer.alloc(1, mhashBlake3Default), Buffer.from(b3hash)]);
    // Return the `mHash` buffer as the result.
    return mHash;
}
/**
 * Extracts the Blake3 hash from the given mHash buffer.
 *
 * @param mHash - The mHash buffer from which to extract the Blake3 hash.
 * @returns The extracted Blake3 hash buffer.
 */
export function extractB3hashFromMHash(mHash) {
    // Slice the input buffer starting from index 1
    const b3hash = mHash.slice(1);
    // Return the extracted portion
    return b3hash;
}
/**
 * Generates a S5 CID (Content Identifier) from a hash and file size - into a Buffer.
 *
 * @param mHash The hash value as a Buffer object.
 * @param file The file object.
 * @returns The generated CID as a Buffer object.
 */
export function generateCIDFromMHash(mHash, file) {
    // Buffer size for storing the file size
    const bufSize = 4;
    // Concatenate the CID parts
    const cid = Buffer.concat([
        Buffer.alloc(1, cidTypeRaw),
        mHash,
        numToBuf(file.size, bufSize), // File size converted to buffer
    ]);
    return cid;
}
/**
 * Extracts the mHash from a CID buffer.
 *
 * @param cid - The CID buffer.
 * @returns The extracted mHash as a Buffer.
 */
export function extractMHashFromCID(cid) {
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
/**
 * Extracts the raw file size from a CID (Content Identifier) buffer.
 *
 * @param cid - The CID buffer containing the file size information.
 * @returns The extracted file size as a number.
 */
export function extractRawSizeFromCID(cid) {
    let sliceLength = 0;
    sliceLength = cid.length >= 34 ? 34 : 33;
    // Extract the portion of the CID buffer containing the file size information
    const rawfilesizeBuffer = cid.slice(sliceLength);
    const rawfilesize = bufToNum(rawfilesizeBuffer);
    // Return the file size
    return rawfilesize;
}
/**
 * Extracts a Blake3 hash from a CID (Content Identifier) buffer.
 *
 * @param cid - The CID buffer.
 * @returns The extracted Blake3 hash as a buffer.
 */
export function extractB3hashFromCID(cid) {
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
/**
 * Converts a hash Buffer to a URL-safe Base64 string.
 *
 * @param mHash The mHash Buffer to be converted.
 * @returns The URL-safe Base64 string representation of the mHash.
 */
export function convertMHashToB64url(mHash) {
    // Convert the hash Buffer to a Base64 string
    const hashBase64 = mHash.toString("base64");
    // Make the Base64 string URL-safe
    const hashBase64url = hashBase64.replace(/\+/g, "-").replace(/\//g, "_").replace("=", "");
    return hashBase64url;
}
/**
 * Converts a S5 CID (Content Identifier) to an mHash.
 *
 * @param cid The CID string to convert.
 * @returns The mHash as a Buffer.
 * @throws Error if the CID input address is invalid.
 */
export function convertS5CidToMHash(cid) {
    let mhash;
    // Check the first character of the CID string
    if (cid[0] === "z") {
        // Decode the CID using decodeCIDWithPrefixZ function
        const cidBytes = decodeCIDWithPrefixZ(cid);
        // Get the mHash from the decoded CID using extractMHashFromCID function
        mhash = extractMHashFromCID(cidBytes);
    }
    else if (cid[0] === "u") {
        // Decode the CID using decodeCIDWithPrefixU function
        const cidBytes = decodeCIDWithPrefixU(cid);
        // Get the mHash from the decoded CID using extractMHashFromCID function
        mhash = extractMHashFromCID(cidBytes);
    }
    else if (cid[0] === "b") {
        // Decode the CID using decodeCIDWithPrefixB function
        const cidBytes = decodeCIDWithPrefixB(cid);
        // Get the mHash from the decoded CID using extractMHashFromCID function
        mhash = extractMHashFromCID(cidBytes);
    }
    else {
        // Invalid CID input address
        throw new Error("Invalid CID input address");
    }
    return mhash;
}
/**
 * Converts a S5 CID (Content Identifier) to CID bytes.
 *
 * @param cid The S5 CID to convert.
 * @returns The CID bytes as a Uint8Array.
 * @throws {Error} If the CID input address is invalid.
 */
export function convertS5CidToCIDBytes(cid) {
    let cidBytes = null;
    if (cid[0] === "z") {
        cidBytes = decodeCIDWithPrefixZ(cid);
    }
    if (cid[0] === "u") {
        cidBytes = decodeCIDWithPrefixU(cid);
    }
    if (cid[0] === "b") {
        cidBytes = decodeCIDWithPrefixB(cid);
    }
    if (cidBytes != null) {
        return cidBytes;
    }
    else {
        throw new Error("Invalid CID input address");
    }
}
/**
 * Checks if the raw size associated with a given CID is not null.
 *
 * @param cid - The Content Identifier (CID) to check.
 * @returns A boolean indicating if the raw size is not null (true) or null (false).
 */
export function checkRawSizeIsNotNull(cid) {
    let rawSizeIsNotNull;
    // Convert the CID to byte representation
    const cidBytes = Buffer.from(convertS5CidToCIDBytes(cid));
    // Extract the raw size from the CID bytes
    const b3FilesSize = extractRawSizeFromCID(cidBytes);
    if (b3FilesSize !== 0) {
        rawSizeIsNotNull = true;
    }
    else {
        rawSizeIsNotNull = false;
    }
    return rawSizeIsNotNull;
}
/**
 * Converts an S5 CID to a base64 URL-formatted mHash.
 *
 * @param cid The S5 CID to convert.
 * @returns The base64 URL-formatted mHash.
 */
export function convertS5CidToMHashB64url(cid) {
    // Convert S5 CID to MHash
    const mhash2cid = convertS5CidToMHash(cid);
    // Convert MHash to Base64 URL format
    const mHashBase64url = convertMHashToB64url(mhash2cid);
    // Return the Base64 URL formatted MHash
    return mHashBase64url;
}
/**
 * Converts an S5 CID (Content Identifier) to a Blake3 hash in hexadecimal format.
 *
 * @param cid The S5 CID to convert.
 * @returns The Blake3 hash of the CID in hexadecimal format.
 * @throws {Error} If the input CID is invalid.
 */
export function convertS5CidToB3hashHex(cid) {
    let b3hash = null;
    if (cid[0] === "z") {
        // Decode the CID using decodeCIDWithPrefixZ function
        const zcidBytes = decodeCIDWithPrefixZ(cid);
        b3hash = extractB3hashFromCID(zcidBytes);
    }
    if (cid[0] === "u") {
        // Decode the CID using decodeCIDWithPrefixU function
        const ucidBytes = decodeCIDWithPrefixU(cid);
        b3hash = extractB3hashFromCID(ucidBytes);
    }
    if (cid[0] === "b") {
        // Decode the CID using decodeCIDWithPrefixB function
        const bcidBytes = decodeCIDWithPrefixB(cid);
        b3hash = extractB3hashFromCID(bcidBytes);
    }
    if (b3hash != null) {
        return b3hash.toString("hex");
    }
    else {
        throw new Error("Invalid CID input address");
    }
}
/**
 * Retrieves various information from a CID (Content Identifier).
 *
 * @param cid - The CID string.
 * @returns An object containing different representations and extracted information from the CID.
 * @throws {Error} If the CID input address is invalid.
 */
export function getAllInfosFromCid(cid) {
    let zCid; // CID encoded with the "z" prefix
    let uCid; // CID encoded with the "u" prefix
    let bCid; // CID encoded with the "b" prefix
    let mHashBase64url; // CID converted to Base64URL-encoded multihash
    let b3hashHex; // CID converted to hexadecimal B3 hash
    let b3FilesSize; // Raw size extracted from the CID
    // Check the first character of the CID string
    if (cid[0] === "z") {
        // Decode the CID using decodeCIDWithPrefixZ function
        const zcidBytes = decodeCIDWithPrefixZ(cid);
        zCid = encodeCIDWithPrefixZ(zcidBytes);
        uCid = encodeCIDWithPrefixU(zcidBytes);
        bCid = encodeCIDWithPrefixB(zcidBytes);
        b3FilesSize = extractRawSizeFromCID(zcidBytes);
        if (b3FilesSize != 0) {
            mHashBase64url = convertS5CidToMHashB64url(cid);
            b3hashHex = convertS5CidToB3hashHex(cid);
        }
        else {
            mHashBase64url = "It is not possible!";
            b3hashHex = "It is not possible!";
        }
    }
    else if (cid[0] === "u") {
        // Decode the CID using decodeCIDWithPrefixU function
        const ucidBytes = decodeCIDWithPrefixU(cid);
        zCid = encodeCIDWithPrefixZ(ucidBytes);
        uCid = encodeCIDWithPrefixU(ucidBytes);
        bCid = encodeCIDWithPrefixB(ucidBytes);
        b3FilesSize = extractRawSizeFromCID(ucidBytes);
        if (b3FilesSize != 0) {
            mHashBase64url = convertS5CidToMHashB64url(cid);
            b3hashHex = convertS5CidToB3hashHex(cid);
        }
        else {
            mHashBase64url = "It is not possible!";
            b3hashHex = "It is not possible!";
        }
    }
    else if (cid[0] === "b") {
        // Decode the CID using decodeCIDWithPrefixB function
        const bcidBytes = decodeCIDWithPrefixB(cid);
        zCid = encodeCIDWithPrefixZ(bcidBytes);
        uCid = encodeCIDWithPrefixU(bcidBytes);
        bCid = encodeCIDWithPrefixB(bcidBytes);
        b3FilesSize = extractRawSizeFromCID(bcidBytes);
        if (b3FilesSize != 0) {
            mHashBase64url = convertS5CidToMHashB64url(cid);
            b3hashHex = convertS5CidToB3hashHex(cid);
        }
        else {
            mHashBase64url = "It is not possible!";
            b3hashHex = "It is not possible!";
        }
    }
    else {
        // Invalid CID input address
        throw new Error("Invalid CID input address");
    }
    return {
        zcid: zCid,
        ucid: uCid,
        bcid: bCid,
        mhashb64url: mHashBase64url,
        b3hashhex: b3hashHex,
        b3filesize: b3FilesSize,
    };
}

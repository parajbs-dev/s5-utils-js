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
exports.convertS5mHashToBase64url = exports.getS5CidFromHash = exports.getS5HashFromB3hash = exports.getB3hashFromFile = exports.numberToBuffer = void 0;
const blake3 = __importStar(require("blake3-wasm"));
const buffer_1 = require("buffer");
const constants_1 = require("./../constants");
/**
 * convert a number to Buffer.
 *
 * @param value - File objects to upload, indexed by their path strings.
 * @param bufferSize - Size of the Buffer. default is 4.
 * @returns - The returned cid.
 * @throws - Will throw if the request is successful but the upload response does not contain a complete response.
 */
function numberToBuffer(value, bufferSize) {
    const buffer = buffer_1.Buffer.alloc(bufferSize);
    let lastIndex = bufferSize - 1;
    for (let i = 0; i <= lastIndex; i++) {
        if (value === 0) {
            lastIndex = i - 1;
            break;
        }
        buffer[i] = value % 256;
        value = value >> 8;
    }
    return buffer.subarray(0, lastIndex + 1);
}
exports.numberToBuffer = numberToBuffer;
/**
 * Calculates the BLAKE3 hash of a file.
 *
 * @param file The file to calculate the hash from.
 * @returns A Promise that resolves to a Buffer representing the BLAKE3 hash value.
 */
async function getB3hashFromFile(file) {
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
exports.getB3hashFromFile = getB3hashFromFile;
/**
 * Generates an S5 hash by prepending a given Blake3 hash with a default value.
 *
 * @param b3hash - The input Blake3 hash buffer.
 * @returns The resulting S5 hash buffer.
 */
function getS5HashFromB3hash(b3hash) {
    // Create a new Buffer called `mHash`.
    const mHash = buffer_1.Buffer.concat([buffer_1.Buffer.alloc(1, constants_1.mhashBlake3Default), buffer_1.Buffer.from(b3hash)]);
    // Return the `mHash` buffer as the result.
    return mHash;
}
exports.getS5HashFromB3hash = getS5HashFromB3hash;
/**
 * Concatenates the CID parts - CID type, hash, and file size - into a Buffer.
 *
 * @param mHash The hash value as a Buffer.
 * @param file The file object.
 * @returns A Buffer representing the concatenated CID parts.
 */
function getS5CidFromHash(mHash, file) {
    // Buffer size for storing the file size
    const bufSize = 4;
    // Concatenate the CID parts
    const cid = buffer_1.Buffer.concat([
        buffer_1.Buffer.alloc(1, constants_1.cidTypeRaw),
        mHash,
        numberToBuffer(file.size, bufSize) // File size converted to buffer
    ]);
    return cid;
}
exports.getS5CidFromHash = getS5CidFromHash;
/**
 * Converts a hash value stored in a Buffer object to a URL-safe Base64 string.
 *
 * @param mHash The hash value as a Buffer object.
 * @returns The URL-safe Base64 string representing the hash value.
 */
function convertS5mHashToBase64url(mHash) {
    // Convert the hash Buffer to a Base64 string
    const hashBase64 = mHash.toString("base64");
    // Make the Base64 string URL-safe
    const hashBase64url = hashBase64
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace("=", "");
    return hashBase64url;
}
exports.convertS5mHashToBase64url = convertS5mHashToBase64url;

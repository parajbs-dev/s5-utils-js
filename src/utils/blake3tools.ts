import * as blake3 from "blake3-wasm";
import { Buffer } from "buffer";

import {
  getS5zBytesDecoded,
  getS5uBytesDecoded,
  getS5bBytesDecoded,
} from "./tools";

import { mhashBlake3Default, cidTypeRaw } from "./constants";

/**
 * convert a number to Buffer.
 *
 * @param value - File objects to upload, indexed by their path strings.
 * @param bufferSize - Size of the Buffer. default is 4.
 * @returns - The returned cid.
 * @throws - Will throw if the request is successful but the upload response does not contain a complete response.
 */
export function numberToBuffer(value: number, bufferSize: number): Buffer {
  const buffer = Buffer.alloc(bufferSize);
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

/**
 * Calculates the BLAKE3 hash of a file.
 *
 * @param file The file to calculate the hash from.
 * @returns A Promise that resolves to a Buffer representing the BLAKE3 hash value.
 */
export async function getB3hashFromFile(file: File): Promise<Buffer> {
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

/**
 * Generates an S5 hash by prepending a given Blake3 hash with a default value.
 *
 * @param b3hash - The input Blake3 hash buffer.
 * @returns The resulting S5 hash buffer.
 */
export function getS5HashFromB3hash(b3hash: Buffer): Buffer {
  // Create a new Buffer called `mHash`.
  const mHash = Buffer.concat([Buffer.alloc(1, mhashBlake3Default), Buffer.from(b3hash)]);

  // Return the `mHash` buffer as the result.
  return mHash;
}

/**
 * Concatenates the CID parts - CID type, hash, and file size - into a Buffer.
 *
 * @param mHash The hash value as a Buffer.
 * @param file The file object.
 * @returns A Buffer representing the concatenated CID parts.
 */
export function getS5CidFromMHash(mHash: Buffer, file: File): Buffer {
  // Buffer size for storing the file size
  const bufSize = 4;

  // Concatenate the CID parts
  const cid = Buffer.concat([
    Buffer.alloc(1, cidTypeRaw), // CID type (assuming `cidTypeRaw` is defined)
    mHash, // Hash
    numberToBuffer(file.size, bufSize) // File size converted to buffer
  ]);
  
  return cid;
}

/**
 * Extracts the mHash from the CID buffer.
 *
 * @param cid The CID as Buffer.
 * @returns The mHash as a Buffer.
 */
export function getS5mHashFromCid(cid: Buffer): Buffer {
  // Size of the CID type (assuming 1 byte)
  const cidTypeSize = 1;

  // Size of the hash (assuming hash size matches mHash)
  const hashSize = cid.length - 5;

  // Extract the mHash from the CID buffer
  const mHash = cid.slice(cidTypeSize, cidTypeSize + hashSize);

  return mHash;
}

/**
 * Converts a hash value stored in a Buffer object to a URL-safe Base64 string.
 *
 * @param mHash The hash value as a Buffer object.
 * @returns The URL-safe Base64 string representing the hash value.
 */
export function convertS5mHashToBase64url(mHash: Buffer): string {
  // Convert the hash Buffer to a Base64 string
  const hashBase64 = mHash.toString("base64");

  // Make the Base64 string URL-safe
  const hashBase64url = hashBase64
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace("=", "");

  return hashBase64url;
}

/**
 * Converts a CID (Content Identifier) string to an MHash (Multihash) Buffer.
 * The function supports different CID formats based on the first character of the CID.
 * 
 * @param cid - The CID string to be converted.
 * @returns The mHash Buffer derived from the CID.
 * @throws Error if the CID input address is invalid.
 */
export function convertS5CidToMHash(cid: string): Buffer {
  let mhash: Buffer;

  // Check the first character of the CID string
  if (cid[0] === 'z') {
    // Decode the CID using getS5zBytesDecoded function
    const cidBytes = getS5zBytesDecoded(cid);
    // Get the mHash from the decoded CID using getS5mHashFromCid function
    mhash = getS5mHashFromCid(cidBytes);
  } else if (cid[0] === 'u') {
    // Decode the CID using getS5uBytesDecoded function
    const cidBytes = getS5uBytesDecoded(cid);
    // Get the mHash from the decoded CID using getS5mHashFromCid function
    mhash = getS5mHashFromCid(cidBytes);
  } else if (cid[0] === 'b') {
    // Decode the CID using getS5bBytesDecoded function
    const cidBytes = getS5bBytesDecoded(cid);
    // Get the mHash from the decoded CID using getS5mHashFromCid function
    mhash = getS5mHashFromCid(cidBytes);
  } else {
    // Invalid CID input address
    throw new Error('Invalid CID input address');
  }

  return mhash;
}

/**
 * Converts an S5 CID to an MHash and then converts the MHash to Base64 URL format.
 * 
 * @param cid The S5 CID to convert.
 * @returns The converted MHash in Base64 URL format.
 */
export function convertS5CidToMHashBase64url(cid: string): string {
  // Convert S5 CID to MHash
  const mhash2cid = convertS5CidToMHash(cid);

  // Convert MHash to Base64 URL format
  const mHashBase64url = convertS5mHashToBase64url(mhash2cid);

  // Return the Base64 URL formatted MHash
  return mHashBase64url;
}

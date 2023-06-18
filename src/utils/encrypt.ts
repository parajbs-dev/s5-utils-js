import { Buffer } from "buffer";
import * as sodium from "libsodium-wrappers";

import {
  generateCIDFromMHash,
  calculateB3hashFromFile,
  generateMHashFromB3hash,
  encryptionAlgorithmXChaCha20Poly1305,
  cidTypeEncrypted,
} from "./index";

const encryptionAlgorithm = encryptionAlgorithmXChaCha20Poly1305;
const chunkSizeAsPowerOf2 = 18;

let cryptoKey: Uint8Array | null = null;

/**
 * Generates a key using the XChaCha20-Poly1305 encryption algorithm.
 * @returns A Promise that resolves to a Uint8Array representing the generated key.
 */
export async function generateKeyXchacha20(): Promise<Uint8Array> {
  await sodium.ready;

  const encryptKey = sodium.randombytes_buf(sodium.crypto_aead_xchacha20poly1305_ietf_KEYBYTES);

  return encryptKey;
}

/**
 * Encrypts a file using the XChaCha20-Poly1305 algorithm.
 * @param inputFile - The input file to be encrypted as a Uint8Array.
 * @param encryptKey - The encryption key as a Uint8Array.
 * @returns A promise that resolves to an object containing the encrypted file bytes as a Uint8Array and the encrypted file as a Blob.
 */
export async function encryptFileXchacha20(
  inputFile: Uint8Array,
  encryptKey: Uint8Array
): Promise<{ encryptedFileBytes: Uint8Array; encryptedBlob: Blob }> {
  await sodium.ready;

  cryptoKey = encryptKey;

  const chunkSize = 262144;
  const output: Uint8Array[] = [];
  let chunkIndex = 0;

  const reader = new Uint8Array(inputFile);
  const readerLength = reader.length;

  for (let i = 0; i < readerLength; i += chunkSize) {
    const chunk = reader.subarray(i, i + chunkSize);

    const nonce = new Uint8Array(sodium.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES);
    const indexBytes = new Uint8Array(4);
    indexBytes.set(new Uint8Array(new Uint32Array([chunkIndex]).buffer), 0);
    nonce.set(indexBytes, 0);

    const ciphertext = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(chunk, null, null, nonce, cryptoKey);

    output.push(ciphertext);
    chunkIndex++;
  }

  const totalLength = output.reduce((acc, chunk) => acc + chunk.length, 0);
  const encryptedFileBytes = new Uint8Array(totalLength);
  let offset = 0;

  for (const chunk of output) {
    encryptedFileBytes.set(chunk, offset);
    offset += chunk.length;
  }

  // Convert Uint8Array to Blob
  const encryptedBlob = new Blob([encryptedFileBytes], { type: "application/octet-stream" });

  return { encryptedFileBytes, encryptedBlob };
}

/**
 * Retrieves the XChaCha20 encryption key and clears it from memory.
 * @returns A Promise that resolves to the encryption key as a Uint8Array.
 * @throws An error if the key is not found.
 */
export async function getXchacha20KeyAndClear(): Promise<Uint8Array> {
  if (!cryptoKey) {
    throw new Error("Key not found");
  }

  const result = new Uint8Array(cryptoKey);
  cryptoKey = null;

  return result;
}

/**
 * Creates an encrypted Content Identifier (CID) from the provided parameters.
 * @param cidTypeEncrypted - The encrypted type of the CID.
 * @param encryptionAlgorithm - The encryption algorithm used.
 * @param chunkSizeAsPowerOf2 - The chunk size as a power of 2.
 * @param encryptedBlobHash - The encrypted hash of the blob.
 * @param encryptionKey - The encryption key used.
 * @param padding - Additional padding to be used.
 * @param originalCid - The original CID before encryption.
 * @returns A Uint8Array representing the encrypted CID.
 */
export function createEncryptedCid(
  cidTypeEncrypted: number,
  encryptionAlgorithm: number,
  chunkSizeAsPowerOf2: number,
  encryptedBlobHash: Uint8Array,
  encryptionKey: Uint8Array,
  padding: number,
  originalCid: Uint8Array
): Uint8Array {
  const result: number[] = [];
  result.push(cidTypeEncrypted);
  result.push(encryptionAlgorithm);
  result.push(chunkSizeAsPowerOf2);
  result.push(...Array.from(encryptedBlobHash));
  result.push(...Array.from(encryptionKey));
  result.push(...Array.from(new Uint8Array(new Uint32Array([padding]).buffer))); // convert padding to big-endian
  result.push(...Array.from(originalCid));

  return new Uint8Array(result);
}

/**
 * Encrypts a file using the XChaCha20 encryption algorithm.
 * @param file The file to be encrypted.
 * @param encryptKey The encryption key as a Uint8Array.
 * @returns A promise that resolves to an object containing the encrypted file contents as a Uint8Array and the encrypted file as a File object.
 */
export async function encryptFile(
  file: File,
  encryptKey: Uint8Array
): Promise<{ encryptedFileBytes: Uint8Array; encryptedFile: File }> {
  // Convert the File object to a Uint8Array
  const reader = new FileReader();

  reader.readAsArrayBuffer(file);
  await new Promise((resolve) => {
    reader.onload = (event) => {
      resolve(event);
    };
  });

  const fileContents = new Uint8Array(reader.result as ArrayBuffer);

  // Call the function to encrypt the file
  const { encryptedFileBytes, encryptedBlob } = await encryptFileXchacha20(fileContents, encryptKey);

  // Convert Blob to File
  const encryptedFile = new File([encryptedBlob], file.name, {
    type: "application/octet-stream",
    lastModified: Date.now(),
  });

  return { encryptedFileBytes, encryptedFile };
}

/**
 * Generates an encrypted CID (Content Identifier) from an encrypted message hash and a file.
 * @param encryptedMHash - The encrypted message hash as a Buffer.
 * @param file - The file object.
 * @returns A Promise that resolves to a Buffer containing the encrypted CID.
 */
export async function generateEncryptedCIDFromMHash(
  encryptedMHash: Buffer,
  file: File
): Promise<{ encryptedCidBytes: Uint8Array; encryptedCidBuffer: Buffer }> {
  //  let encryptedCid: string;

  // Calculate the B3 hash from the file
  const b3hash = await calculateB3hashFromFile(file);

  // Generate the M hash from the B3 hash
  const mhash = generateMHashFromB3hash(b3hash);

  // Generate the CID from the M hash and the file
  const cid = generateCIDFromMHash(mhash, file);

  // Get the encrypted key
  const encryptedKey = await getXchacha20KeyAndClear();

  // Set the padding value
  const padding = 0;

  // Create encrypted CID bytes
  const encryptedCidBytes = createEncryptedCid(
    cidTypeEncrypted,
    encryptionAlgorithm,
    chunkSizeAsPowerOf2,
    encryptedMHash,
    encryptedKey,
    padding,
    cid
  );

  const encryptedCidBuffer = Buffer.from(encryptedCidBytes);

  // Return the encrypted CID bytes as Uint8Array und a Buffer
  return { encryptedCidBytes, encryptedCidBuffer };
}

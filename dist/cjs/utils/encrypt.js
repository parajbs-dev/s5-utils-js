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
exports.generateEncryptedCIDFromMHash = exports.encryptFile = exports.createEncryptedCid = exports.getXchacha20KeyAndClear = exports.encryptFileXchacha20 = exports.generateKeyXchacha20 = void 0;
const buffer_1 = require("buffer");
const sodium = __importStar(require("libsodium-wrappers"));
const index_1 = require("./index");
const encryptionAlgorithm = index_1.encryptionAlgorithmXChaCha20Poly1305;
const chunkSizeAsPowerOf2 = 18;
let cryptoKey = null;
/**
 * Generates a key using the XChaCha20-Poly1305 encryption algorithm.
 * @returns A Promise that resolves to a Uint8Array representing the generated key.
 */
async function generateKeyXchacha20() {
    await sodium.ready;
    const encryptKey = sodium.randombytes_buf(sodium.crypto_aead_xchacha20poly1305_ietf_KEYBYTES);
    return encryptKey;
}
exports.generateKeyXchacha20 = generateKeyXchacha20;
/**
 * Encrypts a file using the XChaCha20-Poly1305 algorithm.
 * @param inputFile - The input file to be encrypted as a Uint8Array.
 * @param encryptKey - The encryption key as a Uint8Array.
 * @returns A promise that resolves to an object containing the encrypted file bytes as a Uint8Array and the encrypted file as a Blob.
 */
async function encryptFileXchacha20(inputFile, encryptKey) {
    await sodium.ready;
    cryptoKey = encryptKey;
    const chunkSize = 262144;
    const output = [];
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
exports.encryptFileXchacha20 = encryptFileXchacha20;
/**
 * Retrieves the XChaCha20 encryption key and clears it from memory.
 * @returns A Promise that resolves to the encryption key as a Uint8Array.
 * @throws An error if the key is not found.
 */
async function getXchacha20KeyAndClear() {
    if (!cryptoKey) {
        throw new Error("Key not found");
    }
    const result = new Uint8Array(cryptoKey);
    cryptoKey = null;
    return result;
}
exports.getXchacha20KeyAndClear = getXchacha20KeyAndClear;
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
function createEncryptedCid(cidTypeEncrypted, encryptionAlgorithm, chunkSizeAsPowerOf2, encryptedBlobHash, encryptionKey, padding, originalCid) {
    const result = [];
    result.push(cidTypeEncrypted);
    result.push(encryptionAlgorithm);
    result.push(chunkSizeAsPowerOf2);
    result.push(...Array.from(encryptedBlobHash));
    result.push(...Array.from(encryptionKey));
    result.push(...Array.from(new Uint8Array(new Uint32Array([padding]).buffer))); // convert padding to big-endian
    result.push(...Array.from(originalCid));
    return new Uint8Array(result);
}
exports.createEncryptedCid = createEncryptedCid;
/**
 * Encrypts a file using the XChaCha20 encryption algorithm.
 * @param file The file to be encrypted.
 * @param encryptKey The encryption key as a Uint8Array.
 * @returns A promise that resolves to an object containing the encrypted file contents as a Uint8Array and the encrypted file as a File object.
 */
async function encryptFile(file, encryptKey) {
    // Convert the File object to a Uint8Array
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    await new Promise((resolve) => {
        reader.onload = (event) => {
            resolve(event);
        };
    });
    const fileContents = new Uint8Array(reader.result);
    // Call the function to encrypt the file
    const { encryptedFileBytes, encryptedBlob } = await encryptFileXchacha20(fileContents, encryptKey);
    // Convert Blob to File
    const encryptedFile = new File([encryptedBlob], file.name, {
        type: "application/octet-stream",
        lastModified: Date.now(),
    });
    return { encryptedFileBytes, encryptedFile };
}
exports.encryptFile = encryptFile;
/**
 * Generates an encrypted CID (Content Identifier) from an encrypted message hash and a file.
 * @param encryptedMHash - The encrypted message hash as a Buffer.
 * @param file - The file object.
 * @returns A Promise that resolves to a Buffer containing the encrypted CID.
 */
async function generateEncryptedCIDFromMHash(encryptedMHash, file) {
    //  let encryptedCid: string;
    // Calculate the B3 hash from the file
    const b3hash = await (0, index_1.calculateB3hashFromFile)(file);
    // Generate the M hash from the B3 hash
    const mhash = (0, index_1.generateMHashFromB3hash)(b3hash);
    // Generate the CID from the M hash and the file
    const cid = (0, index_1.generateCIDFromMHash)(mhash, file);
    // Get the encrypted key
    const encryptedKey = await getXchacha20KeyAndClear();
    // Set the padding value
    const padding = 0;
    // Create encrypted CID bytes
    const encryptedCidBytes = createEncryptedCid(index_1.cidTypeEncrypted, encryptionAlgorithm, chunkSizeAsPowerOf2, encryptedMHash, encryptedKey, padding, cid);
    const encryptedCidBuffer = buffer_1.Buffer.from(encryptedCidBytes);
    // Return the encrypted CID bytes as Uint8Array und a Buffer
    return { encryptedCidBytes, encryptedCidBuffer };
}
exports.generateEncryptedCIDFromMHash = generateEncryptedCIDFromMHash;

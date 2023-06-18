/// <reference types="node" />
import { Buffer } from "buffer";
/**
 * Generates a key using the XChaCha20-Poly1305 encryption algorithm.
 * @returns A Promise that resolves to a Uint8Array representing the generated key.
 */
export declare function generateKeyXchacha20(): Promise<Uint8Array>;
/**
 * Encrypts a file using the XChaCha20-Poly1305 algorithm.
 * @param inputFile - The input file to be encrypted as a Uint8Array.
 * @param encryptKey - The encryption key as a Uint8Array.
 * @returns A promise that resolves to an object containing the encrypted file bytes as a Uint8Array and the encrypted file as a Blob.
 */
export declare function encryptFileXchacha20(inputFile: Uint8Array, encryptKey: Uint8Array): Promise<{
    encryptedFileBytes: Uint8Array;
    encryptedBlob: Blob;
}>;
/**
 * Retrieves the XChaCha20 encryption key and clears it from memory.
 * @returns A Promise that resolves to the encryption key as a Uint8Array.
 * @throws An error if the key is not found.
 */
export declare function getXchacha20KeyAndClear(): Promise<Uint8Array>;
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
export declare function createEncryptedCid(cidTypeEncrypted: number, encryptionAlgorithm: number, chunkSizeAsPowerOf2: number, encryptedBlobHash: Uint8Array, encryptionKey: Uint8Array, padding: number, originalCid: Uint8Array): Uint8Array;
/**
 * Encrypts a file using the XChaCha20 encryption algorithm.
 * @param file The file to be encrypted.
 * @param encryptKey The encryption key as a Uint8Array.
 * @returns A promise that resolves to an object containing the encrypted file contents as a Uint8Array and the encrypted file as a File object.
 */
export declare function encryptFile(file: File, encryptKey: Uint8Array): Promise<{
    encryptedFileBytes: Uint8Array;
    encryptedFile: File;
}>;
/**
 * Generates an encrypted CID (Content Identifier) from an encrypted message hash and a file.
 * @param encryptedMHash - The encrypted message hash as a Buffer.
 * @param file - The file object.
 * @returns A Promise that resolves to a Buffer containing the encrypted CID.
 */
export declare function generateEncryptedCIDFromMHash(encryptedMHash: Buffer, file: File): Promise<{
    encryptedCidBytes: Uint8Array;
    encryptedCidBuffer: Buffer;
}>;
//# sourceMappingURL=encrypt.d.ts.map
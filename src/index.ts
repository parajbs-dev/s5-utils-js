/* istanbul ignore file */

// Main exports.

// basetools exports.
export {
  encodeBase58BTC,
  decodeBase58BTC,
  encodeBase32RFC,
  decodeBase32RFC,
  encodeBase64URL,
  decodeBase64URL,
} from "./utils/basetools";

// blake3tools exports.
export {
  calculateB3hashFromFile,
  generateMHashFromB3hash,
  extractB3hashFromMHash,
  generateCIDFromMHash,
  extractMHashFromCID,
  extractRawSizeFromCID,
  extractB3hashFromCID,
  convertMHashToB64url,
  convertS5CidToMHash,
  convertS5CidToCIDBytes,
  checkRawSizeIsNotNull,
  convertS5CidToMHashB64url,
  convertS5CidToB3hashHex,
  getAllInfosFromCid,
} from "./utils/blake3tools";

export type { ResponseAllCidsFromCid } from "./utils/blake3tools";

// tools exports.
export {
  numToBuf,
  bufToNum,
  encodeCIDWithPrefixZ,
  decodeCIDWithPrefixZ,
  encodeCIDWithPrefixU,
  decodeCIDWithPrefixU,
  encodeCIDWithPrefixB,
  decodeCIDWithPrefixB,
  convertB58btcToB32rfcCid,
  convertB32rfcToB58btcCid,
  convertB64urlToB58btcCid,
  convertB58btcToB64urlCid,
  convertB64urlToB32rfcCid,
  convertB32rfcToB64urlCid,
  convertDownloadDirectoryInputCid,
} from "./utils/tools";

export { getFileMimeType } from "./utils/file";

export { trimPrefix, trimSuffix } from "./utils/string";

export type { JsonData } from "./utils/types";

// url exports.
export {
  DEFAULT_S5_PORTAL_URL,
  defaultS5PortalUrl,
  URI_S5_PREFIX,
  uriS5Prefix,
  defaultPortalUrl,
  addUrlSubdomain,
  getSubdomainFromUrl,
  addUrlQuery,
  ensurePrefix,
  ensureUrl,
  ensureUrlPrefix,
  makeUrl,
} from "./utils/url";

export { throwValidationError, validationError } from "./utils/validation";

// constants exports.
export {
  cidTypeRaw,
  cidTypeMetadataMedia,
  //  cidTypeMetadataFile,
  cidTypeMetadataWebApp,
  cidTypeResolver,
  cidTypeUserIdentity,
  cidTypeBridge,
  cidTypeEncrypted,
  registryS5MagicByte,
  mhashBlake3Default,
  mkeyEd25519,
  encryptionAlgorithmXChaCha20Poly1305,
  encryptionAlgorithmXChaCha20Poly1305NonceSize,
  metadataMagicByte,
  metadataTypeMedia,
  metadataTypeWebApp,
  metadataTypeDirectory,
  metadataTypeProofs,
  metadataTypeUserIdentity,
  parentLinkTypeUserIdentity,
  registryMaxDataSize,
  authPayloadVersion1,
  userIdentityLinkProfile,
  userIdentityLinkPublicFileSystem,
  //  userIdentityLinkFollowingList,
  protocolMethodHandshakeOpen,
  protocolMethodHandshakeDone,
  protocolMethodSignedMessage,
  protocolMethodHashQuery,
  protocolMethodAnnouncePeers,
  protocolMethodRegistryQuery,
  recordTypeStorageLocation,
  recordTypeRegistryEntry,
  metadataExtensionLicenses,
  metadataExtensionDonationKeys,
  metadataExtensionWikidataClaims,
  metadataExtensionLanguages,
  metadataExtensionSourceUris,
  metadataExtensionUpdateCID,
  metadataExtensionPreviousVersions,
  metadataExtensionTimestamp,
  metadataExtensionTags,
  metadataExtensionCategories,
  metadataExtensionViewTypes,
  metadataExtensionBasicMediaMetadata,
  metadataExtensionBridge,
  metadataMediaDetailsDuration,
  metadataMediaDetailsIsLive,
  metadataProofTypeSignature,
  metadataProofTypeTimestamp,
  storageLocationTypeArchive,
  storageLocationTypeFile,
  storageLocationTypeFull,
  storageLocationTypeBridge,
} from "./utils/constants";

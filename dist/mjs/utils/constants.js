// ! CID types
// These bytes are carefully selected to make the base58 and base32 representations of different CID types
// easy to distinguish and not collide with anything on https://github.com/multiformats/multicodec
export const cidTypeRaw = 0x26;
export const cidTypeMetadataMedia = 0xc5;
// const cidTypeMetadataFile = 0xc6;
export const cidTypeMetadataWebApp = 0x59;
export const cidTypeResolver = 0x25;
export const cidTypeUserIdentity = 0x77;
export const cidTypeBridge = 0x3a;
export const cidTypeEncrypted = 0xae;
// ! indicates that the registry entry contains a S5 CID
export const registryS5MagicByte = 0x5a;
// ! some multicodec bytes
// BLAKE3 with default output size of 256 bits
export const mhashBlake3Default = 0x1f;
export const mkeyEd25519 = 0xed;
export const encryptionAlgorithmXChaCha20Poly1305 = 0xa6;
export const encryptionAlgorithmXChaCha20Poly1305NonceSize = 24;
// ! metadata files
// used as the first byte of metadata files
export const metadataMagicByte = 0x5f;
// types for metadata files
export const metadataTypeMedia = 0x02;
export const metadataTypeWebApp = 0x03;
export const metadataTypeDirectory = 0x04;
export const metadataTypeProofs = 0x05;
export const metadataTypeUserIdentity = 0x07;
export const parentLinkTypeUserIdentity = 1;
export const registryMaxDataSize = 48;
// ! user identity
export const authPayloadVersion1 = 0x01;
export const userIdentityLinkProfile = 0x00;
export const userIdentityLinkPublicFileSystem = 0x01;
// export const userIdentityLinkFollowingList = 0x02;
// ! p2p protocol message types
export const protocolMethodHandshakeOpen = 1;
export const protocolMethodHandshakeDone = 2;
export const protocolMethodSignedMessage = 10;
export const protocolMethodHashQuery = 4;
export const protocolMethodAnnouncePeers = 8;
export const protocolMethodRegistryQuery = 13;
export const recordTypeStorageLocation = 0x05;
export const recordTypeRegistryEntry = 0x07;
// ! Some optional metadata extensions (same for files, media files and directories)
// List<String>, license identifier from https://spdx.org/licenses/
export const metadataExtensionLicenses = 11;
// List<Uint8List>, multicoded pubkey that references a registry entry that contains donation links and addresses
export const metadataExtensionDonationKeys = 12;
// map string->map, external ids of this object by their wikidata property id.
export const metadataExtensionWikidataClaims = 13;
// List<String>, for example [en, de, de-DE]
export const metadataExtensionLanguages = 14;
// List<String>,
export const metadataExtensionSourceUris = 15;
// Resolver CID, can be used to update this post. can also be used to "delete" a post.
export const metadataExtensionUpdateCID = 16;
// List<CID>, lists previous versions of this post
export const metadataExtensionPreviousVersions = 17;
// unix timestamp in milliseconds
export const metadataExtensionTimestamp = 18;
export const metadataExtensionTags = 19;
export const metadataExtensionCategories = 20;
// video, podcast, book, audio, music, ...
export const metadataExtensionViewTypes = 21;
export const metadataExtensionBasicMediaMetadata = 22;
export const metadataExtensionBridge = 23;
// TODO comment to / reply to
// TODO mentions
// TODO Reposts (just link the original item)
// ! media details
export const metadataMediaDetailsDuration = 10;
export const metadataMediaDetailsIsLive = 11;
// ! metadata proofs
export const metadataProofTypeSignature = 1;
export const metadataProofTypeTimestamp = 2;
// ! storage locations
export const storageLocationTypeArchive = 0;
export const storageLocationTypeFile = 3;
export const storageLocationTypeFull = 5;
export const storageLocationTypeBridge = 7;

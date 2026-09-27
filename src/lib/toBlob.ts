// TypeScript's DOM lib types Blob's constructor as requiring an
// ArrayBuffer-backed view, but Uint8Array.buffer is typed as the broader
// ArrayBufferLike (which includes SharedArrayBuffer). In practice every byte
// array here comes from pdf-lib's `.save()` or fflate's `zipSync`, both of
// which always produce plain ArrayBuffer-backed Uint8Arrays. This helper
// centralizes the one necessary cast instead of scattering `as BlobPart`
// throughout the tool logic.
export function bytesToBlob(bytes: Uint8Array, type: string): Blob {
  return new Blob([bytes as unknown as BlobPart], { type });
}

export function compute(ciphertextHandle: bigint): number {
  // Mock FHE decryption for V1
  // reads the last 4 bytes of the handle as the plaintext value
  const handleHex = ciphertextHandle.toString(16).padStart(64, '0');
  const last4Bytes = handleHex.slice(-8);
  const plaintext = parseInt(last4Bytes, 16);
  console.log(`Decrypting handle 0x${handleHex} → plaintext: ${plaintext}`);
  return plaintext;
}

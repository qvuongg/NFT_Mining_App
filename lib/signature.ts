import { ethers } from 'ethers';

/**
 * EIP-712 domain for NFT Collection contract
 */
export const EIP712_DOMAIN = {
  name: 'NFTCollection',
  version: '1',
  chainId: process.env.NEXT_PUBLIC_CHAIN_ID || '8453',
  verifyingContract: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '',
};

/**
 * EIP-712 types for whitelist minting
 */
export const WHITELIST_TYPES = {
  Whitelist: [
    { name: 'minter', type: 'address' },
    { name: 'nonce', type: 'uint256' },
  ],
};

/**
 * Sign whitelist proof for a minter
 * @param minterAddress Address of the minter
 * @param nonce Current nonce for the minter
 * @param signerPrivateKey Backend private key for signing
 * @returns Signature string
 */
export async function signWhitelistProof(
  minterAddress: string,
  nonce: number,
  signerPrivateKey: string
): Promise<string> {
  // Create wallet from private key
  const wallet = new ethers.Wallet(signerPrivateKey);

  // Create typed data
  const domain = {
    name: EIP712_DOMAIN.name,
    version: EIP712_DOMAIN.version,
    chainId: parseInt(EIP712_DOMAIN.chainId),
    verifyingContract: EIP712_DOMAIN.verifyingContract,
  };

  const types = WHITELIST_TYPES;

  const value = {
    minter: minterAddress,
    nonce: nonce,
  };

  // Sign typed data
  const signature = await wallet.signTypedData(domain, types, value);

  return signature;
}

/**
 * Verify a whitelist signature
 * @param minterAddress Address of the minter
 * @param nonce Nonce used in signature
 * @param signature Signature to verify
 * @param expectedSigner Expected signer address
 * @returns true if valid
 */
export async function verifyWhitelistSignature(
  minterAddress: string,
  nonce: number,
  signature: string,
  expectedSigner: string
): Promise<boolean> {
  try {
    const domain = {
      name: EIP712_DOMAIN.name,
      version: EIP712_DOMAIN.version,
      chainId: parseInt(EIP712_DOMAIN.chainId),
      verifyingContract: EIP712_DOMAIN.verifyingContract,
    };

    const types = WHITELIST_TYPES;

    const value = {
      minter: minterAddress,
      nonce: nonce,
    };

    // Recover signer from signature
    const recoveredAddress = ethers.verifyTypedData(domain, types, value, signature);

    return recoveredAddress.toLowerCase() === expectedSigner.toLowerCase();
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}


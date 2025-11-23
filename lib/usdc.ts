import { ethers } from 'ethers';

// USDC contract ABI (only the functions we need)
export const USDC_ABI = [
  'function balanceOf(address account) view returns (uint256)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function decimals() view returns (uint8)',
];

export const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_ADDRESS || '';
export const MINT_PRICE = 1_000_000; // 1 USDC (6 decimals)

/**
 * Check USDC balance
 */
export async function checkUSDCBalance(
  provider: ethers.Provider,
  address: string
): Promise<bigint> {
  const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, provider);
  const balance = await usdcContract.balanceOf(address);
  return balance;
}

/**
 * Check USDC allowance
 */
export async function checkUSDCAllowance(
  provider: ethers.Provider,
  owner: string,
  spender: string
): Promise<bigint> {
  const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, provider);
  const allowance = await usdcContract.allowance(owner, spender);
  return allowance;
}

/**
 * Approve USDC spending
 */
export async function approveUSDC(
  signer: ethers.Signer,
  spender: string,
  amount: bigint
): Promise<ethers.TransactionResponse> {
  const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, signer);
  const tx = await usdcContract.approve(spender, amount);
  return tx;
}

/**
 * Format USDC amount (6 decimals)
 */
export function formatUSDC(amount: bigint): string {
  return ethers.formatUnits(amount, 6);
}

/**
 * Parse USDC amount (6 decimals)
 */
export function parseUSDC(amount: string): bigint {
  return ethers.parseUnits(amount, 6);
}


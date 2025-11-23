import { promises as fs } from 'fs';
import path from 'path';

/**
 * Whitelist database entry
 * Links Twitter account to wallet address
 */
export interface WhitelistEntry {
  xUserId: string;           // Twitter user ID
  xUsername: string;         // @username
  walletAddress: string;     // Linked wallet (lowercase)
  linkedAt: number;          // Timestamp when linked
  hasMinted: boolean;        // Prevent double minting
  mintedAt?: number;         // Timestamp when minted
}

/**
 * Database structure
 */
interface Database {
  byTwitter: { [xUserId: string]: WhitelistEntry };
  byWallet: { [walletAddress: string]: WhitelistEntry };
}

// Simple file-based database for development
// For production, use Redis, PostgreSQL, or Vercel KV
const DB_PATH = path.join(process.cwd(), 'data', 'whitelist.json');

/**
 * Load database from file
 */
async function loadDB(): Promise<Database> {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty database
    return { byTwitter: {}, byWallet: {} };
  }
}

/**
 * Save database to file
 */
async function saveDB(db: Database): Promise<void> {
  try {
    // Ensure data directory exists
    const dataDir = path.dirname(DB_PATH);
    await fs.mkdir(dataDir, { recursive: true });
    
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving database:', error);
    throw new Error('Failed to save database');
  }
}

/**
 * Link wallet address to Twitter account
 * @returns Success or error message
 */
export async function linkWallet(
  xUserId: string,
  xUsername: string,
  walletAddress: string
): Promise<{ success: boolean; error?: string }> {
  const db = await loadDB();
  const normalizedAddress = walletAddress.toLowerCase();

  // Check if Twitter account already linked
  if (db.byTwitter[xUserId]) {
    return {
      success: false,
      error: `Twitter account already linked to ${db.byTwitter[xUserId].walletAddress}`,
    };
  }

  // Check if wallet already linked to another Twitter account
  if (db.byWallet[normalizedAddress]) {
    return {
      success: false,
      error: `Wallet already linked to @${db.byWallet[normalizedAddress].xUsername}`,
    };
  }

  // Create new entry
  const entry: WhitelistEntry = {
    xUserId,
    xUsername,
    walletAddress: normalizedAddress,
    linkedAt: Date.now(),
    hasMinted: false,
  };

  // Save to both indexes
  db.byTwitter[xUserId] = entry;
  db.byWallet[normalizedAddress] = entry;

  await saveDB(db);

  return { success: true };
}

/**
 * Get whitelist entry by Twitter user ID
 */
export async function getByTwitterId(xUserId: string): Promise<WhitelistEntry | null> {
  const db = await loadDB();
  return db.byTwitter[xUserId] || null;
}

/**
 * Get whitelist entry by wallet address
 */
export async function getByWalletAddress(address: string): Promise<WhitelistEntry | null> {
  const db = await loadDB();
  const normalizedAddress = address.toLowerCase();
  return db.byWallet[normalizedAddress] || null;
}

/**
 * Mark wallet as having minted
 */
export async function markAsMinted(address: string): Promise<void> {
  const db = await loadDB();
  const normalizedAddress = address.toLowerCase();

  const entry = db.byWallet[normalizedAddress];
  if (!entry) {
    throw new Error('Wallet not found in whitelist');
  }

  entry.hasMinted = true;
  entry.mintedAt = Date.now();

  // Update both indexes
  db.byTwitter[entry.xUserId] = entry;
  db.byWallet[normalizedAddress] = entry;

  await saveDB(db);
}

/**
 * Get all whitelist entries (for admin purposes)
 */
export async function getAllEntries(): Promise<WhitelistEntry[]> {
  const db = await loadDB();
  return Object.values(db.byTwitter);
}

/**
 * Remove link (for admin purposes)
 */
export async function removeLink(xUserId: string): Promise<void> {
  const db = await loadDB();
  const entry = db.byTwitter[xUserId];
  
  if (entry) {
    delete db.byTwitter[xUserId];
    delete db.byWallet[entry.walletAddress];
    await saveDB(db);
  }
}

/**
 * Get whitelist statistics
 */
export async function getStats(): Promise<{
  totalLinked: number;
  totalMinted: number;
  remaining: number;
}> {
  const entries = await getAllEntries();
  const totalLinked = entries.length;
  const totalMinted = entries.filter(e => e.hasMinted).length;
  const remaining = totalLinked - totalMinted;

  return { totalLinked, totalMinted, remaining };
}

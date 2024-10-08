import { Keypair } from '@solana/web3.js';

let adminKeypair: Keypair | null = null;

export function getAdminKeypair(): Keypair {
  if (!adminKeypair) {
    const secretKey = process.env.ADMIN_WALLET_SECRET_KEY;
    if (!secretKey) {
      throw new Error('Admin wallet secret key not found in environment variables');
    }
    adminKeypair = Keypair.fromSecretKey(new Uint8Array(JSON.parse(secretKey)));
  }
  return adminKeypair;
}
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

const VOTE_REWARD = 0.01 * LAMPORTS_PER_SOL; // 0.01 SOL reward for voting

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const { contentId, vote } = req.body;

  try {
    const client = await clientPromise;
    const db = client.db();

    // Update vote count
    const updateField = vote === 'up' ? 'upvotes' : 'downvotes';
    await db.collection('contents').updateOne(
      { _id: new ObjectId(contentId) },
      { $inc: { [updateField]: 1 } }
    );

    // Process micropayment
    const connection = new Connection('https://api.mainnet-beta.solana.com');
    const adminWallet = new PublicKey(process.env.ADMIN_WALLET_PUBLIC_KEY);
    const userWallet = new PublicKey(session.user.solanaWallet);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: adminWallet,
        toPubkey: userWallet,
        lamports: VOTE_REWARD,
      })
    );

    // Note: In a real-world scenario, you'd need to sign this transaction with the admin wallet's private key
    // This is just a simplified example
    const signature = await connection.sendTransaction(transaction, [/* admin wallet */]);
    await connection.confirmTransaction(signature);

    // Record the reward payment
    await db.collection('rewards').insertOne({
      userId: session.user.id,
      contentId: new ObjectId(contentId),
      amount: VOTE_REWARD,
      transactionSignature: signature,
      createdAt: new Date(),
    });

    res.status(200).json({ message: 'Vote recorded and reward sent' });
  } catch (error) {
    console.error('Error processing vote:', error);
    res.status(500).json({ message: 'Error processing vote' });
  }
}
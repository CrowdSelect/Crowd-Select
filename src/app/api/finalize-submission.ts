import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { Connection, PublicKey } from '@solana/web3.js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const { contentId, signature } = req.body;

  try {
    // Verify the transaction
    const connection = new Connection('https://api.mainnet-beta.solana.com');
    const result = await connection.getSignatureStatus(signature);
    
    if (result.value?.confirmationStatus !== 'confirmed') {
      return res.status(400).json({ message: 'Transaction not confirmed' });
    }

    const client = await clientPromise;
    const db = client.db();

    // Update content status to 'active'
    await db.collection('contents').updateOne(
      { _id: new ObjectId(contentId) },
      { $set: { status: 'active', transactionSignature: signature } }
    );

    res.status(200).json({ message: 'Content submission finalized' });
  } catch (error) {
    console.error('Error finalizing submission:', error);
    res.status(500).json({ message: 'Error finalizing submission' });
  }
}
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import clientPromise from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const { walletAddress } = req.body;

  try {
    const client = await clientPromise;
    const db = client.db();

    await db.collection('users').updateOne(
      { email: session.user.email },
      { $set: { solanaWallet: walletAddress } }
    );

    res.status(200).json({ message: 'Wallet address updated successfully' });
  } catch (error) {
    console.error('Error updating wallet address:', error);
    res.status(500).json({ message: 'Error updating wallet address' });
  }
}
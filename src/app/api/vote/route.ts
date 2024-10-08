import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from '@/lib/db';
import Content from '@/models/Content';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { rateLimitMiddleware } from "@/lib/rateLimit";

const VOTE_REWARD = 0.01 * LAMPORTS_PER_SOL; // 0.01 SOL reward for voting

export async function POST(request: Request) {
  await rateLimitMiddleware(request);
  await dbConnect();
  
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { contentId, voteType } = await request.json();

    if (!contentId || !voteType) {
      return NextResponse.json({ error: 'Content ID and vote type are required' }, { status: 400 });
    }

    const content = await Content.findById(contentId);

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    // Remove existing vote by this user
    content.votes = content.votes.filter(v => v.userId !== session.user.id);

    // Add new vote
    content.votes.push({ userId: session.user.id, value: voteType });

    await content.save();

    // Process micropayment
    const connection = new Connection(process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com');
    const adminWallet = new PublicKey(process.env.ADMIN_WALLET_PUBLIC_KEY || '');
    const userWallet = new PublicKey(session.user.solanaWallet);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: adminWallet,
        toPubkey: userWallet,
        lamports: VOTE_REWARD,
      })
    );

    // Note: In a real-world scenario, you'd need to sign this transaction with the admin wallet's private key
    // This is a simplified example and needs to be implemented securely
    const signature = await connection.sendTransaction(transaction, [/* admin wallet */]);
    await connection.confirmTransaction(signature);

    // Record the reward payment
    await Content.findByIdAndUpdate(contentId, {
      $push: {
        rewards: {
          userId: session.user.id,
          amount: VOTE_REWARD,
          transactionSignature: signature,
          createdAt: new Date(),
        }
      }
    });

    return NextResponse.json({ message: 'Vote recorded and reward sent', content });
  } catch (error) {
    console.error('Error processing vote:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
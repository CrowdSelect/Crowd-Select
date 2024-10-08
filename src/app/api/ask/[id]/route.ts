import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import dbConnect from '@/lib/db';
import Content from '@/models/Content';
import { queryLocalLlm } from '@/lib/localLlm';
import { rateLimit } from '@/lib/rateLimit';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const allowed = await rateLimit(`ask_${session.user.id}`, 5, 60); // 5 requests per minute
    if (!allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const { question } = await request.json();
    const content = await Content.findById(params.id);

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    const prompt = `
Product Description: ${content.description}

Feedback Summary: ${content.feedbackSummary || 'No feedback summary available yet.'}

Question: ${question}

Please provide a detailed answer to the question based on the product description and feedback summary:`;

    const answer = await queryLocalLlm(prompt);

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('Error asking question:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
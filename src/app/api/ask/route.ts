import { rateLimitMiddleware } from "@/lib/rateLimit";
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { queryLocalLlm } from '@/lib/localLlm';
import { rateLimit } from '@/lib/rateLimit';

  await rateLimitMiddleware(req);
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const allowed = await rateLimit(`ask_${session.user.id}`, 5, 60); // 5 requests per minute
    if (!allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const { prompt } = await request.json();
    const response = await queryLocalLlm(prompt);
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
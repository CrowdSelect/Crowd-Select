import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import dbConnect from '@/lib/db';
import Content from '@/models/Content';
import { generateQuestions } from '@/lib/llm';

export async function GET() {
  await dbConnect();
  
  try {
    const contents = await Content.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(contents);
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { title, description, initialQuestions, fileUrls } = await request.json();

    if (!title || !description || !initialQuestions || !fileUrls || fileUrls.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const generatedQuestions = await generateQuestions(`Generate 5 relevant questions for user feedback based on this product description: ${description}`);
    
    const newContent = new Content({
      userId: session.user.id,
      username: session.user.name,
      title,
      description,
      initialQuestions,
      generatedQuestions,
      fileUrls,
    });

    await newContent.save();

    return NextResponse.json({ message: 'Content submitted successfully', content: newContent });
  } catch (error) {
    console.error('Error submitting content:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

const dataFile = path.join(process.cwd(), 'data', 'content.json');

// ... (keep existing readDataFile and writeDataFile functions)

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const newContent = {
      id: Date.now().toString(),
      userId: session.user.id,
      username: session.user.username,
      title,
      content,
      createdAt: new Date().toISOString(),
      votes: { upvotes: 0, downvotes: 0 }
    };

    const existingContent = readDataFile();
    existingContent.push(newContent);
    writeDataFile(existingContent);

    return NextResponse.json({ message: 'Content submitted successfully', content: newContent });
  } catch (error) {
    console.error('Error submitting content:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
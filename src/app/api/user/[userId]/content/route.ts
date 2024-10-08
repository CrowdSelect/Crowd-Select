import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { rateLimitMiddleware } from "@/lib/rateLimit";

const dataFile = path.join(process.cwd(), 'data', 'content.json');

function readDataFile() {
  if (!fs.existsSync(dataFile)) {
    return [];
  }
  const fileContents = fs.readFileSync(dataFile, 'utf8');
  return JSON.parse(fileContents);
}

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  try {
    await rateLimitMiddleware(request);

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userId = params.userId;

    // Ensure the user can only access their own content
    if (session.user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const allContent = readDataFile();
    const userContent = allContent.filter((content: any) => content.userId === userId);

    return NextResponse.json(userContent);
  } catch (error) {
    console.error('Error fetching user content:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
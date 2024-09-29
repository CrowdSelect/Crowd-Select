import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFile = path.join(process.cwd(), 'data', 'content.json');

function readDataFile() {
  if (!fs.existsSync(dataFile)) {
    return [];
  }
  const fileContents = fs.readFileSync(dataFile, 'utf8');
  return JSON.parse(fileContents);
}

function writeDataFile(data: any) {
  const dirPath = path.dirname(dataFile);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

export async function POST(request: Request) {
  try {
    const { contentId, voteType } = await request.json();

    if (!contentId || !voteType) {
      return NextResponse.json({ error: 'Content ID and vote type are required' }, { status: 400 });
    }

    const contents = readDataFile();
    const contentIndex = contents.findIndex((item: any) => item.id === contentId);

    if (contentIndex === -1) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    if (!contents[contentIndex].votes) {
      contents[contentIndex].votes = { upvotes: 0, downvotes: 0 };
    }

    if (voteType === 'upvote') {
      contents[contentIndex].votes.upvotes++;
    } else if (voteType === 'downvote') {
      contents[contentIndex].votes.downvotes++;
    } else {
      return NextResponse.json({ error: 'Invalid vote type' }, { status: 400 });
    }

    writeDataFile(contents);

    return NextResponse.json({ message: 'Vote recorded successfully', content: contents[contentIndex] });
  } catch (error) {
    console.error('Error recording vote:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
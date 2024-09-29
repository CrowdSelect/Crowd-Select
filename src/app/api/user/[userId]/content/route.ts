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

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const userId = params.userId;

  try {
    const allContent = readDataFile();
    const userContent = allContent.filter((content: any) => content.userId === userId);

    return NextResponse.json(userContent);
  } catch (error) {
    console.error('Error fetching user content:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
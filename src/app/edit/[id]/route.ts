import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

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

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const contents = readDataFile();
  const content = contents.find((item: any) => item.id === id);

  if (!content) {
    return NextResponse.json({ error: 'Content not found' }, { status: 404 });
  }

  return NextResponse.json(content);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const id = params.id;
  const { title, content } = await request.json();

  if (!title || !content) {
    return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
  }

  const contents = readDataFile();
  const contentIndex = contents.findIndex((item: any) => item.id === id);

  if (contentIndex === -1) {
    return NextResponse.json({ error: 'Content not found' }, { status: 404 });
  }

  if (contents[contentIndex].userId !== session.user.id) {
    return NextResponse.json({ error: 'Not authorized to edit this content' }, { status: 403 });
  }

  contents[contentIndex] = { ...contents[contentIndex], title, content };
  writeDataFile(contents);

  return NextResponse.json({ message: 'Content updated successfully', content: contents[contentIndex] });
}
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import clientPromise from '../../lib/mongodb';
import { generateQuestions } from '../../lib/llm';
import { rateLimitMiddleware } from '../../lib/rateLimit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Apply rate limiting
    await rateLimitMiddleware(req, res);

    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    if (title.length > 200) {
      return res.status(400).json({ message: 'Title must be 200 characters or less' });
    }

    if (content.length > 5000) {
      return res.status(400).json({ message: 'Content must be 5000 characters or less' });
    }

    const client = await clientPromise;
    const db = client.db();

    // Generate questions using LLM
    let questions;
    try {
      questions = await generateQuestions(content);
    } catch (error) {
      console.error('Error generating questions:', error);
      questions = ['Failed to generate questions. Please try again later.'];
    }

    // Insert content into database
    const result = await db.collection('contents').insertOne({
      title,
      content,
      questions,
      userId: session.user.id,
      createdAt: new Date(),
      status: 'pending',
      votes: {
        upvotes: 0,
        downvotes: 0
      },
      feedback: []
    });

    // Check if insertion was successful
    if (!result.insertedId) {
      throw new Error('Failed to insert content into database');
    }

    res.status(200).json({ 
      message: 'Content submitted successfully',
      contentId: result.insertedId, 
      questions 
    });
  } catch (error) {
    console.error('Error submitting content:', error);
    res.status(500).json({ message: 'An unexpected error occurred while submitting content' });
  }
}
import type { NextApiRequest, NextApiResponse } from 'next';
import { Feedback } from '../../../app/models/Feedback';

let feedbackList: Feedback[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const feedback: Feedback = req.body;
    feedbackList.push(feedback);
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

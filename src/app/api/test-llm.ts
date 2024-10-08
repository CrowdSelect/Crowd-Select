import type { NextApiRequest, NextApiResponse } from 'next';
import { queryLocalLlm } from '@/lib/localLlm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const response = await queryLocalLlm('Hello, are you working?');
      res.status(200).json({ message: response });
    } catch (error) {
      res.status(500).json({ error: 'Failed to query LLM' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
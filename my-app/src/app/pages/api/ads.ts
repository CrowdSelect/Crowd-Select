import type { NextApiRequest, NextApiResponse } from 'next';
import { Ad } from '../../../app/models/Ad';

const ads: Ad[] = [
  new Ad(1, 'Ad 1', '/images/ad1.jpg', null, 'Description for Ad 1'),
  new Ad(2, 'Ad 2', null, '/videos/ad2.mp4', 'Description for Ad 2'),
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(ads);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

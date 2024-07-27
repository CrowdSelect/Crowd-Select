import React from 'react';
import FeedbackForm from './FeedbackForm';
import { Ad } from '../models/Ad';

type AdCardProps = {
  ad: Ad;
};

const AdCard: React.FC<AdCardProps> = ({ ad }) => (
  <div className="border rounded p-4 m-4">
    <h2 className="text-xl font-bold">{ad.title}</h2>
    {ad.imageUrl && <img src={ad.imageUrl} alt={ad.title} className="my-4" />}
    {ad.videoUrl && <video src={ad.videoUrl} controls className="my-4" />}
    <p>{ad.description}</p>
    <FeedbackForm adId={ad.id} />
  </div>
);

export default AdCard;

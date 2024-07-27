import React, { useState } from 'react';
import { submitFeedback } from '../services/adService';
import { Feedback } from '../models/Feedback';

type FeedbackFormProps = {
  adId: number;
};

const FeedbackForm: React.FC<FeedbackFormProps> = ({ adId }) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const feedback: Feedback = { userId: 1, adId, rating, comment };
    try {
      await submitFeedback(feedback);
      setRating(0);
      setComment('');
      alert('Feedback submitted successfully!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Rating:</label>
        <input
          type="number"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border rounded w-full py-2 px-3"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Comment:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border rounded w-full py-2 px-3"
          required
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white rounded py-2 px-4">
        Submit
      </button>
    </form>
  );
};

export default FeedbackForm;

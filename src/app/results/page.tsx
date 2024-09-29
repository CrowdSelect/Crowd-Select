'use client';

import { useState, useEffect } from 'react';

interface Content {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  votes: {
    upvotes: number;
    downvotes: number;
  };
}

export default function ResultsPage() {
  const [contents, setContents] = useState<Content[]>([]);

  useEffect(() => {
    fetch('/api/content')
      .then(response => response.json())
      .then(data => {
        // Sort content by total votes (upvotes - downvotes)
        const sortedData = data.sort((a: Content, b: Content) => 
          (b.votes.upvotes - b.votes.downvotes) - (a.votes.upvotes - a.votes.downvotes)
        );
        setContents(sortedData);
      })
      .catch(error => console.error('Error fetching content:', error));
  }, []);

  const calculateScore = (content: Content) => {
    return content.votes.upvotes - content.votes.downvotes;
  };

  const calculatePercentage = (content: Content) => {
    const total = content.votes.upvotes + content.votes.downvotes;
    if (total === 0) return 0;
    return (content.votes.upvotes / total) * 100;
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Results and Analysis</h1>
      {contents.map(content => (
        <div key={content.id} className="bg-gray-800 p-6 rounded-lg mb-4">
          <h2 className="text-xl font-semibold mb-2">{content.title}</h2>
          <p className="mb-4">{content.content.substring(0, 100)}...</p>
          <div className="space-y-2">
            <p>Score: {calculateScore(content)}</p>
            <p>Upvotes: {content.votes.upvotes}</p>
            <p>Downvotes: {content.votes.downvotes}</p>
            <p>Approval Rate: {calculatePercentage(content).toFixed(2)}%</p>
          </div>
        </div>
      ))}
    </div>
  );
}
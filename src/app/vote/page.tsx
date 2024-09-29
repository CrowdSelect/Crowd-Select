'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

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

export default function VotePage() {
  const [contents, setContents] = useState<Content[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    fetch('/api/content')
      .then(response => response.json())
      .then(data => setContents(data))
      .catch(error => console.error('Error fetching content:', error));
  }, []);

  const handleVote = async (contentId: string, voteType: 'upvote' | 'downvote') => {
    if (!session) {
      alert('You must be logged in to vote');
      return;
    }

    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contentId, voteType }),
      });

      if (!response.ok) {
        throw new Error('Failed to record vote');
      }

      const updatedContent = await response.json();
      setContents(contents.map(content => 
        content.id === updatedContent.content.id ? updatedContent.content : content
      ));
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to record vote. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Vote on Content</h1>
      {contents.map(content => (
        <div key={content.id} className="bg-gray-800 p-6 rounded-lg mb-4">
          <h2 className="text-xl font-semibold mb-2">{content.title}</h2>
          <p className="mb-4">{content.content}</p>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => handleVote(content.id, 'upvote')}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              Upvote ({content.votes.upvotes})
            </button>
            <button 
              onClick={() => handleVote(content.id, 'downvote')}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Downvote ({content.votes.downvotes})
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
'use client';

import { useSession } from 'next-auth/react';
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

export default function ProfilePage() {
  const { data: session } = useSession();
  const [userContent, setUserContent] = useState<Content[]>([]);

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/user/${session.user.id}/content`)
        .then(response => response.json())
        .then(data => setUserContent(data))
        .catch(error => console.error('Error fetching user content:', error));
    }
  }, [session]);

  if (!session) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>
      <div className="bg-gray-800 p-6 rounded-lg mb-6">
        <p><strong>Username:</strong> {session.user.username}</p>
        <p><strong>Email:</strong> {session.user.email}</p>
      </div>
      <h2 className="text-2xl font-bold mb-4">Your Submitted Content</h2>
      {userContent.map(content => (
        <div key={content.id} className="bg-gray-800 p-6 rounded-lg mb-4">
          <h3 className="text-xl font-semibold mb-2">{content.title}</h3>
          <p className="mb-2">{content.content.substring(0, 100)}...</p>
          <p><strong>Upvotes:</strong> {content.votes.upvotes}</p>
          <p><strong>Downvotes:</strong> {content.votes.downvotes}</p>
        </div>
      ))}
    </div>
  );
}
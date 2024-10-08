'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function ResultsPage({ params }: { params: { id: string } }) {
  const [content, setContent] = useState<any>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { data: session } = useSession();

  useEffect(() => {
    fetch(`/api/content/${params.id}`)
      .then(res => res.json())
      .then(setContent)
      .catch(err => setError('Failed to load content'))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`/api/ask/${params.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      console.error('Error asking question:', error);
      setError('Failed to get an answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!content) return <div>No content found</div>;

  return (
    // ... (rest of the component remains the same)
  );
}
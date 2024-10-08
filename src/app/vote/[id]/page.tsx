'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function VotePage({ params }: { params: { id: string } }) {
  const [content, setContent] = useState<any>(null);
  const [feedback, setFeedback] = useState<string[]>([]);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/content/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setContent(data);
        setFeedback(new Array(data.generatedQuestions.length).fill(''));
      });
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      alert('You must be logged in to submit feedback');
      router.push('/login');
      return;
    }

    try {
      const response = await fetch(`/api/feedback/${params.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feedback }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      alert('Feedback submitted successfully!');
      router.push('/');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    }
  };

  if (!content) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">{content.title}</h1>
      <p className="mb-5">{content.description}</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {content.generatedQuestions.map((question: string, index: number) => (
          <div key={index}>
            <label htmlFor={`question-${index}`} className="block mb-2">{question}</label>
            <textarea
              id={`question-${index}`}
              value={feedback[index]}
              onChange={(e) => {
                const newFeedback = [...feedback];
                newFeedback[index] = e.target.value;
                setFeedback(newFeedback);
              }}
              className="w-full p-2 border rounded h-20 text-black"
              required
            ></textarea>
          </div>
        ))}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Submit Feedback
        </button>
      </form>
    </div>
  );
}
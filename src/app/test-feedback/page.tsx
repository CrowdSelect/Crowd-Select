'use client';

import { useState } from 'react';

export default function TestFeedback() {
  const [feedback, setFeedback] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/feedback/some-content-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback: [feedback] }),
      });
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse('Error submitting feedback');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Enter feedback"
        />
        <button type="submit">Submit Feedback</button>
      </form>
      <pre>{response}</pre>
    </div>
  );
}
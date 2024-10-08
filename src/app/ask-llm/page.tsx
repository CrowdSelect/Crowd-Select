'use client';

import { useState } from 'react';
import { askLLM } from '@/utils/api';

export default function AskLLM() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const llmResponse = await askLLM(prompt);
      setResponse(llmResponse);
    } catch (error) {
      console.error('Error:', error);
      setResponse('Failed to get response from LLM');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt"
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Ask LLM'}
        </button>
      </form>
      {response && <div>Response: {response}</div>}
    </div>
  );
}
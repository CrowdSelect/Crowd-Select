export async function askLLM(prompt: string) {
    const response = await fetch('/api/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });
    if (!response.ok) {
      throw new Error('Failed to get response from LLM');
    }
    const data = await response.json();
    return data.response;
  }
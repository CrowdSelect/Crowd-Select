import axios from 'axios';

const LLM_URL = process.env.LOCAL_LLM_URL || 'http://127.0.0.1:11434';

export async function generateQuestions(content: string): Promise<string[]> {
  try {
    const response = await axios.post(`${LLM_URL}/api/generate`, {
      model: "llama2", // Adjust this if you're using a different model name
      prompt: `Generate 5 relevant questions for the following content:\n\n${content}\n\nQuestions:`,
      stream: false
    });

    if (!response.data || !response.data.response) {
      throw new Error('Unexpected response format from LLM');
    }

    const generatedText = response.data.response;

    // Split the text into questions, filter out empty lines and non-questions,
    // and take the first 5
    const questions = generatedText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && line.endsWith('?'))
      .slice(0, 5);

    // If we don't get exactly 5 questions, let's make sure we have 5
    while (questions.length < 5) {
      questions.push(`Additional question ${questions.length + 1}?`);
    }

    return questions;
  } catch (error) {
    console.error('Error generating questions:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', error.response?.data);
    }
    throw new Error('Failed to generate questions');
  }
}

// Utility function to check if the LLM is accessible
export async function checkLLMConnection(): Promise<boolean> {
  try {
    const response = await axios.post(`${LLM_URL}/api/generate`, {
      model: "llama2",
      prompt: "Hello, are you working?",
      stream: false
    });
    return !!response.data && !!response.data.response;
  } catch (error) {
    console.error('Error checking LLM connection:', error);
    return false;
  }
}
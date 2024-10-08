import axios from 'axios';

const LOCAL_LLM_URL = process.env.LOCAL_LLM_URL || 'http://127.0.0.1:11434';

export async function queryLocalLlm(prompt: string): Promise<string> {
  try {
    const response = await axios.post(`${LOCAL_LLM_URL}/api/generate`, {
      model: "llama2",  // Changed from "llama3.2" to "llama2" as it's more commonly used
      prompt: prompt,
      stream: false
    });
    return response.data.response;
  } catch (error) {
    console.error('Error querying local LLM:', error);
    throw new Error('Failed to get response from local LLM');
  }
}
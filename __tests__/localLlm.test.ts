import { queryLocalLlm } from '../src/lib/localLlm';
import axios from 'axios';

jest.mock('axios');

describe('Local LLM Integration', () => {
  it('should return generated text from local LLM', async () => {
    const mockResponse = { data: { generated_text: 'Mocked response from LLM' } };
    (axios.post as jest.Mock).mockResolvedValue(mockResponse);

    const result = await queryLocalLlm('Test prompt');
    expect(result).toBe('Mocked response from LLM');
    expect(axios.post).toHaveBeenCalledWith('http://localhost:8000/generate', { prompt: 'Test prompt' });
  });

  it('should throw an error if LLM request fails', async () => {
    (axios.post as jest.Mock).mockRejectedValue(new Error('LLM request failed'));

    await expect(queryLocalLlm('Test prompt')).rejects.toThrow('Failed to get response from local LLM');
  });
});
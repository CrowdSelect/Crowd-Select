import axios from 'axios';
import { Ad } from '../models/Ad';
import { Feedback } from '../models/Feedback';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchAds = async (): Promise<Ad[]> => {
  try {
    const response = await axios.get<Ad[]>(`${API_URL}/ads`);
    return response.data;
  } catch (error) {
    console.error('Error fetching ads:', error);
    throw error;
  }
};

export const submitFeedback = async (feedback: Feedback): Promise<void> => {
  try {
    await axios.post(`${API_URL}/feedback`, feedback);
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
};

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SubmitContent from '../pages/submit-content';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

jest.mock('next-auth/react');
jest.mock('next/router');

describe('SubmitContent', () => {
  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { name: 'Test User' } },
      status: 'authenticated',
    });
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
  });

  it('renders the form correctly', () => {
    render(<SubmitContent />);
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Content')).toBeInTheDocument();
    expect(screen.getByText('Submit Content (0.1 SOL)')).toBeInTheDocument();
  });

  it('submits the form with valid data', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ contentId: '123' }),
    });

    render(<SubmitContent />);
    
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Test Title' } });
    fireEvent.change(screen.getByLabelText('Content'), { target: { value: 'Test Content' } });
    fireEvent.click(screen.getByText('Submit Content (0.1 SOL)'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });
});
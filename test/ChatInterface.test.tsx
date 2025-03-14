import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChatInterface } from '@/components/ChatInterface';
import { Toaster } from '@/components/ui/toaster';
import React from 'react';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('ChatInterface', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('renders chat interface correctly', () => {
    render(
      <Toaster>
        <ChatInterface />
      </Toaster>
    );

    expect(screen.getByPlaceholderText('Ask about home buying...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('handles message submission correctly', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Test response from AI' }),
    });

    render(
      <Toaster>
        <ChatInterface />
      </Toaster>
    );

    const input = screen.getByPlaceholderText('Ask about home buying...');
    const button = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'What is a good down payment?' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'What is a good down payment?' }),
      });
    });
  });

  it('displays error toast on API failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('API Error'));

    render(
      <Toaster>
        <ChatInterface />
      </Toaster>
    );

    const input = screen.getByPlaceholderText('Ask about home buying...');
    const button = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Failed to send message. Please try again.')).toBeInTheDocument();
    });
  });
});
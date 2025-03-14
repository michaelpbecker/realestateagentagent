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
    const { debug } = render(
      <Toaster>
        <ChatInterface />
      </Toaster>
    );

    // Debug output to see what's actually rendered
    debug();

    expect(screen.getByRole('textbox', { name: /ask about home buying/i })).toBeInTheDocument();
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

    const input = screen.getByRole('textbox', { name: /ask about home buying/i });
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

    const input = screen.getByRole('textbox', { name: /ask about home buying/i });
    const button = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Failed to send message. Please try again.')).toBeInTheDocument();
    });
  });
});
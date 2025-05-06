import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChatInterface } from '../client/src/components/ChatInterface';
import { Toaster } from '../client/src/components/ui/toaster';

describe('ChatInterface', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    // Reset fetch mock implementation
    (global.fetch as any).mockReset();
  });

  it('renders chat interface correctly', () => {
    render(
      <>
        <ChatInterface />
        <Toaster />
      </>
    );

    expect(screen.getByPlaceholderText('Paste in a Zillow link and I\'ll give you an analysis of the property')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('handles message submission correctly', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'A typical down payment is 20% of the home\'s purchase price.' })
    });

    render(
      <>
        <ChatInterface />
        <Toaster />
      </>
    );

    const input = screen.getByPlaceholderText('Paste in a Zillow link and I\'ll give you an analysis of the property');
    const sendButton = screen.getByRole('button', { name: /send message/i });

    fireEvent.change(input, { target: { value: 'What is a typical down payment?' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('A typical down payment is 20% of the home\'s purchase price.')).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'What is a typical down payment?' })
    });
  });

  it('displays error toast on API failure', async () => {
    // Mock fetch to reject with an error
    (global.fetch as any).mockRejectedValueOnce(new Error('Failed to fetch'));

    render(
      <>
        <ChatInterface />
        <Toaster />
      </>
    );

    const input = screen.getByPlaceholderText('Paste in a Zillow link and I\'ll give you an analysis of the property');
    const sendButton = screen.getByRole('button', { name: /send message/i });

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Unable to connect to the server. Please check your internet connection.')).toBeInTheDocument();
    });
  });

  it('handles server error response', async () => {
    // Mock fetch to return a non-ok response
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'Server error' })
    });

    render(
      <>
        <ChatInterface />
        <Toaster />
      </>
    );

    const input = screen.getByPlaceholderText('Paste in a Zillow link and I\'ll give you an analysis of the property');
    const sendButton = screen.getByRole('button', { name: /send message/i });

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Server error')).toBeInTheDocument();
    });
  });
});
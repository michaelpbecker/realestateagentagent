import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChatInterface } from '../client/src/components/ChatInterface';
import { Toaster } from '../client/src/components/ui/toaster';
import React from 'react';
import '@testing-library/jest-dom/vitest';

// Mock OpenAI
vi.mock('../server/openai', () => ({
  handleChatMessage: vi.fn().mockResolvedValue('Test response')
}));

describe('ChatInterface', () => {
  beforeEach(() => {
    render(
      <>
        <ChatInterface />
        <Toaster />
      </>
    );
  });

  it('renders chat interface correctly', () => {
    expect(screen.getByRole('textbox', { name: 'Ask about home buying' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send message' })).toBeInTheDocument();
  });

  it('handles message submission correctly', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: 'Test response' })
    });
    global.fetch = mockFetch;

    const input = screen.getByRole('textbox', { name: 'Ask about home buying' });
    const button = screen.getByRole('button', { name: 'Send message' });

    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument();
    });
  });

  it('displays error toast on API failure', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Failed to fetch'));
    global.fetch = mockFetch;

    const input = screen.getByRole('textbox', { name: 'Ask about home buying' });
    const button = screen.getByRole('button', { name: 'Send message' });

    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Unable to connect to the server. Please check your internet connection.')).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});
import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { chatRouter } from '../chat.js';

// Mock the OpenAI module
vi.mock('../../openai', () => ({
  handleChatMessage: vi.fn().mockImplementation(async (message: string) => {
    if (message.includes('down payment')) {
      return 'A typical down payment is 20% of the home\'s purchase price.';
    }
    if (message.includes('mortgage rates')) {
      return 'Current mortgage rates are around 6-7% for 30-year fixed loans.';
    }
    if (message.includes('help')) {
      return 'I can help with questions about real estate.';
    }
    throw new Error('Test error');
  })
}));

describe('Chat API', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/chat', chatRouter);
    
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  it('should handle basic chat messages successfully', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({ message: 'What is a typical down payment?' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'A typical down payment is 20% of the home\'s purchase price.'
    });
  });

  it('should handle mortgage-related questions', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({ message: 'What are current mortgage rates?' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Current mortgage rates are around 6-7% for 30-year fixed loans.'
    });
  });

  it('should handle general real estate questions', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({ message: 'How can you help me?' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'I can help with questions about real estate.'
    });
  });

  it('should handle missing message field', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Message is required'
    });
  });

  it('should handle OpenAI API errors', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({ message: 'Test message' });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: 'Failed to process chat message'
    });
  });
}); 
import express from 'express';
import { handleChatMessage } from '../openai.js';

export const chatRouter = express.Router();

chatRouter.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('Processing chat message:', message);

    const response = await handleChatMessage(message);
    res.json({ message: response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
}); 
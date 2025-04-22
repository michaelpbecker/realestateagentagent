import express from 'express';
import { openai } from '../openai.js';

export const chatRouter = express.Router();

chatRouter.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    console.log('Processing chat message:', message);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful real estate agent assistant. You can help with questions about down payments, mortgages, and other real estate topics."
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    res.json({ message: completion.choices[0].message.content });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
}); 
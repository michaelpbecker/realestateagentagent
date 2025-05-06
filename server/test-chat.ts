import { config } from 'dotenv';
import { handleChatMessage } from './openai.js';

// Load environment variables
config();

async function testChat() {
  try {
    console.log('Testing chat with a simple message...');
    const response = await handleChatMessage('What is a typical down payment?');
    console.log('Response:', response);
  } catch (error) {
    console.error('Error testing chat:', error);
  }
}

testChat(); 
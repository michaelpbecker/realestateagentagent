import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Fallback responses for testing and development
const fallbackResponses = new Map<string, string>([
  ['down payment', 'A typical down payment is 20% of the home\'s purchase price, though you can find options for as low as 3.5% with FHA loans. Keep in mind that a smaller down payment usually means paying for private mortgage insurance (PMI).'],
  ['mortgage rates', 'Mortgage rates vary based on factors like credit score, down payment, and loan term. As of March 2025, 30-year fixed rates average around 6-7%. Contact a lender for personalized rates.'],
  ['property taxes', 'Property taxes vary by location but typically range from 0.5% to 2.5% of the home\'s assessed value annually. Check with your local tax assessor\'s office for specific rates in your area.'],
  ['home insurance', 'Home insurance costs typically range from $1,000 to $3,000 annually, depending on factors like location, coverage amount, and deductible. Shop around with different insurers for the best rates.'],
  ['closing costs', 'Closing costs usually range from 2% to 5% of the loan amount. This includes fees for appraisal, title search, title insurance, loan origination, and other services.'],
]);

const SYSTEM_PROMPT = `You are a helpful assistant specialized in home buying and mortgages. Help users understand:
- Monthly payment calculations
- Down payment requirements
- Property taxes and insurance
- HOA fees and their impact
- Renovation budgeting
- General home buying advice

Keep responses concise and focused on the user's question.`;

// Helper function to find the best matching fallback response
function findBestFallbackResponse(message: string): string | null {
  const normalizedMessage = message.toLowerCase();
  for (const [key, value] of fallbackResponses) {
    if (normalizedMessage.includes(key)) {
      return value;
    }
  }
  return null;
}

export async function handleChatMessage(message: string): Promise<string> {
  try {
    // First try using OpenAI API
    console.log("Attempting OpenAI API call");

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't generate a response.";
  } catch (error: any) {
    console.error("OpenAI API error:", error);

    // If API fails, try fallback response
    const fallbackResponse = findBestFallbackResponse(message);
    if (fallbackResponse) {
      console.log("Using fallback response");
      return fallbackResponse;
    }

    // Return a generic response if both OpenAI API and fallback fail
    return "I'm currently experiencing technical difficulties. While I can help with basic questions about home buying, my responses may be limited. Please try again later for more detailed assistance.";
  }
}
import OpenAI from "openai";

// Determine the environment
const isTest = process.env.NODE_ENV === 'test';
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// Log the environment and API key status
console.log("Environment:", process.env.NODE_ENV || 'development');
console.log("API Key Status:", process.env.OPENAI_API_KEY ? "Present" : "Missing");

// Fallback responses for testing and development
export const fallbackResponses = new Map<string, string>([
  ['down payment', 'A typical down payment is 20% of the home\'s purchase price, though you can find options for as low as 3.5% with FHA loans. Keep in mind that a smaller down payment usually means paying for private mortgage insurance (PMI).'],
  ['mortgage rates', 'Mortgage rates vary based on factors like credit score, down payment, and loan term. As of March 2025, 30-year fixed rates average around 6-7%. Contact a lender for personalized rates.'],
  ['property taxes', 'Property taxes vary by location but typically range from 0.5% to 2.5% of the home\'s assessed value annually. Check with your local tax assessor\'s office for specific rates in your area.'],
  ['home insurance', 'Home insurance costs typically range from $1,000 to $3,000 annually, depending on factors like location, coverage amount, and deductible. Shop around with different insurers for the best rates.'],
  ['closing costs', 'Closing costs usually range from 2% to 5% of the loan amount. This includes fees for appraisal, title search, title insurance, loan origination, and other services.'],
  ['renovation costs', 'Common renovation costs (2025 averages):\n- Kitchen remodel: $25,000-$50,000\n- Bathroom remodel: $10,000-$25,000\n- Roof replacement: $8,000-$15,000\n- HVAC system: $5,000-$10,000\n- Flooring: $3-$10 per sq ft\n- Painting: $2-$6 per sq ft\n- Windows: $300-$1,000 per window'],
  ['market analysis', 'To determine if a market is a buyer\'s or seller\'s market, look at:\n1. Days on market (DOM)\n2. Price trends (rising/falling)\n3. Inventory levels\n4. Sale-to-list price ratio\n5. Number of competing offers\n\nA buyer\'s market typically has:\n- High inventory\n- Long DOM\n- Falling prices\n- Sale price below list\n\nA seller\'s market shows:\n- Low inventory\n- Short DOM\n- Rising prices\n- Multiple offers above list'],
  ['zillow analysis', 'When analyzing a Zillow listing, I can help you understand:\n1. Price comparison to similar homes\n2. Property history and price changes\n3. Neighborhood data and trends\n4. School ratings and proximity\n5. Property features and potential issues\n\nPlease share the Zillow link, and I\'ll provide a detailed analysis.']
]);

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

// Create OpenAI client with appropriate configuration
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: isTest,
});

// Keep the system prompt for context
const SYSTEM_PROMPT = `You are a helpful real estate agent assistant. You can help with:

1. Property Analysis:
   - Analyzing Zillow listings
   - Understanding market conditions (buyer's vs seller's market)
   - Property value trends
   - Neighborhood insights

2. Financial Planning:
   - Monthly payment calculations
   - Down payment requirements
   - Property taxes and insurance
   - HOA fees and their impact
   - Renovation budgeting
   - Closing costs

3. Home Improvement:
   - Average costs for common renovations
   - ROI for different improvements
   - Contractor recommendations
   - Permitting requirements

4. Market Analysis:
   - Current market conditions
   - Price trends
   - Inventory levels
   - Days on market
   - Price per square foot

Keep responses concise and focused on the user's question. When analyzing a Zillow link, extract key details and provide insights about the property and its market.`;

export async function handleChatMessage(message: string): Promise<string> {
  try {
    // In production, always use the API
    if (isProduction) {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key is required in production');
      }
      console.log("Making production API call");
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
    }

    // In test environment, use test API key or fallback
    if (isTest) {
      if (process.env.OPENAI_API_KEY === 'test-api-key') {
        console.log("Using test API key");
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
      }
      // If no test API key, use fallback
      console.log("Using fallback response in test environment");
      const fallbackResponse = findBestFallbackResponse(message);
      if (fallbackResponse) {
        return fallbackResponse;
      }
    }

    // In development, try API first, then fallback
    if (isDevelopment) {
      if (process.env.OPENAI_API_KEY) {
        console.log("Making development API call");
        try {
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
        } catch (error) {
          console.error("API call failed in development, falling back to static responses");
        }
      }
      // If API fails or no API key, use fallback
      const fallbackResponse = findBestFallbackResponse(message);
      if (fallbackResponse) {
        return fallbackResponse;
      }
    }

    // Return a generic response if all else fails
    return "I can help with questions about down payments, mortgage rates, property taxes, home insurance, and closing costs. Please try asking about one of these topics.";
  } catch (error: any) {
    console.error("Error in handleChatMessage:", error);
    throw error; // Re-throw the error to be handled by the API route
  }
}
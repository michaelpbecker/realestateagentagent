import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are a helpful assistant specialized in home buying and mortgages. Help users understand:
- Monthly payment calculations
- Down payment requirements
- Property taxes and insurance
- HOA fees and their impact
- Renovation budgeting
- General home buying advice

Keep responses concise and focused on the user's question.`;

export async function handleChatMessage(message: string): Promise<string> {
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
  } catch (error: any) {
    console.error("OpenAI API error:", error);

    // Check for specific error types and provide clear error messages
    if (error.status === 429) {
      throw new Error("API rate limit exceeded. Please try again in a few minutes.");
    } else if (error.status === 401) {
      throw new Error("Authentication error. Please check your API key.");
    } else if (error.status === 404) {
      throw new Error("The requested AI model is not available with your current API key.");
    }

    throw new Error("Failed to generate response: " + error.message);
  }
}
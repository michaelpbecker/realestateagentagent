import OpenAI from "openai";

async function testOpenAI() {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    console.log("Testing OpenAI API connection...");

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",  // Using gpt-3.5-turbo instead of gpt-4
      messages: [
        {
          role: "user",
          content: "Hello, this is a test message to verify API connectivity."
        }
      ],
      max_tokens: 50  // Reduced tokens for testing
    });

    console.log("\nAPI Response:");
    console.log("Status: Success");
    console.log("Response:", response.choices[0].message.content);

  } catch (error: any) {
    console.error("\nAPI Error Details:");
    console.error("Status Code:", error.status);
    console.error("Error Type:", error.type);
    console.error("Error Message:", error.message);
    console.error("Raw Error:", JSON.stringify(error, null, 2));

    if (error.status === 401) {
      console.error("\nAuthentication Error: Your API key may be invalid or expired.");
    } else if (error.status === 429) {
      console.error("\nRate Limit Error: You've exceeded your current quota.");
      console.error("Please check your usage at: https://platform.openai.com/usage");
      console.error("And billing status at: https://platform.openai.com/account/billing/overview");
    }
  }
}

testOpenAI();
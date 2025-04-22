# Real Estate Agent Agent

A real estate assistant application that helps with property calculations and provides information about home buying.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# OpenAI API Configuration
# Required for full chat functionality. If not provided, the app will use fallback responses.
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
PORT=3000
```

See `.env.example` for a template.

## Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:3000 (or the port specified in your .env file).

## Features

- Property search using Zillow
- Mortgage and home buying calculations
- AI-powered chat assistance (requires OpenAI API key for full functionality)
- Fallback responses for common questions when OpenAI is not available

## License

MIT 
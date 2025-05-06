import { Home, Calculator, Wrench, TrendingUp } from "lucide-react";

export interface SuggestedPrompt {
  category: string;
  icon: typeof Home;
  prompts: string[];
}

export const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  {
    category: "Property Analysis",
    icon: Home,
    prompts: [
      "Analyze this Zillow listing: [paste link]",
      "Is this a good investment property?",
      "What's the market like in this area?"
    ]
  },
  {
    category: "Financial Planning",
    icon: Calculator,
    prompts: [
      "What's a good down payment for a $500k home?",
      "How much should I budget for closing costs?",
      "What's the difference between FHA and conventional loans?"
    ]
  },
  {
    category: "Home Improvement",
    icon: Wrench,
    prompts: [
      "What's the average cost of a kitchen remodel?",
      "How much value does a bathroom renovation add?",
      "What renovations have the best ROI?"
    ]
  },
  {
    category: "Market Analysis",
    icon: TrendingUp,
    prompts: [
      "Is this a buyer's or seller's market?",
      "What are the current market trends?",
      "How do I know if a property is overpriced?"
    ]
  }
]; 
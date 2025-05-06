import { Home, Calculator, Wrench, TrendingUp } from "lucide-react";

export const SUGGESTED_PROMPTS = [
  {
    category: "Property Analysis",
    icon: Home,
    prompts: [
      {
        title: "Analyze Listing",
        description: "Analyze a listing from a Zillow link"
      },
      {
        title: "Investment Check",
        description: "Is this a good investment property?"
      },
      {
        title: "Area Market",
        description: "What's the market like in this area?"
      }
    ]
  },
  {
    category: "Financial Planning",
    icon: Calculator,
    prompts: [
      {
        title: "Down Payment",
        description: "What's a good down payment for a $500k home?"
      },
      {
        title: "Closing Costs",
        description: "How much should I budget for closing costs?"
      },
      {
        title: "Loan Types",
        description: "What's the difference between FHA and conventional loans?"
      }
    ]
  },
  {
    category: "Home Improvement",
    icon: Wrench,
    prompts: [
      {
        title: "Kitchen Cost",
        description: "What's the average cost of a kitchen remodel?"
      },
      {
        title: "Bathroom Value",
        description: "How much value does a bathroom renovation add?"
      },
      {
        title: "Best ROI",
        description: "What renovations have the best ROI?"
      }
    ]
  },
  {
    category: "Market Analysis",
    icon: TrendingUp,
    prompts: [
      {
        title: "Market Type",
        description: "Is this a buyer's or seller's market?"
      },
      {
        title: "Market Trends",
        description: "What are the current market trends?"
      },
      {
        title: "Price Check",
        description: "How do I know if a property is overpriced?"
      }
    ]
  }
]; 
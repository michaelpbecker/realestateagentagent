import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Home, Calculator, Wrench, TrendingUp } from "lucide-react";

const SUGGESTED_PROMPTS = [
  {
    category: "Property Analysis",
    icon: Home,
    prompts: [
      {
        title: "Analyze Listing",
        description: "Analyze this Zillow listing: [paste link]"
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

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

export function SuggestedPrompts({ onSelectPrompt }: SuggestedPromptsProps) {
  return (
    <TooltipProvider>
      <div className="grid grid-cols-2 gap-2">
        {SUGGESTED_PROMPTS.map((category) => (
          <div key={category.category} className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <category.icon className="h-4 w-4" />
              {category.category}
            </div>
            <div className="space-y-1">
              {category.prompts.map((prompt) => (
                <Tooltip key={prompt.title}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left h-auto py-2 px-3 text-xs bg-gray-50 hover:bg-gray-100 border-gray-200"
                      onClick={() => onSelectPrompt(prompt.description)}
                    >
                      {prompt.title}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">{prompt.description}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
} 
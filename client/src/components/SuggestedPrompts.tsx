import { Button } from "../ui/button";
import { SUGGESTED_PROMPTS } from "../data/suggested-prompts";

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

export function SuggestedPrompts({ onSelectPrompt }: SuggestedPromptsProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {SUGGESTED_PROMPTS.map((category) => (
        <div key={category.category} className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <category.icon className="h-4 w-4" />
            {category.category}
          </div>
          <div className="space-y-1">
            {category.prompts.map((prompt) => (
              <Button
                key={prompt}
                variant="outline"
                size="sm"
                className="w-full justify-start text-left h-auto py-2 px-3 text-xs"
                onClick={() => onSelectPrompt(prompt)}
              >
                {prompt}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 
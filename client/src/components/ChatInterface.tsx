import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SendHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      setMessages(prev => [...prev, { role: "assistant", content: data.message }]);
    } catch (error: any) {
      console.error("Chat error:", error); // Add client-side logging

      const errorMessage = error.message === "Failed to fetch" 
        ? "Unable to connect to the server. Please check your internet connection."
        : error.message;

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });

      // Remove the user's message if we couldn't get a response
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="h-[calc(100vh-8rem)] lg:sticky lg:top-8">
      <CardHeader>
        <CardTitle>Ask Questions</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col h-[calc(100%-5rem)]">
        <ScrollArea className="flex-1 pr-4 mb-4">
          <div className="space-y-4">
            {messages.map((message, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg text-sm md:text-base ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground ml-4 md:ml-8"
                    : "bg-muted mr-4 md:mr-8"
                }`}
              >
                {message.content}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about home buying..."
            aria-label="Ask about home buying"
            role="textbox"
            name="ask about home buying"
            className="resize-none text-sm md:text-base"
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading}
            className="px-3"
            aria-label="Send message"
          >
            <SendHorizontal className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
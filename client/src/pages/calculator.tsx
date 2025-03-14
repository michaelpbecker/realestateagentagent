import { useParams } from "wouter";
import { Calculator } from "@/components/Calculator";
import { ChatInterface } from "@/components/ChatInterface";

export default function CalculatorPage() {
  const { price } = useParams<{ price: string }>();
  const initialPrice = price ? parseInt(price, 10) : 625000;

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Let's Crunch The Numbers
        </h1>

        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          I'll help you understand all the costs involved in purchasing this home
        </p>

        <div className="grid gap-8 lg:grid-cols-[2fr,1fr] grid-cols-1 items-start">
          <Calculator initialPrice={initialPrice} />
          <div className="lg:sticky lg:top-8">
            <ChatInterface />
          </div>
        </div>
      </main>
    </div>
  );
}

import { Calculator } from "@/components/Calculator";
import { ChatInterface } from "@/components/ChatInterface";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Home Purchase Calculator
          </h1>
          
          <p className="text-muted-foreground text-center mb-12">
            Calculate your monthly payments and required funds for home purchase
          </p>

          <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
            <Calculator />
            <ChatInterface />
          </div>
        </div>
      </main>
    </div>
  );
}

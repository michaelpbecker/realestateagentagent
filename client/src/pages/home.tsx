import { Calculator } from "@/components/Calculator";
import { ChatInterface } from "@/components/ChatInterface";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Home Purchase Calculator
        </h1>

        <p className="text-muted-foreground text-center mb-12">
          Calculate your monthly payments and required funds for home purchase
        </p>

        <div className="grid gap-8 lg:grid-cols-[2fr,1fr] items-start">
          <Calculator />
          <div className="sticky top-8">
            <ChatInterface />
          </div>
        </div>
      </main>
    </div>
  );
}
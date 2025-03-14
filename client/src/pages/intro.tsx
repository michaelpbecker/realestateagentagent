import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { LucideHome } from "lucide-react";

export default function Intro() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center">
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="flex justify-center mb-8">
          <LucideHome className="h-24 w-24 text-foreground" />
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-foreground tracking-tight">
          Real Estate Agent... Agent
        </h1>

        <div className="max-w-2xl mx-auto mb-12 space-y-4 text-lg text-muted-foreground">
          <p>
            Let's face it - with sky-high interest rates and record prices, it might seem like 
            the worst time to buy a house. But here's the thing...
          </p>
          <p>
            It all comes down to two simple questions: Do you love the home? And can you afford it?
          </p>
          <p className="font-medium text-foreground">
            I'm your Real Estate Agent... Agent, ready to help you crunch those numbers and find your dream home.
          </p>
        </div>

        <Link href="/search">
          <Button size="lg" className="text-lg px-8 bg-foreground text-background hover:bg-foreground/90">
            Let's Find Your Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
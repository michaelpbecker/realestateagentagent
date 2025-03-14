import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { Property } from "@shared/types";
import { formatCurrency } from "@shared/calculations";

export default function Search() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/properties/search?q=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      setProperties(data.properties);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function handlePropertySelect(price: number) {
    setLocation(`/calculator/${price}`);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Find Your Dream Home
        </h1>

        <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-12">
          <div className="flex gap-4">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter city, zip code, or state..."
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Search"
              )}
            </Button>
          </div>
        </form>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <Card 
              key={property.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handlePropertySelect(property.price)}
            >
              <img
                src={property.imageUrl}
                alt={property.address}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{property.address}</h3>
                <p className="text-lg text-primary font-bold">
                  {formatCurrency(property.price)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

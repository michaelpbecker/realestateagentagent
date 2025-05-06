export interface Property {
  id: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  yearBuilt: number;
  description: string;
  imageUrl: string;
  createdAt: Date;
}

export interface SearchResponse {
  properties: Property[];
  totalResults: number;
}

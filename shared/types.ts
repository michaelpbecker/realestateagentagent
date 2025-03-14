export interface Property {
  id: string;
  address: string;
  price: number;
  imageUrl: string;
  zpid: string;
  beds: number;
  baths: number;
  sqft: number;
  lotSize: number;
  yearBuilt: number;
  zestimate: number;
}

export interface SearchResponse {
  properties: Property[];
  totalResults: number;
}

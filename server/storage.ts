import type { InsertCalculation, Calculation } from "@shared/schema";

export interface IStorage {
  saveCalculation(calculation: InsertCalculation): Promise<Calculation>;
  getCalculations(): Promise<Calculation[]>;
}

export class MemStorage implements IStorage {
  private calculations: Map<number, Calculation>;
  private currentId: number;

  constructor() {
    this.calculations = new Map();
    this.currentId = 1;
  }

  async saveCalculation(insertCalculation: InsertCalculation): Promise<Calculation> {
    const id = this.currentId++;
    const calculation: Calculation = {
      ...insertCalculation,
      id,
      createdAt: new Date(),
    };
    this.calculations.set(id, calculation);
    return calculation;
  }

  async getCalculations(): Promise<Calculation[]> {
    return Array.from(this.calculations.values());
  }
}

export const storage = new MemStorage();

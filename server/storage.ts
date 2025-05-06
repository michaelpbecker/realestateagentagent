import type { InsertCalculation, Calculation } from "@app/shared/schema";

export interface IStorage {
  saveCalculation(calculation: InsertCalculation): Promise<Calculation>;
  getCalculations(): Promise<Calculation[]>;
}

class MemoryStorage implements IStorage {
  private calculations: Calculation[] = [];
  private nextId = 1;

  async saveCalculation(calculation: InsertCalculation): Promise<Calculation> {
    const newCalculation: Calculation = {
      ...calculation,
      id: this.nextId.toString(),
      createdAt: new Date()
    };
    this.calculations.push(newCalculation);
    this.nextId++;
    return newCalculation;
  }

  async getCalculations(): Promise<Calculation[]> {
    return this.calculations;
  }
}

export const storage = new MemoryStorage();

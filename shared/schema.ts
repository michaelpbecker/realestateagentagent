import { z } from "zod";

export const calculationFormSchema = z.object({
  homePrice: z.number().min(0),
  downPayment: z.number().min(0),
  interestRate: z.number().min(0).max(100),
  loanTerm: z.number().min(1).max(50)
});

export type CalculationForm = z.infer<typeof calculationFormSchema>;

export interface Calculation {
  id: string;
  homePrice: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  monthlyPayment: number;
  createdAt: Date;
}

export type InsertCalculation = Omit<Calculation, 'id' | 'createdAt'>;
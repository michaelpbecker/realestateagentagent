import { z } from "zod";

export const calculationFormSchema = z.object({
  purchasePrice: z.number().min(100000).max(10000000),
  downPaymentPercent: z.number().min(0).max(100),
  hoa: z.number().min(0),
  taxes: z.number().min(0),
  interestRate: z.number().min(0).max(100),
  insurance: z.number().min(0),
  renovationBudget: z.number().min(0),
  monthlyNetIncome: z.number().min(0),
});

export type InsertCalculation = z.infer<typeof calculationFormSchema>;

export type Calculation = InsertCalculation & {
  id: number;
  createdAt: Date;
};
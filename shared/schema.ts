import { pgTable, text, serial, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const calculations = pgTable("calculations", {
  id: serial("id").primaryKey(),
  purchasePrice: numeric("purchase_price").notNull(),
  downPaymentPercent: numeric("down_payment_percent").notNull(),
  hoa: numeric("hoa").notNull(),
  taxes: numeric("taxes").notNull(),
  interestRate: numeric("interest_rate").notNull(),
  insurance: numeric("insurance").notNull(),
  renovationBudget: numeric("renovation_budget").notNull(),
  monthlyNetIncome: numeric("monthly_net_income").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCalculationSchema = createInsertSchema(calculations).omit({
  id: true,
  createdAt: true,
});

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

export type InsertCalculation = z.infer<typeof insertCalculationSchema>;
export type Calculation = typeof calculations.$inferSelect;
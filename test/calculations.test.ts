import { describe, it, expect } from 'vitest';
import { calculateMortgage, formatCurrency, formatPercentage } from '../shared/calculations';

describe('Mortgage Calculations', () => {
  it('calculates monthly payments correctly', () => {
    const result = calculateMortgage(
      500000, // Purchase price
      20,     // Down payment percent
      5,      // Interest rate
      100,    // HOA
      6000,   // Annual taxes
      200,    // Monthly insurance
      10000   // Monthly net income
    );

    expect(result.downPayment).toBe(100000);
    expect(result.principal).toBe(400000);
    expect(result.monthlyHOA).toBe(100);
    expect(result.monthlyTaxes).toBe(500);
    expect(result.monthlyInsurance).toBe(200);
    expect(Math.round(result.monthlyPayment)).toBe(2147); // Monthly mortgage payment
    expect(Math.round(result.totalMonthly)).toBe(2947); // Total monthly cost
    expect(Math.round(result.monthlyIncomePercentage)).toBe(29); // Percentage of income
  });
});

describe('Formatting Functions', () => {
  it('formats currency correctly', () => {
    expect(formatCurrency(1234567)).toBe('$1,234,567');
    expect(formatCurrency(1000.50)).toBe('$1,001');
    expect(formatCurrency(0)).toBe('$0');
  });

  it('formats percentage correctly', () => {
    expect(formatPercentage(25.5)).toBe('25.5%');
    expect(formatPercentage(100)).toBe('100.0%');
    expect(formatPercentage(0)).toBe('0.0%');
  });
});
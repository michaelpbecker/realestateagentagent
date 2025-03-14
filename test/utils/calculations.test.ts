import { describe, it, expect } from 'vitest';
import { calculateMortgage, formatCurrency, formatPercentage } from '../../shared/calculations';

describe('Calculation Utilities', () => {
  describe('calculateMortgage', () => {
    it('calculates mortgage payments correctly', () => {
      const result = calculateMortgage(
        500000, // Purchase Price
        20,     // Down Payment Percent
        6.5,    // Interest Rate
        200,    // HOA
        6000,   // Annual Taxes
        150,    // Monthly Insurance
        10000   // Monthly Net Income
      );

      expect(result.downPayment).toBe(100000);
      expect(result.principal).toBe(400000);
      expect(result.monthlyTaxes).toBe(500);
      expect(result.monthlyHOA).toBe(200);
      expect(result.monthlyInsurance).toBe(150);

      // Verify monthly payment is in reasonable range
      expect(result.monthlyPayment).toBeGreaterThan(2000);
      expect(result.monthlyPayment).toBeLessThan(3000);
    });
  });

  describe('formatters', () => {
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
});
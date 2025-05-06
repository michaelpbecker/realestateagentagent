import express from 'express';
import { calculateMonthlyPayment, calculateDownPayment } from '@app/shared/calculations.js';

export const calculationsRouter = express.Router();

function validateMonthlyPaymentInputs(homePrice: number, downPayment: number, interestRate: number, loanTerm: number): string | null {
  if (typeof homePrice !== 'number' || homePrice <= 0) {
    return 'Home price must be a positive number';
  }
  if (typeof downPayment !== 'number' || downPayment <= 0) {
    return 'Down payment must be a positive number';
  }
  if (typeof interestRate !== 'number' || interestRate <= 0) {
    return 'Interest rate must be a positive number';
  }
  if (typeof loanTerm !== 'number' || loanTerm <= 0) {
    return 'Loan term must be a positive number';
  }
  if (downPayment >= homePrice) {
    return 'Down payment cannot be greater than or equal to home price';
  }
  return null;
}

function validateDownPaymentInputs(homePrice: number, percentage: number): string | null {
  if (typeof homePrice !== 'number' || homePrice <= 0) {
    return 'Home price must be a positive number';
  }
  if (typeof percentage !== 'number' || percentage <= 0 || percentage >= 100) {
    return 'Percentage must be a number between 0 and 100';
  }
  return null;
}

calculationsRouter.post('/monthly-payment', (req, res) => {
  try {
    const { homePrice, downPayment, interestRate, loanTerm } = req.body;
    
    const validationError = validateMonthlyPaymentInputs(homePrice, downPayment, interestRate, loanTerm);
    if (validationError) {
      return res.status(500).json({ error: validationError });
    }

    const monthlyPayment = calculateMonthlyPayment(homePrice, downPayment, interestRate, loanTerm);
    res.json({ monthlyPayment });
  } catch (error) {
    console.error('Monthly payment calculation error:', error);
    res.status(500).json({ error: 'Failed to calculate monthly payment' });
  }
});

calculationsRouter.post('/down-payment', (req, res) => {
  try {
    const { homePrice, percentage } = req.body;

    const validationError = validateDownPaymentInputs(homePrice, percentage);
    if (validationError) {
      return res.status(500).json({ error: validationError });
    }

    const downPayment = calculateDownPayment(homePrice, percentage);
    res.json({ downPayment });
  } catch (error) {
    console.error('Down payment calculation error:', error);
    res.status(500).json({ error: 'Failed to calculate down payment' });
  }
}); 
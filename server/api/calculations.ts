import express from 'express';
import { calculateMonthlyPayment, calculateDownPayment } from '../../shared/dist/calculations.js';

export const calculationsRouter = express.Router();

calculationsRouter.post('/monthly-payment', (req, res) => {
  try {
    const { homePrice, downPayment, interestRate, loanTerm } = req.body;
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
    const downPayment = calculateDownPayment(homePrice, percentage);
    res.json({ downPayment });
  } catch (error) {
    console.error('Down payment calculation error:', error);
    res.status(500).json({ error: 'Failed to calculate down payment' });
  }
}); 
export interface CalculationResult {
  monthlyPayment: number;
  downPayment: number;
  principal: number;
  monthlyTaxes: number;
  monthlyInsurance: number;
  monthlyHOA: number;
  totalMonthly: number;
  monthlyIncomePercentage: number;
}

export function calculateMortgage(
  purchasePrice: number,
  downPaymentPercent: number,
  interestRate: number,
  hoa: number,
  taxes: number,
  insurance: number,
  monthlyNetIncome: number,
): CalculationResult {
  const downPayment = (purchasePrice * downPaymentPercent) / 100;
  const principal = purchasePrice - downPayment;

  // Monthly interest rate
  const monthlyRate = interestRate / 12 / 100;

  // Total number of payments (30 year fixed)
  const payments = 30 * 12;

  // Monthly mortgage payment using amortization formula
  const monthlyPayment = principal * 
    (monthlyRate * Math.pow(1 + monthlyRate, payments)) / 
    (Math.pow(1 + monthlyRate, payments) - 1);

  const monthlyTaxes = taxes / 12;
  const monthlyInsurance = insurance;
  const monthlyHOA = hoa;

  const totalMonthly = monthlyPayment + monthlyTaxes + monthlyInsurance + monthlyHOA;
  const monthlyIncomePercentage = (totalMonthly / monthlyNetIncome) * 100;

  return {
    monthlyPayment,
    downPayment,
    principal,
    monthlyTaxes,
    monthlyInsurance,
    monthlyHOA,
    totalMonthly,
    monthlyIncomePercentage,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
}

/**
 * Calculates the monthly mortgage payment using the loan amount, interest rate, and loan term.
 * @param {number} homePrice - The total home price in dollars
 * @param {number} downPayment - The down payment amount in dollars
 * @param {number} interestRate - The annual interest rate as a percentage (e.g., 5.5 for 5.5%)
 * @param {number} loanTerm - The loan term in years
 * @returns {number} The monthly payment amount
 */
export function calculateMonthlyPayment(homePrice: number, downPayment: number, interestRate: number, loanTerm: number): number {
    const loanAmount = homePrice - downPayment;
    // Convert annual interest rate to monthly rate (as a decimal)
    const monthlyRate = (interestRate / 100) / 12;
    
    // Convert loan term from years to months
    const numberOfPayments = loanTerm * 12;
    
    // Calculate monthly payment using the formula:
    // P = L[c(1 + c)^n]/[(1 + c)^n - 1]
    // where P = payment, L = loan amount, c = monthly interest rate, n = number of payments
    const monthlyPayment = loanAmount * 
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    return Math.round(monthlyPayment * 100) / 100; // Round to 2 decimal places
}

/**
 * Calculates the down payment amount based on the home price and percentage.
 * @param {number} homePrice - The total home price in dollars
 * @param {number} percentage - The down payment percentage (e.g., 20 for 20%)
 * @returns {number} The down payment amount
 */
export function calculateDownPayment(homePrice: number, percentage: number): number {
    const downPayment = homePrice * (percentage / 100);
    return Math.round(downPayment * 100) / 100; // Round to 2 decimal places
}
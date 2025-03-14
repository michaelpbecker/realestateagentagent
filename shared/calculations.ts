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
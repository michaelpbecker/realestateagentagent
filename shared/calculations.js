export function calculateMortgage(purchasePrice, downPaymentPercent, interestRate, hoa, taxes, insurance, monthlyNetIncome) {
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
export function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}
export function formatPercentage(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    }).format(value / 100);
}
export function calculateMonthlyPayment(homePrice, downPayment, interestRate, loanTerm) {
    const principal = homePrice - downPayment;
    const monthlyRate = interestRate / 12 / 100;
    const numberOfPayments = loanTerm * 12;
    const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    return Math.round(monthlyPayment * 100) / 100;
}
export function calculateDownPayment(homePrice, percentage) {
    return Math.round((homePrice * percentage) / 100);
}

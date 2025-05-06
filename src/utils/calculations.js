/**
 * Calculates the monthly mortgage payment using the loan amount, interest rate, and loan term.
 * @param {number} loanAmount - The total loan amount in dollars
 * @param {number} interestRate - The annual interest rate as a percentage (e.g., 5.5 for 5.5%)
 * @param {number} loanTerm - The loan term in years
 * @returns {number} The monthly payment amount
 */
function calculateMonthlyPayment(loanAmount, interestRate, loanTerm) {
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

module.exports = {
    calculateMonthlyPayment
}; 
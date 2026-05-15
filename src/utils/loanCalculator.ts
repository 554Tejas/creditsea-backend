/**
 * Loan Calculation Logic
 * Centralized utility to ensure the backend verifies all frontend math.
 */

export const calculateSimpleInterest = (principal: number, rate: number, tenureDays: number): number => {
  // SI = (P × R × T) / (365 × 100)
  const interest = (principal * rate * tenureDays) / (365 * 100);
  return Math.round(interest * 100) / 100; // Round to 2 decimal places
};

export const calculateTotalRepayment = (principal: number, interest: number): number => {
  const total = principal + interest;
  return Math.round(total * 100) / 100;
};
/**
 * Business Rule Engine (BRE)
 * Validates borrower eligibility based on strict criteria.
 */

export interface BREResult {
  passed: boolean;
  reason?: string;
}

export const calculateAge = (dob: Date): number => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const runBRE = (
  dob: Date | string,
  salary: number,
  pan: string,
  employmentMode: string
): BREResult => {
  // 1. Age Check (23 - 50)
  const age = calculateAge(new Date(dob));
  if (age < 23 || age > 50) {
    return { passed: false, reason: 'Age must be between 23 and 50' };
  }

  // 2. Salary Check (>= 25000)
  if (salary < 25000) {
    return { passed: false, reason: 'Salary below 25,000/month' };
  }

  // 3. PAN Format Check
  // Valid PAN: 5 Letters, 4 Digits, 1 Letter (e.g., ABCDE1234F)
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!panRegex.test(pan.toUpperCase())) {
    return { passed: false, reason: 'Does not match valid PAN format' };
  }

  // 4. Employment Check
  if (employmentMode === 'Unemployed') {
    return { passed: false, reason: 'Applicant is Unemployed' };
  }

  // All checks passed
  return { passed: true };
};
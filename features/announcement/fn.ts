/**
 * Validates CPF using the official algorithm
 * Checks for invalid patterns (all same digits) and verifies check digits
 * @param cpf - CPF string with or without formatting
 * @returns true if CPF is valid according to Brazilian standards
 */
export const isValidCPF = (cpf: string): boolean => {
  const numbers = cpf.replace(/\D/g, "");

  if (numbers.length !== 11) return false;

  // Reject CPFs with all same digits (e.g., 111.111.111-11)
  if (/^(\d)\1{10}$/.test(numbers)) return false;

  // Calculate first check digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers[i], 10) * (10 - i);
  }
  const remainder = sum % 11;
  const firstDigit = remainder < 2 ? 0 : 11 - remainder;

  if (parseInt(numbers[9], 10) !== firstDigit) return false;

  // Calculate second check digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers[i], 10) * (11 - i);
  }
  const remainder2 = sum % 11;
  const secondDigit = remainder2 < 2 ? 0 : 11 - remainder2;

  return parseInt(numbers[10], 10) === secondDigit;
};

/**
 * Formats CPF input with Brazilian standard formatting (XXX.XXX.XXX-XX)
 * Strips non-numeric characters and applies formatting progressively as user types
 * @param value - Raw input string from user
 * @returns Formatted CPF string with dots and dash
 */
export const formatCPF = (value: string) => {
  const numbers = value.replace(/\D/g, "");

  if (numbers.length <= 3) {
    return numbers;
  } else if (numbers.length <= 6) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  } else if (numbers.length <= 9) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  } else {
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  }
};

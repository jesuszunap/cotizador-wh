/**
 * Utility functions for formatting and parsing money/percentages in Cotizador WH.
 */

/**
 * Formats a number to currency style with dot decimal separator.
 * Example: 1.7 -> "$1.70"
 * @param {number} value 
 * @returns {string}
 */
export function formatCurrencyDot(value) {
  if (value === undefined || value === null || isNaN(value)) return '$0.00';
  return `$${value.toFixed(2)}`;
}

/**
 * Formats a number to currency style with comma decimal separator.
 * Example: 1.7 -> "$1,70"
 * @param {number} value 
 * @returns {string}
 */
export function formatCurrencyComma(value) {
  if (value === undefined || value === null || isNaN(value)) return '$0,00';
  return `$${value.toFixed(2).replace('.', ',')}`;
}

/**
 * Formats commission percentage factor into a 3-decimal percent string.
 * Example: 0.085 -> "8.500%"
 * @param {number} factor 
 * @returns {string}
 */
export function formatPercent(factor) {
  if (factor === undefined || factor === null || isNaN(factor)) return '0.00%';
  const value = (factor * 100).toFixed(3);
  // Remove trailing zero if the third decimal digit is zero
  if (value.endsWith('0')) {
    return `${value.slice(0, -1)}%`;
  }
  return `${value}%`;
}

/**
 * Parses user input amount, handling both comma and dot as decimal separators.
 * Example: "32,57" -> 32.57
 * Example: "32.57" -> 32.57
 * @param {string|number} input 
 * @returns {number}
 */
export function parseInputAmount(input) {
  if (input === undefined || input === null || input === '') return 0;
  
  // Convert to string and clean up
  const cleaned = input.toString().trim();
  
  // Replace comma with dot
  const sanitized = cleaned.replace(/,/g, '.');
  
  const parsed = parseFloat(sanitized);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Formats the final commission string.
 * - If commissionAdditional is 0: formatted with dot, e.g. "$1.70"
 * - If commissionAdditional > 0: formatted with comma sum, e.g. "$1,70 + $0,25"
 * @param {number} normal 
 * @param {number} additional 
 * @returns {string}
 */
export function formatComisionFinal(normal, additional) {
  if (additional === 0) {
    return formatCurrencyDot(normal);
  } else {
    return `${formatCurrencyComma(normal)} + ${formatCurrencyComma(additional)}`;
  }
}

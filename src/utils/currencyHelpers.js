// Format currency with symbol
export function formatCurrency(amount, currency = 'INR') {
  const symbols = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£'
  };

  const symbol = symbols[currency] || '₹';
  const formatted = Math.abs(amount).toFixed(2);

  return amount < 0 ? `-${symbol}${formatted}` : `${symbol}${formatted}`;
}

// Parse currency string to number
export function parseCurrency(value) {
  if (typeof value === 'number') return value;
  if (!value) return 0;

  // Remove currency symbols and spaces
  const cleaned = value.toString().replace(/[₹$€£,\s]/g, '');
  const parsed = parseFloat(cleaned);

  return isNaN(parsed) ? 0 : parsed;
}

// Format number with commas (Indian style)
export function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Calculate profit margin percentage
export function calculateProfitMargin(costPrice, sellingPrice) {
  if (!costPrice || costPrice === 0) return 0;

  const profit = sellingPrice - costPrice;
  const margin = (profit / sellingPrice) * 100;

  return margin.toFixed(2);
}

// Calculate markup percentage
export function calculateMarkup(costPrice, sellingPrice) {
  if (!costPrice || costPrice === 0) return 0;

  const profit = sellingPrice - costPrice;
  const markup = (profit / costPrice) * 100;

  return markup.toFixed(2);
}

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Math.round(amount));
}

/**
 * Compact Indian-notation formatter for mobile viewports.
 * 2,45,681 → ₹2.5L  |  85,000 → ₹85K  |  1,20,00,000 → ₹1.2Cr
 */
export function formatCurrencyCompact(amount: number, currency = 'INR'): string {
  const symbol = currency === 'INR' ? '₹' : currency;
  const abs = Math.abs(Math.round(amount));
  const sign = amount < 0 ? '-' : '';

  if (abs >= 1_00_00_000) {
    return `${sign}${symbol}${+(abs / 1_00_00_000).toFixed(1)}Cr`;
  }
  if (abs >= 1_00_000) {
    return `${sign}${symbol}${+(abs / 1_00_000).toFixed(1)}L`;
  }
  if (abs >= 1_000) {
    return `${sign}${symbol}${+(abs / 1_000).toFixed(1)}K`;
  }
  return `${sign}${symbol}${abs}`;
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr));
}

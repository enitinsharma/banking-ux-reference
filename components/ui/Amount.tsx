import { formatCurrency, formatCurrencyCompact } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface AmountProps {
  value: number;
  currency?: string;
  /** Optional sign prefix rendered before the number, e.g. '+' or '−' */
  prefix?: string;
  className?: string;
}

/**
 * Renders the full Indian-formatted amount on sm+ screens and a compact
 * K / L / Cr notation on mobile — purely via CSS, no JS media query.
 *
 *   Desktop:  ₹2,45,681
 *   Mobile:   ₹2.5L
 */
export function Amount({ value, currency = 'INR', prefix = '', className }: AmountProps) {
  return (
    <>
      <span className={cn('sm:hidden', className)}>
        {prefix}{formatCurrencyCompact(value, currency)}
      </span>
      <span className={cn('hidden sm:inline', className)}>
        {prefix}{formatCurrency(value, currency)}
      </span>
    </>
  );
}

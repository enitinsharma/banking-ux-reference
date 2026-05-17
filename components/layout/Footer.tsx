'use client';

import { useTheme } from '@/lib/hooks/useTheme';

const footerLinks = [
  'Privacy policy',
  'Terms of use',
  'Disclaimer',
  'Security',
  'Grievance redressal',
  'Contact us',
];

export function Footer() {
  const { theme } = useTheme();

  return (
    <footer className="border-t border-ui-border bg-brand-card px-6 py-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {footerLinks.map(link => (
            <a
              key={link}
              href="#"
              className="text-xs text-content-secondary transition-colors hover:text-content-primary hover:underline"
            >
              {link}
            </a>
          ))}
        </div>
        <p className="text-xs text-content-secondary">
          © 2026 {theme.legalName} All rights reserved.
        </p>
      </div>
    </footer>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { Share, X } from 'lucide-react';

export function IosInstallBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isStandalone = ('standalone' in navigator) && (navigator as Navigator & { standalone: boolean }).standalone;
    const dismissed = sessionStorage.getItem('ios-banner-dismissed');
    if (isIos && !isStandalone && !dismissed) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  function dismiss() {
    sessionStorage.setItem('ios-banner-dismissed', '1');
    setVisible(false);
  }

  return (
    <div className="fixed bottom-16 left-3 right-3 z-50 flex items-start gap-3 rounded-2xl border border-ui-border bg-brand-card px-4 py-3.5 shadow-lg lg:hidden">
      {/* Bank icon */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xl">
        🏦
      </div>

      {/* Text */}
      <div className="flex-1 text-sm">
        <p className="font-semibold text-content-primary">Add to Home Screen</p>
        <p className="mt-0.5 text-xs text-content-secondary">
          Tap <Share className="mx-0.5 inline h-3.5 w-3.5 text-blue-500" /> then{' '}
          <span className="font-medium text-content-primary">Add to Home Screen</span>
        </p>
      </div>

      {/* Dismiss */}
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="mt-0.5 shrink-0 text-content-secondary hover:text-content-primary"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

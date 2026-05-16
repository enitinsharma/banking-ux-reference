'use client';

import { useEffect, useState, type ReactNode } from 'react';

export function MSWProvider({ children }: { children: ReactNode }) {
  // MSW runs in every environment — this is a fully mock-driven demo app
  // with no real backend. Production visitors need the mock data too.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    import('../mocks/browser')
      .then(({ worker }) =>
        worker.start({
          onUnhandledRequest: 'bypass',
          serviceWorker: { url: '/mockServiceWorker.js' },
        }),
      )
      .then(() => setReady(true))
      .catch((err: unknown) => {
        // Service Worker registration can fail in hardened browsers
        // (Edge enhanced security, Firefox private mode, corporate proxies).
        // Render the app anyway — pages degrade gracefully without mock data.
        console.warn(
          '[MSW] Service Worker failed to start — rendering without mock data.\n',
          err,
        );
        setReady(true);
      });
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f1f5f9]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2563eb] border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}

'use client';

import { useEffect, useState, type ReactNode } from 'react';

export function MSWProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(process.env.NODE_ENV !== 'development');

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    import('../mocks/browser')
      .then(({ worker }) =>
        worker.start({
          onUnhandledRequest: 'bypass',
          // Explicit URL avoids Edge/Firefox SW scope resolution failures
          serviceWorker: { url: '/mockServiceWorker.js' },
        }),
      )
      .then(() => setReady(true))
      .catch((err: unknown) => {
        // SW registration can fail in hardened browsers (Edge enhanced security,
        // Firefox private mode, some corporate proxies). Log the warning and
        // render the app anyway — API calls will simply return 404s without mocks.
        console.warn(
          '[MSW] Service Worker failed to start — app will render without mock data.\n',
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

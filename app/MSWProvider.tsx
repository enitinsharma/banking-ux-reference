'use client';

import { useEffect, useState, type ReactNode } from 'react';

type MSWStatus = 'starting' | 'ready' | 'failed';

export function MSWProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<MSWStatus>('starting');

  useEffect(() => {
    import('../mocks/browser')
      .then(({ worker }) =>
        worker.start({
          onUnhandledRequest: 'bypass',
          serviceWorker: { url: '/mockServiceWorker.js' },
        }),
      )
      .then(() => {
        console.info('[MSW] ✅ Worker started — all API calls are mocked.');
        setStatus('ready');
      })
      .catch((err: unknown) => {
        console.warn(
          '[MSW] ❌ Service Worker failed to start.\n',
          'All data will show as empty.\n',
          'Common causes:\n',
          '  • DevTools → Network → "Disable cache" is ticked (also disables SW)\n',
          '  • DevTools → Application → Service Workers → "Bypass for network" is on\n',
          '  • Browser is in private / incognito mode\n',
          '  • Visiting via iframe (e.g. preview tools)\n',
          'Fix: uncheck "Disable cache", do a hard refresh (Ctrl+Shift+R).\n',
          err,
        );
        setStatus('failed');
      });
  }, []);

  if (status === 'starting') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f1f5f9]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2563eb] border-t-transparent" />
          <p className="text-sm text-[#64748b]">Starting mock API…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {status === 'failed' && (
        <div className="sticky top-0 z-[9999] bg-amber-500 px-4 py-2 text-center text-sm font-medium text-white">
          ⚠ Mock API unavailable — data will not load.
          Check the browser console for fix details, then hard‑refresh (Ctrl+Shift+R).
        </div>
      )}
      {children}
    </>
  );
}

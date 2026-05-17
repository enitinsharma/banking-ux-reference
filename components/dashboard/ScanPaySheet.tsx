'use client';

import { useEffect, useState } from 'react';
import { Keyboard, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface ScanPaySheetProps {
  open: boolean;
  onClose: () => void;
}

export function ScanPaySheet({ open, onClose }: ScanPaySheetProps) {
  const [manualMode, setManualMode] = useState(false);
  const [upiId, setUpiId] = useState('');

  // Reset state when sheet closes
  useEffect(() => {
    if (!open) {
      setManualMode(false);
      setUpiId('');
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className={cn(
          'fixed inset-0 z-50 bg-black/60 transition-opacity duration-300',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Scan & Pay"
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl bg-brand-card',
          'transition-transform duration-300 ease-out',
          open ? 'translate-y-0' : 'translate-y-full',
        )}
      >
        {/* Drag handle */}
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-ui-border" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="text-base font-semibold text-content-primary">Scan & Pay</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-content-secondary transition-colors hover:text-content-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!manualMode ? (
          <div className="px-5 pb-10">
            {/* QR Viewfinder */}
            <div className="relative mx-auto mb-5 h-56 w-56 overflow-hidden rounded-2xl bg-neutral-900">
              {/* Corner brackets */}
              <span className="absolute left-3 top-3 h-7 w-7 rounded-tl border-l-2 border-t-2 border-white" />
              <span className="absolute right-3 top-3 h-7 w-7 rounded-tr border-r-2 border-t-2 border-white" />
              <span className="absolute bottom-3 left-3 h-7 w-7 rounded-bl border-b-2 border-l-2 border-white" />
              <span className="absolute bottom-3 right-3 h-7 w-7 rounded-br border-b-2 border-r-2 border-white" />

              {/* Animated scan line */}
              <span className="animate-scan-line absolute left-4 right-4 h-0.5 rounded-full bg-accent/80 shadow-[0_0_6px_2px] shadow-accent/40" />

              {/* Demo overlay — replace with real camera stream */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
                <p className="text-xs leading-relaxed text-white/60">
                  Camera access required<br />to scan QR codes
                </p>
                <Button size="sm">Enable Camera</Button>
              </div>
            </div>

            <p className="mb-5 text-center text-xs text-content-secondary">
              Works with any UPI QR code — PhonePe, Google Pay, Paytm&nbsp;…
            </p>

            <button
              onClick={() => setManualMode(true)}
              className="mx-auto flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
            >
              <Keyboard className="h-3.5 w-3.5" />
              Enter UPI ID manually
            </button>
          </div>
        ) : (
          <div className="space-y-4 px-5 pb-10">
            <p className="text-sm text-content-secondary">Enter the recipient's UPI ID</p>

            <input
              type="text"
              autoFocus
              placeholder="name@upi  or  mobile@bank"
              value={upiId}
              onChange={e => setUpiId(e.target.value)}
              className={cn(
                'w-full rounded-lg border border-ui-border bg-brand-page px-3 py-2.5',
                'text-sm text-content-primary placeholder:text-content-secondary',
                'focus:outline-none focus:ring-2 focus:ring-accent',
              )}
            />

            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setManualMode(false)}>
                Back
              </Button>
              <Button className="flex-1" disabled={!upiId.includes('@')}>
                Proceed
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

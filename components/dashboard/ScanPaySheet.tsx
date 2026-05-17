'use client';

import { useEffect, useState } from 'react';
import { Keyboard, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { QrScanner } from './QrScanner';
import type { PayeeInfo } from './QrScanner';

interface ScanPaySheetProps {
  open: boolean;
  onClose: () => void;
}

export function ScanPaySheet({ open, onClose }: ScanPaySheetProps) {
  const [manualMode, setManualMode] = useState(false);
  const [upiId, setUpiId] = useState('');
  const router = useRouter();

  // Reset on close
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

  function handleConfirm(payee: PayeeInfo) {
    onClose();
    const params = new URLSearchParams({ to: payee.upiId, name: payee.name });
    if (payee.amount != null) params.set('amount', String(payee.amount));
    if (payee.note)           params.set('note', payee.note);
    router.push(`/transfer?${params}`);
  }

  function handleManualProceed() {
    onClose();
    router.push(`/transfer?to=${encodeURIComponent(upiId)}`);
  }

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
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-content-primary">Scan & Pay</h2>
            {manualMode && (
              <span className="rounded-full bg-brand-page px-2 py-0.5 text-xs text-content-secondary">
                Manual
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-content-secondary transition-colors hover:text-content-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scanner (mounts the real QR scanner) */}
        {!manualMode && (
          <QrScanner
            onConfirm={handleConfirm}
            onManualEntry={() => setManualMode(true)}
          />
        )}

        {/* Manual UPI ID entry */}
        {manualMode && (
          <div className="space-y-4 px-5 pb-10">
            <p className="text-sm text-content-secondary">Enter the recipient's UPI ID</p>

            <input
              type="text"
              autoFocus
              placeholder="name@upi  ·  mobile@bank  ·  handle@paytm"
              value={upiId}
              onChange={e => setUpiId(e.target.value)}
              className={cn(
                'w-full rounded-lg border border-ui-border bg-brand-page px-3 py-2.5',
                'font-mono text-sm text-content-primary placeholder:font-sans placeholder:text-content-secondary',
                'focus:outline-none focus:ring-2 focus:ring-accent',
              )}
            />

            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setManualMode(false)}
              >
                <span className="flex items-center gap-1.5">
                  <Keyboard className="h-3.5 w-3.5" />
                  Use Camera
                </span>
              </Button>
              <Button
                className="flex-1"
                disabled={!upiId.includes('@')}
                onClick={handleManualProceed}
              >
                Proceed
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

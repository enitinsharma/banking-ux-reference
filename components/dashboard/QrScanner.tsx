'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  Keyboard,
  Loader2,
  QrCode,
  RotateCcw,
  VideoOff,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { IScannerControls } from '@zxing/browser';

/* ── Types ─────────────────────────────────────────────────── */
type ScanState = 'idle' | 'scanning' | 'verifying' | 'confirmed' | 'denied' | 'error';

export interface PayeeInfo {
  upiId: string;
  name: string;
  amount?: number;
  note?: string;
}

export interface QrScannerProps {
  onConfirm: (payee: PayeeInfo) => void;
  onManualEntry: () => void;
}

/* ── UPI deep-link parser ───────────────────────────────────
   Standard: upi://pay?pa=id@bank&pn=Name&am=100.00&cu=INR&tn=Note
─────────────────────────────────────────────────────────────── */
function parseUpiQr(text: string): {
  upiId: string;
  rawName?: string;
  amount?: number;
  note?: string;
} | null {
  try {
    // Some QRs use "upi://pay?…" others may just use "pa=…" bare — handle both
    const normalised = text.startsWith('upi://') ? text : `upi://${text}`;
    const url = new URL(normalised);
    if (url.protocol !== 'upi:') return null;
    const p = url.searchParams;
    const pa = p.get('pa')?.trim();
    if (!pa) return null;
    const am = p.get('am');
    return {
      upiId: pa,
      rawName: p.get('pn') ?? undefined,
      amount: am ? parseFloat(am) : undefined,
      note: p.get('tn') ?? undefined,
    };
  } catch {
    return null;
  }
}

/* ── Mock VPA name resolution ───────────────────────────────
   In production this calls the bank's VPA resolve API.
   We derive a readable name from the UPI handle for the demo.
─────────────────────────────────────────────────────────────── */
async function resolveVpaName(upiId: string): Promise<string> {
  await new Promise(r => setTimeout(r, 1100));
  return upiId
    .split('@')[0]
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim();
}

/* ── Component ──────────────────────────────────────────────── */
export function QrScanner({ onConfirm, onManualEntry }: QrScannerProps) {
  const videoRef    = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const scannedRef  = useRef(false); // guard against duplicate callbacks
  const [state, setState] = useState<ScanState>('idle');
  const [payee, setPayee] = useState<PayeeInfo | null>(null);

  const stopScanner = useCallback(() => {
    controlsRef.current?.stop();
    controlsRef.current = null;
  }, []);

  // Clean up on unmount
  useEffect(() => () => stopScanner(), [stopScanner]);

  async function startCamera() {
    scannedRef.current = false;
    setState('scanning');
    try {
      // Dynamic import keeps @zxing/browser out of the server bundle
      const { BrowserMultiFormatReader } = await import('@zxing/browser');
      const reader   = new BrowserMultiFormatReader();
      const controls = await reader.decodeFromVideoDevice(
        undefined,           // undefined = default/rear camera
        videoRef.current!,
        async (result) => {
          if (!result || scannedRef.current) return;
          const parsed = parseUpiQr(result.getText());
          if (!parsed) return; // non-UPI QR — keep scanning

          scannedRef.current = true;
          stopScanner();
          setState('verifying');

          const name = parsed.rawName ?? await resolveVpaName(parsed.upiId);
          setPayee({ upiId: parsed.upiId, name, amount: parsed.amount, note: parsed.note });
          setState('confirmed');
        },
      );
      controlsRef.current = controls;
    } catch (err: unknown) {
      const name = (err as { name?: string })?.name;
      setState(name === 'NotAllowedError' ? 'denied' : 'error');
    }
  }

  function reset() {
    stopScanner();
    scannedRef.current = false;
    setPayee(null);
    setState('idle');
  }

  /* ── Idle ── */
  if (state === 'idle') return (
    <div className="flex flex-col items-center gap-4 px-5 pb-10 pt-2">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        <QrCode className="h-8 w-8" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-content-primary">Scan any UPI QR code</p>
        <p className="mt-1 text-xs leading-relaxed text-content-secondary">
          Works with PhonePe, Google Pay, Paytm&nbsp;and all UPI merchant&nbsp;QRs
        </p>
      </div>
      <Button onClick={startCamera}>Enable Camera</Button>
      <button
        onClick={onManualEntry}
        className="flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
      >
        <Keyboard className="h-3.5 w-3.5" />
        Enter UPI ID manually
      </button>
    </div>
  );

  /* ── Permission denied ── */
  if (state === 'denied') return (
    <div className="flex flex-col items-center gap-4 px-5 pb-10 pt-2 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
        <VideoOff className="h-7 w-7" />
      </div>
      <div>
        <p className="text-sm font-medium text-content-primary">Camera access denied</p>
        <p className="mt-1 text-xs leading-relaxed text-content-secondary">
          Allow camera access in your browser settings, then try again.
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="secondary" onClick={onManualEntry}>Enter UPI ID</Button>
        <Button onClick={startCamera}>Try Again</Button>
      </div>
    </div>
  );

  /* ── Error ── */
  if (state === 'error') return (
    <div className="flex flex-col items-center gap-4 px-5 pb-10 pt-2 text-center">
      <p className="text-sm text-content-secondary">Something went wrong with the camera.</p>
      <div className="flex gap-3">
        <Button variant="secondary" onClick={onManualEntry}>Enter UPI ID</Button>
        <Button onClick={reset}>Try Again</Button>
      </div>
    </div>
  );

  /* ── Scanning / Verifying / Confirmed ── */
  return (
    <div className="px-5 pb-10">
      {/* Viewfinder */}
      <div className="relative mx-auto mb-4 h-60 w-60 overflow-hidden rounded-2xl bg-neutral-900">
        {/* Live video stream — always mounted so the ref is available */}
        <video
          ref={videoRef}
          className={cn(
            'h-full w-full object-cover',
            state === 'confirmed' && 'opacity-30',
          )}
          autoPlay
          muted
          playsInline
        />

        {/* Corner brackets */}
        <span className="absolute left-3 top-3    h-7 w-7 rounded-tl border-l-2 border-t-2 border-white" />
        <span className="absolute right-3 top-3   h-7 w-7 rounded-tr border-r-2 border-t-2 border-white" />
        <span className="absolute bottom-3 left-3  h-7 w-7 rounded-bl border-b-2 border-l-2 border-white" />
        <span className="absolute bottom-3 right-3 h-7 w-7 rounded-br border-b-2 border-r-2 border-white" />

        {/* Animated scan line — only while actively scanning */}
        {state === 'scanning' && (
          <span className="animate-scan-line absolute left-4 right-4 h-0.5 rounded-full bg-accent/80 shadow-[0_0_6px_2px] shadow-accent/40" />
        )}

        {/* Verifying overlay */}
        {state === 'verifying' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
            <p className="text-xs text-white/80">Verifying payee…</p>
          </div>
        )}

        {/* Confirmed overlay */}
        {state === 'confirmed' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <CheckCircle2 className="h-12 w-12 text-emerald-400" />
          </div>
        )}
      </div>

      {/* Content below viewfinder */}
      {state === 'scanning' && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-xs text-content-secondary">
            Hold the QR code steady inside the frame
          </p>
          <button
            onClick={onManualEntry}
            className="flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
          >
            <Keyboard className="h-3.5 w-3.5" />
            Enter UPI ID manually
          </button>
        </div>
      )}

      {state === 'verifying' && (
        <p className="text-center text-xs text-content-secondary">
          QR detected · looking up payee details
        </p>
      )}

      {state === 'confirmed' && payee && (
        <div className="space-y-4">
          {/* Payee summary card */}
          <div className="rounded-xl border border-ui-border bg-brand-page p-4">
            <p className="text-xs text-content-secondary">Paying</p>
            <p className="mt-0.5 text-lg font-semibold text-content-primary">{payee.name}</p>
            <p className="font-mono text-xs text-content-secondary">{payee.upiId}</p>
            {payee.amount != null && (
              <p className="mt-2 text-sm font-medium text-content-primary">
                ₹{payee.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                {payee.note && (
                  <span className="ml-2 font-normal text-content-secondary">· {payee.note}</span>
                )}
              </p>
            )}
          </div>

          <Button className="w-full" onClick={() => onConfirm(payee)}>
            Proceed to Pay
          </Button>

          <button
            onClick={reset}
            className="mx-auto flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
          >
            <RotateCcw className="h-3 w-3" />
            Scan a different QR
          </button>
        </div>
      )}
    </div>
  );
}

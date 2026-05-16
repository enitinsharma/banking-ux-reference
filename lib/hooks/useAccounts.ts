'use client';

import { useState, useEffect } from 'react';
import type { Account } from '@/types/account';

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch('/api/accounts')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<Account[]>;
      })
      .then(setAccounts)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { accounts, loading, error };
}

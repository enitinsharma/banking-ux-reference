'use client';

import { useState, useEffect } from 'react';
import type { Transaction } from '@/types/transaction';

interface UseTransactionsOptions {
  accountId?: string;
  limit?: number;
}

export function useTransactions(options: UseTransactionsOptions = {}) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (options.accountId) params.set('accountId', options.accountId);
    if (options.limit) params.set('limit', String(options.limit));

    fetch(`/api/transactions?${params}`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<Transaction[]>;
      })
      .then(setTransactions)
      .catch(setError)
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.accountId, options.limit]);

  return { transactions, loading, error };
}

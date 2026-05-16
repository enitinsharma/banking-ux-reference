'use client';

import { useState, useEffect } from 'react';
import type { RewardsSummary, RedemptionOption } from '@/types/rewards';

interface RewardsData {
  summary: RewardsSummary;
  redemptionOptions: RedemptionOption[];
}

export function useRewards() {
  const [data, setData] = useState<RewardsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch('/api/rewards')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<RewardsData>;
      })
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return {
    summary: data?.summary ?? null,
    redemptionOptions: data?.redemptionOptions ?? [],
    loading,
    error,
  };
}

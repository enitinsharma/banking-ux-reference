import type { Account } from '@/types/account';
import type { Transaction } from '@/types/transaction';
import type { Beneficiary, RecurringTransfer, TransferPayload, TransferResult } from '@/types/transfer';
import type { ServiceRequest, CallbackRequest } from '@/types/request';
import type { RewardsSummary, PointsHistoryEntry, RedemptionOption } from '@/types/rewards';

const BASE = '/api';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json();
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json();
}

async function patch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json();
}

export const api = {
  accounts: {
    list: () => get<Account[]>('/accounts'),
    get: (id: string) => get<Account>(`/accounts/${id}`),
  },
  transactions: {
    list: (opts?: { accountId?: string; limit?: number }) => {
      const qs = new URLSearchParams(opts as Record<string, string>).toString();
      return get<Transaction[]>(`/transactions${qs ? `?${qs}` : ''}`);
    },
  },
  beneficiaries: {
    list: () => get<Beneficiary[]>('/beneficiaries'),
  },
  transfers: {
    send: (payload: TransferPayload) => post<TransferResult>('/transfers', payload),
    recurring: {
      list: () => get<RecurringTransfer[]>('/transfers/recurring'),
      toggle: (id: string, active: boolean) =>
        patch<RecurringTransfer>(`/transfers/recurring/${id}`, { active }),
    },
  },
  serviceRequests: {
    list: () => get<ServiceRequest[]>('/service-requests'),
    create: (type: ServiceRequest['type'], details?: Record<string, string>) =>
      post<ServiceRequest>('/service-requests', { type, details }),
    callback: (req: CallbackRequest) => post<{ success: boolean; ticketId: string }>('/callback', req),
  },
  rewards: {
    summary: () => get<{ summary: RewardsSummary; redemptionOptions: RedemptionOption[] }>('/rewards'),
    history: () => get<PointsHistoryEntry[]>('/rewards/history'),
    redeem: (optionId: string, points: number) =>
      post<{ success: boolean; pointsRedeemed: number; remainingPoints: number }>('/rewards/redeem', { optionId, points }),
  },
};

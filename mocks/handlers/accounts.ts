import { http, HttpResponse } from 'msw';
import type { Account } from '@/types/account';

const accounts: Account[] = [
  {
    id: 'acc-001',
    type: 'savings',
    accountNumber: 'NOVA0012345678',
    name: 'NovaBank Savings Account',
    balance: 245680.50,
    availableBalance: 244180.50,
    currency: 'INR',
    ifsc: 'NOVA0001234',
    branch: 'Koramangala, Bengaluru',
  },
  {
    id: 'acc-002',
    type: 'fixed_deposit',
    accountNumber: 'FD20240012',
    name: 'Fixed Deposit — 8.5% p.a.',
    principal: 500000,
    interestRate: 8.5,
    tenure: 24,
    tenureElapsed: 11,
    maturityDate: '2026-01-15',
    maturityAmount: 590250,
    currency: 'INR',
  },
  {
    id: 'acc-003',
    type: 'home_loan',
    accountNumber: 'HL20210056',
    name: 'Home Loan',
    principalAmount: 4500000,
    outstandingAmount: 3820400,
    interestRate: 8.75,
    tenureMonths: 240,
    elapsedMonths: 48,
    emi: 39840,
    nextEmiDate: '2026-06-05',
    currency: 'INR',
  },
];

export const accountHandlers = [
  http.get('/api/accounts', () => HttpResponse.json(accounts)),
  http.get('/api/accounts/:id', ({ params }) => {
    const account = accounts.find(a => a.id === params.id);
    if (!account) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(account);
  }),
];

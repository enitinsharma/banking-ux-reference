import { http, HttpResponse } from 'msw';
import type { Transaction } from '@/types/transaction';

const transactions: Transaction[] = [
  { id: 'txn-001', accountId: 'acc-001', type: 'credit', amount: 85000, currency: 'INR', description: 'Salary — Horizon Technologies Pvt Ltd', category: 'salary', date: '2026-05-01', reference: 'NEFT2605011234', balance: 245680.50 },
  { id: 'txn-002', accountId: 'acc-001', type: 'debit', amount: 3240, currency: 'INR', description: 'Amazon.in', category: 'shopping', date: '2026-05-02', reference: 'UPI2605023456' },
  { id: 'txn-003', accountId: 'acc-001', type: 'debit', amount: 580, currency: 'INR', description: 'Swiggy', category: 'food', date: '2026-05-03', reference: 'UPI2605034567' },
  { id: 'txn-004', accountId: 'acc-001', type: 'debit', amount: 2450, currency: 'INR', description: 'BESCOM Electricity', category: 'utilities', date: '2026-05-04', reference: 'BBPS2605045678' },
  { id: 'txn-005', accountId: 'acc-001', type: 'debit', amount: 10000, currency: 'INR', description: 'ATM Withdrawal — Koramangala', category: 'cash', date: '2026-05-05' },
  { id: 'txn-006', accountId: 'acc-001', type: 'debit', amount: 649, currency: 'INR', description: 'Netflix India', category: 'entertainment', date: '2026-05-06', reference: 'UPI2605066789' },
  { id: 'txn-007', accountId: 'acc-001', type: 'debit', amount: 25000, currency: 'INR', description: 'NEFT — Rajesh Kumar', category: 'transfer', date: '2026-05-07', reference: 'NEFT2605077890' },
  { id: 'txn-008', accountId: 'acc-001', type: 'credit', amount: 4200, currency: 'INR', description: 'Dividend — Infosys Ltd', category: 'investment', date: '2026-05-08', reference: 'NEFT2605088901' },
  { id: 'txn-009', accountId: 'acc-001', type: 'debit', amount: 999, currency: 'INR', description: 'Airtel Broadband', category: 'telecom', date: '2026-05-09', reference: 'BBPS2605099012' },
  { id: 'txn-010', accountId: 'acc-001', type: 'debit', amount: 1890, currency: 'INR', description: 'BigBasket Grocery', category: 'food', date: '2026-05-10', reference: 'UPI2605100123' },
  { id: 'txn-011', accountId: 'acc-001', type: 'debit', amount: 39840, currency: 'INR', description: 'Home Loan EMI — HL20210056', category: 'transfer', date: '2026-05-01', reference: 'ACH2605011111' },
  { id: 'txn-012', accountId: 'acc-001', type: 'credit', amount: 12500, currency: 'INR', description: 'Reimbursement — Travel Expenses', category: 'other', date: '2026-04-28', reference: 'NEFT2604281212' },
];

export const transactionHandlers = [
  http.get('/api/transactions', ({ request }) => {
    const url = new URL(request.url);
    const accountId = url.searchParams.get('accountId');
    const limit = url.searchParams.get('limit');
    let result = accountId ? transactions.filter(t => t.accountId === accountId) : transactions;
    if (limit) result = result.slice(0, parseInt(limit, 10));
    return HttpResponse.json(result);
  }),
];

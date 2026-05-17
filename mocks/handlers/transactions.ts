import { http, HttpResponse } from 'msw';
import type { Transaction } from '@/types/transaction';
import { currentMonthDay, daysAgo } from '../dateUtils';

// Transactions are anchored to meaningful calendar days so the
// monthly spend calculation always returns realistic data.
const transactions: Transaction[] = [
  // ── Current month ──────────────────────────────────────────
  {
    id: 'txn-001', accountId: 'acc-001', type: 'credit',
    amount: 85000, currency: 'INR',
    description: 'Salary — Horizon Technologies Pvt Ltd',
    category: 'salary', date: currentMonthDay(1),
    reference: 'NEFT001', balance: 245680.50,
  },
  {
    id: 'txn-011', accountId: 'acc-001', type: 'debit',
    amount: 39840, currency: 'INR',
    description: 'Home Loan EMI — HL20210056',
    category: 'transfer', date: currentMonthDay(1),
    reference: 'ACH011',
  },
  {
    id: 'txn-002', accountId: 'acc-001', type: 'debit',
    amount: 3240, currency: 'INR',
    description: 'Amazon.in',
    category: 'shopping', date: currentMonthDay(3),
    reference: 'UPI002',
  },
  {
    id: 'txn-004', accountId: 'acc-001', type: 'debit',
    amount: 2450, currency: 'INR',
    description: 'BESCOM Electricity',
    category: 'utilities', date: currentMonthDay(5),
    reference: 'BBPS004',
  },
  {
    id: 'txn-003', accountId: 'acc-001', type: 'debit',
    amount: 580, currency: 'INR',
    description: 'Swiggy',
    category: 'food', date: currentMonthDay(7),
    reference: 'UPI003',
  },
  {
    id: 'txn-005', accountId: 'acc-001', type: 'debit',
    amount: 10000, currency: 'INR',
    description: 'ATM Withdrawal — Koramangala',
    category: 'cash', date: currentMonthDay(9),
  },
  {
    id: 'txn-006', accountId: 'acc-001', type: 'debit',
    amount: 649, currency: 'INR',
    description: 'Netflix India',
    category: 'entertainment', date: currentMonthDay(11),
    reference: 'UPI006',
  },
  {
    id: 'txn-007', accountId: 'acc-001', type: 'debit',
    amount: 25000, currency: 'INR',
    description: 'NEFT — Rajesh Kumar',
    category: 'transfer', date: currentMonthDay(13),
    reference: 'NEFT007',
  },
  {
    id: 'txn-008', accountId: 'acc-001', type: 'credit',
    amount: 4200, currency: 'INR',
    description: 'Dividend — Infosys Ltd',
    category: 'investment', date: currentMonthDay(15),
    reference: 'NEFT008',
  },
  {
    id: 'txn-009', accountId: 'acc-001', type: 'debit',
    amount: 999, currency: 'INR',
    description: 'Airtel Broadband',
    category: 'telecom', date: currentMonthDay(17),
    reference: 'BBPS009',
  },
  {
    id: 'txn-010', accountId: 'acc-001', type: 'debit',
    amount: 1890, currency: 'INR',
    description: 'BigBasket Grocery',
    category: 'food', date: currentMonthDay(19),
    reference: 'UPI010',
  },
  // ── Previous month ─────────────────────────────────────────
  {
    id: 'txn-012', accountId: 'acc-001', type: 'credit',
    amount: 12500, currency: 'INR',
    description: 'Reimbursement — Travel Expenses',
    category: 'other', date: daysAgo(25),
    reference: 'NEFT012',
  },
];

export const transactionHandlers = [
  http.get('/api/transactions', ({ request }) => {
    const url = new URL(request.url);
    const accountId = url.searchParams.get('accountId');
    const limit = url.searchParams.get('limit');

    // Sort newest first so limit always returns the most recent
    let result = [...transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    if (accountId) result = result.filter(t => t.accountId === accountId);
    if (limit) result = result.slice(0, parseInt(limit, 10));
    return HttpResponse.json(result);
  }),
];

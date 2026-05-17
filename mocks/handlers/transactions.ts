import { http, HttpResponse } from 'msw';
import type { Transaction } from '@/types/transaction';
import { currentMonthDay, daysAgo, pastMonthDay } from '../dateUtils';

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
    description: 'ATM Withdrawal — Sector 14, Gurugram',
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
  // ── Joint account transactions ──────────────────────────────
  {
    id: 'txn-013', accountId: 'acc-007', type: 'debit',
    amount: 4800, currency: 'INR',
    description: 'D-Mart Grocery',
    category: 'food', date: currentMonthDay(6),
    reference: 'UPI013',
  },
  {
    id: 'txn-014', accountId: 'acc-007', type: 'debit',
    amount: 2100, currency: 'INR',
    description: 'Myntra',
    category: 'shopping', date: currentMonthDay(10),
    reference: 'UPI014',
  },
  // ── Previous month ─────────────────────────────────────────
  {
    id: 'txn-012', accountId: 'acc-001', type: 'credit',
    amount: 12500, currency: 'INR',
    description: 'Reimbursement — Travel Expenses',
    category: 'other', date: daysAgo(25),
    reference: 'NEFT012',
  },

  // ── 2 months ago ───────────────────────────────────────────
  { id: 'txn-201', accountId: 'acc-001', type: 'credit',  amount: 85000, currency: 'INR', description: 'Salary — Horizon Technologies Pvt Ltd', category: 'salary',        date: pastMonthDay(2, 1),  reference: 'NEFT201' },
  { id: 'txn-202', accountId: 'acc-001', type: 'debit',   amount: 39840, currency: 'INR', description: 'Home Loan EMI — HL20210056',              category: 'transfer',      date: pastMonthDay(2, 1),  reference: 'ACH202'  },
  { id: 'txn-203', accountId: 'acc-001', type: 'debit',   amount: 2100,  currency: 'INR', description: 'Flipkart',                                category: 'shopping',      date: pastMonthDay(2, 3),  reference: 'UPI203'  },
  { id: 'txn-204', accountId: 'acc-001', type: 'debit',   amount: 2180,  currency: 'INR', description: 'BESCOM Electricity',                      category: 'utilities',     date: pastMonthDay(2, 5),  reference: 'BBPS204' },
  { id: 'txn-205', accountId: 'acc-007', type: 'debit',   amount: 3900,  currency: 'INR', description: 'D-Mart Grocery',                          category: 'food',          date: pastMonthDay(2, 6),  reference: 'UPI205'  },
  { id: 'txn-206', accountId: 'acc-001', type: 'debit',   amount: 890,   currency: 'INR', description: 'Zomato',                                  category: 'food',          date: pastMonthDay(2, 7),  reference: 'UPI206'  },
  { id: 'txn-207', accountId: 'acc-001', type: 'debit',   amount: 8000,  currency: 'INR', description: 'ATM Withdrawal — Sector 14, Gurugram',    category: 'cash',          date: pastMonthDay(2, 9)                        },
  { id: 'txn-208', accountId: 'acc-007', type: 'debit',   amount: 1400,  currency: 'INR', description: 'Ajio',                                    category: 'shopping',      date: pastMonthDay(2, 10), reference: 'UPI208'  },
  { id: 'txn-209', accountId: 'acc-001', type: 'debit',   amount: 649,   currency: 'INR', description: 'Netflix India',                           category: 'entertainment', date: pastMonthDay(2, 11), reference: 'UPI209'  },
  { id: 'txn-210', accountId: 'acc-001', type: 'debit',   amount: 13360, currency: 'INR', description: 'Personal Loan EMI — PL20231089',          category: 'transfer',      date: pastMonthDay(2, 12), reference: 'ACH210'  },
  { id: 'txn-211', accountId: 'acc-001', type: 'debit',   amount: 10000, currency: 'INR', description: 'NEFT — Priya Verma',                      category: 'transfer',      date: pastMonthDay(2, 13), reference: 'NEFT211' },
  { id: 'txn-212', accountId: 'acc-001', type: 'credit',  amount: 3800,  currency: 'INR', description: 'Dividend — TCS Ltd',                      category: 'investment',    date: pastMonthDay(2, 15), reference: 'NEFT212' },
  { id: 'txn-213', accountId: 'acc-001', type: 'debit',   amount: 999,   currency: 'INR', description: 'Airtel Broadband',                        category: 'telecom',       date: pastMonthDay(2, 17), reference: 'BBPS213' },
  { id: 'txn-214', accountId: 'acc-001', type: 'debit',   amount: 2450,  currency: 'INR', description: 'BigBasket Grocery',                       category: 'food',          date: pastMonthDay(2, 19), reference: 'UPI214'  },
  { id: 'txn-215', accountId: 'acc-001', type: 'debit',   amount: 1200,  currency: 'INR', description: 'Zomato',                                  category: 'food',          date: pastMonthDay(2, 22), reference: 'UPI215'  },
  { id: 'txn-216', accountId: 'acc-001', type: 'debit',   amount: 4200,  currency: 'INR', description: 'HDFC ERGO Health Insurance',              category: 'insurance',     date: pastMonthDay(2, 28), reference: 'NACH216' },

  // ── 3 months ago ───────────────────────────────────────────
  { id: 'txn-301', accountId: 'acc-001', type: 'credit',  amount: 85000, currency: 'INR', description: 'Salary — Horizon Technologies Pvt Ltd', category: 'salary',        date: pastMonthDay(3, 1),  reference: 'NEFT301' },
  { id: 'txn-302', accountId: 'acc-001', type: 'debit',   amount: 39840, currency: 'INR', description: 'Home Loan EMI — HL20210056',              category: 'transfer',      date: pastMonthDay(3, 1),  reference: 'ACH302'  },
  { id: 'txn-303', accountId: 'acc-001', type: 'debit',   amount: 2890,  currency: 'INR', description: 'Amazon.in',                               category: 'shopping',      date: pastMonthDay(3, 3),  reference: 'UPI303'  },
  { id: 'txn-304', accountId: 'acc-001', type: 'debit',   amount: 2340,  currency: 'INR', description: 'BESCOM Electricity',                      category: 'utilities',     date: pastMonthDay(3, 5),  reference: 'BBPS304' },
  { id: 'txn-305', accountId: 'acc-007', type: 'debit',   amount: 3600,  currency: 'INR', description: 'D-Mart Grocery',                          category: 'food',          date: pastMonthDay(3, 6),  reference: 'UPI305'  },
  { id: 'txn-306', accountId: 'acc-001', type: 'debit',   amount: 560,   currency: 'INR', description: 'Swiggy',                                  category: 'food',          date: pastMonthDay(3, 7),  reference: 'UPI306'  },
  { id: 'txn-307', accountId: 'acc-001', type: 'debit',   amount: 8000,  currency: 'INR', description: 'ATM Withdrawal — Sector 14, Gurugram',    category: 'cash',          date: pastMonthDay(3, 9)                        },
  { id: 'txn-308', accountId: 'acc-007', type: 'debit',   amount: 1200,  currency: 'INR', description: 'Nykaa',                                   category: 'shopping',      date: pastMonthDay(3, 10), reference: 'UPI308'  },
  { id: 'txn-309', accountId: 'acc-001', type: 'debit',   amount: 649,   currency: 'INR', description: 'Netflix India',                           category: 'entertainment', date: pastMonthDay(3, 11), reference: 'UPI309'  },
  { id: 'txn-310', accountId: 'acc-001', type: 'debit',   amount: 13360, currency: 'INR', description: 'Personal Loan EMI — PL20231089',          category: 'transfer',      date: pastMonthDay(3, 12), reference: 'ACH310'  },
  { id: 'txn-311', accountId: 'acc-001', type: 'debit',   amount: 999,   currency: 'INR', description: 'Airtel Broadband',                        category: 'telecom',       date: pastMonthDay(3, 17), reference: 'BBPS311' },
  { id: 'txn-312', accountId: 'acc-001', type: 'debit',   amount: 1890,  currency: 'INR', description: 'BigBasket Grocery',                       category: 'food',          date: pastMonthDay(3, 18), reference: 'UPI312'  },
  { id: 'txn-313', accountId: 'acc-001', type: 'debit',   amount: 3200,  currency: 'INR', description: 'Amazon.in',                               category: 'shopping',      date: pastMonthDay(3, 22), reference: 'UPI313'  },
  { id: 'txn-314', accountId: 'acc-001', type: 'debit',   amount: 5000,  currency: 'INR', description: 'NEFT — Amit Kumar',                       category: 'transfer',      date: pastMonthDay(3, 25), reference: 'NEFT314' },
  { id: 'txn-315', accountId: 'acc-001', type: 'debit',   amount: 8500,  currency: 'INR', description: 'LIC Premium',                             category: 'insurance',     date: pastMonthDay(3, 28), reference: 'NACH315' },
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

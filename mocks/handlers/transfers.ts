import { http, HttpResponse } from 'msw';
import type { Beneficiary, RecurringTransfer, TransferResult } from '@/types/transfer';
import { nextMonthDay } from '../dateUtils';

const beneficiaries: Beneficiary[] = [
  { id: 'ben-001', name: 'Rajesh Kumar',     accountNumber: '50100345678901', ifsc: 'HDFC0001234', bank: 'HDFC Bank',  nickname: 'Rajesh' },
  { id: 'ben-002', name: 'Priya Sharma',     upiId: 'priya@okaxis',           bank: 'Axis Bank',   nickname: 'Priya' },
  { id: 'ben-003', name: 'Mehta Brothers',   accountNumber: '20198765432100', ifsc: 'ICIC0005678', bank: 'ICICI Bank' },
  { id: 'ben-004', name: 'Sunita Narayanan', upiId: 'sunita.n@ybl',           bank: 'Yes Bank',    nickname: 'Sunita' },
];

const recurringTransfers: RecurringTransfer[] = [
  {
    id: 'rec-001', beneficiaryId: 'ben-001', amount: 5000,
    frequency: 'monthly', nextDate: nextMonthDay(1),
    active: true, remarks: 'Monthly allowance',
  },
  {
    id: 'rec-002', beneficiaryId: 'ben-004', amount: 2000,
    frequency: 'monthly', nextDate: nextMonthDay(15),
    active: false, remarks: 'Rent contribution',
  },
];

export const transferHandlers = [
  http.get('/api/beneficiaries', () => HttpResponse.json(beneficiaries)),

  http.get('/api/transfers/recurring', () => HttpResponse.json(recurringTransfers)),

  http.post('/api/transfers', async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    const result: TransferResult = {
      transactionId: `TXN${Date.now()}`,
      status: 'success',
      timestamp: new Date().toISOString(),
      amount: body.amount as number,
    };
    return HttpResponse.json(result, { status: 201 });
  }),

  http.patch('/api/transfers/recurring/:id', async ({ params, request }) => {
    const body = await request.json() as Partial<RecurringTransfer>;
    const transfer = recurringTransfers.find(r => r.id === params.id);
    if (!transfer) return new HttpResponse(null, { status: 404 });
    Object.assign(transfer, body);
    return HttpResponse.json(transfer);
  }),
];

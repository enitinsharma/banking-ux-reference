import { http, HttpResponse } from 'msw';
import type { ServiceRequest } from '@/types/request';
import { isoDaysAgo } from '../dateUtils';

const requests: ServiceRequest[] = [
  {
    id: 'req-001',
    type: 'cheque_book',
    status: 'in_progress',
    submittedAt: isoDaysAgo(13),
    updatedAt: isoDaysAgo(12),
    steps: [
      { label: 'Request submitted',  status: 'done',   timestamp: isoDaysAgo(13) },
      { label: 'Under review',       status: 'done',   timestamp: isoDaysAgo(12) },
      { label: 'Dispatch in progress', status: 'active' },
      { label: 'Out for delivery',   status: 'pending' },
      { label: 'Delivered',          status: 'pending' },
    ],
    details: { leaves: '25', address: 'Registered address' },
  },
];

export const requestHandlers = [
  http.get('/api/service-requests', () => HttpResponse.json(requests)),

  http.post('/api/service-requests', async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    const newRequest: ServiceRequest = {
      id: `req-${Date.now()}`,
      type: body.type as ServiceRequest['type'],
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      steps: [
        { label: 'Request submitted', status: 'done',    timestamp: new Date().toISOString() },
        { label: 'Under review',      status: 'active' },
        { label: 'Processing',        status: 'pending' },
        { label: 'Completed',         status: 'pending' },
      ],
      details: body.details as Record<string, string> | undefined,
    };
    requests.push(newRequest);
    return HttpResponse.json(newRequest, { status: 201 });
  }),

  http.post('/api/callback', async ({ request }) => {
    await request.json();
    return HttpResponse.json({ success: true, ticketId: `CB${Date.now()}` }, { status: 201 });
  }),
];

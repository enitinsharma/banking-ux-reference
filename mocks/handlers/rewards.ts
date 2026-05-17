import { http, HttpResponse } from 'msw';
import type { RewardsSummary, PointsHistoryEntry, RedemptionOption } from '@/types/rewards';
import { currentMonthDay, daysAgo } from '../dateUtils';

const summary: RewardsSummary = {
  points: 12450,
  tier: 'Gold',
  nextTier: 'Platinum',
  pointsToNextTier: 2550,
  tierThreshold: 15000,
  conversionRate: 1,
};

const history: PointsHistoryEntry[] = [
  { id: 'pts-001', description: 'Amazon.in purchase',      points: 32,    type: 'earned',   date: currentMonthDay(3),  transactionId: 'txn-002' },
  { id: 'pts-002', description: 'Salary credit bonus',     points: 850,   type: 'earned',   date: currentMonthDay(1),  transactionId: 'txn-001' },
  { id: 'pts-003', description: 'Cashback redemption',     points: -500,  type: 'redeemed', date: daysAgo(15) },
  { id: 'pts-004', description: 'BigBasket purchase',      points: 19,    type: 'earned',   date: currentMonthDay(19), transactionId: 'txn-010' },
  { id: 'pts-005', description: 'Birthday bonus',          points: 200,   type: 'earned',   date: daysAgo(30) },
  { id: 'pts-006', description: 'Travel voucher redemption', points: -1000, type: 'redeemed', date: daysAgo(45) },
];

const redemptionOptions: RedemptionOption[] = [
  { id: 'red-001', label: 'Cashback to account',      description: 'Redeem as cashback. 1 pt = ₹1',          minPoints: 500,  category: 'cashback' },
  { id: 'red-002', label: 'Amazon Gift Voucher',       description: 'Get Amazon.in vouchers. 1 pt = ₹1',      minPoints: 1000, category: 'voucher' },
  { id: 'red-003', label: 'MakeMyTrip Travel Credit',  description: 'Apply points to flights & hotels',        minPoints: 2000, category: 'travel' },
  { id: 'red-004', label: 'Donate to charity',         description: 'Donate to NovaBank Foundation',          minPoints: 100,  category: 'donation' },
];

export const rewardsHandlers = [
  http.get('/api/rewards', () => HttpResponse.json({ summary, redemptionOptions })),
  http.get('/api/rewards/history', () => HttpResponse.json(history)),
  http.post('/api/rewards/redeem', async ({ request }) => {
    const body = await request.json() as { optionId: string; points: number };
    summary.points -= body.points;
    return HttpResponse.json({
      success: true,
      pointsRedeemed: body.points,
      remainingPoints: summary.points,
    });
  }),
];

export type RewardsTier = 'Silver' | 'Gold' | 'Platinum' | 'Elite';

export interface RewardsSummary {
  points: number;
  tier: RewardsTier;
  nextTier: RewardsTier | null;
  pointsToNextTier: number;
  tierThreshold: number;
  conversionRate: number;
}

export interface PointsHistoryEntry {
  id: string;
  description: string;
  points: number;
  type: 'earned' | 'redeemed';
  date: string;
  transactionId?: string;
}

export interface RedemptionOption {
  id: string;
  label: string;
  description: string;
  minPoints: number;
  category: 'cashback' | 'voucher' | 'travel' | 'donation';
}

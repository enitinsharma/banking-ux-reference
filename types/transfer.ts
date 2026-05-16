export type TransferMode = 'neft' | 'rtgs' | 'imps' | 'upi';
export type TransferFrequency = 'weekly' | 'monthly' | 'quarterly';

export interface Beneficiary {
  id: string;
  name: string;
  accountNumber?: string;
  ifsc?: string;
  upiId?: string;
  bank: string;
  nickname?: string;
}

export interface TransferPayload {
  fromAccountId: string;
  beneficiaryId: string;
  amount: number;
  mode: TransferMode;
  remarks?: string;
  scheduleDate?: string;
}

export interface RecurringTransfer {
  id: string;
  beneficiaryId: string;
  amount: number;
  frequency: TransferFrequency;
  nextDate: string;
  active: boolean;
  remarks?: string;
}

export interface TransferResult {
  transactionId: string;
  status: 'success' | 'pending' | 'failed';
  timestamp: string;
  amount: number;
}

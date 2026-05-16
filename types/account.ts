export interface SavingsAccount {
  id: string;
  type: 'savings';
  accountNumber: string;
  name: string;
  balance: number;
  availableBalance: number;
  currency: string;
  ifsc: string;
  branch: string;
}

export interface FixedDepositAccount {
  id: string;
  type: 'fixed_deposit';
  accountNumber: string;
  name: string;
  principal: number;
  interestRate: number;
  tenure: number;
  tenureElapsed: number;
  maturityDate: string;
  maturityAmount: number;
  currency: string;
}

export interface HomeLoanAccount {
  id: string;
  type: 'home_loan';
  accountNumber: string;
  name: string;
  principalAmount: number;
  outstandingAmount: number;
  interestRate: number;
  tenureMonths: number;
  elapsedMonths: number;
  emi: number;
  nextEmiDate: string;
  currency: string;
}

export type Account = SavingsAccount | FixedDepositAccount | HomeLoanAccount;

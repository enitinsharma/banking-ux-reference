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
  /** Annual interest rate on the savings balance */
  interestRate: number;
  /** Whether this is a joint account */
  isJoint?: boolean;
  /** Full name of the joint account holder */
  jointHolderName?: string;
  /** Amount withheld from available balance, if any */
  holdAmount?: number;
  /** Human-readable reason for the hold, e.g. "UPI payment pending" */
  holdReason?: string;
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
  startDate: string;
  maturityDate: string;
  maturityAmount: number;
  currency: string;
  /** How interest is paid out during the FD term */
  payoutFrequency: 'monthly' | 'quarterly' | 'on_maturity';
  /** Whether the FD automatically renews at maturity for the same tenure */
  autoRenew?: boolean;
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

export interface PersonalLoanAccount {
  id: string;
  type: 'personal_loan';
  accountNumber: string;
  name: string;
  purpose: string;
  sanctionedAmount: number;
  outstandingAmount: number;
  interestRate: number;
  tenureMonths: number;
  elapsedMonths: number;
  emi: number;
  nextEmiDate: string;
  currency: string;
}

export type Account = SavingsAccount | FixedDepositAccount | HomeLoanAccount | PersonalLoanAccount;

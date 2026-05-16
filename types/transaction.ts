export type TransactionType = 'credit' | 'debit';

export type TransactionCategory =
  | 'salary'
  | 'shopping'
  | 'food'
  | 'utilities'
  | 'cash'
  | 'entertainment'
  | 'transfer'
  | 'investment'
  | 'telecom'
  | 'insurance'
  | 'other';

export interface Transaction {
  id: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  description: string;
  category: TransactionCategory;
  date: string;
  reference?: string;
  balance?: number;
}

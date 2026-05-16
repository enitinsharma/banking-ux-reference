export type RequestType =
  | 'cheque_book'
  | 'stop_payment'
  | 'tax_certificate'
  | 'interest_certificate'
  | 'nomination_update'
  | 'contact_update'
  | 'debit_card_replacement';

export type RequestStatus = 'submitted' | 'in_progress' | 'completed' | 'rejected';

export interface RequestStep {
  label: string;
  status: 'done' | 'active' | 'pending';
  timestamp?: string;
}

export interface ServiceRequest {
  id: string;
  type: RequestType;
  status: RequestStatus;
  submittedAt: string;
  updatedAt: string;
  steps: RequestStep[];
  details?: Record<string, string>;
}

export interface CallbackRequest {
  timeSlot: string;
  subject: string;
  language: string;
}

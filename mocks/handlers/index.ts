import { accountHandlers } from './accounts';
import { transactionHandlers } from './transactions';
import { transferHandlers } from './transfers';
import { requestHandlers } from './requests';
import { rewardsHandlers } from './rewards';

export const handlers = [
  ...accountHandlers,
  ...transactionHandlers,
  ...transferHandlers,
  ...requestHandlers,
  ...rewardsHandlers,
];

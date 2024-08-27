export interface TransactionEvent {
  accountId: string;
  currency: string;
  amount: number;
  type: 'INBOUND' | 'OUTBOUND';
  transactionId: string;
  date: Date;
}

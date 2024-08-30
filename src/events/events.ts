export enum Events {
  AccountCreated = 'AccountCreated',
  TransactionCreated = 'TransactionCreated',
  AccountUpdated = 'AccountUpdated',
}

export enum TransactionType {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND'
}

export interface TransactionEvent {
  accountId: string;
  currency: string;
  amount: number;
  type: TransactionType;
  transactionId: string;
  date: Date;
}

export interface AccountEvent {
  id: string
  customerId: string
  currencies: string[]
  balances: Map<string, number>
  date: Date
}

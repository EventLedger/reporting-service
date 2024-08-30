export enum TransactionType {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND',
}

export interface TransactionEvent {
  accountId: string
  currency: string
  amount: number
  type: TransactionType
  transactionId: string
  date: Date
}

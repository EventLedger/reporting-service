import { Schema, Document, model, Model } from 'mongoose'

import { TransactionType } from '../events/transactionEvent'

export interface ICurrencyStatement {
  currency: string
  transactions: {
    type: 'INBOUND' | 'OUTBOUND'
    amount: number
    date: Date
  }[]
  closingBalance: number
  isSupported?: boolean
}

export interface IStatement extends Document {
  accountId: string
  month: number
  year: number
  currencies: ICurrencyStatement[]
}

const CurrencyStatementSchema = new Schema<ICurrencyStatement>({
  currency: { type: String, required: true },
  transactions: [
    {
      type: {
        type: String,
        enum: [TransactionType.INBOUND, TransactionType.OUTBOUND],
        required: true,
      },
      amount: { type: Number, required: true },
      date: { type: Date, required: true },
    },
  ],
  closingBalance: { type: Number, required: true },
  isSupported: { type: Boolean, default: true },
})

const StatementSchema = new Schema<IStatement>({
  accountId: { type: String, required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  currencies: { type: [CurrencyStatementSchema], required: true },
})

export const Statement: Model<IStatement> = model<IStatement>(
  'Statement',
  StatementSchema,
)

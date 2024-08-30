import { Schema, Document, model, Model } from 'mongoose'

import { TransactionType } from '../events/events'

export interface ICurrencyStatement {
  currency: string
  transactions: {
    type: 'INBOUND' | 'OUTBOUND'
    amount: number
    date: Date
  }[]
  closingBalance: number
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

import { Model } from 'mongoose'

import { IStatement } from '../models/statement'
import { TransactionEvent } from '../events/transactionEvent'
import { getMonthYearFromDate } from '../utils/dateUtils'
import { NotFoundException } from '../utils/exceptions'

export class ReportingService {
  private statementModel: Model<IStatement>

  constructor(statementModel: Model<IStatement>) {
    this.statementModel = statementModel
  }

  async processTransactionEvent(event: TransactionEvent): Promise<void> {
    const { accountId, currency, amount, type, date } = event
    const { month, year } = getMonthYearFromDate(date)
    
    let statement = await this.statementModel.findOne({ accountId, month, year }).exec()
    if (!statement) {
      statement = new this.statementModel({
        accountId,
        month,
        year,
        currencies: [],
      })
    }
    
    let currencyStatement = statement.currencies.find(
      (cs) => cs.currency === currency,
    )
    if (!currencyStatement) {
      currencyStatement = {
        currency,
        transactions: [],
        closingBalance: 0,
      }
      statement.currencies.push(currencyStatement)
    }
    
    const currencyStatementIndex = statement.currencies.findIndex(
      (cs) => cs.currency === currency,
    )
    const previousClosingBalance = currencyStatement.closingBalance || 0

    if (type === 'INBOUND') {
      currencyStatement.closingBalance = previousClosingBalance + amount
    } else if (type === 'OUTBOUND') {
      currencyStatement.closingBalance = previousClosingBalance - amount
    }

    currencyStatement.transactions.push({ type, amount, date })

    statement.currencies[currencyStatementIndex] = currencyStatement

    await statement.save()
  }

  async getMonthlyStatements(
    accountId: string,
    year: number,
    month: number,
  ): Promise<IStatement> {    
    const statement = await this.statementModel.findOne({ accountId, year, month }).exec()

    if(!statement) {
      throw new NotFoundException('Statement not found')
    }

    return statement
  }
}
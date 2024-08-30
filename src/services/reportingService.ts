import { Model } from 'mongoose'
import { IStatement } from '../models/statement'
import {
  AccountEvent,
  TransactionEvent,
  TransactionType,
} from '../events/events'
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

    let statement = await this.getOrCreateStatement(accountId, month, year)
    let currencyStatement = this.getOrCreateCurrencyStatement(
      statement,
      currency,
    )
    
    const currencyStatementIndex = statement.currencies.findIndex(
      (cs) => cs.currency === currency,
    )
    this.updateCurrencyStatement(currencyStatement, amount, type, date)
    statement.currencies[currencyStatementIndex] = currencyStatement
    await statement.save()
  }

  async processAccountEvent(event: AccountEvent): Promise<void> {
    const { id: accountId, currencies, balances, date } = event
    const { month, year } = getMonthYearFromDate(date)
    
    let statement = await this.getOrCreateStatement(accountId, month, year)
    currencies.forEach(currency => {
      let currencyStatement = this.getOrCreateCurrencyStatement(statement, currency)
      currencyStatement.closingBalance = balances[currency] || 0
  
      const currencyStatementIndex = statement.currencies.findIndex(
        (cs) => cs.currency === currency,
      )

      statement.currencies[currencyStatementIndex] = currencyStatement
    })
    console.log("GO 10")
    await statement.save()
  }
  

  async getMonthlyStatements(
    accountId: string,
    year: number,
    month: number,
  ): Promise<IStatement> {
    const statement = await this.statementModel
      .findOne({ accountId, year, month })
      .exec()

    if (!statement) {
      throw new NotFoundException('Statement not found')
    }

    return statement
  }

  private async getOrCreateStatement(
    accountId: string,
    month: number,
    year: number,
  ): Promise<IStatement> {
    let statement = await this.statementModel
      .findOne({ accountId, month, year })
      .exec()
    if (!statement) {
      statement = new this.statementModel({
        accountId,
        month,
        year,
        currencies: [],
      })
    }
    return statement
  }

  private getOrCreateCurrencyStatement(
    statement: IStatement,
    currency: string,
  ) {
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
    return currencyStatement
  }

  private updateCurrencyStatement(
    currencyStatement: IStatement['currencies'][0],
    amount: number,
    type: TransactionType,
    date: Date,
  ) {
    const previousClosingBalance = currencyStatement.closingBalance || 0

    if (type === TransactionType.INBOUND) {
      currencyStatement.closingBalance = previousClosingBalance + amount
    } else if (type === TransactionType.OUTBOUND) {
      currencyStatement.closingBalance = previousClosingBalance - amount
    }

    currencyStatement.transactions.push({ type, amount, date })
  }
}

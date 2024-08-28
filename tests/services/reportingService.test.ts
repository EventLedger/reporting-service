import mongoose from 'mongoose'

import { Statement } from '../../src/models/statement'
import { TransactionEvent } from '../../src/events/transactionEvent'
import { ReportingService } from '../../src/services/reportingService'
import { NotFoundException } from '../../src/utils/exceptions'

describe('ReportingService', () => {
  let reportingService: ReportingService

  beforeAll(async () => {
    reportingService = new ReportingService(Statement)
  })

  afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.disconnect()
  })

  afterEach(async () => {
    const collections = mongoose.connection.collections
    for (const key in collections) {
      await collections[key].deleteMany({})
    }
  })

  describe('processTransactionEvent', () => {
    it('should create a new statement and currency statement when none exist', async () => {
      const event: TransactionEvent = {
        transactionId: '98765',
        accountId: '123456',
        currency: 'USD',
        amount: 100,
        type: 'INBOUND',
        date: new Date('2024-08-28T12:00:00Z'),
      }

      await reportingService.processTransactionEvent(event)

      const statement = await Statement.findOne({ accountId: '123456', month: 8, year: 2024 }).exec()

      expect(statement).not.toBeNull()
      expect(statement!.currencies.length).toBe(1)
      expect(statement!.currencies[0].currency).toBe('USD')
      expect(statement!.currencies[0].transactions.length).toBe(1)
      expect(statement!.currencies[0].transactions[0].amount).toBe(100)
      expect(statement!.currencies[0].closingBalance).toBe(100)
    })

    it('should update an existing statement and currency statement', async () => {
      const statement = new Statement({
        accountId: '123456',
        month: 8,
        year: 2024,
        currencies: [
          {
            currency: 'USD',
            transactions: [],
            openingBalance: 0,
            closingBalance: 50,
          },
        ],
      })
      await statement.save()

      const event: TransactionEvent = {
        transactionId: '98765',
        accountId: '123456',
        currency: 'USD',
        amount: 50,
        type: 'INBOUND',
        date: new Date('2024-08-28T12:00:00Z'),
      }

      await reportingService.processTransactionEvent(event)

      const updatedStatement = await Statement.findOne({ accountId: '123456', month: 8, year: 2024 }).exec()

      expect(updatedStatement).not.toBeNull()
      expect(updatedStatement!.currencies[0].transactions.length).toBe(1)
      expect(updatedStatement!.currencies[0].transactions[0].amount).toBe(50)
      expect(updatedStatement!.currencies[0].closingBalance).toBe(100)
    })

    it('should create a new currency statement if none exists for the currency', async () => {
      const statement = new Statement({
        accountId: '123456',
        month: 8,
        year: 2024,
        currencies: [
          {
            currency: 'EUR',
            transactions: [],
            openingBalance: 0,
            closingBalance: 0,
          },
        ],
      })
      await statement.save()

      const event: TransactionEvent = {
        transactionId: '98765',
        accountId: '123456',
        currency: 'USD',
        amount: 100,
        type: 'INBOUND',
        date: new Date('2024-08-28T12:00:00Z'),
      }

      await reportingService.processTransactionEvent(event)

      const updatedStatement = await Statement.findOne({ accountId: '123456', month: 8, year: 2024 }).exec()

      expect(updatedStatement).not.toBeNull()
      expect(updatedStatement!.currencies.length).toBe(2)
      const usdCurrency = updatedStatement!.currencies.find(cs => cs.currency === 'USD')
      expect(usdCurrency).not.toBeUndefined()
      expect(usdCurrency!.transactions.length).toBe(1)
      expect(usdCurrency!.closingBalance).toBe(100)
    })
  })

  describe('getMonthlyStatements', () => {
    it('should return the correct statement for the given account, month, and year', async () => {
      const statement = new Statement({
        accountId: '123456',
        month: 8,
        year: 2024,
        currencies: [],
      })
      await statement.save()

      const result = await reportingService.getMonthlyStatements('123456', 2024, 8)

      expect(result).not.toBeNull()
      expect(result!.accountId).toBe('123456')
    })
  })
})

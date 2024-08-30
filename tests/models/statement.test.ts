import mongoose from 'mongoose'

import { Statement, IStatement } from '../../src/models/statement'

describe('Statement Model Test', () => {
  beforeAll(async () => ({}))

  afterAll(async () => {
    await mongoose.connection.dropDatabase()
  })

  afterEach(async () => {
    const collections = mongoose.connection.collections
    for (const key in collections) {
      await collections[key].deleteMany({})
    }
  })

  it('should create and save a statement successfully', async () => {
    const validStatement: IStatement = new Statement({
      accountId: '123456',
      month: 8,
      year: 2024,
      currencies: [
        {
          currency: 'USD',
          transactions: [
            {
              type: 'INBOUND',
              amount: 100,
              date: new Date('2024-08-28T12:00:00Z'),
            },
          ],
          closingBalance: 100,
        },
      ],
    })
    const savedStatement = await validStatement.save()

    expect(savedStatement._id).toBeDefined()
    expect(savedStatement.accountId).toBe(validStatement.accountId)
    expect(savedStatement.currencies[0].currency).toBe('USD')
    expect(savedStatement.currencies[0].transactions[0].amount).toBe(100)
  })

  it('should fail to save a statement without required fields', async () => {
    const invalidStatement = new Statement({
      accountId: '123456',
      // Missing 'month' and 'year' fields
      currencies: [],
    })

    let error
    try {
      await invalidStatement.save()
    } catch (err) {
      error = err
    }

    expect(error).toBeDefined()
    expect(error.name).toBe('ValidationError')
  })

  it('should add a new currency statement to an existing statement', async () => {
    const statement = new Statement({
      accountId: '123456',
      month: 8,
      year: 2024,
      currencies: [
        {
          currency: 'USD',
          transactions: [],
          closingBalance: 0,
        },
      ],
    })
    await statement.save()

    statement.currencies.push({
      currency: 'EUR',
      transactions: [],
      closingBalance: 0,
    })
    const updatedStatement = await statement.save()

    expect(updatedStatement.currencies.length).toBe(2)
    expect(updatedStatement.currencies[1].currency).toBe('EUR')
  })

  it('should update an existing transaction in a currency statement', async () => {
    const statement = new Statement({
      accountId: '123456',
      month: 8,
      year: 2024,
      currencies: [
        {
          currency: 'USD',
          transactions: [
            {
              type: 'INBOUND',
              amount: 100,
              date: new Date('2024-08-28T12:00:00Z'),
            },
          ],
          closingBalance: 100,
        },
      ],
    })
    await statement.save()

    statement.currencies[0].transactions[0].amount = 150
    const updatedStatement = await statement.save()

    expect(updatedStatement.currencies[0].transactions[0].amount).toBe(150)
  })

  it('should delete a statement', async () => {
    const statement = new Statement({
      accountId: '123456',
      month: 8,
      year: 2024,
      currencies: [],
    })
    await statement.save()

    await Statement.findByIdAndDelete(statement._id)
    const deletedStatement = await Statement.findById(statement._id)

    expect(deletedStatement).toBeNull()
  })
})

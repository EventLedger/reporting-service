import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import mongoose from 'mongoose'

import { Statement } from '../../src/models/statement'
import { connectToDatabase } from '../../src/utils/connectToDB'
import { handler } from '../../src/handlers/getMonthlyStatements'

jest.mock('../../src/utils/connectToDB')

describe('getMonthlyStatementsHandler', () => {
  beforeAll(async () => {
    await connectToDatabase()
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

  it('should return a 200 response with the statement when found', async () => {
    const statement = new Statement({
      accountId: '123456',
      month: 8,
      year: 2024,
      currencies: [
        {
          currency: 'USD',
          transactions: [],
          openingBalance: 0,
          closingBalance: 100,
        },
      ],
    })
    await statement.save()

    const event = {
      pathParameters: {
        accountId: '123456',
      },
      queryStringParameters: {
        year: '2024',
        month: '8',
      },
    } as unknown as APIGatewayProxyEvent

    const result: APIGatewayProxyResult = await handler(event)
    const responseBody = JSON.parse(result.body)

    expect(result.statusCode).toBe(200)
    expect(responseBody).toHaveProperty('accountId', '123456')
    expect(responseBody).toHaveProperty('currencies')
    expect(responseBody.currencies[0].currency).toBe('USD')
    expect(responseBody.currencies[0].closingBalance).toBe(100)
  })

  it('should return a 404 response when no statement is found', async () => {
    const event = {
      pathParameters: {
        accountId: 'nonexistent',
      },
      queryStringParameters: {
        year: '2024',
        month: '8',
      },
    } as unknown as APIGatewayProxyEvent

    const result: APIGatewayProxyResult = await handler(event)
    console.log({result})
    expect(result.statusCode).toBe(404)
  })

  it('should return a 400 response when required parameters are missing', async () => {
    const event = {
      pathParameters: {
        accountId: '123456',
      },
      queryStringParameters: {
        year: '2024',
        // month is missing
      },
    } as unknown as APIGatewayProxyEvent

    const result: APIGatewayProxyResult = await handler(event)

    expect(result.statusCode).toBe(400)
  })
})

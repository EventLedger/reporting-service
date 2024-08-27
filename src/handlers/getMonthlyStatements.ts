import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { Statement } from '../models/statement'
import { connectToDatabase } from '../utils/connectToDB'
import { ReportingService } from '../services/reportingService'
import { withErrorHandling } from '../utils/withErrorHandling'

export const getMonthlyStatementsHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  await connectToDatabase()

  const reportingService = new ReportingService(Statement)
  const accountId = event.pathParameters?.accountId
  const year = parseInt(event.queryStringParameters?.year || '', 10)
  const month = parseInt(event.queryStringParameters?.month || '', 10)

  const statement = await reportingService.getMonthlyStatements(
    accountId!,
    year,
    month,
  )
  if (!statement) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: `No statement found for account ${accountId} in ${month}/${year}`,
      }),
    }
  }
  return {
    statusCode: 200,
    body: JSON.stringify(statement),
  }
}

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> =>
  withErrorHandling(() => getMonthlyStatementsHandler(event))()

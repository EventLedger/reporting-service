import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { Statement } from '../models/statement'
import { connectToDatabase } from '../utils/connectToDB'
import { ReportingService } from '../services/reportingService'
import { withErrorHandling } from '../utils/withErrorHandling'
import { BadRequestException } from '../utils/exceptions'

export const getMonthlyStatementsHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  await connectToDatabase()
  const reportingService = new ReportingService(Statement)
  
  const accountId = event.pathParameters?.accountId
  const year = parseInt(event.pathParameters?.year || '', 10)
  const month = parseInt(event.pathParameters?.month || '', 10)
  
  if (!accountId || !year || !month) {
    throw new BadRequestException('Missing required parameters')
  }

  const statement = await reportingService.getMonthlyStatements(
    accountId,
    year,
    month,
  )

  return {
    statusCode: 200,
    body: JSON.stringify(statement),
  }
}

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> =>
  withErrorHandling(() => getMonthlyStatementsHandler(event))()

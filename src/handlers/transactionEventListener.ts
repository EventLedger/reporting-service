import { APIGatewayProxyEvent } from 'aws-lambda'

import { Statement } from '../models/statement'
import { connectToDatabase } from '../utils/connectToDB'
import { TransactionEvent } from '../events/transactionEvent'
import { ReportingService } from '../services/reportingService'

export const handler = async (event: APIGatewayProxyEvent): Promise<void> => {
  await connectToDatabase()
  const reportingService = new ReportingService(Statement)

  for (const record of event.Records) {
    const transactionEvent: TransactionEvent = JSON.parse(record.body)
    await reportingService.processTransactionEvent(transactionEvent)
  }
}

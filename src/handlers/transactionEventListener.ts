import { Statement } from '../models/statement'
import { connectToDatabase } from '../utils/connectToDB'
import { TransactionEvent } from '../events/transactionEvent'
import { ReportingService } from '../services/reportingService'

interface EventBridgeEvent {
  Records: {
    body: string;
  }[];
}

export const handler = async (event: EventBridgeEvent): Promise<void> => {
  await connectToDatabase()
  const reportingService = new ReportingService(Statement)
  // Check if running locally by detecting if it's an API Gateway event or a direct invocation
  const records = event.Records
  console.log({ records });
  for (const record of records) {
    const transactionEvent: TransactionEvent = JSON.parse(record.body)
    
    await reportingService.processTransactionEvent(transactionEvent)
  }
}

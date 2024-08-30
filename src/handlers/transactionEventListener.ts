import { Statement } from '../models/statement'
import { connectToDatabase } from '../utils/connectToDB'
import { ReportingService } from '../services/reportingService'

interface EventBridgeEvent {
  Records: {
    body: string
  }
}

export const handler = async (event: EventBridgeEvent): Promise<void> => {
  await connectToDatabase()
  const reportingService = new ReportingService(Statement)
  const transactionEvent = JSON.stringify(event, null, 2)
  
  try {
    await reportingService.processTransactionEvent(JSON.parse(transactionEvent).detail)
  } catch (e) {
    console.error("Error in processing transaction", e)
  }
}

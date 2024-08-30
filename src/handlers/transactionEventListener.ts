import { Statement } from '../models/statement'
import { connectToDatabase } from '../utils/connectToDB'
import { ReportingService } from '../services/reportingService'
import { TransactionEvent } from '../events/transactionEvent'

interface EventBridgeEvent {
  detail: TransactionEvent
}

export const handler = async (event: EventBridgeEvent): Promise<void> => {
  await connectToDatabase()
  const reportingService = new ReportingService(Statement)
  const eventBridgeEvent = JSON.stringify(event, null, 2)
  const eventDetails = JSON.parse(eventBridgeEvent)['detail']

  try {
    await reportingService.processTransactionEvent(eventDetails)
  } catch (e) {
    console.error('Error in processing event', e)
  }
}

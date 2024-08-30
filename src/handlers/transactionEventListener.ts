import { Statement } from '../models/statement'
import { connectToDatabase } from '../utils/connectToDB'
import { ReportingService } from '../services/reportingService'
import { AccountEvent, Events, TransactionEvent } from '../events/events'

interface EventBridgeEvent {
  'detail-type': Events
  detail: AccountEvent | TransactionEvent
}

export const handler = async (event: EventBridgeEvent): Promise<void> => {
  await connectToDatabase()
  const reportingService = new ReportingService(Statement)
  const eventBridgeEvent = JSON.stringify(event, null, 2)
  const eventDetails = JSON.parse(eventBridgeEvent)['detail']
  console.log({eventDetails})
  try {
    if (event['detail-type'] === Events.TransactionCreated) {
      await reportingService.processTransactionEvent(eventDetails)
    } else if ([Events.AccountCreated, Events.AccountUpdated].includes(event['detail-type'])) {
      await reportingService.processAccountEvent(eventDetails)
    }
  } catch (e) {
    console.error("Error in processing event", e)
  }
}

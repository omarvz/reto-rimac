import { SQSEvent } from 'aws-lambda'
import { CompleteAppointmentUseCase } from '../../application/use-cases/CompleteAppointmentUseCase'
import { AppointmentConfirmation } from '../../domain/value-objects/AppointmentConfirmation'
import { DynamoDBAppointmentRepository } from '../repositories/DynamoDBAppointmentRepository'

export const handler = async (event: SQSEvent): Promise<void> => {
  console.log('Completion Received event:', JSON.stringify(event, null, 2))

  try {
    const repository = new DynamoDBAppointmentRepository()
    const useCase = new CompleteAppointmentUseCase(repository)

    for (const record of event.Records) {
      console.log('Processing record:', JSON.stringify(record, null, 2))

      // Parse the body of the SQS message (EventBridge event)
      const eventBridgeMessage = JSON.parse(record.body)
      console.log(
        'EventBridge message:',
        JSON.stringify(eventBridgeMessage, null, 2)
      )

      // Extract the detail from the EventBridge
      const confirmation: AppointmentConfirmation =
        eventBridgeMessage.detail as AppointmentConfirmation
      console.log('Parsed confirmation:', JSON.stringify(confirmation, null, 2))

      console.log('Calling execute on CompleteAppointmentUseCase...')
      await useCase.execute(confirmation)
      console.log('Appointment completed:', confirmation.appointmentId)
    }
  } catch (error) {
    console.error('Error completing appointments:', error)
    throw error
  }
}

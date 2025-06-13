import { SQSEvent } from 'aws-lambda'
import { ProcessAppointmentUseCase } from '../../application/use-cases/ProcessAppointmentUseCase'
import { CountryISO } from '../../domain/entities/Appointment'
import { AppointmentRequest } from '../../domain/value-objects/AppointmentRequest'
import { MySQLAppointmentRepository } from '../repositories/MySQLAppointmentRepository'
import { AWSNotificationService } from '../services/AWSNotificationService'

export const handler = async (event: SQSEvent): Promise<void> => {
  console.log('CL Lambda received event:', JSON.stringify(event, null, 2))

  try {
    const repository = new MySQLAppointmentRepository(CountryISO.CL)
    const notificationService = new AWSNotificationService()
    const useCase = new ProcessAppointmentUseCase(
      repository,
      notificationService
    )

    for (const record of event.Records) {
      console.log('Processing record:', JSON.stringify(record, null, 2))

      // Parse the body of the SQS message
      const snsMessage = JSON.parse(record.body)

      // Extract the Message from the SNS
      const request = JSON.parse(snsMessage.Message) as AppointmentRequest & {
        id: string
      }
      console.log('Parsed request:', JSON.stringify(request, null, 2))

      console.log('Calling scheduleAppointment...')
      await useCase.execute(request)
      console.log('scheduleAppointment completed')
    }
  } catch (error) {
    console.error('Error in CL handler:', error)
    throw error
  }
}

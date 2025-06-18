import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda'
import { CreateAppointmentUseCase } from '../../application/use-cases/CreateAppointmentUseCase'
import { GetAppointmentsByInsuredIdUseCase } from '../../application/use-cases/GetAppointmentsByInsuredIdUseCase'
import { CountryISO } from '../../domain/entities/Appointment'
import { AppointmentRequest } from '../../domain/value-objects/AppointmentRequest'
import { DynamoDBAppointmentRepository } from '../repositories/DynamoDBAppointmentRepository'
import { AWSNotificationService } from '../services/AWSNotificationService'

const appointmentRepository = new DynamoDBAppointmentRepository()
const notificationService = new AWSNotificationService()

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
) => {
  if (event.httpMethod === 'POST' && event.path === '/appointments') {
    return await handleCreateAppointment(event)
  }

  if (event.httpMethod === 'GET' && event.pathParameters?.insuredId) {
    return await handleGetAppointments(event)
  }

  return {
    statusCode: 404,
    body: JSON.stringify({ message: 'Not found' }),
  }
}

async function handleCreateAppointment(event: APIGatewayProxyEvent) {
  try {
    const body = JSON.parse(event.body || '{}')

    if (!body.insuredId || !body.scheduleId || !body.countryISO) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Missing required fields: insuredId, scheduleId, countryISO',
        }),
      }
    }

    if (!Object.values(CountryISO).includes(body.countryISO)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'countryISO must be PE or CL',
        }),
      }
    }

    const request: AppointmentRequest = {
      insuredId: body.insuredId,
      scheduleId: parseInt(body.scheduleId),
      countryISO: body.countryISO,
    }

    const createUseCase = new CreateAppointmentUseCase(
      appointmentRepository,
      notificationService
    )

    const appointmentId = await createUseCase.execute(request)

    return {
      statusCode: 201,
      body: JSON.stringify({
        id: appointmentId,
        message: 'Appointment created successfully',
      }),
    }
  } catch (error) {
    console.error('Error creating appointment:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal server error',
      }),
    }
  }
}

async function handleGetAppointments(event: APIGatewayProxyEvent) {
  try {
    if (!event.pathParameters?.insuredId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Missing insuredId parameter',
        }),
      }
    }

    const insuredId = event.pathParameters.insuredId

    const getUseCase = new GetAppointmentsByInsuredIdUseCase(
      appointmentRepository
    )
    const appointments = await getUseCase.execute(insuredId)

    return {
      statusCode: 200,
      body: JSON.stringify({
        appointments,
      }),
    }
  } catch (error) {
    console.error('Error getting appointments:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal server error',
      }),
    }
  }
}

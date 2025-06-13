import { v4 as uuidv4 } from 'uuid'
import {
  Appointment,
  AppointmentStatus,
} from '../../domain/entities/Appointment'
import { AppointmentRepository } from '../../domain/repositories/AppointmentRepository'
import { NotificationService } from '../../domain/services/NotificationService'
import { AppointmentRequest } from '../../domain/value-objects/AppointmentRequest'

export class CreateAppointmentUseCase {
  constructor(
    private appointmentRepository: AppointmentRepository,
    private notificationService: NotificationService
  ) {}

  async execute(request: AppointmentRequest): Promise<string> {
    const appointmentId = uuidv4()
    const now = new Date()

    const appointment: Appointment = {
      id: appointmentId,
      insuredId: request.insuredId,
      scheduleId: request.scheduleId,
      countryISO: request.countryISO,
      status: AppointmentStatus.PENDING,
      createdAt: now,
      updatedAt: now,
    }

    await this.appointmentRepository.save(appointment)

    await this.notificationService.publishAppointmentRequest({
      ...request,
      id: appointmentId,
    })

    return appointmentId
  }
}

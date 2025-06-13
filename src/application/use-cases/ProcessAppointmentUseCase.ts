import { MedicalSystemRepository } from '../../domain/repositories/MedicalSystemRepository'
import { NotificationService } from '../../domain/services/NotificationService'
import { AppointmentConfirmation } from '../../domain/value-objects/AppointmentConfirmation'
import { AppointmentRequest } from '../../domain/value-objects/AppointmentRequest'

export class ProcessAppointmentUseCase {
  constructor(
    private medicalSystemRepository: MedicalSystemRepository,
    private notificationService: NotificationService
  ) {}

  async execute(request: AppointmentRequest & { id: string }): Promise<void> {
    try {
      await this.medicalSystemRepository.saveAppointment(request)

      console.log(
        `Appointment saved successfully for insuredId: ${request.insuredId}, scheduleId: ${request.scheduleId}, countryISO: ${request.countryISO}`
      )

      const confirmation: AppointmentConfirmation = {
        appointmentId: request.id,
        insuredId: request.insuredId,
        scheduleId: request.scheduleId,
        countryISO: request.countryISO,
        status: 'confirmed',
      }

      await this.notificationService.publishAppointmentConfirmation(
        confirmation
      )
    } catch (error) {
      const confirmation: AppointmentConfirmation = {
        appointmentId: request.id,
        insuredId: request.insuredId,
        scheduleId: request.scheduleId,
        countryISO: request.countryISO,
        status: 'failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      }

      await this.notificationService.publishAppointmentConfirmation(
        confirmation
      )
    }
  }
}

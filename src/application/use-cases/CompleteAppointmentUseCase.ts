import { AppointmentStatus } from '../../domain/entities/Appointment'
import { AppointmentRepository } from '../../domain/repositories/AppointmentRepository'
import { AppointmentConfirmation } from '../../domain/value-objects/AppointmentConfirmation'

export class CompleteAppointmentUseCase {
  constructor(private appointmentRepository: AppointmentRepository) {}

  async execute(confirmation: AppointmentConfirmation): Promise<void> {
    const status =
      confirmation.status === 'confirmed'
        ? AppointmentStatus.COMPLETED
        : AppointmentStatus.FAILED

    await this.appointmentRepository.updateStatus(
      confirmation.appointmentId,
      status
    )
  }
}

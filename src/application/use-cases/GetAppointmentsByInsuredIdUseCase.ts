import { Appointment } from '../../domain/entities/Appointment'
import { AppointmentRepository } from '../../domain/repositories/AppointmentRepository'

export class GetAppointmentsByInsuredIdUseCase {
  constructor(private appointmentRepository: AppointmentRepository) {}

  async execute(insuredId: string): Promise<Appointment[]> {
    return await this.appointmentRepository.findByInsuredId(insuredId)
  }
}

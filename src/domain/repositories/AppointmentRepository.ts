import { Appointment, AppointmentStatus } from '../entities/Appointment'

export interface AppointmentRepository {
  save(appointment: Appointment): Promise<void>
  findById(id: string): Promise<Appointment | null>
  findByInsuredId(insuredId: string): Promise<Appointment[]>
  updateStatus(id: string, status: AppointmentStatus): Promise<void>
}

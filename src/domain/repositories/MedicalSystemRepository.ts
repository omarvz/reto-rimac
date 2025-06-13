import { AppointmentRequest } from '../value-objects/AppointmentRequest'

export interface MedicalSystemRepository {
  saveAppointment(request: AppointmentRequest): Promise<void>
}

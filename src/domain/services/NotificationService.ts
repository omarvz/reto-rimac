import { AppointmentConfirmation } from '../value-objects/AppointmentConfirmation'
import { AppointmentRequest } from '../value-objects/AppointmentRequest'

export interface NotificationService {
  publishAppointmentRequest(
    request: AppointmentRequest & { id: string }
  ): Promise<void>
  publishAppointmentConfirmation(
    confirmation: AppointmentConfirmation
  ): Promise<void>
}

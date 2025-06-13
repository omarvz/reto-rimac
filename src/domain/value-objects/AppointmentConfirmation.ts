import { CountryISO } from '../entities/Appointment'

export interface AppointmentConfirmation {
  appointmentId: string
  insuredId: string
  scheduleId: number
  countryISO: CountryISO
  status: 'confirmed' | 'failed'
  message?: string
}

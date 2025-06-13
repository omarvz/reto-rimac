import { CountryISO } from '../entities/Appointment'

export interface AppointmentRequest {
  insuredId: string
  scheduleId: number
  countryISO: CountryISO
}

export interface Appointment {
  id: string
  insuredId: string
  scheduleId: number
  countryISO: CountryISO
  status: AppointmentStatus
  createdAt: Date
  updatedAt: Date
}

export enum AppointmentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum CountryISO {
  PE = 'PE',
  CL = 'CL',
}

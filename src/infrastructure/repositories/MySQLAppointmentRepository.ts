import * as mysql from 'mysql2/promise'
import { CountryISO } from '../../domain/entities/Appointment'
import { MedicalSystemRepository } from '../../domain/repositories/MedicalSystemRepository'
import { AppointmentRequest } from '../../domain/value-objects/AppointmentRequest'

export class MySQLAppointmentRepository implements MedicalSystemRepository {
  private config: mysql.ConnectionOptions

  constructor(countryISO: CountryISO) {
    this.config = {
      host: process.env.MYSQL_HOST!,
      port: parseInt(process.env.MYSQL_PORT || '3306', 10),
      user: process.env.MYSQL_USER!,
      password: process.env.MYSQL_PASSWORD!,
    }

    if (countryISO === CountryISO.PE) {
      this.config.database = process.env.MYSQL_PE_DATABASE!
    } else {
      this.config.database = process.env.MYSQL_CL_DATABASE!
    }
  }

  async saveAppointment(request: AppointmentRequest): Promise<void> {
    const connection = await mysql.createConnection(this.config)

    try {
      await connection.execute(
        'INSERT INTO appointments (insured_id, schedule_id, country_iso, created_at) VALUES (?, ?, ?, ?)',
        [request.insuredId, request.scheduleId, request.countryISO, new Date()]
      )
    } finally {
      await connection.end()
    }
  }
}

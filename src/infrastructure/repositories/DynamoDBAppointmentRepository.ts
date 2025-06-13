import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb'
import {
  Appointment,
  AppointmentStatus,
} from '../../domain/entities/Appointment'
import { AppointmentRepository } from '../../domain/repositories/AppointmentRepository'

export class DynamoDBAppointmentRepository implements AppointmentRepository {
  private client: DynamoDBDocumentClient
  private tableName: string

  constructor() {
    const client = new DynamoDBClient({})
    this.client = DynamoDBDocumentClient.from(client)
    this.tableName = process.env.APPOINTMENTS_TABLE!
  }

  async save(appointment: Appointment): Promise<void> {
    const item = {
      ...appointment,
      createdAt: appointment.createdAt.toISOString(),
      updatedAt: appointment.updatedAt.toISOString(),
    }

    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: item,
      })
    )
  }

  async findById(id: string): Promise<Appointment | null> {
    const result = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { id },
      })
    )

    return (result.Item as Appointment) || null
  }

  async findByInsuredId(insuredId: string): Promise<Appointment[]> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'insuredId-index',
        KeyConditionExpression: 'insuredId = :insuredId',
        ExpressionAttributeValues: {
          ':insuredId': insuredId,
        },
      })
    )

    return (result.Items || []).map((item) => ({
      ...item,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    })) as Appointment[]
  }

  async updateStatus(id: string, status: AppointmentStatus): Promise<void> {
    await this.client.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { id },
        UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':status': status,
          ':updatedAt': new Date().toISOString(),
        },
      })
    )
  }
}

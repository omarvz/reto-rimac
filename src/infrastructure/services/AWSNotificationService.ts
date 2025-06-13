import {
  EventBridgeClient,
  PutEventsCommand,
} from '@aws-sdk/client-eventbridge'
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns'
import { NotificationService } from '../../domain/services/NotificationService'
import { AppointmentConfirmation } from '../../domain/value-objects/AppointmentConfirmation'
import { AppointmentRequest } from '../../domain/value-objects/AppointmentRequest'

export class AWSNotificationService implements NotificationService {
  private sns: SNSClient
  private eventBridge: EventBridgeClient
  private snsTopicArn: string
  private eventBusName: string

  constructor() {
    this.sns = new SNSClient({})
    this.eventBridge = new EventBridgeClient({})
    this.snsTopicArn = process.env.SNS_TOPIC_ARN!
    this.eventBusName = process.env.EVENT_BRIDGE_NAME!
  }

  async publishAppointmentRequest(
    request: AppointmentRequest & { id: string }
  ): Promise<void> {
    console.log('Publishing to SNS:', JSON.stringify(request))
    const result = await this.sns.send(
      new PublishCommand({
        TopicArn: this.snsTopicArn,
        Message: JSON.stringify(request),
        MessageAttributes: {
          countryISO: {
            DataType: 'String',
            StringValue: request.countryISO,
          },
        },
      })
    )
    console.log('SNS publish result:', result)
  }

  async publishAppointmentConfirmation(
    confirmation: AppointmentConfirmation
  ): Promise<void> {
    console.log('Publishing to EventBridge:', JSON.stringify(confirmation))
    console.log('EventBridge configuration:', {
      eventBusName: this.eventBusName,
      source: 'appointment.service',
      detailType: 'Appointment Confirmed',
    })

    try {
      const result = await this.eventBridge.send(
        new PutEventsCommand({
          Entries: [
            {
              Source: 'appointment.service',
              DetailType: 'Appointment Confirmed',
              Detail: JSON.stringify(confirmation),
              EventBusName: this.eventBusName,
            },
          ],
        })
      )
      console.log(
        'EventBridge publish result:',
        JSON.stringify(result, null, 2)
      )

      if (result.FailedEntryCount && result.FailedEntryCount > 0) {
        console.error('EventBridge failed entries:', result.Entries)
      } else {
        console.log('EventBridge event published successfully')
      }
    } catch (error) {
      console.error('Error publishing to EventBridge:', error)
      throw error
    }
  }
}

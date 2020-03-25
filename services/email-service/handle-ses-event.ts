import Log from '@dazn/lambda-powertools-logger';
import { wrapSnsHandler } from '../../lib/middleware';
import DynamoDb from '@dazn/lambda-powertools-dynamodb-client';
import SNS from '@dazn/lambda-powertools-sns-client';
import { EmailRepository } from './email-repository';
import { EmailStatus, EmailStatusEvent } from '../../lib/types';
import { SNSEvent } from 'aws-lambda';
import { config } from './config';
import 'source-map-support/register';

const emailRepository = new EmailRepository({
  dynamoDbDocumentClient: DynamoDb,
  tableName: config.DYNAMODB_CAMPAIGN_TABLE,
  logger: Log,
});

// See the SES Developer Guide for the event schema
// https://docs.aws.amazon.com/ses/latest/DeveloperGuide/notification-contents.html
const inputSchema = {
  properties: {
    Records: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          Sns: {
            type: 'object',
            properties: {
              Message: {
                type: 'object',
                required: ['eventType'],
                properties: {
                  eventType: {
                    type: 'string',
                    enum: [
                      'Bounce',
                      'Click',
                      'Complaint',
                      'Delivery',
                      'Open',
                      'Reject',
                      'Rendering Failure',
                      'Send',
                    ],
                  },
                  mail: {
                    type: 'object',
                    required: ['messageId'],
                    properties: {
                      messageId: { type: 'string' },
                      destination: { type: 'array', items: { type: 'string' } },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

interface SesEventMailObject {
  messageId: string;
  destination: string[];
}

interface SesEvent {
  eventType:
    | 'Bounce'
    | 'Click'
    | 'Complaint'
    | 'Delivered'
    | 'Open'
    | 'Reject'
    | 'Send'
    | 'Rendering Failure';
  mail: SesEventMailObject;
}

const eventToStatusMapping = {
  Send: EmailStatus.Sent,
  Delivered: EmailStatus.Delivered,
  Open: EmailStatus.Opened,
  Bounce: EmailStatus.Bounce,
  Complaint: EmailStatus.Complaint,
  Reject: EmailStatus.Rejected,
  'Rendering Failure': undefined,
  Click: undefined,
};

const handler = wrapSnsHandler(
  async (event: SNSEvent, _context, _cb) => {
    Log.debug('Received event', { event });
    const sesEvent = (event.Records[0].Sns.Message as unknown) as SesEvent;
    const newStatus = eventToStatusMapping[sesEvent.eventType];
    if (!newStatus) {
      Log.debug(`Received event ${sesEvent.eventType}, doing nothing`);
      return;
    }
    Log.debug(
      `Marking ${sesEvent.mail.messageId} as ${newStatus}, user is ${sesEvent.mail.destination[0]}`,
    );
    const email = await emailRepository.updateStatus(
      sesEvent.mail.messageId,
      newStatus,
    );
    const emailStatusEvent: EmailStatusEvent = {
      name: 'EmailStatusEvent',
      timestamp: Date.now(), // TODO: Use eventTime
      email,
    };
    await SNS.publish({
      Message: JSON.stringify(emailStatusEvent),
      TopicArn: config.SNS_EMAILS_TOPIC_ARN,
    })
      .promise()
      .catch(error => Log.error('Error publishing to SNS stream', { error }));
  },
  { inputSchema },
);

export { handler };

import Log from '@dazn/lambda-powertools-logger';
import { wrapSnsHandler } from '../../lib/middleware';
import DynamoDb from '@dazn/lambda-powertools-dynamodb-client';
import { EmailRepository, EmailStatus } from './email-repository';
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

interface EmailEventMailObject {
  messageId: string;
  destination: string[];
}

interface EmailEvent {
  eventType:
    | 'Bounce'
    | 'Click'
    | 'Complaint'
    | 'Delivered'
    | 'Open'
    | 'Reject'
    | 'Send'
    | 'Rendering Failure';
  mail: EmailEventMailObject;
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
    const emailEvent = (event.Records[0].Sns.Message as unknown) as EmailEvent;
    const newStatus = eventToStatusMapping[emailEvent.eventType];
    if (!newStatus) {
      Log.debug(`Received event ${emailEvent.eventType}, doing nothing`);
      return;
    }
    Log.debug(
      `Marking ${emailEvent.mail.messageId} as ${newStatus}, user is ${emailEvent.mail.destination[0]}`,
    );
    await emailRepository.updateStatus(emailEvent.mail.messageId, newStatus);
  },
  { inputSchema },
);

export { handler };

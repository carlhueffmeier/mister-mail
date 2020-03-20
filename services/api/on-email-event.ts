import Log from '@dazn/lambda-powertools-logger';
import { wrapSnsHandler } from './middleware';
import DynamoDb from '@dazn/lambda-powertools-dynamodb-client';
import { EmailRepository, EmailStatus } from './email-repository';
import { SNSEvent } from 'aws-lambda';
import { getConfig } from './config';
import 'source-map-support/register';

const emailRepository = new EmailRepository({
  dynamoDbDocumentClient: DynamoDb,
  tableName: getConfig().DYNAMODB_CAMPAIGN_TABLE,
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
                properties: {
                  notificationType: {
                    type: 'string',
                    enum: ['Bounce', 'Complaint', 'Delivery'],
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
  notificationType: 'Bounce' | 'Complaint' | 'Delivery';
  mail: EmailEventMailObject;
}

const handler = wrapSnsHandler(
  async (event: SNSEvent, _context, _cb) => {
    Log.debug('Received event', { event });
    const emailEvent = (event.Records[0].Sns.Message as unknown) as EmailEvent;
    const newStatus =
      emailEvent.notificationType === 'Delivery'
        ? EmailStatus.Delivered
        : EmailStatus.Failed;
    Log.debug(
      `Marking ${emailEvent.mail.messageId} as ${newStatus}, user is ${emailEvent.mail.destination[0]}`,
    );
    await emailRepository.updateStatus(emailEvent.mail.messageId, newStatus);
  },
  { inputSchema },
);

export { handler };

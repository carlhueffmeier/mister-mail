import AWS from 'aws-sdk';
import Log from '@dazn/lambda-powertools-logger';
import { wrapSnsHandler } from './middleware';
import DynamoDb from '@dazn/lambda-powertools-dynamodb-client';
import { EmailRepository } from './email-repository';
import { CampaignCreatedEvent } from './create-campaign.types';
import { EmailService } from './email-service';
import { SendEmailRequest } from './email-service.types';
import { SNSEvent } from 'aws-lambda';
import { getConfig } from './config';
import 'source-map-support/register';

const emailRepository = new EmailRepository({
  dynamoDbDocumentClient: DynamoDb,
  tableName: getConfig().DYNAMODB_CAMPAIGN_TABLE,
  logger: Log,
});

const emailService = new EmailService({
  ses: new AWS.SES(),
  emailRepository,
  configurationSet: getConfig().SES_CONFIGURATION_SET,
  emailTopicArn: getConfig().SES_EMAIL_EVENTS_TOPIC_ARN,
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
          notificationType: {
            type: 'string',
            enum: ['Bounce', 'Complaint', 'Delivery'],
          },
          mail: {
            type: 'object',
            required: ['messageId', 'destination'],
            properties: {
              messageId: { type: 'string' },
              destination: { type: 'array', items: { type: 'string' } },
            },
          },
        },
      },
    },
  },
};

async function sendEmail(
  source: string,
  destination: string,
  name: string,
  questionText: string,
): Promise<void> {
  const sendEmailRequest: SendEmailRequest = {
    subject: `${name} has a question for you!`,
    text: `The question is: \n\n${questionText}`,
    html: `The question is: <b>\n\n${questionText}</b>`,
    source,
    destination,
  };
  await emailService.sendEmail(sendEmailRequest);
}

const handler = wrapSnsHandler(
  async (event: SNSEvent, _context, _cb) => {
    Log.debug('Received event', { event });
    const { campaign } = (event.Records[0] as unknown) as CampaignCreatedEvent;
    Log.debug(`Sending email to ${campaign.destinations}`);
    for (const destination of campaign.destinations) {
      await sendEmail(
        campaign.from,
        destination.email,
        destination.name,
        campaign.questionText,
      );
    }
  },
  { inputSchema },
);

export { handler };

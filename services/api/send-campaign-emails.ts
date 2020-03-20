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
  emailTopicArn: getConfig().SNS_CAMPAIGNS_TOPIC_ARN,
  logger: Log,
});

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
                  name: { const: 'CampaignCreatedEvent' },
                  timestamp: { type: 'number' },
                  campaign: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      questionText: { type: 'string' },
                      destinations: {
                        type: 'array',
                        maxItems: 10, // As longs as it's a for loop..
                        items: {
                          type: 'object',
                          required: ['name', 'email'],
                          properties: {
                            name: { type: 'string' },
                            email: { type: 'string' },
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
    const { campaign } = (event.Records[0].Sns
      .Message as unknown) as CampaignCreatedEvent;
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

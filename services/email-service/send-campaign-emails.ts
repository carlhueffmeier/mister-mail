import AWS from 'aws-sdk';
import Log from '@dazn/lambda-powertools-logger';
import { wrapSnsHandler } from '../../lib/middleware';
import DynamoDb from '@dazn/lambda-powertools-dynamodb-client';
import { EmailRepository } from './email-repository';
import { CampaignCreatedEvent } from '../../lib/types';
import { SendEmailUseCase } from './send-email-use-case';
import { SNSEvent } from 'aws-lambda';
import { config } from './config';
import 'source-map-support/register';

const emailRepository = new EmailRepository({
  dynamoDbDocumentClient: DynamoDb,
  tableName: config.DYNAMODB_CAMPAIGN_TABLE,
  logger: Log,
});

const sendEmailUseCase = new SendEmailUseCase({
  ses: new AWS.SES(),
  emailRepository,
  configurationSet: config.SES_CONFIGURATION_SET,
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

const handler = wrapSnsHandler(
  async (event: SNSEvent, _context, _cb) => {
    Log.debug('Received event', { event });
    const { campaign } = (event.Records[0].Sns
      .Message as unknown) as CampaignCreatedEvent;
    Log.debug(`Sending email to ${campaign.destinations}`);
    for (const destination of campaign.destinations) {
      await sendEmailUseCase.sendEmail({
        uid: campaign.uid,
        campaignId: campaign.id,
        subject: campaign.name,
        text: `Hi ${destination.name}!\n The question is: \n\n${campaign.questionText}`,
        html: `Hi ${destination.name}!<br> The question is: <b>\n\n${campaign.questionText}</b>`,
        source: campaign.from,
        destination: destination.email,
      });
    }
  },
  { inputSchema },
);

export { handler };

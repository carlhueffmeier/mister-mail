import Log from '@dazn/lambda-powertools-logger';
import DynamoDb from '@dazn/lambda-powertools-dynamodb-client';
import { CampaignRepository } from './campaign-repository';
import { SNSEvent } from 'aws-lambda';
import { wrapSnsHandler } from '../../lib/middleware';
import { EmailStatusEvent } from '../../lib/types';
import { config } from './config';
import 'source-map-support/register';

const campaignRepository = new CampaignRepository({
  dynamoDbDocumentClient: DynamoDb,
  tableName: config.DYNAMODB_CAMPAIGN_TABLE,
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
                  name: { const: 'EmailStatusEvent' },
                  timestamp: { type: 'number' },
                  email: {
                    type: 'object',
                    properties: {
                      uid: { type: 'string' },
                      campaignId: { type: 'string' },
                      messageId: { type: 'string' },
                      status: { type: 'string' },
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

// This could also be done using DynamoDB streams
const handler = wrapSnsHandler(
  async (event: SNSEvent, _context, _cb) => {
    Log.debug('Received event', { event });
    const emailStatusEvent = (event.Records[0].Sns
      .Message as unknown) as EmailStatusEvent;

    await campaignRepository.increment(
      emailStatusEvent.email.uid,
      emailStatusEvent.email.campaignId,
      emailStatusEvent.email.status,
    );
  },
  { inputSchema },
);

export { handler };

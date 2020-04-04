import Log from '@dazn/lambda-powertools-logger';
import DynamoDb from '@dazn/lambda-powertools-dynamodb-client';
import { CampaignRepository } from './campaign-repository';
import { SNSEvent } from 'aws-lambda';
import { wrapSnsHandler } from '../lib/middleware';
import { EmailStatusEvent } from './types';
import { config } from './config';
import { AppSyncClient } from '../lib/appsync-client';
import { notifyCampaignUpdate } from '../lib/graphql-operations';
import 'source-map-support/register';

const campaignRepository = new CampaignRepository({
  dynamoDbDocumentClient: DynamoDb,
  tableName: config.DYNAMODB_CAMPAIGN_TABLE,
  logger: Log,
});
const appSyncClient = new AppSyncClient({
  appSyncEndpoint: config.APPSYNC_ENDPOINT,
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

    const updatedCampaign = await campaignRepository.increment(
      emailStatusEvent.email.uid,
      emailStatusEvent.email.campaignId,
      emailStatusEvent.email.status,
    );
    // This triggers GraphQL subscription updates on all connected clients
    await appSyncClient.request({
      operationName: 'NotifyCampaignUpdate',
      variables: {
        data: {
          id: updatedCampaign.id,
          uid: updatedCampaign.uid,
          created: updatedCampaign.created,
          updated: updatedCampaign.updated,
          name: updatedCampaign.name,
          from: updatedCampaign.from,
          questionText: updatedCampaign.questionText,
          destinations: updatedCampaign.destinations,
          stats: updatedCampaign.stats,
        },
      },
      query: notifyCampaignUpdate,
    });
  },
  { inputSchema },
);

export { handler };

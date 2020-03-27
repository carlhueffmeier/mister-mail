import Log from '@dazn/lambda-powertools-logger';
import DynamoDb from '@dazn/lambda-powertools-dynamodb-client';
import SNS from '@dazn/lambda-powertools-sns-client';
import { CampaignRepository } from './campaign-repository';
import { Context, Callback } from 'aws-lambda';
import { wrapAppSyncHandler } from '../../lib/middleware';
import { config } from './config';
import { CreateCampaignAppSyncEvent } from './create-campaign.types';
import { CampaignCreatedEvent } from '../../lib/types';
import 'source-map-support/register';

const campaignRepository = new CampaignRepository({
  dynamoDbDocumentClient: DynamoDb,
  tableName: config.DYNAMODB_CAMPAIGN_TABLE,
  logger: Log,
});

const inputSchema = {
  required: ['field', 'arguments'],
  properties: {
    field: { type: 'string' },
    arguments: {
      type: 'object',
      required: ['data'],
      properties: {
        data: {
          type: 'object',
          required: ['name', 'questionText', 'destinations'],
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
};

const handler = wrapAppSyncHandler(
  async (
    event: object,
    _context: Context,
    callback: Callback,
  ): Promise<object | void> => {
    Log.debug('Received event', { event });
    const appSyncEvent = (event as unknown) as CreateCampaignAppSyncEvent;
    const newCampaign = await campaignRepository.create({
      uid: appSyncEvent.identity.claims.sub,
      from: appSyncEvent.identity.claims.email,
      ...appSyncEvent.arguments.data,
    });

    const campaignCreatedEvent: CampaignCreatedEvent = {
      name: 'CampaignCreatedEvent',
      timestamp: newCampaign.created,
      campaign: newCampaign,
    };
    await SNS.publish({
      Message: JSON.stringify(campaignCreatedEvent),
      TopicArn: config.SNS_CAMPAIGNS_TOPIC_ARN,
    })
      .promise()
      .catch(error => Log.error('Error publishing to SNS stream', { error }));

    callback(null, newCampaign);
  },
  { inputSchema },
);

export { handler };

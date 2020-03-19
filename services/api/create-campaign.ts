import Log from '@dazn/lambda-powertools-logger';
import DynamoDb from '@dazn/lambda-powertools-dynamodb-client';
import SNS from '@dazn/lambda-powertools-sns-client';
import { CampaignRepository } from './campaign-repository';
import {
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult,
  APIGatewayProxyCallback,
} from 'aws-lambda';
import { wrapHttpHandler } from './middleware';
import { getConfig } from './config';
import { getUserId, getUserEmail } from '../../lib/auth-utils';
import { RequestBody, CampaignCreatedEvent } from './create-campaign.types';
import 'source-map-support/register';

const campaignRepository = new CampaignRepository({
  dynamoDbDocumentClient: DynamoDb,
  tableName: getConfig().DYNAMODB_CAMPAIGN_TABLE,
  logger: Log,
});

const inputSchema = {
  required: ['body'],
  properties: {
    body: {
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
};

const handler = wrapHttpHandler(
  async (
    event: APIGatewayProxyEvent,
    _context: Context,
    callback: APIGatewayProxyCallback,
  ): Promise<APIGatewayProxyResult | void> => {
    Log.debug('Received event', { event });
    const requestBody = (event.body as unknown) as RequestBody;
    const newCampaign = await campaignRepository.create({
      uid: getUserId(event),
      from: getUserEmail(event),
      ...requestBody,
    });

    const campaignCreatedEvent: CampaignCreatedEvent = {
      name: 'CampaignCreatedEvent',
      timestamp: newCampaign.created,
      campaign: newCampaign,
    };
    await SNS.publish({
      Message: JSON.stringify(campaignCreatedEvent),
      TopicArn: getConfig().SNS_CAMPAIGNS_TOPIC,
    })
      .promise()
      .catch(error => Log.error('Error publishing to SNS stream', { error }));

    callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Mister mail, at your service',
        newCampaign,
      }),
    });
  },

  { inputSchema },
);

export { handler };

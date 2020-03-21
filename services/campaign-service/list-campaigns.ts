import Log from '@dazn/lambda-powertools-logger';
import DynamoDb from '@dazn/lambda-powertools-dynamodb-client';
import { CampaignRepository } from './campaign-repository';
import {
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult,
  APIGatewayProxyCallback,
} from 'aws-lambda';
import { wrapHttpHandler } from '../../lib/middleware';
import { config } from './config';
import { getUserId } from '../../lib/auth-utils';
import 'source-map-support/register';

const campaignRepository = new CampaignRepository({
  dynamoDbDocumentClient: DynamoDb,
  tableName: config.DYNAMODB_CAMPAIGN_TABLE,
  logger: Log,
});

const handler = wrapHttpHandler(
  async (
    event: APIGatewayProxyEvent,
    _context: Context,
    callback: APIGatewayProxyCallback,
  ): Promise<APIGatewayProxyResult | void> => {
    Log.debug('Received event', { event });
    const campaigns = await campaignRepository.findAllByUserId(
      getUserId(event),
    );
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(campaigns),
    });
  },
);

export { handler };

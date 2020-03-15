import Log from '@dazn/lambda-powertools-logger';
import DynamoDb from '@dazn/lambda-powertools-dynamodb-client';
import { CampaignRepository } from './campaign-repository';
import { CreateCampaignRequest } from './campaign-repository.types';
import {
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyCallback,
} from 'aws-lambda';
import { wrapHttpHandler } from './middleware';
import { getConfig } from './config';
import { getUserId } from '../../lib/auth-utils';
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
      required: ['name', 'questionText'],
      properties: {
        name: { type: 'string' },
        questionText: { type: 'string' },
      },
    },
  },
};

interface RequestBody {
  name: string;
  questionText: string;
}

const handler = wrapHttpHandler(
  async (
    event: APIGatewayProxyEvent,
    _context: Context,
    callback: APIGatewayProxyCallback,
  ): Promise<void> => {
    Log.debug('Received event', { event });
    const requestBody = (event.body as unknown) as RequestBody;
    const uid = getUserId(event);
    const createRequest: CreateCampaignRequest = {
      uid,
      ...requestBody,
    };
    const result = await campaignRepository.create(createRequest);

    callback(null, {
      statusCode: 200,
      body: JSON.stringify({ message: 'Mister mail, at your service', result }),
    });
  },

  { inputSchema },
);

export { handler };

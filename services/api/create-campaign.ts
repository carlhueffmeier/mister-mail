import Log from '@dazn/lambda-powertools-logger';
import { wrapHttpHandler } from './middleware';
import DynamoDb from '@dazn/lambda-powertools-dynamodb-client';
import {
  CampaignRepository,
  CreateCampaignRequest,
} from './campaign-repository';
import { APIGatewayProxyEvent } from 'aws-lambda';
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
      required: ['name'],
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
  async (event: APIGatewayProxyEvent, _context, _cb) => {
    Log.debug('Received event', { event });
    const requestBody = (event.body as unknown) as RequestBody;
    const userId = getUserId(event);
    const createRequest: CreateCampaignRequest = {
      userId,
      ...requestBody,
    };
    const result = await campaignRepository.create(createRequest);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Mister mail, at your service', result }),
    };
  },

  { inputSchema },
);

export { handler };

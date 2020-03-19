import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { handler } from './create-campaign';
import { promisifyHandler } from '../../lib/test-utils';

jest.mock('./config');
jest.mock('./campaign-repository');
jest.mock('@dazn/lambda-powertools-sns-client', () => {
  const snsResponse = {
    promise: jest.fn().mockResolvedValue(null),
  };
  return {
    publish: jest.fn().mockReturnValue(snsResponse),
  };
});

describe('services/api/create-campaign.ts', () => {
  describe('given valid body', () => {
    const createCampaignRequest = {
      name: 'Camping trip',
      questionText: 'Do you want to join?',
      destinations: [
        {
          name: 'Dogbert',
          email: 'dog@bert.com',
        },
      ],
    };
    const body = JSON.stringify(createCampaignRequest, null, 2);

    it('should return status code OK', async () => {
      const event = ({
        body,
        headers: { 'content-type': 'application/json' },
      } as unknown) as APIGatewayProxyEvent;

      const result = await promisifyHandler(handler)(event, {} as Context);

      expect(result).toEqual(expect.objectContaining({ statusCode: 200 }));
    });
  });
});

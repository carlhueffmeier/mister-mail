import {
  APIGatewayProxyEvent,
  Context,
  Callback,
  APIGatewayProxyResult,
} from 'aws-lambda';
import { handler } from './create-campaign';

jest.mock('./config');
jest.mock('./campaign-repository');

describe('services/api/create-campaign.ts', () => {
  describe('given valid body', () => {
    const createCampaignRequest = {
      name: 'Camping trip',
      questionText: 'Do you want to join?',
    };
    const body = JSON.stringify(createCampaignRequest, null, 2);

    it('should return status code OK', async () => {
      const event = ({
        body,
        headers: { 'content-type': 'application/json' },
      } as unknown) as APIGatewayProxyEvent;
      const callback: jest.Mock<Callback<APIGatewayProxyResult>> = jest.fn();

      await handler(event, {} as Context, callback);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(
        null,
        expect.objectContaining({ statusCode: 200 }),
      );
    });
  });
});

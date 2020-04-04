import { Context } from 'aws-lambda';
import { handler } from './create-campaign';
import { promisifyHandler } from '../lib/test-utils';
import { CreateCampaignAppSyncEvent } from './types';

jest.mock('../lib/utils');
jest.mock('./campaign-repository');
jest.mock('@dazn/lambda-powertools-sns-client', () => {
  const snsResponse = {
    promise: jest.fn().mockResolvedValue(null),
  };
  return {
    publish: jest.fn().mockReturnValue(snsResponse),
  };
});

describe('create-campaign', () => {
  describe('given valid event', () => {
    const event: CreateCampaignAppSyncEvent = {
      field: 'createCampaign',
      identity: {
        claims: {
          email: 'cat@bert.com',
          sub: '12345678',
        },
      },
      arguments: {
        data: {
          name: 'Camping trip',
          questionText: 'Do you want to join?',
          destinations: [
            {
              name: 'Dogbert',
              email: 'dog@bert.com',
            },
          ],
        },
      },
    };

    it('should return new campaign', async () => {
      const result = await promisifyHandler(handler)(event, {} as Context);
      expect(result).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          uid: event.identity.claims.sub,
          from: event.identity.claims.email,
          name: event.arguments.data.name,
          questionText: event.arguments.data.questionText,
          destinations: event.arguments.data.destinations,
        }),
      );
    });
  });
});

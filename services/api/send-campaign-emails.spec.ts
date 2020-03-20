import { SNSEvent, Context } from 'aws-lambda';
import { handler } from './send-campaign-emails';
import campaignCreatedEvent from './test-data/campaign-created-event.json';
import { promisifyHandler } from '../../lib/test-utils';

jest.mock('./config');
jest.mock('./email-repository');
jest.mock('./email-service');

function snsEventFromSesEvent(snsEventData: unknown): Readonly<SNSEvent> {
  return ({
    Records: [{ Sns: { Message: JSON.stringify(snsEventData) } }],
  } as unknown) as SNSEvent;
}

describe('send-campaign-emails', () => {
  describe('given event type "Delivery"', () => {
    const event = snsEventFromSesEvent(campaignCreatedEvent);

    it('should not throw an error', async () => {
      const context: Context = {} as Context;
      await promisifyHandler(handler)(event, context);
    });
  });
});

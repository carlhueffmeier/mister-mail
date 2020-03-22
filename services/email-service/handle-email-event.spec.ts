import { SNSEvent, Context } from 'aws-lambda';
import { handler } from './handle-email-event';
import emailDeliveredEvent from './test-data/ses-email-delivered.json';
import { promisifyHandler } from '../../lib/test-utils';

jest.mock('../../lib/utils');

function snsEventFromSesEvent(snsEventData: unknown): Readonly<SNSEvent> {
  return ({
    Records: [{ Sns: { Message: JSON.stringify(snsEventData) } }],
  } as unknown) as SNSEvent;
}

describe('on-email-event', () => {
  describe('given event type "Delivery"', () => {
    const event = snsEventFromSesEvent(emailDeliveredEvent);

    it('should not throw an error', async () => {
      const context: Context = {} as Context;
      await promisifyHandler(handler)(event, context);
    });
  });
});

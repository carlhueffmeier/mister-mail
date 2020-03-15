import { SNSEvent, Context, Callback } from 'aws-lambda';
import { handler } from './on-email-event';
import emailDeliveredEvent from './test-data/ses-email-delivered.json';

jest.mock('./config');

function snsEventFromSesEvent(snsEventData: unknown): Readonly<SNSEvent> {
  return ({ Records: [snsEventData] } as unknown) as SNSEvent;
}

describe('services/api/on-email-event.ts', () => {
  describe('given event type "Delivery"', () => {
    const event = snsEventFromSesEvent(emailDeliveredEvent);

    it('should not throw an error', async () => {
      const context: Context = {} as Context;
      const callback: jest.Mock<Callback<void>> = jest.fn();

      await handler(event, context, callback);
    });
  });
});

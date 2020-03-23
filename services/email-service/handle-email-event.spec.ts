import { SNSEvent, Context } from 'aws-lambda';
import { handler } from './handle-email-event';
import { promisifyHandler } from '../../lib/test-utils';
import bounceEvent from './test-data/ses-email-bounce.json';
import clickEvent from './test-data/ses-email-click.json';
import complaintEvent from './test-data/ses-email-complaint.json';
import deliveredEvent from './test-data/ses-email-delivered.json';
import openEvent from './test-data/ses-email-open.json';
import rejectEvent from './test-data/ses-email-reject.json';
import renderingFailedEvent from './test-data/ses-email-rendering-failure.json';
import sendEvent from './test-data/ses-email-send.json';

const allEvents = {
  bounceEvent,
  clickEvent,
  complaintEvent,
  deliveredEvent,
  openEvent,
  rejectEvent,
  renderingFailedEvent,
  sendEvent,
};

jest.mock('../../lib/utils');

function snsEventFromSesEvent(snsEventData: unknown): Readonly<SNSEvent> {
  return ({
    Records: [{ Sns: { Message: JSON.stringify(snsEventData) } }],
  } as unknown) as SNSEvent;
}

describe('handle-email-event', () => {
  describe.each(Object.entries(allEvents))(
    'given event %i',
    (_eventName, event) => {
      it('should process without error', async () => {
        const context: Context = {} as Context;
        await promisifyHandler(handler)(snsEventFromSesEvent(event), context);
      });
    },
  );
});

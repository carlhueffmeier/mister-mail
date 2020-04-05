import Log from '@dazn/lambda-powertools-logger';
import { wrapHttpHandler } from '../lib/middleware';
import { APIGatewayEvent } from 'aws-lambda';
import 'source-map-support/register';

const handler = wrapHttpHandler(
  async (event: APIGatewayEvent, _context, _cb) => {
    Log.debug('Received event', { event });
  },
);

export { handler };

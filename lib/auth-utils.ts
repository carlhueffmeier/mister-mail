import { APIGatewayProxyEvent } from 'aws-lambda';
import Log from '@dazn/lambda-powertools-logger';

export function getUserId(event: APIGatewayProxyEvent): string {
  const uid = event?.requestContext?.authorizer?.claims.sub;
  Log.debug('Got uid', { uid });
  return uid;
}

import { APIGatewayProxyEvent } from 'aws-lambda';
import Log from '@dazn/lambda-powertools-logger';

export function getUserId(event: APIGatewayProxyEvent): string {
  const uid = event?.requestContext?.authorizer?.claims.sub;
  Log.debug('Got uid', { uid });
  return uid;
}

export function getUserEmail(_event: APIGatewayProxyEvent): string {
  // TODO: Get from event or use Cognito API
  Log.debug('Faking a user email...');
  return 'carlhueffmeier@gmail.com';
}

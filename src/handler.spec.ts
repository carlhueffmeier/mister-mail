import {
  APIGatewayProxyEvent,
  Context,
  Callback,
  APIGatewayProxyResult,
} from 'aws-lambda';
import { hello } from './handler';

describe('Hello handler', () => {
  it('should return status code OK', async () => {
    const event: APIGatewayProxyEvent = {} as APIGatewayProxyEvent;
    const context: Context = {} as Context;
    const callback: Callback<APIGatewayProxyResult> = jest.fn() as Callback<
      APIGatewayProxyResult
    >;

    const result = await hello(event, context, callback);

    expect(result).toBeDefined();
    expect((result as APIGatewayProxyResult).statusCode).toBe(200);
  });
});

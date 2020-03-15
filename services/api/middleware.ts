import middy from '@middy/core';
import corsMiddleware from '@middy/cors';
import validator from '@middy/validator';
import httpErrorHandlerMiddleware from '@middy/http-error-handler';
import jsonBodyParserMiddleware from '@middy/http-json-body-parser';
import sampleLoggingMiddleware from '@dazn/lambda-powertools-middleware-sample-logging';
import correlationIdsMiddleware from '@dazn/lambda-powertools-middleware-correlation-ids';
import logTimeoutMiddleware from '@dazn/lambda-powertools-middleware-log-timeout';
import Log from '@dazn/lambda-powertools-logger';
import {
  Handler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  SNSHandler,
  SNSEvent,
} from 'aws-lambda';
import { HttpError } from 'http-errors';
import { Options as AjvOptions } from 'ajv';

export interface ValidatorOptions {
  inputSchema?: object;
  outputSchema?: object;
  ajvOptions?: Partial<AjvOptions>;
}

function nullMiddleware<T, R>(): middy.MiddlewareObject<T, R> {
  return {
    onError: (handler, next): void => next(handler.error),
  };
}

export function addCommons<T, R>(handler: Handler<T, R>): middy.Middy<T, R> {
  return middy(handler)
    .use(sampleLoggingMiddleware({ sampleRate: 1 }))
    .use(correlationIdsMiddleware({ sampleDebugLogRate: 1 }))
    .use(logTimeoutMiddleware());
}

export function wrapHttpHandler(
  handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult | void>,
  validatorOptions?: ValidatorOptions,
): middy.Middy<APIGatewayProxyEvent, APIGatewayProxyResult | void> {
  return addCommons(handler)
    .use(jsonBodyParserMiddleware())
    .use(validatorOptions ? validator(validatorOptions) : nullMiddleware())
    .use(
      httpErrorHandlerMiddleware({
        logger: (error: HttpError): void =>
          Log.debug('Handling HTTP error', { error }),
      }),
    )
    .use(corsMiddleware());
}

export function wrapSnsHandler(
  handler: SNSHandler,
  validatorOptions?: ValidatorOptions,
): middy.Middy<SNSEvent, void> {
  return addCommons(handler).use(
    validatorOptions ? validator(validatorOptions) : nullMiddleware(),
  );
}

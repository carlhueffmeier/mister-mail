declare module '@dazn/lambda-powertools-dynamodb-client' {
  import AWS from 'aws-sdk';
  import { CorrelationIds } from '@dazn/lambda-powertools-correlation-ids';

  class TracingDocumentClient extends AWS.DynamoDB.DocumentClient {
    putWithCorrelationIds(
      correlationIds: CorrelationIds,
      params: AWS.DynamoDB.DocumentClient.PutItemInput,
      callback?: (
        err: AWS.AWSError,
        data: AWS.DynamoDB.DocumentClient.PutItemOutput,
      ) => void,
    ): void;
    updateWithCorrelationIds(
      correlationIds: CorrelationIds,
      params: AWS.DynamoDB.DocumentClient.UpdateItemInput,
      callback?: (
        err: AWS.AWSError,
        data: AWS.DynamoDB.DocumentClient.UpdateItemOutput,
      ) => void,
    ): void;
    batchWriteWithCorrelationIds(
      correlationIds: CorrelationIds,
      params: AWS.DynamoDB.DocumentClient.BatchWriteItemInput,
      callback?: (
        err: AWS.AWSError,
        data: AWS.DynamoDB.DocumentClient.BatchWriteItemOutput,
      ) => void,
    ): void;
    transactWriteWithCorrelationIds(
      correlationIds: CorrelationIds,
      params: AWS.DynamoDB.DocumentClient.TransactWriteItemsInput,
      callback?: (
        err: AWS.AWSError,
        data: AWS.DynamoDB.DocumentClient.TransactWriteItemsOutput,
      ) => void,
    ): void;
  }
  const client: TracingDocumentClient;

  export = client;
}

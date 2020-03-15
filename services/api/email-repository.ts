import { DynamoDB } from 'aws-sdk';
import Log from '@dazn/lambda-powertools-logger';
import {
  EmailStatus,
  Email,
  EmailDynamoDbRecord,
} from './email-repository.types';

export * from './email-repository.types';
export class EmailRepository {
  dynamoDbDocumentClient: DynamoDB.DocumentClient;
  tableName: string;
  logger: Log;

  constructor(options: {
    dynamoDbDocumentClient: DynamoDB.DocumentClient;
    tableName: string;
    logger: Log;
  }) {
    this.dynamoDbDocumentClient = options.dynamoDbDocumentClient;
    this.tableName = options.tableName;
    this.logger = options.logger;
  }

  async create(createData: Readonly<Email>): Promise<EmailDynamoDbRecord> {
    const timestamp = Date.now();
    const newItem: EmailDynamoDbRecord = {
      pk: createData.messageId,
      sk: `mail`,
      messageId: createData.messageId,
      created: timestamp,
      updated: timestamp,
      status: createData.status,
    };
    const putParams: DynamoDB.DocumentClient.PutItemInput = {
      TableName: this.tableName,
      Item: newItem,
    };
    this.logger.debug('Creating new email record', { createData, putParams });
    await this.dynamoDbDocumentClient.put(putParams).promise();
    return newItem;
  }

  async updateStatus(_messageId: string, _status: EmailStatus): Promise<void> {
    // TODO
  }
}

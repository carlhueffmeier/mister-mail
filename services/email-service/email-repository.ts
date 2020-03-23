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

  async updateStatus(messageId: string, status: EmailStatus): Promise<void> {
    const updateParams = {
      TableName: this.tableName,
      Key: { pk: messageId, sk: 'mail' },
      UpdateExpression: 'set #status = :new_status',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':new_status': status,
      },
    };
    this.logger.debug('Updating email record', { updateParams });
    await this.dynamoDbDocumentClient.update(updateParams).promise();
  }
}

import { DynamoDB } from 'aws-sdk';
import Log from '@dazn/lambda-powertools-logger';
import { EmailDynamoDbRecord } from './types';
import { EmailStatus, Email } from './types';

export * from './types';
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
      uid: createData.uid,
      campaignId: createData.campaignId,
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

  async updateStatus(
    messageId: string,
    status: EmailStatus,
  ): Promise<EmailDynamoDbRecord> {
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
      ReturnValues: 'ALL_NEW',
    };
    this.logger.debug('Updating email record', { updateParams });
    const result = await this.dynamoDbDocumentClient
      .update(updateParams)
      .promise();
    return result.Attributes as EmailDynamoDbRecord;
  }

  async findById(messageId: string): Promise<EmailDynamoDbRecord> {
    const getItemParams: AWS.DynamoDB.DocumentClient.GetItemInput = {
      TableName: this.tableName,
      Key: { pk: messageId, sk: 'mail' },
    };
    this.logger.debug('Fetching email record', { getItemParams });
    const result = await this.dynamoDbDocumentClient
      .get(getItemParams)
      .promise();
    if (!result.Item) {
      throw new Error('Email not found!');
    }
    return result.Item as EmailDynamoDbRecord;
  }
}

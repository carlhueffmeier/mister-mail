import { DynamoDB } from 'aws-sdk';
import Log from '@dazn/lambda-powertools-logger';
import { EmailDynamoDbRecord } from './types';
import { EmailStatus, Email } from './types';
import { getEpochSeconds } from '../lib/utils';

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
    const timestamp = getEpochSeconds();
    const newItem: EmailDynamoDbRecord = {
      pk: createData.uid,
      sk: ['M', createData.campaignId, createData.messageId].join('#'),
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

  async updateStatus(updateParams: {
    uid: string;
    campaignId: string;
    messageId: string;
    status: EmailStatus;
  }): Promise<EmailDynamoDbRecord> {
    const updateRecordParams = {
      TableName: this.tableName,
      Key: {
        pk: updateParams.uid,
        sk: ['M', updateParams.campaignId, updateParams.messageId].join('#'),
      },
      UpdateExpression: 'set #status = :new_status',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':new_status': updateParams.status,
      },
      ReturnValues: 'ALL_NEW',
    };
    this.logger.debug('Updating email record', { updateRecordParams });
    const result = await this.dynamoDbDocumentClient
      .update(updateRecordParams)
      .promise();
    return result.Attributes as EmailDynamoDbRecord;
  }

  async findOne(findParams: {
    uid: string;
    campaignId: string;
    messageId: string;
  }): Promise<EmailDynamoDbRecord> {
    const getItemParams: AWS.DynamoDB.DocumentClient.GetItemInput = {
      TableName: this.tableName,
      Key: {
        pk: findParams.uid,
        sk: ['M', findParams.campaignId, findParams.messageId].join('#'),
      },
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

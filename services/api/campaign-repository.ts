import * as uuid from 'uuid';
import { DynamoDB } from 'aws-sdk';
import Log from '@dazn/lambda-powertools-logger';

export interface CreateCampaignRequest {
  userId: string;
  name: string;
  questionText: string;
}

export interface CampaignDynamoDbRecord {
  pk: string;
  sk: string;
  id: string;
  created: number;
  updated: number;
  name: string;
  questionText: string;
}

export class CampaignRepository {
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

  async create(
    createData: Readonly<CreateCampaignRequest>,
  ): Promise<CampaignDynamoDbRecord> {
    const timestamp = Date.now();
    const id = uuid.v1();
    const newItem: CampaignDynamoDbRecord = {
      pk: createData.userId,
      sk: `C-${id}`,
      id: id,
      created: timestamp,
      updated: timestamp,
      name: createData.name,
      questionText: createData.questionText,
    };
    const putParams: DynamoDB.DocumentClient.PutItemInput = {
      TableName: this.tableName,
      Item: newItem,
    };
    this.logger.debug('Creating new campaign', { createData, putParams });
    await this.dynamoDbDocumentClient.put(putParams).promise();
    return newItem;
  }
}

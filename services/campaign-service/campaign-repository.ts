import * as uuid from 'uuid';
import { DynamoDB } from 'aws-sdk';
import Log from '@dazn/lambda-powertools-logger';
import {
  CreateCampaignRequest,
  CampaignDynamoDbRecord,
} from './campaign-repository.types';
export * from './campaign-repository.types';

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
      pk: createData.uid,
      sk: `C-${id}`,
      id: id,
      uid: createData.uid,
      created: timestamp,
      updated: timestamp,
      name: createData.name,
      from: createData.from,
      questionText: createData.questionText,
      destinations: createData.destinations,
      stats: {},
    };
    const putParams: DynamoDB.DocumentClient.PutItemInput = {
      TableName: this.tableName,
      Item: newItem,
    };
    this.logger.debug('Creating new campaign', { createData, putParams });
    await this.dynamoDbDocumentClient.put(putParams).promise();
    return newItem;
  }

  async increment(
    uid: string,
    campaignId: string,
    status: string,
  ): Promise<CampaignDynamoDbRecord> {
    const updateParams = {
      TableName: this.tableName,
      Key: {
        pk: uid,
        sk: `C-${campaignId}`,
      },
      UpdateExpression: `set stats.${status} = if_not_exists(stats.${status}, :zero) + :one`,
      ExpressionAttributeValues: {
        ':zero': 0,
        ':one': 1,
      },
      ReturnValues: 'ALL_NEW',
    };
    this.logger.debug('Updating stats', { uid, campaignId, status });
    const result = await this.dynamoDbDocumentClient
      .update(updateParams)
      .promise();
    return result.Attributes as CampaignDynamoDbRecord;
  }

  async findAllByUserId(uid: string): Promise<CampaignDynamoDbRecord[]> {
    const queryParams: DynamoDB.DocumentClient.QueryInput = {
      TableName: this.tableName,
      KeyConditionExpression: 'pk = :uid and begins_with(sk, :prefix)',
      ExpressionAttributeValues: {
        ':uid': uid,
        ':prefix': 'C-',
      },
    };
    const result = await this.dynamoDbDocumentClient
      .query(queryParams)
      .promise();
    return result.Items as CampaignDynamoDbRecord[];
  }
}

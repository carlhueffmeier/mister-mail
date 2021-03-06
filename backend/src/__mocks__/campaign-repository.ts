import * as uuid from 'uuid';
import { DynamoDB } from 'aws-sdk';
import Log from '@dazn/lambda-powertools-logger';
import { CreateCampaignRequest, CampaignDynamoDbRecord } from '../types';
import { getEpochSeconds } from '../../lib/utils';

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
    const timestamp = getEpochSeconds();
    const id = uuid.v1();
    const newItem = {
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
    } as CampaignDynamoDbRecord;
    return newItem;
  }
}

import * as uuid from 'uuid';
import { DynamoDB } from 'aws-sdk';
import Log from '@dazn/lambda-powertools-logger';
import {
  CreateCampaignRequest,
  CampaignDynamoDbRecord,
} from '../campaign-repository.types';

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
      questionText: createData.questionText,
    };
    return newItem;
  }
}

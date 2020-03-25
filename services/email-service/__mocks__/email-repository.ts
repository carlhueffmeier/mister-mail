import { DynamoDB } from 'aws-sdk';
import Log from '@dazn/lambda-powertools-logger';
import { EmailDynamoDbRecord } from '../email-repository.types';
import { EmailStatus } from '../../../lib/types';
import { Email } from '../../../lib/types';

export * from '../email-repository.types';
export class EmailRepository {
  constructor(_options: {
    dynamoDbDocumentClient: DynamoDB.DocumentClient;
    tableName: string;
    logger: Log;
  }) {
    // Noop
  }

  async create(createData: Readonly<Email>): Promise<EmailDynamoDbRecord> {
    const timestamp = Date.now();
    return {
      pk: createData.messageId,
      sk: `mail`,
      uid: createData.uid,
      campaignId: createData.campaignId,
      messageId: createData.messageId,
      created: timestamp,
      updated: timestamp,
      status: createData.status,
    };
  }

  async updateStatus(_messageId: string, _status: EmailStatus): Promise<void> {
    // Noop
  }

  async findById(_messageId: string): Promise<EmailDynamoDbRecord> {
    return {} as EmailDynamoDbRecord;
  }
}

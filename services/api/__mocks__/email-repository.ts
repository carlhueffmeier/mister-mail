import { DynamoDB } from 'aws-sdk';
import Log from '@dazn/lambda-powertools-logger';
import {
  EmailStatus,
  Email,
  EmailDynamoDbRecord,
} from '../email-repository.types';

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
      messageId: createData.messageId,
      created: timestamp,
      updated: timestamp,
      status: createData.status,
    };
  }

  async updateStatus(_messageId: string, _status: EmailStatus): Promise<void> {
    // TODO
  }
}

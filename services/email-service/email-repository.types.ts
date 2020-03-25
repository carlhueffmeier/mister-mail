import { EmailStatus } from '../../lib/types';

export interface EmailDynamoDbRecord {
  pk: string;
  sk: string;
  created: number;
  updated: number;
  uid: string;
  campaignId: string;
  messageId: string;
  status: EmailStatus;
}

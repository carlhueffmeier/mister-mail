export enum EmailStatus {
  Created = 'Created',
  Sent = 'Sent',
  Delivered = 'Delivered',
  Complaint = 'Complaint',
  Rejected = 'Rejected',
  Bounce = 'Bounce',
  Opened = 'Opened',
  Responded = 'Responded',
}

export interface Email {
  messageId: string;
  status: EmailStatus;
}

export interface EmailDynamoDbRecord {
  pk: string;
  sk: string;
  created: number;
  updated: number;
  messageId: string;
  status: EmailStatus;
}

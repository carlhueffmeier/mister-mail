export interface Destination {
  name: string;
  email: string;
}

export interface Campaign {
  id: string;
  uid: string;
  created: number;
  updated: number;
  name: string;
  from: string;
  questionText: string;
  destinations: Destination[];
}

export interface CampaignCreatedEvent {
  name: 'CampaignCreatedEvent';
  timestamp: number;
  campaign: Campaign;
}

export interface EmailStatusEvent {
  name: 'EmailStatusEvent';
  timestamp: number;
  email: Email;
}

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
  uid: string;
  campaignId: string;
  messageId: string;
  status: EmailStatus;
}

export interface SendEmailRequest {
  uid: string;
  campaignId: string;
  subject: string;
  text: string;
  html: string;
  source: string;
  destination: string;
}

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

export interface AppSyncEvent<TArguments> {
  identity: AppSyncCognitoIdentity;
  field: string;
  arguments: TArguments;
}
export interface CreateCampaignInput {
  data: {
    name: string;
    questionText: string;
    destinations: Destination[];
  };
}

export type CreateCampaignAppSyncEvent = AppSyncEvent<CreateCampaignInput>;

export interface AppSyncCognitoIdentity {
  claims: {
    sub: string;
    email: string;
  };
}

export interface CreateCampaignRequest {
  uid: string;
  from: string;
  name: string;
  questionText: string;
  destinations: Destination[];
}

export interface CampaignDynamoDbRecord {
  pk: string;
  sk: string;
  id: string;
  uid: string;
  created: number;
  updated: number;
  name: string;
  from: string;
  questionText: string;
  destinations: Destination[];
  stats: object;
}

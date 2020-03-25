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

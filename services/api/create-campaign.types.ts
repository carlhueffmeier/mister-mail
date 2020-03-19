export interface Destination {
  name: string;
  email: string;
}

export interface RequestBody {
  name: string;
  questionText: string;
  destinations: Destination[];
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

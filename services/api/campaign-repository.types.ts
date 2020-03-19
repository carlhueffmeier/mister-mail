import { Destination } from './create-campaign.types';

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
}

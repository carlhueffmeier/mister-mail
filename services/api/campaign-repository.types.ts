export interface CreateCampaignRequest {
  uid: string;
  name: string;
  questionText: string;
}

export interface CampaignDynamoDbRecord {
  pk: string;
  sk: string;
  id: string;
  uid: string;
  created: number;
  updated: number;
  name: string;
  questionText: string;
}

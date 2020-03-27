import { Destination } from '../../lib/types';

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

/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateCampaignInput = {
  name: string,
  questionText: string,
  destinations: Array< DestinationInput >,
};

export type DestinationInput = {
  name: string,
  email: string,
};

export type CreateCampaignMutationVariables = {
  data: CreateCampaignInput,
};

export type CreateCampaignMutation = {
  createCampaign:  {
    __typename: "Campaign",
    id: string,
    uid: string,
    created: string,
    updated: string,
    name: string,
    from: string,
    questionText: string,
    destinations:  Array< {
      __typename: "Destination",
      name: string,
      email: string,
    } >,
    stats:  {
      __typename: "CampaignStats",
      Created: number | null,
      Sent: number | null,
      Delivered: number | null,
      Complaint: number | null,
      Rejected: number | null,
      Bounce: number | null,
      Opened: number | null,
      Responded: number | null,
    },
  },
};

export type GetCampaignsQuery = {
  getCampaigns:  Array< {
    __typename: "Campaign",
    id: string,
    uid: string,
    created: string,
    updated: string,
    name: string,
    from: string,
    questionText: string,
    destinations:  Array< {
      __typename: "Destination",
      name: string,
      email: string,
    } >,
    stats:  {
      __typename: "CampaignStats",
      Created: number | null,
      Sent: number | null,
      Delivered: number | null,
      Complaint: number | null,
      Rejected: number | null,
      Bounce: number | null,
      Opened: number | null,
      Responded: number | null,
    },
  } >,
};

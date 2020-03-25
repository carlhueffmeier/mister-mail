/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type GetCampaignsQuery = {
  getCampaigns:  Array< {
    __typename: "Campaign",
    id: string | null,
    uid: string | null,
    created: string | null,
    updated: string | null,
    name: string | null,
    from: string | null,
    questionText: string | null,
    destinations:  Array< {
      __typename: "Destination",
      name: string | null,
      email: string | null,
    } | null > | null,
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
    } | null,
  } >,
};

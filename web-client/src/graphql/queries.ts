// tslint:disable
// this is an auto generated file. This will be overwritten

export const getCampaigns = /* GraphQL */ `
  query GetCampaigns {
    getCampaigns {
      id
      uid
      created
      updated
      name
      from
      questionText
      destinations {
        name
        email
      }
      stats {
        Created
        Sent
        Delivered
        Complaint
        Rejected
        Bounce
        Opened
        Responded
      }
    }
  }
`;
export const getCampaign = /* GraphQL */ `
  query GetCampaign($where: CampaignWhereUniqueInput!) {
    getCampaign(where: $where) {
      id
      uid
      created
      updated
      name
      from
      questionText
      destinations {
        name
        email
      }
      stats {
        Created
        Sent
        Delivered
        Complaint
        Rejected
        Bounce
        Opened
        Responded
      }
    }
  }
`;

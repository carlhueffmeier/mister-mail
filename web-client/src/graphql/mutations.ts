// tslint:disable
// this is an auto generated file. This will be overwritten

export const createCampaign = /* GraphQL */ `
  mutation CreateCampaign($data: CreateCampaignInput!) {
    createCampaign(data: $data) {
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
export const notifyCampaignUpdate = /* GraphQL */ `
  mutation NotifyCampaignUpdate($data: NotifyCampaignUpdateInput!) {
    notifyCampaignUpdate(data: $data) {
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

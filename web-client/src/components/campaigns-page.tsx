import React, { useEffect } from 'react';
import * as queries from '../graphql/queries';
import * as subscriptions from '../graphql/subscriptions';
import {
  GetCampaignsQuery,
  CampaignUpdateSubscription,
} from '../graphql/types';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import uniqBy from 'lodash/uniqBy';

const EMAIL_STATS_COLUMNS = [
  'Sent',
  'Opened',
  'Responded',
  'Complaint',
  'Rejected',
  'Bounce',
];

function mergeQueryWithSubscriptionData(
  prev: GetCampaignsQuery,
  next: { subscriptionData: { data: CampaignUpdateSubscription } },
): GetCampaignsQuery {
  if (!next.subscriptionData.data) {
    return prev;
  }
  return {
    getCampaigns: uniqBy(
      [next.subscriptionData.data.campaignUpdate, ...prev.getCampaigns],
      'id',
    ) as GetCampaignsQuery['getCampaigns'],
  };
}

export function CampaignsPage() {
  const { loading, error, data, subscribeToMore } = useQuery<GetCampaignsQuery>(
    gql(queries.getCampaigns),
  );
  useEffect(
    () =>
      subscribeToMore<CampaignUpdateSubscription>({
        document: gql(subscriptions.campaignUpdate),
        updateQuery: mergeQueryWithSubscriptionData,
      }),
    [],
  );

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error: {error}</p>;
  }
  return (
    <div>
      <h2>Campaigns</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Destinations</th>
            {EMAIL_STATS_COLUMNS.map(name => (
              <th key={name}>{name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data!.getCampaigns.map((campaign: any) => (
            <tr key={campaign.id}>
              <td className="centered">{campaign.name}</td>
              <td className="centered">{campaign.destinations.length}</td>
              {EMAIL_STATS_COLUMNS.map(name => (
                <td className="centered" key={name}>
                  {campaign.stats[name] || 0}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

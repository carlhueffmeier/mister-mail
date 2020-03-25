import React, { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import * as queries from '../graphql/queries';
import { GetCampaignsQuery } from '../graphql/types';

const EMAIL_STATS_COLUMNS = [
  'Sent',
  'Opened',
  'Responded',
  'Complaint',
  'Rejected',
  'Bounce',
];

export function CampaignsPage() {
  const [userCampaigns, setUserCampaigns] = useState<
    GetCampaignsQuery['getCampaigns'] | null
  >(null);

  useEffect(() => {
    let isSubscribed = true;

    API.graphql(graphqlOperation(queries.getCampaigns))
      .then((campaigns: { data: GetCampaignsQuery }) => {
        if (isSubscribed) {
          setUserCampaigns(campaigns.data.getCampaigns);
        }
      })
      .catch((error: any) => console.error(error.errors || error));

    return () => {
      isSubscribed = false;
    };
  }, []);

  return (
    <div>
      <h2>Campaigns</h2>

      {userCampaigns === null ? (
        <p>Loading...</p>
      ) : (
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
            {userCampaigns.map((campaign: any) => (
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
      )}
    </div>
  );
}

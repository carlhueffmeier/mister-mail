import React, { useState, useEffect } from 'react';
import { Link, Switch, Route, useRouteMatch } from 'react-router-dom';
import { CreateCampaignPage } from './create-campaign-page';
import { getCampaigns } from '../lib/api';

export function CampaignsPage() {
  const { path, url } = useRouteMatch();
  const [userCampaigns, setUserCampaigns] = useState<any>(null);

  useEffect(() => {
    let isSubscribed = true;
    getCampaigns().then(campaigns => {
      isSubscribed && setUserCampaigns(campaigns);
    });
  }, []);

  return (
    <div>
      <h2>Campaigns</h2>

      <Switch>
        <Route exact path={path}>
          {userCampaigns === null ? (
            <p>Loading...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Destinations</th>
                  <th>Opened</th>
                  <th>Answered</th>
                </tr>
              </thead>
              <tbody>
                {userCampaigns.map((campaign: any) => (
                  <tr key={campaign.id}>
                    <td>{campaign.name}</td>
                    <td>{campaign.destinations.length}</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <Link to={`${url}/create`}>Create new campaign</Link>
        </Route>
        <Route exact path={`${path}/create`}>
          <CreateCampaignPage />
        </Route>
      </Switch>
    </div>
  );
}

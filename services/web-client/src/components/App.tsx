import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { CampaignsPage } from './campaigns-page';
import { CreateCampaignPage } from './create-campaign-page';
import { signOut } from '../lib/auth-utils';

function App() {
  return (
    <div>
      <ul>
        <li>
          <Link to="/campaigns">Campaigns</Link>
        </li>
        <li>
          <Link to="/campaigns/create">New Campaign</Link>
        </li>
        <li>
          <button onClick={signOut}>Sign Out</button>
        </li>
      </ul>

      <hr />

      <Switch>
        <Route exact path="/campaigns">
          <CampaignsPage />
        </Route>
        <Route exact path="/campaigns/create">
          <CreateCampaignPage />
        </Route>
      </Switch>
    </div>
  );
}

export default App;

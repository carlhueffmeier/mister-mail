import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';
import Amplify, { Auth } from 'aws-amplify';
import { withAuthenticator } from "aws-amplify-react";
import { config } from '../config';
import { CampaignsPage } from './campaigns-page';
import { CreateCampaignPage } from './create-campaign-page';

Amplify.configure({ 
  Auth: {
    mandatorySignIn: true,
    identityPoolId: config.identityPoolId,
    region: config.region,
    userPoolId: config.userPoolId,
    userPoolWebClientId: config.userPoolWebClientId,
  },
  aws_appsync_graphqlEndpoint: config.graphQlApiUrl,
  aws_appsync_region: config.region,
  aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS",
});

function App() {
  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/campaigns">Campaigns</Link>
          </li>
          <li>
            <Link to="/campaigns/create">New Campaign</Link>
          </li>
          <li>
            <button onClick={() => Auth.signOut()}>Sign Out</button>
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
    </Router>
  );
}

export default withAuthenticator(App);

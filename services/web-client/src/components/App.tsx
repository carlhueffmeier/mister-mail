import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';
import Amplify, { Auth } from 'aws-amplify';
import { config } from '../config';
import { SignInPage } from './sign-in-page';
import { CampaignsPage } from './campaigns-page';
import { useAuthStatus } from '../lib/auth-utils';
import { ProtectedRoute } from './protected-route';

Amplify.configure({ Auth: config.auth });

function App() {
  const isAuthenticated = useAuthStatus();

  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/campaigns">Campaigns</Link>
          </li>
          <li>
            {isAuthenticated ? (
              <button onClick={() => Auth.signOut()}>Sign Out</button>
            ) : (
              <Link to="/signin">Sign In</Link>
            )}
          </li>
        </ul>

        <hr />

        <Switch>
          <Route exact path="/signin">
            <SignInPage />
          </Route>
          <ProtectedRoute path="/campaigns">
            <CampaignsPage />
          </ProtectedRoute>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

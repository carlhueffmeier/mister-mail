import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Amplify from '@aws-amplify/core';
import Auth from '@aws-amplify/auth';
import { withAuthenticator } from 'aws-amplify-react';
import { createAuthLink, AuthOptions, AUTH_TYPE } from 'aws-appsync-auth-link';
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link';
import ApolloClient from 'apollo-client';
import { ApolloProvider } from '@apollo/react-common';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import * as serviceWorker from './serviceWorker';
import App from './components/App';
import { config } from './config.js';
import appSyncConfig from './aws-exports.js';
import './index.css';

async function getJwtToken() {
  return (await Auth.currentSession()).getIdToken().getJwtToken();
}

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: appSyncConfig.aws_project_region,
    identityPoolId: config.identityPoolId,
    userPoolId: config.userPoolId,
    userPoolWebClientId: config.userPoolWebClientId,
  },
  aws_appsync_graphqlEndpoint: appSyncConfig.aws_appsync_graphqlEndpoint,
  aws_appsync_region: appSyncConfig.aws_appsync_region,
  aws_appsync_authenticationType: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
  // By default Amplify will use the accessToken instead of the idToken.
  // The accessToken does not include the claims with custom attributes like user email.
  graphql_headers: async () => ({ Authorization: await getJwtToken() }),
});

const apolloConfig = {
  url: appSyncConfig.aws_appsync_graphqlEndpoint,
  region: appSyncConfig.aws_project_region,
  auth: {
    type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
    jwtToken: getJwtToken,
  } as AuthOptions,
};

const apolloClient = new ApolloClient({
  link: ApolloLink.from([
    createAuthLink(apolloConfig),
    createSubscriptionHandshakeLink(apolloConfig),
  ]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

const RootComponent = withAuthenticator(() => (
  <ApolloProvider client={apolloClient}>
    <Router>
      <App />
    </Router>
  </ApolloProvider>
));

ReactDOM.render(<RootComponent />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

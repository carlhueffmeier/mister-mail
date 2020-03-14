import React from 'react';
import logo from './logo.svg';
import './App.css';
import Amplify, { Auth } from 'aws-amplify';
import axios from 'axios';
import { config } from './config';

Amplify.configure({ Auth: config.auth });

async function signIn(options: { username: string; password: string }) {
  try {
    const user = await Auth.signIn(options.username, options.password);
    console.log(user);
  } catch (error) {
    console.error(error);
  }
}

interface CreateCampaignRequest {
  name: string;
  questionText: string;
}

async function getJwtToken(): Promise<string> {
  return Auth.currentSession()
    .then(session => session.getIdToken())
    .then(idToken => idToken.getJwtToken());
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  return { Authorization: await getJwtToken() };
}

async function createCampaign(
  createRequest: CreateCampaignRequest,
): Promise<void> {
  try {
    const response = await axios.post(`${config.baseUrl}/create`, createRequest, {
      headers: await getAuthHeaders(),
    });
    console.log('new campaign', response);
  } catch (error) {
    console.error(error);
  }
}

async function signUp(options: {
  username: string;
  password: string;
}): Promise<void> {
  try {
    const result = await Auth.signUp(options);
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

function App() {
  const createCampaignRequest = {
    name: 'Camping trip',
    questionText: 'Do you want to join?',
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <button
          onClick={() =>
            signIn({
              username: 'carlhueffmeier@gmail.com',
              password: 'trustNo1!',
            })
          }
        >
          Sign In
        </button>
        <button
          onClick={() =>
            signUp({
              username: 'carlhueffmeier@gmail.com',
              password: 'trustNo1!',
            })
          }
        >
          Sign Up
        </button>
        <button onClick={() => createCampaign(createCampaignRequest)}>
          Create campaign
        </button>
      </header>
    </div>
  );
}

export default App;

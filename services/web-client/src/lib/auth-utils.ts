import { Auth } from 'aws-amplify';

export async function getJwtToken(): Promise<string> {
  return Auth.currentSession()
    .then(session => session.getIdToken())
    .then(idToken => idToken.getJwtToken());
}

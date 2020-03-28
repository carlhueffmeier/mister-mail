import Auth from '@aws-amplify/auth';

export async function signOut() {
  await Auth.signOut();
}
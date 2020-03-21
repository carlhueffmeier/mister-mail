import { useState, useEffect } from 'react';
import { Auth, Hub } from 'aws-amplify';
import { HubCapsule } from '@aws-amplify/core/lib/Hub';

export async function getJwtToken(): Promise<string> {
  return Auth.currentSession()
    .then(session => session.getIdToken())
    .then(idToken => idToken.getJwtToken());
}

export function useAuthStatus() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  useEffect(() => {
    let isSubscribed = true;
    Auth.currentAuthenticatedUser()
      .then(() => isSubscribed && setIsAuthenticated(true))
      .catch(() => isSubscribed && setIsAuthenticated(false));
    const authEventListener = (data: HubCapsule) => {
      switch (data.payload.event) {
        case 'signIn':
        case 'signUp':
          isSubscribed && setIsAuthenticated(true);
          break;
        case 'signOut':
          isSubscribed && setIsAuthenticated(false);
          break;
      }
    };
    Hub.listen('auth', authEventListener);
    return () => {
      isSubscribed = false;
      Hub.remove('auth', authEventListener);
    };
  }, []);

  return isAuthenticated;
}

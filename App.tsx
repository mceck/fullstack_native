import React from 'react';
import useCachedResources from './hooks/useCachedResources';
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  from,
  HttpLink,
  InMemoryCache,
  Observable,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { API_URL } from './constants';
import {
  getAccessToken,
  setAccessToken,
  User,
  UserProvider,
} from './authentication';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import jwtDecode from 'jwt-decode';
import { AppFrame } from './AppFrame';

const cache = new InMemoryCache();

const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable((observer) => {
      let handle: any;
      Promise.resolve(operation)
        .then((operation) => {
          const token = getAccessToken();
          if (token)
            operation.setContext({
              headers: { authorization: `bearer ${token}` },
            });
        })
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            complete: observer.complete.bind(observer),
            error: observer.error.bind(observer),
          });
        })
        .catch(observer.error.bind(observer));
      return () => handle?.unsubscribe();
    })
);

const client = new ApolloClient({
  link: from([
    new TokenRefreshLink({
      accessTokenField: 'token',
      isTokenValidOrUndefined: () => {
        const accessToken = getAccessToken();
        if (!accessToken) return true;
        try {
          const user = jwtDecode<User>(accessToken);
          if (Date.now() > user.exp! * 1000) {
            return false;
          }
          return true;
        } catch (error) {
          console.log(error);
          return false;
        }
      },
      fetchAccessToken: () => {
        return fetch(`${API_URL}/api/refresh-token`, {
          method: 'POST',
          credentials: 'include',
        });
      },
      handleFetch: (token) => {
        setAccessToken(token);
      },
      handleError: (error) => {
        console.log(error);
      },
    }),
    onError(({ networkError }) => {
      console.log(networkError);
    }),
    requestLink,
    new HttpLink({
      uri: `${API_URL}/graphql`,
      credentials: 'include',
    }),
  ]),
  cache,
});

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <ApolloProvider client={client}>
        <UserProvider>
          <AppFrame />
        </UserProvider>
      </ApolloProvider>
    );
  }
}

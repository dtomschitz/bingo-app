import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
  Observable,
  from,
  gql,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { ErrorType, getErrorMessage } from '@bingo/models';
import { REFRESH_ACCESS_TOKEN } from '@bingo/gql';
import {
  AuthProvider,
  AppBarProvider,
  GameInstanceProvider,
  GamesProvider,
} from './app/hooks';
import App from './app/App';

import '@szhsin/react-menu/dist/index.css';

const refreshAccessToken = (refreshToken: string) => {
  return client
    .mutate<{ refreshAccessToken: string }>({
      mutation: REFRESH_ACCESS_TOKEN,
      variables: {
        refreshToken,
      },
      fetchPolicy: 'no-cache',
    })
    .then(result => {
      const token = result.data.refreshAccessToken;
      localStorage.setItem('accessToken', token);
      return token;
    });
};

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (const i in graphQLErrors) {
        const error = graphQLErrors[i];
        if (error.message === ErrorType.UNAUTHORIZED) {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            return forward(operation);
          }

          return new Observable(observer => {
            refreshAccessToken(refreshToken)
              .then(accessToken => {
                operation.setContext(({ headers = {} }: any) => ({
                  headers: {
                    ...headers,
                    authorization: accessToken ? `Bearer ${accessToken}` : '',
                  },
                }));
              })
              .then(() => {
                const subscriber = {
                  next: observer.next.bind(observer),
                  error: observer.error.bind(observer),
                  complete: observer.complete.bind(observer),
                };

                forward(operation).subscribe(subscriber);
              })
              .catch(error => {
                observer.error(error);
              });
          });
        }

        const message = getErrorMessage(error.message as ErrorType);
        if (message) {
          toast.error(message);
        }

        return forward(operation);
      }
    }

    return forward(operation);
  },
);

const authLink = setContext((_, { headers }) => {
  const accessToken = localStorage.getItem('accessToken');

  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
  };
});

const httpLink = createHttpLink({
  uri: 'http://localhost:8000/graphql',
});

const cache = new InMemoryCache({
  typePolicies: {
    BingoGame: {
      fields: {
        fields: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: cache,
});

ReactDOM.render(
  <StrictMode>
    <BrowserRouter>
      <AppBarProvider>
        <AuthProvider client={client}>
          <GamesProvider client={client}>
            <GameInstanceProvider client={client}>
              <ApolloProvider client={client}>
                <App />
              </ApolloProvider>
            </GameInstanceProvider>
          </GamesProvider>
        </AuthProvider>
      </AppBarProvider>
    </BrowserRouter>
    <Toaster
      position="top-right"
      toastOptions={{ className: 'notification' }}
    />
  </StrictMode>,
  document.getElementById('root'),
);

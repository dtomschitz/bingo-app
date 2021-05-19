import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
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
import { RefreshAccessTokenResult, ErrorType } from '@bingo/models';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, AppBarProvider } from './app/hooks';
import App from './app/App';

const REFRESH_ACCESS_TOKEN = gql`
  mutation RefreshAccessToken($refreshToken: String!) {
    refreshAccessToken(props: { refreshToken: $refreshToken }) {
      accessToken
    }
  }
`;

const refreshAccessToken = () => {
  const refreshToken = localStorage.getItem('refreshToken');

  return client
    .mutate<{ refreshAccessToken: RefreshAccessTokenResult }>({
      mutation: REFRESH_ACCESS_TOKEN,
      variables: {
        refreshToken,
      },
      fetchPolicy: 'no-cache',
    })
    .then(result => {
      const token = result.data.refreshAccessToken.accessToken;
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
          return new Observable(observer => {
            refreshAccessToken()
              .then(accessToken => {
                console.log(accessToken);

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

const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <StrictMode>
    <BrowserRouter>
      <AppBarProvider>
        <AuthProvider client={client}>
          <ApolloProvider client={client}>
            <App />
          </ApolloProvider>
        </AuthProvider>
      </AppBarProvider>
    </BrowserRouter>
  </StrictMode>,
  document.getElementById('root'),
);

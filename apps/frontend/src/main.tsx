import { StrictMode } from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import * as ReactDOM from 'react-dom';

import App from './app/App';

const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql',
});

ReactDOM.render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>,
  document.getElementById('root'),
);

import { ApolloProvider } from '@apollo/client';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { GET_GAMES } from '@bingo/gql';
import { GamesProvider, AuthProvider } from '../hooks';
import Home from '../Home';
import { createDefaultMockClient, generateMockedGame, AuthMock } from './utils';

describe('Home', () => {
  it('should render the home screen', async () => {
    const client = createDefaultMockClient();
    client.setRequestHandler(GET_GAMES, () =>
      Promise.resolve({ data: { games: [generateMockedGame()] } }),
    );

    await act(async () => {
      const component = render(
        <AuthProvider client={client}>
          <GamesProvider client={client}>
            <ApolloProvider client={client}>
              <AuthMock>
                <Home/>
              </AuthMock>
            </ApolloProvider>
          </GamesProvider>
        </AuthProvider>,
      );

      expect(component).toBeTruthy();
    });

    const container = document.querySelector('div.games');
    const games = document.querySelectorAll('div.bingo-preview-card');
    const game = document.children[0];

    console.log(game.querySelector('div.badge').textContent);

    expect(container).toBeTruthy();
    expect(games).toBeTruthy();
    expect(games.length).toEqual(1);

    expect(game.querySelector('div.card-title').textContent).toBe('Test Game');
    expect(game.querySelector('div.badge').textContent).toBe('In Bearbeitung');
  });
});

import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { RouteComponentProps } from 'react-router';
import { BingoGame } from '../../../lib/models';
import { BingoCard } from './bingo';

interface GameProps {
  gameId: string;
}

const GET_GAME = gql`
  query GetGame($id: ID!) {
    game(_id: $id) {
      _id
      title
      fields {
        _id
        text
      }
    }
  }
`;

const Game = (props: RouteComponentProps<GameProps>) => {
  const id = props.match.params.gameId;
  const { error, loading, data } = useQuery<{ game: BingoGame }>(GET_GAME, {
    variables: { id },
  });

  const onWin = () => {
    //TODO: Win Logic
  };

  return (
    <div className="game">
      {data?.game.fields && (
        <BingoCard fields={data?.game.fields} onWin={onWin} />
      )}
    </div>
  );
};

export default Game;

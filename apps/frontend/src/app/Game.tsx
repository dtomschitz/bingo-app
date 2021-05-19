import { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { RouteComponentProps } from 'react-router';
import { BingoGame } from '@bingo/models';
import { BingoCard } from './components/bingo';
import { FlatButton } from './components/common';
import { useAuth } from './hooks';

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

  const auth = useAuth();
  const [hasWon, setHasWon] = useState(false);

  const { error, loading, data } = useQuery<{ game: BingoGame }>(GET_GAME, {
    variables: { id },
  });

  const onWin = () => {
    console.log('Win');

    //TODO: Win Logic
  };

  const isAdmin = true;

  return (
    <div className="game">
      {isAdmin && <AdminControls />}
      {data?.game.fields && (
        <BingoCard fields={data?.game.fields} onWin={() => setHasWon(false)} />
      )}
      <FlatButton className="bingo-button">BINGO</FlatButton>
    </div>
  );
};

const AdminControls = () => {
  const pullField = () => {
    //
  };

  return (
    <div className="admin-controls">
      <FlatButton onClick={pullField}>Neues Bingo Feld aufdecken</FlatButton>
    </div>
  );
};

export default Game;

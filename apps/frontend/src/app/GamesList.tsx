import { BingoGame, Phase } from '@bingo/models';
import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { BingoPreviewCard } from './components/bingo';
import {
  CreateGameInstanceDialog,
  CreateGameInstanceDialogData,
} from './dialogs';
import { useAuthContext, useDialog, useGamesContext } from './hooks';

interface GamesListProps {
  phase: Phase;
}

const GamesList = (props: GamesListProps) => {
  const history = useHistory();
  const auth = useAuthContext();
  const dialog = useDialog<CreateGameInstanceDialogData>();
  const { games, loadGames } = useGamesContext();

  useEffect(() => {
    if (auth.isLoggedIn) {
      loadGames();
    }
  }, [auth.isLoggedIn]);

  const onClick = (game: BingoGame) => {
    if (game.hasInstance) {
      history.push(`/game/${game._id}`);
      return;
    }

    dialog.open({
      _id: game._id,
      title: game.title,
    });
  };

  return (
    <div className="home">
      <div className="games">
        {games.filter(game => game.phase === props.phase).map((game, i) => (
          <BingoPreviewCard
            key={`game-${i}`}
            game={game}
            onClick={() => onClick(game)}
          />
        ))}
      </div>
      <CreateGameInstanceDialog {...dialog} />
    </div>
  );
};

export default GamesList;

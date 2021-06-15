import { BingoGame, GamePhase } from '@bingo/models';
import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { BingoGameContextMenu, BingoPreviewCard } from './components/bingo';
import {
  CreateGameInstanceDialog,
  CreateGameInstanceDialogData,
  DeleteGameDialog,
  DeleteGameDialogData,
  ModifyGameFieldsDialog,
  ModifyGameFieldsDialogData,
  ModifyGameTitleDialog,
  ModifyGameTitleDialogData,
} from './dialogs';
import { useAuthContext, useDialog, useGamesContext } from './hooks';

interface GamesListProps {
  phase: GamePhase;
}

const Games = (props: GamesListProps) => {
  const history = useHistory();
  const auth = useAuthContext();
  const { games, loadGames } = useGamesContext();

  const gameInstanceDialog = useDialog<CreateGameInstanceDialogData>();
  const modifyGameTitleDialog = useDialog<ModifyGameTitleDialogData>();
  const modifyGameFieldsDialog = useDialog<ModifyGameFieldsDialogData>();
  const deleteGameDialog = useDialog<DeleteGameDialogData>();

  useEffect(() => {
    if (auth.isLoggedIn) {
      loadGames();
    }
  }, [auth.isLoggedIn]);

  const openGame = (game: BingoGame) => {
    if (game.hasInstance) {
      history.push(`/game/${game._id}`);
      return;
    }

    gameInstanceDialog.open({
      _id: game._id,
      title: game.title,
    });
  };

  const onModifyTitle = (game: BingoGame) => {
    modifyGameTitleDialog.open({ game });
  };

  const onModifyFields = (game: BingoGame) => {
    modifyGameFieldsDialog.open({ game });
  };

  const onDeleteGame = (game: BingoGame) => {
    deleteGameDialog.open({ game });
  };

  return (
    <div className="home">
      {games.length !== 0 && (
        <div className="games">
          {games
            .filter(game => game.phase === props.phase)
            .map((game, i) => (
              <BingoPreviewCard
                key={`game-${i}`}
                menu={
                  game.authorId === auth.user?._id && (
                    <BingoGameContextMenu
                      {...game}
                      onModifyTitle={() => onModifyTitle(game)}
                      onModifyFields={() => onModifyFields(game)}
                      onDeleteGame={() => onDeleteGame(game)}
                    />
                  )
                }
                game={game}
                onClick={() => openGame(game)}
              />
            ))}

          <CreateGameInstanceDialog {...gameInstanceDialog} />
          <ModifyGameTitleDialog {...modifyGameTitleDialog} />
          {modifyGameFieldsDialog.show && (
            <ModifyGameFieldsDialog {...modifyGameFieldsDialog} />
          )}
          <DeleteGameDialog {...deleteGameDialog} />
        </div>
      )}
    </div>
  );
};

export default Games;

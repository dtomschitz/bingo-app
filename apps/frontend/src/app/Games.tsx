import { BingoGame, GamePhase } from '@bingo/models';
import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { BingoGameContextMenu, BingoPreviewCard } from './components/bingo';
import {
  CloseGameDialog,
  CloseGameDialogData,
  CreateGameInstanceDialog,
  CreateGameInstanceDialogData,
  DeleteGameDialog,
  DeleteGameDialogData,
  ModifyGameFieldsDialog,
  ModifyGameFieldsDialogData,
  ModifyGameTitleDialog,
  ModifyGameTitleDialogData,
  OpenGameDialogData,
} from './dialogs';
import { OpenGameDialog } from './dialogs/OpenGameDialog';
import { useAuthContext, useDialog, useGamesContext } from './hooks';

interface GamesListProps {
  myGames: boolean;
}

const Games = (props: GamesListProps) => {
  const history = useHistory();
  const auth = useAuthContext();
  const { games, loadGames } = useGamesContext();

  const gameInstanceDialog = useDialog<CreateGameInstanceDialogData>();
  const modifyGameTitleDialog = useDialog<ModifyGameTitleDialogData>();
  const modifyGameFieldsDialog = useDialog<ModifyGameFieldsDialogData>();
  const deleteGameDialog = useDialog<DeleteGameDialogData>();
  const openGameDialog = useDialog<OpenGameDialogData>();
  const closeGameDialog = useDialog<CloseGameDialogData>();

  useEffect(() => {
    if (auth.isLoggedIn) {
      loadGames();
    }
  }, [auth.isLoggedIn]);

  const openGame = (game: BingoGame) => {
    if (game.phase !== GamePhase.EDITING) {
      if (game.hasInstance) {
        history.push(`/game/${game._id}`);
        return;
      }

      gameInstanceDialog.open({
        _id: game._id,
        title: game.title,
      });
    }
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

  const onOpenGame = (game: BingoGame) => {
    openGameDialog.open({ game });
  };

  const onCloseGame = (game: BingoGame) => {
    closeGameDialog.open({ game });
  };

  return (
    <div className="home">
      {games.length !== 0 && (
        <div className="games">
          {games
            .filter(game =>
              props.myGames
                ? game.authorId === auth.user?._id
                : game.authorId !== auth.user?._id &&
                  game.phase === GamePhase.OPEN ||
                  game.hasInstance,
            )
            .map((game, i) => (
              <BingoPreviewCard
                key={`game-${i}`}
                menu={
                  game.authorId === auth.user?._id && (
                    <BingoGameContextMenu
                      {...game}
                      gamePhase={game.phase}
                      onModifyTitle={() => onModifyTitle(game)}
                      onModifyFields={() => onModifyFields(game)}
                      onDeleteGame={() => onDeleteGame(game)}
                      onOpenGame={() => onOpenGame(game)}
                      onCloseGame={() => onCloseGame(game)}
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
          <CloseGameDialog {...closeGameDialog} />
          <OpenGameDialog {...openGameDialog} />
        </div>
      )}
    </div>
  );
};

export default Games;

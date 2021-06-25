import { BingoGame, GamePhase, User } from '@bingo/models';
import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { Tabs, Tab } from './components/common';
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
import { OpenGameDialog } from './dialogs';
import { useAuthContext, useDialog, useGamesContext } from './hooks';

interface GamesListProps {
  games: BingoGame[];
  user?: User;
  showOwnGames: boolean;
}

const Home = () => {
  const { games, loadGames } = useGamesContext();
  const auth = useAuthContext();

  useEffect(() => {
    if (auth.isLoggedIn) {
      loadGames();
    }
  }, [auth.isLoggedIn]);

  return (
    <div className="home">
      <Tabs>
        <Tab label="Deine Spiele">
          <Games games={games} user={auth.user} showOwnGames={true} />
        </Tab>
        <Tab label="Andere Spiele">
          <Games games={games} user={auth.user} showOwnGames={false} />
        </Tab>
      </Tabs>
    </div>
  );
};

const Games = ({ games, showOwnGames, user }: GamesListProps) => {
  const history = useHistory();

  const gameInstanceDialog = useDialog<CreateGameInstanceDialogData>();
  const modifyGameTitleDialog = useDialog<ModifyGameTitleDialogData>();
  const modifyGameFieldsDialog = useDialog<ModifyGameFieldsDialogData>();
  const deleteGameDialog = useDialog<DeleteGameDialogData>();
  const openGameDialog = useDialog<OpenGameDialogData>();
  const closeGameDialog = useDialog<CloseGameDialogData>();

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
    <div className="games">
      {games.length !== 0 && (
        <>
          {games
            .filter(game =>
              showOwnGames
                ? game.authorId === user?._id
                : game.authorId !== user?._id &&
                  (game.phase === GamePhase.OPEN || game.hasInstance),
            )
            .map((game, i) => (
              <BingoPreviewCard
                key={`game-${i}`}
                menu={
                  game.authorId === user?._id && (
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
        </>
      )}
    </div>
  );
};

export default Home;

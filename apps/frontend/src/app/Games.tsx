import { BingoGame, Phase } from '@bingo/models';
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
  StartGameDialogData,
} from './dialogs';
import { StartGameDialog } from './dialogs/StartGameDialog';
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
  const startGameDialog = useDialog<StartGameDialogData>();

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

  return (
    <div className="home">
      <div className="games">
        {games
          .filter(game =>
            props.myGames
              ? game.authorId === auth.user._id
              : game.authorId !== auth.user._id,
          )
          .map((game, i) => (
            <BingoPreviewCard
              key={`game-${i}`}
              menu={
                game.authorId === auth.user._id && (
                  <BingoGameContextMenu
                    {...game}
                    onModifyTitle={() => modifyGameTitleDialog.open({ game })}
                    onModifyFields={() => modifyGameFieldsDialog.open({ game })}
                    onDeleteGame={() => deleteGameDialog.open({ game })}
                    onStartGame={() => startGameDialog.open({ game })}
                  />
                )
              }
              game={game}
              onClick={() => openGame(game)}
            />
          ))}
      </div>
      <CreateGameInstanceDialog {...gameInstanceDialog} />
      <ModifyGameTitleDialog {...modifyGameTitleDialog} />
      <ModifyGameFieldsDialog {...modifyGameFieldsDialog} />
      <DeleteGameDialog {...deleteGameDialog} />
      <StartGameDialog {...startGameDialog} />
    </div>
  );
};

export default Games;

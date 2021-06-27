import { BingoGame, GamePhase } from '@bingo/models';
import {
  BaseDialog,
  DialogActions,
  DialogContent,
  DialogHeader,
  Button,
  FlatButton,
  DialogProps,
} from '../components/common';
import { useGames } from '../hooks';

export interface OpenGameDialogData {
  game: BingoGame;
}

export const OpenGameDialog = (dialog: DialogProps<OpenGameDialogData>) => {
  const { updateGame } = useGames();

  const onOpen = async () => {
    await updateGame({
      _id: dialog?.data.game._id,
      changes: { phase: GamePhase.OPEN },
    });

    dialog.close();
  };

  return (
    <BaseDialog {...dialog} hideTopDivider hideBottomDivider>
      <DialogHeader>Spiel eröffnen</DialogHeader>
      <DialogContent>
        <p>
          Möchtest du das Spiel "{dialog.data?.game.title}" für andere Spieler
          eröffnen?
        </p>
      </DialogContent>
      <DialogActions>
        <Button onClick={dialog.close}>Abbrechen</Button>
        <FlatButton onClick={onOpen}>Freigeben</FlatButton>
      </DialogActions>
    </BaseDialog>
  );
};

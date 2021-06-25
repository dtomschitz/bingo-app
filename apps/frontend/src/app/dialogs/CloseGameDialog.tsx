import { BingoGame, GamePhase, UpdateGame } from '@bingo/models';
import {
  BaseDialog,
  DialogActions,
  DialogContent,
  DialogHeader,
  Button,
  FlatButton,
  DialogProps,
} from '../components/common';
import { useGamesContext } from '../hooks';

export interface CloseGameDialogData {
  game: BingoGame;
  onClose?: () => void;
}

export const CloseGameDialog = (dialog: DialogProps<CloseGameDialogData>) => {
  const { updateGame } = useGamesContext();

  const onClose = async () => {
    const gameUpdate: UpdateGame = {
      _id: dialog?.data.game._id,
      changes: { phase: GamePhase.FINISHED },
    };
    await updateGame(gameUpdate);

    dialog.data?.onClose();
    dialog.close();
  };

  return (
    <BaseDialog {...dialog} hideTopDivider hideBottomDivider>
      <DialogHeader>Spiel beenden</DialogHeader>
      <DialogContent>
        <p>Möchtest du das Spiel "{dialog.data?.game.title}" beenden?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={dialog.close}>Abbrechen</Button>
        <FlatButton onClick={onClose}>Beenden</FlatButton>
      </DialogActions>
    </BaseDialog>
  );
};

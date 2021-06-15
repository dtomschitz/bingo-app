import { BingoGame, UpdateGame } from '@bingo/models';
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
}

export const CloseGameDialog = (dialog: DialogProps<CloseGameDialogData>) => {
  const { updateGame } = useGamesContext();

  const onClose = async () => {
    const gameUpdate: UpdateGame = {
      _id: dialog?.data.game._id,
      changes: { phase: 'finished' },
    };
    await updateGame(gameUpdate);
    dialog.close();
  };

  return (
    <BaseDialog {...dialog} hideTopDivider hideBottomDivider>
      <DialogHeader>Spiel eröffnen</DialogHeader>
      <DialogContent>
        <p>Möchtest du das Spiel "{dialog.data?.game.title}" Abschließen?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={dialog.close}>Abbrechen</Button>
        <FlatButton onClick={onClose}>Beenden</FlatButton>
      </DialogActions>
    </BaseDialog>
  );
};

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

export interface StartGameDialogData {
  game: BingoGame;
}

export const StartGameDialog = (dialog: DialogProps<StartGameDialogData>) => {
  const { updateGame } = useGamesContext();

  const onStart = async () => {
    const gameUpdate: UpdateGame = {
      _id: dialog?.data.game._id,
      changes: { phase: 'playing' },
    };
    await updateGame(gameUpdate);
    dialog.close();
  };

  return (
    <BaseDialog {...dialog} hideTopDivider hideBottomDivider>
      <DialogHeader>Spiel starten</DialogHeader>
      <DialogContent>
        <p>Möchtest du das Spiel "{dialog.data?.game.title}" starten?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={dialog.close}>Abbrechen</Button>
        <FlatButton onClick={onStart}>Starten</FlatButton>
      </DialogActions>
    </BaseDialog>
  );
};

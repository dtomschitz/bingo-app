import { BingoGame } from '@bingo/models';
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

export interface DeleteGameDialogData {
  game: BingoGame;
}

export const DeleteGameDialog = (dialog: DialogProps<DeleteGameDialogData>) => {
  const { deleteGame } = useGames();

  const onDelete = async () => {
    await deleteGame(dialog?.data.game._id);
    dialog.close();
  };

  return (
    <BaseDialog {...dialog} hideTopDivider hideBottomDivider>
      <DialogHeader>Spiel beenden</DialogHeader>
      <DialogContent>
        <p>
          Möchtest du das Spiel "{dialog.data?.game.title}" sicher beenden? Das
          Spiel wird automatisch gelöscht und kann nicht wiederhergestellt
          werden!
        </p>
      </DialogContent>
      <DialogActions>
        <Button onClick={dialog.close}>Abbrechen</Button>
        <FlatButton onClick={onDelete}>Löschen</FlatButton>
      </DialogActions>
    </BaseDialog>
  );
};

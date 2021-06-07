import { BingoGame } from '@bingo/models';
import { useState } from 'react';
import {
  BaseDialog,
  Button,
  DialogActions,
  DialogContent,
  DialogHeader,
  DialogProps,
  FlatButton,
} from '../components/common';
import { useGamesContext } from '../hooks';

export interface ModifyGameTitleDialogData {
  game: BingoGame;
}

export const ModifyGameTitleDialog = (
  dialog: DialogProps<ModifyGameTitleDialogData>,
) => {
  const [title, setTitle] = useState(dialog.data?.game.title || '');
  const { updateGame } = useGamesContext();
  const canSave = !!title.trim();

  const onSave = async () => {
    await updateGame({
      _id: dialog.data?.game._id,
      changes: {
        title,
      },
    });
    dialog.close();
  };

  return (
    <BaseDialog
      {...dialog}
      className="modify-game-title-dialog"
      hideTopDivider
      hideBottomDivider
    >
      <DialogHeader>Titel bearbeiten</DialogHeader>
      <DialogContent>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Spieltitel"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={dialog.close}>Abbrechen</Button>
        <FlatButton onClick={onSave} disabled={!canSave}>
          Speichern
        </FlatButton>
      </DialogActions>
    </BaseDialog>
  );
};

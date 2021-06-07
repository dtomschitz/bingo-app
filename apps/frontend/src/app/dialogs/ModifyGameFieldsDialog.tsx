import { BingoGame, BingoField, MutationType } from '@bingo/models';
import { BingoFieldList, useBingoFieldListState } from '../components/bingo';
import {
  BaseDialog,
  Button,
  DialogActions,
  DialogContent,
  DialogHeader,
  DialogProps,
} from '../components/common';
import { useGamesContext } from '../hooks';

export interface ModifyGameFieldsDialogData {
  game: BingoGame;
}

export const ModifyGameFieldsDialog = (
  dialog: DialogProps<ModifyGameFieldsDialogData>,
) => {
  const { mutateField } = useGamesContext();
  const state = useBingoFieldListState();

  const onCreate = (field: BingoField) => {
    return mutateField(dialog?.data.game._id, {
      type: MutationType.CREATE,
      ...field,
    });
  };

  const onUpdate = (id: string, text: string) => {
    return mutateField(dialog?.data.game._id, {
      type: MutationType.UPDATE,
      _id: id,
      changes: {
        text,
      },
    });
  };

  const onDelete = (id: string) => {
    return mutateField(dialog?.data.game._id, {
      type: MutationType.DELETE,
      _id: id,
    });
  };

  return (
    <BaseDialog {...dialog} className="modify-game-fields-dialog">
      <DialogHeader>Felder bearbeiten</DialogHeader>
      <DialogContent>
        <BingoFieldList
          onCreate={onCreate}
          onUpdate={onUpdate}
          onDelete={onDelete}
          {...state}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={dialog.close}>Schließen</Button>
      </DialogActions>
    </BaseDialog>
  );
};

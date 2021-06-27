import { useHistory } from 'react-router-dom';
import {
  BaseDialog,
  DialogActions,
  DialogContent,
  DialogHeader,
  Button,
  FlatButton,
  DialogProps,
} from '../components/common';
import { useGameInstance } from '../hooks';

export interface CreateGameInstanceDialogData {
  _id: string;
  title: string;
}

export const CreateGameInstanceDialog = (
  props: DialogProps<CreateGameInstanceDialogData>,
) => {
  const history = useHistory();
  const { createGameInstance } = useGameInstance();

  const joinGame = async () => {
    const success = await createGameInstance(props.data?._id);
    if (!success) {
      props.close();
      return;
    }

    history.push(`/game/${props.data?._id}`);
  };

  return (
    <BaseDialog
      {...props}
      className="create-game"
      hideTopDivider
      hideBottomDivider
    >
      <DialogHeader>Spiel beitreten</DialogHeader>
      <DialogContent>
        <p>Möchtest du dem Spiel "{props.data?.title}" beitreten?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.close}>Abbrechen</Button>
        <FlatButton onClick={joinGame}>Beitreten</FlatButton>
      </DialogActions>
    </BaseDialog>
  );
};

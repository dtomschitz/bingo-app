import { useHistory } from 'react-router-dom';
import {
  BaseDialog,
  DialogActions,
  DialogContent,
  DialogHeader,
  DialogPane,
  Button,
  FlatButton,
  DialogProps,
} from '../components/common';
import { useGamesContext } from '../hooks';

export interface CreateGameInstanceDialogData {
  _id: string;
  title: string;
}

export const CreateGameInstanceDialog = (
  props: DialogProps<CreateGameInstanceDialogData>,
) => {
  const history = useHistory();
  const { createGameInstance } = useGamesContext();

  const joinGame = async () => {
    const result = await createGameInstance(props.data?._id);
    if (!result) {
      console.log('TEAdadwa');

      props.close();
      return;
    }

    history.push(`/game/${props.data?._id}`);
  };

  return (
    <BaseDialog {...props}>
      <DialogPane className="create-game">
        <DialogHeader>Spiel beitreten</DialogHeader>
        <DialogContent>
          <p>Möchtest du dem Spiel "{props.data?.title}" beitreten?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.close}>Abbrechen</Button>
          <FlatButton onClick={joinGame}>Beitreten</FlatButton>
        </DialogActions>
      </DialogPane>
    </BaseDialog>
  );
};

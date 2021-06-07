import { useState } from 'react';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  BaseDialog,
  Button,
  DialogActions,
  DialogContent,
  DialogHeader,
  DialogProps,
  FlatButton,
} from '../components/common';
import { BingoFieldList, useBingoFieldListState } from '../components/bingo';
import { useGamesContext } from '../hooks';

export const CreateGameDialog = (props: DialogProps) => {
  const { createGame } = useGamesContext();
  const [title, setTitle] = useState<string>('');
  const state = useBingoFieldListState();

  const validateFieldsLength = state.fields.length <= 25;
  const disableSaveButton = !validateFieldsLength && !title.trim();

  const saveGame = async () => {
    await createGame({ title, fields: state.fields.map(field => field.text) });
    props.close();
  };

  return (
    <BaseDialog {...props} className="create-game">
      <DialogHeader>Spiel erstellen</DialogHeader>
      <DialogContent>
        <div className="title">
          <input
            value={title}
            onChange={e => setTitle(e.currentTarget.value)}
            placeholder="Titel"
          />
        </div>
        <BingoFieldList {...state} />
      </DialogContent>
      <DialogActions>
        {validateFieldsLength && (
          <div className="warning">
            <FontAwesomeIcon icon={faInfoCircle} />
            Es müssen mindestens 25 Felder angelegt werden!
          </div>
        )}
        <div className="buttons">
          <Button onClick={props.close}>Abbrechen</Button>
          <FlatButton onClick={saveGame} disabled={disableSaveButton}>
            Speichern
          </FlatButton>
        </div>
      </DialogActions>
    </BaseDialog>
  );
};

import { useState } from 'react';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { v4 as uuidv4 } from 'uuid';
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
import { useGames } from '../hooks';

export const CreateGameDialog = (props: DialogProps) => {
  const { createGame } = useGames();
  const [title, setTitle] = useState<string>('');
  const state = useBingoFieldListState(
    Array.from({ length: 40 }).map((_, index) => ({
      _id: uuidv4(),
      text: `Field ${index}`,
      checked: false,
    })),
  );

  const validateFieldsLength = state.fields.length < 25;
  const disableSaveButton = validateFieldsLength || !title.trim();

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

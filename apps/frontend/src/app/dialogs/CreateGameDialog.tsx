import { useState } from 'react';
import {
  faCandyCane,
  faCheck,
  faInfoCircle,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  BaseDialog,
  Button,
  DialogActions,
  DialogContent,
  DialogHeader,
  DialogPane,
  DialogProps,
  Divider,
  FlatButton,
  IconButton,
} from '../components/common';
import { useGamesContext } from '../hooks';

interface AddBingoFieldInputProps {
  onSubmit: (value: string) => void;
}

interface BingoFieldItemProps {
  index: number;
  text: string;
  onUpdate: (index: number, value: string) => void;
  onDelete: (index: number) => void;
}

export const CreateGameDialog = (props: DialogProps) => {
  const { createGame } = useGamesContext();

  const [title, setTitle] = useState<string>('');
  const [fields, setFields] = useState<string[]>(
    Array.from({ length: 31 }, (_, i) => i + 1).map(i => `TEST ${i}`),
  );

  const canSave = fields.length <= 25;

  const saveGame = async () => {
    await createGame({ title, fields });
    props.close();
  };

  const addBingoField = (text: string) => {
    setFields(currentFields => [...currentFields, text]);
  };

  const updateBingoField = (index: number, text: string) => {
    const updatedFields = [...fields];
    updatedFields[index] = text;

    setFields(updatedFields);
  };

  const deleteBingoField = (index: number) => {
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);

    setFields(updatedFields);
  };

  return (
    <BaseDialog {...props}>
      <DialogPane className="create-game">
        <DialogHeader>Spiel erstellen</DialogHeader>
        <DialogContent>
          <div className="title">
            <input
              value={title}
              onChange={e => setTitle(e.currentTarget.value)}
              placeholder="Titel"
            />
          </div>
          <AddBingoFieldInput onSubmit={addBingoField} />
          <div className="bingo-fields">
            {fields.map((text, index) => (
              <BingoFieldItem
                key={`field-${index}`}
                index={index}
                text={text}
                onUpdate={updateBingoField}
                onDelete={deleteBingoField}
              />
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          {canSave && (
            <div className="warning">
              <FontAwesomeIcon icon={faInfoCircle} />
              Es müssen mindestens 25 Felder angelegt werden!
            </div>
          )}
          <div className="buttons">
            <Button onClick={props.close}>Abbrechen</Button>
            <FlatButton onClick={saveGame} disabled={canSave}>
              Speichern
            </FlatButton>
          </div>
        </DialogActions>
      </DialogPane>
    </BaseDialog>
  );
};

const AddBingoFieldInput = (props: AddBingoFieldInputProps) => {
  const [value, setValue] = useState('');
  const [state, setState] = useState(true);

  const onSubmit = () => {
    if (!value.trim()) return;

    props.onSubmit(value);
    setValue('');
  };

  const onChange = (value: string) => {
    setState(!value.trim());
    setValue(value);
  };

  return (
    <div className="input-container">
      <input
        value={value}
        onChange={e => onChange(e.currentTarget.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') onSubmit();
        }}
        placeholder="Feld hinzufügen"
      />
      <FlatButton onClick={onSubmit} disabled={state}>
        Hinzufügen
      </FlatButton>
    </div>
  );
};

const BingoFieldItem = ({
  index,
  text,
  onUpdate,
  onDelete,
}: BingoFieldItemProps) => {
  const initialValue = text;

  const [value, setValue] = useState(initialValue);
  const [editMode, setEditMode] = useState(false);

  const onChange = (value: string) => {
    setValue(value);
    setEditMode(true);
  };

  const onSave = () => {
    if (!value.trim()) {
      setValue(initialValue);
    } else {
      onUpdate(index, value);
    }

    setEditMode(false);
  };

  const onCancel = () => {
    setValue(initialValue);
    setEditMode(false);
  };

  return (
    <div className="bingo-field-container">
      <input
        value={value}
        onKeyDown={e => {
          if (e.key === 'Enter') onSave();
        }}
        onChange={e => onChange(e.target.value)}
        placeholder="Bingo Feld"
      />
      <div className="actions">
        {editMode && <IconButton onClick={onSave} icon={faCheck} />}
        {editMode && <IconButton onClick={onCancel} icon={faCandyCane} />}
        {editMode && <Divider vertical />}
        <IconButton onClick={() => onDelete(index)} icon={faTrash} />
      </div>
    </div>
  );
};

import { useState } from 'react';
import {
  faTrash,
  faCheck,
  faCandyCane,
} from '@fortawesome/free-solid-svg-icons';
import { BingoField } from '../../../lib/models';
import { Button, FlatButton, IconButton } from './common/Button';
import {
  BaseDialog,
  DialogActions,
  DialogContent,
  DialogHeader,
  DialogPane,
  DialogProps,
} from './common/Dialog';
import Divider from './common/Divider';

import { v4 as uuidv4 } from 'uuid';

interface AddBingoFieldInputProps {
  onSubmit: (value: string) => void;
}

interface BingoFieldItemProps {
  field: BingoField;
  onUpdate: (value: string) => void;
  onDelete: (id: string) => void;
}

const CreateGameDialog = (props: DialogProps) => {
  const [fields, setFields] = useState<BingoField[]>([]);

  const createGame = () => {
    //TODO: Create Game

    hide();
  };

  const hide = () => {
    props.onHide?.call(this);
  };

  const addBingoField = (text: string) => {
    setFields(currentFields => [
      ...currentFields,
      {
        id: uuidv4(),
        text,
      },
    ]);
  };

  const updateBingoField = (id: string, text: string) => {
    setFields(
      fields.map(field => (field.id === id ? { ...field, text } : field)),
    );
  };

  const deleteBingoField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
  };

  return (
    <BaseDialog {...props}>
      <DialogPane className="create-game">
        <DialogHeader>Spiel erstellen</DialogHeader>
        <DialogContent>
          <AddBingoFieldInput onSubmit={addBingoField} />
          <div className="bingo-fields">
            {fields.map(field => (
              <BingoFieldItem
                key={field.id}
                field={field}
                onUpdate={value => updateBingoField(field.id, value)}
                onDelete={deleteBingoField}
              />
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={hide}>Abbrechen</Button>
          <FlatButton onClick={createGame}>Speichern</FlatButton>
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

const BingoFieldItem = ({ field, onUpdate, onDelete }: BingoFieldItemProps) => {
  const initialValue = field.text;

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
      onUpdate(value);
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
        <IconButton onClick={() => onDelete(field.id)} icon={faTrash} />
      </div>
    </div>
  );
};

export default CreateGameDialog;

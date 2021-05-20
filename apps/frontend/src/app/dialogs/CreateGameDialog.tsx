import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import {
  faTrash,
  faCheck,
  faCandyCane,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BingoField } from '@bingo/models';
import { Button, FlatButton, IconButton } from '../components/common/Button';
import {
  BaseDialog,
  DialogActions,
  DialogContent,
  DialogHeader,
  DialogPane,
  DialogProps,
} from '../components/common/Dialog';
import { Divider } from '../components/common/Divider';

interface AddBingoFieldInputProps {
  onSubmit: (value: string) => void;
}

interface BingoFieldItemProps {
  field: BingoField;
  onUpdate: (value: string) => void;
  onDelete: (id: string) => void;
}

const CREATE_GAME = gql`
  mutation CreateGame($title: String!, $fields: [CreateBingoField!]!) {
    createGame(props: { title: $title, fields: $fields }) {
      _id
      title
      fields {
        _id
        text
      }
    }
  }
`;

export const CreateGameDialog = (props: DialogProps) => {
  const [title, setTitle] = useState<string>('');
  const [fields, setFields] = useState<BingoField[]>(
    Array.from({ length: 31 }, (_, i) => i + 1).map(i => ({
      _id: uuidv4(),
      text: `TEST ${i}`,
    })),
  );
  const [createGame] = useMutation(CREATE_GAME);

  const canSave = fields.length < 30;

  const saveGame = () => {
    createGame({
      variables: {
        title,
        fields,
      },
    });
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
        _id: uuidv4(),
        text,
      },
    ]);
  };

  const updateBingoField = (id: string, text: string) => {
    setFields(
      fields.map(field => (field._id === id ? { ...field, text } : field)),
    );
  };

  const deleteBingoField = (id: string) => {
    setFields(fields.filter(field => field._id !== id));
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
            {fields.map(field => (
              <BingoFieldItem
                key={field._id}
                field={field}
                onUpdate={value => updateBingoField(field._id, value)}
                onDelete={deleteBingoField}
              />
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          {canSave && (
            <div className="warning">
              <FontAwesomeIcon icon={faInfoCircle} />
              Es müssen mindestens 30 Felder angelegt werden!
            </div>
          )}
          <div className="buttons">
            <Button onClick={hide}>Abbrechen</Button>
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
        <IconButton onClick={() => onDelete(field._id)} icon={faTrash} />
      </div>
    </div>
  );
};

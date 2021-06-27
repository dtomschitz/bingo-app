import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { v4 as uuidv4 } from 'uuid';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { BingoField } from '@bingo/models';
import { EditableInputField, FlatButton, IconButton } from '../common';

interface AddBingoFieldInputProps {
  onSubmit: (field: BingoField) => void;
}

interface BingoFieldInputProps {
  text: string;
  onUpdate: (value: string) => boolean | Promise<boolean>;
  onDelete: () => void;
}

export const AddBingoFieldInput = (props: AddBingoFieldInputProps) => {
  const [value, setValue] = useState('');
  const [state, setState] = useState(true);
  const isMobile = useMediaQuery({ query: '(min-width: 500px)' });

  const onSubmit = () => {
    if (!value.trim()) return;

    props.onSubmit({
      _id: uuidv4(),
      text: value,
      checked: false,
    });

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
      {isMobile ? (
        <FlatButton onClick={onSubmit} disabled={state}>
          Hinzufügen
        </FlatButton>
      ) : (
        <IconButton onClick={onSubmit} icon={faPlus} disabled={state} />
      )}
    </div>
  );
};

export const BingoFieldInput = ({
  text,
  onUpdate,
  onDelete,
}: BingoFieldInputProps) => {
  return (
    <EditableInputField
      initialValue={text}
      placeholder="Bingo Feld"
      onUpdate={onUpdate}
      onDelete={onDelete}
    ></EditableInputField>
  );
};

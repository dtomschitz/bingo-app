import { faCheck, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { IconButton } from './Button';

interface EditableInputFieldProps {
  initialValue: string;
  placeholder?: string;
  onUpdate?: (value: string) => boolean | Promise<boolean>;
  onDelete?: () => void;
}

export const EditableInputField = ({
  initialValue,
  placeholder,
  onUpdate,
  onDelete,
}: EditableInputFieldProps) => {
  const [value, setValue] = useState(initialValue);
  const [editMode, setEditMode] = useState(false);

  const onChange = (value: string) => {
    setValue(value);
    setEditMode(true);
  };

  const onSave = async () => {
    if (!value.trim()) {
      reset(false);
    } else {
      const success = await onUpdate(value);
      if (!success) reset(false);
    }

    setEditMode(false);
  };

  const onCancel = () => reset(false);

  const reset = (editMode?: boolean) => {
    setValue(initialValue);
    setEditMode(editMode);
  };

  return (
    <div className="editable-input-field-container">
      <input
        value={value}
        onKeyDown={e => {
          if (e.key === 'Enter') onSave();
        }}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <div className="actions">
        {editMode && (
          <>
            <IconButton onClick={onSave} icon={faCheck} />
            <IconButton onClick={onCancel} icon={faTimes} />
          </>
        )}
        {onDelete && <IconButton onClick={onDelete} icon={faTrash} />}
      </div>
    </div>
  );
};

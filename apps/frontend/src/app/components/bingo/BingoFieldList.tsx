import { BingoField } from '@bingo/models';
import { useState } from 'react';
import { AddBingoFieldInput, BingoFieldInput } from './BingoFieldInput';

interface BingoFieldListProps extends BingoFieldListState {
  onCreate?: (field: BingoField) => boolean | Promise<boolean>;
  onUpdate?: (id: string, value: string) => boolean | Promise<boolean>;
  onDelete?: (id: string) => boolean | Promise<boolean>;
}

interface BingoFieldListState {
  fields: BingoField[];
  addField: (field: BingoField) => void;
  updateField: (id: string, value: string) => void;
  deleteField: (id: string) => void;
}

export const useBingoFieldListState = (
  initialFields?: BingoField[],
): BingoFieldListState => {
  const [fields, setFields] = useState<BingoField[]>(initialFields ?? []);

  const addField = (field: BingoField) => {
    setFields(currentFields => [field, ...currentFields]);
  };

  const updateField = (id: string, text: string) => {
    setFields(
      fields.map(field => (field._id === id ? { ...field, text } : field)),
    );
  };

  const deleteField = (id: string) => {
    setFields(fields.filter(field => field._id !== id));
  };

  return {
    fields,
    addField,
    updateField,
    deleteField,
  };
};

export const BingoFieldList = (props: BingoFieldListProps) => {
  const onCreate = async (field: BingoField) => {
    const success = (await props?.onCreate?.(field)) || true;
    if (success) props.addField(field);
  };

  const onUpdate = async (id: string, text: string) => {
    const success = (await props?.onUpdate?.(id, text)) || true;
    if (success) props.updateField(id, text);

    return success;
  };

  const onDelete = async (id: string) => {
    const success = (await props?.onDelete?.(id)) || true;
    if (success) props.deleteField(id);
  };

  return (
    <div className="bingo-field-list">
      <AddBingoFieldInput onSubmit={onCreate} />
      <div className="bingo-fields">
        {props.fields.map(({ _id, text }) => {
          return (
            <BingoFieldInput
              key={`bingo-field#${_id}`}
              text={text}
              onUpdate={value => onUpdate(_id, value)}
              onDelete={() => onDelete(_id)}
            />
          );
        })}
      </div>
    </div>
  );
};

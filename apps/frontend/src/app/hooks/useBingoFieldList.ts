import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { BingoField } from '@bingo/models';

export const useBingoFieldList = () => {
  const [fields, setFields] = useState<BingoField[]>(
    Array.from({ length: 31 }, (_, i) => i + 1).map(i => ({
      _id: uuidv4(),
      text: `TEST ${i}`,
      checked: false,
    })),
  );

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

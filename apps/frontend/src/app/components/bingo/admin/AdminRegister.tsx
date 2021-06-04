import { useMutation } from '@apollo/client';
import { MUTATE_FIELD, MutationOperation } from '@bingo/gql';
import { BingoField, BingoGame } from '@bingo/models'
import React, { useState } from 'react'
import { AddBingoFieldInput, BingoFieldItem } from '../../../dialogs/CreateGameDialog';
import { Button } from '../../common'

interface AdminRegisterProps {
  game: BingoGame;
  setIsRegister: React.Dispatch<React.SetStateAction<boolean>>;
}

interface AdminRegisterOptions {
  titel: string;
  fields: BingoField[];
}



const AdminRegister: React.VFC<AdminRegisterProps> = ({ game, setIsRegister }) => {

  const [mutateField] = useMutation(MUTATE_FIELD);

  const [title, setTitle] = useState(game?.title);

  const [fields, setFields] = useState(game.fields);

  const canDelete = fields.length >= 25;

  const addBingoField = (text: string) => {
    //await mutateField({ variables: { id: game._id, operation: MutationOperation.getValue("ADD"), field: { _id: "", text: text } } })
    console.log("add", { _id: `new`, text: text })
    setFields(currentFields => [...currentFields, { _id: `new`, text: text }]);
  };

  const updateBingoField = async (index: number, text: string) => {
    //await mutateField({ variables: { id: game._id, operation: MutationOperation.getValue("UPDATE"), field: fields[index] } })
    console.log("update", fields[index])
    const updatedFields = [...fields];
    updatedFields[index] = { ...updatedFields[index], text: text };
    setFields(updatedFields);
  };

  const deleteBingoField = (index: number) => {
    if (canDelete) {
      //await mutateField({ variables: { id: game._id, operation: MutationOperation.getValue("DELETE"), field: fields[index] } })
      console.log("delete", fields[index])
      const updatedFields = [...fields];
      updatedFields.splice(index, 1);
      setFields(updatedFields);
    }
    else {
      console.log("You need at least 25 fields");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <h3>Titel</h3>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Button>Speichern</Button>
      <h3>Felder</h3>
      <div className="bingo-fields">
        {fields.map((field, index) => (
          <BingoFieldItem
            key={`field-${index}`}
            index={index}
            text={field.text}
            onUpdate={updateBingoField}
            onDelete={deleteBingoField}
          />
        ))}
      </div>
      <AddBingoFieldInput onSubmit={addBingoField} />
      <h3>Spielphase</h3>
      <Button onClick={() => setIsRegister(false)}>Spiel starten</Button>
    </div>
  )
}

export default AdminRegister

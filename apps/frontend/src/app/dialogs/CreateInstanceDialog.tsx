import React, { useContext } from 'react'
import { BaseDialog, DialogActions, DialogContent, DialogHeader, DialogPane } from '../components/common/Dialog'
import { Button } from '../components/common/Button';
import { gql, useMutation } from '@apollo/client';
import { CreateInstanceContext } from '../services/contexts';
import { useHistory } from 'react-router-dom';

const CREATE_INSTANCE = gql`
mutation CreateInstance($id: ID!){
  createInstance(_id: $id){
    _id,
    text
  }
}
`

const CreateInstanceDialog = (props: { show: boolean; onHide: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const history = useHistory();
  const [createInstance] = useMutation(CREATE_INSTANCE);
  const [instanceDialogState,] = useContext(CreateInstanceContext)
  const createNewInstance = async () => {
    const newInstance = await createInstance({
      variables: {
        id: instanceDialogState._id,
      }
    });
    if (newInstance) {
      console.log("New instance created");
      instanceDialogState.setShow(false);
      history.push(`/game/${instanceDialogState._id}`);
    }
  }

  return (
    <BaseDialog {...props}>
      <DialogPane className="create-game">
        <DialogHeader>Spiel beitreten</DialogHeader>
        <DialogContent>
          <p>Möchtest du dem Spiel "{instanceDialogState.title}" beitreten?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => createNewInstance()}>Ja</Button>
          <Button onClick={() => props.onHide(false)}>Nein</Button>
        </DialogActions>
      </DialogPane>
    </BaseDialog>
  )
}

export default CreateInstanceDialog

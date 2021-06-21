import { useState } from 'react';
import {
  FlatButton,
  Card,
  CardActions,
  CardContent,
  BaseDialog,
  DialogContent,
  DialogHeader,
  DialogProps,
  Tab,
  Tabs,
} from '../components/common';
import { useAuthContext } from '../hooks';



export const EditProfileDialog = (props: DialogProps) => {
  const auth = useAuthContext();

  const [name, setName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  const onEditUserData = (name: string, email: string, password: string) => {
      auth.edit({ name, email, password }).then(() => {
      props.close();
    });
  }


  const onEditUsername = (name: string) => {
    /*auth.edit({ name, email, password }).then(() => {
      props.close();
    });*/
  };

  const onEditEmail = (nemail: string) => {
    /*auth.edit({ name, email, password }).then(() => {
      props.close();
    });*/
  };

  const onEditPassword = (password: string) => {
    /*auth.edit({ name, email, password }).then(() => {
      props.close();
    });*/
  };

  return (
    <BaseDialog {...props} className="edit-dialog">
     <DialogHeader>Profil bearbeiten</DialogHeader>
      <DialogContent>
      <Card className="edit">
      <CardContent>
        <label>Benutzername: </label>
        <input
          type="input"
          placeholder="Benutzername"
          onChange={e => setName(e.currentTarget.value)}
        />
        <label>E-Mail: </label>
        <input
          type="input"
          placeholder="E-Mail"
          onChange={e => setEmail(e.currentTarget.value)}
        />
        <label>Passwort: </label>
        <input
          name="password"
          id="password"
          type="password"
          placeholder="Passwort"
          onChange={e => setPassword(e.currentTarget.value)}
        />
      </CardContent>
      <CardActions>
        <FlatButton onClick={() => onEditUserData(name, email, password)}>
          Speichern
        </FlatButton>
        <FlatButton onClick={() => {}}>
          Abbrechen
        </FlatButton>
      </CardActions>
    </Card>
      </DialogContent>
    </BaseDialog>
  );
};

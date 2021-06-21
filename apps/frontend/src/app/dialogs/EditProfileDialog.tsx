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
import { User } from '@bingo/models';

export const EditProfileDialog = (props: DialogProps) => {
  const auth = useAuthContext();


  const [newName, setNewName] = useState<string>();
  const [newEmail, setNewEmail] = useState<string>();
  const [newPassword, setNewPassword] = useState<string>();
  const [password, setPassword] = useState<string>();

  const onEditUserData = (newName: string, newEmail: string, newPassword: string, password: string) => {

    const email = auth.user?.email;

    auth.update({newName, newEmail, newPassword, email, password}).then((res) => {
        console.log(res);
        if(res){
            auth.login(newEmail, newPassword);
        }
      props.close();
    });
  };

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
            <div>{auth.user?.name}</div>
            <label>Email: </label>
            <div>{auth.user?.email}</div>
            
            <input
              type="input"
              placeholder="Neuer Benutzername"
              onChange={e => setNewName(e.currentTarget.value)}
            />
           
            <input
              type="input"
              placeholder="Neue E-Mail"
              onChange={e => setNewEmail(e.currentTarget.value)}
            />
            <input
              name="newPassword"
              id="newPassword"
              type="password"
              placeholder="Neues Passwort"
              onChange={e => setNewPassword(e.currentTarget.value)}
            />
           
            <input
              name="password"
              id="password"
              type="password"
              placeholder="Aktuelles Passwort"
              onChange={e => setPassword(e.currentTarget.value)}
            />
          </CardContent>
          <CardActions>
            <FlatButton onClick={() => onEditUserData(newName, newEmail, newPassword, password)}>
              Speichern
            </FlatButton>
          </CardActions>
        </Card>
      </DialogContent>
    </BaseDialog>
  );
};

import { useState } from 'react';
import toast from 'react-hot-toast';
import { errorMessages } from '@bingo/models';
import {
  FlatButton,
  Card,
  CardActions,
  CardContent,
  BaseDialog,
  DialogContent,
  DialogHeader,
  DialogProps,
  DialogActions,
  Button,
} from '../components/common';
import { useAuthContext } from '../hooks';

export const EditProfileDialog = (props: DialogProps) => {
  const auth = useAuthContext();

  const [newName, setNewName] = useState<string>();
  const [newEmail, setNewEmail] = useState<string>();
  const [newPassword, setNewPassword] = useState<string>();
  const [oldPassword, setOldPassword] = useState<string>();

  const onEditUserData = (
    newName: string,
    newEmail: string,
    newPassword: string,
    password: string,
  ) => {
    const email = auth.user?.email;

    if (
      newName == undefined &&
      newEmail == undefined &&
      newPassword == undefined
    ) {
      toast.error('Es muss mindestens ein Feld ausgefüllt sein!');
    } else {
      if (newName == undefined) newName = auth.user?.name;
      if (newEmail == undefined) newEmail = auth.user?.email;
      if (newPassword == undefined) newPassword = password;
      auth
        .update({ newName, newEmail, newPassword, email, password })
        .then(res => {
          console.log(res);
          if (res) {
            toast.success('Profil erfolgreich geändert!');
            auth.login(newEmail, newPassword);
            props.close();
          }
        });
    }
  };

  const onDeleteUser = (email: string, password: string) => {
    auth.deleteUser({ email, password }).then(res => {
      if (res) {
        props.close();
        auth.logout();
        toast.success('Profil erfolgreich gelöscht!');
      }
    });
  };

  return (
    <BaseDialog
      {...props}
      className="edit-dialog"
      hideTopDivider
      hideBottomDivider
    >
      <DialogHeader>Profil bearbeiten</DialogHeader>
      <DialogContent>
        <Card className="edit">
          <CardContent>
            <div className="user-display">
              <table>
                <tbody>
                  <tr>
                    <td className="label">Benutzername</td>
                    <td>{auth.user?.name}</td>
                  </tr>
                  <tr>
                    <td className="label">E-Mail </td>
                    <td>{auth.user?.email}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="input-fields">
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
              <label className="label">Erforderlich:</label>
              <input
                name="password"
                id="password"
                type="password"
                placeholder="Aktuelles Passwort"
                onChange={e => setOldPassword(e.currentTarget.value)}
              />
            </div>
          </CardContent>
        </Card>
      </DialogContent>
      <DialogActions className="button-box">
        <Button
        className="button flat left"
          disabled={!oldPassword}
          onClick={() => onDeleteUser(auth.user?.email, oldPassword)}
        >
          Benutzer Löschen
        </Button>
        <FlatButton
          disabled={!oldPassword}
          onClick={() =>
            onEditUserData(newName, newEmail, newPassword, oldPassword)
          }
        >
          Speichern
        </FlatButton>
      </DialogActions>
    </BaseDialog>
  );
};

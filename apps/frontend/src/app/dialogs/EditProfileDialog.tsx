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

    if (newName === undefined) newName = auth.user?.name;
    if (newEmail === undefined) newEmail = auth.user?.email;
    if (newPassword === undefined) newPassword = password;

    auth
      .update({ newName, newEmail, newPassword, email, password })
      .then(res => {
        console.log(res);
        if (res) {
          toast.success('Successfully changed profile!');
          auth.login(newEmail, newPassword);
          props.close();
        } else {
          toast.error(errorMessages.INCORRECT_PASSWORD);
        }
      });
  };

  const onDeleteUser = (email: string, password: string) => {
    console.log(email, password);

    auth.deleteUser({ email, password }).then(res => {
      if (res) {
        props.close();
        auth.logout();
        toast.success('Successfully deleted profile!');
      }
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
    <BaseDialog
      {...props}
      className="edit-dialog"
      hideTopDivider
      hideBottomDivider
    >
      <DialogHeader>Profil bearbeiten</DialogHeader>
      <DialogContent className="edit">
        <div className="user-display">
          <table>
            <tbody>
              <tr>
                <td className="label">Benutzername</td>
                <td>{auth.user?.name}</td>
              </tr>
              <tr>
                <td className="label">Email </td>
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
          <label>Erforderlich:</label>
          <input
            name="password"
            id="password"
            type="password"
            placeholder="Aktuelles Passwort"
            onChange={e => setOldPassword(e.currentTarget.value)}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          id="delete-button"
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

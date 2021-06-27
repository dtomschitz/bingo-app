import toast from 'react-hot-toast';
import { User } from '@bingo/models';
import {
  FlatButton,
  BaseDialog,
  DialogContent,
  DialogHeader,
  DialogProps,
  DialogActions,
  EditableInputField,
} from '../components/common';
import { useAuth } from '../hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAt, faUser } from '@fortawesome/free-solid-svg-icons';

export const EditAccountDialog = (dialog: DialogProps) => {
  const auth = useAuth();

  const onValueChanged = async (key: keyof User, value: string) => {
    const success = await auth.updateUser({
      _id: auth.user?._id,
      changes: {
        [key]: value,
      },
    });

    if (success) {
      toast.success('Der Account wurde erfolgreich aktualisiert');
    }

    return success;
  };

  const onDeleteUser = async () => {
    const success = await auth.deleteUser(auth.user?._id);
    if (success) {
      toast.success('Der Account wurde erfolgreich gelöscht');
    }

    dialog.close();
  };

  return (
    <BaseDialog
      {...dialog}
      className="edit-profile-dialog"
      hideTopDivider
      hideBottomDivider
    >
      <DialogHeader>Account bearbeiten</DialogHeader>
      <DialogContent>
        <div className="user-details">
          <div className="detail">
            <FontAwesomeIcon icon={faUser} />
            <span>{auth.user?.name}</span>
          </div>
          <div className="detail">
            <FontAwesomeIcon icon={faAt} />
            <span>{auth.user?.email}</span>
          </div>
        </div>
        <div className="input-fields">
          <EditableInputField
            placeholder="Nutzername"
            initialValue={auth.user?.name}
            onUpdate={value => onValueChanged('name', value)}
          />
          <EditableInputField
            placeholder="E-Mail"
            initialValue={auth.user?.email}
            onUpdate={value => onValueChanged('email', value)}
          />
          <EditableInputField
            placeholder="Neues Passwort"
            type="password"
            onUpdate={value => onValueChanged('password', value)}
          />

          <FlatButton className="delete-account warning" onClick={onDeleteUser}>
            Account löschen
          </FlatButton>
        </div>
      </DialogContent>
      <DialogActions>
        <FlatButton onClick={dialog.close}>Schließen</FlatButton>
      </DialogActions>
    </BaseDialog>
  );
};

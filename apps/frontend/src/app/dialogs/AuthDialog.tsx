import { useState } from 'react';
import {
  FlatButton,
  Card,
  CardActions,
  CardContent,
  BaseDialog,
  DialogContent,
  DialogPane,
  DialogProps,
  Tab,
  Tabs,
} from '../components/common';
import { useAuth } from '../hooks';

interface LoginProps {
  onLogin: (email: string, password: string) => void;
}

interface RegisterProps {
  onRegister: (name: string, email: string, password: string) => void;
}

export const AuthDialog = (props: DialogProps) => {
  const auth = useAuth();

  const onLogin = (email: string, password: string) => {
    auth.login({ email, password }).then(() => {
      props.onHide();
    });
  };

  const onRegister = (name: string, email: string, password: string) => {
    auth.register({ name, email, password }).then(() => {
      props.onHide();
    });
  };

  return (
    <BaseDialog {...props}>
      <DialogPane className="auth-dialog">
        <DialogContent>
          <Tabs>
            <Tab label="Anmelden">
              <Login onLogin={onLogin} />
            </Tab>
            <Tab label="Registrieren">
              <Register onRegister={onRegister} />
            </Tab>
          </Tabs>
        </DialogContent>
      </DialogPane>
    </BaseDialog>
  );
};

const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  return (
    <Card className="login">
      <CardContent>
        <input
          type="input"
          placeholder="E-Mail"
          onChange={e => setEmail(e.currentTarget.value)}
        />
        <input
          type="password"
          placeholder="Passwort"
          onChange={e => setPassword(e.currentTarget.value)}
        />
      </CardContent>
      <CardActions>
        <FlatButton onClick={() => onLogin(email, password)}>
          Anmelden
        </FlatButton>
      </CardActions>
    </Card>
  );
};

const Register = ({ onRegister }: RegisterProps) => {
  const [name, setName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  return (
    <Card className="login">
      <CardContent>
        <input
          type="input"
          placeholder="Benutzername"
          onChange={e => setName(e.currentTarget.value)}
        />
        <input
          type="input"
          placeholder="E-Mail"
          onChange={e => setEmail(e.currentTarget.value)}
        />
        <input
          name="password"
          id="password"
          type="password"
          placeholder="Passwort"
          onChange={e => setPassword(e.currentTarget.value)}
        />
      </CardContent>
      <CardActions>
        <FlatButton onClick={() => onRegister(name, email, password)}>
          Registrieren
        </FlatButton>
      </CardActions>
    </Card>
  );
};

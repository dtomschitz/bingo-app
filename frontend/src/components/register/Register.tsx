import { Button, FlatButton } from 'components/common/Button';
import {
  Card,
  CardActions,
  CardContent,
  CardTitle,
} from 'components/common/Card';
import { ChangeEvent, useState } from 'react';
import { withRouter } from 'react-router-dom';

interface RegisterState {
  username: string;
  password: string;
}

const Register = withRouter(({ history }) => {
  const [state, setState] = useState<RegisterState>({
    username: '',
    password: '',
  });

  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [target.name]: target.value,
    });
  };

  const submit = (event: any) => {
    //alert('TODO: Daten verarbeiten');
  };

  const onCancel = () => {
    //let path = `login`;
    //this.props.history.push(path);
  };

  return (
    <Card className="login">
      <CardTitle>Registrieren</CardTitle>
      <CardContent>
        <input
          name="username"
          id="username"
          type="input"
          placeholder="E-Mail"
          onChange={handleInputChange}
        />
        <input
          name="password"
          id="password"
          type="password"
          placeholder="Passwort"
          onChange={handleInputChange}
        />
        <input
          name="password"
          id="password"
          type="password"
          placeholder="Passwort bestätigen"
          onChange={handleInputChange}
        />
      </CardContent>
      <CardActions>
        <Button onClick={() => history.push('/login')}>Anmelden</Button>
        <FlatButton onClick={() => history.push('/register')}>
          Registrieren
        </FlatButton>
      </CardActions>
    </Card>
  );
});

export default Register;

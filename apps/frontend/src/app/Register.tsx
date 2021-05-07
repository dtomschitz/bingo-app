import { ChangeEvent, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, FlatButton } from './components/common/Button';
import {
  Card,
  CardActions,
  CardContent,
  CardTitle,
} from './components/common/Card';

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

  const onSubmit = () => {
    //alert('TODO: Daten verarbeiten');
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
        <FlatButton onClick={onSubmit}>Registrieren</FlatButton>
      </CardActions>
    </Card>
  );
});

export default Register;

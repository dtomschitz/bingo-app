import { ChangeEvent, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, FlatButton } from '../common/Button';
import { Card, CardActions, CardContent, CardTitle } from '../common/Card';

interface LoginState {
  username: string;
  password: string;
}

const Login = withRouter(({ history }) => {
  const [state, setState] = useState<LoginState>({
    username: '',
    password: '',
  });

  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [target.name]: target.value,
    });
  };

  return (
    <Card className="login">
      <CardTitle>Anmelden</CardTitle>
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
          onChange={e => handleInputChange}
        />
      </CardContent>
      <CardActions>
        <Button onClick={() => history.push('/register')}>Register</Button>
        <FlatButton onClick={() => history.push('/register')}>
          Anmelden
        </FlatButton>
      </CardActions>
    </Card>
  );
});

export default Login;

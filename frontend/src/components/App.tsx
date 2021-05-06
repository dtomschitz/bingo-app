import { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from 'react-router-dom';
import Login from './login/Login';
import Register from './register/Register';
import Home from './Home';
import CreateGameDialog from './CreateGameDialog';
import { FlatButton } from './common/Button';
import { DialogContainer } from './common/Dialog';
import Divider from './common/Divider';

interface AppBarProps {
  elevated: boolean;
}

const App = () => {
  const [elevateAppBar, setElevateAppBar] = useState(false);

  const handleScroll = (scrollTop: number) => {
    setElevateAppBar(scrollTop > 10 ? true : false);
  };

  return (
    <Router>
      <AppBar elevated={elevateAppBar} />
      <div
        id="router-container"
        onScroll={e => handleScroll(e.currentTarget.scrollTop)}
      >
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
      <DialogContainer />
    </Router>
  );
};

const AppBar = ({ elevated }: AppBarProps) => {
  const history = useHistory();
  const [showCreateGameDialog, setShowCreateGameDialog] = useState(false);

  return (
    <>
      <div className={`app-bar ${elevated ? 'elevated' : ''}`}>
        <div className="container">
          <span className="title" onClick={() => history.push('/')}>
            BINGO
          </span>
          <div className="actions">
            <FlatButton onClick={() => history.push('/register')}>
              Registrieren
            </FlatButton>
            <FlatButton onClick={() => history.push('/login')}>
              Anmelden
            </FlatButton>
            <FlatButton onClick={() => setShowCreateGameDialog(true)}>
              Spiel erstellen
            </FlatButton>
          </div>
        </div>
        {!elevated ? <Divider /> : <></>}
      </div>
      <CreateGameDialog
        show={showCreateGameDialog}
        onHide={() => setShowCreateGameDialog(false)}
      />
    </>
  );
};

export default App;

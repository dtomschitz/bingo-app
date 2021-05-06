import { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
  useLocation,
} from 'react-router-dom';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Login from './login/Login';
import Register from './register/Register';
import Home from './Home';
import CreateGameDialog from './CreateGameDialog';
import { FlatButton, IconButton } from './common/Button';
import { DialogContainer } from './common/Dialog';
import Divider from './common/Divider';
import Game from './Game';

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
          <Route path="/game/:gameId" component={Game} />
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
  const location = useLocation();
  const [showCreateGameDialog, setShowCreateGameDialog] = useState(false);

  const isHome = location.pathname !== '/';

  return (
    <>
      <div className={`app-bar ${elevated ? 'elevated' : ''}`}>
        <div className="container">
          {isHome && (
            <IconButton
              className="back-button"
              icon={faArrowLeft}
              onClick={() => history.push('/')}
            />
          )}
          <span className="title" onClick={() => history.push('/')}>
            BINGO
          </span>
          <div className="flex-spacer" />
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
        {!elevated && <Divider />}
      </div>
      <CreateGameDialog
        show={showCreateGameDialog}
        onHide={() => setShowCreateGameDialog(false)}
      />
    </>
  );
};

export default App;

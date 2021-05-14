import { useEffect, useState } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FlatButton, IconButton } from './components/common/Button';
import { DialogContainer } from './components/common/Dialog';
import { Divider } from './components/common/Divider';
import { ProgressBar } from './components/common/ProgressBar';
import { ProtectedRoute, useAuth } from './auth';
import { AuthDialog, CreateGameDialog } from './dialogs';
import Home from './Home';
import Game from './Game';

interface AppBarProps {
  elevated: boolean;
  onCreateGame: () => void;
  onLogin: () => void;
}

const App = () => {
  const auth = useAuth();
  const [elevateAppBar, setElevateAppBar] = useState(false);

  const [showCreateGameDialog, setShowCreateGameDialog] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  useEffect(() => {
    if (!auth.isLoggedIn && auth.refreshToken) {
      auth.verify();
    }
  }, []);

  const handleScroll = (scrollTop: number) => {
    setElevateAppBar(scrollTop > 10 ? true : false);
  };

  return (
    <>
      <AppBar
        onCreateGame={() => setShowCreateGameDialog(true)}
        onLogin={() => setShowAuthDialog(true)}
        elevated={elevateAppBar}
      />
      <div
        id="router-container"
        onScroll={e => handleScroll(e.currentTarget.scrollTop)}
      >
        <Switch>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
      <DialogContainer />
      <CreateGameDialog
        show={showCreateGameDialog}
        onHide={() => setShowCreateGameDialog(false)}
      />
      <AuthDialog
        show={showAuthDialog}
        onHide={() => setShowAuthDialog(false)}
      />
    </>
  );
};

const AppBar = ({ onCreateGame, onLogin, elevated }: AppBarProps) => {
  const history = useHistory();
  const auth = useAuth();

  const renderActions = () => {
    if (auth.isPending) {
      return undefined;
    }

    return auth.user ? (
      <>
        <FlatButton onClick={onCreateGame}>Spiel erstellen</FlatButton>
        <IconButton icon={faSignOutAlt} onClick={() => auth.logout()} />
      </>
    ) : (
      <FlatButton onClick={onLogin}>Anmelden</FlatButton>
    );
  };

  return (
    <div className={`app-bar ${elevated ? 'elevated' : ''}`}>
      <div className="container">
        <span className="title" onClick={() => history.push('/')}>
          BINGO
        </span>
        <div className="flex-spacer" />
        <div className="actions">{renderActions()}</div>
      </div>
      <div className="progress-bar-container">
        {auth.isPending && <ProgressBar />}
      </div>
      {!elevated && <Divider />}
    </div>
  );
};

export default App;

import { useEffect, useState } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { faCartPlus, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import {
  FlatButton,
  IconButton,
  DialogContainer,
  Divider,
  ProgressBar,
} from './components/common';
import { AppBarProvider, useAppBar, useAuth } from './hooks';
import { AuthDialog, CreateGameDialog } from './dialogs';
import Home from './Home';
import Game from './Game';

interface AppBarProps {
  elevated: boolean;
  onCreateGame: () => void;
  onLogin: () => void;
}

const App = () => {
  const [elevateAppBar, setElevateAppBar] = useState(false);
  const [showCreateGameDialog, setShowCreateGameDialog] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const auth = useAuth();

  useEffect(() => {
    if (!auth.isLoggedIn && auth.refreshToken) {
      auth.verify();
    }
  }, []);

  const handleScroll = (scrollTop: number) => {
    setElevateAppBar(scrollTop > 10 ? true : false);
  };

  return (
    <AppBarProvider>
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
          <Route path="/game/:gameId" component={Game} />
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
    </AppBarProvider>
  );
};

const AppBar = ({ onCreateGame, onLogin, elevated }: AppBarProps) => {
  const history = useHistory();
  const isMoileSmall = useMediaQuery({ query: '(min-width: 500px)' });

  const auth = useAuth();
  const appBar = useAppBar();

  useEffect(() => {
    appBar.showLoadingBar(auth.isPending);
  }, [auth.isPending]);

  const renderActions = () => {
    if (auth.isPending) {
      return undefined;
    }

    return auth.user ? (
      <>
        {isMoileSmall ? (
          <FlatButton className="create-game-button" onClick={onCreateGame}>
            Spiel erstellen
          </FlatButton>
        ) : (
          <IconButton
            className="create-game-button"
            icon={faCartPlus}
            onClick={onCreateGame}
          />
        )}
        <IconButton
          className="logout-button"
          icon={faSignOutAlt}
          onClick={() => auth.logout()}
        />
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
        {appBar.loading && <ProgressBar />}
      </div>
      {!elevated && <Divider />}
    </div>
  );
};

export default App;

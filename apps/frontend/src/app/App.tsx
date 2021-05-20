import { useEffect, useState } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FlatButton, IconButton } from './components/common/Button';
import { DialogContainer } from './components/common/Dialog';
import { Divider } from './components/common/Divider';
import { ProgressBar } from './components/common/ProgressBar';
import { useAuth } from './auth';
import { AuthDialog, CreateGameDialog } from './dialogs';
import GamesList from './GamesList';
import { GamesListContext } from './services/contexts';
import { BingoCard } from './components/bingo';

interface AppBarProps {
  elevated: boolean;
  onCreateGame: () => void;
  onLogin: () => void;
}

const App = () => {
  const auth = useAuth();
  const [gamesList, setGamesList] = useState([]);
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
      <GamesListContext.Provider value={[gamesList, setGamesList]}>
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
            <Route path="/game/:id">
              <BingoCard />
            </Route>
            <Route path="/">
              <GamesList />
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
      </GamesListContext.Provider>
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

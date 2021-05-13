import { useEffect, useState } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FlatButton, IconButton } from './components/common/Button';
import { DialogContainer } from './components/common/Dialog';
import { Divider } from './components/common/Divider';
import { ProgressBar } from './components/common/ProgressBar';
import { useAuth } from './auth';
import { AuthDialog, CreateGameDialog } from './dialogs';
import Home from './Home';

interface AppBarProps {
  elevated: boolean;
}

const App = () => {
  const auth = useAuth();
  const [elevateAppBar, setElevateAppBar] = useState(false);

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
      <AppBar elevated={elevateAppBar} />
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
    </>
  );
};

const AppBar = ({ elevated }: AppBarProps) => {
  const history = useHistory();
  const auth = useAuth();

  const [showCreateGameDialog, setShowCreateGameDialog] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const renderActions = () => {
    if (auth.isPending) {
      return undefined;
    }

    return auth.user ? (
      <>
        <FlatButton onClick={() => setShowCreateGameDialog(true)}>
          Spiel erstellen
        </FlatButton>
        <IconButton icon={faSignOutAlt} onClick={() => auth.logout()} />
      </>
    ) : (
      <FlatButton onClick={() => setShowAuthDialog(true)}>Anmelden</FlatButton>
    );
  };

  return (
    <>
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

export default App;

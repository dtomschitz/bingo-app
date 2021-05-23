import { useEffect, useState } from 'react';
import { Switch, Route, useHistory, Link } from 'react-router-dom';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FlatButton, IconButton } from './components/common/Button';
import { Divider } from './components/common/Divider';
import { ProgressBar } from './components/common/ProgressBar';
import { useAuth } from './auth';
import { AuthDialog, CreateGameDialog } from './dialogs';
import GamesList from './GamesList';
import { CreateInstanceContext, GamesListContext } from './services/contexts';
import { BingoCard } from './components/bingo';
import CreateInstanceDialog from './dialogs/CreateInstanceDialog';

interface AppBarProps {
  elevated: boolean;
  onCreateGame: () => void;
  onLogin: () => void;
}

export interface InstanceDialogState {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  _id: string;
}

const App = () => {
  const auth = useAuth();
  const [doRefetch, setDoRefetch] = useState<boolean>(false);
  const [elevateAppBar, setElevateAppBar] = useState(false);

  const [showCreateGameDialog, setShowCreateGameDialog] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showInstanceDialog, setShowInstanceDialog] = useState<boolean>(false);
  const [instanceDialogState, setInstanceDialogState] = useState<InstanceDialogState>({ show: showInstanceDialog, setShow: setShowInstanceDialog, title: "", _id: "" });

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
      <GamesListContext.Provider value={[doRefetch, setDoRefetch]}>
        <AppBar
          onCreateGame={() => setShowCreateGameDialog(true)}
          onLogin={() => setShowAuthDialog(true)}
          elevated={elevateAppBar}
        />
        <CreateInstanceContext.Provider value={[instanceDialogState, setInstanceDialogState]}>
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
          <CreateGameDialog
            show={showCreateGameDialog}
            onHide={() => setShowCreateGameDialog(false)}
          />
          <AuthDialog
            show={showAuthDialog}
            onHide={() => setShowAuthDialog(false)}
          />
          <CreateInstanceDialog show={showInstanceDialog} onHide={setShowInstanceDialog} />
        </CreateInstanceContext.Provider>
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
        <Link className="title" to="/" >
          BINGO
        </Link>
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

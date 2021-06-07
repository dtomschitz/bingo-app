import React, { useEffect, useState } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { faCartPlus, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import {
  FlatButton,
  IconButton,
  DialogContainer,
  Divider,
  ProgressBar,
  Tabs,
  Tab,
} from './components/common';
import { AppBarProvider, useAppBar, useAuthContext, useDialog } from './hooks';
import { AuthDialog, CreateGameDialog } from './dialogs';
import Game from './Game';
import GamesList from './GamesList';

interface AppBarProps {
  elevated: boolean;
  onCreateGame: () => void;
}

export interface InstanceDialogState {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  _id: string;
}

const App = () => {
  const [elevateAppBar, setElevateAppBar] = useState(false);

  const auth = useAuthContext();
  const createGameDialog = useDialog();

  useEffect(() => {
    auth.verify();
  }, []);

  useEffect(() => {
    if (!auth.isLoggedIn && !auth.isVerifying && !auth.dialog.show) {
      auth.dialog.open();
    }
  }, [auth.isLoggedIn, auth.isVerifying, auth.dialog]);

  const handleScroll = (scrollTop: number) => {
    setElevateAppBar(scrollTop > 10 ? true : false);
  };

  return (
    <AppBarProvider>
      <AppBar onCreateGame={createGameDialog.open} elevated={elevateAppBar} />
      <div
        id="router-container"
        onScroll={e => handleScroll(e.currentTarget.scrollTop)}
      >
        <Switch>
          <Route path="/game/:gameId" component={Game} />
          <Route path="/">
            <Tabs>
              <Tab label="closed games">
                <GamesList phase="editing" />
              </Tab>
              <Tab label="open for registration">
                <GamesList phase="open" />
              </Tab>
              <Tab label="currently playing">
                <GamesList phase="playing" />
              </Tab>
            </Tabs>
          </Route>
        </Switch>
      </div>
      <DialogContainer />
      <AuthDialog {...auth.dialog} />
      <CreateGameDialog {...createGameDialog} />
    </AppBarProvider>
  );
};

const AppBar = ({ onCreateGame, elevated }: AppBarProps) => {
  const isMoileSmall = useMediaQuery({ query: '(min-width: 500px)' });

  const auth = useAuthContext();
  const appBar = useAppBar();

  useEffect(() => {
    appBar.showLoadingBar(auth.isPending);
  }, [auth.isPending]);

  const onLogin = () => {
    auth.dialog.open();
  };

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
        <Link className="title" to="/">
          BINGO
        </Link>
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

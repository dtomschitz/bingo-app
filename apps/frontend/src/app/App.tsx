import React, { useEffect, useState } from 'react';
import { Switch, Route, RouteProps, Link, Redirect } from 'react-router-dom';
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
import Games from './Games';

interface AppBarProps {
  elevated: boolean;
  onCreateGame: () => void;
}

interface ProtectedRouteProps extends RouteProps {
  authenticated: boolean;
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
    const elevated = scrollTop > 10 ? true : false;
    if (elevateAppBar !== elevated) {
      setElevateAppBar(elevated);
    }
  };

  return (
    <AppBarProvider>
      <AppBar onCreateGame={createGameDialog.open} elevated={elevateAppBar} />
      <div
        id="router-container"
        onScroll={e => handleScroll(e.currentTarget.scrollTop)}
      >
        <Switch>
          <ProtectedRoute
            path="/game/:gameId"
            authenticated={auth.isVerifying ? true : auth.isLoggedIn}
            component={Game}
          />
          <Route path="/">
            <Tabs>
              <Tab label="Eigene Spiele">
                <Games myGames={true} />
              </Tab>
              <Tab label="Spiele von anderen">
                <Games myGames={false} />
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
  }, [appBar, auth.isPending]);

  const onLogin = () => {
    auth.dialog.open();
  };

  const renderActions = () => {
    if (auth.isPending) {
      return undefined;
    }

    return auth.isLoggedIn ? (
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

const ProtectedRoute = ({
  component: Component,
  authenticated,
  ...rest
}: ProtectedRouteProps) => {
  return (
    <Route
      {...rest}
      render={props => {
        if (authenticated) {
          return <Component {...rest} {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: '/',
                state: {
                  from: props.location,
                },
              }}
            />
          );
        }
      }}
    />
  );
};

export default App;

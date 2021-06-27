import { useEffect, useState } from 'react';
import { Switch, Route, RouteProps, Link, Redirect } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import {
  faCartPlus,
  faEllipsisV,
  faPlus,
  faSignOutAlt,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { Menu, MenuItem } from '@szhsin/react-menu';
import {
  FlatButton,
  IconButton,
  DialogContainer,
  Divider,
  ProgressBar,
} from './components/common';
import { AppBarProvider, useAppBar, useAuthContext, useDialog } from './hooks';
import { AuthDialog, CreateGameDialog, EditProfileDialog } from './dialogs';
import Game from './Game';
import Home from './Home';
import { BingoGameContextMenu } from './components/bingo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface AppBarProps {
  elevated: boolean;
  onCreateGame: () => void;
  onEditProfile: () => void;
}

interface AppContextMenuProps {
  onEditProfile: () => void;
  onLogout: () => void;
}

interface ProtectedRouteProps extends RouteProps {
  authenticated: boolean;
}

const App = () => {
  const [elevateAppBar, setElevateAppBar] = useState(false);

  const auth = useAuthContext();
  const createGameDialog = useDialog();
  const editProfileDialog = useDialog();

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
      <AppBar
        onEditProfile={editProfileDialog.open}
        onCreateGame={createGameDialog.open}
        elevated={elevateAppBar}
      />
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
            <Home />
          </Route>
        </Switch>
      </div>
      <DialogContainer />
      <AuthDialog {...auth.dialog} />
      <CreateGameDialog {...createGameDialog} />
      <EditProfileDialog {...editProfileDialog} />
    </AppBarProvider>
  );
};

const AppBar = ({ onEditProfile, onCreateGame, elevated }: AppBarProps) => {
  const isMoileSmall = useMediaQuery({ query: '(min-width: 500px)' });

  const auth = useAuthContext();
  const appBar = useAppBar();

  useEffect(() => {
    appBar.showLoadingBar(auth.isPending);
  }, [appBar, auth.isPending]);

  const onLogin = () => auth.dialog.open();
  const onLogout = () => auth.logout();

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
            icon={faPlus}
            onClick={onCreateGame}
          />
        )}
        <AppContextMenu onEditProfile={onEditProfile} onLogout={onLogout} />
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

export const AppContextMenu = ({
  onEditProfile,
  onLogout,
}: AppContextMenuProps) => {
  return (
    <Menu menuButton={<IconButton icon={faEllipsisV} />}>
      <MenuItem onClick={onEditProfile}>
        <FontAwesomeIcon icon={faUser} />
        Nutzer bearbeiten
      </MenuItem>
      <MenuItem onClick={onLogout}>
        <FontAwesomeIcon icon={faSignOutAlt} />
        Abmelden
      </MenuItem>
    </Menu>
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

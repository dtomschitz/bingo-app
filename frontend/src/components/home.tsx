import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import App from "./App";
import Login from "./Login";

export default function Home() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/app">app</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/app">
            <App />
          </Route>
          <Route path="/">
            <Back />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Back() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}
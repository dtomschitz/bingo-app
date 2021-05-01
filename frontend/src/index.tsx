import React from 'react';
import ReactDOM from 'react-dom';
import Home from './components/home';
import Login from './components/Login';
import { BrowserRouter, Route, Link, Router } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>,
  document.getElementById('root')
);

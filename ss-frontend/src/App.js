import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Navbar from './Component/Auth/navbar';

import Registration from './Component/Admin/registration';
import Login from './Component/Admin/login';


function App() {
  return (
    <React.Fragment>
      <Navbar />

      <Router>

        <Switch>
          <Route exact path="/"><Login /></Route>
          <Route exact path="/registration">
            <Registration />
          </Route>
        </Switch>

      </Router>
    </React.Fragment>
  );
}


export default App;

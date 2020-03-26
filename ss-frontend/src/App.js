import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Navbar from './Component/Auth/navbar';
import Footer from './Component/Auth/footer'

import Registration from './Component/Admin/registration';
import Login from './Component/Admin/login';
import Home from './Component/Basic/Home';
import Profile from './Component/Basic/profile';
import Pumps from './Component/Admin/pumpsRegistration';
import DailyPumpersCalculations from './Component/Basic/dailyPumperCalculations';
import FuelLubricantPrice from './Component/Basic/fuelLubricantPrice';

function App() {
  return (
    <React.Fragment>
      <Navbar />
      
      <Router>

        <Switch>

          <Route exact path="/" component={Home}></Route>
          <Route exact path="/registration" component={Registration}></Route>
          <Route exact path="/login" component={Login}></Route>
          <Route path="/pumpsRegistration" component={Pumps}></Route>
          <Route path="/profile" component={Profile}></Route>
          <Route path="/daily$pumpers$calculations" component={DailyPumpersCalculations}></Route>
          <Route path="/fuel$lubricant$price" component={FuelLubricantPrice}></Route>
        </Switch>

      </Router>

      <Footer/>
    </React.Fragment>
  );
}


export default App;

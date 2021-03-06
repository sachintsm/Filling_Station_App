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
import CusProfile from './Component/Basic/cusprofile';

import Pumps from './Component/Admin/pumpsRegistration';
import DailyPumpersCalculations from './Component/Basic/dailyPumperCalculations'
import FuelLubricantPrice from './Component/Basic/fuelLubricantPrice'
import DailySales from './Component/Basic/dailySales'
import DailyPumpersManagement from './Component/Basic/dailyPumpersManagement'
import EarlierPumpersCalculations from './Component/Basic/earlierPumperCalculation'
import SalesStocks from './Component/Basic/salesStocks'
import BankDetails from './Component/Basic/bankDetails'
import EmployeeSalary from './Component/Basic/employeeSalary'
import CustomerData from './Component/Basic/customerData'
import DailySalesHistory from './Component/Basic/dailySalesHistory'

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
          <Route path="/cusprofile" exact component={CusProfile}></Route>
          <Route path="/cusprofile/:id" component={CustomerData}></Route>

          <Route path="/daily$pumpers$calculations" component={DailyPumpersCalculations}></Route>
          <Route path="/daily$pumpers$management" component={DailyPumpersManagement}></Route>
          <Route path="/fuel$lubricant$price" component={FuelLubricantPrice}></Route>
          <Route path="/daily$sales" component={DailySales}></Route>
          <Route path="/earlier$pumpers$management" component={EarlierPumpersCalculations}></Route>
          <Route path="/salesStocks" component={SalesStocks}></Route>
          <Route path="/bank$details" component={BankDetails}></Route>
          <Route path="/emp$salary" component={EmployeeSalary}></Route>
          <Route path="/dailySalesHistory" exact component={DailySalesHistory}></Route>

        </Switch>

      </Router>

      <Footer />
    </React.Fragment>
  );
}


export default App;

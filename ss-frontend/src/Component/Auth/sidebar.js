import React, { Component } from 'react'
import '../../Css/Auth/sidebar.css'
import { Link } from 'react-router-dom';
import { getFromStorage } from '../../utils/storage';

import LocalGasStationIcon from '@material-ui/icons/LocalGasStation';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import EvStationIcon from '@material-ui/icons/EvStation';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import FunctionsIcon from '@material-ui/icons/Functions';
import ListIcon from '@material-ui/icons/List';
import PeopleIcon from '@material-ui/icons/People';
import HistoryIcon from '@material-ui/icons/History';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import YoutubeSearchedForIcon from '@material-ui/icons/YoutubeSearchedFor';


export default class sidebar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            authState: '',
            authUser: '',
        }
    }

    componentDidMount() {
        
        const user = getFromStorage('auth-user');
        if (user != null) {
            this.setState({
                authUser: user.userType
            })
        }

    }

    render() {
        const {authUser} = this.state;

        return (
            <div className="container-fluid" >
                <div className="side-row-div">
                    <Link to={'/daily$sales'}>
                        <div className="row">
                            <div className="col-md-2 side-icn">
                                <MonetizationOnIcon />
                            </div>
                            <div className="col-md-10 side-txt">
                                <p>Daily Sales</p>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="side-row-div">
                    <Link to={'/dailySalesHistory'}>
                        <div className="row">
                            <div className="col-md-2 side-icn">
                                <YoutubeSearchedForIcon />
                            </div>
                            <div className="col-md-10 side-txt">
                                <p>Daily Sales History</p>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="side-row-div" >
                    <Link to={'/pumpsRegistration'}>

                        <div className="row ">
                            <div className="col-md-2 side-icn">
                                <LocalGasStationIcon />
                            </div>
                            <div className="col-md-10 side-txt">
                                <p>Machines Registration</p>
                            </div>
                        </div>
                    </Link>
                </div>
                {authUser === 'Administrator' && (
                    <div className="side-row-div">
                    <Link to={'/registration'}>
                        <div className="row">

                            <div className="col-md-2 side-icn">
                                <PersonAddIcon />
                            </div>
                            <div className="col-md-10 side-txt">
                                <p>User Registration</p>
                            </div>
                        </div>
                    </Link>
                </div>
                    )}

                <div className="side-row-div">
                    <Link to={'/daily$pumpers$calculations'}>

                        <div className="row">
                            <div className="col-md-2 side-icn">
                                <FunctionsIcon />
                            </div>
                            <div className="col-md-10 side-txt">
                                <p>Pumpers Calculations</p>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="side-row-div">
                    <Link to={'/daily$pumpers$management'}>

                        <div className="row">
                            <div className="col-md-2 side-icn">
                                <EvStationIcon />
                            </div>
                            <div className="col-md-10 side-txt">
                                <p>Cash Receives</p>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="side-row-div">
                    <Link to={'/earlier$pumpers$management'}>

                        <div className="row">
                            <div className="col-md-2 side-icn">
                                <HistoryIcon />
                            </div>
                            <div className="col-md-10 side-txt">
                                <p>Pumpers Cal. History</p>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="side-row-div">
                    <Link to={'/fuel$lubricant$price'}>

                        <div className="row">
                            <div className="col-md-2 side-icn">
                                <AttachMoneyIcon />
                            </div>
                            <div className="col-md-10 side-txt">
                                <p>Product Price List</p>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="side-row-div">
                    <Link to={'/cusprofile'}>

                        <div className="row">
                            <div className="col-md-2 side-icn">
                                <PeopleIcon />
                            </div>
                            <div className="col-md-10 side-txt">
                                <p>Customers' Profiles</p>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="side-row-div">
                    <Link to={'/salesStocks'}>

                        <div className="row">
                            <div className="col-md-2 side-icn">
                                <ListIcon />
                            </div>
                            <div className="col-md-10 side-txt">
                                <p>Sales Stocks</p>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="side-row-div">
                    <Link to={'/bank$details'}>

                        <div className="row">
                            <div className="col-md-2 side-icn">
                                <AccountBalanceIcon />
                            </div>
                            <div className="col-md-10 side-txt">
                                <p>Bank Details</p>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="side-row-div">
                    <Link to={'/emp$salary'}>

                        <div className="row">
                            <div className="col-md-2 side-icn">
                                <LocalAtmIcon />
                            </div>
                            <div className="col-md-10 side-txt">
                                <p>Employee Salary</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div >
        )
    }
}

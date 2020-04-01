import React, { Component } from 'react'
import '../../Css/Auth/sidebar.css'
import { Link } from 'react-router-dom';

import LocalGasStationIcon from '@material-ui/icons/LocalGasStation';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import EvStationIcon from '@material-ui/icons/EvStation';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
// import TransferWithinAStationIcon from '@material-ui/icons/TransferWithinAStation';
import FunctionsIcon from '@material-ui/icons/Functions';

export default class sidebar extends Component {
    render() {
        return (
            <div className="container-fluid">
                <div className="side-row-div">
                    <Link to={'/pumpsRegistration'}>

                        <div className="row ">
                            <div className="col-md-2 side-icn">
                                <LocalGasStationIcon />
                            </div>
                            <div className="col-md-10 side-txt">
                                <p>Pumps Registration</p>
                            </div>
                        </div>
                    </Link>
                </div>
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
                                <p>Pumpers Management</p>
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
                                <p>Fuel / Lumbricant Price</p>
                            </div>
                        </div>
                    </Link>
                </div>
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
                    <Link to={'/cusprofile'}>

                        <div className="row">
                            <div className="col-md-2 side-icn">
                                <MonetizationOnIcon />
                            </div>
                            <div className="col-md-10 side-txt">
                                <p>Customer Profile</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        )
    }
}

import React, { Component } from 'react'
import '../../Css/Admin/login.css';
import '../../Css/Basic/home.css';
import { Link } from "react-router-dom";
import { verifyAuth } from '../../utils/authentication';
import { Row, Col } from 'reactstrap';

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
import AddBoxIcon from '@material-ui/icons/AddBox';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

import { Animated } from "react-animated-css";

export default class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            authState: '',
            dataDiv1: false,
            dataDiv2: false,
        };
        this.registrationDiv = this.registrationDiv.bind(this)
        this.pumperDiv = this.pumperDiv.bind(this)
    }

    componentDidMount = async () => {


        const authState = await verifyAuth()
        this.setState({ authState: authState })
        if (!authState) this.props.history.push('/login')

    }

    registrationDiv() {
        this.setState({
            dataDiv1: true,
            dataDiv2: false
        });


    }

    pumperDiv() {
        this.setState({
            dataDiv1: false,
            dataDiv2: true
        });
    }
    render() {
        const { dataDiv1, dataDiv2 } = this.state;
        

        return (
            <div className="home-div">

                <div className="container-fluid company-name">
                    <p className='company'>S & S Pertoleum Traders</p>

                </div>

                <div className="container">
                    <Row>
                        <Col xs="4" style={{ marginTop: "50px" }}>
                            <Animated animationIn="bounceInLeft" animationOut="fadeOut" isVisible={true} animationInDuration={1200}>
                                <div className="one-link">
                                    <Link to="/daily$sales">
                                        <Row>
                                            <Col xs="2" className="icon-div">
                                                <MonetizationOnIcon style={{ fontSize: "40px", marginTop: "5px" }} className="icon" />
                                            </Col>
                                            <Col xs="10" className="text-div">
                                                <p className="text" style={{ marginTop: "10px" }}>Daily Sales</p>
                                            </Col>
                                        </Row>
                                    </Link>
                                </div>

                                <div className="one-link">
                                    <Row onClick={this.registrationDiv}>
                                        <Col xs="2" className="icon-div">
                                            <AddBoxIcon style={{ fontSize: "40px", marginTop: "5px" }} className="icon" />
                                        </Col>
                                        <Col xs="9" className="text-div-middle">
                                            <p className="text" style={{ marginTop: "10px" }}>Registrations</p>
                                        </Col>
                                        <Col xs="1" className="text-div">
                                            <ArrowRightIcon className="arrow" style={{ fontSize: "40px" }} />
                                        </Col>
                                    </Row>
                                </div>

                                <div className="one-link">
                                    <Row onClick={this.pumperDiv}>
                                        <Col xs="2" className="icon-div">
                                            <LocalGasStationIcon style={{ fontSize: "40px", marginTop: "5px" }} className="icon" />
                                        </Col>
                                        <Col xs="9" className="text-div-middle">
                                            <p className="text" style={{ marginTop: "10px" }}>Pumpers Management</p>
                                        </Col>
                                        <Col xs="1" className="text-div">
                                            <ArrowRightIcon className="arrow" style={{ fontSize: "40px" }} />
                                        </Col>
                                    </Row>
                                </div>

                                <div className="one-link">
                                    <Link to="/fuel$lubricant$price">
                                        <Row>
                                            <Col xs="2" className="icon-div">
                                                <AttachMoneyIcon style={{ fontSize: "40px", marginTop: "5px" }} className="icon" />
                                            </Col>
                                            <Col xs="10" className="text-div">
                                                <p className="text" style={{ marginTop: "10px" }}>Product Price List</p>
                                            </Col>
                                        </Row>
                                    </Link>
                                </div>

                                <div className="one-link">
                                    <Link to="/cusprofile">
                                        <Row>
                                            <Col xs="2" className="icon-div">
                                                <PeopleIcon style={{ fontSize: "40px", marginTop: "5px" }} className="icon" />
                                            </Col>
                                            <Col xs="10" className="text-div">
                                                <p className="text" style={{ marginTop: "10px" }}>Customer Profiles</p>
                                            </Col>
                                        </Row>
                                    </Link>
                                </div>
                                <div className="one-link">
                                    <Link to="/salesStocks">
                                        <Row>
                                            <Col xs="2" className="icon-div">
                                                <ListIcon style={{ fontSize: "40px", marginTop: "5px" }} className="icon" />
                                            </Col>
                                            <Col xs="10" className="text-div">
                                                <p className="text" style={{ marginTop: "10px" }}>Stock Management</p>
                                            </Col>
                                        </Row>
                                    </Link>
                                </div>
                                <div className="one-link">
                                    <Link to="/bank$details">
                                        <Row>
                                            <Col xs="2" className="icon-div">
                                                <AccountBalanceIcon style={{ fontSize: "40px", marginTop: "5px" }} className="icon" />
                                            </Col>
                                            <Col xs="10" className="text-div">
                                                <p className="text" style={{ marginTop: "10px" }}>Bank Details</p>
                                            </Col>
                                        </Row>
                                    </Link>
                                </div>
                                <div className="one-link">
                                    <Link to="/emp$salary">
                                        <Row>
                                            <Col xs="2" className="icon-div">
                                                <LocalAtmIcon style={{ fontSize: "40px", marginTop: "5px" }} className="icon" />
                                            </Col>
                                            <Col xs="10" className="text-div">
                                                <p className="text" style={{ marginTop: "10px" }}>Employee Salary</p>
                                            </Col>
                                        </Row>
                                    </Link>
                                </div>
                            </Animated>

                        </Col>

                        <Col xs="4" style={{ marginTop: "50px" }}>

                            {dataDiv1 && (
                                <Animated animationIn="bounceInLeft" isVisible={true} animationInDuration={800}>
                                    <div>
                                        <div className="one-link">
                                            <Link to="/pumpsRegistration">
                                                <Row>
                                                    <Col xs="2" className="icon-div">
                                                        <LocalGasStationIcon style={{ fontSize: "40px", marginTop: "5px" }} className="icon" />
                                                    </Col>
                                                    <Col xs="10" className="text-div">
                                                        <p className="text" style={{ marginTop: "10px" }}>Machines Registration</p>
                                                    </Col>
                                                </Row>
                                            </Link>
                                        </div>

                                        <div className="one-link">
                                            <Link to="/registration">
                                                <Row>
                                                    <Col xs="2" className="icon-div">
                                                        <PersonAddIcon style={{ fontSize: "40px", marginTop: "5px" }} className="icon" />
                                                    </Col>
                                                    <Col xs="10" className="text-div">
                                                        <p className="text" style={{ marginTop: "10px" }}>User Registration</p>
                                                    </Col>
                                                </Row>
                                            </Link>
                                        </div>
                                    </div>
                                </Animated>
                            )}

                            {dataDiv2 && (
                                <Animated animationIn="bounceInLeft" isVisible={true} animationInDuration={800}>

                                    <div>
                                        <div className="one-link">
                                            <Link to="/daily$pumpers$calculations">
                                                <Row>
                                                    <Col xs="2" className="icon-div">
                                                        <FunctionsIcon style={{ fontSize: "40px", marginTop: "5px" }} className="icon" />
                                                    </Col>
                                                    <Col xs="10" className="text-div">
                                                        <p className="text" style={{ marginTop: "10px" }}>Daily Pumper Calculations</p>
                                                    </Col>
                                                </Row>
                                            </Link>
                                        </div>
                                        <div className="one-link">
                                            <Link to="/daily$pumpers$calculations">
                                                <Row>
                                                    <Col xs="2" className="icon-div">
                                                        <EvStationIcon style={{ fontSize: "40px", marginTop: "5px" }} className="icon" />
                                                    </Col>
                                                    <Col xs="10" className="text-div">
                                                        <p className="text" style={{ marginTop: "10px" }}>Cash Receives </p>
                                                    </Col>
                                                </Row>
                                            </Link>
                                        </div>
                                        <div className="one-link">
                                            <Link to="/daily$pumpers$calculations">
                                                <Row>
                                                    <Col xs="2" className="icon-div">
                                                        <HistoryIcon style={{ fontSize: "40px", marginTop: "5px" }} className="icon" />
                                                    </Col>
                                                    <Col xs="10" className="text-div">
                                                        <p className="text" style={{ marginTop: "10px" }}>Daily Calculation History</p>
                                                    </Col>
                                                </Row>
                                            </Link>
                                        </div>
                                    </div>
                                </Animated>
                            )}
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}
import React, { Component } from 'react'
import Sidebar from '../Auth/sidebar'
import { verifyAuth } from '../../utils/authentication'
import axios from 'axios'
import { MDBInput } from "mdbreact";
import { Button, Row, Col } from 'reactstrap';
import '../../Css/Basic/bankDetails.css'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { getFromStorage } from "../../utils/storage";
import DatePicker from "react-datepicker";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { Animated } from "react-animated-css";
import Snackpop from "../Auth/Snackpop";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'

const backend_URI = require('../Auth/Backend_URI')

export default class dailySalesHistory extends Component {
    constructor(props) {
        super(props) 

        this.state = {
            snackbaropen: false,
            snackbarmsg: '',
            snackbarcolor: '',


        }
    }

    closeAlert = () => {
        this.setState({ snackbaropen: false });
    };

    render() {
        return (
            <React.Fragment>
                <div className="container-fluid">
                    <Snackpop
                        msg={this.state.snackbarmsg}
                        color={this.state.snackbarcolor}
                        time={3000}
                        status={this.state.snackbaropen}
                        closeAlert={this.closeAlert}
                    />
                    <div className="row">
                        <div className="col-md-2" style={{ backgroundColor: "#1c2431" }}>
                            <Sidebar />
                        </div>
                        <div className="col-md-10" style={{ backgroundColor: "#f5f5f5" }}>
                            <div className="container">

                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

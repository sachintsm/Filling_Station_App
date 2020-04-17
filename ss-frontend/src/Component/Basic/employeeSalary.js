import React, { Component } from 'react'
import Sidebar from '../Auth/sidebar'
import { verifyAuth } from '../../utils/authentication'
import axios from 'axios'
import { MDBInput } from "mdbreact";
import Card from '@material-ui/core/Card'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import { Button, Row, Col } from 'reactstrap';
import '../../Css/Basic/bankDetails.css'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { getFromStorage } from "../../utils/storage";
import DatePicker from "react-datepicker";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';


export default class employeeSalary extends Component {
    constructor(props) {
        super(props)

        this.state={
            authState : '',
            snackbaropen: false,


        }
    }

    componentDidMount() {

    }

    render() {
        return (
            <React.Fragment>
                <div className="container-fluid">
                    <Snackbar
                        open={this.state.snackbaropen}
                        autoHideDuration={2000}
                        onClose={this.snackbarClose}
                        message={<span id="message-id">{this.state.snackbarmsg}</span>}
                        action={[
                            <IconButton
                                key="close"
                                aria-label="Close"
                                color="secondary"
                                onClick={this.snackbarClose}
                            > x </IconButton>
                        ]}
                    />
                    <div className="row">
                        <div className="col-md-2" style={{ backgroundColor: "#1c2431" }}>
                            <Sidebar />
                        </div>
                        <div className="col-md-10" style={{ backgroundColor: "#f5f5f5" }}>
                            <div className="container">
                                <Tabs defaultActiveKey="salary" id="uncontrolled-tab-example" style={{ marginTop: "20px" }}>
                                    <Tab eventKey="salary" title="Salary">
                                        <Card>

                                        </Card>
                                    </Tab>
                                    <Tab eventKey="loan" title="Profits / Loans">
                                        
                                    </Tab>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

import React, { Component } from 'react'
import Sidebar from '../Auth/sidebar'
import { verifyAuth } from '../../utils/authentication'
import axios from 'axios'
import { MDBInput } from "mdbreact";
import Card from '@material-ui/core/Card'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import { Button, Row, Col } from 'reactstrap';
import '../../Css/Basic/employeeSalary.css'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { getFromStorage } from "../../utils/storage";
import DatePicker from "react-datepicker";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';


export default class employeeSalary extends Component {
    constructor(props) {
        super(props)

        this.state = {
            authState: '',
            snackbaropen: false,
            snackbarmsg: '',



        }
        this.onChangeSalInput = this.onChangeSalInput.bind(this)
        this.addSalary = this.addSalary.bind(this)

    }
    snackbarClose = (event) => {
        this.setState({ snackbaropen: false })
    }
    componentDidMount() {

    }
    onChangeSalInput = (e) => {

    }

    addSalary = () => {

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
                                        <div>
                                            <Row>
                                                <Col xs="8">
                                                    <Card style={{ marginTop: "18px" }}>
                                                        <div className="container">
                                                            <Row>
                                                                <Col xs="4">
                                                                    <MDBInput outline label="Emp ID" placeholder="Emp ID" name="empId" onChange={this.onChangeSalInput} />
                                                                </Col>
                                                                <Col xs="4">
                                                                    <MDBInput outline label="Amount" placeholder="Amount" name="empAmount" onChange={this.onChangeSalInput} />
                                                                </Col>
                                                                <Col xs="4" style={{ marginTop: "18px" }}>
                                                                    <Button className="sub-btn" color="primary" onClick={this.addSalary}>Submit</Button>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </Card>
                                                </Col>
                                                <Col xs="4">
                                                    <Card style={{ marginTop: "18px" }}>
                                                        <div className="container">
                                                            <Row>
                                                                <Col xs="12">
                                                                    <MDBInput outline label="Emp ID" placeholder="Emp ID" name="empId" onChange={this.onChangeSalInput} />
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </div>
                                        <div style={{ marginTop: "20px" }}>
                                            <Card>
                                                <div className="container">
                                                    <Row>
                                                        <Col xs="3">
                                                            <p className="tbl-head">Date</p>
                                                        </Col>
                                                        <Col xs="3">
                                                            <p className="tbl-head">Employee ID</p>
                                                        </Col>
                                                        <Col xs="3">
                                                            <p className="tbl-head">Amount</p>
                                                        </Col>
                                                        <Col xs="3">
                                                            <p className="tbl-head">Action</p>
                                                        </Col>
                                                    </Row>
                                                </div>
                                                <div className="container">
                                                    <Row>
                                                        <Col xs="3">
                                                            <p className="tbl-body">Date</p>
                                                        </Col>
                                                        <Col xs="3">
                                                            <p className="tbl-body">Employee ID</p>
                                                        </Col>
                                                        <Col xs="3">
                                                            <p className="tbl-body">Amount</p>
                                                        </Col>
                                                        <Col xs="3">
                                                            <p className="tbl-body">Action</p>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Card>
                                        </div>

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

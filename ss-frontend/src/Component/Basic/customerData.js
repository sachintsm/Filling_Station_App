import React, { Component } from 'react';
import { verifyAuth } from '../../utils/authentication'
import axios from 'axios';
import { Col, Row } from 'react-bootstrap';
import Sidebar from '../Auth/sidebar';
import "react-datepicker/dist/react-datepicker.css";
import '../../Css/Basic/cusprofile.css';
import Card from '@material-ui/core/Card';
import Snackpop from "../Auth/Snackpop";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

const backend_URI = require('../Auth/Backend_URI')

class customerData extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fullName: '',
            debtorId: '',
            damount: '',
            nic: '',
            mobile: '',
            fax: '',
            address: '',
            other: '',

            accountData: [],
            currentBalance: 0.00,

            snackbaropen: false,
            snackbarmsg: '',
            snackbarcolor: '',
        }
    }
    closeAlert = () => {
        this.setState({ snackbaropen: false });
    };

    componentDidMount = async () => {
        const authState = await verifyAuth();
        this.setState({ authState: authState })
        if (!authState) this.props.history.push('/login');

        //? get debitor bio data
        await axios.get(backend_URI.url + '/debtors/customer/' + this.props.match.params.id)
            .then(res => {
                this.setState({
                    fullName: res.data.data[0].fullName,
                    debtorId: res.data.data[0].debtorId,
                    damount: res.data.data[0].damount,
                    nic: res.data.data[0].nic,
                    mobile: res.data.data[0].mobile,
                    fax: res.data.data[0].fax,
                    address: res.data.data[0].address,
                    other: res.data.data[0].other
                })
            })

        // ?get debitor account data
        await axios.get(backend_URI.url + '/debitorsAccount/getAccountDetails/' + this.props.match.params.id)
            .then(res => {
                this.setState({
                    accountData: res.data.data
                })

                var debit = 0;
                var credit = 0;

                for (var i = 0; i < this.state.accountData.length; i++) {
                    if (this.state.accountData[i].debitAmount != null) {
                        debit = debit + parseFloat(this.state.accountData[i].debitAmount)
                    }
                    if (this.state.accountData[i].creditAmount != null) {
                        credit = credit + parseFloat(this.state.accountData[i].creditAmount)
                    }
                }
                this.setState({
                    currentBalance: (parseFloat(this.state.damount) + credit - debit).toFixed(2)
                })
            })
    }

    deleteRow(data) {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        axios.delete(backend_URI.url + '/debitorsAccount/deleteDebAccountRow/' + data)
                            .then(res => {
                                this.setState({
                                    snackbaropen: true,
                                    snackbarmsg: res.data.message,
                                    snackbarcolor: 'success'
                                })
                                window.location.reload();
                            })
                            .catch(err => {
                                this.setState({
                                    snackbaropen: true,
                                    snackbarmsg: err,
                                    snackbarcolor: 'error'
                                })
                            })

                    }
                },
                {
                    label: 'No',
                    onClick: () => {

                    }
                }
            ]
        })
    }

    render() {
        let currentBalance;
        if (this.state.currentBalance < 0) {
            currentBalance = <p className="cd-body-text" style={{ color: 'red' }}>{this.state.currentBalance} LKR</p>
        }
        else {
            currentBalance = <p className="cd-body-text" style={{ color: 'green' }}>{this.state.currentBalance} LKR</p>
        }

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

                        <div className="col-md-12" style={{ backgroundColor: "#f8f9fd" }}>
                            <div className="container-fluid">
                                <div className="row" style={{ marginTop: '50px' }}>
                                    <div className="col-md-9">
                                        <p className="cp_head">{this.state.fullName}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="container-fluid">
                                <Card>
                                    <div className="container-fluid">
                                        <Row style={{ marginTop: "20px" }}>
                                            <Col xs="2">
                                                <p className="cd-head-text">Customer ID</p>
                                            </Col>
                                            <Col xs="1">
                                                <p className="cd-head-text">:</p>
                                            </Col>
                                            <Col xs="3">
                                                <p className="cd-body-text">{this.state.debtorId}</p>
                                            </Col>
                                            <Col xs="2">
                                                <p className="cd-head-text">Deposit</p>
                                            </Col>
                                            <Col xs="1">
                                                <p className="cd-head-text">:</p>
                                            </Col>
                                            <Col xs="3">
                                                <p className="cd-body-text">{this.state.damount} LKR</p>

                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="2">
                                                <p className="cd-head-text">Mobile Number</p>
                                            </Col>
                                            <Col xs="1">
                                                <p className="cd-head-text">:</p>
                                            </Col>
                                            <Col xs="3">
                                                <p className="cd-body-text">{this.state.mobile}</p>
                                            </Col>
                                            <Col xs="2">
                                                <p className="cd-head-text">Fax Number</p>
                                            </Col>
                                            <Col xs="1">
                                                <p className="cd-head-text">:</p>
                                            </Col>
                                            <Col xs="3">
                                                <p className="cd-body-text">{this.state.fax}</p>

                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="2">
                                                <p className="cd-head-text">Address</p>
                                            </Col>
                                            <Col xs="1">
                                                <p className="cd-head-text">:</p>
                                            </Col>
                                            <Col xs="3">
                                                <p className="cd-body-text">{this.state.address}</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="2">
                                                <p className="cd-head-text">Other</p>
                                            </Col>
                                            <Col xs="1">
                                                <p className="cd-head-text">:</p>
                                            </Col>
                                            <Col xs="3">
                                                <p className="cd-body-text">{this.state.other}</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="2">
                                                <p className="cd-head-text">Current Balance</p>
                                            </Col>
                                            <Col xs="1">
                                                <p className="cd-head-text">:</p>
                                            </Col>
                                            <Col xs="3">
                                                {currentBalance}
                                            </Col>
                                        </Row>
                                    </div>
                                </Card>

                            </div>
                            <div className="container-fluid">
                                <Card style={{ marginTop: '20px', marginBottom: "20px" }}>

                                    <div className="sp_table">
                                        <table className="table" style={{ marginTop: 20 }} >
                                            <thead>
                                                <tr>
                                                    <th className="table-cp-head">Date</th>
                                                    <th className="table-cp-head">Bill No</th>
                                                    <th className="table-cp-head">Invoice No</th>
                                                    <th className="table-cp-head">Vehicle No</th>
                                                    <th className="table-cp-head">Product Name</th>
                                                    <th className="table-cp-head">Size</th>
                                                    <th className="table-cp-head">Quentity</th>
                                                    <th className="table-cp-head" style={{ textAlign: "right" }}>Debit</th>
                                                    <th className="table-cp-head" style={{ textAlign: "right" }}>Credit</th>
                                                    <th className="table-cp-head">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.accountData.map((data) => {
                                                    if (data.creditAmount != null) {
                                                        return (
                                                            <tr key={data._id} className="table-row-cp">
                                                                <th className="table-cp-body" style={{ color: 'red' }}>{data.date}</th>
                                                                <th className="table-cp-body" style={{ color: 'red' }}>{data.chequeNo}</th>
                                                                <th className="table-cp-body">{data.invoiceNo}</th>
                                                                <th className="table-cp-body">{data.vehicleNo}</th>
                                                                <th className="table-cp-body">{data.productName}</th>
                                                                <th className="table-cp-body">{data.size}</th>
                                                                <th className="table-cp-body">{data.qty}</th>
                                                                <th className="table-cp-body" style={{ textAlign: "right" }}>{data.debitAmount}</th>
                                                                <th className="table-cp-body" style={{ color: 'red', textAlign: "right" }}>{data.creditAmount}</th>
                                                                <th style={{ textAlign: "center" }}><DeleteForeverIcon className="delete-btn-cp" onClick={() => this.deleteDebtor(data._id)} /></th>
                                                            </tr>
                                                        )
                                                    }
                                                    else {
                                                        return (
                                                            <tr key={data._id} className="table-row-cp">
                                                                <th className="table-cp-body">{data.date}</th>
                                                                <th className="table-cp-body">{data.billNo}{data.chequeNo}</th>
                                                                <th className="table-cp-body">{data.invoiceNo}</th>
                                                                <th className="table-cp-body">{data.vehicleNo}</th>
                                                                <th className="table-cp-body">{data.productName}</th>
                                                                <th className="table-cp-body">{data.size}</th>
                                                                <th className="table-cp-body" style={{ textAlign: "center" }}>{data.qty}</th>
                                                                <th className="table-cp-body" style={{ textAlign: "right" }}>{data.debitAmount}</th>
                                                                <th className="table-cp-body" style={{ textAlign: "right" }}>{data.creditAmount}</th>
                                                                <th style={{ textAlign: "center" }}><DeleteForeverIcon className="delete-btn-cp" onClick={() => this.deleteRow(data._id)} /></th>
                                                            </tr>
                                                        )
                                                    }
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </Card>

                            </div>


                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default customerData;
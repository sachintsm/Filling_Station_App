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

export default class bankDetails extends Component {
    constructor(props) {
        super(props)

        this.state = {
            snackbaropen: false,
            snackbarmsg: '',
            snackbarcolor: '',

            bankName: '',
            accountNumber: '',
            accountName: '',
            BankAccount: [],

            dip_account: '',
            dip_type: '',
            dip_amount: '',
            dip_cheque: '',
            dip_date: new Date(),

            lastSeven: [],
            lastMonth: [],

            date1_date: new Date(),
            date2_date: new Date(),

            dataDiv: false,
        }

        this.onChangeReg = this.onChangeReg.bind(this)
        this.onRegisterAccount = this.onRegisterAccount.bind(this)
        this.onChangeType = this.onChangeType.bind(this)
        this.onChangeAccount = this.onChangeAccount.bind(this)
        this.onChangeDiposit = this.onChangeDiposit.bind(this)
        this.onDiposit = this.onDiposit.bind(this)
        this.onChangeDate = this.onChangeDate.bind(this)
        this.bankDelete = this.bankDelete.bind(this)

        this.onChangeDate1 = this.onChangeDate1.bind(this)
        this.onChangeDate2 = this.onChangeDate2.bind(this)

    }
    closeAlert = () => {
        this.setState({ snackbaropen: false });
    };

    onChangeDate = date => {
        this.setState(prevState => ({
            dip_date: date
        }))
    }
    onChangeDate1 = date => {
        this.setState(prevState => ({
            date1_date: date
        }))
    }
    onChangeDate2 = date => {
        this.setState(prevState => ({
            date2_date: date
        }))
    }

    componentDidMount = async () => {
        const authState = await verifyAuth();
        this.setState({ authState: authState })
        if (!authState) this.props.history.push('/login');

        axios.get(backend_URI.url + '/bankAccountRegistration/getAccountNames')
            .then(res => {
                this.setState({
                    BankAccount: res.data.data
                })
            })

        axios.get(backend_URI.url + '/bankAccountData/getLastSeven')
            .then(res => {
                this.setState({
                    lastSeven: res.data.data
                })
            })

    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    onChangeReg(e) {
        e.persist = () => { };
        let store = this.state;
        store[e.target.name] = e.target.value
        this.setState(store);
    }

    //? register new bank account
    onRegisterAccount() {
        const obj = getFromStorage('auth-token');
        console.log(this.state.bankName + this.state.accountName + this.state.accountNumber)
        if (this.state.bankName === '' || this.state.accountNumber === '' || this.state.accountName === '') {
            this.setState({
                snackbaropen: true,
                snackbarmsg: "Please Fill the Missing Fields ..!",
                snackbarcolor: 'error'
            })
        }
        else {

            const data = {
                bankName: this.state.bankName,
                accountName: this.state.accountName,
                accountNumber: this.state.accountNumber,
            }

            confirmAlert({
                title: 'Confirm to delete?',
                message: 'Are you sure to do this?',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: async () => {
                            fetch(backend_URI.url + '/bankAccountRegistration/add', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'auth-token': obj.token
                                },
                                body: JSON.stringify(data),
                            })
                                .then(res => res.json())
                                .then(json => {
                                    console.log(json);
                                    if (json.state === false) {
                                        this.setState({
                                            snackbaropen: true,
                                            snackbarmsg: json.msg,
                                            snackbarcolor: 'error'
                                        })
                                    }
                                    else {
                                        this.setState({
                                            snackbaropen: true,
                                            snackbarmsg: json.msg,
                                            snackbarcolor: 'success'
                                        })
                                        // window.location.reload();
                                    }

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
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    onChangeAccount(e) {
        this.setState({
            dip_account: e.target.value
        })
    }

    onChangeType(e) {
        this.setState({
            dip_type: e.target.value
        })
    }

    onChangeDiposit(e) {
        e.persist = () => { };
        let store = this.state;
        store[e.target.name] = e.target.value
        this.setState(store);
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    onDiposit() {
        const obj = getFromStorage('auth-token');
        if (this.state.dip_amount === '' || this.state.dip_account === '' || this.state.dip_type === '') {
            this.setState({
                snackbaropen: true,
                snackbarmsg: "Please Fill the Missing Fields ..!",
                snackbarcolor: 'error'
            })
        }

        else {

            const data = {
                dip_account: this.state.dip_account,
                dip_type: this.state.dip_type,
                dip_amount: this.state.dip_amount,
                dip_cheque: this.state.dip_cheque,
                dip_date: this.state.dip_date,
            }
            confirmAlert({
                title: 'Confirm to deposit?',
                message: 'Are you sure to do this?',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: async () => {
                            fetch(backend_URI.url + '/bankAccountData/add', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'auth-token': obj.token
                                },
                                body: JSON.stringify(data),
                            })
                                .then(res => res.json())
                                .then(json => {
                                    console.log(json);
                                    this.setState({
                                        snackbaropen: true,
                                        snackbarmsg: json.msg,
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
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    getMonthDate = () => {
        const data = {
            date1: this.state.date1_date,
            date2: this.state.date2_date
        }
        axios.post(backend_URI.url + '/bankAccountData/getLastMonth', data)
            .then(res => {
                this.setState({
                    lastMonth: res.data.data
                })
            })
        this.setState({ dataDiv: true });

    }
    deleteAccount(data) {
        confirmAlert({
            title: 'Confirm to delete?',
            message: 'Are you sure to do this?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        axios.delete(backend_URI.url + '/bankAccountRegistration/delete/' + data)
                            .then(res => {
                                console.log(res);
                                this.setState({
                                    snackbaropen: true,
                                    snackbarmsg: res.data.message,
                                    snackbarcolor: 'success'
                                })
                                window.location.reload();
                            })
                            .catch(err => {
                                console.log(err);
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

    bankDelete(data) {
        confirmAlert({
            title: 'Confirm to delete?',
            message: 'Are you sure to do this?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        axios.delete(backend_URI.url + '/bankAccountData/delete/' + data)
                            .then(res => {
                                console.log(res);
                                this.setState({
                                    snackbaropen: true,
                                    snackbarmsg: res.data.message,
                                    snackbarcolor: 'success'
                                })
                                window.location.reload();
                            })
                            .catch(err => {
                                console.log(err);
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
        const { BankAccount } = this.state;
        const { dataDiv } = this.state;

        let BankAccountList = BankAccount.length > 0
            && BankAccount.map((item, i) => {
                return (
                    <option key={i} value={item.accountNumber}>{item.accountNumber} - {item.accountName} - {item.bankName}</option>
                )
            }, this)
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
                                <Tabs defaultActiveKey="seven" id="uncontrolled-tab-example" style={{ marginTop: "20px" }}>
                                    <Tab eventKey="seven" title="Bank Deposits">
                                        <p className="topic">Bank Deposits</p>
                                        <div style={{ backgroundColor: "#ffffff", marginTop: "10px", borderRadius: "4px" }}>
                                            <div className="container">
                                                <div className="row">
                                                    <div className="col-md-5 fuel-selector">
                                                        <select className="form-control" onChange={this.onChangeAccount}>
                                                            <option>Select Account </option>
                                                            {BankAccountList}
                                                        </select>

                                                    </div>
                                                    <div className="col-md-4 fuel-selector">
                                                        <select className="form-control" onChange={this.onChangeType}>
                                                            <option>Select Diposit Type</option>
                                                            <option value="Cash">Cash</option>
                                                            <option value="Cheque">Cheque</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-md-3 fuel-selector">
                                                        <div className="form-group">
                                                            <DatePicker
                                                                className="form-control"
                                                                selected={this.state.dip_date}
                                                                onChange={this.onChangeDate}
                                                                dateFormat="yyyy-MM-dd"
                                                            />
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className="row">
                                                    <Col xs="4">
                                                        <MDBInput outline label="Cheque Number" type="text" name="dip_cheque" onChange={this.onChangeDiposit} />
                                                    </Col>
                                                    <Col xs="4">
                                                        <MDBInput outline label="Amount" type="text" name="dip_amount" onChange={this.onChangeDiposit} />
                                                    </Col>

                                                    <Col xs="4" style={{ marginTop: "18px" }}>
                                                        <Button className="sub-btn" color="primary" onClick={this.onDiposit}>Diposit</Button>
                                                    </Col>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="topic">Latest Bank Details</p>
                                        <div style={{ backgroundColor: "#ffffff", marginTop: "10px", borderRadius: "4px", marginBottom: "20px" }}>
                                            <div className="container">
                                                <div className="row">
                                                    <Col xs="2">
                                                        <p className="tbl-head">Date</p>
                                                    </Col>
                                                    <Col xs="4">
                                                        <p className="tbl-head">Account Number</p>
                                                    </Col>
                                                    <Col xs="3">
                                                        <p className="tbl-head">Cheque Number</p>
                                                    </Col>
                                                    <Col xs="2" style={{ textAlign: 'center' }}>
                                                        <p className="tbl-head">Amount</p>
                                                    </Col>
                                                    <Col xs="1" style={{ textAlign: 'center' }}>
                                                        <p className="tbl-head">Action</p>
                                                    </Col>
                                                </div>
                                                {this.state.lastSeven.map(data => {
                                                    return (
                                                        <div className="row" key={data._id}>
                                                            <Col xs="2">
                                                                <p className="tbl-body">{data.date}</p>
                                                            </Col>
                                                            <Col xs="4">
                                                                <p className="tbl-body">{data.accountNumber}</p>
                                                            </Col>
                                                            <Col xs="3">
                                                                <p className="tbl-body">{data.chequeNo}</p>
                                                            </Col>
                                                            <Col xs="2" style={{ textAlign: 'right' }}>
                                                                <p className="tbl-body">{data.amount}</p>
                                                            </Col>
                                                            <Col xs="1" style={{ textAlign: 'center' }}>
                                                                <DeleteForeverIcon className="del-btn" onClick={() => this.bankDelete(data._id)} />
                                                            </Col>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </Tab>
                                    <Tab eventKey="month" title="Account Management">
                                        <p className="topic">Bank Account Registraion</p>
                                        <div style={{ bgcolor: "#ffffff", marginTop: "10px" }}>
                                            <div className="container" style={{ backgroundColor: "#ffffff", borderRadius: "4px" }}>
                                                <div className="row">
                                                    <Col xs="3">
                                                        <MDBInput outline label="Bank Name" type="text" name="bankName" onChange={this.onChangeReg} />
                                                    </Col>
                                                    <Col xs="3">
                                                        <MDBInput outline label="Account Name" type="text" name="accountName" onChange={this.onChangeReg} />
                                                    </Col>
                                                    <Col xs="3">
                                                        <MDBInput outline label="Account Number" type="text" name="accountNumber" onChange={this.onChangeReg} />
                                                    </Col>
                                                    <Col xs="3" style={{ marginTop: "18px" }}>
                                                        <Button className="sub-btn" color="primary" onClick={this.onRegisterAccount}>Add Account</Button>
                                                    </Col>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="topic">Registered Accounts</p>
                                        <div style={{ bgcolor: "#ffffff", marginTop: "10px" }}>
                                            <div className="container" style={{ backgroundColor: "#ffffff", borderRadius: "4px" }}>
                                                <div className="row">
                                                    <div className="container">

                                                        <table className="table table-striped" style={{ marginTop: 20 }} >
                                                            <thead>
                                                                <tr>
                                                                    <th>Bank Name</th>
                                                                    <th>Account Name</th>
                                                                    <th>Account Number</th>
                                                                    <th>Action</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {this.state.BankAccount.map(data => {
                                                                    return (
                                                                        <tr key={data._id}>
                                                                            <th>{data.bankName}</th>
                                                                            <th>{data.accountName}</th>
                                                                            <th>{data.accountNumber}</th>
                                                                            <th><DeleteForeverIcon className="delete-btn-cp" onClick={() => this.deleteAccount(data._id)} /></th>
                                                                        </tr>
                                                                    )
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="topic">Past Bank Details</p>
                                        <Row>
                                            <Col xs="2">
                                                <div className="form-group">
                                                    <DatePicker
                                                        className="form-control"
                                                        selected={this.state.date1_date}
                                                        onChange={this.onChangeDate1}
                                                        dateFormat="yyyy-MM-dd"
                                                    />
                                                </div>

                                            </Col>
                                            <Col xs="2">
                                                <div className="form-group">
                                                    <DatePicker
                                                        className="form-control"
                                                        selected={this.state.date2_date}
                                                        onChange={this.onChangeDate2}
                                                        dateFormat="yyyy-MM-dd"
                                                    />
                                                </div>
                                            </Col>
                                            <Col xs="2" style={{ marginTop: "-5px" }}>
                                                <Button className="sub-btn" color="primary" onClick={this.getMonthDate}>Search</Button>
                                            </Col>
                                        </Row>
                                        {dataDiv && (
                                            <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={true} animationInDuration={1200}>

                                                <div style={{ backgroundColor: "#ffffff", marginTop: "10px", borderRadius: "4px", marginBottom: "20px" }}>
                                                    <div className="container">
                                                        <div className="row">
                                                            <Col xs="2">
                                                                <p className="tbl-head">Date</p>
                                                            </Col>
                                                            <Col xs="4">
                                                                <p className="tbl-head">Account Number</p>
                                                            </Col>
                                                            <Col xs="3">
                                                                <p className="tbl-head">Cheque Number</p>
                                                            </Col>
                                                            <Col xs="3" style={{ textAlign: 'center' }}>
                                                                <p className="tbl-head">Amount</p>
                                                            </Col>

                                                        </div>
                                                        {this.state.lastMonth.map(data => {
                                                            return (
                                                                <div className="row" key={data._id}>
                                                                    <Col xs="2">
                                                                        <p className="tbl-body">{data.date}</p>
                                                                    </Col>
                                                                    <Col xs="4">
                                                                        <p className="tbl-body">{data.accountNumber}</p>
                                                                    </Col>
                                                                    <Col xs="3">
                                                                        <p className="tbl-body">{data.chequeNo}</p>
                                                                    </Col>
                                                                    <Col xs="3" style={{ textAlign: 'right' }}>
                                                                        <p className="tbl-body">{data.amount}</p>
                                                                    </Col>

                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            </Animated>
                                        )}
                                    </Tab>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

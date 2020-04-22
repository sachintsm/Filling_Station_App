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

            empId: '',
            empAmount: '',

            empIdSearch: '',

            loanType: '',
            loanEmpId: '',
            loanAmount: '',

            loanSearch: '',

            employeeSalary: [],
            employeeLoan: [],
            credit: '',
        }
        this.onChangeSalInput = this.onChangeSalInput.bind(this)
        this.addSalary = this.addSalary.bind(this)
        this.onChangeType = this.onChangeType.bind(this)
        this.onChangeLoan = this.onChangeLoan.bind(this)
        this.addLoan = this.addLoan.bind(this)
        this.onChangeSalSearch = this.onChangeSalSearch.bind(this)
        this.onSalaryDelete = this.onSalaryDelete.bind(this)
        this.onChangeLoanSearch = this.onChangeLoanSearch.bind(this)
        this.onLoanDelete = this.onLoanDelete.bind(this)

    }
    snackbarClose = (event) => {
        this.setState({ snackbaropen: false })
    }

    componentDidMount = async () => {
        const authState = await verifyAuth();
        this.setState({ authState: authState })
        if (!authState) this.props.history.push('/login');

        axios.get('http://localhost:4000/employeeSalary/get')
            .then(res => {
                this.setState({
                    employeeSalary: res.data.data
                })
                console.log(res.data.data);
            })
        axios.get('http://localhost:4000/employeeLoan/get')
            .then(res => {
                this.setState({
                    employeeLoan: res.data.data
                })
                console.log(res.data.data);
            })
    }
    /*********************************************************** */
    onChangeSalInput = (e) => {
        e.persist = () => { };
        let store = this.state;
        store[e.target.name] = e.target.value
        this.setState(store);
    }

    addSalary = () => {
        const obj = getFromStorage('auth-token');


        if (this.state.empId === '' || this.state.empAmount === '') {
            this.setState({
                snackbaropen: true,
                snackbarmsg: "Please Fill the Data ..!"
            })
        }
        else {
            const data = {
                empId: this.state.empId,
                amount: this.state.empAmount
            }

            fetch('http://localhost:4000/employeeSalary/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': obj.token
                },
                body: JSON.stringify(data),
            })
                .then(res => res.json())
                .then(json => {
                    // alert(json.msg)
                    this.setState({
                        snackbaropen: true,
                        snackbarmsg: json.msg
                    })
                    // window.location.reload();
                })
                .catch(err => {
                    this.setState({
                        snackbaropen: true,
                        snackbarmsg: err
                    })
                    console.log(err)
                })
        }
    }

    /*********************************************************** */
    onChangeSalSearch = (e) => {
        this.setState({
            empIdSearch: e.target.value
        })
    }

    onSalaryDelete = (data) => {
        axios.delete('http://localhost:4000/employeeSalary/delete/' + data)
            .then((res) => {
                console.log(res);
                this.setState({
                    snackbaropen: true,
                    snackbarmsg: res.data.message
                })
                window.location.reload();
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    snackbaropen: true,
                    snackbarmsg: err
                })
            })
    }

    /*********************************************************** */
    onChangeType(e) {
        this.setState({
            loanType: e.target.value
        })
    }
    onChangeLoan = (e) => {
        e.persist = () => { };
        let store = this.state;
        store[e.target.name] = e.target.value
        this.setState(store);
    }
    onChangeLoanSearch = (e) => {
        this.setState({
            loanSearch: e.target.value
        })
    }

    addLoan() {
        const obj = getFromStorage('auth-token');

        if (this.state.loanEmpId === '' || this.state.loanAmount === '' || this.state.loanType === '') {
            this.setState({
                snackbaropen: true,
                snackbarmsg: "Please Fill the Data ..!"
            })
        }
        else {
            const data = {
                empId: this.state.loanEmpId,
                amount: this.state.loanAmount,
                type: this.state.loanType
            }

            fetch('http://localhost:4000/employeeLoan/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': obj.token
                },
                body: JSON.stringify(data),
            })
                .then(res => res.json())
                .then(json => {
                    // alert(json.msg)
                    this.setState({
                        snackbaropen: true,
                        snackbarmsg: json.msg
                    })
                    // window.location.reload();
                })
                .catch(err => {
                    this.setState({
                        snackbaropen: true,
                        snackbarmsg: err
                    })
                    console.log(err)
                })
        }
    }

    onLoanDelete = (data) => {
        axios.delete('http://localhost:4000/employeeLoan/delete/' + data)
            .then((res) => {
                console.log(res);
                this.setState({
                    snackbaropen: true,
                    snackbarmsg: res.data.message
                })
                window.location.reload();
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    snackbaropen: true,
                    snackbarmsg: err
                })
            })
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
                                <Tabs defaultActiveKey="loan" id="uncontrolled-tab-example" style={{ marginTop: "20px" }}>
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
                                                                    <MDBInput outline label="Search by Emp ID" name="empIdSearch" onChange={this.onChangeSalSearch} />
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
                                                    {this.state.employeeSalary.map(data => {
                                                        return (
                                                            <Row key={data._id}>
                                                                <Col xs="3">
                                                                    <p className="tbl-body">{data.date}</p>
                                                                </Col>
                                                                <Col xs="3">
                                                                    <p className="tbl-body">{data.empId}</p>
                                                                </Col>
                                                                <Col xs="3">
                                                                    <p className="tbl-body">{data.amount}</p>
                                                                </Col>
                                                                <Col xs="3">
                                                                    <DeleteForeverIcon className="del-btn" onClick={() => this.onSalaryDelete(data._id)} />
                                                                </Col>
                                                            </Row>
                                                        )
                                                    })}
                                                </div>
                                            </Card>
                                        </div>

                                    </Tab>
                                    <Tab eventKey="loan" title="Profits / Loans">
                                        <div>
                                            <Row>
                                                <Col xs="8">
                                                    <Card style={{ marginTop: "18px" }}>
                                                        <div className="container">
                                                            <Row>
                                                                <Col xs="3">
                                                                    <MDBInput outline label="Emp ID" placeholder="Emp ID" name="loanEmpId" onChange={this.onChangeLoan} />
                                                                </Col>
                                                                <Col xs="3">
                                                                    <MDBInput outline label="Amount" placeholder="Amount" name="loanAmount" onChange={this.onChangeLoan} />
                                                                </Col>
                                                                <Col xls="3" style={{ marginTop: "23px" }}>
                                                                    <select className="form-control" onChange={this.onChangeType}>
                                                                        <option>Select Type</option>
                                                                        <option value="credit">Credit</option>
                                                                        <option value="debit">Debit</option>
                                                                    </select>
                                                                </Col>
                                                                <Col xs="3" style={{ marginTop: "18px" }}>
                                                                    <Button className="sub-btn" color="primary" onClick={this.addLoan}>Submit</Button>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </Card>

                                                    <div style={{ marginTop: "20px", marginBottom: "20px" }}>
                                                        <Card>
                                                            <div className="container">
                                                                <Row style={{ marginTop: "10px" }} >
                                                                    <Col xs="2">
                                                                        <p className="tbl-head">Search</p>
                                                                    </Col>
                                                                    <Col xs="10" style={{ marginTop: "-10px" }}>
                                                                        <MDBInput outline label="Emp ID" placeholder="Emp ID" name="loanSearch" onChange={this.onChangeLoanSearch} />
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                            <div className="container" style={{ marginTop: "-10px" }}>
                                                                <hr style={{ marginLeft: "-3px" }}></hr>
                                                            </div>
                                                            <div className="container">
                                                                <Row>
                                                                    <Col xs="2">
                                                                        <p className="tbl-head">Date</p>
                                                                    </Col>
                                                                    <Col xs="2">
                                                                        <p className="tbl-head">Emp ID</p>
                                                                    </Col>
                                                                    <Col xs="3" style={{ textAlign: "center" }}>
                                                                        <p className="tbl-head">Credit</p>
                                                                    </Col>
                                                                    <Col xs="3" style={{ textAlign: "center" }}>
                                                                        <p className="tbl-head">Debit</p>
                                                                    </Col>
                                                                    <Col xs="2" style={{ textAlign: "center" }}>
                                                                        <p className="tbl-head">Action</p>
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                            <div className="container">
                                                                {this.state.employeeLoan.map(data => {

                                                                    if (data.type === 'credit') {
                                                                        return (
                                                                            <Row key={data._id}>
                                                                                <Col xs="2">
                                                                                    <p className="tbl-body">{data.date}</p>
                                                                                </Col>
                                                                                <Col xs="2">
                                                                                    <p className="tbl-body">{data.empId}</p>
                                                                                </Col>
                                                                                <Col xs="3" style={{ textAlign: "right" }}>
                                                                                    <p className="tbl-body">{data.amount}</p>
                                                                                </Col>
                                                                                <Col xs="3" style={{ textAlign: "right" }}>
                                                                                    <p className="tbl-body">-</p>
                                                                                </Col>
                                                                                <Col xs="2" style={{ textAlign: "center" }}>
                                                                                    <DeleteForeverIcon className="del-btn" onClick={() => this.onLoanDelete(data._id)} />
                                                                                </Col>
                                                                            </Row>
                                                                        )
                                                                    }
                                                                    else {
                                                                        return (
                                                                            <Row key={data._id}>
                                                                                <Col xs="2">
                                                                                    <p className="tbl-body">{data.date}</p>
                                                                                </Col>
                                                                                <Col xs="2">
                                                                                    <p className="tbl-body">{data.empId}</p>
                                                                                </Col>
                                                                                <Col xs="3" style={{ textAlign: "right" }}>
                                                                                    <p className="tbl-body">-</p>
                                                                                </Col>
                                                                                <Col xs="3" style={{ textAlign: "right" }}>
                                                                                    <p className="tbl-body">{data.amount}</p>
                                                                                </Col>
                                                                                <Col xs="2" style={{ textAlign: "center" }}>
                                                                                    <DeleteForeverIcon className="del-btn" onClick={() => this.onLoanDelete(data._id)} />
                                                                                </Col>
                                                                            </Row>
                                                                        )
                                                                    }

                                                                })}

                                                            </div>
                                                        </Card>
                                                    </div>
                                                </Col>
                                                <Col xs="4">
                                                    <Card style={{ marginTop: "18px" }}>
                                                        <div className="container">
                                                            <Row>
                                                                <Col xs="12" style={{ textAlign: 'center' }}>
                                                                    <p className="tbl-head">Sachin Muthumala</p>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col xs="12" style={{ textAlign: 'center', marginTop: "-10px" }}>
                                                                    <p className="tbl-body">2049.00</p>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </div>


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

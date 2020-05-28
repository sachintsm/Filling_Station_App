import React, { Component } from 'react'
import Sidebar from '../Auth/sidebar'
import Card from '@material-ui/core/Card';
import { verifyAuth } from '../../utils/authentication'
import axios from 'axios'
import { Button, Row, Col } from 'reactstrap';
import '../../Css/Basic/dailySales.css';
import DatePicker from "react-datepicker";
import Snackpop from "../Auth/Snackpop";
import CircularProgress from '@material-ui/core/CircularProgress';

const backend_URI = require('../Auth/Backend_URI')

export default class dailySalesHistory extends Component {
    constructor(props) {
        super(props)

        this.state = {
            snackbaropen: false,
            snackbarmsg: '',
            snackbarcolor: '',

            startDate: new Date(),
            lockerSafe: [],
            lockerFinal: '',
            meterReading: [],
            debits: [],
            dailySales: [],
            dailySalesFuel: [],
            dailySalesFinalProfit: [],

            lockerSafeTotal: 0,
            dailySalesTotal: 0,
            dailySalesFuelTotal: 0,
            mainDebit: 0,
            mainCredit: 0,

            dataDive: false,
            progressDiv: false,
        }

        this.onDateSubmit = this.onDateSubmit.bind(this)

    }

    closeAlert = () => {
        this.setState({ snackbaropen: false });
    };

    onChangeDate = date => {
        this.setState(prevState => ({
            startDate: date
        }))
    }

    async componentDidMount() {
        const authState = await verifyAuth();
        this.setState({ authState: authState })
        if (!authState) this.props.history.push('/login');

    }

    onDateSubmit = async () => {

        this.setState({
            progressDiv: true,
            dataDiv: false
        })

        const date = this.state.startDate;

        function convertToday(str) {
            var date = new Date(str),
                mnth = ("" + (date.getMonth() + 1)).slice(-2),
                day = ("" + date.getDate()).slice(-2);
            return [date.getFullYear(), mnth, day].join("-");
        }
        let dt = convertToday(date)

        //? get locker safe details
        await axios.get(backend_URI.url + "/lockerState/get/" + dt)
            .then(res => {
                this.setState({ lockerSafe: res.data.data })
                let total = 0;
                for (var i = 0; i < this.state.lockerSafe.length; i++) {
                    total = total + parseFloat(this.state.lockerSafe[i].lockerAmount)
                }
                this.setState({ lockerSafeTotal: total.toFixed(2), })
            })

        //? get daily final sale data
        await axios.get(backend_URI.url + "/dailySales/get/" + dt)
            .then(res => {
                this.setState({ dailySales: res.data.data })
                let total = 0;
                for (var i = 0; i < this.state.dailySales.length; i++) {
                    total = total + parseFloat(this.state.dailySales[i].price)
                }
                this.setState({ dailySalesTotal: total.toFixed(2), })
            })

        //? get dailt sales data
        await axios.get(backend_URI.url + "/dailySales/getfinal/" + dt)
            .then(res => {
                if (res.data.data[0] != null) {
                    this.setState({
                        dailySalesFuel: res.data.data[0].fuels,
                        dailySalesFinalProfit: res.data.data[0].totalProfit
                    })
                    let total = 0;
                    for (var i = 0; i < this.state.dailySalesFuel.length; i++) {
                        total = total + parseFloat(this.state.dailySalesFuel[i].price)
                    }
                    this.setState({ dailySalesFuelTotal: total.toFixed(2) })
                }
            })

        // ? get final locker blance
        await axios.get(backend_URI.url + "/finalLocker/get/" + dt)
            .then(res => {
                if (res.data.data[0] = ! null) {
                    this.setState({ lockerFinal: res.data.data[0].amount })
                }
                else {
                    this.setState({ lockerFinal: 0.00 })
                }
            })

        //? load today meter reading
        await axios.get(backend_URI.url + '/machinesData/getToday/' + dt)
            .then(res => {
                this.setState({
                    meterReading: res.data.data
                })
            })

        //? get petroleum debit data
        await axios.get(backend_URI.url + '/debitorsAccount/getall/' + dt)
            .then(res => {
                this.setState({
                    debits: res.data.data
                })
                var tot1 = 0;
                var tot2 = 0;
                for (var i = 0; i < this.state.debits.length; i++) {
                    if (this.state.debits[i].debitAmount != null) {
                        tot1 = tot1 + parseFloat(this.state.debits[i].debitAmount)
                    }
                }
                for (var j = 0; j < this.state.debits.length; j++) {
                    if (this.state.debits[j].creditAmount != null) {
                        tot2 = tot2 + parseFloat(this.state.debits[j].creditAmount)
                    }
                }
                this.setState({
                    mainDebit: tot1.toFixed(2),
                    mainCredit: tot2.toFixed(2)
                })
            })
        this.setState({
            progressDiv: false,
            dataDiv: true
        })
    }
    render() {

        const { progressDiv, dataDiv } = this.state

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
                                <div className="container">
                                    <div className="first-div">
                                        <div className="row">
                                            <div className="col-md-5">
                                                <p className="first-topic">Sales Date</p>
                                                <div style={{ backgroundColor: "#ffffff", marginTop: "10px", borderRadius: "4px", marginBottom: "20px" }}>
                                                    <div className="row">
                                                        <div className="col-md-6" style={{ marginTop: "20px", marginLeft: "20px", marginBottom: "20px", marginRight: "-20px" }}>
                                                            <DatePicker
                                                                className="form-control"
                                                                selected={this.state.startDate}
                                                                onChange={this.onChangeDate}
                                                                dateFormat="yyyy-MM-dd"
                                                            />
                                                        </div>
                                                        <div className="col-md-6" style={{ marginTop: "15px" }}>
                                                            <Button className="sub-btn" color="primary" style={{ width: "90%" }} onClick={this.onDateSubmit}>Submit</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                                {progressDiv && (
                                                    <div style={{ textAlign: 'center', marginTop: "20px" }}>
                                                        <CircularProgress />
                                                    </div>
                                                )}

                                                {dataDiv && (

                                                    <div>
                                                        <p className="first-topic">Safe Locker State</p>

                                                        <div className="row" style={{ marginBottom: "30px", marginLeft: "0px", marginRight: "0px" }}>
                                                            <Card className="container">


                                                                <div className="row" style={{ marginTop: "10px" }}>
                                                                    <div className="col-md-7">
                                                                        <p className="topic-product">Time</p>
                                                                    </div>
                                                                    <div className="col-md-5" >
                                                                        <p className="topic-product" >Amount</p>
                                                                    </div>

                                                                </div>

                                                                {this.state.lockerSafe.map((data) => {
                                                                    return (
                                                                        <div className="row" key={data._id}>
                                                                            <div className="col-md-5">
                                                                                <p className="product">{data.time}</p>
                                                                            </div>
                                                                            <div className="col-md-7" style={{ textAlign: "right" }}>
                                                                                <p className="product">{data.lockerAmount}</p>
                                                                            </div>

                                                                        </div>
                                                                    )
                                                                })}
                                                            </Card>
                                                        </div>
                                                        <div>
                                                            <div className="row" style={{ marginRight: "0px", marginTop: "-20px" }}>
                                                                <div className="col-md-6">
                                                                </div>
                                                                <div className="col-md-3">
                                                                    <p className="topic-product">Total : </p>
                                                                </div>
                                                                <div className="col-md-3" style={{ textAlign: "right" }}>
                                                                    <p className="topic-product">{this.state.lockerSafeTotal}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p className="first-topic">Locker Final Balance</p>

                                                        <div className="row" style={{ marginBottom: "30px", marginLeft: "0px", marginRight: "0px" }}>
                                                            <Card className="container">

                                                                <div className="row" style={{ marginTop: "10px" }}>
                                                                    <div className="col-md-7">
                                                                        <p className="topic-product">Locker Balance : </p>
                                                                    </div>
                                                                    <div className="col-md-5" style={{ textAlign: "right" }}>
                                                                        <p className="topic-product">{this.state.lockerFinal}</p>
                                                                    </div>

                                                                </div>

                                                            </Card>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            {dataDiv && (


                                                <div className="col-md-7">
                                                    <p className="first-topic">Daily Sales</p>

                                                    <Card className="container" style={{ marginTop: "20px" }}>
                                                        <div className="row" style={{ marginTop: "10px" }}>
                                                            <div className="col-md-2">
                                                                <label className="topic-product">PID</label>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <label className="topic-product">Product Name</label>
                                                            </div>
                                                            <div className="col-md-2" style={{ textAlign: "right" }}>
                                                                <label className="topic-product">Size</label>
                                                            </div>
                                                            <div className="col-md-2" style={{ textAlign: "right" }}>
                                                                <label className="topic-product">Qty</label>
                                                            </div>
                                                            <div className="col-md-2" style={{ textAlign: "right" }}>
                                                                <label className="topic-product">Amount</label>
                                                            </div>
                                                        </div>
                                                        {this.state.dailySales.map((data) => {
                                                            return (
                                                                <div className="row" key={data._id}>
                                                                    <div className="col-md-2">
                                                                        <label className="product">{data.pId}</label>
                                                                    </div>
                                                                    <div className="col-md-4">
                                                                        <label className="product">{data.pName}</label>
                                                                    </div>
                                                                    <div className="col-md-2" style={{ textAlign: "right" }}>
                                                                        <label className="product">{data.size}</label>
                                                                    </div>
                                                                    <div className="col-md-2" style={{ textAlign: "right" }}>
                                                                        <label className="product">{data.qty}</label>
                                                                    </div>
                                                                    <div className="col-md-2" style={{ textAlign: "right" }}>
                                                                        <label className="product" >{data.price}</label>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </Card>
                                                    <div>
                                                        <div className="row" style={{ marginTop: "10px", marginRight: "0px" }}>
                                                            <div className="col-md-8">
                                                            </div>
                                                            <div className="col-md-2" style={{ textAlign: "right" }}>
                                                                <p className="topic-product">Total : </p>
                                                            </div>
                                                            <div className="col-md-2" style={{ textAlign: "right" }}>
                                                                <p className="topic-product">{this.state.dailySalesTotal}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/******************************************************************************************/}
                                    {dataDiv && (


                                        <div style={{ marginTop: "20px", marginBottom: "20px" }} >
                                            <Card className="container">
                                                <Row style={{ marginTop: "20px" }}>
                                                    <Col xs="2">
                                                        <p className="debtHead">Date</p>
                                                    </Col>
                                                    <Col xs="1">
                                                        <p className="debtHead">Debitor ID</p>
                                                    </Col>
                                                    <Col xs="1">
                                                        <p className="debtHead">Bill No.</p>
                                                    </Col>
                                                    <Col xs="3">
                                                        <p className="debtHead">Product Name</p>
                                                    </Col>
                                                    <Col xs="1">
                                                        <p className="debtHead">Size</p>
                                                    </Col>
                                                    <Col xs="1">
                                                        <p className="debtHead">Quentity</p>
                                                    </Col>
                                                    <Col xs="1">
                                                        <p className="debtHead">Debit</p>
                                                    </Col>
                                                    <Col xs="1">
                                                        <p className="debtHead">Credit</p>
                                                    </Col>
                                                    <Col xs="1">
                                                        <p className="debtHead">Machine Number</p>
                                                    </Col>

                                                </Row>
                                                <hr style={{ marginLeft: "0px" }}></hr>
                                                {this.state.debits.map((data) => {
                                                    return (
                                                        <Row key={data._id}>
                                                            <Col xs="2">
                                                                <p className="debitor-tbl-body">{data.date}</p>
                                                            </Col>
                                                            <Col xs="1">
                                                                <p className="debitor-tbl-body">{data.debitorId}</p>
                                                            </Col>
                                                            <Col xs="1">
                                                                <p className="debitor-tbl-body">{data.billNo}</p>
                                                            </Col>
                                                            <Col xs="3">
                                                                <p className="debitor-tbl-body">{data.productName}</p>
                                                            </Col>
                                                            <Col xs="1">
                                                                <p className="debitor-tbl-body">{data.size}</p>
                                                            </Col>
                                                            <Col xs="1">
                                                                <p className="debitor-tbl-body">{data.qty}</p>
                                                            </Col>
                                                            <Col xs="1" style={{ textAlign: 'right' }}>
                                                                <p className="debitor-tbl-body">{data.debitAmount}</p>
                                                            </Col>
                                                            <Col xs="1" style={{ textAlign: 'right' }}>
                                                                <p className="debitor-tbl-body">{data.creditAmount}</p>
                                                            </Col>
                                                            <Col xs="1">
                                                                <p className="debitor-tbl-body">{data.pumpId}</p>
                                                            </Col>

                                                        </Row>
                                                    )
                                                })}
                                            </Card>
                                            <div style={{ marginTop: "10px" }}>
                                                <Row>
                                                    <Col xs="9">
                                                    </Col>
                                                    <Col xs="1">
                                                        <p className="debitor-tbl-head">{this.state.mainDebit}</p>
                                                    </Col>
                                                    <Col xs="1">
                                                        <p className="debitor-tbl-head">{this.state.mainCredit}</p>
                                                    </Col>
                                                    <Col xs="1">
                                                    </Col>

                                                </Row>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </React.Fragment>
        )
    }
}

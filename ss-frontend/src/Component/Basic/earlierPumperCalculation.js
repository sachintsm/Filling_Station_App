import React, { Component } from 'react'
import Sidebar from '../Auth/sidebar'
import DatePicker from "react-datepicker";
import { verifyAuth } from '../../utils/authentication'
import '../../Css/Basic/dailyPumperCalculations.css'
import axios from 'axios'
import CircularProgress from '@material-ui/core/CircularProgress';
import { Animated } from "react-animated-css";
import Snackpop from "../Auth/Snackpop";
import 'react-confirm-alert/src/react-confirm-alert.css'

const backend_URI = require('../Auth/Backend_URI')

class finalBlock {
    constructor(pumpId, fuelType, yesterday, today, sale, debit, gross) {
        this.pumpId = pumpId;
        this.fuelType = fuelType;
        this.yesterday = yesterday;
        this.today = today;
        this.sale = sale
        this.debit = debit
        this.gross = gross
    }
}

class totDebit {
    constructor(pumpId, debit) {
        this.pumpId = pumpId;
        this.debit = debit;
    }
}
export default class dailyPumperCalculations extends Component {

    constructor(props) {
        super(props);

        this.state = {
            authState: '',
            snackbaropen: false,
            snackbarmsg: '',
            snackbarcolor: '',

            startDate: new Date(),
            pumperName: '',
            dataDiv: false,
            progressDiv: false,
            pumperIds: [],

            /********************************************************* */
            distinctDebit: [],
            el_pumperId: '',
            el_date: '',
            el_dataArray: [],
            el_yesterday: [],
            el_today: [],
            el_pumpsNames: [],
            finalBlock: [],
        }
        this.onChangeDate = this.onChangeDate.bind(this)
        this.onChangePumper = this.onChangePumper.bind(this)
        this.getEarlierData = this.getEarlierData.bind(this)
        this.onChangeEarlier = this.onChangeEarlier.bind(this)
    }
    closeAlert = () => {
        this.setState({ snackbaropen: false });
    };

    onChangeDate = date => {
        this.setState(prevState => ({
            startDate: date
        }))
    }

    onChangeEarlier(e) {
        this.setState({
            el_pumperId: e.target.value,
        })
    }

    async getEarlierData() {
        if (this.state.el_pumperId === '') {
            this.setState({
                snackbaropen: true,
                snackbarmsg: 'Please Enter Pumper ID..!',
                snackbarcolor: 'error'
            })
        }
        else {
            this.state.progressDiv = true

            const data = {
                el_pumperId: this.state.el_pumperId,
                el_date: this.state.startDate
            }
            this.state.debits = [];
            this.state.el_pumpNames = [];
            this.state.el_yesterday = [];
            this.state.el_today = [];
            this.state.distinctDebit = [];
            this.state.el_dataArray = [];

            //get data from pumpersCalculations
            await axios.post(backend_URI.url + '/pumpersCalculations/get', data)
                .then(res => {
                    if (res.data.state === false) {
                        this.setState({
                            snackbaropen: true,
                            snackbarmsg: res.data.msg,
                            snackbarcolor: 'error'
                        })
                    } else {
                        this.setState({
                            el_dataArray: res.data.data[0]
                        })
                    }
                })
                .catch(err => {
                    this.setState({
                        snackbaropen: true,
                        snackbarmsg: err,
                        snackbarcolor: 'error'
                    })
                })

            //get pumper name
            await axios.get(backend_URI.url + '/users/getPumperName/' + this.state.el_pumperId)
                .then(res => {

                    if (res.data.state === false) {
                        this.setState({
                            snackbaropen: true,
                            snackbarmsg: res.data.msg,
                            snackbarcolor: 'error'

                        })
                    }
                    else {
                        this.setState({
                            pumperName: res.data.data[0].fullName
                        })
                    }
                })
                .catch(err => {
                    this.setState({
                        snackbaropen: true,
                        snackbarmsg: err,
                        snackbarcolor: 'error'

                    })
                })

            //get yesterday meter reading
            await axios.get(backend_URI.url + '/machinesData/getYes/' + this.state.startDate)
                .then(res => {

                    this.setState({
                        el_yesterday: res.data.data
                    })
                })
            //get today meter reading
            await axios.get(backend_URI.url + '/machinesData/getToday/' + this.state.startDate)
                .then(res => {
                    this.setState({
                        el_today: res.data.data
                    })
                })

            //get Pumps Names
            if (this.state.el_dataArray === undefined) {
                this.setState({
                    snackbaropen: true,
                    snackbarcolor: 'error',
                    snackbarmsg: "Invalid Request..!"
                })
            }
            else {
                //? get pumps data (name, set, ...)
                await axios.get(backend_URI.url + '/pumpsRegistration/getSet/' + this.state.el_dataArray.setNumber)
                    .then(res => {
                        this.setState({
                            el_pumpsNames: res.data.data
                        })
                    })

                //get debiters data
                await axios.get(backend_URI.url + '/debitorsAccount/get/' + this.state.startDate)
                    .then(res => {
                        this.setState({
                            debits: res.data.data
                        })
                        for (var m = 0; m < this.state.el_pumpsNames.length; m++) {
                            var debitTotal = 0;
                            for (let n = 0; n < this.state.debits.length; n++) {
                                if (this.state.el_pumpsNames[m].machineNumber === this.state.debits[n].pumpId) {
                                    debitTotal = debitTotal + parseFloat(this.state.debits[n].qty)
                                }
                            }
                            var debitBlock = new totDebit(this.state.el_pumpsNames[m].machineNumber, debitTotal)
                            this.state.distinctDebit.push(debitBlock);
                        }
                    })
                this.state.finalBlock = [];

                for (var i = 0; i < this.state.el_pumpsNames.length; i++) {
                    for (var j = 0; j < this.state.el_yesterday.length; j++) {
                        for (var k = 0; k < this.state.el_today.length; k++) {
                            for (var l = 0; l < this.state.distinctDebit.length; l++) {
                                if (this.state.el_pumpsNames[i].machineNumber === this.state.el_yesterday[j].machineNumber && this.state.el_pumpsNames[i].machineNumber === this.state.el_today[k].machineNumber
                                    && this.state.el_pumpsNames[i].machineNumber === this.state.distinctDebit[l].pumpId) {
                                    var sale = (this.state.el_today[k].meterReading - this.state.el_yesterday[j].meterReading).toFixed(3)     //get pump whole sale
                                    var gross = (sale - this.state.distinctDebit[l].debit).toFixed(3)    //get gross size spesific pump
                                    var block = new finalBlock(this.state.el_pumpsNames[i].machineNumber, this.state.el_pumpsNames[i].fuelType, this.state.el_yesterday[j].meterReading, this.state.el_today[k].meterReading, sale, this.state.distinctDebit[l].debit, gross);
                                    this.state.finalBlock.push(block)
                                }
                            }
                        }
                    }
                }
                this.setState({ dataDiv: true, progressDiv: false });
            }
        }
    }

    componentDidMount = async () => {
        const authState = await verifyAuth();
        this.setState({ authState: authState })
        if (!authState) this.props.history.push('/login');

        //? get active pupmers ids
        axios.get(backend_URI.url + '/users/getPumpers')
            .then(res => {
                this.setState({
                    pumperIds: res.data.data
                })
            })
    }
    onChangePumper(e) {
        this.setState({
            el_pumperId: e.target.value
        })
    }
    render() {
        const { dataDiv, progressDiv } = this.state;
        const { pumperIds } = this.state;
        let pumpIdList = pumperIds.length > 0
            && pumperIds.map((item, i) => {
                return (
                    <option key={i} value={item.userId}>{item.userId}</option>
                )
            }, this);

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
                                <div className="container main-div-box" >
                                    <div className="container">

                                        <div className="row first-div">

                                            <div className="col-md-6" style={{ marginTop: "0px" }}>
                                                <select className="form-control" onChange={this.onChangePumper}>
                                                    <option >Pumper ID</option>
                                                    {pumpIdList}
                                                </select>
                                            </div>
                                            <div className="col-md-2">
                                                <div className="form-group">
                                                    <DatePicker
                                                        className="form-control"
                                                        selected={this.state.startDate}
                                                        onChange={this.onChangeDate}
                                                        dateFormat="yyyy-MM-dd"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4" style={{ marginTop: "-7px" }}>
                                                <button className="btn btn-primary sub-btn" onClick={this.getEarlierData}>Get Data</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {progressDiv && (
                                    <div style={{ textAlign: 'center', marginTop: "20px" }}>
                                        <CircularProgress />
                                    </div>
                                )}
                                {dataDiv && (
                                    <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={true} animationInDuration={1200}>

                                        <div className="container second-div" style={{ marginTop: "20px" }}>
                                            <div className="container">
                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <p style={{ fontSize: "21px", fontWeight: "500" }}>
                                                            {this.state.el_dataArray.date} -  {this.state.el_dataArray.setNumber}
                                                        </p>
                                                    </div>

                                                    <div className="col-md-9">
                                                        <p style={{ fontSize: "21px", fontWeight: "500" }} >
                                                            {this.state.el_dataArray.pumperId} - {this.state.pumperName}
                                                        </p>
                                                    </div>
                                                </div>
                                                <hr></hr>
                                                <div className="row">
                                                    {this.state.finalBlock.map((data) => {
                                                        return (
                                                            <div className="col-md-6" key={data.pumpId} style={{ marginTop: "20px" }}>
                                                                <div className="row" >
                                                                    <div className="col-md-2">
                                                                        <p className="pump-name">{data.pumpId}</p>
                                                                    </div>
                                                                    <div className="col-md-10">
                                                                        <p className="pump-name">{data.fuelType}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="row" style={{ marginTop: "-10px" }}>
                                                                    <div className="col-md-6">
                                                                        <p className="tag-text">Today Reading : </p>
                                                                    </div>
                                                                    <div className="col-md-1">
                                                                        <p className="tag-value">-</p>
                                                                    </div>
                                                                    <div className="col-md-5">
                                                                        <p className="tag-value">{data.today}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="row" style={{ marginTop: "-10px" }}>
                                                                    <div className="col-md-6">
                                                                        <p className="tag-text">Previous day Reading : </p>
                                                                    </div>
                                                                    <div className="col-md-1">
                                                                        <p className="tag-value">-</p>
                                                                    </div>
                                                                    <div className="col-md-5">
                                                                        <p className="tag-value">{data.yesterday}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="row" style={{ marginTop: "-10px" }} >
                                                                    <div className="col-md-6">
                                                                        <p className="tag-text">Total Sale : </p>
                                                                    </div>
                                                                    <div className="col-md-1">
                                                                        <p className="tag-value">-</p>
                                                                    </div>
                                                                    <div className="col-md-5">
                                                                        <p className="tag-value">{data.sale}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="row" style={{ marginTop: "-10px" }}>
                                                                    <div className="col-md-6">
                                                                        <p className="tag-text">Debit Amount : </p>
                                                                    </div>
                                                                    <div className="col-md-1">
                                                                        <p className="tag-value">-</p>
                                                                    </div>
                                                                    <div className="col-md-5">
                                                                        <p className="tag-value">{data.debit}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="row" style={{ marginTop: "-10px" }}>
                                                                    <div className="col-md-6">
                                                                        <p className="tag-text">Gross Sale : </p>
                                                                    </div>
                                                                    <div className="col-md-1">
                                                                        <p className="tag-value">-</p>
                                                                    </div>
                                                                    <div className="col-md-5">
                                                                        <p className="tag-value">{data.gross}</p>
                                                                    </div>
                                                                </div>

                                                                <hr></hr>
                                                            </div>
                                                        )
                                                    })}
                                                </div>

                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <p className="tag-text">Two StrokeOil Sale </p>
                                                    </div>
                                                    <div className="col-md-1">
                                                        <p className="">-</p>
                                                    </div>
                                                    <div className="col-md-5">
                                                        <p className="tag-value">
                                                            {this.state.el_dataArray.twoStrokeOil}
                                                        </p>
                                                    </div>
                                                </div>
                                                <hr style={{ marginTop: "-10px" }}></hr>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <p className="tag-text">Four StrokeOil Sale </p>
                                                    </div>
                                                    <div className="col-md-1">
                                                        <p className="">-</p>
                                                    </div>
                                                    <div className="col-md-5">
                                                        <p className="tag-value">
                                                            {this.state.el_dataArray.engineOil}
                                                        </p>
                                                    </div>
                                                </div>
                                                <hr style={{ marginTop: "-10px" }}></hr>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <p className="tag-text">Other Sales </p>
                                                    </div>
                                                    <div className="col-md-1">
                                                        <p className="">-</p>
                                                    </div>
                                                    <div className="col-md-5">
                                                        <p className="tag-value">
                                                            {this.state.el_dataArray.otherSales}
                                                        </p>
                                                    </div>
                                                </div>
                                                <hr style={{ marginTop: "-10px" }}></hr>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <p className="tag-text">Total Sales Amount</p>
                                                    </div>
                                                    <div className="col-md-1">
                                                        <p className="">-</p>
                                                    </div>
                                                    <div className="col-md-5">
                                                        <p className="tag-value">
                                                            {this.state.el_dataArray.saleAmount}
                                                        </p>
                                                    </div>
                                                </div>
                                                <hr style={{ marginTop: "-10px" }}></hr>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <p className="tag-text">Total Received </p>
                                                    </div>
                                                    <div className="col-md-1">
                                                        <p className="">-</p>
                                                    </div>
                                                    <div className="col-md-5">
                                                        <p className="tag-value">
                                                            {this.state.el_dataArray.receivedAmount}
                                                        </p>
                                                    </div>
                                                </div>
                                                <hr style={{ marginTop: "-10px" }}></hr>
                                                <div className="row" style={{ marginBottom: "30px" }}>
                                                    <div className="col-md-6">
                                                        <p className="tag-profit">Profit</p>
                                                    </div>
                                                    <div className="col-md-1">
                                                        <p className="tag-profit">-</p>
                                                    </div>
                                                    <div className="col-md-5">
                                                        <p className="tag-profit-value">
                                                            {this.state.el_dataArray.profit}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Animated>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

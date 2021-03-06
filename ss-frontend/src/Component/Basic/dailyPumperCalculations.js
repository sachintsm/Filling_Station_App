import React, { Component } from 'react'
import Sidebar from '../Auth/sidebar'
import DatePicker from "react-datepicker";
import { verifyAuth } from '../../utils/authentication'
import '../../Css/Basic/dailyPumperCalculations.css'
import axios from 'axios'
import { MDBInput } from "mdbreact";
import { getFromStorage } from '../../utils/storage';
import { Animated } from "react-animated-css";
import Snackpop from "../Auth/Snackpop";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import CircularProgress from '@material-ui/core/CircularProgress';

const backend_URI = require('../Auth/Backend_URI')

class meterBlock {
    constructor(pumpId, fuelType, yesterday, today, sale, debit, gross, productId) {
        this.pumpId = pumpId;
        this.fuelType = fuelType;
        this.yesterday = yesterday;
        this.today = today;
        this.sale = sale
        this.debit = debit
        this.gross = gross
        this.productId = productId
    }
}
class totDebit {
    constructor(pumpId, debit) {
        this.pumpId = pumpId;
        this.debit = debit;
    }
}
class finalBlock {
    constructor(productId, pumpId, fuelType, yesterday, today, sale, debit, gross, amount) {
        this.productId = productId;
        this.pumpId = pumpId;
        this.fuelType = fuelType;
        this.yesterday = yesterday;
        this.today = today;
        this.sale = sale
        this.debit = debit
        this.gross = gross
        this.amount = amount
    }
}
export default class dailyPumperCalculations extends Component {

    constructor(props) {
        super(props);

        this.state = {
            authState: '',
            pumpSetData: [],    //load pumps sets names

            snackbaropen: false,
            snackbarmsg: '',
            snackbarcolor: '',

            startDate: new Date(),
            pumperId: '',
            pumpSet: '',
            pumpsNames: [], //get fuelTypes
            yesReading: [], //load yesterday merter reading
            todayReading: [],   //load today merter reading
            debits: [], //load all debits
            distinctDebit: [],  //get distice debist to store spesific pumps
            pumperCash: [], //get pumpers cash givens
            pumpNames: [],  //get pumps detaile to get pumps IDs
            products: [], //get Fuels data
            meterBlock: [], //load final _data
            finalBlock: [],
            pumperIds: [], //load pumper ids

            twostrokeQty: 0.00.toFixed(2),
            twostrokeUnit: 0.00.toFixed(2),
            engineUnit: '',
            engineQty: '',
            otherSales: '',
            totalOtherSales: 0.00.toFixed(2),

            fuelSaleAmount: 0.00.toFixed(2),
            totalSaleAmount: 0.00.toFixed(2),
            totalReceivedAmount: 0.00.toFixed(2),
            totalProfit: 0.00.toFixed(2),

            dataDiv: false,
            progressDiv: false,
        }
        this.onChangePumpSet = this.onChangePumpSet.bind(this)
        this.onChangeDate = this.onChangeDate.bind(this)
        this.onChangepumperID = this.onChangepumperID.bind(this)
        this.getData = this.getData.bind(this)
        this.onChangeOil = this.onChangeOil.bind(this)
        this.calculate = this.calculate.bind(this)
        this.submitNow = this.submitNow.bind(this)

    }

    closeAlert = () => {
        this.setState({ snackbaropen: false });
    };

    onChangeDate = date => {
        this.setState(prevState => ({
            startDate: date
        }))
    }
    onChangeOil(e) {
        e.persist = () => { };
        let store = this.state;
        store[e.target.name] = e.target.value
        this.setState(store);
    }
    onChangepumperID(e) {
        this.setState({
            pumperId: e.target.value
        })
    }
    onChangePumpSet(e) {
        this.setState({
            pumpSet: e.target.value
        })
    }

    //?get data from database 
    async getData() {

        this.setState({
            finalBlock: [],
        })
        if (this.state.pumperId === '') {
            this.setState({
                snackbaropen: true,
                snackbarmsg: "Please Fill the Pumper ID ..!",
                snackbarcolor: 'error'
            })
        }
        else {
            this.state.progressDiv = true
            this.state.yesReading = [];  // empty the meter block Array
            this.state.todayReading = [];  // empty the meter block Array
            this.state.debits = [];  // empty the meter block Array
            this.state.meterBlock = [];  // empty the meter block Array
            this.state.distinctDebit = [];

            //get Pumps Names
            await axios.get(backend_URI.url + '/pumpsRegistration/getSet/' + this.state.pumpSet)
                .then(res => {
                    this.setState({
                        pumpsNames: res.data.data
                    })
                })

            //get yesterday meter reading
            await axios.get(backend_URI.url + '/machinesData/getYes/' + this.state.startDate)
                .then(res => {
                    this.setState({
                        yesReading: res.data.data
                    })
                })
            //get today meter reading
            await axios.get(backend_URI.url + '/machinesData/getToday/' + this.state.startDate)
                .then(res => {
                    this.setState({
                        todayReading: res.data.data
                    })
                })
            //get debiters data
            await axios.get(backend_URI.url + '/debitorsAccount/get/' + this.state.startDate)
                .then(res => {
                    this.setState({
                        debits: res.data.data
                    })
                    for (var m = 0; m < this.state.pumpNames.length; m++) {
                        var debitTotal = 0;
                        for (let n = 0; n < this.state.debits.length; n++) {
                            if (this.state.pumpNames[m].machineNumber === this.state.debits[n].pumpId) {
                                debitTotal = debitTotal + parseFloat(this.state.debits[n].qty)
                            }
                        }
                        var debitBlock = new totDebit(this.state.pumpNames[m].machineNumber, debitTotal)
                        this.state.distinctDebit.push(debitBlock);
                    }
                })

            for (var i = 0; i < this.state.pumpsNames.length; i++) {
                for (var j = 0; j < this.state.yesReading.length; j++) {
                    for (var k = 0; k < this.state.todayReading.length; k++) {
                        for (var l = 0; l < this.state.distinctDebit.length; l++) {
                            if (this.state.pumpsNames[i].machineNumber === this.state.yesReading[j].machineNumber && this.state.pumpsNames[i].machineNumber === this.state.todayReading[k].machineNumber
                                && this.state.pumpsNames[i].machineNumber === this.state.distinctDebit[l].pumpId) {
                                var sale = (this.state.todayReading[k].meterReading - this.state.yesReading[j].meterReading).toFixed(3)     //get pump whole sale
                                var gross = (sale - this.state.distinctDebit[l].debit).toFixed(3)    //get gross size spesific pump
                                var block = new meterBlock(this.state.pumpsNames[i].machineNumber, this.state.pumpsNames[i].fuelType, this.state.yesReading[j].meterReading, this.state.todayReading[k].meterReading, sale, this.state.distinctDebit[l].debit, gross, this.state.pumpsNames[i].productId);
                                this.state.meterBlock.push(block)

                            }
                        }
                    }
                }
            }

            for (var m = 0; m < this.state.meterBlock.length; m++) {
                for (var n = 0; n < this.state.products.length; n++) {
                    if (this.state.meterBlock[m].productId === this.state.products[n].pId) {
                        // console.log(this.state.meterBlock[m].productId +','+ this.state.meterBlock[m].fuelType)
                        var amount = (this.state.meterBlock[m].gross * this.state.products[n].sellPrice).toFixed(2)
                        var block2 = new finalBlock(this.state.meterBlock[m].productId, this.state.meterBlock[m].pumpId, this.state.meterBlock[m].fuelType, this.state.meterBlock[m].yesterday, this.state.meterBlock[m].today, this.state.meterBlock[m].sale, this.state.meterBlock[m].debit, this.state.meterBlock[m].gross, amount)
                        this.state.finalBlock.push(block2);
                        // console.log(block2);
                    }
                }
            }


            this.setState({ dataDiv: true, progressDiv: false });
        }
    }

    componentDidMount = async () => {
        const authState = await verifyAuth();
        this.setState({ authState: authState })
        if (!authState) this.props.history.push('/login');

        //get pump sets
        await axios.get(backend_URI.url + '/pumpSetRegistration/get')
            .then(res => {
                this.setState({
                    pumpSetData: res.data.data
                });
            })
            .catch(err => {
                console.log(err);
            })

        //get pumps details
        await axios.get(backend_URI.url + '/pumpsRegistration/get')
            .then(res => {
                this.setState({
                    pumpNames: res.data.data
                })
            })

        //get fuel pridse and data
        await axios.get(backend_URI.url + '/fuelLubricantPrice/getFuelPrice')
            .then(res => {
                this.setState({
                    products: res.data.data
                })
            })

        //? get active pupmers ids
        await axios.get(backend_URI.url + '/users/getPumpers')
            .then(res => {
                this.setState({
                    pumperIds: res.data.data
                })
            })

    }

    //?calculate pumper today data
    async calculate() {
        var twoStrkSale = 0.00
        var engineSale = 0.00
        var totOther = 0.00
        var totalAmount = 0.00
        var totSaleAmt = 0.00
        twoStrkSale = this.state.twostrokeUnit * this.state.twostrokeQty;
        engineSale = this.state.engineUnit * this.state.engineQty;

        totOther = (twoStrkSale + engineSale + parseFloat(this.state.otherSales)).toFixed(2)

        if (totOther === 0 || totOther === '') {
            this.setState({
                totalOtherSales: 0.00,
            })
        }
        else {
            this.setState({
                totalOtherSales: totOther,
            })
        }
        for (var i = 0; i < this.state.finalBlock.length; i++) {
            totalAmount += parseFloat(this.state.finalBlock[i].amount);
        }

        totSaleAmt = parseFloat(totalAmount) + parseFloat(totOther);

        this.setState({
            fuelSaleAmount: totalAmount,
        })
        this.setState({
            totalOtherSales: totOther,
        })
        this.setState({
            totalSaleAmount: totSaleAmt,
        })

        const data = {
            date: this.state.startDate,
            set: this.state.pumpSet
        }
        //get pumpers Cash
        await axios.post(backend_URI.url + '/pumpersCash/getByDateSet/', data)
            .then(res => {
                this.setState({
                    pumperCash: res.data.data
                })
            })

        var totCash = 0;
        for (var j = 0; j < this.state.pumperCash.length; j++) {
            totCash = totCash + parseFloat(this.state.pumperCash[j].amount)
        }
        this.setState({
            totalReceivedAmount: totCash.toFixed(2)
        })
        this.setState({
            totalProfit: (totCash - totSaleAmt).toFixed(2)
        })
    }

    // ? save pumper data intothe database
    async submitNow() {
        const obj = getFromStorage('auth-token');

        const data = {
            setNumber: this.state.pumpSet,
            date: this.state.startDate,
            pumperId: this.state.pumperId,
            twoStrokeOil: this.state.twostrokeQty,
            engineOil: this.state.engineQty,
            otherSales: this.state.totalOtherSales,
            saleAmount: this.state.totalSaleAmount,
            receivedAmount: this.state.totalReceivedAmount,
            profit: this.state.totalProfit
        }
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {

                        fetch(backend_URI.url + '/pumpersCalculations/add', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'auth-token': obj.token
                            },
                            body: JSON.stringify(data),
                        })
                            .then(res => res.json())
                            .then(json => {
                                if (json.state) {
                                    this.setState({
                                        snackbaropen: true,
                                        snackbarmsg: json.msg,
                                        snackbarcolor: 'success'
                                    })
                                    window.location.reload()
                                }
                                else {
                                    this.setState({
                                        snackbaropen: true,
                                        snackbarmsg: json.msg,
                                        snackbarcolor: 'error'
                                    })
                                }

                            })
                            .catch(err => {
                                console.log(err)
                                this.setState({
                                    snackbaropen: true,
                                    snackbarmsg: err,
                                    snackbarcolor: 'error'
                                })
                            })
                        for (var i = 0; i < this.state.finalBlock.length; i++) {
                            console.log(this.state.finalBlock[i].productId + " " + this.state.finalBlock[i].gross)
                            const stkData = {
                                pId: this.state.finalBlock[i].productId,
                                qty: this.state.finalBlock[i].gross,
                            }
                            await fetch(backend_URI.url + '/fuelLubricantPrice/salesUpdate', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'auth-token': obj.token
                                },
                                body: JSON.stringify(stkData),
                            })
                                .then(res => res.json())
                                .then(json => {
                                    if (json.state) {
                                        this.setState({
                                            snackbaropen: true,
                                            snackbarmsg: json.msg,
                                            snackbarcolor: 'success'
                                        })
                                    }
                                    else {
                                        this.setState({
                                            snackbaropen: true,
                                            snackbarmsg: json.msg,
                                            snackbarcolor: 'error'
                                        })
                                    }

                                })
                                .catch(err => {
                                    console.log(err)
                                    this.setState({
                                        snackbaropen: true,
                                        snackbarmsg: err,
                                        snackbarcolor: 'error'
                                    })
                                })
                        }
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
        const { dataDiv, progressDiv } = this.state;
        const { pumpSetData } = this.state;
        const { pumperIds } = this.state;

        //? get pumpers ids
        let pumpIdList = pumperIds.length > 0
            && pumperIds.map((item, i) => {
                return (
                    <option key={i} value={item.userId}>{item.userId}</option>
                )
            }, this);

        //?get pumpers list the select 
        let pumpSetList = pumpSetData.length > 0
            && pumpSetData.map((item, i) => {
                return (
                    <option key={i} value={item.setNumber}>{item.setNumber}</option>
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
                                            <div className="col-md-4">
                                                <select className="form-control" onChange={this.onChangePumpSet}>
                                                    <option>Select Pump Set</option>
                                                    {pumpSetList}
                                                </select>
                                            </div>
                                            <div className="col-md-4" >
                                                <select className="form-control" onChange={this.onChangepumperID}>
                                                    <option>Select Pumer Id</option>
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
                                            <div className="col-md-2" style={{ marginTop: "-7px" }}>
                                                <button className="btn btn-primary sub-btn" onClick={this.getData}>Get Data</button>
                                            </div>

                                        </div>
                                        <div className="container">
                                            <div className="row">
                                                <div className="form-group">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {progressDiv && (
                                    <div style={{ textAlign: 'center', marginTop: "20px" }}>
                                        <CircularProgress />
                                    </div>
                                )}

                                {/******************************************************************************************/}
                                {dataDiv && (
                                    <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={true} animationInDuration={1200}>

                                        <div className="container second-div">
                                            <div className="container">
                                                <div className="row">
                                                    {this.state.finalBlock.map((data) => {
                                                        return (
                                                            // yesterday, today, sale, debit, gross, credit
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
                                                                <div className="row">
                                                                    <div className="col-md-6" style={{ marginTop: "30px" }}>
                                                                        <p className="tag-text">Credit Balance : </p>
                                                                    </div>
                                                                    <div className="col-md-1" style={{ marginTop: "30px" }}>
                                                                        <p className="tag-value">-</p>
                                                                    </div>
                                                                    <div className="col-md-5">
                                                                        <hr></hr>
                                                                        <p className="tag-value">{data.amount}</p>
                                                                    </div>
                                                                </div>
                                                                <hr></hr>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </Animated>
                                )}
                                {/******************************************************************************************/}
                                {dataDiv && (
                                    <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={true} animationInDuration={1200}>

                                        <div className="container second-div">
                                            <div className="container">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="row">
                                                            <div className="col-md-3">
                                                                <p className="tag-text">2 Stroke Oil </p>
                                                            </div>
                                                            <div className="col-md-4" style={{ marginTop: "-30px" }}>
                                                                <MDBInput outline label="Unit Price (Rs.)" type="text" name="twostrokeUnit" onChange={this.onChangeOil} />
                                                            </div>
                                                            <div className="col-md-4" style={{ marginTop: "-30px" }}>
                                                                <MDBInput outline label="Quentity (Ltr)" type="text" name="twostrokeQty" onChange={this.onChangeOil} />
                                                            </div>

                                                            <div className="col-md-3">
                                                                <p className="tag-text">Engine Oil </p>
                                                            </div>
                                                            <div className="col-md-4" style={{ marginTop: "-30px" }}>
                                                                <MDBInput outline label="Unit Price (Rs.)" type="text" name="engineUnit" onChange={this.onChangeOil} />
                                                            </div>
                                                            <div className="col-md-4" style={{ marginTop: "-30px" }}>
                                                                <MDBInput outline label="Quentity (Ltr)" type="text" name="engineQty" onChange={this.onChangeOil} />
                                                            </div>
                                                            <div className="col-md-3">
                                                                <p className="tag-text">Other Sales </p>
                                                            </div>
                                                            <div className="col-md-8" style={{ marginTop: "-30px" }}>
                                                                <MDBInput outline label="Amount (Rs.)" type="text" name="otherSales" onChange={this.onChangeOil} />
                                                            </div>
                                                        </div>
                                                        <hr></hr>
                                                        <div className="row">
                                                            <div className="col-md-4">
                                                                <p className="tag-text">Total</p>
                                                            </div>

                                                            <div className="col-md-8" style={{ textAlign: "right", paddingRight: "50px" }}>
                                                                <p className="tag-value">{this.state.totalOtherSales}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <p className="tag-text">Fuel Sales Amount </p>
                                                            </div>
                                                            <div className="col-md-1">
                                                                <p className="tag-value">-</p>
                                                            </div>
                                                            <div className="col-md-5">
                                                                <p className="tag-value">{this.state.fuelSaleAmount}</p>
                                                            </div>

                                                            <div className="col-md-6" style={{ marginTop: "18px" }}>
                                                                <p className="tag-text">Total  Sales Amount </p>
                                                            </div>
                                                            <div className="col-md-1" style={{ marginTop: "18px" }}>
                                                                <p className="tag-value">-</p>
                                                            </div>
                                                            <div className="col-md-5" style={{ marginTop: "18px" }}>
                                                                <p className="tag-value">{this.state.totalSaleAmount}</p>
                                                            </div>

                                                            <div className="col-md-6" style={{ marginTop: "18px" }}>
                                                                <p className="tag-text">Total Received Amount </p>
                                                            </div>
                                                            <div className="col-md-1" style={{ marginTop: "18px" }}>
                                                                <p className="tag-value">-</p>
                                                            </div>
                                                            <div className="col-md-5" style={{ marginTop: "18px" }}>
                                                                <p className="tag-value">{this.state.totalReceivedAmount}</p>
                                                            </div>
                                                            <hr style={{ marginTop: "28px" }}></hr>
                                                            <div className="col-md-6">
                                                                <p className="tag-profit">Total Profit </p>
                                                            </div>
                                                            <div className="col-md-1">
                                                                <p className="tag-value">-</p>
                                                            </div>
                                                            <div className="col-md-5">
                                                                <p className="tag-profit-value">{this.state.totalProfit}</p>
                                                            </div>
                                                            <hr></hr>
                                                            <hr style={{ marginTop: "-25px" }}></hr>

                                                        </div>
                                                    </div>
                                                </div>


                                                <div className="row btn-div">
                                                    <div className="col-md-6">
                                                    </div>
                                                    <div className="col-md-3">
                                                        <div className="form-group">
                                                            <input type="submit" onClick={this.calculate} value="Calculate" className="btn btn-primary submit-btn"></input>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <div className="form-group">
                                                            <input type="submit" value="Submit Now" onClick={this.submitNow} className="btn btn-primary submit-btn"></input>
                                                        </div>
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

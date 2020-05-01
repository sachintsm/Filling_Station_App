import React, { Component } from 'react'
import Sidebar from '../Auth/sidebar'
import DatePicker from "react-datepicker";
import { verifyAuth } from '../../utils/authentication'
import '../../Css/Basic/dailyPumperCalculations.css'
import axios from 'axios'
import { MDBInput } from "mdbreact";
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import { getFromStorage } from '../../utils/storage';

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
        }
        this.onChangePumpSet = this.onChangePumpSet.bind(this)
        this.onChangeDate = this.onChangeDate.bind(this)
        this.onChangepumperID = this.onChangepumperID.bind(this)
        this.getData = this.getData.bind(this)
        this.onChangeOil = this.onChangeOil.bind(this)
        this.calculate = this.calculate.bind(this)
        this.submitNow = this.submitNow.bind(this)

    }

    snackbarClose = (event) => {
        this.setState({ snackbaropen: false })
    }

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

    async getData() {
        this.setState({
            finalBlock: []
        })
        if (this.state.pumperId === '') {
            this.setState({
                snackbaropen: true,
                snackbarmsg: "Please Fill the Pumper ID ..!"
            })
        }
        else {
            this.state.yesReading = [];  // empty the meter block Array
            this.state.todayReading = [];  // empty the meter block Array
            this.state.debits = [];  // empty the meter block Array
            this.state.meterBlock = [];  // empty the meter block Array
            this.state.distinctDebit = [];

            //get Pumps Names
            await axios.get('http://localhost:4000/pumpsRegistration/getSet/' + this.state.pumpSet)
                .then(res => {
                    this.setState({
                        pumpsNames: res.data.data
                    })
                })

            //get yesterday meter reading
            await axios.get('http://localhost:4000/machinesData/getYes/' + this.state.startDate)
                .then(res => {
                    this.setState({
                        yesReading: res.data.data
                    })
                })
            //get today meter reading
            await axios.get('http://localhost:4000/machinesData/getToday/' + this.state.startDate)
                .then(res => {
                    this.setState({
                        todayReading: res.data.data
                    })
                })
            //get debiters data
            await axios.get('http://localhost:4000/debitorsAccount/get/' + this.state.startDate)
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


            this.setState({ dataDiv: true });
        }
    }

    componentDidMount = async () => {
        const authState = await verifyAuth();
        this.setState({ authState: authState })
        if (!authState) this.props.history.push('/login');

        //get pump sets
        await axios.get('http://localhost:4000/pumpSetRegistration/get')
            .then(res => {
                this.setState({
                    pumpSetData: res.data.data
                });
            })
            .catch(err => {
                console.log(err);
            })

        //get pumps details
        await axios.get('http://localhost:4000/pumpsRegistration/get')
            .then(res => {
                this.setState({
                    pumpNames: res.data.data
                })
            })

        //get fuel pridse and data
        await axios.get('http://localhost:4000/fuelLubricantPrice/getFuelPrice')
            .then(res => {
                this.setState({
                    products: res.data.data
                })
            })

    }

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
        await axios.post('http://localhost:4000/pumpersCash/getByDateSet/', data)
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

        fetch('http://localhost:4000/pumpersCalculations/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': obj.token
            },
            body: JSON.stringify(data),
        })
            .then(res => res.json())
            .then(json => {
                this.setState({
                    snackbaropen: true,
                    snackbarmsg: json.msg
                })
                window.location.reload();
            })
            .catch(err => {
                console.log(err)
                this.setState({
                    snackbaropen: true,
                    snackbarmsg: err
                })
            })
        for (var i = 0; i < this.state.finalBlock.length; i++) {
            console.log(this.state.finalBlock[i].productId + " " + this.state.finalBlock[i].gross)
            const stkData = {
                pId: this.state.finalBlock[i].productId,
                qty: this.state.finalBlock[i].gross,
            }
            await fetch('http://localhost:4000/fuelLubricantPrice/salesUpdate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': obj.token
                },
                body: JSON.stringify(stkData),
            })
                .then(res => res.json())
                .then(json => {
                    console.log(json)
                    this.setState({
                        snackbaropen: true,
                        snackbarmsg: json.msg
                    })
                })
                .catch(err => {
                    console.log(err)
                    this.setState({
                        snackbaropen: true,
                        snackbarmsg: err
                    })
                })
        }

    }

    render() {
        const { dataDiv } = this.state;
        const { pumpSetData } = this.state;

        let pumpSetList = pumpSetData.length > 0
            && pumpSetData.map((item, i) => {
                return (
                    <option key={i} value={item.setNumber}>{item.setNumber}</option>
                )
            }, this);

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

                                <div className="container main-div-box" >
                                    <div className="container">

                                        <div className="row first-div">
                                            <div className="col-md-4">
                                                <select className="form-control" onChange={this.onChangePumpSet}>
                                                    <option>Select Pump Set</option>
                                                    {pumpSetList}
                                                </select>
                                            </div>
                                            <div className="col-md-4" style={{ marginTop: "-24px" }}>
                                                <MDBInput outline label="Pumper ID" type="text" name="pumperId" onChange={this.onChangepumperID} />
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
                                {/******************************************************************************************/}
                                {dataDiv && (
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
                                )}
                                {/******************************************************************************************/}
                                {dataDiv && (

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
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

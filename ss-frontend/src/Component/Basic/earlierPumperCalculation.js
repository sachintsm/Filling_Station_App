import React, { Component } from 'react'
import Sidebar from '../Auth/sidebar'
import DatePicker from "react-datepicker";
import { verifyAuth } from '../../utils/authentication'
import '../../Css/Basic/dailyPumperCalculations.css'
import axios from 'axios'
import { MDBInput } from "mdbreact";
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'

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
            startDate: new Date(),
            pumperName: '',
            dataDiv: false,

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

        this.getEarlierData = this.getEarlierData.bind(this)
        this.onChangeEarlier = this.onChangeEarlier.bind(this)
    }

    snackbarClose = (event) => {
        this.setState({ snackbaropen: false })
    }

    onChangeDate = date => {
        this.setState(prevState => ({
            startDate: date
        }))
    }

    onChangeEarlier(e) {
        this.setState({
            el_pumperId: e.target.value
        })
    }

    async getEarlierData() {

        if (this.state.el_pumperId === '') {
            this.setState({
                snackbaropen: true,
                snackbarmsg: 'Please Enter Pumper ID..!'
            })
        }
        else {

            const data = {
                el_pumperId: this.state.el_pumperId,
                el_date: this.state.startDate
            }
            this.state.debits = [];
            this.state.el_pumpNames = [];
            this.state.el_yesterday = [];
            this.state.el_today = [];
            this.state.el_yesterday = [];
            this.state.distinctDebit = [];
            this.state.el_dataArray = [];

            //get data from pumpersCalculations
            await axios.post('http://localhost:4000/pumpersCalculations/get', data)
                .then(res => {
                    if (res.data.state === false) {
                        this.setState({
                            snackbaropen: true,
                            snackbarmsg: res.data.msg
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
                        snackbarmsg: err
                    })
                })

            await axios.get('http://localhost:4000/users/getPumperName/' + this.state.el_pumperId)
                .then(res => {
                    if (res.data.state === false) {
                        this.setState({
                            snackbaropen: true,
                            snackbarmsg: res.data.msg
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
                        snackbarmsg: err
                    })
                })

            //get yesterday meter reading
            await axios.get('http://localhost:4000/machinesData/getYes/' + this.state.startDate)
                .then(res => {
                    this.setState({
                        el_yesterday: res.data.data
                    })
                })
            //get today meter reading
            await axios.get('http://localhost:4000/machinesData/getToday/' + this.state.startDate)
                .then(res => {
                    this.setState({
                        el_today: res.data.data
                    })
                })

            //get Pumps Names
            if (this.state.el_dataArray === undefined) {
                this.setState({
                    snackbaropen: true,
                    snackbarmsg: "Invalid Request..!"
                })
            }
            else {
                await axios.get('http://localhost:4000/pumpsRegistration/getSet/' + this.state.el_dataArray.setNumber)
                    .then(res => {
                        this.setState({
                            el_pumpsNames: res.data.data
                        })
                    })

                //get debiters data
                await axios.get('http://localhost:4000/debitorsAccount/get/' + this.state.startDate)
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
                this.setState({ dataDiv: true });
            }
        }
    }

    componentDidMount = async () => {
        const authState = await verifyAuth();
        this.setState({ authState: authState })
        if (!authState) this.props.history.push('/login');
    }

    render() {
        const { dataDiv } = this.state;

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

                                            <div className="col-md-6" style={{ marginTop: "-24px" }}>
                                                <MDBInput outline label="Pumper ID" type="text" name="el_pumperId" onChange={this.onChangeEarlier} />
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
                                {dataDiv && (
                                    <div className="container second-div" style={{ marginTop: "20px" }}>
                                        <div className="container">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <p style={{fontSize:"21px", fontWeight:"500"}}>
                                                        {this.state.el_dataArray.date} -  {this.state.el_dataArray.setNumber}
                                                    </p>
                                                </div>
                                                
                                                <div className="col-md-9">
                                                    <p style={{fontSize:"21px", fontWeight:"500"}} >
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
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

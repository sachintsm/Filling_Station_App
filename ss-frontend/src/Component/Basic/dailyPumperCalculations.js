import React, { Component } from 'react'
import Sidebar from '../Auth/sidebar'
import DatePicker from "react-datepicker";
import { verifyAuth } from '../../utils/authentication'
// import { getFromStorage } from '../../utils/storage';
import '../../Css/Basic/dailyPumperCalculations.css'
import axios from 'axios'
import { MDBInput } from "mdbreact";
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'

class meterBlock {
    constructor(pumpId, fuelType, yesterday, today,sale) {
        this.pumpId = pumpId;
        this.fuelType = fuelType;
        this.yesterday = yesterday;
        this.today = today;
        this.sale = sale
    }
}
export default class dailyPumperCalculations extends Component {

    constructor(props) {
        super(props);

        this.state = {
            authState: '',
            pumpSetData: [],
            snackbaropen: false,
            snackbarmsg: '',
            startDate: new Date(),
            pumperId: '',
            pumpSet: '',
            pumpsNames: [],
            yesReading: [],
            todayReading: [],
            meterBlock: [],
        }
        this.onChangePumpSet = this.onChangePumpSet.bind(this)
        this.onChangeDate = this.onChangeDate.bind(this)
        this.onChangepumperID = this.onChangepumperID.bind(this)
        this.getData = this.getData.bind(this)

    }
    onChangeDate = date => {
        this.setState(prevState => ({
            startDate: date
        }))
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
        if (this.state.pumperId === '') {
            this.setState({
                snackbaropen: true,
                snackbarmsg: "Please Fill the Pumper ID ..!"
            })
        }
        else {
            await axios.get('http://localhost:4000/pumpsRegistration/getSet/' + this.state.pumpSet)
                .then(res => {
                    this.setState({
                        pumpsNames: res.data.data
                    })
                })
            await axios.get('http://localhost:4000/machinesData/getYes/' + this.state.startDate)
                .then(res => {
                    this.setState({
                        yesReading: res.data.data
                    })
                })
            await axios.get('http://localhost:4000/machinesData/getToday/' + this.state.startDate)
                .then(res => {
                    this.setState({
                        todayReading: res.data.data
                    })
                })

            for (var i = 0; i < this.state.pumpsNames.length; i++) {
                for (var j = 0; j < this.state.yesReading.length; j++) {
                    for (var k = 0; k < this.state.todayReading.length; k++) {
                        if (this.state.pumpsNames[i].machineNumber === this.state.yesReading[j].machineNumber && this.state.pumpsNames[i].machineNumber === this.state.todayReading[k].machineNumber) {
                            var sale = this.state.todayReading[k].meterReading - this.state.yesReading[j].meterReading ; 
                            var block = new meterBlock(this.state.pumpsNames[i].machineNumber, this.state.pumpsNames[i].fuelType, this.state.yesReading[j].meterReading, this.state.todayReading[k].meterReading, sale)
                            this.state.meterBlock.push(block)
                        }
                    }
                }
            }
            for (var i = 0; i < this.state.meterBlock.length; i++) {
                console.log(this.state.meterBlock[i]);
            }

        }

    }
    snackbarClose = (event) => {
        this.setState({ snackbaropen: false })
    }
    componentDidMount = async () => {
        const authState = await verifyAuth();
        this.setState({ authState: authState })
        if (!authState) this.props.history.push('/login');

        //get pump sets
        axios.get('http://localhost:4000/pumpSetRegistration/get')
            .then(res => {
                this.setState({
                    pumpSetData: res.data.data
                });
            })

            .catch(err => {
                console.log(err);
            })
    }


    render() {
        const { pumpSetData } = this.state;

        let countriesList = pumpSetData.length > 0
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

                            <div className="container main-div-box" >
                                <div className="container">

                                    <div className="row first-div">
                                        <div className="col-md-4">
                                            <select className="form-control" onChange={this.onChangePumpSet}>
                                                <option>Select Pump Set</option>
                                                {countriesList}
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
                            <div className="container second-div">
                                <div className="container">

                                    <div className="row pump-meters-div">
                                        <div className="col-md-2">
                                            <p>Before</p>
                                        </div>
                                        <div className="col-md-3">
                                            <input type="text" className="form-control" ></input>
                                        </div>
                                        <div className="col-md-2">
                                            <p>After</p>
                                        </div>
                                        <div className="col-md-3">
                                            <input type="text" className="form-control" ></input>
                                        </div>
                                        <div className="col-md-2">
                                            <span>Diffrence</span>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-3">
                                            <p>Pump 1 total sale : </p>
                                        </div>
                                        <div className="col-md-3">
                                            <span>2000.000</span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-3">
                                            <p>Fuel for debit : </p>
                                        </div>
                                        <div className="col-md-3">
                                            <span>100.000</span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-3">
                                            <p>Pump 1 gross sale : </p>
                                        </div>
                                        <div className="col-md-3">
                                            <span>1900.000</span>
                                        </div>
                                    </div>
                                    <div className="pump-sales">
                                        <div className="row">
                                            <div className="col-md-4">
                                                <p>Total amount for pump 1 sale : </p>
                                            </div>
                                            <div className="col-md-4">
                                                <span>340000.00</span>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <p>Received amount from pumper : </p>
                                            </div>
                                            <div className="col-md-4">
                                                <span>340000.00</span>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <p>Total profit : </p>
                                            </div>
                                            <div className="col-md-4">
                                                <span>0.00</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row btn-div">
                                        <div className="col-md-6">
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <input type="submit" value="Calculate" className="btn btn-primary submit-btn"></input>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <input type="submit" value="Submit Now" className="btn btn-primary submit-btn"></input>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </React.Fragment>
        )
    }
}

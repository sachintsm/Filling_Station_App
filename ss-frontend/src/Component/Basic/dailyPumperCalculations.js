import React, { Component } from 'react'
import Sidebar from '../Auth/sidebar'
import DatePicker from "react-datepicker";
import { verifyAuth } from '../../utils/authentication'
import '../../Css/Basic/dailyPumperCalculations.css'
import axios from 'axios'
import { MDBInput } from "mdbreact";
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'

export default class dailyPumperCalculations extends Component {

    constructor(props) {
        super(props);

        this.state = {
            authState: '',
            pumpSetData: [],
            snackbaropen: false,
            snackbarmsg: '',

        }
        this.onChangePumpSet = this.onChangePumpSet.bind(this)
        this.onChangeDate = this.onChangeDate.bind(this)
        this.onChangepumperID = this.onChangepumperID.bind(this)

    }
    onChangeDate(e){

    }
    onChangepumperID(e){

    }
    onChangePumpSet(e){

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
    state = {
        selectedOption: null,
        startDate: new Date()
    };

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
                                        <div className="col-md-5">
                                            <select className="form-control" onChange={this.onChangePumpSet}>
                                                <option>Select Pump Set</option>
                                                {countriesList}
                                            </select>
                                        </div>
                                        <div className="col-md-5" style={{marginTop:"-24px"}}>
                                            <MDBInput outline label="Pumper ID" type="text" name="pumperId" onChange={this.onChangepumperID} />
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form-group">
                                                <DatePicker
                                                    className="form-control"
                                                    selected={this.state.startDate}
                                                    onChange={this.onChangeDate}
                                                />
                                            </div>
                                        </div>

                                    </div>
                                    <div className="container">
                                        <div className="row">
                                            <div className="form-group">
                                                <button className="btn btn-primary" style={{ width: "100%" }}>Get Data</button>
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

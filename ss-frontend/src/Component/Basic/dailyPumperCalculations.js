import React, { Component } from 'react'
import Sidebar from '../Auth/sidebar'
import DatePicker from "react-datepicker";
import { verifyAuth } from '../../utils/authentication'
import '../../Css/Basic/dailyPumperCalculations.css'
export default class dailyPumperCalculations extends Component {

    constructor(props) {
        super(props);

        this.state = {
            authState: '',
        }
    }

    componentDidMount = async () => {
        const authState = await verifyAuth();
        this.setState({ authState: authState })
        if (!authState) this.props.history.push('/login');
    }
    state = {
        selectedOption: null,
        startDate: new Date()
    };

    render() {
        return (
            <React.Fragment>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-2" style={{ backgroundColor: "#1c2431" }}>
                            <Sidebar />
                        </div>
                        <div className="col-md-10" style={{ backgroundColor: "#f5f5f5"}}>

                            <div className="container main-div-box" >
                                <div className="container">

                                    <div className="row first-div">
                                        <div className="col-md-5">
                                            <select className="form-control">
                                                <option>Select the Pump Set</option>
                                                <option>Pump set 1</option>
                                                <option>Pump set 2</option>
                                                <option>Pump set 3</option>
                                            </select>
                                        </div>
                                        <div className="col-md-5">
                                            <div className="form-group">
                                                <select className="form-control">
                                                    <option>Select the Pumper ID</option>
                                                    <option>Pumper 1</option>
                                                    <option>Pumper 2</option>
                                                    <option>Pumper 3</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form-group">
                                                <DatePicker
                                                    className="form-control"
                                                    selected={this.state.startDate}
                                                    onChange={this.onChange}
                                                />
                                            </div>
                                        </div>

                                    </div>
                                    <div className="container">
                                        <div className="row">
                                            <div className="form-group">
                                                <button className="btn btn-primary" style={{width:"100%"}}>Get Data</button>
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

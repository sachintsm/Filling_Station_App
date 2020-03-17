import React, { Component } from 'react'
import Sidebar from '../Auth/sidebar'
import DatePicker from "react-datepicker";

export default class dailyPumperCalculations extends Component {

    state = {
        selectedOption: null,
        startDate: new Date()
    };
    render() {
        return (
            <React.Fragment>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-2" style={{ backgroundColor: "#009688" }}>
                            <Sidebar />
                        </div>
                        <div className="col-md-10" style={{ backgroundColor: "#f5f5f5", height: "1000px" }}>
                            <div className="container">

                                <div className="row">
                                    <div className="col-md-4">
                                        <select class="form-control">
                                            <option>Select the Pump Set</option>
                                            <option>Pump set 1</option>
                                            <option>Pump set 2</option>
                                            <option>Pump set 3</option>
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <select class="form-control">
                                                <option>Select the Pumper ID</option>
                                                <option>Pumper 1</option>
                                                <option>Pumper 2</option>
                                                <option>Pumper 3</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <DatePicker
                                                className="form-control"
                                                selected={this.state.startDate}
                                                onChange={this.onChange}
                                            // name="birthday"
                                            />
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

import React, { Component } from 'react'
import Sidebar from '../Auth/sidebar'
import { verifyAuth } from '../../utils/authentication'
import '../../Css/Basic/dailyPumperManagement.css'
import { MDBInput } from "mdbreact";
import { Button } from 'reactstrap';
import Card from '@material-ui/core/Card';
import axios from 'axios'


export default class dailyPumperCalculations extends Component {

    constructor(props) {
        super(props);

        this.state = {
            authState: '',
            pumpSets: [],
        }
    }

    componentDidMount = async () => {
        const authState = await verifyAuth();
        this.setState({ authState: authState })
        if (!authState) this.props.history.push('/login');

        axios.get('http://localhost:4000/pumpSetRegistration/get')
            .then(res => {
                this.setState({
                    pumpSets: res.data.data
                })
                for (var i = 0; i < this.state.pumpSets.length; i++) {
                    console.log(this.state.pumpSets[i]);
                }
            })
    }

    render() {
        return (
            <React.Fragment>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-2" style={{ backgroundColor: "#1c2431" }}>
                            <Sidebar />
                        </div>
                        <div className="col-md-10" style={{ backgroundColor: "#f5f5f5" }}>
                            <div className="container">
                                <div className="reg-card">
                                    <Card>
                                        <form>
                                            <div className="container">
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <div className="row">
                                                            <div className="col-md-12 fuel-selector">
                                                                <select className="form-control" onChange={this.onChangeType}>
                                                                    <option >Pumper ID</option>
                                                                    <option value="Fuel">Fuel</option>
                                                                    <option value="Lubricant">Lubricant</option>
                                                                    <option value="Gas">Gas</option>
                                                                    <option value="Other">Other</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-7">
                                                                <MDBInput outline label="PID" type="text" name="pId" onChange={this.onChange} />
                                                            </div>
                                                            <div className="col-md-5">
                                                                <button className="btn btn-primary sub-btn" onClick={this.getData}>Submit</button>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </Card>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </React.Fragment >
        )
    }
}

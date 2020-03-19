import React, { Component } from 'react'
import '../../Css/Admin/pumpsRegistration.css'
import { MDBInput } from "mdbreact";
import { Button } from 'reactstrap';
import Card from '@material-ui/core/Card';
import Sidebar from '../Auth/sidebar'
import {verifyAuth} from '../../utils/authentication';

export default class pumpsRegistration extends Component {

    constructor(props){
        super(props);

        this.state ={
            authState : '',
        }
    }

    componentDidMount = async () =>{
        const authState = await verifyAuth();
        this.setState({authState :authState})
        if(!authState) this.props.history.push('/login');
    }

    render() {
        return (
            <React.Fragment>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-2" style={{ backgroundColor: "#009688" }}>
                            <Sidebar />
                        </div>
                        <div className="col-md-10" style={{ backgroundColor: "#f5f5f5", height: "1000px" }}>
                            <div className="main-div" >
                                <div className="container reg-card">
                                    <Card>
                                        <div className="container">

                                            <div className="row">
                                                <div className="col-md-2">
                                                    <MDBInput outline label="User ID" type="text" placeholder="userId" />
                                                </div>
                                                <div className="col-md-4 fuel-selector">
                                                    <select className="form-control">
                                                        <option>Select the fuel</option>
                                                        <option>Lanka Auto Diesel</option>
                                                        <option>Lanka Super Diesel</option>
                                                        <option>Lanka Karesine-oil</option>
                                                        <option>Petrol Octane 92</option>
                                                        <option>Petrol Octane 95</option>
                                                    </select>

                                                </div>
                                                <div className="col-md-4">
                                                    <MDBInput outline label="Merter Reading" type="text" placeholder="Merter Reading" />

                                                </div>
                                                <div className="col-md-2" style={{ marginTop: "18px" }}>
                                                    <Button className="reg-btn" color="primary">+ Add</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </div>

                                <div className="container">
                                    <Card className="list-card">
                                        <div className="container card-content">
                                            <div className="row">
                                                <div className="col-md-1">
                                                    <label >pump no </label>
                                                </div>
                                                <div className="col-md-4">
                                                    <label >Fuel Name </label>
                                                </div>
                                                <div className="col-md-3">
                                                    <label >Meter Reading </label>
                                                </div>
                                                <div className="col-md-4">
                                                    <select className="form-control">
                                                        <option>Select the Pumpe Set</option>
                                                        <option>Pump set 1</option>
                                                        <option>Pump set 2</option>
                                                        <option>Pump set 3</option>
                                                    </select>

                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

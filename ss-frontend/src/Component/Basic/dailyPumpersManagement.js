import React, { Component } from 'react'
import Sidebar from '../Auth/sidebar'
import { verifyAuth } from '../../utils/authentication'
import '../../Css/Basic/dailyPumperManagement.css'
import { MDBInput } from "mdbreact";
import { Button } from 'reactstrap';
import Card from '@material-ui/core/Card';

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
                                <div className="container reg-card">
                                    <Card>
                                        <form>
                                            <div className="container">
                                                <div className="row">
                                                    <div className="col-md-1">
                                                        <MDBInput outline label="PID" type="text" name="pId" onChange={this.onChange} />
                                                    </div>
                                                    <div className="col-md-3">
                                                        <MDBInput outline label="Product Name" type="text" name="pName" onChange={this.onChange} />
                                                    </div>
                                                    <div className="col-md-1">
                                                        <MDBInput outline label="Size" type="text" name="size" onChange={this.onChange} />
                                                    </div>
                                                    <div className="col-md-7">
                                                        <div className="row">
                                                            <div className="col-md-3">
                                                                <MDBInput outline label="Buying Price" type="text" name="buyPrice" onChange={this.onChange} />
                                                            </div>
                                                            <div className="col-md-3">
                                                                <MDBInput outline label="Selling Price" type="text" name="sellPrice" onChange={this.onChange} />
                                                            </div>
                                                            <div className="col-md-3 fuel-selector">
                                                                <select className="form-control" onChange={this.onChangeType}>
                                                                    <option >Select Type</option>
                                                                    <option value="Fuel">Fuel</option>
                                                                    <option value="Lubricant">Lubricant</option>
                                                                    <option value="Gas">Gas</option>
                                                                    <option value="Other">Other</option>
                                                                </select>
                                                            </div>
                                                            <div className="col-md-3" style={{ marginTop: "20px" }}>
                                                                <Button className="reg-btn" color="primary" onClick={this.onSubmit}>Add NOw</Button>
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

            </React.Fragment>
        )
    }
}

import React, { Component } from 'react'
import '../../Css/Admin/pumpsRegistration.css'
import { MDBInput } from "mdbreact";
import { Button } from 'reactstrap';
import Card from '@material-ui/core/Card';
import Sidebar from '../Auth/sidebar'
import { verifyAuth } from '../../utils/authentication';
import axios from 'axios'

export default class pumpsRegistration extends Component {

    constructor(props) {
        super(props);

        this.state = {
            authState: '',
            machineNumber: '',
            fuelType: '',
            meterReading: '',
            pumps: []
        }
        this.onChangeFuelType = this.onChangeFuelType.bind(this);
        this.onChangeMachineNumber = this.onChangeMachineNumber.bind(this)
        this.onChangeMeterReading = this.onChangeMeterReading.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }


    onChangeMachineNumber(e) {
        this.setState({
            machineNumber: e.target.value
        })
    }

    onChangeFuelType(e) {
        this.setState({
            fuelType: e.target.value
        })
    }

    onChangeMeterReading(e) {
        this.setState({
            meterReading: e.target.value
        })
    }

    componentDidMount = async () => {
        const authState = await verifyAuth();
        this.setState({ authState: authState })
        if (!authState) this.props.history.push('/login');

        axios.get('http://localhost:4000/pumpsRegistration/get')
            .then(res => {
                this.setState({ pumps: res.data.data })
            })
            .catch(function (err) {
                console.log(err);
            })
    }

    onSubmit() {
        const obj = localStorage.getItem('auth-token');

        const data = {
            machineNumber: this.state.machineNumber,
            fuelType: this.state.fuelType,
            meterReading: this.state.meterReading
        }

        fetch('http://localhost:4000/pumpsRegistration/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': obj.token
            },
            body: JSON.stringify(data),
        })
            .then(res => res.json())
            .then(json => {
                alert(json.msg)
                this.setState({
                    machineNumber: '',
                    fuelType: '',
                    meterReading: ''
                })
            })
            .catch(err => {
                console.log(err)
            })
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
                                        <form>
                                            <div className="container">

                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <MDBInput outline label="Machine Number" type="text" name="machineNumber" onChange={this.onChangeMachineNumber} />
                                                    </div>

                                                    <div className="col-md-3 fuel-selector">
                                                        <select className="form-control" onChange={this.onChangeFuelType}>
                                                            <option >Select the fuel</option>
                                                            <option value="Lanka Auto Diesel">Lanka Auto Diesel</option>
                                                            <option value="Lanka Super Diesel">Lanka Super Diesel</option>
                                                            <option value="Lanka Karesine-oil">Lanka Karesine-oil</option>
                                                            <option value="Petrol Octane 92">Petrol Octane 92</option>
                                                            <option value="Petrol Octane 95">Petrol Octane 95</option>
                                                        </select>

                                                    </div>
                                                    <div className="col-md-3">
                                                        <MDBInput outline label="Merter Reading" type="text" name="meterReading" onChange={this.onChangeMeterReading} />
                                                    </div>
                                                    <div className="col-md-3" style={{ marginTop: "20px" }}>
                                                        <Button className="reg-btn" color="primary" onClick={this.onSubmit}>Add Machine</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </Card>
                                </div>
                                <div className="container">
                                    <Card className="list-card">
                                    <div className="container card-content">
                                                <div className="row" style={{marginLeft:"5px", marginRight:"5px"}} >
                                                    <div className="col-md-2">
                                                        <label className="topic-pump"> Machine No.</label>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <label className="topic-pump"> Fuel Type </label>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <label className="topic-pump" > Initial Merter Reading</label>
                                                    </div>
                                                    <div className="col-md-4">
                                                    <label className="topic-pump"> Assumed Pumper</label>
                                                       
                                                    </div>
                                                </div>
                                            
                                        </div>
                                        <div className="container card-content">
                                            {this.state.pumps.map((pump) =>
                                                <div className="row div-pump" key={pump.machineNumber} style={{marginLeft:"10px", marginRight:"10px"}} >
                                                    <div className="col-md-2">
                                                        <label className="des-pump"> {pump.machineNumber}</label>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <label className="des-pump" > {pump.fuelType} </label>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <label  className="des-pump"> {pump.meterReading}</label>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <select className="form-control">
                                                            <option>Select the Pumpe Set</option>
                                                            <option>Pump set 1</option>
                                                            <option>Pump set 2</option>
                                                            <option>Pump set 3</option>
                                                        </select>
                                                    </div>
                                                    {/* <div>--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------</div> */}
                                                </div>
                                            )}
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

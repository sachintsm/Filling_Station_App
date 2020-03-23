import React, { Component } from 'react'
import '../../Css/Admin/pumpsRegistration.css'
import { MDBInput } from "mdbreact";
import { Button } from 'reactstrap';
import Card from '@material-ui/core/Card';
import Sidebar from '../Auth/sidebar'
import { verifyAuth } from '../../utils/authentication';
import { getFromStorage } from '../../utils/storage';
import axios from 'axios'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'

export default class pumpsRegistration extends Component {

    constructor(props) {
        super(props);

        this.state = {
            authState: '',
            machineNumber: '',
            fuelType: '',
            meterReading: '',
            pumps: [],
            pumpSet: '',
            snackbaropen: false,
            snackbarmsg: '',
            showMe: false
        }
        this.onChangeFuelType = this.onChangeFuelType.bind(this);
        this.onChangeMachineNumber = this.onChangeMachineNumber.bind(this)
        this.onChangeMeterReading = this.onChangeMeterReading.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.onPumpsetBlur = this.onPumpsetBlur.bind(this)
        this.onChangePumpSet = this.onChangePumpSet.bind(this)
        this.deletePump = this.deletePump.bind(this)
        this.onRefresh = this.onRefresh.bind(this)
    }
    snackbarClose = (event) => {
        this.setState({ snackbaropen: false })
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
    onChangePumpSet(e) {
        this.setState({
            pumpSet: e.target.value
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
        const obj = getFromStorage('auth-token');
        const data = {
            machineNumber: this.state.machineNumber,
            fuelType: this.state.fuelType,
            meterReading: this.state.meterReading
        }
        if (this.state.machineNumber === '') {
            this.setState({
                snackbaropen: true,
                snackbarmsg: "Please Fill the Data ..!"
            })
        }
        else {
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
                    // alert(json.msg)
                    this.setState({
                        snackbaropen: true,
                        snackbarmsg: json.msg
                    })
                    window.location.reload();
                })
                .catch(err => {
                    this.setState({
                        snackbaropen: true,
                        snackbarmsg: err
                    })
                    console.log(err)
                })
        }


    }

    async onPumpsetBlur(data) {

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("machineNumber", data.machineNumber);
        urlencoded.append("pumpSet", this.state.pumpSet);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch("http://localhost:4000/pumpsRegistration/updatePumpSet", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }

    onRefresh() {
        window.location.reload();
    }

    deletePump(data) {
        console.log(data)
        axios.delete('http://localhost:4000/pumpsRegistration/deletePump/' + data)
            .then(res => {
                console.log(res);
                this.setState({
                    snackbaropen: true,
                    snackbarmsg: res.data.message
                })
                window.location.reload();
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    snackbaropen: true,
                    snackbarmsg: err
                })
            })
    }

    render() {

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
                        <div className="col-md-10" style={{ backgroundColor: "#f8f9fd", height: "1000px" }}>
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
                                            <div className="row" style={{ marginLeft: "5px", marginRight: "5px" }} >
                                                <div className="col-md-2">
                                                    <label className="topic-pump"> Machine No.</label>
                                                </div>
                                                <div className="col-md-3">
                                                    <label className="topic-pump"> Fuel Type </label>
                                                </div>
                                                <div className="col-md-3">
                                                    <label className="topic-pump" > Initial Merter Reading</label>
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="topic-pump"> Assumed Pumper</label>
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="topic-pump"> Actions</label>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="container card-content">
                                            {this.state.pumps.map((pump) => {
                                                return (
                                                    <div className="row div-pump" key={pump.machineNumber} style={{ marginLeft: "10px", marginRight: "10px" }} >
                                                        <div className="col-md-2">
                                                            <label className="des-pump"> {pump.machineNumber}</label>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <label className="des-pump" > {pump.fuelType} </label>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <label className="des-pump"> {pump.meterReading}</label>
                                                        </div>
                                                        <div className="col-md-2">
                                                            <select className="form-control" onChange={this.onChangePumpSet} onBlur={() => this.onPumpsetBlur(pump)}>
                                                                <option value={pump.pumpSet}>{pump.pumpSet}</option>
                                                                <option value="set 1">Pump set 1</option>
                                                                <option value="set 2">Pump set 2</option>
                                                                <option value="set 3">Pump set 3</option>
                                                            </select>
                                                        </div>
                                                        <div className="col-md-2" style={{ marginTop: "-7px" }}>
                                                            <button className="btn btn-danger reg-btn" onClick={() => this.deletePump(pump._id)}>Delete</button>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            )}
                                            <div className="container">
                                                <div className="row" style={{ float: "right", marginBottom: "20px" }}>
                                                    <div className="col-md-2">

                                                        <button style={{ width: "145px" }} className="btn btn-primary" onClick={this.onRefresh}>Submit Now</button>
                                                    </div>
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

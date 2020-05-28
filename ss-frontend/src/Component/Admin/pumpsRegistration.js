import React, { Component } from 'react'
import '../../Css/Admin/pumpsRegistration.css'
import { MDBInput } from "mdbreact";
import { Button } from 'reactstrap';
import Card from '@material-ui/core/Card';
import Sidebar from '../Auth/sidebar'
import { verifyAuth } from '../../utils/authentication';
import { getFromStorage } from '../../utils/storage';
import axios from 'axios'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Snackpop from "../Auth/Snackpop";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'

const backend_URI = require('../Auth/Backend_URI')

export default class pumpsRegistration extends Component {

    constructor(props) {
        super(props);

        this.state = {
            authState: '',
            authUser: '',
            machineNumber: '',
            fuelType: '',
            productId: '',
            pumps: [],
            pumpSet: '',

            snackbaropen: false,
            snackbarmsg: '',
            snackbarcolor: '',

            showMe: false,
            setNumber: '',
            pumpSetData: [],
            selectedSet: ''
        }
        this.onChangeFuelType = this.onChangeFuelType.bind(this);
        this.onChangeMachineNumber = this.onChangeMachineNumber.bind(this)
        this.onChangeMeterReading = this.onChangeMeterReading.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.onPumpsetBlur = this.onPumpsetBlur.bind(this)
        this.onChangePumpSet = this.onChangePumpSet.bind(this)
        this.deletePump = this.deletePump.bind(this)
        this.onRefresh = this.onRefresh.bind(this)
        this.onAddPumpSet = this.onAddPumpSet.bind(this)
        this.onChangeSetNumber = this.onChangeSetNumber.bind(this)
    }
    closeAlert = () => {
        this.setState({ snackbaropen: false });
    };

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
            productId: e.target.value
        })
    }
    onChangeSetNumber(e) {
        this.setState({
            setNumber: e.target.value
        })
    }

    componentDidMount = async () => {
        const authState = await verifyAuth();
        this.setState({ authState: authState })
        if (!authState) this.props.history.push('/login');

        const user = getFromStorage('auth-user');
        if (user != null) {
            this.setState({
                authUser: user.userType
            })
        }

        axios.get(backend_URI.url + '/pumpsRegistration/get')
            .then(res => {
                this.setState({ pumps: res.data.data })
            })
            .catch(function (err) {
                console.log(err);
            })
        axios.get(backend_URI.url + '/pumpSetRegistration/get')
            .then(res => {
                this.setState({
                    pumpSetData: res.data.data
                });
            })

            .catch(err => {
                console.log(err);
            })
    }

    onAddPumpSet() {
        const obj = getFromStorage('auth-token');
        if (this.state.setNumber === '') {
            this.setState({
                snackbaropen: true,
                snackbarmsg: "Please Fill the Data ..!",
                snackbarcolor: 'error'
            })
        }
        else {
            confirmAlert({
                title: 'Confirm to submit',
                message: 'Are you sure to do this.',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: async () => {

                            const data = {
                                setNumber: this.state.setNumber,
                            }
                            fetch(backend_URI.url + '/pumpSetRegistration/add', {
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
                                        snackbarmsg: json.msg,
                                        snackbarcolor: 'success'
                                    })
                                    window.location.reload();
                                })
                                .catch(err => {
                                    this.setState({
                                        snackbaropen: true,
                                        snackbarmsg: err,
                                        snackbarcolor: 'error'
                                    })
                                })
                        }
                    },
                    {
                        label: 'No',
                        onClick: () => {

                        }
                    }
                ]
            })
        }


    }

    //? add new machine to  the system 
    onSubmit() {
        const obj = getFromStorage('auth-token');
        const data = {
            machineNumber: this.state.machineNumber,
            fuelType: this.state.fuelType,
            productId: this.state.productId
        }
        if (this.state.machineNumber === '' || this.state.fuelType === '' || this.state.productId === '') {
            this.setState({
                snackbaropen: true,
                snackbarmsg: "Please Fill the Data ..!",
                snackbarcolor: 'error'
            })
        }
        else {
            confirmAlert({
                title: 'Confirm to submit',
                message: 'Are you sure to do this.',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: async () => {
                            axios.get(backend_URI.url + '/fuelLubricantPrice/checkId/' + this.state.productId)
                                .then(res => {
                                    if (res.data.state === false) {
                                        this.setState({
                                            snackbaropen: true,
                                            snackbarmsg: res.data.msg,
                                            snackbarcolor: 'error'
                                        })
                                    }
                                    else {
                                        fetch(backend_URI.url + '/pumpsRegistration/add', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'auth-token': obj.token
                                            },
                                            body: JSON.stringify(data),
                                        })
                                            .then(res => res.json())
                                            .then(json => {
                                                if (json.state) {
                                                    this.setState({
                                                        snackbaropen: true,
                                                        snackbarmsg: json.msg,
                                                        snackbarcolor: 'success'
                                                    })
                                                    window.location.reload();
                                                }
                                                else {
                                                    this.setState({
                                                        snackbaropen: true,
                                                        snackbarmsg: json.msg,
                                                        snackbarcolor: 'error'
                                                    })
                                                }
                                            })
                                            .catch(err => {
                                                this.setState({
                                                    snackbaropen: true,
                                                    snackbarmsg: err,
                                                    snackbarcolor: 'error'
                                                })
                                            })
                                    }
                                })

                        }
                    },
                    {
                        label: 'No',
                        onClick: () => {

                        }
                    }
                ]
            })
        }


    }

    //? update the machine to the ppmers set
    async onPumpsetBlur(data) {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
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

                        fetch(backend_URI.url + "/pumpsRegistration/updatePumpSet", requestOptions)
                            .then(response => response.text())
                            .then(result => window.location.reload())
                            .catch(error => console.log('error', error));
                    }
                },
                {
                    label: 'No',
                    onClick: () => {
                        window.location.reload();
                    }
                }
            ]
        })
    }

    onRefresh() {
        window.location.reload();
    }

    //? delete machine
    deletePump(data) {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        axios.delete(backend_URI.url + '/pumpsRegistration/deletePump/' + data)
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
                },
                {
                    label: 'No',
                    onClick: () => {

                    }
                }
            ]
        })
    }

    //? delete the pupm set
    onDeleteSet(data) {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        console.log(data)
                        axios.delete(backend_URI.url + '/pumpSetRegistration/delete/' + data)
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
                },
                {
                    label: 'No',
                    onClick: () => {

                    }
                }
            ]
        })
    }

    render() {

        const { pumpSetData, authUser } = this.state;

        let countriesList = pumpSetData.length > 0
            && pumpSetData.map((item, i) => {
                return (
                    <option key={i} value={item.setNumber}>{item.setNumber}</option>
                )
            }, this);
        return (
            <React.Fragment>

                <div className="container-fluid">
                    <Snackpop
                        msg={this.state.snackbarmsg}
                        color={this.state.snackbarcolor}
                        time={3000}
                        status={this.state.snackbaropen}
                        closeAlert={this.closeAlert}
                    />



                    <div className="row">
                        <div className="col-md-2" style={{ backgroundColor: "#1c2431" }}>
                            <Sidebar />
                        </div>
                        <div className="col-md-10" style={{ backgroundColor: "#f8f9fd", minHeight: "1000px" }}>
                            <div className="container" >
                                <div className="row" style={{ marginTop: "20px" }}>
                                    {authUser === 'Administrator' && (
                                        <div className="col-md-4">
                                            <p className="tpic">Add Pump Set</p>

                                            <Card>
                                                <form>
                                                    <div className="container">

                                                        <div className="row">
                                                            <div className="col-md-7">
                                                                <MDBInput outline label="Set Number" type="text" name="setNumber" onChange={this.onChangeSetNumber} />
                                                                <p style={{ color: "gray", fontWeight: "400", marginTop: "-22px", fontSize: "12px", marginLeft: "10px" }}>
                                                                    i.e : 1 , 2 , ....
                                                            </p>
                                                            </div>
                                                            <div className="col-md-5" style={{ marginTop: "20px" }}>
                                                                <Button className="reg-btn" color="primary" onClick={this.onAddPumpSet}>+ SET</Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            </Card>
                                        </div>
                                    )}
                                    {authUser === 'Administrator' && (

                                        <div className="col-md-8">
                                            <p className="tpic">Add New Machine</p>
                                            <Card>
                                                <form>
                                                    <div className="container">

                                                        <div className="row">
                                                            <div className="col-md-3">
                                                                <MDBInput outline label="Machine Number" type="text" name="machineNumber" onChange={this.onChangeMachineNumber} />
                                                                <p style={{ color: "gray", fontWeight: "400", marginTop: "-22px", fontSize: "12px", marginLeft: "10px" }}>
                                                                    i.e : SD01
                                                            </p>
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
                                                                <MDBInput outline label="Product Id" type="text" name="productId" onChange={this.onChangeMeterReading} />
                                                            </div>
                                                            <div className="col-md-3" style={{ marginTop: "20px" }}>
                                                                <Button className="reg-btn" color="primary" onClick={this.onSubmit}>+ Machine</Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            </Card>
                                        </div>
                                    )}
                                </div>
                                <p className="tpic" style={{ marginTop: "20px", marginBottom: "-10px" }}>Pumps</p>

                                <Card className="list-card">
                                    <div className="card-content">
                                        <div className="row" style={{ marginLeft: "5px", marginRight: "5px" }} >
                                            <div className="col-md-2">
                                                <label className="topic-pump"> Machine No.</label>
                                            </div>
                                            <div className="col-md-3">
                                                <label className="topic-pump"> Fuel Type </label>
                                            </div>
                                            <div className="col-md-3">
                                                <label className="topic-pump" > Product Id</label>
                                            </div>
                                            <div className="col-md-3">
                                                <label className="topic-pump"> Assumed Pumper</label>
                                            </div>
                                            {authUser === 'Administrator' && (
                                                <div className="col-md-1" style={{ textAlign: "left" }}>
                                                    <label className="topic-pump"> Actions</label>
                                                </div>
                                            )}
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
                                                        <label className="des-pump"> {pump.productId}</label>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <select className="form-control" onChange={this.onChangePumpSet} onBlur={() => this.onPumpsetBlur(pump)}>
                                                            <option value={pump.pumpSet}>{pump.pumpSet}</option>
                                                            {countriesList}
                                                        </select>
                                                    </div>
                                                    {authUser === 'Administrator' && (
                                                        <div className="col-md-1" style={{ textAlign: "center" }}>
                                                            <DeleteForeverIcon className="del-btn" onClick={() => this.deletePump(pump._id)} />
                                                        </div>
                                                    )}
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
                                {authUser === 'Administrator' && (
                                    <div>
                                        <p className="tpic">Pump Sets</p>

                                        <Card style={{ marginBottom: "20px" }}>
                                            <form>
                                                <div className="container">

                                                    <div className="row">
                                                        {this.state.pumpSetData.map((data) => {
                                                            return (
                                                                <div className="col-md-3" style={{ marginTop: "20px" }} key={data._id}>
                                                                    <div className="row" >
                                                                        <div className="col-md-3">
                                                                            <p>{data.setNumber}</p>
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <DeleteForeverIcon className="del-btn" onClick={() => this.onDeleteSet(data._id)} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            </form>
                                        </Card>
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

import React, { Component } from 'react';
import axios from 'axios';
import { Card, Col, Row } from 'react-bootstrap';
import Sidebar from '../Auth/sidebar';
import "react-datepicker/dist/react-datepicker.css";
import '../../Css/Basic/profile.css';
import normal from '../../Assets/images/normal.png';
import { getFromStorage } from '../../utils/storage';
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'

const backend_URI = require('../Auth/Backend_URI')

export default class profile extends Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            snackbaropen: false,
            snackbarmsg: '',
            snackbarcolor: '',

            fullName: '',
            password: '',
            userId: '',
            userType: '',
            birthday: '',
            email: '',
            nic: '',
            mobileOne: '',
            mobileTwo: '',
            epf: '',
            etf: '',
            address: '',
            other: '',
            file: '',
            signup_completed: false,
            userData: [],
            users: []
        }
    }
    closeAlert = () => {
        this.setState({ snackbaropen: false });
    };
    componentDidMount() {
        const userData = getFromStorage('auth-user')
        console.log(userData.userId)

        axios.get(backend_URI.url + '/users/get/' + userData.userId)
            .then(response => {
                console.log(response);

                this.setState({
                    users: response.data.data,
                })
            })
            .catch(error => {
                console.log(error)
            })

    }

    onChange = (e) => {
        e.persist = () => { };
        let store = this.state;
        store[e.target.name] = e.target.value
        this.setState(store);
    }


    onSubmit(e) {

        const userData = getFromStorage('auth-user')

        e.preventDefault();
        const obj = {
            fullName: this.state.fullName,
            email: this.state.email,
            birthday: this.state.birthday,
            password: this.state.password,
            mobileOne: this.state.mobileOne,
            mobileTwo: this.state.mobileTwo,
            address: this.state.address,
            nic: this.state.nic,
            epf: this.state.epf,
            etf: this.state.etf,
            userId: this.state.userId,
            userType: this.state.userType,
            other: this.state.other,
            signup_completed: this.state.signup_completed
        };
        confirmAlert({
            title: 'Confirm to update?',
            message: 'Are you sure to do this?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        axios.post(backend_URI.url + '/users/updateuser/' + userData.userId, obj)
                            .then(res => {
                                this.setState({
                                    snackbaropen: true,
                                    snackbarmsg: res.data.msg,
                                    snackbarcolor: 'success'
                                })
                                window.location.reload()
                            });
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
                        <div className="col-md-10" style={{ backgroundColor: "#f8f9fd" }}>
                            <h3 style={{ textAlign: "center", marginTop: "50px" }}>My Profile</h3>
                            <div className="card">

                                <div style={{ width: "90%", margin: 'auto' }}>
                                    <div className="row">
                                        <div className="col-md-4">
                                            {this.state.users.map((data) => {
                                                return (
                                                    <Card style={{ width: '250px' }} key={data.userId}>
                                                        <div className="overflow">
                                                            <Card.Img variant="top" src={!(backend_URI.url + '/users/profileImage/' + data.path) ? normal : (backend_URI.url + '/users/profileImage/' + data.path)} />
                                                        </div>
                                                        <Card.Body>
                                                            <Card.Title><center>{data.fullName} </center></Card.Title>
                                                            <Card.Text>
                                                                Contact Number 1: {data.mobileOne}<br />
                                                                Contact Number 2: {data.mobileTwo}<br />

                                                            </Card.Text>
                                                            <br />

                                                        </Card.Body>
                                                    </Card>
                                                )
                                            })}
                                        </div>

                                        <div className="col-md-8">
                                            {this.state.users.map((data) => {
                                                return (
                                                    <form onSubmit={this.onSubmit} key={data.userId}>
                                                        <div className="row" >
                                                            <div className="col-md-4">
                                                                <div className="form-group" style={{ marginTop: "50px" }}>
                                                                    <label>User ID : </label>
                                                                    <input readOnly type="text" className="form-control" name="userId" defaultValue={data.userId} onChange={this.onChange} />
                                                                </div>
                                                            </div>


                                                            <div className="col-md-4">
                                                                <div className="form-group" style={{ marginTop: "50px" }}>
                                                                    <label>User Type : </label>
                                                                    <input type="text" className="form-control" name="userType" defaultValue={data.userType} onChange={this.onChange}></input>
                                                                </div>
                                                            </div>


                                                            <div className="col-md-4">
                                                                <div className="form-group" style={{ marginTop: "50px" }}>
                                                                    <label>Birthday : </label>
                                                                    <input type="date" className="form-control" name="userType" defaultValue={data.birthday} onChange={this.onChange}></input>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <label>E-mail : </label>
                                                                    <input type="text" className="form-control" name="email" defaultValue={data.email} onChange={this.onChange}></input>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <label>NIC Number : </label>
                                                                    <input type="text" className="form-control" name="nic" defaultValue={data.nic} onChange={this.onChange}></input>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <Row>
                                                            <Col>
                                                                <div className="form-group">
                                                                    <label>EPF Number : </label>
                                                                    <input type="text" className="form-control" name="epf" defaultValue={data.epf} onChange={this.onChange}></input>
                                                                </div>
                                                            </Col>
                                                            <Col>
                                                                <div className="form-group">
                                                                    <label>ETF Number : </label>
                                                                    <input type="text" className="form-control" name="etf" defaultValue={data.etf} onChange={this.onChange}></input>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                        <div className="form-group">
                                                            <label>Address : </label>
                                                            <textarea type="text" className="form-control" name="address" defaultValue={data.address} onChange={this.onChange}></textarea>
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Others : </label>
                                                            <textarea type="text" className="form-control" name="other" defaultValue={data.other} onChange={this.onChange}></textarea>
                                                        </div>

                                                        <div className="form-group">
                                                            <button className="btn btn-info my-4 btn-block " type="submit">UPDATE</button>
                                                        </div>

                                                    </form>
                                                )
                                            })}
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


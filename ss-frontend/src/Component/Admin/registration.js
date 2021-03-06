import React, { Component } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Row, Col } from 'reactstrap';
import '../../Css/Admin/registration.css';
import axios from 'axios';
import Sidebar from '../Auth/sidebar';
import { verifyAuth } from '../../utils/authentication';
import Snackpop from "../Auth/Snackpop";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'
import { getFromStorage } from '../../utils/storage';

const backend_URI = require('../Auth/Backend_URI')

export default class registration extends Component {

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleChangeBirthday = this.handleChangeBirthday.bind(this);
        this.handleDropdownChange = this.handleDropdownChange.bind(this);

        this.state = {
            form: {
                fullName: '',
                password: '',
                userId: '',
                userType: 'Administrator',
                birthday: new Date(),
                email: '',
                nic: '',
                mobileOne: '',
                mobileTwo: '',
                epf: '',
                etf: '',
                address: '',
                other: '',
                file: null,

                snackbaropen: false,
                snackbarmsg: '',
                snackbarcolor: '',
            },

        }
    }

    closeAlert = () => {
        this.setState({ snackbaropen: false });
    };


    onSubmit(e) {
        e.preventDefault();

        if (this.state.form.file === null) {
            this.setState({
                snackbaropen: true,
                snackbarcolor: 'error',
                snackbarmsg: 'Please Select the profile picture..!'
            })

        } else {
            confirmAlert({
                title: 'Confirm to submit',
                message: 'Are you sure to do this.',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: async () => {
                            const formData = new FormData();
                            formData.append("profileImage", this.state.form.file);
                            formData.append('fullName', this.state.form.fullName);
                            formData.append('password', this.state.form.password);
                            formData.append('userId', this.state.form.userId);
                            formData.append('email', this.state.form.email);
                            formData.append('userType', this.state.form.userType);
                            formData.append('birthday', this.state.form.birthday);
                            formData.append('nic', this.state.form.nic);
                            formData.append('mobileOne', this.state.form.mobileOne);
                            formData.append('mobileTwo', this.state.form.mobileTwo);
                            formData.append('epf', this.state.form.epf);
                            formData.append('etf', this.state.form.etf);
                            formData.append('address', this.state.form.address);
                            formData.append('other', this.state.form.other);

                            axios.post(backend_URI.url + "/users/register", formData, { // receive two parameter endpoint url ,form data 
                            })
                                .then(res => { // then print response status
                                    console.log(res.data)
                                    if (res.data.state === false) {
                                        this.setState({
                                            snackbaropen: true,
                                            snackbarcolor: 'error',
                                            snackbarmsg: res.data.msg
                                        })
                                    }
                                    else {
                                        this.setState({
                                            snackbaropen: true,
                                            snackbarcolor: 'success',
                                            snackbarmsg: res.data.msg
                                        })
                                    }
                                })
                                .catch(err => {
                                    this.setState({
                                        snackbaropen: true,
                                        snackbarcolor: 'error',
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
    }

    async componentDidMount() {
        const authState = await verifyAuth()
        const user = getFromStorage('auth-user');

        this.setState({
            authState: authState
        })

        if (!authState || user.userType !== 'Administrator') {
            this.props.history.push('/login')
            alert('Please sign in as Administrator !')
        }
    }

    handleChangeBirthday = date => {
        const Val = date
        this.setState(prevState => ({
            form: {
                ...prevState.form,
                birthday: Val
            }
        }))
    };


    handleDropdownChange = (e) => {
        const Val = e.target.value
        this.setState(prevState => ({
            form: {
                ...prevState.form,
                userType: Val
            }
        }))
    }

    handleImageChange = (e) => {
        const Val = e.target.files[0]
        this.setState(prevState => ({
            form: {
                ...prevState.form,
                file: Val
            }
        }))
    }

    onChange = (e) => {
        e.persist = () => { };
        let store = this.state;
        store.form[e.target.name] = e.target.value
        this.setState(store);
    }

    render() {
        const { form } = this.state;

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
                        <div className="col-md-10" style={{ backgroundColor: "#f8f9fd" }}>
                            <h3 style={{ textAlign: "center", marginTop: "50px" }}>User Registration</h3>
                            <div className="card">
                                <div style={{ width: "90%", margin: 'auto' }}>
                                    <form onSubmit={this.onSubmit}>
                                        <div className="form-group" style={{ marginTop: "50px" }}>
                                            <label>Full Name : </label>
                                            <input name="fullName" type="text" className="form-control" value={form.fullName} onChange={this.onChange}></input>
                                        </div>
                                        <div className="form-group">
                                            <label>Password : </label>
                                            <input type="text" className="form-control" name="password" value={form.password} onChange={this.onChange}></input>
                                        </div>

                                        <Row>
                                            <Col>
                                                <div className="form-group">
                                                    <label>User ID : </label>
                                                    <input type="text" className="form-control" name="userId" value={form.userId} onChange={this.onChange}></input>
                                                </div>
                                            </Col>

                                            <Col>
                                                <label>User Type : </label>
                                                <div className="form-group">
                                                    <select className="form-control" id="dropdown" value={form.userType} onChange={this.handleDropdownChange}>
                                                        <option value="Administrator">Administrator</option>
                                                        <option value="Manager">Manager</option>
                                                        <option value="Pumper">Pumper</option>

                                                    </select>
                                                </div>
                                            </Col>

                                            <Col>
                                                <label>Birthday : </label>
                                                <div className="form-group">
                                                    <DatePicker
                                                        className="form-control"
                                                        selected={form.birthday}
                                                        onChange={this.handleChangeBirthday}
                                                    />
                                                </div>

                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <div className="form-group">
                                                    <label>E-mail : </label>
                                                    <input type="text" className="form-control" name="email" value={form.email} onChange={this.onChange}></input>
                                                </div>
                                            </Col>
                                            <Col>
                                                <div className="form-group">
                                                    <label>NIC Number : </label>
                                                    <input type="text" className="form-control" name="nic" value={form.nic} onChange={this.onChange}></input>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <div className="form-group">
                                                    <label>Mobile Number 1 : </label>
                                                    <input type="text" className="form-control" name="mobileOne" value={form.mobileOne} onChange={this.onChange}></input>
                                                </div>
                                            </Col>
                                            <Col>
                                                <div className="form-group">
                                                    <label>Mobile Number 2 : </label>
                                                    <input type="text" className="form-control" name="mobileTwo" value={form.mobileTwo} onChange={this.onChange}></input>
                                                </div>
                                            </Col>

                                        </Row>
                                        <Row>
                                            <Col>
                                                <div className="form-group">
                                                    <label>EPF Number : </label>
                                                    <input type="text" className="form-control" name="epf" value={form.epf} onChange={this.onChange}></input>
                                                </div>
                                            </Col>
                                            <Col>
                                                <div className="form-group">
                                                    <label>ETF Number : </label>
                                                    <input type="text" className="form-control" name="etf" value={form.etf} onChange={this.onChange}></input>
                                                </div>
                                            </Col>
                                        </Row>
                                        <div className="form-group">
                                            <label>Address : </label>
                                            <textarea type="text" className="form-control" name="address" value={form.address} onChange={this.onChange}></textarea>
                                        </div>
                                        <div className="form-group">
                                            <label>Others : </label>
                                            <textarea type="text" className="form-control" name="other" value={form.other} onChange={this.onChange}></textarea>
                                        </div>
                                        <div className="form-group">
                                            <label>Upload Your Profile Image : </label>
                                            <input type="file" name="myImage" onChange={this.handleImageChange} />
                                        </div>
                                        <div className="form-group">
                                            <button className="btn btn-info my-4 btn-block " type="submit">Register Now</button>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )

    }
}


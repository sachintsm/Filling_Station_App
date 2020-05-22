import React, { Component } from 'react';
import axios from 'axios';
import { Col, Row } from 'react-bootstrap';
import Sidebar from '../Auth/sidebar';
import "react-datepicker/dist/react-datepicker.css";
import '../../Css/Basic/cusprofile.css';
import Card from '@material-ui/core/Card';
import Snackpop from "../Auth/Snackpop";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { verifyAuth } from '../../utils/authentication'

const backend_URI = require('../Auth/Backend_URI')

export default class profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            snackbaropen: false,
            snackbarmsg: '',
            snackbarcolor: '',

            fullName: '',
            debtorId: '',
            damount: '',
            nic: '',
            birthday: '',
            mobile: '',
            fax: '',
            address: '',
            other: '',
            userData: [],
            users: [],

            Datadiv: false,
        }
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.deleteDebtor = this.deleteDebtor.bind(this);
        this.showAddCustomer = this.showAddCustomer.bind(this);
    }

    closeAlert = () => {
        this.setState({ snackbaropen: false });
    };
    

    handleSearch = e => {
        this.setState({ debtorId: e.target.value });
    };
    showAddCustomer() {
        this.setState({
            Datadiv: true,
        })
    }
    onChange = (e) => {
        e.persist = () => { };
        let store = this.state;
        store[e.target.name] = e.target.value
        this.setState(store);
    }
    async componentDidMount() {
        const authState = await verifyAuth();
        this.setState({ authState: authState })
        if (!authState) this.props.history.push('/login');

        axios.get(backend_URI.url + '/debtors/get')
            .then(response => {
                this.setState({ users: response.data.data });
            })
    }

    customerData(data){
        this.props.history.push('/cusprofile/'+data);
        
    }

    deleteDebtor(data) {
        console.log(data)
        confirmAlert({
            title: 'Confirm to delete?',
            message: 'Are you sure to do this?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        axios.delete(backend_URI.url + '/debtors/deleteDebtor/' + data)
                            .then(res => {
                                this.setState({
                                    snackbaropen: true,
                                    snackbarmsg: res.data.message,
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

    onSubmit(e) {
        e.preventDefault();
        if (this.state.fullName === '' || this.state.debtorId === '' || this.state.mobile === '') {
            this.setState({
                snackbaropen: true,
                snackbarmsg: 'Please fill the missing fields..!',
                snackbarcolor: 'error'
            })
        }
        else {

            const obj = {
                fullName: this.state.fullName,
                debtorId: this.state.debtorId,
                damount: this.state.damount,
                nic: this.state.nic,
                mobile: this.state.mobile,
                fax: this.state.fax,
                other: this.state.other,
            };
            confirmAlert({
                title: 'Confirm to submit',
                message: 'Are you sure to do this.',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: async () => {

                            axios.post(backend_URI.url + '/debtors/register', obj)
                                .then(res => {
                                    console.log(res)
                                    if (res.data.state) {
                                        this.setState({
                                            snackbaropen: true,
                                            snackbarmsg: res.data.msg,
                                            snackbarcolor: 'success'
                                        })
                                        window.location.reload()
                                    }
                                    else {
                                        this.setState({
                                            snackbaropen: true,
                                            snackbarmsg: res.data.msg,
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

    render() {
        const { Datadiv } = this.state;
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
                            <div className="container">
                                <div className="row" style={{ marginTop: '50px' }}>
                                    <div className="col-md-9">
                                        <p className="cp_head">Customers Data</p>
                                    </div>
                                    <div className="col-md-3" style={{ marginTop: '-20px' }}>
                                        <button className="btn btn-info my-4 btn-block " type="submit" onClick={this.showAddCustomer}> ADD A NEW DEBTOR</button>
                                    </div>
                                </div>

                                {Datadiv && (
                                    <Card style={{ marginBottom: "20px" }}>
                                        <div style={{ width: "90%", margin: 'auto' }}>
                                            <div className="row">
                                                <div style={{ width: "90%", margin: 'auto' }}>
                                                    <form onSubmit={this.onSubmit} >
                                                        <div className="form-group" style={{ marginTop: "50px" }}>
                                                            <label>Name / Company Name : </label>
                                                            <input type="text" className="form-control" name="fullName" defaultValue={this.state.fullName} onChange={this.onChange}></input>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <label>Debtor ID : </label>
                                                                    <input type="text" className="form-control" name="debtorId" defaultValue={this.state.debtorId} onChange={this.onChange}></input>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <label>Deposited Amount : </label>
                                                                    <input type="text" className="form-control" name="damount" defaultValue={this.state.damount} onChange={this.onChange}></input>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Row>
                                                            <Col>
                                                                <div className="form-group">
                                                                    <label>Mobile Number : </label>
                                                                    <input type="text" className="form-control" name="mobile" defaultValue={this.state.mobile} onChange={this.onChange}></input>
                                                                </div>
                                                            </Col>
                                                            <Col>
                                                                <div className="form-group">
                                                                    <label>Fax Mumber : </label>
                                                                    <input type="text" className="form-control" name="fax" defaultValue={this.state.fax} onChange={this.onChange}></input>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                        <div className="form-group">
                                                            <label>Address : </label>
                                                            <textarea type="text" className="form-control" name="address" defaultValue={this.state.address} onChange={this.onChange}></textarea>
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Others : </label>
                                                            <textarea type="text" className="form-control" name="other" defaultValue={this.state.other} onChange={this.onChange}></textarea>
                                                        </div>

                                                        <div className="form-group">
                                                            <button className="btn btn-info my-4 btn-block " type="submit">ADD</button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                )}

                                <Card style={{ marginBottom: "20px" }}>
                                    <div>
                                        <h3 className="sp_head">List of Debtors</h3>
                                        <form>
                                            <div className="form-group" style={{ marginTop: "50px", marginLeft: "40px", marginRight: "40px" }} >
                                                <input className="form-control" type="debtorId" name="debtorId" id="debtorId" placeholder="Search ID here" onChange={this.handleSearch} />
                                            </div>
                                        </form>
                                        <div className="sp_table">
                                            <table className="table" style={{ marginTop: 20 }} >
                                                <thead>
                                                    <tr>
                                                        <th className="table-cp-head">Name / Compamy Name</th>
                                                        <th className="table-cp-head">Debtor ID</th>
                                                        <th className="table-cp-head">Amount</th>
                                                        <th className="table-cp-head">Mobile Number</th>
                                                        <th className="table-cp-head">Fax Number</th>
                                                        <th className="table-cp-head">Action</th>

                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.users.map((data) => {
                                                        return (

                                                            <tr key={data._id} className="table-row-cp" onClick={() => this.customerData(data.debtorId)}>
                                                                <th>{data.fullName}</th>
                                                                <th>{data.debtorId}</th>
                                                                <th>{data.damount}</th>
                                                                <th>{data.mobile}</th>
                                                                <th>{data.fax}</th>
                                                                <th><DeleteForeverIcon className="delete-btn-cp" onClick={() => this.deleteDebtor(data._id)} /></th>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </Card>

                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}



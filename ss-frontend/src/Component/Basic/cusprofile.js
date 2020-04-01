import React, { Component } from 'react';
import axios from 'axios';
import {  Col, Row } from 'react-bootstrap';
import Sidebar from '../Auth/sidebar';
import "react-datepicker/dist/react-datepicker.css";
import '../../Css/Basic/cusprofile.css';
// import { getFromStorage } from '../../utils/storage';
// import Snackbar from '@material-ui/core/Snackbar';

import Snackbar from '@material-ui/core/Snackbar';

import IconButton from '@material-ui/core/IconButton';


{/* <Debt delete={this.deleteDebtor} debt={currentDebt} key={i} />; */}
const Debt = React.memo(props => (



    <tr>
        <td>{props.debt.fullName}</td>
        <td>{props.debt.debtorId}</td>
        <td>{props.debt.damount}</td>
        <td>{props.debt.mobile}</td>
        <td>{props.debt.fax}</td>
        <td>
            <button className="btn btn-danger btn-info  " type="delete" onClick={() => props.delete(props.debt._id)}>DELETE</button>

        </td>
    </tr>
));



export default class profile extends Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.deleteDebtor = this.deleteDebtor.bind(props);



        this.state = {
            snackbaropen: false,
            snackbarmsg: '',
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
            users: []
        }
    }
    snackbarClose = (event) => {
        this.setState({ snackbaropen: false })
    }
    componentDidMount() {
        axios.get('http://localhost:4000/debtors/get')
            .then(response => {
                this.setState({ users: response.data.data });
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    handleSearch = e => {
        this.setState({ debtorId: e.target.value });

    };

    onChange = (e) => {
        e.persist = () => { };
        let store = this.state;
        store[e.target.name] = e.target.value
        this.setState(store);
    }



    UserList() {
        const local = this.state.debtorId;
        if (local == null || local === "") {

            // console.log(this.state.users);
            return this.state.users.map( (currentDebt, i)=> {

                return <Debt delete={this.deleteDebtor} debt={currentDebt} key={i} />;
            }
            )
        }
        else {
            return this.state.users.map( (currentDebt, i)=> {
                if (currentDebt.debtorId === local) {
                    return <Debt delete={this.deleteDebtor} debt={currentDebt} key={i} />;
                }
                return null;
            })
        }


    }

    deleteDebtor(data) {
        axios.delete('http://localhost:4000/debtors/deleteDebtor/' + data)
            .then(res => {
                console.log(res);
                this.setState({
                    // users: this.state.users.filter(u => u._id !== data),
                    snackbaropen: true,
                    snackbarmsg: res.data.message
                })
                window.location.reload();
            })
            .catch(err => {
                console.log(err);
                // this.setState({
                //     snackbaropen: true,
                //     snackbarmsg: err
                // })
            })

    }



    onSubmit(e) {



        e.preventDefault();
        const obj = {
            fullName: this.state.fullName,
            debtorId: this.state.debtorId,
            damount: this.state.damount,
            nic: this.state.nic,
            mobile: this.state.mobile,
            fax: this.state.fax,
            other: this.state.other,
        };

        axios.post('http://localhost:4000/debtors/register', obj)
            .then(res => console.log(res.data));

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
                            <h3 style={{ textAlign: "center", marginTop: "50px" }}>DEBTORS</h3>

                            <div>





                                <div >
                                    <div className="form-group" style={{ marginTop: "50px", marginRight: "175px", marginLeft: "60px" }}>
                                        <button className="btn btn-info my-4 btn-block " type="submit">ADD A NEW DEBTOR</button>
                                    </div>
                                </div>



                            </div>
                            <div className="card">

                                <div>
                                    <h3 className="sp_head">List of Debtors</h3>
                                    <form>
                                        <div className="form-group" style={{ marginTop: "50px", marginLeft: "40px", marginRight: "40px" }} >
                                            <input className="form-control" type="debtorId" name="debtorId" id="debtorId" placeholder="Search ID here" onChange={this.handleSearch} />
                                        </div>
                                    </form>
                                    <div className="sp_table">

                                        <table className="table table-striped" style={{ marginTop: 20 }} >
                                            <thead>
                                                <tr>
                                                    <th>Name / Compamy Name</th>
                                                    <th>Debtor ID</th>
                                                    <th>Amount</th>
                                                    <th>Mobile Number</th>
                                                    <th>Fax Number</th>


                                                </tr>
                                            </thead>
                                            <tbody>

                                                {this.UserList()}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                            </div>
                            <div className="card">

                                <div style={{ width: "90%", margin: 'auto' }}>
                                    <div className="row">

                                        <div className="card">
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

                                        {/* )
                                        })} */}
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



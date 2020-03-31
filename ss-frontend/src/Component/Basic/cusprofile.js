import React, { Component } from 'react';
import axios from 'axios';
import { Card, Col, Row } from 'react-bootstrap';
import Sidebar from '../Auth/sidebar';
import "react-datepicker/dist/react-datepicker.css";
import '../../Css/Basic/cusprofile.css';
// import DatePicker from "react-datepicker";
import normal from '../../Assets/images/normal.png';
import { getFromStorage } from '../../utils/storage';
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'


// import AddImage from "../../Components/AddServiceImage.component";
// import Delete from "../../Components/Delete.component";

export default class profile extends Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

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
            // signup_completed: false,
            userData: [],
            users: []
        }
    }
    snackbarClose = (event) => {
        this.setState({ snackbaropen: false })
    }
    // componentDidMount() {
    //     const userData = getFromStorage('auth-user')
    //     console.log(userData.userId)

    //     axios.get('http://localhost:4000/debtors/get' + userData.userId)
    //         .then(response => {
    //             console.log(response);

    //             this.setState({
    //                 users: response.data.data,
    //             })
    //         })
    //         .catch(error => {
    //             console.log(error)
    //         })

    // }

    onChange = (e) => {
        e.persist = () => { };
        let store = this.state;
        store[e.target.name] = e.target.value
        this.setState(store);
    }


    onSubmit(e) {

        // const userData = getFromStorage('auth-user')
        // console.log(this.state.epf)

        e.preventDefault();
        const obj = {
            fullName: this.state.fullName,
            debtorId: this.state.debtorId,
            damount: this.state.damount,
            nic: this.state.nic,
            mobile: this.state.mobile,
            fax: this.state.fax,
            other: this.state.other,
            // signup_completed: this.state.signup_completed
        };

        axios.post('http://localhost:4000/debtors/register' , obj)
            .then(res => console.log(res.data));


        // const obj2 = {
        //     signup_password: this.state.signup_password,
        //     signup_completed: this.state.signup_completed
        // };
        // if (this.state.signup_password) {
        //     axios.post('http://localhost:4000/mazzevents/updatepassword/' + this.props.id, obj2)
        //         .then(res => console.log(res.data));
        // }
        //this.props.history.push('/customer/photo');
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

                                <form>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group" style={{ marginTop: "50px", marginLeft: "120px" }} >
                                                <input className="form-control" type="debtorId" name="debtorId" id="debtorId" placeholder="Search ID here" onChange={this.onChange} />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group" style={{ marginTop: "50px", marginRight: "120px" }}>
                                                <button className="btn btn-info my-4 btn-block " type="submit">ADD A NEW DEBTOR</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>

                            </div>
                            <div className="card">

                                <div>
                                    <h3 className="sp_head">List of Debtors</h3>
                                    <div className="sp_table">

                                        <table className="table table-striped" style={{ marginTop: 20 }} >
                                            <thead>
                                                <tr>
                                                    <th>Name / Compamy Name</th>
                                                    <th>Debtor ID</th>
                                                    <th>Amount</th>
                                                    <th>Mobile Number</th>
                                                    <th>Fax Number</th>
                                                    <th>NIC</th>


                                                </tr>
                                            </thead>
                                            <tbody>

                                                {/* {this.UserList()} */}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                            </div>
                            <div className="card">

                                <div style={{ width: "90%", margin: 'auto' }}>
                                    <div className="row">



                                        {/* {this.state.users.map((data) => {
                                            console.log(data.epf);


                                            return ( */}
                                                <div className="card">
                                                    <div style={{ width: "90%", margin: 'auto' }}>
                                                        <form onSubmit={this.onSubmit} >

                                                            <div className="form-group" style={{ marginTop: "50px" }}>
                                                                <label>Name / Company Name : </label>
                                                                <input type="text" className="form-control" name="fullName" defaultValue={this.state.fullName} onChange={this.onChange}></input>
                                                            </div>
                    
                                                            <div className="row">
                                                                <div className="col-md-4">
                                                                    <div className="form-group">
                                                                        <label>Debitor ID : </label>
                                                                        <input type="text" className="form-control" name="debtorId" defaultValue={this.state.debtorId} onChange={this.onChange}></input>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <div className="form-group">
                                                                        <label>Debited Amount : </label>
                                                                        <input type="text" className="form-control" name="damount" defaultValue={this.state.damount} onChange={this.onChange}></input>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <div className="form-group">
                                                                        <label>NIC : </label>
                                                                        <input type="text" className="form-control" name="nic" defaultValue={this.state.nic} onChange={this.onChange}></input>
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


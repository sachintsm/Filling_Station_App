import React, { Component } from 'react';
import axios from 'axios';
import { Button, Card, Form, Col, Row } from 'react-bootstrap';
import Sidebar from '../Auth/sidebar';
import "react-datepicker/dist/react-datepicker.css";
import '../../Css/Basic/profile.css';
import normal from '../../Assets/images/normal.png';
import { getFromStorage } from '../../utils/storage';



// import AddImage from "../../Components/AddServiceImage.component";
// import Delete from "../../Components/Delete.component";

export default class profile extends Component {
    constructor(props) {
        super(props);
        this.onChangeFulName = this.onChangeFulName.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangeBirthday = this.onChangeBirthday.bind(this);
        this.onChangeMobileOne = this.onChangeMobileOne.bind(this);
        this.onChangeMobileTwo = this.onChangeMobileTwo.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeAddress = this.onChangeAddress.bind(this);
        this.onChangeNic = this.onChangeNic.bind(this);
        this.onChangeEpf = this.onChangeEpf.bind(this);
        this.onChangeEtf = this.onChangeEtf.bind(this);
        this.onChangeOther = this.onChangeOther.bind(this);
        this.onChangeUserId = this.onChangeUserId.bind(this);
        this.onChangeUserType = this.onChangeUserType.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
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
            userData: []
        }
    }

    componentDidMount() {
        const userData = getFromStorage('auth-user')
        console.log(userData.userId)

        axios.get('http://localhost:4000/users/get/' + userData.userId)
            .then(response => {
                console.log(response);

                this.setState({
                    userData: response.data.data,

                        fullName: userData.fullName,
                        email: userData.email,
                        password: userData.password,
                        mobileOne: userData.mobileOne,
                        mobileTwo: userData.mobileTwo,
                        address: userData.address,
                        nic: userData.nic,
                        epf: userData.epf,
                        etf: userData.etf,
                        other: userData.other,
                        file: userData.file,
                        userId: userData.userId,
                        userType: userData.userType,
                        signup_completed: userData.signup_completed
                })
                console.log(this.state.userId);
            })
            .catch(error => {
                console.log(error)
            })

    }

    onChangeFulName(e) {
        this.setState({
            fullName: e.target.value
        });
    }
    onChangeEmail(e) {
        this.setState({
            email: e.target.value
        });
    }
    onChangeMobileOne(e) {
        this.setState({
            mobileOne: e.target.value
        });
    }
    onChangeMobileTwo(e) {
        this.setState({
            mobileTwo: e.target.value
        });
    }
    onChangeBirthday(e) {
        this.setState({
            birthday: e.target.value
        });
    }
    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }
    // onChangeSignupAPassword(e) {
    //     this.setState({
    //         signup_aPassword: e.target.value
    //     });
    // }
    onChangeAddress(e) {
        this.setState({
            address: e.target.value
        });
    }
    onChangeNic(e) {
        this.setState({
            nic: e.target.value
        });
    }

    onChangeEpf(e) {
        this.setState({
            epf: e.target.value
        });
    }
    onChangeEtf(e) {
        this.setState({
            etf: e.target.value
        });
    }
    onChangeOther(e) {
        this.setState({
            other: e.target.value
        });
    }
    onChangeUserId(e) {
        this.setState({
            userId: e.target.value
        });
    }
    onChangeUserType(e) {
        this.setState({
            userType: e.target.value
        });
    }
    onSubmit(e) {

        const userData = getFromStorage('auth-user')
        console.log(userData.userId)

        e.preventDefault();
        const obj = {
            signup_firstName: this.state.signup_firstName,
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
            signup_completed: this.state.signup_completed
        };

        axios.post('http://localhost:4000/users/updateuser/' + userData.userId, obj)
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


            <div>
                <Col className="row">
                    <div className="col-md-2" style={{ backgroundColor: "#1c2431" }}>
                        <Sidebar />
                    </div>
                    <div className="col-md-10">

                        <React.Fragment>
                            <h3 style={{ textAlign: "center", marginTop: "50px" }}>My Profile</h3>




                            <div className="card">

                                <div style={{ width: "90%", margin: 'auto' }}>
                                    <div className="row">
                                        <div className="col-md-4">

                                            <Card style={{ width: '18rem' }}>
                                                <div className="overflow">
                                                    <Card.Img variant="top" src={!this.state.file ? normal : this.state.file} />
                                                </div>
                                                <Card.Body>
                                                    <Card.Title><center>{this.state.fullName} {this.state.fullName}</center></Card.Title>
                                                    <Card.Text>
                                                        Contact Number 1: {this.state.mobileOne}<br />
                                                        Contact Number 2: {this.state.mobileTwo}<br />

                                                    </Card.Text>
                                                    <br />
                                                    {/* <center>
                                    <AddImage />
                                </center> */}
                                                </Card.Body>
                                            </Card>
                                        </div>

                                        <div className="col-md-8">
                                            {/* {this.state.userData.map((data) => { */}
                                                {/* return ( */}
                                                    <form onSubmit={this.onSubmit}>
                                                        <div className="row" >
                                                            <div className="col-md-4">
                                                                <div className="form-group" style={{ marginTop: "50px" }}>
                                                                    <label>User ID : </label>
                                                                    <input type="text" className="form-control" name="userId" defaultValue={this.state.userId} onChange={this.onChange} />
                                                                </div>
                                                            </div>


                                                            <div className="col-md-4">
                                                                <div className="form-group" style={{ marginTop: "50px" }}>
                                                                    <label>User Type : </label>
                                                                    <input type="text" className="form-control" name="userType" defaultValue={this.state.userType} onChange={this.onChange}></input>
                                                                </div>
                                                            </div>


                                                            <div className="col-md-4">
                                                                <div className="form-group" style={{ marginTop: "50px" }}>
                                                                    <label>Birthday : </label>
                                                                    <input type="text" className="form-control" name="userType" defaultValue={this.state.birthday} onChange={this.onChange}></input>
                                                                </div>
                                                            </div>
                                                        </div>






                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <label>E-mail : </label>
                                                                    <input type="text" className="form-control" name="email" defaultValue={this.state.email} onChange={this.onChange}></input>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <label>NIC Number : </label>
                                                                    <input type="text" className="form-control" name="nic" defaultValue={this.state.nic} onChange={this.onChange}></input>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <Row>
                                                            <Col>
                                                                <div className="form-group">
                                                                    <label>EPF Number : </label>
                                                                    <input type="text" className="form-control" name="epf" defaultValue={this.state.epf} onChange={this.onChange}></input>
                                                                </div>
                                                            </Col>
                                                            <Col>
                                                                <div className="form-group">
                                                                    <label>ETF Number : </label>
                                                                    <input type="text" className="form-control" name="etf" defaultValue={this.state.etf} onChange={this.onChange}></input>
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
                                                            <button className="btn btn-info my-4 btn-block " type="submit">UPDATE</button>
                                                        </div>

                                                    </form>
                                                {/* )
                                             })} */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>

                    </div>

                </Col>
            </div >

        )
    }
}

// const mapStateToProps = state => ({
//     id: state.auth.id,
//     fName: state.auth.fName,
//     lName: state.auth.lName,
//     email: state.auth.email,
//     number: state.auth.number
// });

// export default connect(mapStateToProps, null)(profile);

import React, { Component } from 'react';
import axios from 'axios';
import { Button, Card, Form, Col } from 'react-bootstrap';
import Sidebar from '../Auth/sidebar';
import "react-datepicker/dist/react-datepicker.css";
import { Row, Col } from 'reactstrap';
import '../../Css/Admin/registration.css';
// import Upper from "../../Components/Upper.component";
import { connect } from 'react-redux';
// import AddImage from "../../Components/AddServiceImage.component";
// import normal from '../../Images/Profile/normal.png';
// import Delete from "../../Components/Delete.component";

class profile extends Component {
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
            signup_completed: false
        }
    }

    componentDidMount() {
        axios.get('http://localhost:4000/users/' + this.props.id)
            .then(response => {
                this.setState({
                    fullName: response.data.fullName,
                    email: response.data.email,
                    password: response.data.password,
                    mobileOne: response.data.mobileOne,
                    mobileTwo: response.data.mobileTwo,
                    address: response.data.address,
                    nic: response.data.nic,
                    epf: response.data.epf,
                    etf: response.data.etf,
                    other: response.data.other,
                    file: response.data.file,
                    userId: response.data.userId,
                    userType: response.data.userType,
                    signup_completed: response.data.signup_completed
                })
            })
            .catch(function (error) {
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

        axios.post('http://localhost:4000/mazzevents/updatecustomer/' + this.props.id, obj)
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
                <Sidebar />
                <div className="right">
                    {/* <Upper /> */}
                    {/* <div className="left">
                        <Card style={{ width: '18rem' }}>
                            <div className="overflow">
                                <Card.Img variant="top" src={!this.state.profilePic ? normal : this.state.profilePic} />
                            </div>
                            <Card.Body>
                                <Card.Title><center>{this.state.signup_firstName} {this.state.signup_lastName}</center></Card.Title>
                                <Card.Text>
                                    Email Address: {this.state.signup_email}<br />
                                    Contact Number: {this.state.signup_number}<br />

                                </Card.Text>
                                <br />
                                <center>
                                    <AddImage />
                                </center>
                            </Card.Body>
                        </Card>
                    </div> */}

                    <div className="rightAccount">

                        <h3>Update My details</h3>
                        <Form onSubmit={this.onSubmit}>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridFirstName">
                                    <Form.Label>full Name</Form.Label>
                                    <Form.Control type="text" className="form-control" value={this.state.fullName} onChange={this.onChangeFulName} />
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridLastName">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control type="text" className="form-control" value={this.state.address} onChange={this.onChangeAddress} />
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="text" className="form-control" value={this.state.email} onChange={this.onChangeEmail} />
                                </Form.Group>
                                <Form.Group controlId="ContactNumber">
                                    <Form.Label>Contact Number</Form.Label>
                                    <Form.Control type="text" className="form-control" value={this.state.mobileOne} onChange={this.onChangeMobileOne} />
                                </Form.Group>
                            </Form.Row>
                            <div className="row">
                                <div className="col-md-6">
                                    <Button variant="dark" type="submit" value="Update">
                                        Update
                                    </Button>
                                </div>
                                <div className="col-md-6">
                                    <Delete />
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    id: state.auth.id,
    fName: state.auth.fName,
    lName: state.auth.lName,
    email: state.auth.email,
    number: state.auth.number
});

export default connect(mapStateToProps, null)(profile);

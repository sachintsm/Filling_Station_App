import React, { Component } from 'react'
import 'whatwg-fetch';
import { getFromStorage, setInStorage } from '../../utils/storage';
import { MDBInput, MDBBtn, MDBCard, MDBCardTitle, MDBCol } from "mdbreact";
// import Login from '../Admin/login'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Form } from 'reactstrap';
import '../../Css/Admin/login.css';
import '../../Css/Basic/home.css';
import { Link } from "react-router-dom";

export default class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            token: '',
            signUpError: '',
            signInError: '',
            masterError: '',
            userId: '',
            password: '',
        };

        this.onSignIn = this.onSignIn.bind(this);
        this.onChangeUserId = this.onChangeUserId.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
    }

    onChangeUserId(e) {
        this.setState({
            userId: e.target.value
        })
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        })
    }

    componentDidMount() {
        const obj = getFromStorage('the_main_app');
        if (obj && obj.token) {
            const { token } = obj;
            //verify token
            fetch('http://localhost:4000/users/account/verify?token=' + token)
                .then(res => res.json())
                .then(json => {
                    if (json.state) {
                        this.setState({
                            token,
                            isLoading: false
                        })
                    }
                })
        }
        else {
            this.setState({
                isLoading: false
            })
        }
    }

    onSignIn() {
        const {
            userId,
            password
        } = this.state;

        this.setState({
            isLoading: true,
        })

        fetch('http://localhost:4000/users/account/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: userId,
                password: password
            }),
        })
            .then(res => res.json())
            .then(json => {
                console.log('josn', json);
                if (json.state) {
                    setInStorage('the_main_app', { token: json.token })
                    this.setState({
                        signInError: json.msg,
                        isLoading: false,
                        password: '',
                        userId: '',
                        token: json.token
                    })
                }
                else {
                    this.setState({
                        signInError: json.msg,
                        isLoading: false
                    })
                }

            })
    }

    render() {
        const {
            isLoading,
            token,
            userId,
            password,
            signInError
        } = this.state;

        if (isLoading) {
            return (
                < div >
                    Loading...
                </div >
            )
        }

        if (!token) {
            // <Login/>
            return (
                <div className="container-fluid" style={{ backgroundColor: "#F8F9FA", minHeight: "700px" }}>
                    <div className="row">
                        <div className="container login-card-div" >
                            <Card className="login-card">
                                <Form >
                                    {
                                        (signInError) ? (
                                            <p>{signInError}</p>
                                        ) : null
                                    }
                                    {/* eslint-disable-next-line */}
                                    <img src={require('../../Assets/logo/Logo_reg.png')} className="logo" />
                                    <CardContent style={{ marginLeft: "20px", marginRight: "20px" }}>
                                        <Typography color="textSecondary" gutterBottom>
                                            User Name
                                    </Typography>
                                        <MDBInput label="User ID" outline icon="user" type="text" placeholder="userId" name="userId" value={userId} onChange={this.onChangeUserId} />
                                        <Typography color="textSecondary" gutterBottom>
                                            Password
                                    </Typography>
                                        <MDBInput label="Password" outline icon="key" type="password" placeholder="Password" name="password" value={password} onChange={this.onChangePassword} />
                                    </CardContent>
                                    <CardActions style={{ marginBottom: "20px" }}>
                                        <MDBBtn outline style={{ margin: "auto", width: "40%" }} color="info" size="small">Forget Password</MDBBtn>
                                        <MDBBtn color="info" style={{ margin: "auto", width: "40%" }} onClick={this.onSignIn}>login</MDBBtn>
                                    </CardActions>
                                </Form>
                            </Card>
                        </div>
                    </div>
                </div >
            )
        }

        return (
            <div className="home-div">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4">
                            <MDBCol>

                                <Link to="/pumpsRegistration">
                                    <MDBCard style={{ width: "100%", minHeight: "80px" }}>
                                        <MDBCardTitle style={{ margin: "auto", color: 'black' }} >Pumps Registration</MDBCardTitle>
                                    </MDBCard>
                                </Link>

                            </MDBCol>
                        </div>
                        <div className="col-md-4">
                            <MDBCol>

                                <Link to="/registration">
                                    <MDBCard style={{ width: "100%", minHeight: "80px" }}>
                                        <MDBCardTitle style={{ margin: "auto", color: 'black' }} >User Registration</MDBCardTitle>
                                    </MDBCard>
                                </Link>

                            </MDBCol>
                        </div>
                        <div className="col-md-4">
                            <MDBCol>

                                <Link to="/daily$pumpers$calculations">
                                    <MDBCard style={{ width: "100%", minHeight: "80px" }}>
                                        <MDBCardTitle style={{ margin: "auto", color: 'black' }} >Daily Pumper Calculations</MDBCardTitle>
                                    </MDBCard>
                                </Link>

                            </MDBCol>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

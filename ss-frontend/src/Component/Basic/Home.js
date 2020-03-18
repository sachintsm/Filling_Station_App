import React, { Component } from 'react'
import { MDBCard, MDBCardTitle, MDBCol } from "mdbreact";
import Login from '../Admin/login'
import '../../Css/Admin/login.css';
import '../../Css/Basic/home.css';
import { Link } from "react-router-dom";
import { verifyAuth } from '../../utils/authentication'
import { getFromStorage } from '../../utils/storage';

export default class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            authState: '',
        };
    }

    componentDidMount() {
        const authState = verifyAuth()
        console.log(authState);
        // const obj = getFromStorage('auth-token');
        // if (!obj) {
        //     return null
        // }
        // try {
        //     //verify token
        //     fetch('http://localhost:4000/users/verify', {
        //         method: 'GET',
        //         headers: {
        //             'Content-Type': 'application-json',
        //             'auth-token': obj.token
        //         }
        //     })
        //         .then(res => res.json())
        //         .then(json => {
        //             this.setState({
        //                 authState: json.state
        //             })
        //         })
        // }
        // catch (err) {
        //     return err;
        // }
        this.setState({
            authState: authState
        })
    }

    render() {
        const { authState } = this.state;

        if (!authState) {
            // window.location.reload()
            return (<Login />)
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

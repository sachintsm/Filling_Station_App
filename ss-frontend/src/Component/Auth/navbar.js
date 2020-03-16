import React, { Component } from 'react'
import '../../Css/Auth/navbar.css'
import { getFromStorage, deleteStorage } from '../../utils/storage';
import {
    MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavbarToggler, MDBCollapse,
} from "mdbreact";
import { BrowserRouter as Router } from 'react-router-dom';



export default class navbar extends Component {

    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
    }

    state = {
        isOpen: false
    };

    toggleCollapse = () => {
        this.setState({ isOpen: !this.state.isOpen });
    }

    logout() {

        const obj = getFromStorage('the_main_app');
        const { token } = obj;
        if (obj && obj.token) {
            //verify token
            fetch('http://localhost:4000/users/account/logout?token=' + token)
                .then(res => res.json())
                .then(json => {
                    if (json.state) {
                        this.setState({
                            token: '',
                            isLoading: false
                        })
                    }
                })
            deleteStorage();

        }
        window.location.reload(false);

    }

    render() {
        return (
            <Router >
                <MDBNavbar dark expand="md" className="navbar"> 
                    <MDBNavbarBrand>
                        {/* eslint-disable-next-line */}
                        <img style={{ width: "12%" }} src={require('../../Assets/logo/Logo_white.png')} />
                    </MDBNavbarBrand>
                    <MDBNavbarToggler onClick={this.toggleCollapse} />
                    <MDBCollapse id="navbarCollapse3" isOpen={this.state.isOpen} navbar>
                        <MDBNavbarNav right>
                            <MDBNavItem>
                                <div className="nav-button" >Profile</div>
                            </MDBNavItem>
                            &nbsp;
                            &nbsp;
                            &nbsp;
                            &nbsp;
                            <MDBNavItem>
                                <div className="nav-button" onClick={this.logout}>Logout</div>
                            </MDBNavItem>
                        </MDBNavbarNav>
                    </MDBCollapse>
                </MDBNavbar>
            </Router>
        )
    }
}

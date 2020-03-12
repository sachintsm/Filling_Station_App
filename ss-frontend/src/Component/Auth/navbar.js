import React, { Component } from 'react'
import '../../Css/Auth/navbar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'

export default class navbar extends Component {
    render() {
        return (
            <div className="navBack">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-9">
                            {/* eslint-disable-next-line */}
                            <img style={{ width: "8%", marginTop: "8px" }} src={require('../../Assets/logo/Logo_white.png')} />
                        </div>

                        <div className="col-md-3">
                            <div className="row">
                                <div className="col-md-4 navLink">
                                    <p className="navContent">
                                        <FontAwesomeIcon icon={faHome} color="white" />
                                        &nbsp; Home </p>
                                </div>
                                <div className="col-md-4 navLink">
                                    <p className="navContent">
                                        Logout
                                    </p>
                                </div>
                                <div className="col-md-4 navLink">
                                    <p className="navContent">
                                        Login
                                    </p>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

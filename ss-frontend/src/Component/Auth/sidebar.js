import React, { Component } from 'react'
import '../../Css/Auth/sidebar.css'

export default class sidebar extends Component {
    render() {
        return (
            <div className="container-fluid">
                <div className="row side-row-div">

                    <div className="col-md-2 side-icn">
                        Icon
                    </div>
                    <div className="col-md-10 side-txt">
                        <p>Pumps Registration</p>
                    </div>

                </div>
                <div className="row side-row-div">

                    <div className="col-md-2 side-icn">
                        Icon
                    </div>
                    <div className="col-md-10 side-txt">
                        <p>Pumps Registration</p>
                    </div>

                </div>
                
            </div>
        )
    }
}

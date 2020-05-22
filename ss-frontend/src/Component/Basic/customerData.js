import React, { Component } from 'react';
import { verifyAuth } from '../../utils/authentication'
import axios from 'axios';

const backend_URI = require('../Auth/Backend_URI')

class customerData extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentDidMount = async () => {
        const authState = await verifyAuth();
        this.setState({ authState: authState })
        if (!authState) this.props.history.push('/login');

        console.log(this.props.match.params.id)
        axios.get(backend_URI.url + '/debtors/customer/' + this.props.match.params.id)
            .then(res => {
                console.log(res.data.data[0])
            })
    }
    render() {

        return (
            <div>

            </div>
        );
    }
}

export default customerData;
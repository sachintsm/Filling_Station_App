import React, { Component } from 'react';
import Sidebar from '../Auth/sidebar'
import '../../Css/Basic/salesStocks.css'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import axios from 'axios'
import { getFromStorage } from '../../utils/storage';
import { Card } from 'react-bootstrap';
import AddBoxIcon from '@material-ui/icons/AddBox';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ErrorIcon from '@material-ui/icons/Error';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
const backend_URI = require('../Auth/Backend_URI')

class salesStocks extends Component {

    constructor(props) {
        super(props);
        this.state = {
            snackbaropen: false,
            pId: '',
            pName: '',
            sellPrice: '',
            pType: '',
            availStock: '',
            userData: [],
            products: [],
            newStock: '',
        }
        this.onChange = this.onChange.bind(this);
        this.stockAdd = this.stockAdd.bind(this);
    }
    snackbarClose = (event) => {
        this.setState({ snackbaropen: false })
    }

    componentDidMount() {
        axios.get(backend_URI.url + '/fuelLubricantPrice/get')
            .then(response => {
                this.setState({ products: response.data.data });
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    handleSearch = e => {
        this.setState({ pId: e.target.value });
    };

    onChange = (e) => {
        this.setState({
            newStock: e.target.value
        })
    }
    async stockAdd(pId, data) {
        const obj = getFromStorage('auth-token');
        if (this.state.newStock === null || this.state.newStock === '') {
            this.setState({
                snackbaropen: true,
                snackbarmsg: "Invalied input..!"
            })
        }
        else {
            var updatedStock = parseFloat(data) + parseFloat(this.state.newStock)
            console.log(updatedStock);
            const dt = {
                pId: pId,
                updatedStock: updatedStock
            }
            fetch(backend_URI.url + '/fuelLubricantPrice/updateAvailableStock', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': obj.token
                },
                body: JSON.stringify(dt),
            })
                .then(res => res.json())
                .then(json => {
                    this.setState({
                        snackbaropen: true,
                        snackbarmsg: json.msg
                    })
                    window.location.reload();
                })
                .catch(err => {
                    this.setState({
                        snackbaropen: true,
                        snackbarmsg: err
                    })
                    console.log(err)
                })
        }
    }

    fuelIcon(availStock) {
        if (availStock >= 3000) return <CheckCircleOutlineIcon className="goodState" />
        else if (availStock >= 1000) return <ErrorIcon className="warningState" />
        else return <NotInterestedIcon className="badState" />
    }
    lubricantIcon(availStock) {
        if (availStock >= 10) return <CheckCircleOutlineIcon className="goodState" />
        else if (availStock >= 5) return <ErrorIcon className="warningState" />
        else return <NotInterestedIcon className="badState" />
    }
    gasIcon(availStock) {
        if (availStock >= 12) return <CheckCircleOutlineIcon className="goodState" />
        else if (availStock >= 7) return <ErrorIcon className="warningState" />
        else return <NotInterestedIcon className="badState" />
    }
    otherIcon(availStock) {
        if (availStock >= 10) return <CheckCircleOutlineIcon className="goodState" />
        else if (availStock >= 5) return <ErrorIcon className="warningState" />
        else return <NotInterestedIcon className="badState" />
    }

    render() {
        const { products } = this.state;

        let FuleList = products.length > 0 && products.map((props, i) => {

            if (props.pType === 'Fuel') {

                return (
                    <tr key={i}>
                        <td>{this.fuelIcon(props.availStock)}</td>
                        <td>{props.pId}</td>
                        <td>{props.pName}</td>
                        <td className="txtAlignCenter">{props.sellPrice}</td>
                        <td className="txtAlignCenter">{parseFloat(props.availStock).toFixed(3)}</td>
                        <td>
                            <input type="number" className="form-control" name="newStock" placeholder="0" onChange={this.onChange} />
                        </td>
                        <td>
                            <AddBoxIcon className="add-icon" fontSize="large" style={{ marginTop: "-0px" }} onClick={() => this.stockAdd(props.pId, props.availStock)}>Add</AddBoxIcon>
                        </td>
                    </tr>
                )
            }
            return null
        }, this);
        let GasList = products.length > 0 && products.map((props, i) => {
            if (props.pType === 'Gas') {
                return (
                    <tr key={i}>
                        <td>{this.gasIcon(props.availStock)}</td>
                        <td>{props.pId}</td>
                        <td>{props.pName}</td>
                        <td className="txtAlignCenter">{props.sellPrice}</td>
                        <td className="txtAlignCenter">{parseFloat(props.availStock).toFixed(1)}</td>
                        <td>
                            <input type="number" className="form-control" name="newStock" placeholder="0" onChange={this.onChange} />
                        </td>
                        <td>
                            <AddBoxIcon className="add-icon" fontSize="large" style={{ marginTop: "-0px" }} onClick={() => this.stockAdd(props.pId, props.availStock)}>Add</AddBoxIcon>
                        </td>
                    </tr>
                )
            }
            return null

        }, this);
        let lubricantList = products.length > 0 && products.map((props, i) => {
            if (props.pType === 'Lubricant') {
                return (
                    <tr key={i}>
                        <td>{this.lubricantIcon(props.availStock)}</td>
                        <td>{props.pId}</td>
                        <td>{props.pName}</td>
                        <td className="txtAlignCenter">{props.sellPrice}</td>
                        <td className="txtAlignCenter">{parseFloat(props.availStock).toFixed(2)}</td>
                        <td>
                            <input type="number" className="form-control" name="newStock" placeholder="0" onChange={this.onChange} />
                        </td>
                        <td>
                            <AddBoxIcon className="add-icon" fontSize="large" style={{ marginTop: "-0px" }} onClick={() => this.stockAdd(props.pId, props.availStock)}>Add</AddBoxIcon>
                        </td>
                    </tr>
                )
            }
            return null
        }, this);
        let otherList = products.length > 0 && products.map((props, i) => {
            if (props.pType === 'Other') {
                return (
                    <tr key={i}>
                        <td>{this.otherIcon(props.availStock)}</td>
                        <td>{props.pId}</td>
                        <td>{props.pName}</td>
                        <td className="txtAlignCenter">{props.sellPrice}</td>
                        <td className="txtAlignCenter">{parseFloat(props.availStock).toFixed(2)}</td>
                        <td>
                            <input type="number" className="form-control" name="newStock" placeholder="0" onChange={this.onChange} />
                        </td>
                        <td>
                            <AddBoxIcon className="add-icon" fontSize="large" style={{ marginTop: "-0px" }} onClick={() => this.stockAdd(props.pId, props.availStock)}>Add</AddBoxIcon>
                        </td>
                    </tr>
                )

            }
            return null
        }, this);


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
                        <div className="col-md-10" style={{ backgroundColor: "#f5f5f5" }}>
                            <div className="container">
                                <Card style={{ width: '100%' }}>
                                    <div>
                                        <h3 className="sp_head">List of Fuels</h3>
                                        <form>
                                            <div className="form-group" style={{ marginTop: "50px", marginLeft: "40px", marginRight: "40px" }} >
                                                <input className="form-control" type="debtorId" name="debtorId" id="debtorId" placeholder="Search ID here" onChange={this.handleSearch} />
                                            </div>
                                        </form>
                                        <div className="sp_table">
                                            <form>
                                                <table className="table table-striped" style={{ marginTop: 20 }} >
                                                    <thead>
                                                        <tr>
                                                            <th>State</th>
                                                            <th>P.ID</th>
                                                            <th>P.Name</th>
                                                            <th className="txtAlignCenter">Selling Price</th>
                                                            <th className="txtAlignCenter">Available Stock</th>
                                                            <th>Add New Stock</th>

                                                        </tr>
                                                    </thead>
                                                    <tbody>

                                                        {FuleList}
                                                    </tbody>
                                                </table>
                                            </form>
                                        </div>
                                    </div>
                                </Card>
                                <Card style={{ width: '100%' }}>
                                    <div>
                                        <h3 className="sp_head">List of Gases</h3>
                                        <form>
                                            <div className="form-group" style={{ marginTop: "50px", marginLeft: "40px", marginRight: "40px" }} >
                                                <input className="form-control" type="debtorId" name="debtorId" id="debtorId" placeholder="Search ID here" onChange={this.handleSearch} />
                                            </div>
                                        </form>
                                        <div className="sp_table">
                                            <form>
                                                <table className="table table-striped" style={{ marginTop: 20 }} >
                                                    <thead>
                                                        <tr>
                                                            <th>State</th>
                                                            <th>P.ID</th>
                                                            <th>P.Name</th>
                                                            <th className="txtAlignCenter">Selling Price</th>
                                                            <th className="txtAlignCenter">Available Stock</th>
                                                            <th>Add New Stock</th>

                                                        </tr>
                                                    </thead>
                                                    <tbody>

                                                        {GasList}
                                                    </tbody>
                                                </table>
                                            </form>
                                        </div>
                                    </div>
                                </Card>
                                <div className="card" style={{ width: '100%' }}>
                                    <div>
                                        <h3 className="sp_head">List of Lubricants</h3>
                                        <form>
                                            <div className="form-group" style={{ marginTop: "50px", marginLeft: "40px", marginRight: "40px" }} >
                                                <input className="form-control" type="debtorId" name="debtorId" id="debtorId" placeholder="Search ID here" onChange={this.handleSearch} />
                                            </div>
                                        </form>
                                        <div className="sp_table">
                                            <form>
                                                <table className="table table-striped" style={{ marginTop: 20 }} >
                                                    <thead>
                                                        <tr>
                                                            <th>State</th>
                                                            <th>P.ID</th>
                                                            <th>P.Name</th>
                                                            <th className="txtAlignCenter">Selling Price</th>
                                                            <th className="txtAlignCenter">Available Stock</th>
                                                            <th>Add New Stock</th>

                                                        </tr>
                                                    </thead>
                                                    <tbody>

                                                        {lubricantList}
                                                    </tbody>
                                                </table>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div className="card" style={{ width: '100%' }}>
                                    <div>
                                        <h3 className="sp_head">List of Other Items</h3>
                                        <form>
                                            <div className="form-group" style={{ marginTop: "50px", marginLeft: "40px", marginRight: "40px" }} >
                                                <input className="form-control" type="debtorId" name="debtorId" id="debtorId" placeholder="Search ID here" onChange={this.handleSearch} />
                                            </div>
                                        </form>
                                        <div className="sp_table">
                                            <form>
                                                <table className="table table-striped" style={{ marginTop: 20 }} >
                                                    <thead>
                                                        <tr>
                                                            <th>State</th>
                                                            <th>P.ID</th>
                                                            <th>P.Name</th>
                                                            <th className="txtAlignCenter">Selling Price</th>
                                                            <th className="txtAlignCenter">Available Stock</th>
                                                            <th>Add New Stock</th>

                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {otherList}
                                                    </tbody>
                                                </table>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default salesStocks;
import React, { Component } from 'react'
import '../../Css/Basic/fuelLubricantPrice.css'
import { MDBInput } from "mdbreact";
import { Button } from 'reactstrap';
import Card from '@material-ui/core/Card';
import Sidebar from '../Auth/sidebar'
import { verifyAuth } from '../../utils/authentication';
import { getFromStorage } from '../../utils/storage';
import axios from 'axios'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Snackpop from "../Auth/Snackpop";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'

const backend_URI = require('../Auth/Backend_URI')

export default class fuelLubricantPrice extends Component {
    constructor(props) {
        super(props);

        this.state = {
            snackbaropen: false,
            snackbarmsg: '',
            snackbarcolor: '',

            authState: '',
            authUser: '',

            pId: '',
            pName: '',
            size: '',
            buyPrice: '',
            sellPrice: '',
            pType: '',
            products: [],
            fuels: [],
            lubricants: [],
            gas: [],
            others: [],
            pumpSet: '',

        }
        this.onChange = this.onChange.bind(this);
        this.onChangeType = this.onChangeType.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.onSellPriceBlur = this.onSellPriceBlur.bind(this)
        this.onBuyPriceBlur = this.onBuyPriceBlur.bind(this)
        this.deleteProduct = this.deleteProduct.bind(this)
        this.onRefresh = this.onRefresh.bind(this)
        this.onBuyPriceChange = this.onBuyPriceChange.bind(this)
        this.onSellPriceChange = this.onSellPriceChange.bind(this)

    }

    closeAlert = () => {
        this.setState({ snackbaropen: false });
    };

    onChange = (e) => {
        e.persist = () => { };
        let store = this.state;
        store[e.target.name] = e.target.value
        this.setState(store);
    }

    onChangeType = (e) => {
        this.setState({
            pType: e.target.value
        })
    }

    componentDidMount = async () => {
        const authState = await verifyAuth();
        this.setState({ authState: authState })
        if (!authState) this.props.history.push('/login');

        const user = getFromStorage('auth-user');
        if (user != null) {
            this.setState({
                authUser: user.userType
            })
        }

        axios.get(backend_URI.url + '/fuelLubricantPrice/get')
            .then(res => {
                this.setState({
                    products: res.data.data
                })

                var i = 0;
                for (i = 0; i < this.state.products.length; i++) {
                    if (this.state.products[i].pType === "Fuel") {
                        this.state.fuels.push(this.state.products[i])
                    }
                    else if (this.state.products[i].pType === "Lubricant") {
                        this.state.lubricants.push(this.state.products[i])
                    }
                    else if (this.state.products[i].pType === "Gas") {
                        this.state.gas.push(this.state.products[i])
                    }
                    else if (this.state.products[i].pType === "Other") {
                        this.state.others.push(this.state.products[i])
                    }
                }
                this.setState({
                    fuels: this.state.fuels,
                    lubricants: this.state.lubricants,
                    gas: this.state.gas,
                    others: this.state.others
                })
            })
            .catch(function (err) {
                console.log(err);
            })
    }

    onSubmit() {
        if (this.state.authUser === 'Administrator') {
            const obj = getFromStorage('auth-token');
            const data = {
                pId: this.state.pId,
                pName: this.state.pName,
                size: this.state.size,
                buyPrice: this.state.buyPrice,
                sellPrice: this.state.sellPrice,
                pType: this.state.pType,
            }

            if (this.state.pId === '' || this.state.pName === '' || this.state.buyPrice === '' || this.state.sellPrice === '' || this.state.pType === '') {
                this.setState({
                    snackbaropen: true,
                    snackbarcolor: 'error',
                    snackbarmsg: "Please Fill the Data ..!"
                })
            }
            else {
                confirmAlert({
                    title: 'Confirm to submit',
                    message: 'Are you sure to do this.',
                    buttons: [
                        {
                            label: 'Yes',
                            onClick: async () => {

                                fetch(backend_URI.url + '/fuelLubricantPrice/add', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'auth-token': obj.token
                                    },
                                    body: JSON.stringify(data),
                                })
                                    .then(res => res.json())
                                    .then(json => {
                                        this.setState({
                                            snackbaropen: true,
                                            snackbarmsg: json.msg,
                                            snackbarcolor: 'success'
                                        })
                                        window.location.reload();
                                    })
                                    .catch(err => {
                                        this.setState({
                                            snackbaropen: true,
                                            snackbarmsg: err,
                                            snackbarcolor: 'error'
                                        })
                                        console.log(err)
                                    })
                            }
                        },
                        {
                            label: 'No',
                            onClick: () => {
                            }
                        }
                    ]
                })
            }
        }
        else {
            this.setState({
                snackbaropen: true,
                snackbarcolor: 'error',
                snackbarmsg: "Please Sign In as Administrator ..!"
            })
        }

    }
    onBuyPriceChange(e) {
        this.setState({
            buyPrice: e.target.value
        })
    }
    onSellPriceChange(e) {
        this.setState({
            sellPrice: e.target.value,
        })
    }

    async onBuyPriceBlur(data) {

        if (this.state.authUser === 'Administrator') {

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

            var urlencoded = new URLSearchParams();
            urlencoded.append("pId", data.pId);
            urlencoded.append("buyPrice", this.state.buyPrice);
            urlencoded.append("sellPrice", data.sellPrice);

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: urlencoded,
                redirect: 'follow'
            };
            confirmAlert({
                title: 'Confirm to submit',
                message: 'Are you sure to do this.',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: async () => {

                            fetch(backend_URI.url + "/fuelLubricantPrice/updateProductPrice", requestOptions)
                                .then(response => response.json())
                                .then(result => {
                                    if (result.state) {
                                        this.setState({
                                            snackbaropen: true,
                                            snackbarmsg: result.msg,
                                            snackbarcolor: 'success'
                                        })
                                        window.location.reload()
                                    }
                                    else {
                                        this.setState({
                                            snackbaropen: true,
                                            snackbarmsg: result.msg,
                                            snackbarcolor: 'error'
                                        })
                                    }
                                })
                                .catch(error => console.log('error', error));
                        }
                    },
                    {
                        label: 'No',
                        onClick: () => {
                            window.location.reload()
                        }
                    }
                ]
            })
        }
        else {
            this.setState({
                snackbaropen: true,
                snackbarcolor: 'error',
                snackbarmsg: "Please Sign In as Administrator ..!"
            })

        }

    }
    async onSellPriceBlur(data) {
        if (this.state.authUser === 'Administrator') {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

            var urlencoded = new URLSearchParams();
            urlencoded.append("pId", data.pId);
            urlencoded.append("sellPrice", this.state.sellPrice);
            urlencoded.append("buyPrice", data.buyPrice);

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: urlencoded,
                redirect: 'follow'
            };
            confirmAlert({
                title: 'Confirm to submit',
                message: 'Are you sure to do this.',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: async () => {


                            fetch(backend_URI.url + "/fuelLubricantPrice/updateProductPrice", requestOptions)
                                .then(response => response.json())
                                .then(result => {
                                    if (result.state) {
                                        this.setState({
                                            snackbaropen: true,
                                            snackbarmsg: result.msg,
                                            snackbarcolor: 'success'
                                        })
                                        window.location.reload()
                                    }
                                    else {
                                        this.setState({
                                            snackbaropen: true,
                                            snackbarmsg: result.msg,
                                            snackbarcolor: 'error'
                                        })
                                    }
                                })
                                .catch(error => console.log('error', error));
                        }
                    },
                    {
                        label: 'No',
                        onClick: () => {
                            window.location.reload()
                        }
                    }
                ]
            })
        }
        else {
            this.setState({
                snackbaropen: true,
                snackbarcolor: 'error',
                snackbarmsg: "Please Sign In as Administrator ..!"
            })

        }
    }

    onRefresh() {
        window.location.reload();
    }

    deleteProduct(data) {
        if (this.state.authUser === 'Administrator') {


            confirmAlert({
                title: 'Confirm to submit',
                message: 'Are you sure to do this.',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: async () => {

                            axios.delete(backend_URI.url + '/fuelLubricantPrice/deleteProduct/' + data)
                                .then(res => {
                                    console.log(res);
                                    this.setState({
                                        snackbaropen: true,
                                        snackbarmsg: res.data.msg,
                                        snackbarcolor: 'success'
                                    })
                                    window.location.reload();
                                })
                                .catch(err => {
                                    console.log(err);
                                    this.setState({
                                        snackbaropen: true,
                                        snackbarmsg: err,
                                        snackbarcolor: 'error'
                                    })
                                })
                        }
                    },
                    {
                        label: 'No',
                        onClick: () => {

                        }
                    }
                ]
            })
        }
        else {
            this.setState({
                snackbaropen: true,
                snackbarcolor: 'error',
                snackbarmsg: "Please Sign In as Administrator ..!"
            })

        }
    }

    render() {
        return (
            <React.Fragment>

                <div className="container-fluid">
                    <Snackpop
                        msg={this.state.snackbarmsg}
                        color={this.state.snackbarcolor}
                        time={3000}
                        status={this.state.snackbaropen}
                        closeAlert={this.closeAlert}
                    />

                    <div className="row">
                        <div className="col-md-2" style={{ backgroundColor: "#1c2431" }}>
                            <Sidebar />
                        </div>
                        <div className="col-md-10" style={{ backgroundColor: "#f8f9fd" }}>
                            <div>
                                <div className="container">
                                    <p className="sub-topic">Add New Product</p>
                                </div>
                                <div className="container reg-card">
                                    <Card>
                                        <form>
                                            <div className="container">
                                                <div className="row">
                                                    <div className="col-md-1">
                                                        <MDBInput outline label="PID" type="text" name="pId" onChange={this.onChange} />
                                                    </div>
                                                    <div className="col-md-3">
                                                        <MDBInput outline label="Product Name" type="text" name="pName" onChange={this.onChange} />
                                                    </div>
                                                    <div className="col-md-1">
                                                        <MDBInput outline label="Size" type="text" name="size" onChange={this.onChange} />
                                                    </div>
                                                    <div className="col-md-7">
                                                        <div className="row">

                                                            <div className="col-md-3">
                                                                <MDBInput outline label="Buying Price" type="text" name="buyPrice" onChange={this.onChange} />
                                                            </div>
                                                            <div className="col-md-3">
                                                                <MDBInput outline label="Selling Price" type="text" name="sellPrice" onChange={this.onChange} />
                                                            </div>
                                                            <div className="col-md-3 fuel-selector">
                                                                <select className="form-control" onChange={this.onChangeType}>
                                                                    <option >Select Type</option>
                                                                    <option value="Fuel">Fuel</option>
                                                                    <option value="Lubricant">Lubricant</option>
                                                                    <option value="Gas">Gas</option>
                                                                    <option value="Other">Other</option>
                                                                </select>

                                                            </div>
                                                            <div className="col-md-3" style={{ marginTop: "20px" }}>
                                                                <Button className="reg-btn" color="primary" onClick={this.onSubmit}>Add Now</Button>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </Card>
                                </div>
                                <div className="container">
                                    <p className="sub-topic">Fuel Price List</p>
                                </div>
                                <div className="container">
                                    <Card className="list-card">
                                        <div className="container card-content">
                                            <div className="row" style={{ marginLeft: "5px", marginRight: "5px" }} >
                                                <div className="col-md-1">
                                                    <label className="topic-product"> PID</label>
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="topic-product"> Product Name</label>
                                                </div>
                                                <div className="col-md-2">
                                                </div>

                                                <div className="col-md-5">
                                                    <div className="row">
                                                        <div className="col-md-4">
                                                            <label className="topic-product"> Buying Price</label>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <label className="topic-product" style={{ marginLeft: "10px" }}> Selling Price</label>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <label className="topic-product" style={{ marginLeft: "40px" }}> Action</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="container">
                                            {this.state.fuels.map((data) => {
                                                return (
                                                    <div className="row des-product-row" key={data.pId} style={{ marginLeft: "0px" }}>
                                                        <div className="col-md-1">
                                                            <label className="des-product"> {data.pId}</label>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <label className="des-product" > {data.pName} </label>
                                                        </div>
                                                        <div className="col-md-2">
                                                        </div>
                                                        <div className="col-md-5">
                                                            <div className="row">
                                                                <div className="col-md-4">
                                                                    <input className="form-control inputValue" defaultValue={data.buyPrice} onBlur={() => this.onBuyPriceBlur(data)} onChange={this.onBuyPriceChange} />
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <input className="form-control inputValue" defaultValue={data.sellPrice} onBlur={() => this.onSellPriceBlur(data)} onChange={this.onSellPriceChange} />
                                                                </div>
                                                                <div className="col-md-4" style={{ textAlign: 'center' }} >
                                                                    <DeleteForeverIcon className="delete-btn" onClick={() => this.deleteProduct(data._id)}>Delete</DeleteForeverIcon>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            )}
                                            <div className="container">
                                                <div className="row" style={{ float: "right" }}>
                                                    <div className="col-md-2">
                                                        <button style={{ width: "205px", marginBottom: "20px", marginRight: "-15px" }} className="btn btn-primary" onClick={this.onRefresh}>Submit Now</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </Card>
                                </div>
                                <div className="container">
                                    <p className="sub-topic">Gas Price List</p>
                                </div>
                                <div className="container">
                                    <Card className="list-card">
                                        <div className="container card-content">
                                            <div className="row" style={{ marginLeft: "5px", marginRight: "5px" }} >
                                                <div className="col-md-1">
                                                    <label className="topic-product"> PID</label>
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="topic-product"> Product Name</label>
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="topic-product"> Size</label>
                                                </div>

                                                <div className="col-md-5">
                                                    <div className="row">
                                                        <div className="col-md-4">
                                                            <label className="topic-product"> Buying Price</label>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <label className="topic-product" style={{ marginLeft: "10px" }}> Selling Price</label>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <label className="topic-product" style={{ marginLeft: "40px" }}> Action</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="container">
                                            {this.state.gas.map((data) => {
                                                return (
                                                    <div className="row des-product-row" key={data.pId} style={{ marginLeft: "0px" }}>
                                                        <div className="col-md-1">
                                                            <label className="des-product"> {data.pId}</label>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <label className="des-product" > {data.pName} </label>
                                                        </div>
                                                        <div className="col-md-2">
                                                            <label className="des-product"> {data.size}</label>
                                                        </div>
                                                        <div className="col-md-5">
                                                            <div className="row">
                                                                <div className="col-md-4">
                                                                    <input className="form-control inputValue" defaultValue={data.buyPrice} onBlur={() => this.onBuyPriceBlur(data)} onChange={this.onBuyPriceChange} />
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <input className="form-control inputValue" defaultValue={data.sellPrice} onBlur={() => this.onSellPriceBlur(data)} onChange={this.onSellPriceChange} />
                                                                </div>
                                                                <div className="col-md-4" style={{ textAlign: 'center' }} >
                                                                    <DeleteForeverIcon className="delete-btn" onClick={() => this.deleteProduct(data._id)}>Delete</DeleteForeverIcon>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            )}
                                            <div className="container">
                                                <div className="row" style={{ float: "right" }}>
                                                    <div className="col-md-2">
                                                        <button style={{ width: "205px", marginBottom: "20px", marginRight: "-15px" }} className="btn btn-primary" onClick={this.onRefresh}>Submit Now</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </Card>
                                </div>
                                <div className="container">
                                    <p className="sub-topic">Lubricant Price List</p>
                                </div>
                                <div className="container">
                                    <Card className="list-card">
                                        <div className="container card-content">
                                            <div className="row" style={{ marginLeft: "5px", marginRight: "5px" }} >
                                                <div className="col-md-1">
                                                    <label className="topic-product"> PID</label>
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="topic-product"> Product Name</label>
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="topic-product"> Size</label>
                                                </div>

                                                <div className="col-md-5">
                                                    <div className="row">
                                                        <div className="col-md-4">
                                                            <label className="topic-product"> Buying Price</label>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <label className="topic-product" style={{ marginLeft: "10px" }}> Selling Price</label>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <label className="topic-product" style={{ marginLeft: "40px" }}> Action</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="container">
                                            {this.state.lubricants.map((data) => {
                                                return (
                                                    <div className="row des-product-row" key={data.pId} style={{ marginLeft: "0px" }}>
                                                        <div className="col-md-1">
                                                            <label className="des-product"> {data.pId}</label>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <label className="des-product" > {data.pName} </label>
                                                        </div>
                                                        <div className="col-md-2">
                                                            <label className="des-product"> {data.size}</label>
                                                        </div>
                                                        <div className="col-md-5">
                                                            <div className="row">
                                                                <div className="col-md-4">
                                                                    <input className="form-control inputValue" defaultValue={data.buyPrice} onBlur={() => this.onBuyPriceBlur(data)} onChange={this.onBuyPriceChange} />
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <input className="form-control inputValue" defaultValue={data.sellPrice} onBlur={() => this.onSellPriceBlur(data)} onChange={this.onSellPriceChange} />
                                                                </div>
                                                                <div className="col-md-4" style={{ textAlign: 'center' }} >
                                                                    <DeleteForeverIcon className="delete-btn" onClick={() => this.deleteProduct(data._id)}>Delete</DeleteForeverIcon>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            )}
                                            <div className="container">
                                                <div className="row" style={{ float: "right" }}>
                                                    <div className="col-md-2">
                                                        <button style={{ width: "205px", marginBottom: "20px", marginRight: "-15px" }} className="btn btn-primary" onClick={this.onRefresh}>Submit Now</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </Card>
                                </div>
                                <div className="container">
                                    <p className="sub-topic">Other Items Price List</p>
                                </div>
                                <div className="container">
                                    <Card className="list-card">
                                        <div className="container card-content">
                                            <div className="row" style={{ marginLeft: "5px", marginRight: "5px" }} >
                                                <div className="col-md-1">
                                                    <label className="topic-product"> PID</label>
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="topic-product"> Product Name</label>
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="topic-product"> Size</label>
                                                </div>

                                                <div className="col-md-5">
                                                    <div className="row">
                                                        <div className="col-md-4">
                                                            <label className="topic-product"> Buying Price</label>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <label className="topic-product" style={{ marginLeft: "10px" }}> Selling Price</label>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <label className="topic-product" style={{ marginLeft: "40px" }}> Action</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="container">
                                            {this.state.others.map((data) => {
                                                return (
                                                    <div className="row des-product-row" key={data.pId} style={{ marginLeft: "0px" }}>
                                                        <div className="col-md-1">
                                                            <label className="des-product"> {data.pId}</label>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <label className="des-product" > {data.pName} </label>
                                                        </div>
                                                        <div className="col-md-2">
                                                            <label className="des-product"> {data.size}</label>
                                                        </div>
                                                        <div className="col-md-5">
                                                            <div className="row">
                                                                <div className="col-md-4">
                                                                    <input className="form-control inputValue" defaultValue={data.buyPrice} onBlur={() => this.onBuyPriceBlur(data)} onChange={this.onBuyPriceChange} />
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <input className="form-control inputValue" defaultValue={data.sellPrice} onBlur={() => this.onSellPriceBlur(data)} onChange={this.onSellPriceChange} />
                                                                </div>
                                                                <div className="col-md-4" style={{ textAlign: 'center' }} >
                                                                    <DeleteForeverIcon className="delete-btn" onClick={() => this.deleteProduct(data._id)}>Delete</DeleteForeverIcon>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            )}
                                            <div className="container">
                                                <div className="row" style={{ float: "right" }}>
                                                    <div className="col-md-2">
                                                        <button style={{ width: "205px", marginBottom: "20px", marginRight: "-15px" }} className="btn btn-primary" onClick={this.onRefresh}>Submit Now</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

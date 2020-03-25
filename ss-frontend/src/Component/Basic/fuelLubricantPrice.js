import React, { Component } from 'react'
import '../../Css/Basic/fuelLubricantPrice.css'
import { MDBInput } from "mdbreact";
import { Button } from 'reactstrap';
import Card from '@material-ui/core/Card';
import Sidebar from '../Auth/sidebar'
import { verifyAuth } from '../../utils/authentication';
import { getFromStorage } from '../../utils/storage';
import axios from 'axios'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'

export default class fuelLubricantPrice extends Component {
    constructor(props) {
        super(props);

        this.state = {
            authState: '',
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
            snackbaropen: false,
            snackbarmsg: '',
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

    snackbarClose = (event) => {
        this.setState({ snackbaropen: false })
    }

    onChange = (e) => {
        e.persist = () => { };
        let store = this.state;
        store[e.target.name] = e.target.value
        this.setState(store);
    }

    onChangeType(e) {
        this.setState({
            pType: e.target.value
        })
    }

    componentDidMount = async () => {
        const authState = await verifyAuth();
        this.setState({ authState: authState })
        if (!authState) this.props.history.push('/login');

        axios.get('http://localhost:4000/fuelLubricantPrice/get')
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
        const obj = getFromStorage('auth-token');
        const data = {
            pId: this.state.pId,
            pName: this.state.pName,
            size: this.state.size,
            buyPrice: this.state.buyPrice,
            sellPrice: this.state.sellPrice,
            pType: this.state.pType,
        }

        if (this.state.pId === '') {
            this.setState({
                snackbaropen: true,
                snackbarmsg: "Please Fill the Data ..!"
            })
        }
        else {
            fetch('http://localhost:4000/fuelLubricantPrice/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': obj.token
                },
                body: JSON.stringify(data),
            })
                .then(res => res.json())
                .then(json => {
                    // alert(json.msg)
                    this.setState({
                        snackbaropen: true,
                        snackbarmsg: json.msg
                    })

                    // window.location.reload();
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

        fetch("http://localhost:4000/fuelLubricantPrice/updateProductPrice", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result)
            })
            .catch(error => console.log('error', error));
    }
    async onSellPriceBlur(data) {

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

        fetch("http://localhost:4000/fuelLubricantPrice/updateProductPrice", requestOptions)
            .then(response => response.json())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }

    onRefresh() {
        window.location.reload();
    }

    deleteProduct(data) {
        axios.delete('http://localhost:4000/fuelLubricantPrice/deleteProduct/' + data)
            .then(res => {
                console.log(res);
                this.setState({
                    snackbaropen: true,
                    snackbarmsg: res.data.message
                })
                window.location.reload();
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    snackbaropen: true,
                    snackbarmsg: err
                })
            })
    }

    render() {

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
                                                                <Button className="reg-btn" color="primary" onClick={this.onSubmit}>Add NOw</Button>
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
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <input className="form-control inputValue" defaultValue={data.sellPrice} onBlur={() => this.onSellPriceBlur(data)} onChange={this.onSellPriceChange} />
                                                                </div>
                                                                <div className="col-md-4" >
                                                                    <button style={{ marginTop: "-1px", marginLeft: "-4px" }} className="btn btn-danger delete-btn" onClick={() => this.deleteProduct(data._id)}>Delete</button>
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
                                                                <div className="col-md-4" >
                                                                    <button style={{ marginTop: "-1px", marginLeft: "-4px" }} className="btn btn-danger delete-btn" onClick={() => this.deleteProduct(data._id)}>Delete</button>
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
                                                                <div className="col-md-4" >
                                                                    <button style={{ marginTop: "-1px", marginLeft: "-4px" }} className="btn btn-danger delete-btn" onClick={() => this.deleteProduct(data._id)}>Delete</button>
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
                                                                <div className="col-md-4" >
                                                                    <button style={{ marginTop: "-1px", marginLeft: "-4px" }} className="btn btn-danger delete-btn" onClick={() => this.deleteProduct(data._id)}>Delete</button>
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

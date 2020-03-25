import React, { Component } from 'react'
import Sidebar from '../Auth/sidebar'
import { verifyAuth } from '../../utils/authentication'
import { getFromStorage } from '../../utils/storage';
import axios from 'axios'
import '../../Css/Basic/dailySales.css'
import { MDBInput } from "mdbreact";
import { Button } from 'reactstrap';
import Card from '@material-ui/core/Card';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'

export default class dailyPumperCalculations extends Component {

    constructor(props) {
        super(props);

        this.state = {
            authState: '',
            snackbaropen: false,
            snackbarmsg: '',
            salesPId: '',
            salesQty: '',
            products: [],
            salesPrice: '',
            sales: [],
            salesTotal: 0,
            lockerAmount: '',
            lockerTotal : 0.00,
            
        }

        this.onLocalChange = this.onLocalChange.bind(this)
        this.onLocalSubmit = this.onLocalSubmit.bind(this)
        this.onLockerSubmit = this.onLockerSubmit.bind(this)
        this.onLockerChange = this.onLocalChange.bind(this)
    }
    snackbarClose = (event) => {
        this.setState({ snackbaropen: false })
    }

    componentDidMount = async () => {
        const authState = await verifyAuth();
        this.setState({ authState: authState })
        if (!authState) this.props.history.push('/login');

        axios.get('http://localhost:4000/dailySales/get')
            .then(res => {
                this.setState({
                    sales: res.data.data
                })
                for (var i = 0; i < this.state.sales.length; i++) {
                    this.state.salesTotal = this.state.salesTotal + parseFloat(this.state.sales[i].price)
                }
                this.setState({
                    salesTotal: this.state.salesTotal.toFixed(2)
                })
            })
    }

    onLocalChange(e) {
        e.persist = () => { };
        let store = this.state;
        store[e.target.name] = e.target.value
        this.setState(store);
    }

    onLockerChange(e) {
        this.setState({
            lockerAmount: e.target.value
        })
    }

    async onLockerSubmit() {
        const obj = getFromStorage('auth-token');

        const data = {
            lockerAmount: this.state.lockerAmount
        }

        if (this.state.lockerAmount === '') {
            this.setState({
                snackbaropen: true,
                snackbarmsg: "Please Fill the Amount ..!"
            })
        }
        await fetch('http://localhost:4000/lockerState/add', {
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
                    snackbarmsg: json.msg
                })
            })
            .catch(err => {
                console.log(err)
                this.setState({
                    snackbaropen: true,
                    snackbarmsg: err
                })
            })
    }

    async onLocalSubmit() {
        const obj = getFromStorage('auth-token');

        if (this.state.salesPId === '') {
            this.setState({
                snackbaropen: true,
                snackbarmsg: "Please Fill the product ID ..!"
            })
        }
        await axios.get('http://localhost:4000/fuelLubricantPrice/get')
            .then(res => {
                this.setState({
                    products: res.data.data
                })
                for (var i = 0; i < this.state.products.length; i++) {
                    if (this.state.products[i].pId === this.state.salesPId) {
                        this.state.salesPrice = this.state.products[i].sellPrice * this.state.salesQty

                        const data = {
                            pId: this.state.salesPId,
                            pName: this.state.products[i].pName,
                            size: this.state.products[i].size,
                            qty: this.state.salesQty,
                            price: this.state.salesPrice,
                        }
                        fetch('http://localhost:4000/dailySales/add', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'auth-token': obj.token
                            },
                            body: JSON.stringify(data),
                        })
                            .then(res => res.json())
                            .then(json => {
                                console.log(res);
                                this.setState({
                                    snackbaropen: true,
                                    snackbarmsg: json.msg
                                })
                            })
                            .catch(err => {
                                console.log(err)
                                this.setState({
                                    snackbaropen: true,
                                    snackbarmsg: err
                                })
                            })
                    }
                }
            })
            .catch(err => {
                console.log(err)
            })



    }

    render() {
        return (
            <React.Fragment >
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
                        <div className="col-md-10" style={{ backgroundColor: "#f5f5f5", minHeight: "1000px" }}>

                            <Tabs defaultActiveKey="Sales" id="uncontrolled-tab-example" style={{ marginTop: "20px" }}>

                                <Tab eventKey="Sales" title="Sales">
                                    <div className="first-div">
                                        <div className="row">
                                            <div className="col-md-7">
                                                <p className="first-topic">Sales</p>
                                                <Card className="container">
                                                    <div className="row">
                                                        <div className="col-md-4">
                                                            <MDBInput outline label="Product ID" type="text" name="salesPId" onChange={this.onLocalChange} />
                                                        </div>
                                                        <div className="col-md-4">
                                                            <MDBInput outline label="Quentity" type="text" name="salesQty" onChange={this.onLocalChange} />
                                                        </div>
                                                        <div className="col-md-4" style={{ marginTop: "16px" }}>
                                                            <Button className="sub-btn" color="primary" onClick={this.onLocalSubmit}>Submit</Button>
                                                        </div>
                                                    </div>
                                                </Card>
                                                <Card className="container" style={{ marginTop: "20px" }}>
                                                    <div className="row" style={{ marginTop: "10px" }}>
                                                        <div className="col-md-2">
                                                            <label className="topic-product">PID</label>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <label className="topic-product">Product Name</label>
                                                        </div>
                                                        <div className="col-md-2" style={{ textAlign: "right" }}>
                                                            <label className="topic-product">Size</label>
                                                        </div>
                                                        <div className="col-md-2" style={{ textAlign: "right" }}>
                                                            <label className="topic-product">Qty</label>
                                                        </div>
                                                        <div className="col-md-2" style={{ textAlign: "right" }}>
                                                            <label className="topic-product">Amount</label>

                                                        </div>
                                                    </div>
                                                    {this.state.sales.map((data) => {
                                                        return (
                                                            <div className="row" key={data._id}>
                                                                <div className="col-md-2">
                                                                    <label className="product">{data.pId}</label>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <label className="product">{data.pName}</label>
                                                                </div>
                                                                <div className="col-md-2" style={{ textAlign: "right" }}>
                                                                    <label className="product">{data.size}</label>
                                                                </div>
                                                                <div className="col-md-2" style={{ textAlign: "right" }}>
                                                                    <label className="product">{data.qty}</label>
                                                                </div>
                                                                <div className="col-md-2" style={{ textAlign: "right" }}>
                                                                    <label className="product" >{data.price}</label>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </Card>
                                                <div>
                                                    <div className="row" style={{ marginTop: "10px", marginRight: "0px" }}>
                                                        <div className="col-md-7">
                                                        </div>
                                                        <div className="col-md-2">
                                                            <p className="topic-product">Total : </p>
                                                        </div>
                                                        <div className="col-md-3" style={{ textAlign: "right" }}>
                                                            <p className="topic-product">{this.state.salesTotal}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-5">
                                                <p className="first-topic">Locker State</p>

                                                <div className="row">
                                                    <Card className="container">
                                                        <div className="row">
                                                            <div className="col-md-8">
                                                                <MDBInput outline label="Amount" type="text" name="lockerAmount" onChange={this.onLockerChange} />
                                                            </div>

                                                            <div className="col-md-4" style={{ marginTop: "16px" }}>
                                                                <Button className="sub-btn" color="primary" onClick={this.onLockerSubmit}>Submit</Button>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/******************************************************************************************/}

                                </Tab>



                                <Tab eventKey="profile" title="Profile">

                                </Tab>

                                <Tab eventKey="contact" title="Contact">
                                </Tab>
                            </Tabs>

                        </div>
                    </div>
                </div>

            </React.Fragment >
        )
    }
}

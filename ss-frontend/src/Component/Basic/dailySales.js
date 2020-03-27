import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import axios from 'axios';
import { MDBInput } from "mdbreact";
import React, { Component } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import '../../Css/Basic/dailySales.css';
import { verifyAuth } from '../../utils/authentication';
import { getFromStorage } from '../../utils/storage';
import Sidebar from '../Auth/sidebar';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { Button, Col, Row } from 'react-bootstrap';


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
            locker: [],
            lockerTotal: 0.00,
            morningReading: [],
            endReading: '',
            endReadingArray: [],
            machineNumber: '',
            debitorsData: [],
            todayPetroleumDebit: [],
            todayOtherDebit: [],
            debitProducts: [],
            newDDebitorId: '',
            newDBillNo: '',
            newDInvoiceNo: '',
            newDProductId: '',
            newDPumpId: '',
            newDQty: '',
            newDVehicleNo: '',
        }

        this.onLocalChange = this.onLocalChange.bind(this)
        this.onLocalSubmit = this.onLocalSubmit.bind(this)
        this.onLockerSubmit = this.onLockerSubmit.bind(this)
        this.onLockerChange = this.onLockerChange.bind(this)
        this.lockerDelete = this.lockerDelete.bind(this)
        this.onMachineChange = this.onMachineChange.bind(this)
        this.onMachineSubmit = this.onMachineSubmit.bind(this)
        this.machineDelete = this.machineDelete.bind(this)
        this.onChangeDebitType = this.onChangeDebitType.bind(this)
        this.onDebitChange = this.onDebitChange.bind(this)
        this.onNewDebitSubmit = this.onNewDebitSubmit.bind(this)

    }
    snackbarClose = (event) => {
        this.setState({ snackbaropen: false })
    }

    componentDidMount = async () => {
        const authState = await verifyAuth();
        this.setState({ authState: authState })
        if (!authState) this.props.history.push('/login');

        //get dailty sales data
        await axios.get('http://localhost:4000/dailySales/get')
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

        //get locker data
        await axios.get('http://localhost:4000/lockerState/get')
            .then(res => {
                this.setState({
                    locker: res.data.data
                })
                for (var i = 0; i < this.state.locker.length; i++) {
                    this.state.lockerTotal = this.state.lockerTotal + parseFloat(this.state.locker[i].lockerAmount)
                }
                this.setState({
                    lockerTotal: this.state.lockerTotal
                })
            })

        //get yesterday merter reading
        await axios.get('http://localhost:4000/machinesData/getYesterday')
            .then(res => {
                this.setState({
                    morningReading: res.data.data
                })
            })
        //load today meter reading
        await axios.get('http://localhost:4000/machinesData/getToday')
            .then(res => {
                this.setState({
                    endReadingArray: res.data.data
                })
            })

        //load debidtor id and names
        // await axios.get('http://localhost:4000/')
        //     .then(res => {
        //         console.log(res);
        //         this.setState({
        //             debitorsData: res.data.data
        //         })
        //     })
        //get today petroleum debit data
        await axios.get('http://localhost:4000/debitorsAccount/get')
            .then(res => {
                console.log(res);
                this.setState({
                    todayPetroleumDebit: res.data.data
                })
            })
        //get today other debits
        await axios.get('http://localhost:4000/debitorsAccount/getOther')
            .then(res => {
                console.log(res);
                this.setState({
                    todayOtherDebit: res.data.data
                })
            })
    }

    onMachineChange(e) {
        e.persist = () => { };
        let store = this.state;
        store[e.target.name] = e.target.value
        this.setState(store);
    }
    onDebitChange(e) {
        e.persist = () => { };
        let store = this.state;
        store[e.target.name] = e.target.value
        this.setState(store);
    }
    onChangeDebitType(e) {
        this.setState({
            newDType: e.target.value
        })
    }

    async onNewDebitSubmit() {
        const obj = getFromStorage('auth-token');
        if (this.state.newDDebitorId === '' || this.state.newDProductId === '' || this.state.newDQty === '') {
            this.setState({
                snackbaropen: true,
                snackbarmsg: "Please Fill the Missing Fields ..!"
            })
        }
        await axios.get('http://localhost:4000/fuelLubricantPrice/get')
            .then(res => {
                console.log(res);
                this.setState({
                    products: res.data.data
                })
                var amount = 0;

                for (var i = 0; i < this.state.products.length; i++) {
                    if (this.state.products[i].pId === this.state.newDProductId) {
                        amount = this.state.products[i].sellPrice * this.state.newDQty

                        console.log(this.state.products[i].sellPrice);

                        const data = {
                            debitorId: this.state.newDDebitorId,
                            billNo: this.state.products[i].pName,
                            invoiceNo: this.state.newDInvoiceNo,
                            vehicleNo: this.state.newDVehicleNo,
                            productId: this.state.newDProductId,
                            productName: this.state.products[i].pName,
                            qty: this.state.newDQty,
                            size: this.state.products[i].size,
                            amount: parseFloat(amount).toFixed(2),
                            pumpId: this.state.newDPumpId,
                        }
                        fetch('http://localhost:4000/debitorsAccount/add', {
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
    onMachineSubmit(data) {
        const obj = {
            machineNumber: this.state.machineNumber,
            meterReading: this.state.endReading
        }
        if (this.state.endReading === '') {
            this.setState({
                snackbaropen: true,
                snackbarmsg: "Please Fill the Amount ..!"
            })
        }
        fetch('http://localhost:4000/machinesData/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj),
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
    machineDelete(data) {
        axios.delete('http://localhost:4000/machinesData/delete/' + data)
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

    lockerDelete(data) {
        axios.delete('http://localhost:4000/lockerState/delete/' + data)
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
                            <div className="container">

                                <Tabs defaultActiveKey="debit" id="uncontrolled-tab-example" style={{ marginTop: "20px" }}>

                                    <Tab eventKey="sales" title="Sales Management">
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
                                                            <div className="col-md-8">
                                                            </div>
                                                            <div className="col-md-2" style={{ textAlign: "right" }}>
                                                                <p className="topic-product">Total : </p>
                                                            </div>
                                                            <div className="col-md-2" style={{ textAlign: "right" }}>
                                                                <p className="topic-product">{this.state.salesTotal}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-md-5">
                                                    <p className="first-topic">Locker State</p>

                                                    <div className="row" style={{ marginBottom: "30px" }}>
                                                        <Card className="container">
                                                            <div className="row">
                                                                <div className="col-md-8">
                                                                    <MDBInput outline label="Amount" type="text" name="lockerAmount" onChange={this.onLockerChange} />
                                                                </div>

                                                                <div className="col-md-4" style={{ marginTop: "16px" }}>
                                                                    <Button className="sub-btn" color="primary" onClick={this.onLockerSubmit}>Submit</Button>
                                                                </div>
                                                            </div>

                                                            <div className="row" >
                                                                <div className="col-md-7">
                                                                    <p className="topic-product">Time</p>
                                                                </div>
                                                                <div className="col-md-3" >
                                                                    <p className="topic-product" >Amount</p>
                                                                </div>
                                                                <div className="col-md-2">
                                                                    <p className="topic-product">Action</p>
                                                                </div>
                                                            </div>

                                                            {this.state.locker.map((data) => {
                                                                return (
                                                                    <div className="row" key={data._id}>
                                                                        <div className="col-md-5">
                                                                            <p className="product">{data.time}</p>
                                                                        </div>
                                                                        <div className="col-md-5" style={{ textAlign: "right" }}>
                                                                            <p className="product">{data.lockerAmount}.00</p>
                                                                        </div>
                                                                        <div className="col-md-2" style={{ textAlign: "center" }}>
                                                                            <DeleteForeverIcon className="del-btn" onClick={() => this.lockerDelete(data._id)} />
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </Card>
                                                    </div>
                                                    <div>
                                                        <div className="row" style={{ marginRight: "0px", marginTop: "-20px" }}>
                                                            <div className="col-md-5">
                                                            </div>
                                                            <div className="col-md-4">
                                                                <p className="topic-product">Locker Balance : </p>
                                                            </div>
                                                            <div className="col-md-3" style={{ textAlign: "right" }}>
                                                                <p className="topic-product">{this.state.lockerTotal}.00</p>
                                                            </div>
                                                        </div>
                                                    </div>


                                                </div>
                                            </div>
                                        </div>
                                        {/******************************************************************************************/}

                                    </Tab>

                                    <Tab eventKey="debit" title="Debit Management">
                                        <div className="container" style={{ marginTop: "20px" }} >
                                            <Row>
                                                <Col xs="8">
                                                    <p className="first-topic">Add Debit</p>
                                                    <Card className="container">
                                                        <div className="row">
                                                            <div className="col-md-6" style={{ marginLeft: "5px" }}>
                                                                <Row>
                                                                    <Col xs="12">
                                                                        <MDBInput outline label="Debitor ID" type="text" name="newDDebitorId" onChange={this.onDebitChange} />
                                                                    </Col>
                                                                </Row>
                                                                <Row style={{ marginTop: "-40px" }}>
                                                                    <Col xs="12">
                                                                        <MDBInput outline label="Bill No." type="text" name="newDBillNo" onChange={this.onDebitChange} />
                                                                    </Col>
                                                                </Row>
                                                                <Row style={{ marginTop: "-40px" }}>
                                                                    <Col xs="12">
                                                                        <MDBInput outline label="Invoice No." type="text" name="newDInvoiceNo" onChange={this.onDebitChange} />
                                                                    </Col>
                                                                </Row>
                                                                <Row style={{ marginTop: "-40px" }}>
                                                                    <Col xs="12">
                                                                        <MDBInput outline label="Vehicle No." type="text" name="newDVehicleNo" onChange={this.onDebitChange} />
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                            <div className="col-md-6" style={{ marginLeft: "-10px" }}>
                                                                <Row>
                                                                    <Col xs="12">
                                                                        <MDBInput outline label="Product ID" type="text" name="newDProductId" onChange={this.onDebitChange} />
                                                                    </Col>
                                                                </Row>
                                                                <Row style={{ marginTop: "-40px" }}>
                                                                    <Col xs="12">

                                                                        <MDBInput outline label="Quentity" type="text" name="newDQty" onChange={this.onDebitChange} />
                                                                    </Col>
                                                                </Row>

                                                                <Row style={{ marginTop: "-40px" }}>
                                                                    <Col xs="12">
                                                                        <MDBInput outline label="Pump ID" type="text" name="newDPumpId" onChange={this.onDebitChange} />
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                            <Button style={{ marginLeft: "21px", marginTop: "-10px ", marginBottom: "20px" }} className="debit-btn" color="primary" onClick={this.onNewDebitSubmit}>Submit</Button>
                                                        </div>
                                                    </Card>

                                                </Col>
                                                <Col xs="4">
                                                    <p className="first-topic">Debitors</p>

                                                    <Card style={{ height: "280px" }}>

                                                    </Card>
                                                </Col>
                                            </Row>


                                        </div>

                                        <div className="container" style={{ marginTop: "20px" }} >
                                            <Card className="container">
                                                <Row style={{ marginTop: "20px" }}>
                                                    <Col xs="1">
                                                        <p className="debitor-tbl-head">Date</p>
                                                    </Col>

                                                    <Col xs="3">

                                                        <p className="debitor-tbl-head">Debitor Name</p>
                                                    </Col>
                                                    <Col xs="1">

                                                        <p className="debitor-tbl-head">Bill No.</p>
                                                    </Col>

                                                    <Col xs="3">
                                                        <p className="debitor-tbl-head">Product Name</p>

                                                    </Col>
                                                    <Col xs="1">
                                                        <p className="debitor-tbl-head">Size</p>

                                                    </Col>
                                                    <Col xs="1">
                                                        <p className="debitor-tbl-head">Quentity</p>

                                                    </Col>
                                                    <Col xs="1">
                                                        <p className="debitor-tbl-head">Amount</p>

                                                    </Col>
                                                    <Col xs="1">
                                                        <p className="debitor-tbl-head">Pump ID</p>

                                                    </Col>

                                                </Row>

                                                <Row style={{ marginTop: "20px" }}>
                                                    <Col xs="1">
                                                        <p className="debitor-tbl-body">Date</p>
                                                    </Col>

                                                    <Col xs="3">

                                                        <p className="debitor-tbl-body">Debitor Name</p>
                                                    </Col>
                                                    <Col xs="1">

                                                        <p className="debitor-tbl-body">Bill No.</p>
                                                    </Col>

                                                    <Col xs="3">
                                                        <p className="debitor-tbl-body">Product Name</p>

                                                    </Col>
                                                    <Col xs="1">
                                                        <p className="debitor-tbl-body">Size</p>

                                                    </Col>
                                                    <Col xs="1">
                                                        <p className="debitor-tbl-body">Quentity</p>

                                                    </Col>
                                                    <Col xs="1">
                                                        <p className="debitor-tbl-body">Amount</p>

                                                    </Col>
                                                    <Col xs="1">
                                                        <p className="debitor-tbl-body">Pump ID</p>

                                                    </Col>

                                                </Row>
                                            </Card>
                                        </div>
                                    </Tab>

                                    <Tab eventKey="pumps" title="Pumps Management">
                                        <div className="row" style={{ marginTop: "20px" }}>
                                            <div className="col-md-6">
                                                <div className="container">

                                                    <p className="first-topic">Last Day Meter Reading</p>
                                                    <div className="row" style={{ marginBottom: "30px" }}>
                                                        <Card className="container">
                                                            <div className="row" style={{ marginTop: "10px" }}>
                                                                <div className="col-md-6">
                                                                    <p className="topic-product">Pump ID</p>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <p className="topic-product" style={{ textAlign: "center" }}>Meter Reading</p>
                                                                </div>

                                                            </div>

                                                            {this.state.morningReading.map((data) => {
                                                                return (
                                                                    <div className="row" key={data._id}>
                                                                        <div className="col-md-6">
                                                                            <p className="product">{data.machineNumber}</p>
                                                                        </div>
                                                                        <div className="col-md-6" style={{ textAlign: "right" }}>
                                                                            <p className="product">{data.meterReading}</p>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </Card>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="col-md-6">
                                                <div className="container" >

                                                    <p className="first-topic">New Meter Readings</p>
                                                    <div className="row" style={{ marginBottom: "30px" }}>
                                                        <Card className="container">
                                                            <div className="row">
                                                                <div className="col-md-4">
                                                                    <MDBInput outline label="Machine ID" type="text" name="machineNumber" onChange={this.onMachineChange} />
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <MDBInput outline label="End Reading" type="text" name="endReading" onChange={this.onMachineChange} />
                                                                </div>
                                                                <div className="col-md-4" style={{ marginTop: "16px" }}>
                                                                    <Button className="sub-btn" color="primary" onClick={this.onMachineSubmit}>Submit</Button>
                                                                </div>
                                                            </div>

                                                            <div className="row" >
                                                                <div className="col-md-5">
                                                                    <p className="topic-product">Pump ID</p>
                                                                </div>
                                                                <div className="col-md-5" >
                                                                    <p className="topic-product" >Meter Reading</p>
                                                                </div>
                                                                <div className="col-md-2">
                                                                    <p className="topic-product">Action</p>
                                                                </div>
                                                            </div>

                                                            {this.state.endReadingArray.map((data) => {
                                                                return (
                                                                    <div className="row" key={data._id}>
                                                                        <div className="col-md-5">
                                                                            <p className="product">{data.machineNumber}</p>
                                                                        </div>
                                                                        <div className="col-md-5" style={{ textAlign: "right" }}>
                                                                            <p className="product">{data.meterReading}</p>
                                                                        </div>
                                                                        <div className="col-md-2" style={{ textAlign: "center" }}>
                                                                            <DeleteForeverIcon className="del-btn" onClick={() => this.machineDelete(data._id)} />
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </Card>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                    </Tab>
                                </Tabs>
                            </div>

                        </div>
                    </div>
                </div>

            </React.Fragment >
        )
    }
}

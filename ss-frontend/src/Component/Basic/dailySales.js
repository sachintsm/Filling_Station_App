import Card from '@material-ui/core/Card';
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
import Snackpop from "../Auth/Snackpop";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'

const backend_URI = require('../Auth/Backend_URI')

class meterBlock {
    constructor(pumpId, fuelType, units, amount) {
        this.pumpId = pumpId;
        this.fuelType = fuelType;
        this.units = units;
        this.amount = amount;
    }
}
export default class dailyPumperCalculations extends Component {

    constructor(props) {
        super(props);

        this.state = {
            authState: '',

            snackbaropen: false,
            snackbarmsg: '',
            snackbarcolor: '',

            finalBalance: '',
            yesFinalLocker: '',
            todayFinalBalance: 0,
            todayDiffrence: '',

            salesPId: '',
            salesQty: '',
            salesPrice: '',
            lockerTotal: 0.00,
            salesTotal: 0,
            endReading: '',
            machineNumber: '',

            products: [],
            sales: [],
            locker: [],
            debitorsData: [],
            endReadingArray: [],
            morningReading: [],
            todayPetroleumDebit: [],
            todayOtherDebit: [],
            debitProducts: [],

            newDebits: {
                newDDebitorId: '',
                newDBillNo: '',
                newDInvoiceNo: '',
                newDProductId: '',
                newDPumpId: '',
                newDQty: '',
                newDVehicleNo: '',
                newDOname: '',
                newDOamount: '',
            },
            newCredits: {
                newCDebitorId: '',
                newCInvoiceNo: '',
                newCChequeNo: '',
                newCAmount: '',
                newCOname: '',
                newCOamount: '',
            },
            totals: {
                lockerAmount: '',
                otherDebit: '',
                otherCredit: '',
                mainDebit: '',
                mainCredit: '',
            },
            registeredMachines: [],
            getFuelUnitPrice: [],
            meterBlock: [],
            fuelbtn: false,
            fueldiv: false,

            todaySubTotal: 0.00,
            saleDiv: false
        }

        this.onLocalChange = this.onLocalChange.bind(this)
        this.onLocalSubmit = this.onLocalSubmit.bind(this)
        this.onLockerSubmit = this.onLockerSubmit.bind(this)
        this.onLockerChange = this.onLockerChange.bind(this)
        this.lockerDelete = this.lockerDelete.bind(this)
        this.onMachineChange = this.onMachineChange.bind(this)
        this.onMachineSubmit = this.onMachineSubmit.bind(this)
        this.machineDelete = this.machineDelete.bind(this)
        this.onDebitChange = this.onDebitChange.bind(this)
        this.onNewDebitSubmit = this.onNewDebitSubmit.bind(this)
        this.deleteDebit = this.deleteDebit.bind(this)
        this.onNewOtherDebitSubmit = this.onNewOtherDebitSubmit.bind(this)
        this.onNewCreditSubmit = this.onNewCreditSubmit.bind(this)
        this.onNewOtherCeditSubmit = this.onNewOtherCeditSubmit.bind(this)
        this.onfinalBalance = this.onfinalBalance.bind(this)
        this.onfinalBalanceSubmit = this.onfinalBalanceSubmit.bind(this)
        this.calculateTotal = this.calculateTotal.bind(this)
        this.calculateWholeSale = this.calculateWholeSale.bind(this)
        this.todaySubmit = this.todaySubmit.bind(this)
    }

    closeAlert = () => {
        this.setState({ snackbaropen: false });
    };

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
    onfinalBalance(e) {
        this.setState({
            finalBalance: e.target.value
        })
    }

    //? add new daily sale btn function
    async onLocalSubmit() {
        console.log("sbmit")
        const obj = getFromStorage('auth-token');

        if (this.state.salesPId === '' || this.state.salesQty === '') {
            this.setState({
                snackbaropen: true,
                snackbarmsg: 'Please enter required fields..!',
                snackbarcolor: 'error'
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
                            await axios.get(backend_URI.url + '/fuelLubricantPrice/get')
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
                                            fetch(backend_URI.url + '/dailySales/add', {
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
                                                    window.location.reload()
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


                            const stkData = {
                                pId: this.state.salesPId,
                                qty: this.state.salesQty,
                            }
                            await fetch(backend_URI.url + '/fuelLubricantPrice/salesUpdate', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'auth-token': obj.token
                                },
                                body: JSON.stringify(stkData),
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
                    }
                    , {
                        label: 'No',
                        onClick: () => {

                        }
                    }
                ]
            })
        }


    }

    // ?add new amount to locker 
    async onLockerSubmit() {
        const obj = getFromStorage('auth-token');

        const data = {
            lockerAmount: this.state.lockerAmount
        }

        if (this.state.lockerAmount === '' || this.state.lockerAmount === undefined) {
            this.setState({
                snackbaropen: true,
                snackbarmsg: "Please Fill the Amount ..!",
                snackbarcolor: 'error'
            })
        }
        else {

            confirmAlert({
                title: 'Confirm to submit',
                message: 'Are you sure to do this?',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: async () => {
                            await fetch(backend_URI.url + '/lockerState/add', {
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
                                    window.location.reload()
                                })
                                .catch(err => {
                                    console.log(err)
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
    }

    //?delete locker item
    lockerDelete(data) {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {

                        axios.delete(backend_URI.url + '/lockerState/delete/' + data)
                            .then(res => {
                                console.log(res);
                                this.setState({
                                    snackbaropen: true,
                                    snackbarmsg: res.data.message,
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

    //? add new dail debit
    onNewDebitSubmit() {
        const obj = getFromStorage('auth-token');
        if (this.state.newDDebitorId === '' || this.state.newDProductId === '' || this.state.newDQty === '' || this.state.newDQty === '' || this.state.newDDebitorId === undefined || this.state.newDProductId === undefined || this.state.newDQty === undefined) {
            this.setState({
                snackbaropen: true,
                snackbarmsg: "Please Fill the Missing Fields ..!",
                snackbarcolor: 'error'
            })
        }
        else {
            confirmAlert({
                title: 'Confirm to submit?',
                message: 'Are you sure to do this?',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: async () => {
                            await axios.get(backend_URI.url + '/debtors/checkId/' + this.state.newDDebitorId)
                                .then(async res => {
                                    if (res.data.state === false) {
                                        this.setState({
                                            snackbaropen: true,
                                            snackbarmsg: res.data.msg,
                                            snackbarcolor: 'error'
                                        })
                                    }
                                    else {
                                        console.log("hi")
                                        await axios.get(backend_URI.url + '/fuelLubricantPrice/get')
                                            .then(res => {
                                                console.log(res)
                                                this.setState({
                                                    products: res.data.data
                                                })
                                                var amount = 0;

                                                for (var i = 0; i < this.state.products.length; i++) {
                                                    if (this.state.products[i].pId === this.state.newDProductId) {
                                                        amount = this.state.products[i].sellPrice * this.state.newDQty

                                                        const data = {
                                                            debitorId: this.state.newDDebitorId,
                                                            billNo: this.state.newDBillNo,
                                                            invoiceNo: this.state.newDInvoiceNo,
                                                            vehicleNo: this.state.newDVehicleNo,
                                                            productId: this.state.newDProductId,
                                                            productName: this.state.products[i].pName,
                                                            qty: this.state.newDQty,
                                                            size: this.state.products[i].size,
                                                            amount: parseFloat(amount).toFixed(2),
                                                            pumpId: this.state.newDPumpId,
                                                        }
                                                        fetch(backend_URI.url + '/debitorsAccount/add', {
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
                                                            })
                                                            .catch(err => {
                                                                console.log(err)
                                                                this.setState({
                                                                    snackbaropen: true,
                                                                    snackbarmsg: err,
                                                                    snackbarcolor: 'error'
                                                                })
                                                            })
                                                    }
                                                }
                                            })


                                        const stkData = {
                                            pId: this.state.newDProductId,
                                            qty: this.state.newDQty,
                                        }
                                        await fetch(backend_URI.url + '/fuelLubricantPrice/salesUpdate', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'auth-token': obj.token
                                            },
                                            body: JSON.stringify(stkData),
                                        })
                                            .then(res => res.json())
                                            .then(json => {
                                                if (json.state) {
                                                    this.setState({
                                                        snackbaropen: true,
                                                        snackbarmsg: json.msg,
                                                        snackbarcolor: 'success'
                                                    })
                                                    window.location.reload()
                                                }
                                                else {
                                                    this.setState({
                                                        snackbaropen: true,
                                                        snackbarmsg: json.msg,
                                                        snackbarcolor: 'error'
                                                    })
                                                }

                                            })
                                            .catch(err => {
                                                console.log(err)
                                                this.setState({
                                                    snackbaropen: true,
                                                    snackbarmsg: err,
                                                    snackbarcolor: 'error'
                                                })
                                            })
                                    }
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

    //? add new other debit
    onNewOtherDebitSubmit() {
        const obj = getFromStorage('auth-token');
        if (this.state.newDOname === '' || this.state.newDOamount === '' || this.state.newDOname === undefined || this.state.newDOamount === undefined) {
            this.setState({
                snackbaropen: true,
                snackbarmsg: "Please Fill the Missing Fields ..!",
                snackbarcolor: 'error',
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

                            const data = {
                                newDOname: this.state.newDOname,
                                newDOamount: parseFloat(this.state.newDOamount).toFixed(2),
                            }
                            fetch(backend_URI.url + '/debitorsAccount/addOther', {
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
                                    window.location.reload()

                                })
                                .catch(err => {
                                    console.log(err)
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
    }

    //?add new credit 
    onNewCreditSubmit() {
        const obj = getFromStorage('auth-token');
        if (this.state.newCDebitorId === '' || this.state.newCAmount === '' || this.state.newCDebitorId === undefined || this.state.newCAmount === undefined) {
            this.setState({
                snackbaropen: true,
                snackbarmsg: "Please Fill the Missing Fields ..!",
                snackbarcolor: 'error'
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
                            await axios.get(backend_URI.url + '/debtors/checkId/' + this.state.newCDebitorId)
                                .then(async res => {
                                    if (res.data.state === false) {
                                        this.setState({
                                            snackbaropen: true,
                                            snackbarmsg: res.data.msg,
                                            snackbarcolor: 'error'
                                        })
                                    }
                                    else {

                                        const data = {
                                            debitorId: this.state.newCDebitorId,
                                            chequeNo: this.state.newCChequeNo,
                                            creditAmount: parseFloat(this.state.newCAmount).toFixed(2),
                                        }
                                        fetch(backend_URI.url + '/debitorsAccount/addCredit', {
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
                                                window.location.reload()
                                            })
                                            .catch(err => {
                                                console.log(err)
                                                this.setState({
                                                    snackbaropen: true,
                                                    snackbarmsg: err,
                                                    snackbarcolor: 'error'
                                                })
                                            })

                                    }
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

    //? add new other credit
    onNewOtherCeditSubmit() {
        const obj = getFromStorage('auth-token');
        if (this.state.newCOname === '' || this.state.newCOamount === '' || this.state.newCOname === undefined || this.state.newCOamount === undefined) {
            this.setState({
                snackbaropen: true,
                snackbarmsg: "Please Fill the Missing Fields ..!",
                snackbarcolor: 'error'
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
                            const data = {
                                newCOname: this.state.newCOname,
                                newCOamount: parseFloat(this.state.newCOamount).toFixed(2),
                            }
                            fetch(backend_URI.url + '/debitorsAccount/addOtherCredit', {
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
                                    window.location.reload()

                                })
                                .catch(err => {
                                    console.log(err)
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

    }

    //!delete debit items
    deleteDebit(data) {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {

                        axios.delete(backend_URI.url + '/debitorsAccount/delete/' + data)
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
                },
                {
                    label: 'No',
                    onClick: () => {

                    }
                }
            ]
        })
    }

    //? add new meter reading
    onMachineSubmit(data) {
        const obj = {
            machineNumber: this.state.machineNumber,
            meterReading: this.state.endReading
        }
        if (this.state.endReading === '' || this.state.machineNumber === '' || this.state.endReading === undefined || this.state.machineNumber === undefined) {
            this.setState({
                snackbaropen: true,
                snackbarmsg: "Please Fill the Amount ..!",
                snackbarcolor: 'error'
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

                            await axios.get(backend_URI.url + '/pumpsRegistration/checkId/' + this.state.machineNumber)
                                .then(async res => {
                                    if (res.data.state === false) {
                                        this.setState({
                                            snackbaropen: true,
                                            snackbarmsg: res.data.msg,
                                            snackbarcolor: 'error'
                                        })
                                    }
                                    else {
                                        await fetch(backend_URI.url + '/machinesData/add', {
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
                                                    snackbarmsg: json.msg,
                                                    snackbarcolor: 'success'
                                                })
                                                window.location.reload()

                                            })
                                            .catch(err => {
                                                console.log(err)
                                                this.setState({
                                                    snackbaropen: true,
                                                    snackbarmsg: err,
                                                    snackbarcolor: 'error'
                                                })
                                            })
                                    }
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
    //! delete meter reading
    machineDelete(data) {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        axios.delete(backend_URI.url + '/machinesData/delete/' + data)
                            .then(res => {
                                console.log(res);
                                this.setState({
                                    snackbaropen: true,
                                    snackbarmsg: res.data.message,
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

    onfinalBalanceSubmit() {
        const obj = getFromStorage('auth-token');

        if (this.state.finalBalance === '') {
            this.setState({
                snackbaropen: true,
                snackbarmsg: "Please Fill the Missing Fields ..!",
                snackbarcolor: 'error'
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


                            const data = {
                                amount: this.state.finalBalance,
                            }
                            fetch(backend_URI.url + '/finalLocker/add', {
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
                                    window.location.reload()
                                })
                                .catch(err => {
                                    console.log(err)
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
    }

    componentDidMount = async () => {
        const authState = await verifyAuth();
        this.setState({ authState: authState })
        if (!authState) this.props.history.push('/login');

        //get dailty sales data
        await axios.get(backend_URI.url + '/dailySales/get')
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
        await axios.get(backend_URI.url + '/lockerState/get')
            .then(res => {
                this.setState({
                    locker: res.data.data
                })
                for (var i = 0; i < this.state.locker.length; i++) {
                    this.state.lockerTotal = this.state.lockerTotal + parseFloat(this.state.locker[i].lockerAmount)
                }
                this.setState({
                    lockerTotal: parseFloat(this.state.lockerTotal).toFixed(2)
                })
            })

        //get yersterday final locker amount
        await axios.get(backend_URI.url + '/finalLocker/yesterday')
            .then(res => {
                if (res.data.data[0] != null) {
                    this.setState({
                        yesFinalLocker: res.data.data[0].amount
                    })
                }
                else {
                    this.setState({
                        yesFinalLocker: 0.00
                    })
                }
            })

        //get yersterday final locker amount
        await axios.get(backend_URI.url + '/finalLocker/today')
            .then(res => {

                if (res.data.data[0] != null) {
                    this.setState({
                        todayFinalBalance: res.data.data[0].amount,
                    })
                }
            })

        await this.setState({
            todayDiffrence: (this.state.todayFinalBalance - this.state.yesFinalLocker).toFixed(2)
        })

        //get yesterday merter reading
        await axios.get(backend_URI.url + '/machinesData/getYesterday')
            .then(res => {
                this.setState({
                    morningReading: res.data.data
                })
            })
        //load today meter reading
        await axios.get(backend_URI.url + '/machinesData/getToday')
            .then(res => {
                this.setState({
                    endReadingArray: res.data.data
                })
            })

        // load debidtor id and names
        await axios.get(backend_URI.url + '/debtors/getNameId')
            .then(res => {
                this.setState({
                    debitorsData: res.data.data
                })
            })

        //get today petroleum debit data
        await axios.get(backend_URI.url + '/debitorsAccount/get')
            .then(res => {
                this.setState({
                    todayPetroleumDebit: res.data.data
                })
                var tot1 = 0;
                var tot2 = 0;
                for (var i = 0; i < this.state.todayPetroleumDebit.length; i++) {
                    if (this.state.todayPetroleumDebit[i].debitAmount != null) {
                        tot1 = tot1 + parseFloat(this.state.todayPetroleumDebit[i].debitAmount)
                    }
                }
                for (var j = 0; j < this.state.todayPetroleumDebit.length; j++) {
                    if (this.state.todayPetroleumDebit[j].creditAmount != null) {
                        tot2 = tot2 + parseFloat(this.state.todayPetroleumDebit[j].creditAmount)
                    }
                }
                this.setState({
                    mainDebit: tot1.toFixed(2),
                    mainCredit: tot2.toFixed(2)
                })
            })
        //get today other debits
        await axios.get(backend_URI.url + '/debitorsAccount/getOther')
            .then(res => {
                this.setState({
                    todayOtherDebit: res.data.data
                })
                var tot1 = 0;
                var tot2 = 0;
                for (var i = 0; i < this.state.todayOtherDebit.length; i++) {
                    if (this.state.todayOtherDebit[i].debitAmount != null) {
                        tot1 = tot1 + parseFloat(this.state.todayOtherDebit[i].debitAmount)
                    }
                }
                for (var j = 0; j < this.state.todayOtherDebit.length; j++) {
                    if (this.state.todayOtherDebit[j].creditAmount != null) {
                        tot2 = tot2 + parseFloat(this.state.todayOtherDebit[j].creditAmount)
                    }
                }
                this.setState({
                    otherDebit: tot1.toFixed(2),
                    otherCredit: tot2.toFixed(2)
                })

            })

        this.setState({
            fuelbtn: true,
        })

    }

    deleteTodayFinalLocker() {

        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        axios.delete(backend_URI.url + '/finalLocker/delete')
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


    calculateTotal = async () => {
        this.setState({
            meterBlock: [],
        })
        await axios.get(backend_URI.url + '/pumpsRegistration/get')
            .then(res => {
                // console.log(res.data.data);

                this.setState({
                    registeredMachines: res.data.data
                })
            })

        await axios.get(backend_URI.url + '/fuelLubricantPrice/getFuelPrice')
            .then(res => {
                // console.log(res.data.data);

                this.setState({
                    getFuelUnitPrice: res.data.data
                })
            })
        var fuelTotal = 0;
        for (var i = 0; i < this.state.registeredMachines.length; i++) {
            for (var j = 0; j < this.state.getFuelUnitPrice.length; j++) {
                for (var k = 0; k < this.state.morningReading.length; k++) {
                    for (var l = 0; l < this.state.endReadingArray.length; l++) {
                        if (this.state.registeredMachines[i].productId === this.state.getFuelUnitPrice[j].pId
                            && this.state.registeredMachines[i].machineNumber === this.state.morningReading[k].machineNumber
                            && this.state.endReadingArray[l].machineNumber === this.state.registeredMachines[i].machineNumber
                        ) {
                            var units = (this.state.endReadingArray[l].meterReading - this.state.morningReading[k].meterReading).toFixed(3)
                            var amount = (units * this.state.getFuelUnitPrice[j].sellPrice).toFixed(2)
                            var block = new meterBlock(this.state.registeredMachines[i].machineNumber, this.state.registeredMachines[i].fuelType, units, amount)
                            this.state.meterBlock.push(block)
                            console.log(block.amount);

                            fuelTotal = fuelTotal + parseFloat(amount)
                        }
                    }
                }
            }

        }
        this.setState({
            fueldiv: true,
            fuelSellingTotal: (fuelTotal).toFixed(2)
        })
    }

    calculateWholeSale() {
        let Received = parseFloat(this.state.lockerTotal) + parseFloat(this.state.todayDiffrence) + parseFloat(this.state.otherDebit) + parseFloat(this.state.mainDebit)
        let Given = parseFloat(this.state.salesTotal) + parseFloat(this.state.otherCredit) + parseFloat(this.state.mainCredit) + parseFloat(this.state.fuelSellingTotal)

        let Subtotal = (Received - Given).toFixed(2)

        this.setState({
            saleDiv: true,
            todaySubTotal: Subtotal
        })

    }

    todaySubmit() {
        const obj = getFromStorage('auth-token');

        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {


                        const data = {
                            fuels: this.state.meterBlock,
                            totalProfit : this.state.todaySubTotal
                        }

                        fetch(backend_URI.url + '/dailySales/addDailyFinal', {
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
                                window.location.reload()
                            })
                            .catch(err => {
                                console.log(err)
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

    render() {
        const { fuelbtn, fueldiv, saleDiv } = this.state

        let subTotalList
        if (this.state.todaySubTotal < 0) {
            subTotalList = <div className="row">
                < div className="col-md-6" >
                    <p className="topic-product" style={{ color: 'red' }}> Other Credit Total</p>
                </div >
                <div className="col-md-6">
                    <p className="topic-product" style={{ textAlign: "right", color: 'red' }}>{this.state.todaySubTotal}</p>
                </div>
            </div>
        }
        else {
            subTotalList = <div className="row">
                < div className="col-md-6" >
                    <p className="topic-product" style={{ color: 'green' }}> Other Credit Total</p>
                </div >
                <div className="col-md-6">
                    <p className="topic-product" style={{ textAlign: "right", color: 'green' }}>{this.state.todaySubTotal}</p>
                </div>
            </div>
        }

        return (
            <React.Fragment >
                <div className="container-fluid">
                    <Snackpop
                        msg={this.state.snackbarmsg}
                        color={this.state.snackbarcolor}
                        time={3000}
                        status={this.state.snackbaropen}
                        closeAlert={this.closeAlert}
                    />
                    {/* ************************************************************************************************************************************************************************** */}

                    <div className="row">
                        <div className="col-md-2" style={{ backgroundColor: "#1c2431" }}>
                            <Sidebar />
                        </div>
                        <div className="col-md-10" style={{ backgroundColor: "#f5f5f5", minHeight: "1000px" }}>
                            <div className="container">

                                <Tabs defaultActiveKey="summery" id="uncontrolled-tab-example" style={{ marginTop: "20px" }}>

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
                                                    <p className="first-topic">Safe Locker State</p>

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
                                                                            <p className="product">{data.lockerAmount}</p>
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
                                                                <p className="topic-product">{this.state.lockerTotal}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="first-topic">Locker Final Balance</p>

                                                    <div className="row" style={{ marginBottom: "30px" }}>
                                                        <Card className="container">
                                                            <div className="row">
                                                                <div className="col-md-8">
                                                                    <MDBInput outline label="Amount" type="number" name="finalBalance" onChange={this.onfinalBalance} />
                                                                </div>

                                                                <div className="col-md-4" style={{ marginTop: "16px" }}>
                                                                    <Button className="sub-btn" color="primary" onClick={this.onfinalBalanceSubmit}>Submit</Button>
                                                                </div>
                                                            </div>

                                                            <div className="row" >
                                                                <div className="col-md-7">
                                                                    <p className="topic-product">Yesterday Balance : </p>
                                                                </div>
                                                                <div className="col-md-5" style={{ textAlign: "right" }}>
                                                                    <p className="topic-product">{this.state.yesFinalLocker}</p>
                                                                </div>

                                                            </div>
                                                            <div className="row" >
                                                                <div className="col-md-7">
                                                                    <p className="topic-product">Today Balance : </p>
                                                                </div>
                                                                <div className="col-md-4" style={{ textAlign: "right" }}>
                                                                    <p className="topic-product" >{parseFloat(this.state.todayFinalBalance).toFixed(2)}</p>
                                                                </div>
                                                                <div className="col-md-1" style={{ marginLeft: "-10px" }}>
                                                                    <DeleteForeverIcon className="del-btn" onClick={() => this.deleteTodayFinalLocker()} />
                                                                </div>

                                                            </div>
                                                            <div className="row" >
                                                                <div className="col-md-7">
                                                                    <p className="topic-product">Today Diffrence : </p>
                                                                </div>
                                                                <div className="col-md-5" style={{ textAlign: "right" }}>
                                                                    <p className="topic-product" >{this.state.todayDiffrence}</p>
                                                                </div>
                                                            </div>


                                                        </Card>
                                                    </div>




                                                </div>


                                            </div>
                                        </div>
                                        {/******************************************************************************************/}
                                    </Tab>

                                    <Tab eventKey="debit" title="Debit Management">
                                        <div className="container" style={{ marginTop: "0px" }} >
                                            <Row>
                                                <Col xs="8" >
                                                    <Tabs defaultActiveKey="debit" id="uncontrolled-tab-example" style={{ marginTop: "20px" }}>
                                                        <Tab eventKey="debit" title="Debit ">
                                                            {/* ************************************************************************************************************************************************************************** */}
                                                            <p className="first-topic" style={{ marginTop: "20px" }}>Add Main Debit</p>
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
                                                                                <MDBInput outline label="Machine ID" type="text" name="newDPumpId" onChange={this.onDebitChange} />
                                                                            </Col>
                                                                        </Row>
                                                                    </div>
                                                                    <Button style={{ marginLeft: "21px", marginTop: "-10px ", marginBottom: "20px" }} className="debit-btn" color="primary" onClick={this.onNewDebitSubmit}>Submit</Button>
                                                                </div>
                                                            </Card>
                                                            {/* ***************************************************************************************************************************************** */}
                                                            <p className="first-topic" style={{ marginTop: "20px" }}>Add Other Debit</p>
                                                            <Card className="container">
                                                                <div className="row">
                                                                    <div className="col-md-6" style={{ marginLeft: "5px" }}>
                                                                        <Row>
                                                                            <Col xs="12">
                                                                                <MDBInput outline label="Debitor Name / Reason" type="text" name="newDOname" onChange={this.onDebitChange} />
                                                                            </Col>
                                                                        </Row>
                                                                    </div>
                                                                    <div className="col-md-6" style={{ marginLeft: "-10px" }}>
                                                                        <Row>
                                                                            <Col xs="12">
                                                                                <MDBInput outline label="Amount" type="text" name="newDOamount" onChange={this.onDebitChange} />
                                                                            </Col>
                                                                        </Row>
                                                                    </div>
                                                                    <Button style={{ marginLeft: "21px", marginTop: "-10px ", marginBottom: "20px" }} className="debit-btn" color="primary" onClick={this.onNewOtherDebitSubmit}>Submit</Button>
                                                                </div>
                                                            </Card>
                                                        </Tab>
                                                        {/* ***************************************************************************************************************************************** */}

                                                        <Tab eventKey="credit" title="Credit">
                                                            <p className="first-topic" style={{ marginTop: "20px" }}>Add Main Credit</p>
                                                            <Card className="container">
                                                                <div className="row">
                                                                    <div className="col-md-6" style={{ marginLeft: "5px" }}>
                                                                        <Row>
                                                                            <Col xs="12">
                                                                                <MDBInput outline label="Debitor ID" type="text" name="newCDebitorId" onChange={this.onDebitChange} />
                                                                            </Col>
                                                                        </Row>
                                                                        <Row style={{ marginTop: "-40px" }}>
                                                                            <Col xs="12">
                                                                                <MDBInput outline label="Amount" type="text" name="newCAmount" onChange={this.onDebitChange} />
                                                                            </Col>
                                                                        </Row>
                                                                    </div>
                                                                    <div className="col-md-6" style={{ marginLeft: "-10px" }}>
                                                                        <Row>
                                                                            <Col xs="12">
                                                                                <MDBInput outline label="Cheque No" type="text" name="newCChequeNo" onChange={this.onDebitChange} />
                                                                            </Col>
                                                                        </Row>
                                                                    </div>
                                                                    <Button style={{ marginLeft: "21px", marginTop: "-10px ", marginBottom: "20px" }} className="debit-btn" color="primary" onClick={this.onNewCreditSubmit}>Submit</Button>
                                                                </div>
                                                            </Card>
                                                            {/* ************************************************************************************************************************************************************************** */}

                                                            <p className="first-topic" style={{ marginTop: "20px" }}>Add Other Credit</p>
                                                            <Card className="container">
                                                                <div className="row">
                                                                    <div className="col-md-6" style={{ marginLeft: "5px" }}>
                                                                        <Row>
                                                                            <Col xs="12">
                                                                                <MDBInput outline label="Debitor Name / Reason" type="text" name="newCOname" onChange={this.onDebitChange} />
                                                                            </Col>
                                                                        </Row>
                                                                    </div>
                                                                    <div className="col-md-6" style={{ marginLeft: "-10px" }}>
                                                                        <Row>
                                                                            <Col xs="12">
                                                                                <MDBInput outline label="Amount" type="text" name="newCOamount" onChange={this.onDebitChange} />
                                                                            </Col>
                                                                        </Row>
                                                                    </div>
                                                                    <Button style={{ marginLeft: "21px", marginTop: "-10px ", marginBottom: "20px" }} className="debit-btn" color="primary" onClick={this.onNewOtherCeditSubmit}>Submit</Button>
                                                                </div>
                                                            </Card>
                                                        </Tab>
                                                    </Tabs>
                                                </Col>
                                                {/* ************************************************************************************************************************************************************************** */}

                                                <Col xs="4">
                                                    <p className="first-topic" style={{ marginTop: "20px" }}>Debitors</p>
                                                    <Card style={{ height: "543px" }}>
                                                        <Row className="container" style={{ marginTop: "20px" }}>
                                                            <Col xs="3" style={{ textAlign: "left" }}>
                                                                <p className="debtHead">Cust.ID</p>
                                                            </Col>
                                                            <Col xs="9">
                                                                <p className="debtHead">Customer Name</p>
                                                            </Col>
                                                        </Row>
                                                        {this.state.debitorsData.map((data) => {
                                                            return (
                                                                <Row className="container" style={{ marginTop: "0px" }} key={data.debtorId}>
                                                                    <Col xs="3">
                                                                        <p className="debitor-tbl-body"> {data.debtorId}</p>
                                                                    </Col>
                                                                    <Col xs="9">
                                                                        <p className="debitor-tbl-body"> {data.fullName}</p>
                                                                    </Col>
                                                                </Row>
                                                            )
                                                        })}
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </div>
                                        {/* ************************************************************************************************************************************************************************** */}

                                        <div className="container" style={{ marginTop: "20px", marginBottom: "20px" }} >
                                            <Card className="container">
                                                <Row style={{ marginTop: "20px" }}>
                                                    <Col xs="2">
                                                        <p className="debtHead">Date</p>
                                                    </Col>
                                                    <Col xs="1">
                                                        <p className="debtHead">Debitor ID</p>
                                                    </Col>
                                                    <Col xs="1">
                                                        <p className="debtHead">Bill No.</p>
                                                    </Col>
                                                    <Col xs="2">
                                                        <p className="debtHead">Product Name</p>
                                                    </Col>
                                                    <Col xs="1">
                                                        <p className="debtHead">Size</p>
                                                    </Col>
                                                    <Col xs="1">
                                                        <p className="debtHead">Quentity</p>
                                                    </Col>
                                                    <Col xs="1">
                                                        <p className="debtHead">Debit</p>
                                                    </Col>
                                                    <Col xs="1">
                                                        <p className="debtHead">Credit</p>
                                                    </Col>
                                                    <Col xs="1">
                                                        <p className="debtHead">Pump ID</p>
                                                    </Col>
                                                    <Col xs="1" style={{ textAlign: "left" }}>
                                                        <p className="debtHead">Action</p>
                                                    </Col>
                                                </Row>
                                                {this.state.todayPetroleumDebit.map((data) => {
                                                    return (
                                                        <Row key={data._id}>
                                                            <Col xs="2">
                                                                <p className="debitor-tbl-body">{data.date}</p>
                                                            </Col>
                                                            <Col xs="1">
                                                                <p className="debitor-tbl-body">{data.debitorId}</p>
                                                            </Col>
                                                            <Col xs="1">
                                                                <p className="debitor-tbl-body">{data.billNo}</p>
                                                            </Col>
                                                            <Col xs="2">
                                                                <p className="debitor-tbl-body">{data.productName}</p>
                                                            </Col>
                                                            <Col xs="1">
                                                                <p className="debitor-tbl-body">{data.size}</p>
                                                            </Col>
                                                            <Col xs="1">
                                                                <p className="debitor-tbl-body">{data.qty}</p>
                                                            </Col>
                                                            <Col xs="1" style={{ textAlign: 'right' }}>
                                                                <p className="debitor-tbl-body">{data.debitAmount}</p>
                                                            </Col>
                                                            <Col xs="1" style={{ textAlign: 'right' }}>
                                                                <p className="debitor-tbl-body">{data.creditAmount}</p>
                                                            </Col>
                                                            <Col xs="1">
                                                                <p className="debitor-tbl-body">{data.pumpId}</p>
                                                            </Col>
                                                            <Col xs="1">
                                                                <DeleteForeverIcon className="del-btn" onClick={() => this.deleteDebit(data._id)} />
                                                            </Col>
                                                        </Row>
                                                    )
                                                })}
                                            </Card>
                                            <div style={{ marginTop: "10px" }}>
                                                <Row>
                                                    <Col xs="8">
                                                    </Col>
                                                    <Col xs="1">
                                                        <p className="debitor-tbl-head">{this.state.mainDebit}</p>
                                                    </Col>
                                                    <Col xs="1">
                                                        <p className="debitor-tbl-head">{this.state.mainCredit}</p>
                                                    </Col>
                                                    <Col xs="1">
                                                    </Col>
                                                    <Col xs="1">
                                                    </Col>
                                                </Row>
                                            </div>
                                        </div>
                                        {/* ************************************************************************************************************************************************************************** */}

                                        <div className="container" style={{ marginTop: "20px", marginBottom: "20px" }} >
                                            <Card className="container">
                                                <Row style={{ marginTop: "20px" }}>
                                                    <Col xs="2">
                                                        <p className="debtHead">Date</p>
                                                    </Col>
                                                    <Col xs="5">
                                                        <p className="debtHead">Name/ Reason</p>
                                                    </Col>
                                                    <Col xs="2">
                                                        <p className="debtHead">Debit</p>
                                                    </Col>
                                                    <Col xs="2">
                                                        <p className="debtHead">Credit</p>
                                                    </Col>
                                                    <Col xs="1">
                                                        <p className="debtHead">Action</p>
                                                    </Col>
                                                </Row>
                                                {this.state.todayOtherDebit.map((data) => {
                                                    return (
                                                        <Row key={data._id}>
                                                            <Col xs="2">
                                                                <p className="debitor-tbl-body">{data.date}</p>
                                                            </Col>
                                                            <Col xs="5">
                                                                <p className="debitor-tbl-body">{data.debitorId}</p>
                                                            </Col>
                                                            <Col xs="2" style={{ textAlign: "right" }}>
                                                                <p className="debitor-tbl-body">{data.debitAmount}</p>
                                                            </Col>
                                                            <Col xs="2" style={{ textAlign: "right" }}>
                                                                <p className="debitor-tbl-body">{data.creditAmount}</p>
                                                            </Col>
                                                            <Col xs="1">
                                                                <DeleteForeverIcon className="del-btn" onClick={() => this.deleteDebit(data._id)} />
                                                            </Col>
                                                        </Row>
                                                    )
                                                })}
                                            </Card>
                                            <div>
                                                <Row style={{ marginTop: "10px" }}>
                                                    <Col xs="7">
                                                    </Col>
                                                    <Col xs="2" style={{ textAlign: "right" }}>
                                                        <p className="debtHead">{this.state.otherDebit}</p>
                                                    </Col>
                                                    <Col xs="2" style={{ textAlign: "right" }}>
                                                        <p className="debtHead">{this.state.otherCredit}</p>
                                                    </Col>
                                                    <Col xs="1">
                                                    </Col>
                                                </Row>
                                            </div>
                                        </div>
                                    </Tab>
                                    {/* ************************************************************************************************************************************************************************** */}

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
                                                                        <div className="col-md-5" >
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

                                    <Tab eventKey="summery" title="Today Summery">
                                        <div className="row" style={{ marginTop: "20px" }}>
                                            <div className="col-md-12">
                                                <div className="container">

                                                    <p className="first-topic">Today Summery</p>
                                                    <div className="row" style={{ marginBottom: "30px" }}>
                                                        <Card className="container">
                                                            <div className="row" style={{ marginTop: "10px" }}>
                                                                <div className="col-md-6">
                                                                    <p className="topic-product">Sales Total</p>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <p className="topic-product" style={{ textAlign: "right" }}>{this.state.salesTotal}</p>
                                                                </div>
                                                                <hr style={{ marginTop: "-10px", width: "98%", marginLeft: "10px" }}></hr>
                                                            </div>
                                                            <div className="row" >
                                                                <div className="col-md-6">
                                                                    <p className="topic-product">Locker Safe Total</p>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <p className="topic-product" style={{ textAlign: "right" }}>{this.state.lockerTotal}</p>
                                                                </div>
                                                                <hr style={{ marginTop: "-10px", width: "98%", marginLeft: "10px" }}></hr>

                                                            </div>

                                                            <div className="row" >
                                                                <div className="col-md-6">
                                                                    <p className="topic-product">Locker final Balance</p>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <p className="topic-product" style={{ textAlign: "right" }}>{this.state.todayDiffrence}</p>
                                                                </div>

                                                                <hr style={{ marginTop: "-10px", width: "98%", marginLeft: "10px" }}></hr>

                                                            </div>

                                                            <div className="row" >
                                                                <div className="col-md-6">
                                                                    <p className="topic-product">Product Debits Total</p>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <p className="topic-product" style={{ textAlign: "right" }}>{this.state.mainDebit}</p>
                                                                </div>
                                                                <hr style={{ marginTop: "-10px", width: "98%", marginLeft: "10px" }}></hr>

                                                            </div>

                                                            <div className="row" >
                                                                <div className="col-md-6">
                                                                    <p className="topic-product">Other Debits Total</p>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <p className="topic-product" style={{ textAlign: "right" }}>{this.state.otherDebit}</p>
                                                                </div>
                                                                <hr style={{ marginTop: "-10px", width: "98%", marginLeft: "10px" }}></hr>

                                                            </div>

                                                            <div className="row" >
                                                                <div className="col-md-6">
                                                                    <p className="topic-product">Product Credit Total</p>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <p className="topic-product" style={{ textAlign: "right" }}>{this.state.mainCredit}</p>
                                                                </div>
                                                                <hr style={{ marginTop: "-10px", width: "98%", marginLeft: "10px" }}></hr>
                                                            </div>

                                                            <div className="row" >
                                                                <div className="col-md-6">
                                                                    <p className="topic-product">Other Credit Total</p>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <p className="topic-product" style={{ textAlign: "right" }}>{this.state.otherCredit}</p>
                                                                </div>
                                                                <hr style={{ marginTop: "-10px", width: "98%", marginLeft: "10px" }}></hr>

                                                            </div>
                                                            {fuelbtn && (
                                                                <div style={{ marginBottom: "20px" }}>
                                                                    <Button className="btn btn-info" onClick={this.calculateTotal} >Calculate Fuel Sale</Button>
                                                                </div>
                                                            )}
                                                            {fueldiv && (
                                                                <div>
                                                                    <div className="row" >
                                                                        <div className="col-md-6">
                                                                            <p className="topic-product">Fuel Sales</p>
                                                                        </div>
                                                                    </div>
                                                                    {this.state.meterBlock.map((data => {
                                                                        return (
                                                                            <div className="row" key={data.pumpId}>
                                                                                <div className="col-md-1">
                                                                                </div>
                                                                                <div className="col-md-2">
                                                                                    <p className="">{data.pumpId}</p>
                                                                                </div>
                                                                                <div className="col-md-5">
                                                                                    <p className="">{data.fuelType}</p>
                                                                                </div>
                                                                                <div className="col-md-2">
                                                                                    <p className="">{data.units}</p>
                                                                                </div>
                                                                                <div className="col-md-2">
                                                                                    <p className="" style={{ textAlign: "right" }}>{data.amount}</p>

                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    }))}
                                                                    <hr style={{ marginTop: "-10px", width: "100%", marginLeft: "0px" }}></hr>

                                                                    <div className="row" >
                                                                        <div className="col-md-8">
                                                                        </div>
                                                                        <div className="col-md-2">
                                                                            <p className="topic-product">Total</p>
                                                                        </div>
                                                                        <div className="col-md-2">
                                                                            <p className="topic-product" style={{ textAlign: "right", }}>{this.state.fuelSellingTotal}</p>
                                                                        </div>
                                                                        <hr style={{ marginTop: "-10px", width: "98%", marginLeft: "10px" }}></hr>
                                                                    </div>

                                                                    <div style={{ marginBottom: "20px" }}>
                                                                        <Button className="btn btn-info" onClick={this.calculateWholeSale} >Calculate Whole Today sale</Button>
                                                                    </div>

                                                                </div>
                                                            )}
                                                        </Card>
                                                        {saleDiv && (

                                                            <Card className="container" style={{ marginTop: "20px" }}>
                                                                <div className="container" style={{ marginTop: "20px" }}>
                                                                    {subTotalList}
                                                                </div>
                                                                <div style={{ marginBottom: "20px" }}>
                                                                    <Button className="btn btn-info" onClick={this.todaySubmit} >Submit Now</Button>
                                                                </div>
                                                            </Card>
                                                        )}
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

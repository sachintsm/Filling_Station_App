import React, { Component } from 'react'
import Sidebar from '../Auth/sidebar'
import { verifyAuth } from '../../utils/authentication'
import '../../Css/Basic/dailyPumperManagement.css'
import { MDBInput } from "mdbreact";
import { Row, Col } from 'reactstrap';
import Card from '@material-ui/core/Card';
import axios from 'axios'
import { getFromStorage } from '../../utils/storage';
import Snackpop from "../Auth/Snackpop";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'

const backend_URI = require('../Auth/Backend_URI')

export default class dailyPumperCalculations extends Component {

    constructor(props) {
        super(props);

        this.state = {
            authState: '',

            snackbaropen: false,
            snackbarmsg: '',
            snackbarcolor: '',

            pumpSets: [],
            pumperIds: [],
            amount: '',
            pumperId: '',
            setNumber: '',
            pumpersCash: [],
            userData: [],
            setId: '',
            pumperName: '',
            pumperNameRes: '',
            pumperIdRes: '',
            pumperSetRes: '',
            pumperDateRes: '',
            totAmount: 0.00,
            cashDiv: false,
        }
        this.dataSetSubmit = this.dataSetSubmit.bind(this)
        this.onChangePumper = this.onChangePumper.bind(this)
        this.onChangeSet = this.onChangeSet.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onChangeSetId = this.onChangeSetId.bind(this)
        this.onSetBlur = this.onSetBlur.bind(this)
    }

    closeAlert = () => {
        this.setState({ snackbaropen: false });
    };

    onChangeSetId(e) {
        this.setState({
            setId: e.target.value
        })
    }

    async onSetBlur() {
        // const { cashDiv } = this.state;
        this.setState({
            pumperNameRes: '',
            pumperIdRes: '',
            pumperSetRes: '',
            pumperDateRes: ''
        })
        this.state.pumpersCash = [];
        this.state.totAmount = 0.00
        await axios.get(backend_URI.url + '/pumpersCash/get/' + this.state.setId)
            .then(res => {
                this.setState({
                    pumpersCash: res.data.data
                })
            })

        var tot = 0;
        for (var i = 0; i < this.state.pumpersCash.length; i++) {
            tot = tot + parseFloat(this.state.pumpersCash[i].amount)
        }
        this.setState({ cashDiv: true });
        if (this.state.pumpersCash[0] != null) {
            await axios.get(backend_URI.url + '/users/get/' + this.state.pumpersCash[0].pumperId)
                .then(res => {
                    this.setState({
                        pumperNameRes: res.data.data[0].fullName
                    })
                })
            this.setState({
                pumperNameRes: this.state.pumperNameRes,
                pumperIdRes: this.state.pumpersCash[0].pumperId,
                pumperSetRes: this.state.pumpersCash[0].setNumber,
                pumperDateRes: this.state.pumpersCash[0].date,
                totAmount: tot
            })
        }
    }


    componentDidMount = async () => {
        const authState = await verifyAuth();
        this.setState({ authState: authState })
        if (!authState) this.props.history.push('/login');

        //?get available pump sets
        axios.get(backend_URI.url + '/pumpSetRegistration/get')
            .then(res => {
                this.setState({
                    pumpSets: res.data.data
                })
            })

        //? get active pupmers ids
        axios.get(backend_URI.url + '/users/getPumpers')
            .then(res => {
                this.setState({
                    pumperIds: res.data.data
                })
            })
    }

    onChangePumper(e) {
        this.setState({
            pumperId: e.target.value
        })
    }
    onChangeSet(e) {
        this.setState({
            setNumber: e.target.value
        })
    }
    onChange(e) {
        this.setState({
            amount: e.target.value
        })
    }
    dataSetSubmit() {
        const obj = getFromStorage('auth-token');

        if (this.state.setNumber === '' || this.state.pumperId === '' || this.state.amount === '') {
            this.setState({
                snackbaropen: true,
                snackbarmsg: "Please Fill the Data ..!",
                snackbarcolor: 'error'
            })
        }
        else {
            const data = {
                setNumber: this.state.setNumber,
                pumperId: this.state.pumperId,
                amount: this.state.amount
            }
            confirmAlert({
                title: 'Confirm to submit',
                message: 'Are you sure to do this.',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: async () => {

                            fetch(backend_URI.url + '/pumpersCash/add', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'auth-token': obj.token
                                },
                                body: JSON.stringify(data),
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

    render() {
        const { pumperIds } = this.state;
        const { pumpSets } = this.state;
        const { cashDiv } = this.state;

        let pumpIdList = pumperIds.length > 0
            && pumperIds.map((item, i) => {
                return (
                    <option key={i} value={item.userId}>{item.userId}</option>
                )
            }, this);

        let pumpSetList = pumpSets.length > 0
            && pumpSets.map((item, i) => {
                return (
                    <option key={i} value={item.setNumber}>{item.setNumber}</option>
                )
            }, this)

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
                        <div className="col-md-10" style={{ backgroundColor: "#f5f5f5" }}>
                            <div className="container" style={{ marginTop: "20px" }}>
                                <Card >
                                    <div className="container">
                                        <Row>
                                            <Col xs="3" style={{ marginTop: "24px" }}>
                                                <select className="form-control" onChange={this.onChangeSet}>
                                                    <option >Pump Set</option>
                                                    {pumpSetList}
                                                </select>

                                            </Col>
                                            <Col xs="3" style={{ marginTop: "24px" }}>

                                                <select className="form-control" onChange={this.onChangePumper}>
                                                    <option >Pumper ID</option>
                                                    {pumpIdList}
                                                </select>

                                            </Col>
                                            <Col xs="3">

                                                <MDBInput outline label="Amount" type="text" name="amount" onChange={this.onChange} />
                                            </Col>
                                            <Col xs="3" style={{ marginTop: "17px" }}>
                                                <button className="btn btn-primary sub-btn" onClick={this.dataSetSubmit}>Submit</button>
                                            </Col>
                                        </Row>

                                    </div>
                                </Card>
                            </div>

                            <div className="container" style={{ marginTop: "20px", marginBottom: "20px" }}>
                                <Card >
                                    <div className="container" style={{ padding: "40px", }} >
                                        <Row>
                                            <select className="form-control" onChange={this.onChangeSetId} onClick={this.onSetBlur}>
                                                <option >Pump Set</option>
                                                {pumpSetList}
                                            </select>
                                        </Row>
                                    </div>
                                    {cashDiv && (

                                        <div className="container" style={{ padding: "30px" }}>
                                            <Row>
                                                <Col xs="6">
                                                    <p className="debitor-tbl-name">{this.state.pumperNameRes}</p>
                                                    <p className="debitor-tbl-head">{this.state.pumperIdRes}</p>
                                                    <p className="debitor-tbl-head">{this.state.pumperSetRes}</p>
                                                    <p className="debitor-tbl-head">{this.state.pumperDateRes}</p>
                                                </Col>
                                                <Col xs="6">
                                                    <Row style={{ marginTop: "-20px" }}>
                                                        <Col xs="6" style={{ textAlign: "center", marginLeft: "-20px" }}>
                                                            <p className="debitor-tbl-head">Time</p>
                                                        </Col>
                                                        <Col xs="6" style={{ textAlign: "right", marginLeft: "-20px" }}>
                                                            <p className="debitor-tbl-head">Amount</p>
                                                        </Col>
                                                    </Row>
                                                    <hr style={{ width: "90%", marginLeft: "50px" }}></hr>
                                                    {this.state.pumpersCash.map((data) => {
                                                        return (
                                                            <Row key={data._id}>
                                                                <Col xs="6" style={{ textAlign: "center" }}>
                                                                    <p className="debitor-tbl-body">{data.time}</p>
                                                                </Col>
                                                                <Col xs="6" style={{ textAlign: "right" }}>
                                                                    <p className="debitor-tbl-body">{data.amount}</p>
                                                                </Col>
                                                            </Row>
                                                        )
                                                    })}
                                                </Col>
                                            </Row>
                                            <hr></hr>
                                            <Row>
                                                <Col xs="10" style={{ textAlign: "right" }}>
                                                    <p className="debitor-tbl-head">Total Amount : </p>
                                                </Col>
                                                <Col xs="2" style={{ textAlign: "right", marginLeft: "-20px" }}>
                                                    <p className="debitor-tbl-head">{this.state.totAmount}.00</p>
                                                </Col>
                                            </Row>
                                        </div>
                                    )}
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment >
        )
    }
}

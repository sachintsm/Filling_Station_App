import React, { Component } from 'react'
import Sidebar from '../Auth/sidebar'
import { verifyAuth } from '../../utils/authentication'
import '../../Css/Basic/dailyPumperManagement.css'
import { MDBInput } from "mdbreact";
import { Row, Col } from 'reactstrap';
import Card from '@material-ui/core/Card';
import axios from 'axios'
import { getFromStorage } from '../../utils/storage';
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'

const backend_URI = require('../Auth/Backend_URI')

export default class dailyPumperCalculations extends Component {

    constructor(props) {
        super(props);

        this.state = {
            authState: '',
            snackbaropen: false,
            snackbarmsg: '',
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
            pumperSetRes:'',
            pumperDateRes: ''
        })
        console.log(this.state.setId);
        this.state.pumpersCash = [];
        this.state.totAmount = 0.00
        await axios.get(backend_URI.url  + '/pumpersCash/get/' + this.state.setId)
            .then(res => {
                this.setState({
                    pumpersCash: res.data.data
                })
                console.log(res);
            })

        var tot = 0;
        for (var i = 0; i < this.state.pumpersCash.length; i++) {
            tot = tot + parseFloat(this.state.pumpersCash[i].amount)
        }
        this.setState({ cashDiv: true });
        if (this.state.pumpersCash[0] != null) {
            await axios.get(backend_URI.url  +'/users/get/' + this.state.pumpersCash[0].pumperId)
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

    snackbarClose = (event) => {
        this.setState({ snackbaropen: false })
    }
    componentDidMount = async () => {
        const authState = await verifyAuth();
        this.setState({ authState: authState })
        if (!authState) this.props.history.push('/login');

        axios.get(backend_URI.url  + '/pumpSetRegistration/get')
            .then(res => {
                this.setState({
                    pumpSets: res.data.data
                })
            })

        axios.get(backend_URI.url  + '/users/getPumpers')
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
                snackbarmsg: "Please Fill the Data ..!"
            })
        }
        else {
            const data = {
                setNumber: this.state.setNumber,
                pumperId: this.state.pumperId,
                amount: this.state.amount
            }

            fetch(backend_URI.url  + '/pumpersCash/add', {
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

                    window.location.reload();
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

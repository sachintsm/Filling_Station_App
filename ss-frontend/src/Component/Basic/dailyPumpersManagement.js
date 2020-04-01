import React, { Component } from 'react'
import Sidebar from '../Auth/sidebar'
import { verifyAuth } from '../../utils/authentication'
import '../../Css/Basic/dailyPumperManagement.css'
import { MDBInput } from "mdbreact";
import { Button, Row, Col } from 'reactstrap';
import Card from '@material-ui/core/Card';
import axios from 'axios'
import { getFromStorage } from '../../utils/storage';
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'

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
            setId: '',

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

    onSetBlur() {
        console.log(this.state.setId);

    }

    snackbarClose = (event) => {
        this.setState({ snackbaropen: false })
    }
    componentDidMount = async () => {
        const authState = await verifyAuth();
        this.setState({ authState: authState })
        if (!authState) this.props.history.push('/login');

        axios.get('http://localhost:4000/pumpSetRegistration/get')
            .then(res => {
                this.setState({
                    pumpSets: res.data.data
                })
            })

        axios.get('http://localhost:4000/users/getPumpers')
            .then(res => {
                this.setState({
                    pumperIds: res.data.data
                })
            })

        axios.get('http://localhost:4000/pumpersCash/get/' + this.state.setId)
            .then(res => {
                this.setState({
                    pumpersCash: res.data.data
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

        if (this.state.setNumber === '' || this.state.pumperId === '') {
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

            fetch('http://localhost:4000/pumpersCash/add', {
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

    }

    render() {
        const { pumperIds } = this.state;
        const { pumpSets } = this.state;

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

                            <div className="container" style={{ marginTop: "20px", marginBottom:"20px" }}>
                                <Card >
                                    <div className="container" style={{ padding: "40px", }} >
                                        <Row>
                                            <select className="form-control" onChange={this.onChangeSetId} onClick={this.onSetBlur}>
                                                <option >Pump Set</option>
                                                {pumpSetList}
                                            </select>
                                        </Row>

                                    </div>
                                    <div className="container" style={{ padding: "30px" }}>
                                        <Row>
                                            <Col xs="6">
                                                <p className="debitor-tbl-head">Name</p>
                                                <p className="debitor-tbl-head">PumperID</p>
                                                <p className="debitor-tbl-head">Set Number</p>
                                                <p className="debitor-tbl-head">Date</p>
                                            </Col>
                                            <Col xs="6">
                                                <Row>
                                                    <Col xs="6">
                                                        <p className="debitor-tbl-head">Time</p>
                                                    </Col>
                                                    <Col xs="6">
                                                        <p className="debitor-tbl-head">Time</p>

                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs="6">
                                                        <p className="debitor-tbl-body">Time</p>

                                                    </Col>
                                                    <Col xs="6">
                                                        <p className="debitor-tbl-body">Time</p>

                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>

            </React.Fragment >
        )
    }
}

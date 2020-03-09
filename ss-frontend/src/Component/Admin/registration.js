import React, { Component } from 'react'
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Row, Col } from 'reactstrap';
import '../../Css/Admin/registration.css';

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
];

export default class registration extends Component {

    constructor(props) {
        super(props);
        this.onChangePersonName = this.onChangePersonName.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            person_name: '',
        }
    }
    state = {
        selectedOption: null,
        startDate: new Date()
    };

    handleChangeBirthday = date => {
        this.setState({
            startDate: date
        });
    };

    handleChangeUsertype = selectedOption => {
        this.setState({ selectedOption });
        console.log(`Option selected:`, selectedOption);
    };
    onChangePersonName(e) {
        this.setState({
            person_name: e.target.value
        });
    }

    onSubmit() {

    }

    render() {
        const { selectedOption } = this.state;

        return (
            <React.Fragment>

                <Row>

                    <h3>User Registration</h3>
                </Row>

                <Card className="card">
                    <CardContent>
                        <div style={{ width: "90%", margin: 'auto' }}>

                            <form onSubmit="onSubmit">
                                <div className="form-group">
                                    <label>Full Name : </label>
                                    <input type="text" className="form-control" value={this.state.person_name}
                                        onChange={this.onChangePersonName}></input>
                                </div>

                                <Row>

                                    <Col>
                                        <div className="form-group">
                                            <label>User ID : </label>
                                            <input type="text" className="form-control" value={this.state.person_name}
                                                onChange={this.onChangePersonName}></input>
                                        </div>

                                    </Col>
                                    <Col>
                                        <div className="form-group">
                                            <label>Usertype : </label>
                                            <Select
                                                value={selectedOption}
                                                onChange={this.handleChangeUsertype}
                                                options={options}
                                            />
                                        </div>
                                    </Col>
                                    <Col>
                                        <label>Birthday : </label>
                                        <div className="form-group sex">
                                            <DatePicker

                                                className="form-control"
                                                selected={this.state.startDate}
                                                onChange={this.handleChangeBirthday}
                                            />
                                        </div>

                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <div className="form-group">
                                            <label>E-mail : </label>
                                            <input type="text" className="form-control" value={this.state.person_name}
                                                onChange={this.onChangePersonName}></input>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className="form-group">
                                            <label>NIC Number : </label>
                                            <input type="text" className="form-control" value={this.state.person_name}
                                                onChange={this.onChangePersonName}></input>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <div className="form-group">
                                            <label>Mobile Number 1 : </label>
                                            <input type="text" className="form-control" value={this.state.person_name}
                                                onChange={this.onChangePersonName}></input>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className="form-group">
                                            <label>Mobile Number 2 : </label>
                                            <input type="text" className="form-control" value={this.state.person_name}
                                                onChange={this.onChangePersonName}></input>
                                        </div>
                                    </Col>

                                </Row>
                                <Row>
                                    <Col>
                                        <div className="form-group">
                                            <label>EPF Number : </label>
                                            <input type="text" className="form-control" value={this.state.person_name}
                                                onChange={this.onChangePersonName}></input>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className="form-group">
                                            <label>ETF Number : </label>
                                            <input type="text" className="form-control" value={this.state.person_name}
                                                onChange={this.onChangePersonName}></input>
                                        </div>
                                    </Col>
                                </Row>
                                <div className="form-group">
                                    <label>Address : </label>
                                    <textarea type="text" className="form-control" value={this.state.person_name}
                                        onChange={this.onChangePersonName}></textarea>
                                </div>
                                <div className="form-group">
                                    <label>Others : </label>
                                    <textarea type="text" className="form-control" value={this.state.person_name}
                                        onChange={this.onChangePersonName}></textarea>
                                </div>
                            </form>
                        </div>
                    </CardContent>
                </Card>
            </React.Fragment>
        )
    }
}

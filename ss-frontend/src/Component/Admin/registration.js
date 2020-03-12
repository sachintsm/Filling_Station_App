import React, { Component } from 'react'
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Row, Col } from 'reactstrap';
import '../../Css/Admin/registration.css';

const options = [
    { value: 'Administartor', label: 'Administrator' },
    { value: 'Manager', label: 'Manager' },
    { value: 'Pumper', label: 'Pumper' },
];

export default class registration extends Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
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

    handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        console.log(data)
        fetch('http://localhost:4000/users/register', {
            method: 'POST',
            body: data,
        });
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

                            <form onSubmit={this.handleSubmit}>
                                <div className="form-group">
                                    <label>Full Name : </label>
                                    <input id="fullName" name="fullName" type="text" className="form-control" value={this.state.person_name}></input>
                                </div>
                                <div className="form-group">
                                    <label>Password : </label>
                                    <input type="text" className="form-control" value={this.state.person_name}></input>
                                </div>

                                <Row>
                                    <Col>
                                        <div className="form-group">
                                            <label>User ID : </label>
                                            <input type="text" className="form-control" value={this.state.person_name}></input>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className="form-group">
                                            <label>Usertype : </label>
                                            <Select
                                                value={selectedOption}
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
                                            />
                                        </div>

                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <div className="form-group">
                                            <label>E-mail : </label>
                                            <input type="text" className="form-control" value={this.state.person_name}></input>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className="form-group">
                                            <label>NIC Number : </label>
                                            <input type="text" className="form-control" value={this.state.person_name}></input>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <div className="form-group">
                                            <label>Mobile Number 1 : </label>
                                            <input type="text" className="form-control" value={this.state.person_name}></input>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className="form-group">
                                            <label>Mobile Number 2 : </label>
                                            <input type="text" className="form-control" value={this.state.person_name}></input>
                                        </div>
                                    </Col>

                                </Row>
                                <Row>
                                    <Col>
                                        <div className="form-group">
                                            <label>EPF Number : </label>
                                            <input type="text" className="form-control" value={this.state.person_name}></input>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className="form-group">
                                            <label>ETF Number : </label>
                                            <input type="text" className="form-control" value={this.state.person_name}></input>
                                        </div>
                                    </Col>
                                </Row>
                                <div className="form-group">
                                    <label>Address : </label>
                                    <textarea type="text" className="form-control" value={this.state.person_name}></textarea>
                                </div>
                                <div className="form-group">
                                    <label>Others : </label>
                                    <textarea type="text" className="form-control" value={this.state.person_name}></textarea>
                                </div>
                                <div className="form-group">
                                    <button className="btn btn-info my-4 btn-block " type="submit">Register Now</button>
                                </div>
                            </form>
                        </div>
                    </CardContent>
                </Card>
            </React.Fragment>
        )
    }
}

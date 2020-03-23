import React, { Component } from 'react'
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Row, Col } from 'reactstrap';
import '../../Css/Admin/registration.css';
import axios from 'axios';
import Sidebar from '../Auth/sidebar'
import { verifyAuth } from '../../utils/authentication';

export default class registration extends Component {

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleChangeBirthday = this.handleChangeBirthday.bind(this);
        this.handleDropdownChange = this.handleDropdownChange.bind(this);
        // this.onFormSubmit = this.onFormSubmit.bind(this);


        this.state = {
            form: {
                fullName: '',
                password: '',
                userId: '',
                userType: 'Administrator',
                birthday: new Date(),
                email: '',
                nic: '',
                mobileOne: '',
                mobileTwo: '',
                epf: '',
                etf: '',
                address: '',
                other: '',
                file: null,
            },

        }
    }

    onSubmit(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('profile-Image', this.state.form.file);
        formData.append('fullName', this.state.form.fullName);
        formData.append('userId', this.state.form.userId);
        formData.append('userType', this.state.form.userType);
        formData.append('birthday', this.state.form.birthday);
        formData.append('nic', this.state.form.nic);
        formData.append('mobileOne', this.state.form.mobileOne);
        formData.append('mobileTwo', this.state.form.mobileTwo);
        formData.append('epf', this.state.form.epf);
        formData.append('etf', this.state.form.etf);
        formData.append('address', this.state.form.address);
        formData.append('other', this.state.form.other);


        // const config = {
        //     headers: {
        //         'content-type': 'multipart/form-data'
        //     }
        // };
        // axios.post("http://localhost:4000/users/register", formData, config)
        axios( {method: 'post', url: 'http://localhost:4000/users/register', data: formData, headers: {'Content-Type': 'multipart/form-data' } })
            .then((response) => {
                alert(response);
            }).catch((error) => {
                console.log(error); 
            });

        // axios.post('http://localhost:4000/users/register', formData)
        //     .then((res) => {

        //         console.log(res);
        //     })
        console.log(this.state.form.file);
    }

    async componentDidMount() {
        const authState = await verifyAuth()
        console.log(authState);
        this.setState({
            authState: authState
        })
        if (!authState) {
            this.props.history.push('/login')
        }
    }

    handleChangeBirthday = date => {
        const Val = date
        this.setState(prevState => ({
            form: {
                ...prevState.form,
                birthday: Val
            }
        }))
        console.log(date);
    };


    handleDropdownChange = (e) => {
        const Val = e.target.value
        this.setState(prevState => ({
            form: {
                ...prevState.form,
                userType: Val
            }
        }))
        console.log(e.target.value);

    }

    handleImageChange = (e) => {
        const Val = e.target.files[0]
        this.setState(prevState => ({
            form: {
                ...prevState.form,
                file: Val
            }
        }))
        console.log(e.target.files[0]);

    }


    onChange = (e) => {
        e.persist = () => { };
        let store = this.state;
        store.form[e.target.name] = e.target.value
        this.setState(store);

    }

    // onSubmit(event) {
    //     event.preventDefault();

    //     axios.post('http://localhost:4000/users/register', this.state.form)
    //         .then((res) => {

    //             console.log(res);
    //         })
    //     console.log(this.state.form);
    // }

    render() {
        const { selectedOption, form } = this.state;


        return (
            <div>
                <Col className="row">
                    <div className="col-md-2" style={{ backgroundColor: "#009688" }}>
                        <Sidebar />
                    </div>
                    <div className="col-md-10">

                        <React.Fragment>
                            <h3 style={{ textAlign: "center", marginTop: "50px" }}>User Registration</h3>

                            <div className="card">

                                <div style={{ width: "90%", margin: 'auto' }}>

                                    <form onSubmit={this.onSubmit}>
                                        <div className="form-group" style={{ marginTop: "50px" }}>
                                            <label>Full Name : </label>
                                            <input name="fullName" type="text" className="form-control" value={form.fullName} onChange={this.onChange}></input>
                                        </div>
                                        <div className="form-group">
                                            <label>Password : </label>
                                            <input type="text" className="form-control" name="password" value={form.password} onChange={this.onChange}></input>
                                        </div>

                                        <Row>
                                            <Col>
                                                <div className="form-group">
                                                    <label>User ID : </label>
                                                    <input type="text" className="form-control" name="userId" value={form.userId} onChange={this.onChange}></input>
                                                </div>
                                            </Col>
                                            <Col>

                                                <label>Usertype : </label>
                                                <div className="form-group">
                                                    <select id="dropdown" value={form.userType} onChange={this.handleDropdownChange}>
                                                        <option value="Administrator">Administrator</option>
                                                        <option value="Manager">Manager</option>
                                                        <option value="Pumper">Pumper</option>

                                                    </select>
                                                </div>
                                            </Col>
                                            <Col>
                                                <label>Birthday : </label>
                                                <div className="form-group">
                                                    <DatePicker
                                                        // className="form-control"
                                                        selected={form.birthday}
                                                        onChange={this.handleChangeBirthday}
                                                    />
                                                </div>

                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <div className="form-group">
                                                    <label>E-mail : </label>
                                                    <input type="text" className="form-control" name="email" value={form.email} onChange={this.onChange}></input>
                                                </div>
                                            </Col>
                                            <Col>
                                                <div className="form-group">
                                                    <label>NIC Number : </label>
                                                    <input type="text" className="form-control" name="nic" value={form.nic} onChange={this.onChange}></input>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <div className="form-group">
                                                    <label>Mobile Number 1 : </label>
                                                    <input type="text" className="form-control" name="mobileOne" value={form.mobileOne} onChange={this.onChange}></input>
                                                </div>
                                            </Col>
                                            <Col>
                                                <div className="form-group">
                                                    <label>Mobile Number 2 : </label>
                                                    <input type="text" className="form-control" name="mobileTwo" value={form.mobileTwo} onChange={this.onChange}></input>
                                                </div>
                                            </Col>

                                        </Row>
                                        <Row>
                                            <Col>
                                                <div className="form-group">
                                                    <label>EPF Number : </label>
                                                    <input type="text" className="form-control" name="epf" value={form.epf} onChange={this.onChange}></input>
                                                </div>
                                            </Col>
                                            <Col>
                                                <div className="form-group">
                                                    <label>ETF Number : </label>
                                                    <input type="text" className="form-control" name="etf" value={form.etf} onChange={this.onChange}></input>
                                                </div>
                                            </Col>
                                        </Row>
                                        <div className="form-group">
                                            <label>Address : </label>
                                            <textarea type="text" className="form-control" name="address" value={form.address} onChange={this.onChange}></textarea>
                                        </div>
                                        <div className="form-group">
                                            <label>Others : </label>
                                            <textarea type="text" className="form-control" name="other" value={form.other} onChange={this.onChange}></textarea>
                                        </div>
                                        <div>
                                            <h1>File Upload</h1>
                                            <input type="file" name="myImage" onChange={this.handleImageChange} />
                                        </div>
                                        <div className="form-group">
                                            <button className="btn btn-info my-4 btn-block " type="submit">Register Now</button>
                                        </div>

                                    </form>
                                </div>
                                {/* <div>
                                    <form onSubmit={this.onFormSubmit}>
                                        <h1>File Upload</h1>
                                        <input type="file" name="myImage" onChange={this.onChange} />
                                        <button type="submit">Upload</button>
                                    </form>
                                </div> */}
                            </div>
                        </React.Fragment>

                    </div>

                </Col>
            </div>


        )

    }
}

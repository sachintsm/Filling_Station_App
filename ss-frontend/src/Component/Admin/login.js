import React, { Component } from 'react'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Form } from 'reactstrap';
import '../../Css/Admin/login.css';
import 'whatwg-fetch';
import { getFromStorage, setInStorage } from '../../utils/storage';
import { MDBInput, MDBBtn } from "mdbreact";

export default class login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            token: '',
            signUpError: '',
            signInError: '',
            masterError: '',
            userId: '',
            password: '',
        };

        this.onSignIn = this.onSignIn.bind(this);
        this.onChangeUserId = this.onChangeUserId.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
    }
    onChangeUserId(e) {
        this.setState({
            userId: e.target.value
        })
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        })
    }

    componentDidMount() {
        const obj = getFromStorage('the_main_app');
        if (obj && obj.token) {
            const { token } = obj;
            //verify token
            fetch('http://localhost:4000/users/account/verify?token=' + token)
                .then(res => res.json())
                .then(json => {
                    if (json.state) {
                        this.setState({
                            token,
                            isLoading: false
                        })
                    }
                })
        }
        else {
            this.setState({
                isLoading: false
            })
        }
    }

    onSignIn() {
        const {
            userId,
            password
        } = this.state;

        this.setState({
            isLoading: true,
        })

        fetch('http://localhost:4000/users/account/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: userId,
                password: password
            }),
        })
            .then(res => res.json())
            .then(json => {
                console.log('josn', json);
                if (json.state) {
                    setInStorage('the_main_app', { token: json.token })
                    this.setState({
                        signInError: json.msg,
                        isLoading: false,
                        password: '',
                        userId: '',
                        token: json.token
                    })
                }
                else {
                    this.setState({
                        signInError: json.msg,
                        isLoading: false
                    })
                }

            })
    }

    // onChange = (e) => {
    //     e.persist();
    //     let store = this.state;
    //     store.form[e.target.name] = e.target.value
    //     this.setState(store);
    // }

    // onSubmit(e) {
    //     e.preventDefault();

    //     axios.post('http://localhost:4000/users/login', this.state.form)
    //         .then((res) => {
    //             // console.log(res)
    //             if (res.data.state === true) {
    //                 this.props.history.push("/registration")
    //             }
    //             else {
    //                 alert(res.data.msg);
    //             }
    //         })
    //     console.log(this.state.form)
    // }



    render() {
        const {
            isLoading,
            userId,
            password,
            signInError
        } = this.state;

        if (isLoading) {
            return (
                < div >
                    Loading...
                </div >
            )
        }

        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="container login-card-div">
                        <Card className="login-card">
                            <Form >
                                {
                                    (signInError) ? (
                                        <p>{signInError}</p>
                                    ) : null
                                }
                                {/* eslint-disable-next-line */}
                                <img src={require('../../Assets/logo/Logo_reg.png')} className="logo" />
                                <CardContent style={{ marginLeft: "20px", marginRight: "20px" }}>
                                    <Typography color="textSecondary" gutterBottom>
                                        User Name
                                    </Typography>
                                    <MDBInput label="User ID" outline icon="user" type="text" placeholder="userId" name="userId" value={userId} onChange={this.onChangeUserId} />

                                    {/* <input className="form-control" type="text" name="userId" value={form.userId} onChange={this.onChange}></input> */}
                                    <Typography color="textSecondary" gutterBottom>
                                        Password
                                    </Typography>
                                    <MDBInput label="Password" outline icon="key" type="password" placeholder="Password" name="password" value={password} onChange={this.onChangePassword} />

                                    {/* <input className="form-control" type="text" name="password" value={form.password} onChange={this.onChange}></input> */}
                                </CardContent>
                                <CardActions >
                                    <MDBBtn rounded outline color="info" onClick={this.onSignIn}>SignIn</MDBBtn>

                                    {/* <Button onClick={this.onSubmit} style={{ margin: "auto", width: "50%" }} type="submit" variant="outlined" color="primary"> */}
                                    {/* Login */}
                                    {/* </Button> */}
                                </CardActions>
                                <CardActions >
                                    <Button style={{ margin: "auto", width: "50%" }} color="primary" size="small">
                                        Forget Password
                                    </Button>
                                </CardActions>
                            </Form>
                        </Card>
                    </div>
                </div>
            </div >
        );
    }
}

import React, { Component } from 'react'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Form } from 'reactstrap';
import '../../Css/Admin/login.css';
import { setInStorage } from '../../utils/storage';
import { MDBInput, MDBBtn } from "mdbreact";
import ParticlesBg from 'particles-bg'
import Snackpop from "../Auth/Snackpop";

const backend_URI = require('../Auth/Backend_URI')
export default class login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            snackbaropen: false,
            snackbarmsg: '',
            snackbarcolor: '',


            token: '',
            signUpError: '',
            signInError: '',
            masterError: '',
            userId: '',
            password: '',
            name: "React"

        };

        this.onSignIn = this.onSignIn.bind(this);
        this.onChangeUserId = this.onChangeUserId.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
    }
    closeAlert = () => {
        this.setState({ snackbaropen: false });
    };

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

    onSignIn() {

        const {
            userId,
            password
        } = this.state;


        fetch(backend_URI.url + '/users/account/login', {
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
                console.log(json)
                if (json.state) {
                    setInStorage('auth-token', { token: json.token })
                    setInStorage('auth-user', {
                        userId: json.data.userId,
                        userType: json.data.userType
                    })
                    this.setState({
                        password: '',
                        userId: '',
                        token: json.token
                    })
                    this.setState({
                        snackbaropen: true,
                        snackbarmsg: json.msg,
                        snackbarcolor: 'success'
                    })
                    this.props.history.goBack();
                }
                else {
                    this.setState({
                        snackbaropen: true,
                        snackbarmsg: json.msg,
                        snackbarcolor: 'error'
                    })
                }
            })
    }

    render() {
        const {
            userId,
            password,
        } = this.state;

        let config = {
            num: [4, 7],
            rps: 0.1,
            radius: [5, 40],
            life: [1.5, 3],
            v: [2, 3],
            tha: [-40, 40],
            alpha: [0.6, 0],
            scale: [.1, 0.4],
            position: "all",
            color: ["random", "#ff0000"],
            cross: "dead",
            // emitter: "follow",
            random: 15
        };

        if (Math.random() > 0.85) {
            config = Object.assign(config, {
                onParticleUpdate: (ctx, particle) => {
                    ctx.beginPath();
                    ctx.rect(
                        particle.p.x,
                        particle.p.y,
                        particle.radius * 2,
                        particle.radius * 2
                    );
                    ctx.fillStyle = particle.color;
                    ctx.fill();
                    ctx.closePath();
                }
            });
        }
        return (
            <div className="container-fluid" style={{ minHeight: "700px" }}>

                <Snackpop
                    msg={this.state.snackbarmsg}
                    color={this.state.snackbarcolor}
                    time={3000}
                    status={this.state.snackbaropen}
                    closeAlert={this.closeAlert}
                />

                <ParticlesBg type="custom" config={config} bg={true} />

                <div className="row">
                    <div className="container login-card-div" >
                        <Card className="login-card">
                            <Form >
                                
                                {/* eslint-disable-next-line */}
                                <img src={require('../../Assets/logo/Logo_reg.png')} className="logo" />
                                <CardContent style={{ marginLeft: "20px", marginRight: "20px" }}>
                                    <Typography color="textSecondary" gutterBottom>
                                        User Name
                                    </Typography>
                                    <MDBInput label="User ID" outline icon="user" type="text" placeholder="userId" name="userId" value={userId} onChange={this.onChangeUserId} />
                                    <Typography color="textSecondary" gutterBottom>
                                        Password
                                    </Typography>
                                    <MDBInput label="Password" outline icon="key" type="password" placeholder="Password" name="password" value={password} onChange={this.onChangePassword} />
                                </CardContent>
                                <CardActions style={{ marginBottom: "20px" }}>
                                    <MDBBtn outline style={{ margin: "auto", width: "40%" }} color="info" size="small">Forget Password</MDBBtn>
                                    <MDBBtn color="info" style={{ margin: "auto", width: "40%" }} onClick={this.onSignIn}>login</MDBBtn>
                                </CardActions>
                            </Form>
                        </Card>
                    </div>
                </div>
            </div >
        );
    }
}

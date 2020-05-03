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

export default class login extends Component {

    constructor(props) {
        super(props);

        this.state = {
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
                if (json.state) {
                    setInStorage('auth-token', { token: json.token })
                    setInStorage('auth-user', {
                        userId: json.data.userId,
                        userType: json.data.userType
                    })
                    this.setState({
                        signInError: json.msg,
                        password: '',
                        userId: '',
                        token: json.token
                    })
                    this.props.history.goBack();
                }
                else {
                    this.setState({
                        signInError: json.msg,
                    })
                }
            })
    }

    render() {
        const {
            userId,
            password,
            signInError
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
                <ParticlesBg type="custom" config={config} bg={true} />

                <div className="row">
                    <div className="container login-card-div" >
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

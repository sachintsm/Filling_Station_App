import React, { Component } from 'react'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Form } from 'reactstrap';
// import logo from '../Assets/logo/Logo_reg.png'
import '../../Css/Admin/login.css';

export default class login extends Component {
    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="container login-card-div">
                        <Card className="login-card">
                            <Form>
                                {/* eslint-disable-next-line */}
                                <img src={require('../../Assets/logo/Logo_reg.png')} className="logo" />
                                <CardContent style={{ marginLeft: "20px", marginRight: "20px" }}>
                                    <Typography color="textSecondary" gutterBottom>
                                        User Name
                                    </Typography>
                                    <input className="form-control" type="text"></input>
                                    <Typography color="textSecondary" gutterBottom>
                                        Password
                                    </Typography>
                                    <input className="form-control" type="text"></input>
                                </CardContent>
                                <CardActions >
                                    <Button style={{ margin: "auto", width: "50%" }} variant="outlined" color="primary">
                                        Login
                                    </Button>
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
            </div>
        )
    }
}

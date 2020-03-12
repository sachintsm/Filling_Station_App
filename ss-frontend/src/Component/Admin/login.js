import React, { Component } from 'react'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Form } from 'reactstrap';
// import logo from '../Assets/logo/Logo_reg.png'
import '../../Css/Admin/login.css';
import axios from 'axios';

export default class login extends Component {

    constructor(props) {
        super();

        this.state = {
            form: {
                userId: '',
                password: ''
            }
        }
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange = (e) => {
        e.persist();
        let store = this.state;
        store.form[e.target.name] = e.target.value
        this.setState(store);
    }

    onSubmit(e) {
        e.preventDefault();

        axios.post('http://localhost:4000/users/login', this.state.form)
            .then((res) => {
                console.log(res)
            })
        console.log(this.state.form)

        
    }


    render() {
        const { form} = this.state;

        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="container login-card-div">
                        <Card className="login-card">
                            <Form onSubmit={this.onSubmit}>
                                {/* eslint-disable-next-line */}
                                <img src={require('../../Assets/logo/Logo_reg.png')} className="logo" />
                                <CardContent style={{ marginLeft: "20px", marginRight: "20px" }}>
                                    <Typography color="textSecondary" gutterBottom>
                                        User Name
                                    </Typography>
                                    <input className="form-control" type="text" name="userId" value={form.userId} onChange={this.onChange}></input>
                                    <Typography color="textSecondary" gutterBottom>
                                        Password
                                    </Typography>
                                    <input className="form-control" type="text" name="password" value={form.password} onChange={this.onChange}></input>
                                </CardContent>
                                <CardActions >
                                    <Button style={{ margin: "auto", width: "50%" }} type="submit" variant="outlined" color="primary">
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
        );
    }
}

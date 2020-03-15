import React, { Component } from 'react'
import 'whatwg-fetch';
import {
    getFromStorage,
    setInStorage
} from '../../utils/storage';



export default class Home extends Component {

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
        // this.onChange = this.onChange.bind(this);
        this.onChangeUserId = this.onChangeUserId.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.logout = this.logout.bind(this);


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

    logout() {
        this.setState({
            isLoading: true,

        })
        const obj = getFromStorage('the_main_app');
        const { token } = obj;
        if (obj && obj.token) {
            //verify token
            fetch('http://localhost:4000/users/account/logout?token=' + token)
                .then(res => res.json())
                .then(json => {
                    if (json.state) {
                        this.setState({
                            token: '',
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
    render() {

        const {
            isLoading,
            token,
            userId,
            password,
            signInError
        } = this.state;

        if (isLoading) {
            return (
                <div>Loading...</div>
            )
        }

        if (!token) {
            return (
                <div>
                    {
                        (signInError) ? (
                            <p>{signInError}</p>
                        ) : null
                    }
                    <p>Sign In</p>
                    <input type="text" placeholder="userId" name="userId" value={userId} onChange={this.onChangeUserId}></input>
                    <br />
                    <input type="password" placeholder="Password" name="password" value={password} onChange={this.onChangePassword}></input>
                    <br />
                    <button onClick={this.onSignIn}> SignIn</button>

                </div>
            )

        }

        return (
            <div>
                <p>Account</p>
                <button onClick={this.logout}> Logout</button>
            </div>
        )
    }
}

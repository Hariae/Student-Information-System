import React, { Component } from 'react';
import '../../App.css';
import cookie from 'react-cookies';
import axios from 'axios';
import {Redirect} from 'react-router';

class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            isaunthenticated: false,            
            usernameError: undefined,
            passwordError: undefined
        }

        //Binding handlers

        this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.submitLogin = this.submitLogin.bind(this);

    }

    //CallWillMount to init isAuth flag to false;

    componentWillMount() {
        this.setState({
            isaunthenticated: false
        })
    }


    //usernmaeChangeHandler

    usernameChangeHandler = (object) => {
        this.setState({
            username: object.target.value
        })
    }

    passwordChangeHandler = (object) => {
        this.setState({
            password: object.target.value
        })
    }

    submitLogin = (e) => {

        var headers = new Headers();

        //Prevent page from refresh
        e.preventDefault();
        var error = false;

        if(this.state.username !== ""){
            this.setState({
                usernameValid : true,
                usernameError: undefined
            })
        }
        else{

            this.setState({

                usernameError : <div className="alert alert-danger width-75 mar-top-10" role="alert">
                                Please fill the username field!
                            </div>
            });
            error = true;
            
        }
        

        if(this.state.password !== ""){
            this.setState({
                passwordValid : true,
                passwordError: undefined
            })
        }
        else{

            this.setState({
                passwordError : <div className="alert alert-danger width-75  mar-top-10" role="alert">
                                    Please fill the Password field!
                                </div>  
            });
            error = true;
            
        }

        if(!error){
            const data = {
                username: this.state.username,
                password: this.state.password
            }
    
            axios.defaults.withCredentials = true;
    
            axios.post('http://localhost:3005/login', data)
                .then(response => {
                    console.log("Status : ", response.status);
                    if (response.status === 200) {
                        this.setState({
                            isaunthenticated: true
                        });
                    }
                    else {
                        this.setState({
                            isaunthenticated: false
                        })
                    }
                });
        }        
    }

    render() {

        
        let redirectVar = null;
        if(cookie.load('cookie')){
            redirectVar = <Redirect to="/user-information" />
        }        

        return (
            
            <div className="container">
            {redirectVar}
                <div className="container content">
                    <h4>Login Page</h4>
                    
                        <div className="form-group">
                            <label htmlFor="username"><b>Username</b></label>
                            <input type="text" name="username" id="username" className="form-control" placeholder="Enter Username" onChange={this.usernameChangeHandler} required />
                            {this.state.usernameError}
                        </div>
                        <div className="form-group">
                            <label htmlFor="password"><b>Password</b></label>
                            <input type="password" name="password" id="password" className="form-control" placeholder="Enter Password" onChange={this.passwordChangeHandler} required />                            
                            {this.state.passwordError}
                        </div>
                        <div className="form-group">
                            <button className="btn btn-success" onClick={this.submitLogin}>Submit </button>
                        </div>
                    
                </div>
            </div>
        )
    }
}

export default Login 
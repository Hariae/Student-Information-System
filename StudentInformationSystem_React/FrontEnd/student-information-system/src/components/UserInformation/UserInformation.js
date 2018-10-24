import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import {Redirect} from 'react-router';
import cookie from 'react-cookies';




class UserInformation extends Component{

    constructor(){
        super();
        this.state = {
            Name : "",
            StudentId : "",
            Department : "",
            redirect: undefined,
            nameValid: false,
            studentIdValid: false,
            departmentValid: false,
            nameError: undefined,
            studentIdError: undefined,
            departmentError: undefined
        }

        //Bind events

        this.nameChangeHandler = this.nameChangeHandler.bind(this);
        this.studentIdChangeHandler = this.studentIdChangeHandler.bind(this);
        this.departmentChangeHandler = this.departmentChangeHandler.bind(this);    
        this.addUser = this.addUser.bind(this);        
    }

    nameChangeHandler = (e)=>{
        this.setState({
            Name : e.target.value
        })
    }

    studentIdChangeHandler = (e) =>{
        this.setState({
            StudentId : e.target.value
        })
    }

    departmentChangeHandler = (e) => {
        this.setState({
            Department : e.target.value
        })
    }

    addUser = (e) =>
    {
        e.preventDefault();
        var error = false;

        if(this.state.Name !== ""){
            this.setState({
                nameValid: true,
                nameError: undefined
            });

        }
        else{
            this.setState({
                nameError : <div className="alert alert-danger width-75 mar-top-10" role="alert">
                                Please fill the Name field!
                            </div>
            });
            error = true;
        }

        
        if(this.state.StudentId !== ""){
            this.setState({
                studentIdValid: true,
                studentIdError: undefined
            })
        }
        else{
            this.setState({
                studentIdError : <div className="alert alert-danger width-75 mar-top-10" role="alert">
                                    Please fill the Student ID field!
                                </div>
            });
            error = true;
        }

        
        if(this.state.Department !== ""){
            
            this.setState({
                departmentValid: true,
                departmentError: undefined
            })
            
        }
        else{
            this.setState({
                departmentError : <div className="alert alert-danger width-75 mar-top-10" role="alert">
                                        Please fill the Department field!
                                    </div>
            });
            error = true;
        }

        if(!error){
            
            const data = {
                Name : this.state.Name,
                StudentId : this.state.StudentId,
                Department : this.state.Department
            }
            axios.defaults.withCredentials = true;
            axios.post('http://localhost:3005/adduser', data)
                .then(response => {
                    if(response.status === 200){
                        console.log("Status:", response.status);
                        console.log("Data:", response.data);
                        this.setState({
                            redirect: true
                        });
                    }
                                                  
                });
        }

        
    }


    render(){
        
        //if not logged in go to login page
        let redirectVar = null;
        if (!cookie.load('cookie')) {
            redirectVar = <Redirect to="/login" />
        }  

        if(this.state.redirect){
            redirectVar = <Redirect to= '/user-report' />           
        }        


        return(
            <div className="container">
                {redirectVar}
                <div className="container content">
                    <h4>User Information</h4>
                    <form>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" name="name" className="form-control" onChange={this.nameChangeHandler} required/>
                        {this.state.nameError}
                    </div>
                    <div className="form-group">
                        <label htmlFor="id">Student ID</label>
                        <input type="text" id="id" name="id" className="form-control" onChange={this.studentIdChangeHandler} required/>
                        {this.state.studentIdError}
                    </div>
                    <div className="form-group">
                        <label htmlFor="dept">Department</label>
                        <input type="text" id="dept" name="dept" className="form-control" onChange={this.departmentChangeHandler} required />
                        {this.state.departmentError}
                    </div>
                    <div className="form-group">
                        <button type="reset" className="btn btn-primary clear-btn"> Clear</button> 
                        <button className="btn btn-success" onClick={this.addUser}>Add a User</button>
                    </div>
                    </form>
                </div>
            </div>
            
        )
    }
}



export default UserInformation
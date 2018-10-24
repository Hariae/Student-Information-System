import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import { Redirect } from 'react-router';
import cookie from 'react-cookies';


class UserReport extends Component {

    constructor() {
        super();

        this.state = {
            Students: []
        }

    }

    componentDidMount() {
        axios.defaults.withCredentials = true;
        axios.get('http://localhost:3005/user-report')
            .then((response) => {
                this.setState({
                    Students: this.state.Students.concat(response.data)
                });
            });
    }


    deleteRecord = (Parameter, e) => {

        console.log(Parameter);
        const data = {
            studentId: Parameter
        }

        axios.post('http://localhost:3005/delete', data)
            .then(response => {
                console.log('Inside POST - Delete');
                if (response.status === 200) {
                    console.log('response.status', response.status);
                    axios.defaults.withCredentials = true;
                    axios.get('http://localhost:3005/user-report')
                        .then((response) => {
                            this.setState({
                                Students: response.data
                            });
                        });
                }
            });
    }

    render() {

        //Creating user record. 
        let users = this.state.Students.map((student, index) => {
            return (
                <tr key={index}>
                    <th>{index + 1}</th>
                    <td>{student.Name}</td>
                    <td>{student.StudentId}</td>
                    <td>{student.Department}</td>
                    <td>
                        <button className="btn btn-danger" onClick={this.deleteRecord.bind(this, student.StudentId)}>Delete</button>
                    </td>
                </tr>
            )
        })

        //if not logged in go to login page
        let redirectVar = null;
        if (!cookie.load('cookie')) {
            redirectVar = <Redirect to="/login" />
        }


        return (

            <div className="container">
                {redirectVar}
                <div className="container content">
                    <h4>User Report</h4>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Student ID</th>
                                <th scope="col">Department</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default UserReport
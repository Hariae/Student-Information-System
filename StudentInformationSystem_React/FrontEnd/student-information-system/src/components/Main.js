import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import Login from './Login/Login';
import UserInformation from './UserInformation/UserInformation';
import UserReport from './UserReport/UserReport'

//Main Component

class Main extends Component{
    render(){
        return (
            <div>
                {/*Render different component routes*/}
                <Route path="/login" component={Login}/>
                <Route path="/user-information" component={UserInformation}/>
                <Route path="/user-report" component={UserReport}/>
            </div>
        )
    }
}

//Export Main
export default Main;
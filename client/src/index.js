import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import App from './App';
import Register from './screens/Register';
import Login from './screens/Login';
import ForgetPassword from './screens/Forget';
import Activate from './screens/activate';
import 'react-toastify/dist/ReactToastify.css'
import Reset from './screens/Reset';
ReactDOM.render(

  <BrowserRouter>
    <Switch>
      <Route path='/' exact render={props => <App {...props} />} />
      <Route path='/register' exact render={props => <Register {...props} />} />
      <Route path='/login' exact render={props => <Login {...props} />} />
      <Route path='/users/password/forget' exact render={props => <ForgetPassword {...props} />} />
      <Route path='/users/password/reset/:token' exact render={props => <Reset {...props} />} />
      <Route path='/users/activate/:token' exact render={props => <Activate {...props} />} />
    </Switch>
  </BrowserRouter>,

  document.getElementById('root')
);


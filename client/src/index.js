 
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import './index.css';
import App from './components/App';

import NavBar from './components/NavBar';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import Profile from './components/profile/Profile';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import withSession from './components/withSession';

import * as serviceWorker from './serviceWorker';

const client = new ApolloClient({
  uri: 'http://localhost:4444/graphql',
    fetchOptions: {
        credentials: 'include'
    },
    request: operation => {
        const token = localStorage.getItem('token');
        operation.setContext({
            headers: {
                authorization: token
            }
        })
    },
    onError:({ networkError}) =>{
        if (networkError){
            console.log("network error", networkError);
        }
    }
})

const Root = ({ refetch, session }) => (
  <Router>
      <Fragment>
          <NavBar session={session}/>
          <Switch>
              <Route path="/" exact component={App} session={session}/>
              <Route path="/signin" render={()=> <SignIn refetch={refetch}/>}/>
              <Route path="/signup" render={()=> <SignUp refetch={refetch}/>}/>
              <Route path ="/profile" render={()=> <Profile session={session}/>}/>
              <Redirect to="/"/>
          </Switch>
      </Fragment>
  </Router>
);
const RootWithSession = withSession(Root)

ReactDOM.render(
  <ApolloProvider client={client}>
      <RootWithSession />
  </ApolloProvider>
  , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

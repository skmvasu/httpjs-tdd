import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {post, patch, put, HTTP_HEADER_TYPES}  from './http';

class App extends Component {
  componentWillMount() {
    return patch("/users", { users: [1, 2, 3] }, { contentType: HTTP_HEADER_TYPES.json }).catch(
      e => {
        console.log(e);
      }
    );
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;

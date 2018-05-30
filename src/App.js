import React, { Component } from 'react';
import './App.css';

import DrawingBoard from './components/DrawingBoard';

class App extends Component {
  render() {
    return (
      <div className="App">
        <DrawingBoard />
      </div>
    );
  }
}

export default App;

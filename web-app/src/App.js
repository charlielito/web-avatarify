import React from 'react';
import './App.css';
// import logo from './logo.svg';
// import VideoCapture from './containers/VideoCapture/VideoCapture';

import AvatarBuilder from './containers/AvatarBuilder/AvatarBuilder';
import Toolbar from './components/Toolbar/Toolbar';


function App() {
  return (
    <div className="App">
      <Toolbar />
      <AvatarBuilder />
    </div>
  );
}

export default App;

import React from 'react';
import logo from './logo.svg';
import './App.css';
import VideoCapture from './containers/VideoCapture/VideoCapture';
import VideoCapture2 from './containers/VideoCapture/VideoCapture2';

import AvatarSelector from './containers/AvatarSelector/AvatarSelector';
import AvatarBuilder from './containers/AvatarBuilder/AvatarBuilder';



function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header> */}
      {/* <VideoCapture /> */}
      <AvatarBuilder />
    </div>
  );
}

export default App;

import React from 'react';
import './App.css';
// import logo from './logo.svg';
// import VideoCapture from './containers/VideoCapture/VideoCapture';
import { Paper, Container, Typography } from '@material-ui/core/';
import AvatarBuilder from './containers/AvatarBuilder/AvatarBuilder';
import Toolbar from './components/Toolbar/Toolbar';
import Contact from './components/UI/Contact/Contact';


function App() {
  return (
    <div className="App">
      <Toolbar />
      <Container
        fixed
        style={{ marginTop: '20px', marginBottom: '10px' }}
        maxWidth={"sm"}>
        <Paper elevation={5} style={{ padding: 10, margin: 0, backgroundColor: '#F3F3F3' }}>
          <AvatarBuilder />
        </Paper>
      </Container>
      <Contact />
    </div>
  );
}

export default App;

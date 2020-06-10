import React from 'react';
import './App.css';
// import logo from './logo.svg';
// import VideoCapture from './containers/VideoCapture/VideoCapture';
import { Paper, Container, Typography } from '@material-ui/core/';
import AvatarBuilder from './containers/AvatarBuilder/AvatarBuilder';
import Toolbar from './components/Toolbar/Toolbar';


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
      <Typography variant="body2">
        © 2020 <a rel="author" href="https://github.com/charlielito">Carlos Alvarez</a>
      </Typography>
    </div>
  );
}

export default App;

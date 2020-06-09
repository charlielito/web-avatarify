import React from 'react';
import { AppBar, Typography, Toolbar } from '@material-ui/core';

export default function ToolBar(props) {

    return (
        <AppBar position="static" style={{ alignItems: 'center' }}>
            <Toolbar>
                <Typography variant="h5" color="inherit" align="center">
                    Image live animations!
                </Typography>
            </Toolbar>
        </AppBar>
    )
}
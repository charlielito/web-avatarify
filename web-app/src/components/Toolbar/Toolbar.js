import React from 'react';
import { AppBar, Typography, Toolbar } from '@material-ui/core';

export default function ToolBar(props) {

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" color="inherit">
                    Image live animations!
                </Typography>
            </Toolbar>
        </AppBar>
    )
}
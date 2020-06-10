import React from 'react';
import { Typography, Grid } from '@material-ui/core';

import Link from '@material-ui/core/Link';
import FacebookIcon from '@material-ui/icons/Facebook';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import GithHubIcon from '@material-ui/icons/GitHub';

export default function ContactsList(props) {

    return (
        <>
            <Grid container justify="center" spacing={2} style={{ 'marginTop': '0px', 'marginBottom': '10px' }}>
                <Grid item>
                    <Typography variant="body2">
                        © 2020 Carlos Alvarez
                </Typography>
                </Grid>
                <Grid item>
                    <Link href="https://www.facebook.com/charlie.batero" >
                        <FacebookIcon style={{ 'color': "#3b5998" }} />
                    </Link>
                    <Link href="https://www.linkedin.com/in/calvarez92/" >
                        <LinkedInIcon style={{ 'color': "#0072b1" }} />
                    </Link>
                    <Link href="https://github.com/charlielito" >
                        <GithHubIcon style={{ 'color': "#000000" }} />
                    </Link>
                </Grid>
            </Grid>
        </>
    );
}

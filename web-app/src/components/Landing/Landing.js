import React from 'react';
import example from '../../assets/example.gif';
import { Typography, Container, Box, Grid } from '@material-ui/core';
import classes from './Landing.module.css';


export default function Landing(props) {

    return (
        <Container fixed >
            <Box>
                <Typography
                    variant="body1"
                    color="inherit"
                    align="justify"
                    style={{ 'marginTop': '10px', 'marginBottom': '10px' }}
                >
                    This page is a demo for everyone to experiment with a recent and
                    exciting <a href="https://arxiv.org/pdf/2003.00196.pdf">paper</a> that allows you to
                    create an animation video from a single image. The animation is based on others
                    person movements or video. The following example, transfers the motion of Trump
                    to Bran and Jon Snow using only one image per subject.
                </Typography>
            </Box>
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
            >
                <img src={example} alt="example" style={classes.Landing} />
            </Grid>
        </Container>
    )
}
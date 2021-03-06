import React from 'react';
import example from '../../assets/example.gif';
import { Typography, Container, Grid, Link } from '@material-ui/core';
import classes from './Landing.module.css';


export default function Landing(props) {

    return (
        <Container fixed >
            <Typography
                variant="body1"
                color="inherit"
                align="justify"
                style={{ 'marginTop': '0px', 'marginBottom': '10px' }}
            >
                This page is a demo for everyone to experiment with a recent and
                exciting <Link href="https://arxiv.org/pdf/2003.00196.pdf">paper</Link> that allows you to
                create an animation video from a single image. The animation is based on others
                person movements or video. Many thanks to the authors of the paper for making public
                the code and the trained neural network. <br></br><br></br>
                The following example, transfers the motion of Trump
                to Bran and Jon Snow using only one image per subject.
                </Typography>
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
            >
                <img src={example} alt="example" style={classes.Landing} />
            </Grid>
            <Typography
                variant="body1"
                color="inherit"
                align="justify"
                style={{ 'marginTop': '10px', 'marginBottom': '10px' }}
            >
                This page will allow you to record yourself from the webcamera and choose an image to animate!
                </Typography>
        </Container>
    )
}
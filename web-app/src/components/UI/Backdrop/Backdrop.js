import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

export default function SimpleBackdrop(props) {
    const classes = useStyles();
    return (
        <div>
            <Backdrop className={classes.backdrop} open={props.show}>
                {props.children}
            </Backdrop>
        </div>
    );
}
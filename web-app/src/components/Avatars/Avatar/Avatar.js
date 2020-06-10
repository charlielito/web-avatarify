import React from 'react';
import classes from './Avatar.module.css';
// import Spinner from '../../UI/Spinner/Spinner'
// import errorImage from '../../../assets/images/error.png'

const Avatar = React.forwardRef((props, ref) => {
    return (
        <img
            className={classes.Avatar}
            src={props.imageURL}
            // src={src}
            onClick={props.clicked}
            style={props.selected ? { border: "thick solid #1274BD" } : null}
            // loader={<Spinner />}
            // unloader={<img alt="" src={errorImage} />}
            id={props.id}
            alt={props.imageURL}
            ref={ref}
            onLoad={props.onLoad}
        />
    )
});

export default Avatar;
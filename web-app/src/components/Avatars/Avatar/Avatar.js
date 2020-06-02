import React from 'react';
import classes from './Avatar.module.css';
// import Spinner from '../../UI/Spinner/Spinner'
// import errorImage from '../../../assets/images/error.png'

const Avatar = React.forwardRef((props, ref) => {

    return (
        <li className={classes.Avatar}>
            <img
                src={props.imageURL}
                // src={src}
                onClick={props.clicked}
                style={props.selected ? { border: "10px solid blue" } : null}
                // loader={<Spinner />}
                // unloader={<img alt="" src={errorImage} />}
                id={props.id}
                alt={props.imageURL}
                ref={ref}
                onLoad={props.onLoad}
            />
        </li>
    )
});

export default Avatar;
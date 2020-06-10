import React from 'react';
import classes from './Avatar.module.css';

const Avatar = React.forwardRef((props, ref) => {
    const className = props.selected ? [classes.Avatar, classes.AvatarSelected] : [classes.Avatar];
    return (
        <img
            className={className.join(' ')}
            src={props.imageURL}
            onClick={props.clicked}
            id={props.id}
            alt={props.imageURL}
            ref={ref}
            onLoad={props.onLoad}
        />
    )
});

export default Avatar;
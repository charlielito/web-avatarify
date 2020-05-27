import React from 'react';
import classes from './Avatar.css';
import { Img } from 'react-image';
import Spinner from '../../UI/Spinner/Spinner'
import errorImage from '../../../assets/images/error.png'

const Avatar = (props) => {

    return (
        <li className="Avatar">
            <Img
                src={props.imageURL}
                onClick={props.clicked}
                alt={props.alt}
                style={props.selected ? { border: "10px solid blue" } : null}
                loader={<Spinner />}
                unloader={<img src={errorImage} />}
                id={props.id}
            />
        </li>
    )
};

export default Avatar;
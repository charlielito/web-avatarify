import React from 'react';
import Avatar from './Avatar/Avatar';
import classes from './Avatars.css';

const Avatars = React.forwardRef((props, ref) => {
    // const Avatars = (props) => {
    // const { refs } = props;
    let urlList = props.urlList;
    urlList = urlList ? urlList.map((url, index) => {
        // console.log(url, index, typeof (index), ref);
        return (
            <Avatar
                imageURL={url}
                key={index}
                id={index}
                ref={ref[index]}
                onLoad={() => props.onLoad(index)}
                // ref={refs[index]}
                // ref={ref}
                selected={index === props.selectedAvatar}
                clicked={(event) => {
                    return props.clickAvatar(index);
                }}
            />
        )
    }) : null;
    return (
        <ul className="Avatars" >
            {urlList}
        </ul>
    )
});
// };

export default Avatars;
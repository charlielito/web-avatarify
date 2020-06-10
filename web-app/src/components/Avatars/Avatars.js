import React from 'react';
import Avatar from './Avatar/Avatar';
import classes from './Avatars.module.css';

import { GridList, GridListTile } from '@material-ui/core';




const Avatars = React.forwardRef((props, ref) => {
    let urlList = props.urlList;
    urlList = urlList ? urlList.map((url, index) => {
        return (
            <GridListTile key={index} >
                <Avatar
                    imageURL={url}
                    // key={index}
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
            </GridListTile>
        )
    }) : null;

    return (
        <GridList cellHeight={"auto"} className={classes.gridList} cols={5} spacing={1}>
            {urlList}
        </GridList>
    )
});

export default Avatars;
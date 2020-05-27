import React, { useState, useCallback } from 'react';
import Avatars from '../../components/Avatars/Avatars';

const AVATARS_URLS = [
    "https://github.com/charlielito/web-avatarify/raw/master/avatars/einstein.jpg",
    "https://github.com/charlielito/web-avatarify/raw/master/avatars/jobs.jpg",
    "https://github.com/charlielito/web-avatarify/raw/master/avatars/mona.jpg",
    "https://github.com/charlielito/web-avatarify/raw/master/avatars/obama.jpg",
    "https://github.com/charlielito/web-avatarify/raw/master/avatars/potter.jpg",
    "https://github.com/charlielito/web-avatarify/raw/master/avatars/ronaldo.png",
    "https://github.com/charlielito/web-avatarify/raw/master/avatars/schwarzenegger.png",
];


const AvatarSelector = props => {
    const [avatarIdx, setAvatarIdx] = useState(0);

    const updateAvatarIdxHandler = (idx) => {
        setAvatarIdx(idx);
    }

    return (
        <>
            <Avatars
                urlList={AVATARS_URLS}
                selectedAvatar={avatarIdx}
                clickAvatar={updateAvatarIdxHandler}
            />

        </>
    );

};

export default AvatarSelector;
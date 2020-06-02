import React, { useState, useCallback, useEffect, useRef } from 'react';
import Avatars from '../../components/Avatars/Avatars';
import Webcam from "react-webcam";
import axios from '../../axios-avatarify';

import Backdrop from '../../components/UI/Backdrop/Backdrop';
import Spinner from '../../components/UI/Spinner/Spinner';



import einstein from '../../assets/avatars/einstein.jpg'
import jobs from '../../assets/avatars/jobs.jpg'
import mona from '../../assets/avatars/mona.jpg'
import obama from '../../assets/avatars/obama.jpg'
import potter from '../../assets/avatars/potter.jpg'
import ronaldo from '../../assets/avatars/ronaldo.png'
import schwarzenegger from '../../assets/avatars/schwarzenegger.png'

import { Button } from '@material-ui/core';



const AvatarBuilder = props => {
    const [avatarUrls, setAvatarUrls] = useState([
        einstein,
        jobs,
        mona,
        obama,
        potter,
        ronaldo,
        schwarzenegger,
    ]);
    const [avatarIdx, setAvatarIdx] = useState(0);
    const [avatarImage, setAvatarImage] = useState(null);
    const [capturing, setCapturing] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [recordedEncoded, setRecordedEncoded] = useState(null);
    const [resultVideoAvatar, setResultVideoAvatar] = useState(null);
    const [loading, setLoading] = useState(false);

    const webcamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    // create avatarsRefArray only once
    const avatarsRefArray = React.useMemo(() => avatarUrls.map(item => React.createRef()), [avatarUrls]);

    const getImageUrl = (idx) => {
        const canvas = document.createElement("canvas");
        const img = avatarsRefArray[idx].current;
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        return canvas.toDataURL("image/jpeg");
    }

    const avatarLoadedHandler = (idx) => {
        if (idx === avatarIdx) {
            const dataURL = getImageUrl(idx);
            const base64image = dataURL.split(',')[1];
            setAvatarImage(base64image);
        }
    }
    const updateAvatarIdxHandler = (idx) => {
        const dataURL = getImageUrl(idx);
        const base64image = dataURL.split(',')[1];
        setAvatarIdx(idx);
        setAvatarImage(base64image);
    }



    const handleDataAvailable = useCallback(
        ({ data }) => {
            if (data.size > 0) {
                setRecordedChunks((prev) => prev.concat(data));
            }
        },
        [setRecordedChunks]
    );

    const handleStartCaptureClick = useCallback(() => {
        setCapturing(true);
        setRecordedEncoded(null);
        setResultVideoAvatar(null);
        mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
            mimeType: "video/webm"
        });
        mediaRecorderRef.current.addEventListener(
            "dataavailable",
            handleDataAvailable
        );
        mediaRecorderRef.current.start();
    }, [webcamRef, setCapturing, mediaRecorderRef, handleDataAvailable]);

    const handleStopCaptureClick = useCallback(() => {
        mediaRecorderRef.current.stop();
        setCapturing(false);
    }, [mediaRecorderRef, setCapturing]);

    const handleDownload = useCallback(() => {
        if (recordedChunks.length) {
            setLoading(true);
            const blob = new Blob(recordedChunks, {
                type: "video/webm"
            });

            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function () {
                var base64data = reader.result;
                var rawBase64Data = base64data.split(',')[1];

                setRecordedEncoded(base64data);

                const data = {
                    avatar: {
                        content: avatarImage
                    },
                    video: {
                        content: rawBase64Data
                    }
                };
                // console.log(avatarImage);
                axios.post('api/v1/avatarify', data)
                    .then(response => {
                        // console.log(response);
                        setResultVideoAvatar(response.data.video.content);
                        setLoading(false);
                    })
                    .catch(error => {
                        setLoading(false);
                        alert('An error ocurred!' + error);
                    })


            }
            setRecordedChunks([]);
        }

    }, [recordedChunks, avatarImage]);

    let video = null;
    if (recordedEncoded) {
        video = (
            <video controls>
                <source type="video/webm" src={recordedEncoded} />
            </video>)
    }

    let avatarVideo = null;
    if (resultVideoAvatar) {
        avatarVideo = (
            <video controls>
                <source type="video/mp4" src={"data:video/mp4;base64," + resultVideoAvatar} />
            </video>)
    }
    const videoConstraints = {
        // width: 1280,
        // height: 720,
        // facingMode: "user",
        frameRate: 30.0
    };

    // React.useEffect(() => {
    //     console.log(avatarsRefArray);
    // }, [])

    const addImageToUrls = (image) => {
        const newAvatarUrls = [...avatarUrls];
        newAvatarUrls.push(image);

        // TODO: How to do thi better?
        avatarsRefArray.push(React.createRef());

        setAvatarUrls(newAvatarUrls);
        setAvatarIdx(newAvatarUrls.length - 1);
    }

    const updateImageObject = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        if (file) {
            reader.readAsDataURL(file);
            reader.onload = () => {
                addImageToUrls(reader.result);
            };
        }
    }
    const getStyleGanAvatar = () => {
        setLoading(true);
        axios.get('api/v1/getAvatar')
            .then(response => {
                const image = "data:image/jpg;base64," + response.data.avatar.content;
                addImageToUrls(image);
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
                alert('An error ocurred!' + error);
            })
    }
    let spinner = null;
    if (loading) {
        spinner = (
            <div>
                <Spinner />
            </div>
        )
    }
    return (
        <>
            <Backdrop show={loading} />
            {spinner}
            <Webcam audio={true} ref={webcamRef} videoConstraints={videoConstraints} />
            <Button variant="contained" component='label'>
                Upload Image
                <input
                    accept="image/jpeg"
                    onChange={(e) => updateImageObject(e)}
                    type="file"
                    style={{ display: 'none' }}
                />
            </Button>
            <Button variant="contained" component='label' onClick={getStyleGanAvatar}>
                Get imaginary avatar
            </Button>
            {capturing ? (
                <Button variant="contained" onClick={handleStopCaptureClick}>Stop Capture</Button>
            ) : (
                    <Button variant="contained" onClick={handleStartCaptureClick}>Start Capture</Button>
                )}
            {recordedChunks.length > 0 && (
                <Button variant="contained" onClick={handleDownload}>Animate Avatar!</Button>
            )}
            {video}
            {avatarVideo}
            <Avatars
                urlList={avatarUrls}
                ref={avatarsRefArray}
                selectedAvatar={avatarIdx}
                clickAvatar={updateAvatarIdxHandler}
                onLoad={avatarLoadedHandler}
            />
            {/* {userAvatar ? <img src={"data:image/jpg;base64," + userAvatar} /> : null} */}
            {/* {avatarImage ? <img src={"data:image/jpg;base64," + avatarImage} /> : null} */}
        </>
    );

};

export default AvatarBuilder;
import { Button, Checkbox, Container, FormControlLabel, Grid, Paper, Typography } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React, { useCallback, useRef, useState } from 'react';
import Webcam from "react-webcam";
import einstein from '../../assets/avatars/einstein.jpg';
import jobs from '../../assets/avatars/jobs.jpg';
import mona from '../../assets/avatars/mona.jpg';
import obama from '../../assets/avatars/obama.jpg';
import potter from '../../assets/avatars/potter.jpg';
import ronaldo from '../../assets/avatars/ronaldo.png';
import jonsnow from '../../assets/avatars/jonsnow.png';
import dani from '../../assets/avatars/dani.png';
import it from '../../assets/avatars/it.png';
import nightking from '../../assets/avatars/nightking.png';
import axios from '../../axios-avatarify';
import Avatars from '../../components/Avatars/Avatars';
import Landing from '../../components/Landing/Landing';
import Backdrop from '../../components/UI/Backdrop/Backdrop';
import Spinner from '../../components/UI/Spinner/Spinner';

const FPS = 30.0;
const AUTO_STOP_TIMEOUT = 8000;
const MAX_WIDTH = 'sm'
const AvatarBuilder = props => {
    const [avatarUrls, setAvatarUrls] = useState([
        einstein,
        jobs,
        mona,
        obama,
        potter,
        ronaldo,
        jonsnow,
        dani,
        it,
        nightking
    ]);
    const [avatarIdx, setAvatarIdx] = useState(0);
    const [avatarImage, setAvatarImage] = useState(null);
    const [capturing, setCapturing] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [resultVideoAvatar, setResultVideoAvatar] = useState(null);
    const [loading, setLoading] = useState(false);

    const [buildAvatar, setBuildAvatar] = useState(false);

    const [mergeInput, setMergeInput] = React.useState(false);
    const mergeInputHandler = (event) => {
        setMergeInput(event.target.checked);
    };
    const [transferFace, setTransferFace] = useState(true);
    const transferFaceHandler = (event) => {
        setTransferFace(event.target.checked);
    };

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

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
        setResultVideoAvatar(null);
        setRecordedChunks([]);

        // Set timeout of X seconds to constrain maximum video duration
        setTimeout(() => {
            const recordingState = mediaRecorderRef.current.state;
            if (recordingState === 'recording') {
                handleStopCaptureClick();
                triggerPopUpMsg(`Maximum record time of ${AUTO_STOP_TIMEOUT / 1000} seconds reached!`, 'warning');
            }
        }, AUTO_STOP_TIMEOUT)

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

    const handleAnimation = useCallback(() => {
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

                const data = {
                    avatar: {
                        content: avatarImage
                    },
                    video: {
                        content: rawBase64Data
                    },
                    fps: FPS,
                    merge: mergeInput,
                    transferFace: transferFace,
                    flip: true
                };
                // console.log(avatarImage);
                axios.post('api/v1/avatarify', data)
                    .then(response => {
                        // console.log(response);
                        setResultVideoAvatar(response.data.video.content);
                        setLoading(false);
                        setRecordedChunks([]);
                    })
                    .catch(error => {
                        setLoading(false);
                        triggerPopUpMsg('An error ocurred! ' + error, 'error');
                    })
            }
        }

    }, [recordedChunks, avatarImage]);

    let avatarVideo = null;
    if (resultVideoAvatar) {
        avatarVideo = (
            <video autoPlay controls style={{ width: "80%", height: "80%" }}>
                <source type="video/mp4" src={"data:video/mp4;base64," + resultVideoAvatar} />
            </video>)
    }
    const videoConstraints = {
        // width: 1280,
        // height: 720,
        // facingMode: "user",
        frameRate: FPS
    };


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
                triggerPopUpMsg('An error ocurred! ' + error, 'error');

            })
    }

    const triggerPopUpMsg = (msg, type) => {
        enqueueSnackbar(msg, {
            variant: type,
            autoHideDuration: 4000,
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'left',
            },
            onClose: (event, reason, key) => {
                if (reason === 'clickaway') {
                    closeSnackbar(key);
                }
            },
            action: key => (
                <Button
                    style={{ color: 'white', 'border': '1px solid #952E18' }}
                    size="small"
                    onClick={() => closeSnackbar(key)}
                >Got it
                </Button>
            ),
        });
    }

    let captureBtnText = "Start recording";
    let captureBtnHandler = handleStartCaptureClick;
    let captureBtnStyle = { backgroundColor: "green" }
    if (capturing) {
        captureBtnText = "Stop recording";
        captureBtnHandler = handleStopCaptureClick;
        captureBtnStyle = { backgroundColor: "salmon" }
    }

    const avatarBuilder = (
        <>
            <Backdrop show={loading}>
                <Spinner />
            </Backdrop>
            <Container fixed style={{ 'marginTop': '10px' }} maxWidth={MAX_WIDTH}>
                <Paper elevation={10}>
                    <Typography variant="h5">Please Select an Image to become alive!</Typography>
                </Paper>
                <Avatars
                    urlList={avatarUrls}
                    ref={avatarsRefArray}
                    selectedAvatar={avatarIdx}
                    clickAvatar={updateAvatarIdxHandler}
                    onLoad={avatarLoadedHandler}
                />
                <Typography variant="h6" style={{ 'marginTop': '10px' }}>
                    ...or upload a custom image or generate a face by an AI
                </Typography>
                <Grid container justify="center" spacing={2} style={{ 'marginTop': '10px', 'marginBottom': '10px' }}>
                    <Grid item>
                        <Button variant="contained" component='label' disabled={loading}>
                            Upload Image
                        <input
                                accept="image/jpeg"
                                onChange={(e) => updateImageObject(e)}
                                type="file"
                                style={{ display: 'none' }}
                            />
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" component='label' onClick={getStyleGanAvatar} disabled={loading}>
                            Get imaginary person
                    </Button>
                    </Grid>
                </Grid>
            </Container>
            <Container fixed style={{ 'marginTop': '10px', 'marginBottom': '10px' }} maxWidth={MAX_WIDTH}>
                <Typography variant="h6" style={{ 'marginTop': '10px', 'marginBottom': '5px' }}>
                    Now record yourself to transfer the motion to the image
                </Typography>
                <Webcam
                    audio={true}
                    ref={webcamRef}
                    videoConstraints={videoConstraints}
                    mirrored
                    style={{
                        width: "80%", height: "80%"
                    }}
                />
                <Grid container justify="center" spacing={2} style={{ 'marginTop': '5px', 'marginBottom': '0px' }}>
                    {/* <Grid item>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={transferFace}
                                    onChange={transferFaceHandler}
                                    color="primary"
                                />
                            }
                            label="Transfer your face"
                        />
                    </Grid> */}
                    <Grid item>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={mergeInput}
                                    onChange={mergeInputHandler}
                                    color="primary"
                                />
                            }
                            label="Show input video after animation"
                        />
                    </Grid>
                </Grid>
                <Grid container justify="center" spacing={2} style={{ 'marginTop': '5px', 'marginBottom': '10px' }}>
                    <Grid item>
                        <Button
                            variant="contained"
                            onClick={captureBtnHandler}
                            disabled={loading}
                            style={captureBtnStyle}
                        >{captureBtnText}</Button>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            onClick={handleAnimation}
                            disabled={!(recordedChunks.length > 0 && avatarImage)}
                        >Animate Image!</Button>
                    </Grid>

                </Grid>
                {avatarVideo}
            </Container>
        </>
    )

    const startAvatarBuilderHandler = () => {
        setBuildAvatar(true);
    }

    const intro = (
        <>
            <Container fixed maxWidth={MAX_WIDTH}>
                <Landing />
                <Typography
                    variant="body1"
                    color="inherit"
                    align="justify"
                    style={{ 'marginTop': '10px', 'marginBottom': '10px' }}
                >
                    This page will allow you to record yourself from the webcamera and choose an image to animate!
                </Typography>
                <Button variant="contained" component='label' onClick={startAvatarBuilderHandler}>
                    Start!
                </Button>
            </Container>
        </>
    )

    return (
        <>
            {buildAvatar ? avatarBuilder : intro}
        </>
    );

};

export default AvatarBuilder;
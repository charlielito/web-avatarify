import React, { useState, useCallback, useEffect, useRef } from 'react';
import Avatars from '../../components/Avatars/Avatars';
import Webcam from "react-webcam";
import axios from 'axios';

const AVATARS_URLS = [
    "https://www.charlielito.ml.s3.us-east-2.amazonaws.com/images/einstein.jpg",
    "https://www.charlielito.ml.s3.us-east-2.amazonaws.com/images/jobs.jpg",
    "https://www.charlielito.ml.s3.us-east-2.amazonaws.com/images/mona.jpg",
    "https://www.charlielito.ml.s3.us-east-2.amazonaws.com/images/obama.jpg",
    "https://www.charlielito.ml.s3.us-east-2.amazonaws.com/images/potter.jpg",
    "https://www.charlielito.ml.s3.us-east-2.amazonaws.com/images/ronaldo.png",
    "https://www.charlielito.ml.s3.us-east-2.amazonaws.com/images/schwarzenegger.png",
];
var canvas = document.createElement("canvas");
canvas.setAttribute('crossorigin', 'anonymous');


const AvatarBuilder = props => {
    const [avatarIdx, setAvatarIdx] = useState(0);
    const [avatarImage, setAvatarImage] = useState(null);

    const webcamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [capturing, setCapturing] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [recordedEncoded, setRecordedEncoded] = useState(null);
    const [resultVideoAvatar, setResultVideoAvatar] = useState(null);

    const updateAvatarIdxHandler = (idx) => {
        setAvatarIdx(idx);
        var img = document.getElementById(idx);

        // canvas.width = img.width;
        // canvas.height = img.height;
        // var ctx = canvas.getContext("2d");
        // ctx.drawImage(img, 0, 0);
        // var dataURL = canvas.toDataURL("image/png");

        var img = new Image();
        img.src = AVATARS_URLS[idx];
        var context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);
        // var dataURL = canvas.toDataURL("image/png");
        // var data = context.getImageData(x, y, 1, 1).data
        // console.log(data);

        // console.log(img);
        // console.log(dataURL);
        const config = {
            // responseType: 'blob',
            responseType: 'arraybuffer'
        };
        axios.get(AVATARS_URLS[idx], config)
            .then(response => {
                const base64img = new Buffer(response.data, 'binary').toString('base64');
                console.log(response);
                console.log(base64img);
                setAvatarImage(base64img);
            })

        // return axios
        //     .get(url, {
        //       responseType: 'arraybuffer'
        //     })
        //     .then(response => new Buffer(response.data, 'binary').toString('base64'))
        // }
    }


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
    }, [webcamRef, setCapturing, mediaRecorderRef]);

    const handleDataAvailable = useCallback(
        ({ data }) => {
            if (data.size > 0) {
                setRecordedChunks((prev) => prev.concat(data));
            }
        },
        [setRecordedChunks]
    );

    const handleStopCaptureClick = useCallback(() => {
        mediaRecorderRef.current.stop();
        setCapturing(false);
    }, [mediaRecorderRef, webcamRef, setCapturing]);

    const handleDownload = useCallback(() => {
        if (recordedChunks.length) {
            const blob = new Blob(recordedChunks, {
                type: "video/webm"
            });
            // console.log(blob);
            // const url = URL.createObjectURL(blob);

            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function () {
                var base64data = reader.result;
                var rawBase64Data = base64data.split(',')[1];
                // console.log(rawBase64Data);
                // console.log(base64data);
                setRecordedEncoded(base64data);

                const config = {
                    // responseType: 'blob',
                    headers: {
                        'Authorization': 'Bearer sisa',
                        'Content-Type': 'application/json'
                    }
                };
                const data = {
                    avatar: {
                        content: avatarImage
                    },
                    video: {
                        content: rawBase64Data
                    }
                };
                axios.post('http://localhost:8008/api/v1/avatarify', data, config)
                    // axios.post('https://avatarify-ejf7gidppa-uc.a.run.app/api/v1/avatarify', data, config)
                    .then(response => {
                        console.log(response);
                        setResultVideoAvatar(response.data["video"]["content"]);
                    })


            }
            setRecordedChunks([]);
        }
    }, [recordedChunks]);

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
    return (
        <>
            <Webcam audio={true} ref={webcamRef} videoConstraints={videoConstraints} />
            {capturing ? (
                <button onClick={handleStopCaptureClick}>Stop Capture</button>
            ) : (
                    <button onClick={handleStartCaptureClick}>Start Capture</button>
                )}
            {recordedChunks.length > 0 && (
                <button onClick={handleDownload}>Download</button>
            )}
            {video}
            {avatarVideo}
            <Avatars
                urlList={AVATARS_URLS}
                selectedAvatar={avatarIdx}
                clickAvatar={updateAvatarIdxHandler}
            />
        </>
    );

};

export default AvatarBuilder;
'use strict';

var videoElement = document.querySelector('video');
var videoSelect = document.querySelector('select#videoSource');

videoSelect.onchange = getStream;

getStream().then(getDevices).then(gotDevices);

function getDevices() {
    return navigator.mediaDevices.enumerateDevices();
}

function gotDevices(deviceInfos) {
    window.deviceInfos = deviceInfos; // make available to console
    console.log('Available input and output devices:', deviceInfos);
    for (const deviceInfo of deviceInfos) {
        const option = document.createElement('option');
        option.value = deviceInfo.deviceId;
        if (deviceInfo.kind === 'videoinput') {
            option.text = deviceInfo.label || `Camera ${videoSelect.length + 1}`;
            videoSelect.appendChild(option);
        }
    }
}

function getStream() {
    if (window.stream) {
        window.stream.getTracks().forEach(track => {
            track.stop();
        });
    }
    const videoSource = videoSelect.value;
    const constraints = {

        video: {
            deviceId: videoSource ? {
                exact: videoSource
            } : undefined
        }
    };
    return navigator.mediaDevices.getUserMedia(constraints).
    then(gotStream).catch(handleError);
}

function gotStream(stream) {
    window.stream = stream;
    videoSelect.selectedIndex = [...videoSelect.options].
    findIndex(option => option.text === stream.getVideoTracks()[0].label);
    videoElement.srcObject = stream;
}

function handleError(error) {
    console.error('Error: ', error);
}

const screenshotButton = document.querySelector("#screenshot-button");
const img = document.querySelector("#screenshot img");
const video = document.querySelector("#video");
const canvas = document.createElement("canvas");

screenshotButton.onclick = video.onclick = function () {

    canvas.width = 240;
    canvas.height = 320;

    if (video.videoWidth > video.videoHeight) {

        let factor = 1.5,
            videoW = factor * video.videoWidth,
            videoH = factor * video.videoHeight;

        canvas.getContext("2d").drawImage(video, 120, 0, videoW, videoH, 0, 0, video.videoWidth, video.videoHeight);

        if (navigator.userAgent.indexOf("Safari") > -1) {

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            canvas.getContext("2d").drawImage(video, 0, 0, video.videoWidth * 2.5, video.videoHeight * 2.5, 0, 0, canvas.width, canvas.height);

        } else {
            canvas.getContext("2d").drawImage(video, 120, 0, videoW, videoH, 0, 0, video.videoWidth, video.videoHeight);
        }

    } else {

        canvas.getContext("2d").drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, canvas.width, canvas.height);
    }

    img.src = canvas.toDataURL("image/webp");
};

function handleSuccess(stream) {
    screenshotButton.disabled = false;
    video.srcObject = stream;
}
'use strict';

const openCamera = document.querySelector("#openCamera");
const closeCamera = document.querySelector("#closeCamera");
const screenshotButton = document.querySelector("#screenshot-button");
const videoSource = document.querySelector("#videoSource");
const img = document.querySelector("#screenshot img");
const video = document.querySelector("#video");
const canvas = document.createElement("canvas");

openCamera.hidden = false;
closeCamera.hidden = true;
screenshotButton.hidden = true;
screenshotButton.hidden = true;
videoSource.hidden = true;

var videoElement = document.querySelector('video');
var videoSelect = document.querySelector('select#videoSource');

function gotStream(stream) {
    window.stream = stream;
    videoSelect.selectedIndex = [...videoSelect.options].findIndex(option => option.text === stream.getVideoTracks()[0].label);
    videoElement.srcObject = stream;
}

function handleError(error) {
    console.error('Error: ', error);
}

openCamera.onclick = function () {

    openCamera.hidden = true;
    closeCamera.hidden = false;
    screenshotButton.hidden = false;
    videoSource.hidden = false;

    videoSelect.onchange = getStream;

    getStream().then(getDevices).then(gotDevices);

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
}

closeCamera.onclick = function () {

    openCamera.hidden = false;
    closeCamera.hidden = true;
    screenshotButton.hidden = true;
    videoSource.hidden = true;

    video.pause();
    video.currentTime = 0;

    videoSelect = '';

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {

        navigator.mediaDevices.getUserMedia({
            video: true
        }).then(function (stream) {
            video.srcObject = null;
        });
    }

}

screenshotButton.onclick = video.onclick = function () {

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var imageObj = new Image();

    imageObj.onload = function () {
        let sourceX = 120,
            sourceY = 0,
            sourceWidth = 240,
            sourceHeight = 320,
            destWidth = sourceWidth,
            destHeight = sourceHeight,
            destX = canvas.width / 2 - destWidth / 2,
            destY = canvas.height / 2 - destHeight / 2;

        if (video.videoWidth > video.videoHeight) {

            let factor = 1.5,
                videoW = factor * sourceWidth,
                videoH = factor * sourceHeight;

            context.drawImage(video, sourceX, sourceY, videoW, videoH, destX, destY, destWidth, destHeight);

        } else {
            context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, destWidth, destHeight);
        }

    };

    imageObj.src = canvas.toDataURL("image/webp");

};

function handleSuccess(stream) {
    screenshotButton.disabled = false;
    video.srcObject = stream;
}
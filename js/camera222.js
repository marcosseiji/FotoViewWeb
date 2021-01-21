function StartWebCam() {


    var width = 240; //320;    // We will scale the photo width to this
    var height = 0; // This will be computed based on the input stream

    var streaming = false;

    var video = null;
    var canvas = null;
    var photo = null;
    var startbutton = null;
    var clearpicturebutton = null;


    function startup() {

        video = document.getElementById('video');
        canvas = document.getElementById('canvas');
        photo = document.getElementById('photo');
        startbutton = document.getElementById('startbutton');
        clearpicturebutton = document.getElementById('clearpicturebutton');

        navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            })
            .then(function (stream) {
                video.srcObject = stream;
                video.play();
            })
            .catch(function (err) {
                console.log("An error occurred when capturing video: " + err);
            });

        video.addEventListener('canplay', function (ev) {
            if (!streaming) {

                video.setAttribute('width', 240);
                video.setAttribute('height', 320);
                canvas.setAttribute('width', 240);
                canvas.setAttribute('height', 320);
                streaming = true;
            }
        }, false);

        startbutton.addEventListener('click', function (ev) {

            takepicture();
            ev.preventDefault();
        }, false);

        clearpicturebutton.addEventListener('click', function (ev) {

            clearphoto();
            ev.preventDefault();
        }, false);

        //clearphoto();
    }

    // Fill the photo with an indication that none has been captured.

    function clearphoto() {
        var context = canvas.getContext('2d');
        context.fillStyle = "#AAA";
        context.fillRect(0, 0, canvas.width, canvas.height);

        var data = canvas.toDataURL('image/png');
        photo.setAttribute('src', data);
    }



    function takepicture() {
        var context = canvas.getContext('2d');

        canvas.width = 240;
        canvas.height = 320;

        var factor = 1.5;

        context.drawImage(video, 140, 0, factor * video.videoWidth, factor * video.videoHeight,
            0, 0, video.videoWidth, video.videoHeight);

        var data = canvas.toDataURL('image/png');
        photo.setAttribute('src', data);

    }


    startup();
}


function StopWebCam() {


    function startup() {

        navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            })
            .then(function (stream) {

                const tracks = stream.getTracks();
                tracks.forEach(function (track) {
                    track.stop();
                });
            })
            .catch(function (err) {
                console.log("An error occurred at stopping video: " + err);
            });
    }
    startup();
}
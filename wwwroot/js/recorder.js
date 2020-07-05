
const mediaSource = new MediaSource();
mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
let mediaRecorder;
let recordedBlobs;
let sourceBuffer;

const recordButton = document.querySelector('button#record');
recordButton.addEventListener('click', () => {
    if (recordButton.textContent === 'Start Recording') {
        startRecording();
    } else {
        stopRecording();
        recordButton.textContent = 'Start Recording';
        downloadButton.disabled = false;
    }
});

const downloadButton = document.querySelector('button#download');

function handleSourceOpen(event) {
    console.log('MediaSource opened');
    sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
    console.log('Source buffer: ', sourceBuffer);
}

function handleDataAvailable(event) {
    console.log('handleDataAvailable', event);
    if (event.data && event.data.size > 0) {
        recordedBlobs.push(event.data);
    }
}

function startRecording() {
    recordedBlobs = [];
    let options = { mimeType: 'video/webm;codecs=vp9' };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.error(`${options.mimeType} is not Supported`);
        options = { mimeType: 'video/webm;codecs=vp8' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            console.error(`${options.mimeType} is not Supported`);
            options = { mimeType: 'video/webm' };
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                console.error(`${options.mimeType} is not Supported`);
                options = { mimeType: '' };
            }
        }
    }

    try {
        mediaRecorder = new MediaRecorder(window.stream, options);
    } catch (e) {
        console.error('Exception while creating MediaRecorder:', e);
        return;
    }

    console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
    recordButton.textContent = 'Stop Recording';
    downloadButton.disabled = true;
    mediaRecorder.onstop = (event) => {
        console.log('Recorder stopped: ', event);
        console.log('Recorded Blobs: ', recordedBlobs);
    };
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start(10); // collect 10ms of data
    console.log('MediaRecorder started', mediaRecorder);
}

function stopRecording() {
    mediaRecorder.stop();
}

function handleSuccess(stream) {
    recordButton.disabled = false;
    console.log('getUserMedia() got stream:', stream);
    window.stream = stream;

    const preview = document.querySelector('video#preview');
    preview.srcObject = stream;
}

async function init(constraints) {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleSuccess(stream);
    } catch (e) {
        console.error('navigator.getUserMedia error:', e);
    }
}

document.querySelector('button#start').addEventListener('click', async () => {
    const hasEchoCancellation = false;
    const constraints = {
        audio: {
            echoCancellation: { exact: hasEchoCancellation }
        },
        video: {
            width: 640, height: 360
        }
    };
    console.log('Using media constraints:', constraints);
    await init(constraints);
});

downloadButton.addEventListener('click', async () => {
    var formData = new FormData();
    const blob = new Blob(recordedBlobs, { type: 'video/webm' });
    formData.append('video-blob', blob);

    let uploadResponse = await fetch('/api/mediasource', {
        method: 'POST',
        body: formData
    });

    let fileName = await uploadResponse.text();
    console.info(fileName);
    let getFileUrlResponse = await fetch(`/api/mediasource/?fileName=${fileName}`);
    if (getFileUrlResponse.ok) {
        let url = await getFileUrlResponse.text();
        console.info(url);
        var node = document.createElement("LI");
        node.innerHTML = `<a href=${url}>${url}</a>`;

        document.getElementById("urls").appendChild(node);
    }

});

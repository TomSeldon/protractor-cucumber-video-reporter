'use strict';

const ScreenRecording = require('./src/ScreenRecording');
const screenRecording = new ScreenRecording({
    baseDirectory: './'
});

screenRecording.start();

setTimeout(() => screenRecording.stop(), 10000);

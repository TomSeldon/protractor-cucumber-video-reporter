'use strict';

const merge = require('merge');
const childProcess = require('child_process');
const path = require('path');

const FFMPEG_COMMAND = 'ffmpeg';
const FFMPEG_ARGS = [
    '-y',                       // Overwrite output files without asking
    '-r', '5',                 // Set frame rate
    '-f', 'avfoundation',            // Set input file type
    //'-video_size', '1024x768',           // Video size: Should we read from Protractor config here?
    '-i', process.env.DISPLAY,  // Input file name, which we point at the configured display
    '-g', '300',                // GOP size is 300 which means one intra frame every 10 seconds for 29.97fps input video
    '-vcodec', 'qtrle'          // Set the video codec to use
];

const DEFAULT_OPTIONS = {
    fileName: 'protractor-report.mov',
    baseDirectory: null
};

/**
 * @type {ScreenRecording}
 */
module.exports = class ScreenRecording {
    /**
     * @param {object=} options
     */

    constructor (options = {}) {
        /**
         * @type {{}}
         * @private
         */
        this._options = merge({}, DEFAULT_OPTIONS, options);

        /**
         * @type {string}
         * @private
         */
        this._videoPath =  path.join(this._options.baseDirectory, this._options.fileName);

        /**
         * @type {?object}
         * @private
         */
        this._ffmpegProcess = null;
    }

    /**
     * Start the screen recording
     */
    start () {
        const ffmpegArgs = this._getFfmpegArguments();

        this._ffmpegProcess = childProcess.spawn(FFMPEG_COMMAND, ffmpegArgs);

        // Output debug and error information
        this._ffmpegProcess.stdout.on('data', data => console.info(data));
        this._ffmpegProcess.stderr.on('data', data => console.error(data.toString()));

        // TODO: Should use callback/promise to notify caller once ffmpeg has started recording. Process started !== recording
    }

    /**
     * Stop the screen recording
     */
    stop () {
        this._ffmpegProcess.kill();

        console.info(`Wrote screen recording to: ${this._videoPath}`);
    }

    /**
     * @returns {Array.<string>}
     * @private
     */
    _getFfmpegArguments () {
        const ffmpegArgs = FFMPEG_ARGS.slice(0, FFMPEG_ARGS.length);

        ffmpegArgs.push(this._videoPath);

        return ffmpegArgs;
    }
};

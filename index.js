const fs = require('fs')
const request = require('request')
const record = require('node-record-lpcm16')
const { Detector, Models } = require('snowboy')
const models = new Models()
const witToken = process.env.WIT_TOKEN

const hotwordThreshold = 1000 // How long silence should be polled before ending recording
let hotwordTimeout = null // Global variable to house setTimeout of command recording
let isRecording = false // If command should be recorded or not

// import keyword models
models.add({
    file: './resources/models/hey.pmdl',
    sensitivity: '0.5',
    hotwords: 'hey'
})

// setup detector and being listening for voice state changes
const detector = new Detector({
    resource: 'resources/common.res',
    models: models,
    audioGain: 2.0,
    applyFrontend: true
})
record.start({
    threshold: 0,
    verbose: false
}).pipe(detector)

detector.on('hotword', (index, hotword, buffer) => {
    console.log('hotword', index, hotword)
    
    // Begin writing audio buffer to wav file and
    // after the hotword is spoken
    isRecording = true
    record.start({
        threshold: 0,
        verbose: false
    }).pipe(request.post({
        'url': 'https://api.wit.ai/speech?client=chromium&lang=en-us&ouput=json',
        'headers': {
            'Accept'        : 'application/vnd.wit.20160202+json',
            'Authorization' : 'Bearer ' + witToken,
            'Content-Type'  : 'audio/wav'
        }
    }, (err, res, body) => {
        if (err) throw err
        console.log(body)
    }))
})

detector.on('silence', () => {
    console.log('silence')

    // Start silence timeout to stop recording of command if
    // recording and the timeout has not already been started
    if (isRecording && !hotwordTimeout) {
        hotwordTimeout = setTimeout(() => {
            console.log('Stopping Recording')
            record.stop()
            isRecording = false
            hotwordTimeout = null
        }, hotwordThreshold)
    }
})

detector.on('sound', (buffer) => {
    console.log('sound')

    // If talking is resumed before the timeout is completed
    // the timeout is reset for the duration of {hotwordThreshhold}
    if (hotwordTimeout) {
        clearTimeout(hotwordTimeout)
        hotwordTimeout = null
    }
})

detector.on('error', (err) => {
    if (err) throw err
})
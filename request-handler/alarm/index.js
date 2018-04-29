// Alarm hanlder module

const Alarm = require('./Alarm.js')

module.exports = (request) => {
    if (!request.entities.datetime) throw "MUST PROVIDE A VALID TIME"

    let opts = new Object()
    let datetime = request.entities.datetime[0].value
    let task = null
    if (request.entities.task) {
        task = request.entities.task[0].value
    }

    let alarm = new Alarm(datetime, task)
    alarm.start()

}
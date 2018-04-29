const Moment = require('../../node_modules/moment')

let Alarm = function (datetime, task) {
    this.datetime = new Date(datetime)
    this.duration = new Date(datetime) - new Date()
    this.task = task
    this.timeout = null
}
Alarm.prototype.__proto__ = EventEmitter.prototype;

Alarm.prototype.start = function () {
    console.log('Alarm started: %s %s', this.task, this.timeLeft())
    this.timeout = setTimeout(() => { this.clear() }, this.duration)
}

Alarm.prototype.clear = function () {
    console.log('Alarm cleared: %s', this.task)
    clearInterval(this.checkTime)
}

Alarm.prototype.timeLeft = function (opts) {
    return Moment(this.datetime).fromNow()
}

Alarm.prototype.isStarted = function () {
    return Boolean(this.timeout)
}

module.exports = Alarm
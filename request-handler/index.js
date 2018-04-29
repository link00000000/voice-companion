// Parser module to be used to handle request

module.exports = (request) => {

    console.log(request)

    // Alarms
    if (request.entities.alarm) { 
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
    if (request.entities.cancel_alarm) {
        
    }
    if (request.entities.check_alarm) {

    }
}
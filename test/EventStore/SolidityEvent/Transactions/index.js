
var _ = require('lodash')

var {
    TruffleEventSchema,
    solidityEventPropertyToObject
} = require('../EventTypes')



const getPropFromSchema = (propType, value) => {
    switch (propType) {
        case 'String': return value.toString()
        case 'Address': return value.toString()
        case 'BigNumber': return value.toNumber()
        default: throw Error(`UNKNOWN propType ${propType} for value '${value}'. Make sure your schema is up to date.`)
    }
}

const eventFromLog = (log) => {
    let schema = TruffleEventSchema[log.event]
    let event = {}
    _.forIn(log.args, (value, key) => {
        let prop = getPropFromSchema(schema[key], value)
        _.extend(event, {
            [key]: prop
        })
    })
    return event
}

const eventsFromTransaction = (tx) => {
    return tx.logs.map((log) => {
        return eventFromLog(log)
    })
}


const transactionEventsToEventObject = (events) => {

    let eventObjs = _.filter(events, (evt) => {
        return evt.Id !== undefined
    })

    eventObjs.forEach((eventObj) => {
        let propIndex = 0;
        while (propIndex < eventObj.PropertyCount) {
            let eventProp = _.find(events, (evt) => {
                return evt.EventPropertyIndex === propIndex && evt.EventIndex === eventObj.Id
            })
            let eventPropObj = solidityEventPropertyToObject(eventProp)
            _.extend(eventObj, eventPropObj)
            propIndex++;
        }
    })
    return eventObjs
}

const transactionToEventCollection = (tx) => {
    let events = eventsFromTransaction(tx)
    let eventCollection = transactionEventsToEventObject(events)
    return eventCollection
}

module.exports = {
    eventsFromTransaction
}

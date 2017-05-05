
import { forIn, extend } from 'lodash'

const { EVENT_SCHEMAS } = require('../EventTypes')

const getPropFromSchema = (propType, value) => {
    switch (propType) {
        case 'String': return value.toString()
        case 'BigNumber': return value.toNumber()
        default: throw Error(`UNKNWON propType for value '${value}'. Make sure your schema is up to date.`)
    }
}

const eventFromLog = (log) => {
    let schema = EVENT_SCHEMAS[log.event]
    let event = {}
    forIn(log.args, (value, key) => {
        let prop = getPropFromSchema(schema[key], value)
        extend(event, {
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

export default {
    eventsFromTransaction
}




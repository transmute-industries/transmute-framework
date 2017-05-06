
import { forIn, extend } from 'lodash'

const { EVENT_SCHEMAS } = require('../EventTypes')

export const LOG = {}
export const TX = {}

/**
 * @param {String} propType - the type of the truffle property
 * @param {ReadModel} readModel - a json object representing the state of a given model
 * @return {Object} the property type without truffle data types (no bid numbers or other truffle types...)
 */
export const getPropFromSchema = (propType, value) => {
    switch (propType) {
        case 'String': return value.toString()
        case 'BigNumber': return value.toNumber()
        default: throw Error(`UNKNWON propType for value '${value}'. Make sure your schema is up to date.`)
    }
}

/**
 * @param {LOG} log - an ethereum log from a transaction
 * @return {NEW_EVENT} a json object representing a solidity NEW_EVENT
 */
export const eventFromLog = (log) => {
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

/**
 * @param {TX} tx - an ethereum log from a transaction
 * @return {NEW_EVENT} an array of all NEW_EVENTS in the transaction tx
 */
export const eventsFromTransaction = (tx) => {
    return tx.logs.map((log) => {
        return eventFromLog(log)
    })
}




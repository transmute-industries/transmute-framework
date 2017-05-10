
import { forIn, extend} from 'lodash'

const { TruffleEventSchema } = require('../EventTypes')

/**
 * @type {Function} getPropFromSchema - convert truffle values by type
 * @param {String} propType - the type of the truffle property
 * @param {Object} readModel - a json object representing the state of a given model
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
 * @type {Function} eventFromLog - create an event from a truffle tx log value
 * @param {LOG} log - an ethereum log from a transaction
 * @return {SOLIDITY_EVENT} a json object representing a solidity SOLIDITY_EVENT
 */
export const eventFromLog = (log) => {
    let schema = TruffleEventSchema[log.event]
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
 * @type {Function} eventsFromTransaction - extract an array of events from a truffle transaction
 * @param {Object} tx - an ethereum log from a transaction
 * @return {Object} an array of all NEW_EVENTS in the transaction tx
 */
export const eventsFromTransaction = (tx) => {
     let allEvents = tx.logs.map((log) => {
        return eventFromLog(log)
    })
    return allEvents
}


/**
* @type {Object} Transactions - helper tools for processing transactions
* @property {getPropFromSchema} getPropFromSchema
* @property {eventFromLog} eventFromLog
* @property {eventsFromTransaction} eventsFromTransaction
*/
export const Transactions = {
    getPropFromSchema,
    eventFromLog,
    eventsFromTransaction
}

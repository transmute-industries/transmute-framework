
import { EventTypes } from '../EventTypes/EventTypes'

const { find, filter, forIn, extend } = require('lodash')

export module Transactions {
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
        let schema = EventTypes.TruffleEventSchema[log.event]
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
    // TODO: Add more rigorous testing of multiple events
    // TODO: Add better error handling here, with instructions to make sure npm run test:all passes...
    export const transactionEventsToEventObject = (events) => {
        let eventObjs = filter(events, (evt: any) => {
            return evt.Id !== undefined
        })
        eventObjs.forEach((eventObj) => {
            let propIndex = 0;
            while (propIndex < eventObj.PropertyCount) {
                let eventProp = find(events, (evt : any) => {
                    return evt.EventPropertyIndex === propIndex && evt.EventIndex === eventObj.Id
                })
                let eventPropObj = EventTypes.solidityEventPropertyToObject(eventProp)
                extend(eventObj, eventPropObj)
                propIndex++;
            }
        })
        return eventObjs
    }

    export const transactionToEventCollection = (tx) => {
        let events = eventsFromTransaction(tx)
        let eventCollection = transactionEventsToEventObject(events)
        return eventCollection
    }
}

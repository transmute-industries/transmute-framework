
import { EventTypes } from '../EventTypes/EventTypes'

const { find, filter, forIn, extend } = require('lodash')

export module Transactions {

    /**
     * @type {Function} eventsFromTransaction - extract an array of events from a truffle transaction
     * @param {Object} tx - an ethereum log from a transaction
     * @return {Object} an array of all NEW_EVENTS in the transaction tx
     */
    export const eventsFromTransaction = (tx) => {
        let allEvents = tx.logs.map((log) => {
            return EventTypes.getEsEventFromEsEventWithTruffleTypes(log.event, log.args)
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
                let eventProp = find(events, (evt: any) => {
                    return evt.EventPropertyIndex === propIndex && evt.EventIndex === eventObj.Id
                })
                let eventPropObj = EventTypes.getTransmuteEventPropertyFromEsEventProperty(eventProp)
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

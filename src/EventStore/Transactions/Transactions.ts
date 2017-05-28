
import { EventTypes } from '../EventTypes/EventTypes'

const { find, filter, forIn, extend } = require('lodash')

export module Transactions {

    export interface ITransaction {
        tx: string;
        receipt: any;
        logs: any[]
    }

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

}

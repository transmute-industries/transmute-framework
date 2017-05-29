
import { EventTypes } from '../EventTypes/EventTypes'

import * as _ from 'lodash'

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

    export const reconstructTransmuteEventsFromTxs = (txs: Array<ITransaction>) =>{
        let esEventsAndEventProps = _.flatten(txs.map(eventsFromTransaction))
        // console.log('esEventsAndEventProps: ', esEventsAndEventProps)
        let esEvents = _.filter(esEventsAndEventProps, (obj) => {
            return obj.Id !== undefined
        })
        // console.log('esEvents: ', esEvents)
        let transmuteEvents = []
        esEvents.forEach((esEvent) =>{
            let esEventProps = _.filter(esEventsAndEventProps, (obj) => {
                return obj.EventIndex === esEvent.Id
            })
            let transmuteEvent = EventTypes.esEventToTransmuteEvent(esEvent, esEventProps)
            transmuteEvents.push(transmuteEvent)
            // console.log('expect well formed event here: ', transmuteEvent)
        })
        return transmuteEvents
    }

}

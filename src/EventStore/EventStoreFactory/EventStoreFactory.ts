'use strict'

import { EventTypes } from '../EventTypes/EventTypes'

export module EventStoreFactory {

    export const createEventStore = async (factory, fromAddress) => {
        let tx = await factory.createEventStore({
            from: fromAddress,
            gas: 2000000
        })
        let events = EventTypes.eventsFromTransaction(tx)
        return {
            events: events,
            tx: tx
        }
    }

    export const getAllEventStoreContractAddresses = async (factory, fromAddress) => {
        let addresses = await factory.getEventStores({
            from: fromAddress
        })
        return addresses
    }

}

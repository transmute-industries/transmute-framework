'use strict'

import { getFSAFromEventArgs } from '../Utils/Common'

export module EventStoreFactory {

    export const createEventStore = async (factory, fromAddress) => {
        let tx = await factory.createEventStore({
            from: fromAddress,
            gas: 2000000
        })

        let fsa = getFSAFromEventArgs(tx.logs[0].args)
        return {
            events: [fsa],
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

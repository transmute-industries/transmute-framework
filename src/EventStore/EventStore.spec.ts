'use strict'

import TransmuteFramework from '../TransmuteFramework'

const { web3, EventStoreContract } = TransmuteFramework.init()

import { assert, expect, should } from 'chai'

import { unMarshalledExpectedEvents, fsaCommands } from './EventStore.mock'

describe.only('EventStore', () => {

    let eventStore

    before(async () => {
        eventStore = await EventStoreContract.deployed()
    })

    unMarshalledExpectedEvents.forEach((unMarshalledExpectedEvent) => {
        describe(unMarshalledExpectedEvent.valueType, () => {
            let eventId
            it('.writeUnmarshalledEsCommand', async () => {
                let tx = await TransmuteFramework.EventStore.writeUnmarshalledEsCommand(eventStore, web3.eth.accounts[0], unMarshalledExpectedEvent)
                assert.lengthOf(tx.logs, 1)
                assert.equal(tx.logs[0].event, 'EsEvent')
                let fsa = TransmuteFramework.EventStore.Common.getFSAFromEventArgs(tx.logs[0].args)
                eventId = fsa.meta.id
            })
            it('.readFSA', async () => {
                let fsa = await TransmuteFramework.EventStore.readFSA(eventStore, web3.eth.accounts[0], eventId)
                assert(fsa.meta.id, eventId)
                // TODO: Add more tests here...
            })
        })
    })

    fsaCommands.forEach((fsac) => {
        describe(fsac.type, () => {
            let eventId
            it('.writeFSA', async () => {
                // console.log(fsac)
            })
        })
    })

})

'use strict'

import TransmuteFramework from '../../TransmuteFramework'

const { web3, EventStoreFactoryContract } = TransmuteFramework.init()

import { expect } from 'chai'

import { EventStoreFactory } from './EventStoreFactory'

describe('EventStoreFactory', () => {

    let factory
    let fromAddress = web3.eth.accounts[0];

    before(async () => {
        factory = await EventStoreFactoryContract.deployed()
    })

    describe('.createEventStore...', () => {
        it('returns a transaction', async () => {
            let { tx, events } = await EventStoreFactory.createEventStore(factory, fromAddress)
            // console.log(events)
            expect(tx.tx !== undefined)
        })

        it('returns a ES_CREATED event', async () => {
            let { tx, events } = await EventStoreFactory.createEventStore(factory, fromAddress)
            expect(events[0].type === 'ES_CREATED')
        })
    })
    describe('.getAllEventStoreContractAddresses...', () => {
        it('should create an event store and return event ', async () => {
            let addresses = await EventStoreFactory.getAllEventStoreContractAddresses(factory, fromAddress)
        })
    })
})

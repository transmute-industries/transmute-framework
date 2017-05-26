'use strict'

import { expect } from 'chai'
import { web3 } from '../env'

import { EventStoreFactory } from './EventStoreFactory'

describe.only('EventStoreFactory', () => {

    let factory
    let fromAddress = web3.eth.accounts[0];

    before(async () => {
        factory = await EventStoreFactory.EventStoreFactoryContract.deployed()
    })

    describe('.createEventStore...', () => {
        it('returns a transaction', async () => {
            let txWithEvents = await EventStoreFactory.createEventStore(factory, fromAddress)
            expect(txWithEvents.tx === undefined)
        })

        it('returns a FACTORY_EVENT_STORE_CREATED event', async () => {
            let txWithEvents = await EventStoreFactory.createEventStore(factory, fromAddress)
            let createEvent = txWithEvents.events[0]
            expect(createEvent.Type === 'FACTORY_EVENT_STORE_CREATED')
        })
    })

    describe('.getAllEventStoreContractAddresses...', () => {
        it('should create an event store and return event ', async () => {
            let addresses = await EventStoreFactory.getAllEventStoreContractAddresses(factory, fromAddress)
        })
    })
})

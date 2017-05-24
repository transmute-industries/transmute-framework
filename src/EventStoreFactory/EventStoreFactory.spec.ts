'use strict'

import { expect } from 'chai'
import { web3 } from '../env'

import { EventStoreFactory } from './EventStoreFactory'

describe('EventStoreFactory', () => {

    let factory
    let fromAddress = web3.eth.accounts[3];

    before(async () => {
        factory = await EventStoreFactory.EventStoreFactoryContract.deployed()
    })

    describe('.createEventStore...', () => {
        it('should create an event store and return event ', async () => {
            let events = await EventStoreFactory.createEventStore(factory, fromAddress)
            let createEvent = events[0]
            expect(createEvent.Type === 'EVENT_STORE_CREATED')
        })
    })

    describe('.getAllEventStoreContractAddresses...', () => {
        it('should create an event store and return event ', async () => {
            let addresses = await EventStoreFactory.getAllEventStoreContractAddresses(factory, fromAddress)
        })
    })
})

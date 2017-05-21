'use strict'

import { expect } from 'chai'
import { web3 } from '../env'

import { EventStoreFactory } from './EventStoreFactory'

describe('EventStore', () => {

    let factory
    let fromAddress = web3.eth.accounts[0];

    before(async () => {
        factory = await EventStoreFactory.EventStoreFactoryContract.deployed()
    })

    describe('.createEventStore...', () => {
        it('should reate an event store and return event ', async () => {
            let events = await EventStoreFactory.createEventStore(factory, fromAddress)
            let createEvent = events[0]
            let auditEvent = events[1]
            expect(createEvent.Type === 'EVENT_STORE_CREATED')
            expect(auditEvent.Type === 'EVENT_STORE_AUDIT_LOG')
        })
    })

    describe('.getAllEventStoreContractAddresses...', () => {
        it('should reate an event store and return event ', async () => {
            let addresses = await EventStoreFactory.getAllEventStoreContractAddresses(factory, fromAddress)
        })
    })
})

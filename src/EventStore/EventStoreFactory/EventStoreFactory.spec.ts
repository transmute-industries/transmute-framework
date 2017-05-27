'use strict'

import { expect } from 'chai'
import { web3 } from '../../env'

import { EventStoreFactory } from './EventStoreFactory'

const eventStoreFactoryArtifacts = require('../../../build/contracts/EventStoreFactory')

const contract = require('truffle-contract')
const EventStoreFactoryContract = contract(eventStoreFactoryArtifacts)
EventStoreFactoryContract.setProvider(web3.currentProvider)

describe('EventStoreFactory', () => {

    let factory
    let fromAddress = web3.eth.accounts[0];

    before(async () => {
        factory = await EventStoreFactoryContract.deployed()
    })

    describe('.createEventStore...', () => {
        it('returns a transaction', async () => {
            let { tx, events } = await EventStoreFactory.createEventStore(factory, fromAddress)
            // console.log(txWithEvents)
            expect(tx.tx !== undefined)
        })

        it('returns a FACTORY_EVENT_STORE_CREATED event', async () => {
            let { tx, events } = await EventStoreFactory.createEventStore(factory, fromAddress)
            expect(events[0].Type === 'FACTORY_EVENT_STORE_CREATED')
        })
    })
    describe('.getAllEventStoreContractAddresses...', () => {
        it('should create an event store and return event ', async () => {
            let addresses = await EventStoreFactory.getAllEventStoreContractAddresses(factory, fromAddress)
        })
    })
})

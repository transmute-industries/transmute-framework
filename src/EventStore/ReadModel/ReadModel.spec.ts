'use strict'

import TransmuteFramework from '../../TransmuteFramework'

const { web3, EventStoreFactoryContract, ReadModel } = TransmuteFramework.init()

import { expect } from 'chai'

// import { EventStoreFactory } from './EventStoreFactory'


import {
    readModel as factoryReadModel,
    reducer as factoryReducer
} from '../Factory/Reducer'

import { assert } from 'chai'


import * as _ from 'lodash'

describe('ReadModel', () => {

    let factory, factoryAddress
    let fromAddress = web3.eth.accounts[0];

    before(async () => {
        factory = await EventStoreFactoryContract.deployed()
        factoryAddress = factory.address
    })

    describe(".readModelGenerator", () => {
        it("should return the initial read model when passed an empty array", () => {
            // This will usually be overidden by the consumer
            factoryReadModel.contractAddress = factoryAddress
            let updatedReadModel = TransmuteFramework.ReadModel.readModelGenerator(factoryReadModel, factoryReducer, [])
            assert(_.isEqual(factoryReadModel, updatedReadModel), 'expected no changes from application of empty event array')
        })

        it("should return an updated read model when passed a non-empty event array", async () => {
            let events = await TransmuteFramework.EventStore.readFSAs(factory, fromAddress, 0)
            // console.log(events)
            let updatedReadModel = TransmuteFramework.ReadModel.readModelGenerator(factoryReadModel, factoryReducer, [events[0]])
            assert.equal(updatedReadModel.lastEvent, 0, 'expected event 0 to have been applied to the read model')
        })

        it("should handle multiple events fine", async () => {
            let events = await TransmuteFramework.EventStore.readFSAs(factory, fromAddress, 0)
            // console.log(events)
            let updatedReadModel = TransmuteFramework.ReadModel.readModelGenerator(factoryReadModel, factoryReducer, events)
            // add some tests here... 
        })
    })

    describe(".maybeSyncReadModel", () => {
        let eventStore
        let updatedReadModel
        let lastEvent
        let fromAddress = web3.eth.accounts[0]

        it("should return the same read model if it is up to date", async () => {
            let updatedReadModel1 = await TransmuteFramework.ReadModel.maybeSyncReadModel(factory, fromAddress, factoryReadModel, factoryReducer)
            let updatedReadModel2 = await TransmuteFramework.ReadModel.maybeSyncReadModel(factory, fromAddress, factoryReadModel, factoryReducer)
            assert(_.isEqual(updatedReadModel1, updatedReadModel2), 'expected no changes when no new events have been saved')
            lastEvent = updatedReadModel2.lastEvent
        })

        it("should return an updated read model when new events have been saved", async () => {
            let { tx, events } = await TransmuteFramework.Factory.createEventStore(factory, fromAddress)
            updatedReadModel = await TransmuteFramework.ReadModel.maybeSyncReadModel(factory, fromAddress, factoryReadModel, factoryReducer)
            assert.equal(updatedReadModel.lastEvent, lastEvent + 1, 'expected 1 more event to have been applied')
        })
    })


    describe('getCachedReadModel', () => {
        it('return returns an update to date read model and reset the cache', async () => {
            let updatedReadModel = await ReadModel.getCachedReadModel(
                factory,
                fromAddress,
                factoryReadModel,
                factoryReducer
            )
            // console.log(updatedReadModel)
            // Todo: Add more tests here...
        })
    })

})

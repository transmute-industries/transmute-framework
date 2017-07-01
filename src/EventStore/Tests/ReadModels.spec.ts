'use strict'

import TransmuteFramework from '../../TransmuteFramework'

const { web3, EventStoreContract } = TransmuteFramework.init()
import { EventTypes } from '../EventTypes/EventTypes'

import { isFSA } from 'flux-standard-action'
import * as _ from 'lodash'

import { assert, expect, should } from 'chai'

import events from '../Mock/Demo/Healthcare/events'
import { reducer, readModel } from '../Mock/Demo/Healthcare/reducer'

describe('EventStore', () => {

    let eventStore

    before(async () => {
        eventStore = await EventStoreContract.deployed()
        readModel.contractAddress = eventStore.address
        readModel.readModelStoreKey = `${readModel.readModelType}:${readModel.contractAddress}`
    })

    describe(".readModelGenerator", () => {
        it("should return the initial read model when passed an empty array", () => {
            // This will usually be overidden by the consumer
            readModel.contractAddress = '0x0000000000000000000000000000000000000000'
            let updatedReadModel = TransmuteFramework.EventStore.readModelGenerator(readModel, reducer, [])
            assert(_.isEqual(readModel, updatedReadModel), 'expected no changes from application of empty event array')
        })

        it("should return an updated read model when passed a non-empty event array", () => {
            let registerEvent = <any>events[0]
            let updatedReadModel = TransmuteFramework.EventStore.readModelGenerator(readModel, reducer, [registerEvent])
            assert.equal(updatedReadModel.lastEvent, 0, 'expected event 0 to have been applied to the read model')
            assert.equal(
                updatedReadModel.model.patient[registerEvent.payload.patientId].patientName,
                registerEvent.payload.patientName,
                'expected patient to be registered'
            )
        })

        it("should handle multiple events fine", () => {
            let updatedReadModel = TransmuteFramework.EventStore.readModelGenerator(readModel, reducer, events)
            // add some tests here maybe... but really just look at the file in temp
            // writeReadModelToFile(updatedReadModel)
        })
    })

    describe(".maybeSyncReadModel", () => {
        let eventStore
        let updatedReadModel: EventTypes.IReadModel
        before(async () => {
            eventStore = await EventStoreContract.deployed()
            let firstEvent = <any>_.omit(events[0], 'meta')
            let txWithEvents = await TransmuteFramework.EventStore.writeTransmuteCommand(eventStore, web3.eth.accounts[0], firstEvent)
            // console.log('txWithEvents: ', txWithEvents)
            let newEvents = txWithEvents.events
            readModel.contractAddress = eventStore.address
            readModel.readModelStoreKey = `${readModel.readModelType}:${readModel.contractAddress}`
            updatedReadModel = TransmuteFramework.EventStore.readModelGenerator(readModel, reducer, newEvents)
            // console.log(updatedReadModel)
        })

        it("should return the same read model if it is up to date", async () => {
            let maybeUpdatedReadModel: EventTypes.IReadModel = await TransmuteFramework.EventStore.maybeSyncReadModel(eventStore, web3.eth.accounts[0], updatedReadModel, reducer)
            assert(_.isEqual(maybeUpdatedReadModel, updatedReadModel), 'expected no changes when no new events have been saved')
        })

        it("should return an updated read model when new events have been saved", async () => {
            let secondEvent = <any>_.omit(events[1], 'meta')
            let txWithEvents = await TransmuteFramework.EventStore.writeTransmuteCommand(eventStore, web3.eth.accounts[0], secondEvent)
            let maybeUpdatedReadModel: EventTypes.IReadModel = await TransmuteFramework.EventStore.maybeSyncReadModel(eventStore, web3.eth.accounts[0], updatedReadModel, reducer)
            // compareReadModels(updatedReadModel, maybeUpdatedReadModel)
            assert.equal(maybeUpdatedReadModel.lastEvent, updatedReadModel.lastEvent + 1, 'expected 1 more event to have been applied')
        })
    })

})

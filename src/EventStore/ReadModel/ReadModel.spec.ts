'use strict'

import TransmuteFramework from '../../transmute-framework'

const { web3, EventStoreFactoryContract, ReadModel } = TransmuteFramework.init()

// import { EventStoreFactory } from './EventStoreFactory'

import { readModel as factoryReadModel, reducer as factoryReducer } from '../Factory/Reducer'

import * as _ from 'lodash'

describe('ReadModel', () => {
  let factory, account_addresses, account, fromAddress

  beforeAll(async () => {
    account_addresses = await TransmuteFramework.getAccounts()
    account = account_addresses[0]
    fromAddress = account
    factory = await EventStoreFactoryContract.deployed()
  })

  describe('.readModelGenerator', () => {
    it('should return the initial read model when passed an empty array', () => {
      // This will usually be overidden by the consumer
      factoryReadModel.contractAddress = factory.address
      let updatedReadModel = TransmuteFramework.ReadModel.readModelGenerator(factoryReadModel, factoryReducer, [])
      expect(_.isEqual(factoryReadModel, updatedReadModel)).toBe(true)
    })

    it('should return an updated read model when passed a non-empty event array', async () => {
      let tx = await factory.createEventStore({
        from: fromAddress,
        gas: 4000000,
      })
      let events = await TransmuteFramework.EventStore.readFSAs(factory, fromAddress, 0)
      // console.log(events)
      let updatedReadModel = TransmuteFramework.ReadModel.readModelGenerator(factoryReadModel, factoryReducer, [
        events[0],
      ])
      expect(updatedReadModel.lastEvent).toEqual(0)
    })

    it('should handle multiple events fine', async () => {
      let events = await TransmuteFramework.EventStore.readFSAs(factory, fromAddress, 0)
      // console.log(events)
      let updatedReadModel = TransmuteFramework.ReadModel.readModelGenerator(factoryReadModel, factoryReducer, events)
      // add some tests here...
    })
  })

  describe('.maybeSyncReadModel', () => {
    let eventStore
    let updatedReadModel
    let lastEvent
    it('should return the same read model if it is up to date', async () => {
      let updatedReadModel1 = await TransmuteFramework.ReadModel.maybeSyncReadModel(
        factory,
        fromAddress,
        factoryReadModel,
        factoryReducer
      )
      let updatedReadModel2 = await TransmuteFramework.ReadModel.maybeSyncReadModel(
        factory,
        fromAddress,
        factoryReadModel,
        factoryReducer
      )
      expect(_.isEqual(updatedReadModel1, updatedReadModel2)).toBe(true)
    })

    it('should return an updated read model when new events have been saved', async () => {
      let updatedReadModel = await TransmuteFramework.ReadModel.maybeSyncReadModel(
        factory,
        fromAddress,
        factoryReadModel,
        factoryReducer
      )
      let { tx, events } = await TransmuteFramework.Factory.createEventStore(factory, fromAddress)
      updatedReadModel = await TransmuteFramework.ReadModel.maybeSyncReadModel(
        factory,
        fromAddress,
        factoryReadModel,
        factoryReducer
      )
      expect(updatedReadModel.lastEvent).toEqual(events[0].meta.id)
    })
  })

  describe('getCachedReadModel', () => {
    it('return returns an update to date read model and reset the cache', async () => {
      let updatedReadModel = await ReadModel.getCachedReadModel(factory, fromAddress, factoryReadModel, factoryReducer)
      // console.log(updatedReadModel)
      // Todo: Add more tests here...
    })
  })
})

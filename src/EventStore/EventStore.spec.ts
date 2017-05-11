'use strict'

import { expect } from 'chai'
import { web3 } from '../env'
import { EventStore } from './EventStore'
import { Persistence } from '../Persistence/Persistence'
import { ReadModel } from './ReadModel/ReadModel'
import {
  initialProjectState,
  projectReducer
} from './Mock/reducer'
import {
  transmuteTestEvent,
  transmuteTestEventStream,
  expectedProjectState
} from './Mock/data'

let es, startEventCount, maybeUpdatedReadModel, initialTestProjectState, expectedTestProjectState

describe('EventStore', () => {

  before(async () => {
    es = await EventStore.ES.deployed()
    startEventCount = (await es.solidityEventCount()).toNumber()

    initialTestProjectState = Object.assign(initialProjectState, {
      ReadModelStoreKey: 'ProjectSummary' + '@' + es.address,
      ReadModelType: 'ProjectSummary',
      ContractAddress: es.address
    })

    expectedTestProjectState = Object.assign(expectedProjectState, {
      ReadModelStoreKey: 'ProjectSummary' + '@' + es.address,
      ReadModelType: 'ProjectSummary',
      ContractAddress: es.address
    })

  })


  describe('.writeEvent', () => {
    it('should write an event and return it ', async () => {
      let event: any = await EventStore.writeEvent(es, transmuteTestEvent, web3.eth.accounts[0])
      expect(event.Type === transmuteTestEvent.Type)
      expect(event.Name === transmuteTestEvent.Name)
    })
  })

  describe('.readEvent', () => {
    it('should return the event at the index', async () => {
      let transmuteEvent: any = await EventStore.readEvent(es, 0)
      expect(transmuteEvent.Type === transmuteTestEvent.Type)
      expect(transmuteEvent.Name === transmuteTestEvent.Name)
    })
  })

  describe('.writeEvents', () => {
    it('should return the events written to the event store', async () => {
      let transmuteEvents = await EventStore.writeEvents(es, transmuteTestEventStream, web3.eth.accounts[0])
      expect(transmuteEvents.length === 3)
    })
  })

  describe('.readEvents', () => {
    it('should return the events in the contract starting with the index', async () => {
      let transmuteEvents = await EventStore.readEvents(es, startEventCount)
      // console.log(transmuteEvents)
      expect(transmuteEvents.length === 4)
    })
  })

  describe('.setItem', () => {
    it('should return the value when passed a valid key, after saving the value', async () => {
      Persistence.setItem(initialTestProjectState.ReadModelStoreKey, initialTestProjectState)
        .then((readModel: any) => {
          expect(initialTestProjectState.ReadModelStoreKey === readModel.ReadModelStoreKey)
          expect(initialTestProjectState.Name === readModel.Name)
        })
    })
  })

  describe('.getItem', () => {
    it('should return null for invalid key', async () => {
      Persistence.getItem('not-a-real-key')
        .then((readModel) => {
          expect(readModel === null)
        })
    })

    it('should return a readModel when passed valid readModelKey', async () => {
      Persistence.getItem(initialTestProjectState.ReadModelStoreKey)
        .then((readModel: any) => {
          expect(initialTestProjectState.ReadModelStoreKey === readModel.ReadModelStoreKey)
          expect(initialTestProjectState.Name === readModel.Name)
        })
    })
  })

  describe('.readModelGenerator', () => {
    it('should return the the initial reducer state when no events exist', async () => {
      let projectModel: any = ReadModel.readModelGenerator(initialTestProjectState, projectReducer, [])
      expect(projectModel.ReadModelStoreKey === initialTestProjectState.ReadModelStoreKey)
      expect(projectModel.LastEvent === initialTestProjectState.LastEvent)
      expect(projectModel.Users === initialTestProjectState.Users)
      expect(projectModel.Milestones === initialTestProjectState.Milestones)
    })

    it('should return the updated read model when passed events', async () => {
      let projectHistory: any = await EventStore.readEvents(es, startEventCount)
      let projectModel: any = ReadModel.readModelGenerator(initialTestProjectState, projectReducer, projectHistory)
      expect(projectModel.ReadModelStoreKey === expectedTestProjectState.ReadModelStoreKey)
      expect(projectModel.Name === expectedTestProjectState.Name)
    })
  })

  describe('maybeSyncReadModel', () => {
    it('should retrieve a read model and sync any missing events from the contract', async () => {
      let _maybeUpdatedReadModel = await ReadModel.maybeSyncReadModel(es, initialTestProjectState, projectReducer)
      maybeUpdatedReadModel = _maybeUpdatedReadModel
    })

    it('should return quickly if no new events exist', async () => {
      let sameReadModel: any = await ReadModel.maybeSyncReadModel(es, maybeUpdatedReadModel, projectReducer)
      expect(sameReadModel.Name === maybeUpdatedReadModel.Name)
      expect(sameReadModel.LastEvent === maybeUpdatedReadModel.LastEvent)
    })
  })
})

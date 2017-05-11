'use strict'

import 'jest';
declare var beforeAll: any
require("babel-core/register");
require("babel-polyfill");

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

  beforeAll(async () => {
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
      expect(event.Type).toBe(transmuteTestEvent.Type)
      expect(event.Name).toBe(transmuteTestEvent.Name)
    })
  })

  describe('.readEvent', () => {
    it('should return the event at the index', async () => {
      let transmuteEvent: any = await EventStore.readEvent(es, 0)
      expect(transmuteEvent.Type).toBe(transmuteTestEvent.Type)
      expect(transmuteEvent.Name).toBe(transmuteTestEvent.Name)
    })
  })

  describe('.writeEvents', () => {
    it('should return the events written to the event store', async () => {
      let transmuteEvents = await EventStore.writeEvents(es, transmuteTestEventStream, web3.eth.accounts[0])
      expect(transmuteEvents.length).toBe(3)
    })
  })

  describe('.readEvents', () => {
    it('should return the events in the contract starting with the index', async () => {
      let transmuteEvents = await EventStore.readEvents(es, startEventCount)
      // console.log(transmuteEvents)
      expect(transmuteEvents.length).toBe(4)
    })
  })

  describe('.setItem', () => {
    it('should return the value when passed a valid key, after saving the value', async () => {
      Persistence.setItem(initialTestProjectState.ReadModelStoreKey, initialTestProjectState)
        .then((readModel: any) => {
          expect(initialTestProjectState.ReadModelStoreKey).toBe(readModel.ReadModelStoreKey)
          expect(initialTestProjectState.Name).toBe(readModel.Name)
        })
    })
  })

  describe('.getItem', () => {
    it('should return null for invalid key', async () => {
      Persistence.getItem('not-a-real-key')
        .then((readModel) => {
          expect(readModel).toBeNull()
        })
    })

    it('should return a readModel when passed valid readModelKey', async () => {
      Persistence.getItem(initialTestProjectState.ReadModelStoreKey)
        .then((readModel: any) => {
          expect(initialTestProjectState.ReadModelStoreKey).toBe(readModel.ReadModelStoreKey)
          expect(initialTestProjectState.Name).toBe(readModel.Name)
        })
    })
  })

  describe('.readModelGenerator', () => {
    it('should return the the initial reducer state when no events exist', async () => {
      let projectModel: any = ReadModel.readModelGenerator(initialTestProjectState, projectReducer, [])
      expect(projectModel.ReadModelStoreKey).toBe(initialTestProjectState.ReadModelStoreKey)
      expect(projectModel.LastEvent).toBe(initialTestProjectState.LastEvent)
      expect(projectModel.Users).toBe(initialTestProjectState.Users)
      expect(projectModel.Milestones).toBe(initialTestProjectState.Milestones)
    })

    it('should return the updated read model when passed events', async () => {
      let projectHistory: any = await EventStore.readEvents(es, startEventCount)
      let projectModel: any = ReadModel.readModelGenerator(initialTestProjectState, projectReducer, projectHistory)
      expect(projectModel.ReadModelStoreKey).toBe(expectedTestProjectState.ReadModelStoreKey)
      expect(projectModel.Name).toBe(expectedTestProjectState.Name)
    })
  })

  describe('maybeSyncReadModel', () => {
    it('should retrieve a read model and sync any missing events from the contract', async () => {
      let _maybeUpdatedReadModel = await ReadModel.maybeSyncReadModel(es, initialTestProjectState, projectReducer)
      maybeUpdatedReadModel = _maybeUpdatedReadModel
    })

    it('should return quickly if no new events exist', async () => {
      let sameReadModel: any = await ReadModel.maybeSyncReadModel(es, maybeUpdatedReadModel, projectReducer)
      expect(sameReadModel.Name).toBe(maybeUpdatedReadModel.Name)
      expect(sameReadModel.LastEvent).toBe(maybeUpdatedReadModel.LastEvent)
    })
  })
})
